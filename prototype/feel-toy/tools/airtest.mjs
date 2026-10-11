// Air on transitions: a test rider in the ramp yard of ?level=block (the kit's K.qp ramps), stepping the physics
// straight (120 Hz, no rendering in between), so the numbers are the same every run.
//   node tools/airtest.mjs [--html /abs/path/index.html]
// 1. pump the 3.6 m halfpipe from rest (standing just under the coping): hold the ollie through each
//    transition, let go just after the lip (a lip pop). Pass: 1.5 m or more above the coping within 4 pumps.
// 2. ride at the 2.4 m quarter pipe at 8 m/s: once just rolling, once pumping it and popping at the lip. Pass: clears the lip.
// 3. high speed: the mega ramp from the roll-in, 30 / 45 m/s into a bench (no tunnelling), a slope landing
//    keeps its speed along the slope, no hidden speed cap.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
const HTML = resolve(opt('--html') || resolve(dirname(fileURLToPath(import.meta.url)), '..', 'index.html'));
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await (await b.newContext({ viewport: { width: 640, height: 400 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + HTML + '?level=block');
await p.waitForFunction(() => window.__toy, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('intro').dispatchEvent(new MouseEvent('click')));
await p.waitForTimeout(600);

const res = await p.evaluate(() => {
  const { S, T, IN, EDGE_IN, GS, step, respawn, terrainH, groundAt, LV } = __toy, Y = LV.yard, dt = 1 / 120, out = {};
  const reset = () => { respawn(); GS.x = GS.y = 0; IN.steer = 0; IN.push = false; IN.ollie = false; IN.brake = false; S.pumps = 0; };
  const put = (x, z, vx, vy, vz, yaw) => { S.pos.set(x, terrainH(x, z), z); S.vel.set(vx, vy, vz); S.yaw = yaw; S.grounded = true; S.n.copy(groundAt(x, z, S.pos.y + 0.1).n); };
  const release = () => { IN.ollie = false; EDGE_IN.ollieUp = true; };
  // the rider's plan on a vert ramp: hold the ollie on the ground, let go just after leaving a lip, crouch again on the way down
  function rideVert(top, maxT, stopAbove) {
    const airs = []; let cur = null, bail = false, vb = 0;
    for (let i = 0; i < maxT * 120; i++) {
      if (S.grounded) { IN.ollie = true; if (cur) { airs.push(cur); cur = null; } }
      else {
        if (!cur) cur = { max: -1e9, pumps: S.pumps || 0, lip: S.lipAir, popped: false, vUp: S.vel.y };
        if (IN.ollie && S.lipAir && S.sinceGround > 0.03) { release(); cur.popped = true; }
        if (!IN.ollie && S.vel.y < -1) IN.ollie = true;
        cur.max = Math.max(cur.max, S.pos.y - top);
      }
      if (S.grounded && Math.abs(S.n.y - 1) < 1e-3) vb = Math.max(vb, S.vel.length());
      step(dt);
      if (S.bail > 0) { bail = true; break; }
      if (airs.length && airs[airs.length - 1].max >= stopAbove) break;
    }
    if (cur) airs.push(cur);
    IN.ollie = false;
    return { airs: airs.filter(a => a.max > -1).map(a => ({ above: +a.max.toFixed(2), pumps: a.pumps, lipPop: a.popped })), bail, vBottomMax: +vb.toFixed(2) };
  }

  // 1. the 3.6 m halfpipe, from rest just under its north coping
  { reset(); const V3 = Y.vert.n, x = Y.vert.x; let z = V3.cop + 0.02; while (terrainH(x, z) > V3.top - 0.15) z += 0.005;
    put(x, z, 0, 0, 0, Math.PI);
    const r = rideVert(V3.top, 30, 1.5), hit = r.airs.find(a => a.above >= 1.5);
    out.pump = { ...r, h: 3.6, R: +V3.R.toFixed(2), pass: !!hit && hit.pumps <= 4 && !r.bail, pumpsToPass: hit ? hit.pumps : null };
    // the same without pumping (just rolling), for comparison
    reset(); put(x, z, 0, 0, 0, Math.PI); let mx = -1e9; for (let i = 0; i < 6 * 120; i++) { step(dt); if (S.pos.z > Y.vert.flat[1]) mx = Math.max(mx, S.pos.y - Y.vert.s.top); }
    out.pump.noPumpBest = +mx.toFixed(2);
  }
  // 2. the 2.4 m quarter pipe at 8 m/s, from the middle of its flat
  for (const mode of ['roll', 'pump+pop']) {
    reset(); const N = Y.normal.n, x = Y.normal.x, z = (Y.normal.flat[0] + Y.normal.flat[1]) / 2 + 1; put(x, z, 0, 0, -8, 0);
    let mx = -1e9, lip = false, popped = false;
    for (let i = 0; i < 3 * 120; i++) {
      if (mode !== 'roll') { if (S.grounded && S.vel.z < 0) IN.ollie = true; else if (IN.ollie && !S.grounded && S.sinceGround > 0.03) { release(); popped = true; } }
      step(dt); if (S.vel.z < 0 || !S.grounded) mx = Math.max(mx, S.pos.y - N.top); if (!S.grounded && S.lipAir) lip = true;
      if (S.grounded && S.vel.z > 0.5 && S.pos.z > N.toe + 1) break;
    }
    IN.ollie = false;
    out['qp2.4 ' + mode] = { above: +mx.toFixed(2), clears: mx > 0.05, offLip: lip, popped, pumps: S.pumps || 0, bail: S.bail > 0 };
  }
  // 3a. the mega ramp: roll in from rest on the 10 m deck, straight at the 8 m quarter pipe
  { reset(); const M = Y.mega, x = 32; put(x, -89.6, 0, 0, -0.5, 0); S.pos.y = 10;
    let vmax = 0, mx = -1e9, landed = null, air = 0;
    for (let i = 0; i < 8 * 120; i++) { IN.ollie = S.grounded && S.pos.z < Y.rollIn.toe; step(dt); vmax = Math.max(vmax, S.vel.length()); if (S.pos.z < M.toe) mx = Math.max(mx, S.pos.y - M.top);
      if (!S.grounded) air += dt; if (air > 0.5 && S.grounded && !landed) landed = { v: +S.vel.length().toFixed(1), y: +S.pos.y.toFixed(1) }; if (S.bail > 0) break; }
    IN.ollie = false;
    out.mega = { vmax: +vmax.toFixed(1), aboveCoping: +mx.toFixed(2), air: +air.toFixed(2), landed, bail: S.bail > 0 };
  }
  // 3b. tunnelling: into the bus-stop bench (0.6 m thick, z 11..11.6) at 30 and 45 m/s; into the 8 m mega deck box from behind at 45 m/s
  out.tunnel = {};
  for (const v of [30, 45]) { reset(); put(7, 6, 0, 0, v, Math.PI); for (let i = 0; i < 60; i++) step(dt); out.tunnel['bench ' + v] = { z: +S.pos.z.toFixed(2), through: S.pos.z > 11.6 }; }
  { reset(); put(32, -110, 0, 0, 0, 0); S.pos.set(32, 4, -126.5); S.vel.set(0, 0, 45); S.grounded = false; for (let i = 0; i < 30; i++) step(dt);
    const M = Y.mega; out.tunnel['mega deck from behind 45 (air)'] = { z: +S.pos.z.toFixed(2), through: S.pos.z > M.cop + 0.2 }; }
  // 3c. a slope landing: fall onto the roll-in (60 degrees at the top, 0 at the toe) moving down it
  { reset(); const x = 32, z = -93; S.pos.set(x, terrainH(x, z) + 0.6, z); S.vel.set(0, -3, -6); S.yaw = 0; S.grounded = false; S.n.set(0, 1, 0);
    let before = null, after = null;
    for (let i = 0; i < 240 && !after; i++) { const v = S.vel.clone(); step(dt); if (S.grounded) { const n = S.n; const vt = v.clone().addScaledVector(n, -v.dot(n)); before = { speed: +v.length().toFixed(2), along: +vt.length().toFixed(2), slope: +(Math.acos(n.y) * 57.3).toFixed(0) }; after = +S.vel.length().toFixed(2); } }
    out.slopeLanding = { ...before, after, bail: S.bail > 0 };
  }
  // 3d. speed: no hidden cap (one step at 35 m/s on the flat; a second of rolling at 30)
  { reset(); put(2, 8, 0, 0, -35, 0); step(dt); const v1 = S.vel.length(); for (let i = 0; i < 119; i++) step(dt);
    reset(); put(2, 8, 0, 0, -30, 0); for (let i = 0; i < 120; i++) { S.pos.set(2, 0, 8); step(dt); }      // (held in place: the block is small)
    out.speed = { after1step35: +v1.toFixed(2), after1s30: +S.vel.length().toFixed(2) }; }
  reset();
  return out;
});
console.log(JSON.stringify(res, null, 1));
const pass = res.pump.pass && res['qp2.4 pump+pop'].clears && !res.tunnel['bench 30'].through && !res.tunnel['bench 45'].through;
console.log(pass ? 'PASS' : 'FAIL', errs.length ? errs : '');
await b.close();
process.exit(pass ? 0 : 1);

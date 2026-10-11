// Ride Porto Alto's gates both ways, and any long routes, with a steering autopilot on the built page.
//   node tools/rides.mjs [--html /abs/page.html] [--routes tools/porto_routes.json] [--depth 40] [--gates id,id|none]
// Each gate is crossed in a straight line from `depth` metres inside one district to `depth` inside
// the other, trying the centre and then lanes either side (a median can sit on the centre line).
// routes.json: [[label, [[x,z],...], speed0, push]]  ridden by following the polyline.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
const html = opt('--html') || join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const routes = opt('--routes') ? JSON.parse(readFileSync(opt('--routes'), 'utf8')) : [];
const depth = +(opt('--depth') || 40), gatesOnly = opt('--gates');
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await (await b.newContext({ viewport: { width: 320, height: 200 } })).newPage();
p.on('pageerror', e => console.log('page error:', e.message));
await p.goto('file://' + html + '?level=porto');
await p.waitForFunction(() => window.__toy, null, { timeout: 300000 });
await p.evaluate(() => document.getElementById('intro')?.click());
const out = await p.evaluate(({ routes, depth, gatesOnly }) => {
  const { S, step, respawn, GS, IN, groundAt, terrainH, LV } = __toy;
  function ride(pts, v0, push, secs) {
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = L[L.length - 1];
    const ptAt = s => { s = Math.min(Math.max(s, 0), total); let i = 1; while (i < L.length - 1 && L[i] < s) i++; const t = (s - L[i - 1]) / (L[i] - L[i - 1] || 1); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t]; };
    let lastS = 0; const proj = (x, z) => { let best = 1e9, bs = 0; for (let i = 1; i < pts.length; i++) { const [ax, az] = pts[i - 1], [bx, bz] = pts[i]; const dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz || 1; const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2)); const s = L[i - 1] + t * Math.sqrt(l2); if (s < lastS - 30) continue; const d = Math.hypot(ax + dx * t - x, az + dz * t - z); if (d < best) { best = d; bs = s; } } lastS = Math.max(lastS, bs); return [bs, best]; };
    respawn(); GS.x = GS.y = 0; IN.steer = 0; IN.push = !!push;
    const [x0, z0] = pts[0], [x1, z1] = ptAt(2), dl = Math.hypot(x1 - x0, z1 - z0);
    S.pos.set(x0, groundAt(x0, z0, terrainH(x0, z0) + 0.5).h + 0.02, z0); S.vel.set((x1 - x0) / dl * v0, 0, (z1 - z0) / dl * v0); S.yaw = Math.atan2(-S.vel.x, -S.vel.z); S.grounded = true;
    let bail = '', vmax = 0, stuck = 0, sEnd = 0, i = 0;
    for (; i < secs * 120; i++) {
      const [s] = proj(S.pos.x, S.pos.z); sEnd = s; if (s > total - 1) break;
      const sp = Math.hypot(S.vel.x, S.vel.z), [tx, tz] = ptAt(s + 4 + sp * 0.4);
      let err = Math.atan2(-(tx - S.pos.x), -(tz - S.pos.z)) - S.yaw; while (err > Math.PI) err -= 2 * Math.PI; while (err < -Math.PI) err += 2 * Math.PI;
      IN.steer = Math.max(-1, Math.min(1, -err * 4));
      step(1 / 120); vmax = Math.max(vmax, sp);
      if (sp < 0.3) stuck += 1 / 120; else stuck = 0;
      if (S.bail > 0) { bail = `BAIL "${__toy.comboText()}" at (${S.pos.x.toFixed(1)},${S.pos.y.toFixed(1)},${S.pos.z.toFixed(1)})`; break; }
      if (stuck > 1.5) { bail = `STUCK at (${S.pos.x.toFixed(1)},${S.pos.y.toFixed(1)},${S.pos.z.toFixed(1)})`; break; }
    }
    IN.push = false; IN.steer = 0;
    for (let k = 0; k < 120 * 6 && S.bail > 0; k++) step(1 / 120);   // let a bail (or a fall in the water) play out before the next ride
    return { ok: !bail && sEnd > total - 2, msg: `${sEnd.toFixed(0)}/${total.toFixed(0)} m, ${(i / 120).toFixed(1)} s, vmax ${(vmax * 3.6).toFixed(0)} km/h ${bail || (sEnd > total - 2 ? 'clean' : 'TIMEOUT')}` };
  }
  const res = []; let pass = 0, n = 0;
  for (const g of LV.PORTO.gates) {
    if (gatesOnly && !gatesOnly.split(',').includes(g.id)) continue;
    const [gx, gz] = g.at, A = LV.PORTO.districts[g.a].rect;
    // which side district a is on, across the border
    const across = g.dir === 'x' ? [0, (A[2] + A[3]) / 2 < gz ? -1 : 1] : [(A[0] + A[1]) / 2 < gx ? -1 : 1, 0];
    const along = g.dir === 'x' ? [1, 0] : [0, 1];
    for (const [from, sgn] of [[g.a, 1], [g.b, -1]]) {
      const offs = [0, -4, 4, -g.w / 2 + 2.5, g.w / 2 - 2.5]; let r, used = 0;
      for (const o of offs) { const c = [gx + along[0] * o, gz + along[1] * o];
        const s = [c[0] + across[0] * depth * sgn, c[1] + across[1] * depth * sgn], e = [c[0] - across[0] * depth * sgn, c[1] - across[1] * depth * sgn];
        r = ride([s, c, e], 5, true, 40); used = o; if (r.ok) break; }
      n++; if (r.ok) pass++;
      res.push(`${r.ok ? 'ok  ' : 'FAIL'} ${g.id.padEnd(12)} from ${from.padEnd(8)} lane ${String(used).padStart(5)}: ${r.msg}`);
    }
  }
  for (const [label, pts, v0, push] of routes) { const r = ride(pts, v0, push, 400); n++; if (r.ok) pass++; res.push(`${r.ok ? 'ok  ' : 'FAIL'} ${label}: ${r.msg}`); }
  res.push(`rides: ${pass}/${n} clean`);
  return res.join('\n');
}, { routes, depth, gatesOnly });
console.log(out); await b.close();

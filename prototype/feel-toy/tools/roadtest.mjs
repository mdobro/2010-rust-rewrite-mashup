// Test the winding roads (P.road, levels/porto/base.js) on a built page.
//   node tools/roadtest.mjs [--html /abs/page.html] [--only heights] [--road "Quarry Lane"] [--shots dir]
// For each road (or the one named): the cross-slope on the straights (at most 2 %) and on the bends (it should match the
// bank), steps along the centre line and the lane lines (sampled every 0.5 m: the jump from the straight line through the
// two neighbours, at most 5 cm), the drawn ground poking through the asphalt (the ribbon sits 4 cm up), and rides down it
// with a simple steering autopilot (three lanes; bails counted). With --shots: an aerial and a rider's-eye view of each road.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
const html = opt('--html') || join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const ONLY = opt('--only'), ROAD = opt('--road'), SHOTS = opt('--shots');
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await (await b.newContext({ viewport: { width: 960, height: 600 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
p.on('console', m => { const t = m.text(); if (t.startsWith('P.road')) console.log(t); });
const t0 = Date.now();
await p.goto('file://' + html + '?level=porto' + (ONLY ? '&only=' + ONLY : ''));
await p.waitForFunction(() => window.__toy, null, { timeout: 300000 });
const loadS = (Date.now() - t0) / 1000;
await p.evaluate(() => document.getElementById('intro').dispatchEvent(new MouseEvent('click')));
await p.waitForTimeout(300);
const names = await p.evaluate(want => (__toy.LV.roads || []).map(r => r.name).filter(n => !want || n === want), ROAD);
console.log(`load ${loadS.toFixed(1)} s, ${names.length} road(s)${errs.length ? ', errors: ' + errs.join('; ') : ''}`);
let fails = 0;
for (const name of names) {
  const out = await p.evaluate(name => {
    const { LV, terrainH, THREE, scene, S, step, respawn, GS, IN, groundAt } = __toy, r = LV.roads.find(q => q.name === name), res = [];
    const pt = (s, lat) => { const a = r.at(s); return [a.x - a.tz * lat, a.z + a.tx * lat, a]; };
    // 1. cross-slope, measured 0.5 m in from each edge of the carriageway, every 2 m
    const lw = r.hw - 0.5; let straight = 0, bendErr = 0, bendMax = 0, nS = 0, nB = 0, at1 = '', at2 = '';
    for (let s = 1; s < r.L - 1; s += 2) {
      const [lx, lz, a] = pt(s, lw), [rx, rz] = pt(s, -lw), cs = (terrainH(lx, lz) - terrainH(rx, rz)) / (2 * lw);
      if (Math.abs(a.k) < 1e-4 && Math.abs(a.bank) < 0.005) { nS++; if (Math.abs(cs) > straight) { straight = Math.abs(cs); at1 = `s ${s}`; } }
      else { nB++; bendMax = Math.max(bendMax, Math.abs(cs)); if (Math.abs(cs - a.bank) > bendErr) { bendErr = Math.abs(cs - a.bank); at2 = `s ${s} (bank ${(a.bank * 100).toFixed(1)} %, measured ${(cs * 100).toFixed(1)} %)`; } }
    }
    const okX = straight <= 0.02 && bendErr <= 0.01;
    res.push(`${okX ? 'ok  ' : 'FAIL'} cross-slope: straights (${nS} samples) max ${(straight * 100).toFixed(2)} % at ${at1}; bends (${nB}) up to ${(bendMax * 100).toFixed(1)} %, off the bank by at most ${(bendErr * 100).toFixed(2)} % at ${at2}`);
    // 2. seams: every 0.5 m along the centre and both lane lines, the jump off the line through the neighbours
    let seam = 0, seamAt = '', stepMax = 0, grade = 0;
    for (const lat of [0, r.hw * 0.6, -r.hw * 0.6]) { let y0 = null, y1 = null;
      for (let s = 0; s <= r.L; s += 0.5) { const [x, z] = pt(s, lat), y = terrainH(x, z);
        if (y1 !== null) { stepMax = Math.max(stepMax, Math.abs(y - y1)); grade = Math.max(grade, Math.abs(y - y1) / 0.5); }
        if (y0 !== null) { const j = Math.abs(y1 - (y0 + y) / 2); if (j > seam) { seam = j; seamAt = `s ${(s - 0.5).toFixed(1)} lat ${lat.toFixed(1)}`; } }
        y0 = y1; y1 = y; } }
    const okS = seam <= 0.05;
    res.push(`${okS ? 'ok  ' : 'FAIL'} seams: largest kink ${(seam * 100).toFixed(1)} cm (at ${seamAt}); largest 0.5 m step ${(stepMax * 100).toFixed(1)} cm (steepest grade ${(grade * 100).toFixed(1)} %)`);
    // 3. the drawn ground under the asphalt: where does it come up through the 4 cm ribbon?
    const grounds = []; scene.traverse(o => { if (o.isMesh && o.material && o.material.vertexColors && o.material.map && o.geometry.index && o.geometry.attributes.color) grounds.push(o); });
    const rc = new THREE.Raycaster(); let poke = 0, pokeAt = '', np = 0, sh = 0, shAt = '';
    for (let s = 0; s <= r.L; s += 1) for (const lat of [-r.hw, -r.hw / 2, 0, r.hw / 2, r.hw, r.hw + r.sw + 2, -r.hw - r.sw - 2, r.hw + r.sw + 7, -r.hw - r.sw - 7]) {
      const [x, z] = pt(s, lat); rc.set(new THREE.Vector3(x, 400, z), new THREE.Vector3(0, -1, 0)); const hit = rc.intersectObjects(grounds, false)[0]; if (!hit) continue;
      const d = hit.point.y - terrainH(x, z);
      if (Math.abs(lat) <= r.hw) { np++; if (d > poke) { poke = d; pokeAt = `s ${s} lat ${lat}`; } } else if (d > sh) { sh = d; shAt = `s ${s} lat ${lat.toFixed(1)}`; } }
    const okP = poke < 0.04;
    res.push(`${okP ? 'ok  ' : 'FAIL'} asphalt: the drawn ground comes at most ${(poke * 100).toFixed(1)} cm over the ridden road (${np} points; the ribbon is 4 cm up)${pokeAt ? ' at ' + pokeAt : ''}; on the shoulders the drawn ground is at most ${(sh * 100).toFixed(1)} cm over the ridden ground${shAt ? ' at ' + shAt : ''}`);
    // 4. ride it top to bottom: steer at a point ahead on the line, three lanes
    const top = r.S.prof[0] >= r.S.prof[r.N - 1], s0 = top ? 0 : r.L, dir = top ? 1 : -1;
    let bails = 0; const rides = [];
    for (const lane of [0, -r.hw / 2, r.hw / 2]) {
      respawn(); GS.x = GS.y = 0; IN.steer = 0; IN.push = false;
      const [x0, z0, a0] = pt(s0 + dir * 2, lane * dir); const v0 = 5;
      S.pos.set(x0, groundAt(x0, z0, terrainH(x0, z0) + 0.5).h + 0.02, z0); S.vel.set(a0.tx * dir * v0, 0, a0.tz * dir * v0); S.yaw = Math.atan2(-S.vel.x, -S.vel.z); S.grounded = true;
      let sAlong = s0 + dir * 2, bail = '', vmax = 0, i = 0, stuck = 0, off = 0;
      for (; i < 120 * 180; i++) {
        // where we are along the road (search near the last position), and how far off the lane
        let best = 1e9, bs = sAlong; for (let s = sAlong - 6; s <= sAlong + 6; s += 0.25) { const q = r.at(clamp(s, 0, r.L)); const d = Math.hypot(q.x - S.pos.x, q.z - S.pos.z); if (d < best) { best = d; bs = s; } }
        sAlong = clamp(bs, 0, r.L); { const [lx, lz] = pt(sAlong, lane * dir); off = Math.max(off, Math.hypot(lx - S.pos.x, lz - S.pos.z)); }
        if (dir > 0 ? sAlong > r.L - 3 : sAlong < 3) break;
        const sp = Math.hypot(S.vel.x, S.vel.z), [tx, tz] = pt(clamp(sAlong + dir * (4 + sp * 0.4), 0, r.L), lane * dir);
        let err = Math.atan2(-(tx - S.pos.x), -(tz - S.pos.z)) - S.yaw; while (err > Math.PI) err -= 2 * Math.PI; while (err < -Math.PI) err += 2 * Math.PI;
        IN.steer = Math.max(-1, Math.min(1, -err * 4));
        step(1 / 120); vmax = Math.max(vmax, sp);
        if (sp < 0.3) stuck += 1 / 120; else stuck = 0;
        if (S.bail > 0) { bail = `BAIL "${__toy.comboText()}" at s ${sAlong.toFixed(0)} (${S.pos.x.toFixed(1)},${S.pos.y.toFixed(1)},${S.pos.z.toFixed(1)})`; break; }
        if (stuck > 1.5) { bail = `STUCK at s ${sAlong.toFixed(0)}`; break; }
      }
      IN.steer = 0; for (let k = 0; k < 120 * 6 && S.bail > 0; k++) step(1 / 120);
      if (bail) bails++;
      rides.push(`lane ${lane.toFixed(0).padStart(2)}: ${(i / 120).toFixed(1)} s, vmax ${(vmax * 3.6).toFixed(0)} km/h, at most ${off.toFixed(1)} m off the lane line, ${bail || 'clean'}`);
    }
    respawn();
    res.push(`${bails ? 'FAIL' : 'ok  '} rides down (${r.L.toFixed(0)} m, ${(r.S.prof[0] - r.S.prof[r.N - 1]).toFixed(1)} m drop): ${bails} bail(s)\n        ` + rides.join('\n        '));
    function clamp(v, a, c) { return Math.max(a, Math.min(c, v)); }
    return { text: res.join('\n'), fails: [okX, okS, okP, !bails].filter(v => !v).length };
  }, name);
  console.log(`${name}:\n  ${out.text.split('\n').join('\n  ')}`); fails += out.fails;
  if (SHOTS) {
    mkdirSync(SHOTS, { recursive: true });
    const views = await p.evaluate(name => {
      for (const e of document.querySelectorAll('body > *')) if (e.tagName !== 'CANVAS' && e.tagName !== 'SCRIPT') e.style.display = 'none';
      const { LV } = __toy, r = LV.roads.find(q => q.name === name), [x0, x1, z0, z1] = r.bbox, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, span = Math.max(x1 - x0, z1 - z0);
      const y = __toy.terrainH(cx, cz), top = r.S.prof[0] >= r.S.prof[r.N - 1], s = top ? r.L * 0.12 : r.L * 0.88, dir = top ? 1 : -1, a = r.at(s), b = r.at(s + dir * 30);
      LV.cullDist = 0;
      return [['aerial', [cx, y + span * 0.85, cz + span * 0.45], [cx, y, cz]], ['rider', [a.x, a.y + 2.0, a.z], [b.x, b.y + 0.6, b.z]]];
    }, name);
    for (const [v, pos, at] of views) {
      await p.evaluate(([pos, at]) => { window.__camOverride = { pos, at }; const { scene } = __toy, d = Math.hypot(pos[0] - at[0], pos[1] - at[1], pos[2] - at[2]);
        scene.fog.near = Math.max(scene.fog.near, d * 0.9); scene.fog.far = Math.max(scene.fog.far, d * 2.2);
        scene.traverse(o => { if (o.isMesh && o.geometry && o.geometry.boundingSphere && !o.parent?.isGroup) o.visible = true; }); }, [pos, at]);
      await p.waitForTimeout(800);
      const f = `${SHOTS}/road_${name.replace(/\W+/g, '_')}_${v}.png`; await p.screenshot({ path: f }); console.log(`  screenshot ${f}`);
    }
  }
}
console.log(fails ? `roadtest: ${fails} check(s) failed` : 'roadtest: all ok');
await b.close();
process.exit(fails ? 1 : 0);

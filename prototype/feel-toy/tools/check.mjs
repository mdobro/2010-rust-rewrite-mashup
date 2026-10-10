// Load a built page headless and check a Porto Alto district (or the whole map).
//   node tools/check.mjs --html /path/x.html [--only fin] [--shots outdir] [--rides '<json>'] [--views '<json>']
// Prints: load time and errors; counts; with --only: the contract (everything inside the rectangle,
// the border band at the base height, gates open and rideable both ways) and a sink scan; with --shots:
// an aerial and four oblique views of the district (plus any --views [[name,[x,y,z],[lookx,looky,lookz]],...]).
// --rides: [[label, [x,y,z], [vx,vy,vz], seconds, 'push'?], ...] physics runs, reported like megaride.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
const HTML = opt('--html'), ONLY = opt('--only'), SHOTS = opt('--shots'), RIDES = opt('--rides'), VIEWS = opt('--views'), LEVEL = opt('--level') || 'porto';
if (!HTML) { console.error('usage: node tools/check.mjs --html page.html [--only id] [--shots dir] [--rides json] [--views json]'); process.exit(2); }
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await (await b.newContext({ viewport: { width: 960, height: 600 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' '))); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
const url = 'file://' + HTML + `?level=${LEVEL}` + (ONLY ? `&only=${ONLY}` : '');
const t0 = Date.now();
await p.goto(url);
try { await p.waitForFunction(() => window.__toy, null, { timeout: 180000 }); }
catch (e) { console.log('FAILED TO LOAD in 180 s'); console.log(errs.join('\n')); await b.close(); process.exit(1); }
const loadS = (Date.now() - t0) / 1000;
await p.evaluate(() => { document.getElementById('intro')?.click(); });
await p.waitForTimeout(500);
const out = [];
out.push(`load ${loadS.toFixed(1)} s, errors: ${errs.length ? '\n  ' + errs.join('\n  ') : 'none'}`);

// counts
out.push(await p.evaluate(() => {
  const { LV, BOXES, RAILS, scene } = __toy; let meshes = 0, tris = 0;
  scene.traverse(o => { if (o.isMesh && o.geometry) { meshes++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; } });
  const bld = BOXES.filter(b => b.mat === 'building').length;
  return `built: ${LV.built ? LV.built.join(', ') || '(none)' : '-'}\ncounts: ${BOXES.length} boxes (${bld} buildings), ${LV.hubbas.length} sloped blocks, ${RAILS.length} grind lines, ${LV.hazards.length} hazards, ${(LV.challenges || []).length} challenges, ${(LV.tapes || []).length} tapes, ${(LV.npcs || []).length} skaters, ${(LV.traffic || []).length} traffic routes, ${(LV.districts || []).length} travel points\nscene: ${meshes} meshes, ${(tris / 1e3).toFixed(0)}k triangles`;
}));

if (ONLY) out.push(await p.evaluate(id => {
  const { LV, BOXES, RAILS, terrainH, groundAt, S, step, respawn, GS, IN } = __toy, P = LV.PORTO, r = P.districts[id].rect, [X0, X1, Z0, Z1] = r, res = [];
  const outside = (x, z, pad = 0.5) => x < X0 - pad || x > X1 + pad || z < Z0 - pad || z > Z1 + pad;
  // 1. everything inside the rectangle
  const badB = BOXES.filter(b => outside(b.min[0], b.min[2]) || outside(b.max[0], b.max[2]));
  const badH = LV.hubbas.filter(h => outside(h.a.x, h.a.z) || outside(h.b.x, h.b.z));
  const badR = RAILS.filter(rl => outside(rl.a.x, rl.a.z) || outside(rl.b.x, rl.b.z));
  res.push(`inside the rectangle: ${badB.length + badH.length + badR.length ? `NO: ${badB.length} boxes, ${badH.length} sloped blocks, ${badR.length} rails outside; e.g. ${[...badB.slice(0, 3).map(b => `box ${b.min.map(v => v.toFixed(0))}..${b.max.map(v => v.toFixed(0))}`), ...badH.slice(0, 2).map(h => `hubba ${h.a.x.toFixed(0)},${h.a.z.toFixed(0)}`), ...badR.slice(0, 2).map(rl => `rail ${rl.a.x.toFixed(0)},${rl.a.z.toFixed(0)}`)].join('; ')}` : 'ok'}`);
  // 2. the border band: at a border with another district, the ground must be the base height
  const [BX0, BX1, BZ0, BZ1] = P.bounds, worst = [];
  const edges = [];
  if (X0 > BX0) edges.push(t => [X0 + 0.5, lerp(Z0, Z1, t)]); if (X1 < BX1) edges.push(t => [X1 - 0.5, lerp(Z0, Z1, t)]);
  if (Z0 > BZ0) edges.push(t => [lerp(X0, X1, t), Z0 + 0.5]); if (Z1 < BZ1) edges.push(t => [lerp(X0, X1, t), Z1 - 0.5]);
  function lerp(a, b, t) { return a + (b - a) * t; }
  for (const e of edges) for (let i = 0; i <= 400; i++) { const [x, z] = e(i / 400), d = terrainH(x, z) - LV.baseH(x, z); if (Math.abs(d) > 0.05) worst.push([d, x, z]); }
  worst.sort((a, c) => Math.abs(c[0]) - Math.abs(a[0]));
  res.push(`border band at base height: ${worst.length ? `NO at ${worst.length} points, worst ${worst.slice(0, 4).map(([d, x, z]) => `${d.toFixed(2)} m at (${x.toFixed(0)},${z.toFixed(0)})`).join(', ')}` : 'ok'}`);
  // 3. gates: open (nothing solid standing up in the corridor) and rideable through, both ways
  for (const g of P.gates.filter(g => g.a === id || g.b === id)) {
    const [gx, gz] = g.at, hw = g.w / 2, dd = P.GATE_DEPTH, gy = terrainH(gx, gz);
    const [x0, x1, z0, z1] = g.dir === 'x' ? [gx - hw, gx + hw, gz - dd, gz + dd] : [gx - dd, gx + dd, gz - hw, gz + hw];
    const block = BOXES.filter(b => b.max[0] > x0 && b.min[0] < x1 && b.max[2] > z0 && b.min[2] < z1 && b.max[1] > terrainH((Math.max(b.min[0], x0) + Math.min(b.max[0], x1)) / 2, (Math.max(b.min[2], z0) + Math.min(b.max[2], z1)) / 2) + 0.3 && b.mat !== 'glass');
    let rides = [];
    for (const sgn of [1, -1]) for (const off of [-hw * 0.5, 0, hw * 0.5]) {
      // start 22 m back from the border, roll across it at 7 m/s pushing, for 5 s
      const ax = g.dir === 'x' ? gx + off : gx - sgn * 22, az = g.dir === 'x' ? gz - sgn * 22 : gz + off;
      const vx = g.dir === 'x' ? 0 : sgn * 7, vz = g.dir === 'x' ? sgn * 7 : 0;
      respawn(); GS.x = GS.y = 0; IN.steer = 0; IN.push = true;           // pushing, so uphill gates get ridden too
      S.pos.set(ax, groundAt(ax, az, terrainH(ax, az) + 0.5).h + 0.02, az); S.vel.set(vx, 0, vz); S.yaw = Math.atan2(-vx, -vz); S.grounded = true;
      let bail = ''; for (let i = 0; i < 600; i++) { step(1 / 120); if (S.bail > 0 && !bail) bail = document.querySelector('#combo .name').textContent || 'bail'; }
      IN.push = false;
      const crossed = g.dir === 'x' ? (S.pos.z - gz) * sgn > 4 : (S.pos.x - gx) * sgn > 4;
      if (!crossed || bail) rides.push(`${sgn > 0 ? '+' : '-'}${g.dir === 'x' ? 'z' : 'x'} off ${off.toFixed(0)}: ${bail ? 'bail "' + bail + '"' : 'stopped'} at (${S.pos.x.toFixed(0)},${S.pos.y.toFixed(1)},${S.pos.z.toFixed(0)})`);
    }
    res.push(`gate ${g.id} (${g.name}) at (${gx},${gz}) y ${gy.toFixed(1)}: ${block.length ? `BLOCKED by ${block.length} boxes, e.g. ${block.slice(0, 2).map(b => b.min.map(v => v.toFixed(0)) + '..' + b.max.map(v => v.toFixed(0))).join('; ')}; ` : ''}${rides.length ? 'rides: ' + rides.join('; ') : block.length ? '' : 'ok'}`);
  }
  respawn();
  return res.join('\n');
}, ONLY));

if (ONLY) out.push(await p.evaluate(id => { // the sink scan: drawn ground standing above where you ride
  const { THREE, scene, groundAt, LV } = __toy, [X0, X1, Z0, Z1] = LV.PORTO.districts[id].rect, rc = new THREE.Raycaster(), grounds = [];
  scene.traverse(o => { if (o.isMesh && o.material && o.material.vertexColors && o.material.map && o.geometry.index && o.geometry.attributes.color) grounds.push(o); });
  for (const m of grounds) m.visible = true;
  const worst = []; let n = 0;
  for (let x = X0 + 2; x <= X1 - 2; x += 6) for (let z = Z0 + 2; z <= Z1 - 2; z += 6) {
    const g = groundAt(x, z, 200).h; rc.set(new THREE.Vector3(x, 300, z), new THREE.Vector3(0, -1, 0)); const hit = rc.intersectObjects(grounds, false)[0]; if (!hit) continue; n++;
    const d = hit.point.y - g; if (d > 0.05) worst.push([d, x, z]); }
  worst.sort((a, b) => b[0] - a[0]);
  return `sink scan (${n} points every 6 m): ${worst.length ? `${worst.length} points where the drawn ground is over 5 cm above the ridden surface, worst ${worst.slice(0, 6).map(([d, x, z]) => `${(d * 100).toFixed(0)} cm at (${x},${z})`).join(', ')}` : 'ok'}`;
}, ONLY));

if (RIDES) out.push(await p.evaluate(cases => { const { S, step, respawn, GS, IN, groundAt, terrainH } = __toy; const res = [];
  for (const [label, pos, vel, secs, mode] of cases) {
    respawn(); GS.x = GS.y = 0; IN.steer = 0; IN.push = mode === 'push';
    S.pos.set(pos[0], groundAt(pos[0], pos[2], Math.max(pos[1], terrainH(pos[0], pos[2])) + 0.5).h + 0.02, pos[2]);
    S.vel.set(...vel); S.yaw = Math.atan2(-vel[0], -vel[2]); S.grounded = true;
    let maxY = -1e9, minY = 1e9, air = 0, vmax = 0, bail = '', tricks = new Set();
    for (let i = 0; i < secs * 120; i++) {
      step(1 / 120); maxY = Math.max(maxY, S.pos.y); minY = Math.min(minY, S.pos.y); vmax = Math.max(vmax, Math.hypot(S.vel.x, S.vel.z));
      if (!S.grounded && !S.rail) air += 1 / 120;
      if (S.bail > 0 && !bail) bail = ` BAIL "${document.querySelector('#combo .name').textContent}" at (${S.pos.x.toFixed(1)},${S.pos.y.toFixed(1)},${S.pos.z.toFixed(1)}) t=${(i / 120).toFixed(2)}`;
      const ct = __toy.comboText(); if (ct) tricks.add(ct);
    }
    IN.push = false;
    res.push(`${label.padEnd(34)} y ${minY.toFixed(1)}..${maxY.toFixed(1)} air ${air.toFixed(2)}s vmax ${vmax.toFixed(1)} end (${S.pos.x.toFixed(1)},${S.pos.y.toFixed(1)},${S.pos.z.toFixed(1)}) v ${Math.hypot(S.vel.x, S.vel.z).toFixed(1)}${tricks.size ? ' combo ' + [...tricks].join(' / ') : ''}${bail}`);
  }
  respawn(); return 'rides:\n' + res.join('\n'); }, JSON.parse(RIDES)));

if (SHOTS) {
  mkdirSync(SHOTS, { recursive: true });
  await p.evaluate(() => {
    for (const e of document.querySelectorAll('body > *')) if (e.tagName !== 'CANVAS' && e.tagName !== 'SCRIPT') e.style.display = 'none';
    // high views: push the fog and the far-scenery cut out so the whole district shows
    const { scene, LV } = __toy; window.__shotFog = [scene.fog.near, scene.fog.far]; LV.cullDist = 0;
  });
  const views = [];
  const id = ONLY;
  if (id) {
    const r = await p.evaluate(id => __toy.LV.PORTO.districts[id].rect, id), [X0, X1, Z0, Z1] = r, cx = (X0 + X1) / 2, cz = (Z0 + Z1) / 2, span = Math.max(X1 - X0, Z1 - Z0);
    const y = await p.evaluate(([x, z]) => __toy.terrainH(x, z), [cx, cz]);
    views.push([`${id}_aerial`, [cx, y + span * 0.75, cz + span * 0.42], [cx, y, cz]]);
    for (const [nm, sx, sz] of [['nw', -1, -1], ['ne', 1, -1], ['sw', -1, 1], ['se', 1, 1]])
      views.push([`${id}_${nm}`, [cx + sx * (X1 - X0) * 0.55, y + span * 0.3, cz + sz * (Z1 - Z0) * 0.55], [cx - sx * (X1 - X0) * 0.1, y, cz - sz * (Z1 - Z0) * 0.1]]);
  }
  if (VIEWS) views.push(...JSON.parse(VIEWS));
  for (const [name, pos, at] of views) {
    await p.evaluate(([pos, at]) => { window.__camOverride = { pos, at }; const { camera, scene } = __toy; camera.position.set(...pos);
      const d = Math.hypot(pos[0] - at[0], pos[1] - at[1], pos[2] - at[2]), [n, f] = window.__shotFog;
      scene.fog.near = Math.max(n, d * 0.9); scene.fog.far = Math.max(f, d * 2.2);
      scene.traverse(o => { if (o.isMesh && o.geometry && o.geometry.boundingSphere && !o.parent?.isGroup) o.visible = true; }); }, [pos, at]);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${SHOTS}/${name}.png` });
  }
  out.push(`screenshots: ${views.map(v => v[0]).join(', ')} in ${SHOTS}`);
}
console.log(out.join('\n'));
if (errs.length) console.log('late errors:\n  ' + errs.join('\n  '));
await b.close();

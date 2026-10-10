/* The Heights, the Switchback part: Ridge Road x -420..100, Reservoir Lane's east end, the Ridgeline Lookout, the Radio Tower,
   Thin Air Skate Supply, Switchback Road with its yellow curbs and guardrails, the three overlooks, the Overlook Steps, the Chute,
   and the filler that keeps the streets from going dead (CONTRACT 7). Design: levels/porto/design/heights.md 3.3, 4 (S1-S8), 7.1, 7.4.
   Rect [-420, 100, -650, -230]. */
function heights_switch(K, P, PL) {
  const T = (x, z) => K.terrainH(x, z);
  const c = { K, P, PL, T, segs: heights_switch_segs(PL) };
  // a sloped slab from p to q ([x, z] each), `lift` over the ground, w wide (top at the higher end)
  c.hub = (p, q, w, color, noRails, kind, lift) => {
    const y0 = T(p[0], p[1]) + lift, y1 = T(q[0], q[1]) + lift, hi = y0 >= y1;
    K.hubbas.push({ a: hi ? V(p[0], y0, p[1]) : V(q[0], y1, q[1]), b: hi ? V(q[0], y1, q[1]) : V(p[0], y0, p[1]), w, noRails, kind, color }); };
  c.rail = (p, q, kind, lift, post) => K.rail(p[0], T(p[0], p[1]) + lift, p[1], q[0], T(q[0], q[1]) + lift, q[1], kind, post);
  heights_switch_ridge(c);
  heights_switch_road(c);
  heights_switch_steps(c);
  heights_switch_overlooks(c);
  heights_switch_lookout(c);
  heights_switch_tower(c);
  heights_switch_lane(c);
  heights_switch_filler(c);
  heights_switch_life(c);
}

/* the road's centre line as pieces: 'L' straight (a -> b), 'A' arc (centre c, radius R, angle a0 -> a1; x = cos, z = sin); n chords each */
function heights_switch_segs(PL) {
  const S = PL.SW, h = Math.PI / 2, e = S.entry, x = S.exit, hp = S.hairpins;
  return [
    { t: 'L', a: [-76, -590], b: [-76, -572], n: 2 },
    { t: 'A', c: e.c, R: e.R, a0: 0, a1: h, n: 4 },
    { t: 'L', a: [-112, -536], b: [-272, -536], n: 1 },
    { t: 'A', c: hp[0].c, R: S.R, a0: -h, a1: -3 * h, n: 8 },
    { t: 'L', a: [-272, -464], b: [-112, -464], n: 1 },
    { t: 'A', c: hp[1].c, R: S.R, a0: -h, a1: h, n: 8 },
    { t: 'L', a: [-112, -392], b: [-272, -392], n: 1 },
    { t: 'A', c: hp[2].c, R: S.R, a0: -h, a1: -3 * h, n: 8 },
    { t: 'L', a: [-272, -320], b: [-132, -320], n: 1 },
    { t: 'A', c: x.c, R: x.R, a0: -h, a1: 0, n: 4 },
    { t: 'L', a: [-100, -288], b: [-100, -248], n: 5 } ];
}
/* n + 1 points along a piece at lateral offset o (the left of travel is (-dz, dx); on an arc, o > 0 moves toward the centre when it turns +) */
function heights_switch_pts(s, o, n) {
  const out = []; n = n || s.n;
  for (let i = 0; i <= n; i++) { const t = i / n;
    if (s.t === 'L') { const dx = s.b[0] - s.a[0], dz = s.b[1] - s.a[1], L = Math.hypot(dx, dz); out.push([s.a[0] + dx * t - dz / L * o, s.a[1] + dz * t + dx / L * o]); }
    else { const a = s.a0 + (s.a1 - s.a0) * t, sg = Math.sign(s.a1 - s.a0), r = s.R - sg * o; out.push([s.c[0] + r * Math.cos(a), s.c[1] + r * Math.sin(a)]); } }
  return out;
}

/* ---------- Ridge Road (z -596, flat 44) and its lamps and trees ---------- */
function heights_switch_ridge(c) {
  const { K } = c;
  K.street('x', -596, -419.5, 99.5, 44, [-76], { rw: 5, sw: 3, lamps: false });
  [-390, -330, -270, -210, -150, -40, 20, 80].forEach((x, i) => K.lamp(x, i % 2 ? -588.8 : -603.2, i % 2 ? -1 : 1));
  for (const x of [-370, -300, -230, -170, -110, 0]) K.tree(x, -605.6);
}

/* ---------- Switchback Road: sidewalks, yellow curbs, guardrails, centre line, lamps, trees ---------- */
function heights_switch_road(c) {
  const { K, T, segs } = c, YEL = 0xe2c044, WALK = 0xc4c0b6;
  segs.forEach((s, si) => { for (const side of [-1, 1]) {
    const cp = heights_switch_pts(s, side * 5.175), rp = heights_switch_pts(s, side * 5.0), wp = heights_switch_pts(s, side * 6.675);
    for (let i = (si === 7 && side === 1 ? 3 : 0); i < s.n; i++) {                   // (hairpin 3's outside starts after the lane has crossed it: 3 chords, designer review)
      c.hub(wp[i], wp[i + 1], 2.65, WALK, true, undefined, 0.15);               // the sidewalk behind the curb
      c.hub(cp[i], cp[i + 1], 0.35, YEL, true, 'Curb', 0.15);                      // the yellow curb
      c.rail(rp[i], rp[i + 1], 'Curb', 0.15, false);                               // its road-side edge: one long grind
    }
  } });
  // the centre line: 3 m dashes every 6 m
  for (const s of segs) { const n = Math.max(2, Math.round((s.t === 'L' ? Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) : Math.abs(s.a1 - s.a0) * s.R) / 3)), p = heights_switch_pts(s, 0, n);
    for (let i = 1; i + 1 < p.length; i += 2) K.dash(p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]); }
  // guardrails, 0.75 m over the sidewalk: south edge of each leg (a gap at x -196..-188 for the Overlook Steps), round the outside of
  // each hairpin and the entry arc (a gap where the overlook deck opens), inside the exit arc; the pieces meet end to end
  const g = (p, q) => c.rail(p, q, 'Rail', 0.9, true);
  const leg = (s, o) => { const [p, q] = heights_switch_pts(s, o, 1); return [p, q]; };
  const gapLeg = (s, o) => { const [p, q] = leg(s, o), z = p[1], west = p[0] > q[0];             // two pieces, in the direction of travel
    g(p, [west ? -188 : -196, z]); g([west ? -196 : -188, z], q); };
  const outer = (s, o, skip) => { const p = heights_switch_pts(s, o); for (let i = 0; i < s.n; i++) if (!(skip || []).includes(i)) g(p[i], p[i + 1]); };
  outer(segs[1], -7.5);                                                   // entry arc, outside
  gapLeg(segs[2], -7.6);                                                         // leg 1
  outer(segs[3], 7.5, [3, 4]);                                                    // hairpin 1
  { const [p, q] = leg(segs[4], 7.6), z = p[1]; g([-260, z], [-196, z]); g([-188, z], q); }   // leg 2: open at x -272..-260 (the Traverse's bank drop)
  outer(segs[5], -7.5, [3, 4]);                                                   // hairpin 2
  { const [p, q] = leg(segs[6], -7.6), z = p[1]; g(p, [-188, z]); g([-196, z], [-244, z]); }  // leg 3: open at x -272..-244 (the bank drop drifts east)
  outer(segs[7], 7.5, [0, 1, 2, 3, 4]);                                         // hairpin 3 (its first chords would cross the lane; chord 2's end stood in the lane's south walk)
  { const [p, q] = leg(segs[8], 7.6), m = [-202, p[1]]; g([-244, p[1]], m); g(m, q); }  // leg 4 in two pieces, open at x -272..-244
  // (designer review) so the fall line at x -266 runs clear from leg 2 down both banks: the Traverse's bank drop, and a straight bomb
  outer(segs[9], 7.5);                                                    // exit arc, inside
  // the Chute: a row of low blocks down the west sidewalk (grind or manual them at speed)
  for (const [z0, z1] of [[-284, -279], [-276, -271], [-268, -263], [-260, -255]]) K.strip(-106.6, z0, -106.6, z1, 0.4, 0.5, { kind: 'Ledge', color: 0xa9a59c, seg: 6 });
  // lamps: the north side of each leg, two round each hairpin
  for (const [z, xs] of [[-543.4, [-140, -228]], [-471.4, [-140, -228]], [-399.4, [-140, -228]], [-327.4, [-140, -228]]]) for (const x of xs) K.lamp(x, z, 1);
  K.lamp(-84.4, -440, 1); K.lamp(-299, -500, -1); K.lamp(-299, -356, -1);
  // groves on the inner lawns
  for (const [x, z] of [[-286, -508], [-296, -500], [-240, -506], [-224, -494], [-158, -500], [-150, -488],
    [-240, -436], [-230, -420], [-150, -430], [-100, -430], [-96, -418], [-240, -366], [-228, -350], [-160, -362], [-150, -345], [-290, -356]]) K.tree(x, z);
  // the sign for the road, on a post at the entry
  K.prop(-66.15, 44, -586.1, -65.85, 47.4, -585.9, 0x3a3d42);
  K.decorFns.push(D => D.sign('SWITCHBACK ROAD', -66, 46.8, -586, 6, 1, Math.PI / 2, '#f0ece2', '#2e3f5c'));
}

/* ---------- Overlook Steps E1-E3 (x -194..-190): landing + flight, five times, down each embankment ---------- */
function heights_switch_steps(c) {
  const { K } = c;
  const E = [ { z0: -528, L: 8.4, n: 8, tread: 0.4, rise: 0.205, top0: 41.35 },
              { z0: -456, L: 7.6, n: 10, tread: 0.4, rise: 0.208, top0: 33.15 },
              { z0: -384, L: 7.6, n: 10, tread: 0.4, rise: 0.2, top0: 22.75 } ];
  for (const e of E) {
    const U = e.L + (e.n - 1) * e.tread;
    for (let k = 0; k < 5; k++) {
      const za = e.z0 + k * U, zb = za + e.L, top = e.top0 - k * e.n * e.rise, bot = top - e.n * e.rise;
      K.B(-194.6, K.groundMin(-194.6, za, -189.4, zb) - 0.4, za, -189.4, top, zb, 'plaza', { edges: '' });   // (no lip grind: the handrails are the grinds here, and the budget is tight)
      K.stairSpot('z', zb, 1, -194, -190, top, bot, e.n, e.tread, { rails: [-194.45, -189.55] });
    }
  }
}

/* ---------- the three overlook decks, outside each hairpin apex ---------- */
function heights_switch_overlooks(c) {
  const { K } = c;
  const deck = (x0, y0, z0, x1, y1, z1, edges, barX, benchX, scopeX) => {
    K.B(x0, y0, z0, x1, y1, z1, 'wood', { edges });
    K.rail(barX, y1 + 1.0, z0 + 0.5, barX, y1 + 1.0, z1 - 0.5, 'Rail', true);                          // the outer bar
    K.B(benchX - 0.3, y1, z0 + 4, benchX + 0.3, y1 + 0.45, z0 + 12, 'wood', { edges: 'ew' });           // a bench along the view
    K.prop(scopeX - 0.15, y1, (z0 + z1) / 2 + 3 - 0.15, scopeX + 0.15, y1 + 1.5, (z0 + z1) / 2 + 3 + 0.15, 0x3a3d42);
    K.prop(scopeX - 0.4, y1 + 1.5, (z0 + z1) / 2 + 3 - 0.3, scopeX + 0.4, y1 + 1.8, (z0 + z1) / 2 + 3 + 0.3, 0x6b7076); };
  deck(-340, 37.2, -512, -316, 38.25, -488, 'nsw', -339.7, -336, -332);
  deck(-68, 26.5, -440, -44, 27.95, -416, 'nse', -44.3, -48, -52);
  deck(-340, 16.6, -368, -316, 17.55, -344, 'nsw', -339.7, -336, -332);
}

/* ---------- S1 Ridgeline Lookout, S4 Thin Air Skate Supply ---------- */
function heights_switch_lookout(c) {
  const { K, P, T } = c, CON = 0x9a968c;
  // the paving: concrete over the plaza, in 1 m ribbons along x (the ground is level that way, so they follow the slope)
  for (let z = -587.5; z < -560; z += 1) K.dash(-40, z, 90, z, CON, 1.06);
  // the brow ledge: three pieces that meet end to end, 0.45 over the ground at the edge (the district's front door)
  for (const [x0, x1] of [[-36, 6], [6, 46], [46, 86]]) K.Bg(x0, -561, x1, -560.4, 0.45, 'ledge', { edges: 'ns' });
  // benches, planters, coin telescopes
  K.bench(-22, -574.3, -14, -573.7); K.bench(20, -574.3, 28, -573.7); K.bench(62, -574.3, 70, -573.7);
  K.Bg(0, -580, 12, -577, 0.55, 'ledge', { edges: 'ns' }); K.Bg(36, -580, 48, -577, 0.55, 'ledge', { edges: 'ns' });
  for (const x of [-4, 78]) { K.prop(x - 0.15, 43.2, -564.15, x + 0.15, 44.6, -563.85, 0x3a3d42); K.prop(x - 0.4, 44.6, -564.3, x + 0.4, 44.9, -563.7, 0x6b7076); }
  // the gantry sign on two posts
  K.prop(19.3, 44, -587.2, 19.7, 48.4, -586.8, 0x3a3d42); K.prop(28.3, 44, -587.2, 28.7, 48.4, -586.8, 0x3a3d42);
  K.decorFns.push(D => D.sign('RIDGELINE LOOKOUT', 24, 47.6, -587, 9, 1.4, Math.PI, '#f0ece2', '#2e3f5c'));
  // Thin Air Skate Supply: a two-floor office block on the north side of the road, a forecourt in front
  K.building(52, -624, 68, -608, 2, 0x6e7f8c, 'office');
  K.B(52, 43.6, -608, 68, 44.15, -604, 'plaza');
  P.shop({ name: 'Thin Air Skate Supply', sign: [60, 48.0, -607.96, 0, 7], awning: [54, -608, 66, -606.4, 46.35], zone: [56, -607.8, 64, -604.8], door: [60, 44.15, -607.8] });
  K.trashCan(54.5, -604.8); K.newsBoxes(65.5, -604.8, true, 2);
  K.hubbas.push({ a: V(60, 44.15, -601), b: V(60, 44.01, -599.6), w: 8, noRails: true, color: 0xb9b5ab });   // (designer review) a curb cut: roll in off the road
}

/* ---------- S2/S8 the Radio Tower: footing, hut, hut bank, the model and the far silhouette ---------- */
function heights_switch_tower(c) {
  const { K, P } = c;
  K.Bg(14, -628, 34, -608, 0.6, 'plaza', { edges: 'nswe' });                                 // the footing: a manual pad off the road
  for (const dx of [-6, 6]) for (const dz of [-6, 6]) K.B(24 + dx - 0.6, 43.6, -618 + dz - 0.6, 24 + dx + 0.6, 45.4, -618 + dz + 0.6, 'plaza');   // the four leg piers
  K.B(36, 43.6, -624, 44, 47.4, -616, 'building', { color: 0x9aa3a8 });                      // the tower hut
  K.hubbas.push({ a: V(40, 47.4, -616.2), b: V(40, 44.02, -607), w: 4, noRails: true, color: 0x8f8a7e });   // the hut bank, up to the roof
  K.decorFns.push(D => {
    const box = new THREE.BoxGeometry(1, 1, 1), RED = 0xc8432f, WHITE = 0xe8e4dc, X = 24, Z = -618, Y = 44;
    const Yv = V(0, 1, 0);
    const bar = (a, b, th, col) => { const d = V(b[0] - a[0], b[1] - a[1], b[2] - a[2]), len = d.length(), q = new THREE.Quaternion().setFromUnitVectors(Yv, d.clone().normalize()), e = new THREE.Euler().setFromQuaternion(q, 'YXZ');
      D.add(box, col, [X + (a[0] + b[0]) / 2, Y + (a[1] + b[1]) / 2, Z + (a[2] + b[2]) / 2], [e.x, e.y, e.z], [th, len, th]); };
    const w = h => 6 - 0.05 * h, cor = (h, i) => [(i & 1 ? 1 : -1) * w(h), h, (i & 2 ? 1 : -1) * w(h)];
    for (let i = 0; i < 4; i++) bar(cor(0, i), cor(100, i), 0.55, RED);                       // the four legs, tapering
    for (let k = 0; k <= 10; k++) { const h = k * 10, col = k % 2 ? WHITE : RED;                // a ring every 10 m
      for (const [i, j] of [[0, 1], [1, 3], [3, 2], [2, 0]]) bar(cor(h, i), cor(h, j), 0.3, col); }
    for (let k = 0; k < 10; k++) for (const [i, j] of [[0, 1], [1, 3], [3, 2], [2, 0]]) {     // one diagonal on each face, alternating
      const lo = k * 10, hi = lo + 10; (k + i) % 2 ? bar(cor(lo, i), cor(hi, j), 0.22, WHITE) : bar(cor(lo, j), cor(hi, i), 0.22, WHITE); }
    for (const h of [50, 100]) D.add(box, 0x9aa3a8, [X, Y + h, Z], [0, 0, 0], [w(h) * 2 + 1.2, 0.4, w(h) * 2 + 1.2]);   // two platforms
    bar([0, 100, 0], [0, 112, 0], 0.5, RED);                                                   // the mast
    D.add(new THREE.SphereGeometry(1, 8, 6), 0xff3b2e, [X, Y + 112.6, Z], [0, 0, 0], [0.9, 0.9, 0.9]);   // the beacon
  });
  P.landmark({ at: [24, 44, -618], near: 140, parts: [
    { shape: 'box', at: [0, 20, 0], size: [12, 40, 12], color: 0xc8432f }, { shape: 'box', at: [0, 58, 0], size: [7, 36, 7], color: 0xe8e4dc },
    { shape: 'box', at: [0, 92, 0], size: [3.5, 32, 3.5], color: 0xc8432f }, { shape: 'sphere', at: [0, 110, 0], size: [2.5, 2.5, 2.5], color: 0xff3b2e } ] });
}

/* ---------- Reservoir Lane, x -420..-272: flat to -364, then it drops to the switchback's third leg ---------- */
function heights_switch_lane(c) {
  const { K } = c;
  K.street('x', -392, -419.5, -364, 20.89, [], { rw: 4, sw: 3, lamps: false });
  for (let x = -364; x < -276; x += 8) {                                                      // sloped sidewalks, 0.15 over the ground
    c.hub([x, -397.5], [x + 8, -397.5], 3, 0xc4c0b6, true, undefined, 0.15);
    if (x < -308) c.hub([x, -386.5], [x + 8, -386.5], 3, 0xc4c0b6, true, undefined, 0.15);
  }
  K.lamp(-390, -399.6, 1); K.tree(-348, -385.4);
}

/* ---------- filler: something skateable within reach of every street (CONTRACT 7) ---------- */
function heights_switch_filler(c) {
  const { K, T } = c;
  const led = (x0, z0, x1, z1, h, edges) => K.Bg(x0, z0, x1, z1, h, 'ledge', { edges });      // a low wall; edges: which long sides grind
  const padb = (x0, z0, x1, z1, h) => K.Bg(x0, z0, x1, z1, h, 'pad', { edges: '' });           // a manual pad: ride it, no grind lines
  const wall = (ax, az, bx, bz, back, hgt) => {                                                // a retaining wall with long chords (fewer grind lines than K.retainWall)
    const L = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / L, nz = (bx - ax) / L, top = (x, z) => Math.max(T(x, z), T(x + nx * back, z + nz * back)), s = Math.sign(back) * 0.3;
    K.strip(ax + nx * s, az + nz * s, bx + nx * s, bz + nz * s, hgt, 0.6, { top, kind: 'Ledge', color: 0xa39d90, seg: 16 }); };
  const N = -602.8, S = -589.4;                                                                // the two sidewalks of Ridge Road
  /* Ridge Road, west to east */
  led(-414, N - 0.3, -406, N + 0.3, 0.45, 'n');
  K.kicker(-388, -587.2, 0, 1, 2.4, 0.6, 3);
  K.bench(-368.5, N - 0.3, -363.5, N + 0.3); K.trashCan(-361, N);
  padb(-348, S - 0.6, -340, S + 0.6, 0.2);
  led(-325, N - 0.3, -319, N + 0.3, 0.45, 's');
  K.newsBoxes(-300, S, true, 3);
  K.busStop(-278, N, true, -1);
  led(-260, S - 0.4, -254, S + 0.4, 0.55, 'ns');
  padb(-238, N - 0.6, -230, N + 0.6, 0.2);
  led(-217, S - 0.3, -207, S + 0.3, 0.45, 'n');
  K.kicker(-190, -604.8, 0, -1, 2.4, 0.6, 3);
  K.bench(-170.5, S - 0.3, -165.5, S + 0.3);
  led(-150, N - 0.3, -142, N + 0.3, 0.45, 's');
  padb(-128, S - 0.6, -120, S + 0.6, 0.2); K.bikeRack(-112, S + 0.3, true, 2.4);
  K.newsBoxes(-100, N, true, 2);
  led(-60, N - 0.3, -52, N + 0.3, 0.45, 'n');
  K.kicker(-30, -587.2, 0, 1, 2.4, 0.6, 3);
  K.bench(-10.5, N - 0.3, -5.5, N + 0.3);
  padb(-4, S - 0.6, 4, S + 0.6, 0.2);
  led(40, S - 0.3, 48, S + 0.3, 0.45, 's');
  led(72, N - 0.3, 80, N + 0.3, 0.45, 'n');
  K.kicker(88, -587.2, 0, 1, 2.4, 0.6, 3);
  K.newsBoxes(96, N, true, 2);
  /* Reservoir Lane, x -420..-272 */
  wall(-416, -400.4, -386, -400.4, -2.5, 0.45);                                                // the bank above the north sidewalk
  K.bench(-373, -386.6, -368, -386.0); K.trashCan(-364.5, -386.3);
  K.kicker(-350, -384.4, 0, 1, 2.4, 0.6, 2.5);
  K.Bg(-336, -388.2, -330, -386.8, 0.55, 'ledge', { edges: 'ns' }); K.Bg(-322, -388.2, -316, -386.8, 0.45, 'ledge', { edges: 'ns' });
  wall(-336, -400.4, -300, -400.4, -2.5, 0.45);
  K.bikeRack(-305, -385.8, true, 2.4);
  led(-292, -399.6, -284, -399.0, 0.45, 'n');
  /* the bank at the west end of leg 2 -> 3 (x -272, the Traverse's way down) */
  led(-278, -452, -277.4, -442, 0.5, 'ew'); led(-278, -430, -277.4, -420, 0.5, 'ew');
  K.kicker(-282, -410, 1, 0, 2.4, 0.6, 3);
}

/* ---------- spots, challenges, tapes, travel ---------- */
function heights_switch_life(c) {
  const { P, T } = c, PI = Math.PI;
  P.spot('Ridgeline Lookout', 24, 43.9, -578, PI, [-40, -588, 90, -560]);
  P.spot('Switchback Road', -96, T(-96, -545) + 0.1, -545, PI / 2, [-116, -560, -72, -530]);
  P.spot('Switchback Top', -120, T(-120, -536) + 0.1, -536, PI / 2, [-132, -542, -108, -530]);
  P.spot('Leg One Pocket', -232, T(-232, -532) + 0.1, -532, PI / 2, [-244, -540, -220, -526]);
  P.spot('Overlook One', -328, 38.3, -500, PI / 2, [-340, -512, -316, -488]);
  P.spot('Overlook Steps', -192, T(-192, -500) + 0.2, -500, PI, [-197, -528, -187, -400]);
  P.spot('Leg Two Pocket', -240, T(-240, -460) + 0.1, -460, -PI / 2, [-252, -468, -228, -452]);
  P.spot('Overlook Two', -56, 28.0, -428, -PI / 2, [-68, -440, -44, -416]);
  P.spot('Leg Three Bar', -190, T(-190, -390) + 0.9, -390, PI / 2, [-202, -398, -178, -382]);
  P.spot('Overlook Three', -328, 17.6, -356, PI / 2, [-340, -368, -316, -344]);
  P.spot('Leg Four Pocket', -180, T(-180, -318) + 0.1, -318, -PI / 2, [-196, -326, -164, -310]);
  P.spot('The Chute', -100, T(-100, -270) + 0.1, -270, PI, [-110, -288, -90, -250]);
  P.spot('Bank Two', -276, T(-276, -430) + 0.1, -430, PI, [-290, -450, -262, -410]);
  P.spot('Lane Bank', -330, 19.5, -392, PI / 2, [-345, -400, -315, -384]);
  P.spot('Lane Corner', -398, 20.9, -392, PI / 2, [-418, -400, -380, -384]);
  P.spot('Radio Tower', 24, 44.6, -604, 0, [10, -630, 46, -604]);
  P.spot('Thin Air Skate Supply', 60, 44.15, -603, 0, [52, -608, 68, -600]);
  P.travel('Ridgeline Lookout', 24, 43.9, -574, PI, 'spot');
  P.travel('Switchback Top', -120, T(-120, -536) + 0.1, -536, PI / 2, 'spot');
  P.travel('Thin Air Skate Supply', 60, 44.15, -603, 0, 'spot');
  P.challenge({ id: 'heights-yellow-line', name: 'The Yellow Line', desc: 'Grind the yellow curb along the second leg', at: [-192, 33.3, -459], go: [-262, 36.9, -462, -PI / 2],
    kind: 'grind', rail: 'Curb', area: [-272, -470, -112, -458] });
  P.challenge({ id: 'heights-guardrail', name: 'Guardrail Grind', desc: 'Grind the guardrail on the third leg', at: [-200, 23.5, -384], go: [-120, 26.6, -390, PI / 2],
    kind: 'grind', rail: 'Rail', area: [-272, -386, -112, -382, 18, 28.5] });
  P.challenge({ id: 'heights-overlook-line', hard: true, name: 'Overlook Line', desc: 'Start on Overlook One and land three grinds in one line, 4,000 points or more',
    at: [-328, 38.8, -500], go: [-326, 38.3, -500, -PI / 2], kind: 'line', pts: 4000, area: [-340, -512, -316, -488], need: [['grind', 3]] });
  P.tape(40, -620, 47.4);
  P.tape(-338, -500, 38.25);
}

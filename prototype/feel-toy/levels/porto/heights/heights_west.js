/* The Heights, the west part: x -1000..-420, z -650..-230 (design/heights.md 4 W1-W5, 6, 10.1).
   Ridge Road west, Tank Road and its villas, Reservoir Lane, the Drainage Culvert (Culvert Gap, footbridge, edge rails),
   the drained Water Tank, the Spillway, the Pumphouse; the filler that keeps every street from going dead;
   challenges, tapes, spots, signs. Traffic, peds and the Pump Curb skater are registered in index.js. */
function heights_west(K, P, PL) {
  heights_west_ridge(K, P);
  heights_west_tankroad(K, P);
  heights_west_lane(K, P);
  heights_west_culvert(K, P);
  heights_west_tank(K, P);
  heights_west_spill(K, P);
  heights_west_pump(K, P);
  heights_west_villas(K);
  heights_west_trees(K);
}

/* a ground-following ledge: a slab with no side rails and one grind line down its top (cheaper than two side rails per chord) */
function heights_west_ledgeStrip(K, ax, az, bx, bz, hgt, w, seg) {
  K.strip(ax, az, bx, bz, hgt, w, { kind: 'Ledge', noRails: true, color: 0xa9a59c, seg: seg || 9 });
  K.rail(ax, K.terrainH(ax, az) + hgt, az, bx, K.terrainH(bx, bz) + hgt, bz, 'Ledge', false);
}

/* a small piece of street furniture centred on (x, z); alongX: which way the street runs; lift: the sidewalk's height over the ground */
function heights_west_piece(K, kind, x, z, alongX, lift) {
  const lf = lift || 0, al = alongX ? 'n' : 'e';   // one grindable long edge each: the budget counts every edge line
  const box = (hu, hv, h, mat, edges) => alongX ? K.Bg(x - hu, z - hv, x + hu, z + hv, h + lf, mat, { edges }) : K.Bg(x - hv, z - hu, x + hv, z + hu, h + lf, mat, { edges });
  switch (kind) {
    case 'ledge': box(4, 0.3, 0.45, 'ledge', al); break;
    case 'bench': box(1.1, 0.3, 0.45, 'wood', ''); break;
    case 'planter': box(1.5, 0.6, 0.55, 'ledge', ''); break;
    case 'pad': box(3, 0.7, 0.18, 'pad', ''); break;
    case 'kick': K.kicker(alongX ? x - 4.5 : x, alongX ? z : z - 4.5, alongX ? 1 : 0, alongX ? 0 : 1, 2.4, 0.5, 1.3); box(2.6, 0.7, 0.18, 'pad', ''); break;
    case 'rack': K.bikeRack(x, z, alongX); K.trashCan(alongX ? x + 3 : x, alongX ? z : z + 3); break;
    case 'gap': K.crossingGap(alongX ? x - 3.5 : x, alongX ? z : z - 3.5, alongX ? x + 3.5 : x, alongX ? z : z + 3.5, 0.4); break;
    case 'hydrant': K.hydrant(x, z); K.newsBoxes(alongX ? x + 2.2 : x, alongX ? z : z + 2.2, alongX, 2); break;
    case 'jersey': alongX ? K.jersey(x - 2.2, z - 0.25, x + 2.2, z + 0.25) : K.jersey(x - 0.25, z - 2.2, x + 0.25, z + 2.2); break;
  }
}

/* pieces along a straight flat street z = c (x from..to), one every `step` m, alternating sides at v = +-vw */
function heights_west_row(K, c, from, to, step, vw, kinds, lift, phase, skip) {
  let side = 1, i = phase || 0;
  for (let u = from; u <= to; u += step) {
    if (skip && skip(u, side)) { side = -side; if (skip(u, side)) continue; }
    heights_west_piece(K, kinds[i++ % kinds.length], u, c + side * vw, true, lift); side = -side;
  }
}

/* Ridge Road, x -968..-420.5 at y 44 (K.street), its lamps, the filler, the Culvert Head sign */
function heights_west_ridge(K, P) {
  const c = -596;
  K.street('x', c, -968, -420.5, 44, [-904], { rw: 5, sw: 3, lamps: false });
  const lampX = [];
  for (let x = -950, s = 1; x < -430; x += 40, s = -s) { if (Math.abs(x + 904) < 12) continue; lampX.push([x, s]); K.lamp(x, c + s * 5.6, s); }
  const nearLamp = (u, side) => lampX.some(([lx, ls]) => ls === side && Math.abs(lx - u) < 4.5);
  const skip = (u, side) => Math.abs(u + 904) < 15 || Math.abs(u + 700) < 6 || nearLamp(u, side);
  heights_west_row(K, c, -958, -432, 40, 6.5, ['ledge', 'kick', 'planter', 'bench', 'gap', 'pad', 'rack', 'ledge', 'hydrant', 'kick'], 0.15, 0, skip);
  // the Culvert Head: a painted lip at the drop-in, and the warning sign
  K.lip(-704, -584, -696, -584, 44.0);
  for (const x of [-716.6, -711.4]) K.prop(x - 0.08, 44, -586.1, x + 0.08, 45.9, -585.9, 0x3a3d42);
  K.decorFns.push(D => D.sign('CULVERT — DANGER', -714, 45.8, -586, 5, 1, Math.PI, '#1b1b1b', '#e2c044'));
  K.hubbas.push({ a: V(-700, 44.15, -591), b: V(-700, 44.01, -592.4), w: 6, noRails: true, color: 0xb9b5ab });   // curb cut onto the head from the road
  P.spot('Culvert Head', -700, 44.15, -589.5, Math.PI, [-716, -592, -684, -580]);
  P.travel('Culvert Head', -700, 44.15, -589.5, Math.PI, 'spot');
  // a viewpoint pull-off over the reservoir: bench, a bank and a pair of planters
  K.bench(-818, -587.8, -814, -587.2); K.Bg(-806, -589, -802, -587.6, 0.55, 'ledge', { edges: '' }); K.Bg(-796, -589, -792, -587.6, 0.55, 'ledge', { edges: 'n' });
}

/* a sloped sidewalk piece on a z-running road: top 0.15 over the ground, ground-following in straight runs */
function heights_west_zwalk(K, xc, xe, breaks, curbFrom) {
  for (let i = 0; i + 1 < breaks.length; i++) {
    const z0 = breaks[i], z1 = breaks[i + 1], y0 = K.terrainH(xc, z0) + 0.15, y1 = K.terrainH(xc, z1) + 0.15, hi = y0 >= y1;
    K.hubbas.push({ a: V(xc, hi ? y0 : y1, hi ? z0 : z1), b: V(xc, hi ? y1 : y0, hi ? z1 : z0), w: 3, noRails: true, color: 0xc4c0b6 });
    if (z1 - z0 >= curbFrom) K.rail(xe, K.terrainH(xe, z0) + 0.15, z0, xe, K.terrainH(xe, z1) + 0.15, z1, 'Curb', false);
  }
}

/* Tank Road, x -904, z -588..-399: sloped sidewalks and the filler along its edges */
function heights_west_tankroad(K, P) {
  const x = -904, br = [-588, -578, -562, -546, -424, -400];
  for (const s of [-1, 1]) heights_west_zwalk(K, x + s * 5.5, x + s * 4.15, br, 100);
  // ledges, kickers and low walls on the east verge and the west garden fronts: ground-following, so the slope doesn't matter
  for (const z of [-572, -536, -500, -452, -416]) heights_west_ledgeStrip(K, -894.6, z, -894.6, z + 9, 0.45, 0.6);
  for (const z of [-556, -485, -445]) heights_west_ledgeStrip(K, -913.4, z, -913.4, z + 8, 0.45, 0.6);
  for (const z of [-516, -464, -432]) K.kicker(-894.8, z, 0, 1, 2.4, 0.5, 1.4);
  for (const z of [-590, -548, -508, -462]) K.lamp(-911.9, z, -1);
  P.spot('Tank Road', -904, K.terrainH(-904, -520), -520, Math.PI, [-912, -588, -896, -404]);
}

/* Reservoir Lane, z -392: flat west and east stretches (K.street), sloped sidewalks over the ford, filler, two pull-offs */
function heights_west_lane(K, P) {
  const c = -392, Y = 20.89;
  K.street('x', c, -914, -768, Y, [-904], { rw: 4, sw: 3, lamps: false });
  K.street('x', c, -632, -420.5, Y, [], { rw: 4, sw: 3, lamps: false });
  // sloped sidewalks over the dip, none across the culvert (x -712..-688)
  for (const zc of [-397.5, -386.5]) for (const [a, b] of [[-768, -712], [-688, -632]])
    K.strip(a, zc, b, zc, 0.15, 3, { noRails: true, color: 0xc4c0b6, seg: 8 });
  // lamps and filler
  const lampX = [[-880, 1], [-840, -1], [-800, 1], [-590, -1], [-560, 1], [-500, -1], [-470, 1]];
  for (const [x, s] of lampX) K.lamp(x, c + s * 5.6, s);
  const near = (u, side) => lampX.some(([lx, ls]) => ls === side && Math.abs(lx - u) < 4.5);
  heights_west_row(K, c, -888, -774, 30, 6.5, ['ledge', 'kick', 'planter', 'gap', 'bench'], 0.15, 0, (u, s) => near(u, s) || Math.abs(u + 904) < 14 || Math.abs(u + 824) < 11);
  heights_west_row(K, c, -622, -432, 38, 6.5, ['pad', 'ledge', 'hydrant', 'kick', 'planter', 'rack', 'ledge', 'gap'], 0.15, 3,
    (u, s) => near(u, s) || (s < 0 ? false : (u > -632 && u < -592)) || (u > -562 && u < -530) || (u > -454 && u < -424));
  // the ford: ledges and kickers on the sidewalks of the two ramps (ground-following)
  for (const [x0, x1, zc] of [[-754, -744, -397.5], [-736, -726, -386.5], [-672, -662, -397.5], [-660, -650, -386.5]])
    heights_west_ledgeStrip(K, x0, zc, x1, zc, 0.6, 0.6, 10);
  // (designer review) the 40 m by the Spillway crossing: a low ledge each side of it
  K.Bg(-840, -386.8, -834, -386.2, 0.45, 'ledge', { edges: 'n' }); K.Bg(-812, -397.8, -806, -397.2, 0.45, 'ledge', { edges: 's' });
  // pull-off A, Cistern Court (x -548): a bus stop, a wall and a bank on the north verge
  K.busStop(-548, -386.5, true, 1);
  K.Bg(-566, -402.3, -532, -401.7, 0.45, 'ledge', { edges: 's' });   // a long garden wall along the verge: one 34 m grind
  K.kicker(-540, -405, 1, 0, 2.6, 0.55, 1.5); K.bench(-556, -404.2, -552, -403.6);
  P.spot('Cistern Court', -548, Y + 0.15, -388, Math.PI / 2, [-570, -405, -526, -384]);
  // pull-off B, Lane Bend (x -440): planters, a rack and a short rail
  K.Bg(-446, -388.5, -440, -387.2, 0.55, 'ledge', { edges: '' }); K.Bg(-434, -388.5, -428, -387.2, 0.55, 'ledge', { edges: '' });
  K.bikeRack(-436, -397.5, true); K.trashCan(-426, -397.5);
  K.rail(-452, Y + 0.15 + 0.9, -399.4, -438, Y + 0.15 + 0.9, -399.4, 'Rail', true);
  P.spot('Lane Bend', -440, Y + 0.15, -392, Math.PI / 2, [-456, -402, -424, -384]);
}

/* W1: the Drainage Culvert, x -712..-688 */
function heights_west_culvert(K, P) {
  const X = -700;
  // the headwall and the storm-door kicker over the lane's ford
  // WORKAROUND for heights_terrain: between the lip (z -402) and the lane (-398) it returns lerp(B0(lipZ) - lipD, h, t) without the min()
  // the other culvert branches use, which stands a 1.26 m wall of ground up at z -402 across the whole channel (a rider below ~19 m/s
  // sticks on it). Here the ground under the headwall is put back on the grade just outside the channel, which is what the design means.
  K.feat(-712, -688, -402, -398, (x, z) => K.terrainH(-712.2, z), 'set');
  K.B(-712, 17.4, -402, -688, 20.0, -398, 'garage', { edges: 's' });
  K.hubbas.push({ a: V(X, 20.6, -398.3), b: V(X, 20.02, -401.9), w: 6, noRails: true, color: 0x6b6f75 });
  // the footbridge at z -470
  K.B(-714, 31.62, -472, -686, 31.92, -468, 'wood');
  // (post false: the engine's posts would stand in the channel under the deck; the visible posts are on the deck)
  K.rail(-714, 32.9, -472.1, -686, 32.9, -472.1, 'Rail', false);
  K.rail(-714, 32.9, -467.9, -686, 32.9, -467.9, 'Rail', false);
  for (let x = -713; x <= -687; x += 4.33) for (const z of [-472.1, -467.9]) K.prop(x - 0.04, 31.92, z - 0.04, x + 0.04, 32.9, z + 0.04, 0x3a3d42);
  // edge rails along both wall tops, 0.9 m over the grade; pieces break at the bridge, the lip, the lane and the ground's kinks
  for (const x of [-712.3, -687.7]) for (const [z0, z1] of [[-584, -560], [-560, -472], [-468, -424], [-424, -402], [-386, -296]])
    K.rail(x, K.terrainH(x, z0) + 0.9, z0, x, K.terrainH(x, z1) + 0.9, z1, 'Rail', true);
  // wall-foot blocks on the floor edge, one every ~45 m, so the run always has something at its side
  [[-545, -1], [-507, 1], [-432, -1], [-362, 1], [-322, -1], [-282, 1]].forEach(([z, s]) => K.Bg(X + s * 3.3 - 0.3, z, X + s * 3.3 + 0.3, z + 4, 0.5, 'ledge', { edges: s < 0 ? 'e' : 'w' }));   // the grind edge faces the middle
  K.Bg(X - 3.6, -380, X - 3.0, -376, 0.5, 'ledge', { edges: 'e' });
  // tags, stains, the lip's paint
  K.decorFns.push(D => {
    D.tag(-706, 18.9, -397.9, 3.2, 1.4, 0); D.tag(-694, 19.0, -397.9, 2.4, 1.2, 0);
    D.stain(X, 28.63, -470, 2.6, 0.35); D.stain(X - 2, 28.63, -468, 1.6, 0.25);
    for (const [x, z, rot] of [[-707.2, -520, Math.PI / 2], [-692.8, -500, -Math.PI / 2], [-707, -330, Math.PI / 2]]) D.tag(x, K.terrainH(x, z) + 0.9, z, 2.2, 1.1, rot);
  });
  // spots
  P.spot('Culvert Gap', X, 20.6, -399, Math.PI, [-714, -410, -686, -360]);
  P.spot('Culvert Footbridge', X, 28.62, -462, Math.PI, [-714, -480, -686, -456]);
  P.spot('Culvert Apron', X, K.terrainH(X, -275), -275, Math.PI, [-714, -296, -686, -250]);
  P.challenge({ id: 'heights-culvert-gap', name: 'Culvert Gap', desc: 'Launch off the storm door and clear the lane',
    at: [X, 21.5, -398], go: [X, 38.2, -540, Math.PI], kind: 'gap', from: [-711, -406, -689, -398, 19.8], to: [-711, -386, -689, -360, 12, 18.6] });
  P.tape(X, -470, 28.62);
}

/* a ring of flat chords (hubba) round (cx, cz): rim wall, valve ring ... a is the first angle in degrees, `drop` chords by index */
function heights_west_ring(K, cx, cz, r, y, n, w, color, from, to, drop) {
  for (let i = 0; i < n; i++) {
    const a0 = (from + (to - from) * i / n) * Math.PI / 180, a1 = (from + (to - from) * (i + 1) / n) * Math.PI / 180;
    if (drop && drop(i)) continue;
    const ax = cx + r * Math.cos(a0), az = cz + r * Math.sin(a0), bx = cx + r * Math.cos(a1), bz = cz + r * Math.sin(a1);
    K.hubbas.push({ a: V(ax, y, az), b: V(bx, y, bz), w, noRails: true, kind: 'Ledge', color });
    K.rail(ax, y, az, bx, y, bz, 'Ledge', false);
  }
}

/* W3 + section 6: the Water Tank, "Reservoir No. 3" */
function heights_west_tank(K, P) {
  const cx = -824, cz = -472, Y = 31.89, R = 21;
  K.pool(-846, -802, -494, -450, [[K.poolS.circle(cx, cz, R), 4.4]], Y, 0.5);
  // coping: 24 rails at r 21
  for (let i = 0; i < 24; i++) { const a0 = i / 24 * Math.PI * 2, a1 = (i + 1) / 24 * Math.PI * 2;
    K.rails.push({ a: V(cx + R * Math.cos(a0), Y, cz + R * Math.sin(a0)), b: V(cx + R * Math.cos(a1), Y, cz + R * Math.sin(a1)), kind: 'Coping', coping: true }); }
  // the brick rim, 0.75 m: west (165..195 deg) and south (75..105 deg) breaches
  heights_west_ring(K, cx, cz, 22.6, Y + 0.75, 24, 0.6, 0x8a5a3a, 0, 360, i => i === 11 || i === 12 || i === 5 || i === 6);
  // valve ring (r 9, 0.45) and the spill ledge (r 14, south half, 0.5) on the floor
  heights_west_ring(K, cx, cz, 9, 27.94, 8, 0.6, 0xa9a59c, 0, 360);
  heights_west_ring(K, cx, cz, 14, 27.99, 6, 0.6, 0xa9a59c, 15, 165);   // the half ring stops 15 deg short of the east-west axis, so the line in from the breach stays open
  // the valve tower and its pipe stack
  K.B(-826, 27.0, -474, -822, 30.69, -470, 'metal', { edges: 'nswe' });
  K.B(-830, 27.49, -472, -826.5, 28.4, -470, 'metal');
  // fence, 2.4 m: a breach on the west (the access track) and on the south (the spillway)
  const F = (x0, z0, x1, z1) => K.B(x0, 31.5, z0, x1, 34.29, z1, 'fence');
  F(-870.1, -498, -869.9, -475); F(-870.1, -469, -869.9, -446); F(-870, -498.1, -778, -497.9); F(-778.1, -498, -777.9, -446);
  F(-870, -446.1, -830, -445.9); F(-818, -446.1, -778, -445.9);
  K.decorFns.push(D => {
    D.sign('RESERVOIR No. 3 — NO ENTRY', -870.1, 33.6, -480, 7, 1, -Math.PI / 2, '#f2ead8', '#8a2a1e');
    const ring = new THREE.RingGeometry(21, 25, 48), ring2 = new THREE.RingGeometry(25, 28, 48);   // the concrete deck round the coping
    D.add(ring, 0xb3afa6, [cx, Y + 0.06, cz], [-Math.PI / 2, 0, 0]);
    D.add(ring2, 0xa8a49b, [cx, Y + 0.05, cz], [-Math.PI / 2, 0, 0]);
    for (let k = 0; k < 4; k++) { const a = (45 + 90 * k) * Math.PI / 180; D.lamp(cx + 24.6 * Math.cos(a), Y, cz + 24.6 * Math.sin(a), 1); }
  });
  // outside the fence: a screen of trees comes in heights_west_trees; a gravel-track gatepost ledge on the Tank Road side
  K.Bg(-886, -479, -878, -478.4, 0.45, 'ledge', { edges: 's' }); K.Bg(-886, -466, -878, -465.4, 0.45, 'ledge', { edges: 'n' });
  P.spot('Water Tank', -852, 31.95, -472, -Math.PI / 2, [-872, -498, -776, -446]);
  P.travel('The Water Tank', -852, 31.95, -472, -Math.PI / 2, 'park');
  P.challenge({ id: 'heights-tank-coping', name: 'Reservoir Coping', desc: 'Grind the coping of the drained tank',
    at: [cx, 32.6, -451], go: [-852, 31.95, -472, -Math.PI / 2], kind: 'grind', rail: 'Coping', area: [-846, -494, -802, -450] });
  P.challenge({ id: 'heights-tank-score', name: 'Own the Tank', desc: 'Score 8000 in one line in the reservoir', hard: true,
    at: [cx, 32.4, -498], go: [-852, 31.95, -472, -Math.PI / 2], kind: 'score', pts: 8000, area: [-872, -500, -776, -444] });
  P.tape(cx, cz, 30.69);
}

/* W4: the Spillway, x -830..-818, from the tank's south breach to the lane */
function heights_west_spill(K, P) {
  K.rail(-824, 31.84, -446, -824, 21.76, -402, 'Rail', true);
  K.Bg(-836, -424, -832, -423.4, 0.45, 'ledge', { edges: 'n' }); K.Bg(-816, -424, -812, -423.4, 0.45, 'ledge', { edges: 'n' });
  // curb cuts where the strip meets the lane's sidewalks (K.street's sidewalks are solid 0.15 m steps): in on the north walk, up onto the south walk
  K.hubbas.push({ a: V(-824, 21.04, -399), b: V(-824, K.terrainH(-824, -400.4) + 0.01, -400.4), w: 12, noRails: true, color: 0xb9b5ab });
  K.hubbas.push({ a: V(-824, 21.04, -388), b: V(-824, 20.9, -389.4), w: 12, noRails: true, color: 0xb9b5ab });
  P.spot('Spillway', -824, 31.6, -440, Math.PI, [-834, -450, -814, -400]);
}

/* W2: the Pumphouse, its loading dock and the Pump Curb */
function heights_west_pump(K, P) {
  K.building(-626, -376, -592, -364, 1, 0x8a8478, 'brick');
  K.loadingDock(-626, -385, -600, 1);
  heights_west_ledgeStrip(K, -664, -382.9, -647, -382.9, 0.45, 0.6, 9); heights_west_ledgeStrip(K, -647, -382.9, -630, -382.9, 0.45, 0.6, 9);
  K.decorFns.push(D => D.tag(-609, 21.9, -375.9, 3, 1.4, 0));
  P.spot('Pump Curb', -648, 20.4, -383, Math.PI / 2, [-668, -390, -626, -378]);
  P.spot('Pumphouse Dock', -612, 22.2, -383.5, Math.PI / 2, [-628, -388, -592, -380]);
}

/* W5: four villas west of Tank Road, each with a stoop facing the road */
function heights_west_villas(K) {
  const HC = [0xd9c7a8, 0xc9a27e, 0xb8c4c9, 0xe0d6c2];
  [-560, -520, -470, -430].forEach((z, i) => {
    K.building(-936, z - 7, -920, z + 7, 2, HC[i], i % 2 ? 'brick' : 'stone');
    const g = K.terrainH(-918, z);
    K.B(-920, g - 1, z - 3, -917, g + 0.75, z + 3, 'step', { edges: 'e' });
    K.SET('x', -917, 1, z - 2.5, z + 2.5, g + 0.75, g, 3, 0.4);
    K.rail(-916.8, g + 1.33, z - 2.7, -915.7, g + 0.55, z - 2.7, 'Handrail', true);
  });
}

/* trees: Ridge Road verges, the screen above the tank, the villa gardens, the lane */
function heights_west_trees(K) {
  for (let x = -944; x < -430; x += 52) { if (Math.abs(x + 904) < 14 || Math.abs(x + 700) < 20) continue; K.tree(x, -607); }
  for (let x = -878; x <= -772; x += 5.6) K.tree(x, -541 + ((x * 7) % 3));
  for (const [x, z] of [[-930, -590], [-928, -540], [-928, -495], [-928, -452], [-928, -412]]) K.tree(x, z);
  for (const x of [-860, -780, -520, -470]) K.tree(x, -404);
}

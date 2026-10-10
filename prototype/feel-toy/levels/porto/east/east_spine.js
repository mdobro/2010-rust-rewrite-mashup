/* Eastside Hills, the Spine: the Hill Bomb and everything on it, Crosstown Street through the Cut, the Crest Lookout,
   the Crosstown Bridge, the Bridge Steps, the Underbridge DIY, the Chute, Crest Corner Skates, and the filler that keeps
   the streets in x 560..680 from going dead (see CONTRACT 7). Rect [560, 680, 230, 910], plus the one Crosstown street call. */

// the bomb's centre line by arclength s (m from the campus gate); same path as the sidewalks
function east_spine_path(s) {
  if (s <= 62) return [650, 230 + s];                                          // Campus Drive
  if (s <= 119.955) { const t = (s - 62) / 62.5; return [587.5 + 62.5 * Math.cos(t), 292 + 62.5 * Math.sin(t)]; }
  if (s <= 177.91) { const t = 0.9273 - (s - 119.955) / 62.5; return [662.5 - 62.5 * Math.cos(t), 392 - 62.5 * Math.sin(t)]; }
  return [600, 392 + (s - 177.91)];
}

// a point beside the bomb: s along it, o to the left of travel (o > 0 is the west side going south)
function east_spine_at(s, o) {
  const [x, z] = east_spine_path(s), [x2, z2] = east_spine_path(s + 0.5), tx = x2 - x, tz = z2 - z, l = Math.hypot(tx, tz) || 1;
  return [x + (-tz / l) * o, z + (tx / l) * o];
}

function east_spine(K, P, PL) {
  const T = (x, z) => K.terrainH(x, z);
  const zS = z => 177.91 + (z - 392);                 // s on the straight, z >= 392
  const sZ = s => 392 + (s - 177.91);                 // z on the straight
  const at = east_spine_at, bombPath = east_spine_path;
  const keep = [];                                    // rects (x0, z0, x1, z1) that trees and lamps keep out of
  const inK = (x, z, m = 0) => keep.some(r => x > r[0] - m && x < r[2] + m && z > r[1] - m && z < r[3] + m);
  const bdist = (x, z) => PL.bombDist(x, z);
  const CT = -20.31;                                   // the Cut floor and Crosstown Street

  /* ---------- Crosstown Street, the whole length, and the flush paint at the gate ---------- */
  K.street('x', 560, 316, 910, CT, [410, 600, 820], { rw: 7, sw: 5, lamps: false });
  for (let x = 302; x < 314; x += 6) K.dash(x, 560, x + 3, 560);
  // centre lines of the cross streets across this rect (one dash per 6 m, none across the bomb's crossing or the walks)
  for (const [z, x0, x1, gaps] of [[280, 560, 680, [[634, 666]], ], [430, 560, 680, [[586, 614]]], [700, 560, 578, []], [700, 623, 680, []], [840, 560, 680, [[586, 614]]]])
    for (let x = x0 + 1; x < x1 - 3; x += 6) if (!gaps.some(g => x + 3 > g[0] && x < g[1])) K.dash(x, z, x + 3, z);

  /* ---------- S1 the Hill Bomb: sidewalks, curbs, dashes ---------- */
  const skip = [[40, 62], [zS(420), zS(440)], [zS(546), zS(574)], [zS(830), zS(850)]];
  for (const side of [1, -1]) east_walk(K, bombPath, 20, zS(890), side * 9, side * 7, 4, skip);
  // (the bridge's own walks are painted, not built: a sloped block is solid right down to the street, and the Cut has to stay rideable under the deck)
  K.rail(593, -12.25, 546, 593, -13.09, 574, 'Curb', false); K.rail(607, -12.25, 546, 607, -13.09, 574, 'Curb', false);
  // the centre line, one dash per 4 m of s, broken at the crossings and under the bridge
  for (let s = 2; s < zS(906); s += 4) {
    const z = s <= 62 ? 230 + s : s >= 177.91 ? sZ(s) : 0;
    if (z && ((z > 268 && z < 292) || (z > 418 && z < 442) || (z > 544 && z < 576) || (z > 828 && z < 852))) continue;
    const a = bombPath(s), b = bombPath(s + 2); K.dash(a[0], a[1], b[0], b[1]);
  }
  P.spot('Hill Bomb', 650, -1.2, 252, Math.PI, [636, 230, 664, 300]);
  P.travel('Hill Bomb', 650, -1.2, 252, Math.PI, 'spot');
  { const pts = []; for (let s = 0; s < zS(910) + 0.1; s += 10) pts.push(bombPath(s).map(v => +v.toFixed(2)));
    P.line('Hill Bomb', pts, 'bomb', true); }
  // the streets in this part's rect, so --rhythm measures them (the other parts declare their own pieces)
  P.line('Crosstown Street (Cut, x 560..680)', [[560, 560], [680, 560]], 'push', true);
  P.line('Crest Road (Spine part)', [[560, 280], [680, 280]], 'push');
  P.line('Orchard Street (Spine part)', [[560, 430], [680, 430]], 'push');
  P.line('Mesa Street W (Spine part)', [[560, 700], [578, 700]], 'push');
  P.line('Mesa Street E (Spine part)', [[622, 700], [680, 700]], 'push');
  P.line('Bayview Road (Spine part)', [[560, 840], [680, 840]], 'push');

  /* ---------- S2 Crest Lookout ---------- */
  keep.push([594, 300, 620, 328]);
  K.ledge(598, 324, 616, 324.6);
  K.planter(598, 304, 602, 308); K.planter(612, 304, 616, 308);
  K.bench(603, 312, 611, 312.5); K.bench(603, 318, 611, 318.5);
  K.prop(613.8, -3.75, 321.8, 614.2, -2.55, 322.2, 0x3a3d42); K.prop(613.6, -2.55, 321.4, 614.4, -2.15, 322.8, 0x3a3d42);
  K.prop(603, -3.75, 302.5, 603.2, -1.4, 302.7, 0x3a3d42); K.prop(611, -3.75, 302.5, 611.2, -1.4, 302.7, 0x3a3d42);
  K.decorFns.push(D => D.sign('CREST LOOKOUT', 607, -2.0, 302.6, 8, 0.9, Math.PI, '#f0ece2', '#2e3f5c'));
  P.spot('Crest Lookout', 607, -3.75, 298, Math.PI, [594, 296, 620, 330]);
  P.tape(616.8, 323.2, -3.75);

  /* ---------- S3 the Crosstown Cut walls (x 560..680), abutments, deck, parapets, fascias ---------- */
  const NW = { 560: -12.19, 568: -11.99, 576: -11.97, 632: -12.19, 640: -12.57, 648: -13.08, 656: -13.71, 664: -14.43, 672: -15.20 };
  for (const k in NW) { const x0 = +k; K.B(x0 === 632 ? 631 : x0, -20.8, 546.5, x0 + 8, NW[k], 548.5, 'ledge', { edges: 's', color: 0xa7a39a }); }
  const SW = { 560: -13.03, 568: -12.80, 576: -12.77, 616: -12.77, 624: -12.80, 632: -13.03, 640: -13.43, 648: -13.99, 656: -14.66, 664: -15.41, 672: -16.20 };
  for (const k in SW) { const x0 = +k; K.B(x0, -20.8, 571.5, x0 + 8, SW[k], 573.5, 'ledge', { edges: 'n', color: 0xa7a39a }); }
  K.B(584, -20.8, 546.5, 615, -12.5, 548.5, 'garage');
  K.B(584, -20.8, 571.5, 616, -13.25, 573.5, 'garage');
  // The deck: a sloped block (the doc's one hubba) is solid from its top to the floor, so the street under it would be walled off.
  // Boxes only block where their bottom is, so the deck is 28 slabs 1 m long that follow the 3 % line in 3 cm steps (0.45 thick); steps of 6 cm made the rider hop.
  for (let z = 546; z < 574; z += 1) { const top = -12.40 - 0.84 * ((z + 0.5 - 546) / 28);
    K.B(589, top - 0.45, z, 611, top, z + 1, 'plaza', { color: 0x505257 });
    K.decorFns.push(D => { D.paint(589, z, 593, z + 1, top + 0.15, 0xb9b5ab); D.paint(607, z, 611, z + 1, top + 0.15, 0xb9b5ab); if (z % 4 === 0) D.paint(599.9, z, 600.1, z + 2, top + 0.012, 0xe2c044); }); }
  K.rail(589.2, -11.35, 546, 589.2, -12.19, 574, 'Rail', false); K.rail(610.8, -11.35, 546, 610.8, -12.19, 574, 'Rail', false);   // no posts: they would stand in the street below
  for (const x of [589.1, 610.9]) K.prop(x - 0.1, -12.9, 546, x + 0.1, -11.35, 574, 0xa7a39a);                                     // the parapet itself (looks only)
  K.prop(588.8, -14.3, 546, 589.0, -12.25, 574, 0xa7a39a); K.prop(611.0, -14.3, 546, 611.2, -12.25, 574, 0xa7a39a);
  K.decorFns.push(D => D.sign('EASTSIDE HILLS', 588.75, -13.4, 560, 20, 1.6, -Math.PI / 2, '#f0ece2', '#2e3f5c'));
  P.spot('Crosstown Bridge', 540, CT, 560, -Math.PI / 2, [500, 548, 640, 572]);
  P.travel('Crosstown Bridge', 540, CT, 560, -Math.PI / 2, 'spot');
  // lamps down the Cut on both walks (x 560..680; the ones under the bridge are left out)
  for (const x of [570, 630, 660]) { K.lamp(x, 549.6, -1); K.lamp(x + 8, 570.4, 1); }

  /* ---------- S4 the Bridge Steps ---------- */
  keep.push([612, 436, 634, 550]);
  K.B(615, -12.6, 524, 631, -11.6, 528, 'plaza');
  K.stairSpot('z', 528, 1, 617, 629, -11.6, -15.88, 14, 0.4, { rails: [617.45, 623, 628.55] });
  K.B(617, -20.8, 528, 629, -16.9, 533.2, 'step');
  K.B(617, -21, 533.2, 629, -15.88, 537.2, 'step');
  K.stairSpot('z', 537.2, 1, 617, 629, -15.88, CT, 14, 0.4, { rails: [617.45, 623, 628.55] });
  K.B(615, -20.8, 524, 617, -11.05, 548, 'ledge'); K.B(629, -20.8, 524, 631, -11.28, 548, 'ledge');
  P.spot('Bridge Steps', 623, -10.3, 500, Math.PI, [612, 496, 634, 548]);

  /* ---------- S5 the Underbridge DIY ---------- */
  K.hubbas.push({ a: V(600, -18.31, 548.6), b: V(600, -20.29, 553), w: 20, noRails: true, color: 0xa7a39a });
  K.hubbas.push({ a: V(600, -18.31, 571.4), b: V(600, -20.29, 567), w: 20, noRails: true, color: 0xa7a39a });
  K.jersey(592, 559.6, 608, 560.4);
  K.dumpster(616, 570, true); K.cone(618.6, 568.4); K.cone(619.6, 568.4);
  P.tape(611, 570, CT);
  P.spot('Underbridge DIY', 590, CT, 560, -Math.PI / 2, [584, 548, 616, 572]);

  /* ---------- S6 the Chute: coping along the bank tops, Mesa's bollards ---------- */
  for (const x of [581, 619]) for (let z = 704; z < 816; z += 8)
    K.rail(x, T(x, z) + 0.05, z, x, T(x, z + 8) + 0.05, z + 8, 'Coping', false);
  for (const x of [576, 624]) for (let z = 695; z <= 705; z += 1.5) K.prop(x - 0.125, T(x, z), z - 0.125, x + 0.125, T(x, z) + 0.9, z + 0.125, 0xd4a017);
  P.spot('The Chute', 600, -29.2, 700, Math.PI, [578, 696, 622, 830]);

  /* ---------- Crest Corner Skates ---------- */
  keep.push([658, 292, 682, 318]);
  K.building(662, 294, 680, 316, 2, 0xc98f6b, 'brick');
  { const g = -2.58;
    P.shop({ name: 'Crest Corner Skates', sign: [661.96, g + 3.85, 305, -Math.PI / 2, 7],
      awning: [660.4, 299, 662, 311, g + 2.2, 'x'], zone: [658.8, 301, 661.8, 309], door: [661.8, g, 305] });
    P.travel('Crest Corner Skates', 657, -2.6, 305, -Math.PI / 2, 'spot');
    K.trashCan(660.6, 311.5); K.newsBoxes(660.6, 298.5, false, 2); }
  P.spot('Crest Corner Skates', 657, -2.6, 305, -Math.PI / 2, [654, 296, 662, 314]);

  /* ---------- challenges ---------- */
  P.challenge({ id: 'east-bomb-speed', name: 'Hill Bomb', desc: 'Hit 62 km/h on the Plunge',
    at: [600, -15.7, 600], go: [650, -1.27, 252, Math.PI], kind: 'speed', speed: 62 / 3.6, area: [590, 600, 610, 760] });
  P.challenge({ id: 'east-bridge-rail', name: 'Bridge Steps Rail', desc: 'Grind a Bridge Steps handrail into the Cut',
    at: [623, -11.6, 526], go: [623, -10.32, 500, Math.PI], kind: 'grind', rail: 'Handrail', area: [616, 527, 630, 543] });
  P.challenge({ id: 'east-bomb-hard', hard: true, name: 'Terminal Velocity', desc: 'Hit 70 km/h on the Hill Bomb',
    at: [600, -31.7, 720], go: [650, -1.27, 252, Math.PI], kind: 'speed', speed: 70 / 3.6, area: [590, 600, 610, 760] });
  P.challenge({ id: 'east-chute-line', hard: true, name: 'Run the Chute', desc: 'Two grinds in one line through the Chute, 2,500 points or more',
    at: [600, -29.2, 700], go: [600, -21.1, 640, Math.PI], kind: 'line', pts: 2500, area: [580, 696, 620, 830], need: [['grind', 2]] });

  /* ---------- filler: something skateable at the edges of every street (CONTRACT 7) ---------- */
  const item = (x0, z0, x1, z1) => keep.push([Math.min(x0, x1) - 0.4, Math.min(z0, z1) - 0.4, Math.max(x0, x1) + 0.4, Math.max(z0, z1) + 0.4]);
  // a low ground-hugging wall along a straight line (a garden wall, a planter edge) in chords of at most 6 m that meet end to end,
  // with one grind line down the middle of the top (half the grind lines of K.strip, which grinds both edges). top(x, z): what it stands on.
  const wall = (ax, az, bx, bz, hgt = 0.45, w = 0.6, top = T) => {
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 6)); let p = V(ax, top(ax, az) + hgt, az);
    for (let i = 1; i <= n; i++) { const x = ax + (bx - ax) * i / n, z = az + (bz - az) * i / n, q = V(x, top(x, z) + hgt, z), hi = p.y >= q.y;
      K.hubbas.push({ a: hi ? p : q, b: hi ? q : p, w, noRails: true, kind: 'Ledge', color: 0xa39d90 }); K.rail(p.x, p.y, p.z, q.x, q.y, q.z, 'Ledge', false); p = q; }
    item(ax - w, az - w, bx + w, bz + w); };
  // the same along the bomb, from s0 to s1 at offset o (+ west going south), in 5 m pieces
  const bwall = (s0, s1, o, hgt = 0.4) => { for (let s = s0; s < s1 - 0.01; s += 5) { const e = Math.min(s1, s + 5), a = at(s, o), b = at(e, o); wall(a[0], a[1], b[0], b[1], hgt); } };
  // a retaining wall up the hill side of a street: it stands hgt over the higher of the street and the ground `back` m behind it
  const retain = (ax, az, bx, bz, back, hgt = 0.45) => { const L = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / L * back, nz = (bx - ax) / L * back;
    wall(ax, az, bx, bz, hgt, 0.6, (x, z) => Math.max(T(x, z), T(x + nx, z + nz))); };
  const bench = (x0, z0, x1, z1) => { K.bench(x0, z0, x1, z1); item(x0, z0, x1, z1); };
  const planter = (x0, z0, x1, z1) => { K.planter(x0, z0, x1, z1); item(x0, z0, x1, z1); };
  const hyd = (x, z) => { K.hydrant(x, z); item(x - 0.3, z - 0.3, x + 0.3, z + 0.3); };

  // the Hill Bomb's sidewalk edges, alternating sides, a ledge to grind roughly every 50 m (not in the road lane)
  bwall(24, 36, 9.6); bwall(90, 102, 9.6); bwall(130, 142, -9.6);
  for (const [z0, z1, o] of [[396, 408, 9.6], [450, 462, -9.6], [485, 497, 9.6], [628, 642, 9.6], [668, 682, -9.6], [704, 716, 9.6],
    [738, 750, -9.6], [800, 812, -9.6], [858, 870, -9.6]]) bwall(zS(z0), zS(z1), o);
  // pull-off pockets: a shelter and bench on the walk, a bank behind it
  const bank = (x, z, dir) => K.hubbas.push({ a: V(x + dir * 3, T(x + dir * 3, z) + 0.8, z), b: V(x, T(x, z) + 0.02, z), w: 4, noRails: true, color: 0xa7a39a });
  K.busStop(609, 410, false, 1); item(607.5, 407.5, 611, 413); bank(611.6, 410, 1); item(611, 407, 615, 413);
  P.spot('Spine Lay-by', 609, T(609, 420), 421, Math.PI, [603, 404, 617, 418]);
  K.construction(591, 774, false); item(589, 766, 593, 782);                      // roadworks on the Chute's walk
  P.spot('Chute Roadworks', 591, T(591, 760), 760, Math.PI, [588, 760, 594, 786]);
  K.busStop(591, 880, false, -1); item(589.5, 877, 593, 883); hyd(593.2, 872);
  P.spot('Bayview Lay-by', 591, T(591, 866), 866, Math.PI, [586, 860, 596, 888]);

  // Crosstown Street through the Cut (x 560..680): benches, planters, roadworks and a bus stop on the walks
  planter(563, 551.3, 569, 552.9); bench(576, 568.2, 584, 568.8);
  planter(618, 568.0, 624, 569.6); K.construction(642, 550.5, true); item(636, 548.8, 648, 552.2);
  K.busStop(656, 569.5, true, 1); item(653.5, 568.5, 658.5, 570.5); planter(667, 551.3, 673, 552.9); K.newsBoxes(676, 569.2, true, 2); hyd(679, 568.6);
  // Crest Road (z 280): a retaining wall up the hill side, a shelter, planters and garden walls
  retain(562, 270.3, 588, 270.3, -2);
  K.busStop(612, 288.4, true, 1); item(609.5, 287.4, 614.5, 289.4); planter(633, 270.3, 639, 271.9); hyd(631.5, 289.2);
  wall(662, 270.3, 676, 270.3); bench(664, 287.6, 672, 288.2); K.newsBoxes(676.5, 288.6, true, 2); wall(570, 289.6, 582, 289.6);
  // Orchard Street (z 430)
  wall(562, 438.5, 572, 438.5); planter(580, 421.2, 586, 422.8); hyd(588.5, 438.8);
  planter(612, 421.2, 618, 422.8); wall(632, 421.6, 642, 421.6); bench(648, 438.0, 656, 438.6); K.newsBoxes(664, 438.6, true, 2); wall(668, 421.6, 678, 421.6);
  // Mesa Street (z 700): the east end, and the west end by the bollards
  wall(562, 707.4, 572, 707.4); bench(640, 692.2, 648, 692.8); wall(654, 707.4, 666, 707.4); planter(670, 706.0, 676, 707.6);
  // Bayview Road (z 840)
  wall(566, 830.7, 578, 830.7); planter(588, 848.4, 594, 850); bench(612, 831.2, 620, 831.8); wall(632, 849.3, 644, 849.3);
  planter(656, 830.4, 662, 832); K.newsBoxes(670, 848.6, true, 2); hyd(676.5, 848.4);

  east_spine_bombKit(K, P, keep);

  /* ---------- the Spine frontage: 10 houses ---------- */
  const HC = [0xd9c7a8, 0xc9a27e, 0xb8c4c9, 0xe0d6c2, 0xa9b89a];
  const houses = [[564, 446, 582, 460], [564, 470, 582, 484], [564, 494, 582, 508],      // west, Orchard to the Cut
    [564, 584, 582, 598], [564, 610, 582, 624], [564, 636, 582, 650],                    // west, the Cut to Mesa
    [638, 446, 656, 460], [638, 478, 656, 492],                                          // east, Orchard to the Cut (clear of the Bridge Steps run-up)
    [620, 592, 638, 606], [620, 624, 638, 638]];                                         // east, the Cut to Mesa
  houses.forEach((h, i) => { keep.push([h[0] - 1, h[1] - 1, h[2] + 1, h[3] + 1]); K.building(h[0], h[1], h[2], h[3], 2, HC[i % 5], i % 2 ? 'brick' : 'stone'); });

  /* ---------- lamps and trees, last, so they keep clear of everything above ---------- */
  for (let s = 70; s <= zS(880); s += 30) for (const side of [1, -1]) {
    const [x0, z] = at(s, 0); if (z < 270 || (z > 268 && z < 292) || (z > 416 && z < 444) || (z > 530 && z < 590) || (z > 826 && z < 854)) continue;
    const inChute = z > 696 && z < 830, [x, zz] = inChute ? [600 - side * 21.5, z] : at(s, side * 12);
    if (!inK(x, zz, 1.5)) K.lamp(x, zz, -side);
  }
  const lampsAt = [[572, 549.8, -1], [641, 549.8, -1], [666, 549.8, -1], [566, 570.2, 1], [626, 570.2, 1], [662, 570.2, 1]];
  for (const [x, z, sd] of lampsAt) if (!inK(x, z, 1.2)) K.lamp(x, z, sd);
  for (const [c, a, b] of [[280, 566, 676], [430, 566, 676], [700, 566, 676], [840, 566, 676]]) for (let x = a + 3; x < b; x += 18) for (const sd of [-1, 1]) {
    const z = c + sd * 13.5; if (inK(x, z, 1.8) || Math.abs(x - 650) < 16 && c === 280 || Math.abs(x - 600) < 20 || (c === 700 && ((x > 576 && x < 624) || x > 630 && x < 654))) continue;
    if (bdist(x, z) < 16 && z < 400 || x > 636 && x < 660 && z > 400 && z < 440) continue;
    K.tree(x, z); }
  // a tree on each front lawn, and a few round the Lookout
  for (const [x, z] of [[585.5, 453], [585.5, 477], [585.5, 501], [585.5, 591], [585.5, 617], [585.5, 643], [614.5, 599], [614.5, 631],
    [589, 309], [589, 322], [625, 311], [625, 323]]) if (!inK(x, z, 1.8) && bdist(x, z) > 12.5) { K.tree(x, z); }
}

/* The bomb's edges (the user's ask: no dead road between spots). Everything here sits on the sidewalks or in the outer
   1.8 m of the 7 m half-road; the middle 10 m of the lane stays clear at speed.
   * driveway kicks: one per frontage house, a 0.3 m curb-cut wedge from the road edge up past the sidewalk top, so you can
     kick up onto the walk (and its ledges) at speed;
   * carve banks: three 6 m wedges on the outside of each Crest Bend arc, road edge to the back of the walk, 0.9 m;
   * crossing gaps: a kicker at the end of the walk before the Orchard and Bayview crossings, to ollie the crossing. */
function east_spine_bombKit(K, P, keep) {
  const T = (x, z) => K.terrainH(x, z), at = east_spine_at;
  const C = 0xb9b5ab, BANK = 0xa7a39a;
  // driveway kicks: west houses front x 582 (walk x 589..593), east houses front x 638 (walk x 607..611)
  for (const z of [453, 477, 501, 591, 617, 643]) K.hubbas.push({ a: V(593, T(593, z) + 0.3, z), b: V(594.8, T(594.8, z) + 0.01, z), w: 3, noRails: true, color: C });
  for (const z of [453, 485, 599, 631]) K.hubbas.push({ a: V(607, T(607, z) + 0.3, z), b: V(605.2, T(605.2, z) + 0.01, z), w: 3, noRails: true, color: C });
  // carve banks on the outside of the bends (arc 1 turns right: outside is o < 0; arc 2 turns left: outside is o > 0)
  for (const [s, o] of [[76, -1], [90, -1], [104, -1], [134, 1], [148, 1], [162, 1]]) {
    const [ax, az] = at(s, o * 10.8), [bx, bz] = at(s, o * 7);
    K.hubbas.push({ a: V(ax, T(ax, az) + 0.9, az), b: V(bx, T(bx, bz) + 0.02, bz), w: 6, noRails: true, color: BANK });
    keep.push([Math.min(ax, bx) - 3, Math.min(az, bz) - 3, Math.max(ax, bx) + 3, Math.max(az, bz) + 3]);
  }
  // crossing gaps: west walk over Orchard (z 420..440), east walk over Bayview (z 830..850)
  // (kickers only: a landing ramp in a flush crossing catches riders cutting the corner, so you land on the crossing itself)
  for (const [x, z] of [[590, 417.5], [610, 827.5]]) K.hubbas.push({ a: V(x, T(x, z + 2) + 0.45, z + 2), b: V(x, T(x, z) + 0.02, z), w: 1.6, noRails: true, color: 0xc49a5c });
  keep.push([588, 415, 594, 421], [606, 825, 612, 831]);
  P.spot('Orchard Crossing Gap', 591, T(591, 410), 410, Math.PI, [588, 410, 594, 442]);
}

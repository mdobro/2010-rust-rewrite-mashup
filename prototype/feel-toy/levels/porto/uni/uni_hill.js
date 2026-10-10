/* University (uni), the plateau and the north face. Rect [496, 1000, -230, 40]. Design: levels/porto/design/uni.md sections 4 (S1/S2/S5 rim decks,
   S4-S12, S14, S15), 7 and 13. Builds: the plateau streets, every Rampart rim box, the Library, Quad, Old Main, Greek Theatre, Scholar's Wave,
   Science Hall, Lecture Row, Gateway, West Thirteen, Gallery, Campanile, Hillside Halls, lamps, trees, filler, tapes and four challenges. */
function uni_hill(K, P, PL) {
  PL = PL || uni_plan();
  const keep = [];   // rects [x0, z0, x1, z1] that trees keep out of
  uni_hill_streets(K, P, PL);
  uni_hill_rims(K, P, PL);
  uni_hill_library(K, P, PL);
  uni_hill_quad(K, P, PL, keep);
  uni_hill_arts(K, P, PL);
  uni_hill_science(K, P, PL);
  uni_hill_row(K, P, PL);
  uni_hill_gate(K, P, PL);
  uni_hill_west(K, P, PL);
  uni_hill_campanile(K, P, PL);
  uni_hill_halls(K, P, PL, keep);
  uni_hill_filler(K, P, PL);
  uni_hill_trees(K, P, PL, keep);
  uni_hill_misc(K, P, PL);
}

/* ---- the plateau K.streets, the chamfers where flush paving meets them, Ridge Road dashes and the lamps ---- */
function uni_hill_streets(K, P, PL) {
  const T = K.terrainH, chamfer = 0xb9b5ab;
  K.street('z', 650, -120, 32, 6, [0], { rw: 7, sw: 4, lamps: false });          // Campus Drive on the plateau
  K.street('x', 0, 520, 643, 6, [], { rw: 7, sw: 4, lamps: false });             // University Avenue on the plateau (to the Drive's road edge)
  for (const s of [-1, 1]) {
    K.hubbas.push({ a: V(520, 6.15, s * 9), b: V(519.4, T(519.4, s * 9) + 0.01, s * 9), w: 4, noRails: true, color: chamfer });
    for (const z of [-120, 32]) { const zz = z + (z < 0 ? -0.6 : 0.6), x = 650 + s * 9;
      K.hubbas.push({ a: V(x, 6.15, z), b: V(x, T(x, zz) + 0.01, zz), w: 4, noRails: true, color: chamfer }); }
  }
  K.dash(650, -228, 650, -122);                                                    // Ridge Road's centre line
  // lamps: Ridge Road both sides every 24 m (on the sidewalk's outer edge), the plateau Drive and Avenue every 24 m
  for (let z = -204; z <= -128; z += 24) for (const s of [-1, 1]) K.lamp(650 + s * (8.5 + 3 * Math.min(1, Math.max(0, (z + 140) / 16))), z, s);
  for (const z of [-108, -84, -60, -36, 18, 26]) for (const s of [-1, 1]) K.lamp(650 + s * 10.4, z, s);
  for (const x of [532, 556, 580, 604, 628]) for (const s of [-1, 1]) K.lamp(x, s * 10.4, s);
}

/* ---- every Rampart rim box: south decks (S1, S2, S4, S5) and the west rim (S15) ---- */
function uni_hill_rims(K, P, PL) {
  const B = K.B;
  B(546, 0, 32, 600, 6, 40, 'marble', { edges: 's' });          // S1 top deck (its east 2 m is the Great Bank's cheek)
  B(600, 0, 32, 616, 6, 40, 'marble', { edges: 's' });          // S2 rim over the Great Bank
  B(674, 0, 32, 736, 6, 40, 'marble', { edges: 's' });          // S4 rim over the Kinked Twelve
  B(736, 0, 32, 904, 6, 40, 'marble', { edges: 's' });          // S5 the Terrace Stands deck
  // S15 west rim: the lips are the box edges, left off over the stairs
  B(504, 0, -64, 512, 6, -52.5, 'marble', { edges: 'w' });
  B(504, 0, -52.5, 512, 6, -35.5, 'marble', { edges: '' });
  B(504, 0, -35.5, 512, 6, -24, 'marble', { edges: 'w' });
  P.spot('Great Steps', 572, 6, 24, Math.PI, [540, 12, 604, 72]);
  P.travel('Great Steps', 572, 6, 24, Math.PI, 'spot');
  P.spot('Kinked Twelve', 704, 6, 20, Math.PI, [690, 10, 718, 60]);
  P.spot('Terrace Stands', 820, 6, 24, Math.PI, [736, 16, 904, 60]);
  P.spot('West Thirteen', 520, 6, -44, Math.PI / 2, [494, -60, 600, -28]);
  P.challenge({ id: 'uni-steps-gap', name: 'Great Steps Gap', desc: 'Ollie the whole double flight from the top deck to the Commons',
    at: [572, 6, 36], go: [572, 6, 20, Math.PI], kind: 'gap', from: [548, 32, 596, 40, 5.6], to: [546, 49, 598, 72, 1.5] });
  P.challenge({ id: 'uni-thirteen-kf', hard: true, name: 'Kickflip the West Thirteen', desc: 'Kickflip the whole thirteen-stair into Rampart Lane',
    at: [508, 6, -44], go: [540, 6, -44, Math.PI / 2], kind: 'trick', tricks: ['Kickflip'], from: [504, -52, 512, -36, 5.6], to: [470, -56, 499, -32, -1, 2.4] });
}

/* ---- S6 Founders Library, the Library Steps, the Reading Ledges, the West Podium Bank, the East Six ---- */
function uni_hill_library(K, P, PL) {
  const B = K.B;
  K.building(744, -116, 876, -100, 5, 0xd8cbb0, 'stone');
  B(720, 5, -100, 900, 7.8, -86, 'marble', { edges: 'we' });
  K.lip(720, -86, 797.5, -86, 7.8); K.lip(838.5, -86, 900, -86, 7.8);
  K.stairSpot('z', -86, 1, 798, 822, 7.8, 6, 6, 0.42, { rails: [803, 810, 817], hubbas: [797.6, 822.4], bank: [826, 838] });
  B(730, 7.8, -94, 770, 8.25, -93.4, 'marble', { edges: 'ns' });
  B(850, 7.8, -94, 890, 8.25, -93.4, 'marble', { edges: 'ns' });
  K.hubbas.push({ a: V(720, 7.8, -93), b: V(714, 6.02, -93), w: 12, noRails: true, color: 0xc4bfb3 });
  K.stairSpot('x', 900, 1, -100, -86, 7.8, 6, 6, 0.42, { rails: [-93] });
  B(894, 7.8, -99, 898, 8.4, -96, 'ledge', { edges: 'nswe' });
  B(722, 7.8, -99, 726, 8.4, -96, 'ledge', { edges: 'nswe' });
  P.spot('Founders Library', 810, 7.8, -96, Math.PI, [714, -120, 906, -80]);
  P.tape(899.2, -97.5, 7.8);
  P.spot('West Podium Bank', 714, 6, -108, Math.PI, [704, -124, 726, -90]);
  P.challenge({ id: 'uni-lib-hubba', name: 'Library Hubba', desc: 'Grind a hubba beside the Library Steps',
    at: [797.6, 7.8, -88], go: [797.6, 7.8, -97, Math.PI], kind: 'grind', rail: 'Hubba', area: [796.5, -86.5, 823.5, -83.5, 6] });
  K.decorFns.push(D => {
    D.sign('FOUNDERS LIBRARY', 810, 19.0, -99.95, 20, 2, 0, '#f0ece2', '#2e3f5c');
    D.add(new THREE.CylinderGeometry(9, 9, 4, 24), 0xcdbf9f, [810, 25, -108]);                          // the drum
    D.add(new THREE.SphereGeometry(10, 24, 12), 0x6b7a5e, [810, 29, -108]);                             // the dome
  });
  P.landmark({ at: [810, 6, -108], near: 140, parts: [
    { shape: 'box', at: [0, 8.5, 0], size: [132, 17, 16], color: 0xd8cbb0 },
    { shape: 'cyl', at: [0, 19, 0], size: [18, 4, 18], color: 0xcdbf9f },
    { shape: 'sphere', at: [0, 23, 0], size: [20, 14, 20], color: 0x6b7a5e }] });
}

/* ---- S7 the Quad: ledges, the Wishing Well, benches, trees and lamps ---- */
function uni_hill_quad(K, P, PL, keep) {
  for (const l of [[803.4, -70, 804, -40], [816, -70, 816.6, -40], [803.4, -16, 804, 6], [816, -16, 816.6, 6],
    [736, -34.6, 796, -34], [824, -34.6, 884, -34], [736, -22, 796, -21.4], [824, -22, 884, -21.4]]) K.ledge(...l, 0.45, 'marble');
  K.fountainBowl(810, -28, 5, 1.4);
  // benches on the perimeter walk, along the outer lawn edges
  for (const x of [746, 776, 836, 866]) { K.bench(x, -74.9, x + 7, -74.4); K.bench(x, 9.2, x + 7, 9.7); }
  for (const z of [-62, -44, -10, 2]) { K.bench(730.4, z, 730.9, z + 7); K.bench(889.1, z, 889.6, z + 7); }
  // 3 trees on each outer lawn edge (24 in all)
  for (const [x0, x1] of [[732, 804], [816, 888]]) for (const [z0, z1] of [[-72, -34], [-22, 8]]) {
    for (const f of [0.25, 0.5, 0.75]) {
      K.tree(x0 + (x1 - x0) * f, z0 + 2); K.tree(x0 + (x1 - x0) * f, z1 - 2);
      if (f === 0.5) { K.tree(x0 + 2, (z0 + z1) / 2); K.tree(x1 - 2, (z0 + z1) / 2); }
    } }
  // lamps round the perimeter
  for (const [x, z] of [[726.5, -78.5], [768, -78.5], [810, -78.5], [852, -78.5], [893.5, -78.5], [893.5, -34], [893.5, 10], [852, 10.5], [810, 10.5], [768, 10.5], [726.5, 10.5], [726.5, -34]]) K.lamp(x, z, 1);
  keep.push([724, -80, 896, 14]);
  P.spot('The Quad', 810, 6, 8, 0, [724, -80, 896, 14]);
  P.tape(810, -28, 4.6);
  P.challenge({ id: 'uni-quad-line', hard: true, name: 'Quad Line', desc: 'In one line from the Quad: two grinds and a manual, 3,000 points or more',
    at: [810, 6, 8], go: [810, 6, 10, 0], kind: 'line', pts: 3000, area: [724, -86, 896, 14], need: [['grind', 2], ['Manual', 1]] });
}

/* ---- S8 Old Main, S9 the Greek Theatre and the Long Lane, S10 Scholar's Wave, the Gallery ---- */
function uni_hill_arts(K, P, PL) {
  const B = K.B;
  // Old Main and its forecourt
  K.building(528, -116, 612, -80, 4, 0xcdbf9f, 'stone');
  B(540, 5, -80, 600, 7.2, -68, 'marble', { edges: 'we' });
  K.stairSpot('z', -68, 1, 560, 580, 7.2, 6, 4, 0.42, { rails: [570], hubbas: [559.6, 580.4] });
  K.lip(540, -68, 559, -68, 7.2); K.lip(581, -68, 600, -68, 7.2);
  K.decorFns.push(D => D.sign('OLD MAIN', 570, 15.5, -79.95, 12, 1.6, 0, '#f0ece2', '#2e3f5c'));
  P.spot('Old Main', 570, 6, -62, 0, [530, -82, 610, -52]);
  // the Greek Theatre: six tiers stepping down to the west, a back wall, the Theatre Bank, the stage
  for (let k = 0; k < 6; k++) B(620 - 1.6 * (k + 1), 5.8, -60, 620 - 1.6 * k, 8.7 - 0.45 * k, -30, 'ledge', { edges: 'w' });
  B(620, 5.8, -60, 622, 8.7, -30, 'marble', { edges: 'ns' });
  K.hubbas.push({ a: V(622, 8.7, -45), b: V(634, 6.02, -45), w: 10, noRails: true, color: 0xc4bfb3 });
  B(596, 5.8, -54, 606, 6.6, -36, 'wood', { edges: 'nswe' });
  P.spot('Greek Theatre', 628, 6, -45, Math.PI / 2, [590, -64, 640, -26]);
  P.tape(619, -58, 8.7);
  // Scholar's Wave: a bank to a wall facing the Avenue, a bronze knot, two pads
  K.bankToWall(540, -24, 580, 1.4, 4);
  K.pad(588, -20, 600, -14, 0.25); K.pad(524, -20, 532, -14, 0.25);
  K.decorFns.push(D => D.add(new THREE.TorusKnotGeometry(0.9, 0.28, 48, 8), 0x6b7a5e, [560, 9.5, -25.3], [0, 0, 0], [1, 1, 1], { metalness: 0.5, roughness: 0.5 }));
  P.spot("Scholar's Wave", 560, 6, -8, 0, [536, -28, 584, -4]);
  // Hallam Gallery (the plateau's south-west corner)
  K.building(504, 20, 546, 40, 3, 0xd8cbb0, 'stone');
  K.decorFns.push(D => D.sign('HALLAM GALLERY', 525, 10.2, 19.95, 14, 1.6, Math.PI, '#f0ece2', '#2e3f5c'));
}

/* ---- S11 Science Hall dock and Science Plaza ---- */
function uni_hill_science(K, P, PL) {
  K.building(672, -116, 706, -74, 4, 0xd8cbb0, 'office');
  K.loadingDock(676, -74, 696, 1);
  K.rail(696, 6.42, -24, 712, 6.42, -24, 'Flatbar', true);
  K.pad(678, -44, 692, -38, 0.2); K.pad(678, -10, 692, -4, 0.2);
  K.ledge(700, -60, 716, -59.4); K.ledge(714, 8, 730, 8.6);
  P.spot('Science Hall Dock', 690, 6, -64, Math.PI, [672, -72, 720, -30]);
}

/* ---- S12 Lecture Row stoops ---- */
function uni_hill_row(K, P, PL) {
  const B = K.B;
  for (const [z0, z1] of [[-116, -86], [-76, -46], [-36, -6]]) {
    K.building(924, z0, 972, z1, 4, 0xcdbf9f, 'stone');
    B(916, 5, z0 + 6, 924, 7.2, z1 - 6, 'marble', { edges: 'nsw' });
    if (z0 === -76) {
      K.hubbas.push({ a: V(916, 7.2, -61), b: V(908, 6.02, -61), w: 12, noRails: true, color: 0xc4bfb3 });
    } else K.stairSpot('x', 916, -1, z0 + 9, z1 - 9, 7.2, 6, 4, 0.4, { rails: [(z0 + z1) / 2] });
  }
  P.spot('Lecture Row', 904, 6, -50, 0, [900, -118, 924, -4]);
}

/* ---- S14 the Campus Gateway ---- */
function uni_hill_gate(K, P, PL) {
  K.B(514, 6, -16, 518, 12.4, -12, 'marble');
  K.B(514, 6, 12, 518, 12.4, 16, 'marble');
  K.prop(513.5, 11.2, -16, 518.5, 12.6, 16, 0xd8cbb0);
  K.decorFns.push(D => D.sign('UNIVERSITY OF PORTO ALTO', 513.4, 11.9, 0, 22, 1.4, -Math.PI / 2, '#f0ece2', '#2e3f5c'));
}

/* ---- S15 the West Thirteen ---- */
function uni_hill_west(K, P, PL) {
  K.stairSpot('x', 504, -1, -52, -36, 6, 1.95, 13, 0.4, { rails: [-48, -40], hubbas: [-52.4, -35.6] });
}

/* ---- the Campanile ---- */
function uni_hill_campanile(K, P, PL) {
  K.building(803, 16, 817, 30, 13, 0xd8cbb0, 'stone');
  K.decorFns.push(D => {
    D.prop(802, 50, 15, 818, 55, 31, 0xcdbf9f);
    for (const [x0, z0, x1, z1] of [[807, 14.85, 813, 15.05], [807, 30.95, 813, 31.15], [801.85, 20, 802.05, 26], [817.95, 20, 818.15, 26]]) D.prop(x0, 50.8, z0, x1, 54, z1, 0x3a3d42);
    D.add(new THREE.CylinderGeometry(0, 8, 9, 20), 0x6b7a5e, [810, 59.5, 23]);
  });
  P.landmark({ at: [810, 6, 23], near: 140, parts: [
    { shape: 'box', at: [0, 22, 0], size: [14, 44, 14], color: 0xd8cbb0 },
    { shape: 'box', at: [0, 46.5, 0], size: [16, 5, 16], color: 0xcdbf9f },
    { shape: 'cone', at: [0, 53.5, 0], size: [16, 9, 16], color: 0x6b7a5e }] });
}

/* ---- Hillside Halls: three dorms on the north-face slope ---- */
function uni_hill_halls(K, P, PL, keep) {
  for (const [x0, z0, x1, z1, f] of [[676, -200, 716, -150, 4], [820, -196, 870, -150, 4], [900, -196, 960, -146, 5]]) {
    K.building(x0, z0, x1, z1, f, 0xa86b55, 'brick');
    keep.push([x0 - 3, z0 - 3, x1 + 3, z1 + 3]);
    // a low garden wall along the dorm's street side, to ollie onto
    K.ledge(x0 + 4, z1 + 3, x1 - 4, z1 + 3.6, 0.45, 'ledge');
  }
  // dorm lawns: 12 trees round the three halls
  for (const [x, z] of [[670, -190], [670, -165], [722, -185], [722, -160], [814, -185], [814, -160], [876, -185], [876, -160], [895, -185], [895, -160], [966, -180], [966, -160]]) K.tree(x, z);
}

/* ---- the north face's scattered trees (30, off the road and the dorms) ---- */
function uni_hill_trees(K, P, PL, keep) {
  let n = 0, tries = 0;
  const ok = (x, z) => !keep.some(r => x > r[0] && x < r[2] && z > r[1] && z < r[3]);
  while (n < 30 && tries++ < 600) {
    const x = K.R(520, 965), z = K.R(-208, -132);
    if (Math.abs(x - 650) < 16 || z > -128 || !ok(x, z)) continue;
    if (z > -150 && x > 656 && x < 750) continue;        // the Brow Walk's approach
    K.tree(x, z); n++;
  }
}

/* ---- filler: the small skateable things that keep every street, path and line from going dead (CONTRACT 7) ---- */
function uni_hill_filler(K, P, PL) {
  const T = K.terrainH, B = K.B;
  const wall = (ax, az, bx, bz, h = 0.45, w = 0.6) => K.strip(ax, az, bx, bz, h, w, { kind: 'Ledge', color: 0xa39d90, seg: 4 });
  // Ridge Road (10 % up from the gate): low garden walls beside the sidewalks, alternating sides, then a pull-off pocket at the brow
  wall(641.1, -212, 641.1, -198); wall(659, -188, 659, -174); wall(641.1, -164, 641.1, -150);
  // the Ridge Brow pocket: a bench, a ledge and a small bank off the road's east side
  K.bench(660.4, -146, 667, -145.4); K.ledge(662, -136, 676, -135.4); K.hubbas.push({ a: V(670, T(670, -141) + 0.7, -141), b: V(664, T(664, -141) + 0.02, -141), w: 6, noRails: true, color: 0xc4bfb3 });
  P.spot('Ridge Brow', 664, T(664, -141), -150, 0, [656, -156, 680, -130]);
  // Campus Drive on the plateau: ledges on the sidewalk's outer edge, alternating sides
  const swl = (x0, z0, x1, z1) => B(x0, 5.5, z0, x1, 6.6, z1, 'ledge', { edges: Math.abs(x1 - x0) > Math.abs(z1 - z0) ? 'ns' : 'ew' });   // 0.45 over the 6.15 sidewalk
  for (const z of [-104, -72, -24, 18]) swl(656.6, z, 657.2, z + 9);
  for (const z of [-90, -16, 4]) swl(642.8, z, 643.4, z + 8);
  K.busStop(654, -96, false, 1);
  // University Avenue on the plateau: ledges on the sidewalks' outer edges, both lines (Avenue and Forecourt) read them
  for (const x of [526, 556, 586, 616]) swl(x, 9.6, x + 9, 10.2);
  for (const x of [540, 570, 600, 628]) swl(x, -10.2, x + 9, -9.6);
  // Gallery Forecourt planters and benches at the ends, the run-up (x 548..596) stays open
  K.planter(528, 15, 536, 17.4, 0.55); K.planter(606, 15, 614, 17.4, 0.55); K.planter(624, 15, 632, 17.4, 0.55);
  K.bench(540, 14, 546, 14.5); K.bench(598, 14, 604, 14.5);
  // Rampart Lane (x 496): ledges along the wall's foot, clear of the West Thirteen's roll-out (z -56..-32)
  for (const [z0, z1] of [[-116, -104], [-92, -80], [-70, -60], [-28, -24.5]]) K.ledge(500.4, z0, 501, z1, 0.45, 'ledge');
  // the Long Lane (z -58..-32): manual pads on its flanks keep the 84 m run-up from going dead, the middle stays clear
  K.pad(528, -53.5, 538, -50.5, 0.2); K.pad(554, -37.5, 564, -34.5, 0.2); K.pad(580, -53.5, 590, -50.5, 0.2);
  // Brow Walk (z -126..-120): ledges on its north edge
  for (const x of [668, 694, 720]) K.ledge(x, -127.2, x + 10, -126.6, 0.45, 'ledge');
}

/* ---- tapes and signs that don't belong to a spot, plus the odd breather ---- */
function uni_hill_misc(K, P, PL) {
  P.spot('Ridge Climb', 650, 1.0, -226, Math.PI, [636, -230, 664, -200]);
  P.travel('Ridge Climb', 650, 1.0, -226, Math.PI, 'spot');
}

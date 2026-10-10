/* Eastside Hills, the south-east part: x 680..1000, z 580..910 (design/east.md 4.12-4.15 and 13).
   Bayview Center (the shops, the raised walkway, Gravity Skate Supply, the lot, the wall and the Bayview Ten, the
   hubbas, the railing, the loading docks), the Moonrise Drive-In (hump rows, snack bar and ramp, screen, ticket
   booth), Mesa Street E, Bayview Road east of the Spine, Terrace Avenue south of Crosstown, the houses along them,
   and the filler that keeps those streets and the lot from ever going dead (CONTRACT 7). */
function east_south(K, P, PL) {
  const keep = [];                                    // rects [x0, z0, x1, z1] that trees and lamps stay out of
  const inK = (x, z, m = 0) => keep.some(r => x > r[0] - m && x < r[2] + m && z > r[1] - m && z < r[3] + m);
  const tree = (x, z) => { if (P.inside(x, z, 3) && !inK(x, z, 2.5)) K.tree(x, z); };
  const lamp = (x, z, s) => { if (P.inside(x, z, 3) && !inK(x, z, 1)) K.lamp(x, z, s); };
  const house = (x0, z0, x1, z1, floors, color, tex) => { keep.push([x0, z0, x1, z1]); return K.building(x0, z0, x1, z1, floors, color, tex); };
  east_south_streets(K, P, PL, keep);
  east_south_mall(K, P, keep);
  east_south_drivein(K, P, keep);
  east_south_houses(K, house);
  east_south_filler(K, P, keep);
  east_south_trees(K, tree, lamp);
}

/* Mesa Street E, Bayview Road east of the Spine and Terrace Avenue south of Crosstown: centre lines and the lines for --rhythm. */
function east_south_streets(K, P, PL, keep) {
  for (let x = 681; x < 806; x += 6) K.dash(x, 700, x + 3, 700);                         // Mesa E (x 622..830), broken at Terrace
  for (let x = 681; x < 970; x += 6) if (x + 3 < 806) K.dash(x, 840, x + 3, 840);   // Bayview Road, broken at Terrace
  for (let z = 583; z < 850; z += 6) if (!(z + 3 > 686 && z < 714) && !(z + 3 > 826 && z < 854) && !(z > 712 && z < 828)) K.dash(820, z, 820, z + 3);   // Terrace, broken at Mesa and Bayview
  P.line('Mesa Street E (south part)', [[680, 700], [830, 700]], 'push');
  P.line('Bayview Road E', [[680, 840], [975, 840]], 'push');
  P.line('Terrace Avenue S', [[820, 580], [820, 850]], 'push');
  P.line('Bayview walkway', [[690, 768], [806, 768]], 'push', true);
  P.line('Moonrise lot', [[906, 604], [906, 796]], 'push', true);
}

/* S12 + S13 + S14: Bayview Center and its docks. */
function east_south_mall(K, P, keep) {
  const T = (x, z) => K.terrainH(x, z);
  // the three shops along the north of the lot, and the raised walkway in front of them
  K.building(690, 744, 724, 762, 1, 0xd8d2c4, 'office');
  K.building(724, 744, 760, 762, 1, 0xd8d2c4, 'office');
  K.building(760, 744, 802, 762, 1, 0xd8d2c4, 'office');
  keep.push([690, 744, 802, 762]);
  K.B(690, -33.6, 762, 802, -32.54, 766, 'sidewalk', { edges: 's' });
  K.hubbas.push({ a: V(690, -32.54, 764), b: V(686, T(686, 764), 764), w: 4, noRails: true, color: 0xb9b5ab });
  K.hubbas.push({ a: V(802, -32.54, 764), b: V(806, T(806, 764), 764), w: 4, noRails: true, color: 0xb9b5ab });
  P.shop({ name: 'Gravity Skate Supply', sign: [784, -32.54 + 3.85, 762.04, 0, 7],
    awning: [778, 762, 790, 763.6, -32.54 + 2.2], zone: [780, 762.2, 788, 765.2], door: [784, -32.54, 762.2] });
  P.travel('Gravity Skate Supply', 784, -33.12, 772, 0, 'spot');
  // parking blocks (12), parked cars (6), planters, bike racks, a trash can by the shop door
  for (const z of [780, 800]) for (const x of [702, 716, 730, 776, 788, 800]) K.parkingBlock(x, z, true);
  for (const [x, z] of [[708, 790], [724, 790], [780, 790], [794, 790], [708, 808], [794, 808]]) K.car(x, z, true);
  K.planter(694, 812, 702, 816); K.planter(790, 812, 798, 816);
  K.bikeRack(698, 769.5, true); K.bikeRack(712, 769.5, true); K.trashCan(804.5, 770); K.newsBoxes(792, 771.5, true, 2);
  for (const [x, z, s] of [[696, 774, 1], [796, 774, -1], [696, 806, 1], [796, 806, -1]]) K.lamp(x, z, s);
  for (const [x, z] of [[708, 797], [730, 797], [776, 797], [796, 797]]) K.tree(x, z);       // the lot's islands
  P.spot('Bayview Walkway', 694, -32.6, 770, -Math.PI / 2, [690, 760, 802, 770]);
  P.challenge({ id: 'east-walkway', name: 'Walkway Ledge', desc: 'Grind the Bayview Center walkway',
    at: [746, -32.54, 766], go: [694, -32.6, 770, -Math.PI / 2], kind: 'grind', rail: 'Ledge', area: [690, 761, 802, 767] });

  // S13 the wall into Bayview Road, the Bayview Ten, the Bayview Hubbas, the railing
  K.B(690, -37.9, 820, 802, -34.26, 824, 'plaza', { edges: 's' });
  K.stairSpot('z', 824, 1, 740, 752, -34.26, -37.52, 10, 0.4, { rails: [740.45, 751.55] });
  K.stairSpot('z', 824, 1, 770, 778, -34.26, -37.52, 10, 0.4, { hubbas: [769.6, 778.4] });
  K.rail(692, -33.36, 822.6, 734, -33.36, 822.6, 'Rail', true);
  K.rail(784, -33.36, 822.6, 797, -33.36, 822.6, 'Rail', true);
  P.spot('Bayview Ten', 746, -33.77, 800, Math.PI, [736, 790, 782, 846]);
  P.travel('Bayview Center', 746, -33.77, 800, Math.PI, 'spot');
  P.challenge({ id: 'east-bayview-kf', hard: true, name: 'Kickflip the Bayview Ten', desc: 'Kickflip the whole ten into Bayview Road',
    at: [746, -34.26, 822], go: [746, -33.77, 800, Math.PI], kind: 'trick', tricks: ['Kickflip'], from: [740, 820, 752, 824, -34.6], to: [736, 828, 756, 846, -38, -37] });
  // the Bayview pylon: collision low down, the tall sign tower drawn
  K.B(799, -38, 824, 810, -33, 827, 'garage');
  K.prop(799, -33, 824.2, 810, -19.4, 826.8, 0x2e3f5c); K.prop(798.4, -19.4, 823.8, 810.6, -18.2, 827.2, 0xd9b44a);
  K.decorFns.push(D => D.sign('BAYVIEW CENTER', 804.5, -22.0, 827.06, 10, 2, 0, '#f0ece2', '#2e3f5c'));
  P.landmark({ at: [804.5, -37.4, 825.5], near: 140, parts: [
    { shape: 'box', at: [0, 9, 0], size: [11, 18, 3], color: 0x2e3f5c },
    { shape: 'box', at: [0, 18.6, 0], size: [12.2, 1.2, 3.6], color: 0xd9b44a }] });

  // S14 the loading docks behind the shops
  K.loadingDock(700, 744, 724, -1);
  K.loadingDock(736, 744, 760, -1);
  K.dumpster(766, 738, true); K.dumpster(772, 738, true);
  P.spot('Bayview Docks', 690, T(690, 738), 738, -Math.PI / 2, [690, 728, 770, 744]);
  P.tape(712, 742.5, T(712, 742.5) + 1.3);
}

/* S15: the Moonrise Drive-In. */
function east_south_drivein(K, P, keep) {
  const g = z => K.terrainH(906, z);
  keep.push([846, 604, 966, 796]);
  for (const zr of [624, 652, 680, 736, 764]) {
    K.hubbas.push({ a: V(906, g(zr - 4), zr - 4), b: V(906, g(zr) + 0.8, zr), w: 100, noRails: true, color: 0x93897a });
    K.hubbas.push({ a: V(906, g(zr) + 0.8, zr), b: V(906, g(zr + 5), zr + 5), w: 100, noRails: true, color: 0x93897a });
    for (let x = 860; x <= 954; x += 8) { const y = K.terrainH(x, zr - 3); K.prop(x - 0.075, y, zr - 3.075, x + 0.075, y + 1.3, zr - 2.925, 0x55595e); }
  }
  // the snack bar and the ramp up its east side to the roof
  K.building(890, 700, 922, 716, 1, 0xe0d6c2, 'brick');
  // the doc's ramp (12 m up the east side) is 18 degrees and the 6 % slope pulls a rider off a 3 m ramp: this one comes up the north face instead,
  // straight on from the hump rows, 14 m long, so a rider rolling down the lot arrives square
  K.hubbas.push({ a: V(900, -25.52, 700.5), b: V(900, K.terrainH(900, 686) + 0.02, 686), w: 4, noRails: true, color: 0xa7a39a });
  P.tape(906, 708, -25.52);
  // the screen: legs you can hit, the face and its top bar drawn (the landmark takes over past 160 m)
  for (const x of [868, 888, 922, 942]) K.B(x, -35.5, 798, x + 2, -30.95, 800, 'garage');
  K.prop(866, -30.9, 798, 946, -14.9, 799.2, 0xe8e4da); K.prop(865, -14.9, 797.8, 947, -14.1, 799.4, 0x2e3f5c);
  K.decorFns.push(D => D.sign('MOONRISE DRIVE-IN', 906, -16.4, 798.34, 40, 3, Math.PI, '#f2ead8', '#2e3f5c'));
  P.landmark({ at: [906, -34.95, 799], near: 160, parts: [
    { shape: 'box', at: [0, 12, 0], size: [80, 16, 1.2], color: 0xe8e4da },
    { shape: 'box', at: [0, 20.4, 0], size: [82, 0.8, 1.6], color: 0x2e3f5c },
    { shape: 'box', at: [-37, 2, 0.6], size: [2, 4, 2], color: 0x5d5f63 },
    { shape: 'box', at: [-17, 2, 0.6], size: [2, 4, 2], color: 0x5d5f63 },
    { shape: 'box', at: [17, 2, 0.6], size: [2, 4, 2], color: 0x5d5f63 },
    { shape: 'box', at: [37, 2, 0.6], size: [2, 4, 2], color: 0x5d5f63 }] });
  // the ticket booth at the Crosstown end
  K.building(848, 600, 852, 604, 1);
  P.spot('Moonrise Drive-In', 906, -23.38, 610, Math.PI, [846, 604, 966, 796]);
  P.travel('Moonrise Drive-In', 906, -23.38, 610, Math.PI, 'spot');
}

/* The houses along Mesa E, Bayview E and Terrace S (12-20 m by 10-14 m, doc colours). */
function east_south_houses(K, house) {
  const HC = [0xd9c7a8, 0xc9a27e, 0xb8c4c9, 0xe0d6c2, 0xa9b89a];
  let i = 0; const H = (x0, z0, x1, z1) => house(x0, z0, x1, z1, 2, HC[i % 5], i++ % 2 ? 'brick' : 'stone');
  H(694, 672, 712, 686); H(720, 672, 738, 686); H(746, 672, 766, 686); H(774, 672, 792, 686);        // Mesa E, north side
  H(836, 856, 852, 870); H(862, 856, 880, 870); H(890, 856, 906, 870); H(916, 856, 934, 870);        // Bayview E, south side
  H(790, 604, 806, 618); H(790, 644, 806, 658);                                                      // Terrace S, west side
}

/* Filler (CONTRACT 7): something skateable within 10 m at least every 30 m along Mesa E, Bayview Road E and Terrace S,
   and a median down the long stretches. The street furniture sits on the walks, never in the road. */
function east_south_filler(K, P, keep) {
  // Mesa Street E, z 700 (walks z 691..695 north, 705..709 south): a piece about every 22 m
  K.newsBoxes(688, 693, true, 2);
  K.retainWall(700, 690.2, 722, 690.2, -2.5, 0.45, 0.6);
  K.construction(738, 693, true);
  K.bench(752, 707, 760, 707.6); K.hydrant(766, 708);
  K.planter(776, 705.6, 782, 708.4);
  K.parkingBlock(792, 706.5, true); K.bikeRack(800, 693, true); K.hydrant(808, 693);
  // Terrace Avenue south of Crosstown, x 820 (walks x 810..814 west, 826..830 east): 6.15 % down
  K.newsBoxes(812, 584, false, 2);
  K.retainWall(808.6, 598, 808.6, 624, 2.5, 0.45, 0.6);
  K.bench(827.5, 628, 828.1, 636);
  K.planter(810.5, 648, 813.2, 654);
  K.construction(827.5, 672, false);
  K.hydrant(812, 694);
  K.median(820, 716, 820, 826, 2.0);
  // Bayview Road east of the Spine, z 840 (walks z 830..834 north, 846..850 south)
  K.hydrant(684, 831.5);
  K.bench(704, 848, 712, 848.6);
  K.construction(728, 848.5, true);
  K.hydrant(758, 849);
  K.newsBoxes(774, 848.5, true, 2);
  K.planter(796, 847.2, 802, 849.6);
  K.hydrant(808, 831.5);
  K.median(842, 840, 958, 840, 2.4);
  K.bikeRack(966, 848, true, 2.4); K.trashCan(970, 832);
  // the lot and the lawns behind Bayview's houses
  P.spot('Snack Bar Roof', 906, K.terrainH(906, 690), 690, Math.PI, [886, 686, 936, 720]);
}

function east_south_trees(K, tree, lamp) {
  for (let x = 700; x < 805; x += 18) { tree(x, 712.5); }                       // Mesa E south verge
  for (let x = 700; x < 970; x += 18) { if (x > 800 && x < 836) continue; tree(x, 827); tree(x, 853.5); }   // Bayview verges
  for (let z = 592; z < 850; z += 24) tree(809, z);                              // Terrace, house side
  for (const x of [862, 884, 928, 950]) tree(x, 607);                            // the drive-in's north edge
}

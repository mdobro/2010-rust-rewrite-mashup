/* Eastside Hills, the Park part: Hillside Park (the skatepark), Pool Row on Larch Lane, the Crosstown Cut walls east of the
   bridge, the north-east houses, and the filler that keeps Crest, Orchard, Crosstown, Terrace and Larch from going dead
   (CONTRACT 7). Rect [680, 1000, 230, 580]. */
function east_park(K, P, PL) {
  const T = (x, z) => K.terrainH(x, z);
  const keep = [];                                     // rects (x0, z0, x1, z1) that trees and lamps keep out of
  const inK = (x, z, m = 0) => keep.some(r => x > r[0] - m && x < r[2] + m && z > r[1] - m && z < r[3] + m);
  const item = (x0, z0, x1, z1) => keep.push([Math.min(x0, x1) - 0.4, Math.min(z0, z1) - 0.4, Math.max(x0, x1) + 0.4, Math.max(z0, z1) + 0.4]);
  const PARKC = 0xcdc8bc;

  /* ---------- the Crosstown Cut walls, x 680..735 ---------- */
  const NW = { 680: -15.99, 688: -16.79, 696: -17.55, 704: -18.25, 712: -18.86, 720: -19.34, 728: -19.68 };
  for (const k in NW) { const x0 = +k; K.B(x0, -20.8, 546.5, x0 === 728 ? 735 : x0 + 8, NW[k], 548.5, 'ledge', { edges: 's', color: 0xa7a39a }); }
  const SW = { 680: -17.00, 688: -17.76, 696: -18.46, 704: -19.06, 712: -19.51, 720: -19.79 };
  for (const k in SW) { const x0 = +k; K.B(x0, -20.8, 571.5, x0 + 8, SW[k], 573.5, 'ledge', { edges: 'n', color: 0xa7a39a }); }
  keep.push([679, 545, 736, 575]);

  /* ---------- Hillside Park (doc section 6), in order ---------- */
  keep.push([836, 444, 964, 550]);
  const TY = [-14.22, -16.09, -18.00];
  // edge walls: one box per terrace piece, top 0.45 over the higher of the terrace and the ground outside, edges toward the park
  const wallPiece = (x, z0, z1, ty, edge) => {
    const out = x < 900 ? 838 : 962, hi = Math.max(ty, T(out, z0), T(out, z1), T(out, (z0 + z1) / 2));
    K.B(x - 1, Math.min(ty, T(out, z1)) - 0.5, z0, x + 1, hi + 0.45, z1, 'plaza', { edges: edge, color: PARKC });
  };
  for (const [a, b, t, wgaps, egaps] of [[446, 476, 0, [[458, 464]], [[458, 464]]], [476, 507, 1, [[488, 494]], []], [507, 538, 2, [[519, 525]], [[519, 525]]]])
    for (const [x, edge, gaps] of [[840, 'e', wgaps], [960, 'w', egaps]]) {
      if (t === 1 && x === 960) { K.B(959, -16.6, 476, 961, -14.09, 507, 'plaza', { edges: 'w', color: PARKC }); continue; }   // the T2 east wall backs the quarterpipe
      let s = a; for (const [g0, g1] of gaps) { wallPiece(x, s, g0, TY[t], edge); s = g1; } wallPiece(x, s, b, TY[t], edge);
    }
  K.B(841, -16.6, 474, 959, -14.22, 478, 'plaza', { edges: 's', color: PARKC });
  K.B(841, -18.5, 505, 959, -16.09, 509, 'plaza', { edges: 's', color: PARKC });
  K.B(839, -21, 536, 961, -18.0, 540, 'plaza', { edges: 's', color: PARKC });

  // T1, the flat
  K.B(880, -14.62, 458, 900, -13.62, 468, 'pad', { edges: 'ns' });
  K.kicker(877.4, 463, 1, 0, 2.6, 0.6, 10); K.kicker(902.6, 463, -1, 0, 2.6, 0.6, 10);
  K.rail(882, -13.32, 463, 898, -13.32, 463, 'Rail', true);
  K.pad(848, 456, 868, 461); K.pad(848, 466, 868, 471);
  K.ledge(912, 456, 940, 456.6); K.ledge(912, 467, 940, 467.6, 0.55);
  K.rail(950, -13.82, 455, 950, -13.82, 471, 'Rail', true);

  // T1 -> T2, the six-stairs, the bank and Hubba Six
  K.stairSpot('z', 478, 1, 852, 868, -14.22, -16.09, 6, 0.4, { rails: [852.45, 860, 867.55] });
  K.hubbas.push({ a: V(890, -14.22, 478), b: V(890, -16.07, 486), w: 14, noRails: true, color: PARKC });
  K.stairSpot('z', 478, 1, 920, 932, -14.22, -16.09, 6, 0.4, { hubbas: [919.6, 932.4] });

  // the quarterpipe on T2's east side: the ground first, then the coping
  K.feat(948, 960, 482, 500, (x, z) => { const d = x - 948; return d < 2.97 ? 3.2 - Math.sqrt(10.24 - d * d) : 2.0; }, 'add');
  K.rail(950.97, -14.09, 482, 950.97, -14.09, 500, 'Coping', false);
  K.B(948, -16.6, 480, 961, -14.09, 482, 'plaza', { color: PARKC }); K.B(948, -16.6, 500, 961, -14.09, 502, 'plaza', { color: PARKC });

  // T2: the pyramid and its four 3 m banks, a ledge
  K.B(884, -16.6, 490, 896, -15.19, 498, 'plaza', { edges: 'nswe', color: PARKC });
  K.hubbas.push({ a: V(890, -15.19, 490), b: V(890, -16.07, 487), w: 12, noRails: true, color: PARKC });
  K.hubbas.push({ a: V(890, -15.19, 498), b: V(890, -16.07, 501), w: 12, noRails: true, color: PARKC });
  K.hubbas.push({ a: V(884, -15.19, 494), b: V(881, -16.07, 494), w: 8, noRails: true, color: PARKC });
  K.hubbas.push({ a: V(896, -15.19, 494), b: V(899, -16.07, 494), w: 8, noRails: true, color: PARKC });
  K.ledge(850, 494, 874, 494.6);

  // T2 -> T3: the kinked rail (a flat piece on T2, then the stair's own handrail), Park Seven, the T3 bank
  K.rail(926.45, -15.51, 503, 926.45, -15.51, 508.4, 'Handrail', true);
  K.stairSpot('z', 509, 1, 926, 946, -16.09, -18.0, 6, 0.4, { rails: [926.45, 936, 945.55] });
  K.hubbas.push({ a: V(853, -16.09, 509), b: V(853, -17.98, 517), w: 14, noRails: true, color: PARKC });

  // T3: the bowl (the pool first, then 20 pieces of coping round the rounded rect)
  K.pool(866, 902, 512, 536, [[K.poolS.rect(884, 524, 15, 9, 4), 1.8]], -18.0);
  { const ring = [], C = [[895, 519, -Math.PI / 2], [895, 529, 0], [873, 529, Math.PI / 2], [873, 519, Math.PI]];
    for (const [cx, cz, a0] of C) for (let i = 0; i <= 4; i++) { const a = a0 + i / 4 * Math.PI / 2; ring.push([cx + 4 * Math.cos(a), cz + 4 * Math.sin(a)]); }
    for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length];
      K.rails.push({ a: V(p[0], -18.0, p[1]), b: V(q[0], -18.0, q[1]), kind: 'Coping', coping: true }); } }   // 4 corners x 4 + 4 straight sides = 20

  // the forecourt: Park Steps, the Forecourt Hubbas, benches, the sign, lamps
  K.stairSpot('z', 540, 1, 868, 884, -18.0, -20.16, 7, 0.4, { rails: [868.45, 876, 883.55] });
  K.stairSpot('z', 540, 1, 892, 900, -18.0, -20.16, 7, 0.4, { hubbas: [891.6, 900.4] });
  K.bench(849, 544.4, 857, 545.0); K.bench(906.5, 544.4, 910.5, 545.0); K.trashCan(860.5, 545.5);
  K.decorFns.push(D => D.sign('HILLSIDE PARK', 926, -19.0, 540.06, 12, 1.2, 0, '#f0ece2', '#2e3f5c'));
  K.lamp(846.5, 546.5, 1); K.lamp(905, 546.5, -1);
  for (const [x, z] of [[834, 458], [834, 492], [834, 526], [834, 545], [966, 458], [966, 492], [966, 526], [966, 545]]) K.tree(x, z);

  P.spot('Hillside Park', 900, -14.22, 452, Math.PI, [840, 446, 960, 548]);
  P.spot('Park Six', 860, -14.22, 470, Math.PI, [848, 466, 934, 490]);
  P.spot('Hillside Bowl', 884, -18.0, 510, Math.PI, [866, 508, 902, 536]);
  P.travel('Hillside Park', 900, -14.22, 456, Math.PI, 'park');

  /* ---------- S11 Pool Row ---------- */
  K.backyardPool(858, 333); K.backyardPool(908, 333); K.backyardPool(882, 387); K.backyardPool(934, 387);
  keep.push([846, 318, 960, 420]);
  const HC = [0xd9c7a8, 0xc9a27e, 0xb8c4c9, 0xe0d6c2, 0xa9b89a];
  let hn = 0;
  const house = (x0, z0, x1, z1, floors = 2) => { keep.push([x0 - 1, z0 - 1, x1 + 1, z1 + 1]); K.building(x0, z0, x1, z1, floors, HC[hn % 5], hn % 2 ? 'brick' : 'stone'); hn++; };
  house(848, 300, 868, 314); house(898, 300, 918, 314); house(872, 404, 892, 418); house(924, 404, 944, 418);
  // board fences between the yards, 3 m gaps on the lane side (looks only)
  const fence = (x, z0, z1) => { for (let z = Math.min(z0, z1); z < Math.max(z0, z1) - 0.01; z += 4) { const e = Math.min(z + 4, Math.max(z0, z1)), lo = Math.min(T(x, z), T(x, e));
    K.prop(x - 0.08, lo - 0.2, z, x + 0.08, Math.max(T(x, z), T(x, e)) + 1.6, e, 0x9a7b55); } };
  fence(883, 318, 353); fence(933, 318, 353); fence(908, 368, 418); fence(958, 368, 418);
  P.spot('Pool Row', 840, T(840, 360), 360, -Math.PI / 2, [846, 320, 950, 400]);
  P.tape(934, 389, -12.27);

  /* ---------- the north-east houses on Crest, Orchard and Terrace ---------- */
  house(700, 248, 718, 262); house(744, 296, 762, 310);                     // Crest
  house(700, 404, 718, 418); house(756, 444, 774, 458);                     // Orchard
  house(786, 322, 804, 336); house(786, 482, 804, 496);                     // Terrace, west side
  house(756, 248, 774, 262); house(790, 296, 808, 310); house(790, 404, 808, 418); house(710, 444, 728, 458);

  /* ---------- centre lines ---------- */
  for (let x = 682; x < 806; x += 6) { K.dash(x, 280, x + 3, 280); K.dash(x, 430, x + 3, 430); }
  for (let z = 272; z < 578; z += 6) { if ((z > 266 && z < 294) || (z > 414 && z < 444) || (z > 542 && z < 578)) continue; K.dash(820, z, 820, z + 3); }

  /* ---------- the streets in this part's rect (--rhythm measures them) ---------- */
  P.line('Crest Road (park part)', [[680, 280], [830, 280]], 'push');
  P.line('Orchard Street (park part)', [[680, 430], [830, 430]], 'push');
  P.line('Crosstown Street (east of the Cut)', [[680, 560], [910, 560]], 'push');
  P.line('Terrace Avenue (north)', [[820, 270], [820, 580]], 'push');
  P.line('Larch Lane', [[830, 360], [970, 360]], 'push');
  P.line('Hillside Park', [[900, 452], [900, 540]], 'push');

  /* ---------- filler: something skateable at the edges of every street (CONTRACT 7) ---------- */
  // a low ground-hugging wall along a straight line (a garden wall, a planter edge): both long edges grind
  const wall = (ax, az, bx, bz, hgt = 0.45, w = 0.6) => { K.strip(ax, az, bx, bz, hgt, w, { kind: 'Ledge', color: 0xa39d90 }); item(ax - w, az - w, bx + w, bz + w); };
  const bench = (x0, z0, x1, z1) => { K.bench(x0, z0, x1, z1); item(x0, z0, x1, z1); };
  const planter = (x0, z0, x1, z1) => { K.planter(x0, z0, x1, z1); item(x0, z0, x1, z1); };
  const hyd = (x, z) => { K.hydrant(x, z); item(x - 0.3, z - 0.3, x + 0.3, z + 0.3); };
  const news = (x, z, alongX) => { K.newsBoxes(x, z, alongX, 2); item(x - 1, z - 1, x + 1, z + 1); };
  const bus = (x, z, alongX, back) => { K.busStop(x, z, alongX, back); item(x - (alongX ? 2.6 : 1.4), z - (alongX ? 1.4 : 2.6), x + (alongX ? 2.6 : 1.4), z + (alongX ? 1.4 : 2.6)); };
  const works = (x, z, alongX) => { K.construction(x, z, alongX); item(x - (alongX ? 7 : 2), z - (alongX ? 2 : 7), x + (alongX ? 7 : 2), z + (alongX ? 2 : 7)); };
  const gap = (ax, az, bx, bz, h = 0.45) => { K.crossingGap(ax, az, bx, bz, h); item(Math.min(ax, bx) - 2.6, Math.min(az, bz) - 1.4, Math.max(ax, bx) + 2.6, Math.max(az, bz) + 1.4); };

  // Crest Road (z 280): walks z 270..274 and 286..290
  wall(684, 270.3, 698, 270.3); bus(712, 288.5, true, 1); wall(730, 289.7, 742, 289.7); planter(750, 270.2, 756, 271.8);
  works(774, 287.5, true); bench(796, 271.0, 804, 271.6); hyd(808.5, 289.2);
  gap(812, 288.4, 828, 288.4);
  // Orchard Street (z 430): walks z 420..424 and 436..440
  wall(684, 439.7, 696, 439.7); planter(708, 420.2, 714, 421.8); bus(732, 421.8, true, -1); wall(748, 439.7, 760, 439.7);
  works(778, 421.5, true); bench(796, 439.0, 804, 439.6);
  gap(812, 421.4, 828, 421.4);
  // Crosstown east of the Cut (z 560): walks z 548..553 and 567..572
  planter(686, 550.2, 692, 551.8); bench(706, 568.2, 714, 568.8); wall(738, 569.7, 750, 569.7); bus(758, 551.2, true, -1);
  wall(768, 569.7, 780, 569.7); works(790, 551.0, true); bench(802, 568.2, 810, 568.8);
  gap(812, 551.2, 828, 551.2);
  planter(836, 568.0, 842, 569.6); wall(850, 569.7, 862, 569.7); news(870, 569.0, true); wall(878, 569.7, 890, 569.7); bench(898, 568.2, 906, 568.8);
  // Terrace Avenue (x 820, 6 %): walks x 810..814 and 826..830
  wall(810.4, 296, 810.4, 308); bench(829.2, 318, 829.8, 326); bus(812, 342, false, -1); planter(809.6, 366, 811.2, 372);
  wall(829.8, 384, 829.8, 396); bench(810.4, 404, 811.0, 412); hyd(829.4, 414);
  works(812, 458, false); wall(829.8, 470, 829.8, 482); bench(810.4, 496, 811.0, 504); planter(827.6, 514, 829.4, 520);
  wall(810.4, 528, 810.4, 538); news(829, 540, false); wall(810.4, 576, 810.4, 580);
  // Larch Lane (z 360): the lane is z 356..364
  wall(836, 352.6, 846, 352.6); planter(866, 366.4, 872, 368); bench(884, 352.0, 892, 352.6); works(905, 368, true);
  planter(922, 352.2, 928, 353.8); wall(942, 367.4, 954, 367.4); bench(960, 352.0, 968, 352.6);

  /* ---------- Crosstown lamps (x >= 680) and the street verges' trees, last so they keep clear of everything ---------- */
  for (let x = 690; x < 910; x += 30) { if (x > 800 && x < 840) continue;
    if (!(x > 846 && x < 906) && !inK(x, 549.6, 1.2)) K.lamp(x, 549.6, -1);
    if (!inK(x + 15, 570.4, 1.2) && !(x + 15 > 800 && x + 15 < 840)) K.lamp(x + 15, 570.4, 1); }
  for (const [c, a, b] of [[280, 684, 806], [430, 684, 806]]) for (let x = a + 4; x < b; x += 18) for (const sd of [-1, 1]) {
    const z = c + sd * 13.5; if (!inK(x, z, 2.2)) K.tree(x, z); }
  for (let z = 300; z < 570; z += 24) { if ((z > 262 && z < 296) || (z > 414 && z < 446) || (z > 540)) continue; const x = 806; if (!inK(x, z, 2.2)) K.tree(x, z); }
  for (const [x, z] of [[905, 340], [875, 345], [945, 345], [905, 395], [960, 400], [940, 350]]) if (!inK(x, z, 2) ) K.tree(x, z);

  /* ---------- challenges ---------- */
  P.challenge({ id: 'east-park-score', name: 'Work Hillside', desc: 'Land a 3,000 point line in Hillside Park',
    at: [900, -14.22, 456], go: [900, -14.22, 452, Math.PI], kind: 'score', pts: 3000, area: [840, 446, 960, 548] });
  P.challenge({ id: 'east-bowl', name: 'Hillside Bowl', desc: 'Grind the bowl coping',
    at: [884, -18.0, 512], go: [884, -18.0, 510, Math.PI], kind: 'grind', rail: 'Coping', area: [866, 512, 902, 536] });
  P.challenge({ id: 'east-pool-row', name: 'Pool Row', desc: 'Grind a backyard pool on Larch Lane',
    at: [858, -6.15, 333], go: [858, -8.0, 360, 0], kind: 'grind', rail: 'Coping', area: [846, 320, 950, 400] });
}

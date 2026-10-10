/* Eastside Hills, the west part: x 300..560, z 230..910 (design/east.md 4.7-4.10 and 13).
   The Cut walls west of the Spine, Larkspur Hill School (the School Wall, Steps and Hubba, the yard, the courts),
   the Vista Stoops, Back Lane, the houses west of the Spine, and the filler that keeps Crest, Orchard, Mesa W,
   Bayview, Crosstown, Vista and Back Lane from ever going dead. */
function east_west(K, P, PL) {
  P.region(300, 304, 528, 744, 4);
  P.region(336, 344, 304, 528, 4); P.region(336, 344, 744, 808, 4);   // Back Lane is 6 m wide: the 8 m mesh would miss its colour      // the plan's res-4 block starts at x 304; this closes the 4 m strip at the west border
  east_west_cut(K);
  east_west_school(K, P);
  east_west_vista(K, P);
  east_west_back(K, P);
  east_west_houses(K);
  east_west_streets(K, P, PL);
  east_west_trees(K, PL);
}

/* The Crosstown Cut's walls, x 464..560 north and 496..560 south: a 0.45 ledge from the bench above, a tall wall from the street. */
function east_west_cut(K) {
  const N = [-19.68, -19.34, -18.86, -18.25, -17.55, -16.79, -15.99, -15.20, -14.43, -13.71, -13.08, -12.57];   // x0 464..552
  const S = [-18.46, -17.76, -17.00, -16.20, -15.41, -14.66, -13.99, -13.43];                                      // x0 496..552
  N.forEach((top, i) => K.B(464 + i * 8, -20.8, 546.5, 472 + i * 8, top, 548.5, 'ledge', { edges: 's', color: 0xa7a39a }));
  S.forEach((top, i) => K.B(496 + i * 8, -20.8, 571.5, 504 + i * 8, top, 573.5, 'ledge', { edges: 'n', color: 0xa7a39a }));
}

/* S7 + S8: Larkspur Hill School on its pad (x 424..488, z 578..666). */
function east_west_school(K, P) {
  K.B(420, -23.5, 572, 496, -20.16, 580, 'plaza', { edges: 's' });                                    // the terrace: the School Wall
  K.stairSpot('z', 580, 1, 448, 464, -20.16, -23.0, 9, 0.4, { rails: [448.45, 456, 463.55] });        // School Steps
  K.stairSpot('z', 580, 1, 472, 480, -20.16, -23.0, 9, 0.4, { hubbas: [471.6, 480.4] });              // School Hubba
  for (const [x, z] of [[432, 598], [440, 598], [432, 608], [440, 608]]) K.picnic(x, z);
  K.ledge(484, 596, 498, 596.6);   // the doc has it at x 470..486, straight ahead of the School Hubba's roll-away; moved east of it
  K.bikeRack(430, 586, true); K.bikeRack(436, 586, true); K.trashCan(426, 590);
  // the court
  const L = 0xf0ece2;
  K.dash(432, 636, 480, 636, L, 0.15); K.dash(480, 636, 480, 660, L, 0.15); K.dash(480, 660, 432, 660, L, 0.15); K.dash(432, 660, 432, 636, L, 0.15);
  K.dash(456, 636, 456, 660, L, 0.15);
  for (const x of [434, 478]) { const g = K.terrainH(x, 648); K.prop(x - 0.08, g, 647.92, x + 0.08, g + 3, 648.08, 0x3a3d42); K.prop(x - 0.6, g + 3, 647.6, x + 0.6, g + 3.08, 648.4, 0xe2e0da); }
  K.building(424, 664, 488, 688, 3, 0xc9a27e, 'brick');
  K.decorFns.push(D => D.sign('LARKSPUR HILL SCHOOL', 456, -18.4, 663.95, 18, 1.8, Math.PI, '#f2ead8', '#5a3a2a'));
  // the yard: a long low wall to ollie and a bank-side bench
  K.bench(446, 626.5, 450, 627.1); K.bench(462, 626.5, 466, 627.1);
  K.planter(486, 604, 490, 608, 0.5); K.planter(486, 614, 490, 618, 0.5);
  P.spot('School Wall', 456, -20.31, 562, Math.PI, [420, 552, 498, 618]);
  P.spot('Yard Bank', 456, -23.0, 600, Math.PI, [424, 590, 488, 660]);
  P.challenge({ id: 'east-school-gap', name: 'School Wall', desc: 'Ollie off the School Wall into the yard',
    at: [456, -20.16, 577], go: [456, -20.31, 562, Math.PI], kind: 'gap', from: [420, 574, 498, 580, -20.5], to: [420, 584, 498, 618, -23.2, -22.5] });
}

/* S9: six stoops on the west side of Vista Street, with their houses. */
function east_west_vista(K, P) {
  const HC = [0xd9c7a8, 0xc9a27e, 0xb8c4c9, 0xe0d6c2, 0xa9b89a];
  [316, 348, 380, 460, 492, 524].forEach((z, i) => {
    const g = K.terrainH(396, z);
    K.B(392, g - 1, z - 3, 395, g + 0.75, z + 3, 'step', { edges: 'e' });
    K.SET('x', 395, 1, z - 2.5, z + 2.5, g + 0.75, g, 3, 0.4);
    K.rail(395.2, g + 1.33, z - 2.7, 396.3, g + 0.55, z - 2.7, 'Handrail', true);
    K.building(372, z - 7, 390, z + 7, 2, HC[i % 5], i % 2 ? 'brick' : 'stone');
  });
  P.spot('Vista Stoops', 402, K.terrainH(402, 296), 296, Math.PI, [390, 300, 405, 535]);
}

/* S10: Back Lane, a 6 m lane behind the Vista houses at 6.15 %: dumpsters, jerseys, fences, and small things between. */
function east_west_back(K, P) {
  const lane = [[318, 'd', 1], [346, 'k', -1], [372, 'd', -1], [396, 'p', 1], [420, 'd', 1], [446, 'l', -1], [474, 'd', -1], [500, 'c', 1], [526, 'd', 1],
    [592, 'd', -1], [618, 'k', 1], [640, 'd', 1], [666, 'p', -1], [692, 'd', -1], [716, 'l', 1], [742, 'd', 1], [768, 'k', -1], [792, 'd', -1], [816, 'p', 1]];
  for (const [z, what, s] of lane) {
    const x = 340 + s * 4.9;
    if (what === 'd') K.dumpster(340 + s * 5, z, false);
    else if (what === 'l') K.strip(x, z - 4, x, z + 4, 0.45, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 12 });
    else if (what === 'k') { K.kicker(340 + s * 3.4, z, 0, 1, 2.4, 0.5, 1.4); K.Bg(x - 0.7, z + 3, x + 0.7, z + 9, 0.18, 'pad', { edges: 'ew' }); }
    else if (what === 'p') K.Bg(x - 0.6, z - 1.5, x + 0.6, z + 1.5, 0.55, 'ledge', { edges: 'ew' });
    else if (what === 'c') K.construction(340 + s * 6.4, z, false);
  }
  // curb ramps where the lane meets Crosstown's sidewalks (the street has no crossing there)
  for (const [zEdge, d] of [[548, -1], [553, 1], [567, -1], [572, 1]]) K.hubbas.push({ a: V(340, K.terrainH(340, zEdge) + 0.15, zEdge), b: V(340, K.terrainH(340, zEdge + d * 1.8) + 0.01, zEdge + d * 1.8), w: 5, noRails: true, color: 0xb9b5ab });
  K.jersey(344, 420, 344.8, 436); K.jersey(335.2, 610, 336, 626);
  K.hydrant(344.4, 476); K.hydrant(335.6, 740); K.trashCan(344.6, 650);
  // board fences along x 332 and 348 between the yards, with gaps
  for (const fx of [332, 348]) for (let z = 306; z < 828; z += 14) {
    const a = K.terrainH(fx, z), b = K.terrainH(fx, z + 9);
    K.prop(fx - 0.1, Math.min(a, b) - 0.1, z, fx + 0.1, Math.max(a, b) + 1.8, z + 9, 0x9a7b57);
  }
  P.spot('Back Lane', 340, K.terrainH(340, 306), 306, Math.PI, [333, 300, 347, 830]);
}

/* The houses west of the Spine (x 372..550), with a garden wall in front of each. */
function east_west_houses(K) {
  const HC = [0xd9c7a8, 0xc9a27e, 0xb8c4c9, 0xe0d6c2, 0xa9b89a];
  let n = 0;
  const house = (x0, z0, x1, z1, floors, wall) => {
    K.building(x0, z0, x1, z1, floors, HC[n % 5], n % 2 ? 'brick' : 'stone'); n++;
    if (wall) K.Bg(x0 + 1, wall[0] - 0.3, x0 + (x1 - x0) / 2 - 1.5, wall[0] + 0.3, 0.45, 'ledge', { edges: '' });          // a garden wall with a gap for the path
  };
  // Crest Road south side, Orchard north and south side, Mesa W south side, Bayview north side
  for (const [x0, x1] of [[426, 442], [468, 486], [512, 530]]) house(x0, 298, x1, 311, 2, [293.5]);
  for (const [x0, x1] of [[440, 456], [484, 502], [520, 540]]) house(x0, 398, x1, 412, 2, [417]);
  for (const [x0, x1] of [[432, 450], [480, 498], [522, 540]]) house(x0, 447, x1, 460, 2, [443]);
  for (const [x0, x1] of [[426, 444], [470, 488], [500, 518], [534, 550]]) house(x0, 716, x1, 729, 2, [711.8]);
  for (const [x0, x1] of [[430, 446], [480, 498], [520, 538]]) house(x0, 811, x1, 824, 2, [828]);
  // Vista west side south of the Cut
  for (const z of [596, 632, 668, 740, 776, 806]) { K.building(372, z - 7, 390, z + 7, 2, HC[n % 5], n % 2 ? 'brick' : 'stone'); n++;
    K.Bg(393.7, z + 1.5, 394.3, z + 6, 0.45, 'ledge', { edges: '' }); }
}

/* A small piece of street furniture on a walk. (c, alongX): the street's line; u along it, v across it. */
function east_west_piece(K, name, c, alongX, u, v, lift) {
  const A = (a, b) => alongX ? [a, c + b] : [c + b, a];
  const Rc = (u0, v0, u1, v1) => { const p = A(u0, v0), q = A(u1, v1); return [p[0], p[1], q[0], q[1]]; };
  const lf = lift || 0, [px, pz] = A(u, v), sg = v < 0 ? -1 : 1, along = alongX ? 'ns' : 'ew';
  const box = (hu, hv, h, mat, edges) => { const [x0, z0, x1, z1] = Rc(u - hu, v - hv, u + hu, v + hv); return K.Bg(x0, z0, x1, z1, h + lf, mat, { edges }); };
  switch (name) {
    case 'bench': box(1.1, 0.3, 0.45, 'wood', ''); break;
    case 'planter': box(1.5, 0.6, 0.55, 'ledge', along); break;
    case 'pad': box(3, 0.7, 0.18, 'pad', along); break;
    case 'ledge': if (alongX) box(4, 0.3, 0.45, 'ledge', along);
      else { const [x0, z0, x1, z1] = Rc(u - 4, v, u + 4, v); K.strip(x0, z0, x1, z1, 0.45 + lf, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 12 }); } break;
    case 'hydrant': { K.hydrant(px, pz); const [nx, nz] = A(u + 2.2, v); K.newsBoxes(nx, nz, alongX, 2); break; }
    case 'rack': { K.bikeRack(px, pz, alongX); const [tx, tz] = A(u + 3, v); K.trashCan(tx, tz); break; }
    case 'kick': { const [kx, kz] = A(u - 5.2, v), [x0, z0, x1, z1] = Rc(u - 2.7, v - 0.7, u + 3, v + 0.7);
      K.kicker(kx, kz, alongX ? 1 : 0, alongX ? 0 : 1, 2.4, 0.5, 1.3); K.Bg(x0, z0, x1, z1, 0.18 + lf, 'pad', { edges: along }); break; }
    case 'gap': { const [ax, az] = A(u - 3.5, v), [bx, bz] = A(u + 3.5, v); K.crossingGap(ax, az, bx, bz, 0.4); break; }
    case 'constr': K.construction(px, pz, alongX); break;
    case 'bus': K.busStop(px, pz, alongX, sg); break;
  }
}

/* A row of pieces along a street, alternating sides, between the cross streets (br m clear each side of a crossing). */
function east_west_row(K, c, alongX, from, to, step, vw, breaks, kinds, lift, phase, br = 15, avoid = null) {
  const cuts = [from, ...breaks.flatMap(b => [b - br, b + br]).filter(v => v > from && v < to).sort((p, q) => p - q), to];
  let side = 1, i = phase || 0;
  const put = (u) => { if (avoid && avoid(u, side)) side = -side; if (avoid && avoid(u, side)) return; east_west_piece(K, kinds[i++ % kinds.length], c, alongX, u, side * vw, lift); side = -side; };
  for (let s = 0; s + 1 < cuts.length; s += 2) {
    const a = cuts[s], b = cuts[s + 1], n = Math.max(1, Math.ceil((b - a) / step));
    if (b - a < 3) { put((a + b) / 2); continue; }
    for (let k = 0; k <= n; k++) put(a + (b - a) * k / n);
  }
}

/* The streets: dashes, medians, retaining walls, and a row of pieces on every walk. */
function east_west_streets(K, P, PL) {
  const Y = 0xe2c044;
  // dashes on the level cross streets (x < 560), broken at Vista
  for (const [c, x0] of [[280, 420], [430, 420], [700, 420], [840, 350]])
    for (let x = x0; x < 556; x += 6) if (!(x + 3 > 396 && x < 424)) K.dash(x, c, x + 3, c, Y);
  // Vista's dashes, broken at its cross streets
  for (let z = 276; z < 846; z += 6) if (![280, 430, 560, 700, 840].some(s => z + 3 > s - 12 && z < s + 12)) K.dash(410, z, 410, z + 3, Y);
  // medians down the cross streets that carry no traffic: one long 0.45 ledge each (the streets are level, so one box does)
  for (const [c, list] of [[280, [[432, 468], [496, 532]]], [430, [[432, 468], [496, 532]]], [700, [[432, 468], [496, 532]]], [840, [[352, 386], [436, 470], [500, 536]]]])
    for (const [a, b] of list) { K.Bg(a, c - 0.8, b, c + 0.8, 0.45, 'ledge', { edges: 'ns' }); K.Bg(a, c - 1.3, b, c + 1.3, 0.15, 'pad', { edges: '' }); }
  // retaining walls on the north (uphill) walks
  for (const [c, hw] of [[280, 10], [430, 10], [700, 9], [840, 10]]) K.retainWall(480, c - hw + 0.6, 492, c - hw + 0.6, -2, 0.45, 0.6);
  // rows of furniture on the walks
  const K1 = ['ledge', 'bench', 'pad', 'planter', 'hydrant', 'kick', 'rack', 'gap', 'ledge', 'planter'];
  east_west_row(K, 280, true, 428, 556, 34, 7.8, [], K1, 0, 0);
  east_west_row(K, 430, true, 428, 556, 34, 7.8, [], K1, 0, 3);
  east_west_row(K, 700, true, 428, 556, 34, 7.2, [], K1, 0, 6);
  east_west_row(K, 840, true, 330, 556, 30, 7.8, [410], K1, 0, 2);
  east_west_row(K, 560, true, 326, 556, 26, 9.2, [410], ['pad', 'bench', 'ledge', 'planter', 'hydrant', 'rack', 'ledge', 'kick'], 0.15, 1, 18, (u, sd) => sd > 0 && u > 432 && u < 496);
  east_west_row(K, 410, false, 252, 826, 27, 8, [280, 430, 560, 700, 840], ['ledge', 'bench', 'pad', 'planter', 'hydrant', 'kick', 'rack', 'gap', 'bus', 'ledge'], 0, 4);
  // roadworks pockets and a bus stop each on a couple of streets
  K.construction(466, 280 + 8, true); K.construction(520, 430 - 8, true);
  // Crosstown lamps, x < 560, at the walk's outer side
  for (let x = 330; x < 556; x += 30) if (x < 396 || x > 424) for (const z of [549.6, 570.4]) K.lamp(x, z, z < 560 ? -1 : 1);
}

/* Trees: the verges, Vista's house side, the school. None in a run-up strip, a gate corridor, a band, or near a stair or ledge. */
function east_west_trees(K, PL) {
  for (const [c, off, x0] of [[280, 13, 428], [430, 13, 428], [700, 12, 428], [840, 13, 350]])
    for (let x = x0; x < 556; x += 18) { if (x > 392 && x < 428) continue; for (const s of [-1, 1]) K.tree(x + (s > 0 ? 9 : 0), c + s * off); }
  for (let z = 290; z < 835; z += 24) {
    if ([280, 430, 560, 700, 840].some(s => Math.abs(z - s) < 16) || [316, 348, 380, 460, 492, 524].some(s => Math.abs(z - s) < 7)) continue;
    K.tree(397.5, z);
  }
  for (const [x, z] of [[420, 590], [420, 622], [496, 590], [496, 622], [496, 650], [420, 650]]) K.tree(x, z);
}

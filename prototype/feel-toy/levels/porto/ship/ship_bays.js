/* Shipyard East, the bays part: x 256..589, z 910..1350 (design/ship.md 3.2 and 4.2).
   Warehouses A-D, the Loading Bay Row docks and manual pads, Deckhand Skate Supply, Harbour Road and Quay Road (x 256..589),
   Ropewalk Lane, Bay Lane, the bays quay apron with the Pilot Slip and its pontoon, and the small filler that keeps every
   street in this rect from going dead. */
function ship_bays(K, P, PL) {
  ship_bays_streets(K, P, PL);
  ship_bays_warehouses(K, P, PL);
  ship_bays_docks(K, P, PL);
  ship_bays_shop(K, P, PL);
  ship_bays_apron(K, P, PL);
  ship_bays_filler(K, P, PL);
}

/* the streets: flat benches, painted lanes with their centre dashes. Lamps and trees are placed by hand in the filler. */
function ship_bays_streets(K, P, PL) {
  for (const [a, b] of [[256, 434], [446, 589]]) {
    K.street('x', 1020, a, b, PL.y1, [], { rw: 6, sw: 4, lamps: false });      // Harbour Road
    K.street('x', 1120, a, b, PL.y2, [], { rw: 5, sw: 3, lamps: false });      // Quay Road
  }
  K.dash(258, 932, 587, 932, 0xe2c044);                                         // Ropewalk Lane
  K.dash(440, 934, 440, 1008, 0xe2c044);                                        // Bay Lane, in two runs across Harbour Road
  K.dash(440, 1032, 440, 1110, 0xe2c044);
}

/* the four warehouses */
function ship_bays_warehouses(K, P, PL) {
  K.building(262, 946, 427, 1004, 3, 0x7a8590, 'office');                       // A
  K.building(262, 1036, 427, 1106, 3, 0x6f7a72, 'brick');                       // B
  K.building(452, 944, 584, 1006, 3, 0x9b8f7f, 'brick');                       // C
  K.building(452, 1034, 584, 1108, 3, 0x8a8f94, 'office');                      // D
}

/* the docks of Bay Lane, the WA1 ramp, the D5 leveller, the four manual pads, the gantry sign, the challenge */
function ship_bays_docks(K, P, PL) {
  const th = K.terrainH;
  // west docks, x 427..433, edges e n s
  for (const [z0, z1, top] of [[946, 962, -39.436], [966, 982, -40.414], [986, 1004, -40.492], [1036, 1100, -41.483]]) {
    K.B(427, th(430, z1) - 0.4, z0, 433, top, z1, 'plaza', { edges: 'ens' });
    K.prop(433, top - 0.45, z0, 433.15, top - 0.3, z1, 0x2a2a2e);               // the bumper strip
  }
  K.hubbas.push({ a: V(430, -39.436, 946), b: V(430, -40.485, 938), w: 6, noRails: true, color: 0xb9b5ab });      // the WA1 ramp (13 %)
  K.hubbas.push({ a: V(430, PL.y2 + 0.15, 1112), b: V(430, PL.y2 + 0.01, 1110.6), w: 6, noRails: true, color: 0xb9b5ab });   // a curb cut where the Long Dock runs out on to Quay Road (designer review)
  K.rail(433.4, -38.536, 946, 433.4, -39.585, 938, 'Handrail', true);
  // east docks, x 446..452, edges w n s
  for (const [z0, z1, top] of [[942, 960, -40.405], [964, 982, -40.405], [986, 1004, -40.405],
                                [1036, 1048, -41.283], [1052, 1064, -41.186], [1068, 1080, -41.938], [1084, 1096, -41.49], [1100, 1108, -42.293]]) {
    K.B(446, th(449, z1) - 0.4, z0, 452, top, z1, 'plaza', { edges: 'wns' });
    K.prop(445.85, top - 0.45, z0, 446, top - 0.3, z1, 0x2a2a2e);
  }
  K.hubbas.push({ a: V(449, -41.283, 1036), b: V(449, -41.845, 1032), w: 6, noRails: true, color: 0xb9b5ab });   // the D5 leveller
  for (const z0 of [950, 990, 1046, 1080]) K.pad(438.8, z0, 441.2, z0 + 10, 0.18);                                  // manual pads in the lane centre
  // the LOADING BAY ROW gantry: two posts and a board 7 m up (the doc's z 938 is where the WA1 handrail ends, so it stands at z 936)
  for (const x of [433.6, 446.4]) K.B(x - 0.2, -41.1, 935.8, x + 0.2, -33.2, 936.2, 'metal');
  K.decorFns.push(D => D.sign('LOADING BAY ROW', 440, -33.4, 936.2, 12, 1.4, 0, '#f2ead8', '#2f3a4a'));
  P.spot('Loading Bay Row', 440, -40.48, 936, Math.PI, [427, 930, 452, 1112]);
  P.spot('Long Dock', 430, -41.48, 1038, Math.PI, [427, 1036, 433, 1100]);
  P.travel('Loading Bay Row', 440, -40.48, 936, Math.PI, 'spot');
  P.challenge({ id: 'ship-bay-line', name: 'Loading Bay Line', desc: 'In one line on Bay Lane: two grinds and a manual, 3,000 points or more', hard: true,
    at: [440, -40.49, 940], go: [440, -40.41, 934, Math.PI], kind: 'line', pts: 3000, need: [['grind', 2], ['Manual', 1]], area: [427, 930, 452, 1112] });
}

/* Deckhand Skate Supply, in Warehouse D's east wall on Gantry Road */
function ship_bays_shop(K, P, PL) {
  P.shop({ name: 'Deckhand Skate Supply', sign: [584.04, -38.146, 1042, Math.PI / 2, 7],
           awning: [584, 1036, 585.6, 1048, -39.796, 'x'], zone: [584.2, 1038, 587.4, 1046], door: [584, -41.997, 1042] });
  P.travel('Deckhand Skate Supply', 588, -41.997, 1042, Math.PI / 2, 'spot');
}

/* the bays quay apron: edge box, bollards, lamps, the Pilot Slip and its pontoon */
function ship_bays_apron(K, P, PL) {
  K.B(256, -50, 1176, 589, -44.0, 1180, 'ledge', { edges: 's' });
  for (let x = 258; x < 589; x += 12) {
    if (x >= 522 && x <= 536) continue;
    K.B(x - 0.25, -44.25, 1177.75, x + 0.25, -43.4, 1178.25, 'metal', { color: 0x2b2b2e });
  }
  for (let x = 280; x < 589; x += 40) K.lamp(x, 1142, 1);
  // the Pilot Slip
  K.hubbas.push({ a: V(529, -44.0, 1180), b: V(529, -45.38, 1186), w: 3, noRails: true, color: 0x8f8c86 });
  K.rail(527.3, -43.2, 1180, 527.3, -44.58, 1186, 'Rail', true);
  K.rail(530.7, -43.2, 1180, 530.7, -44.58, 1186, 'Rail', true);
  K.B(516, -46.4, 1186, 542, -45.4, 1192, 'wood', { edges: 'swe' });
  P.tape(529, 1189, -45.4);
  P.spot('Pilot Slip', 529, -44.0, 1172, Math.PI, [516, 1170, 542, 1192]);
}

/* a block from a list of [code, x, z, v] */
function ship_bays_blk(K, x0, z0, x1, z1, h, mat, edges, lift = 0, color) {
  const th = K.terrainH, g = Math.max(th(x0, z0), th(x1, z0), th(x0, z1), th(x1, z1)) + lift, lo = Math.min(th(x0, z0), th(x1, z0), th(x0, z1), th(x1, z1));
  return K.B(x0, lo - 0.4, z0, x1, g + h, z1, mat, color == null ? { edges } : { edges, color });
}
/* b bench, p planter, l ledge 6 m, d manual pad, w pallet, j jersey, v/q/u north-south ledge / pad / jersey, k crates, c roadworks.
   lift: 0.15 when the thing stands on a sidewalk. */
function ship_bays_bits(K, list) {
  for (const [c, x, z, v, lift = 0] of list) {
    const B = (x0, z0, x1, z1, h, mat, edges, col) => ship_bays_blk(K, x0, z0, x1, z1, h, mat, edges, lift, col);
    if (c === 'b') B(x - 2, z, x + 2, z + 0.6, 0.45, 'wood', 'ns');
    else if (c === 'p') B(x - 2, z, x + 2, z + 1.4, v || 0.55, 'ledge', 'nswe');
    else if (c === 'l') B(x - 3, z, x + 3, z + 0.6, v || 0.45, 'ledge', 'ns');
    else if (c === 'd') B(x - 3, z, x + 3, z + 2.4, 0.18, 'pad', 'nswe');
    else if (c === 'w') B(x, z, x + 1.2, z + 1.2, v || 0.6, 'wood', 'nswe');
    else if (c === 'k') B(x, z, x + 1.8, z + 1.2, v || 0.9, 'wood', 'nswe');
    else if (c === 'j') B(x - 3, z, x + 3, z + 0.6, 0.8, 'ledge', 'ns');
    else if (c === 'v') B(x - 0.3, z - 3, x + 0.3, z + 3, v || 0.45, 'ledge', 'ew');
    else if (c === 'q') B(x - 1.2, z - 3, x + 1.2, z + 3, 0.18, 'pad', 'nswe');
    else if (c === 'u') B(x - 0.3, z - 3, x + 0.3, z + 3, 0.8, 'ledge', 'ew');
    else if (c === 'c') K.construction(x, z, true);
    else if (c === 'n') K.newsBoxes(x, z, true, 2);
    else if (c === 'h') K.hydrant(x, z);
    else if (c === 'r') K.bikeRack(x, z, true);
  }
}

function ship_bays_filler(K, P, PL) {
  const th = K.terrainH;
  P.spot('Ropewalk Row', 340, th(340, 940), 940, Math.PI / 2, [256, 926, 430, 946]);
  P.spot('Quay Road Bays', 480, PL.y2, 1126, Math.PI / 2, [440, 1110, 589, 1130]);
  // lamps and trees on the two streets, by hand
  const lampAt = (x, z, s) => { if (x > 258 && x < 586 && !(x > 428 && x < 452)) K.lamp(x, z, s); };
  for (let x = 276; x < 589; x += 40) { lampAt(x, 1013.4, -1); lampAt(x + 20, 1026.6, 1); lampAt(x, 1114.4, -1); lampAt(x + 20, 1125.6, 1); }
  for (const x of [300, 372, 484, 548]) { K.tree(x, 1010.9); K.tree(x + 30, 1029.1); }
  ship_bays_bits(K, [
    // Ropewalk Lane, south edge (z 939.5..941): clear of the WA1 ramp at x 427..433 and the C1 dock at x 446..452
    ['l', 268, 939.5], ['d', 290, 939.6], ['w', 308, 940], ['w', 309.6, 940.4, 0.9], ['j', 332, 939.5], ['c', 356, 940.6], ['d', 380, 939.6], ['l', 402, 939.5], ['j', 418, 939.5],
    ['l', 459, 939.5], ['d', 480, 939.6], ['w', 497, 940], ['w', 498.6, 940.4, 1.2], ['c', 520, 940.6], ['j', 544, 939.5], ['d', 562, 939.6], ['l', 580, 939.5],
    // Harbour Road, on the sidewalks (their tops are 0.15 over the bench)
    ['l', 272, 1010.3, 0.45, 0.15], ['l', 336, 1010.3, 0.45, 0.15], ['b', 412, 1010.5, 0, 0.15], ['l', 512, 1010.3, 0.45, 0.15], ['b', 568, 1010.5, 0, 0.15],
    ['l', 290, 1028.3, 0.45, 0.15], ['b', 350, 1028.5, 0, 0.15], ['p', 372, 1028.2, 0.55, 0.15], ['l', 450, 1028.3, 0.45, 0.15], ['p', 500, 1028.2, 0.55, 0.15], ['l', 556, 1028.3, 0.45, 0.15],
    // Quay Road
    ['l', 284, 1112.3, 0.45, 0.15], ['p', 330, 1112.2, 0.55, 0.15], ['l', 390, 1112.3, 0.45, 0.15], ['b', 456, 1112.5, 0, 0.15], ['p', 500, 1112.2, 0.55, 0.15], ['l', 552, 1112.3, 0.45, 0.15],
    ['b', 300, 1125.4, 0, 0.15], ['l', 356, 1125.3, 0.45, 0.15], ['p', 420, 1125.3, 0.55, 0.15], ['l', 470, 1125.3, 0.45, 0.15], ['b', 528, 1125.4, 0, 0.15], ['l', 572, 1125.3, 0.45, 0.15],
    // the apron: ledges and pads in rows, with the lane to the Pilot Slip (x 527..531) left open
    ['l', 270, 1150], ['d', 300, 1158], ['p', 330, 1146], ['l', 360, 1160], ['d', 400, 1146], ['l', 430, 1156], ['p', 470, 1150], ['d', 500, 1162], ['l', 556, 1154],
    ['v', 522, 1148], ['v', 536, 1158], ['q', 521, 1164], ['q', 537, 1138],
  ]);
}

/* Shipyard East, the west part: x 0..256, z 910..1350 (design/ship.md 3.2 and 4.1).
   Harbour Road and Quay Road (x 96..244), Ropewalk Lane, Net Loft Lane, the Net Racks, the Port Authority and its
   Authority Five, the Net Lofts and Slipway Skates, the Bonito Cannery levellers, the East Quay Fish Market, the Quay
   Walk slappies, the quay edge and its bollards, and the small filler that keeps every street in this rect from going dead. */
function ship_west(K, P, PL) {
  ship_west_streets(K, P, PL);
  ship_west_netracks(K, P, PL);
  ship_west_authority(K, P, PL);
  ship_west_lofts(K, P, PL);
  ship_west_cannery(K, P, PL);
  ship_west_fish(K, P, PL);
  ship_west_quay(K, P, PL);
  ship_west_sheds(K, P, PL);
  ship_west_filler(K, P, PL);
}

/* the streets: flat benches, painted lanes with their centre dashes */
function ship_west_streets(K, P, PL) {
  K.street('x', 1020, 96, 244, PL.y1, [], { rw: 6, sw: 4 });           // Harbour Road, west segment
  K.street('x', 1120, 96, 244, PL.y2, [], { rw: 5, sw: 3 });           // Quay Road, west segment
  K.dash(2, 1020, 94, 1020);                                            // Harbour Road x 0..96: paint only, no curbs
  K.dash(18, 932, 252, 932, 0xe2c044);                                  // Ropewalk Lane
  K.dash(250, 934, 250, 1008, 0xe2c044);                                // Net Loft Lane, in two runs across Harbour Road
  K.dash(250, 1032, 250, 1110, 0xe2c044);
}

/* Net Racks on the Harbour Gate apron: eight flat-bars at 0.75 m */
function ship_west_netracks(K, P, PL) {
  const th = K.terrainH;
  for (const z of [1060, 1068, 1076, 1084]) for (const [x0, x1] of [[34, 54], [62, 82]]) {
    K.rail(x0, th(x0, z) + 0.75, z, x1, th(x1, z) + 0.75, z, 'Rail', true);
    for (const x of [x0 - 0.5, x1 + 0.5]) K.prop(x - 0.07, th(x, z), z - 0.07, x + 0.07, th(x, z) + 2.4, z + 0.07, 0x6b5a45);   // drying-frame poles
    K.prop(x0 - 0.5, th(x0, z) + 2.3, z - 0.04, x1 + 0.5, th(x1, z) + 2.4, z + 0.04, 0x7d6c55);                                  // and the beam between them
  }
  K.bench(20, 1040, 26, 1040.6); K.bench(20, 1100, 26, 1100.6);
  P.spot('Net Racks', 24, th(24, 1072), 1072, -Math.PI / 2, [30, 1056, 86, 1088]);
}

/* the Port Authority: building, terrace, the Authority Five, lips, bank, planters */
function ship_west_authority(K, P, PL) {
  const T = -39.75;
  K.building(108, 946, 172, 976, 5, 0x9c9890, 'stone');
  K.decorFns.push(D => D.sign('PORT AUTHORITY', 140, -36.0, 976.05, 14, 1.6, 0, '#f2ead8', '#2f3a4a'));
  K.B(104, -41.6, 976, 176, T, 988, 'marble', { edges: 'w' });
  K.stairSpot('z', 988, 1, 124, 156, T, -41.464, 5, 0.45, { rails: [123.55, 140, 156.45] });          // the Authority Five
  K.lip(104, 988, 123.1, 988, T); K.lip(156.9, 988, 176, 988, T);                                      // 1.6 m drops on to the forecourt
  K.hubbas.push({ a: V(176, T, 982), b: V(186, -41.316, 982), w: 10, noRails: true, color: 0xc4bfb3 }); // the bank up from the east
  for (const x of [110, 162]) K.B(x, T - 0.05, 979, x + 3.5, -39.2, 980.2, 'marble', { edges: 'ns' });  // block benches on the terrace
  for (const x of [106, 122, 151, 167]) { K.planter(x, 996, x + 5, 999); K.tree(x + 2.5, 997.5); }
  K.lamp(104, 1008, 1); K.lamp(176, 1008, 1);
  P.spot('Port Authority', 140, T, 981, Math.PI, [104, 976, 186, 1010]);
  P.challenge({ id: 'ship-pa-kf', name: 'Kickflip the Authority Five', desc: 'Kickflip down the Port Authority stairs',
    at: [140, T, 987], go: [140, T, 979, Math.PI], kind: 'trick', trick: 'Kickflip',
    from: [124, 980, 156, 988, -40.0, -39.4], to: [122, 989.8, 158, 1008, -42.5, -41.0] });
  P.challenge({ id: 'ship-pa-crook', name: 'Crooked the Authority Rail', desc: 'Crooked grind (or overcrook) a Port Authority handrail', hard: true,
    at: [123.55, -39.2, 989], go: [140, T, 980, Math.PI], kind: 'grind', rail: 'Handrail', grind: 'Crooked|Overcrook',
    area: [122.5, 987.5, 157.5, 990.5] });
}

/* the Net Lofts, the stoop and the shop Slipway Skates */
function ship_west_lofts(K, P, PL) {
  K.building(194, 950, 240, 1002, 3, 0x8c6a5d, 'brick');      // the doc starts it at x 186, which shuts the Port Authority bank against a wall; 194 leaves 8 m of run-up
  K.B(194, -42.1, 1002, 218, -40.794, 1005, 'step', { edges: 's' });
  K.stairSpot('x', 218, 1, 1002, 1005, -40.794, -41.722, 3, 0.4, { rails: [1005.45] });
  P.shop({ name: 'Slipway Skates', sign: [228, -37.844, 1002.04, 0, 7], awning: [222, 1002, 234, 1003.6, -39.494], zone: [224, 1002.2, 232, 1005.2], door: [228, -41.694, 1002] });
  P.travel('Slipway Skates', 228, -41.75, 1006, 0, 'spot');
  P.spot('Net Lofts', 204, -40.79, 1003.5, -Math.PI / 2, [186, 1000, 242, 1010]);
}

/* the Bonito Cannery: dock, steps, ramp, three dock levellers, crates */
function ship_west_cannery(K, P, PL) {
  const D0 = -40.834;
  K.building(104, 1052, 236, 1104, 2, 0x9b5a46, 'brick');
  K.decorFns.push(D => D.sign('BONITO CANNERY', 170, -36.4, 1051.95, 16, 1.6, Math.PI, '#f4e6c8', '#7a2e22'));
  K.B(110, -42.6, 1044, 230, D0, 1052, 'plaza', { edges: 'n' });
  K.stairSpot('x', 110, -1, 1044, 1052, D0, -42.11, 4, 0.4, { rails: [1043.55] });
  K.hubbas.push({ a: V(230, D0, 1048), b: V(238, -42.11, 1048), w: 8, noRails: true, color: 0xb9b5ab });
  for (const x of [135, 165, 195]) K.hubbas.push({ a: V(x, D0, 1044), b: V(x, -41.921, 1038), w: 3 });   // the levellers, with Hubba rails
  K.B(146, D0 - 0.06, 1046, 148.4, D0 + 0.8, 1048.4, 'wood', { edges: 'nswe' });
  K.B(176, D0 - 0.06, 1045.5, 180, D0 + 0.6, 1047.5, 'wood', { edges: 'nswe' });
  K.B(208, D0 - 0.06, 1049, 209.2, D0 + 1.2, 1050.2, 'wood', { edges: 'nswe' });
  P.spot('Cannery Levellers', 165, D0, 1046, 0, [104, 1036, 240, 1052]);
}

/* the East Quay Fish Market: platform, steps, ramp, tables, columns, roof, crates */
function ship_west_fish(K, P, PL) {
  const Y = PL.Y, PT = -42.044, ROOF = Y(1140) + 6;
  for (let k = 0; k < 7; k++) for (const z of [1140, 1166]) K.B(104 + 16 * k - 0.25, Y(z) - 0.3, z - 0.25, 104 + 16 * k + 0.25, ROOF, z + 0.25, 'metal');
  K.prop(102, ROOF, 1138, 202, ROOF + 0.4, 1168, 0x6f7d84);
  K.decorFns.push(D => D.sign('EAST QUAY FISH MARKET', 152, ROOF + 0.8, 1137.95, 18, 1.6, Math.PI, '#f2f0ea', '#2c5a6e'));   // on the roof's north edge (the doc's z 1129.9 hangs in the air)
  K.B(106, -43.6, 1130, 198, PT, 1136, 'plaza', { edges: 'ns' });
  K.stairSpot('x', 106, -1, 1130, 1136, PT, -43.244, 4, 0.4, { rails: [1136.45] });
  K.hubbas.push({ a: V(198, PT, 1133), b: V(206, -43.244, 1133), w: 5, noRails: true, color: 0xb9b5ab });
  for (const x of [114, 132, 150, 168, 186]) for (const z of [1150, 1157])
    K.B(x, Y(z) - 0.2, z, x + 5, Y(z) + 0.9, z + 1.2, 'metal', { edges: 'nswe' });
  for (const x of [120, 140, 160, 180]) { K.B(x, Y(1162) - 0.3, 1162, x + 2, Y(1162) + 0.5, 1164, 'wood'); K.B(x + 0.2, Y(1162) + 0.45, 1162.2, x + 1.8, Y(1162) + 0.95, 1163.8, 'wood'); }
  P.tape(196, 1133, PT);
  P.spot('East Quay Fish Market', 110, PT, 1133, -Math.PI / 2, [102, 1128, 206, 1170]);
}

/* the Quay Walk slappies, the quay edge and the bollards */
function ship_west_quay(K, P, PL) {
  const th = K.terrainH;
  for (const z of [1162.3, 1168.3]) {
    const g0 = th(20, z), g1 = th(92, z);
    K.hubbas.push({ a: V(20, g0 + 0.25, z), b: V(92, g1 + 0.25, z), w: 0.6, noRails: true, color: 0x8a6a48 });
    K.rail(20, g0 + 0.25, z - 0.3, 92, g1 + 0.25, z - 0.3, 'Ledge', false);
  }
  for (const x of [30, 60, 90]) K.lamp(x, 1142, 1);
  K.B(0, -50, 1176, 16, -41.965, 1180, 'ledge', { edges: 's' });
  K.hubbas.push({ a: V(16, -41.973, 1178), b: V(96, -44.0, 1178), w: 4, noRails: true, color: 0x9d9a92 });
  K.rail(16, -41.973, 1180, 96, -44.0, 1180, 'Ledge', false);
  K.B(16, -50, 1179.4, 96, -44.3, 1180, 'ledge');
  K.B(96, -50, 1176, 256, -44.0, 1180, 'ledge', { edges: 's' });
  for (let x = 6; x < 255; x += 12) {
    const g = x > 16 && x < 96 ? Math.max(th(x, 1178), -41.973 - (x - 16) / 80 * 2.027) : th(x, 1178);
    K.B(x - 0.25, g - 0.25, 1177.75, x + 0.25, g + 0.6, 1178.25, 'metal', { color: 0x2b2b2e });
  }
}

/* the Ropewalk Sheds and the Harbour Master's hut */
function ship_west_sheds(K, P, PL) {
  K.building(20, 944, 96, 1004, 2, 0xa39a8c, 'brick');
  K.building(40, 1126, 52, 1136, 2, 0x8a9a9e, 'stone');
}

/* a row of small things from a list of [code, x, z]: the streets' filler. b bench, p planter, l ledge 6 m, k bike rack, n news boxes,
   t trash can, h hydrant, j jersey, d manual pad, w pallet stack, c roadworks pocket */
function ship_west_bits(K, list) {
  for (const [c, x, z, v] of list) {
    if (c === 'b') K.bench(x - 2, z, x + 2, z + 0.6);
    else if (c === 'p') K.planter(x - 2, z, x + 2, z + 1.4, v || 0.55);
    else if (c === 'l') K.ledge(x - 3, z, x + 3, z + 0.6, v || 0.45);
    else if (c === 'k') K.bikeRack(x, z, true);
    else if (c === 'n') K.newsBoxes(x, z, true, 2);
    else if (c === 't') K.trashCan(x, z);
    else if (c === 'h') K.hydrant(x, z);
    else if (c === 'j') K.jersey(x - 3, z, x + 3, z + 0.6);
    else if (c === 'd') K.pad(x - 3, z, x + 3, z + 2.4, 0.18);
    else if (c === 'w') K.B(x, K.terrainH(x, z) - 0.3, z, x + 1.2, K.terrainH(x, z) + (v || 0.6), z + 1.2, 'wood', { edges: 'nswe' });
    else if (c === 'c') K.construction(x, z, true);
    else if (c === 'v') K.ledge(x - 0.3, z - 3, x + 0.3, z + 3, v || 0.45);       // a ledge running north-south
    else if (c === 'q') K.pad(x - 1.2, z - 3, x + 1.2, z + 3, 0.18);              // a manual pad running north-south
    else if (c === 'u') K.jersey(x - 0.3, z - 3, x + 0.3, z + 3);
  }
}

function ship_west_filler(K, P, PL) {
  const th = K.terrainH;
  P.spot('Harbour Gate Ledges', 80, th(80, 1030), 1030, -Math.PI / 2, [16, 1008, 100, 1034]);
  P.spot('Net Loft Lane Pads', 252, th(252, 1060), 1060, Math.PI, [244, 940, 256, 1112]);
  P.spot('Quay Road Ledges', 226, th(226, 1122), 1122, -Math.PI / 2, [206, 1110, 256, 1130]);
  P.spot('Quay Walk Slappies', 56, th(56, 1165), 1165, -Math.PI / 2, [20, 1144, 104, 1172]);
  ship_west_bits(K, [
    // Harbour Road, x 16..96: ledges beside the painted road
    ['l', 23, 1010.4], ['l', 53, 1010.4], ['l', 83, 1010.4], ['p', 39, 1029.3], ['l', 66, 1029.4], ['d', 88, 1028.4],
    // Harbour Road, x 96..244, on the sidewalks (their tops are 0.15 over the ground)
    ['b', 100, 1011.2], ['n', 118, 1028.4], ['p', 134, 1011.5, 0.7], ['k', 150, 1028.2], ['h', 160, 1011.4], ['b', 178, 1028.4],
    ['p', 196, 1011.5, 0.7], ['n', 212, 1011.4], ['k', 226, 1028.2], ['l', 238, 1028.3, 0.6],
    // Quay Road, x 96..256, beyond the fish platform
    ['b', 100, 1126.2], ['p', 214, 1126.6, 0.7], ['k', 226, 1113.2], ['l', 238, 1126.4, 0.6], ['n', 248, 1113.4],
    // Ropewalk Lane, x 16..256: pallets, jerseys, roadworks and pads along the south edge
    ['j', 22, 939.5], ['w', 36, 940], ['w', 38, 940.4, 0.9], ['d', 50, 939.6], ['j', 66, 939.5], ['c', 84, 940.6], ['w', 100, 940, 1.2], ['w', 102, 940.4],
    ['l', 112, 940], ['d', 128, 939.6], ['j', 144, 939.5], ['c', 162, 940.6], ['w', 180, 940], ['w', 182, 940.4, 0.9], ['d', 196, 939.6],
    ['l', 212, 940], ['j', 228, 939.5], ['d', 246, 939.6],
    // Net Loft Lane, x 250: pads and ledges along the east edge, clear of the cars at x 247 and 253
    ['q', 254.8, 950], ['v', 255, 972], ['q', 254.8, 996], ['q', 254.8, 1038], ['v', 255, 1062], ['q', 254.8, 1086], ['u', 255, 1103],
    // Quay Walk, x 20..104: ledges on its south edge
    ['l', 26, 1156.9], ['l', 52, 1156.9], ['l', 78, 1156.9], ['l', 100, 1156.9],
  ]);
}

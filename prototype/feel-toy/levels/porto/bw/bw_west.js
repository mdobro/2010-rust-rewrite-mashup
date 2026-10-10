/* Boardwalk West, the west part: x -1000..-672, z 910..1350 (design/bw.md 10.2).
   The Spillway Outlet and its bridge, the Drydock, the Boatyard, the Net Lofts and Loft Alley, the Chandlery shop, Quay Road,
   Harbour Road and Net Loft Lane (west), the far-west boardwalk with its Slappy curbs, the quay wall, the West Mole with
   Gull Point Light, and the small stuff that keeps the streets from going dead (CONTRACT 7). */
function bw_west(K, P, PL) {
  bw_west_outlet(K, P, PL);
  bw_west_bridge(K, P, PL);
  bw_west_drydock(K, P, PL);
  bw_west_yard(K, P, PL);
  bw_west_streets(K, P, PL);
  bw_west_front(K, P, PL);
  bw_west_mole(K, P, PL);
  bw_west_filler(K, P, PL);
}

/* a sloped block: top at a, foot at b */
function bw_west_ramp(K, ax, ay, az, bx, by, bz, w, color) {
  K.hubbas.push({ a: V(ax, ay, az), b: V(bx, by, bz), w, noRails: true, color: color || 0xb9b5ab });
}

/* ---------- the Spillway Outlet (x -728..-672, z 944..1136) ---------- */
function bw_west_outlet(K, P, PL) {
  const { YN } = PL, fo = PL.outletFloor;
  K.feat(-728, -672, 944, 1136, (x, z) => PL.outlet(x, z), 'min');
  // the weir hump: a 0.6 m pair of ramps across the floor at z 980
  { const f0 = fo(980), top = f0 + 0.6;
    bw_west_ramp(K, -700, top, 980, -700, fo(975.6) + 0.02, 975.6, 18, 0xa9a59c);
    bw_west_ramp(K, -700, top, 980, -700, fo(984.4) + 0.02, 984.4, 18, 0xa9a59c); }
  // stilling basin baffles (rows at z 1100 and 1108) and the end sill at z 1118
  const F = -45.6;
  for (const [x, h] of [[-708, 0.6], [-692, 0.6]]) K.B(x - 1.2, F - 0.4, 1100, x + 1.2, F + h, 1102.4, 'garage', { edges: 'ns' });
  bw_west_ramp(K, -700, F + 0.6, 1100, -700, F + 0.02, 1097.2, 2.4, 0xa9a59c);    // the middle one is a ramp, so the line down x -700 stays open
  for (const [x, h] of [[-704, 0.7], [-696, 0.7]]) K.B(x - 1.2, F - 0.4, 1108, x + 1.2, F + h, 1110.4, 'garage', { edges: 'ns' });
  K.B(-712, F - 0.4, 1118, -688, F + 0.4, 1119, 'garage', { edges: 'ns' });
  bw_west_ramp(K, -700, F + 0.4, 1118, -700, F + 0.02, 1115.8, 23.6, 0xa9a59c);
  // scour blocks at the toes of the banks, so the long floor has something at its edges
  for (const z of [1046, 1068, 1086]) { K.B(-709.6, fo(z) - 0.4, z, -707.6, fo(z) + 0.45, z + 3, 'garage', { edges: 'ew' }); K.B(-692.4, fo(z + 8) - 0.4, z + 8, -690.4, fo(z + 8) + 0.45, z + 11, 'garage', { edges: 'ew' }); }
  // the west guard rail along the lip (it stops for the bridge)
  K.rail(-729, YN + 1.0, 948, -729, YN + 1.0, 1004, 'Handrail', true);
  K.rail(-729, YN + 1.0, 1036, -729, YN + 1.0, 1092, 'Handrail', true);
  // the east lip is in the park's rect (x >= -672); the floor is smooth concrete from P.col
  P.spot('Spillway Outlet', -700, -41.9, 960, Math.PI, [-728, 944, -672, 1000]);
  P.spot('Spillway Ford', -700, -40.5, 940, Math.PI, [-716, 926, -684, 950]);
  P.spot('Stilling Basin', -700, F, 1105, Math.PI, [-728, 1090, -672, 1136]);
  P.spot('Outlet Bridge', -700, YN, 1020, Math.PI, [-730, 1010, -672, 1030]);
}

/* ---------- Harbour Road over the outlet: deck, walks, parapets, lamps ---------- */
function bw_west_bridge(K, P, PL) {
  const { YN } = PL;
  K.B(-730, -41.40, 1010, -672, YN, 1030, 'garage');
  K.B(-730, YN - 0.1, 1010.4, -672, YN + 0.15, 1014, 'sidewalk', { edges: 's' });
  K.B(-730, YN - 0.1, 1026, -672, YN + 0.15, 1029.6, 'sidewalk', { edges: 'n' });
  K.B(-730, YN, 1010, -672, YN + 0.9, 1010.4, 'garage', { edges: 'ns' });
  K.B(-730, YN, 1029.6, -672, YN + 0.9, 1030, 'garage', { edges: 'ns' });
  K.paintRect(-730, 1014, -672, 1026, 0x56585d, YN + 0.006);
  for (let x = -728; x < -674; x += 6) K.dash(x, 1020, x + 3, 1020);
  // a curb ramp at each end of the road (the walks run on across)
  for (const x of [-715, -687]) { K.posts.push([x, 1011.8]); K.decorFns.push(D => D.lamp(x, YN, 1011.8, 1)); }
  K.decorFns.push(D => { D.prop(-730, -41.4, 1009.6, -672, -41.0, 1010.0, 0x7d7a72); D.prop(-730, -41.4, 1030, -672, -41.0, 1030.4, 0x7d7a72); });
}

/* ---------- The Drydock (x -962..-871, z 1056..1170) ---------- */
function bw_west_drydock(K, P, PL) {
  const { YN, YF } = PL, R = 7, W = R * Math.sin(78 * Math.PI / 180), XE = -872.14, XS = XE - W;
  K.feat(-962, -871, 1056, 1168, (x, z, h) => {
    if (x >= XE) return h;
    const fl = z < 1096 ? lerp(YN, YF, (z - 1056) / 40) : YF;
    return x > XS ? fl + PL.arc(x - XS, R, W) : fl;
  }, 'min');
  // altars A/B/C, 80 m of floor beside them
  K.B(-958, YF - 0.5, 1100, -952, -42.0, 1168, 'garage', { edges: 'ew' });
  K.B(-952, YF - 0.5, 1100, -946, -43.4, 1168, 'garage', { edges: 'ew' });
  K.B(-946, YF - 0.5, 1100, -940, -44.8, 1168, 'garage', { edges: 'ew' });
  // the Dock Stairs: A is a ten-step flight with rails, B and C are banks, and a short flight from the west rim
  K.stairSpot('z', 1100, -1, -958, -952, -42.0, YF, 10, 0.4, { rails: [-957.55, -952.45] });
  bw_west_ramp(K, -949, -43.4, 1100, -949, YF + 0.02, 1095.5, 5.8, 0xb9b5ab);
  bw_west_ramp(K, -943, -44.8, 1100, -943, YF + 0.02, 1096.5, 5.8, 0xb9b5ab);
  K.stairSpot('x', -962, 1, 1130, 1136, YN, -42.0, 4, 0.4, { rails: [1130.45, 1135.55] });
  // the east wall: coping at the rim, and the west rim
  K.rail(-872.1, YN, 1064, -872.1, YN, 1166, 'Coping', false);
  K.rail(-962, YN, 1062, -962, YN, 1166, 'Coping', false);
  // the caisson that shuts the south end: its top is a 4 m walk across to the Mole
  K.B(-962, YF - 0.4, 1168, -868, YN, 1172, 'metal', { edges: 'n', color: 0x6c7479 });
  // fence across the north with the gap for the roll-in
  K.B(-962, YN, 1043.9, -916, YN + 2.2, 1044.1, 'fence'); K.B(-908, YN, 1043.9, -871, YN + 2.2, 1044.1, 'fence');
  K.B(-872, YN, 1044.1, -871.8, YN + 2.2, 1056, 'fence');
  // keel blocks along the floor, bilge beams across it, chains to hop
  for (let z = 1106; z < 1164; z += 9) K.B(-906, YF - 0.3, z, -904, YF + 0.5, z + 4.5, 'wood', { edges: 'ew' });
  K.B(-936, YF - 0.3, 1126, -916, YF + 0.45, 1126.7, 'wood', { edges: 'ns' }); K.B(-906, YF - 0.3, 1126, -886, YF + 0.45, 1126.7, 'wood', { edges: 'ns' });
  K.B(-934, YF - 0.3, 1150, -914, YF + 0.7, 1150.8, 'wood', { edges: 'ns' }); K.B(-900, YF - 0.3, 1150, -882, YF + 0.7, 1150.8, 'wood', { edges: 'ns' });
  for (const [x0, x1] of [[-936, -916], [-906, -884]]) {
    K.B(x0 - 0.2, YF - 0.2, 1137.8, x0 + 0.2, YF + 0.55, 1138.2, 'metal', { color: 0x4a4f55 }); K.B(x1 - 0.2, YF - 0.2, 1137.8, x1 + 0.2, YF + 0.55, 1138.2, 'metal', { color: 0x4a4f55 });
    K.rail(x0 + 0.2, YF + 0.5, 1138, x1 - 0.2, YF + 0.5, 1138, 'Chain', false);
  }
  // mooring chains along the east rim between bollards
  const zs = []; for (let z = 1062; z <= 1162; z += 14.3) zs.push(z);
  zs.forEach((z, i) => {
    K.B(-870.2, YN - 0.1, z - 0.25, -869.6, YN + 0.55, z + 0.25, 'metal', { color: 0x4a4f55 });
    if (i) K.rail(-869.9, YN + 0.5, zs[i - 1] + 0.3, -869.9, YN + 0.5, z - 0.3, 'Chain', false);
  });
  // a gantry over the gap carries the name
  K.prop(-917.2, YN, 1043.6, -916.6, YN + 4.6, 1044.4, 0x6c7479); K.prop(-907.4, YN, 1043.6, -906.8, YN + 4.6, 1044.4, 0x6c7479);
  K.prop(-917.2, YN + 4.2, 1043.6, -906.8, YN + 4.6, 1044.4, 0x6c7479);
  K.decorFns.push(D => D.sign('DRY DOCK 2', -912, YN + 3.0, 1044.2, 8, 1.4, Math.PI, '#f2ead8', '#7a2e22'));
  // apron: low things to pop over on the way in
  K.B(-925, YN - 0.6, 1066, -921, YN, 1066.8, 'wood', { edges: 'ns' });
  K.Bg(-926, 1076, -920, 1077, 0.4, 'ledge', { edges: 'ns' });
  K.Bg(-905, 1084, -899, 1085, 0.4, 'ledge', { edges: 'ns' });
  K.Bg(-940, 1070, -936, 1071.2, 0.4, 'ledge', { edges: 'ns' });
  K.Bg(-892, 1072, -888, 1073.2, 0.4, 'ledge', { edges: 'ns' });
  P.spot('The Drydock', -912, -42.0, 1085, Math.PI, [-962, 1056, -871, 1168]);
  P.spot('Drydock Gate', -912, YN, 1034, Math.PI, [-930, 1024, -894, 1046]);
  P.spot('Drydock Altars', -949, -43.4, 1130, Math.PI, [-958, 1100, -940, 1168]);
  P.spot('Drydock East Wall', -884, YF, 1130, Math.PI, [-890, 1100, -871, 1168]);
  P.spot('Caisson Walk', -912, YN, 1174, Math.PI, [-962, 1172, -868, 1176]);
}

/* ---------- Boatyard, Net Lofts, Loft Alley, Chandlery ---------- */
function bw_west_yard(K, P, PL) {
  const { YN } = PL;
  // the Boatyard: two sheds (the first starts at -954 so the lane at x -960 stays open), a travel-lift, a hull on cradles
  K.building(-954, 948, -910, 984, 3, 0x9aa3a8, 'metal');
  K.building(-900, 948, -856, 976, 2, 0x8f9aa0, 'metal');
  K.decorFns.push(D => D.sign('GULL POINT BOATYARD', -932, YN + 8, 984.1, 24, 2.4, 0, '#f2ead8', '#2f5d8a'));
  for (const x of [-884.5, -875.5]) for (const z of [989, 999]) K.B(x - 0.4, YN, z - 0.4, x + 0.4, YN + 7, z + 0.4, 'metal', { color: 0xd4a017 });
  for (const x of [-884.5, -875.5]) K.B(x - 0.4, YN + 6.6, 988.6, x + 0.4, YN + 7.4, 999.4, 'metal', { color: 0xd4a017 });
  K.B(-884.9, YN + 7.0, 988.6, -875.1, YN + 7.8, 989.4, 'metal', { color: 0xd4a017 });
  K.decorFns.push(D => { const g = new THREE.SphereGeometry(1, 14, 8); D.add(g, 0x2f5d8a, [-880, YN + 2.5, 994], [0, 0, 0], [2.7, 1.8, 9.5]); D.add(g, 0xe8e4da, [-880, YN + 3.4, 994], [0, 0, 0], [2.4, 0.5, 9.1]); });
  K.rail(-881.9, YN + 0.5, 985, -881.9, YN + 0.5, 1003, 'Rail', true); K.rail(-878.1, YN + 0.5, 985, -878.1, YN + 0.5, 1003, 'Rail', true);
  // a hull hip: two 0.8 m ramps meeting at a ridge
  bw_west_ramp(K, -856, YN + 0.8, 1003, -862, YN + 0.02, 1003, 5, 0xc49a5c); bw_west_ramp(K, -856, YN + 0.8, 1003, -850, YN + 0.02, 1003, 5, 0xc49a5c);
  // timber stacks and cradle blocks
  for (const [x, z] of [[-946, 992], [-946, 999], [-936, 1003], [-924, 992], [-866, 984], [-846, 990]]) K.Bg(x - 2.2, z - 0.7, x + 2.2, z + 0.7, 0.6, 'wood', { edges: 'ns' });
  // Net Lofts and Loft Alley
  K.building(-862, 1040, -840, 1100, 2, 0x8c5a3c, 'brick');
  K.building(-824, 1040, -802, 1100, 2, 0x6b4c3a, 'brick');
  K.B(-840, YN - 0.3, 1050, -837, YN + 0.9, 1090, 'wood', { edges: 'e' });
  K.B(-827, YN - 0.3, 1050, -824, YN + 0.9, 1090, 'wood', { edges: 'w' });
  for (const [x, d] of [[-838.5, 1], [-825.5, 1]]) { bw_west_ramp(K, x, YN + 0.9, 1090, x, YN + 0.02, 1094.5, 2.6, 0xc49a5c); bw_west_ramp(K, x, YN + 0.9, 1050, x, YN + 0.02, 1045.5, 2.6, 0xc49a5c); }
  P.spot('Loft Alley', -832, YN, 1070, Math.PI, [-840, 1044, -824, 1096]);
  P.spot('Net Lofts', -832, YN, 1034, Math.PI, [-864, 1026, -800, 1044]);
  P.spot('Boatyard', -900, YN, 998, Math.PI, [-968, 984, -840, 1010]);
  P.spot('Travel Lift', -880, YN, 1006, Math.PI, [-890, 984, -870, 1010]);
  // two plain stores on the quay side of Harbour Road, between the Boatyard and the outlet
  K.building(-836, 954, -806, 988, 2, 0x7d8a8f, 'brick');
  K.building(-772, 956, -742, 990, 2, 0xa7744f, 'brick');
  // the Chandlery and its skate shop
  K.building(-778, 1036, -742, 1062, 2, 0x2f5d8a, 'brick');
  P.shop({ name: 'Chandlery Skate Supply', sign: [-760, YN + 3.85, 1035.96, Math.PI, 7], awning: [-766, 1034.4, -754, 1036, YN + 2.2], zone: [-764, 1032.8, -756, 1035.8], door: [-760, YN, 1035.8] });
  P.travel('Chandlery Skate Supply', -760, YN + 0.15, 1031, Math.PI, 'spot');
  P.spot('Chandlery', -760, YN, 1031, Math.PI, [-780, 1028, -740, 1038]);
  K.building(-776, 1072, -746, 1100, 2, 0xb59a6e, 'stone');
}

/* ---------- streets: Harbour Road west, Net Loft Lane ---------- */
function bw_west_streets(K, P, PL) {
  const { YN } = PL;
  K.street('x', 1020, -968, -730, YN, [-790], { rw: 6, sw: 4 });
  K.street('z', -790, 944, 1096, YN, [1020], { rw: 5, sw: 3 });
  // pines on the edge hill behind the Boatyard
  for (const [x, z] of [[-992, 950], [-988, 985], [-994, 1020], [-990, 1060], [-993, 1100], [-989, 1135]]) K.tree(x, z);
  P.spot('Net Loft Corner', -790, YN, 1030, Math.PI, [-800, 1022, -780, 1040]);
  P.spot('Quay Road West', -950, YN, 938, Math.PI, [-968, 926, -930, 948]);
  P.spot('Quay Pull-off', -830, YN, 938, Math.PI, [-850, 926, -810, 948]);
  P.spot('Net Loft Quay', -770, YN, 938, Math.PI, [-790, 926, -750, 948]);
}

/* ---------- the far-west boardwalk: Slappy curbs, lamps, benches, bollards, quay wall, boats ---------- */
function bw_west_front(K, P, PL) {
  const { YN, YS } = PL, Q = PL.Q;
  // Slappy curbs: 28 m of low wooden curb, a 4 m gap, so you pop off and on again
  for (let x0 = -864; x0 < -690; x0 += 32) {
    const x1 = Math.min(x0 + 28, -680);
    if (x1 <= -824 || x0 >= -784) { const y = Q((x0 + x1) / 2, 1162.7); K.B(x0, y - 0.3, 1162.4, x1, y + 0.28, 1163, 'wood', { edges: 'ns' }); }
    else K.strip(x0, 1162.7, x1, 1162.7, 0.28, 0.6, { kind: 'Ledge', color: 0xb58a57 });
  }
  // lamps every 24 m at z 1141 and benches every 30 m facing the sea
  for (let x = -852; x < -684; x += 24) K.lamp(x, 1141, 1);
  for (let x = -846; x < -690; x += 30) K.bench(x - 1.1, 1140.2, x + 1.1, 1140.8);
  // quay wall with coping edge at z 1176..1180, and a bollard every 12 m
  // (long boxes on the flat stretches, 4 m pieces where the boardwalk ramps from YN to YS)
  K.B(-972, -48, 1176, -824, YN, 1180, 'garage', { edges: 's' });
  for (let x = -824; x < -784; x += 4) { const y = Q(x + 2, 1178); K.B(x, -48, 1176, x + 4, y, 1180, 'garage', { edges: 's' }); }
  K.B(-784, -48, 1176, -672, YS, 1180, 'garage', { edges: 's' });
  for (let x = -966; x < -676; x += 12) { if (x > -970 && x < -960) continue; const y = Q(x, 1177); K.B(x - 0.2, y, 1176.8, x + 0.2, y + 0.6, 1177.2, 'metal', { color: 0x3a3d42 }); }
  // boats moored off the quay (look only)
  K.decorFns.push(D => { const g = new THREE.SphereGeometry(1, 12, 8); const cols = [0xe8e4da, 0x2f5d8a, 0xb23a32, 0xd4a017, 0x3f6b46];
    [[-940, 1196], [-905, 1210], [-860, 1192], [-818, 1224], [-775, 1200], [-735, 1216], [-696, 1194]].forEach(([x, z], i) => {
      D.add(g, cols[i % 5], [x, -45.6, z], [0, 0.2 * i, 0], [1.6, 0.9, 4.2]); D.prop(x - 0.08, -45.2, z - 0.08, x + 0.08, -40.6, z + 0.08, 0xcfc4ad); }); });
  P.spot('Boatyard Quay', -850, YN, 1146, Math.PI, [-870, 1140, -830, 1160]);
  P.spot('Net Loft Quay Walk', -770, YS, 1146, Math.PI, [-790, 1140, -750, 1160]);
  P.spot('Outlet Quay', -700, YS, 1146, Math.PI, [-720, 1140, -680, 1160]);
}

/* ---------- the West Mole and Gull Point Light ---------- */
function bw_west_mole(K, P, PL) {
  const { YN } = PL;
  K.B(-992, -47, 1176, -972, YN, 1296, 'garage', { edges: 'ew' });
  K.B(-985, YN, 1285, -979, YN + 1, 1291, 'garage', { edges: 'ns' });
  K.B(-984.2, YN + 1, 1285.8, -979.8, YN + 19, 1290.2, 'metal', { ghost: true });
  K.decorFns.push(D => {
    D.add(new THREE.CylinderGeometry(2.0, 2.4, 18, 16), 0xf2f2ee, [-982, YN + 10, 1288]);
    D.add(new THREE.CylinderGeometry(2.1, 2.1, 3, 16), 0xc8432f, [-982, YN + 13, 1288]);
    D.add(new THREE.CylinderGeometry(1.5, 1.5, 2.4, 16), 0xffe9a8, [-982, YN + 20.2, 1288]);
    D.add(new THREE.ConeGeometry(1.8, 2.4, 16), 0xc8432f, [-982, YN + 22.6, 1288]);
  });
  for (const z of [1190, 1230, 1270]) K.lamp(-973.5, z, -1);
  P.spot('West Mole', -982, YN, 1200, Math.PI, [-992, 1180, -972, 1230]);
  P.spot('Gull Point Light', -982, YN, 1270, Math.PI, [-992, 1250, -972, 1296]);
}

/* ---------- one small piece of street furniture, centred on (x, z), long way along x or z ---------- */
function bw_west_piece(K, name, x, z, alongX) {
  const ax = alongX !== false, g = (hu, hv, h, mat, edges) => ax ? K.Bg(x - hu, z - hv, x + hu, z + hv, h, mat, { edges }) : K.Bg(x - hv, z - hu, x + hv, z + hu, h, mat, { edges });
  const al = ax ? 'n' : 'e';     // one grind edge each, to keep the rail count down
  switch (name) {
    case 'ledge': g(3.5, 0.3, 0.45, 'ledge', al); break;
    case 'long': g(5.5, 0.3, 0.4, 'ledge', al); break;
    case 'planter': g(1.6, 0.7, 0.55, 'ledge', al); break;
    case 'pad': g(3, 0.7, 0.18, 'pad', al); break;
    case 'bench': g(1.1, 0.3, 0.45, 'wood', al); break;
    case 'crate': g(0.8, 0.8, 0.9, 'wood', ''); break;
    case 'timber': g(2.2, 0.7, 0.6, 'wood', al); break;
    case 'jersey': g(2, 0.3, 0.8, 'ledge', al); break;
    case 'kick': K.kicker(ax ? x - 3 : x, ax ? z : z - 3, ax ? 1 : 0, ax ? 0 : 1, 2.4, 0.5, 1.3); g(2.5, 0.7, 0.18, 'pad', al); break;
    case 'rack': K.bikeRack(x, z, ax); K.trashCan(ax ? x + 2.2 : x, ax ? z : z + 2.2); break;
    case 'news': K.newsBoxes(x, z, ax, 2); K.hydrant(ax ? x + 2 : x, ax ? z : z + 2); break;
    case 'bump': bw_west_ramp(K, x, K.terrainH(x, z) + 0.45, z, ax ? x - 2.4 : x, K.terrainH(x, z) + 0.02, ax ? z : z - 2.4, 1.6, 0xc49a5c);
      bw_west_ramp(K, x, K.terrainH(x, z) + 0.45, z, ax ? x + 2.4 : x, K.terrainH(x, z) + 0.02, ax ? z : z + 2.4, 1.6, 0xc49a5c); break;
  }
}

/* ---------- filler: something skateable within 10 m at least every 30 m on every street, pier and path (CONTRACT 7) ---------- */
function bw_west_filler(K, P, PL) {
  const { YN } = PL, kinds = ['ledge', 'planter', 'pad', 'kick', 'bench', 'news', 'long', 'rack', 'bump', 'jersey'];
  let n = 0; const next = () => kinds[n++ % kinds.length];
  const free = (x, z) => !(x > -718 && x < -682 && z < 950) && !(x > -731 && z > 1004 && z < 1036) && !(x > -966 && x < -866 && z > 1048 && z < 1171);
  const put = (x, z, alongX, k) => { if (free(x, z)) bw_west_piece(K, k || next(), x, z, alongX); };
  // Quay Road, north and south of the asphalt (the spillway corridor stays open)
  for (let x = -950, i = 0; x < -740; x += 26, i++) if (Math.abs(x + 790) > 12) put(x, i % 2 ? 923.6 : 938.4, true);
  K.construction(-862, 939.2, true);
  put(-722, 937.6, true, 'long'); put(-678, 937.6, true, 'long');   // either side of the spillway corridor
  // Boatyard Lane (x -960) and the yard's south lane (z 1010)
  for (let z = 940; z < 1010; z += 24) put(-965.5, z, false);
  for (let x = -946; x < -842; x += 24) if (x < -892 || x > -868) put(x, 1004.4, true);
  // Net Loft Lane: the outer side of each sidewalk, then the open part south of Harbour Road
  for (let z = 952, i = 0; z < 1096; z += 22, i++) { if (z > 1000 && z < 1040) continue; put(i % 2 ? -799.6 : -780.4, z, false); }
  for (let z = 1106, i = 0; z < 1142; z += 18, i++) put(i % 2 ? -797 : -783, z, false);
  K.construction(-796.5, 1124, false);
  // Harbour Road, outside the walks
  for (let x = -960, i = 0; x < -736; x += 24, i++) { if (x > -810 && x < -770) continue; if (i % 2 === 0 && x < -836) continue; put(x, i % 2 ? 1031.6 : 1008.4, true); }
  // in front of the Net Lofts and the Boatyard fence
  for (const [x, z, k] of [[-850, 1034, 'planter'], [-830, 1034, 'bench'], [-808, 1034, 'kick'], [-945, 1034, 'pad'], [-895, 1034, 'ledge'], [-928, 1034, 'bump']]) put(x, z, true, k);
  // the far-west boardwalk
  for (let x = -862, i = 0; x < -676; x += 28, i++) put(x, i % 2 ? 1146.4 : 1153.2, true);
  // the Caisson Walk
  for (const x of [-952, -936, -890, -874]) put(x, 1172.7, true, 'ledge');
  // the West Mole
  for (let z = 1186, i = 0; z < 1284; z += 20, i++) put(i % 2 ? -988 : -976, z, false, i % 3 === 2 ? 'planter' : 'long');
  // the root of the Mole and the old Boatyard slip
  put(-968, 1160, false, 'ledge'); put(-968, 1130, false, 'bench');
}

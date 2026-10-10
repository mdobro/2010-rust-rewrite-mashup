/* Boardwalk West, the gardens part: x -672..-212, z 1010..1350. Design: levels/porto/design/bw.md 10.4 (with 3.2, 4 rows 18-24, 25, 26, 31, 7).
   Harbour Road with its zebra, the Old Sea Baths lido, the Arcades with the porch slappy and Saltwater Skates, the Gardens (bandstand,
   palms, planter run), the Promenade Terrace and Gull Steps, the Anchor Gap monument, the middle boardwalk (Slappy Strip, bollards,
   lamps, benches, quay wall) and Long Pier with its T-head. The rest is filler along every line so nothing goes dead. */

function bw_gardens(K, P, PL) {
  const S = { used: [] };
  /* what is already standing: filler asks before it puts anything down */
  S.take = (x0, z0, x1, z1) => { S.used.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]); };
  S.free = (x0, z0, x1, z1, m = 0.5) => !S.used.some(r => x0 < r[2] + m && x1 > r[0] - m && z0 < r[3] + m && z1 > r[1] - m)
    && !K.posts.some(([px, pz]) => px > x0 - 0.9 && px < x1 + 0.9 && pz > z0 - 0.9 && pz < z1 + 0.9);
  S.take(-672, 1014, -212, 1026);                     // the road
  bw_gardens_road(K, P, PL, S);
  bw_gardens_baths(K, P, PL, S);
  bw_gardens_arcades(K, P, PL, S);
  bw_gardens_lawn(K, P, PL, S);
  bw_gardens_terrace(K, P, PL, S);
  bw_gardens_anchor(K, P, PL, S);
  bw_gardens_front(K, P, PL, S);
  bw_gardens_pier(K, P, PL, S);
  bw_gardens_fill(K, P, PL, S);
}

/* ---------- Harbour Road, x -672..-212, the zebra at -510 ---------- */
function bw_gardens_road(K, P, PL, S) {
  const { YN } = PL;
  bw_index_street(K, 'x', 1020, -672, -212, YN, [-510], { rw: 6, sw: 4 });
  K.zebra(-510, 1020, 'z', 8);
  // parked cars in the kerb lanes, clear of the two traffic lanes
  for (const [x, z] of [[-640, 1015.2], [-455, 1024.8], [-395, 1015.2], [-285, 1024.8]]) K.car(x, z, true);
}

/* ---------- Old Sea Baths: the lido, the diving tower, the bath-house wings, the bleachers ---------- */
function bw_gardens_baths(K, P, PL, S) {
  const { YN } = PL, X0 = -646, X1 = -598, Z0 = 1054, Z1 = 1074;
  // the pool: 1.2 m at the shallow (west) end to 3.2 m at the deep (east) end, walls curved like a pool's
  K.feat(-648, -596, 1048, 1080, (x, z) => {
    const e = Math.min(x - X0, X1 - x, z - Z0, Z1 - z);
    if (e <= 0) return YN;
    const D = 1.2 + 2.0 * clamp((x - X0) / (X1 - X0), 0, 1);
    return YN + poolDepth(e, D);
  }, 'min');
  const cope = (ax, az, bx, bz) => K.rails.push({ a: V(ax, YN, az), b: V(bx, YN, bz), kind: 'Coping', coping: true });
  cope(X0, Z0, X1, Z0); cope(X0, Z1, X1, Z1); cope(X0, Z0, X0, Z1); cope(X1, Z0, X1, Z1);   // one coping line a side
  S.take(-650, 1052, -595, 1077);
  // the bath-house wings with the gate gap between them and the name over it
  K.building(-664, 1036, -636, 1046, 1, 0xe8e4da, 'stone');
  K.building(-608, 1036, -580, 1046, 1, 0xe8e4da, 'stone');
  S.take(-664, 1036, -636, 1046); S.take(-608, 1036, -580, 1046);
  K.prop(-636, YN + 3.3, 1036, -608, YN + 4.9, 1037.2, 0xd8d2c4);
  K.prop(-637, YN, 1036, -636, YN + 3.3, 1037.2, 0xd8d2c4); K.prop(-608, YN, 1036, -607, YN + 3.3, 1037.2, 0xd8d2c4);
  K.decorFns.push(D => D.sign('OLD SEA BATHS', -622, YN + 4.2, 1035.9, 14, 1.2, Math.PI, '#f0ece2', '#2a5f86'));
  // the diving tower on the east side of the deep end: a board over the water, ten stairs up the east face
  K.B(-594, YN - 0.5, 1060, -590, YN + 3.0, 1068, 'garage', { edges: 'nswe' });
  K.B(-602, YN + 2.7, 1063, -594, YN + 3.0, 1065, 'wood', { edges: 'nswe' });
  K.stairSpot('x', -590, 1, 1061.5, 1065.5, YN + 3.0, YN, 10, 0.4, { rails: [1061.05, 1065.95] });
  S.take(-603, 1059, -585, 1069);
  // bleachers along the south deck
  [[1078, 1080.6, 0.45], [1080.6, 1083.2, 0.9], [1083.2, 1085.8, 1.35]].forEach(([za, zb, h]) => K.B(-642, YN - 0.5, za, -606, YN + h, zb, 'wood', { edges: 'ns' }));
  S.take(-642, 1078, -606, 1086);
  // deck furniture
  K.bench(-640, 1050.6, -634, 1051.4); K.bench(-612, 1050.6, -606, 1051.4);
  S.take(-640, 1050.6, -634, 1051.4); S.take(-612, 1050.6, -606, 1051.4);
  K.planter(-596, 1049, -592, 1053, 0.5); S.take(-596, 1049, -592, 1053);
  P.spot('Old Sea Baths', -622, YN, 1050, Math.PI, [-648, 1046, -596, 1080]);
  P.spot('Diving Tower', -588, YN, 1064, Math.PI / 2, [-604, 1058, -584, 1070]);
}

/* ---------- the Arcades, the 140 m porch slappy, Saltwater Skates ---------- */
function bw_gardens_arcades(K, P, PL, S) {
  const { YN } = PL, Y = YN + 0.30;
  const fr = [[-572, -546, 0x9fd8c4], [-546, -522, 0xf2a488], [-522, -498, 0xf3d98a], [-498, -466, 0x9cc7e6], [-466, -432, 0xc8b4dc]];
  for (const [a, b, c] of fr) K.building(a, 1034, b, 1060, 2, c, 'stone');
  S.take(-572, 1030, -432, 1060);
  // the porch: 0.30 m of wood, 140 m long, north edge grinds; chamfers at both ends
  K.B(-572, YN - 0.5, 1030, -432, Y, 1034, 'wood', { edges: 'n' });
  K.hubbas.push({ a: V(-572, Y, 1032), b: V(-575, YN + 0.01, 1032), w: 3.5, noRails: true, color: 0xb9b5ab });
  K.hubbas.push({ a: V(-432, Y, 1032), b: V(-429, YN + 0.01, 1032), w: 3.5, noRails: true, color: 0xb9b5ab });
  // awnings over the other four fronts (the shop's is its own)
  for (const [a, b, c] of fr) if (a !== -522) K.prop(a + 1, YN + 2.5, 1031.4, b - 1, YN + 2.7, 1034, c === 0xf2a488 ? 0xb8483a : 0x3a6a8a);
  K.decorFns.push(D => { for (const [a, b, c] of fr) D.paint(a + 2, 1034.01, b - 2, 1034.02, YN + 2.0, c); });
  P.shop({ name: 'Saltwater Skates', sign: [-510, YN + 0.3 + 3.85, 1033.96, Math.PI, 7], awning: [-516, 1032.4, -504, 1034, YN + 0.3 + 2.2],
    zone: [-514, 1030.8, -506, 1033.8], door: [-510, YN + 0.3, 1033.8] });
  P.travel('Saltwater Skates', -510, YN + 0.15, 1028, Math.PI, 'spot');
  P.spot('Arcade Porch', -502, Y, 1032, Math.PI / 2, [-572, 1028, -432, 1036]);
  P.spot('Saltwater Skates', -510, Y, 1030.4, Math.PI, [-522, 1026, -498, 1036]);
}

/* ---------- the Gardens: lawn, bandstand, palms, the planter run down the ramp ---------- */
function bw_gardens_lawn(K, P, PL, S) {
  const { YN } = PL;
  // bandstand: 1.7 m, four stairs north and south, a roof you can see but not hit
  K.B(-507, YN - 0.5, 1075, -497, YN + 1.7, 1085, 'wood', { edges: 'nswe' });
  K.stairSpot('z', 1075, -1, -504.5, -499.5, YN + 1.7, YN, 4, 0.55);
  K.stairSpot('z', 1085, 1, -504.5, -499.5, YN + 1.7, YN, 4, 0.55);
  for (const [x, z] of [[-506.6, 1075.4], [-497.4, 1075.4], [-506.6, 1084.6], [-497.4, 1084.6]]) K.prop(x - 0.12, YN + 1.7, z - 0.12, x + 0.12, YN + 4.3, z + 0.12, 0xe8e4da);
  K.prop(-508.4, YN + 4.3, 1073.6, -495.6, YN + 4.7, 1086.4, 0xc8432f);
  S.take(-509, 1071, -495, 1089);
  P.spot('Bandstand', -502, YN + 1.7, 1080, Math.PI / 2, [-509, 1071, -495, 1089]);
  // the planter run: four staggered 0.45 m planters down the ramp
  [[-470, 1100], [-464, 1106], [-458, 1112], [-452, 1118]].forEach(([x, z]) => { K.planter(x, z, x + 7, z + 1.4, 0.45); S.take(x, z, x + 7, z + 1.4); });
  P.spot('Planter Run', -456, YN - 0.3, 1108, Math.PI, [-474, 1096, -440, 1124]);
  // palms and trees on the lawns and the garden north of the terrace
  const palm = (x, z) => K.decorFns.push(D => D.palm(x, z, K.terrainH(x, z)));
  for (const [x, z] of [[-566, 1068], [-566, 1090], [-540, 1072], [-540, 1088], [-520, 1068], [-482, 1068], [-482, 1090], [-440, 1090]]) { K.tree(x, z); S.take(x - 1, z - 1, x + 1, z + 1); }
  for (const [x, z] of [[-404, 1044], [-384, 1052], [-362, 1044], [-340, 1052], [-318, 1044], [-296, 1052], [-274, 1044], [-262, 1056]]) { K.tree(x, z); S.take(x - 1, z - 1, x + 1, z + 1); }
  for (const [x, z] of [[-410, 1056], [-394, 1046], [-372, 1056], [-350, 1046], [-328, 1056], [-306, 1046], [-284, 1056], [-244, 1050]]) palm(x, z);
  // lawn benches and a few low garden walls
  for (const x of [-560, -530, -490]) { K.bench(x - 1.5, 1066, x + 1.5, 1066.8); S.take(x - 1.5, 1066, x + 1.5, 1066.8); }
}

/* ---------- Promenade Terrace (T2) with its bank hubbas, ledges and Gull Steps ---------- */
function bw_gardens_terrace(K, P, PL, S) {
  const { YN, T2 } = PL, CO = 0xc4bfb3;
  K.B(-420, -42.2, 1062, -252, T2, 1100, 'marble', { edges: 'nswe' });
  S.take(-420, 1062, -252, 1100);
  // banks off the north face, ramps up at the two ends
  for (const [x, w] of [[-392, 24], [-300, 24]]) K.hubbas.push({ a: V(x, T2, 1062), b: V(x, YN + 0.02, 1056), w, noRails: true, color: CO });
  K.hubbas.push({ a: V(-420, T2, 1086), b: V(-427, YN + 0.02, 1086), w: 10, noRails: true, color: CO });
  K.hubbas.push({ a: V(-252, T2, 1084), b: V(-245, YN + 0.02, 1084), w: 10, noRails: true, color: CO });
  S.take(-428, 1081, -420, 1091); S.take(-252, 1079, -244, 1089);
  // on the deck: ledges, a flatbar, planters, a manual pad, a kicker to a ledge, benches
  K.B(-418, T2, 1068.6, -406, T2 + 0.45, 1069.4, 'marble', { edges: 'ns' });
  K.B(-372, T2, 1081, -342, T2 + 0.4, 1081.8, 'marble', { edges: 'ns' });
  K.rail(-334, T2 + 0.40, 1074, -314, T2 + 0.40, 1074, 'Rail', true);
  K.B(-290, T2, 1068, -285, T2 + 0.55, 1073, 'ledge', { edges: 'nswe' });
  K.B(-278, T2, 1068, -273, T2 + 0.55, 1073, 'ledge', { edges: 'nswe' });
  K.B(-402, T2, 1088, -388, T2 + 0.2, 1092, 'pad', { edges: 'nswe' });
  K.hubbas.push({ a: V(-374.4, T2 + 0.4, 1090), b: V(-377, T2 + 0.02, 1090), w: 1.3, noRails: true, color: 0xc49a5c });
  K.B(-372, T2, 1089, -366, T2 + 0.5, 1091, 'marble', { edges: 'nswe' });
  for (const x of [-352, -312]) K.B(x - 1.5, T2, 1090, x + 1.5, T2 + 0.45, 1090.8, 'wood', { edges: 'ns' });
  // Gull Steps: four risers down to the boardwalk ramp, three rails
  K.stairSpot('z', 1100, 1, -366, -306, T2, -40.84, 4, 0.8, { rails: [-351, -336, -321] });
  P.spot('Promenade Terrace', -340, T2, 1076, Math.PI, [-420, 1056, -252, 1100]);
  P.spot('Gull Steps', -336, T2, 1098, Math.PI, [-366, 1094, -306, 1106]);
}

/* ---------- Anchor Gap: ramp, deck, gap over the plinth, landing bank ---------- */
function bw_gardens_anchor(K, P, PL, S) {
  const { YN } = PL;
  K.hubbas.push({ a: V(-226, -37.90, 1053.4), b: V(-226, -40.58, 1037.4), w: 5.2, noRails: true, color: 0xb9b5ab });
  for (const sx of [-1, 1]) K.rail(-226 + sx * 2.72, -37.90 + 0.9, 1053.4, -226 + sx * 2.72, -40.58 + 0.9, 1037.4, 'Handrail', true);
  K.B(-228.6, -39.6, 1053.4, -223.4, -37.90, 1069.4, 'plaza', { edges: 'nswe' });
  K.B(-227.5, -41.5, 1070.85, -224.5, -40.20, 1073.15, 'marble', { edges: 'nswe' });
  K.B(-226.3, -40.20, 1071.15, -225.7, -38.20, 1072.85, 'metal', { ghost: true });         // the statue: solid, drawn below
  K.hubbas.push({ a: V(-226, -38.40, 1073.35), b: V(-226, -40.58, 1083.35), w: 6.2, noRails: true, color: 0xb9b5ab });
  S.take(-229.5, 1036, -222.5, 1084.5);
  K.decorFns.push(D => {
    const g = k => new THREE.BoxGeometry(k[0], k[1], k[2]), brass = 0x9a7b3c;
    D.add(g([0.26, 1.9, 0.26]), brass, [-226, -39.25, 1072], [0, 0, 0]);                    // shaft
    D.add(g([1.1, 0.16, 0.16]), brass, [-226, -38.45, 1072], [0, 0, 0]);                    // stock
    D.add(g([0.26, 0.2, 1.7]), brass, [-226, -40.05, 1072], [0, 0, 0]);                     // crown
    D.add(g([0.24, 0.2, 0.75]), brass, [-226, -39.8, 1072.7], [0.7, 0, 0]);                 // flukes
    D.add(g([0.24, 0.2, 0.75]), brass, [-226, -39.8, 1071.3], [-0.7, 0, 0]);
    D.sign('THE ANCHOR', -226, -39.1, 1069.44, 4, 0.7, 0, '#e8d9a8', '#2a2f36');
  });
  P.spot('Anchor Gap', -226, YN, 1033, Math.PI, [-232, 1030, -220, 1086]);
}

/* ---------- the middle boardwalk: Slappy curbs, bollards, lamps, benches, planters, the quay wall ---------- */
function bw_gardens_front(K, P, PL, S) {
  const { YS } = PL;
  // Slappy Strip: 28 m low wooden curbs, 2.4 m apart
  for (let i = 0; i < 15; i++) { const x0 = -670 + i * 30.4; K.B(x0, YS - 0.5, 1162.4, x0 + 28, YS + 0.28, 1163, 'wood', { edges: 'ns' }); S.take(x0, 1162.4, x0 + 28, 1163); }
  // lamps every 24 m on the promenade edge, then benches (facing the sea) and planters in between
  for (let i = 0; i < 19; i++) K.lamp(-660 + i * 24, 1141, 1);
  for (let i = 0; i < 15; i++) {
    const x = -655 + i * 30;
    if (S.free(x - 1.6, 1139.8, x + 1.6, 1141.2)) { K.B(x - 1.6, YS - 0.4, 1139.9, x + 1.6, YS + 0.45, 1140.9, 'wood', { edges: 'ns' }); S.take(x - 1.6, 1139.9, x + 1.6, 1140.9); }
    const px = x + 15;
    if (px < -222 && S.free(px - 1.6, 1142.6, px + 1.6, 1144.2)) { K.B(px - 1.6, YS - 0.4, 1142.6, px + 1.6, YS + 0.5, 1144.2, 'ledge', { edges: 'nswe' }); S.take(px - 1.6, 1142.6, px + 1.6, 1144.2); }
  }
  // the seam with the west part (x -672): a ledge at the boardwalk edge, clear of the outlet's x -700 lane; a garden wall by the Gardens Path
  K.ledge(-671, 1146, -665, 1146.6, 0.45); S.take(-671, 1146, -665, 1146.6);
  K.ledge(-578.6, 1056, -578, 1070, 0.45); S.take(-578.6, 1056, -578, 1070);
  // the sea wall: coping on the quay edge (gap at the Long Pier mouth), a bollard every 12 m
  for (const [a, b] of [[-672, -344], [-328, -212]]) { K.B(a, -47, 1176, b, YS + 0.1, 1180, 'plaza', { edges: 's' }); S.take(a, 1176, b, 1180); }
  for (let x = -666; x < -214; x += 24) if (Math.abs(x + 336) > 9) K.B(x - 0.25, YS + 0.1, 1176.75, x + 0.25, YS + 0.75, 1177.25, 'metal');
  // spots along the strip
  for (const x of [-640, -520, -410, -280]) P.spot('Boardwalk Bench ' + Math.abs(x), x, YS, 1146, Math.PI, [x - 20, 1138, x + 20, 1166]);
  P.spot('Slappy Strip Middle', -450, YS, 1156, Math.PI / 2, [-570, 1160, -330, 1166]);
  P.spot('Boardwalk Point', -230, YS, 1146, Math.PI, [-250, 1138, -212, 1166]);
}

/* ---------- Long Pier: handrails both sides, the T-head, the bait shack; a few boats ---------- */
function bw_gardens_pier(K, P, PL, S) {
  const { YS } = PL, Y = YS + 0.02;
  K.B(-342, YS - 0.9, 1176, -330, Y, 1274, 'wood');
  K.B(-358, YS - 0.9, 1274, -308, Y, 1290, 'wood');
  for (const x of [-341.7, -330.3]) K.rail(x, YS + 1.0, 1182, x, YS + 1.0, 1274, 'Handrail', true);   // one 92 m rail a side
  K.rail(-358, YS + 1.0, 1289.6, -324, YS + 1.0, 1289.6, 'Handrail', true);
  K.rail(-357.6, YS + 1.0, 1275, -357.6, YS + 1.0, 1289.6, 'Handrail', true);
  K.B(-322, YS, 1280, -312, YS + 3.4, 1290, 'building', { color: 0xd4a017, tex: 'wood' });
  for (const x of [-352, -346, -340]) K.bench(x - 1.3, 1283, x + 1.3, 1283.8);
  for (const z of [1202, 1232, 1262]) K.lamp(-340.4, z, 1);
  // pilings you can see under the deck
  K.decorFns.push(D => { for (const z of [1180, 1196, 1212, 1228, 1244, 1260, 1272]) for (const x of [-341.4, -330.6]) D.prop(x - 0.25, -47, z - 0.25, x + 0.25, YS - 0.9, z + 0.25, 0x4a3c2e);
    for (const z of [1278, 1288]) for (const x of [-356, -336, -316]) D.prop(x - 0.25, -47, z - 0.25, x + 0.25, YS - 0.9, z + 0.25, 0x4a3c2e); });
  // boats moored off the boardwalk
  for (const [x, z, c, cab] of [[-640, 1192, 0xdedad2, 0xb23a32], [-560, 1200, 0x2f5d8a, 0xe8e4da], [-470, 1190, 0xb23a32, 0xdedad2], [-262, 1196, 0x3f6b46, 0xe8e4da]]) {
    K.prop(x - 5, -46.3, z, x + 5, -45.0, z + 3.2, c); K.prop(x - 1.5, -45.0, z + 0.5, x + 2, -43.9, z + 2.7, cab); }
  P.spot('Long Pier', -336, YS, 1170, Math.PI, [-345, 1166, -327, 1200]);
  P.spot('Pier Head', -336, YS, 1264, Math.PI, [-358, 1250, -308, 1290]);
}

/* ---------- filler: small skateable things along Harbour Road and the paths so no stretch goes dead ---------- */
function bw_gardens_fill(K, P, PL, S) {
  const { YN, YS } = PL;
  // Harbour Road sidewalks: planter, bench, bike rack, ledge, pad in turn, north and south, about every 21 m
  const walk = (x0, z0, x1, z1, h, mat) => { if (!S.free(x0, z0, x1, z1)) return; K.B(x0, YN, z0, x1, YN + 0.15 + h, z1, mat, { edges: 'nswe' }); S.take(x0, z0, x1, z1); };
  let k = 0;
  for (let x = -660; x < -216; x += 21, k++) {
    if (x > -576 && x < -428) continue;                                 // the porch covers this
    if (x > -526 && x < -496) continue;                                 // the crossing mouth
    const z = k % 2 ? 1028 : 1012, t = k % 5;
    if (t === 0) walk(x - 1.5, z - 0.8, x + 1.5, z + 0.8, 0.5, 'ledge');
    else if (t === 1) walk(x - 1.6, z - 0.4, x + 1.6, z + 0.4, 0.3, 'wood');
    else if (t === 2) { if (S.free(x - 1.2, z - 0.3, x + 1.2, z + 0.3)) { K.bikeRack(x, z, true, 2.4); S.take(x - 1.2, z - 0.3, x + 1.2, z + 0.3); } }
    else if (t === 3) walk(x - 3.2, z - 0.3, x + 3.2, z + 0.3, 0.25, 'ledge');
    else walk(x - 3, z - 1, x + 3, z + 1, 0.18, 'pad');
  }
  // pull-off pockets on the road: a bank and a ledge each, and a named spot
  for (const [x, nm] of [[-420, 'Harbour Pocket West'], [-318, 'Harbour Pocket East']]) {
    K.hubbas.push({ a: V(x, YN + 0.55, 1034), b: V(x, YN + 0.02, 1030.6), w: 6, noRails: true, color: 0xc4bfb3 });
    K.B(x - 3, YN - 0.3, 1034, x + 3, YN + 0.55, 1034.8, 'marble', { edges: 'ns' }); S.take(x - 3.5, 1030, x + 3.5, 1035);
    K.bench(x + 6, 1032, x + 9, 1032.8); S.take(x + 6, 1032, x + 9, 1032.8);
    P.spot(nm, x, YN, 1031.5, Math.PI, [x - 12, 1026, x + 12, 1038]);
  }
  P.spot('Harbour Gate West', -652, YN, 1030, Math.PI, [-672, 1026, -632, 1040]);
  // the bath-house forecourt and the Gardens Path (x -600 down to the ramp, then east along z 1096..1100)
  const lw = (x0, z0, x1, z1, h, mat = 'ledge') => { if (!S.free(x0, z0, x1, z1)) return; K.B(x0, YN - 0.4, z0, x1, YN + h, z1, mat, { edges: Math.abs(x1 - x0) > Math.abs(z1 - z0) ? 'ns' : 'ew' }); S.take(x0, z0, x1, z1); };
  lw(-618, 1031, -604, 1031.7, 0.45); lw(-616, 1048.4, -604, 1049, 0.4); lw(-600.6, 1038, -599.8, 1050, 0.4);
  for (let x = -592; x < -444; x += 24) lw(x, 1092, x + 6, 1092.7, 0.45);
  for (const x of [-425, -405, -385, -300, -280, -262, -240]) lw(x, 1103, x + 5, 1103.7, 0.4);
  // the ramp and the foot of the steps, down to the boardwalk
  lw(-362, 1112, -346, 1112.7, 0.45); lw(-326, 1120, -314, 1120.7, 0.45);
  K.hubbas.push({ a: V(-340, K.terrainH(-340, 1127) + 0.45, 1127), b: V(-340, K.terrainH(-340, 1124) + 0.02, 1124), w: 4, noRails: true, color: 0xc4bfb3 });
  // the park-side row west of the lido
  lw(-664, 1056, -664 + 0.8, 1070, 0.45); lw(-664, 1086, -663.2, 1100, 0.45); lw(-664, 1112, -663.2, 1126, 0.45);
  // roadside near the Anchor and the terrace foot
  lw(-250, 1046, -236, 1046.7, 0.45); lw(-246, 1096, -236, 1096.7, 0.45); lw(-420, 1105, -410, 1105.7, 0.45);
}

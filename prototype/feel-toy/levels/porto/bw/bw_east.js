/* Boardwalk West, the east part: x -212..0, z 910..1350. Design: levels/porto/design/bw.md 10.5 (with 3.2, 4 rows 27-30, 25, 31, 7).
   Steep Street and the Steep Foot, Quay Road east, Ice House Lane, Harbour Road east, the Ice House with its loading dock, the car park,
   the Ferry Terminal on its podium (Terminal Eight, the Terminal Bank, the east ramp, queue ledges), Wheel Pier with the Sea Wheel,
   Ferry Pier, the east boardwalk with the Slappy Strip and the quay wall. Small filler goes along every street and pier so no stretch
   goes dead (CONTRACT 7). Nothing above 0.3 m in the band (x > -12) or in the Steep corridor (x -208..-192, z 894..944). */

function bw_east(K, P, PL) {
  const S = { used: [] };
  /* what is already standing: filler asks before it puts anything down */
  S.take = (x0, z0, x1, z1) => { S.used.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]); };
  S.free = (x0, z0, x1, z1, m = 0.5) => !S.used.some(r => x0 < r[2] + m && x1 > r[0] - m && z0 < r[3] + m && z1 > r[1] - m)
    && !K.posts.some(([px, pz]) => px > x0 - 0.9 && px < x1 + 0.9 && pz > z0 - 0.9 && pz < z1 + 0.9);
  /* a box on the ground (h over it), if the place is free */
  S.led = (x0, z0, x1, z1, h, mat, edges) => {
    if (!S.free(x0, z0, x1, z1)) return false;
    K.Bg(x0, z0, x1, z1, h, mat || 'ledge', { edges: edges || (Math.abs(x1 - x0) > Math.abs(z1 - z0) ? 'ns' : 'ew') });
    S.take(x0, z0, x1, z1); return true;
  };
  /* a bank (sloped block) rising towards +/- z or x, if free */
  S.bank = (x, z, dx, dz, len, h, w) => {
    const ex = x + dx * len, ez = z + dz * len, x0 = Math.min(x, ex) - (dz ? w / 2 : 0), x1 = Math.max(x, ex) + (dz ? w / 2 : 0);
    const z0 = Math.min(z, ez) - (dx ? w / 2 : 0), z1 = Math.max(z, ez) + (dx ? w / 2 : 0);
    if (!S.free(x0, z0, x1, z1)) return false;
    K.hubbas.push({ a: V(ex, K.terrainH(ex, ez) + h, ez), b: V(x, K.terrainH(x, z) + 0.02, z), w, noRails: true, color: 0xc4bfb3 });
    S.take(x0, z0, x1, z1); return true;
  };
  S.take(-209, 910, -191, 1130);                     // Steep Street and its corridor (the sidewalks stay free where they are wide enough)
  S.take(-212, 925, -12, 935);                       // Quay Road
  S.take(-212, 1010, -12, 1030);                     // Harbour Road with its sidewalks
  S.take(-44, 930, -36, 1142);                       // Ice House Lane
  S.take(-18, 1140, 0, 1160);                        // the boardwalk gate
  bw_east_streets(K, P, PL, S);
  bw_east_icehouse(K, P, PL, S);
  bw_east_carpark(K, P, PL, S);
  bw_east_terminal(K, P, PL, S);
  bw_east_front(K, P, PL, S);
  bw_east_piers(K, P, PL, S);
  bw_east_wheel(K, P, PL, S);
  bw_east_fill(K, P, PL, S);
}

/* ---------- the streets: Steep Street + Steep Foot, Quay Road east, Harbour Road east, Ice House Lane ---------- */
function bw_east_streets(K, P, PL, S) {
  const { YN, YS } = PL;
  // Steep Street: the 952 crossing opens a curb-free mouth (z 944..960) into the Eel Run head. It starts at 943.9 so the first cut falls inside the street.
  bw_index_street(K, 'z', -200, 943.9, 1096, YN, [952, 1020], { rw: 5, sw: 3 });
  // z 1096..1128: the road follows the 3.75 % ramp (the ground colour is the asphalt); sloped Curb hubba sidewalks either side
  K.strip(-206.5, 1096, -206.5, 1128, 0.15, 3, { kind: 'Curb', color: 0xb9b5ab, seg: 4 });
  K.strip(-193.5, 1096, -193.5, 1128, 0.15, 3, { kind: 'Curb', color: 0xb9b5ab, seg: 4 });
  K.lamp(-209, 1104, 1); K.lamp(-191, 1120, -1);
  // Harbour Road east (it stops at x -12: the gate band beyond is P.col only), Ice House Lane
  // (the stretch x -134..-106 in front of the Terminal Bank has no sidewalk on the south side: a kerbless mouth, so the bank is open and no lamp stands in front of it)
  bw_index_street(K, 'x', 1020, -212, -134, YN, [-200], { rw: 6, sw: 4 });
  bw_index_street(K, 'x', 1020, -134, -106, YN, [], { rw: 6, sw: 4, noCurb: true });
  bw_index_street(K, 'x', 1020, -106, -12, YN, [-40], { rw: 6, sw: 4 });
  K.B(-134, YN - 0.6, 1010, -106, YN + 0.15, 1014, 'sidewalk', { edges: 's' });
  bw_index_street(K, 'z', -40, 944, 1096, YN, [1020], { rw: 4, sw: 3 });
  // Quay Road is kerbless (the ground slopes 1.4 %): a broken centre line only
  for (let x = -186; x < -30; x += 8) if (x > -92 || x < -98) K.dash(x, 930, x + 3, 930);
  for (let z = 934; z < 944; z += 6) K.dash(-40, z, -40, z + 3);
  // the Steep Foot: where the street meets the boardwalk (flat at YS from z 1128)
  S.led(-196, 1131.5, -190, 1136.5, 0.18, 'pad', 'nswe');                        // a manual pad
  S.led(-211, 1131, -207, 1138, 0.5, 'ledge', 'nswe'); S.led(-193.5, 1139, -187, 1141, 0.45, 'ledge', 'ns');
  S.led(-211, 1139.5, -204, 1141, 0.4, 'marble', 'ns');
  S.take(-206, 1128, -194, 1142);
  K.bench(-188, 1131.5, -184.6, 1132.3);
  K.dash(-200, 1100, -200, 1103); K.dash(-200, 1108, -200, 1111); K.dash(-200, 1116, -200, 1119); K.dash(-200, 1124, -200, 1127);
  P.spot('Steep Mouth', -200, YN, 948, Math.PI, [-210, 944, -190, 962]);
  P.spot('Steep Foot', -200, YS, 1134, Math.PI, [-212, 1126, -186, 1142]);
}

/* ---------- the Ice House, its loading dock and yard ---------- */
function bw_east_icehouse(K, P, PL, S) {
  const { YN } = PL, TOP = YN + 1.2;
  K.building(-186, 948, -120, 990, 3, 0xb9a88f, 'brick'); S.take(-186, 948, -120, 990);
  // the dock along the south face: 1.2 m, grindable south edge, a ramp off the west end and four stairs with a handrail off the east
  K.B(-184, YN - 0.5, 990, -122, TOP, 994, 'plaza', { edges: 's' });
  K.hubbas.push({ a: V(-184, TOP, 992.2), b: V(-189.5, K.terrainH(-189.5, 992.2) + 0.02, 992.2), w: 3, noRails: true, color: 0xb9b5ab });
  K.rail(-184.2, TOP + 0.9, 994.15, -189.5, YN + 0.9, 994.15, 'Handrail', true);
  K.stairSpot('x', -122, 1, 990.8, 993.6, TOP, YN, 4, 0.4, { rails: [994.1] });
  S.take(-190, 989.5, -118, 994.5);
  K.decorFns.push(D => D.sign('ICE HOUSE', -153, YN + 9.0, 990.1, 14, 1.8, 0, '#e9eef2', '#1f3d5c'));
  // roll-up doors, a dock bumper strip and dressing (drawn only)
  for (const x of [-170, -150, -130]) K.prop(x - 3, TOP, 989.8, x + 3, TOP + 2.6, 990.05, 0x8a8f96);
  // the yard (z 994..1010): pallets, a dumpster pair, a curb ledge, a bank off the dock apron
  const pal = (x, z) => { if (S.free(x - 1.1, z - 0.9, x + 1.1, z + 0.9)) { K.Bg(x - 1.1, z - 0.9, x + 1.1, z + 0.9, 0.35, 'wood', { edges: 'nswe' }); S.take(x - 1.1, z - 0.9, x + 1.1, z + 0.9); } };
  pal(-176, 1000); pal(-172.6, 1000); pal(-141, 1003); pal(-137.6, 1003); pal(-141, 1006.4);
  if (S.free(-160, 999, -158, 1001)) { K.dumpster(-159, 1000, true); S.take(-161, 998.5, -157, 1001.5); }
  if (S.free(-150, 1001, -148, 1003)) { K.dumpster(-149, 1002, true); S.take(-151, 1000.5, -147, 1003.5); }
  S.led(-168, 1006.5, -148, 1007.2, 0.3, 'ledge', 'ns');
  S.bank(-132, 1004, 0, -1, 4.5, 0.5, 8);
  K.bikeRack(-128, 998, true, 2.4); S.take(-129.5, 997.6, -126.5, 998.4);
  P.spot('Ice House Dock', -152, TOP, 998, Math.PI, [-188, 988, -118, 1010]);
  P.spot('Steep Plaza', -184, YN, 1018, Math.PI / 2, [-192, 1000, -172, 1040]);
  // the little square east of Steep Street, between the dock yard and the Terminal: planters, benches and a bank
  S.led(-190, 1000, -186, 1002.2, 0.5, 'ledge', 'nswe'); S.led(-190, 1008, -184, 1008.8, 0.4, 'marble', 'ns');
  S.bank(-189, 1036, 0, -1, 5, 0.5, 6);
  S.led(-190, 1032, -184, 1032.8, 0.45, 'ledge', 'ns');
  K.bench(-190, 1040, -186.6, 1040.8);
  K.lamp(-174, 1006, 1); K.tree(-190.5, 1044);
}

/* ---------- the car park (x -112..-50, z 948..1006): six rows of parking blocks, cars, islands ---------- */
function bw_east_carpark(K, P, PL, S) {
  const { YN } = PL;
  S.take(-113, 947, -49, 1007);
  const rows = [952, 972, 992];
  rows.forEach((z0, r) => {
    for (let i = 0; i < 11; i++) {
      const x = -108 + i * 5.2;
      if (i % 2 === 0) { K.parkingBlock(x, z0, true); K.parkingBlock(x, z0 + 5.2, true); }
      if ((i * 3 + r * 5) % 7 < 4) K.car(x, z0 + 2.6, false);
    }
  });
  // islands in the aisles: low planters with a tree, and a bench
  for (const [x, z] of [[-100, 966], [-80, 966], [-60, 966], [-100, 986], [-80, 986], [-60, 986]]) {
    K.planter(x - 3, z - 1, x + 3, z + 1, 0.5); K.tree(x, z);
  }
  K.bench(-90, 1000.6, -86.6, 1001.4); K.bench(-76, 1000.6, -72.6, 1001.4);
  for (const [x, z] of [[-110, 949], [-52, 949], [-110, 1004], [-52, 1004]]) K.lamp(x, z, x < -80 ? 1 : -1);
  K.trashCan(-111, 978); K.trashCan(-51, 978);
  K.paintRect(-112, 948, -50, 1006, 0x61636a, YN + 0.004);
  P.spot('Car Park', -80, YN, 960, Math.PI, [-112, 948, -50, 1006]);
}

/* ---------- the Ferry Terminal on its podium ---------- */
function bw_east_terminal(K, P, PL, S) {
  const { YN, T3 } = PL;
  // podium x -170..-56, z 1040..1090, top T3 (2.4 m over the street): its north and south edges grind
  K.B(-170, -41.4, 1040, -56, T3, 1090, 'marble', { edges: 'ns' });
  S.take(-171, 1039, -55, 1091);
  // Terminal Eight: 8 x 0.4 m (2.4 m) down the west face at z 1052..1068, two rails, two hubbas; the building starts at z 1064 so the travel point (-112, 1060) is clear
  K.stairSpot('x', -170, -1, 1052, 1068, T3, YN, 8, 0.4, { rails: [1056, 1064], hubbas: [1051.5, 1068.5] });
  K.lip(-170, 1040, -170, 1051.2, T3); K.lip(-170, 1068.8, -170, 1090, T3);
  S.take(-181, 1048, -169, 1072);
  // Terminal Bank: 24 m wide, 2.4 m, up from Harbour Road to the podium
  K.hubbas.push({ a: V(-120, T3, 1040), b: V(-120, YN + 0.02, 1033), w: 24, noRails: true, color: 0xc4bfb3 });
  S.take(-133, 1032, -107, 1041);
  // the east ramp: 3 m wide down the east side of the podium (z 1042 -> 1068), a handrail on its east edge
  const rt = 1042, rb = 1068;
  K.hubbas.push({ a: V(-54, T3, rt), b: V(-54, K.terrainH(-54, rb) + 0.02, rb), w: 3, noRails: true, color: 0xc4bfb3 });
  K.rail(-52.3, T3 + 0.9, rt, -52.3, YN + 0.9, rb, 'Handrail', true);
  S.take(-56, 1041, -51, 1069);
  // the terminal building (stands on the podium, three floors; set back so the travel point is clear) and its name
  K.B(-150, T3, 1064, -96, T3 + 10.2, 1088, 'building', { color: 0xcfd2d6, tex: 'office' });
  S.take(-150, 1064, -96, 1088);
  K.decorFns.push(D => D.sign('FERRY TERMINAL', -123, T3 + 9.5, 1063.9, 16, 1.8, Math.PI, '#f2f4f6', '#1e4f78'));
  K.prop(-150, T3 + 3.2, 1062.6, -96, T3 + 3.5, 1064, 0x1e4f78);                           // a canopy over the doors
  // queue ledges on the podium: rope-line pieces with gaps between, a second row along the east
  const q = (x0, z0, x1, z1, h) => K.B(x0, T3, z0, x1, T3 + h, z1, 'marble', { edges: Math.abs(x1 - x0) > Math.abs(z1 - z0) ? 'ns' : 'ew' });
  for (const [a, b] of [[-146, -138], [-134, -126], [-122, -114], [-110, -102]]) q(a, 1055, b, 1056, 0.45);
  for (const [a, b] of [[-92, -86], [-82, -76], [-72, -66]]) q(a, 1050, b, 1050.8, 0.4);
  q(-92, 1068, -91.2, 1080, 0.45); q(-74, 1066, -73.2, 1078, 0.45);
  q(-146, 1046, -142, 1049, 0.5); q(-110, 1046, -106, 1049, 0.5);                        // planters
  K.decorFns.push(D => { for (const [x, z] of [[-144, 1047.5], [-108, 1047.5]]) D.tree(x, T3, z);
    for (const [x, z] of [[-166, 1043], [-60, 1043], [-166, 1086], [-60, 1086]]) D.lamp(x, T3, z, x < -110 ? 1 : -1); });
  K.B(-90, T3, 1042, -84, T3 + 0.45, 1043, 'wood', { edges: 'ns' });
  P.spot('Terminal Eight', -160, T3, 1060, -Math.PI / 2, [-176, 1040, -140, 1090]);
  P.spot('Terminal Bank', -120, YN, 1030, 0, [-134, 1030, -106, 1042]);
  P.spot('Terminal East Ramp', -54, T3, 1046, 0, [-58, 1040, -50, 1070]);
}

/* ---------- the east boardwalk: Slappy Strip, lamps, benches, bollards, quay wall ---------- */
function bw_east_front(K, P, PL, S) {
  const { YS } = PL;
  // Slappy Strip: 28 m low wooden curbs, 2.4 m apart, stopping at x -24
  for (let i = 0; i < 7; i++) { const x0 = -212 + i * 30.4, x1 = Math.min(x0 + 28, -24); if (x1 - x0 < 3) continue;
    K.B(x0, YS - 0.5, 1162.4, x1, YS + 0.28, 1163, 'wood', { edges: 'ns' }); S.take(x0, 1162.4, x1, 1163); }
  // lamps every 24 m on the promenade edge (not in the gate), benches facing the sea every 30 m, planters between
  for (let x = -196; x < -30; x += 24) K.lamp(x, 1141, 1);
  for (let i = 0; i < 6; i++) {
    const x = -190 + i * 30;
    if (S.free(x - 1.6, 1139.8, x + 1.6, 1141.2)) { K.B(x - 1.6, YS - 0.4, 1139.9, x + 1.6, YS + 0.45, 1140.9, 'wood', { edges: 'ns' }); S.take(x - 1.6, 1139.9, x + 1.6, 1140.9); }
    const px = x + 15;
    if (px < -34) S.led(px - 1.6, 1143, px + 1.6, 1144.6, 0.5, 'ledge', 'ns');
  }
  // the quay wall with coping, a gap at each pier mouth; a bollard every 12 m
  for (const [a, b] of [[-212, -152], [-104, -64], [-48, -0.5]]) { K.B(a, -47, 1176, b, YS + 0.1, 1180, 'plaza', { edges: 's' }); S.take(a, 1176, b, 1180); }
  for (let x = -206; x < -26; x += 24) if (!(x > -156 && x < -100) && !(x > -68 && x < -44)) K.B(x - 0.25, YS + 0.1, 1176.75, x + 0.25, YS + 0.75, 1177.25, 'metal');
  for (const x of [-170, -100, -40]) P.spot('Boardwalk East ' + Math.abs(x), x, YS, 1148, Math.PI, [x - 18, 1140, x + 18, 1166]);
  P.spot('Slappy Strip East', -110, YS, 1156, Math.PI / 2, [-150, 1160, -70, 1166]);
  P.spot('Boardwalk Gate', -34, YS, 1148, -Math.PI / 2, [-50, 1142, -24, 1166]);
  // boats off the boardwalk
  for (const [x, z, c, cab] of [[-190, 1194, 0xdedad2, 0xb23a32], [-84, 1200, 0x2f5d8a, 0xe8e4da], [-20, 1190, 0xb23a32, 0xdedad2]]) {
    K.prop(x - 5, -46.3, z, x + 5, -45.0, z + 3.2, c); K.prop(x - 1.5, -45.0, z + 0.5, x + 2, -43.9, z + 2.7, cab); }
}

/* ---------- Wheel Pier and Ferry Pier ---------- */
function bw_east_piers(K, P, PL, S) {
  const { YS } = PL, Y = YS;
  // Wheel Pier x -152..-104, z 1176..1262
  K.B(-152, YS - 0.8, 1176, -104, Y, 1262, 'wood'); S.take(-134, 1232, -122, 1248);
  // Ferry Pier x -64..-48, z 1176..1236, rails along both sides and a ticket kiosk
  K.B(-64, YS - 0.8, 1176, -48, Y, 1236, 'wood'); S.take(-62, 1226, -50, 1234);
  for (const x of [-63.5, -48.5]) K.rail(x, YS + 1.0, 1184, x, YS + 1.0, 1226, 'Handrail', true);
  K.B(-152, YS, 1261.2, -104, YS + 0.5, 1262, 'wood', { edges: 'ns' }); K.B(-64, YS, 1235.2, -48, YS + 0.5, 1236, 'wood', { edges: 'ns' });   // end curbs
  K.B(-62, YS, 1226, -50, YS + 3.0, 1234, 'building', { color: 0x3f6b8a, tex: 'wood' });
  for (const z of [1190, 1208]) { K.bench(-62.8, z, -62.0, z + 3); K.bench(-50.0, z + 6, -49.2, z + 9); }
  K.lamp(-63, 1200, 1); K.lamp(-49, 1218, -1);
  // pilings under both decks
  K.decorFns.push(D => { for (const z of [1180, 1196, 1212, 1228, 1244, 1258]) for (const x of [-150, -128, -106]) D.prop(x - 0.25, -47, z - 0.25, x + 0.25, YS - 0.8, z + 0.25, 0x4a3c2e);
    for (const z of [1180, 1200, 1220, 1234]) for (const x of [-62.5, -49.5]) D.prop(x - 0.25, -47, z - 0.25, x + 0.25, YS - 0.8, z + 0.25, 0x4a3c2e); });
  P.spot('Wheel Pier', -128, YS, 1184, Math.PI, [-152, 1176, -104, 1200]);
  P.spot('Ferry Pier', -56, YS, 1184, Math.PI, [-64, 1176, -48, 1200]);
  P.spot('Pier End', -56, YS, 1228, Math.PI, [-64, 1210, -48, 1236]);
  P.travel('Ferry Pier', -56, YS, 1182, Math.PI, 'spot');
}

/* ---------- the Sea Wheel: legs and boarding hut (solid), the wheel itself (drawn, 46 m) ---------- */
function bw_east_wheel(K, P, PL, S) {
  const { YS } = PL, cx = -128, cy = YS + 24, cz = 1240, R = 22;
  // the boarding hut: two blocks with a 5 m passage between them on the pier's centre line, a roof drawn over it
  K.B(-134, YS, 1232, -130.5, YS + 3.2, 1248, 'building', { color: 0xcfd2d6, tex: 'office' });
  K.B(-125.5, YS, 1232, -122, YS + 3.2, 1248, 'building', { color: 0xcfd2d6, tex: 'office' });
  K.prop(-130.5, YS + 3.0, 1232, -125.5, YS + 3.3, 1248, 0xc8432f);
  K.B(-136.6, YS, 1237.4, -135.4, YS + 24, 1238.6, 'metal'); K.B(-120.6, YS, 1241.4, -119.4, YS + 24, 1242.6, 'metal');
  K.decorFns.push(D => D.sign('SEA WHEEL', -128, YS + 3.5, 1231.9, 9, 1.4, Math.PI, '#fbf3d8', '#c8432f'));
  K.decorFns.push(D => {
    const box = new THREE.BoxGeometry(1, 1, 1), cyl = new THREE.CylinderGeometry(1, 1, 1, 12);
    const cols = [0xc8432f, 0x2f6b8a, 0xd4a017, 0x3f6b46];
    for (const dz of [-1.4, 1.4]) {
      for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2;
        D.add(box, 0xe8e4da, [cx + Math.cos(a) * R, cy + Math.sin(a) * R, cz + dz], [0, 0, a + Math.PI / 2], [5.9, 0.5, 0.6]); }
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2;
        D.add(box, 0xcfd2d6, [cx + Math.cos(a) * R / 2, cy + Math.sin(a) * R / 2, cz + dz], [0, 0, a], [R, 0.22, 0.22]); }
    }
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + 0.26, gx = cx + Math.cos(a) * R, gy = cy + Math.sin(a) * R;
      D.add(box, cols[i % 4], [gx, gy - 1.3, cz], [0, 0, 0], [2.2, 1.7, 2.4]);
      D.add(box, 0x8a8f96, [gx, gy - 0.4, cz], [0, 0, 0], [0.12, 0.9, 0.12]); }
    D.add(cyl, 0xc8432f, [cx, cy, cz], [Math.PI / 2, 0, 0], [1.6, 3.6, 1.6]);
    // the A-frame: the legs run up to the hub
    for (const [lx, lz] of [[-136, 1238], [-120, 1242]]) for (const dz of [-1.4, 1.4]) {
      const dx = cx - lx, dy = 24, len = Math.hypot(dx, dy);
      D.add(box, 0x8a8f96, [(lx + cx) / 2, YS + 12, cz + dz * 0.8], [0, 0, Math.atan2(dy, dx)], [len, 0.5, 0.5]); }
  });
  P.spot('Sea Wheel', -128, YS, 1226, Math.PI, [-146, 1216, -110, 1232]);
  P.travel('Sea Wheel', -128, YS, 1216, Math.PI, 'spot');
}

/* ---------- filler: small skateable things along every street and pier so nothing goes dead ---------- */
function bw_east_fill(K, P, PL, S) {
  const { YN, YS } = PL;
  const walk = (x0, z0, x1, z1, h, mat) => S.led(x0, z0, x1, z1, 0.15 + h, mat, 'ns');
  // Harbour Road sidewalks: planter, bench, rack, ledge, pad in turn, north and south, about every 17 m (the podium side has its own bank)
  let k = 0;
  for (let x = -184; x < -22; x += 24, k++) {
    if (x > -48 && x < -32) continue;
    const z = k % 2 ? 1028 : 1012, t = k % 5;
    if (t === 0) walk(x - 1.5, z - 0.8, x + 1.5, z + 0.8, 0.5, 'ledge');
    else if (t === 1) walk(x - 1.6, z - 0.4, x + 1.6, z + 0.4, 0.3, 'wood');
    else if (t === 2) { if (S.free(x - 1.2, z - 0.3, x + 1.2, z + 0.3)) { K.bikeRack(x, z, true, 2.4); S.take(x - 1.2, z - 0.3, x + 1.2, z + 0.3); } }
    else if (t === 3) walk(x - 3.2, z - 0.3, x + 3.2, z + 0.3, 0.25, 'ledge');
    else walk(x - 3, z - 1, x + 3, z + 1, 0.18, 'pad');
  }
  // Quay Road east: pockets and ledges on the stone either side of the kerbless road, clear of the corridor and the lanes
  let n = 0;
  for (let x = -180; x < -30; x += 22, n++) {
    const north = n % 2 === 0, z0 = north ? 920 : 937, t = n % 4;
    if (t === 0) S.led(x - 3, z0, x + 3, z0 + 0.8, 0.4, 'ledge', 'ns');
    else if (t === 1) S.led(x - 2, z0, x + 2, z0 + 2, 0.18, 'pad', 'nswe');
    else if (t === 2) S.bank(x - 3, north ? 922.4 : 938.8, 1, 0, 6, 0.4, 2.4);
    else S.led(x - 4, z0, x + 4, z0 + 0.6, 0.3, 'wood', 'ns');
  }
  // the Quay Pocket: a bus-stop pull-off with a bank, a ledge and a bench
  K.busStop(-116, 940.4, true, 1); S.take(-119, 939, -113, 942);
  S.bank(-128, 938.5, 1, 0, 6, 0.45, 3); K.B(-108, YN - 0.3, 937, -102, YN + 0.5, 937.8, 'marble', { edges: 'ns' }); S.take(-108, 937, -102, 937.8);
  P.spot('Quay Pocket East', -116, YN, 938, Math.PI, [-130, 934, -100, 944]);
  P.spot('Quay Gate East', -34, YN, 938, Math.PI, [-48, 934, -24, 944]);
  // Ice House Lane: ledges and banks both sides, and the east side of the lane (x -32..-14) is open ground for a little row of furniture
  for (let z = 950; z < 1140; z += 24) {
    if (z > 1008 && z < 1032) continue;
    const t = Math.round((z - 950) / 24) % 4;
    if (z < 1096) {
      const x = z % 2 ? -29 : -50;
      if (t === 0) S.led(x - 1, z, x + 1, z + 5, 0.45, 'ledge', 'ew');
      else if (t === 1) S.bank(x, z, 0, 1, 5, 0.4, 3);
      else if (t === 2) S.led(x - 0.5, z, x + 0.5, z + 7, 0.3, 'wood', 'ew');
      else { K.newsBoxes(x, z + 1, false, 2); S.take(x - 0.7, z, x + 0.7, z + 2); S.led(x - 1, z + 4, x + 1, z + 6, 0.2, 'pad', 'nswe'); }
    } else {
      S.led(-52, z, -50, z + 6, 0.45, 'ledge', 'ew'); S.bank(-34, z + 8, 0, 1, 5, 0.45, 3);
    }
  }
  S.led(-31, 1038, -17, 1038.8, 0.4, 'marble', 'ns'); S.led(-30, 1066, -20, 1066.8, 0.45, 'ledge', 'ns'); S.led(-31, 1084, -20, 1084.8, 0.4, 'wood', 'ns');
  S.led(-31, 958, -20, 958.8, 0.4, 'ledge', 'ns'); S.led(-30, 984, -20, 984.8, 0.45, 'marble', 'ns'); S.led(-31, 1004, -18, 1004.8, 0.4, 'ledge', 'ns');
  K.hydrant(-33.5, 1000); K.hydrant(-45.5, 1090);
  P.spot('Ice House Lane Pocket', -33, YN, 1052, Math.PI / 2, [-47, 1040, -24, 1066]);
  P.spot('Harbour Gate East', -24, YN, 1022, -Math.PI / 2, [-40, 1010, -14, 1030]);
  // Steep Street, z 944..1096: ledges and banks on the sidewalk edges, away from the lane
  for (let z = 962; z < 1096; z += 28) {
    if (z > 1004 && z < 1034) continue;
    const t = Math.round((z - 962) / 28) % 3;
    if (t === 0) { S.led(-209, z, -208, z + 7, 0.4, 'ledge', 'ew'); S.led(-192.5, z + 5, -191.5, z + 12, 0.4, 'ledge', 'ew'); }
    else if (t === 1) { S.led(-209.5, z, -208, z + 3, 0.3, 'wood', 'ew'); S.bank(-191, z + 6, 1, 0, 4, 0.4, 3); }
    else { S.bank(-211, z, 1, 0, 3, 0.4, 3); S.led(-192, z + 4, -190.8, z + 9, 0.3, 'wood', 'ew'); }
  }
  // Steep Street at the Quay: a lip and a pad at the corridor edges (low, outside x -208..-192 and z < 944 below 0.3)
  S.led(-190.5, 913, -189, 921, 0.28, 'wood', 'ew'); S.led(-211, 913, -209.5, 921, 0.28, 'wood', 'ew');
  S.led(-190.5, 936, -189, 943, 0.28, 'wood', 'ew'); S.led(-211, 936, -209.5, 943, 0.28, 'wood', 'ew');
  // the boardwalk between the benches and the Slappy Strip: ledges and planters in turn, with a pad in the middle of the span
  for (let x = -196; x < -30; x += 20) {
    const t = Math.round((x + 196) / 20) % 4;
    if (t === 0) S.led(x - 2, 1153, x + 2, 1153.9, 0.4, 'ledge', 'ns');
    else if (t === 1) S.led(x - 2, 1156.5, x + 2, 1158.5, 0.2, 'pad', 'nswe');
    else if (t === 2) S.led(x - 3, 1152.4, x + 3, 1153, 0.28, 'wood', 'ns');
    else S.led(x - 1.2, 1155, x + 1.2, 1157, 0.5, 'ledge', 'ns');
  }
  // piers: ledges, planters and a pad row so the 30 m rule holds down both
  for (let z = 1190; z < 1262; z += 14) {
    const t = Math.round((z - 1190) / 14) % 3;
    if (t === 0) S.led(-141, z, -135, z + 0.8, 0.45, 'wood', 'ns');
    else if (t === 1) S.led(-121, z, -115, z + 0.9, 0.4, 'wood', 'ns');
    else S.led(-126.5, z, -123.5, z + 3, 0.2, 'pad', 'nswe');
  }
  S.led(-150, 1190, -149, 1220, 0.4, 'wood', 'ew'); S.led(-107, 1190, -106, 1220, 0.4, 'wood', 'ew');
  S.led(-150, 1240, -149, 1260, 0.4, 'wood', 'ew'); S.led(-107, 1250, -106, 1260, 0.4, 'wood', 'ew');
  S.led(-60, 1188, -52, 1188.8, 0.4, 'wood', 'ns');
  // the eastern edge of the car park and the lane: a manual pad in the gate seam, low enough for the gate (nothing above 0.3 in the band)
  S.led(-22, 1013.5, -14, 1014.4, 0.25, 'wood', 'ns');
  S.led(-22, 1146, -18, 1148, 0.18, 'pad', 'nswe');
}

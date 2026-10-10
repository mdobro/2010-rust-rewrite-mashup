/* University, College Town: x 360..496, z -230..230 (design/uni.md S13, S16-S19, sections 7 and 13).
   The Balustrades, Thirteen Yard, the Car Park and Garage, Scholars Square, the Bookstacks, the Lyceum, the Kettle Cafe, College Row,
   the Gown Street frontage with Mortarboard Skates, the dashes and lamps of the Avenue, Gown Street and Mill Lane (x <= 496),
   and the filler that keeps Gown Street, Mill Lane, Rampart Lane and the Avenue from going dead (CONTRACT 7).
   Everything is built inside the rect (clipped to x 495.5 where the doc says 500), except the two newel piers at x 496..499. */
function uni_town(K, P, PL) {
  PL = PL || uni_plan();
  const keep = [];                       // rects [x0, z0, x1, z1] that trees and lamps keep out of
  uni_town_balustrades(K, P);
  uni_town_row(K, keep);
  uni_town_frontage(K, P, keep);
  uni_town_carpark(K, P, keep);
  uni_town_yard(K, P, keep);
  uni_town_square(K, P, keep);
  uni_town_books(K, P, keep);
  uni_town_filler(K, P, keep);
  uni_town_streets(K, keep);
  uni_town_challenges(P);
}

/* S13 the Balustrades: two 76 m stone parapets down the embankment edges, with a newel pier at each top end. */
function uni_town_balustrades(K, P) {
  for (const s of [1, -1]) {
    K.hubbas.push({ a: V(496, 5.97, s * 15.7), b: V(420, 1.41, s * 15.7), w: 0.6, color: 0xd8cbb0 });
    K.B(496, 5.4, s > 0 ? 15.4 : -16.0, 499, 6.9, s > 0 ? 16.0 : -15.4, 'marble');
  }
  P.spot('The Balustrades', 516, 6, 0, Math.PI / 2, [412, -24, 520, 24]);
  P.travel('The Balustrades', 516, 6, 0, Math.PI / 2, 'spot');
}

/* College Row: eight brick terraces along Gown Street's west sidewalk, each with a stoop to ollie. */
function uni_town_row(K, keep) {
  const Z = [[-200, -170, 2], [-160, -120, 3], [-110, -70, 2], [-60, -16, 3], [16, 60, 2], [70, 110, 3], [120, 160, 2], [170, 200, 3]];
  const C = [0x9a5e4c, 0x8a5444, 0xa86b55];
  Z.forEach(([z0, z1, f], i) => {
    K.building(373, z0, 385, z1, f, C[i % 3], 'brick');
    const zc = (z0 + z1) / 2, g = K.terrainH(386, zc);
    K.B(385, g - 0.5, zc - 2.5, 387.2, g + 0.5, zc + 2.5, 'step', { edges: 'e' });
    keep.push([384.5, zc - 4, 388.5, zc + 4]);
  });
}

/* the Gown Street east frontage (x 408..432), the Kettle Cafe, and Mortarboard Skates. */
function uni_town_frontage(K, P, keep) {
  const T = (x, z) => K.terrainH(x, z);
  const F = [[-110, -80, 3, 0xa86b55], [-78, -58, 2, 0x9a5e4c], [-56, -30, 3, 0x8a5444], [30, 60, 3, 0x9a5e4c], [66, 100, 2, 0xa86b55], [108, 150, 3, 0x8a5444], [160, 190, 2, 0x9a5e4c]];
  for (const [z0, z1, f, c] of F) K.building(408, z0, 432, z1, f, c, 'brick');
  // awnings over the sidewalk (looks only)
  for (const [z0, z1, c] of [[-110, -80, 0x5a7a52], [-56, -30, 0x9a3f36], [30, 60, 0x3f5d8a], [66, 100, 0x9a3f36], [108, 150, 0x5a7a52], [160, 190, 0x3f5d8a]]) {
    const g = T(407, (z0 + z1) / 2); K.prop(406.2, g + 2.3, z0 + 2, 408, g + 2.6, z1 - 2, c);
  }
  // Mortarboard Skates (door on the west face, facing Gown Street)
  const g = T(407.8, -68);
  P.shop({ name: 'Mortarboard Skates', sign: [407.96, g + 3.85, -68, -Math.PI / 2, 7],
    awning: [406.4, -74, 408, -62, g + 2.2, 'x'], zone: [404.8, -72, 407.8, -64], door: [407.8, g, -68] });
  P.travel('Mortarboard Skates', 401, g, -68, -Math.PI / 2, 'spot');
  P.spot('Mortarboard Skates', 401, g, -68, -Math.PI / 2, [388, -84, 408, -54]);
  keep.push([402.5, -80, 408.5, -58]);
  // the Kettle Cafe: a brick cafe with a terrace of picnic tables facing Thirteen Yard
  K.building(444, -112, 484, -72, 2, 0xa86b55, 'brick');
  const gk = T(464, -70);
  K.prop(446, gk + 2.4, -73, 482, gk + 2.7, -70, 0x9a3f36);
  K.picnic(452, -67.6, true); K.picnic(462, -67.6, true); K.picnic(472, -67.6, true);
}

/* S17 the Car Park and the Garage. */
function uni_town_carpark(K, P, keep) {
  const T = (x, z) => K.terrainH(x, z);
  const deck = K.garage(420, -190, 470, -150, 5, 1);
  for (let z = -196; z < -124; z += 6.4) { K.parkingBlock(477, z, false); K.parkingBlock(486, z, false); }   // a wheel stop every other stall (box budget)
  for (let z = -146; z < -124; z += 6.4) { K.parkingBlock(411, z, false); K.parkingBlock(418, z, false); }
  K.planter(440, -140, 470, -137, 0.5); K.planter(440, -128, 470, -125, 0.5);
  K.rail(442, T(442, -132) + 0.5, -132, 468, T(468, -132) + 0.5, -132, 'Rail', true);   // cart rail between the islands
  for (const k of [2, 5, 6, 11, 15, 19]) K.car(480, -196 + 3.2 * k + 1.6, true);
  P.tape(466, -154, deck);
  P.spot('Car Park', 446, T(446, -146), -146, 0, [404, -204, 492, -116]);
  keep.push([404, -204, 490, -118]);
}

/* S16 Thirteen Yard: the foot of the West Thirteen. */
function uni_town_yard(K, P, keep) {
  const T = (x, z) => K.terrainH(x, z);
  K.ledge(452, -60, 476, -59.4); K.ledge(452, -32.6, 476, -32);
  const pad = K.pad(456, -50, 470, -42, 0.2);    // the manual pad sits straight ahead of the Thirteen's roll-away: a ply ramp on its east end rolls you on
  K.hubbas.push({ a: V(470, pad.max[1], -46), b: V(472.8, T(472.8, -46) + 0.02, -46), w: 8, noRails: true, color: 0xc49a5c });
  K.picnic(480, -36, true); K.picnic(480, -58, true); K.bikeRack(446, -30, true);
  P.spot('Thirteen Yard', 486, T(486, -44), -44, Math.PI / 2, [440, -64, 495.5, -28]);
  keep.push([440, -66, 496, -26]);
}

/* S19 Scholars Square and the Founder's Plinth. */
function uni_town_square(K, P, keep) {
  const T = (x, z) => K.terrainH(x, z);
  const gP = T(470, 68);
  K.B(466, 0, 64, 474, gP + 0.55, 72, 'marble', { edges: 'nswe' });
  K.decorFns.push(D => {   // the statue: a bronze scholar on the plinth
    const y = gP + 0.55;
    D.prop(469.2, y, 67.2, 470.8, y + 1.9, 68.8, 0x6b7a5e); D.prop(468.6, y + 1.2, 67.7, 471.4, y + 1.7, 68.3, 0x6b7a5e);
    D.add(new THREE.SphereGeometry(0.45, 8, 6), 0x6b7a5e, [470, y + 2.35, 68]);
  });
  for (const z of [60, 76]) for (const x0 of [444, 454, 486]) K.bench(x0, z, x0 + 6, z + 0.6);
  for (const [x, z] of [[441, 37], [490.5, 37], [441, 94.5], [490.5, 94.5]]) K.planter(x, z, x + 4.5, z + 4.5, 0.55);
  for (const [x, z] of [[441.5, 52], [441.5, 84], [457, 40], [457, 97], [466, 48], [466, 90]]) K.tree(x, z);
  P.spot('Scholars Square', 470, T(470, 42), 42, Math.PI, [440, 36, 495.5, 100]);
  keep.push([440, 36, 496, 100]);
}

/* S18 the Bookstacks and Returns Deck, the Lyceum, and the alley between them and Gown Street. */
function uni_town_books(K, P, keep) {
  const T = (x, z) => K.terrainH(x, z);
  const gD = T(472, 107);
  K.building(444, 114, 495.5, 150, 3, 0x8a5444, 'brick');
  K.B(444, 0, 108, 495.5, gD + 1.2, 114, 'plaza', { edges: 'n' });
  K.stairSpot('z', 108, -1, 466, 478, gD + 1.2, gD, 4, 0.4, { rails: [472], hubbas: [465.6, 478.4] });
  K.ledge(448, 103.4, 462, 104); K.ledge(482, 103.4, 495.5, 104);
  P.spot('The Bookstacks', 472, T(472, 94), 94, Math.PI, [444, 98, 495.5, 116]);
  // the Lyceum cinema
  const gL = T(472, 160);
  K.building(444, 160, 495.5, 190, 3, 0xa86b55, 'brick');
  K.prop(452, gL + 3.2, 157.5, 492, gL + 3.6, 160, 0xd9c27a);
  K.decorFns.push(D => D.sign('THE LYCEUM', 472, gL + 5.2, 159.95, 14, 1.8, Math.PI, '#f3e6b8', '#5a2f2a'));
  // the alley from Gown Street to the Bookstacks lawn (z 100..108): ledges and a manual pad on its edges, the middle stays open
  K.ledge(410, 100.4, 424, 101); K.pad(428, 106, 438, 107.8, 0.2); K.planter(441, 106, 445, 108, 0.5);
  keep.push([408, 99, 446, 109]);
}

/* the filler: small skateable things along every street and lane of the rect so nothing goes dead (CONTRACT 7). */
function uni_town_filler(K, P, keep) {
  const T = (x, z) => K.terrainH(x, z);
  const hold = (x0, z0, x1, z1) => keep.push([x0 - 1, z0 - 1, x1 + 1, z1 + 1]);
  // Gown Street, east sidewalk (x 403..407): a different small thing every ~24 m
  const X = 405.2;
  const east = {
    strip: z => { K.strip(X, z - 7, X, z + 7, 0.42, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 4 }); hold(X - 1, z - 7, X + 1, z + 7); },
    bench: z => { K.bench(X - 0.3, z - 1.8, X + 0.3, z + 1.8); hold(X - 1, z - 2, X + 1, z + 2); },
    rack: z => { K.bikeRack(X, z - 1.5, false); K.newsBoxes(X, z + 1.8, false, 2); K.trashCan(X + 1.2, z - 3); hold(X - 1.5, z - 4, X + 1.5, z + 3); },
    planter: z => { K.planter(X - 1, z - 1.5, X + 1, z + 1.5, 0.5); hold(X - 1, z - 1.5, X + 1, z + 1.5); },
    pad: z => { K.pad(X - 1.2, z - 4, X + 1.2, z + 4, 0.18); hold(X - 1.2, z - 4, X + 1.2, z + 4); },
    hydrant: z => { K.hydrant(X + 1.2, z); K.planter(X - 1, z + 2, X + 0.6, z + 5, 0.45); hold(X - 1, z - 1, X + 1.5, z + 5); },
    works: z => { K.construction(X, z, false); hold(X - 2, z - 6, X + 2, z + 6); },
  };
  for (const [z, t] of [[-200, 'strip'], [-176, 'bench'], [-152, 'rack'], [-128, 'works'], [-104, 'planter'], [-85, 'strip'], [-52, 'pad'], [-34, 'hydrant'],
    [-14, 'planter'], [14, 'bench'], [66, 'strip'], [88, 'rack'], [112, 'planter'], [136, 'pad'], [160, 'strip'], [182, 'bench']]) east[t](z);
  // the pocket: a bus stop with a bench and a little bank, at the Gown Street Stop
  K.busStop(405.2, 44, false, 1);
  K.hubbas.push({ a: V(405, T(405, 55) + 0.55, 55), b: V(405, T(405, 51.5) + 0.02, 51.5), w: 2.4, noRails: true, color: 0xc4bfb3 });
  K.ledge(403.6, 56.6, 404.2, 62);
  P.spot('Gown Street Stop', 404.5, T(404.5, 34), 34, Math.PI, [400, 32, 408, 64]);
  hold(402.5, 40, 408, 63);
  // Gown Street, west side: ledges in the alleys between the terraces
  for (const z of [-165, -115, -65, 65, 115, 165]) { K.ledge(386.6, z - 3, 387.2, z + 3, 0.45); hold(386, z - 3, 388, z + 3); }
  // University Avenue (bomb): small things on the sidewalk edges, the road itself stays clear
  K.planter(380, -11, 384.5, -9.2, 0.5);
  K.strip(412, 9.9, 428, 9.9, 0.4, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 4 });
  K.strip(440, -9.9, 456, -9.9, 0.4, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 4 });
  K.strip(468, 9.9, 484, 9.9, 0.4, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 4 });
  K.bench(432, -10.6, 438, -10.0);
  // Mill Lane (x 396..496): north sidewalk z 191..194, south 206..209
  K.bench(404, 192, 410, 192.6);
  K.strip(420, 207.6, 436, 207.6, 0.42, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 4 });
  K.bikeRack(448, 192.4, true); K.newsBoxes(452, 192.4, true, 2);
  K.planter(460, 206.4, 464, 208.4, 0.5);
  K.strip(472, 192.6, 486, 192.6, 0.42, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 4 });
  K.bench(490, 207.2, 495.5, 207.8);
  // Rampart Lane (x 488..496): the lane under the west wall, things at its west edge
  K.strip(490.6, -118, 490.6, -105, 0.42, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 4 });
  K.bench(490.4, -98, 491, -93);
  K.planter(489.5, -84, 492.5, -81, 0.5);
  K.pad(489, -75, 491.6, -67, 0.18);
}

/* dashes, lamps and trees on the Avenue, Gown Street and Mill Lane (x <= 496). */
function uni_town_streets(K, keep) {
  const T = (x, z) => K.terrainH(x, z);
  const free = (x, z, m = 1.6) => x >= 373 && x <= 495.5 && !keep.some(r => x > r[0] - m && x < r[2] + m && z > r[1] - m && z < r[3] + m);
  // centre lines
  for (let x = 363; x < 494; x += 6) if (!(x + 3 > 387 && x < 405)) K.dash(x, 0, x + 3, 0);
  for (let z = -207; z < 192; z += 6) if (!(z + 3 > -12 && z < 12) && !(z + 3 > 187)) K.dash(396, z, 396, z + 3);
  for (let x = 404; x < 494; x += 6) K.dash(x, 200, x + 3, 200);
  // lamps: the Avenue both sides every 24 m (|z| 12), Gown Street staggered every 28 m, Mill Lane every 28 m
  for (const x of [384, 412, 436, 460, 484]) for (const s of [1, -1]) if (free(x, s * 12, 0.5)) K.lamp(x, s * 12, s);
  for (let k = 0; k < 15; k++) { const z = -196 + 28 * k, side = k % 2 ? 1 : -1, x = side > 0 ? 406.6 : 386.4;
    if (Math.abs(z) > 14 && z < 190 && free(x, z)) K.lamp(x, z, side); }
  for (let k = 0; k < 4; k++) { const x = 412 + 28 * k, north = k % 2 === 0; const z = north ? 191.6 : 208.4; if (free(x, z)) K.lamp(x, z, north ? -1 : 1); }
  // trees: Gown Street's sidewalks
  for (let z = -203; z <= 203; z += 24) {
    if (Math.abs(z) > 17 && free(387.8, z, 2.2)) K.tree(387.8, z);
    if (Math.abs(z) > 28 && z < 190 && free(406.4, z + 11, 2.2)) K.tree(406.4, z + 11);
  }
  for (const x of [424, 448, 472, 492]) if (free(x, 208.4, 2.5)) K.tree(x, 208.4);
}

/* the town's two challenges */
function uni_town_challenges(P) {
  P.challenge({ id: 'uni-balustrade', name: 'The Balustrade', desc: 'Grind a University Avenue balustrade',
    at: [492, 6, 15.7], go: [516, 6, 13.5, Math.PI / 2], kind: 'grind', rail: 'Hubba', area: [420, 14.8, 497, 16.6] });
  P.challenge({ id: 'uni-avenue-speed', name: 'Avenue Bomb', desc: 'Hit 45 km/h down University Avenue',
    at: [470, 3.96, 0], go: [530, 6, 0, Math.PI / 2], kind: 'speed', speed: 45 / 3.6, area: [404, -11, 504, 11] });
}

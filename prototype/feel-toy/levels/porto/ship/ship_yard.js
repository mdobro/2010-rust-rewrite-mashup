/* Shipyard East, the yard part: x 589..1000, z 910..1112 (design/ship.md 3.2 and 4.3).
   Gantry Road (paint, sidewalks, lamps), Harbour Road x 628..930, the Pallet Yard, the Skyway Stub with its gravel pile and the
   Under the Skyway DIY, Flatbed Row and the jersey maze, the rail spur, Terminal Gate 3, the container yard with the Stack Runs,
   Reefer Row, the hill toe, and the small filler that keeps every street in this rect from going dead. */
function ship_yard(K, P, PL) {
  ship_yard_gantry(K, P, PL);
  ship_yard_harbour(K, P, PL);
  ship_yard_pallets(K, P, PL);
  ship_yard_skyway(K, P, PL);
  ship_yard_flatbeds(K, P, PL);
  ship_yard_spur(K, P, PL);
  ship_yard_terminal(K, P, PL);
  ship_yard_containers(K, P, PL);
  ship_yard_reefer(K, P, PL);
  ship_yard_toe(K, P, PL);
  ship_yard_filler(K, P, PL);
  ship_yard_spots(K, P, PL);
}

/* the linear pieces of the plate between z0 and z1 (split at the kinks), so a painted line follows the ground */
function ship_yard_pieces(PL, z0, z1) {
  const cuts = [z0, ...PL.kinks.filter(k => k > z0 + 0.01 && k < z1 - 0.01), z1], out = [];
  for (let i = 0; i < cuts.length - 1; i++) out.push([cuts[i], cuts[i + 1]]);
  return out;
}

/* Gantry Road z 910..1112: asphalt strips, dashes, edge lines, sidewalks and lamps */
function ship_yard_gantry(K, P, PL) {
  PL.paintZ(K, 593, 607, 910, 1112, 0x56585d);
  for (let z = 912; z < 1108; z += 6) if (z + 3 < 1008 || z > 1032) K.dash(600, z, 600, z + 3, 0xe2c044);
  for (const [a, b] of [[912, 1012], [1028, 1110]]) for (const [z0, z1] of ship_yard_pieces(PL, a, b))
    for (const x of [593.3, 606.7]) K.dash(x, z0, x, z1, 0xf0ece2, 0.15);
  PL.walkZ(K, 589, 593, 940, 1008.6, 593); PL.walkZ(K, 589, 593, 1031.4, 1110.6, 593);          // west sidewalk
  PL.walkZ(K, 607, 611, 960, 1008.6, 607); PL.walkZ(K, 607, 611, 1031.4, 1110.6, 607);          // east sidewalk, cut for the roll-out
  // Harbour Road across the foot of Gantry Road: paint only, flush (the lane mouths either side of the strips)
  const y = PL.y1 + 0.006;
  K.paintRect(589, 1014, 593, 1026, 0x56585d, y); K.paintRect(607, 1014, 628, 1026, 0x56585d, y);
  K.dash(608, 1020, 626, 1020, 0xe2c044);
  // lamps just off the sidewalks (the doc's x 588 / 612 would sit outside or in the car lane), every 30 m from z 940
  for (const z of [940, 1000, 1070]) K.lamp(589.6, z, -1);
  for (const z of [970, 1040, 1100]) K.lamp(611.6, z, 1);
}

/* Harbour Road, the yard segments, with hand-placed lamps */
function ship_yard_harbour(K, P, PL) {
  K.street('x', 1020, 628, 760, PL.y1, [], { rw: 6, sw: 4, lamps: false });
  K.street('x', 1020, 780, 930, PL.y1, [], { rw: 6, sw: 4, lamps: false });
  for (let x = 640; x < 930; x += 30) if (x < 750 || x > 790) K.lamp(x, 1009, -1);
  for (let x = 655; x < 930; x += 30) if (x < 750 || x > 790) K.lamp(x, 1031, 1);
}

/* Pallet Yard on the gravel by the roll-out */
function ship_yard_pallets(K, P, PL) {
  const H = [0.6, 0.9, 1.2];
  [[624, 929], [632, 929], [646, 929], [660, 929], [674, 929], [628, 935], [640, 935], [654, 935], [668, 935], [684, 935]].forEach(([x, z], i) =>
    K.Bg(x, z, x + 1.2, z + 1.2, H[i % 3], 'wood', { edges: 'nswe' }));
}

/* the Skyway Stub: on-ramp, deck, piers, guardrails, jerseys, rebar, sign, gravel pile, the Under the Skyway DIY */
function ship_yard_skyway(K, P, PL) {
  const th = K.terrainH, DK = -30.5;
  K.hubbas.push({ a: V(840, DK, 951), b: V(944, -40.73, 951), w: 14, noRails: true, color: 0xa8a69f });                   // the on-ramp, 9.8 %
  K.B(732, -31.7, 944, 840, DK, 958, 'garage', { edges: 'w' });                                                              // the deck
  for (const x of [744, 768, 792, 816]) K.B(x - 1.2, th(x, 951) - 0.4, 949.8, x + 1.2, -31.7, 952.2, 'garage');            // piers
  for (const z of [944.4, 957.6]) { K.rail(944, -39.93, z, 840, DK + 0.8, z, 'Rail', true); K.rail(840, DK + 0.8, z, 733, DK + 0.8, z, 'Rail', true); }
  K.B(758.6, DK, 944.6, 759.4, DK + 0.8, 949.5, 'ledge', { edges: 'ew' });                                                  // jersey line, 3 m gap
  K.B(758.6, DK, 952.5, 759.4, DK + 0.8, 957.4, 'ledge', { edges: 'ew' });
  for (const z of [944.5, 945.0, 945.5, 956.0, 956.6, 957.2]) K.prop(731.4, DK - 0.04, z - 0.02, 732, DK + 0.02, z + 0.02, 0x7a4a2e);   // rebar stubs at the edges
  // ROAD ENDS on a gantry beam 3.3 m over the deck (decor only)
  K.prop(744.6, DK, 943.9, 745.0, DK + 4.2, 944.3, 0x55595e); K.prop(744.6, DK, 957.7, 745.0, DK + 4.2, 958.1, 0x55595e);
  K.prop(744.6, DK + 3.9, 943.9, 745.0, DK + 4.2, 958.1, 0x55595e);
  K.decorFns.push(D => D.sign('ROAD ENDS', 745.3, DK + 3.3, 951, 6, 1.2, Math.PI / 2, '#1d1d1d', '#e2c044'));
  // the gravel pile: 4 m out and 2.2 m below the deck, then 8 m down over 28 m
  K.hubbas.push({ a: V(728, -32.7, 951), b: V(700, -40.73, 951), w: 16, noRails: true, color: 0x8d8678 });
  // Under the Skyway DIY
  K.hubbas.push({ a: V(769.2, -39.33, 951), b: V(775.2, -40.71, 951), w: 2.4, noRails: true });
  K.hubbas.push({ a: V(814.8, -39.33, 951), b: V(808.8, -40.71, 951), w: 2.4, noRails: true });
  K.ledge(780, 947.4, 804, 948.0, 0.45); K.pad(780, 953.8, 804, 956.2, 0.18);
  P.tape(788, 951, -40.73);
  P.travel('Skyway Stub', 836, DK, 951, Math.PI / 2, 'spot');
  P.challenge({ id: 'ship-skyway-gap', name: 'Skyway Gap', desc: 'Ollie off the end of the unfinished ramp on to the gravel pile', kind: 'gap',
    at: [736, DK, 951], go: [790, DK, 951, Math.PI / 2], from: [732, 944, 760, 958, -31.2, -29.5], to: [700, 944, 728, 958, -41, -32.4] });
  P.challenge({ id: 'ship-skyway-rail', name: 'Skyway Guardrail', desc: 'Grind a Skyway guardrail', kind: 'grind', rail: 'Rail',
    at: [880, -33.6, 944.4], go: [836, DK, 951, -Math.PI / 2], area: [732, 943.8, 944, 958.2] });
  P.challenge({ id: 'ship-gravel-speed', name: 'Gravel Bomb', desc: 'Hit 45 km/h off the gravel pile', kind: 'speed', speed: 12.5,
    at: [714, -36.7, 951], go: [760, DK, 951, Math.PI / 2], area: [600, 940, 728, 962] });
}

/* Flatbed Row: nine trailers, the kick-up, the jersey maze */
function ship_yard_flatbeds(K, P, PL) {
  const Y = PL.Y, th = K.terrainH, cols = [0x3d4f63, 0x7c2f28, 0x55595e];
  [646, 663, 680].forEach((x0, ci) => [970, 980, 990].forEach(z0 => {
    K.B(x0, Y(z0 + 2.5) - 0.4, z0, x0 + 13, Y(z0) + 1.3, z0 + 2.5, 'metal', { color: cols[ci], edges: 'nswe' });
    for (const x of [x0 + 1.4, x0 + 10.6]) for (const z of [z0 - 0.12, z0 + 2.5 - 0.02]) K.prop(x, Y(z0 + 1.2), z, x + 1.0, Y(z0 + 1.2) + 0.9, z + 0.14, 0x1a1a1c);   // wheels
  }));
  K.kicker(699, 981.25, -1, 0, 6, 1.3, 2.4);                                    // up on to the middle row, heading west
  for (const [x0, z0, x1, z1] of [[712, 968, 718, 968.6], [724, 972, 724.6, 978], [732, 984, 738, 984.6], [744, 976, 744.6, 982], [752, 990, 758, 990.6], [712, 986, 712.6, 992]]) K.jersey(x0, z0, x1, z1);
}

/* the rail spur: rails, sleepers, five flatcars and the buffer stop */
function ship_yard_spur(K, P, PL) {
  const Y = PL.Y, th = K.terrainH;
  const g = Y(1001.5);
  K.prop(640, g, 1000.76, 930, g + 0.1, 1000.84, 0x6b6f75); K.prop(640, g, 1002.16, 930, g + 0.1, 1002.24, 0x6b6f75);
  for (let x = 641; x < 930; x += 1.5) K.dash(x, 999.9, x, 1003.1, 0x4a3b2e, 0.3);
  for (const x0 of [700, 717, 734, 820, 837]) K.B(x0, Y(1003.1) - 0.4, 999.9, x0 + 14, Y(999.9) + 1.25, 1003.1, 'metal', { color: 0x6b4a33, edges: 'ns' });
  K.B(930, Y(1003.4) - 0.4, 999.6, 931.5, Y(999.6) + 1.1, 1003.4, 'metal', { color: 0xc8402e, edges: 'w' });
}

/* Terminal Gate 3: booth, barrier arm, weighbridge, fence, sign */
function ship_yard_terminal(K, P, PL) {
  const Y = PL.Y, th = K.terrainH, roof = Y(1044) + 3.4;
  K.building(626, 1044, 632, 1050, 1, 0xdedad2, 'office');
  K.decorFns.push(D => D.sign('TERMINAL 3', 629, roof + 0.9, 1043.9, 6, 1.2, Math.PI, '#f2f0ea', '#3d4f63'));
  K.prop(626.4, roof, 1043.8, 626.8, roof + 0.3, 1044.0, 0x55595e); K.prop(631.2, roof, 1043.8, 631.6, roof + 0.3, 1044.0, 0x55595e);
  const ay = Y(1047) + 0.9;
  K.rail(632.2, ay, 1047, 645, ay, 1047, 'Rail', true);                          // the barrier arm: 0.9 m over the lane
  for (let i = 0; i < 10; i++) K.prop(632.2 + i * 1.28, ay - 0.06, 1046.94, 633.48 + i * 1.28, ay + 0.06, 1047.06, i % 2 ? 0xf0ece2 : 0xc8402e);
  K.pad(632, 1080, 648, 1096, 0.15);                                             // the weighbridge
  const fy = Y(1032);
  K.B(652, fy - 0.3, 1032, 757.8, fy + 2.4, 1032.1, 'fence'); K.B(784, fy - 0.3, 1032, 889.6, fy + 2.4, 1032.1, 'fence');
  K.B(652, fy - 0.3, 1032, 652.1, fy + 2.4, 1036, 'fence');
  for (const z of [1044, 1092]) {                                                // the yard masts: 12 m, four lamp heads
    const g = Y(z); K.prop(763.8, g, z - 0.2, 764.2, g + 12, z + 0.2, 0x55595e);
    for (const dx of [-1.2, 1.2]) K.prop(764 + dx - 0.4, g + 11.8, z - 0.4, 764 + dx + 0.4, g + 12.2, z + 0.4, 0xffe9a8);
  }
}

/* the container yard: blocks A and B, and the Stack Runs with their plates */
function ship_yard_containers(K, P, PL) {
  const Y = PL.Y, zs = [1038, 1050, 1062, 1074, 1086, 1098];
  const A = [[2, 2, 1, 0, 1, 2, 3, 2], [3, 2, 2, 1, 1, 2, 2, 3], null, [2, 1, 0, 2, 2, 0, 1, 2], [1, 2, 3, 3, 2, 1, 2, 1], [2, 2, 1, 1, 0, 1, 2, 2]];
  const B = [[1, 2, 2, 3, 2, 1, 1, 2], [2, 1, 1, 0, 1, 2, 3, 3], null, [3, 3, 2, 1, 0, 1, 2, 1], [1, 0, 1, 2, 2, 1, 1, 2], [2, 1, 1, 1, 2, 3, 2, 1]];
  zs.forEach((z0, r) => {
    for (const [tab, bx] of [[A, 652], [B, 784]]) for (let i = 0; i < 8; i++) {
      const pal = PL.PAL[(i * 7 + (r + 1) * 3) % 7];
      if (tab[r]) PL.stack(K, bx + 13.2 * i, z0, tab[r][i], 12.2, pal, '');            // 2.6 m and up from the aisles: no reachable edges
      else if (bx === 652 || i < 7) PL.stack(K, bx + 13.2 * i, z0, 1, 13.2, pal, '');    // the Stack Runs: butted, 13.2 long, one high
    }
  });
  // the Stack Runs' lips: one ledge per side for the whole run (not one per box), at the flat top Y(1062) + 2.6
  for (const [x0, x1] of [[652, 757.6], [784, 876.4]]) for (const z of [1062, 1064.45]) K.rail(x0, Y(1062) + 2.6, z, x1, Y(1062) + 2.6, z, 'Ledge', false);
  const T = Y(1062) + 2.6, zc = 1063.225;
  K.hubbas.push({ a: V(757.6, T, zc), b: V(770, T - 2.6, zc), w: 2.45, noRails: true, color: 0x8a8f94 });
  K.hubbas.push({ a: V(652, T, zc), b: V(640, T - 2.6, zc), w: 2.45, noRails: true, color: 0x8a8f94 });
  K.hubbas.push({ a: V(784, T, zc), b: V(772, T - 2.6, zc), w: 2.45, noRails: true, color: 0x8a8f94 });
  P.tape(712, 1063.2, T);
}

/* Reefer Row and the Reefer Canyon */
function ship_yard_reefer(K, P, PL) {
  const Y = PL.Y;
  K.hubbas.push({ a: V(906.5, -39.548, 1050), b: V(906.5, PL.y1, 1034), w: 5, noRails: true, color: 0x8a8f94 });
  K.B(904, -42.7, 1050, 909, -39.548, 1066, 'car', { color: 0xdedad2, edges: 'ew' });
  K.B(904, -43.0, 1069.5, 909, -39.548, 1085.5, 'car', { color: 0xdedad2, edges: 'ew' });
  K.B(904, -43.5, 1086.7, 909, -40.241, 1098.9, 'car', { color: 0x2f6d8a, edges: 'ew' });
  K.hubbas.push({ a: V(906.5, -40.241, 1098.9), b: V(906.5, PL.y2, 1110), w: 5, noRails: true });
  // curb cuts where the Reefer Run crosses the sidewalks at x 906.5 (designer review): up off Harbour Road, down to the plate,
  // and over Quay Road's north sidewalk at the foot of N3
  const cut = (z0, y0, z1, y1) => K.hubbas.push({ a: V(906.5, y0, z0), b: V(906.5, y1, z1), w: 5, noRails: true, color: 0xb9b5ab });
  cut(1026, PL.y1 + 0.15, 1024.6, PL.y1 + 0.01); cut(1030, PL.y1 + 0.15, 1031.4, PL.y1 + 0.01);
  cut(1112, PL.y2 + 0.15, 1110.6, PL.y2 + 0.01); cut(1115, PL.y2 + 0.15, 1116.4, PL.y2 + 0.01);
  for (const [z0, z1, top] of [[1050, 1066, -39.548], [1069.5, 1085.5, -39.548], [1086.7, 1098.9, -40.241]])     // reefer plugs on the west faces
    for (let z = z0 + 2; z < z1 - 1; z += 4) K.prop(903.6, top - 1.6, z, 904, top - 1.1, z + 0.5, 0x2b2b2e);
  P.challenge({ id: 'ship-canyon', name: 'Reefer Canyon', desc: 'Gap from one reefer stack to the next', kind: 'gap',
    at: [906.5, -39.55, 1067.7], go: [906.5, PL.y1, 1030, Math.PI], from: [904, 1050, 909, 1066, -39.8, -39.2], to: [904, 1069.5, 909, 1085.5, -39.8, -39.2] });
}

/* the hill toe: fence in 30 m pieces, trees, lamps on the Skyway Approach */
function ship_yard_toe(K, P, PL) {
  for (let z = 930; z < 1110; z += 30) K.B(958, K.groundMin(958, z, 958.1, z + 30) - 0.3, z, 958.1, K.groundMax(958, z, 958.1, z + 30) + 2.4, z + 30, 'fence');
  for (const [x, z] of [[966, 940], [980, 968], [972, 996], [988, 1022], [968, 1050], [984, 1074], [970, 1096], [990, 1106]]) K.tree(x, z);
  for (const z of [970, 1000, 1040, 1080]) K.lamp(952, z, -1);
}

/* one small thing from a code: sw = on a sidewalk (its top is 0.15 over the ground).
   l ledge 6 m along x, v ledge 6 m along z, b bench, p planter, k bike rack, n news boxes, t trash can, h hydrant, j jersey, d manual pad,
   w pallet, c roadworks pocket, q pad along z, u jersey along z, x wide low block (a box to ollie onto) */
function ship_yard_bit(K, code, x, z, v, sw) {
  const lift = sw ? 0.15 : 0, box = (x0, z0, x1, z1, h, mat, edges) => K.B(x0, K.groundMin(x0, z0, x1, z1) - 0.4, z0, x1, K.groundMax(x0, z0, x1, z1) + lift + h, z1, mat, { edges });
  if (code === 'l') box(x - 3, z, x + 3, z + 0.6, v || 0.45, 'ledge', 'ns');
  else if (code === 'v') box(x - 0.3, z - 3, x + 0.3, z + 3, v || 0.45, 'ledge', 'ew');
  else if (code === 'b') box(x - 2, z, x + 2, z + 0.6, 0.45, 'wood', 'ns');
  else if (code === 'p') box(x - 2, z, x + 2, z + 1.4, v || 0.55, 'ledge', 'nswe');
  else if (code === 'k') K.bikeRack(x, z, true);
  else if (code === 'n') K.newsBoxes(x, z, true, 2);
  else if (code === 't') K.trashCan(x, z);
  else if (code === 'h') K.hydrant(x, z);
  else if (code === 'j') K.jersey(x - 3, z, x + 3, z + 0.6);
  else if (code === 'd') K.pad(x - 3, z, x + 3, z + 2.4, 0.18);
  else if (code === 'w') K.Bg(x, z, x + 1.2, z + 1.2, v || 0.6, 'wood', { edges: 'nswe' });
  else if (code === 'c') K.construction(x, z, true);
  else if (code === 'q') K.pad(x - 1.2, z - 3, x + 1.2, z + 3, 0.18);
  else if (code === 'u') K.jersey(x - 0.3, z - 3, x + 0.3, z + 3);
  else if (code === 'x') box(x - 1.5, z - 1.5, x + 1.5, z + 1.5, v || 0.4, 'pad', 'nswe');
}

/* filler for the rhythm rule: Gantry Road's sidewalks, Harbour Road's sidewalks, the roll-out apron, the lane edges, the Skyway Approach */
function ship_yard_filler(K, P, PL) {
  const sw = list => list.forEach(([c, x, z, v]) => ship_yard_bit(K, c, x, z, v, true));
  const gr = list => list.forEach(([c, x, z, v]) => ship_yard_bit(K, c, x, z, v, false));
  // Gantry Road, both sidewalks (the west one keeps z 1036..1048 clear in front of Deckhand Skate Supply; their ledges stand 0.45 over the sidewalk, at its outer edge so the bomb lane stays clear)
  sw([['v', 609.6, 978], ['v', 609.6, 1042], ['v', 609.6, 1066], ['v', 609.6, 1090], ['v', 609.6, 1105],
      ['v', 591.2, 953], ['v', 591.2, 975], ['v', 591.2, 998], ['v', 591.2, 1054], ['v', 591.2, 1064], ['v', 591.2, 1086], ['v', 591.2, 1104]]);
  gr([['v', 609.6, 937], ['v', 609.6, 1004]]);                                                                           // beside the roll-out cut
  // Harbour Road: north sidewalk z 1010..1014 (items at z 1011), south sidewalk z 1026..1030 (items at z 1028.4)
  gr([['l', 616, 1010.4], ['p', 624, 1010.8]]);
  sw([['l', 640, 1011], ['p', 645, 1028], ['b', 665, 1011], ['k', 665, 1028.4], ['p', 690, 1028], ['l', 702, 1011], ['k', 720, 1028.4], ['l', 736, 1011],
      ['p', 746, 1028], ['l', 792, 1011], ['p', 806, 1028], ['k', 830, 1028.4], ['b', 850, 1011], ['p', 870, 1028], ['l', 892, 1011], ['k', 890, 1028.4], ['l', 924, 1028.4]]);
  gr([['d', 770, 1011], ['d', 770, 1026.6]]);                                                                            // the Straddle Lane mouth
  // the roll-out apron (x 612..700, gravel), kept 6 m clear of the line z 951
  gr([['w', 624, 944.6, 0.9], ['l', 640, 958.4], ['j', 662, 944], ['l', 680, 958.4], ['w', 694, 944.6, 1.2], ['w', 650, 944.4, 0.6]]);
  // the lane edges: Straddle Lane (x 760..780) and the Skyway Approach (x 930..958)
  gr([['v', 762.5, 1042], ['v', 777.5, 1050], ['v', 762.5, 1088], ['v', 777.5, 1100], ['v', 762.5, 1106]]);
  gr([['v', 953.5, 972], ['v', 953.5, 998], ['v', 953.5, 1024], ['v', 953.5, 1052], ['v', 953.5, 1078], ['v', 953.5, 1104]]);
  // the aisles of the container yard: a few pads and ledges at their edges
  gr([['d', 898, 1078], ['d', 893, 1104], ['d', 893, 1056], ['d', 896, 1040]]);
}

function ship_yard_spots(K, P, PL) {
  const Y = PL.Y, th = K.terrainH;
  P.spot('Gantry Road North', 606, Y(945), 945, Math.PI, [592, 930, 612, 962]);
  P.spot('Gantry Crossing', 606, Y(1030), 1030, Math.PI, [589, 1008, 628, 1032]);
  P.spot('Gantry Road South', 606, Y(1100), 1100, Math.PI, [589, 1080, 612, 1112]);
  P.spot('Pallet Yard', 632, th(632, 951), 951, Math.PI / 2, [611, 926, 700, 962]);
  P.spot('Skyway Stub', 836, -30.5, 951, Math.PI / 2, [700, 940, 958, 962]);
  P.spot('Under the Skyway', 790, -40.73, 960, 0, [744, 944, 840, 958]);
  P.spot('Skyway Approach', 954, th(954, 1000), 1000, Math.PI, [930, 940, 958, 1112]);
  P.spot('Flatbed Row', 705, -41.3, 981.25, Math.PI / 2, [640, 966, 760, 996]);
  P.spot('Stack Run', 764, -40.8, 1063.2, Math.PI / 2, [640, 1060, 890, 1066]);
  P.spot('Box Drop', 878, Y(1063), 1068, Math.PI, [870, 1060, 892, 1076]);
  P.spot('Container Yard', 618, -41.85, 1040, Math.PI, [611, 1032, 945, 1112]);
  P.spot('Reefer Canyon', 906.5, -41.85, 1030, Math.PI, [900, 1032, 913, 1112]);
  P.spot('Reefer Drop', 906.5, th(906.5, 1106), 1106, Math.PI, [900, 1086, 913, 1112]);
}

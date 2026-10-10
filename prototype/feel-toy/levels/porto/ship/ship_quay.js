/* Shipyard East, the quay part: x 589..1000, z 1112..1350 (design/ship.md 4.4, 7, 8, 9).
   Gantry Road past the Quay Road crossing, Quay Road x 628..930, the straddle carriers, the three gantry cranes with their
   sills and the hatch-lid tables, the quay edge and bollards, the Corvina (stern ramp, ship's rails, hatches, superstructure,
   forecastle, bow rails), the crane and Corvina landmarks, the hill toe, and the small filler that keeps the quay streets alive. */
function ship_quay(K, P, PL) {
  ship_quay_gantry(K, P, PL);
  ship_quay_road(K, P, PL);
  ship_quay_carriers(K, P, PL);
  ship_quay_cranes(K, P, PL);
  ship_quay_edge(K, P, PL);
  ship_quay_corvina(K, P, PL);
  ship_quay_toe(K, P, PL);
  ship_quay_filler(K, P, PL);
  ship_quay_landmarks(K, P, PL);
}

/* Gantry Road below Harbour Road: paint to the stern ramp, the Quay Road crossing, sidewalks, lamps */
function ship_quay_gantry(K, P, PL) {
  PL.paintZ(K, 593, 607, 1112, 1160, 0x56585d);
  K.dash(600, 1112, 600, 1158, 0xe2c044);
  K.dash(593.3, 1112, 593.3, 1158, 0xf0ece2, 0.2);
  K.dash(606.7, 1112, 606.7, 1158, 0xf0ece2, 0.2);
  // Quay Road across the spine: flush asphalt between the bays and yard segments
  K.paintRect(589, 1115, 593, 1125, 0x56585d, PL.y2 + 0.006);
  K.paintRect(607, 1115, 628, 1125, 0x56585d, PL.y2 + 0.006);
  K.dash(589, 1120, 592, 1120, 0xe2c044); K.dash(608, 1120, 626, 1120, 0xe2c044);
  PL.walkZ(K, 589, 593, 1129.4, 1170, 593);
  PL.walkZ(K, 607, 611, 1129.4, 1170, 607);
  K.lamp(589.6, 1150, 1); K.lamp(610.4, 1150, -1);
  P.spot('Quay Crossing', 600, PL.Y(1121), 1121, Math.PI, [589, 1112, 628, 1132]);
}

/* Quay Road x 628..760 and 780..930 on the lower bench, with hand-placed lamps at z 1127 */
function ship_quay_road(K, P, PL) {
  K.street('x', 1120, 628, 760, PL.y2, [], { rw: 5, sw: 3, lamps: false });
  K.street('x', 1120, 780, 930, PL.y2, [], { rw: 5, sw: 3, lamps: false });
  for (const x of [640, 680, 720, 800, 840, 880, 920]) K.lamp(x, 1127, 1);
}

/* three parked straddle carriers: four 1 m legs each and a frame 5.4 m up, so you can ride under */
function ship_quay_carriers(K, P, PL) {
  const th = K.terrainH;
  for (const cx of [650, 745, 840]) {
    for (const sx of [-2.3, 2.3]) for (const z of [1129.5, 1136.5]) {
      const x = cx + sx, y = th(x, z);
      K.B(x - 0.5, y - 0.4, z - 0.5, x + 0.5, y + 6, z + 0.5, 'metal', { color: 0xd2a12a, edges: '' });
      K.prop(x - 0.45, y, z - 0.75, x + 0.45, y + 1.0, z - 0.55, 0x1a1a1c);      // the tyres
      K.prop(x - 0.45, y, z + 0.55, x + 0.45, y + 1.0, z + 0.75, 0x1a1a1c);
    }
    const y = th(cx, 1133);
    K.prop(cx - 3.1, y + 5.4, 1129, cx + 3.1, y + 6.2, 1137, 0xd2a12a);          // the top frame
    K.prop(cx - 1.2, y + 6.2, 1129.4, cx + 1.2, y + 7.6, 1131.8, 0x3d4f63);      // the cab
  }
}

/* the gantry cranes at x 690, 790 and 890: legs, sills to grind, portals, lowered booms, and the hatch-lid tables */
function ship_quay_cranes(K, P, PL) {
  const th = K.terrainH, Y = PL.Y;
  const cols = { 690: 0xc8402e, 790: 0xd2a12a, 890: 0x3d6a9a };
  for (const cx of [690, 790, 890]) {
    const c = cols[cx];
    for (const sx of [-8.9, 8.9]) {
      for (const zl of [1146, 1174]) K.B(cx + sx - 0.8, Y(zl) - 0.5, zl - 0.8, cx + sx + 0.8, Y(zl) + 30, zl + 0.8, 'metal', { color: c, edges: '' });
      K.B(cx + sx - 0.4, -44.4, 1147, cx + sx + 0.4, -42.927, 1173, 'metal', { color: 0x2b2b2e, edges: 'we' });   // the sill
    }
    const y0 = Y(1160);
    for (const sx of [-8.9, 8.9]) K.prop(cx + sx - 0.5, y0 + 26, 1146, cx + sx + 0.5, y0 + 28.5, 1174, c);        // portal beams
    for (const z of [1146, 1174]) K.prop(cx - 8.9, y0 + 26, z - 0.5, cx + 8.9, y0 + 28.5, z + 0.5, c);             // cross beams
    K.prop(cx - 1.2, y0 + 32, 1112, cx + 1.2, y0 + 34.2, 1240, c);                                               // the boom, lowered over the water
    K.prop(cx - 0.5, y0 + 28.5, 1160, cx + 0.5, y0 + 44, 1161, c);                                               // A-frame
    K.prop(cx - 0.5, y0 + 28.5, 1160, cx + 0.5, y0 + 32, 1200, 0x6f7d84);
    K.prop(cx - 2, y0 + 28.5, 1150, cx + 2, y0 + 32.5, 1156, 0x55595e);                                           // machinery house
    K.prop(cx - 0.1, y0 + 21, 1214.9, cx + 0.1, y0 + 32, 1215.1, 0x2b2b2e);                                       // spreader hangers
    K.prop(cx - 2.5, y0 + 20, 1213.5, cx + 2.5, y0 + 21, 1216.5, 0x3f4349);                                       // the spreader
  }
  K.decorFns.push(D => {   // crane rails: 0.1 m strips along the legs, missing across the stern ramp
    for (const z of [1146, 1174]) D.prop(607, th(607, z), z - 0.05, 945, th(607, z) + 0.1, z + 0.05, 0x3a3d42);
  });
  // six hatch-lid manual tables
  for (const [x, z] of [[714, 1152], [742, 1162], [814, 1152], [842, 1162], [630, 1156], [914, 1158]])
    K.B(x, Y(z) - 0.3, z, x + 6, Y(z) + 0.5, z + 3, 'metal', { color: 0x55595e, edges: 'nswe' });
  P.spot('Crane Quay', 790, -43.3, 1140, Math.PI, [600, 1128, 945, 1180]);
}

/* the quay edge box, the hill-side tail of it, and the bollards */
function ship_quay_edge(K, P, PL) {
  const th = K.terrainH;
  K.B(589, -50, 1176, 945, -44.0, 1180, 'ledge', { edges: 's' });
  for (let x = 945; x < 1000; x += 5) K.B(x, -50, 1176, Math.min(1000, x + 5), th(x, 1178), 1180, 'ledge', { edges: '' });   // follows the hill up
  const legs = [690, 790, 890].flatMap(cx => [cx - 8.9, cx + 8.9]);
  for (let x = 618; x < 945; x += 12) {
    if (legs.some(l => Math.abs(l - x) < 2.8)) continue;
    K.B(x - 0.25, -44.25, 1177.75, x + 0.25, -43.4, 1178.25, 'metal', { color: 0x2b2b2e, edges: '' });
  }
}

/* the Corvina, a ro-ro freighter moored stern-in at the quay */
function ship_quay_corvina(K, P, PL) {
  const NAVY = 0x2e3f5c;
  // hull, with a stepped bow
  K.B(587, -52, 1186, 613, -41.0, 1320, 'metal', { color: NAVY, edges: '' });
  K.B(588.2, -52, 1320, 611.8, -41.0, 1326, 'metal', { color: NAVY, edges: '' });
  K.B(590.5, -52, 1326, 609.5, -41.0, 1331, 'metal', { color: NAVY, edges: '' });
  K.B(594, -52, 1331, 606, -41.0, 1336, 'metal', { color: NAVY, edges: '' });
  K.decorFns.push(D => D.plane(588, 1186, 612, 1320, -40.99, 0x7a3f2e, false));
  // stern ramp with edge rails
  K.hubbas.push({ a: V(600, -41.0, 1186), b: V(600, -43.773, 1160), w: 12, noRails: true, color: 0x55595e });
  K.rail(594.2, -40.2, 1186, 594.2, -42.973, 1160, 'Rail', true);
  K.rail(605.8, -40.2, 1186, 605.8, -42.973, 1160, 'Rail', true);
  // ship's rails along both sides
  K.rail(587.6, -40.2, 1188, 587.6, -40.2, 1310, 'Rail', true);
  K.rail(612.4, -40.2, 1188, 612.4, -40.2, 1310, 'Rail', true);
  // four cargo hatches and the bank on to the first
  for (const [z0, z1] of [[1200, 1214], [1217.5, 1231.5], [1235, 1249], [1252.5, 1266.5]])
    K.B(592, -41.0, z0, 608, -40.3, z1, 'metal', { color: 0x3f6b46, edges: 'nswe' });
  K.hubbas.push({ a: V(600, -40.3, 1200), b: V(600, -41.0, 1195), w: 16, noRails: true, color: 0x55595e });
  // superstructure on a K.B (terrainH is the sea bed here), wings, funnel, name board
  K.B(590, -41.0, 1286, 610, -27.4, 1302, 'building', { color: 0xe8e6e0, tex: 'office' });
  K.prop(587.6, -29.7, 1288, 590, -29.3, 1292, 0xe8e6e0); K.prop(610, -29.7, 1288, 612.4, -29.3, 1292, 0xe8e6e0);
  K.prop(598, -27.4, 1294, 602, -21.4, 1298, 0xb8402e);
  K.decorFns.push(D => D.sign('CORVINA', 600, -30.0, 1285.95, 9, 1.4, Math.PI, '#f2ead8', '#2e3f5c'));
  // forecastle, windlass, converging bow rails
  K.hubbas.push({ a: V(600, -39.6, 1312), b: V(600, -41.0, 1304), w: 22, noRails: true, color: NAVY });
  K.B(589, -41.0, 1312, 611, -39.6, 1336, 'metal', { color: NAVY, edges: 'n' });
  K.B(596, -39.6, 1320, 604, -38.95, 1324, 'metal', { color: 0x55595e, edges: 'nswe' });
  K.rail(589.6, -38.8, 1312, 599, -38.8, 1335, 'Rail', true);
  K.rail(610.4, -38.8, 1312, 601, -38.8, 1335, 'Rail', true);
  // mooring lines from the bollards
  K.decorFns.push(D => {
    const g = new THREE.CylinderGeometry(0.07, 0.07, 1, 5), up = V(0, 1, 0);
    for (const [ax, ay, az, bx, by, bz] of [[618, -43.4, 1178, 613, -41.6, 1190], [630, -43.4, 1178, 613, -41.6, 1300], [642, -43.4, 1178, 613, -41.6, 1334]]) {
      const a = V(ax, ay, az), b = V(bx, by, bz), d = b.clone().sub(a), len = d.length(), m = a.clone().add(b).multiplyScalar(0.5);
      const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(up, d.normalize()));
      D.add(g, 0x3a3228, [m.x, m.y, m.z], [e.x, e.y, e.z], [1, len, 1]);
    }
  });
  P.tape(600, 1333, -39.6);
  P.spot('The Corvina', 600, -41.0, 1192, Math.PI, [587, 1160, 613, 1336]);
  P.travel('The Corvina', 600, -41.0, 1194, Math.PI, 'spot');
  P.challenge({ id: 'ship-ship-rail', name: "Ship's Rail", desc: "Grind the Corvina's side rail", kind: 'grind', rail: 'Rail',
    at: [587.6, -40.2, 1240], go: [600, -41.0, 1190, Math.PI], area: [586.8, 1188, 613.2, 1310] });
  P.challenge({ id: 'ship-hatch-tre', name: '360 Flip the Hatches', desc: '360 flip from the first cargo hatch to the second', kind: 'trick', tricks: ['360 Flip'], hard: true,
    at: [600, -40.3, 1215.7], go: [600, -41.0, 1190, Math.PI], from: [592, 1200, 608, 1214, -40.6, -40.0], to: [592, 1217.5, 608, 1231.5, -40.6, -40.0] });
}

/* the hill toe for z >= 1112: chain-link and trees */
function ship_quay_toe(K, P, PL) {
  const th = K.terrainH;
  K.B(958, Math.min(th(958, 1112), th(958, 1140)) - 0.2, 1112, 958.1, Math.max(th(958, 1112), th(958, 1140)) + 2.4, 1140, 'fence', { edges: '' });
  K.tree(970, 1124); K.tree(986, 1136);
}

/* small things from the filler menu so no street goes dead: ledges, benches, planters, pads, jerseys, crates, roadworks */
function ship_quay_filler(K, P, PL) {
  const th = K.terrainH;
  const blk = (x0, z0, x1, z1, h, mat, edges, lift) => {
    const g = Math.max(th(x0, z0), th(x1, z0), th(x0, z1), th(x1, z1)) + lift, lo = Math.min(th(x0, z0), th(x1, z0), th(x0, z1), th(x1, z1));
    return K.B(x0, lo - 0.4, z0, x1, g + h, z1, mat, { edges });
  };
  const bits = (list) => {
    for (const [c, x, z, lift = 0] of list) {
      const B = (x0, z0, x1, z1, h, mat, edges) => blk(x0, z0, x1, z1, h, mat, edges, lift);
      if (c === 'b') B(x - 2, z, x + 2, z + 0.6, 0.45, 'wood', 'ns');
      else if (c === 'p') B(x - 2, z, x + 2, z + 1.4, 0.55, 'ledge', 'ns');
      else if (c === 'l') B(x - 3, z, x + 3, z + 0.6, 0.45, 'ledge', 'ns');
      else if (c === 'd') B(x - 3, z, x + 3, z + 2.4, 0.18, 'pad', 'ns');
      else if (c === 'w') B(x, z, x + 1.2, z + 1.2, 0.6, 'wood', '');
      else if (c === 'k') B(x, z, x + 1.8, z + 1.2, 0.9, 'wood', '');
      else if (c === 'j') B(x - 3, z, x + 3, z + 0.6, 0.8, 'ledge', 'ns');
      else if (c === 'v') B(x - 0.3, z - 3, x + 0.3, z + 3, 0.45, 'ledge', 'ew');
      else if (c === 'q') B(x - 1.2, z - 3, x + 1.2, z + 3, 0.18, 'pad', 'nswe');
      else if (c === 'c') K.construction(x, z, true);
    }
  };
  bits([
    // Quay Road, north sidewalk (z 1112..1115) and south sidewalk (z 1125..1128); the sidewalk tops are 0.15 over the bench
    ['d', 640, 1112.3, 0.15], ['l', 668, 1112.3, 0.15], ['p', 696, 1112.3, 0.15], ['b', 724, 1112.3, 0.15], ['l', 750, 1112.3, 0.15],
    ['l', 790, 1112.3, 0.15], ['d', 818, 1112.3, 0.15], ['p', 846, 1112.3, 0.15], ['l', 874, 1112.3, 0.15], ['b', 902, 1112.3, 0.15],
    ['l', 654, 1125.3, 0.15], ['p', 690, 1125.3, 0.15], ['l', 706, 1125.3, 0.15], ['d', 738, 1125.3, 0.15], ['b', 752, 1125.3, 0.15],
    ['l', 794, 1125.3, 0.15], ['p', 812, 1125.3, 0.15], ['l', 828, 1125.3, 0.15], ['d', 858, 1125.3, 0.15], ['b', 872, 1125.3, 0.15], ['l', 896, 1125.3, 0.15], ['p', 910, 1125.3, 0.15],
    // Crane Quay, between the carriers and the crane legs
    ['d', 632, 1144], ['l', 656, 1144], ['p', 676, 1144], ['d', 712, 1144], ['l', 736, 1144], ['j', 760, 1144],
    ['d', 812, 1144], ['l', 836, 1144], ['p', 862, 1144], ['d', 912, 1144], ['l', 932, 1144],
    // crates by the tables and along the apron
    ['k', 622, 1160], ['w', 624, 1162.4], ['k', 660, 1166], ['w', 704, 1166], ['k', 770, 1156], ['w', 772, 1158.4], ['k', 868, 1162], ['w', 930, 1164],
    // Gantry Road: pocket furniture on the sidewalks, clear of the bomb lane
    ['v', 591, 1140, 0.15], ['v', 609, 1148, 0.15], ['v', 591, 1158, 0.15], ['v', 609, 1164, 0.15],
  ]);
  // a roadworks pocket on the apron east of the cranes and one by the first crane
  K.construction(660, 1150, true);
  K.construction(928, 1152, true);
  // jersey line to ollie along the east end of the quay
  K.strip(905, 1168, 940, 1168, 0.45, 0.6, { kind: 'Ledge', color: 0xa9a59c });
}

/* what you see from the hills: the cranes and the ship */
function ship_quay_landmarks(K, P, PL) {
  const parts = [];
  for (const [dx, c] of [[-100, 0xc8402e], [0, 0xd2a12a], [100, 0x3d6a9a]]) {
    for (const sx of [-8.9, 8.9]) {                                   // four legs and the portal beam over each pair (not a solid wall)
      for (const sz of [-14, 14]) parts.push({ shape: 'box', at: [dx + sx, 15, sz], size: [1.6, 30, 1.6], color: c });
      parts.push({ shape: 'box', at: [dx + sx, 27.5, 0], size: [1, 2.5, 29.6], color: c });
    }
    parts.push({ shape: 'box', at: [dx, 33.3, 16], size: [2.4, 2.2, 128], color: c });   // the boom, z 1112..1240 like the real one
  }
  parts.push({ shape: 'box', at: [0, 40, 0], size: [1.2, 8, 1.2], color: 0xd2a12a });
  P.landmark({ at: [790, -44, 1160], near: 160, parts });
  P.landmark({ at: [600, -46, 1261], near: 140, parts: [
    { shape: 'box', at: [0, 2.5, 0], size: [26, 5, 150], color: 0x2e3f5c },
    { shape: 'box', at: [0, 11.8, 33], size: [20, 13.6, 16], color: 0xe8e6e0 },
    { shape: 'cyl', at: [0, 21, 35], size: [4, 6, 4], color: 0xb8402e } ] });
}

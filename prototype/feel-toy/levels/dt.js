/* Downtown: 240 m square, nine blocks on two avenues and two streets, and no dead space.
   Every block is a spot, every sidewalk is lined with things to skate, and the spots are laid out
   in lines that run from one block across the street into the next:
     north-south  roll in off the rooftops > across the street > bank up into Central Plaza > off the
                  Big Four gap > the fountain bowl > across into the courthouse plaza
     east-west    drop in off the DIY quarterpipe under the overpass > kickers > across the avenue >
                  bank up onto the plaza deck > down the west stairs > across > the bank plaza
   The blocks sit at sidewalk height; only the roads are lower, so curbs face the road and nothing else.
   Returns the named spots (for the jump list and the challenges). */
function buildDowntown(K) {
  const { R, pick, col, boxes, hubbas, rails, hazards, fine, decorFns, feat, terrainH, poolS, pool, hump,
    B, Bg, building, rail, cone, pothole, kicker, stairSpot, SET, lip, ledge, planter, pad, bench, tree, lamp,
    paintRect, dash, zebra, car, fountainBowl, prop, sit, newsBoxes, trashCan, hydrant, bikeRack, busStop,
    dumpster, jersey, parkingBlock, picnic, meter, driveway } = K;
  const G = 0.15, AV = [-40, 40], ST = [-40, 40], RW = 4, SW = 5, E = 120;
  const inRoad = (x, z) => AV.some(a => Math.abs(x - a) < RW) || ST.some(c => Math.abs(z - c) < RW);
  // blocks and sidewalks up, roads down; the step is a slope hidden under the sidewalk boxes, never a cliff
  const roadDist = (x, z) => Math.min(...AV.map(a => Math.abs(x - a) - RW), ...ST.map(c => Math.abs(z - c) - RW));
  feat(-E, E, -E, E, (x, z) => G * clamp(roadDist(x, z), 0, 1), 'set');
  fine.push({ x0: -E - 8, x1: E + 8, z0: -E - 8, z1: E + 8, res: 1 });     // a little past the blocks, so the step down to the boulevards is drawn where it is
  const CLEAR = [];                                                           // where lines cross: keep the furniture out
  const clearRect = (x0, z0, x1, z1) => CLEAR.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]);
  const isClear = (x0, z0, x1, z1) => !CLEAR.some(([a, b, c, d]) => x1 > a && x0 < c && z1 > b && z0 < d);
  const top = (y, x0, z0, x1, z1, hgt, mat = 'marble', edges) => B(x0, y - 0.3, z0, x1, y + hgt, z1, mat, { edges: edges ?? (Math.abs(x1 - x0) > Math.abs(z1 - z0) ? 'ns' : 'ew') }); // on a podium
  const spots = [];
  K.shops = [null];                                                           // the corner shop goes first
  const spot = (name, x, y, z, yaw, area) => spots.push({ name, pos: V(x, y, z), yaw, area });

  /* ---------- the streets ---------- */
  // axis 'z': an avenue running north-south at x = c; axis 'x': a street running east-west at z = c
  const XY = (axis, u, v) => axis === 'z' ? [v, u] : [u, v];
  function road(axis, c, cross) {
    const [rx0, rz0] = XY(axis, -E, c - RW), [rx1, rz1] = XY(axis, E, c + RW);
    paintRect(rx0, rz0, rx1, rz1, 0x56585d, 0.006); K.roads.push([Math.min(rx0, rx1), Math.min(rz0, rz1), Math.max(rx0, rx1), Math.max(rz0, rz1)]);
    for (let u = -E + 2; u < E - 3; u += 6) if (!cross.some(k => u + 3 > k - RW - 2 && u < k + RW + 2)) { const [a, b] = XY(axis, u, c), [a2, b2] = XY(axis, u + 3, c); dash(a, b, a2, b2); }
    const segs = [[-E, cross[0] - RW], [cross[0] + RW, cross[1] - RW], [cross[1] + RW, E]];
    for (const side of [-1, 1]) for (const [u0, u1] of segs) {
      const v0 = c + side * RW, v1 = c + side * (RW + SW), edge = axis === 'z' ? (side < 0 ? 'e' : 'w') : (side < 0 ? 's' : 'n');
      const [x0, z0] = XY(axis, u0, Math.min(v0, v1)), [x1, z1] = XY(axis, u1, Math.max(v0, v1));
      boxes.push(box(x0, -0.6, z0, x1, G, z1, 'sidewalk', { edges: edge }));
      for (const [end, d] of [[u0, -1], [u1, 1]]) if (Math.abs(end) < E - 1) {             // curb ramps into each crossing
        const vm = c + side * (RW + SW / 2), [ax, az] = XY(axis, end, vm), [bx, bz] = XY(axis, end + d * 1.4, vm);
        hubbas.push({ a: V(ax, G, az), b: V(bx, 0.01, bz), w: 2.6, noRails: true, color: 0xb9b5ab });
        const [cx0, cz0] = XY(axis, end - d * 2, vm - 1.6), [cx1, cz1] = XY(axis, end, vm + 1.6); clearRect(cx0, cz0, cx1, cz1);
      }
      for (let u = u0 + 8; u < u1 - 4; u += 24) { const [lx, lz] = XY(axis, u, c + side * (RW + 0.35)); decorFns.push(D => D.lamp(lx, G, lz, side)); }
    }
  }
  for (const a of AV) road('z', a, ST);
  for (const c of ST) road('x', c, AV);
  for (const a of AV) for (const c of ST) for (const s of [-1, 1]) { zebra(a, c + s * (RW + SW / 2), 'x', 6); zebra(a + s * (RW + SW / 2), c, 'z', 6); }
  // a crossing where a line goes over the street: ramps up both curbs, a crosswalk, and nothing in the way
  function crossing(axis, c, u, w = 3.2) {
    for (const side of [-1, 1]) driveway(axis, c, side, u, RW, w);
    const [x0, z0] = XY(axis, u - w / 2 - 0.6, c - RW - SW), [x1, z1] = XY(axis, u + w / 2 + 0.6, c + RW + SW); clearRect(x0, z0, x1, z1);
    for (let i = -2; i <= 2; i++) { const [a, b] = XY(axis, u + i * 0.62, c - RW + 0.3), [a2, b2] = XY(axis, u + i * 0.62, c + RW - 0.3); dash(a, b, a2, b2, 0xf0ece2, 0.32); }
  }
  // the lines, and where they go over
  crossing('x', -40, 22); crossing('x', -40, -26); crossing('x', -40, -85); crossing('x', -40, 70);
  crossing('x', 40, 0); crossing('x', 40, 20); crossing('x', 40, -62); crossing('x', 40, 85);
  crossing('z', 40, -16); crossing('z', -40, -16); crossing('z', -40, -62); crossing('z', 40, -64);
  crossing('z', 40, 70); crossing('z', -40, 72); crossing('z', -40, 94); crossing('x', 40, -92); crossing('z', -40, 10); crossing('z', 40, 14);

  // the sidewalks: driveways now and then, and a line of furniture a metre in from the curb
  const KINDS = ['bench', 'planter', 'news', 'trash', 'rack', 'tree', 'tree', 'hydrant', 'bus', 'ledge', 'pad', 'meters', 'dumpster'];
  function furnish(axis, c, side, u0, u1, kinds = KINDS) {
    const vf = c + side * (RW + 1.0), across = axis === 'z';            // 'across' true: things lie along z
    for (let u = u0 + 14; u < u1 - 8; u += R(20, 30)) {                // driveways: get on and off, or kick off them
      const [x0, z0] = XY(axis, u - 2, c - side * 0), [x1, z1] = XY(axis, u + 2, c + side * (RW + SW));
      if (isClear(Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1))) { driveway(axis, c, side, u, RW, 3); clearRect(x0, z0, x1, z1); }
    }
    let u = u0 + 3;
    while (u < u1 - 3) {
      const kind = pick(kinds), len = kind === 'bench' || kind === 'ledge' ? 3 : kind === 'bus' ? 4.6 : kind === 'pad' ? 3.4 : kind === 'rack' ? 2.6 : kind === 'dumpster' ? 2.2 : 1.4;
      const v = kind === 'dumpster' || kind === 'pad' ? c + side * (RW + SW - 1.2) : kind === 'bus' ? c + side * (RW + 1.4) : vf;
      const [xa, za] = XY(axis, u, v - 1), [xb, zb] = XY(axis, u + len, v + 1);
      if (isClear(Math.min(xa, xb), Math.min(za, zb), Math.max(xa, xb), Math.max(za, zb))) {
        const m = u + len / 2, [x, z] = XY(axis, m, v);
        if (kind === 'bench') across ? bench(x - 0.3, z - 1.4, x + 0.3, z + 1.4) : bench(x - 1.4, z - 0.3, x + 1.4, z + 0.3);
        else if (kind === 'planter') { planter(x - 0.7, z - 0.7, x + 0.7, z + 0.7, 0.55); tree(x, z); }
        else if (kind === 'news') newsBoxes(x, z, !across, pick([2, 3]));
        else if (kind === 'trash') trashCan(x, z);
        else if (kind === 'rack') bikeRack(x, z, !across, 2.4);
        else if (kind === 'tree') { tree(x, z); const [g0x, g0z] = XY(axis, m - 0.6, v - 0.6), [g1x, g1z] = XY(axis, m + 0.6, v + 0.6); paintRect(g0x, g0z, g1x, g1z, 0x4a4c51, G + 0.008); }
        else if (kind === 'hydrant') hydrant(x, z);
        else if (kind === 'bus') busStop(x, z, !across, -side * 0 + side);
        else if (kind === 'ledge') across ? ledge(x - 0.3, z - 1.4, x + 0.3, z + 1.4, 0.42, 'marble') : ledge(x - 1.4, z - 0.3, x + 1.4, z + 0.3, 0.42, 'marble');
        else if (kind === 'pad') across ? pad(x - 0.8, z - 1.6, x + 0.8, z + 1.6, 0.2) : pad(x - 1.6, z - 0.8, x + 1.6, z + 0.8, 0.2);
        else if (kind === 'meters') for (let k = 0; k < 3; k++) { const [mx, mz] = XY(axis, u + k * 0.6, vf - side * 0.4); meter(mx, mz); }
        else if (kind === 'dumpster') dumpster(x, z, !across);
        clearRect(Math.min(xa, xb), Math.min(za, zb), Math.max(xa, xb), Math.max(za, zb));
      }
      u += len + R(3, 7);
    }
  }
  // parked cars along one curb of each road, with gaps
  function parkCars(axis, c, side, u0, u1) {
    for (let u = u0 + 6; u < u1 - 6; u += R(6, 11)) {
      const v = c + side * (RW - 1.1), [x0, z0] = XY(axis, u - 2.4, c + side * RW - 0.2), [x1, z1] = XY(axis, u + 2.4, c + side * (RW + 1));
      if (!isClear(Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)) || rnd2() < 0.35) continue;
      const [x, z] = XY(axis, u, v); car(x, z, axis === 'x', 0); u += 4.6;
    }
  }
  let s2 = 77; const rnd2 = () => { s2 = (s2 * 1103515245 + 12345) >>> 0; return s2 / 4294967296; };

  /* ---------- the blocks (x / z: west -120..-49, middle -31..31, east 49..120) ---------- */
  const H = (x, z) => terrainH(x, z);

  { // ROOFTOPS (middle north): push up the garage ramp, gap roof to roof, roll in off the last one
    hubbas.push({ a: V(-26, G + 7, -100), b: V(-26, G + 0.02, -62), w: 6, color: 0x9b9a95 });       // the garage ramp, climbing north
    B(-30, G - 1, -118, -23, G + 7, -100, 'garage');
    B(-23, G - 1, -118, -4, G + 7, -66, 'garage', { edges: 'es' });                                 // the top deck
    B(-30, G + 7, -118, -4, G + 8.1, -117.6, 'garage'); B(-30, G + 7, -117.6, -29.6, G + 8.1, -100, 'garage');  // parapets at the back
    for (let x = -21; x < -6; x += 3.2) for (const z of [-114, -106]) B(x, G + 7, z, x + 1.8, G + 7.16, z + 0.3, 'ledge', { edges: 'ns' }); // parking blocks
    hubbas.push({ a: V(-4.3, G + 7.55, -100), b: V(-6.7, G + 7.02, -100), w: 1.4, noRails: true, color: 0xc49a5c }); // ply on the deck, aimed at the gap
    B(-14, G + 7, -84, -8, G + 7.5, -80, 'ledge', { edges: 'nswe' });                               // a planter on the deck
    B(-1, G - 1, -116, 12, G + 6.1, -92, 'building', { color: 0x9b5a46, tex: 'brick', edges: 'wns' });  // roof A: a 3 m gap
    B(15, G - 1, -116, 29, G + 5.1, -96, 'building', { color: 0xb9a88f, tex: 'brick', edges: 'wn' });   // roof B: another 3 m gap
    B(4, G + 6.1, -110, 6, G + 6.9, -104, 'metal'); B(22, G + 5.1, -112, 26, G + 5.6, -109, 'ledge', { edges: 'nswe' }); // a vent, a skylight curb
    hubbas.push({ a: V(22, G + 5.1, -96), b: V(22, G + 0.02, -85), w: 12, noRails: true, color: 0xb9b3a8 }); // the roll-in: a big bank off roof B
    B(-4, G - 1, -120, 31, G + 12, -116.5, 'building', { color: 0x7f8a92, tex: 'office' });             // the building behind
    // the plaza at the bottom of the roll-in: ledges and a pad to the side, the run out straight to the street
    ledge(2, -82, 2.6, -64, 0.45, 'marble'); ledge(7, -80, 7.6, -62, 0.55, 'marble'); pad(10, -60, 14, -53, 0.2);
    planter(-1, -88, 3, -85, 0.6); tree(1, -86.5); bench(29.4, -80, 30.4, -72);
    // the garage exit: a gate arm to grind, parking blocks, the ticket booth
    rail(-21, G + 1.0, -58, -15, G + 1.0, -58, 'Rail', false); B(-14.6, G - 0.4, -59, -13, G + 2.3, -57, 'building', { color: 0xd8d2c4, tex: 'stone' });
    for (let x = -10; x < 0; x += 3.2) parkingBlock(x, -54, true);
    spot('Rooftops', -14, G + 7, -110, -Math.PI / 2, [-31, -120, 31, -49]);
  }

  { // CENTRAL PLAZA (middle): a raised deck with a bank up on to it, stairs down the west, the Big Four
    //   gap off the south edge, and a lower plaza of ledges round a drained fountain bowl
    const T = G + 1.5;
    B(-26, G - 1, -27, 26, T, -6, 'marble', { edges: 'new' });
    hubbas.push({ a: V(19, T, -27), b: V(19, G + 0.02, -31), w: 14, noRails: true, color: 0xc4bfb3 });   // the bank up from the north
    hubbas.push({ a: V(26, T, -16), b: V(30.6, G + 0.02, -16), w: 12, noRails: true, color: 0xc4bfb3 }); // the bank off the east side
    stairSpot('x', -26, -1, -22, -10, T, G, 5, 0.4, { rails: [-22.45, -9.55] });                        // the west stairs
    stairSpot('z', -6, 1, -6, 6, T, G, 5, 0.42, { rails: [0], hubbas: [-6.4, 6.4] });                     // the Big Four
    lip(-26, -6, -6.75, -6, T); lip(6.75, -6, 26, -6, T);                                                  // ...and the gap all along the edge
    top(T, -22, -21, -6, -20.4, 0.5); top(T, 2, -14, 10, -13.4, 0.45); top(T, -4, -24, 0, -20, 0.6, 'ledge', 'nswe');
    B(14, T - 0.3, -24.4, 18, T + 0.45, -23.8, 'wood', { edges: 'ns' });
    // the lower plaza
    fountainBowl(0, 15, 5.5, 1.4);
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + 0.5, bx = Math.cos(a) * 9, bz = 15 + Math.sin(a) * 9;
      if (Math.abs(bx) < 4 && bz < 15) continue; bench(bx - 1.2, bz - 0.3, bx + 1.2, bz + 0.3); }
    ledge(-24, 4, -10, 4.6, 0.5, 'marble'); ledge(10, 4, 24, 4.6, 0.5, 'marble');
    ledge(-22, 12, -21.4, 24, 0.45); ledge(21.4, 12, 22, 24, 0.45);
    pad(-18, 26, -10, 29, 0.22); pad(10, 26, 18, 29, 0.22);
    rail(-28, G + 0.4, 9, -28, G + 0.4, 24, 'Rail');
    for (const [x, z] of [[-28, -2], [28, -2], [-28, 28], [28, 28]]) { planter(x - 1.2, z - 1.2, x + 1.2, z + 1.2, 0.6); tree(x, z); }
    spot('Central Plaza', 19, T, -22, Math.PI, [-31, -31, 31, 31]);
  }

  { // COURTHOUSE (middle south): a podium with an eight-stair down the front, rails and hubbas, a bank off the end
    const T = G + 2.4;
    building(-26, 96, 26, 118, 6, 0xd8d2c4, 'stone');
    B(-30, G - 1, 80, 30, T, 88, 'marble', { edges: 'ew' }); B(-26, G - 1, 88, 30, T, 96, 'marble', { edges: 'e' }); B(-30, G - 1, 88, -26, T, 90.4, 'marble');
    stairSpot('z', 80, -1, -10, 10, T, G, 8, 0.42, { rails: [-3.5, 3.5], hubbas: [-10.4, 10.4] });
    hubbas.push({ a: V(-24, T, 80), b: V(-24, G + 0.02, 73), w: 8, noRails: true, color: 0xc4bfb3 });
    hubbas.push({ a: V(-26, T, 93.2), b: V(-31, G + 0.02, 93.2), w: 5.6, noRails: true, color: 0xc4bfb3 });   // a bank up the west end, off the park stairs
    lip(-30, 80, -28.05, 80, T); lip(-19.95, 80, -10.75, 80, T); lip(10.75, 80, 30, 80, T);
    top(T, 14, 86, 26, 86.6, 0.45); top(T, -16, 90, -10, 90.6, 0.45, 'wood');
    // the plaza in front: a bump to bar, a flat bar, benches
    hubbas.push({ a: V(-14, G + 0.5, 62), b: V(-14, G + 0.02, 59.5), w: 2.2, noRails: true, color: 0xc4bfb3 });
    rail(-14, G + 0.55, 62.4, -14, G + 0.55, 68, 'Rail');
    rail(-6, G + 0.42, 56, 6, G + 0.42, 56, 'Rail');                           // a flat bar in the run-out of the eight
    ledge(12, 60, 12.6, 72, 0.48, 'marble'); bench(12, 52, 16, 52.6);
    for (const x of [-16.5, 16.5]) for (const z of [53, 64, 75]) tree(x, z);
    spot('Courthouse', 0, T, 90, 0, [-31, 49, 31, 120]);
  }

  { // LIBRARY (west north): a six-stair with three rails, a hubba and a bank, then a sunken court to drop into
    const T = G + 1.8;
    building(-116, -118, -56, -98, 5, 0xcfc4ad, 'stone');
    B(-112, G - 1, -98, -60, T, -88, 'marble', { edges: 'ew' });
    stairSpot('z', -88, 1, -96, -80, T, G, 6, 0.42, { rails: [-96.45, -88, -79.55], hubbas: [-78.6], bank: [-76, -66] });
    lip(-112, -88, -96.95, -88, T); lip(-65.95, -88, -60, -88, T);
    top(T, -110, -95, -100, -94.4, 0.45);
    // the sunken court: straight walls to drop off, stairs down the north side, a bank out of the south
    const cx = -85, cz = -66, hw = 13, hd = 8, D = 1.8, f = G - D;
    feat(cx - hw, cx + hw, cz - hd, cz + hd, () => f, 'set'); fine.push({ x0: cx - hw - 1, x1: cx + hw + 1, z0: cz - hd - 1, z1: cz + hd + 1, res: 0.5 });
    stairSpot('z', cz - hd, 1, cx - 4, cx + 4, G, f, 6, 0.4, { rails: [cx - 4.45, cx + 4.45] });
    hubbas.push({ a: V(cx, G, cz + hd), b: V(cx, f + 0.02, cz + hd - 5), w: 2 * hw - 0.2, noRails: true, color: 0xc4bfb3 });
    lip(cx - hw, cz - hd, cx - 4.95, cz - hd, G); lip(cx + 4.95, cz - hd, cx + hw, cz - hd, G);
    lip(cx - hw, cz - hd, cx - hw, cz + hd - 5, G); lip(cx + hw, cz - hd, cx + hw, cz + hd - 5, G);
    B(cx - 10, f - 0.2, cz - 3, cx - 3, f + 0.45, cz - 2.4, 'marble', { edges: 'ns' }); B(cx + 5, f - 0.2, cz - 4, cx + 10, f + 0.2, cz, 'pad', { edges: 'nswe' });
    for (const z of [-110, -100, -80, -60]) bench(-118, z, -117.4, z + 4);
    tree(-114, -84); tree(-114, -64); tree(-56, -84); tree(-56, -64);
    // a skate shop in the west end of the library front, up on the deck
    K.shops.push({ name: 'Library Lane Skates', sign: [-106, T + 3.85, -97.96, 0, 7], awning: [-112, -98, -100, -96.4, T + 2.2], zone: [-111.5, -97.8, -100.5, -95.6], door: [-106, T, -97.8] });
    spot('Library', -88, T, -94, Math.PI, [-120, -120, -49, -49]);
  }

  { // BANK PLAZA (west middle): a marble deck with long ledges, steps and banks off every side, a fountain bowl
    const T = G + 0.9;
    building(-118, -28, -98, 28, 8, 0xb9b5ab, 'stone');
    B(-98, G - 1, -24, -70, T, 24, 'marble', { edges: 'ns' });
    stairSpot('z', -24, -1, -92, -80, T, G, 3, 0.45, { rails: [-86] });
    hubbas.push({ a: V(-91, T, 24), b: V(-91, G + 0.02, 27.5), w: 12, noRails: true, color: 0xc4bfb3 });   // a bank up the south side, off the hill bomb
    hubbas.push({ a: V(-70, T, -16), b: V(-66, G + 0.02, -16), w: 12, noRails: true, color: 0xc4bfb3 });
    stairSpot('x', -70, 1, 0, 12, T, G, 3, 0.45, { rails: [6] });
    lip(-70, -24, -70, -22.05, T); lip(-70, -9.95, -70, -0.05, T); lip(-70, 12.05, -70, 24, T);
    top(T, -94, -14.3, -76, -13.7, 0.55); top(T, -94, 13.7, -76, 14.3, 0.55); top(T, -96, -4, -92, 4, 0.6, 'ledge', 'nswe');
    fountainBowl(-58, 0, 5, 1.6);
    bench(-62, -12, -54, -11.4); bench(-62, 11.4, -54, 12); pad(-66, -29, -56, -26, 0.2); pad(-66, 26, -56, 29, 0.2);
    // and one in the bank building, its door on to the south end of the deck
    K.shops.push({ name: 'Bank Street Boards', sign: [-97.96, T + 3.85, 19.5, Math.PI / 2, 7], awning: [-98, 13.5, -96.4, 25.5, T + 2.2, 'x'], zone: [-97.8, 15.2, -94.6, 23.6], door: [-97.8, T, 19.5] });
    spot('Bank Plaza', -84, T, 0, -Math.PI / 2, [-120, -31, -49, 31]);
  }

  { // OFFICE (east north): a double set with rails, a ten-stair hubba, a bank to wall, a line of ledges
    const T = G + 3;
    building(82, -118, 118, -92, 14, 0x6f8fa8, 'office'); building(52, -118, 80, -100, 5, 0x7f8a92, 'office');
    B(52, G - 1, -92, 118, T, -82, 'marble', { edges: 'ew' }); B(52, G - 1, -100, 80, T, -92, 'marble');
    stairSpot('z', -82, 1, 62, 74, T, G + 1.5, 5, 0.42, { rails: [61.55, 74.45] });
    B(60, G - 1, -80.32, 76, G + 1.5, -76, 'marble', { edges: 'ew' });
    stairSpot('z', -76, 1, 62, 74, G + 1.5, G, 5, 0.42, { rails: [61.55, 74.45] });
    stairSpot('z', -82, 1, 96, 104, T, G, 10, 0.4, { hubbas: [95.6, 104.4] });
    lip(52, -82, 61.05, -82, T); lip(74.95, -82, 95.25, -82, T); lip(104.75, -82, 118, -82, T);
    K.bankToWall(50, -62, 60, 1.4, 4);
    for (const [x0, x1] of [[78, 90], [94, 104], [108, 116]]) ledge(x0, -56.6, x1, -56, 0.45, 'marble');
    top(T, 84, -88, 96, -87.4, 0.45); planter(112, -78, 116, -74, 0.6); tree(114, -76);
    spot('Office', 68, T, -88, Math.PI, [49, -120, 120, -49]);
  }

  { // DIY UNDER THE OVERPASS (east middle): a quarterpipe to drop in off, kickers in a line west, a pyramid,
    //   a hip, a bank to wall; a car park with parking blocks south of it
    decorFns.push(D => D.overpass(49, 120, -4, 8, 8.6));
    for (const x of [54, 88]) B(x - 0.7, G - 0.5, -3, x + 0.7, 8.0, 7, 'plaza');
    const q0 = 106, qr = 2.6, qd = 2.4, qtop = G + arc(qd, qr, qd);
    feat(q0, 116, -24, 2, (x) => x <= q0 ? G : G + arc(x - q0, qr, qd), 'set'); fine.push({ x0: q0 - 1, x1: 117, z0: -25, z1: 3, res: 0.25 });
    rails.push({ a: V(q0 + qd, qtop, -24), b: V(q0 + qd, qtop, 2), kind: 'Coping', coping: true });
    B(116, G - 0.5, -26, 118, G + 3.2, 4, 'plaza');
    hubbas.push({ a: V(87.6, G + 0.6, -16), b: V(90, G + 0.02, -16), w: 1.4, noRails: true, color: 0xc49a5c }); // ply on a pallet, aimed west
    pad(70, -18, 76, -14, 0.25);
    hubbas.push({ a: V(55.6, G + 0.55, -16), b: V(58, G + 0.02, -16), w: 1.4, noRails: true, color: 0xc49a5c });
    // pyramid
    B(78, G - 1, 0, 82, G + 1.0, 4, 'plaza', { edges: 'nswe' });
    for (const [ax, az, bx, bz] of [[80, 0, 80, -3], [80, 4, 80, 7], [78, 2, 75, 2], [82, 2, 85, 2]]) hubbas.push({ a: V(ax, G + 1, az), b: V(bx, G + 0.02, bz), w: 4, noRails: true, color: 0xb9b3a8 });
    // a hip
    hubbas.push({ a: V(64, G + 1.2, 2), b: V(60, G + 0.02, 2), w: 6, noRails: true, color: 0xb9b3a8 }, { a: V(64, G + 1.2, 2), b: V(68, G + 0.02, 2), w: 6, noRails: true, color: 0xb9b3a8 });
    // bank to wall
    hubbas.push({ a: V(95, G + 1.5, 8), b: V(95, G + 0.02, 4), w: 10, noRails: true, color: 0xb9b3a8 }); B(90, G - 1, 8, 100, G + 2.6, 10, 'plaza', { edges: 'n' });
    rail(98, G + 0.5, -8, 108, G + 0.5, -8, 'Pipe', false); prop(99, G, -8.3, 99.6, G + 0.5, -7.7, 0x8a8f94); prop(107, G, -8.3, 107.6, G + 0.5, -7.7, 0x8a8f94);
    jersey(60, 11.6, 66, 12.4); jersey(68, 11.6, 74, 12.4); jersey(100, 11.6, 106, 12.4);
    for (let x = 54; x < 116; x += 3.2) { parkingBlock(x, 18, false); parkingBlock(x, 27, false); }
    for (const x of [62, 82, 102]) { planter(x - 0.7, 21.8, x + 0.7, 23.2, 0.7); decorFns.push(D => D.lamp(x, G + 0.7, 22.5, 1)); }
    for (const x of [57.2, 76.4, 92.4, 111.6]) car(x, 22.5, false, G);
    for (const [x, z] of [[96, -20], [97, -22], [60, 6]]) cone(x, z);
    spot('DIY', 111, qtop, -16, Math.PI / 2, [49, -31, 120, 31]);
  }

  { // HILL PARK (west south): a grass knoll to bomb, an overlook on top, a railed stairway down the east face,
    //   picnic tables and a court at the bottom
    hump(-92, 94, 26, 6); fine.push({ x0: -120, x1: -64, z0: 66, z1: 120, res: 0.5 });
    const ht = H(-92, 94);
    B(-97, ht - 1.2, 89, -87, ht + 0.3, 99, 'plaza', { edges: 'nswe' }); bench(-96, 97, -92, 97.6); bench(-91, 90.4, -88, 91);
    let x = -86, tp = H(x, 94) + 0.3; K.hillStairTop = tp;
    B(-87.2, tp - 1.5, 91.4, x, tp, 96.6, 'plaza');
    while (tp > G + 0.4) { const run = 6 * 0.4, bot = Math.max(G, H(x + run + 2.5, 94)); if (tp - bot < 0.45) break;
      SET('x', x, 1, 92, 96, tp, bot, 6, 0.4); rails.push(handrail('x', x, 1, 91.55, tp, bot, 6, 0.4), handrail('x', x, 1, 96.45, tp, bot, 6, 0.4));
      x += run; B(x - 0.3, Math.min(bot, H(x + 2.5, 94)) - 1, 92, x + 2.5, bot, 96, 'plaza'); x += 2.5; tp = bot; }
    for (const [px, pz] of [[-60, 56], [-56, 64], [-60, 72], [-56, 80]]) picnic(px, pz, true);
    paintRect(-66, 100, -50, 118, 0x8a5f45, G + 0.008); dash(-66, 109, -50, 109, 0xf0ece2, 0.12); paintRect(-59, 100, -57, 102, 0xf0ece2, G + 0.01);
    pad(-118, 52, -108, 56, 0.2); for (const z of [60, 70, 80]) tree(-116, z);
    spot('Hill Park', -92, ht + 0.3, 94, -Math.PI / 2, [-120, 49, -49, 120]);
  }

  { // CONSTRUCTION (east south): a corner store with a three-stair, then a fenced site: ply on pallets,
    //   a trench to gap, a dirt pile, a pipe on blocks, a scaffold plank, a slab, a dumpster
    building(52, 52, 70, 62, 2, 0xc98f6b, 'brick');
    // ...which is the skate shop: a sign, an awning, a mat at the door. Stop on the mat to go in.
    K.shop = K.shops[0] = { name: 'Corner Skate Shop', sign: [61, G + 4.75, 62.04, 0, 7], awning: [55, 62, 67, 63.6, G + 3.1], zone: [55.5, 62.3, 66.5, 68], door: [61, G + 0.9, 62.3] };
    B(54, G - 1, 62, 68, G + 0.9, 65, 'plaza', { edges: 'ew' }); SET('z', 65, 1, 58, 64, G + 0.9, G, 3, 0.4); rails.push(handrail('z', 65, 1, 61, G + 0.9, G, 3, 0.4));
    for (const [x0, z0, x1, z1] of [[74, 52, 74.08, 64], [74, 76, 74.08, 118], [74, 52, 90, 52.08], [98, 52, 118, 52.08]]) B(x0, G - 0.1, z0, x1, G + 1.9, z1, 'fence');
    hubbas.push({ a: V(90.4, G + 0.6, 70), b: V(88, G + 0.02, 70), w: 1.4, noRails: true, color: 0xc49a5c });
    feat(92, 94.6, 64, 76, () => G - 1.4, 'set'); fine.push({ x0: 91, x1: 96, z0: 63, z1: 77, res: 0.25 });
    hump(108, 76, 6, 1.8); fine.push({ x0: 100, x1: 116, z0: 68, z1: 84, res: 0.4 });          // the dirt pile, drawn fine enough that you ride on it, not in it
    // a half-built deck on columns: push up the ply ramp, drop off the far edge onto the dirt
    B(100, G + 3.2, 86, 117, G + 3.6, 106, 'plaza', { edges: 'nsw' });
    for (const xx of [101, 108.5, 116]) for (const zz of [87, 96, 105]) B(xx - 0.3, G - 0.2, zz - 0.3, xx + 0.3, G + 3.2, zz + 0.3, 'plaza');
    hubbas.push({ a: V(100, G + 3.6, 98), b: V(86, G + 0.02, 98), w: 3, noRails: true, color: 0xc49a5c });
    B(104, G + 3.6, 100, 112, G + 4.0, 100.6, 'wood', { edges: 'ns' });          // a beam left lying on the deck
    // pallets, stacked, and ply leant on them
    for (const [px, pz, n] of [[80, 74, 1], [84, 80, 2], [96, 112, 3], [110, 112, 1], [116, 60, 2]]) for (let k = 0; k < n; k++) B(px - 0.6, G + k * 0.15, pz - 0.5, px + 0.6, G + (k + 1) * 0.15, pz + 0.5, 'wood', { edges: k === n - 1 ? 'nswe' : '' });
    hubbas.push({ a: V(84, G + 0.5, 82.2), b: V(84, G + 0.02, 84.6), w: 1.2, noRails: true, color: 0xc49a5c });
    for (let k = 0; k < 5; k++) prop(78 + k * 0.4, G, 112, 78.3 + k * 0.4, G + 0.3, 118, 0x5a5048);   // a rebar bundle
    rail(80, G + 0.45, 90, 92, G + 0.45, 90, 'Pipe', false); for (const xx of [80.5, 91]) prop(xx - 0.3, G, 89.7, xx + 0.3, G + 0.45, 90.3, 0x8a8f94);
    B(78, G + 1.0, 108, 92, G + 1.25, 108.6, 'wood', { edges: 'ns' }); for (const xx of [78.3, 85, 91.7]) prop(xx - 0.06, G, 108.2, xx + 0.06, G + 1.0, 108.4, 0x8a8f94);
    pad(100, 56, 116, 70, 0.45); dumpster(110, 82, false); jersey(80, 58, 86, 58.8);
    for (const [cx, cz] of [[100, 76], [101, 78], [80, 96]]) cone(cx, cz);
    spot('Construction', 82, G, 66, -Math.PI / 2, [49, 49, 120, 120]);
  }


  /* ---------- building frontages: a row of buildings set back behind a forecourt with something at each door ---------- */
  function row(x0, z0, x1, z1, face) {
    const along = face === 'n' || face === 's' ? 'x' : 'z', [ua, ub] = along === 'x' ? [x0, x1] : [z0, z1], depth = along === 'x' ? z1 - z0 : x1 - x0;
    const P = (u, w) => face === 'n' ? [u, z0 + w] : face === 's' ? [u, z1 - w] : face === 'w' ? [x0 + w, u] : [x1 - w, u];
    const rect = (u0, w0, u1, w1) => { const [a, b] = P(u0, w0), [c, d] = P(u1, w1); return [Math.min(a, c), Math.min(b, d), Math.max(a, c), Math.max(b, d)]; };
    const sAxis = along === 'x' ? 'z' : 'x', sDir = face === 'n' || face === 'w' ? -1 : 1, edge = face;   // stairs run toward the street
    const wAt = w => along === 'x' ? P(0, w)[1] : P(0, w)[0];
    let u = ua;
    while (u < ub - 6) {
      const wd = Math.min(ub - u, R(11, 19)), m = u + wd / 2, [bx0, bz0, bx1, bz1] = rect(u + 0.3, 3, u + wd - 0.3, depth);
      building(bx0, bz0, bx1, bz1, pick([2, 3, 4, 5, 6, 8]), col(), pick(['brick', 'brick', 'stone', 'office']));
      const kind = wd < 12 ? pick(['plain', 'planters', 'stoop']) : pick(['stoop', 'stoop', 'ramp', 'planters', 'steps', 'cafe']);
      if (kind === 'stoop') {
        const [a, b, c, d] = rect(m - 2, 0.8, m + 2, 3.05); B(a, G - 1, b, c, G + 0.9, d, 'plaza', { edges: edge + (along === 'x' ? 'ew' : 'ns') });
        SET(sAxis, wAt(0.8), sDir, m - 2, m + 2, G + 0.9, G, 3, 0.4); rails.push(handrail(sAxis, wAt(0.8), sDir, m + 2.45, G + 0.9, G, 3, 0.4));
      } else if (kind === 'ramp') {
        const [a, b, c, d] = rect(m - 4, 1.45, m - 1.5, 3.05); B(a, G - 1, b, c, G + 0.6, d, 'plaza', { edges: edge });
        const [ax, az] = P(m - 1.5, 2.25), [bx, bz] = P(m + 4.5, 2.25); hubbas.push({ a: V(ax, G + 0.6, az), b: V(bx, G + 0.02, bz), w: 1.6, noRails: true, color: 0xc4bfb3 });
        const [rx0, rz0] = P(m - 1.5, 1.3), [rx1, rz1] = P(m + 4.4, 1.3); rail(rx0, G + 1.5, rz0, rx1, G + 0.92, rz1, 'Handrail');
      } else if (kind === 'planters') {
        for (let k = u + 1; k < u + wd - 4; k += 6.5) { const [a, b, c, d] = rect(k, 2.1, k + 4.5, 2.95); B(a, G - 0.3, b, c, G + 0.5, d, 'ledge', { edges: 'nswe' }); }
      } else if (kind === 'steps') {
        const [a, b, c, d] = rect(u + 1, 1.2, u + wd - 1, 3.05); B(a, G - 1, b, c, G + 0.6, d, 'marble', { edges: edge });
        SET(sAxis, wAt(1.2), sDir, u + 1, u + wd - 1, G + 0.6, G, 3, 0.6);
      } else if (kind === 'cafe') {
        for (const k of [m - 3, m + 3]) { const [x, z] = P(k, 1.6); picnic(x, z, along === 'x'); }
      } else { const [x, z] = P(m, 1.2); bikeRack(x, z, along === 'x', 2.4); const [tx, tz] = P(m + 3, 1.0); trashCan(tx, tz); }
      u += wd;
    }
  }
  row(-120, -71, -100, -49, 's'); row(-64, -71, -49, -49, 's');                 // round the library's sunken court
  row(-31, 49, -19, 76, 'w'); row(19, 49, 31, 76, 'e');                          // either side of the courthouse forecourt
  row(49, 78, 72, 120, 'w');                                                     // along the avenue by the construction site
  row(106, -74, 120, -49, 'e'); row(-120, 33, -98, 47, 'n');                    // corners

  /* ---------- furnish every sidewalk; park cars ---------- */
  for (const a of AV) for (const side of [-1, 1]) for (const [u0, u1] of [[-E, -44], [-36, 36], [44, E]]) { furnish('z', a, side, u0, u1); }
  for (const c of ST) for (const side of [-1, 1]) for (const [u0, u1] of [[-E, -44], [-36, 36], [44, E]]) { furnish('x', c, side, u0, u1); }
  for (const a of AV) for (const [u0, u1] of [[-E, -44], [-36, 36], [44, E]]) parkCars('z', a, a < 0 ? 1 : -1, u0, u1);
  for (const c of ST) for (const [u0, u1] of [[-E, -44], [-36, 36], [44, E]]) parkCars('x', c, c < 0 ? 1 : -1, u0, u1);
  // the roads: potholes, a manhole or two, a lane closure
  for (const [x, z] of [[-41.5, -95], [38.5, 92], [-12, -41], [70, 41.8], [-95, 38.8], [41.5, -10], [-38.6, 60]]) pothole(x, z);
  for (const z of [26, 29, 32]) cone(-42, z);
  decorFns.push(D => { for (const [x, z] of [[-40, -80], [40, 60], [10, -40], [-70, 40]]) D.manhole(x, z); });

  /* ---------- the paving: each place its own surface, so you can read the city ---------- */
  const C = c => new THREE.Color(c), band = (v, p, w) => ((v % p) + p) % p < w;
  const asph = C(0x6b6d70), side = C(0xc8c4bb), sideJ = C(0xb4b0a7), gran = C(0xc9b9a3), granD = C(0xb3a28b), brick = C(0x9a5e4c), brickD = C(0x86503f),
    grey = C(0xa9a7a2), greyD = C(0x96948f), lightG = C(0xd0ccc4), oily = C(0x8f8c86), grass = C(0x7d9a5b), dirtC = C(0x8f7a5a), court = C(0x8a5f45);
  K.dtCol = (x, z) => {
    if (Math.abs(x) > E || Math.abs(z) > E) return null;
    if (inRoad(x, z)) return asph;
    if (AV.some(a => Math.abs(x - a) < RW + SW) || ST.some(c => Math.abs(z - c) < RW + SW)) return side;
    if (x > -64 && z > 66 && x < -49 && z > 98) return court;
    if (x < -64 && z > 66 && Math.hypot(x + 92, z - 94) < 26) return Math.abs(x + 92) < 1.6 && z < 89 ? lightG : grass;
    if (x < -49 && z > 49) return grass;
    if (x > 74 && z > 52) return dirtC;
    if (x > 49 && z > -31 && z < 31) return oily;
    if (Math.abs(x) < 31 && Math.abs(z) < 31) return band(x, 4, 1) || band(z, 4, 1) ? granD : gran;      // central plaza: big granite pavers
    if (Math.abs(x) < 31 && z < -49 && z > -92) return band(x, 6, 1) ? brickD : brick;           // the rooftop plaza: brick
    if (x < -49 && z < -49) return band(x, 6, 1) || band(z, 6, 1) ? brickD : brick;                     // library
    if (x < -49) return band(x, 5, 1) || band(z, 5, 1) ? greyD : grey;                               // bank plaza: grey granite
    if (Math.abs(x) < 31 && z > 49) return band(z, 4, 1) ? side : lightG;                                    // courthouse forecourt
    return band(x, 5, 1) || band(z, 5, 1) ? sideJ : side;
  };
  K.dtSurface = (x, z) => {
    if (Math.abs(x) > E || Math.abs(z) > E) return null;
    if (inRoad(x, z) || (x > 74 && z > 52) || (x > 49 && z > -31 && z < 31)) return 'rough';
    if (x < -64 && z > 66 && Math.hypot(x + 92, z - 94) < 26 && Math.abs(x + 92) > 1.6) return 'rough';
    return 'smooth';
  };

  /* ---------- grime and paint: oil in the gutters and the parking lane, scuffs and wax, tags on the walls ---------- */
  const stain = (x, y, z, r, a) => decorFns.push(D => D.stain(x, y, z, r, a));
  for (const a of AV) for (const side of [-1, 1]) for (let z = -E + 2; z < E; z += R(2.5, 7)) if (!ST.some(c => Math.abs(z - c) < RW + 1)) stain(a + side * (RW - 0.4), 0, z, R(0.4, 1.0), R(0.15, 0.35));
  for (const c of ST) for (const side of [-1, 1]) for (let x = -E + 2; x < E; x += R(2.5, 7)) if (!AV.some(a => Math.abs(x - a) < RW + 1)) stain(x, 0, c + side * (RW - 0.4), R(0.4, 1.0), R(0.15, 0.35));
  for (const a of AV) for (let z = -E + 4; z < E; z += R(6, 14)) stain(a + (a < 0 ? 1 : -1) * 2.9 + R(-0.4, 0.4), 0, z, R(0.5, 1.1), R(0.25, 0.5));    // oil where cars park
  for (const c of ST) for (let x = -E + 4; x < E; x += R(6, 14)) stain(x, 0, c + (c < 0 ? 1 : -1) * 2.9 + R(-0.4, 0.4), R(0.5, 1.1), R(0.25, 0.5));
  for (let i = 0; i < 220; i++) { const x = R(-E, E), z = R(-E, E); if (!inRoad(x, z)) stain(x, terrainH(x, z), z, R(0.3, 1.4), R(0.06, 0.18)); }  // general wear
  for (const b of boxes) if (/ledge|marble|wood/.test(b.mat) && b.edges && b.max[1] - b.min[1] < 2 && b.max[1] < 4) {   // wax and scuffs along the edges people skate
    const cx = (b.min[0] + b.max[0]) / 2, cz = (b.min[2] + b.max[2]) / 2, lx = b.max[0] - b.min[0], lz = b.max[2] - b.min[2];
    for (let k = 0; k < Math.min(6, Math.max(lx, lz) / 2); k++) { const t = R(-0.45, 0.45); stain(lx > lz ? cx + t * lx : cx, b.max[1], lx > lz ? cz : cz + t * lz, R(0.25, 0.5), R(0.18, 0.35)); }
  }
  const tag = (x, y, z, w, h, rot) => decorFns.push(D => D.tag(x, y, z, w, h, rot));
  tag(115.97, G + 1.7, -19, 5, 2.2, -Math.PI / 2); tag(115.97, G + 1.8, -6, 4, 1.8, -Math.PI / 2);            // the DIY wall
  tag(53.28, G + 2.2, 2, 3.5, 1.8, -Math.PI / 2); tag(54.72, G + 2.6, 2, 3.5, 1.8, Math.PI / 2); tag(88.72, G + 2.4, 2, 3.5, 1.8, Math.PI / 2); tag(87.28, G + 2.0, 2, 3.5, 1.6, -Math.PI / 2); // overpass piers
  tag(95, G + 2.15, 7.97, 6, 0.9, Math.PI);                                                                   // over the bank to wall
  tag(-13.5, G + 3.4, -65.97, 12, 4, 0);                                                                       // the garage wall: a big piece
  tag(51.97, G + 2.6, 57, 6, 2.4, -Math.PI / 2);                                                               // the corner store's side
  tag(-13, G + 9.2, -116.47, 10, 3.4, 0);                                                                      // high on the building behind the roofs
  /* ---------- challenges: a marker at each, a goal to land there ---------- */
  // from / to / area: [x0, z0, x1, z1, yMin, yMax]; trick: a pattern the tricks of that jump must match
  const FLIP = 'flip|shuv|Shove|Impossible|Varial';
  K.challenges = [
    { id: 'garage-gap', name: 'Garage Gap', desc: 'Ollie from the garage deck to the first roof', at: [-6, G + 7, -100], go: [-16, G + 7, -100, -Math.PI / 2], kind: 'gap', from: [-23, -118, -4, -66, G + 6.5], to: [-1, -116, 12, -92, G + 5.5] },
    { id: 'roof-gap', name: 'Rooftop Gap', desc: 'Gap from the first roof to the second', at: [12, G + 6.1, -104], go: [2, G + 6.1, -104, -Math.PI / 2], kind: 'gap', from: [-1, -116, 12, -92, G + 5.5], to: [15, -116, 29, -96, G + 4.5] },
    { id: 'big-four', name: 'Kickflip the Big Four', desc: 'Kickflip down the five-stair off the plaza deck', at: [0, G + 1.5, -8], go: [-3, G + 1.5, -18, Math.PI], kind: 'trick', trick: 'Kickflip', from: [-7, -14, 7, -5.8, G + 1.2], to: [-8, -5.8, 8, 10, -1, G + 0.4] },
    { id: 'plaza-gap', name: 'The Plaza Gap', desc: 'Flip trick off the plaza deck edge', at: [16, G + 1.5, -6], go: [16, G + 1.5, -18, Math.PI], kind: 'trick', trick: FLIP, from: [6.7, -14, 26, -5.8, G + 1.2], to: [6, -5.8, 28, 12, -1, G + 0.4] },
    { id: 'court-eight', name: 'Heelflip the Courthouse Eight', desc: 'Heelflip down the eight-stair', at: [-7, G + 2.4, 80], go: [-7, G + 2.4, 90, 0], kind: 'trick', trick: 'Heelflip', from: [-10, 79.5, 10, 88, G + 2], to: [-11, 60, 11, 77.6, -1, G + 0.5] },
    { id: 'court-rail', name: 'Courthouse Handrail', desc: 'Grind a handrail down the eight', at: [3.5, G + 2.4, 81], go: [3.5, G + 2.4, 90, 0], kind: 'grind', rail: 'Handrail', area: [-4.5, 76, 4.5, 82] },
    { id: 'lib-hubba', name: 'Library Hubba', desc: 'Grind the hubba beside the library six', at: [-78.6, G + 1.8, -88], go: [-78.6, G + 1.8, -95, Math.PI], kind: 'grind', rail: 'Hubba', area: [-80, -89.5, -77.5, -83.5, G + 0.2] },
    { id: 'court-drop', name: 'Into the Court', desc: 'Pop off the rim into the sunken court (not the stairs)', at: [-96, G, -74], go: [-96, G, -84, Math.PI], kind: 'gap', from: [-99, -80, -72, -73.9, G - 0.1], to: [-98, -74, -72, -58, -3, G - 1.2], notIn: [-89.5, -74, -80.5, -71.5] },
    { id: 'diy-coping', name: 'DIY Coping', desc: 'Grind the coping on the quarterpipe under the overpass', at: [108.4, G + 1.6, -10], go: [100, G, -10, -Math.PI / 2], kind: 'grind', rail: 'Coping', area: [107, -25, 110, 3] },
    { id: 'office-ten', name: 'Office Ten Hubba', desc: 'Grind a hubba down the office ten-stair', at: [104.4, G + 3, -82], go: [100, G + 3, -88, Math.PI], kind: 'grind', area: [94.5, -83, 105.5, -77.5, G + 0.2], rail: 'Hubba' },
    { id: 'bank-ledge', name: 'Bank Plaza Ledges', desc: 'Grind one of the long ledges on the bank deck', at: [-85, G + 1.45, -14], go: [-95, G + 0.9, -18, -Math.PI / 2], kind: 'grind', area: [-95, -15, -75, 15, G + 1.2] },
    { id: 'deck-drop', name: 'Half-Built Drop', desc: 'Drop off the half-built deck with a flip', at: [108, G + 3.6, 86], go: [108, G + 3.6, 100, 0], kind: 'trick', trick: FLIP, from: [100, 86, 117, 106, G + 3.2], to: [90, 60, 120, 86, -1, G + 2.5] },
    { id: 'hill-bomb', name: 'Hill Bomb', desc: 'Hit 40 km/h coming down the knoll', at: [-92, G + 6, 86], go: [-92, G + 6.2, 92, 0], kind: 'speed', speed: 40 / 3.6, area: [-112, 44, -70, 92] },
    { id: 'plaza-score', name: 'Own Central Plaza', desc: 'Land a 3,500 point line that starts in Central Plaza', at: [-14, G + 1.5, -24], go: [-14, G + 1.5, -24, Math.PI], kind: 'score', pts: 3500, area: [-31, -31, 31, 31] },
    { id: 'city-score', name: 'Downtown Line', desc: 'Land a 6,000 point line that starts anywhere downtown: any block, plaza or street', at: [-4, G + 1.5, -14], go: [-4, G + 1.5, -12, Math.PI], kind: 'score', pts: 6000, area: [-120, -120, 120, 120] },
    // the hard ones: one per spot, and very particular about it
    { id: 'garage-kf', hard: true, name: 'Kickflip the Garage Gap', desc: 'Kickflip from the garage deck on to the first roof', at: [-6, G + 7, -108], go: [-16, G + 7, -100, -Math.PI / 2], kind: 'trick', tricks: ['Kickflip'], from: [-23, -118, -4, -66, G + 6.5], to: [-1, -116, 12, -92, G + 5.5] },
    { id: 'plaza-tre', hard: true, name: '360 Flip the Plaza Gap', desc: 'A 360 flip off the plaza deck edge', at: [21, G + 1.5, -8], go: [21, G + 1.5, -20, Math.PI], kind: 'trick', tricks: ['360 Flip'], from: [6.7, -14, 26, -5.8, G + 1.2], to: [6, -5.8, 28, 12, -1, G + 0.4] },
    { id: 'court-crook', hard: true, name: 'Crooked the Courthouse Rail', desc: 'Crooked grind (or overcrook) a courthouse handrail', at: [-3.5, G + 2.4, 82], go: [-3.5, G + 2.4, 90, 0], kind: 'grind', rail: 'Handrail', grind: 'Crooked|Overcrook', area: [-4.5, 76, 4.5, 82] },
    { id: 'lib-feeble', hard: true, name: 'Feeble the Library Hubba', desc: 'Feeble grind the library hubba', at: [-78.6, G + 1.8, -92], go: [-78.6, G + 1.8, -96, Math.PI], kind: 'grind', rail: 'Hubba', grind: 'Feeble', area: [-80, -89.5, -77.5, -83.5, G + 0.2] },
    { id: 'bank-line', hard: true, name: 'Bank Plaza Line', desc: 'In one line from the bank plaza: two grinds and a manual, 3,000 points or more', at: [-85, G + 0.9, 2], go: [-95, G + 0.9, 0, -Math.PI / 2], kind: 'line', pts: 3000, area: [-120, -31, -49, 31], need: [['grind', 2], ['Manual', 1]] },
    { id: 'office-heel', hard: true, name: 'Heelflip the Office Ten', desc: 'Heelflip the whole ten-stair', at: [100, G + 3, -84], go: [100, G + 3, -90, Math.PI], kind: 'trick', tricks: ['Heelflip'], from: [96, -86, 104, -81.7, G + 2.7], to: [94, -78.6, 106, -60, -1, G + 0.5] },
    { id: 'diy-blunt', hard: true, name: 'Bluntslide the DIY Coping', desc: 'Bluntslide (or nose blunt) the quarterpipe coping', at: [108.4, G + 1.6, -20], go: [100, G, -18, -Math.PI / 2], kind: 'grind', rail: 'Coping', grind: 'Blunt', area: [107, -25, 110, 3] },
    { id: 'hill-varial', hard: true, name: 'Varial Kickflip the Hill Stairs', desc: 'Varial kickflip down a flight of the Hill Park stairway', at: [-84, K.hillStairTop, 94], go: [-90, K.hillStairTop + 0.3, 94, -Math.PI / 2], kind: 'trick', tricks: ['Varial Kickflip'], drop: 1.2, from: [-87.5, 91, -66, 97, G + 0.4], to: [-87.5, 90, -55, 98, -1, 7] },
    { id: 'trench-flip', hard: true, name: 'Flip the Trench', desc: 'Off the ply, flip trick over the trench and land beyond it', at: [91.5, G, 66], go: [80, G, 70, -Math.PI / 2], kind: 'trick', trick: FLIP, from: [85, 64, 92, 76, G - 0.2], to: [94.6, 60, 106, 80, G - 0.2, G + 2.5] },
    { id: 'city-legend', hard: true, name: 'Downtown Legend', desc: 'Land a 15,000 point line that starts anywhere downtown: any block, plaza or street', at: [8, G + 1.5, -14], go: [8, G + 1.5, -12, Math.PI], kind: 'score', pts: 15000, area: [-120, -120, 120, 120] },
  ];
  // other skaters in town: two cruising the streets the opposite way round, two sessioning spots
  // traffic both ways round the ring, keeping right; people round the middle block and round the outside of the ring (over the crossings)
  const sq = h => [[-h, -h], [h, -h], [h, h], [-h, h]];
  K.traffic = [{ path: sq(40), lane: 1.05, dir: 1, n: 3, speed: 8.5, r: 6 }, { path: sq(40), lane: 1.05, dir: -1, n: 3, speed: 8.5, r: 6 }];
  K.peds = [{ path: sq(33.5), n: 6 }, { path: sq(46.5), n: 9 }];
  // the boulevard ring round the outside (both levels have one at 130): cars both ways, people on both sidewalks
  K.ringTraffic = [{ path: sq(130), lane: 2.8, dir: 1, n: 6, speed: 13, r: 9 }, { path: sq(130), lane: 2.8, dir: -1, n: 6, speed: 13, r: 9 }];
  K.ringPeds = [{ path: sq(122), n: 5 }, { path: sq(138), n: 4 }];
  K.npcs = [
    { kind: 'loop', path: [[-41.5, -41.5], [-41.5, 41.5], [41.5, 41.5], [41.5, -41.5]], speed: 6.2 },
    { kind: 'loop', path: [[-39.3, -39.3], [39.3, -39.3], [39.3, 39.3], [-39.3, 39.3]], speed: 5.6 },
    { kind: 'session', rail: [10, 4.6, 24, 4.6], start: 3, end: 27, back: 3.4, side: 1, speed: 5.4 },     // a Central Plaza ledge
    { kind: 'session', rail: [-6, 56, 6, 56], start: -12, end: 10, back: 3.8, side: 1, speed: 5 },         // the courthouse flat bar
  ];
  // tapes hidden round the district: [x, z, roughly how high the surface there is]
  K.tapes = [[24, -110.5, G + 5.6], [-6, -116, G + 7], [-74, -72.5, G - 1.8], [114, -22, G + 1.6], [108, 100.3, G + 4.0], [0, 15, G - 1.4],
    [28, 94, G + 2.4], [-58, 0, G - 1.6], [80, 2, G + 1], [-110, -92, G + 1.8], [116, -86, G + 3], [-117, 112, G + 0.5]];
  return spots;
}


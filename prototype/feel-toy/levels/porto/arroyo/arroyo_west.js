/* The Arroyo, the West part: rect [-1000, -752, -230, 910] (design/arroyo.md 3.3, 4.13, 4.14, 4.20, 7.3, 11.3).
   Mill Street, Yard Street, Foundry Road and the west ends of Viaduct, Ford, Outfall and Footbridge roads; Seco Yard
   (tracks over the hump, Boxcar Run, flatcars, hoppers, tank cars, turntable, engine shed); the Siding and Freight
   Platform; Railyard Boardworks; Dock Row; Seco Foundry, its stack, silos and slag; the scrapyard; and the small
   filler that keeps every street and line from going dead (CONTRACT 7). */
function arroyo_west(K, P, PL) {
  arroyo_west_streets(K, P, PL);
  arroyo_west_yard(K, P, PL);
  arroyo_west_siding(K, P, PL);
  arroyo_west_docks(K, P, PL);
  arroyo_west_foundry(K, P, PL);
  arroyo_west_filler(K, P, PL);
  arroyo_west_life(K, P, PL);
}

/* a sidewalk slab that follows a sloped street: 0.15 over the ground, 4 m wide, no grind edges */
function arroyo_west_sw(K, ax, az, bx, bz) {
  K.strip(ax, az, bx, bz, 0.15, 4, { kind: 'Curb', noRails: true, color: 0xc4c0b6, seg: 8 });
}

/* A small piece of street furniture. (c, alongX): the street's centre line; u along it, v across it; lift = the sidewalk's height. */
function arroyo_west_piece(K, c, alongX, u, v, name, lift) {
  const A = (a, b) => alongX ? [a, c + b] : [c + b, a];
  const Rc = (u0, v0, u1, v1) => { const p = A(u0, v0), q = A(u1, v1); return [p[0], p[1], q[0], q[1]]; };
  const lf = lift || 0, [px, pz] = A(u, v), along = alongX ? 'ns' : 'ew';
  const box = (hu, hv, h, mat, edges, col) => { const [x0, z0, x1, z1] = Rc(u - hu, v - hv, u + hu, v + hv); return K.Bg(x0, z0, x1, z1, h + lf, mat, { edges, ...(col ? { color: col } : {}) }); };
  switch (name) {
    case 'bench': box(1.1, 0.3, 0.45, 'wood', along); break;
    case 'planter': box(1.5, 0.6, 0.55, 'ledge', along); break;
    case 'pad': box(3, 0.7, 0.18, 'pad', along); break;
    case 'pallet': box(1.3, 0.9, 0.3, 'wood', ''); break;
    case 'jersey': box(1.6, 0.25, 0.8, 'ledge', along); break;
    case 'ledge': { const [x0, z0, x1, z1] = Rc(u - 4, v, u + 4, v); K.strip(x0, z0, x1, z1, 0.45 + lf, 0.6, { kind: 'Ledge', color: 0xa9a59c, seg: 12 }); break; }
    case 'bar': { const [x0, z0, x1, z1] = Rc(u - 2.5, v, u + 2.5, v); K.rail(x0, K.terrainH(x0, z0) + 0.55 + lf, z0, x1, K.terrainH(x1, z1) + 0.55 + lf, z1, 'Rail', true); break; }
    case 'hydrant': { K.hydrant(px, pz); const [nx, nz] = A(u + 2.2, v); K.newsBoxes(nx, nz, alongX, 2); break; }
    case 'rack': { K.bikeRack(px, pz, alongX); const [tx, tz] = A(u + 3, v); K.trashCan(tx, tz); break; }
    case 'dump': K.dumpster(px, pz, alongX); break;
    case 'kick': { const [kx, kz] = A(u - 5.2, v), [x0, z0, x1, z1] = Rc(u - 2.7, v - 0.7, u + 3, v + 0.7);
      K.kicker(kx, kz, alongX ? 1 : 0, alongX ? 0 : 1, 2.4, 0.5, 1.3); K.Bg(x0, z0, x1, z1, 0.18 + lf, 'pad', { edges: along }); break; }
  }
}

/* ---------- the streets ---------- */
function arroyo_west_streets(K, P, PL) {
  const T = K.terrainH, pc = arroyo_west_piece;
  /* Mill Street: flat K.street z -164..206 (crossing Viaduct Road at 160), then sloped sidewalks */
  K.street('z', -800, -164, 206, 0, [160], { lamps: false });
  arroyo_west_sw(K, -792, 206, -792, 850);
  arroyo_west_sw(K, -808, 226, -808, 850);
  /* Viaduct Road west end, flat, base 0 */
  K.street('x', 160, -794, -752.5, 0, [], { lamps: false });
  /* Yard Street (z 214, x -880..-806, nearly flat) */
  arroyo_west_sw(K, -874, 206, -812, 206);
  arroyo_west_sw(K, -874, 222, -812, 222);
  /* Foundry Road (x -880, z 214..862, sloped) */
  arroyo_west_sw(K, -888, 208, -888, 850);
  arroyo_west_sw(K, -872, 226, -872, 850);
  /* Outfall Road west end (z 862, x -886..-752): sidewalks either side, broken for Mill Street */
  arroyo_west_sw(K, -870, 854, -808, 854); arroyo_west_sw(K, -792, 854, -752.5, 854);
  arroyo_west_sw(K, -886, 870, -808, 870); arroyo_west_sw(K, -792, 870, -752.5, 870);

  /* lamps: sodium lamps down Mill Street's east edge, a few on Foundry Road */
  for (let z = -148; z < 850; z += 32) {
    if (z > 140 && z < 180) continue; if (z > 250 && z < 470) continue;
    K.lamp(-789.8, z, 1);
  }
  for (let z = 240; z < 850; z += 64) K.lamp(-890.6, z, -1);

  /* ---- filler on the sidewalks (v = +-8 is the middle of a sidewalk) ---- */
  const MILL = ['planter', 'bench', 'ledge', 'hydrant', 'pad', 'rack', 'kick', 'jersey', 'bar', 'pallet'];
  // Mill flat part, a push street: a piece about every 25 m, sides alternating; clear of the Viaduct crossing and the shop
  let n = 0;
  for (let u = -146; u <= 196; u += 25, n++) {
    if (u > 140 && u < 180) continue;
    const side = n % 2 ? 1 : -1;
    if (side < 0 && u > 160 && u < 204) continue;                       // the shop's door zone
    pc(K, -800, false, u, side * 8, MILL[n % MILL.length], 0.15);
  }
  // Mill sloped, a bomb line: a piece about every 38 m; the dock platforms cover the east side z 262..460
  n = 3;
  for (let u = 236; u <= 842; u += 38, n++) {
    const side = n % 2 ? 1 : -1;
    if (side > 0 && u > 252 && u < 472) { pc(K, -800, false, u, -8, MILL[n % MILL.length], 0.15); continue; }
    if (Math.abs(u - 862) < 16) continue;
    pc(K, -800, false, u, side * 8, MILL[n % MILL.length], 0.15);
  }
  // Foundry Road, a bomb line
  const FD = ['ledge', 'planter', 'kick', 'jersey', 'bar', 'pad', 'dump', 'bench', 'pallet', 'hydrant'];
  n = 0;
  for (let u = 234; u <= 842; u += 36, n++) pc(K, -880, false, u, (n % 2 ? 1 : -1) * 8, FD[n % FD.length], 0.15);
  // Yard Street
  [[-862, -1, 'planter'], [-844, 1, 'ledge'], [-826, -1, 'kick']].forEach(([u, s, nm]) => pc(K, 214, true, u, s * 8, nm, 0.15));
  // Viaduct Road west end
  pc(K, 160, true, -782, 8, 'bench', 0.15); pc(K, 160, true, -770, -8, 'planter', 0.15); pc(K, 160, true, -760, 8, 'hydrant', 0.15);
  // Ford Road, painted only: pieces on the verge
  [[-792, -1, 'ledge'], [-778, 1, 'jersey'], [-764, -1, 'kick']].forEach(([u, s, nm]) => pc(K, -170, true, u, s * 7.5, nm, 0));
  // Outfall Road west end
  [[-874, 1, 'pallet'], [-858, -1, 'ledge'], [-842, 1, 'bar'], [-826, -1, 'jersey'], [-812, 1, 'bar'], [-790, -1, 'bench'], [-780, 1, 'planter'], [-764, -1, 'pad']].forEach(([u, s, nm]) => pc(K, 862, true, u, s * 8, nm, 0.15));
  // Footbridge Walk west end (8 m wide, at base)
  pc(K, 520, true, -784, -3, 'bench', 0); pc(K, 520, true, -770, 3, 'planter', 0); pc(K, 520, true, -760, -3, 'ledge', 0);
  K.lamp(-778, 515.4, -1); K.lamp(-764, 524.6, 1);
  P.spot('Footbridge Landing', -772, T(-772, 520), 520, Math.PI / 2, [-790, 514, -753, 526]);

  /* ---- Railyard Boardworks (the skate shop), Mill Street's west side, z 172..196 ---- */
  K.building(-830, 172, -812, 196, 2, 0x8a6a4a, 'brick');
  P.shop({ name: 'Railyard Boardworks', sign: [-811.96, 4.0, 184, Math.PI / 2, 7], awning: [-812, 178, -810.4, 190, 2.35, 'x'],
    zone: [-811.8, 180, -808.6, 188], door: [-811.8, 0.15, 184] });
  P.travel('Railyard Boardworks', -806, 0.15, 184, Math.PI / 2, 'spot');
  K.bikeRack(-809, 174.5, false); K.trashCan(-808.8, 192); K.newsBoxes(-809.2, 196.6, false, 2);
  P.spot('Railyard Boardworks', -806, 0.15, 184, Math.PI / 2, [-814, 168, -792, 200]);
  // the units along Mill Street's west frontage, z 228..534
  const HC = [0xa3856b, 0x8d9a8f, 0xb59a7a, 0x8b8f96, 0x9b7a62, 0xa8a08a];
  [[228, 256], [270, 302], [316, 346], [372, 404], [430, 462], [486, 534]].forEach(([z0, z1], i) => K.building(-832, z0, -814, z1, 2, HC[i], i % 2 ? 'stone' : 'brick'));
}

/* ---------- Seco Yard (4.13) ---------- */
function arroyo_west_yard(K, P, PL) {
  const T = K.terrainH;
  /* the six tracks: two rails each, in 10 m pieces over the hump and long pieces on the flat; cut where stock stands */
  const cut = { '-924': [[-62, 72]], '-896': [[-62, 18], [158, 192]], '-952': [[-82, 28]], '-882': [[44, 108]], '-910': [[158, 192]], '-938': [] };
  const drawn = [];
  for (const tx of PL.tracks) for (const rx of [tx - 0.75, tx + 0.75]) {
    // runs between the cuts, each in as few chords as stay within 12 cm of the ground (the hump bends, the flat doesn't)
    const runs = []; let lo = -198; for (const [c0, c1] of [...(cut[tx] || [])].sort((p, q) => p[0] - q[0])) { if (c0 > lo) runs.push([lo, c0]); lo = Math.max(lo, c1); } if (lo < 198) runs.push([lo, 198]);
    const fits = (a, b) => { for (let z = a + 1; z < b; z += 1) if (Math.abs(T(rx, z) - (T(rx, a) + (T(rx, b) - T(rx, a)) * (z - a) / (b - a))) > 0.12) return false; return true; };
    for (const [r0, r1] of runs) for (let a = r0; a < r1 - 0.01;) {
      let b = r1; while (b - a > 4 && !fits(a, b)) b = Math.max(a + 4, b - 2);
      let lift = 0; for (let z = a + 1; z < b; z += 1) lift = Math.max(lift, T(rx, z) - (T(rx, a) + (T(rx, b) - T(rx, a)) * (z - a) / (b - a)));   // over a crest the chord is raised to clear it
      if (rx < tx) K.rail(rx, T(rx, a) + 0.15 + lift, a, rx, T(rx, b) + 0.15 + lift, b, 'Rail', false);   // the west rail of each track grinds
      else drawn.push([rx, T(rx, a) + 0.12 + lift, a, T(rx, b) + 0.12 + lift, b]);                            // the east one is drawn only (grind-line budget)
      a = b;
    }
  }
  K.decorFns.push(D => { const cyl = new THREE.CylinderGeometry(0.035, 0.035, 1, 6);
    for (const [x, ya, za, yb, zb] of drawn) { const L = Math.hypot(yb - ya, zb - za); D.add(cyl, 0x9aa0a6, [x, (ya + yb) / 2, (za + zb) / 2], [Math.acos((yb - ya) / L), 0, 0], [1, L, 1], { metalness: 0.6, roughness: 0.4 }); } });
  for (const tx of PL.tracks) K.B(tx - 1.2, T(tx, 200) - 0.3, 200, tx + 1.2, T(tx, 200) + 1.0, 201.2, 'metal', { color: 0x6b4a32 });   // buffer stops
  /* Boxcar Run, track -924 */
  const cars = [-36, -19, -2, 15, 32], RUST = 0x8a4a32, GREEN = 0x4f6a52;
  K.hubbas.push({ a: V(-924, 3.6, -36), b: V(-924, T(-924, -60) + 0.02, -60), w: 3, noRails: true, color: 0x6b6f75 });
  cars.forEach((z0, i) => K.B(-925.5, T(-924, z0) - 0.2, z0, -922.5, 3.6, z0 + 14, 'metal', { edges: 'we', color: i % 2 ? GREEN : RUST }));
  K.hubbas.push({ a: V(-924, 3.6, 46), b: V(-924, T(-924, 70) + 0.02, 70), w: 3, noRails: true, color: 0x6b6f75 });
  K.decorFns.push(D => {
    cars.forEach((z0, i) => { for (const [x, s] of [[-925.56, -1], [-922.44, 1]]) { D.prop(Math.min(x, x + s * 0.1), 0.5, z0 + 4, Math.max(x, x + s * 0.1), 3.0, z0 + 9, i % 2 ? 0x3a4a3d : 0x5e3222); }
      if (i !== 1) D.tag(-925.6, 1.8, z0 + 7, 5, 1.6, -Math.PI / 2); });
    D.tag(-922.4, 2.0, 22, 4, 1.6, Math.PI / 2);
  });
  /* flatcars on -896 (1.2 ledges), hoppers on -952 (scenery), tank cars on -882 (roof run) */
  [-60, -30, 0].forEach((z0, i) => K.B(-897.5, T(-896, z0) - 0.2, z0, -894.5, 1.2, z0 + 16, 'metal', { edges: 'we', color: i % 2 ? 0x5a5348 : 0x6b4a32 }));
  K.hubbas.push({ a: V(-896, 1.2, -60), b: V(-896, T(-896, -68) + 0.02, -68), w: 3, noRails: true, color: 0x6b6f75 });
  [-80, -48, -16, 16].forEach(z0 => K.B(-953.5, T(-952, z0) - 0.2, z0, -950.5, 3.2, z0 + 10, 'metal', { color: 0x6e6a5e }));
  K.hubbas.push({ a: V(-881.9, 2.8, 60), b: V(-881.9, T(-882, 46) + 0.02, 46), w: 2.4, noRails: true, color: 0x6b6f75 });
  [[60, 74], [78, 92]].forEach(([z0, z1]) => K.B(-883.4, T(-882, z0) - 0.2, z0, -880.4, 2.8, z1, 'metal', { edges: 'we', color: 0x55504a }));
  K.hubbas.push({ a: V(-881.9, 2.8, 92), b: V(-881.9, T(-882, 106) + 0.02, 106), w: 2.4, noRails: true, color: 0x6b6f75 });
  K.decorFns.push(D => { const g = new THREE.CylinderGeometry(1.4, 1.4, 14, 14); [67, 85].forEach(zc => D.add(g, 0x3d4247, [-881.9, T(-882, zc) + 1.4, zc], [Math.PI / 2, 0, 0], [1, 1, 1], { metalness: 0.4, roughness: 0.6 })); });
  /* the turntable: a 1.6 m bowl with its coping ring (K.fountainBowl) and a pivot block on the floor */
  K.pool(-912, -888, 163, 187, [[K.poolS.circle(-900, 175, 11), 1.6]], 0, 0.5);
  for (let i = 0; i < 20; i++) { const a0 = i / 20 * Math.PI * 2, a1 = (i + 1) / 20 * Math.PI * 2;
    K.rails.push({ a: V(-900 + Math.cos(a0) * 11, 0, 175 + Math.sin(a0) * 11), b: V(-900 + Math.cos(a1) * 11, 0, 175 + Math.sin(a1) * 11), kind: 'Coping', coping: true }); }
  K.B(-901, -1.6, 174, -899, -1.0, 176, 'metal', { edges: 'nswe', color: 0x55504a });
  /* the engine shed (x -975..-962, z -100..100), roller doors on its east face; yard huts */
  K.building(-975, -100, -962, 100, 3, 0x7b6a58, 'brick');
  for (const z of [-80, -44, -8, 28, 64]) K.prop(-962.2, 0, z - 3.4, -961.9, 4.4, z + 3.4, 0x4a4540);
  [[-856, -150, -846, -142], [-870, 36, -860, 46], [-850, 120, -840, 130]].forEach(([x0, z0, x1, z1], i) => K.building(x0, z0, x1, z1, 1, [0x8a7a68, 0x7d6f5e, 0x93806a][i], 'brick'));
  /* the SECO YARD gantry over the tracks at z -200 */
  for (const x of [-963, -872]) K.B(x - 0.4, T(x, -200) - 0.5, -200.4, x + 0.4, T(x, -200) + 8.2, -199.6, 'metal', { color: 0x4a4d52 });
  K.prop(-963.4, T(-917, -200) + 7.2, -200.3, -871.6, T(-917, -200) + 8.0, -199.7, 0x4a4d52);
  K.decorFns.push(D => D.sign('SECO YARD', -917, T(-917, -200) + 6.0, -200.35, 8, 1.4, Math.PI, '#f2ead8', '#6b3a22'));
  /* the Hump crest and Boxcar Run, spots and tapes */
  P.spot('Seco Yard', -910, T(-910, -155), -155, Math.PI, [-975, -200, -810, -100]);
  P.travel('Seco Yard', -910, T(-910, -155), -155, Math.PI, 'spot');
  P.spot('Boxcar Run', -924, 0, 15, Math.PI, [-960, -70, -878, 110]);
  P.spot('Switch Yard', -836, 0, 13, Math.PI, [-870, -10, -800, 40]);
  P.tape(-924, 5, 4.2); P.tape(-910, -155, T(-910, -155) + 0.6);
  P.challenge({ id: 'arroyo-boxcar-gap', name: 'BOXCAR RUN', desc: 'Up the ramp, hop the gap between the first two boxcars',
    at: [-924, 0, -66], go: [-924, 0, -96, Math.PI], kind: 'gap', from: [-926, -36, -922, -22, 3.3, 4.6], to: [-926, -19, -922, -5, 3.3, 4.6] });
  /* the pocket at the switch hut: a bench, pallets, a jersey and a pad in the gravel */
  K.bench(-842, 17, -839, 17.6); K.Bg(-832, 8, -829.4, 10.6, 0.3, 'wood', { edges: '' }); K.Bg(-829, 9, -826.4, 11.6, 0.3, 'wood', { edges: '' });
  K.jersey(-846, 22, -840, 22.5); K.pad(-838, 22, -830, 24.4, 0.2);
  /* along the Yard Line east of the tracks (the gravel is rough, so these are the stepping stones to the platform) */
  K.Bg(-868, 18, -865, 20, 0.45, 'ledge', { edges: 'ew' }); K.jersey(-857, 24.6, -851, 25.1);
  K.Bg(-826, 4, -820, 5.2, 0.4, 'ledge', { edges: 'ns' }); K.Bg(-812, 0, -809, 2, 0.3, 'wood', { edges: '' });
  /* a few more in the north and the south of the yard so the tracks are not the only thing there */
  K.pad(-858, -100, -850, -97.6, 0.2); K.Bg(-836, -70, -830, -69, 0.45, 'ledge', { edges: 'ns' }); K.jersey(-846, -20, -840, -19.5);
  K.pad(-858, 70, -850, 72.4, 0.2); K.Bg(-834, 90, -828, 91.2, 0.45, 'ledge', { edges: 'ns' }); K.Bg(-852, 140, -849, 143, 0.55, 'ledge', { edges: 'ns' });
  /* the yard hut pocket, where the Yard Line turns east for the DIY: a pad, a ledge and a jersey off the line's north side */
  K.pad(-864, 121, -858, 123.4, 0.2); K.Bg(-836, 121, -830, 122.2, 0.45, 'ledge', { edges: 'ns' }); K.jersey(-822, 121.5, -816, 122);
  P.spot('Yard Hut', -836, 0, 118, Math.PI / 2, [-870, 110, -812, 132]);
  K.lamp(-868, -120, 1); K.lamp(-868, 0, 1); K.lamp(-868, 120, 1); K.lamp(-818, -30, -1); K.lamp(-818, 60, -1);
}

/* ---------- the Siding and the Freight Platform (4.14) ---------- */
function arroyo_west_siding(K, P, PL) {
  const T = K.terrainH;
  for (const rx of [-772.75, -771.25]) for (const [a, b] of [[-150, -80], [-80, -10], [-10, 60]]) K.rail(rx, T(rx, a) + 0.15, a, rx, T(rx, b) + 0.15, b, 'Rail', false);
  K.B(-773.2, T(-772, 61) - 0.3, 60.4, -770.8, T(-772, 61) + 1.0, 62, 'metal', { color: 0x6b4a32 });
  /* the platform: a 160 m ledge, east edge at x -783 (where the doc's session rail is) */
  K.B(-788, -0.5, -120, -783, 1.2, 40, 'plaza', { edges: 'e', color: 0xb3afa6 });
  K.hubbas.push({ a: V(-785.5, 1.2, -120), b: V(-785.5, T(-785.5, -132) + 0.02, -132), w: 5, noRails: true, color: 0xb9b5ab });
  K.hubbas.push({ a: V(-785.5, 1.2, 40), b: V(-785.5, T(-785.5, 52) + 0.02, 52), w: 5, noRails: true, color: 0xb9b5ab });
  K.containers(-66, -765, 1, [1], false, 0); K.containers(-26, -765, 1, [1], false, 0);
  K.prop(-768.4, 0, -100, -766.4, 0.3, -98, 0x9a7b57); K.prop(-768.4, 0, -97.6, -766.4, 0.3, -95.6, 0x9a7b57); K.prop(-768.4, 0, 8, -766.4, 0.3, 10, 0x9a7b57);
  K.building(-760, -148, -753.5, -134, 1, 0x8a7a68, 'brick'); K.building(-760, -104, -753.5, -90, 1, 0x7d6f5e, 'brick');
  P.spot('Freight Platform', -785, 1.2, 0, Math.PI, [-792, -135, -768, 55]);
  P.travel('Freight Platform', -778, 0, -150, Math.PI, 'spot');
  P.challenge({ id: 'arroyo-platform-grind', name: 'FREIGHT LEDGE', desc: 'Grind the Freight Platform ledge, 160 m of it',
    at: [-785.5, 1.2, -136], go: [-785.5, 0, -160, Math.PI], kind: 'grind', area: [-790, -130, -780, 50] });
  /* the way from the platform's south end to the DIY (the Yard Line): a kick, a ledge and a bar */
  K.kicker(-776, 60, 0.45, 0.89, 2.4, 0.5, 1.3); K.Bg(-772, 66, -768.5, 67.2, 0.18, 'pad', { edges: 'ns' });
  K.Bg(-764, 80, -758, 81.2, 0.45, 'ledge', { edges: 'ns' }); K.rail(-758, T(-758, 90) + 0.55, 88, -754, T(-754, 94) + 0.55, 94, 'Rail', true);
}

/* ---------- Dock Row (4.20): four sheds on Mill Street's east side, z 260..480 ---------- */
function arroyo_west_docks(K, P, PL) {
  const T = K.terrainH, SH = [0x8a8f96, 0x9b7a62, 0x7f8a8a, 0xa08a6e];
  [[262, 298], [316, 352], [370, 406], [424, 460]].forEach(([z0, z1], i) => {
    K.building(-788.9, z0, -760, z1, 2, SH[i], 'brick');
    K.strip(-790.4, z0, -790.4, z1, 0.9, 3, { kind: 'Ledge', color: 0x9a9ea3, seg: 12 });                      // the dock, following the street
    const g = T(-790.4, z0);
    K.hubbas.push({ a: V(-790.4, g + 0.9, z0), b: V(-790.4, T(-790.4, z0 - 4) + 0.02, z0 - 4), w: 3, noRails: true, color: 0xb9b5ab });   // a bank up at the north end
    K.Bg(-776, z1 + 2, -770, z1 + 2.8, 0.45, 'ledge', { edges: 'ns' });                                      // a ledge in each alley
  });
  K.decorFns.push(D => { for (const z of [276, 330, 384, 438]) D.tag(-788.85, 2.0, z, 5, 1.8, -Math.PI / 2); });
  P.spot('Dock Row', -790, T(-790, 360), 360, Math.PI, [-796, 258, -756, 462]);
}

/* ---------- Seco Foundry, the stack, silos, slag, the scrapyard (4.20) ---------- */
function arroyo_west_foundry(K, P, PL) {
  const T = K.terrainH;
  /* the foundry building, moved 16 m east of the doc's x -960..-880 so Foundry Road isn't under it: x -962..-896 */
  K.building(-962, 560, -896, 680, 5, 0x7d6a5c, 'brick');
  K.building(-960, 540, -930, 556, 2, 0x8a7a68, 'brick'); K.building(-960, 684, -936, 700, 2, 0x7d6f5e, 'brick');
  K.decorFns.push(D => D.sign('SECO FOUNDRY', -895.95, 12, 620, 10, 1.6, Math.PI / 2, '#f2ead8', '#5a2f22'));
  K.Bg(-894, 600, -892.6, 616, 0.45, 'ledge', { edges: 'ew' }); K.Bg(-894, 628, -892.6, 644, 0.45, 'ledge', { edges: 'ew' }); K.pad(-894.4, 566, -892, 576, 0.2);
  /* the stack: a plinth to ollie, a collider inside the drawn chimney */
  const gs = T(-905, 705);
  K.B(-908, gs - 0.6, 702, -902, gs + 0.6, 708, 'ledge', { edges: 'nswe' });
  K.B(-906.6, gs - 0.5, 703.4, -903.4, gs + 22, 706.6, 'garage');
  K.decorFns.push(D => { D.add(new THREE.CylinderGeometry(2.5, 3.4, 64, 18), 0x8a5a44, [-905, gs + 32, 705], [0, 0, 0], [1, 1, 1], { roughness: 0.95 });
    D.add(new THREE.CylinderGeometry(2.7, 2.7, 1.4, 18), 0x3d3a37, [-905, gs + 63.4, 705], [0, 0, 0], [1, 1, 1], { roughness: 0.95 }); });
  /* silos: three drawn cylinders with a smaller solid block inside */
  K.decorFns.push(D => { const g = new THREE.CylinderGeometry(3, 3, 18, 16); for (const z of [660, 670, 680]) D.add(g, 0xbdb9ae, [-840, T(-840, z) + 9, z], [0, 0, 0], [1, 1, 1], { roughness: 0.9 }); });
  for (const z of [660, 670, 680]) K.B(-842, T(-840, z) - 1, z - 2, -838, T(-840, z) + 18, z + 2, 'garage');
  K.Bg(-846, 650, -833, 651, 0.55, 'ledge', { edges: 'ns' });                                               // a wall along the silo row
  /* gravel piles and the slag heap: a block to pop off at the foot of each, and a bank-friendly ledge */
  K.Bg(-846, 612, -842, 618, 0.5, 'ledge', { edges: 'ew' }); K.Bg(-826, 640, -822, 646, 0.5, 'ledge', { edges: 'ew' });
  K.Bg(-880, 700, -877, 712, 0.5, 'ledge', { edges: 'ew' }); K.Bg(-846, 722, -840, 723.2, 0.45, 'ledge', { edges: 'ns' });
  K.kicker(-878, 722, 1, 0, 2.4, 0.5, 1.4);
  /* the scrapyard x -960..-900, z 740..840: crushed-car stacks, a bent I-beam, an office, board fence (drawn only) */
  const stacks = [[-952, 748, 1.4], [-944, 756, 0.6], [-934, 748, 1.4], [-922, 758, 0.6], [-910, 748, 1.4], [-950, 772, 0.6], [-938, 778, 1.4], [-924, 774, 1.4], [-912, 782, 0.6],
    [-954, 806, 1.4], [-928, 812, 0.6], [-914, 806, 1.4], [-946, 826, 0.6], [-930, 830, 1.4], [-916, 826, 0.6]];
  stacks.forEach(([x, z, h]) => K.Bg(x - 1, z - 2, x + 1, z + 2, h, 'car', { edges: 'ns', color: [0x8a4a32, 0x6b6f75, 0x4f6a52, 0x7d6a5c][Math.abs(Math.round(x + z)) % 4] }));
  K.rail(-940, T(-940, 786) + 0.5, 786, -940, T(-940, 798) + 0.5, 798, 'Rail', true); K.rail(-940, T(-940, 798) + 0.5, 798, -936, T(-936, 810) + 0.5, 810, 'Rail', true);
  K.building(-958, 842, -944, 852, 1, 0x8a7a68, 'brick');
  K.decorFns.push(D => { for (const [x0, z0, x1, z1] of [[-960, 739.8, -900, 740.2], [-960, 840, -900, 840.4], [-960, 740, -959.6, 840]]) D.prop(x0, T(x0, z0), z0, x1, T(x0, z0) + 2.2, z1, 0x6e6a5e); });
  P.spot('Scrapyard', -930, T(-930, 790), 790, Math.PI, [-962, 738, -898, 842]);
  P.spot('Seco Foundry', -890, T(-890, 620), 620, Math.PI / 2, [-898, 540, -884, 700]);
  P.travel('Seco Foundry', -888, T(-888, 560), 560, Math.PI, 'spot');
}

/* ---------- the filler that has no better home: Foundry Road's pocket bends, the bomb line pull-offs ---------- */
function arroyo_west_filler(K, P, PL) {
  const T = K.terrainH;
  /* Mill Street (down): a bus stop pull-off every ~150 m (on the sidewalk, glass on the building side) */
  K.busStop(-808.2, 410, false, -1);
  K.busStop(-792, 600, false, 1);
  K.busStop(-808.2, 780, false, -1);
  /* Foundry Road: a bank and a ledge at the foundry gate and by the scrapyard */
  K.bankToWall(-891.5, 570, -887.5, 0.9, 3);
  K.Bg(-891.5, 690, -887.5, 691.2, 0.5, 'ledge', { edges: 'ns' });
}

/* ---------- life ---------- */
function arroyo_west_life(K, P, PL) {
  /* the session skaters at the DIY, the coping and the Gas Ring are other parts'; the platform's rail is the platform's east edge above.
     Dock Row and the yard get a tape-free, quiet look; the two district tapes are in arroyo_west_yard. */
  const T = K.terrainH;
  K.hydrant(-805.4, -158); K.hydrant(-794.6, 120);
  K.decorFns.push(D => { D.tag(-788.05, 0.7, -60, 5, 1.0, -Math.PI / 2); });
}

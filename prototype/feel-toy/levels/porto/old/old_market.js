/* Old Town, the Market quarter: the three Market Tiers, the Market Hall and its docks, Crosstown (bench -19.45) with its ledges and
   east flank, the Lavadouro wash house, the Convento das Rosas and its double set, Clock Square, Footbridge Lane, Rampart Alley,
   the Market / Steep / Lantern / Rampart sidewalks, the Tile Ledges, the Old Wall pieces, 23 buildings, the filler that keeps the
   streets from going dead (CONTRACT 7), two challenges and two tapes. Design: levels/porto/design/old.md section 8.
   Rect [-420, 300, 470, 742]. */

function old_market(K, P, O) {
  const T = (x, z) => K.terrainH(x, z);
  const G = z => O.Gk(z);
  old_market_tiers(K, P, O, T, G);
  old_market_hall(K, P, O, T, G);
  old_market_crosstown(K, P, O, T, G);
  old_market_lavadouro(K, P, O, T, G);
  old_market_convent(K, P, O, T, G);
  old_market_clock(K, P, O, T, G);
  old_market_walks(K, P, O, T, G);
  old_market_west(K, P, O, T, G);
  old_market_east(K, P, O, T, G);
  old_market_buildings(K, P, O, T, G);
  old_market_fill(K, P, O, T, G);
  old_market_life(K, P, O, T, G);
}

/* a building with a stepped cornice and a terracotta roof slab (design 7.10) */
function old_market_bld(K, x0, z0, x1, z1, floors, color, tex) {
  K.building(x0, z0, x1, z1, floors, color, tex);
  const top = K.groundMax(x0, z0, x1, z1) + floors * 3.4;
  K.prop(x0 - 0.2, top - 0.5, z0 - 0.2, x1 + 0.2, top, z1 + 0.2, 0xf1ead8);
  K.prop(x0 - 0.4, top, z0 - 0.4, x1 + 0.4, top + 0.5, z1 + 0.4, 0xa94f32);
}

/* a ground-hugging ledge along a z line, 0.6 wide, one grind line (side +1: the line on the east edge) */
function old_market_led(K, x, z0, z1, side, h = 0.45, color = 0xc9bfa8) {
  return old_slopeLedge(K, x - 0.3, x + 0.3, z0, z1, h, color, x + 0.3 * side);
}

/* a manual pad: low, no grind lines */
function old_market_flat(K, x0, z0, x1, z1, h = 0.18) {
  return K.Bg(x0, z0, x1, z1, h, 'pad', { edges: '' });
}

/* ---------------- 8.1 the Market Tiers ---------------- */
function old_market_tiers(K, P, O, T, G) {
  const c = 0xd8d0bf;
  K.B(-190, -16.6, 474, -50, -14.65, 494, 'plaza', { edges: 'swe', color: c });    // T1
  K.B(-190, -18.0, 494, -50, -16.03, 514, 'plaza', { edges: 'swe', color: c });    // T2
  K.B(-190, -19.4, 514, -50, -17.44, 534, 'plaza', { edges: 'swe', color: c });    // T3
  // T1 -> T2, T2 -> T3, T3 -> ground: a five-stair set with a rail and a bank beside each
  K.stairSpot('z', 494, 1, -125, -115, -14.65, -16.03, 5, 0.4, { rails: [-120] });
  K.hubbas.push({ a: V(-177, -14.65, 494), b: V(-177, -16.01, 498), w: 10, noRails: true, color: 0xc4bfb3 });
  K.stairSpot('z', 514, 1, -85, -75, -16.03, -17.44, 5, 0.4, { rails: [-80] });
  K.hubbas.push({ a: V(-61, -16.03, 514), b: V(-61, -17.42, 518), w: 10, noRails: true, color: 0xc4bfb3 });
  K.stairSpot('z', 534, 1, -125, -115, -17.44, -18.99, 5, 0.4, { rails: [-120] });
  K.hubbas.push({ a: V(-177, -17.44, 534), b: V(-177, -19.15, 539), w: 10, noRails: true, color: 0xc4bfb3 });
  // 12 stall tables, each with a striped awning
  const tiers = [[480, -14.65], [500, -16.03], [520, -17.44]];
  for (const [z, top] of tiers) for (const x of [-170, -140, -100, -66]) {
    K.B(x, top, z, x + 3, top + 0.8, z + 1.2, 'wood', { edges: 'ns' });
    K.prop(x - 0.3, top + 2.4, z - 0.4, x + 3.3, top + 2.6, z + 1.6, ((x + z) / 10 | 0) % 2 ? 0xc0623f : 0xd9a441);
  }
  // the lamps and bins that go with a market, on the tops of the tiers
  for (const [x, z, top] of [[-186, 478, -14.65], [-54, 478, -14.65], [-186, 518, -17.44], [-54, 518, -17.44]]) K.B(x - 0.15, top, z - 0.15, x + 0.15, top + 3.6, z + 0.15, 'metal', { edges: '' });
  K.trashCan(-150, 487); K.trashCan(-90, 507);
}

/* ---------------- 8.2 the Market Hall and its docks ---------------- */
function old_market_hall(K, P, O, T, G) {
  old_market_bld(K, -28, 480, 52, 546, 2, 0xd9a441, 'stone');
  const gy = G(480);
  K.decorFns.push(D => {
    D.sign('MERCADO VELHO', 12, gy + 6.5, 479.9, 12, 1.4, Math.PI, '#3a3226', '#d9a441');
  });
  const top = K.groundMax(-28, 480, 52, 546) + 2 * 3.4;
  K.prop(-20, top + 0.5, 490, 44, top + 2.2, 536, 0xc9bfa8);                                                 // the clerestory
  for (let z = 492; z < 540; z += 14) K.prop(-28.1, G(z) + 0.2, z, -27.9, G(z) + 4.2, z + 5, 0x6b4a32);      // arched doors, west face
  // the docks on the Crosstown bench: a 4 m gap between each
  const docks = [[-24, -4, -18.45], [0, 20, -18.20], [24, 48, -18.55]];
  for (const [x0, x1, top2] of docks) {
    K.B(x0, -20.0, 546, x1, top2, 551, 'garage', { edges: 'swe' });
    K.prop(x0, top2 + 0.0, 545.7, x1, top2 + 0.3, 546, 0x3a3d42);                                            // the bumper strip on the hall wall
  }
  K.B(6, -18.2, 546.6, 7.6, -18.2 + 0.18, 548.2, 'pad', { edges: 'nswe' });                                   // crates on dock 2
  K.B(10, -18.2, 546.6, 12.6, -18.2 + 0.18, 549, 'pad', { edges: 'nswe' });
  K.B(14, -18.2, 547.5, 15.6, -18.2 + 0.18, 549.1, 'pad', { edges: 'nswe' });
  P.spot('Market Docks', 12, -18.2, 548, Math.PI, [-24, 546, 48, 551]);
  P.travel('Mercado Velho', -120, -14.65, 478, Math.PI, 'spot');
}

/* ---------------- 8.3 Crosstown (z 552..568, bench -19.45) and its east flank ---------------- */
function old_market_crosstown(K, P, O, T, G) {
  const y = O.Y.crosstown;
  // (K.street drops the first cut when a crossing sits within 8 m of `from`, and then builds the sidewalks where the crossings are:
  //  so the street starts at the Rampart Street mouth, -312, and the mouth's asphalt and curb ramps are painted and built here)
  K.street('x', 560, -312, 212, y, [-200, -40, 120], { rw: 5, sw: 3, lamps: false });
  K.paintRect(-328, 555, -312, 565, 0x56585d, y + 0.006);
  // curb ramps where the tiers and the Steep's side lanes roll out on to the north sidewalk
  for (const x of [-180, -120, -80, -10, 30]) K.hubbas.push({ a: V(x, y + 0.15, 552.4), b: V(x, y + 0.01, 550.8), w: 3, noRails: true, color: 0xb9b5ab });
  for (const zc of [553.5, 566.5]) K.hubbas.push({ a: V(-312, y + 0.15, zc), b: V(-313.4, y + 0.01, zc), w: 2.6, noRails: true, color: 0xb9b5ab });
  // lamps every 32 m on both sidewalks, off the crossings and the bus stop
  const cross = [-320, -200, -40, 120];
  for (let x = -300; x <= 200; x += 32) {
    if (cross.some(k => Math.abs(x - k) < 10) || Math.abs(x - 60) < 4) continue;
    K.lamp(x, 553.2, 1); K.lamp(x + 16 > -170 && x + 16 < -130 ? -176 : x + 16, 566.8, -1);   // the Lavadouro mouth stays open
  }
  // the Wash and Clock line rolls off Crosstown into the Lavadouro: a curb ramp along the south sidewalk's face
  K.hubbas.push({ a: V(-150, y + 0.15, 565.4), b: V(-150, y + 0.01, 563.8), w: 30, noRails: true, color: 0xb9b5ab });
  for (const x of [144, 176]) { K.tree(x, 553.7); K.tree(x + 16, 566.3); }                                  // trees only east of Lantern
  // the Crosstown ledges on the south sidewalk, 0.45 over it
  K.ledge(-100, 566.0, -84, 566.6, 0.6, 'marble');
  K.ledge(-78, 566.0, -62, 566.6, 0.6, 'marble');
  K.busStop(60, 553.5, true, -1);
  // the east flank, x 212..296: asphalt from P.col, sidewalks of 8 m hubba pieces, a curb line either side, centre dashes
  for (const [zc, zr] of [[553.5, 555], [566.5, 565]]) {
    for (let x = 212; x < 284; x += 8) {
      const x1 = Math.min(x + 8, 284), A = V(x, T(x, zc) + 0.15, zc), B = V(x1, T(x1, zc) + 0.15, zc);
      K.hubbas.push(A.y >= B.y ? { a: A, b: B, w: 3, noRails: true, color: 0xd8d0bf } : { a: B, b: A, w: 3, noRails: true, color: 0xd8d0bf });
    }
    K.rail(212, T(212, zr) + 0.15, zr, 284, T(284, zr) + 0.15, zr, 'Curb', false);
  }
  for (let x = 214; x < 282; x += 6) K.dash(x, 560, x + 3, 560);
}

/* ---------------- 8.4 the Lavadouro, the wash house ---------------- */
function old_market_lavadouro(K, P, O, T, G) {
  K.pool(-147, -115, 579, 591, [[K.poolS.rect(-138, 585, 8, 5, 0.8), 1.3], [K.poolS.rect(-122.5, 585, 7, 5, 2.5), 1.9]], -19.45);
  for (const [x, z] of [[-158, 570], [-110.5, 570], [-158, 597.5], [-110.5, 597.5]]) K.B(x, -19.8, z, x + 0.5, -15.45, z + 0.5, 'plaza', { color: 0xe9e1cf });
  K.prop(-160, -15.45, 568, -108, -15.0, 600, 0xa94f32);                                                    // the tiled roof
  K.prop(-159, -16.2, 567.7, -109, -15.45, 568, 0xe9e1cf);                                                  // the fascia
  K.decorFns.push(D => D.sign('LAVADOURO', -134, -15.95, 567.6, 7, 0.9, Math.PI, '#3a3226', '#e9e1cf'));
  K.ledge(-150, 593, -118, 593.8, 0.5, 'ledge');                                                            // the wash table
  K.tree(-148, 622); K.tree(-118, 636);                                                                     // the Wash Green
  K.bench(-152, 614, -149.6, 614.6); K.bench(-132, 630, -129.6, 630.6);
  P.spot('Lavadouro', -134, -19.45, 585, Math.PI, [-160, 568, -108, 608]);
}

/* ---------------- 8.5 the Convento das Rosas ---------------- */
function old_market_convent(K, P, O, T, G) {
  const c = 0xd8d0bf;
  K.B(-296, -24.5, 604, -224, -21.27, 642, 'plaza', { edges: 'swe', color: c });
  K.stairSpot('z', 642, 1, -270, -250, -21.27, -22.88, 6, 0.4, { rails: [-260], hubbas: [-270.4, -249.6] });
  K.B(-270, -25.0, 644, -250, -22.88, 648, 'step', { edges: 'we' });
  K.stairSpot('z', 648, 1, -270, -250, -22.88, -24.49, 6, 0.4, { rails: [-260], hubbas: [-270.4, -249.6] });
  for (let z = 660; z < 725; z += 20) { K.planter(-268, z, -267, z + 3, 0.55); K.planter(-253, z, -252, z + 3, 0.55); }
  old_market_bld(K, -311, 600, -297, 700, 3, 0xeee8da, 'stone');
  K.prop(-297.2, G(650) + 6, 640, -297, G(650) + 9, 644, 0x3f6fa8);                                         // the rose window
  old_market_bld(K, -296, 654, -269, 738, 3);                                                                // M11
  old_market_bld(K, -251, 654, -211, 738, 3);                                                                // M12
  K.tree(-292, 608); K.tree(-228, 608);
  K.bench(-280, 624, -277.6, 624.6); K.bench(-243, 624, -240.6, 624.6);
  P.spot('Convent Double', -260, -21.27, 640, Math.PI, [-296, 604, -224, 650]);
}

/* ---------------- 8.6 Clock Square, Clock Lane and the Seminary Wall ---------------- */
function old_market_clock(K, P, O, T, G) {
  const y = O.Y.clock;
  K.Bg(-122.5, 657.5, -117.5, 662.5, 0.45, 'ledge', { edges: 'nswe' });                                      // the plinth
  K.B(-120.6, y - 0.05, 659.4, -119.4, -18.5, 660.6, 'plaza', { color: 0xe9e1cf });                         // the clock column
  K.decorFns.push(D => {
    D.add(new THREE.CylinderGeometry(1.05, 1.05, 1.5, 20), 0xf1ead8, [-120, -19.5, 660], [Math.PI / 2, 0, 0]);   // the clock face, facing both ways
    D.add(new THREE.ConeGeometry(1.0, 1.1, 8), 0xa94f32, [-120, -17.95, 660]);
  });
  K.bench(-113.3, 653.4, -112.7, 655.8); K.bench(-113.3, 664.2, -112.7, 666.6); K.bench(-127.3, 653.4, -126.7, 655.8); K.bench(-127.3, 664.2, -126.7, 666.6);                              // tangential benches on the four axes
  K.bench(-121.2, 666.7, -118.8, 667.3); K.bench(-121.2, 652.7, -118.8, 653.3);
  K.Bg(-180, 665.0, -136, 665.6, 0.5, 'ledge', { edges: 'n' });                                              // the Seminary Wall
  old_market_bld(K, -190, 604, -162, 652, 2, 0xf1ead8, 'stone');                                             // M13
  old_market_bld(K, -100, 604, -52, 652, 2, 0xd99a8c, 'stone');                                              // M14
  old_market_bld(K, -186, 668, -130, 738, 3, 0xf1ead8, 'stone');                                             // M15 the Seminary
  old_market_bld(K, -106, 668, -52, 738, 3);                                                                 // M16
  P.spot('Clock Square', -120, y, 660, Math.PI, [-130, 650, -110, 670]);
}

/* ---------------- the N-S streets' sidewalks, lamps and trees ---------------- */
function old_market_walks(K, P, O, T, G) {
  for (const [x0, x1] of [[-48, -45], [-35, -32], [-208, -205], [-195, -192], [112, 115], [125, 128]]) {
    old_walk(K, O, x0, x1, 470, 552); old_walk(K, O, x0, x1, 568, 742);
  }
  for (const [x0, x1] of [[-328, -325], [-315, -312]]) old_walk(K, O, x0, x1, 568, 742);
  // Market Street: lamps every 32 m on the outer edges
  for (const z of [486, 518, 586, 618, 650, 682, 714]) { K.lamp(-49.6, z, 1); K.lamp(-30.4, z, -1); }
  for (const z of [574, 606, 638, 670, 702, 734]) K.lamp(-191.4, z, -1);                                     // the Steep's east side
  for (const z of [490, 522, 586, 618, 650, 682, 714]) K.lamp(111.4, z, 1);
  for (const z of [584, 616, 648, 680, 712]) K.tree(129.2, z);                                               // Lantern: east sidewalk outer edge
  for (const z of [574, 614, 654, 694, 734]) K.lamp(-329.4, z, 1);
  // centre dashes on all four streets
  for (const x of [-40, -200, 120, -320]) for (const [a, b] of [[x === -320 ? 568 : 470, 552], [568, 742]]) {
    if (x === -320 && a === 470) continue;
    for (let z = a + 2; z < b - 4; z += 6) K.dash(x, z, x, z + 3);
  }
}

/* ---------------- 8.7 Footbridge Lane, Rampart Alley, the Old Wall, west blocks ---------------- */
function old_market_west(K, P, O, T, G) {
  // the iron railing that hints at the footbridge, two lamps, and a curb ramp where the lane meets the Steep's west sidewalk
  K.prop(-404, O.baseZ(525) + 0.1, 524.8, -392, O.baseZ(525) + 1.1, 525, 0x2b2b2e);
  K.lamp(-380, 515.3, 1); K.lamp(-300, 524.7, -1);
  { const ly = T(-209.5, 520) + 0.02;
    K.hubbas.push({ a: V(-208, T(-206.5, 520) + 0.15, 520), b: V(-209.6, ly, 520), w: 6, noRails: true, color: 0xd8d0bf }); }
  // the Old Wall: the stretches either side of the Footbridge Lane gap
  old_slopeLedge(K, -403, -401.8, 472, 506, 0.55, 0xc9bfa8, -401.8);
  old_slopeLedge(K, -403, -401.8, 534, 738, 0.55, 0xc9bfa8, -401.8);
  for (const [a, b] of [[472, 506], [534, 738]]) for (let z = a + 2; z < b - 1.2; z += 4) { const g = T(-402.7, z + 1) + 0.55; K.prop(-403, g, z, -402.4, g + 0.4, z + 1.2, 0xc9bfa8); }
  // west blocks
  [[474, 512, 2], [530, 550, 2], [571, 650, 2], [656, 738, 2]].forEach(([a, b, f]) => old_market_bld(K, -390, a, -334, b, f));   // M17-M20
  old_market_bld(K, -314, 474, -266, 512, 3); old_market_bld(K, -254, 474, -212, 512, 3);                   // M23, M24
  old_market_bld(K, -310, 528, -212, 550, 2);                                                                // M25
}

/* ---------------- 8.8 east of Market Street: Lantern Street, the Tile Ledges ---------------- */
function old_market_east(K, P, O, T, G) {
  // the Tile Ledges: two 40 m blue bench ledges on the east sidewalk
  old_slopeLedge(K, 126.2, 126.8, 600, 640, 0.6, 0x3f6fa8, 126.2);
  old_slopeLedge(K, 126.2, 126.8, 652, 692, 0.6, 0x3f6fa8, 126.2);
  for (let z = 600; z < 640; z += 6) K.prop(130.9, T(130, z + 3) + 0.3, z, 131.0, T(130, z + 3) + 3.0, z + 6, 0x3f6fa8);   // the azulejo panel on M6
  // M2-M4 west of Lantern, M5-M7 east of it, M8-M9 beyond
  [[474, 548], [571, 650], [656, 738]].forEach(([a, b]) => { old_market_bld(K, 56, a, 110, b, 3); old_market_bld(K, 131, a, 208, b, 3); });
  old_market_bld(K, 214, 474, 286, 548, 2); old_market_bld(K, 214, 571, 278, 738, 2);   // east edge pulled back from 286: a gate ride drifts south on the 6 % base slope
  P.spot('Tile Ledges', 126.5, -25, 646, Math.PI, [125, 600, 128, 692]);
}

function old_market_buildings(K, P, O, T, G) { /* the 23 buildings are placed with their blocks above */ }

/* ---------------- the filler (CONTRACT 7) ---------------- */
function old_market_fill(K, P, O, T, G) {
  const PI = Math.PI;
  const led = (x, z0, z1, side, h) => old_market_led(K, x, z0, z1, side, h);
  const flat = (x0, z0, x1, z1, h) => old_market_flat(K, x0, z0, x1, z1, h);
  old_market_fill_crosstown(K, P, O, T, G);
  old_market_fill_lanes(K, P, O, T, G);
  old_market_fill_garden(K, P, O, T, G);
  old_market_fill_forecourt(K, P, O, T, G);
  // Rope Walk and Saddler's Alley, z 470..516: a ledge run each side, with a stoop pad
  for (const [w, e, xc] of [[-324.3, -315.7, -320], [-264.5, -255.5, -260]]) {
    led(w, 477, 489, 1); led(e, 497, 509, -1); flat(xc - 2.9, 492, xc - 0.7, 493.2);
  }
  // the Wash and the Santa Brisa Run: the lip of the basins, coping you can grind round
  for (const [a, b, z] of [[-145.2, -130.6, 580], [-125, -120, 580], [-145.2, -130.6, 590], [-125, -120, 590]]) K.rail(a, -19.45, z, b, -19.45, z, 'Coping', false);
  K.rail(-146, -19.45, 580.8, -146, -19.45, 589.2, 'Coping', false); K.rail(-115.5, -19.45, 582.6, -115.5, -19.45, 587.4, 'Coping', false);
  // Clock Lane east of the square: ledges, a bench, a pad
  K.ledge(-98, 656.3, -88, 656.9, 0.45); K.ledge(-76, 663.1, -66, 663.7, 0.45); old_market_flat(K, -60, 657, -57.6, 658.2); K.bench(-84, 662.6, -81.6, 663.2);
  // Market Street: the west pocket (bench, ledge, bank) and the lanes' mouths
  K.bench(-51.4, 650, -50.8, 652.4); K.ledge(-51.6, 640, -50.8, 646, 0.4);
  // the Convent Lane foot
  led(-267.5, 724, 738, 1); led(-252.5, 714, 728, -1); flat(-265.6, 730, -263.2, 731.2);
  old_curbRamp(K, -260, 8, 742, -1);   // up onto the Terrace's north sidewalk (a box face head-on bails)
  old_curbRamp(K, -261, 7, 755, -1);   // and across onto its south sidewalk, towards the Miradouro wall
  // Rampart Alley (x -320, z 524..552): a ledge each side and a pad between
  led(-324.3, 528, 540, 1); led(-315.7, 538, 550, -1); flat(-323.4, 533, -321.4, 534.2);
  // Lantern Street, z 470..600: ledges along the east sidewalk's back edge, with a bank between
  led(129.6, 478, 492, -1, 0.5); led(129.6, 506, 520, -1, 0.5); led(129.6, 530, 544, -1, 0.5); led(129.6, 575, 589, -1, 0.5);
  led(110.6, 484, 498, 1, 0.5); led(110.6, 512, 526, 1, 0.5); led(110.6, 576, 590, 1, 0.5);
  // the Steep and Rampart Street, west sidewalks' back edges
  led(-209.5, 480, 494, 1, 0.5); led(-209.5, 512, 526, 1, 0.5); led(-209.5, 575, 589, 1, 0.5); led(-209.5, 610, 624, 1, 0.5); led(-209.5, 650, 664, 1, 0.5); led(-209.5, 690, 704, 1, 0.5);
  led(-329.6, 580, 594, 1, 0.5); led(-329.6, 620, 634, 1, 0.5); led(-329.6, 660, 674, 1, 0.5); led(-329.6, 700, 714, 1, 0.5);
  led(-310.6, 590, 604, -1, 0.5); led(-310.6, 630, 644, -1, 0.5); led(-310.6, 680, 694, -1, 0.5);
  void PI;
}

/* Crosstown: ledges on alternate sidewalks every 24 m, the east flank, the gate seam */
function old_market_fill_crosstown(K, P, O, T, G) {
  const cross = [-320, -200, -40, 120];
  const clear = (a, b) => !cross.some(k => b > k - 12 && a < k + 12);
  for (let i = 0, x = -306; x < 205; i++, x += 24) {
    const north = i % 2 === 0, a = x, b = x + 10;
    if (!clear(a, b)) continue;
    if (north && b > 54 && a < 66) continue;                       // the bus stop
    if (!north && b > -106 && a < -56) continue;                   // the marble ledges
    if (!north && b > -162 && a < -106) continue;                   // keep the Lavadouro's doorway open
    if (north) K.ledge(a, 552.2, b, 552.8, 0.6, 'ledge'); else K.ledge(a, 567.2, b, 567.8, 0.6, 'ledge');
  }
  // the north sidewalk beside the docks and the hall: bike racks and a hydrant
  K.bikeRack(-14, 553.8, true); K.bikeRack(30, 553.8, true); K.hydrant(75, 552.5); K.newsBoxes(-60, 566.8, true, 2);
  // the east flank x 212..296: ledges on the sidewalks, a roadworks pocket, and pads at the gate seam
  K.ledge(222, 552.2, 232, 552.8, 0.6, 'ledge'); K.ledge(246, 567.2, 256, 567.8, 0.6, 'ledge'); K.ledge(240, 552.2, 250, 552.8, 0.6, 'ledge');
  old_market_flat(K, 272, 552.4, 275, 553.8); old_market_flat(K, 262, 566.2, 265, 567.6);
  // the gate seams: chamfer the flank's sidewalk ends down to the road
  for (const zc of [553.5, 566.5]) K.hubbas.push({ a: V(284, T(284, zc) + 0.15, zc), b: V(285.6, T(285.6, zc) + 0.02, zc), w: 3, noRails: true, color: 0xd8d0bf });
  K.construction(150, 553.5, true);                                // roadworks on the north sidewalk east of Lantern
}

/* Footbridge Lane and Clock Lane: ledges every 22 m, swapping sides */
function old_market_fill_lanes(K, P, O, T, G) {
  const mouths = [[-324, -316], [-264, -256]];
  let i = 0;
  for (let x = -384; x < -222; x += 22, i++) {
    const a = x, b = x + 9;
    if (mouths.some(([m0, m1]) => b > m0 && a < m1)) continue;
    if (i % 2) K.ledge(a, 516.3, b, 516.9, 0.45); else K.ledge(a, 523.1, b, 523.7, 0.45);
  }
  K.bikeRack(-350, 517.2, true); K.bikeRack(-290, 522.8, true); K.bikeRack(-240, 517.2, true);
  old_market_flat(K, -372, 522.6, -369.6, 523.8); old_market_flat(K, -312, 516.2, -309.6, 517.4); old_market_flat(K, -276, 522.6, -273.6, 523.8);
  K.bench(-340, 516.2, -337.6, 516.8); K.planter(-232, 516.4, -229, 517.9, 0.5);
}

/* the Jardim: the open lot east of Market Street (x -28..54, z 574..736): a wall along the street, a flight of garden steps, trees */
function old_market_fill_garden(K, P, O, T, G) {
  // a low wall along Market Street's east side, in three runs with two gateways
  old_market_led(K, -29.6, 578, 618, -1, 0.5); old_market_led(K, -29.6, 628, 668, -1, 0.5); old_market_led(K, -29.6, 678, 718, -1, 0.5);
  // the garden steps: four flights of six drops down the 7 % slope, each landing a raised box
  const at = [612, 638, 664, 690], x0 = 8, x1 = 16;
  let top = G(590);
  K.B(x0, G(612) - 0.5, 590, x1, top, 612, 'step', { edges: 'we', color: 0xd8d0bf });
  at.forEach((z, i) => {
    const bot = G(z + 2);
    K.stairSpot('z', z, 1, x0, x1, top, bot, 6, 0.4, { rails: [12] });
    const zb = i < 3 ? at[i + 1] : 716;
    K.B(x0, G(zb) - 0.5, z + 2, x1, bot, zb, 'step', { edges: 'we', color: 0xd8d0bf });
    top = bot;
  });
  for (let z = 586; z < 730; z += 24) { K.tree(-18, z); K.tree(40, z + 12); }
  K.planter(-8, 600, -5, 603, 0.55); K.planter(26, 650, 29, 653, 0.55); K.planter(-8, 700, -5, 703, 0.55);
  K.bench(26, 610, 28.4, 610.6); K.bench(26, 690, 28.4, 690.6); K.bench(-14, 660, -11.6, 660.6);
  for (const z of [625, 670, 705]) old_market_flat(K, 30, z, 33, z + 1.2);
  P.spot('Jardim Steps', 12, G(650), 650, Math.PI, [6, 588, 18, 718]);
}

/* the Convent forecourt (x -311..-224, z 568..604): ledges, planters, benches on the way down to the terrace */
function old_market_fill_forecourt(K, P, O, T, G) {
  for (const [a, b, z] of [[-300, -286, 576], [-270, -256, 582], [-240, -226, 576]]) K.ledge(a, z, b, z + 0.6, 0.45);
  K.planter(-278, 592, -275, 594.5, 0.55); K.planter(-248, 592, -245, 594.5, 0.55);
  K.bench(-292, 596, -289.6, 596.6); K.bench(-262, 598, -259.6, 598.6);
  old_market_flat(K, -285, 586, -282, 587.2); old_market_flat(K, -235, 586, -232, 587.2);
  // the yard between the Seminary and the Steep, and the small square beside the wash house
  K.ledge(-188, 575, -176, 575.6, 0.45); K.bench(-184, 590, -181.6, 590.6); K.ledge(-86, 576, -74, 576.6, 0.45); K.ledge(-72, 592, -62, 592.6, 0.45);
  K.planter(-96, 588, -93, 590.5, 0.55);
}

/* ---------------- spots, challenges, tapes ---------------- */
function old_market_life(K, P, O, T, G) {
  const PI = Math.PI, FLIP = 'flip|shuv|Shove|Impossible|Varial';
  P.spot('Market Tiers', -120, -16.03, 504, PI, [-190, 474, -50, 536]);
  P.challenge({ id: 'old-tier-flip', name: 'Tier Drop Flip', desc: 'Flip trick off the first market tier on to the second (not the stairs)',
    at: [-150, -14.65, 492], go: [-150, -14.65, 478, PI], kind: 'trick', trick: FLIP,
    from: [-190, 484, -50, 494.1, -15.0], to: [-190, 495, -50, 514, -16.4, -15.6], notIn: [-126, 493, -114, 497] });
  P.challenge({ id: 'old-convent-gap', hard: true, name: 'Convent Double', desc: 'Clear both flights and the landing of the convent double set',
    at: [-260, -21.27, 640], go: [-260, -21.27, 616, PI], kind: 'gap',
    from: [-270, 630, -250, 642.1, -21.6], to: [-272, 650, -248, 668, -25.2, -24.2] });
  // pull-off pockets on the long lines (a named spot at least every 150 m on a main line)
  P.spot('Tiers East Edge', -44, G(512), 512, PI, [-52, 496, -34, 530]);
  P.spot('Jardim Wall', -30, G(600), 600, PI, [-36, 576, -26, 626]);
  P.spot('Market Street Foot', -42, G(690), 690, PI, [-52, 670, -30, 720]);
  P.spot('Rampart Alley', -320, G(538), 538, PI, [-326, 524, -314, 552]);
  P.spot('Convent Lane', -260, G(695), 695, PI, [-268, 672, -252, 740]);
  P.spot('Lantern Pocket', 122, G(712), 712, PI, [110, 690, 130, 738]);
  P.spot('Footbridge Lane', -300, -17.91, 520, PI, [-400, 515, -216, 525]);
  P.tape(-122, 585, -21.35);
  P.tape(-98.5, 500.6, -15.23);
}

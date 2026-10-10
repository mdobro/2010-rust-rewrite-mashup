/* Old Town, the Upper Town: Alto Walk, the Grand Boulevard and its Rambla, Bishop's Steps, Santa Brisa, Fountain Square with the Gull
   Fountain, Cafe Gaivota, the Tile Works with its Loading Steps, Lemon Square, the Cafe Steps, the top of Lantern Street, the first
   piece of the Old Wall, 24 buildings, Tile & Truck, and the filler that keeps the alleys from going dead (CONTRACT 7).
   Design: levels/porto/design/old.md section 7. Rect [-420, 300, 230, 470]. */

function old_upper(K, P, O) {
  const T = (x, z) => K.terrainH(x, z);
  const G = z => O.Gk(z);
  old_upper_apron(K, -150, 446, 6);     // the Gull Fountain
  old_upper_apron(K, 121, 425, 4.5);    // the Lemon bowl
  old_upper_alto(K, P, O, T);
  old_upper_boulevard(K, P, O, T, G);
  old_upper_bishop(K, P, O, T, G);
  old_upper_brisa(K, P, O, T, G);
  old_upper_square(K, P, O, T, G);
  old_upper_cafe(K, P, O, T, G);
  old_upper_tile(K, P, O, T, G);
  old_upper_lemon(K, P, O, T, G);
  old_upper_wall(K, P, O, T);
  old_upper_buildings(K, P, O, T);
  old_upper_fill(K, P, O, T, G);
  old_upper_life(K, P, O, T, G);
}

/* a bowl on a sloping square: the ground mesh draws a pool's whole 8 m-snapped patch in the pool colours wherever it lies
   under the rim, so the square is levelled at rim height over that patch (a flat stone apron) and eases back to the slope
   over m metres round it */
function old_upper_apron(K, cx, cz, r, m = 8) {
  const y0 = K.terrainH(cx, cz), x0 = Math.floor((cx - r - 1) / 8) * 8, x1 = Math.ceil((cx + r + 1) / 8) * 8,
    z0 = Math.floor((cz - r - 1) / 8) * 8, z1 = Math.ceil((cz + r + 1) / 8) * 8;
  K.feat(x0 - m, x1 + m, z0 - m, z1 + m, (x, z, h) => {
    const d = Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(z0 - z, 0, z - z1)), t = Math.min(1, d / m), s = t * t * (3 - 2 * t);
    return y0 + (h - y0) * s;
  }, 'set');
}

/* a building with a stepped cornice and a terracotta roof slab (design 7.10) */
function old_upper_bld(K, x0, z0, x1, z1, floors, color, tex) {
  K.building(x0, z0, x1, z1, floors, color, tex);
  const top = K.groundMax(x0, z0, x1, z1) + floors * 3.4;
  K.prop(x0 - 0.2, top - 0.5, z0 - 0.2, x1 + 0.2, top, z1 + 0.2, 0xf1ead8);
  K.prop(x0 - 0.4, top, z0 - 0.4, x1 + 0.4, top + 0.5, z1 + 0.4, 0xa94f32);
}

/* a picnic table standing on a deck at height y (K.picnic stands on the ground, which is below a deck) */
function old_upper_picnic(K, x, y, z) {
  K.B(x - 1.0, y, z - 0.4, x + 1.0, y + 0.76, z + 0.4, 'wood', { edges: 'ns' });
  for (const s of [-1, 1]) K.B(x - 1.0, y, z + s * 0.75 - 0.14, x + 1.0, y + 0.45, z + s * 0.75 + 0.14, 'wood', { edges: 'ns' });
}

/* ---------------- 7.1 Alto Walk ---------------- */
function old_upper_alto(K, P, O, T) {
  const y = O.Y.walk;
  // slappy curbs: 0.2 m tall, in runs, broken for the Boulevard and each alley mouth
  for (const [a, b] of [[-315, -266], [-254, -131], [-112, -93], [-20, 33], [47, 206]]) K.B(a, y - 0.4, 254.0, b, y + 0.2, 254.4, 'curb', { edges: 'ns' });
  for (const x of [-300, -200, -100, 100, 180]) K.planter(x - 1.5, 247, x + 1.5, 248.5, 0.55);
  for (const x of [-280, -160, 60, 150]) K.bench(x, 252.4, x + 2.4, 253);
  for (let x = -320; x <= 208; x += 32) if (!(x >= -60 && x <= -20)) K.lamp(x, 247, 1);
}

/* ---------------- 7.2 Grand Boulevard ---------------- */
function old_upper_boulevard(K, P, O, T, G) {
  old_walk(K, O, -55, -50, 230, 400);    // from the border itself (the fin handshake)
  old_walk(K, O, -30, -25, 230, 400);
  for (let z = 232; z < 262; z += 6) K.dash(-40, z, -40, z + 3);
  // the Rambla median: three segments, a noRails deck and two 0.45 ledges each (six sloped ledges)
  for (const [z0, z1] of [[262, 300], [304, 344], [348, 390]]) {
    K.hubbas.push({ a: V(-40, G(z0) + 0.15, z0), b: V(-40, G(z1) + 0.15, z1), w: 6, noRails: true, color: 0xd8d0bf });
    old_slopeLedge(K, -43, -42.4, z0, z1, 0.45, 0xe9e1cf, -43);
    old_slopeLedge(K, -37.6, -37, z0, z1, 0.45, 0xe9e1cf, -37);
  }
  // trees staggered off the deck's centre line, so the centre stays a clear manual lane and the line in from fin's boulevard rolls on
  [270, 286, 312, 328, 356, 372].forEach((z, i) => K.tree(i % 2 ? -38.4 : -41.6, z));
  for (const z of [302, 346]) { K.zebra(-46.5, z, 'x', 4); K.zebra(-33.5, z, 'x', 4); }
  for (let z = 270; z <= 366; z += 32) { K.lamp(-54.2, z, 1); K.lamp(-25.8, z, -1); }
  // hydrants and bins on the outer sidewalks
  K.hydrant(-53.4, 290); K.hydrant(-26.6, 340); K.trashCan(-53.2, 330); K.trashCan(-26.8, 280);
  // Tile & Truck, in the west front of the Tile Works block on the east sidewalk
  const sy = G(360) + 0.15;
  P.shop({ name: 'Tile & Truck', sign: [-25.04, sy + 3.85, 360, -Math.PI / 2, 7],
    awning: [-26.6, 354, -25, 366, sy + 2.2, 'x'], zone: [-28.2, 356, -25.2, 364], door: [-25.2, sy, 360] });
  P.travel('Tile & Truck', -27.5, sy, 360, Math.PI / 2, 'spot');
  K.prop(-25.15, sy + 0.2, 353.5, -25, sy + 3.0, 366.5, 0x3f6fa8);                      // the azulejo panel round the door
  K.prop(-25.3, sy + 0.2, 359, -25.15, sy + 2.6, 361, 0x2b2b2b);                         // the door
  K.newsBoxes(-26.2, 372, false, 2);
}

/* ---------------- 7.3 Bishop's Steps ---------------- */
function old_upper_bishop(K, P, O, T, G) {
  // 4 flights of 6 drops, each landing a raised box whose east edge drops into the ramp lane
  const fl = [[275.01, -1.450, -3.337], [301.96, -3.337, -5.225], [328.92, -5.225, -7.112], [355.87, -7.112, -9.000]];
  K.B(-128, G(275.01) - 0.5, 254, -120, -1.45, 275.01, 'step', { edges: 'e', color: 0xd8d0bf });                 // L0
  fl.forEach(([at, top, bot], i) => {
    K.stairSpot('z', at, 1, -128, -120, top, bot, 6, 0.4, { rails: [-124] });
    if (i < 3) { const za = at + 2.0, zb = fl[i + 1][0]; K.B(-128, G(zb) - 0.5, za, -120, bot, zb, 'step', { edges: 'e', color: 0xd8d0bf }); }
  });
  K.trashCan(-114.5, 270); K.hydrant(-114.5, 310);
}

/* ---------------- 7.4 Santa Brisa ---------------- */
function old_upper_brisa(K, P, O, T, G) {
  const yb = O.Y.brisa;
  K.B(-190, -12.4, 357.87, -90, yb, 400, 'plaza', { edges: 'sew', color: 0xe9e1cf });
  // the Brisa 10 with its rail and a hubba each side, and the Brisa Bank beside it
  K.stairSpot('z', 400, 1, -160, -140, yb, -12.05, 10, 0.4, { rails: [-150], hubbas: [-160.4, -139.6] });
  K.hubbas.push({ a: V(-181, yb, 400), b: V(-181, -12.28, 410), w: 14, noRails: true, color: 0xc4bfb3 });
  old_upper_bld(K, -164, 326, -136, 372, 4, 0xe9e1cf, 'stone');                                                // the nave
  K.building(-178, 360, -168, 370, 10, 0xe9e1cf, 'stone');                                                     // the bell tower
  // dressing on the terrace (boxes on the terrace top, not on the ground below it)
  K.B(-186, yb, 376, -182, yb + 0.55, 379, 'ledge', { edges: 'nswe' });
  K.B(-98, yb, 376, -94, yb + 0.55, 379, 'ledge', { edges: 'nswe' });
  for (const [x, z] of [[-112, 390], [-104, 390], [-186, 366]]) K.B(x, yb, z, x + 2.4, yb + 0.45, z + 0.6, 'wood', { edges: 'ns' });   // off the ramp lane, the 10 and the bank run-ups
  K.prop(-151.5, yb, 372, -148.5, yb + 5, 372.15, 0x6b4a32);                                                  // the door
  K.decorFns.push(D => {
    D.sign('SANTA BRISA', -150, yb + 6.2, 372.1, 8, 1, 0, '#3a3226', '#e9e1cf');
    D.prop(-164, yb + 13.6, 371.9, -136, yb + 17, 372.1, 0xe9e1cf);                                            // the gable
    D.add(new THREE.SphereGeometry(7, 20, 12), 0xc9b48a, [-150, yb + 14, 340], [0, 0, 0], [1, 0.7, 1]);       // the dome
    D.add(new THREE.CylinderGeometry(1.4, 1.8, 2.6, 10), 0xe9e1cf, [-150, yb + 18.6, 340]);                    // its lantern
    D.add(new THREE.ConeGeometry(4.2, 8, 4), 0xa94f32, [-173, 29, 365], [0, Math.PI / 4, 0]);                  // the spire, y 25..33
    D.add(new THREE.CircleGeometry(1.6, 16), 0x3f6fa8, [-150, yb + 9, 372.16]);                                // the rose window
  });
  P.travel('Santa Brisa', -150, yb, 385, Math.PI, 'spot');
}

/* ---------------- 7.5 Fountain Square ---------------- */
function old_upper_square(K, P, O, T, G) {
  // wave paving: six sine lines of 2 m dashes
  for (const zr of [412, 422, 432, 456, 462, 466]) for (let x = -222; x < -30; x += 1) {
    const xm = x + 0.5; if (xm > -160 && xm < -140 && zr > 430 && zr < 460) continue;
    K.dash(x, zr + 1.2 * Math.sin(2 * Math.PI * x / 9), x + 1, zr + 1.2 * Math.sin(2 * Math.PI * (x + 1) / 9), 0x4a4741, 0.3);
  }
  // the Gull Fountain: a bowl r 6 d 1.5 inside a 16 m wall with a 3 m gap in the middle of each side
  K.fountainBowl(-150, 446, 6, 1.5);
  K.ledge(-158, 438, -151.5, 438.6, 0.45); K.ledge(-148.5, 438, -142, 438.6, 0.45);
  K.ledge(-158, 453.4, -151.5, 454, 0.45); K.ledge(-148.5, 453.4, -142, 454, 0.45);
  K.ledge(-158, 438, -157.4, 444.5, 0.45); K.ledge(-158, 447.5, -157.4, 454, 0.45);
  K.ledge(-142.6, 438, -142, 444.5, 0.45); K.ledge(-142.6, 447.5, -142, 454, 0.45);
  const gy = T(-150, 446);
  K.prop(-150.45, gy - 1.5, 445.55, -149.55, gy + 3.5, 446.45, 0xe9e1cf);                                     // the column, from the bowl floor
  K.decorFns.push(D => {
    D.add(new THREE.SphereGeometry(0.9, 12, 8), 0xf1ead8, [-150, gy + 3.9, 446], [0, 0, 0], [1.5, 0.8, 0.8]);   // the gull
    D.add(new THREE.ConeGeometry(0.35, 1.2, 6), 0xd9a441, [-148.8, gy + 3.9, 446], [0, 0, -Math.PI / 2]);
    D.add(new THREE.BoxGeometry(0.1, 0.05, 2.4), 0xf1ead8, [-150.2, gy + 4.15, 446], [0, 0.2, 0.25]);
  });
  // the West Arcade: 11 pillars, a roof, a 60 m plinth ledge
  for (let k = 0; k <= 10; k++) { const z = 406 + 6 * k, g = T(-222.6, z); K.B(-222.6, g - 0.3, z, -222.0, g + 4, z + 0.6, 'plaza', { color: 0xe9e1cf }); }
  const ga = T(-226, 435);
  K.prop(-230, ga + 4, 404, -222, ga + 4.6, 466, 0xa94f32);
  old_slopeLedge(K, -222.0, -221.4, 406, 466, 0.45, 0xe9e1cf, -221.4);
  // furniture
  for (const z of [418, 432]) for (const x of [-208, -190, -172]) K.bench(x, z, x + 2.4, z + 0.6);
  for (const [x, z] of [[-200, 460], [-100, 460], [-60, 425], [-110, 425]]) { K.planter(x - 1.2, z - 1.2, x + 1.2, z + 1.2, 0.55); K.tree(x, z); }
  for (const [x, z] of [[-226, 402], [-28, 402], [-226, 468], [-28, 468], [-156, 428], [-156, 460]]) K.lamp(x, z, 1);
  K.newsBoxes(-52, 408, true, 2); K.trashCan(-175, 421); K.trashCan(-95, 428);
}

/* ---------------- 7.6 Cafe Gaivota ---------------- */
function old_upper_cafe(K, P, O, T, G) {
  const y = -10.75;
  K.B(-84, -12.4, 384, -57, y, 400, 'wood', { edges: 'sw', color: 0x8a6a4a });
  K.SET('z', 400, 1, -74, -67, y, -11.94, 4, 0.4);
  for (const z of [388.5, 393, 397.5]) old_upper_picnic(K, -79, y, z);
  K.prop(-84, y + 2.4, 382, -57, y + 2.55, 388, 0xc0623f);
  K.decorFns.push(D => D.sign('CAFE GAIVOTA', -70, y + 3.2, 382.1, 6, 0.9, 0, '#ffffff', '#3f6fa8'));
}

/* ---------------- 7.7 Tile Works and the Loading Steps ---------------- */
function old_upper_tile(K, P, O, T, G) {
  old_upper_bld(K, 47, 258, 96, 404, 2, 0xa5553a, 'brick');
  K.decorFns.push(D => {
    const g = T(88, 300) + 6.8;
    D.add(new THREE.CylinderGeometry(1.4, 1.7, 22, 12), 0x8d4a35, [88, g + 11, 300]);                          // the chimney
    for (const z of [276, 292, 308, 324, 340, 356, 372, 388]) D.prop(48, g - 0.2, z, 95, g + 1.4, z + 8, 0x8a8f94); // the saw-tooth roof
    D.sign('AZULEJARIA NOVA', 46.95, G(300) + 5.5, 300, 10, 1.2, -Math.PI / 2, '#ffffff', '#3f6fa8');
  });
  // nine platforms along the west face: a gap-to-gap line
  for (let k = 0; k < 9; k++) {
    const z0 = 262 + 14.5 * k, top = G(z0) + 0.25;
    K.B(44, G(z0 + 12) - 0.5, z0, 47, top, z0 + 12, 'garage', { edges: 'ws' });
    K.prop(43.8, top - 0.4, z0 + 1, 44, top - 0.1, z0 + 11, 0x3a3d42);                                         // the dock bumper
  }
  // the alley: pallets and two dumpsters
  for (const z of [300, 340, 372]) K.pad(37, z, 38.2, z + 1.2, 0.18);
  K.dumpster(37.2, 280, false); K.dumpster(37.2, 356, false);
}

/* ---------------- 7.8 Lemon Square, Lemon Lane, the Cafe Steps, top of Lantern ---------------- */
function old_upper_lemon(K, P, O, T, G) {
  K.fountainBowl(121, 425, 4.5, 1.1);
  for (let k = 0; k < 6; k++) { const a = (30 + 60 * k) * Math.PI / 180; if (k === 3) continue; K.tree(121 + 9 * Math.cos(a), 425 + 9 * Math.sin(a)); }
  K.bench(113.7, 428.8, 114.3, 431.2); K.bench(127.7, 423.8, 128.3, 426.2); K.bench(119.8, 417.7, 122.2, 418.3); K.bench(119.8, 431.7, 122.2, 432.3);
  // the Cafe Steps: three wooden decks, each south edge a drop
  [[404, 418], [418, 432], [432, 446]].forEach(([z0, z1]) => {
    K.B(150, T(170, z1) - 0.5, z0, 190, T(170, z0) + 0.03, z1, 'wood', { edges: 's', color: 0x8a6a4a });   // flush at the north edge, so it rolls on
  });
  K.decorFns.push(D => { const geo = new THREE.ConeGeometry(1.3, 0.5, 8), pole = new THREE.CylinderGeometry(0.04, 0.04, 2.0, 6);
    for (const [x, z, y] of [[158, 410, K.terrainH(170, 404) + 0.03], [172, 411, K.terrainH(170, 404) + 0.03], [160, 425, K.terrainH(170, 418) + 0.03], [178, 426, K.terrainH(170, 418) + 0.03], [165, 439, K.terrainH(170, 432) + 0.03]]) {
      D.add(pole, 0xdedad2, [x, y + 1.0, z]); D.add(geo, 0xc0623f, [x, y + 2.2, z]); } });
  // the top of Lantern Street: two sidewalks, centre dashes
  old_walk(K, O, 112, 115, 446, 470, { ramps: [true, false] });
  old_walk(K, O, 125, 128, 446, 470, { ramps: [true, false] });
  for (let z = 449; z < 466; z += 6) K.dash(120, z, 120, z + 3);
  K.lamp(111.4, 458, 1); K.lamp(128.6, 458, -1);
}

/* ---------------- 7.11 the Old Wall, upper piece ---------------- */
function old_upper_wall(K, P, O, T) {
  old_slopeLedge(K, -403, -401.8, 256, 468, 0.55, 0xc9bfa8, -401.8);
  for (let z = 258; z < 466; z += 4) { const g = T(-402.7, z + 1) + 0.55; K.prop(-403, g, z, -402.4, g + 0.4, z + 1.2, 0xc9bfa8); }   // crenellations
}

/* ---------------- 7.10 the 24 buildings (U12 and U13 are in the church, U20 in the Tile Works) ---------------- */
function old_upper_buildings(K, P, O, T) {
  const L = [0xf1ead8, 0xd9a441, 0xd99a8c, 0xeee8da, 0xc0623f, 0xe9e1cf, 0xb9a88f];
  const b = (x0, z0, x1, z1, f, c, tex) => old_upper_bld(K, x0, z0, x1, z1, f, c ?? K.pick(L), tex ?? K.pick(['stone', 'stone', 'brick']));
  [[262, 300], [306, 344], [350, 388], [394, 432], [438, 466]].forEach(([a, c]) => b(-390, a, -336, c, 2));      // U1-U5, west hill
  [[262, 330], [336, 404], [410, 466]].forEach(([a, c]) => b(-314, a, -266, c, 3));                              // U6-U8
  [[262, 320], [326, 396]].forEach(([a, c]) => b(-254, a, -196, c, 3));                                          // U9-U10
  b(-254, 404, -232, 466, 3);                                                                                   // U11, behind the arcade
  b(-190, 262, -131, 322, 3, 0xe9e1cf, 'stone');                                                                // U14 Bishop's Palace
  b(-112, 262, -93, 354, 3);                                                                                    // U15
  b(-81, 262, -58, 336, 3); b(-81, 340, -58, 382, 3, 0xd99a8c, 'stone');                                        // U16, U17 the cafe
  b(-25, 262, 33, 330, 3); b(-25, 336, 33, 396, 3, 0xe9e1cf, 'stone');                                          // U18, U19 the shop
  b(100, 262, 146, 398, 3); b(152, 262, 208, 398, 3); b(214, 262, 286, 440, 2);                                 // U21-U23
  b(-22, 428, 88, 466, 2, 0xd9a441, 'stone');                                                                   // U24 Customs House
}

/* ---------------- the filler: small skateable things so no stretch goes dead ---------------- */
function old_upper_fill(K, P, O, T, G) {
  // a ground-hugging ledge run along a z line (0.6 wide, grinds as one): the alleys' edge furniture
  // (a sloped ledge with ONE grind line, chords of up to 40 m; side +1 puts the line on the east edge)
  const led = (x, z0, z1, side, h = 0.45) => old_slopeLedge(K, x - 0.3, x + 0.3, z0, z1, h, 0xc9bfa8, x + 0.3 * side);
  const flat = (x0, z0, x1, z1, h = 0.18) => K.Bg(x0, z0, x1, z1, h, 'pad', { edges: '' });          // a manual pad: no grind lines
  // Rope Walk (x -320) and Saddler's Alley (x -260): a 12 m ledge run every 22 m, swapping sides, with a stoop pad between
  for (const [xc, w, e] of [[-320, -324.3, -315.7], [-260, -264.5, -255.5]]) {
    for (let i = 0, z = 268; z < 466; i++, z += 22) led(i % 2 ? e : w, z, Math.min(z + 12, 468), i % 2 ? -1 : 1);
    for (let z = 296, i = 0; z < 460; z += 44, i++) { const x = xc + (i % 2 ? 2.6 : -2.6); flat(x - 0.6, z, x + 0.6, z + 1.2); }
  }
  // Bell Alley (x -87) down to the cafe
  [[270, -90.6, 1], [292, -83.4, -1], [314, -90.6, 1], [336, -83.4, -1]].forEach(([z, x, sd]) => led(x, z, z + 12, sd));
  flat(-88.2, 358, -85.8, 359.2);
  // Lemon Lane (z 420, level): ledge boxes along both edges, a bench and planters
  [[-12, 0, 414.6], [12, 24, 424.8], [46, 58, 414.6], [62, 74, 424.8], [78, 90, 414.6]].forEach(([a, b, z]) => K.ledge(a, z, b, z + 0.6, 0.45, 'ledge'));
  K.bench(28, 414.4, 30.4, 415); K.planter(-4, 426.4, -1, 428, 0.55); K.planter(28, 426.4, 32, 428, 0.55); flat(42.6, 404.4, 43.8, 405.6);
  // the cross lanes of the west hill and the east blocks: a manual pad in each
  for (const z of [303, 347, 391, 435]) flat(-366, z - 1, -358, z + 1);
  for (const x of [149, 211]) old_slopeLedge(K, x - 0.5, x + 0.5, 312, 326, 0.3, 0xc9bfa8, x - 0.5);
  // Alto Walk: bike racks, bins and a couple of ledges to fill the long gaps
  K.bikeRack(-225, 248, true); K.bikeRack(130, 248, true); K.bikeRack(-8, 248, true);
  K.ledge(-76, 255.6, -64, 256.2, 0.45); K.ledge(-12, 255.6, 0, 256.2, 0.45); K.ledge(-308, 246.8, -296, 247.4, 0.45);
  K.trashCan(-248, 247.4); K.trashCan(8, 247.4); K.trashCan(118, 247.4);
  // the square: a long ledge by the Market Street mouth, and the church terrace ledge
  K.ledge(-62, 441, -50, 441.6, 0.45); K.ledge(-60, 405.4, -48, 406, 0.45);
  K.B(-136, O.Y.brisa, 366, -126, O.Y.brisa + 0.45, 366.6, 'ledge', { edges: 'ns' });
  // the top of Lantern Street: planters on the sidewalks
  K.planter(128.6, 452, 130, 456, 0.5); K.planter(110, 462, 111.4, 466, 0.5);
}

/* ---------------- spots, challenges, tapes, travel ---------------- */
function old_upper_life(K, P, O, T, G) {
  const PI = Math.PI, FLIP = 'flip|shuv|Shove|Impossible|Varial';
  P.spot('Rambla', -40, -6.77, 326, PI, [-44, 262, -36, 390]);
  P.spot('Alto Walk', -150, -1.45, 250, PI, [-332, 246, 212, 255]);
  P.spot('Bishop\'s Steps', -124, -5, 316, PI, [-128, 254, -115, 358]);
  P.spot('Santa Brisa Steps', -150, -9.0, 398, PI, [-190, 358, -90, 410]);
  P.spot('Gull Fountain', -150, -13.56, 446, PI, [-158, 438, -142, 454]);
  P.spot('Cafe Gaivota', -70, -10.75, 392, PI, [-84, 384, -57, 402]);
  P.spot('Loading Steps', 45.5, -6, 326, PI, [44, 262, 47, 390]);
  P.spot('Lemon Square', 121, -12.82, 425, PI, [92, 404, 190, 446]);
  P.travel('Tile Works', 40, -1.6, 256, PI, 'spot');
  // pull-off pockets on the long lines (named spots every 150 m on main lines)
  P.spot('Rope Walk Stoops', -320, G(285), 285, PI, [-326, 266, -314, 304]);
  P.spot('Rope Walk Bend', -320, G(385), 385, PI, [-326, 366, -314, 404]);
  P.spot('Rope Walk Foot', -320, G(455), 455, PI, [-326, 440, -314, 470]);
  P.spot('Market Street Mouth', -42, G(452), 452, PI, [-64, 438, -34, 468]);
  P.spot('Lantern Top', 120, G(458), 458, PI, [110, 448, 130, 468]);
  P.challenge({ id: 'old-brisa-flip', name: 'Kickflip the Brisa Ten', desc: 'Kickflip down the Santa Brisa ten-stair off the church terrace',
    at: [-150, -9.0, 398], go: [-150, -9.0, 380, PI], kind: 'trick', trick: 'Kickflip',
    from: [-160, 388, -140, 400.2, -9.4], to: [-162, 403.4, -138, 425, -13.5, -11.4] });
  P.challenge({ id: 'old-brisa-tre', hard: true, name: '360 Flip the Brisa Ten', desc: 'A 360 flip down the whole ten',
    at: [-146, -9.0, 398], go: [-150, -9.0, 380, PI], kind: 'trick', tricks: ['360 Flip'],
    from: [-160, 388, -140, 400.2, -9.4], to: [-162, 403.4, -138, 425, -13.5, -11.4] });
  P.challenge({ id: 'old-tile-gap', name: 'Loading Steps Gap', desc: 'Ollie from the fifth loading platform to the sixth',
    at: [45.5, -7.11, 334], go: [45.5, -6.10, 322, PI], kind: 'gap',
    from: [44, 320, 47, 332, -6.4], to: [44, 334.5, 47, 346.5, -7.5, -6.8] });
  P.challenge({ id: 'old-rambla', name: 'Ride the Rambla', desc: 'Grind a Rambla median ledge down the Grand Boulevard',
    at: [-43, -3.5, 280], go: [-43, -1.6, 258, PI], kind: 'grind', rail: 'Ledge', area: [-44, 262, -36, 390] });
  P.tape(45.5, 386, -10.16);
  P.tape(-150, 324, -6.63);
}

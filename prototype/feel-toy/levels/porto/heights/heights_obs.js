/* The Heights, the observatory part: x 100..480, z -650..-230 (design/heights.md 4 O1-O7, 7.1 dome, 10.3).
   Ridge Road 100..480, Observatory Road and Planetarium Drive (sloped sidewalks), the Podium with the Observatory Ledge,
   the Dome Court and the dome, the Observatory Steps and Walk, the Forecourt, the Stargazer Decks and their lane, six villas;
   the filler that keeps every street from going dead; signs, challenges, tape, spots.
   Traffic, peds and the ledge skater are registered in index.js. */
function heights_obs(K, P, PL) {
  heights_obs_ridge(K, P);
  heights_obs_roads(K, P);
  heights_obs_podium(K, P);
  heights_obs_steps(K, P);
  heights_obs_walk(K, P);
  heights_obs_forecourt(K, P);
  heights_obs_decks(K, P, PL);
  heights_obs_villas(K, P);
  heights_obs_trees(K);
}

/* a ground-following ledge: a slab with no side rails and one grind line down its top */
function heights_obs_ledge(K, ax, az, bx, bz, hgt, w, seg) {
  K.strip(ax, az, bx, bz, hgt, w, { kind: 'Ledge', noRails: true, color: 0xa9a59c, seg: seg || 9 });
  K.rail(ax, K.terrainH(ax, az) + hgt, az, bx, K.terrainH(bx, bz) + hgt, bz, 'Ledge', false);
}

/* a sloped sidewalk on a z-running road: top 0.15 over the ground, one hubba per straight run of ground; a curb rail on long runs */
function heights_obs_zwalk(K, xc, xe, w, breaks, curbFrom) {
  for (let i = 0; i + 1 < breaks.length; i++) {
    const z0 = breaks[i], z1 = breaks[i + 1], y0 = K.terrainH(xc, z0) + 0.15, y1 = K.terrainH(xc, z1) + 0.15, hi = y0 >= y1;
    K.hubbas.push({ a: V(xc, hi ? y0 : y1, hi ? z0 : z1), b: V(xc, hi ? y1 : y0, hi ? z1 : z0), w, noRails: true, color: 0xc4c0b6 });
    if (z1 - z0 >= curbFrom) K.rail(xe, K.terrainH(xe, z0) + 0.15, z0, xe, K.terrainH(xe, z1) + 0.15, z1, 'Curb', false);
  }
}

/* a small piece of street furniture centred on (x, z); alongX: which way the street runs; lift: the sidewalk's height over the ground;
   side: which side of the street it stands on (+1 south or east) */
function heights_obs_piece(K, kind, x, z, alongX, lift, side) {
  const lf = lift || 0;
  if (alongX) {
    const al = side > 0 ? 'n' : 's', box = (hu, hv, h, mat, edges) => K.Bg(x - hu, z - hv, x + hu, z + hv, h + lf, mat, { edges });
    switch (kind) {
      case 'ledge': box(4, 0.3, 0.45, 'ledge', al); break;
      case 'bench': box(1.1, 0.3, 0.45, 'wood', ''); break;
      case 'planter': box(1.5, 0.6, 0.55, 'ledge', ''); break;
      case 'pad': box(3, 0.7, 0.18, 'pad', ''); break;
      case 'kick': K.kicker(x - 4.5, z, 1, 0, 2.4, 0.5, 1.3); box(2.6, 0.7, 0.18, 'pad', ''); break;
      case 'rack': K.bikeRack(x, z, true); K.trashCan(x + 3, z); break;
      case 'gap': K.crossingGap(x - 3.5, z, x + 3.5, z, 0.4); break;
      case 'hydrant': K.hydrant(x, z); K.newsBoxes(x + 2.2, z, true, 2); break;
      case 'jersey': K.jersey(x - 2.2, z - 0.25, x + 2.2, z + 0.25); break;
    }
  } else {
    switch (kind) {
      case 'ledge': heights_obs_ledge(K, x, z - 4.5, x, z + 4.5, 0.45 + lf, 0.6); break;
      case 'planter': heights_obs_ledge(K, x, z - 2, x, z + 2, 0.55 + lf, 1.2); break;
      case 'bench': K.Bg(x - 0.3, z - 1.1, x + 0.3, z + 1.1, 0.45 + lf, 'wood', { edges: '' }); break;
      case 'kick': K.kicker(x, z - 1.2, 0, 1, 2.4, 0.5, 1.4); break;
      case 'rack': K.bikeRack(x, z, false); K.trashCan(x, z + 3); break;
      case 'hydrant': K.hydrant(x, z); K.newsBoxes(x, z + 2.2, false, 2); break;
      case 'long': heights_obs_ledge(K, x, z - 7, x, z + 7, 0.45 + lf, 0.6, 14); break;
    }
  }
}

/* pieces along a straight flat street z = c (x from..to), one every `step` m, alternating sides at v = +-vw */
function heights_obs_row(K, c, from, to, step, vw, kinds, lift, phase, skip) {
  let side = 1, i = phase || 0;
  for (let u = from; u <= to; u += step) {
    if (skip && skip(u, side)) { side = -side; if (skip(u, side)) continue; }
    heights_obs_piece(K, kinds[i++ % kinds.length], u, c + side * vw, true, lift, side); side = -side;
  }
}

/* pieces down a z-running sloped street at x = xc, one every `step` m from z `from` to `to`, alternating sides at +-vw */
function heights_obs_zrow(K, xc, from, to, step, vw, kinds, lift, phase, skip) {
  let side = -1, i = phase || 0;
  for (let u = from; u <= to; u += step) {
    if (skip && skip(u, side)) { side = -side; if (skip(u, side)) continue; }
    heights_obs_piece(K, kinds[i++ % kinds.length], xc + side * vw, u, false, lift, side); side = -side;
  }
}

/* paint a band on the ground that follows the slope: dashes along z (from..to, kinks listed in `br`), width w, centred x */
function heights_obs_paintZ(K, x, br, w, color) {
  K.decorFns.push(D => { for (let i = 0; i + 1 < br.length; i++) D.dash(x, br[i], x, br[i + 1], color, w); });
}

/* Ridge Road, x 100.5..479.5 at y 44 (K.street), its lamps, the filler, a bus stop pull-off */
function heights_obs_ridge(K, P) {
  const c = -596;
  K.street('x', c, 100.5, 479.5, 44, [220, 268], { rw: 5, sw: 3, lamps: false });
  const lampX = [];
  for (let x = 124, s = 1; x < 470; x += 40, s = -s) { if (Math.abs(x - 220) < 12 || Math.abs(x - 268) < 12) continue; lampX.push([x, s]); K.lamp(x, c + s * 5.6, s); }
  const nearLamp = (u, side) => lampX.some(([lx, ls]) => ls === side && Math.abs(lx - u) < 4.5);
  const skip = (u, side) => Math.abs(u - 220) < 13 || Math.abs(u - 268) < 13 || Math.abs(u - 330) < 6 || nearLamp(u, side);
  heights_obs_row(K, c, 112, 472, 37, 6.5, ['ledge', 'kick', 'planter', 'bench', 'gap', 'pad', 'rack', 'ledge', 'hydrant', 'kick'], 0.15, 2, skip);
  // a pull-off at x 330: a bus stop on the south sidewalk with a bench, a bank and a planter pair across the road
  K.busStop(330, -589.6, true, 1);
  K.Bg(321, -603.6, 324.5, -602.6, 0.7, 'ledge', { edges: 's' }); K.Bg(336, -603.6, 339.5, -602.6, 0.7, 'ledge', { edges: 's' });
  K.kicker(326, -602.2, 1, 0, 2.6, 0.55, 1.5);
  P.spot('Ridge Road Pull-off', 330, 44.15, -592, 0, [318, -605, 342, -587]);
  // (designer review) the stretch over the two crossings was 95 m bare: a pad, a ledge and a pad on the island between the roads
  K.Bg(200, -603.2, 206, -601.8, 0.2, 'pad', { edges: '' });
  K.Bg(236, -589.8, 246, -589.2, 0.45, 'ledge', { edges: 'n' });
  K.Bg(250, -603.2, 256, -601.8, 0.2, 'pad', { edges: '' });
}

/* Observatory Road (x 220), Planetarium Drive (x 268), the Stargazer lane, the dome service lane: sidewalks, filler, paint */
function heights_obs_roads(K, P) {
  const g = K.terrainH;
  const BR = [-588, -584, -572, -560, -548, -536, -286, -274, -262, -250, -248];    // the kinks of the base slope
  for (const s of [-1, 1]) heights_obs_zwalk(K, 220 + s * 6.5, 220 + s * 5.15, 3, BR, 100);
  const BP = [-588, -584, -572, -560, -548, -536, -471];
  for (const s of [-1, 1]) heights_obs_zwalk(K, 268 + s * 5.25, 268 + s * 4.15, 2.5, BP, 60);
  // lamps down the east side of Observatory Road
  const lampZ = [-570, -522, -426, -378, -330, -282];
  for (const z of lampZ) K.lamp(227.4, z, -1);
  const lampNear = (z, side) => side > 0 && lampZ.some(lz => Math.abs(lz - z) < 5);
  // Observatory Road filler: on the sidewalks, every ~34 m, alternating sides
  heights_obs_zrow(K, 220, -578, -256, 34, 6.6, ['ledge', 'kick', 'rack', 'planter', 'bench', 'ledge', 'hydrant', 'kick', 'long'], 0.15, 0,
    (z, side) => lampNear(z, side) || Math.abs(z + 476) < 7);
  // two gaps over the road: curb-cut kickers on the west verge, landing ramps on the east
  K.crossingGap(214, -520, 226.5, -520, 0.45);
  K.crossingGap(214, -330, 226.5, -330, 0.45);
  P.spot('Observatory Road', 220, g(220, -520), -520, Math.PI, [210, -590, 230, -250]);
  // Planetarium Drive filler (edges of a 126 m bomb)
  const pl = (z, side) => Math.abs(z + 476) < 0;
  heights_obs_zrow(K, 268, -574, -480, 30, 5.4, ['ledge', 'kick', 'planter', 'rack', 'ledge'], 0.15, 1, pl);
  K.lamp(273.9, -556, -1); K.lamp(273.9, -512, -1);
  // the Stargazer lane x 140..200 at grade (z -588..-540): paved, with a median-like pair of planters and ledges either side of the line
  heights_obs_paintZ(K, 170, [-588, -584, -572, -560, -548, -540], 60, 0x8f8d86);
  for (const [x, z0, z1] of [[160, -583, -574], [178, -568, -559], [161, -553, -544]]) heights_obs_ledge(K, x, z0, x, z1, 0.45, 0.6);
  K.kicker(181, -581, 0, 1, 2.4, 0.5, 1.4); K.kicker(158, -566, 0, 1, 2.4, 0.5, 1.4);
  K.planter(172, -553, 177, -551.5); K.hydrant(163, -587);
  // the gantry sign over the lane, beams only look (nothing to hit)
  K.hubbas.push({ a: V(170, 41.29, -540), b: V(170, 41.26, -541.8), w: 60, noRails: true, color: 0x8f8d86 });   // lane onto deck A without a lip
  // (designer review) a curb cut through Ridge Road's south sidewalk where the lane leaves it: the 0.15 m sidewalk slammed riders
  K.hubbas.push({ a: V(170, 44.15, -591), b: V(170, 44.01, -592.4), w: 24, noRails: true, color: 0xb9b5ab });
  K.hubbas.push({ a: V(170, 44.15, -588), b: V(170, K.terrainH(170, -586.6) + 0.01, -586.6), w: 24, noRails: true, color: 0xb9b5ab });
  K.prop(140, g(140, -541), -541.15, 140.4, 45.6, -540.85, 0x3a3d42); K.prop(199.6, g(200, -541), -541.15, 200, 45.6, -540.85, 0x3a3d42);
  K.prop(140, 45.4, -541.15, 200, 45.6, -540.85, 0x3a3d42);
  K.decorFns.push(D => D.sign('STARGAZER DECKS', 166, 44.5, -541, 8, 1.2, Math.PI, '#e2c044', '#22262c'));
  // the dome service lane z -476, x 225..263, striped on the slope in thin bands
  K.decorFns.push(D => { for (let z = -477.75; z < -473.9; z += 0.5) D.dash(226, z, 262, z, 0x56585d, 0.52); });
  K.crossingGap(228, -482, 228, -470, 0.4);
  K.Bg(244, -480.6, 250, -480, 0.45, 'ledge', { edges: 'n' }); K.Bg(255, -471.8, 261, -471.2, 0.45, 'ledge', { edges: 's' });
}

/* O1 + O2 + the Dome Court: the Podium, the Observatory Ledge, the balustrades, the dome, the sign */
function heights_obs_podium(K, P) {
  const Y = 31.8;
  K.B(236, 23.5, -470, 300, Y, -418, 'plaza', { edges: 'w' });                                           // the west edge is the Observatory Ledge
  K.B(236, Y, -419.4, 243.6, 32.35, -418, 'ledge', { edges: 's' });                                      // balustrade ledges, 7 m drop behind
  K.B(260.4, Y, -419.4, 300, 32.35, -418, 'ledge', { edges: 's' });
  K.B(240, Y, -464, 247, 32.35, -460, 'ledge', { edges: 'ns' });                                         // Dome Court planters (off the Stargazer line)
  K.B(255, Y, -440, 262, 32.35, -436, 'ledge', { edges: 'ns' });   // (designer review: moved east, off the Stargazer line, which passes x 248..252 here)
  K.hubbas.push({ a: V(268, Y, -470), b: V(268, 31.74, -471.4), w: 12, noRails: true, color: 0xb9b5ab });   // the chamfer where Planetarium Drive arrives (a box lip of 0.1 stops a rider)
  for (const z of [-458.3, -446.3, -430.3]) K.B(271, Y, z, 275.6, Y + 0.45, z + 0.6, 'wood', { edges: '' }); // a bench row (designer review: by the dome, clear of the Planetarium Drive way in)
  // the dome: three boxes to hit, the rest is drawn
  const wall = { color: 0xdcd8cc };
  K.B(277, Y, -448, 295, 37.8, -440, 'building', wall); K.B(281, Y, -453, 291, 37.8, -435, 'building', wall); K.B(279, Y, -451, 293, 37.8, -437, 'building', wall);
  K.prop(276.6, Y, -445.2, 277, 34.3, -442.8, 0x4a3b2c);                                                 // a door on the west face
  K.decorFns.push(D => {
    D.add(new THREE.CylinderGeometry(1, 1, 1, 36), 0xdcd8cc, [286, Y + 3, -444], [0, 0, 0], [10, 6, 10]);
    D.add(new THREE.SphereGeometry(1, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2), 0xe9e5d9, [286, Y + 6, -444], [0, 0, 0], [10, 10, 10], { metalness: 0.25, roughness: 0.4 });
    D.lamp(240, Y, -452, 1); D.lamp(240, Y, -428, 1);
    D.sign('OBSERVATORY', 278, 29.4, -417.9, 10, 1.4, 0, '#f3f1ea', '#22262c');
  });
  K.prop(257, Y, -420, 259, Y + 1.6, -419.6, 0x2f4a3a);
  P.landmark({ at: [286, Y, -444], near: 140, parts: [
    { shape: 'cyl', at: [0, 3, 0], size: [20, 6, 20], color: 0xdcd8cc },
    { shape: 'sphere', at: [0, 6, 0], size: [20, 20, 20], color: 0xdcd8cc },
    { shape: 'box', at: [-18, -4, 0], size: [64, 8, 52], color: 0xb8b2a6 }] });
  P.spot('Observatory Ledge', 238, Y + 0.05, -444, Math.PI / 2, [228, -472, 242, -418]);
  P.spot('Dome Court', 262, Y + 0.05, -450, Math.PI / 2, [242, -470, 300, -420]);
  P.travel('Observatory Terrace', 252, 31.85, -436, Math.PI, 'spot');
  P.challenge({ id: 'heights-obs-smith', name: 'Smith the Observatory Ledge', desc: 'Smith or Feeble the long ledge above the hill', hard: true,
    at: [232, 31.0, -462], go: [232, 31.7, -478, Math.PI], kind: 'grind', grind: 'Smith|Feeble', area: [235, -470, 237.5, -418] });
}

/* O3: the Observatory Steps, x 244..260: five units (8 risers of 0.30, tread 0.42, then a 6 m landing) and a final flight of 6 */
function heights_obs_steps(K, P) {
  const X0 = 244, X1 = 260, RL = [243.55, 252, 260.45];
  let z = -418, top = 31.8;
  for (let k = 0; k < 5; k++) {
    const bot = Math.round((top - 2.4) * 100) / 100, zl0 = z + 2.94, zl1 = zl0 + 6;
    K.stairSpot('z', z, 1, X0, X1, top, bot, 8, 0.42, { rails: RL });
    K.B(X0, K.groundMin(X0, z, X1, zl0) - 0.4, z, X1, bot, zl0, 'plaza');                  // the mass under the flight
    K.B(X0, K.groundMin(X0, zl0, X1, zl1) - 0.4, zl0, X1, bot, zl1, 'plaza', { edges: 'ew' });
    top = bot; z = zl1;
  }
  K.stairSpot('z', z, 1, X0, X1, top, 18.0, 6, 0.42, { rails: RL });                       // down to the Walk at z -371.2
  P.spot('Observatory Steps', 252, 31.85, -421, Math.PI, [243, -422, 261, -371]);
  P.challenge({ id: 'heights-obs-flip', name: 'Flip the Observatory Steps', desc: 'Flip trick off the podium and land on the first landing',
    at: [252, 32.6, -421], go: [248, 31.85, -436, Math.PI], kind: 'trick', trick: 'flip|shuv|Shove|Impossible|Varial',
    from: [244, -424, 260, -418, 31.5], to: [244, -415.06, 260, -409.06, 29.0, 29.8] });
}

/* O4: the Observatory Walk, x 244..260, z -371..-282 at grade: paved, six Walk Ledges, benches */
function heights_obs_walk(K, P) {
  const g = K.terrainH;
  heights_obs_paintZ(K, 252, [-371.2, -286], 16, 0xb3afa6);
  for (const x of [242.7, 261.3]) for (const [z0, z1] of [[-366, -346], [-340, -320], [-314, -294]])
    K.hubbas.push({ a: V(x, g(x, z0) + 0.45, z0), b: V(x, g(x, z1) + 0.45, z1), w: 0.6, kind: 'Ledge', color: 0xa9a59c });
  for (const z of [-343, -317, -291]) K.bench(z === -317 ? 256.8 : 244.4, z - 0.3, z === -317 ? 259.6 : 247.2, z + 0.3);
  for (const z of [-362, -330]) K.lamp(262.6, z, -1);
  P.spot('Observatory Walk', 252, g(252, -330), -330, Math.PI, [241, -372, 263, -284]);
}

/* O5: the Forecourt, x 230..300, z -282..-248 at grade */
function heights_obs_forecourt(K, P) {
  const g = K.terrainH;
  K.decorFns.push(D => { for (const [a, b] of [[-286, -274], [-274, -262], [-262, -250], [-250, -248]]) D.dash(265, a, 265, b, 0xb3afa6, 70); });
  for (const x of [238, 262, 286]) for (const [z0, z1] of [[-278, -262], [-262, -256]])
  { K.hubbas.push({ a: V(x, g(x, z0) + 0.5, z0), b: V(x, g(x, z1) + 0.5, z1), w: 2, noRails: true, kind: 'Ledge', color: 0xa9a59c });
    K.rail(x, g(x, z0) + 0.5, z0, x, g(x, z1) + 0.5, z1, 'Ledge', false); }
  K.pad(268, -270, 274, -266);
  K.bench(240, -290.3, 244.5, -289.7); K.bench(280, -266.3, 284.5, -265.7); K.bench(236, -252.3, 240.5, -251.7);   // (designer review: was on the Stargazer line at x 250)
  K.lamp(232, -270, 1); K.lamp(296, -260, -1);
  P.spot('Observatory Forecourt', 266, g(266, -264), -264, Math.PI, [230, -282, 300, -248]);
}

/* O6: the Stargazer Decks, x 128..204: three parking decks with 4 m gaps */
function heights_obs_decks(K, P, PL) {
  const D = PL.DECKS, Y0 = [37.5, 33.6, 29.8], X0 = 128, X1 = 204;
  D.forEach((d, k) => {
    K.B(X0, Y0[k], d.z0, X1, d.top, d.z1, 'garage', { edges: 's' });
    K.car(146, d.z0 + 8, false, d.top); K.car(190, d.z0 + 8, false, d.top);
    for (const x of [134, 152, 182, 198]) K.B(x - 0.9, d.top, d.z0 + 3.6, x + 0.9, d.top + 0.16, d.z0 + 3.9, 'ledge', { edges: '' });
    K.decorFns.push(Dc => { Dc.lamp(131, d.top, d.z0 + 14, 1); Dc.lamp(201, d.top, d.z0 + 14, -1); });
  });
  P.spot('Stargazer Decks', 166, D[0].top + 0.05, -534, Math.PI, [X0, -540, X1, -460]);
  P.tape(130, -462, D[2].top);
  P.challenge({ id: 'heights-deck-gap', name: 'Stargazer Gap', desc: 'Clear the gap from deck A to deck B',
    at: [166, 41.6, -517], go: [166, 41.35, -536, Math.PI], kind: 'gap', from: [128, -540, 204, -516, 41.0], to: [128, -512, 204, -488, 37.3, 37.9] });
}

/* O7: six villas: three north of Ridge Road (one with a backyard pool), three on the slope east of the podium with stoops */
function heights_obs_villas(K, P) {
  const g = K.terrainH;
  K.building(312, -630, 328, -619, 2, 0xd8d2c4, 'stone');
  K.building(382, -630, 398, -619, 2, 0xb9a88f, 'brick');
  K.building(446, -630, 462, -619, 2, 0x8c6a5d, 'stone');
  K.backyardPool(390, -611.5);
  K.B(383, 43.8, -605.4, 387.5, 45.6, -605.0, 'fence'); K.B(392.5, 43.8, -605.4, 397, 45.6, -605.0, 'fence');
  K.Bg(311, -615, 329, -614.4, 0.55, 'ledge', { edges: 's' }); K.Bg(445, -615, 463, -614.4, 0.55, 'ledge', { edges: 's' });
  K.hydrant(305, -602.4);
  for (const [x0, col, tex] of [[322, 0xcfc4ad, 'brick'], [372, 0xa7744f, 'stone'], [422, 0xd8d2c4, 'brick']]) {
    const zf = -506, xm = x0 + 7;
    K.building(x0, -520, x0 + 14, zf, 2, col, tex);
    // the stoop: a landing at the door, four steps down the slope, one handrail
    const zS = zf + 2.4, gE = g(xm, zS + 1.4), top = gE + 1.2;
    K.B(xm - 2, K.groundMin(xm - 2, zf, xm + 2, zS) - 0.4, zf, xm + 2, top, zS, 'plaza');
    K.stairSpot('z', zS, 1, xm - 2, xm + 2, top, gE + 0.02, 4, 0.4, { rails: [xm + 2.45] });
    K.Bg(x0, zS + 4.5, xm - 3.5, zS + 5.1, 0.55, 'ledge', { edges: 'n' }); K.Bg(xm + 3.5, zS + 4.5, x0 + 14, zS + 5.1, 0.55, 'ledge', { edges: 'n' });
  }
  P.spot('Observatory Villas', 372, g(372, -496), -496, Math.PI, [318, -522, 440, -490]);
}

/* trees: a few at the verges and in the villa gardens (solid, so few) */
function heights_obs_trees(K) {
  for (const [x, z] of [[210.2, -560], [229.9, -540], [210.2, -430], [229.9, -352], [210.2, -300],
                        [150, -604.5], [188, -604.5], [300, -604.5], [410, -587.5],
                        [318, -502], [418, -498], [304, -612]]) K.tree(x, z);
}

/* Financial Core, the west part: Planter Alley (the trough, its terraces and frontages), Mint Terrace, the Alto Arena
   and the filler between them. Rect [-420, -140, -140, 230]. Design: levels/porto/design/fin.md section 8. */
function fin_west(K, P, PL) {
  fin_west_alley(K, P, PL);
  fin_west_frontage(K, P, PL);
  fin_west_mint(K, P, PL);
  fin_west_arena(K, P, PL);
  fin_west_filler(K, P, PL);
  fin_west_life(K, P, PL);
}

/* places nothing may be put by the generic filler: the buildings, the plaza, the arena and its stairs, the gate corridor, the trough */
function fin_west_blocked(x, z, m = 1.2) {
  const R = [[-398, -80, -352, -56.5], [-346, -80, -300, -56.5], [-296, -80, -276, -56.5], [-264, -80, -222, -56.5], [-216, -80, -172, -56.5],
    [-398, -23.5, -350, 0], [-344, -23.5, -296, 0], [-290, -23.5, -244, 0], [-238, -23.5, -196, 0], [-190, -23.5, -160, 0],
    [-301, -133, -239, -103], [-277, -104, -263, -56],
    [-356, 39, -194, 161], [-283, 30.5, -267, 40.2], [-283, 159.8, -267, 169.5], [-336, 34.5, -300, 40.2], [-256, 34.5, -220, 40.2], [-336, 159.8, -300, 165.5], [-256, 159.8, -220, 165.5], [-364, 91, -355, 109], [-195, 91, -186, 109], [-421, -47, -403, -33], [-408, -52, -146, -28],
    [-390, 168, -160, 214]];
  return R.some(([x0, z0, x1, z1]) => x > x0 - m && x < x1 + m && z > z0 - m && z < z1 + m);
}

/* a manual pad: low, no grindable edges */
function fin_west_pad(K, x0, z0, x1, z1, hgt = 0.18) { return K.Bg(x0, z0, x1, z1, hgt, 'pad', { edges: '' }); }

/* one small thing at (x, z); alongX: it runs along x; sgn: which way a kicker points */
function fin_west_thing(K, kind, x, z, alongX, sgn = 1) {
  const at = (du, dv) => alongX ? [x + du, z + dv] : [x + dv, z + du];
  const rect = (a, b) => { const [x0, z0] = at(-a, -b), [x1, z1] = at(a, b); return [x0, z0, x1, z1]; };
  if (kind === 'bench') K.bench(...rect(1.6, 0.3));
  else if (kind === 'planter') K.Bg(...rect(1.1, 0.75), 0.55, 'ledge', { edges: alongX ? 'ns' : 'ew' });
  else if (kind === 'ledge') K.ledge(...rect(2.6, 0.35));
  else if (kind === 'pad') fin_west_pad(K, ...rect(1.8, 0.9));
  else if (kind === 'rack') K.bikeRack(x, z, alongX, 2.4);
  else if (kind === 'news') K.newsBoxes(x, z, alongX, 2);
  else if (kind === 'trash') K.trashCan(x, z);
  else if (kind === 'hydrant') K.hydrant(x, z);
  else if (kind === 'long') { const [ax, az] = at(-4.5, 0), [bx, bz] = at(4.5, 0); K.strip(ax, az, bx, bz, 0.45, 0.7, { kind: 'Ledge', seg: 9, color: 0xa9a59c }); }
  else if (kind === 'kick') { const [kx, kz] = at(0, 0); K.kicker(kx, kz, alongX ? sgn : 0, alongX ? 0 : sgn, 2.2, 0.5, 1.4); fin_west_pad(K, ...rect(0.7, 0.7).map((v, i) => v + (alongX ? (i % 2 ? 0 : sgn * 5.2) : (i % 2 ? sgn * 5.2 : 0))), 0.18); }
  else if (kind === 'flatbar') { const [ax, az] = at(-2.5, 0), [bx, bz] = at(2.5, 0), g = K.terrainH(x, z) + 0.8; K.rail(ax, g, az, bx, g, bz, 'Flatbar', true); }
  else if (kind === 'jersey') K.jersey(...rect(2.2, 0.2));
  else if (kind === 'picnic') K.picnic(x, z, alongX);
  else if (kind === 'curb') K.parkingBlock(x, z, alongX);
}

/* things every `step` m along the segment a to b, `off` m to the side of it, skipping blocked places and `skip(x, z)` */
function fin_west_run(K, ax, az, bx, bz, step, kinds, opt = {}) {
  const L = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / L, uz = (bz - az) / L, alongX = Math.abs(ux) > Math.abs(uz), off = opt.off || 0;
  let i = opt.start || 0;
  for (let s = opt.s0 ?? step / 2; s < L; s += step) {
    const x = ax + ux * s - uz * off, z = az + uz * s + ux * off, kind = kinds[i++ % kinds.length];
    if (x < -419 || x > -141 || z < -139 || z > 229 || (!opt.free && fin_west_blocked(x, z)) || (opt.skip && opt.skip(x, z))) continue;
    fin_west_thing(K, kind, x, z, alongX, (i & 1) ? 1 : -1);
  }
}

/* ---------- 8.1 Planter Alley: coping, planters, the arch ---------- */
function fin_west_alley(K, P, PL) {
  const T = PL.colors, BR = 0x9a5e4c;
  // coping along both lips of the trough (the lip is at y 0, 10 m off the axis); long runs in 30 m pieces that meet end to end
  for (const z of [-50, -30]) for (let x = -156; x > -392; x -= 30) {
    const x1 = Math.max(x - 30, -392);
    K.rails.push({ a: V(x, 0, z), b: V(x1, 0, z), kind: 'Coping', coping: true });
  }
  // terrace planters: angled brick hubbas, level, 6 m long
  for (let i = 0; i < 9; i++) {
    const x0 = -176 - i * 24;
    K.hubbas.push({ a: V(x0, 0.55, -55), b: V(x0 - 5.2, 0.55, -51), w: 1.4, kind: 'Ledge', color: BR });
    K.hubbas.push({ a: V(x0, 0.55, -25), b: V(x0 - 5.2, 0.55, -29), w: 1.4, kind: 'Ledge', color: BR });
  }
  // floor planters, top -1.05, angled 25 degrees
  for (const [x, z, s] of [[-200, -44, 1], [-250, -36, -1], [-300, -44, 1], [-300, -36, -1], [-340, -44, 1], [-362, -36, -1], [-377, -44, 1]]) {
    const c = Math.cos(0.436) * 2.5, d = Math.sin(0.436) * 2.5 * s;
    K.hubbas.push({ a: V(x + c, -1.05, z - d), b: V(x - c, -1.05, z + d), w: 1.2, kind: 'Ledge', color: BR });
  }
  // the arch: two posts and a beam, with the name on it
  for (const z of [-57, -23]) K.prop(-152.4, 0, z - 0.4, -151.6, 6, z + 0.4, T.concrete);
  K.prop(-152.5, 6, -57.4, -151.5, 6.6, -22.6, T.black);
  K.decorFns.push(D => D.sign('PLANTER ALLEY', -152.6, 7.4, -40, 24, 2.2, Math.PI / 2, '#f2ead8', '#3a3d42'));
  // lamps on the terraces, tight to the frontages
  for (let x = -188; x > -400; x -= 24) { K.lamp(x, -56, 1); K.lamp(x - 12, -24, -1); }
  // the gate seam: ledges either side of the planters gate corridor (x -420..-404, z -46..-34 stays clear)
  K.ledge(-416, -50, -408, -49.4); K.ledge(-416, -30.6, -408, -30);
  fin_west_pad(K, -398, -49.2, -392, -47.6, 0.18); fin_west_pad(K, -398, -32.4, -392, -30.8, 0.18);
  // the alley entrance, east end: a bank each side up from the sunk floor, and a ledge each side
  // the alley mouth: manual pads on the floor 4.5 m either side of the axis (no grind lines), so the way in isn't bare
  for (const s of [-1, 1]) { fin_west_pad(K, -165, -40 + s * 4.5 - 0.7, -158, -40 + s * 4.5 + 0.7, 0.2); fin_west_pad(K, -186, -40 + s * 4.5 - 0.7, -178, -40 + s * 4.5 + 0.7, 0.2); }
  P.spot('Planter Alley', -150, 0, -44, Math.PI / 2, [-404, -56, -146, -24]);
  P.spot('Alley Floor', -270, -1.6, -44, Math.PI / 2, [-300, -52, -240, -28]);
  P.challenge({ id: 'fin-alley', name: 'Alley Cat', desc: 'Land a 4,000 point line that starts in Planter Alley', at: [-157, K.terrainH(-157, -44), -44], go: [-148, 0, -44, Math.PI / 2], kind: 'score', pts: 4000, area: [-404, -56, -146, -24] });
  P.tape(-372, -35, -1.6);
}

/* ---------- 8.1 the frontages, with awnings, and what sits against them ---------- */
function fin_west_frontage(K, P, PL) {
  const T = PL.colors;
  const N = [[-398, -352, 3, T.granite, 'stone'], [-346, -300, 4, 0x9a5e4c, 'brick'], [-296, -276, 2, T.granite, 'stone'], [-264, -222, 3, 0x9a5e4c, 'brick'], [-216, -172, 4, T.glass3, 'office']];
  const S = [[-398, -350, 3, 0x9a5e4c, 'brick'], [-344, -296, 2, T.granite, 'stone'], [-290, -244, 4, T.glass3, 'office'], [-238, -196, 3, 0x9a5e4c, 'brick'], [-190, -160, 2, T.granite, 'stone']];
  const AW = [0x3f6b46, 0xb23a32, 0x2f5d8a, 0xd4a017, 0x6b6f75];
  N.forEach(([x0, x1, fl, c, tex], i) => {
    K.building(x0, -80, x1, -56.5, fl, c, tex);
    K.prop(x0 + 3, 2.5, -58, x1 - 3, 2.65, -56.5, AW[i % 5]);
  });
  S.forEach(([x0, x1, fl, c, tex], i) => {
    K.building(x0, -23.5, x1, 0, fl, c, tex);
    K.prop(x0 + 3, 2.5, -25, x1 - 3, 2.65, -23.5, AW[(i + 2) % 5]);
  });
  // between the planters, against the frontage: news boxes, bins, hydrants, racks, low ledges (z -55.8 north, -24.2 south)
  const TH = ['news', 'trash', 'rack', 'hydrant', 'ledge'];
  for (let i = 0; i < 8; i++) {
    const x = -188 - i * 24, n = TH[i % 5], s = TH[(i + 2) % 5];
    if (!N.some(([x0, x1]) => x > x0 - 2 && x < x1 + 2)) fin_west_thing(K, n, x, -55.6, true);
    if (!S.some(([x0, x1]) => x - 6 > x0 - 2 && x - 6 < x1 + 2)) fin_west_thing(K, s, x - 6, -24.4, true);
  }
  // the north terrace ends and the south terrace ends: a long ledge each, so no end of the alley goes quiet
  K.strip(-392, -53.5, -382, -53.5, 0.45, 0.7, { kind: 'Ledge', seg: 10, color: 0xa9a59c });
  K.strip(-392, -26.5, -382, -26.5, 0.45, 0.7, { kind: 'Ledge', seg: 10, color: 0xa9a59c });
  K.strip(-172, -53.5, -166, -53.5, 0.45, 0.7, { kind: 'Ledge', seg: 10, color: 0xa9a59c });
  // the cross gaps between the south frontages, 6 m passages to the arena side: a kicker in each
  for (const x of [-293, -193]) { K.ledge(x - 1.4, 1.2, x + 1.4, 1.7); }
}

/* ---------- 8.2 Mint Terrace ---------- */
function fin_west_mint(K, P, PL) {
  const T = PL.colors;
  const nb = K.boxes.length;
  K.raisedPlaza(-300, -132, -240, -104, 1.2, 's');
  // the kit's own ledge and planter are buried inside the 1.2 m deck: take them out (their grind lines would be hidden)
  for (let i = K.boxes.length - 1; i >= nb; i--) { const b = K.boxes[i]; if (b.max[1] < 1.0 && b.min[0] >= -300 && b.max[0] <= -240 && b.min[2] >= -132 && b.max[2] <= -104) K.boxes.splice(i, 1); }
  // the kit's ledge and planter on top sit under the 1.2 m deck: put real ones on it (deck top y 1.2)
  K.B(-296, 1.2, -128.5, -280, 1.65, -127.9, 'marble', { edges: 'ns' });                 // two ledges
  K.B(-260, 1.2, -128.5, -244, 1.65, -127.9, 'marble', { edges: 'ns' });
  for (const [x, z] of [[-290, -118], [-282, -118], [-258, -118], [-250, -118]]) K.B(x - 1.6, 1.2, z - 0.3, x + 1.6, 1.65, z + 0.3, 'wood', { edges: 'ns' });   // four benches
  K.B(-294, 1.2, -111, -291, 1.75, -108.5, 'ledge', { edges: 'ns', color: PL.colors.brick });
  K.B(-249, 1.2, -111, -246, 1.75, -108.5, 'ledge', { edges: 'ns', color: PL.colors.brick });
  // a bank up onto the deck from the north, where the Bourse-Mint Line comes in, and one on the east end
  K.hubbas.push({ a: V(-268, 1.2, -132), b: V(-268, 0.02, -139.2), w: 16, noRails: true, color: 0xc4bfb3 });
  K.hubbas.push({ a: V(-240, 1.2, -118), b: V(-233.6, 0.02, -118), w: 8, noRails: true, color: 0xc4bfb3 });
  K.hubbas.push({ a: V(-300, 1.2, -122), b: V(-306, 0.02, -122), w: 6, noRails: true, color: 0xc4bfb3 });
  K.hubbas.push({ a: V(-281, 1.2, -104), b: V(-281, 0.02, -96.5), w: 5, noRails: true, color: 0xc4bfb3 });   // banks off the south edge either side of the stairs
  K.hubbas.push({ a: V(-259, 1.2, -104), b: V(-259, 0.02, -96.5), w: 5, noRails: true, color: 0xc4bfb3 });
  // the passage x -276..-264 from the stairs down to the north terrace
  K.bench(-275.8, -96, -275.2, -90); fin_plant(K, -265.5, -97, -264.2, -94);
  K.strip(-275.4, -88, -275.4, -80, 0.45, 0.5, { kind: 'Ledge', seg: 8, color: 0xa9a59c });
  K.strip(-264.6, -80, -264.6, -72, 0.45, 0.5, { kind: 'Ledge', seg: 8, color: 0xa9a59c });
  K.kicker(-270, -70, 0, 1, 2.2, 0.45, 1.5);                                             // pops you down toward the terrace
  fin_west_pad(K, -271, -65.5, -269, -62, 0.18);
  K.rail(-275.2, 0.8, -78, -275.2, 0.8, -66, 'Flatbar', true);
  K.hydrant(-264.8, -62); K.newsBoxes(-275.4, -60, false, 2);
  K.tree(-246, -100); K.tree(-294, -100);
  P.spot('Mint Terrace', -270, 1.2, -118, Math.PI, [-301, -133, -239, -80]);
}

/* ---------- 8.3 Alto Arena (the Stadium of mega3.js, moved to cx -275, cz 100) ---------- */
function fin_west_arena(K, P, PL) {
  const T = PL.colors, cx = -275, cz = 100, W = 70, Dd = 50, CH = 6;
  K.building(cx - W, cz - Dd, cx + W, cz + Dd, 7, 0xb9b5ab, 'stone');                                   // the stands
  for (const [x0, z0, x1, z1, e] of [[cx - W - 10, cz - Dd - 10, cx + W + 10, cz - Dd, 'n'], [cx - W - 10, cz + Dd, cx + W + 10, cz + Dd + 10, 's'], [cx - W - 10, cz - Dd, cx - W, cz + Dd, 'w'], [cx + W, cz - Dd, cx + W + 10, cz + Dd, 'e']])
    K.B(x0, -1, z0, x1, CH, z1, 'plaza', { edges: e });                                                // only the outer drop grinds (the inner edges meet the stands)                                            // the concourse round it, 6 m up
  // long ramps up to the concourse on the long sides, and big sets in the middle
  for (const s of [-1, 1]) {
    const zr = cz + s * (Dd + 10), xs = [cx - 60, cx + 20];
    for (const x of xs) {
      K.hubbas.push({ a: V(x, CH, zr + s * 2.5), b: V(x + 34, 0.02, zr + s * 2.5), w: 5, color: 0xc4bfb3 });
      K.B(x - 6, -1, Math.min(zr, zr + s * 5), x, CH, Math.max(zr, zr + s * 5), 'plaza', { edges: s < 0 ? 'nw' : 'sw' });
      K.rail(x + 0.3, CH + 0.95, zr + s * 5.15, x + 33.6, 0.97, zr + s * 5.15, 'Handrail');
    }
    K.B(cx - 8, -1, zr, cx + 8, CH / 2, zr + s * 6, 'plaza');
    K.stairSpot('z', zr, s, cx - 6, cx + 6, CH, CH / 2, 8, 0.4, { rails: [cx] });
    K.stairSpot('z', zr + s * 6, s, cx - 6, cx + 6, CH / 2, 0, 8, 0.4, { rails: [cx] });
  }
  // the Twenty: 20 stairs at both ends, a rail either side and a hubba in the middle
  for (const s of [-1, 1]) K.stairSpot('x', cx + s * (W + 10), s, cz - 8, cz + 8, CH, 0, 20, 0.42, { rails: [cz - 8.45, cz + 8.45], hubbas: [cz] });
  K.decorFns.push(D => D.sign('ALTO ARENA', cx + W - 0.1, 13, cz, 24, 3.2, Math.PI / 2, '#f2ead8', '#7a2f2a'));
  // the car park south of it: paint, bays, islands, cart rails, speed bumps, parked cars, ticket booths
  const zc = 190;
  K.paintRect(-387, 168, -163, 212, 0x5d5f63, 0.006);
  for (let x = -383; x < -165; x += 3) { K.dash(x, zc - 20, x, zc - 14, 0xf0ece2, 0.1); K.dash(x, zc + 14, x, zc + 20, 0xf0ece2, 0.1); }
  for (let x = -355; x <= -195; x += 40) { fin_west_pad(K, x - 8, zc - 12, x + 8, zc - 9, 0.15); K.Bg(x - 0.6, zc - 10.6, x + 0.6, zc - 9.4, 0.75, 'ledge', { edges: 'ns' }); }
  for (let x = -370; x <= -190; x += 36) K.rail(x, 0.45, zc + 7, x + 6, 0.45, zc + 7, 'Rail');
  for (const [x, z] of [[-380, 173], [-368, 173], [-344, 173], [-320, 173], [-296, 173], [-256, 173], [-224, 173], [-200, 173], [-176, 173],
    [-374, 207], [-350, 207], [-326, 207], [-290, 207], [-266, 207], [-242, 207], [-212, 207], [-184, 207]]) K.car(x, z, false);
  for (const x of [-300, -275, -250]) K.prop(x - 1.5, 0, 178.5, x + 1.5, 3, 181.5, 0x8c6a5d);
  for (let x = -372; x <= -180; x += 24) K.Bg(x - 0.9, 195.35, x + 0.9, 195.65, 0.16, 'ledge', { edges: '' });
  P.spot('Alto Arena Twenty', -203, 6, 100, -Math.PI / 2, [-210, 86, -186, 114]);
  P.spot('Arena Concourse', -275, 6, 44, 0, [-300, 36, -250, 52]);
  P.challenge({ id: 'fin-arena-heel', hard: true, name: 'Heelflip the Arena Twenty', desc: 'Heelflip the whole twenty-stair off the arena concourse', at: [-195, 6, 100], go: [-203, 6, 100, -Math.PI / 2], kind: 'trick', trick: 'Heelflip',
    from: [-199, 92, -195.2, 108, 5.6], to: [-186.5, 90, -170, 110, -1, 0.5] });
  P.tape(-352, 44, 6.0);
}

/* ---------- the filler: what keeps every line, and the ground between, from going bare ---------- */
function fin_west_filler(K, P, PL) {
  const A = ['planter', 'bench', 'long', 'pad', 'rack', 'ledge', 'news', 'kick', 'trash', 'flatbar'];
  // the north square's south edge: below Bourse Walk (z -144), along z -137.5
  // (Bourse Walk itself is covered by the north part's things along z -148..-151)
  // the north square, middle: a row of ledges and planters at z -92 and trees
  fin_west_run(K, -400, -92, -302, -92, 48, ['long', 'planter', 'pad', 'ledge'], { s0: 10 });
  for (const [x, z] of [[-410, -110], [-410, -90], [-190, -120], [-160, -110], [-190, -95], [-330, -112], [-330, -128], [-215, -128]]) K.tree(x, z);
  // the band between the south frontage and the arena (z 0..31)
  fin_west_run(K, -400, 8, -150, 8, 46, ['ledge', 'planter', 'long', 'kick', 'pad', 'bench', 'rack'], { s0: 9 });
  for (const x of [-405, -200, -170]) K.tree(x, 14);
  // Arena Concourse: things 3 m inside the line, all round the stands
  const skipN = (x, z) => Math.abs(z - 100) < 12 && (x < -350 || x > -200);
  fin_west_run(K, -361, 33.5, -189, 33.5, 46, ['planter', 'long', 'bench', 'pad', 'ledge', 'rack', 'kick'], { s0: 8 });
  fin_west_run(K, -190, 36, -190, 166, 46, ['planter', 'bench', 'long', 'pad', 'ledge', 'rack', 'news', 'kick'], { s0: 5  , skip: skipN });
  fin_west_run(K, -189, 166.5, -361, 166.5, 46, ['long', 'planter', 'ledge', 'bench', 'pad', 'rack', 'kick'], { s0: 6, skip: (x, z) => x > -287 && x < -263 });
  fin_west_run(K, -360, 166, -360, 36, 46, ['planter', 'bench', 'long', 'pad', 'ledge', 'rack', 'news', 'kick'], { s0: 6  , skip: skipN });
  for (const [x, z] of [[-371, 40], [-179, 40], [-371, 160], [-179, 160], [-372, 100], [-371, 70], [-371, 130]]) K.tree(x, z);
  // the car park aisle (z 190): islands, cart rails and bumps are in the arena; bays get a hydrant and a long ledge
  fin_west_run(K, -385, 183, -165, 183, 40, ['long', 'bench', 'kick', 'ledge'], { s0: 10, free: true, skip: (x, z) => x > -304 && x < -246 });
  K.hydrant(-390, 186); K.trashCan(-162, 186);
  // west of the arena, down to the corner: lawn furniture
  for (const [x, z, k] of [[-405, 100, 'long'], [-392, 220, 'planter'], [-250, 224, 'long']]) fin_west_thing(K, k, x, z, true);
  // east of the arena, down the ring's west side
  for (const [x, z, k] of [[-152, 60, 'long'], [-152, 110, 'bench'], [-152, 160, 'ledge'], [-152, 200, 'long']]) fin_west_thing(K, k, x, z, false);
}

function fin_west_life(K, P, PL) {
  P.peds({ path: [[-170, -53], [-400, -53]], n: 3 });
  P.peds({ path: [[-170, -27], [-400, -27]], n: 3 });
  P.npc({ kind: 'session', rail: [-269, -50, -257, -50], start: -276, end: -252, back: 3.4, side: -1, speed: 5.2 });
}

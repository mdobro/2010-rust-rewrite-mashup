/* University (uni), everything below the south Rampart. Rect [496, 1000, 40, 230]. Design: levels/porto/design/uni.md sections 4 (S1-S5 below z 40,
   S20, S21), 7 and 13. Builds: both Great Steps flights, the Great Bank, the Drive Kerb, the Kinked Twelve flights and rail, the Terrace Stands tiers
   and aisles, the Commons, the Student Union and Union Deck (Bluebook Boards), Alumni Field's track kerb, light towers and scoreboard, Ashgrove and
   Birchmoor Halls, the Refectory, the courts, the Bike Shed DIY, Drive and Mill Lane dashes and lamps, trees, tapes, signs and the filler. */
function uni_south(K, P, PL) {
  PL = PL || uni_plan();
  uni_south_diy(K, P, PL);                 // first: its K.feat must exist before anything reads the ground there
  uni_south_steps(K, P, PL);
  uni_south_drive(K, P, PL);
  uni_south_twelve(K, P, PL);
  uni_south_stands(K, P, PL);
  uni_south_commons(K, P, PL);
  uni_south_union(K, P, PL);
  uni_south_field(K, P, PL);
  uni_south_halls(K, P, PL);
  uni_south_courts(K, P, PL);
  uni_south_filler(K, P, PL);
  uni_south_streets(K, P, PL);
  uni_south_trees(K, P, PL);
}

/* ---- S1 the Great Steps (flights, filler, cheeks, landing, rails, hubbas) and S2 the Great Bank ---- */
function uni_south_steps(K, P, PL) {
  const B = K.B, rails = PL.STEPS.rails;
  K.stairSpot('z', 40, 1, 548, 596, 6, 3.9, 7, 0.4, { rails });
  B(548, 1.3, 40, 596, 2.95, 42.4, 'step');
  B(546, 1.3, 40, 548, 6, 42.4, 'marble', { edges: 'e' });
  B(596, 1.3, 40, 598, 6, 42.4, 'marble', { edges: 'w' });
  B(546, 1.3, 42.4, 598, 3.9, 46.4, 'marble', { edges: 'we' });
  K.stairSpot('z', 46.4, 1, 548, 596, 3.9, 1.8, 7, 0.4, { rails, hubbas: [547.6, 596.4] });
  P.challenge({ id: 'uni-steps-rail', name: 'Great Steps Handrail', desc: 'Grind a Great Steps handrail',
    at: [556, 6, 38], go: [556, 6, 22, Math.PI], kind: 'grind', rail: 'Handrail', area: [552, 40, 592, 49, 1.8] });
  P.tape(597, 44.4, 3.9);
  // S2 the Great Bank: 4.2 m down over 10.5 m, 16 wide, off the rim box at x 600..616
  K.hubbas.push({ a: V(608, 6, 40), b: V(608, 1.82, 50.5), w: 16, noRails: true, color: 0xc4bfb3 });
  // the foot of the flights and the bank: a little marble kerb-ledge each side so the roll-away has something to read
  K.ledge(536, 52, 544, 52.6, 0.45, 'marble');
}

/* ---- S3 the Drive Kerb: a sloped kerb down the Drive's west verge, both top edges grind (136 m) ---- */
function uni_south_drive(K, P, PL) {
  K.hubbas.push({ a: V(637, 5.85, 48), b: V(637, 0.75, 184), w: 0.4, color: 0xb8b2a6 });
  P.spot('Drive Kerb', 637, 5.85, 46, Math.PI, [630, 40, 644, 70]);
  P.spot('Drive Foot', 645, 0.1, 186, Math.PI, [630, 170, 662, 214]);
}

/* ---- S4 the Kinked Twelve: two flights, a landing, a filler under the first, the kinked rail ---- */
function uni_south_twelve(K, P, PL) {
  const B = K.B;
  K.SET('z', 40, 1, 696, 712, 6, 3.975, 6, 0.4);
  B(694, 0, 42, 714, 3.975, 44, 'marble', { edges: 'we' });
  B(696, 0, 40, 712, 2.98, 42, 'step');
  K.SET('z', 44, 1, 696, 712, 3.975, 1.95, 6, 0.4);
  K.rail(704, 6.80, 40.0, 704, 4.775, 42.4, 'Handrail', true);
  K.rail(704, 4.775, 42.4, 704, 4.775, 44.0, 'Handrail', true);
  K.rail(704, 4.775, 44.0, 704, 3.0875, 46.0, 'Handrail', true);
  P.challenge({ id: 'uni-kinked', name: 'Kinked Twelve', desc: 'Grind the kinked handrail',
    at: [704, 6, 38], go: [704, 6, 18, Math.PI], kind: 'grind', rail: 'Handrail', area: [702.5, 39.5, 705.5, 46.5] });
}

/* ---- S5 the Terrace Stands: 7 tiers split at two aisles, each aisle a stair with a rail ---- */
function uni_south_stands(K, P, PL) {
  for (let j = 0; j < 7; j++) {
    const top = 5.41 - 0.595 * j, z0 = 40 + 2 * j, z1 = 42 + 2 * j;
    for (const [x0, x1] of [[736, 776], [780, 860], [864, 904]]) K.B(x0, 0, z0, x1, top, z1, 'ledge', { edges: 's' });
  }
  for (const a0 of [776, 860]) K.stairSpot('z', 40, 1, a0, a0 + 4, 6, 1.84, 14, 1.0, { rails: [a0 + 2] });
  P.challenge({ id: 'uni-stands-score', name: 'Work the Stands', desc: 'Land a 2,500 point line that starts on the Terrace Stands',
    at: [820, 6, 34], go: [820, 6, 26, Math.PI], kind: 'score', pts: 2500, area: [736, 32, 904, 56] });
}

/* ---- the Commons (fountain bowl, ledges, planters, benches, lamps) ---- */
function uni_south_commons(K, P, PL) {
  K.fountainBowl(568, 72, 7, 1.6);
  K.ledge(524, 60, 548, 60.6); K.ledge(617, 60, 624, 60.6); K.ledge(524, 86, 548, 86.6); K.ledge(588, 86, 612, 86.6);
  uni_planter(K, 514, 42, 520, 46, 0.55); uni_planter(K, 619, 42, 623, 46, 0.55); uni_planter(K, 514, 98, 520, 102, 0.55); uni_planter(K, 614, 94, 620, 98, 0.55);
  K.bench(553, 83, 553.6, 91); K.bench(583, 83, 583.6, 91);
  uni_picnic(K, 530, 74, true); uni_picnic(K, 606, 74, true);
  // the south edge (z 100..108): a manual pad and a bank up to the Union Deck
  uni_pad(K, 524, 96, 538, 99, 0.2); uni_pad(K, 617.5, 80, 623.5, 83, 0.2);
  for (const [x, z] of [[518, 52], [518, 78], [618, 52], [618, 78], [543, 66], [601, 66]]) K.lamp(x, z, 1);
  P.spot('The Commons', 568, 1.8, 90, 0, [512, 40, 624, 108]);
}

/* ---- the Student Union, Union Deck and Bluebook Boards ---- */
function uni_south_union(K, P, PL) {
  K.building(520, 108, 600, 150, 3, 0xd8cbb0, 'stone');
  K.B(520, 1, 102, 600, 2.4, 108, 'plaza', { edges: 'n' });
  // banks on and off the deck at its ends, and a shallow one mid-deck for the run along it
  K.hubbas.push({ a: V(520, 2.4, 105), b: V(514.8, 1.82, 105), w: 5, noRails: true, color: 0xc4bfb3 });
  K.hubbas.push({ a: V(600, 2.4, 105), b: V(605.2, 1.82, 105), w: 5, noRails: true, color: 0xc4bfb3 });
  K.hubbas.push({ a: V(556, 2.4, 102), b: V(556, 1.82, 98.6), w: 6, noRails: true, color: 0xc4bfb3 });
  // a flatbar and a ledge on the deck, clear of the shop's zone
  K.rail(526, 3.1, 103.4, 542, 3.1, 103.4, 'Flatbar', true);
  uni_planter(K, 570, 103, 576, 106, 0.5); uni_planter(K, 606, 100, 612, 103, 0.5);
  K.decorFns.push(D => D.sign('STUDENT UNION', 560, 10.0, 107.95, 14, 1.6, Math.PI, '#f0ece2', '#2e3f5c'));
  P.shop({ name: 'Bluebook Boards', sign: [590, 2.4 + 3.85, 107.96, Math.PI, 7],
    awning: [584, 106.4, 596, 108, 2.4 + 2.2], zone: [586, 104.8, 594, 107.8], door: [590, 2.4, 107.8] });
  P.travel('Bluebook Boards', 590, 1.8, 96, Math.PI, 'spot');
  P.spot('Bluebook Boards', 590, 1.8, 96, Math.PI, [520, 94, 604, 110]);
}

/* ---- S21 Alumni Field: the track kerb, pitch lines, light towers, scoreboard, benches ---- */
function uni_south_field(K, P, PL) {
  // the straights are chamfered strips (a box this low would stop a rider: the sloped kerb you roll up on to and grind along)
  for (const z of [66, 134]) K.strip(780, z, 860, z, 0.15, 0.4, { kind: 'Curb', color: 0xc0504a, seg: 80 });
  const geo = new THREE.BoxGeometry(1, 1, 1), r = PL.OVAL.r, N = 12;
  for (const [cx, a0] of [[PL.OVAL.cx0, Math.PI / 2], [PL.OVAL.cx1, -Math.PI / 2]]) for (let i = 0; i < N; i++) {
    const t0 = a0 + i / N * Math.PI, t1 = a0 + (i + 1) / N * Math.PI;
    const x0 = cx + Math.cos(t0) * r, z0 = PL.OVAL.cz + Math.sin(t0) * r, x1 = cx + Math.cos(t1) * r, z1 = PL.OVAL.cz + Math.sin(t1) * r;
    K.rail(x0, 1.40, z0, x1, 1.40, z1, 'Curb', false);
    const len = Math.hypot(x1 - x0, z1 - z0) + 0.1, ry = -Math.atan2(z1 - z0, x1 - x0), mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
    K.decorFns.push(D => D.add(geo, 0xc0504a, [mx, 1.325, mz], [0, ry, 0], [len, 0.15, 0.3]));
  }
  // pitch lines (the field is flat at 1.25)
  const W = 0xf2f2ea, y = PL.FIELD + 0.012, ln = (x0, z0, x1, z1) => K.paintRect(x0, z0, x1, z1, W, y);
  ln(792, 72, 848, 72.25); ln(792, 127.75, 848, 128); ln(792, 72, 792.25, 128); ln(847.75, 72, 848, 128); ln(819.9, 72, 820.1, 128);
  for (const [a, b] of [[792, 804], [836, 848]]) { ln(a, 86, b, 86.2); ln(a, 113.8, b, 114); ln(a === 792 ? 803.8 : 836, 86, a === 792 ? 804 : 836.2, 114); }
  for (let i = 0; i < 24; i++) { const t = i / 24 * Math.PI * 2, t1 = (i + 1) / 24 * Math.PI * 2; ln(820 + Math.cos(t) * 7 - 0.12, 100 + Math.sin(t) * 7 - 0.12, 820 + Math.cos(t) * 7 + 0.12, 100 + Math.sin(t) * 7 + 0.12); }
  // four light towers (looks only) and the scoreboard
  for (const [x, z] of [[732, 52], [908, 52], [732, 148], [908, 148]]) {
    K.prop(x - 0.3, 1, z - 0.3, x + 0.3, 16, z + 0.3, 0x6b7076);
    K.prop(x - 1.6, 15.4, z - 0.6, x + 1.6, 16.6, z + 0.6, 0xe8e4da);
  }
  K.prop(812, 2, 150, 828, 8, 151, 0x2b2b2b);
  K.decorFns.push(D => D.sign('ALUMNI FIELD', 820, 7.0, 149.9, 14, 1.8, Math.PI, '#f0ece2', '#2e3f5c'));
  K.bench(790, 146, 796, 146.6); K.bench(844, 146, 850, 146.6);
  P.spot('Alumni Field', 820, 1.25, 136, Math.PI, [736, 56, 904, 150]);
  P.spot('Track Kerb', 752, 1.25, 80, 0, [736, 60, 790, 140]);
}

/* ---- Ashgrove and Birchmoor Halls, the Refectory ---- */
function uni_south_halls(K, P, PL) {
  K.building(916, 60, 968, 96, 6, 0xa86b55, 'brick');
  K.building(916, 104, 968, 140, 5, 0xa86b55, 'brick');
  K.decorFns.push(D => D.sign('ASHGROVE HALL', 915.95, 14, 78, 12, 1.6, -Math.PI / 2, '#f0ece2', '#2e3f5c'));
  // the Refectory with its loading dock on the north face, a ledge in front
  K.building(760, 160, 880, 186, 2, 0xcdbf9f, 'stone');
  K.loadingDock(780, 160, 800, -1);
  K.ledge(820, 154, 860, 154.6);
  P.spot('Refectory Dock', 790, 0.4, 188, Math.PI, [770, 148, 830, 192]);
  P.spot('Mill Lane East', 872, 0.4, 190, Math.PI, [850, 186, 900, 196]);
}

/* ---- the courts, either side of the Field Walk ---- */
function uni_south_courts(K, P, PL) {
  const T = K.terrainH, gy = z => T(704, z);
  K.ledge(679.4, 152, 680, 188, 0.45); K.ledge(728, 152, 728.6, 188, 0.45);
  K.bench(697.4, 158, 698, 166); K.bench(712, 174, 712.6, 182);
  for (const [x0, x1] of [[681, 697], [713, 727]]) {
    K.prop(x0, gy(170), 169.9, x1, gy(170) + 0.95, 170.1, 0xe8e4da);             // the nets
    K.prop(x0 - 1.2, gy(170), 169.6, x0 - 0.8, gy(170) + 1.1, 170.4, 0x6b7076); K.prop(x1 + 0.8, gy(170), 169.6, x1 + 1.2, gy(170) + 1.1, 170.4, 0x6b7076);
  }
  for (const [x, z0, z1] of [[679.9, 152, 188], [728.1, 152, 188]]) K.prop(x - 0.05, gy(z0) - 0.1, z0, x + 0.05, gy(z1) + 3, z1, 0x4a5560);
  P.spot('The Courts', 705, 0.4, 172, Math.PI, [676, 146, 732, 192]);
}

/* ---- S20 the Bike Shed DIY: the hidden park ---- */
function uni_south_diy(K, P, PL) {
  const T = K.terrainH;
  const qp = d => d <= 0 ? 0 : 2.6 - Math.sqrt(6.76 - Math.min(d, 2.4) ** 2);   // radius 2.6, coping at d 2.4 = 1.6 high
  K.feat(958, 963, 156, 186, (x, z, h) => h + qp(x - 958), 'set');
  K.rail(960.4, T(960.4, 156), 156, 960.4, T(960.4, 186), 186, 'Coping', false);     // the feat already holds the 1.6 (built after it)
  K.B(963, 0, 155, 965, 3.2, 187, 'plaza');
  K.kicker(940, 170, 1, 0, 2.4, 0.6, 1.3);
  uni_pad(K, 926, 160, 932, 166, 0.25);
  K.rail(924, T(924, 182) + 0.45, 182, 944, T(944, 182) + 0.45, 182, 'Flatbar', true);
  K.jersey(946, 156, 952, 156.8);
  const g = T(930, 188);
  K.hubbas.push({ a: V(930, g + 1.2, 189), b: V(930, g + 0.02, 185), w: 8, noRails: true, color: 0xc49a5c });
  K.B(926, 0, 189, 934, g + 2.2, 190, 'wood', { edges: 'n' });
  K.decorFns.push(D => {
    D.tag(962.97, T(963, 170) + 2.4, 166, 5, 1.8, -Math.PI / 2);
    D.tag(962.97, T(963, 180) + 2.2, 179, 4, 1.6, -Math.PI / 2);
    D.tag(930, g + 2.0, 188.97, 5, 1.4, Math.PI);
  });
  P.tape(962, 176, T(962, 176));
  P.spot('Bike Shed DIY', 930, T(930, 175), 175, -Math.PI / 2, [912, 150, 970, 192]);
  P.travel('Bike Shed DIY', 930, T(930, 175), 175, -Math.PI / 2, 'park');
}

/* ---- the long strips of filler: Mill Lane, the Drive descent, the Field Walk, the field's edges ---- */
function uni_south_filler(K, P, PL) {
  const T = K.terrainH;
  // lean filler pieces: one grindable edge (the street-facing one) per piece keeps the grind-line count down
  const wall = (ax, az, bx, bz, h = 0.45, w = 0.6) => K.strip(ax, az, bx, bz, h, w, { kind: 'Ledge', color: 0xa39d90, seg: 16 });
  const led = (x0, z0, x1, z1, h, e) => K.Bg(x0, z0, x1, z1, h, 'ledge', { edges: e });
  const pad = (x0, z0, x1, z1, h = 0.2) => K.Bg(x0, z0, x1, z1, h, 'pad', { edges: '' });
  const ben = (x0, z0, x1, z1, e) => K.Bg(x0, z0, x1, z1, 0.45, 'wood', { edges: e });
  /* ---- Campus Drive, the descent (z 40..228, a bomb line): everything at the sidewalk edges, the road stays clear ---- */
  wall(660.2, 56, 660.2, 70);  K.busStop(659.8, 84, false, 1);
  wall(640, 100, 640, 114);    wall(660.2, 120, 660.2, 134);
  K.busStop(640.2, 148, false, -1); wall(660.2, 160, 660.2, 172);
  wall(640, 176, 640, 188);
  K.hydrant(660.8, 98); K.newsBoxes(640.4, 126, false, 2);
  K.bikeRack(660.6, 146, false, 2.4);
  /* ---- the Field Walk (x 705, z 44..192): a thing every ~25 m on either side of the line (the Twelve's roll-out stays clear to z 70) ---- */
  pad(714, 72, 722, 74.6); ben(691, 76, 695, 76.6, 'n'); K.bikeRack(713, 84, false, 2.4);
  led(710, 92, 720, 92.6, 0.45, 'n'); pad(692, 100, 699, 102.6); led(711, 108, 717, 110.4, 0.5, 'w'); led(690, 116, 699, 116.6, 0.45, 'n');
  ben(713.2, 124, 713.8, 130, 'w'); pad(691, 132, 698, 134.6); K.crossingGap(700, 143, 710, 143, 0.4);
  led(691, 150, 698, 150.6, 0.45, 's'); led(712, 192.6, 722, 193.2, 0.45, 's');
  /* ---- Mill Lane (z 200, x 496..974): north side z 192, south side z 207; types rotate every ~24 m ---- */
  const skip = x => x > 630 && x < 668;
  const kinds = ['ledge', 'pad', 'bench', 'gap', 'planter', 'ledge', 'gap', 'pad'];
  let i = 0;
  for (let x = 502; x < 960; x += 24, i++) {
    if (skip(x) || skip(x + 8)) continue;
    const north = i % 2 === 0, z = north ? 192.4 : 207.6, e = north ? 's' : 'n', k = kinds[i % kinds.length];
    if (k === 'ledge') led(x, z - 0.3, x + 9, z + 0.3, 0.45, e);
    else if (k === 'pad') pad(x, z - 1, x + 7, z + 1.2);
    else if (k === 'bench') { ben(x, z - 0.3, x + 2.6, z + 0.4, e); K.bikeRack(x + 6, z, true, 2.4); }
    else if (k === 'gap') K.crossingGap(x, z, x + 9, z, 0.4);
    else led(x, z - 1.2, x + 6, z + 1.2, 0.55, e);
  }
  K.construction(790, 211, true);                       // roadworks pocket on the south sidewalk
  K.construction(580, 211, true);
  K.newsBoxes(520.5, 193.2, true, 2); K.hydrant(560.5, 193.4); K.hydrant(888.5, 206.4);
  /* ---- Alumni Field's edges: ledges on the lawn side of the track and in front of the halls ---- */
  wall(910, 62, 910, 94); wall(910, 106, 910, 138);
  led(906, 98, 912, 102, 0.55, 'w');
  led(750, 148, 768, 148.6, 0.45, 's'); led(880, 148, 898, 148.6, 0.45, 's');
  // the field's west lawn, where the Grand Descent cuts the corner
  led(722, 62, 730, 62.6, 0.45, 'n'); led(716, 86, 726, 86.6, 0.45, 'n'); pad(728, 74, 736, 77);
  P.spot('Field Corner', 728, 1.4, 70, Math.PI, [716, 56, 742, 104]);
  // the Drive's foot: a pocket beside the gate seam, outside the corridor (x 642..658)
  wall(641.3, 209, 641.3, 225); wall(658.8, 209, 658.8, 225); led(621, 207.4, 629, 208, 0.45, 'n'); led(670, 207.4, 678, 208, 0.45, 'n');
}

/* ---- dashes and lamps on the Drive and Mill Lane ---- */
function uni_south_streets(K, P, PL) {
  K.dash(650, 34, 650, 193); K.dash(650, 207, 650, 228);
  K.dash(497, 200, 643, 200); K.dash(657, 200, 970, 200);
  for (let z = 52; z < 190; z += 24) { K.lamp(640, z, -1); K.lamp(660, z, 1); }
  for (let x = 510; x < 975; x += 28) {
    if (x > 626 && x < 674) continue;
    K.lamp(x, 192.6 - (x % 56 === 0 ? 0 : 0), -1); K.lamp(x + 14, 207.6, 1);
  }
}

/* ---- trees (kept off ledges, rails, lines and gate corridors) ---- */
function uni_south_trees(K, P, PL) {
  const segD = (px, pz, ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz, t = L2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / L2)) : 0; return Math.hypot(px - ax - t * dx, pz - az - t * dz); };
  const lines = [[[650, 40], [650, 228]], [[496, 200], [974, 200]], [[705, 44], [705, 192], [720, 200]], [[572, 20], [572, 50], [610, 66], [637, 56], [637, 184], [650, 200]],
    [[820, 16], [820, 30], [778, 36], [778, 53], [740, 66], [705, 100]], [[940, 200], [940, 176]], [[637, 48], [637, 184]]];
  const free = (x, z, m) => {
    for (const b of K.boxes) if (x > b.min[0] - m && x < b.max[0] + m && z > b.min[2] - m && z < b.max[2] + m) return false;
    for (const h of K.hubbas) if (segD(x, z, h.a.x, h.a.z, h.b.x, h.b.z) < m + (h.w || 0) / 2) return false;
    for (const r of K.rails) if (segD(x, z, r.a.x, r.a.z, r.b.x, r.b.z) < m) return false;
    for (const l of lines) for (let k = 0; k + 1 < l.length; k++) if (segD(x, z, l[k][0], l[k][1], l[k + 1][0], l[k + 1][1]) < 5) return false;
    if (x > 640 && x < 660 && z > 205) return false;
    return true;
  };
  const tr = (x, z) => { if (K.terrainH(x, z) > -90 && free(x, z, 3)) K.tree(x, z); };
  for (let k = 0; k < 12; k++) tr(512 + (k % 4) * 34 + (k > 7 ? 14 : 0), 158 + Math.floor(k / 4) * 11);   // Union Lawn
  for (let z = 56; z <= 140; z += 21) { tr(692, z + 5); tr(718, z + 9); }                                     // the Field Walk
  for (let x = 540; x < 975; x += 96) { tr(x, 186); tr(x + 40, 214); }                                          // Mill Lane
  for (const z of [56, 76, 96, 116, 136]) { tr(908, z); tr(973, z); }                                           // dorm lawns
  for (const [x, z] of [[744, 150], [770, 150], [880, 150], [902, 152]]) tr(x, z);
}

/* Old Town, the harbour part: x -420..300, z 742..910 (design/old.md section 9).
   The Terrace and the Miradouro, the Sea Gate, the Steep (z 758..894), Fishermen's Stairs, Pool Row, Harbour Wall Road with its
   fish docks and sea wall, Steep Street Skates, the seventeen harbour buildings, the Old Wall piece [746, 850], and the filler that
   keeps the streets from going dead (CONTRACT 7). */
function old_harbour(K, P, O) {
  const T = (x, z) => K.terrainH(x, z);
  /* where trees, lamps and filler may not go: [x0, z0, x1, z1] rects, and circles [x, z, r] already used */
  const blocked = [[-333, 742, -311, 910], [-209, 742, -191, 910], [111, 742, 129, 910], [-48, 742, -30, 884], [-210, 886, -190, 910]];
  const taken = [];
  const free = (x, z, r) => P.inside(x, z, 2) && !blocked.some(b => x > b[0] - r && x < b[2] + r && z > b[1] - r && z < b[3] + r) && !taken.some(t => Math.hypot(t[0] - x, t[1] - z) < t[2] + r);
  const put = (x, z, r, fn) => { if (!free(x, z, r)) return false; taken.push([x, z, r]); fn(); return true; };
  const ctx = { T, put, free, taken, blocked };
  old_harbour_terrace(K, P, O, ctx);
  old_harbour_gate(K, P, O, ctx);
  old_harbour_steep(K, P, O, ctx);
  old_harbour_stairs(K, P, O, ctx);
  old_harbour_poolrow(K, P, O, ctx);
  old_harbour_wall(K, P, O, ctx);
  old_harbour_houses(K, P, O, ctx);
  old_harbour_oldwall(K, P, O, ctx);
  old_harbour_filler(K, P, O, ctx);
  old_harbour_activities(K, P, O, ctx);
}

/* the Terrace road, the Miradouro promenade with its wall, benches, sign and telescope */
function old_harbour_terrace(K, P, O, c) {
  const Y = O.Y.terrace;
  K.street('x', 750, -329, 128, Y, [-320, -200, -40, 120], { rw: 5, sw: 3, lamps: false });
  // the promenade, crisp edges, in the same runs as the wall (the road mouths stay open)
  const runs = [[-310, -217], [-183, -50], [-28, 108]];
  K.decorFns.push(D => { for (const [a, b] of runs) D.plane(a, 758, b, 764, Y + 0.01, 0xd8d0bf, false); });
  for (const [a, b] of runs) { K.Bg(a, 763.5, b, 764.1, 0.55, 'ledge', { edges: 'ns', color: 0xe9e1cf }); c.taken.push([(a + b) / 2, 763.8, 0.1]); }
  // the sign on two posts, and a telescope
  K.prop(-122.5, Y, 760.3, -122.2, Y + 2.2, 760.6, 0x6b5a46); K.prop(-117.8, Y, 760.3, -117.5, Y + 2.2, 760.6, 0x6b5a46);
  K.decorFns.push(D => D.sign('MIRADOURO', -120, Y + 2.2, 760.5, 5, 0.8, Math.PI, '#ffffff', '#3f6fa8'));
  K.prop(-100.15, Y, 760.55, -99.85, Y + 1.3, 760.85, 0x3a3d42); K.prop(-100.45, Y + 1.3, 760.2, -99.55, Y + 1.5, 761.4, 0x6b7076);
  c.taken.push([-120, 760.5, 3], [-100, 760.7, 1.5]);
  // lamps on both sidewalks, trees on the north one
  for (const x of [-304, -272, -240, -168, -136, -104, -72, 0, 32, 64, 96]) { c.put(x, 744.5, 1.2, () => K.lamp(x, 744.5, -1)); }
  for (const x of [-288, -256, -152, -120, -88, 16, 48, 80]) { c.put(x, 756.3, 1.2, () => K.lamp(x, 756.3, 1)); }
  for (const x of [-296, -248, -160, -112, -80, -8, 24, 56, 88]) c.put(x, 743.1, 1.8, () => K.tree(x, 743.1));
}

/* the Sea Gate: two towers either side of the Steep and a decor arch */
function old_harbour_gate(K, P, O, c) {
  const Y = O.Y.terrace;
  for (const [x0, x1] of [[-216, -208], [-192, -184]]) {
    K.building(x0, 762, x1, 772, 4, 0xe9e1cf, 'stone');
    const top = Y + 13.6;
    for (const [dx, dz] of [[0, 0], [x1 - x0 - 1.4, 0], [0, 10 - 1.4], [x1 - x0 - 1.4, 10 - 1.4]]) K.prop(x0 + dx, top, 762 + dz, x0 + dx + 1.4, top + 0.9, 762 + dz + 1.4, 0xe9e1cf);
  }
  K.prop(-208, Y + 9, 763, -192, Y + 11.5, 771, 0xe9e1cf);
  K.decorFns.push(D => {
    const g = new THREE.CylinderGeometry(8, 8, 8, 20, 1, false, Math.PI / 2, Math.PI);
    D.add(g, 0xe9e1cf, [-200, Y + 11.5, 767], [Math.PI / 2, 0, 0], [1, 1, 0.3]);
    D.sign('PORTA DO MAR', -200, Y + 10.2, 762.9, 9, 1.1, Math.PI, '#3a3226', '#e9e1cf');
  });
  c.taken.push([-212, 767, 6], [-188, 767, 6]);
}

/* the Steep: hubba sidewalks, the Steep Rail, centre dashes, lamps */
function old_harbour_steep(K, P, O, c) {
  const T = c.T;
  for (const [a, b] of [[758, 864], [880, 894]]) { old_walk(K, O, -208, -205, a, b); old_walk(K, O, -195, -192, a, b); }
  // Rampart Street and Lantern Street sidewalks below the Terrace
  for (const [a, b] of [[-328, -325], [-315, -312], [112, 115], [125, 128]]) old_walk(K, O, a, b, 758, 864);
  const ra = T(-205.4, 788) + 0.15 + 0.9, rb = T(-205.4, 844) + 0.15 + 0.9;
  K.rail(-205.4, ra, 788, -205.4, rb, 844, 'Handrail', true);
  for (const xc of [-200, 120, -320]) {
    const z0 = xc === -200 ? 894 : 862;
    for (let z = 760; z < z0 - 3; z += 6) if (!(z + 3 > 862 && z < 882)) K.dash(xc, z, xc, z + 3);
    if (xc === -200) for (let z = 882; z < 892; z += 6) K.dash(xc, z, xc, z + 3);
  }
  for (const z of [774, 798, 822, 846]) K.lamp(-192.8, z, -1);
}

/* Fishermen's Stairs: five flights of six with raised landings, a cobble chute beside them */
function old_harbour_stairs(K, P, O, c) {
  const T = c.T;
  const tops = [-30.370, -32.176, -33.982, -35.788, -37.594], ats = [789.6, 805.2, 820.8, 836.4];
  K.B(-46, -32.5, 764, -38, tops[0], 789.6, 'step', { edges: 'e', color: 0xd8d0bf });
  for (let i = 0; i < 5; i++) {
    const at = i < 4 ? ats[i] : 862.0, top = tops[i], bottom = i < 4 ? tops[i + 1] : -39.400;
    K.stairSpot('z', at, 1, -46, -38, top, bottom, 6, 0.4, { rails: [-42] });
    if (i < 4) { const za = at + 2.0, zb = i < 3 ? ats[i + 1] : 862.0;
      K.B(-46, T(-42, zb) - 0.5, za, -38, bottom, zb, 'step', { edges: 'e', color: 0xd8d0bf }); }
  }
  // net-drying racks on the last landing (looks only)
  for (const z of [842, 849, 856]) { K.prop(-45.8, tops[4], z, -45.5, tops[4] + 1.6, z + 0.3, 0x6b5a46); K.prop(-45.8, tops[4] + 1.5, z, -44.6, tops[4] + 1.6, z + 0.3, 0x6b5a46); }
  K.decorFns.push(D => D.plane(-45.6, 842, -44.6, 858, tops[4] + 0.02, 0x8a7a5a, false));
}

/* Pool Row: two houses, two lots with backyard pools, garden walls, patio pads */
function old_harbour_poolrow(K, P, O, c) {
  const T = c.T;
  old_harbour_house(K, 130, 776, 146, 790, 2, 0xd99a8c, 'stone');
  old_harbour_house(K, 130, 812, 146, 826, 2, 0xd9a441, 'stone');
  K.backyardPool(170, 795, 1);
  K.backyardPool(170, 832, 1);
  K.Bg(146, 805.4, 194, 806, 0.5, 'ledge', { edges: 'ns' });
  K.Bg(146, 843.4, 194, 844, 0.5, 'ledge', { edges: 'ns' });
  K.Bg(193.4, 784, 194, 806, 1.0, 'fence', { edges: '' });
  K.Bg(193.4, 820, 194, 844, 1.0, 'fence', { edges: '' });
  for (const [pz, lo] of [[795, 786], [832, 823]]) {
    K.pad(149, pz - 5, 153, pz - 1.5); K.pad(149, pz + 2, 153, pz + 5.5); K.pad(179, pz - 1.5, 183, pz + 1.5);
    for (const dz of [-6, 6]) K.prop(186, T(186, pz + dz), pz + dz - 0.4, 188.4, T(186, pz + dz) + 0.35, pz + dz + 0.4, 0xe8e4da);
    c.taken.push([170, pz, 8]);
  }
  K.decorFns.push(D => { for (const [x, z] of [[188, 790], [188, 840], [141, 806], [141, 842]]) D.tree(x, T(x, z), z); });
  P.spot('Pool Row', 170, T(170, 814), 814, Math.PI, [146, 784, 194, 844]);
  P.travel('Pool Row', 150, T(150, 790), 790, -Math.PI / 2, 'spot');
}

/* Harbour Wall Road: fish docks, the sea wall, the quay bollards, a few ropes */
function old_harbour_wall(K, P, O, c) {
  const T = c.T;
  K.street('x', 872, -329, 128, O.Y.harbour, [-320, -200, -40, 120], { rw: 5, sw: 3, lamps: false });
  for (const [x0, x1, top] of [[-152, -138, -38.40], [-134, -118, -38.20], [-100, -80, -38.50], [-76, -56, -38.30]]) {
    K.B(x0, -40.0, 860, x1, top, 864, 'garage', { edges: 'swe' });
    K.prop(x0 + 0.5, top - 0.5, 859.8, x1 - 0.5, top - 0.3, 860, 0x2b2b2e);       // the bumper
  }
  for (const [x0, x1] of [[-310, -212], [-188, -50], [-28, 108]]) K.Bg(x0, 880.5, x1, 881.1, 0.5, 'ledge', { edges: 'ns', color: 0xc9bfa8 });
  for (const x of [-300, -270, -240, -160, -130, -100, -70, -64.5, -10, 20, 50, 80]) K.Bg(x - 0.3, 887.7, x + 0.3, 888.3, 0.6, 'metal', { edges: '' });
  K.decorFns.push(D => {
    const coil = new THREE.CylinderGeometry(0.7, 0.7, 0.35, 12), anchor = new THREE.TorusGeometry(0.6, 0.12, 6, 12);
    for (const x of [-250, 30]) D.add(coil, 0x8a7a5a, [x, T(x, 885) + 0.17, 885], [0, 0, 0], [1, 1, 1]);
    D.add(anchor, 0x3a3d42, [-120, T(-120, 885) + 0.6, 885], [Math.PI / 2, 0, 0], [1, 1, 1]);
  });
  // lamps and trees along both sidewalks, keeping the shop front clear
  for (const x of [-304, -272, -240, -168, -136, -104, -72, 0, 32, 64, 96]) c.put(x, 867.6, 1.2, () => K.lamp(x, 867.6, -1));
  for (const x of [-288, -256, -152, -120, -88, -16, 16, 48, 80]) c.put(x, 876.4, 1.2, () => K.lamp(x, 876.4, 1));
  for (const x of [-296, -248, -224, -64, -24, 8, 40, 72, 100]) c.put(x, 878.1, 1.8, () => K.tree(x, 878.1));
  c.taken.push([-173, 866, 9]);
  // Steep Street Skates
  old_harbour_house(K, -186, 840, -160, 864, 3, 0x3f6fa8, 'stone');
  P.shop({ name: 'Steep Street Skates', sign: [-173, -39.25 + 3.85, 864.04, 0, 7], awning: [-179, 864, -167, 865.6, -39.25 + 2.2], zone: [-177, 864.2, -169, 867], door: [-173, -39.25, 864.2] });
  P.travel('Steep Street Skates', -173, -39.25, 867, 0, 'spot');
  P.spot('Harbour Wall', -100, O.Y.harbour, 869, Math.PI, [-310, 860, 108, 882]);
}

/* a house: a collidable building and a terracotta roof slab with a little overhang */
function old_harbour_house(K, x0, z0, x1, z1, floors, color, tex) {
  K.building(x0, z0, x1, z1, floors, color, tex);
  const g = Math.max(K.terrainH(x0, z0), K.terrainH(x1, z1), K.terrainH(x0, z1), K.terrainH(x1, z0)) + floors * 3.4;
  K.prop(x0 - 0.4, g, z0 - 0.4, x1 + 0.4, g + 0.5, z1 + 0.4, 0xa94f32);
}

/* the other harbour buildings (H3 to H11) */
function old_harbour_houses(K, P, O, c) {
  const T = c.T;
  const H = (x0, z0, x1, z1, f, col, tex) => old_harbour_house(K, x0, z0, x1, z1, f, col, tex);
  const pc = [0xe9e1cf, 0xd9a441, 0xd99a8c, 0xc0623f, 0xe9e1cf, 0x9b8f7a];
  let i = 0; const C = () => pc[i++ % pc.length];
  H(-390, 766, -331, 812, 2, C(), 'stone'); H(-390, 818, -331, 861, 2, C(), 'brick');
  H(-309, 778, -217, 818, 3, C(), 'stone'); H(-309, 824, -217, 861, 3, C(), 'brick');
  H(-189, 778, -160, 834, 3, C(), 'stone');
  H(-155, 830, -110, 860, 2, 0xa5553a, 'brick'); H(-105, 830, -52, 860, 2, 0xa5553a, 'brick');
  H(-155, 778, -52, 824, 2, C(), 'stone');
  H(-29, 778, 108, 820, 3, C(), 'brick'); H(-29, 826, 108, 861, 3, C(), 'stone');
  H(198, 770, 286, 861, 2, C(), 'stone'); H(134, 866, 286, 890, 2, C(), 'brick');
  // roll doors on the warehouses
  for (const x of [-142, -128, -90, -72]) K.prop(x - 2.5, T(x, 860.2) + 0.9, 860.0, x + 2.5, T(x, 860.2) + 4.2, 860.15, 0x6b7076);
}

/* the Old Wall, its south piece, and the tape at its far end */
function old_harbour_oldwall(K, P, O, c) {
  const T = c.T;
  old_slopeLedge(K, -403, -401.8, 746, 850, 0.55, 0xc9bfa8, -401.8);
  for (let z = 748; z < 848; z += 4) { const y = T(-402.7, z) + 0.55; K.prop(-403, y, z, -402.4, y + 0.4, z + 1.6, 0xc9bfa8); }
  P.tape(-402.4, 849, T(-402.4, 849) + 0.55);
  P.spot('Old Wall South', -402.4, T(-402.4, 790) + 0.55, 790, Math.PI, [-403, 746, -401.8, 850]);
}

/* the small skateable things between the named spots (CONTRACT 7): planters, benches, racks, low walls, a roadworks pocket, pads, containers */
function old_harbour_filler(K, P, O, c) {
  const T = c.T, put = c.put;
  // the Terrace: a roadworks pocket on the north sidewalk, then planters, benches, racks and low ledges every ~19 m
  put(-150, 743.5, 7, () => K.construction(-150, 743.5, true));
  let k = 0;
  for (const [a, b] of [[-312, -208], [-192, -48], [-32, 112]]) for (let x = a + 8; x < b - 5; x += 19) {
    const t = k++ % 4;
    if (t === 0) put(x + 1.5, 743.1, 2.2, () => K.planter(x, 742.4, x + 3, 743.7));
    else if (t === 1) put(x + 1.2, 758.6, 1.8, () => K.bench(x, 758.3, x + 2.4, 758.9));
    else if (t === 2) put(x, 756.7, 1.8, () => K.bikeRack(x, 756.7, true));
    else put(x + 3, 743.1, 3.5, () => K.strip(x, 743.1, x + 6, 743.1, 0.45, 0.9, { kind: 'Ledge' }));
  }
  // Harbour Wall Road: planters and benches on the north sidewalk, racks and a bench on the south one
  k = 0;
  for (let x = -306; x < 112; x += 21) {
    const t = k++ % 3;
    put(x + 1.5, 865.2, 2.2, () => K.planter(x, 864.6, x + 3, 865.8));
    if (t === 0) put(x + 10, 878.4, 1.8, () => K.bikeRack(x + 10, 878.4, true));
    else if (t === 1) put(x + 10, 878.4, 1.8, () => K.bench(x + 10, 878.1, x + 12.4, 878.7));
    else put(x + 10, 878.4, 1.2, () => K.newsBoxes(x + 10, 878.4, true, 2));
  }
  // low ledges beside Lantern Street (the bomb), Rampart Street and the Steep, kept at the edges
  for (let z = 790; z < 860; z += 20) {
    put(109.5, z + 2, 2.6, () => K.ledge(108.4, z, 110.6, z + 4, 0.45));
    put(129.5, z + 2, 2.6, () => K.ledge(128.5, z, 130.3, z + 4, 0.45));
  }
  for (const z of [748, 760, 772]) put(109.5, z, 2.6, () => K.ledge(108.4, z, 110.6, z + 4, 0.45));
  for (const z of [748, 764, 774]) put(129.5, z + 2, 2.6, () => K.ledge(128.5, z, 130.3, z + 4, 0.45));
  for (let z = 772; z < 860; z += 26) {
    put(-329.8, z + 2, 2.6, () => K.ledge(-330.5, z, -329.2, z + 4, 0.45));
    put(-310.8, z + 15, 2.6, () => K.ledge(-311.7, z + 13, -310.2, z + 17, 0.45));
  }
  for (let z = 782; z < 860; z += 30) put(-210.6, z + 2, 2.6, () => K.ledge(-211.8, z, -209.4, z + 4, 0.45));
  // the quay: pads and a short container row either side of the Steep, pads at the gate seam
  for (const x of [-290, -225, -150, -90, -30, 40, 90]) put(x + 3, 884.6, 3.5, () => K.pad(x, 884, x + 6, 885.2));
  K.pad(-219, 889, -213, 890.2); K.pad(-187, 889, -181, 890.2);
  put(-130, 892.8, 22, () => K.containers(-150, 891.6, 3, [1, 2, 1], true, 1.5, T(-150, 894.5) - 0.1));
  put(60, 892.8, 22, () => K.containers(40, 891.6, 3, [2, 1, 1], true, 1.5, T(40, 894.5) - 0.1));
}
function old_harbour_activities(K, P, O, c) {
  const T = c.T;
  P.spot('Miradouro', -120, O.Y.terrace, 760, Math.PI, [-310, 756, 108, 764]);
  P.spot('The Steep', -200, T(-200, 816), 816, Math.PI, [-208, 776, -192, 864]);
  P.spot('Fishermen\'s Stairs', -42, -33.98, 815, Math.PI, [-46, 764, -32, 864]);
  P.travel('Porta do Mar', -200, O.Y.terrace, 752, Math.PI, 'spot');
  P.challenge({ id: 'old-steep-speed', name: 'Bomb the Steep', desc: 'Hit 60 km/h on the Steep below the Sea Gate', at: [-200, -33, 800], go: [-200, -30.37, 752, Math.PI], kind: 'speed', speed: 60 / 3.6, area: [-208, 776, -192, 870] });
  P.challenge({ id: 'old-miradouro', name: 'Miradouro Line', desc: 'Land a 4,000 point line that starts on the Terrace', at: [-120, -29.8, 760], go: [-140, -30.2, 757, -Math.PI / 2], kind: 'score', pts: 4000, area: [-310, 742, 108, 766] });
  P.challenge({ id: 'old-rampart', name: 'Rampart Run', desc: 'From the top of the Rope Walk, three grinds in one line, 5,000 points', at: [-320, -1.45, 256], go: [-320, -1.45, 250, Math.PI], kind: 'line', pts: 5000, need: [['grind', 3]], area: [-324, 246, -316, 262] });
  P.challenge({ id: 'old-feeble', hard: true, name: 'Feeble the Fishermen\'s Rail', desc: 'Feeble grind a Fishermen\'s Stairs handrail', at: [-42, -30.37, 787], go: [-42, -30.37, 768, Math.PI], kind: 'grind', rail: 'Handrail', grind: 'Feeble', area: [-43, 789, -41, 866] });
  P.tape(172, 832, T(172, 832));
}

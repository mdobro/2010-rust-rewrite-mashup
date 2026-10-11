/* Financial Core, Civic Hill (north): Switchback Road, City Hall with the Twelve, Council Drive and the Treasury Ramp,
   Civic Square, Council Garden, the Bourse, the towers, and the filler that keeps the lines in the rect from going dead.
   Design: levels/porto/design/fin.md section 6. Rect [-420, 140, -230, -140]. */
function fin_north(K, P, PL) {
  const T = (x, z) => K.terrainH(x, z), C = PL.colors, V3 = (x, y, z) => V(x, y, z);
  const hub = (ax, ay, az, bx, by, bz, w, o = {}) => K.hubbas.push({ a: V3(ax, ay, az), b: V3(bx, by, bz), w, ...o });
  const tree = (x, y, z) => K.decorFns.push(D => D.tree(x, y, z));
  const GR = 0x3a3d42;

  /* ---------- Switchback Road: x -107..-93, z -230..-140 (the colour comes from P.col) ---------- */
  for (const x of [-109, -91]) hub(x, 1.073, -212, x, 0.15, -140, 4, { kind: 'Curb', noRails: false, color: 0xb9b5ab });
  for (let z = -226; z < -146; z += 6) K.dash(-100, z, -100, z + 3, 0xe2c044);
  for (let z = -208; z <= -150; z += 18) { K.lamp(-112, z, 1); K.lamp(-88, z, -1); }
  P.traffic({ path: [[-100, -214], [-100, -136]], lane: 3.5, dir: 1, n: 2, speed: 10, r: 6 });

  /* ---------- City Hall ---------- */
  K.building(8, -214, 72, -196, 4, C.granite, 'stone');
  for (let k = 0; k < 10; k++) K.B(13 + 6 * k, 4.0, -195, 13.9 + 6 * k, 12.5, -194.1, 'marble');
  K.prop(10, 12.5, -196.2, 70, 14, -193.9, 0xd8cfbf);
  K.decorFns.push(D => {
    D.add(new THREE.CylinderGeometry(1, 1, 1, 28), 0xd8cfbf, [40, 16, -205], [0, 0, 0], [9, 3, 9]);
    D.add(new THREE.SphereGeometry(1, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), 0x6f9a86, [40, 17.5, -205], [0, 0, 0], [9, 7.5, 9], { metalness: 0.3, roughness: 0.4 });
    D.add(new THREE.CylinderGeometry(0.25, 0.25, 4, 8), 0xd9a93f, [40, 26, -205], [0, 0, 0], [1, 1, 1]);
    D.sign('CITY HALL', 40, 13.25, -193.85, 20, 1.0, 0, '#e8e4da', '#3a3d42');
  });
  P.landmark({ at: [40, 0, -205], near: 140, parts: [
    { shape: 'box', at: [0, 7.2, 0], size: [64, 14.4, 18], color: 0xc9b9a3 },
    { shape: 'cyl', at: [0, 16, 0], size: [18, 3, 18], color: 0xd8cfbf },
    { shape: 'sphere', at: [0, 17.5, 0], size: [18, 15, 18], color: 0x6f9a86 }] });

  // the terrace, the Twelve and what goes with it
  K.B(0, -0.5, -196, 80, 4.0, -170, 'marble');
  K.stairSpot('z', -170, 1, 30, 50, 4.0, 0.36, 12, 0.42, { rails: [40] });
  K.rail(40, 0.963, -165.08, 40, 0.963, -161.5, 'Handrail');
  for (const x of [28.9, 51.1]) hub(x, 4.38, -170.35, x, 0.823, -165.08, 1.6, { kind: 'Hubba', color: C.granite });
  for (const x of [9, 71]) hub(x, 4.0, -170, x, T(x, -160.5) + 0.02, -160.5, 10, { noRails: true, color: 0xc4bfb3 });
  for (const [x0, x1] of [[0, 4], [14, 28.1], [51.9, 66], [76, 80]]) K.lip(x0, -170, x1, -170, 4.0);
  K.lip(0, -196, 0, -186, 4.0); K.lip(80, -196, 80, -186, 4.0);
  K.B(4, 4.0, -182.3, 24, 4.45, -181.7, 'ledge', { edges: 'ns', color: GR });
  K.B(56, 4.0, -182.3, 76, 4.45, -181.7, 'ledge', { edges: 'ns', color: GR });
  for (const x of [30, 46]) { K.B(x, 4.0, -190, x + 4, 4.6, -186, 'ledge', { edges: 'ns' }); tree(x + 2, 4.6, -188); }
  P.npc({ kind: 'session', rail: [4, -182.3, 24, -182.3], start: 2, end: 27, back: 3.4, side: -1, speed: 5 });
  P.spot('City Hall Twelve', 40, 4.0, -176, Math.PI, [0, -196, 80, -150]);

  /* ---------- Council Drive and the Treasury Ramp: the long downhill ledges ---------- */
  hub(0, 4.0, -186, -86, 0.61, -186, 8, { kind: 'Ledge', color: C.granite });
  hub(80, 4.0, -186, 138, 0.61, -186, 8, { kind: 'Ledge', color: C.granite });
  P.spot('Council Drive', -2, 4.0, -186, Math.PI / 2, [-88, -192, 2, -180]);
  P.spot('Treasury Ramp', 82, 4.0, -186, -Math.PI / 2, [78, -192, 138, -180]);

  /* ---------- Hall of Records, Treasury ---------- */
  K.building(-80, -214, -8, -196, 4, C.granite, 'stone');
  K.building(86, -214, 136, -196, 5, C.glass, 'office');

  /* ---------- Civic Square (x 0..80, z -165..-140): marble, keep x 30..50 clear ---------- */
  K.decorFns.push(D => {
    const g = new THREE.PlaneGeometry(80, 0.3).rotateX(-Math.PI / 2), tilt = Math.atan(1 / 78);
    for (let z = -163; z < -140; z += 4) D.add(g, 0xcfc8b8, [40, T(40, z) + 0.012, z], [tilt, 0, 0], [1, 1, 1]);
  });
  K.ledge(9.6, -159, 10.4, -146, 0.55, 'ledge'); K.ledge(69, -159, 69.8, -146, 0.55, 'ledge');
  for (const [x0, x1] of [[16, 22], [58, 64]]) K.bench(x0, -148.3, x1, -147.7);
  K.bench(1.7, -158, 2.3, -154); K.bench(77.7, -158, 78.3, -154);
  P.peds({ path: [[2, -158], [78, -158], [78, -143], [2, -143]], n: 3 });

  /* ---------- Council Garden (x -86..0, z -165..-140) ---------- */
  K.ledge(-60, -155.4, -30, -154.6, 0.5, 'ledge');
  for (const [x, z] of [[-82, -160], [-70, -146], [-56, -160], [-44, -146], [-30, -160], [-18, -146], [-8, -160], [-80, -146]]) K.tree(x, z);
  K.bench(-48, -158, -42, -157.4); K.bench(-26, -146, -20, -145.4);

  /* ---------- the Bourse (x -300..-220) ---------- */
  K.building(-300, -214, -220, -190, 6, C.marble, 'stone');
  for (let k = 0; k < 8; k++) K.B(-296 + 10 * k, 2.4, -190, -295.2 + 10 * k, 9.5, -189.2, 'marble');
  K.decorFns.push(D => D.sign('THE BOURSE', -260, 11.4, -189.9, 24, 1.4, 0, '#e8e4da', '#3a2f1e'));
  K.B(-300, -0.5, -190, -220, 2.4, -176, 'granite');
  K.lip(-300, -176, -284.8, -176, 2.4); K.lip(-235.2, -176, -220, -176, 2.4);
  K.stairSpot('z', -176, 1, -284, -236, 2.4, 0.43, 7, 0.42, { rails: [-272, -260, -248], hubbas: [-284.4, -235.6] });
  K.B(-232, 2.4, -186, -226, 3.2, -180, 'granite', { edges: 'nswe' });
  K.B(-238, 2.4, -185.3, -233.5, 2.85, -184.7, 'wood', { edges: 'ns' }); K.B(-224.5, 2.4, -185.3, -221, 2.85, -184.7, 'wood', { edges: 'ns' });
  K.decorFns.push(D => {   // the bear
    D.add(new THREE.SphereGeometry(1, 12, 9), 0x6b4a32, [-229, 4.0, -183], [0, 0, 0], [1.5, 0.95, 1.0]);
    D.add(new THREE.SphereGeometry(0.55, 10, 8), 0x6b4a32, [-227.6, 4.7, -183], [0, 0, 0], [1, 1, 1]);
  });
  P.spot('Bourse Steps', -260, 2.4, -182, Math.PI, [-300, -190, -220, -150]);
  P.tape(-296, -184, 2.4);

  /* ---------- the towers ---------- */
  K.building(-390, -214, -346, -176, 18, C.glass2, 'office');
  K.building(-196, -214, -150, -180, 12, C.glass3, 'office');
  for (let x = -400; x <= -150; x += 24) K.lamp(x, -144, 1);

  /* ---------- challenges ---------- */
  P.challenge({ id: 'fin-twelve', name: 'Kickflip the City Hall Twelve', desc: 'Kickflip down the twelve-stair off the terrace', at: [40, 4, -170.5], go: [36, 4, -180, Math.PI],
    kind: 'trick', trick: 'Kickflip', from: [30, -176, 50, -169.8, 3.6], to: [28, -165.5, 52, -145, -1, 1.2] });
  P.challenge({ id: 'fin-twelve-rail', name: 'City Hall Handrail', desc: 'Grind the handrail down the twelve', at: [40, 4.0, -171], go: [40, 4.0, -180, Math.PI],
    kind: 'grind', rail: 'Handrail', area: [38.5, -171, 41.5, -161] });
  P.challenge({ id: 'fin-twelve-feeble', hard: true, name: 'Feeble the City Hall Hubba', desc: 'Feeble grind a City Hall hubba', at: [28.9, 4.4, -171], go: [28.9, 4.0, -180, Math.PI],
    kind: 'grind', rail: 'Hubba', grind: 'Feeble', area: [27.5, -171, 52.5, -164.5] });
  P.challenge({ id: 'fin-treasury-speed', name: 'Treasury Run', desc: 'Hit 35 km/h down the Treasury Ramp', at: [110, 2.0, -186], go: [70, 4, -186, -Math.PI / 2],
    kind: 'speed', speed: 9.7, area: [80, -190, 140, -182] });

  fin_north_fill(K, P, PL);
}

/* the small things between the named spots: along Switchback Road, Civic Walk, Bourse Walk and the Bourse-Mint line */
function fin_north_fill(K, P, PL) {
  const T = (x, z) => K.terrainH(x, z), led = 0xa9a59c;
  // Switchback Road: the sidewalks beside the curb grinds get a thing every 25 m or so (nothing in the lane, nothing north of z -214)
  fin_plant(K, -118, -205, -113.5, -201);
  K.newsBoxes(-114, -192, false, 2);
  K.busStop(-115, -178, false, -1);
  K.bikeRack(-114, -164, false, 2.4);
  K.strip(-115.5, -158, -115.5, -148, 0.45, 0.6, { kind: 'Ledge', seg: 30, color: led });
  fin_plant(K, -84, -204, -80, -200);
  K.strip(-84.5, -190, -84.5, -176, 0.4, 0.6, { kind: 'Ledge', seg: 30, color: led });
  K.construction(-82, -166, false);
  K.hydrant(-85, -150);
  K.bench(-85.3, -146, -84.7, -141.5);
  // Bourse Walk (z -144, x -400..-150): a planter, a bench, a long ledge or a rack about every 22 m
  fin_plant(K, -398, -151, -392, -148);
  K.bench(-378, -148.5, -372, -147.9);
  K.strip(-362, -149, -340, -149, 0.45, 0.7, { kind: 'Ledge', seg: 30, color: led });
  K.bikeRack(-326, -148, true, 2.6);
  K.construction(-308, -148.5, true);
  fin_padx(K, -290, -148, -280, -145.5, 0.18);
  // (x -286..-234 below the steps stays clear: it is the Bourse Steps roll-away)
  K.strip(-300, -150, -288, -150, 0.5, 0.7, { kind: 'Ledge', seg: 30, color: led });
  fin_plant(K, -232, -151, -226, -148);
  K.newsBoxes(-224, -149, true, 2); K.hydrant(-216, -148);
  K.bench(-206, -148.5, -200, -147.9);
  K.strip(-192, -149, -170, -149, 0.4, 0.7, { kind: 'Ledge', seg: 30, color: led });
  fin_plant(K, -160, -151, -154, -148);
  // the Bourse-Mint line below the steps (x -270..-255, z -170..-140)
  K.strip(-230, -160, -216, -160, 0.45, 0.7, { kind: 'Ledge', seg: 30, color: led });
  // Civic Walk and the Council Garden edge, and the two ends of the Treasury Ramp
  K.hydrant(-90, -153); K.trashCan(-76, -148);
  fin_plant(K, 100, -154, 108, -151); K.bench(118, -149, 124, -148.4);
  K.strip(126, -156, 138, -156, 0.4, 0.7, { kind: 'Ledge', seg: 30, color: led });
}

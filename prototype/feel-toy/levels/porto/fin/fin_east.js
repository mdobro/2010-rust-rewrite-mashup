/* Financial Core, East (Exchange, Metro and Treasury): the Observatory Promenade, the Cascade, the spillway, the Golden Nautilus,
   the Spiral Rim, Metro Plaza and Central station, Metro Avenue, the east buildings, the car park, Treasury Gardens and the Long
   Pool, plus the filler that keeps the lines in the rect from going dead.
   Design: levels/porto/design/fin.md section 7. Rect [140, 360, -230, 230]. */

/* a rounded rectangle of Coping rails round a pool rim (cx, cz centre; hx, hz half sizes; rr corner radius) at height y */
function fin_east_rim(K, cx, cz, hx, hz, rr, y) {
  const pts = [], arcs = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
  arcs.forEach(([sx, sz], i) => {
    const ccx = cx + sx * (hx - rr), ccz = cz + sz * (hz - rr), a0 = [0, Math.PI / 2, Math.PI, Math.PI * 1.5][i];
    for (let k = 0; k <= 2; k++) { const a = a0 + k / 2 * Math.PI / 2; pts.push([ccx + Math.cos(a) * rr, ccz + Math.sin(a) * rr]); }
  });
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    K.rails.push({ a: V(p[0], y, p[1]), b: V(q[0], y, q[1]), kind: 'Coping', coping: true });
  }
}

function fin_east(K, P, PL) {
  const T = (x, z) => K.terrainH(x, z), C = PL.colors, GOLD = C.gold, GR = C.black;
  const hub = (ax, ay, az, bx, by, bz, w, o = {}) => K.hubbas.push({ a: V(ax, ay, az), b: V(bx, by, bz), w, ...o });
  const dtree = (x, y, z) => K.decorFns.push(D => D.tree(x, y, z));
  const Hb = PL.Hb;

  /* ---------- 7.1 Observatory Promenade (x 214..226, z -214..-132): the berm comes from the ground ---------- */
  for (const x of [215.5, 224.5]) for (const [z0, z1] of [[-200, -190], [-176, -166], [-152, -142]])
    hub(x, Hb(z1) + 0.45, z1, x, Hb(z0) + 0.45, z0, 0.6, { kind: 'Ledge', color: C.granite });
  for (let z = -208; z <= -140; z += 16) { K.tree(206, z); K.tree(234, z + 8); }
  for (let z = -204; z <= -140; z += 24) K.lamp(227.4, z, 1);

  /* ---------- 7.2 the Cascade (terrace y 3.0): a drained basin with coping ---------- */
  K.pool(208, 232, -126, -110, [[K.poolS.rect(220, -118, 11, 7, 2.5), 1.3]], 3.0, 0.25);
  fin_east_rim(K, 220, -118, 11, 7, 2.5, 3.0);
  for (const x of [198, 242]) { K.bench(x - 0.3, -126, x + 0.3, -120); K.bench(x - 0.3, -116, x + 0.3, -110); }
  K.decorFns.push(D => { const g = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 6);
    for (let x = 210; x <= 230; x += 2) D.add(g, 0xf4f6f8, [x, 3.7, -104.6], [0, 0, 0], [1, 1, 1]); });

  /* ---------- 7.3 the spillway (x 208..232, z -104..-76): two cheek-wall hubbas ---------- */
  hub(207.4, 3.5, -104, 207.4, 0.5, -76, 1.2, { kind: 'Ledge', color: GR });
  hub(232.6, 3.5, -104, 232.6, 0.5, -76, 1.2, { kind: 'Ledge', color: GR });
  P.spot('Cascade', 220, 3.0, -108, Math.PI, [196, -132, 244, -76]);

  /* ---------- 7.4 the Golden Nautilus (centre x 220, z -60) ---------- */
  hub(220, 0.45, -68.5, 220, 0.02, -71, 12, { noRails: true, color: GOLD });          // K1
  hub(220, 1.3, -66, 220, 0.45, -68.5, 12, { noRails: true, color: GOLD });           // K2
  K.lip(214, -66, 226, -66, 1.3);
  K.B(214, -0.3, -61, 226, 1.2, -60, 'marble', { edges: 'n' });                        // the landing bank
  hub(220, 1.2, -60, 220, 0.02, -50, 12, { noRails: true, color: C.marble });
  K.B(206, -0.3, -63, 212.5, 1.6, -57, 'marble', { edges: 'nswe' });                   // west pedestal: a manual pad and a tape
  K.B(227.5, -0.3, -63, 234, 6.0, -57, 'marble', { edges: '' });                     // east pedestal: the shell's foot
  K.decorFns.push(D => {   // the shell: a log spiral of gold spheres in the plane z -60, the arch kept clear below y 4.5
    const g = new THREE.SphereGeometry(1, 14, 10);
    for (let th = -0.4; th <= 8.5; th += 0.25) { const r = 12.5 * Math.exp(-0.2 * (th + 0.4));
      D.add(g, GOLD, [220 + r * Math.cos(th), 11 + r * Math.sin(th), -60], [0, 0, 0], [0.25 * r, 0.25 * r, 0.2 * r], { metalness: 0.45, roughness: 0.3 }); }
    D.add(new THREE.CylinderGeometry(1, 1.4, 1, 20), 0x3a3d42, [220, 0.02, -60], [0, 0, 0], [9, 0.04, 9]);   // the ring marking
  });
  P.landmark({ at: [220, 0, -60], near: 140, parts: [
    { shape: 'sphere', at: [0, 11, 0], size: [22, 22, 5], color: GOLD },
    { shape: 'sphere', at: [-3, 12, 0], size: [10, 10, 4.5], color: 0xb98a2c },
    { shape: 'box', at: [7.5, 3, 0], size: [6.5, 6, 6], color: C.marble }] });
  P.spot('Golden Nautilus', 220, 1.0, -75, Math.PI, [206, -104, 234, -50]);
  P.tape(209, -60, 1.6);

  /* ---------- 7.5 Spiral Rim (centre 262, -46): about 24 level gold chords ---------- */
  { let prev = null;
    for (let i = 0; i <= 12; i++) { const ph = i * 0.66, R = 15 * Math.exp(-0.12 * ph), p = [262 + R * Math.cos(Math.PI + ph), -46 + R * Math.sin(Math.PI + ph)];
      if (prev) { hub(prev[0], 0.5, prev[1], p[0], 0.5, p[1], 0.7, { noRails: true, color: GOLD }); K.rail(prev[0], 0.5, prev[1], p[0], 0.5, p[1], 'Ledge'); }
      prev = p; } }
  P.spot('Spiral Rim', 247, 0, -52, 0, [245, -63, 279, -29]);

  /* ---------- 7.6 Metro Plaza (x 150..300, z -98..-11) and the Metro Steps ---------- */
  K.B(150, -0.5, -44, 196, 1.5, -20, 'granite', { edges: 'nsw' });
  K.stairSpot('x', 196, 1, -38, -26, 1.5, 0, 5, 0.42, { rails: [-38.45, -25.55] });
  hub(173, 1.5, -44, 173, 0.02, -49.5, 14, { noRails: true, color: 0xc4bfb3 });
  K.lip(196, -44, 196, -38.9, 1.5); K.lip(196, -25.1, 196, -20, 1.5);
  K.B(156, 1.5, -32.4, 170, 1.95, -31.6, 'ledge', { edges: 'ns' });
  fin_plant(K, 276, -90, 290, -80, 0.85);
  fin_padx(K, 240, -30, 252, -22, 0.3);
  P.spot('Metro Steps', 190, 1.5, -32, -Math.PI / 2, [150, -44, 210, -20]);
  P.npc({ kind: 'loop', path: [[205, -17], [295, -17], [295, -72], [238, -72], [238, -40], [205, -40]], speed: 5.8 });
  P.peds({ path: [[208, -20], [290, -20], [290, -68], [242, -68], [242, -43], [208, -43]], n: 1 });

  /* ---------- 7.7 Metro Central and Metro Avenue ---------- */
  K.prop(146, 7.4, -12.5, 206, 15, 14.5, C.glass);
  for (const x of [150, 165, 180, 195]) for (const z of [-12.2, 11.4]) K.B(x - 0.4, 0, z, x + 0.4, 7.4, z + 0.8, 'plaza');
  K.decorFns.push(D => {
    D.overpass(120, 146, -4, 8, 8.6);
    D.sign('METRO CENTRAL', 145.9, 12, 1, 14, 1.8, -Math.PI / 2, '#e8e4da', '#2f4a63');
  });
  K.street('x', 0, 140, 359.5, 0, [220], { rw: 7, sw: 4, lamps: false });
  for (let i = -6; i <= 6; i++) K.dash(216.5, i * 1.1, 223.5, i * 1.1, 0xf0ece2, 0.5);
  for (let x = 152; x <= 332; x += 24) { K.lamp(x, 10.6, 1); K.lamp(x + 12, -10.6, -1); }
  P.traffic({ path: [[150, 0], [340, 0]], lane: 3.2, dir: 1, n: 4, speed: 11, r: 6 });

  /* ---------- 7.8 buildings ---------- */
  K.building(146, -134, 186, -104, 24, C.glass, 'office');
  K.building(146, -214, 200, -200, 4, C.granite, 'stone');
  K.building(146, -172, 200, -142, 6, C.glass2, 'office');
  K.building(254, -136, 300, -100, 7, C.marble, 'stone');
  K.building(306, -136, 346, -90, 10, C.glass3, 'office');
  K.building(254, -212, 296, -160, 20, C.glass, 'office');
  K.building(304, -212, 346, -170, 14, C.glass2, 'office');
  K.building(146, 22, 186, 54, 6, C.granite, 'stone');
  K.building(192, 22, 201, 54, 8, C.glass, 'office');   // the doc's (192, 22, 222, 54) split to leave an 8 m arcade lane at x 201..209 for the Treasury Line
  K.building(209, 22, 222, 54, 8, C.glass, 'office');
  K.building(228, 22, 262, 54, 5, C.brick, 'brick');
  K.building(268, 22, 306, 54, 9, C.glass2, 'office');
  K.building(312, 22, 344, 54, 6, C.granite, 'stone');
  K.building(146, 66, 190, 110, 8, C.glass3, 'office');
  K.building(146, 120, 190, 170, 5, C.brick, 'brick');

  /* ---------- 7.9 the car park and its roll-in ---------- */
  K.garage(146, 176, 190, 212, 5, 1);
  hub(190, 5, 200, 204, 0.02, 200, 10, { kind: 'Ledge' });
  P.tape(186, 208, 5.0);

  /* ---------- 7.10 Treasury Gardens (x 196..346, z 60..214): the humps come from the ground ---------- */
  K.pool(202, 270, 70, 90, [[K.poolS.rect(236, 80, 32, 7, 1.5), 1.0]], 0, 0.5);
  fin_east_rim(K, 236, 80, 32, 7, 1.5, 0);
  P.tape(210, 80, -1.0);
  // the sign wall stands east of the Treasury Line (x 205), so the line runs into the gardens past it
  K.B(209, -0.3, 61, 223, 0.6, 62.2, 'granite', { edges: 'ns' });
  K.prop(210, 0.6, 61.2, 210.3, 1.6, 61.5, 0x3a3d42); K.prop(221.7, 0.6, 61.2, 222, 1.6, 61.5, 0x3a3d42);
  K.decorFns.push(D => D.sign('TREASURY GARDENS', 216, 1.15, 61.1, 10, 0.9, Math.PI, '#e8e4da', '#2f4a3a'));
  for (const [x, z] of [[227, 62], [236, 63], [262, 64], [284, 66], [300, 62], [330, 66], [214, 104], [250, 108], [270, 120], [320, 104], [332, 130],
      [262, 150], [322, 176], [340, 150], [212, 150], [262, 184], [276, 206], [308, 206], [338, 200], [250, 204], [226, 160], [280, 174], [290, 100]])
    K.tree(x, z);
  for (const [x, z] of [[244, 63.4], [236, 98], [262, 140], [270, 196], [310, 120]]) K.bench(x - 1.1, z - 0.3, x + 1.1, z + 0.3);
  for (const [x, z] of [[207, 63.5], [255, 63.5], [272, 100], [209, 120], [255, 200], [330, 120]]) K.lamp(x, z, 1);
  P.peds({ path: [[198, 63], [274, 63], [274, 97], [198, 97]], n: 1 });

  /* ---------- challenges ---------- */
  const gapFrom = [214, -71, 226, -66, 0.3], gapTo = [213, -61, 227, -50, 0, 1.5];
  P.challenge({ id: 'fin-shell-gap', name: 'The Shell Gap', desc: 'Clear the gap under the Nautilus and land the marble bank', at: [220, 1.3, -66.5], go: [220, 3, -100, Math.PI], kind: 'gap', from: gapFrom, to: gapTo });
  P.challenge({ id: 'fin-shell-tre', hard: true, name: '360 Flip the Shell Gap', desc: 'A 360 flip over the Nautilus gap', at: [220, 1.3, -64], go: [220, 3, -100, Math.PI], kind: 'trick', tricks: ['360 Flip'], from: gapFrom, to: gapTo });
  P.challenge({ id: 'fin-spiral', name: 'Round the Shell', desc: 'Land a 1,500 point line with three grinds round the Spiral Rim', at: [247, 0.5, -48], go: [236, 0, -46, 0], kind: 'line', pts: 1500, area: [245, -63, 279, -29], need: [['grind', 3]] });
  P.challenge({ id: 'fin-cascade', name: 'Cascade Walls', desc: 'Grind a spillway cheek wall', at: [207.4, 3.5, -103], go: [214, 3, -110, Math.PI], kind: 'grind', rail: 'Ledge', area: [206, -104, 234, -76] });

  fin_east_fill(K, P, PL);
}

/* the filler: small skateable things along the streets and lines of the east rect (CONTRACT 7) */
function fin_east_fill(K, P, PL) {
  const T = (x, z) => K.terrainH(x, z);
  const hub = (ax, ay, az, bx, by, bz, w, o = {}) => K.hubbas.push({ a: V(ax, ay, az), b: V(bx, by, bz), w, ...o });

  /* Metro Avenue (z 0): the strips between the sidewalks and the frontages (south) and the plaza (north), x 150..334 */
  // the things stand on the sidewalks (|z| 7..11, top 0.15), in the band |z| 8.2..9.8 inside 10 m of the line, clear of the
  // x 209..231 crossing (the Treasury Line crosses there). Boxes from y 0 so they sit on the slab, not in it.
  const SL = (x0, x1, s, top, mat, w, edges) => { const z0 = s * (9 - w / 2), z1 = s * (9 + w / 2); K.B(x0, 0, Math.min(z0, z1), x1, top, Math.max(z0, z1), mat, { edges }); };
  SL(155, 167, 1, 0.6, 'ledge', 0.6, 'ns'); SL(179, 185, 1, 0.7, 'ledge', 1.6, 'ns'); SL(201, 208, 1, 0.4, 'pad', 1.6, '');
  K.kicker(234, 9, 1, 0, 2.4, 0.55, 1.6); SL(238, 247, 1, 0.6, 'ledge', 0.6, 'ns'); SL(253, 269, 1, 0.6, 'ledge', 0.7, 'ns');
  K.kicker(275, 9, 1, 0, 2.4, 0.55, 1.6); SL(281, 293, 1, 0.6, 'ledge', 0.6, 'ns'); SL(300, 306, 1, 0.7, 'ledge', 1.6, 'ns');
  SL(309, 318, 1, 0.4, 'pad', 1.6, ''); SL(324, 334, 1, 0.4, 'pad', 1.6, ''); K.busStop(188, 15, true, 1); K.bikeRack(244, 13.5, true); K.newsBoxes(258, 13.5, true, 2);
  SL(150, 160, -1, 0.4, 'pad', 1.6, ''); SL(168, 174, -1, 0.7, 'ledge', 1.6, 'ns'); SL(178, 184, -1, 0.6, 'wood', 0.6, 'ns');
  SL(192, 206, -1, 0.4, 'pad', 1.6, ''); SL(233, 245, -1, 0.6, 'ledge', 0.6, 'ns');
  K.kicker(250, -9, 1, 0, 2.4, 0.55, 1.6); SL(254, 262, -1, 0.4, 'pad', 1.6, ''); SL(268, 280, -1, 0.6, 'ledge', 0.6, 'ns');
  SL(286, 292, -1, 0.6, 'wood', 0.6, 'ns'); SL(298, 304, -1, 0.7, 'ledge', 1.6, 'ns'); SL(312, 328, -1, 0.6, 'ledge', 0.6, 'ns');

  /* Treasury Walk (z -186, x 140..214) and the Treasury Line across the Exchange court: a mall between the offices */
  K.ledge(148, -181, 158, -180.4, 0.45); K.kicker(163, -181, 1, 0, 2.4, 0.5, 1.6); fin_padx(K, 167, -182, 179, -178.5, 0.18);
  K.rail(183, T(183, -181) + 0.4, -181, 196, T(196, -181) + 0.4, -181, 'Flatbar');
  fin_plant(K, 199, -193, 206, -190, 0.55);   // off the walk's line (z -186), beside it K.bench(176, -191.3, 182, -190.7);
  K.tree(160, -195); K.tree(190, -195); K.tree(172, -175); K.tree(205, -176); K.tree(214, 208);

  /* the Observatory gate seam: planters beside (not in) the 12 m corridor */
  fin_plant(K, 207, -226, 211.5, -222, 0.55); fin_plant(K, 228.5, -226, 233, -222, 0.55);

  /* Metro Plaza */
  K.ledge(152, -63, 164, -62.4, 0.45); fin_padx(K, 176, -68, 188, -62.5, 0.18); K.ledge(192, -72, 192.8, -62, 0.45);
  K.ledge(284.4, -56, 285.2, -44, 0.45); K.kicker(287, -34, 0, -1, 2.4, 0.5, 1.6);
  K.ledge(268, -24.6, 282, -24, 0.45); fin_plant(K, 282, -30, 286, -27, 0.55);

  /* the arcade lane between the frontages (x 201..209, z 22..54) and the south end of the Treasury Line */
  K.ledge(201.6, 24, 202.4, 50, 0.45); K.ledge(207.6, 24, 208.4, 50, 0.45);
  K.ledge(224.6, 26, 225.4, 48, 0.45);
  fin_plant(K, 210, 56, 218, 59, 0.55); fin_plant(K, 192, 56, 200, 59, 0.55);

  /* Treasury Gardens along the line at x 205: low garden walls, a picnic table, a bench wall */
  K.strip(207, 110, 207, 128, 0.45, 0.7, { kind: 'Ledge', seg: 30, color: 0xa39d90 });
  K.strip(203, 132, 203, 146, 0.45, 0.7, { kind: 'Ledge', seg: 30, color: 0xa39d90 });
  K.bench(199.7, 121, 200.3, 127); fin_plant(K, 207, 152, 214, 155, 0.55);
  K.strip(201, 160, 201, 176, 0.5, 0.7, { kind: 'Ledge', seg: 30, color: 0xa39d90 }); fin_plant(K, 207, 186, 214, 189, 0.55);
  fin_padx(K, 199, 196, 203, 208, 0.18);

  P.spot('Long Pool', 203, 0, 80, -Math.PI / 2, [200, 66, 272, 94]);
  P.spot('Car Park Roll-in', 184, 5, 200, -Math.PI / 2, [150, 176, 206, 212]);
}

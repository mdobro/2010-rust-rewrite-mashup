/* The Arroyo, the Upper part: the channel north of z 360 and both levee strips. Rect [-752, -648, -230, 360].
   Grates and headwalls, grate pops, Catwalk W, the upper storm doors, the Channel Curbs, the DIY Underpass, the Seco Viaduct,
   the Levee Path bridge over the tributary, the ford, the guardrails, and the filler between them (CONTRACT 7).
   Design: levels/porto/design/arroyo.md sections 4.1-4.8, 6, 11.1. */
function arroyo_upper(K, P, PL) {
  const { F, B } = PL, T = K.terrainH, PI = Math.PI;
  const hub = (ax, ay, az, bx, by, bz, w, o = {}) => K.hubbas.push({ a: V(ax, ay, az), b: V(bx, by, bz), w, noRails: !!o.noRails, kind: o.kind, color: o.color });
  const CONC = 0xa8a39a, STEEL = 0x6b7178, PLY = 0xc49a5c;
  const tag = (x, y, z, w, h, rot) => K.decorFns.push(D => D.tag(x, y, z, w, h, rot));

  /* ---------- the slot: grates, headwalls, pops ---------- */
  for (const z of PL.grates) if (z + 3 < 359) K.B(-702.2, F(z + 3) - 1.4, z, -697.8, F(z) + 0.03, z + 3, 'metal');
  for (const [z0, z1] of PL.headwalls) if (z1 < 359) K.B(-703, F((z0 + z1) / 2) - 1.5, z0, -697, F((z0 + z1) / 2) + 0.45, z1, 'garage', { edges: 'nswe' });
  for (const z of PL.popsW) if (z < 356) K.kicker(-708, z, 0, 1, 1.8, 0.34, 1.6, 0x4a4d52);
  for (const z of PL.popsE) if (z < 356) K.kicker(-692, z, 0, 1, 1.8, 0.34, 1.6, 0x4a4d52);

  /* ---------- 4.1 the North Ford (z -176..-164): posts, a gauge board, ledges at the lips ---------- */
  for (const x of [-721, -679]) { const g = T(x, -170); K.prop(x - 0.15, g - 0.2, -170.15, x + 0.15, g + 1.0, -169.85, 0xd9b72a); }
  { const g = T(-679, -172); K.prop(-679.1, g, -172.1, -678.9, g + 2.6, -171.9, 0xe8e4da);
    for (let i = 0; i < 4; i++) K.prop(-679.2, g + 0.4 + i * 0.6, -172.15, -678.8, g + 0.6 + i * 0.6, -171.85, 0xb8302a); }
  K.ledge(-748, -176.3, -740, -175.7, 0.45, 'ledge');                       // the ford's west lip
  K.ledge(-660, -164.3, -652, -163.7, 0.45, 'ledge');                       // the ford's east lip
  K.ledge(-724, -177.2, -717, -176.6, 0.45, 'ledge'); K.ledge(-683, -163.3, -676, -162.7, 0.45, 'ledge');   // the ford's side ledges
  K.kicker(-686, -181, 0, 1, 2, 0.36, 1.8, 0x4a4d52);                        // a lid at the edge of the lane
  K.pad(-692, -160, -684, -156.5, 0.2);

  /* ---------- 4.2 Catwalk W: the steel walkway on the west wall toe ---------- */
  hub(-719, F(-112) + 1.0, -112, -719, F(-28) + 1.0, -28, 2, { kind: 'Ledge', color: STEEL });
  hub(-719, F(-112) + 1.0, -112, -719, F(-116) + 0.02, -116, 2, { noRails: true, color: STEEL });
  K.rail(-717.9, F(-110) + 2.0, -110, -717.9, F(-30) + 2.0, -30, 'Rail', true);

  /* ---------- 4.5 the upper storm doors ---------- */
  for (const [side, z] of PL.doors.upper) {
    if (side === 'W') { K.B(-722, F(z + 3) - 0.5, z, -718.6, F(z) + 0.9, z + 3, 'garage', { edges: 'es' });
      hub(-720.3, F(z) + 0.9, z, -720.3, F(z - 3.2) + 0.02, z - 3.2, 3.4, { noRails: true, color: 0x5a6068 }); }
    else { K.B(-681.4, F(z + 3) - 0.5, z, -678, F(z) + 0.9, z + 3, 'garage', { edges: 'ws' });
      hub(-679.7, F(z) + 0.9, z, -679.7, F(z - 3.2) + 0.02, z - 3.2, 3.4, { noRails: true, color: 0x5a6068 }); }
  }

  /* ---------- 4.6 the Channel Curbs ---------- */
  for (const x of [-712, -688]) hub(x, F(60) + 0.4, 60, x, F(98) + 0.4, 98, 0.6, { kind: 'Ledge', color: CONC });

  /* ---------- 6 the DIY Underpass (z 104..216) ---------- */
  const f = F;
  for (const x of [-707, -693]) hub(x, f(108) + 0.22, 108, x, f(140) + 0.22, 140, 0.4, { kind: 'Curb', color: 0xb8402e });   // the slappy curbs (-707 is the session rail)
  K.B(-718, f(120.6) - 0.3, 120, -709, f(120) + 0.45, 120.6, 'brick', { edges: 'ns' });                                           // cinderblock ledges
  K.B(-691, f(126.6) - 0.3, 126, -682, f(126) + 0.55, 126.6, 'brick', { edges: 'ns' });
  K.kicker(-714, 134, 0, 1, 2.4, 0.6, 1.4);                                                                                        // kicker to the flatbar
  K.rail(-721, f(146) + 0.5, 146, -715, f(146) + 0.5, 146, 'Rail', true);
  for (const [x, z0, z1] of [[-712, 151, 153.4], [-712, 166.6, 169], [-688, 151, 153.4], [-688, 166.6, 169]])         // the pier columns
    K.B(x - 1.2, f(z0) - 0.5, z0, x + 1.2, -2.0, z1, 'concrete');
  for (const x of [-712, -688]) {                                                                                                   // the pier banks
    hub(x, f(151) + 1.8, 151, x, f(146) + 0.02, 146, 2.4, { noRails: true, color: 0xb9b5ab });
    hub(x, f(169) + 1.8, 169, x, f(174) + 0.02, 174, 2.4, { noRails: true, color: 0xb9b5ab });
  }
  { const top = f(160) + 1.0;                                                                                                       // the pyramid
    K.B(-702, f(162) - 0.3, 158, -698, top, 162, 'concrete', { edges: 'nswe' });
    hub(-700, top, 158, -700, f(155) + 0.02, 155, 4, { noRails: true, color: 0xb9b5ab });
    hub(-700, top, 162, -700, f(165) + 0.02, 165, 4, { noRails: true, color: 0xb9b5ab });
    hub(-702, top, 160, -705, f(160) + 0.02, 160, 4, { noRails: true, color: 0xb9b5ab });
    hub(-698, top, 160, -695, f(160) + 0.02, 160, 4, { noRails: true, color: 0xb9b5ab }); }
  hub(-720, f(176) + 1.4, 176, -720, f(200) + 1.4, 200, 2, { kind: 'Ledge', color: CONC });                                        // the Wall Ledge and its banks
  for (const z of [180, 188, 196]) hub(-719, f(z) + 1.4, z, -715, f(z) + 0.02, z, 8, { noRails: true, color: 0xb9b5ab });
  K.jersey(-714, 182, -708, 182.8); K.jersey(-690, 190, -684, 190.8);
  K.pad(-706, 178, -694, 184, 0.2);
  K.kicker(-686, 200, -1, 0, 2.0, 0.5, 1.6); K.kicker(-700, 204, 0, 1, 2.0, 0.5, 2);
  K.prop(-691.5, f(132), 132.5, -690.3, f(132) + 0.9, 133.7, 0x8a8f94);                                                            // a shopping cart
  K.prop(-712, f(188), 192, -709.6, f(188) + 0.75, 193.4, 0x7a3b2e);                                                               // a sofa
  for (const [x, z] of [[-704, 112], [-696, 112], [-709, 176]]) K.prop(x - 0.2, f(z), z - 0.2, x + 0.2, f(z) + 0.7, z + 0.2, 0xe0703a);   // cones
  for (const [x, z] of [[-713.2, 152], [-686.8, 168], [-710.8, 168], [-689.2, 152]]) K.prop(x - 0.2, -4.2, z - 0.2, x + 0.2, -3.8, z + 0.2, 0xffe9a8);   // work lights
  tag(-713.25, f(152) + 2.6, 152.2, 2.2, 1.4, -PI / 2); tag(-710.75, f(152) + 3.0, 152.2, 2.2, 1.6, PI / 2);
  tag(-689.25, f(168) + 2.8, 167.8, 2.2, 1.6, -PI / 2); tag(-686.75, f(168) + 2.4, 167.8, 2.2, 1.4, PI / 2);
  tag(-720.9, f(190) + 2.6, 190, 6, 2.4, PI / 2);

  /* ---------- 4.8 the Seco Viaduct ---------- */
  K.B(-736, -2.0, 152, -664, 0.0, 168, 'garage');
  K.B(-736, 0, 152, -664, 0.8, 152.6, 'garage', { edges: 'ns' });
  K.B(-736, 0, 167.4, -664, 0.8, 168, 'garage', { edges: 'ns' });
  K.paintRect(-736, 152.6, -664, 167.4, 0x56585d, 0.012);
  for (let x = -734; x < -666; x += 6) K.dash(x, 160, x + 3, 160);
  for (let x = -732; x <= -668; x += 12.8) for (const z of [152.3, 167.7]) { K.prop(x - 0.08, 0.8, z - 0.08, x + 0.08, 5.0, z + 0.08, 0x3a3d42); K.prop(x - 0.35, 5.0, z - 0.1, x + 0.35, 5.15, z + 0.1, 0xf2c14e); }
  K.decorFns.push(D => {
    D.sign('SECO VIADUCT', -700, -1.0, 151.9, 10, 1.2, PI, '#f0ece2', '#2e3f5c');
    const geo = new THREE.TorusGeometry(12, 0.5, 5, 18, PI);
    for (const xc of [-724, -700, -676]) for (const z of [152.4, 167.6]) D.add(geo, 0x9b968a, [xc, -14.0, z], [0, 0, 0], [1, 1, 1]);
  });

  /* ---------- 3.3 the Levee Path bridge over the tributary (the Levee Road one is east's) ---------- */
  K.B(-664, -1.0, -48, -648, 0, -32, 'concrete');
  K.B(-664, 0, -48, -663.4, 0.8, -32, 'concrete', { edges: 'we' });          // parapets down the sides of the deck (the doc's run along the ditch lips and would wall off the path)
  K.B(-648.6, 0, -48, -648, 0.8, -32, 'concrete', { edges: 'we' });
  // the confluence: a ledge on the main floor and a lid on the tributary floor
  K.ledge(-696, -37, -686, -36.4, 0.45, 'ledge');
  K.kicker(-673, -40, -1, 0, 2.2, 0.4, 2.4, 0x4a4d52);

  /* ---------- 7.6 the levee guardrails, 24-28 m pieces with 6 m drop-in gaps ---------- */
  const guard = (x, zones) => {
    let lo = -213; const cuts = [...zones, [359, 359]];
    for (const [a, b] of cuts) {
      for (let z = lo; z < a - 3; z += 34) {
        const e = Math.min(z + 28, a - 0.5), n = Math.ceil((e - z) / 12);
        for (let i = 0; i < n; i++) { const z0 = z + (e - z) * i / n, z1 = z + (e - z) * (i + 1) / n; K.rail(x, B(z0) + 0.9, z0, x, B(z1) + 0.9, z1, 'Rail', true); }
        if (x < -700 && z > 215 && e - z > 10) K.prop(x - 0.1, B((z + e) / 2) + 0.9, z, x + 0.1, B((z + e) / 2) + 2.4, e, 0x8a9096);   // chain-link above it
      }
      lo = b;
    }
  };
  guard(-736.3, [[-182, -158], [146, 174]]);
  guard(-663.7, [[-182, -158], [-56, -26], [146, 174]]);
  K.decorFns.push(D => D.sign('DANGER - CHANNEL FLOODS WITHOUT WARNING', -737, 1.4, -190, 4, 1.2, -PI / 2, '#1a1a1a', '#f2c14e'));

  /* ---------- filler: parapet wings at the viaduct ends, the channel fringe, and the two levee strips ---------- */
  for (const [x0, x1] of [[-744, -736], [-664, -656]]) { K.B(x0, -0.4, 152, x1, 0.8, 152.6, 'garage', { edges: 'ns' }); K.B(x0, -0.4, 167.4, x1, 0.8, 168, 'garage', { edges: 'ns' }); }
  // the floor fringe: things at the edges of the lane, never in it
  K.ledge(-719, -201, -714, -200.4, 0.45, "ledge");                         // culvert slab
  K.construction(-683, -100, false);                                         // roadworks pocket on the east fringe
  K.ledge(-717, 14, -711, 14.6, 0.45, 'ledge');
  K.pad(-688, 30, -682, 34, 0.25);
  K.ledge(-717, 228, -711, 228.6, 0.45, 'ledge');
  K.planter(-690, 250, -684, 252.5, 0.5);
  K.pad(-718, 258, -712, 262, 0.25);
  K.construction(-683, 305, false);
  K.ledge(-717, 336, -711, 336.6, 0.45, 'ledge');
  // the levee strips: a small something about every 38 m on the outer edge, clear of the path and the drop-in gaps
  const skip = (z, zones) => zones.some(([a, b]) => z > a && z < b);
  const strips = [[-749, [[-188, -154], [140, 180]]], [-652.5, [[-188, -154], [-62, -20], [140, 180]]]];
  for (const [xo, zones] of strips) {
    let i = 0;
    for (let z = -200; z < 345; z += 38, i++) {
      if (skip(z, zones) || skip(z - 6, zones) || skip(z + 6, zones)) continue;
      switch (i % 6) {
        case 0: K.bench(xo, z - 1.5, xo + 0.6, z + 1.5); break;
        case 1: K.ledge(xo, z - 3, xo + 0.6, z + 3, 0.45, 'ledge'); break;
        case 2: K.pad(xo - 0.5, z - 2, xo + 2, z + 2, 0.2); break;
        case 3: K.jersey(xo, z - 3, xo + 0.8, z + 3); break;
        case 4: K.bikeRack(xo + 1, z, false, 2.4); K.bikeRack(xo + 1, z + 4, false, 2.4); break;
        default: K.construction(xo + 1.5, z, false);
      }
    }
    for (let z = -170; z < 330; z += 64) if (!skip(z, zones) && !skip(z - 3, zones) && !skip(z + 3, zones)) K.lamp(xo < -700 ? -751.2 : -649.2, z, xo < -700 ? 1 : -1);
  }

  /* ---------- challenges, spots, travel ---------- */
  const yF = z => F(z);
  P.spot('North Ford', -700, yF(-172) + 0.2, -172, PI, [-720, -200, -680, -150]);
  P.spot('Catwalk W', -717, yF(-70) + 1.1, -70, PI, [-724, -130, -712, -20]);
  P.spot('Channel Curbs', -700, yF(80) + 0.2, 80, PI, [-720, 50, -680, 100]);
  P.spot('DIY Underpass', -700, yF(160) + 0.2, 160, PI, [-720, 104, -680, 216]);
  P.spot('Confluence', -688, yF(-38) + 0.2, -38, PI / 2, [-700, -52, -672, -28]);
  P.spot('Storm Door Row', -700, yF(300) + 0.2, 300, PI, [-720, 230, -680, 340]);
  P.travel('DIY Underpass', -714, yF(108), 108, PI, 'park');
  P.challenge({ id: 'arroyo-diy-score', name: 'Underpass Session', desc: 'Land 4,000 points in one line in the DIY Underpass',
    at: [-714, yF(106) + 0.1, 106], go: [-714, yF(96) + 0.1, 96, PI], kind: 'score', pts: 4000, area: [-720, 104, -680, 216] });
  P.challenge({ id: 'arroyo-viaduct-grind', name: 'Parapet', desc: 'Grind the Seco Viaduct parapet',
    at: [-742, 0.9, 152.3], go: [-748, 0.1, 160, PI / 2], kind: 'grind', rail: 'Ledge', area: [-736, 150, -664, 170] });
  P.challenge({ id: 'arroyo-catwalk-feeble', hard: true, name: 'Catwalk Feeble', desc: 'Feeble grind the Catwalk W handrail',
    at: [-717.9, yF(-112) + 2.0, -112], go: [-719, yF(-134) + 0.1, -134, PI], kind: 'grind', rail: 'Rail', grind: 'Feeble', area: [-720, -112, -716, -28] });
  P.challenge({ id: 'arroyo-bomb', name: 'Bomb the Arroyo', desc: 'Hit 45 km/h rolling down the channel',
    at: [-700, yF(226) + 0.1, 226], go: [-700, yF(222) + 0.1, 222, PI], kind: 'speed', speed: 45 / 3.6, area: [-720, 222, -680, 400] });
  P.challenge({ id: 'arroyo-ditch-line', hard: true, name: 'The Full Run', desc: 'From the culvert to past the pipes: three grinds, a manual, 5,000 points',
    at: [-700, yF(-206) + 0.1, -206], go: [-700, yF(-224) + 0.1, -224, PI], kind: 'line', pts: 5000, area: [-720, -230, -680, -195], need: [['grind', 3], ['Manual', 1]] });
}

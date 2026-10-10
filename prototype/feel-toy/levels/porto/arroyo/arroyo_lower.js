/* The Arroyo, the Lower part: the channel from z 360 to the spillway and both levee strips. Rect [-752, -648, 360, 910].
   Grates and headwalls, grate pops, Catwalk E, the lower storm doors, the footbridge deck and its stair tower, the Pipe Crossing
   (two water mains, the West Door kicker, the Little Door), the Outfall debris and flat bars, the South Ford lips, the guardrails,
   and the filler between them (CONTRACT 7). Design: levels/porto/design/arroyo.md sections 4.9-4.12, 11.2.
   The spillway corridor (z 894..910) stays clear. */
function arroyo_lower(K, P, PL) {
  const { F, B } = PL, T = K.terrainH, PI = Math.PI;
  const hub = (ax, ay, az, bx, by, bz, w, o = {}) => K.hubbas.push({ a: V(ax, ay, az), b: V(bx, by, bz), w, noRails: !!o.noRails, kind: o.kind, color: o.color });
  const CONC = 0xa8a39a, STEEL = 0x6b7178, RAMP = 0xb9b5ab;
  const skip = (z, zones) => zones.some(([a, b]) => z > a && z < b);

  /* ---------- the slot: grates, headwalls, pops ---------- */
  for (const z of PL.grates) if (z >= 359 && z + 3 < 893) K.B(-702.2, F(z + 3) - 1.4, z, -697.8, F(z) + 0.03, z + 3, 'metal');
  for (const [z0, z1] of PL.headwalls) if (z0 >= 359) K.B(-703, F((z0 + z1) / 2) - 1.5, z0, -697, F((z0 + z1) / 2) + 0.45, z1, 'garage', { edges: 'nswe' });
  for (const z of PL.popsW) if (z >= 356) K.kicker(-708, z, 0, 1, 1.8, 0.34, 1.6, 0x4a4d52);
  for (const z of PL.popsE) if (z >= 356) K.kicker(-692, z, 0, 1, 1.8, 0.34, 1.6, 0x4a4d52);

  /* ---------- 4.9 Catwalk E: the steel walkway on the east wall toe ---------- */
  hub(-681, F(380) + 1.0, 380, -681, F(468) + 1.0, 468, 2, { kind: 'Ledge', color: STEEL });
  hub(-681, F(380) + 1.0, 380, -681, F(376) + 0.02, 376, 2, { noRails: true, color: STEEL });
  K.rail(-682.1, F(382) + 2.0, 382, -682.1, F(466) + 2.0, 466, 'Rail', true);

  /* ---------- 4.5 the lower storm doors ---------- */
  for (const [side, z] of PL.doors.lower) {
    if (side === 'W') { K.B(-722, F(z + 3) - 0.5, z, -718.6, F(z) + 0.9, z + 3, 'garage', { edges: 'es' });
      hub(-720.3, F(z) + 0.9, z, -720.3, F(z - 3.2) + 0.02, z - 3.2, 3.4, { noRails: true, color: 0x5a6068 }); }
    else { K.B(-681.4, F(z + 3) - 0.5, z, -678, F(z) + 0.9, z + 3, 'garage', { edges: 'ws' });
      hub(-679.7, F(z) + 0.9, z, -679.7, F(z - 3.2) + 0.02, z - 3.2, 3.4, { noRails: true, color: 0x5a6068 }); }
  }

  /* ---------- 4.10 the footbridge deck, handrails and the stair tower ---------- */
  K.B(-736, -18.6, 517, -664, -17.85, 523, 'concrete');
  K.paintRect(-736, 517, -664, 523, 0xb9b1a3, -17.84);
  const deckRail = (z, x0, x1) => { const n = Math.ceil((x1 - x0) / 12); for (let i = 0; i < n; i++) K.rail(x0 + (x1 - x0) * i / n, -16.85, z, x0 + (x1 - x0) * (i + 1) / n, -16.85, z, 'Rail', false); K.B(x0, -17.85, z - 0.05, x1, -16.85, z + 0.05, 'fence'); };
  deckRail(516.9, -736, -664);                                                           // 12 m pieces that chain
  deckRail(523.1, -736, -688.5); deckRail(523.1, -683.5, -664);                         // (the south rail's gap is the stair head)
  { const rise = 3.44, tops = [[523, -17.85], [530.05, -17.85 - rise], [537.1, -17.85 - 2 * rise]];
    for (const [z, top] of tops) K.stairSpot('z', z, 1, -688, -684, top, top - rise, 10, 0.45, { rails: [-688.45, -683.55] });
    // the solid under the flights and the two 3 m landings
    K.B(-688, F(527) - 0.6, 523, -684, -17.85 - rise, 527.05, 'concrete');
    K.B(-688, F(528) - 0.6, 527.05, -684, -17.85 - rise, 530.05, 'concrete', { edges: 'nswe' });
    K.B(-688, F(532) - 0.6, 530.05, -684, -17.85 - 2 * rise, 534.1, 'concrete');
    K.B(-688, F(535) - 0.6, 534.1, -684, -17.85 - 2 * rise, 537.1, 'concrete', { edges: 'nswe' }); }
  for (const [x, z, s] of [[-728, 517.3, 1], [-714, 522.7, -1], [-694, 517.3, 1], [-676, 522.7, -1]]) {   // work lamps, looks only (a solid lamp post would stop a grind on the rail)
    K.prop(x - 0.06, -17.85, z - 0.06, x + 0.06, -13.0, z + 0.06, 0x3c4146); K.prop(x - 0.05, -13.1, z, x + 0.05, -13.0, z + s * 1.0, 0x3c4146); K.prop(x - 0.2, -13.2, z + s * 0.8, x + 0.2, -13.1, z + s * 1.2, 0xf3e9c8); };

  /* ---------- 4.11 the Pipe Crossing ---------- */
  { const PIPE_X0 = -724.5, PIPE_X1 = -675.5, N = 8, zOf = (z0, x) => z0 + 0.839 * (x + 712);
    const cyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 12), fl = new THREE.CylinderGeometry(0.62, 0.62, 0.3, 12);
    const pts = z0 => Array.from({ length: N + 1 }, (_, i) => { const x = PIPE_X0 + (PIPE_X1 - PIPE_X0) * i / N, z = zOf(z0, x); return [x, z, F(z) + 2.4]; });
    for (const z0 of [597, 602]) {
      const q = pts(z0);
      for (let i = 0; i < N; i++) K.rail(q[i][0], q[i][2], q[i][1], q[i + 1][0], q[i + 1][2], q[i + 1][1], 'Pipe', false);
      K.decorFns.push(D => {
        for (let i = 0; i < N; i++) {
          const a = V(q[i][0], q[i][2] - 0.5, q[i][1]), b = V(q[i + 1][0], q[i + 1][2] - 0.5, q[i + 1][1]), d = b.clone().sub(a), L = d.length(); d.divideScalar(L);
          const rot = [Math.acos(d.y), Math.atan2(d.x, d.z), 0];
          D.add(cyl, 0x6b7682, [(a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2], rot, [1, L, 1], { metalness: 0.5, roughness: 0.45 });
          D.add(fl, 0x535c66, [a.x, a.y, a.z], rot, [1, 1, 1], { metalness: 0.5, roughness: 0.5 });
        }
      });
      for (let i = 2; i < N - 1; i += 2) {                                               // A-frame props
        const [x, z, y] = q[i], g = T(x, z);
        if (g > y - 2.2) continue;
        for (const dx of [-0.9, 0.9]) K.prop(x + dx - 0.1, g, z - 0.1, x + dx + 0.1, y - 0.5, z + 0.1, 0x4a4f55);
        K.prop(x - 1.0, y - 1.0, z - 0.1, x + 1.0, y - 0.9, z + 0.1, 0x4a4f55);
      }
      for (const i of [0, N]) { const [x, z, y] = q[i]; K.B(x - 1, y - 1.5, z - 1, x + 1, y + 0.5, z + 1, 'concrete'); }   // the anchor blocks
    }
  }
  // the West Door kicker (the gap launcher) and the Little Door
  hub(-712, F(592.5) + 1.8, 592.5, -712, F(588) + 0.02, 588, 4, { noRails: true, color: RAMP });
  K.B(-690, F(606.5) - 0.5, 603, -686, F(603) + 1.0, 606.5, 'garage', { edges: 'nws' });

  /* ---------- 4.12 the Outfall: debris slabs, flat bars, props ---------- */
  for (const [x, z] of [[-710, 676], [-686, 712], [-711, 788]]) {
    K.Bg(x - 2, z - 0.6, x, z + 0.6, 0.45, 'ledge', { edges: 'nswe' });
    K.Bg(x, z - 0.1, x + 2, z + 1.1, 0.45, 'ledge', { edges: 'nswe' });
  }
  K.rail(-686, F(650) + 0.4, 650, -686, F(662) + 0.4, 662, 'Rail', true);
  K.rail(-710, F(748) + 0.4, 748, -710, F(760) + 0.4, 760, 'Rail', true);
  for (const [x, z, h] of [[-716, 690, 0.9], [-684, 730, 0.9], [-712, 800, 0.9]]) K.prop(x - 0.35, T(x, z), z - 0.25, x + 0.35, T(x, z) + h, z + 0.25, 0x8a8f94);     // carts
  for (const [x, z] of [[-696, 688], [-714, 770], [-686, 764], [-700, 822]]) K.prop(x - 0.45, T(x, z), z - 0.45, x + 0.45, T(x, z) + 0.3, z + 0.45, 0x2a2b2d);          // tyres
  // the South Ford (z 856..868): chamfered lips either side of the lane, the lane itself bare
  for (const [a, b] of [[-751.5, -728], [-672, -648.5]]) for (const z of [856.3, 867.7]) K.strip(a, z, b, z, 0.15, 0.6, { kind: 'Ledge', color: RAMP });
  K.ledge(-718, 851.6, -712, 852.2, 0.45, 'ledge'); K.ledge(-688, 871.8, -682, 872.4, 0.45, 'ledge');

  /* ---------- 7.6 the levee guardrails, 24-28 m pieces with 6 m drop-in gaps ---------- */
  const guard = (x, zones) => {
    let lo = 361; const cuts = [...zones, [892, 892]];
    for (const [a, b] of cuts) {
      for (let z = lo; z < a - 3; z += 34) {
        const e = Math.min(z + 28, a - 0.5), n = Math.ceil((e - z) / 12);
        for (let i = 0; i < n; i++) { const z0 = z + (e - z) * i / n, z1 = z + (e - z) * (i + 1) / n; K.rail(x, B(z0) + 0.9, z0, x, B(z1) + 0.9, z1, 'Rail', true); }
        if (x < -700 && e - z > 10) K.prop(x - 0.1, B((z + e) / 2) + 0.9, z, x + 0.1, B((z + e) / 2) + 2.4, e, 0x8a9096);   // chain-link above it
      }
      lo = b;
    }
  };
  guard(-736.3, [[508, 532], [853, 871]]);
  guard(-663.7, [[508, 532], [853, 871]]);

  /* ---------- filler: the channel fringe and the two levee strips ---------- */
  // the floor fringe: things at the edges of the lane, never in it
  K.ledge(-717, 372, -711, 372.6, 0.45, 'ledge');
  K.pad(-687, 400, -681, 404, 0.25);
  K.ledge(-717, 446, -711, 446.6, 0.45, 'ledge');
  K.ledge(-684, 576, -678, 576.6, 0.45, 'ledge');
  K.pad(-720, 644, -715, 648, 0.25);
  K.ledge(-687, 636, -681, 636.6, 0.45, 'ledge');
  K.pad(-686, 690, -680.5, 694, 0.25);
  K.ledge(-717, 722, -711, 722.6, 0.45, 'ledge');
  K.ledge(-687, 770, -681, 770.6, 0.45, 'ledge');
  K.pad(-718, 810, -712, 814, 0.25);
  K.ledge(-687, 830, -681, 830.6, 0.45, 'ledge');
  // the levee strips: a small something about every 38 m on the outer edge, clear of the path and the drop-in gaps
  const zonesW = [[508, 532], [853, 871]];
  for (const xo of [-749, -652.5]) {
    let i = 0;
    for (let z = 372; z < 886; z += 38, i++) {
      if (skip(z, zonesW) || skip(z - 6, zonesW) || skip(z + 6, zonesW)) continue;
      switch (i % 6) {
        case 0: K.bench(xo, z - 1.5, xo + 0.6, z + 1.5); break;
        case 1: K.ledge(xo, z - 3, xo + 0.6, z + 3, 0.45, 'ledge'); break;
        case 2: K.pad(xo - 0.5, z - 2, xo + 2, z + 2, 0.2); break;
        case 3: K.jersey(xo, z - 3, xo + 0.8, z + 3); break;
        case 4: K.bikeRack(xo + 1, z, false, 2.4); K.bikeRack(xo + 1, z + 4, false, 2.4); break;
        default: K.construction(xo + 1.5, z, false);
      }
    }
    for (let z = 384; z < 880; z += 64) if (!skip(z, zonesW) && !skip(z - 3, zonesW) && !skip(z + 3, zonesW)) K.lamp(xo < -700 ? -751.2 : -649.2, z, xo < -700 ? 1 : -1);
  }
  // the footbridge stubs, either side of the deck
  K.bench(-746, 513, -744, 516); K.bench(-746, 524, -744, 527); K.bench(-660, 513, -658, 516); K.bench(-660, 524, -658, 527);

  /* ---------- tapes, spots, travel, challenges ---------- */
  P.tape(-700, 612.1, F(612.1) + 3.0);
  P.tape(-681, 468, F(468) + 1.6);
  P.spot('Catwalk E', -681, F(400) + 1.1, 400, PI, [-686, 370, -676, 480]);
  P.spot('Stair Tower', -686, F(500) + 0.2, 500, PI, [-700, 500, -672, 545]);
  P.spot('Pipe Crossing', -712, F(570) + 0.1, 570, PI, [-726, 560, -674, 634]);
  P.spot('Outfall Debris', -700, F(700) + 0.2, 700, PI, [-720, 640, -680, 800]);
  P.spot('South Ford', -700, F(850) + 0.2, 850, PI, [-720, 836, -680, 884]);
  P.travel('Pipe Crossing', -712, F(570) + 0.1, 570, PI, 'spot');
  const from = [-716, 588, -708, 594, F(590) + 0.4], to = [-716, 606, -708, 620, F(612) - 1.0, F(612) + 1.5];
  P.challenge({ id: 'arroyo-pipe-gap', name: 'Pipe Gap', desc: 'Launch off the West Door and clear both water mains',
    at: [-712, F(592.5) + 1.8, 592.5], go: [-712, F(560) + 0.1, 560, PI], kind: 'gap', from, to });
  P.challenge({ id: 'arroyo-pipe-grind', name: 'Main Line', desc: 'Grind along the water mains over the channel',
    at: [-700, F(612) + 3.0, 612], go: [-712, F(560) + 0.1, 560, PI], kind: 'grind', rail: 'Pipe', area: [-726, 584, -674, 634] });
  P.challenge({ id: 'arroyo-pipe-tre', hard: true, name: 'Tre the Mains', desc: 'A 360 flip over both water mains off the West Door',
    at: [-710, F(592.5) + 2.6, 591], go: [-712, F(548) + 0.1, 548, PI], kind: 'trick', tricks: ['360 Flip'], from, to });
}

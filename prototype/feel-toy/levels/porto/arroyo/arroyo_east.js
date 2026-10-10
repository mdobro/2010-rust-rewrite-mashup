/* The Arroyo, the East part: the east levee and everything between it and the planters / footbridge gates.
   Rect [-648, -420, -230, 910]. Levee Road, Run Street, Gasworks Lane, Viaduct Road east, Outfall Road east, Footbridge Walk east,
   the Levee Road tributary bridge, Water Board plaza, Planter Run copings and planters, the Gas Ring, Pump Station No.2,
   Dry Creek Skate Supply, the Levee Road row, Outfall Park, and the street filler that keeps the rhythm (CONTRACT 7).
   Design: levels/porto/design/arroyo.md sections 3.3, 4.15-4.19, 7.3, 11.4. */

/* a sidewalk slab beside a road. axis 'z': the road runs along z, and the slab is across-coordinates v0..v1; axis 'x': the road runs along x.
   a..b is the run along the road, skips are [from, to] ranges left open (crossings). Level stretches are boxes, slopes are hubbas
   that follow the ground to within 3 cm (broken at the kinks). */
function arroyo_east_walk(K, axis, v0, v1, a, b, skips, edge) {
  const T = K.terrainH, vm = (v0 + v1) / 2, wd = Math.abs(v1 - v0), lo = Math.min(v0, v1), hi = Math.max(v0, v1);
  const at = (u, v) => axis === 'z' ? [v, u] : [u, v];
  const runs = []; let s = a;
  for (const [k0, k1] of [...skips].sort((p, q) => p[0] - q[0])) { if (k0 > s) runs.push([s, Math.min(k0, b)]); s = Math.max(s, k1); }
  if (s < b) runs.push([s, b]);
  for (const [r0, r1] of runs) {
    if (axis === 'z') {
      let u = r0;
      while (u < r1 - 0.4) {
        let e = Math.min(r1, u + 48);
        const y = q => { const [x, z] = at(q, vm); return T(x, z) + 0.15; };
        for (;;) {
          const ya = y(u), yb = y(e); let bad = false;
          for (let t = 0.125; t < 1; t += 0.125) if (Math.abs(y(u + (e - u) * t) - (ya + (yb - ya) * t)) > 0.03) { bad = true; break; }
          if (!bad || e - u <= 3) break; e = u + (e - u) * 0.6;
        }
        const ya = y(u), yb = y(e);
        if (Math.abs(ya - yb) < 0.006) K.Bg(lo, u, hi, e, 0.15, 'sidewalk', { edges: edge });
        else K.hubbas.push({ a: V(vm, Math.max(ya, yb), ya >= yb ? u : e), b: V(vm, Math.min(ya, yb), ya >= yb ? e : u), w: wd, noRails: true, kind: 'Curb', color: 0xc4c0b6 });
        u = e;
      }
    } else {   // a road along x: the ground falls across the slab, so the hubbas run across it
      for (let u = r0; u < r1 - 0.4; u += 24) {
        const e = Math.min(r1, u + 24), um = (u + e) / 2, yA = T(um, lo) + 0.15, yB = T(um, hi) + 0.15;
        if (Math.abs(yA - yB) < 0.01) { K.Bg(u, lo, e, hi, 0.15, 'sidewalk', { edges: edge }); continue; }
        K.hubbas.push({ a: V(um, Math.max(yA, yB), yA >= yB ? lo : hi), b: V(um, Math.min(yA, yB), yA >= yB ? hi : lo), w: e - u, noRails: true, kind: 'Curb', color: 0xc4c0b6 });
      }
    }
  }
}

function arroyo_east(K, P, PL) {
  const { F, B } = PL, T = (x, z) => K.terrainH(x, z), PI = Math.PI;
  const hub = (ax, ay, az, bx, by, bz, w, o = {}) => K.hubbas.push({ a: V(ax, ay, az), b: V(bx, by, bz), w, noRails: !!o.noRails, kind: o.kind, color: o.color });
  const claims = [];   // rects (x0, z0, x1, z1) that the filler keeps out of
  const claim = (x0, z0, x1, z1) => claims.push([x0, z0, x1, z1]);
  const free = (x, z, m = 2) => !claims.some(r => x > r[0] - m && x < r[2] + m && z > r[1] - m && z < r[3] + m);
  const CONC = 0xa8a39a, STEEL = 0x6b7178, WALK = 0xc4c0b6;

  /* ================= roads: sidewalks, dashes ================= */
  const R = PL.roads;
  // Levee Road (x -638): sidewalks from the Ford Road end to the Outfall Road, open at the bridge, Run Street, Viaduct Road, the footbridge walk
  { const sk = [[-52, -6], [148, 172], [514, 526]];
    arroyo_east_walk(K, 'z', -647.5, -644, -160, 850, sk, 'e');
    arroyo_east_walk(K, 'z', -632, -628, -160, 850, sk, 'w'); }
  // Gasworks Lane (x -470)
  { const sk = [[514, 526]];
    arroyo_east_walk(K, 'z', -480, -476, -6, 850, [...sk, [148, 172]], 'e');
    arroyo_east_walk(K, 'z', -464, -460, -4, 850, [...sk, [148, 172]], 'w'); }
  // Run Street (z -16), Viaduct Road (z 160), Outfall Road (z 862)
  arroyo_east_walk(K, 'x', -26, -22, -628, -480, [], 's'); arroyo_east_walk(K, 'x', -10, -6, -628, -480, [], 'n');
  arroyo_east_walk(K, 'x', 148, 154, -628, -480, [], 's'); arroyo_east_walk(K, 'x', 166, 172, -628, -480, [], 'n');
  arroyo_east_walk(K, 'x', 850, 856, -626, -482, [], 's'); arroyo_east_walk(K, 'x', 868, 874, -626, -482, [], 'n');
  // the centre lines
  for (let z = -156; z < 846; z += 9) { if ((z > -52 && z < -6) || (z > 144 && z < 176) || (z > 508 && z < 530)) continue; K.dash(-638, z, -638, z + 3.5); }
  for (let z = -10; z < 846; z += 9) { if ((z > 144 && z < 176) || (z > 508 && z < 530)) continue; K.dash(-470, z, -470, z + 3.5); }
  for (let x = -624; x < -480; x += 9) { K.dash(x, -16, x + 3.5, -16); if (x > -630) K.dash(x, 160, x + 3.5, 160); }
  for (let x = -624; x < -480; x += 9) K.dash(x, 862, x + 3.5, 862);

  /* ================= the Levee Road bridge over the tributary ================= */
  K.B(-648, -1.0, -48, -628, 0.0, -32, 'plaza', { color: 0x5a5c60 });
  K.B(-628.6, 0, -48, -628, 0.8, -32, 'garage', { edges: 'ew' });   // the east parapet (the west side stays open to the Levee Path bridge)
  K.dash(-638, -47, -638, -33);
  claim(-650, -56, -626, -4);
  // the mouths of the cross streets (nothing in the way)
  claim(-650, 146, -626, 174); claim(-650, 512, -626, 528); claim(-650, 848, -626, 876);
  claim(-482, 146, -458, 174); claim(-482, 512, -458, 528); claim(-482, 848, -458, 876); claim(-482, -28, -458, -4);
  claim(-634, -28, -626, -4); claim(-482, 150, -470, 170);

  /* ================= Water Board plaza (4.16) ================= */
  K.building(-600, -200, -500, -150, 4, 0xa9a49a, 'stone');                                     // Flood Control Authority
  K.decorFns.push(D => D.sign('FLOOD CONTROL AUTHORITY', -550, 9, -149.9, 14, 1.6, PI, '#e8e4da', '#3a4350'));
  K.paintRect(-600, -150, -500, -60, 0xc3bdb0, 0.012);
  K.B(-590, -0.5, -140, -570, 0.6, -120, 'plaza', { edges: 'nswe' });                          // the plinth
  K.B(-560, -0.5, -150, -530, 1.0, -142, 'plaza', { edges: 'swe' });                           // the terrace
  K.stairSpot('z', -142, 1, -558, -544, 1.0, 0, 6, 0.7, { rails: [-558.45, -543.55] });
  for (const x of [-538, -532]) hub(x, 1.0, -142, x, 0.02, -134, 3, { noRails: true, color: 0xc4bfb3 });   // the two banks off the terrace
  K.bench(-600, -110.6, -594, -109.8); K.bench(-548, -86.6, -542, -85.8);
  K.ledge(-586, -70.6, -570, -70, 0.45, 'plaza');
  { const fx = -520, fz = -100;   // the drained fountain: a bowl with a 24-piece coping
    K.pool(fx - 8, fx + 8, fz - 8, fz + 8, [[K.poolS.circle(fx, fz, 7), 1.6]], 0, 0.25);
    for (let i = 0; i < 24; i++) { const a0 = i / 24 * PI * 2, a1 = (i + 1) / 24 * PI * 2;
      K.rails.push({ a: V(fx + Math.cos(a0) * 7, 0, fz + Math.sin(a0) * 7), b: V(fx + Math.cos(a1) * 7, 0, fz + Math.sin(a1) * 7), kind: 'Coping', coping: true }); } }
  K.building(-506, -146, -490, -124, 2, 0xb5ad9d, 'brick');                                     // Water Board annex
  for (const [x, z] of [[-606, -140], [-606, -108], [-606, -76], [-494, -100], [-494, -72], [-548, -64]]) K.tree(x, z);
  for (const [x, z, s] of [[-598, -64, -1], [-566, -64, -1], [-524, -64, 1], [-496, -92, 1]]) K.lamp(x, z, s);
  claim(-606, -150, -490, -60);
  P.spot('Water Board Plaza', -566, 0, -66, PI, [-604, -150, -492, -60]);
  P.travel('Water Board Plaza', -566, 0, -66, PI, 'spot');

  /* ================= Planter Run (4.17) ================= */
  // the coping on both lips of the tributary: the first one is the session rail the foundation's skater uses (x -628..-440 at z -48)
  K.rail(-628, 0, -48, -440, 0, -48, 'Coping', false);
  K.rail(-628, 0, -32, -440, 0, -32, 'Coping', false);
  for (const x of [-600, -560, -520, -480]) {
    K.B(x - 3, 0, -56, x + 3, 0.45, -54.8, 'brick', { edges: 'ns' });
    K.B(x - 3, 0, -25.2, x + 3, 0.45, -24, 'brick', { edges: 'ns' });
  }
  P.tape(-646, -40, T(-646, -40));                                                                  // the Run Underpass
  for (const x of [-590, -530]) { hub(x, 0.4, -58, x, 0.02, -62, 2.4, { noRails: true, color: 0xb9b5ab }); }   // a small bank off the north lip
  P.spot('Planter Run Head', -470, T(-470, -40), -40, PI / 2, [-500, -50, -436, -30]);
  P.spot('Planter Run', -590, T(-590, -40), -40, PI / 2, [-610, -50, -570, -30]);
  P.travel('Planter Run', -470, T(-470, -40), -40, PI / 2, 'spot');
  claim(-440, -60, -432, -28);

  /* ================= the Gas Ring (4.15) ================= */
  { const cx = -532, cz = 62;
    K.pool(-551, -513, 43, 81, [[K.poolS.circle(cx, cz, 18), 3.2]], 0, 0.5);
    const n = 36;
    for (let i = 0; i < n; i++) { const a0 = i / n * PI * 2, a1 = (i + 1) / n * PI * 2;
      K.rails.push({ a: V(cx + Math.cos(a0) * 18, 0, cz + Math.sin(a0) * 18), b: V(cx + Math.cos(a1) * 18, 0, cz + Math.sin(a1) * 18), kind: 'Coping', coping: true }); }
    const cols = [];
    for (let k = 0; k < 12; k++) { const a = (15 + 30 * k) * PI / 180, x = cx + Math.cos(a) * 22, z = cz + Math.sin(a) * 22; cols.push([x, z]); K.B(x - 0.4, -0.5, z - 0.4, x + 0.4, 26, z + 0.4, 'metal', { ghost: true }); }
    K.decorFns.push(D => { const cyl = new THREE.CylinderGeometry(0.4, 0.4, 26, 8), tor = new THREE.TorusGeometry(22, 0.35, 6, 36), tor2 = new THREE.TorusGeometry(22, 0.3, 6, 36);
      for (const [x, z] of cols) D.add(cyl, 0x7a5a45, [x, 13, z], [0, 0, 0], [1, 1, 1], { roughness: 0.9 });
      D.add(tor, 0x6b5545, [cx, 13, cz], [PI / 2, 0, 0], [1, 1, 1], { roughness: 0.9 }); D.add(tor2, 0x6b5545, [cx, 26, cz], [PI / 2, 0, 0], [1, 1, 1], { roughness: 0.9 });
      D.sign('GASWORKS No.1', cx, 27, 40, 8, 1.4, PI, '#f0e6c8', '#4a2f26'); });
    K.building(-570, 40, -556, 52, 1, 0x8c8a82, 'brick');                                          // the valve house
    for (let x = -620; x < -560; x += 9) K.rail(x, 1.1, 90, Math.min(x + 9, -560), 1.1, 90, 'Pipe', true);   // the gas main
    K.building(-500, 14, -486, 36, 2, 0x9b8f7e, 'brick'); K.building(-500, 92, -486, 114, 2, 0xa7977f, 'brick');   // Gasworks offices
    P.npc({ kind: 'session', rail: [-532, 44, -528.87, 44.27], start: -541, end: -521, back: 2.4, side: 1, speed: 4.5 });
    P.tape(cx, cz, -3.2);
    P.spot('Gas Ring', cx, 0, 38, PI, [-554, 40, -510, 84]); P.travel('Gas Ring', cx, 0, 38, PI, 'spot');
    P.challenge({ id: 'arroyo-gas-ring', name: 'Gas Ring', desc: 'Grind the lip of the Gas Ring, a full lap if you can', at: [cx, 0, 36], go: [cx, 0, 28, PI],
      kind: 'grind', rail: 'Coping', area: [-552, 42, -512, 82] });
    claim(-556, 36, -508, 90); claim(-572, 38, -554, 54); claim(-502, 12, -484, 38); claim(-502, 90, -484, 116); }

  /* ================= Pump Station No.2 (4.18) ================= */
  K.building(-600, 380, -560, 440, 2, 0x8f8a80, 'brick');
  { const top = B(450);
    K.B(-600, B(470) - 0.3, 450, -560, top, 470, 'plaza', { edges: 's' });
    K.stairSpot('z', 470, 1, -566, -562, top, T(-564, 471.6), 4, 0.45, { rails: [-566.45, -561.55] });
    K.rail(-560, top + 0.9, 451, -560, top + 0.9, 469, 'Rail', true);
    K.decorFns.push(D => D.sign('PUMP STATION No.2', -559.9, T(-560, 410) + 5.2, 410, 7, 1.2, PI / 2, '#f0ece2', '#2e3f5c'));
    P.spot('Pump Station No.2', -580, top, 448, PI, [-600, 440, -558, 480]);
    claim(-602, 378, -556, 482); }

  /* ================= Dry Creek Skate Supply and the Levee Road row (7.3) ================= */
  K.building(-628, 490, -612, 512, 3, 0x6f8fa8, 'brick');
  { const g = B(501);
    P.shop({ name: 'Dry Creek Skate Supply', sign: [-628.04, g + 3.9, 501, -PI / 2, 7], awning: [-629.6, 495, -628, 507, g + 2.35, 'x'],
      zone: [-631.4, 497, -628.2, 505], door: [-628.2, g + 0.15, 501] });
    P.travel('Dry Creek Skate Supply', -632, g, 501, -PI / 2, 'spot');
    P.spot('Dry Creek Skate Supply', -632, g, 501, -PI / 2, [-633, 488, -626, 514]);
    K.newsBoxes(-628.9, 487.5, false, 2); K.trashCan(-629, 514.5); }
  claim(-634, 486, -626, 516);
  { const units = [[222, 248, 2, 0x9b5a46], [262, 290, 3, 0xb9a88f], [306, 334, 2, 0x7f8a92], [352, 380, 2, 0xa7744f], [398, 430, 3, 0x8c6a5d],
      [538, 570, 2, 0x6e7b86], [596, 630, 3, 0xb58b67], [660, 690, 2, 0x8d9a7c], [722, 754, 2, 0xcfc4ad], [784, 816, 3, 0x9b5a46]];
    for (const [z0, z1, fl, c] of units) { K.building(-628, z0, -612, z1, fl, c, 'brick'); claim(-632, z0, -626, z1); } }

  /* ================= Outfall Park (4.19) ================= */
  { const tops = [], rows = [[746, 766], [782, 802], [818, 838]];
    rows.forEach(([z0, z1], i) => {
      const top = T(-555, z0); tops.push(top);
      K.B(-600, T(-555, z1) - 0.4, z0, -510, top, z1, 'plaza', { edges: 's', color: 0xc7c2b4 });
      K.stairSpot('z', z1, 1, -552, -542, top, T(-547, z1 + 3), 5, 0.55, { rails: [-552.45, -541.55] });
      hub(-520, top, z1, -520, T(-520, z1 + 4) + 0.02, z1 + 4, 4, { noRails: true, color: 0xc4bfb3 });
      const bx = i % 2 ? -585 : -572;
      K.B(bx, top, z0 + 6, bx + 5, top + 0.45, z0 + 6.8, 'wood', { edges: 'ns' }); K.B(bx + 12, top, z0 + 12, bx + 17, top + 0.45, z0 + 12.8, 'wood', { edges: 'ns' });
      K.B(-530, top, z0 + 5, -518, top + 0.18, z0 + 8, 'pad', { edges: 'ns' });
      for (const x of [-604, -506]) { K.tree(x, z0 + 4); K.tree(x, z0 + 14); }
    });
    K.building(-500, 760, -490, 770, 1, 0xd8d2c4, 'brick');                                        // the kiosk
    for (const [x, z] of [[-562, 774], [-532, 810], [-566, 842]]) K.lamp(x, z, 1);
    P.spot('Outfall Park', -555, T(-555, 790), 776, PI, [-602, 744, -508, 842]);
    claim(-608, 742, -486, 850); }

  /* ================= the Footbridge Walk pocket: a bench, a bank and a ledge off the walk ================= */
  { const g = T(-540, 513);
    K.strip(-552, 513.6, -530, 513.6, 0.45, 0.7, { kind: 'Ledge', color: 0xa39d90, seg: 24 });
    K.bench(-546, 511.6, -540, 512.4);
    hub(-534, T(-534, 526.4) + 0.8, 526.4, -534, T(-534, 530) + 0.02, 530, 3, { noRails: true, color: 0xc4bfb3 });
    K.B(-532, T(-532, 531) - 0.4, 526.6, -526, T(-532, 526.6) + 0.8, 527.4, 'plaza', { edges: 'ns' });
    P.spot('Footbridge Walk', -540, T(-540, 520), 520, PI / 2, [-556, 510, -524, 532]);
    P.travel('Footbridge Walk', -462, T(-462, 520), 520, PI / 2, 'spot');
    claim(-556, 508, -522, 534); }

  /* ================= street filler: small skateable things so no stretch goes dead ================= */
  // u along the road, v across it; M maps to (x0, z0, x1, z1)
  const M = axis => (u0, v0, u1, v1) => axis === 'z' ? [v0, u0, v1, u1] : [u0, v0, u1, v1];
  const mid = axis => (u, v) => axis === 'z' ? [v, u] : [u, v];
  const furn = (axis, kind, u, v, side) => {   // side: which way is "out" from the road centre
    const m = M(axis), at = mid(axis), [x, z] = at(u, v);
    if (kind === 0) { K.bench(...m(u - 1.6, v - 0.45, u + 1.6, v + 0.45)); K.newsBoxes(...at(u + 3.6, v), axis === 'x', 2); }
    else if (kind === 1) { const [ax, az] = at(u - 8, v), [bx, bz] = at(u + 8, v); K.strip(ax, az, bx, bz, 0.45, 0.6, { kind: 'Ledge', color: 0xa39d90, seg: 24 }); }
    else if (kind === 2) { K.Bg(...m(u - 1.5, v - 1, u + 1.5, v + 1), 0.55, 'ledge', { edges: axis === 'z' ? 'ew' : 'ns' }); K.bikeRack(...at(u + 4, v), axis === 'x', 2.4); }
    else if (kind === 3) { const [ax, az] = at(u - 6, v), [bx, bz] = at(u + 6, v); K.strip(ax, az, bx, bz, 0.2, 1.4, { kind: 'Ledge', color: 0xb5ada0, seg: 24 }); }
    else if (kind === 4) {   // a ply kicker onto a ledge, along the road
      const dir = axis === 'z' ? [0, 1] : [1, 0]; K.kicker(...at(u - 6, v), dir[0], dir[1], 2.4, 0.5, 1.3);
      const [ax, az] = at(u - 2, v), [bx, bz] = at(u + 8, v); K.strip(ax, az, bx, bz, 0.45, 0.7, { kind: 'Ledge', color: 0xa39d90, seg: 24 }); }
    else if (kind === 5) { K.dumpster(x, z, axis === 'x'); K.hydrant(...at(u + 3, v)); }
  };
  // stations along a road: every `step` m, alternating sides, cycling the kinds
  const stations = (axis, vA, vB, a, b, step, kinds, k0 = 0) => {
    let i = k0;
    for (let u = a; u <= b; u += step, i++) {
      const sideA = i % 2 === 0, v = sideA ? vA : vB, kind = kinds[i % kinds.length], at = mid(axis);
      const [x, z] = at(u, v);
      if (!free(x, z, 1) || !free(...at(u - 8, v), 0) || !free(...at(u + 8, v), 0)) continue;
      furn(axis, kind, u, v);
    }
  };
  stations('z', -629.4, -646.0, -150, 206, 32, [1, 0, 3, 2, 4, 5]);                        // Levee Road, level part
  stations('z', -629.4, -646.0, 214, 846, 48, [1, 4, 2, 3, 0, 5], 1);                      // Levee Road, the slope
  stations('z', -461.6, -478.4, 0, 206, 32, [3, 1, 2, 0, 4, 5], 2);                        // Gasworks Lane, level part
  stations('z', -461.6, -478.4, 214, 846, 48, [1, 2, 4, 3, 0, 5], 0);                      // Gasworks Lane, the slope
  stations('x', -23.6, -8.4, -622, -482, 32, [3, 0, 1, 2, 4], 1);                         // Run Street
  stations('x', 151.0, 169.0, -622, -482, 32, [2, 3, 1, 0, 4], 0);                        // Viaduct Road
  stations('x', 852.4, 871.6, -614, -482, 32, [1, 3, 2, 0], 1);                           // Outfall Road
  stations('x', 852.4, 871.6, -498, -498, 32, [3], 0);
  stations('x', 514.6, 525.4, -626, -444, 30, [3, 1, 0, 2, 4], 0);                        // Footbridge Walk (the walk is 516..524)

  /* ================= trees and lamps along the slope ================= */
  for (let z = 236; z < 846; z += 32) { if (!free(-645.8, z, 2)) continue; K.tree(-645.8, z); }
  for (let z = 220; z < 846; z += 32) { if (!free(-475.6, z + 16, 2) || (z > 500 && z < 530)) continue; K.lamp(-475.6, z + 16, -1); }
  for (let z = -140; z < 206; z += 32) { if (!free(-629.6, z, 2) || (z > -60 && z < 0)) continue; K.lamp(-629.6, z, 1); }
  for (let z = 0; z < 206; z += 32) { if (z > 140) continue; K.lamp(-461.6, z + 16, 1); }

  /* ================= registered lines for the stretches in this rect ================= */
  // (the foundation declares the streets; nothing extra here)
}

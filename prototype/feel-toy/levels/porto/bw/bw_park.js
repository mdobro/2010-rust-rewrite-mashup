/* Boardwalk West, the Harbour Bowl Complex: x -672..-212, z 910..1010. Design: levels/porto/design/bw.md section 6 (plus 7 for the sign).
   The Slab (street plaza), the Bowl Yard (mini ramp, Deep End, Kidney, Tidepool, Park House) and the Eel Run snake, inside seat walls. */

/* coping round a set of circular lobes [[cx, cz, r]] at height y, leaving out the arcs that lie inside another lobe */
function bw_park_ring(K, lobes, y, chord) {
  const inside = (x, z, k) => lobes.some(([cx, cz, r], j) => j !== k && Math.hypot(x - cx, z - cz) < r - 0.05);
  lobes.forEach(([cx, cz, r], k) => {
    const n = Math.max(12, Math.ceil(2 * Math.PI * r / chord));
    for (let i = 0; i < n; i++) {
      const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2;
      const x0 = cx + Math.cos(a0) * r, z0 = cz + Math.sin(a0) * r, x1 = cx + Math.cos(a1) * r, z1 = cz + Math.sin(a1) * r;
      if (inside(x0, z0, k) || inside(x1, z1, k)) continue;
      K.rails.push({ a: V(x0, y, z0), b: V(x1, y, z1), kind: 'Coping', coping: true });
    }
  });
}

/* a seat wall (0.45 m, grindable) between x0 and x1 with 8 m gaps centred on gaps[] */
function bw_park_wall(K, zA, zB, gaps, x0, x1) {
  let x = x0;
  for (const g of [...gaps].sort((a, b) => a - b)) { if (g - 4 > x) K.ledge(x, zA, g - 4, zB, 0.45); x = g + 4; }
  if (x1 > x) K.ledge(x, zA, x1, zB, 0.45);
}

/* the Eel Run lip line: lateral distance from the centreline to the top of the wall at depth D */
function bw_park_lip(D) { return 1.8 + Math.sqrt(Math.max(16 - (4 - D) * (4 - D), 0)); }

function bw_park(K, P, PL) {
  const { YN, T1 } = PL, S = PL.snake;
  const CO = 0xc4bfb3;
  const bank = (ax, ay, az, bx, bz, w, by) => K.hubbas.push({ a: V(ax, ay, az), b: V(bx, by ?? YN + 0.02, bz), w, noRails: true, color: CO });

  /* ---------- seat walls with gaps, lamps, benches ---------- */
  bw_park_wall(K, 939.4, 940, [-640, -560, -500, -440, -320, -230], -668, -216);
  bw_park_wall(K, 1005.4, 1006, [-600, -510, -380], -668, -216);
  const NG = [-640, -560, -500, -440, -320, -230], SG = [-600, -510, -380];
  for (let x = -664; x <= -220; x += 20) {
    if (!NG.some(g => Math.abs(x - g) < 6)) K.lamp(x, 938.6, 1);
    if (!SG.some(g => Math.abs(x - g) < 6)) K.lamp(x, 1006.8, -1);
  }
  for (const x of [-624, -588, -470, -410, -350, -290, -256]) K.bench(x - 2, 1004.2, x + 2, 1004.9);

  /* ---------- 6.1 The Slab ---------- */
  K.B(-664, YN - 0.5, 948, -632, T1, 972, 'marble', { edges: 'nsw' });
  K.stairSpot('x', -632, 1, 954, 966, T1, YN, 5, 0.42, { rails: [960], hubbas: [953.6, 966.4] });
  K.lip(-632, 948, -632, 953.2, T1); K.lip(-632, 966.8, -632, 972, T1);
  bank(-648, T1, 972, -648, 977.5, 30, YN + 0.02);
  K.B(-660, T1, 950, -640, T1 + 0.45, 951, 'marble', { edges: 'nswe' });
  K.B(-658, T1, 964, -654, T1 + 0.55, 968, 'ledge', { edges: 'nswe' });
  K.pad(-622, 984, -608, 988, 0.22); K.pad(-600, 952, -592, 958, 0.30);
  K.rail(-616, YN + 0.40, 962, -596, YN + 0.40, 962, 'Rail', true);
  // pyramid with four 2.5 m banks
  K.B(-588, YN - 0.3, 976, -582, YN + 1.0, 982, 'plaza', { edges: 'nswe' });
  bank(-585, YN + 1.0, 976, -585, 973.5, 6); bank(-585, YN + 1.0, 982, -585, 984.5, 6);
  bank(-588, YN + 1.0, 979, -590.5, 979, 6); bank(-582, YN + 1.0, 979, -579.5, 979, 6);
  K.bankToWall(-620, 948, -604, 1.4, 4);
  K.kicker(-580, 960, 1, 0, 2.4, 0.4, 1.3);
  K.B(-576, YN, 956, -570, YN + 0.5, 964, 'marble', { edges: 'nswe' });

  /* ---------- 6.2 Bowl Yard ---------- */
  // mini ramp: the transitions are ground ('add'), the decks boxes. flat 2 m, quarter arcs R 2.4 up to 1.6 m
  { const cx = -547, fh = 1, R = 2.4, wt = Math.sqrt(R * R - 0.8 * 0.8), H = 1.6;
    K.feat(cx - fh - wt, cx + fh + wt, 950, 964, (x) => { const d = Math.abs(x - cx) - fh; return d <= 0 ? 0 : Math.min(H, R - Math.sqrt(Math.max(R * R - d * d, 0))); }, 'add');
    for (const s of [-1, 1]) {
      const lip = cx + s * (fh + wt), far = lip + s * 2;
      K.B(Math.min(lip, far), YN - 0.5, 950, Math.max(lip, far), YN + H, 964, 'wood', { edges: 'nswe' });
      K.rail(lip, YN + H, 950, lip, YN + H, 964, 'Coping', false);
      bank(far, YN + H, 957, far + s * 5.5, 957, 10, YN + 0.02);   // a bank up to each deck, so you can get up
    } }
  // Deep End clover, Kidney, Tidepool
  const DE = [[-500, 968, 9.5, 3.4], [-484, 958, 6.5, 2.4], [-484, 980, 6.5, 2.4]];
  K.pool(-511, -476.5, 947.5, 989.5, DE.map(([x, z, r, d]) => [K.poolS.circle(x, z, r), d]), YN, 0.5);
  bw_park_ring(K, DE.map(([x, z, r]) => [x, z, r]), YN, 1.6);
  const KD = [[-454, 962, 6, 2.0], [-446, 975, 7, 2.8]];
  K.pool(-460.5, -438.5, 955.5, 982.5, KD.map(([x, z, r, d]) => [K.poolS.circle(x, z, r), d]), YN, 0.5);
  bw_park_ring(K, KD.map(([x, z, r]) => [x, z, r]), YN, 1.6);
  K.pool(-546, -534, 984, 996, [[K.poolS.circle(-540, 990, 5.5), 1.5]], YN, 0.5);
  bw_park_ring(K, [[-540, 990, 5.5]], YN, 1.6);
  // Park House and its sign
  K.building(-428, 990, -414, 1002, 1, 0x5c8fb8, 'stone');
  K.decorFns.push(D => D.sign('HARBOUR BOWL', -421, YN + 4.4, 989.9, 10, 1.2, Math.PI, '#f0ece2', '#2e3f5c'));

  /* ---------- 6.3 Eel Run ---------- */
  { const p = S.pts, L7 = p[7];
    const pocket = (x, z) => { const d = Math.hypot(x - L7[0], z - L7[1]); if (d <= 3) return YN - 3.4; const w = Math.sqrt(16 - 0.36); return d >= 3 + w ? YN : YN - 3.4 + PL.arc(d - 3, 4, w); };
    K.feat(-432, -212, 944, 990, (x, z) => Math.min(S.h(x, z), pocket(x, z)), 'min');
    // coping both sides of the straights (the doc names S2-S3 and S4-S5; the other straights get it too, trimmed back from the bends)
    for (let i = 2; i <= 7; i++) {
      const a = p[i - 1], b = p[i], len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uz = (b[1] - a[1]) / len, nx = -uz, nz = ux;
      const trimA = (i === 2 || i === 4 || i === 6) ? 5 : 5, trimB = i === 7 ? 4 : 5;
      for (const side of [-1, 1]) {
        const n = Math.max(1, Math.round((len - trimA - trimB) / 3));
        for (let k = 0; k < n; k++) {
          const q = [0, 1].map(e => { const t = trimA + (len - trimA - trimB) * (k + e) / n, sv = S.s[i - 1] + t, off = bw_park_lip(S.D(sv));
            return V(a[0] + ux * t + nx * side * off, YN, a[1] + uz * t + nz * side * off); });
          K.rails.push({ a: q[0], b: q[1], kind: 'Coping', coping: true });
        }
      }
    }
    // the pocket ring round S7, on the far side only
    { const p6 = p[6], a0 = Math.atan2(L7[1] - p6[1], L7[0] - p6[0]), r = 3 + Math.sqrt(16 - 0.36), n = 16;
      for (let k = 0; k < n; k++) { const t0 = a0 - Math.PI / 2 + Math.PI * k / n, t1 = a0 - Math.PI / 2 + Math.PI * (k + 1) / n;
        K.rails.push({ a: V(L7[0] + Math.cos(t0) * r, YN, L7[1] + Math.sin(t0) * r), b: V(L7[0] + Math.cos(t1) * r, YN, L7[1] + Math.sin(t1) * r), kind: 'Coping', coping: true }); } }
  }

  // filler: small things in the open ground south of the snake and round the Park House
  K.pad(-400, 996, -384, 1000, 0.2); K.pad(-340, 994, -324, 998, 0.25); K.pad(-252, 996, -236, 1000, 0.2);
  K.rail(-300, YN + 0.40, 998, -282, YN + 0.40, 998, 'Rail', true);
  K.ledge(-410, 994, -396, 994.7, 0.45); K.ledge(-364, 996, -352, 996.7, 0.5);
  K.kicker(-376, 995.5, 1, 0, 2.2, 0.4, 1.3);
  K.planter(-272, 992, -266, 998, 0.5);
  K.pad(-566, 998, -552, 1002, 0.2); K.ledge(-532, 1000, -518, 1000.7, 0.45);
  for (const x of [-650, -570, -480, -400, -340, -260]) K.tree(x, 1008.5);
  // snake head: a ledge beside the Steep mouth (the mouth x -212..-208 stays open) and coping along the shallow entry
  K.ledge(-228, 945, -213, 945.7, 0.45);
  { const a = S.pts[0], b = S.pts[1];
    for (const side of [-1, 1]) for (let k = 0; k < 2; k++) {
      const q = [0, 1].map(e => { const x = a[0] + (b[0] - a[0]) * (0.28 + 0.4 * (k + e) / 2), sv = Math.abs(x - a[0]); return V(x, YN, a[1] + side * bw_park_lip(PL.snake.D(sv))); });
      K.rails.push({ a: q[0], b: q[1], kind: 'Coping', coping: true }); } }

  /* ---------- spots ---------- */
  P.spot('The Slab', -610, YN, 968, Math.PI / 2, [-668, 940, -568, 1006]);
  P.spot('Bowl Yard', -520, YN, 1000, 0, [-564, 944, -432, 1006]);
  P.spot('Deep End', -500, YN, 968, Math.PI, [-512, 946, -476, 990]);
  P.spot('Eel Run', -226, YN, 952, Math.PI / 2, [-432, 944, -212, 990]);
  P.spot('Eel Run Bend', -300, YN - 2, 954, Math.PI, [-330, 946, -270, 975]);
  P.spot('Eel Run Dropper', -366, YN - 2.7, 956, Math.PI, [-390, 946, -340, 980]);
  P.spot('Eel Run Pocket', -418, YN - 3.4, 966, Math.PI, [-432, 950, -404, 984]);
  for (const x of [-660, -540, -420, -300]) P.spot('Quay Wall ' + Math.abs(x), x, YN, 944, Math.PI, [x - 20, 940, x + 20, 948]);
}

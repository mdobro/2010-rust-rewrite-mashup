/* Old Town (old): the shared plan. Design: levels/porto/design/old.md sections 2 and 3.3.
   old_plan(baseH) builds nothing. It returns the street profile, the ground, the colours, the fine regions and the
   break list that every part shares. Helpers below: old_walk, old_slopeLedge, old_curbRamp, old_chordZ. */
function old_plan(baseH) {
  const ss = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
  const baseZ = z => baseH(0, z);
  /* ---- the street profile G(z): knots with parabolic fillets ---- */
  const KN = [[242, -0.886], [400, -11.95], [470, -14.40], [542, -19.45], [578, -19.45],
              [734, -30.37], [776, -30.37], [854, -39.40], [886, -39.40], [898, -40.054]];
  const FR = [0, 8, 8, 8, 8, 8, 12, 10, 6, 0];
  const Gk = z0 => {
    const z = Math.min(898, Math.max(242, z0));
    let i = 1; while (z > KN[i][0]) i++;
    const [za, ha] = KN[i - 1], [zb, hb] = KN[i];
    let v = ha + (hb - ha) * (z - za) / (zb - za);
    for (let k = 1; k < KN.length - 1; k++) {
      const r = FR[k], d = Math.abs(z - KN[k][0]);
      if (d < r) {
        const s1 = (KN[k][1] - KN[k - 1][1]) / (KN[k][0] - KN[k - 1][0]);
        const s2 = (KN[k + 1][1] - KN[k][1]) / (KN[k + 1][0] - KN[k][0]);
        v += (s2 - s1) / (4 * r) * (r - d) ** 2;
      }
    }
    return v;
  };
  const Wx = x => x < -332 ? ss((x + 408) / 76) : x > 212 ? ss((288 - x) / 76) : 1;
  const gen = (x, z, base) => (z <= 242 || z >= 898) ? base : base + Wx(x) * (Gk(z) - base);
  /* ---- level lanes and flats ---- */
  // bn: the north blend length when it differs from bl (the Alto Walk must meet the base exactly at z 242)
  const lanes = [
    { name: 'Alto Walk',       x0: -340, x1: 220, zc: 250, hw: 4, bl: 6, bn: 4, fW: 8, fE: 8 },
    { name: 'Footbridge Lane', x0: -420, x1: -212, zc: 520, hw: 4, bl: 6, fW: 0, fE: 8 },
    { name: 'Lemon Lane',      x0: -25, x1: 92, zc: 420, hw: 4, bl: 6, fW: 6, fE: 6 },
    { name: 'Clock Lane',      x0: -192, x1: -48, zc: 660, hw: 4, bl: 6, fW: 6, fE: 6 },
    { name: 'Crosstown East',  x0: 204, x1: 300, zc: 560, hw: 8, bl: 6, fW: 8, fE: 0 },
  ];
  for (const L of lanes) L.level = x => gen(x, L.zc, baseZ(L.zc));
  const flats = [
    { name: 'gull',  disk: [-150, 446, 11], bl: 8, y: -13.56 },
    { name: 'lemon', disk: [121, 425, 8], bl: 7, y: -12.82 },
    { name: 'wash',  rect: [-160, -108, 568, 600], bl: 8, y: -19.45 },
    { name: 'clock', disk: [-120, 660, 9], bl: 8, y: -25.19 },
    { name: 'lotA',  rect: [146, 194, 784, 806], bl: 6, y: -32.57 },
    { name: 'lotB',  rect: [146, 194, 820, 844], bl: 6, y: -36.85 },
  ];
  const ground = (x, z, base) => {
    if (z <= 242 || z >= 898) return base;
    let h = gen(x, z, base);
    // the Wall Walk (x -402..-392) is level across, at its centre line's height, so a rider rolls straight down it; it eases
    // back to the flank's cross-slope over 6 m either side (under the Old Wall to the west, the U/M/H blocks to the east)
    if (x > -408 && x < -386) {
      const w = x < -402 ? ss((x + 408) / 6) : x > -392 ? ss((-386 - x) / 6) : 1;
      h += (gen(-397, z, baseH(-397, z)) - h) * w;
    }
    for (const L of lanes) {
      if (x < L.x0 || x > L.x1) continue;
      const dz = Math.abs(z - L.zc), bl = z < L.zc && L.bn ? L.bn : L.bl;
      const wz = dz <= L.hw ? 1 : 1 - ss((dz - L.hw) / bl); if (wz <= 0) continue;
      let wx = 1; if (L.fW > 0 && x < L.x0 + L.fW) wx = ss((x - L.x0) / L.fW); if (L.fE > 0 && x > L.x1 - L.fE) wx = Math.min(wx, ss((L.x1 - x) / L.fE));
      h += (L.level(x) - h) * wz * wx;
    }
    for (const F of flats) {
      let d;
      if (F.disk) d = Math.max(0, Math.hypot(x - F.disk[0], z - F.disk[1]) - F.disk[2]);
      else { const r = F.rect; d = Math.hypot(Math.max(r[0] - x, 0, x - r[1]), Math.max(r[2] - z, 0, z - r[3])); }
      const w = 1 - ss(d / F.bl); if (w > 0) h += (F.y - h) * w;
    }
    return h;
  };
  /* ---- colours: made once ---- */
  const C = c => new THREE.Color(c);
  const cAsph = C(0x56585d), cCal = C(0xd8d0bf), cGrass = C(0x6f8f4a), cCob = C(0x9a8d7b);
  const inR = (x, z, a, b, c, d) => x >= a && x <= b && z >= c && z <= d;
  const ASPH = [[-59, -21, 230, 400], [-52, -28, 470, 742], [-212, -188, 470, 910], [108, 132, 446, 880], [-332, -308, 568, 880], [204, 300, 551, 569]];
  const CAL = [[-230, -25, 400, 470], [92, 150, 404, 446], [-332, 212, 246, 254], [-328, 128, 756, 764]];
  const GRASS = [[-160, -108, 606, 650], [146, 194, 784, 806], [146, 194, 820, 844], [140, 200, 806, 820], [140, 200, 844, 850]];
  const col = (x, z) => {
    if (inR(x, z, -43, -37, 262, 390)) return cCal;                                   // the Rambla median
    for (const r of ASPH) if (inR(x, z, ...r)) return cAsph;
    for (const r of CAL) if (inR(x, z, ...r)) return cCal;
    if (Math.hypot(x + 120, z - 660) <= 12) return cCal;                              // Clock Square
    for (const r of GRASS) if (inR(x, z, ...r)) return cGrass;
    if (x <= -404 && !(z >= 514 && z <= 526)) return cGrass;                          // the west verge
    return cCob;
  };
  const surface = (x, z) => {
    for (const r of GRASS) if (inR(x, z, ...r)) return 'rough';
    if (x <= -404 && !(z >= 514 && z <= 526)) return 'rough';
    return null;
  };
  /* ---- fine ground ---- */
  const regions = [
    [-340, 220, 240, 260, 2],      // Alto Walk
    [-420, -212, 510, 530, 2],     // Footbridge Lane
    [-25, 92, 410, 430, 2],        // Lemon Lane
    [-192, -137, 650, 670, 2], [-103, -48, 650, 670, 2],   // Clock Lane (the Clock Square block is its own region)
    [204, 300, 546, 574, 2],       // Crosstown East
    [-170, -130, 426, 466, 2],     // gull
    [106, 136, 410, 440, 2],       // lemon
    [-168, -100, 560, 608, 2],     // wash + bank
    [-137, -103, 643, 677, 2],     // clock
    [140, 200, 778, 850, 2],       // pool lots + banks
  ];
  /* ---- break points for sloped sidewalks ---- */
  const bs = new Set([230, 242, 898]);
  for (let k = 1; k < KN.length - 1; k++) { const z = KN[k][0], r = FR[k]; for (const d of [-r, -r / 2, 0, r / 2, r]) bs.add(z + d); }
  const breaks = [...bs].sort((a, b) => a - b);
  const breaksAlto = []; for (let z = 240; z <= 262; z += 2) breaksAlto.push(z);       // every 2 m on the Grand Boulevard's first stretch
  const Y = { walk: -1.45, brisa: -9.0, gull: -13.56, lemon: -12.82, crosstown: -19.45, wash: -19.45,
              convent: -21.27, clock: -25.19, terrace: -30.37, harbour: -39.40, lotA: -32.57, lotB: -36.85 };
  // the N-S street axes (the road side of a sidewalk faces the nearest one)
  const axes = [-40, -200, 120, -320];
  return { KN, FR, Gk, Wx, gen, baseZ, lanes, flats, ground, col, surface, regions, breaks, breaksAlto, Y, axes, ss };
}

/* z values (descending in detail) along x = xc from z0 to z1 where a straight chord stays within tol of the ground and is at most maxLen long */
function old_chordZ(K, xc, z0, z1, maxLen = 40, tol = 0.03) {
  const out = [z0];
  const rec = (a, b) => {
    const ya = K.terrainH(xc, a), yb = K.terrainH(xc, b), m = (a + b) / 2;
    if (b - a > 3 && (b - a > maxLen || Math.abs(K.terrainH(xc, m) - (ya + yb) / 2) > tol || Math.abs(K.terrainH(xc, a + (b - a) / 4) - (ya * 0.75 + yb * 0.25)) > tol)) { rec(a, m); rec(m, b); }
    else out.push(b);
  };
  rec(z0, z1);
  return out;
}

/* a ramp from a sidewalk end down to the road: top = ground + 0.15 at zEnd, the ground + 0.02 at zEnd + dir * 1.2 (dir -1 runs north, +1 south) */
function old_curbRamp(K, xc, w, zEnd, dir) {
  const zb = zEnd + dir * 1.2, A = V(xc, K.terrainH(xc, zEnd) + 0.15, zEnd), B = V(xc, K.terrainH(xc, zb) + 0.02, zb);
  K.hubbas.push(A.y >= B.y ? { a: A, b: B, w, noRails: true, color: 0xd8d0bf } : { a: B, b: A, w, noRails: true, color: 0xd8d0bf });
}

/* one N-S sidewalk strip on the sloping street, x0..x1, z0..z1: sloped blocks 0.15 over the ground, a Curb grind along the
   road-side edge (one rail per straight run), curb ramps at the ends that meet a crossing.
   opt: { xe: the road-side x (default: the edge facing the nearest street axis), ramps: [north, south] booleans (default: on at the
   ends that sit at a crossing: z 400, 552, 568, 742, 758, 864, 880, 894), color } */
function old_walk(K, O, x0, x1, z0, z1, opt = {}) {
  const xc = (x0 + x1) / 2, w = x1 - x0, color = opt.color ?? 0xd8d0bf;
  let ax = O.axes[0]; for (const a of O.axes) if (Math.abs(a - xc) < Math.abs(ax - xc)) ax = a;
  const xe = opt.xe ?? (ax < xc ? x0 : x1);
  const zs = new Set([z0, z1]);
  for (const z of O.breaks) if (z > z0 + 0.5 && z < z1 - 0.5) zs.add(z);
  if (x0 < -20 && x1 > -60) for (const z of O.breaksAlto) if (z > z0 + 0.5 && z < z1 - 0.5) zs.add(z);
  let arr = [...zs].sort((a, b) => a - b);
  for (let i = 0; i < arr.length - 1; i++) if (arr[i + 1] - arr[i] > 40) { const n = Math.ceil((arr[i + 1] - arr[i]) / 40), a = arr[i], b = arr[i + 1]; for (let k = 1; k < n; k++) zs.add(a + (b - a) * k / n); }
  arr = [...zs].sort((a, b) => a - b);
  const top = z => K.terrainH(xc, z) + 0.15, pieces = [];
  for (let i = 0; i < arr.length - 1; i++) {
    const za = arr[i], zb = arr[i + 1], A = V(xc, top(za), za), B = V(xc, top(zb), zb);
    K.hubbas.push(A.y >= B.y ? { a: A, b: B, w, noRails: true, color } : { a: B, b: A, w, noRails: true, color });
    pieces.push([za, zb, A.y, B.y]);
  }
  // the curb: pieces on one straight line become one rail
  let run = [pieces[0]];
  const slope = p => (p[3] - p[2]) / (p[1] - p[0]);
  const flush = () => { const a = run[0], b = run[run.length - 1]; K.rail(xe, a[2], a[0], xe, b[3], b[1], 'Curb', false); };
  for (let i = 1; i < pieces.length; i++) { if (Math.abs(slope(pieces[i]) - slope(run[0])) < 0.002) run.push(pieces[i]); else { flush(); run = [pieces[i]]; } }
  flush();
  const cross = [400, 552, 568, 742, 758, 864, 880, 894];
  const rn = opt.ramps ? opt.ramps[0] : cross.includes(z0), rs = opt.ramps ? opt.ramps[1] : cross.includes(z1);
  if (rn) old_curbRamp(K, xc, w, z0, -1);
  if (rs) old_curbRamp(K, xc, w, z1, 1);
  return pieces.length;
}

/* a ledge hgt over the ground along z, x0..x1 wide: sloped blocks (no rails of their own) plus a 'Ledge' grind along x = railX */
function old_slopeLedge(K, x0, x1, z0, z1, hgt, color, railX) {
  const xc = (x0 + x1) / 2, w = x1 - x0, arr = old_chordZ(K, xc, z0, z1, 40, 0.03), pieces = [];
  for (let i = 0; i < arr.length - 1; i++) {
    const za = arr[i], zb = arr[i + 1], A = V(xc, K.terrainH(xc, za) + hgt, za), B = V(xc, K.terrainH(xc, zb) + hgt, zb);
    K.hubbas.push(A.y >= B.y ? { a: A, b: B, w, noRails: true, color } : { a: B, b: A, w, noRails: true, color });
    pieces.push([za, zb, A.y, B.y]);
  }
  const slope = p => (p[3] - p[2]) / (p[1] - p[0]);
  let run = [pieces[0]];
  const flush = () => { const a = run[0], b = run[run.length - 1]; K.rail(railX, a[2], a[0], railX, b[3], b[1], 'Ledge', false); };
  for (let i = 1; i < pieces.length; i++) { if (Math.abs(slope(pieces[i]) - slope(run[0])) < 0.002) run.push(pieces[i]); else { flush(); run = [pieces[i]]; } }
  flush();
  return pieces.length;
}

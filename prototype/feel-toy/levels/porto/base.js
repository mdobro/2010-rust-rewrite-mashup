/* Porto Alto: one city on a hill, two kilometres across, in eight districts. You start up on the
   Heights and the whole map runs downhill to the harbour, by more than one way.

        z -650  ┌───────────────────── THE HEIGHTS (y 4 → 44, the ridge) ────────────────────┐
        z -230  ├────────┬──────────────────────────────┬────────────────────────────────┤
                │ ARROYO │ FINANCIAL CORE (y 0, Downtown │ UNIVERSITY (y 0 and up)         │
        z  230  │ (the   ├────────────────────┬─────────┴────────────────────────────────┤
                │ ditch) │ OLD TOWN (y 0→-40) │ EASTSIDE HILLS (y 0 → -40)                  │
        z  910  ├────────┴───────────┬────────┴──────────────────────────────────────────┤
                │ BOARDWALK WEST     │ SHIPYARD EAST          (y -40 → -42, then the sea)  │
        z 1350  └────────────────────┴────────────────────────────────────────────────────┘
               x -1000   -420        0   300  360                                x 1000

   Downtown keeps its own coordinates (x, z -120..120 at height 0), so the Financial Core sits on a flat
   plateau at y 0 and everything else is measured from there: the Heights rise to 44, the harbour is at
   -42 and the sea at -46.

   Each district is built by its own function, porto_<id>(K, P), in levels/porto/<id>/. K is the shared
   city kit; P is that district's helper (its rectangle, its gates, and where to register things).
   See levels/porto/CONTRACT.md. */
const PORTO = {
  bounds: [-1000, 1000, -650, 1350],
  seaZ: 1180, seaY: -46,
  // id: [name, x0, x1, z0, z1]
  districts: {
    heights: { name: 'The Heights',      rect: [-1000, 1000, -650, -230] },
    arroyo:  { name: 'The Arroyo',       rect: [-1000, -420, -230, 910] },
    fin:     { name: 'Financial Core',   rect: [-420, 360, -230, 230] },
    uni:     { name: 'University',       rect: [360, 1000, -230, 230] },
    old:     { name: 'Old Town',         rect: [-420, 300, 230, 910] },
    east:    { name: 'Eastside Hills',   rect: [300, 1000, 230, 910] },
    bw:      { name: 'Boardwalk West',   rect: [-1000, 0, 910, 1350] },
    ship:    { name: 'Shipyard East',    rect: [0, 1000, 910, 1350] },
  },
  // Gates: where a route crosses from one district into the next. Both sides deliver open, rideable
  // ground at the base height across the gate's width, for GATE_DEPTH metres in from the border.
  // dir: which way the border runs at the gate ('x': an east-west border, crossed going north-south)
  gates: [
    { id: 'switchback',  name: 'Switchback Road',     a: 'heights', b: 'fin',    at: [-100, -230], dir: 'x', w: 16 },
    { id: 'observatory', name: 'Observatory Steps',   a: 'heights', b: 'fin',    at: [220, -230],  dir: 'x', w: 12 },
    { id: 'culvert',     name: 'Drainage Culvert',    a: 'heights', b: 'arroyo', at: [-700, -230], dir: 'x', w: 16 },
    { id: 'ridge',       name: 'Ridge Road',          a: 'heights', b: 'uni',    at: [650, -230],  dir: 'x', w: 16 },
    { id: 'avenue',      name: 'University Avenue',   a: 'fin',     b: 'uni',    at: [360, 0],     dir: 'z', w: 16 },
    { id: 'planters',    name: 'Planter Alley',       a: 'fin',     b: 'arroyo', at: [-420, -40],  dir: 'z', w: 12 },
    { id: 'boulevard',   name: 'Grand Boulevard',     a: 'fin',     b: 'old',    at: [-40, 230],   dir: 'x', w: 20 },
    { id: 'campus',      name: 'Campus Drive',        a: 'uni',     b: 'east',   at: [650, 230],   dir: 'x', w: 16 },
    { id: 'crosstown',   name: 'Crosstown Street',    a: 'old',     b: 'east',   at: [300, 560],   dir: 'z', w: 16, bend: 72 },
    { id: 'footbridge',  name: 'Arroyo Footbridge',   a: 'old',     b: 'arroyo', at: [-420, 520],  dir: 'z', w: 8 },
    { id: 'spillway',    name: 'Spillway Outlet',     a: 'arroyo',  b: 'bw',     at: [-700, 910],  dir: 'x', w: 24 },
    { id: 'steep',       name: 'Old Town Steep',      a: 'old',     b: 'bw',     at: [-200, 910],  dir: 'x', w: 16 },
    { id: 'hillbomb',    name: 'Eastside Hill Bomb',  a: 'east',    b: 'ship',   at: [600, 910],   dir: 'x', w: 16 },
    { id: 'harbourRd',   name: 'Harbour Road',        a: 'bw',      b: 'ship',   at: [0, 1020],    dir: 'z', w: 16, level: true },
    { id: 'boardwalk',   name: 'The Boardwalk',       a: 'bw',      b: 'ship',   at: [0, 1150],    dir: 'z', w: 12, level: true },
  ],
  // bend: N on a 'z' gate (an east-west street crossing a north-south border, across the fall line) levels the base across
  // the street there: within N metres north and south of the gate the profile is read at a remapped z that holds still across
  // the gate's width and catches up by N (see portoBaseH). Without it the border band would tilt the street by the profile's
  // grade (6 % in Old Town / Eastside), since both districts meet the plain base at the border.
  GATE_DEPTH: 16, BAND: 12,
  // level gates (level: true): the base falls along z there (0.67 % at the harbour) and you cross along x, so it would
  // tip an unsteered rider sideways. Across the gate it is held at its height on the gate's centre line: level for
  // LEVEL.x metres either side of the border (fading out over the next LEVEL.fx) and w/2 + LEVEL.z either side of the
  // centre line (fading out over LEVEL.fz). portoLevel(x, z, f) does the same to any height function f.
  LEVEL: { x: 48, fx: 24, z: 1, fz: 5 },
  // the height of the land along z, from the ridge down to the quay (smoothed where the grade changes)
  profile: [[-650, 44], [-560, 44], [-262, 3], [-218, 0], [230, 0], [880, -40], [1180, -42]],
};
// the land before any district shapes it: the profile, the sea past the quay, and a ridge of hills
// round the three sides that aren't the sea, so the map has edges you can see; levelled across the level gates
function portoBaseH(x, z) { return portoLevel(x, z, portoBaseRaw); }
// f(x, z) held level across each level gate (see PORTO.LEVEL): f on the gate's centre line, blended back to f outside
function portoLevel(x, z, f) {
  const L = PORTO.LEVEL, sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  for (const g of PORTO.gates) {
    if (!g.level) continue;
    const [gx, gz] = g.at, [u, v, c] = g.dir === 'z' ? [x - gx, z - gz, gz] : [z - gz, x - gx, gx];   // u across the border, v along it
    const m = (1 - sm((Math.abs(u) - L.x) / L.fx)) * (1 - sm((Math.abs(v) - g.w / 2 - L.z) / L.fz));
    if (m <= 0) continue;
    const h = f(x, z), h0 = g.dir === 'z' ? f(x, c) : f(c, z);
    return m >= 1 ? h0 : lerp(h, h0, m);
  }
  return f(x, z);
}
// the base without the gate levelling
function portoBaseRaw(x, z) {
  // levelled gates: z → zc + D·p(|z - zc|/D), p(t) = 3t³ - 2t⁴ (p(0) = p'(0) = 0, p(1) = p'(1) = 1, so it joins the plain
  // profile smoothly at D; with D 72 the grade is 0.6 % at the gate's edge and 1.3 % at 12 m, and peaks at 1.7× the profile's at 0.75 D,
  // well past the districts' own street shoulders).
  // Full strength within GATE_DEPTH of the border, eased out over the next 20 m east and west.
  for (const g of PORTO.gates) {
    if (!g.bend || g.dir !== 'z') continue;
    const [gx, gz] = g.at, D = g.bend, dz = z - gz, ax = Math.abs(x - gx) - PORTO.GATE_DEPTH;
    if (Math.abs(dz) >= D || ax >= 20) continue;
    const t = Math.abs(dz) / D, zl = gz + Math.sign(dz) * D * t * t * t * (3 - 2 * t);
    let e = ax <= 0 ? 1 : 1 - ax / 20; e = e * e * (3 - 2 * e);
    z = z + (zl - z) * e;
  }
  const P = PORTO.profile, lin = z => { if (z <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (z <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (z - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; };
  let h = 0; for (const o of [-24, -12, 0, 12, 24]) h += lin(z + o); h /= 5;   // round off the corners of the profile
  if (z > PORTO.seaZ) h = lerp(-42, -52, clamp((z - PORTO.seaZ) / 6, 0, 1));  // the quay drops to the sea bed
  const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const edge = Math.max(Math.abs(x) - 975, -625 - z);                          // the hills round the edge
  if (edge > 0 && z < PORTO.seaZ - 30) h += 22 * sm(edge / 30) * sm((PORTO.seaZ - 30 - z) / 60);
  return h;
}

/* ---------- P.road: a winding road carved into the ground (see CONTRACT.md 5, "Winding roads") ----------
   portoRoad(spec, groundH) lays out the centre line (straights and fillet arcs), samples it every ~2 m, reads its height
   profile off groundH (the ground before this road: the district ground and every earlier road) and returns the road:
   carve(x, z, h) gives the ground with the road cut into h, dist(x, z) the distance from the centre line. Nothing is built here. */
function portoRoad(spec, groundH) {
  const hw = spec.hw ?? 4, sw = spec.sw ?? 2.5, blend = spec.blend ?? 20, core = hw + Math.max(0, sw) + 0.5, reach = core + blend, DS = 2;
  const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  // 1. the centre line: straights between fillet arcs (r at an interior vertex: the arc's radius, default 30, shrunk to fit)
  const V2 = spec.pts, pieces = [], warn = [];
  let cur = [V2[0][0], V2[0][1]];
  for (let i = 1; i < V2.length; i++) {
    const p = V2[i];
    if (i === V2.length - 1) { pieces.push({ t: 'L', a: cur, b: [p[0], p[1]] }); break; }
    const q = V2[i + 1], l1 = Math.hypot(p[0] - V2[i - 1][0], p[1] - V2[i - 1][1]), l2 = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const u1 = [(p[0] - V2[i - 1][0]) / l1, (p[1] - V2[i - 1][1]) / l1], u2 = [(q[0] - p[0]) / l2, (q[1] - p[1]) / l2];
    const cr = u1[0] * u2[1] - u1[1] * u2[0], th = Math.acos(clamp(u1[0] * u2[0] + u1[1] * u2[1], -1, 1));
    let r = p[2] ?? 30;
    if (th < 1e-3 || r <= 0) { pieces.push({ t: 'L', a: cur, b: [p[0], p[1]] }); cur = [p[0], p[1]]; continue; }
    let T = r * Math.tan(th / 2);
    const room = Math.min(Math.hypot(p[0] - cur[0], p[1] - cur[1]), i + 1 === V2.length - 1 ? l2 : l2 / 2);
    if (T > room) { T = room; warn.push(`vertex ${i}: radius ${r} cut to ${(T / Math.tan(th / 2)).toFixed(1)}`); r = T / Math.tan(th / 2); }
    const A = [p[0] - u1[0] * T, p[1] - u1[1] * T], B = [p[0] + u2[0] * T, p[1] + u2[1] * T], sg = Math.sign(cr);
    if (Math.hypot(A[0] - cur[0], A[1] - cur[1]) > 1e-6) pieces.push({ t: 'L', a: cur, b: A });
    const C = [A[0] - u1[1] * r * sg, A[1] + u1[0] * r * sg], a0 = Math.atan2(A[1] - C[1], A[0] - C[0]);
    pieces.push({ t: 'A', c: C, R: r, a0, a1: a0 + sg * th, sg });
    cur = B;
  }
  if (warn.length) console.warn(`P.road ${spec.name || ''}: ${warn.join('; ')}`);
  // 2. samples every ~2 m, evenly spaced along the whole line (the smoothing below counts samples, so they must be even):
  // position, unit tangent, signed curvature (+ turns left, toward (-tz, tx)), distance along
  const X = [], Z = [], TX = [], TZ = [], KK = [], SS = [], arcs = [];
  let tot = 0;
  for (const pc of pieces) { pc.len = pc.t === 'L' ? Math.hypot(pc.b[0] - pc.a[0], pc.b[1] - pc.a[1]) : pc.R * Math.abs(pc.a1 - pc.a0); pc.s0 = tot; tot += pc.len;
    if (pc.t === 'A') arcs.push({ s0: pc.s0, s1: tot, R: pc.R, sg: pc.sg }); }
  const NS = Math.max(1, Math.ceil(tot / DS));
  for (let j = 0, q = 0; j <= NS; j++) {
    const s = tot * j / NS; while (q < pieces.length - 1 && s > pieces[q].s0 + pieces[q].len) q++;
    const pc = pieces[q], t = pc.len > 0 ? clamp((s - pc.s0) / pc.len, 0, 1) : 0; let x, z, tx, tz;
    if (pc.t === 'L') { tx = (pc.b[0] - pc.a[0]) / (pc.len || 1); tz = (pc.b[1] - pc.a[1]) / (pc.len || 1); x = pc.a[0] + (pc.b[0] - pc.a[0]) * t; z = pc.a[1] + (pc.b[1] - pc.a[1]) * t; }
    else { const a = pc.a0 + (pc.a1 - pc.a0) * t; x = pc.c[0] + pc.R * Math.cos(a); z = pc.c[1] + pc.R * Math.sin(a); tx = -Math.sin(a) * pc.sg; tz = Math.cos(a) * pc.sg; }
    X.push(x); Z.push(z); TX.push(tx); TZ.push(tz); KK.push(pc.t === 'L' ? 0 : pc.sg / pc.R); SS.push(s);
  }
  const N = X.length, L = SS[N - 1];
  // smoothing: a box filter of radius rad metres, run twice, its window shrinking to nothing at the ends (so the ends stay put)
  const smooth = (v, rad) => { for (let pass = 0; pass < 2; pass++) { const c = [0]; for (let i = 0; i < N; i++) c.push(c[i] + v[i]);
    const w = Math.max(0, Math.round(rad / (L / (N - 1) || 1))); v = v.map((_, i) => { const r = Math.min(w, i, N - 1 - i); return (c[i + r + 1] - c[i - r]) / (2 * r + 1); }); } return v; };
  // 3. the profile: the ground under the line (or the ys keypoints [[s, y], ...]), smoothed over ~30 m, plus the bumps
  let prof;
  if (spec.ys && spec.ys.length) {
    const ks = spec.ys.map(([s, y]) => [s, y]).sort((a, b) => a[0] - b[0]);
    if (ks[0][0] > 0) ks.unshift([0, groundH(X[0], Z[0])]);
    if (ks[ks.length - 1][0] < L) ks.push([L, groundH(X[N - 1], Z[N - 1])]);
    prof = SS.map(s => { let j = 1; while (j < ks.length - 1 && ks[j][0] < s) j++; return lerp(ks[j - 1][1], ks[j][1], clamp((s - ks[j - 1][0]) / (ks[j][0] - ks[j - 1][0] || 1), 0, 1)); });
  } else prof = X.map((x, i) => groundH(x, Z[i]));
  prof = smooth(prof, (spec.smooth ?? 30) / 2);
  for (const b of spec.bumps || []) for (let i = 0; i < N; i++) { const u = (SS[i] - b.s) / b.len; if (Math.abs(u) < 0.5) prof[i] += b.h * 0.5 * (1 + Math.cos(2 * Math.PI * u)); }
  // 4. the bank: cross-slope dy/d(left) = -curvature * k, clamped, smoothed (lower on the inside of the turn)
  const bk = spec.bank === false ? { k: 0, max: 0 } : typeof spec.bank === 'number' ? { k: spec.bank } : spec.bank || {};
  const bankK = bk.k ?? 3, bankMax = bk.max ?? 0.12;
  const bank = smooth(KK.map(k => clamp(-k * bankK, -bankMax, bankMax)), (bk.smooth ?? 16) / 2);
  // 5. the segments between samples, indexed in a 16 m grid (each segment in every cell within reach of it)
  const n = N - 1, AX = new Float64Array(n), AZ = new Float64Array(n), DX = new Float64Array(n), DZ = new Float64Array(n), L2 = new Float64Array(n), LN = new Float64Array(n);
  const G = 16, KEY = (ix, iz) => (ix + 4096) * 8192 + iz + 4096, cells = new Map();
  let bx0 = 1e9, bx1 = -1e9, bz0 = 1e9, bz1 = -1e9;
  for (let i = 0; i < n; i++) {
    AX[i] = X[i]; AZ[i] = Z[i]; DX[i] = X[i + 1] - X[i]; DZ[i] = Z[i + 1] - Z[i]; L2[i] = DX[i] * DX[i] + DZ[i] * DZ[i] || 1e-9; LN[i] = Math.sqrt(L2[i]);
    const e = reach + 1, x0 = Math.min(X[i], X[i + 1]) - e, x1 = Math.max(X[i], X[i + 1]) + e, z0 = Math.min(Z[i], Z[i + 1]) - e, z1 = Math.max(Z[i], Z[i + 1]) + e;
    bx0 = Math.min(bx0, x0); bx1 = Math.max(bx1, x1); bz0 = Math.min(bz0, z0); bz1 = Math.max(bz1, z1);
    for (let ix = Math.floor(x0 / G); ix <= Math.floor(x1 / G); ix++) for (let iz = Math.floor(z0 / G); iz <= Math.floor(z1 / G); iz++) {
      const k = KEY(ix, iz); if (!cells.has(k)) cells.set(k, []); cells.get(k).push(i); }
  }
  let most = 0; for (const [k, v] of cells) { cells.set(k, Int32Array.from(v)); most = Math.max(most, v.length); }
  const DD = new Float64Array(most), TU = new Float64Array(most), LAT = new Float64Array(most);
  // distances to the segments in this cell (into DD/TU/LAT); returns the nearest, or Infinity
  function near(x, z) {
    if (x < bx0 || x > bx1 || z < bz0 || z > bz1) return Infinity;
    const list = cells.get(KEY(Math.floor(x / G), Math.floor(z / G))); if (!list) return Infinity;
    let dmin = Infinity;
    for (let k = 0; k < list.length; k++) {
      const i = list[k], rx = x - AX[i], rz = z - AZ[i], tu = (rx * DX[i] + rz * DZ[i]) / L2[i], tc = tu < 0 ? 0 : tu > 1 ? 1 : tu;
      const ex = rx - DX[i] * tc, ez = rz - DZ[i] * tc, d = Math.sqrt(ex * ex + ez * ez);
      DD[k] = d; TU[k] = tu; LAT[k] = (rz * DX[i] - rx * DZ[i]) / LN[i];
      if (d < dmin) dmin = d;
    }
    return dmin;
  }
  // the ground with the road in it. The road's height is an average over the nearby segments, weighted to the nearest
  // (sharply on the road, more softly out on the shoulders), so where two stretches of road come close (a hairpin's legs)
  // the ground between them is continuous. Flat across the sidewalks (|d| > hw); blended back to h over `blend`.
  function carve(x, z, h) {
    const dmin = near(x, z); if (dmin >= reach) return h;
    const list = cells.get(KEY(Math.floor(x / G), Math.floor(z / G))), out = dmin - core, tau = 0.25 + 0.5 * (out > 0 ? out : 0);
    let sum = 0, ws = 0;
    for (let k = 0; k < list.length; k++) {
      const e = DD[k] - dmin; if (e > 6 * tau) continue;
      const i = list[k], w = Math.exp(-e / tau), t = TU[k] < -0.5 ? -0.5 : TU[k] > 1.5 ? 1.5 : TU[k], tb = t < 0 ? 0 : t > 1 ? 1 : t;
      const lat = LAT[k] < -hw ? -hw : LAT[k] > hw ? hw : LAT[k];
      sum += w * (prof[i] + (prof[i + 1] - prof[i]) * t + (bank[i] + (bank[i + 1] - bank[i]) * tb) * lat); ws += w;
    }
    const Y = sum / ws, m = out <= 0 ? 1 : sm(1 - out / blend);
    return h + (Y - h) * m;
  }
  // the road at distance s along: centre position, tangent, height, bank
  function at(s) {
    s = clamp(s, 0, L); let lo = 0, hi = N - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (SS[m] <= s) lo = m; else hi = m; }
    const t = (s - SS[lo]) / (SS[hi] - SS[lo] || 1);
    return { x: lerp(X[lo], X[hi], t), z: lerp(Z[lo], Z[hi], t), tx: lerp(TX[lo], TX[hi], t), tz: lerp(TZ[lo], TZ[hi], t), y: lerp(prof[lo], prof[hi], t), bank: lerp(bank[lo], bank[hi], t), k: lerp(KK[lo], KK[hi], t) };
  }
  return { spec, name: spec.name || 'Road', hw, sw, blend, core, reach, L, N, arcs, bbox: [bx0, bx1, bz0, bz1],
    S: { x: X, z: Z, tx: TX, tz: TZ, k: KK, s: SS, prof, bank }, carve, at, dist: near,
    grade: Math.abs(prof[N - 1] - prof[0]) / L };
}

/* the kerbs, sidewalks, guardrails, line paint and asphalt of a road from portoRoad (the ground under it is already carved) */
function portoRoadBuild(K, r, spec) {
  const { hw, sw, S, N } = r, T = K.terrainH;
  const sides = v => v === false ? [] : v === 'left' ? [1] : v === 'right' ? [-1] : [1, -1];   // +1 is the left of travel
  const curb = sides(spec.curb ?? 'both'), walk = sw > 0.4 ? sides(spec.walk ?? spec.curb ?? 'both') : [];
  const at = (i, lat) => [S.x[i] - S.tz[i] * lat, S.z[i] + S.tx[i] * lat];
  // chord ends: each chord runs on while the line it stands for (at every lat in lats) stays within tl metres across and tv
  // up or down of it, at most mx samples; few chords keep the grind line count down (each chord is one line)
  const chords = (i0, i1, lats, tl, tv, mx) => {
    const P = lats.map(lat => { const o = []; for (let i = i0; i <= i1; i++) { const [x, z] = at(i, lat); o.push([x, T(x, z), z]); } return o; });
    const out = [i0];
    for (let i = i0; i < i1;) {
      let j = i + 1;
      for (let jj = i + 2; jj <= Math.min(i1, i + mx); jj++) {
        const ok = P.every(o => { const a = o[i - i0], b = o[jj - i0], dx = b[0] - a[0], dz = b[2] - a[2], l2 = dx * dx + dz * dz || 1e-9;
          for (let m = i + 1; m < jj; m++) { const q = o[m - i0], t = ((q[0] - a[0]) * dx + (q[2] - a[2]) * dz) / l2;
            if (Math.abs((q[2] - a[2]) * dx - (q[0] - a[0]) * dz) / Math.sqrt(l2) > tl || Math.abs(q[1] - (a[1] + (b[1] - a[1]) * t)) > tv) return false; }
          return true; });
        if (!ok) break; j = jj;
      }
      out.push(j); i = j;
    }
    return out;
  };
  const br = chords(0, N - 1, curb.length ? curb.map(sd => sd * hw) : [hw, -hw], 0.15, 0.03, 16);
  const slab = (i, j, lat, w, lift, noRails, kind, color) => { const [ax, az] = at(i, lat), [bx, bz] = at(j, lat), p0 = V(ax, T(ax, az) + lift, az), p1 = V(bx, T(bx, bz) + lift, bz), hi = p0.y >= p1.y;
    K.hubbas.push({ a: hi ? p0 : p1, b: hi ? p1 : p0, w, noRails, kind, color }); };
  // the kerb: a 0.35 m strip; its road-side edge is the grind (one line, its chords meet end to end)
  for (const sd of curb) for (let c = 0; c + 1 < br.length; c++) { const i = br[c], j = br[c + 1];
    slab(i, j, sd * (hw + 0.175), 0.35, 0.15, true, 'Curb', spec.curbColor ?? 0xb9b5ab);
    const [ax, az] = at(i, sd * hw), [bx, bz] = at(j, sd * hw); K.rail(ax, T(ax, az) + 0.15, az, bx, T(bx, bz) + 0.15, bz, 'Curb', false); }
  for (const sd of walk) { const c0 = curb.includes(sd) ? 0.35 : 0, w = sw - c0;
    for (let c = 0; c + 1 < br.length; c++) slab(br[c], br[c + 1], sd * (hw + c0 + w / 2), w, 0.15, true, undefined, 0xc4c0b6); }
  // guardrails round the outside of each bend tighter than guardR (default 80), from 4 m before it to 4 m after; bends on
  // the same side that come within 12 m of each other share one rail
  if (spec.guard !== false) {
    const runs = { 1: [], '-1': [] };
    for (const a of r.arcs) if (a.R < (spec.guardR ?? 80)) { const sd = -a.sg, list = runs[sd], s0 = Math.max(0, a.s0 - 4), s1 = Math.min(r.L, a.s1 + 4);
      if (list.length && s0 - list[list.length - 1][1] < 12) list[list.length - 1][1] = s1; else list.push([s0, s1]); }
    const idx = s => { let i = 0; while (i < N - 1 && S.s[i] < s) i++; return i; };
    for (const sd of [1, -1]) for (const [s0, s1] of runs[sd]) {
      const lat = sd * (walk.includes(sd) ? hw + sw - 0.3 : hw + 0.8), lift = walk.includes(sd) ? 0.9 : 0.75, i0 = idx(s0), i1 = idx(s1);
      const gb = chords(i0, i1, [lat], 0.2, 0.04, 8);
      for (let c = 0; c + 1 < gb.length; c++) { const [ax, az] = at(gb[c], lat), [bx, bz] = at(gb[c + 1], lat); K.rail(ax, T(ax, az) + lift, az, bx, T(bx, bz) + lift, bz, 'Rail', true); }
    }
  }
  // the asphalt: a ribbon 2 vertices across per sample (the road is flat across, so that is exact), cut into ~32 m pieces
  // (one culling patch each), 4 cm over the ground; the centre line's 3 m dashes every 6 m on top of it
  const asphalt = spec.color ?? 0x56585d, PO = { roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 };
  const PO2 = { roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -6 };
  K.decorFns.push(D => {
    const quads = (list, color, extra) => { if (!list.length) return; const pos = new Float32Array(list.length * 18); let o = 0;
      for (const [l0, r0, l1, r1] of list) for (const p of [r0, l0, r1, l0, l1, r1]) { pos[o++] = p[0]; pos[o++] = p[1]; pos[o++] = p[2]; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.computeVertexNormals(); D.add(g, color, [0, 0, 0], [0, 0, 0], [1, 1, 1], extra); };
    const edge = (i, lat, lift) => { const [x, z] = at(i, lat); return [x, T(x, z) + lift, z]; };
    for (let i0 = 0; i0 < N - 1; i0 += 16) { const q = [];
      for (let i = i0; i < Math.min(N - 1, i0 + 16); i++) q.push([edge(i, hw, 0.04), edge(i, -hw, 0.04), edge(i + 1, hw, 0.04), edge(i + 1, -hw, 0.04)]);
      quads(q, asphalt, PO); }
    if (spec.dashes === false) return;
    const pt = (s, lat) => { const a = r.at(s), x = a.x - a.tz * lat, z = a.z + a.tx * lat; return [x, T(x, z) + 0.055, z]; };
    let q = [], s00 = null;
    for (let s = 4; s + 3 < r.L - 3; s += 6) { for (let k = 0; k < 3; k++) q.push([pt(s + k, 0.08), pt(s + k, -0.08), pt(s + k + 1, 0.08), pt(s + k + 1, -0.08)]);
      if (s00 === null) s00 = s; if (s - s00 >= 30) { quads(q, spec.lineColor ?? 0xe2c044, PO2); q = []; s00 = null; } }
    quads(q, spec.lineColor ?? 0xe2c044, PO2);
  });
}

/* the ground mesh along the roads: each 8 m cell within reach of a road gets the coarsest res of 4, 2 and 1 whose triangles
   (split on the b-c diagonal, as the ground mesh splits them) stay within tol (2.5 cm) above the true ground H at
   0.5 m test points, so neither the asphalt (4 cm up) nor the rider sinks into it (4 cm in cells off the carriageway, under
   the 5 cm the check's sink scan allows); merged into rects. Cells already drawn
   as fine or finer (covered: the districts' regions and the fine patches) are left to them; the regions they would be drawn
   coarser in must skip the rects this returns */
function portoRoadRegions(roads, covered, H, tolRoad = 0.025, tolOff = 0.04) {
  const res = new Map();   // "ix,iz" -> res
  const g = new Float64Array(17 * 17);   // H on the cell's 0.5 m grid: the vertices of every res, and the test points
  const err = (r, st) => {               // how far the res-r mesh of the cell rises above H at the test points every st (1 or 2 grid steps)
    const n = 2 * r; let e = 0;
    for (let j = 0; j < 16; j += st) for (let i = 0; i < 16; i += st) {
      const i0 = i - i % n, j0 = j - j % n, u = (i - i0) / n, w = (j - j0) / n, a = g[j0 * 17 + i0], b = g[j0 * 17 + i0 + n], c = g[(j0 + n) * 17 + i0], d = g[(j0 + n) * 17 + i0 + n];
      const m = u + w <= 1 ? a + u * (b - a) + w * (c - a) : d + (1 - u) * (c - d) + (1 - w) * (b - d);
      if (m - g[j * 17 + i] > e) e = m - g[j * 17 + i]; }
    return e;
  };
  for (const r of roads) {
    const [x0, x1, z0, z1] = r.bbox;
    for (let x = Math.floor(x0 / 8) * 8; x < x1; x += 8) for (let z = Math.floor(z0 / 8) * 8; z < z1; z += 8) {
      const cx = x + 4, cz = z + 4, k = x / 8 + ',' + z / 8; if (res.has(k) || r.dist(cx, cz) > r.reach + 5.7) continue;
      const has = covered.reduce((m, c) => cx > c.x0 && cx < c.x1 && cz > c.z0 && cz < c.z1 ? Math.min(m, c.res) : m, 99);
      if (has <= 1) continue;
      const tol = roads.some(o => o.dist(cx, cz) < o.hw + 6.5) ? tolRoad : tolOff;
      // first the whole metres only (ground that is smooth here passes at res 4 with room to spare), then every 0.5 m
      for (let j = 0; j < 17; j += 2) for (let i = 0; i < 17; i += 2) g[j * 17 + i] = H(x + i / 2, z + j / 2);
      let q = 4;
      if (err(4, 2) > tol / 3) { for (let j = 0; j < 17; j++) for (let i = (j & 1) ? 0 : 1; i < 17; i += (j & 1) ? 1 : 2) g[j * 17 + i] = H(x + i / 2, z + j / 2);
        q = err(4, 1) <= tol ? 4 : err(2, 1) <= tol ? 2 : 1; }
      if (q < has) res.set(k, q);
    }
  }
  // merge: runs along x in each row, then rows with the same run on top of each other
  const rows = new Map();
  for (const [k, v] of res) { const [i, j] = k.split(',').map(Number); if (!rows.has(j)) rows.set(j, []); rows.get(j).push([i, v]); }
  const open = new Map(), out = [];
  for (const j of [...rows.keys()].sort((a, b) => a - b)) {
    const cs = rows.get(j).sort((a, b) => a[0] - b[0]), runs = [];
    for (const [i, v] of cs) { const l = runs[runs.length - 1]; if (l && l.i1 === i && l.res === v) l.i1 = i + 1; else runs.push({ i0: i, i1: i + 1, res: v }); }
    for (const u of runs) { const key = u.i0 + ',' + u.i1 + ',' + u.res, o = open.get(key);
      if (o && o.j1 === j) { o.j1 = j + 1; } else { const n = { ...u, j0: j, j1: j + 1 }; open.set(key, n); out.push(n); } }
  }
  return out.map(o => ({ x0: o.i0 * 8, x1: o.i1 * 8, z0: o.j0 * 8, z1: o.j1 * 8, res: o.res }));
}

function levelPorto() {
  const q = new URLSearchParams(location.search);
  const ONLY = q.get('only') ? q.get('only').split(',') : null, GRAY = q.has('gray');
  const IDS = Object.keys(PORTO.districts);
  const BUILD = {
    heights: typeof porto_heights === 'function' ? porto_heights : null, arroyo: typeof porto_arroyo === 'function' ? porto_arroyo : null,
    fin: typeof porto_fin === 'function' ? porto_fin : null, uni: typeof porto_uni === 'function' ? porto_uni : null,
    old: typeof porto_old === 'function' ? porto_old : null, east: typeof porto_east === 'function' ? porto_east : null,
    bw: typeof porto_bw === 'function' ? porto_bw : null, ship: typeof porto_ship === 'function' ? porto_ship : null,
  };
  const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const inR = (r, x, z, pad = 0) => x >= r[0] - pad && x <= r[1] + pad && z >= r[2] - pad && z <= r[3] + pad;
  const districtAt = (x, z) => { for (const id of IDS) if (inR(PORTO.districts[id].rect, x, z)) return id; return null; };
  const [BX0, BX1, BZ0, BZ1] = PORTO.bounds;
  // how far in from the nearest border with another district (the map's own edges don't count)
  const bandDist = (r, x, z) => Math.min(r[0] > BX0 ? x - r[0] : 1e9, r[1] < BX1 ? r[1] - x : 1e9, r[2] > BZ0 ? z - r[2] : 1e9, r[3] < BZ1 ? r[3] - z : 1e9);

  /* ---------- the ground: each district may shape its own, meeting the base height at its borders ---------- */
  const GROUND = {}, COL = {}, SURF = {}, ROADS = [];
  function baseH(x, z) {
    const b = portoBaseH(x, z), id = districtAt(x, z), g = id && GROUND[id];
    let h = b;
    if (g) { const w = sm(bandDist(PORTO.districts[id].rect, x, z) / PORTO.BAND); if (w > 0) h = lerp(b, g(x, z, b), w); }
    for (let i = 0; i < ROADS.length; i++) h = ROADS[i].carve(x, z, h);     // the roads, in the order they were laid (P.road)
    return h;
  }
  const K = cityKit(baseH, 20261010);
  K.shops = []; K.challenges = []; K.tapes = []; K.traffic = []; K.ringTraffic = []; K.peds = []; K.ringPeds = []; K.npcs = [];
  K.dtCol = () => null; K.dtSurface = () => null;
  // a winding road (P.road): carve it into the ground (every later road reads the ground with this one in it), then build it
  function addRoad(id, spec) {
    const r = portoRoad(spec, baseH); r.district = id;
    ROADS.push(r); K.roadLines.push(r);
    portoRoadBuild(K, r, spec);
    const pts = []; for (let i = 0; i < r.N; i += 4) pts.push([r.S.x[i], r.S.z[i]]); if ((r.N - 1) % 4) pts.push([r.S.x[r.N - 1], r.S.z[r.N - 1]]);
    lines.push({ name: r.name, pts, kind: spec.kind || (r.grade >= 0.03 ? 'bomb' : 'push'), main: !!spec.main, district: id });
    return r;
  }

  const extraRegions = [], spots = [], lines = [], fast = [], challenges = [], tapes = [], traffic = [], peds = [], npcs = [], landmarks = [], water = [];
  water.push({ x0: BX0 - 400, x1: BX1 + 400, z0: PORTO.seaZ, z1: BZ1 + 450, y: PORTO.seaY });
  const gatesOf = id => PORTO.gates.filter(g => g.a === id || g.b === id);
  function makeP(id) {
    const d = PORTO.districts[id], r = d.rect;
    return {
      id, name: d.name, rect: r, gates: gatesOf(id), baseH: portoBaseH, PORTO,
      inside: (x, z, pad = 0) => x >= r[0] + pad && x <= r[1] - pad && z >= r[2] + pad && z <= r[3] - pad,
      // your own ground: fn(x, z, base) gives the height inside your rectangle; it's blended into the
      // base height over the last BAND metres before a border. Call this first, before building anything.
      ground(fn) { GROUND[id] = fn; },
      col(fn) { COL[id] = fn; },                          // ground colour: fn(x, z, h) -> THREE.Color or null
      surface(fn) { SURF[id] = fn; },                     // fn(x, z) -> 'rough' | 'smooth' | null
      region(x0, x1, z0, z1, res) { extraRegions.push({ id, x0: Math.floor(x0 / 8) * 8, x1: Math.ceil(x1 / 8) * 8, z0: Math.floor(z0 / 8) * 8, z1: Math.ceil(z1 / 8) * 8, res }); },
      spot(name, x, y, z, yaw, area) { const s = { name, pos: V(x, y, z), yaw, area, district: id }; spots.push(s); return s; },
      // a line people ride (a street, a path, a route through the district): kind 'push' (streets, plazas) or 'bomb'
      // (descents); main: true for the district's named lines. tools/check.mjs --rhythm checks something skateable comes up often
      // a winding road carved into the ground, with kerbs, sidewalks, guardrails and its line (see CONTRACT 5, "Winding roads")
      road(spec) { return addRoad(id, spec); },
      line(name, pts, kind = 'push', main = false) { lines.push({ name, pts, kind, main, district: id }); },
      travel(name, x, y, z, yaw, kind = 'spot') { fast.push({ name, pos: V(x, y, z), yaw, kind, district: id }); },  // kind: 'district' | 'park' | 'spot'
      challenge(c) { challenges.push({ ...c, district: id }); },
      tape(x, z, y) { tapes.push([x, z, y]); },
      traffic(def) { traffic.push(def); }, peds(def) { peds.push(def); }, npc(def) { npcs.push(def); },
      landmark(L) { landmarks.push(L); },
      water(x0, x1, z0, z1, y) { water.push({ x0, x1, z0, z1, y }); },
      shop(s) { K.shops.push(s); },
    };
  }

  /* ---------- build the districts ---------- */
  const built = [];
  // the Financial Core goes first: it holds Downtown, which sets up the kit's shop list and challenge lists
  for (const id of ['fin', ...IDS.filter(i => i !== 'fin')]) {
    if (ONLY && !ONLY.includes(id)) continue;
    if (!BUILD[id]) continue;
    BUILD[id](K, makeP(id)); built.push(id);
  }
  // what Downtown registers on the kit directly (it predates P)
  challenges.push(...K.challenges); tapes.push(...K.tapes); traffic.push(...K.traffic, ...K.ringTraffic); peds.push(...K.peds, ...K.ringPeds); npcs.push(...K.npcs);

  // test view: the borders and the gates painted on the ground
  if (GRAY || built.length === 0) {
    for (const id of IDS) { const [x0, x1, z0, z1] = PORTO.districts[id].rect;
      for (const [a, b, c, e] of [[x0, z0, x1, z0 + 1], [x0, z1 - 1, x1, z1], [x0, z0, x0 + 1, z1], [x1 - 1, z0, x1, z1]]) K.decorFns.push(D => D.paint(a, b, c, e, portoBaseH((a + c) / 2, (b + e) / 2) + 0.05, 0x3a6fd8)); }
    for (const g of PORTO.gates) { const [gx, gz] = g.at, hw = g.w / 2, dd = PORTO.GATE_DEPTH;
      const [x0, x1, z0, z1] = g.dir === 'x' ? [gx - hw, gx + hw, gz - dd, gz + dd] : [gx - dd, gx + dd, gz - hw, gz + hw];
      K.decorFns.push(D => D.paint(x0, z0, x1, z1, K.terrainH(gx, gz) + 0.06, 0xe0703a)); }
  }

  /* ---------- the ground mesh: 250 m tiles at 8 m, finer where districts asked, finest round pools ---------- */
  const C = c => new THREE.Color(c);
  const grass = C(0x7d9a5b), concrete = C(0xb3afa6), sand = C(0xd6c49a), quay = C(0x9d9a92), tile = C(0x3d7fae), poolC = C(0xb7b8b2);
  const groundCol = (x, z, h) => {
    const id = districtAt(x, z), f = id && COL[id], c = f && f(x, z, h); if (c) return c;
    const dc = K.dtCol(x, z); if (dc) return dc;
    if (z > 1160) return quay;
    if (z > 910) return concrete;
    return grass;
  };
  // a pool's tile band and floor, measured from its own rim height (y0 in K.pool), not the base ground
  const poolCol = y0 => (x, z, h) => { const g = y0 ?? baseH(x, z); return h > g - 0.32 && h < g - 0.015 ? tile : h < g - 0.015 ? poolC : groundCol(x, z, h); };
  const snap = f => ({ ...f, x0: Math.floor(f.x0 / 8) * 8, x1: Math.ceil(f.x1 / 8) * 8, z0: Math.floor(f.z0 / 8) * 8, z1: Math.ceil(f.z1 / 8) * 8 });
  const F = K.fine.map(snap), XR = extraRegions;
  const regions = [];
  // tiles on the 8 m grid (x -1000 and z -656 are multiples of 8), so their edges fall on grid lines
  const TILE = 256, TZ0 = Math.floor(BZ0 / 8) * 8, TZ1 = Math.ceil((BZ1 + 60) / 8) * 8;
  const t0 = performance.now(), RR = portoRoadRegions(ROADS, [...XR, ...F], K.terrainH);   // the roads' corridors at res 4, 2 or 1 (where nothing as fine covers them)
  if (ROADS.length) console.log(`P.road ground: ${RR.length} rects, cells at res 4/2/1: ${[4, 2, 1].map(q => RR.filter(r => r.res === q).reduce((n, r) => n + (r.x1 - r.x0) * (r.z1 - r.z0) / 64, 0)).join('/')}, ${(performance.now() - t0).toFixed(0)} ms`);
  for (let x = BX0; x < BX1; x += TILE) for (let z = TZ0; z < TZ1; z += TILE)
    regions.push({ x0: x, x1: Math.min(BX1, x + TILE), z0: z, z1: Math.min(TZ1, z + TILE), res: 8, col: groundCol, skip: [...XR, ...F, ...RR] });
  for (const r of RR) regions.push({ ...r, col: groundCol, skip: [] });
  const inRR = r => RR.filter(o => o.x0 < r.x1 && o.x1 > r.x0 && o.z0 < r.z1 && o.z1 > r.z0);   // finer than r wherever they overlap it
  for (const r of XR) regions.push({ x0: r.x0, x1: r.x1, z0: r.z0, z1: r.z1, res: r.res, col: groundCol, skip: [...F, ...XR.filter(o => o !== r && o.res < r.res && o.x0 >= r.x0 && o.x1 <= r.x1 && o.z0 >= r.z0 && o.z1 <= r.z1), ...inRR(r)] });
  for (const f of F) regions.push({ x0: f.x0, x1: f.x1, z0: f.z0, z1: f.z1, res: f.res, resX: f.resX, resZ: f.resZ, col: f.kind === 'pool' ? poolCol(f.y0) : groundCol, skip: [...F.filter(o => o !== f && o.x0 >= f.x0 && o.x1 <= f.x1 && o.z0 >= f.z0 && o.z1 <= f.z1 && o.res < f.res), ...inRR(f)] });

  /* ---------- fast travel, spawn ---------- */
  const order = { district: 0, park: 1, spot: 2 };
  fast.sort((a, b) => order[a.kind] - order[b.kind]);
  const fallback = (() => { const id = built[0] || 'fin', r = PORTO.districts[id].rect, x = (r[0] + r[1]) / 2, z = (r[2] + r[3]) / 2; return { name: PORTO.districts[id].name, pos: V(x, K.terrainH(x, z), z), yaw: 0 }; })();
  const travel = fast.length ? fast : [fallback];
  return {
    terrainH: K.terrainH, baseH: portoBaseH, PORTO, built,
    surface: (x, z) => { for (const r of ROADS) if (r.dist(x, z) <= r.hw + 0.5) return 'smooth';
      const id = districtAt(x, z), f = id && SURF[id]; return (f && f(x, z)) || K.dtSurface(x, z) || 'smooth'; },
    roads: ROADS,
    regions, boxes: K.boxes, hubbas: K.hubbas, rails: K.rails, hazards: K.hazards,
    districts: travel, spots, lines, challenges, tapes, shop: K.shops[0] || undefined, shops: K.shops.filter(Boolean), npcs, traffic, peds,
    landmarks, water, seaZ: PORTO.seaZ,
    spawn: travel[0], spawnShop: 'Corner Skate Shop', bounds: [BX0 + 5, BX1 - 5, BZ0 + 5, BZ1 - 5],
    fog: [160, 460], far: 2800, cullDist: 480, simDist: 280, sky: 0xa9c8de,
    decor(D) { for (const f of K.decorFns) f(D); },
  };
}

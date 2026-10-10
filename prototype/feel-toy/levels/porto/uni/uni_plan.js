/* University (uni): the shared plan (ground, colour, surface, shared numbers). Design: levels/porto/design/uni.md 2.1, 2.3, 2.4.
   Builds nothing. index.js calls P.ground(PL.ground), P.col(PL.col), P.surface(PL.surface). */
function uni_plan() {
  const U = 6.0;                                         // the Upper Campus plateau
  const F = t => t <= 0 ? 0 : t < 1 ? t * t / 2 : t - 0.5;
  // smoothed linear 0 -> 1: exactly (u-u0)/(u1-u0) between u0+r and u1-r, 0 below u0-r, 1 above u1+r
  const ramp = (u, u0, u1, r) => { const L = u1 - u0; return (F((u - u0 + r) / L) - F((u - u0 - r) / L)) * L / (2 * r); };
  const c01 = t => t < 0 ? 0 : t > 1 ? 1 : t;
  const mix = (a, b, t) => a + (b - a) * t;
  const boxD = (x, z, r) => Math.hypot(Math.max(r[0] - x, 0, x - r[1]), Math.max(r[2] - z, 0, z - r[3]));
  // the lowland: 0 at the north border and under Gown Street (x < 408) and Mill Lane (z > 192), so both streets are flat across; 2.0 in the middle
  const low = (x, z) => 2 * Math.min(ramp(x, 408, 500, 4), 1 - ramp(z, 40, 188, 4), ramp(z, -200, -140, 10));
  const BENCH = [[512, 624, 40, 108, 1.8], [736, 904, 56, 144, 1.25]];   // the Commons, Alumni Field
  const T = z => U * ramp(z, -190, -130, 10);            // the north face: 0 at z -200, 10 % from -180 to -140, U from -120
  const A = x => U * ramp(x, 404, 504, 8);               // University Avenue: 0 at x 396, 6 % from 412 to 496, U at 512
  const Dz = z => U * (1 - ramp(z, 36, 196, 8));         // Campus Drive: U at z 28, 3.75 % from 44 to 188, 0 at 204
  function layers(x, z) {
    let h = low(x, z);
    for (const b of BENCH) { const k = c01(1 - boxD(x, z, b) / 8); if (k > 0) h = mix(h, b[4], k); }   // benches (override)
    if (x >= 504 && z <= 40) {                            // the plateau, with 8 m linear batters west (x 504..512) and south (z 32..40)
      const k = c01(Math.min((x - 504) / 8, (40 - z) / 8));
      h = mix(h, Math.max(h, T(z)), k); }
    if (x >= 396 && x <= 520 && Math.abs(z) <= 24) {      // the Avenue embankment: top |z| <= 16, banks to 24
      const k = c01((24 - Math.abs(z)) / 8); h = Math.max(h, mix(h, A(x), k)); }
    if (z >= 24 && Math.abs(x - 650) <= 24) {             // the Campus Drive embankment: top |x-650| <= 16, banks to 24
      const k = c01((24 - Math.abs(x - 650)) / 8); h = Math.max(h, mix(h, Dz(z), k)); }
    return h;
  }

  /* ---- colours (made once) ---- */
  const C = c => new THREE.Color(c);
  const COL = { asphalt: C(0x3a3a3c), carpark: C(0x46464a), walk: C(0xb8b2a6), bank: C(0xa9a59c), campus: C(0xd2c6ad),
    brick: C(0x9a6a58), lawn: C(0x6f8f4e), pitch: C(0x5f9a48), track: C(0xa5523a), court: C(0x4f7f9a) };
  const inB = (x, z, x0, x1, z0, z1) => x >= x0 && x <= x1 && z >= z0 && z <= z1;
  const ovalD = (x, z) => Math.hypot(Math.max(780 - x, 0, x - 860), z - 100);   // distance to the oval's centre segment
  // what the ground at (x, z) is: 'asphalt' | 'walk' | 'bank' | 'carpark' | 'brick' | 'campus' | 'lawn' | 'pitch' | 'track' | 'court' | null
  function kind(x, z) {
    // 1. flush roads
    if (x >= 636 && x <= 664 && z >= -230 && z <= -120) {          // Ridge Road
      const half = z < -140 ? 5 : z > -124 ? 7 : 5 + 2 * (z + 140) / 16, sw = half >= 7 ? 4 : z < -140 ? 3 : 3 + (half - 5) / 2;
      const d = Math.abs(x - 650); if (d <= half) return 'asphalt'; if (d <= half + sw) return 'walk'; }
    if (z >= 32 && z <= 230) { const d = Math.abs(x - 650); if (d <= 7) return 'asphalt'; if (d <= 11) return 'walk'; }   // Campus Drive
    if (x >= 360 && x <= 520) { const d = Math.abs(z); if (d <= 7) return 'asphalt'; if (d <= 11) return 'walk'; }          // University Avenue
    if (z >= -210 && z <= 209) { const d = Math.abs(x - 396); if (d <= 7) return 'asphalt'; if (d <= 11) return 'walk'; }   // Gown Street
    if (x >= 396 && x <= 975) { const d = Math.abs(z - 200); if (d <= 6) return 'asphalt'; if (d <= 9) return 'walk'; }     // Mill Lane
    // 2. exposed banks
    if (inB(x, z, 504, 512, -200, -64) || inB(x, z, 920, 1000, 32, 40)) return 'bank';
    if (x >= 412 && x <= 504) { const d = Math.abs(z); if (d >= 16 && d <= 24) return 'bank'; }
    if (z >= 40 && z <= 204) { const d = Math.abs(x - 650); if (d >= 16 && d <= 24) return 'bank'; }
    // 3. car park
    if (inB(x, z, 408, 488, -200, -120)) return 'carpark';
    // 4. College Town paving
    if (x >= 372 && x <= 504) {
      if (inB(x, z, 440, 500, 36, 100)) return 'campus';                                   // Scholars Square
      if (inB(x, z, 440, 500, 100, 108) || inB(x, z, 440, 500, 150, 160)) return 'lawn';   // lawn strips
      return 'brick'; }
    // 5. the Quad
    if (inB(x, z, 724, 896, -80, 12)) {
      if (Math.hypot(x - 810, z + 28) <= 9) return 'campus';
      if ((inB(x, z, 732, 804, -72, -34) || inB(x, z, 732, 804, -22, 8) || inB(x, z, 816, 888, -72, -34) || inB(x, z, 816, 888, -22, 8))) return 'lawn';
      return 'campus'; }
    // 6. Alumni Field
    if (inB(x, z, 736, 904, 56, 144)) {
      const d = ovalD(x, z); if (d <= 34) return 'pitch'; if (d <= 42) return 'track'; return 'lawn'; }
    // the Bike Shed DIY's slab (a concrete yard, not grass)
    if (inB(x, z, 914, 968, 152, 191)) return 'walk';
    // 7. courts
    if (inB(x, z, 680, 728, 150, 190)) return 'court';
    // Brow Walk, then 8. lawns
    if (inB(x, z, 661, 744, -126, -120)) return 'campus';
    if (inB(x, z, 504, 1000, -210, -124) || inB(x, z, 504, 626, 150, 190) || inB(x, z, 912, 1000, 48, 150)) return 'lawn';
    // 9. campus paving
    if (inB(x, z, 512, 1000, -124, 32) || inB(x, z, 512, 624, 40, 108) || inB(x, z, 674, 736, 40, 190)) return 'campus';
    return null;
  }
  const KC = { asphalt: COL.asphalt, walk: COL.walk, bank: COL.bank, carpark: COL.carpark, brick: COL.brick, campus: COL.campus,
    lawn: COL.lawn, pitch: COL.pitch, track: COL.track, court: COL.court };
  const col = (x, z, h) => { const k = kind(x, z); return k ? KC[k] : null; };
  const surface = (x, z) => { const k = kind(x, z); return !k ? null : (k === 'lawn' || k === 'pitch') ? 'rough' : 'smooth'; };

  return { U, ramp, low, T, A, Dz, layers, BENCH, kind, col, surface,
    ground: (x, z, base) => base + layers(x, z),
    ROAD: { rw: 7, sw: 4 },
    AVE: { z: 0, x0: 360, top: 512 },          // flush x 360..520, K.street on the plateau x 520..639
    DRIVE: { x: 650, zTop: 32, zFoot: 204 },   // K.street on the plateau z -120..32, flush below
    RIDGE: { x: 650, z0: -230, zTop: -120 },   // flush; rw 5 / sw 3 widening to 7 / 4 by z -124
    GOWN: { x: 396, z0: -210, z1: 209 }, MILL: { z: 200, x0: 396, x1: 975 },
    RIM: { s0: 32, s1: 40, w0: 504, w1: 512 },
    COMMONS: 1.8, FIELD: 1.25,
    STEPS: { x0: 548, x1: 596, rails: [556, 572, 588] },
    QUAD: { x0: 728, x1: 892, z0: -76, z1: 12, cx: 810, cz: -28 },
    OVAL: { cx0: 780, cx1: 860, cz: 100, r: 34 },
    CAMPANILE: { x: 810, z: 23 },
  };
}
/* lean street furniture (the grind-line budget): planters and pads grind on their two long edges only, picnic tables on the table top,
   wheel stops not at all (a 0.16 m block you roll over). Same arguments as the K versions, plus K first. */
function uni_planter(K, x0, z0, x1, z1, hgt = 0.55) {
  return K.Bg(x0, z0, x1, z1, hgt, 'ledge', { edges: Math.abs(x1 - x0) >= Math.abs(z1 - z0) ? 'ns' : 'ew' });
}
function uni_pad(K, x0, z0, x1, z1, hgt = 0.18) {
  return K.Bg(x0, z0, x1, z1, hgt, 'pad', { edges: Math.abs(x1 - x0) >= Math.abs(z1 - z0) ? 'ns' : 'ew' });
}
function uni_picnic(K, x, z, alongX = true) {
  const hx = alongX ? 1.0 : 0.4, hz = alongX ? 0.4 : 1.0;
  K.Bg(x - hx, z - hz, x + hx, z + hz, 0.76, 'wood', { edges: alongX ? 'ns' : 'ew' });
  for (const s of [-1, 1]) { const sx = alongX ? x : x + s * 0.75, sz = alongX ? z + s * 0.75 : z, ax = alongX ? 1.0 : 0.14, az = alongX ? 0.14 : 1.0;
    K.Bg(sx - ax, sz - az, sx + ax, sz + az, 0.45, 'wood', { edges: '' }); }
}
function uni_stop(K, x, z, alongX = true) {
  const hx = alongX ? 0.9 : 0.075, hz = alongX ? 0.075 : 0.9;
  return K.Bg(x - hx, z - hz, x + hx, z + hz, 0.16, 'ledge', { edges: '' });
}

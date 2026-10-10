/* Financial Core: the shared plan (ground, colour, surface, fine-ground regions, shared numbers).
   Design: levels/porto/design/fin.md section 2 and 4. No geometry here. Parts call fin_plan() for the numbers. */
function fin_plan() {
  const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const colors = { glass: 0x6f8fa8, glass2: 0x5d7489, glass3: 0x8fa7b8, granite: 0xc9b9a3, marble: 0xe8e4da,
    black: 0x3a3d42, gold: 0xd9a93f, brick: 0x9a5e4c, concrete: 0xb8b4ac };
  const ring = { in: 120, road0: 124, road1: 136, out: 140 };
  const alley = { z: -40, depth: 1.6 };
  const HUMPS = [[226, 118, 16, 2.5], [296, 150, 22, 3.2], [236, 186, 14, 2.0]];   // Treasury Gardens
  const Hb = z => 0.974 + 2.026 * (clamp(z, -214, -132) + 214) / 82;                 // Observatory Promenade top
  const Hs = z => 3 * (-76 - clamp(z, -104, -76)) / 28;                               // Spillway top
  const BERM = [                                                                       // [x0, x1, z0, z1, top(z)]
    [214, 226, -214, -132, Hb], [196, 244, -132, -104, () => 3.0], [208, 232, -104, -76, Hs] ];
  const alleyD = x => x >= -380 && x <= -166 ? 1.6
    : x > -166 && x < -146 ? 1.6 * sm((-146 - x) / 20)
    : x > -404 && x < -380 ? 1.6 * sm((x + 404) / 24) : 0;
  function alleyCut(x, z) {
    const D = alleyD(x); if (D <= 0) return 0;
    const dz = Math.abs(z - alley.z);
    if (dz <= 6) return D;
    if (dz <= 10) { const t = (dz - 6) / 4; return D * (1 - t * t); }
    return 0;
  }
  function berm(x, z, g0) {
    let m = -Infinity;
    for (const [x0, x1, z0, z1, top] of BERM) {
      const dx = x < x0 ? x0 - x : x > x1 ? x - x1 : 0, dz = z < z0 ? z0 - z : z > z1 ? z - z1 : 0;
      const s = Math.hypot(dx, dz), D = top(z) - g0; if (D <= 0) continue;
      m = Math.max(m, g0 + D * (1 - sm(s / (2 * D))));
    }
    return m;
  }
  function ground(x, z, base) {
    if (Math.abs(x) <= 120 && Math.abs(z) <= 120) return 0;
    const L = clamp((-140 - z) / 78, 0, 1), g0 = Math.max(base, L);
    let h = g0 - alleyCut(x, z);
    if (x > 180 && x < 260 && z > -220 && z < -70) h = Math.max(h, berm(x, z, g0));
    for (const [cx, cz, r, hh] of HUMPS) { const d = Math.hypot(x - cx, z - cz); if (d < r) h += hh * (1 - sm(d / r)); }
    return h;
  }
  const C = {}; for (const k in colors) C[k] = new THREE.Color(colors[k]);
  const asphalt = new THREE.Color(0x3b3d40), aqua = new THREE.Color(0x8fc4c4), grass = new THREE.Color(0x5f8a4a), paving = new THREE.Color(0xbdb3a4);
  const inBox = (x, z, x0, x1, z0, z1) => x >= x0 && x <= x1 && z >= z0 && z <= z1;
  const onRoad = (x, z) => (inBox(x, z, -107, -93, -230, -136)) || (Math.max(Math.abs(x), Math.abs(z)) >= 124 && Math.max(Math.abs(x), Math.abs(z)) <= 136 && Math.abs(x) <= 136 && Math.abs(z) <= 136)
    || (Math.abs(z) <= 7 && x > 136) || (Math.abs(x + 40) <= 10 && z > 136);
  function col(x, z) {
    if (Math.abs(x) <= 120 && Math.abs(z) <= 120) return null;
    const dza = Math.abs(z - alley.z);
    if (dza < 10 && x >= -404 && x <= -146) return C.concrete;
    if (dza >= 10 && dza <= 16 && x >= -400 && x <= -150) return C.brick;
    if (inBox(x, z, 208, 232, -104, -76)) return aqua;
    if (inBox(x, z, 180, 260, -220, -70)) {                                     // promenade and cascade tops granite, batters concrete
      if (inBox(x, z, 214, 226, -214, -132) || inBox(x, z, 196, 244, -132, -104)) return C.granite;
      if (berm(x, z, 0) > 0.02 && berm(x, z, 0) > Math.max(0, clamp((-140 - z) / 78, 0, 1)) + 0.02) return C.concrete;
    }
    if (inBox(x, z, 0, 80, -165, -140)) return C.marble;
    if (onRoad(x, z)) return asphalt;
    if (inBox(x, z, 196, 346, 60, 214) || inBox(x, z, -86, 0, -165, -140)) return grass;
    return paving;
  }
  function surface(x, z) {
    if (Math.abs(x) <= 120 && Math.abs(z) <= 120) return null;
    if (inBox(x, z, -107, -93, -230, -136) || inBox(x, z, -50, -30, 136, 230) || inBox(x, z, 0, 80, -165, -140) || inBox(x, z, 208, 232, -104, -76)) return 'smooth';
    if (inBox(x, z, 196, 346, 60, 214) || inBox(x, z, -86, 0, -165, -140)) return 'rough';
    if ((Math.max(Math.abs(x), Math.abs(z)) >= 124 && Math.max(Math.abs(x), Math.abs(z)) <= 136 && Math.abs(x) <= 136 && Math.abs(z) <= 136) || (Math.abs(z) <= 7 && x > 136)) return 'rough';
    return null;
  }
  /* [x0, x1, z0, z1, res]: the 0.5 m lip strips first, then the res-1 alley body */
  const regions = [[-408, -136, -56, -48, 0.5], [-408, -136, -32, -24, 0.5], [-408, -136, -56, -24, 1],
    [184, 256, -216, -128, 1], [184, 256, -136, -72, 1], [-112, -88, -224, -136, 2], [-64, -16, 208, 224, 2],
    [208, 248, 96, 136, 1], [272, 320, 128, 176, 1], [216, 256, 168, 200, 1]];
  return { ground, col, surface, regions, sm, ring, alley, hall: { y: 4.0 }, cascade: { y: 3.0 }, colors, HUMPS, Hb, Hs, alleyCut, berm };
}
/* filler helpers shared by the parts (grind-line budget, CONTRACT 8): a planter grinds on its two long edges only,
   a manual pad has no grind edges (it still counts as a box to ollie onto) */
function fin_plant(K, x0, z0, x1, z1, hgt = 0.55) { return K.Bg(x0, z0, x1, z1, hgt, 'ledge', { edges: Math.abs(x1 - x0) >= Math.abs(z1 - z0) ? 'ns' : 'ew' }); }
function fin_padx(K, x0, z0, x1, z1, hgt = 0.18) { return K.Bg(x0, z0, x1, z1, hgt, 'pad', { edges: '' }); }

/* Downtown, on its own: the dense downtown (see buildDowntown) inside a ring boulevard and a wall of buildings. */
function levelCity() {
  const K = cityKit(() => 0, 4242);
  const spots = buildDowntown(K);
  const { street, B, building, pick, col, decorFns, terrainH } = K;
  for (const c of [-130, 130]) { street('z', c, -146, 146, 0, [-130, 130, -40, 40], {}); street('x', c, -146, 146, 0, [-130, 130, -40, 40], {}); }
  // the buildings round the outside, and the corners
  for (const s of [-1, 1]) for (let u = -146; u < 146; u += 14) {
    const h = pick([4, 5, 6, 8, 10]);
    if (Math.abs(u + 7 - 40) < 9 || Math.abs(u + 7 + 40) < 9) continue;                    // the avenues run on out of sight
    building(u, s > 0 ? 140 : -152, u + 13, s > 0 ? 152 : -140, h); building(s > 0 ? 140 : -152, u, s > 0 ? 152 : -140, u + 13, h);
  }
  for (const a of [-40, 40]) for (const s of [-1, 1]) B(a - 6, -1, s > 0 ? 146 : -150, a + 6, 3, s > 0 ? 150 : -146, 'fence'), B(s > 0 ? 146 : -150, -1, a - 6, s > 0 ? 150 : -146, 3, a + 6, 'fence');
  const C = c => new THREE.Color(c);
  const concrete = C(0xb3afa6), grass = C(0x7d9a5b), dirtC = C(0x8f7a5a), plaza = C(0xc4bfb5), poolC = C(0xb7b8b2), tile = C(0x3d7fae), dark = C(0x9e9a92);
  const groundCol = (x, z, h) => {
    const dc = K.dtCol(x, z); if (dc) return dc;
    if (x < -64 && z > 66 && Math.hypot(x + 92, z - 94) < 26) return Math.abs(x + 92) < 1.6 && z < 90 ? concrete : grass;  // the knoll, with a path down the north face
    if (x > 74 && z > 52) return dirtC;                                                    // the construction site
    if (x > 49 && z > -31 && z < 31) return dark;                                          // under the overpass
    if (Math.abs(x) < 31 && Math.abs(z) < 31) return plaza;
    return concrete;
  };
  const poolCol = (x, z, h) => { const g = 0.15; return h > g - 0.32 && h < g - 0.015 ? tile : h < g - 0.015 ? poolC : groundCol(x, z, h); };
  const regions = K.regionsFor({ x0: -152, x1: 152, z0: -152, z1: 152 }, 4, groundCol, poolCol);
  return {
    terrainH, surface: K.dtSurface, regions, boxes: K.boxes, hubbas: K.hubbas, rails: K.rails, hazards: K.hazards, districts: spots, spots, challenges: K.challenges, tapes: K.tapes, shop: K.shop, shops: K.shops, npcs: K.npcs,
    traffic: [...K.traffic, ...K.ringTraffic], peds: [...K.peds, ...K.ringPeds],
    spawn: spots.find(s => s.name === 'Central Plaza'), bounds: [-146, 146, -146, 146], fog: [70, 230], far: 260, sky: 0xa9c8de,
    decor(D) { for (const f of decorFns) f(D); },
  };
}


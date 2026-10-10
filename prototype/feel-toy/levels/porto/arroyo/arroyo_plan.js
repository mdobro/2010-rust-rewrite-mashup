/* The Arroyo: the shared plan (heights, channel, ground, colour, surface, regions, roads, door and grate lists).
   Design: levels/porto/design/arroyo.md sections 2, 3.3, 4.5 and 11. No geometry here. Parts call arroyo_plan(). */
function arroyo_plan() {
  const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const B = z => portoBaseH(-700, z);
  const FK = [[-214, B(-214)], [232, -14.5], [560, -29.0], [894, B(894)]];
  const lin = z => {
    if (z <= FK[0][0]) return FK[0][1];
    for (let i = 1; i < FK.length; i++) if (z <= FK[i][0]) {
      const [z0, h0] = FK[i - 1], [z1, h1] = FK[i];
      return h0 + (h1 - h0) * (z - z0) / (z1 - z0);
    }
    return FK[FK.length - 1][1];
  };
  // smoothed floor line; samples beyond the ends use the base so the floor meets the gates without a step
  const lin2 = z => (z <= -214 || z >= 894) ? B(z) : lin(z);
  const F = z => {
    if (z <= -214 || z >= 894) return B(z);
    let s = 0; for (const o of [-16, -8, 0, 8, 16]) s += lin2(z + o);
    return Math.min(B(z), s / 5);
  };
  const CH = { cx: -700, floorHalf: 20, wallW: 16 };
  const SLOT = [[-152, 104], [219, 846]];
  const SUMP = { x0: -720, x1: -698, z0: 594, z1: 602, depth: 1.2 };
  const TRIB = { z: -40, x0: -680, x1: -436, flat: 3, bank: 8 };
  const HUMP = { x0: -965, x1: -870, z0: -190, z1: -110, peak: 3.0 };
  const SLAG = { x: -860, z: 716, r: 12, peak: 4 };
  const GRAVEL = [{ x: -834, z: 610, r: 5, peak: 1.6 }, { x: -834, z: 636, r: 5, peak: 1.4 }];
  const slotDepth = (x, z) => {
    const ax = Math.abs(x + 700); if (ax >= 2) return 0;
    let t = 0;
    for (const [z0, z1] of SLOT) if (z >= z0 && z <= z1) t = Math.max(t, clamp((z - z0) / 2, 0, 1) * clamp((z1 - z) / 2, 0, 1));
    return t * 1.2 * (1 - clamp(ax - 1, 0, 1));
  };
  // the tributary ditch (Planter Run) height, or null off it
  const trib = (x, z) => {
    if (x < TRIB.x0 || x > TRIB.x1) return null;
    const dz = Math.abs(z - TRIB.z); if (dz >= TRIB.bank) return null;
    const t = clamp((-436 - x) / 244, 0, 1), T = F(z) * t;
    return dz <= TRIB.flat ? T : T + (0 - T) * (dz - TRIB.flat) / (TRIB.bank - TRIB.flat);
  };
  const inR = (r, x, z) => x >= r[0] && x <= r[1] && z >= r[2] && z <= r[3];
  // the channel floor/walls/slot/sump (no tributary): the main section at (x, z)
  const channel = (x, z) => {
    const b = B(z), ax = Math.abs(x + 700);
    if (ax >= 36) return b;
    const f = F(z); let h;
    if (ax <= 20) h = f; else h = f + (b - f) * (ax - 20) / 16;
    h -= slotDepth(x, z);
    if (x >= SUMP.x0 && x <= SUMP.x1 && z >= SUMP.z0 && z <= SUMP.z1) {
      const d = Math.min(x - SUMP.x0, z - SUMP.z0, SUMP.z1 - z);   // the east side joins the slot
      h = Math.min(h, f - SUMP.depth * clamp(d, 0, 1));
    }
    return h;
  };
  const roads = {
    // axis 'z': runs along z at x = c; axis 'x': runs along x at z = c. hw = half the road width, sw = sidewalk width.
    // flat: [from, to] along the run where the base is level (K.street); past it the road slopes with the base.
    mill:      { name: 'Mill Street',      axis: 'z', c: -800, a0: -164, a1: 862, hw: 6, sw: 4, flat: [-164, 206] },
    levee:     { name: 'Levee Road',       axis: 'z', c: -638, a0: -164, a1: 862, hw: 6, sw: 4, flat: [-164, 206] },
    gasworks:  { name: 'Gasworks Lane',    axis: 'z', c: -470, a0: -16,  a1: 862, hw: 6, sw: 4, flat: [-16, 206] },
    run:       { name: 'Run Street',       axis: 'x', c: -16,  a0: -632, a1: -464, hw: 6, sw: 4, flat: [-632, -464] },
    viaduct:   { name: 'Viaduct Road',     axis: 'x', c: 160,  a0: -794, a1: -476, hw: 6, sw: 4, flat: [-794, -476], deck: [-736, -664] },
    yard:      { name: 'Yard Street',      axis: 'x', c: 214,  a0: -880, a1: -806, hw: 6, sw: 4 },
    foundry:   { name: 'Foundry Road',     axis: 'z', c: -880, a0: 214,  a1: 862, hw: 6, sw: 4 },
    ford:      { name: 'Ford Road',        axis: 'x', c: -170, a0: -810, a1: -628, hw: 6, sw: 0, ford: [-736, -664], flat: [-810, -628] },
    outfall:   { name: 'Outfall Road',     axis: 'x', c: 862,  a0: -886, a1: -464, hw: 6, sw: 4, ford: [-736, -664] },
    footwalkW: { name: 'Footbridge Walk',  axis: 'x', c: 520,  a0: -790, a1: -752, hw: 4, sw: 0, walk: true },
    footwalkE: { name: 'Footbridge Walk',  axis: 'x', c: 520,  a0: -648, a1: -420, hw: 4, sw: 0, walk: true },
  };
  const grates = [-136, -104, -72, -40, -8, 24, 56, 88, 248, 280, 312, 344, 376, 408, 440, 472, 504, 536, 568, 640, 672, 704, 736, 768, 800, 832];
  const headwalls = [[-158, -152], [101, 104], [216, 219], [846, 850]];
  const popsW = [-140, -84, -52, 8, 72, 300, 352, 640, 700], popsE = [-124, -68, -12, 52, 330, 680, 720];
  const doors = {   // [side, z (uphill edge)]
    upper: [['E', 0], ['W', 40], ['W', 240], ['E', 280], ['W', 320]],
    lower: [['W', 420], ['W', 470], ['E', 500], ['E', 560], ['W', 700], ['E', 740]],
  };
  const tracks = [-952, -938, -924, -910, -896, -882];
  const REGIONS = [
    [-704, -696, -152, 104, 1], [-704, -696, 216, 584, 1], [-704, -696, 608, 848, 1], [-728, -696, 584, 608, 1],
    [-688, -432, -48, -32, 1], [-968, -864, -192, -104, 4], [-880, -840, 696, 736, 2], [-848, -816, 600, 648, 2],
    [-1000, -968, -230, 910, 4],   // the map-edge hills (not in the doc): they bend inside 8 m
  ];
  /* the ground: h comes in as the base */
  const terrain = (x, z, h) => {
    if (x < -1000 || x > -420 || z < -230 || z > 910) return h;
    let g = h;
    const ax = Math.abs(x + 700);
    if (ax < 36 && z > -214 && z < 894) g = channel(x, z);
    const tb = trib(x, z); if (tb !== null) g = Math.min(g, tb);
    if (x > HUMP.x0 && x < HUMP.x1 && z > HUMP.z0 && z < HUMP.z1) {
      const along = z < -160 ? sm((z - HUMP.z0) / 30) : z <= -150 ? 1 : sm((HUMP.z1 - z) / 40);
      const across = sm((x - HUMP.x0) / 6) * sm((HUMP.x1 - x) / 6);
      g += HUMP.peak * along * across;
    }
    { const r = Math.hypot(x - SLAG.x, z - SLAG.z); if (r < SLAG.r) g += SLAG.peak * sm(1 - r / SLAG.r); }
    for (const p of GRAVEL) { const r = Math.hypot(x - p.x, z - p.z); if (r < p.r) g += p.peak * sm(1 - r / p.r); }
    return g;
  };
  /* ground colour and surface */
  const C = c => new THREE.Color(c);
  const cFloor = C(0xbab5a9), cWall = C(0xa7a296), cSlot = C(0x6d7467), cAsph = C(0x4b4e53), cFord = C(0x6a6c6a), cWalk = C(0xb9b1a3),
    cYard = C(0x8c8475), cTies = C(0x6b5a48), cLot = C(0xaaa597), cLawn = C(0x8b9a5c), cDirt = C(0x9d9179), cSlag = C(0x4e4b48), cGrav = C(0x9a9486);
  const onRoad = (R, x, z) => {
    const u = R.axis === 'z' ? x : z, v = R.axis === 'z' ? z : x;
    return Math.abs(u - R.c) <= R.hw && v >= R.a0 && v <= R.a1;
  };
  const lawn = [-620, -490, 740, 850];
  const col = (x, z, h) => {
    const ax = Math.abs(x + 700);
    if (ax < 36 && z > -214 && z < 894) {
      if (slotDepth(x, z) > 0.05) return cSlot;
      if (x >= SUMP.x0 && x <= SUMP.x1 && z >= SUMP.z0 && z <= SUMP.z1) return cSlot;
      return ax <= 20.01 ? cFloor : cWall;
    }
    if (trib(x, z) !== null && x >= -680) return z > -48 && z < -32 ? cFloor : cWall;
    const bz = B(z), dry = Math.abs(h - bz) < 1.5;
    for (const k in roads) {
      const R = roads[k]; if (!onRoad(R, x, z)) continue;
      const v = R.axis === 'z' ? z : x;
      if (R.walk) return cWalk;
      if (R.ford && v >= R.ford[0] && v <= R.ford[1]) return cFord;
      if (dry) return cAsph;
    }
    if (h > bz + 0.3 && x < -862 && x > -975 && z < -100) return cYard;       // the hump
    for (const tx of tracks) if (Math.abs(x - tx) < 1.3 && z > -200 && z < 206) return cTies;
    if (inR([-975, -810, -200, 206], x, z)) return cYard;                        // Seco Yard gravel
    if (inR(lawn, x, z)) return cLawn;
    if (Math.hypot(x - SLAG.x, z - SLAG.z) < SLAG.r) return cSlag;
    for (const p of GRAVEL) if (Math.hypot(x - p.x, z - p.z) < p.r) return cGrav;
    if (x < -810) return inR([-975, -880, 560, 700], x, z) || inR([-975, -850, 700, 850], x, z) ? cLot : cDirt;
    if (x > -460) return cDirt;
    return cLot;
  };
  const surface = (x, z) => {
    if (Math.abs(x + 700) < 36 && z > -214 && z < 894) return 'smooth';
    if (inR(lawn, x, z)) return 'rough';
    if (inR([-975, -810, -200, 206], x, z)) return 'rough';
    if (Math.hypot(x - SLAG.x, z - SLAG.z) < SLAG.r) return 'rough';
    for (const p of GRAVEL) if (Math.hypot(x - p.x, z - p.z) < p.r) return 'rough';
    return null;
  };
  return { sm, B, F, lin, FK, CH, SLOT, SUMP, TRIB, HUMP, SLAG, GRAVEL, slotDepth, trib, channel, roads, grates, headwalls, popsW, popsE, doors,
    tracks, REGIONS, terrain, col, surface, lawn, onRoad };
}
/* the ground hook index.js hands to P.ground (the doc's arroyo_terrain) */
function arroyo_terrain(PL, x, z, h) { return PL.terrain(x, z, h); }

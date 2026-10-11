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
    { id: 'crosstown',   name: 'Crosstown Street',    a: 'old',     b: 'east',   at: [300, 560],   dir: 'z', w: 16, level: 72 },
    { id: 'footbridge',  name: 'Arroyo Footbridge',   a: 'old',     b: 'arroyo', at: [-420, 520],  dir: 'z', w: 8 },
    { id: 'spillway',    name: 'Spillway Outlet',     a: 'arroyo',  b: 'bw',     at: [-700, 910],  dir: 'x', w: 24 },
    { id: 'steep',       name: 'Old Town Steep',      a: 'old',     b: 'bw',     at: [-200, 910],  dir: 'x', w: 16 },
    { id: 'hillbomb',    name: 'Eastside Hill Bomb',  a: 'east',    b: 'ship',   at: [600, 910],   dir: 'x', w: 16 },
    { id: 'harbourRd',   name: 'Harbour Road',        a: 'bw',      b: 'ship',   at: [0, 1020],    dir: 'z', w: 16 },
    { id: 'boardwalk',   name: 'The Boardwalk',       a: 'bw',      b: 'ship',   at: [0, 1150],    dir: 'z', w: 12 },
  ],
  // level: N on a 'z' gate (an east-west street crossing a north-south border, across the fall line) levels the base across
  // the street there: within N metres north and south of the gate the profile is read at a remapped z that holds still across
  // the gate's width and catches up by N (see portoBaseH). Without it the border band would tilt the street by the profile's
  // grade (6 % in Old Town / Eastside), since both districts meet the plain base at the border.
  GATE_DEPTH: 16, BAND: 12,
  // the height of the land along z, from the ridge down to the quay (smoothed where the grade changes)
  profile: [[-650, 44], [-560, 44], [-262, 3], [-218, 0], [230, 0], [880, -40], [1180, -42]],
};
// the land before any district shapes it: the profile, the sea past the quay, and a ridge of hills
// round the three sides that aren't the sea, so the map has edges you can see
function portoBaseH(x, z) {
  // levelled gates: z → zc + D·p(|z - zc|/D), p(t) = 3t³ - 2t⁴ (p(0) = p'(0) = 0, p(1) = p'(1) = 1, so it joins the plain
  // profile smoothly at D; with D 72 the grade is 0.6 % at the gate's edge and 1.3 % at 12 m, and peaks at 1.7× the profile's at 0.75 D,
  // well past the districts' own street shoulders).
  // Full strength within GATE_DEPTH of the border, eased out over the next 20 m east and west.
  for (const g of PORTO.gates) {
    if (!g.level || g.dir !== 'z') continue;
    const [gx, gz] = g.at, D = g.level, dz = z - gz, ax = Math.abs(x - gx) - PORTO.GATE_DEPTH;
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
  const GROUND = {}, COL = {}, SURF = {};
  function baseH(x, z) {
    const b = portoBaseH(x, z), id = districtAt(x, z), g = id && GROUND[id];
    if (!g) return b;
    const w = sm(bandDist(PORTO.districts[id].rect, x, z) / PORTO.BAND);
    return w <= 0 ? b : lerp(b, g(x, z, b), w);
  }
  const K = cityKit(baseH, 20261010);
  K.shops = []; K.challenges = []; K.tapes = []; K.traffic = []; K.ringTraffic = []; K.peds = []; K.ringPeds = []; K.npcs = [];
  K.dtCol = () => null; K.dtSurface = () => null;

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
  for (let x = BX0; x < BX1; x += TILE) for (let z = TZ0; z < TZ1; z += TILE)
    regions.push({ x0: x, x1: Math.min(BX1, x + TILE), z0: z, z1: Math.min(TZ1, z + TILE), res: 8, col: groundCol, skip: [...XR, ...F] });
  for (const r of XR) regions.push({ x0: r.x0, x1: r.x1, z0: r.z0, z1: r.z1, res: r.res, col: groundCol, skip: [...F, ...XR.filter(o => o !== r && o.res < r.res && o.x0 >= r.x0 && o.x1 <= r.x1 && o.z0 >= r.z0 && o.z1 <= r.z1)] });
  for (const f of F) regions.push({ x0: f.x0, x1: f.x1, z0: f.z0, z1: f.z1, res: f.res, col: f.kind === 'pool' ? poolCol(f.y0) : groundCol, skip: F.filter(o => o !== f && o.x0 >= f.x0 && o.x1 <= f.x1 && o.z0 >= f.z0 && o.z1 <= f.z1 && o.res < f.res) });

  /* ---------- fast travel, spawn ---------- */
  const order = { district: 0, park: 1, spot: 2 };
  fast.sort((a, b) => order[a.kind] - order[b.kind]);
  const fallback = (() => { const id = built[0] || 'fin', r = PORTO.districts[id].rect, x = (r[0] + r[1]) / 2, z = (r[2] + r[3]) / 2; return { name: PORTO.districts[id].name, pos: V(x, K.terrainH(x, z), z), yaw: 0 }; })();
  const travel = fast.length ? fast : [fallback];
  return {
    terrainH: K.terrainH, baseH: portoBaseH, PORTO, built,
    surface: (x, z) => { const id = districtAt(x, z), f = id && SURF[id]; return (f && f(x, z)) || K.dtSurface(x, z) || 'smooth'; },
    regions, boxes: K.boxes, hubbas: K.hubbas, rails: K.rails, hazards: K.hazards,
    districts: travel, spots, lines, challenges, tapes, shop: K.shops[0] || undefined, shops: K.shops.filter(Boolean), npcs, traffic, peds,
    landmarks, water, seaZ: PORTO.seaZ,
    spawn: travel[0], spawnShop: 'Corner Skate Shop', bounds: [BX0 + 5, BX1 - 5, BZ0 + 5, BZ1 - 5],
    fog: [160, 460], far: 2800, cullDist: 480, simDist: 280, sky: 0xa9c8de,
    decor(D) { for (const f of K.decorFns) f(D); },
  };
}

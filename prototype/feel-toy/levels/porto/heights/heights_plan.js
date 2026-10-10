/* The Heights (heights): shared numbers, the ground, its colour and surface. Design: levels/porto/design/heights.md section 2. No geometry here. */
function heights_plan() { return {
  RIDGE: { z: -596, y: 44, x0: -968, x1: 960, rw: 5, sw: 3 },        // flat on the plateau
  // benches: flat |z-zc| <= f at B0(zc), linear ramp back to the base over r; full for x0..x1, faded to 0 over `fade`
  BENCHES: [
    { id: 'lane',   zc: -392, f: 8,  r: 24, x0: -912, x1: -316, fade: 16 },   // Reservoir Lane, y 20.89
    { id: 'tank',   zc: -472, f: 24, r: 24, x0: -872, x1: -776, fade: 16 },   // Water Tank terrace, y 31.89
    { id: 'upper',  zc: -520, f: 8,  r: 24, x0: 496,  x1: 960,  fade: 16 },   // Upper Terrace, y 38.50
    { id: 'middle', zc: -440, f: 8,  r: 24, x0: 496,  x1: 960,  fade: 16 },   // Middle Terrace, y 27.49
    { id: 'lower',  zc: -360, f: 8,  r: 24, x0: 496,  x1: 960,  fade: 16 },   // Lower Terrace, y 16.48
  ],
  // the lane's dip (ford) through the culvert: x ramps xa..xb, full depth xb..xc, ramps xc..xd; z full |d|<=f, ramp r
  DIP: { zc: -392, xa: -760, xb: -720, xc: -680, xd: -640, depth: 2.5, f: 6, r: 8 },
  // Switchback Road: 4 legs (corridor |z-z_k| <= half), each linear in x between xW and xE (clamped beyond)
  SW: { legs: [ { z: -536, yW: 38.8, yE: 43.6 }, { z: -464, yW: 37.4, yE: 28.6 },
                { z: -392, yW: 18.2, yE: 27.0 }, { z: -320, yW: 16.6, yE: 8.6 } ],
        xW: -272, xE: -112, half: 8, north: [-584, -544], south: [-312, -248], zoneX: [-316, -68], blend: 48,
        hairpins: [ { c: [-272, -500], side: 'W' }, { c: [-112, -428], side: 'E' }, { c: [-272, -356], side: 'W' } ],
        R: 36, entry: { c: [-112, -572], R: 36 }, exit: { c: [-132, -288], R: 32 }, chuteX: -100 },
  // Drainage Culvert: floor half-width 4, walls 8 wide each side; depth profile below
  CUL: { x: -700, floor: 4, wall: 8, head: [-584, -560], full: 3, lipStart: -440, lipZ: -402, lipD: 1,
         laneN: -398, laneS: -386, landSlope: 0.30, apron: [-296, -248] },
  POOL: { cx: -824, cz: -472, R: 21, depth: 4.4, y0: 31.89 },
  PODIUM: { x0: 236, x1: 300, z0: -470, z1: -418, top: 31.8 },
  DECKS: [ { z0: -540, z1: -516, top: 41.29 }, { z0: -512, z1: -488, top: 37.53 }, { z0: -484, z1: -460, top: 33.68 } ], // x 128..204
  ROADS: [ // sloped road centrelines (for P.col asphalt + P.surface 'smooth'), [x,z] polylines, half-width hw
    { id: 'tank',    hw: 4, pts: [[-904, -588], [-904, -399]] },
    { id: 'obs',     hw: 5, pts: [[220, -588], [220, -230]] },
    { id: 'planet',  hw: 4, pts: [[268, -588], [268, -470]] },
    { id: 'descent', hw: 5, pts: [[650, -588], [650, -230]] },
    { id: 'crest',   hw: 4, pts: [[872, -588], [872, -368]] },
    { id: 'chute',   hw: 5, pts: [[-100, -288], [-100, -230]] },
    { id: 'laneE',   hw: 4, pts: [[-364, -392], [-272, -392]] },     // the lane's drop to the switchback
    { id: 'dip',     hw: 4, pts: [[-768, -392], [-632, -392]] } ],   // + the switchback legs, hairpins and arcs from SW
}; }
function heights_terrain(PL, baseH) {
  const B0 = z => baseH(0, z), sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const S = PL.SW, C = PL.CUL, D = PL.DIP;
  const fadeX = (b, x) => clamp((x - (b.x0 - b.fade)) / b.fade, 0, 1) * clamp((b.x1 + b.fade - x) / b.fade, 0, 1);
  function benchOff(b, x, z, base) {              // 1. benches (added to h)
    const d = z - b.zc, ad = Math.abs(d); if (ad >= b.f + b.r) return 0; const w = fadeX(b, x); if (!w) return 0;
    const yc = B0(b.zc);
    const off = ad <= b.f ? yc - base                                  // flat top at B0(zc)
                          : (yc - B0(b.zc + Math.sign(d) * b.f)) * (b.f + b.r - ad) / b.r;  // linear ramp back
    return off * w; }
  function dip(x, z) {                            // 2. the lane's ford (subtracted)
    const ax = x < D.xa || x > D.xd ? 0 : x < D.xb ? (x - D.xa) / (D.xb - D.xa) : x <= D.xc ? 1 : (D.xd - x) / (D.xd - D.xc);
    if (!ax) return 0; const ad = Math.abs(z - D.zc);
    return D.depth * ax * (ad <= D.f ? 1 : ad >= D.f + D.r ? 0 : (D.f + D.r - ad) / D.r); }
  const L = (k, x) => { const g = S.legs[k], t = (clamp(x, S.xW, S.xE) - S.xW) / (S.xE - S.xW); return lerp(g.yW, g.yE, t); };
  function field(x, z, h0) {                      // 3. the switchback field F
    const lg = S.legs, hf = S.half;
    if (z <= S.north[0]) return h0;
    if (z < lg[0].z - hf) return lerp(L(0, x), h0, (lg[0].z - hf - z) / (lg[0].z - hf - S.north[0]));
    for (let k = 0; k < 4; k++) {
      if (Math.abs(z - lg[k].z) <= hf) return L(k, x);                 // on a leg: flat across, linear along
      if (k < 3 && z > lg[k].z + hf && z < lg[k + 1].z - hf)            // an embankment between two legs
        return lerp(L(k, x), L(k + 1, x), (z - (lg[k].z + hf)) / ((lg[k + 1].z - hf) - (lg[k].z + hf)));
    }
    if (z < S.south[1]) return lerp(L(3, x), h0, (z - S.south[0]) / (S.south[1] - S.south[0]));
    return h0; }
  function culvertD(z) {                          // depth of the channel floor below B0(z)
    if (z < C.head[0] || z > C.apron[1]) return 0;
    if (z < C.head[1]) return C.full * (z - C.head[0]) / (C.head[1] - C.head[0]);   // the drop-in: 0 -> 3 m
    if (z < C.lipStart) return C.full;
    if (z <= C.lipZ) return lerp(C.full, C.lipD, (z - C.lipStart) / (C.lipZ - C.lipStart)); // shallows to the lip
    if (z < C.apron[0]) return C.full;
    return C.full * (C.apron[1] - z) / (C.apron[1] - C.apron[0]); }                 // the apron: 3 -> 0
  const ground = (x, z, base) => {
    let h = base;
    for (const b of PL.BENCHES) h += benchOff(b, x, z, base);
    h -= dip(x, z);
    const [zx0, zx1] = S.zoneX;
    if (x > zx0 - S.blend && x < zx1 + S.blend && z > S.north[0] && z < S.south[1]) {
      const out = Math.max(0, zx0 - x, x - zx1); h = lerp(field(x, z, h), h, sm(out / S.blend)); }
    const ax = Math.abs(x - C.x);                 // 4. the culvert (replaces h inside |x+700| < 12)
    if (ax < C.floor + C.wall && z > C.head[0] && z < C.apron[1]) {
      const g = h;                                                     // the grade beside the channel
      if (z > C.lipZ && z < C.laneN)                                   // under the headwall box: lip down to the lane
        return Math.min(h, lerp(B0(C.lipZ) - C.lipD, h, (z - C.lipZ) / (C.laneN - C.lipZ)));
      if (z >= C.laneN && z <= C.laneS) return h;                      // the lane fords straight through
      let floor;
      if (z > C.laneS && z < C.laneS + 20) floor = Math.max(B0(z) - C.full, (B0(D.zc) - D.depth) - C.landSlope * (z - C.laneS)); // the landing
      else floor = B0(z) - culvertD(z);
      const wr = ax <= C.floor ? 0 : (ax - C.floor) / C.wall;          // walls: straight 8 m banks up to grade
      return Math.min(g, lerp(floor, g, wr)); }
    return h; };
  // 5. the map-edge hills (|x| > 968, z < -620: base only, nothing of ours there) are ridden as the 4 m chords the res-4 mesh
  //    draws, so the drawn hill never stands over the ridden one (the hills bend too fast for res 4 otherwise)
  const gz = (x, z) => { if (z >= -620) return ground(x, z, baseH(x, z));
    const z0 = Math.floor(z / 4) * 4; return lerp(ground(x, z0, baseH(x, z0)), ground(x, z0 + 4, baseH(x, z0 + 4)), (z - z0) / 4); };
  return (x, z, base) => {
    if (z >= -620 && Math.abs(x) <= 968) return ground(x, z, base);
    if (Math.abs(x) <= 968) return gz(x, z);
    const x0 = Math.floor(x / 4) * 4; return lerp(gz(x0, z), gz(x0 + 4, z), (x - x0) / 4); };
}

/* what the ground is: one zone key per point, shared by colour and surface. T(x, z) is the final ground (for the bank slope test). */
function heights_zone(PL, T, x, z) {
  const S = PL.SW, C = PL.CUL, inLane = z >= C.laneN && z <= C.laneS;
  if (Math.abs(x - C.x) < 12 && z >= -584 && z <= -248 && !inLane) return 'culvert';
  if (x >= -830 && x <= -818 && z >= -448 && z <= -400) return 'culvert';
  if (x >= -896 && x <= -872 && z >= -475 && z <= -469) return 'gravel';
  for (const r of PL.ROADS) {
    for (let i = 0; i + 1 < r.pts.length; i++) {
      const a = r.pts[i], b = r.pts[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], L2 = dx * dx + dz * dz;
      const t = clamp(((x - a[0]) * dx + (z - a[1]) * dz) / L2, 0, 1);
      if (Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz) <= r.hw) return 'asphalt';
    } }
  if (inLane && Math.abs(x - C.x) < 12) return 'asphalt';
  for (let k = 0; k < 4; k++) {                                   // the legs
    const xe = k === 3 ? -132 : S.xE;
    if (x >= S.xW && x <= xe && Math.abs(z - S.legs[k].z) <= 5) return 'asphalt'; }
  for (const h of S.hairpins) {                                   // hairpins: the outer half
    const d = Math.hypot(x - h.c[0], z - h.c[1]);
    if (Math.abs(d - S.R) <= 5 && (h.side === 'W' ? x <= h.c[0] : x >= h.c[0])) return 'asphalt'; }
  { const e = S.entry, d = Math.hypot(x - e.c[0], z - e.c[1]);    // entry arc: (-76,-572) -> (-112,-536)
    if (Math.abs(d - e.R) <= 5 && x >= e.c[0] && z >= e.c[1]) return 'asphalt'; }
  { const e = S.exit, d = Math.hypot(x - e.c[0], z - e.c[1]);     // exit arc: (-132,-320) -> (-100,-288)
    if (Math.abs(d - e.R) <= 5 && x >= e.c[0] && z <= e.c[1]) return 'asphalt'; }
  if (x >= -81 && x <= -71 && z >= -596 && z <= -572) return 'asphalt';
  if (T && x > S.zoneX[0] && x < S.zoneX[1] && z > S.north[0] && z < S.south[1]) {   // banks between the legs
    let onLeg = false; for (const g of S.legs) if (Math.abs(z - g.z) <= S.half) onLeg = true;
    if (!onLeg && Math.abs(T(x, z + 1) - T(x, z - 1)) / 2 > 0.15) return 'bank'; }
  return null;
}
function heights_col(PL, T) {
  const CC = { culvert: new THREE.Color(0xb3afa6), asphalt: new THREE.Color(0x56585d), bank: new THREE.Color(0xa9a59c), gravel: new THREE.Color(0x9b8f7a) };
  return (x, z, h) => { const k = heights_zone(PL, T, x, z); return k ? CC[k] : null; };
}
function heights_surface(PL, T) {
  return (x, z) => { const k = heights_zone(PL, T, x, z); return k === 'gravel' ? 'rough' : k ? 'smooth' : null; };
}

/* Eastside Hills: the shared plan (ground, colour, regions) and the sloped-sidewalk helper. See design/east.md section 2. */
function east_plan() {
  const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const base = (x, z) => portoBaseH(x, z);
  const inR = (r, x, z) => x >= r[0] && x <= r[1] && z >= r[2] && z <= r[3];
  /* ---- the level cross streets (east-west), benched into the hill ---- */
  const ST = {
    crest:     { name: 'Crest Road',       c: 280, x0: 400, x1: 830, rw: 6, sw: 4 },
    orchard:   { name: 'Orchard Street',   c: 430, x0: 400, x1: 830, rw: 6, sw: 4 },
    crosstown: { name: 'Crosstown Street', c: 560, x0: 300, x1: 910, rw: 7, sw: 5 },
    mesaW:     { name: 'Mesa Street',      c: 700, x0: 400, x1: 578, rw: 5, sw: 4 },
    mesaE:     { name: 'Mesa Street',      c: 700, x0: 622, x1: 830, rw: 5, sw: 4 },
    bayview:   { name: 'Bayview Road',     c: 840, x0: 330, x1: 975, rw: 6, sw: 4 },
  };
  /* ---- the north-south streets: on the natural grade (6.15 %), no ground work ---- */
  const NS = {
    vista:   { name: 'Vista Street',    x: 410, z0: 270, z1: 850, rw: 6, sw: 4 },
    terrace: { name: 'Terrace Avenue',  x: 820, z0: 270, z1: 850, rw: 6, sw: 4 },
    back:    { name: 'Back Lane',       x: 340, z0: 300, z1: 832, rw: 3, sw: 0 },
    larch:   { name: 'Larch Lane',      z: 360, x0: 830, x1: 970, rw: 4, sw: 0 },   // E-W, level by nature (base depends on z only)
  };
  const STL = Object.values(ST), BL = 24, BT = 20;
  function warpZ(x, z) {
    for (const s of STL) {
      const u = Math.abs(z - s.c), hw = s.rw + s.sw; if (u >= hw + BL) continue;
      const dx = x < s.x0 ? s.x0 - x : x > s.x1 ? x - s.x1 : 0; if (dx >= BT) continue;
      const w = u <= hw ? 0 : u * sm((u - hw) / BL), e = 1 - sm(dx / BT);
      return s.c + Math.sign(z - s.c) * lerp(u, w, e);
    }
    return z;
  }
  const baseW = (x, z) => base(x, warpZ(x, z));
  /* ---- the Hill Bomb ---- */
  const BOMB = { x: 600, rw: 7, sw: 4, campusX: 650, zTop: 292, z0: 392, bendA: [587.5, 292], bendB: [662.5, 392], r: 62.5 };
  // knots: [z, grade] runs from z 250 (at base), then two fixed heights (the Plunge ends at -31.92, the gate end at base)
  const KN = (() => { const segs = [[292, 0.02], [392, 0.035], [418, 0.05], [442, 0.02], [536, 0.05], [584, 0.03]];
    let z = 250, y = base(600, 250); const k = [[z, y]];
    for (const [z1, s] of segs) { y -= s * (z1 - z); z = z1; k.push([z, y]); }
    k.push([720, -31.92], [894, base(600, 894)]); return k; })();
  const ylin = z => { if (z <= KN[0][0] || z >= KN[KN.length - 1][0]) return base(600, z);
    for (let i = 1; i < KN.length; i++) if (z <= KN[i][0]) return lerp(KN[i - 1][1], KN[i][1], (z - KN[i - 1][0]) / (KN[i][0] - KN[i - 1][0])); };
  const bombY = z => (ylin(z - 8) + ylin(z - 4) + ylin(z) + ylin(z + 4) + ylin(z + 8)) / 5;
  const bombX = z => z <= 292 ? 650 : z <= 342 ? 587.5 + Math.sqrt(62.5 ** 2 - (z - 292) ** 2) : z < 392 ? 662.5 - Math.sqrt(62.5 ** 2 - (392 - z) ** 2) : 600;
  function bombDist(x, z) {           // distance to the bomb's centre line (Campus Drive, the Crest Bend, the straight)
    let d = Infinity;
    if (z <= 292) d = Math.min(d, Math.abs(x - 650));
    if (z >= 392) d = Math.min(d, Math.abs(x - 600));
    { const dx = x - 587.5, dz = z - 292, a = Math.atan2(dz, dx); if (a >= 0 && a <= 0.9273) d = Math.min(d, Math.abs(Math.hypot(dx, dz) - 62.5)); }
    { const dx = x - 662.5, dz = z - 392, a = Math.atan2(-dz, -dx); if (a >= 0 && a <= 0.9273) d = Math.min(d, Math.abs(Math.hypot(dx, dz) - 62.5)); }
    return Math.min(d, Math.hypot(x - 650, z - 292), Math.hypot(x - 600, z - 392));
  }
  function ridgeK(x, z, R) {
    const dx = Math.abs(x - bombX(z));
    if (R >= 0) return dx <= 20 ? 1 : 1 - sm((dx - 20) / Math.max(12, 15 * R));
    return dx <= 13 ? 1 : 1 - sm((dx - 13) / 6);                  // the Chute: banks dx 13..19
  }
  const CUT = { z: 560, hw: 12, x0: 300, x1: 910, y: base(600, 560) };   // y -20.31
  const NOTCH = [617, 629, 528, 548];                                     // the Bridge Steps slot
  const DECK = { z0: 546, z1: 574, x0: 589, x1: 611 };
  /* ---- the Hillside Park terraces ---- */
  const PARK = { x0: 840, x1: 960, z0: 446, z1: 538, cuts: [476, 507], y: [-14.22, -16.09, -18.00] };
  /* ---- pads: level (or planar) platforms. m = soft margins [w, e, n, s]; 0 = a hard edge that a box covers ---- */
  const PADS = [
    { name: 'forecourt', r: [846, 906, 538, 548], y: -20.16, m: [6, 6, 0, 0] },
    { name: 'school',    r: [424, 488, 578, 666], prof: [[578, -23.0], [618, -23.0], [632, -25.4], [666, -25.4]], m: [4, 8, 0, 0] },
    { name: 'mall',      r: [690, 802, 749, 822], lin: [749, -32.6, -0.023], m: [8, 8, 0, 0] },
    { name: 'lookout',   r: [596, 618, 302, 326], y: -3.75, m: [10, 10, 10, 10] },
    { name: 'poolA',     r: [850, 866, 326, 340], y: -6.15, m: [10, 10, 10, 10] },
    { name: 'poolB',     r: [900, 916, 326, 340], y: -6.15, m: [10, 10, 10, 10] },
    { name: 'poolC',     r: [874, 890, 380, 394], y: -9.47, m: [10, 10, 10, 10] },
    { name: 'poolD',     r: [926, 942, 380, 394], y: -9.47, m: [10, 10, 10, 10] },
  ];
  function padY(p, z) {
    if (p.y !== undefined) return p.y;
    if (p.lin) return p.lin[1] + p.lin[2] * (z - p.lin[0]);
    const K = p.prof; if (z <= K[0][0]) return K[0][1];
    for (let i = 1; i < K.length; i++) if (z <= K[i][0]) return lerp(K[i - 1][1], K[i][1], sm((z - K[i - 1][0]) / (K[i][0] - K[i - 1][0])));
    return K[K.length - 1][1];
  }
  function natural(x, z) {
    const bw = baseW(x, z);
    if (Math.abs(z - CUT.z) < CUT.hw && x >= CUT.x0 && x <= CUT.x1) return bw;
    if (inR(NOTCH, x, z)) return CUT.y;
    const Y = bombY(z); return lerp(bw, Y, ridgeK(x, z, Y - bw));
  }
  // the map-edge hill (x > 975) comes from the base as 22·sm((x-975)/30); the 8 m mesh can't draw that toe.
  // Replace it with the same curve sampled every 4 m from x 968 and joined by straight lines: the res-4 region
  // [968, 1000, 232, 904] has its vertices exactly there, so it draws this ground exactly.
  const EDGE = x => x <= 975 ? 0 : 22 * sm((x - 975) / 30);
  const edgeFix = x => { if (x <= 968) return 0; const i = 968 + Math.floor((x - 968) / 4) * 4; return lerp(EDGE(i), EDGE(i + 4), (x - i) / 4) - EDGE(x); };
  function ground(x, z) { return ground0(x, z) + edgeFix(x); }
  function ground0(x, z) {
    if (inR([PARK.x0, PARK.x1, PARK.z0, PARK.z1], x, z)) {
      let y = PARK.y[z < PARK.cuts[0] ? 0 : z < PARK.cuts[1] ? 1 : 2];
      if (z < PARK.z0 + 6) y = lerp(y, natural(x, PARK.z0), sm((PARK.z0 + 6 - z) / 6));   // the Orchard Bank
      return y;
    }
    for (const p of PADS) {
      const [x0, x1, z0, z1] = p.r, [mw, me, mn, ms] = p.m;
      const tx = x < x0 ? (mw ? (x0 - x) / mw : 9) : x > x1 ? (me ? (x - x1) / me : 9) : 0;
      const tz = z < z0 ? (mn ? (z0 - z) / mn : 9) : z > z1 ? (ms ? (z - z1) / ms : 9) : 0;
      const t = tx >= 9 || tz >= 9 ? 1 : Math.hypot(tx, tz); if (t >= 1) continue;   // rounded corners: no creases
      const y = padY(p, clamp(z, z0, z1));
      return t <= 0 ? y : lerp(y, natural(x, z), sm(t));
    }
    return natural(x, z);
  }
  /* ---- what the ground is, for colour and surface ---- */
  const DRIVEIN = [846, 966, 604, 796];
  function zone(x, z) {
    if (inR([PARK.x0, PARK.x1, PARK.z0, PARK.z1], x, z) || inR(PADS[0].r, x, z) || inR(NOTCH, x, z)) return 'park';
    const dB = bombDist(x, z), adx = Math.abs(x - 600);
    if (z >= 696 && z <= 830 && adx > 13 && adx <= 19.5) return 'bank';
    if (dB <= BOMB.rw) return 'road';
    if (dB <= BOMB.rw + BOMB.sw) return 'walk';
    for (const s of STL) if (x >= s.x0 && x <= s.x1) { const u = Math.abs(z - s.c); if (u <= s.rw) return 'road'; if (u <= s.rw + s.sw) return 'walk'; }
    for (const s of [NS.vista, NS.terrace]) if (z >= s.z0 && z <= s.z1) { const u = Math.abs(x - s.x); if (u <= s.rw) return 'road'; if (u <= s.rw + s.sw) return 'walk'; }
    if (z >= NS.back.z0 && z <= NS.back.z1 && Math.abs(x - NS.back.x) <= NS.back.rw) return 'lane';
    if (x >= NS.larch.x0 && x <= NS.larch.x1 && Math.abs(z - NS.larch.z) <= NS.larch.rw) return 'lane';
    if (inR(PADS[1].r, x, z)) return inR([432, 480, 636, 660], x, z) ? 'court' : 'yard';
    if (inR(PADS[2].r, x, z)) return 'lot';
    if (inR(PADS[3].r, x, z)) return 'lookout';
    for (let i = 4; i < 8; i++) if (inR(PADS[i].r, x, z)) return 'deck';
    if (inR(DRIVEIN, x, z)) return 'gravel';
    return null;                                                   // lawns and verges: the default grass
  }
  const COLS = { park: 0xcdc8bc, bank: 0xa7a39a, road: 0x505257, walk: 0xb9b5ab, lane: 0x6a6a68, court: 0x3e7d5c,
    yard: 0x5f6266, lot: 0x55585d, lookout: 0xa9876a, deck: 0xd2cdc2, gravel: 0x93897a };
  const CC = {}; for (const k in COLS) CC[k] = new THREE.Color(COLS[k]);
  const col = (x, z) => { const k = zone(x, z); return k ? CC[k] : null; };
  const surface = (x, z) => { const k = zone(x, z); return k === 'gravel' || k === null ? 'rough' : 'smooth'; };
  /* ---- fine ground, [x0, x1, z0, z1, res]: finer ones sit wholly inside a res-4 block or outside all of them ---- */
  const REGIONS = [
  // res 4 blocks: bench toes and ridge flanks (they don't count against the fine budget)
  [376, 832, 248, 528, 4],       // Crest Road, the Crest Bend, Orchard Street, the upper Spine
  [832, 856, 248, 312, 4], [832, 856, 392, 440, 4],
  [304, 832, 528, 744, 4],       // Crosstown, the school, the lower Spine, Mesa Street
  [832, 928, 544, 600, 4], [832, 848, 664, 736, 4],       // Crosstown's east end
  [304, 968, 808, 896, 4],       // Bayview Road
  [968, 1000, 230, 910, 4],      // the map-edge hill (its ground is linear between these vertices; snaps to z 224..912, so the border rows are drawn fine too)
  // Campus Drive, the Crest Bend, the Lookout
  [608, 624, 248, 296, 1], [672, 704, 248, 352, 2], [672, 688, 248, 264, 1],
  [568, 632, 296, 336, 1], [560, 624, 336, 344, 2], [520, 576, 344, 376, 2],
  [384, 400, 248, 272, 2], [384, 400, 400, 416, 2],
  // Orchard Street over the Spine
  [480, 512, 392, 416, 2], [480, 512, 448, 464, 2], [680, 712, 392, 416, 2], [688, 712, 448, 464, 2],
  // the Crosstown Cut and the Bridge Steps
  [464, 736, 544, 552, 1], [480, 720, 568, 576, 1], [608, 640, 520, 528, 1], [608, 640, 528, 544, 1],
  [464, 480, 528, 536, 2], [720, 728, 528, 536, 2], [904, 920, 544, 552, 1], [696, 736, 584, 600, 2],
  // Larkspur Hill School
  [416, 488, 576, 584, 1], [416, 424, 584, 664, 1], [488, 496, 576, 664, 1], [424, 488, 616, 632, 2], [416, 496, 664, 672, 1],
  // the lower Spine toes, Mesa's dead ends
  [496, 568, 624, 680, 2], [624, 696, 624, 680, 2], [552, 584, 680, 704, 1], [616, 648, 680, 704, 1],
  // the Chute
  [584, 592, 688, 744, 1], [608, 616, 688, 744, 1], [584, 592, 744, 768, 1], [608, 616, 744, 768, 1],
  [584, 592, 768, 808, 2], [608, 616, 768, 808, 2], [568, 592, 808, 832, 2], [608, 632, 808, 832, 2],
  [584, 592, 832, 864, 2], [608, 616, 832, 864, 2], [568, 592, 864, 872, 2], [608, 632, 864, 872, 2],
  // Bayview Center lot
  [680, 816, 744, 752, 1], [680, 696, 752, 808, 1], [800, 816, 752, 808, 1], [680, 688, 808, 824, 1], [800, 816, 808, 824, 1],
  // Hillside Park
  [832, 848, 448, 544, 1], [952, 968, 448, 544, 1],
  [848, 952, 440, 456, 1], [848, 952, 472, 480, 1], [848, 952, 504, 512, 1], [848, 952, 536, 544, 1],
  [944, 952, 480, 504, 0.5],     // the Hillside quarterpipe (a K.feat)
  // Pool Row yards
  [832, 880, 320, 352, 2], [880, 928, 320, 352, 2], [864, 904, 368, 408, 2], [912, 960, 368, 408, 2],
];
  return { sm, base, inR, ST, NS, warpZ, baseW, BOMB, KN, bombY, bombX, bombDist, ridgeK, CUT, NOTCH, DECK, PARK, PADS, padY, natural, ground, DRIVEIN, zone, col, surface, REGIONS };
}

// A sidewalk on a slope: a run of sloped blocks 0.15 m over the ground, each one a straight chord, split wherever
// the ground bends away from the chord by more than 3 cm (and at least every 24 m), with a 'Curb' grind line along
// the road-side edge. path(s) -> [x, z] is the road's centre line, s in metres; off is the walk's centre offset
// (+ is to the right of the direction of travel, i.e. -x when travelling +z... see below); kerb is the curb offset.
function east_walk(K, path, s0, s1, off, kerb, w, skip = []) {
  const at = (s, o) => { const [x, z] = path(s), [x2, z2] = path(s + 0.5), tx = x2 - x, tz = z2 - z, l = Math.hypot(tx, tz) || 1;
    return [x + (-tz / l) * o, z + (tx / l) * o]; };                 // offset o to the left-hand normal (-tz, tx)
  const top = (s, o) => { const [x, z] = at(s, o); return K.terrainH(x, z) + 0.15; };
  const runs = []; let a = s0;
  for (const [k0, k1] of [...skip].sort((p, q) => p[0] - q[0])) { if (k0 > a) runs.push([a, Math.min(k0, s1)]); a = Math.max(a, k1); }
  if (a < s1) runs.push([a, s1]);
  let n = 0;
  for (const [r0, r1] of runs) {
    let s = r0;
    while (s < r1 - 0.5) {
      let e = Math.min(r1, s + 24);
      for (;;) {                                                     // shrink until the chord stays within 3 cm of the ground
        const ya = top(s, off), yb = top(e, off); let bad = false;
        for (let t = 0.125; t < 1; t += 0.125) { const u = s + (e - s) * t; if (Math.abs(top(u, off) - lerp(ya, yb, t)) > 0.03) { bad = true; break; } }
        if (!bad || e - s <= 3) break; e = s + (e - s) * 0.6;
      }
      const [ax, az] = at(s, off), [bx, bz] = at(e, off), [cx, cz] = at(s, kerb), [dx, dz] = at(e, kerb);
      { const A = V(ax, top(s, off), az), B = V(bx, top(e, off), bz); K.hubbas.push(A.y >= B.y ? { a: A, b: B, w, noRails: true, color: 0xb9b5ab } : { a: B, b: A, w, noRails: true, color: 0xb9b5ab }); }
      K.rail(cx, top(s, off), cz, dx, top(e, off), dz, 'Curb', false);
      n++; s = e;
    }
  }
  return n;
}

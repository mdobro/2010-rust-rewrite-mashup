/* Boardwalk West (bw): the shared plan (ground, colour, surface, regions, outlet and snake formulas). Design: levels/porto/design/bw.md section 2.
   No K calls here. */
function bw_plan() {
  const YN = -40.60, YS = -41.80, T1 = -39.10, T2 = -39.70, T3 = -38.20, YF = -46.20;
  const Bz = z => portoBaseH(-500, z);                       // base without the edge hills
  const Qz = z => z <= 920 ? Bz(z)
    : z <= 944 ? lerp(Bz(920), YN, (z - 920) / 24)
    : z <= 1096 ? YN
    : z <= 1128 ? lerp(YN, YS, (z - 1096) / 32)
    : YS;
  const Q = (x, z) => z > 1096 ? lerp(YN, Qz(z), clamp((x + 824) / 40, 0, 1)) : Qz(z);
  /* past the quay the base drops 10 m in 6 m; from the 1184 grid row on, the sea bed falls in a straight line to the 1192 row so
     the 8 m mesh draws exactly what is there (it sits under the water either way) */
  const ground = (x, z, base) => z > 1184 ? (z < 1192 ? lerp(Bz(1184), Bz(1192), (z - 1184) / 8) : base) : z > 1180 ? base : Q(x, z) + (base - Bz(z));
  /* a circular transition: height gained d metres from the foot of an arc of radius R that tops out at width w */
  const arc = (d, R, w) => { const t = Math.min(Math.max(d, 0), w); return R - Math.sqrt(Math.max(R * R - t * t, 0)); };
  /* ---- the Spillway Outlet ---- */
  const OK = [[944, YN], [1032, -44.80], [1096, -45.60], [1120, -45.60]];
  const outletFloor = z => {
    if (z <= OK[0][0]) return YN;
    for (let i = 1; i < OK.length; i++) if (z <= OK[i][0]) return lerp(OK[i - 1][1], OK[i][1], (z - OK[i - 1][0]) / (OK[i][0] - OK[i - 1][0]));
    return z >= 1136 ? YS : -45.6 + arc(z - 1120, 35.6, 16);
  };
  /* ground height inside the outlet footprint (x -728..-672, z 944..1136); Q outside it */
  const outlet = (x, z) => {
    const q = Q(x, z); if (z <= 944 || z >= 1136) return q;
    const fo = outletFloor(z), dx = Math.abs(x + 700);
    if (dx <= 12) return Math.min(q, fo);
    if (dx >= 28) return q;
    return Math.min(q, fo + (q - fo) * (dx - 12) / 16);
  };
  /* ---- the Eel Run snake ---- */
  const pts = [[-218, 952], [-236, 952], [-266, 972], [-300, 954], [-334, 976], [-366, 956], [-396, 978], [-418, 966]];
  const s = [0]; for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const D = sv => sv <= 18 ? 1.2 * sv / 18 : 1.2 + 2.2 * (sv - 18) / 215.03;
  /* ground height of the snake at (x, z): YN outside it (nearest segment, s of the projection; the end pocket round S7) */
  const snakeH = (x, z) => {
    let best = 1e9, bs = 0;
    for (let i = 1; i < pts.length; i++) {
      const ax = pts[i - 1][0], az = pts[i - 1][1], bx = pts[i][0], bz = pts[i][1], dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz;
      const t = clamp(((x - ax) * dx + (z - az) * dz) / L2, 0, 1), d = Math.hypot(x - ax - dx * t, z - az - dz * t);
      if (d < best) { best = d; bs = s[i - 1] + t * (s[i] - s[i - 1]); }
    }
    const d = D(bs); if (best > 1.8 + 4.2) return YN;
    if (best <= 1.8) return YN - d;
    const w = Math.sqrt(16 - (4 - d) * (4 - d));
    return best - 1.8 >= w ? YN : YN - d + arc(best - 1.8, 4, w);
  };
  /* ---- colour and surface ---- */
  const C = c => new THREE.Color(c);
  const asphalt = C(0x5b5d62), plank = C(0x9a7a55), conc = C(0xb8b4aa), stone = C(0xa8a294), tileC = C(0x5c9fc4), lawn = C(0x6f9a4f), gravel = C(0x9b958a);
  const inR = (x, z, x0, x1, z0, z1) => x >= x0 && x <= x1 && z >= z0 && z <= z1;
  const inLawn = (x, z) => x < -975 || inR(x, z, -580, -252, 1060, 1096);
  const inGravel = (x, z) => inR(x, z, -968, -840, 944, 1010);
  const col = (x, z, h) => {
    if (z > 1180) return null;
    if (inR(x, z, -648, -596, 1048, 1080) && h < YN - 0.05) return tileC;
    if (h < Q(x, z) - 0.05) return conc;
    if (z >= 1142) return plank;
    if (inLawn(x, z)) return lawn;
    if (inGravel(x, z)) return gravel;
    if (z >= 925 && z <= 935 && x >= -968 && x <= -24) return asphalt;
    if (z >= 1014 && z <= 1026 && x >= -968) return asphalt;
    if (x >= -208 && x <= -192 && z >= 910 && z <= 1130 || x >= -42 && x <= -38 && z >= 944 && z <= 1096) return asphalt;
    if (x >= -793 && x <= -787 && z >= 930 && z <= 1142) return asphalt;
    if (z >= 910 && z <= 944) return stone;
    return null;
  };
  const surface = (x, z) => (inLawn(x, z) || inGravel(x, z)) ? 'rough' : 'smooth';
  const REGIONS = [
    [-432, -212, 944, 992, 1],       // Eel Run
    [-968, -952, 1048, 1176, 1],     // Drydock west (altars, rim)
    [-888, -864, 1048, 1176, 0.5],   // Drydock east transition
    [-728, -672, 1112, 1144, 2],     // Outlet end wall
    [-648, -596, 1048, 1080, 0.5],   // Lido
    [-560, -536, 944, 968, 0.5],     // Mini ramp
    [-1000, -968, 910, 1176, 2],     // the edge hill (base rises 22 m over 30 m here)
    [-16, 0, 910, 1200, 2],          // the east band (base and ground blend over 12 m), on past the quay
  ];
  return { YN, YS, T1, T2, T3, YF, Bz, Qz, Q, ground, col, surface, arc, outletFloor, outlet, snake: { pts, s, D, h: snakeH }, REGIONS };
}

/* Shipyard East (ship): the shared numbers (design/ship.md 2.2, 2.3, 13) and three helpers that take K. Builds nothing itself. */
function ship_plan() {
  const s = 0.0189003;                       // (B(930) + 44) / 194
  const Y0 = -40 - 2 * 50 / 300;             // B(930) = -40.33333
  const y1 = Y0 - 80 * s;                    // -41.84536  Harbour bench, z 1010..1034
  const y2 = y1 - 74 * s;                    // -43.24398  Quay bench,    z 1108..1132
  const Y = z => z <= 1010 ? Y0 - (z - 930) * s
               : z <= 1034 ? y1
               : z <= 1108 ? y1 - (z - 1034) * s
               : z <= 1132 ? y2
               : z <= 1172 ? y2 - (z - 1132) * s                  // reaches -44.000 at z 1172
               : -44.0;                                            // the quay apron, z 1172..1180
  const sm = t => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
  const W = x => Math.min(1, Math.max(0, (x - 16) / 80));         // 0 at x<=16 (the bw band), 1 at x>=96
  const E = x => 1 - sm((x - 945) / 30);                           // 1 at x<=945, 0 at x>=975 (the hills)
  const ground = (x, z, base) => {
    if (z <= 930) return base;                                     // the north band and gate corridor
    const k = W(x) * E(x);
    if (z > 1180) return base + k * (Math.min(base, -46.6) - base);
    return base + k * (Y(z) - base);
  };
  const kinks = [930, 1010, 1034, 1108, 1132, 1172];
  const PAL = [0xb5452f, 0x2f6d8a, 0xd18b2c, 0x4f7a43, 0x8a8f94, 0x6b3f6e, 0xc9c2b0];
  const inB = (x, z, x0, x1, z0, z1) => x >= x0 && x <= x1 && z >= z0 && z <= z1;
  /* ground colour (2.3), first match wins; a hex number or null */
  const col = (x, z, h) => {
    if (inB(x, z, 593, 607, 910, 1128)) return 0x56585d;                       // Gantry Road
    if (inB(x, z, 0, 96, 1014, 1026)) return 0x56585d;                         // Harbour Road, paint only
    if (inB(x, z, 0, 96, 1010, 1014) || inB(x, z, 0, 96, 1026, 1030)) return 0xc4c0b6;
    if (inB(x, z, 16, 589, 926, 938) || inB(x, z, 244, 256, 926, 1112) || inB(x, z, 434, 446, 926, 1112) ||
        inB(x, z, 760, 780, 1034, 1112) || inB(x, z, 611, 652, 1034, 1112) || inB(x, z, 930, 958, 940, 1112)) return 0x6a6b6e;   // lanes
    if (inB(x, z, 0, 104, 1144, 1156)) return 0x8a6a48;                        // Quay Walk planks
    if (inB(x, z, 104, 176, 989, 1010)) return 0xb9b4aa;                       // Port Authority forecourt
    if (inB(x, z, 611, 730, 926, 962)) return 0x8d8678;                        // gravel
    if (x >= 960 && z < 1150) return 0x7d9a5b;                                 // the hill toe
    return z < 1172 ? 0x8f8c86 : 0x9d9a92;
  };
  const surface = (x, z) => inB(x, z, 611, 730, 926, 962) ? 'rough' : null;
  /* paint on a slope: 2 m strips, each at the highest ground under it + 1.2 cm */
  const paintZ = (K, x0, x1, z0, z1, color) => {
    K.decorFns.push(D => {
      for (let z = z0; z < z1 - 1e-6; z += 2) {
        const zb = Math.min(z + 2, z1);
        const y = Math.max(K.terrainH(x0, z), K.terrainH(x1, z), K.terrainH(x0, zb), K.terrainH(x1, zb)) + 0.012;
        D.plane(x0, z, x1, zb, y, color, false);
      }
    });
  };
  /* a 0.15 m sidewalk on the slope between x0 and x1, z0..z1, split at the kinks; roadSide = the x of its road-side
     edge (the Curb rail goes there). Curb ramps (0.15 -> 0.01, 1.4 m) at both ends. */
  const walkZ = (K, x0, x1, z0, z1, roadSide) => {
    const cuts = [z0, ...kinks.filter(k => k > z0 + 0.01 && k < z1 - 0.01), z1], xm = (x0 + x1) / 2, w = x1 - x0;
    for (let i = 0; i < cuts.length - 1; i++) {
      const za = cuts[i], zb = cuts[i + 1], ya = Y(za) + 0.15, yb = Y(zb) + 0.15;
      if (Math.abs(ya - yb) < 1e-6) K.B(x0, ya - 0.75, za, x1, ya, zb, 'sidewalk', { edges: '' });
      else K.hubbas.push({ a: V(xm, ya, za), b: V(xm, yb, zb), w, noRails: true, color: 0xc4bfb3 });
      K.rail(roadSide, ya, za, roadSide, yb, zb, 'Curb', false);
    }
    for (const [z, d] of [[z0, -1], [z1, 1]]) {
      const zz = z + d * 1.4;
      K.hubbas.push({ a: V(xm, Y(z) + 0.15, z), b: V(xm, Y(zz) + 0.01, zz), w, noRails: true, color: 0xb9b5ab });
    }
  };
  /* one container stack: n high (skip 0), len long, 2.45 deep, from z0; the top is exact because the ground is flat in x */
  const stack = (K, x0, z0, n, len, color, edges = 'ns') => {
    if (n <= 0) return null;
    return K.B(x0, Y(z0 + 2.45) - 0.4, z0, x0 + len, Y(z0) + n * 2.6, z0 + 2.45, 'car', { color, edges });
  };
  return { s, Y0, y1, y2, Y, sm, W, E, ground, kinks, PAL, col, surface, paintZ, walkZ, stack };
}

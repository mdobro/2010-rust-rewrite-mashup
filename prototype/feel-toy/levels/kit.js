/* ---------------- a kit for building cities ----------------
   Shared by Downtown and Port City: the ground (a base height plus local features: pools, bowls,
   humps, raised blocks), and the pieces cities are made of, from buildings and stair sets down to
   newspaper boxes and bike racks. Everything a level adds goes into the kit's lists. */
function cityKit(baseH, seed0 = 1) {
  let seed = seed0; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const R = (a, b) => a + (b - a) * rnd(), pick = arr => arr[Math.floor(rnd() * arr.length)];
  const boxes = [], hubbas = [], rails = [], hazards = [], fine = [], decorFns = [];
  const COLORS = [0x9b5a46, 0xb9a88f, 0x7f8a92, 0xa7744f, 0xcfc4ad, 0x8c6a5d, 0x6e7b86, 0xb58b67, 0xc98f6b, 0x8d9a7c, 0xd8d2c4, 0x6f8fa8];
  const col = () => pick(COLORS);
  // local features: depressions (pools, bowls, ditches, docks) take the lowest; humps add
  const feats = [], FG = 32, fgrid = new Map();
  function feat(x0, x1, z0, z1, h, op = 'min') {
    const f = { x0, x1, z0, z1, h, op }; feats.push(f);
    for (let i = Math.floor(x0 / FG); i <= Math.floor(x1 / FG); i++) for (let j = Math.floor(z0 / FG); j <= Math.floor(z1 / FG); j++) { const k = i * 1000 + j; if (!fgrid.has(k)) fgrid.set(k, []); fgrid.get(k).push(f); }
    return f;
  }
  function terrainH(x, z) {
    let h = baseH(x, z);
    const list = fgrid.get(Math.floor(x / FG) * 1000 + Math.floor(z / FG));
    if (list) for (const f of list) if (x >= f.x0 && x <= f.x1 && z >= f.z0 && z <= f.z1) { const v = f.h(x, z, h); h = f.op === 'min' ? Math.min(h, v) : f.op === 'add' ? h + v : v; }
    return h;
  }
  // shapes for features
  const poolS = { circle: (cx, cz, r) => (x, z) => r - Math.hypot(x - cx, z - cz),
    rect: (cx, cz, hx, hz, rr) => (x, z) => { const qx = Math.abs(x - cx) - hx + rr, qz = Math.abs(z - cz) - hz + rr; return -(Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - rr); } };
  // a pool or bowl: lobes [[shapeFn, depth]], all at ground level y0
  function pool(x0, x1, z0, z1, lobes, y0 = 0, res = 0.25) {
    feat(x0, x1, z0, z1, (x, z, h) => { let d = 0; for (const [s, D] of lobes) { const v = s(x, z); if (v > 0) d = Math.min(d, poolDepth(v, D)); } return y0 + d; });
    fine.push({ x0, x1, z0, z1, res, kind: 'pool', y0 });
  }
  const hump = (cx, cz, r, hgt) => { feat(cx - r, cx + r, cz - r, cz + r, (x, z) => { const d = Math.hypot(x - cx, z - cz) / r; return d < 1 ? hgt * (1 - d * d) ** 1.5 : 0; }, 'add'); };
  /* ---------- building blocks ---------- */
  const groundMin = (x0, z0, x1, z1) => Math.min(terrainH(x0, z0), terrainH(x1, z1), terrainH(x0, z1), terrainH(x1, z0), terrainH((x0 + x1) / 2, (z0 + z1) / 2));
  const groundMax = (x0, z0, x1, z1) => Math.max(terrainH(x0, z0), terrainH(x1, z1), terrainH(x0, z1), terrainH(x1, z0));
  const B = (x0, y0, z0, x1, y1, z1, mat, extra) => { const b = box(Math.min(x0, x1), y0, Math.min(z0, z1), Math.max(x0, x1), y1, Math.max(z0, z1), mat, extra); boxes.push(b); return b; };
  const Bg = (x0, z0, x1, z1, hgt, mat, extra) => B(x0, groundMin(x0, z0, x1, z1) - 0.4, z0, x1, groundMax(x0, z0, x1, z1) + hgt, z1, mat, extra);  // sits on the ground
  const building = (x0, z0, x1, z1, floors, color = col(), tex = pick(['brick', 'brick', 'stone', 'office'])) =>
    B(x0, groundMin(x0, z0, x1, z1) - 1, z0, x1, groundMax(x0, z0, x1, z1) + floors * 3.4, z1, 'building', { color, tex });
  const rail = (ax, ay, az, bx, by, bz, kind = 'Rail', post = true) => rails.push({ a: V(ax, ay, az), b: V(bx, by, bz), kind, post });
  const cone = (x, z) => hazards.push({ kind: 'cone', x, z, r: 0.22, h: 0.72 });
  const pothole = (x, z, r = 0.7) => { hazards.push({ kind: 'pothole', x, z, r, h: 0.12 }); };
  const kicker = (x, z, dirx, dirz, len = 2.4, hgt = 0.6, w = 1.3, color = 0xc49a5c) => { // a sheet of ply or a plate, rising along dir
    const g = terrainH(x, z); hubbas.push({ a: V(x + dirx * len, g + hgt, z + dirz * len), b: V(x, g + 0.02, z), w, noRails: true, color }); };
  const SET = (axis, at, dir, a0, a1, top, bottom, n, tread) => { boxes.push(...stairs(axis, at, dir, a0, a1, top, bottom, n, tread, Math.min(bottom, top) - 1)); };
  // a stair set with whatever goes with it: rails / a hubba / a bank beside it, and painted lips either side
  function stairSpot(axis, at, dir, a0, a1, top, bottom, n, tread, opt = {}) {
    SET(axis, at, dir, a0, a1, top, bottom, n, tread);
    for (const r of opt.rails || []) rails.push(handrail(axis, at, dir, r, top, bottom, n, tread));
    for (const hb of opt.hubbas || []) hubbas.push(stairHubba(axis, at, dir, hb, top, bottom, n, tread));
    if (opt.bank) { const [b0, b1] = opt.bank, len = tread * (n - 1) + 1.2, m = (b0 + b1) / 2;
      hubbas.push(axis === 'z' ? { a: V(m, top, at), b: V(m, bottom + 0.02, at + dir * len), w: Math.abs(b1 - b0), noRails: true, color: 0xc4bfb3 }
                             : { a: V(at, top, m), b: V(at + dir * len, bottom + 0.02, m), w: Math.abs(b1 - b0), noRails: true, color: 0xc4bfb3 }); }
  }
  const lip = (ax, az, bx, bz, y) => rails.push({ a: V(ax, y, az), b: V(bx, y, bz), kind: 'Ledge', paint: true });
  const ledge = (x0, z0, x1, z1, hgt = 0.45, mat = 'ledge') => Bg(x0, z0, x1, z1, hgt, mat, { edges: Math.abs(x1 - x0) > Math.abs(z1 - z0) ? 'ns' : 'ew' });
  const planter = (x0, z0, x1, z1, hgt = 0.55) => Bg(x0, z0, x1, z1, hgt, 'ledge', { edges: 'nswe' });
  const pad = (x0, z0, x1, z1, hgt = 0.18) => Bg(x0, z0, x1, z1, hgt, 'pad', { edges: 'nswe' });
  const bench = (x0, z0, x1, z1) => Bg(x0, z0, x1, z1, 0.45, 'wood', { edges: Math.abs(x1 - x0) > Math.abs(z1 - z0) ? 'ns' : 'ew' });
  const posts = [], roads = [];                                              // where the lamps and trees stand, and the roads: nothing gets put on them
  const tree = (x, z) => { posts.push([x, z]); decorFns.push(D => D.tree(x, terrainH(x, z), z)); };
  const lamp = (x, z, side = 1) => { posts.push([x, z]); decorFns.push(D => D.lamp(x, terrainH(x, z), z, side)); };
  const paintRect = (x0, z0, x1, z1, color, y) => decorFns.push(D => D.plane(Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1), y ?? terrainH((x0 + x1) / 2, (z0 + z1) / 2) + 0.01, color, false));
  const dash = (x0, z0, x1, z1, color = 0xe2c044, w) => decorFns.push(D => D.dash(x0, z0, x1, z1, color, w));
  // a flat street along an axis: asphalt, centre line, and curbed sidewalks with curb ramps at each crossing
  function street(axis, c, from, to, y, crossings = [], opt = {}) {
    const RW = opt.rw ?? 6, SW = opt.sw ?? 4;
    const R = (u0, u1, v0, v1, ...rest) => axis === 'z' ? [v0, u0, v1, u1, ...rest] : [u0, v0, u1, v1, ...rest];
    paintRect(...R(from, to, c - RW, c + RW), 0x56585d, y + 0.006); roads.push(R(from, to, c - RW, c + RW));
    for (let u = from + 2; u < to - 4; u += 6) if (!crossings.some(k => u + 3 > k - RW - SW - 1 && u < k + RW + SW + 1)) dash(...R(u, u + 3, c, c));
    if (opt.noCurb) return;
    const cuts = [from, ...crossings.flatMap(k => [k - RW - SW, k + RW + SW]).filter(v => v > from && v < to), to].sort((a, b) => a - b);
    for (const side of [-1, 1]) for (let i = 0; i < cuts.length - 1; i += 2) {
      const u0 = cuts[i], u1 = cuts[i + 1]; if (u1 - u0 < 2) continue;
      const v0 = c + side * RW, v1 = c + side * (RW + SW);
      const edge = axis === 'z' ? (side < 0 ? 'e' : 'w') : (side < 0 ? 's' : 'n');
      const bx = axis === 'z' ? box(Math.min(v0, v1), y - 0.6, u0, Math.max(v0, v1), y + 0.15, u1, 'sidewalk', { edges: edge }) : box(u0, y - 0.6, Math.min(v0, v1), u1, y + 0.15, Math.max(v0, v1), 'sidewalk', { edges: edge });
      boxes.push(bx);
      for (const [end, d] of [[u0, -1], [u1, 1]]) if (end > from + 0.5 && end < to - 0.5) {  // a curb ramp out into the crossing
        const vm = c + side * (RW + SW / 2);
        hubbas.push(axis === 'z' ? { a: V(vm, y + 0.15, end), b: V(vm, y + 0.01, end + d * 1.4), w: 2.6, noRails: true, color: 0xb9b5ab }
                                 : { a: V(end, y + 0.15, vm), b: V(end + d * 1.4, y + 0.01, vm), w: 2.6, noRails: true, color: 0xb9b5ab });
      }
      if (opt.lamps !== false) for (let u = u0 + 6; u < u1 - 3; u += 16) {
        const vl = c + side * (RW + 0.6); axis === 'z' ? lamp(vl, u, side) : (posts.push([u, vl]), decorFns.push(D => D.lamp(u, y, vl, side)));
        const vt = c + side * (RW + SW - 0.9); axis === 'z' ? tree(vt, u + 8) : tree(u + 8, vt);
      }
    }
  }
  const zebra = (x, z, axis, n = 8) => { for (let i = -n / 2; i <= n / 2; i++) axis === 'x' ? dash(x + i * 1.25, z - 1.4, x + i * 1.25, z + 1.4, 0xf0ece2, 0.6) : dash(x - 1.4, z + i * 1.25, x + 1.4, z + i * 1.25, 0xf0ece2, 0.6); };
  const car = (x, z, alongX = true, y = terrainH(x, z)) => {
    const hx = alongX ? 2.2 : 0.9, hz = alongX ? 0.9 : 2.2, b = B(x - hx, y, z - hz, x + hx, y + 1.45, z + hz, 'car', { color: pick([0xb23a32, 0x2f5d8a, 0xdedad2, 0x2b2b2e, 0x9aa3a8, 0x3f6b46, 0xd4a017]) });
    const cx = alongX ? 1.3 : 0.93, cz = alongX ? 0.93 : 1.3;                                       // glass round the cabin, wheels at the corners
    decorFns.push(D => { D.prop(x - cx, y + 0.92, z - cz, x + cx, y + 1.38, z + cz, 0x27313b);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const wx = x + sx * (alongX ? 1.45 : 0.92), wz = z + sz * (alongX ? 0.92 : 1.45); D.prop(wx - (alongX ? 0.33 : 0.12), y, wz - (alongX ? 0.12 : 0.33), wx + (alongX ? 0.33 : 0.12), y + 0.62, wz + (alongX ? 0.12 : 0.33), 0x1a1a1c); } });
    return b; };

  /* ---------- spot templates (each is the kind of place you'd actually find) ---------- */
  // a raised plaza with stairs (rails, a hubba) down one side, ledges and planters on top
  function raisedPlaza(x0, z0, x1, z1, hgt, side = 's') {
    Bg(x0, z0, x1, z1, hgt, 'marble', { edges: side === 's' || side === 'n' ? 'ew' : 'ns' });
    const g = terrainH((x0 + x1) / 2, (z0 + z1) / 2), top = g + hgt, n = Math.max(3, Math.round(hgt / 0.3)), tr = 0.42;
    const zEdge = side === 's' ? z1 : z0, d = side === 's' ? 1 : -1, xm = (x0 + x1) / 2, w = Math.min(10, (x1 - x0) * 0.4);
    stairSpot('z', zEdge, d, xm - w / 2, xm + w / 2, top, g, n, tr, { rails: [xm - w / 2 - 0.45, xm], hubbas: [xm + w / 2 + 0.4] });
    lip(x0, zEdge, xm - w / 2 - 0.05, zEdge, top); lip(xm + w / 2 + 0.75, zEdge, x1, zEdge, top);
    ledge(x0 + 2, z0 + 3, x0 + 2 + (x1 - x0) * 0.4, z0 + 3.6, 0.45, 'marble'); planter(x1 - 7, z0 + 2.5, x1 - 2.5, z0 + 6);
  }
  // a sunken plaza: stairs down on two sides, a fountain ledge and benches in the pit
  function sunkenPlaza(cx, cz, hw, hd, depth) {
    pool(cx - hw - 1, cx + hw + 1, cz - hd - 1, cz + hd + 1, [[poolS.rect(cx, cz, hw, hd, 0.2), depth]], terrainH(cx, cz), 0.5);
    const g = terrainH(cx, cz);
    feats[feats.length - 1].h = (x, z) => (Math.abs(x - cx) < hw && Math.abs(z - cz) < hd) ? g - depth : g; // straight walls
    for (const s of [-1, 1]) { const n = Math.round(depth / 0.3); stairSpot('z', cz + s * hd, -s, cx - 4, cx + 4, g, g - depth, n, 0.4, { rails: [cx - 4.45, cx + 4.45] }); }
    lip(cx - hw, cz - hd, cx - 4.5, cz - hd, g); lip(cx + 4.5, cz - hd, cx + hw, cz - hd, g); lip(cx - hw, cz + hd, cx - 4.5, cz + hd, g); lip(cx + 4.5, cz + hd, cx + hw, cz + hd, g);
    B(cx - hw + 3, g - depth - 0.2, cz - 2, cx - hw + 8, g - depth + 0.5, cz + 2, 'ledge', { edges: 'nswe' });
    B(cx + hw - 8, g - depth - 0.2, cz - 0.3, cx + hw - 3, g - depth + 0.45, cz + 0.3, 'marble', { edges: 'ns' });
  }
  // a drained fountain: a round bowl in a plaza, ledge rim to drop in from
  function fountainBowl(cx, cz, r, depth) {
    const g = terrainH(cx, cz);
    pool(cx - r - 1, cx + r + 1, cz - r - 1, cz + r + 1, [[poolS.circle(cx, cz, r), depth]], g, 0.25);
    const n = Math.round(r * 5); for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2;
      rails.push({ a: V(cx + Math.cos(a0) * r, g, cz + Math.sin(a0) * r), b: V(cx + Math.cos(a1) * r, g, cz + Math.sin(a1) * r), kind: 'Coping', coping: true }); }
  }
  // a bank up to a wall with a ledge on top (bank-to-wall), and a hubba down beside it
  function bankToWall(x0, z, x1, hgt = 1.4, depth = 4) {
    const g = terrainH((x0 + x1) / 2, z);
    hubbas.push({ a: V((x0 + x1) / 2, g + hgt, z), b: V((x0 + x1) / 2, g + 0.02, z + depth), w: Math.abs(x1 - x0), noRails: true, color: 0xc4bfb3 });
    B(x0, g - 0.5, z - 2.5, x1, g + hgt + 0.9, z, 'plaza', { edges: 's' });
  }
  // a parking garage with a ramp to the top deck, and roofs to gap to
  function garage(x0, z0, x1, z1, hgt, dir = 1) {
    const g = groundMin(x0, z0, x1, z1);
    B(x0 + 7, g - 0.5, z0, x1, g + hgt, z1, 'garage', { edges: 'nswe' });
    hubbas.push({ a: V(x0 + 3.5, g + hgt, dir > 0 ? z0 + 3 : z1 - 3), b: V(x0 + 3.5, g + 0.02, dir > 0 ? z1 - 0.5 : z0 + 0.5), w: 7, color: 0x9b9a95 });
    B(x0, g - 0.5, dir > 0 ? z0 : z1 - 3, x0 + 7, g + hgt, dir > 0 ? z0 + 3 : z1, 'garage');
    return g + hgt;
  }
  // a loading dock: a raised platform along a warehouse with a ramp and a sunken truck well
  function loadingDock(x0, z, x1, side = 1) {
    const g = terrainH((x0 + x1) / 2, z);
    B(x0, g - 0.5, z, x1, g + 1.3, z + side * 3, 'plaza', { edges: side > 0 ? 'n' : 's' });
    hubbas.push({ a: V(x1, g + 1.3, z + side * 1.5), b: V(x1 + 6, g + 0.02, z + side * 1.5), w: 3, noRails: true, color: 0xb9b5ab }); // ramp off the end
    rail(x1 + 0.2, g + 1.3 + 0.9, z + side * 3.15, x1 + 6, g + 0.9, z + side * 3.15, 'Handrail');
  }
  // a row of shipping containers, stacked
  // (y: the ground they stand on; by default the ground at the row's start)
  function containers(x0, z, n, stack, alongX = true, gap = 0, y = alongX ? terrainH(x0, z) : terrainH(z, x0)) {
    const cols = [0x2f6b8a, 0xb23a32, 0x3f6b46, 0xd4a017, 0x8a5a3a, 0x6b6f75];
    for (let i = 0; i < n; i++) { const x = x0 + i * (12.2 + gap), h = stack[i % stack.length];
      for (let k = 0; k < h; k++) alongX ? B(x, y + k * 2.6, z, x + 12.2, y + (k + 1) * 2.6, z + 2.45, 'car', { color: pick(cols), edges: k === h - 1 ? 'ns' : '' })
                                       : B(z, y + k * 2.6, x, z + 2.45, y + (k + 1) * 2.6, x + 12.2, 'car', { color: pick(cols), edges: k === h - 1 ? 'ew' : '' }); }
  }
  // a backyard pool, drained, with a fence and a gap in it
  function backyardPool(cx, cz, rot = 0) {
    const lobes = rot ? [[poolS.circle(cx - 2.2, cz, 2.6), 2.2], [poolS.circle(cx + 2, cz, 3.2), 2.8]] : [[poolS.circle(cx, cz - 2.2, 2.6), 2.2], [poolS.circle(cx, cz + 2, 3.2), 2.8]];
    pool(cx - 6, cx + 6, cz - 6, cz + 6, lobes, terrainH(cx, cz));
    for (const [px, pz, r] of rot ? [[cx - 2.2, cz, 2.6], [cx + 2, cz, 3.2]] : [[cx, cz - 2.2, 2.6], [cx, cz + 2, 3.2]]) {
      const n = 16; for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, q0 = V(px + Math.cos(a0) * r, terrainH(cx, cz), pz + Math.sin(a0) * r), q1 = V(px + Math.cos(a1) * r, terrainH(cx, cz), pz + Math.sin(a1) * r);
        if (lobes.some(([s]) => s(q0.x, q0.z) > 0.05 || s(q1.x, q1.z) > 0.05)) continue; rails.push({ a: q0, b: q1, kind: 'Coping', coping: true }); }
    }
  }

  /* ---------- street furniture: the small stuff that makes a sidewalk skateable ---------- */
  const prop = (x0, y0, z0, x1, y1, z1, color) => decorFns.push(D => D.prop(Math.min(x0, x1), y0, Math.min(z0, z1), Math.max(x0, x1), y1, Math.max(z0, z1), color));  // looks only, nothing to hit
  const around = (x, z, hx, hz) => [x - hx, z - hz, x + hx, z + hz];
  const sit = (x, z, hx, hz, hgt, mat, extra) => { const [x0, z0, x1, z1] = around(x, z, hx, hz); return Bg(x0, z0, x1, z1, hgt, mat, extra); };
  // a row of newspaper boxes: knee-high-plus, to ollie or not
  const newsBoxes = (x, z, alongX = true, n = 2) => { for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 0.62;
    sit(alongX ? x + o : x, alongX ? z : z + o, alongX ? 0.27 : 0.23, alongX ? 0.23 : 0.27, 1.05, 'car', { color: pick([0x2f5d8a, 0xb23a32, 0xd4a017, 0x3f6b46, 0xe8e4da]) }); } };
  const trashCan = (x, z) => sit(x, z, 0.3, 0.3, 0.95, 'car', { color: 0x2f4a3a });
  const hydrant = (x, z) => { sit(x, z, 0.16, 0.16, 0.72, 'car', { color: 0xb8302a }); prop(x - 0.24, terrainH(x, z) + 0.42, z - 0.07, x + 0.24, terrainH(x, z) + 0.56, z + 0.07, 0xb8302a); };
  // a bike rack: a low bar on two legs, grindable
  const bikeRack = (x, z, alongX = true, len = 2.4) => { const g = terrainH(x, z) + 0.72;
    rails.push(alongX ? { a: V(x - len / 2, g, z), b: V(x + len / 2, g, z), kind: 'Rail', post: true } : { a: V(x, g, z - len / 2), b: V(x, g, z + len / 2), kind: 'Rail', post: true }); };
  // a bus stop: a shelter with a glass back and a bench inside, a long ledge to skate
  function busStop(x, z, alongX, back) {   // back: which way the glass wall is (+1/-1 across the sidewalk)
    const L = 4.2, Dp = 1.5, g = terrainH(x, z);
    const [x0, z0, x1, z1] = alongX ? around(x, z, L / 2, Dp / 2) : around(x, z, Dp / 2, L / 2);
    decorFns.push(D => D.shelter(x0, z0, x1, z1, 2.5));
    if (alongX) { B(x0, g - 0.2, z + back * 0.72, x1, g + 2.3, z + back * 0.78, 'glass'); B(x0 + 0.4, g - 0.2, z + back * 0.2, x1 - 0.4, g + 0.48, z + back * 0.65, 'wood', { edges: back > 0 ? 'n' : 's' }); }
    else { B(x + back * 0.72, g - 0.2, z0, x + back * 0.78, g + 2.3, z1, 'glass'); B(x + back * 0.2, g - 0.2, z0 + 0.4, x + back * 0.65, g + 0.48, z1 - 0.4, 'wood', { edges: back > 0 ? 'w' : 'e' }); }
  }
  // a dumpster: its top edges grind
  const dumpster = (x, z, alongX = true) => sit(x, z, alongX ? 1.0 : 0.7, alongX ? 0.7 : 1.0, 1.25, 'car', { color: pick([0x2f5d3a, 0x2c4f7a, 0x55595e]), edges: alongX ? 'ns' : 'ew' });
  const jersey = (x0, z0, x1, z1) => Bg(x0, z0, x1, z1, 0.8, 'ledge', { edges: Math.abs(x1 - x0) > Math.abs(z1 - z0) ? 'ns' : 'ew' });
  const parkingBlock = (x, z, alongX = true) => sit(x, z, alongX ? 0.9 : 0.15, alongX ? 0.15 : 0.9, 0.16, 'ledge', { edges: alongX ? 'ns' : 'ew' });
  // a picnic table: a table top to manual and grind, benches either side
  const picnic = (x, z, alongX = true) => { sit(x, z, alongX ? 1.0 : 0.4, alongX ? 0.4 : 1.0, 0.76, 'wood', { edges: alongX ? 'ns' : 'ew' });
    for (const s of [-1, 1]) sit(alongX ? x : x + s * 0.75, alongX ? z + s * 0.75 : z, alongX ? 1.0 : 0.14, alongX ? 0.14 : 1.0, 0.45, 'wood', { edges: alongX ? 'ns' : 'ew' }); };
  const meter = (x, z) => { const g = terrainH(x, z); prop(x - 0.04, g, z - 0.04, x + 0.04, g + 1.1, z + 0.04, 0x3a3d42); prop(x - 0.1, g + 1.1, z - 0.08, x + 0.1, g + 1.38, z + 0.08, 0x6b7076); };
  // a driveway cut in a curb: a little ramp from the sidewalk into the road, which is also a kicker
  function driveway(axis, c, side, u, RW, w = 3) {
    const xc = c + side * RW, y = terrainH(axis === 'z' ? xc + side * 0.5 : u, axis === 'z' ? u : xc + side * 0.5), vr = c + side * (RW - 1.8);
    const yr = terrainH(axis === 'z' ? vr : u, axis === 'z' ? u : vr) + 0.01;   // the road end sits on the road, wherever the road is
    hubbas.push(axis === 'z' ? { a: V(xc, y, u), b: V(vr, yr, u), w, noRails: true, color: 0xb9b5ab }
                             : { a: V(u, y, xc), b: V(u, yr, vr), w, noRails: true, color: 0xb9b5ab });
  }
  /* ---------- filler: small skateable things for the stretches between spots ---------- */
  // a slab that follows the ground from (ax, az) to (bx, bz), in straight chords of at most opt.seg m (default 6), hgt over the
  // ground (or over opt.top(x, z) when given), w wide. Both long edges grind (opt.kind, default 'Curb') unless opt.noRails;
  // the chords meet end to end, so a grind carries on from one to the next.
  function strip(ax, az, bx, bz, hgt = 0.15, w = 1, opt = {}) {
    const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(L / (opt.seg || 6))), top = opt.top || terrainH;
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n, x0 = ax + (bx - ax) * t0, z0 = az + (bz - az) * t0, x1 = ax + (bx - ax) * t1, z1 = az + (bz - az) * t1;
      const p0 = V(x0, top(x0, z0) + hgt, z0), p1 = V(x1, top(x1, z1) + hgt, z1), hi = p0.y >= p1.y;
      hubbas.push({ a: hi ? p0 : p1, b: hi ? p1 : p0, w, noRails: !!opt.noRails, kind: opt.kind || 'Curb', color: opt.color ?? 0xb9b5ab });
    }
  }
  // a traffic island down the middle of a road: a curb you can grind or manual along, with a planter ledge in the middle
  // (opt.planter false for none) and a tree every opt.trees m (0 for none). Keep 3 m clear of each crossing yourself.
  function median(ax, az, bx, bz, w = 2.4, opt = {}) {
    strip(ax, az, bx, bz, 0.15, w, { color: 0xb9b5ab });
    const L = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / L, uz = (bz - az) / L;
    if (opt.planter !== false && L > 10) strip(ax + ux * 3, az + uz * 3, bx - ux * 3, bz - uz * 3, 0.5, Math.max(0.8, w - 1.2), { kind: 'Ledge', color: 0xa9a59c });
    if (opt.trees) for (let s = opt.trees / 2; s < L; s += opt.trees) tree(ax + ux * s, az + uz * s);
  }
  // a retaining wall along a hillside street: its top is hgt over the high ground behind it (back m to the left or right of
  // the line, + or -), so from the street it's a wall and from the bank a ledge. Its street face grinds.
  function retainWall(ax, az, bx, bz, back = 2, hgt = 0.45, thick = 0.6) {
    const L = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / L, nz = (bx - ax) / L;
    const top = (x, z) => Math.max(terrainH(x, z), terrainH(x + nx * back, z + nz * back));
    strip(ax + nx * Math.sign(back) * thick / 2, az + nz * Math.sign(back) * thick / 2, bx + nx * Math.sign(back) * thick / 2, bz + nz * Math.sign(back) * thick / 2,
      hgt, thick, { top, kind: 'Ledge', color: 0xa39d90, seg: 4 });
  }
  // a construction zone on a sidewalk or a lane: jersey barriers, a plywood kicker, a scaffold pipe rail and cones
  // (x, z the middle; alongX: which way it runs; 12 m long, 3 m wide)
  function construction(x, z, alongX = true) {
    const P = (u, v) => alongX ? [x + u, z + v] : [x + v, z + u];
    const [j0x, j0z] = P(-6, -1.4), [j1x, j1z] = P(-1, -1.0); jersey(Math.min(j0x, j1x), Math.min(j0z, j1z), Math.max(j0x, j1x), Math.max(j0z, j1z));
    const [k0x, k0z] = P(1.5, 0), [d0x, d0z] = alongX ? [1, 0] : [0, 1]; kicker(k0x, k0z, d0x, d0z, 2.4, 0.55, 1.3);
    const [r0x, r0z] = P(-5, 1.2), [r1x, r1z] = P(1, 1.2); rail(r0x, terrainH(r0x, r0z) + 0.95, r0z, r1x, terrainH(r1x, r1z) + 0.95, r1z, 'Pipe', true);
    for (const u of [-6.5, 5.5, 6]) { const [cx, cz] = P(u, u > 0 ? -1 : 1); cone(cx, cz); }
    const [bx0, bz0] = P(4.5, -1.5), [bx1, bz1] = P(6.5, 1.5); prop(Math.min(bx0, bx1), terrainH(x, z), Math.min(bz0, bz1), Math.max(bx0, bx1), terrainH(x, z) + 0.9, Math.max(bz0, bz1), 0xd4a017);
  }
  // a gap across a cross street or a driveway: a curb-cut kicker at (ax, az) aimed at (bx, bz), and a low landing ramp there
  function crossingGap(ax, az, bx, bz, hgt = 0.45) {
    const L = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / L, uz = (bz - az) / L;
    kicker(ax - ux * 2, az - uz * 2, ux, uz, 2, hgt, 1.6);
    const g = terrainH(bx, bz); hubbas.push({ a: V(bx, g + 0.25, bz), b: V(bx + ux * 2.2, terrainH(bx + ux * 2.2, bz + uz * 2.2) + 0.02, bz + uz * 2.2), w: 2, noRails: true, color: 0xb9b5ab });
  }
  // the ground mesh: coarse over a world rect, finer patches from `fine` cut out of it
  function regionsFor(W, res, groundCol, poolCol = groundCol) {
    const snap = f => ({ ...f, x0: Math.floor(f.x0 / 8) * 8, x1: Math.ceil(f.x1 / 8) * 8, z0: Math.floor(f.z0 / 8) * 8, z1: Math.ceil(f.z1 / 8) * 8 });
    const F = fine.map(snap);
    return [{ ...W, res, col: groundCol, skip: F },
      ...F.map(f => ({ x0: f.x0, x1: f.x1, z0: f.z0, z1: f.z1, res: f.res, col: f.kind === 'pool' ? poolCol : groundCol, skip: F.filter(o => o !== f && o.x0 >= f.x0 && o.x1 <= f.x1 && o.z0 >= f.z0 && o.z1 <= f.z1 && o.res < f.res) }))];
  }

  return { rnd, R, pick, col, boxes, hubbas, rails, hazards, fine, decorFns, feats, feat, terrainH, poolS, pool, hump,
    groundMin, groundMax, B, Bg, building, rail, cone, pothole, kicker, SET, stairSpot, lip, ledge, planter, pad, bench, tree, lamp,
    paintRect, dash, street, zebra, car, raisedPlaza, sunkenPlaza, fountainBowl, bankToWall, garage, loadingDock, containers, backyardPool,
    posts, roads, prop, sit, newsBoxes, trashCan, hydrant, bikeRack, busStop, dumpster, jersey, parkingBlock, picnic, meter, driveway,
    strip, median, retainWall, construction, crossingGap, regionsFor };
}


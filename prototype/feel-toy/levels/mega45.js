
  /* ================= MONUMENTS ================= */
  // After the districts are laid out: the monuments, public art you can ollie over, and the pipe
  // bridge across the spillway. Each is placed only where there's room, checked against what's built.
  const monChallenges = [];
  {
    const { posts } = K;
    // what's already there, in a coarse grid: [x0, z0, x1, z1, top]
    const GC = 8, grid = new Map(), cellsOf = (x0, z0, x1, z1, f) => { for (let i = Math.floor(x0 / GC); i <= Math.floor(x1 / GC); i++) for (let j = Math.floor(z0 / GC); j <= Math.floor(z1 / GC); j++) f(i * 4096 + j); };
    const mark = (r, top = 1e9, isBox = false) => { const e = [...r, top, isBox]; cellsOf(r[0], r[1], r[2], r[3], k => { if (!grid.has(k)) grid.set(k, []); grid.get(k).push(e); }); };
    const hubRect = h => { const dx = h.b.x - h.a.x, dz = h.b.z - h.a.z, L = Math.hypot(dx, dz) || 1, px = -dz / L * h.w / 2, pz = dx / L * h.w / 2;
      const xs = [h.a.x + px, h.a.x - px, h.b.x + px, h.b.x - px], zs = [h.a.z + pz, h.a.z - pz, h.b.z + pz, h.b.z - pz];
      return [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)]; };
    for (const b of boxes) mark([b.min[0], b.min[2], b.max[0], b.max[2]], b.max[1], true);
    for (const h of hubbas) mark(hubRect(h));
    for (const r of rails) mark([Math.min(r.a.x, r.b.x) - 0.3, Math.min(r.a.z, r.b.z) - 0.3, Math.max(r.a.x, r.b.x) + 0.3, Math.max(r.a.z, r.b.z) + 0.3]);
    for (const h of hazards) mark([h.x - 1, h.z - 1, h.x + 1, h.z + 1]);
    for (const [x, z] of posts) mark([x - 0.5, z - 0.5, x + 0.5, z + 0.5]);
    // room for something from x0,z0 to x1,z1 standing on a surface at y (lower things, like the sidewalk under it, don't count)
    function free(x0, z0, x1, z1, y, pad = 0.4) {
      const a0 = x0 - pad, b0 = z0 - pad, a1 = x1 + pad, b1 = z1 + pad; let ok = true;
      if (K.roads.some(r => a1 > r[0] && a0 < r[2] && b1 > r[1] && b0 < r[3])) return false;          // never out in the road
      cellsOf(a0, b0, a1, b1, k => { if (ok) for (const e of grid.get(k) || []) if (e[4] > y + 0.06 && a1 > e[0] && a0 < e[2] && b1 > e[1] && b0 < e[3]) { ok = false; break; } });
      if (!ok) return false;
      // and something to stand on at y under every corner: the ground, or the top of a sidewalk or a deck
      const held = (x, z) => { if (Math.abs(terrainH(x, z) - y) < 0.12) return true; let s = false;
        cellsOf(x, z, x, z, k => { for (const e of grid.get(k) || []) if (e[5] && Math.abs(e[4] - y) < 0.06 && x >= e[0] && x <= e[2] && z >= e[1] && z <= e[3]) s = true; }); return s; };
      return [[x0, z0], [x1, z0], [x0, z1], [x1, z1], [(x0 + x1) / 2, (z0 + z1) / 2]].every(([x, z]) => held(x, z) && terrainH(x, z) <= y + 0.05);
    }
    const take = (x0, z0, x1, z1) => mark([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]);
    // things standing on a surface at y (a sidewalk box top, a deck) rather than on the ground under it
    const At = (x0, z0, x1, z1, y, hgt, mat, extra) => { take(x0, z0, x1, z1); return B(x0, y - 0.3, z0, x1, y + hgt, z1, mat, extra); };

    /* ---------- monuments: things to trick over ---------- */
    // a monument you ollie over: push up a long ramp on to a deck, get your speed back along it, pop off
    // the end over the statue (low on its plinth) and land on the bank beyond. Gravity takes your speed
    // on the way up a kicker, so the height comes from the deck, not a launch ramp. The statue is drawn
    // by draw(put) in its own space: +x the way you jump, y up from the plinth top.
    function monument(id, name, x, z, axis, y, statue, draw, trick, hardTrick, district, reach = 36, snug = false) {
      const ax = axis === 'x', W = 5.2, D = 2.7, PL = 0.4;
      // along the jump, from the statue (0): ramp foot, ramp top, deck end, plinth, landing top, landing foot
      const pl = statue[0] + 0.3, U = { foot: -2.6 - 16 - 16, top: -2.6 - 16, edge: -2.6, pl, land: pl + 0.2, out: pl + 10.2 };   // the plinth just bigger than the statue
      let cx = x, cz = z, ok = false;
      const SW = W / 2 + (snug ? 0.5 : 5.4), rectAt = (px, pz) => ax ? [px + U.foot - 3, pz - SW, px + U.out + 8, pz + SW] : [px - SW, pz + U.foot - 3, px + SW, pz + U.out + 8];   // the plaza round it, and a clear run-out
      search: for (let r = 0; r <= reach; r += 4) for (const [du, dv] of r ? [[r, 0], [-r, 0], [0, r], [0, -r], [r, r], [-r, r], [r, -r], [-r, -r]] : [[0, 0]]) {
        const px = x + (ax ? du : dv), pz = z + (ax ? dv : du);
        if (free(...rectAt(px, pz), y, 0.8)) { cx = px; cz = pz; ok = true; break search; }
      }
      if (!ok) return null;
      take(...rectAt(cx, cz));
      const P = (u, w = 0) => ax ? V(cx + u, 0, cz + w) : V(cx + w, 0, cz + u);
      const rect = (u0, w0, u1, w1) => { const a = P(u0, w0), b = P(u1, w1); return [Math.min(a.x, b.x), Math.min(a.z, b.z), Math.max(a.x, b.x), Math.max(a.z, b.z)]; };
      const f = P(U.foot), t = P(U.top), l0 = P(U.land), l1 = P(U.out);
      hubbas.push({ a: V(t.x, y + D, t.z), b: V(f.x, y + 0.02, f.z), w: W, noRails: true, color: 0xb9b4a8 });              // the ramp up: a promenade ramp, rails both sides
      for (const sd of [-1, 1]) { const r0 = P(U.top, sd * (W / 2 + 0.12)), r1 = P(U.foot + 0.3, sd * (W / 2 + 0.12)); rail(r0.x, y + D + 0.9, r0.z, r1.x, y + 0.92, r1.z, 'Handrail'); }
      // steps down off the side of the terrace, for people on foot, with a rail
      if (!snug) { const along = ax ? cx : cz, at = (ax ? cz : cx) - W / 2; SET(ax ? 'z' : 'x', at, -1, along + U.edge - 4.6, along + U.edge - 0.6, y + D, y, 9, 0.32);
        rails.push(handrail(ax ? 'z' : 'x', at, -1, along + U.edge - 5.05, y + D, y, 9, 0.32)); }
      // round the statue: benches facing it, trees, the name on the plinth
      if (!snug) for (const sd of [-1, 1]) { const b0 = P(-1.6, sd * 4.6), b1 = P(1.6, sd * 5.2); bench(Math.min(b0.x, b1.x), Math.min(b0.z, b1.z), Math.max(b0.x, b1.x), Math.max(b0.z, b1.z));
        for (const u of [-9, 6.5]) { const tp = P(u, sd * 5); decorFns.push(D => D.tree(tp.x, y, tp.z)); } }
      { const pq = P(0, 1.52); decorFns.push(D => D.sign(name.toUpperCase(), pq.x, y + 0.2, pq.z, 1.8, 0.28, ax ? 0 : Math.PI / 2, '#e7d9a8', '#3a2f1e')); }
      { const [x0, z0, x1, z1] = rect(U.top, -W / 2, U.edge, W / 2); B(x0, y - 0.5, z0, x1, y + D, z1, 'marble', { edges: ax ? 'ns' : 'ew' }); }   // the deck, its sides grind
      { const e0 = P(U.edge, -W / 2), e1 = P(U.edge, W / 2); lip(e0.x, e0.z, e1.x, e1.z, y + D); }                            // its end, painted
      hubbas.push({ a: V(l0.x, y + D - 0.5, l0.z), b: V(l1.x, y + 0.02, l1.z), w: W + 1, noRails: true, color: 0xb9b4a8 });  // the landing bank
      { const [x0, z0, x1, z1] = rect(-U.pl, -1.5, U.pl, 1.5); B(x0, y - 0.4, z0, x1, y + PL, z1, 'marble', { edges: 'nswe' }); }   // the plinth
      { const [x0, z0, x1, z1] = rect(-statue[0], -statue[1], statue[0], statue[1]); B(x0, y + PL, z0, x1, y + PL + statue[2], z1, 'metal', { ghost: true }); }  // the statue: solid, drawn below
      const rot = ax ? 0 : -Math.PI / 2, cr = Math.cos(rot), sr = Math.sin(rot);
      decorFns.push(D => draw((geo, color, [lx, ly, lz], [rx, ry, rz] = [0, 0, 0], sc = [1, 1, 1], extra) =>
        D.add(geo, color, [cx + lx * cr + lz * sr, y + PL + ly, cz - lx * sr + lz * cr], [rx, ry + rot, rz], sc, extra)));
      // the challenges: clear it, and the hard one, a particular trick over it
      const from = [...rect(U.top - 0.5, -W / 2 - 0.5, U.edge + 0.6, W / 2 + 0.5), y + D - 0.3], to = [...rect(U.land - 0.4, -W / 2 - 1.5, U.out + 4, W / 2 + 1.5), y - 0.6, y + D];
      const go = P(U.foot - 4), yaw = ax ? -Math.PI / 2 : Math.PI, at = [cx, y + PL + statue[2] + 0.5, cz];
      monChallenges.push({ id: id, name: `${name} Gap`, desc: `Push up on to the deck and ollie the ${name.toLowerCase()}`, at, go: [go.x, y, go.z, yaw], kind: trick ? 'trick' : 'gap', ...(trick ? { trick } : {}), from, to },
        { id: id + '-hard', hard: true, name: `${hardTrick} the ${name}`, desc: `A ${hardTrick} clean over the ${name.toLowerCase()}`, at: [cx + (ax ? 0 : 0.6), at[1] + 0.6, cz + (ax ? 0.6 : 0)], go: [go.x, y, go.z, yaw], kind: 'trick', tricks: [hardTrick], from, to });
      dtSpots.push({ name: `The ${name} (${district})`, pos: V(go.x, y, go.z), yaw, area: rect(U.foot - 3, -W, U.out + 3, W) });
      return { cx, cz };
    }
    const S24 = (r = 1) => new THREE.SphereGeometry(r, 24, 18), CYL = (r0, r1, h, n = 24) => new THREE.CylinderGeometry(r0, r1, h, n), CONE = (r, h, n = 12) => new THREE.ConeGeometry(r, h, n);
    const BOX = (x, y, z) => new THREE.BoxGeometry(x, y, z), TOR = (R, r, arc = Math.PI * 2) => new THREE.TorusGeometry(R, r, 12, 32, arc);
    const MET = { metalness: 0.55, roughness: 0.38 };
    // the University: the night owl, the college mascot in bronze, watching you come
    monument('owl', 'Night Owl', 275, -345, 'x', 6, [0.75, 0.75, 2.0], put => {
      const br = 0x8c6a3c, dk = 0x5e4526, lt = 0xb48c55;
      put(S24(), br, [0, 0.78, 0], [0, 0, 0], [0.6, 0.8, 0.66], MET);                                   // body
      put(S24(), lt, [-0.24, 0.7, 0], [0, 0, 0], [0.42, 0.6, 0.5], MET);                               // breast
      for (const s of [-1, 1]) put(S24(), dk, [0.05, 0.82, s * 0.52], [s * 0.12, 0, 0], [0.32, 0.62, 0.16], MET);   // wings
      put(S24(), br, [-0.04, 1.52, 0], [0, 0, 0], [0.5, 0.44, 0.54], MET);                              // head
      for (const s of [-1, 1]) {
        put(CONE(0.11, 0.36, 10), dk, [0, 1.93, s * 0.3], [s * 0.4, 0, -0.1], [1, 1, 1], MET);           // ear tufts
        put(CYL(0.17, 0.17, 0.05), 0xf0cf63, [-0.45, 1.56, s * 0.19], [0, 0, Math.PI / 2], [1, 1, 1], { metalness: 0.2, roughness: 0.3, emissive: 0x3a2a08 });   // eyes
        put(CYL(0.075, 0.075, 0.06), 0x111111, [-0.48, 1.56, s * 0.19], [0, 0, Math.PI / 2]);           // pupils
        put(S24(), dk, [-0.32, 0.04, s * 0.2], [0, 0, 0], [0.2, 0.07, 0.13], MET);                       // feet
      }
      put(CONE(0.07, 0.22, 10), 0xc9a24a, [-0.5, 1.43, 0], [0, 0, Math.PI / 2 + 0.55], [1, 1, 1], MET); // beak
    }, null, 'Kickflip', 'University');
    // the Waterfront: a ship's anchor stood on end
    monument('anchor', 'Anchor', -30, 215, 'x', 0, [0.85, 0.3, 2.0], put => {
      const ir = 0x3b4148, MET2 = { metalness: 0.65, roughness: 0.45 };
      put(BOX(0.24, 1.72, 0.24), ir, [0, 0.96, 0], [0, 0, 0], [1, 1, 1], MET2);                          // shank
      put(TOR(0.22, 0.06), ir, [0, 2.0, 0], [0, 0, 0], [1, 1, 1], MET2);                        // ring
      put(BOX(0.18, 0.18, 1.4), 0x5a3a24, [0, 1.6, 0], [0, 0, 0], [1, 1, 1], { roughness: 0.8 });          // the stock, timber
      put(TOR(0.7, 0.11, Math.PI), ir, [0, 0.82, 0], [0, 0, Math.PI], [1, 1, 1], MET2);          // the crown and arms
      for (const s of [-1, 1]) put(CONE(0.2, 0.42, 4), ir, [s * 0.7, 0.98, 0], [0, Math.PI / 4, 0], [0.45, 1, 1], MET2);   // flukes
      put(TOR(0.5, 0.035, Math.PI * 1.3), 0xb9a77a, [0, 1.2, 0.14], [0, Math.PI / 2, 0.6], [1, 1, 1], { roughness: 0.9 });          // a rope looped over it
    }, null, 'Heelflip', 'Waterfront');
    // the Port: a ship's propeller, three bronze blades
    monument('prop', 'Propeller', 215, 225, 'x', 0, [1.05, 0.45, 2.05], put => {
      const bz = 0xb08a3a;
      put(BOX(0.3, 0.95, 0.3), 0x55595e, [0, 0.48, 0], [0, 0, 0], [1, 1, 1], MET);                      // the stand
      put(CYL(0.3, 0.24, 0.55), bz, [0, 1.0, 0], [Math.PI / 2, 0, 0], [1, 1, 1], MET);                    // the hub
      put(CONE(0.24, 0.3), bz, [0, 1.0, 0.42], [Math.PI / 2, 0, 0], [1, 1, 1], MET);
      for (let k = 0; k < 3; k++) { const a = k * Math.PI * 2 / 3 + 0.3;
        put(S24(), bz, [Math.sin(a) * 0.55, 1.0 + Math.cos(a) * 0.55, 0], [0, 0, -a], [0.26, 0.48, 0.06], MET); }           // blades
    }, null, '360 Flip', 'Port');
    // the Stadium: the big ball, on its tee
    monument('ball', 'Big Ball', 108, -282, 'z', 0, [0.95, 0.95, 1.95], put => {
      put(CYL(0.34, 0.42, 0.12), 0x6b6f75, [0, 0.06, 0]);
      put(S24(0.95), 0xf1efe8, [0, 1.0, 0]);
      for (const [rx, rz] of [[0, 0], [Math.PI / 2, 0], [0, Math.PI / 2]]) put(TOR(0.955, 0.022), 0x26282b, [0, 1.0, 0], [rx, 0, rz]);   // the seams
    }, null, 'Pop Shuvit', 'Stadium');
    // the Industrial park: a giant cog, rusted
    monument('gear', 'Big Gear', 245, 80, 'z', 0, [1.05, 0.25, 2.05], put => {
      const rust = 0x9a5a32, R2 = { metalness: 0.35, roughness: 0.7 };
      put(BOX(1.6, 0.3, 0.4), 0x55595e, [0, 0.12, 0]);
      put(CYL(0.82, 0.82, 0.32, 32), rust, [0, 1.0, 0], [Math.PI / 2, 0, 0], [1, 1, 1], R2);
      put(CYL(0.26, 0.26, 0.36, 18), 0x3a3d42, [0, 1.0, 0], [Math.PI / 2, 0, 0], [1, 1, 1], MET);
      for (let k = 0; k < 14; k++) { const a = k * Math.PI * 2 / 14; put(BOX(0.24, 0.26, 0.32), rust, [Math.sin(a) * 0.93, 1.0 + Math.cos(a) * 0.93, 0], [0, 0, -a], [1, 1, 1], R2); }
      for (let k = 0; k < 5; k++) { const a = k * Math.PI * 2 / 5; put(CYL(0.13, 0.13, 0.36, 12), 0x5c3a22, [Math.sin(a) * 0.52, 1.0 + Math.cos(a) * 0.52, 0], [Math.PI / 2, 0, 0]); }  // holes in the web
    }, null, 'Varial Kickflip', 'Industrial');
    // Hill Park, at the top of the hills: the doughnut off the old bakery's roof, put up as a joke
    monument('donut', 'Giant Doughnut', -350.5, -427, 'x', 28, [1.1, 0.4, 2.15], put => {
      put(TOR(0.72, 0.34), 0xc98a4a, [0, 1.08, 0]);
      put(TOR(0.72, 0.36, Math.PI), 0xf08cb4, [0, 1.08, 0], [0, 0, 0], [1.02, 1.02, 0.96]);                                   // the icing on top
      const C = [0xf6e05e, 0x6fd3f0, 0xffffff, 0x8ce07a, 0xff6f6f];
      for (let k = 0; k < 40; k++) { const a = 0.25 + ((k * 0.618) % 1) * (Math.PI - 0.5), rr = 0.72 + ((k * 0.37) % 1 - 0.5) * 0.36, side = k % 2 ? 1 : -1;
        put(BOX(0.12, 0.035, 0.035), C[k % C.length], [Math.cos(a) * rr, 1.08 + Math.sin(a) * rr, side * 0.33], [0, 0, k * 1.3]); }          // sprinkles, both faces
      put(BOX(0.8, 0.5, 0.36), 0x6b6f75, [0, 0.25, 0]);
    }, null, 'Hardflip', 'Hill Park', 8, true);

    /* ---------- the pipe bridge over the spillway ---------- */
    // a big water main across the spillway, about a metre off the slope: ollie it on the way down, flip it, or grind it across
    {
      const px = -326, sy = terrainH(px, 305), top = sy + 1.0, r = 0.32;
      B(px - r * 0.9, top - 2 * r, 286, px + r * 0.9, top, 324, 'metal', { ghost: true });
      rails.push({ a: V(px, top, 286.3), b: V(px, top, 323.7), kind: 'Pipe', post: false });
      decorFns.push(D => {
        D.add(CYL(r, r, 40, 24), 0x6b7682, [px, top - r, 305], [Math.PI / 2, 0, 0], [1, 1, 1], { metalness: 0.5, roughness: 0.45 });
        for (const z of [292, 299, 305, 311, 318]) D.add(CYL(r + 0.05, r + 0.05, 0.18, 24), 0x535c66, [px, top - r, z], [Math.PI / 2, 0, 0], [1, 1, 1], { metalness: 0.5, roughness: 0.5 });   // flanges
      });
      const FLIP = 'flip|shuv|Shove|Impossible|Varial';
      const from = [-349.5, 287, -327, 323, -10], to = [-325.2, 287, -300, 323, -10, 30];
      monChallenges.push(
        { id: 'pipe-bridge', name: 'Flip the Pipe Bridge', desc: 'Bomb the spillway and flip over the water main', at: [px, top + 0.6, 296], go: [-349, 24, 296, -Math.PI / 2], kind: 'trick', trick: FLIP, from, to },
        { id: 'pipe-grind', name: 'Grind the Pipe Bridge', desc: 'Grind across the water main over the spillway', at: [px, top + 0.6, 314], go: [-349, 24, 290, -Math.PI / 2], kind: 'grind', rail: 'Pipe', area: [px - 2, 286, px + 2, 324] },
        { id: 'pipe-tre', hard: true, name: '360 Flip the Pipe Bridge', desc: 'A 360 flip over the water main, at full speed down the spillway', at: [px, top + 1.2, 305], go: [-349, 24, 305, -Math.PI / 2], kind: 'trick', tricks: ['360 Flip'], from, to });
      dtSpots.push({ name: 'The Pipe Bridge (Dam)', pos: V(-349, 24, 305), yaw: -Math.PI / 2, area: [-350, 286, -311, 324] });
    }


    /* ---------- the West Boulevard frontage: real buildings, the spots in how they're built ---------- */
    // between the suburbs and the boulevard (x -180..-142), one building to a block, all facing the boulevard
    const { prop, bikeRack, trashCan, newsBoxes, hydrant, busStop } = K;
    const sign = (...a) => decorFns.push(D => D.sign(...a));
    const glass = (x0, y0, z0, x1, y1, z1) => prop(x0, y0, z0, x1, y1, z1, 0x24303b);
    const bush = (x, y, z, r = 0.5) => decorFns.push(D => D.add(new THREE.SphereGeometry(r, 12, 9), 0x4f7a3a, [x, y + r * 0.6, z], [0, 0, 0], [1, 0.75, 1], { roughness: 0.95 }));
    const flag = (x, z, color) => decorFns.push(D => { D.add(new THREE.CylinderGeometry(0.06, 0.08, 9, 8), 0xcfd2d6, [x, 4.5, z], [0, 0, 0], [1, 1, 1], { metalness: 0.6, roughness: 0.3 });
      D.add(new THREE.BoxGeometry(0.04, 1.1, 1.7), color, [x, 8.2, z + 0.9], [0, 0, 0], [1, 1, 1], { roughness: 0.8 }); });
    const umbrella = (x, y, z, color) => decorFns.push(D => { D.add(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), 0xdedad2, [x, y + 0.8, z]);
      D.add(new THREE.ConeGeometry(1.25, 0.5, 8), color, [x, y + 1.85, z], [0, 0, 0], [1, 1, 1], { roughness: 0.85 }); });
    const area = r => take(...r);
    {
      // HARBOR TOWER (z -120..-70): a glass office tower on a granite entry plaza two metres up. A wide
      // stair with three rails down the middle; to the north the plaza edge is a run of planters with a
      // bank below (ollie the planters, drop into the bank); to the south a seat wall on the edge, and the drop
      area([-181, -117, -141.5, -73]);
      building(-180, -112, -163, -78, 14, 0x6f8fa8, 'office');
      const T = 2.1;
      B(-163, -0.5, -116, -152, T, -74, 'marble', { edges: 'ns' });
      stairSpot('x', -152, 1, -100, -90, T, 0, 7, 0.42, { rails: [-100.45, -95, -89.55] });
      B(-153.4, T - 0.3, -114.5, -152.2, T + 0.6, -101.5, 'ledge', { edges: 'nswe' });                       // the planters along the edge
      for (let z = -113.5; z < -102; z += 2.4) bush(-152.8, T + 0.6, z, 0.45);
      hubbas.push({ a: V(-152, T, -108), b: V(-145.4, 0.02, -108), w: 13, noRails: true, color: 0xb9b4a8 });  // and the bank below them
      B(-152.8, T - 0.3, -88.6, -152.2, T + 0.45, -75.5, 'marble', { edges: 'ew' });                          // the seat wall above the drop
      lip(-152, -116, -152, -114.6, T); lip(-152, -101.4, -152, -100.5, T);
      for (const z of [-111, -104, -84, -79]) decorFns.push(D => D.tree(-158, T, z));                           // trees in grates on the plaza
      glass(-163.15, T, -97, -162.95, T + 2.6, -93); prop(-163, T + 2.9, -97.5, -159.8, T + 3.1, -92.5, 0x3a3f45);   // doors and the canopy
      sign('HARBOR TOWER', -162.9, T + 4.4, -95, 7.5, 0.9, Math.PI / 2, '#e9eef3', '#1f2a36', '600 %px Helvetica, Arial, sans-serif');
      flag(-144, -84, 0x2f5d8a); flag(-144, -81, 0xb23a32); flag(-144, -78, 0xf1efe8);
      bikeRack(-143, -116, true, 2.4); trashCan(-147.8, -101.6); trashCan(-147.8, -88.4);
    }
    {
      // THE CORNER CAFE and the METRO entrance (z -50..-10): tables out on a patio with a low wall round it,
      // and a sunken entrance down to the trains, a guard wall either side and rails down the stairs
      area([-181, -49.5, -141.5, -10.5]);
      building(-180, -48, -166, -34, 2, 0xb58b67, 'brick');
      B(-166, -0.5, -48, -156, 0.45, -36, 'plaza');
      B(-156.35, 0.2, -48, -156, 0.95, -43.1, 'ledge', { edges: 'ew' }); B(-156.35, 0.2, -40.9, -156, 0.95, -36, 'ledge', { edges: 'ew' });
      B(-166, 0.2, -36.35, -156, 0.95, -36, 'ledge', { edges: 'ns' }); B(-166, 0.2, -48, -156, 0.95, -47.65, 'ledge', { edges: 'ns' });
      SET('x', -156, 1, -43, -41, 0.45, 0, 2, 0.34); rails.push(handrail('x', -156, 1, -42, 0.45, 0, 2, 0.34));
      for (const x of [-163, -159.5]) for (const z of [-45.3, -42, -38.7]) { B(x - 0.45, 0.4, z - 0.45, x + 0.45, 1.2, z + 0.45, 'wood'); umbrella(x, 1.2, z, pick([0xb23a32, 0x2f5d3a, 0xe8e4da])); }
      prop(-166, 3.2, -48, -164.6, 3.35, -34, 0x2f5d3a);                                                     // the awning
      glass(-166.15, 0.45, -43, -165.95, 2.9, -40); sign('CORNER CAFE', -165.9, 4.3, -41, 6, 0.8, Math.PI / 2, '#f6e7c8', '#3a2a1e');
      bikeRack(-153, -34.5, true, 2.4);
      // the metro: a stairwell 3.6 m down to the doors
      feat(-163, -150, -24, -18, () => -3.6, 'set'); fine.push({ x0: -164, x1: -149, z0: -25, z1: -17, res: 0.5 });
      SET('x', -150, -1, -24, -18, 0, -3.6, 12, 0.32);
      for (const z of [-23.6, -21, -18.4]) rails.push(handrail('x', -150, -1, z, 0, -3.6, 12, 0.32));
      B(-163.4, -0.4, -18, -150, 0.6, -17.6, 'ledge', { edges: 'ns' }); B(-163.4, -0.4, -24.4, -150, 0.6, -24, 'ledge', { edges: 'ns' });   // the guard walls
      B(-163.4, -4.2, -24.4, -163, 0.6, -17.6, 'ledge', { edges: 'ew' });
      glass(-162.98, -3.6, -23, -162.8, -1.2, -19);
      prop(-154, 3.1, -24.6, -149.6, 3.2, -17.4, 0x6f8796);                                                   // the glass canopy
      B(-148.9, -0.2, -26.2, -148.5, 3.2, -25.8, 'metal'); sign('METRO', -148.7, 2.7, -25.75, 1.4, 0.5, 0, '#ffffff', '#c8432f', '800 %px Helvetica, Arial, sans-serif');
      B(-147.5, -0.2, -15.5, -145, 2.5, -12.5, 'car', { color: 0x2f5d3a }); sign('NEWS', -146.25, 2.2, -12.45, 2, 0.5, 0, '#f6e05e', '#1f2a1e');   // the newsstand
    }
    {
      // THE CITY MUSEUM (z 10..50): a colonnade on a podium, the museum steps all along the front, the
      // accessibility ramp down the north side with a rail each side, and the lawn bank on the south
      area([-181, 10.5, -141.5, 49.5]);
      building(-180, 20, -166, 42, 4, 0xd8d2c4, 'stone');
      const T = 1.5;
      B(-166, -0.5, 18, -156, T, 44, 'marble', { edges: '' });
      SET('x', -156, 1, 22, 40, T, 0, 5, 0.42); for (const z of [26, 31, 36]) rails.push(handrail('x', -156, 1, z, T, 0, 5, 0.42));
      lip(-156, 18, -156, 22, T); lip(-156, 40, -156, 44, T);
      for (let z = 21; z <= 41.1; z += 2.86) B(-165.6, T - 0.2, z - 0.4, -164.8, 7.2, z + 0.4, 'marble');           // the columns
      B(-166.2, 7.2, 19.6, -164.4, 8.3, 42.4, 'marble');                                                             // and what they carry
      B(-166, -0.5, 44, -160, T, 46.6, 'marble');                                                                   // the ramp's top landing
      hubbas.push({ a: V(-160, T, 45.3), b: V(-142.6, 0.02, 45.3), w: 2.2, noRails: true, color: 0xc4bfb3 });        // the ramp, 1 in 12
      for (const z of [44.1, 46.5]) rail(-160, T + 0.9, z, -142.6, 0.9, z, 'Handrail');
      hubbas.push({ a: V(-161, T, 18), b: V(-161, 0.02, 10.8), w: 10, noRails: true, color: 0x7d9a5b });            // the lawn, sloping to the street
      glass(-166.15, T, 28, -165.95, T + 3.2, 34); sign('CITY MUSEUM', -164.3, 7.75, 31, 9, 0.8, Math.PI / 2, '#2a2420', '#d8d2c4');
      bench(-150, 24, -149.4, 28); bench(-150, 34, -149.4, 38); for (const z of [21, 41]) decorFns.push(D => D.tree(-146, 0, z));
      prop(-146.8, 0, 30.4, -146.2, 2.2, 31.6, 0x2a2420); sign('NOW SHOWING · THE SEA', -146.15, 1.5, 31, 1.1, 1.4, Math.PI / 2, '#f3f1ea', '#2f5d8a', '700 %px Helvetica, Arial, sans-serif');
    }
    {
      // THE GARAGE (z 70..120): two levels of parking, the ramp up the boulevard side with a long rail
      // down its outside edge, cars on the roof
      area([-181, 70.5, -141.5, 119.5]);
      const T = 7;
      B(-176, -0.5, 76, -150, T, 116, 'garage', { edges: 'nswe' });
      B(-150, -0.5, 74, -144, T, 78, 'garage', { edges: 'n' });
      hubbas.push({ a: V(-147, T, 78), b: V(-147, 0.02, 116), w: 6, noRails: true, color: 0x9b9a95 });
      rail(-143.9, T + 0.9, 78, -143.9, 0.9, 116, 'Handrail');
      for (const [x, z] of [[-171, 82], [-171, 90.5], [-162, 82], [-162, 99], [-171, 107.5], [-162, 110]]) car(x, z, false, T);
      for (const z of [86, 104]) decorFns.push(D => D.lamp(-166.5, T, z, 1));
      B(-143.2, -0.2, 116.6, -141.8, 2.4, 118.2, 'car', { color: 0xd8d2c4 }); sign('PARK', -147, 2.6, 116.1, 3, 0.7, 0, '#ffffff', '#2f5d8a', '800 %px Helvetica, Arial, sans-serif');
    }

    /* ---------- everyday street furniture, where a city puts it ---------- */
    // at each corner a bin and the newspaper boxes; a hydrant by the curb; a bus stop near the end of
    // the block (on some blocks). Nothing is placed where there isn't room for it.
    const fits = (x0, z0, x1, z1, y = 0.15) => free(Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1), y, 0.5);
    function streetLife(axis, c, from, to, crossings, opt = {}) {
      const XY = (u, v) => axis === 'z' ? [v, u] : [u, v], cuts = [from, ...crossings.flatMap(k => [k - 11, k + 11]).filter(k => k > from && k < to), to].sort((a, b) => a - b);
      let block = 0;
      for (let i = 0; i < cuts.length - 1; i += 2) for (const s of [-1, 1]) {
        const u0 = cuts[i], u1 = cuts[i + 1]; if (u1 - u0 < 20) continue; block++;
        for (const u of [u0 + 2.5, u1 - 2.5]) { const [x, z] = XY(u, c + s * 9.3); if (fits(x - 0.4, z - 0.4, x + 0.4, z + 0.4)) { take(x - 0.4, z - 0.4, x + 0.4, z + 0.4); trashCan(x, z); } }
        { const [x, z] = XY(u0 + 4.2, c + s * 9.35); if (fits(x - 0.7, z - 0.7, x + 0.7, z + 0.7)) { take(x - 0.7, z - 0.7, x + 0.7, z + 0.7); newsBoxes(x, z, axis === 'x', 2); } }
        { const [x, z] = XY(u0 + 9, c + s * 6.45); if (fits(x - 0.3, z - 0.3, x + 0.3, z + 0.3)) { take(x - 0.3, z - 0.3, x + 0.3, z + 0.3); hydrant(x, z); } }
        if (opt.bus && block % 2 === 0) { const [x, z] = XY(u1 - 16, c + s * 8.7), [hx, hz] = axis === 'z' ? [0.9, 2.4] : [2.4, 0.9];
          if (fits(x - hx, z - hz, x + hx, z + hz)) { take(x - hx, z - hz, x + hx, z + hz); busStop(x, z, axis === 'x', s); } }
      }
    }
    for (const [axis, c, from, to, cr] of [['z', -130, -438, 286, [-130, 130, -40, 40]], ['z', 130, -438, 286, [-130, 130, -40, 40]], ['x', -130, -142, 438, [-130, 130, -40, 40]], ['x', 130, -345, 438, [-130, 130, -40, 40]]])
      streetLife(axis, c, from, to, cr, { bus: true });
    for (const a of [-380, -300, -220]) streetLife('z', a, -120, 120, [-60, 0, 60], { bus: a === -300 });
    for (const c of [-60, 0, 60]) streetLife('x', c, -440, -142, [-380, -300, -220]);

    /* ---------- more of the city: the stadium gates, a riverside hotel, the port authority, the fish market ---------- */
    const room = (r, y = 0) => free(...r, y, 0.3);
    if (room([-58, -229.6, 58, -203])) {
      // THE STADIUM GATES: ticket booths, the queue railings in front of the steps, the hall of champions wall, bollards to keep the cars out
      area([-58, -229.6, 58, -203]);
      for (const x of [-40, 34]) { B(x, -0.2, -226, x + 6, 2.8, -221, 'car', { color: 0x2f5d8a }); glass(x + 0.5, 1.0, -221.05, x + 5.5, 2.2, -220.9); sign('TICKETS', x + 3, 2.45, -220.85, 3.2, 0.5, 0, '#ffffff', '#c8432f', '800 %px Helvetica, Arial, sans-serif'); }
      for (let x = -10.8; x <= 10.81; x += 1.2) rail(x, 0.9, -227.6, x, 0.9, -225.4, 'Rail');                // the queue railings, one lane each
      for (const [x0, x1] of [[-50, -16], [16, 50]]) { B(x0, -0.3, -210.6, x1, 0.55, -210, 'marble', { edges: 'ns' });
        for (let x = x0 + 3; x < x1 - 2; x += 6) prop(x - 0.4, 0.15, -210.65, x + 0.4, 0.45, -210.6, 0xb08a3a); }   // the champions' plaques
      for (let x = -54; x <= 54; x += 3) if (Math.abs(x) > 7) B(x - 0.14, -0.2, -204.4, x + 0.14, 0.85, -204.1, 'metal');   // bollards
      for (const x of [-46, -26, 26, 46]) flag(x, -228.6, pick([0x2f5d8a, 0xc8432f, 0xf1efe8]));
      sign('PORT CITY STADIUM', -38, 4.6, -239.92, 14, 1.2, 0, '#f3f1ea', '#2f5d8a', '800 %px Helvetica, Arial, sans-serif');
      trashCan(-14, -214); trashCan(14, -214); bench(-30, -216, -26, -215.4); bench(26, -216, 30, -215.4);
    }
    if (room([22, 180, 118, 219])) {
      // THE RIVERVIEW HOTEL: a drive up on to the entry deck under the canopy, planters along its front edge (ollie them off the drop), stairs down the middle
      area([22, 180, 118, 219]);
      building(62, 197, 104, 218, 10, 0xcfc4ad, 'stone');
      B(60, -0.5, 186, 106, 1.2, 197, 'plaza', { edges: '' });
      hubbas.push({ a: V(60, 1.2, 191.5), b: V(48, 0.02, 191.5), w: 6, noRails: true, color: 0x9c9890 });     // the drive, up one end
      hubbas.push({ a: V(106, 1.2, 191.5), b: V(117, 0.02, 191.5), w: 6, noRails: true, color: 0x9c9890 });   // and down the other
      for (const [x0, x1] of [[61, 79.4], [86.6, 105]]) { B(x0, 0.9, 186, x1, 1.75, 187.1, 'ledge', { edges: 'nswe' }); for (let x = x0 + 1; x < x1 - 0.5; x += 2.2) bush(x, 1.75, 186.55, 0.42); }
      SET('z', 186, -1, 80, 86, 1.2, 0, 4, 0.36); rails.push(handrail('z', 186, -1, 79.55, 1.2, 0, 4, 0.36), handrail('z', 186, -1, 86.45, 1.2, 0, 4, 0.36));
      for (const x of [70, 96]) for (const z of [189, 196]) B(x - 0.3, 1.2, z - 0.3, x + 0.3, 5.4, z + 0.3, 'marble');   // the canopy's columns
      prop(68, 5.4, 187, 98, 5.7, 197, 0x3a3f45);
      glass(76, 1.2, 196.95, 90, 4.4, 197.05); car(83, 191.5, true, 1.2);
      sign('THE RIVERVIEW HOTEL', 83, 9.5, 196.9, 14, 1.3, Math.PI, '#f6e7c8', '#2a2420');
      flag(57, 188, 0x2f5d8a); flag(57, 194, 0xf1efe8);
    }
    if (room([292, 211, 364, 243])) {
      // THE PORT AUTHORITY: a concrete office on a raised terrace, a long three-stair with a rail, block benches, a bank off the east end
      area([292, 211, 364, 243]);
      building(300, 212, 350, 230, 5, 0x9c9890, 'stone');
      B(296, -0.5, 230, 354, 0.9, 238, 'plaza', { edges: 'ew' });
      SET('z', 238, 1, 312, 338, 0.9, 0, 3, 0.4); for (const x of [311.55, 325, 338.45]) rails.push(handrail('z', 238, 1, x, 0.9, 0, 3, 0.4));
      lip(296, 238, 311.5, 238, 0.9); lip(338.5, 238, 344, 238, 0.9);
      hubbas.push({ a: V(354, 0.9, 234), b: V(362.5, 0.02, 234), w: 8, noRails: true, color: 0xb2ada3 });
      for (const x of [300, 306, 344]) B(x, 0.6, 232, x + 3.2, 1.45, 233.2, 'ledge', { edges: 'nswe' });      // the block benches
      glass(318, 0.9, 229.9, 332, 3.6, 230.1); sign('PORT AUTHORITY', 325, 5.2, 230.08, 12, 1.0, 0, '#f3f1ea', '#3a3f45', '700 %px Helvetica, Arial, sans-serif');
      flag(358, 240, 0x2f5d8a);
    }
    if (room([348, 322, 432, 372])) {
      // THE FISH MARKET on the quay: an open shed, a loading platform along its back with a ramp and steps, steel tables, crates
      area([348, 322, 432, 372]);
      for (let x = 352; x <= 424.1; x += 8) for (const z of [340, 360]) B(x - 0.25, -0.2, z - 0.25, x + 0.25, 6, z + 0.25, 'metal');   // the shed's columns
      prop(350, 6, 338, 426, 6.4, 362, 0x6b7076); prop(350, 6.4, 337.9, 426, 7.2, 338.1, 0xd8d2c4);
      sign('FISH MARKET', 388, 6.8, 337.85, 16, 0.75, Math.PI, '#2f5d8a', '#d8d2c4', '800 %px Helvetica, Arial, sans-serif');
      B(352, -0.5, 361, 424, 1.2, 367, 'plaza', { edges: 'n' });                                               // the loading platform
      hubbas.push({ a: V(424, 1.2, 364), b: V(431, 0.02, 364), w: 5, noRails: true, color: 0xb2ada3 });
      SET('x', 352, -1, 362, 366, 1.2, 0, 4, 0.32); rails.push(handrail('x', 352, -1, 366.45, 1.2, 0, 4, 0.32));
      for (const x of [362, 376, 390, 404]) B(x, -0.2, 348, x + 6, 0.9, 349.2, 'metal', { edges: 'ns' });       // the steel tables
      for (const [x, z] of [[358, 345], [372, 352], [398, 344], [412, 353], [418, 346]]) B(x, -0.2, z, x + 1.2, 0.6 + (x % 3) * 0.3, z + 1.2, 'wood', { edges: 'nswe' });   // crates
      for (let x = 352; x <= 426; x += 5) B(x, -0.2, 323.6, x + 0.6, 0.55, 324.2, 'metal');                      // bollards along the quay
    }
  }

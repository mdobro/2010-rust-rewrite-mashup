/* The Arroyo: grind-line economy passes run by index.js after all the parts (same as Eastside's). */
/* Grind-line economy: box edges that run end to end along one line at one height (sidewalk boxes, ledges and
   walls built in pieces) become one K.rail each, and those boxes drop their edges. Same grind, fewer lines.
   A box edge is only merged when it has a neighbour; lone edges stay on their box (and keep their wax). */
function arroyo_budget_merge(K) {
  const segs = [], key = (ax, c, y) => ax + ':' + Math.round(c * 50) + ':' + Math.round(y * 50);
  for (const b of K.boxes) {                       // planters grind on their two long sides only; parked-car roofs not at all
    if (b.mat === 'car') b.edges = '';
    if (b.edges === 'nswe' && (b.mat === 'ledge' || b.mat === 'pad')) b.edges = b.max[0] - b.min[0] >= b.max[2] - b.min[2] ? 'ns' : 'we';
    // a bench, or anything under 0.8 m wide or 3 m long, grinds on one edge: the one over the lower ground (the street side)
    const dx = b.max[0] - b.min[0], dz = b.max[2] - b.min[2];
    if ((b.edges === 'ns' || b.edges === 'we' || b.edges === 'ew') && (b.mat === 'wood' || Math.min(dx, dz) < 0.8 || Math.max(dx, dz) < 3)) {
      const mx = (b.min[0] + b.max[0]) / 2, mz = (b.min[2] + b.max[2]) / 2;
      b.edges = b.edges === 'ns' ? (K.terrainH(mx, b.min[2] - 0.6) < K.terrainH(mx, b.max[2] + 0.6) ? 'n' : 's')
                                 : (K.terrainH(b.min[0] - 0.6, mz) < K.terrainH(b.max[0] + 0.6, mz) ? 'w' : 'e');
    }
  }
  for (const b of K.boxes) {
    const e = b.edges || ''; if (!e || b.mat === 'building') continue; const y = b.max[1];
    if (e.includes('n')) segs.push({ b, k: key('x', b.min[2], y), u0: b.min[0], u1: b.max[0], c: b.min[2], y, ax: 'x', e: 'n' });
    if (e.includes('s')) segs.push({ b, k: key('x', b.max[2], y), u0: b.min[0], u1: b.max[0], c: b.max[2], y, ax: 'x', e: 's' });
    if (e.includes('w')) segs.push({ b, k: key('z', b.min[0], y), u0: b.min[2], u1: b.max[2], c: b.min[0], y, ax: 'z', e: 'w' });
    if (e.includes('e')) segs.push({ b, k: key('z', b.max[0], y), u0: b.min[2], u1: b.max[2], c: b.max[0], y, ax: 'z', e: 'e' });
  }
  const groups = new Map(); for (const s of segs) { if (!groups.has(s.k)) groups.set(s.k, []); groups.get(s.k).push(s); }
  let merged = 0;
  for (const list of groups.values()) {
    list.sort((p, q) => p.u0 - q.u0);
    let run = [list[0]];
    const flush = () => {
      if (run.length > 1) {
        const s = run[0], u0 = s.u0, u1 = Math.max(...run.map(r => r.u1));
        if (s.ax === 'x') K.rails.push({ a: V(u0, s.y, s.c), b: V(u1, s.y, s.c), kind: 'Ledge', post: false });
        else K.rails.push({ a: V(s.c, s.y, u0), b: V(s.c, s.y, u1), kind: 'Ledge', post: false });
        for (const r of run) r.b.edges = r.b.edges.replace(r.e, '');
        merged += run.length - 1;
      }
    };
    for (let i = 1; i < list.length; i++) {
      const cur = list[i], end = Math.max(...run.map(r => r.u1));
      if (cur.u0 <= end + 0.05) run.push(cur); else { flush(); run = [cur]; }
    }
    flush();
  }
  return merged;
}
/* Sloped blocks laid in chords (K.strip, K.median, K.retainWall, sidewalks) where the ground is straight: chords that meet
   end to end and lie on one straight 3D line become one block. The drawn slab and both its grind lines are the same, there
   are just fewer of them. A chord is joined only when the joint lies within 1 cm of the merged line. */
function arroyo_budget_mergeSlabs(K) {
  const H = K.hubbas, q = v => Math.round(v.x * 100) + ',' + Math.round(v.y * 100) + ',' + Math.round(v.z * 100);
  const sig = h => [h.w, h.kind || '', !!h.noRails, h.color ?? ''].join('|');
  const ends = new Map(), dead = new Set();
  const add = (k, h) => { if (!ends.has(k)) ends.set(k, []); ends.get(k).push(h); };
  for (const h of H) if (!h.isHubba) { add(sig(h) + '@' + q(h.a), h); add(sig(h) + '@' + q(h.b), h); }
  const onLine = (p, a, b) => { const ab = b.clone().sub(a), t = p.clone().sub(a).dot(ab) / ab.lengthSq(); return t > 0 && t < 1 && p.distanceTo(a.clone().addScaledVector(ab, t)) < 0.01; };
  let n = 0;
  for (let pass = 0; pass < 2; pass++) for (const h of H) {
    if (dead.has(h) || h.isHubba) continue;
    for (;;) {
      const other = (ends.get(sig(h) + '@' + q(h.b)) || []).find(o => o !== h && !dead.has(o) && (q(o.a) === q(h.b) || q(o.b) === q(h.b)));
      if (!other) break;
      const far = q(other.a) === q(h.b) ? other.b : other.a;
      if (!onLine(h.b, h.a, far)) break;
      dead.add(other); h.b = far.clone(); add(sig(h) + '@' + q(h.b), h); n++;
    }
    if (h.a.y < h.b.y) { const t = h.a; h.a = h.b; h.b = t; }
  }
  const keep = H.filter(h => !dead.has(h)); H.length = 0; H.push(...keep);
  arroyo_budget_thinSlabs(K);
  return n;
}
/* Post-less grind lines (copings, curbs, merged ledges) that meet end to end on one straight line become one. */
function arroyo_budget_mergeRails(K) {
  const R = K.rails, q = v => Math.round(v.x * 100) + ',' + Math.round(v.y * 100) + ',' + Math.round(v.z * 100);
  const sig = r => r.kind + '|' + !!r.coping, ok = r => !r.post, ends = new Map(), dead = new Set();
  const add = (k, r) => { if (!ends.has(k)) ends.set(k, []); ends.get(k).push(r); };
  for (const r of R) if (ok(r)) { add(sig(r) + '@' + q(r.a), r); add(sig(r) + '@' + q(r.b), r); }
  const onLine = (p, a, b) => { const ab = b.clone().sub(a), t = p.clone().sub(a).dot(ab) / ab.lengthSq(); return t > 0 && t < 1 && p.distanceTo(a.clone().addScaledVector(ab, t)) < 0.01; };
  for (const r of R) {
    if (!ok(r) || dead.has(r)) continue;
    for (const endKey of ['b', 'a']) for (;;) {
      const at = r[endKey], o = (ends.get(sig(r) + '@' + q(at)) || []).find(o => o !== r && !dead.has(o));
      if (!o) break;
      const far = q(o.a) === q(at) ? o.b : o.a, near = endKey === 'b' ? r.a : r.b;
      if (!onLine(at, near, far)) break;
      dead.add(o); r[endKey] = far.clone(); add(sig(r) + '@' + q(far), r);
    }
  }
  const keep = R.filter(r => !dead.has(r)); R.length = 0; R.push(...keep);
}
/* Sloped blocks under 0.8 m wide (retaining walls, thin strips) grind on one edge only: the one over the lower ground. */
function arroyo_budget_thinSlabs(K) {
  for (const h of K.hubbas) {
    if (h.noRails || h.w >= 0.8) continue;
    const d = h.b.clone().sub(h.a); d.y = 0; const L = d.length(); if (L < 0.01) continue; d.divideScalar(L);
    const n = V(-d.z, 0, d.x), mid = h.a.clone().add(h.b).multiplyScalar(0.5), o = h.w / 2;
    const side = K.terrainH(mid.x + n.x * (o + 0.6), mid.z + n.z * (o + 0.6)) < K.terrainH(mid.x - n.x * (o + 0.6), mid.z - n.z * (o + 0.6)) ? 1 : -1;
    h.noRails = true;
    K.rails.push({ a: h.a.clone().addScaledVector(n, side * o), b: h.b.clone().addScaledVector(n, side * o), kind: h.kind || 'Hubba', post: false });
  }
}
/* Small street furniture (under 8 m long) grinds on its long sides only: four-edged pads and grate lids keep the two
   edges that run down the line, and benches and short ledges under 1.5 m wide keep one. */
function arroyo_budget_small(K) {
  for (const b of K.boxes) {
    if (b.mat === 'building' || !b.edges) continue;
    const dx = b.max[0] - b.min[0], dz = b.max[2] - b.min[2];
    if (Math.max(dx, dz) >= 8) continue;
    if (b.edges.length >= 3) b.edges = dx > dz + 0.01 ? 'ns' : 'we';
    // a bench or short ledge under 1.5 m wide: one edge, the one over the lower ground (else the first)
    if (Math.min(dx, dz) < 1.5 && b.edges.length === 2 && (b.edges === 'ns' || b.edges === 'sn' || b.edges === 'we' || b.edges === 'ew')) {
      const mx = (b.min[0] + b.max[0]) / 2, mz = (b.min[2] + b.max[2]) / 2;
      b.edges = b.edges.includes('n') ? (K.terrainH(mx, b.min[2] - 0.6) <= K.terrainH(mx, b.max[2] + 0.6) ? 'n' : 's')
                                      : (K.terrainH(b.min[0] - 0.6, mz) <= K.terrainH(b.max[0] + 0.6, mz) ? 'w' : 'e');
    }
  }
}

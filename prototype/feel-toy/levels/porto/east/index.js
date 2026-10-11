/* Eastside Hills (east): the Hill Bomb. Design: levels/porto/design/east.md. */
function porto_east(K, P) {
  const PL = east_plan(); P.ground(PL.ground); P.col(PL.col); P.surface(PL.surface);
  for (const r of PL.REGIONS) P.region(...r);
  east_spine(K, P, PL); east_west(K, P, PL); east_park(K, P, PL); east_south(K, P, PL);
  east_index_seams(K);
  east_index_life(P);
  east_index_merge(K); east_index_mergeSlabs(K); east_index_mergeRails(K);
  east_index_lines(P);
  P.travel('Eastside Hills', 610, -3.75, 318, Math.PI, 'district');
}
/* traffic, peds and skaters (section 10). Peds and skaters are block stand-ins past 38 m and only built in full up close (see personLod in index.html),
   so they cost little; ped counts are about three times what the first triangle budget allowed. */
function east_index_life(P) {
  P.traffic({ path: [[340, 560], [900, 560]], lane: 3.2, dir: 1, n: 3, speed: 10, r: 8 });
  P.traffic({ path: [[340, 560], [900, 560]], lane: 3.2, dir: -1, n: 3, speed: 10, r: 8 });
  P.traffic({ path: [[410, 290], [410, 830]], lane: 2.6, dir: 1, n: 2, speed: 9, r: 8 });
  P.traffic({ path: [[820, 290], [820, 830]], lane: 2.6, dir: -1, n: 2, speed: 9, r: 8 });
  P.peds({ path: [[692, 764], [800, 764]], n: 6 });
  P.peds({ path: [[420, 550], [880, 550], [880, 570], [420, 570]], n: 6 });
  P.peds({ path: [[430, 590], [484, 590], [484, 612], [430, 612]], n: 3 });
  P.npc({ kind: 'session', rail: [912, 456.3, 940, 456.3], start: 906, end: 946, back: 3.4, side: 1, speed: 5 });
  P.npc({ kind: 'session', rail: [700, 766, 740, 766], start: 694, end: 746, back: 3.4, side: 1, speed: 5 });
}
/* the streets in east_west's rect (the other parts declare their own), and the section 5 lines */
function east_index_lines(P) {
  P.line('Crest Road (west part)', [[400, 280], [560, 280]], 'push');
  P.line('Orchard Street (west part)', [[400, 430], [560, 430]], 'push');
  P.line('Crosstown Street (west part)', [[300, 560], [560, 560]], 'push', true);
  P.line('Mesa Street W (west part)', [[400, 700], [560, 700]], 'push');
  P.line('Bayview Road (west part)', [[330, 840], [560, 840]], 'push');
  P.line('Vista Street', [[410, 270], [410, 850]], 'push');
  P.line('Back Lane', [[340, 300], [340, 832]], 'push');
}
/* Grind-line economy: box edges that run end to end along one line at one height (sidewalk boxes, ledges and
   walls built in pieces) become one K.rail each, and those boxes drop their edges. Same grind, fewer lines.
   A box edge is only merged when it has a neighbour; lone edges stay on their box (and keep their wax). */
function east_index_merge(K) {
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
function east_index_mergeSlabs(K) {
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
  east_index_thinSlabs(K);
  return n;
}
/* Post-less grind lines (copings, curbs, merged ledges) that meet end to end on one straight line become one. */
function east_index_mergeRails(K) {
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
function east_index_thinSlabs(K) {
  for (const h of K.hubbas) {
    if (h.noRails || h.w >= 0.8) continue;
    const d = h.b.clone().sub(h.a); d.y = 0; const L = d.length(); if (L < 0.01) continue; d.divideScalar(L);
    const n = V(-d.z, 0, d.x), mid = h.a.clone().add(h.b).multiplyScalar(0.5), o = h.w / 2;
    const side = K.terrainH(mid.x + n.x * (o + 0.6), mid.z + n.z * (o + 0.6)) < K.terrainH(mid.x - n.x * (o + 0.6), mid.z - n.z * (o + 0.6)) ? 1 : -1;
    h.noRails = true;
    K.rails.push({ a: h.a.clone().addScaledVector(n, side * o), b: h.b.clone().addScaledVector(n, side * o), kind: h.kind || 'Hubba', post: false });
  }
}
/* Seams the parts don't own: the Crosstown sidewalks start at x 316 (the gate corridor is flush), so each gets a full-width
   curb ramp down to the flush paint; a rider who drifts across the cambered band onto the sidewalk line rolls up it. */
function east_index_seams(K) {
  for (const zc of [550.5, 569.5]) { const y = K.terrainH(316.2, zc) + 0.15;
    K.hubbas.push({ a: V(316, y, zc), b: V(314.4, K.terrainH(314.4, zc) + 0.01, zc), w: 5, noRails: true, color: 0xb9b5ab }); }
}

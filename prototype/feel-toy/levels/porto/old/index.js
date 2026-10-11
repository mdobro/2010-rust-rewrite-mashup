/* Old Town (old): a limewashed hill town that falls to the harbour in four steps. Design: levels/porto/design/old.md.
   Parts (spliced before this file): old_upper, old_market, old_harbour, each called as old_x(K, P, O) with O = old_plan(P.baseH). */
function porto_old(K, P) {
  const O = old_plan(P.baseH), b0 = K.boxes.length, r0 = K.rails.length;
  P.ground(O.ground); P.col(O.col); P.surface(O.surface);
  for (const r of O.regions) P.region(...r);
  if (typeof old_upper === 'function') old_upper(K, P, O);
  if (typeof old_market === 'function') old_market(K, P, O);
  if (typeof old_harbour === 'function') old_harbour(K, P, O);
  old_index_trim(K, O, b0, r0);
  old_index_life(P);
  old_index_lines(P);
  P.travel('Old Town', -100, K.terrainH(-100, 430), 430, Math.PI, 'district');
  old_index_landmarks(P);
}

/* the grind-line budget (CONTRACT 8): a box side shorter than 2.4 m (a bench end, a pad's short side, a bollard) does not
   grind; and rails of one kind that meet end to end and stay within 2 cm (a curb: 8 cm, lowered so it never stands over the curb top) of one straight line (curbs and ledges laid in
   chords down a vertical curve) become one rail. Neither changes what is skateable, only how many lines the engine indexes. */
function old_index_trim(K, O, b0, r0) {
  const zs = [250, 420, 435, 520, 560, 660, 750, 872], nearest = (arr, v) => arr.reduce((a, c) => Math.abs(c - v) < Math.abs(a - v) ? c : a);
  for (let i = b0; i < K.boxes.length; i++) {
    const b = K.boxes[i]; if (!b.edges) continue;
    const lx = b.max[0] - b.min[0], lz = b.max[2] - b.min[2];
    let e = [...b.edges].filter(c => ((c === 'n' || c === 's') ? lx : lz) >= 2.4).join('');
    // a thin box (a 0.6 m ledge, a bench, a table, a bumper) grinds on the side facing the nearest street; the 0.7 m rail
    // magnet catches it from the far side too
    const thin = Math.min(lx, lz), long = Math.max(lx, lz);
    if (thin <= 0.7 || (thin <= 1.25 && long < 4)) {
      const cx = (b.min[0] + b.max[0]) / 2, cz = (b.min[2] + b.max[2]) / 2;
      if (e.includes('n') && e.includes('s')) e = e.replace(nearest(zs, cz) < cz ? 's' : 'n', '');
      if (e.includes('w') && e.includes('e')) e = e.replace(nearest(O.axes, cx) < cx ? 'e' : 'w', '');
    }
    b.edges = e;
  }
  const R = K.rails.slice(r0), dead = new Set(), key = v => v.x.toFixed(2) + ',' + v.y.toFixed(2) + ',' + v.z.toFixed(2);
  const starts = new Map();
  R.forEach((r, i) => { if (!r.coping) { const k = r.kind + '|' + key(r.a); (starts.get(k) || starts.set(k, []).get(k)).push(i); } });
  const offLine = (a, b, p) => { const d = b.clone().sub(a), L2 = d.lengthSq(); if (L2 < 1e-6) return 0; const t = Math.max(0, Math.min(1, p.clone().sub(a).dot(d) / L2)); return a.clone().addScaledVector(d, t).distanceTo(p); };
  const lineY = (a, b, p) => { const d = b.clone().sub(a), L2 = d.x * d.x + d.z * d.z; return L2 < 1e-6 ? a.y : a.y + d.y * Math.max(0, Math.min(1, ((p.x - a.x) * d.x + (p.z - a.z) * d.z) / L2)); };
  for (let i = 0; i < R.length; i++) {
    const r = R[i]; if (dead.has(i) || r.coping) continue;
    const joints = [];
    for (;;) {
      const next = (starts.get(r.kind + '|' + key(r.b)) || []).find(j => j > i && !dead.has(j) && R[j].post === r.post);
      if (next === undefined) break;
      const nb = R[next].b, pts = [...joints, r.b];
      if (pts.some(p => offLine(r.a, nb, p) > (r.kind === 'Curb' ? 0.08 : 0.02))) break;
      joints.push(r.b.clone()); r.b = nb.clone(); dead.add(next);
    }
    // a curb chord across a sag would float over the curb: drop it until it nowhere stands above the curb top
    const up = Math.max(0, ...joints.map(p => lineY(r.a, r.b, p) - p.y));
    if (up > 0.005) { r.a.y -= up; r.b.y -= up; }
  }
  const keep = R.filter((r, i) => !dead.has(i));
  K.rails.length = r0; K.rails.push(...keep);
}

/* traffic, peds and skaters (design 10.3). Peds and skaters are block stand-ins past 38 m and only built in full up close (see personLod in index.html),
   so they cost little; ped counts are about three times what the first triangle budget allowed. */
function old_index_life(P) {
  P.traffic({ path: [[-40, 236], [-40, 396]], lane: 6.5, dir: 1, n: 2, speed: 9, r: 6 });
  P.traffic({ path: [[-40, 236], [-40, 396]], lane: 6.5, dir: -1, n: 2, speed: 9, r: 6 });
  P.traffic({ path: [[-200, 560], [120, 560], [120, 872], [-200, 872]], lane: 2.5, dir: 1, n: 3, speed: 9, r: 8 });
  P.traffic({ path: [[-200, 560], [120, 560], [120, 872], [-200, 872]], lane: 2.5, dir: -1, n: 3, speed: 9, r: 8 });
  P.traffic({ path: [[-320, 560], [-200, 560], [-200, 750], [-320, 750]], lane: 2.5, dir: 1, n: 2, speed: 8, r: 8 });
  P.peds({ path: [[-215, 410], [-35, 410], [-35, 462], [-215, 462]], n: 3 });          // Fountain Square
  P.peds({ path: [[-300, 553.5], [200, 553.5], [200, 566.5], [-300, 566.5]], n: 3 });  // Crosstown
  
  P.npc({ kind: 'session', rail: [-158, 438.3, -142, 438.3], start: -162, end: -138, back: 3.6, side: -1, speed: 5 });   // fountain wall
  P.npc({ kind: 'session', rail: [-183, 763.8, -50, 763.8], start: -150, end: -80, back: 3.4, side: -1, speed: 5.4 });  // Miradouro wall
}

/* every street, path and line of the district (CONTRACT 4). 'bomb' for the long 7 % and 11.6 % descents. */
function old_index_lines(P) {
  // streets on the slope
  P.line('Grand Boulevard', [[-40, 232], [-40, 400]], 'bomb');
  P.line('Market Street', [[-40, 470], [-40, 742]], 'bomb');
  P.line('The Steep', [[-200, 470], [-200, 906]], 'bomb');
  P.line('Lantern Street', [[120, 446], [120, 864]], 'bomb');
  P.line('Rampart Street', [[-320, 568], [-320, 864]], 'bomb');
  // benched cross streets
  P.line('Crosstown', [[-328, 560], [298, 560]], 'push');
  P.line('Terrace Road', [[-328, 750], [128, 750]], 'push');
  P.line('Harbour Wall Road', [[-328, 872], [128, 872]], 'push');
  // level lanes and paths
  P.line('Alto Walk', [[-332, 250], [212, 250]], 'push');
  P.line('Footbridge Lane', [[-418, 520], [-208, 520]], 'push');
  P.line('Lemon Lane', [[-25, 420], [92, 420]], 'push');
  P.line('Clock Lane', [[-192, 660], [-48, 660]], 'push');
  P.line('Fountain Square', [[-215, 435], [-30, 435]], 'push');
  P.line('Lemon Square', [[92, 425], [148, 425]], 'push');
  // alleys and walks on the slope
  P.line('Rope Walk', [[-320, 254], [-320, 516]], 'push');
  P.line('Saddler\'s Alley', [[-260, 254], [-260, 516]], 'push');
  P.line('Bishop\'s Steps', [[-117.5, 254], [-117.5, 358]], 'push');
  P.line('Bell Alley', [[-87, 254], [-87, 400]], 'push');
  P.line('Tile Works Alley', [[40, 250], [40, 412]], 'push');
  P.line('Rampart Alley', [[-320, 524], [-320, 552]], 'push');
  P.line('Convent Lane', [[-260, 650], [-260, 742]], 'push');
  P.line('Fishermen\'s Stairs', [[-34, 764], [-34, 864]], 'push');
  P.line('Wall Walk', [[-397, 256], [-397, 850]], 'push');
  // the doc's five lines (section 5)
  P.line('Santa Brisa Run', [[-130, 250], [-117.5, 262], [-117.5, 356], [-130, 380], [-150, 396], [-150, 430], [-150, 470], [-120, 478],
    [-120, 534], [-100, 548], [0, 548], [40, 548]], 'push', true);
  P.line('Tile Works to Pool Row', [[0, 250], [40, 256], [40, 414], [48, 420], [92, 420], [121, 425], [120, 446], [120, 798],
    [150, 798], [170, 800], [170, 832]], 'push', true);
  P.line('Rambla to the Sea', [[-40, 236], [-40, 380], [-70, 392], [-45, 430], [-40, 470], [-40, 742], [-40, 764], [-40, 864],
    [-42, 872], [-120, 872], [-200, 872], [-200, 906]], 'bomb', true);
  P.line('Rampart Run', [[-320, 254], [-320, 560], [-320, 600], [-262, 626], [-260, 650], [-260, 742], [-230, 760], [-200, 776],
    [-200, 854], [-200, 880]], 'bomb', true);
  P.line('Wash and Clock', [[-170, 560], [-134, 572], [-134, 604], [-130, 630], [-120, 651], [-120, 660], [-150, 660],
    [-192, 660], [-200, 660]], 'push', true);
}

/* the bell tower and the Sea Gate, seen from afar (design 11) */
function old_index_landmarks(P) {
  P.landmark({ at: [-173, -9.0, 365], near: 140, parts: [
    { shape: 'box', at: [0, 17, 0], size: [10, 34, 10], color: 0xe9e1cf },
    { shape: 'cone', at: [0, 38, 0], size: [7, 8, 7], color: 0xa94f32 },
    { shape: 'box', at: [23, 7, -16], size: [28, 14, 46], color: 0xe9e1cf },
    { shape: 'sphere', at: [23, 16, -25], size: [14, 10, 14], color: 0xc9b48a } ] });
  P.landmark({ at: [-200, -30.37, 767], near: 140, parts: [
    { shape: 'box', at: [-12, 7, 0], size: [8, 14, 10], color: 0xe9e1cf },
    { shape: 'box', at: [12, 7, 0], size: [8, 14, 10], color: 0xe9e1cf },
    { shape: 'box', at: [0, 10.25, 0], size: [16, 2.5, 8], color: 0xe9e1cf } ] });
}

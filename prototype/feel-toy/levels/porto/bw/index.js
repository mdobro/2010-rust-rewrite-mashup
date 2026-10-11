/* Boardwalk West (bw). Design: levels/porto/design/bw.md. Parts: bw_west, bw_park, bw_gardens, bw_east (each (K, P, PL)). */
function porto_bw(K, P) {
  const PL = bw_plan();
  // the plan's ground is already level across both ship gates (Harbour Road at YN, the boardwalk at YS); it reads the base only
  // for the edge hills (base - Bz), so it gets the base without the gate levelling (base.js levels the band itself)
  P.ground((x, z) => PL.ground(x, z, portoBaseRaw(x, z))); P.col(PL.col); P.surface(PL.surface);
  for (const r of PL.REGIONS) P.region(...r);
  if (typeof bw_west === 'function') bw_west(K, P, PL);
  if (typeof bw_park === 'function') bw_park(K, P, PL);
  if (typeof bw_gardens === 'function') bw_gardens(K, P, PL);
  if (typeof bw_east === 'function') bw_east(K, P, PL);
  bw_index_trim(K); bw_index_mergeEdges(K); bw_index_mergeRails(K);   // the grind-line budget (CONTRACT 8), same grinds
  bw_index_lines(P, PL);
  bw_index_life(P, PL);
  bw_index_challenges(P, PL);
  bw_index_landmarks(P, PL);
  P.travel('Boardwalk West', -200, PL.YS, 1150, -Math.PI / 2, 'district');
  P.travel('Harbour Bowl Complex', -520, PL.YN, 1000, 0, 'park');
  P.travel('The Drydock', -912, PL.YN, 1050, Math.PI, 'park');
  P.travel('Spillway Outlet', -700, -40.4, 930, Math.PI, 'spot');
  P.travel('Eel Run', -210, PL.YN, 950, Math.PI / 2, 'spot');
  P.travel('Long Pier', -336, PL.YS, 1170, Math.PI, 'spot');
  P.travel('Ferry Terminal', -112, PL.T3, 1060, Math.PI / 2, 'spot');
}
/* every street, path and line (the parts add the spots and pull-offs along them) */
function bw_index_lines(P, PL) {
  const YN = PL.YN;
  // streets and paths
  P.line('Quay Road', [[-968, 930], [-24, 930]], 'push', true);
  P.line('Harbour Road', [[-968, 1020], [-12, 1020]], 'push', true);
  P.line('Boardwalk', [[-866, 1150], [-4, 1150]], 'push', true);           // west of -871 is the Drydock: the Caisson Walk goes round it
  P.line('Caisson Walk', [[-866, 1174], [-978, 1174]], 'push');
  P.line('Slappy Strip', [[-864, 1160], [-24, 1160]], 'push', true);
  P.line('Net Loft Lane', [[-790, 930], [-790, 1142]], 'push');
  P.line('Ice House Lane', [[-40, 930], [-40, 1142]], 'push');
  P.line('Long Pier', [[-336, 1176], [-336, 1274]], 'push');
  P.line('Wheel Pier', [[-128, 1176], [-128, 1262]], 'push');
  P.line('Ferry Pier', [[-56, 1176], [-56, 1224]], 'push');
  P.line('West Mole', [[-982, 1176], [-982, 1282]], 'push');
  P.line('Park Promenade', [[-668, 943], [-216, 943]], 'push');
  P.line('Gardens Path', [[-575.5, 1030], [-575.5, 1094.5], [-430, 1094.5], [-430, 1086], [-420, 1086], [-343.5, 1086], [-343.5, 1098]], 'push');   // east of the bath-house wing (x -608..-580)
  P.line('Boatyard Lane', [[-960, 930], [-960, 1006], [-840, 1006]], 'push');
  // descents and the named lines
  P.line('Old Town Steep run', [[-200, 910], [-200, 1096], [-200, 1128], [-200, 1148]], 'bomb', true);
  P.line('Spillway Express', [[-700, 910], [-700, 944], [-700, 1032], [-700, 1120], [-700, 1136]], 'bomb', true);
  P.line('Eel Run', [[-218, 952], [-236, 952], [-266, 972], [-300, 954], [-334, 976], [-366, 956], [-396, 978], [-418, 966]], 'push', true);
  P.line('Steep to Bowl', [[-200, 944], [-200, 952], [-218, 952], [-266, 972], [-300, 954], [-334, 976], [-366, 956], [-396, 978], [-418, 966], [-500, 968], [-566, 968]], 'push', true);
  P.line('Gull Steps', [[-200, 1020], [-205, 1028], [-212, 1028], [-226, 1037], [-226, 1084], [-343.5, 1100], [-344, 1146], [-336.8, 1154], [-336.8, 1170], [-336, 1176], [-336, 1274]], 'push', true);   // down the steps between the rails at -351 and -336
  P.line('Ferry Rush', [[-200, 1020], [-120, 1020], [-120, 1033], [-120, 1044], [-62, 1044], [-54, 1050], [-54, 1068], [-54, 1136], [-61.2, 1150], [-61.2, 1168], [-56, 1180], [-56, 1222]], 'push', true);
  P.line('Dry Run', [[-912, 1010], [-912, 1056], [-911, 1100], [-911, 1160]], 'push', true);
}
/* traffic, peds and skaters. Peds and skaters are block stand-ins past 38 m and only built in full up close (see personLod in index.html),
   so they cost little; ped counts are about three times what the first triangle budget allowed. */
function bw_index_life(P, PL) {
  const loop = [[-790, 930], [-40, 930], [-40, 1020], [-790, 1020]];
  P.traffic({ path: loop, lane: 2.6, dir: 1, n: 4, speed: 9, r: 8 });
  P.traffic({ path: loop, lane: 2.6, dir: -1, n: 4, speed: 9, r: 8 });
  P.peds({ path: [[-780, 1148], [-20, 1148], [-20, 1158], [-780, 1158]], n: 3 });
  P.peds({ path: [[-960, 1015], [-20, 1015], [-20, 1025], [-960, 1025]], n: 3 });
  P.npc({ kind: 'session', rail: [-616, 962, -596, 962], start: -626, end: -586, back: 3.4, side: 1, speed: 5 });
}
function bw_index_challenges(P, PL) {
  const { YN, YS, T3 } = PL;
  P.challenge({ id: 'bw-snake-speed', name: 'Eel Run Express', desc: 'Hit 35 km/h in the Eel Run', at: [-226, YN - 1, 952], go: [-205, YN, 952, Math.PI / 2], kind: 'speed', speed: 9.7, area: [-432, 944, -212, 990, -45, -40] });
  P.challenge({ id: 'bw-deep-coping', name: 'Deep End Coping', desc: 'Grind the Deep End coping', at: [-500, YN + 0.4, 957], go: [-500, YN, 944, Math.PI], kind: 'grind', rail: 'Coping', area: [-512, 946, -474, 991, -41, -40] });
  P.challenge({ id: 'bw-anchor-gap', name: 'Anchor Gap', desc: 'Ollie the Anchor from the ramp deck', at: [-226, -37.5, 1056], go: [-226, -37.9, 1045, Math.PI], kind: 'gap', from: [-229, 1053, -223, 1070, -38.3, -37.5], to: [-229, 1073, -223, 1084, -40.6, -38.2] });
  P.challenge({ id: 'bw-terminal-kf', name: 'Kickflip the Terminal Eight', desc: 'Kickflip down the Terminal Eight', at: [-170, T3 + 0.3, 1054], go: [-158, T3, 1060, Math.PI / 2], kind: 'trick', trick: 'Kickflip', from: [-172, 1052, -168, 1068, -38.5, -37.8], to: [-186, 1052, -173, 1068, -41, -40] });
  P.challenge({ id: 'bw-slappy-line', name: 'Slappy Strip', desc: 'Three grinds on the Slappy curbs in one line, 2,500 points', at: [-600, YS + 0.3, 1160], go: [-640, YS, 1152, -Math.PI / 2], kind: 'line', pts: 2500, area: [-968, 1156, -24, 1168], need: [['grind', 3]] });
  P.challenge({ id: 'bw-pier-rail', name: 'Long Pier Rail', desc: 'Grind the Long Pier handrail for 4 seconds', at: [-336, YS + 1, 1180], go: [-336, YS, 1166, Math.PI], kind: 'grind', rail: 'Handrail', area: [-343, 1182, -329, 1274, -42, -40] });
  P.challenge({ id: 'bw-slab-heel', name: 'Heelflip the Slab', desc: 'Heelflip the Slab five-stair', at: [-632, -38.9, 960], go: [-622, -39.1, 960, Math.PI / 2], kind: 'trick', trick: 'Heelflip', from: [-634, 954, -630, 966, -39.4, -38.9], to: [-632, 954, -622, 966, -41, -40] });
  P.challenge({ id: 'bw-outlet-speed', hard: true, name: 'Spillway Express', desc: 'Hit 50 km/h in the Spillway Outlet', at: [-700, -43, 1000], go: [-700, -40.4, 930, Math.PI], kind: 'speed', speed: 13.9, area: [-728, 944, -672, 1136, -46, -40] });
  P.challenge({ id: 'bw-altar-gap', hard: true, name: 'Gap the Altars', desc: 'Gap from altar A over B to altar C', at: [-955, -41.8, 1104], go: [-955, -42, 1092, Math.PI], kind: 'gap', from: [-958, 1100, -952, 1168, -42.2, -41.6], to: [-946, 1100, -940, 1168, -45, -44.4] });
  P.challenge({ id: 'bw-legend', hard: true, name: 'Harbour Legend', desc: 'Land a 12,000 point combo in the Harbour Bowl Complex', at: [-560, YN, 1000], go: [-560, YN, 1000, 0], kind: 'score', pts: 12000, area: [-672, 940, -212, 1006, -45, -38] });
  const top = (x, z, y) => P.tape(x, z, y);
  top(-592, 1064, YN + 3.0); top(-943, 1165, -44.8); top(-982, 1280, YN); top(-700, 1020, PL.outletFloor(1020)); top(-150, 992, YN + 1.2);
}
function bw_index_landmarks(P, PL) {
  const { YN, YS } = PL;
  P.landmark({ at: [-128, YS, 1240], near: 160, parts: [
    { shape: 'sphere', at: [0, 24, 0], size: [46, 46, 1.6], color: 0xe8e4da },
    { shape: 'cyl', at: [0, 24, 0], size: [3, 2.4, 3], color: 0xc8432f, rotY: 0 },
    { shape: 'box', at: [-8, 12, -2], size: [1.2, 26, 1.2], color: 0x8a8f96 },
    { shape: 'box', at: [8, 12, 2], size: [1.2, 26, 1.2], color: 0x8a8f96 },
    { shape: 'box', at: [0, 1.5, 0], size: [16, 3, 16], color: 0xcfd2d6 },
  ] });
  P.landmark({ at: [-982, YN, 1288], near: 140, parts: [
    { shape: 'cyl', at: [0, 9, 0], size: [4.4, 18, 4.4], color: 0xf2f2ee },
    { shape: 'cyl', at: [0, 12, 0], size: [4.6, 3, 4.6], color: 0xc8432f },
    { shape: 'cyl', at: [0, 19.2, 0], size: [3, 2.4, 3], color: 0xffe9a8 },
    { shape: 'cone', at: [0, 21.6, 0], size: [3.6, 2.4, 3.6], color: 0xc8432f },
  ] });
}
/* K.street without its lamp-and-tree every 16 m on both sides (about 4 solid posts every 16 m, which blew the box budget):
   the same slots, thinned to a lamp every 32 m per side (staggered across the road) and a tree every 64 m per side. */
function bw_index_street(K, axis, c, from, to, y, crossings = [], opt = {}) {
  K.street(axis, c, from, to, y, crossings, Object.assign({}, opt, { lamps: false }));
  if (opt.noCurb || opt.lamps === false) return;
  const RW = opt.rw ?? 6, SW = opt.sw ?? 4;
  const cuts = [from, ...crossings.flatMap(k => [k - RW - SW, k + RW + SW]).filter(v => v > from && v < to), to].sort((a, b) => a - b);
  for (const side of [-1, 1]) for (let i = 0; i < cuts.length - 1; i += 2) {
    const u0 = cuts[i], u1 = cuts[i + 1]; if (u1 - u0 < 2) continue;
    let k = side < 0 ? 0 : 1;
    for (let u = u0 + 6; u < u1 - 3; u += 16, k++) {
      const vl = c + side * (RW + 0.6), vt = c + side * (RW + SW - 0.9);
      if (k % 2 === 0) { if (axis === 'z') K.lamp(vl, u, side); else { K.posts.push([u, vl]); K.decorFns.push(D => D.lamp(u, y, vl, side)); } }
      if (k % 4 === 1) axis === 'z' ? K.tree(vt, u + 8) : K.tree(u + 8, vt);
    }
  }
}
/* Grind-line economy (the east district's recipe): thin and small pieces grind on one edge, pads and planters on their two
   long sides, parked cars and anything under 2 m long not at all. */
function bw_index_trim(K) {
  for (const b of K.boxes) {
    const dx = b.max[0] - b.min[0], dz = b.max[2] - b.min[2];
    if (!b.edges || b.mat === 'building') continue;
    if (b.mat === 'car' || Math.max(dx, dz) < 2) { b.edges = ''; continue; }
    if (b.edges === 'nswe' && (b.mat === 'ledge' || b.mat === 'pad' || b.mat === 'wood')) b.edges = dx >= dz ? 'ns' : 'we';
    // a bench, or anything under 0.8 m wide or 3 m long, grinds on one edge: the one over the lower ground (the street side)
    if ((b.edges === 'ns' || b.edges === 'we' || b.edges === 'ew') && ((b.mat === 'wood' || b.mat === 'pad' || b.mat === 'garage') && Math.max(dx, dz) < 6 || Math.min(dx, dz) < 0.8 || Math.max(dx, dz) < 4.5)) {
      const mx = (b.min[0] + b.max[0]) / 2, mz = (b.min[2] + b.max[2]) / 2;
      b.edges = b.edges === 'ns' ? (K.terrainH(mx, b.min[2] - 0.6) < K.terrainH(mx, b.max[2] + 0.6) ? 'n' : 's')
                                 : (K.terrainH(b.min[0] - 0.6, mz) < K.terrainH(b.max[0] + 0.6, mz) ? 'w' : 'e');
    }
  }
}
/* box edges that run end to end along one line at one height (walls, curbs and ledges built in pieces) become one K.rail */
function bw_index_mergeEdges(K) {
  const segs = [], key = (ax, c, y) => ax + ':' + Math.round(c * 50) + ':' + Math.round(y * 50);
  for (const b of K.boxes) {
    const e = b.edges || ''; if (!e || b.mat === 'building') continue; const y = b.max[1];
    if (e.includes('n')) segs.push({ b, k: key('x', b.min[2], y), u0: b.min[0], u1: b.max[0], c: b.min[2], y, ax: 'x', e: 'n' });
    if (e.includes('s')) segs.push({ b, k: key('x', b.max[2], y), u0: b.min[0], u1: b.max[0], c: b.max[2], y, ax: 'x', e: 's' });
    if (e.includes('w')) segs.push({ b, k: key('z', b.min[0], y), u0: b.min[2], u1: b.max[2], c: b.min[0], y, ax: 'z', e: 'w' });
    if (e.includes('e')) segs.push({ b, k: key('z', b.max[0], y), u0: b.min[2], u1: b.max[2], c: b.max[0], y, ax: 'z', e: 'e' });
  }
  const groups = new Map(); for (const s of segs) { if (!groups.has(s.k)) groups.set(s.k, []); groups.get(s.k).push(s); }
  for (const list of groups.values()) {
    list.sort((p, q) => p.u0 - q.u0);
    let run = [list[0]];
    const flush = () => {
      if (run.length < 2) return;
      const s = run[0], u0 = s.u0, u1 = Math.max(...run.map(r => r.u1));
      K.rails.push(s.ax === 'x' ? { a: V(u0, s.y, s.c), b: V(u1, s.y, s.c), kind: 'Ledge', post: false } : { a: V(s.c, s.y, u0), b: V(s.c, s.y, u1), kind: 'Ledge', post: false });
      for (const r of run) r.b.edges = r.b.edges.replace(r.e, '');
    };
    for (let i = 1; i < list.length; i++) {
      const cur = list[i], end = Math.max(...run.map(r => r.u1));
      if (cur.u0 <= end + 0.05) run.push(cur); else { flush(); run = [cur]; }
    }
    flush();
  }
}
/* post-less grind lines (copings, merged ledges) that meet end to end on one straight line become one */
function bw_index_mergeRails(K) {
  const R = K.rails, q = v => Math.round(v.x * 100) + ',' + Math.round(v.y * 100) + ',' + Math.round(v.z * 100);
  const sig = r => r.kind + '|' + !!r.coping + '|' + !!r.paint, ends = new Map(), dead = new Set();
  const add = (k, r) => { if (!ends.has(k)) ends.set(k, []); ends.get(k).push(r); };
  for (const r of R) if (!r.post) { add(sig(r) + '@' + q(r.a), r); add(sig(r) + '@' + q(r.b), r); }
  const onLine = (p, a, b) => { const ab = b.clone().sub(a), t = p.clone().sub(a).dot(ab) / ab.lengthSq(); return t > 0 && t < 1 && p.distanceTo(a.clone().addScaledVector(ab, t)) < 0.01; };
  for (const r of R) {
    if (r.post || dead.has(r)) continue;
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

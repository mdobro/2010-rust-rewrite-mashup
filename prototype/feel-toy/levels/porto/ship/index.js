/* Shipyard East (ship): the plan, the ground, the parts, the lines and the life. Design: levels/porto/design/ship.md. */
function porto_ship(K, P) {
  const PL = ship_plan();
  P.ground(PL.ground);                                  // first, before anything reads terrainH
  P.col((x, z, h) => { const c = PL.col(x, z, h); return c == null ? null : new THREE.Color(c); });
  P.surface(PL.surface);
  for (const r of ship_index_regions()) P.region(...r);
  const nb0 = K.boxes.length;
  if (typeof ship_west === 'function') ship_west(K, P, PL);
  if (typeof ship_bays === 'function') ship_bays(K, P, PL);
  if (typeof ship_yard === 'function') ship_yard(K, P, PL);
  if (typeof ship_quay === 'function') ship_quay(K, P, PL);
  ship_index_trim(K, nb0);
  ship_index_lines(P);
  ship_index_life(P);
  P.challenge({ id: 'ship-score', name: 'Shipyard Line', desc: 'Land a 6,000 point line that starts anywhere in the shipyard', kind: 'score', pts: 6000,
    at: [600, PL.Y(975), 975], go: [600, PL.Y(980), 980, Math.PI], area: [0, 910, 1000, 1350] });
  P.travel('Shipyard East', 600, PL.Y(980), 980, Math.PI, 'district');
}
/* the grind-line budget (CONTRACT 8: 700): a small block (under 3 m across) that grinds on all four sides keeps only its two
   long sides (a block 3 m wide or less), and a loose pallet under 1.5 m long none: nobody misses the 1.4 m end of a planter.
   The Pallet Yard's stacks (x 620..700, z 926..940) keep theirs. */
function ship_index_trim(K, from) {
  for (let i = from; i < K.boxes.length; i++) {
    const b = K.boxes[i], e = b.edges || '';
    if (!(e.includes('n') && e.includes('s') && e.includes('w') && e.includes('e'))) continue;
    const dx = b.max[0] - b.min[0], dz = b.max[2] - b.min[2];
    const yard = b.min[0] >= 620 && b.max[0] <= 700 && b.min[2] >= 926 && b.max[2] <= 940;
    if (Math.max(dx, dz) < 1.5 && !yard) b.edges = '';
    else if (Math.min(dx, dz) <= 3) b.edges = dx >= dz ? 'ns' : 'ew';
  }
}
/* fine ground [x0, x1, z0, z1, res]. The kinks of the plate are not on the 8 m grid (only x 16 and 96 are), so the mesh
   cuts each corner by up to 4 cm: under the 10 cm the check allows, so only the quay face (the base falls 10 m over z 1180..1186, and ground steps 2.6 m at z 1180) is drawn finer, along the whole width. */
function ship_index_regions() {
  return [[0, 1000, 1176, 1192, 2], [968, 1000, 904, 1176, 2]];   // the quay face, and the toe of the map-edge hill
}
/* every street, path and line of the district (CONTRACT 4); main: true for the doc's five named lines (section 5) */
function ship_index_lines(P) {
  P.line('Gantry Road', [[600, 910], [600, 1186]], 'bomb');
  P.line('Harbour Road', [[0, 1020], [930, 1020]], 'push');
  P.line('Quay Road', [[96, 1120], [930, 1120]], 'push');
  P.line('Ropewalk Lane', [[16, 932], [589, 932]], 'push');
  P.line('Net Loft Lane', [[250, 932], [250, 1120]], 'push');
  P.line('Bay Lane', [[440, 932], [440, 1120]], 'push');
  P.line('Straddle Lane', [[770, 1034], [770, 1112]], 'push');
  P.line('Yard Entry Lane', [[618, 1034], [618, 1112]], 'push');
  P.line('Skyway Approach', [[944, 940], [944, 1112]], 'push');
  P.line('Quay Walk', [[0, 1150], [104, 1150]], 'push');
  P.line('Crane Quay', [[620, 1140], [940, 1140]], 'push');
  P.line('Skyway Roll-out', [[728, 951], [700, 951], [612, 951]], 'bomb');
  P.line('Bomb to the Bow', [[600, 910], [600, 1186], [600, 1310], [600, 1335]], 'bomb', true);
  P.line('Loading Bay Line', [[300, 932], [440, 932], [440, 1120], [529, 1120], [529, 1172]], 'push', true);
  P.line('Skyway to the Cranes', [[944, 1020], [944, 951], [732, 951], [700, 951], [612, 951], [612, 1040], [652, 1040], [652, 1063], [876, 1063], [880, 1120], [790, 1140], [690, 1150]], 'push', true);
  P.line('Fish Quay', [[8, 1024], [30, 1072], [90, 1072], [100, 1022], [140, 1022], [140, 985], [165, 1022], [165, 1040], [240, 1020], [250, 1100], [240, 1120], [110, 1122], [110, 1133], [198, 1133], [198, 1150], [100, 1150], [20, 1150]], 'push', true);
  P.line('Reefer Run', [[800, 1020], [906, 1020], [906, 1110], [900, 1120], [790, 1120], [720, 1135], [699, 1147], [699, 1173]], 'push', true);
}
/* traffic, peds and skaters (section 10). Each ped is about 22k triangles and each skater about 31k, so the doc's 22 peds
   and 4 skaters are cut to 7 peds and 3 skaters to stay inside the 450k triangle budget. Traffic never crosses x 593..607. */
function ship_index_life(P) {
  P.traffic({ path: [[250, 1020], [440, 1020], [440, 1120], [250, 1120]], lane: 3, dir: 1, n: 2, speed: 7, r: 6 });
  P.traffic({ path: [[250, 1020], [440, 1020], [440, 1120], [250, 1120]], lane: 3, dir: -1, n: 2, speed: 7, r: 6 });
  P.traffic({ path: [[618, 1020], [936, 1020], [936, 1120], [618, 1120]], lane: 3, dir: 1, n: 2, speed: 7, r: 6 });
  P.traffic({ path: [[618, 1020], [936, 1020], [936, 1120], [618, 1120]], lane: 3, dir: -1, n: 2, speed: 7, r: 6 });
  P.peds({ path: [[110, 1142], [196, 1142], [196, 1164], [110, 1164]], n: 2 });
  P.peds({ path: [[100, 1012], [240, 1012], [240, 1028], [100, 1028]], n: 1 });
  P.peds({ path: [[620, 1139], [940, 1139], [940, 1142], [620, 1142]], n: 2 });
  P.npc({ kind: 'loop', path: [[30, 932], [580, 932], [580, 936], [30, 936]], speed: 6 });
  P.npc({ kind: 'session', rail: [446, 942, 446, 960], start: 934, end: 966, back: 3, side: -1, speed: 5.4 });
  // designer review: the parts came in at about 262k triangles added, so two of the cut ones are back (about 75k):
  // the Port Authority forecourt (2 peds) and the Net Rack session
  P.peds({ path: [[108, 1002], [172, 1002], [172, 1008], [108, 1008]], n: 2 });
  P.npc({ kind: 'session', rail: [34, 1068, 54, 1068], start: 28, end: 60, back: 3, side: 1, speed: 5 });
}

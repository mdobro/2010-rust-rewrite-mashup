/* University (uni): College Hill. Design: levels/porto/design/uni.md. Parts: uni_hill, uni_town, uni_south (each called as (K, P, PL)). */
function porto_uni(K, P) {
  const PL = uni_plan();
  P.ground(PL.ground); P.col(PL.col); P.surface(PL.surface);
  uni_index_regions(P);
  uni_index_lines(P);
  if (typeof uni_hill === 'function') uni_hill(K, P, PL);
  if (typeof uni_town === 'function') uni_town(K, P, PL);
  if (typeof uni_south === 'function') uni_south(K, P, PL);
  uni_index_life(P);
  P.travel('University', 810, 6, 4, 0, 'district');
  P.challenge({ id: 'uni-legend', hard: true, name: 'College Hill Legend', desc: 'Land a 12,000 point line that starts anywhere on College Hill',
    at: [650, 6, -110], go: [650, 6, -112, Math.PI], kind: 'score', pts: 12000, area: [360, -230, 1000, 230] });
}
/* the fine regions (doc 2.2): non-overlapping, about 31,500 m2 */
function uni_index_regions(P) {
  P.region(496, 520, -208, 48, 2);    // west batter / Rampart Bank + the Avenue's top junction
  P.region(520, 912, 32, 40, 2);      // south batter under the Ramparts
  P.region(912, 968, 24, 48, 2);      // Rampart Bank East
  P.region(968, 1000, -230, 230, 2);  // the map-edge hills' rise (x 975..1005), ~0.9 m chord error at 8 m; also Rampart Bank East's end
  P.region(408, 496, -32, -8, 2);     // Avenue Bank north
  P.region(408, 496, 8, 32, 2);       // Avenue Bank south
  P.region(616, 640, 40, 120, 1);     // the Drive Bank into the Commons
  P.region(616, 640, 120, 208, 2);    // Drive west bank
  P.region(656, 680, 40, 208, 2);     // Drive east bank
  P.region(728, 912, 48, 56, 2); P.region(728, 912, 144, 152, 2);   // field bench edges
  P.region(728, 736, 56, 144, 2); P.region(904, 912, 56, 144, 2);
  P.region(496, 616, 104, 120, 2);    // Commons south edge
  P.region(496, 512, 48, 104, 2);     // Commons west edge
  P.region(952, 968, 152, 192, 0.5);  // DIY quarterpipe
}
/* every street, path and line of the district (CONTRACT 4). Main lines are the doc's section 5 lines L1..L5. */
function uni_index_lines(P) {
  // streets (section 3.2)
  P.line('Ridge Road', [[650, -228], [650, -120]], 'push');
  P.line('Campus Drive (plateau)', [[650, -120], [650, 32]], 'push');
  P.line('Campus Drive (descent)', [[650, 32], [650, 228]], 'bomb');
  P.line('University Avenue', [[520, 0], [360, 0]], 'bomb');
  P.line('University Avenue (plateau)', [[520, 0], [639, 0]], 'push');
  P.line('Gown Street', [[396, -208], [396, 208]], 'push');
  P.line('Mill Lane', [[396, 200], [974, 200]], 'push');
  P.line('Rampart Lane', [[496, -120], [496, -24]], 'push');
  P.line('Brow Walk', [[661, -123], [744, -123]], 'push');
  P.line('Field Walk', [[705, 44], [705, 192]], 'push');
  // paths and plazas
  P.line('Quad perimeter walk', [[728, -76], [892, -76], [892, 8], [728, 8], [728, -76]], 'push');
  P.line('Gallery Forecourt', [[524, 12], [636, 12]], 'push');
  P.line('Union Deck', [[520, 105], [600, 105]], 'push');
  P.line('Commons walk', [[516, 56], [620, 56]], 'push');
  P.line('Terrace Stands rim', [[736, 36], [904, 36]], 'push');
  P.line('Lecture Row walk', [[908, -112], [908, 0]], 'push');
  P.line('Car Park lane', [[473, -198], [473, -122]], 'push');
  P.line('Scholars Square walk', [[440, 68], [500, 68]], 'push');
  // L1 The Grand Descent (ridge to campus)
  P.line('The Grand Descent', [[650, -228], [650, -124], [714, -123], [714, -93], [722, -93], [810, -90], [810, 12], [820, 16], [820, 30], [778, 36], [778, 53],
    [740, 66], [705, 100], [705, 194], [680, 200], [650, 200], [650, 228]], 'push', true);
  // L2 The Avenue Bomb (plateau to the avenue gate)
  P.line('The Avenue Bomb', [[650, -40], [650, -12], [640, 0], [520, 0], [496, 0], [420, 0], [362, 0]], 'bomb', true);
  // L3 Arts to Commons
  P.line('Arts to Commons', [[570, -66], [584, -48], [584, -4], [572, 20], [572, 50], [610, 66], [637, 56], [637, 184], [650, 200], [650, 228]], 'push', true);
  // L4 The Rampart Run
  P.line('The Rampart Run', [[639, -45], [622, -45], [606, -45], [512, -44], [499, -44], [470, -44], [480, -30], [480, 22], [482, 56], [480, 80], [472, 105], [400, 104], [400, -68]], 'push', true);
  // L5 The Science Run
  P.line('The Science Run', [[650, -124], [664, -110], [664, -68], [690, -64], [704, -40], [704, 48], [705, 100], [705, 192], [720, 200], [940, 200], [940, 176]], 'push', true);
}
/* traffic, peds and skaters (section 10). Each ped is ~22k triangles and each skater ~31k, so the doc's counts are trimmed */
function uni_index_life(P) {
  P.traffic({ path: [[650, 0], [650, 200], [396, 200], [396, 0]], lane: 3.2, dir: 1, n: 3, speed: 9, r: 8 });
  P.traffic({ path: [[650, 0], [650, 200], [396, 200], [396, 0]], lane: 3.2, dir: -1, n: 3, speed: 9, r: 8 });
  P.traffic({ path: [[650, -210], [650, -10]], lane: 2.4, dir: 1, n: 2, speed: 10, r: 8 });
  P.peds({ path: [[726, -80], [894, -80], [894, 12], [726, 12]], n: 2 });
  P.peds({ path: [[387, -200], [405, -200], [405, 190], [387, 190]], n: 2 });
  P.peds({ path: [[516, 44], [620, 44], [620, 100], [516, 100]], n: 1 });
  P.npc({ kind: 'session', rail: [730, -93.7, 770, -93.7], start: 724, end: 776, back: 3.4, side: 1, speed: 5.4 });
  P.npc({ kind: 'session', rail: [524, 60.3, 548, 60.3], start: 518, end: 554, back: 3.4, side: 1, speed: 5 });
  P.npc({ kind: 'loop', path: [[732, -78], [888, -78], [888, 10], [732, 10]], speed: 6 });
}

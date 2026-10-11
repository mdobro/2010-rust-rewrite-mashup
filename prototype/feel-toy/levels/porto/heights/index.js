/* The Heights (heights): the ridge, four ways down. Design: levels/porto/design/heights.md.
   Parts (each takes K, P and the plan PL):
     heights_west(K, P, PL)   [-1000, -420, -650, -230]
     heights_switch(K, P, PL) [ -420,  100, -650, -230]
     heights_obs(K, P, PL)    [  100,  480, -650, -230]
     heights_east(K, P, PL)   [  480, 1000, -650, -230]
   Traffic, peds, NPC skaters, the district travel point and every P.line are registered here, not in the parts. */
function porto_heights(K, P) {
  const PL = heights_plan();
  const T = heights_terrain(PL, P.baseH);
  P.ground(T);                                   // first, before anything reads K.terrainH
  for (const r of [[-768,-632,-416,-360,1], [-720,-680,-592,-416,2], [-720,-680,-360,-240,2], [-368,-16,-584,-248,4],
                   [-936,-896,-424,-360,4], [-912,-896,-592,-424,4], [-888,-864,-520,-424,4], [-784,-760,-520,-424,4],
                   [472,504,-552,-328,4], [952,968,-552,-328,4], [208,232,-592,-240,4], [256,280,-592,-472,4],
                   [640,664,-592,-240,4], [864,880,-592,-360,4],
                   [-1000,-968,-618,-230,4], [968,1000,-618,-230,4], [-968,968,-650,-618,4], [-1000,-968,-650,-618,1], [968,1000,-650,-618,1],
                   [-1000,-968,-248,-230,2], [968,1000,-248,-230,2]]) P.region(...r);   // + the map-edge hills (not in the doc; the last two: where the border band blends the edge hill)
  const G = (x, z) => T(x, z, P.baseH(x, z));
  P.col(heights_col(PL, G));
  P.surface(heights_surface(PL, G));
  if (typeof heights_west === 'function') heights_west(K, P, PL);
  if (typeof heights_switch === 'function') heights_switch(K, P, PL);
  if (typeof heights_obs === 'function') heights_obs(K, P, PL);
  if (typeof heights_east === 'function') heights_east(K, P, PL);
  heights_index_life(P);
  heights_index_lines(P, PL);
  P.travel('The Heights', 24, 43.9, -578, Math.PI, 'district');
}
/* traffic, peds and skaters (design section 8). Peds and skaters are block stand-ins past 38 m and only built in full up close (see personLod in index.html),
   so they cost little; ped counts are about three times what the first triangle budget allowed. */
function heights_index_life(P) {
  const west = [[-76,-596], [-904,-596], [-904,-392], [-112,-392], [-86.5,-402.5], [-76,-428], [-86.5,-453.5], [-112,-464], [-272,-464],
                [-297.5,-474.5], [-308,-500], [-297.5,-525.5], [-272,-536], [-112,-536], [-86.5,-546.5], [-76,-572]];
  P.traffic({ path: west, lane: 2.0, dir: 1, n: 3, speed: 9, r: 8 });
  P.traffic({ path: west, lane: 2.0, dir: -1, n: 3, speed: 9, r: 8 });
  const east = [[650,-596], [872,-596], [872,-360], [650,-360]];
  P.traffic({ path: east, lane: 2.5, dir: 1, n: 3, speed: 10, r: 8 });
  P.traffic({ path: east, lane: 2.5, dir: -1, n: 3, speed: 10, r: 8 });
  P.traffic({ path: [[220,-596], [268,-596], [268,-476], [220,-476]], lane: 2.0, dir: 1, n: 2, speed: 8, r: 6 });
  P.peds({ path: [[-30,-586], [84,-586], [84,-563], [-30,-563]], n: 6 });
  P.peds({ path: [[234,-280], [298,-280], [298,-252], [234,-252]], n: 3 });
  P.peds({ path: [[504,-446.5], [952,-446.5], [952,-433.5], [504,-433.5]], n: 3 });
  P.peds({ path: [[504,-366.5], [952,-366.5], [952,-353.5], [504,-353.5]], n: 3 });
  P.npc({ kind: 'session', rail: [-20, -560.7, 60, -560.7], start: -34, end: 74, back: 3.4, side: -1, speed: 5 });     // brow ledge, from the plaza (north)
  P.npc({ kind: 'session', rail: [236, -466, 236, -436], start: -474, end: -428, back: 3.4, side: -1, speed: 5 });     // Observatory Ledge, podium-top (east) side
  P.npc({ kind: 'session', rail: [-660, -382.9, -632, -382.9], start: -668, end: -624, back: 3.4, side: -1, speed: 5 }); // Pump Curb, lane (north) side
}
/* points on a circle arc about c, radius R, angle a0 -> a1 (radians, x = cos, z = sin), n steps; the first point is left out */
function heights_index_arc(c, R, a0, a1, n) {
  const out = []; for (let i = 1; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]); }
  return out;
}
/* every street, path and line of the district */
function heights_index_lines(P, PL) {
  const S = PL.SW, h = Math.PI / 2, A = heights_index_arc;
  // the Yellow Line: entry stub, entry arc, legs 1-4 with the three hairpins, exit arc, the Chute to the gate
  const sw = [[-76, -596], [-76, -572], ...A(S.entry.c, S.entry.R, 0, h, 6),
    [-272, -536], ...A(S.hairpins[0].c, S.R, -h, -3 * h, 12),
    [-112, -464], ...A(S.hairpins[1].c, S.R, -h, h, 12),
    [-272, -392], ...A(S.hairpins[2].c, S.R, -h, -3 * h, 12),
    [-132, -320], ...A(S.exit.c, S.exit.R, -h, 0, 6),
    [-100, -288], [-100, -230]];
  P.line('The Yellow Line', sw, 'bomb', true);
  P.line('The Reservoir Run', [[-700, -590], [-700, -230]], 'bomb', true);
  P.line('Stargazer', [[170, -596], [166, -540], [166, -460], [200, -466], [232, -474], [240, -450], [252, -436], [252, -418], [252, -371], [252, -282], [250, -250], [250, -230]], 'bomb', true);
  P.line('Three Crests', [[650, -596], [650, -368], [703, -352], [703, -252], [680, -230]], 'bomb', true);
  P.line('Ridge Traverse', [[60, -596], [-76, -596], [-76, -572], ...A(S.entry.c, S.entry.R, 0, h, 6), [-192, -536], [-192, -472], [-272, -464], [-272, -392],
    [-632, -392], [-700, -386], [-700, -230]], 'bomb', true);
  P.line('Ridge Road', [[-968, -596], [960, -596]], 'push');
  P.line('Reservoir Lane', [[-904, -392], [-272, -392]], 'push');
  P.line('Tank Road', [[-904, -596], [-904, -392]], 'bomb');
  P.line('Tank Access Track', [[-896, -472], [-872, -472]], 'push');
  P.line('Observatory Road', [[220, -596], [220, -230]], 'bomb');
  P.line('Planetarium Drive', [[268, -596], [268, -470]], 'bomb');
  P.line('Stargazer Lane', [[170, -596], [170, -540]], 'push');
  P.line('Dome Service Lane', [[225, -476], [263, -476]], 'push');
  P.line('Ridge Road Descent', [[650, -596], [650, -230]], 'bomb');
  P.line('Crest Street', [[872, -596], [872, -368]], 'bomb');
  P.line('Upper Terrace', [[500, -520], [956, -520]], 'push');
  P.line('Middle Terrace', [[500, -440], [956, -440]], 'push');
  P.line('Lower Terrace', [[500, -360], [956, -360]], 'push');
  P.line('Ridge Park Path', [[703, -352], [703, -252]], 'push');
}

/* The Financial Core (fin): Downtown in its own coordinates (x, z -120..120, y 0), with the district built round it.
   Design: levels/porto/design/fin.md. Parts: fin_core, fin_north, fin_east, fin_west, each called as fin_x(K, P, PL)
   where PL = fin_plan(). Travel points are registered here only. */
function porto_fin(K, P) {
  const PL = fin_plan();
  P.ground(PL.ground); P.col(PL.col); P.surface(PL.surface);
  for (const r of PL.regions) P.region(...r);
  const spots = buildDowntown(K);
  for (const s of spots) P.spot(s.name, s.pos.x, s.pos.y, s.pos.z, s.yaw, s.area);
  if (typeof fin_core === 'function') fin_core(K, P, PL);
  if (typeof fin_north === 'function') fin_north(K, P, PL);
  if (typeof fin_east === 'function') fin_east(K, P, PL);
  if (typeof fin_west === 'function') fin_west(K, P, PL);
  fin_index_lines(P);
  fin_index_travel(P);
}
/* fast travel (design 9.6): the district front door is the map spawn facing the Corner Skate Shop */
function fin_index_travel(P) {
  P.travel('Financial Core', 61, 0.15, 71, 0, 'district');
  P.travel('City Hall', 40, 4.0, -176, Math.PI, 'spot');
  P.travel('Golden Nautilus', 220, 3.0, -108, Math.PI, 'spot');
  P.travel('Planter Alley', -150, 0, -44, Math.PI / 2, 'spot');
  P.travel('Alto Arena', -275, 6, 44, 0, 'spot');
  P.travel('Central Plaza', 19, 1.65, -22, Math.PI, 'spot');
  P.travel('Corner Skate Shop', 61, 1.05, 64, 0, 'spot');
  P.travel('Library Lane Skates', -106, 1.95, -94.5, 0, 'spot');
  P.travel('Bank Street Boards', -93.5, 1.05, 19.5, Math.PI / 2, 'spot');
}
/* every street, path and line of the district (CONTRACT 4): the streets are push lines, the five named lines of design 9.2 are main */
function fin_index_lines(P) {
  // streets and paths
  P.line('Switchback Road', [[-100, -230], [-100, -136]], 'push');
  P.line('Exchange Ring North', [[-140, -130], [140, -130]], 'push');
  P.line('Exchange Ring South', [[-140, 130], [140, 130]], 'push');
  P.line('Exchange Ring West', [[-130, -140], [-130, 140]], 'push');
  P.line('Exchange Ring East', [[130, -140], [130, 140]], 'push');
  P.line('Grand Boulevard', [[-40, 130], [-40, 230]], 'push');
  P.line('Metro Avenue', [[140, 0], [360, 0]], 'push');
  P.line('Observatory Promenade', [[220, -230], [220, -132]], 'push');
  P.line('Council Drive', [[0, -186], [-86, -186]], 'push');
  P.line('Treasury Ramp', [[80, -186], [138, -186]], 'push');
  P.line('Treasury Walk', [[138, -186], [214, -186]], 'push');
  P.line('Bourse Walk', [[-400, -144], [-150, -144]], 'push');
  P.line('Civic Walk', [[-86, -152], [80, -152]], 'push');
  P.line('Planter Alley', [[-146, -40], [-420, -40]], 'push');
  P.line('Alley North Terrace', [[-170, -53], [-400, -53]], 'push');
  P.line('Alley South Terrace', [[-170, -27], [-400, -27]], 'push');
  P.line('Metro Plaza', [[160, -60], [290, -60], [290, -20], [200, -20]], 'push');
  P.line('Long Pool Walk', [[200, 66], [272, 66], [272, 94], [200, 94], [200, 66]], 'push');
  P.line('Arena Concourse', [[-363, 31], [-187, 31], [-187, 169], [-363, 169], [-363, 31]], 'push');
  P.line('Arena Car Park', [[-387, 190], [-163, 190]], 'push');
  // the five named lines (design 9.2)
  P.line('Civic Line', [[-100, -228], [-100, -190], [-86, -186], [0, -186], [10, -183], [40, -183], [40, -170], [40, -150], [40, -120]], 'push', true);
  P.line('Treasury Line', [[76, -186], [138, -186], [200, -170], [220, -160], [220, -76], [220, -50], [247, -46], [262, -30], [250, 0], [205, 40], [205, 95], [205, 200], [190, 200]], 'push', true);
  P.line('Alley Line', [[-110, -40], [-146, -40], [-250, -40], [-404, -40], [-420, -40]], 'push', true);
  P.line('Bourse-Mint Line', [[-260, -190], [-260, -176], [-260, -150], [-270, -132], [-270, -80], [-270, -55], [-270, -40]], 'push', true);
  P.line('Boulevard Line', [[85, 176], [85, 160], [60, 148], [0, 146], [-40, 148], [-40, 229]], 'push', true);
}

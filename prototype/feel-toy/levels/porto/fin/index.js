/* The Financial Core: Downtown, in its own coordinates (x, z -120..120 at height 0), with the rest of
   the district built round it. (Starting point: just Downtown so far.) */
function porto_fin(K, P) {
  P.ground(() => 0);
  const spots = buildDowntown(K);
  for (const s of spots) P.spot(s.name, s.pos.x, s.pos.y, s.pos.z, s.yaw, s.area);
  const cp = spots.find(s => s.name === 'Central Plaza') || spots[0];
  P.travel('Financial Core', cp.pos.x, cp.pos.y, cp.pos.z, cp.yaw, 'district');
}

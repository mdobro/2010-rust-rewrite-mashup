/* Port City: a whole city, about 880 m square, in nine districts round a downtown core.
     north   Residential Hills (steep streets, crests, stoops, public stairways), the Stadium (ramped
             concourses over huge car parks), the University (a raised campus with big stair sets and banks)
     middle  the Suburbs (drained backyard pools, a school, a strip mall), Downtown (sixteen plaza blocks),
             the Industrial park (loading docks, a ditch, pipe racks, gravel)
     south   the Dam (a reservoir up a long hill, a spillway with a flip-bucket lip, dirt jumps), the
             Waterfront (river promenade, rail over the river, a road bridge), the Port (container yard,
             an unfinished freeway ramp that ends in mid-air, a dry dock)
   A concrete river runs across the south from the dam to the port. */
function levelMega() {
  const districts = [];
  const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  /* ---------- the land ---------- */
  // Residential Hills: up the hill to the north, flat at each cross street
  const NW_LEVELS = [[-150, 0], [-190, 7], [-210, 7], [-260, 14], [-280, 14], [-330, 21], [-350, 21], [-400, 28], [-440, 28]];
  const hillNW = z => { if (z >= -150) return 0; for (let i = 1; i < NW_LEVELS.length; i++) { const [za, ha] = NW_LEVELS[i - 1], [zb, hb] = NW_LEVELS[i]; if (z >= zb) return lerp(ha, hb, (za - z) / (za - zb)); } return 28; };
  // the river: a concrete channel 6 m deep across the south
  const RIV = { z0: 290, z1: 320, bank: 6, D: 6 };
  const riverH = z => z <= RIV.z0 || z >= RIV.z1 ? 0 : -RIV.D * Math.min(1, (z - RIV.z0) / RIV.bank, (RIV.z1 - z) / RIV.bank);
  function baseH(x, z) {
    if (x < -142 && z < -138) return hillNW(z) * sm((-142 - x) / 60);              // the hill's east face falls to the boulevard
    if (x < -130 && z > 130) {                                                       // the dam country
      if (x < -350) return 24;                                                       // the reservoir heights
      if (z > 286 && z < 324 && x < -311) {                                          // the spillway and its flip-bucket lip
        if (x <= -318) return lerp(24, -5.4, (x + 350) / 32);
        const t = (x + 318) / 7; return -5.4 + 1.6 * Math.sin(Math.min(t, 1) * Math.PI * 0.62);
      }
      if (z < RIV.z0) return 24 * sm((-x - 160) / 190) * sm((z - 130) / 30) * sm((280 - z) / 50); // the big hill up to the heights
      return riverH(z);
    }
    if (z > RIV.z0 && z < RIV.z1) return riverH(z);
    return 0;
  }
  const K = cityKit(baseH, 20240607);
  const { rnd, R, pick, col, boxes, hubbas, rails, hazards, fine, decorFns, feats, feat, terrainH, poolS, pool, hump,
    groundMin, groundMax, B, Bg, building, rail, cone, pothole, kicker, SET, stairSpot, lip, ledge, planter, pad, bench, tree, lamp,
    paintRect, dash, street, zebra, car, raisedPlaza, sunkenPlaza, fountainBowl, bankToWall, garage, loadingDock, containers, backyardPool } = K;


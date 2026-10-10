  /* ================= RESIDENTIAL HILLS (x -440..-142, z -440..-150) ================= */
  const NWAVE = [-400, -320, -240], NWX = [-410, -340, -270, -200];
  {
    // the avenues climb the hill; sidewalks follow it, flat at each cross street
    const kinks = NW_LEVELS.map(l => l[0]);
    for (const a of NWAVE) {
      for (let z = -440; z < -150; z += 6) if (!NWX.some(c => z + 3 > c - 10 && z < c + 10)) dash(a, z, a, z + 3);
      for (const side of [-1, 1]) {
        const lo = Math.min(a + side * 6, a + side * 10), hi = Math.max(a + side * 6, a + side * 10);
        const segs = [[-440, -420], [-400, -350], [-330, -280], [-260, -210], [-190, -150]];
        for (const [z0, z1] of segs) { const cz = [z0, ...kinks.filter(k => k > z0 && k < z1), z1];
          for (let i = 0; i < cz.length - 1; i++) { const za = cz[i], zb = cz[i + 1];
            if (Math.abs(hillNW(za) - hillNW(zb)) < 1e-6) boxes.push(box(lo, hillNW(za) - 0.6, za, hi, hillNW(za) + 0.15, zb, 'sidewalk', { edges: side < 0 ? 'e' : 'w' }));
            else hubbas.push({ a: V((lo + hi) / 2, hillNW(za) + 0.15, za), b: V((lo + hi) / 2, hillNW(zb) + 0.15, zb), w: 4, color: 0xc4c0b6, kind: 'Curb' }); } }
      }
      for (let z = -430; z < -150; z += 18) if (!NWX.some(c => Math.abs(z - c) < 14)) { lamp(a - 6.6, z, -1); tree(a + 9, z + 9); }
    }
    for (const c of NWX) { const y = hillNW(c); street('x', c, -440, -202, y, NWAVE, { rw: 6, sw: 4 }); for (const a of NWAVE) { zebra(a, c - 8, 'x'); zebra(a, c + 8, 'x'); } }
    // houses along the avenues, stoops on some, driveways that kick you off the curb
    for (const a of NWAVE) for (const side of [-1, 1]) for (const [z0, z1] of [[-400, -350], [-330, -280], [-260, -210], [-190, -152]]) for (let z = z0 + 4; z < z1 - 6; z += 11) {
      const xf = a + side * 10, x0 = xf + side * 3, x1 = xf + side * 15, g = hillNW(z + 4.5);
      building(Math.min(x0, x1), z, Math.max(x0, x1), z + 9, pick([2, 2, 3]), col(), 'brick');
      if (rnd() < 0.5) { // a stoop: a platform at the door, a few steps and a rail down to the sidewalk
        boxes.push(box(Math.min(xf + side * 1.8, xf + side * 3), g - 0.5, z + 3.2, Math.max(xf + side * 1.8, xf + side * 3), g + 1.0, z + 5.8, 'step'));
        SET('x', xf + side * 1.8, -side, z + 3.2, z + 5.8, g + 1.0, g + 0.15, 3, 0.45); rails.push(handrail('x', xf + side * 1.8, -side, z + 6.2, g + 1.0, g + 0.15, 3, 0.45));
      } else if (rnd() < 0.5) hubbas.push({ a: V(a + side * 6, g + 0.15, z + 4.5), b: V(a + side * 4.6, g + 0.01, z + 4.5), w: 3, noRails: true, color: 0xb9b5ab }); // a driveway cut: a little kicker off the road
    }
    // public stairways up the middle of each hill block: flights and landings with rails, straight up the hill
    for (const xm of [-360, -280]) for (const [zLow, zHigh] of [[-210, -260], [-280, -330], [-350, -400]]) {
      const yLow = hillNW(zLow), yHigh = hillNW(zHigh), flights = Math.round((yHigh - yLow) / 1.75), step = (zLow - zHigh) / flights;
      for (let f = 0; f < flights; f++) {
        const zTop = zHigh + f * step, top = yHigh - f * 1.75, bot = f === flights - 1 ? yLow + 0.15 : top - 1.75;
        SET('z', zTop, 1, xm - 2, xm + 2, top, bot, 7, 0.4);
        B(xm - 2.6, bot - 1, zTop + 2.4, xm + 2.6, bot, zTop + step, 'plaza', { edges: 'ew' });   // the landing / path to the next flight
        rails.push(handrail('z', zTop, 1, xm - 2.45, top, bot, 7, 0.4), handrail('z', zTop, 1, xm + 2.45, top, bot, 7, 0.4));
      }
    }
    // the hilltop park: an overlook wall, benches, and the long grass bank down the east face
    B(-440, 26, -440, -202, 28.5, -438, 'ledge');
    for (const x of [-380, -300, -230]) bench(x, -432, x + 5, -431.4);
    B(-215, 27, -436, -205, 28.45, -435.4, 'marble', { edges: 'ns' });
    // the east face: stairways down to the boulevard at each cross street, rails both sides
    for (const c of NWX) {
      let x = -202, top = hillNW(c) * sm(1);
      while (top > 0.3) { const face = (xx) => hillNW(c) * sm((-142 - xx) / 60);
        const run = 9 * 0.45, bot = Math.max(0.15, face(x + run + 3)); if (top - bot < 0.5) break;
        SET('x', x, 1, c - 2, c + 2, top, bot, 9, 0.45); rails.push(handrail('x', x, 1, c - 2.45, top, bot, 9, 0.45), handrail('x', x, 1, c + 2.45, top, bot, 9, 0.45));
        x += run; B(x - 0.4, Math.min(bot, face(x + 3)) - 1, c - 2.6, x + 3, bot, c + 2.6, 'plaza'); x += 3; top = bot; }
      if (x < -140) B(x - 0.4, -1, c - 2.6, -140, 0.15, c + 2.6, 'plaza');                 // the path on to the sidewalk
    }
  }

  /* ================= THE SUBURBS (x -440..-142, z -120..120) ================= */
  {
    const AV = [-380, -300, -220], ST = [-60, 0, 60];
    for (const a of AV) street('z', a, -120, 120, 0, ST); for (const c of ST) street('x', c, -440, -142, 0, AV);
    // houses with backyards; some backyards have a drained pool behind a fence with a gap in it
    let k = 0;
    for (const a of AV) for (const side of [-1, 1]) for (const [z0, z1] of [[-120, -69], [-51, -9], [9, 51], [69, 120]]) {
      if (a === -380 && side < 0 && (z0 === -120 || z0 === 69)) continue;               // the school and the mall go here
      for (let z = z0 + 3; z < z1 - 12; z += 16) {
        const x0 = a + side * 12, x1 = a + side * 24; building(Math.min(x0, x1), z, Math.max(x0, x1), z + 11, 2, col(), 'brick');
        if ((k++ % 3) === 0) { const px = a + side * 32, pz = z + 6; backyardPool(px, pz, 0);
          for (const [fx0, fz0, fx1, fz1] of [[px - 7, pz - 7, px + 7, pz - 6.92], [px - 7, pz + 6.92, px + 7, pz + 7], [px + side * 7, pz - 7, px + side * 7.08, pz + 7]]) B(fx0, -0.1, fz0, fx1, 1.6, fz1, 'wood');
          bench(px - 3, pz + 7.8, px + 3, pz + 8.3); }
      }
    }
    // the school: its yard sunk below the street with banks down into it, a 3-stair and rail from the doors
    building(-440, -120, -420, -70, 3, 0xc79b77);
    const Y = [-416, -394, -116, -73];
    feat(Y[0], Y[1], Y[2], Y[3], (x, z) => -1.6 * Math.min(1, Math.min(x - Y[0], Y[1] - x, z - Y[2], Y[3] - z) / 5));
    fine.push({ x0: Y[0], x1: Y[1], z0: Y[2], z1: Y[3], res: 0.5 });
    B(-420, -2, -100, -416, 0, -90, 'plaza'); SET('x', -416, 1, -99, -91, 0, -1.6, 5, 0.4); rails.push(handrail('x', -416, 1, -98.55, 0, -1.6, 5, 0.4));
    for (const z of [-110, -84]) B(-406, -1.8, z, -398, -1.15, z + 0.6, 'wood', { edges: 'ns' });
    // the strip mall: a raised walkway along the shops, a ramp with a rail, stairs, a car park with curb islands
    building(-440, 70, -420, 120, 2, 0xd9c7a2);
    B(-420, -0.5, 70, -414, 0.6, 120, 'sidewalk', { edges: 'e' });
    hubbas.push({ a: V(-417, 0.6, 70), b: V(-417, 0.02, 64), w: 3, noRails: true, color: 0xc4c0b6 }); rail(-415.35, 1.5, 70, -415.35, 0.92, 64.4, 'Handrail');
    SET('x', -414, 1, 90, 98, 0.6, 0, 3, 0.4); rails.push(handrail('x', -414, 1, 94, 0.6, 0, 3, 0.4));
    paintRect(-412, 70, -392, 120, 0x5d5f63, 0.006); for (let z = 72; z < 118; z += 3) dash(-412, z, -406, z, 0xf0ece2, 0.1);
    pad(-402, 82, -396, 108, 0.15); planter(-399.6, 94, -398.4, 95.2, 0.8);
    for (let i = 0; i < 5; i++) car(-409, 74 + i * 9, true); cone(-404, 112); cone(-402, 113); pothole(-395, 76);
  }

  /* ================= THE INDUSTRIAL PARK (x 142..440, z -120..120) ================= */
  {
    for (const c of [-50, 40]) street('x', c, 142, 440, 0, [], { noCurb: true }); street('z', 260, -120, 120, 0, [], { noCurb: true });
    // warehouses with loading docks and truck ramps
    for (const [x0, z0, x1, z1] of [[150, -118, 230, -64], [280, -118, 370, -64], [150, -36, 230, 26], [280, -36, 370, 26], [150, 54, 230, 118]]) {
      building(x0, z0, x1, z1, 3, pick([0x8a8f94, 0x9b8f7f, 0x7a8590]), 'stone');
      loadingDock(x0 + 6, z1, x1 - 14, 1);
    }
    // the ditch: a long concrete V-ditch to roll in and out of
    feat(392, 412, -120, 120, (x, z) => -2.6 * Math.max(0, 1 - Math.abs(x - 402) / 10));
    fine.push({ x0: 392, x1: 412, z0: -120, z1: 120, res: 1 });
    for (const z of [-80, 0, 80]) kicker(398, z, 1, 0, 2.2, 0.55);     // ply someone left at the bottom
    // pipe racks along the road, low rails of the rail spur, gravel and pallets
    // pipe racks along the yards beside the roads (not on them), broken where the cross road goes through, on steel supports
    for (const z of [-58.5, 48.5]) for (const [x0, x1] of [[150, 252], [268, 378]]) {
      rail(x0, 1.1, z, x1, 1.1, z, 'Pipe', false);
      for (let x = x0 + 0.5; x <= x1 - 0.4; x += (x1 - x0 - 1) / Math.round((x1 - x0) / 9)) B(x - 0.12, -0.2, z - 0.12, x + 0.12, 1.06, z + 0.12, 'metal');
    }
    rail(380, 0.15, -118, 380, 0.15, 118, 'Rail', false); rail(382.2, 0.15, -118, 382.2, 0.15, 118, 'Rail', false);
    hump(320, 82, 12, 3.2); hump(345, 100, 9, 2.2); fine.push({ x0: 300, x1: 360, z0: 66, z1: 112, res: 1 });
    for (const x of [234, 236, 238]) B(x, 0, 28, x + 1.2, 0.3, x === 238 ? 29.2 : 29.2, 'wood');
    kicker(226, 28.6, 1, 0, 2.4, 0.6); for (const x of [222, 224]) cone(x, 25);
  }

  /* ================= THE DAM (x -440..-142, z 130..440) ================= */
  {
    // the dam wall all along the reservoir heights, and walls either side of the spillway
    for (const [z0, z1] of [[128, 286], [324, 440]]) B(-352, -7, z0, -350, 24.5, z1, 'plaza', { edges: 'e' });
    B(-440, -1, 128, -352, 24.5, 130, 'plaza', { edges: 's' });
    for (const s of [286, 324]) { B(-350, -7, s - (s === 286 ? 2 : 0), -330, 25, s + (s === 286 ? 0 : 2), 'plaza'); B(-330, -7, s - (s === 286 ? 2 : 0), -311, 6, s + (s === 286 ? 0 : 2), 'plaza'); }
    fine.push({ x0: -352, x1: -305, z0: 286, z1: 324, res: 0.5 });
    // the reservoir, drained: a huge bowl in the heights
    feat(-440, -356, 250, 362, (x, z, h) => { const d = Math.hypot((x + 400) / 38, (z - 306) / 52); return d < 1 ? 24 - 8 * sm((1 - d) * 3) : h; });
    fine.push({ x0: -440, x1: -356, z0: 250, z1: 362, res: 1 });
    // the lookout on the heights: ledges and benches, a rail along the top of the hill road
    for (const z of [180, 220]) B(-345, 23, z, -338, 24.5, z + 0.6, 'marble', { edges: 'ns' });
    bench(-372, 200, -366, 200.6);
    for (let x = -340; x < -170; x += 12) { const y0 = terrainH(x, 166), y1 = terrainH(x + 12, 166); rail(x, y0 + 0.75, 166, x + 12, y1 + 0.75, 166, 'Rail'); }
    for (let x = -340; x < -165; x += 6) dash(x, 160, x + 3, 160);
    // across the river: the dirt jumps, lines of takeoffs and landings
    // a dirt start hill at the west end of each line to roll in from; the gaps get longer line by line
    for (const [zl, G, dip] of [[352, 2, 0.3], [382, 2.6, 0.6], [412, 3.2, 0.9]]) {
      feat(-350, -334, zl - 6, zl + 6, (xx, zz) => 4.5 * sm((-334 - xx) / 15) * sm((6 - Math.abs(zz - zl)) / 3), 'add');
      for (let x = -326; x < -180; x += 22) feat(x, x + 11 + G, zl - 3, zl + 3, (xx) => { const t = xx - x;
        return t < 4 ? 1.0 * (t / 4) ** 1.5 : t < 4 + G ? 1.0 - dip * Math.sin(Math.PI * (t - 4) / G) : 1.0 * Math.max(0, 1 - (t - 4 - G) / 7); }, 'add');
      fine.push({ x0: -352, x1: -160, z0: zl - 6, z1: zl + 6, res: 0.4 });
    }
  }

  /* ================= THE WATERFRONT (x -120..120, z 140..440) ================= */
  {
    // the promenade: a rail along the river wall, benches, long ledges, river steps down to the water
    for (const [x0, x1] of [[-120, -96], [-84, -76], [-64, -12], [12, 36], [48, 120]]) rail(x0, 0.95, 289.4, x1, 0.95, 289.4, 'Handrail');
    for (const x of [-90, 42]) { B(x - 6, -1, 286, x + 6, 0, 290, 'plaza'); SET('z', 290, 1, x - 5, x + 5, 0, -6, 16, 0.4); rails.push(handrail('z', 290, 1, x, 0, -6, 16, 0.4)); }
    for (let x = -110; x < 110; x += 24) { bench(x, 278, x + 6, 278.6); ledge(x + 10, 270, x + 20, 270.6, 0.5, 'marble'); }
    // the river steps: tiers of seating facing the water
    for (let k = 0; k < 5; k++) B(-40, -1, 250 + k * 1.2, 30, 2.25 - k * 0.45, 251.2 + k * 1.2, 'ledge', { edges: 's' });
    raisedPlaza(-110, 160, -60, 200, 1.4, 's'); bankToWall(60, 172, 100, 1.6, 5);
    fountainBowl(10, 190, 6, 1.8);
    // the road bridge, with banks under it on the south side; the footbridge, railed both sides
    B(-10, -1.4, 286, 10, 0, 324, 'garage', { edges: '' });
    rail(-10.4, 1.0, 286, -10.4, 1.0, 324, 'Handrail'); rail(10.4, 1.0, 286, 10.4, 1.0, 324, 'Handrail');
    B(-73, -0.6, 286, -67, 0.02, 324, 'wood', { edges: '' }); rail(-73.3, 0.95, 286, -73.3, 0.95, 324, 'Handrail'); rail(-66.7, 0.95, 286, -66.7, 0.95, 324, 'Handrail');
    for (let x = -100; x < 100; x += 30) tree(x, 230), tree(x + 15, 360);
    raisedPlaza(-60, 360, -10, 400, 1.2, 'n'); for (let k = 0; k < 4; k++) pad(20 + k * 22, 380, 34 + k * 22, 384, 0.18 + k * 0.08);
  }

  /* ================= THE PORT (x 142..440, z 140..440) ================= */
  {
    street('z', 260, 140, 250, 0, [], { noCurb: true }); street('x', 250, 142, 440, 0, [], { noCurb: true });
    // the container yard: rows with gaps between, stacks to climb, one leaning as a ramp
    for (let r = 0; r < 4; r++) containers(160, 150 + r * 9, 5, [1, 2, 1, 3, 2, 1, 2], true, 1.8 + r);
    hubbas.push({ a: V(166, 2.65, 179.3), b: V(166, 0.02, 188), w: 2.4, noRails: true, color: 0x2f6b8a });  // a plate leant up onto the last row
    // the unfinished freeway ramp: a long embankment that ends in mid-air, a gravel pile to land on
    hubbas.push({ a: V(340, 13, 270), b: V(196, 0.02, 270), w: 12, color: 0x9c9890 });
    // the landing: a gravel pile tipped against the end of the deck, steep enough to land on from 13 m
    hubbas.push({ a: V(340.05, 12.2, 270), b: V(370, 0.02, 270), w: 14, noRails: true, kind: 'Gravel', color: 0x8d8678 });
    hump(392, 262, 10, 2); fine.push({ x0: 380, x1: 404, z0: 250, z1: 274, res: 1 });
    for (const s of [-1, 1]) for (let x = 200; x < 338; x += 12) decorFns.push(D => D.lamp(x, 13 * (x - 196) / 144, 270 + s * 6.3, -s));
    // warehouses and the quay
    for (const [x0, z0, x1, z1] of [[380, 150, 438, 210], [300, 150, 360, 200]]) { building(x0, z0, x1, z1, 3, pick([0x8a8f94, 0x9b8f7f]), 'stone'); }
    // across the river: the dry dock, a huge empty basin to drop into; bollards and a crane along the quay
    pool(178, 342, 334, 426, [[poolS.rect(260, 380, 80, 44, 6), 9]], 0, 1);
    for (let x = 180; x < 340; x += 10) B(x, 0, 332, x + 0.7, 0.55, 332.7, 'metal', { edges: 'nswe' });
    for (const x of [200, 300]) { for (const z of [330, 430]) B(x, 0, z, x + 1.2, 18, z + 1.2, 'metal'); B(x, 18, 330, x + 1.2, 19.2, 431.2, 'metal'); }
  }

  /* ================= BOULEVARDS, BRIDGES, THE EDGE OF THE MAP ================= */
  street('z', -130, -438, 286, 0, [-130, 130, -40, 40], { lamps: true }); street('z', -130, 324, 438, 0, [], {});
  street('z', 130, -438, 286, 0, [-130, 130, -40, 40], {}); street('z', 130, 324, 438, 0, [], {});
  street('x', -130, -142, 438, 0, [-130, 130, -40, 40], {}); street('x', 130, -345, 438, 0, [-130, 130, -40, 40], {});
  for (const x of [-130, 130]) { B(x - 10, -1.4, 286, x + 10, 0, 324, 'garage'); rail(x - 10.4, 1.0, 286, x - 10.4, 1.0, 324, 'Handrail'); rail(x + 10.4, 1.0, 286, x + 10.4, 1.0, 324, 'Handrail'); }
  for (const [x0, z0, x1, z1, h] of [[-470, -470, 470, -440, 40], [-470, 440, 470, 470, 30], [-470, -440, -440, 440, 34], [440, -440, 470, 440, 34]])
    B(x0, -8, z0, x1, h, z1, 'building', { color: 0x7e7a75, tex: 'office' });
  for (const [x, z] of [[-130, -60], [130, 40], [-60, -130], [80, 130], [-130, 200], [130, -300]]) pothole(x + 3, z);

  for (const hz of hazards) hz.y = terrainH(hz.x, hz.z);

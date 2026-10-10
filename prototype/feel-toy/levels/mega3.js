  /* ================= DOWNTOWN (x, z -120..120): see buildDowntown ================= */
  const dtSpots = buildDowntown(K);

  /* ================= THE STADIUM (x -120..120, z -440..-140) ================= */
  {
    const cx = 0, cz = -300, W = 70, Dd = 50, CH = 6;
    building(cx - W, cz - Dd, cx + W, cz + Dd, 7, 0xb9b5ab, 'stone');                       // the stands
    for (const [x0, z0, x1, z1] of [[cx - W - 10, cz - Dd - 10, cx + W + 10, cz - Dd], [cx - W - 10, cz + Dd, cx + W + 10, cz + Dd + 10], [cx - W - 10, cz - Dd, cx - W, cz + Dd], [cx + W, cz - Dd, cx + W + 10, cz + Dd]])
      B(x0, -1, z0, x1, CH, z1, 'plaza', { edges: 'nswe' });                                // the concourse round it, 6 m up
    // long switchback ramps up to the concourse on the long sides, and big sets at the ends
    for (const s of [-1, 1]) {
      const zr = cz + s * (Dd + 10), xs = [cx - 60, cx + 20];
      for (const x of xs) hubbas.push({ a: V(x, CH, zr + s * 2.5), b: V(x + 34, 0.02, zr + s * 2.5), w: 5, color: 0xc4bfb3 });
      for (const x of xs) B(x - 6, -1, Math.min(zr, zr + s * 5), x, CH, Math.max(zr, zr + s * 5), 'plaza', { edges: s < 0 ? 'nw' : 'sw' });   // the landing at the top of each ramp
      for (const x of xs) rail(x + 0.3, CH + 0.95, zr + s * 5.15, x + 33.6, 0.97, zr + s * 5.15, 'Handrail');
      B(cx - 8, -1, zr, cx + 8, CH / 2, zr + s * 6, 'plaza');                                  // a landing halfway down the middle set
      SET('z', zr, s, cx - 6, cx + 6, CH, CH / 2, 8, 0.4); rails.push(handrail('z', zr, s, cx, CH, CH / 2, 8, 0.4));
      SET('z', zr + s * 6, s, cx - 6, cx + 6, CH / 2, 0, 8, 0.4); rails.push(handrail('z', zr + s * 6, s, cx, CH / 2, 0, 8, 0.4));
    }
    for (const s of [-1, 1]) { const xr = cx + s * (W + 10);
      stairSpot('x', xr, s, cz - 8, cz + 8, CH, 0, 20, 0.42, { rails: [cz - 8.45, cz + 8.45], hubbas: [cz] }); }
    // the car parks: bays, curb islands, light-pole bases, cart rails, speed bumps
    for (const zc of [-395, -175]) {
      paintRect(-112, zc - 22, 112, zc + 22, 0x5d5f63, 0.006);
      for (let x = -108; x < 108; x += 3) { dash(x, zc - 20, x, zc - 14, 0xf0ece2, 0.1); dash(x, zc + 14, x, zc + 20, 0xf0ece2, 0.1); }
      for (let x = -96; x <= 96; x += 32) { pad(x - 8, zc - 1.5, x + 8, zc + 1.5, 0.15); planter(x - 0.6, zc - 0.6, x + 0.6, zc + 0.6, 0.75); }
      for (let x = -80; x <= 80; x += 40) rail(x, 0.45, zc + 9, x + 6, 0.45, zc + 9, 'Rail');
      for (let k = 0; k < 6; k++) car(R(-100, 100), zc + pick([-17, 17]), false);
      pothole(R(-90, 90), zc + R(-8, 8)); pothole(R(-90, 90), zc + R(-8, 8));
    }
    // the park north of it: hills and a drained pond
    hump(-60, -430, 9, 2.6); hump(-25, -431, 7, 1.8); hump(80, -430, 9, 3);
    fine.push({ x0: -70, x1: -50, z0: -440, z1: -420, res: 1 }, { x0: -33, x1: -17, z0: -439, z1: -423, res: 1 }, { x0: 70, x1: 90, z0: -440, z1: -420, res: 1 });
    pool(12, 44, -438, -422, [[poolS.rect(28, -430, 15, 7, 3), 1.6]], 0, 0.4);
    for (const x of [-100, 0, 100]) bench(x, -420, x + 5, -419.4);
  }

  /* ================= THE UNIVERSITY (x 150..440, z -440..-150): a raised campus ================= */
  {
    const U = 6, ux0 = 172, uz1 = -172;                                                        // the campus is 6 m up
    B(ux0, -1, -438, 438, U, uz1, 'plaza', { edges: '' });
    // big sets down the south and west edges, in three flights, with banks beside them
    for (const x of [210, 300, 390]) {
      let top = U, z = uz1;
      for (let f = 0; f < 3; f++) { const bot = top - 2; SET('z', z, 1, x - 6, x + 6, top, bot, 8, 0.4); rails.push(handrail('z', z, 1, x - 2, top, bot, 8, 0.4), handrail('z', z, 1, x + 2, top, bot, 8, 0.4));
        hubbas.push(stairHubba('z', z, 1, x + 6.4, top, bot, 8, 0.4)); z += 7 * 0.4; if (f < 2) { B(x - 7, -1, z, x + 7, bot, z + 2.5, 'plaza'); z += 2.5; } top = bot; }
      hubbas.push({ a: V(x - 13, U, uz1), b: V(x - 13, 0.02, uz1 + 16), w: 10, noRails: true, color: 0xc4bfb3 });   // the bank beside
    }
    for (const z of [-390, -290]) { let top = U, x = ux0;
      for (let f = 0; f < 3; f++) { const bot = top - 2; SET('x', x, -1, z - 6, z + 6, top, bot, 8, 0.4); rails.push(handrail('x', x, -1, z, top, bot, 8, 0.4)); x -= 7 * 0.4; if (f < 2) { B(x - 2.5, -1, z - 7, x, bot, z + 7, 'plaza'); x -= 2.5; } top = bot; } }
    lip(ux0, uz1, 202.95, uz1, U); lip(217.05, uz1, 292.95, uz1, U); lip(307.05, uz1, 382.95, uz1, U); lip(397.05, uz1, 438, uz1, U);
    // the quad: lawns, lecture halls, long ledges along the walks
    for (const [x0, z0, x1, z1] of [[190, -420, 260, -360], [290, -420, 360, -360], [190, -330, 260, -260], [290, -330, 360, -260]]) {
      paintRect(x0, z0, x1, z1, 0x7d9a5b, U + 0.01);
      for (const z of [z0 - 3, z1 + 2.4]) B(x0 + 4, U - 0.2, z, x1 - 4, U + 0.45, z + 0.6, 'marble', { edges: 'ns' });
    }
    for (const [x0, z0, x1, z1, f] of [[180, -438, 270, -428, 4], [280, -438, 370, -428, 4], [380, -438, 436, -380, 6], [380, -340, 436, -290, 5], [380, -250, 436, -200, 3]])
      B(x0, U - 1, z0, x1, U + f * 3.4, z1, 'building', { color: col(), tex: pick(['brick', 'stone']) });
    // the library on its podium, with a long set and rails
    B(270, U - 1, -250, 360, U + 3.2, -230, 'marble', { edges: 'ew' }); B(280, U + 3.2, -250, 350, U + 20, -240, 'building', { color: 0xd8d2c4, tex: 'stone' });
    stairSpot('z', -230, 1, 305, 325, U + 3.2, U, 8, 0.42, { rails: [310, 315, 320], hubbas: [304.6, 325.4] });
    lip(270, -230, 304.25, -230, U + 3.2); lip(325.75, -230, 360, -230, U + 3.2);
    // the amphitheatre: tiers of seating down to a stage
    for (let k = 0; k < 6; k++) B(196 + k * 1.6, U - 0.2, -250, 197.6 + k * 1.6, U + 2.7 - k * 0.45, -210, 'ledge', { edges: 'e' });
    B(206, U - 0.2, -246, 214, U + 0.6, -214, 'wood', { edges: 'ew' });
    // a sculpture plaza: a big bank up to a wall, and a hubba
    bankToWall(380, -186, 420, U + 2.2 - U, 5); for (const b of boxes.slice(-1)) { b.min[1] = U - 0.5; b.max[1] = U + 2.2 + 0.9; } hubbas.at(-1).a.y = U + 2.2; hubbas.at(-1).b.y = U + 0.02;
  }

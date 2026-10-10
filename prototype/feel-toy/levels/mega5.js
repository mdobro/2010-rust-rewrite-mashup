  /* ---------- the ground: coarse where it's flat, finer on hills, finest round pools and jumps ---------- */
  const C = c => new THREE.Color(c);
  const concrete = C(0xb3afa6), grass = C(0x7d9a5b), asphalt = C(0x56585d), dirtC = C(0x8f7a5a), chanC = C(0xb7b3a9), plazaC = C(0xc4bfb5), poolC = C(0xb7b8b2), tile = C(0x3d7fae), lot = C(0x6a6c70);
  const inNWRoad = (x, z) => NWAVE.some(a => Math.abs(x - a) < 6) || NWX.some(c => Math.abs(z - c) < 6 && x < -202);
  const groundCol = (x, z, h) => {
    const dc = K.dtCol(x, z); if (dc) return dc;
    if (z > RIV.z0 && z < RIV.z1 && x > -350) return chanC;
    if (x < -142 && z < -150) return inNWRoad(x, z) ? asphalt : x > -202 ? grass : concrete;
    if (x < -130 && z > 130) return x < -352 ? (h < 23.5 ? chanC : concrete) : z > 330 ? dirtC : grass;
    if (x > -130 && x < 130 && z < -140) return z < -412 ? grass : concrete;
    if (x > 140 && z > 140 && z < 290) return lot;
    if (x > -130 && x < 130 && z > 140) return z > 230 && z < 262 ? grass : plazaC;
    return concrete;
  };
  const poolCol = (x, z, h) => { const g = baseH(x, z); return h > g - 0.32 && h < g - 0.015 ? tile : h < g - 0.015 ? poolC : groundCol(x, z, h); };
  // the ground: big coarse patches leave out the cells that finer patches cover (fine patches snap to an 8 m grid)
  const snap = f => ({ ...f, x0: Math.floor(f.x0 / 8) * 8, x1: Math.ceil(f.x1 / 8) * 8, z0: Math.floor(f.z0 / 8) * 8, z1: Math.ceil(f.z1 / 8) * 8 });
  const F = fine.map(snap);
  const NWr = { x0: -440, x1: -144, z0: -440, z1: -144 }, SWr = { x0: -440, x1: -128, z0: 128, z1: 440 }, RVr = { x0: -352, x1: 440, z0: 280, z1: 328 };
  const regions = [
    { ...NWr, res: 2, col: groundCol, skip: F }, { ...SWr, res: 2, col: groundCol, skip: [...F, RVr] }, { ...RVr, res: 1, col: groundCol, skip: F },
    { x0: -440, x1: 440, z0: -440, z1: 440, res: 8, col: groundCol, skip: [...F, NWr, SWr, RVr] },
    ...F.map(f => ({ x0: f.x0, x1: f.x1, z0: f.z0, z1: f.z1, res: f.res, col: f.kind === 'pool' ? poolCol : groundCol, skip: F.filter(o => o !== f && o.x0 >= f.x0 && o.x1 <= f.x1 && o.z0 >= f.z0 && o.z1 <= f.z1 && o.res < f.res) })),
  ];
  districts.push(
    { name: 'Downtown', pos: dtSpots[1].pos.clone(), yaw: dtSpots[1].yaw }, { name: 'Residential Hills', pos: V(-320, 28, -415), yaw: Math.PI },
    { name: 'Stadium', pos: V(0, 0, -215), yaw: 0 }, { name: 'University', pos: V(300, 0, -150), yaw: 0 },
    { name: 'Suburbs', pos: V(-300, 0, 0), yaw: Math.PI / 2 }, { name: 'Industrial', pos: V(260, 0, 0), yaw: Math.PI },
    { name: 'The Dam', pos: V(-345, 24, 200), yaw: -Math.PI / 2 }, { name: 'Waterfront', pos: V(0, 0, 230), yaw: Math.PI },
    { name: 'Port', pos: V(190, 0, 270), yaw: -Math.PI / 2 });
  const FLIP = 'flip|shuv|Shove|Impossible|Varial';
  const challenges = [...K.challenges, ...monChallenges,
    { id: 'spillway', name: 'Send the Spillway', desc: 'Drop the spillway and fly off the lip into the river', at: [-311, -3.8, 305], go: [-349, 24, 305, -Math.PI / 2], kind: 'gap', from: [-320, 287, -309, 323, -6], to: [-309, 290, -200, 320, -7, -4] },
    { id: 'freeway', name: 'The Unfinished Freeway', desc: 'Send it off the end of the freeway ramp on to the gravel', at: [338, 13, 270], go: [320, 11.4, 270, -Math.PI / 2], kind: 'gap', from: [328, 262, 341, 278, 11.4], to: [340, 255, 380, 285, -1, 12.3] },
    { id: 'dry-dock', name: 'Into the Dry Dock', desc: 'Drop off the quay into the dry dock', at: [230, 0, 334], go: [230, 0, 328, Math.PI], kind: 'gap', from: [176, 328, 344, 337, -0.3], to: [180, 336, 340, 424, -10, -6] },
    { id: 'dirt-line', name: 'Dirt Line', desc: 'Clear the first gap on the middle dirt line', at: [-322, 1, 382], go: [-349, 4.5, 382, -Math.PI / 2], kind: 'gap', from: [-324, 378, -320.5, 386, 0.6], to: [-319.5, 378, -312, 386, -0.1, 1.2] },
    { id: 'reservoir', name: 'Reservoir Speed', desc: 'Hit 45 km/h in the reservoir bowl', at: [-400, 24, 256], go: [-400, 24, 254, Math.PI], kind: 'speed', speed: 45 / 3.6, area: [-438, 254, -358, 358] },
    { id: 'uni-triple', name: 'University Triple', desc: 'Flip down the first flight of a university set', at: [210, 6, -172], go: [210, 6, -180, Math.PI], kind: 'trick', trick: FLIP, from: [203, -178, 217, -171.9, 5.5], to: [202, -171.9, 218, -164, -1, 4.6] },
    { id: 'spillway-kf', hard: true, name: 'Kickflip the Spillway', desc: 'Kickflip off the spillway lip into the river', at: [-311, -3.8, 300], go: [-349, 24, 300, -Math.PI / 2], kind: 'trick', tricks: ['Kickflip'], from: [-320, 287, -309, 323, -6], to: [-309, 290, -200, 320, -7, -4] },
    { id: 'freeway-heel', hard: true, name: 'Heelflip the Freeway', desc: 'Heelflip off the end of the freeway ramp on to the gravel', at: [338, 13, 265], go: [320, 11.4, 265, -Math.PI / 2], kind: 'trick', tricks: ['Heelflip'], from: [328, 262, 341, 278, 11.4], to: [340, 255, 380, 285, -1, 12.3] },
    { id: 'dock-tre', hard: true, name: '360 Flip into the Dry Dock', desc: 'A 360 flip off the quay into the dry dock', at: [290, 0, 334], go: [290, 0, 328, Math.PI], kind: 'trick', tricks: ['360 Flip'], from: [176, 328, 344, 337, -0.3], to: [180, 336, 340, 424, -10, -6] },
    { id: 'dirt-long', hard: true, name: 'The Long Dirt Gap', desc: 'Clear the first gap on the far dirt line, the longest one', at: [-322, 1, 412], go: [-349, 4.5, 412, -Math.PI / 2], kind: 'gap', from: [-324, 408, -320.5, 416, 0.6], to: [-318.8, 408, -311, 416, -0.1, 1.2] },
    { id: 'reservoir-60', hard: true, name: 'Reservoir 60', desc: 'Hit 60 km/h in the reservoir bowl', at: [-400, 24, 358], go: [-400, 24, 254, Math.PI], kind: 'speed', speed: 60 / 3.6, area: [-438, 254, -358, 358] },
    { id: 'uni-rail', hard: true, name: 'University Handrail', desc: 'Grind a handrail on one of the university triple sets', at: [212, 6, -172], go: [212, 6, -180, Math.PI], kind: 'grind', rail: 'Handrail', area: [203, -172.5, 217, -155] },
  ];
  const traffic = [...K.traffic, ...K.ringTraffic], peds = [...K.peds, ...K.ringPeds];
  const tapes = [...K.tapes, [260, 380, -9], [-400, 306, 16], [-80, -362, 6], [338, 270, 13], [-206, -437, 28], [402, 0, -2.6]];
  return {
    terrainH, surface: (x, z) => K.dtSurface(x, z) || 'smooth', regions, boxes, hubbas, rails, hazards, districts, spots: dtSpots, challenges, tapes, shop: K.shop, shops: K.shops, npcs: K.npcs, traffic, peds,
    spawn: districts[0], bounds: [-438, 438, -438, 438], fog: [110, 330], far: 360, sky: 0xa9c8de,
    decor(D) {
      for (const f of decorFns) f(D);
    },
  };
}

/* The Arroyo (arroyo): the storm channel. Design: levels/porto/design/arroyo.md. */
function porto_arroyo(K, P) {
  const PL = arroyo_plan();
  P.ground((x, z, h) => arroyo_terrain(PL, x, z, h));
  P.col(PL.col); P.surface(PL.surface);
  for (const r of PL.REGIONS) P.region(...r);
  // the trickle in the slot: 8 m pieces, each at the downhill end's floor - 0.45
  for (const [z0, z1] of PL.SLOT) for (let z = z0; z < z1; z += 8) { const e = Math.min(z + 8, z1); P.water(-701.5, -698.5, z, e, PL.F(e) - 0.45); }
  P.water(-719, -699, 595, 601, PL.F(602) - 0.4);
  // the parts (each guarded so a missing one doesn't break the build); the rect of each is in the doc, section 11
  if (typeof arroyo_upper === 'function') arroyo_upper(K, P, PL);
  if (typeof arroyo_lower === 'function') arroyo_lower(K, P, PL);
  if (typeof arroyo_west === 'function') arroyo_west(K, P, PL);
  if (typeof arroyo_east === 'function') arroyo_east(K, P, PL);
  arroyo_index_lines(P, PL);
  arroyo_index_life(P, PL);
  arroyo_index_landmarks(P, PL);
  P.travel('The Arroyo', -712, PL.F(-140), -140, Math.PI, 'district');
}
/* every street, path and named line (CONTRACT 4 and 7). Sloped streets are 'bomb' past the level part. */
function arroyo_index_lines(P, PL) {
  // streets
  P.line('Mill Street', [[-800, -164], [-800, 206]], 'push');
  P.line('Mill Street (down)', [[-800, 206], [-800, 862]], 'bomb');
  P.line('Levee Road', [[-638, -164], [-638, 206]], 'push');
  P.line('Levee Road (down)', [[-638, 206], [-638, 862]], 'bomb');
  P.line('Gasworks Lane', [[-470, -16], [-470, 206]], 'push');
  P.line('Gasworks Lane (down)', [[-470, 206], [-470, 862]], 'bomb');
  P.line('Run Street', [[-632, -16], [-464, -16]], 'push');
  P.line('Viaduct Road', [[-794, 160], [-752, 160], [-664, 160], [-648, 160], [-476, 160]], 'push');
  P.line('Yard Street', [[-880, 214], [-806, 214]], 'push');
  P.line('Foundry Road', [[-880, 214], [-880, 862]], 'bomb');
  P.line('Ford Road', [[-810, -170], [-628, -170]], 'push');
  P.line('Outfall Road', [[-886, 862], [-464, 862]], 'push');
  P.line('Footbridge Walk', [[-420, 520], [-648, 520], [-736, 520], [-790, 520]], 'push', true);
  // paths on the levees
  P.line('West Levee Path', [[-744, -212], [-744, 892]], 'push');
  P.line('Levee Path', [[-656, -212], [-656, 892]], 'push');
  // the tributary down to the confluence
  P.line('Planter Run', [[-420, -40], [-480, -40], [-560, -40], [-640, -40], [-680, -40], [-698, -40]], 'push', true);
  // the doc's named lines (section 5)
  P.line('The Full Run', [[-700, -228], [-700, -190], [-716, -130], [-716, -30], [-702, 0], [-700, 40], [-712, 60], [-712, 98], [-704, 106], [-704, 216],
    [-714, 240], [-700, 262], [-686, 282], [-700, 300], [-714, 322], [-700, 360], [-684, 382], [-682, 468], [-686, 500], [-686, 545], [-694, 560],
    [-700, 580], [-712, 592], [-712, 604], [-700, 622], [-694, 656], [-700, 700], [-698, 742], [-704, 788], [-700, 860], [-700, 905]], 'bomb', true);
  P.line('Viaduct Line', [[-780, 160], [-736, 160], [-664, 160], [-656, 160], [-656, 140], [-690, 126], [-700, 116]], 'push', true);
  P.line('Footbridge Line', [[-420, 520], [-664, 520], [-686, 520], [-686, 545], [-700, 590], [-700, 612], [-694, 660], [-694, 700]], 'push', true);
  P.line('Yard Line', [[-910, -195], [-910, -155], [-924, -120], [-924, 75], [-880, 30], [-800, 0], [-783, -20], [-783, 40], [-760, 80], [-744, 100], [-720, 108], [-714, 108]], 'push', true);
}
/* traffic on the two road loops, peds, and the session skaters (spots the parts build at the doc's coordinates) */
function arroyo_index_life(P, PL) {
  const E = [[-638, -16], [-470, -16], [-470, 862], [-638, 862]], W = [[-880, 214], [-800, 214], [-800, 862], [-880, 862]];
  for (const path of [E, W]) for (const dir of [1, -1]) P.traffic({ path, lane: 2.5, dir, n: 3, speed: 9, r: 8 });
  P.peds({ path: [[-656, 220], [-656, 840]], n: 2 });
  P.peds({ path: [[-440, 520], [-640, 520]], n: 1 });
  P.peds({ path: [[-600, -130], [-540, -130], [-540, -80], [-600, -80]], n: 1 });
  P.peds({ path: [[-795, 230], [-795, 500]], n: 1 });
  P.npc({ kind: 'session', rail: [-707, 108, -707, 140], start: 98, end: 150, back: 3.4, side: 1, speed: 5 });       // DIY slappy curb
  P.npc({ kind: 'session', rail: [-628, -48, -440, -48], start: -600, end: -540, back: 3.4, side: 1, speed: 5 });    // Planter Run coping
  P.npc({ kind: 'session', rail: [-783, -120, -783, 40], start: -128, end: 48, back: 3.4, side: 1, speed: 5 });      // Freight Platform
}
/* far silhouettes (the parts model the real thing close up) */
function arroyo_index_landmarks(P, PL) {
  P.landmark({ at: [-905, portoBaseH(-905, 705), 705], near: 140, parts: [{ shape: 'cyl', at: [0, 32, 0], size: [2.5, 64, 2.5], color: 0x8a5a44 }] });
  P.landmark({ at: [-532, 0, 62], near: 140, parts: [{ shape: 'cyl', at: [0, 13, 0], size: [22, 26, 22], color: 0x6f7378 }] });
  P.landmark({ at: [-550, 0, -175], near: 140, parts: [{ shape: 'box', at: [0, 7, 0], size: [100, 14, 50], color: 0xa9a49a }] });
}

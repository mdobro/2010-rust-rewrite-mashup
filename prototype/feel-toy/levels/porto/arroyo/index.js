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
  arroyo_budget_small(K); arroyo_budget_merge(K); arroyo_budget_mergeSlabs(K); arroyo_budget_mergeRails(K);
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
  // The Full Run weaves the floor and crosses the trickle slot only over grates, square enough to stay on the 3 m grate
  const g = (z, we) => we ? [[-707, z + 1.5 - 3.5], [-693, z + 1.5 + 3.5]] : [[-693, z + 1.5 - 3.5], [-707, z + 1.5 + 3.5]];
  P.line('The Full Run', [[-700, -228], [-700, -190], [-716, -130], [-716, -30], [-708, 0], [-708, 40], [-708, 60], [-708, 98], [-704, 106], [-704, 140], [-708, 148], [-708, 172], [-702, 180], [-702, 192], [-704, 216],
    [-712, 232], ...g(248, true), [-686, 282], [-690, 296], ...g(312, false), [-712, 328], ...g(344, true), [-681, 366], [-681, 376], [-681, 466], [-684, 480],
    [-692, 500], [-692, 548], ...g(568, false), [-712, 584], [-712, 604], [-712, 628], ...g(640, true), [-692, 660], [-692, 756], ...g(768, false),
    [-710, 790], [-710, 820], ...g(832, true), [-694, 846], [-696, 860], [-700, 905]], 'bomb', true);
  // the Viaduct Line drops in through the Levee Path guardrail's gap at z 138..144
  P.line('Viaduct Line', [[-780, 160], [-736, 160], [-664, 160], [-656, 160], [-656, 150], [-664, 141], [-690, 126], [-700, 116]], 'push', true);
  // down the stair tower, then the east side of the floor under the water mains (the sump is west of x -696)
  P.line('Footbridge Line', [[-420, 520], [-664, 520], [-686, 520], [-686, 545], [-692, 560], [-692, 640], [-694, 660], [-694, 700]], 'push', true);
  // the Yard Line rolls off the boxcars and east to the DIY; the Freight Platform (its own spot) is a branch off it; in over the levee through the guardrail gap at z 108..114
  P.line('Yard Line', [[-910, -195], [-910, -155], [-924, -120], [-924, 75], [-924, 96], [-890, 116], [-800, 116], [-750, 112], [-736, 111], [-720, 110], [-714, 108]], 'push', true);
}
/* traffic on the two road loops, peds, and the session skaters (spots the parts build at the doc's coordinates) */
function arroyo_index_life(P, PL) {
  const E = [[-638, -16], [-470, -16], [-470, 862], [-638, 862]], W = [[-880, 214], [-800, 214], [-800, 862], [-880, 862]];
  for (const path of [E, W]) for (const dir of [1, -1]) P.traffic({ path, lane: 2.5, dir, n: 3, speed: 9, r: 8 });
  P.peds({ path: [[-656, 220], [-656, 840]], n: 6 });
  P.peds({ path: [[-440, 520], [-640, 520]], n: 3 });
  P.peds({ path: [[-600, -130], [-540, -130], [-540, -80], [-600, -80]], n: 3 });
  P.peds({ path: [[-795, 230], [-795, 500]], n: 3 });
  P.npc({ kind: 'session', rail: [-707, 108, -707, 140], start: 98, end: 150, back: 3.4, side: 1, speed: 5 });       // DIY slappy curb
  P.npc({ kind: 'session', rail: [-628, -48, -440, -48], start: -600, end: -540, back: 3.4, side: 1, speed: 5 });    // Planter Run coping
  P.npc({ kind: 'session', rail: [-783, -120, -783, 40], start: -128, end: 48, back: 3.4, side: 1, speed: 5 });      // Freight Platform
}
/* far silhouettes (the parts model the real thing close up) */
function arroyo_index_landmarks(P, PL) {
  P.landmark({ at: [-905, portoBaseH(-905, 705), 705], near: 140, parts: [{ shape: 'cyl', at: [0, 32, 0], size: [2.5, 64, 2.5], color: 0x8a5a44 }] });
  // the gasholder is an empty frame (the bell is long gone): six of its twelve columns and its two ring girders
  const gas = [0, 1, 2, 3, 4, 5].map(k => { const a = (15 + 60 * k) * Math.PI / 180; return { shape: 'cyl', at: [Math.cos(a) * 22, 13, Math.sin(a) * 22], size: [0.8, 26, 0.8], color: 0x7a5a45 }; });
  P.landmark({ at: [-532, 0, 62], near: 140, parts: [...gas, { shape: 'cyl', at: [0, 13, 0], size: [44.6, 0.7, 44.6], color: 0x6b5545 }, { shape: 'cyl', at: [0, 26, 0], size: [44.6, 0.6, 44.6], color: 0x6b5545 }] });
  P.landmark({ at: [-550, 0, -175], near: 140, parts: [{ shape: 'box', at: [0, 7, 0], size: [100, 14, 50], color: 0xa9a49a }] });
}

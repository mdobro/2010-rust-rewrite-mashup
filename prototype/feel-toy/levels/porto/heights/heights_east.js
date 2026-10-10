/* The Heights, the east part: x 480..1000, z -650..-230 (design/heights.md 4 E1-E7, 7.4, 10.4).
   Ridge Road east, Ridge Road Descent and the Three Crests, the three terrace streets, Crest Street, the Vista Steps,
   the villas (R0, R1, R2 and the Ridge Villas with three backyard pools), Ridge Park and its 82 m rail, Low Gear Boards,
   and the filler that keeps every street from going dead (CONTRACT 7). Traffic, peds and the terrace skater loop are
   registered in index.js. */
function heights_east(K, P, PL) {
  const E = { K, P, PL, keep: [], pools: [[600, -612], [760, -612], [900, -612]] };
  heights_east_streets(E);
  heights_east_vista(E);
  heights_east_villas(E);
  heights_east_park(E);
  heights_east_shop(E);
  heights_east_filler(E);
  heights_east_life(E);
  heights_east_planting(E);
}

/* a rect that trees, lamps and filler keep out of */
function heights_east_item(E, x0, z0, x1, z1) { E.keep.push([Math.min(x0, x1) - 0.4, Math.min(z0, z1) - 0.4, Math.max(x0, x1) + 0.4, Math.max(z0, z1) + 0.4]); }
function heights_east_inKeep(E, x, z, m) { return E.keep.some(r => x > r[0] - m && x < r[2] + m && z > r[1] - m && z < r[3] + m); }

/* a sloped block between two points, the higher end first */
function heights_east_hub(K, p, q, w, color) {
  const hi = p.y >= q.y;
  K.hubbas.push({ a: hi ? p : q, b: hi ? q : p, w, noRails: true, color });
}

/* sloped sidewalks down a z-running road centred on x = c (half-width hw): one 3 m slab per straight run between the
   breaks, top 0.15 over the ground, a Curb grind on the road edge of the long runs, curb ramps where a cross street cuts in */
function heights_east_zwalk(E, c, hw, breaks, gaps, railFrom) {
  const K = E.K, T = (x, z) => K.terrainH(x, z), last = breaks[breaks.length - 1];
  for (const s of [-1, 1]) {
    const xm = c + s * (hw + 1.5), xe = c + s * hw;
    for (let i = 0; i + 1 < breaks.length; i++) {
      const z0 = breaks[i], z1 = breaks[i + 1];
      if (gaps.some(g => z0 >= g[0] - 0.01 && z1 <= g[1] + 0.01)) continue;
      heights_east_hub(K, V(xm, T(xm, z0) + 0.15, z0), V(xm, T(xm, z1) + 0.15, z1), 3, 0xc4c0b6);
      if (z1 - z0 >= railFrom) K.rail(xe, T(xe, z0) + 0.15, z0, xe, T(xe, z1) + 0.15, z1, 'Curb', false);
    }
    for (const [g0, g1] of gaps) {
      if (g0 > breaks[0] && g0 <= last) heights_east_hub(K, V(xm, T(xm, g0) + 0.15, g0), V(xm, T(xm, g0 + 1.4) + 0.01, g0 + 1.4), 2.6, 0xb9b5ab);
      if (g1 < last && g1 >= breaks[0]) heights_east_hub(K, V(xm, T(xm, g1) + 0.15, g1), V(xm, T(xm, g1 - 1.4) + 0.01, g1 - 1.4), 2.6, 0xb9b5ab);
    }
  }
}

/* Ridge Road, the three terrace streets, the Descent and Crest Street (sidewalks, paint) */
function heights_east_streets(E) {
  const K = E.K, T = (x, z) => K.terrainH(x, z);
  K.street('x', -596, 480, 960, 44, [650, 872], { rw: 5, sw: 3, lamps: false });
  const disc = new THREE.CylinderGeometry(1, 1, 0.02, 28);
  for (const zc of [-520, -440, -360]) {
    const y = T(700, zc);
    K.street('x', zc, 500, 956, y, [650, 760, 872], { rw: 5, sw: 3, lamps: false });
    // the dead end at x 500: a turning circle painted on the flat
    K.decorFns.push(D => D.add(disc, 0x56585d, [503, y + 0.012, zc], [0, 0, 0], [6.6, 1, 6.6]));
  }
  const DB = [-588, -576, -566, -556, -552, -546, -544, -528, -512, -488, -472, -448, -432, -408, -392, -368, -352, -328, -282, -274, -266, -258, -250];
  const GAPS = [[-528, -512], [-448, -432], [-368, -352]];
  heights_east_zwalk(E, 650, 5, DB, GAPS, 24);
  heights_east_zwalk(E, 872, 4, DB.filter(z => z <= -368), GAPS, 24);
  // centre lines down the two sloped roads, broken at the cross streets
  for (const [c, z1] of [[650, -252], [872, -372]])
    for (let z = -586; z < z1; z += 6) if (!GAPS.some(g => z + 3 > g[0] - 2 && z < g[1] + 2)) K.dash(c, z, c, z + 3);
}

/* the Vista Steps, x 756..764: two cascades of landings and flights of 0.2 m risers (design E3) */
function heights_east_vista(E) {
  const K = E.K, T = (x, z) => K.terrainH(x, z);
  const casc = [
    [[-512, -504, 38.65, 11], [-500, -492, 36.45, 11], [-488, -480, 34.25, 7], [-477.6, -469.6, 32.85, 9], [-466.4, -458.4, 31.05, 11], [-454.4, -450.0, 28.85, 6]],
    [[-432, -424, 27.65, 11], [-420, -412, 25.45, 11], [-408, -400, 23.25, 7], [-397.6, -389.6, 21.85, 9], [-386.4, -378.4, 20.05, 11], [-374.4, -370.0, 17.85, 6]]];
  for (const rows of casc) rows.forEach(([z0, z1, top, n], i) => {
    K.B(756, K.groundMin(756, z0, 764, z1) - 0.4, z0, 764, top, z1, 'plaza', { edges: '' });
    const bottom = top - n * 0.2, opt = { rails: [755.55, 764.45] };
    if (n === 11 && i < 2) opt.hubbas = [760];
    K.stairSpot('z', z1, 1, 756, 764, top, bottom, n, 0.4, opt);
  });
  // a chamfer at each head so the first landing is not a lip (boxes over 8 cm stop a rider)
  heights_east_hub(K, V(760, 38.65, -512), V(760, T(760, -514) + 0.02, -514), 8, 0xc4bfb3);
  heights_east_hub(K, V(760, 27.65, -432), V(760, T(760, -434) + 0.02, -434), 8, 0xc4bfb3);
  // a chamfer at each foot so the last riser is not a lip
  heights_east_hub(K, V(760, 27.65, -448), V(760, T(760, -446) + 0.02, -446), 8, 0xc4bfb3);
  heights_east_hub(K, V(760, 16.65, -368), V(760, T(760, -366) + 0.02, -366), 8, 0xc4bfb3);
  heights_east_item(E, 752, -514, 768, -444); heights_east_item(E, 752, -434, 768, -364);
}

/* a villa: a building with its garden, and either a stoop (odd) or a driveway kicker (even) toward the street z = zf */
function heights_east_villa(E, x0, zf, i) {
  const K = E.K, T = (x, z) => K.terrainH(x, z), HC = [0xd9c7a8, 0xc9a27e, 0xb8c4c9, 0xe0d6c2, 0xa9b89a, 0xc98f6b, 0xb7a58c];
  K.building(x0, zf - 16, x0 + 14, zf - 4, 2, HC[i % HC.length], i % 2 ? 'brick' : 'stone');
  heights_east_item(E, x0 - 1, zf - 17, x0 + 15, zf - 3);
  const xc = x0 + 7;
  if (i % 2) {                                            // a stoop to the sidewalk, one handrail, the yard wall on its west side
    const top = T(xc, zf - 2.4) + 0.5, bottom = T(xc, zf) + 0.15, n = Math.max(2, Math.round((top - bottom) / 0.25));
    K.B(xc - 1.4, K.groundMin(xc - 1.4, zf - 4, xc + 1.4, zf - 2.4) - 0.4, zf - 4, xc + 1.4, top, zf - 2.4, 'plaza', { edges: '' });
    K.stairSpot('z', zf - 2.4, 1, xc - 1.4, xc + 1.4, top, bottom, n, 0.5, { rails: [xc + 1.85] });
    K.strip(x0, zf - 3.3, xc - 2, zf - 3.3, 0.55, 0.6, { kind: 'Ledge', noRails: true, color: 0xa39d90, seg: 8 });
    K.rail(x0, T(x0, zf - 3.3) + 0.55, zf - 3.3, xc - 2, T(xc - 2, zf - 3.3) + 0.55, zf - 3.3, 'Ledge', false);
    heights_east_item(E, xc - 2, zf - 4, xc + 2.4, zf);
  } else {                                                // a driveway cut and a kicker; the yard wall on its east side
    K.driveway('x', zf + 8, -1, xc, 5, 3.2);
    K.kicker(xc, zf + 0.3, 0, 1, 2.4, 0.5, 1.6);
    K.strip(xc + 2, zf - 3.3, x0 + 14, zf - 3.3, 0.55, 0.6, { kind: 'Ledge', noRails: true, color: 0xa39d90, seg: 8 });
    K.rail(xc + 2, T(xc + 2, zf - 3.3) + 0.55, zf - 3.3, x0 + 14, T(x0 + 14, zf - 3.3) + 0.55, zf - 3.3, 'Ledge', false);
    heights_east_item(E, xc - 1, zf - 3, xc + 1, zf + 3);
  }
}

/* the villas: R0 on the plateau slope, R1 and R2 above the middle and lower terraces, and the Ridge Villas with their pools */
function heights_east_villas(E) {
  const K = E.K, T = (x, z) => K.terrainH(x, z), HC = [0xd9c7a8, 0xc9a27e, 0xb8c4c9, 0xe0d6c2, 0xa9b89a, 0xc98f6b, 0xb7a58c];
  [506, 548, 590, 686, 730, 820, 904].forEach((x0, i) => {
    K.building(x0, -578, x0 + 14, -564, 2, HC[(i + 2) % HC.length], i % 2 ? 'stone' : 'brick');
    heights_east_item(E, x0 - 1, -579, x0 + 15, -563);
  });
  const LOTS = [504, 530, 556, 582, 608, 676, 716, 780, 822, 906];
  LOTS.forEach((x0, i) => heights_east_villa(E, x0, -448, i));       // R1, fronting the Middle Terrace
  LOTS.forEach((x0, i) => heights_east_villa(E, x0 + (i % 3 === 1 ? 2 : 0), -368, i + 1));   // R2, fronting the Lower Terrace
  // the Ridge Villas, north of Ridge Road on the flat, and the three backyard pools in their front gardens
  [530, 600, 690, 760, 830, 900].forEach((cx, i) => {
    K.building(cx - 7, -632, cx + 7, -620, 2, HC[(i + 4) % HC.length], i % 2 ? 'brick' : 'stone');
    heights_east_item(E, cx - 8, -633, cx + 8, -619);
  });
  for (const [cx, cz] of E.pools) {
    const lobes = [[K.poolS.circle(cx, cz - 2.2, 2.6), 2.2], [K.poolS.circle(cx, cz + 2, 3.2), 2.8]];
    K.pool(cx - 6, cx + 6, cz - 6, cz + 6, lobes, 44);
    for (const [px, pz, r] of [[cx, cz - 2.2, 2.6], [cx, cz + 2, 3.2]]) {     // an eight-sided coping, corners just outside the lip so the middle of each side sits on it
      const n = 8, rr = r / Math.cos(Math.PI / n);
      for (let k = 0; k < n; k++) {
        const a0 = (k + 0.5) / n * Math.PI * 2, a1 = (k + 1.5) / n * Math.PI * 2, q0 = V(px + Math.cos(a0) * rr, 44, pz + Math.sin(a0) * rr), q1 = V(px + Math.cos(a1) * rr, 44, pz + Math.sin(a1) * rr);
        if (lobes.some(([s]) => s(q0.x, q0.z) > 0.05 || s(q1.x, q1.z) > 0.05)) continue;
        K.rails.push({ a: q0, b: q1, kind: 'Coping', coping: true });
      }
    }
    // the garden fence: a front line with a gap to ride through, the sides for looks
    K.B(cx - 9, 43.6, -605.3, cx - 1.5, 45.0, -605.1, 'fence'); K.B(cx + 1.5, 43.6, -605.3, cx + 9, 45.0, -605.1, 'fence');
    K.prop(cx - 9.05, 44, -619, cx - 8.95, 45, -605.1, 0x8a8d8f); K.prop(cx + 8.95, 44, -619, cx + 9.05, 45, -605.1, 0x8a8d8f);
    heights_east_item(E, cx - 9.5, -619, cx + 9.5, -604.5);
  }
}

/* Ridge Park: the path, the 82 m rail, picnic tables */
function heights_east_park(E) {
  const K = E.K, T = (x, z) => K.terrainH(x, z);
  // the paved path, x 698..708: painted on the ground in 8 m pieces that follow the slope
  for (let z = -352; z < -252; z += 8) K.dash(703, z, 703, Math.min(-252, z + 8), 0xcdc8bc, 10);
  // the path crosses the Lower Terrace's south sidewalk: a curb cut up from the road and another down to the grass
  heights_east_hub(K, V(703, 16.63, -354.2), V(703, T(703, -355.7) + 0.01, -355.7), 9, 0xb9b5ab);
  heights_east_hub(K, V(703, 16.63, -352.6), V(703, T(703, -350.4) + 0.02, -350.4), 9, 0xcdc8bc);
  heights_east_item(E, 697, -356, 709, -350);
  K.rail(706, T(706, -344) + 0.7, -344, 706, T(706, -262) + 0.7, -262, 'Rail', true);
  heights_east_item(E, 704.5, -345, 707.5, -261);
  // picnic tables: a top you can grind (benches left out to save grind lines)
  for (const [x, z] of [[728, -326], [744, -298], [730, -274]]) { K.Bg(x - 1, z - 0.4, x + 1, z + 0.4, 0.76, 'wood', { edges: 'ns' }); heights_east_item(E, x - 1.2, z - 1.2, x + 1.2, z + 1.2); }
  // a bank up to a low wall on the lawn
  K.hubbas.push({ a: V(690, T(690, -300) + 0.7, -300), b: V(686, T(686, -300) + 0.02, -300), w: 4, noRails: true, color: 0xc4bfb3 });
  heights_east_item(E, 685, -302.5, 691, -297.5);
  K.hubbas.push({ a: V(771, T(771, -318) + 0.7, -318), b: V(766, T(766, -318) + 0.02, -318), w: 4, noRails: true, color: 0xc4bfb3 });
  heights_east_item(E, 765, -320.5, 772, -315.5);
}

/* Low Gear Boards: the shop on its deck at the Lower Terrace */
function heights_east_shop(E) {
  const K = E.K, P = E.P;
  K.building(584, -348, 600, -334, 2, 0xa0563c, 'brick');
  K.hubbas.push({ a: V(592, 16.63, -355), b: V(592, 16.49, -356.4), w: 8, noRails: true, color: 0xb9b5ab });   // (designer review) a curb cut: roll in off the terrace street
  K.B(580, 14.8, -352, 604, 16.63, -348, 'plaza', { edges: 'ew' });
  P.shop({ name: 'Low Gear Boards', sign: [592, 20.48, -348.04, Math.PI, 7], awning: [586, -349.6, 598, -348, 18.83], zone: [588, -351.2, 596, -348.2], door: [592, 16.63, -348.2] });
  heights_east_item(E, 579, -356, 605, -333);
}

/* one small skateable thing, centred on (x, z), running along x on a sidewalk (lift: the sidewalk's height over the ground) */
function heights_east_piece(E, kind, x, z, lift, dir) {
  const K = E.K, g = K.terrainH(x, z) + lift;
  switch (kind) {
    case 'bank':
      K.hubbas.push({ a: V(x + dir * 2.5, g + 0.6, z), b: V(x - dir * 2.5, g + 0.02, z), w: 2.6, noRails: true, color: 0xc4bfb3 });
      heights_east_item(E, x - 2.6, z - 1.4, x + 2.6, z + 1.4); break;
    case 'kick':
      K.hubbas.push({ a: V(x + dir * 1.6, g + 0.5, z), b: V(x - dir * 1.6, g + 0.02, z), w: 1.5, noRails: true, color: 0xc49a5c });
      heights_east_item(E, x - 1.7, z - 0.9, x + 1.7, z + 0.9); break;
    case 'ledge': {
      const hgt = lift + 0.45;
      K.strip(x - 4, z, x + 4, z, hgt, 0.6, { kind: 'Ledge', noRails: true, color: 0xa9a59c, seg: 8 });
      K.rail(x - 4, K.terrainH(x - 4, z) + hgt, z, x + 4, K.terrainH(x + 4, z) + hgt, z, 'Ledge', false);
      heights_east_item(E, x - 4.2, z - 0.5, x + 4.2, z + 0.5); break; }
    case 'rack':
      K.rail(x - 3, g + 0.55, z, x + 3, g + 0.55, z, 'Flatbar', true);
      heights_east_item(E, x - 3.2, z - 0.4, x + 3.2, z + 0.4); break;
    case 'pad':
      K.Bg(x - 3, z - 0.7, x + 3, z + 0.7, 0.18 + lift, 'pad', { edges: '' });
      heights_east_item(E, x - 3.2, z - 0.9, x + 3.2, z + 0.9); break;
  }
}

/* pieces along the sidewalks of a street running along x at z = c, between the cross streets: `segs` = [[from, to], ...] */
function heights_east_row(E, c, segs, spacing, kinds, skipSide) {
  let i = 0, side = 1;
  for (const [a, b] of segs) {
    const n = Math.max(1, Math.round((b - a - 8) / spacing)), step = n > 1 ? (b - a - 8) / (n - 1) : 0;
    for (let k = 0; k < n; k++, side = -side) {
      let x = n > 1 ? a + 4 + k * step : (a + b) / 2;
      const sd = skipSide ? skipSide(x, side) : side;
      if (heights_east_inKeep(E, x, c + sd * 6.5, 3.5)) { x += x + 9 < b ? 9 : -9; if (heights_east_inKeep(E, x, c + sd * 6.5, 3.5)) continue; }
      heights_east_piece(E, kinds[i++ % kinds.length], x, c + sd * 6.5, 0.15, (i % 2) * 2 - 1);
    }
  }
}

/* edge pieces for the two sloped roads: a ledge on the verge and banks on the sidewalks, never in the lane */
function heights_east_zpiece(E, c, hw, z, kind, s) {
  const K = E.K, T = (x, zz) => K.terrainH(x, zz);
  if (kind === 'ledge') {
    const x = c + s * (hw + 4.2), hgt = 0.45;
    K.strip(x, z - 4, x, z + 4, hgt, 0.6, { kind: 'Ledge', noRails: true, color: 0xa9a59c, seg: 8 });
    K.rail(x, T(x, z - 4) + hgt, z - 4, x, T(x, z + 4) + hgt, z + 4, 'Ledge', false);
    heights_east_item(E, x - 0.5, z - 4.2, x + 0.5, z + 4.2);
  } else {                                           // a bank up off the road edge onto the verge
    const x1 = c + s * (hw + 0.6), x2 = c + s * (hw + 4.8);
    K.hubbas.push({ a: V(x2, T(x2, z) + 0.7, z), b: V(x1, T(x1, z) + 0.15, z), w: 3.2, noRails: true, color: 0xc4bfb3 });
    heights_east_item(E, Math.min(x1, x2), z - 1.8, Math.max(x1, x2), z + 1.8);
  }
}

/* filler: something skateable along every street (CONTRACT 7) */
function heights_east_filler(E) {
  const K = E.K, near = (x, cx, m) => Math.abs(x - cx) < m;
  const ridgeSkip = (x, side) => (side < 0 && E.pools.some(p => near(x, p[0], 10))) ? 1 : side;
  heights_east_row(E, -596, [[480, 642], [658, 864], [880, 960]], 30, ['bank', 'ledge', 'kick', 'rack', 'bank', 'kick', 'pad', 'ledge'], ridgeSkip);
  const segs = [[500, 642], [658, 752], [768, 864], [880, 956]];
  heights_east_row(E, -520, segs, 32, ['kick', 'ledge', 'bank', 'rack', 'kick', 'bank'], null);
  heights_east_row(E, -440, segs, 32, ['bank', 'kick', 'ledge', 'bank', 'rack', 'kick'], null);
  heights_east_row(E, -360, segs, 32, ['ledge', 'bank', 'kick', 'rack', 'bank', 'kick'], null);
  // (designer review) two short bare ends: Ridge Road and the Upper Terrace east of x 900
  K.Bg(924, -589.8, 932, -589.2, 0.45, 'ledge', { edges: 'n' });
  K.Bg(912, -514.0, 920, -513.4, 0.45, 'ledge', { edges: 's' });
  // the Descent: alternate sides, a ledge then a bank, about every 30 m down the slope
  [[-574, 'ledge', -1], [-546, 'bank', 1], [-500, 'ledge', 1], [-466, 'bank', -1], [-418, 'ledge', -1], [-386, 'bank', 1], [-338, 'ledge', 1], [-306, 'bank', -1], [-272, 'ledge', -1]]
    .forEach(([z, k, s]) => heights_east_zpiece(E, 650, 5, z, k, s));
  // Crest Street
  [[-574, 'ledge', 1], [-548, 'bank', -1], [-496, 'ledge', -1], [-460, 'bank', 1], [-418, 'ledge', 1], [-384, 'bank', -1]]
    .forEach(([z, k, s]) => heights_east_zpiece(E, 872, 4, z, k, s));
}

/* the district's data: sign, spots, travel, challenge, tape */
function heights_east_life(E) {
  const K = E.K, P = E.P, T = (x, z) => K.terrainH(x, z);
  K.decorFns.push(D => D.sign('THE TERRACES', 663, 41.5, -532, 7, 1.2, Math.PI, '#f0ece2', '#2e3f5c'));
  for (const x of [660.1, 665.9]) K.prop(x - 0.08, T(x, -532) - 0.3, -532.1, x + 0.08, 42.2, -531.9, 0x3a3d42);
  heights_east_item(E, 659.5, -533, 666.5, -531);
  P.spot('Ridge Road Descent', 650, 44.0, -592, Math.PI, [640, -600, 660, -584]);
  P.travel('Ridge Road Descent', 650, 44.0, -592, Math.PI, 'spot');
  P.spot('Three Crests', 650, T(650, -440), -440, Math.PI, [640, -530, 660, -350]);
  P.spot('Vista Steps', 760, 38.8, -516, Math.PI, [752, -514, 768, -366]);
  P.spot('Ridge Park Rail', 706, T(706, -350), -350, Math.PI, [698, -352, 714, -256]);
  P.spot('Low Gear Boards', 592, 16.63, -354, 0, [586, -356, 598, -350]);
  P.travel('Low Gear Boards', 592, 16.63, -354, 0, 'spot');
  P.challenge({ id: 'heights-three-crests', name: 'Three Crests', desc: 'Hit 65 km/h down the Descent over the three crests',
    at: [650, 39.5, -520], go: [650, 44.0, -592, Math.PI], kind: 'speed', speed: 65 / 3.6, area: [640, -528, 660, -300] });
  P.tape(760, -619, 44.0);
}

/* lamps and trees last, so they keep clear of everything above */
function heights_east_planting(E) {
  const K = E.K, put = (fn, x, z, a, m) => { if (!heights_east_inKeep(E, x, z, m || 1.2)) fn(x, z, a); };
  const lamp = (x, z, s) => K.lamp(x, z, s), tree = (x, z) => K.tree(x, z);
  // Ridge Road: every 40 m on alternating sides, clear of the crossings
  for (let x = 500, s = 1; x < 950; x += 40, s = -s) if (Math.abs(x - 650) > 12 && Math.abs(x - 872) > 12) put(lamp, x, -596 + s * 5.6, s);
  // terraces: every 80 m on the south walk, a tree in the verge beside it
  for (const zc of [-520, -440, -360]) for (let x = 530; x < 950; x += 80) { if (Math.abs(x - 650) < 12 || Math.abs(x - 760) < 12 || Math.abs(x - 872) < 12) continue; put(lamp, x, zc + 5.6, 1); }
  // the Descent, every 48 m on its west edge
  for (let z = -560; z < -270; z += 48) put(lamp, 640.4, z, -1);
  // trees: villa gardens, the plateau verges, the park
  for (const [x, z] of [[502, -566], [546, -562], [588, -562], [632, -566], [668, -566], [712, -566], [756, -566], [804, -566], [848, -566], [894, -566], [940, -566],
    [520, -490], [596, -490], [668, -490], [736, -490], [800, -490], [850, -490], [930, -490],
    [520, -410], [596, -410], [668, -410], [736, -410], [800, -410], [850, -410], [930, -410],
    [510, -612], [570, -612], [660, -612], [730, -612], [800, -612], [870, -612], [940, -612],
    [680, -330], [684, -300], [686, -272], [722, -340], [745, -330], [750, -280], [770, -300], [790, -270], [800, -330], [820, -300], [840, -270], [712, -258], [780, -258], [850, -330]])
    put(tree, x, z, 0, 1.5);
}

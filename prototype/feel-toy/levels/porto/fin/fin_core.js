/* Financial Core, the core part: the Exchange Ring (the strip 120..140 round Downtown), the South quarter
   (Grand Boulevard, Hotel Meridiana, the Sunken Garden, the Bank of the Alto) and the filler between them.
   Rect [-140, 140, -140, 230]. Design: levels/porto/design/fin.md section 5. */
function fin_core(K, P, PL) {
  fin_core_ring(K, P, PL);
  fin_core_boulevard(K, P, PL);
  fin_core_hotel(K, P, PL);
  fin_core_garden(K, P, PL);
  fin_core_bank(K, P, PL);
  fin_core_filler(K, P, PL);
  fin_core_life(K, P, PL);
}

/* is u inside one of the segments [a, b], m metres in from both ends */
function fin_core_inSeg(segs, u, m) { return segs.some(([a, b]) => u >= a + m && u <= b - m); }

/* the four sides of the ring. axisX: the sidewalk runs along x (u is x, v is z). Outer 136..140, inner 120..124 (east/west 124 at the corners). */
function fin_core_sides() {
  return {
    n: { axisX: true, sgn: -1, out: [[-140, -111], [-89, -50], [-30, 30], [50, 140]], inn: [[-120, -50], [-30, 30], [50, 120]], outLim: 140, innLim: 120, cross: [-100, -40, 40] },
    s: { axisX: true, sgn: 1, out: [[-140, -50], [-30, 30], [50, 140]], inn: [[-120, -50], [-30, 30], [50, 120]], outLim: 140, innLim: 120, cross: [-40, 40] },
    w: { axisX: false, sgn: -1, out: [[-136, -50], [-30, 30], [50, 136]], inn: [[-124, -50], [-30, 30], [50, 124]], outLim: 136, innLim: 124, cross: [-40, 40] },
    e: { axisX: false, sgn: 1, out: [[-136, -50], [-30, -10], [10, 30], [50, 136]], inn: [[-124, -50], [-30, 30], [50, 124]], outLim: 136, innLim: 124, cross: [-40, 0, 40] },
  };
}

/* one small thing on a sidewalk at (u, v); axisX: the sidewalk runs along x */
function fin_core_thing(K, kind, axisX, u, v) {
  const at = (du, dv) => axisX ? [u + du, v + dv] : [v + dv, u + du];
  const rect = (a, b) => { const [x0, z0] = at(-a, -b), [x1, z1] = at(a, b); return [x0, z0, x1, z1]; };
  const [x, z] = at(0, 0);
  if (kind === 'bench') K.bench(...rect(1.6, 0.3));
  else if (kind === 'planter') K.Bg(...rect(1.0, 0.7), 0.55, 'ledge', { edges: axisX ? 'ns' : 'ew' });
  else if (kind === 'ledge') K.ledge(...rect(2.5, 0.35));
  else if (kind === 'pad') fin_padx(K, ...rect(1.7, 0.8));
  else if (kind === 'rack') K.bikeRack(x, z, axisX, 2.4);
  else if (kind === 'news') K.newsBoxes(x, z, axisX, 2);
  else if (kind === 'trash') K.trashCan(x, z);
  else if (kind === 'long') { const [ax, az] = at(-4, 0), [bx, bz] = at(4, 0); K.strip(ax, az, bx, bz, 0.45, 0.7, { kind: 'Ledge', seg: 8, color: 0xa9a59c }); }
}

function fin_core_ring(K, P, PL) {
  const T = PL.colors, SIDES = fin_core_sides();
  // the road: four streets, no curbs and no crossings (the sidewalks are explicit boxes)
  for (const c of [-130, 130]) { K.street('x', c, -136, 136, 0, [], { rw: 6, noCurb: true }); K.street('z', c, -136, 136, 0, [], { rw: 6, noCurb: true }); }
  const AS = 0x56585d;
  for (const k in SIDES) {
    const S = SIDES[k], sg = S.sgn;
    for (const [kind, segs, lim, v0, v1, edge] of [
      ['out', S.out, S.outLim, sg < 0 ? -140 : 136, sg < 0 ? -136 : 140, S.axisX ? (sg < 0 ? 's' : 'n') : (sg < 0 ? 'e' : 'w')],
      ['inn', S.inn, S.innLim, sg < 0 ? -124 : 120, sg < 0 ? -120 : 124, S.axisX ? (sg < 0 ? 'n' : 's') : (sg < 0 ? 'w' : 'e')]]) {
      for (const [u0, u1] of segs) {
        S.axisX ? K.B(u0, -0.3, v0, u1, 0.15, v1, 'sidewalk', { edges: edge }) : K.B(v0, -0.3, u0, v1, 0.15, u1, 'sidewalk', { edges: edge });
        for (const [end, d] of [[u0, -1], [u1, 1]]) if (Math.abs(end) < lim) {     // a curb ramp at each end that faces a crossing
          const vm = (v0 + v1) / 2;
          K.hubbas.push(S.axisX ? { a: V(end, 0.15, vm), b: V(end + d * 1.4, 0.02, vm), w: 2.6, noRails: true, color: 0xb9b5ab }
                                : { a: V(vm, 0.15, end), b: V(vm, 0.02, end + d * 1.4), w: 2.6, noRails: true, color: 0xb9b5ab });
        }
      }
    }
    // zebra on each crossing of the ring road, and the asphalt stubs between the sidewalks
    for (const c of S.cross) {
      S.axisX ? K.zebra(c, sg * 130, 'z', 8) : K.zebra(sg * 130, c, 'x', 8);
      if (c === -100 || c === 0 && k === 'e') continue;
      S.axisX ? K.paintRect(c - 4, sg * 122 - 2, c + 4, sg * 122 + 2, AS, 0.006) : K.paintRect(sg * 122 - 2, c - 4, sg * 122 + 2, c + 4, AS, 0.006);
    }
  }
  // the outer stubs: Switchback Road, Metro Avenue and the boulevard
  K.paintRect(-107, -140, -93, -136, AS, 0.006); K.paintRect(136, -7, 140, 7, AS, 0.006); K.paintRect(-50, 136, -30, 140, AS, 0.006);
  // lamps every 24 m on the outer sidewalks
  for (const k in SIDES) { const S = SIDES[k];
    for (let u = -132; u <= 132; u += 24) if (fin_core_inSeg(S.out, u, 3)) { S.axisX ? K.lamp(u, S.sgn * 138.5, S.sgn) : K.lamp(S.sgn * 138.5, u, S.sgn); } }
  // furniture: along the outer sidewalk a thing every ~26 m, on the inner one every ~52 m, 3 m clear of every curb ramp and 2.5 m from a lamp
  const KO = ['bench', 'planter', 'rack', 'ledge', 'bench', 'news', 'long', 'pad', 'trash'], KI = ['ledge', 'planter', 'bench', 'rack', 'pad'];
  let ki = 0;
  for (const k in SIDES) { const S = SIDES[k], sg = S.sgn;
    for (let u = -123, i = 0; u < 135; u += 40, i++) {
      const kind = KO[ki++ % KO.length], w = kind === 'long' ? 5.5 : 3;
      const lampAt = x => Math.abs(((x + 132) % 24 + 24) % 24) < 3 || Math.abs(((x + 132) % 24 + 24) % 24 - 24) < 3;
      if (lampAt(u) && fin_core_inSeg(S.out, u, 0)) u += 4;
      if (!fin_core_inSeg(S.out, u, w)) continue;
      fin_core_thing(K, kind, S.axisX, u, sg * 138.9 + (kind === 'long' ? -sg * 0.3 : 0));
    }
    for (let u = -100, i = 0; u < 115; u += 52, i++) {
      const kind = KI[ki++ % KI.length];
      if (!fin_core_inSeg(S.inn, u, 3.5)) continue;
      fin_core_thing(K, kind, S.axisX, u, sg * 121.2);
    }
  }
  // a roadworks pocket on the north-east outer sidewalk, and a few more things where the cross streets meet the ring
  K.construction(94, -138, true);
  K.construction(138, 88, false);
  for (const [x, z, ax] of [[32.6, -138.9, true], [-32.6, -138.9, true], [32.6, 138.9, true], [-31.6, 121.2, true], [32.6, 121.2, true], [-98, -121.2, true], [-122, 33, false], [-122, -33, false],
    [-138.9, 33, false], [138.9, -33, false], [122, 33, false], [138.9, -12.5, false], [-92.6, -138.9, true], [-108, -138.9, true]]) {
    const pad = (Math.round(x) + Math.round(z)) % 2 !== 0;   // half of them manual pads (no grind lines: CONTRACT 8)
    if (pad) ax ? fin_padx(K, x - 1.6, z - 0.6, x + 1.6, z + 0.6) : fin_padx(K, x - 0.6, z - 1.6, x + 0.6, z + 1.6);
    else ax ? K.bench(x - 1.3, z - 0.3, x + 1.3, z + 0.3) : K.bench(x - 0.3, z - 1.3, x + 0.3, z + 1.3);
  }
  // manual pads on the sidewalk (0.25 over its top, no grind lines) where the Switchback and boulevard crossings leave a quiet run
  for (const sg of [-1, 1]) K.B(-66, 0, sg * 138.9 - 0.7, -60, 0.4, sg * 138.9 + 0.7, 'pad', { edges: '' });
  // the corners: an angled planter on each outer corner square
  for (const [cx, cz] of [[-138, -138], [138, -138], [-138, 138], [138, 138]]) K.Bg(cx - 0.9, cz - 0.9, cx + 0.9, cz + 0.9, 0.5, 'ledge', { edges: 'ns' });
}

function fin_core_boulevard(K, P, PL) {
  const T = PL.colors;
  K.street('z', -40, 140, 216, 0, [], { rw: 10, sw: 5, lamps: false });
  // the median: a 6 m curbed island with chamfered ends and four black granite ledges down the middle
  K.B(-43, -0.3, 146, -37, 0.15, 210, 'sidewalk', { edges: 'we' });
  K.hubbas.push({ a: V(-40, 0.15, 146), b: V(-40, 0.02, 144.8), w: 6, noRails: true, color: 0xb9b5ab });
  K.hubbas.push({ a: V(-40, 0.15, 210), b: V(-40, 0.02, 211.2), w: 6, noRails: true, color: 0xb9b5ab });
  for (const [z0, z1] of [[150, 160], [166, 176], [182, 192], [198, 208]]) K.B(-40.35, -0.3, z0, -39.65, 0.65, z1, 'ledge', { edges: 'we', color: T.black });
  for (const z of [163, 179, 195]) K.tree(-40, z);
  // bus stops and their benches, lamps in pairs every 16 m, trees between
  K.busStop(-52.6, 164, false, -1);
  K.busStop(-27.4, 196, false, 1);
  for (let z = 144; z <= 208; z += 16) { if (z !== 176) K.lamp(-54, z, -1); K.lamp(-26, z, 1); }   // none at 176: the hotel's east drive comes in there
  for (const z of [152, 184, 208]) K.tree(-52, z + 0.0);
  for (const z of [152, 168, 184]) K.tree(-28, z);
  K.trashCan(-51.2, 189); K.trashCan(-28.8, 190); K.newsBoxes(-51.4, 169, false, 2); K.hydrant(-26.2, 160); K.bikeRack(-26.4, 174, false, 2.4);
  fin_plant(K, -54.6, 198.5, -53.2, 202.5); K.ledge(-27.2, 204, -26.4, 211); K.ledge(-53.4, 142, -52.6, 149);
  // the boulevard's own gate end stays clear: nothing in x -50..-30 beyond z 210
}

function fin_core_hotel(K, P, PL) {
  const T = PL.colors;
  K.building(-130, 182, -70, 212, 10, T.glass3, 'office');
  K.B(-132, -0.5, 170, -68, 1.2, 182, 'marble', { edges: 'nwe' });                       // the front deck; its north edge faces the ring
  K.hubbas.push({ a: V(-132, 1.2, 176), b: V(-139.5, 0.02, 176), w: 6, kind: 'Ledge', color: 0xc4bfb3 });   // the west drive (9 %)
  K.hubbas.push({ a: V(-68, 1.2, 176), b: V(-55.2, 0.17, 176), w: 6, kind: 'Ledge', color: 0xc4bfb3 });       // the east drive, down to the boulevard
  K.B(-131, 0.9, 170, -104, 1.75, 171.1, 'ledge', { edges: 'n', color: T.granite });
  K.B(-96, 0.9, 170, -69, 1.75, 171.1, 'ledge', { edges: 'n', color: T.granite });
  K.stairSpot('z', 170, -1, -103, -97, 1.2, 0, 4, 0.36, { rails: [-103.4, -96.6] });
  K.prop(-130, 0, 181.8, -70, 3.6, 182.1, T.marble);                                      // the marble base
  K.prop(-112, 3.7, 178, -88, 3.95, 182.1, T.gold);                                       // the canopy
  for (const x of [-112, -88]) K.prop(x - 0.2, 1.2, 178, x + 0.2, 3.7, 178.4, T.gold);
  K.decorFns.push(D => D.sign('GRAND HOTEL MERIDIANA', -100, 9, 181.9, 24, 2.4, Math.PI, '#f2ead8', '#2f4a5e'));
  K.tree(-120, 173); K.tree(-80, 173);
  // the front: a bench on the deck and a pad each side of the stairs
  K.bench(-125, 177, -121, 177.6); K.bench(-79, 177, -75, 177.6);
  fin_padx(K, -114, 174, -110, 176, 0.18); fin_padx(K, -90, 174, -86, 176, 0.18);
  P.spot('Hotel Meridiana', -100, 1.2, 178, 0, [-134, 160, -68, 182]);
  P.challenge({ id: 'fin-hotel-four', name: 'Kickflip the Hotel Four', desc: 'Kickflip down the hotel four-stair', at: [-100, 1.2, 172], go: [-100, 1.2, 180.5, 0], kind: 'trick', tricks: ['Kickflip'], from: [-104, 170.2, -96, 181, 1.0], to: [-104, 158, -96, 169.6, -1, 0.5] });
}

function fin_core_garden(K, P, PL) {
  K.sunkenPlaza(24, 180, 16, 10, 1.8);
  for (const [x, z] of [[5.5, 167.5], [42.5, 167.5], [5.5, 192.5], [42.5, 192.5]]) K.tree(x, z);
  K.bench(18, 185.5, 22, 186.1); K.bench(26, 174.4, 30, 175);
  P.spot('Sunken Garden', 24, 0, 166, 0, [6, 168, 42, 192]);
  P.tape(30, 186.5, -1.8);
}

function fin_core_bank(K, P, PL) {
  const T = PL.colors;
  K.building(60, 188, 134, 214, 9, T.black, 'office');
  K.B(70, -0.5, 183.5, 100, 2.3, 186, 'marble', { edges: 'n', color: T.granite });          // the wall
  K.hubbas.push({ a: V(85, 1.4, 183.5), b: V(85, 0.02, 177.5), w: 30, noRails: true, color: 0xc4bfb3 });   // the bank up to it
  K.B(60, -0.3, 159.6, 84, 0.5, 160.4, 'ledge', { edges: 'ns', color: T.granite });
  K.B(96, -0.3, 159.6, 120, 0.5, 160.4, 'ledge', { edges: 'ns', color: T.granite });
  K.prop(60, 3.3, 187.7, 134, 3.7, 188, T.gold); K.prop(60, 8.3, 187.7, 134, 8.7, 188, T.gold);
  K.decorFns.push(D => D.sign('BANK OF THE ALTO', 97, 5.8, 187.9, 16, 2, Math.PI, '#d9a93f', '#2a2c30'));
  // the courthouse corner: a plaza of four trees and the south ring sidewalk leading in
  for (const [x, z] of [[64, 166], [124, 166], [64, 148], [128, 148]]) K.tree(x, z);
  P.spot('Bank Wall', 85, 0, 172, Math.PI, [60, 158, 134, 187]);
  P.challenge({ id: 'fin-bank-wall', name: 'Bank Wall Stall', desc: 'Grind or stall the top of the bank wall', at: [85, 2.3, 183], go: [85, 0, 165, Math.PI], kind: 'grind', area: [70, 182, 100, 187] });
  P.challenge({ id: 'fin-median', name: 'Median Run', desc: 'Grind a ledge down the Grand Boulevard median', at: [-40, 0.65, 150], go: [-40, 0, 138, Math.PI], kind: 'grind', rail: 'Ledge', area: [-41, 149, -39, 209] });
  P.spot('Boulevard Median', -40, 0.15, 148, Math.PI, [-55, 142, -25, 212]);
}

/* the stretches between the named spots: the Boulevard Line's run along z 148, the plaza in front of the bank, and the ground
   either side of the boulevard, so no street or line of ours goes bare (CONTRACT 7) */
function fin_core_filler(K, P, PL) {
  const T = PL.colors;
  // the Boulevard Line's run (0, 146) to (60, 148): ledges and planters along the strip south of the ring
  K.ledge(-30, 151.7, -22, 152.3); fin_plant(K, -14, 150.5, -11.4, 153); K.strip(-4, 150, 4, 150, 0.45, 0.7, { kind: 'Ledge', seg: 8, color: 0xa9a59c });
  fin_padx(K, 10, 150, 14, 152, 0.18); K.ledge(22, 151.7, 30, 152.3); fin_plant(K, 36, 150.5, 38.6, 153); K.rail(44, 0.9, 150, 54, 0.9, 150, 'Rail', true);
  // the plaza in front of the bank: a flatbar, a manual pad, benches, planters
  K.rail(66, 0.9, 170, 78, 0.9, 170, 'Flatbar', true); fin_padx(K, 104, 166, 112, 169, 0.18); K.bench(90, 150, 96, 150.6);
  K.bikeRack(114, 148, true, 2.4); K.newsBoxes(70, 146, true, 2); K.ledge(86, 146, 94, 146.6);
  // east of the boulevard: lawn furniture
  K.picnic(-14, 180, true); 
  fin_padx(K, 46, 176, 52, 178.5, 0.18); K.ledge(48, 190, 54, 190.6);
  // the hotel's flanks
  K.ledge(-128, 150, -118, 150.6); fin_padx(K, -92, 150, -86, 152, 0.18); 
  K.hydrant(-66, 168); K.trashCan(-67, 164);
}

function fin_core_life(K, P, PL) {
  // Boulevard traffic and peds
  P.traffic({ path: [[-40, 140], [-40, 212]], lane: 6.5, dir: 1, n: 3, speed: 11, r: 4 });
  P.peds({ path: [[-52.5, 142], [-52.5, 212]], n: 3 });
  P.peds({ path: [[-27.5, 142], [-27.5, 212]], n: 3 });
  // a skater sessioning the second median ledge
  P.npc({ kind: 'session', rail: [-40, 166, -40, 176], start: 160, end: 180, back: 3.4, side: 1, speed: 5.4 });
}

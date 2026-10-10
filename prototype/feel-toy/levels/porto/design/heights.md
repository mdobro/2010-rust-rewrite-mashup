# The Heights (`heights`) — district design

Rect **x -1000..1000, z -650..-230** (2,000 × 420 m). The only shared border is the **south edge
z -230** (Financial / fin), so the 12 m band is z -242..-230. The north edge (z -650) and the ends
(x ±1000) are map-edge hills and need no band. Every number in this doc was checked against a copy of
`portoBaseH` and of the ground function below (scratch tests: no slope over 45 % outside the box-covered
culvert headwall, and no drawn-ground error over 5 cm once the `P.region`s in 2.4 are in).

Gates (all on z -230, base y ≈ 1.0, corridor z -246..-230 kept at base height and clear of anything
over 0.3 m):

| gate | x | width | reached by |
|---|---|---|---|
| culvert | -700 | 16 | the Drainage Culvert channel, ending in a 48 m apron at grade |
| switchback | -100 | 16 | Switchback Road's last straight, "The Chute" (x -100) |
| observatory | 220 | 12 | Observatory Road (x 220) at the base slope |
| ridge | 650 | 16 | Ridge Road Descent (x 650) after the Three Crests |

Coordinates: x east, z south (+z is downhill, toward the city), y up. Yaw = atan2(-vx, -vz):
facing south π, north 0, east -π/2, west π/2.

---

## 1. Concept

The Heights is the hill the whole city falls away from. A flat **ridge plateau** (y 44) runs the full
width at the top, with the Radio Tower standing on it, and from it four very different ways down to the
city, one per gate:

* **West — the Reservoir.** A concrete **Drainage Culvert** runs dead straight from the ridge to the
  culvert gate. Halfway down, Reservoir Lane fords across it in a dip, and the channel's headwall turns
  that into the district's signature gap: the **Culvert Gap**. Up a terrace above the lane sits the
  hidden park, the drained **Water Tank** (Reservoir No. 3), fenced off with a breach in the fence.
* **Centre — the Switchback.** **Switchback Road** zig-zags down the face in four long legs and three
  hairpins, with yellow-painted curbs, guardrails and an overlook deck at each hairpin. The concrete
  **Switchback Banks** between the legs and the stepped **Overlook Steps** are the shortcuts.
* **Centre-east — the Observatory.** A domed observatory stands on a big concrete podium halfway
  down. Its west edge is a ledge that rises to 7 m over the hill, its south face is a cascade of
  stair sets (the **Observatory Steps**), and three stepped **Stargazer Decks** sit across the road.
* **East — the Terraces.** Three flat, benched terrace streets of villas cross the slope. The
  straight **Ridge Road Descent** crests at each one (the **Three Crests**: three roll-overs taken at
  60+ km/h). The **Vista Steps**, the villas' stoops and ledges, and **Ridge Park**'s long rail fill
  in between.

From the top of every way down you see a landmark: the Radio Tower behind you, the observatory dome
below, and the city and harbour beyond the gates.

---

## 2. Height plan

### 2.1 The base we sit on

`portoBaseH` across the district depends only on z (except the edge hills within 25 m of x ±1000 and
z -650):

| z | -618..-586 | -578 | -562 | -546 | -538 | -530 | -282 | -274 | -266 | -258 | -250 | -242 | -234 | -230 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| base y | 44.00 | 43.83 | 43.12 | 41.80 | 40.92 | 39.87 | 5.81 | 4.82 | 3.94 | 3.12 | 2.35 | 1.69 | 1.20 | ≈1.0 |

From z -546 to -282 the base is a straight 13.76 % slope (0.1376 m/m). Below -282 it curves out to the
gate at about 1.0. The edge hills (`+22·sm(edge/30)·…`) rise beyond |x| 975 and north of z -625. We
leave them alone and build nothing north of z -626 except the Radio Tower footing and a hut.

`B0(z)` below means `P.baseH(0, z)`: the base away from the edge hills.

### 2.2 `heights_plan()` — shared numbers (file `levels/porto/heights/heights_plan.js`)

Every kink below is on a multiple of 8 m, so the 8 m ground mesh draws it exactly. Copy these numbers
as given:

```js
function heights_plan() { return {
  RIDGE: { z: -596, y: 44, x0: -968, x1: 960, rw: 5, sw: 3 },        // flat on the plateau
  // benches: flat |z-zc| <= f at B0(zc), linear ramp back to the base over r; full for x0..x1, faded to 0 over `fade`
  BENCHES: [
    { id: 'lane',   zc: -392, f: 8,  r: 24, x0: -912, x1: -316, fade: 16 },   // Reservoir Lane, y 20.89
    { id: 'tank',   zc: -472, f: 24, r: 24, x0: -872, x1: -776, fade: 16 },   // Water Tank terrace, y 31.89
    { id: 'upper',  zc: -520, f: 8,  r: 24, x0: 496,  x1: 960,  fade: 16 },   // Upper Terrace, y 38.50
    { id: 'middle', zc: -440, f: 8,  r: 24, x0: 496,  x1: 960,  fade: 16 },   // Middle Terrace, y 27.49
    { id: 'lower',  zc: -360, f: 8,  r: 24, x0: 496,  x1: 960,  fade: 16 },   // Lower Terrace, y 16.48
  ],
  // the lane's dip (ford) through the culvert: x ramps xa..xb, full depth xb..xc, ramps xc..xd; z full |d|<=f, ramp r
  DIP: { zc: -392, xa: -760, xb: -720, xc: -680, xd: -640, depth: 2.5, f: 6, r: 8 },
  // Switchback Road: 4 legs (corridor |z-z_k| <= half), each linear in x between xW and xE (clamped beyond)
  SW: { legs: [ { z: -536, yW: 38.8, yE: 43.6 }, { z: -464, yW: 37.4, yE: 28.6 },
                { z: -392, yW: 18.2, yE: 27.0 }, { z: -320, yW: 16.6, yE: 8.6 } ],
        xW: -272, xE: -112, half: 8, north: [-584, -544], south: [-312, -248], zoneX: [-316, -68], blend: 48,
        hairpins: [ { c: [-272, -500], side: 'W' }, { c: [-112, -428], side: 'E' }, { c: [-272, -356], side: 'W' } ],
        R: 36, entry: { c: [-112, -572], R: 36 }, exit: { c: [-132, -288], R: 32 }, chuteX: -100 },
  // Drainage Culvert: floor half-width 4, walls 8 wide each side; depth profile below
  CUL: { x: -700, floor: 4, wall: 8, head: [-584, -560], full: 3, lipStart: -440, lipZ: -402, lipD: 1,
         laneN: -398, laneS: -386, landSlope: 0.30, apron: [-296, -248] },
  POOL: { cx: -824, cz: -472, R: 21, depth: 4.4, y0: 31.89 },
  PODIUM: { x0: 236, x1: 300, z0: -470, z1: -418, top: 31.8 },
  DECKS: [ { z0: -540, z1: -516, top: 41.29 }, { z0: -512, z1: -488, top: 37.53 }, { z0: -484, z1: -460, top: 33.68 } ], // x 128..204
  ROADS: [ // sloped road centrelines (for P.col asphalt + P.surface 'smooth'), [x,z] polylines, half-width hw
    { id: 'tank',    hw: 4, pts: [[-904, -588], [-904, -399]] },
    { id: 'obs',     hw: 5, pts: [[220, -588], [220, -230]] },
    { id: 'planet',  hw: 4, pts: [[268, -588], [268, -470]] },
    { id: 'descent', hw: 5, pts: [[650, -588], [650, -230]] },
    { id: 'crest',   hw: 4, pts: [[872, -588], [872, -368]] },
    { id: 'chute',   hw: 5, pts: [[-100, -288], [-100, -230]] },
    { id: 'laneE',   hw: 4, pts: [[-364, -392], [-272, -392]] },     // the lane's drop to the switchback
    { id: 'dip',     hw: 4, pts: [[-768, -392], [-632, -392]] } ],   // + the switchback legs, hairpins and arcs from SW
}; }
```

### 2.3 `heights_terrain(PL, baseH)` — the ground function (also in `heights_plan.js`)

`P.ground((x, z, base) => heights_terrain(PL, P.baseH)(x, z, base))`: build the closure once and pass
it in. The steps are applied in order to `h = base`:

```js
function heights_terrain(PL, baseH) {
  const B0 = z => baseH(0, z), sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const S = PL.SW, C = PL.CUL, D = PL.DIP;
  const fadeX = (b, x) => clamp((x - (b.x0 - b.fade)) / b.fade, 0, 1) * clamp((b.x1 + b.fade - x) / b.fade, 0, 1);
  function benchOff(b, x, z, base) {              // 1. benches (added to h)
    const d = z - b.zc, ad = Math.abs(d); if (ad >= b.f + b.r) return 0; const w = fadeX(b, x); if (!w) return 0;
    const yc = B0(b.zc);
    const off = ad <= b.f ? yc - base                                  // flat top at B0(zc)
                          : (yc - B0(b.zc + Math.sign(d) * b.f)) * (b.f + b.r - ad) / b.r;  // linear ramp back
    return off * w; }
  function dip(x, z) {                            // 2. the lane's ford (subtracted)
    const ax = x < D.xa || x > D.xd ? 0 : x < D.xb ? (x - D.xa) / (D.xb - D.xa) : x <= D.xc ? 1 : (D.xd - x) / (D.xd - D.xc);
    if (!ax) return 0; const ad = Math.abs(z - D.zc);
    return D.depth * ax * (ad <= D.f ? 1 : ad >= D.f + D.r ? 0 : (D.f + D.r - ad) / D.r); }
  const L = (k, x) => { const g = S.legs[k], t = (clamp(x, S.xW, S.xE) - S.xW) / (S.xE - S.xW); return lerp(g.yW, g.yE, t); };
  function field(x, z, h0) {                      // 3. the switchback field F
    const lg = S.legs, hf = S.half;
    if (z <= S.north[0]) return h0;
    if (z < lg[0].z - hf) return lerp(L(0, x), h0, (lg[0].z - hf - z) / (lg[0].z - hf - S.north[0]));
    for (let k = 0; k < 4; k++) {
      if (Math.abs(z - lg[k].z) <= hf) return L(k, x);                 // on a leg: flat across, linear along
      if (k < 3 && z > lg[k].z + hf && z < lg[k + 1].z - hf)            // an embankment between two legs
        return lerp(L(k, x), L(k + 1, x), (z - (lg[k].z + hf)) / ((lg[k + 1].z - hf) - (lg[k].z + hf)));
    }
    if (z < S.south[1]) return lerp(L(3, x), h0, (z - S.south[0]) / (S.south[1] - S.south[0]));
    return h0; }
  function culvertD(z) {                          // depth of the channel floor below B0(z)
    if (z < C.head[0] || z > C.apron[1]) return 0;
    if (z < C.head[1]) return C.full * (z - C.head[0]) / (C.head[1] - C.head[0]);   // the drop-in: 0 -> 3 m
    if (z < C.lipStart) return C.full;
    if (z <= C.lipZ) return lerp(C.full, C.lipD, (z - C.lipStart) / (C.lipZ - C.lipStart)); // shallows to the lip
    if (z < C.apron[0]) return C.full;
    return C.full * (C.apron[1] - z) / (C.apron[1] - C.apron[0]); }                 // the apron: 3 -> 0
  return (x, z, base) => {
    let h = base;
    for (const b of PL.BENCHES) h += benchOff(b, x, z, base);
    h -= dip(x, z);
    const [zx0, zx1] = S.zoneX;
    if (x > zx0 - S.blend && x < zx1 + S.blend && z > S.north[0] && z < S.south[1]) {
      const out = Math.max(0, zx0 - x, x - zx1); h = lerp(field(x, z, h), h, sm(out / S.blend)); }
    const ax = Math.abs(x - C.x);                 // 4. the culvert (replaces h inside |x+700| < 12)
    if (ax < C.floor + C.wall && z > C.head[0] && z < C.apron[1]) {
      const g = h;                                                     // the grade beside the channel
      if (z > C.lipZ && z < C.laneN)                                   // under the headwall box: lip down to the lane
        return lerp(B0(C.lipZ) - C.lipD, h, (z - C.lipZ) / (C.laneN - C.lipZ));
      if (z >= C.laneN && z <= C.laneS) return h;                      // the lane fords straight through
      let floor;
      if (z > C.laneS && z < C.laneS + 20) floor = Math.max(B0(z) - C.full, (B0(D.zc) - D.depth) - C.landSlope * (z - C.laneS)); // the landing
      else floor = B0(z) - culvertD(z);
      const wr = ax <= C.floor ? 0 : (ax - C.floor) / C.wall;          // walls: straight 8 m banks up to grade
      return Math.min(g, lerp(floor, g, wr)); }
    return h; };
}
```

Key heights this gives (checked):

| place | y |
|---|---|
| Ridge Road, anywhere x -968..960, z -604..-588 | 44.00 |
| Reservoir Lane flat, z -400..-384, x -912..-764 and -636..-364 | 20.89 |
| lane ford floor, x -720..-680, z -398..-386 | 18.39 |
| lane at the switchback junction (-272, -392) and leg 3's west end | 18.20 |
| Water Tank terrace, x -872..-776, z -496..-448 | 31.89 |
| Upper / Middle / Lower Terrace streets, z -528..-512 / -448..-432 / -368..-352 | 38.50 / 27.49 / 16.48 |
| switchback legs at x -192 (the Overlook Steps' column) | 41.2 / 33.0 / 22.6 / 12.6 |
| culvert floor at z -560 / -470 / -440 / lip -402 / -376 / -340 / -296 / -248 | 40.01 / 28.62 / 24.49 / 20.00 / 15.68 / 10.73 / 4.68 / 2.18 |
| Observatory Road (x 220) at z -588 / -470 / -418 / -364 / -282 / -246 | 44.00 / 31.62 / 24.46 / 17.03 / 5.81 / 2.02 |
| The Chute (x -100) at z -288 / -270 / -250 / -230 | 7.84 / 5.83 / 2.54 / 0.98 |

Everything else (the observatory, the decks, the Descent, the villas) sits on the plain base slope.

### 2.4 Who writes what in the ground

* `heights_plan.js` defines `heights_plan()`, `heights_terrain(PL, baseH)`, `heights_col(PL, T)` and
  `heights_surface(PL)` (2.5). **No part calls `P.ground`.** `index.js` does, first.
* The 12 m band and the gates need no special code: every feature above returns `base` for z > -248
  (the culvert apron ends at -248, the switchback's south blend at -248, and the benches stop at -336).
  The engine's band blend is then a no-op. Checked: deviation from base at z ≥ -246 is 0.000 everywhere.
* **`P.region`s** (in `index.js`, right after `P.ground`):

| rect [x0, x1, z0, z1] | res | why | counts toward 60k m² |
|---|---|---|---|
| -768, -632, -416, -360 | 1 | the ford dip, headwall and landing ramp | 7,616 |
| -720, -680, -592, -416 | 2 | culvert drop-in and walls (north) | 7,040 |
| -720, -680, -360, -240 | 2 | culvert walls and apron (south) | 4,800 |
| -368, -16, -584, -248 | 4 | the whole switchback (blends, hairpin colour edges) | — |
| -936, -896, -424, -360 | 4 | lane bench west end + Tank Road corner | — |
| -912, -896, -592, -424 | 4 | Tank Road colour edges | — |
| -888, -864, -520, -424 | 4 | tank terrace west fade | — |
| -784, -760, -520, -424 | 4 | tank terrace east fade | — |
| 472, 504, -552, -328 | 4 | terraces' west fade | — |
| 952, 968, -552, -328 | 4 | terraces' east fade | — |
| 208, 232, -592, -240 | 4 | Observatory Road colour edges | — |
| 256, 280, -592, -472 | 4 | Planetarium Drive colour edges | — |
| 640, 664, -592, -240 | 4 | Descent colour edges | — |
| 864, 880, -592, -360 | 4 | Crest Street colour edges | — |

Fine ground total: **19,456 m²**, plus the pools' own regions (the tank is 44 × 44 at res 0.5, the 3
backyard pools 12 × 12). The regions don't overlap each other. The engine only skips a coarser region
under a finer one that sits wholly inside it, so overlaps would double-draw.

### 2.5 Colour and surface (`heights_col`, `heights_surface`, set in index.js)

`P.col((x, z, h) => …)`: return the first that applies, else null (grass):
1. **Culvert concrete** `0xb3afa6` for |x+700| < 12, z -584..-248. Paint stays off the lane
   (z -398..-386), which is asphalt.
2. **Spillway concrete** `0xb3afa6` for x -830..-818, z -448..-400.
3. **Asphalt** `0x56585d` within `hw` of any ROADS polyline, and on the switchback road itself:
   * the legs (|z - z_k| ≤ 5 for x -272..-112, leg 4 x -272..-132),
   * the hairpins and the entry and exit arcs (|dist to centre - R| ≤ 5 on that arc's half or quarter),
   * the entry stub x -81..-71, z -596..-572.
4. **Switchback Banks concrete** `0xa9a59c`: inside the zone, between leg corridors, where the
   local slope `|T(x,z+1)-T(x,z-1)|/2 > 0.15`.
5. **Gravel** `0x9b8f7a` on the tank access track x -896..-872, z -475..-469.

`P.surface`: 'smooth' wherever P.col returns asphalt or concrete, 'rough' on the gravel track, null
elsewhere. Flat streets built with `K.street` paint themselves.

---

## 3. Layout

### 3.1 Sketch (1 char = 20 m; row label = z at the top of the row)

```
      x: -1000                                        0                                             +1000
 -650 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 -630 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^R^^^^^^^^^^^^^^^^^^^^^^^vvvvvvvvvvvvvvvvvvvvvvv^^
 -610 ^===|=========================================S==============|=|==================|==========|=====^
 -590 ^^..|..........C..............................S.kkkkkkk......|.|..........vvvvvvvv|vvvvvvvvvv|vvvv^^
 -570 ^^..|..........C.............................SS.kkkkkkk......|.|..........vvvvvvvv|vvvvvvvvvv|vvvv^^
 -550 ^^..|..........C...................SSSSSSSSSSS..........DDDD.|.|..........vvvvvvvv|vvvvvvvvvv|vvvv^^
 -530 ^^..|..........C.................ooS....#...............DDDD.|.|...........ttttttttttttt#ttttttttt^^
 -510 ^^..|.TTTTT....C.................oo.....#...............DDDD.|.|..........vvvvvvvv|vvvvv#vvvv|vvvv^^
 -490 ^^..|.TTTTT....C..................SS....#...............DDDD.|.|..........vvvvvvvv|vvvvv#vvvv|vvvv^^
 -470 ^^..|.TTTTT....C...................SSSSS#SSSSS..........DDDD.|O|@.........vvvvvvvv|vvvvv#vvvv|vvvv^^
 -450 ^^..|...ss.....C........................#....Soo.............|O@@..........ttttttttttttt#ttttttttt^^
 -430 ^^..|...ss.....C........................#.....oo.............|#OO.........vvvvvvvv|vvvvv#vvvv|vvvv^^
 -410 ^^..LLLLLLLLLLLXLLLLLLLLLLLLLLLLLLLSSSSS#SSSSS...............|#...........vvvvvvvv|vvvvv#vvvv|vvvv^^
 -390 ^^.............C..................SS....#....................|#...........vvvvvvvv|vvvvv#vvvv|vvvv^^
 -370 ^^.............C.................oo.....#....................|:............ttttttttttttt#ttttttttt^^
 -350 ^^.............C.................ooS....#....................|:...................|.ppppppppp.....^^
 -330 ^^.............C...................SSSSS#SSSS................|:...................|.ppppppppp.....^^
 -310 ^^.............C............................S................|:...................|.ppppppppp.....^^
 -290 ^^.............C.............................S...............|fff.................|.ppppppppp.....^^
 -270 ^^.............C.............................S...............|fff.................|.ppppppppp.....^^
 -250 ^^.............G.............................G...............G....................G...............^^
 -230 ....................................................................................................
```

Legend:

| char | meaning |
|---|---|
| `^` | map-edge hills (untouched) |
| `=` | Ridge Road (z -596) |
| `\|` | N–S roads: Tank Road x -904, Observatory Road x 220, Planetarium Drive x 268, Descent x 650, Crest Street x 872 |
| `S` | Switchback Road |
| `C` | Drainage Culvert (x -700) |
| `X` | the Culvert Gap (headwall over the lane ford) |
| `L` | Reservoir Lane (z -392) |
| `T` | Water Tank terrace |
| `s` | spillway |
| `k` | Ridgeline Lookout |
| `R` | Radio Tower |
| `o` | overlook decks |
| `#` | stairways (Overlook Steps at x -192, Observatory Steps at x 252, Vista Steps at x 760) |
| `D` | Stargazer Decks |
| `O` | observatory podium |
| `@` | dome |
| `:` | Observatory Walk |
| `f` | forecourt |
| `t` | terrace streets |
| `v` | villas |
| `p` | Ridge Park |
| `G` | gates |

### 3.2 The streets

| street | where | how built | y / grade |
|---|---|---|---|
| **Ridge Road** | z -596, x -968..960, rw 5, sw 3 (road z -601..-591, sidewalks to -604 / -588) | `K.street('x', -596, from, to, 44, crossings, {rw:5, sw:3, lamps:false})`, each part its own stretch | flat 44 |
| **Switchback Road** | 3.3: entry (-76,-596)→(-76,-572), arc, 4 legs, 3 hairpins, exit arc, Chute x -100 to the gate | sloped: P.col asphalt, sloped hubba sidewalks | 3–5.5 % legs, Chute 12–18 % |
| **Reservoir Lane** | z -392, x -904..-272, rw 4, sw 3 (road -396..-388, sidewalks to -399 / -385) | `K.street` flat for x -904..-768 and -632..-364; dip and east drop sloped | 20.89; ford 18.39; drops to 18.2 by x -316 |
| **Tank Road** | x -904, z -588..-399, rw 4, sw 3 | sloped | base slope (≈13.8 %), flat at the T with the lane |
| **Observatory Road** | x 220, z -588..-230, rw 5, sw 3 (road 215..225) | sloped | base slope, 13.8 % → 6 % at the gate |
| **Planetarium Drive** | x 268, z -588..-470, rw 4, sw 2.5 | sloped; ends on the podium's north edge | base slope |
| **Ridge Road Descent** | x 650, z -588..-230, rw 5, sw 3 | sloped except the three crests, which are the terrace benches | 13.8 % with 18.4 % ramps either side of each flat crest |
| **Upper / Middle / Lower Terrace** | z -520 / -440 / -360, x 500..956, rw 5, sw 3 | `K.street('x', zc, 500, 956, y, [650, 760, 872], …)` | flat 38.50 / 27.49 / 16.48 |
| **Crest Street** | x 872, z -588..-368, rw 4, sw 3 | sloped; flat across each terrace | base + benches |

Sloped sidewalks follow the mega4 pattern:
* one `K.hubbas` piece per straight run of ground (break at every kink z / x listed in 2.2), top
  0.15 m above the ground line, `noRails: true`, colour `0xc4c0b6`;
* plus one `K.rail(..., 'Curb', false)` along the road-side top edge;
* at each crossing, a 1.4 m curb-ramp hubba (as `K.street` does).

The base is linear from -546 to -282, so on Observatory Road and the Descent most runs are single
long pieces.

### 3.3 Switchback Road geometry

Road 10 m (hw 5) and sidewalks 3 m: each leg corridor is exactly the 16 m flat band of 2.2.

| piece | path | heights |
|---|---|---|
| entry stub | x -76, z -596 → -572 | 44.0 → 43.6 |
| entry arc | centre (-112, -572), R 36, from (-76,-572) to (-112,-536) heading west | 43.6 |
| leg 1 | z -536, x -112 → -272 (E→W) | 43.6 → 38.8 (3 %) |
| hairpin 1 | centre (-272, -500), R 36, west half; apex (-308, -500) | 38.8 → 37.4 |
| leg 2 | z -464, x -272 → -112 (W→E) | 37.4 → 28.6 (5.5 %) |
| hairpin 2 | centre (-112, -428), R 36, east half; apex (-76, -428) | 28.6 → 27.0 |
| leg 3 | z -392, x -112 → -272 (E→W) | 27.0 → 18.2 (5.5 %); T-junction with Reservoir Lane at (-272,-392) |
| hairpin 3 | centre (-272, -356), R 36, west half; apex (-308, -356) | 18.2 → 16.6 |
| leg 4 | z -320, x -272 → -132 (W→E) | 16.6 → 8.6 (5 %) |
| exit arc | centre (-132, -288), R 32, from (-132,-320) heading east to (-100,-288) heading south | 8.6 → 7.84 |
| The Chute | x -100, z -288 → -230 (gate) | 7.84 → 0.98 |

Heights on the hairpins come from the ground (`K.terrainH`); the hairpin ground has a gentle cross-fall
(≤ 2.5 %).

The embankments between legs are the **Switchback Banks**:

| bank | where | grade |
|---|---|---|
| leg 1→2 | east end, x ≈ -112 | 27 % |
| leg 2→3 | west end, x ≈ -272 | 34 % |
| leg 3→4 | east end, x ≈ -112 | 33 % |

Each bank flattens to about 3 % at its other end. They are coloured concrete wherever the slope is
over 15 %, ridden straight down as shortcuts, and the 0.75 m guardrails (ollie-able) mark their tops.

---

## 4. Spots (by part)

All builders: "Bg" = `K.Bg`, heights are world y, and every box that stands on a slope uses
`groundMin - 0.4` for its bottom.

### West (heights_west)

**W1 Drainage Culvert** (x -712..-688, z -584..-248)
* **Head (drop-in).** The channel starts at the Ridge Road south sidewalk (z -588). It goes 0 → 3 m
  deep over z -584..-560, at about 21 %. Mark the drop-in with a painted lip:
  `K.lip(-704, -584, -696, -584, 44.0)`.
* **Channel.** It runs straight, 3 m deep, with an 8 m floor and 8 m sloped walls (37 %, rideable as
  banks), averaging 13.8 % downhill. From z -440 it shallows to 1 m deep at the lip (z -402). The
  floor is 11.8 % there.
* **Headwall** (the takeoff):
  * the box `K.B(-712, 17.4, -402, -688, 20.0, -398, 'garage', {edges: 's'})`: its top is flush with
    the floor at the lip, then a 1.6 m drop to the lane;
  * the storm-door kicker `K.hubbas.push({a: V(-700, 20.6, -398.3), b: V(-700, 20.02, -401.9), w: 6, noRails: true, color: 0x6b6f75})`,
    0.6 m tall and 3.6 m long.

  The lane fords under it at y 18.39 (z -398..-386, curbs omitted for x -712..-688).
* **Landing.** A 30 % ramp starts at z -386 (18.39) and meets the 3 m deep floor again by about
  z -376.
* **The gap.**

  | take-off speed | result |
  |---|---|
  | 19 m/s (the speed from the head) | lands at z ≈ -378, 12 m clear of the lane |
  | 15 m/s or more | clears the lane |
  | under about 14.5 m/s | drops onto the lane |

* **Run-up.** 180 m of channel from the head. **Roll-away:** 130 m of channel to the apron and the
  gate.
* **Footbridge** at z -470: deck `K.B(-714, 31.62, -472, -686, 31.92, -468, 'wood')` (3.3 m
  clearance over the floor at 28.62). Add two 'Rail' handrails at y 32.9, z -472.1 and -467.9.
* **Edge rails.** K.rail 'Rail' along both wall tops (x -712.3 and -687.7) at 0.9 m above grade,
  post true, in straight pieces that break at z -560, -470 (bridge), -402 and -386 (lane) and -296:
  10 pieces.
* **Apron.** Concrete z -296..-248 back to grade, so the channel exits flush into the culvert gate.

**W2 Reservoir Lane** (z -392)
* **The ford** at x -720..-680: the lane dips 2.5 m. Cars and riders roll through. It gives a
  "dip-and-pop" over the ford ramps at x -760 and -640.
* **Pumphouse**: `K.building(-626, -376, -592, -364, 1, 0x8a8478, 'brick')`, south of the lane, plus
  `K.loadingDock(-626, -385, -600, 1)`. The dock is 1.3 m with a ramp off the east end.
* **Pump Curb**: `K.ledge(-664, -383.2, -630, -382.6, 0.45)` along the south sidewalk.
* **Trees** along the north sidewalk.

**W3 Water Tank** (section 6)

**W4 Spillway** (x -830..-818, z -448..-400)
* A concrete strip from the tank's south breach down to the lane. It drops 31.89 → 25.29 → 20.89
  (27.5 % then 18.3 %; the kink is at -424).
* **Spillway Bar**: `K.rail(-824, 31.84, -446, -824, 21.76, -402, 'Rail', true)`, one straight chord
  0.5–1.0 m over the ground.
* **Roll-away**: across the lane (sidewalk at -399) to the pumphouse side.

**W5 West villas** along Tank Road
* 4 `K.building` 2-floor villas at x -936..-920, at z -560, -520, -470 and -430, west of the road.
* Each has a stoop (the mega4 stoop pattern, facing the road).

### Centre (heights_switch)

**S1 Ridgeline Lookout** (x -40..90, z -588..-560): the district's front door
* Paved plaza at grade (y 44.0 → 43.0), with P.col concrete for x -40..90, z -588..-560.
* **Brow Ledge**: `K.B(-36, 42.4, -561, 86, 43.45, -560.4, 'ledge', {edges: 'ns'})`. Its top is
  0.45 over the ground at z -560 (43.0) and steps a little each way along z. Use 3 pieces whose tops
  follow the ground: x -36..6, 6..46, 46..86.
* 3 benches (`K.bench`), 2 coin telescopes (props), and a planter ledge pair at x 0..12 and 36..48,
  z -580..-577 (0.55 m).
* **Run-up**: the whole Ridge Road. **Roll-away**: the brow falls to the grass and the Switchback
  entry.

**S2 Radio Tower footing** (x 14..34, z -628..-608)
* Concrete pad `K.Bg(14, -628, 34, -608, 0.6, 'plaza', {edges: 'nswe'})`: 4 grindable edges, a manual
  pad off the Ridge Road north sidewalk.
* **Tower Hut**: `K.B(36, 43.6, -624, 44, 47.4, -616, 'building', {color: 0x9aa3a8})`.
* **Hut bank**: `K.hubbas.push({a: V(40, 47.4, -616.2), b: V(40, 44.02, -607), w: 4, noRails: true})`.
  It is a 9 m dirt-and-plate bank (38 %) up to the hut roof. The tape is on the roof.

**S3 Switchback curbs** (the "Yellow Line")
* Both road edges get a yellow curb strip.
  * **Legs**: one straight hubba each side per leg, 0.35 m wide, top 0.15 over the road, colour
    `0xe2c044`, noRails, plus one K.rail 'Curb' (post false) on the road-side top edge.
  * **Hairpins**: 8 chords per side (about 14 m each, 0.7 m sagitta).
  * **Arcs**: 4 chords per side.
* The outer edge of each curb is flush with the sidewalk hubba behind it.

**S4 Guardrails**
* `K.rail(..., 'Rail', true)` at 0.75 m above the sidewalk top, along each leg's south (downhill)
  edge at z = leg + 7.6, and round the outside of each hairpin (8 chords at r 43.5).
* Gaps:
  * x -196..-188 on legs 1–3, for the Overlook Steps;
  * the middle two chords of each hairpin, where the overlook deck opens.
* Each leg's rail is 2 pieces about 76 m long: the long grinds.

**S5 Overlooks** (one deck outside each hairpin apex, at the sidewalk top so you roll straight on)

| overlook | box | top |
|---|---|---|
| 1 | `K.B(-340, 37.2, -512, -316, 38.25, -488, 'wood', {edges: 'nsw'})` | 38.25 |
| 2 | `K.B(-68, 26.5, -440, -44, 27.95, -416, 'wood', {edges: 'nse'})` | 27.95 |
| 3 | `K.B(-340, 16.6, -368, -316, 17.55, -344, 'wood', {edges: 'nsw'})` | 17.55 |

* Each has an outer bar `K.rail` 'Rail' at +1.0 along the far edge (x -339.7 or -44.3), post true.
* Each has a bench and a telescope prop.
* The far edges stand only 0.4–0.7 m over the grass: ollie off them onto the hillside.

**S6 Overlook Steps** (x -194..-190, 4 m wide): three cascades down the embankments at x -192

They use the **raised pattern**:
* a landing box `K.B(-194.6, gmin - 0.4, za, -189.4, top, zb, 'plaza', {edges: 's'})`;
* then a flight `K.SET('z', zb, 1, -194, -190, top, top - n·rise, n, 0.4)` (n drops, n-1 boxes,
  run (n-1)·0.4);
* rails `K.rail` via `handrail('z', zb, 1, -194.45 / -189.55, …)`, i.e. `K.stairSpot` with
  `rails: [-194.45, -189.55]`.

Each landing starts 0.15 above the ground and stands up to 1.4 m over it at its downhill end. That is
a ledge drop you can ride off sideways.

| cascade | from → to | units (landing L + flight) | landing tops | ends |
|---|---|---|---|---|
| E1 (leg 1 → 2) | z -528 → -472 | 5 × (8.4 m + 8 risers of 0.205, run 2.8) | 41.35, 39.71, 38.07, 36.43, 34.79 | 33.15 on leg 2's sidewalk at -472 |
| E2 (leg 2 → 3) | z -456 → -400 | 5 × (7.6 m + 10 risers of 0.208, run 3.6) | 33.15, 31.07, 28.99, 26.91, 24.83 | 22.75 at -400 |
| E3 (leg 3 → 4) | z -384 → -328 | 5 × (7.6 m + 10 risers of 0.200, run 3.6) | 22.75, 20.75, 18.75, 16.75, 14.75 | 12.75 at -328 |

Landing k (k = 0..4) runs from `z0 + k·U` to `z0 + k·U + L`, where U = L + run. The flight runs from
there to `z0 + (k+1)·U`.

The guardrail gaps let you roll from a leg straight into a cascade: 15 flights, 30 handrails.

**S7 The Chute** (x -100, z -288..-230)
* The last 58 m at 12–18 %.
* Curbs are 'Curb' hubbas; they stop at z -248 so the gate corridor is clear.
* A row of 4 `K.parkingBlock`s on the west sidewalk at z -284..-262 (manual / grind blocks at speed).

**S8 Radio Tower** (landmark plus the model) at (24, 44, -618): section 7.

### Centre-east (heights_obs)

**O1 The Podium**
* `K.B(236, 23.5, -470, 300, 31.8, -418, 'plaza', {edges: 'w'})`, top 31.8.
* **North edge**: 0.18 above the ground at z -470. Add a 1.2 m chamfer hubba (31.62 → 31.8) where
  Planetarium Drive arrives, x 262..274.
* **West edge, the "Observatory Ledge"**: a 52 m grindable box edge. Its outside drop grows from
  0.2 m (z -470) to 7.3 m (z -418). You can hop on from the 8 m grade strip at x 228..236 (between
  the road's east sidewalk and the podium) at its north end, or from the deck itself.
* **South face**: 7.3 m.
  * The steps take x 244..260.
  * Balustrade ledges `K.B(236, 31.8, -419.4, 243.6, 32.35, -418, 'ledge', {edges: 'ns'})` and
    `(260.4 … 300)`: 0.55 m, grindable, with a 7 m drop behind.
* On top:
  * the **Dome Court**: two planters `K.planter(242, -464, 256, -460)` and `(242, -440, 256, -436)`
    (0.55 m), and a bench row;
  * the dome drum at (286, -444), r 10.

**O2 Dome**
* Drum and dome are drawn with `D.add` (a cylinder r 10 h 6, and a hemisphere r 10 on top: apex
  y 47.8). Make each geometry once.
* Collision is 3 boxes:
  * `K.B(277, 31.8, -448, 295, 37.8, -440, 'building', {color: 0xdcd8cc})`
  * `K.B(281, 31.8, -453, 291, 37.8, -435, …)`
  * `K.B(279, 31.8, -451, 293, 37.8, -437, …)`
* A door prop on the west face.

**O3 Observatory Steps** (x 244..260, 16 m wide)

The cascade drops from the podium's south edge (z -418, 31.8): flight first, then landing.
* **Flights**: 5 units of an 8-riser flight (rise 0.30, tread 0.42, run 2.94) plus a 6 m landing box.
* **Landing tops**: 29.40, 27.00, 24.60, 22.20, 19.80 (z -415.06..-409.06, -406.12..-400.12,
  -397.18..-391.18, -388.24..-382.24 and -379.30..-373.30).
* **Final flight**: 6 risers of 0.30 (run 2.1), from z -373.30 down to the Walk at z -371.2,
  y 18.00, flush with the ground (18.02).
* **Rails**: each of the 6 flights has 3 handrails (x 243.55, 252, 260.45): 18 lines.
* **Landing boxes**: `{edges: 'ew'}` (10 lines).
* **Height over the hill**: 7.3 m at the top, falling to 1.5 m by the last landing. Each landing is
  6 m: enough to land a flight and set up for the next.

**O4 Observatory Walk** (x 244..260, z -371..-282, at grade, 13.8 %)
* Paved (P.col concrete).
* **Walk Ledges**: sloped hubba ledges 0.45 tall and 0.6 wide, at x 242.7 and 261.3, in 3 pieces
  each (z -366..-346, -340..-320, -314..-294), kind 'Ledge'. Their top follows the ground +0.45:
  6 hubbas, 12 lines.
* Benches between pieces.
* **Run-up**: the steps. **Roll-away**: the forecourt.

**O5 Forecourt** (x 230..300, z -282..-248, at grade)
* 3 sloped hubba planters along z (x 238, 262, 286; z -278..-256; 0.5 tall, 2 m wide).
* A drinking-fountain pad `K.pad(268, -270, 274, -266)`.
* Peds.
* It drops out at the observatory gate (x 214..226). The corridor z -246..-230 stays clear.

**O6 Stargazer Decks** (x 128..204), three parking-deck boxes (mat 'garage')

| deck | box | top | north edge | south face |
|---|---|---|---|---|
| A | `K.B(128, 37.5, -540, 204, 41.29, -516, 'garage', {edges: 's'})` | 41.29 | +0.15 | 3.3 m |
| B | `(… 33.6, -512, … 37.53, -488 …)` | 37.53 | +0.13 | 3.4 m |
| C | `(… 29.8, -484, … 33.68, -460 …)` | 33.68 | +0.14 | 3.4 m |

* **Gaps**: 4 m wide, with 3.8 m drops (A → B, B → C). They clear from about 6 m/s; land 6–10 m in.
* **Access**: from the Ridge Road down a paved lane x 140..200 at grade (z -588..-540), straight onto
  deck A.
* **Dressing**: 2 parked `K.car` and a row of `K.parkingBlock`s on each deck.
* C's south face drops onto the grass; roll away down to the Observatory Road.
* **Deck lamps**: `D.lamp` on deck tops (2 each).

**O7 Ridge villas (obs)**: 6 `K.building` villas
* 3 north of Ridge Road, x 300..470, z -634..-618, with one backyard pool at (390, -612).
* 3 on the slope east of the podium, x 320..460, z -520..-490, 2 floors, with stoops to Planetarium
  Drive.

### East (heights_east)

**E1 Ridge Road Descent and the Three Crests** (x 650)
* Base slope, then flat across each terrace at z -528..-512, -448..-432 and -368..-352.
* Ramps either side of each flat are 18.4 % for 24 m.
* Speed 18–21 m/s by the second crest. At that speed the crests unweight the board: you get small
  air if you pop.
* Sidewalk hubbas break at every kink: -546, -544, -528, -512, -488, -472, -448, -432, -408, -392,
  -368, -352, -328, -282.
* **Run-up**: 60 m from the Ridge Road. **Roll-away**: 120 m from the last crest to the gate.

**E2 Terrace streets**
* Flat (benched), built with K.street.
* Crossings at the Descent (650), the Vista Steps' foot (760) and Crest Street (872).
* Each street's west end (x 500) is a dead end with a turning circle painted (decor), 4 m inside
  the fade.

**E3 Vista Steps** (x 756..764, 8 m wide): two cascades of the raised pattern

| run | landing (top) | flight (risers × 0.2, tread 0.4) |
|---|---|---|
| Upper → Middle | z -512..-504 (38.65) | 11 to z -500.0 |
|  | -500..-492 (36.45) | 11 to -488.0 |
|  | -488..-480 (34.25) | 7 to -477.6 |
|  | -477.6..-469.6 (32.85) | 9 to -466.4 |
|  | -466.4..-458.4 (31.05) | 11 to -454.4 |
|  | -454.4..-450.0 (28.85) | 6, run 2.0, lands on the Middle Terrace sidewalk at -448 (27.65) |
| Middle → Lower | -432..-424 (27.65) | 11 to -420.0 |
|  | -420..-412 (25.45) | 11 to -408.0 |
|  | -408..-400 (23.25) | 7 to -397.6 |
|  | -397.6..-389.6 (21.85) | 9 to -386.4 |
|  | -386.4..-378.4 (20.05) | 11 to -374.4 |
|  | -374.4..-370.0 (17.85) | 6 to the Lower Terrace sidewalk at -368 (16.65) |

* Each flight starts at the landing's end. Each landing top is 0.15–0.19 above the ground at its
  uphill end (checked).
* Rails: handrails both sides (x 755.55, 764.45): 24 lines.
* A centre hubba down the long 11-sets: `stairHubba` at x 760 on the 4 longest flights.

**E4 Crest Street** (x 872): sloped, like the Descent but quieter (no traffic down it, only up). It is
the slow way back up.

**E5 The Terraces villas** (rows R1 z -508..-452, R2 z -428..-372)
* Lots 22 m wide along each row, skipping x 640..662 (Descent), 752..768 (Vista Steps) and 862..884
  (Crest Street): 10 villas a row.
* Each villa is `K.building(x0, zf - 16, x0 + 14, zf - 4, 2, col, 'stone' | 'brick')`, fronting the
  terrace street below it (zf = the street's north sidewalk edge, -448 or -368).
* In front of each, on the uphill ground:
  * a **yard wall ledge** `K.Bg(x0, zf - 3.6, x0 + 14, zf - 3, 0.55, 'ledge', {edges: 'ns'})` (on a
    slope, so it is tall at its south side);
  * a **stoop** (mega4 pattern), a box at the door plus `K.SET` down to the sidewalk and one handrail.

  Every other villa gets a driveway cut kicker instead.
* **R0** on the plateau slope north of Upper Terrace (z -584..-532, gentle 6–15 %): 8 villas, no
  pools.
* **Ridge Villas** north of Ridge Road (x 500..950, z -634..-618, flat 44): 6 villas, with 3
  `K.backyardPool`s in their front gardens at (600, -612), (760, -612) and (900, -612). The ground is
  flat 44 there, so the pools sit level.
* Fence line `K.B` mat 'fence' on each pool garden, with a gap.

**E6 Ridge Park** (x 668..860, z -348..-250)
* A grass slope below the Lower Terrace.
* A paved path x 698..708 from (703, -352) straight down to (703, -252), at base grade.
* **Ridge Park Rail**: `K.rail(706, 15.7, -344, 706, 4.2, -262, 'Rail', true)`. It is 82 m long:
  0.7 m over the ground at both ends (ground 15.02 and 3.50), 0.57 m at the middle (z -303) and
  1.2 m at z -282, where the base starts to curve.
* 3 picnic tables (`K.picnic`), trees.
* Roll-away: 10 m of grass to the band.

**E7 Lower Terrace shop deck**: see 7.4.

---

## 5. Lines (30–60 s each)

1. **The Reservoir Run** (west, 40 s)

   | section | time |
   |---|---|
   | Culvert Head drop-in off the Ridge Road | 0:00 |
   | carve the walls, hop up for a wall-top edge-rail grind | |
   | under the footbridge (z -470) | |
   | storm-door kicker, Culvert Gap over the lane | 0:18 |
   | wall carves down the channel | |
   | apron | |
   | out the culvert gate into fin's arroyo | 0:40 |

   Variant: Tank → Spillway Bar → across the lane → drop into the culvert below the gap.

2. **The Yellow Line** (centre, 55 s)
   * Lookout plaza: brow ledge, grind.
   * Switchback entry.
   * Leg 1 curb grind.
   * Overlook 1: roll on, ollie off its far edge or carve back.
   * Leg 2: guardrail grind (76 m piece).
   * Hairpin 2.
   * Drop the leg 2→3 Overlook Steps E2 instead of the hairpin, then leg 3.
   * Hairpin 3.
   * Bomb the 33 % bank to leg 4.
   * Exit arc and The Chute, out the switchback gate.

3. **Stargazer** (centre-east, 45 s)
   * Ridge Road → deck lane.
   * Deck A → gap → B → gap → C.
   * Drop off C.
   * Cross Observatory Road onto the grade strip.
   * Pop onto the Observatory Ledge and grind it.
   * Exit onto the podium top, then planters.
   * Observatory Steps: 6 flights, rails or stairs.
   * Walk Ledges, forecourt, observatory gate.

4. **Three Crests** (east, 35 s)
   * Ridge Road → Descent, three crests at 60+ km/h. Bail-out options at each crest:
     * carve onto Middle Terrace, curb grind;
     * Vista Steps (Middle → Lower);
     * shop deck.
   * Then Ridge Park Rail and the ridge gate.

5. **Ridge Traverse** (all, 60 s, for the score challenges)
   * Ridge Road east → west: sidewalk curbs, tower footing manual, hut bank to roof.
   * Down the Lookout brow into the Switchback.
   * Overlook Steps E1.
   * Bank drop.
   * Reservoir Lane west at the leg 3 T.
   * Pumphouse dock and Pump Curb.
   * Ford dip pop.
   * Drop into the culvert below the gap, off the lane's south edge at x -700 (down the 30 % landing
     ramp).
   * Ends at the culvert apron and out the culvert gate.

---

## 6. The Water Tank (hidden park, "Reservoir No. 3")

Terrace bench flat at y 31.89, x -872..-776, z -496..-448.

* **Bowl**: `K.pool(-846, -802, -494, -450, [[K.poolS.circle(-824, -472, 21), 4.4]], 31.89, 0.5)`.
  * Floor at 27.49 for r < 16.2.
  * Transitions about 4.8 m wide, near vertical (about 85°) at the coping: this is the wallride wall.
* **Coping**: 24 rails at r 21.0, y 31.89, `{kind: 'Coping', coping: true}`.
* **Deck**: the 1.3 m ring between the coping and the rim. Paint it concrete (decor plane).
* **Tank Rim** (the brick parapet): a chain of 24 flat hubbas round r 22.6.
  * Each is a chord with a = b height 32.64 (0.75 m tall: ollie-able), w 0.6, colour `0x8a5a3a`,
    kind 'Ledge' side rails.
  * **Gaps**: 3 chords facing west removed (angles 165°..195°): the breach from the access track.
    Remove 2 chords facing south (≈ 75°..105°) as well: the spillway exit.
* **Valve Ring** on the floor: 8 flat hubba chords at r 9, top 27.94 (0.45), w 0.6, kind 'Ledge'.
* **Spill Ledge**: a half ring at r 14 on the south half (6 chords), top 27.99 (0.5).
* **Valve Tower**: `K.B(-826, 27.0, -474, -822, 30.69, -470, 'metal', {edges: 'nswe'})`.
  * 3.2 m tall, a tape on top.
  * Reach it from the coping with a transfer, or off the Valve Ring with a 0.9 m ollie onto a 1.4 m
    pipe-stack box `K.B(-830, 27.49, -472, -826.5, 28.4, -470, 'metal')` beside it.
* **Fence**: chain-link, mat 'fence', 2.4 m.
  * Boxes along x -870 (with a 6 m gap at z -475..-469), x -778, z -498 and z -446 (with a gap at
    x -830..-818 for the spillway).
  * The west gap is the breach in "RESERVOIR No. 3 — NO ENTRY".
* **Access track**: gravel, at grade from Tank Road (x -896) east along z -472 to the fence (x -872).
  * Ground there: the tank fade (x -888..-872) blends base to bench. Both are 31.89 at z -472, so
    the track is flat.
* **Lines in the park**:
  * coping laps;
  * rim grind to drop-in;
  * Valve Ring to Spill Ledge;
  * transfer over the Valve Tower;
  * out the south breach into the spillway.
* **Lights**: 4 `D.lamp` on the rim (it's a night spot).
* Not visible from the Ridge Road (the terrace is 60 m below and screened by trees along z -540).

---

## 7. Buildings, dressing, landmarks, signs, shops

### 7.1 Landmarks (2)

* **Radio Tower** `P.landmark({at: [24, 44, -618], near: 140, parts: [...]})`

  | shape | at | size | colour |
  |---|---|---|---|
  | box | [0, 20, 0] | [12, 40, 12] | 0xc8432f |
  | box | [0, 58, 0] | [7, 36, 7] | 0xe8e4dc |
  | box | [0, 92, 0] | [3.5, 32, 3.5] | 0xc8432f |
  | sphere | [0, 110, 0] | [2.5, 2.5, 2.5] | 0xff3b2e |

  The real model is `D.add`: 4 tapering leg cylinders (r 0.5, made once), cross-bracing bands every
  10 m alternating red and white, and a top beacon. It stands on the footing pad (S2). About 110 m
  tall, it is seen from every gate.
* **Observatory dome**

  | shape | at | size | colour |
  |---|---|---|---|
  | cyl | [0, 3, 0] | [20, 6, 20] | 0xdcd8cc |
  | sphere | [0, 6, 0] | [20, 20, 20] | 0xdcd8cc |
  | box | [-18, -4, 0] | [64, 8, 52] | 0xb8b2a6 |

  At (286, 31.8, -444), near 140.

### 7.2 Signs (7 of 8 `D.sign`)

rotY θ faces (sin θ, cos θ): 0 = south, π = north, π/2 = east, -π/2 = west.

| text | x, y, z | w × h | rotY | part |
|---|---|---|---|---|
| RIDGELINE LOOKOUT | 24, 47.6, -587 (gantry on 2 posts) | 9 × 1.4 | π | switch |
| SWITCHBACK ROAD | -66, 46.8, -586 (post) | 6 × 1 | π/2 | switch |
| OBSERVATORY | 278, 29.4, -417.9 (on the podium face) | 10 × 1.4 | 0 | obs |
| STARGAZER DECKS | 166, 44.5, -541 (gantry) | 8 × 1.2 | π | obs |
| RESERVOIR No. 3 — NO ENTRY | -870.1, 33.6, -480 (on the fence) | 7 × 1 | -π/2 | west |
| CULVERT — DANGER | -714, 45.8, -586 (post) | 5 × 1 | π | west |
| THE TERRACES | 663, 41.5, -532 (post) | 7 × 1.2 | π | east |

### 7.3 Trees and lamps

* **Lamps**: own lamps (K.lamp, solid) at most 140 in all.
  * Ridge Road every 40 m on alternating sides (~48).
  * Switchback: north side of each leg every 32 m, plus 2 per hairpin (~26).
  * Terrace streets: K.street lamps on (they come with trees). Count them against the 140.
  * Observatory Road and Descent: every 48 m on one side.
* **Trees**: K.tree (solid) at most 180.
  * Plateau verges.
  * Villa gardens.
  * A screen of 20 along z -540 above the tank (x -880..-770).
  * Groves on the switchback's inner hairpin lawns.
  * Ridge Park.
* Decor-only `D.tree` groves (not solid) only on the map-edge hills (x < -976, x > 976, z < -626),
  about 120.
* Far detail:
  * `D.building` boxes for 6 far villas on the edge hills;
  * `D.add` low dry-stone walls along Tank Road;
  * `D.stain` under the culvert footbridge;
  * `D.tag` on the culvert walls (6) and the headwall face.

### 7.4 Skate shops (2)

* **Thin Air Skate Supply**: Lookout, north side of the Ridge Road.
  * Building `K.building(52, -624, 68, -608, 2, 0x6e7f8c, 'office')`.
  * Forecourt `K.B(52, 43.6, -608, 68, 44.15, -604, 'plaza')`.
  * `P.shop({name: 'Thin Air Skate Supply', sign: [60, 48.0, -607.96, 0, 7], awning: [54, -608, 66, -606.4, 46.35], zone: [56, -607.8, 64, -604.8], door: [60, 44.15, -607.8]})`.
* **Low Gear Boards**: Lower Terrace, south side.
  * Building `K.building(584, -348, 600, -334, 2, 0xa0563c, 'brick')`.
  * Shop deck `K.B(580, 14.8, -352, 604, 16.63, -348, 'plaza', {edges: 'ew'})`, level with the
    sidewalk over the downhill ground.
  * `P.shop({name: 'Low Gear Boards', sign: [592, 20.48, -348.04, Math.PI, 7], awning: [586, -349.6, 598, -348, 18.83], zone: [588, -351.2, 596, -348.2], door: [592, 16.63, -348.2]})`.

---

## 8. Challenges, tapes, traffic, peds, skaters, fast travel

`FLIP = 'flip|shuv|Shove|Impossible|Varial'`. Boxes are `[x0, z0, x1, z1, yMin, yMax]`.

### 8.1 Challenges (10: 7 gold, 3 red)

| id | name | kind | data | owner |
|---|---|---|---|---|
| heights-culvert-gap | Culvert Gap | gap | from [-711,-406,-689,-398, 19.8], to [-711,-386,-689,-360, 12, 18.6]; at [-700, 21.5, -398]; go [-700, 38.2, -540, π] | west |
| heights-tank-coping | Reservoir Coping | grind | rail 'Coping', area [-846,-494,-802,-450]; at [-824, 32.6, -451]; go [-852, 31.95, -472, -π/2] | west |
| heights-yellow-line | The Yellow Line | grind | rail 'Curb', area [-272,-470,-112,-458]; at [-192, 33.3, -459]; go [-262, 36.9, -462, -π/2] | switch |
| heights-guardrail | Guardrail Grind | grind | rail 'Rail', area [-272,-386,-112,-382, 18, 28.5]; at [-200, 23.5, -384]; go [-120, 26.6, -390, π/2] | switch |
| heights-three-crests | Three Crests | speed | speed 65/3.6, area [640,-528,660,-300]; at [650, 39.5, -520]; go [650, 44.0, -592, π] | east |
| heights-obs-flip | Flip the Observatory Steps | trick | trick FLIP, from [244,-424,260,-418, 31.5], to [244,-415.06,260,-409.06, 29.0, 29.8]; at [252, 32.6, -421]; go [252, 31.85, -436, π] | obs |
| heights-deck-gap | Stargazer Gap | gap | from [128,-540,204,-516, 41.0], to [128,-512,204,-488, 37.3, 37.9]; at [166, 41.6, -517]; go [166, 41.35, -536, π] | obs |
| heights-overlook-line (hard) | Overlook Line | line | pts 4000, need [['grind', 3]], area [-340,-512,-316,-488] (start on Overlook 1); at [-328, 38.8, -500]; go [-326, 38.3, -500, -π/2] | switch |
| heights-obs-smith (hard) | Smith the Observatory Ledge | grind | grind 'Smith\|Feeble', area [235,-470,237.5,-418]; at [232, 31.0, -462]; go [232, 31.7, -478, π] | obs |
| heights-tank-score (hard) | Own the Tank | score | pts 8000, area [-872,-500,-776,-444]; at [-824, 32.4, -498]; go [-852, 31.95, -472, -π/2] | west |

Each owner part registers its own with `P.challenge`.

### 8.2 Tapes (6, `P.tape(x, z, y)`)

| # | where | x, z, y | owner |
|---|---|---|---|
| 1 | Tower Hut roof (up the hut bank) | 40, -620, 47.4 | switch |
| 2 | under the culvert footbridge | -700, -470, 28.62 | west |
| 3 | top of the tank's Valve Tower | -824, -472, 30.69 | west |
| 4 | Stargazer deck C, SW corner | 130, -462, 33.68 | obs |
| 5 | behind the middle Ridge Villa pool | 760, -619, 44.0 | east |
| 6 | far end of Overlook 1 | -338, -500, 38.25 | switch |

### 8.3 Traffic

The cars follow the ground. Each loop is registered by the part named.

* **West loop** (heights_west registers it; it crosses into switch's rect, which is fine for a
  path):
  * path [-76,-596], [-904,-596], [-904,-392], [-112,-392], [-86.5,-402.5], [-76,-428], [-86.5,-453.5],
    [-112,-464], [-272,-464], [-297.5,-474.5], [-308,-500], [-297.5,-525.5], [-272,-536], [-112,-536],
    [-86.5,-546.5], [-76,-572];
  * lane 2.0, r 8, speed 9;
  * dir +1 n 3, and dir -1 n 3.

  The cars ford the culvert at z -392: the gap jumps over them.
* **East loop** (heights_east): path [650,-596], [872,-596], [872,-360], [650,-360]; lane 2.5, r 8,
  speed 10, dir ±1, n 3 each.
* **Dome loop** (heights_obs): path [220,-596], [268,-596], [268,-476], [220,-476]; lane 2.0, r 6,
  speed 8, dir +1, n 2. There is a service lane at z -476 between the two roads, x 225..263, at
  grade: P.col asphalt.

### 8.4 Peds

| place | path | n | owner |
|---|---|---|---|
| Lookout | [[-30,-586],[84,-586],[84,-563],[-30,-563]] | 6 | switch |
| Forecourt | [[234,-280],[298,-280],[298,-252],[234,-252]] | 4 | obs |
| Middle Terrace sidewalks | [[504,-446.5],[952,-446.5],[952,-433.5],[504,-433.5]] | 5 | east |
| Lower Terrace sidewalks | [[504,-366.5],[952,-366.5],[952,-353.5],[504,-353.5]] | 5 | east |

### 8.5 NPC skaters

Copy dt.js shapes.

| kind | definition | owner |
|---|---|---|
| loop | path [[-30,-582],[80,-582],[80,-566],[-30,-566]], speed 5.5 | switch |
| loop | path [[506,-443],[950,-443],[950,-437],[506,-437]], speed 6 | east |
| session | Lookout brow ledge, rail [-20,-560.7,60,-560.7], start -34, end 74, approaching from the plaza (north) side | switch |
| session | Observatory Ledge, rail [236,-466,236,-436], start -474, end -428, on the podium-top side | obs |
| session | Pump Curb, rail [-660,-382.9,-632,-382.9], start -668, end -624, from the lane side | west |

### 8.6 Fast travel (`P.travel`) and spots (`P.spot`)

| name | kind | x, y, z, yaw | owner |
|---|---|---|---|
| Ridgeline Lookout | district | 24, 43.9, -578, π | switch |
| The Water Tank | park | -852, 31.95, -472, -π/2 | west |
| Switchback Top | spot | -120, 43.6, -536, π/2 | switch |
| Culvert Head | spot | -700, 44.15, -589.5, π | west |
| Observatory Terrace | spot | 252, 31.85, -436, π | obs |
| Ridge Road Descent | spot | 650, 44.0, -592, π | east |
| Thin Air Skate Supply | spot | 60, 44.15, -603, 0 | switch |
| Low Gear Boards | spot | 592, 16.63, -354, 0 | east |

`P.spot` (name, x, y, z, yaw, area):

| spot | owner |
|---|---|
| Culvert Gap | west |
| Water Tank | west |
| Spillway | west |
| Ridgeline Lookout | switch |
| Switchback Road | switch |
| Overlook Steps | switch |
| Observatory Steps | obs |
| Observatory Ledge | obs |
| Stargazer Decks | obs |
| Three Crests | east |
| Vista Steps | east |
| Ridge Park Rail | east |

Use the fast-travel coordinates or the spot centres above, with the spot's rect as its area.

---

## 9. Budget estimate

| | west | switch | obs | east | total | cap |
|---|---|---|---|---|---|---|
| boxes | 150 | 210 | 190 | 290 | **~840** | 900 |
| grind lines | 140 | 200 | 150 | 180 | **~670** | 700 |
| K.building | 6 | 2 | 8 | 34 | **~50** | 70 |
| D.sign | 2 | 2 | 2 | 1 | **7** | 8 |
| fine ground (res ≤ 2) | 19,456 | 0 | 0 | 0 | **19,456 m²** | 60,000 |
| lamps / trees (solid) | 25 / 50 | 50 / 50 | 30 / 30 | 35 / 50 | 140 / 180 | — |

* **Triangles**: under 250k. The ground at res 4 over about 160k m² adds about 20k; the tank pool
  about 16k; the tower lattice made of shared geometry about 10k; the rest is boxes and trees.
* **Load time**: the terrain closure is cheap (no loops but 5 benches). Expect well under 1 s.
* **Where the counts come from** (the caps above are the parts' hard limits):
  * switch: curbs 72 + guardrails 36 + Overlook Steps 45 + overlooks 12 + footing, ledges and
    blocks ~30;
  * east: sidewalk curbs 50 + K.street edges 30 + Vista 28 + villas' ledges and stoop rails 68.

---

## 10. Parts

Files go in `levels/porto/heights/`, with top-level function declarations only, all prefixed
`heights_`.

| file | function | rect [x0, x1, z0, z1] | owns |
|---|---|---|---|
| heights_plan.js | `heights_plan()`, `heights_terrain(PL, baseH)`, `heights_col(PL, T)`, `heights_surface(PL)` | — | the numbers and the ground |
| heights_west.js | `heights_west(K, P)` | [-1000, -420, -650, -230] | Ridge Road x -968..-420, Tank Road, Reservoir Lane x -904..-420, Culvert, Water Tank, Spillway, Pumphouse, west villas |
| heights_switch.js | `heights_switch(K, P)` | [-420, 100, -650, -230] | Ridge Road -420..100, Lane x -420..-272, Switchback Road, Overlooks, Overlook Steps, Lookout, Radio Tower, Thin Air shop |
| heights_obs.js | `heights_obs(K, P)` | [100, 480, -650, -230] | Ridge Road 100..480, Observatory Road, Planetarium Drive, Podium and Dome, Observatory Steps, Walk, Forecourt, Stargazer Decks, obs villas |
| heights_east.js | `heights_east(K, P)` | [480, 1000, -650, -230] | Ridge Road 480..960, Descent, terrace streets, Crest Street, Vista Steps, villas, Ridge Park, Low Gear shop |
| index.js | `porto_heights(K, P)` | — | the order below |

`index.js`:

```js
function porto_heights(K, P) {
  const PL = heights_plan();
  const T = heights_terrain(PL, P.baseH);
  P.ground(T);                                   // first, before anything reads K.terrainH
  for (const r of [[-768,-632,-416,-360,1], [-720,-680,-592,-416,2], [-720,-680,-360,-240,2], [-368,-16,-584,-248,4],
                   [-936,-896,-424,-360,4], [-912,-896,-592,-424,4], [-888,-864,-520,-424,4], [-784,-760,-520,-424,4],
                   [472,504,-552,-328,4], [952,968,-552,-328,4], [208,232,-592,-240,4], [256,280,-592,-472,4],
                   [640,664,-592,-240,4], [864,880,-592,-360,4]]) P.region(...r);
  P.col(heights_col(PL, (x, z) => T(x, z, P.baseH(x, z))));
  P.surface(heights_surface(PL));
  heights_west(K, P, PL); heights_switch(K, P, PL); heights_obs(K, P, PL); heights_east(K, P, PL);
}
```

(Parts take PL as an optional 3rd argument, or call `heights_plan()` themselves: it's pure.)

**Build order**: heights_plan.js and index.js first, so every builder tests on the same ground. Each
part keeps 0.5 m inside its rect on the internal x borders. Ridge Road and Reservoir Lane are split
at x -420; the Ridge Road also at x 100 and 480. Each part builds `K.street` for its own `from..to`
with only its own crossings.

### 10.1 heights_west [-1000, -420, -650, -230]

Sections 4 W1–W5 and 6.
* Ridge Road x -968..-420 (crossing -904).
* Tank Road x -904 (sloped sidewalks).
* Reservoir Lane x -904..-420:
  * K.street flat for -904..-768 and -632..-420 at 20.89, crossing -904;
  * sloped hubba sidewalks over the dip x -768..-632;
  * no curbs for x -712..-688.
* Culvert:
  * the headwall box and kicker;
  * footbridge;
  * edge rails (10 pieces);
  * the head lip;
  * tags.
* Water Tank:
  * the pool;
  * 24 coping rails;
  * 21 rim chords;
  * Valve Ring, Spill Ledge, Valve Tower and pipe-stack;
  * fence, access track and lamps.
* Spillway Bar.
* Pumphouse, dock, Pump Curb.
* 4 west villas.
* Signs: RESERVOIR No. 3, CULVERT — DANGER.
* Challenges: culvert-gap, tank-coping, tank-score.
* Tapes 2 and 3.
* West traffic loop.
* Pump Curb NPC.
* Travel: Water Tank (park), Culvert Head.
* Spots.

### 10.2 heights_switch [-420, 100, -650, -230]

Sections 3.3, 4 S1–S8, 7.1 tower, 7.4 Thin Air.
* Ridge Road -420..100 (crossing -76).
* Lane x -420..-272: K.street flat -420..-364 at 20.89, then sloped pieces -364..-272 to 18.2.
* **Switchback Road**:
  * sloped sidewalk hubbas, legs as single pieces;
  * hairpins and arcs as 8 / 4 chords per side;
  * yellow curbs with 'Curb' rails;
  * guardrails with gaps;
  * entry stub;
  * Chute with curbs stopping at z -248;
  * parking blocks.
* Overlooks 1–3.
* Overlook Steps E1–E3 (numbers in S6).
* Lookout: plaza, brow ledges, benches, planters.
* Tower: footing, hut, hut bank, `D.add` tower, landmark.
* Thin Air shop.
* Signs: RIDGELINE LOOKOUT, SWITCHBACK ROAD.
* Challenges: yellow-line, guardrail, overlook-line.
* Tapes 1 and 6.
* Lookout peds; 1 loop NPC and the brow session NPC.
* Travel: Ridgeline Lookout (district), Switchback Top, Thin Air.
* Spots.

### 10.3 heights_obs [100, 480, -650, -230]

Sections 4 O1–O7, 7.1 dome.
* Ridge Road 100..480 (crossings 220, 268).
* Observatory Road (sloped sidewalks, curbs stop at z -248).
* Planetarium Drive and the chamfer onto the podium.
* Dome-loop service lane (z -476).
* Podium, balustrades, Dome Court, dome (3 collision boxes and `D.add`), landmark.
* Observatory Steps (5 units + final 6-riser flight, 18 handrails).
* Walk Ledges.
* Forecourt.
* Stargazer Decks and their access lane.
* Obs villas, with one backyard pool.
* Signs: OBSERVATORY, STARGAZER DECKS.
* Challenges: obs-flip, deck-gap, obs-smith.
* Tape 4.
* Dome loop traffic; forecourt peds; ledge session NPC.
* Travel: Observatory Terrace.
* Spots.

### 10.4 heights_east [480, 1000, -650, -230]

Sections 4 E1–E7, 7.4 Low Gear.
* Ridge Road 480..960 (crossings 650, 872).
* Descent: sidewalk hubbas breaking at the kinks in E1; curbs stop at z -248.
* Terrace streets: 3 × K.street, crossings [650, 760, 872].
* Crest Street.
* Vista Steps (table in E3).
* Villas: R0 8, R1 10, R2 10, Ridge Villas 6, with 3 backyard pools.
* Ridge Park, its rail, picnic tables.
* Low Gear shop and its deck.
* Sign: THE TERRACES.
* Challenge: three-crests.
* Tape 5.
* East traffic loop; terrace peds; terrace NPC loop.
* Travel: Ridge Road Descent, Low Gear Boards.
* Spots.

---

## 11. Notes for the builders

* Every "on the slope" box: bottom at `groundMin - 0.4` (or use K.Bg). Every flat hubba chain: give
  the a/b heights explicitly (they are flat), and keep chord ends touching.
* Rails don't chain in the engine: consecutive chords are separate grinds, and you pop between them.
  Keep chords ≥ 10 m on curbs and guardrails so each one is a real grind.
* Keep the gate corridors (16 m deep, z -246..-230) free of anything above 0.3 m. Sidewalk curbs and
  'Curb' hubbas end at z -248 on the Chute, Observatory Road and the Descent; the culvert edge rails
  end at -296.
* Test with `node tools/check.mjs --html $SP/heights.html --only heights`, plus a ride down each line
  and down the Culvert Gap at 19 m/s.

# University (`uni`): College Hill

Rect **x 360..1000, z -230..230** (640 × 460 m). +x is east, +z is south.

Shared borders and their 12 m bands:
* **west** x 360..372 (Financial / fin)
* **north** z -230..-218 (Heights)
* **south** z 218..230 (Campus)

The east edge (x 1000) is the map edge. The base already rises there: `base += 22·sm((x-975)/30)` for
x > 975. It needs no band.

| gate | where | w | y | how you reach it |
|---|---|---|---|---|
| ridge | (650, -230) | 16 | 1.0 | You come down the Heights' Ridge Road Descent (x 650) at 18–21 m/s, through a dip at z -200 (y ≈ 0.1), and climb straight up the north face of College Hill on the **Ridge Road** (10 %) to the plateau. |
| avenue | (360, 0) | 16 | 0.0 | This is Fin's Metro Avenue (z 0, rw 7, sw 4). It carries on as **University Avenue**: 1.7 % up through College Town, then 6 % up an embankment onto the plateau. |
| campus | (650, 230) | 16 | -0.4 | Leave the plateau down **Campus Drive** (x 650, 3.75 % for 144 m). It flattens at Mill Lane (z 200) and runs straight on to the gate. |

Gate corridors must stay clear (nothing over 0.3 m tall):
* ridge: x 642..658, z -230..-214
* avenue: x 360..376, z -8..8
* campus: x 642..658, z 214..230

Every height in this doc is world y. The `uni_plan()` ground function is exact, and the numbers
below were computed from it.

---

## 1. Concept

**College Hill**: an old walled university on an acropolis. The **Upper Campus** sits on a flat
plateau at **y 6.0**, about 4 m above the town around it. It is ringed by pale stone retaining walls,
**the Ramparts**. Every way down the walls is a spot:
* the **Great Steps** (a double 14-stair with three rails)
* the **Great Bank**
* the **Kinked Twelve**
* the **West Thirteen**
* the **Terrace Stands** of the sports field, stepping down the wall
* the **Avenue Banks** and the **Drive Bank** of the two roads that climb onto it

On top are:
* the **Quad**: four lawns, 60 m marble ledges and a sunken Wishing Well
* **Founders Library** on its podium, with the Library Steps and the Reading Ledges
* **Old Main**, the **Greek Theatre** (a stack of ledges), the **Science Hall** loading dock and
  **Lecture Row**
* the **Campanile**, a 50 m bell tower you can see from the whole south of the map

Below the walls:
* **College Town** (west): a brick student quarter of shops, cafés, a bookstore and a cinema along
  Gown Street.
* **The Commons** (south): the student union square with its fountain bowl.
* **Alumni Field**: track, pitch and dorms.
* The **Bike Shed DIY**, hidden behind the dorms.

**Look and materials** (pass these as `color` to `K.building` / `K.B` extra, or as P.col colours):

| use | colour | notes |
|---|---|---|
| campus stone (walls, halls, Library, Campanile) | 0xd8cbb0, shade 0xcdbf9f | `tex 'stone'` |
| College Town brick | 0x9a5e4c, 0x8a5444, 0xa86b55 | `tex 'brick'` |
| verdigris roofs, dome, cone, lamp posts (decor) | 0x6b7a5e | |
| marble ledges / plaza tops | `mat 'marble'` / `'ledge'` | |
| exposed banks (ground) | 0xa9a59c | concrete |
| campus paving (ground) | 0xd2c6ad | |
| College Town paving (ground) | 0x9a6a58 | brick red |
| sidewalks | 0xb8b2a6 | |
| asphalt | 0x3a3a3c | car park 0x46464a |
| lawns | 0x6f8f4e | |
| pitch | 0x5f9a48 | |
| track | 0xa5523a | |
| courts | 0x4f7f9a | |

Trees: big round deciduous `K.tree` in rows along the walks. Lamps: `K.lamp`.

---

## 2. Height plan

### 2.1 The ground function (in `uni_plan.js`)

```js
function uni_plan() {
  const U = 6.0;                                         // the Upper Campus plateau
  const F = t => t <= 0 ? 0 : t < 1 ? t * t / 2 : t - 0.5;
  // smoothed linear 0 -> 1: exactly (u-u0)/(u1-u0) between u0+r and u1-r, 0 below u0-r, 1 above u1+r
  const ramp = (u, u0, u1, r) => { const L = u1 - u0; return (F((u - u0 + r) / L) - F((u - u0 - r) / L)) * L / (2 * r); };
  const c01 = t => t < 0 ? 0 : t > 1 ? 1 : t;
  const mix = (a, b, t) => a + (b - a) * t;
  const boxD = (x, z, r) => Math.hypot(Math.max(r[0] - x, 0, x - r[1]), Math.max(r[2] - z, 0, z - r[3]));
  // the lowland: 0 at the west / north / south borders, 2.0 in the middle
  const low = (x, z) => 2 * Math.min(ramp(x, 380, 500, 10), 1 - ramp(z, 40, 200, 10), ramp(z, -200, -140, 10));
  const BENCH = [[512, 624, 40, 108, 1.8], [736, 904, 56, 144, 1.25]];   // the Commons, Alumni Field
  const T = z => U * ramp(z, -190, -130, 10);            // the north face: 0 at z -200, 10 % from -180 to -140, U from -120
  const A = x => U * ramp(x, 404, 504, 8);               // University Avenue: 0 at x 396, 6 % from 412 to 496, U at 512
  const Dz = z => U * (1 - ramp(z, 36, 196, 8));         // Campus Drive: U at z 28, 3.75 % from 44 to 188, 0 at 204
  function layers(x, z) {
    let h = low(x, z);
    for (const b of BENCH) { const k = c01(1 - boxD(x, z, b) / 8); if (k > 0) h = mix(h, b[4], k); }   // benches (override)
    if (x >= 504 && z <= 40) {                            // the plateau, with 8 m linear batters west (x 504..512) and south (z 32..40)
      const k = c01(Math.min((x - 504) / 8, (40 - z) / 8));
      h = mix(h, Math.max(h, T(z)), k); }
    if (x >= 396 && x <= 520 && Math.abs(z) <= 24) {      // the Avenue embankment: top |z| <= 16, banks to 24
      const k = c01((24 - Math.abs(z)) / 8); h = Math.max(h, mix(h, A(x), k)); }
    if (z >= 24 && Math.abs(x - 650) <= 24) {             // the Campus Drive embankment: top |x-650| <= 16, banks to 24
      const k = c01((24 - Math.abs(x - 650)) / 8); h = Math.max(h, mix(h, Dz(z), k)); }
    return h;
  }
  return { U, ramp, low, T, A, Dz, layers, BENCH,
    ground: (x, z, base) => base + layers(x, z),
    /* + every shared number in 2.4 and the col / surface functions in 2.3 */ };
}
```

**Who writes P.ground.** Only `index.js` does, first:

```js
const PL = uni_plan();
P.ground(PL.ground);
P.col(PL.col);
P.surface(PL.surface);
// then the P.region calls (2.2)
```

No part calls P.ground or uses K.feat on the big shapes. The only K.feat is the DIY quarterpipe (in
uni_south).

**Checked numbers** (layers; the final height adds base, which is 0 everywhere that matters here):

| place | y |
|---|---|
| ridge gate (650, -230) / band edge z -218 | base (1.0) / 0.000 + base |
| Ridge Road (650, z) at z -200 / -190 / -180 / -160 / -140 / -130 / -120 | 0.08 / 0.33 / 1.00 / 3.00 / 5.00 / 5.75 / 6.00 |
| Campus Drive (650, z) at z 32 / 40 / 44 / 100 / 188 / 196 / 200 / 204 | 6.00 / 5.83 / 5.70 / 3.60 / 0.30 / 0.08 / 0.03 / 0.01 |
| campus gate (650, 214..230) | 0 + base |
| University Avenue (x, 0) at x 360 / 372 / 396 / 412 / 420 / 440 / 480 / 496 / 504 / 512 | 0 / 0.002 / 0.27 / 0.53 / 0.96 / 2.16 / 4.56 / 5.52 / 5.88 / 6.00 |
| Avenue top edge (x, ±15.7) | the same as (x, 0) |
| Rampart Lane at the West Thirteen's foot (499.2, -44) | 1.95 |
| Mortarboard Skates door (407.8, -68) | 0.45 |
| Kinked Twelve's foot (700, 46) | 1.92 |
| Commons (anywhere in x 512..624, z 40..108) | 1.80 |
| Alumni Field (x 736..904, z 56..144) | 1.25 |
| Drive Bank at z 60: x 624 / 630 / 634 | 1.80 / 3.43 / 5.10 |
| Mill Lane / Gown Street corner (396, 200) | 0.03 |

Band check (computed): |layers| is at most 1e-14 on the north and south border lines and at most
0.0017 on the west ones. The engine's blend does the rest. Every gate corridor sits at base.

### 2.2 Fine regions (`index.js`, right after P.ground)

The 8 m mesh in this district is laid out from tile origins at x 250 / 500 / 750 and z -400 / -150 /
100. Its grid lines are therefore **not** multiples of 8, and no batter is cell-aligned. Every kink
gets a res-2 strip instead. P.region snaps to multiples of 8, and the rects below are already
snapped. **They must not overlap.**

```js
P.region(496, 520, -208, 48, 2);    // west batter / Rampart Bank + the Avenue's top junction   6,144 m²
P.region(520, 912, 32, 40, 2);      // south batter under the Ramparts                           3,136
P.region(912, 1000, 24, 48, 2);     // Rampart Bank East (exposed)                               2,112
P.region(408, 496, -32, -8, 2);     // Avenue Bank north                                         2,112
P.region(408, 496, 8, 32, 2);       // Avenue Bank south                                         2,112
P.region(616, 640, 40, 120, 1);     // the Drive Bank into the Commons                           1,920 (res 1)
P.region(616, 640, 120, 208, 2);    // Drive west bank                                           2,112
P.region(656, 680, 40, 208, 2);     // Drive east bank                                           4,032
P.region(728, 912, 48, 56, 2);  P.region(728, 912, 144, 152, 2);   // field bench edges        2,944
P.region(728, 736, 56, 144, 2); P.region(904, 912, 56, 144, 2);    //                          1,408
P.region(496, 616, 104, 120, 2);    // Commons south edge                                        1,920
P.region(496, 512, 48, 104, 2);     // Commons west edge                                           896
P.region(952, 968, 152, 192, 0.5);  // DIY quarterpipe                                             640
```

That totals about **31,500 m²** of the 60,000. The fountain bowls draw their own.

The other curved parts of the ground stay on the 8 m mesh, because their chord error is under 5 cm:
* the north-face ramp ends (r 10, 10 %): ≤ 0.04 m
* the Avenue's ramp ends: ≤ 0.03 m
* the Drive's ramp ends
* the lowland's ramps

If the sink scan flags the north face, add `P.region(504, 1000, -200, -176, 2)` and
`P.region(504, 1000, -144, -112, 2)`. That is about 15,000 m² more.

### 2.3 Colour and surface (`PL.col(x, z, h)`, `PL.surface(x, z)`, in `uni_plan.js`)

**Colour.** Return a THREE.Color made once, outside the function. The first matching rule wins:

1. **Flush roads (asphalt).**
   * Ridge Road: |x-650| ≤ 5 for z < -140, widening linearly to ≤ 7 by z -124. Sidewalks 3 m beyond
     the road (4 m once it is 7 wide). This matches the Heights' rw 5 / sw 3 at the border.
   * Campus Drive: |x-650| ≤ 7 for z 32..230, with sidewalks to ≤ 11.
   * University Avenue: |z| ≤ 7 for x 360..520, with sidewalks to ≤ 11.
   * Gown Street: |x-396| ≤ 7 for z -210..209, with sidewalks to ≤ 11.
   * Mill Lane: |z-200| ≤ 6 for x 396..975, with sidewalks to ≤ 9.
   * Centre lines are `K.dash` (the decor dash follows the ground). Never use paintRect on slopes.
2. **Exposed banks** (concrete): x 504..512 for z -200..-64; x 920..1000 for z 32..40; the Avenue
   Banks (16 ≤ |z| ≤ 24, x 412..504); the Drive banks (16 ≤ |x-650| ≤ 24, z 40..204).
3. **Car park** (asphalt 0x46464a): x 408..488, z -200..-120.
4. **College Town paving** (brick): x 372..504 everywhere else. Exceptions:
   * Scholars Square: campus paving.
   * the lawn strips x 440..500 at z 100..108 and 150..160: grass.
5. **The Quad**:
   * lawns (grass): x 732..804 and 816..888, at z -72..-34 and -22..8
   * paving within 9 m of (810, -28): campus paving
   * the rest of x 724..896, z -80..12: campus paving
6. **Alumni Field**: inside the kerb oval it is pitch; the track lanes 8 m wide outside the kerb are
   track. The oval is two straights x 780..860 at z 66 and 134, joined by semicircles of r 34 centred
   (780, 100) and (860, 100). Inside the bench, outside the track, it is grass.
7. **Courts** (x 680..728, z 150..190): court blue.
8. **Lawns** (grass):
   * the north face: x 504..1000, z -210..-124, except the Ridge Road strip and the Brow Walk
   * Union Lawn: x 504..626, z 150..190
   * the plateau's dorm lawns
9. **Campus paving**: everything else on the plateau (x ≥ 512, -124 ≤ z ≤ 32), the Commons, and
   x 674..736, z 40..190.
10. Otherwise `null`.

**Surface.** Return 'rough' on lawns, pitch and the north-face grass. Return 'smooth' on every paved,
road or bank surface. Return null elsewhere.

### 2.4 Shared numbers (in `uni_plan()` so every part agrees)

```js
U: 6, ROAD: { rw: 7, sw: 4 },
AVE: { z: 0, x0: 360, top: 512 },        // flush x 360..520, K.street on the plateau x 520..639
DRIVE: { x: 650, zTop: 32, zFoot: 204 }, // K.street on the plateau z -120..32, flush below
GOWN: { x: 396, z0: -210, z1: 209 }, MILL: { z: 200, x0: 396, x1: 975 },
RIM: { s0: 32, s1: 40, w0: 504, w1: 512 },
COMMONS: 1.8, FIELD: 1.25,
STEPS: { x0: 548, x1: 596, rails: [556, 572, 588] },
```

Each part reads ground with `K.terrainH(x, z)`, never with its own copy.

---

## 3. Layout

### 3.1 Sketch (10 m a character; x 360 → 1000 left to right, z -230 at the top)

```
       x 360    400       500       600       700       800       900      1000
 -230 ............................||..................................   ridge gate (650)
 -210 ..|||.......................||..................................
 -200 .B|||PPPPPPPP./^^^^^^^^^^^^^||^^DDDD^^^^^^^^^^DDDDD^^^DDDDDD^^^^   north face (10 %), Hillside Halls
 -180 .B|||PGGGGGPP./^^^^^^^^^^^^^||^^DDDD^^^^^^^^^^DDDDD^^^DDDDDD^^^^
 -160 .B|||PGGGGGPP./^^^^^^^^^^^^^||^^DDDD^^^^^^^^^^DDDDD^^^DDDDDD^^^^
 -140 .B|||PPPPPPPP./^^^^^^^^^^^^^||^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 -120 .B|||........./  OOOOOOOO   || XXXX   LLLLLLLLLLLLLL    RRRRR      plateau y 6 from z -120
 -100 .B|||SS......./  OOOOOOOO   || XXXX pppppppppppppppppp  RRRRR
  -80 .B|||SS......./   oooooo    || XXXX  qqqqqqqqqqqqqqqq   RRRRR
  -60 .B|||SS.YYYYYY#          T  || xxxxx qqqqqqqqqqqqqqqq   RRRRR
  -40 .B|||SS.YYYYYY#  <-lane- T  || xxxxx qqqqqqqqqqqqqqqq   RRRRR
  -30 .B|||.........#   wwww      || xxxxx qqqqqqq@@qqqqqqq   RRRRR
  -20 ..|||~~~~~~~~~.             || xxxxx qqqqqqqqqqqqqqqq   RRRRR
    0 ==|||=======================T| xxxxx qqqqqqqqqqqqqqqq              University Ave / Campus Drive T
   10 ..|||~~~~~~~~~.             || xxxxx
   20 .B|||.........HHHHH         ||              AA                     Campanile
   30 .B|||BB.......HHHHH####EE#b#||######k######ssssssss#######////////   Ramparts z 32..40
   40 .B|||BB.QQQQQQ.ccccccccccc./||/...k...ssssssssssssssss..........
   60 .B|||BB.QQQQQQ.ccccc@ccccc./||/.......FFFFFFFFFFFFFFFF..hhhhh...
   80 .B|||BB.QQQQQQ.ccccccccccc./||/.......FFFFFFFFFFFFFFFF..hhhhh...
  110 .B|||BB.KKKKKK..UUUUUUUU.../||/.......FFFFFFFFFFFFFFFF..hhhhh...
  140 .B|||BB..................../||/.................................
  160 .B|||BB.CCCCCC............./||/.ttttt...VVVVVVVVVVVV....ZZZZZ...
  190 .B||---------------------------------------------------------...   Mill Lane
  210 ................................................................
  230 ................................||..............................   campus gate (650)
```

Legend:

| key | what it is |
|---|---|
| `=` | University Avenue |
| `\|\|` | Ridge Road / Campus Drive (x 650); also Gown Street (x 396) |
| `-` | Mill Lane |
| `~` | Avenue Banks |
| `/` | exposed banks |
| `#` | Rampart walls |
| `^` | north-face lawn |
| `B` | College Town brick rows |
| `P` / `G` | car park / garage |
| `S` | Gown Street shops |
| `Y` | Thirteen Yard |
| `Q` | Scholars Square |
| `K` | the Bookstacks |
| `C` | the Lyceum |
| `O` / `o` | Old Main / forecourt |
| `T` | Greek Theatre |
| `w` | Scholar's Wave |
| `H` | Hallam Gallery |
| `X` / `x` | Science Hall / Science Plaza |
| `L` / `p` | Founders Library / podium |
| `q` | the Quad |
| `@` | Wishing Well and Commons fountain |
| `A` | Campanile |
| `R` | Lecture Row |
| `D` | dorms (Hillside Halls) |
| `E` | Great Steps |
| `b` | Great Bank |
| `k` | Kinked Twelve |
| `s` | Terrace Stands |
| `c` | the Commons |
| `U` | Student Union |
| `F` | Alumni Field |
| `h` | Ashgrove / Birchmoor Halls |
| `t` | courts |
| `V` | Refectory |
| `Z` | Bike Shed DIY |

### 3.2 Streets

| street | where | how it's built | grade |
|---|---|---|---|
| **Ridge Road** | x 650, z -230..-120. Road rw 5 / sw 3 to z -140, then 7 / 4 by -124 | flush (P.col) + `K.dash(650, -228, 650, -122)` | dip to 0.08 at z -200, then 10 % up to 6.0 at -120 |
| **Campus Drive** (plateau) | x 650, z -120..32 | `K.street('z', 650, -120, 32, 6, [0], {rw: 7, sw: 4})` | flat 6 |
| **Campus Drive** (down) | x 650, z 32..230, on its embankment (top \|x-650\| ≤ 16, banks to 24) | flush + `K.dash(650, 34, 650, 228)` | 3.75 % (z 44..188), flat from z 204 |
| **University Avenue** (up) | z 0, x 360..520, embankment top \|z\| ≤ 16 from about x 413 | flush + `K.dash(362, 0, 518, 0)` | 1.7 % to x 413, then 6 % (x 412..496), 6.0 at 512 |
| **University Avenue** (plateau) | z 0, x 520..639, a T into Campus Drive | `K.street('x', 0, 520, 639, 6, [], {rw: 7, sw: 4})` | flat 6 |
| **Gown Street** | x 396, z -210..209 (road 389..403, sidewalks to 385 / 407) | flush + `K.dash(396, -208, 396, 194)` | follows the lowland (≤ 3.3 % at the north end, about 1.3 % elsewhere) |
| **Mill Lane** | z 200, x 396..975 (road 194..206, sidewalks to 191 / 209) | flush + `K.dash(403, 200, 970, 200)`, broken across Campus Drive at 643..657 | about flat (0.08 → 0) |
| **Rampart Lane** | x 488..504, z -120..-24 (paved lane under the west wall) | flush (paving) | lowland, 1.95 |
| **Brow Walk** | z -126..-120, x 661..744 (path along the brow) | paving | 5.9 → 6.0 |

Cars only use the streets with traffic (section 10). The flush streets have no curbs.

The plateau K.streets have their own sidewalk curbs. Where a flush sidewalk meets a K.street sidewalk
(x 520 on the Avenue, z -120 and z 32 on the Drive), add a 0.15 chamfer: a `K.hubbas.push` of w 4,
0.15 high, 0.6 long, noRails, at each joint.

### 3.3 How the gates are reached

* **Ridge**: the gate corridor is the Ridge Road itself. Clear sightline south: the Campanile's top
  (y 56) and the Library dome show over the brow at z -120.
* **Avenue**: the corridor is the Avenue at grade (x 360..376 is flush road and sidewalk). The first
  thing beside the road is the College Row buildings, starting at |z| 16 and x 373.
* **Campus**: the Drive flattens at z 204 and runs straight to z 230. Nothing stands in x 639..661,
  z 209..230.

---

## 4. Spots

Every spot gets `P.spot(name, x, y, z, yaw, area)` at its run-up end, facing the spot. Yaw is
atan2(-vx, -vz): facing +z (south) is π, -z is 0, +x is -π/2, -x is π/2. Who builds each one is
in brackets.

### S1 The Great Steps (uni_hill top deck, uni_south flights)

The double flight down the south Rampart from the Arts Plaza to the Commons.
* Top deck: rim box `K.B(546, 0, 32, 600, 6, 40, 'marble', {edges: 's'})` [hill].
* Flight 1: `K.stairSpot('z', 40, 1, 548, 596, 6, 3.9, 7, 0.4, {rails: [556, 572, 588]})`. Risers
  0.3, run 2.4, so it ends at z 42.4.
* Under flight 1 (the SET base is 2.9): filler `K.B(548, 1.3, 40, 596, 2.95, 42.4, 'step')`.
* Cheek walls beside flight 1: `K.B(546, 1.3, 40, 548, 6, 42.4, 'marble', {edges: 'e'})` and
  `K.B(596, 1.3, 40, 598, 6, 42.4, 'marble', {edges: 'w'})`.
* Landing: `K.B(546, 1.3, 42.4, 598, 3.9, 46.4, 'marble', {edges: 'we'})`.
* Flight 2: `K.stairSpot('z', 46.4, 1, 548, 596, 3.9, 1.8, 7, 0.4, {rails: [556, 572, 588], hubbas: [547.6, 596.4]})`.
  It ends at z 48.8, at 1.8 (the Commons bench).
* **Run-up**: 30 m south across the Gallery Forecourt from the Avenue (z 11 → 32). **Roll-away**: the
  whole Commons, 60 m to the fountain.
* `P.spot('Great Steps', 572, 6, 24, Math.PI, [540, 12, 604, 72])`.

### S2 The Great Bank (uni_south)

`K.hubbas.push({a: V(608, 6, 40), b: V(608, 1.82, 50.5), w: 16, noRails: true, color: 0xc4bfb3})`.
That is 4.2 m down over 10.5 m (22°), from the rim box `K.B(600, 0, 32, 616, 6, 40, 'marble')` [hill].
Next to it is the Steps' east cheek (2 m of wall at x 598..600: `K.B(598, 0, 32, 600, 6, 40, 'marble', {edges: 's'})`).

### S3 The Drive Bank and the Drive Kerb (ground + uni_south)

* **The Drive Bank** is ground: the Drive's west bank, x 626..634, z 40..108, meets the Commons
  bench. It is 3.75 m tall at z 48 and 2 m at z 100, about 22–25°. Coming down the Drive you carve
  off its edge into the Commons.
* **The Drive Kerb** is a sloped kerb that runs the length of the descent on the Drive's west verge:
  `K.hubbas.push({a: V(637, 5.85, 48), b: V(637, 0.75, 184), w: 0.4, color: 0xb8b2a6})`.
  It is 0.3 over the Drive (Dz(48) = 5.55, Dz(184) = 0.45), and both top edges grind: 136 m
  downhill.
* Leave the 2 m between it and the road sidewalk (x 639) clear.

### S4 The Kinked Twelve (uni_hill rim, uni_south flights and rail)

Down the south Rampart east of the Drive, from Science Plaza to the Field Walk.
* Rim boxes `K.B(674, 0, 32, 736, 6, 40, 'marble', {edges: 's'})` [hill].
* Flight 1: `K.SET('z', 40, 1, 696, 712, 6, 3.975, 6, 0.4)`. Risers 0.3375; it ends at z 42.0.
* Landing: `K.B(694, 0, 42, 714, 3.975, 44, 'marble', {edges: 'we'})`.
* Filler under flight 1: `K.B(696, 0, 40, 712, 2.98, 42, 'step')`.
* Flight 2: `K.SET('z', 44, 1, 696, 712, 3.975, 1.95, 6, 0.4)`. It ends at z 46.0, at 1.95 (ground
  there is 1.92).
* One kinked handrail at x 704, in three K.rail pieces, 0.8 over the nosing:
  ```js
  K.rail(704, 6.80, 40.0, 704, 4.775, 42.4, 'Handrail', true);
  K.rail(704, 4.775, 42.4, 704, 4.775, 44.0, 'Handrail', true);
  K.rail(704, 4.775, 44.0, 704, 3.0875, 46.0, 'Handrail', true);
  ```
* **Run-up**: 60 m across Science Plaza (z -24 → 32). **Roll-away**: the Field Walk, x 674..736, is
  open 100 m south.
* `P.spot('Kinked Twelve', 704, 6, 20, Math.PI, [690, 10, 718, 60])`.

### S5 The Terrace Stands (uni_hill rim deck, uni_south tiers)

The field's grandstand steps down the Rampart.
* Rim deck `K.B(736, 0, 32, 904, 6, 40, 'marble', {edges: 's'})` [hill].
* 7 tiers, each 2 m deep, j = 0..6, at z 40+2j .. 42+2j, top `5.41 - 0.595·j` (5.41, 4.815, 4.22,
  3.625, 3.03, 2.435, 1.84). Each is a concrete box `K.B(x0, 0, 40+2j, x1, top, 42+2j, 'ledge', {edges: 's'})`,
  split at the two aisles into x 736..776, 780..860 and 864..904. Every tier edge is a 0.6 drop and a
  ledge.
* Aisles at x 776..780 and 860..864:
  `K.stairSpot('z', 40, 1, a0, a0 + 4, 6, 1.84, 14, 1.0, {rails: [a0 + 2]})`. Risers 0.297; it ends at
  z 53.
* The bottom tier (1.84) stands 0.45–0.6 over the field edge ground, a last little drop onto the
  track.
* `P.spot('Terrace Stands', 820, 6, 24, Math.PI, [736, 16, 904, 60])`.

### S6 Founders Library, the Library Steps and the Reading Ledges (uni_hill)

* Building: `K.building(744, -116, 876, -100, 5, 0xd8cbb0, 'stone')`, plus the dome in decor (section 7).
* **Podium**: `K.B(720, 5, -100, 900, 7.8, -86, 'marble', {edges: 'swe'})`, 1.8 over the Quad.
  `K.lip` along its south edge at y 7.8, from x 720..797.5 and 838.5..900 (a grindable drop edge).
* **Library Steps**: `K.stairSpot('z', -86, 1, 798, 822, 7.8, 6, 6, 0.42, {rails: [803, 810, 817], hubbas: [797.6, 822.4], bank: [826, 838]})`.
  Risers 0.3; it ends at z -83.9. The bank is 1.8 down over 3.3 m (29°).
* **Reading Ledges** on the podium top: `K.B(730, 7.8, -94, 770, 8.25, -93.4, 'marble', {edges: 'ns'})`
  and `K.B(850, 7.8, -94, 890, 8.25, -93.4, 'marble', {edges: 'ns'})`.
* **West Podium Bank**: `K.hubbas.push({a: V(720, 7.8, -93), b: V(714, 6.02, -93), w: 12, noRails: true, color: 0xc4bfb3})`.
  This is how you get on the podium at speed from the Brow Walk.
* **East Six**: `K.stairSpot('x', 900, 1, -100, -86, 7.8, 6, 6, 0.42, {rails: [-93]})`. It ends at
  x 902.1. Roll-away: 12 m clear to Lecture Row's stoops at 914.8.
* Planters on the podium (decor-solid): `K.planter(894, -99, 898, -96, 0.6)` and `K.planter(722, -99, 726, -96, 0.6)`.
* `P.spot('Founders Library', 810, 7.8, -96, Math.PI, [714, -120, 906, -80])`.

### S7 The Quad and the Wishing Well (uni_hill)

The Quad is x 728..892, z -76..12, at 6.
* Lawns: x 732..804 / 816..888, at z -72..-34 and -22..8.
* Walks: N–S x 804..816, E–W z -34..-22, and a 4 m perimeter walk.
* **Quad Ledges**: 8 long marble ledges, `K.ledge(..., 0.45, 'marble')`, 0.6 wide, along the lawn
  edges facing the walks:
  * N–S walk: `K.ledge(803.4, -70, 804, -40)`, `K.ledge(816, -70, 816.6, -40)`, `K.ledge(803.4, -16, 804, 6)`, `K.ledge(816, -16, 816.6, 6)`
  * E–W walk: `K.ledge(736, -34.6, 796, -34)`, `K.ledge(824, -34.6, 884, -34)`, `K.ledge(736, -22, 796, -21.4)`, `K.ledge(824, -22, 884, -21.4)`
* **Wishing Well**: `K.fountainBowl(810, -28, 5, 1.4)`, a coping bowl 10 m across and 1.4 deep at
  the crossing. The ledges stop 6 m short of it, so it carves cleanly.
* Benches `K.bench` on the perimeter walk (8 of them, along the outer lawn edges, not facing the
  walks).
* `P.spot('The Quad', 810, 6, 8, 0, [724, -80, 896, 14])`.

### S8 Old Main and the forecourt (uni_hill)

* `K.building(528, -116, 612, -80, 4, 0xcdbf9f, 'stone')`.
* Forecourt: `K.B(540, 5, -80, 600, 7.2, -68, 'marble', {edges: 'swe'})`.
* Steps: `K.stairSpot('z', -68, 1, 560, 580, 7.2, 6, 4, 0.42, {rails: [570], hubbas: [559.6, 580.4]})`.
  A 4-stair, ending at z -66.74.
* `K.lip` along the forecourt's south edge at 7.2, for x 540..559 and 581..600.

### S9 The Greek Theatre and the Long Lane (uni_hill)

On the Arts Plaza.
* Tiers k = 0..5: `K.B(620 - 1.6*(k+1), 5.8, -60, 620 - 1.6*k, 8.7 - 0.45*k, -30, 'ledge', {edges: 'w'})`.
  That gives tops 8.7 → 6.45, each 1.6 deep and stepping 0.45 down to the west.
* Back wall `K.B(620, 5.8, -60, 622, 8.7, -30, 'marble', {edges: 'ns'})`.
* **Theatre Bank** up the back: `K.hubbas.push({a: V(622, 8.7, -45), b: V(634, 6.02, -45), w: 10, noRails: true, color: 0xc4bfb3})`.
  You take it off the Drive's west sidewalk (x 639): 2.7 up over 12 m.
* Stage: `K.B(596, 5.8, -54, 606, 6.6, -36, 'wood', {edges: 'nswe'})`, 0.6 tall.
* **The Long Lane**: keep the strip z -58..-32, x 512..596 clear. It is 84 m of flat run-up from the
  stage west to the West Thirteen.
* `P.spot('Greek Theatre', 628, 6, -45, Math.PI / 2, [590, -64, 640, -26])`.

### S10 Scholar's Wave (uni_hill)

On the Arts Plaza, facing the Avenue.
* `K.bankToWall(540, -24, 580, 1.4, 4)`: a wall at z -26.5..-24, top 8.3, and a bank from z -24 to
  -20.
* A bronze sculpture on it in decor (`D.add` torus knot, made once; 0x6b7a5e) at (560, 9.5, -25.3).
* Pads: `K.pad(588, -20, 600, -14, 0.25)`, `K.pad(524, -20, 532, -14, 0.25)`.

### S11 Science Hall dock and Science Plaza (uni_hill)

* `K.building(672, -116, 706, -74, 4, 0xd8cbb0, 'office')`.
* `K.loadingDock(676, -74, 696, 1)`: a platform at z -74..-71, 1.3 tall, with a ramp off the east end
  (x 696..702) and a handrail.
* **Science Plaza** x 672..720, z -64..20:
  * flat bar `K.rail(696, 6.42, -24, 712, 6.42, -24, 'Flatbar', true)`
  * manual pads `K.pad(678, -44, 692, -38, 0.2)` and `K.pad(678, -10, 692, -4, 0.2)`
  * ledges `K.ledge(700, -60, 716, -59.4)` and `K.ledge(700, 8, 716, 8.6)`

### S12 Lecture Row stoops (uni_hill)

Three halls at x 924..972: `K.building(924, z0, 972, z1, 4, 0xcdbf9f, 'stone')`, with z0..z1 at
-116..-86, -76..-46 and -36..-6.

Each has a west stoop `K.B(916, 5, z0 + 6, 924, 7.2, z1 - 6, 'marble', {edges: 'nsw'})`.
* Halls 1 and 3: `K.stairSpot('x', 916, -1, z0 + 9, z1 - 9, 7.2, 6, 4, 0.4, {rails: [(z0 + z1) / 2]})`.
  It ends at x 914.8.
* Hall 2: two banks instead,
  `K.hubbas.push({a: V(916, 7.2, -61), b: V(908, 6.02, -61), w: 12, noRails: true, color: 0xc4bfb3})`.

### S13 The Balustrades (uni_town)

University Avenue's stone parapets down the embankment edges: two sloped ledge blocks, 0.45 over the
avenue top, 0.6 wide:

```js
K.hubbas.push({a: V(496, 5.97, 15.7), b: V(420, 1.41, 15.7), w: 0.6, color: 0xd8cbb0});
K.hubbas.push({a: V(496, 5.97, -15.7), b: V(420, 1.41, -15.7), w: 0.6, color: 0xd8cbb0});
```

The avenue is exactly linear (6 %) over x 412..496, so the block sits 0.45 above it the whole way.
They are 76 m long.
* Stone newel piers at each top end, `K.B(496, 5.4, ±15.4, 499, 6.9, ±16.0, 'marble')` [town]. You
  ollie on just below the pier, at x 495.
* Between |z| 11 and 15.4 there is a 4.4 m paved strip on the embankment top, to ride beside them.
* **The Avenue Banks** below the parapets (|z| 16..24): ground, 26°, up to 3.9 m tall at x 504.
* `P.spot('The Balustrades', 516, 6, 0, Math.PI / 2, [412, -24, 520, 24])`.

### S14 The Campus Gateway (uni_hill)

At the Avenue's top. Stone piers `K.B(514, 6, -16, 518, 12.4, -12, 'marble')` and
`K.B(514, 6, 12, 518, 12.4, 16, 'marble')`, outside the 11 m sidewalks. A prop lintel
`K.prop(513.5, 11.2, -16, 518.5, 12.6, 16, 0xd8cbb0)`, 11.2 clear above the road, carries the
UNIVERSITY OF PORTO ALTO sign.

### S15 The West Thirteen (uni_hill)

Down the west Rampart into Rampart Lane, at the end of the Long Lane.
* Rim boxes `K.B(504, 0, -64, 512, 6, -24, 'marble', {edges: 'w'})` [hill].
* `K.stairSpot('x', 504, -1, -52, -36, 6, 1.95, 13, 0.4, {rails: [-48, -40], hubbas: [-52.4, -35.6]})`.
  Risers 0.312, run 4.8; it ends at x 499.2. Ground is 1.95 there.
* **Roll-away**: Rampart Lane, then Thirteen Yard (x 440..499, z -64..-28), 60 m flat.
* `K.lip` along the rim's west edge at 6, for z -64..-52.5 and -35.5..-24.
* `P.spot('West Thirteen', 520, 6, -44, Math.PI / 2, [494, -60, 600, -28])`.

### S16 Thirteen Yard (uni_town)

The paved yard at the foot of the West Thirteen, x 440..499, z -64..-28 (y ≈ 1.6–1.95):
* `K.ledge(452, -60, 476, -59.4)`
* `K.ledge(452, -32.6, 476, -32)`
* a manual pad `K.pad(456, -50, 470, -42, 0.2)`
* two `K.picnic` tables at (480, -36) and (480, -58)
* `K.bikeRack` at (446, -30)

From the Yard you go west to Gown Street, or carve up the north Avenue Bank and over the avenue.

### S17 The Car Park and the Garage (uni_town)

The car park is x 408..488, z -200..-120. It falls about 3 % to the north (2 m over 60 m) and is
ridden fast toward the ridge corner.
* `K.garage(420, -190, 470, -150, 5, 1)`: a deck at groundMin + 5 ≈ 5.0–6.0, with the ramp hubba at
  x 423.5 from z -187 (top) to -150.5.
* `K.parkingBlock(x, z, false)` in two rows: x 476..486 every 3.2 m at z -196..-124, and x 410..418
  at z -146..-124.
* Islands: `K.planter(440, -140, 470, -137, 0.5)` and `K.planter(440, -128, 470, -125, 0.5)`.
* Cart rails: `K.rail(442, ground + 0.5, -132, 468, ground + 0.5, -132, 'Rail', true)` (use the
  ground at each end).
* 6 parked `K.car`s.
* `P.spot('Car Park', 446, K.terrainH(446, -146), -146, 0, [404, -204, 492, -116])`.

### S18 The Bookstacks (uni_town)

A bookstore and library annex.
* `K.building(444, 114, 500, 150, 3, 0x8a5444, 'brick')`.
* **Returns Deck** along its north face: `K.B(444, 0, 108, 500, gD + 1.2, 114, 'plaza', {edges: 'n'})`,
  where gD = K.terrainH(472, 107) ≈ 1.15.
* Steps: `K.stairSpot('z', 108, -1, 466, 478, gD + 1.2, gD, 4, 0.4, {rails: [472], hubbas: [465.6, 478.4]})`.
* The **Returns Ledge**: `K.ledge(448, 103.4, 462, 104)` and `K.ledge(482, 103.4, 496, 104)`.

### S19 Scholars Square (uni_town)

x 440..500, z 36..100. Pale paving, about 1.9 → 1.3 (it falls 1.25 % to the south).
* The **Founder's Plinth**: `K.B(466, 0, 64, 474, gP + 0.55, 72, 'marble', {edges: 'nswe'})`, where
  gP = K.terrainH(470, 68), with a statue on it in decor.
* 6 `K.bench` in two rows.
* 4 `K.planter` corners.
* It is open on the east to the Commons (x 500..512): skate straight through from the Great Steps'
  foot to Gown Street.

### S20 The Bike Shed DIY: the hidden park (uni_south)

Behind the dorms, x 916..968, z 152..190.
* **Quarterpipe** facing west, as a K.feat. Its coping is 1.6 high, on a deck 2.6 deep with a back
  wall:
  ```js
  const qp = d => d <= 0 ? 0 : 2.6 - Math.sqrt(6.76 - Math.min(d, 2.4) ** 2);   // radius 2.6, top at d 2.4 = 1.6
  K.feat(958, 963, 156, 186, (x, z, h) => h + qp(x - 958), 'set');
  K.rail(960.4, K.terrainH(960.4, 156) + 1.6, 156, 960.4, K.terrainH(960.4, 186) + 1.6, 186, 'Coping', false);  // build after the feat
  K.B(963, 0, 155, 965, 3.2, 187, 'plaza');
  ```
  Use P.region(952, 968, 152, 192, 0.5) (in index.js). The lowland falls 1.25 % south here, and the
  feat follows it.
* A kicker `K.kicker(940, 170, 1, 0, 2.4, 0.6, 1.3)` aimed east at the QP.
* A pad `K.pad(926, 160, 932, 166, 0.25)`.
* A flat rail `K.rail(924, g + 0.45, 182, 944, g + 0.45, 182, 'Flatbar', true)` (use the ground at
  each end).
* `K.jersey(946, 156, 952, 156.8)`.
* A plywood bank to wall: `K.hubbas.push({a: V(930, g + 1.2, 189), b: V(930, g + 0.02, 185), w: 8, noRails: true, color: 0xc49a5c})`,
  with `K.B(926, 0, 189, 934, g + 2.2, 190, 'wood', {edges: 'n'})`.
* Tags on the shed wall (`D.tag`).
* `P.spot('Bike Shed DIY', 930, K.terrainH(930, 175), 175, -Math.PI / 2, [912, 150, 970, 192])`.

### S21 Alumni Field and the Track Kerb (uni_south)

At 1.25. The **Track Kerb** is the inner kerb of the track: 0.15 high, so you roll over it and can
grind its edge.
* Straights: `K.B(780, 0.5, 65.85, 860, 1.40, 66.15, 'curb', {edges: 'ns'})` and
  `K.B(780, 0.5, 133.85, 860, 1.40, 134.15, 'curb', {edges: 'ns'})`.
* Semicircles r 34 around (780, 100) and (860, 100): 12 `K.rail(..., 1.40, ..., 'Curb', false)`
  segments each, plus a matching `D.prop` kerb strip per segment for the look.
* Pitch lines: `K.paintRect` (the field is flat).
* 4 light towers as `K.prop`s at the corners, x 732 / 908, z 52 / 148.
* Player benches: `K.bench` ×2 at z 146.

---

## 5. Lines

| line | route | time |
|---|---|---|
| **L1 The Grand Descent** (ridge → campus) | Off the Heights at 18–21 m/s → dip at z -200 → swoop up the Ridge Road. You top out at 10–13 m/s. → Bear east on the Brow Walk → up the West Podium Bank → grind the west Reading Ledge → Library Steps (rail or hubba) → down the Quad's N–S walk, nose-manual the ledges → carve the Wishing Well → round the Campanile → off the rim down the Terrace Stands, tier by tier, or down an aisle rail → Track Kerb grind round the bend → Field Walk south → Mill Lane → Campus Drive's flat → campus gate | 55–60 s |
| **L2 The Avenue Bomb** (plateau → fin) | Plateau Drive → through the Gateway → ollie onto a Balustrade at x 495, a 76 m downhill grind (or carve the Avenue Banks) → 16 m/s at the foot → cross Gown Street → out of the avenue gate at 12–13 m/s straight into Metro Avenue | 15–20 s |
| **L3 Arts to Commons** | Old Main's 4-stair → across the Arts Plaza → Scholar's Wave bank-to-wall → cross the Avenue → Great Steps (rail, gap or hubba) → Commons ledges → fountain bowl → up the Drive Bank → Drive Kerb, 136 m down the Drive → Mill Lane → campus gate | 40–50 s |
| **L4 The Rampart Run** | Theatre Bank off the Drive → top tier → drop the tiers west → stage → the Long Lane (84 m) → West Thirteen → Thirteen Yard ledges → up the north Avenue Bank, over the avenue, down the south bank → Scholars Square plinth → Bookstacks Returns Deck → Mortarboard Skates on Gown Street | 40 s |
| **L5 The Science Run** | Ridge Road top → Science Hall dock (rail and ramp off) → Science Plaza flat bar and pads → Kinked Twelve → Field Walk → courts → Mill Lane east → the Bike Shed DIY quarterpipe | 35–45 s |

---

## 6. Skatepark

The **Bike Shed DIY** (S20) is the district's park. It gets a 'park' fast-travel point. There is no
built skatepark; the campus is the park.

---

## 7. Buildings and dressing

### Buildings

All `K.building` unless marked D. There are about 34.

**uni_hill**:
* Founders Library 744..876 × -116..-100, 5 floors, stone 0xd8cbb0.
* Old Main 528..612 × -116..-80, 4 floors, 0xcdbf9f.
* Science Hall 672..706 × -116..-74, 4 floors, office.
* Lecture Row ×3, 924..972, 4 floors, stone.
* The **Campanile** `K.building(803, 16, 817, 30, 13, 0xd8cbb0, 'stone')`, 44 m, plus decor:
  * a belfry `D.prop(802, 50, 15, 818, 55, 31, 0xcdbf9f)`
  * 4 dark arch props
  * a verdigris cone `D.add(cone geometry r 8 h 9, 0x6b7a5e, [810, 59.5, 23])`
* Hallam Gallery 504..546 × 20..40, 3 floors, stone. It covers the plateau's SW corner and its
  batter.
* Hillside Halls, three dorms on the north-face slope, brick 0xa86b55:
  * 676..716 × -200..-150, 4 floors
  * 820..870 × -196..-150, 4 floors
  * 900..960 × -196..-146, 5 floors
* The Library dome: `D.add(sphere geometry r 10, 0x6b7a5e, [810, 6 + 17 + 3, -108])` on a drum
  `D.add(cylinder r 9 h 4, 0xcdbf9f, [810, 25, -108])`.

**uni_town**:
* College Row: 8 brick terraces at x 373..385 (2–3 floors), at z -200..-170, -160..-120, -110..-70,
  -60..-16, 16..60, 70..110, 120..160 and 170..200.
* Gown Street east frontage, x 408..432:
  * -110..-80, 3 floors
  * **Mortarboard Skates** -78..-58, 2 floors
  * -56..-30, 3 floors
  * 30..60, 3 floors
  * 66..100, 2 floors
  * 108..150, 3 floors
  * 160..190, 2 floors
* The Kettle Café 444..484 × -112..-72, 2 floors.
* The Bookstacks 444..500 × 114..150, 3 floors.
* **The Lyceum** cinema 444..500 × 160..190, 3 floors. A marquee prop: an awning
  `K.prop(452, gL + 3.2, 157.5, 492, gL + 3.6, 160, 0xd9c27a)`.

**uni_south**:
* Student Union 520..600 × 108..150, 3 floors, stone.
* **Union Deck** `K.B(520, 1, 102, 600, 2.4, 108, 'plaza', {edges: 'n'})`. It is 0.6 high and 80 m
  long, and it is the shop's frontage.
* Ashgrove Hall 916..968 × 60..96, 6 floors.
* Birchmoor Hall 916..968 × 104..140, 5 floors.
* Refectory 760..880 × 160..186, 2 floors, with `K.loadingDock(780, 160, 800, -1)` on its north face.
* `K.ledge(820, 154, 860, 154.6)` in front.
* A scoreboard `K.prop(812, 2, 150, 828, 8, 151, 0x2b2b2b)`.

### Signs (7 D.sign, all made-up names)

| text | at [x, y, z] | w × h | rotY | where |
|---|---|---|---|---|
| UNIVERSITY OF PORTO ALTO | [513.4, 11.9, 0] | 22 × 1.4 | -π/2 | the Gateway lintel, facing down the avenue |
| FOUNDERS LIBRARY | [810, 19.0, -99.95] | 20 × 2 | 0 | |
| OLD MAIN | [570, 15.5, -79.95] | 12 × 1.6 | 0 | |
| ALUMNI FIELD | [820, 7.0, 149.9] | 14 × 1.8 | π | on the scoreboard, facing the stands |
| THE LYCEUM | [472, gL + 5.2, 159.95] | 14 × 1.8 | π | |
| STUDENT UNION | [560, 10.0, 107.95] | 14 × 1.6 | π | |
| ASHGROVE HALL | [915.95, 14, 78] | 12 × 1.6 | -π/2 | |

Shop signs come from P.shop and don't count.

### Skate shops (2)

**Mortarboard Skates** [town]. On Gown Street's east side, the door facing west. g = K.terrainH(407.8, -68) ≈ 0.45.

```js
P.shop({ name: 'Mortarboard Skates', sign: [407.96, g + 3.85, -68, -Math.PI / 2, 7],
  awning: [406.4, -74, 408, -62, g + 2.2, 'x'], zone: [404.8, -72, 407.8, -64], door: [407.8, g, -68] });
P.travel('Mortarboard Skates', 401, g, -68, -Math.PI / 2, 'spot');
```

**Bluebook Boards** [south]. In the Student Union, the door on the Union Deck facing north to the
Commons.

```js
P.shop({ name: 'Bluebook Boards', sign: [590, 2.4 + 3.85, 107.96, Math.PI, 7],
  awning: [584, 106.4, 596, 108, 2.4 + 2.2], zone: [586, 104.8, 594, 107.8], door: [590, 2.4, 107.8] });
P.travel('Bluebook Boards', 590, 1.8, 96, Math.PI, 'spot');
```

### Landmarks (P.landmark, 2)

**The Campanile** [hill]:

```js
{ at: [810, 6, 23], near: 140, parts: [
  {shape: 'box', at: [0, 22, 0], size: [14, 44, 14], color: 0xd8cbb0},
  {shape: 'box', at: [0, 46.5, 0], size: [16, 5, 16], color: 0xcdbf9f},
  {shape: 'cone', at: [0, 53.5, 0], size: [16, 9, 16], color: 0x6b7a5e}] }
```

**Founders Library** [hill]:

```js
{ at: [810, 6, -108], near: 140, parts: [
  {shape: 'box', at: [0, 8.5, 0], size: [132, 17, 16], color: 0xd8cbb0},
  {shape: 'cyl', at: [0, 19, 0], size: [18, 4, 18], color: 0xcdbf9f},
  {shape: 'sphere', at: [0, 23, 0], size: [20, 14, 20], color: 0x6b7a5e}] }
```

### Trees (about 140 `K.tree`)

* The Quad: 3 per lawn edge, 24 in all.
* The north face, scattered: 30, kept out of x 636..664.
* The Avenue embankment top: none (keep the parapet line clean).
* College Row / Gown Street sidewalks: every 16 m on both sides, 40.
* Union Lawn: 12.
* Scholars Square: 6.
* The Field Walk: 10.
* Dorm lawns: 12.
* Mill Lane: 8.

No tree within 3 m of a ledge or in a run-up strip, a gate corridor or a band.

### Lamps (about 70 `K.lamp`)

* Ridge Road and Campus Drive: both sides every 24 m.
* University Avenue: both sides every 24 m. On the embankment they stand at |z| 12.
* Gown Street and Mill Lane: every 28 m.
* The Quad perimeter.
* The Commons.

---

## 8. Challenges (10, ids `uni-`)

```js
{ id: 'uni-steps-gap', name: 'Great Steps Gap', desc: 'Ollie the whole double flight from the top deck to the Commons',
  at: [572, 6, 36], go: [572, 6, 20, Math.PI], kind: 'gap', from: [548, 32, 596, 40, 5.6], to: [546, 49, 598, 72, 1.5] },
{ id: 'uni-steps-rail', name: 'Great Steps Handrail', desc: 'Grind a Great Steps handrail',
  at: [556, 6, 38], go: [556, 6, 22, Math.PI], kind: 'grind', rail: 'Handrail', area: [552, 40, 592, 49, 1.8] },
{ id: 'uni-lib-hubba', name: 'Library Hubba', desc: 'Grind a hubba beside the Library Steps',
  at: [797.6, 7.8, -88], go: [797.6, 7.8, -97, Math.PI], kind: 'grind', rail: 'Hubba', area: [796.5, -86.5, 823.5, -83.5, 6] },
{ id: 'uni-balustrade', name: 'The Balustrade', desc: 'Grind a University Avenue balustrade',
  at: [492, 6, 15.7], go: [516, 6, 13.5, Math.PI / 2], kind: 'grind', rail: 'Hubba', area: [420, 14.8, 497, 16.6] },
{ id: 'uni-avenue-speed', name: 'Avenue Bomb', desc: 'Hit 45 km/h down University Avenue',
  at: [470, 3.96, 0], go: [530, 6, 0, Math.PI / 2], kind: 'speed', speed: 45 / 3.6, area: [404, -11, 504, 11] },
{ id: 'uni-kinked', name: 'Kinked Twelve', desc: 'Grind the kinked handrail',
  at: [704, 6, 38], go: [704, 6, 18, Math.PI], kind: 'grind', rail: 'Handrail', area: [702.5, 39.5, 705.5, 46.5] },
{ id: 'uni-stands-score', name: 'Work the Stands', desc: 'Land a 2,500 point line that starts on the Terrace Stands',
  at: [820, 6, 34], go: [820, 6, 26, Math.PI], kind: 'score', pts: 2500, area: [736, 32, 904, 56] },
// hard
{ id: 'uni-thirteen-kf', hard: true, name: 'Kickflip the West Thirteen', desc: 'Kickflip the whole thirteen-stair into Rampart Lane',
  at: [508, 6, -44], go: [540, 6, -44, Math.PI / 2], kind: 'trick', tricks: ['Kickflip'], from: [504, -52, 512, -36, 5.6], to: [470, -56, 499, -32, -1, 2.4] },
{ id: 'uni-quad-line', hard: true, name: 'Quad Line', desc: 'In one line from the Quad: two grinds and a manual, 3,000 points or more',
  at: [810, 6, 8], go: [810, 6, 10, 0], kind: 'line', pts: 3000, area: [724, -86, 896, 14], need: [['grind', 2], ['Manual', 1]] },
{ id: 'uni-legend', hard: true, name: 'College Hill Legend', desc: 'Land a 12,000 point line that starts anywhere on College Hill',
  at: [650, 6, -110], go: [650, 6, -112, Math.PI], kind: 'score', pts: 12000, area: [360, -230, 1000, 230] },
```

* uni-thirteen-kf: the take-off box is the rim top. The landing is the lane and the Yard; the -1
  follows dt.js `to` usage.
* uni-legend: build it in index.js, after the parts.
* Who registers each: hill takes steps-gap, lib-hubba, quad-line and thirteen-kf; town takes
  balustrade and avenue-speed; south takes steps-rail, kinked and stands-score; index takes legend.

---

## 9. Tapes (6)

| # | where | P.tape(x, z, y) | part |
|---|---|---|---|
| 1 | on the garage roof deck, NE corner | (466, -154, garage deck y: use garage()'s return) | town |
| 2 | at the bottom of the Wishing Well | (810, -28, 4.6) | hill |
| 3 | on the top theatre tier, north end | (619, -58, 8.7) | hill |
| 4 | on the Great Steps' landing, east cheek end | (597, 44.4, 3.9) | south |
| 5 | on the DIY quarterpipe deck | (962, 176, K.terrainH(962, 176)) | south |
| 6 | behind the planter at the Library podium's east end | (896.5, -97.5, 7.8) | hill |

---

## 10. Traffic, peds and npcs

Lanes sit 3.2 m off the centre on the rw-7 streets.

**Traffic** [index.js]:

```js
P.traffic({ path: [[650, 0], [650, 200], [396, 200], [396, 0]], lane: 3.2, dir: 1, n: 3, speed: 9, r: 8 });
P.traffic({ path: [[650, 0], [650, 200], [396, 200], [396, 0]], lane: 3.2, dir: -1, n: 3, speed: 9, r: 8 });
P.traffic({ path: [[650, -210], [650, -10]], lane: 2.4, dir: 1, n: 2, speed: 10, r: 8 });   // Ridge Road, 2-point like fin's
```

Cars climb the Avenue's 6 % and run Campus Drive. None use Gown Street's north half or the band.

**Peds** [index.js]:
* the Quad perimeter: `{path: [[726, -80], [894, -80], [894, 12], [726, 12]], n: 10}`
* Gown Street's sidewalks: `{path: [[387, -200], [405, -200], [405, 190], [387, 190]], n: 8}`
* the Commons: `{path: [[516, 44], [620, 44], [620, 100], [516, 100]], n: 6}`

**Skaters** [index.js]. These have the same meaning as in dt.js.

Sessions:
* the west Reading Ledge:
  `{kind: 'session', rail: [730, -93.7, 770, -93.7], start: 724, end: 776, back: 3.4, side: 1, speed: 5.4}`
* a Commons ledge (`K.ledge(524, 60, 548, 60.6)`):
  `{kind: 'session', rail: [524, 60.3, 548, 60.3], start: 518, end: 554, back: 3.4, side: 1, speed: 5}`

Loops:
* the Quad's inner walks: `{kind: 'loop', path: [[732, -78], [888, -78], [888, 10], [732, 10]], speed: 6}`
* the Drive's plateau sidewalks: `{kind: 'loop', path: [[641, -115], [659, -115], [659, 28], [641, 28]], speed: 6.2}`

---

## 11. Fast travel

| kind | name | at (x, y, z) | yaw | who |
|---|---|---|---|---|
| district | University | 810, 6, 4 | 0 (looks north up the Quad at the Well and the Library) | index.js |
| park | Bike Shed DIY | 930, K.terrainH(930, 175), 175 | -π/2 (facing the QP) | south |
| spot | Great Steps | 572, 6, 24 | π | hill |
| spot | The Balustrades | 516, 6, 0 | π/2 | town |
| spot | Ridge Climb | 650, 1.0, -226 | π (at the gate, facing up the hill) | hill |
| spot | Mortarboard Skates | 401, 0.45, -68 | -π/2 | town |
| spot | Bluebook Boards | 590, 1.8, 96 | π | south |

---

## 12. Budget estimate

| | estimate | budget |
|---|---|---|
| boxes | ~560 (rims 10, stairs ~120, stands 21, ledges / pads / planters ~70, benches ~40, parking blocks ~70, buildings 34, the rest) | 900 |
| grind lines | ~480 (box edges ~300, rails ~70, fountain copings ~60, track kerb 24, hubba edges ~30) | 700 |
| buildings | 34 | 70 |
| D.sign | 7 | 8 |
| fine ground | ~31,500 m² | 60,000 |
| triangles | ~200k (34 buildings, 140 trees, 70 lamps, decor domes and cones) | 450k |

---

## 13. Parts

Files in `levels/porto/uni/`. The splice order is by name, with `index.js` last. All functions are
called from index.js.

| file | fn | rect [x0, x1, z0, z1] | owns |
|---|---|---|---|
| `uni_plan.js` | `uni_plan()` | — | everything in 2.1, 2.3 and 2.4 |
| `uni_hill.js` | `uni_hill(K, P)` | 496, 1000, -230, 40 | the plateau and the north face |
| `uni_town.js` | `uni_town(K, P)` | 360, 496, -230, 230 | College Town and the Avenue up to x 496 |
| `uni_south.js` | `uni_south(K, P)` | 496, 1000, 40, 230 | everything below the south Rampart |

**uni_hill** builds:
* every Rampart box with z1 ≤ 40 or x0 ≥ 504 (south rim decks, the west rim, the Gallery)
* S4–S12, S14 and S15
* the Campus Drive and Avenue K.streets on the plateau
* the north-face dorms, trees and lamps on the Ridge Road and Drive down to z 32
* the 2 landmarks

**uni_town** builds:
* S13 (it owns x ≤ 496; the Balustrades end exactly at 496, and its newel piers at x 496..499 are the
  one exception, in hill's rect but built by town)
* S16–S19
* the College Row, the Gown Street frontage, the Lyceum and Kettle Café
* the Mortarboard shop
* Avenue, Gown Street and Mill Lane (x ≤ 496) dashes and lamps

**uni_south** builds:
* the flights, banks, kerb and tiers below z 40 (S1 flights, S2, S3, S4 flights and rail, S5 tiers)
* S20 and S21
* the Commons (fountain `K.fountainBowl(568, 72, 7, 1.6)`, and
  `K.ledge(524, 60, 548, 60.6)`, `K.ledge(588, 60, 612, 60.6)`, `K.ledge(524, 86, 548, 86.6)`,
  `K.ledge(588, 86, 612, 86.6)`, planters)
* the Union and Union Deck, the Bluebook shop, the Refectory, dorms and courts
* Drive and Mill Lane (x ≥ 496) dashes and lamps

**`index.js`** (`porto_uni`), in this order:
1. `const PL = uni_plan(); P.ground(PL.ground); P.col(PL.col); P.surface(PL.surface);`
2. the P.region list (2.2)
3. `uni_hill(K, P); uni_town(K, P); uni_south(K, P);`
4. traffic, peds and npcs (10)
5. `P.travel('University', 810, 6, 4, 0, 'district')`
6. the uni-legend challenge

The order matters: the parts' builders read K.terrainH, so the ground must exist first.

**Order inside the parts.** Put the K.feat (the DIY QP) before its coping rail. Build any Bg/ledge
after the ground is set; it always is.

---

## 14. Phone rules (checklist for builders)

* **Downhill streets** are the University Avenue (6 %), Campus Drive (3.75 %) and Ridge Road (10 %).
  The Ridge Road is the one climb, and it is meant: you arrive at 18–21 m/s from the Heights and top
  out at 10–13 m/s. The plateau and the benches are flat on purpose.
* **Curbs.** Flush streets have none. Plateau K.street curbs get 0.15 chamfer hubbas where flush
  paving meets them (3.2). Pads and kerbs are ≤ 0.3 (you roll up them).
* **Ledges** are 0.45. Handrails sit 0.8–0.9 over the nosing.
* **Run-ups**: ≥ 30 m at every big drop (the Long Lane is 84 m, Science Plaza 60 m, Gallery Forecourt
  30 m). **Roll-aways** are ≥ 15 m everywhere, and the Library's East Six has 12.7 m.
* **Sightlines.** From the ridge you see the Campanile and the dome over the brow. From the Avenue's
  foot you see the Gateway and the Campanile up the hill. From the plateau rim you see the field and
  the campus gate.
* **Made-up names only**: Porto Alto, Founders Library, Old Main, Hallam Gallery, Mortarboard Skates,
  Bluebook Boards, the Lyceum, Ashgrove / Birchmoor Halls, the Kettle Café.
* **Nothing over 0.3 m in a gate corridor.** No K.feat, pool or hump in a band. No tree or lamp in
  x 360..372 or z -230..-218 / 218..230 on the corridors.

**Check with:**

```
--rides '[["ridge",[650,1.2,-228],[0,0,19],5,"push"],["avenue",[505,6,0],[-8,0,0],8,"push"],["drive",[650,6,30],[0,0,8],8,"push"]]'
```

and the sink scan.

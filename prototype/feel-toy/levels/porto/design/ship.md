# Shipyard East (`ship`) — district design

Rect **x 0..1000, z 910..1350**. Shared borders: the **north edge z 910** (old for x 0..300, east for
x 300..1000) and the **west edge x 0** (bw), so the 12 m bands are z 910..922 and x 0..12. The east
edge (x 1000) is map-edge hill, and south of z 1180 is the sea (water y -46, sea bed -52 from z 1186).

Gates (all three corridors stay at base height and clear of anything over 0.3 m):

| gate | at | width | base y | corridor (kept clear) | reached by |
|---|---|---|---|---|---|
| hillbomb (east → ship) | (600, 910) | 16 | -40.200 | x 592..608, z 910..926 | Gantry Road, straight on south |
| harbourRd (bw → ship) | (0, 1020) | 16 | -40.933 | x 0..16, z 1012..1028 | Harbour Road, painted flush (no curbs) to x 96 |
| boardwalk (bw → ship) | (0, 1150) | 12 | -41.800 | x 0..16, z 1144..1156 | the Quay Walk planks (paint only) |

Coordinates: x east, z south (+z is toward the sea), y up. Yaw: 0 faces north (-z), π south, -π/2
east (+x), +π/2 west. `D.sign` / shop `rotY`: 0 shows the face to the south (+z), π to the north,
π/2 to the east (+x), -π/2 to the west.

Every height in this doc comes from the formulas in section 2 (checked with a scratch copy of
`portoBaseH`). When a number says "top -40.405" it is an absolute y; build it as written.

---

## 1. Concept

The city ends here, at sea level. Shipyard East is a working container port laid out as one big
**downhill plate**. It falls 3.7 m from the hill-bomb gate to the quay, and that fall comes from one
gentle 1.9 % grade broken by two flat benches. The two cross-streets (Harbour Road, Quay Road) sit on
those benches, so they are truly flat.

**Gantry Road** is the spine. The Eastside Hill Bomb comes in through the hillbomb gate at about
15.5 m/s and runs dead straight down Gantry Road for 250 m. It ends on the stern ramp of **the
Corvina**, a ro-ro freighter tied up at the quay, and you can roll all the way on to its deck and out
to the bow. That is the district's signature line.

West of the spine are the old harbour buildings and the **Loading Bay Row**, and east of it the
modern terminal:

* **Loading Bay Row (Bay Lane, x 440).** Two warehouse pairs face each other across a 12 m service
  lane, with twelve truck docks at different heights: drop lines, manual pads in the lane, and
  gap-to-grinds between docks. This is the spot the district is known for.
* **The harbour front (x 16..256).** The Port Authority (a granite terrace with a five-stair and three
  handrails), the Net Lofts with the shop Slipway Skates, the Bonito Cannery with its dock levellers,
  and the East Quay Fish Market on the water.
* **The terminal (x 611..1000).**
  * The **Skyway Stub**: an unfinished freeway on-ramp that climbs 10 m and ends in mid-air over a
    gravel pile. It is the district's big gap.
  * Flatbed trailers and a rail spur.
  * Terminal Gate 3.
  * The container yard, with a rideable one-high **Stack Run** and the **Reefer Canyon** gap.
  * Three gantry **cranes** on the quay, which you can see from the hills.

The mood is salt-grey concrete, rust and painted steel, sodium lamps, gulls, and container colours
against a pale sky.

Where the inherited pieces come from:

| inherited from | pieces |
|---|---|
| mega4.js Port | container rows, the freeway embankment and the gravel landing pile, the quay bollards, the crane boxes |
| mega45.js | the Port Authority (terrace, long stair with rails, bank, block benches) and the Fish Market (shed columns, a loading platform with a ramp and steps, steel tables) |

---

## 2. Height plan

### 2.1 What the base does here

`portoBaseH` over the rect is B(z) = -40 - 2·(z - 880)/300 (the profile is straight here, so the ±24 m
smoothing changes nothing for z 904..1156):

| z | 910 | 930 | 1020 | 1150 | 1180 |
|---|---|---|---|---|---|
| B(z) | -40.200 | -40.333 | -40.933 | -41.800 | -42.000 |

Past z 1180, base is the sea override, falling to -52 by z 1186. For x > 975 the edge hills add
`22·sm((x-975)/30)·sm((1150-z)/60)`.

### 2.2 The district ground (ship_plan.js)

The base falls only 0.67 %, so it is too flat to coast on. Ship lowers its interior to a 1.89 % plate
that ends at y -44.0 on the quay. The plate is flat in x and depends only on z, so every E-W street
can be a flat `K.street`.

```js
// in ship_plan(): all the shared numbers
const s  = 0.0189003;            // (B(930) + 44) / 194
const Y0 = -40 - 2 * 50 / 300;   // B(930) = -40.33333
const y1 = Y0 - 80 * s;          // -41.84536  Harbour bench, z 1010..1034
const y2 = y1 - 74 * s;          // -43.24398  Quay bench,    z 1108..1132
const Y = z => z <= 1010 ? Y0 - (z - 930) * s                 // (only used for z >= 930)
             : z <= 1034 ? y1
             : z <= 1108 ? y1 - (z - 1034) * s
             : z <= 1132 ? y2
             : z <= 1172 ? y2 - (z - 1132) * s                 // reaches -44.000 at z 1172
             : -44.0;                                           // the quay apron, z 1172..1180
const sm = t => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
const W = x => Math.min(1, Math.max(0, (x - 16) / 80));        // 0 at x<=16 (the bw band), 1 at x>=96
const E = x => 1 - sm((x - 945) / 30);                          // 1 at x<=945, 0 at x>=975 (the hills)
const ground = (x, z, base) => {
  if (z <= 930) return base;                                    // the north band and gate corridor
  const k = W(x) * E(x);
  if (z > 1180) return base + k * (Math.min(base, -46.6) - base);   // under the quay face: straight to water depth
  return base + k * (Y(z) - base);
};
```

Notes:

* z ≤ 930 is base, so the north band (z 910..922) and the hillbomb corridor (z 910..926) are exactly
  base. Y(930) = B(930), so the plate starts with no step.
* x ≤ 16 is base (W = 0), so the west band and both bw corridors are exactly base. In x 16..96 the
  ground fades from base to the plate. The extra cross-fall is at most 2.6 % (at the quay).
* The `z > 1180` line keeps the ground under the quay face below the water. Without it, base just
  past z 1180 is still -42, which would make a hidden 2 m bump in front of the quay edge.
* All the kinks are on mesh grid lines: z 930, 1010, 1034, 1108, 1132, 1172 and 1180, and x 16 and 96.
  The mesh draws them exactly, so **no `P.region` is needed** (fine ground used: 0 m²).

Key heights, which all builders use: **PL.Y(z)** for x 96..945, and **terrainH(x, z)** elsewhere.

| z | Y | z | Y | z | Y |
|---|---|---|---|---|---|
| 930 | -40.333 | 1004 | -41.732 | 1086.7 | -42.841 |
| 938 | -40.485 | 1010..1034 | **-41.845** | 1096 | -43.017 |
| 942 | -40.560 | 1036 | -41.883 | 1100 | -43.093 |
| 946 | -40.636 | 1038 | -41.921 | 1104 | -43.168 |
| 951 | -40.730 | 1042 | -41.997 | 1108..1132 | **-43.244** |
| 960 | -40.900 | 1044 | -42.034 | 1136 | -43.320 |
| 966 | -41.014 | 1048 | -42.110 | 1140 | -43.395 |
| 976 | -41.203 | 1050 | -42.148 | 1146 | -43.509 |
| 982 | -41.316 | 1052 | -42.186 | 1150 | -43.584 |
| 986 | -41.392 | 1062 | -42.375 | 1160 | -43.773 |
| 988 | -41.430 | 1064 | -42.412 | 1166 | -43.887 |
| 989.8 | -41.464 | 1068 | -42.488 | 1172..1180 | **-44.000** |
| 1000 | -41.656 | 1080 | -42.715 | | |
| 1002 | -41.694 | 1084 | -42.790 | | |

Coasting on 1.89 % settles at about 10.5 m/s, so rolling downhill keeps a pushed speed. The hill
bomb's 15.5 m/s drops off slowly along Gantry Road and arrives at the Corvina at about 12 m/s.

### 2.3 Colour and surface (written in index.js from PL)

`P.col(fn)` returns a `THREE.Color` or null. The first match wins:

| area | colour |
|---|---|
| Gantry Road x 593..607, z 910..1128 | asphalt 0x56585d (the strips in 3.2 cover it, but the colour stops the edges blurring) |
| Harbour Road z 1014..1026, x 0..96 | asphalt 0x56585d |
| sidewalks z 1010..1014 and 1026..1030, x 0..96 | 0xc4c0b6 |
| lanes: Ropewalk Lane z 926..938 (x 16..589); Net Loft Lane x 244..256; Bay Lane x 434..446 (both z 926..1112); Straddle Lane x 760..780, yard entry x 611..652 and Skyway Approach x 930..958 (z 1034..1112, the Skyway Approach also z 940..1112) | worn asphalt 0x6a6b6e |
| Quay Walk z 1144..1156, x 0..104 | planks 0x8a6a48 (the same tone as bw's boardwalk) |
| Port Authority forecourt x 104..176, z 989..1010 | granite 0xb9b4aa |
| gravel: pile foot and pallet yard, x 611..730, z 926..962 | 0x8d8678 |
| x ≥ 960, z < 1150 (the hill toe) | grass 0x7d9a5b |
| everything else inside the rect | oily yard concrete 0x8f8c86 for z < 1172, quay 0x9d9a92 for z ≥ 1172 |

`P.surface`: 'rough' in x 611..730, z 926..962 (the gravel), otherwise null.

---

## 3. Layout

### 3.1 Site map (10 m per character)

Key:

| char | meaning | char | meaning |
|---|---|---|---|
| `#` | Gantry Road | `=` | Harbour Road / Quay Road |
| `-` | lanes | `A` | Port Authority |
| `B` | other buildings | | |
| `t` | its terrace | `N` | Net Lofts |
| `C` | Bonito Cannery | `F` | Fish Market |
| `W` | warehouses A..D | `d` | docks |
| `n` | Net Racks | `w` | Quay Walk |
| `S` | Skyway Stub | `g` | gravel pile |
| `p` | pallet yard | `f` | flatbeds |
| `r` | rail spur | `T` | Terminal Gate |
| `c` | containers | `R` | Reefer Row |
| `K` | crane legs | `_` | quay edge |
| `V` | Corvina | `o` | pontoon |
| `~` | sea | `h` | hill |
| `v` `>` | gates | | |

```
          x: 0         100       200       300       400       500       600       700       800       900      1000
     910  ...........................................................#v....................................hhh
     920  .----------------------------------------------------------##ppppppppp...........................hhh
     930  .----------------------------------------------------------##ppppppppp...........................hhh
     940  ..BBBBBBBBAAAAAAAA......--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##.........gggSSSSSSSSSSSSSSSSSSSSSS..hhh
     950  ..BBBBBBBBAAAAAAAANNNNNN--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##.........gggSSSSSSSSSSSSSSSSSSSSSS..hhh
     960  ..BBBBBBBBAAAAAAAANNNNNN--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##....................................hhh
     970  ..BBBBBBBBttttttttNNNNNN--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##...ffffff...........................hhh
     980  ..BBBBBBBBttttttttNNNNNN--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##...ffffff...........................hhh
     990  ..BBBBBBBB........NNNNNN--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##...ffffff...........................hhh
    1000  ..BBBBBBBB........NNNNNN--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##...rrrrrrrrrrrrrrrrrrrrrrrrrrrrr....hhh
    1010  ===========================================================##==================================..hhh
    1020  >==========================================================##==================================..hhh
    1030  ........................--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##----ccccccccccc--ccccccccccc.R..--..hhh
    1040  ...........dddddddddddd.--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##TTTTccccccccccc--ccccccccccc.R..--..hhh
    1050  ...nnnnnn.CddddddddddddC--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##----ccccccccccc--ccccccccccc.R..--..hhh
    1060  ...nnnnnn.CCCCCCCCCCCCCC--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##----ccccccccccc--ccccccccccc.R..--..hhh
    1070  ...nnnnnn.CCCCCCCCCCCCCC--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##----ccccccccccc--ccccccccccc.R..--..hhh
    1080  ...nnnnnn.CCCCCCCCCCCCCC--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##----ccccccccccc--ccccccccccc.R..--..hhh
    1090  ..........CCCCCCCCCCCCCC--WWWWWWWWWWWWWWWWddddWWWWWWWWWWWWW##----ccccccccccc--ccccccccccc.R..--..hhh
    1100  ..........CCCCCCCCCCCCCC--WWWWWWWWWWWWWWWWW-ddWWWWWWWWWWWWW##----ccccccccccc--ccccccccccc.R..--..hhh
    1110  .........==================================================##==================================..hhh
    1120  ....BB...==================================================##==================================..hhh
    1130  ....BB....FFFFFFFFFF.............................................................................hhh
    1140  wwwwwwwwwwwFFFFFFFFF................................................KK........KK........KK.......hhh
    1150  >wwwwwwwwwwFFFFFFFFF................................................KK........KK........KK..........
    1160  ..........FFFFFFFFFF................................................KK........KK........KK..........
    1170  .........______________________________________________________________________________________.....
    1180  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~oooo~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1190  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~oooo~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1200  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1210  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1220  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1230  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1240  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1250  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1260  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1270  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1280  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1290  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1300  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1310  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1320  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1330  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VVVV~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    1340  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
B = other buildings (Ropewalk Sheds, Harbour Master). Lanes/roads are drawn where they are painted; the Skyway Approach (x 930..958, z 940..1112) is open lane.

### 3.2 Streets and lanes

All the E-W streets sit on the flat benches and are built with `K.street('x', …)` at a single y.

* **Harbour Road**: z 1020, y **PL.y1 = -41.845**, `{rw: 6, sw: 4}` (road z 1014..1026, sidewalks
  1010..1014 and 1026..1030).
  * Segments: x 96..244 (west), x 256..434 and 446..589 (bays), x 628..760 and 780..930 (yard), with
    no crossings array. The gaps are the lane mouths, and cars turn into them.
  * Use `lamps: false` on the yard segments; their lamps are placed by hand (5.4).
  * In x 0..96 Harbour Road is **paint only**: P.col (2.3) plus a centre dash
    `K.dash(2, 1020, 94, 1020)`. It has no curbs, so the gate corridor stays flush.
* **Quay Road**: z 1120, y **PL.y2 = -43.244**, `{rw: 5, sw: 3}` (road 1115..1125, sidewalks
  1112..1115 and 1125..1128).
  * Segments: x 96..244 (west), 256..434 and 446..589 (bays), 628..760 and 780..930 (quay).
  * Use `lamps: false` on the quay segments.
* **Gantry Road** (the spine): x 593..607, z 910..1128. It runs on the slope, so it is painted, not
  curbed.
  * Asphalt strips: `PL.paintZ(593, 607, 910, 1128, 0x56585d)`.
    `paintZ(x0, x1, z0, z1, col)` lays strips 2 m long in z, each one
    `D.plane(x0, z, x1, z+2, max(terrainH at both ends) + 0.012, col)`. The road is flat in x.
  * Centre line: `K.dash(600, 912, 600, 1126, 0xe2c044)` (dash follows the slope), plus edge lines
    0xf0ece2 at x 593.3 and 606.7.
  * **Sidewalks** x 589..593 (west) and 607..611 (east), built with
    `PL.walkZ(x0, x1, z0, z1, side)`. This draws a 0.15 m sidewalk on the slope: the run is split at
    the PL.kinks inside it (930, 1010, 1034, 1108, 1132), and for each piece:
    * sloped: a `K.hubbas.push({a: V(xm, Y(za)+0.15, za), b: V(xm, Y(zb)+0.15, zb), w: x1-x0, noRails: true, color: 0xc4c0b6})`;
    * flat: a `K.B(x0, Y-0.6, za, x1, Y+0.15, zb, 'sidewalk')`.
    It also adds one `K.rail(xr, Y(za)+0.15, za, xr, Y(zb)+0.15, zb, 'Curb', false)` on the road-side
    edge (xr = 593 or 607), and 1.4 m curb-ramp hubbas (0.15 → 0.01) at each end.

    | side | spans |
    |---|---|
    | west | z 940..1008.6, 1031.4..1110.6 |
    | east | z 960..1008.6, 1031.4..1110.6 (cut at z 940..960 so the Skyway roll-out crosses flush) |

  * Nothing stands in x 592..608 for z 910..926 (the gate corridor). The first lamp is at z 940.
* **Lanes** (P.col only, flush, no curbs): Ropewalk Lane (z 926..938, x 16..589), Net Loft Lane
  (x 244..256), Bay Lane (x 434..446), Straddle Lane (x 760..780), the yard entry lane (x 611..652),
  and the Skyway Approach (x 930..958). Each lane gets a centre dash 0xe2c044.

### 3.3 Blocks (who owns what)

| block | x | z | part |
|---|---|---|---|
| Harbour Gate apron, Net Racks | 16..96 | 1034..1108 | west |
| Port Authority + forecourt | 104..184 | 946..1010 | west |
| Net Lofts + Slipway Skates | 186..240 | 950..1008 | west |
| Bonito Cannery + dock | 104..240 | 1036..1104 | west |
| Fish Market, Quay Walk, west quay | 0..256 | 1128..1180 | west |
| Warehouses A/B (west side of Bay Lane) | 262..433 | 938..1106 | bays |
| Warehouses C/D (east side of Bay Lane) + Deckhand Skate Supply | 446..589 | 942..1108 | bays |
| bays quay apron, Pilot Slip, pontoon | 256..589 | 1128..1192 | bays |
| Pallet Yard, Skyway roll-out, flatbeds, rail spur | 611..930 | 926..1008 | yard |
| Skyway Stub | 700..958 | 940..962 | yard |
| Terminal Gate, container yard, Reefer Row | 611..944 | 1034..1112 | yard |
| crane quay, straddle carriers, Corvina | 589..945 | 1112..1336 | quay |
| the hill toe (fence, trees) | 945..1000 | 910..1150 | yard (z < 1112) / quay |

### 3.4 How each gate is reached

* **hillbomb (600, 910)**: the rider arrives heading south at about 15.5 m/s on base ground. Gantry
  Road carries on dead straight; the first thing in the way is the stern ramp at z 1160. Side exits:
  Ropewalk Lane (z 932), the Skyway roll-out (z 944..960), Harbour Road and Quay Road.
* **harbourRd (0, 1020)**: Harbour Road paint on base, fading over x 16..96 to the bench at -41.845
  (a 1.1 % drop eastward). The first curbs start at x 96.
* **boardwalk (0, 1150)**: the Quay Walk planks on base, fading to the plate over x 16..96
  (2.2 % downhill east), with the Quay Walk slappies (4.1) starting at x 20.

---

## 4. Spots

Notation: `K.B(x0, y0, z0, x1, y1, z1, mat, {edges, color})`. When y0 is written as `g-0.4`, it means
the lowest ground under the box minus 0.4 (use PL.Y or terrainH). Hubbas are written
`H(a=[x,y,z], b=[x,y,z], w)`, which stands for `K.hubbas.push({a: V(...), b: V(...), w, noRails?})`.
Each spot gets a `P.spot(name, x, y, z, yaw, area)` with the values given.

### 4.1 Part `west` (x 0..256)

**Net Racks**, on the Harbour Gate apron (x 16..96, z 1034..1108; open concrete, no curbs).

* Eight flat-bar rails, 0.75 m tall: `K.rail(x0, terrainH(x0,z)+0.75, z, x1, terrainH(x1,z)+0.75, z, 'Rail', true)`.
  * x 34..54 and 62..82
  * at z 1060, 1068, 1076 and 1084
* The ground falls 0.9–1.3 m eastward across the apron, so each rail runs gently downhill.
* Run-up: 30 m from the harbourRd gate. Roll-away: on east into Harbour Gate apron / Cannery.
* Dressing:
  * net-drying frames as D.prop poles, 2.4 m tall at each rail end (posts only, set off 0.5 m from the rail ends);
  * two benches `K.bench(20, 1040, 26, 1040.6)` and `K.bench(20, 1100, 26, 1100.6)`.
* Spot: 'Net Racks' (24, terrainH, 1072, -π/2), area [30, 1056, 86, 1088].

**Port Authority** (from mega45.js).

* Building: `K.building(108, 946, 172, 976, 5, 0x9c9890, 'stone')`. Sign PORT AUTHORITY on its south
  face: `D.sign('PORT AUTHORITY', 140, -36.0, 976.05, 14, 1.6, 0)`.
* Terrace: `K.B(104, -41.6, 976, 176, -39.750, 988, 'marble', {edges: 'w'})`. Its top is -39.750,
  which is 1.45 m over the ground at z 976 and 1.68 m at z 988.
* **The Authority Five**: `K.stairSpot('z', 988, 1, 124, 156, -39.750, -41.464, 5, 0.45, {rails: [123.55, 140, 156.45]})`.
  This makes 4 step boxes from z 988 to 989.8 with 0.343 m risers, and three handrails.
* Drop lips either side: `K.lip(104, 988, 123.1, 988, -39.750)` and `K.lip(156.9, 988, 176, 988, -39.750)`.
  These are 1.6 m drops on to the forecourt.
* Bank up on to the terrace from the east: `H(a=[176, -39.750, 982], b=[186, -41.316, 982], w 10, noRails)`
  (15.7 %).
* Block benches on the terrace, 0.55 m: `K.B(x, -39.75, 979, x+3.5, -39.20, 980.2, 'marble', {edges: 'ns'})`
  at x 110 and 162.
* Forecourt (x 104..176, z 989.8..1010, granite):
  * four planters `K.planter(x, 996, x+5, 999)` at x 106, 122, 151 and 167;
  * trees `K.tree` in the planters' centres;
  * lamps at (104, 1008) and (176, 1008).
* Run-up: from the terrace's west end you have 52 m along the top (enter by the bank, turn west, come
  back east), or ride straight off the bank at speed and turn south to the stairs. Roll-away: the
  forecourt, 20 m to Harbour Road.
* Spot: 'Port Authority' (140, -39.75, 981, π), area [104, 976, 186, 1010].

**Net Lofts and Slipway Skates.**

* Building: `K.building(186, 950, 240, 1002, 3, 0x8c6a5d, 'brick')`.
* Stoop walkway `K.B(190, -42.1, 1002, 218, -40.794, 1005, 'step', {edges: 's'})`, 0.96 m over the
  ground at z 1005.
* Stairs `K.stairSpot('x', 218, 1, 1002, 1005, -40.794, -41.722, 3, 0.4, {rails: [1005.45]})`.
* Shop **Slipway Skates**:

  ```js
  P.shop({ name: 'Slipway Skates', sign: [228, -37.844, 1002.04, 0, 7],
           awning: [222, 1002, 234, 1003.6, -39.494], zone: [224, 1002.2, 232, 1005.2], door: [228, -41.694, 1002] })
  ```

  Travel: `P.travel('Slipway Skates', 228, -41.75, 1006, 0, 'spot')`.
* Spot: 'Net Lofts' (204, -40.79, 1003.5, -π/2), area [186, 1000, 242, 1010].

**Bonito Cannery.**

* Building: `K.building(104, 1052, 236, 1104, 2, 0x9b5a46, 'brick')`. Sign
  `D.sign('BONITO CANNERY', 170, -35.4, 1051.95, 16, 1.6, π)`, facing north towards Harbour Road.
* Dock: `K.B(110, -42.6, 1044, 230, -40.834, 1052, 'plaza', {edges: 'n'})`, 1.20–1.35 m.
* West steps: `K.stairSpot('x', 110, -1, 1044, 1052, -40.834, -42.11, 4, 0.4, {rails: [1043.55]})`.
* East ramp: `H(a=[230, -40.834, 1048], b=[238, -42.11, 1048], w 8, noRails)` (16 %).
* **Three dock levellers**: `H(a=[x, -40.834, 1044], b=[x, -41.921, 1038], w 3)` at x 135, 165 and 195,
  **with** Hubba rails. That makes three 1.1 m hubbas off the dock lip, facing Harbour Road.
* Crates on the dock, 'wood' with `{edges: 'nswe'}`, all from y -40.834:
  * x 146..148.4, z 1046..1048.4, 0.8 m tall;
  * x 176..180, z 1045.5..1047.5, 0.6 m tall;
  * x 208..209.2, z 1049..1050.2, 1.2 m tall.
* Run-up: Harbour Road (flat bench) and the 8 m apron. Roll-away: back north across Harbour Road, or
  east to Net Loft Lane.
* Spot: 'Cannery Levellers' (165, -40.83, 1046, 0), area [104, 1036, 240, 1052].

**East Quay Fish Market.**

* Shed: 'metal' columns 0.5 m square, 6 m tall, at x 104 + 16k (k = 0..6), z 1140 and 1166.
* Roof: `D.prop(102, Y+6, 1138, 202, Y+6.4, 1168, 0x6f7d84)`, with Y taken at z 1140.
* Sign `D.sign('EAST QUAY FISH MARKET', 152, -36.6, 1129.9, 18, 1.6, π)`, hung on the roof edge facing
  Quay Road.
* **Loading platform** `K.B(106, -43.6, 1130, 198, -42.044, 1136, 'plaza', {edges: 'ns'})`, 1.20 m on
  the Quay Road side and 1.28 m at z 1136.
* Steps at the west end: `K.stairSpot('x', 106, -1, 1130, 1136, -42.044, -43.244, 4, 0.4, {rails: [1136.45]})`.
* Ramp at the east end: `H(a=[198, -42.044, 1133], b=[206, -43.244, 1133], w 5, noRails)` (15 %).
* Steel tables, 0.9 m, 'metal', `{edges: 'nswe'}`: 1.2 × 5 m at x 114, 132, 150, 168 and 186, at
  z 1150..1151.2 and 1157..1158.2. The y is ground + 0.9 at the table (Y at z 1150 / 1157); make the
  box from Y-0.2.
* Fish crates as 'wood' 0.5 m `K.B` with no edges, in four stacks along the south side (z 1162..1164).
* Run-up: Quay Road bench (flat) heading east, up the ramp or the steps. Roll-away: the Quay Walk,
  then the quay edge.
* Spot: 'East Quay Fish Market' (110, -42.04, 1133, -π/2), area [102, 1128, 206, 1170].

**Quay Walk and the west quay** (x 0..256, z 1144..1180).

* Planks: P.col only.
* **Quay Walk slappies**: two long, low wood curbs 0.25 m tall, following the x-slope of the blend.
  * Each one is `H(a=[20, g(20,z)+0.25, z], b=[92, g(92,z)+0.25, z], w 0.6, noRails, color 0x8a6a48)`
    with `K.rail(20, g+0.25, z-0.3, 92, g+0.25, z-0.3, 'Ledge', false)`.
  * z = 1162.3 and 1168.3; g is terrainH.
  * They continue bw's slappy strip.
* **Quay edge**:
  * x 0..16: `K.B(0, -50, 1176, 16, -41.965, 1180, 'ledge', {edges: 's'})` (flush with base; bw's quay
    wall meets it).
  * x 16..96: `H(a=[16, -41.973, 1178], b=[96, -44.0, 1178], w 4, noRails, color 0x9d9a92)`, plus
    `K.rail(16, -41.973, 1180, 96, -44.0, 1180, 'Ledge', false)` and a face box
    `K.B(16, -50, 1179.4, 96, -44.3, 1180, 'ledge')`.
  * x 96..256: `K.B(96, -50, 1176, 256, -44.0, 1180, 'ledge', {edges: 's'})`.
* Bollards (bw's 12 m rhythm): 0.5 × 0.5 × 0.6 m 'metal', color 0x2b2b2e, no edges, centred on
  z 1178 at x = 6 + 12k, using terrainH.
* Lamps along the Quay Walk at x 30, 60 and 90, z 1142.
* Tape: on the fish platform's east end (196, 1133, -42.044).

### 4.2 Part `bays`: the **Loading Bay Row** (x 256..589)

Bay Lane (x 434..446) is a 12 m flush lane falling 1.89 % southward. The docks on both sides are flat
boxes, so as the lane falls away each dock gets taller toward its south end. Riding south, every dock
starts low and ends high: a drop line.

Warehouses:

| warehouse | builder |
|---|---|
| A | `K.building(262, 946, 427, 1004, 3, 0x7a8590, 'office')` |
| B | `K.building(262, 1036, 427, 1106, 3, 0x6f7a72, 'brick')` |
| C | `K.building(452, 944, 584, 1006, 3, 0x9b8f7f, 'brick')` |
| D | `K.building(452, 1034, 584, 1108, 3, 0x8a8f94, 'office')` |

Dock boxes are `K.B(x0, g-0.4, z0, x1, top, z1, 'plaza', {edges})`. Their dock faces get a 0.15 m
dark 'metal' bumper strip as D.prop (decor only).

**West docks** (Warehouses A and B, x 427..433, edges 'ens'):

| dock | z | top | height over the lane |
|---|---|---|---|
| WA1 | 946..962 | -39.436 | 1.20 → 1.47 |
| WA2 | 966..982 | -40.414 | 0.60 → 0.90 |
| WA3 | 986..1004 | -40.492 | 0.90 → 1.24 |
| **Long Dock** | 1036..1100 | -41.483 | 0.40 → 1.61 |

* WA1 ramp: `H(a=[430, -39.436, 946], b=[430, -40.485, 938], w 6, noRails)` (13 %), with a sloped
  handrail `K.rail(433.4, -38.536, 946, 433.4, -39.585, 938, 'Handrail', true)` on its lane side.
* WA1 → WA2 is a 4 m drop gap down 0.98 m. WA2 → WA3 is a 4 m gap at about the same height.
* Long Dock: 64 m with no break. You can grind or manual it from knee height to above head height.

**East docks** (Warehouses C and D, x 446..452):

| dock | z | top | height | edges |
|---|---|---|---|---|
| C1 | 942..960 | -40.405 | 0.155 → 0.495 | 'wns' |
| C2 | 964..982 | -40.405 | 0.571 → 0.911 | 'wns' |
| C3 | 986..1004 | -40.405 | 0.987 → 1.327 | 'wns' |
| D5 | 1036..1048 | -41.283 | 0.60 → 0.83 | 'wns' |
| D6 | 1052..1064 | -41.186 | 1.00 → 1.23 | 'wns' |
| D7 | 1068..1080 | -41.938 | 0.55 → 0.78 | 'wns' |
| D8 | 1084..1096 | -41.490 | 1.30 → 1.53 | 'wns' |
| D9 | 1100..1108 | -42.293 | 0.80 → 0.95 | 'wns' |

* **C1–C3, the gap-to-grind**: all three share one top, so the lane falls away under a level ledge
  line. C1 starts at 0.155 m, a step-on. You grind the 'w' edge, ollie the 4 m gap to C2, and so on.
  C3 ends 1.33 m up.
* **D5–D9, the drop docks**: they alternate low/high/low/high/low, with 4 m gaps. Going south, each
  gap is a step up to grind (D5→D6, D7→D8) or a drop (D6→D7, D8→D9).
  * Leveller on to D5: `H(a=[449, -41.283, 1036], b=[449, -41.845, 1032], w 6, noRails)`.

**Manual pads** in the lane centre: `K.pad(438.8, z0, 441.2, z0+10, 0.18)` at z0 = 950, 990, 1046 and
1080. They are 2.4 m wide, which leaves 4.8 m lanes each side for the cars on loop W.

**Deckhand Skate Supply** (the second shop), in Warehouse D's east wall on Gantry Road:

```js
P.shop({ name: 'Deckhand Skate Supply', sign: [584.04, -38.146, 1042, Math.PI / 2, 7],
         awning: [584, 1036, 585.6, 1048, -39.796, 'x'], zone: [584.2, 1038, 587.4, 1046], door: [584, -41.997, 1042] })
```

Travel: `P.travel('Deckhand Skate Supply', 588, -41.997, 1042, Math.PI / 2, 'spot')`.

Other details:

* Sign `D.sign('LOADING BAY ROW', 440, -33.4, 938.2, 12, 1.4, 0)`: a gantry board on two 'metal'
  posts at x 433.6 and 446.4, z 938, with the board 7 m up so it clears everything.
* Run-up: Ropewalk Lane gives 420 m of flat-to-falling lane from the harbourRd side, or 160 m back from
  Gantry Road. Turn into Bay Lane at z 932, then 10 m to C1/WA1. Roll-away: Harbour Road (the bench),
  then on to D5 and Quay Road.
* Spots:
  * 'Loading Bay Row' (440, -40.48, 936, π), area [427, 930, 452, 1112];
  * 'Long Dock' (430, -41.48, 1038, π), area [427, 1036, 433, 1100].
* Travel: 'Loading Bay Row' (440, -40.48, 936, π).

**Bays quay apron** (x 256..589, z 1128..1180):

* Quay edge box `K.B(256, -50, 1176, 589, -44.0, 1180, 'ledge', {edges: 's'})`.
* Bollards: x = 6 + 12k, z 1178 (skip x 522..536).
* Lamps every 40 m at z 1142.
* **Pilot Slip**: a concrete slipway down to a floating pontoon.
  * Slipway `H(a=[529, -44.0, 1180], b=[529, -45.38, 1186], w 3, noRails, color 0x8f8c86)` (23 %).
  * Gangway rails `K.rail(527.3, -43.2, 1180, 527.3, -44.58, 1186, 'Rail', true)` and the same at x 530.7.
  * Pontoon `K.B(516, -46.4, 1186, 542, -45.4, 1192, 'wood', {edges: 'swe'})`. It sits 0.6 m above
    the water; ride off any side and you're in the sea.
  * Tape on the pontoon (529, 1189, -45.4).
  * Spot: 'Pilot Slip' (529, -44.0, 1172, π), area [516, 1170, 542, 1192].

### 4.3 Part `yard` (x 589..1000, z 910..1112)

**Pallet Yard** (x 611..700, z 926..940, gravel, 'rough'):

* Ten pallet stacks, 'wood' 1.2 × 1.2 m, 0.6/0.9/1.2 m tall, `{edges: 'nswe'}`. They sit on terrainH
  (`K.B` with g from terrainH, or Bg). Place them along z 929 and 935 at x 624, 632, 646, 660, 674
  (z 929) and 628, 640, 654, 668, 684 (z 935).
* Stay out of x 592..608.

**Skyway Stub**, the unfinished on-ramp:

* **On-ramp**: `H(a=[840, -30.5, 951], b=[944, -40.73, 951], w 14, noRails, color 0xa8a69f)`. It climbs
  10.2 m over 104 m (9.8 %), going west.
* **Deck**: `K.B(732, -31.7, 944, 840, -30.5, 958, 'garage', {edges: 'w'})`, flat at -30.5, 108 m long.
* **Piers**: `K.B(x-1.2, g-0.4, 949.8, x+1.2, -31.7, 952.2, 'garage')` at x 744, 768, 792 and 816.
* **Guardrails**, 'Rail' with posts, 0.8 m above the surface, on both edges (z 944.4 and 957.6):
  * `K.rail(944, -39.93, z, 840, -29.7, z, 'Rail', true)` on the ramp;
  * `K.rail(840, -29.7, z, 733, -29.7, z, 'Rail', true)` on the deck.
* **Jersey line** across the deck at x 758.6..759.4, 0.8 m, 'ledge' `{edges: 'ew'}`:
  * `K.B(758.6, -30.5, 944.6, 759.4, -29.7, 949.5)` and `K.B(758.6, -30.5, 952.5, 759.4, -29.7, 957.4)`;
  * a 3 m gap through the middle to line up for the end.
* Rebar stubs: D.prop 0.04 m bars sticking 0.6 m out of the deck end at x 731.4..732, only at
  z 944.5..946 and 956..957.5 (the edges). Leave the middle clear.
* Sign `D.sign('ROAD ENDS', 745, -27.2, 951, 6, 1.2, Math.PI / 2)`, which faces east toward a rider on
  the deck. It hangs 3.3 m over the deck from a D.prop gantry beam, so it is decor and nothing to hit.
* **Gravel pile** (the landing): `H(a=[728, -32.7, 951], b=[700, -40.73, 951], w 16, noRails, color 0x8d8678)`.
  * It is 4 m out from the deck end and 2.2 m below it, then falls 8 m over 28 m (29 %).
  * At 8.5 m/s off the deck you clear the 4 m and land on the slope. You leave the foot at about
    17 m/s into the roll-out apron (x 611..700, z 944..962, gravel). There, carve south on to Gantry
    Road (the east sidewalk is cut at z 940..960); straight on is Warehouse C's wall at x 584.
* **Under the Skyway DIY** (in the deck's shadow, 9 m clear):
  * banks `H(a=[769.2, -39.33, 951], b=[775.2, -40.71, 951], w 2.4, noRails)` and
    `H(a=[814.8, -39.33, 951], b=[808.8, -40.71, 951], w 2.4, noRails)` against piers 768 and 816;
  * `K.ledge(780, 947.4, 804, 948.0, 0.45)` and `K.pad(780, 953.8, 804, 956.2, 0.18)` between them;
  * tape under the deck at (788, 951, -40.73).
* Approach: from Harbour Road's east end, turn north up the Skyway Approach (x 930..958), then turn
  west at z 951 on to the ramp foot at x 944. Push up the ramp, then push again on the 108 m deck.
* Spots:
  * 'Skyway Stub' (836, -30.5, 951, π/2), area [700, 940, 958, 962];
  * 'Under the Skyway' (790, -40.73, 960, 0), area [744, 944, 840, 958].
* Travel: 'Skyway Stub' (836, -30.5, 951, π/2).

**Flatbed Row**:

* Nine trailers, each 13 × 2.5 m and 1.3 m tall:
  `K.B(x0, Y(z0+2.5)-0.4, z0, x0+13, Y(z0)+1.3, z0+2.5, 'metal', {color, edges: 'nswe'})`.
  * x0 = 646, 663, 680; z0 = 970, 980, 990.
  * Colours: 0x3d4f63 / 0x7c2f28 / 0x55595e, by column.
  * They leave 4 m gaps along x and 7.5 m aisles.
  * Wheels as D.prop under each end.
* Kick-up on to the middle row: `K.kicker(699, 981.25, -1, 0, 6, 1.3, 2.4)`. It rises west on to
  trailer (680, 980). Then there are two 4 m trailer-to-trailer gaps going west.
* Jersey maze: six `K.jersey` (6 × 0.6 m), alternating direction:
  * x 712..718 at z 968;
  * x 724..724.6, z 972..978;
  * x 732..738 at z 984;
  * x 744..744.6, z 976..982;
  * x 752..758 at z 990;
  * x 712..712.6, z 986..992.
* Spot: 'Flatbed Row' (705, -41.3, 981.25, π/2), area [640, 966, 760, 996].

**Rail spur** (decor plus wagons):

* Two rails as D.prop (0.12 × 0.08 m) at z 1000.8 and 1002.2, x 640..930.
* Sleepers: D.dash, 0x4a3b2e, every 1 m.
* Five flatcar wagons, 1.25 m:
  `K.B(x0, Y(1003.1)-0.4, 999.9, x0+14, Y(999.9)+1.25, 1003.1, 'metal', {color: 0x6b4a33, edges: 'ns'})`
  at x0 = 700, 717, 734, 820 and 837. That makes 3 m gaps between wagons.
* Buffer stop `K.B(930, g-0.4, 999.6, 931.5, Y(999.6)+1.1, 1003.4, 'metal', {color: 0xc8402e, edges: 'w'})`.

**Terminal Gate 3** (the yard entry, x 611..652):

* Booth `K.building(626, 1044, 632, 1050, 1, 0xdedad2, 'office')`.
* Barrier arm: `K.rail(632.2, -41.03, 1047, 645, -41.03, 1047, 'Rail', true)`. It sits 0.9 m over the
  ground, a flat bar across the lane; paint it with red/white D.prop bands.
* Weighbridge `K.pad(632, 1080, 648, 1096, 0.15)`, a 16 × 16 m steel plate whose edges grind.
* Chain-link `K.B(…,'fence')` 2.4 m:
  * along z 1032 from x 652 to 757.8, and from 784 to 889.6;
  * along x 652 from z 1032 to 1036.
  Leave the yard open at its lanes.
* Sign `D.sign('TERMINAL 3', 629, -36.9, 1043.9, 6, 1.2, π)` on the booth roof edge, facing north.
* Keep x 612..624 clear of anything over 0.15 m for z 1020..1120 (the loop-E cars).

**Container yard**:

* Two blocks of six rows × eight stacks.
  * Block A x0 = 652 + 13.2·i; block B x0 = 784 + 13.2·i (i = 0..7).
  * Each stack is 12.2 m long with 1 m gaps.
  * Rows at z0 = 1038, 1050, 1062, 1074, 1086 and 1098, each 2.45 m deep, which leaves 9.55 m aisles.
* Each stack is one box:
  `K.B(x0, Y(z0+2.45)-0.4, z0, x0+12.2, Y(z0)+n·2.6, z0+2.45, 'car', {color, edges: 'ns'})`, where n is
  its height. Skip n = 0. (The ground is flat along x, so every stack in a row has an exact top.)
* Optionally add a D.prop seam (0.04 m, 0x1f1f22) around each stack at every 2.6 m level, so the
  containers read as stacked.
* Palette, picked per stack by `(i·7 + row·3) % 7`:
  [0xb5452f, 0x2f6d8a, 0xd18b2c, 0x4f7a43, 0x8a8f94, 0x6b3f6e, 0xc9c2b0].

Heights (n), west to east:

| row | z0 | block A | block B |
|---|---|---|---|
| 1 | 1038 | 2 2 1 0 1 2 3 2 | 1 2 2 3 2 1 1 2 |
| 2 | 1050 | 3 2 2 1 1 2 2 3 | 2 1 1 0 1 2 3 3 |
| 3 | 1062 | **Stack Run** (see below) | **Stack Run East** (see below) |
| 4 | 1074 | 2 1 0 2 2 0 1 2 | 3 3 2 1 0 1 2 1 |
| 5 | 1086 | 1 2 3 3 2 1 2 1 | 1 0 1 2 2 1 1 2 |
| 6 | 1098 | 2 2 1 1 0 1 2 2 | 2 1 1 1 2 3 2 1 |

* **The Stack Run (A3)**: eight one-high stacks with no gaps: x0 = 652 + 13.2·i, **13.2 m long**, so
  they butt end to end. The top is Y(1062) + 2.6 = **-39.775** all the way from x 652 to 757.6.
  * East plate up from the Straddle Lane: `H(a=[757.6, -39.775, 1063.225], b=[770, -42.375, 1063.225], w 2.45, noRails, color 0x8a8f94)`
    (21 %).
  * West plate down into the entry lane: `H(a=[652, -39.775, 1063.225], b=[640, -42.375, 1063.225], w 2.45, noRails)`.
* **Stack Run East (B3)**: seven butted one-high stacks, x0 = 784 + 13.2·i for i = 0..6 (13.2 m long),
  with the top also -39.775. Slot 8 is empty, so the east end is a 2.6 m **Box Drop** at x 876.4.
  * West plate `H(a=[784, -39.775, 1063.225], b=[772, -42.375, 1063.225], w 2.45, noRails)`.
  * The two plates face each other across the Straddle Lane with 2 m of flat between: **the Valley**,
    a transfer from A3 to B3.
* The taller stacks are the canyon walls: drop off the Stack Run into the 9.55 m aisles (a 2.6 m Box
  Drop) and weave between them. Nothing above one-high can be reached from the ground.
* Tape on the Stack Run top (712, 1063.2, -39.775).
* Spots:
  * 'Stack Run' (764, -40.8, 1063.2, π/2), area [640, 1060, 890, 1066];
  * 'Container Yard' (618, -41.85, 1040, π), area [611, 1032, 945, 1112].

**Reefer Row and the Reefer Canyon** (x 904..909, running N-S between block B and the Skyway Approach):

* Plate `H(a=[906.5, -39.548, 1050], b=[906.5, -41.845, 1034], w 5, noRails, color 0x8a8f94)`
  (14.4 %).
* N1 `K.B(904, -42.7, 1050, 909, -39.548, 1066, 'car', {color: 0xdedad2, edges: 'nswe'})`.
* **Reefer Canyon gap**: 3.5 m to N2 `K.B(904, -43.0, 1069.5, 909, -39.548, 1085.5, 'car', {color: 0xdedad2, edges: 'nswe'})`.
  Both tops are equal and stand 2.6–3.3 m over the ground.
* A 1.2 m gap and 0.7 m drop to N3 `K.B(904, -43.5, 1086.7, 909, -40.241, 1098.9, 'car', {color: 0x2f6d8a, edges: 'nswe'})`.
* Plate down `H(a=[906.5, -40.241, 1098.9], b=[906.5, -43.244, 1110], w 5, noRails)` (27 %), on to the
  Quay Road sidewalk side.
* Reefer plugs as D.prop boxes on the west faces.
* Spot: 'Reefer Canyon' (906.5, -41.85, 1030, π), area [900, 1032, 913, 1112].

**Hill toe** (x 945..1000):

* Chain-link `K.B(958, g-0.2, z0, 958.1, gmax+2.4, z0+30, 'fence')` in 30 m pieces from z 930 to 1140.
* Eight `K.tree` at x 966..990, scattered between z 930 and 1140.
* Lamps on the Skyway Approach at x 952, z 970, 1000, 1040, 1080.

**Yard lamps**:

* Gantry Road at x 588 and 612, every 30 m from z 940 (skip z 1006..1034);
* Harbour Road yard segments at z 1009 and 1031, every 30 m;
* the container yard on 12 m D.prop masts with 4 lamp heads at (764, 1044) and (764, 1092).

### 4.4 Part `quay` (x 589..1000, z 1112..1350)

**Gantry Road, z 1112..1128**: paintZ and walkZ for the stretch past z 1110.6, and the centre dash
continues.

**Quay Road** segments (x 628..760 and 780..930, `lamps: false`). Lamps at z 1127 every 40 m.

**Straddle carriers** (parked, rideable under):

* At x 650, 745 and 840, z 1129..1137:
  * four legs `K.B(cx±2.3 ∓0.5, Y-0.4, z, …, Y+6, …, 'metal', {color: 0xd2a12a})`, 1 × 1 m, at
    (cx±2.3, 1129.5) and (cx±2.3, 1136.5);
  * top frame D.prop at Y+5.4..6.2;
  * cab D.prop.
* Clear height under them is 5.4 m.

**Gantry cranes**, three, at cx = 690, 790 and 890.

* Legs: `K.B(cx±8.9-0.8, Y-0.5, zl-0.8, cx±8.9+0.8, Y+30, zl+0.8, 'metal', {color})` at zl = 1146 and
  1174. That is four legs per crane.
  * Colours: 690 0xc8402e, 790 0xd2a12a, 890 0x3d6a9a.
* **Crane sills** (the feet beams), on each side between the leg pairs:
  `K.B(cx±8.9-0.4, -44.4, 1147, cx±8.9+0.4, -42.927, 1173, 'metal', {color: 0x2b2b2e, edges: 'we'})`.
  The top is -42.927, which is 0.6 m at the north end rising to 1.07 m at the south. That gives
  6 sills of 26 m each.
* Portal and boom are D.prop:
  * portal beams along z at x cx±8.9, y Y+26..+28.5;
  * cross beams at z 1146 and 1174;
  * the **boom lowered over the water**, x cx-1.2..cx+1.2, y Y+32..+34.2, z 1100..1240;
  * A-frame, two 1 m props up to Y+44 over z 1160;
  * machinery house (4 × 6 × 4 m) on the portal at z 1150..1156;
  * a dangling spreader at z 1215, y Y+20..+21.
* Crane rails: D.prop 0.1 m strips at z 1146 and 1174, x 600..945, minus the stern-ramp span
  x 593..607.
* Six **hatch-lid manual tables**: 'metal' 0.5 m, 6 × 3 m, `{edges: 'nswe'}`, color 0x55595e, box from
  Y-0.3 to Y(z0)+0.5. They are at:

  | x | z |
  |---|---|
  | 714..720 | 1152..1155 |
  | 742..748 | 1162..1165 |
  | 814..820 | 1152..1155 |
  | 842..848 | 1162..1165 |
  | 630..636 | 1156..1159 |
  | 914..920 | 1158..1161 |

* Quay edge `K.B(589, -50, 1176, 945, -44.0, 1180, 'ledge', {edges: 's'})` (skip nothing; the stern
  ramp overlaps it). From x 945 to 1000 the ground fades to base at the hill, so finish with
  `K.B(945, -50, 1176, 1000, base(1178), 1180, 'ledge', {edges: ''})`.
* Bollards at x = 6 + 12k, z 1178. Skip x 588..614, and within 2 m of the crane legs.
* Spot: 'Crane Quay' (790, -43.3, 1140, π), area [600, 1128, 945, 1180].

**The Corvina** (a ro-ro freighter moored stern-in at the quay):

* Hull `K.B(587, -52, 1186, 613, -41.0, 1336, 'metal', {color: 0x2e3f5c})`, with the deck top at
  -41.0. Deck paint: `D.plane(588, 1186, 612, 1336, -40.99, 0x7a3f2e)`.
* The bow taper is D.prop wedges past z 1320. The bow sits under the forecastle.
* **Stern ramp**: `H(a=[600, -41.0, 1186], b=[600, -43.773, 1160], w 12, noRails, color 0x55595e)`,
  with a 10.7 % climb. Add rails on its edges with posts: `K.rail(594.2, -40.2, 1186, 594.2, -42.973, 1160, 'Rail', true)`
  and the same at x 605.8.
  * At about 12 m/s off Gantry Road you arrive on deck at about 8 m/s.
* **Ship's rails**: `K.rail(587.6, -40.2, 1188, 587.6, -40.2, 1310, 'Rail', true)` and the same at
  x 612.4, 0.8 m over the deck.
* **Cargo hatches**, x 592..608, 0.7 m tall (top -40.3), 'metal' color 0x3f6b46, `{edges: 'nswe'}`:

  | hatch | z |
  |---|---|
  | H1 | 1200..1214 |
  | H2 | 1217.5..1231.5 |
  | H3 | 1235..1249 |
  | H4 | 1252.5..1266.5 |

  * The gaps between them are 3.5 m.
  * Bank on to H1: `H(a=[600, -40.3, 1200], b=[600, -41.0, 1195], w 16, noRails)`.
* **Superstructure**: `K.B(590, -41.0, 1286, 610, -27.4, 1302, 'building', {color: 0xe8e6e0, tex: 'office'})`.
  Use K.B here, not K.building, because terrainH is the sea bed. The 2.4 m side decks at
  x 587..590 / 610..613 let you ride past.
  * Bridge wings: D.prop at -29.5.
  * Funnel: D.prop 4 × 6 × 4 m at z 1296, color 0xb8402e.
  * Sign `D.sign('CORVINA', 600, -30.0, 1285.95, 9, 1.4, π)`, facing north up Gantry Road.
* **Forecastle**: bank `H(a=[600, -39.6, 1312], b=[600, -41.0, 1304], w 22, noRails)` up to
  `K.B(589, -41.0, 1312, 611, -39.6, 1336, 'metal', {color: 0x2e3f5c, edges: 'n'})`.
  * Windlass manual box `K.B(596, -39.6, 1320, 604, -38.95, 1324, 'metal', {color: 0x55595e, edges: 'nswe'})`.
  * Bow rails converge: `K.rail(589.6, -38.8, 1312, 599, -38.8, 1335, 'Rail', true)` and
    `K.rail(610.4, -38.8, 1312, 601, -38.8, 1335, 'Rail', true)`.
* Mooring lines: D.prop from the bollards at (582, 1178) and (618, 1178) to the stern corners.
* Tape at the bow: (600, 1333, -39.6).
* Spot: 'The Corvina' (600, -41.0, 1192, π), area [587, 1160, 613, 1336].
* Travel: 'The Corvina' (600, -41.0, 1194, π).

---

## 5. Lines

1. **Bomb to the Bow** (the signature line).
   * Come in at the hillbomb gate at 15.5 m/s and run straight down Gantry Road for 250 m: the Skyway
     roll-out on your left, the Deckhand shop on your right.
   * Cross Harbour Road and Quay Road (both flush where they meet Gantry Road) and go up the stern
     ramp at about 12 m/s.
   * Bank up on to H1, gap H1→H2→H3 (3.5 m each), and drop off H4.
   * Ollie up to the ship's rail and grind it along the side deck, past the superstructure, to
     z 1310.
   * Bank up on to the forecastle and grind a bow rail to the tip.
2. **Loading Bay Line**.
   * Ropewalk Lane east, then turn into Bay Lane at z 932.
   * Step on to C1, grind its 'w' edge, gap to C2 and grind, gap to C3 and grind, then drop 1.3 m.
   * Manual the pad at z 990..1000.
   * Cross Harbour Road and take the D5 leveller.
   * D5 grind, then up to D6, drop to D7, up to D8, drop to D9.
   * Manual pad 1080 on the way, then Quay Road, then the quay edge ledge to the Pilot Slip.
   * (Mirror line: WA1 ramp, WA1→WA2 drop gap, WA3, then the Long Dock: 64 m of grind.)
3. **Skyway to the Cranes**.
   * Push up the Skyway and along the deck, thread the jersey gap, and do the Skyway Gap to the gravel
     pile.
   * Roll out at about 17 m/s, carve south on Gantry Road, and turn east into the yard entry lane at
     z 1040.
   * Ollie the Terminal 3 barrier arm (or grind it).
   * Take the west plate up on to the Stack Run, ride 105 m of container tops, plate down into the
     Valley and up on to Stack Run East.
   * Box Drop off the end and roll down the aisles to Quay Road.
   * Grind a crane sill, manual a hatch-lid table, and grind the next sill.
4. **Fish Quay** (the bw link).
   * Enter at harbourRd and ride the Net Racks, or enter at boardwalk and ride the Quay Walk
     slappies.
   * Go north to Harbour Road, east to the Port Authority bank, and on to the terrace.
   * Grind a handrail (or kickflip) down the Authority Five, and drop the lips.
   * Cross Harbour Road and grind or 50-50 a cannery leveller.
   * Quay Road, the fish platform ramp, grind the platform edge, and steps down.
   * Quay Walk, then the quay edge ledge (x 0..256).
5. **Reefer Run**.
   * Harbour Road east to x 906, plate up on to N1.
   * Reefer Canyon (3.5 m), then the 1.2 m drop gap to N3.
   * Plate down to Quay Road and carve west to the crane sills.

---

## 6. Skatepark

There is no skatepark. The district is a street spot by design: bw has the Harbour Bowl next door.
The **Under the Skyway DIY** (4.3) is the only built-for-skating corner: two pier banks, a ledge and
a pad.

---

## 7. Buildings and dressing

**K.building** (10):

| building | builder |
|---|---|
| Port Authority | 108..172 × 946..976, 5 floors, stone |
| Net Lofts | 186..240 × 950..1002, 3 floors, brick |
| Bonito Cannery | 104..236 × 1052..1104, 2 floors, brick |
| Warehouses A–D | 3 floors each (4.2) |
| Terminal 3 booth | |
| Harbour Master's hut | `K.building(40, 1126, 52, 1136, 2, 0x8a9a9e, 'stone')`, west apron |
| Ropewalk sheds | `K.building(20, 944, 96, 1004, 2, 0xa39a8c, 'brick')`, which closes the north-west block |

The Corvina superstructure is a K.B 'building' box (1 more mesh).

**Landmarks** (2):

* Cranes: `{at: [790, -44, 1160], near: 160, parts}`, per crane at dx = -100, 0 and +100:
  * `{shape: 'box', at: [dx-8.9, 15, 0], size: [1.6, 30, 29.6], color}`;
  * `{…[dx+8.9, 15, 0]…}`;
  * a boom `{shape: 'box', at: [dx, 33, 10], size: [2.4, 2.2, 140], color}`;
  * the A-frame `{shape: 'box', at: [0, 40, 0], size: [1.2, 8, 1.2]}` on the middle crane only.

  That is 10 parts. These are what you see from the Eastside hills and the Heights.
* Corvina: `{at: [600, -46, 1261], near: 140, parts}`:
  * hull `[0, 2.5, 0] size [26, 5, 150]`, 0x2e3f5c;
  * superstructure `[0, 11.8, 33] size [20, 13.6, 16]`, 0xe8e6e0;
  * funnel `{shape: 'cyl', at: [0, 21, 35], size: [4, 6, 4]}`, 0xb8402e.

**Signs** (`D.sign`, 7 of 8): PORT AUTHORITY, BONITO CANNERY, EAST QUAY FISH MARKET, LOADING BAY ROW,
ROAD ENDS, TERMINAL 3, CORVINA. The two shops' boards don't count.

**Trees**: Port Authority planters (4), the hill toe (8), and K.street trees on Harbour Road west
(x 96..244) and the bays segments. That is about 30 in total. There are no trees on the quay or in the
yard.

**Lamps**:

* K.street lamps on the west and bays segments only;
* by hand on Gantry Road, the yard, the quay and the Quay Walk (as given in 4.1–4.4);
* two 12 m container-yard masts.

**Decor props**:

* crane portals and booms;
* the straddle-carrier frames;
* net frames;
* the Fish Market roof;
* rebar;
* wagon wheels;
* mooring lines;
* reefer plugs;
* the barrier stripes;
* the rail spur.

---

## 8. Challenges (10)

`at` / `go` y values are absolute. Boxes are `[x0, z0, x1, z1, yMin, yMax]`.

| id | name | kind and details |
|---|---|---|
| ship-skyway-gap | Skyway Gap | `gap`, desc 'Ollie off the end of the unfinished ramp on to the gravel pile', at [736, -30.5, 951], go [790, -30.5, 951, π/2], from [732, 944, 760, 958, -31.2, -29.5], to [700, 944, 728, 958, -41, -32.4] |
| ship-skyway-rail | Skyway Guardrail | `grind`, rail 'Rail', desc 'Grind a Skyway guardrail', at [880, -33.6, 944.4], go [836, -30.5, 951, -π/2], area [732, 943.8, 944, 958.2] |
| ship-gravel-speed | Gravel Bomb | `speed`, speed 12.5 (45 km/h), desc 'Hit 45 km/h off the gravel pile', at [714, -36.7, 951], go [760, -30.5, 951, π/2], area [600, 940, 728, 962] |
| ship-pa-kf | Kickflip the Authority Five | `trick`, trick 'Kickflip', at [140, -39.75, 987], go [140, -39.75, 979, π], from [124, 980, 156, 988, -40.0, -39.4], to [122, 989.8, 158, 1008, -42.5, -41.0] |
| ship-canyon | Reefer Canyon | `gap`, desc 'Gap from one reefer stack to the next', at [906.5, -39.55, 1067.7], go [906.5, -41.845, 1030, π], from [904, 1050, 909, 1066, -39.8, -39.2], to [904, 1069.5, 909, 1085.5, -39.8, -39.2] |
| ship-ship-rail | Ship's Rail | `grind`, rail 'Rail', desc 'Grind the Corvina's side rail', at [587.6, -40.2, 1240], go [600, -41.0, 1190, π], area [586.8, 1188, 613.2, 1310] |
| ship-score | Shipyard Line | `score`, pts 6000, desc 'Land a 6,000 point line that starts anywhere in the shipyard', at [600, -41.0, 975], go [600, -41.1, 980, π], area [0, 910, 1000, 1350] |
| ship-bay-line (hard) | Loading Bay Line | `line`, pts 3000, need [['grind', 2], ['Manual', 1]], desc 'In one line on Bay Lane: two grinds and a manual, 3,000 points or more', at [440, -40.49, 940], go [440, -40.41, 934, π], area [427, 930, 452, 1112] |
| ship-hatch-tre (hard) | 360 Flip the Hatches | `trick`, tricks ['360 Flip'], desc '360 flip from the first cargo hatch to the second', at [600, -40.3, 1215.7], go [600, -41.0, 1190, π], from [592, 1200, 608, 1214, -40.6, -40.0], to [592, 1217.5, 608, 1231.5, -40.6, -40.0] |
| ship-pa-crook (hard) | Crooked the Authority Rail | `grind`, rail 'Handrail', grind 'Crooked\|Overcrook', desc 'Crooked grind (or overcrook) a Port Authority handrail', at [123.55, -39.2, 989], go [140, -39.75, 980, π], area [122.5, 987.5, 157.5, 990.5] |

Each part registers its own challenges: west (pa-kf, pa-crook), bays (bay-line), yard (skyway-gap,
skyway-rail, gravel-speed, canyon) and quay (ship-rail, hatch-tre). index.js registers ship-score.

## 9. Tapes (5)

| tape | part | `P.tape(x, z, y)` |
|---|---|---|
| fish platform, east end | west | (196, 1133, -42.044) |
| Pilot Slip pontoon | bays | (529, 1189, -45.4) |
| under the Skyway | yard | (788, 951, -40.73) |
| Stack Run top | yard | (712, 1063.2, -39.775) |
| Corvina bow | quay | (600, 1333, -39.6) |

## 10. Traffic, peds, npcs (all in index.js)

**Traffic** (no car ever crosses x 593..607, so the bomb line is always clear):

* Loop W: `{path: [[250, 1020], [440, 1020], [440, 1120], [250, 1120]], lane: 3, dir: 1, n: 2, speed: 7, r: 6}`
  and the same with dir -1. It uses Net Loft Lane and Bay Lane; the lanes at x 437/443 miss the pads.
* Loop E: `{path: [[618, 1020], [936, 1020], [936, 1120], [618, 1120]], lane: 3, dir: 1, n: 2, speed: 7, r: 6}`
  and dir -1. It uses the yard entry lane (x 615/621) and the Skyway Approach (x 933/939).

**Peds**:

| where | path | n |
|---|---|---|
| fish market | `[[110, 1142], [196, 1142], [196, 1164], [110, 1164]]` | 6 |
| Port Authority forecourt | `[[108, 1002], [172, 1002], [172, 1008], [108, 1008]]` | 5 |
| Harbour Road west | `[[100, 1012], [240, 1012], [240, 1028], [100, 1028]]` | 6 |
| crane quay | `[[620, 1139], [940, 1139], [940, 1142], [620, 1142]]` | 5 |

**Npcs**:

* `{kind: 'loop', path: [[30, 932], [580, 932], [580, 936], [30, 936]], speed: 6}`, on Ropewalk Lane;
* `{kind: 'loop', path: [[24, 1100], [90, 1100], [90, 1140], [24, 1140]], speed: 5.5}`, on the west apron;
* `{kind: 'session', rail: [446, 942, 446, 960], start: 934, end: 966, back: 3, side: -1, speed: 5.4}`,
  on the C1 dock edge;
* `{kind: 'session', rail: [34, 1068, 54, 1068], start: 28, end: 60, back: 3, side: 1, speed: 5}`, on a
  Net Rack.

## 11. Fast travel

| name | kind | (x, y, z, yaw) | registered by |
|---|---|---|---|
| Shipyard East | 'district' | (600, -41.08, 980, π), on Gantry Road facing the sea | index.js |
| Skyway Stub | spot | (836, -30.5, 951, π/2) | yard |
| Loading Bay Row | spot | (440, -40.48, 936, π) | bays |
| The Corvina | spot | (600, -41.0, 1194, π) | quay |
| Slipway Skates | spot | (228, -41.75, 1006, 0) | west |
| Deckhand Skate Supply | spot | (588, -41.997, 1042, π/2) | bays |

---

## 12. Budget estimate

| item | estimate | budget |
|---|---|---|
| boxes | ~410 (containers 92, bollards ~70, streets/sidewalks ~45, docks/warehouses 24, fish market ~35, cranes 18 + tables 6, carriers 12, flatbeds/wagons/jerseys 20, pallets 10, Skyway 10, Corvina 9, PA ~14, misc ~45) | 900 |
| grind lines | ~470 (container 'ns' 184, flatbeds 36, docks 36, hatches/tables/windlass 44, street curbs ~40, quay edges 5, Skyway rails 4, sills 12, wagons 10, jerseys 12, pads 28, handrails/lips/racks/ship rails ~25, levellers 6, misc ~30) | 700 |
| K.building | 10 (+1 K.B 'building') | 70 |
| triangles added | ~90k (boxes ~6k, decor props ~1,200 × 12, paint strips ~250, trees/lamps, landmarks) | 450k |
| D.sign | 7 | 8 |
| fine ground | 0 m² (no P.region) | 60,000 m² |
| load time | ~0.4 s | 1.5 s |

---

## 13. Parts and files

Files in `levels/porto/ship/`:

| file | function | rect [x0, x1, z0, z1] | contents |
|---|---|---|---|
| ship_plan.js | `ship_plan()` | — | 2.2 constants and `Y`, `W`, `E`, `ground`; `kinks: [930, 1010, 1034, 1108, 1132, 1172]`; `y1`, `y2`; `PAL` (container palette); `col(x, z, h)` (returns a hex or null, per 2.3); `surface(x, z)`; and three helpers that take K: `paintZ(K, x0, x1, z0, z1, col)`, `walkZ(K, x0, x1, z0, z1, roadSide)` (3.2), `stack(K, x0, z0, n, len, color, edges)` (one container stack per 4.3) |
| ship_west.js | `ship_west(K, P, PL)` | [0, 256, 910, 1350] | 4.1 and the west parts of 3.2: Harbour Road and Quay Road x 96..244, Ropewalk Lane x 16..256, Net Loft Lane, Harbour Road paint x 0..96, Quay Walk, and the quay edge x 0..256 |
| ship_bays.js | `ship_bays(K, P, PL)` | [256, 589, 910, 1350] | 4.2: warehouses, all the docks, pads, Deckhand shop, Harbour Road and Quay Road x 256..589, Ropewalk Lane x 256..589, Bay Lane, bays apron, Pilot Slip |
| ship_yard.js | `ship_yard(K, P, PL)` | [589, 1000, 910, 1112] | 4.3: Gantry Road z 910..1112 (paint, sidewalks, lamps), Pallet Yard, Skyway, DIY, flatbeds, rail spur, Terminal 3, containers, Reefer Row, Harbour Road x 628..930, hill toe z < 1112 |
| ship_quay.js | `ship_quay(K, P, PL)` | [589, 1000, 1112, 1350] | 4.4: Gantry Road z 1112..1128, Quay Road x 628..930, carriers, cranes, tables, quay edge x 589..1000, Corvina, crane and Corvina landmarks, hill toe z ≥ 1112 |

`levels/porto/ship/index.js`:

```js
function porto_ship(K, P) {
  const PL = ship_plan();
  P.ground(PL.ground);                                  // first, before anything reads terrainH
  P.col((x, z, h) => { const c = PL.col(x, z, h); return c == null ? null : new THREE.Color(c); });
  P.surface(PL.surface);
  ship_west(K, P, PL); ship_bays(K, P, PL); ship_yard(K, P, PL); ship_quay(K, P, PL);
  P.travel('Shipyard East', 600, PL.Y(980), 980, Math.PI, 'district');
  // traffic, peds, npcs (section 10) and the ship-score challenge (section 8)
}
```

Only index.js calls `P.ground`. Each part registers its own spots, travel points, challenges, tapes
and shops, and builds nothing outside its rect. A rail or hubba may end exactly on a rect edge.

---

## 14. Notes for the builders

* **Don't use** `K.containers` (it builds at absolute y 0..2.6) or `K.driveway` (absolute y 0.01).
  Use `PL.stack`.
* **Don't use** Bg-based builders (ledge, planter, pad, bench, jersey, lamp, tree, parkingBlock,
  dumpster) anywhere off the ground: on the Skyway deck, a container top, a dock, the Corvina or the
  terrace. Use K.B with the explicit y given in this doc.
* K.street works here only because the benches are flat in z. Don't put a K.street anywhere else.
* Paint on slopes uses `PL.paintZ` strips, and dashes use D.dash (it follows the slope). For x < 96
  everything is P.col plus dash.
* The gate corridors stay clear: nothing in x 592..608, z 910..926; x 0..16, z 1012..1028; or
  x 0..16, z 1144..1156. The only exception is paint.
* The ground under the quay face (z > 1180) is pushed to -46.6 or below. Don't build "land" past
  z 1180 except the pontoon, the Pilot Slip and the Corvina.

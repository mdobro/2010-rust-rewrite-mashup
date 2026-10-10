# Old Town (`old`): district design

Rectangle x -420..300, z 230..910. Neighbours: Financial Core (north, z 230), Eastside Hills
(east, x 300), the Arroyo (west, x -420), and Boardwalk West / Shipyard East (south, z 910).
Gates: **boulevard** (-40, 230) w 20 y -0.4, **crosstown** (300, 560) w 16 y -20.3,
**footbridge** (-420, 520) w 8 y -17.8, **steep** (-200, 910) w 16 y -40.2.

All world coordinates. "G(z)" is the street profile defined in section 2. Unless a number says
otherwise, every height given here was computed from the formulas in section 2. A builder can
check any of them with `K.terrainH(x, z)` at run time. Downhill is +z everywhere. Yaw: 0 faces -z,
`Math.PI` faces +z, `-Math.PI/2` faces +x, `Math.PI/2` faces -x (as in dt.js).

---

## 1. Concept

**A limewashed hill town that falls to the old harbour in four steps.** Old Town is the
Lisbon/Porto half of Porto Alto. It has whitewashed and ochre houses with terracotta roofs, blue
azulejo tile panels, and white calçada pavements with black wave patterns. A church tower is on the
skyline and an old sea gate stands at the top of the last steep drop. The ground is cobble
(warm grey 0x9a8d7b). Roads are asphalt (0x56585d), the same colour as K.street everywhere.
Pavements and squares are calçada white (0xd8d0bf). Stone is limestone (0xe9e1cf). Accents are
azulejo blue 0x3f6fa8, ochre 0xd9a441, terracotta 0xc0623f and pink plaster 0xd99a8c. Roofs are
0xa94f32.

**What sets it apart.** The other districts are flat plazas cut into a slope. Old Town is a
**stepped city**:

- Three cross streets sit on flat **benches**: Crosstown at -19.45, the Terrace at -30.37 and the
  Harbour Wall at -39.40.
- Every north–south street, alley and stairway runs downhill between them.
- The spots are what an old hill town really has. There are church steps, a stepped market,
  loading platforms down a tile works, a public wash house with drained basins, a convent double
  set, a lookout wall, a steep street with a pedestrian handrail, fishermen's stairs, and
  backyard pools on terraced lots.
- Nothing is a skatepark.
- The 594 m Old Wall runs the whole west edge at a steady 6 % slope, as one sloped ledge.

**How it serves the routes.**

- The **boulevard gate** feeds the Grand Boulevard and its Rambla median down to Fountain Square.
- From the square, three ways lead down:
  - Market Street, through the market.
  - The Steep, past the Sea Gate.
  - Lantern Street, past the pool houses.
- All three meet Crosstown (to the **crosstown gate**), the Terrace and the Harbour Wall Road.
- From there the Steep drops through the **steep gate** to the boardwalk.
- The **footbridge gate** enters on Footbridge Lane, a level lane from the Arroyo bridge, and joins
  the Steep at the market.

**Sightlines.**

- From the boulevard gate, the Santa Brisa bell tower (34 m, x -173) stands to the right of the
  Rambla.
- From the square, the tower is behind you. The Sea Gate towers at the end of the Steep, and the
  sea beyond, show the way down.
- From the Terrace, the Miradouro looks over the harbour roofs to the boardwalk.

---

## 2. Height plan

### 2.1 Base, for reference

`portoBaseH` is linear in this district: `base(z) = -0.061538 * (z - 230)` for z 254..856, smoothed
outside that range.

| z | base |
|---|---|
| 230 | -0.44 |
| 242 | -0.886 |
| 520 | -17.85 |
| 560 | -20.31 |
| 898 | -40.054 |
| 910 | -40.20 |

The district falls 40 m over 680 m, an average of 6.1 %.

### 2.2 The street profile G(z)

G is a polyline through these knots with parabolic fillets (written in `old_plan`):

```js
const KN = [[242,-0.886],[400,-11.95],[470,-14.40],[542,-19.45],[578,-19.45],
            [734,-30.37],[776,-30.37],[854,-39.40],[886,-39.40],[898,-40.054]];
const FR = [0, 8, 8, 8, 8, 8, 12, 10, 6, 0];   // fillet half-length at each knot
function Gk(z) {                                // only for 242 < z < 898
  let i = 1; while (z > KN[i][0]) i++;
  const [za, ha] = KN[i - 1], [zb, hb] = KN[i];
  let v = ha + (hb - ha) * (z - za) / (zb - za);
  for (let k = 1; k < KN.length - 1; k++) {
    const r = FR[k], d = Math.abs(z - KN[k][0]);
    if (d < r) {
      const s1 = (KN[k][1] - KN[k-1][1]) / (KN[k][0] - KN[k-1][0]);
      const s2 = (KN[k+1][1] - KN[k][1]) / (KN[k+1][0] - KN[k][0]);
      v += (s2 - s1) / (4 * r) * (r - d) ** 2;
    }
  }
  return v;
}
```

**Segments** (straight between fillets):

| z | slope | what |
|---|---|---|
| 242..400 | -7.00 % | the Upper Town: Grand Boulevard, Bishop's Steps, Tile Works |
| 400..470 | -3.50 % | Fountain Square |
| 470..542 | -7.01 % | the market |
| 542..578 | 0 | **Crosstown bench**, -19.45 |
| 578..734 | -7.00 % | convent, wash house, Clock Square |
| 734..776 | 0 | **Terrace bench**, -30.37 |
| 776..854 | -11.58 % | **the Steep**, the hill bomb |
| 854..886 | 0 | **Harbour bench**, -39.40 |
| 886..898 | -5.45 % | down to base |

**Reference values of G** (from the formula; use these for the builds):

| z | G | z | G | z | G | z | G |
|---|---|---|---|---|---|---|---|
| 250 | -1.45 | 400 | -11.88 | 514 | -17.49 | 742..764 | -30.37 |
| 262 | -2.29 | 404 | -12.07 | 534 | -18.89 | 776 | -30.72 |
| 274 | -3.13 | 410 | -12.30 | 539 | -19.19 | 788 | -31.76 |
| 300 | -4.95 | 418 | -12.58 | 546 | -19.42 | 795 | -32.57 |
| 326 | -6.77 | 430 | -13.00 | 550..570 | -19.45 | 800 | -33.15 |
| 330 | -7.05 | 432 | -13.07 | 586 | -20.01 | 816 | -35.00 |
| 358 | -9.01 | 446 | -13.56 | 600 | -20.99 | 832 | -36.85 |
| 360 | -9.15 | 470 | -14.47 | 604 | -21.27 | 844 | -38.24 |
| 380 | -10.55 | 474 | -14.70 | 608 | -21.55 | 854 | -39.11 |
| 384 | -10.83 | 480 | -15.10 | 642 | -23.93 | 860 | -39.35 |
| 390 | -11.25 | 494 | -16.08 | 650 | -24.49 | 864..880 | -39.40 |
| 392 | -11.39 | 498 | -16.36 | 660 | -25.19 | 888 | -39.55 |
| | | | | 668 | -25.75 | 898 | -40.05 |

On the straight parts, G is exactly linear. For example, z 262..390 is
`G = -0.886 - 0.070025 (z - 242)`, and z 788..844 is `G = -30.37 - 0.11577 (z - 776)`.

### 2.3 `O.ground(x, z, base)` (old_plan, passed to `P.ground`)

```
ss(t)  = t<=0 ? 0 : t>=1 ? 1 : t*t*(3-2t)
Wx(x)  = 1 for -332 <= x <= 212; ss((x+408)/76) for x < -332; ss((288-x)/76) for x > 212
         (so 0 at x <= -408 and x >= 288)
gen(x,z,base) = (z <= 242 || z >= 898) ? base : base + Wx(x) * (Gk(z) - base)
```

D = G − base stays within -0.1..+2.9 m, so the flank tapers (76 m wide) are never steeper in x than
5.7 %. West of x -408, east of x 288, north of z 242 and south of z 898, the ground is the base
height. That covers all four bands and every gate. The engine blends the band again on top, which
is harmless.

**Level lanes.** Each lane is flat in z across a strip: `{x0, x1, zc, hw, bl, fW, fE}`. Here
`baseZ(z)` is the base at z (base depends only on z, so `O = old_plan(P.baseH)` uses
`baseH(0, z)`).

```
L  = gen(x, zc, baseZ(zc))                         // the lane's level at this x
dz = |z - zc|;  wz = dz <= hw ? 1 : 1 - ss((dz - hw) / bl)
wx = 1 inside [x0+fW, x1-fE]; ss((x-x0)/fW) toward x0 and ss((x1-x)/fE) toward x1
     (fW = 0 or fE = 0: no fade, the lane runs into the band); 0 outside [x0, x1]
h  = lerp(h, L, wz * wx)
```

| lane | x0 | x1 | zc | hw | bl | fW | fE | level |
|---|---|---|---|---|---|---|---|---|
| Alto Walk | -340 | 220 | 250 | 4 | 6 | 8 | 8 | -1.45 on x -332..212 |
| Footbridge Lane | -420 | -212 | 520 | 4 | 6 | 0 | 8 | -17.85 at x -420, -17.91 at x -332..-220 |
| Lemon Lane | -25 | 92 | 420 | 4 | 6 | 6 | 6 | -12.65 on x -19..86 |
| Clock Lane | -192 | -48 | 660 | 4 | 6 | 6 | 6 | -25.19 on x -186..-54 |
| Crosstown East | 204 | 300 | 560 | 8 | 6 | 8 | 0 | -19.45 at x 212, falling to -20.31 at x 288 |

**Flats** come after the lanes, in this order. Each is `h = lerp(h, y, 1 - ss(d / bl))`, where d is
the distance outside the disk or rectangle (0 inside).

| flat | shape | bl | y | what sits on it |
|---|---|---|---|---|
| gull | disk (-150, 446) r 11 | 8 | -13.56 | Gull Fountain |
| lemon | disk (121, 425) r 8 | 7 | -12.82 | Lemon Square fountain |
| wash | rect x -160..-108, z 568..600 | 8 | -19.45 | Lavadouro basins; south side becomes the **Wash Bank** (2.1 m over 8 m) |
| clock | disk (-120, 660) r 9 | 8 | -25.19 | Clock Square |
| lotA | rect x 146..194, z 784..806 | 6 | -32.57 | Pool Row lot A |
| lotB | rect x 146..194, z 820..844 | 6 | -36.85 | Pool Row lot B |

No flat or lane reaches any N–S street, so street sidewalks only follow G. The one exception is
the Alto Walk on the Grand Boulevard, z 240..260. Every N–S street lies in the Wx = 1 strip.

### 2.4 Fine ground: `O.regions`, each `[x0, x1, z0, z1, 2]`

| region | x | z | m² |
|---|---|---|---|
| Alto Walk | -340..220 | 240..260 | 11,200 |
| Footbridge Lane | -420..-212 | 510..530 | 4,160 |
| Lemon Lane | -25..92 | 410..430 | 2,340 |
| Clock Lane | -192..-48 | 650..670 | 2,880 |
| Crosstown East | 204..300 | 546..574 | 2,688 |
| gull | -170..-130 | 426..466 | 1,600 |
| lemon | 106..136 | 410..440 | 900 |
| wash + bank | -168..-100 | 560..608 | 3,264 |
| clock | -137..-103 | 643..677 | 1,156 |
| pool lots + banks | 140..200 | 778..850 | 4,320 |

The total is about 34,500 m², or roughly 42,000 m² after the 8 m snap. That is under 60,000.

G itself needs no fine ground. Its tightest fillet (r 8 at 0.07 slope change) leaves under 5 cm of
error on an 8 m chord. If the sink scan disagrees, add `[-420, 300, 534, 586, 4]` and
`[-420, 300, 726, 788, 4]`, which are cheap at res 4. The pools and bowls draw their own fine
ground.

### 2.5 `O.col(x, z, h)` and `O.surface(x, z)`

Make the THREE.Color objects once, in old_plan. The ground is drawn on an 8 m grid, so colours
blur over 8 m. Road rectangles are therefore 4 m wider than the street plus sidewalks; the extra
lies under the sidewalks and the building fronts.

**Asphalt 0x56585d** (sloped streets, where K.street can't be used):

| street | x | z |
|---|---|---|
| Grand Boulevard | -59..-21 | 230..400 |
| Market St | -52..-28 | 470..742 |
| The Steep | -212..-188 | 470..910 |
| Lantern St | 108..132 | 446..880 |
| Rampart St | -332..-308 | 568..880 |
| Crosstown east flank | 204..300 | 551..569 |

**Calçada 0xd8d0bf** (white pavement):

- Fountain Square x -230..-25, z 400..470
- Lemon Square x 92..150, z 404..446
- Alto Walk x -332..212, z 246..254
- Clock Square: disk (-120, 660) r 12
- Miradouro promenade x -328..128, z 756..764
- Rambla median x -43..-37, z 262..390 (also covered by its hubba)

**Grass 0x6f8f4a**, which is also 'rough' in `O.surface`:

- Wash Green x -160..-108, z 606..650
- Pool lots x 146..194, z 784..806 and 820..844, except within 4 m of a pool centre (the pools
  colour themselves)
- Lot banks x 140..200, z 806..820 and 844..850
- West verge x -420..-404, except Footbridge Lane z 514..526

**Everything else is cobble 0x9a8d7b**, which is smooth. Never return null inside the rectangle.

The surface is 'rough' only on the grass areas above, and null everywhere else.

---

## 3. Layout

```
x: -420     -320  -260   -200     -120     -40       40    120        200       300
z 230 ======================== band ==== [boulevard gate] ===========================
z 250 ...........ALTO WALK (level -1.45, slappy curbs).................. 
      |OLD   |R |  |S|  houses |Bishop|Bell|  GB  |  |T|TILE |  houses    |  houses |
      |WALL  |o |  |a|  Bishop's|Steps |All| Rambla|  |W| WORKS|           |         |
      |ledge |p |  |d|  Palace |  |   |ey |median |  |A| P0..P8          |         |
      |(6%)  |e |  |d|   NAVE+TOWER  |   |      |Shop1|l|loading|         |         |
z 358 |      |W |  |l| [SANTA BRISA TERRACE -9.0]|Cafe|  |l|platforms          |         |
z 400 |      |a |  |e|  Brisa Steps 10 | deck |    |e|     |LEMON SQ+ Cafe Steps   |
      |      |l |  |r|  FOUNTAIN SQUARE (3.5%) Gull Fountain | LEMON LANE->| houses |
z 470 |      |k |  | |  The Steep  MARKET TIERS T1 | Market St | MARKET HALL | Lantern St
z 520 =FOOTBRIDGE LANE (level -17.9)=> |  T2 T3     |           |   docks     |  |
z 560 ======== CROSSTOWN (bench -19.45) ======================================> crosstown gate
      |      |Rampart| Convent |  | LAVADOURO basins |           |  houses   |  |
      |      |  St   | terrace |  | Wash Bank/Green  |  Market St|  Tile     |  |
z 642 |      |       | double set | CLOCK SQ / Clock Lane / Seminary Wall |Ledges|  |
      |      |       | Convent Ln |  |                |           |           |  |
z 750 ======== THE TERRACE (bench -30.37)  MIRADOURO wall  [SEA GATE] ======|  |
z 776 |      |       | houses  |STEEP| houses | Fishermen's Stairs | houses |POOL ROW|
      |      |       |         |11.6%| Steep St Skates | landings  |        | lots A,B |
z 872 ======== HARBOUR WALL RD (bench -39.40), docks, sea wall ledge ========|  |
z 910 ======================== band ==== [steep gate x -200] ========================
```

### 3.1 Street and path network

**North–south streets on G (sloped).** These are not built with K.street: the asphalt comes from
P.col, the sidewalks are hubba pieces (section 3.3), and the centre lines are `K.dash` dashes of
3 m every 6 m. A dash follows the ground at both ends, so it is fine on the slopes.

| street | road x | sidewalks x | z | notes |
|---|---|---|---|---|
| **Grand Boulevard** (GB) | -50..-30 (2 × 7 m lanes + median) | -55..-50, -30..-25 | 230.5..400 | Rambla median x -43..-37, z 262..390; ends at Fountain Square |
| **Market Street** | -45..-35 | -48..-45, -35..-32 | 470..552, 568..742 | through the market to the Terrace |
| **The Steep** | -205..-195 | -208..-205, -195..-192 | 470..552, 568..742, 758..864, 880..894 | the spine: square to steep gate |
| **Lantern Street** | 115..125 | 112..115, 125..128 | 446..552, 568..742, 758..864 | from Lemon Square to the harbour |
| **Rampart Street** | -325..-315 | -328..-325, -315..-312 | 568..742, 758..864 | west street, convent to harbour |

Sidewalk z ranges stop 8 m either side of each bench street's centre: at 552/568, 742/758 and
864/880. That matches the K.street sidewalk cuts at ±(rw+sw) = ±8 m, so the corner squares are open
road and nothing overlaps.

**East–west streets on the benches (flat).** These use K.street, rw 5 and sw 3 (road 10 m,
sidewalks 3 m):

- **Crosstown**:
  `K.street('x', 560, -328, 212, -19.45, [-320, -200, -40, 120], { rw: 5, sw: 3, lamps: false })`
  - The **east flank** x 212..300 is custom. Its asphalt comes from P.col. Its sidewalks are hubba
    pieces along x at z 552..555 and 565..568, from x 212 to 296, with top = terrainH + 0.15 at
    each 8 m break (the ground falls 0.86 m in x).
  - Its centre line is K.dash.
- **Terrace Road**:
  `K.street('x', 750, -328, 128, -30.37, [-320, -200, -40, 120], { rw: 5, sw: 3 })`
  - There is no Market St continuation south of 742. The -40 crossing just makes a curb cut where
    Fishermen's Stairs leave.
- **Harbour Wall Road**:
  `K.street('x', 872, -328, 128, -39.40, [-320, -200, -40, 120], { rw: 5, sw: 3 })`

**Level lanes, paths and alleys** (cobble, no sidewalks):

| name | x | z | ground | notes |
|---|---|---|---|---|
| **Alto Walk** | -332..212 | 246..254 | level -1.45 | promenade under the north band; slappy curbs |
| **Footbridge Lane** | -420..-208 | 516..524 | level -17.85..-17.91 | from the footbridge gate to the Steep's west sidewalk |
| **Rope Walk** | -323..-317 | 254..516 | G (7 %) | path from the Alto Walk to Footbridge Lane |
| **Rampart Alley** | -326..-314 | 524..552 | G | Footbridge Lane to Crosstown; continues as Rampart St |
| **Saddler's Alley** | -263..-257 | 254..516 | G | |
| **Bell Alley** | -90..-84 | 254..400 | G | along the church terrace's east face |
| **Tile Works Alley** | 36..44 | 250..412 | G | beside the Loading Steps; ends in Lemon Lane |
| **Lemon Lane** | -25..92 | 416..424 | level -12.65 | from the square to Lemon Square |
| **Convent Lane** | -266..-254 | 650..742 | G | from the foot of the convent double set to the Terrace |
| **Clock Lane** | -192..-48 | 656..664 | level -25.19 | from the Steep to Market St, through Clock Square |
| **Wall Walk** | -401.8..-392 | 256..850 | ground (≈ base) | inside the Old Wall |

### 3.2 How each gate is reached

- **boulevard (-40, 230), w 20, y -0.4.**
  - The GB road x -50..-30 (20 m) runs straight north into fin's boulevard at the same x, at the
    base height in the band (z 230..242). Then it crosses the level Alto Walk (-1.45) and descends
    at 7 % to the square.
  - The corridor x -50..-30, z 230..246 is clear: the median starts at z 262, and the Alto Walk
    curbs stop at x -57 and -23.
  - Riding in from fin is a downhill run. Riding out to fin is an uphill push of about 1 m.
- **crosstown (300, 560), w 16, y -20.3.**
  - Crosstown is road z 555..565 with sidewalks 552..555 and 565..568, 16 m in all.
  - It is flat at -19.45 to x 212, then falls 0.86 m over 76 m (under 1.7 %) to -20.31 at x 288.
    It is base in the band.
  - The corridor x 284..300 holds only 0.15 m sidewalks, which stop at x 296.
- **footbridge (-420, 520), w 8, y -17.8.**
  - Footbridge Lane z 516..524 is level at the base (-17.85) at the border. It is -17.91 inside,
    which is flat in z and rolls 6 cm in x.
  - It is open from x -420 to the Steep. The Old Wall has a gap at z 506..534, and the Wall Walk
    crosses the lane at grade.
- **steep (-200, 910), w 16, y -40.2.**
  - The Steep road and sidewalks (x -208..-192) leave the Harbour bench (-39.40 at z 880), follow G
    to -40.05 at z 898, and are base to the border.
  - The sidewalks stop at z 894. The sea-wall ledge has a gap at x -208..-192, and the bollards keep
    clear of x -210..-190.
  - The corridor z 894..910 is clear.

### 3.3 Sidewalks on sloped ground (shared helper)

`old_walk(K, O, x0, x1, z0, z1)` in old_plan.js lays one N–S sidewalk strip:

- **Pieces.** Hubbas `{ a: V(xc, top(z_i), z_i), b: V(xc, top(z_{i+1}), z_{i+1}), w: x1 - x0,
  noRails: true, color: 0xd8d0bf }`, where `top(z) = K.terrainH(xc, z) + 0.15`. a is always the
  upper end, which is the smaller z.
- **Breakpoints z_i**, from `O.breaks` clipped to [z0, z1]:
  - 230.5, 242 and 898
  - for every knot with a fillet: zk − r, zk − r/2, zk, zk + r/2, zk + r
  - every 2 m in z 240..262 (Alto Walk), only for the GB
  - extra breaks every 40 m on straights, to keep the drawn length sane

  That is about 14 pieces per strip per part.
- **Curb rail.** One `K.rail(xe, top(z0), z0, xe, top(z1), z1, 'Curb', false)` per straight run,
  along the road-side top edge (xe = the road-side x). Break it at each fillet, so a curb line is
  straight between fillet breakpoints.
- **Chamfered ends.** At each sidewalk end facing a crossing or lane mouth, add a curb ramp: a
  hubba `{ a: V(xc, top(z_end), z_end), b: V(xc, K.terrainH(xc, z_end ± 1.2) + 0.02, z_end ± 1.2),
  w, noRails: true, color: 0xd8d0bf }` running into the crossing. The road side is never a step
  over 0.15 m.

Bg furniture on a sidewalk reads the ground, not the hubba. Add 0.15 to any height meant to stand
above the sidewalk; this applies to K.street sidewalks too.

`old_slopeLedge(K, x0, x1, z0, z1, hgt, color, railX)` makes a sloped ledge along z: a noRails hubba
of width x1 − x0, top = terrainH + hgt at both ends, plus a `K.rail(railX, ..., 'Ledge', false)`
along the given top edge. It serves the Rambla, the Tile Ledges, the arcade plinth and the Old
Wall.

---

## 4. Spots (summary; details in the part sections)

| spot | where | ground | kit | run-up / roll-away |
|---|---|---|---|---|
| Rambla median ledges | x -43..-37, z 262..390 | G, 7 % straight | old_slopeLedge × 6 | 12 m from the Alto Walk / 10 m to the square |
| Alto Walk slappies | z 254.0..254.4 | level -1.45 | `K.B` 'curb' | the whole walk |
| Bishop's Steps | x -128..-120 (+ ramp lane -120..-115), z 254..358 | -1.45 → -9.0 | `K.stairSpot` × 4 + 4 landings | Alto Walk / church terrace |
| Santa Brisa terrace, Brisa 10, Brisa Bank, Brisa Drop | x -190..-90, z 358..400, top -9.0 | square below | `K.B`, `K.stairSpot`, hubba | 28 m terrace / 34 m to the fountain |
| Cafe Gaivota deck | x -84..-57, z 384..400, top -10.75 | 1.13 m drop | `K.B`, `K.SET` | Bell Alley / square |
| Gull Fountain | (-150, 446), bowl r 6 d 1.5, 16 m wall | flat -13.56 | `K.fountainBowl`, `K.ledge` | square, all sides |
| Tile Works Loading Steps | x 44..47, z 262..390 | 9 platforms | `K.B` | Alto Walk / Lemon Lane |
| Lemon Square fountain + Cafe Steps | (121, 425) r 4.5 d 1.1; decks x 150..190 | flat -12.82 | `K.fountainBowl`, `K.B` | Lemon Lane / Lantern St |
| Market Tiers | x -190..-50, z 474..534 | 3 tiers, 1.4 m drops | `K.B`, `K.stairSpot`, hubbas | square / Crosstown |
| Market Docks | x -24..48, z 546..551 | bench | `K.B` 'garage' | Market St / Crosstown |
| Lavadouro basins + Wash Bank | x -160..-108, z 568..608 | flat -19.45 | `K.pool` | Crosstown / Wash Green |
| Convent double set | x -270..-250, z 642..650 | -21.27 → -24.49 | `K.stairSpot` × 2 | 38 m terrace / Convent Lane 92 m |
| Clock Square + Seminary Wall | (-120, 660); x -180..-136 | level -25.19 | `K.Bg`, `K.bench` | Clock Lane both ways |
| Tile Ledges | x 126.2..126.8, z 600..692 | G 7 % | old_slopeLedge × 2 | Lantern St |
| Miradouro wall | z 763.5..764.1 | flat -30.37 | `K.Bg` 'ledge' | the Terrace |
| The Steep + Steep Rail | x -205.4, z 788..844 | 11.6 % | `K.rail` 'Handrail' | Terrace / Harbour bench |
| Fishermen's Stairs | x -46..-38 (+ ramp lane -36..-32), z 764..864 | 5 flights | `K.stairSpot` × 5 + 5 landings | Terrace / Harbour Wall Rd |
| Pool Row | lots x 146..194, z 784..806 and 820..844 | flats | `K.backyardPool` × 2 | Lantern St |
| Harbour docks + sea wall | z 860..864; z 880.5..881.1 | bench -39.40 | `K.B`, `K.Bg` | Harbour Wall Rd |
| Old Wall | x -403..-401.8, z 256..850 | ≈ base, 6.15 % | old_slopeLedge × 4 | Wall Walk |

---

## 5. Lines (3–5 chainable)

1. **Santa Brisa Run** (about 45 s, upper to market).
   - Alto Walk slappies.
   - Bishop's Steps: drop the landing ledges into the ramp lane, or ride the stairs.
   - Across the church terrace: Brisa 10 handrail, the Brisa hubbas, or the Brisa Bank.
   - Fountain Square: the Gull Fountain wall, then through a wall gap into the bowl and out.
   - South off the square onto Market Tier 1, drop T1 → T2 → T3, then the docks along Crosstown.
2. **Tile Works to Pool Row** (about 50 s, east side).
   - Alto Walk east.
   - Tile Works Alley, gapping the nine Loading Steps platform to platform, or the drops beside
     them.
   - Lemon Lane, then the Lemon Square bowl, then the three Cafe Steps decks.
   - Bomb Lantern St and grind the blue Tile Ledges.
   - Cross the Terrace, then down Lantern into the Pool Row backyard pools.
3. **Rambla to the Sea** (about 60 s, the spine).
   - Fin's boulevard into the three Rambla ledges.
   - Cafe Gaivota deck: manual, then the drop.
   - Market St, then Crosstown ledges.
   - Market St to the Terrace: the Miradouro wall.
   - Fishermen's Stairs: rails and landing ledges.
   - The Harbour Wall Rd dock gaps and the sea-wall ledge, then out the steep gate.
4. **Rampart Run** (about 50 s, west).
   - Rope Walk to Footbridge Lane (or in from the footbridge gate).
   - Rampart Alley, then Crosstown.
   - Down to the convent terrace: the double set or the 2.7 m side ledges.
   - Convent Lane, then the Miradouro wall.
   - The Steep with the Steep Rail, then the Harbour bench.
   - The Old Wall (594 m) is the alternative straight down the west edge.
5. **Wash and Clock** (about 30 s).
   - Crosstown into the Lavadouro basins.
   - Up the Wash Bank and down the Wash Green.
   - Clock Square plinth, then the Seminary Wall.
   - Clock Lane onto the Steep.

---

## 6. Parts, file ownership and call order

| part | file | fn | rect (x0, x1, z0, z1) | content |
|---|---|---|---|---|
| plan | `levels/porto/old/old_plan.js` | `old_plan(baseH)` + helpers | — | profile, ground, colours, regions, breaks, `old_walk`, `old_slopeLedge`, `old_curbRamp` |
| upper | `levels/porto/old/old_upper.js` | `old_upper(K, P)` | -420, 300, 230, 470 | Alto Walk, GB, church, square, Tile Works, Lemon Square, Shop 1 |
| market | `levels/porto/old/old_market.js` | `old_market(K, P)` | -420, 300, 470, 742 | tiers, hall, Crosstown, Lavadouro, convent, Clock Square, Lantern mid |
| harbour | `levels/porto/old/old_harbour.js` | `old_harbour(K, P)` | -420, 300, 742, 910 | Terrace, Sea Gate, the Steep, Fishermen's, Pool Row, Harbour Wall, Shop 2 |

**`old_plan(baseH)` returns:**

- `KN`, `FR`, `Gk(z)`, `Wx(x)`, `gen(x, z, base)`, `baseZ(z)`
- `lanes`, `flats`, `ground(x, z, base)`, `col(x, z, h)`, `surface(x, z)`, `regions`, `breaks`
- `Y`: `{ walk: -1.45, brisa: -9.0, gull: -13.56, lemon: -12.82, crosstown: -19.45, wash: -19.45,
  convent: -21.27, clock: -25.19, terrace: -30.37, harbour: -39.40, lotA: -32.57, lotB: -36.85 }`
- the helper functions above

All constants live inside the function.

**`levels/porto/old/index.js`, `porto_old(K, P)`, in order:**

1. `const O = old_plan(P.baseH);`
2. `P.ground(O.ground); P.col(O.col); P.surface(O.surface);`
3. `for (const r of O.regions) P.region(...r);`
4. `old_upper(K, P); old_market(K, P); old_harbour(K, P);`
5. Traffic, peds and NPCs (section 10.3).
6. `P.travel('Old Town', ...)`, the district point.
7. The two `P.landmark` calls (section 11).

Each part does its own `P.spot`, `P.challenge`, `P.tape`, `P.shop` and 'spot' travel.

**Ownership of long things.** A strip is built by the part whose rect holds it. The helpers clip at
z 470 and 742, so a part never builds outside its rect:

- **The Steep:** market builds z 470..552 and 568..742. Harbour builds 758..864 and 880..894.
- **Lantern:** upper owns nothing of it (it starts at z 446, inside upper's rect, but upper only
  builds 446..470; market does 470..552 and 568..742; harbour does 758..864).
- **Old Wall pieces:** [256, 468] upper, [472, 506] and [534, 738] market, [746, 850] harbour.

---

## 7. Part: `old_upper` (x -420..300, z 230..470)

### 7.1 Alto Walk (z 246..254, level -1.45)

- A calçada promenade (P.col).
- **Slappy curbs:** `K.B(x0, -1.85, 254.0, x1, -1.25, 254.4, 'curb', { edges: 'ns' })`, 0.2 m tall,
  in four runs:
  - x -315..-266
  - x -254..-131
  - x -112..-93
  - x -20..33 and x 47..206, as one run broken around the Tile Works Alley mouth x 34..46
- Planters, 0.55 tall: `K.planter`, 3 × 1.5 m, at x -300, -200, -100, 100 and 180, with z 247..248.5.
- **Benches,** facing south: `K.bench(x, 252.4, x + 2.4, 253)` at x -280, -160, 60 and 150.
- **Lamps:** `K.lamp(x, 247, 1)` every 32 m from x -320 to 208, skipping x -60..-20 (the GB) and
  the alley mouths.
- **Gaps** in the curbs for the GB (x -57..-23), Rope Walk, Saddler's, Bishop's, Bell Alley and
  Tile Works Alley.

### 7.2 Grand Boulevard (x -55..-25, z 230.5..400)

- Sidewalks: `old_walk(-55, -50, 230.5, 400)` and `old_walk(-30, -25, 230.5, 400)`. They end at z
  400 with curb ramps into the square.
- Centre dashes: only in z 230..262. The median takes over from there.
- **Rambla median** (x -43..-37), 3 segments: z 262..300, 304..344 and 348..390. Pedestrian
  crossings at z 300..304 and 344..348.
  - The deck is a noRails hubba w 6, centre x -40, top = G + 0.15, colour 0xd8d0bf.
  - The two edge ledges are `old_slopeLedge(-43, -42.4, z0, z1, 0.45, 0xe9e1cf, -43)` and
    `old_slopeLedge(-37.6, -37, z0, z1, 0.45, 0xe9e1cf, -37)`. They are 0.45 m over the road and
    0.30 m over the deck.
  - Heights at the ends follow `G = -0.886 - 0.070025 (z - 242)`. For example, the ledge top at
    z 262 is -1.84, and at z 390 it is -10.80.
  - Trees on the deck centre at z 270, 286, 312, 328, 356 and 372: `K.tree(-40, z)`.
- Shop 1 is on the east sidewalk (section 7.9).
- Lamps on the outer sidewalk edges every 32 m: `K.lamp(-54.2, z, 1)` and `K.lamp(-25.8, z, -1)`,
  at z 270 + 32k.
- The trees on the outer sidewalks are skipped, so the shop front stays clear.

### 7.3 Bishop's Steps (x -128..-120; ramp lane x -120..-115; z 254..358)

These are a stepped walk down the 7 % hill to the church terrace. The ramp lane beside it is just
the cobbled ground at 7 %. Every landing is a flat box that ends standing up to 1.7 m above the
lane, so its east edge is a ledge drop into the lane.

Each flight is `K.stairSpot('z', at, 1, -128, -120, top, bottom, 6, 0.4, { rails: [-124] })`: 6
drops of 0.315, run 2.0, foot at at + 2.0.

| flight | at (top edge) | top | bottom | foot z | landing after it (box x -128..-120) |
|---|---|---|---|---|---|
| — | — | — | — | — | L0: z 254..275.01, top -1.45 |
| F1 | 275.01 | -1.450 | -3.337 | 277.01 | L1: z 277.01..301.96, top -3.337 |
| F2 | 301.96 | -3.337 | -5.225 | 303.96 | L2: z 303.96..328.92, top -5.225 |
| F3 | 328.92 | -5.225 | -7.112 | 330.92 | L3: z 330.92..355.87, top -7.112 |
| F4 | 355.87 | -7.112 | -9.000 | 357.87 | onto the church terrace (top -9.0 from z 357.87) |

- Each landing is `K.B(-128, Gmin - 0.5, za, -120, top, zb, 'step', { edges: 'e', color: 0xd8d0bf })`,
  where Gmin = G(zb).
- Each landing's foot touches the ground at za, and it stands about 1.7 m above the lane at zb.
- The handrail is in the middle of each flight (x -124).
- West of x -128 is the Bishop's Palace wall (U14).

### 7.4 Santa Brisa church and terrace (x -190..-90, z 358..400, top -9.0)

**Terrace.** `K.B(-190, -12.4, 357.87, -90, -9.0, 400, 'plaza', { edges: 'sew', color: 0xe9e1cf })`.

- The north edge is flush with G(358) = -9.01. You roll on from the north (x -190..-164 and
  -136..-90), from the Bishop's Steps and from Bell Alley.
- The east face along Bell Alley rises from 0 to 2.88 m.
- The south face is 2.88 m above the square (G(400) = -11.88): that is the **Brisa Drop**.

**Santa Brisa 10.**
`K.stairSpot('z', 400, 1, -160, -140, -9.0, -12.05, 10, 0.4, { rails: [-150], hubbas: [-160.4, -139.6] })`.

- Rise 0.305, run 3.6, foot at z 403.6, where G = -12.05.
- The centre handrail is at x -150, 0.58 m over the nosing. There is a hubba each side.
- 34 m of square roll toward the fountain.

**Brisa Bank.** A hubba `{ a: V(-181, -9.0, 400), b: V(-181, -12.28, 410), w: 14, noRails: true,
color: 0xc4bfb3 }`, at x -188..-174, about 33 %.

**Buildings.**

- Nave (U12): `K.building(-164, 326, -136, 372, 4, 0xe9e1cf, 'stone')`.
- Bell tower (U13): `K.building(-178, 360, -168, 370, 10, 0xe9e1cf, 'stone')`, which comes to 34 m
  above the terrace ground.

**Decor.**

- Gable `D.prop(-164, -9 + 13.6, 371.9, -136, -9 + 17, 372.1, 0xe9e1cf)`.
- Dome `D.add(sphere r 7, 0xc9b48a, [-150, -9 + 14, 340], , [1, 0.7, 1])` and a lantern cylinder on
  it.
- Spire cone on the tower at y 25..33 above the terrace.
- Rose window disc on the facade.

**Doors and dressing.**

- Door prop 3 × 5 m at x -150 on z 372.
- Sign SANTA BRISA (section 11).
- Two planters on the terrace at x -186..-182 and -98..-94, z 376..379.
- Four benches along z 390.

### 7.5 Fountain Square (x -230..-25, z 400..470, 3.5 %)

The square is calçada, with black wave decor: `K.dash` segments, colour 0x2b2b2b, w 0.4, along six
sine lines.

- Lines: z = zr + 1.2 sin(2π x / 9), with zr = 412, 422, 432, 456, 462 and 466.
- Segments of 1.5 m, x -222..-30, skipping the fountain wall and the cafe stair.

**Gull Fountain** at (-150, 446) on the gull flat (-13.56).

- `K.fountainBowl(-150, 446, 6, 1.5)`.
- **Wall:** four 0.6 m-wide `K.ledge(..., 0.45, 'ledge')` sides on the 16 × 16 square x -158..-142,
  z 438..454, each side split by a 3 m gap at its middle. That is 8 boxes:
  - North: x -158..-151.5 and -148.5..-142, z 438..438.6.
  - South: the same x at z 453.4..454.
  - West: x -158..-157.4, z 438..444.5 and 447.5..454.
  - East: x -142.6..-142 at the same z.
- The wall is grindable on the long edges.
- Deck ring between the wall and the bowl: 2 m.
- Decor: a gull sculpture `D.add` on a 3 m column prop at the bowl centre, top y -13.56 + 3.5. It is
  a prop, not a box, so it does not block the bowl.

**West Arcade** (x -230..-222, z 404..466).

- Colonnade: 11 pillars `K.B(x, ground - 0.3, z, x + 0.6, ground + 4, z + 0.6, 'plaza',
  { color: 0xe9e1cf })` at x -222.6, z 406 + 6k for k = 0..10.
- Roof `D.prop(-230, g + 4, 404, -222, g + 4.6, 466)`, with g = K.terrainH(-226, 435).
- Plinth ledge: `old_slopeLedge(-222.0, -221.4, 406, 466, 0.45, 0xe9e1cf, -221.4)`.
- Behind it is building U11.

**Furniture.**

- Six benches `K.bench` in two rows at z 418 and 432, x -210..-170 (pairs 2.4 × 0.6).
- Four planters with orange trees at (-200, 460), (-100, 460), (-70, 425) and (-110, 425):
  `K.planter` 2.4 × 2.4, plus `K.tree` in each.
- Lamps at the square corners and at (-150, 428) and (-150, 464).
- **Exits south:** Market St at x -45..-35, the Steep at x -205..-195, and the tiers. They are
  open: there is no furniture on z 462..470 at x -195..-32.

### 7.6 Cafe Gaivota deck (x -84..-57, z 384..400)

- The deck is `K.B(-84, -12.4, 384, -57, -10.75, 400, 'wood', { edges: 'sw', color: 0x8a6a4a })`.
  Its north edge is 8 cm over G(384), so you roll on from Bell Alley. Its south face is 1.13 m over
  the square.
- **Stair:** `K.SET('z', 400, 1, -74, -67, -10.75, -11.94, 4, 0.4)`, foot at z 401.2.
- Dressing:
  - Tables `K.picnic` × 3, on the deck at x -82..-76.
  - Awning prop over z 384..388 at y -10.75 + 2.4.
  - The sign CAFE GAIVOTA on the building U17 south face.
- The building U17 is x -81..-58, z 340..382.

### 7.7 Tile Works and the Loading Steps (x 36..96, z 250..412)

**Tile Works** (U20): `K.building(47, 258, 96, 404, 2, 0xa5553a, 'brick')`.

- Chimney: `D.add` cylinder r 1.6, 22 m, at (88, roof, 300).
- A saw-tooth roof as props.
- Sign AZULEJARIA NOVA on the west face at (46.95, G(300) + 5.5, 300, -Math.PI/2).

**The Loading Steps: 9 platforms** along the west face, x 44..47.

- Pk spans z0 = 262 + 14.5k to z0 + 12.
- Top = G(z0) + 0.25: -2.04, -3.05, -4.07, -5.08, -6.10, -7.11, -8.13, -9.14 and -10.16 for
  k = 0..8.
- Each is built as `K.B(44, G(z0 + 12) - 0.5, z0, 47, top, z0 + 12, 'garage', { edges: 'ws' })`.
- The north end is a 0.25 m step-up. The south end stands 1.09 m above the alley.
- The 2.5 m gaps each drop 1.02 m to the next platform: a gap-to-gap line.
- A dock bumper, `D.prop` metal 0.2 m, on each platform's west face.
- Roll-away: Tile Works Alley continues to Lemon Lane, at least 20 m beyond P8.

**Tile Works Alley** x 36..44, cobble. Dressing: pallets `K.pad(x, z, x + 1.2, z + 1.2, 0.18)` at
x 37..38.2, z 300, 340 and 372. Two dumpsters on the west side at z 280 and 356.

### 7.8 Lemon Square, Lemon Lane, Cafe Steps (x -25..190, z 404..446)

**Lemon Square** (x 92..150, z 404..446). The ground slopes 3.5 %, and the lemon flat is at -12.82
around the fountain.

- `K.fountainBowl(121, 425, 4.5, 1.1)`.
- Six lemon trees, `K.tree` at r 9 around it, at angles 30° + 60k, skipping where the lane meets.
- Benches `K.bench` at four sides, r 7.
- **Lemon Lane** (level, -12.65) joins at the west.

**Cafe Steps:** three wooden decks, x 150..190.

| deck | z | top |
|---|---|---|
| D1 | 404..418 | -11.97 |
| D2 | 418..432 | -12.48 |
| D3 | 432..446 | -12.97 |

- Each is `K.B(150, ground - 0.5, z0, 190, top, z1, 'wood', { edges: 's', color: 0x8a6a4a })`.
- Top = G(z0) + 0.1.
- Each south edge stands about 0.59 m over the ground. They make a manual-to-drop staircase down to
  Lantern St.
- Chairs and parasols are props. The building U22 is behind.

**Lantern St start** (x 112..128, z 446..470): `old_walk` for both sidewalks. The asphalt comes from
P.col. Upper builds only up to z 470.

### 7.9 Shop 1: "Tile & Truck" (GB east sidewalk)

The shop is in building U19 (x -25..33, z 336..396). The sidewalk top at z 360 is -9.0, which is
G(360) + 0.15.

```js
P.shop({ name: 'Tile & Truck', sign: [-25.04, -9.0 + 3.85, 360, -Math.PI / 2, 7],
  awning: [-26.6, 354, -25, 366, -9.0 + 2.2, 'x'], zone: [-28.2, 356, -25.2, 364], door: [-25.2, -9.0, 360] });
P.travel('Tile & Truck', -27.5, -9.0, 360, Math.PI / 2, 'spot');
```

Add a blue azulejo panel `D.plane` on the shop front.

### 7.10 Upper buildings

Each building has one collidable `K.building`. Facades get stepped `D.prop` cornices and a
terracotta roof prop (a 0.5 m slab at roof height, overhanging 0.4 m). Colours are picked from the
palette with K.pick. Floors are given in brackets.

- **U1–U5** (west hill, x -390..-336): z 262..300, 306..344, 350..388, 394..432 and 438..466, all
  [2]. The gaps between them are lanes down to the Wall Walk.
- **U6–U8** (x -314..-266): z 262..330, 336..404 and 410..466 [3].
- **U9–U10** (x -254..-196): z 262..320 and 326..396 [3].
- **U11** (x -254..-232, z 404..466) [3], behind the arcade.
- **U14** Bishop's Palace (x -190..-131, z 262..322) [3], stone.
- **U15** (x -112..-93, z 262..354) [3].
- **U16–U17** (x -81..-58): z 262..336 and 340..382 [3], the cafe.
- **U18–U19** (x -25..33): z 262..330 and 336..396 [3], the shop.
- **U21–U23**: x 100..146, z 262..398; x 152..208, z 262..398; and x 214..286, z 262..440. All [3],
  except U23 [2].
- **U24** Customs House (x -22..88, z 428..466) [2], ochre, south of Lemon Lane.

That makes 24 with U12, U13 and U20.

### 7.11 Old Wall, upper piece

`old_slopeLedge(-403, -401.8, 256, 468, 0.55, 0xc9bfa8, -401.8)`. The ledge is 1.2 m wide and
0.55 m tall. It sits on ground that is almost exactly the base (Wx ≈ 0.016 there), so it is a
straight 6.15 % ledge. Its rail is on the town-side edge.

- The Wall Walk inside it is cobble.
- Outside it is the rough grass verge.
- Crenellation `D.prop` blocks every 4 m on the arroyo-side half, x -403..-402.4, 0.4 m tall. They
  are props, so they are not hit, and the grindable town edge stays clean.

---

## 8. Part: `old_market` (x -420..300, z 470..742)

### 8.1 Market Tiers (x -190..-50, z 474..534)

Three calçada tiers. Each tier's north edge is 5 cm over the ground, so it rolls on, and each south
edge is a drop of about 1.4 m.

| tier | box | top |
|---|---|---|
| T1 | `K.B(-190, -16.6, 474, -50, -14.65, 494, 'plaza', { edges: 'swe', color: 0xd8d0bf })` | -14.65 |
| T2 | `K.B(-190, -18.0, 494, -50, -16.03, 514, ...)` | -16.03 |
| T3 | `K.B(-190, -19.4, 514, -50, -17.44, 534, ...)` | -17.44 |

**T1 → T2.**

- `K.stairSpot('z', 494, 1, -125, -115, -14.65, -16.03, 5, 0.4, { rails: [-120] })`.
- Bank: hubba `{ a: V(-177, -14.65, 494), b: V(-177, -16.01, 498), w: 10, noRails: true }`.

**T2 → T3.**

- `K.stairSpot('z', 514, 1, -85, -75, -16.03, -17.44, 5, 0.4, { rails: [-80] })`.
- Bank: `{ a: V(-61, -16.03, 514), b: V(-61, -17.42, 518), w: 10, noRails: true }`.

**T3 → ground.**

- `K.stairSpot('z', 534, 1, -125, -115, -17.44, -18.99, 5, 0.4, { rails: [-120] })`, foot at z
  535.6.
- Bank: `{ a: V(-177, -17.44, 534), b: V(-177, -19.15, 539), w: 10, noRails: true }`.
- From there, 16 m of roll to Crosstown.

**Stall tables**, 12 in all: `K.Bg(x, z, x + 3, z + 1.2, 0.8, 'wood', { edges: 'ns' })`.

- x = -170, -140, -100 and -66, at z = tier north edge + 6 (480, 500, 520).
- Leave x -127..-113 and the bank lanes clear.
- Striped canvas awnings as props, 2.4 m over each.

The west faces at x -190 stand over the Steep's east sidewalk (-195..-192), as 1.4 m ledges.

### 8.2 Market Hall and Market Docks

**Market Hall** (M1): `K.building(-28, 480, 52, 546, 2, 0xd9a441, 'stone')`.

- Clerestory roof prop.
- Sign MERCADO VELHO on the north face: `D.sign(..., 12, G(480) + 6.5, 479.9, ..., Math.PI)`, facing
  -z.
- Arched door props on the west face.

**Market Docks** along the south face, z 546..551, on the bench (-19.42..-19.45). Each is built as
`K.B(x0, -20.0, 546, x1, top, 551, 'garage', { edges: 'swe' })`.

| dock | x | top | height |
|---|---|---|---|
| 1 | -24..-4 | -18.45 | 1.0 m |
| 2 | 0..20 | -18.20 | 1.25 m |
| 3 | 24..48 | -18.55 | 0.9 m |

- 4 m gaps between them.
- Crates `K.pad` on dock 2.

**Market Street** sidewalks: `old_walk` for -48..-45 and -35..-32 over z 470..552 and 568..742.
Lamps every 32 m on the outer edges.

### 8.3 Crosstown (z 552..568, bench -19.45)

- The K.street call is in section 3.1. Then:
  - `K.lamp` every 32 m on both sidewalks, at z 553.2 and 566.8.
  - Trees only east of Lantern.
- **Crosstown ledges** on the south sidewalk: `K.ledge(-100, 566.0, -84, 566.6, 0.6, 'marble')` and
  `K.ledge(-78, 566.0, -62, 566.6, 0.6, 'marble')`. They are 0.45 m above the sidewalk top.
- Bus stop `K.busStop` at x 60 on the north side.
- **East flank** x 212..296 (section 3.1). Its sidewalk hubba pieces have 8 m breaks.
- Building faces line both sides.

### 8.4 Lavadouro, the wash house (x -160..-108, z 568..608)

**Basins:**

```js
K.pool(-146, -116, 579, 591, [[K.poolS.rect(-138, 585, 7, 5, 0.8), 1.3], [K.poolS.rect(-122, 585, 5, 5, 2.5), 1.9]], -19.45)
```

The two overlap at x -131..-127, which makes a channel. Coping comes from the pool.

- Shed: 4 pillars `K.B(x, -19.8, z, x + 0.5, -15.45, z + 0.5, 'plaza', { color: 0xe9e1cf })` at
  (-158, 570), (-110.5, 570), (-158, 597.5) and (-110.5, 597.5).
- Tiled roof prop x -160..-108, z 568..600, y -15.45..-15.0.
- Sign LAVADOURO on a board prop on the north fascia, facing -z.
- A stone wash-table `K.ledge` (0.5 tall) along z 593..593.8, x -150..-118. It is grindable.
- **Wash Bank:** the flat's south edge (z 600) falls 2.1 m to G(608) = -21.55 over the 8 m blend.
  It is cobble and smooth, and it rolls out onto the Wash Green.
- **Wash Green** x -160..-108, z 608..650: rough grass, two trees, and the roll-away to Clock
  Square.

### 8.5 Convent of the Roses (Convento das Rosas)

**Terrace:** `K.B(-296, -24.5, 604, -224, -21.27, 642, 'plaza', { edges: 'swe', color: 0xd8d0bf })`.

- The north edge is flush with G(604) = -21.27. You arrive from Crosstown down 26 m of 7 % cobble.
- The south face, outside the stairs, is a 2.66 m ledge drop to G(642) = -23.93. The side faces
  grow from 0 to 2.66 m.

**Double set**, 6 + 6 with rise 0.268:

```js
K.stairSpot('z', 642, 1, -270, -250, -21.27, -22.88, 6, 0.4, { rails: [-260], hubbas: [-270.4, -249.6] }); // foot 644
K.B(-270, -25.0, 644, -250, -22.88, 648, 'step', { edges: 'we' });                                      // 4 m landing
K.stairSpot('z', 648, 1, -270, -250, -22.88, -24.49, 6, 0.4, { rails: [-260], hubbas: [-270.4, -249.6] }); // foot 650 = G(650)
```

**Convent Lane** (x -266..-254, z 650..742, 7 %): cobble, with roll-away to the Terrace (92 m).
There are planters (`K.planter`, 0.55) at x -268..-267 and -253..-252, every 20 m from z 660.

**Buildings.**

- M10, the convent wing: `K.building(-311, 600, -297, 700, 3, 0xeee8da, 'stone')`, with a rose
  window prop.
- M11: x -296..-269, z 654..738 [3].
- M12: x -251..-211, z 654..738 [3].
- Rose trees `K.tree` at the terrace corners (-292, 608) and (-228, 608).

### 8.6 Clock Square, Clock Lane, Seminary Wall

**Clock Square** on the clock flat (-120, 660), -25.19.

- Plinth: `K.Bg(-122.5, 657.5, -117.5, 662.5, 0.45, 'ledge', { edges: 'nswe' })`.
- Clock column: `K.B(-120.6, -25.2, 659.4, -119.4, -18.5, 660.6, 'plaza', { color: 0xe9e1cf })`.
- A clock-face `D.add` cylinder at the top, facing ±z.
- Four benches, `K.bench` at r 7 on the four axes, oriented tangentially.

**Seminary Wall:** `K.Bg(-180, 665.0, -136, 665.6, 0.5, 'ledge', { edges: 'n' })`. It is 44 m long,
on the level lane's south edge.

**Clock Lane:** level cobble x -192..-48. It is open to the Steep and Market St.

**Buildings.**

- M13: x -190..-162, z 604..652.
- M14: x -100..-52, z 604..652.
- M15 Seminary: x -186..-130, z 668..738 [3], limewash.
- M16: x -106..-52, z 668..738.

### 8.7 Footbridge Lane, Rampart Alley, west blocks

**Footbridge Lane** (z 516..524, level).

- Cobble, with a footbridge-style iron railing prop on its south side at x -404..-392 as a gateway
  hint.
- Two lamps.
- No obstacles. It meets the Steep's west sidewalk at x -208 with a curb ramp.

**Rampart Alley** (x -326..-314, z 524..552) and **Rampart St** sidewalks: `old_walk` for
-328..-325 and -315..-312, z 568..742.

**Old Wall** pieces [472, 506] and [534, 738] (helper as in 7.11).

**Buildings.**

- M17–M20 (x -390..-334): z 474..512, 530..550, 571..650 and 656..738 [2].
- M23 (x -314..-266) and M24 (x -254..-212): z 474..512 [3].
- M25 (x -310..-212, z 528..550) [2].

### 8.8 East of Market St (x 52..300)

**Buildings.**

- M2–M4, west of Lantern (x 56..110): z 474..548, 571..650 and 656..738 [3].
- M5–M7, east of Lantern (x 131..208): the same z values [3].
- M8–M9 (x 214..286): z 474..548 and 571..738 [2].

**Lantern St sidewalks:** `old_walk` for 112..115 and 125..128, over z 470..552 and 568..742.

**Tile Ledges** on the east sidewalk:

- `old_slopeLedge(126.2, 126.8, 600, 640, 0.6, 0x3f6fa8, 126.2)` and
  `old_slopeLedge(126.2, 126.8, 652, 692, 0.6, 0x3f6fa8, 126.2)`.
- They are 0.45 m over the sidewalk, on the straight 7 % segment: two 40 m blue-tiled bench ledges
  for a bomb.
- An azulejo `D.plane` panel on the M6 wall behind them.

There are 23 market buildings in all.

---

## 9. Part: `old_harbour` (x -420..300, z 742..910)

### 9.1 The Terrace and the Miradouro (z 742..764, -30.37)

- The Terrace Road K.street (section 3.1).
- **Miradouro promenade** z 758..764: calçada through P.col, plus a `D.plane` at -30.36 for crisp
  edges.
- **Miradouro wall:** `K.Bg(x0, 763.5, x1, 764.1, 0.55, 'ledge', { edges: 'ns', color: 0xe9e1cf })`
  in runs:
  - x -310..-217
  - x -183..-50
  - x -28..108
- The gaps are at the Steep and Sea Gate, Fishermen's Stairs and Lantern St. Rampart St is at
  x < -310.
- Benches on the promenade, every 30 m, facing south.
- Sign MIRADOURO: a board on two posts (props) at (-120, -30.37 + 2.2, 760.5), facing -z.
- Lamps from the K.street default.
- A telescope prop at x -100.

### 9.2 The Sea Gate (Porta do Mar)

- **Towers:**
  - H1: `K.building(-216, 762, -208, 772, 4, 0xe9e1cf, 'stone')`.
  - H2: `K.building(-192, 762, -184, 772, 4, 0xe9e1cf, 'stone')`.
  - Each is 13.6 m, with crenellation props on top.
- **Arch:** `D.prop(-208, -30.37 + 9, 763, -192, -30.37 + 11.5, 771, 0xe9e1cf)` and a half-cylinder
  `D.add` under it. It is decor only, and the 9 m clearance is never hit.
- Sign PORTA DO MAR on the arch's north face at z 762.9, facing -z, y -30.37 + 10.2.

### 9.3 The Steep (x -208..-192, z 758..894)

- Sidewalks: `old_walk(-208, -205, ...)` and `old_walk(-195, -192, ...)`, over z 758..864 and
  880..894.
- Asphalt comes from P.col. Centre dashes from z 758 to 894.
- **Steep Rail:** `K.rail(-205.4, -30.71, 788, -205.4, -37.19, 844, 'Handrail', true)`. That is the
  sidewalk top plus 0.9, on the straight 11.58 % segment: a 56 m handrail to grind down the hill
  bomb.
- Lamps on the east sidewalk only (x -192.8), every 24 m. Nothing else stands on the road.

### 9.4 Fishermen's Stairs (x -46..-38; ramp lane x -36..-32; z 764..864)

These are five 6-stair flights from the Terrace to the Harbour Wall Road's north sidewalk. Each
flight's foot lands where G equals its bottom. The landings are flat boxes that end up to 1.8 m above
the ramp lane (their east edge is grindable).

Each flight is `K.stairSpot('z', at, 1, -46, -38, top, bottom, 6, 0.4, { rails: [-42] })`: rise
0.301, run 2.0.

| | at | top | bottom | foot |
|---|---|---|---|---|
| L0 landing | `K.B(-46, -32.5, 764, -38, -30.37, 789.6, 'step', { edges: 'e' })` | | | |
| F1 | 789.6 | -30.370 | -32.176 | 791.6 |
| L1 | z 791.6..805.2, top -32.176 | | | |
| F2 | 805.2 | -32.176 | -33.982 | 807.2 |
| L2 | z 807.2..820.8, top -33.982 | | | |
| F3 | 820.8 | -33.982 | -35.788 | 822.8 |
| L3 | z 822.8..836.4, top -35.788 | | | |
| F4 | 836.4 | -35.788 | -37.594 | 838.4 |
| L4 | z 838.4..862.0, top -37.594 | | | |
| F5 | 862.0 | -37.594 | -39.400 | 864.0 (onto the sidewalk, bench -39.40) |

- Landings are `K.B(-46, G(zb) - 0.5, za, -38, top, zb, 'step', { edges: 'e', color: 0xd8d0bf })`.
- The **ramp lane** x -36..-32 is just the ground (a 7 % then 11.6 % cobble chute) for bombing
  beside the stairs.
- The west side of the stairs is a house wall (H7).
- Net-drying racks (props) on L4.
- F5 lands on the sidewalk with 13 m to the sea wall.

### 9.5 Pool Row (x 128..200, z 776..850)

- **Houses** (front doors onto Lantern St):
  - H9a: `K.building(130, 776, 146, 790, 2, 0xd99a8c)`.
  - H9b: `K.building(130, 812, 146, 826, 2, 0xd9a441)`.
- **Side yards** at z 790..806 and 826..844 lead from the Lantern sidewalk onto the lots. The lot
  blends make them gentle ramps.
- **Lot A:** flat -32.57. `K.backyardPool(170, 795, 1)` (two lobes along x, at (167.8, 795) and
  (172, 795), depths 2.2 and 2.8).
- **Lot B:** flat -36.85. `K.backyardPool(170, 832, 1)`.
- **Garden walls** (grindable): `K.Bg(146, 805.4, 194, 806, 0.5, 'ledge', { edges: 'ns' })` and
  `K.Bg(146, 843.4, 194, 844, 0.5, 'ledge', { edges: 'ns' })`, plus east walls x 193.4..194 over
  each lot's z, 1.0 m, 'fence'.
- The grass banks between the lots are rough. Patio pads `K.pad` are next to each pool, and there
  are two loungers (props) per lot.
- Lantern sidewalks: `old_walk` for 112..115 and 125..128, over z 758..864.

### 9.6 Harbour Wall Road (z 864..880, -39.40) and the quay strip

- The K.street (section 3.1).
- **Fish docks** on the north side, in front of the warehouses, z 860..864. Each is built as
  `K.B(x0, -40.0, 860, x1, top, 864, 'garage', { edges: 'swe' })`.

  | dock | x | top |
  |---|---|---|
  | 1 | -152..-138 | -38.40 |
  | 2 | -134..-118 | -38.20 |
  | 3 | -100..-80 | -38.50 |
  | 4 | -76..-56 | -38.30 |

  They form a dock-gap line along the road.
- **Sea wall** (the old harbour wall): `K.Bg(x0, 880.5, x1, 881.1, 0.5, 'ledge', { edges: 'ns',
  color: 0xc9bfa8 })` at x -310..-212 and -188..108.
- **Quay strip** z 881..898 falls 0.65 m to base. Bollards:
  `K.Bg(x - 0.3, 887.7, x + 0.3, 888.3, 0.6, 'metal', { edges: '' })` at x -300, -270, -240, -160,
  -130, -100, -70, -40, -10, 20, 50 and 80. That is 12; none are at x -210..-190.
- A crane silhouette is left to the neighbours. There are two coiled-rope props and an anchor
  `D.add`.

### 9.7 Shop 2: "Steep Street Skates"

The shop is in building H5b, `K.building(-186, 840, -160, 864, 3, 0x3f6fa8)`, with its door on the
Harbour Wall Rd north sidewalk.

```js
P.shop({ name: 'Steep Street Skates', sign: [-173, -39.25 + 3.85, 864.04, 0, 7],
  awning: [-179, 864, -167, 865.6, -39.25 + 2.2], zone: [-177, 864.2, -169, 867], door: [-173, -39.25, 864.2] });
P.travel('Steep Street Skates', -173, -39.25, 867, 0, 'spot');
```

### 9.8 Harbour buildings

- H1–H2: the Sea Gate towers.
- H3a–b (x -390..-331): z 766..812 and 818..861 [2].
- H4a–b (x -309..-217): z 778..818 and 824..861 [3].
- H5a (x -189..-160, z 778..834) [3].
- H5b: the shop.
- H6a–b, warehouses: x -155..-110 and -105..-52, z 830..860 [2], 'brick', with roll-door props.
- H7 (x -155..-52, z 778..824) [2].
- H8a–b (x -29..108): z 778..820 and 826..861 [3].
- H9a–b: Pool Row.
- H10 (x 198..286, z 770..861) [2].
- H11 (x 134..286, z 866..890) [2].

That makes 17.

**Old Wall** piece [746, 850]. Its south end at (-402.4, 850) holds a tape (section 10.2).

---

## 10. Activities and travel

### 10.1 Challenges (`P.challenge`, registered by the owning part)

`FLIP = 'flip|shuv|Shove|Impossible|Varial'`. Boxes are `[x0, z0, x1, z1, yMin, yMax]`.

| id | name | kind | data |
|---|---|---|---|
| `old-brisa-flip` | Kickflip the Brisa Ten | trick, `trick: 'Kickflip'` | at [-150, -9.0, 398]; go [-150, -9.0, 380, Math.PI]; from [-160, 388, -140, 400.2, -9.4]; to [-162, 403.4, -138, 425, -13.5, -11.4] |
| `old-tile-gap` | Loading Steps Gap | gap | at [45.5, -7.11, 334]; go [45.5, -6.10, 322, Math.PI]; from [44, 320, 47, 332, -6.4]; to [44, 334.5, 47, 346.5, -7.5, -6.8] |
| `old-rambla` | Ride the Rambla | grind, `rail: 'Ledge'` | at [-43, -3.5, 280]; go [-43, -1.6, 258, Math.PI]; area [-44, 262, -36, 390] |
| `old-tier-flip` | Tier Drop Flip | trick, `trick: FLIP` | at [-150, -14.65, 492]; go [-150, -14.65, 478, Math.PI]; from [-190, 484, -50, 494.1, -15.0]; to [-190, 495, -50, 514, -16.4, -15.6]; notIn [-126, 493, -114, 497] |
| `old-steep-speed` | Bomb the Steep | speed, `speed: 60 / 3.6` | at [-200, -33, 800]; go [-200, -30.37, 752, Math.PI]; area [-208, 776, -192, 870] |
| `old-miradouro` | Miradouro Line | score, `pts: 4000` | at [-120, -29.8, 760]; go [-140, -30.2, 757, -Math.PI / 2]; area [-310, 742, 108, 766] |
| `old-rampart` | Rampart Run | line, `pts: 5000`, `need: [['grind', 3]]` | at [-320, -1.45, 256]; go [-320, -1.45, 250, Math.PI]; area [-324, 246, -316, 262] |
| `old-brisa-tre` (hard) | 360 Flip the Brisa Ten | trick, `tricks: ['360 Flip']` | the same boxes as old-brisa-flip; at [-146, -9.0, 398] |
| `old-convent-gap` (hard) | Convent Double | gap | at [-260, -21.27, 640]; go [-260, -21.27, 616, Math.PI]; from [-270, 630, -250, 642.1, -21.6]; to [-272, 650, -248, 668, -25.2, -24.2] |
| `old-feeble` (hard) | Feeble the Fishermen's Rail | grind, `rail: 'Handrail'`, `grind: 'Feeble'` | at [-42, -30.37, 787]; go [-42, -30.37, 768, Math.PI]; area [-43, 789, -41, 866] |

Descriptions:

- old-brisa-flip: "Kickflip down the Santa Brisa ten-stair off the church terrace".
- old-tile-gap: "Ollie from the fifth loading platform to the sixth".
- old-rambla: "Grind a Rambla median ledge down the Grand Boulevard".
- old-tier-flip: "Flip trick off the first market tier on to the second (not the stairs)".
- old-steep-speed: "Hit 60 km/h on the Steep below the Sea Gate".
- old-miradouro: "Land a 4,000 point line that starts on the Terrace".
- old-rampart: "From the top of the Rope Walk, three grinds in one line, 5,000 points".
- old-brisa-tre: "A 360 flip down the whole ten".
- old-convent-gap: "Clear both flights and the landing of the convent double set".
- old-feeble: "Feeble grind a Fishermen's Stairs handrail".

There are 7 gold and 3 red.

### 10.2 Tapes (`P.tape(x, z, y)`)

| # | where | part | P.tape |
|---|---|---|---|
| 1 | in the deep Lavadouro basin | market | `P.tape(-122, 585, -21.35)` |
| 2 | on the last loading platform | upper | `P.tape(45.5, 386, -10.16)` |
| 3 | behind the church, between the nave and the Bishop's Palace | upper | `P.tape(-150, 324, -6.63)` |
| 4 | at the bottom of the Pool Row lot B pool | harbour | `P.tape(172, 832, -39.6)` |
| 5 | on a market stall table on T2 | market | `P.tape(-98.5, 500.6, -15.23)` |
| 6 | at the far end of the Old Wall | harbour | `P.tape(-402.4, 849, -37.6)` |

### 10.3 Traffic, peds, skaters (index.js)

```js
P.traffic({ path: [[-40, 236], [-40, 396]], lane: 6.5, dir: 1, n: 2, speed: 9, r: 6 });
P.traffic({ path: [[-40, 236], [-40, 396]], lane: 6.5, dir: -1, n: 2, speed: 9, r: 6 });
P.traffic({ path: [[-200, 560], [120, 560], [120, 872], [-200, 872]], lane: 2.5, dir: 1, n: 3, speed: 9, r: 8 });
P.traffic({ path: [[-200, 560], [120, 560], [120, 872], [-200, 872]], lane: 2.5, dir: -1, n: 3, speed: 9, r: 8 });
P.traffic({ path: [[-320, 560], [-200, 560], [-200, 750], [-320, 750]], lane: 2.5, dir: 1, n: 2, speed: 8, r: 8 });
P.peds({ path: [[-215, 410], [-35, 410], [-35, 462], [-215, 462]], n: 10 });   // Fountain Square
P.peds({ path: [[-46.5, 474], [-46.5, 736], [-33.5, 736], [-33.5, 474]], n: 6 }); // Market St sidewalks
P.peds({ path: [[-300, 553.5], [200, 553.5], [200, 566.5], [-300, 566.5]], n: 8 }); // Crosstown
P.peds({ path: [[-310, 757], [108, 757], [108, 761], [-310, 761]], n: 8 });      // Miradouro
P.npc({ kind: 'session', rail: [-158, 438.3, -142, 438.3], start: -162, end: -138, back: 3.6, side: -1, speed: 5 }); // fountain wall
P.npc({ kind: 'session', rail: [-183, 763.8, -50, 763.8], start: -150, end: -80, back: 3.4, side: -1, speed: 5.4 }); // Miradouro wall
P.npc({ kind: 'session', rail: [-100, 566.3, -84, 566.3], start: -104, end: -80, back: 3.4, side: -1, speed: 5 });    // Crosstown ledge
P.npc({ kind: 'loop', path: [[-210, 412], [-40, 412], [-40, 466], [-210, 466]], speed: 6 });                         // square cruiser
```

The boulevard pair mirrors fin's `[[-40,140],[-40,212]]`, lane 6.5. Cars follow the ground, so the
Steep's 11.6 % is fine.

### 10.4 Fast travel

- **District** (index.js): `P.travel('Old Town', -100, -13.0, 430, Math.PI, 'district')`. This is
  Fountain Square, facing downhill.
- **Spots**, each registered by its part:

  | name | P.travel |
  |---|---|
  | Santa Brisa | (-150, -9.0, 385, Math.PI) |
  | Tile Works | (40, -1.6, 256, Math.PI) |
  | Mercado Velho | (-120, -14.65, 478, Math.PI) |
  | Porta do Mar | (-200, -30.37, 752, Math.PI) |
  | Tile & Truck | shop, section 7.9 |
  | Steep Street Skates | shop, section 9.7 |

- No 'park' point: Old Town has no skatepark.

### 10.5 Spots (`P.spot(name, x, y, z, Math.PI, [x0, z0, x1, z1])`)

| spot | x, y, z | area |
|---|---|---|
| Rambla | -40, -6.77, 326 | [-44, 262, -36, 390] |
| Alto Walk | -150, -1.45, 250 | [-332, 246, 212, 255] |
| Bishop's Steps | -124, -5, 316 | [-128, 254, -115, 358] |
| Santa Brisa Steps | -150, -9.0, 398 | [-190, 358, -90, 410] |
| Gull Fountain | -150, -13.56, 446 | [-158, 438, -142, 454] |
| Cafe Gaivota | -70, -10.75, 392 | [-84, 384, -57, 402] |
| Loading Steps | 45.5, -6, 326 | [44, 262, 47, 390] |
| Lemon Square | 121, -12.82, 425 | [92, 404, 190, 446] |
| Market Tiers | -120, -16.03, 504 | [-190, 474, -50, 536] |
| Market Docks | 12, -18.2, 548 | [-24, 546, 48, 551] |
| Lavadouro | -134, -19.45, 585 | [-160, 568, -108, 608] |
| Convent Double | -260, -21.27, 640 | [-296, 604, -224, 650] |
| Clock Square | -120, -25.19, 660 | [-130, 650, -110, 670] |
| Tile Ledges | 126.5, -25, 646 | [125, 600, 128, 692] |
| Miradouro | -120, -30.37, 760 | [-310, 756, 108, 764] |
| The Steep | -200, -35, 816 | [-208, 776, -192, 864] |
| Fishermen's Stairs | -42, -35, 820 | [-46, 764, -32, 864] |
| Pool Row | 170, -34.7, 814 | [146, 784, 194, 844] |
| Harbour Wall | -60, -39.4, 881 | [-310, 860, 108, 882] |
| Old Wall | -402.4, -20, 560 | [-403, 256, -401.8, 850] |

---

## 11. Signs, landmarks, trees, lamps

**D.sign boards** (7 of 8): `D.sign(text, x, y, z, w, h, rotY, fg, bg)`.

| text | x | y | z | w | h | rotY | colours | where |
|---|---|---|---|---|---|---|---|---|
| SANTA BRISA | -150 | -9 + 6.2 | 372.1 | 8 | 1 | 0 | 0x3a3226 on 0xe9e1cf | church facade |
| CAFE GAIVOTA | -70 | -10.75 + 3.2 | 382.1 | 6 | 0.9 | 0 | 0xffffff on 0x3f6fa8 | |
| AZULEJARIA NOVA | 46.95 | G(300) + 5.5 | 300 | 10 | 1.2 | -Math.PI/2 | 0xffffff on 0x3f6fa8 | Tile Works |
| MERCADO VELHO | 12 | -15.1 + 6.5 | 479.9 | 12 | 1.4 | Math.PI | 0x3a3226 on 0xd9a441 | Market Hall |
| LAVADOURO | -134 | -15.0 | 567.9 | 7 | 0.9 | Math.PI | 0x3a3226 on 0xe9e1cf | wash house |
| MIRADOURO | -120 | -28.2 | 760.5 | 5 | 0.8 | Math.PI | 0xffffff on 0x3f6fa8 | |
| PORTA DO MAR | -200 | -20.2 | 762.9 | 9 | 1.1 | Math.PI | 0x3a3226 on 0xe9e1cf | Sea Gate arch |

**Landmarks** (index.js):

```js
P.landmark({ at: [-173, -9.0, 365], near: 140, parts: [
  { shape: 'box', at: [0, 17, 0], size: [10, 34, 10], color: 0xe9e1cf },        // bell tower
  { shape: 'cone', at: [0, 38, 0], size: [7, 8, 7], color: 0xa94f32 },          // spire
  { shape: 'box', at: [23, 7, -16], size: [28, 14, 46], color: 0xe9e1cf },      // nave
  { shape: 'sphere', at: [23, 16, -25], size: [14, 10, 14], color: 0xc9b48a } ] }); // dome
P.landmark({ at: [-200, -30.37, 767], near: 140, parts: [
  { shape: 'box', at: [-12, 7, 0], size: [8, 14, 10], color: 0xe9e1cf },
  { shape: 'box', at: [12, 7, 0], size: [8, 14, 10], color: 0xe9e1cf },
  { shape: 'box', at: [0, 10.25, 0], size: [16, 2.5, 8], color: 0xe9e1cf } ] });
```

**Trees.** About 60 in all, as `K.tree`, each a solid post:

- Rambla: 6.
- The square: 4.
- Lemon Square: 6.
- Wash Green: 2.
- Convent: 2.
- Lantern below z 568: every 32 m on the east sidewalk outer edge (about 8).
- K.street defaults on the Terrace and Harbour Wall Rd (about 20).
- Back gardens, as decor `D.tree`: about 12.

**Lamps.** About 70 `K.lamp`:

- Alto Walk: 16.
- GB: 10.
- Square: 6.
- Market St: 16.
- Crosstown: 30.
- The Steep's east side: 6.
- K.street defaults.

Lamps are never on a sidewalk under 3 m wide, and never in a gate corridor.

**Furniture.** Trash cans by the benches (`K.trashCan`, about 10). Hydrants on the N–S sidewalks
(about 8). Newsboxes at the square and Crosstown (2).

---

## 12. Budget estimate (`--only old`)

| item | upper | market | harbour | total | budget |
|---|---|---|---|---|---|
| boxes | ~210 | ~200 | ~170 | **~580** | 900 |
| grind lines (edges, rails, curbs, coping) | ~170 | ~150 | ~150 | **~470** | 700 |
| K.building | 24 | 23 | 17 | **64** | 70 |
| D.sign | 4 | 2 | 2 | **7** (+2 shop boards) | 8 |
| fine ground (res 2) | 15,600 | 13,500 | 4,300 | **~34,500** (~42,000 snapped) | 60,000 |
| triangles | ~120k | ~110k | ~90k | **~320k** | 450k |
| load time | | | | **~0.9 s** | 1.5 s |

The box count includes:

- About 60 step boxes: Brisa 9, Bishop's 20, the tiers 12, the convent 10, Fishermen's 25 and the
  cafe 3.
- 9 landings.
- About 30 K.street sidewalk boxes.
- About 130 trees and lamps (posts).
- About 120 furniture pieces.

The sidewalk strips are hubbas, about 350 pieces, and they are not boxes. They cost triangles and a
'Curb' rail per straight run, about 90.

If the box count runs high, drop the stall tables (12), the slappy curbs (become `K.lip`) and half
the bollards.

---

## 13. Builder notes

- **Don't use** `K.driveway` (it hardcodes y 0.01). Also avoid `K.loadingDock`, `K.garage`,
  `K.raisedPlaza` and `K.sunkenPlaza`: they assume flat ground.
- `K.fountainBowl`, `K.pool` and `K.backyardPool` take one y0. Use them only on the flats listed in
  section 2.3.
- `K.street` goes only on the three benches (flat), plus nothing else.
- `K.kicker` reads the ground at its base point only; none are used.
- **Every flat box** that sits on a slope (landings, tiers, decks, platforms, docks) gets its bottom
  at the ground's minimum under it minus 0.5. Use the formulas given; never use `K.Bg` for a
  landing whose top must be exact.
- **Grind edges:** a box's `edges` names the grindable top edges. Keep 'n' off any edge that is
  flush with the ground.
- Never put a box taller than 0.3 m in these corridors:
  - x -50..-30, z 230..246
  - x 284..300, z 552..568
  - x -420..-404, z 516..524
  - x -208..-192, z 894..910

---

## 14. Concerns

See the StructuredOutput `concerns` field. In short:

- The district is benched, so its connecting streets run at 7 % and the Steep at 11.6 %. Both are
  above the 3–6 % guidance.
- K builders that assume flat ground are avoided.
- There are band and gate notes for fin, the Arroyo and bw.

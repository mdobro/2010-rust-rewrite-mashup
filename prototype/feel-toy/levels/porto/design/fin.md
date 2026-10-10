# Financial Core (`fin`) — district design

District rect: x -420..360, z -230..230. The band (12 m) stays at base height. Downtown
(`buildDowntown(K)`, x/z -120..120, y 0) stays exactly as it is. Its Corner Skate Shop is the map spawn.

Gates (from CONTRACT.md). Keep every corridor (16 m deep, gate width) free of anything taller than 0.3 m.

| gate | at | width | y | reached by |
|---|---|---|---|---|
| switchback | (-100, -230) | 16 | 1.0 | Switchback Road (x -107..-93), descending to the ring |
| observatory | (220, -230) | 12 | 1.0 | Observatory Promenade berm (x 214..226) |
| avenue | (360, 0) | 16 | 0 | Metro Avenue (z -7..7) |
| planters | (-420, -40) | 12 | 0 | Planter Alley trough, ramped back to 0 by x -404 |
| boulevard | (-40, 230) | 20 | -0.4 | Grand Boulevard (x -50..-30), dipping in the band |

Palette: glass 0x6f8fa8 / 0x5d7489 / 0x8fa7b8, granite 0xc9b9a3, marble 0xe8e4da, black
granite 0x3a3d42, gold 0xd9a93f, brick 0x9a5e4c, concrete 0xb8b4ac.

---

## 1. Concept

Porto Alto's money district is glass and polished granite: civic steps, bank plinths,
marble banks and a gold sculpture. It is deliberately the city's **flat, technical core**.
It is where you go for clean ledges, handrails and stair sets. Downtown is the centre.
Fin wraps it with a real **Exchange Ring** road and four quarters:

- **North (Civic Hill).** A gentle 1.28 % slope (the North Civic Slope) falls from the
  Heights gates to the ring. It carries speed that would otherwise die. City Hall sits on a
  4 m marble terrace with the **City Hall Twelve**, and two long downhill ledges run off the
  terrace ends: **Council Drive** (86 m) and the **Treasury Ramp** (58 m).
- **East (Exchange & Metro).** The raised **Observatory Promenade** brings skaters in from
  the observatory gate. It drops into a drained **Cascade** fountain, two spillway walls and
  the **Golden Nautilus**, a 21 m gold log-spiral sculpture with a gap through its arch.
  Then come Metro Plaza, Metro Central station, and Treasury Gardens with its pools and mounds.
- **West (Planter Alley & Arena).** A 1.6 m concrete trough runs between brick terraces
  with angled planters, out to the planters gate. The Bourse and Mint Terrace sit north of
  it and the Alto Arena (a stadium) south.
- **South (Grand Boulevard).** A wide boulevard with a ledge median runs to the boulevard
  gate. Hotel Meridiana, a sunken garden and the Bank of the Alto bank-to-wall line it.

Momentum: the district is flat by contract. Speed comes from the North Civic Slope and from
built terraces (City Hall 4.0 m, Cascade 3.0 m, Bourse 2.4 m, car park 5 m, Arena 6 m).
You climb these once and descend them in lines. Every descent is a 3–6 % ledge or a
bank of at most 30°.

---

## 2. Height plan

### 2.1 Base (portoBaseH for fin, for reference)

The base is about 1.0 at z -230, falling to 0 by z -194. It is flat 0 to z 206, then -0.15
at z 218 and -0.44 at z 230. P.ground is blended to base inside the 12 m band automatically.

### 2.2 `fin_plan().ground(x, z, base)`, written by index.js via `P.ground(F.ground)`

```
sm(t) = t*t*(3-2t)  (t clamped 0..1)

ground(x, z, base):
  if |x| <= 120 and |z| <= 120: return 0          // Downtown untouched
  L  = clamp((-140 - z) / 78, 0, 1)                // North Civic Slope: 0 at z -140, 1 at z -218
  g0 = max(base, L)
  h  = g0 - alleyCut(x, z)
  if 180 < x < 260 and -220 < z < -70: h = max(h, berm(x, z, g0))
  for (cx, cz, r, hh) in HUMPS: d = dist((x,z),(cx,cz)); if d < r: h += hh * (1 - sm(d / r))
  return h

HUMPS = [(226, 118, 16, 2.5), (296, 150, 22, 3.2), (236, 186, 14, 2.0)]   // Treasury Gardens, 7.10
```

The North Civic Slope is 1/78 = 1.28 %, which just beats rolling friction (1.07 %). A
board coming off the switchback or observatory gate at y 1.0 coasts to the ring at
constant speed. In the band (z < -218) g0 meets the base (about 0.97–1.0), so the border
check holds. The South Strip is flat 0 to z 218, then the band takes it down to -0.44 (about
3.7 %) into the boulevard gate.

**alleyCut(x, z)** (Planter Alley trough, axis z -40):

```
D(x) = 1.6                               for -380 <= x <= -166
     = 1.6 * sm((-146 - x) / 20)         for -166 <  x <  -146   (east ramp-in, ~8 %)
     = 1.6 * sm((x + 404) / 24)          for -404 <  x <  -380   (west ramp-out to the gate)
     = 0                                 otherwise
dz = |z + 40|
cut = D                                  dz <= 6        (floor, 12 m wide)
    = D * (1 - t*t),  t = (dz - 6) / 4   6 < dz <= 10   (concave transition, ~39 deg at lip)
    = 0                                  dz >= 10       (terraces at dz 10..16 are y 0)
```

The gate at x -420 is at y 0, and the trough is fully back to 0 by x -404. That leaves
16 m of flat, so the gate depth is satisfied.

**berm(x, z, g0)** (Observatory Promenade, Cascade terrace and spillway): for each shape
take g0 + D*(1 - sm(s/W)), where D = top(clamped z) - g0, W = 2*D, and s is the distance
from (x, z) to the shape's rect (0 inside). Return the max over the shapes.

| shape | rect x | rect z | top |
|---|---|---|---|
| Promenade | 214..226 | -214..-132 | Hb(z) = 0.974 + 2.026*(z+214)/82 (2.5 % climb) |
| Cascade terrace | 196..244 | -132..-104 | 3.0 |
| Spillway | 208..232 | -104..-76 | Hs(z) = 3*(-76 - z)/28 (10.7 % down to 0) |

The batters are smoothstep, 2:1 wide: about 26.6° mean and 37° at the steepest. They are
skateable banks on both sides. At z -214 the promenade top (0.974) equals g0, so it
blends into the observatory gate corridor with no step.

### 2.3 P.region (fine ground) — `F.regions`, each `[x0, x1, z0, z1, res]`

| region | res | why |
|---|---|---|
| [-408, -136, -56, -24, 1] | 1 | alley body |
| [-408, -136, -56, -48, 0.5] | 0.5 | north alley lip transition |
| [-408, -136, -32, -24, 0.5] | 0.5 | south alley lip transition |
| [200, 240, -216, -128, 1] | 1 | promenade berm |
| [184, 256, -136, -72, 1] | 1 | Cascade terrace and spillway batters |
| [-112, -88, -224, -136, 2] | 2 | Switchback Road colour edges |
| [-64, -16, 208, 224, 2] | 2 | boulevard dip into the band |
| [208, 248, 96, 136, 1] | 1 | Treasury hump A |
| [272, 320, 128, 176, 1] | 1 | Treasury Mound |
| [216, 256, 168, 200, 1] | 1 | Treasury hump C |

Total is about 29k m² of fine ground. Regions snap to the 8 m grid, and all the rects
above are already multiples of 8. Note: a finer region nested inside a coarser one is
skipped. The two 0.5 lip strips overlap the res-1 alley body, so **declare the 0.5
strips first, then the res-1 body**. If the engine still skips them, drop them; res 1
over the 4 m transition is acceptable.

### 2.4 P.col and P.surface (in fin_plan)

Both return **null for |x| ≤ 120 and |z| ≤ 120** (Downtown keeps K.dtCol and K.dtSurface).

col(x, z), first match wins:
1. Alley trough |z+40| < 10, x -404..-146: concrete 0xb8b4ac.
2. Alley terraces 10 ≤ |z+40| ≤ 16, x -400..-150: brick 0x9a5e4c.
3. Spillway rect (x 208..232, z -104..-76): aqua concrete 0x8fc4c4.
4. Promenade and Cascade tops: granite 0xc9b9a3. Batters: concrete.
5. Civic Square (x 0..80, z -165..-140): marble 0xe8e4da.
6. Switchback Road (x -107..-93, z < -136), Exchange Ring road (124 ≤ max(|x|,|z|) ≤ 136),
   Metro Avenue (|z| ≤ 7, x > 136) and Grand Boulevard (|x+40| ≤ 10, z > 136):
   asphalt 0x3b3d40.
7. Treasury Gardens (x 196..346, z 60..214) and Council Garden (x -86..0, z -165..-140):
   grass 0x5f8a4a.
8. Default: granite paving 0xbdb3a4.

surface(x, z): 'rough' on grass and on the ring road and Metro Avenue (matching
Downtown's road feel). 'smooth' on Switchback Road, Grand Boulevard, Civic Square,
marble and the spillway. Otherwise null.

Fine patterns (paving bands on Civic Square, ring markings around the Nautilus) are
decor strips. Use D.add thin planes at y + 0.01, and **never paintRect on slopes**.

---

## 3. Layout

```
 z=-230  +---------------------------------------------------------------------------------+
         | Ledger   BOURSE      Consol.  [SW]Hall of   CITY HALL  Treasury  | [OB]  Exch.    |
         | Tower   (plinth)     -idated  |  Records   (dome)     bldg      |Prom-  Towers   |
         |         Bourse Steps          |  Council Dr <==12-set==> Treas.Ramp  enade         |
 z=-140  |   ~~~ North Civic Slope 1.28% |  Garden   Civic Sq            | |  Meridian     |
         +-------+-----------------------+=========EXCHANGE RING=========+ CASCADE  Bourse   |
         | Mint  |                       ||                             || spillway  Annex  |
 z=-40 [PL]=====PLANTER ALLEY trough=====||                             || NAUTILUS  Spiral |
         | bldgs  ^planters^   bldgs     ||        DOWNTOWN             || Metro Plaza/Steps|
 z=0     |                               ||   (unchanged, -120..120)    ||=METRO AVENUE====[AV]
         |  +---------------------+      ||                             || Metro Central   |
         |  |     ALTO ARENA      |      ||                             || frontages       |
 z=100   |  |  (stadium, 6 m)     |      ||                             || east blocks     |
         |  +---------------------+      +=========EXCHANGE RING=========+ TREASURY GARDENS |
 z=170   |    arena car park             | Hotel  ||  Sunken   Bank of   | Long Pool,mound |
         |                               | Merid. ||  Garden   the Alto  | car park        |
 z=230   +-------------------------------------[BV]-----------------------------------------+
        x=-420                        x=-140  x=-40          x=140                      x=360
```

### 3.1 How each gate is reached

- **switchback (-100, -230):** Switchback Road runs straight south to north at x -100,
  road x -107..-93, from z -230 to the ring at z -136. It follows the 1.28 % slope.
- **observatory (220, -230):** the promenade top starts at g0 at z -214 and the corridor
  z -230..-214 is plain slope.
- **avenue (360, 0):** Metro Avenue runs at z 0 from x 140 to x 359.5. Nothing taller than
  the 0.15 sidewalk sits in z -8..8 for x > 344.
- **planters (-420, -40):** the trough is back to y 0 at x -404. The terrace planters stop
  at x -374, so the corridor x -420..-404, z -46..-34 is clear.
- **boulevard (-40, 230):** the boulevard road (x -50..-30) is flat to z 216. The band
  dips it to -0.44. The median stops at z 210.

### 3.2 Downtown outer ring — clash audit

| Downtown item | clash | resolution |
|---|---|---|
| K.ringTraffic sq(130) | runs on bare ground today | fin_core builds the Exchange Ring road under it (124..136) |
| K.ringPeds sq(122) and sq(138) | walk on bare ground | inner sidewalk 120..124 and outer sidewalk 136..140 sit under them |
| Overpass decor x 49..120, z -4..8, y 8.6 | dangles at x 120 | fin_east extends it to x 146 into Metro Central (decor only) |
| Avenue and street stubs end at ±120 | — | paint the 8 stubs 120..124; ring crossings at x/z ±40 |
| DIY wall x 116..118 | inside Downtown | nothing of fin within 2 m of it |
| K.fine res-1 region -128..128 | overlaps ring by 8 m | fin regions stay outside |±136| |

---

## 4. Parts, file ownership and call order

| part | file | owns rect [x0, x1, z0, z1] |
|---|---|---|
| plan | levels/porto/fin/fin_plan.js | (no geometry) shared numbers, ground, col, surface, regions |
| core | levels/porto/fin/fin_core.js | Exchange Ring (all four sides, 120..140) + South [-140, 140, 120, 230] |
| north | levels/porto/fin/fin_north.js | [-420, 140, -230, -140] |
| east | levels/porto/fin/fin_east.js | [140, 360, -230, 230] |
| west | levels/porto/fin/fin_west.js | [-420, -140, -140, 230] |

fin_core owns the ring strip 120 ≤ max(|x|,|z|) ≤ 140 for x, z in -140..140, and the south
rect z 140..230. North starts at z -140 and the ring's north sidewalk ends at z -140.

**P.ground is written only by index.js**, from fin_plan. No part calls P.ground, P.col,
P.surface or P.region.

`fin_plan()` returns `{ ground, col, surface, regions, sm, ring: {in: 120, road0: 124, road1: 136, out: 140}, alley: {z: -40, depth: 1.6}, hall: {y: 4.0}, cascade: {y: 3.0}, colors: {...palette} }`.

index.js `porto_fin(K, P)`:

```js
function porto_fin(K, P) {
  const F = fin_plan();
  P.ground(F.ground); P.col(F.col); P.surface(F.surface);
  for (const r of F.regions) P.region(...r);
  const spots = buildDowntown(K);
  for (const s of spots) P.spot(s.name, s.pos.x, s.pos.y, s.pos.z, s.yaw, s.area);
  fin_core(K, P); fin_north(K, P); fin_east(K, P); fin_west(K, P);
  // travel (section 9)
}
```

Each part registers its own P.spot, P.challenge, P.tape, P.traffic, P.peds, P.npc,
P.landmark and signs. **Travel is registered only in index.js.**

Notation below: `B(x0, y0, z0, x1, y1, z1, mat, opts)` is a solid box (K.box). `hubba(a, b, w, opts)`
is a K sloped block, `{a: top, b: bottom, w, noRails, kind, color}`. Rails
start at the a and b points (top edge).

---

## 5. Part: fin_core — Exchange Ring and South

### 5.1 Exchange Ring

- Road: four K.street calls with {rw: 6, noCurb: true, lamps: false}, y 0:
  - `K.street('x', -130, -140, 140, 0, [], ...)`, the north side (axis z -130)
  - `K.street('x', 130, ...)`, the south side
  - `K.street('z', -130, ...)`, the west side (axis x -130)
  - `K.street('z', 130, ...)`, the east side
  - Pass **no crossings**. Crossing cuts outside from..to break K.street's cut pairing.
    That is why the sidewalks are explicit boxes.
- Sidewalks: boxes at y 0.15 (B(..., -0.3, ..., 0.15, ...), mat 'sidewalk'). The road-facing
  edge is grindable: edges 's' on the north outer, 'n' on the north inner, and so on.

| side | outer (136..140) segments | inner (120..124) segments |
|---|---|---|
| north | x [-140,-111], [-89,-50], [-30,30], [50,140] | x [-120,-50], [-30,30], [50,120] |
| east | z [-136,-50], [-30,-10], [10,30], [50,136] | z [-124,-50], [-30,30], [50,124] |
| south | x [-140,-50], [-30,30], [50,140] | x [-120,-50], [-30,30], [50,120] |
| west | z [-136,-50], [-30,30], [50,136] | z [-124,-50], [-30,30], [50,124] |

  The gaps are crossings: the Downtown avenues and streets at ±40, Switchback Road (x
  -111..-89 on the north outer), Metro Avenue (z -10..10 on the east outer) and the boulevard (x -50..-30
  on the south outer). Corner squares (136..140 × 136..140) belong to the outer runs listed.
- Every segment end facing a crossing gets a **curb-ramp hubba**: a at the box end y 0.15,
  b 1.4 m out at y 0.02, w 2.6, noRails. The rest of the end is a 0.15 step.
- Paint: zebra decor strips on each crossing. Paint the 8 Downtown stubs (120..124) and the outer stubs
  136..140 for Switchback Road, Metro Avenue and the boulevard in asphalt (P.col does
  this already outside 120; the strips are only for lane lines).
- Lamps every 24 m on the outer sidewalk at 138.5. Furniture on the outer sidewalk:
  12 benches (K.bench) and 8 bins. Keep them 3 m clear of curb ramps.
- Ring traffic and peds: **keep Downtown's** (they now sit on this road). Add none.

### 5.2 Grand Boulevard (axis x -40, z 140..216)

- `K.street('z', -40, 140, 216, 0, [], {rw: 10, sw: 5, lamps: false})`. The road is x -50..-30 and the
  sidewalks x -55..-50 and -30..-25.
- Median: `B(-43, -0.3, 146, -37, 0.15, 210, 'sidewalk', {edges: 'we'})`. Chamfer
  hubbas on both ends (a y 0.15, b y 0.02, 1.2 m, w 6, noRails).
- Median ledges (black granite): `B(-40.35, -0.3, z0, -39.65, 0.65, z1)` for (z0, z1) =
  (150, 160), (166, 176), (182, 192), (198, 208). Each gives a 0.5 m ledge with both long edges
  grindable. There are 6 m gaps between them for manuals and transfers.
- Bus stops (K.prop shelters, 1 m deep) at (-52.6, 172) and (-27.4, 196). Each has a 4 m bench ledge.
- Lamps: pairs every 16 m at x -54 and -26.
- **Gate check:** nothing in x -50..-30 beyond z 210, and the sidewalk boxes end at z 214.

### 5.3 Hotel Meridiana (west of the boulevard)

- `K.building(-130, 182, -70, 212, 10)` with glass 0x8fa7b8 and a marble base.
- Front deck: `B(-132, -0.5, 170, -68, 1.2, 182, 'marble', {edges: 's'})`.
- Drives: hubba a (-132, 1.2, 176), b (-139.5, 0.02, 176), w 6 (west, 9 %), and a
  (-68, 1.2, 176), b (-58, 0.02, 176), w 6 (east, toward the boulevard sidewalk at -55).
  Both use kind 'Ledge'.
- Planters on the deck front: B(-131, 0.9, 170, -104, 1.75, 171.1) and B(-96, 0.9, 170, -69,
  1.75, 171.1). That gives a 0.55 m ledge above the deck, with its 's' edge grindable from the street.
- Centre stairs: `SET('z', 170, -1, -103, -97, 1.2, 0, 4, 0.36)` with handrails at x -103.4 and
  -96.6. This is a 4-stair down to the south sidewalk.
- Sign "GRAND HOTEL MERIDIANA" on the facade at y 9. Canopy decor.

### 5.4 Sunken Garden

- `K.sunkenPlaza(24, 180, 16, 10, 1.8)`: centre (24, 180), half sizes 16 × 10, depth 1.8.
- 4 trees on the rim corners and 2 benches inside.

### 5.5 Bank of the Alto

- `K.building(60, 188, 134, 214, 9)` in black granite with gold trim decor.
- Bank-to-wall: wall `B(70, -0.5, 183.5, 100, 2.3, 186, 'granite', {edges: 'n'})` and bank hubba
  a (85, 1.4, 183.5), b (85, 0.02, 177.5), w 30, noRails. That is about 13° of up-bank into
  a 0.9 m wallride or stall strip.
- Ledges: two granite ledges at z 160, `B(60, -0.3, 159.6, 84, 0.5, 160.4)` and
  `B(96, -0.3, 159.6, 120, 0.5, 160.4)`, both grindable along the long edges.
- Sign "BANK OF THE ALTO".

### 5.6 Courthouse corner and dressing (x 60..134, z 140..176)

- A plaza with 4 trees. The south ring sidewalk (outer, x 50..140) leads in.
- Traffic: **Boulevard**, path [[-40, 140], [-40, 212]], lane 6.5, n 3, speed 11.
- Peds: loops on both boulevard sidewalks (z 142..212, n 6) and round the Sunken Garden rim (n 4).
- NPC: session skater on median ledge 2 at (-40, 0.15, 171).

Core box estimate: about 125.

---

## 6. Part: fin_north — Civic Hill [-420, 140, -230, -140]

Ground here is g0 = L(z) (y 0 at z -140, 1.0 at z -218). **All buildings and terraces use
K.building / B with bottom at -0.5 and top at an absolute y**, so slope doesn't
gap them.

### 6.1 Switchback Road

- Road decor strip x -107..-93, z -230..-140, colour from P.col.
- Sidewalks: two sloped hubbas, a (-109, 1.073, -212), b (-109, 0.15, -140), w 4, kind
  'Curb'. Do the same at x -91. Their tops are 0.15 above ground, and both edges are grindable as
  72 m downhill curbs. They stop at z -212, so the gate corridor (z -230..-214) stays clear.
- Lamps every 18 m at x -112 and -88.
- Traffic: **Switchback**, path [[-100, -214], [-100, -136]], lane 3.5, n 2, speed 10.

### 6.2 City Hall terrace (the hero spot)

- Building: `K.building(8, -214, 72, -196, 6, 'stone')`, granite. Dome decor: a sphere of r 11 at
  (40, 15, -205) scaled y 0.9, with a drum cylinder of r 11 and h 4 at y 12, to give a top of about 21.
  Register `P.landmark('City Hall', 40, 21, -205)`.
- Portico: 10 columns of 0.9 × 0.9 at x = 13 + 6k (k 0..9), z -195..-194.1, y 4.0..12.5. Decor
  only, keep them collidable as thin boxes. Pediment decor y 12.5..14.
- Terrace: `B(0, -0.5, -196, 80, 4.0, -170, 'marble')`.
- **The 12-set** (centre x 30..50):
  `stairSpot('z', -170, 1, 30, 50, 4.0, 0.36, 12, 0.42, {rails: [40]})`. It descends south to north
  (dir +1, toward z -165), 12 treads of 0.42 m, so the bottom is at z -164.96. The bottom y is
  0.36 (ground about 0.33 there).
  - The handrail at x 40 starts at y 4.58. Kink: the flat rail `K.rail([40, 0.963, -165.08],
    [40, 0.963, -161.5], 'Handrail')`. **There is no rail chaining**, so this is a separate grind;
    the re-catch magnet (0.7 m, dy ≥ -0.35) allows the transfer.
  - Hubbas: wide sloped blocks at x 28.9 and 51.1 (centre x), a (x, 4.38, -170.35), b (x,
    0.823, -165.08), w 1.6, kind 'Hubba', granite.
  - Run-up: 26 m of terrace from the portico (z -196) and at least 14 m flat in the centre aisle.
    Roll-away: Civic Square, 25 m of marble falling 1.28 % toward the ring.
- Banks off the front corners: hubba a (9, 4.0, -170), b (9, 0.36, -160.5), w 10, noRails, and
  a (71, 4.0, -170), b (71, 0.36, -160.5), w 10, noRails. That is about 21°, an easier way down.
- Lips at y 4.0 (B edges on the front face of the terrace, kind 'Ledge') along x 0..4,
  14..28.1, 51.9..66 and 76..80. The side faces x 0 and x 80 get lips z -196..-186 only, because
  the ramps attach at z -190..-182.
- Terrace ledges (black granite, 0.45 high): `B(4, 4.0, -182.3, 24, 4.45, -181.7)` and
  `B(56, 4.0, -182.3, 76, 4.45, -181.7)`.
- Planters: `B(30, 4.0, -190, 34, 4.6, -186)` and `B(46, 4.0, -190, 50, 4.6, -186)`, each with a
  D.tree at y 4.6.
- NPC: session skater on the terrace ledge at (14, 4.0, -184).

### 6.3 Council Drive and the Treasury Ramp (long downhill ledges)

- Council Drive: hubba a (0, 4.0, -186), b (-86, 0.61, -186), w 8, kind 'Ledge', granite.
  The ground under its end is about 0.59 (z -186). The drop is 3.39 over 86 m, a 3.9 % ledge.
  Both edges are rails. The top surface is the ride; the edges are 86 m grinds.
- Treasury Ramp: hubba a (80, 4.0, -186), b (138, 0.61, -186), w 8, kind 'Ledge'. That is
  3.39 over 58 m, about 5.8 %. It ends at x 138 inside the north rect.
- Both are also how you **climb** onto the terrace (about 4–6 %, pushable).

### 6.4 Civic Square (x 0..80, z -165..-140)

- Marble (P.col). Decor paving bands every 4 m, running in x.
- Ledges: `B(9.6, -0.3, -162, 10.4, 0.55, -146)` and `B(69, -0.3, -162, 69.8, 0.55, -146)`.
  6 benches (K.bench) set along z -148, at x 16, 22, 58 and 64 (with 2 on the side lines).
  **Keep the centre run-out x 30..50 clear.**
- Peds: loop round the square (n 6).

### 6.5 Council Garden (x -86..0, z -165..-140)

- A grass pad. Ledge `B(-60, -0.3, -152.4, -30, 0.5, -151.6)`. 8 trees and 2 benches.

### 6.6 Hall of Records and Treasury buildings

- `K.building(-80, -214, -8, -196, 4)` (Hall of Records, granite)
- `K.building(86, -214, 136, -196, 5)` (Treasury, glass)

### 6.7 The Bourse (x -300..-220)

- `K.building(-300, -214, -220, -190, 6)` in marble. 8 columns at x -296 + 10k on z -190..-189.2,
  from y 2.4 to 9.5. Sign "THE BOURSE".
- Plinth: `B(-300, -0.5, -190, -220, 2.4, -176, 'granite')` with lips on its south face except
  x -284..-236.
- **Bourse Steps**: `stairSpot('z', -176, 1, -284, -236, 2.4, 0.43, 7, 0.42, {rails: [-272,
  -260, -248], hubbas: [-284.4, -235.6]})`. This is a 7-stair, 48 m wide, with 3 handrails and 2 hubbas.
  The run-up is the 14 m plinth. The roll-away is the slope (z -173..-140) into Mint Terrace.
- Bear statue plinth: `B(-232, 2.4, -186, -226, 3.2, -180)`, a manual pad with the statue decor on top.
  2 benches on the plinth.

### 6.8 Other buildings

- Ledger Tower: `K.building(-390, -214, -346, -176, 18)` in glass.
- Consolidated: `K.building(-196, -214, -150, -180, 12)`.
- Lamps on z -144 every 24 m from x -400 to -150.

North box estimate: about 60.

---

## 7. Part: fin_east — Exchange, Metro and Treasury [140, 360, -230, 230]

### 7.1 Observatory Promenade (x 214..226, z -214..-132)

- Ground berm from fin_plan. Granite top, concrete batters.
- Sloped ledges on the berm top: hubbas at x 215.5 and 224.5, w 0.6, kind 'Ledge', 0.45 above Hb(z),
  over z [-200,-190], [-176,-166] and [-152,-142]. For each, a = (x, Hb(z1)+0.45, z1), b = (x,
  Hb(z0)+0.45, z0), with z1 the higher end.
- Trees in planters every 16 m on the batter feet (x 206 and 234) and lamps at x 220 every 24 m.
  Keep the top width 214..226 clear.

### 7.2 Cascade terrace (x 196..244, z -132..-104, y 3.0)

- Drained basin: `K.pool(208, 232, -126, -110, [[rect(220, -118, 11, 7, 2.5), 1.3]], 3.0, 0.25)`, a
  1.3 m deep rounded bowl with coping rails.
- Benches along x 198 and 242. Jet decor (thin white cylinders) along z -104.6.
- Sign: none (the Nautilus is the sign).

### 7.3 Spillway (x 208..232, z -104..-76)

- Ground falls 3.0 to 0 over 28 m (10.7 %). This is the fast entry to the Nautilus.
- Cheek walls: hubba a (207.4, 3.5, -104), b (207.4, 0.5, -76), w 1.2, kind 'Ledge', black granite.
  Mirror it at x 232.6. These are 28 m downhill ledges 0.5 above ground.

### 7.4 Golden Nautilus (centre x 220, z -60)

- Kicker (gold hubbas, w 12, noRails):
  - K1: a (220, 0.45, -68.5), b (220, 0.02, -71)
  - K2: a (220, 1.3, -66), b (220, 0.45, -68.5)
  - Lip: `K.lip(214, -66, 226, -66, 1.3)`
- Gap: z -66..-61 (5 m) over flat ground.
- Landing: bank top `B(214, -0.3, -61, 226, 1.2, -60, 'marble', {edges: 'n'})`, with the
  down-bank hubba a (220, 1.2, -60), b (220, 0.02, -50), w 12, noRails (6.7°).
- Pedestals: west `B(206, -0.3, -63, 212.5, 1.6, -57)` (manual pad and a tape) and east
  `B(227.5, -0.3, -63, 234, 6.0, -57)` (the shell's foot).
- Shell decor: an upright log spiral in the plane z -60, centre (220, 11), r = 12.5 *
  exp(-0.2 * (θ + 0.4)) for θ from -0.4 to 8.5. Place spheres every 0.25 rad at (220 + r cos θ, 11
  + r sin θ, -60), radius 0.25 r, scale z 0.8, gold with metalness 0.85 and roughness 0.22.
  That is about 36 spheres, about 21.5 m tall. **Keep x 212.5..227.5 clear below y 4.5** (the arch over the gap).
- `P.landmark('Golden Nautilus', 220, 12, -60)`.
- Approach: down the spillway at about 9–10 m/s; at 9 m/s off a 1.3 m lip a 5 m gap is easy.
  From flat Metro Plaza it needs pushing to pushMax.

### 7.5 Spiral Rim (centre 262, -46)

- R(φ') = 15 * exp(-0.12 φ') for φ' from 0 to 2.5π. Point = (262 + R cos(π + φ'), -46 + R
  sin(π + φ')). It starts at (247, -46).
- About 24 chords (one per 0.33 rad): each is a level gold hubba at y 0.5, w 0.7, noRails, plus a
  centre `K.rail(p0 at 0.5, p1 at 0.5, 'Ledge')`. **No chaining**, so each chord is its
  own grind; the joins re-catch (equal y, angles under 20°).
- Extent x 247..272, z -58..-37. Keep 4 m clear around it.

### 7.6 Metro Plaza (x 150..300, z -98..-11) and Metro Steps

- Granite paving. Deck `B(150, -0.5, -44, 196, 1.5, -20, 'granite')`.
- Steps: `stairSpot('x', 196, 1, -38, -26, 1.5, 0, 5, 0.42, {rails: [-38.45, -25.55]})`. This is a 5-stair
  east off the deck, with rails on both sides.
- North bank: hubba a (173, 1.5, -44), b (173, 0.02, -49.5), w 14, noRails (15°).
- Deck lips on the east face outside the stairs, a ledge `B(156, 1.5, -32.4, 170, 1.95, -31.6)` on
  the deck, a planter `B(276, -0.3, -90, 290, 0.55, -80)` and a manual pad `B(240, -0.3, -30, 252,
  0.3, -22)`.
- NPC: skater loop round the plaza [[160, -60], [290, -60], [290, -20], [200, -20]].
- Peds: plaza loop (n 8).

### 7.7 Metro Central station and Metro Avenue

- Station body decor: `K.prop(146, 7.4, -12.5, 206, 15, 14.5)` (x 146..206, y 7.4..15, z
  -12.5..14.5) in glass. Columns 0.8 × 0.8 at x 150, 165, 180 and 195 at z -12.2..-11.4 and
  11.4..12.2, y 0..7.4. They sit on the avenue sidewalks, which is fine since they stand clear of the road.
- Overpass extension: `D.overpass(120, 146, -4, 8, 8.6)`. It meets the station body.
- Sign "METRO CENTRAL" on the station's west face at y 12.
- Metro Avenue: `K.street('x', 0, 140, 359.5, 0, [220], {rw: 7, sw: 4})`. The crossing x 220
  lies inside from..to, so the K.street cuts are fine here. Zebra at x 220.
- Traffic: **Metro**, path [[150, 0], [340, 0]], lane 3.2, n 4, speed 11.

### 7.8 Buildings

| name | K.building args |
|---|---|
| Meridian Tower | (146, -134, 186, -104, 24) |
| south-west office | (146, -214, 200, -200, 4) |
| Exchange court | (146, -172, 200, -142, 6) |
| Bourse Annex | (254, -136, 300, -100, 7) |
| east office | (306, -136, 346, -90, 10) |
| Exchange Tower A | (254, -212, 296, -160, 20) |
| Exchange Tower B | (304, -212, 346, -170, 14) |
| frontages z 22..54 | (146, 22, 186, 54, 6), (192, 22, 222, 54, 8), (228, 22, 262, 54, 5), (268, 22, 306, 54, 9), (312, 22, 344, 54, 6) |
| east ring block 1 | (146, 66, 190, 110, 8) |
| east ring block 2 | (146, 120, 190, 170, 5) |

Keep all buildings 2 m inside x 346 (the band begins at 348).

### 7.9 Car park

- `K.garage(146, 176, 190, 212, 5, 1)`, a 5 m roof deck.
- Roll-in: hubba a (190, 5, 200), b (204, 0.02, 200), w 10, kind 'Ledge' (19.6°, with both edges grindable).

### 7.10 Treasury Gardens (x 196..346, z 60..214)

- Grass (P.col). Humps are part of **fin_plan.ground** (HUMPS in 2.2); fin_east builds nothing for them:
  - A (226, 118), r 16, h 2.5
  - Treasury Mound (296, 150), r 22, h 3.2
  - C (236, 186), r 14, h 2.0
- Long Pool: `K.pool(202, 270, 70, 90, [[rect(236, 80, 32, 7, 1.5), 1.0]], 0, 0.5)`, a 1.0 m
  deep, 68 m long drained reflecting pool. Coping rails on all 4 sides.
- 10 benches, 24 trees (none on the hump crowns), 6 lamps.
- Sign "TREASURY GARDENS" on a low stone wall at (200, 0, 62).
- Peds: loop round the Long Pool (n 5).

East box estimate: about 85.

---

## 8. Part: fin_west — Planter Alley, Mint and Arena [-420, -140, -140, 230]

### 8.1 Planter Alley (trough z -40, x -404..-146)

- Ground from fin_plan. The floor is at y -1.6 over x -380..-166.
- Coping: `K.rail` with coping: true, along z -50 and z -30 (the lip line), x -378..-168.
- Terrace planters, angled brick (level hubbas, 6 m long, w 1.4, y 0.55, kind 'Ledge', color
  0x9a5e4c):
  - North terrace: from (x0, 0.55, -55) to (x0 - 5.2, 0.55, -51), with x0 = -176, -200, ..., -368 (every 24 m, 9 planters).
  - South terrace: mirrored, from (x0, 0.55, -25) to (x0 - 5.2, 0.55, -29).
- Floor planters (on the trough floor, top -1.05): 5 of them at x -200, -250, -300 and -340 (two at
  -300, z -42 and -38), angled ±25°, 5 m × 1.2 m, kind 'Ledge'.
- Building frontages (granite and brick, heights 6–14):
  - North, z -80..-56.5: x (-398, -352), (-346, -300), (-296, -276), (-264, -222), (-216, -172)
  - South, z -23.5..0: x (-398, -350), (-344, -296), (-290, -244), (-238, -196), (-190, -160)
  - The north gap x -276..-264 is the Mint passage.
- Arch sign "PLANTER ALLEY": decor posts at x -152 on z -57 and -23, with a beam at y 6.
- Peds: loops on both terraces (n 4 each). NPC: session skater on the north coping at (-260, 0, -50).

### 8.2 Mint Terrace

- `K.raisedPlaza(-300, -132, -240, -104, 1.2, 's')`: a 1.2 m plaza with stairs on its south side.
- The passage x -276..-264 from z -104 to -80, then down between the frontages to the north terrace.
- 4 benches and 2 ledges on top.

### 8.3 Alto Arena

- Reuse the Stadium code from mega3.js (lines 4–37) as a local function in fin_west, at cx -275, cz
  100, W 70, Dd 50, CH 6. The footprint is x -363..-187, z 31..169. It has 20-stairs at both
  ends, with the east one dropping toward x -186.
- Sign "ALTO ARENA" over the east entry.
- Car park paint, zc 190: x -387..-163, z 168..212, with bay lines as decor strips.
- Ticket booths: 3 × `K.prop` 3 × 3 × 3 at z 180, x -300, -275, -250.
- Peds: concourse loop (n 6).

West box estimate: about 125, of which the stadium is about 70.

---

## 9. Spots, lines, challenges, tapes, travel

### 9.1 Spots (P.spot by the owning part)

| name | x, y, z | yaw | builder | run-up / roll-away |
|---|---|---|---|---|
| City Hall Twelve | 40, 4.0, -176 | π | stairSpot | 26 m terrace / 25 m square |
| Council Drive | -2, 4.0, -186 | π/2 | hubba ledge | terrace / slope to x -86 |
| Treasury Ramp | 82, 4.0, -186 | -π/2 | hubba ledge | terrace / Treasury Walk |
| Bourse Steps | -260, 2.4, -182 | π | stairSpot | 14 m plinth / slope |
| Cascade | 220, 3.0, -108 | π | pool, cheek walls | promenade / spillway |
| Golden Nautilus | 220, 1.0, -75 | π | kicker gap | spillway / down-bank |
| Spiral Rim | 247, 0, -52 | 0 | chord rails | plaza / plaza |
| Metro Steps | 190, 1.5, -32 | -π/2 | stairSpot | deck / plaza |
| Planter Alley | -150, 0, -44 | π/2 | trough, planters | ring / gate |
| Alto Arena Twenty | -203, 6, 100 | -π/2 | stadium stairs | concourse / ring |
| Boulevard Median | -40, 0.15, 148 | π | ledges | ring / gate |
| Bank Wall | 85, 0, 172 | π | bank-to-wall | south ring / plaza |

### 9.2 Lines

1. **Civic Line:** in from the switchback gate, down Switchback Road (curb grinds), carve onto Council
   Drive's low end and push up it, then along the terrace ledge, down the 12-set (rail, then kink) and
   across Civic Square ledges. Cross the ring at x 40 into Downtown's north avenue.
2. **Treasury Line:** from the terrace, grind the Treasury Ramp ledge (58 m) and push along
   Treasury Walk. Carve up the promenade batter, roll the Cascade basin, take a spillway cheek wall,
   jump the Shell Gap and the marble bank, then round the Spiral Rim. Finish at the Long Pool or the car park roll-in.
3. **Alley Line:** from Downtown's z -40 street, cross the ring and drop into the trough at x -150.
   Then wall-ride the transitions, hit the floor planters and transfer to the terrace planters, then out
   the planters gate.
4. **Bourse–Mint Line:** Bourse Steps handrail, then the slope to Mint Terrace, its stairs and the
   passage, then into the alley via the north terrace planters.
5. **Boulevard Line:** Bank Wall, then the courthouse ledges, the south ring curb, the four median ledges
   in a row and out the boulevard gate.

### 9.3 Challenges (from and to boxes are [x0, z0, x1, z1, yMin, yMax?])

| id | name | kind | params |
|---|---|---|---|
| fin-twelve | Kickflip the City Hall Twelve | trick 'Kickflip' | at [40, 4, -170.5]; go [36, 4, -180, π]; from [30, -176, 50, -169.8, 3.6]; to [28, -165.5, 52, -145, -1, 1.2] |
| fin-twelve-rail | City Hall Handrail | grind, rail 'Handrail' | at [40, 4.0, -171]; area [38.5, -171, 41.5, -161]; go [40, 4.0, -180, π] |
| fin-twelve-feeble (hard) | Feeble the City Hall Hubba | grind, rail 'Hubba', grind 'Feeble' | at [28.9, 4.4, -171]; area [27.5, -171, 52.5, -164.5]; go [28.9, 4.0, -180, π] |
| fin-shell-gap | The Shell Gap | gap | at [220, 1.3, -66.5]; from [214, -71, 226, -66, 0.3]; to [213, -61, 227, -50, 0, 1.5]; go [220, 3, -100, π] |
| fin-shell-tre (hard) | 360 Flip the Shell Gap | trick, tricks ['360 Flip'] | same from and to as fin-shell-gap |
| fin-spiral | Round the Shell | line, pts 1500 | area [245, -63, 279, -29]; need [['grind', 3]] |
| fin-cascade | Cascade Walls | grind, rail 'Ledge' | at [207.4, 3.5, -103]; area [206, -104, 234, -76]; go [214, 3, -110, π] |
| fin-alley | Alley Cat | score, pts 4000 | area [-404, -56, -146, -24] |
| fin-arena-heel (hard) | Heelflip the Arena Twenty | trick 'Heelflip' | at [-195, 6, 100]; from [-199, 92, -195.2, 108, 5.6]; to [-186.5, 90, -170, 110, -1, 0.5]; go [-203, 6, 100, -π/2] |
| fin-treasury-speed | Treasury Run | speed 9.7 m/s (35 km/h) | area [80, -190, 140, -182]; go [70, 4, -186, -π/2] |

Owners: fin-twelve*, fin-treasury-speed in north; fin-shell*, fin-spiral, fin-cascade in east;
fin-alley, fin-arena-heel in west.

### 9.4 Tapes

| at | where | owner |
|---|---|---|
| (-352, 6.0, 44) | arena concourse corner | west |
| (209, 1.6, -60) | west Nautilus pedestal | east |
| (186, 5.0, 208) | car park roof | east |
| (210, -1.0, 80) | Long Pool floor | east |
| (-372, -1.6, -35) | alley floor west end | west |
| (-296, 2.4, -184) | Bourse plinth | north |

### 9.5 Traffic, peds and NPCs (summary)

- Traffic: Metro (east), Boulevard (core) and Switchback (north) as above. Downtown ring traffic is kept as it is.
- Peds: Civic Square, Metro Plaza, alley terraces, boulevard sidewalks, Long Pool, arena concourse, Sunken Garden.
- NPCs: Metro Plaza loop skater; sessions at the City Hall terrace ledge, the alley north coping and median ledge 2.

### 9.6 Fast travel (index.js only)

| type | name | x, y, z | yaw |
|---|---|---|---|
| district | Financial Core | 61, 0.15, 71 | 0 (faces the Corner Skate Shop; this is the map spawn) |
| spot | City Hall | 40, 4.0, -176 | π |
| spot | Golden Nautilus | 220, 3.0, -108 | π |
| spot | Planter Alley | -150, 0, -44 | π/2 |
| spot | Alto Arena | -275, 6, 44 | 0 |
| spot | Central Plaza | 19, 1.65, -22 | π |
| spot | Corner Skate Shop | 61, 1.05, 64 | 0 |
| spot | Library Lane Skates | -106, 1.95, -94.5 | 0 |
| spot | Bank Street Boards | -93.5, 1.05, 19.5 | π/2 |

There are no 'park' entries: fin has no skatepark (Treasury Gardens is a public garden, not a park).
The contract's rule of a skate shop and travel point per district is met by Downtown's three shops.

---

## 10. Signs and landmarks

Signs (8): CITY HALL (north), THE BOURSE (north), METRO CENTRAL (east), TREASURY GARDENS
(east), ALTO ARENA (west), PLANTER ALLEY (west), GRAND HOTEL MERIDIANA (core), BANK OF THE ALTO
(core). Downtown's signs and shop signs are not counted.

Landmarks: Golden Nautilus (220, 12, -60) and the City Hall dome (40, 21, -205).

---

## 11. Budget (new content, on top of Downtown)

| item | fin new | with Downtown | budget |
|---|---|---|---|
| boxes | about 395 (core 125, north 60, east 85, west 125) | about 984 | 1100 |
| sloped blocks | about 110 | about 266 | — |
| grind lines | about 480 | about 1200 | 700 (over) |
| buildings | about 37 | about 60 | 70 |
| fine ground | about 29k m² | +65k m² Downtown K.fine | 60k |
| triangles | about 300k | about 1.25M | 450k (Downtown alone is about 950k) |

Downtown alone measures 717 grind lines and about 950k triangles, and adds 1.3 s of load. See
concerns. If grind lines must be cut, drop in this order: the Spiral Rim chord rails (keep the
hubbas), the alley floor planters, Treasury Gardens pool copings and the promenade ledges.

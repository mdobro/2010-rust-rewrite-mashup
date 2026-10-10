# Boardwalk West (`bw`) — design

Rect x -1000..0, z 910..1350 (sea from z 1180, water y -46). Parts: `bw_west`, `bw_park`, `bw_gardens`, `bw_east` + `bw_plan`.
All names below are made up. Coordinates are world metres. Yaw: 0 faces -z, π faces +z, -π/2 faces +x, π/2 faces -x.

---

## 1. Concept

The bottom of the city: the place every downhill run in Porto Alto ends up. The Old Town Steep and the Arroyo spillway both drop
into a long, flat, sunny harbour strip that is all about **carrying speed sideways**: a 440 m Slappy Strip of low
wooden curbs along the boardwalk, a public **Harbour Bowl Complex** you can see from the bottom of the Steep, and two
sunken concrete worlds below the quay level — the **Spillway Outlet** (the arroyo's concrete channel finishing in a stilling
basin you can skate through under Harbour Road) and the hidden **Drydock** (a 6 m deep stone dock with stepped altars,
a big wall transition and chains to hop).

Three bands, north to south:

1. **Quay Road band (z 910..944)** — open asphalt/quay where both gates land. Nothing in the way; the Steep and the spillway
   pour straight into it.
2. **Bench North (z 944..1096, y -40.60)** — Harbour Road (z 1020) runs east-west through it, the skatepark sits north of
   it, the gardens / lido / terrace / ferry terminal south of it.
3. **The Front (z 1096..1180, dropping to y -41.80)** — a 3.75 % ramp down to the boardwalk, the Slappy Strip, and piers
   out over the sea (Long Pier, Wheel Pier, Ferry Pier, West Mole).

Sightlines: the **Sea Wheel** (46 m Ferris wheel on Wheel Pier, x -128) is the landmark you see coming down the Steep;
the **Gull Point Light** (x -982 on the West Mole) marks the far west and the Drydock. Both are in `landmarks`.

---

## 2. Height plan

### 2.1 The base

`portoBaseH` across bw is nearly flat: B(910) = -40.20, B(920) = -40.267, B(1020) = -40.933, B(1150) = -41.80,
B(1180) ≈ -41.96, then the sea floor drops to -52. Edge hills: for |x| > 975 and z < 1150 the base rises
`22*sm(edge/30)*sm((1150-z)/60)`. That only touches the strip x -1000..-975 (west map edge, no band) — we keep it as a
green hillside behind the boatyard and do not build there.

The north border (z 910) and east border (x 0) are banded (BAND 12). The west (x -1000) and south are map edges.

### 2.2 Ground formula (bw_plan, written by index.js)

```
YN = -40.60          // Bench North
YS = -41.80          // Bench South / boardwalk (= base at z 1150)
Bz(z) = portoBaseH(-500, z)      // base without edge hills

Qz(z) =
  z <= 920           : Bz(z)
  920 < z <= 944     : lerp(Bz(920) = -40.267, YN, (z-920)/24)     // 1.4 % down
  944 < z <= 1096    : YN
  1096 < z <= 1128   : lerp(YN, YS, (z-1096)/32)                    // 3.75 % down
  1128 < z <= 1180   : YS

Q(x,z) = z > 1096 ? lerp(YN, Qz(z), clamp((x+824)/40, 0, 1)) : Qz(z)
         // the far west (x <= -824) stays at YN down to the sea: the Drydock rim, Mole root and Boatyard stay level;
         // between x -824..-784 it ramps to the Front at about 3 %.

ground(x,z) = z > 1180 ? base(x,z) : Q(x,z) + (base(x,z) - Bz(z))   // keeps the edge hills
```

Every knot is on a multiple of 8 (920, 944, 1096, 1128, x -824/-784), so the 8 m base mesh is exact for the plain ground.
Gate fit, checked against the band:

| gate | border | base | Q at border | notes |
|---|---|---|---|---|
| spillway (-700, 910) | N | -40.20 | -40.20 | Q = base for z <= 920; flat at the corridor |
| steep (-200, 910) | N | -40.20 | -40.20 | same |
| harbourRd (0, 1020) | E | -40.93 | -40.60 | 0.33 m difference blended over 12 m (2.75 %), inside the band |
| boardwalk (0, 1150) | E | -41.80 | -41.80 | exact |

Within 12 m of the N and E borders the engine blends `lerp(base, ground, sm(dist/12))`. Nothing is built in the band
(no `K.feat`, no boxes over 0.3 m). Corridor clear zones: x -712..-688 and -208..-192 for z 894..926; z 1012..1028 and
1144..1156 for x -22..0.

### 2.3 Sunken features (K.feat 'min', each part owns its own)

| feature | rect | floor | owner |
|---|---|---|---|
| Spillway Outlet | x -728..-672, z 944..1136 | YN -> -45.60 | bw_west |
| The Drydock | x -962..-871, z 1056..1170 | -46.20 | bw_west |
| Eel Run (snake) | x -432..-212, z 944..990 | YN -1.2 .. -3.4 | bw_park |
| Deep End / kidney / tidepool | x -560..-436, z 946..996 (pools) | down to YN-3.4 | bw_park (K.pool) |
| Old Sea Baths lido | x -647..-597, z 1053..1075 | YN -1.2 .. -3.2 | bw_gardens |

### 2.4 P.region (fine ground)

| region | rect | res | m² |
|---|---|---|---|
| Eel Run | -432, -212, 944, 992 | 1 | 10,560 |
| Drydock west (altars/rim) | -968, -952, 1048, 1176 | 1 | 2,048 |
| Drydock east transition | -888, -864, 1048, 1176 | 0.5 | 3,072 |
| Outlet end wall | -728, -672, 1112, 1144 | 2 | 1,792 |
| Lido | -648, -596, 1048, 1080 | 0.5 | 1,664 |
| Mini ramp (feat 'add') | -560, -536, 944, 968 | 0.5 | 576 |
| **total** | | | **~19,700 / 60,000** |

The outlet banks and Drydock apron are linear and fit the 2 m / 8 m mesh. K.pool pools carry their own res (pass 0.5).

### 2.5 P.col / P.surface

- Asphalt: Quay Road (z 925..935), Harbour Road, the lanes, the car park.
- Plank (0x9a7a55): the boardwalk z 1142..1180, pier decks (boxes), Long Pier.
- Concrete (0xb8b4aa): wherever `h < Q - 0.05` (the outlet, drydock, snake, pools); smooth surface.
- Quay stone (0xa8a294): z 910..925 and 935..944.
- Lido tile band: blue (0x5c9fc4) for h < YN - 0.05 inside the lido rect.
- Lawn (0x6f9a4f, rough): the gardens lawns, the edge hill x < -975.
- Gravel (rough): the Boatyard x -968..-840, z 944..1010.

---

## 3. Layout

### 3.1 ASCII sketch (x left to right -1000..0, z top to bottom 910..1300; 1 char ≈ 20 m x, ≈ 10 m z)

```
z  x: -1000      -900      -800      -700      -600      -500      -400      -300      -200      -100        0
910   |  hill  .  .  .  .  .  .  .  . [SPILLWAY gate] .  .  .  .  .  .  .  .  .  .  .  . [STEEP gate] .  .  .|
930   |==QUAY ROAD========================||=========================================================||======|
944   |   BOATYARD sheds    |NetLoft| ...  |O|  THE SLAB   | BOWL YARD (mini, Deep End,   |  EEL RUN snake <-S0|
960   |   hull yard / lift  | Lane  |      |U|  plaza      |  kidney, tidepool)  Park Hse |  (head at Steep)  |
990   |  gravel             |   |   |      |T|-------------+------------------------------+----| ICE HOUSE dock |
1006  |                     |   |   |      |L|  seat wall                                     | S |  car park  |
1020  |==HARBOUR ROAD=======|===+===|=====[BRIDGE]==========+(zebra -510)====================|=T=|==========|>harbourRd
1036  |  fence  |Net Lofts| |Chandl.|      |E|BathHse|gate|BathHse| ARCADES porch + SALTWATER  | E | FERRY      |
1056  | DRYDOCK apron      |  Loft  |      |T| LIDO pool  tower |  lawn  BANDSTAND   ANCHOR GAP| E | TERMINAL   |
1080  | rim   altars      | Alley   |      | | bleachers         |  PROMENADE TERRACE (-420..-252)| P | podium  |
1100  |  ==dock floor==   |         |      |B|  baffles       ramp 3.75 % down  Gull Steps    |   |  (Eight)  |
1120  |  keels  chains   T|         |      |A|  end wall                                     | foot|          |
1142  |=================BOARDWALK + SLAPPY STRIP (curbs z 1162.4..1163) ======================================>|boardwalk
1176  |caisson| quay wall / sea wall coping / bollards z 1177 ===================================================|
1200  |MOLE |                                 ~ ~ sea ~ ~       |LONG PIER|                  |WHEEL|  |FERRY|      |
1250  |MOLE |                                                    |  T-head |                  |PIER |  |PIER |      |
1290  |LIGHT|                                                    |bait shk |                  | (Sea Wheel)        |
```

### 3.2 Streets

- **Quay Road** — z 925..935, x -968..-24, P.col asphalt only (no K.street: the ground slopes 1.4 % here and it has to stay
  kerbless so both gate corridors spill straight across it). It crosses the outlet head at grade: the outlet floor equals Q
  for z <= 944, so it is a ford.
- **Harbour Road** — z 1020, `K.street('x', 1020, x0, x1, YN, crossings, {rw: 6, sw: 4})` in segments:
  - west x -968..-730, crossing [-790] (Net Loft Lane);
  - **Outlet Bridge** x -730..-672: deck `K.B(-730, -41.40, 1010, -672, -40.60, 1030, 'garage')` (0.8 m thick slab,
    soffit -41.40, 2.35 m to 3.3 m clear above the outlet floor), sidewalk boxes `K.B(.., YN, .., YN+0.15, ..)` on
    z 1010..1014 and 1026..1030 with chamfered ends, concrete parapets 0.9 m on z 1010..1010.4 and 1029.6..1030, two lamps;
  - gardens x -672..-212, crossing [-510] (painted zebra, curb ramps);
  - east x -212..-12, crossings [-200, -40];
  - x -12..0: P.col only (gate band; no curbs).
- **Steep Street** (x -200): z 910..944 P.col; z 944..1096 `K.street('z', -200, 944, 1096, YN, [952, 1020], {rw: 5, sw: 3})`.
  The 952 crossing opens a curb-free mouth z 944..960 straight into the Eel Run head. z 1096..1128 the road follows the
  3.75 % ramp (P.col only) with sloped 'Curb' hubba sidewalk ledges each side; z 1128..1142 the **Steep Foot** plaza where it
  meets the boardwalk.
- **Net Loft Lane** (x -790): `K.street('z', -790, 944, 1096, YN, [1020], {rw: 5, sw: 3})`, plus P.col z 930..944 and
  1096..1142.
- **Ice House Lane** (x -40): `K.street('z', -40, 944, 1096, YN, [1020], {rw: 4, sw: 3})`, plus P.col.

All curbs are 0.15 m (K.street default) with curb ramps at every crossing. Kerbless P.col roads elsewhere.

### 3.3 Gates

- **spillway (-700, 910)** — arroyo's 40 m channel floor reaches base at z 870 and is flat to z 910. bw continues it as flat
  quay (z 910..944, falling 1.4 %), then the **Spillway Outlet** opens at z 944 centred on x -700: a 24 m floor (x -712..-688)
  that starts at grade and sinks to -45.6. Nothing stands in x -712..-688 for z 894..944.
- **steep (-200, 910)** — Old Town's Steep road (x -205..-195) ends on base at z 910. bw keeps x -208..-192 clear for
  z 910..944 and carries Steep Street on to the boardwalk. The rider rolls straight in at 7–10 m/s.
- **harbourRd (0, 1020)** — Harbour Road runs flat at YN to x -12, then the band blends to -40.93. Corridor z 1012..1028
  is clear: no lamps, no curbs past x -12.
- **boardwalk (0, 1150)** — the boardwalk planks (P.col) run at YS = base to the border. Slappy curbs stop at x -24.
  Corridor z 1144..1156 is clear.

---

## 4. Spots

Heights: T = top, B = bottom. Run-up and roll-away are on flat ground unless noted.

| # | spot | where | size / heights | kit | run-up / roll-away |
|---|---|---|---|---|---|
| 1 | **Eel Run** snake | S0(-218,952) → S7(-418,966) | 233 m long, floor 3.6 m, depth 1.2 → 3.4, wall R 4 | K.feat 'min' + Coping rails | gate steep → 34 m of Steep Street; ends in the pocket round S7 |
| 2 | **Deep End** clover | c(-500,968,9.5) D3.4 + 2 lobes R 6.5 D 2.4 | 34 × 42 m | K.pool res 0.5, coping rails | open deck all round, 6 m min |
| 3 | **Kidney** | c(-454,962,6) D2.0 + c(-446,975,7) D2.8 | 20 × 27 m | K.pool | deck |
| 4 | **Tidepool** mini bowl | c(-540,990,5.5) D1.5 | 11 m | K.pool | deck |
| 5 | **Mini ramp** | x -554.26..-539.74, z 950..964 | 1.6 m, R 2.4, decks 2 m | feat 'add' + boxes + Coping rails | n/a |
| 6 | **The Slab** five-stair | x -632, z 954..966, T1 -39.10 → YN | 5 × 0.42 m (1.5 m drop) | stairSpot rail 960, hubbas 953.6 / 966.4 | 16 m deck behind; 64 m flat in front |
| 7 | Slab bank hubba | x -648, z 972 → 977.5 | 30 m wide, 1.5 m | hubba as bank | deck → plaza |
| 8 | Slab pyramid / pads / flatbar / bankToWall | x -622..-582, z 948..988 | 0.22–1.4 m | K.B, rail, bankToWall | plaza |
| 9 | **Spillway Outlet** | x -728..-672, z 944..1136 | floor 24 m, banks 16 m (≈ 19°), 0 → 5 m deep | feat 'min' | gate spillway; end wall pops out at YS |
| 10 | Outlet weir hump | z 980, floor | 0.6 m hubba pair | hubba | in the floor |
| 11 | Stilling basin baffles | z 1100..1110.4 | 5 blocks 2.4 × 2.4, 0.6–0.8 m; end sill 0.4 | K.B 'concrete' nswe | floor 24 m wide |
| 12 | Outlet guard rail | x -729, z 948..1004 / 1036..1092 | Handrail, Q+1.0 | rail | along the west lip |
| 13 | **The Drydock** | x -962..-871, z 1056..1170 | floor -46.20 (5.6 m below rim) | feat 'min' + boxes | roll-in apron 14 % from z 1056 |
| 14 | Drydock altars A/B/C | x -958..-940, z 1100..1168 | tops -42.0 / -43.4 / -44.8 | K.B 'garage' | floor 80 m long |
| 15 | Dock Stairs | x -958 / -952 / -946 / -940 | 4 flights × 5 × 0.4 | stairSpot + rail at z 1110.45 | n/a |
| 16 | Drydock east transition | x -879..-872.1 | R 7, 78° at the top, coping | feat + Coping rail | 80 m of floor |
| 17 | Keel blocks / bilge beams / chains | floor | 0.45–0.7 m | K.B + rails (Chain) | floor |
| 18 | **Old Sea Baths** lido | x -646..-598, z 1054..1074 | D 1.2 shallow end → 3.2 deep end | poolS.rect + feat + coping | 4 m deck round |
| 19 | Diving tower | x -594..-590, z 1060..1068 | top YN+3.0, 10 stairs | box + board + stairSpot | lands in the deep end |
| 20 | Arcade porch slappy | x -572..-432, z 1030..1034 | top YN+0.30 (0.30 m) | K.B 'wood' edges n | 140 m of sidewalk |
| 21 | Bandstand | x -507..-497, z 1075..1085 | 1.7 m, 4-stair N and S | K.B nswe + stairs | lawn paths |
| 22 | Promenade Terrace | x -420..-252, z 1062..1100 | T2 -39.70 (0.9 m deck) | K.B 'marble' ew | bank hubba N, steps S |
| 23 | Gull Steps | z 1100, x -366..-306 | 4 × 0.45 m, rails at -351/-336/-321 | stairSpot | 30 m ramp down to the boardwalk |
| 24 | **Anchor Gap** | cx -226, cz 1072 | ramp to deck -37.90, gap over plinth, landing bank | explicit boxes / hubbas | Harbour Road |
| 25 | **Slappy Strip** | z 1162.4..1163, x -968..-24 | 0.28 m above YS, ~28 m segments | K.B 'wood' edges ns | 440 m of boardwalk |
| 26 | Long Pier handrails | x -341.7 / -330.3, z 1182..1274 | YS+1.0 | Handrail | pier deck 12 m |
| 27 | **Ice House** loading dock | x -184..-122, z 990..994 | YN+1.2, ramp W, 4-stair E | K.B + hubba + handrail | yard to z 1010 |
| 28 | **Terminal Eight** | x -170, z 1052..1068, T3 -38.20 → YN | 8 × 0.4 (2.4 m drop) | stairSpot rails 1056/1064, hubbas | 50 m podium behind; Harbour Road in front |
| 29 | Terminal Bank | x -120, z 1040 → 1033 | 24 m wide, 2.4 m | hubba as bank | Harbour Road |
| 30 | Terminal east ramp | x -54, z 1042 → 1068 | 3 m, rail at x -52.3 | hubba + handrail | Ice House Lane |
| 31 | Sea Wall Coping | z 1176..1180 | quay top at Q, edges 's' | K.B | boardwalk |


---

## 5. Lines

1. **Steep to Bowl** — steep gate → straight down Steep Street → the 952 crossing mouth → drop into the Eel Run head →
   pump 230 m through 7 bends (coping grinds on S2-S3, S4-S5) → carve out of the pocket at S7 → over the deck into the Deep
   End → Kidney → Slab flatbar → Slab five → roll south across Harbour Road onto the outlet bank.
2. **Spillway Express** — arroyo spillway → Quay Road ford → outlet floor (sinking 5 m over 150 m) → weir hump → under the
   Harbour Road bridge → slalom the baffles → end-wall transition pops you out at YS on the boardwalk → Slappy Strip east
   (10+ curbs) → boardwalk gate into the ship district.
3. **Gull Steps** — Steep → right on Harbour Road → Anchor Gap (ramp, gap over the statue, landing bank) → west along the
   terrace ledges → Gull Steps rail → down the ramp → onto Long Pier → handrail both sides → T-head.
4. **Ferry Rush** — Harbour Road east → Terminal Bank up → podium queue ledges → Terminal Eight (or the east ramp rail) →
   Ice House Lane → Ice House dock edge → harbourRd gate.
5. **Dry Run** — Boatyard cradle rails → hull hip → fence gap → drydock roll-in → full-speed across the floor → east
   transition (coping) → back to the altars → step down A→B→C or gap them → chain hops → out up the Dock Stairs.

---

## 6. Skatepark — the Harbour Bowl Complex (`bw_park`, x -672..-212, z 910..1010)

Deck level YN, enclosed by seat walls: `K.Bg` 0.45 m at z 939.4..940 and 1005.4..1006, with 8 m gaps at x -640, -560,
-500, -440, -320, -230 (north wall) and -600, -510, -380 (south wall) so the Quay Road and Harbour Road both feed in.
Lamps every 20 m along both walls. Benches against the walls.

### 6.1 The Slab (street plaza, x -668..-568)

- Deck: `K.B(-664, YN-0.5, 948, -632, T1 = -39.10, 972, 'marble', {edges: 'nsw'})` (1.5 m).
- Five-stair: `K.stairSpot('x', -632, 1, 954, 966, T1, YN, 5, 0.42, {rails: [960], hubbas: [953.6, 966.4]})`, lips on
  the deck edge either side (z 948..953.2 and 966.8..972).
- Bank hubba off the south face: `a(-648, T1, 972)` → `b(-648, YN+0.02, 977.5)`, w 30.
- Deck ledge: `K.B(-660, T1, 950, -640, T1+0.45, 951, 'marble', nswe)`; planter 4×4 at (-656, 966).
- Manual pads: (-622, 984, -608, 988, 0.22) and (-600, 952, -592, 958, 0.30).
- Flatbar: x -616..-596 at z 962, top YN+0.40 ('Rail').
- Pyramid: x -588..-582, z 976..982, 1.0 m top with 4 banks (hubbas) of 2.5 m each side.
- `K.bankToWall(-620, 948, -604, 1.4, 4)` along the north seat wall.
- Kicker (0.4 m) at (-580, 960) facing -x to a 0.5 m ledge `K.B(-576, YN, 956, -570, YN+0.5, 964, 'marble', nswe)`.

### 6.2 Bowl Yard (x -564..-432)

- **Mini ramp** x -554.26..-539.74, z 950..964: K.feat 'add' with `arc(d, 2.4, 1.6...)` (1.6 m high, R 2.4),
  2 m decks (`K.B` 'wood' at each end, top YN+1.6), Coping rails at both lips, 2 m flat bottom. Fine region res 0.5.
- **Deep End** clover: lobes c(-500, 968, R 9.5) D 3.4, c(-484, 958, 6.5) D 2.4, c(-484, 980, 6.5) D 2.4;
  `K.pool(-511, -476.5, 947.5, 989.5, lobes, YN, 0.5)`. Hip where the lobes meet. Coping rails sampled round each
  lobe, skipping the arcs that lie inside another lobe.
- **Kidney**: c(-454, 962, 6) D 2.0 and c(-446, 975, 7) D 2.8, `K.pool(-460.5, -438.5, 955.5, 982.5, ...)`.
- **Tidepool**: c(-540, 990, 5.5) D 1.5.
- Park House: `K.building(-428, 990, -414, 1002, 1)` (toilets/kiosk, blue), sign HARBOUR BOWL on its roof edge facing
  north (-z), rotY π.

### 6.3 Eel Run (snake, x -432..-212)

- Centreline polyline S0(-218, 952), S1(-236, 952), S2(-266, 972), S3(-300, 954), S4(-334, 976), S5(-366, 956),
  S6(-396, 978), S7(-418, 966). Arclength s at the vertices: 0, 18, 54.06, 92.53, 133.03, 170.77, 207.97, 233.03.
- Depth `D(s) = s <= 18 ? 1.2*s/18 : 1.2 + 2.2*(s-18)/215.03` (1.2 m at S1, 3.4 m at S7; the floor itself falls
  2.2 m over 215 m ≈ 1 %: free speed on top of the pumping).
- Cross-section at distance r from the centreline: floor `YN - D` for r <= 1.8; wall `YN - D + arc(r - 1.8, 4, w)` with
  `w = sqrt(16 - (4 - D)^2)`; outside the wall, YN. Use the nearest segment (min distance) and the s of the projection.
- End pocket round S7: floor radius 3, depth 3.4, coping radius ≈ 6.95.
- The head S0..S1 is a shallow 1.2 m entry trough lined up with the Steep crossing mouth (z 944..960).
- Coping rails: both sides along S2-S3 and S4-S5 (the long straights), and the pocket ring.
- `K.feat(-432, -212, 944, 990, fn, 'min')`; `P.region(-432, -212, 944, 992, 1)`.

---

## 7. Buildings and dressing

### Landmarks (`landmarks`, size = full extents)

- **Sea Wheel** — `at [-128, YS, 1240], near 160`: rim disc `sphere [46, 46, 1.6]` at [0, 24, 0] (0xe8e4da); hub
  `cyl [3, 2.4, 3]` red (0xc8432f) at [0, 24, 0] rotated; two A-frame legs `box [1.2, 26, 1.2]` at [±8, 12, ±2]
  (0x8a8f96); boarding hut `box [16, 3, 16]` at [0, 1.5, 0].
- **Gull Point Light** — `at [-982, YN, 1288], near 140`: white `cyl [4.4, 18, 4.4]` at [0, 9, 0]; red band
  `cyl [4.6, 3, 4.6]` at [0, 12, 0]; lantern `cyl [3, 2.4, 3]` 0xffe9a8 at [0, 19.2, 0]; red `cone [3.6, 2.4, 3.6]`
  at [0, 21.6, 0].
- Built geometry under both: the Sea Wheel decor (ring of 24 thin boxes + spokes + 12 gondolas, axle (-128, YS+24, 1240),
  radius 22, in the x-y plane), leg boxes; the lighthouse base box 6×6×1 + decor tower.
- The **Anchor** statue (mega45 parts, rotated -π/2) is a local landmark, not in `landmarks`.

### Signs (8 D.sign)

| text | at | rotY |
|---|---|---|
| HARBOUR BOWL | Park House roof (-421, YN+4.4, 989.9) | π (faces -z / the road north) |
| OLD SEA BATHS | over the bath-house gate (-622, YN+4.2, 1035.9) | π |
| FERRY TERMINAL | terminal building north face (-123, T3+9.5, 1057.9) | π |
| ICE HOUSE | Ice House south face (-153, YN+9.0, 990.1) | 0 |
| DRY DOCK 2 | caisson-side gantry (-916, YN+3.0, 1044) | π |
| GULL POINT BOATYARD | shed 1 south face (-935, YN+8, 984.1) | 0 |
| THE ANCHOR | plinth face (-226, -40.0, 1069.8) | π |
| SEA WHEEL | boarding platform (-128, YS+3.5, 1231.9) | π |

Shop signs (P.shop) do not count against D.sign.

### Shops (2)

- **Saltwater Skates** (arcade building x -522..-498): `P.shop({ name: 'Saltwater Skates',
  sign: [-510, YN+0.3+3.85, 1033.96, Math.PI, 7], awning: [-516, 1032.4, -504, 1034, YN+0.3+2.2],
  zone: [-514, 1030.8, -506, 1033.8], door: [-510, YN+0.3, 1033.8] })`. Travel 'spot' at (-510, YN+0.15, 1028, yaw π).
- **Chandlery Skate Supply** (x -778..-742, z 1036..1062, K.building 2 floors 0x2f5d8a 'brick'): `sign: [-760, YN+3.85,
  1035.96, Math.PI, 7], awning: [-766, 1034.4, -754, 1036, YN+2.2], zone: [-764, 1032.8, -756, 1035.8],
  door: [-760, YN, 1035.8]`. Travel 'spot' at (-760, YN+0.15, 1031, yaw π).

### Buildings (≈ 25 K.building, the rest K.B 'building')

- Boatyard sheds K.building(-960, 948, -910, 984, 3, 0x9aa3a8, 'metal'), (-900, 948, -856, 976, 2); travel-lift portal (2
  legs + beam boxes, 9 m) at x -880, z 990; hull on cradles (decor) + cradle rails 0.5 m ('Rail') and a hull hip (two
  hubbas 0.8 m); timber stacks 0.6 m.
- Net Lofts K.building(-862, 1040, -840, 1100, 2, 0x8c5a3c) and (-824, 1040, -802, 1100, 2, 0x6b4c3a); Loft Alley between
  them with 0.9 m loading platforms `K.B(-840, YN, 1050, -837, YN+0.9, 1090, 'wood', 'e')` and mirror.
- Chandlery (shop 2).
- Bath house wings K.building(-664, 1036, -636, 1046, 1, 0xe8e4da) and (-608, 1036, -580, 1046, 1), gate gap x -636..-608.
- Arcades x -572..-432, z 1034..1060: five K.building, 2 floors, colours 0x9fd8c4, 0xf2a488, 0xf3d98a (shop), 0x9cc7e6,
  0xc8b4dc; tex 'stone'.
- Park House (1 floor).
- Ice House K.building(-186, 948, -120, 990, 3, 0xb9a88f, 'brick').
- Ferry terminal K.building(-150, 1058, -96, 1088, 3, 0xcfd2d6, 'office') on the podium (placed with K.B 'building' at T3
  since it stands on a box).
- On piers: bait shack `K.B(-322, YS, 1280, -312, YS+3.4, 1290, 'building', {color: 0xd4a017, tex: 'wood'})`, ferry ticket
  kiosk, wheel hut — all K.B 'building'.

### Trees, lamps, furniture

- Palms along Harbour Road both sidewalks every 16 m (K.street), palms on the gardens lawns (x -470..-260, 12 of them),
  pines on the edge hill (6). Total trees ≈ 90.
- Lamps: K.street every 16 m; the boardwalk lamps every 24 m at z 1141 (37); park walls 20 m.
- Benches along the boardwalk z 1140.5 (every 30 m, facing the sea), at the bandstand, terrace and park.
- Bollards every 12 m at z 1177 (0.6 m metal boxes, nswe), skipping pier mouths and x > -24.
- Mooring chains (Chain rails) between rim bollards along the drydock, quay ladders (decor).
- Parked cars: Harbour Road parking lanes, the car park (x -112..-50, z 948..1006, 6 bays of parking blocks 0.15 m).
- Gardens staggered planter run (0.45 m, 4 boxes) down the ramp x -470..-440.
- Boats: decor hulls moored off the boardwalk at z 1190..1230 (no collision; in the sea).

---

## 8. Challenges, tapes, traffic, peds, npcs, fast travel

### Challenges (10)

| id | name | kind | spec | hard |
|---|---|---|---|---|
| bw-snake-speed | Eel Run Express | speed | 9.7 m/s (35 km/h) inside box [-432, 944, -212, 990, -45, -40] | |
| bw-deep-coping | Deep End Coping | grind | rail kind Coping inside [-512, 946, -474, 991, -41, -40] for 3 s | |
| bw-anchor-gap | Anchor Gap | gap | from [-229, 1053, -223, 1070, -38.3, -37.5] to [-229, 1073, -223, 1084, -40.6, -38.2] | |
| bw-terminal-kf | Kickflip the Terminal Eight | trick | Kickflip from [-172, 1052, -168, 1068, -38.5, -37.8] landing below -40 | |
| bw-slappy-line | Slappy Strip | line | 3 grinds on Slappy curbs in one line, 2,500 pts | |
| bw-pier-rail | Long Pier Rail | grind | Handrail in [-343, 1182, -329, 1274, -42, -40] 4 s | |
| bw-slab-heel | Heelflip the Slab | trick | Heelflip off [-634, 954, -630, 966, -39.4, -38.9] | |
| bw-outlet-speed | Spillway Express | speed | 13.9 m/s (50 km/h) in [-728, 944, -672, 1136, -46, -40] | yes |
| bw-altar-gap | Gap the Altars | gap | from A [-958, 1100, -952, 1168, -42.2, -41.6] over B to C [-946, 1100, -940, 1168, -45.0, -44.4] | yes |
| bw-legend | Harbour Legend | score | 12,000 pts in one combo inside the park rect [-672, 940, -212, 1006, -45, -38] | yes |

### Tapes (5) `[x, z, y]`

- Diving tower top: [-592, 1064, YN+3.0]
- Altar C south end: [-943, 1165, -44.8]
- Mole end by the light: [-982, 1280, YN]
- Under the Harbour Road bridge: [-700, 1020, -44.8]
- Ice House dock: [-150, 992, YN+1.2]

### Traffic

- Harbour loop `[[-790, 930], [-40, 930], [-40, 1020], [-790, 1020]]`, both directions (dir 1 and -1), lane 2.6, n 4 each,
  speed 9, r 8. Cars use Quay Road, Ice House Lane, Harbour Road, Net Loft Lane. Steep Street is not used (gate corridor).
- No cars on the boardwalk.

### Peds

- Boardwalk loop `[[-780, 1148], [-20, 1148], [-20, 1158], [-780, 1158]]`, n 14.
- Harbour Road sidewalks loop `[[-960, 1015], [-20, 1015], [-20, 1025], [-960, 1025]]`, n 10.
- Park perimeter `[[-668, 943], [-216, 943], [-216, 1003], [-668, 1003]]`, n 6.

### NPCs

- Boardwalk loop skater (loop on the boardwalk path).
- Session: Slab flatbar (-606, 962); Ice House dock edge (-150, 992); a slappy curb (-400, 1162.7); Deep End coping (-500, 958).

### Fast travel

- `district` "Boardwalk West": (-200, YS, 1150, yaw -π/2) — on the boardwalk at the Steep Foot, facing east.
- `park` "Harbour Bowl Complex": (-520, YN, 1000, yaw 0).
- `park` "The Drydock": (-912, YN, 1050, yaw π) — at the fence gap looking down the apron.
- `spot` "Spillway Outlet": (-700, -40.4, 930, yaw π).
- `spot` "Eel Run": (-210, YN, 950, yaw π/2).
- `spot` "Long Pier": (-336, YS, 1170, yaw π).
- `spot` "Ferry Terminal": (-112, T3, 1060, yaw π/2).
- `spot` "Saltwater Skates" and "Chandlery Skate Supply" (see shops).

---

## 9. Budget estimate

| item | estimate | cap |
|---|---|---|
| boxes | 560–650 (Slappy 30, bollards 65, piers 40, drydock 35, park 90, streets/sidewalks ~180, terrace/terminal 60, buildings' details) | 900 |
| rails | 420–550 (coping samples ~250, handrails 40, chains 30, slappy/ledge edges ~120) | 700 |
| K.building | ≈ 25 | 70 |
| D.sign | 8 | 8 |
| fine ground | ≈ 19.7k m² | 60k |
| triangles | ≈ 300–380k (pools at res 0.5 ≈ 40k, snake res 1 ≈ 21k, Sea Wheel decor ≈ 8k, trees/lamps instanced) | 450k |
| load | the snake fn is the costliest feat (≈ 10.6k samples × 8 segments); fine | 1.5 s |

Keep coping sampling at 1 m segments, and the Sea Wheel at 24 rim boxes.

---

## 10. Parts

All files in `levels/porto/bw/`. Spliced in name order (bw_east, bw_gardens, bw_park, bw_plan, bw_west, index.js last).
Every top-level name starts `bw_`. Parts never build outside their own sub-rect (boxes may touch the shared edge).

### 10.0 `bw_plan.js` — `function bw_plan()`

Returns `{ YN, YS, T1: -39.10, T2: -39.70, T3: -38.20, YF: -46.20, Bz, Qz, Q, ground, col, surface, outletFloor(z),
outlet(x,z), snake: {pts, s, D}, }` — the shared numbers and the formulas in section 2. No K calls.

### 10.1 `index.js` — `function porto_bw(K, P)`

In order:
1. `const pl = bw_plan();`
2. `P.ground(pl.ground); P.col(pl.col); P.surface(pl.surface);` (index.js is the only writer of P.ground)
3. `P.region(...)` for all six regions in 2.4 (or each part does its own; parts decide, but the list in 2.4 is the total).
4. `bw_west(K, P, pl); bw_park(K, P, pl); bw_gardens(K, P, pl); bw_east(K, P, pl);`
5. Registrations: traffic, peds, npcs, travel points (district, parks, spots), landmarks, challenges, tapes, signs not
   placed by parts, water (the sea rect is the region's; add none).

### 10.2 `bw_west.js` — `bw_west(K, P)` rect [-1000, -672, 910, 1350]

Section refs: 3.2 (Quay Road west, Harbour Road west + Outlet Bridge, Net Loft Lane), 4 rows 9–17, 6 n/a, 7.
Builds: Spillway Outlet feat (floor knots 944 YN, 1032 -44.80, 1096 -45.60, 1120 -45.60; end wall `-45.6 + arc(z-1120, 35.6, 16)` up to YS
at 1136; banks `h = Fo + (Q-Fo)*(|dx|-12)/16` for |dx| 12..28; centre x -700); weir hump; baffles (row 1 z 1100..1102.4 at x -708,
-700, -692; row 2 z 1108..1110.4 at x -704, -696; end sill z 1118..1119, 0.4 m); guard rail; the bridge. Drydock (apron, floor,
east transition `Fd + arc(x - xs, 7, w)` ending x -872.14, coping at -872.1, rim box, altars A/B/C, Dock Stairs, caisson
`K.B(-962, YF-0.4, 1168, -868, YN, 1172, 'metal')`, keels, bilge beams, chains, fence z 1044 with gap x -916..-908). West Mole
`K.B(-992, -47, 1176, -972, YN, 1296, 'garage', {edges: 'ew'})` + Gull Point Light. Boatyard, Net Lofts, Loft Alley, Chandlery
shop. Boardwalk west segment (curbs x -968..-680, the far-west boardwalk at YN), quay wall z 1176..1180 x -972..-672.

### 10.3 `bw_park.js` — `bw_park(K, P)` rect [-672, -212, 910, 1010]

Section 6 in full: seat walls, the Slab, the Bowl Yard (mini ramp, Deep End, Kidney, Tidepool, Park House), the Eel Run.
Plus Quay Road P.col dressing (x -672..-212) and the Harbour Road north sidewalk edge only as far as z 1010 (the street itself
is built by bw_gardens). Keeps x -208..-212 open for the Steep crossing mouth.

### 10.4 `bw_gardens.js` — `bw_gardens(K, P)` rect [-672, -212, 1010, 1350]

Harbour Road segment x -672..-212 (crossing -510 with zebra). Old Sea Baths (lido, tower, bath-house wings, bleachers). Arcades
+ porch slappy + Saltwater Skates shop. Gardens (lawn, bandstand, palms, planter run). Promenade Terrace + Gull Steps. Anchor Gap
monument (section 4 row 24 / explicit geometry: ramp hubba a(-226, -37.90, 1053.4) → b(-226, -40.58, 1037.4) w 5.2 with handrails
at x -226 ± 2.72; deck x -228.6..-223.4, z 1053.4..1069.4 top -37.90 with a lip; plinth x -227.5..-224.5, z 1070.85..1073.15 top
-40.20; ghost statue box ±0.3 × ±0.85, -40.20..-38.20; landing hubba a(-226, -38.40, 1073.35) → b(-226, -40.58, 1083.35) w 6.2).
Boardwalk middle segment (Slappy curbs, bollards, lamps, benches), quay wall x -672..-212, Long Pier with T-head, handrails,
bait shack.

### 10.5 `bw_east.js` — `bw_east(K, P)` rect [-212, 0, 910, 1350]

Steep Street (all segments + Steep Foot), Quay Road east, Ice House Lane, Harbour Road east (crossings -200, -40, stop at x -12).
Ice House + dock + ramp + stairs. Car park. Ferry Terminal podium (`K.B(-170, -41.4, 1040, -56, T3, 1090, 'marble', {edges:'ns'})`),
Terminal Eight, Terminal Bank, east ramp rail, queue ledges, south drop at z 1090, terminal building. Wheel Pier
(`K.B(-152, YS-0.8, 1176, -104, YS, 1262, 'wood')`), boarding platform, Sea Wheel decor. Ferry Pier x -64..-48, z 1176..1236.
Boardwalk east segment (curbs stop at x -24; x -16..0, z 1144..1156 clear), quay wall to x -0.5. Nothing above 0.3 m in the band
(x > -12) or in the steep corridor (x -208..-192, z 894..944).

---

## 11. Notes for neighbours

- **arroyo**: bw keeps the spillway corridor as flat quay to z 944; the outlet floor is 24 m (x -712..-688), so the arroyo's
  40 m channel spreads onto open quay for z 910..944 before narrowing.
- **old**: Steep corridor x -208..-192 clear to z 944, then Steep Street carries on south at YN.
- **ship**: please meet Harbour Road at y ≈ -40.93 (base) at x 0, z 1020, and the boardwalk planks at YS -41.80, z 1142..1180;
  a matching quay wall at z 1176..1180 and bollard rhythm (12 m) would make the waterfront continuous.

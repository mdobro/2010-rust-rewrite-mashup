# The Arroyo (`arroyo`) - design

Rect x -1000..-420, z -230..910. Builder reads CONTRACT.md, kit.js and this doc only.
All coordinates are world metres. `B(z)` = `portoBaseH(-700, z)` (base depends on z only).
`F(z)` = channel floor (section 2). Heights written "F+0.9" mean `F(z)+0.9` at the z of the thing.

---

## 1. Concept

A dry concrete flood channel - the Arroyo Seco - cuts straight down the middle of the district from the
heights' culvert in the north to the spillway into bw in the south, 1.14 km of 40 m-wide trapezoid with a
4 m trickle slot in the middle. It is the spine of the whole city's downhill: you drop in at the culvert
at 0.4 m deep, and by the viaduct you are 14 m below the levees, carrying speed you never have to push for.
Everything on the banks is the dry, industrial back side of Porto Alto: a rail yard and foundry on the
west, the Flood Control Authority, a gasworks and a pump station on the east. Things crossing the ditch
are the obstacles - a road viaduct with a DIY skatepark under it, a footbridge with a stair tower, two
water pipes slung across at 50 degrees, storm-drain doors in the walls, catwalks along them. Mood: sun-bleached
concrete, rust, tags, chain-link, a thread of green water in the slot.

Phone rules followed: channel floor grade 3.3-4.4 % (rolls itself, never scary), banks follow base
(~6 %), every wall is a 16 m-wide 45-ish bank you can ride up, every obstacle has 25 m+ of clean run-up
on the axis and 20 m+ of roll-away, all curbs are 0.15 m or chamfered hubbas, and the long straight
channel gives a 300 m+ sightline from every drop-in.

---

## 2. Height plan

### 2.1 Base and floor

```js
// arroyo_plan.js
function arroyo_plan(){
  const B = z => portoBaseH(-700, z);
  const FK = [[-214, null], [232, -14.5], [560, -29.0], [894, null]]; // nulls filled with B()
  FK[0][1] = B(-214);   // 0.382
  FK[3][1] = B(894);    // -39.98
  const lin = z => { // piecewise linear through FK, clamped to its ends
    if (z <= FK[0][0]) return FK[0][1];
    for (let i = 1; i < FK.length; i++) if (z <= FK[i][0]) {
      const [z0,h0] = FK[i-1], [z1,h1] = FK[i];
      return h0 + (h1-h0)*(z-z0)/(z1-z0);
    }
    return FK[FK.length-1][1];
  };
  const F = z => {
    if (z <= -214 || z >= 894) return B(z);
    let s = 0; for (const o of [-16,-8,0,8,16]) s += lin(Math.max(-214, Math.min(894, z+o)));
    return Math.min(B(z), s/5);
  };
  ...
}
```

Segment grades: 3.37 % (-214..232), 4.39 % (232..560), 3.30 % (560..894). Smoothing removes the kinks.

Reference values (builders may use these to sanity-check; always call `F` in code):

| z | F | depth (B-F) | | z | F | depth |
|---|---|---|---|---|---|---|
| -190 | -0.42 | 0.42 | | 300 | -17.51 | 13.2 |
| -150 | -1.75 | 1.8 | | 400 | -21.93 | 11.5 |
| -100 | -3.42 | 3.4 | | 440 | -23.70 | 10.9 |
| -40 | -5.42 | 5.4 | | 500 | -26.35 | 9.9 |
| 0 | -6.76 | 6.8 | | 520 | -27.23 | 9.4 |
| 40 | -8.09 | 8.1 | | 560 | -28.95 | 8.6 |
| 100 | -10.10 | 10.1 | | 600 | -30.32 | 7.6 |
| 120 | -10.76 | 10.8 | | 640 | -31.63 | 6.4 |
| 160 | -12.10 | 12.1 | | 700 | -33.60 | 4.7 |
| 200 | -13.43 | 13.4 | | 760 | -35.58 | 3.0 |
| 216 | -13.97 | 14.0 | | 800 | -36.89 | 1.8 |
| 230 | -14.48 | 14.0 | | 840 | -38.21 | 0.7 |
| | | | | >= 870 | = B | 0 |

Base: B(-230) ~ 1.0, B(-214) = 0.382, B = 0 for z -190..206, B(230) = -0.44, B(520) = -17.85,
B(894) = -39.98, B(910) = -40.2. Base grade ~6.15 % for z 254..856.

### 2.2 Cross-section (main channel)

`ax = |x + 700|`.

* ax <= 20: `h = F(z)` (floor x -720..-680)
* 20 < ax < 36: `h = F + (B - F) * (ax - 20) / 16` (walls x -736..-720 and -680..-664)
* ax >= 36: `h = B(z)` (all banks are exactly base)

All four edges are on the 8 m mesh grid, so the default 8 m ground is exact across x. Wall slope peaks at
14/16 = 41 degrees at z 216..232 (rideable bank), ~25 degrees at z 560, under 10 degrees south of z 760.

### 2.3 Trickle slot (`SLOT`)

4 m wide, centred on x -700. In z ranges `[-152, 104]` and `[219, 846]` (none under the DIY):

* `ax <= 1`: `h = F - 1.2`
* `1 < ax < 2`: `h = F - 1.2 + 1.2 * (ax - 1)`
* end ramps: depth tapers linearly to 0 over 2 m at each end (multiply depth by `clamp((z - z0)/2,0,1) * clamp((z1 - z)/2,0,1)`).

Water: `P.water` pieces 8 m long, rect x -701.5..-698.5, each `y = F(zEnd) - 0.45` where zEnd is the
downhill end (z0+8). Flat pieces on a slope: the uphill end sits deeper, never above the slot lips. The rider
only bails if pos.y < y - 0.2, i.e. only if they actually ride in the slot bottom - intended.

Grate bridges (3 m long, flush, so the slot is crossable everywhere a line wants it):
`K.B(-702.2, F(z+3)-1.4, z, -697.8, F(z)+0.03, z+3, 'metal')` at z = -136, -104, -72, -40, -8, 24, 56, 88,
248, 280, 312, 344, 376, 408, 440, 472, 504, 536, 568, 640, 672, 704, 736, 768, 800, 832.
(Top 0.03 above the floor at its uphill end; the 3 m pitch error is under 0.14 m - a bump, not a wall.)

Headwalls at slot ends (0.45-0.5 m above floor, grindable): x -703..-697, z -158..-152, 101..104, 216..219,
846..850, `'garage'`, edges `'nswe'`, top `F(zmid)+0.45`.

### 2.4 Sump (`SUMP`)

West half of the floor in front of the Pipe Crossing: x -720..-698, z 594..602, depth 1.2 below F, 1 m
edge ramps on all four sides (joins the slot on its east side). Water rect x -719..-699, z 595..601,
y = F(602) - 0.4 = -30.79. It is a hazard you jump over on the pipe gap line.

### 2.5 Planter Run tributary (`TRIB`)

A side ditch along z -40, carrying fin's Planter Run trough west into the main channel.

* `dz = |z + 40|`, `t = clamp((-436 - x) / 244, 0, 1)`, `T = lerp(0, F(z), t)` (0 at x -436, F at x -680).
* dz <= 3: `h_t = T`; 3 < dz < 8: `h_t = T + (0 - T) * (dz - 3) / 5`; else no effect.
* Applies for x -680..-436. Final `h = min(main, h_t)`.

T is about 2.2 % fall. Depth under the Levee bridges (x -664..-628): 3.9..4.4 m - clearance ~4 m under a deck at y 0.

### 2.6 Hump (`HUMP`, Seco Yard)

Additive: x -965..-870, z -190..-110, peak 3.0 m.
`along`: rises smoothstep z -190..-160, flat crest z -160..-150, falls smoothstep z -150..-110.
`across`: full for x -959..-876, smoothstep tapers 6 m at each side. `h += 3.0 * along * across`.
Grade on the north face 10 %, south 7.5 %.

### 2.7 Small fines

* Slag Heap (x -872..-848, z 704..728): additive cone, peak 4 m, `4 * smoothstep(1 - r/12)` around (-860, 716).
* Gravel piles: (-834, 610) r 5 peak 1.6 and (-834, 636) r 5 peak 1.4, additive.

### 2.8 Ground function (who writes it)

`index.js` (porto_arroyo) writes P.ground once, from the plan:

```js
const PL = arroyo_plan();
P.ground.push((x, z, h) => arroyo_terrain(PL, x, z, h)); // per CONTRACT ground hook
```

`arroyo_terrain` lives in arroyo_plan.js and returns: if outside rect -> h unchanged; else start from B(z),
apply channel (2.2) for |x+700| < 36, slot, sump, tributary (min), then hump, slag, gravel (add). Outside
x -752..-648 and the tributary/hump/heaps, it returns base exactly. Nothing changes within 12 m of the
shared borders except at the gates, where the channel meets the gates at base: culvert (z -230) F = B,
spillway (z 910) F = B.

### 2.9 Regions

| rect [x0, x1, z0, z1] | res | what |
|---|---|---|
| -704, -696, -152, 104 | 1 | slot north |
| -704, -696, 216, 584 | 1 | slot mid |
| -704, -696, 608, 848 | 1 | slot south |
| -728, -696, 584, 608 | 1 | sump + slot through it |
| -688, -432, -48, -32 | 1 | tributary |
| -968, -864, -192, -104 | 4 | hump |
| -880, -840, 696, 736 | 2 | slag heap |
| -848, -816, 600, 648 | 2 | gravel piles |

Fine area ~ 2048 + 2944 + 1920 + 768 + 4096 + 3200 + 1536 = ~16.5k m^2 at res 1-2 (budget 60k).
The Gas Ring and turntable are K.pool, which draws its own ground.

---

## 3. Layout

### 3.1 Sketch (north up = z -230 at top; x -1000 left, -420 right)

```
 x: -1000      -880   -800  -752 -736  -700  -664 -648   -560   -470   -420
z-230 +------------------------------[ CULVERT ]-------------------------+
      |  hump/   Seco    Mill  W  |\  slot   /| E  Levee  Water    Gas-  |
 -170 |  SECO    Yard   Street lev|  \FORD /  |lev Road  Board    works  |
      |  YARD  tracks   |   Siding|   catwlkW |   |     plaza     Lane  |
  -40 |  boxcars  ===   |   platf |   |  grates<=== Run Underpass ======|== PLANTERS gate
  -16 |  engine         |         |   |       |   |=== Run Street ====|  |
   62 |  shed            |         |  storm   |   |   Gas Ring (O)    |  |
  104 |                  |  shop1  |  [ D I Y  under viaduct ]          |  |
  160 |=====Viaduct Rd===|=========|==SECO VIADUCT====|==Viaduct Rd===|  |
  214 |  Yard St ========|         |   \      /   |   |                |  |
      |  Foundry |       |   Dock  |  catwalk E     |  Pump Stn 2      |  |
  380 |  Road    |       |   Row   |  storm doors   |                  |  |
  520 |==========|=footbridge walk=|==FOOTBRIDGE+stair tower==|=walk====|== FOOTBRIDGE gate
  600 |  FOUNDRY  stack  |         |  //PIPE CROSSING//      shop2      |  |
  716 |  slag heap       |         |  storm doors   |   Outfall Park   |  |
  862 |===Outfall Rd=====|=========|===SOUTH FORD===|==================|  |
  910 +------------------------------[ SPILLWAY ]------------------------+
```

### 3.2 Strips (x)

| x | strip |
|---|---|
| -1000..-975 | edge hills (engine) |
| -975..-810 | Seco Yard (north), Seco Foundry / scrap (south) |
| -810..-790 | Mill Street (road -806..-794, sw 4 each side) |
| -790..-752 | Siding, Dock Row |
| -752..-736 | West levee strip (path, guardrail at -736.3) |
| -736..-664 | Channel (walls + floor) |
| -664..-648 | Levee Path (east), guardrail at -663.7 |
| -648..-628 | Levee Road (road -644..-632, sw -648..-644 and -632..-628) |
| -628..-480 | Water Board, Gasworks, Pump Station, shop 2, Outfall Park |
| -476..-464 | Gasworks Lane |
| -460..-420 | east verge (open, base; 12 m band to -432 is bare) |

### 3.3 Roads

Sloped roads follow the mega4/heights pattern: P.col asphalt strip, sidewalks as sloped hubbas
(top 0.15, kind 'Curb', colour 0xc4c0b6), broken at slope kinks every <= 48 m, with 4 m curb-ramp hubbas at
crossings. Flat stretches (z -190..206 where base = 0) use K.street.

| road | geometry | z / x range | build |
|---|---|---|---|
| Mill Street | centre x -800, rw 6, sw 4 | z -164..862 | K.street for -164..206, sloped beyond |
| Levee Road | centre x -638, rw 6, sw 4 | z -164..862 | same split |
| Gasworks Lane | x -476..-464 | z -16..862 | flat part -16..206, sloped beyond |
| Run Street | z -22..-10 | x -632..-464 | flat K.street (south of the tributary, which is z -48..-32) |
| Viaduct Road | z 154..166 | x -794..-752 (W), deck -736..-664, x -648..-476 (E) | flat K.street (base 0); deck is a box |
| Yard Street | z 208..220 | x -880..-806 | sloped (base -0.0..-0.6) |
| Foundry Road | x -886..-874 | z 214..862 | sloped |
| Ford Road | z -176..-164 | x -810..-628 | P.col only, crosses the channel as a painted ford (floor depth ~0.6..1.0), no cars |
| Outfall Road | z 856..868 | x -806..-464 | sloped; crosses channel as the South Ford (depth < 0.15) |
| Footbridge Walk | z 516..524, 8 m | x -790..-752 and -648..-420 | P.col pavers 0xb9b1a3, walk only |

Bridges over the tributary at x -664..-628: `K.B(-664, -1.0, -48, -648, 0, -32, 'concrete')` (Levee Path)
and `K.B(-648, -1.0, -48, -628, 0, -32, 'asphalt')` (Levee Road), parapets 0.8 tall along z -48..-47.4 and
-32.6..-32, edges 'ns'. Cars do NOT cross these (see traffic).

### 3.4 Gates

* **Culvert (z -230, x -708..-692, base 1.0):** heights' culvert apron arrives at grade. Corridor
  z -230..-214, x -708..-692 is kept clear (nothing over 0.3 m); the floor equals base there. The channel
  floor walls start at z -214 (depth 0.38) and deepen steadily. Ford Road at z -170 is painted only.
* **Planters (x -420, z -46..-34, base 0):** fin's trough is 0 by x -404. Corridor x -436..-420 open. The
  tributary starts at x -436 at depth 0 and drops west; Gasworks Lane ends at z -16 so its kerb never enters
  the corridor (its north end has a 4 m chamfered cap at z -16..-20).
* **Footbridge (x -420, z 516..524, base -17.8):** Footbridge Walk runs west on base at z 516..524 to the
  channel lip at x -664, then the footbridge deck (y = -17.85) to -736. Corridor x -436..-420 open.
* **Spillway (z 910, x -712..-688, base -40.2):** floor = base from z 870; corridor z 894..910 clear.
  Outfall debris stops at z 850.

---

## 4. Spots

Notation: `K.hubba(a, b, w, opts)` with a/b as V(x,y,z) tops; heights are tops.

### 4.1 Culvert Run and North Ford (upper, z -230..-100)
Drop in from the culvert at depth 0, floor 3.4 %. The Ford (z -176..-164) is a painted crossing with
yellow ford posts (K.B 0.3x0.3, 1.0 tall, x -721 and -679, ghost - no collision) and a depth gauge board.
Run-up: the heights. Roll-away: the whole channel.

### 4.2 Catwalk W (upper)
Steel walkway hugging the west wall toe. Hubba centre x -719, w 2, from a = (-719, F(-112)+1.0, -112) to
b = (-719, F(-28)+1.0, -28), kind 'Ledge', colour 0x6b7178, noRails:false (both edges grind).
Up-ramp hubba (-719, F(-116)+0.02, -116) -> (-719, F(-112)+1.0, -112), w 2, noRails:true.
Handrail K.rail at x -717.9, y F+2.0, z -110..-30, kind 'Rail', posts on (the feeble/smith rail).
Off the south end: 1.0 m drop to floor; run-out 60 m to the confluence.
Run-up: 90 m from the ford. Sightline down the axis.

### 4.3 Grate pops (upper and lower)
`K.kicker(x, z, 0, 1, 1.8, 0.3, 1.6, 0x4a4d52)` (lifted grate lids, little launch).
West x -708: z -140, -84, -52, 8, 72, 300, 352, 640, 700. East x -692: z -124, -68, -12, 52, 330, 680, 720.
They let a rider pop the slot sideways or bonk on a straight line. Nothing within 6 m downhill.

### 4.4 Confluence (upper, z -48..-32)
Tributary floor meets the main floor at x -680 at the same height (T = F there). The tributary walls are
5 m 'banks' a rider can carve out of. Headroom under the two levee bridges ~4 m.

### 4.5 Storm doors (both parts)
Each door: box at the wall toe 3 m along z, top F(z)+0.9:
* West door: `K.B(-722, F(z+3)-0.5, z, -718.6, F(z)+0.9, z+3, 'garage', {edges:'es'})`
* East door: `K.B(-681.4, F(z+3)-0.5, z, -678, F(z)+0.9, z+3, 'garage', {edges:'ws'})`
plus a "flap" hubba up to it from uphill: a = (xc, F(z-3.2)+0.02, z-3.2) -> b = (xc, F(z)+0.9, z), w 3.4,
colour 0x5a6068, noRails:true (xc = -720.3 W / -679.7 E). A small launch onto a ledge.
Upper: E z 0, W 40, W 240, E 280, W 320. Lower: W 420, W 470, E 500, E 560, W 700, E 740. (z = the box's uphill edge.)

### 4.6 Channel Curbs (upper)
Two sloped ledges in the floor, 0.4 above F, w 0.6, kind 'Ledge', concrete 0xa8a39a:
x -712 and -688, a z 60 -> b z 98. Run-up 60 m from the confluence. Roll-away into the DIY.

### 4.7 DIY Underpass - see section 6.

### 4.8 Seco Viaduct (upper)
Deck `K.B(-736, -2.0, 152, -664, 0.0, 168, 'garage')` (decks over walls). Parapets
`K.B(-736, 0, 152, -664, 0.8, 152.6)` and `K.B(-736, 0, 167.4, -664, 0.8, 168)`, edges 'ns' (grind both top
edges, 72 m each - the longest ledge in Porto). Road paint/dashes on deck (P.paint style, D.add flat quads).
Piers: 4 columns per bent (section 6). Decor: 3 arches between pier lines, D.add arcs r 12 under the deck
(no collision, above y F+6 so nothing to clip). Sign "SECO VIADUCT" on the north face, (-700, -1.0, 151.9).
Approach: Viaduct Road from either side at base 0 - the deck is flush with the road ends (bank = 0).
Roll-away: road continues 50 m+ each side.

### 4.9 Catwalk E (lower)
Mirror of 4.2: hubba x -682..-680 (centre -681), a z 380 (F+1.0) -> b z 468, up-ramp from z 376.
Handrail x -682.1, F+2.0, z 382..466. Tape at the far end.

### 4.10 Footbridge and Stair Tower (lower)
Deck `K.B(-736, -18.6, 517, -664, -17.85, 523, 'concrete')`. Handrails: K.rail at z 516.9 and 523.1,
y -16.85, x -736..-664 'Rail' posts on; the south one has a gap x -688.5..-683.5 (stair head).
Stair tower at x -688..-684 on the channel floor, south of the deck:
* three flights `K.stairs` n = 10, tread 0.45 (4.5 m run each), heading +z, tops at z 523, 530.05, 537.1.
* landings: z 527.05..530.05 and 534.1..537.1, 3 m each.
* bottom at z 541.6, F(541.6) ~ -28.16. Total drop 10.31; each flight drops 3.44 (riser 0.344).
* handrails both sides, x -688.45 and -683.55, kind 'Rail', posts on, top 0.9 above nose line; these are
  three 4.5 m kinked handrails. Solid core `K.B(-688, F(541)-0.3, 523, -684, -18.6, 541.6, 'concrete')`
  under the flights (the stairs' own boxes sit on top).
Run-out 50 m to the Pipe Crossing. The deck itself: a 72 m flat rail-to-rail crossing at -17.85.

### 4.11 Pipe Crossing (lower, the signature)
Two steel water mains cross the channel at 50 degrees to the axis.
* Pipe 1: `z = 597 + 0.839 * (x + 712)`; Pipe 2: `z = 602 + 0.839 * (x + 712)`, x -724.5..-675.5.
* Top y = F(z) + 2.4 along the pipe, i.e. the rail is built in 8 pieces (one per ~7 m) sampling F at each
  end - K.rail kind 'Pipe', post:false (no collision), plus ghost box colliders not needed.
* Decor: D.add CYL r 0.5 along each piece (as the old spillway pipe), flanges every 7 m (CYL r 0.62, 0.3 long),
  A-frame props every 14 m (thin boxes 0.2 x 0.2, ghost), anchor blocks K.B 2 x 2 x 2 at each wall top (solid).
* Grind entry: riding down the axis, the pipe is 50 degrees off - under railAngle 55, so a straight-down
  rider can lock in; a rider who carves to match does it smoothly.
* **The West Door kicker** (gap launcher): hubba a = (-712, F(592.5)+1.4, 592.5) top, b = (-712, F(588)+0.02, 588),
  w 4, noRails:true, concrete. No ollie: land ~z 603.6 (clears the sump). With ollie: peak ~4.4 m at z 601 -
  over Pipe 1 (2.4 m) and lands ~z 612 past Pipe 2. That is the pipe gap.
* East "Little Door": box 1.0 m tall, x -690..-686, z 603..606.5, edges 'nws', a manual / bonk pad.
Run-up: 50 m from the stair tower, 80 m from the footbridge. Roll-away: 50 m to the outfall.

### 4.12 Outfall (lower, z 660..894)
Channel shallows (depth 4.7 at 700 -> 0.7 at 840). Debris ledges: three broken slabs (K.B 4 x 1.2, 0.45 tall,
rotated by building as two half-boxes, edges 'nswe') at (-710, 676), (-690, 712), (-704, 788). Flat bars:
K.rail 'Rail' at y F+0.4, posts on, (-694, 650..662), (-708, 748..760). Shopping-cart and tyre props (ghost).
South Ford at z 856..868: Outfall Road paint across a floor of depth < 0.15 - a car-free crossing with
0.15 chamfered lips. Corridor z 894..910 clear.

### 4.13 Seco Yard (west)
* Six tracks, x -952, -938, -924, -910, -896, -882, z -200..206: rails at x +/- 0.75, y terrain+0.15,
  kind 'Rail', post:false, built in 10 m pieces over the hump (follow terrainH). Ties as one P.col strip.
* **Hump crest** (z -160..-150): a free 3 m roll on any track - the whole yard is downhill from there.
* **Boxcar Run** (track -924): ramp hubba (-924, B+0.02, -60) -> (-924, 3.6, -36), w 3. Five boxcars
  `K.B(-925.5, 0, z0, -922.5, 3.6, z0+14, 'metal', {edges:'we'})` at z0 = -36, -19, -2, 15, 32 (3 m gaps).
  Ramp down hubba (-924, 3.6, 46) -> (-924, 0.02, 70). Roof-gap the five cars. Colours rust 0x8a4a32,
  green 0x4f6a52 alternating.
* Flatcars (track -896): three 3 x 16 m, 1.2 tall, edges 'we', z -60, -30, 0 (1.2 ledge).
* Hoppers (track -952): four 3 x 10 m, 3.2 tall, edges none (scenery, wallride).
* Tank cars (track -882): two, D.add CYL r 1.4 on a 1.0 box, z 60..74, 80..94 - a CYL is decor only; the box
  collides; rail along the top crest at y 3.8 'Pipe'.
* Buffer stops at z 200 on each track (K.B 2.4 x 1 x 1.2).
* Turntable: `K.pool(-912, -888, 163, 187, [[circle(-900, 175, 11), 1.6]], 0, 0.5)`, coping ring of 24
  K.rail 'Coping' segments at r 11, centre pivot box K.B 2 x 2 x 0.6 at floor. A 1.6 m bowl.
* Engine Shed: building x -975..-962, z -100..100, 9 m tall, roller doors facing east.

### 4.14 Siding (west)
Spur track rails x -772 +/- 0.75, z -150..60. Freight Platform `K.B(-786, 0, -120, -781, 1.2, 40, 'concrete',
{edges:'e'})` with ramp hubbas at each end (z -132 -> -120 up, 40 -> 52 down), w 5. 160 m ledge.
Two containers (2.4 x 12 x 2.6) at x -764, z -60 and -20; pallets (ghost).

### 4.15 Gas Ring (east)
Gasholder frame: 12 columns (D.add CYL r 0.4, 26 m tall + two ring girders at 13 and 26) at r 22 around
(-532, 62) - columns also get K.B 0.8 x 0.8 colliders. The tank base has been removed and the ring floor
is a bowl: `K.pool(-551, -513, 43, 81, [[circle(-532, 62, 18), 3.2]], 0, 0.5)` with its own 48-segment
coping K.rail 'Coping' at r 18. 3.2 m deep, the city's best bowl. Entry from the plaza at base 0.
Valve house (-570..-556, 40..52) and a gas main pipe rail K.rail 'Pipe' y 1.1 on box posts every 9 m,
x -620..-560 at z 90.

### 4.16 Water Board plaza (east)
Flood Control Authority building -600..-500, z -200..-150 (brutalist, 14 m). Plaza z -150..-60:
plinth K.B(-590, 0, -140, -570, 0.6, -120, {edges:'nswe'}); a 6-stair K.stairs heading +z down from a 1.0 m
terrace (x -560..-530, z -150..-142) with handrails both sides; two benches (0.45, edges); drained fountain
K.fountainBowl(-520, -100, r 7, depth 1.6) (no water). Banks: two 8 m hubbas from the terrace down to the
plaza at x -536 and -526.

### 4.17 Planter Run banks (east)
Copings (K.rail 'Coping' at y 0) on both tributary lips z -48 and -32, x -628..-440. Four angled brick
planters (fin's theme, 0.45 tall ledges, K.B rotated via 2-box steps - keep axis aligned, 6 x 1.2) at
x -600, -560, -520, -480 on z -56..-54.8 and -25.2..-24.

### 4.18 Pump Station No. 2 (east)
Building x -600..-560, z 380..440. Level deck `K.B(-600, B(470)-0.3, 450, -560, B(450), 470, 'concrete',
{edges:'s'})` - level at B(450) so its south edge stands ~1.5 m above the falling ground (drop ledge).
Stairs K.stairs at x -566..-562 off the south edge (n 4). Rail on the east edge.

### 4.19 Outfall Park (east)
z 740..850, x -620..-490: three terrace drops - level boxes stepping with the slope, each 30 m long, edges
along their south lips (0.8..1.2 m drops), K.bench x4, two manual pads. Lawn as P.surface grass.

### 4.20 Foundry (west south)
Seco Foundry building -960..-880, z 560..680 (16 m). Foundry Stack landmark: CYL r 2.5, 64 m tall, at
(-905, 705), with a K.B 6 x 6 x 2 plinth (ledge). Slag Heap hump (2.7). Gravel piles (2.7). Cement silo row:
three CYL r 3, 18 m, at x -840, z 660, 670, 680 with box colliders. Scrapyard x -960..-900, z 740..840:
crushed-car stacks (boxes 2 x 4 x 1.4, ledges), a bent I-beam rail (K.rail 'Rail' y 0.5, 12 m).
Dock Row: four sheds x -790..-760 between z 260 and 480, K.loadingDock along x facing west onto Mill Street.

---

## 5. Lines

1. **The Full Run** (culvert -> spillway, ~1.1 km, all downhill): culvert drop-in, Catwalk W grind or
   feeble on its handrail, grate pop over the slot, Channel Curbs, through the DIY (pyramid, wall ledge),
   a storm door, Catwalk E, stair-tower-side, pipe gap off the West Door, outfall flat bar, out at the spillway.
2. **Planter Run** (fin -> DIY): through the planters gate, coping on the tributary lip, drop into the
   tributary, under the levee bridges, carve the confluence bank, Channel Curbs, DIY slappy curbs.
3. **Viaduct** : 72 m parapet grind across the Seco Viaduct, off onto the Levee Path, guardrail piece,
   drop in through a guardrail gap, bomb the 41-degree wall into the DIY.
4. **Footbridge** (Old Town -> Outfall): through the footbridge gate, Footbridge Walk, footbridge handrail
   (72 m), off at the stair head, three-flight stair tower handrails, pipe grind on Pipe 2, outfall ledges.
5. **Yard** : hump crest, a track rail grind, Boxcar Run roof gaps, flatcar ledge, Freight Platform ledge,
   Mill Street, west levee drop-in, into the DIY.

---

## 6. The skatepark - DIY Underpass

Under the Seco Viaduct, channel floor z 104..216 (F -10.24 .. -13.97, 3.37 % fall, 40 m wide). The slot
is covered here (headwalls at 101..104 and 216..219). Built by locals out of concrete, cinderblock and
scrap. Red-painted curbs, tags on the piers.

| item | build |
|---|---|
| Slappy curbs | hubbas kind 'Curb', colour 0xb8402e, w 0.4, top F+0.22, x -707 and -693, z 108 -> 140 |
| Cinderblock ledge W | `K.B(-718, F(120.6)-0.3, 120, -709, F(120)+0.45, 120.6, 'brick', {edges:'ns'})` |
| Cinderblock ledge E | `K.B(-691, F(126.6)-0.3, 126, -682, F(126)+0.55, 126.6, 'brick', {edges:'ns'})` |
| Kicker -> flatbar | `K.kicker(-714, 134, 0, 1, 2.4, 0.6, 1.4)`, flatbar K.rail x -721..-715 at z 146, y F(146)+0.5, posts on (kicker aims at it on a slight angle) |
| Pier columns | 4: `K.B(x0, F-0.5, z0, x1, -2.0, z1, 'concrete')` at x -713.2..-710.8 and -689.2..-686.8, z 151..153.4 and 166.6..169 |
| Pier banks | hubbas, w 2.4, 1.8 tall at the pier: (x -712 and -688) a = (x, F(146)+0.02, 146) -> b = (x, F(151)+1.8, 151); and 174 -> 169 mirrored. noRails:true |
| Pyramid | box `K.B(-702, F(162)-0.3, 158, -698, F(160)+1.0, 162, 'concrete', {edges:'nswe'})` + 4 hubbas 3 m long, w 4, from each face out (N to z 155, S to 165, W to x -705, E to -695), noRails:true |
| Wall Ledge | hubba x -721..-719 (centre -720), a z 176 -> b z 200, top F+1.4, kind 'Ledge', plus three 8 m bank hubbas (z 176..184, 184..192, 192..200) from x -715 at F+0.02 up to -719 at F+1.4, w 8, noRails:true |
| Jerseys | `K.B(-716, F-0.3, 182, -710, F+0.8, 182.8, {edges:'ns'})` and `(-690, , 190, -684, , 190.8)` |
| Manual pad | `K.pad(-706, 178, -694, 184, 0.3)` |
| Kickers | `K.kicker(-686, 200, -1, 0, 2.0, 0.5, 1.6)` (west, towards the jersey line) and `K.kicker(-700, 204, 0, 1, 2.0, 0.5, 2)` |
| Props | shopping cart, sofa, traffic cones (ghost), tags (decals on piers and walls) |

Clearance: the pier bank at z 146..151 occupies x -713.2..-710.8, so the flatbar sits at x -721..-715 and
does not touch it; the kicker at x -714, z 134 launches toward the flatbar's east end.

Park fast-travel: "DIY Underpass" at (-714, F(108), 108, pi), see 9.4.

---

## 7. Buildings and dressing

### 7.1 Landmarks
* Seco Viaduct (the bridge itself, visible from the whole channel).
* Gasholder frame (26 m, 12 columns) at (-532, 62).
* Foundry Stack, 64 m at (-905, 705).
* Flood Control Authority block at (-550, -175).

### 7.2 Buildings (~40)
Engine Shed (1), yard huts (3), Siding sheds (2), Railyard Boardworks shop (1), Dock Row sheds (4),
Seco Foundry (1, big) + annex (2), silos (3), scrap office (1), Flood Control Authority (1), Water Board annex (1),
valve house (1), Gasworks offices (2), Pump Station No. 2 (1), Dry Creek Skate Supply (1), Levee Road row
(-628..-600 frontages, 8 small 2-3 storey industrial units z 220..840), Outfall Park kiosk (1), Mill Street
west frontage between z 220 and 540 (6 units). ~40.

### 7.3 Shops (P.shop)
* **Railyard Boardworks**: building -830..-812, z 172..196, east face on Mill Street (x -812).
  `{name:'Railyard Boardworks', sign:[-811.96, 4.0, 184, Math.PI/2, 7], awning:[-812, 178, -810.4, 190, 2.35, 'x'],
   zone:[-811.8, 180, -808.6, 188], door:[-811.8, 0.15, 184]}`
* **Dry Creek Skate Supply**: building -628..-612, z 490..512, west face on Levee Road (x -628), at base
  B(501) ~ -16.6 (build the floor level at B(512) and the box down into the ground).
  `{name:'Dry Creek Skate Supply', sign:[-628.04, B(501)+3.9, 501, -Math.PI/2, 7],
   awning:[-629.6, 495, -628, 507, B(501)+2.35, 'x'], zone:[-631.4, 497, -628.2, 505], door:[-628.2, B(501)+0.15, 501]}`

### 7.4 Signs (7 of max 8)
| text | where (x, y, z, rotY) | w x h |
|---|---|---|
| SECO VIADUCT | (-700, -1.0, 151.9, pi) on the north deck face | 10 x 1.2 |
| FLOOD CONTROL AUTHORITY | (-550, 9, -149.9, pi) | 14 x 1.6 |
| DANGER - CHANNEL FLOODS WITHOUT WARNING | (-737, 1.4, -190, -pi/2) on the west guardrail | 4 x 1.2 |
| GASWORKS No.1 | (-532, 27, 40, pi) on the frame girder | 8 x 1.4 |
| SECO YARD | (-880, 6, -200, pi) on a gantry over the tracks | 8 x 1.4 |
| SECO FOUNDRY | (-879.9, 12, 620, pi/2) | 10 x 1.6 |
| PUMP STATION No.2 | (-559.9, 6, 410, pi/2) | 7 x 1.2 |

### 7.5 Trees and lamps
Trees: dry palms and eucalyptus only on the east side - Water Board plaza (6), Outfall Park (10), Levee Road
verge every 32 m from z 220 to 840 at x -626 (20). West bank bare (industrial). ~36 trees.
Lamps: sodium lamps every 32 m on Levee Road (both sides), Mill Street (east side), the viaduct parapets (6),
and on the footbridge deck (4). Under-viaduct work lights (4 on the piers) light the DIY. ~90 lamps.
Chain-link: on top of the west levee guardrail between z 220 and 500 as decor (ghost panels).

### 7.6 Guardrails
Wall-top guardrails K.rail kind 'Rail', posts on, at x -736.3 and -663.7, y = B + 0.9, in pieces 24-32 m
long that follow base, with 6 m drop-in gaps after every piece; no rail in the gate corridors or across road
and footbridge decks.

---

## 8. Challenges

All ids `arroyo-` prefix, shapes as dt.js.

| id | type | spec |
|---|---|---|
| arroyo-pipe-gap | gap | 'PIPE GAP': start area x -716..-708, z 588..594 (West Door lip), end area x -716..-704, z 606..620, airborne, clear both pipes |
| arroyo-pipe-grind | grind | 'MAIN LINE': grind 30 m on 'Pipe' within area [-726, 584, -674, 634] |
| arroyo-pipe-tre | trick (hard) | 'TRE THE MAINS': 360 flip over the pipes (gap areas as pipe-gap) |
| arroyo-diy-score | score | 'UNDERPASS SESSION': 4000 points in area [-720, 104, -680, 216] in 60 s |
| arroyo-viaduct-grind | grind | 'PARAPET': grind 60 m on a Ledge in area [-736, 150, -664, 170] |
| arroyo-gas-ring | grind | 'GAS RING': 1 full lap = 100 m on 'Coping' in area [-552, 42, -512, 82] |
| arroyo-boxcar-gap | gap | 'BOXCAR RUN': start roof of car 1 (z -36..-22), end roof of car 5 (z 32..46), x -926..-922, no touch down |
| arroyo-bomb | speed | 'BOMB THE ARROYO': 45 km/h in area x -720..-680, z 222..400 (go at z 222) |
| arroyo-catwalk-feeble | trick (hard) | 'CATWALK FEEBLE': feeble grind 40 m on the Catwalk W handrail (area [-720, -112, -716, -28]) |
| arroyo-ditch-line | line (hard) | 'THE FULL RUN': 3 grinds + a manual and 5000 points from culvert (z < -200) to past the pipes (z > 620) without bailing |

## 9. Tapes, traffic, peds, npcs, fast travel

### 9.1 Tapes (6)
1. On Pipe 2 over the floor centre: (-700, F(612.1)+2.4+0.6, 612.1).
2. In the Run Underpass: (-646, T(-646,-40)+0.6, -40).
3. On boxcar 3's roof: (-924, 4.2, 5).
4. In the centre of the Gas Ring: (-532, -3.2+0.6, 62).
5. At the far end of Catwalk E: (-681, F(468)+1.6, 468).
6. On the Hump crest: (-910, 3.6, -155).

### 9.2 Traffic
Two loops, neither crosses the channel, the tributary or a box deck:
* East: [[-638,-16],[-470,-16],[-470,862],[-638,862]] (Levee Road, Run Street, Gasworks Lane, Outfall Road).
* West: [[-880,214],[-800,214],[-800,862],[-880,862]] (Yard Street, Mill Street, Outfall Road, Foundry Road).
Both directions, lane 2.5, n 3 each, speed 9, r 8. No cars on the viaduct, fords or footbridge.

### 9.3 Peds and NPCs
Peds: Levee Path (x -656, z 220..840), the footbridge deck and walk, the Water Board plaza, Mill Street sidewalks.
NPCs: one session on the DIY slappy curb (-707, 120), one on Planter Run coping (-560, -48), one in the Gas Ring
lip (-532, 44), one on the Freight Platform (-783, -40).

### 9.4 Fast travel
(rotY pi faces +z, down-channel, as in the porto convention for southward travel.)
* district: "The Arroyo" (-712, F(-140), -140, pi)
* park: "DIY Underpass" (-714, F(108), 108, pi)
* spot: "Pipe Crossing" (-712, F(570), 570, pi)
* spot: "Gas Ring" (-532, 0, 38, pi)
* spot: "Seco Yard" (-910, 3, -155, pi)
* spot: "Railyard Boardworks" (-806, 0.15, 184, -pi/2) and "Dry Creek Skate Supply" (-632, B(501), 501, pi/2)

---

## 10. Budget estimate

| item | estimate | budget |
|---|---|---|
| boxes | 420 (grates 26, headwalls 4, doors 22, DIY 35, viaduct 10, footbridge+stairs 40, yard 45, platform/containers 10, foundry/scrap 50, plaza/park 60, sidewalk hubbas count as boxes ~120) | 900 |
| grind lines | ~500 (yard rails ~260 pieces, guardrails ~90, copings 72+24, rest) | 700 |
| buildings | ~40 | 70 |
| triangles | 150-250k | 450k |
| signs | 7 | 8 |
| fine ground | ~16.5k m^2 | 60k |
Track rails are the big rail cost; if over, merge track pieces to 16 m off the hump.

---

## 11. Parts

Shared numbers (B, F, lin, CH = {cx:-700, floorHalf:20, wallW:16}, SLOT ranges, SUMP rect, TRIB, HUMP, road
lists, door lists, grate z list, region list, `arroyo_terrain`) live in `levels/porto/arroyo/arroyo_plan.js`
as `function arroyo_plan()` returning an object. Parts never recompute heights by hand.

`index.js` - `porto_arroyo(K, P)` calls, in order:
1. `const PL = arroyo_plan();`
2. `P.ground.push(...)` with `arroyo_terrain(PL, ...)` (only index.js writes P.ground).
3. P.col roads/strips (asphalt strips, ford paint, walk pavers), P.surface (grass in Outfall Park and plaza
   lawns, gravel in the yard), P.regions (2.9), P.water (slot and sump pieces).
4. `arroyo_upper(K, P)`, `arroyo_lower(K, P)`, `arroyo_west(K, P)`, `arroyo_east(K, P)`.
5. Traffic loops (9.2), the district fast-travel point, peds.

Each part calls `arroyo_plan()` itself (cheap, pure) and adds its challenges, tapes, spots, npcs, signs and
shops inside its own rect.

### 11.1 `arroyo_upper` - rect [-752, -648, -230, 360]
Channel north of z 360 and both levee strips. Builds: grates and headwalls (z < 360), grate pops, Catwalk W
(4.2), storm doors upper (4.5), Channel Curbs (4.6), DIY Underpass (6), Seco Viaduct deck, parapets, piers,
sign (4.8), tributary bridges (3.3, x -664..-648 part only; the Levee Road bridge x -648..-628 belongs to
east), ford posts (4.1), west and east levee guardrails z -214..360, DANGER sign. Challenges: diy-score,
viaduct-grind, catwalk-feeble, bomb, ditch-line. Tapes: none (Run Underpass tape is at x -646 -> east).
Fast travel: district, park. NPC: DIY.

### 11.2 `arroyo_lower` - rect [-752, -648, 360, 910]
Channel z 360..910 and levee strips. Builds: grates and headwalls (z >= 360), pops, Catwalk E (4.9), storm
doors lower, footbridge deck and handrails x -736..-664 (4.10), stair tower, Pipe Crossing with the West
Door and Little Door (4.11), Outfall debris (4.12), South Ford paint lips, guardrails 360..894, Footbridge
Walk x -752..-736 stub. Challenges: pipe-gap, pipe-grind, pipe-tre. Tapes: Pipe 2, Catwalk E. Spot: Pipe Crossing.

### 11.3 `arroyo_west` - rect [-1000, -752, -230, 910]
Mill Street (sidewalk hubbas or K.street), Yard Street, Foundry Road, Outfall Road x -806..-752, Viaduct Road
west, Footbridge Walk west, Seco Yard (4.13), Siding (4.14), Railyard Boardworks, Dock Row, Foundry, stack,
silos, slag/gravel props, scrapyard (4.20), SECO YARD and SECO FOUNDRY signs, west trees/lamps.
Challenges: boxcar-gap. Tapes: boxcar roof, hump crest. Spots: Seco Yard, Railyard Boardworks. NPC: platform.

### 11.4 `arroyo_east` - rect [-648, -420, -230, 910]
Levee Road (sloped part with sidewalk hubbas), Levee Road tributary bridge, Run Street, Gasworks Lane, Viaduct
Road east, Outfall Road east, Footbridge Walk east to the gate, Water Board plaza (4.16), Planter Run copings
and planters (4.17), Gasworks frame and Gas Ring (4.15), Pump Station (4.18), Dry Creek Skate Supply, Levee
Road row, Outfall Park (4.19), FLOOD CONTROL, GASWORKS, PUMP STATION signs, east trees/lamps. Keep
x -432..-420 at base and the planters/footbridge corridors x -436..-420 clear.
Challenges: gas-ring. Tapes: Run Underpass, Gas Ring. Spots: Gas Ring, Dry Creek Skate Supply. NPCs: coping, ring.

---

## 12. Notes for neighbours

* heights: the culvert apron must hand over at B(-230) at grade; the channel floor equals base from -230 to -214.
* fin: the Planter Run trough should arrive at 0 by x -420; our tributary starts at -436 at depth 0.
* old: the footbridge gate arrives at -17.8 on base; our walk is flat across x at base.
* bw: the spillway gate is flat base (-40.2) - the channel has fully shallowed by z 870.

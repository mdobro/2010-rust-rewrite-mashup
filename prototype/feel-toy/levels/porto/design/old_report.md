# Old Town (old): designer review report

SP = /tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad

Report file: /tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad/old_report.md

The full district passes the check: no errors, all four gates ok, sink scan worst 6 cm, every budget met, and rhythm 28/28. Every gate rides both ways without a bail. Two problems are outside my files: the crosstown gate is tilted about 6 % on the base side, and fin's boulevard street stops 14 m short of the border.

I edited only levels/porto/old/index.js, old_plan.js, old_upper.js and old_market.js. old_harbour.js is unchanged.

## What's built (by spot)
- **Upper town (old_upper)**
  - Grand Boulevard, with a staggered rambla median and wave paving.
  - Tile & Truck skate shop on the boulevard east sidewalk (x -25, z 360).
  - Gull Fountain bowl (-150,446) and Lemon bowl (121,425), each on a new level apron (`old_upper_apron`).
  - Alto Walk, Lemon Lane, Lemon Square, Clock Lane with its clock column, and Bell Alley.
  - Cafe Steps: tiered decks, now flush, with parasols.
- **Market belt (old_market)**
  - Market Street bomb.
  - Fountain Square and the Tiers T1–T3, with stall tables and ledges.
  - Lavadouro wash basins and channel, with a new curb ramp at the mouth.
  - Crosstown Street (east gate), Saddler's Alley and Tile Works Alley.
  - Convent Lane, with new curb ramps up to both Terrace sidewalks.
  - Rope Walk, the Wash and Clock line, and Bishop's Steps.
- **Lower town and harbour (old_harbour)**
  - The Steep, Lantern Street and Rampart Street bombs.
  - Terrace Road, Harbour Wall Road and the Miradouro wall.
  - Fishermen's Stairs and ramp lane.
  - Santa Brisa Run and the Brisa 10 steps.
  - Pool Row gardens with the pool.
  - The Wall Walk: the 600 m ledge run along the Old Wall, now level across.
  - Steep Street Skates (-173, 864) and the sea wall at the steep gate.
- **Review fixes (`old_index_trim` in index.js)**
  - Box edges shorter than 2.4 m are dropped.
  - Thin boxes keep only the edge facing the street.
  - Kit rails of the same kind that join end to end are merged. Merged curbs are lowered so the metal tube never sits above the curb.
  - Together these cut grind lines from 1103 to 686.
  - The doc's Tile Works to Pool Row line no longer runs through house H9a.

## Final check output
`node tools/check.mjs --html $SP/build/old.html --only old --rhythm --shots $SP/shots-old`

| Measure | Result | Budget |
|---|---|---|
| Load time | 1.8 s (empty map 1.2 s), so 0.6 s added | 1.5 s added |
| Errors | none | none |
| Boxes | 719 | 900 |
| Buildings | 64 | 70 |
| Grind lines | 686 (tight) | 700 |
| Triangles | 442k in the scene (empty map 164k), so about 278k added | 450k added |
| `D.sign` boards | 7 | 8 |
| Fine ground | about 43,200 m² | 60,000 m² |

- Other counts: 503 sloped blocks, 6 hazards, 10 challenges, 6 tapes, 2 skaters, 5 traffic routes, 8 travel points and 1314 meshes.
- Inside the rectangle: ok. Border band: ok.
- Gates: boulevard (-40,230), crosstown (300,560), footbridge (-420,520) and steep (-200,910) are all ok.
- Sink scan (13,560 points): 96 points are over 5 cm, and the worst is 6 cm. They all sit on the z 898 row (x -328 to -298), at the foundation corner. That is under the ~10 cm limit.

## Rhythm (28/28 ok)
| Line | Kind | Length | Covered |
|---|---|---|---|
| Grand Boulevard | bomb | 168 m | 85% |
| Market Street | bomb | 272 m | 93% |
| The Steep | bomb | 436 m | 92% |
| Lantern Street | bomb | 418 m | 98% |
| Rampart Street | bomb | 296 m | 95% |
| Crosstown | push | 626 m | 96% |
| Terrace Road | push | 456 m | 97% |
| Harbour Wall Road | push | 456 m | 97% |
| Alto Walk | push | 544 m | 96% |
| Footbridge Lane | push | 210 m | 88% |
| Lemon Lane | push | 117 m | 96% |
| Clock Lane | push | 144 m | 100% |
| Fountain Square | push | 185 m | 78% |
| Lemon Square | push | 56 m | 73% |
| Rope Walk | push | 262 m | 98% |
| Saddler's Alley | push | 262 m | 98% |
| Bishop's Steps | push | 104 m | 100% |
| Bell Alley | push | 146 m | 100% |
| Tile Works Alley | push | 162 m | 100% |
| Rampart Alley | push | 28 m | 100% |
| Convent Lane | push | 92 m | 89% |
| Fishermen's Stairs | push | 100 m | 100% |
| Wall Walk | push | 594 m | 98% |
| Santa Brisa Run | push, main | 489 m | 92% |
| Tile Works to Pool Row | push, main | 737 m | 97% |
| Rambla to the Sea | bomb, main | 856 m | 89% |
| Rampart Run | bomb, main | 699 m | 96% |
| Wash and Clock | push, main | 209 m | 90% |

The bombs have real skateable things along them: curb ledges, benches, planters, stair sets and handrails.

## Rides
- **Gates, both ways, no bails:**
  - Boulevard in rolls to z 308. Before the median trees were staggered, it hit a tree on the centre line.
  - Boulevard out rolls into fin.
  - Crosstown in and out are clean.
  - Footbridge in and out are clean.
  - Steep in and out are clean.
- **Bombs, no bails:** Market Street reaches 15.5 m/s. The Steep, Lantern and Rampart run to the border. Grand Boulevard is clean.
- **Push lines that are clean:**
  - Crosstown and Harbour Wall, both ways.
  - Alto Walk, Terrace and Lemon Lane.
  - Footbridge Lane, from x -390.
  - The Wall Walk, which now runs clean to z 955. Before it was levelled it drifted into the wall at z 417.
- **Line segments that are clean:**
  - Fishermen's ramp lane and Bishop ramp lane.
  - Tiers T1–T3 at x -128, and the Docks along Crosstown.
  - The Cafe deck, and Lemon Lane to the bowl.
  - The Steep to the Harbour bench, and the Rambla Market to the Terrace.
- **Bails I fixed:**
  - Convent Lane bailed at the Terrace sidewalk face. Curb ramps fixed it, and the lane now ends at the Miradouro wall, an expected ledge.
  - The Wash line bailed at the Crosstown south sidewalk. A curb ramp and moving one lamp fixed it.
  - Cafe Steps bailed at a 0.1 m lip on the decks. The decks are now flush.
- **Stops that are meant to happen (obstacles, not bugs):**
  - Saddler's Alley and Tile Works Alley end where they meet the cross lane.
  - Clock Lane stops at the clock column.
  - The Brisa centre line stops at the Brisa 10 centre handrail.
  - Square south at x -120 stops at a stall table on Tier 1.
  - Rampart Run stops at the Miradouro wall, because the doc draws that line diagonally through the wall.
  - Riding east along Pool Row at z 798 drifts down the Lantern slope into the garden wall at z 805.

## Best screenshots
1. `$SP/v1/brisa.png`: the Santa Brisa 10 stair set and its handrails, the district's main stair spot.
2. `$SP/v3/gull.png`: the Gull Fountain bowl on its new level apron, with the square's ledges around it.
3. `$SP/v3/lav.png`: the Lavadouro wash basins and channel, a pool-and-ledge spot.
4. `$SP/final/lantern.png`: looking down the Lantern Street bomb, lined with curb ledges and benches.
5. `$SP/v3/shop1.png`: the Tile & Truck skate shop on the boulevard. Steep Street Skates is in `$SP/v1/shop2.png`.

## What still isn't right
- **The engine contradicts CONTRACT §7.** Any box face more than 0.08 m above the rider (0.1 m for sidewalks) acts as a wall, so riding head-on into a 0.15 m sidewalk bails. I added curb ramps on the ridden lines, but approaching a sidewalk anywhere else still bails. This needs an engine or contract decision.
- **The crosstown gate tilt is on the base side.** The base border band at x ≥ 296 tilts about 6 % south, so riding in from the crosstown gate drifts to z 566. That breaks the "camber ≤ 2 %" handshake. Riding in over the footbridge from x -428 also drifts slightly south from the Arroyo side.
- **The boulevard seam with fin is short.** Fin's street stops at z 216 instead of the z 230 border, which leaves a 14 m gap, and fin's sidewalk top (y 0.15) differs from the base. Old's sidewalks now start exactly at z 230; the rest is for fin to fix.
- **Grind lines are close to the cap** at 686/700. Adding more will need more merging.
- The Lavadouro channel has a small stair-step glitch in the mesh at its joint.
- No part ever registered the "Old Wall" spot that spans all three parts. Only "Old Wall South" exists.
- `$SP/final/wallwalk.png` was taken with a bad camera position, looking up from under the wall. The Wall Walk itself rides fine.
- Lemon Square (73 %) and Fountain Square (78 %) have the lowest coverage. Both pass, but they are the thinnest lines.
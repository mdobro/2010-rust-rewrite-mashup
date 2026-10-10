# Heights: designer review report

Heights passes the final check: errors none, every gate ok, sink scan ok, rhythm 19/19, and it is inside every CONTRACT §8 budget. The margins are small: triangles are about 444k out of 450k and grind lines 693 out of 700. To get under the triangle budget I cut the people from the doc's 20 peds and 5 skaters to 5 peds and 3 skaters.

Build: `node tools/build.mjs --only heights --out $SP/build/heights.html`. `node tools/build.mjs --check` also returns ok. All edits are in `levels/porto/heights/`; nothing outside it was touched.

## Final check output

`check.mjs --rhythm --shots`: load 2.1 s (1.9 s on the earlier run), errors none. Inside the rectangle, the border band, all 4 gates (switchback, observatory, culvert, ridge) and the sink scan (23,310 points) are all ok.

| Budget (CONTRACT §8) | Heights | Limit |
|---|---|---|
| Boxes | 869 | 900 |
| Grind lines | 693 | 700 |
| Buildings | 50 | 70 |
| Triangles added | about 444k (scene 604k minus about 160k) | 450k |
| D.sign | 7 | 8 |
| Fine ground | about 24k m² (estimated: res regions plus about 1.5k m² of new band strips) | 60k m² |
| Load added | about 0.6–0.8 s (estimated) | 1.5 s |

The check also counted 634 sloped blocks, 10 challenges, 6 tapes, 3 skaters, 5 traffic routes, 9 travel points, 1615 meshes and 0 hazards.

Triangles split into ground 260k, actors 198k and other 145k. Each skater or ped is a full rider model of 22–33k triangles. Before the cut, the district added about 841k triangles; I also removed the 2 loop NPCs.

## What's built, by spot

- **Switchback Road (west and centre, `heights_switch.js`):**
  - The Yellow Line bomb (1147 m) runs down four switchback legs with guardrails and hairpins.
  - The Overlook Steps have the E1, E2 and E3 sets with landings.
  - A fall line at x ≈ -266 is cut through the leg 2, 3 and 4 guardrails. It serves the Ridge Traverse bank drop and a straight bomb.
  - The Thin Air shop is reached from Ridge Road by a curb cut at x 60.
  - The switchback gate is at (-100, -230).
- **Reservoir and Drainage Culvert (west, `heights_west.js`):**
  - The Reservoir Run bomb (360 m).
  - The culvert head drop and the culvert gap, clean at 12 and 19 m/s.
  - The Chute, the headwall and the footbridge.
  - Reservoir Lane with its ford, and new ledges at the Spillway crossing (x -840 and -812).
  - The Water Tank's Valve Ring bowl, the Tank Road bomb and the access track.
  - The culvert gate is at (-700, -230).
- **Observatory (centre-east, `heights_obs.js`):**
  - The Stargazer bomb (453 m).
  - The podium, the Observatory Steps and the Observatory Ledge, which needs an ollie by design.
  - Dome Court, with its planters and benches moved off the line, plus the forecourt, Stargazer Lane and Dome Service Lane.
  - Planetarium Drive onto the podium, and Observatory Road down to the observatory gate at (220, -230).
  - Ridge Road filler on the island between the crossings: pads at x 200–206 and 250–256 and a ledge at 236–246.
  - Curb cuts at Stargazer Lane, x 170.
- **Ridge east (`heights_east.js`):**
  - The Three Crests bomb, Crest Street and the Ridge Road Descent.
  - The Upper, Middle and Lower Terraces, with filler ledges at Ridge Road x 924–932 and Upper Terrace x 912–920.
  - The Vista Steps and their hubbas.
  - Parking decks A to C with deck gaps.
  - The pool villa bowl and Ridge Park Path.
  - The Low Gear shop, reached by a curb cut at x 592.
  - The ridge gate at (650, -230).
- **Foundation (`heights_plan.js`, `index.js`):**
  - The ground is analytic. The culvert lip is now a ramp instead of a 1.26 m wall.
  - The edge hills are ridden as 4 m chords, so the drawn ground and the ridden ground agree; this is what fixed the sink.
  - New finer ground strips at x ±968–1000, z -248 to -230 fix the sink where the border band meets the edge hills.
  - The district registers 19 lines, 5 traffic routes, 9 travel points, 3 session skaters and 5 peds.

## Rhythm

All 19 lines pass on `check.mjs` and on my stricter copy. `check.mjs` counts things a rider can't really use, so the strict copy leaves them out:
- sidewalk edges;
- sloped curb slabs that follow the ground;
- slabs with no rails;
- rails under 0.3 m high.

| Line | Type | Length | check.mjs | Strict |
|---|---|---|---|---|
| The Yellow Line | bomb, main | 1147 m | 97% | 91% |
| The Reservoir Run | bomb, main | 360 m | 64% | 58% |
| Stargazer | bomb, main | 453 m | 90% | 87% |
| Three Crests | bomb, main | 415 m | 93% | 58% |
| Ridge Traverse | bomb, main | 1097 m | 94% | 78% |
| Ridge Road | push | 1928 m | 100% | 69% |
| Reservoir Lane | push | 632 m | 100% | 88% |
| Tank Road | bomb | 204 m | 100% | 68% |
| Tank Access Track | push | 24 m | 100% | 100% |
| Observatory Road | bomb | 366 m | 97% | 63% |
| Planetarium Drive | bomb | 126 m | 100% | 68% |
| Stargazer Lane | push | 56 m | 91% | 82% |
| Dome Service Lane | push | 38 m | 100% | 100% |
| Ridge Road Descent | bomb | 366 m | 97% | 51% |
| Crest Street | bomb | 228 m | 100% | 63% |
| Upper Terrace | push | 456 m | 100% | 57% |
| Middle Terrace | push | 456 m | 100% | 73% |
| Lower Terrace | push | 456 m | 100% | 74% |
| Ridge Park Path | push | 100 m | 100% | 100% |

## Rides

All rides below are clean after the fixes. "Steered" means my waypoint-following script; the rest are straight rides in the test harness.

**Steered:**
- The Yellow Line, top to the gate: 116 s, reaching 16.2 m/s free, and also clean with a 12 m/s cap.
- The Reservoir Run: 23 s to the gate at 18.7 m/s.
- The Traverse lane, from (-272, -392) to the culvert gate.
- Stargazer, top to the podium edge, then the podium, steps, walk and forecourt to the gate.
- Planetarium Drive onto the podium.
- The Three Crests tail.

**Straight:**
- **Culvert:** the head drop, the gap at 12 and 19 m/s, and under the gap to the gate.
- **Bombs:** the Chute, Observatory Road and the Descent to their gates; also Crest Street, Tank Road and Planetarium Drive.
- **Push lines:**
  - Ridge Road both ways across every seam (x -420, 100, 480).
  - Reservoir Lane both ways, including the ford.
  - All 3 terraces, the park path, and switchback legs 1–4.
- **Stairs:** the Overlook Steps E1 and E2 at 4 m/s and E1 and E3 at 6 m/s; the Observatory Steps at x 248; the Vista Steps at x 758.
- **Gaps:** the deck A gaps at 12 m/s.
- **Gates and shops:**
  - All 4 gates northbound at push speed; the line rides cover the other direction.
  - The fall line at x -266, down to z -235.
  - Into both shop zones (Thin Air and Low Gear) by rolling off the road.

**Fixed during review, each one re-ridden clean:**
- Stargazer Lane slammed on Ridge Road's sidewalk; it now has a curb cut.
- The fall line slammed into the guardrails; gaps are cut.
- The Traverse lane stuck on a guardrail stub at hairpin 3, standing in the lane's south walk; the stub is removed.
- The podium planter and bench, and the forecourt bench, were on the line; they are moved.
- Neither shop could be reached by rolling off the road; curb cuts are added.
- The strict rhythm showed gaps on Ridge Road (x 196–291 and 915–950), Reservoir Lane (x -844 to -804) and Upper Terrace (x 896–946); filler is added.

## Best screenshots

- `$SP/views1/observatory.png`: the dome, the podium and the Observatory Steps, seen from the forecourt line.
- `$SP/views1/tank.png`: the Water Tank Valve Ring bowl with its coping and the centre block.
- `$SP/views1/switchback.png`: the switchback legs and hairpins stacked down the ridge.
- `$SP/views1/vista.png`: the Vista Steps and hubbas, looking down to the city.
- `$SP/views2/decks.png`: parking decks A to C stepping down toward the dome.

$SP is `/tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad`. The check's aerial shots are in `$SP/shots-heights`.

## What still isn't right

- **Sidewalks block riders.** The 0.15 m sidewalks stop or slam a rider, although the contract says anything up to 0.3 m is stepped up. Every entry from a road needs a curb cut. This should be fixed once in the engine or the contract, not by each district adding cuts.
- **`check.mjs` rhythm is lenient.** It counts sidewalk edges and curb slabs that follow the ground. Measured strictly, the Reservoir Run, Three Crests, the Descent and Upper Terrace are only 51–58% covered: they pass, but thinly.
- **Ground shows through the bowls.** Green and blue streaks appear at the lip of the pool villa bowl and the tank bowl. This is cosmetic, caused by the 8 m ground mesh.
- **Buildings look too tall.** The window texture makes 2-floor villas read as 4–5 storey blocks (see `views2/poolvilla.png`).
- **Jagged bank-colour edges** along the switchback, where the colour zone changes.
- **Known ride quirks, left as they are:**
  - The steering script bails with a "Sideways landing" when it turns hard at the bottom of E1.
  - The middle handrail of the Observatory Steps stops a rider at x 252.
  - The Vista centre hubba bails if hit head-on at x 760.
  - The Valve Ring bails if rolled straight in.
  - The steering script drifts on the Dome Service Lane's cross slope.
- **Heights feels empty.** With 5 peds and 3 skaters instead of the doc's 20 and 5, there are few people around. Bringing them back needs cheaper ped models.
- **Almost no room left in the budgets:** grind lines 693/700, boxes 869/900 and triangles about 444k/450k.

The report is also saved at `/tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad/heights_report.md`.
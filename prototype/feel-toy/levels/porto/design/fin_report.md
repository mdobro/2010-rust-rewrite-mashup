# Financial Core (fin) designer review: Porto Alto

Porto Alto passes the full check. It is within every CONTRACT §8 budget, all 25 lines pass the rhythm check, and all five gates are ok. All three skate shops are in place, and Downtown (buildDowntown) is unchanged. I edited only files in levels/porto/fin/. I never ran build.mjs without --out, and made no commits or pushes.

## What's built, by spot
- **Downtown (unchanged):** the Exchange Ring core and its three skate shops. I checked each shop in a screenshot:
  - Corner Skate Shop, the map spawn, at (61,1.05,64)
  - Library Lane Skates at (-106,1.95,-94.5)
  - Bank Street Boards at (-93.5,1.05,19.5)
- **Core (fin_core):**
  - furniture around the outside of the ring
  - pads and benches at the crossings
  - manual pads on the ring's north and south sidewalks (x -66..-60)
  - the Twelve stairs (x 36/44, y 4 down to 0)
  - Civic Walk and the Hotel four
  - Bank Plaza and the Bank Wall
  - the garden, with one picnic table
  - Grand Boulevard, with a row of ledges on the median
- **North (fin_north):**
  - Civic Square and the City Hall stairs
  - Council Drive and the terraces
  - Bourse Walk and the Bourse steps; the run-out at x -286..-234 is now clear
  - the Switchback gate
- **East (fin_east):**
  - Treasury Ramp and Treasury Walk
  - the Observatory Promenade into the Cascade
  - the Spiral Rim (12 chords)
  - the Nautilus and its pool gap
  - Metro Plaza and the Metro Steps
  - the Long Pool and Treasury Gardens; the sign wall now sits off the line
  - furniture on top of the Metro Avenue sidewalk, with the crossing at x 209..231 kept clear
  - the roll-in
- **West (fin_west):**
  - Planter Alley: the trough with copings, 18 terrace planters, 7 floor planters, the arch sign, and pads at the alley mouth
  - the Mint stairs, passage and north bank
  - the Arena: the raised deck, the Twenty and the concourse
  - the arena car park and the Planters gate

## Final check
- **Load:** 3.4 s, with no errors. An earlier run took 2.9 s. Downtown alone loads in about 2.4 s, so this adds about 1.0 s against the 1.5 s limit.
- **Counts:**
  - 1276 boxes (57 buildings)
  - 316 sloped blocks
  - 1407 grind lines
  - 28 hazards, 38 challenges, 19 tapes and 8 skaters
  - 7 traffic routes and 9 travel points
- **Scene:** 2197 meshes, 1597k triangles.
- **Inside the rectangle and the border band:** both ok.
- **Gates:** switchback, observatory, avenue, planters and boulevard are all ok.
- **Sink scan:** 142 points, worst 9 cm, all in the border band at x -418 and x 356. This came with the foundation and is within the 10 cm allowed.

| Budget (new work on top of Downtown) | Used | Limit |
|---|---|---|
| Boxes | 687 (1276 − 589) | 900 |
| Grind lines | 690 (1407 − 717) | 700 |
| Buildings | 34 | 70 |
| Triangles | +407k (1597k − 1190k) | 450k |
| D.sign | 8 | 8 |
| Fine ground | ~32k m² | 60k m² |
| Load time added | ~+1.0 s | 1.5 s |

**What I cut to get here:**
- **Grind lines:** from 1062 down to 690.
  - Planters now have rails on two edges, and pads have none.
  - Strips use longer segments.
  - The rim arcs and the spiral are shorter.
  - Duplicate benches and planters are gone.
- **Triangles:** from +1233k down to +407k, mostly by cutting pedestrians from 43 to 7. Each one costs about 22.7k triangles.

## Rhythm
| Line | Length | Covered | Result |
|---|---|---|---|
| Switchback Road | 94 m | 84% | ok |
| Exchange Ring North | 280 m | 96% | ok |
| Exchange Ring South | 280 m | 96% | ok |
| Exchange Ring West | 280 m | 100% | ok |
| Exchange Ring East | 280 m | 98% | ok |
| Grand Boulevard | 100 m | 80% | ok |
| Metro Avenue | 220 m | 98% | ok |
| Observatory Promenade | 98 m | 90% | ok |
| Council Drive | 86 m | 100% | ok |
| Treasury Ramp | 58 m | 100% | ok |
| Treasury Walk | 76 m | 100% | ok |
| Bourse Walk | 250 m | 94% | ok |
| Civic Walk | 166 m | 100% | ok |
| Planter Alley | 274 m | 75% | ok |
| Alley North Terrace | 230 m | 100% | ok |
| Alley South Terrace | 230 m | 100% | ok |
| Metro Plaza | 320 m | 77% | ok |
| Long Pool Walk | 200 m | 100% | ok |
| Arena Concourse | 470 m | 84% | ok |
| Arena Car Park | 224 m | 100% | ok |
| Civic Line (main) | 242 m | 90% | ok |
| Treasury Line (main) | 598 m | 91% | ok |
| Alley Line (main) | 310 m | 74% | ok |
| Bourse-Mint Line (main) | 153 m | 83% | ok |
| Boulevard Line (main) | 225 m | 98% | ok |

The official check also counts sidewalk edges as skateable. A stricter version that leaves them out also gives 25/25.

## Rides
I ran 99 rides in five sets. The full output is in `rides_out.txt` in the scratchpad.

**These ride clean:**
- the Twelve at x 36 and 44 (0.72 s of air, lands at 8.5 m/s)
- Council Drive, both ways
- Treasury Ramp down, and Treasury Walk
- the Switchback, both ways
- the Boulevard, both ways, in the driving lanes at x -46 and x -34
- the Hotel four
- the Promenade up into the Cascade
- Metro Avenue, both ways
- the Alley Line, and the alley going in
- the Bourse steps at x -266
- the Mint stairs and passage at x -267.5
- the Arena Twenty, ridden off-centre in the x -163 lane
- the Metro Steps and the roll-in
- the Civic Line at x 40
- the car park aisle and the south side of the concourse
- all four legs of Metro Plaza
- the Treasury Line on its new route, every leg: (262,-30) to (262,-16), the diagonal to (220,-8), the x 220 crossing both ways, and Treasury Walk down to (212,73)
- the terrace planters, with an ollie at x -174.5: FS Overcrook / BS Crooked, then a clean landing
- the Nautilus gap, with an ollie (vy 5 at z -66.4): lands at (220,0.3,-52.8)

**Every gate, both ways:**
- **Switchback, Observatory, Avenue (x 360) and Planters (x -420):** clean in and out.
- **Boulevard (z 230):** clean in and out in the driving lanes.
- **Boulevard centre line, x -40:** riding in exactly on the centre line, you go up the median's ramp and slam into the end of the median ledge at (-40,0.65,208). Riding out, you launch off that ledge and land. This is like hitting any ledge end head-on.

**Bails I accept:**
- The test rider can't ollie, so it bails at the Nautilus gap (220,-61) and at the terrace planters. Both land when an ollie is added.
- The ring corner curbs at ±136.
- The Bank Wall stops you, as designed.
- Handrail ends hit head-on, for example the Bourse rail side at x -248.
- The Twenty's middle hubba, and riding the Twenty backwards.
- Rides that run past the end of a line into a curb: Metro Plaza at z -11.3, both ends of the Long Pool, and the concourse corners.
- Riding straight down the middle of the Metro Avenue sidewalk runs into the sidewalk furniture, which is the skateable filler. The road and the crossings ride clean.
- One older ride set still follows the old diagonal Treasury route, which now bails at (254,-11.3). The new route above rides clean.

## Best screenshots
All paths are in the scratchpad folder.
1. `views-fin/v_twelve.png`: the Twelve stairs and the City Hall plaza, with the Civic crossing and the bench ledges.
2. `views-fin/v_nautilus.png`: the Nautilus shell over its pool, with the spiral rim coping in front and the Cascade behind.
3. `views-fin/v_alley.png`: under the Planter Alley arch sign, looking down the trough with the floor planters and the brick terraces.
4. `views-fin/v_twenty.png`: the Arena Twenty, a double set with a centre handrail coming down off the arena deck.
5. `views-fin/v_cascade.png`: the Cascade banks, the edge of the Long Pool and the sunken bowl, with benches.

Shop shots:
- Corner Skate Shop: `views-fin2/shop_a.png`
- Bank Street Boards: `views-fin/v_shop_bank.png`
- Library Lane Skates: `views-fin3/shop_lib.png`

The aerial is `shots-fin/fin_aerial.png`. Nothing in these views is floating, sunk or z-fighting.

## What still isn't right
- **Engine problem: the rider can't get onto curbs and pads, which goes against CONTRACT §7.** In index.html, collideBoxes (around line 2158) never steps the rider up. Any box top more than 8 cm above the rider (10 cm for sidewalks) blocks them:
  - A box under 0.35 m tall bails the rider above 2 m/s ("Caught the curb").
  - A taller box bails them above 5 m/s ("Slammed").

  The contract says boxes up to 0.3 m are stepped up. Because of this, I placed every pad and curb item so that no line rides into it. I did not work around it in the level code. This needs a fix in the engine.
- **Grind lines are at 690 of 700**, so there's almost no room left. If more rails are needed, the design doc's cut order is spiral chords, then alley floor planters, then pool copings, then promenade ledges.
- **Triangles are at +407k of 450k.** That's room for one more pedestrian at most.
- **Load time varies between runs:** 2.9–3.4 s against about 2.4 s for Downtown alone. That is still under the +1.5 s limit.
- **Boulevard gate centre line:** the gate's centre at x -40 lines up with the median ledge (x -40.35..-39.65, z 198..208). The driving lanes ride clean, so whoever builds the district on the other side of this gate should treat x -46 and x -34 as the riding lanes.
- **Avenue gate sidewalk:** the road rides clean across x 360. A rider on the sidewalk stops at the furniture before reaching the border, so the sidewalk height at the seam (top 0.15) was confirmed only by the gate check, not by a ride.
- **Sink scan:** 9 cm in the border band at x -418 and x 356. This came with the foundation, not with fin.
- **Thinner lines:** these pass but have less on them than the rest: Alley Line 74%, Planter Alley 75%, Metro Plaza 77%.

Files are in /tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad:
- fin_report.md
- rides_out.txt
- views-fin/
- views-fin2/
- views-fin3/
- shots-fin/
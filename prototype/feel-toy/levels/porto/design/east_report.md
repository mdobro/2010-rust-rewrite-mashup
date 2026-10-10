# Eastside Hills (east): pilot review and sign-off

**Signed off with notes.** Every check gate passes, every §8 budget is met (load time and triangles only just), the doc's rides run clean, and rhythm is 25/25.

## Your question: agent count and the 5-hour Max window

Yes, it's a real concern, but I can't see your plan usage, so I can't say for sure. What I can measure:

- **This one district review was about 60+ tool calls.** Each headless check or ride run takes 1–2 min of wall time.
- **Most of the cost came from rework**, not from building. The district's plan and index files didn't exist yet, and ride tools had to be rebuilt from scratch.
- **Load builds up on the shared machine.** This container is at load average 8.5 on 4 cores, and the check's load time drifts 2.0 -> 3.0 s as other agents run. That makes timing gates noisy and invites even more reruns.
- **The estimate:** 8 builders plus 8 designer reviews at this rate is likely to use up most or all of one 5-hour window.

To cut it down:

1. Use one agent per district that both builds and self-reviews, instead of separate builder and reviewer agents.
2. Give each district a ready skeleton (plan and index stubs) and a shared toolkit: `steer.mjs`, `strict.mjs`, `tris.mjs` and `rails.mjs` from `$S/tools/`.
3. Run fewer districts at once (2–3), so timing checks stay meaningful.
4. Have the reviewer do a single final check rather than many check/fix rounds.

## What's built, by spot

All files are in `levels/porto/east/`:
- `index.js` (new)
- `east_plan.js` (new: plan copied verbatim from design §2.1, plus the `east_walk` sidewalk helper)
- `east_spine.js`, `east_west.js`, `east_park.js`, `east_south.js`

**The Spine and Hill Bomb** run from x 600, z 230 to 910 (690 m). The lane stays clear. Along its edges:
- **Driveway kicks.** 10 wedges, 0.3 m high: 6 on the west walk, 4 on the east walk.
- **Crest Bend carve banks.** 6 banks of 0.9 m, on the outside of each arc.
- **Crossing kickers.** Orchard (590, 418) and Bayview (610, 828), 0.45 m high. The spot is named "Orchard Crossing Gap".
- **Sidewalk ledges.** 12 low walls at offset +/-9.6 m.
- **Pull-off pockets.** Spine Lay-by, Chute Roadworks and Bayview Lay-by.
- **Sidewalks.** 0.15 m chords on both walks, with a Curb rail.
- **Other features.** The Cut bridge carrying the EASTSIDE HILLS sign, and the Chute.

**The Cut and Crosstown Street.** The underpass runs from x 560 to 680. Full-width curb ramps at x 316 meet the sidewalks with west's district.

**Hillside Park.** The T1 ledge (with an NPC session) and the Moonrise lot.

**South.** Bayview Center mall and walkway (walkway ledge with an NPC session), the drive-in, and the school yard. The trash can and newsboxes were moved off the walkway lot line.

**West part.** The Crest, Orchard, Crosstown, Mesa and Bayview W blocks, Vista Street and Back Lane.

**Life:**
- 4 traffic routes;
- 5 peds (the doc had 22): mall 2, Crosstown 2, school yard 1;
- 2 NPC skaters;
- 8 travel points, 10 challenges, 5 tapes.

**Budget passes in index.js:**
- `east_index_merge` joins collinear box edges into one rail and gives thin boxes one edge.
- `east_index_mergeSlabs` joins sloped blocks end to end; thin ones get one rail.
- `east_index_mergeRails` joins post-less rails that line up end to end.
- Parked cars have no edges.

## Final check output

Command: `check.mjs --html $S/build/east.html --only east --rhythm --shots $S/shots-east --views [...]`. Full output: `$S/final_check.txt`.

- **errors:** none.
- **inside the rectangle:** ok. **Border band:** ok.
- **Gates:**
  - campus (650,230) y -0.4: ok
  - crosstown (300,560) y -20.3: ok
  - hillbomb (600,910) y -40.2: ok
- **Sink scan:** 3 points over 5 cm. Worst is 7 cm at (986,232), then 5 cm at (302,586) and (302,580). This passes the "no worse than about 10 cm" rule.

| §8 budget | east | limit |
|---|---|---|
| boxes | 846 | 900 |
| grind lines | 670 | 700 |
| buildings | 69 | 70 |
| D.sign | 6 | 8 |
| added triangles | ~448k (612k scene, ~164k baseline) | 450k |
| added load time | +1.3 s (2.6 s vs 1.3 s baseline, measured back to back at load average 8.5); +0.8-1.0 s on a quiet machine earlier | 1.5 s |

Other counts: 262 sloped blocks, 41 hazards, 1368 meshes.

## Rhythm: 25/25 lines ok

| line | type | length | covered |
|---|---|---|---|
| Hill Bomb | bomb, main | 690 m | 91% |
| Crosstown (Cut) | push, main | 120 | 100% |
| Crest (Spine) | push | 120 | 67% |
| Orchard (Spine) | push | 120 | 83% |
| Mesa W / E (Spine) | push | 18 / 58 | 100 / 92% |
| Bayview (Spine) | push | 120 | 92% |
| Crest / Orchard (park) | push | 150 / 150 | 73 / 63% |
| Crosstown E of the Cut | push | 230 | 98% |
| Terrace N | push | 310 | 73% |
| Larch Lane | push | 140 | 96% |
| Hillside Park | push | 88 | 100% |
| Mesa E (south) | push | 150 | 97% |
| Bayview Road E | push | 295 | 83% |
| Terrace S | push | 270 | 81% |
| Bayview walkway | push, main | 116 | 100% |
| Moonrise lot | push, main | 192 | 79% |
| Crest / Orchard (west) | push | 160 / 160 | 84 / 88% |
| Crosstown (west) | push, main | 260 | 94% |
| Mesa W (west) | push | 160 | 88% |
| Bayview (west) | push | 230 | 96% |
| Vista Street | push | 580 | 71% |
| Back Lane | push | 532 | 90% |

**Strict Hill Bomb check** (sidewalk chords not counted as features): 63% covered, worst gap 30 m ending near (600,444), no gap over 40 m.

## Rides

Tool: `$S/tools/steer.mjs`, path-following, on the final build. All clean:

**Hill Bomb:**
- Gate to gate: 691 m, 49 s, 70 km/h top speed.
- From Orchard: 69 km/h.
- Doc plunge: 68 km/h.
- On the west walk; on the east walk over the Bayview kicker (0.15 s air); over the Orchard kicker; Crest Bend outside carve (0.21 s air).
- Orchard–bomb corner.

**Crosstown:**
- Gate to east in the lane: 603 m, and east to the gate: 620 m.
- Under the bridge.

**Other doc lines:**
- L2a Orchard to Terrace to Mesa (58 km/h).
- L2b walkway lot and walkway ledge top.
- L2c Bayview E to the bomb to the gate, plus a corner-cut version.
- L3 Vista N to S (60 km/h), Mesa W to the Chute to the gate, the school yard.
- L4 Crest E to Terrace to Larch (633 m), and Back Lane to Bayview (756 m, 60 km/h).

**Elsewhere:**
- Orchard W to E in the lane.
- Hillside T1.
- Moonrise lot (0.92 s air).

**Gates, every one both ways:** campus in/out, hillbomb in/out (uphill), crosstown in/out.

**Known bails, all expected:** The older paths ride the street centre lines and hit medians that are there by design (west's Crest, Orchard, Mesa and Bayview, south's Terrace and Bayview, and the Underbridge jersey). Their lane-following versions above ride clean.

## Best screenshots

All in `$S/shots-east/`:
1. `bridge.png`: the Cut from Crosstown, with the EASTSIDE HILLS sign across the bridge.
2. `chute.png`: the Chute dropping south toward Bayview, with the roadworks pocket.
3. `bomb_top.png`: the top of the Hill Bomb from Campus Drive, with the Crest Bend below.
4. `hillside.png`: Hillside Park, the T1 ledge and the terraces.
5. `drivein.png`: the drive-in lot and screen off Terrace S.
6. `east_aerial.png`: the whole district, with the bomb running north to south through the middle.

## What still isn't right

1. **Actors cost too much.** One ped is about 22k triangles and one NPC skater about 31k. The doc's 22 peds alone would add about 480k. I cut to 5 peds and 2 skaters to fit 450k, so the district feels empty. It needs engine instancing or LOD.
2. **Triangles and load time are at the edge.** Added triangles are about 448k of 450k, and load time is +1.3 s of 1.5 s under load. There is no headroom for new pieces.
3. **The Crest Bend sidewalk shows ring-shaped moire** at shallow viewing angles (`$S/shots-east2/carve1.png`). The overlapping chords that z-fought on the curve are fixed. What's left looks like the sidewalk texture aliasing, which is an engine or material issue (mipmaps or anisotropy).
4. **Medians sit on street centre lines** in the west and south parts, plus the design's Underbridge jersey in the Crosstown centre. They're by design, but riders following the yellow line will slam into them.
5. **Bomb coverage at the strict check is 63%,** with 30 m gaps on the steep middle stretch. The checker passes it, but it could use 2–3 more kicks or pockets near z 420–450.
6. **The bomb_lookout view is still weak.** The lookout pocket mostly frames a lawn, and the bridge deck parapets don't read well.
7. **Small leftovers:**
   - sinks of 5–7 cm at (302,580/586) and (986,232);
   - the plan has no 'park' material (park areas use 'plaza');
   - the alley behind the mall is grass;
   - wax is lost on merged edges.
8. **The merge passes are a workaround.** They exist mainly because §8 counts every box edge as a grind line. If CONTRACT counted merged chains instead, builders wouldn't need them.

## Advice for the other seven districts

- **Count actors in the triangle budget from the start.** At about 22k for a ped and 31k for a skater, 5–8 actors in total is the realistic number.
- **Give thin pieces one rail.** Benches, curbs and anything under 0.8 m wide get one rail on the edge over the lower ground, and pad boxes keep their two long edges only. Merge collinear edges, or you'll go over 700 grind lines.
- **Split curve chords on lateral deviation too, not just height.** Otherwise sidewalk chords overlap and z-fight on bends.
- **Don't put landing ramps at flush street crossings.** They catch riders cutting the corner. Use a single kicker.
- **Ride rides in the lanes, not on centre lines.** Check medians first.
- **Use the right ride tool settings.** Steering sign is -1, and gate rides go both ways.
- **Fix sinks by widening the edge region.** Snap edge regions to the 8 m grid and run them past the border, or the band leaves sinks of up to about 80 cm at district corners.
- **Have plan and index files in place before building,** and share one sandbox and toolkit per district.
- **Measure load time against a baseline built under the same machine load.** Readings drift by 1 s or more when other agents are running.

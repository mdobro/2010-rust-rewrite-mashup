# Next pass: fill the empty space, make the downhills wind

What the player said (on a phone): the map is cool and huge but feels empty. There's a lot of empty space. The downhills are
awesome but lack character: mostly straight, no turns.

## Measured
- Share of 25 m cells with nothing in them, and the share inside empty patches 75 m or wider:

  | district | empty cells | in 75 m+ patches |
  |---|---|---|
  | heights | 54% | 23% |
  | east | 41% | 5% |
  | arroyo | 35% | 6% |
  | uni | 18% | 2% |
  | ship | 14% | 0% |
  | fin | 13% | 0% |
  | bw | 13% | 0% |
  | old | 5% | 0% |

- Only about 345 buildings in the whole city.
- 22 of the 31 bomb lines have 0 degrees of turning. The longest straights:
  - Hill Bomb 520 m (690 m long, 97 degrees of turning)
  - Mill, Levee and Gasworks 656 m each
  - Foundry 648 m
  - Steep 436 m
  - Bomb to the Bow 425 m
  - Lantern 418 m
  - Ridge Road Descent 366 m
  - Observatory Road 366 m
- Only the Yellow Line (720 degrees) and the Full Run (1243 degrees) wind.

## Step 1: a winding-road piece, `P.road(spec)` in base.js (I write this)
Boxes are axis-aligned, so a curved road is made from the ground itself plus hubba strips. The pattern comes from
heights_switch.js.

### Spec
- `pts`: a centre polyline `[[x, z, r?], ...]`, where `r` is the fillet radius at each interior vertex, so the line becomes straights and arcs.
- `hw`: half-width of the road. `sw`: sidewalk width (0 for none). `blend`: how far the shoulder blends back into the ground (about 20 m).
- `ys`: optional height keypoints along the road. Without them, the profile is the ground under the line, smoothed over
  about 30 m, with both ends pinned. The ends sit at gates and must not move.
- `bumps`: optional `[{s, h, len}]` for crests and dips (raised cosine).
- `bank`: cross-slope = clamp(curvature * k, +-max), defaulting to about 10% at R 30, lowered on the inside of the turn. It's smoothed along the road.

### Carve
- Dense samples every 2 m, indexed in a 16 m grid.
- A query finds the nearest sample and projects onto its segment, giving s (distance along) and d (lateral offset).
  The road height is y = profile(s) + bank(s) * d.
  - Out to hw + sw the ground is that height.
  - From there it blends over `blend` to the original ground with smoothstep, and it also fades past each end.
- Applied inside `baseH` after the district ground and its border band, roads one after another. A later road samples
  the ground the earlier ones carved, so junctions meet. Declare roads first in index.js, before anything reads
  `terrainH`.

### Look
- The asphalt is a ribbon decor mesh, not ground colour. The road surface is linear across, so two vertices per 2 m
  sample are exact.
  - It's cut into pieces of about 32 m so `decorAdd` puts each piece in its own culling chunk.
  - It sits 0.03 m over the ground with polygon offset.
- `P.surface` gives 'smooth' on the road.
- The corridor's ground mesh goes to res 4 by an 8 m cell set. The cells are merged into rects, and cells already
  covered by a district region or a fine patch are skipped, so nothing is drawn twice.

### Build
- Curbs: a 0.35 strip that grinds, at hw.
- Sidewalks: 0.15 strips with noRails, about 6 m chords, fewer on bends.
- Guardrails (`Rail`, posts) on the outside of bends tighter than about R 80.
- Centre dashes, 3 m on and 3 m off.
- The corridor goes in `K.roads`, so nothing gets placed on it.
- Options: `curb: 'both' | 'left' | 'right' | false`, `guard: false`, `walk`.
- It emits a `P.line` for the road, so the rhythm check covers it.

### Budget
About 4 hubbas per 6 m with both curbs and sidewalks, so 1 km is about 650. Use `curb: 'left'` / `walk: false` on long bombs.

## Step 2: districts in parallel (worktree agents, one per district: heights, east, arroyo, uni, old, ship)
1. Reroute each straight bomb into a `P.road` with character:
   - hairpins, S-bends and chicanes;
   - crests you can catch air off, and dips;
   - a banked sweeper per bomb;
   - pull-off pockets every ~150 m (lookout, bus stop, gas forecourt).
   - Gate ends stay put.
   - Target: no straight longer than about 150 m on a bomb, and at least 90 degrees of turning per 300 m.
2. Fill the empty patches. Housing blocks with yards, fences, walls and driveways; lots with parked cars; corner
   shops, sheds, a gas station, allotments, a school yard; trees and props. Phone budgets come from CONTRACT section 8.
   - Target: no empty patch 75 m or wider next to a line. Empty cells at most 25% in heights, east and arroyo, and at most 12% elsewhere.
3. Each agent runs `check --only <id> --rhythm` and rides its gates.

## Step 3: integrate (me)
- Merge, rebuild, then run `check --rhythm`, `rides.mjs` (all gates and the 3 long routes, 0 bails), and the slopes check
  (cross-slope at the gates at most 2%).
- Re-measure emptiness and straightness with `$SP/empty.mjs`.
- Load time under about 8 s, and the frame budget at the busiest spots.
- Commit, push, republish the game, and refresh the map artifact v2.

---

# Also next: verticality, quarter pipes, grabs, big air

What the player said: there isn't a lot of terrain height change. Skate 3 has a quarry you drop down into, full of
stuff, that leads out to a new area, and a mega park with lots of verticality. Fix how quarter pipes work: better
roll-up and actual air. Add grabs back. No big bridges or big things to air over. We want high speed, high air.

## Where the empty land is (25 m cells, connected patches, measured on the current build)
| district | size | x | z | ground y |
|---|---|---|---|---|
| heights east-centre | 9.2 ha | 250..625 | -575..-125 | 0..43 |
| heights centre | 8.4 ha | -150..200 | -575..-225 | 1..43 |
| heights west | 6.1 ha | -675..-125 | -575..-400 | 23..43 |
| east, east edge | 16.9 ha | 625..1000 | 250..700 | -41..-5 |
| arroyo, south | 3.1 ha | -750..-225 | 525..925 | -40..-19 |
| arroyo, middle | 2.9 ha | -625..-500 | 175..525 | -17..0 |

Arroyo also has one big strip along the west map edge.

## A. Quarter pipes that give real air (engine, index.html; me)

### Why they feel flat now
- Gravity is 14 (heavy) and the top push speed is 8.5 m/s. That only carries you about 2.6 m up a ramp, and most of
  our quarter pipes are 1.6 to 2.5 m tall, so you barely reach the lip.
- Most banks are planar hubbas. They launch you forward, not up.
- Vert assist only kicks in above 50 degrees, and it only straightens you; it adds no lift.

### Fixes
1. **Pumping.** Crouch (hold ollie) through the flat bottom and stand up on the face to gain speed. Skate does this.
   - Gain is about +8% of speed for each transition you pump, capped.
   - That's how you build speed in a bowl or on a mini ramp without pushing.
2. **Lip pop.** An ollie released within about 0.15 s of leaving a lip steeper than 60 degrees adds a vertical pop
   along the ramp's normal. A clean, late pop is worth more.
3. **Air gravity off vert.** When you leave a lip steeper than 60 degrees, use lighter gravity going up (about 10)
   and the normal 14 coming down. That gives hang time without floaty flat-ground ollies. It can be tuned in the
   settings panel.
4. **Proper ramps in the kit.** `K.qp(x0, z0, x1, z1, dir, h, R, vert)` makes a real quarter pipe: an arc to about
   85 degrees, optional vert, a deck box, coping rail, and a fine ground region.
   - Sizes: mini 1.2 m, normal 2.4 m, vert 3.6 m, mega 8 m.
   - `K.spine` and `K.hip` come with it.
   - Then replace the planar "quarter pipes" in the parks with it.
5. **A regression ride.** A test rider pumps a 3.6 m quarter pipe from rest. It must get 1.5 m or more above the coping
   within 4 pumps. A rider at 8 m/s must clear the lip.

## B. Grabs (engine; me), chosen by the player: double tap left, right thumb picks the grab
The trick stick does exactly what it does now; it only picks a grab while grab mode is on.

### Controls
- **Starting a grab.** In the air, double tap the steering (left) thumb and keep it down. That's grab mode, for as long as it's held.
  - On the ground the double tap still reverts, as now. In the air it means grab.
  - The second tap has to come within the double-tap window (`T.doubleTap`, 0.32 s). That window covers the first part of a jump.
  - A double tap that starts on the ground and finishes in the air counts as a grab, so you can tap as you pop.
- **Picking the grab.** While grab mode is on, the trick (right) thumb's direction picks the grab instead of lining up a grind.
  - toe side: Indy
  - heel side: Melon
  - up: Nosegrab
  - down: Tailgrab
  - up-toe: Mute
  - down-heel: Stalefish
  - down-toe: Crail
  - up-heel: Method
  - no direction (thumb not on the trick stick): Indy
- **Changing grabs mid-air.** Moving the trick thumb to a new direction mid-grab changes the grab. Each grab you hold
  at least 0.12 s counts in the combo, like "Indy to Melon".
- **Spinning.** The held left thumb still steers, so sliding it left or right spins you while you grab, for "540 Melon".
- **Ending a grab.** Lifting the left thumb ends the grab.
  - Still holding when you land makes the landing sketchy.
  - Points grow with hold time; past 0.6 s it's "Long Indy".
- **Grinds while grabbing.** If you reach a rail mid-grab, the grab ends there. Let go of the left thumb to line up the grind as usual.
- **Keyboard and gamepad.** Hold G (or LB/RB on a gamepad) for grab mode, and the trick keys or stick pick the grab.

### Animation
- Knees bend, the board comes up to the hand, the arm reaches.
- Each grab tweaks the board's roll and yaw.
- Done through the existing `boardFlip` and `LIMBS` posing, and the replay records it.

### UI and how-to
- The combo text shows the grab name live while you hold it.
- The intro and the how-to list get one line about grabs.

### Tests
- A double tap and hold in the air with each of the 8 trick directions scores the right grab.
- A double tap on the ground still reverts.
- Holding the trick stick in the air without grab mode still lines up a grind; flicks and grinds stay unchanged. The flick tests stay at 28/28.

## C. Big vertical places (level; worktree agents)

### C1. The Quarry
- **Site:** Heights east-centre, x 280..620, z -560..-250. It cuts into the hillside under the tower ridge.
- **The pit:**
  - Rim at y 43, floor at about 0, so 40 m deep.
  - Four or five benches, each 8 to 10 m high with a near-vertical face.
  - A haul road spirals down round the pit, built with the winding-road piece. It's a bomb with hairpins and its own guardrails.
- **Things in it:**
  - drop-ins off the bench lips onto gravel banks;
  - a conveyor gantry as a long down rail;
  - rusting haul trucks and an excavator;
  - spoil heaps as natural quarter pipes and hips;
  - a flooded corner as water to bail into;
  - a rock kicker gap across a bench.
- **The way out, to a new area:** a cut from the pit floor, south through a short tunnel, into University. The tunnel is a box roof over a carved trench. Add a gate in CONTRACT.md for it, about (560, -230), y about 20.
- **Fine regions:** res 1 on the faces, res 2 on the benches.

### C2. The Mega Park
- **Site:** Eastside east edge, x 700..990, z 260..680, on the hillside going down toward the harbour.
- **The mega ramp:**
  - A roll-in tower about 24 m tall on the high ground at the north end.
  - Its run-out leads to a 20 m gap, a landing ramp, then a quarter pipe 8 m tall.
- **Around it:** a big-air bowl about 4 m deep, a spine line, a hip line, a vert ramp, and a few rails on the slope so it isn't just the ramp.
- **Lighting and landmark:** the tower is a `P.landmark` you can see from the Heights.
- **A test:** a rider going down the mega ramp has to clear the gap and land at more than 60% of the speed it had at
  the lip. That's the point where landing on a slope keeps the velocity along it.

### C3. Bridges and big gaps
1. **Arroyo Viaduct.** A road bridge 18 to 25 m over the Arroyo between Old Town and the Arroyo, near the footbridge
   gate at about (-420, 150).
   - The deck is a box with railings you can grind, piers as decor, and the ditch underneath.
   - An expansion gap near mid-span about 6 m wide, with a deck kicker, for "the bridge gap".
   - You can still ride under it in the ditch.
2. **Harbour Lift Bridge.** A bascule bridge over a new harbour canal between Boardwalk West and Shipyard East, at x
   about 0.
   - One leaf is left up at about 20 degrees as a giant kicker, aimed at the far leaf.
   - The gap is about 25 m over water. Falling in is a bail.
   - It's the headline "Skate 3 bridge jump". The two harbour gates move to sit on the leaves.
3. **Boulevard flyover.** A highway overpass crossing the Grand Boulevard in the Financial Core.
   - An on-ramp kicker from the Boulevard, so you can jump the flyover.
   - Its rails are about 60 m long.
4. **Rooftop gaps.** One or two run-ups to the roof of a parking garage in Old Town or University, with a gap of
   about 12 m to the next roof, and a way down.

### Overall relief
- The Arroyo gets a deeper canyon reach (up to 20 m) south of the viaduct.
- Eastside gets one escarpment with a long stair-and-bank line down it.
- Both reuse `P.ground`.

## D. High speed engine checks (me)
- **Speed:** confirm there's no hidden cap above about 30 m/s; give the camera more pull-back at speed.
- **Landing on a slope** keeps the velocity along the slope; landing on flat from more than 8 m costs speed or is a bail.
- **Hit boxes:** solid-box collision at 30 m/s and 120 Hz is 0.25 m per step. Check that you can't tunnel through
  thin decks; sweep the step if you can.
- **Draw distance:** you have to be able to see the landing from the lip at the Quarry and the Mega Park. Add
  `P.landmark` silhouettes and bring the far plane in less there.
- **Rides:** add to tools/rides.mjs a quarry-run, a mega-ramp line and the bridge jump.

## Order and how it splits up
1. **Me, engine:** quarter pipes and air (A), grabs (B: double tap left, right thumb picks), speed checks (D).
   - Run the flick and regression tests, then publish, so the feel can be tried on the phone first.
2. **Me, kit:** `P.road` (step 1 above), `K.qp`, `K.spine`, `K.hip`, and a `K.bridge(axis, ...)` helper for a deck, rails, piers, an expansion gap and a kicker.
3. **Parallel worktree agents, each in its own district files:**
   - Heights: the winding roads, filling the empty space, and the Quarry.
   - East: the winding roads, filling the empty space, and the Mega Park.
   - Arroyo: the winding roads, filling the empty space, the canyon, and the viaduct's Arroyo half.
   - Old Town: the viaduct's Old Town half and a rooftop gap.
   - bw and ship: the lift bridge.
   - fin: the flyover.
   - uni: the quarry tunnel exit.
4. **Me:** integrate, then run check `--rhythm`, the rides and the slopes check. Re-measure emptiness and
   straightness, commit, push, publish, and refresh the map.

---

# Also next: stuff that doesn't belong on sidewalks

What the player said: there's random stuff on some sidewalks, like kickers.

## Measured
- There are 231 kicker-shaped slabs in the city. Of the plywood kickers, **65 sit on sidewalks**: heights 38, arroyo 14, east 6, fin 5, old 2.
- Another 102 plywood kickers are off the sidewalks: east 27, bw 19, arroyo 17, heights 13, fin 11, uni 9, ship 6.
  Many of those are in parks and DIY spots, which is fine; the rest need a look.
- The sidewalk ones are filler added to meet the rhythm rule (CONTRACT section 7). They sit at regular spacing, often
  one every 50 to 100 m down a street, e.g. heights z -447 and z -367 at x 511..952, and arroyo x -808, -646 and -462.
  They read as random because nobody leaves plywood on a sidewalk.

## Fix
1. **Rule (CONTRACT section 7).** Plywood kickers, jerseys and cones only go where they'd really be:
   - skate parks and DIY spots;
   - construction zones (`K.construction`);
   - a deliberate spot with a name, such as a kicker set against a wall or a gap launcher.
   On a plain sidewalk the filler has to be something that's really there. Use the existing kit:
   - `K.driveway` (driveway kicks), curb cuts, `K.crossingGap` at crossings;
   - `K.bench`, `K.planter`, `K.ledge`, `K.retainWall`, `K.busStop`, `K.bikeRack`, `K.newsBoxes`, hydrants;
   - a low wall in front of a house, a loading dock, steps up to a door.
2. **Check.** Add `tools/check.mjs --clutter`. It lists every kicker, jersey and cone that's on a sidewalk or a road,
   and isn't inside a park or named spot area or a construction zone. The target is 0.
3. **Swap.** In the fill-the-space pass, each district agent replaces its flagged kickers with the menu above. Keep the
   rhythm rule passing: a driveway or curb cut counts as skateable. Where a street really has nothing, fill the empty
   lots beside it instead of the sidewalk.
4. **Spot-check the other 102** off-sidewalk kickers the same way: they're fine in parks and spots, and get removed
   from roads, lawns and bare lots.

---

# More gameplay and map ideas (the player said yes to all of them)
★ marks the ones I'd do first: they make the most difference on a phone for the least work.

## Tricks and feel
- ★ **Wallrides and wallies.** Ride into a wall at an angle while airborne and you stick and roll along it for a moment. Ollie off it for a wallie. The city has hundreds of building faces that do nothing right now.
- ★ **Bonks and no-complies.**
  - A bonk is tapping a hydrant, bin or bollard while airborne: a small pop and points.
  - A no-comply or boneless is a foot-plant pop, done by double tapping the trick thumb on the ground. It gives a higher, slower pop for getting onto things.
- **Late flips and darkslides.** A late flip is a flick on the way down; a darkslide is a grind with the board flipped. This extends the current trick stick, it doesn't change it.
- **Hippie jump.** Jump over a bar or a low rail and land back on the board.
- **Proper slams.** A short ragdoll-ish tumble when you bail, a "Hall of Meat" score for the worst slams, and a slam-cam replay.

## Goals and progression
- ★ **Named gaps across the whole map.** Clear any defined start-to-end jump and it pays out with a named banner, like "Viaduct Gap" or "Market Stair Gap". A Gaps list on the map shows the ones found and the ones left. This goes with the new bridges, the Quarry and the Mega Park.
- ★ **Downhill races.** Race NPC skaters down the winding roads, with checkpoints and a time to beat. It uses the `P.road` work directly.
- **Own the Spot.** Score beats the local NPC skater's best at their spot. Winning puts your name on the spot sign.
- **Game of S.K.A.T.E. with NPCs.** Set and match flat-ground tricks; it uses the existing trick names.
- **Photo and film goals.** A photographer NPC at a spot: land a named trick in frame and it saves a still from the replay. "Get a cover" counts toward progress.
- **Sponsor track.** Challenges unlock decks, wheels and shoes in the shops, and new districts' shop items. It gives a reason to visit all 17 shops.

## Map and world
- ★ **Day and evening light.** The same city at golden hour or under street lamps, picked in the menu or cycling slowly. Lamps already exist everywhere; they just light up. Cheap, and the city feels new again.
- **Security and skate-stoppers.** A few plazas get a guard who walks over and moves you on if you keep sessioning. Some ledges have skate-stopper knobs you can grind off with a challenge.
- **Hidden spots.** Locked gates you open by finding a key tape, a rooftop reached by a fire escape, a drained fountain, a mall interior after hours.
- **Rideable transit.** A funicular or tram from the harbour up to the Heights: hop on, ride up, and bomb down again without fast travel.
- **Weather.** A wet day: shinier ground, less grip, puddles you can splash through.

## Phone quality of life
- **Replay editor.** Trim, slow-mo, and a few camera angles, so you can save a clip of a line.
- **Lefty layout.** Swap the thumbs.

---

# Roadmap: the order everything above gets built
Each phase ends with check, rides and flick tests, a commit and push, and a republish, so it can be tried on the phone
before the next phase starts.

1. **Feel** (engine, me):
   - quarter pipes that give air: pumping, lip pop, hang time, and `K.qp`, `K.spine`, `K.hip`;
   - grabs: double tap left, the right thumb picks;
   - high speed checks.
2. **Tricks** (engine, me): wallrides and wallies, bonks, no-complies and bonelesses, late flips, darkslides, hippie jumps.
3. **Roads and fill** (`P.road`, then district agents):
   - winding downhills;
   - filling the empty space;
   - clearing the sidewalk kickers, with `check --clutter`.
4. **Big vertical places** (kit `K.bridge`, then agents):
   - the Quarry with its tunnel to University;
   - the Mega Park;
   - the Arroyo Viaduct, the Harbour Lift Bridge, the Boulevard flyover and rooftop gaps;
   - the deeper canyon and the escarpment.
5. **Goals:**
   - named gaps map-wide, with a list on the map;
   - downhill races;
   - Own the Spot;
   - Game of S.K.A.T.E.;
   - photo goals;
   - the sponsor track and unlocks.
6. **World:**
   - evening light;
   - security guards and skate-stoppers;
   - hidden spots;
   - the tram or funicular up to the Heights;
   - wet weather.
7. **Slams and phone polish:**
   - a ragdoll-ish tumble, the Hall of Meat and the slam replay;
   - the replay editor;
   - the left-handed layout.

The README and the map artifact are updated at the end of each phase that changes the map or the controls.

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

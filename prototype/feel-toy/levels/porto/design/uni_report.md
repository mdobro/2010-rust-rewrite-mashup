# University (`uni`): designer review and sign-off

**Signed off.** All checks pass and every budget holds:
- errors none, inside the rectangle ok, border band ok, and all three gates (ridge, avenue and campus) ok;
- the sink scan's worst point is 6 cm, under the 10 cm limit;
- all 23 lines meet the rhythm rule.

I changed only four files in `levels/porto/uni/`: `uni_plan.js`, `uni_hill.js`, `uni_town.js` and `uni_south.js`. `index.js` is unchanged.

The full report is at `/tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad/uni_report.md`. It has the spot-by-spot list, the full rhythm table and every ride.

## What I changed

1. **Grind lines were over budget: 866 against 700. They are now 648.**
   - I added lean helpers to `uni_plan.js`: planters and pads grind on their two long edges only, picnic tables on the table top only, and wheel stops not at all.
   - All three parts now use these helpers.
   - The ledge strips in town and hill now use 8 m pieces instead of 4 m.
   - The rhythm still passes, because the check counts a box as skateable whatever its edges.
2. **Gown Street and Mill Lane sloped sideways.** A rider who didn't steer drifted into the College Row walls or the filler and stopped or bailed.
   - The lowland now starts at x 408 and ends at z 192, so both streets are flat across.
   - Straight rides now run their full length.
3. **The Science Plaza flatbar ran across the Kinked Twelve's run-up lane**, so it was a hurdle.
   - It now runs along the lane at x 697, z -32..-16.
   - I added a ledge at x 712.6, z -6..6, on the lane's east side.
   - Together these close the Science Run's last gap: 34 m with nothing skateable at (704, -11..24).
4. **The Library and Campanile landmarks flickered against the real buildings.** The far-view shapes had exactly the same faces as the real models, which put a pale wedge across the Library front. Each shape is now slightly smaller, so it sits inside the real building.
5. **Avenue gate handshake.** Fin's Metro Avenue sidewalks end at x 359.5, 0.15 m above the road, and ours are flush.
   - I added 2.4 m sloped ramps on our side at z ±9.
   - With fin built, I rode them both ways on both sides, and the road both ways: no bail.
6. **The Bike Shed DIY yard was drawn as grass.** It is now paved concrete.

## Final check

| budget | used | limit |
|---|---|---|
| boxes | 688 | 900 |
| grind lines | 648 | 700 |
| buildings | 33 | 70 |
| triangles added | about 329k (493k minus the empty map's 164k) | 450k |
| sign boards | 8 | 8 |
| fine ground | about 45.4k m² | 60k m² |
| load time added | 0.8 to 1.5 s (empty map 1.1 s, this page 1.9 to 2.6 s) | 1.5 s |

There are 10 challenges, 6 tapes and 7 travel points (1 district, 1 park, 5 spots). `build --check` is ok across all 56 level files. Both skate shops, Mortarboard Skates and Bluebook Boards, are there and work.

## Rhythm

All 23 lines pass with no rest stretches. The two bomb streets are 54% covered (Campus Drive descent) and 53% (University Avenue), with their road lanes kept clear.
- **Campus Drive descent:** sidewalk-edge walls, two bus-stop pockets and the Drive Kerb.
- **University Avenue:** sidewalk-edge ledge strips, a planter and a bench, with the Balustrades and the Avenue banks along the embankment.

## Rides

Nothing bails, sticks or stalls on the doc's check rides, the named lines, every gate in both directions, or the main spots.

| ride | result |
|---|---|
| Ridge Road, in from the Heights at 19 m/s | tops out at 11.3 m/s |
| Avenue from the plateau | 12.7 m/s at the foot |
| Campus Drive descent | 10.7 m/s |
| Kinked Twelve (from x 700) | down both flights at 8.4 m/s |

Ride starts placed on a handrail's centre line bail, because the rider hits the rail. Test rides should start between the rails: x 564 at the Great Steps, 806.5 at the Library, 565 at Old Main and 700 on the Twelve.

## Best screenshots

All in `/tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad/shots-uni/`:
1. `library.png`: the Library and its dome over the Quad walk ledges, with no flicker now.
2. `great-steps.png`: the Great Steps double flight and its rails, seen from the Commons fountain bowl.
3. `kinked-twelve.png`: the Kinked Twelve's two flights and the kinked rail.
4. `thirteen-yard.png`: Thirteen Yard, looking up the West Thirteen to the Gateway and the Campanile.
5. `uni_aerial.png`: the whole district.

## What still isn't right

1. **Rampart Lane** (x 488..496) still falls about 2 % to the west. A rider who doesn't steer drifts into the Yard ledge after about 60 m. I left it, because fixing it means reworking the slope under the west wall.
2. **Load time** varies between runs, and a slow run lands right at the 1.5 s limit. If the integrator needs headroom, cut trees and the five pedestrians first; each pedestrian is about 22k triangles.
3. **The design doc is out of date** on:
   - the Avenue profile;
   - the lowland edges (now x 408 and z 192);
   - the Science Plaza flatbar and ledge positions;
   - the Track Kerb straights, which are built as `K.strip`;
   - where the test rides start.
4. **Fewer people than the doc asks for:** 5 pedestrians and 3 skaters instead of 24 and 4, because of the triangle budget.
5. **The campus gate** has no handshake in CONTRACT. Our side is flush and rides cross it cleanly, but I haven't checked it against Eastside's sidewalks.
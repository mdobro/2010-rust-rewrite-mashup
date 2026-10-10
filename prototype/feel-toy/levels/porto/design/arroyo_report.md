# Arroyo review: designer sign-off

## Built (by spot)
- **Channel, upper (arroyo_upper.js)**: North Ford, Catwalk W, Confluence, Channel Curbs, DIY Underpass (pyramid, banks, pier lane under the viaduct arches) and Storm Door Row. The levee guardrails have gaps at z 108..114 and 138..144 for drop-ins.
- **Channel, lower (arroyo_lower.js)**: Catwalk E, Stair Tower (footbridge down to the channel), Pipe Crossing, Outfall Debris and South Ford. Grates cross the low-flow slot, and the West Door kicker sits over the sump.
- **East bank (arroyo_east.js)**: Water Board Plaza; Planter Run with its head at the Planter Alley gate; Gas Ring (a pool bowl inside the gasholder frame); Pump Station No.2; **Dry Creek Skate Supply** (shop); Outfall Park; Footbridge Walk.
- **West bank (arroyo_west.js)**:
  - Seco Yard: the hump, with rails that follow the ground, and the gantry.
  - Boxcar Run: boxcars, ramps and the BOXCAR RUN gap.
  - Switch Yard pocket, the turntable bowl, and the new Yard Hut pocket (pad, ledge, jersey).
  - Freight Platform: a 160 m ledge, with the FREIGHT LEDGE challenge and the siding.
  - **Railyard Boardworks** (shop): its door faces Yard Street. I fixed the spot and travel yaw.
  - Dock Row, Footbridge Landing, Seco Foundry (stack plinth, silos) and Scrapyard.
- **Routes**: Mill Street, Levee Road and Gasworks Lane, each pushed and bombed down. Also Run Street, Viaduct Road, Yard Street, Foundry Road, Ford Road, Outfall Road and both levee paths.
- **Life**: 4 traffic routes, peds, 4 session skaters, 11 challenges, 6 tapes and 12 travel points.
- **Budget passes (arroyo_budget.js)**:
  - Ledges merged where they run in one line, small boxes trimmed to one edge, and slabs and rails merged.
  - Guardrails use only as many segments as they need to follow the ground. Yard track rails are fitted to the ground and lifted where they sag.
  - The east rail of each track is decor only.

## Final check
`node tools/check.mjs --html $SP/build/arroyo.html --only arroyo --rhythm --shots $SP/shots-arroyo`

| Item | Result | Budget |
|---|---|---|
| errors | none | none |
| boxes | 690 (39 buildings) | 900 |
| grind lines | 687 | 700 |
| buildings | 39 | 70 |
| triangles | 552k scene, about 388k added over the ~164k empty map | 450k added |
| D.sign | 7 | 8 |
| fine ground | about 17.4k m² | 60,000 m² |
| load | 2.3 s, about 1.1 s over the 1.2 s empty baseline (1.8–2.4 s across runs) | 1.5 s added |

- Also in the scene: 232 sloped blocks, 30 hazards, 1469 meshes.
- Inside the rectangle and the border band at base height: both ok.
- Gates:
  - culvert (-700,-230) y 1.0: ok
  - planters (-420,-40) y 0.0: ok
  - footbridge (-420,520) y -17.8: ok
  - spillway (-700,910) y -40.2: ok
- Sink scan: worst 9 cm at (-962,-126), on the plan's hump. Next is 8 cm along x -986, the hills at the map edge. Both are within about 10 cm.

## Rhythm (20/20 ok)
| Line | Kind | Length | Covered |
|---|---|---|---|
| Mill Street | push | 370 m | 100% |
| Mill Street (down) | bomb | 656 m | 98% |
| Levee Road | push | 370 m | 96% |
| Levee Road (down) | bomb | 656 m | 99% |
| Gasworks Lane | push | 222 m | 95% |
| Gasworks Lane (down) | bomb | 656 m | 99% |
| Run Street | push | 168 m | 97% |
| Viaduct Road | push | 318 m | 95% |
| Yard Street | push | 74 m | 80% |
| Foundry Road | bomb | 648 m | 98% |
| Ford Road | push | 182 m | 78% |
| Outfall Road | push | 422 m | 82% |
| Footbridge Walk | push, main | 370 m | 93% |
| West Levee Path | push | 1104 m | 100% |
| Levee Path | push | 1104 m | 100% |
| Planter Run | push, main | 278 m | 95% |
| The Full Run | bomb, main | 1216 m | 84% |
| Viaduct Line | push, main | 190 m | 100% |
| Footbridge Line | push, main | 447 m | 92% |
| Yard Line | push, main | 510 m | 82% |

The Yard Line was the one line that failed this round: 55 m bare along z 116, and 272 m with no named spot. I fixed it by adding the Yard Hut pocket and spot at (-836,118).

## Rides
I rode with a scratch line-follower ($SP/rideline.mjs) and with the plain harness.
- **Streets and paths**: all 14 street and path lines ridden end to end, push and bomb, with no bails. Bombs reach about 16 m/s.
- **Viaduct Line**: complete, 188/190 m. It drops in through the levee guardrail gap.
- **Yard Line**: complete, 507/510 m, through the boxcars, the yard hut and the guardrail gap into the DIY. Its platform side branch was also ridden to the end.
- **Planter Run**: complete, 276/278 m.
- **Footbridge Line**:
  - From the deck to the stair head, and from the tower foot south: both complete.
  - The full line slams at (-688,530), where it reaches the stairs; the follower can't ride stairs.
- **Full Run**:
  - Reaches about 883 m and the West Door kicker. A rider who doesn't ollie falls into the sump ("In the water") at 7–11 m/s, and clears it at 13 m/s.
  - The section after the pipe gap, (-712,606) to (-700,905), is complete, 325/327 m.
  - The route now crosses the slot only on the grates.
- **Gates**: I rode the culvert and spillway gates both ways cleanly. The planters and footbridge gates pass the check but drift in the plain harness: the Footbridge Walk deck tilts about 6 % across the direction of travel.

## Best screenshots
- `$SP/v1/diy.png`: the DIY Underpass, a pyramid and banks under the viaduct arches.
- `$SP/v1/pipes.png`: Pipe Crossing over the channel, with the Foundry stack behind.
- `$SP/v2/stairs.png`: the Stair Tower coming off the Arroyo Footbridge into the channel.
- `$SP/v1/viaduct.png`: the viaduct arches striding over the arroyo.
- `$SP/v3/gasring.png`: the Gas Ring bowl inside the gasholder frame.

(Also: `$SP/v1/boardworks.png`, the Railyard Boardworks shop front; `$SP/v3/hump.png`, the hump with ground-following track rails; `$SP/shots-arroyo/arroyo_aerial.png`, the district from above.)

## Still not right
- **Budgets close to their limits**: grind lines are at 687/700 and D.sign at 7/8, so there is almost no room for additions. Load added is about 1.1 s against 1.5 s, and it varies from run to run.
- **Full Run at the West Door**: without an ollie the Full Run drops into the sump at the West Door kicker. That is the doc's intended hazard, but it is a hard stop on the main bomb line for a casual rider.
- **Stair Tower**: the stairs haven't been verified by a ride. The follower can't take stairs, so that leg of the Footbridge Line is untested.
- **Cross-slope**: Footbridge Walk tilts about 6 % across the direction of travel, and Outfall Road also slopes sideways, so riders drift sideways without steering.
- **Water Board Plaza** is still sparse for a named plaza.
- **Gas Ring look**: the gasholder frame's top disc reads as a solid lid. In the gasring view there are also white striped columns over the frame, probably the shared landmark mesh, which hides only on a cull tick. Worth a look in integration.
- **Track rails**: only the west rail of each yard track can be ground; the east rail is drawn decor, to save budget. In track sections fitted with a single straight piece, the rail floats up to 12 cm over the ground.
- **Sink scan**: up to 9 cm of the drawn ground pokes above the ridden surface at the hump and along x -986.

Report file: /tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad/arroyo_report.md
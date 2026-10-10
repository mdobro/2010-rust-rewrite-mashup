# Shipyard East (`ship`): designer review and sign-off

**Signed off.** The district needed one budget fix: it had 1,077 grind lines against the 700 budget, and now has 669. It also got six ride and fit fixes and a better crane landmark. The final check is clean. Every file I touched is in `levels/porto/ship/`.

## What's built, by spot

- **west (x 0..256)**
  - **Net Racks:** 8 flat-bars at 0.75 m on drying frames. The Net Rack session skater is back.
  - **Port Authority:** a terrace with the Authority Five (3 handrails, lips), a bank, block benches and planters. Two challenges: `ship-pa-kf` and `ship-pa-crook`.
  - **Net Lofts:** with **Slipway Skates**, the shop. It works.
  - **Bonito Cannery:** a dock with 3 hubba levellers.
  - **East Quay Fish Market:** platform, ramp, steps, tables and roof.
  - **Quay Walk:** slappies.
  - **Quay edge:** a ledge running x 0..256.
  - **Filler spots:** four.
- **bays (x 256..589)**
  - **Loading Bay Row:** docks WA1..3 and the 64 m Long Dock; C1..3 and D5..9; the WA1 ramp with its handrail; the D5 leveller; 4 manual pads; the LOADING BAY ROW sign.
  - **Deckhand Skate Supply:** on Gantry Road. It works.
  - **Pilot Slip:** slipway hubba, gangway rails and pontoon.
  - **Challenge:** `ship-bay-line`.
- **yard (x 589..1000, z 910..1112)**
  - Gantry Road: paint, sloped sidewalks and pocket ledges.
  - Pallet Yard.
  - **Skyway Stub:** on-ramp, deck, guardrails, the jersey gap, and the Skyway Gap onto the gravel pile.
  - **Under the Skyway DIY:** two pier banks, a ledge and a pad. It is the district's only built-for-skating corner. By design (doc §6) there is no skatepark: bw has the Harbour Bowl next door.
  - **Flatbed Row** and the jersey maze.
  - The rail spur.
  - **Terminal Gate 3.**
  - The container yard with **Stack Run A3 / East B3**, the Valley and the Box Drop.
  - **Reefer Row** with the **Reefer Canyon**.
  - 13 spots and 4 challenges.
- **quay (x 589..1000, z 1112..1350)**
  - The Quay Road crossing and Quay Road east.
  - **Crane Quay:** 3 gantry cranes with grindable sills, 3 straddle carriers, and 6 hatch-lid tables.
  - **The Corvina:** stern ramp, side-deck ship's rails, hatches H1..H4, and the forecastle with its bow rails. Two challenges: `ship-ship-rail` and `ship-hatch-tre`.
  - Landmarks for the cranes and the ship.
- **index:** the ground, colours, 2 fine regions, 17 P.lines, traffic, peds and skaters, the `ship-score` challenge and the district travel point.

## What I changed in review

1. **Grind lines, 1,077 → 669:**
   - **Container stacks** 2.6 m and taller (unreachable from the aisles): no edges, in `ship_yard.js`.
   - **Stack Runs:** one Ledge rail per side for the whole run instead of one per box (4 instead of 30). The grind still runs the full 105 m.
   - **Reefer stacks:** they grind on their long `ew` sides only.
   - **New `ship_index_trim` in `index.js`:** a block with 4 grind edges that is 3 m or less across keeps only its two long sides. A loose pallet under 1.5 m keeps none, except the Pallet Yard spot's pallets.
   - **Rhythm unaffected:** it counts boxes, not their edges.
2. **Crane landmark** (`ship_quay.js`): the far silhouette was three solid 30 × 30 m walls. It is now 4 legs, 2 portal beams and the boom for each crane, matching the real model's sizes.
3. **Curb cuts:**
   - At x 906.5, over the Harbour Road south sidewalk and the Quay Road north sidewalk, so the Reefer Run reaches the N1 plate and comes off N3 (yard).
   - Where the Long Dock runs out onto Quay Road (bays).
   - At x 206, over the Quay Road south sidewalk, to reach the fish platform ramp (west).
4. **Reefer Run line:** the bike rack at (906, 1028) stood in it. It moved to x 890 (yard).
5. **Deckhand Skate Supply:** the Gantry sidewalk ledge at z 1042 stood right in front of the shop door. It moved to z 1054.
6. **Peds and skaters:** the parts used fewer triangles than feared, so 2 Port Authority forecourt peds and the Net Rack session skater are back. That makes 7 peds and 3 skaters.

## Final check

Run with `check.mjs --only ship --rhythm` on `scratchpad/build/ship.html`. `build.mjs --check` is ok.

- **Contract checks:** errors none. Inside the rectangle ok, border band ok. All three gates ok: hillbomb (600, 910) y -40.2, harbourRd (0, 1020) y -40.9, boardwalk (0, 1150) y -41.8.
- **Sink scan:** worst 8 cm at (950, 1170). This is the hill-toe smoothing and is under 10 cm.

| | count | budget |
|---|---|---|
| boxes | 767 | 900 |
| grind lines | 669 | 700 |
| `K.building` | 11 | 70 |
| triangles added | 501k scene − 164k empty map = **337k** | 450k |
| `D.sign` boards | 7 (PORT AUTHORITY, BONITO CANNERY, EAST QUAY FISH MARKET, LOADING BAY ROW, ROAD ENDS, TERMINAL 3, CORVINA) | 8 |
| fine ground | 16,000 + 8,500 ≈ 24,500 m² | 60,000 |
| load added | ~0.3–0.9 s (1.2–2.2 s against 0.9–1.2 s for the empty map, headless) | 1.5 s |

Other counts: 62 sloped blocks, 18 hazards, 10 challenges, 5 tapes, 3 skaters, 4 traffic routes, 6 travel points.

## Rhythm: 17/17 ok, no breathers

| line | kind | length | covered |
|---|---|---|---|
| Gantry Road | bomb | 276 m | 80% |
| Harbour Road | push | 930 m | 96% |
| Quay Road | push | 834 m | 97% |
| Ropewalk Lane | push | 573 m | 92% |
| Net Loft Lane | push | 188 m | 100% |
| Bay Lane | push | 188 m | 100% |
| Straddle Lane | push | 78 m | 94% |
| Yard Entry Lane | push | 78 m | 100% |
| Skyway Approach | push | 172 m | 59% |
| Quay Walk | push | 104 m | 67% |
| Crane Quay | push | 320 m | 94% |
| Skyway Roll-out | bomb | 116 m | 100% |
| Bomb to the Bow | bomb, main | 425 m | 84% |
| Loading Bay Line | push, main | 469 m | 96% |
| Skyway to the Cranes | push, main | 1027 m | 96% |
| Fish Quay | push, main | 908 m | 92% |
| Reefer Run | push, main | 439 m | 99% |

The filler is real skateable pieces (ledges, pads, planters, jerseys, pallets, roadworks pockets, bike racks), not just curbs and lamps. On Gantry Road it sits at the outer edges of the sidewalks, so the bomb lane stays clear.

## Rides

The ride harness never steers or ollies.

**Gates, both ways:**

| ride | result |
|---|---|
| hillbomb in at 15.5 m/s | Straight down Gantry Road, across both roads, up the stern ramp and onto the deck. It stops at the H1→H2 gap (3.5 m, needs an ollie). Nothing in the bomb lane. |
| hillbomb out (push north from z 990) | Clean to z 872. |
| Gantry Road push up from z 1150 | Clean to z 864. |
| harbourRd out | Clean. |
| harbourRd in | Rolls, then stops against the Harbour Road south curb at x 108. The base's 0.7 % cross-fall drifts the unsteered rider 5 m south. |
| boardwalk in | Rolls, then slams on a Quay Walk filler ledge. Same drift as harbourRd in (2.2 % fall south). |
| boardwalk out | Rolls, then slams on a slappy. Same drift. |
| quay edge ledge west, x 250 → 0 | Clean, reaching x -3 at the z 1176..1180 handshake. |

**Other rides:**

- **Clean:**
  - Skyway deck → gap → gravel: 0.6 s of air, rolls out at 13.5 m/s.
  - Skyway on-ramp up.
  - Stack Run A3 → Valley.
  - Harbour Road and Quay Road end to end, both directions.
  - Bay Lane, Net Loft Lane, Yard Entry Lane and Straddle Lane.
  - Corvina side deck, 1192 → 1306.
- **Reefer Run:** with the new curb cuts it climbs onto N1 and falls into the canyon. The canyon is a gap and needs an ollie.
- **Bails that are by design:**
  - The WA1→WA2 drop gap needs an ollie.
  - Box Drop: a straight run hits the N1 face after 27 m. The rider turns on the aisle.
  - Pilot Slip: ends in the sea.
  - Long Dock and N3: a run off the end straight across Quay Road meets the far curb. The line turns.
  - Skyway Approach (north): runs into the side of the on-ramp's foot, where the line turns west.
  - Crane Quay: a drifting rider reaches the edge ledges at z 1144.
- **Shops:** a scripted stop in each zone shows the shop button:
  - Slipway Skates at (228, -41.71, 1003.7).
  - Deckhand Skate Supply at (585.8, -41.98, 1042).

## Best screenshots

Screenshot folder: `/tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad/shots-ship/`

- `v_authority.png`: the Port Authority terrace, the Authority Five with its handrails and the PORT AUTHORITY sign, and the planter trees.
- `v_cranes_far.png`: from over Harbour Road, looking south over the container yard, the Stack Run and the three cranes, with the Corvina beyond.
- `v_corvina.png`: the Corvina's deck with hatches H1..H4, the superstructure and funnel, and the mooring lines.
- `v_slipway.png`: Slipway Skates under the Net Lofts, with the stoop stairs and an AI skater going past.
- `v_skyway.png`: the Skyway Stub deck on its piers, the ROAD ENDS gantry, the gravel pile and the roll-out apron filler.

## What still isn't right

- **Gate drift:** going in at harbourRd and boardwalk, an unsteered rider drifts onto curbs or ledges about 100 m in. A real rider steers, and the gate heights are the handshake values, so I did not reshape the ground near x 0.
- **Plain containers:** stacks are untextured coloured boxes and read flat and dark up close.
- **Load time** is noisy headless (1.2–2.2 s total). It is inside the 1.5 s added budget but worth re-measuring once the whole map is integrated.
- **Thin margins** after my changes: grind lines 669/700 and signs 7/8. Any later addition should come with a matching trim.
- **Cut life:** the doc's west-apron loop skater and 15 of its peds are still cut, to save triangles.
- **Screenshot artifact:** check-tool shots force-show every mesh, so landmarks appear inside their `near` radius. That is an artifact of the shots, not the game.

## Files

- `/home/user/2010-rust-rewrite-mashup/prototype/feel-toy/levels/porto/ship/index.js`: `ship_index_trim`, and the peds and skater added back.
- `/home/user/2010-rust-rewrite-mashup/prototype/feel-toy/levels/porto/ship/ship_yard.js`: stack edges, Stack Run ledges, reefer edges, the Reefer Run curb cuts, and the moved bike rack and shop ledge.
- `/home/user/2010-rust-rewrite-mashup/prototype/feel-toy/levels/porto/ship/ship_quay.js`: the crane landmark.
- `/home/user/2010-rust-rewrite-mashup/prototype/feel-toy/levels/porto/ship/ship_bays.js`: the Long Dock curb cut.
- `/home/user/2010-rust-rewrite-mashup/prototype/feel-toy/levels/porto/ship/ship_west.js`: the fish ramp curb cut.
- Test page: `/tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad/build/ship.html`
- Report: `/tmp/claude-0/-home-user-2010-rust-rewrite-mashup/861a95eb-5943-598e-ae43-1a0d141b4458/scratchpad/ship_report.md`
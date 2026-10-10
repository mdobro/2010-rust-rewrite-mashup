# Porto Alto: the district contract

Every district of Porto Alto is built by its own code in `levels/porto/<id>/`. Many agents work on the
map at once, so these rules keep the districts from breaking each other and make them join up into
one city you can ride across. Read this all the way through before you write a line.

Also read: `levels/porto/base.js` (the map, the gates, the base height, the `P` helper),
`levels/porto/OUTLINE.md` (the brief the map came from), `levels/kit.js` (the city kit),
and the old level code your district inherits (listed under your district below).

## 1. The map

x runs west → east, z runs north → south. One unit is one metre. The land falls from the Heights
(y 44 on the ridge) to the harbour (y -42), and the sea starts at z 1180 (water at y -46).

```
 z -650 ┌───────────────────────── heights: THE HEIGHTS (ridge y 44, falls to y 1 at z -230) ──────────────────────────┐
        │   culvert ↓ (-700)            switchback ↓ (-100)   observatory ↓ (220)      ridge ↓ (650)                 │
 z -230 ├──────────────┬──────────────────────────────────────────────┬──────────────────────────────────────────────┤
        │ arroyo:      │ fin: FINANCIAL CORE (flat y 0)               │ uni: UNIVERSITY (y 0, may be raised)         │
        │ THE ARROYO   │ Downtown sits at x,z -120..120 unchanged      │                                              │
        │ (the ditch:  ◄ planters (z -40)                 avenue ► (z 0)                                              │
        │ floor below  │                    boulevard ↓ (-40)          │                       campus ↓ (650)          │
 z  230 │ the banks)   ├─────────────────────────────────────────┬────┴──────────────────────────────────────────────┤
        │              │ old: OLD TOWN (y 0 → -40)              │ east: EASTSIDE HILLS (y 0 → -40)                  │
        │              ◄ footbridge (z 520)        crosstown ► (z 560)                                               │
        │ spillway ↓   │              steep ↓ (-200)             │                     hillbomb ↓ (600)              │
 z  910 ├──────────────┴──────────────────────┬──────────────────┴───────────────────────────────────────────────────┤
        │ bw: BOARDWALK WEST (y -40 → -42)    ◄► harbourRd (z 1020), boardwalk (z 1150)   ship: SHIPYARD EAST         │
 z 1180 │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ the sea (y -46) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ │
 z 1350 └─────────────────────────────────────┴───────────────────────────────────────────────────────────────────────┘
       x -1000        -420                  0      300  360                                                   x 1000
```

| id | district | rect x0..x1, z0..z1 | base height |
|---|---|---|---|
| heights | The Heights | -1000..1000, -650..-230 | 44 on the ridge (z < -560), falling about 12.7 % to 1 at z -230 |
| arroyo | The Arroyo | -1000..-420, -230..910 | follows the profile: 1 → 0 → -40; the ditch is cut into it |
| fin | Financial Core | -420..360, -230..230 | 0, flat |
| uni | University | 360..1000, -230..230 | 0, flat |
| old | Old Town | -420..300, 230..910 | -0.4 at z 230 falling 6 % (3.5°) to -40 at z 910 |
| east | Eastside Hills | 300..1000, 230..910 | the same as Old Town |
| bw | Boardwalk West | -1000..0, 910..1350 | -40 → -42 at the quay (z 1180), sea beyond |
| ship | Shipyard East | 0..1000, 910..1350 | the same as Boardwalk West |

The base height depends on z only (plus hills round the outer edge of the map at |x| > 975 and
z < -625, which make the edge visible). `P.baseH(x, z)` gives it.

### Gates

A gate is where a route crosses from one district into the next. At each gate, **both** districts
deliver open, rideable ground at the base height across the gate's full width, for `GATE_DEPTH` (16 m)
in from the border, and a road, path or ditch that **actually leads there** from the rest of the
district. Nothing taller than 0.3 m may stand in the gate corridor (16 m deep each side, gate width
wide). `dir: 'x'` means the border runs east–west there, so you cross it going north–south.

| gate | from → to | at (x, z) | crossing | width | base y |
|---|---|---|---|---|---|
| switchback  | heights → fin    | -100, -230 | north–south | 16 | 1.0 |
| observatory | heights → fin    | 220, -230  | north–south | 12 | 1.0 |
| culvert     | heights → arroyo | -700, -230 | north–south | 16 | 1.0 |
| ridge       | heights → uni    | 650, -230  | north–south | 16 | 1.0 |
| avenue      | fin → uni        | 360, 0     | east–west   | 16 | 0.0 |
| planters    | fin → arroyo     | -420, -40  | east–west   | 12 | 0.0 |
| boulevard   | fin → old        | -40, 230   | north–south | 20 | -0.4 |
| campus      | uni → east       | 650, 230   | north–south | 16 | -0.4 |
| crosstown   | old → east       | 300, 560   | east–west   | 16 | -20.3 |
| footbridge  | old → arroyo     | -420, 520  | east–west   | 8  | -17.8 |
| spillway    | arroyo → bw      | -700, 910  | north–south | 24 | -40.2 |
| steep       | old → bw         | -200, 910  | north–south | 16 | -40.2 |
| hillbomb    | east → ship      | 600, 910   | north–south | 16 | -40.2 |
| harbourRd   | bw → ship        | 0, 1020    | east–west   | 16 | -40.9 |
| boardwalk   | bw → ship        | 0, 1150    | east–west   | 12 | -41.8 |

The routes this makes, top to bottom (the user asked for more than one way down, ending up in
different places depending on which way you go):

* From the ridge: **culvert** → the Arroyo ditch → **spillway** → Boardwalk West;
  **switchback** or **observatory** → Financial → **boulevard** → Old Town → **steep** → Boardwalk West;
  **ridge** → University → **campus** → Eastside → **hillbomb** → Shipyard East.
* Across: **planters** (fin ↔ arroyo), **avenue** (fin ↔ uni), **footbridge** (old ↔ arroyo, over the
  ditch, at the bank top), **crosstown** (old ↔ east), **harbourRd** and **boardwalk** (bw ↔ ship).

## 2. Code rules (the build breaks if you don't keep them)

All the level files are spliced into one script, in one shared scope.

* Your code lives only in `levels/porto/<id>/`. Don't edit anything outside your folder (not
  `base.js`, not `kit.js`, not `index.html`, not another district). If you need something changed
  there, say so in your report.
* **Every top-level name starts with `<id>_`.** The only top-level things in your files should be
  function declarations: `function uni_quad(K, P) { ... }`. Put constants inside functions. Two files
  defining the same top-level name is fatal; `node tools/build.mjs --check` lists any.
* `<id>/index.js` defines `function porto_<id>(K, P)`. That is the one the map calls. It calls
  `P.ground(...)` first, then each part, in order. A part file `<id>/<part>.js` defines one
  `function <id>_<part>(K, P)` (it may define more helpers, all with the `<id>_` prefix). Files in the
  folder are spliced in name order, with `index.js` last.
* Parts often need shared numbers (a street's line, a plateau's height). Put them in
  `<id>/<id>_plan.js` as `function <id>_plan() { return { ... }; }` and call it from each part.
* Plain modern JS, no imports. You can use `THREE`, `V(x, y, z)` (a THREE.Vector3), `lerp`, `clamp`,
  and everything on `K` and `P`.

## 3. Space rules

* **Stay inside your rectangle.** Every box, sloped block, grind line, tree, lamp and piece of decor
  must be inside it. Leave about 0.5 m spare along borders shared with another district.
* **The border band.** Within `BAND` (12 m) of a border shared with another district, the ground
  is blended from your `P.ground` back to the base height: at the border itself it **is** the base
  height. Don't put `K.feat` / `K.pool` / `K.hump` features in the band (they aren't blended). Keep the
  band rideable: no walls of buildings with no way through, except where the border is meant to be
  closed. Outer map edges (the hills at x ±1000, z -650, the sea) need no band.
* **Gates are open** and reached by a real route (above).
* Water: the sea is already there. If you add water (a canal), register it with `P.water` so falling
  in is handled.

## 4. The P helper (your district's handle on the map)

```js
P.id, P.name, P.rect = [x0, x1, z0, z1], P.gates (the gates on your borders), P.baseH(x, z), P.PORTO
P.inside(x, z, pad = 0)                 // is (x, z) in your rectangle (pad metres in from the edge)
P.ground((x, z, base) => height)        // YOUR ground. Call first. base = the base height there.
P.col((x, z, h) => THREE.Color | null)   // ground colour (null: the default grass/concrete)
P.surface((x, z) => 'rough' | 'smooth' | null)  // rough = grass/gravel/dirt (slower, louder)
P.region(x0, x1, z0, z1, res)           // draw the ground finer here (res in metres: 4, 2, 1, 0.5)
P.spot(name, x, y, z, yaw, area)        // a named spot (for the spot list and challenges)
P.line(name, [[x, z], ...], kind, main) // a line people ride: kind 'push' (streets, plazas, paths) or 'bomb'
                                        // (descents); main = true for your named lines. Declare every street,
                                        // path and line in your doc: check.mjs --rhythm measures them (see 7)
P.travel(name, x, y, z, yaw, kind)      // a fast-travel point. kind: 'district' (exactly one per
                                        // district: its front door), 'park' (each skatepark), 'spot'
P.challenge({...})                      // see 6
P.tape(x, z, y)                         // a hidden tape to collect (y: the surface height there)
P.traffic(def), P.peds(def), P.npc(def) // cars, people, other skaters (see 6)
P.landmark({...})                       // a far-off silhouette (see 6)
P.water(x0, x1, z0, z1, y)
P.shop({...})                           // a skate shop (see 6): every district has at least one, preferably two
```

**The ground.** `P.ground` sets the height inside your rectangle. It's analytic: the skater rides
exactly on what your function returns. The drawn mesh is sampled from it on an 8 m grid by default, so
anything that bends inside 8 m (a bank, a ditch wall, a curb ramp, a crest) needs `P.region(..., 2)`
or finer there, or the drawn ground floats above or sinks under the ridden ground (the check's "sink
scan" tells you). Keep the finer regions tight: a 100 × 100 m region at res 2 is 5,000 cells.
Vertical steps belong in boxes, not in the ground function.

## 5. The kit (K)

`K = cityKit(baseH)` is shared by the whole map. `K.terrainH(x, z)` is the final ground (your
`P.ground`, plus any features). The useful builders (read `levels/kit.js` for the details; all heights
are world y, and most "sits on the ground" builders read `K.terrainH` for you):

| builder | what it makes |
|---|---|
| `K.B(x0, y0, z0, x1, y1, z1, mat, extra)` | a solid box. mat: 'plaza', 'sidewalk', 'step', 'ledge', 'pad', 'curb' (red-painted), 'marble', 'garage' (rough concrete), 'wood', 'metal', 'car', 'glass', 'fence', 'building'. extra: `{ edges: 'nswe', color, tex, ghost }` (edges = which top edges you can grind) |
| `K.Bg(x0, z0, x1, z1, hgt, mat, extra)` | a box sitting on the ground, `hgt` tall above its highest corner |
| `K.building(x0, z0, x1, z1, floors, color, tex)` | a building (3.4 m a floor). tex: 'brick', 'stone', 'office' |
| `K.street(axis, c, from, to, y, crossings, opt)` | a painted road along x or z with centre line (y: road height, crossings: the cross streets) |
| `K.stairSpot(axis, at, dir, a0, a1, top, bottom, n, tread, { rails, hubbas, bank })` | a stair set with handrails / hubbas / a bank beside it |
| `K.SET(...)` | just the stairs |
| `K.ledge`, `K.planter`, `K.pad`, `K.bench`, `K.jersey`, `K.parkingBlock`, `K.picnic` | street furniture you can grind |
| `K.kicker(x, z, dirx, dirz, len, hgt, w)` | a ramp (a sloped block) |
| `K.hubbas.push({ a: V(...), b: V(...), w, noRails, color })` | any sloped block: a bank, a ramp, a hubba (top at a, bottom at b) |
| `K.rail(ax, ay, az, bx, by, bz, kind, post)` | a grind line. kind: 'Rail', 'Handrail', 'Flatbar', 'Ledge', 'Curb', 'Coping', 'Pipe', 'Hubba' |
| `K.lip(ax, az, bx, bz, y)` | a painted grindable edge (a curb, a stair lip) |
| `K.feat(x0, x1, z0, z1, (x, z, h) => v, op)` | change the ground in a box: op 'min' (dig), 'add', 'set' |
| `K.pool(x0, x1, z0, z1, [[K.poolS.circle(cx, cz, r), depth], ...], y0)` | a bowl or pool (draws its ground fine on its own) |
| `K.hump(cx, cz, r, hgt)`, `K.fountainBowl`, `K.sunkenPlaza`, `K.raisedPlaza`, `K.bankToWall`, `K.garage`, `K.loadingDock`, `K.containers(x0, z, n, stack, alongX, gap, y)`, `K.backyardPool`, `K.driveway(axis, c, side, u, RW, w)` | ready-made spots. `K.driveway` now ends on the road wherever the road is, and `K.containers` stands on the ground (or on `y`), so both work on slopes |
| `K.strip(ax, az, bx, bz, hgt, w, { kind, top, seg, noRails, color })` | a slab that follows the ground along any line, in chords of ≤ 6 m, `hgt` over the ground; both long edges grind as one continuous grind. Sidewalk curbs, ground-hugging ledges, long manual pads |
| `K.median(ax, az, bx, bz, w, { planter, trees })` | a traffic island down a road: 0.15 curb, a 0.5 planter ledge in the middle, trees |
| `K.retainWall(ax, az, bx, bz, back, hgt, thick)` | a hillside retaining wall: a ledge `hgt` over the high ground `back` m to the side (+ left, − right of the line) |
| `K.construction(x, z, alongX)` | a 12 × 3 m roadworks pocket: jerseys, a ply kicker, a scaffold pipe rail, cones |
| `K.crossingGap(ax, az, bx, bz, hgt)` | a curb-cut kicker at A aimed at B (over a cross street or driveway) and a landing ramp at B |
| `K.tree(x, z)`, `K.lamp(x, z, side)`, `K.car(x, z, alongX)`, `K.busStop`, `K.trashCan`, `K.hydrant`, `K.bikeRack`, `K.dumpster`, `K.newsBoxes`, `K.meter` | dressing (trees and lamps are solid posts) |
| `K.prop(x0, y0, z0, x1, y1, z1, color)` | a box you can see but not hit (awnings, signs, far-off detail) |
| `K.paintRect(x0, z0, x1, z1, color, y)`, `K.dash(...)` | paint on the ground |
| `K.decorFns.push(D => ...)` | anything drawn only (see below) |
| `K.rnd()`, `K.R(a, b)`, `K.pick(arr)`, `K.col()` | the map's seeded random numbers. Use these, never `Math.random` |

Inside `K.decorFns.push(D => { ... })` you get the decor API. Everything here is merged into tiles and
costs little, except `D.sign`:
`D.paint(x0, z0, x1, z1, y, color)`, `D.plane(x0, z0, x1, z1, y, color, textured)`,
`D.dash(x0, z0, x1, z1, color, w)`, `D.palm(x, z, y)`, `D.tree(x, y, z)`, `D.lamp(x, y, z, side)`,
`D.building(cx, cz, w, d, h, color, y)` (a plain far-off block, nothing to hit), `D.water(...)`,
`D.stain(x, y, z, r, a)`, `D.tag(x, y, z, w, h, rotY)` (graffiti on a wall), `D.prop(...)`,
`D.add(geometry, color, [x, y, z], [rx, ry, rz], [sx, sy, sz])` (any shape: sculptures, pipes,
domes; **make each geometry once** outside loops and reuse it), `D.shelter`, `D.bump`, `D.plate`,
`D.manhole(x, z)`, `D.overpass(x0, x1, z0, z1, y)`,
`D.sign(text, x, y, z, w, h, rotY, fg, bg, font)` (a name board: each one is its own mesh and texture,
so **at most 8 per district**).

## 6. Data shapes

Look at `buildDowntown` in `levels/dt.js` (lines ~389–435) for working examples of all of these.

* **Challenge** `{ id, name, desc, at: [x, y, z], go: [x, y, z, yaw], kind, ... }` with `id` starting
  `<id>-`. `at` is where the beam stands, `go` where "try it" puts you. Kinds:
  `gap` (`from`, `to`: boxes `[x0, z0, x1, z1, yMin, yMax]`: take off in one, land in the other),
  `trick` (the same plus `trick: 'Kickflip'` (a regex over the trick names) or `tricks: [...]`),
  `grind` (`area` box, optional `rail` kind, `grind` regex like `'Crooked|Overcrook'`),
  `speed` (`speed` in m/s, `area`), `score` (`pts`, `area`: a line started in the area),
  `line` (`pts`, `area`, `need: [['grind', 2], ['Manual', 1]]`). `hard: true` makes it a red one.
  Aim for 6–10 a district: a few easy gold ones and two or three hard red ones.
* **Tapes**: 3–6 a district, tucked somewhere you have to find (a roof, under a bridge, a ledge).
* **Traffic** `{ path: [[x, z], ...] (a closed loop), lane, dir: ±1, n, speed, r }` (r: corner
  radius). The cars follow the ground. **Peds** `{ path, n }`. **Skaters (npc)**
  `{ kind: 'loop', path, speed }` or `{ kind: 'session', rail: [ax, az, bx, bz], start, end, back, side, speed }`.
* **Landmark** `{ at: [x, y, z], near: 140, parts: [{ shape: 'box'|'cyl'|'cone'|'sphere', at: [dx, dy, dz], size: [sx, sy, sz], color, rotY }] }`:
  a plain, low-detail silhouette drawn past the fog and hidden within `near` metres, where your
  real model takes over. For the big sights you can see from far off (the radio tower, the Nautilus,
  the cranes, the water tank). One or two per district, a handful of parts each.
* **Skate shops: every district has at least one, preferably two** (Financial already has Downtown's
  two, Library Lane Skates and Bank Street Boards). A shop is a ground-floor shopfront in a real
  building on a street you ride past, its door facing the street, with room in front to stop.
  `P.shop({ name, sign: [x, y, z, rotY, width], awning: [x0, z0, x1, z1, y, 'x' if it runs along z],
  zone: [x0, z0, x1, z1], door: [x, y, z] })`: copy the shape from `dt.js` line ~190 (the sign board
  sits about 3.85 m over the door, the awning at 2.2 m, the zone is the 3 × 8 m patch of sidewalk in
  front of the door where stopping takes you in). Made-up names that fit the district. Shops don't
  count against the `D.sign` limit. Register a 'spot' fast-travel point at each one.

## 7. How it should ride (from the brief, and from how the game plays)

* The skater: pushes to 8.5 m/s, an ollie clears about 0.9 m, gravity is 14. Rolling down a 6 %
  street settles at about 16 m/s (58 km/h); the 13 % slopes of the Heights at about 21 m/s.
  Anything **up to 0.2 m above the rider is rolled up on to** (sidewalks, low pads, boxes and
  sloped ledges alike), so keep sidewalk curbs at 0.15 m and you never get stuck on one. From
  0.2 m up you have to ollie: a 0.3 m step catches you. Ledges to ollie on to: 0.4–0.6 m. Handrails: 0.8–1 m over
  the nosing.
* **Keep it rolling downhill.** Streets that run downhill at 3–6 %; flat only where you mean it
  (plazas, landings, the harbour). Cross streets flatten out briefly ("benched" intersections).
* **Chamfered curbs and slight lips** everywhere you would pop on or off, so nothing snags on a
  phone.
* **Sightlines**: from the top of each big hill or drop, you should be able to see a landmark that
  tells you where it goes (the Nautilus, the harbour cranes, the radio tower behind you).
* **Spots are part of the city**, not dropped on it: the 12-set is the City Hall's front steps, the
  ledges are the plaza's planters, the gap is between two loading docks. Look at how Downtown does it.
* Leave **run-up and roll-away** room at every spot (at least 10 m in front, 15 m after a big drop).
* **Grinds chain.** At the end of a rail, the grind carries straight on along the next one if it starts
  within 0.25 m and points within 35° (kinked rails, ledges and curbs built in pieces, `K.strip`). Build
  long ledges and curbs as pieces that meet end to end and they grind as one.
* **No dead stretches (the rhythm rule).** On every street, path and line (`P.line`), something
  skateable comes up within 10 m of the line at least every **30 m on push lines** (~4 s at push speed)
  and every **80 m on bomb lines** (~4 s at 20 m/s); on main lines a named spot or a pull-off pocket
  (`P.spot`) at least every **150 m**. Skateable: a rail, a ledge, a bank, a kicker, a gap, a manual pad,
  a box to ollie onto or grind. The plain sidewalk and its curb don't count (every street has them),
  nor do lamps, trees or buildings. `check.mjs --rhythm` reports every gap with its coordinates. You may
  keep a few deliberate breathers (a pure-speed stretch, a quiet lawn), but name each one in your doc.
  The filler menu:
  * **Bombs:** carve banks at the bends, driveway kicks up onto sidewalk ledges, gaps over the crossings
    (`K.crossingGap`), guardrail and median grinds, a pull-off pocket every ~150 m (a bus stop with a
    bench and a bank, a gas station forecourt, a lookout). Keep the road line itself clear at speed:
    obstacles at the edges, not in the lane.
  * **Residential:** driveways, retaining walls (`K.retainWall`), stoops, hydrants, parked cars, low
    garden walls, every house or two.
  * **Commercial / city:** planters, benches, bus stops, newsboxes, bike racks, medians, roadworks
    (`K.construction`).
  * **Industrial / harbour:** loading docks, pallets, containers, jerseys, pipe rails, bollards.
  * **Gate seams:** something small on your side of each gate (the 16 m corridor plus the 12 m blend
    is where gaps happen).
  * **Life:** traffic on the through streets, peds on the sidewalks, NPC skaters on your named lines,
    tapes in the quiet stretches, and line challenges that use the whole length ("bomb it without
    bailing", "the whole guardrail", "5 driveways in one line").
* Lines: every spot should lead into another. A good district has 3–4 lines you can chain for
  30–60 seconds without pushing much.
* **Made-up names only.** No real places, brands, skaters, games or trademarks.

## 8. Budgets (the phone has to run the whole map)

Per district, measured with `--only <id>`:

| | budget |
|---|---|
| boxes | 900 (Financial: 1,100 with Downtown; Downtown's own 589 boxes, 717 grind lines and ~950k triangles are counted apart, so Financial's new work gets the same budget as any other district on top) |
| grind lines | 700 |
| buildings (`K.building`) | 70 |
| triangles added (the check's scene triangles minus about 160k for the empty map) | 450k |
| `D.sign` boards | 8 |
| fine ground (`P.region` at res ≤ 2) | 60,000 m² in total |
| load time added | 1.5 s |

Big cheap wins: far buildings as `D.building` boxes, not `K.building`; reuse geometries in `D.add`;
fewer, longer boxes rather than many short ones; trees and lamps in moderation (each is a solid post).

## 9. Building and testing (run these from `prototype/feel-toy`)

```
SP=<your scratch dir>                                       # never write test output into the repo
node tools/build.mjs --check                                # does everything parse? any name clashes?
node tools/build.mjs --only <id> --out $SP/<id>.html        # a test page with just your district
node tools/check.mjs --html $SP/<id>.html --only <id>       # counts, the contract, the sink scan
node tools/check.mjs --html $SP/<id>.html --only <id> --shots $SP/shots-<id>   # + aerial and 4 views (look at them!)
node tools/check.mjs --html $SP/<id>.html --only <id> --views '[["plaza",[x,y,z],[lx,ly,lz]]]' --shots $SP/s
node tools/check.mjs --html $SP/<id>.html --only <id> --rhythm   # the gaps along every P.line
node tools/check.mjs --html $SP/<id>.html --only <id> --rides '[["hill", [x,y,z], [vx,0,vz], 6, "push"]]'
```

`--out` builds leave out any district file that doesn't parse (with a warning), so a broken file
of someone else's won't stop you. **Never** run `node tools/build.mjs` without `--out` (that
rewrites `index.html`; only the integrator does that). The test page also takes `?gray` (paints the
borders blue and the gates orange).

The check must say: errors none; inside the rectangle ok; border band ok; every gate on your borders
ok; the sink scan with nothing worse than about 10 cm; the rhythm with every line ok or its breathers
named in your doc. Then look at your screenshots and ride your
lines with `--rides` (a ride reports where it ended, its speed, and whether it bailed or got stuck).

**The base ground mesh** is drawn in 256 m tiles on the 8 m grid (x from -1000, z from -656), so tile
edges fall on 8 m grid lines. Pools (`K.pool`) are coloured from their own rim height `y0`.

**Gate handshakes** (both sides must meet these exactly):
* fin ↔ old, Grand Boulevard (z -120): the sidewalks run continuously; fin's sidewalk ends at its border
  and old's starts there at the same top height, with no step.
* fin ↔ uni, the avenue (x 360): the sidewalk tops match at the border; if they differ by more than 3 cm,
  the lower side chamfers up over 2 m.
* old ↔ east, crosstown (x 300): the road crown at -20.31 on both sides; camber at most 2 % each side.
* bw ↔ ship (x 0): Harbour Road at -40.93 and the boardwalk at -41.80 on both sides; the quay wall sits
  at z 1176..1180 on both sides.
* old ↔ bw, the steep street gate: old's sea-wall ledge at z 881 stops 4 m short of the gate corridor.

## 10. District briefs

What each district must contain, and what it inherits. The old code is there to copy from: move it to
your coordinates and heights, don't call it (except Financial, which calls `buildDowntown`).

* **heights: The Heights.** The ridge road along the top (y 44), the **Radio Tower** (a tall lattice
  mast, the map's top landmark), lookouts, modern luxury homes on terraces. The slope down to
  z -230 is the hill-bomb zone: the **Switchback Overlook** (a triple-curved road down to the
  switchback gate, continuous yellow painted curbs and kinked guardrails for very long grinds), a
  straighter road down to the observatory gate (an observatory dome on a lookout part way down,
  with steps), the **Drainage Culvert** (a steep concrete runoff straight down the hill to the
  culvert gate, cutting across the road curves, with a gap over a lower access road), and the Ridge
  Road east down to the ridge gate. Hidden park: **The Water Tank**, a drained round reservoir with
  a curved brick wall for wallrides and curved ledges. Inherits: Port City's Residential Hills
  (`mega4.js` top: steep streets, crests, stoops, public stairways) for the homes.
* **fin: Financial Core.** Downtown stays where it is (x, z -120..120), called through
  `buildDowntown(K)` as now; keep its skate shop (the map's spawn). Around it, in glass and polished
  granite: the **City Hall** with its **12-set** (wide descending hubbas either side, a centre
  handrail with a kink at the bottom), **Metro Plaza** with the **Golden Nautilus** (a giant spiralling
  polished-metal seashell sculpture; a wide fountain spillway is the run-up into the mouth; clear the
  shell gap into a smooth marble bank, or 50-50 the spiral rim all the way round), and
  **Bank to Planter Alley** (angled brick planters to ollie up, grind and drop off, into banked
  wall transitions) running west to the planters gate. Roads from the switchback and observatory
  gates in the north, the avenue gate east, the boulevard gate south (the **Grand Boulevard**, wide,
  heading down into Old Town). Inherits: `dt.js` (Downtown), Port City's Stadium (`mega3.js`) if it
  fits.
* **uni: University.** A raised campus: big stair sets, banks, a quad, a library with long ledges,
  lecture halls, a sports field. University Avenue in from the avenue gate, the Ridge Road coming down
  in the north, Campus Drive out south to the campus gate. Inherits: Port City's University
  (`mega3.js` lines 38+).
* **arroyo: The Arroyo.** A brutalist concrete storm channel the whole length of the district,
  starting at the culvert gate and ending at the spillway gate: floor 8–15 m below the banks,
  **falling steadily the whole way** (y 1 at the culvert to -40 at the spillway, about 3.6 %: the base
  height there is flat from z -218 to 230, so the ditch has to make its own fall), steep
  angled walls to carve, sewer grates to pop off, maintenance catwalks with rails. The **Pipe Crossing
  Gap**: two big utility pipes cross the channel overhead; a storm-door kicker launches you over the
  water channel on to or over them. A highway bridge crosses it; under it, the hidden park **The DIY
  Underpass** (cinderblock ledges, slappy curbs, plywood ramps, metal barriers). Banks to the planter
  alley gate (fin) and the footbridge gate (old Town, at the bank top). Industrial train yards and
  sheds on the west bank. Register the water in its trickle channel with `P.water`. Inherits: Port
  City's Dam and spillway (`mega4.js`, the Dam section) and the Industrial park (`mega4.js`).
* **old: Old Town.** Tight alleys, chamfered curbs, gap hops between loading steps, steep stair
  streets down the 6 % slope, little squares with fountains, a market, an old church on a terrace,
  cafe ledges. The Grand Boulevard comes in at the top; the **Old Town Steep** drops to Boardwalk
  West at the bottom; Crosstown Street east to Eastside; the footbridge west over the arroyo.
  Inherits: Port City's Suburbs (`mega4.js`) for the houses and backyard pools, if they fit.
* **east: Eastside Hills.** Residential hills: houses on terraces, drained backyard pools, a school,
  a strip mall, and **Hillside Park**, a municipal skatepark (a street course: stairs, rails, banks,
  manual pads, a small bowl). The **Eastside Hill Bomb**: a long straight street down to the
  hillbomb gate, the fastest run on the map. Campus Drive in at the top, Crosstown Street west.
  Inherits: Port City's Residential Hills and Suburbs (`mega4.js`).
* **bw: Boardwalk West.** At the bottom: the spillway outlet from the arroyo, the **Harbour Bowl
  Complex** (the map's main public skatepark: bowls, a snake run, a street plaza), the
  **Boardwalk Slappy Strip** (long low wooden curbs and mooring bollards), piers out over the sea,
  and the hidden park **The Drydock** (an old boat-repair dock of rough concrete: stepped platforms,
  big transitions round the walls, mooring chains to hop or grind). The Old Town Steep comes in from
  the north. The Harbour Road and the boardwalk east to Shipyard East. Inherits: Port City's
  Waterfront (`mega4.js`) and the monuments (`mega45.js`).
* **ship: Shipyard East.** Ocean-level docks: container stacks to gap between, gantry cranes (a
  landmark you can see from the hills), **Loading Bay Ledges** (truck docks at different heights:
  drop lines, manual pads, gap-to-grinds), warehouses, a fish market, the unfinished freeway ramp that
  ends in mid-air. The hill bomb comes in from the north. Inherits: Port City's Port (`mega4.js`) and
  the "more of the city" pieces in `mega45.js` (the port authority, the fish market).

# Skate Feel Toy

A throwaway prototype for one question: **does the skating feel good?**

A whole hillside city to skate, a camera that follows behind you, and every
movement number on a live slider. No netcode and no art. Everything here is written from
scratch: no code, data or assets from MW2, Skate 3 or Minecraft. The only
dependency is Three.js, loaded from a CDN.

## Run it

Any static file server works:

```sh
cd prototype/feel-toy
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly usually works too. Plug in a controller before
or after loading; the page uses whichever device you touched last.

## Controls

Two sticks, laid out like Skate: the **left stick skates**, the **right stick
does tricks** with Skate's flick-it motions.

| Action | Controller | Keyboard |
| --- | --- | --- |
| Carve / spin in air | Left stick ← → | A / D |
| Push / brake | A, or left stick ↑ / ↓ | W / S |
| Ollie and flip tricks | Right stick flick-it (below) | Space (hold, release), then Q + WASD in the air |
| Set the board up for a grind | Hold the right stick in the air | Arrow keys |
| Grind (auto near rails, or hold if auto is off) | LB | Shift |
| Pick the grind (hold while landing on a rail) | Right stick direction | Arrow keys |
| Manual / nose manual | Right stick halfway ↓ / ↑ | Hold M / N |
| Get off and walk / back on | Y | F |
| Set a spot / return to it | D-pad ↑ / Menu | P / R |
| Tuning sliders | View | Tab |
| Help | | H |

### On a phone

The touch layout turns on by itself on phones and tablets. Landscape works
best. Two fixed sticks sit in the bottom corners and never move. The steering
stick reads from wherever your left thumb lands, so a tap never starts a turn.
The trick stick also reads from where your right thumb lands (the knob is
drawn on the fixed stick), so a touch that lands off-centre is still a clean
ollie.

- **Left thumb steers**: move from where you touched. Pull down to powerslide
  to a stop, hold left or right in the air to spin.
- **Double tap the left thumb to revert**: a flat 180 on the ground. You keep
  rolling the same way, now fakie (or back to regular). Revert within 0.4 s of
  landing a trick (*Revert: time after landing to keep the combo*) and it adds
  to the combo instead of the combo paying out first. That short window is
  also why a landed combo now pays out a moment after you land.
- **Tap the right thumb to push**, one kick per tap (two quick taps queue
  two). Each kick's speed comes on over the drive of the stride, so the
  camera doesn't jolt. Taps only push while you're rolling on the ground.
- **Tap, then touch the right thumb again and hold** to keep pushing, one kick
  after another, until you let go. Moving that thumb away (to flick a trick)
  stops the pushing. The second touch has to come within *Double tap: second
  tap within* of the first.
- **Manuals:** tip the right stick about halfway down (manual) or halfway up
  (nose manual). All the way down is still the ollie crouch. A balance meter
  shows while you manual (see below).
- **Walk / Skate** gets off the board and back on. Walking goes wherever the
  left stick points (relative to the camera), runs at full tilt and climbs
  stairs; the board is carried under your arm. While walking, the **trick
  stick moves the camera**: left and right turn the view, and your walking
  direction turns with it. Up and down tilt it, to look up at a roof or down
  a drop.
- **Set spot / Return** buttons drop a marker where you are, facing the way
  you're going, and put you back there standing still to try the line again.
- **Right thumb is the flick-it stick**, with the same motions as a
  controller's right stick. A quick tap pushes instead of doing a trick.

### Flick-it tricks (right stick, regular stance)

These follow EA's *skate.* flickit chart for regular stance. Pull the stick
down to crouch, then flick. The flick picks the trick family, and any swing
round the rim before it picks the variation. The stick's path round its rim
is measured as an angle, so a move is judged by how far you swing, not by
hitting exact boxes:

| Trick | Motion |
| --- | --- |
| Ollie | Pull down, flick straight up |
| Kickflip / Heelflip | Pull down, flick up-left / up-right. A flick straight left / right counts too |
| FS / BS Pop Shuvit | Pull down, then arc round the bottom of the rim up onto the right / left |
| FS / BS 360 Pop Shuvit | Arc from the left / right, round the bottom, up onto the other side |
| Hardflip / Varial Heelflip | Swing in from the lower left to the bottom, flick up-left / up-right |
| Varial Kickflip / Inward Heelflip | Swing in from the lower right to the bottom, flick up-left / up-right |
| 360 Hardflip / Laserflip | Swing in from the left side (a bigger swing), flick up-left / up-right |
| 360 Flip / 360 Inward Heelflip | Swing in from the right side, flick up-left / up-right |
| Nollie anything | The same, upside down: push up first, flick down |
| Late flip | In the air, let the stick back to the middle (or lift your thumb), then any flip motion |

A shuvit has to be a clear arc round the rim. A sideways move that cuts
straight across from the bottom to a side is read as a flick, so it's a
kickflip (left) or heelflip (right). A flick within ±15° of straight up is an
ollie (*Ollie: how straight up the flick must be*). A swing of about 22° into
the bottom makes a hardflip, varial or inward heelflip, and about 55° makes the
360 version. These and the shuvit arc are all on sliders in the **Trick
stick** tuning section.

You can hold the crouch as long as you like and flick whenever you're ready.
Letting the stick back to the middle without flicking stands you back up.
Drifting sideways while you hold a crouch doesn't change the trick: only a
swing that ends at the bottom of the rim counts.
Slow stick movement never fires a trick. After a trick the stick has to come
back to the centre before the next one.

**Late flips need a return to neutral.** After the pop, moving the trick stick
straight on, even sweeping it through the middle, only moves the board: it
lines it up for a grind and never fires a trick. To do a late flip, let the
stick come back to the middle and rest there for a moment, or lift your thumb
and touch again, then do the motion. Each late flip needs its own return to
neutral (*Late flips: rest the stick in the middle this long first*).

There are no grabs. In the air, holding the trick stick in a direction lines
the board up for the grind it will land in (see below), so you can set up a
boardslide or a 5-0 before you reach the rail.

## Grinds

Like Skate, where you hold the trick stick as you land on a rail or ledge
lines the board up. Hold it in the air and the board is already set up in that
position before you reach the rail. You can see it turn, even in the middle
of a flip, so a kickflip into a lipslide is already sideways when it lands
on the rail. When you touch down, the rider swings round and settles onto the
rail over a fraction of a second instead of snapping. Once you're on, the
grind is locked until you pop off.

| Hold the trick stick | Grind |
| --- | --- |
| Centre (let go) | 50-50 |
| Down | 5-0 (back truck, nose up) |
| Up | Nosegrind (front truck, tail up) |
| Up-left | Crooked |
| Up-right | Overcrook |
| Down-right | Salad |
| Right, then roll up | Smith |
| Left, then roll up | Feeble |
| Left, then roll down | Willy |
| Right, then roll down | Over Willy |
| Left / Right | Boardslide / Lipslide |
| Up, then roll left | Noseslide |
| Up, then roll right | Nose Blunt |
| Down, then roll left (or straight down-left) | Tailslide |
| Down, then roll right | Bluntslide |

"Then roll" means hold the first direction and slide round to the next one.
Coming in from a diagonal onto a side counts too: up-left then left is a
Noseslide. Where your thumb ends the pop flick (usually straight up) doesn't
count as the first direction, so after an ollie you can slide straight to
up-left for a Crooked.

Nose Blunt is on up-then-right. The list it came from gives "up and left"
for both Noseslide and Nose Blunt, and up-then-right mirrors Tailslide /
Bluntslide.

**The angle you come in at matters.** What counts is the board's real angle
to the rail as it lands: how you approached, plus any set-up from the stick.
- **Lined up** (under 12°): the stick picks the grind, as in the table.
- **Angled** (12–55°): a truck grind keeps that angle instead of snapping
  straight. Holding up, or letting go, gives a Crooked or an Overcrook
  depending on which way the board points. Holding down gives a Feeble or a
  Smith. An angled grind you set up already flips to its mirror if the board
  points the other way.
- **Across the rail** (over 55°): you slide. Letting go gives a Boardslide or
  Lipslide, up a Noseslide or Nose Blunt, down a Tailslide or Bluntslide.

Both thresholds are sliders (*Board angled this much keeps its angle*, *Board
this far across the rail slides*).

**Riding fakie** turns the stick round for grinds and for lining up in the
air. The camera then looks at the board from its nose end, so up still means
the leading truck (the tail, when fakie) and right still turns the board to
the right on screen. Up into a rail fakie is a Fakie 5-0, right is a Fakie
Boardslide, and so on. The grind name says Fakie. Steering stays the same
either way.

**FS or BS** isn't a stick input: it comes from which side you meet the rail.
With the rail on your toe side it's frontside, with it on your heel side it's
backside, and the name says so (FS Smith, BS Boardslide...).

**Grind exit:** push the left stick hard left or right while grinding to hop
off that side. Pushing it as you land on the rail doesn't count. Let it back
towards the middle first.

Slides drag more than truck grinds and score a little more. Down then a flick
up pops you off, as on the ground.

Steering is the same riding regular or fakie: stick right always turns the
board the same way.

**How grinds look and sound**
- **Lock-in:** you sink in as you lock on. Metal rails clank and concrete
  ledges thump, and the camera takes a small knock.
- **Stance:** on the rail you ride low and loaded, with your weight over the
  truck that's grinding: the tail for a 5-0, the nose for a nosegrind. The
  leading arm is up and out, the trailing arm is low and back, and both sway
  for balance.
- **Slides:** in boardslides, lipslides, tailslides and noseslides the hips
  stay with the board, but the shoulders and head turn back down the rail.
- **Metal rails:** they throw sparks back the way you came, and the board
  chatters on them. Concrete ledges kick up dust.

## Manuals

Tip the trick stick about halfway down for a manual (back wheels, nose up) or
halfway up for a nose manual. They keep a combo alive: land a trick straight
into a manual and the combo doesn't pay out until you roll out of it, and you
can ollie or flip out of a manual into the next trick. Push all the way down
and it's the ollie crouch instead. *Manual: trick stick tip from* sets where
halfway starts.

**Flipping out of a manual:** while you hold a manual, the stick's halfway
position counts as the pull. Flick from there across the middle, or straight
out to a side, and you flip or ollie out of the manual into the next trick.
Pulling on down to the crouch first works too.

Riding fakie turns it round, the same as grinds. Halfway down still lifts the
leading end, which is now the nose, so you balance on the nose wheels for a
**Fakie Nose Manual**. Halfway up is a **Fakie Manual** on the tail wheels.

Manuals are meant to be holdable. A manual starts once the stick has stayed
put in the halfway band for about a fifth of a second (*Manual: hold the stick
steady this long first*). Normal thumb shake is fine. Pulling down to crouch
for an ollie, or letting the crouch back out, never starts one, and there's a
gap between the top of the band and the crouch.

Once you're on a manual it's forgiving. It keeps going anywhere short of the
crouch, even well off straight down, so a slipping thumb doesn't end it. A
balance meter shows above the rider. With your thumb anywhere in the middle
of the band the rider rights itself (*Manual: self-righting with a steady
thumb*), and the manual lasts until you run out of speed. Resting at the deep
or shallow edge leans you back or forward. Stay there for two to four seconds
and you drop to the tail or nose. With the keyboard (M / N) the balance looks after itself.

## Walking

Walk / Skate (touch), Y (controller) or F (keyboard) steps off the board.
While walking, the trick stick (or the right stick, or the arrow keys) looks
around: left and right turn the camera, up and down tilt it. The walk
direction turns with the view. The left stick only moves you: walking
sideways or back towards the camera doesn't swing it round. The camera stays
where you point it until you get back on the board (*Walking: trick stick
turns the camera*).
Walking follows the left stick relative to the camera (the direction is
locked while you hold the stick, so the camera swinging round doesn't curve
your path), runs when the stick is all the way over, steps up stairs and stops at taller walls.

**Jumping:** tap the trick stick while walking, or press Space (keyboard)
or A (controller). You jump about 0.75 m, which is enough to hop up on to
ledges, planters and walls up to about waist height. Your knees tuck up in
the air. The jump speed is on a slider.

**Sprinting:** keep the movement stick pushed all the way for a second, or
hold Shift (keyboard) or L3 (controller). The sprint lasts until you ease
off the stick. You walk at about 3 m/s, run at 5 m/s with the stick all the way over,
and sprint at 7.5 m/s. All three speeds are on sliders.

On foot you hear footsteps instead of the board rolling. They come about
twice a second walking and quicker as you speed up. Step back on and
you roll off in the direction you were walking.

## Braking

Pulling the stick back powerslides: the board swings sideways (*Powerslide board
angle*), the rider leans back on the heels and the speed scrubs off
(*Powerslide stopping power*). From full speed a powerslide takes about a
second and a half and seven metres.

## Bails and solid things

Walls, buildings, benches and ledges are solid, and so are freestanding rails
and their posts: you can't ride through a rail, only ollie onto it. Hit a wall
faster than *Bail when hitting a wall* and you slam. Curbs, ledges and the
manual pad don't roll you up: catch one faster than *Bail when catching a
curb* and you bail, so ollie onto them. Below that speed you just stop against
them.

## Scoring

- An **Ollie** scores only when you pop. Rolling off an edge isn't a trick.
- Flip tricks, spins (per half turn), grinds and manuals all score, and the
  combo is multiplied by its number of tricks.
- Tricks started riding fakie are named **Fakie** and are worth a bit more.
- Dropping 0.6 m or more during a combo adds a **Drop** bonus for the height.
- Hold left or right any time in the air to spin, including straight from
  a carve. Spins wind up over a fraction of a second rather than snapping.

## Camera

The camera sits low and behind you and swings round to follow your direction
of travel, so riding fakie or coming back down a ramp turns it around. In the
air it mostly holds still so spins don't spin the view. Distance, height, how
far it looks down, field of view and how quickly it swings behind you (on the
ground and in the air) are in the **Camera** tuning section. If a wall or the
plaza lip gets between the camera and you, it pulls in so you can always see
the board.

Safety yellow paint marks the plaza lip and the nosing of each step so the
edges read from a distance, and the sides of ledges and boxes are darker than
their tops.

**Filmer camera:** press **C**, or **Cam** on a phone, for a low, close, wide
camera just behind the board, like a filmer with a fisheye. Landings kick
either camera with a short shake (*Landing shake*).

## Challenges, spot bests and tapes

- **Challenges:** a gold beam marks each challenge. Ride near one and its
  goal shows at the top of the screen, and the beam fades so it doesn't get in
  the way. Beams never show in replays. Some examples:
  - Kickflip the Big Four.
  - Gap from the garage to the roof.
  - Grind the courthouse handrail.
  - Hit 40 km/h down the hill.
  - Land a 3,500-point line that starts in Central Plaza.
  - Land a 6,000-point line that starts anywhere downtown (any block, plaza or
    street). Its beam is on the Central Plaza deck.

  Land it and the beam turns green. Porto Alto has 109, spread over every
  district.
- **Hard challenges:** every spot also has a hard one, marked by a red beam
  and ★★. They are particular about it:
  - **In the Financial Core:**
    - kickflip the garage gap;
    - 360 flip the plaza gap;
    - crooked (or overcrook) a courthouse handrail;
    - feeble the library hubba;
    - a bank plaza line with two grinds and a manual worth 3,000;
    - heelflip the office ten;
    - bluntslide the DIY coping;
    - varial kickflip a Hill Park flight;
    - flip the construction trench;
    - a 15,000-point line that starts anywhere downtown.
  - and every other district has its own.

  A Fakie or Nollie version of the named trick counts.
- **Spot bests:** every combo that starts inside a spot counts toward that
  spot's best. Beating it puts it up on screen.
- **Tapes:** cassettes are hidden in hard-to-reach places, such as roofs, the
  bottoms of the bowls, the quarterpipe deck and the half-built deck's beam.
- **The challenge list:** it's in the tuning panel, with a **Go** button for
  each challenge.
- **Progress:** it's saved per level in this browser. **Reset progress**
  clears it.

## The skate shop

Porto Alto has 17 skate shops, two or three per district (they're listed
under **Porto Alto** below). The Financial Core's three are:
- **Corner Skate Shop:** the corner store by the construction site, with a
  three-stair out front. This is where you start.
- **Library Lane Skates:** up on the library deck, at its west end.
- **Bank Street Boards:** in the bank building, opening on to the south end
  of the Bank Plaza deck.

You start (and come back after a reset) facing a skate shop, a few
metres out from its door. Look for the lit SKATE SHOP sign and the striped awning. Stop on the glowing
mat at the door, then tap **Enter skate shop** (or press **E**). A sheet opens
over a slow turntable view of your skater, where you can change:
- shirt, pants, shoes and soles;
- the cap (forward, backwards or none) and its colour;
- skin and hair;
- the grip tape on top. It's black by default; the others are grey, white,
  red, blue, camo, checker, flames, galaxy, cut-out (two bands cut away to
  show the maple) and tiger. Every grip has a sandpaper grain;
- the graphic underneath (stripe, solid, split, checker, dots, bolt, fade,
  flames, stars, waves, sunset, triangles or a wordmark) and its two colours.
  Grip and graphic buttons show a small picture of the deck, so you can see
  what you're picking. You see the graphic whenever the board flips;
- wheels and wheel cores.

**Random** deals a random look and **Reset** goes back to the default. Your
look is kept in this browser.

## The skater

Each skater has:
- **A face:** eyes with whites, irises and lids, brows, a nose, lips and ears.
- **Arms:** tapered, with elbows and hands with fingers and a thumb.
- **Legs and shoes:** socks at the ankles and pant cuffs over shoes, with a
  sole, collar, tongue and laces.
- **A board:** a moulded deck with concave and kicked tips, and trucks with
  baseplates, bushings and wheels.

Other skaters and people on foot use a simpler copy of the model, merged into
a few meshes so a crowd stays smooth on a phone.

## Replay

**X**, **Replay** on a phone, or **Replay last 10 s** in the panel plays back
the last ten seconds, letterboxed, on a loop. **Angle** cycles through three
views:
- a filmer off to the side, panning;
- the camera you played with;
- a low fisheye.

**Slow-mo** plays it at 40%. **Done** goes back to skating.

## Sound

Everything is synthesized, so there are no samples.
- **Wheels:** they sound different on smooth concrete, rough asphalt or dirt,
  hollow wood and metal. On sidewalks and plazas they tick over the cracks
  between slabs.
- **Tricks:** the pop is a wooden snap and landings rattle the trucks.
- **Grinds:** metal rails ring and hiss, and concrete ledges scrape.
- **Background:** the city hums in the distance, with cars passing a block
  away and birds. The beach has waves and gulls instead.

## Porto Alto

The game is one connected city, **Porto Alto**, about 2 km on a side. It
drops from a hilltop ridge 96 m up down to a harbour at sea level, so most
ways across it are downhill. Eight districts join at 15 gates (a road, stair
or path that crosses the border), and there's more than one way down from
each tier.

```
north   ┌──────────────────── The Heights (ridge, y 60–96) ───────────────────┐
        │ The         ├── Financial Core (y 44–52) ──┬── University (y 44–56) ──┤
        │ Arroyo      ├── Old Town (44 → 8) ─────────┴── Eastside Hills ────────┤
        │ (the ditch) │                                  (44 → 8)               │
        ├──── Boardwalk West (y 2–6) ──────────┬──── Shipyard East (y 2–6) ─────┤
south   └──────────────────────────── the sea ─────────────────────────────────┘
        west                                                               east
```

### Getting around

- **Map:** the **Map** button on the touch bar (or in the tuning panel) opens
  a top-down map. Drag to pan, and pinch or use the mouse wheel to zoom. It
  shows the districts, the lines (hill bombs in red, main lines bolder), the
  parks (green), the spots (yellow), the shops (orange squares) and you, as
  an arrow. Tap something, then **Go** to travel there. Escape closes it.
- **Travel list:** the **Getting around** section of the tuning panel lists
  the 8 districts, then the 5 parks, then the 17 shops, each with a button.
- **Spawn:** you start, and come back after a reset, outside the Corner Skate
  Shop in the Financial Core.

### The districts

- **The Heights** (the ridge along the north edge): switchbacks, homes on
  the crest and the radio tower. Five bombs start up here: the Yellow Line,
  Reservoir Run, Stargazer, Three Crests and the Ridge Traverse.
  - Spots: Culvert Head, Ridgeline Lookout, Switchback Top, Observatory
    Terrace, Ridge Road Descent.
  - Park: **The Water Tank**, a hidden park in a drained reservoir.
- **The Arroyo** (the west side, top to bottom): a concrete drainage ditch
  8–15 m below its banks, with a freight yard and a foundry beside it. The
  Full Run bombs the whole ditch from the culvert to the sea.
  - Spots: Pipe Crossing, Seco Yard, Freight Platform, Seco Foundry, Water
    Board Plaza, Planter Run, Gas Ring, Footbridge Walk.
  - Park: **DIY Underpass**, under the highway bridge.
- **Financial Core** (the middle tier): the old Downtown, reworked. Its
  blocks, lines and hazards are described in detail below.
  - Spots: City Hall (the 12-set), the Golden Nautilus plaza, Planter Alley,
    Alto Arena, Central Plaza.
- **University** (east of the Financial Core): a campus on a terrace with big
  sets and balustrades.
  - Spots: Great Steps, Ridge Climb, The Balustrades.
  - Park: **Bike Shed DIY**.
- **Old Town** (below the Financial Core): alleys, curbs, gap hops and steep
  stair streets, down to the sea gate.
  - Spots: Santa Brisa, Tile Works, Mercado Velho, Pool Row, Porta do Mar.
- **Eastside Hills** (below University): hillside streets with backyard
  pools, and the Hill Bomb straight down to the shipyard.
  - Spots: Hill Bomb, Crosstown Bridge, Bayview Center, Moonrise Drive-In.
  - Park: **Hillside Park**, a municipal street course.
- **Boardwalk West** (the west harbour): piers, the ferry terminal, the Sea
  Wheel and a slappy-curb strip.
  - Spots: Ferry Pier, Sea Wheel, Spillway Outlet, Eel Run, Long Pier,
    Ferry Terminal.
  - Parks: **Harbour Bowl Complex** (the main public park, with bowls and a
    street course) and **The Drydock** (a hidden park in an old boat-repair
    dock, below sea level).
- **Shipyard East** (the east harbour): containers, cranes, loading docks and
  The Corvina, a beached ship.
  - Spots: Loading Bay Row, Skyway Stub, The Corvina.

The radio tower, the Golden Nautilus and the cranes are landmarks: they show
from anywhere, through the fog, so you can always tell which way is downhill.
The sea and the Arroyo's canal are water. Fall in and you bail and come back
on the last safe ground.

### Lines and gates

Every district has named lines (178 in all, 47 of them main lines). A line
has something skateable within 10 m at least every 30 m on push streets and
every 80 m on bombs, so there are no dead stretches.

The gates are:
- **Down from the Heights:** Switchback Road and Observatory Steps (to the
  Financial Core), the Drainage Culvert (to the Arroyo) and Ridge Road (to
  University).
- **Across the middle:** University Avenue (Financial Core to University) and
  Planter Alley (Financial Core to the Arroyo).
- **Down to the lower slopes:** the Grand Boulevard (Financial Core to Old
  Town) and Campus Drive (University to Eastside).
- **Across the lower slopes:** Crosstown Street (Old Town to Eastside) and the
  Arroyo Footbridge (Old Town to the Arroyo).
- **Down to the harbour:** the Spillway Outlet (Arroyo to Boardwalk West), the
  Old Town Steep (Old Town to Boardwalk West) and the Eastside Hill Bomb
  (Eastside to Shipyard East).
- **Along the harbour:** Harbour Road and The Boardwalk (Boardwalk West to
  Shipyard East).

The three long rides from the top to the sea:
- **West:** Ridgeline Lookout, the Yellow Line, the Switchback, through the
  Financial Core, down the Grand Boulevard, through Old Town, down the Steep
  and along the Boardwalk. About 2.8 km and four and a half minutes.
- **The ditch:** the Culvert, the whole Arroyo and out of the Spillway
  Outlet onto the Boardwalk. About 1.8 km.
- **East:** Ridge Road, through University, down Campus Drive, the Eastside
  Hill Bomb and into the Shipyard. About 1.5 km.

All three ride without a bail, topping out around 75 km/h.

### Challenges, tapes and shops

Porto Alto has 109 challenges (34 of them hard) and 58 tapes. The 17 shops
are:
- **The Heights:** Thin Air Skate Supply, Low Gear Boards.
- **The Arroyo:** Railyard Boardworks, Dry Creek Skate Supply.
- **Financial Core:** Corner Skate Shop, Library Lane Skates, Bank Street
  Boards.
- **University:** Mortarboard Skates, Bluebook Boards.
- **Old Town:** Tile & Truck, Steep Street Skates.
- **Eastside Hills:** Crest Corner Skates, Gravity Skate Supply.
- **Boardwalk West:** Chandlery Skate Supply, Saltwater Skates.
- **Shipyard East:** Slipway Skates, Deckhand Skate Supply.

### Traffic and people

- **Cars** drive the district streets, keeping right. They slow for corners
  and stop behind whatever is in front of them, including you if they see
  you in time, and they honk if you stand in the road. Step out right in
  front of a moving car and it hits you. Skate into a stopped car hard and
  you slam; slowly and you just stop against it.
- **People on foot** (138 of them) walk the sidewalks. They keep right, step
  round benches, dumpsters and you, and wait at the kerb for a car that's
  coming. Skate into someone faster than about 3 m/s and you both go down. On
  foot you just bump.
- **Other skaters** (20) ride the named lines and session spots, each with a
  random look. They ollie the cones and potholes in their way and throw
  flips, shuvits, manuals and grinds. Run into one faster than about 2.5 m/s
  (counting both of your speeds) and you both slam. They follow set lines
  rather than the full physics.
- To keep a phone running, people more than about 38 m away are drawn as
  simple stand-ins in their own colours, and anyone far enough away isn't
  simulated at all.

### The Financial Core in detail (the old Downtown)

The heart of the Financial Core is a dense 240 m square of city with no dead
space. It has nine blocks on two avenues and two streets, and every block is
a spot. The spots are laid out as lines that cross the street from one block
into the next, with curb ramps where each line meets a curb. You start
outside its Corner Skate Shop.

**The lines**
- **North to south:** push up the garage ramp and ollie the gap to the first
  roof, then roll the second gap. Roll in down the big bank off the last roof
  and cross the street. Bank up onto the Central Plaza deck and go off the Big
  Four gap. Carry on into the fountain bowl and across into the courthouse
  plaza.
- **East to west:** drop in on the DIY quarterpipe under the overpass and hit
  the kickers and pad heading west. Cross the avenue and bank up onto the
  plaza deck, then go down its west stairs. Cross again and bank up onto the
  bank plaza's ledge deck.
- **From the hill:** bomb the north face of the Hill Park knoll, cross the
  street and bank up onto the bank plaza. Or take the railed stairway down
  the east face, cross, and bank up onto the courthouse podium.

**The blocks**
- **Rooftops:** a parking garage with ply on the deck, two roof gaps, a
  roll-in bank, and a plaza of ledges at the bottom.
- **Central Plaza:** a granite deck with banks up onto it and stairs down the
  west side. The Big Four is a five-stair with a centre rail and two hubbas.
  The whole south edge is a gap, and the lower plaza has ledges round a
  drained fountain bowl.
- **Courthouse:** an eight-stair with two handrails and two hubbas. There's a
  bank off the end, a flat bar in the run-out, and a bump to bar.
- **Library:** a six-stair with three rails, a hubba and a bank. Below it is a
  sunken court with straight walls to drop off, stairs in and a bank out.
- **Bank Plaza:** a marble deck with long ledges. It has banks and steps on
  its sides and a fountain bowl in front.
- **Office:** a double set with rails, a ten-stair hubba, a bank to wall and a
  line of ledges.
- **DIY:** under the overpass there is:
  - a quarterpipe with coping;
  - ply kickers on pallets;
  - a pyramid, a hip and a bank to wall;
  - a pipe on blocks;
  - jersey barriers;
  - a car park with parking blocks.
- **Hill Park:** a grass knoll to bomb, an overlook, a railed stairway,
  picnic tables and a court.
- **Construction:** a corner store with a three-stair. Behind it is a fenced
  site with:
  - a half-built deck to push up a ply ramp and drop off;
  - a trench to gap;
  - pallets, a dirt pile, a scaffold plank, a slab and a dumpster.

**The streets**
- The blocks sit at sidewalk height, so curbs only face the road.
- Every sidewalk has things to skate: benches, planters, newspaper boxes,
  trash cans, bike racks, bus stops with a bench ledge, hydrants, parking
  meters and dumpsters.
- Driveways now and then make kickers off the curb.
- The buildings have stoops with handrails, access ramps and planter ledges.
- Parked cars line one curb of each road. There are potholes and a coned-off
  lane.
- Each place has its own paving. The gutters and parking lanes are oily, the
  ledge edges are waxed, and there's graffiti on the walls.

**Hazards**
- **Cones:** hit one faster than about 2 m/s and you bail. Slower, it just
  bumps you.
- **Potholes:** roll into one faster than 3.5 m/s and you bail.
- **Clearing them:** ollie a cone for a "Cone Hop" and a pothole for a
  "Pothole Ollie". Each counts once per jump.
- Both speeds are on sliders.

### The test block

The old practice block still loads with `?level=block`. The automated tests
use it.

### Building and checking the city

The level code lives in `levels/`: `kit.js` (the shared building kit),
`dt.js` (the Financial Core's downtown blocks) and `porto/` (the base map in
`porto/base.js`, and one folder per district). `porto/CONTRACT.md` has the
rules each district follows: its rectangle, gates, budgets and the rhythm
rule. The game page carries a built copy, so after changing a level file:

```sh
node tools/build.mjs                                   # splice levels/ into index.html
node tools/check.mjs --html $PWD/index.html --rhythm   # load errors, budgets, gates, dead stretches
node tools/rides.mjs --html $PWD/index.html --routes tools/porto_routes.json   # ride every gate and long route
```

`check.mjs` and `rides.mjs` need Playwright and an absolute path to the page.

## Things to try

1. Push to full speed and carve S-turns. Does turning feel weighty or twitchy?
   Then drop into the Harbour Bowl Complex or the DIY quarterpipe in the
   Financial Core. (*Turn rate*, *Grip*, *Speed kept when carving*)
2. Kickflip the Big Four or heelflip the courthouse eight (Financial Core),
   then press X to watch it back.
3. Ollie onto a handrail or a hubba from the top of the stairs, holding a
   direction on the trick stick to pick the grind. Pop about two to four
   metres before the top of the rail.
4. Open the Map, travel to Ridgeline Lookout and ride the West route all the
   way to the Boardwalk without bailing.
5. Bomb the Eastside Hill Bomb into the Shipyard. Pull back to powerslide
   before the bottom.
6. Take the Full Run down the Arroyo and out of the Spillway Outlet.
7. Find the hidden parks: the Water Tank, the DIY Underpass and the Drydock.
8. Set a spot at the top of a line, then use Return to retry it.

## Sharing a setup

Open the tuning panel and press **Copy values**. It copies only the numbers you
changed, as JSON. Paste them back to Claude to make them the new defaults.

## How it works

- `terrainH(x, z)` is an analytic height function for the whole park. Physics
  and the rendered mesh both read it, so they always agree. Boxes and rails
  sit on top.
- Physics runs at a fixed 120 Hz. On the ground, gravity is projected onto the
  surface and speed is preserved through concave transitions, which is what
  makes ramps feel good. A sharp convex change (a lip or edge) launches you.
- Landing compares the board's heading with your velocity: inside
  *Clean landing* is clean, past *Bail beyond* is a bail, anything between is
  sketchy. You always roll away in whichever direction the board was closest
  to (regular or fakie).
- Tricks score into a combo that's multiplied by the number of tricks in it and
  paid out when you land cleanly. A bail loses it.
- The rider is a jointed figure in a regular stance (left foot forward, chest
  to the toe edge) built in the board's own space, so the feet stay planted on
  the deck through ramps. Legs and arms are solved with two-bone IK each frame:
  knees bend out over the toes, the hips drop as you crouch, the upper body
  leans into carves and stays partly upright on steep ramps, the knees tuck
  when the board rises in a flip, the board lines up for a grind in the air,
  and the head looks where you're going. Each push is a stride:
  the hips square up to the nose, the back foot reaches forward with the knee
  up, plants beside the front foot, drives back along the ground, then lifts
  and returns to the tail while the arms swing like walking. Poses blend smoothly and landings compress the knees.
- Sounds are synthesized with WebAudio; nothing is loaded.

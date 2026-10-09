# Skate Feel Toy

A throwaway prototype for one question: **does the skating feel good?**

A street block, a camera that follows behind you, and every movement number on
a live slider. No netcode and no art. Everything here is written from
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

## Manuals

Tip the trick stick about halfway down for a manual (back wheels, nose up) or
halfway up for a nose manual. They keep a combo alive: land a trick straight
into a manual and the combo doesn't pay out until you roll out of it, and you
can ollie or flip out of a manual into the next trick. Push all the way down
and it's the ollie crouch instead. *Manual: trick stick tip from* sets where
halfway starts.

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

**Sprinting:** tap the trick stick while walking, or hold Shift (keyboard) or
A or L3 (controller). The sprint lasts until you let go of the movement
stick. You walk at about 3 m/s, run at 5 m/s with the stick all the way over,
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

## Levels

Pick a level on the intro screen, or in the **Level** section of the tuning
panel. Switching reloads the page into that level and remembers it. A link
with `?level=park`, `?level=city` or `?level=mega` opens one directly.

### Beach Park

Laid out after **Venice Beach Skatepark** in Los Angeles: a concrete pad on
the sand beside the boardwalk. About a third of it is transition and the rest
is an L-shaped street plaza. The layout follows public descriptions of the
real park, which is about 16,000–17,000 sq ft. The exact shapes and sizes are
approximations, not survey data.

- **Clover bowl**: a deep end about 2.75 m (9 ft) deep with two 1.8 m (6 ft)
  pockets. Hips where the lobes meet, blue tile, and steel coping.
- **Flow bowl**: shallower, two lobes and a rounded extension.
- **Snake run**: starts in a 0.9 m (3 ft) square basin, winds and deepens, and
  ends in a 2.1 m (7 ft) kidney bowl.
- **Street plaza**:
  - a platform in the corner with a bank down one side, and a hubba and stairs
    with a rail down the other;
  - ledges, a manual pad, a flat rail and a funbox with banks;
  - a curved "clamshell" quarter pipe in the far corner.
- **Surroundings**: seat walls along the edges, palms, the boardwalk and the
  ocean. **The sand slows you right down.**

Rolling over the coping drops you into a bowl rather than grabbing it as a
grind. Coping grinds need a pop or some air first.

### Downtown

A hillside neighbourhood built to be found, not handed to you. North is up the
hill. You start at the top of Bomb Hill.

**Streets**
- Sidewalks are real 15 cm curbs. You can grind them, and riding into one fast
  bails you.
- Curb ramps are at every zebra crossing.
- Lane lines, lamps, trees and parked cars line the streets.

**Bomb Hill**
- The east avenue drops 6 m off the hilltop. The middle intersection is a
  crest that kicks you up if you're fast.
- On the way down there are roadworks: a coned-off lane, a steel road plate,
  and potholes in the lanes.

**The Channel**
- A concrete storm channel runs down the west edge, LA River style, with
  banks on both sides. Its floor slopes with the hill, so you can pick up
  real speed.
- There's a centre divider to grind and a sheet of plywood someone dragged
  in as a kicker.
- An overpass crosses it, with a DIY ledge on the bank under the bridge.
- Get in through the gaps in the chain-link fence.

**Hillside**
- **Row houses:** some have stoops, little stair sets with handrails.
- **The Hillside Steps:** seven public terraces down the hill, each with stairs,
  a rail, a hubba, painted lips, planters and benches.
- **The bank plaza:** level with the sidewalk at the top. As the hill drops
  away its edge turns into a ledge and then a 2.5 m drop, with big stairs and
  two rails at the bottom.

**Lowlands**
- **The schoolyard:** a big bank down into the yard, a rail at the school
  door, picnic tables and a bike rack.
- **The store car park:** sunk below the street. Get in down the driveway
  bank or off the retaining wall. Inside are parking blocks, a planter
  island, speed bumps, a wheelchair ramp with a handrail, and a drop off the
  south end onto the sidewalk.
- **The courthouse plaza:** grand stairs with two rails, a fountain, marble
  ledges, a statue plinth, and an access ramp with a long rail up the side.
- **The construction site:** fenced, with a gate and a gap in the fence.
  Inside are plywood on pallets and on a Jersey barrier as kickers, a dirt
  pile, a row of barriers, a pipe on blocks, a foundation slab, a scaffold
  plank, a dumpster and cones.

**Rooftops**
- At the top of the hill, push up the parking-garage ramp to the top deck.
- Ollie the 3 m gap to a roof, roll across the next gap, drop to the loading
  dock, and take its stairs and rail down.

**Hazards**
- **Cones:** hit one faster than about 2 m/s and you bail. Slower, it just
  bumps you.
- **Potholes:** roll into one faster than 3.5 m/s and you bail.
- **Clearing them:** ollie a cone for a "Cone Hop" and a pothole for a
  "Pothole Ollie". Each counts once per jump.
- Both speeds are on sliders.

### Port City

A whole city, about 880 m on a side, around twenty times the size of
Downtown. It has nine districts. To jump between them, open the tuning
panel: under **Level** there is a button for each district.

- **Downtown:** sixteen blocks on a street grid, each its own spot:
  - a library podium with an 8-stair, three rails and a hubba;
  - office ledges;
  - a parking garage with roofs to gap between;
  - church steps with a bank;
  - a sunken plaza;
  - City Hall;
  - a fountain bowl;
  - a hubba hideout;
  - a museum on a 4.5 m podium with a 14-stair and a bank;
  - a raised plaza;
  - the mall and more.

  There are potholes, and coned-off lanes to hop.
- **Residential Hills (north-west):** a 28 m hill.
  - The avenues bomb straight down it and flatten at each cross street.
  - Houses have stoops with little sets and rails, and driveway kickers.
  - Public stairways climb the middle of each block, flight after flight.
  - Railed stairways run down the east face to the boulevard.
  - The overlook park is on top.
- **Stadium (north):** a concourse 6 m up all the way round.
  - Long ramps run down the sides, each with a landing at the top.
  - A two-flight set with a centre rail is in the middle of each long side.
  - A 20-stair with rails and a hubba is at each end.
  - The car parks below have curb islands, cart rails and speed bumps.
  - A park with dirt humps and a drained pond is to the north.
- **University (north-east):** a campus 6 m above the street.
  - Three-flight sets with double rails and hubbas come down the south edge,
    each with a big bank beside it.
  - More sets come down the west edge.
  - Inside are quads lined with ledges, the library set, an amphitheatre and a
    sculpture bank.
- **Suburbs (west):** streets of houses.
  - Some backyards have a drained pool behind a fence with a gap in it.
  - The school yard is sunk below the street, with banks in.
  - The strip mall has a walkway ramp, a rail and a car park.
- **Industrial (east):**
  - warehouses with loading docks;
  - a 240 m concrete V-ditch with plywood kickers at the bottom;
  - pipe racks to grind and a rail spur;
  - gravel humps and pallets.
- **The Dam (south-west):** reservoir heights 24 m up.
  - The drained reservoir is one huge bowl.
  - The spillway is a 24 m concrete drop that ends in a flip-bucket lip
    launching you into the river channel. It is the biggest air in the game.
  - Across the river are three dirt-jump lines, each with a start hill to roll
    in from. The gaps get longer line by line.
- **Waterfront (south):**
  - the river promenade with a long rail;
  - stairs down into the 6 m concrete river channel;
  - tiers of seating;
  - a road bridge and a railed footbridge;
  - plazas and a fountain bowl.
- **Port (south-east):**
  - A container yard with a plate leant up as a ramp.
  - An unfinished freeway on-ramp. Push up it and it ends in mid-air 13 m up,
    with a gravel pile tipped against the end to land on.
  - Across the river is the dry dock, an 80 × 44 m basin 9 m deep to drop
    into.

The old practice block still loads with `?level=block`. The automated tests
use it.

## Things to try

1. Push to full speed and carve S-turns. Does turning feel weighty or twitchy?
   Then drop into the clover bowl (Beach Park), or bomb the hill (Downtown).
   (*Turn rate*, *Grip*, *Speed kept when carving*)
2. Kickflip down the Hillside Steps or the grand stairs (Downtown).
3. Ollie onto a handrail or a hubba from the top of the stairs, holding a
   direction on the trick stick to pick the grind. Pop about two to four
   metres before the top of the rail.
4. Bomb the hill and ollie the potholes and cones on the way down, then find
   the gap in the fence into the storm channel.
5. Take the rooftop line off the parking garage.
6. Set a spot at the top of a line, then use Return to retry it.
7. Pull back to powerslide before the buildings.
8. In Port City, drop the dam spillway, push up the unfinished freeway and
   send it off the end, or roll in from the start hill and try the longest
   dirt-jump line.

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

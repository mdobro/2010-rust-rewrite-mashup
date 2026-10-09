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
  stairs; the board is carried under your arm.
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
| Late flip | Any flip motion while already in the air |

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

Manuals have to be balanced, but gently. A manual only starts once the stick
has sat still in the halfway band for a moment (*Manual: hold the stick steady
this long first*), so pulling down to crouch for an ollie, or letting the
crouch back out, never starts one. There's a gap between the top of the band
and the crouch, so a pull that's nearly all the way doesn't start one either.
Once you're on it, the meter above the rider drifts slowly towards the nose or
the tail. The middle of the band is neutral. Tip further in to lean back, or
ease off to lean forward. Let it reach the end and you drop to the tail or the
nose and the manual ends. Held steady in the middle, a manual lasts until
you run out of speed. With the keyboard (M / N) the balance looks after itself.

## Walking

Walk / Skate (touch), Y (controller) or F (keyboard) steps off the board.
Walking follows the left stick relative to the camera (the direction is
locked while you hold the stick, so the camera swinging round doesn't curve
your path), runs when the stick is all the way over, steps up stairs and stops at taller walls. Step back on and
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
- Carving as you pop doesn't spin you. A spin only starts once you hold
  left or right after the pop (or let go and press again).

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

## The street

A block of street spots inside a ring of buildings:

- **The plaza**: a raised plaza to the north with a three-step stair set down
  its front. A handrail runs down the right of the stairs and a hubba ledge
  down the left; the plaza lip either side of the stairs grinds. On top: a
  bench and a flat rail. Ride up the bank on its east side to get back on.
- **Ledges**: a long street ledge and a bench to the west, and a low manual
  pad.
- **Rails**: a long flat rail and a low flatbar to the east.
- **The road**: a long red curb you can grind, the road, and a street bank
  against the south buildings.

## Things to try

1. Push to full speed and carve S-turns. Does turning feel weighty or twitchy?
   (*Turn rate*, *Grip*, *Speed kept when carving*)
2. Roll off the plaza and kickflip down the stairs.
3. Ollie onto the handrail or the hubba from the top of the stairs, holding a
   direction on the trick stick to pick the grind. On the handrail, pop about
   two to four metres before the top of the rail.
4. Set a spot at the top of a line, then use Return to retry it.
5. Pull back to powerslide before the buildings.

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

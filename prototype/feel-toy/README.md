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
| Set a spot / return to it | D-pad ↑ / Menu | P / R |
| Tuning sliders | View | Tab |
| Help | | H |

### On a phone

The touch layout turns on by itself on phones and tablets. Landscape works
best. Two fixed sticks sit in the bottom corners and never move. The steering
stick reads from wherever your left thumb lands, so a tap never starts a turn.
The trick stick reads from its own centre, like a real stick.

- **Left thumb steers.** While your thumb is down you push along
  (auto-push); let go to coast. Push up to go faster, pull down to powerslide
  to a stop, hold left or right in the air to spin.
- **Set spot / Return** buttons drop a marker where you are, facing the way
  you're going, and put you back there standing still to try the line again.
- **Right thumb is the flick-it stick**, with the same motions as a
  controller's right stick. A quick tap is a small ollie.

### Flick-it tricks (right stick, regular stance)

Pull the stick down to crouch, then flick. The stick's path round its rim is
measured as an angle, so a move is judged by how far you swing, not by hitting
exact boxes:

| Trick | Motion |
| --- | --- |
| Ollie | Pull down, flick up |
| Kickflip / Heelflip | Pull down, flick up-right / up-left |
| FS / BS Pop Shuvit | Pull down, flick (or sweep) left / right |
| Hardflip / Inward Heelflip | Pull down, nudge right / left (about 20°), flick up |
| Varial Kickflip / Varial Heelflip | Swing in from the left / right (about 25°) to the bottom, flick up-right / up-left |
| 360 Flip / Laserflip | Swing in from the left / right (about 70°), flick up-right / up-left |
| 360 Inward Heelflip / 360 Hardflip | Swing in from the left / right (about 40°), flick up |
| FS / BS 360 Pop Shuvit | Sweep round the bottom (about 120°) onto the left / right |
| Nollie anything | The same, upside down: push up first, flick down |
| Late flip | Any flip motion while already in the air |
| Small ollie | Tap the right side |

The motions follow the Skate flick-it chart as published in GameSpot's trick
list for EA's current *skate.*. The swing angles are all on sliders in the
**Trick stick** tuning section.

You can hold the crouch as long as you like and flick whenever you're ready.
Letting the stick back to the middle without flicking stands you back up.
A sideways nudge only turns an ollie into a hardflip or inward heelflip when
the flick follows it quickly, so drifting while you hold a crouch doesn't
change the trick, and overshooting the nudge doesn't turn it into a 360.
Slow stick movement never fires a trick. After a trick the stick has to come
back to the centre before the next one.

There are no grabs. In the air, holding the trick stick in a direction lines
the board up for the grind it will land in (see below), so you can set up a
boardslide or a 5-0 before you reach the rail.

## Grinds

Like Skate, where you hold the trick stick as you land on a rail or ledge
lines the board up. Hold it in the air and the board is already set up in that
position before you reach the rail; move it mid-grind to switch.

| Hold | Grind |
| --- | --- |
| Centre (let go) | 50-50 |
| Down | 5-0 (back truck, nose up) |
| Up | Nosegrind (front truck, tail up) |
| Up-right | Crooked grind |
| Down-right | Smith grind |
| Left / Right | Boardslide / Lipslide (board across the rail) |
| Up-left / Down-left | Noseslide / Tailslide |

Slides drag more than truck grinds and score a little more. Down then a flick
up pops you off, as on the ground.

Steering is the same riding regular or fakie: stick right always turns the
board the same way.

## Braking

Pulling the stick back powerslides: the board swings sideways (*Powerslide board
angle*), the rider leans back on the heels and the speed scrubs off
(*Powerslide stopping power*).

## Camera

The camera sits low and behind you and swings round to follow your direction
of travel, so riding fakie or coming back down a ramp turns it around. In the
air it mostly holds still so spins don't spin the view. Distance, height, how
far it looks down, field of view and how quickly it swings behind you (on the
ground and in the air) are in the **Camera** tuning section.

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
   direction on the trick stick to pick the grind.
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

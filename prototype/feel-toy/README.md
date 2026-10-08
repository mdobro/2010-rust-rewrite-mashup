# Skate Feel Toy

A throwaway prototype for one question: **does the skating feel good?**

One grey park, a camera that follows behind you, and every movement number on
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
| Grab | LT / RT, or hold the right stick in the air | E |
| Grind (auto near rails, or hold if auto is off) | LB | Shift |
| Respawn | Menu | R |
| Tuning sliders | View | Tab |
| Help | | H |

### On a phone

The touch layout turns on by itself on phones and tablets. Landscape works
best. Each thumb gets a floating stick that appears wherever it lands:

- **Left thumb steers.** You roll on your own (auto-push); push up to go
  faster, pull down to brake, hold left or right in the air to spin.
- **Right thumb is the flick-it stick**, with the same motions as a
  controller's right stick. A quick tap is a small ollie.

### Flick-it tricks (right stick, regular stance)

A trick is a path: where the stick starts, which way it swings round the
bottom, and where you flick it to.

| Trick | Motion |
| --- | --- |
| Ollie | Down, then flick up |
| Kickflip / Heelflip | Down, then flick up-right / up-left |
| FS / BS Pop Shuvit | Down, then left / right |
| Hardflip | Down, down-right, flick up |
| Inward Heelflip | Down, down-left, flick up |
| Varial Kickflip / Varial Heelflip | Down-left, down, flick up-right / down-right, down, flick up-left |
| 360 Flip | Left, swing down, flick up-right |
| Laserflip | Right, swing down, flick up-left |
| 360 Hardflip / 360 Inward Heelflip | Right / left, swing down, flick up |
| FS / BS 360 Pop Shuvit | Down-right, sweep round the bottom to left / down-left round to right |
| Nollie anything | The same path upside down: push up first, flick down |
| Late flip | Any flip motion while already in the air |
| Grab | In the air, hold the stick in one direction (up nosegrab, down tailgrab, left melon, right indy) |

The motions follow the Skate flick-it chart as published in GameSpot's trick
list for EA's current *skate.* (kickflip up-right, 360 flip left → down →
up-right, hardflip down → down-right → up, and so on). The varial paths aren't
in that list, so they're filled in by the same pattern: where you start round
the rim sets the shuvit, where you flick sets the flip.

Pulling down crouches (on touch, the ring turns yellow), and you can hold the
crouch as long as you like: flick straight up whenever you're ready and it's
an ollie, up-right a kickflip, and so on. A faster flick pops higher. Letting
go without flicking just stands you back up. While you're holding the crouch,
drifting onto a diagonal doesn't count; a diagonal only changes the trick
(hardflip, inward heelflip) when the whole swing out of the crouch is quick.

Slow stick movement never fires a trick: the flick has to land within the *max
time from pull to flick* after it leaves the crouch. After a trick the stick has
to come back to the centre (a controller does this by itself; on touch the
stick re-centres under your thumb), so the follow-through doesn't fire another
one. The trick name pops up and, on touch, the path you drew fades behind your
thumb.

## Camera

The camera sits low and behind you and swings round to follow your direction
of travel, so riding fakie or coming back down a ramp turns it around. In the
air it mostly holds still so spins don't spin the view. Distance, height, how
far it looks down, field of view and how quickly it swings behind you (on the
ground and in the air) are in the **Camera** tuning section.

## Things to try

1. Push to full speed and carve S-turns. Does turning feel weighty or twitchy?
   (*Turn rate*, *Grip*, *Speed kept when carving*)
2. Hit the north quarter pipe straight on, then at an angle. Straight on sends
   you up and back in; at an angle you catch the coping. (*Vert assist*,
   *Rail magnet radius*)
3. Ollie onto the flat rail and the ledge, then the down rail off the platform.
4. Launch off the kicker toward the east bank and try a 360 flip.
5. Drop into the bowl and link grinds and airs into one combo.

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
- Sounds are synthesized with WebAudio; nothing is loaded.

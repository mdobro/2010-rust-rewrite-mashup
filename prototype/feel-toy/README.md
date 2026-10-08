# Skate Shooter Feel Toy

A throwaway prototype for one question: **does skating while aiming feel good?**

One grey park, target dummies, and every movement number on a live slider. No
netcode, no art, no real weapons. Everything here is written from scratch: no
code, data or assets from MW2, Skate 3 or Minecraft. The only dependency is
Three.js, loaded from a CDN.

## Run it

Any static file server works:

```sh
cd prototype/feel-toy
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly usually works too. Plug in a controller before
or after loading; the page uses whichever device you touched last, and both
work at once (controller in one hand, mouse in the other is fine).

## Controls

| Action | Controller | Mouse + keyboard |
| --- | --- | --- |
| Carve / spin in air | Left stick ← → | A / D |
| Push / brake | Left stick ↑ ↓ | W / S |
| Aim / look | Right stick | Mouse |
| Aim down sights / fire | LT / RT | Right / left click |
| Ollie (hold to crouch, release to pop) | A | Space |
| Flip trick (+ stick direction) | X | Q (+ WASD) |
| Grab (hold) | Y | E |
| Grind (auto near rails, or hold if auto is off) | LB | Shift |
| Respawn | Menu | R |
| Tuning sliders | View | Tab |
| Help | | H |

### On a phone

The touch layout turns on by itself on phones and tablets. Landscape works best.

**Left thumb: one stick for steering and tricks.** It appears wherever you
touch the left half. Normal movement steers: carve left / right, spin left /
right in the air. You roll on your own (auto-push); push up to go faster, ease
down to brake.

**Tricks are Skate's flick-it motions on that same stick, done fast**
(regular stance). A trick is a path: where the stick starts, which way it
swings round the bottom, and where you flick it to.

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
| Grab | In the air, hold the stick down (tailgrab) or up (nosegrab). Left / right stay spins |
| Small ollie | Tap the left side |

The motions follow the Skate flick-it chart as published in GameSpot's trick
list for EA's current *skate.* (kickflip up-right, 360 flip left → down →
up-right, hardflip down → down-right → up, and so on). The varial paths aren't
in that list, so they're filled in by the same pattern: where you start round
the rim sets the shuvit, where you flick sets the flip.

A quick snap down loads the crouch (the ring turns yellow) and stops the stick
braking; the flick pops, and a faster flick pops higher. A slow pull down is
just braking, but a fast flick up out of a held brake still pops. Slow stick
movement never fires a trick: the flick has to reach its end within the *max
time from pull to flick* after leaving the bottom. After a trick the stick
re-centres under your thumb for a moment so the follow-through doesn't fire
another one. The trick name pops up above the stick and the path you drew
fades behind your thumb.

**Right thumb: swipe anywhere to aim.** The gun also fires on its own when
the reticle sits on a target in clear view. Hold **Fire** to shoot (drag it to
aim at the same time); **ADS** toggles aim-down-sights.

Touch gets stronger aim assist and camera recentering by default. All of it
is in the **Touch** section of the tuning panel, along with auto-push speed,
drag sensitivity, stick size and the trick-stick timings. Phones also get a lighter render (lower
resolution, smaller shadow map, coarser ground mesh) and vibrate on hits and
hard landings where the browser allows it.

## The loop being tested

- **Tricks reload the gun.** Ammo from a combo is only paid out when you land
  it cleanly. Bail and you lose it. Sketchy landings pay half.
- **The board and your aim are separate.** Steering is relative to the board;
  the camera follows your aim. On a controller the camera recenters behind you
  when you stop aiming (toggle per device in the Camera section).
- **Aiming far behind you costs speed** (Aiming → twist settings).
- **Air and grind kills score double** when you're mid-combo.

## Things to try

1. Push to full speed and carve S-turns. Does turning feel weighty or twitchy?
   (*Turn rate*, *Grip*, *Speed kept when carving*)
2. Hit the north quarter pipe straight on, then at an angle. Straight on sends
   you up and back in; at an angle you catch the coping. (*Vert assist*,
   *Rail magnet radius*)
3. Ollie onto the flat rail and the ledge while tracking a moving target.
4. Launch off the kicker toward the east bank and kickflip while shooting.
5. Drop into the bowl and pick off the dummy at the bottom.

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
- Sounds are synthesized with WebAudio; nothing is loaded.

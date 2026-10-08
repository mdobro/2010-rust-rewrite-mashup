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

Like Skate, tricks live on the same thumb you steer with. Normal movement
steers; a quick snap down followed by a flick does a trick.

| Action | Touch (left thumb, anywhere on the left half) |
| --- | --- |
| Carve / spin in air | Move the stick left / right |
| Push / brake | You roll on your own (auto-push). Stick up goes faster; easing down brakes |
| Ollie | Snap down, then flick up. A faster flick pops higher |
| Kickflip / heelflip | Snap down, then flick up-left / up-right |
| 360 flip / impossible | Snap down, then flick straight left / right |
| Cancel a crouch | Snap down and hold past the timing window, or let go |
| Flip in the air | Quick flick in any direction (← kickflip, → heelflip, ↑ impossible, ↓ 360 flip) |
| Grab | Hold the stick down in the air |
| Pop off a rail | Snap down, flick up |
| Small ollie | Quick tap on the left side (a tap in the air is a kickflip) |

| Action | Touch (right thumb) |
| --- | --- |
| Aim | Drag anywhere |
| Fire | Fires on its own when the reticle is on a target. Hold **Fire** and drag it to aim yourself |
| Aim down sights | Tap **ADS** to toggle |

A slow pull down is braking, not a trick: only a snap faster than the
*snap-down speed window* loads the crouch, and the stick ring turns yellow when
it does. After each trick the stick ignores your thumb for a moment and
re-centres under it, so the flick's follow-through doesn't steer or spin you.
The trick name pops up above the stick.

Touch gets stronger aim assist and camera recentering by default. All of it
is in the **Touch** section of the tuning panel, along with auto-push speed,
drag sensitivity, stick size and the flick timings. Phones also get a lighter render (lower
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

# Eastside Hills (`east`): the Hill Bomb

Rect **x 300..1000, z 230..910** (700 × 680 m). +x is east, +z is south (downhill).

Shared borders and their 12 m bands (ground there is left at the base height):
* **north** z 230..242 (University / uni)
* **west** x 300..312 (Old Town / old)
* **south** z 898..910 (Shipyards / ship)

The east edge (x 1000) is the map edge. The base already rises there: `22·sm((x-975)/30)` for
x > 975. It needs no band, but the 8 m mesh can't draw that curve (2.1, `edgeFix`).

The base height depends on z only here: it falls about 6.15 % from -0.4 at z 230 to -40.2 at z 910.

| gate | where | w | y | how you reach it |
|---|---|---|---|---|
| campus | (650, 230) | 16 | -0.4 | Uni's Campus Drive (rw 7, sw 4, flat) arrives at 12 m/s. It becomes the top of the **Hill Bomb**: straight south to Crest Road, then the Crest Bend (an S of two r 62.5 arcs) shifts it to x 600. |
| crosstown | (300, 560) | 16 | -20.3 | Old Town's street at grade. It becomes **Crosstown Street**, dead level along z 560 in the **Crosstown Cut**, under the Hill Bomb bridge, to Hillside Park. |
| hillbomb | (600, 910) | 16 | -40.2 | The Hill Bomb leaves at x 600 at about 15.5 m/s into the Shipyards. |

Gate corridors must stay clear (nothing over 0.3 m tall):
* campus: x 642..658, z 230..246
* crosstown: x 300..316, z 552..568
* hillbomb: x 592..608, z 894..910

Every height in this doc is world y. The `east_plan()` ground function below is exact, and every
number in the doc was computed from it in node.

---

## 1. Concept

**Eastside Hills** is a residential hillside cut by one long road. The **Hill Bomb** runs 680 m from
the campus gate to the Shipyards and drops 39.5 m. It is the district's spine and its best line.
The road sits on a ridge, **the Spine**: the houses and cross streets fall away on both sides, so
you always see down the hill to the bay and the drive-in screen.

The Hill Bomb, top to bottom:
* **Campus Drive** (x 650): 2 % from the gate to Crest Road.
* **The Crest Bend**: an S of two r 62.5 arcs, x 650 → 600, at 3.5 %. The **Crest Lookout** sits on
  its inside, with **Crest Corner Skates** on its outside.
* **The upper Spine** (z 392..536): 2–5 %, crossing Orchard Street.
* **The Crosstown Bridge** (z 546..574): the road crosses the **Crosstown Cut** on a deck 6.8 m above
  Crosstown Street. The **Bridge Steps** (two 14-stairs with three rails) drop beside it, and the
  **Underbridge DIY** sits under it.
* **The Plunge** (z 584..720): 13.5 %, the fast part. 70 km/h is reachable.
* **The Chute** (z 696..830): the road runs between two 2–3 m concrete banks with coping on top.
* **The run-out** to Bayview Road and the gate, about 1 %.

Around it:
* **Larkspur Hill School** (west of the Cut): the School Wall, School Steps and School Hubba drop
  off a terrace into a schoolyard, then a yard bank and courts.
* **Hillside Park** (east, x 840..960, z 446..548): three terraces stepping down the hill, with
  stairs, hubbas, banks, a kinked rail, a quarterpipe and a bowl. It is the skatepark.
* **Pool Row** (north-east): four backyard pools on Larch Lane.
* **Bayview Center** (south): a strip mall with a raised walkway, a lot, a 2.4–3.3 m wall into
  Bayview Road with the **Bayview Ten**, and two loading docks out back.
* **Moonrise Drive-In** (south-east): a gravel lot on the natural 6 % with five rows of humps, a
  snack bar you can ride onto, and a giant screen.

**Look and materials:**

| use | colour | notes |
|---|---|---|
| houses (walls) | 0xd9c7a8, 0xc9a27e, 0xb8c4c9, 0xe0d6c2, 0xa9b89a | stucco and siding; `tex 'stone'` or `'brick'` |
| roofs (decor) | 0x7a4f3e, 0x5d5f63 | |
| Larkspur Hill School | 0xc9a27e | `'brick'` |
| Bayview Center | 0xd8d2c4, trim 0x2e3f5c | `'office'` |
| retaining walls, banks, the Cut | 0xa7a39a | concrete |
| roads | 0x505257 | lanes 0x6a6a68 |
| sidewalks | 0xb9b5ab | |
| park concrete | 0xcdc8bc | |
| court | 0x3e7d5c | |
| pool decks | 0xd2cdc2 | |
| drive-in gravel | 0x93897a | rough |
| lawns | default grass (col returns null) | rough |

Trees: round deciduous `K.tree` along the streets and in the yards. Lamps: `K.lamp`.

---

## 2. Height plan

### 2.1 The ground function (`east_plan.js`, copy verbatim)

How it works:
* **natural** is the base, with the six east-west streets **benched**: inside a street's road and
  sidewalk the ground takes the base height at the street's centre line, so the street is level
  across, and it blends back over 24 m (BL) beyond the sidewalk. Past the street's ends it blends
  out over 20 m (BT). Cross streets are therefore dead level along x; the north-south streets just
  follow the 6.15 % base.
* **The Spine**: within 20 m of the bomb's centre line the ground is the bomb's own profile
  `bombY(z)`. It blends to the benched base over max(12, 15·R) m, where R = bombY - base (the ridge
  height). Where R < 0 (z 700..830), the road sits *below* the base: that is the Chute. The road
  and walks (dx ≤ 13) are at bombY, and the banks rise to the base over dx 13..19.
* **The Crosstown Cut**: |z-560| < 12, x 300..910, is the benched base at z 560, so -20.31.
* **Pads**: level or planar platforms with soft margins (smoothstep, hypot corners so nothing
  creases). A margin of 0 is a hard edge: a cliff that a box always covers.
* **Hillside Park**: three level terraces, -14.22 / -16.09 / -18.00, cut at z 476 and 507. Its
  north 6 m blend up to Orchard Street's verge (the Orchard Bank).
* **edgeFix**: the map-edge hill drawn as straight lines between 4 m knots (see the comment).

`portoBaseH`, `clamp`, `lerp`, `V` and `THREE` are the globals CONTRACT.md lists.

```js
function east_plan() {
  const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const base = (x, z) => portoBaseH(x, z);
  const inR = (r, x, z) => x >= r[0] && x <= r[1] && z >= r[2] && z <= r[3];
  /* ---- the level cross streets (east-west), benched into the hill ---- */
  const ST = {
    crest:     { name: 'Crest Road',       c: 280, x0: 400, x1: 830, rw: 6, sw: 4 },
    orchard:   { name: 'Orchard Street',   c: 430, x0: 400, x1: 830, rw: 6, sw: 4 },
    crosstown: { name: 'Crosstown Street', c: 560, x0: 300, x1: 910, rw: 7, sw: 5 },
    mesaW:     { name: 'Mesa Street',      c: 700, x0: 400, x1: 578, rw: 5, sw: 4 },
    mesaE:     { name: 'Mesa Street',      c: 700, x0: 622, x1: 830, rw: 5, sw: 4 },
    bayview:   { name: 'Bayview Road',     c: 840, x0: 330, x1: 975, rw: 6, sw: 4 },
  };
  /* ---- the north-south streets: on the natural grade (6.15 %), no ground work ---- */
  const NS = {
    vista:   { name: 'Vista Street',    x: 410, z0: 270, z1: 850, rw: 6, sw: 4 },
    terrace: { name: 'Terrace Avenue',  x: 820, z0: 270, z1: 850, rw: 6, sw: 4 },
    back:    { name: 'Back Lane',       x: 340, z0: 300, z1: 832, rw: 3, sw: 0 },
    larch:   { name: 'Larch Lane',      z: 360, x0: 830, x1: 970, rw: 4, sw: 0 },   // E-W, level by nature (base depends on z only)
  };
  const STL = Object.values(ST), BL = 24, BT = 20;
  function warpZ(x, z) {
    for (const s of STL) {
      const u = Math.abs(z - s.c), hw = s.rw + s.sw; if (u >= hw + BL) continue;
      const dx = x < s.x0 ? s.x0 - x : x > s.x1 ? x - s.x1 : 0; if (dx >= BT) continue;
      const w = u <= hw ? 0 : u * sm((u - hw) / BL), e = 1 - sm(dx / BT);
      return s.c + Math.sign(z - s.c) * lerp(u, w, e);
    }
    return z;
  }
  const baseW = (x, z) => base(x, warpZ(x, z));
  /* ---- the Hill Bomb ---- */
  const BOMB = { x: 600, rw: 7, sw: 4, campusX: 650, zTop: 292, z0: 392, bendA: [587.5, 292], bendB: [662.5, 392], r: 62.5 };
  // knots: [z, grade] runs from z 250 (at base), then two fixed heights (the Plunge ends at -31.92, the gate end at base)
  const KN = (() => { const segs = [[292, 0.02], [392, 0.035], [418, 0.05], [442, 0.02], [536, 0.05], [584, 0.03]];
    let z = 250, y = base(600, 250); const k = [[z, y]];
    for (const [z1, s] of segs) { y -= s * (z1 - z); z = z1; k.push([z, y]); }
    k.push([720, -31.92], [894, base(600, 894)]); return k; })();
  const ylin = z => { if (z <= KN[0][0] || z >= KN[KN.length - 1][0]) return base(600, z);
    for (let i = 1; i < KN.length; i++) if (z <= KN[i][0]) return lerp(KN[i - 1][1], KN[i][1], (z - KN[i - 1][0]) / (KN[i][0] - KN[i - 1][0])); };
  const bombY = z => (ylin(z - 8) + ylin(z - 4) + ylin(z) + ylin(z + 4) + ylin(z + 8)) / 5;
  const bombX = z => z <= 292 ? 650 : z <= 342 ? 587.5 + Math.sqrt(62.5 ** 2 - (z - 292) ** 2) : z < 392 ? 662.5 - Math.sqrt(62.5 ** 2 - (392 - z) ** 2) : 600;
  function bombDist(x, z) {           // distance to the bomb's centre line (Campus Drive, the Crest Bend, the straight)
    let d = Infinity;
    if (z <= 292) d = Math.min(d, Math.abs(x - 650));
    if (z >= 392) d = Math.min(d, Math.abs(x - 600));
    { const dx = x - 587.5, dz = z - 292, a = Math.atan2(dz, dx); if (a >= 0 && a <= 0.9273) d = Math.min(d, Math.abs(Math.hypot(dx, dz) - 62.5)); }
    { const dx = x - 662.5, dz = z - 392, a = Math.atan2(-dz, -dx); if (a >= 0 && a <= 0.9273) d = Math.min(d, Math.abs(Math.hypot(dx, dz) - 62.5)); }
    return Math.min(d, Math.hypot(x - 650, z - 292), Math.hypot(x - 600, z - 392));
  }
  function ridgeK(x, z, R) {
    const dx = Math.abs(x - bombX(z));
    if (R >= 0) return dx <= 20 ? 1 : 1 - sm((dx - 20) / Math.max(12, 15 * R));
    return dx <= 13 ? 1 : 1 - sm((dx - 13) / 6);                  // the Chute: banks dx 13..19
  }
  const CUT = { z: 560, hw: 12, x0: 300, x1: 910, y: base(600, 560) };   // y -20.31
  const NOTCH = [617, 629, 528, 548];                                     // the Bridge Steps slot
  const DECK = { z0: 546, z1: 574, x0: 589, x1: 611 };
  /* ---- the Hillside Park terraces ---- */
  const PARK = { x0: 840, x1: 960, z0: 446, z1: 538, cuts: [476, 507], y: [-14.22, -16.09, -18.00] };
  /* ---- pads: level (or planar) platforms. m = soft margins [w, e, n, s]; 0 = a hard edge that a box covers ---- */
  const PADS = [
    { name: 'forecourt', r: [846, 906, 538, 548], y: -20.16, m: [6, 6, 0, 0] },
    { name: 'school',    r: [424, 488, 578, 666], prof: [[578, -23.0], [618, -23.0], [632, -25.4], [666, -25.4]], m: [4, 8, 0, 0] },
    { name: 'mall',      r: [690, 802, 749, 822], lin: [749, -32.6, -0.023], m: [8, 8, 0, 0] },
    { name: 'lookout',   r: [596, 618, 302, 326], y: -3.75, m: [10, 10, 10, 10] },
    { name: 'poolA',     r: [850, 866, 326, 340], y: -6.15, m: [10, 10, 10, 10] },
    { name: 'poolB',     r: [900, 916, 326, 340], y: -6.15, m: [10, 10, 10, 10] },
    { name: 'poolC',     r: [874, 890, 380, 394], y: -9.47, m: [10, 10, 10, 10] },
    { name: 'poolD',     r: [926, 942, 380, 394], y: -9.47, m: [10, 10, 10, 10] },
  ];
  function padY(p, z) {
    if (p.y !== undefined) return p.y;
    if (p.lin) return p.lin[1] + p.lin[2] * (z - p.lin[0]);
    const K = p.prof; if (z <= K[0][0]) return K[0][1];
    for (let i = 1; i < K.length; i++) if (z <= K[i][0]) return lerp(K[i - 1][1], K[i][1], sm((z - K[i - 1][0]) / (K[i][0] - K[i - 1][0])));
    return K[K.length - 1][1];
  }
  function natural(x, z) {
    const bw = baseW(x, z);
    if (Math.abs(z - CUT.z) < CUT.hw && x >= CUT.x0 && x <= CUT.x1) return bw;
    if (inR(NOTCH, x, z)) return CUT.y;
    const Y = bombY(z); return lerp(bw, Y, ridgeK(x, z, Y - bw));
  }
  // the map-edge hill (x > 975) comes from the base as 22·sm((x-975)/30); the 8 m mesh can't draw that toe.
  // Replace it with the same curve sampled every 4 m from x 968 and joined by straight lines: the res-4 region
  // [968, 1000, 232, 904] has its vertices exactly there, so it draws this ground exactly.
  const EDGE = x => x <= 975 ? 0 : 22 * sm((x - 975) / 30);
  const edgeFix = x => { if (x <= 968) return 0; const i = 968 + Math.floor((x - 968) / 4) * 4; return lerp(EDGE(i), EDGE(i + 4), (x - i) / 4) - EDGE(x); };
  function ground(x, z) { return ground0(x, z) + edgeFix(x); }
  function ground0(x, z) {
    if (inR([PARK.x0, PARK.x1, PARK.z0, PARK.z1], x, z)) {
      let y = PARK.y[z < PARK.cuts[0] ? 0 : z < PARK.cuts[1] ? 1 : 2];
      if (z < PARK.z0 + 6) y = lerp(y, natural(x, PARK.z0), sm((PARK.z0 + 6 - z) / 6));   // the Orchard Bank
      return y;
    }
    for (const p of PADS) {
      const [x0, x1, z0, z1] = p.r, [mw, me, mn, ms] = p.m;
      const tx = x < x0 ? (mw ? (x0 - x) / mw : 9) : x > x1 ? (me ? (x - x1) / me : 9) : 0;
      const tz = z < z0 ? (mn ? (z0 - z) / mn : 9) : z > z1 ? (ms ? (z - z1) / ms : 9) : 0;
      const t = tx >= 9 || tz >= 9 ? 1 : Math.hypot(tx, tz); if (t >= 1) continue;   // rounded corners: no creases
      const y = padY(p, clamp(z, z0, z1));
      return t <= 0 ? y : lerp(y, natural(x, z), sm(t));
    }
    return natural(x, z);
  }
  /* ---- what the ground is, for colour and surface ---- */
  const DRIVEIN = [846, 966, 604, 796];
  function zone(x, z) {
    if (inR([PARK.x0, PARK.x1, PARK.z0, PARK.z1], x, z) || inR(PADS[0].r, x, z) || inR(NOTCH, x, z)) return 'park';
    const dB = bombDist(x, z), adx = Math.abs(x - 600);
    if (z >= 696 && z <= 830 && adx > 13 && adx <= 19.5) return 'bank';
    if (dB <= BOMB.rw) return 'road';
    if (dB <= BOMB.rw + BOMB.sw) return 'walk';
    for (const s of STL) if (x >= s.x0 && x <= s.x1) { const u = Math.abs(z - s.c); if (u <= s.rw) return 'road'; if (u <= s.rw + s.sw) return 'walk'; }
    for (const s of [NS.vista, NS.terrace]) if (z >= s.z0 && z <= s.z1) { const u = Math.abs(x - s.x); if (u <= s.rw) return 'road'; if (u <= s.rw + s.sw) return 'walk'; }
    if (z >= NS.back.z0 && z <= NS.back.z1 && Math.abs(x - NS.back.x) <= NS.back.rw) return 'lane';
    if (x >= NS.larch.x0 && x <= NS.larch.x1 && Math.abs(z - NS.larch.z) <= NS.larch.rw) return 'lane';
    if (inR(PADS[1].r, x, z)) return inR([432, 480, 636, 660], x, z) ? 'court' : 'yard';
    if (inR(PADS[2].r, x, z)) return 'lot';
    if (inR(PADS[3].r, x, z)) return 'lookout';
    for (let i = 4; i < 8; i++) if (inR(PADS[i].r, x, z)) return 'deck';
    if (inR(DRIVEIN, x, z)) return 'gravel';
    return null;                                                   // lawns and verges: the default grass
  }
  const COLS = { park: 0xcdc8bc, bank: 0xa7a39a, road: 0x505257, walk: 0xb9b5ab, lane: 0x6a6a68, court: 0x3e7d5c,
    yard: 0x5f6266, lot: 0x55585d, lookout: 0xa9876a, deck: 0xd2cdc2, gravel: 0x93897a };
  const CC = {}; for (const k in COLS) CC[k] = new THREE.Color(COLS[k]);
  const col = (x, z) => { const k = zone(x, z); return k ? CC[k] : null; };
  const surface = (x, z) => { const k = zone(x, z); return k === 'gravel' || k === null ? 'rough' : 'smooth'; };
  /* ---- fine ground, [x0, x1, z0, z1, res]: finer ones sit wholly inside a res-4 block or outside all of them ---- */
  const REGIONS = [
  // res 4 blocks: bench toes and ridge flanks (they don't count against the fine budget)
  [376, 832, 248, 528, 4],       // Crest Road, the Crest Bend, Orchard Street, the upper Spine
  [832, 856, 248, 312, 4], [832, 856, 392, 440, 4],
  [304, 832, 528, 744, 4],       // Crosstown, the school, the lower Spine, Mesa Street
  [832, 928, 544, 600, 4], [832, 848, 664, 736, 4],       // Crosstown's east end
  [304, 968, 808, 896, 4],       // Bayview Road
  [968, 1000, 232, 904, 4],      // the map-edge hill (its ground is linear between these vertices)
  // Campus Drive, the Crest Bend, the Lookout
  [608, 624, 248, 296, 1], [672, 704, 248, 352, 2], [672, 688, 248, 264, 1],
  [568, 632, 296, 336, 1], [560, 624, 336, 344, 2], [520, 576, 344, 376, 2],
  [384, 400, 248, 272, 2], [384, 400, 400, 416, 2],
  // Orchard Street over the Spine
  [480, 512, 392, 416, 2], [480, 512, 448, 464, 2], [680, 712, 392, 416, 2], [688, 712, 448, 464, 2],
  // the Crosstown Cut and the Bridge Steps
  [464, 736, 544, 552, 1], [480, 720, 568, 576, 1], [608, 640, 520, 528, 1], [608, 640, 528, 544, 1],
  [464, 480, 528, 536, 2], [720, 728, 528, 536, 2], [904, 920, 544, 552, 1], [696, 736, 584, 600, 2],
  // Larkspur Hill School
  [416, 488, 576, 584, 1], [416, 424, 584, 664, 1], [488, 496, 576, 664, 1], [424, 488, 616, 632, 2], [416, 496, 664, 672, 1],
  // the lower Spine toes, Mesa's dead ends
  [496, 568, 624, 680, 2], [624, 696, 624, 680, 2], [552, 584, 680, 704, 1], [616, 648, 680, 704, 1],
  // the Chute
  [584, 592, 688, 744, 1], [608, 616, 688, 744, 1], [584, 592, 744, 768, 1], [608, 616, 744, 768, 1],
  [584, 592, 768, 808, 2], [608, 616, 768, 808, 2], [568, 592, 808, 832, 2], [608, 632, 808, 832, 2],
  [584, 592, 832, 864, 2], [608, 616, 832, 864, 2], [568, 592, 864, 872, 2], [608, 632, 864, 872, 2],
  // Bayview Center lot
  [680, 816, 744, 752, 1], [680, 696, 752, 808, 1], [800, 816, 752, 808, 1], [680, 688, 808, 824, 1], [800, 816, 808, 824, 1],
  // Hillside Park
  [832, 848, 448, 544, 1], [952, 968, 448, 544, 1],
  [848, 952, 440, 456, 1], [848, 952, 472, 480, 1], [848, 952, 504, 512, 1], [848, 952, 536, 544, 1],
  [944, 952, 480, 504, 0.5],     // the Hillside quarterpipe (a K.feat)
  // Pool Row yards
  [832, 880, 320, 352, 2], [880, 928, 320, 352, 2], [864, 904, 368, 408, 2], [912, 960, 368, 408, 2],
];
  return { sm, base, inR, ST, NS, warpZ, baseW, BOMB, KN, bombY, bombX, bombDist, ridgeK, CUT, NOTCH, DECK, PARK, PADS, padY, natural, ground, DRIVEIN, zone, col, surface, REGIONS };
}
```

**Bomb profile (bombY, the road centre line).** It is the knot line `KN` averaged over ±8 m:

| z | 246 | 292 | 342 | 392 | 430 | 500 | 536 | 546 | 560 | 574 | 584 | 600 | 640 | 680 | 700 | 720 | 740 | 760 | 800 | 840 | 880 | 894 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| y | -1.07 | -2.16 | -3.87 | -5.66 | -7.16 | -10.30 | -12.05 | -12.40 | -12.82 | -13.24 | -13.79 | -15.70 | -21.11 | -26.51 | -29.22 | -31.71 | -32.85 | -33.77 | -35.63 | -37.48 | -39.33 | -39.91 |

* The ridge height R = bombY - base is 7.99 at z 584, -0.29 at z 700 and -2.20 at z 720.
* z 536..584 is one straight 3 % line (0 chord error), so the bridge deck can be one hubba.
* Ride simulation (gravity 14, the game's roll and drag): peak 70.8 km/h at z 716 from the gate at
  12 m/s; 70.1 from Orchard at 8.5 m/s; 68.5 from z 536 rolling. About 15.5 m/s at the south gate.

**Other heights the parts use:**

| where | y |
|---|---|
| Crest Road (z 280) | -3.08 level, rising to -1.88 over the ridge at x 640..660 |
| Orchard Street (z 430) | -12.31 level, rising to -7.16 at x 580..620 |
| Crosstown Street and the Cut floor | -20.31 |
| Mesa Street (z 700) | -28.92 |
| Bayview Road (z 840) | -37.54 |
| Vista / Terrace / Back Lane | 6.15 % base: -3.54 (z 300), -10.6 (400), -16.6 (500), -22.8 (600), -28.9 (700), -35.1 (800) |
| Larch Lane (z 360) | -8.00 |
| Crest Lookout pad | -3.75 |
| Pool pads A/B (z 326..340), C/D (z 380..394) | -6.15 / -9.47 |
| Hillside Park T1 / T2 / T3 / forecourt | -14.22 / -16.09 / -18.00 / -20.16 |
| school yard (z 578..618) / courts (z 632..666) | -23.0 / -25.4 (smoothstep bank z 618..632) |
| Bayview Center lot | -32.6 at z 749, falling 2.3 % to -34.28 at z 822 |
| Moonrise lot (x 846..966) | base: -22.77 (z 600), -25.85 (650), -28.92 (700), -31.38 (740), -35.08 (800) |
| Crest Corner Skates door (661.8, 305) | -2.58 |

**Hard edges** (all covered by a box listed in section 4):
* the school pad's north edge, z 578 (natural -20.48 → -23.0) and south edge, z 666 (-25.4 → -26.83)
* the mall pad's north edge z 749 (about 0.7 m, under the shop buildings) and south edge z 822
  (-34.28 → -37.38, under the Bayview wall)
* the forecourt's north and south edges (z 538 under the forecourt box; z 548 meets the Crosstown
  sidewalk flush)
* Hillside Park's terrace cuts at z 476 and 507 (under the step boxes) and its east/west sides
  (under the edge walls)
* the Cut's north and south faces (under the Cut walls) and the Bridge Steps notch

None of them lies on a sink-scan row (x = 302 + 6k, z = 232 + 6k).

### 2.2 Fine regions (`index.js`, right after P.ground)

`for (const r of PL.REGIONS) P.region(...r);` — the list is in `east_plan()` above. It was checked:
every finer region sits wholly inside a res-4 block or outside all of them, there is no partial
overlap, and every rect is snapped to 8.

* The res-4 blocks cover the bench toes and ridge flanks. They don't count against the fine budget.
* The fine regions (res ≤ 2) total **52,288 m²**. The K.pools add about 1,400 more: **about 53.7k of
  the 60k**.
* `[968, 1000, 232, 904, 4]` is what makes the map-edge hill exact: its vertices fall at x 968 + 4k,
  where edgeFix puts its knots.
* If the sink scan flags a spot, first look for a box that should cover a hard edge. Only then add a
  region, and keep the total under 60k.

### 2.3 Colour and surface

`P.col(PL.col)` and `P.surface(PL.surface)` (both in the plan above). The `zone()` rules, first match
wins:
1. Hillside Park, the forecourt and the Bridge Steps notch: park concrete.
2. The Chute banks (z 696..830, 13 < |x-600| ≤ 19.5): bank concrete.
3. The Hill Bomb: road within 7 m of its centre line, sidewalk to 11.
4. The six cross streets: road ≤ rw, sidewalk ≤ rw + sw.
5. Vista Street and Terrace Avenue: road and sidewalk.
6. Back Lane and Larch Lane: lane asphalt.
7. The school pad: court at x 432..480, z 636..660, otherwise yard asphalt.
8. The mall pad: lot asphalt.
9. The Lookout pad: warm paving.
10. The four pool pads: deck.
11. The drive-in rect `DRIVEIN` [846, 966, 604, 796]: gravel.
12. Otherwise null (default grass).

Surface is 'rough' on gravel and grass (null), 'smooth' everywhere else.

Centre lines are `K.dash` (it follows the ground): the bomb (one dash per 4 m of arclength along the
path in 4.1), Crest, Orchard, Mesa W/E, Bayview, Vista and Terrace. Never use paintRect on a slope.

### 2.4 Shared numbers

Everything a part needs is in `PL` (the return of `east_plan()`): ST, NS, BOMB, KN, bombY, bombX,
CUT, NOTCH, DECK, PARK, PADS, padY, DRIVEIN. Parts read ground with `K.terrainH(x, z)`, never with
their own copy. `east_plan()` is called once in index.js. Pass `PL` to each part:
`east_spine(K, P, PL)`.

---

## 3. Layout

### 3.1 Sketch (10 m a character; x 300 → 1000 left to right, z 230 at the top)

```
       x 300                           x 650                             x 1000
 230                                    ##                                  
 240                                    ##                                  
 250                                    ##                                  
 260                                    ##                                  
 270            ###########################################                 
 280            ###########################################                 
 290            ##                      ##KKK            ##                 
 300     ||     ##                  LL  ##KKK            ##                 
 310     ||     ##                  LL ###KKK            ##                 
 320     ||     ##                  LL ##                ##                 
 330     ||     ##                    ###                ##  oo   oo        
 340     ||     ##                   ###                 ##                 
 350     ||     ##                  ###                  ##--------------   
 360     ||     ##                 ###                   ##--------------   
 370     ||     ##                 ##                    ##                 
 380     ||     ##                 ##                    ##    oo    o      
 390     ||     ##                 ##                    ##                 
 400     ||     ##                 ##                    ##                 
 410     ||     ##                 ##                    ##                 
 420     ||     ###########################################                 
 430     ||     ###########################################                 
 440     ||     ##                 ##                    ##                 
 450     ||     ##                 ##                    ## PPPPPPPPPPPP    
 460     ||     ##                 ##                    ## PPPPPPPPPPPP    
 470     ||     ##                 ##                    ## PPPPPPPPPPPP    
 480     ||     ##                 ##                    ## PPPPPPPPPPPP    
 490     ||     ##                 ##                    ## PPPPPPPPPPPP    
 500     ||     ##                 ##                    ## PPPPPPPPPPPP    
 510     ||     ##                 ##                    ## PPuuuuuPPPPP    
 520     ||     ##                 ##TTT                 ## PPuuuuuPPPPP    
 530     ||     ##                 ##TTT                 ## PPuuuuuPPPPP    
 540     ||     ##                XXXTTT                 ##  PPPPPP         
 550  ###||#######################XXXX#############################         
 560  ###||#######################XXXX#############################         
 570     ||     ##                XXXX                   ##                 
 580     ||     ##sssssss          ##                    ##                 
 590     ||     ##sssssss          ##                    ##                 
 600     ||     ##sssssss          ##                    ##  ::::::::::::   
 610     ||     ##sssssss          ##                    ##  ::::::::::::   
 620     ||     ##sssssss          ##                    ##  ::::::::::::   
 630     ||     ##sssssss          ##                    ##  ::::::::::::   
 640     ||     ##sssssss          ##                    ##  ::::::::::::   
 650     ||     ##sssssss          ##                    ##  ::::::::::::   
 660     ||     ##SSSSSSS          ##                    ##  ::::::::::::   
 670     ||     ##SSSSSSS          ##                    ##  ::::::::::::   
 680     ||     ##SSSSSSS          ##                    ##  ::::::::::::   
 690     ||     ################## ## #####################  :::bbbbb::::   
 700     ||     ##################c##c#####################  :::bbbbb::::   
 710     ||     ##                c##c                   ##  :::bbbbb::::   
 720     ||     ##                c##c                   ##  ::::::::::::   
 730     ||     ##                c##c                   ##  ::::::::::::   
 740     ||     ##                c##c       MMMMMMMMMMM ##  ::::::::::::   
 750     ||     ##                c##c       MMMMMMMMMMM ##  ::::::::::::   
 760     ||     ##                c##c       MMMMMMMMMMM ##  ::::::::::::   
 770     ||     ##                c##c       mmmmmmmmmmm ##  ::::::::::::   
 780     ||     ##                c##c       mmmmmmmmmmm ##  ::::::::::::   
 790     ||     ##                c##c       mmmmmmmmmmm ##  :QQQQQQQQQ::   
 800     ||     ##                c##c       mmmmmmmmmmm ##   QQQQQQQQQ     
 810     ||     ##                c##c       mmmmmmmmmmm ##                 
 820     ||     ##                c##c                  YY#                 
 830     #################################################################  
 840     #################################################################  
 850                               ##                                       
 860                               ##                                       
 870                               ##                                       
 880                               ##                                       
 890                               ##                                       
 900                               ##                                       
```

| char | what |
|---|---|
| `#` | road and sidewalk |
| `\|`, `-` | Back Lane (x 340), Larch Lane (z 360) |
| `L` | Crest Lookout |
| `K` | Crest Corner Skates |
| `o` | Pool Row decks |
| `P` | Hillside Park |
| `u` | the Hillside bowl |
| `T` | the Bridge Steps |
| `X` | the Crosstown Bridge |
| `s` / `S` | Larkspur Hill schoolyard and courts / the school building |
| `c` | the Chute banks |
| `M` / `m` | Bayview Center shops / the lot |
| `Y` | the Bayview pylon |
| `:` | Moonrise Drive-In lot |
| `b` | the snack bar |
| `Q` | the Moonrise screen |

The Crosstown Cut is the band z 548..572 under row 550/560: everything in it is at -20.31 and its
walls are the rows of `w` described in 4.3.

### 3.2 Streets

| street | where | how it's built | grade |
|---|---|---|---|
| **Hill Bomb** (Campus Drive) | x 650, z 230..292 | flush + sidewalk hubbas (4.1) + dash | 2 % |
| **Hill Bomb** (Crest Bend) | arcs centred (587.5, 292) and (662.5, 392), r 62.5, z 292..392 | flush + hubbas + dash | 3.5 % |
| **Hill Bomb** (Spine, Plunge, Chute, run-out) | x 600, z 392..910 | flush + hubbas + dash; the deck z 546..574 is a hubba | 2–5 %, then 13.5 % z 584..720, then about 4.6 % and 1 % |
| **Crest Road** | z 280, x 400..830, rw 6 sw 4 | flush (benched) + dash | level |
| **Orchard Street** | z 430, x 400..830, rw 6 sw 4 | flush (benched) + dash | level |
| **Crosstown Street** | z 560, x 300..910, rw 7 sw 5 | `K.street('x', 560, 316, 910, -20.31, [410, 600, 820], {rw: 7, sw: 5, lamps: false})`; x 300..316 is flush paint (gate corridor) | level, in the Cut |
| **Mesa Street** | z 700, x 400..578 and 622..830, rw 5 sw 4 | flush (benched) + dash. It does **not** cross the Chute: bollards at x 576 and 624 | level |
| **Bayview Road** | z 840, x 330..975, rw 6 sw 4 | flush (benched) + dash | level |
| **Vista Street** | x 410, z 270..850, rw 6 sw 4 | flush + dash | 6.15 % |
| **Terrace Avenue** | x 820, z 270..850, rw 6 sw 4 | flush + dash | 6.15 % |
| **Back Lane** | x 340, z 300..832, rw 3 | flush lane | 6.15 % |
| **Larch Lane** | z 360, x 830..970, rw 4 | flush lane | level |

The crossing at x 600 in the Crosstown K.street is not a street. It leaves the sidewalks open under
the bridge (x 588..612, with curb ramps) for the Underbridge DIY banks.

The level streets cross the bomb at grade: Crest at z 280 (on Campus Drive), Orchard at z 430 and
Bayview at z 840. Cars never cross the bomb (section 10).

### 3.3 How the gates are reached

* **Campus**: the corridor is the flush top of the bomb. Its sidewalk hubbas start at z 250 (s 20),
  so nothing at all stands in x 642..658, z 230..246. Crest Corner Skates and the lamps start at
  z 270.
* **Crosstown**: x 300..316 is flush paint at -20.31 (base -20.3, so it meets old's street). The
  K.street and its sidewalk boxes start at x 316. No lamp or tree in the corridor.
* **Hillbomb**: the bomb's sidewalk hubbas end at z 890 (they sit at |x-600| 7..11, outside the
  corridor anyway). From z 894 the road is at base. Nothing in x 592..608, z 894..910.
* **Bands**: nothing built in z 230..242, x 300..312 or z 898..910 except flush paint. Back Lane
  starts at z 300, Bayview Road at x 330, Crosstown's sidewalks at x 316.

---

## 4. Spots

Every spot gets `P.spot(name, x, y, z, yaw, area)` at its run-up end, facing the spot. Yaw is
atan2(-vx, -vz): facing +z (south, downhill) is π, -z is 0, +x is -π/2, -x is π/2. The part that
builds it is in brackets.

### 4.1 S1 The Hill Bomb and its sidewalks [spine]

The road is flush ground. Its sidewalks are 0.15 m sloped hubba chords with a 'Curb' grind line along
the road edge, built with `east_walk` (in `east_plan.js`, below the plan).

**The arclength path** (s in metres from the gate):

```js
const zS = z => 177.91 + (z - 392);              // s on the straight, z ≥ 392
function bombPath(s) {
  if (s <= 62) return [650, 230 + s];                                          // Campus Drive
  if (s <= 119.955) { const t = (s - 62) / 62.5; return [587.5 + 62.5 * Math.cos(t), 292 + 62.5 * Math.sin(t)]; }
  if (s <= 177.91) { const t = 0.9273 - (s - 119.955) / 62.5; return [662.5 - 62.5 * Math.cos(t), 392 - 62.5 * Math.sin(t)]; }
  return [600, 392 + (s - 177.91)];
}
const skip = [[40, 62], [zS(420), zS(440)], [zS(546), zS(574)], [zS(830), zS(850)]];
for (const side of [1, -1]) east_walk(K, bombPath, 20, zS(890), side * 9, side * 7, 4, skip);
```

That makes 74 chords (37 a side), none more than 2.9 cm off the ground. The skips are the Crest
crossing, the Orchard crossing, the bridge and the Bayview crossing: flush there.

On the bridge, add two straight sidewalk hubbas and their curbs:

```js
for (const x of [591, 609]) K.hubbas.push({ a: V(x, -12.25, 546), b: V(x, -13.09, 574), w: 4, noRails: true, color: 0xb9b5ab });
K.rail(593, -12.25, 546, 593, -13.09, 574, 'Curb', false); K.rail(607, -12.25, 546, 607, -13.09, 574, 'Curb', false);
```

* **Lamps**: every 30 m along both sides at |offset| 12, from z 270 to z 880. In the Chute they stand
  on the bank tops at x 578.5 / 621.5. None on the bridge (the parapet takes their place).
* **Dash**: `K.dash` per 4 m of s from s 2 to zS(906), broken at the three crossings.
* `P.spot('Hill Bomb', 650, -1.2, 252, Math.PI, [636, 230, 664, 300])`.

### 4.2 S2 Crest Lookout [spine]

A flat paved pad at -3.75, x 596..618, z 302..326, on the inside of the Crest Bend. Its 10 m soft
margins meet Crest Road's walk at z 290 and the bomb's west walk.
* `K.ledge(598, 324, 616, 324.6)`: the view ledge on its south edge, 0.45.
* Planters `K.planter(598, 304, 602, 308)` and `K.planter(612, 304, 616, 308)`.
* Benches `K.bench(603, 312, 611, 312.5)` and `K.bench(603, 318, 611, 318.5)`.
* A telescope: `K.prop(613.8, -3.75, 321.8, 614.2, -2.55, 322.2, 0x3a3d42)` and
  `K.prop(613.6, -2.55, 321.4, 614.4, -2.15, 322.8, 0x3a3d42)`.
* Sign CREST LOOKOUT on two posts at the north edge (section 7).
* Run-up: Crest Road from the west (level, 200 m). Roll-away: down the bend onto the bomb.
* `P.spot('Crest Lookout', 607, -3.75, 298, Math.PI, [594, 296, 620, 330])`.

### 4.3 S3 The Crosstown Cut and Bridge [spine; walls also west and park]

**The Cut walls.** One box per 8 m segment. Top = the max ground behind that segment + 0.45, so each
wall is a 0.45 ledge from the bench above and a tall concrete wall from the street. Bottom -20.8.

North wall, z 546.5..548.5, `{edges: 's'}`, segments x0 = 464, 472, ..., 576 (west of the bridge) and
632..728 (east). Its top per segment (x0 → top):

| x0 | 464 | 472 | 480 | 488 | 496 | 504 | 512 | 520 | 528 | 536 | 544 | 552 | 560 | 568 | 576 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| top | -19.68 | -19.34 | -18.86 | -18.25 | -17.55 | -16.79 | -15.99 | -15.20 | -14.43 | -13.71 | -13.08 | -12.57 | -12.19 | -11.99 | -11.97 (to 584) |

East of the notch it mirrors about x 600: 632 → -12.19 (631..640), 640 → -12.57, 648 → -13.08,
656 → -13.71, 664 → -14.43, 672 → -15.20, 680 → -15.99, 688 → -16.79, 696 → -17.55, 704 → -18.25,
712 → -18.86, 720 → -19.34, 728 → -19.68 (to 735).

South wall, z 571.5..573.5, `{edges: 'n'}`, segments x0 = 496..576 and 616..720:

| x0 | 496 | 504 | 512 | 520 | 528 | 536 | 544 | 552 | 560 | 568 | 576 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| top | -18.46 | -17.76 | -17.00 | -16.20 | -15.41 | -14.66 | -13.99 | -13.43 | -13.03 | -12.80 | -12.77 (to 584) |

East: 616 → -12.77, 624 → -12.80, 632 → -13.03, 640 → -13.43, 648 → -13.99, 656 → -14.66,
664 → -15.41, 672 → -16.20, 680 → -17.00, 688 → -17.76, 696 → -18.46, 704 → -19.06, 712 → -19.51,
720 → -19.79 (to 728).

Who builds which: west builds x < 560, spine x 560..680, park x 680..735.

**The abutments and deck** [spine]:
* North abutment `K.B(584, -20.8, 546.5, 615, -12.5, 548.5, 'garage')`; south abutment
  `K.B(584, -20.8, 571.5, 616, -13.25, 573.5, 'garage')`.
* The deck is one straight hubba: `K.hubbas.push({a: V(600, -12.40, 546), b: V(600, -13.24, 574), w: 22, noRails: true, color: 0x505257})`.
  It is solid from -13.54, so 6.8 m of clearance over the street. Its endpoints are on the benches,
  outside the Cut. **Don't move them**: an endpoint inside the Cut makes the block solid to the
  floor.
* Parapets: `K.rail(589.2, -11.35, 546, 589.2, -12.19, 574, 'Rail', true)` and the same at x 610.8.
* Fascias (looks only): `K.prop(588.8, -14.3, 546, 589.0, -12.25, 574, 0xa7a39a)` and at x 611.0..611.2.
* Sign EASTSIDE HILLS on the west fascia (section 7).
* `P.spot('Crosstown Bridge', 540, -20.31, 560, -Math.PI / 2, [500, 548, 640, 572])`.

### 4.4 S4 The Bridge Steps [spine]

Two 14-stairs with three rails, from the bomb's east bench (beside the bridge's north abutment) down
into the Cut, in the notch x 617..629, z 528..548 (notch ground is -20.31).
* Top landing `K.B(615, -12.6, 524, 631, -11.6, 528, 'plaza')`. The ground at z 526 is -11.60..-11.75,
  so it sits flush.
* Flight 1: `K.stairSpot('z', 528, 1, 617, 629, -11.6, -15.88, 14, 0.4, {rails: [617.45, 623, 628.55]})`.
  Risers 0.306, run 5.2, so it ends at z 533.2.
* Filler under flight 1: `K.B(617, -20.8, 528, 629, -16.9, 533.2, 'step')`.
* Mid landing: `K.B(617, -21, 533.2, 629, -15.88, 537.2, 'step')`.
* Flight 2: `K.stairSpot('z', 537.2, 1, 617, 629, -15.88, -20.31, 14, 0.4, {rails: [617.45, 623, 628.55]})`.
  It ends at z 542.4, then 5.6 m of floor to the Crosstown sidewalk (z 548).
* Cheek walls: `K.B(615, -20.8, 524, 617, -11.05, 548, 'ledge')` and `K.B(629, -20.8, 524, 631, -11.28, 548, 'ledge')`.
  Their tops are 0.45 over the side ground (-11.50 / -12.65 on the west, -11.73 / -12.65 on the east).
* Run-up: 84 m south from Orchard Street (x 623, z 440, -7.43) down the ridge flank at about 4 %.
  Roll-away: across Crosstown Street (14 m road, 5 m walk), then west or east along the Cut.
* `P.spot('Bridge Steps', 623, -10.3, 500, Math.PI, [612, 496, 634, 548])`.

### 4.5 S5 The Underbridge DIY [spine]

Under the deck, in the sidewalk gap at x 588..612:
* North bank against the abutment: `K.hubbas.push({a: V(600, -18.31, 548.6), b: V(600, -20.29, 553), w: 20, noRails: true, color: 0xa7a39a})`.
* South bank: `K.hubbas.push({a: V(600, -18.31, 571.4), b: V(600, -20.29, 567), w: 20, noRails: true, color: 0xa7a39a})`.
* A median jersey: `K.jersey(592, 559.6, 608, 560.4)`.
* Two cones and a dumpster on the south walk east of the bridge: `K.dumpster(616, 570, true)`.
* Tape 1 is here (section 9).

### 4.6 S6 The Chute [spine]

Ground does the banks (2.1): road and walks at bombY to |x-600| = 13, then a bank rising to the base
by 19. The bank top is 1.9 m over the road at z 720, 1.5 at 740 and 1.2 at 760.
* Coping along each bank top, at x 581 and 619, z 704..816, in 8 m pieces with ends on the ground:
  `K.rail(x, K.terrainH(x, z) + 0.05, z, x, K.terrainH(x, z + 8) + 0.05, z + 8, 'Coping', false)`.
  That's 14 pieces a side.
* Mesa Street dead-ends at the bank tops: bollards (`K.prop` 0.25 × 0.9) every 1.5 m across x 576
  and x 624, z 695..705.
* Run-up: the Plunge. You enter at 60–70 km/h; carve up the banks.
* `P.spot('The Chute', 600, -29.2, 700, Math.PI, [578, 696, 622, 830])`.

### 4.7 S7 The School Wall, School Steps and School Hubba [west]

Larkspur Hill School sits on the school pad (x 424..488, z 578..666) just south of the Cut.
* The terrace: `K.B(420, -23.5, 574, 498, -20.16, 580, 'plaza', {edges: 's'})`. It covers the pad's
  hard north edge. Its top equals the Crosstown sidewalk (-20.16), so you roll straight onto it. The
  drop to the yard (-23.0) is **2.84 m**: the School Wall.
* School Steps: `K.stairSpot('z', 580, 1, 448, 464, -20.16, -23.0, 9, 0.4, {rails: [448.45, 456, 463.55]})`.
  Risers 0.316, run 3.2, ending at z 583.2.
* School Hubba: `K.stairSpot('z', 580, 1, 472, 480, -20.16, -23.0, 9, 0.4, {hubbas: [471.6, 480.4]})`.
* Run-up: Crosstown Street (level, from the gate 150 m away) or down Vista Street (6 %) and left
  onto Crosstown. Roll-away: the yard, 38 m flat to the Yard Bank.
* `P.spot('School Wall', 456, -20.31, 562, Math.PI, [420, 552, 498, 618])`.

### 4.8 S8 The Yard Bank and courts [west]

* The Yard Bank is ground: z 618..632, -23.0 → -25.4 (smoothstep, about 17° at its middle).
* Picnic tables `K.picnic` at (432, 598), (440, 598), (432, 608), (440, 608). A low ledge
  `K.ledge(470, 596, 486, 596.6)`.
* Court: paint lines with `K.dash(432, 636, 480, 636, 0xf0ece2, 0.15)` and the other three sides,
  and a centre line. Two hoops: `K.prop` posts at (434, 648) and (478, 648), 3 m.
* School building `K.building(424, 664, 488, 688, 3, 0xc9a27e, 'brick')`. It covers the pad's south
  hard edge.
* `P.spot('Yard Bank', 456, -23.0, 600, Math.PI, [424, 590, 488, 660])`.

### 4.9 S9 The Vista Stoops [west]

Six house stoops on the west side of Vista Street at z 316, 348, 380, 460, 492 and 524. For each z,
with `g = K.terrainH(396, z)`:

```js
K.B(392, g - 1, z - 3, 395, g + 0.75, z + 3, 'step', {edges: 'e'});
K.SET('x', 395, 1, z - 2.5, z + 2.5, g + 0.75, g, 3, 0.4);   // 3 steps down to the walk
K.rail(395.2, g + 1.33, z - 2.7, 396.3, g + 0.55, z - 2.7, 'Handrail', true);
```

You ride down Vista's west sidewalk and hit them one after another, every 32 m. The house behind each
is a `K.building(372, z - 7, 390, z + 7, 2)`.

### 4.10 S10 Back Lane [west]

A 6 m lane behind the Vista houses, x 337..343, z 300..832, at 6.15 %. Dumpsters every 40–60 m
alternating sides (`K.dumpster(345, z, false)`), two jerseys `K.jersey(344, 420, 344.8, 436)` and
`K.jersey(335.2, 610, 336, 626)`, and fences (`K.prop` 1.8 m) along x 332 and 348 between the yards.
No cars. It drops you onto Bayview Road at z 832.

### 4.11 S11 Pool Row [park]

Four backyard pools on Larch Lane, on level deck pads:
* `K.backyardPool(858, 333)` and `K.backyardPool(908, 333)` (pads at -6.15, north of the lane)
* `K.backyardPool(882, 387)` and `K.backyardPool(934, 387)` (pads at -9.47, south of the lane)

Each covers ±6 m, with lobes 2.2 / 2.8 deep and about 26 coping rails.
* Houses: `K.building(848, 300, 868, 314, 2)`, `K.building(898, 300, 918, 314, 2)` north;
  `K.building(872, 404, 892, 418, 2)`, `K.building(924, 404, 944, 418, 2)` south.
* Board fences (`K.prop` 1.6 m) between the yards, with 3 m gaps on the lane side.
* `P.spot('Pool Row', 840, -8.0, 360, -Math.PI / 2, [846, 320, 950, 400])`.

### 4.12 S12 Bayview Center walkway and Gravity Skate Supply [south]

* Three shop buildings along the north of the lot, over z 744..762:
  `K.building(690, 744, 724, 762, 1, 0xd8d2c4, 'office')`,
  `K.building(724, 744, 760, 762, 1, 0xd8d2c4, 'office')`,
  `K.building(760, 744, 802, 762, 1, 0xd8d2c4, 'office')`.
  They cover the pad's north hard edge.
* The raised walkway in front: `K.B(690, -33.6, 762, 802, -32.54, 766, 'sidewalk', {edges: 's'})`,
  about 0.4 over the lot. Its south edge is a 112 m ledge. Curb ramps at each end:
  `K.hubbas.push({a: V(690, -32.54, 764), b: V(686, K.terrainH(686, 764), 764), w: 4, noRails: true})`
  and the same from x 802 to 806.
* Gravity Skate Supply (section 7).
* Parking blocks: 12 `K.parkingBlock` in two rows at z 780 and 800, x 700..790 every 15 m.
  6 parked cars `K.car`. Planters `K.planter(694, 812, 702, 816)` and `K.planter(790, 812, 798, 816)`.
* `P.spot('Bayview Walkway', 694, -32.6, 770, -Math.PI / 2, [690, 760, 802, 770])`.

### 4.13 S13 The Bayview Ten [south]

The mall's south wall drops into Bayview Road.
* The wall: `K.B(690, -37.9, 820, 802, -34.26, 824, 'plaza', {edges: 's'})`. It covers the pad's
  south hard edge (natural at z 824 is -37.38, so the drop is about 3.1 m).
* Bayview Ten: `K.stairSpot('z', 824, 1, 740, 752, -34.26, -37.52, 10, 0.4, {rails: [740.45, 751.55]})`.
  Risers 0.326, run 3.6, ending at z 827.6 (ground -37.52).
* The Bayview Hubbas: `K.stairSpot('z', 824, 1, 770, 778, -34.26, -37.52, 10, 0.4, {hubbas: [769.6, 778.4]})`.
* Railing: `K.rail(692, -33.36, 822.6, 734, -33.36, 822.6, 'Rail', true)` and
  `K.rail(784, -33.36, 822.6, 800, -33.36, 822.6, 'Rail', true)`. It leaves x 736..782 open.
* Run-up: across the whole lot, 70 m south from the walkway at 2.3 %. Roll-away: Bayview Road (no
  traffic) and its far verge, 30 m.
* `P.spot('Bayview Ten', 746, -33.77, 800, Math.PI, [736, 790, 782, 846])`.

### 4.14 S14 The loading docks [south]

Behind the shops, in the alley between Mesa Street (walk to z 709) and the buildings (z 744):
* `K.loadingDock(700, 744, 724, -1)` and `K.loadingDock(736, 744, 760, -1)`: platforms at +1.3
  (-30.33), each with a ramp off its east end (x1 to x1 + 6) and a handrail.
* The 6 m between the first ramp's foot (730) and the second dock is clear.
* Dumpsters `K.dumpster(766, 738, true)`, `K.dumpster(772, 738, true)`.
* `P.spot('Bayview Docks', 690, -31.6, 738, -Math.PI / 2, [690, 728, 770, 744])`.

### 4.15 S15 Moonrise Drive-In [south]

A gravel lot on the natural 6.15 %, x 846..966, z 604..796, entered from Terrace Avenue and Crosstown's
east end.
* **Hump rows** at z = 624, 652, 680, 736 and 764. Each row is a pair of hubbas 0.8 high, x 856..956
  (w 100), centred at x 906:
  ```js
  const g = z => K.terrainH(906, z);
  K.hubbas.push({ a: V(906, g(zr - 4), zr - 4), b: V(906, g(zr) + 0.8, zr), w: 100, noRails: true, color: 0x93897a });
  K.hubbas.push({ a: V(906, g(zr) + 0.8, zr), b: V(906, g(zr + 5), zr + 5), w: 100, noRails: true, color: 0x93897a });
  ```
  Bombing south at 9–12 m/s, each one is a small launch.
* **The snack bar** `K.building(890, 700, 922, 716, 1, 0xe0d6c2, 'brick')`, roof at -25.52, with a
  roof ramp up its east side: `K.hubbas.push({a: V(921, -25.52, 708), b: V(933, -29.42, 708), w: 3, noRails: true, color: 0xa7a39a})`.
  The roof is 32 × 16: ride up the ramp, cross the roof, drop 3.4–4.4 m off the north or west edge.
* **The screen**: 4 legs `K.B(x, -35.5, 798, x + 2, -30.95, 800, 'garage')` at x 868, 888, 922 and 942,
  and the landmark (section 7).
* Ticket booth `K.building(848, 600, 852, 604, 1)` at the Crosstown entrance.
* Speaker posts (`K.prop` 0.15 × 1.3) every 8 m along each hump row, 3 m north of it.
* `P.spot('Moonrise Drive-In', 906, -23.38, 610, Math.PI, [846, 604, 966, 796])`.

---

## 5. Lines

1. **L1 Eastside Hill Bomb** (campus gate → hillbomb gate, 50–60 s). Campus Drive, carve the Crest
   Bend past the Lookout, the Spine's sidewalk curbs, over the bridge, the Plunge at 70 km/h, carve
   the Chute's banks and grind its coping, then run out to the gate.
2. **L2 Hillside to Bayview.** Orchard Street → the Orchard Bank into Hillside Park T1 → Park Six or
   Hubba Six → the kinked rail → the bowl → Park Steps → Crosstown east → Terrace Avenue south →
   into the drive-in over the humps → the snack bar roof → west on Mesa → the docks → the walkway
   ledge → Bayview Ten → the bomb's run-out → the gate.
3. **L3 Crosstown.** From the crosstown gate along the Cut → the School Wall or School Steps → the
   yard and the Yard Bank → out to Vista Street → the Vista Stoops (if you come down from the north)
   or Mesa W east → bollards → drop into the Chute → down the bomb to the gate.
4. **L4 Back Lane and Pool Row.** From Crest Road east to Terrace → Larch Lane and the four pools
   → Terrace south to the park; or Back Lane top to bottom, its jerseys and dumpsters, onto Bayview.

---

## 6. Skatepark: Hillside Park [park]

Three level concrete terraces, x 840..960, z 446..548, stepping down the hill.

| terrace | z | y |
|---|---|---|
| T1 | 446..476 (446..452 is the Orchard Bank) | -14.22 |
| T2 | 476..507 | -16.09 |
| T3 | 507..538 | -18.00 |
| forecourt | 538..548 | -20.16 |

**Edges and steps:**
* Edge walls at x 839..841 and 959..961, z 446..538, one box per terrace,
  top = max(terrace y, natural at the wall) + 0.45, edges toward the park. Gaps (no wall):
  z 458..464 (both sides, T1), 488..494 (west only, T2), 519..525 (both, T3). The T2 east wall is
  one box with top -14.09 (it backs the QP).
* Step boxes across the full width x 841..959: `K.B(841, -16.6, 474, 959, -14.22, 478, 'park', {edges: 's'})`
  and `K.B(841, -18.5, 505, 959, -16.09, 509, 'park', {edges: 's'})`. They cover the cuts at 476 and 507.
* Forecourt box: `K.B(839, -21, 536, 961, -18.0, 540, 'park', {edges: 's'})`.

**T1 (the flat):**
* Funbox `K.B(880, -14.62, 458, 900, -13.62, 468, 'pad', {edges: 'ns'})` with kickers
  `K.kicker(877.4, 463, 1, 0, 2.6, 0.6, 10)` and `K.kicker(902.6, 463, -1, 0, 2.6, 0.6, 10)`, and a
  flatbar on top `K.rail(882, -13.32, 463, 898, -13.32, 463, 'Rail', true)`.
* Manual pads `K.pad(848, 456, 868, 461)` and `K.pad(848, 466, 868, 471)`.
* Ledges `K.ledge(912, 456, 940, 456.6)` and `K.ledge(912, 467, 940, 467.6, 0.55)`.
* Flatbar `K.rail(950, -13.82, 455, 950, -13.82, 471, 'Rail', true)`.

**T1 → T2 (the six-stairs):**
* Park Six: `K.stairSpot('z', 478, 1, 852, 868, -14.22, -16.09, 6, 0.4, {rails: [852.45, 860, 867.55]})`.
* Park Bank: `K.hubbas.push({a: V(890, -14.22, 478), b: V(890, -16.07, 486), w: 14, noRails: true, color: 0xcdc8bc})`.
* Hubba Six: `K.stairSpot('z', 478, 1, 920, 932, -14.22, -16.09, 6, 0.4, {hubbas: [919.6, 932.4]})`.

**T2:**
* Pyramid: box `K.B(884, -16.6, 490, 896, -15.19, 498, 'park', {edges: 'nswe'})` with four 3 m banks
  (hubbas from its top edges down to T2: north to z 487, south to 501, west to x 881, east to 899).
  You roll off the Park Bank straight over it.
* Ledge `K.ledge(850, 494, 874, 494.6)`.
* **The QP** on the east side: `K.feat(948, 960, 482, 500, (x, z) => { const d = x - 948; return d < 2.97 ? 3.2 - Math.sqrt(10.24 - d * d) : 2.0; }, 'add')`
  (transition r 3.2, 2 m tall, deck 3 m), coping `K.rail(950.97, -14.09, 482, 950.97, -14.09, 500, 'Coping', false)`,
  cheeks `K.B(948, -16.6, 480, 961, -14.09, 482, 'park')` and `K.B(948, -16.6, 500, 961, -14.09, 502, 'park')`.
  Its region is `[944, 952, 480, 504, 0.5]`. Build the K.feat before the coping.

**T2 → T3:**
* **The kinked rail** at x 926.45: a flat piece on T2, `K.rail(926.45, -15.51, 503, 926.45, -15.51, 508.4, 'Handrail', true)`,
  then the stair's own handrail.
* Park Seven: `K.stairSpot('z', 509, 1, 926, 946, -16.09, -18.0, 6, 0.4, {rails: [926.45, 936, 945.55]})`.
  Run-up: off Hubba Six, 23 m straight south.
* T3 Bank: `K.hubbas.push({a: V(853, -16.09, 509), b: V(853, -17.98, 517), w: 14, noRails: true, color: 0xcdc8bc})`.

**T3 (the bowl):**
* `K.pool(866, 902, 512, 536, [[K.poolS.rect(884, 524, 15, 9, 4), 1.8]], -18.0)`: a 30 × 18 rounded
  bowl, 1.8 deep.
* Coping: 20 rail pieces around the rounded rect (corner centres x 873 / 895, z 519 / 529, r 4; 4 per
  corner and one per straight side), kind 'Coping', coping: true, pushed to `K.rails`.

**Forecourt and exits:**
* Park Steps: `K.stairSpot('z', 540, 1, 868, 884, -18.0, -20.16, 7, 0.4, {rails: [868.45, 876, 883.55]})`.
* Forecourt Hubbas: `K.stairSpot('z', 540, 1, 892, 900, -18.0, -20.16, 7, 0.4, {hubbas: [891.6, 900.4]})`.
* The forecourt meets Crosstown's north sidewalk flush (both -20.16).
* Benches on the forecourt, sign HILLSIDE PARK, 8 trees on the verges outside the walls.
* `P.travel('Hillside Park', 900, -14.22, 456, Math.PI, 'park')`.

---

## 7. Buildings and dressing

### Buildings (about 50 K.building)

* **The Spine frontage** [spine]: 10 two-storey houses on the bomb's flanks, set back 6 m from the
  walk (x 576..586 / 614..624 front lines on the straight), between Orchard and the Cut and between
  the Cut and Mesa. They sit on the slopes; K.building fills from groundMin - 1. None in the Chute.
* Crest Corner Skates `K.building(662, 294, 680, 316, 2, 0xc98f6b, 'brick')` [spine].
* **West** [west]: 6 Vista Stoops houses, 6 houses on Crest and Orchard between Vista and the Spine,
  the school, 4 Mesa W houses. 17 in all.
* **Park** [park]: 4 Pool Row houses, 6 houses on Crest, Orchard and Terrace east of the Spine.
* **South** [south]: 3 Bayview shops, the snack bar, the ticket booth, 4 Mesa E houses, 4 Bayview E
  houses (x 830..960, z 850..880), 2 Terrace S houses.

Houses: 12–20 m × 10–14 m, colours from the material table, `tex` alternating 'stone' / 'brick'.

### Signs (6 D.sign, all made-up names)

| text | at [x, y, z] | w × h | rotY | where | part |
|---|---|---|---|---|---|
| EASTSIDE HILLS | [588.75, -13.4, 560] | 20 × 1.6 | -π/2 | the bridge's west fascia, seen from Crosstown | spine |
| CREST LOOKOUT | [607, -2.0, 302.6] | 8 × 0.9 | π | on posts `K.prop(603, -3.75, 302.5, 603.2, -1.4, 302.7, 0x3a3d42)` and at x 611 | spine |
| LARKSPUR HILL SCHOOL | [456, -18.4, 663.95] | 18 × 1.8 | π | the school's north face, over the courts | west |
| HILLSIDE PARK | [926, -19.0, 540.06] | 12 × 1.2 | 0 | the forecourt box's south face | park |
| BAYVIEW CENTER | [810, -22.0, 827.06] | 11 × 2 | 0 | the pylon's south face, over Bayview Road | south |
| MOONRISE DRIVE-IN | [906, -16.4, 798.34] | 40 × 3 | π | across the top of the screen, facing the lot | south |

Shop signs come from P.shop and don't count.

### Skate shops (2)

**Crest Corner Skates** [spine]. On the outside of the Crest Bend, the door facing west onto the bomb's
east sidewalk. g = -2.58.

```js
P.shop({ name: 'Crest Corner Skates', sign: [661.96, g + 3.85, 305, -Math.PI / 2, 7],
  awning: [660.4, 299, 662, 311, g + 2.2, 'x'], zone: [658.8, 301, 661.8, 309], door: [661.8, g, 305] });
P.travel('Crest Corner Skates', 657, -2.6, 305, -Math.PI / 2, 'spot');
```

**Gravity Skate Supply** [south]. In the east shop of Bayview Center, the door on the walkway facing
south.

```js
P.shop({ name: 'Gravity Skate Supply', sign: [784, -32.54 + 3.85, 762.04, 0, 7],
  awning: [778, 762, 790, 763.6, -32.54 + 2.2], zone: [780, 762.2, 788, 765.2], door: [784, -32.54, 762.2] });
P.travel('Gravity Skate Supply', 784, -33.12, 772, 0, 'spot');
```

### Landmarks (P.landmark, 2)

**The Moonrise screen** [south]:

```js
{ at: [906, -34.95, 799], near: 160, parts: [
  {shape: 'box', at: [0, 12, 0], size: [80, 16, 1.2], color: 0xe8e4da},
  {shape: 'box', at: [0, 20.4, 0], size: [82, 0.8, 1.6], color: 0x2e3f5c},
  {shape: 'box', at: [-37, 2, 0.6], size: [2, 4, 2], color: 0x5d5f63},
  {shape: 'box', at: [-17, 2, 0.6], size: [2, 4, 2], color: 0x5d5f63},
  {shape: 'box', at: [17, 2, 0.6], size: [2, 4, 2], color: 0x5d5f63},
  {shape: 'box', at: [37, 2, 0.6], size: [2, 4, 2], color: 0x5d5f63}] }
```

The four K.B legs in 4.15 give it collision. From the Crest Lookout it is in plain sight 480 m down
the hill.

**The Bayview pylon** [south]:

```js
{ at: [810, -37.4, 825.5], near: 140, parts: [
  {shape: 'box', at: [0, 9, 0], size: [12, 18, 3], color: 0x2e3f5c},
  {shape: 'box', at: [0, 18.6, 0], size: [13, 1.2, 3.6], color: 0xd9b44a}] }
```

Collision: `K.B(804, -38, 824, 816, -33, 827, 'garage')`.

### Trees (about 160 `K.tree`)

* Crest, Orchard, Mesa and Bayview verges: every 18 m both sides, 3 m beyond the walk, about 90.
* Vista and Terrace: every 24 m on the house side, 40.
* Pool Row yards 8, Hillside Park verges 8, the school 6, the mall lot islands 4, the drive-in
  north edge 4.
* None within 3 m of a ledge or stair, in a run-up strip, a gate corridor or a band. None in the
  Chute or on the bomb's walks.

### Lamps (about 80 `K.lamp`)

* The bomb: both sides every 30 m (4.1), about 40.
* Crosstown in the Cut: every 30 m on both walks at |z-560| 11.5, x 330..900, skipping x 584..616,
  about 38. (The K.street has lamps: false.)
* The mall lot 4, the park forecourt 2.

### Furniture

Benches on the Lookout and the forecourt, picnic tables in the yard, trash cans at each shop door,
hydrants every 80 m on the cross streets, newsboxes at Crest Corner, bike racks at the school and
the mall.

---

## 8. Challenges (10, ids `east-`)

```js
{ id: 'east-bomb-speed', name: 'Hill Bomb', desc: 'Hit 62 km/h on the Plunge',
  at: [600, -15.7, 600], go: [650, -1.27, 252, Math.PI], kind: 'speed', speed: 62 / 3.6, area: [590, 600, 610, 760] },
{ id: 'east-bridge-rail', name: 'Bridge Steps Rail', desc: 'Grind a Bridge Steps handrail into the Cut',
  at: [623, -11.6, 526], go: [623, -10.32, 500, Math.PI], kind: 'grind', rail: 'Handrail', area: [616, 527, 630, 543] },
{ id: 'east-school-gap', name: 'School Wall', desc: 'Ollie off the School Wall into the yard',
  at: [456, -20.16, 577], go: [456, -20.31, 562, Math.PI], kind: 'gap', from: [420, 574, 498, 580, -20.5], to: [420, 584, 498, 618, -23.2, -22.5] },
{ id: 'east-park-score', name: 'Work Hillside', desc: 'Land a 3,000 point line in Hillside Park',
  at: [900, -14.22, 456], go: [900, -14.22, 452, Math.PI], kind: 'score', pts: 3000, area: [840, 446, 960, 548] },
{ id: 'east-bowl', name: 'Hillside Bowl', desc: 'Grind the bowl coping',
  at: [884, -18.0, 512], go: [884, -18.0, 510, Math.PI], kind: 'grind', rail: 'Coping', area: [866, 512, 902, 536] },
{ id: 'east-pool-row', name: 'Pool Row', desc: 'Grind a backyard pool on Larch Lane',
  at: [858, -6.15, 333], go: [858, -8.0, 360, 0], kind: 'grind', rail: 'Coping', area: [846, 320, 950, 400] },
{ id: 'east-walkway', name: 'Walkway Ledge', desc: 'Grind the Bayview Center walkway',
  at: [746, -32.54, 766], go: [694, -32.6, 770, -Math.PI / 2], kind: 'grind', rail: 'Ledge', area: [690, 761, 802, 767] },
// hard
{ id: 'east-bomb-hard', hard: true, name: 'Terminal Velocity', desc: 'Hit 70 km/h on the Hill Bomb',
  at: [600, -31.7, 720], go: [650, -1.27, 252, Math.PI], kind: 'speed', speed: 70 / 3.6, area: [590, 600, 610, 760] },
{ id: 'east-bayview-kf', hard: true, name: 'Kickflip the Bayview Ten', desc: 'Kickflip the whole ten into Bayview Road',
  at: [746, -34.26, 822], go: [746, -33.77, 800, Math.PI], kind: 'trick', tricks: ['Kickflip'], from: [740, 820, 752, 824, -34.6], to: [736, 828, 756, 846, -38, -37] },
{ id: 'east-chute-line', hard: true, name: 'Run the Chute', desc: 'Two grinds in one line through the Chute, 2,500 points or more',
  at: [600, -29.2, 700], go: [600, -21.1, 640, Math.PI], kind: 'line', pts: 2500, area: [580, 696, 620, 830], need: [['grind', 2]] },
```

* Gold speed (62) is reachable from Orchard or below; 70 needs the full run from the gate and a tuck
  line (the simulated peak is 70.8).
* Who registers each: spine takes bomb-speed, bridge-rail, bomb-hard and chute-line; west takes
  school-gap; park takes park-score, bowl and pool-row; south takes walkway and bayview-kf.

---

## 9. Tapes (5)

| # | where | P.tape(x, z, y) | part |
|---|---|---|---|
| 1 | under the bridge, on the south walk by the abutment | (611, 570, -20.31) | spine |
| 2 | at the bottom of Pool D's deep end | (934, 389, -12.27) | park |
| 3 | on the snack bar roof | (906, 708, -25.52) | south |
| 4 | behind the telescope on the Lookout | (616, 324, -3.75) | spine |
| 5 | on the first loading dock | (712, 742.5, -30.33) | south |

---

## 10. Traffic, peds and npcs [index.js]

**Traffic.** No car route crosses the bomb: Crosstown passes under it, and Vista and Terrace stop
short of Crest and Bayview.

```js
P.traffic({ path: [[340, 560], [900, 560]], lane: 3.2, dir: 1, n: 3, speed: 10, r: 8 });
P.traffic({ path: [[340, 560], [900, 560]], lane: 3.2, dir: -1, n: 3, speed: 10, r: 8 });
P.traffic({ path: [[410, 290], [410, 830]], lane: 2.6, dir: 1, n: 2, speed: 9, r: 8 });
P.traffic({ path: [[820, 290], [820, 830]], lane: 2.6, dir: -1, n: 2, speed: 9, r: 8 });
```

**Peds:**
* the mall walkway: `{path: [[692, 764], [800, 764]], n: 6}`
* Crosstown's sidewalks: `{path: [[420, 550], [880, 550], [880, 570], [420, 570]], n: 8}`
* the schoolyard: `{path: [[430, 590], [484, 590], [484, 612], [430, 612]], n: 5}`
* the park forecourt: `{path: [[850, 544], [904, 544]], n: 3}`

**Skaters.** These have the same meaning as in dt.js.

Sessions:
* the T1 ledge: `{kind: 'session', rail: [912, 456.3, 940, 456.3], start: 906, end: 946, back: 3.4, side: 1, speed: 5}`
* the walkway ledge: `{kind: 'session', rail: [700, 766, 740, 766], start: 694, end: 746, back: 3.4, side: 1, speed: 5}`

Loops:
* the mall lot: `{kind: 'loop', path: [[700, 772], [792, 772], [792, 812], [700, 812]], speed: 6}`
* Hillside T1: `{kind: 'loop', path: [[846, 453], [954, 453], [954, 472], [846, 472]], speed: 6}`

---

## 11. Fast travel

| kind | name | at (x, y, z) | yaw | who |
|---|---|---|---|---|
| district | Eastside Hills | 610, -3.75, 318 | π (from the Lookout, looking down the bomb at the screen) | index.js |
| park | Hillside Park | 900, -14.22, 456 | π | park |
| spot | Hill Bomb | 650, -1.2, 252 | π (at the gate, facing down) | spine |
| spot | Crosstown Bridge | 540, -20.31, 560 | -π/2 (in the Cut, facing the bridge) | spine |
| spot | Bayview Center | 746, -33.77, 800 | π (facing the Bayview Ten) | south |
| spot | Moonrise Drive-In | 906, -23.38, 610 | π | south |
| spot | Crest Corner Skates | 657, -2.6, 305 | -π/2 | spine |
| spot | Gravity Skate Supply | 784, -33.12, 772 | 0 | south |

---

## 12. Budget estimate

| | estimate | budget |
|---|---|---|
| boxes | ~410 (Cut walls ~34, stairs ~110, park ~40, stoops ~24, mall ~30, legs and booths ~10, ledges / pads / planters / benches / picnic ~60, jerseys / dumpsters / parking blocks ~40, buildings ~50) | 900 |
| grind lines | ~520 (bomb curbs 76, Chute coping 28, pool copings ~104, bowl 20, handrails ~40, box edges ~250) | 700 |
| buildings | ~50 | 70 |
| D.sign | 6 | 8 |
| fine ground | ~53,700 m² (52,288 regions + ~1,400 pools) | 60,000 |
| triangles | ~200k (~64k fine regions, ~39k res-4 blocks, 50 buildings, 160 trees, 80 lamps, 2 landmarks) | 450k |

---

## 13. Parts

Files in `levels/porto/east/`. The splice order is by name, with `index.js` last. All part functions
are called from index.js.

| file | fn | rect [x0, x1, z0, z1] | owns |
|---|---|---|---|
| `east_plan.js` | `east_plan()`, `east_walk()` | — | everything in 2.1–2.4 |
| `east_spine.js` | `east_spine(K, P, PL)` | 560, 680, 230, 910 | the Hill Bomb and everything on it |
| `east_west.js` | `east_west(K, P, PL)` | 300, 560, 230, 910 | west of the Spine |
| `east_park.js` | `east_park(K, P, PL)` | 680, 1000, 230, 580 | Hillside Park, Pool Row, the north-east |
| `east_south.js` | `east_south(K, P, PL)` | 680, 1000, 580, 910 | Bayview Center, Moonrise, the south-east |

### east_spine

* The Crosstown K.street for its full length, x 316..910, and the flush paint x 300..316. This is the
  one exception to the rects: one street, one call.
* S1 (bomb walks, curbs, dashes, lamps), S2, S3 (abutments, deck, parapets, fascias, Cut walls
  x 560..680), S4, S5, S6.
* Crest Corner Skates and its shop; the EASTSIDE HILLS and CREST LOOKOUT signs.
* The Spine frontage houses, trees and lamps in its rect; Crosstown lamps for x 560..680.
* Tapes 1 and 4. Challenges bomb-speed, bridge-rail, bomb-hard, chute-line.
* Travel spots Hill Bomb, Crosstown Bridge, Crest Corner Skates.

### east_west

* Cut walls x 464..560 (north) and 496..560 (south).
* S7–S10: the school terrace, School Steps, School Hubba, yard, Yard Bank, courts and building; the
  Vista Stoops and their houses; Back Lane.
* Mesa W's bollards at x 576 are spine's; west builds Mesa W's dash, trees and houses.
* Dashes for Crest, Orchard, Mesa W and Bayview at x < 560, and for Vista.
* LARKSPUR HILL SCHOOL sign. Challenge school-gap.
* Crosstown lamps for x < 560.

### east_park

* Cut walls x 680..735.
* Section 6 (Hillside Park), in this order: step boxes and walls, T1, T1→T2 stairs, the QP K.feat
  then its coping, the pyramid, T2→T3 stairs and kinked rail, the bowl K.pool then its coping, the
  forecourt.
* S11 Pool Row, Larch Lane, the Crest / Orchard / Terrace houses in its rect.
* Dashes for Crest and Orchard at x ≥ 680, and for Terrace at z < 580.
* HILLSIDE PARK sign. Tape 2. Challenges park-score, bowl, pool-row. Travel 'Hillside Park'.
* Crosstown lamps for x ≥ 680.

### east_south

* S12–S15: the shops, walkway, Gravity Skate Supply, the lot, the wall, Bayview Ten, the hubbas,
  the railing, the docks; the drive-in humps, snack bar and ramp, screen legs, ticket booth and
  speaker posts.
* The two landmarks and the pylon's collision box; BAYVIEW CENTER and MOONRISE DRIVE-IN signs.
* Mesa E (dash, houses), Bayview Road east of x 680 (dash, houses), Terrace at z ≥ 580.
* Tapes 3 and 5. Challenges walkway and bayview-kf. Travel spots Bayview Center, Moonrise
  Drive-In, Gravity Skate Supply.

### `index.js` (`porto_east`), in this order

1. `const PL = east_plan(); P.ground(PL.ground); P.col(PL.col); P.surface(PL.surface);`
2. `for (const r of PL.REGIONS) P.region(...r);`
3. `east_spine(K, P, PL); east_west(K, P, PL); east_park(K, P, PL); east_south(K, P, PL);`
4. traffic, peds and npcs (10)
5. `P.travel('Eastside Hills', 610, -3.75, 318, Math.PI, 'district')`

The order matters: the parts read K.terrainH, so the ground must exist first. Inside the parts, put
every K.feat and K.pool before the rails that sit on it.

---

## 14. Phone rules (checklist for builders)

* **Downhill streets.** The Hill Bomb is 2–5 % except the **Plunge** (z 584..720, 13.5 %). That is
  deliberate: it is the district's one big bomb, straight, wide (14 m road), with nothing in it and
  a 110 m run-out through the Chute. Vista, Terrace and Back Lane are 6.15 %, a little over the 6 %
  guide, because they follow the base. Every cross street is dead level.
* **Curbs.** The bomb's sidewalks are 0.15 hubbas with a 'Curb' line; the K.street's are 0.15
  boxes with ramps at crossings. Everything else is flush. Pads and kerbs are ≤ 0.3.
* **Ledges** are 0.45 (the Cut walls, the Lookout ledge, the park ledges). Handrails sit 0.58 over
  the top nosing (stairSpot's own).
* **Run-ups** ≥ 30 m at every big drop: Bridge Steps 84 m, School Wall 150 m along Crosstown,
  Bayview Ten 70 m, Park Six / Hubba Six 25 m of T1 plus the Orchard Bank, Park Seven 23 m.
  **Roll-aways** ≥ 15 m except the Bridge Steps (5.6 m of floor, then the whole street) and the
  Park Steps (5.6 m of forecourt, then the street).
* **Sightlines.** From the campus gate you see straight down Campus Drive to the bend; from the
  Lookout you see the whole bomb, the bridge, the Chute and the screen. From Crosstown you see the
  bridge and its sign at both ends of the Cut.
* **Made-up names only**: Eastside Hills, Porto Alto, Crest / Orchard / Crosstown / Mesa / Bayview /
  Vista / Terrace / Back / Larch, Larkspur Hill School, Hillside Park, Bayview Center, Moonrise
  Drive-In, Crest Corner Skates, Gravity Skate Supply.
* **Nothing over 0.3 m in a gate corridor.** No K.feat, pool or hump in a band. No tree or lamp in
  x 300..316 or z 230..246 / 894..910 on the corridors.

**Check with:**

```
--rides '[["bomb",[650,-0.6,234],[0,0,12],5,"push"],["plunge",[600,-13.8,584],[0,0,10],5,"push"],["crosstown",[302,-20.3,560],[8,0,0],8,"push"]]'
```

and the sink scan.

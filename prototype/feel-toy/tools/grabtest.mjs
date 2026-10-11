// Grab tests: grab mode (double tap the steering thumb and keep it down, in the air) and the trick
// thumb picking the grab, plus the things grabs must not change (revert, grind setup).
//   node tools/grabtest.mjs [path/to/index.html]
// Touch is simulated with pointer events on the canvas, as a phone sends them.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HTML = resolve(process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html'));
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await (await b.newContext({ viewport: { width: 568, height: 320 }, hasTouch: true, isMobile: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + HTML + '?level=block'); await p.waitForFunction(() => window.__toy);
await p.evaluate(() => document.getElementById('intro').dispatchEvent(new MouseEvent('click'))); await p.waitForTimeout(1500);

// in-page helpers: touch on either half of the screen, and putting the skater in the air
await p.evaluate(() => {
  const el = document.getElementById('view'), sleep = ms => new Promise(r => setTimeout(r, ms));
  const ev = (type, id, x, y) => el.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, cancelable: true }));
  const L = [110, 220], R = [458, 220], RAD = 55;
  const DIRS = { R: [1, 0], UR: [0.71, -0.71], U: [0, -1], UL: [-0.71, -0.71], L: [-1, 0], DL: [-0.71, 0.71], D: [0, 1], DR: [0.71, 0.71] };
  const { S, T, respawn } = __toy;
  window.__gt = {
    sleep, ev, L, R, RAD, DIRS,
    // rolling along -z (yaw 0), regular, or fakie (board turned round, same travel)
    setup(fakie = false) {
      T.autoPush = false; T.gravity = 14; respawn();
      S.pos.set(2, 0, 8); S.yaw = fakie ? Math.PI : 0; S.vel.set(0, 0, -4);
      document.getElementById('stick-label').textContent = '';
    },
    // in the air with plenty of hang time (low gravity), well clear of the rails
    air(fakie = false, vy = 3) {
      this.setup(fakie); T.gravity = 3;
      Object.assign(S, { grounded: false, sinceGround: 1, airTime: 0, popped: true, spin: 0, coyoteOk: false, takeoffY: S.pos.y });
      S.pos.y += 0.4; S.vel.y = vy; S.fakieTakeoff = fakie;
    },
    // double tap the left thumb and keep the second touch down
    // taps are timed with a busy wait, so a slow frame can't stretch a tap past the tap and double-tap limits
    wait(ms) { const t = performance.now(); while (performance.now() - t < ms); },
    async grabDown(id = 1) { ev('pointerdown', id, ...L); this.wait(50); ev('pointerup', id, ...L); this.wait(60); ev('pointerdown', id + 1, ...L); },
    doubleTap() { ev('pointerdown', 1, ...L); this.wait(60); ev('pointerup', 1, ...L); this.wait(80); ev('pointerdown', 2, ...L); this.wait(60); ev('pointerup', 2, ...L); },
    // the trick thumb, held in a direction (or moved there if already down)
    trick(dir, id = 20, down = true) { if (down) ev('pointerdown', id, ...R); const d = DIRS[dir]; ev('pointermove', id, R[0] + d[0] * RAD * 0.9, R[1] + d[1] * RAD * 0.9); },
    async landed(max = 4000) { return this.until(() => S.grounded, max); },
    // the game steps at most 0.1 s per frame, so on a slow (software-rendered) page game time runs
    // behind the clock: wait on the game's state, not on wall time
    async until(cond, max = 6000) { const t0 = performance.now(); while (!cond() && performance.now() - t0 < max) await sleep(10); return !!cond(); },
    // hold the current grab this long in game time
    async hold(t) { return this.until(() => S.grabSeg >= t); },
    combo: () => __toy.comboText(),
    pts: () => document.querySelector('#combo .pts').textContent,
    banked() { return this.until(() => document.getElementById('combo').className === 'landed'); },
  };
});

let pass = 0, total = 0;
const check = (ok, what, got) => { total++; if (ok) pass++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}${got !== undefined ? '  ->  ' + JSON.stringify(got) : ''}`); };
const cool = () => p.waitForTimeout(300);

// 1. each direction, and none, scores the right grab (regular stance: right is the toe side)
const MAP = { R: 'Indy', L: 'Melon', U: 'Nosegrab', D: 'Tailgrab', UR: 'Mute', DL: 'Stalefish', DR: 'Crail', UL: 'Method', none: 'Indy' };
for (const [dir, want] of Object.entries(MAP)) {
  await cool();
  const got = await p.evaluate(async dir => {
    const g = __gt, { S } = __toy; g.air(); await g.grabDown();
    if (dir !== 'none') g.trick(dir);
    const grabbing = await g.until(() => S.grabT > 0); await g.sleep(30); const live = g.combo();
    await g.hold(0.3);
    g.ev('pointerup', 2, ...g.L); await g.sleep(30);                // let go of the grab
    const scored = g.combo();
    if (dir !== 'none') g.ev('pointerup', 20, g.R[0], g.R[1]);
    await g.landed(); await g.banked();
    return { live, grabbing, scored, banked: g.combo(), pts: g.pts() };
  }, dir);
  check(got.grabbing && got.live === want && got.scored === want && got.banked === want && !/Sketchy/.test(got.pts), `grab ${dir.padEnd(4)} = ${want}`, got);
}

// 2. fakie: toe and heel turn round with you (stick right is now the heel side)
await cool();
{ const got = await p.evaluate(async () => { const g = __gt; g.air(true); await g.grabDown(); g.trick('R'); await g.until(() => __toy.S.grabT > 0); await g.hold(0.25);
    g.ev('pointerup', 2, ...g.L); await g.sleep(30); const scored = g.combo(); g.ev('pointerup', 20, ...g.R); await g.landed(); return scored; });
  check(got === 'Melon', 'fakie: stick right is Melon', got); }

// 3. a mid-air change scores both, joined ("Indy to Melon"); held 0.6 s it's a "Long" grab
await cool();
{ const got = await p.evaluate(async () => { const g = __gt, { S } = __toy; g.air(); await g.grabDown(); g.trick('R'); await g.until(() => S.grabT > 0); await g.hold(0.25);
    g.trick('L', 20, false); await g.until(() => S.grabName === 'Melon'); await g.hold(0.7); await g.sleep(30); const live = g.combo();
    g.ev('pointerup', 2, ...g.L); await g.sleep(30); const scored = g.combo(); g.ev('pointerup', 20, ...g.R); await g.landed(); await g.banked(); return { live, scored, banked: g.combo() }; });
  check(got.scored === 'Indy to Long Melon' && got.live === 'Indy to Long Melon' && got.banked === 'Indy to Long Melon', 'mid-air change: Indy to Long Melon', got); }

// 4. a brush through another direction (under 0.12 s) doesn't count
await cool();
{ const got = await p.evaluate(async () => { const g = __gt, { S } = __toy; g.air(); await g.grabDown(); g.trick('R'); await g.until(() => S.grabT > 0); await g.hold(0.25);
    g.trick('UR', 20, false); await g.sleep(30); g.trick('U', 20, false); await g.until(() => S.grabName === 'Nosegrab'); await g.hold(0.2);
    g.ev('pointerup', 2, ...g.L); await g.sleep(30); const scored = g.combo(); g.ev('pointerup', 20, ...g.R); await g.landed(); return scored; });
  check(got === 'Indy to Nosegrab', 'brushing past Mute on the way to Nosegrab', got); }

// 5. still holding at landing: sketchy
await cool();
{ const got = await p.evaluate(async () => { const g = __gt; g.air(false, 1); await g.grabDown(); g.trick('L'); await g.landed(); await g.banked();
    const r = { banked: g.combo(), pts: g.pts() }; g.ev('pointerup', 2, ...g.L); g.ev('pointerup', 20, ...g.R); return r; });
  check(/^(Long )?Melon$/.test(got.banked) && /Sketchy/.test(got.pts), 'held through the landing is sketchy', got); }

// 6. grabbing while spinning: the held left thumb still spins you
await cool();
{ const got = await p.evaluate(async () => { const g = __gt, { S } = __toy; g.air(false, 4); await g.grabDown(); g.trick('L'); await g.until(() => S.grabT > 0); g.ev('pointermove', 2, g.L[0] + 50, g.L[1]);  // slide the held thumb right: spin
    const t0 = performance.now(); while (Math.abs(S.spin) < 3 * Math.PI - 0.5 && performance.now() - t0 < 8000) await g.sleep(10);
    g.ev('pointermove', 2, ...g.L); await g.sleep(20); const spin = S.spin;
    g.ev('pointerup', 2, ...g.L); await g.sleep(30); g.ev('pointerup', 20, ...g.R);
    await g.landed(8000); await g.sleep(30); return { spin: +(spin * 57.3).toFixed(0), landed: g.combo() }; });
  check(/^(Long )?Melon \+ \d+ Spin$/.test(got.landed) && Math.abs(got.spin) > 450, 'grab while spinning (540 Melon)', got); }

// 7. a double tap on the ground still reverts, and never grabs
await cool();
{ const got = await p.evaluate(async () => { const g = __gt, { S, T } = __toy; g.setup(); T.gravity = 14; await g.sleep(200); const y0 = S.yaw;
    g.doubleTap(); await g.sleep(100); await g.until(() => Math.abs(Math.atan2(Math.sin(S.yaw - y0), Math.cos(S.yaw - y0))) > 3, 1500); return { turned: +(Math.abs(Math.atan2(Math.sin(S.yaw - y0), Math.cos(S.yaw - y0))) * 57.3).toFixed(0), grabT: S.grabT, g: S.grounded }; });
  check(got.turned > 170 && got.g, 'double tap on the ground reverts', got); }

// 8. a double tap kept down on the ground, then a pop: that's a grab ("tap as you pop")
await cool();
{ const got = await p.evaluate(async () => { const g = __gt, { S, T } = __toy; g.setup(); await g.sleep(150); await g.grabDown(); await g.sleep(100);
    const onGround = S.grabT; T.gravity = 3; Object.assign(S, { grounded: false, sinceGround: 1, popped: true, airTime: 0, takeoffY: S.pos.y }); S.pos.y += 0.3; S.vel.y = 3;
    g.trick('D'); await g.until(() => S.grabT > 0); await g.hold(0.25); g.ev('pointerup', 2, ...g.L); await g.sleep(30); const scored = g.combo(); g.ev('pointerup', 20, ...g.R); await g.landed(); return { onGround, scored }; });
  check(got.onGround === 0 && got.scored === 'Tailgrab', 'double tap on the ground held into the pop grabs', got); }

// 9. without grab mode, holding the trick stick in the air still lines up a grind on a rail
//    (the flat rail at x 10..22, y 0.42, z -4, running along +x)
const railRun = grab => p.evaluate(async grab => {
  const g = __gt, { S, T, respawn } = __toy; g.setup(); T.gravity = 3;
  S.pos.set(13, 1.3, -4); S.yaw = -Math.PI / 2; S.vel.set(5, 0, 0);
  Object.assign(S, { grounded: false, sinceGround: 1, airTime: 0, popped: true, spin: 0, coyoteOk: false, takeoffY: 0.42, railCool: 0 });
  if (grab) await g.grabDown(); g.trick('R');
  let maxGrab = 0; const t0 = performance.now(); while (!S.rail && performance.now() - t0 < 8000) { maxGrab = Math.max(maxGrab, S.grabT); await g.sleep(10); }
  const r = { rail: S.rail && S.rail.kind, grind: S.grindName, grindKey: S.grindKey, maxGrab: +maxGrab.toFixed(2), grabT: S.grabT, combo: g.combo() };
  g.ev('pointerup', 20, ...g.R); if (grab) g.ev('pointerup', 2, ...g.L); await g.sleep(300); respawn(); return r;
}, grab);
await cool();
{ const got = await railRun(false);
  check(got.rail === 'Rail' && got.grindKey === 'R' && got.maxGrab === 0, 'no grab mode: stick right lines up a lipslide', got); }
// 10. ...and in grab mode the same stick grabs, and reaching the rail ends the grab
await cool();
{ const got = await railRun(true);
  check(got.rail === 'Rail' && got.maxGrab > 0.12 && got.grabT === 0 && /^Indy/.test(got.combo), 'grab mode: reaching the rail ends the grab', got); }

// 11. no late flips while grabbing; with the grab let go, the same motion is a late flip
await cool();
{ const got = await p.evaluate(async () => { const g = __gt, { S } = __toy, label = () => document.getElementById('stick-label').textContent;
    g.air(); await g.grabDown(); await g.until(() => S.grabT > 0);
    const flick = async id => { g.ev('pointerdown', id, ...g.R); await g.sleep(25); g.trick('D', id, false); await g.sleep(25); g.ev('pointermove', id, ...g.R); await g.sleep(25); g.trick('UL', id, false); await g.sleep(25); g.ev('pointerup', id, ...g.R); };
    await flick(30); await g.sleep(300); const during = { label: label(), trick: S.trick && S.trick.name, grabbing: S.grabT > 0 };
    g.ev('pointerup', 2, ...g.L); await g.sleep(250); await flick(31); await g.until(() => S.trick); const after = { label: label(), trick: S.trick && S.trick.name }; await g.landed(); return { during, after }; });
  check(!got.during.label && !got.during.trick && got.during.grabbing && got.after.trick === 'Kickflip', 'no late flip mid-grab; a late flip once let go', got); }

// 12. keyboard: hold G, the arrows pick the grab
await cool();
await p.evaluate(() => __gt.air());
await p.keyboard.down('KeyG'); await p.keyboard.down('ArrowUp'); await p.evaluate(async () => { await __gt.until(() => __toy.S.grabT > 0); await __gt.hold(0.25); });
const kLive = await p.evaluate(() => __gt.combo());
await p.keyboard.up('KeyG'); await p.waitForTimeout(50); await p.keyboard.up('ArrowUp');
const kGot = await p.evaluate(() => __gt.combo());
check(kLive === 'Nosegrab' && kGot === 'Nosegrab', 'keyboard: G + up arrow is a Nosegrab', { kLive, kGot });
await p.evaluate(() => __gt.landed());

// 13. the grab shows on the skater: the board comes up and the hand reaches it, and the replay keeps it
await cool();
{ const got = await p.evaluate(async () => { const g = __gt, { S, PLAYER, RP } = __toy; g.air(); await g.grabDown(); g.trick('R'); await g.until(() => S.grabT > 0); await g.hold(0.4);
    const bf = PLAYER.boardFlip, lift = bf.position.y, roll = bf.rotation.z;
    PLAYER.skater.updateMatrixWorld(true);
    const hand = PLAYER.LIMBS.back.fore.getWorldPosition(new __toy.THREE.Vector3()), board = bf.getWorldPosition(new __toy.THREE.Vector3());
    const recorded = RP.frames.slice(-10).some(f => Math.abs(f.data[RP.nodes.indexOf(bf) * 10 + 1] - lift) < 0.05);
    g.ev('pointerup', 2, ...g.L); g.ev('pointerup', 20, ...g.R); await g.landed();
    return { lift: +lift.toFixed(2), roll: +roll.toFixed(2), handToBoard: +hand.distanceTo(board).toFixed(2), recorded }; });
  check(got.lift > 0.25 && got.roll > 0.1 && got.handToBoard < 0.45 && got.recorded, 'pose: board up, tweaked, in reach of the hand; recorded for the replay', got); }

console.log(`${pass}/${total} passed`, errs.length ? errs : '');
await b.close();
process.exit(pass === total && !errs.length ? 0 : 1);

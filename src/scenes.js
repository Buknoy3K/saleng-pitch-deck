// One builder per illustrated slide. Each returns { scene, camera, tick(t, since), onStep?(n) }.
import { THREE, C, ground, mesh, box, cyl, ico, roof, person, fire, clock, glasses, makeScene, keyLight, sway, Stage3D } from './kit.js';

const ease = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
const rand = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

function room(scene, { floor = 0x24302a, back = C.pine, side = 0x163a29, w = 7, d = 7, h = 5 } = {}) {
  scene.add(box(w, .3, d, floor, 0, -.3, 0));
  scene.add(box(w, h, .3, back, 0, 0, -d / 2));
  scene.add(box(.3, h, d, side, -w / 2, 0, 0));
}

const builders = {
  // 0 · Title: a bonfire with people sitting around it
  bonfire() {
    const S = makeScene({ cam: [10, 7, 10], look: [0, 1.1, 0], zoom: 4.6, hemi: .6 }); const { scene } = S;
    keyLight(scene, 0x8fa6d8, .35, [-6, 10, 4], 10);
    scene.add(ground(C.bg));
    scene.add(cyl(4.2, 4.4, .06, 14, 0x2a241c, 0, -.05, 0)); // clearing
    for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; scene.add(ico(.22, C.grey, Math.cos(a) * 1.15, .08, Math.sin(a) * 1.15, 0)); } // stone ring
    const f = fire(1.1, 7); scene.add(f);
    // pines around the back of the clearing
    for (let i = 0; i < 14; i++) {
      const a = Math.PI * .55 + (i / 13) * Math.PI * 1.4, r = 5 + rand() * 1.5, h = 1.8 + rand() * 1.6;
      const tr = mesh(new THREE.ConeGeometry(.6 + rand() * .3, h, 5), [C.pine, 0x1f4a32][i % 2]); tr.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r); scene.add(tr);
    }
    // people on logs, facing the fire
    const looks = [
      { shirt: C.ember, bun: true }, { shirt: C.resin, skin: C.skin2 }, { shirt: C.fog },
      { shirt: C.pine2, bun: true, skin: C.skin2 }, { shirt: 0x4a7fb5 }, { shirt: C.fog, skin: C.skin2 },
    ];
    const people = looks.map((o, i) => {
      const a = (i / looks.length) * Math.PI * 2 + .5, r = 2.5, x = Math.cos(a) * r, z = Math.sin(a) * r;
      const yaw = Math.atan2(-x, -z);
      const log = mesh(new THREE.CylinderGeometry(.22, .22, 1.1, 7), i % 2 ? C.wood : C.dark); log.rotation.z = Math.PI / 2;
      const lg = new THREE.Group(); lg.position.set(x, .22, z); lg.rotation.y = yaw; lg.add(log); scene.add(lg);
      const p = person({ ...o, seated: true }); p.position.set(x, .4, z); p.rotation.y = yaw; scene.add(p);
      // thighs + shins so they read as sitting
      [-.14, .14].forEach((dx) => { p.add(box(.22, .2, .6, C.night, dx, 0, .3)); p.add(box(.2, .5, .2, C.night, dx, -.45, .55)); });
      p.userData.armR.rotation.set(-.9, 0, .1); p.userData.armL.rotation.set(-.9, 0, -.1); // hands out to the fire
      return p;
    });
    return { ...S, tick(t) {
      f.userData.tick(t);
      people.forEach((p, i) => {
        const k = t / 1400 + i * 1.7;
        p.userData.head.rotation.x = Math.sin(k) * .08; p.userData.head.rotation.z = Math.sin(k * .6) * .1;
        p.userData.armR.rotation.x = -.9 + Math.sin(k * 1.3) * .08; p.userData.armL.rotation.x = -.9 + Math.cos(k * 1.1) * .08;
      });
      sway(S.camera, t, .5, 4000);
    } };
  },

  // 1 · Seoul: owner at home, orders arriving on her phone
  seoul() {
    const S = makeScene({ cam: [10, 9, 10], look: [0, 1.6, 0], zoom: 5.2 }); const { scene } = S;
    keyLight(scene, 0xaec4ff, .9, [-4, 8, 6]);
    room(scene);
    scene.add(box(3, 2.2, .1, 0x0b0f0c, .4, 2.1, -3.3));
    for (let i = 0; i < 7; i++) { const h = .4 + rand() * 1.2; scene.add(box(.3, h, .05, 0x2a5a40, -.8 + i * .4, 2.1, -3.22)); if (rand() > .4) scene.add(box(.08, .08, .02, C.resin, -.8 + i * .4, 2.1 + h * .6, -3.18, .9)); }
    scene.add(box(3.2, .12, .4, C.fog, .4, 2, -3.2));
    const ck = clock(.45); ck.position.set(-2.5, 3.6, -3.32); scene.add(ck); ck.userData.set(6 + 43 / 60);
    scene.add(box(3.6, .7, 1.4, C.ember, 0, 0, -1.6)); scene.add(box(3.6, 1.1, .4, 0xa51c28, 0, .5, -2.4));
    scene.add(box(.4, 1, 1.4, 0xa51c28, -1.8, 0, -1.6)); scene.add(box(.4, 1, 1.4, 0xa51c28, 1.8, 0, -1.6));
    const p = person({ shirt: C.fog, bun: true, seated: true }); p.position.set(.3, .7, -1.6); scene.add(p);
    p.userData.armR.rotation.set(-1.3, 0, -.5);
    const phone = box(.32, .56, .05, C.night, .62, 1.62, -1.05); phone.rotation.x = -.5; scene.add(phone);
    const screen = box(.26, .48, .02, C.resin, .62, 1.63, -1.02, 1.2); screen.rotation.x = -.5; scene.add(screen);
    scene.add(box(.08, 2.6, .08, C.night, 2.6, 0, -2.6));
    const shade = mesh(new THREE.CylinderGeometry(.25, .5, .5, 6, 1, true), C.resin, .6); shade.position.set(2.6, 2.75, -2.6); scene.add(shade);
    const warm = new THREE.PointLight(0xffb347, 18, 9, 1.6); warm.position.set(2.4, 2.4, -2.2); warm.castShadow = true; scene.add(warm);
    scene.add(box(1.6, .5, .9, 0x6b4a2b, -1, 0, .4)); scene.add(box(.22, .26, .22, C.white, -1.3, .5, .4));
    const cards = [];
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group();
      g.add(box(1.3, .4, .05, C.white, 0, -.2, 0, .25));
      g.add(box(.18, .18, .06, [C.ember, C.resin, C.pine2, C.ember][i], -.45, -.09, .02, .5));
      g.add(box(.7, .07, .06, 0x9aa094, .12, .02, .02)); g.add(box(.5, .07, .06, 0xc8ccc2, .02, -.12, .02));
      g.rotation.y = Math.PI / 4; scene.add(g); cards.push(g);
    }
    return { ...S, tick(t) {
      cards.forEach((g, i) => { const k = ((t / 6000) + i / 4) % 1; g.position.set(.4 - k * 2, 2.1 + k * 2.6, -.9 + k * 2); const s = Math.min(1, k * 8) * (k > .85 ? (1 - k) / .15 : 1); g.scale.setScalar(Math.max(s, .001)); });
      screen.material.emissiveIntensity = 1 + Math.sin(t / 200) * .4;
      ck.userData.set(6 + 43 / 60 + (t / 1000) / 3600);
      sway(S.camera, t);
    } };
  },

  // split screen: Seoul | La Trinidad at 6:43 PM (opening)
  split: () => split(shop()),
  // 4 · Title: what we build. A POS, a kiosk, a laptop, a desktop and a phone pop up one by one.
  lineup() {
    const S = makeScene({ cam: [10, 8, 10], look: [0, 1, 0], zoom: 4.3 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.1, [4, 10, 8], 10);
    scene.add(ground(C.bg));
    const backOut = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
    // u = left/right on screen, v = toward the camera (the iso camera looks down the x = z diagonal)
    const at = (g, u, v) => { u += .5; g.position.set((u + v) / Math.SQRT2, 0, (v - u) / Math.SQRT2); g.rotation.y = Math.PI / 4; };
    const item = (u, v, c) => { const g = new THREE.Group(); g.add(cyl(1.05, 1.15, .16, 24, c, 0, -.16, 0)); at(g, u, v); g.scale.setScalar(.001); scene.add(g); return g; };

    // POS: cash drawer, tablet on an arm, receipt printer with paper feeding out
    const pos = item(-1.4, 1.9, C.resin);
    pos.add(box(1.2, .3, .9, 0x2a2f2b, -.15, 0, 0)); pos.add(box(.12, .4, .12, C.night, -.15, .3, -.15));
    const slab = box(1.1, .75, .06, C.night, -.15, .62, -.1); slab.rotation.x = -.35; pos.add(slab);
    const posScr = box(1, .65, .02, 0xffd9e6, -.15, .67, -.06, .9); posScr.rotation.x = -.35; pos.add(posScr);
    pos.add(box(.4, .3, .4, C.fog, .7, 0, .2));
    const paper = new THREE.Group(); paper.position.set(.7, .3, .3); paper.rotation.x = .35; paper.add(box(.24, .5, .01, C.white, 0, 0, 0)); pos.add(paper);

    // kiosk: tall body, glowing screen, card slot
    const kiosk = item(.4, -1.7, C.pine2);
    kiosk.add(box(1.1, .1, .8, C.night, 0, 0, 0)); kiosk.add(box(.9, 1.9, .6, C.night, 0, .1, 0)); kiosk.add(box(.9, .2, .6, C.pine2, 0, 2, 0));
    const kioskScr = box(.72, .85, .04, 0xffd9e6, 0, 1, .31, .9); kiosk.add(kioskScr); kiosk.add(box(.4, .05, .08, C.resin, 0, .7, .31, .8));

    // laptop: the lid opens after it lands
    const laptop = item(2.7, .1, C.ember);
    laptop.add(box(1.3, .06, .9, 0x9aa094, 0, 0, 0)); laptop.add(box(1.1, .01, .4, C.night, 0, .06, .05));
    const lid = new THREE.Group(); lid.position.set(0, .06, -.43); laptop.add(lid);
    lid.add(box(1.3, .86, .05, 0x9aa094, 0, 0, 0)); lid.add(box(1.18, .74, .02, 0x9fd9a8, 0, .06, .035, .7));

    // desktop: monitor, keyboard, tower
    const desk = item(-2.5, -1.2, 0xff7a3d);
    desk.add(box(.5, .08, .3, C.night, -.2, 0, -.15)); desk.add(box(.08, .45, .08, C.night, -.2, .08, -.2));
    desk.add(box(1.2, .8, .06, C.night, -.2, .5, -.2)); desk.add(box(1.08, .68, .02, 0xdfe7f0, -.2, .56, -.16, .6));
    desk.add(box(.9, .05, .32, C.fog, -.2, 0, .4)); desk.add(box(.34, 1, .8, 0x6f756c, .72, 0, -.2));

    // phone on a dock, sales ticking in
    const phone = item(1.3, 2.4, C.fog);
    phone.add(box(.6, .12, .4, C.pine2, 0, 0, 0));
    const ph = new THREE.Group(); ph.position.set(0, .12, 0); ph.rotation.x = -.2; phone.add(ph);
    ph.add(box(.48, .9, .06, C.night, 0, 0, 0)); const phScr = box(.42, .78, .02, C.resin, 0, .06, .035, 1.1); ph.add(phScr);

    const items = [pos, kiosk, laptop, desk, phone];
    return { ...S, tick(t, since) {
      items.forEach((g, i) => {
        const x = (since - 900 - i * 260) / 520;
        g.scale.setScalar(x <= 0 ? .001 : x >= 1 ? 1 : Math.max(backOut(x), .001));
        g.position.y = x > 0 && x < 1 ? Math.sin(x * Math.PI) * .6 : 0;
        if (x >= 1) g.rotation.y = Math.PI / 4 + Math.sin(t / 2600 + i * 1.3) * .18;
      });
      const open = ease((since - 900 - 2 * 260 - 500) / 600); lid.rotation.x = Math.PI / 2 - open * (Math.PI / 2 + .28);
      paper.scale.y = Math.max(((t / 1800) % 1), .001);
      [posScr, kioskScr].forEach((s, i) => { s.material.emissiveIntensity = .9 + Math.sin(t / 400 + i) * .2; });
      phScr.material.emissiveIntensity = 1 + Math.sin(t / 220) * .4;
      sway(S.camera, t, .3);
    } };
  },
};

// La Trinidad shop at 6:43 PM: counting cash by hand.
function shop() {
  {
    const S = makeScene({ cam: [10, 9, 10], look: [0, 1.6, 0], zoom: 5.2, hemi: .55 }); const { scene } = S;
    keyLight(scene, 0x8fa6d8, .45, [-4, 8, 6]);
    room(scene, { back: 0x3a3226, side: 0x2c261d, floor: 0x2a241c });
    // window with mountains + moon
    scene.add(box(2.4, 1.8, .1, 0x0b1020, -1.6, 2.3, -3.3));
    [[-2.4, .9], [-1.8, 1.3], [-1.1, .8], [-.7, 1.1]].forEach(([x, h]) => { const m = mesh(new THREE.ConeGeometry(.5, h, 4), 0x1c3326); m.position.set(x, 2.3 + h / 2, -3.22); scene.add(m); });
    scene.add(ico(.16, C.fog, -2.2, 3.7, -3.2, 1, .8));
    // shelves of goods
    for (let r = 0; r < 3; r++) {
      scene.add(box(3, .08, .5, C.wood, 1.6, 1.4 + r * .8, -3.1));
      for (let i = 0; i < 7; i++) { const c = [C.ember, C.resin, C.pine2, C.fog, 0x4a7fb5][(i + r) % 5]; scene.add(box(.28, .3 + rand() * .25, .3, c, .4 + i * .4, 1.48 + r * .8, -3.05)); }
    }
    // clock at 6:43
    const hour = 6 + 43 / 60;
    const ck = clock(.45); ck.position.set(-2.8, 3.6, -3.32); scene.add(ck); ck.userData.set(hour);
    // owner + counter
    const p = person({ shirt: C.ember, hair: C.night, skin: C.skin2 }); p.position.set(.3, 0, -1.2); p.rotation.y = .2; scene.add(p);
    p.userData.head.rotation.x = .4;
    p.userData.armR.rotation.set(-1.0, 0, .1); p.userData.armL.rotation.set(-1.1, 0, -.1);
    scene.add(box(4.6, 1.15, 1, C.wood, .4, 0, -.1)); scene.add(box(4.7, .08, 1.1, 0x5c3a1a, .4, 1.15, -.1));
    const book = box(.9, .05, .6, C.white, .2, 1.23, -.25); book.rotation.y = -.15; scene.add(book);
    const calc = box(.3, .07, .42, C.night, 1, 1.23, -.2); scene.add(calc); scene.add(box(.22, .02, .1, 0x9fd9a8, 1, 1.3, -.32, .6));
    for (let i = 0; i < 5; i++) scene.add(cyl(.08, .08, .03, 8, C.resin, -.6 + (i % 3) * .05, 1.23 + i * .03, .05));
    // strawberry crate (La Trinidad)
    scene.add(box(1, .35, .7, 0xb07a3c, -1.4, 1.23, -.1));
    for (let i = 0; i < 10; i++) scene.add(ico(.09, C.ember, -1.8 + (i % 5) * .2, 1.62, -.3 + Math.floor(i / 5) * .3, 0));
    // swinging bulb
    const pend = new THREE.Group(); pend.position.set(.4, 5, -.6); scene.add(pend);
    const cord = box(.02, 1.4, .02, C.night, 0, -1.4, 0); pend.add(cord);
    const bulb = ico(.14, 0xffe6a8, 0, -1.5, 0, 1, 1.4); pend.add(bulb);
    const L = new THREE.PointLight(0xffc56b, 14, 8, 1.5); L.position.set(0, -1.6, 0); L.castShadow = true; pend.add(L);
    return { ...S, tick(t) {
      pend.rotation.z = Math.sin(t / 900) * .12;
      L.intensity = 13 + Math.sin(t / 60) * .6 + (Math.random() > .985 ? -6 : 0);
      p.userData.armR.rotation.x = -1.0 + Math.sin(t / 140) * .08;
      ck.userData.set(hour + (t / 1000) / 3600);
      sway(S.camera, t, .4);
    } };
  }
}

// Two scenes side by side in one renderer: Seoul on the left, the given La Trinidad scene on the right.
function split(right) {
  const left = builders.seoul();
  let W = 1, H = 1;
  const fitCam = (cam, w, h) => { const z = cam.userData.zoom, a = w / h; cam.left = -z * a; cam.right = z * a; cam.top = z; cam.bottom = -z; cam.updateProjectionMatrix(); };
  return {
    camera: left.camera,
    resize(w, h) { W = w; H = h; fitCam(left.camera, w / 2, h); fitCam(right.camera, w / 2, h); },
    tick(t, since) { left.tick(t, since); right.tick(t, since); },
    draw(r) {
      const hw = W / 2;
      r.setScissorTest(true);
      r.setViewport(0, 0, hw, H); r.setScissor(0, 0, hw, H); r.render(left.scene, left.camera);
      r.setViewport(hw, 0, hw, H); r.setScissor(hw, 0, hw, H); r.render(right.scene, right.camera);
      r.setScissorTest(false); r.setViewport(0, 0, W, H);
    },
  };
}

const builders2 = {

  // 5 · Auntie Analyn: laundry + tailoring, slips everywhere
  analyn() {
    const S = makeScene({ bg: 0x10251b, cam: [10, 8, 10], look: [0, 1.4, 0], zoom: 4.8 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.1, [5, 10, 6]);
    room(scene, { floor: 0xd8d6cc, back: C.fog, side: 0xcfd3cb });
    scene.add(box(4, .6, .1, C.pine, .5, 3.9, -3.3));
    const drums = [];
    [-2.3, -.9].forEach((x) => {
      scene.add(box(1.2, 1.5, 1.1, C.white, x, 0, -2.7)); scene.add(box(1.2, .25, 1.1, 0xcfd3cb, x, 1.5, -2.7));
      const door = mesh(new THREE.CylinderGeometry(.42, .42, .08, 10), C.pine); door.rotation.x = Math.PI / 2; door.position.set(x, .75, -2.12); scene.add(door);
      const d = mesh(new THREE.CylinderGeometry(.32, .32, .1, 5), C.resin); d.rotation.x = Math.PI / 2; d.position.set(x, .75, -2.08); scene.add(d); drums.push(d);
    });
    scene.add(box(1.6, .8, .9, C.wood, -2.6, 0, .2));
    const sm = new THREE.Group(); sm.add(box(.9, .2, .4, C.ember, 0, 0, 0)); sm.add(box(.2, .5, .35, C.ember, -.35, .2, 0)); sm.add(box(.8, .2, .35, C.ember, 0, .6, 0));
    sm.position.set(-2.6, .8, .2); sm.rotation.y = .4; scene.add(sm);
    const p = person({ shirt: C.resin, bun: true }); p.position.set(1.2, 0, -1.3); p.rotation.y = .3; scene.add(p);
    p.userData.armR.rotation.x = -.6;
    scene.add(box(4, 1.1, .9, C.night, 1, 0, -.2)); scene.add(box(4.1, .08, 1, 0x2a2f2b, 1, 1.1, -.2));
    const book = box(.9, .06, .6, C.white, .6, 1.18, -.2); book.rotation.y = .2; scene.add(book);
    const slips = [];
    for (let i = 0; i < 14; i++) {
      const s = mesh(new THREE.PlaneGeometry(.38, .24), i % 3 ? C.white : C.resin); s.material.side = THREE.DoubleSide;
      s.userData = { x: -2.5 + rand() * 5, z: -2 + rand() * 3.5, o: rand(), sp: .7 + rand() * .6 };
      scene.add(s); slips.push(s);
    }
    return { ...S, tick(t) {
      drums.forEach((d, i) => d.rotation.y = t / (300 + i * 200));
      slips.forEach((s) => { const u = s.userData; const k = ((t / 7000) * u.sp + u.o) % 1; s.position.set(u.x + Math.sin(k * 9 + u.o * 6) * .5, 5.2 - k * 5.4, u.z); s.rotation.set(k * 12, k * 7, k * 4); });
      p.userData.head.rotation.y = Math.sin(t / 700) * .5;
      sway(S.camera, t);
    } };
  },

  // 7 · Ate Rena: the office by day, the snack stop, the night trip between them
  rena() {
    const S = makeScene({ cam: [10, 10, 12], look: [0, .6, 0], zoom: 5, hemi: .7 }); const { scene } = S;
    keyLight(scene, 0x9fb8ff, .6, [-5, 10, 6], 12);
    scene.add(box(16, .3, 9, 0x1d2a22, 0, -.3, 0));
    scene.add(ico(.4, C.fog, -4, 6, -4, 1, .9));
    // office (EO Optical)
    scene.add(box(4, .2, 3.6, 0x34413a, -3.4, 0, -.6));
    scene.add(box(4, 3, .2, 0xdfe3da, -3.4, .2, -2.3));
    scene.add(box(.2, 3, 3.6, 0xcfd3cb, -5.3, .2, -.6));
    scene.add(box(3.4, .12, .6, C.wood, -3.4, 1.5, -2.05));
    for (let i = 0; i < 6; i++) { const gl = glasses(i % 2 ? C.night : C.ember); gl.position.set(-4.8 + i * .55, 1.74, -2); scene.add(gl); }
    scene.add(box(1.6, .8, .8, C.wood, -3.2, .2, -.6)); scene.add(box(.7, .5, .06, C.night, -3.2, 1, -.8)); scene.add(box(.6, .4, .02, 0x9fd9a8, -3.2, 1.05, -.76, .7));
    scene.add(box(.2, .2, .2, C.night, -3.2, 1, -.8));
    // snack stop
    const stall = new THREE.Group(); stall.position.set(3.8, 0, -.4); scene.add(stall);
    stall.add(box(2.6, 1.1, 1.3, C.pine2, 0, 0, 0)); stall.add(box(2.7, .08, 1.4, C.fog, 0, 1.1, 0));
    for (let i = 0; i < 6; i++) stall.add(box(.45, .14, 1.6, i % 2 ? C.ember : C.white, -1.12 + i * .45, 2.4, .1));
    stall.add(box(.08, 1.3, .08, C.night, -1.25, 1.1, .6)); stall.add(box(.08, 1.3, .08, C.night, 1.25, 1.1, .6));
    for (let i = 0; i < 4; i++) stall.add(cyl(.13, .13, .32, 8, [C.resin, C.ember, C.fog, C.resin][i], -.8 + i * .5, 1.18, 0));
    const bulb = ico(.1, 0xffe6a8, 0, 2.2, .3, 1, 1.2); stall.add(bulb);
    const sl = new THREE.PointLight(0xffc56b, 0, 6, 1.5); sl.position.set(0, 2, .6); stall.add(sl);
    // path + walker
    const pts = [new THREE.Vector3(-1.3, 0, .6), new THREE.Vector3(0, 0, 2.4), new THREE.Vector3(1.6, 0, 2.2), new THREE.Vector3(2.6, 0, 1.2)];
    const curve = new THREE.CatmullRomCurve3(pts);
    for (let i = 0; i <= 18; i++) { const q = curve.getPoint(i / 18); scene.add(box(.18, .03, .18, 0x5a6b5f, q.x, 0, q.z)); }
    const w = person({ shirt: C.resin, bun: true }); w.scale.setScalar(.75); scene.add(w);
    return { ...S, tick(t) {
      const k = (t / 9000) % 1; const u = k < .5 ? ease(k * 2) : 1 - ease((k - .5) * 2);
      const q = curve.getPoint(u), q2 = curve.getPoint(Math.min(Math.max(u + (k < .5 ? .02 : -.02), 0), 1));
      w.position.set(q.x, Math.abs(Math.sin(t / 160)) * .06, q.z);
      w.rotation.y = Math.atan2(q2.x - q.x, q2.z - q.z);
      w.userData.armR.rotation.x = Math.sin(t / 160) * .5; w.userData.armL.rotation.x = -Math.sin(t / 160) * .5;
      sl.intensity = 9 + Math.sin(t / 70) * .5;
      sway(S.camera, t, .5);
    } };
  },

  // 9 · CCDC: drafting documents by hand, papers piling up
  ccdc() {
    const S = makeScene({ bg: 0x182019, cam: [10, 9, 10], look: [0, 1.4, 0], zoom: 4.6 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.1, [5, 10, 6]);
    room(scene, { floor: 0xb9b3a4, back: 0xe8e4d8, side: 0xd6d1c3 });
    const ck = clock(.5); ck.position.set(1.2, 3.6, -3.32); scene.add(ck);
    scene.add(box(4, .12, 1.8, C.wood, 0, 1.1, -1.4)); [[-1.8, -2.1], [1.8, -2.1], [-1.8, -.7], [1.8, -.7]].forEach(([x, z]) => scene.add(box(.1, 1.1, .1, C.dark, x, 0, z)));
    scene.add(box(1.4, .9, .08, C.night, -.3, 1.6, -2.1)); scene.add(box(1.25, .75, .02, 0xdfe7f0, -.3, 1.68, -2.05, .4));
    for (let i = 0; i < 5; i++) scene.add(box(.9, .04, .02, 0x9aa4b0, -.3, 2.25 - i * .12, -2.03));
    scene.add(box(.2, .4, .2, C.night, -.3, 1.22, -2.1));
    scene.add(box(1, .05, .35, 0x2a2f2b, -.3, 1.22, -1.2));
    const p = person({ shirt: 0x4a7fb5, hair: C.night, seated: true }); p.position.set(-.3, .55, -.3); p.rotation.y = Math.PI; scene.add(p);
    scene.add(box(.8, .55, .8, C.night, -.3, 0, -.3));
    p.userData.armR.rotation.x = -1.2; p.userData.armL.rotation.x = -1.2;
    // growing paper stack
    const sheets = [];
    for (let i = 0; i < 26; i++) { const s = box(.6, .025, .8, i % 7 === 6 ? C.resin : C.white, 1.3 + (rand() - .5) * .06, 1.22 + i * .028, -1.5 + (rand() - .5) * .06); s.rotation.y = (rand() - .5) * .2; s.visible = false; scene.add(s); sheets.push(s); }
    scene.add(box(1.4, 1.6, .7, 0x8f8a7c, 2.6, 0, -2.9));
    return { ...S, tick(t) {
      const k = (t / 9000) % 1; const n = Math.floor(k * sheets.length * 1.15);
      sheets.forEach((s, i) => s.visible = i < n);
      ck.userData.set((t / 1000) * .35);
      p.userData.armR.rotation.x = -1.2 + Math.sin(t / 60) * .06; p.userData.armL.rotation.x = -1.2 + Math.cos(t / 55) * .06;
      sway(S.camera, t);
    } };
  },

  // 10 · The turn: three businesses, same problem (clocks running)
  turn() {
    const S = makeScene({ cam: [0, 8, 14], look: [0, .9, 0], zoom: 2.8 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.1, [4, 10, 8], 12);
    const clocks = []; const spin = [];
    const plinth = (x, c) => { scene.add(box(3.2, .5, 3.2, c, x, -.5, 0)); };
    // laundry
    plinth(-4.4, C.ember);
    scene.add(box(1.2, 1.5, 1.1, C.white, -4.4, 0, -.2));
    const d1 = mesh(new THREE.CylinderGeometry(.42, .42, .08, 10), C.pine); d1.rotation.x = Math.PI / 2; d1.position.set(-4.4, .75, .38); scene.add(d1);
    const dr = mesh(new THREE.CylinderGeometry(.32, .32, .1, 5), C.resin); dr.rotation.x = Math.PI / 2; dr.position.set(-4.4, .75, .42); scene.add(dr); spin.push(dr);
    // snack stop
    plinth(0, C.resin);
    scene.add(box(2, 1, 1, C.pine2, 0, 0, 0));
    for (let i = 0; i < 5; i++) scene.add(box(.42, .12, 1.3, i % 2 ? C.ember : C.white, -.84 + i * .42, 2, .1));
    scene.add(box(.06, 1, .06, C.night, -.95, 1, .5)); scene.add(box(.06, 1, .06, C.night, .95, 1, .5));
    for (let i = 0; i < 3; i++) scene.add(cyl(.12, .12, .3, 8, [C.resin, C.ember, C.fog][i], -.5 + i * .5, 1, 0));
    // office
    plinth(4.4, C.pine);
    scene.add(box(2, .1, 1, C.wood, 4.4, .8, 0)); scene.add(box(.08, .8, .08, C.dark, 3.5, 0, -.4)); scene.add(box(.08, .8, .08, C.dark, 5.3, 0, -.4));
    scene.add(box(1, .65, .06, C.night, 4.2, .9, -.3)); scene.add(box(.9, .55, .02, 0xdfe7f0, 4.2, .95, -.26, .4));
    for (let i = 0; i < 8; i++) scene.add(box(.45, .025, .6, C.white, 5, .9 + i * .03, .1));
    [-4.4, 0, 4.4].forEach((x) => { const c = clock(.42); c.position.set(x, 3.4, 0); scene.add(c); clocks.push(c); });
    return { ...S, tick(t) {
      clocks.forEach((c, i) => c.userData.set(t / 1000 * (.5 + i * .07)));
      spin.forEach((d) => d.rotation.y = t / 300);
    } };
  },

  // 11 · 9 in 10: nine small shops and one big building
  micro() {
    const S = makeScene({ cam: [9, 9, 13], look: [0, .8, 0], zoom: 4.2 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.15, [5, 12, 7], 12);
    scene.add(box(40, .2, 30, 0x1d241f, 0, -.2, -6));
    const items = [];
    const cols = [C.resin, C.ember, C.pine2, C.fog, C.resin, C.ember, C.pine2, C.fog, C.resin];
    for (let i = 0; i < 10; i++) {
      const g = new THREE.Group(); const x = (i % 5 - 2) * 2.1, z = Math.floor(i / 5) * 2.4 - 1.2;
      g.position.set(x, 0, z);
      if (i < 9) {
        g.add(box(1.2, 1, 1.1, cols[i], 0, 0, 0)); g.add(roof(1.4, .6, 1.3, 0x3a2d22, 0, 1, 0));
        g.add(box(.5, .4, .02, 0xffd27a, 0, .3, .56, .9));
        for (let k = 0; k < 4; k++) g.add(box(.35, .08, .4, k % 2 ? C.ember : C.white, -.52 + k * .35, .9, .7));
      } else {
        g.add(box(1.5, 3.4, 1.4, C.grey, 0, 0, 0));
        for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) g.add(box(.25, .3, .02, 0xa8c4d8, -.45 + c * .45, .4 + r * .5, .71, .2));
      }
      g.scale.set(1, .001, 1); g.userData.delay = 200 + i * 140; scene.add(g); items.push(g);
    }
    return { ...S, tick(t, since) {
      items.forEach((g) => { const k = ease((since - g.userData.delay) / 600); g.scale.y = Math.max(k, .001); });
      sway(S.camera, t, .4, 4000);
    } };
  },

  // 12 · Who builds it: money and young people leaving Benguet
  outflow() {
    const S = makeScene({ bg: 0x10251b, cam: [0, 11, 12], look: [0, 0, 0], zoom: 5.2, hemi: .8 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.1, [4, 12, 6], 14);
    scene.add(box(30, .3, 20, 0x2f5e3f, 0, -.3, 0));
    for (let i = 0; i < 22; i++) {
      const h = 1.2 + rand() * 2.4; const m = mesh(new THREE.ConeGeometry(.9 + rand() * .9, h, 5), [C.pine, 0x24553a, C.pine2][i % 3]);
      const a = Math.PI + rand() * Math.PI, r = 3 + rand() * 4; m.position.set(Math.cos(a) * r * 1.3 - 1, h / 2, Math.sin(a) * r * .8 - 1.4); m.rotation.y = rand(); scene.add(m);
    }
    for (let i = 0; i < 7; i++) { const x = -2 + (i % 4) * .7, z = Math.floor(i / 4) * .9 - .4; scene.add(box(.5, .4, .5, [C.fog, C.resin, C.ember][i % 3], x, 0, z)); scene.add(roof(.6, .3, .6, 0x3a2d22, x, .4, z)); }
    // road east
    scene.add(box(10, .03, .5, 0x1b1f1c, 5.5, 0, .4));
    const travellers = [];
    for (let i = 0; i < 14; i++) {
      let o;
      if (i % 3 === 0) { o = person({ shirt: [C.resin, C.ember, C.fog][i % 3], bun: i % 2 === 0 }); o.scale.setScalar(.32); }
      else { o = cyl(.16, .16, .05, 10, C.resin, 0, 0, 0, .35); o.rotation.x = Math.PI / 2; }
      Object.assign(o.userData, { o: i / 14, coin: i % 3 !== 0 }); scene.add(o); travellers.push(o);
    }
    return { ...S, tick(t) {
      travellers.forEach((o) => {
        const k = ((t / 7000) + o.userData.o) % 1;
        if (o.userData.coin) { o.position.set(-1 + k * 12, .6 + Math.sin(k * Math.PI) * 2.4, -.3 + k * .7); o.rotation.z = t / 200; }
        else { o.position.set(-.6 + k * 11, Math.abs(Math.sin(t / 150)) * .04, .4); o.rotation.y = Math.PI / 2; o.userData.armR && (o.userData.armR.rotation.x = Math.sin(t / 150) * .5); }
        o.visible = k < .95;
      });
    } };
  },

  // 13 · Saleng: one stick, one spark, a fire starts
  saleng() {
    const S = makeScene({ bg: C.night, cam: [0, 3, 12], look: [0, 1, 0], zoom: 2.6, hemi: .35 }); const { scene } = S;
    scene.add(ground(C.night));
    const f = fire(.7, 1); f.scale.setScalar(1.4); f.position.set(-.2, 0, 0); scene.add(f);
    f.userData.level = 0;
    const glow = new THREE.PointLight(0xffd27a, 0, 4, 1.5); glow.position.set(.6, 1.6, 1); scene.add(glow);
    let full = false, lvl = 0;
    return { ...S, onStep(n) { full = n >= 1; }, tick(t, since) {
      const target = full ? 1 : (since > 900 ? .35 : 0);
      lvl += (target - lvl) * .04; f.userData.level = lvl; f.userData.tick(t);
      glow.intensity = since > 700 && since < 1200 ? 20 : 0; // the spark
      f.rotation.y = Math.sin(t / 3000) * .25;
    } };
  },

  // 15 · Packages: three fires light one at a time
  fires() {
    const S = makeScene({ cam: [0, 4, 14], look: [0, 1.2, 0], zoom: 3.2 }); const { scene } = S;
    scene.add(ground(C.bg));
    const spots = [{ x: -6.3, s: .45, logs: 1 }, { x: 0, s: .9, logs: 4 }, { x: 6.3, s: 1.35, logs: 7 }];
    const fires = spots.map(({ x, s, logs }) => { const f = fire(s, logs); f.position.x = x; f.userData.level = 0; scene.add(f); return f; });
    const lv = [0, 0, 0]; let at = 0;
    return { ...S, onStep(n) { at = n; }, tick(t) {
      fires.forEach((f, i) => { lv[i] += ((at > i ? 1 : 0) - lv[i]) * .06; f.userData.level = lv[i]; f.userData.tick(t + i * 400); });
    } };
  },

  // 18 · La Trinidad, 2076
  future() {
    const S = makeScene({ cam: [11, 10, 12], look: [-4.5, .5, 4.5], zoom: 6.2, hemi: .9 }); const { scene } = S;
    keyLight(scene, 0xffd9a8, 1.2, [-6, 10, 8], 16);
    scene.add(box(40, .3, 30, 0x3f7d4f, 0, -.3, -4));
    for (let i = 0; i < 12; i++) { const h = 3 + rand() * 4; const m = mesh(new THREE.ConeGeometry(2 + rand() * 1.5, h, 5), [C.pine, 0x24553a][i % 2]); m.position.set(-12 + i * 2.2, h / 2, -9 - rand() * 2); scene.add(m); }
    // strawberry terraces
    for (let r = 0; r < 4; r++) {
      scene.add(box(6 - r * .6, .35 * (r + 1), 1.2, [0x5a8f4f, 0x4f8446][r % 2], -4.5, 0, -2.6 - r * 1.2));
      for (let i = 0; i < 9; i++) scene.add(ico(.1, C.ember, -7 + r * .3 + i * (5.4 - r * .6) / 9, .35 * (r + 1) + .08, -2.6 - r * 1.2 + (i % 2 ? .25 : -.25), 0));
    }
    const farmer = person({ shirt: C.resin, hair: C.night, skin: C.skin2 }); farmer.position.set(-2.4, 0, -1.2); farmer.rotation.y = .6; scene.add(farmer);
    farmer.userData.armR.rotation.set(-1.4, 0, -.3);
    const phone = box(.2, .34, .04, 0xffe6a8, -2.1, 1.25, -.75, 1.2); phone.rotation.y = .6; phone.rotation.x = -.4; scene.add(phone);
    // trading post
    scene.add(box(4.4, 1.6, 2, C.fog, 2.2, 0, -3.5)); scene.add(roof(5, 1, 2.6, C.ember, 2.2, 1.6, -3.5));
    for (let i = 0; i < 6; i++) scene.add(box(.55, .35, .45, 0xb07a3c, .6 + (i % 3) * .6, (i > 2 ? .35 : 0), -2.1));
    // highway + shops
    scene.add(box(30, .03, 1.4, 0x22262a, 0, 0, 1.6));
    for (let i = 0; i < 14; i++) scene.add(box(.6, .02, .1, C.fog, -13 + i * 2, .03, 1.6));
    const windows = [];
    for (let i = 0; i < 7; i++) {
      const x = -6 + i * 2.1; scene.add(box(1.5, 1.2, 1.2, [C.resin, C.fog, C.pine2, C.ember][i % 4], x, 0, 3.4)); scene.add(roof(1.7, .6, 1.4, 0x3a2d22, x, 1.2, 3.4));
      const w = box(.7, .45, .02, 0xffd27a, x, .4, 2.79, 1); scene.add(w); windows.push(w);
    }
    // a little jeepney-ish vehicle
    const car = new THREE.Group(); car.add(box(1.4, .5, .6, C.ember, 0, .12, 0)); car.add(box(.9, .35, .55, C.fog, -.15, .62, 0));
    [-.45, .45].forEach((x) => [-.3, .3].forEach((z) => { const w = cyl(.14, .14, .08, 8, C.night, x, .14, z); w.rotation.x = Math.PI / 2; car.add(w); }));
    scene.add(car);
    return { ...S, tick(t, since) {
      const k = (t / 9000) % 1; car.position.set(-12 + k * 24, 0, 1.3);
      windows.forEach((w, i) => { const off = since > 2500 + i * 450; w.material.emissiveIntensity = off ? .05 : 1; w.material.color.setHex(off ? 0x4a4a3f : 0xffd27a); });
      phone.material.emissiveIntensity = 1 + Math.sin(t / 300) * .3;
      sway(S.camera, t, .6, 4000);
    } };
  },

  // 19 · Close: a small fire, burning steady
  close() {
    const S = makeScene({ bg: C.night, cam: [0, 3, 12], look: [0, 1.1, 0], zoom: 2.4, hemi: .3 }); const { scene } = S;
    scene.add(ground(C.night));
    const f = fire(.8, 5); scene.add(f);
    return { ...S, tick(t) { f.userData.tick(t); f.rotation.y = t / 8000; } };
  },
};

const builders3 = {

  // 5 · Survey: twenty shops. Seventeen keep a notebook, three have a screen.
  survey() {
    const S = makeScene({ cam: [10, 9, 10], look: [0, .4, 0], zoom: 5.4, hemi: .9 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1, [5, 10, 6], 12);
    scene.add(ground(C.bg));
    const books = [], screens = [];
    const cols = [C.ember, C.resin, C.pine2, C.fog, 0x4a7fb5];
    for (let i = 0; i < 20; i++) {
      const x = -4.4 + (i % 5) * 2.2, z = -3.3 + Math.floor(i / 5) * 2.2;
      scene.add(box(1.4, 1.1, 1.2, cols[(i * 7) % 5], x, 0, z)); scene.add(roof(1.6, .55, 1.4, 0x3a2d22, x, 1.1, z));
      scene.add(box(.5, .7, .02, C.night, x, 0, z + .61));
      if ([3, 11, 16].includes(i)) {
        scene.add(box(.5, .34, .06, C.night, x, 1.9, z));
        const sc = box(.42, .26, .02, C.resin, x, 1.94, z + .04, 1.1); scene.add(sc); screens.push(sc);
      } else {
        const b = new THREE.Group(); b.add(box(.6, .06, .8, C.white, 0, 0, 0)); b.add(box(.62, .02, .82, C.ember, 0, .06, 0));
        b.position.set(x, 1.9, z); b.userData.o = rand(); scene.add(b); books.push(b);
      }
    }
    return { ...S, tick(t) {
      books.forEach((b) => { b.position.y = 1.85 + Math.sin(t / 700 + b.userData.o * 6) * .12; b.rotation.y = Math.sin(t / 1500 + b.userData.o * 6) * .3; });
      screens.forEach((s) => { s.material.emissiveIntensity = 1 + Math.sin(t / 250) * .3; });
      sway(S.camera, t, .5);
    } };
  },

  // 6 · What doing it by hand costs: stuck in one head · mistakes no one catches · hours of repeat work. One diorama per step.
  costs() {
    const S = makeScene({ cam: [0, 8, 14], look: [0, 1, 0], zoom: 2.5 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.1, [4, 10, 8], 12);
    const groups = [0, 1, 2].map((i) => { const g = new THREE.Group(); g.position.x = -4.4 + i * 4.4; g.scale.setScalar(.001); scene.add(g); return g; });
    const plinth = (g, c) => g.add(box(3.2, .5, 3.2, c, 0, -.5, 0));
    // 01 · the shop only runs while the owner is in it: she walks out, the window goes dark
    const A = groups[0]; plinth(A, C.resin);
    A.add(box(2.2, 1.5, 1.2, C.fog, 0, 0, -.9));
    // gable roof: the triangle faces the camera, ridge running front to back
    const gable = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-1.3, 0), new THREE.Vector2(1.3, 0), new THREE.Vector2(0, .9)]), { depth: 1.4, bevelEnabled: false });
    gable.translate(0, 0, -.7); const rf = mesh(gable, C.ember); rf.position.set(0, 1.5, -.9); A.add(rf);
    const win = box(.9, .55, .04, 0xffd27a, -.45, .6, -.28, 1); A.add(win);
    A.add(box(.5, 1.1, .04, C.night, .6, 0, -.28));
    A.add(box(1.4, .6, .4, C.wood, -.45, 0, .1));
    const owner = person({ shirt: C.ember, skin: C.skin2 }); owner.scale.setScalar(.6); A.add(owner);
    // 02 · a notebook that doesn't add up, coins slipping off the counter
    const B = groups[1]; plinth(B, 0xff7a3d); // flame, to match its heading
    B.add(box(2.4, .8, .8, C.wood, 0, 0, -.1)); B.add(box(2.5, .06, .9, 0x5c3a1a, 0, .8, -.1));
    const book = new THREE.Group(); book.position.set(-.5, .86, -.1); book.rotation.y = .15; B.add(book);
    book.add(box(.8, .05, .55, C.white, 0, 0, 0)); book.add(box(.5, .02, .04, 0x9aa094, 0, .05, -.12)); book.add(box(.4, .02, .05, C.ember, .05, .05, .1));
    B.add(box(.7, .2, .5, C.night, .6, .86, -.1));
    const clerk = person({ shirt: C.resin, bun: true }); clerk.scale.setScalar(.6); clerk.position.set(0, 0, -.9); B.add(clerk);
    clerk.userData.armR.rotation.set(-2.6, 0, -.6); clerk.userData.head.rotation.z = .2; // hand to head
    const coins = [];
    for (let i = 0; i < 7; i++) { const c = cyl(.1, .1, .04, 8, C.resin); c.userData = { o: i / 7, x: .3 + rand() * .7, z: -.3 + rand() * .4 }; B.add(c); coins.push(c); }
    // 03 · 6:43 PM and still writing, papers piling up
    const Cg = groups[2]; plinth(Cg, C.ember);
    Cg.add(box(3, 2.4, .1, 0xe8dfca, 0, 0, -1.5));
    const ck = clock(.32); ck.position.set(.9, 1.9, -1.4); Cg.add(ck); ck.userData.set(6 + 43 / 60);
    Cg.add(box(2.2, .75, 1, C.wood, 0, 0, -.5));
    const writer = person({ shirt: 0x4a7fb5, seated: true }); writer.scale.setScalar(.6); writer.position.set(0, .4, .5); writer.rotation.y = Math.PI; Cg.add(writer);
    Cg.add(box(.5, .4, .5, C.dark, 0, 0, .55));
    writer.userData.armR.rotation.x = -1.1; writer.userData.armL.rotation.x = -1.1;
    const stacks = [];
    for (let m = 0; m < 3; m++) { const g = new THREE.Group(); for (let i = 0; i < 8; i++) g.add(box(.5, .04, .36, i % 3 ? C.white : 0xd9d4c7, 0, i * .045, 0)); g.position.set(-.7 + m * .7, .75, -.6); Cg.add(g); stacks.push(g); }
    const lv = [0, 0, 0]; let at = 0;
    return { ...S, onStep(n) { at = n; }, tick(t) {
      groups.forEach((g, i) => { lv[i] += ((at > i ? 1 : 0) - lv[i]) * .08; g.scale.setScalar(Math.max(lv[i], .001)); });
      const k = (t / 7000) % 1; // at the counter, walk out, away, walk back
      let u = 0; if (k > .35 && k < .5) u = ease((k - .35) / .15); else if (k >= .5 && k < .85) u = 1; else if (k >= .85) u = 1 - ease((k - .85) / .15);
      const walking = u > 0 && u < 1;
      owner.position.set(-.45 + u * 1.6, walking ? Math.abs(Math.sin(t / 160)) * .04 : 0, .6 + u * .7);
      owner.rotation.y = walking ? (k < .5 ? Math.PI / 2 : -Math.PI / 2) : 0;
      owner.userData.armR.rotation.x = walking ? Math.sin(t / 150) * .6 : -.6; owner.userData.armL.rotation.x = walking ? -Math.sin(t / 150) * .6 : -.6;
      const away = u > .6; win.material.emissiveIntensity = away ? .05 : 1; win.material.color.setHex(away ? 0x6b6456 : 0xffd27a);
      coins.forEach((c) => { const q = c.userData, j = ((t / 3200) + q.o) % 1; c.position.set(q.x + Math.sin(j * 6) * .2, .9 + j * 1.8, q.z); c.rotation.y = j * 9; c.scale.setScalar(Math.max(j < .8 ? 1 : (1 - j) / .2, .001)); });
      clerk.userData.head.rotation.y = Math.sin(t / 900) * .3;
      stacks.forEach((g, m) => { const j = ((t / 4000) + m * .3) % 1; g.children.forEach((c, i) => c.visible = i < Math.floor(j * g.children.length) + 1); });
      writer.userData.armR.rotation.x = -1.1 + Math.sin(t / 140) * .08;
    } };
  },

  // 9 · Not built for them: Manila towers · a subscription calendar · a broken screen and a far call center
  gap() {
    const S = makeScene({ cam: [0, 8, 14], look: [0, 1, 0], zoom: 2.5 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.1, [4, 10, 8], 12);
    const plinth = (x, c) => scene.add(box(3.2, .5, 3.2, c, x, -.5, 0));
    plinth(-4.4, C.pine);
    [[-5.2, 2.6, -.6], [-4.4, 3.1, .2], [-3.6, 2.2, -.8], [-5, 1.6, .9]].forEach(([x, h, z], i) => {
      scene.add(box(.8, h, .8, [0x8d9488, 0xb9beb2, 0x6f756c, 0xa3a89c][i], x, 0, z));
      for (let r = 0; r < Math.floor(h / .5); r++) scene.add(box(.5, .12, .02, 0xffe6a8, x, .3 + r * .5, z + .41, .6));
    });
    scene.add(box(.6, .45, .5, C.resin, -3.5, 0, 1.1)); scene.add(roof(.7, .3, .6, 0x3a2d22, -3.5, .45, 1.1)); // the sari-sari at their feet
    plinth(0, C.ember);
    scene.add(box(2.4, 1.7, .1, C.white, 0, .6, -1)); scene.add(box(2.4, .3, .12, C.ember, 0, 2, -1));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) scene.add(box(.26, .22, .02, r === 1 && c === 2 ? C.ember : 0xd9d4c7, -1 + c * .4, .75 + r * .4, -.94));
    const stacks = [];
    for (let m = 0; m < 4; m++) { const g = new THREE.Group(); for (let i = 0; i < 2 + m * 2; i++) g.add(cyl(.2, .2, .07, 8, C.resin, 0, i * .07, 0)); g.position.set(-1.1 + m * .74, 0, .6); scene.add(g); stacks.push(g); }
    plinth(4.4, C.resin);
    const tab = box(1.3, .9, .08, C.night, 3.8, .9, -.4); tab.rotation.x = -.5; scene.add(tab);
    const scr = box(1.15, .75, .02, 0xdfe7f0, 3.8, .95, -.35, .3); scr.rotation.x = -.5; scene.add(scr);
    [.7, -.7].forEach((rz) => { const b = box(1, .08, .02, C.ember, 0, 0, 0); b.position.set(3.8, 1.35, -.1); b.rotation.z = rz; scene.add(b); });
    const p = person({ shirt: 0x4a7fb5 }); p.position.set(5, 0, .6); p.rotation.y = .4; scene.add(p);
    p.userData.armR.rotation.set(-1.4, 0, -1); p.userData.armL.rotation.set(-1.4, 0, 1);
    for (let i = 0; i < 6; i++) scene.add(box(.25, .03, .06, C.night, 4.8 + i * .35, 1.2 + i * .3, -1.2 - i * .35));
    scene.add(box(.5, 1.6, .5, 0x8d9488, 6.9, 1.2, -3.2)); scene.add(box(.08, .5, .08, C.ember, 6.9, 2.8, -3.2));
    // gather each diorama into its own group (by which plinth it stands on) so it can pop up on its click
    const groups = [-4.4, 0, 4.4].map((x) => { const g = new THREE.Group(); g.position.x = x; g.scale.setScalar(.001); return g; });
    scene.children.filter((o) => !o.isLight).forEach((o) => {
      const i = o.position.x < -2.2 ? 0 : o.position.x > 2.2 ? 2 : 1;
      o.position.x -= groups[i].position.x; groups[i].add(o);
    });
    groups.forEach((g) => scene.add(g));
    const backOut = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
    const shownAt = [null, null, null];
    return { ...S, onStep(n) {
      shownAt.forEach((v, i) => { shownAt[i] = n > i ? (v ?? performance.now()) : null; });
    }, tick(t) {
      groups.forEach((g, i) => { const x = shownAt[i] == null ? 0 : Math.min((performance.now() - shownAt[i]) / 550, 1); g.scale.setScalar(x <= 0 ? .001 : Math.max(backOut(x), .001)); });
      stacks.forEach((g, m) => { const k = ((t / 4000) + m * .25) % 1; g.children.forEach((c, i) => c.visible = i < Math.floor(k * g.children.length) + 1); });
      p.userData.armR.rotation.z = -1 + Math.sin(t / 500) * .15; p.userData.armL.rotation.z = 1 - Math.sin(t / 500) * .15;
    } };
  },

  // 14 · Audit → Build → Support, one diorama per step
  method() {
    const S = makeScene({ cam: [0, 8, 14], look: [0, 1, 0], zoom: 2.5 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.1, [4, 10, 8], 12);
    const groups = [0, 1, 2].map((i) => { const g = new THREE.Group(); g.position.x = -4.4 + i * 4.4; g.scale.setScalar(.001); scene.add(g); return g; });
    const plinth = (g, c) => g.add(box(3.2, .5, 3.2, c, 0, -.5, 0));
    // audit: in the shop with the owner, clipboard out
    const A = groups[0]; plinth(A, C.resin);
    A.add(box(2, .9, .6, C.wood, 0, 0, -.6));
    for (let i = 0; i < 4; i++) A.add(box(.3, .3 + (i % 2) * .15, .3, [C.ember, C.pine2, 0x4a7fb5, C.fog][i], -.6 + i * .4, .9, -.6));
    const owner = person({ shirt: C.ember, skin: C.skin2 }); owner.position.set(.3, 0, -1.2); A.add(owner);
    const me = person({ shirt: C.resin }); me.position.set(-.4, 0, .6); me.rotation.y = Math.PI; A.add(me);
    me.userData.armL.rotation.set(-1.5, 0, .4); me.userData.armR.rotation.set(-1.2, 0, -.5);
    me.userData.armL.add(box(.45, .6, .04, C.white, 0, -1, .1));
    // build: a laptop on the bench, the kiosk assembling itself
    const B = groups[1]; plinth(B, 0xff7a3d); // flame, to match its heading
    B.add(box(1.6, .8, .8, C.wood, -.7, 0, .3));
    B.add(box(.8, .05, .55, C.night, -.7, .8, .3)); B.add(box(.8, .5, .04, C.night, -.7, .85, .03)); B.add(box(.7, .4, .02, 0x9fd9a8, -.7, .9, .06, .7));
    const dev = person({ shirt: C.resin, seated: true }); dev.position.set(-.7, .45, 1.1); dev.rotation.y = Math.PI; B.add(dev); B.add(box(.6, .45, .6, C.dark, -.7, 0, 1.1));
    dev.userData.armR.rotation.x = -1.1; dev.userData.armL.rotation.x = -1.1;
    const parts = [box(.9, .9, .6, C.night, .9, 0, -.2), box(.9, .5, .6, C.pine2, .9, .9, -.2), box(.8, .55, .08, C.night, .9, 1.4, .1), box(.7, .45, .02, C.resin, .9, 1.45, .15, .9)];
    parts.forEach((p) => { p.userData.y = p.position.y; B.add(p); });
    // support: home to the client, a short ride
    const Cg = groups[2]; plinth(Cg, C.ember);
    Cg.add(box(3.2, .04, .6, 0x3a3f3c, 0, 0, .4)); for (let i = 0; i < 6; i++) Cg.add(box(.3, .02, .06, C.fog, -1.3 + i * .5, .04, .4));
    Cg.add(box(.9, .8, .8, C.fog, -1.1, 0, -.6)); Cg.add(roof(1, .5, .9, C.pine, -1.1, .8, -.6));
    Cg.add(box(1, .8, .8, C.resin, 1.1, 0, -.6)); Cg.add(roof(1.1, .5, .9, C.ember, 1.1, .8, -.6));
    const bike = new THREE.Group(); bike.add(box(.6, .18, .22, C.ember, 0, .18, 0)); [-.22, .22].forEach((x) => { const w = cyl(.12, .12, .06, 8, C.night, x, .12, 0); w.rotation.x = Math.PI / 2; bike.add(w); });
    const rider = person({ shirt: C.resin }); rider.scale.setScalar(.45); rider.position.y = .28; rider.rotation.y = Math.PI / 2; bike.add(rider); bike.position.z = .4; Cg.add(bike);
    Cg.add(box(.04, .9, .04, C.night, 0, .3, -.2)); Cg.add(box(.5, .3, .04, C.white, 0, 1.2, -.2));
    const lv = [0, 0, 0]; let at = 0;
    return { ...S, onStep(n) { at = n; }, tick(t) {
      groups.forEach((g, i) => { lv[i] += ((at > i ? 1 : 0) - lv[i]) * .08; g.scale.setScalar(Math.max(lv[i], .001)); });
      me.userData.head.rotation.y = Math.sin(t / 700) * .4;
      const k = (t / 5000) % 1; parts.forEach((p, i) => { const u = ease((k - i * .18) / .2); p.visible = k > i * .18; p.position.y = p.userData.y + (1 - u) * 2; });
      const r = (t / 4000) % 1, u = r < .5 ? ease(r * 2) : 1 - ease((r - .5) * 2); bike.position.x = -1.1 + u * 2.2; bike.rotation.y = r < .5 ? 0 : Math.PI;
    } };
  },

  // 15 · Kits: a tablet POS, a kiosk, a desktop
  devices() {
    const S = makeScene({ cam: [8, 6, 10], look: [0, .9, 0], zoom: 3.2 }); const { scene } = S;
    keyLight(scene, 0xfff1d6, 1.1, [4, 10, 8], 10);
    scene.add(ground(C.bg));
    const spin = [];
    const stand = (x, c) => scene.add(cyl(1.3, 1.4, .18, 24, c, x, -.18, 0));
    stand(-3.6, C.resin);
    const tab = new THREE.Group(); tab.add(box(.9, .12, .9, C.night, 0, 0, 0)); tab.add(box(.14, .5, .14, C.night, 0, .12, -.1));
    const slab = box(1.4, 1, .08, C.night, 0, .55, -.1); slab.rotation.x = -.35; tab.add(slab); const scr = box(1.28, .88, .02, 0xffd9e6, 0, .6, -.06, .9); scr.rotation.x = -.35; tab.add(scr);
    tab.position.x = -3.6; scene.add(tab); spin.push(tab);
    stand(0, C.pine);
    const k = new THREE.Group(); k.add(box(1, 1.6, .7, C.night, 0, 0, 0)); k.add(box(1, .2, .7, C.pine2, 0, 1.6, 0)); k.add(box(.8, .6, .04, 0xffd9e6, 0, 1.1, .36, .9)); k.add(box(.5, .06, .1, C.resin, 0, .7, .36));
    scene.add(k); spin.push(k);
    stand(3.6, C.ember);
    const pc = new THREE.Group(); pc.add(box(1.6, .06, .9, 0xd9d4c7, 0, 0, 0)); pc.add(box(.5, .1, .3, C.night, 0, .06, .1)); pc.add(box(.08, .5, .08, C.night, 0, .16, -.1));
    pc.add(box(1.5, .95, .06, C.night, 0, .6, -.1)); pc.add(box(1.38, .83, .02, 0xdfe7f0, 0, .66, -.06, .6)); pc.add(box(.9, .06, .35, C.fog, 0, .06, .35)); pc.add(box(.4, 1.1, .9, 0x6f756c, 1.3, 0, -.2));
    pc.position.x = 3.6; scene.add(pc); spin.push(pc);
    return { ...S, tick(t) { spin.forEach((g, i) => g.rotation.y = Math.sin(t / 2500 + i) * .35); sway(S.camera, t, .3); } };
  },
};

Object.assign(builders, builders2, builders3);

// ── wire scenes to slides ──
const stage3d = new Stage3D();
const built = new Map();
function sceneFor(slide) {
  const host = slide.querySelector('.scene3d');
  if (!host) return null;
  if (!built.has(host)) built.set(host, builders[host.dataset.scene]());
  return { host, obj: built.get(host) };
}
function onEnter(slide) {
  const s = sceneFor(slide);
  if (!s) return;
  stage3d.mount(s.host, s.obj);
  s.obj.onStep?.(+slide.dataset.at || 0);
}
document.addEventListener('slideenter', (e) => onEnter(e.target));
document.addEventListener('slidestep', (e) => { const s = sceneFor(e.target); s?.obj.onStep?.(e.detail); });
document.addEventListener('stagefit', () => stage3d.resize());
const first = document.querySelector('.slide.is-active'); if (first) onEnter(first);
(function loop(now) { requestAnimationFrame(loop); stage3d.render(now); })(performance.now());

// Low-poly building blocks shared by every scene.
import * as THREE from 'three';
export { THREE };

export const C = {
  night: 0x151a16, pine: 0x1b4430, pine2: 0x2f6b4c, leaf: 0x3f7d4f, resin: 0xe3a42b, ember: 0xc0222f,
  fog: 0xe5e7e1, skin: 0xc68a63, skin2: 0x9c6644, wood: 0x8a5a2b, dark: 0x3d2610, white: 0xf7f4ea,
  grey: 0x6f756c, glow: 0xffb347,
  bg: 0x10251b, // the slide background: scene backgrounds and ground planes match it exactly
};

export const mat = (c, e = 0) => new THREE.MeshLambertMaterial({ color: c, flatShading: true, emissive: e ? c : 0x000000, emissiveIntensity: e });
export function mesh(geo, c, e) { const m = new THREE.Mesh(geo, mat(c, e)); m.castShadow = m.receiveShadow = true; return m; }
/** box sitting on y (bottom at y) */
/** flat ground that exactly matches the slide background */
export function ground(c) { const m = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: c })); m.rotation.x = -Math.PI / 2; m.position.y = -.01; return m; }
export function box(w, h, d, c, x = 0, y = 0, z = 0, e) { const m = mesh(new THREE.BoxGeometry(w, h, d), c, e); m.position.set(x, y + h / 2, z); return m; }
export function cyl(rt, rb, h, seg, c, x = 0, y = 0, z = 0, e) { const m = mesh(new THREE.CylinderGeometry(rt, rb, h, seg), c, e); m.position.set(x, y + h / 2, z); return m; }
export function ico(r, c, x = 0, y = 0, z = 0, detail = 0, e) { const m = mesh(new THREE.IcosahedronGeometry(r, detail), c, e); m.position.set(x, y, z); return m; }
/** 4-sided roof */
export function roof(w, h, d, c, x, y, z) { const m = mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.75, h, 4), c); m.rotation.y = Math.PI / 4; m.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d)); m.position.set(x, y + h / 2, z); return m; }

/** A low-poly person. g.userData.armR / armL are shoulder pivots (rotate .x to raise). */
export function person({ shirt = C.fog, hair = C.night, skin = C.skin, bun = false, pants = C.night, seated = false } = {}) {
  const g = new THREE.Group();
  if (!seated) { g.add(cyl(.12, .12, .7, 5, pants, -.14, 0, 0)); g.add(cyl(.12, .12, .7, 5, pants, .14, 0, 0)); }
  const y0 = seated ? 0 : .65;
  const body = mesh(new THREE.CylinderGeometry(.3, .42, 1, 7), shirt); body.position.y = y0 + .5; g.add(body);
  const head = mesh(new THREE.IcosahedronGeometry(.29, 1), skin); head.position.y = y0 + 1.33; g.add(head);
  const h = mesh(new THREE.IcosahedronGeometry(.31, 1), hair); h.position.set(0, y0 + 1.43, -.07); h.scale.set(1, .78, 1); g.add(h);
  if (bun) { const b = mesh(new THREE.IcosahedronGeometry(.13, 0), hair); b.position.set(0, y0 + 1.68, -.2); g.add(b); }
  const arm = (side) => {
    const pivot = new THREE.Group(); pivot.position.set(.36 * side, y0 + .92, 0);
    const a = mesh(new THREE.CylinderGeometry(.08, .08, .72, 5), shirt); a.position.y = -.34; pivot.add(a);
    const hand = mesh(new THREE.IcosahedronGeometry(.09, 0), skin); hand.position.y = -.72; pivot.add(hand);
    pivot.rotation.z = .12 * side; g.add(pivot); return pivot;
  };
  g.userData.armR = arm(1); g.userData.armL = arm(-1); g.userData.head = head;
  return g;
}

let _glow;
export function glowTex() {
  if (_glow) return _glow;
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(.4, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); return (_glow = new THREE.CanvasTexture(c));
}

/** A campfire. s = size, logs = 1 (single saleng stick) or more (teepee). Call fire.tick(t). */
export function fire(s = 1, logs = 4) {
  const g = new THREE.Group();
  for (let j = 0; j < logs; j++) {
    const len = logs === 1 ? 1.9 : 1.3 * s;
    const l = mesh(new THREE.CylinderGeometry(.07 * s + .04, .09 * s + .04, len, 6), j % 2 ? C.wood : C.dark);
    const a = (j / logs) * Math.PI * 2;
    const base = logs === 1 ? new THREE.Vector3(-.6, 0, 0) : new THREE.Vector3(Math.cos(a) * .7 * s, 0, Math.sin(a) * .7 * s);
    const top = logs === 1 ? new THREE.Vector3(.5, 1.1, 0) : new THREE.Vector3(0, 1.0 * s, 0);
    const dir = top.clone().sub(base).normalize();
    l.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    l.position.copy(base).addScaledVector(dir, len / 2);
    g.add(l);
  }
  const fl = new THREE.Group(); fl.position.set(logs === 1 ? .55 : 0, logs === 1 ? 1.05 : .25 * s, 0);
  const fm = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false });
  const outer = new THREE.Mesh(new THREE.IcosahedronGeometry(.55 * s, 0), fm(0xd8341f, .78)); outer.scale.y = 1.9; outer.position.y = .8 * s;
  const mid = new THREE.Mesh(new THREE.IcosahedronGeometry(.4 * s, 0), fm(0xff8a1e, .88)); mid.scale.y = 1.7; mid.position.set(0, .62 * s, .12 * s);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.22 * s, 0), fm(0xffe6a8, .95)); core.scale.y = 1.6; core.position.set(0, .42 * s, .3 * s);
  fl.add(outer, mid, core); g.add(fl);
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(4 * s + 1.6, 4 * s + 1.6), new THREE.MeshBasicMaterial({ map: glowTex(), color: 0xff8a3d, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  pool.rotation.x = -Math.PI / 2; pool.position.y = .02; g.add(pool);
  const light = new THREE.PointLight(0xff8a3d, 0, 6 * s + 3, 1.4); light.position.set(0, 1.3 * s, .9); g.add(light);
  const embers = [];
  for (let k = 0; k < 5 + 5 * logs; k++) {
    const e = new THREE.Mesh(new THREE.BoxGeometry(.06, .06, .06), new THREE.MeshBasicMaterial({ color: C.resin }));
    e.userData = { o: Math.random(), r: Math.random() }; g.add(e); embers.push(e);
  }
  let level = 1; // 0..1 how lit
  g.userData = {
    set level(v) { level = v; }, get level() { return level; },
    tick(t) {
      const L = Math.max(level, .0001);
      fl.scale.set(L * (1 + Math.sin(t / 90) * .05), L * (1 + Math.sin(t / 130) * .09), L);
      fl.rotation.y = t / 900;
      light.intensity = level * (8 + 6 * s) * (0.85 + Math.random() * .3);
      pool.material.opacity = level * (.5 + Math.random() * .08);
      embers.forEach((e) => {
        const u = e.userData; const k = ((t / 2500) + u.o) % 1;
        e.visible = level > .3;
        e.position.set(fl.position.x + Math.sin(k * 8 + u.r * 9) * .4 * s, fl.position.y + .3 + k * 3 * s, (u.r - .5) * s);
        e.scale.setScalar(Math.max(1 - k, .001));
      });
    },
  };
  return g;
}

/** A wall clock. clock.userData.set(hours) sets the hands (9.23 = 9:14). */
export function clock(r = .5, face = C.white, rim = C.night) {
  const g = new THREE.Group();
  const f = mesh(new THREE.CylinderGeometry(r, r, .08, 12), face); f.rotation.x = Math.PI / 2; g.add(f);
  const ring = mesh(new THREE.TorusGeometry(r, .06, 4, 12), rim); g.add(ring);
  const hand = (len, w, c) => { const p = new THREE.Group(); const m = mesh(new THREE.BoxGeometry(w, len, .03), c); m.position.y = len / 2; p.add(m); p.position.z = .07; g.add(p); return p; };
  const hh = hand(r * .5, .06, rim), mh = hand(r * .8, .04, rim), sh = hand(r * .85, .015, C.ember);
  g.userData.set = (hours) => { hh.rotation.z = -(hours % 12) / 12 * Math.PI * 2; mh.rotation.z = -(hours % 1) * Math.PI * 2; sh.rotation.z = -((hours * 60) % 1) * Math.PI * 2; };
  return g;
}

/** Glasses (for EO Optical). */
export function glasses(c = C.night) {
  const g = new THREE.Group();
  [-.13, .13].forEach((x) => { const r = mesh(new THREE.TorusGeometry(.09, .018, 4, 10), c); r.position.x = x; g.add(r); });
  g.add(box(.08, .02, .02, c, 0, -.01, 0));
  return g;
}

// ── Scene shell ─────────────────────────────────────────────
export function makeScene({ bg = C.bg, cam = [10, 9, 10], look = [0, 1.4, 0], zoom = 5, hemi = .9, fog } = {}) {
  const scene = new THREE.Scene();
  scene.background = bg === null ? null : new THREE.Color(bg);
  if (fog) scene.fog = new THREE.Fog(fog[0], fog[1], fog[2]);
  const camera = new THREE.OrthographicCamera(-zoom, zoom, zoom, -zoom, .1, 200);
  camera.position.set(...cam); camera.lookAt(...look);
  camera.userData = { zoom, look, base: cam.slice() };
  scene.add(new THREE.HemisphereLight(0xc9dccd, 0x2a1e12, hemi));
  return { scene, camera };
}
export function keyLight(scene, color = 0xfff1d6, intensity = 1, pos = [5, 10, 6], size = 9) {
  const l = new THREE.DirectionalLight(color, intensity); l.position.set(...pos); l.castShadow = true;
  l.shadow.mapSize.set(1024, 1024); Object.assign(l.shadow.camera, { left: -size, right: size, top: size, bottom: -size, far: 60 });
  l.shadow.bias = -0.0005; scene.add(l); return l;
}
/** gentle sideways sway of an iso camera */
export function sway(camera, t, amt = .6, speed = 3000) {
  const [x, y, z] = camera.userData.base; const L = camera.userData.look;
  camera.position.set(x + Math.sin(t / speed) * amt, y, z - Math.sin(t / speed) * amt * .4); camera.lookAt(...L);
}

// ── One shared WebGL renderer, moved into whichever slide is showing ──
export class Stage3D {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'gl';
    this.r = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.r.shadowMap.enabled = true; this.r.shadowMap.type = THREE.PCFSoftShadowMap;
    this.active = null; this.host = null; this.t0 = 0;
  }
  mount(host, sceneObj) {
    if (this.host && this.host !== host) {
      // leave a still frame behind so the slide wipe shows the old picture
      try { this.render(performance.now()); this.host.style.backgroundImage = `url(${this.canvas.toDataURL()})`; } catch (_) {}
    }
    this.host = host; this.active = sceneObj; this.t0 = performance.now();
    host.style.backgroundImage = 'none';
    host.appendChild(this.canvas);
    this.resize();
  }
  resize() {
    if (!this.host) return;
    const w = this.host.clientWidth, h = this.host.clientHeight;
    this.r.setPixelRatio(Math.min(2, (window.devicePixelRatio || 1) * (window.STAGE_SCALE || 1)));
    this.r.setSize(w, h, false);
    if (this.active.resize) return this.active.resize(w, h); // split scenes size their own cameras
    const cam = this.active.camera, z = cam.userData.zoom, a = w / h;
    cam.left = -z * a; cam.right = z * a; cam.top = z; cam.bottom = -z; cam.updateProjectionMatrix();
  }
  render(now) {
    if (!this.active) return;
    // rAF timestamps can be a little older than performance.now() at mount, so clamp at 0
    const t = now, since = Math.max(0, now - this.t0);
    this.active.tick?.(t, since);
    if (this.active.draw) this.active.draw(this.r); else this.r.render(this.active.scene, this.active.camera);
  }
}

// Click-through deck: fixed 1920x1080 stage scaled to fit the screen.
// Next: → Space PageDown Enter (clickers send PageDown) · Back: ← PageUp
// F = fullscreen · H = hide/show the buttons · #7 in the URL opens slide 7.
const stage = document.querySelector('.stage');
const slides = [...document.querySelectorAll('.slide')];
const counter = document.querySelector('.count');
const bar = document.querySelector('.progress i');
let current = -1;

// fill placeholders from content.js
const C = window.CONTENT || {};
document.querySelectorAll('[data-fill]').forEach((el) => {
  const v = C[el.dataset.fill];
  if (v == null) return;
  el.textContent = v;
  el.classList.toggle('todo', String(v).includes('___'));
});

// missing photos/screenshots show a labelled slot instead of a broken image
function markMissing(img) { img.closest('.media')?.classList.add('missing'); }
document.querySelectorAll('.media img').forEach((img) => {
  img.addEventListener('error', () => markMissing(img));
  if (img.complete && img.naturalWidth === 0) markMissing(img);
});

function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  window.STAGE_SCALE = s;
  document.dispatchEvent(new Event('stagefit'));
}

const stepsOf = (sl) => Math.max(0, ...[...sl.querySelectorAll('[data-step]')].map((e) => +e.dataset.step));
function setStep(sl, n) {
  sl.dataset.at = n;
  sl.querySelectorAll('[data-step]').forEach((e) => e.classList.toggle('shown', +e.dataset.step <= n));
  sl.querySelectorAll('[data-until]').forEach((e) => e.classList.toggle('gone', n >= +e.dataset.until));
  sl.dispatchEvent(new CustomEvent('slidestep', { bubbles: true, detail: n }));
}

function go(i, { instant = false, atEnd = false } = {}) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  if (i === current) return;
  const prev = slides[current];
  const next = slides[i];
  const back = i < current;
  document.dispatchEvent(new CustomEvent('slideleave', { detail: prev }));
  slides.forEach((s) => s.classList.remove('is-top'));
  if (prev) { prev.classList.remove('is-active'); prev.classList.add('is-leaving'); }
  next.classList.remove('is-leaving');
  next.classList.add('is-top');
  next.classList.toggle('back', back);
  next.classList.toggle('no-wipe', instant || !prev);
  void next.offsetWidth; // restart CSS animations on re-entry
  next.classList.add('is-active');
  current = i;
  setStep(next, atEnd ? stepsOf(next) : 0);
  counter.textContent = `${i + 1} / ${slides.length}`;
  bar.style.transform = `scaleX(${(i + 1) / slides.length})`;
  history.replaceState(null, '', `#${i + 1}`);
  next.dispatchEvent(new CustomEvent('slideenter', { bubbles: true }));
  setTimeout(() => prev && prev.classList.remove('is-leaving'), 900);
}

function forward() {
  const sl = slides[current];
  const at = +sl.dataset.at;
  if (at < stepsOf(sl)) setStep(sl, at + 1); else go(current + 1);
}
function backward() {
  const sl = slides[current];
  const at = +sl.dataset.at;
  if (at > 0) setStep(sl, at - 1); else go(current - 1, { atEnd: true });
}

addEventListener('resize', fit);
addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (n) go(n - 1); });
addEventListener('keydown', (e) => {
  // let a focused link/button handle its own Enter/Space (avoids double-advancing)
  if ((e.key === 'Enter' || e.key === ' ') && e.target.closest?.('a, button')) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); forward(); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); backward(); }
  else if (e.key === 'f' || e.key === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
  else if (e.key === 'h' || e.key === 'H') { document.body.classList.toggle('hide-ui'); }
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(slides.length - 1);
});
document.querySelector('.next').addEventListener('click', forward);
document.querySelector('.prev').addEventListener('click', backward);

fit();
go((parseInt(location.hash.slice(1), 10) || 1) - 1, { instant: true });

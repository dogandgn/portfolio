import assert from 'node:assert/strict';
import test from 'node:test';
import { createContourBackground } from '../src/components/ui/createContourBackground.js';

function fixture({ reduced = false, hidden = false, contextAvailable = true } = {}) {
  const environment = new EventTarget();
  const page = Object.assign(new EventTarget(), { hidden });
  const motion = Object.assign(new EventTarget(), { matches: reduced });
  const pending = new Map();
  let nextId = 0;
  let draws = 0;
  const context = {
    clearRect() { draws++; },
    setTransform() {}, beginPath() {}, moveTo() {}, quadraticCurveTo() {}, stroke() {},
  };
  const canvas = { getContext: () => contextAvailable ? context : null };
  Object.assign(environment, {
    document: page,
    innerWidth: 390,
    innerHeight: 844,
    devicePixelRatio: 3,
    matchMedia: () => motion,
    requestAnimationFrame(callback) {
      pending.set(++nextId, callback);
      return nextId;
    },
    cancelAnimationFrame(id) { pending.delete(id); },
  });
  const emit = (target, type, values = {}) =>
    target.dispatchEvent(Object.assign(new Event(type), values));
  const tick = () => {
    const callbacks = [...pending.values()];
    pending.clear();
    callbacks.forEach((callback) => callback());
  };
  const dispose = createContourBackground(canvas, environment);
  return { environment, page, motion, pending, canvas, emit, tick, dispose, draws: () => draws };
}

test('idle backgrounds draw once and cap pixel density', () => {
  const f = fixture();
  assert.equal(f.pending.size, 1);
  f.tick();
  assert.equal(f.draws(), 1);
  assert.equal(f.pending.size, 0);
  assert.equal(f.canvas.width, 780);
  assert.equal(f.canvas.height, 1688);
  f.dispose();
});

test('pointer events share one frame and leaving settles back to idle', () => {
  const f = fixture();
  f.tick();
  for (let i = 0; i < 20; i++) {
    f.emit(f.environment, 'mousemove', { clientX: 180, clientY: 200 });
  }
  assert.equal(f.pending.size, 1);
  f.tick();
  assert.equal(f.pending.size, 1);
  f.emit(f.environment, 'mouseleave');
  for (let i = 0; i < 200 && f.pending.size; i++) f.tick();
  assert.equal(f.pending.size, 0);
  f.dispose();
});

test('repeated hide and show never duplicate the animation loop', () => {
  const f = fixture();
  f.emit(f.environment, 'mousemove', { clientX: 180, clientY: 200 });
  f.tick();
  for (let i = 0; i < 5; i++) {
    f.page.hidden = true;
    f.emit(f.page, 'visibilitychange');
    assert.equal(f.pending.size, 0);
    f.emit(f.environment, 'mousemove', { clientX: 200, clientY: 200 });
    assert.equal(f.pending.size, 0);
    f.page.hidden = false;
    f.emit(f.page, 'visibilitychange');
    f.emit(f.page, 'visibilitychange');
    assert.equal(f.pending.size, 1);
    f.tick();
    assert.equal(f.pending.size, 1);
  }
  f.dispose();
});

test('reduced motion is static and preference changes apply without reloading', () => {
  const f = fixture({ reduced: true });
  f.tick();
  f.emit(f.environment, 'mousemove', { clientX: 180, clientY: 200 });
  assert.equal(f.pending.size, 0);
  f.motion.matches = false;
  f.emit(f.motion, 'change');
  f.emit(f.environment, 'mousemove', { clientX: 180, clientY: 200 });
  f.tick();
  assert.equal(f.pending.size, 1);
  f.motion.matches = true;
  f.emit(f.motion, 'change');
  f.tick();
  assert.equal(f.pending.size, 0);
  f.environment.innerWidth = 500;
  f.emit(f.environment, 'resize');
  f.tick();
  assert.equal(f.canvas.width, 1000);
  assert.equal(f.pending.size, 0);
  f.dispose();
});

test('hidden initial pages wait and disposal removes listeners and frames', () => {
  const f = fixture({ hidden: true });
  assert.equal(f.pending.size, 0);
  f.page.hidden = false;
  f.emit(f.page, 'visibilitychange');
  assert.equal(f.pending.size, 1);
  f.dispose();
  f.dispose();
  f.emit(f.environment, 'resize');
  f.emit(f.environment, 'mousemove', { clientX: 180, clientY: 200 });
  f.emit(f.page, 'visibilitychange');
  f.emit(f.motion, 'change');
  assert.equal(f.pending.size, 0);
  assert.equal(f.draws(), 0);
});

test('missing canvas support leaves the page usable', () => {
  const f = fixture({ contextAvailable: false });
  assert.equal(f.pending.size, 0);
  assert.doesNotThrow(f.dispose);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  getContourPoint,
  getTransitionLayout,
  getTransitionPose,
  transitionDurations,
} from '../src/components/portal/characterTransitionMath.js';

test('the guide grows from its launcher and approaches a viewport-safe destination', () => {
  for (const [width, height] of [[1024, 768], [1280, 800], [1910, 912]]) {
    const origin = { x: width - 100, y: height - 110 };
    const layout = getTransitionLayout(origin, width, height);
    const start = getTransitionPose('approach', 0, layout);
    const end = getTransitionPose('approach', 1, layout);
    assert.equal(start.x, origin.x);
    assert.equal(start.y, origin.y);
    assert.equal(start.size, 174);
    assert.ok(end.size > start.size);
    assert.ok(end.x - end.size / 2 > 0);
    assert.ok(end.x + end.size / 2 < width);
    assert.ok(end.y - end.size / 2 > 0);
    assert.ok(end.y + end.size / 2 < height);
  }
  const offscreen = getTransitionLayout({ x: -100, y: 7000 }, 1024, 768);
  assert.deepEqual(offscreen.origin, { x: 87, y: 681 });
});

test('visible pose changes are continuous through approach, pulling and takeoff', () => {
  const layout = getTransitionLayout({ x: 1800, y: 800 }, 1910, 912);
  for (const [before, after] of [['approach', 'part'], ['part', 'crouch'], ['crouch', 'jump']]) {
    const previous = getTransitionPose(before, 1, layout);
    const next = getTransitionPose(after, 0, layout);
    for (const key of ['x', 'y', 'size', 'opacity', 'opening', 'pull', 'copy']) {
      assert.ok(Math.abs(previous[key] - next[key]) < 1e-8, `${before}/${after}: ${key}`);
    }
  }
  assert.equal(getTransitionPose('jump', 1, layout).opacity, 0);
  assert.equal(getTransitionPose('reveal', 1, layout).opening, 1);
  assert.equal(Object.values(transitionDurations).reduce((sum, value) => sum + value), 5600);
});

test('the contour field separates horizontally with bounded, smooth motion', () => {
  const layout = getTransitionLayout({ x: 1300, y: 700 }, 1440, 900);
  for (const x of [layout.x - 140, layout.x + 140]) {
    const start = getContourPoint(x, layout.y, layout, 0);
    const end = getContourPoint(x, layout.y, layout, 1);
    assert.ok(Math.abs(end.x - layout.x) > Math.abs(start.x - layout.x));
    assert.ok(Math.abs(end.x - start.x) < layout.size * 0.36);
    const middle = getContourPoint(x, layout.y, layout, 0.5);
    assert.ok(Math.abs(middle.x - (start.x + end.x) / 2) < 1e-8);
  }
});

test('all transition phases remain finite, reveal forward and finish invisibly', () => {
  const layout = getTransitionLayout({ x: 1800, y: 800 }, 1910, 912);
  let opening = 0;
  for (const phase of Object.keys(transitionDurations)) {
    for (let step = 0; step <= 100; step++) {
      const pose = getTransitionPose(phase, step / 100, layout);
      assert.ok(Object.values(pose).every(Number.isFinite));
      assert.ok(pose.opening >= opening - 1e-10 && pose.opening <= 1);
      assert.ok(pose.opacity >= 0 && pose.opacity <= 1);
      opening = pose.opening;
    }
  }
});

test('the transition keeps deadlines and cleanup without the former black-hole shader', () => {
  const source = readFileSync(new URL('../src/components/portal/runPortalTransition.js', import.meta.url), 'utf8');
  assert.ok(source.includes("canvas.getContext('2d')"));
  assert.ok(!source.includes('ShaderMaterial'));
  assert.ok(!source.includes('vortex'));
  assert.ok(source.includes('atlas.decode()'));
  assert.ok(source.includes('withDeadline(onCovered(), 8000, signal)'));
  assert.ok(source.includes('cancelAnimationFrame(frame)'));
  assert.ok(source.includes('invitation.style.visibility = invitationVisibility'));
  assert.ok(source.includes('document.body.style.overflow = overflow'));
  assert.ok(source.includes('canvas.remove()'));
});

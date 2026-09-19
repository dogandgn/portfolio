import assert from 'node:assert/strict';
import test from 'node:test';
import {
  easePortal,
  getPortalBounds,
  withDeadline,
} from '../src/components/portal/portalMath.js';

test('portal origin is normalized and its radius covers every corner', () => {
  for (const origin of [
    { x: 1360, y: 820 },
    { x: 720, y: 450 },
    { x: -20, y: 2000 },
  ]) {
    const bounds = getPortalBounds(origin, 1440, 900);
    assert.ok(bounds.x >= 0 && bounds.x <= 1);
    assert.ok(bounds.y >= 0 && bounds.y <= 1);
    for (const x of [0, 1]) {
      for (const y of [0, 1]) {
        assert.ok(
          Math.hypot(((x - bounds.x) * 1440) / 900, y - bounds.y) <=
            bounds.radius + 1e-10,
        );
      }
    }
  }
});

test('portal easing stays bounded and moves forward', () => {
  assert.equal(easePortal(-1), 0);
  assert.equal(easePortal(2), 1);
  assert.equal(easePortal(0.5), 0.5);
  let previous = 0;
  for (let index = 0; index <= 100; index += 1) {
    const value = easePortal(index / 100);
    assert.ok(value >= previous && value <= 1);
    previous = value;
  }
});

test('deadline preserves results and failures', async () => {
  assert.equal(await withDeadline(Promise.resolve('ready'), 100), 'ready');
  await assert.rejects(
    withDeadline(Promise.reject(new Error('failed')), 100),
    /failed/,
  );
});

test('a stalled transition times out', async () => {
  await assert.rejects(withDeadline(new Promise(() => {}), 5), /timed out/);
});

test('cancellation stops waiting and consumes late rejection', async () => {
  const controller = new AbortController();
  let fail;
  const pending = withDeadline(
    new Promise((resolve, reject) => {
      fail = reject;
    }),
    100,
    controller.signal,
  );
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  fail(new Error('late failure'));
  await assert.rejects(
    withDeadline(
      Promise.reject(new Error('already failed')),
      100,
      controller.signal,
    ),
    { name: 'AbortError' },
  );
});

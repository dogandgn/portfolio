import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createProjectHighlight } from '../src/components/city/createProjectHighlight.js';
import { landmarks } from '../src/components/city/cityLayout.js';

function setup(t) {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const selection = createProjectHighlight(scene, geometry);
  t.after(() => {
    selection.dispose();
    geometry.dispose();
  });
  return { scene, selection };
}

function settle(selection) {
  for (let frame = 0; frame < 100; frame += 1) selection.update(1 / 60, false);
  assert.equal(selection.update(1 / 60, false), false);
}

test('each selected project keeps only its own building outlined', (t) => {
  const { scene, selection } = setup(t);
  for (const landmark of landmarks) {
    selection.setActive(landmark.projectId);
    assert.equal(selection.update(1 / 60, false), true);
    settle(selection);
    assert.deepEqual(
      scene.children
        .filter((group) => group.visible)
        .map((group) => group.name),
      [`city-highlight-${landmark.id}`],
    );
    selection.setActive(landmark.projectId);
    assert.equal(selection.update(1 / 60, false), false);
  }
  selection.setActive(undefined);
  settle(selection);
  assert.equal(
    scene.children.some((group) => group.visible),
    false,
  );
});

test('reduced motion keeps a static highlight without a reveal animation', (t) => {
  const { scene, selection } = setup(t);
  selection.setActive(2);
  assert.equal(selection.update(1 / 60, true), false);
  const active = scene.getObjectByName('city-highlight-widgets');
  assert.equal(active.visible, true);
  assert.equal(active.children.find((child) => child.isGroup).visible, false);
  selection.setActive('luma');
  assert.equal(selection.update(1 / 60, true), false);
  assert.equal(active.visible, false);
  assert.equal(scene.getObjectByName('city-highlight-luma').visible, true);
});

test('rapid changes and unknown selections do not leave a stale outline', (t) => {
  const { scene, selection } = setup(t);
  for (const projectId of [1, 2, 'luma', 'birdmap', 3]) {
    selection.setActive(projectId);
    selection.update(1 / 60, false);
  }
  settle(selection);
  assert.deepEqual(
    scene.children.filter((group) => group.visible).map((group) => group.name),
    ['city-highlight-automation'],
  );
  selection.setActive('missing');
  settle(selection);
  assert.equal(
    scene.children.some((group) => group.visible),
    false,
  );
});

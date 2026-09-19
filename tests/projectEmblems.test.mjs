import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createProjectEmblems } from '../src/components/city/createProjectEmblems.js';

function setup(t) {
  const scene = new THREE.Scene();
  const emblems = createProjectEmblems(scene);
  t.after(() => emblems.dispose());
  return { scene, emblems };
}

test('sculptures and entrance badges belong to their project', (t) => {
  const { scene, emblems } = setup(t);
  assert.equal(scene.children.length, 5);
  assert.deepEqual(
    new Set(emblems.hitTargets.map((mesh) => mesh.userData.projectId)),
    new Set([1, 2, 3, 'luma', 'birdmap']),
  );
  for (const mesh of emblems.hitTargets) {
    const positions = mesh.geometry.attributes.position.array;
    assert.ok(positions.every(Number.isFinite));
  }
  assert.equal(emblems.update(1 / 60, false), false);
});

test('selection animates once, then returns to demand rendering', (t) => {
  const { emblems, scene } = setup(t);
  for (const id of [1, 2, 'luma', 'birdmap', 3]) {
    emblems.setActive(id);
    assert.equal(emblems.update(1 / 60, false), true);
    for (let frame = 0; frame < 300; frame += 1) emblems.update(1 / 60, false);
    assert.equal(emblems.update(1 / 60, false), false);
    emblems.setActive(id);
    assert.equal(emblems.update(1 / 60, false), false);
  }
  const bird = scene.getObjectByName('bird-sculpture');
  assert.equal(bird.position.y, 1.3);
});

test('new project details move on selection and reset when leaving', (t) => {
  const { scene, emblems } = setup(t);
  const cases = [
    { id: 1, name: 'parcel-pin', axis: 'y', base: 0.03 },
    { id: 2, name: 'widget-layer-2', axis: 'y', base: 0.4 },
    { id: 'luma', name: 'luma-tower-1', axis: 'y', base: -0.6 },
  ];
  for (const item of cases) {
    emblems.setActive(item.id);
    emblems.update(1, false);
    const object = scene.getObjectByName(item.name);
    assert.ok(object.position[item.axis] > item.base);
    emblems.setActive(null);
    emblems.update(1, true);
    assert.equal(object.position[item.axis], item.base);
  }
});

test('reduced motion is static and changing projects resets moving parts', (t) => {
  const { emblems, scene } = setup(t);
  emblems.setActive('birdmap');
  assert.equal(emblems.update(1 / 60, true), false);
  assert.equal(scene.getObjectByName('bird-sculpture').position.y, 1.5);
  emblems.setActive(3);
  emblems.update(0.1, false);
  emblems.setActive(null);
  assert.equal(emblems.update(0.1, true), false);
  assert.equal(scene.getObjectByName('python-sculpture').rotation.y, 0.28);
  emblems.setTheme(true);
  emblems.setTheme(false);
});

test('disposing removes emblems and releases shared resources once', (t) => {
  const { scene, emblems } = setup(t);
  const geometries = new Set(emblems.hitTargets.map((mesh) => mesh.geometry));
  let released = 0;
  geometries.forEach((geometry) =>
    geometry.addEventListener('dispose', () => {
      released += 1;
    }),
  );
  emblems.dispose();
  emblems.dispose();
  assert.equal(scene.children.length, 0);
  assert.equal(released, geometries.size);
  assert.equal(emblems.update(0.1, false), false);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  cityStops,
  getCameraPose,
  getStreetBlend,
  finaleBuildings,
  createBuildings,
  overlaps,
} from '../src/components/city/cityLayout.js';
import { createStreetFinale } from '../src/components/city/createStreetFinale.js';

test('the descent is continuous and street travel stays inside the paved route', () => {
  const qgis = cityStops.findIndex((stop) => stop.id === 'qgis');
  const street = qgis + 1;
  const denominator = cityStops.length - 1;
  let height = getCameraPose(qgis / denominator)[1];
  for (let step = 0; step <= 100; step++) {
    const progress = (qgis + step / 100) / denominator;
    const pose = getCameraPose(progress);
    assert.ok(pose[1] <= height + 1e-10);
    height = pose[1];
  }
  assert.equal(height, 1.85);
  assert.equal(getStreetBlend(qgis / denominator), 0);
  assert.equal(getStreetBlend(street / denominator), 1);
  for (let step = 0; step <= 500; step++) {
    const progress =
      (street + (step / 500) * (denominator - street)) / denominator;
    const [x, y, z] = getCameraPose(progress);
    assert.equal(y, 1.85);
    assert.ok(x >= 25.5 && x <= 33.001 && z >= 9 && z <= 18.701);
    assert.ok(Math.min(Math.abs(z - 9), Math.abs(x - 33)) <= 1.2);
  }
  finaleBuildings.forEach((building) => {
    assert.ok(
      createBuildings().every((other) => !overlaps(building, other, 1)),
    );
  });
});

test('each final building raycasts to its own action and animations settle', () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const finale = createStreetFinale(scene, geometry);
  assert.equal(finale.isEnabled(), false);
  assert.equal(finale.update(1, 0.016, false), true);
  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3(...getCameraPose(1).slice(0, 3));
  scene.updateMatrixWorld(true);
  for (const building of finaleBuildings) {
    const target = new THREE.Vector3(building.x, 1.6, building.z);
    raycaster.set(origin, target.sub(origin).normalize());
    const hit = raycaster.intersectObjects(finale.hitTargets, false)[0];
    assert.equal(hit.object.userData.action, building.id);
  }
  finale.setHovered('restart');
  for (let step = 0; step < 250; step++) finale.update(1, 0.016, false);
  assert.equal(finale.update(1, 0.016, false), false);
  finale.update(0, 0.016, true);
  assert.equal(finale.isEnabled(), false);
  assert.equal(scene.getObjectByName('city-street-finale').visible, false);
  finale.dispose();
  geometry.dispose();
});

test('reduced motion is static and final resources are released once', () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const finale = createStreetFinale(scene, geometry);
  const resources = new Set();
  scene.traverse((object) => {
    if (object.isMesh) {
      resources.add(object.material);
      if (object.geometry !== geometry) resources.add(object.geometry);
    }
  });
  let released = 0;
  resources.forEach((resource) =>
    resource.addEventListener('dispose', () => released++),
  );
  assert.equal(finale.update(1, 0.016, true), false);
  finaleBuildings.forEach(({ id }) => {
    assert.equal(scene.getObjectByName(`city-finale-${id}`).position.y, 0);
  });
  finale.dispose();
  finale.dispose();
  assert.equal(released, resources.size);
  assert.equal(scene.children.length, 0);
  geometry.dispose();
});

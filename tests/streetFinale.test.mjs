import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { readFileSync } from 'node:fs';
import actionFont from '../src/components/city/actionFont.json' with { type: 'json' };
import {
  cityStops,
  getCameraPose,
  getStreetBlend,
  finaleActions,
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
  finaleActions.forEach((action) => {
    assert.ok(
      createBuildings().every(
        (other) => !overlaps({ ...action, width: 2, depth: 1 }, other, 1),
      ),
    );
  });
});

test('each final symbol raycasts to its own action and animations settle', () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const finale = createStreetFinale(scene);
  assert.equal(finale.isEnabled(), false);
  assert.equal(finale.update(1, 0.016, false), true);
  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3(...getCameraPose(1).slice(0, 3));
  scene.updateMatrixWorld(true);
  for (const action of finaleActions) {
    const arrow = finale.hitTargets.find(
      (mesh) =>
        mesh.userData.action === action.id &&
        mesh.geometry.type === 'ConeGeometry',
    );
    const target = arrow.getWorldPosition(new THREE.Vector3());
    raycaster.set(origin, target.sub(origin).normalize());
    const hit = raycaster.intersectObjects(finale.hitTargets, false)[0];
    assert.equal(hit.object.userData.action, action.id);
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
  const finale = createStreetFinale(scene);
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
  finaleActions.forEach(({ id }) => {
    assert.equal(scene.getObjectByName(`city-finale-${id}`).position.y, 0);
  });
  finale.dispose();
  finale.dispose();
  assert.equal(released, resources.size);
  assert.equal(scene.children.length, 0);
  geometry.dispose();
});

test('translated 3D labels include Turkish glyphs and replace geometry without leaks', () => {
  const scene = new THREE.Scene();
  const finale = createStreetFinale(scene);
  const labels = ['tr', 'en'].map((language) => {
    const translation = JSON.parse(
      readFileSync(
        new URL(`../src/i18n/locales/city.${language}.json`, import.meta.url),
        'utf8',
      ),
    );
    return { restart: translation.restart, return: translation.return };
  });
  labels.forEach((label) =>
    Object.values(label).forEach((text) => {
      for (const character of text) assert.ok(actionFont.glyphs[character]);
    }),
  );
  const oldText = finale.hitTargets.filter(
    (mesh) => mesh.geometry.type === 'TextGeometry',
  );
  let released = 0;
  oldText.forEach((mesh) =>
    mesh.geometry.addEventListener('dispose', () => released++),
  );
  finale.setLabels(labels[1]);
  assert.equal(released, oldText.length);
  assert.ok(oldText.every((mesh) => !finale.hitTargets.includes(mesh)));
  const translatedMeshes = [...finale.hitTargets];
  finale.setLabels(labels[1]);
  assert.deepEqual(finale.hitTargets, translatedMeshes);
  finale.dispose();
});

test('the ending presents services and contact continuously without separate interlude headings', () => {
  const content = readFileSync(
    new URL('../src/components/city/CityStopContent.jsx', import.meta.url),
    'utf8',
  );
  const experience = readFileSync(
    new URL('../src/components/city/CityExperience.jsx', import.meta.url),
    'utf8',
  );
  assert.ok(!content.includes("case 'street'"));
  assert.ok(!content.includes("case 'finish'"));
  assert.ok(experience.includes('city-continuous-copy'));
  assert.ok(experience.includes('city-action-accessible-label'));
  const camera = new THREE.PerspectiveCamera(52, 2.1, 0.12, 250);
  const pose = getCameraPose(1);
  camera.position.set(...pose.slice(0, 3));
  camera.lookAt(...pose.slice(3));
  camera.updateMatrixWorld(true);
  finaleActions.forEach((action) => {
    const point = new THREE.Vector3(action.x, 1.85, action.z).project(camera);
    assert.ok(point.x > 0.1 && point.x < 0.95);
  });
});

test('both choices stay centered in the right content area at desktop widths', () => {
  for (const [width, height] of [
    [1910, 912],
    [1280, 800],
    [1024, 768],
  ]) {
    const aspect = width / height;
    const fov = THREE.MathUtils.radToDeg(
      2 *
        Math.atan(
          Math.tan(THREE.MathUtils.degToRad(26)) * Math.max(1, 2.1 / aspect),
        ),
    );
    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.12, 250);
    const pose = getCameraPose(1);
    camera.position.set(...pose.slice(0, 3));
    camera.lookAt(...pose.slice(3));
    camera.updateMatrixWorld(true);
    const positions = finaleActions.map((action) =>
      new THREE.Vector3(action.x, 1.85, action.z).project(camera),
    );
    const center =
      positions.reduce((sum, point) => sum + (point.x + 1) / 2, 0) /
      positions.length;
    assert.ok(center > 0.64 && center < 0.68);
    positions.forEach((point) => {
      assert.ok((point.x + 1) / 2 > 0.54 && (point.x + 1) / 2 < 0.8);
      assert.ok(Math.abs(point.y) < 1e-10);
    });
  }
});

test('sculpture entry and hover animations settle and reduced motion skips movement', () => {
  const scene = new THREE.Scene();
  const finale = createStreetFinale(scene);
  const restart = scene.getObjectByName('city-finale-restart');
  const icon = restart.children[0];
  const symbol = icon.children[1];
  finale.update(1, 0.05, false);
  assert.ok(symbol.rotation.z > 1);
  assert.ok(icon.children[0].children[0].children.length === 3);
  for (let frame = 0; frame < 100; frame++) finale.update(1, 0.05, false);
  assert.equal(finale.update(1, 0.05, false), false);
  assert.equal(symbol.rotation.z, 0);
  finale.setHovered('restart');
  finale.update(1, 0.2, false);
  assert.ok(symbol.rotation.z > 0.1);
  for (let frame = 0; frame < 100; frame++) finale.update(1, 0.05, false);
  assert.equal(finale.update(1, 0.05, false), false);
  finale.setHovered('return');
  assert.equal(finale.update(1, 0.05, true), false);
  assert.equal(symbol.rotation.z, 0);
  assert.equal(restart.position.y, 0);
  finale.dispose();
});

test('the portfolio return symbol points diagonally up and left', () => {
  const scene = new THREE.Scene();
  const finale = createStreetFinale(scene);
  const arrow = finale.hitTargets.find((mesh) => mesh.userData.action === 'return' && mesh.geometry.type === 'ConeGeometry');
  assert.ok(arrow.position.x < 0 && arrow.position.y > 0);
  assert.equal(arrow.rotation.z, Math.PI / 4);
  const shaft = finale.hitTargets.find((mesh) => mesh.userData.action === 'return' && mesh.geometry.type === 'TubeGeometry');
  const path = shaft.geometry.parameters.path;
  assert.equal(path.type, 'LineCurve3');
  assert.ok(path.v1.x > path.v2.x && path.v1.y < path.v2.y);
  finale.dispose();
});

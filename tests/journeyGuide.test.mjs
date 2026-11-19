import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createJourneyGuide } from '../src/components/city/createJourneyGuide.js';
import { cityStops, getCameraPose, getRouteDistance, landmarks, createBuildings, pavementHeight } from '../src/components/city/cityLayout.js';
import { getGuidePoint, getGuideHeading, getJourneyCameraPose } from '../src/components/city/guideJourney.js';

test('the runner rounds both corners without leaving the pavement', () => {
  for (const corner of [28, 86]) {
    let previous = getGuidePoint(corner - 2);
    for (let step = 1; step <= 400; step++) {
      const distance = corner - 2 + step / 100;
      const point = getGuidePoint(distance);
      assert.ok(Math.hypot(point.x - previous.x, point.z - previous.z) < 0.011);
      assert.ok(Math.abs(getGuideHeading(distance) - getGuideHeading(distance - 0.001)) < 0.01);
      assert.ok(Math.abs(point.z - 9) <= 1.2 || Math.abs(point.x - (corner === 28 ? -25 : 33)) <= 1.2);
      previous = point;
    }
  }
});

test('the chase camera descends smoothly and preserves the final choices framing', () => {
  const denominator = cityStops.length - 1;
  const start = cityStops.findIndex(({ id }) => id === 'qgis') / denominator;
  const end = cityStops.findIndex(({ id }) => id === 'contact') / denominator;
  let previous = getJourneyCameraPose(start);
  const buildings = [...createBuildings(), ...landmarks];
  for (let step = 1; step <= 5000; step++) {
    const progress = start + (1 - start) * step / 5000;
    const pose = getJourneyCameraPose(progress);
    pose.forEach((value, axis) => {
      assert.ok(Number.isFinite(value));
      assert.ok(Math.abs(value - previous[axis]) < 0.1);
    });
    for (const building of buildings) {
      if (Math.abs(pose[0] - building.x) < building.width / 2 + 0.3 &&
          Math.abs(pose[2] - building.z) < building.depth / 2 + 0.3) {
        assert.ok(pose[1] > building.height + 0.3);
      }
    }
    previous = pose;
  }
  assert.deepEqual(getJourneyCameraPose(start), getCameraPose(start));
  assert.deepEqual(getJourneyCameraPose(1), getCameraPose(1));
  const street = cityStops.findIndex(({ id }) => id === 'street') / denominator;
  for (let progress = street; progress <= end; progress += 0.005) {
    const pose = getJourneyCameraPose(progress);
    const guide = getGuidePoint(getRouteDistance(progress));
    assert.ok(Math.hypot(guide.x - pose[0], guide.z - pose[2]) > 3.1);
    assert.ok(pose[1] > 2 && pose[1] < 3);
    for (const aspect of [2.1, 1.6, 4 / 3]) {
      const fov = THREE.MathUtils.radToDeg(2 * Math.atan(
        Math.tan(THREE.MathUtils.degToRad(26)) * Math.max(1, 2.1 / aspect),
      ));
      const camera = new THREE.PerspectiveCamera(fov, aspect, 0.12, 250);
      camera.position.set(...pose.slice(0, 3));
      camera.lookAt(...pose.slice(3));
      camera.updateMatrixWorld(true);
      const point = new THREE.Vector3(guide.x, 1.25, guide.z).project(camera);
      assert.ok(point.z > -1 && point.z < 1);
      assert.ok(point.x > 0.05 && point.x < 0.85);
    }
  }
});

const source = await readFile(new URL('../public/mascot/kent-robotu.glb', import.meta.url));
function loadRobot() {
  return new GLTFLoader().parseAsync(Uint8Array.from(source).buffer, '');
}

test('the city robot follows the route, turns back and settles into a stationary pose', async () => {
  const scene = new THREE.Scene();
  const asset = await loadRobot();
  const guide = createJourneyGuide(scene, undefined, Promise.resolve(asset));
  await Promise.resolve();
  const root = scene.getObjectByName('city-journey-guide');
  const body = scene.getObjectByName('kent-robotu');
  const bounds = new THREE.Box3();
  guide.update(0, 1 / 60, false, true);
  scene.updateMatrixWorld(true);
  bounds.setFromObject(body, true);
  assert.ok(Math.abs(bounds.max.y - bounds.min.y - 1.78) < 0.001);
  assert.ok(Math.abs(bounds.min.y - pavementHeight - 0.004) < 0.001);
  const progress = cityStops.findIndex(({ id }) => id === 'street') / (cityStops.length - 1);
  guide.update(progress, 1 / 60, false, true);
  const foot = scene.getObjectByName('FootL_1');
  const rest = new THREE.Vector3();
  body.worldToLocal(foot.getWorldPosition(rest));
  for (let index = 1; index <= 45; index++) guide.update(progress + index * 0.0003, 1 / 60);
  const moving = body.worldToLocal(foot.getWorldPosition(new THREE.Vector3()));
  assert.ok(rest.distanceTo(moving) > 0.01);
  for (let index = 44; index >= 0; index--) guide.update(progress + index * 0.0003, 1 / 60);
  for (let index = 0; index < 180; index++) guide.update(progress, 1 / 60);
  const heading = getGuideHeading(getRouteDistance(progress));
  assert.ok(Math.cos(root.rotation.y - heading) < -0.99);
  assert.equal(guide.update(progress, 1 / 60), false);
  assert.equal(guide.update(0.78, 1 / 60, true), false);
  guide.update(1, 1 / 60, true);
  assert.equal(root.visible, false);
  guide.dispose();
  assert.equal(scene.children.length, 0);
});

test('the guide releases robot resources once, including a download finishing after exit', async () => {
  for (const leaveEarly of [true, false]) {
    const asset = await loadRobot();
    const resources = new Set();
    asset.scene.traverse(o => {
      if (!o.isMesh) return;
      resources.add(o.geometry);
      resources.add(o.material);
      if (o.skeleton) resources.add(o.skeleton);
    });
    let disposed = 0;
    resources.forEach(r => r.addEventListener?.('dispose', () => disposed++));
    const scene = new THREE.Scene();
    const guide = createJourneyGuide(scene, undefined, Promise.resolve(asset));
    if (leaveEarly) guide.dispose();
    await Promise.resolve();
    guide.dispose();
    guide.dispose();
    assert.equal(disposed, [...resources].filter(r => r.addEventListener).length);
    assert.equal(scene.children.length, 0);
  }
});

import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createJourneyGuide } from '../src/components/city/createJourneyGuide.js';
import { cityStops, getCameraPose, getRouteDistance, landmarks, createBuildings } from '../src/components/city/cityLayout.js';
import { getGuidePoint, getGuideHeading, getJourneyCameraPose, getRunPose } from '../src/components/city/guideJourney.js';

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
  for (let progress = 0.75; progress <= end; progress += 0.005) {
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

test('the rig runs only while travelling, stops and respects reduced motion', () => {
  const scene = new THREE.Scene();
  const guide = createJourneyGuide(scene);
  const root = scene.getObjectByName('city-journey-guide');
  guide.update(0.7, 1 / 60, false, true);
  assert.ok(scene.getObjectByName('guide-ruler'));
  for (let index = 1; index <= 60; index++) guide.update(0.7 + index * 0.0003, 1 / 60);
  assert.notEqual(scene.getObjectByName('guide-hip--1').rotation.x, 0);
  for (let index = 0; index < 150; index++) guide.update(0.718, 1 / 60);
  assert.equal(guide.update(0.718, 1 / 60), false);
  assert.equal(scene.getObjectByName('guide-hip--1').rotation.x, 0);
  assert.equal(guide.update(0.78, 1 / 60, true), false);
  assert.equal(scene.getObjectByName('guide-hip--1').rotation.x, 0);
  assert.equal(guide.update(0, 1 / 60, false, true), false);
  assert.equal(root.position.x, -25);
  assert.equal(root.position.z, -19);
  assert.deepEqual(getRunPose(1, 0), getRunPose(2, 0));
  guide.dispose();
});

test('guide resources are released once and the scene is detached', () => {
  const scene = new THREE.Scene();
  const guide = createJourneyGuide(scene);
  const resources = new Set();
  let meshes = 0;
  let triangles = 0;
  scene.traverse((object) => {
    if (object.isMesh) {
      resources.add(object.geometry);
      resources.add(object.material);
      meshes++;
      triangles += (object.geometry.index?.count || object.geometry.attributes.position.count) / 3;
    }
  });
  assert.ok(meshes <= 32);
  assert.ok(triangles < 40000);
  let disposed = 0;
  resources.forEach((resource) => resource.addEventListener('dispose', () => disposed++));
  guide.dispose();
  guide.dispose();
  assert.equal(disposed, resources.size);
  assert.equal(scene.children.length, 0);
});

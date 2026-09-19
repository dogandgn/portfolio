import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  clampProgress,
  createBuildings,
  getCameraPose,
  intersectsRoute,
  landmark,
  route,
  landmarks,
  parks,
  overlaps,
  cityStops,
  districts,
  getJourneyProgress,
  getRouteDistance,
  getRoutePoint,
} from '../src/components/city/cityLayout.js';

test('layout is deterministic and preserves the selected building', () => {
  assert.deepEqual(createBuildings(), createBuildings());
  assert.ok(createBuildings().length > 20);
  assert.ok(createBuildings(true).length < createBuildings().length);
  for (const building of createBuildings()) {
    assert.ok(building.width > 0 && building.depth > 0 && building.height > 0);
    const overlaps =
      Math.abs(building.x - landmark.x) <
        (building.width + landmark.width) / 2 &&
      Math.abs(building.z - landmark.z) < (building.depth + landmark.depth) / 2;
    assert.equal(overlaps, false);
    assert.equal(intersectsRoute(building), false);
  }
});

test('route uses connected horizontal and vertical segments', () => {
  route.slice(1).forEach(([x, z], index) => {
    assert.ok(x === route[index][0] || z === route[index][1]);
  });
  assert.equal(intersectsRoute(landmark), false);
});

test('progress is bounded for malformed and out-of-range inputs', () => {
  assert.equal(clampProgress(-5), 0);
  assert.equal(clampProgress(5), 1);
  assert.equal(clampProgress(NaN), 0);
  assert.equal(clampProgress(Infinity), 0);
  assert.equal(clampProgress(0.4), 0.4);
});

test('camera remains finite and continuous along both routes', () => {
  for (const compact of [false, true]) {
    let previous = getCameraPose(0, compact);
    const samples = 1000 * (cityStops.length - 1);
    for (let step = 1; step <= samples; step += 1) {
      const pose = getCameraPose(step / samples, compact);
      assert.equal(pose.length, 6);
      pose.forEach((value, index) => {
        assert.ok(Number.isFinite(value));
        assert.ok(Math.abs(value - previous[index]) < 0.15);
      });
      assert.ok(pose[1] >= 7.5);
      previous = pose;
    }
    assert.deepEqual(getCameraPose(-1, compact), getCameraPose(0, compact));
    assert.deepEqual(getCameraPose(2, compact), getCameraPose(1, compact));
  }
});

test('chapter order and project identities match the portfolio journey', () => {
  assert.deepEqual(
    cityStops.map((stop) => stop.id),
    [
      'overview',
      'about',
      'projects',
      'property',
      'widgets',
      'automation',
      'luma',
      'birdmap',
      'services',
      'contact',
    ],
  );
  assert.deepEqual(
    cityStops
      .filter((stop) => stop.projectId != null)
      .map((stop) => stop.projectId),
    [1, 2, 3, 'luma', 'birdmap'],
  );
  cityStops.forEach((stop, index) =>
    assert.deepEqual(getCameraPose(index / (cityStops.length - 1)), stop.pose),
  );
});

test('all landmarks and parks remain clear of background buildings', () => {
  for (const building of createBuildings()) {
    assert.equal(
      landmarks.some((target) => overlaps(building, target, 2)),
      false,
    );
    assert.equal(
      parks.some((park) => overlaps(building, park)),
      false,
    );
  }
  landmarks.forEach((building) =>
    assert.equal(intersectsRoute(building), false),
  );
});

test('expanded content keeps scroll progress aligned with actual section offsets', () => {
  assert.equal(getJourneyProgress(0, [0, 900, 3400, 4300]), 0);
  assert.equal(getJourneyProgress(900, [0, 900, 3400, 4300]), 1 / 3);
  assert.equal(getJourneyProgress(2150, [0, 900, 3400, 4300]), 0.5);
  assert.equal(getJourneyProgress(3400, [0, 900, 3400, 4300]), 2 / 3);
  assert.equal(getJourneyProgress(9999, [0, 900, 3400, 4300]), 1);
  assert.equal(getJourneyProgress(50, []), 0);
});

test('camera transitions are continuous at every stop', () => {
  for (let index = 1; index < cityStops.length - 1; index += 1) {
    const progress = index / (cityStops.length - 1);
    const before = getCameraPose(progress - 0.000001);
    const after = getCameraPose(progress + 0.000001);
    before.forEach((value, axis) =>
      assert.ok(Math.abs(value - after[axis]) < 0.001),
    );
  }
});

test('both languages cover every city stop and project marker', () => {
  const translations = ['tr', 'en'].map((language) =>
    JSON.parse(
      readFileSync(
        new URL(`../src/i18n/locales/city.${language}.json`, import.meta.url),
        'utf8',
      ),
    ),
  );
  for (const translation of translations) {
    cityStops.forEach((stop) => {
      assert.ok(translation.stops[stop.id]);
      assert.ok(translation.chapters[stop.chapter]);
    });
    landmarks.forEach((building) => assert.ok(translation.marker[building.id]));
  }
  assert.deepEqual(
    Object.keys(translations[0]).sort(),
    Object.keys(translations[1]).sort(),
  );
});

test('contact returns to the exact opening view', () => {
  for (const compact of [false, true]) {
    assert.deepEqual(getCameraPose(0, compact), getCameraPose(1, compact));
  }
});

test('camera azimuth stays fixed while descending to the project street', () => {
  for (let step = 0; step <= 1000; step += 1) {
    const pose = getCameraPose(step / 1000);
    const distance = pose[2] - pose[5];
    assert.ok(Math.abs((pose[0] - pose[3]) / distance - 0.6) < 1e-10);
    assert.ok(pose[1] > pose[4]);
  }
  const onwardStops = cityStops.slice(1, -1);
  onwardStops.slice(1).forEach((stop, index) => {
    assert.ok(stop.pose[3] >= onwardStops[index].pose[3]);
  });
});

test('camera velocity is continuous through project stops', () => {
  const epsilon = 0.00001;
  cityStops.slice(1, -1).forEach((stop, index) => {
    const progress = (index + 1) / (cityStops.length - 1);
    const before = getCameraPose(progress - epsilon);
    const at = getCameraPose(progress);
    const after = getCameraPose(progress + epsilon);
    at.forEach((value, axis) => {
      const incoming = (value - before[axis]) / epsilon;
      const outgoing = (after[axis] - value) / epsilon;
      assert.ok(Math.abs(incoming - outgoing) < 0.5);
    });
    if (['widgets', 'automation', 'luma'].includes(stop.id)) {
      assert.ok((after[0] - before[0]) / (2 * epsilon) > 10);
      assert.equal(at[1], 7.5);
    }
  });
});

test('the camera stays clear of city volumes during the low pass', () => {
  const buildings = [...createBuildings(), ...landmarks];
  for (let step = 0; step <= 2000; step += 1) {
    const [x, y, z] = getCameraPose(step / 2000);
    for (const building of buildings) {
      const overBuilding =
        Math.abs(x - building.x) < building.width / 2 + 0.5 &&
        Math.abs(z - building.z) < building.depth / 2 + 0.5;
      if (overBuilding)
        assert.ok(y > building.height + (building.stepped ? 1.3 : 0) + 0.5);
    }
  }
});

test('the gold trail follows the same stops in either scroll direction', () => {
  let previous = 0;
  for (let step = 0; step <= 1000; step += 1) {
    const distance = getRouteDistance(step / 1000);
    assert.ok(distance >= previous - 1e-10);
    assert.ok(distance >= 0 && distance <= 97 + 1e-10);
    previous = distance;
  }
  assert.deepEqual(getRoutePoint(getRouteDistance(0)), { x: -25, z: -19 });
  assert.deepEqual(getRoutePoint(getRouteDistance(1)), { x: 33, z: 20 });
  cityStops.forEach((stop, index) => {
    assert.equal(
      getRouteDistance(index / (cityStops.length - 1)),
      stop.routeDistance,
    );
    if (stop.projectId != null) {
      const building = landmarks.find(
        (item) => item.projectId === stop.projectId,
      );
      const point = getRoutePoint(stop.routeDistance);
      assert.ok(Math.abs(point.x - building.x) < 1e-10);
      assert.equal(point.z, 9);
    }
  });
  assert.deepEqual(getRoutePoint(-10), getRoutePoint(0));
  assert.deepEqual(getRoutePoint(NaN), getRoutePoint(0));
  assert.deepEqual(getRoutePoint(999), getRoutePoint(97));
});

test('projects form one nested district within four main districts', () => {
  assert.deepEqual(
    districts.map((district) => district.id),
    ['overview', 'about', 'projects', 'services'],
  );
  const district = districts.find((item) => item.id === 'projects');
  landmarks.forEach((building) => {
    assert.ok(
      Math.abs(building.x - district.x) + building.width / 2 <
        district.width / 2,
    );
    assert.ok(
      Math.abs(building.z - district.z) + building.depth / 2 <
        district.depth / 2,
    );
    landmarks
      .filter((other) => other !== building)
      .forEach((other) => assert.equal(overlaps(building, other, 1), false));
  });
});

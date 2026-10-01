import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { createInstance } from 'i18next';
import * as THREE from 'three';
import {
  getQgisProject,
  getPluginFloors,
  qgisPlugins,
} from '../src/data/qgisPlugins.js';
import {
  getProjectItems,
  getAdjacentItemId,
  getActiveItemIndex,
} from '../src/data/projectItems.js';
import { createPluginFloors } from '../src/components/city/createPluginFloors.js';
import { cityStops, landmarks } from '../src/components/city/cityLayout.js';

test('QGIS follows BirdMap and its building matches the plugin registry', () => {
  assert.equal(
    cityStops.findIndex((stop) => stop.id === 'qgis'),
    cityStops.findIndex((stop) => stop.id === 'birdmap') + 1,
  );
  assert.equal(
    landmarks.find((building) => building.id === 'qgis').height,
    1.1 + qgisPlugins.length * 2.4,
  );
  assert.equal(
    new Set(qgisPlugins.map((plugin) => plugin.id)).size,
    qgisPlugins.length,
  );
});

test('both languages provide complete descriptions and real local screenshots', async () => {
  for (const language of ['tr', 'en']) {
    const qgis = JSON.parse(
      readFileSync(
        new URL(`../src/i18n/locales/qgis.${language}.json`, import.meta.url),
        'utf8',
      ),
    );
    const i18n = createInstance();
    await i18n.init({
      lng: language,
      resources: { [language]: { translation: { qgis } } },
    });
    const project = getQgisProject(i18n.t);
    assert.equal(getProjectItems(project).length, qgisPlugins.length);
    for (const plugin of project.plugins) {
      assert.ok(plugin.description.length > 40);
      assert.ok(plugin.details.title);
      assert.equal(plugin.details.features.length, 5);
      for (const screenshot of plugin.screenshots) {
        assert.ok(qgis[screenshot.id]);
        assert.ok(
          existsSync(new URL(`../public${screenshot.src}`, import.meta.url)),
        );
      }
    }
  }
});

test('one plugin stays selected; three plugins wrap by stable ID', () => {
  assert.equal(getAdjacentItemId([], null, 1), null);
  assert.equal(getAdjacentItemId(qgisPlugins, null, 1), qgisPlugins[0].id);
  const plugins = ['one', 'two', 'three'].map((id) => ({ id }));
  assert.equal(getActiveItemIndex(plugins, 'missing'), 0);
  assert.equal(getAdjacentItemId(plugins, 'one', -1), 'three');
  assert.equal(getAdjacentItemId(plugins, 'three', 1), 'one');
  assert.equal(getAdjacentItemId(plugins, 'one', 1), 'two');
  assert.deepEqual(
    getPluginFloors(plugins).map((floor) => floor.number),
    [1, 2, 3],
  );
});

test('floor picking and modal navigation share IDs and reset the old selection', () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const plugins = ['one', 'two', 'three'].map((id) => ({ id }));
  const floors = createPluginFloors(
    scene,
    geometry,
    landmarks.find((building) => building.id === 'qgis'),
    plugins,
  );
  for (const id of plugins.map((plugin) => plugin.id)) {
    assert.ok(
      floors.hitTargets.some(
        (target) =>
          target.userData.pluginId === id &&
          target.userData.projectId === 'qgis',
      ),
    );
  }
  let id = 'one';
  for (let index = 0; index < 4; index += 1) {
    floors.setActive(id, true);
    floors.update(0.016, true);
    for (const plugin of plugins) {
      assert.equal(
        scene.getObjectByName(`qgis-floor-${plugin.id}`).position.z,
        plugin.id === id ? 0.35 : 0,
      );
    }
    id = getAdjacentItemId(plugins, id, 1);
  }
  floors.setActive(id, false);
  floors.update(0.016, true);
  assert.equal(scene.getObjectByName(`qgis-floor-${id}`).position.z, 0);
  floors.dispose();
  floors.dispose();
  assert.equal(scene.children.length, 0);
  geometry.dispose();
});

test('floor animation settles and material resources are disposed once', () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const floors = createPluginFloors(
    scene,
    geometry,
    landmarks.find((building) => building.id === 'qgis'),
  );
  const materials = new Set(floors.hitTargets.map((mesh) => mesh.material));
  let disposed = 0;
  materials.forEach((material) =>
    material.addEventListener('dispose', () => disposed++),
  );
  floors.setTheme(true);
  floors.setActive(qgisPlugins[0].id, true);
  assert.equal(floors.update(0.016, false), true);
  for (let index = 0; index < 200; index += 1) floors.update(0.016, false);
  assert.equal(floors.update(0.016, false), false);
  floors.dispose();
  floors.dispose();
  assert.equal(disposed, materials.size);
  geometry.dispose();
});

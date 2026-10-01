import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { createGuideModel } from '../src/components/city/createGuideModel.js';

test('the guide includes a ruler, glasses and a separate waving arm', () => {
  const guide = createGuideModel();
  assert.ok(guide.root.getObjectByName('guide-ruler'));
  assert.ok(guide.root.getObjectByName('guide-waving-arm'));
  const glasses = [];
  guide.root.traverse((object) => {
    if (object.geometry?.type === 'TorusGeometry' && object.geometry.parameters.radius === 0.095) {
      glasses.push(object);
    }
  });
  assert.equal(glasses.length, 2);
  const size = new THREE.Box3().setFromObject(guide.root).getSize(new THREE.Vector3());
  assert.ok(size.x < 1.5 && size.y < 2.6);
  guide.dispose();
});

test('waving settles cleanly and reduced motion keeps a static pose', () => {
  const guide = createGuideModel();
  const arm = guide.root.getObjectByName('guide-waving-arm');
  assert.equal(guide.update(0.6), true);
  assert.ok(Math.abs(arm.rotation.z) > 0.1);
  assert.equal(guide.update(3.2), false);
  assert.equal(arm.rotation.z, 0);
  assert.equal(guide.update(0.6, true), false);
  assert.equal(arm.rotation.z, 0);
  guide.dispose();
});

test('guide disposal releases every shared geometry and material exactly once', () => {
  const guide = createGuideModel();
  const scene = new THREE.Scene();
  scene.add(guide.root);
  const resources = new Set();
  guide.root.traverse((object) => {
    if (!object.isMesh) return;
    resources.add(object.geometry);
    resources.add(object.material);
  });
  let released = 0;
  resources.forEach((resource) => resource.addEventListener('dispose', () => released++));
  guide.dispose();
  guide.dispose();
  assert.equal(scene.children.length, 0);
  assert.equal(released, resources.size);
});

test('the invitation shows one short translated label and keeps its fallback clickable', () => {
  const source = readFileSync(new URL('../src/components/city/CityInvitation.jsx', import.meta.url), 'utf8');
  assert.ok(source.includes('<CityGuide />'));
  assert.ok(source.includes("t('city.invitation')"));
  assert.ok(!source.includes('city-invitation-bubble'));
  assert.ok(source.includes('onClick={onEnter}'));
  for (const [language, label] of [['tr', '3D keşfet'], ['en', 'Explore in 3D']]) {
    const strings = JSON.parse(readFileSync(new URL(`../src/i18n/locales/city.${language}.json`, import.meta.url), 'utf8'));
    assert.equal(strings.invitation, label);
  }
});

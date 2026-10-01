import * as THREE from 'three';
import { getPluginFloors, qgisPlugins } from '../../data/qgisPlugins.js';

export function createPluginFloors(
  scene,
  geometry,
  building,
  plugins = qgisPlugins,
) {
  const root = new THREE.Group();
  root.name = 'qgis-plugin-floors';
  root.position.set(building.x, 0, building.z);
  const glass = new THREE.MeshStandardMaterial({
    color: '#527a68',
    roughness: 0.4,
  });
  const trim = new THREE.MeshStandardMaterial({
    color: '#d9ad25',
    roughness: 0.5,
  });
  const stone = new THREE.MeshStandardMaterial({
    color: '#e7e6dc',
    roughness: 0.85,
  });
  const frames = new THREE.MeshStandardMaterial({
    color: '#59665d',
    roughness: 0.5,
    metalness: 0.2,
  });
  function box(group, material, name, x, y, z, width, height, depth) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = material !== glass;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }
  const entries = getPluginFloors(plugins).map((floor) => {
    const group = new THREE.Group();
    group.name = `qgis-floor-${floor.id}`;
    group.position.y = floor.y;
    const material = new THREE.MeshStandardMaterial({
      color: '#dedfd5',
      roughness: 0.8,
    });
    const body = new THREE.Mesh(geometry, material);
    body.scale.set(building.width, floor.height, building.depth);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    const belt = new THREE.Mesh(geometry, trim);
    belt.scale.set(building.width + 0.1, 0.1, building.depth + 0.1);
    belt.position.y = -floor.height / 2;
    group.add(belt);
    box(
      group,
      stone,
      'floor-cornice',
      0,
      floor.height / 2 - 0.06,
      0,
      building.width + 0.16,
      0.12,
      building.depth + 0.16,
    );
    for (const side of [-1, 1]) {
      for (
        let x = -building.width / 2 + 0.85;
        x < building.width / 2 - 0.4;
        x += 1.05
      ) {
        const front = side * (building.depth / 2 + 0.05);
        box(group, frames, 'window-frame', x, 0.15, front, 0.83, 1.13, 0.08);
        box(
          group,
          glass,
          'front-window',
          x,
          0.15,
          front + side * 0.05,
          0.73,
          1.03,
          0.035,
        );
        box(
          group,
          stone,
          'window-sill',
          x,
          -0.42,
          front + side * 0.07,
          0.93,
          0.09,
          0.22,
        );
      }
      for (
        let z = -building.depth / 2 + 0.85;
        z < building.depth / 2 - 0.4;
        z += 1.05
      ) {
        const edge = side * (building.width / 2 + 0.05);
        box(
          group,
          frames,
          'side-window-frame',
          edge,
          0.15,
          z,
          0.08,
          1.13,
          0.83,
        );
        box(
          group,
          glass,
          'side-window',
          edge + side * 0.05,
          0.15,
          z,
          0.035,
          1.03,
          0.73,
        );
        box(
          group,
          stone,
          'side-window-sill',
          edge + side * 0.07,
          -0.42,
          z,
          0.22,
          0.09,
          0.93,
        );
      }
    }
    group.traverse((object) => {
      if (object.isMesh)
        Object.assign(object.userData, {
          projectId: building.projectId,
          pluginId: floor.id,
        });
    });
    root.add(group);
    return { ...floor, group, material, strength: 0 };
  });
  const roofHeight = getPluginFloors(plugins).at(-1);
  if (roofHeight) {
    const roofY = roofHeight.y + roofHeight.height / 2 + 0.18;
    for (const side of [-1, 1]) {
      box(
        root,
        stone,
        'roof-parapet',
        side * (building.width / 2 - 0.08),
        roofY,
        0,
        0.16,
        0.36,
        building.depth,
      );
      box(
        root,
        stone,
        'roof-parapet',
        0,
        roofY,
        side * (building.depth / 2 - 0.08),
        building.width,
        0.36,
        0.16,
      );
    }
  }
  scene.add(root);
  let activeId = plugins[0]?.id ?? null;
  let enabled = false;
  let disposed = false;

  return {
    hitTargets: entries.flatMap(({ group }) => group.children),
    setActive(id, visible) {
      activeId = entries.some((entry) => entry.id === id) ? id : entries[0]?.id;
      enabled = visible;
    },
    update(delta, reducedMotion) {
      if (disposed) return false;
      let animating = false;
      entries.forEach((entry) => {
        const target = enabled && entry.id === activeId ? 1 : 0;
        entry.strength = reducedMotion
          ? target
          : THREE.MathUtils.damp(entry.strength, target, 10, delta);
        if (Math.abs(entry.strength - target) < 0.001) entry.strength = target;
        entry.group.position.z = entry.strength * 0.35;
        entry.material.emissive.set('#a17e22');
        entry.material.emissiveIntensity = entry.strength * 0.45;
        animating ||= entry.strength !== target;
      });
      return animating;
    },
    setTheme(dark) {
      entries.forEach(({ material }) =>
        material.color.set(dark ? '#646d68' : '#dedfd5'),
      );
      glass.color.set(dark ? '#507f70' : '#527a68');
      stone.color.set(dark ? '#798378' : '#e7e6dc');
      frames.color.set(dark ? '#a3aaa0' : '#59665d');
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      scene.remove(root);
      entries.forEach(({ material }) => material.dispose());
      glass.dispose();
      trim.dispose();
      stone.dispose();
      frames.dispose();
    },
  };
}

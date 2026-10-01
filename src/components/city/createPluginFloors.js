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
    for (let x = -1.55; x <= 1.6; x += 1.05) {
      const window = new THREE.Mesh(geometry, glass);
      window.scale.set(0.75, 1.05, 0.07);
      window.position.set(x, 0.15, building.depth / 2 + 0.04);
      group.add(window);
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
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      scene.remove(root);
      entries.forEach(({ material }) => material.dispose());
      glass.dispose();
      trim.dispose();
    },
  };
}

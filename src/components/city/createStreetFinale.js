import * as THREE from 'three';
import {
  finaleBuildings,
  finalePlaza,
  getStreetBlend,
  isFinaleReady,
} from './cityLayout.js';

export function createStreetFinale(scene, geometry) {
  const root = new THREE.Group();
  root.name = 'city-street-finale';
  root.visible = false;
  const materials = {
    stone: new THREE.MeshStandardMaterial({ roughness: 0.85 }),
    metal: new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.2 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d9ad25', roughness: 0.45 }),
    glass: new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.15 }),
    paving: new THREE.MeshStandardMaterial({ roughness: 1 }),
  };
  const ringGeometry = new THREE.TorusGeometry(0.36, 0.055, 8, 32);
  const arrowGeometry = new THREE.ConeGeometry(0.13, 0.26, 6);
  function box(parent, material, x, y, z, width, height, depth) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  box(
    root,
    materials.paving,
    finalePlaza.x,
    0.12,
    finalePlaza.z,
    finalePlaza.width,
    0.12,
    finalePlaza.depth,
  );
  const entries = finaleBuildings.map((building) => {
    const group = new THREE.Group();
    group.name = `city-finale-${building.id}`;
    group.position.set(building.x, 0, building.z);
    const glass = materials.glass.clone();
    const front = -building.depth / 2;
    box(
      group,
      materials.stone,
      0,
      1.45,
      0,
      building.width,
      2.6,
      building.depth,
    );
    box(group, glass, 0, 1.08, front - 0.06, 1.9, 1.8, 0.08);
    box(group, materials.metal, 0, 1.08, front - 0.12, 0.065, 1.8, 0.045);
    box(
      group,
      materials.stone,
      0,
      0.2,
      front - 0.35,
      building.width + 0.24,
      0.16,
      0.7,
    );
    box(
      group,
      materials.gold,
      0,
      2.83,
      0,
      building.width + 0.3,
      0.16,
      building.depth + 0.3,
    );
    box(
      group,
      materials.stone,
      0,
      2.08,
      front - 0.26,
      building.width + 0.12,
      0.13,
      0.65,
    );
    for (const side of [-1, 1]) {
      box(
        group,
        materials.stone,
        side * 1.18,
        1.46,
        front - 0.14,
        0.16,
        2.65,
        0.18,
      );
      box(
        group,
        materials.metal,
        side * 0.16,
        1.12,
        front - 0.16,
        0.035,
        0.25,
        0.04,
      );
    }
    const icon = new THREE.Group();
    icon.position.set(0, 3.4, 0);
    if (building.id === 'restart') {
      const ring = new THREE.Mesh(ringGeometry, materials.gold);
      const arrow = new THREE.Mesh(arrowGeometry, materials.gold);
      arrow.position.set(0.34, 0.09, 0);
      arrow.rotation.z = -0.8;
      icon.add(ring, arrow);
    } else {
      for (const [x, height] of [
        [-0.3, 0.58],
        [0, 0.85],
        [0.3, 0.48],
      ]) {
        box(icon, materials.stone, x, height / 2 - 0.35, 0, 0.25, height, 0.3);
        box(icon, materials.gold, x, height - 0.34, 0, 0.28, 0.06, 0.33);
      }
    }
    group.add(icon);
    group.traverse((object) => {
      if (object.isMesh) object.userData.action = building.id;
    });
    root.add(group);
    return { building, group, glass, icon, strength: 0 };
  });
  scene.add(root);
  let ready = false;
  let elapsed = 3;
  let hovered = null;
  let disposed = false;
  return {
    hitTargets: entries.flatMap(({ group }) => {
      const meshes = [];
      group.traverse((object) => {
        if (object.isMesh) meshes.push(object);
      });
      return meshes;
    }),
    setHovered(id) {
      hovered = id;
    },
    update(progress, delta, reducedMotion) {
      if (disposed) return false;
      root.visible = getStreetBlend(progress) > 0.2;
      const nextReady = isFinaleReady(progress);
      if (nextReady && !ready) elapsed = 0;
      ready = nextReady;
      elapsed = reducedMotion || !ready ? 3 : Math.min(3, elapsed + delta);
      const wave =
        elapsed < 3
          ? Math.sin(elapsed * Math.PI * 2) * Math.sin((elapsed / 3) * Math.PI)
          : 0;
      let animating = ready && elapsed < 3;
      entries.forEach((entry) => {
        const target = ready && entry.building.id === hovered ? 1 : 0;
        entry.strength = reducedMotion
          ? target
          : THREE.MathUtils.damp(entry.strength, target, 12, delta);
        if (Math.abs(entry.strength - target) < 0.001) entry.strength = target;
        entry.group.position.y = ready ? wave * 0.035 : 0;
        entry.icon.rotation.y = ready ? wave * 0.12 : 0;
        entry.glass.emissive.set('#ba9631');
        entry.glass.emissiveIntensity = 0.08 + entry.strength * 0.45;
        animating ||= entry.strength !== target;
      });
      return animating;
    },
    isEnabled() {
      return ready && !disposed;
    },
    setTheme(dark) {
      materials.stone.color.set(dark ? '#798378' : '#e7e6dc');
      materials.metal.color.set(dark ? '#a3aaa0' : '#59665d');
      materials.paving.color.set(dark ? '#424943' : '#d9d8cc');
      entries.forEach(({ glass }) =>
        glass.color.set(dark ? '#344d50' : '#527a68'),
      );
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      scene.remove(root);
      ringGeometry.dispose();
      arrowGeometry.dispose();
      entries.forEach(({ glass }) => glass.dispose());
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
}

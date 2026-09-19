import * as THREE from 'three';
import { getRouteDistance, getRoutePoint, route } from './cityLayout';

export function createCityRoute(scene, geometry) {
  const materials = {
    paving: new THREE.MeshStandardMaterial({ roughness: 1 }),
    track: new THREE.MeshStandardMaterial({ roughness: 0.8 }),
    active: new THREE.MeshStandardMaterial({
      color: '#d6a923',
      emissive: '#a86a10',
      emissiveIntensity: 0.25,
      roughness: 0.45,
    }),
  };
  const segments = [];
  let travelled = 0;
  function box(material) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }
  route.slice(1).forEach(([x2, z2], index) => {
    const [x1, z1] = route[index];
    const horizontal = z1 === z2;
    const length = Math.hypot(x2 - x1, z2 - z1);
    const paving = box(materials.paving);
    paving.position.set((x1 + x2) / 2, 0.14, (z1 + z2) / 2);
    paving.scale.set(
      horizontal ? length + 2.4 : 2.4,
      0.12,
      horizontal ? 2.4 : length + 2.4,
    );
    for (const offset of [-0.2, 0.2]) {
      const base = box(materials.track);
      base.position.set(
        (x1 + x2) / 2 + (horizontal ? 0 : offset),
        0.215,
        (z1 + z2) / 2 + (horizontal ? offset : 0),
      );
      base.scale.set(
        horizontal ? length : 0.09,
        0.025,
        horizontal ? 0.09 : length,
      );
      segments.push({
        mesh: box(materials.active),
        start: travelled,
        length,
        x1,
        z1,
        x2,
        z2,
        horizontal,
        offset,
      });
    }
    travelled += length;
  });
  const headGeometry = new THREE.SphereGeometry(0.28, 12, 8);
  const head = new THREE.Mesh(headGeometry, materials.active);
  const ringGeometry = new THREE.RingGeometry(0.48, 0.58, 32);
  const ring = new THREE.Mesh(ringGeometry, materials.active);
  ring.rotation.x = -Math.PI / 2;
  scene.add(head, ring);

  return {
    update(progress) {
      const distance = getRouteDistance(progress);
      segments.forEach(
        ({ mesh, start, length, x1, z1, x2, z2, horizontal, offset }) => {
          const filled = Math.max(0, Math.min(length, distance - start));
          const fraction = filled / length;
          mesh.visible = filled > 0.001;
          mesh.position.set(
            x1 + ((x2 - x1) * fraction) / 2 + (horizontal ? 0 : offset),
            0.24,
            z1 + ((z2 - z1) * fraction) / 2 + (horizontal ? offset : 0),
          );
          mesh.scale.set(
            horizontal ? filled : 0.16,
            0.03,
            horizontal ? 0.16 : filled,
          );
        },
      );
      const point = getRoutePoint(distance);
      head.position.set(point.x, 0.5, point.z);
      ring.position.set(point.x, 0.27, point.z);
    },
    setTheme(dark) {
      materials.paving.color.set(dark ? '#424943' : '#d9d8cc');
      materials.track.color.set(dark ? '#6c6950' : '#b7b19b');
      materials.active.emissiveIntensity = dark ? 0.7 : 0.25;
    },
    dispose() {
      headGeometry.dispose();
      ringGeometry.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
}

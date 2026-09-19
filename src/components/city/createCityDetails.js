import * as THREE from 'three';
import { landmarks } from './cityLayout';

export function createCityDetails(scene, geometry) {
  const materials = {
    glass: new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.25 }),
    stone: new THREE.MeshStandardMaterial({ roughness: 0.85 }),
    metal: new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.2 }),
    wood: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
    light: new THREE.MeshStandardMaterial({
      color: '#f2d796',
      emissive: '#e5b65e',
      emissiveIntensity: 0.35,
    }),
    people: new THREE.MeshStandardMaterial({ roughness: 1 }),
  };
  const batches = Object.fromEntries(
    Object.keys(materials).map((key) => [key, []]),
  );
  function box(material, x, y, z, width, height, depth) {
    batches[material].push({ x, y, z, width, height, depth });
  }

  landmarks.forEach(({ id, x, z, width, depth, height }) => {
    const front = z + depth / 2;
    const side = x + width / 2;
    box('glass', x, 0.85, front + 0.035, width * 0.76, 1.45, 0.06);
    box('stone', x, 1.65, front + 0.28, width * 0.86, 0.16, 0.9);
    box('stone', x, 0.17, front + 0.55, width * 0.9, 0.18, 1.2);
    box('metal', x, 0.85, front + 0.09, 0.065, 1.45, 0.05);
    for (let y = 2.4; y < height - 0.4; y += 1.6) {
      for (let dx = -width / 2 + 0.75; dx < width / 2 - 0.4; dx += 1.1)
        box('glass', x + dx, y, front + 0.035, 0.65, 0.88, 0.06);
      for (let dz = -depth / 2 + 0.8; dz < depth / 2 - 0.4; dz += 1.1)
        box('glass', side + 0.035, y, z + dz, 0.06, 0.88, 0.65);
      if (id === 'luma')
        box('stone', x, y - 0.55, front + 0.16, width + 0.1, 0.12, 0.5);
    }
    for (const sign of [-1, 1]) {
      box(
        'stone',
        x + sign * (width / 2 - 0.09),
        height + 0.2,
        z,
        0.18,
        0.36,
        depth,
      );
      box(
        'stone',
        x,
        height + 0.2,
        z + sign * (depth / 2 - 0.09),
        width,
        0.36,
        0.18,
      );
    }
    if (id === 'birdmap') {
      for (let dx = -1.8; dx <= 1.8; dx += 0.45)
        box('wood', x + dx, 1, front + 0.4, 0.1, 1.8, 0.12);
    }
  });

  for (let x = -14; x <= 28; x += 7) {
    box('metal', x, 1.75, 6.7, 0.1, 3.35, 0.1);
    box('metal', x, 3.4, 7.05, 0.12, 0.12, 0.8);
    box('light', x, 3.34, 7.35, 0.38, 0.07, 0.3);
    box('wood', x + 1, 0.6, 12.2, 1.7, 0.13, 0.55);
    box('wood', x + 1, 0.96, 12.45, 1.7, 0.55, 0.12);
    for (const dx of [-0.6, 0.6])
      box('metal', x + 1 + dx, 0.32, 12.2, 0.1, 0.5, 0.45);
  }
  for (let x = -15; x <= 25; x += 2.5)
    box('stone', x, 0.05, 13.8, 0.04, 0.04, 1.2);
  for (let x = -18; x <= 26; x += 4)
    box('stone', x, 0.018, 18, 0.025, 0.012, 8);
  for (let z = 15; z <= 21; z += 3) box('stone', 4, 0.018, z, 44, 0.012, 0.025);

  const matrix = new THREE.Object3D();
  Object.entries(batches).forEach(([key, items]) => {
    if (!items.length) return;
    const mesh = new THREE.InstancedMesh(
      geometry,
      materials[key],
      items.length,
    );
    items.forEach((item, index) => {
      matrix.position.set(item.x, item.y, item.z);
      matrix.scale.set(item.width, item.height, item.depth);
      matrix.updateMatrix();
      mesh.setMatrixAt(index, matrix.matrix);
    });
    mesh.castShadow = key !== 'glass';
    mesh.receiveShadow = true;
    scene.add(mesh);
  });

  const peopleGeometry = new THREE.CapsuleGeometry(0.17, 0.65, 3, 6);
  const headGeometry = new THREE.SphereGeometry(0.15, 8, 6);
  const people = [
    [-12, 11],
    [-3, 11.6],
    [6, 10.9],
    [14, 11.8],
    [23, 10.8],
    [34, 18],
  ];
  const bodies = new THREE.InstancedMesh(
    peopleGeometry,
    materials.people,
    people.length,
  );
  const heads = new THREE.InstancedMesh(
    headGeometry,
    materials.wood,
    people.length,
  );
  people.forEach(([x, z], index) => {
    matrix.scale.set(1, 1, 1);
    matrix.position.set(x, 0.66, z);
    matrix.updateMatrix();
    bodies.setMatrixAt(index, matrix.matrix);
    matrix.position.y = 1.33;
    matrix.updateMatrix();
    heads.setMatrixAt(index, matrix.matrix);
  });
  bodies.castShadow = true;
  heads.castShadow = true;
  scene.add(bodies, heads);

  return {
    setTheme(dark) {
      materials.glass.color.set(dark ? '#344d50' : '#779899');
      materials.stone.color.set(dark ? '#798378' : '#e7e6dc');
      materials.metal.color.set(dark ? '#a3aaa0' : '#59665d');
      materials.wood.color.set(dark ? '#9d895d' : '#ae9265');
      materials.people.color.set(dark ? '#c4bda5' : '#5a6964');
      materials.light.emissiveIntensity = dark ? 1.5 : 0.25;
    },
    dispose() {
      peopleGeometry.dispose();
      headGeometry.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
}

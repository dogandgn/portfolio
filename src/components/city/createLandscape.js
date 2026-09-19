import * as THREE from 'three';
import { districts, landmarks, overlaps, parks, shoreX } from './cityLayout';

export function createLandscape(scene, boxGeometry) {
  const materials = {
    water: new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.08 }),
    ripple: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.22 }),
    grass: new THREE.MeshStandardMaterial({ roughness: 1 }),
    leaves: new THREE.MeshStandardMaterial({ roughness: 1 }),
    wood: new THREE.MeshStandardMaterial({ roughness: 1 }),
    paving: new THREE.MeshStandardMaterial({ roughness: 1 }),
    district: new THREE.MeshStandardMaterial({ roughness: 1 }),
    edge: new THREE.MeshStandardMaterial({ roughness: 1 }),
  };
  const treeGeometry = new THREE.SphereGeometry(1, 10, 8);
  const trunkGeometry = new THREE.CylinderGeometry(0.12, 0.16, 1.4, 6);
  function box(x, y, z, width, height, depth, material) {
    const mesh = new THREE.Mesh(boxGeometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(width, height, depth);
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }
  box(shoreX + 75, -0.02, 0, 150, 0.05, 240, materials.water);
  box(shoreX - 1.5, 0.08, 0, 3, 0.22, 100, materials.paving);
  box(4, -0.025, 20, 46, 0.08, 14, materials.paving);
  box(7, 0.07, 23, 18, 0.18, 4.8, materials.edge);
  box(7, 0.17, 23, 17.6, 0.03, 4.4, materials.water);
  districts.forEach(({ x, z, width, depth }) => {
    box(x, -0.02, z, width, 0.06, depth, materials.district);
    for (const side of [-1, 1]) {
      box(x, 0.02, z + (side * depth) / 2, width, 0.08, 0.18, materials.edge);
      box(x + (side * width) / 2, 0.02, z, 0.18, 0.08, depth, materials.edge);
    }
  });
  for (let index = 0; index < 28; index += 1) {
    box(
      shoreX + 4 + (index % 5) * 8,
      0.025,
      -44 + index * 3.5,
      2 + (index % 4),
      0.01,
      0.035,
      materials.ripple,
    );
  }
  for (const z of [-24, 0, 24])
    box(shoreX + 2.5, 0.08, z, 7, 0.2, 1.3, materials.paving);
  const trees = [];
  parks.forEach((park) => {
    box(park.x, 0.04, park.z, park.width, 0.12, park.depth, materials.grass);
    box(park.x, 0.12, park.z, park.width, 0.05, 1.2, materials.paving);
    for (
      let x = park.x - park.width / 2 + 1.8;
      x < park.x + park.width / 2 - 1;
      x += 3.4
    ) {
      for (const z of [
        park.z - park.depth / 2 + 1.5,
        park.z + park.depth / 2 - 1.5,
      ]) {
        if (
          !landmarks.some((building) =>
            overlaps({ x, z, width: 2, depth: 2 }, building, 1),
          )
        )
          trees.push({ x, z });
      }
    }
  });
  for (let z = -36; z <= 36; z += 7) trees.push({ x: shoreX - 3.4, z });
  const crowns = new THREE.InstancedMesh(
    treeGeometry,
    materials.leaves,
    trees.length,
  );
  const trunks = new THREE.InstancedMesh(
    trunkGeometry,
    materials.wood,
    trees.length,
  );
  const matrix = new THREE.Object3D();
  trees.forEach(({ x, z }, index) => {
    matrix.position.set(x, 0.8, z);
    matrix.scale.set(1, 1, 1);
    matrix.updateMatrix();
    trunks.setMatrixAt(index, matrix.matrix);
    matrix.position.set(x, 2.1, z);
    matrix.scale.set(0.85, 1.1 + (index % 3) * 0.15, 0.85);
    matrix.updateMatrix();
    crowns.setMatrixAt(index, matrix.matrix);
  });
  crowns.castShadow = true;
  crowns.receiveShadow = true;
  scene.add(crowns, trunks);

  return {
    setTheme(dark) {
      materials.water.color.set(dark ? '#334d51' : '#93b0b2');
      materials.ripple.color.set(dark ? '#789799' : '#e1eded');
      materials.grass.color.set(dark ? '#414f40' : '#b6c1a5');
      materials.leaves.color.set(dark ? '#61765e' : '#93a887');
      materials.wood.color.set(dark ? '#6f6c5b' : '#a69f86');
      materials.paving.color.set(dark ? '#565d53' : '#dedfce');
      materials.district.color.set(dark ? '#343e39' : '#d6dbce');
      materials.edge.color.set(dark ? '#697664' : '#a3ad97');
    },
    dispose() {
      treeGeometry.dispose();
      trunkGeometry.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
}

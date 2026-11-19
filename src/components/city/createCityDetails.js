import * as THREE from 'three';
import { landmarks, pavementHeight } from './cityLayout.js';

export function createCityDetails(scene, geometry, neighborhood) {
  const materials = {
    glass: new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.25 }),
    litGlass: new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.25, emissive: '#ffb865' }),
    distantGlass: new THREE.MeshBasicMaterial({ color: '#b6986c' }),
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
  const nightLights = new THREE.Group();
  nightLights.visible = false;
  scene.add(nightLights);

  neighborhood.forEach(({ x, z, width, depth, height }, block) => {
    for (let floor = 0; 1.35 + floor * 1.5 < height - 0.45; floor++) {
      const y = 1.35 + floor * 1.5;
      for (let column = 0; column < 3; column++) {
        const offset = (column - 1) * 0.28;
        if ((block + floor * 3 + column * 2) % 5 < 3)
          box('distantGlass', x + width * offset, y, z + depth / 2 + 0.02, 0.45, 0.54, 0.04);
        if ((block * 3 + floor + column * 2) % 5 < 3)
          box('distantGlass', x + width / 2 + 0.02, y, z + depth * offset, 0.04, 0.54, 0.45);
      }
    }
  });

  landmarks.forEach(({ id, x, z, width, depth, height }, block) => {
    const front = z + depth / 2;
    const side = x + width / 2;
    box('litGlass', x, 0.85, front + 0.035, width * 0.76, 1.45, 0.06);
    box('stone', x, 1.65, front + 0.28, width * 0.86, 0.16, 0.9);
    box('stone', x, 0.17, front + 0.55, width * 0.9, 0.18, 1.2);
    box('metal', x, 0.85, front + 0.09, 0.065, 1.45, 0.05);
    box('metal', x, 1.56, front + 0.1, width * 0.76, 0.06, 0.08);
    box('light', x, 1.55, front + 0.48, width * 0.54, 0.045, 0.1);
    if (id === 'qgis') {
      for (const sign of [-1, 1]) {
        box(
          'stone',
          x + sign * width * 0.39,
          0.87,
          front + 0.1,
          0.16,
          1.5,
          0.2,
        );
        box('metal', x + sign * 0.17, 0.9, front + 0.14, 0.04, 0.28, 0.05);
      }
      return;
    }
    let pane = block;
    const windowGlass = () => (++pane % 5 < 3 ? 'litGlass' : 'glass');
    for (let y = 2.4; y < height - 0.4; y += 1.6) {
      if (id === 'kent-gozlemi') {
        box(windowGlass(), x, y, front + 0.04, width - 0.24, 1.1, 0.09);
        box(windowGlass(), side + 0.04, y, z, 0.09, 1.1, depth - 0.24);
        box('stone', x, y - 0.59, front + 0.16, width + 0.24, 0.12, 0.48);
        box('stone', side + 0.16, y - 0.59, z, 0.48, 0.12, depth + 0.24);
        for (const fraction of [-0.32, -0.12, 0.12, 0.32]) {
          box('metal', x + width * fraction, y, front + 0.1, 0.045, 1.12, 0.06);
          box('metal', side + 0.1, y, z + depth * fraction, 0.06, 1.12, 0.045);
        }
        continue;
      }
      for (let dx = -width / 2 + 0.75; dx < width / 2 - 0.4; dx += 1.1)
        box(windowGlass(), x + dx, y, front + 0.035, 0.65, 0.88, 0.06);
      for (let dz = -depth / 2 + 0.8; dz < depth / 2 - 0.4; dz += 1.1)
        box(windowGlass(), side + 0.035, y, z + dz, 0.06, 0.88, 0.65);
      if (id === 'luma') {
        box('stone', x, y - 0.55, front + 0.16, width + 0.1, 0.12, 0.5);
        box('glass', x, y - 0.27, front + 0.37, width - 0.18, 0.42, 0.04);
        box('metal', x, y - 0.04, front + 0.37, width - 0.12, 0.04, 0.05);
      } else {
        box('stone', side + 0.06, y - 0.49, z, 0.18, 0.09, depth);
        if (id === 'widgets')
          box('stone', x, y + 0.5, front + 0.14, width - 0.15, 0.11, 0.4);
      }
    }
    if (id === 'soundcity') {
      const fins = [0.36, 0.52, 0.78, 0.91, 0.66, 0.48, 0.72, 0.58, 0.38];
      fins.forEach((fraction, index) => {
        const rise = (height - 2) * fraction;
        const finX = x + (index - 4) * width * 0.096;
        box('wood', finX, 2 + rise / 2, front + 0.22, 0.12, rise, 0.36);
        box('light', finX, 2 + rise, front + 0.22, 0.13, 0.06, 0.37);
      });
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

  const bulbPositions = [];
  for (let x = -14; x <= 28; x += 7) {
    box('metal', x, 1.75, 6.7, 0.1, 3.35, 0.1);
    box('metal', x, 3.4, 7.05, 0.12, 0.12, 0.8);
    box('light', x, 3.34, 7.35, 0.38, 0.07, 0.3);
    const lamp = new THREE.SpotLight('#ffce8b', 65, 8, Math.PI / 3.8, 0.85);
    lamp.position.set(x, 3.29, 7.35);
    bulbPositions.push(...lamp.position.toArray());
    lamp.target.position.set(x, pavementHeight, 8.3);
    nightLights.add(lamp, lamp.target);
    box('wood', x + 1, 0.6, 12.2, 1.7, 0.13, 0.55);
    box('wood', x + 1, 0.96, 12.45, 1.7, 0.55, 0.12);
    for (const dx of [-0.6, 0.6])
      box('metal', x + 1 + dx, 0.32, 12.2, 0.1, 0.5, 0.45);
  }
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 64;
  const context = glowCanvas.getContext('2d');
  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, 'rgba(255, 249, 221, 1)');
  glow.addColorStop(0.18, 'rgba(255, 220, 155, 0.70)');
  glow.addColorStop(0.48, 'rgba(255, 195, 109, 0.19)');
  glow.addColorStop(1, 'rgba(255, 178, 82, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  const glowMap = new THREE.CanvasTexture(glowCanvas);
  glowMap.colorSpace = THREE.SRGBColorSpace;
  const glowGeometry = new THREE.BufferGeometry();
  glowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bulbPositions, 3));
  const glowMaterial = new THREE.PointsMaterial({
    map: glowMap, size: 2, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, toneMapped: false,
  });
  nightLights.add(new THREE.Points(glowGeometry, glowMaterial));
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
    mesh.castShadow = key !== 'glass' && key !== 'litGlass' && key !== 'distantGlass';
    mesh.receiveShadow = true;
    (key === 'distantGlass' ? nightLights : scene).add(mesh);
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
      nightLights.visible = dark;
      materials.glass.color.set(dark ? '#344d50' : '#779899');
      materials.glass.emissive.set(dark ? '#aa8051' : '#000000');
      materials.glass.emissiveIntensity = dark ? 0.24 : 0;
      materials.litGlass.color.copy(materials.glass.color);
      materials.litGlass.emissiveIntensity = dark ? 1.65 : 0;
      materials.stone.color.set(dark ? '#798378' : '#e7e6dc');
      materials.metal.color.set(dark ? '#a3aaa0' : '#59665d');
      materials.wood.color.set(dark ? '#9d895d' : '#ae9265');
      materials.people.color.set(dark ? '#c4bda5' : '#5a6964');
      materials.light.emissiveIntensity = dark ? 3.6 : 0.25;
    },
    dispose() {
      nightLights.removeFromParent();
      nightLights.children.forEach(child => { if (child.isSpotLight) child.dispose(); });
      glowMap.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      peopleGeometry.dispose();
      headGeometry.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
}

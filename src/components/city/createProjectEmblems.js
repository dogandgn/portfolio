import * as THREE from 'three';
import { landmarks } from './cityLayout.js';

const duration = 4;

function roundedShape(points, radius) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], index) => {
    const previous = new THREE.Vector2(
      ...points[(index + points.length - 1) % points.length],
    );
    const next = new THREE.Vector2(...points[(index + 1) % points.length]);
    const corner = new THREE.Vector2(x, y);
    const rounding = Math.min(
      radius,
      previous.distanceTo(corner) / 2,
      next.distanceTo(corner) / 2,
    );
    const before = previous
      .sub(corner)
      .normalize()
      .multiplyScalar(rounding)
      .add(corner);
    const after = next
      .sub(corner)
      .normalize()
      .multiplyScalar(rounding)
      .add(corner);
    if (index === 0) shape.moveTo(before.x, before.y);
    else shape.lineTo(before.x, before.y);
    shape.quadraticCurveTo(x, y, after.x, after.y);
  });
  shape.closePath();
  return shape;
}

export function createProjectEmblems(scene) {
  const materials = {
    sage: new THREE.MeshStandardMaterial({
      color: '#6d978b',
      roughness: 0.38,
      metalness: 0.35,
    }),
    blue: new THREE.MeshStandardMaterial({
      color: '#487585',
      roughness: 0.36,
      metalness: 0.35,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: '#d3ac43',
      roughness: 0.3,
      metalness: 0.55,
    }),
    stone: new THREE.MeshStandardMaterial({
      color: '#e4e3d7',
      roughness: 0.75,
    }),
    dark: new THREE.MeshStandardMaterial({ color: '#293c37', roughness: 0.5 }),
    eye: new THREE.MeshStandardMaterial({ color: '#f4efdf', roughness: 0.4 }),
  };
  const wing = new THREE.Shape();
  wing.moveTo(0, 0);
  wing.bezierCurveTo(0.45, 0.26, 1.15, 0.7, 1.65, 0.55);
  wing.bezierCurveTo(1.32, 0.27, 0.8, -0.15, 0.17, -0.22);
  wing.quadraticCurveTo(0, -0.18, 0, 0);
  const snake = roundedShape(
    [
      [-0.8, -0.26],
      [-0.8, 0.38],
      [-0.34, 0.38],
      [-0.34, 0.92],
      [0.55, 0.92],
      [0.55, 0.36],
      [-0.23, 0.36],
      [-0.23, -0.26],
    ],
    0.11,
  );
  const eye = new THREE.Path();
  eye.absarc(-0.04, 0.66, 0.065, 0, Math.PI * 2, true);
  snake.holes.push(eye);
  const pin = new THREE.Shape();
  pin.moveTo(0, -0.35);
  pin.bezierCurveTo(-0.18, -0.08, -0.54, 0.22, -0.54, 0.59);
  pin.bezierCurveTo(-0.54, 1.28, 0.54, 1.28, 0.54, 0.59);
  pin.bezierCurveTo(0.54, 0.22, 0.18, -0.08, 0, -0.35);
  const pinHole = new THREE.Path();
  pinHole.absarc(0, 0.59, 0.21, 0, Math.PI * 2, true);
  pin.holes.push(pinHole);
  const extrusion = {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.035,
    bevelSegments: 3,
    steps: 1,
    curveSegments: 12,
  };
  const geometries = {
    sphere: new THREE.SphereGeometry(1, 20, 12),
    cylinder: new THREE.CylinderGeometry(1, 1, 1, 40),
    box: new THREE.BoxGeometry(1, 1, 1),
    beak: new THREE.ConeGeometry(0.1, 0.34, 12),
    wing: new THREE.ExtrudeGeometry(wing, { ...extrusion, depth: 0.07 }),
    snake: new THREE.ExtrudeGeometry(snake, extrusion),
    pin: new THREE.ExtrudeGeometry(pin, extrusion),
    orbit: new THREE.TorusGeometry(1.35, 0.014, 6, 72),
  };
  const hitTargets = [];
  const entries = [];
  let activeId = null;
  let disposed = false;

  function mesh(parent, geometry, material, position, scale = [1, 1, 1]) {
    const object = new THREE.Mesh(geometries[geometry], materials[material]);
    object.position.set(...position);
    object.scale.set(...scale);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  function bird(parent) {
    const group = new THREE.Group();
    group.name = 'bird-sculpture';
    parent.add(group);
    mesh(group, 'sphere', 'sage', [0, 0, 0], [0.26, 0.4, 0.3]);
    mesh(group, 'sphere', 'sage', [0, 0.38, 0.13], [0.23, 0.23, 0.23]);
    const beak = mesh(group, 'beak', 'gold', [0, 0.37, 0.47]);
    beak.rotation.x = Math.PI / 2;
    for (const side of [-1, 1]) {
      mesh(
        group,
        'sphere',
        'dark',
        [side * 0.16, 0.44, 0.28],
        [0.037, 0.037, 0.028],
      );
    }
    const tail = mesh(
      group,
      'wing',
      'gold',
      [0, -0.23, -0.12],
      [0.42, 0.5, 0.9],
    );
    tail.rotation.z = -Math.PI / 2;
    tail.rotation.y = Math.PI / 2;
    const wings = [-1, 1].map((side) => {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.17, 0.02, -0.02);
      pivot.scale.x = side;
      const feather = mesh(pivot, 'wing', 'sage', [0, 0, 0]);
      feather.rotation.x = -0.2;
      group.add(pivot);
      return pivot;
    });
    return { group, wings };
  }

  function python(parent) {
    const group = new THREE.Group();
    group.name = 'python-sculpture';
    parent.add(group);
    mesh(group, 'snake', 'blue', [0, 0, 0]);
    const lower = mesh(group, 'snake', 'gold', [0, 0, 0]);
    lower.rotation.z = Math.PI;
    return { group };
  }

  function property(parent) {
    const group = new THREE.Group();
    group.name = 'property-sculpture';
    parent.add(group);
    mesh(group, 'box', 'sage', [0, -0.43, 0], [1.85, 0.12, 1.3]);
    for (const x of [-0.85, 0, 0.85])
      mesh(group, 'box', 'gold', [x, -0.36, 0], [0.025, 0.025, 1.2]);
    for (const z of [-0.58, 0, 0.58])
      mesh(group, 'box', 'gold', [0, -0.36, z], [1.72, 0.025, 0.025]);
    const marker = mesh(group, 'pin', 'gold', [0, 0.03, 0]);
    marker.name = 'parcel-pin';
    return {
      group,
      animate(wave, flourish) {
        marker.position.y = 0.03 + flourish * 0.2;
      },
    };
  }

  function widgets(parent) {
    const group = new THREE.Group();
    group.name = 'widgets-sculpture';
    parent.add(group);
    const layers = ['blue', 'sage', 'gold'].map((material, index) => {
      const layer = mesh(
        group,
        'box',
        material,
        [0, (index - 1) * 0.4, 0],
        [1.35, 0.11, 1.15],
      );
      layer.name = `widget-layer-${index}`;
      layer.rotation.set(0.25, Math.PI / 4, 0);
      return layer;
    });
    for (const side of [-1, 1]) {
      mesh(
        group,
        'cylinder',
        'gold',
        [side * 0.95, 0, 0],
        [0.022, 1.25, 0.022],
      );
      for (const y of [-0.63, 0.63]) {
        mesh(group, 'sphere', 'blue', [side * 0.95, y, 0], [0.1, 0.1, 0.1]);
        mesh(group, 'box', 'gold', [side * 0.68, y, 0], [0.54, 0.025, 0.025]);
      }
    }
    return {
      group,
      animate(wave, flourish) {
        layers.forEach((layer, index) => {
          layer.position.y = (index - 1) * (0.4 + flourish * 0.17);
          layer.rotation.y = Math.PI / 4 + wave * (index - 1) * 0.15;
        });
      },
    };
  }

  function architecture(parent) {
    const group = new THREE.Group();
    group.name = 'luma-sculpture';
    parent.add(group);
    mesh(group, 'box', 'gold', [0, -0.67, 0], [1.85, 0.1, 1.3]);
    const towers = [
      { x: -0.58, z: 0.13, height: 0.95 },
      { x: 0, z: -0.12, height: 1.7 },
      { x: 0.58, z: 0.18, height: 1.2 },
    ].map(({ x, z, height }, index) => {
      const tower = new THREE.Group();
      tower.name = `luma-tower-${index}`;
      tower.position.set(x, -0.6, z);
      group.add(tower);
      mesh(tower, 'box', 'stone', [0, height / 2, 0], [0.48, height, 0.65]);
      mesh(tower, 'box', 'gold', [0, height, 0], [0.5, 0.05, 0.67]);
      for (let y = 0.2; y < height - 0.1; y += 0.28) {
        mesh(tower, 'box', 'blue', [0, y, 0.332], [0.33, 0.16, 0.025]);
        mesh(tower, 'box', 'sage', [0.248, y, 0], [0.025, 0.16, 0.46]);
      }
      return tower;
    });
    return {
      group,
      animate(wave, flourish) {
        towers.forEach((tower, index) => {
          tower.position.y = -0.6 + flourish * (index === 1 ? 0.22 : 0.08);
        });
      },
    };
  }

  const makers = {
    property,
    widgets,
    automation: python,
    luma: architecture,
    birdmap: bird,
  };
  landmarks
    .filter((building) => makers[building.id])
    .forEach((building) => {
      const root = new THREE.Group();
      root.name = `city-emblem-${building.id}`;
      root.position.set(building.x, 0, building.z);
      const rooftop = new THREE.Group();
      rooftop.position.set(
        building.height >= 9 ? -0.65 : 0,
        building.height + 0.3,
        0.35,
      );
      root.add(rooftop);
      mesh(rooftop, 'cylinder', 'dark', [0, 0, 0], [1.3, 0.13, 1.3]);
      mesh(rooftop, 'cylinder', 'gold', [0, 0.09, 0], [1.16, 0.035, 1.16]);
      mesh(rooftop, 'cylinder', 'stone', [0, 0.15, 0], [1.11, 0.08, 1.11]);
      mesh(rooftop, 'cylinder', 'gold', [0, 0.58, 0], [0.045, 0.8, 0.045]);
      const maker = makers[building.id];
      const sculpture = maker(rooftop);
      sculpture.group.position.y = 1.3;
      sculpture.group.rotation.y = 0.28;
      const orbit = mesh(rooftop, 'orbit', 'gold', [0, 1.3, 0]);
      orbit.rotation.x = 0.3;
      orbit.rotation.y = -0.35;
      orbit.visible = false;
      const satellites = [0, 1, 2].map((index) => {
        const node = mesh(
          orbit,
          'sphere',
          index === 1 ? 'eye' : 'gold',
          [0, 0, 0],
          [0.065, 0.065, 0.065],
        );
        return node;
      });
      const front = building.depth / 2;
      const plaque = mesh(
        root,
        'box',
        'dark',
        [0, 1.82, front + 0.51],
        [1.25, 0.5, 0.16],
      );
      const badge = maker(plaque);
      badge.group.scale.set(0.28 / 1.25, 0.28 / 0.5, 0.28 / 0.16);
      badge.group.position.z = 0.6;
      scene.add(root);
      root.traverse((object) => {
        if (!object.isMesh) return;
        object.userData.projectId = building.projectId;
        hitTargets.push(object);
      });
      entries.push({
        root,
        sculpture,
        orbit,
        satellites,
        projectId: building.projectId,
        elapsed: duration,
        strength: 0,
      });
    });

  return {
    get hitTargets() {
      return hitTargets.filter(
        (object) => object.visible && object.parent.visible,
      );
    },
    setActive(projectId) {
      if (projectId === activeId) return;
      activeId = projectId;
      entries.forEach((entry) => {
        entry.elapsed = entry.projectId === activeId ? 0 : duration;
      });
    },
    update(delta, reducedMotion) {
      if (disposed) return false;
      let animating = false;
      entries.forEach((entry) => {
        const selected = entry.projectId === activeId;
        const target = selected ? 1 : 0;
        entry.strength = reducedMotion
          ? target
          : THREE.MathUtils.damp(entry.strength, target, 8, delta);
        if (Math.abs(entry.strength - target) < 0.001) entry.strength = target;
        entry.elapsed = reducedMotion
          ? duration
          : Math.min(duration, entry.elapsed + delta);
        const phase = entry.elapsed / duration;
        const flourish = Math.sin(phase * Math.PI) ** 2;
        const wave = Math.sin(phase * Math.PI * 6) * flourish;
        entry.sculpture.group.position.y =
          1.3 + entry.strength * 0.2 + flourish * 0.16;
        entry.sculpture.group.rotation.y = 0.28 + wave * 0.24;
        entry.sculpture.wings?.forEach((wing, index) => {
          wing.rotation.z = (index ? 1 : -1) * wave * 0.3;
        });
        entry.sculpture.animate?.(wave, flourish);
        entry.orbit.visible = entry.strength > 0.01;
        entry.satellites.forEach((node, index) => {
          const angle = phase * Math.PI * 2 + (index * Math.PI * 2) / 3;
          node.position.set(Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0);
        });
        animating ||= entry.strength !== target || (selected && phase < 1);
      });
      return animating;
    },
    setTheme(dark) {
      materials.stone.color.set(dark ? '#7a8980' : '#e4e3d7');
      materials.sage.color.set(dark ? '#8bb6a5' : '#6d978b');
      materials.blue.color.set(dark ? '#70a5b6' : '#487585');
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      entries.forEach(({ root }) => scene.remove(root));
      Object.values(geometries).forEach((geometry) => geometry.dispose());
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
}

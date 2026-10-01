import * as THREE from 'three';

export function createGuideModel() {
  const root = new THREE.Group();
  root.name = 'portfolio-guide';
  const geometries = new Set();
  const materials = new Set();
  const material = (color, options = {}) => {
    const value = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.65,
      ...options,
    });
    materials.add(value);
    return value;
  };
  const skin = material('#dca880');
  const hair = material('#40312b');
  const jacket = material('#708c7d');
  const shirt = material('#263c34');
  const trousers = material('#364249');
  const shoes = material('#242c29');
  const gold = material('#e4b83e', { metalness: 0.35, roughness: 0.35 });
  const ink = material('#293330');
  const white = material('#f5e6d1');
  const lens = material('#b3d6ce', {
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  const sphere = new THREE.SphereGeometry(1, 24, 16);
  const capsule = new THREE.CapsuleGeometry(1, 1, 6, 16);
  geometries.add(sphere);
  geometries.add(capsule);
  function mesh(geometry, surface, parent, position, scale) {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, surface);
    object.position.set(...position);
    if (scale) object.scale.set(...scale);
    parent.add(object);
    return object;
  }
  const oval = (parent, surface, position, scale) =>
    mesh(sphere, surface, parent, position, scale);
  function limb(parent, surface, from, to, radius) {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start);
    const object = mesh(
      capsule,
      surface,
      parent,
      start.add(end).multiplyScalar(0.5).toArray(),
      [radius, direction.length() / 3, radius],
    );
    object.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );
    return object;
  }
  mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.06, 48), gold, root,
    [0, 0.03, 0]);
  mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.025, 48), shirt, root,
    [0, 0.071, 0]);
  const body = new THREE.Group();
  body.position.y = 0.1;
  root.add(body);
  for (const x of [-0.13, 0.13]) {
    limb(body, trousers, [x, 0.15, 0], [x, 0.72, 0], 0.105);
    oval(body, shoes, [x, 0.09, 0.085], [0.12, 0.09, 0.21]);
  }
  oval(body, jacket, [0, 1.05, 0], [0.3, 0.42, 0.21]);
  oval(body, shirt, [0, 1.19, 0.172], [0.13, 0.28, 0.06]);
  for (const x of [-0.15, 0.15]) {
    const lapel = mesh(new THREE.BoxGeometry(0.08, 0.26, 0.03), jacket, body,
      [x, 1.25, 0.2]);
    lapel.rotation.z = x > 0 ? -0.3 : 0.3;
  }
  for (const y of [0.87, 1.01, 1.15]) {
    oval(body, gold, [0.085, y, 0.215], [0.017, 0.017, 0.012]);
  }
  limb(body, skin, [0, 1.35, 0], [0, 1.52, 0], 0.11);
  const head = new THREE.Group();
  head.position.y = 1.73;
  body.add(head);
  oval(head, skin, [0, 0, 0], [0.31, 0.37, 0.285]);
  oval(head, hair, [0, -0.17, 0.024], [0.264, 0.174, 0.258]);
  oval(head, skin, [0, -0.07, 0.19], [0.237, 0.18, 0.112]);
  for (const x of [-0.3, 0.3]) {
    oval(head, skin, [x, -0.01, 0], [0.063, 0.092, 0.07]);
  }
  oval(head, hair, [0, 0.19, -0.058], [0.31, 0.21, 0.26]);
  for (let index = 0; index < 6; index++) {
    const tuft = oval(head, hair,
      [-0.22 + index * 0.085, 0.28 + Math.sin(index) * 0.025, 0.07],
      [0.092, 0.12, 0.12]);
    tuft.rotation.z = -0.25;
  }
  for (const x of [-0.13, 0.13]) {
    oval(head, white, [x, 0.025, 0.263], [0.062, 0.042, 0.027]);
    oval(head, ink, [x, 0.025, 0.287], [0.024, 0.026, 0.01]);
    oval(head, hair, [x, 0.111, 0.256], [0.072, 0.018, 0.024]);
    mesh(new THREE.TorusGeometry(0.095, 0.014, 8, 32), ink, head,
      [x, 0.023, 0.292], [1.15, 0.79, 1]);
    oval(head, lens, [x, 0.023, 0.296], [0.103, 0.071, 0.008]);
    limb(head, ink, [Math.sign(x) * 0.24, 0.02, 0.28],
      [Math.sign(x) * 0.3, 0.03, 0], 0.012);
  }
  limb(head, ink, [-0.029, 0.033, 0.297], [0.029, 0.033, 0.297], 0.013);
  oval(head, skin, [0, -0.046, 0.292], [0.053, 0.057, 0.06]);
  const smile = mesh(new THREE.TorusGeometry(0.055, 0.012, 6, 24, Math.PI),
    white, head, [0, -0.125, 0.29]);
  smile.rotation.z = Math.PI;
  limb(body, jacket, [-0.25, 1.29, 0], [-0.43, 1.08, 0], 0.095);
  limb(body, jacket, [-0.43, 1.08, 0], [-0.54, 1.32, 0.05], 0.078);
  const ruler = new THREE.Group();
  ruler.name = 'guide-ruler';
  ruler.position.set(-0.58, 1.51, 0.085);
  ruler.rotation.z = -0.18;
  body.add(ruler);
  mesh(new THREE.BoxGeometry(0.135, 0.83, 0.04), gold, ruler, [0, 0, 0]);
  for (let index = 0; index < 12; index++) {
    const length = index % 3 === 0 ? 0.065 : 0.038;
    mesh(new THREE.BoxGeometry(length, 0.01, 0.006), ink, ruler,
      [0.067 - length / 2, -0.36 + index * 0.064, 0.023]);
  }
  oval(body, skin, [-0.53, 1.3, 0.125], [0.09, 0.105, 0.085]);
  const wave = new THREE.Group();
  wave.name = 'guide-waving-arm';
  wave.position.set(0.25, 1.3, 0);
  body.add(wave);
  limb(wave, jacket, [0, 0, 0], [0.21, 0.23, 0], 0.095);
  limb(wave, jacket, [0.21, 0.23, 0], [0.23, 0.51, 0], 0.075);
  oval(wave, skin, [0.23, 0.59, 0], [0.093, 0.1, 0.06]);
  for (let index = 0; index < 4; index++) {
    const x = 0.166 + index * 0.041;
    limb(wave, skin, [x, 0.64, 0],
      [x + (index - 1.5) * 0.009, 0.73 - Math.abs(index - 1.5) * 0.018, 0],
      0.019);
  }
  limb(wave, skin, [0.155, 0.58, 0], [0.12, 0.63, 0], 0.025);
  let disposed = false;
  return {
    root,
    update(time, reducedMotion = false) {
      const progress = Math.min(1, Math.max(0, time / 3.2));
      const strength = reducedMotion || progress === 1
        ? 0 : Math.sin(progress * Math.PI);
      wave.rotation.z = strength
        ? Math.sin(progress * Math.PI * 8) * strength * 0.24 : 0;
      head.rotation.z = strength ? strength * -0.045 : 0;
      body.rotation.y = strength * 0.055;
      return !reducedMotion && progress < 1;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      root.removeFromParent();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((surface) => surface.dispose());
    },
  };
}

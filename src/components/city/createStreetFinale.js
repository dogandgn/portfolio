import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import actionFont from './actionFont.json' with { type: 'json' };
import {
  finaleActions,
  getCameraPose,
  getStreetBlend,
  isFinaleReady,
} from './cityLayout.js';

const font = new FontLoader().parse(actionFont);

export function createStreetFinale(scene) {
  const root = new THREE.Group();
  root.name = 'city-street-finale';
  root.visible = false;
  const ringGeometry = new THREE.TorusGeometry(
    0.48,
    0.085,
    10,
    48,
    Math.PI * 1.7,
  );
  const arrowGeometry = new THREE.ConeGeometry(0.17, 0.32, 8);
  const returnPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.4, 0.35, 0),
    new THREE.Vector3(0.4, -0.2, 0),
    new THREE.Vector3(0.25, -0.35, 0),
    new THREE.Vector3(-0.35, -0.35, 0),
  ]);
  const returnGeometry = new THREE.TubeGeometry(
    returnPath,
    32,
    0.085,
    10,
    false,
  );
  const entries = finaleActions.map((action) => {
    const group = new THREE.Group();
    group.name = `city-finale-${action.id}`;
    group.position.set(action.x, 0, action.z);
    const finalPose = getCameraPose(1);
    group.rotation.y = Math.atan2(
      finalPose[0] - action.x,
      finalPose[2] - action.z,
    );
    const material = new THREE.MeshStandardMaterial({
      color: '#d9ad25',
      roughness: 0.4,
      metalness: 0.3,
    });
    const textMaterial = new THREE.MeshStandardMaterial({ roughness: 0.65 });
    const icon = new THREE.Group();
    icon.position.y = 2.65;
    const arrow = new THREE.Mesh(arrowGeometry, material);
    if (action.id === 'restart') {
      const ring = new THREE.Mesh(ringGeometry, material);
      ring.rotation.z = 0.45;
      arrow.position.set(0.42, 0.22, 0);
      arrow.rotation.z = -2.5;
      icon.add(ring, arrow);
    } else {
      arrow.position.set(-0.44, -0.35, 0);
      arrow.rotation.z = Math.PI / 2;
      icon.add(new THREE.Mesh(returnGeometry, material), arrow);
    }
    const text = new THREE.Group();
    group.add(icon, text);
    group.traverse((object) => {
      if (object.isMesh) {
        object.userData.action = action.id;
        object.castShadow = true;
      }
    });
    root.add(group);
    return {
      action,
      group,
      icon,
      text,
      material,
      textMaterial,
      strength: 0,
      label: null,
    };
  });
  scene.add(root);
  let ready = false;
  let elapsed = 3;
  let hovered = null;
  let disposed = false;
  const hitTargets = [];
  function setLabels(labels) {
    if (disposed) return;
    entries.forEach((entry) => {
      const label = labels[entry.action.id];
      if (!label || label === entry.label) return;
      entry.label = label;
      entry.text.children.forEach((mesh) => mesh.geometry.dispose());
      entry.text.clear();
      const words = label.split(' ');
      const lines =
        entry.action.id === 'return'
          ? [words.slice(0, -1).join(' '), words.at(-1)]
          : [label];
      lines.forEach((line, index) => {
        const geometry = new TextGeometry(line, {
          font,
          size: 0.2,
          depth: 0.025,
          curveSegments: 6,
          bevelEnabled: true,
          bevelThickness: 0.004,
          bevelSize: 0.002,
          bevelSegments: 2,
        });
        geometry.computeBoundingBox();
        const bounds = geometry.boundingBox;
        geometry.translate(-(bounds.max.x + bounds.min.x) / 2, 0, 0);
        const mesh = new THREE.Mesh(geometry, entry.textMaterial);
        mesh.position.set(0, 1.7 - index * 0.34, 0.05);
        mesh.castShadow = true;
        mesh.userData.action = entry.action.id;
        entry.text.add(mesh);
      });
    });
    hitTargets.length = 0;
    root.traverse((object) => {
      if (object.isMesh) hitTargets.push(object);
    });
  }
  setLabels({ restart: 'Baştan başla', return: 'Portfolyoya dön' });
  return {
    hitTargets,
    setLabels,
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
        const target = ready && entry.action.id === hovered ? 1 : 0;
        entry.strength = reducedMotion
          ? target
          : THREE.MathUtils.damp(entry.strength, target, 12, delta);
        if (Math.abs(entry.strength - target) < 0.001) entry.strength = target;
        entry.group.position.y = ready ? wave * 0.035 : 0;
        entry.icon.rotation.y = ready ? wave * 0.12 : 0;
        entry.group.scale.setScalar(1 + entry.strength * 0.06);
        entry.material.emissive.set('#ba9631');
        entry.material.emissiveIntensity = entry.strength * 0.35;
        animating ||= entry.strength !== target;
      });
      return animating;
    },
    isEnabled() {
      return ready && !disposed;
    },
    setTheme(dark) {
      entries.forEach(({ textMaterial }) =>
        textMaterial.color.set(dark ? '#ede5ce' : '#344b42'),
      );
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      scene.remove(root);
      ringGeometry.dispose();
      arrowGeometry.dispose();
      returnGeometry.dispose();
      entries.forEach(({ material, textMaterial, text }) => {
        text.children.forEach((mesh) => mesh.geometry.dispose());
        material.dispose();
        textMaterial.dispose();
      });
    },
  };
}

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
const revealDuration = 4;
const hoverDuration = 1.6;

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
  const orbitGeometry = new THREE.TorusGeometry(0.71, 0.018, 8, 72);
  const beadGeometry = new THREE.SphereGeometry(0.052, 16, 12);
  const returnPath = new THREE.LineCurve3(
    new THREE.Vector3(0.34, -0.34, 0),
    new THREE.Vector3(-0.3, 0.3, 0),
  );
  const returnGeometry = new THREE.TubeGeometry(
    returnPath,
    1,
    0.045,
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
      roughness: 0.28,
      metalness: 0.5,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: '#6d978b',
      roughness: 0.4,
      metalness: 0.3,
    });
    const textMaterial = new THREE.MeshStandardMaterial({ roughness: 0.65 });
    const icon = new THREE.Group();
    icon.position.y = 2.25;
    const symbol = new THREE.Group();
    const orbit = new THREE.Group();
    const halo = new THREE.Mesh(orbitGeometry, accentMaterial);
    halo.rotation.set(0.15, 0.4, 0);
    orbit.add(halo);
    for (const phase of [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]) {
      const bead = new THREE.Mesh(beadGeometry, material);
      bead.position.set(Math.cos(phase) * 0.71, Math.sin(phase) * 0.71, 0);
      halo.add(bead);
    }
    orbit.position.z = -0.12;
    icon.add(orbit, symbol);
    const arrow = new THREE.Mesh(arrowGeometry, material);
    if (action.id === 'restart') {
      const ring = new THREE.Mesh(ringGeometry, material);
      ring.rotation.z = 0.45;
      arrow.position.set(0.42, 0.22, 0);
      arrow.rotation.z = -2.5;
      symbol.add(ring, arrow);
    } else {
      arrow.position.set(-0.32, 0.32, 0);
      arrow.rotation.z = Math.PI / 4;
      arrow.scale.setScalar(0.8);
      symbol.add(new THREE.Mesh(returnGeometry, material), arrow);
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
      symbol,
      orbit,
      text,
      material,
      accentMaterial,
      textMaterial,
      strength: 0,
      label: null,
    };
  });
  scene.add(root);
  let ready = false;
  let elapsed = revealDuration;
  let hovered = null;
  let hoverElapsed = hoverDuration;
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
      const lines = [words.slice(0, -1).join(' '), words.at(-1)].filter(
        Boolean,
      );
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
        mesh.position.set(0, 1.2 - index * 0.3, 0.05);
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
      if (id === hovered) return;
      hovered = id;
      hoverElapsed = 0;
    },
    update(progress, delta, reducedMotion) {
      if (disposed) return false;
      root.visible = getStreetBlend(progress) > 0.2;
      const nextReady = isFinaleReady(progress);
      if (nextReady && !ready) elapsed = 0;
      ready = nextReady;
      elapsed =
        reducedMotion || !ready
          ? revealDuration
          : Math.min(revealDuration, elapsed + delta);
      hoverElapsed =
        reducedMotion || !ready || !hovered
          ? hoverDuration
          : Math.min(hoverDuration, hoverElapsed + delta);
      const reveal = elapsed / revealDuration;
      const eased = 1 - (1 - reveal) ** 3;
      const wave =
        reveal < 1
          ? Math.sin(reveal * Math.PI * 3) * Math.sin(reveal * Math.PI)
          : 0;
      let animating =
        ready && (elapsed < revealDuration || hoverElapsed < hoverDuration);
      entries.forEach((entry) => {
        const target = ready && entry.action.id === hovered ? 1 : 0;
        entry.strength = reducedMotion
          ? target
          : THREE.MathUtils.damp(entry.strength, target, 12, delta);
        if (Math.abs(entry.strength - target) < 0.001) entry.strength = target;
        const hoverWave =
          target && hoverElapsed < hoverDuration
            ? Math.sin((hoverElapsed / hoverDuration) * Math.PI)
            : 0;
        entry.group.position.y = ready ? wave * 0.05 : 0;
        entry.icon.rotation.y = ready ? wave * 0.18 : 0;
        entry.icon.scale.setScalar(0.9 + eased * 0.1);
        entry.orbit.rotation.set(
          wave * 0.1,
          wave * 0.28 + hoverWave * 0.3,
          wave * 0.18,
        );
        entry.symbol.rotation.z =
          entry.action.id === 'restart'
            ? (1 - eased) * Math.PI * 2 + hoverWave * 0.32
            : hoverWave * -0.08;
        entry.symbol.position.x =
          entry.action.id === 'return'
            ? (1 - eased) * 0.18 - hoverWave * 0.08
            : 0;
        entry.group.scale.setScalar(1 + entry.strength * 0.035);
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
      entries.forEach(({ textMaterial, accentMaterial }) => {
        textMaterial.color.set(dark ? '#ede5ce' : '#344b42');
        accentMaterial.color.set(dark ? '#87a79a' : '#6d978b');
      });
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      scene.remove(root);
      ringGeometry.dispose();
      arrowGeometry.dispose();
      orbitGeometry.dispose();
      beadGeometry.dispose();
      returnGeometry.dispose();
      entries.forEach(({ material, accentMaterial, textMaterial, text }) => {
        text.children.forEach((mesh) => mesh.geometry.dispose());
        material.dispose();
        accentMaterial.dispose();
        textMaterial.dispose();
      });
    },
  };
}

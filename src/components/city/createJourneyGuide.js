import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { getRouteDistance, getStreetBlend } from './cityLayout.js';
import { getFinaleBlend, getGuideHeading, getGuidePoint, getRunPose } from './guideJourney.js';

export function createJourneyGuide(scene) {
  const root = new THREE.Group();
  root.name = 'city-journey-guide';
  scene.add(root);
  const body = new THREE.Group();
  root.add(body);
  const geometries = new Set();
  const materials = new Set();
  function material(color, roughness = 0.8, metalness = 0) {
    const value = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    materials.add(value);
    return value;
  }
  const skin = material('#d59d76');
  const hair = material('#392a23');
  const hairLight = material('#574035');
  const jacket = material('#65725c');
  const trim = material('#839078');
  const trousers = material('#303332');
  const sole = material('#a29c8e');
  const frames = material('#242b29', 0.35);
  const white = material('#f3e8d5');
  const gold = material('#d6ad40', 0.42, 0.3);
  const glass = material('#aac5c2', 0.18);
  glass.transparent = true;
  glass.opacity = 0.18;
  glass.depthWrite = false;
  const sphere = new THREE.SphereGeometry(1, 20, 12);
  const box = new RoundedBoxGeometry(1, 1, 1, 2, 0.16);
  const capsule = new THREE.CapsuleGeometry(1, 1.6, 6, 12);
  geometries.add(sphere);
  geometries.add(box);
  geometries.add(capsule);
  function mesh(parent, shape, paint, position, scale) {
    const object = new THREE.Mesh(shape, paint);
    object.position.set(...position);
    object.scale.set(...scale);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  const oval = (parent, paint, position, scale) => mesh(parent, sphere, paint, position, scale);
  const rounded = (parent, paint, position, scale) => mesh(parent, box, paint, position, scale);
  function pivot(parent, name, position) {
    const group = new THREE.Group();
    group.name = name;
    group.position.set(...position);
    parent.add(group);
    return group;
  }
  rounded(body, jacket, [0, 1.03, 0], [0.49, 0.59, 0.28]);
  rounded(body, trousers, [0, 0.79, 0], [0.38, 0.19, 0.26]);
  rounded(body, trousers, [0, 1.1, 0.148], [0.16, 0.46, 0.018]);
  for (const side of [-1, 1]) {
    const collar = rounded(body, trim, [side * 0.115, 1.29, 0.12], [0.12, 0.15, 0.055]);
    collar.rotation.z = side * 0.4;
    rounded(body, trim, [side * 0.15, 1.09, 0.151], [0.13, 0.12, 0.018]);
    rounded(body, jacket, [side * 0.15, 1.14, 0.17], [0.14, 0.04, 0.02]);
    for (const y of [0.86, 0.99, 1.12]) oval(body, gold, [side * 0.1, y, 0.166], [0.012, 0.012, 0.012]);
  }
  oval(body, skin, [0, 1.36, 0], [0.095, 0.12, 0.09]);
  const head = pivot(body, 'guide-head', [0, 1.62, 0]);
  oval(head, skin, [0, 0, 0], [0.235, 0.275, 0.205]);
  oval(head, hair, [0, -0.12, 0.037], [0.208, 0.16, 0.185]);
  oval(head, skin, [0, -0.059, 0.138], [0.17, 0.118, 0.09]);
  oval(head, hair, [0, -0.092, 0.209], [0.092, 0.021, 0.019]);
  oval(head, white, [0, -0.139, 0.206], [0.067, 0.015, 0.013]);
  oval(head, skin, [0, -0.005, 0.221], [0.047, 0.06, 0.049]);
  oval(head, hair, [0, 0.16, -0.022], [0.241, 0.17, 0.2]);
  oval(head, hair, [0, 0.035, -0.115], [0.221, 0.22, 0.112]);
  for (let index = 0; index < 9; index++) {
    const x = -0.18 + index * 0.045;
    const lock = oval(head, index % 3 ? hair : hairLight,
      [x, 0.08, -0.18 + Math.abs(x) * 0.18], [0.037, 0.16, 0.05]);
    lock.rotation.z = -0.14;
  }
  for (let index = 0; index < 7; index++) {
    const lock = oval(head, index % 2 ? hairLight : hair,
      [-0.17 + index * 0.05, 0.215 + Math.sin(index * 0.48) * 0.04, 0.045],
      [0.059, 0.115, 0.17]);
    lock.rotation.z = -0.48;
    lock.rotation.x = -0.22;
  }
  const lensCurve = new THREE.CatmullRomCurve3([
    [-0.07, -0.052, 0], [0.065, -0.052, 0], [0.085, 0.015, 0],
    [0.055, 0.065, 0], [-0.06, 0.065, 0], [-0.086, 0.012, 0],
  ].map((point) => new THREE.Vector3(...point)), true, 'centripetal');
  const rim = new THREE.TubeGeometry(lensCurve, 36, 0.009, 6, true);
  geometries.add(rim);
  for (const side of [-1, 1]) {
    oval(head, skin, [side * 0.232, -0.005, -0.005], [0.045, 0.072, 0.035]);
    oval(head, white, [side * 0.102, 0.039, 0.181], [0.058, 0.064, 0.031]);
    oval(head, hair, [side * 0.102, 0.037, 0.211], [0.03, 0.038, 0.018]);
    oval(head, white, [side * 0.102 - 0.011, 0.051, 0.225], [0.01, 0.013, 0.006]);
    const brow = oval(head, hair, [side * 0.101, 0.131, 0.185], [0.072, 0.018, 0.024]);
    brow.rotation.z = -side * 0.12;
    mesh(head, rim, frames, [side * 0.106, 0.039, 0.223], [1, 1, 1]);
    oval(head, glass, [side * 0.106, 0.044, 0.224], [0.076, 0.052, 0.006]);
    rounded(head, frames, [side * 0.204, 0.062, 0.09], [0.012, 0.014, 0.255]);
  }
  rounded(head, frames, [0, 0.061, 0.23], [0.043, 0.012, 0.014]);
  const ruler = pivot(body, 'guide-ruler', [0.16, 1.08, -0.19]);
  ruler.rotation.z = -0.24;
  rounded(ruler, gold, [0, 0, 0], [0.085, 0.79, 0.035]);
  for (let index = 0; index < 19; index++) {
    rounded(ruler, hair, [0.015, -0.36 + index * 0.04, -0.02],
      [index % 5 === 0 ? 0.049 : 0.025, 0.005, 0.004]);
  }
  const hips = [];
  const knees = [];
  const arms = [];
  const elbows = [];
  for (const side of [-1, 1]) {
    const hip = pivot(body, `guide-hip-${side}`, [side * 0.12, 0.8, 0]);
    mesh(hip, capsule, trousers, [0, -0.17, 0], [0.095, 0.12, 0.102]);
    const knee = pivot(hip, `guide-knee-${side}`, [0, -0.34, 0]);
    mesh(knee, capsule, trousers, [0, -0.16, 0], [0.079, 0.108, 0.085]);
    rounded(knee, sole, [0, -0.365, 0.056], [0.2, 0.065, 0.34]);
    rounded(knee, frames, [0, -0.31, 0.052], [0.18, 0.12, 0.31]);
    for (let index = 0; index < 3; index++) {
      rounded(knee, sole, [0, -0.245, 0.02 + index * 0.034], [0.1, 0.008, 0.01]);
    }
    const arm = pivot(body, `guide-arm-${side}`, [side * 0.27, 1.24, 0]);
    arm.rotation.z = side * 0.09;
    oval(arm, jacket, [0, -0.13, 0], [0.097, 0.19, 0.093]);
    const elbow = pivot(arm, `guide-elbow-${side}`, [0, -0.25, 0]);
    oval(elbow, jacket, [0, -0.09, 0], [0.082, 0.14, 0.079]);
    rounded(elbow, trim, [0, -0.185, 0], [0.14, 0.055, 0.14]);
    oval(elbow, skin, [0, -0.255, 0.012], [0.069, 0.087, 0.057]);
    oval(elbow, skin, [-side * 0.05, -0.235, 0.04], [0.025, 0.041, 0.029]);
    hips.push(hip);
    knees.push(knee);
    arms.push(arm);
    elbows.push(elbow);
  }
  const groups = [];
  root.traverse((group) => { if (group.isGroup) groups.push(group); });
  groups.forEach((group) => {
    const batches = new Map();
    group.children.filter((child) => child.isMesh).forEach((child) => {
      const batch = batches.get(child.material) || [];
      batch.push(child);
      batches.set(child.material, batch);
    });
    for (const [paint, parts] of batches) {
      if (parts.length < 2) continue;
      const copies = parts.map((part) => {
        part.updateMatrix();
        const copy = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
        return copy.applyMatrix4(part.matrix);
      });
      const merged = mergeGeometries(copies);
      copies.forEach((copy) => copy.dispose());
      geometries.add(merged);
      parts.forEach((part) => part.removeFromParent());
      mesh(group, merged, paint, [0, 0, 0], [1, 1, 1]);
    }
  });
  const used = new Set();
  root.traverse((object) => { if (object.isMesh) used.add(object.geometry); });
  geometries.forEach((value) => {
    if (used.has(value)) return;
    value.dispose();
    geometries.delete(value);
  });
  let previousDistance = null;
  let phase = 0;
  let amount = 0;
  let direction = 1;
  let disposed = false;
  return {
    update(progress, delta, reducedMotion = false, immediate = false) {
      const distance = getRouteDistance(progress);
      const point = getGuidePoint(distance);
      const movement = previousDistance === null || immediate ? 0 : distance - previousDistance;
      const dt = Math.min(Math.max(delta, 0.001), 0.05);
      const target = reducedMotion ? 0 : Math.min(Math.abs(movement) / dt / 3, 1);
      amount = reducedMotion || immediate ? 0 : THREE.MathUtils.damp(amount, target, 12, dt);
      if (amount < 0.001 && target === 0) amount = 0;
      if (!reducedMotion) phase += Math.min(Math.abs(movement), dt * 7) * 4.8;
      const pose = getRunPose(phase, amount);
      root.position.set(point.x, 0.14, point.z);
      if (Math.abs(movement) > 0.0001) direction = Math.sign(movement);
      if (immediate) direction = 1;
      const heading = getGuideHeading(distance) + (direction < 0 ? Math.PI : 0);
      const difference = Math.atan2(Math.sin(heading - root.rotation.y), Math.cos(heading - root.rotation.y));
      root.rotation.y += difference * (reducedMotion || immediate || previousDistance === null ? 1 : 1 - Math.exp(-12 * dt));
      root.scale.setScalar(1.35 - getStreetBlend(progress) * 0.35);
      const opacity = 1 - getFinaleBlend(progress);
      root.visible = opacity > 0.001;
      for (const paint of materials) {
        const transparent = paint === glass || opacity < 1;
        if (paint.transparent !== transparent) {
          paint.transparent = transparent;
          paint.needsUpdate = true;
        }
        paint.opacity = opacity * (paint === glass ? 0.18 : 1);
        paint.depthWrite = paint !== glass && opacity > 0.5;
      }
      body.position.y = pose.bounce;
      body.rotation.set(pose.lean, pose.twist, 0);
      hips[0].rotation.x = pose.leftHip;
      hips[1].rotation.x = pose.rightHip;
      knees[0].rotation.x = pose.leftKnee;
      knees[1].rotation.x = pose.rightKnee;
      arms[0].rotation.x = pose.leftArm;
      arms[1].rotation.x = pose.rightArm;
      elbows.forEach((elbow) => { elbow.rotation.x = -0.15 - amount * 0.85; });
      previousDistance = distance;
      return amount > 0 || (!reducedMotion && !immediate && Math.abs(difference) > 0.001);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      root.removeFromParent();
      geometries.forEach((value) => value.dispose());
      materials.forEach((value) => value.dispose());
    },
  };
}

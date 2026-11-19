import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getRouteDistance, pavementHeight } from './cityLayout.js';
import { getFinaleBlend, getGuideHeading, getGuidePoint } from './guideJourney.js';

function disposeMeshes(group) {
  const resources = new Set();
  group.traverse(part => {
    if (!part.isMesh) return;
    resources.add(part.geometry);
    for (const material of [].concat(part.material)) resources.add(material);
    if (part.skeleton) resources.add(part.skeleton);
  });
  for (const resource of resources) resource.dispose();
}

export function createJourneyGuide(scene, requestRender, model = new GLTFLoader().loadAsync('/mascot/kent-robotu.glb')) {
  const root = new THREE.Group();
  root.name = 'city-journey-guide';
  scene.add(root);
  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12),
    new THREE.MeshStandardMaterial({ color: '#c79e3f' }));
  marker.position.y = 0.18;
  root.add(marker);
  const paints = new Set([marker.material]);
  let mixer, idle, run;
  let previousDistance = null;
  let direction = 1;
  let amount = 0;
  let disposed = false;

  model.then(({ scene: robot, animations }) => {
    if (disposed) {
      disposeMeshes(robot);
      return;
    }
    mixer = new THREE.AnimationMixer(robot);
    idle = mixer.clipAction(THREE.AnimationClip.findByName(animations, 'Idle')).play();
    run = mixer.clipAction(THREE.AnimationClip.findByName(animations, 'Running')).play();
    run.setEffectiveWeight(0);
    mixer.update(0);
    const bounds = new THREE.Box3().setFromObject(robot, true);
    const scale = 1.78 / (bounds.max.y - bounds.min.y);
    robot.scale.multiplyScalar(scale);
    robot.position.y -= bounds.min.y * scale;
    robot.traverse(part => {
      if (!part.isMesh) return;
      part.castShadow = true;
      for (const material of [].concat(part.material)) paints.add(material);
    });
    robot.name = 'kent-robotu';
    root.add(robot);
    marker.visible = false;
    requestRender?.();
  }, () => requestRender?.());

  return {
    position: root.position,
    update(progress, delta, reducedMotion = false, immediate = false) {
      const distance = getRouteDistance(progress);
      const point = getGuidePoint(distance);
      const movement = previousDistance === null || immediate ? 0 : distance - previousDistance;
      const dt = THREE.MathUtils.clamp(delta, 0.001, 0.05);
      const speed = Math.abs(movement) / dt;
      const target = Math.min(speed / 2.8, 1);
      amount = reducedMotion || immediate ? 0 : THREE.MathUtils.damp(amount, target, target > amount ? 12 : 8, dt);
      if (amount < 0.001 && !target) amount = 0;
      if (Math.abs(movement) > 0.0001) direction = Math.sign(movement);
      if (immediate) direction = 1;
      const heading = getGuideHeading(distance) + (direction < 0 ? Math.PI : 0);
      const difference = Math.atan2(Math.sin(heading - root.rotation.y), Math.cos(heading - root.rotation.y));
      root.rotation.y += difference * (reducedMotion || immediate || previousDistance === null ? 1 : 1 - Math.exp(-12 * dt));
      root.position.set(point.x, pavementHeight + 0.004, point.z);
      const opacity = 1 - getFinaleBlend(progress);
      root.visible = opacity > 0.001;
      for (const paint of paints) {
        if (paint.transparent !== (opacity < 1)) {
          paint.transparent = opacity < 1;
          paint.needsUpdate = true;
        }
        paint.opacity = opacity;
        paint.depthWrite = opacity > 0.5;
      }
      if (mixer) {
        idle.setEffectiveWeight(1 - amount);
        run.setEffectiveWeight(amount).setEffectiveTimeScale(THREE.MathUtils.clamp(speed / 3, 0.7, 1.8));
        if (!amount) run.time = 0;
        mixer.update(amount && root.visible ? dt : 0);
      }
      previousDistance = distance;
      return root.visible && (amount > 0 || (!reducedMotion && !immediate && Math.abs(difference) > 0.001));
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (mixer) {
        mixer.stopAllAction();
        mixer.uncacheRoot(mixer.getRoot());
      }
      root.removeFromParent();
      disposeMeshes(root);
    },
  };
}

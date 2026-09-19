import * as THREE from 'three';
import { landmarks } from './cityLayout.js';

const revealDuration = 1.1;

export function createProjectHighlight(scene, geometry) {
  const highlights = landmarks.map((building) => {
    const group = new THREE.Group();
    group.name = `city-highlight-${building.id}`;
    group.position.set(building.x, 0, building.z);
    group.visible = false;
    const outline = new THREE.MeshBasicMaterial({
      color: '#d0a022',
      transparent: true,
      opacity: 0,
      toneMapped: false,
      depthWrite: false,
    });
    const sweep = outline.clone();
    const scan = new THREE.Group();
    const height = building.height + 0.45;
    function rail(parent, material, x, y, z, width, railHeight, depth) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.scale.set(width, railHeight, depth);
      parent.add(mesh);
    }
    function frame(parent, material, y, width, depth, thickness) {
      for (const side of [-1, 1]) {
        rail(
          parent,
          material,
          0,
          y,
          (side * depth) / 2,
          width,
          thickness,
          thickness,
        );
        rail(
          parent,
          material,
          (side * width) / 2,
          y,
          0,
          thickness,
          thickness,
          depth,
        );
      }
    }
    const width = building.width + 0.18;
    const depth = building.depth + 0.18;
    frame(group, outline, height, width, depth, 0.065);
    frame(group, outline, 0.17, width + 1.15, depth + 1.15, 0.09);
    for (const x of [-width / 2, width / 2]) {
      for (const z of [-depth / 2, depth / 2])
        rail(group, outline, x, height / 2, z, 0.06, height, 0.06);
    }
    frame(scan, sweep, 0, width + 0.04, depth + 0.04, 0.12);
    group.add(scan);
    scene.add(group);
    return {
      projectId: building.projectId,
      group,
      outline,
      sweep,
      scan,
      height,
      strength: 0,
      target: 0,
      elapsed: revealDuration,
    };
  });
  let activeId = null;

  return {
    setActive(projectId) {
      const nextId = landmarks.some(
        (building) => building.projectId === projectId,
      )
        ? projectId
        : null;
      if (nextId === activeId) return;
      activeId = nextId;
      highlights.forEach((highlight) => {
        highlight.target = highlight.projectId === activeId ? 1 : 0;
        highlight.elapsed = highlight.target ? 0 : revealDuration;
      });
    },
    update(delta, reducedMotion) {
      let animating = false;
      highlights.forEach((highlight) => {
        const { group, outline, sweep, scan, height, target } = highlight;
        highlight.strength = reducedMotion
          ? target
          : THREE.MathUtils.damp(highlight.strength, target, 12, delta);
        if (Math.abs(highlight.strength - target) < 0.001)
          highlight.strength = target;
        highlight.elapsed = reducedMotion
          ? revealDuration
          : Math.min(revealDuration, highlight.elapsed + delta);
        const phase = highlight.elapsed / revealDuration;
        group.visible = highlight.strength > 0;
        outline.opacity = highlight.strength * 0.92;
        scan.visible = target === 1 && phase < 1 && !reducedMotion;
        scan.position.y = 0.2 + (height - 0.2) * (1 - (1 - phase) ** 3);
        sweep.opacity = Math.sin(phase * Math.PI) * highlight.strength * 0.8;
        animating ||=
          highlight.strength !== target || (target === 1 && phase < 1);
      });
      return animating;
    },
    dispose() {
      highlights.forEach(({ group, outline, sweep }) => {
        scene.remove(group);
        outline.dispose();
        sweep.dispose();
      });
    },
  };
}

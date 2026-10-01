import * as THREE from 'three';
import { createGuideModel } from './createGuideModel';

export function createGuideRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 152 / 174, 0.1, 20);
  camera.position.set(0.3, 1.9, 4.8);
  camera.lookAt(0, 1.2, 0);
  scene.add(new THREE.HemisphereLight('#fff7e5', '#698478', 2.8));
  const light = new THREE.DirectionalLight('#fff1d2', 3.2);
  light.position.set(-3, 5, 4);
  scene.add(light);
  const guide = createGuideModel();
  scene.add(guide.root);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let started = 0;
  let lastDraw = -Infinity;
  let visible = false;
  let disposed = false;
  let repeat = 0;
  const draw = () => renderer.render(scene, camera);
  const animate = (time) => {
    frame = 0;
    if (disposed || !visible) return;
    const active = guide.update((time - started) / 1000, motion.matches);
    if (!active || time - lastDraw >= 1000 / 30) {
      draw();
      lastDraw = time;
    }
    if (active) frame = requestAnimationFrame(animate);
  };
  function wave() {
    if (disposed || !visible || frame || motion.matches) return;
    started = performance.now();
    lastDraw = -Infinity;
    frame = requestAnimationFrame(animate);
  }
  function setVisible(value) {
    visible = value && !document.hidden;
    cancelAnimationFrame(frame);
    frame = 0;
    window.clearInterval(repeat);
    if (!visible || disposed) return;
    guide.update(3.2, true);
    draw();
    wave();
    if (!motion.matches) repeat = window.setInterval(wave, 12000);
  }
  const resize = new ResizeObserver(() => {
    if (disposed) return;
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (visible) draw();
  });
  resize.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) =>
    setVisible(entry.isIntersecting));
  visibility.observe(canvas);
  const onVisibility = () => setVisible(canvas.getBoundingClientRect().width > 0);
  const onMotion = () => setVisible(visible);
  document.addEventListener('visibilitychange', onVisibility);
  motion.addEventListener('change', onMotion);
  return {
    wave,
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearInterval(repeat);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
      guide.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

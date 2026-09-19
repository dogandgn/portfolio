import * as THREE from 'three';
import { captureViewport } from './captureViewport';
import { easePortal, getPortalBounds, withDeadline } from './portalMath';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D page;
  uniform vec2 center;
  uniform float aspect;
  uniform float extent;
  uniform float progress;
  uniform float opening;
  uniform vec3 paper;
  varying vec2 vUv;
  void main() {
    vec2 delta = (vUv - center) * vec2(aspect, 1.0);
    float distance = length(delta);
    vec3 black = vec3(0.004, 0.006, 0.006);
    vec3 gold = vec3(0.66, 0.39, 0.035);
    if (opening > 0.5) {
      float radius = (extent + 0.03) * progress;
      float edge = exp(-pow((distance - radius) / 0.005, 2.0));
      float mask = smoothstep(radius - 0.012, radius + 0.004, distance);
      gl_FragColor = vec4(mix(black, gold, edge * (1.0 - progress)), max(mask, edge * 0.7 * (1.0 - progress)));
    } else {
      float field = 0.25 + 0.75 * (1.0 - smoothstep(0.0, extent * 1.4, distance));
      float pull = 1.0 + 30.0 * pow(progress, 3.0) * field;
      float angle = progress * progress * 1.8 * field;
      mat2 twist = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      vec2 source = center + twist * delta * pull / vec2(aspect, 1.0);
      float inside = step(0.0, source.x) * step(source.x, 1.0) * step(0.0, source.y) * step(source.y, 1.0);
      vec3 background = mix(paper, black, progress);
      vec3 color = mix(background, texture2D(page, clamp(source, 0.0, 1.0)).rgb, inside);
      float radius = 0.018 + (extent + 0.03) * pow(progress, 3.0);
      float edge = exp(-pow((distance - radius) / 0.004, 2.0));
      float hole = smoothstep(radius - 0.003, radius + 0.003, distance);
      color = mix(black, color, hole);
      color += gold * edge * (1.0 - progress);
      gl_FragColor = vec4(color, 1.0);
    }
    #include <colorspace_fragment>
  }
`;

export async function runPortalTransition({
  element,
  origin,
  signal,
  onCovered,
}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'portal-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  let texture;
  let material;
  let geometry;
  let frame = 0;
  const overflow = document.body.style.overflow;
  const visibility = element.style.visibility;
  try {
    const snapshot = await withDeadline(
      captureViewport(element, signal),
      3500,
      signal,
    );
    signal.throwIfAborted();
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);
    texture = new THREE.CanvasTexture(snapshot);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    const bounds = getPortalBounds(
      origin,
      window.innerWidth,
      window.innerHeight,
    );
    material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        page: { value: texture },
        center: { value: new THREE.Vector2(bounds.x, bounds.y) },
        aspect: { value: window.innerWidth / window.innerHeight },
        extent: { value: bounds.radius },
        progress: { value: 0 },
        opening: { value: 0 },
        paper: {
          value: new THREE.Color(
            getComputedStyle(document.body).backgroundColor,
          ),
        },
      },
      vertexShader,
      fragmentShader,
    });
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));
    document.body.append(canvas);
    document.body.style.overflow = 'hidden';
    renderer.render(scene, camera);
    element.style.visibility = 'hidden';

    function animate(duration, opening) {
      canvas.dataset.phase = opening ? 'opening' : 'closing';
      material.uniforms.opening.value = opening;
      return new Promise((resolve, reject) => {
        let started;
        function abort() {
          cancelAnimationFrame(frame);
          signal.removeEventListener('abort', abort);
          reject(new DOMException('Transition cancelled', 'AbortError'));
        }
        if (signal.aborted) return abort();
        signal.addEventListener('abort', abort, { once: true });
        function tick(now) {
          started ??= now;
          const progress = Math.min(1, (now - started) / duration);
          material.uniforms.progress.value = easePortal(progress);
          try {
            if (renderer.getContext().isContextLost())
              throw new Error('Portal context lost');
            renderer.render(scene, camera);
          } catch (error) {
            signal.removeEventListener('abort', abort);
            reject(error);
            return;
          }
          if (progress < 1) frame = requestAnimationFrame(tick);
          else {
            signal.removeEventListener('abort', abort);
            resolve();
          }
        }
        frame = requestAnimationFrame(tick);
      });
    }
    await animate(1050, 0);
    canvas.dataset.phase = 'loading';
    await withDeadline(onCovered(), 8000, signal);
    await animate(850, 1);
  } finally {
    cancelAnimationFrame(frame);
    element.style.visibility = visibility;
    document.body.style.overflow = overflow;
    canvas.remove();
    texture?.dispose();
    material?.dispose();
    geometry?.dispose();
    renderer?.dispose();
  }
}

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
  uniform float time;
  uniform vec3 paper;
  varying vec2 vUv;
  void main() {
    vec2 portalCenter = mix(center, vec2(0.55, 0.5), opening > 0.5 ? 1.0 : smoothstep(0.05, 0.85, progress));
    vec2 delta = (vUv - portalCenter) * vec2(aspect, 1.0);
    float distance = length(delta);
    float theta = atan(delta.y, delta.x);
    vec3 black = vec3(0.004, 0.006, 0.006);
    vec3 gold = vec3(0.66, 0.39, 0.035);
    float orbit = theta - time * 5.5;
    float bandRadius = 0.105 + 0.003 * sin(theta * 3.0 - time * 4.0);
    float band = exp(-pow((distance - bandRadius) / 0.008, 2.0));
    float halo = exp(-pow((distance - 0.112) / 0.035, 2.0)) * 0.13;
    float arc = pow(0.5 + 0.5 * cos(orbit), 8.0);
    float inner = exp(-pow((distance - 0.087) / 0.002, 2.0)) * (0.25 + 0.35 * sin(theta * 2.0 + time * 3.0));
    vec3 vortex = gold * (band * (0.3 + arc * 2.0) + halo + max(0.0, inner));
    if (opening > 1.5) {
      float radius = (extent + 0.03) * progress;
      float edge = exp(-pow((distance - radius) / 0.005, 2.0));
      float mask = smoothstep(radius - 0.012, radius + 0.004, distance);
      vec3 color = mix(black, gold, edge * (1.0 - progress)) + vortex * (1.0 - smoothstep(0.0, 0.12, progress));
      gl_FragColor = vec4(color, max(mask, edge * 0.7 * (1.0 - progress)));
    } else if (opening > 0.5) {
      gl_FragColor = vec4(black + vortex, 1.0);
    } else {
      float field = 0.25 + 0.75 * (1.0 - smoothstep(0.0, extent * 1.4, distance));
      float pull = 1.0 + 90.0 * pow(progress, 3.0) * field;
      float angle = progress * progress * 5.0 * field;
      mat2 twist = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      vec2 source = center + twist * delta * pull / vec2(aspect, 1.0);
      float inside = step(0.0, source.x) * step(source.x, 1.0) * step(0.0, source.y) * step(source.y, 1.0);
      vec3 background = mix(paper, black, smoothstep(0.08, 0.85, progress));
      vec3 color = mix(background, texture2D(page, clamp(source, 0.0, 1.0)).rgb, inside);
      float radius = mix(0.018, 0.09, smoothstep(0.0, 0.7, progress));
      float edge = exp(-pow((distance - radius) / 0.004, 2.0));
      float hole = smoothstep(radius - 0.003, radius + 0.003, distance);
      color = mix(black, color, hole);
      color += gold * edge * (1.0 - progress);
      color += vortex * smoothstep(0.35, 1.0, progress);
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
        time: { value: 0 },
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
      canvas.dataset.phase = ['closing', 'vortex', 'opening'][opening];
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
          material.uniforms.time.value = now / 1000;
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
    await animate(1250, 0);
    await withDeadline(
      Promise.all([onCovered(), animate(900, 1)]),
      8000,
      signal,
    );
    await animate(1000, 2);
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

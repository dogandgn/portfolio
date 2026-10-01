import * as THREE from 'three';
import {
  clampProgress,
  createBuildings,
  districts,
  getCameraPose,
  getStreetBlend,
  finaleActions,
  landmarks,
} from './cityLayout';
import { createLandscape } from './createLandscape';
import { createCityRoute } from './createCityRoute';
import { createCityDetails } from './createCityDetails';
import { createProjectHighlight } from './createProjectHighlight';
import { createProjectEmblems } from './createProjectEmblems';
import { createPluginFloors } from './createPluginFloors';
import { qgisPlugins } from '../../data/qgisPlugins';
import { createStreetFinale } from './createStreetFinale';

export function createCityScene(
  canvas,
  { onSelect, onAction, onFailure, onPositions },
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.12, 250);
  const compact = window.matchMedia('(max-width: 700px)').matches;
  const motionPreference = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  );
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = {
    building: new THREE.MeshStandardMaterial({ roughness: 0.88 }),
    ground: new THREE.MeshStandardMaterial({ roughness: 1 }),
    plinth: new THREE.MeshStandardMaterial({ roughness: 1 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d9ad25', roughness: 0.65 }),
    seams: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.28 }),
  };
  const hemisphere = new THREE.HemisphereLight('#ffffff', '#bab9ac', 2.8);
  const sunlight = new THREE.DirectionalLight('#fff8e7', 3.5);
  sunlight.position.set(-25, 48, 20);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
  Object.assign(sunlight.shadow.camera, {
    left: -60,
    right: 60,
    top: 60,
    bottom: -60,
    near: 1,
    far: 130,
  });
  sunlight.shadow.normalBias = 0.08;
  scene.add(hemisphere, sunlight);

  const ground = new THREE.Mesh(geometry, materials.ground);
  ground.scale.set(240, 0.15, 240);
  ground.position.y = -0.16;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(160, 100, '#bcbeb4', '#c9cbc1');
  grid.material.transparent = true;
  grid.material.opacity = 0.12;
  grid.position.y = -0.075;
  scene.add(grid);
  const landscape = createLandscape(scene, geometry);
  const journeyRoute = createCityRoute(scene, geometry);
  const details = createCityDetails(scene, geometry);
  const selection = createProjectHighlight(scene, geometry);
  const emblems = createProjectEmblems(scene);
  const finale = createStreetFinale(scene);
  const pluginFloors = createPluginFloors(
    scene,
    geometry,
    landmarks.find((building) => building.id === 'qgis'),
  );
  let activePluginId = qgisPlugins[0]?.id;
  let activeProjectId = null;

  const blocks = [...createBuildings(compact), ...landmarks];
  const volumes = [];
  const seams = [];
  blocks.forEach((building) => {
    const { x, z, width, depth, height, stepped } = building;
    volumes.push({
      x,
      y: building.id === 'qgis' ? 0.55 : height / 2,
      z,
      width,
      height: building.id === 'qgis' ? 1.1 : height,
      depth,
      projectId: building.projectId,
    });
    if (stepped)
      volumes.push({
        x: x - 0.3,
        y: height + 0.65,
        z,
        width: width * 0.65,
        height: 1.3,
        depth: depth * 0.8,
      });
    for (let y = 1; y < height && building.id !== 'qgis'; y += 1.15) {
      const corners = [
        [x - width / 2 - 0.01, y, z - depth / 2 - 0.01],
        [x + width / 2 + 0.01, y, z - depth / 2 - 0.01],
        [x + width / 2 + 0.01, y, z + depth / 2 + 0.01],
        [x - width / 2 - 0.01, y, z + depth / 2 + 0.01],
      ];
      corners.forEach((corner, index) =>
        seams.push(...corner, ...corners[(index + 1) % 4]),
      );
    }
  });
  const matrix = new THREE.Object3D();
  function instanceBoxes(items, material) {
    const mesh = new THREE.InstancedMesh(geometry, material, items.length);
    items.forEach((item, index) => {
      matrix.position.set(item.x, item.y, item.z);
      matrix.scale.set(item.width, item.height, item.depth);
      matrix.updateMatrix();
      mesh.setMatrixAt(index, matrix.matrix);
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.computeBoundingSphere();
    scene.add(mesh);
    return mesh;
  }
  const buildings = instanceBoxes(volumes, materials.building);
  instanceBoxes(
    blocks.map((b) => ({
      ...b,
      y: 0.04,
      width: b.width + 1.1,
      depth: b.depth + 1.1,
      height: 0.16,
    })),
    materials.plinth,
  );
  const seamGeometry = new THREE.BufferGeometry();
  seamGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(seams, 3),
  );
  scene.add(new THREE.LineSegments(seamGeometry, materials.seams));

  const roofs = landmarks.map((building) => {
    const roof = new THREE.Mesh(geometry, materials.gold.clone());
    roof.position.set(building.x, building.height + 0.035, building.z);
    roof.scale.set(building.width - 0.22, 0.09, building.depth - 0.22);
    roof.userData.projectId = building.projectId;
    scene.add(roof);
    return roof;
  });
  const projected = new THREE.Vector3();
  const markerTargets = [
    ...landmarks.map((building, index) => ({
      ...building,
      markerHeight: building.height + (index % 2 ? 5 : 1.5),
    })),
    ...districts.map((district) => ({
      ...district,
      id: `district-${district.id}`,
      markerHeight: 4.5,
    })),
    ...finaleActions.map((building) => ({
      ...building,
      id: `action-${building.id}`,
      markerHeight: 2.2,
      action: true,
    })),
  ];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let progress = 0;
  let targetProgress = 0;
  let frame = 0;
  let disposed = false;
  let paused = false;
  let lastTime = 0;
  let currentCompact = compact;
  let hoveredProject = null;
  let hoveredAction = null;

  function updateLens() {
    const streetBlend = getStreetBlend(progress);
    const angle = (36 + streetBlend * 16) / 2;
    const fov = THREE.MathUtils.radToDeg(
      2 *
        Math.atan(
          Math.tan(THREE.MathUtils.degToRad(angle)) *
            Math.max(1, (1.6 + streetBlend * 0.5) / camera.aspect),
        ),
    );
    if (Math.abs(camera.fov - fov) > 0.001) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }

  function render(time) {
    frame = 0;
    if (disposed || paused || document.hidden) return;
    const delta = Math.min((time - lastTime) / 1000 || 0.016, 0.05);
    lastTime = time;
    progress = motionPreference.matches
      ? targetProgress
      : THREE.MathUtils.damp(progress, targetProgress, 7, delta);
    if (Math.abs(progress - targetProgress) < 0.00001)
      progress = targetProgress;
    const pose = getCameraPose(progress, currentCompact);
    camera.position.set(...pose.slice(0, 3));
    camera.lookAt(...pose.slice(3));
    updateLens();
    journeyRoute.update(progress);
    const highlighting = selection.update(delta, motionPreference.matches);
    const animatingEmblems = emblems.update(delta, motionPreference.matches);
    const animatingFloors = pluginFloors.update(
      delta,
      motionPreference.matches,
    );
    const animatingFinale = finale.update(
      progress,
      delta,
      motionPreference.matches,
    );
    renderer.render(scene, camera);
    if (onPositions) {
      onPositions(
        markerTargets.map((building) => {
          projected
            .set(building.x, building.markerHeight, building.z)
            .project(camera);
          return {
            id: building.id,
            x: ((projected.x + 1) / 2) * canvas.clientWidth,
            y: ((1 - projected.y) / 2) * canvas.clientHeight,
            visible:
              projected.z > -1 &&
              projected.z < 1 &&
              (!building.action || finale.isEnabled()),
          };
        }),
      );
    }
    if (
      progress !== targetProgress ||
      highlighting ||
      animatingEmblems ||
      animatingFloors ||
      animatingFinale
    )
      requestRender();
  }
  function requestRender() {
    if (!disposed && !paused && !frame && !document.hidden)
      frame = requestAnimationFrame(render);
  }
  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    currentCompact = width < 700;
    camera.aspect = width / height;
    updateLens();
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    requestRender();
  }
  function pick(event) {
    const bounds = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const intersection = raycaster.intersectObjects(
      [
        buildings,
        ...roofs,
        ...emblems.hitTargets,
        ...pluginFloors.hitTargets,
        ...(finale.isEnabled() ? finale.hitTargets : []),
      ],
      false,
    )[0];
    if (!intersection) return null;
    const data =
      intersection.object === buildings
        ? volumes[intersection.instanceId]
        : intersection.object.userData;
    if (data?.action) return { action: data.action };
    return data?.projectId == null
      ? null
      : { projectId: data.projectId, pluginId: data.pluginId };
  }
  function move(event) {
    const picked = pick(event);
    const projectId = picked?.projectId ?? null;
    const action = picked?.action ?? null;
    canvas.style.cursor = projectId != null || action ? 'pointer' : '';
    if (projectId === hoveredProject && action === hoveredAction) return;
    hoveredAction = action;
    finale.setHovered(action);
    hoveredProject = projectId;
    roofs.forEach((roof) => {
      roof.material.emissive.set(
        roof.userData.projectId === projectId ? '#976d15' : '#000000',
      );
      roof.material.emissiveIntensity = 0.45;
    });
    requestRender();
  }
  function leave() {
    hoveredProject = null;
    hoveredAction = null;
    finale.setHovered(null);
    pointerStart = null;
    canvas.style.cursor = '';
    roofs.forEach((roof) => roof.material.emissive.set('#000000'));
    requestRender();
  }
  let pointerStart = null;
  function down(event) {
    pointerStart = [event.clientX, event.clientY];
  }
  function up(event) {
    const picked = pick(event);
    if (
      pointerStart &&
      Math.hypot(
        event.clientX - pointerStart[0],
        event.clientY - pointerStart[1],
      ) < 8 &&
      picked !== null
    ) {
      if (picked.action) onAction?.(picked.action);
      else onSelect(picked.projectId, picked.pluginId);
    }
    pointerStart = null;
  }
  function contextLost(event) {
    event.preventDefault();
    onFailure();
  }
  function visibilityChanged() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else requestRender();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointerleave', leave);
  canvas.addEventListener('pointercancel', leave);
  canvas.addEventListener('webglcontextlost', contextLost);
  document.addEventListener('visibilitychange', visibilityChanged);
  motionPreference.addEventListener('change', requestRender);

  function setTheme(dark) {
    const background = dark ? '#1b201f' : '#eeede7';
    scene.background = new THREE.Color(background);
    scene.fog = new THREE.Fog(background, 95, 220);
    materials.building.color.set(dark ? '#646d68' : '#dedfd5');
    materials.ground.color.set(background);
    materials.plinth.color.set(dark ? '#363e39' : '#dddfd5');
    materials.seams.color.set(dark ? '#252e2a' : '#a3a99b');
    landscape.setTheme(dark);
    journeyRoute.setTheme(dark);
    details.setTheme(dark);
    emblems.setTheme(dark);
    pluginFloors.setTheme(dark);
    finale.setTheme(dark);
    hemisphere.intensity = dark ? 1.5 : 2;
    sunlight.intensity = dark ? 1.8 : 2.8;
    requestRender();
  }
  setTheme(false);
  resize();

  return {
    setTheme,
    setActionLabels(labels) {
      finale.setLabels(labels);
      requestRender();
    },
    setActionHover(id) {
      hoveredAction = id;
      finale.setHovered(id);
      requestRender();
    },
    setActivePlugin(id) {
      activePluginId = id;
      pluginFloors.setActive(id, activeProjectId === 'qgis');
      requestRender();
    },
    setActiveProject(projectId) {
      activeProjectId = projectId;
      pluginFloors.setActive(activePluginId, projectId === 'qgis');
      selection.setActive(projectId);
      emblems.setActive(projectId);
      roofs.forEach((roof) => {
        roof.material.color.set(
          projectId == null || roof.userData.projectId === projectId
            ? '#d9ad25'
            : '#b8b393',
        );
      });
      requestRender();
    },
    setProgress(value, immediate = false) {
      targetProgress = clampProgress(value);
      if (immediate) progress = targetProgress;
      requestRender();
    },
    setPaused(value) {
      paused = value;
      if (paused) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else requestRender();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('pointercancel', leave);
      canvas.removeEventListener('webglcontextlost', contextLost);
      document.removeEventListener('visibilitychange', visibilityChanged);
      motionPreference.removeEventListener('change', requestRender);
      scene.traverse((object) => {
        if (object.isInstancedMesh) object.dispose();
      });
      geometry.dispose();
      seamGeometry.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      roofs.forEach((roof) => roof.material.dispose());
      landscape.dispose();
      journeyRoute.dispose();
      details.dispose();
      selection.dispose();
      emblems.dispose();
      pluginFloors.dispose();
      finale.dispose();
      Object.values(materials).forEach((material) => material.dispose());
      sunlight.shadow.dispose();
      renderer.dispose();
    },
  };
}

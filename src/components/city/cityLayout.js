export const landmarks = [
  {
    id: 'property',
    projectId: 1,
    x: -10,
    z: 2,
    width: 4.5,
    depth: 5,
    height: 6,
  },
  {
    id: 'widgets',
    projectId: 2,
    x: -3,
    z: 2,
    width: 4.8,
    depth: 4.8,
    height: 9,
  },
  {
    id: 'automation',
    projectId: 3,
    x: 4,
    z: 2,
    width: 4.5,
    depth: 4,
    height: 5.5,
  },
  {
    id: 'luma',
    projectId: 'luma',
    x: 11,
    z: 2,
    width: 4.4,
    depth: 4.4,
    height: 10,
  },
  {
    id: 'birdmap',
    projectId: 'birdmap',
    x: 18,
    z: 2,
    width: 5,
    depth: 4,
    height: 4,
  },
];
export const districts = [
  { id: 'overview', chapter: 'intro', x: -25, z: -19, width: 18, depth: 17 },
  { id: 'about', chapter: 'about', x: -25, z: 13, width: 18, depth: 15 },
  { id: 'projects', chapter: 'projects', x: 4, z: 2, width: 38, depth: 17 },
  { id: 'services', chapter: 'services', x: 33, z: 15, width: 16, depth: 20 },
];
export const parks = [
  { x: -25, z: -19, width: 16, depth: 15 },
  { x: -25, z: 13, width: 16, depth: 13 },
  { x: 33, z: 15, width: 14, depth: 18 },
  { x: 4, z: -10, width: 38, depth: 4 },
];
export const shoreX = 48;
export const forecourt = { x: 4, z: 25, width: 46, depth: 25 };
export const landmark = landmarks.find((building) => building.id === 'luma');

export const route = [
  [-25, -19],
  [-25, 9],
  [33, 9],
  [33, 20],
];

function cameraPose(x, z, distance, height = distance * 0.7, targetY = 0) {
  const targetX = x - 14;
  return [targetX + distance * 0.6, height, z + distance, targetX, targetY, z];
}

const overviewPose = cameraPose(0, 5, 94);

export const cityStops = [
  { id: 'overview', chapter: 'intro', routeDistance: 0, pose: overviewPose },
  {
    id: 'about',
    chapter: 'about',
    routeDistance: 28,
    pose: cameraPose(-25, 13, 80),
  },
  {
    id: 'projects',
    chapter: 'projects',
    routeDistance: 35,
    pose: cameraPose(0, 2, 78),
  },
  ...landmarks.map((building) => ({
    id: building.id,
    chapter: 'projects',
    projectId: building.projectId,
    routeDistance: 28 + building.x + 25,
    pose: cameraPose(building.x + 10, building.z, 32, 7.5, 2.5),
  })),
  {
    id: 'services',
    chapter: 'services',
    routeDistance: 97,
    pose: cameraPose(33, 12, 46, 18, 1.5),
  },
  {
    id: 'contact',
    chapter: 'contact',
    routeDistance: 97,
    pose: [...overviewPose],
  },
];

const cameraTracks = [3, 4, 5, 1].map((axis) =>
  cityStops.map((stop) => stop.pose[axis]),
);
const depthTrack = cityStops.map((stop) => stop.pose[2] - stop.pose[5]);
const routeTrack = cityStops.map((stop) => stop.routeDistance);

function sampleTrack(values, progress) {
  const scaled = clampProgress(progress) * (values.length - 1);
  const index = Math.min(Math.floor(scaled), values.length - 2);
  const t = scaled - index;
  if (values[index] === values[index + 1]) return values[index];
  function tangent(at) {
    if (at === 0 || at === values.length - 1) return 0;
    const before = values[at] - values[at - 1];
    const after = values[at + 1] - values[at];
    return before * after <= 0 ? 0 : (2 * before * after) / (before + after);
  }
  return (
    (2 * t ** 3 - 3 * t ** 2 + 1) * values[index] +
    (t ** 3 - 2 * t ** 2 + t) * tangent(index) +
    (-2 * t ** 3 + 3 * t ** 2) * values[index + 1] +
    (t ** 3 - t ** 2) * tangent(index + 1)
  );
}

export function getRouteDistance(progress) {
  return sampleTrack(routeTrack, progress);
}

export function getRoutePoint(distance) {
  let remaining = Math.max(0, Number.isFinite(distance) ? distance : 0);
  for (let index = 1; index < route.length; index += 1) {
    const [x1, z1] = route[index - 1];
    const [x2, z2] = route[index];
    const length = Math.hypot(x2 - x1, z2 - z1);
    if (remaining <= length || index === route.length - 1) {
      const fraction = Math.min(1, remaining / length);
      return { x: x1 + (x2 - x1) * fraction, z: z1 + (z2 - z1) * fraction };
    }
    remaining -= length;
  }
}

export function overlaps(a, b, padding = 0) {
  return (
    Math.abs(a.x - b.x) < (a.width + b.width) / 2 + padding &&
    Math.abs(a.z - b.z) < (a.depth + b.depth) / 2 + padding
  );
}

export function intersectsRoute(building) {
  const padding = 0.8;
  return route.slice(1).some(([x2, z2], index) => {
    const [x1, z1] = route[index];
    return (
      Math.max(x1, x2) >= building.x - building.width / 2 - padding &&
      Math.min(x1, x2) <= building.x + building.width / 2 + padding &&
      Math.max(z1, z2) >= building.z - building.depth / 2 - padding &&
      Math.min(z1, z2) <= building.z + building.depth / 2 + padding
    );
  });
}

export function createBuildings(compact = false) {
  const buildings = [];
  const range = compact ? 2 : 3;
  for (let row = -range; row <= range; row += 1) {
    for (let column = -3; column <= 3; column += 1) {
      const seed = Math.abs(row * 31 + column * 17 + 157);
      const x = column * 11 + 3;
      const z = row * 11 + 4;
      buildings.push({
        x,
        z,
        width: 3.2 + (seed % 3) * 0.7,
        depth: 3.5 + (seed % 4) * 0.45,
        height: z > 14 ? 2.5 + (seed % 3) * 0.5 : 3 + (seed % 7) * 1.2,
        stepped: seed % 4 === 0,
      });
      if (seed % 3 !== 0) {
        buildings.push({
          x: x + 4,
          z: z - 3.4,
          width: 2.2,
          depth: 2.5,
          height: z > 14 ? 2.5 : 2.8 + (seed % 5),
        });
      }
    }
  }
  return buildings.filter(
    (building) =>
      !intersectsRoute(building) &&
      building.x + building.width / 2 < shoreX - 4 &&
      !landmarks.some((target) => overlaps(building, target, 3)) &&
      !districts.some((district) => overlaps(building, district, 1)) &&
      !overlaps(building, forecourt, 1) &&
      !parks.some((park) => overlaps(building, park, 1)),
  );
}

export function clampProgress(value) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

export function getCameraPose(progress, compact = false) {
  const scaled = clampProgress(progress) * (cityStops.length - 1);
  const [x, y, z, height] = cameraTracks.map((track) =>
    sampleTrack(track, progress),
  );
  const depth = sampleTrack(depthTrack, progress);
  const pose = Number.isInteger(scaled)
    ? [...cityStops[scaled].pose]
    : [x + depth * 0.6, height, z + depth, x, y, z];
  if (compact) pose[1] += 10;
  return pose;
}

export function getJourneyProgress(scrollY, offsets) {
  if (offsets.length < 2 || scrollY <= offsets[0]) return 0;
  const last = offsets.length - 1;
  if (scrollY >= offsets[last]) return 1;
  const index = offsets.findIndex(
    (offset, i) => i < last && scrollY < offsets[i + 1],
  );
  const fraction =
    (scrollY - offsets[index]) /
    Math.max(1, offsets[index + 1] - offsets[index]);
  return clampProgress((index + fraction) / last);
}

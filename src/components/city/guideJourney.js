import {
  cityStops,
  clampProgress,
  getCameraPose,
  getRouteDistance,
  getRoutePoint,
  getStreetBlend,
  route,
} from './cityLayout.js';

const smooth = (value) => {
  const t = clampProgress(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export function getGuidePoint(distance) {
  let cornerDistance = 0;
  const radius = 1.4;
  for (let index = 1; index < route.length - 1; index++) {
    cornerDistance += Math.hypot(
      route[index][0] - route[index - 1][0],
      route[index][1] - route[index - 1][1],
    );
    if (Math.abs(distance - cornerDistance) >= radius) continue;
    const before = getRoutePoint(cornerDistance - radius);
    const after = getRoutePoint(cornerDistance + radius);
    const [x, z] = route[index];
    const t = (distance - cornerDistance + radius) / (radius * 2);
    return {
      x: (1 - t) ** 2 * before.x + 2 * (1 - t) * t * x + t ** 2 * after.x,
      z: (1 - t) ** 2 * before.z + 2 * (1 - t) * t * z + t ** 2 * after.z,
    };
  }
  return getRoutePoint(distance);
}

export function getGuideHeading(distance) {
  const before = getGuidePoint(distance - 0.12);
  const after = getGuidePoint(distance + 0.12);
  return Math.atan2(after.x - before.x, after.z - before.z);
}

export function getFinaleBlend(progress) {
  return smooth(clampProgress(progress) * (cityStops.length - 1) - (cityStops.length - 2));
}

export function getJourneyCameraPose(progress, compact = false) {
  const base = getCameraPose(progress, compact);
  const blend = getStreetBlend(progress) * (1 - getFinaleBlend(progress));
  if (!blend) return base;
  const distance = getRouteDistance(progress);
  const behind = getGuidePoint(distance - 4.8);
  const guide = getGuidePoint(distance);
  const length = Math.hypot(guide.x - behind.x, guide.z - behind.z) || 1;
  const forwardX = (guide.x - behind.x) / length;
  const forwardZ = (guide.z - behind.z) / length;
  const leftX = forwardZ;
  const leftZ = -forwardX;
  const ahead = getGuidePoint(distance + 2.2);
  const follow = [
    behind.x + leftX * 0.2,
    compact ? 12.6 : 2.6,
    behind.z + leftZ * 0.2,
    guide.x + forwardX * 1.76 + (ahead.x - guide.x) * 0.2 + leftX * 1.65,
    1.25,
    guide.z + forwardZ * 1.76 + (ahead.z - guide.z) * 0.2 + leftZ * 1.65,
  ];
  return base.map((value, index) => value + (follow[index] - value) * blend);
}

export function getRunPose(phase, amount) {
  if (amount === 0) phase = 0;
  const stride = Math.sin(phase) * amount;
  const lift = Math.sin(phase - 0.68);
  const vertical = (1 - Math.cos(phase * 2)) / 2;
  return {
    leftHip: stride * 0.78 - amount * 0.13,
    rightHip: -stride * 0.78 - amount * 0.13,
    leftKnee: (0.1 + 0.98 * ((1 + lift) / 2) ** 2) * amount,
    rightKnee: (0.1 + 0.98 * ((1 - lift) / 2) ** 2) * amount,
    leftArm: -stride * 0.6,
    rightArm: stride * 0.6,
    bounce: vertical * 0.034 * amount,
    sway: Math.cos(phase) * amount * 0.023,
    lean: (0.08 + vertical * 0.025) * amount,
    twist: stride * 0.055,
  };
}

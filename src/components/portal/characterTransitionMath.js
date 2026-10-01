import { easePortal } from './portalMath.js';

export const transitionDurations = {
  approach: 1600,
  part: 1700,
  crouch: 350,
  jump: 1100,
  reveal: 850,
};

export function getTransitionLayout(origin, width, height) {
  const size = Math.min(360, height * 0.47);
  return {
    origin: {
      x: Math.max(87, Math.min(width - 87, origin.x)),
      y: Math.max(87, Math.min(height - 87, origin.y)),
    },
    startSize: 174,
    x: width * 0.59,
    y: height * 0.52,
    size,
    width,
    height,
  };
}

export function getTransitionPose(phase, value, layout) {
  const progress = easePortal(value);
  const pose = {
    x: layout.x,
    y: layout.y,
    size: layout.size,
    opacity: 1,
    angle: 0,
    pull: 0,
    opening: 0,
    copy: 0,
  };
  if (phase === 'approach') {
    pose.x = layout.origin.x + (layout.x - layout.origin.x) * progress;
    pose.y = layout.origin.y + (layout.y - layout.origin.y) * progress;
    pose.size = layout.startSize + (layout.size - layout.startSize) * progress;
    pose.copy = 1 - progress;
  } else if (phase === 'part') {
    pose.pull = progress;
    pose.opening = progress * 0.12;
  } else if (phase === 'crouch') {
    pose.pull = 1;
    pose.opening = 0.12;
    pose.y += progress * 18;
    pose.size *= 1 - progress * 0.04;
  } else if (phase === 'jump') {
    pose.pull = 1;
    pose.opening = 0.12 + progress * 0.08;
    pose.y += 18 * (1 - progress) - Math.sin(progress * Math.PI) * layout.height * 0.16;
    pose.x += progress * 35;
    pose.size *= 0.96 * (1 - progress * 0.78);
    pose.angle = progress * -0.16;
    pose.opacity = 1 - easePortal((value - 0.5) * 2);
  } else if (phase === 'reveal') {
    pose.pull = 1;
    pose.opening = 0.2 + progress * 0.8;
    pose.opacity = 0;
  }
  return pose;
}

export function getContourPoint(x, y, layout, pull) {
  const originalX = x + Math.sin(y * 0.02) * 20;
  const originalY = y + Math.cos(x * 0.02) * 20 + Math.sin((x + y) * 0.01) * 15;
  const dx = originalX - layout.x;
  const dy = originalY - layout.y;
  const influence = Math.exp(-((dx / 340) ** 2 + (dy / 280) ** 2));
  return {
    x: originalX + Math.sign(dx) * influence * pull * layout.size * 0.36,
    y: originalY + dy * influence * pull * 0.15,
  };
}

import { captureViewport } from './captureViewport';
import { withDeadline } from './portalMath';
import {
  getContourPoint,
  getTransitionLayout,
  getTransitionPose,
  transitionDurations,
} from './characterTransitionMath';

const atlasUrl = '/mascot/guide-motion-v3.webp';

export async function runPortalTransition({ element, origin, signal, onCovered }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'portal-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Transition canvas unavailable');
  const invitation = element.querySelector('.city-invitation');
  const invitationVisibility = invitation?.style.visibility;
  const visibility = element.style.visibility;
  const overflow = document.body.style.overflow;
  let frame = 0;
  try {
    const atlas = new Image();
    atlas.src = atlasUrl;
    const [snapshot] = await withDeadline(
      Promise.all([captureViewport(element, signal), atlas.decode()]),
      3500,
      signal,
    );
    signal.throwIfAborted();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const layout = getTransitionLayout(origin, width, height);
    const paper = getComputedStyle(document.body).backgroundColor;
    const cell = atlas.naturalWidth / 2;

    function tile(column, row, x, y, size) {
      context.drawImage(atlas, column * cell, row * cell, cell, cell,
        x, y, size, size);
    }
    function standing(size) {
      tile(0, 0, -size / 2, -size / 2, size);
      context.save();
      context.translate(size * 0.2, -size * 0.1);
      context.rotate(-0.06);
      tile(1, 0, -size * 0.715, -size * 0.44, size);
      context.restore();
    }
    function contours(pull, opacity) {
      context.save();
      context.globalAlpha = opacity * 0.8;
      context.strokeStyle = 'rgba(201, 162, 39, 0.22)';
      context.lineWidth = 1.4;
      const columns = Math.ceil(width / 40) + 2;
      const rows = Math.ceil(height / 40) + 2;
      for (let row = 0; row < rows; row++) {
        context.beginPath();
        let previous;
        for (let column = 0; column < columns; column++) {
          const point = getContourPoint(column * 40 - 40, row * 40 - 40, layout, pull);
          if (!previous) context.moveTo(point.x, point.y);
          else context.quadraticCurveTo(previous.x, previous.y,
            (previous.x + point.x) / 2, (previous.y + point.y) / 2);
          previous = point;
        }
        context.stroke();
      }
      context.restore();
    }
    function openCurtain(opening) {
      if (!opening) return;
      const gap = Math.max(layout.x, width - layout.x) * opening * 1.14;
      const bend = layout.size * 0.13 * Math.sin(opening * Math.PI);
      const left = layout.x - gap;
      const right = layout.x + gap;
      context.save();
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.moveTo(left - bend, -20);
      context.quadraticCurveTo(left + bend, layout.y, left - bend, height + 20);
      context.lineTo(right + bend, height + 20);
      context.quadraticCurveTo(right - bend, layout.y, right + bend, -20);
      context.closePath();
      context.fill();
      context.restore();
      context.save();
      context.strokeStyle = `rgba(201, 162, 39, ${0.5 * (1 - opening)})`;
      context.lineWidth = 1.6;
      for (const direction of [-1, 1]) {
        const edge = layout.x + direction * gap;
        context.beginPath();
        context.moveTo(edge + direction * bend, -20);
        context.quadraticCurveTo(edge - direction * bend, layout.y,
          edge + direction * bend, height + 20);
        context.stroke();
      }
      context.restore();
    }
    function draw(phase, progress) {
      const pose = getTransitionPose(phase, progress, layout);
      context.clearRect(0, 0, width, height);
      context.fillStyle = paper;
      context.fillRect(0, 0, width, height);
      context.save();
      context.globalAlpha = pose.copy;
      context.drawImage(snapshot, 0, 0, width, height);
      context.restore();
      contours(pose.pull, 1);
      openCurtain(pose.opening);
      if (!pose.opacity) return;
      context.save();
      context.globalAlpha = pose.opacity;
      context.translate(pose.x, pose.y);
      context.rotate(pose.angle);
      if (phase === 'approach' && progress < 0.85) standing(pose.size);
      else tile(phase === 'jump' ? 1 : 0, 1,
        -pose.size / 2, -pose.size / 2, pose.size);
      context.restore();
    }
    function animate(phase) {
      canvas.dataset.phase = phase;
      return new Promise((resolve, reject) => {
        let started;
        let lastDraw = -Infinity;
        const abort = () => {
          cancelAnimationFrame(frame);
          signal.removeEventListener('abort', abort);
          reject(new DOMException('Transition cancelled', 'AbortError'));
        };
        if (signal.aborted) return abort();
        signal.addEventListener('abort', abort, { once: true });
        function tick(now) {
          started ??= now;
          const progress = Math.min(1, (now - started) / transitionDurations[phase]);
          try {
            if (progress === 1 || now - lastDraw >= 1000 / 60) {
              draw(phase, progress);
              lastDraw = now;
            }
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
    draw('approach', 0);
    document.body.append(canvas);
    document.body.style.overflow = 'hidden';
    if (invitation) invitation.style.visibility = 'hidden';
    element.style.visibility = 'hidden';
    await animate('approach');
    canvas.dataset.phase = 'waiting';
    await withDeadline(onCovered(), 8000, signal);
    await animate('part');
    await animate('crouch');
    await animate('jump');
    await animate('reveal');
  } finally {
    cancelAnimationFrame(frame);
    element.style.visibility = visibility;
    if (invitation) invitation.style.visibility = invitationVisibility;
    document.body.style.overflow = overflow;
    canvas.remove();
  }
}

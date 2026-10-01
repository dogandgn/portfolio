import { captureViewport } from './captureViewport';
import { easePortal, withDeadline } from './portalMath';
import {
  getContourPoint,
  getHandGrips,
  getTransitionLayout,
  getTransitionPose,
  transitionDurations,
} from './characterTransitionMath';

const atlasUrl = '/mascot/guide-motion-v3.webp';
const actionAtlasUrl = '/mascot/guide-action-v4.webp';

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
    const actionAtlas = new Image();
    actionAtlas.src = actionAtlasUrl;
    const [snapshot] = await withDeadline(
      Promise.all([captureViewport(element, signal), atlas.decode(), actionAtlas.decode()]),
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
    const actionCell = actionAtlas.naturalWidth / 2;

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
    function pulling(pose) {
      const { size } = pose;
      const { shift } = getHandGrips(pose);
      const slice = (x, y, w, h, targetX, targetWidth = w) => {
        const left = Math.round((pose.x + (targetX - 0.5) * size) * ratio) / ratio - pose.x;
        const top = Math.round((pose.y + (y - 0.5) * size) * ratio) / ratio - pose.y;
        const right = Math.round((pose.x + (targetX + targetWidth - 0.5) * size) * ratio) / ratio - pose.x;
        const bottom = Math.round((pose.y + (y + h - 0.5) * size) * ratio) / ratio - pose.y;
        context.drawImage(actionAtlas, x * actionCell, y * actionCell,
          w * actionCell, h * actionCell,
          left, top, right - left, bottom - top);
      };
      slice(0, 0, 1, 0.27, 0);
      slice(0, 0.5, 1, 0.5, 0);
      for (let row = 0; row < 32; row++) {
        const y = 0.27 + row * 0.23 / 32;
        const h = 0.23 / 32;
        const weight = easePortal((y - 0.27) / 0.06) *
          (1 - easePortal((y - 0.43) / 0.07));
        const offset = shift * weight;
        slice(0, y, 0.35, h, offset);
        slice(0.35, y, 0.10, h, 0.35 + offset, 0.10 - offset);
        slice(0.45, y, 0.13, h, 0.45);
        slice(0.58, y, 0.11, h, 0.58, 0.11 - offset);
        slice(0.69, y, 0.31, h, 0.69 - offset);
      }
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
    function openCurtain(pose) {
      const { opening } = pose;
      if (!opening) return;
      const grips = getHandGrips(opening <= 0.12 ? pose : {
        x: layout.x, y: layout.y + 18, size: layout.size * 0.96, pull: 1,
      });
      const catchUp = easePortal(opening / 0.035);
      const release = easePortal((opening - 0.12) / 0.88);
      const left = layout.x + (grips.left - layout.x) * catchUp - width * release;
      const right = layout.x + (grips.right - layout.x) * catchUp + width * release;
      const bend = layout.size * 0.15 * (1 - release) * catchUp;
      function edge(x, direction, reverse = false) {
        const start = reverse ? height + 20 : -20;
        const end = reverse ? -20 : height + 20;
        context.lineTo(x + direction * bend, start);
        context.bezierCurveTo(x + direction * bend, (start + grips.y) / 2,
          x, grips.y - (reverse ? -35 : 35), x, grips.y);
        context.bezierCurveTo(x, grips.y + (reverse ? -35 : 35),
          x + direction * bend, (end + grips.y) / 2, x + direction * bend, end);
      }
      context.save();
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.moveTo(left - bend, -20);
      edge(left, -1);
      edge(right, 1, true);
      context.closePath();
      context.fill();
      context.restore();
      context.save();
      context.strokeStyle = `rgba(201, 162, 39, ${0.9 * (1 - release)})`;
      context.lineWidth = 2.4;
      for (const [x, direction] of [[left, -1], [right, 1]]) {
        context.beginPath();
        context.moveTo(x + direction * bend, -20);
        edge(x, direction);
        context.stroke();
      }
      context.restore();
    }
    function heldContours(pose, foreground = false) {
      const grips = getHandGrips(pose);
      context.save();
      context.lineCap = 'round';
      context.strokeStyle = foreground ? '#f2cc57' : '#bd972c';
      context.lineWidth = foreground ? 2.4 : 1.8;
      context.globalAlpha = foreground ? 1 : 0.85;
      for (const [x, direction] of [[grips.left, -1], [grips.right, 1]]) {
        for (const offset of [-1, 0, 1]) {
          context.beginPath();
          if (foreground) {
            const gripSize = pose.size * 0.018;
            context.moveTo(x - gripSize, grips.y + offset * 3);
            context.quadraticCurveTo(x, grips.y + offset * 3 + gripSize * 0.5,
              x + gripSize, grips.y + offset * 3);
          } else {
            const fade = context.createLinearGradient(x + direction * 260, 0, x, 0);
            fade.addColorStop(0, 'rgba(189, 151, 44, 0)');
            fade.addColorStop(0.4, 'rgba(189, 151, 44, 0.45)');
            fade.addColorStop(1, '#bd972c');
            context.strokeStyle = fade;
            context.moveTo(x + direction * 260, grips.y + offset * 65);
            context.bezierCurveTo(x + direction * 150, grips.y + offset * 65,
              x + direction * 55, grips.y + offset * 3, x, grips.y + offset * 3);
          }
          context.stroke();
        }
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
      openCurtain(pose);
      const holding = phase === 'part' || phase === 'crouch';
      if (holding) heldContours(pose);
      if (!pose.opacity) return;
      context.save();
      context.globalAlpha = pose.opacity;
      context.translate(pose.x, pose.y);
      context.rotate(pose.angle);
      if (phase === 'approach' && progress < 0.85) standing(pose.size);
      else if (phase === 'jump') context.drawImage(actionAtlas,
        actionCell, 0, actionCell, actionCell,
        -pose.size / 2, -pose.size / 2, pose.size, pose.size);
      else pulling(pose);
      context.restore();
      if (holding) heldContours(pose, true);
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
    const cityReady = withDeadline(onCovered(), 8000, signal);
    await Promise.all([animate('approach'), cityReady]);
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

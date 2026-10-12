export function createContourBackground(canvas, environment = window) {
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  const page = environment.document;
  const motion = environment.matchMedia('(prefers-reduced-motion: reduce)');
  const mouse = { x: null, y: null, radius: 180 };
  let frame = null;
  let disposed = false;
  let points = [];
  let width = 0;
  let height = 0;

  function cancel() {
    if (frame !== null) environment.cancelAnimationFrame(frame);
    frame = null;
  }

  function requestDraw() {
    if (!disposed && !page.hidden && frame === null) {
      frame = environment.requestAnimationFrame(draw);
    }
  }

  function resize() {
    const ratio = Math.min(environment.devicePixelRatio || 1, 2);
    width = environment.innerWidth;
    height = environment.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = Array.from({ length: Math.ceil(height / 40) + 2 }, (_, row) =>
      Array.from({ length: Math.ceil(width / 40) + 2 }, (_, column) => {
        const x = column * 40 - 40;
        const y = row * 40 - 40;
        const originX = x + Math.sin(y * 0.02) * 20;
        const originY = y + Math.cos(x * 0.02) * 20 + Math.sin((x + y) * 0.01) * 15;
        return { x: originX, y: originY, originX, originY };
      }),
    );
    requestDraw();
  }

  function draw() {
    frame = null;
    if (disposed || page.hidden) return;
    let moving = false;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = 'rgba(201, 162, 39, 0.22)';
    context.lineWidth = 1.4;

    for (const row of points) {
      for (const point of row) {
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const distance = Math.hypot(dx, dy);
        if (!motion.matches && mouse.x !== null && distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          point.x -= Math.cos(angle) * force * 20;
          point.y -= Math.sin(angle) * force * 20;
          moving = true;
        } else if (motion.matches || Math.hypot(point.originX - point.x, point.originY - point.y) < 0.05) {
          point.x = point.originX;
          point.y = point.originY;
        } else {
          point.x += (point.originX - point.x) * 0.06;
          point.y += (point.originY - point.y) * 0.06;
          moving = true;
        }
      }
      context.beginPath();
      row.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else {
          const previous = row[index - 1];
          context.quadraticCurveTo(previous.x, previous.y,
            (previous.x + point.x) / 2, (previous.y + point.y) / 2);
        }
      });
      context.stroke();
    }
    if (moving && !motion.matches) requestDraw();
  }

  function move(event) {
    if (motion.matches) return;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    requestDraw();
  }

  function leave() {
    mouse.x = null;
    mouse.y = null;
    requestDraw();
  }

  function visibilityChanged() {
    if (page.hidden) cancel();
    else requestDraw();
  }

  function motionChanged() {
    cancel();
    leave();
  }

  environment.addEventListener('resize', resize);
  environment.addEventListener('mousemove', move);
  environment.addEventListener('mouseleave', leave);
  page.addEventListener('visibilitychange', visibilityChanged);
  motion.addEventListener('change', motionChanged);
  resize();

  return () => {
    disposed = true;
    cancel();
    environment.removeEventListener('resize', resize);
    environment.removeEventListener('mousemove', move);
    environment.removeEventListener('mouseleave', leave);
    page.removeEventListener('visibilitychange', visibilityChanged);
    motion.removeEventListener('change', motionChanged);
  };
}

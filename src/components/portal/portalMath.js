export function getPortalBounds(origin, width, height) {
  const x = Math.max(0, Math.min(width, origin.x));
  const y = Math.max(0, Math.min(height, origin.y));
  return {
    x: x / width,
    y: 1 - y / height,
    radius:
      Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) / height,
  };
}

export function easePortal(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

export function withDeadline(task, milliseconds, signal) {
  return new Promise((resolve, reject) => {
    let timer;
    function finish(callback, value) {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      callback(value);
    }
    function abort() {
      finish(reject, new DOMException('Transition cancelled', 'AbortError'));
    }
    if (signal?.aborted) {
      Promise.resolve(task).catch(() => {});
      return abort();
    }
    signal?.addEventListener('abort', abort, { once: true });
    timer = setTimeout(
      () => finish(reject, new Error('Transition timed out')),
      milliseconds,
    );
    Promise.resolve(task).then(
      (value) => finish(resolve, value),
      (error) => finish(reject, error),
    );
  });
}

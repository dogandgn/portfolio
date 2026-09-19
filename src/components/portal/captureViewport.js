import { toSvg } from 'html-to-image';

export async function captureViewport(element, signal) {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight;
  const scrollY = window.scrollY;
  const fixed = [...element.querySelectorAll('*')]
    .filter((node) => getComputedStyle(node).position === 'fixed')
    .map((node) => node.getBoundingClientRect());
  const svgUrl = await toSvg(element, {
    width,
    height: element.scrollHeight,
    style: { opacity: '1', transform: 'none', filter: 'none' },
    preferredFontFormat: 'woff2',
    fetchRequestInit: { signal },
    filter: (node) => !['IFRAME', 'VIDEO', 'SCRIPT'].includes(node.tagName),
  });
  signal.throwIfAborted();
  const xml = new DOMParser().parseFromString(
    decodeURIComponent(svgUrl.slice(svgUrl.indexOf(',') + 1)),
    'image/svg+xml',
  );
  const svg = xml.documentElement;
  const content = svg.querySelector('foreignObject');
  content.setAttribute('width', String(width));
  content.setAttribute('height', String(element.scrollHeight));
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 ${scrollY} ${width} ${height}`);
  const fixedClones = [...svg.querySelectorAll('[style]')].filter(
    (node) => node.style.position === 'fixed',
  );
  fixed.forEach((rect, index) => {
    const clone = fixedClones[index];
    if (!clone) return;
    Object.assign(clone.style, {
      position: 'absolute',
      top: `${rect.top + scrollY}px`,
      left: `${rect.left}px`,
      right: 'auto',
      bottom: 'auto',
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: 'none',
    });
  });
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
  await image.decode();
  signal.throwIfAborted();
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.fillStyle = getComputedStyle(document.body).backgroundColor;
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return canvas;
}

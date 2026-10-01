import { useEffect, useRef } from 'react';

export default function CityGuide() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const button = container.closest('button');
    let cancelled = false;
    let scene;
    const wave = () => scene?.wave();
    const onContextLost = (event) => {
      event.preventDefault();
      container.dataset.ready = 'false';
      scene?.dispose();
    };
    button.addEventListener('pointerenter', wave);
    button.addEventListener('focus', wave);
    canvas.addEventListener('webglcontextlost', onContextLost);
    import('./createGuideRenderer')
      .then(({ createGuideRenderer }) => {
        if (cancelled) return;
        scene = createGuideRenderer(canvas);
        container.dataset.ready = 'true';
      })
      .catch(() => {
        if (!cancelled) container.dataset.ready = 'false';
      });
    return () => {
      cancelled = true;
      button.removeEventListener('pointerenter', wave);
      button.removeEventListener('focus', wave);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      scene?.dispose();
    };
  }, []);
  return (
    <span className="city-guide" ref={containerRef} aria-hidden="true">
      <svg className="city-guide-fallback" viewBox="0 0 152 174">
        <ellipse cx="75" cy="158" rx="37" ry="7" fill="#c6a140" />
        <path d="M64 112v39m24-39v39" stroke="#364249" strokeWidth="15" strokeLinecap="round" />
        <rect x="52" y="76" width="47" height="48" rx="18" fill="#708c7d" />
        <path d="m97 87 17-12 1-24M53 86 43 102" stroke="#708c7d" strokeWidth="13" strokeLinecap="round" />
        <path d="M115 51v-8m-5 10-3-9m12 9 2-9" stroke="#dca880" strokeWidth="5" strokeLinecap="round" />
        <path d="m42 113-5-49" stroke="#e4b83e" strokeWidth="10" />
        <ellipse cx="75" cy="54" rx="24" ry="27" fill="#dca880" />
        <path d="M52 46V34q22-24 46 0v12l-12-12-23 5Z" fill="#40312b" />
        <path d="M54 64q21 26 42 0l-4 16H59Z" fill="#40312b" />
        <g fill="#b3d6ce" fillOpacity=".4" stroke="#293330" strokeWidth="3">
          <rect x="55" y="47" width="17" height="12" rx="4" />
          <rect x="78" y="47" width="17" height="12" rx="4" />
          <path d="M72 51h6" />
        </g>
        <path d="M68 68q7 6 14 0" fill="none" stroke="#f5e6d1" strokeWidth="3" />
      </svg>
      <canvas ref={canvasRef} />
    </span>
  );
}

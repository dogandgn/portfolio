import { useEffect, useRef } from 'react';

export default function CityGuide() {
  const container = useRef(null);
  useEffect(() => {
    const update = () => { container.current.dataset.paused = String(document.hidden); };
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return (
    <span className="city-guide" ref={container} aria-hidden="true">
      <span className="city-guide-frame" />
    </span>
  );
}

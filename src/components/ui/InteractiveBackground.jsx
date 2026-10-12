import { useEffect, useRef } from 'react';
import { createContourBackground } from './createContourBackground';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => createContourBackground(canvasRef.current), []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
}

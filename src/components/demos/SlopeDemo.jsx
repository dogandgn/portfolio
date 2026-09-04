import React, { useMemo, useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';

const initialPoints = [
  { x: 31, y: 67 },
  { x: 75, y: 32 },
];

const getElevation = ({ x, y }) => 23.4 + (100 - y) * 0.075 + x * 0.018;

const getCoordinate = ({ x, y }) => ({
  latitude: 41.02992 - y * 0.000054,
  longitude: 28.87431 + x * 0.000121,
});

export default function SlopeDemo() {
  const [points, setPoints] = useState(initialPoints);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursor, setCursor] = useState({ x: 61.5, y: 48.5 });
  const lastPointerUpdate = useRef(0);

  const result = useMemo(() => {
    if (points.length < 2) return null;

    const [first, last] = points;
    const distance = Math.hypot(last.x - first.x, last.y - first.y) * 2.64;
    const firstElevation = getElevation(first);
    const lastElevation = getElevation(last);
    const difference = Math.abs(lastElevation - firstElevation);

    return {
      distance,
      firstElevation,
      lastElevation,
      difference,
      percent: distance ? (difference / distance) * 100 : 0,
      degrees: distance ? Math.atan(difference / distance) * (180 / Math.PI) : 0,
    };
  }, [points]);

  const cursorCoordinate = getCoordinate(cursor);

  const getPosition = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)),
    };
  };

  const handleMapClick = (event) => {
    if (!isDrawing) return;
    const point = getPosition(event);

    if (points.length === 0) {
      setPoints([point]);
      return;
    }

    setPoints([points[0], point]);
    setIsDrawing(false);
  };

  const handlePointerMove = (event) => {
    const now = performance.now();
    if (now - lastPointerUpdate.current < 32) return;
    lastPointerUpdate.current = now;
    setCursor(getPosition(event));
  };

  const startDrawing = () => {
    setPoints([]);
    setIsDrawing(true);
  };

  const reset = () => {
    setPoints(initialPoints);
    setIsDrawing(false);
  };

  return (
    <div className="flex h-full min-h-[34rem] w-full flex-col bg-[#0b0d0f] text-white">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#14171a] px-4 py-3 md:px-6">
        <div>
          <h3 className="text-base font-bold md:text-lg">Eğim ve Koordinat Analizi</h3>
          <p className="mt-0.5 text-xs text-white/45">coordinate-slope</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${isDrawing ? 'border-signal/50 bg-signal/10 text-signal' : 'border-white/10 text-white/55'}`}>
          {isDrawing ? (points.length === 0 ? 'Başlangıç noktasını seçin' : 'Bitiş noktasını seçin') : 'Analiz hazır'}
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(18rem,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_19rem] lg:grid-rows-1">
        <button
          type="button"
          onClick={handleMapClick}
          onPointerMove={handlePointerMove}
          aria-label="Eğim hattı için haritadan iki nokta seçin"
          className={`relative min-h-[18rem] overflow-hidden text-left ${isDrawing ? 'cursor-crosshair' : 'cursor-default'}`}
          style={{
            backgroundColor: '#171b18',
            backgroundImage: 'linear-gradient(28deg, transparent 48%, rgba(212,175,55,0.06) 49%, transparent 51%), linear-gradient(118deg, transparent 46%, rgba(255,255,255,0.035) 47%, transparent 49%)',
            backgroundSize: '72px 72px, 104px 104px',
          }}
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-8 82 C16 66 25 79 45 58 S78 33 108 45" fill="none" stroke="rgba(212,175,55,.22)" strokeWidth="0.45" />
            <path d="M-5 91 C18 72 35 89 50 66 S84 43 108 53" fill="none" stroke="rgba(212,175,55,.13)" strokeWidth="0.4" />
            <path d="M-8 65 C19 52 32 62 47 43 S78 20 108 32" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="0.35" />
            <path d="M2 49 C21 34 39 48 56 27 S85 8 104 15" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="0.35" />
            {points.length === 2 && (
              <line
                x1={points[0].x}
                y1={points[0].y}
                x2={points[1].x}
                y2={points[1].y}
                stroke="#d4af37"
                strokeWidth="1.1"
                strokeDasharray="2 1"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          {points.map((point, index) => (
            <Motion.span
              key={`${point.x}-${point.y}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-signal bg-[#151719] text-[9px] font-bold text-signal shadow-[0_0_0_5px_rgba(212,175,55,0.12)]"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              {index + 1}
            </Motion.span>
          ))}

          <div className="absolute top-4 left-4 rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Arazi yüzeyi</p>
            <p className="mt-1 text-xs text-white/70">Çizgi üzerindeki iki nokta karşılaştırılır</p>
          </div>

          <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/70 px-3 py-2 text-xs backdrop-blur-sm">
            <i className="fa-solid fa-crosshairs text-signal" />
            <span className="font-mono text-white/75">
              {cursorCoordinate.latitude.toFixed(6)}, {cursorCoordinate.longitude.toFixed(6)}
            </span>
          </div>
        </button>

        <aside className="border-t border-white/10 bg-[#121416] p-4 lg:border-t-0 lg:border-l">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <p className="text-sm font-bold">Eğim Hesapla</p>
              <p className="mt-0.5 text-[11px] text-white/45">Tıklayarak bir çizgi çizin.</p>
            </div>
            <i className="fa-solid fa-chart-line text-signal" />
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={startDrawing}
              className="rounded-md bg-white/85 px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-signal"
            >
              {isDrawing ? 'Çizim devam ediyor' : 'Çizim Başlat'}
            </button>
            <button type="button" onClick={reset} className="rounded-md bg-white/10 px-3 py-2 text-xs text-white/75 transition-colors hover:bg-white/15">
              Sıfırla
            </button>
          </div>

          <dl className="mt-5 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-white/50">Yatay Mesafe</dt>
              <dd className="font-mono font-semibold">{result ? `${result.distance.toFixed(2)} m` : '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-white/50">1. Nokta Kotu</dt>
              <dd className="font-mono font-semibold">{points[0] ? `${getElevation(points[0]).toFixed(2)} m` : '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-white/50">2. Nokta Kotu</dt>
              <dd className="font-mono font-semibold">{points[1] ? `${getElevation(points[1]).toFixed(2)} m` : '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-dashed border-white/10 pt-3">
              <dt className="text-white/50">Kot Farkı</dt>
              <dd className="font-mono font-semibold">{result ? `${result.difference.toFixed(2)} m` : '—'}</dd>
            </div>
          </dl>

          <div className="mt-5 rounded-xl border border-signal/25 bg-signal/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-signal/70">Eğim</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <strong className="text-3xl text-signal">{result ? `%${result.percent.toFixed(2)}` : '—'}</strong>
              <span className="pb-1 font-mono text-sm text-white/55">{result ? `${result.degrees.toFixed(2)}°` : '—'}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-md border border-white/10 bg-black/25 px-3 py-2 text-[10px]">
            <span className="text-white/40">WGS84 (EPSG:4326)</span>
            <span className="text-signal">CANLI</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

import React, { lazy, Suspense } from 'react';

const demoComponents = {
  1: lazy(() => import('./MapsDemo')),
  2: lazy(() => import('./WidgetDemo')),
  3: lazy(() => import('./AutomationDemo')),
  4: lazy(() => import('./OpenSourceDemo')),
};

export default function DemoRenderer({ projectId }) {
  const Demo = demoComponents[projectId];

  if (!Demo) return null;

  return (
    <Suspense
      fallback={(
        <div className="flex h-full items-center justify-center text-sm text-muted" role="status">
          Demo yükleniyor…
        </div>
      )}
    >
      <Demo />
    </Suspense>
  );
}

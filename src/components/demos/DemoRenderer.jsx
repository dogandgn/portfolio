import React, { lazy, Suspense } from 'react';

const demoComponents = {
  1: lazy(() => import('./MapsDemo')),
  2: lazy(() => import('./WidgetDemo')),
  3: lazy(() => import('./AutomationDemo')),
  4: lazy(() => import('./OpenSourceDemo')),
  'coordinate-slope': lazy(() => import('./SlopeDemo')),
  'user-profile-logout': lazy(() => import('./AuthDemo')),
};

export default function DemoRenderer({ projectId, demoId, content }) {
  const Demo = demoComponents[demoId ?? projectId];

  if (!Demo) return null;

  return (
    <Suspense
      fallback={(
        <div className="flex h-full items-center justify-center text-sm text-muted" role="status">
          Demo yükleniyor…
        </div>
      )}
    >
      <Demo content={content} />
    </Suspense>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BIRDMAP_URL } from '../../data/projectLinks';

export default function OpenSourceDemo() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full min-h-[34rem] w-full flex-col bg-void lg:min-h-0">
      <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-gunmetal bg-deep px-4 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-signal/10 text-signal">
            <i className="fa-solid fa-crow" aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-bold text-ink">{t('projects.p4_liveTitle')}</span>
        </div>
        <a
          href={BIRDMAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-2 text-xs font-bold text-signal transition-colors hover:bg-signal hover:text-void sm:px-4 sm:text-sm"
        >
          <span>{t('projects.openNewTab')}</span>
          <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
        </a>
      </div>

      <iframe
        src={BIRDMAP_URL}
        title={t('projects.p4_iframeTitle')}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </div>
  );
}

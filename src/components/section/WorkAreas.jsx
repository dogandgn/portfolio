import React from 'react';
import { useTranslation } from 'react-i18next';
import { getWorkAreas } from '../../data/workAreasData';

export default function WorkAreas() {
  const { t } = useTranslation();
  const workAreas = getWorkAreas(t);

  return (
    <section id="work-areas" className="py-24 px-6 max-w-[1344px] mx-auto scroll-mt-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">
            {t('workAreas.badge')}
          </span>
          <h2 className="mt-4 text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight">
            {t('workAreas.title')}
          </h2>
          <p className="mt-5 max-w-xl text-base text-fog leading-relaxed">
            {t('workAreas.intro')}
          </p>
        </div>

        <div className="border-t border-gunmetal">
          {workAreas.map((area, index) => (
            <article
              key={area.id}
              className="grid gap-4 border-b border-gunmetal py-7 sm:grid-cols-[3rem_minmax(0,1fr)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gunmetal bg-deep text-signal" aria-hidden="true">
                <i className={`fa-solid ${area.icon}`}></i>
              </div>
              <div>
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="text-xs font-medium text-muted" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-ink">{area.title}</h3>
                </div>
                <p className="text-base leading-relaxed text-fog">{area.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

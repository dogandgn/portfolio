import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="top" className="px-6 pt-36 pb-24 max-w-[1344px] mx-auto flex flex-col items-start justify-center min-h-[85vh]">
      <div className="max-w-4xl">
        <h1 className="text-6xl md:text-[68px] font-bold text-ink mb-4 tracking-[-0.02em] leading-none">
          DOĞAN ARİÇ
        </h1>
        <h2 className="text-3xl md:text-[44px] font-bold text-ink mb-4 leading-tight tracking-[-0.02em]">
          {t('hero.title1')} <span className="text-steel font-normal">&</span> <br />
          <span className="text-signal">
            {t('hero.title2')}
          </span>
        </h2>
        <p className="text-lg md:text-xl text-muted font-normal tracking-wide mb-5">
          {t('hero.subtitle')}
        </p>
        <p className="max-w-3xl text-base md:text-lg leading-relaxed text-fog mb-10">
          {t('hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <a href="#projects" className="inline-flex items-center justify-center gap-2 bg-ink text-deep px-6 py-3 rounded-full text-sm font-medium hover:bg-signal transition-all">
            {t('hero.viewWork')}
            <i className="fa-solid fa-arrow-down" aria-hidden="true"></i>
          </a>
          <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-transparent text-ink border border-graphite px-6 py-3 rounded-full text-sm font-medium hover:border-ink transition-all">
            <i className="fa-solid fa-envelope" aria-hidden="true"></i>
            {t('hero.contact')}
          </a>
          <a href="/cv.jpg" download className="inline-flex items-center justify-center gap-2 bg-signal text-ink px-6 py-3 rounded-full text-sm font-medium hover:bg-deep-signal transition-all">
            <i className="fa-solid fa-download" aria-hidden="true"></i>
            {t('hero.cv')}
          </a>
        </div>
      </div>
    </section>
  );
}

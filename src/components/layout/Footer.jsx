import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="border-t border-gunmetal mt-12 bg-deep">
      <div className="max-w-[1344px] mx-auto px-6 py-20 flex flex-col md:flex-row justify-between items-center gap-10">
        
        <div className="text-center md:text-left">
          <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">{t('contact.badge')}</span>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-fog">{t('contact.description')}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-6">
            <a href="mailto:doganaric@gmail.com" className="inline-flex items-center gap-2 text-base font-medium text-signal hover:text-deep-signal transition-colors">
              doganaric@gmail.com
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
            <a href="tel:+905392032768" className="inline-flex items-center gap-2 text-base font-medium text-ink hover:text-signal transition-colors">
              +90 539 203 27 68
            </a>
          </div>
        </div>

        <div className="flex gap-4">
          <a href="https://github.com/dogandgn" target="_blank" rel="noreferrer" aria-label="GitHub" className="w-12 h-12 flex items-center justify-center rounded-full bg-void border border-gunmetal text-ink hover:text-signal hover:border-signal transition-all">
            <i className="fa-brands fa-github text-xl" aria-hidden="true"></i>
          </a>
          <a href="https://www.linkedin.com/in/doganaric" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-12 h-12 flex items-center justify-center rounded-full bg-void border border-gunmetal text-ink hover:text-signal hover:border-signal transition-all">
            <i className="fa-brands fa-linkedin-in text-xl" aria-hidden="true"></i>
          </a>
          <a href="mailto:doganaric@gmail.com" aria-label={t('hero.email')} className="w-12 h-12 flex items-center justify-center rounded-full bg-void border border-gunmetal text-ink hover:text-signal hover:border-signal transition-all">
            <i className="fa-solid fa-envelope text-xl" aria-hidden="true"></i>
          </a>
        </div>

      </div>
    </footer>
  );
}

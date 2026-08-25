import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="border-t border-gunmetal mt-12 bg-deep">
      <div className="max-w-[1344px] mx-auto px-6 py-20 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-ink mb-3 tracking-tight">Doğan <span className="text-signal">Ariç</span></h2>
          <p className="text-muted font-medium tracking-wide text-sm">{t('hero.subtitle')}</p>
        </div>

        <div className="flex gap-4">
          <a href="https://github.com/dogandgn" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-void border border-gunmetal text-ink hover:text-signal hover:border-signal transition-all">
            <i className="fa-brands fa-github text-xl"></i>
          </a>
          <a href="https://www.linkedin.com/in/doganaric" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-void border border-gunmetal text-ink hover:text-signal hover:border-signal transition-all">
            <i className="fa-brands fa-linkedin-in text-xl"></i>
          </a>
          <a href="mailto:doganaric@gmail.com" className="w-12 h-12 flex items-center justify-center rounded-full bg-void border border-gunmetal text-ink hover:text-signal hover:border-signal transition-all">
            <i className="fa-solid fa-envelope text-xl"></i>
          </a>
        </div>

      </div>
    </footer>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-24 px-6 max-w-[1344px] mx-auto">
      <div className="flex flex-col md:flex-row gap-16">
        
        <div className="md:w-1/3">
          <div className="mb-4">
            <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">{t('about.badge')}</span>
          </div>
          <h3 className="text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight">
            {t('about.title')}
          </h3>
        </div>

        <div className="md:w-2/3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg prose-p:text-fog prose-p:leading-relaxed prose-strong:text-ink max-w-none bg-deep p-8 rounded-2xl border border-gunmetal shadow-sm"
          >
            <p className="mb-6">
              {t('about.p1')}
            </p>
            <p>
              {t('about.p2')}
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
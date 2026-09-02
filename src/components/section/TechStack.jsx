import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function TechStack() {
  const { t } = useTranslation();

  const coreCompetencies = [
    { title: t('techstack.c1'), icon: "🌍" },
    { title: t('techstack.c2'), icon: "💻" },
    { title: t('techstack.c3'), icon: "⚙️" },
    { title: t('techstack.c4'), icon: "🗺️" },
    { title: t('techstack.c5'), icon: "🏙️" },
    { title: t('techstack.c6'), icon: "🤝" }
  ];

  return (
    <section id="techstack" className="py-24 px-6 max-w-[1344px] mx-auto">
      
      <div className="mb-4">
        <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">{t('techstack.badge')}</span>
      </div>
      <div className="mb-14">
        <h3 className="text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight">{t('techstack.title')}</h3>
      </div>

      <Motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {coreCompetencies.map((comp, index) => (
          <Motion.div
            key={index}
            variants={cardVariants}
            className="flex items-start bg-deep border border-gunmetal p-6 rounded-2xl hover:border-signal/50 transition-colors group"
          >
            <div className="text-2xl mr-4 opacity-70 group-hover:opacity-100 transition-opacity">
              {comp.icon}
            </div>
            <h4 className="text-sm font-medium text-fog group-hover:text-ink transition-colors leading-relaxed">
              {comp.title}
            </h4>
          </Motion.div>
        ))}
      </Motion.div>

    </section>
  );
}

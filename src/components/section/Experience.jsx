import React from 'react';
import { motion } from 'framer-motion';
import { experiences } from '../../data/resumeData';

export default function Experience() {
  const cbsExperiences = experiences.filter(exp => exp.category === "CBS ÇALIŞMALARI");
  const kentselExperiences = experiences.filter(exp => exp.category === "KENTSEL DÖNÜŞÜM ÇALIŞMALARI");

  const renderExperienceList = (list) => (
    <div className="space-y-10">
      {list.map((exp, index) => (
        <motion.div 
          key={exp.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          className="relative pl-8 border-l-2 border-gunmetal"
        >
          <span className="absolute -left-[6px] top-1.5 h-2.5 w-2.5 rounded-full bg-signal border-2 border-deep"></span>
          <h4 className="text-base font-bold text-ink mb-1">{exp.title}</h4>
          <span className="text-xs font-medium text-signal block mb-4">{exp.date}</span>
          
          <ul className="space-y-3 mb-5">
            {exp.description.map((item, i) => (
              <li key={i} className="text-fog text-sm leading-relaxed">
                <span className="text-steel mr-2">▹</span>{item}
              </li>
            ))}
          </ul>
          
          <div className="flex flex-wrap gap-1.5">
            {exp.tech.map((t, i) => (
              <span key={i} className="px-2.5 py-1 bg-void border border-gunmetal rounded text-[11px] text-fog font-medium">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section id="experience" className="py-24 px-6 max-w-[1344px] mx-auto">
      <div className="mb-4">
        <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">İş Deneyimi</span>
      </div>
      <div className="mb-14">
        <h3 className="text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight mb-2">Şehir Plancısı & Kurumsal CBS Geliştiricisi</h3>
        <p className="text-muted text-sm">Kasım 2021 - Temmuz 2026</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center mb-10 pb-4 border-b border-gunmetal">
            <div className="w-10 h-10 rounded-xl bg-signal/10 flex items-center justify-center mr-4 border border-signal/20">
              <i className="fa-solid fa-map-location-dot text-lg text-signal"></i>
            </div>
            <h3 className="text-xl font-bold text-ink">CBS Çalışmaları</h3>
          </div>
          {renderExperienceList(cbsExperiences)}
        </div>

        <div>
          <div className="flex items-center mb-10 pb-4 border-b border-gunmetal">
            <div className="w-10 h-10 rounded-xl bg-signal/10 flex items-center justify-center mr-4 border border-signal/20">
              <i className="fa-solid fa-city text-lg text-signal"></i>
            </div>
            <h3 className="text-xl font-bold text-ink">Kentsel Dönüşüm</h3>
          </div>
          {renderExperienceList(kentselExperiences)}
        </div>
      </div>
    </section>
  );
}

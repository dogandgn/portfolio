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
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative pl-8 border-l-2 border-slate-800"
        >
          <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-sky-500 border-4 border-[#070a13] shadow-[0_0_10px_rgba(14,165,233,0.5)]"></span>
          <h4 className="text-xl font-bold text-white mb-1">{exp.title}</h4>
          <span className="text-sm font-medium text-sky-400 block mb-4">{exp.date}</span>
          
          <ul className="space-y-3 mb-5">
            {exp.description.map((item, i) => (
              <li key={i} className="text-slate-300 text-[15px] leading-relaxed">
                <span className="text-sky-500/50 mr-2">▹</span>{item}
              </li>
            ))}
          </ul>
          
          <div className="flex flex-wrap gap-2">
            {exp.tech.map((t, i) => (
              <span key={i} className="px-3 py-1 bg-slate-800/40 border border-slate-700/50 rounded-full text-xs text-sky-200/70 font-medium">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section id="experience" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/60">
      <div className="mb-16 text-center">
        <h2 className="text-sky-400 font-semibold tracking-widest uppercase mb-2 text-sm">İş Deneyimi</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Şehir Plancısı & Kurumsal CBS Geliştiricisi</h3>
        <p className="text-slate-400 font-medium mb-12">Mayıs 2020 - Günümüz</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center mb-10 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mr-4 border border-sky-500/20">
              <i className="fa-solid fa-map-location-dot text-xl text-sky-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-white">CBS Çalışmaları</h3>
          </div>
          {renderExperienceList(cbsExperiences)}
        </div>

        <div>
          <div className="flex items-center mb-10 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mr-4 border border-indigo-500/20">
              <i className="fa-solid fa-city text-xl text-indigo-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-white">Kentsel Dönüşüm</h3>
          </div>
          {renderExperienceList(kentselExperiences)}
        </div>
      </div>
    </section>
  );
}

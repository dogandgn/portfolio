import React from 'react';
import { motion } from 'framer-motion';
import { education } from '../../data/resumeData';

export default function Education() {
  return (
    <section id="education" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-emerald-400 font-semibold tracking-widest uppercase mb-2 text-sm">Akademik Geçmiş</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-white">Eğitim</h3>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {education.map((edu, index) => (
          <motion.div 
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-sky-500"></div>
            
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <i className="fa-solid fa-graduation-cap text-emerald-400 text-lg"></i>
                  </div>
                  <h4 className="text-2xl font-bold text-white">{edu.school}</h4>
                </div>
                
                <div className="ml-13 pl-13">
                  <p className="text-lg text-emerald-400 font-medium mb-1">{edu.department}</p>
                  <p className="text-slate-400 text-sm mb-4">{edu.faculty}</p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700/50 px-4 py-2 rounded-full text-slate-300 text-sm font-medium whitespace-nowrap flex items-center gap-2 h-fit">
                <i className="fa-regular fa-calendar text-emerald-400"></i> {edu.date}
              </div>
              
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-slate-300 leading-relaxed text-[15px]">
                {edu.description}
              </p>
            </div>
            
          </motion.div>
        ))}
      </div>
    </section>
  );
}

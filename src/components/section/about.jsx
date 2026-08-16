import React from 'react';
import { motion } from 'framer-motion';
import { education } from '../../data/resumeData';

export default function About() {
  return (
    <section id="about" className="py-20 px-6 max-w-7xl mx-auto">
      
      <div className="mb-12">
        <h3 className="text-3xl md:text-4xl font-bold text-white">Hakkımda</h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:w-2/3 space-y-6 text-slate-300 leading-relaxed text-lg"
        >
          <p>
            Modern şehircilik vizyonunu ileri düzey veri otomasyonu ve web teknolojileri ile birleştiren; kurumsal CBS mimarisi ve veri mühendisliği alanlarında uzman bir <strong className="text-sky-400 font-medium">şehir plancısı ve yazılım geliştiricisiyim</strong>.
          </p>
          <p>
            ArcGIS Enterprise altyapısı ve açık kaynak web kütüphaneleri üzerinde; planlama, mülkiyet ve kentsel dönüşüm verilerini analiz eden, görselleştiren ve karar destek sistemlerine dönüştüren uçtan uca kurumsal uygulamalar inşa ediyorum.
          </p>
          <p>
            Python ve JavaScript ekosistemindeki derin teknik yetkinliklerimi mekansal analiz süreçlerini optimize etmek için kullanırken, sahadaki kentsel dönüşüm vizyonumla projelerin sosyal ve finansal fizibilitesini uçtan uca kurguluyorum.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:w-1/3 w-full"
        >
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors h-full flex flex-col">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-sky-500"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <i className="fa-solid fa-graduation-cap text-emerald-400 text-xl"></i>
              </div>
              <h4 className="text-2xl font-bold text-white">Eğitim</h4>
            </div>
            
            <div className="mb-2 flex-1">
              <h5 className="text-xl font-bold text-white mb-2">{education[0].school}</h5>
              <p className="text-emerald-400 font-medium mb-1">{education[0].department}</p>
              <p className="text-slate-400 text-sm mb-4">{education[0].faculty}</p>
              
              <div className="bg-slate-900/50 border border-slate-700/50 px-4 py-2 rounded-full text-slate-300 text-sm font-medium w-fit flex items-center gap-2 mb-6">
                <i className="fa-regular fa-calendar text-emerald-400"></i> {education[0].date}
              </div>
              
              <p className="text-slate-300 leading-relaxed text-[15px] border-t border-slate-700/50 pt-6">
                {education[0].description}
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
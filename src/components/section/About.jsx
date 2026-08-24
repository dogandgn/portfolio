import React from 'react';
import { motion } from 'framer-motion';
import { education } from '../../data/resumeData';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-[1344px] mx-auto">
      
      <div className="mb-4">
        <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">Profil</span>
      </div>
      <div className="mb-14">
        <h3 className="text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight">Hakkımda</h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:w-2/3 space-y-6 text-fog leading-relaxed text-base"
        >
          <p>
            Modern şehircilik vizyonunu ileri düzey veri otomasyonu ve web teknolojileri ile birleştiren; kurumsal CBS mimarisi ve veri mühendisliği alanlarında uzman bir <strong className="text-ink font-medium">şehir plancısı ve yazılım geliştiricisiyim</strong>.
          </p>
          <p>
            ArcGIS Enterprise altyapısı ve açık kaynak web kütüphaneleri üzerinde; planlama, mülkiyet ve kentsel dönüşüm verilerini analiz eden, görselleştiren ve karar destek sistemlerine dönüştüren uçtan uca kurumsal uygulamalar inşa ediyorum.
          </p>
          <p>
            Python ve JavaScript ekosistemindeki derin teknik yetkinliklerimi mekansal analiz süreçlerini optimize etmek için kullanırken, sahadaki kentsel dönüşüm vizyonumla projelerin sosyal ve finansal fizibilitesini uçtan uca kurguluyorum.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:w-1/3 w-full"
        >
          <div className="bg-deep border border-gunmetal p-8 rounded-2xl relative overflow-hidden group hover:border-signal/50 transition-colors h-full flex flex-col">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-signal"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-signal/10 flex items-center justify-center border border-signal/20">
                <i className="fa-solid fa-graduation-cap text-signal text-lg"></i>
              </div>
              <h4 className="text-xl font-bold text-ink">Eğitim</h4>
            </div>
            
            <div className="mb-2 flex-1">
              <h5 className="text-lg font-bold text-ink mb-2">{education[0].school}</h5>
              <p className="text-signal font-medium mb-1 text-sm">{education[0].department}</p>
              <p className="text-muted text-sm mb-4">{education[0].faculty}</p>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="bg-void border border-gunmetal px-4 py-2 rounded-full text-fog text-sm font-medium w-fit flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-signal text-xs"></i> {education[0].date}
                </div>
                <a 
                  href="/lisans-portfolyo.pdf" 
                  download 
                  className="bg-signal/10 hover:bg-signal/20 border border-signal/30 text-signal hover:text-deep-signal px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-download text-xs"></i> Lisans Portfolyo
                </a>
              </div>
              
              <p className="text-fog leading-relaxed text-sm border-t border-gunmetal pt-6">
                {education[0].description}
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
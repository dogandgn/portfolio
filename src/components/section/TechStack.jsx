import React from 'react';
import { motion } from 'framer-motion';

const coreCompetencies = [
  { title: "Kurumsal Coğrafi Bilgi Sistemleri (CBS) ve Veri Mimarisi", icon: "🌍" },
  { title: "Kentsel Dönüşüm Fizibilite ve Matematiksel Dağıtım Modelleri", icon: "🏙️" },
  { title: "Python (ArcPy, Pandas) ile Veri İşleme ve Otomasyon", icon: "⚙️" },
  { title: "JavaScript (React.js) ile Özel Web-CBS Geliştirme", icon: "💻" },
  { title: "Sosyal Doku Analizi ve Vatandaş/Hak Sahibi Uzlaşma Süreçleri", icon: "🤝" },
  { title: "Coğrafi Veri Tabanı (Geodatabase) Yönetimi ve Kartografya", icon: "🗺️" }
];

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
  return (
    <section id="techstack" className="py-24 px-6 max-w-[1344px] mx-auto">
      
      <div className="mb-4">
        <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">Uzmanlıklar</span>
      </div>
      <div className="mb-14">
        <h3 className="text-3xl md:text-[32px] font-bold text-white leading-snug tracking-tight">Temel Yetkinlikler</h3>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {coreCompetencies.map((comp, index) => (
          <motion.div 
            key={index}
            variants={cardVariants}
            className="flex items-start bg-deep border border-gunmetal p-6 rounded-[24px] hover:border-signal/30 transition-colors group"
          >
            <div className="text-2xl mr-4 opacity-70 group-hover:opacity-100 transition-opacity">
              {comp.icon}
            </div>
            <h4 className="text-sm font-medium text-fog group-hover:text-white transition-colors leading-relaxed">
              {comp.title}
            </h4>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}
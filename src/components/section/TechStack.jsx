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
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function TechStack() {
  return (
    <section id="techstack" className="py-20 px-6 max-w-7xl mx-auto">
      
      <div className="mb-16 text-center">
        <h2 className="text-sky-400 font-semibold tracking-widest uppercase mb-2 text-sm">Uzmanlıklar</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-white">Temel Yetkinlikler</h3>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {coreCompetencies.map((comp, index) => (
          <motion.div 
            key={index}
            variants={cardVariants}
            className="flex items-start bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl hover:border-sky-500/50 hover:bg-slate-800/60 transition-colors group"
          >
            <div className="text-3xl mr-4 opacity-80 group-hover:opacity-100 transition-opacity">
              {comp.icon}
            </div>
            <h4 className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">
              {comp.title}
            </h4>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}
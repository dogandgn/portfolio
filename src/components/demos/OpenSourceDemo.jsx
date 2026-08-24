import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OpenSourceDemo() {
  const [activeApp, setActiveApp] = useState('birdmap');

  const apps = [
    {
      id: 'birdmap',
      title: 'Birdmap Uygulaması',
      icon: 'fa-crow',
      desc: 'Kuş türlerinin göç yollarını ve gözlem noktalarını gösteren açık kaynaklı harita uygulaması.',
      url: 'https://birdmap-demo.netlify.app'
    }
  ];

  const currentApp = apps.find(a => a.id === activeApp);

  return (
    <div className="w-full bg-void border border-gunmetal rounded-xl overflow-hidden flex flex-col min-h-[500px]">
      
      <div className="w-full bg-deep border-b border-gunmetal flex p-2 gap-2 overflow-x-auto custom-scrollbar">
        {apps.map(app => (
          <button 
            key={app.id}
            onClick={() => setActiveApp(app.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeApp === app.id ? 'bg-signal/10 text-signal border border-signal/40' : 'bg-gunmetal text-ash hover:bg-void hover:text-silver'}`}
          >
            <i className={`fa-solid ${app.icon}`}></i> {app.title}
          </button>
        ))}
      </div>

      <div className="flex-grow bg-void relative flex flex-col items-center justify-center p-6">
        
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#007afc 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentApp.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="z-10 w-full max-w-3xl bg-deep/90 backdrop-blur border border-gunmetal rounded-xl overflow-hidden flex flex-col"
          >
            <div className="bg-deep px-4 py-3 flex items-center justify-between border-b border-gunmetal">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-ash text-xs font-mono px-3 py-1 bg-void rounded-md">
                  {currentApp.url}
                </div>
              </div>
              <a href={currentApp.url} target="_blank" rel="noreferrer" className="text-signal hover:text-signal/80 text-sm font-semibold flex items-center gap-2">
                Yeni Sekmede Aç <i className="fa-solid fa-external-link-alt"></i>
              </a>
            </div>

            <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-20 h-20 bg-void rounded-full flex items-center justify-center text-4xl text-signal mb-6">
                <i className={`fa-solid ${currentApp.icon}`}></i>
              </div>
              <h4 className="text-2xl font-bold text-ink mb-4">{currentApp.title}</h4>
              <p className="text-ash max-w-lg mb-8 leading-relaxed">
                {currentApp.desc}
              </p>
              
              <div className="p-4 bg-signal/10 border border-signal/20 rounded-lg max-w-md text-signal/80 text-sm">
                <i className="fa-solid fa-circle-info mr-2"></i>
                Uygulamayı canlı deneyimlemek veya kaynak kodlarına erişmek için üstteki <strong>"Yeni Sekmede Aç"</strong> butonunu kullanabilirsiniz.
              </div>
              
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

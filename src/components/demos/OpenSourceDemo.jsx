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
    },
    {
      id: 'leaflet-tools',
      title: 'React-Leaflet Analiz Araçları',
      icon: 'fa-layer-group',
      desc: 'React ve Leaflet kullanılarak geliştirilmiş, açık kaynaklı mekansal analiz kütüphanesi.',
      url: 'https://github.com/dogandgn/leaflet-tools'
    },
    {
      id: 'openlayers-viewer',
      title: 'OpenLayers 3D Görüntüleyici',
      icon: 'fa-cube',
      desc: 'Web-GIS projeleri için OpenLayers tabanlı 3D yapı görüntüleyici eklentisi.',
      url: 'https://github.com/dogandgn/openlayers-viewer'
    }
  ];

  const currentApp = apps.find(a => a.id === activeApp);

  return (
    <div className="w-full bg-slate-950 border border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-inner min-h-[500px]">
      
      <div className="w-full bg-slate-900 border-b border-slate-700 flex p-2 gap-2 overflow-x-auto custom-scrollbar">
        {apps.map(app => (
          <button 
            key={app.id}
            onClick={() => setActiveApp(app.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeApp === app.id ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'}`}
          >
            <i className={`fa-solid ${app.icon}`}></i> {app.title}
          </button>
        ))}
      </div>

      <div className="flex-grow bg-slate-950 relative flex flex-col items-center justify-center p-6">
        
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentApp.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="z-10 w-full max-w-3xl bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-slate-400 text-xs font-mono px-3 py-1 bg-slate-900 rounded-md">
                  {currentApp.url}
                </div>
              </div>
              <a href={currentApp.url} target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300 text-sm font-semibold flex items-center gap-2">
                Yeni Sekmede Aç <i className="fa-solid fa-external-link-alt"></i>
              </a>
            </div>

            <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-4xl text-sky-400 mb-6 shadow-lg">
                <i className={`fa-solid ${currentApp.icon}`}></i>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">{currentApp.title}</h4>
              <p className="text-slate-400 max-w-lg mb-8 leading-relaxed">
                {currentApp.desc}
              </p>
              
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg max-w-md text-amber-200/80 text-sm">
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

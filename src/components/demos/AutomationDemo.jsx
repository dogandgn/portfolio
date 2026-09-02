import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

export default function AutomationDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-void border border-gunmetal rounded-xl overflow-hidden p-8 min-h-[400px] flex flex-col items-center justify-center relative">
      
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #333943 1px, transparent 1px), linear-gradient(to bottom, #333943 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 w-full max-w-2xl">
        <h4 className="text-center text-ink font-bold text-xl mb-12">Otomasyon Veri Akışı</h4>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
          
          <div className={`flex flex-col items-center transition-opacity duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-4 border-2 transition-colors ${step === 0 ? 'bg-signal/10 border-signal text-signal' : 'bg-deep border-graphite text-ash'}`}>
              <i className="fa-solid fa-globe"></i>
            </div>
            <div className="text-ink font-semibold text-sm">Kurumsal Portal</div>
            <div className="text-ash text-xs">KML / Web Kaynağı</div>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center relative h-10">
            <div className="w-full h-1 bg-gunmetal rounded absolute"></div>
            {step >= 1 && (
              <Motion.div
                className="w-full h-1 bg-signal absolute origin-left rounded"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }}
              ></Motion.div>
            )}
            {step === 1 && (
              <Motion.div
                className="text-signal absolute"
                initial={{ x: -60 }} animate={{ x: 60 }} transition={{ duration: 1, repeat: Infinity }}
              >
                <i className="fa-solid fa-file-code"></i>
              </Motion.div>
            )}
          </div>

          <div className={`flex flex-col items-center transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 border-2 transition-all ${step === 1 || step === 2 ? 'bg-signal/10 border-signal text-signal scale-110' : 'bg-deep border-graphite text-ash scale-100'}`}>
              <Motion.i
                animate={{ rotate: step === 1 || step === 2 ? 360 : 0 }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="fa-brands fa-python"
              ></Motion.i>
            </div>
            <div className="text-ink font-semibold text-sm">Selenium & ArcPy</div>
            <div className="text-ash text-xs">Veri İşleme ve Dönüşüm</div>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center relative h-10">
            <div className="w-full h-1 bg-gunmetal rounded absolute"></div>
            {step >= 3 && (
              <Motion.div
                className="w-full h-1 bg-signal absolute origin-left rounded"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }}
              ></Motion.div>
            )}
            {step === 3 && (
              <Motion.div
                className="text-signal absolute"
                initial={{ x: -60 }} animate={{ x: 60 }} transition={{ duration: 1, repeat: Infinity }}
              >
                <i className="fa-solid fa-database"></i>
              </Motion.div>
            )}
          </div>

          <div className={`flex flex-col items-center transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-4 border-2 transition-colors ${step === 3 ? 'bg-signal/10 border-signal text-signal' : 'bg-deep border-graphite text-ash'}`}>
              <i className="fa-solid fa-server"></i>
            </div>
            <div className="text-ink font-semibold text-sm">Kurumsal Veritabanı</div>
            <div className="text-ash text-xs">CBS Katmanı Entegrasyonu</div>
          </div>

        </div>

        <div className="mt-16 text-center h-8">
          <AnimatePresence mode="wait">
            {step === 0 && <Motion.div key="0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-fog">1. Selenium botları kaynak portaldan güncel KML verilerini tespit eder.</Motion.div>}
            {step === 1 && <Motion.div key="1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-signal">2. Veriler otomatik olarak indirilip çalışma dizinine aktarılır.</Motion.div>}
            {step === 2 && <Motion.div key="2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-signal">3. Python/ArcPy betikleri veriyi işler, sütun bütünlüğünü koruyarak dönüşüm sağlar.</Motion.div>}
            {step === 3 && <Motion.div key="3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-signal">4. Güncel mekansal veriler başarıyla kurumun CBS veritabanına yazılır.</Motion.div>}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

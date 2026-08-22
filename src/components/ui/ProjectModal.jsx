import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TechBadge from './TechBadge';
import DemoRenderer from '../demos/DemoRenderer';

export default function ProjectModal({ project, isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-[100] overflow-y-auto custom-scrollbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="min-h-screen px-4 sm:px-6 pt-10 pb-20 flex justify-center items-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-void/90 backdrop-blur-sm cursor-pointer"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-deep border border-gunmetal rounded-[24px] overflow-hidden z-10 flex flex-col"
            >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-void/70 hover:bg-void text-white rounded-full flex items-center justify-center transition-colors z-20"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="relative w-full h-64 sm:h-80 md:h-96 shrink-0 overflow-hidden bg-graphite">
              <div className="absolute inset-0 bg-gradient-to-t from-deep to-transparent z-10"></div>
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-steel">
                  <i className="fa-solid fa-image text-5xl opacity-20"></i>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-2xl md:text-[32px] font-bold text-white mb-4 tracking-tight">
                {project.title}
              </h3>
              
              <div className="mb-8">
                <h4 className="text-muted font-medium mb-2 text-[10px] uppercase tracking-[0.7em]">Proje Detayları</h4>
                <p className="text-fog leading-relaxed text-base">
                  {project.description}
                </p>
              </div>

              <div className="mb-8">
                <h4 className="text-muted font-medium mb-3 text-[10px] uppercase tracking-[0.7em]">Kullanılan Teknolojiler</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((techName, index) => (
                    <TechBadge key={index} text={techName} />
                  ))}
                </div>
              </div>

              <div className="mt-12 border-t border-gunmetal pt-8">
                <h4 className="text-muted font-medium mb-6 text-[10px] uppercase tracking-[0.7em]">İnteraktif Demo</h4>
                <DemoRenderer projectId={project.id} />
              </div>

            </div>
          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}

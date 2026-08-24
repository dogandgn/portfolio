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
        <div className="fixed inset-0 z-[100] overflow-y-auto" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/20 backdrop-blur-sm cursor-pointer"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 min-h-screen"
          >
            <button
              onClick={onClose}
              className="fixed top-6 right-6 w-10 h-10 bg-deep border border-gunmetal hover:border-ink text-ink rounded-full flex items-center justify-center transition-colors z-50"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex flex-col lg:flex-row min-h-screen">
              
              <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 bg-void">
                <div className="max-w-lg mx-auto lg:mx-0 pt-12 lg:pt-8 pb-16">
                  
                  {project.image && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-8 border border-gunmetal lg:hidden">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}

                  <span className="text-muted text-[10px] font-medium uppercase tracking-[0.7em]">Proje Detayı</span>
                  <h3 className="text-3xl md:text-[40px] font-bold text-ink mb-6 mt-3 tracking-tight leading-tight">
                    {project.title}
                  </h3>
                  
                  <div className="mb-10">
                    <p className="text-fog leading-relaxed text-base">
                      {project.description}
                    </p>
                  </div>

                  <div className="mb-10">
                    <h4 className="text-muted font-medium mb-3 text-[10px] uppercase tracking-[0.7em]">Kullanılan Teknolojiler</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((techName, index) => (
                        <TechBadge key={index} text={techName} />
                      ))}
                    </div>
                  </div>

                  <div className="lg:hidden mt-8 border-t border-gunmetal pt-8">
                    <h4 className="text-muted font-medium mb-6 text-[10px] uppercase tracking-[0.7em]">İnteraktif Demo</h4>
                    <DemoRenderer projectId={project.id} />
                  </div>

                </div>
              </div>

              <div className="hidden lg:block lg:w-1/2 lg:sticky lg:top-0 lg:h-screen bg-deep border-l border-gunmetal overflow-y-auto">
                <div className="p-8 lg:p-12 h-full flex flex-col">
                  
                  {project.image && (
                    <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 border border-gunmetal shrink-0">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-h-0">
                    <h4 className="text-muted font-medium mb-4 text-[10px] uppercase tracking-[0.7em]">İnteraktif Demo</h4>
                    <DemoRenderer projectId={project.id} />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}

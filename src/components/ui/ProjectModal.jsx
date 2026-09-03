import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion as Motion } from 'framer-motion';
import TechBadge from './TechBadge';
import DemoRenderer from '../demos/DemoRenderer';

export default function ProjectModal({ project, onClose, t }) {
  const closeButtonRef = useRef(null);
  const isMapProject = project.id === 1;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6" role="presentation">
        
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        />

        <Motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`relative w-full bg-deep border border-gunmetal rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row ${isMapProject ? 'md:max-w-[96vw] md:h-[92vh] md:max-h-[92vh]' : 'max-w-6xl max-h-[90vh]'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-dialog-title-${project.id}`}
        >
          <div className={`w-full h-full max-h-[50vh] overflow-y-auto border-b md:border-b-0 md:border-r border-gunmetal p-8 custom-scrollbar ${isMapProject ? 'md:w-[32%] md:max-h-[92vh]' : 'md:w-[45%] md:max-h-[90vh]'}`}>
            <div className="mb-8">
              <h3 id={`project-dialog-title-${project.id}`} className="text-3xl font-bold text-ink mb-4 leading-tight">{project.title}</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <TechBadge key={tech} text={tech} />
                ))}
              </div>
              <p className="text-fog text-[15px] leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
            
            <button 
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="mt-8 px-6 py-2.5 bg-gunmetal text-ink hover:bg-signal transition-colors rounded-full font-medium text-sm inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left"></i>
              {t('projects.close')}
            </button>
          </div>

          <div className={`w-full h-[50vh] bg-void relative min-h-0 ${isMapProject ? 'md:w-[68%] md:h-full' : 'md:w-[55%] md:h-[90vh]'}`}>
            <DemoRenderer projectId={project.id} />
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label={t('projects.close')}
            className="md:hidden absolute top-4 right-4 w-10 h-10 bg-deep/80 backdrop-blur-md text-ink rounded-full flex items-center justify-center border border-gunmetal z-50 shadow-lg"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
          
        </Motion.div>
      </div>,
    document.body
  );
}

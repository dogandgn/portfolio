import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import TechBadge from './TechBadge';
import DemoRenderer from '../demos/DemoRenderer';

export default function ProjectModal({ project, onClose, t }) {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [activeWidgetIndex, setActiveWidgetIndex] = useState(0);
  const widgets = project.widgets ?? [];
  const widgetCount = widgets.length;
  const activeWidget = widgets[activeWidgetIndex];
  const activeContent = activeWidget ?? project;
  const activeDetails = activeContent.details;
  const activeTech = activeContent.tech ?? project.tech;
  const isMapProject = project.id === 1;
  const hasWidgetNavigation = widgetCount > 1;

  const showPreviousWidget = useCallback(() => {
    setActiveWidgetIndex((current) => (current - 1 + widgetCount) % widgetCount);
  }, [widgetCount]);

  const showNextWidget = useCallback(() => {
    setActiveWidgetIndex((current) => (current + 1) % widgetCount);
  }, [widgetCount]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (hasWidgetNavigation && event.key === 'ArrowLeft') showPreviousWidget();
      if (hasWidgetNavigation && event.key === 'ArrowRight') showNextWidget();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasWidgetNavigation, onClose, showNextWidget, showPreviousWidget]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [activeWidgetIndex]);

  const panelClass = isMapProject
    ? 'md:max-w-[96vw] md:h-[92vh] md:max-h-[92vh]'
    : hasWidgetNavigation
      ? 'md:max-w-[96vw] md:h-[92vh] md:max-h-[92vh]'
      : 'max-w-6xl max-h-[90vh]';

  const leftClass = isMapProject
    ? 'md:w-[32%] md:max-h-[92vh]'
    : hasWidgetNavigation
      ? 'md:w-[45%] md:max-h-[92vh]'
      : 'md:w-[45%] md:max-h-[90vh]';

  const rightClass = isMapProject
    ? 'md:w-[68%] md:h-full'
    : hasWidgetNavigation
      ? 'md:w-[55%] md:h-full'
      : 'md:w-[55%] md:h-[90vh]';

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
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-gunmetal bg-deep shadow-2xl md:flex-row ${panelClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-dialog-title-${project.id}`}
      >
        <div ref={contentRef} className={`custom-scrollbar h-full max-h-[50vh] w-full overflow-y-auto border-b border-gunmetal p-8 md:border-r md:border-b-0 ${leftClass}`}>
          <div className="mb-8">
            <h3 id={`project-dialog-title-${project.id}`} className="mb-4 text-3xl font-bold leading-tight text-ink">
              {project.title}
            </h3>

            {hasWidgetNavigation && (
              <div className="mb-6 flex items-center justify-between rounded-full border border-gunmetal bg-void px-2 py-2">
                <button
                  type="button"
                  onClick={showPreviousWidget}
                  aria-label={t('projects.previousWidget')}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-signal hover:text-void"
                >
                  <i className="fa-solid fa-arrow-left" />
                </button>
                <span className="text-sm font-medium text-fog">
                  {t('projects.widgetCounter', { current: activeWidgetIndex + 1, total: widgetCount })}
                </span>
                <button
                  type="button"
                  onClick={showNextWidget}
                  aria-label={t('projects.nextWidget')}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-signal hover:text-void"
                >
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <Motion.div
                key={activeWidget?.id ?? project.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 flex flex-wrap gap-2">
                  {activeTech.map((tech) => <TechBadge key={tech} text={tech} />)}
                </div>

                {activeDetails && (
                  <div className="mb-7 rounded-xl border border-gunmetal bg-void p-5">
                    <h4 className="text-xl font-bold leading-snug text-ink">{activeDetails.title}</h4>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div>
                        <dt className="font-medium text-muted">{t('projects.environmentLabel')}</dt>
                        <dd className="mt-1 text-fog">{activeDetails.environment}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted">{t('projects.technologiesLabel')}</dt>
                        <dd className="mt-1 text-fog">{activeTech.join(', ')}</dd>
                      </div>
                    </dl>
                  </div>
                )}

                <p className="whitespace-pre-line text-[15px] leading-relaxed text-fog">{activeContent.description}</p>

                {activeWidget?.image && (
                  <img
                    src={activeWidget.image}
                    alt={activeWidget.imageAlt ?? activeDetails?.title ?? project.title}
                    className="mt-5 w-full max-w-[17rem] rounded-lg border border-gunmetal object-contain"
                  />
                )}

                {activeDetails && (
                  <div className="mt-8 border-t border-gunmetal pt-8">
                    <h5 className="text-base font-bold text-ink">{t('projects.summaryLabel')}</h5>
                    <p className="mt-2 text-[15px] leading-relaxed text-fog">{activeDetails.summary}</p>

                    <div className="mt-7">
                      <h5 className="text-base font-bold text-ink">{t('projects.featuresLabel')}</h5>
                      <div className="mt-4 space-y-5">
                        {activeDetails.features.map((feature) => (
                          <section key={feature.title}>
                            <h6 className="text-[15px] font-bold text-ink">{feature.title}</h6>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-fog">{feature.description}</p>
                            {feature.items && (
                              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-fog marker:text-signal">
                                {feature.items.map((item) => <li key={item}>{item}</li>)}
                              </ul>
                            )}
                          </section>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-gunmetal px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-signal"
          >
            <i className="fa-solid fa-arrow-left" />
            {t('projects.close')}
          </button>
        </div>

        <div className={`relative h-[50vh] min-h-0 w-full bg-void ${rightClass}`}>
          <AnimatePresence mode="wait" initial={false}>
            <Motion.div
              key={activeWidget?.id ?? project.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full"
            >
              {activeWidget?.demoId ? (
                <DemoRenderer projectId={project.id} demoId={activeWidget.demoId} />
              ) : activeWidget?.image ? (
                <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
                  <img
                    src={activeWidget.image}
                    alt={activeWidget.imageAlt ?? activeDetails?.title ?? project.title}
                    className="max-h-full w-full rounded-xl border border-gunmetal object-contain shadow-2xl"
                  />
                </div>
              ) : (
                <DemoRenderer projectId={activeContent.demoProjectId ?? project.id} />
              )}
            </Motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={t('projects.close')}
          className="absolute top-4 right-4 z-[500] flex h-10 w-10 items-center justify-center rounded-full border border-gunmetal bg-deep/85 text-ink shadow-lg backdrop-blur-md transition-colors hover:border-signal hover:bg-signal hover:text-void"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>
      </Motion.div>
    </div>,
    document.body,
  );
}

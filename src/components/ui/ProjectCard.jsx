import React from 'react';

export default function ProjectCard({ project, onClick, t }) {
  const titleId = `project-card-title-${project.id}`;

  return (
    <article aria-labelledby={titleId} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gunmetal bg-deep transition-colors hover:border-signal/60">
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-label={`${t('projects.viewProject')}: ${project.title}`}
        className="relative block w-full overflow-hidden bg-void text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-signal"
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          width="1280"
          height="720"
          className="aspect-video w-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
        />
        <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/85 px-3 py-1.5 text-xs font-medium text-white">
          {t(project.featured ? 'projects.liveDemo' : 'projects.interactiveExample')}
        </span>
      </button>

      <div className={`flex flex-1 flex-col ${project.featured ? 'p-6 sm:p-8' : 'p-6'}`}>
        <h5 id={titleId} className={`font-bold leading-snug text-ink ${project.featured ? 'text-2xl' : 'text-xl'}`}>
          {project.title}
        </h5>
        <p className="mt-3 text-base leading-relaxed text-fog">{project.cardDescription ?? project.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
          <button
            type="button"
            onClick={onClick}
            aria-haspopup="dialog"
            aria-label={`${t(project.featured ? 'projects.viewDemo' : 'projects.viewProject')}: ${project.title}`}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${project.featured ? 'bg-signal text-void hover:bg-deep-signal' : 'border border-gunmetal text-ink hover:border-signal hover:text-signal'}`}
          >
            {t(project.featured ? 'projects.viewDemo' : 'projects.viewProject')}
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
          {project.externalUrl && (
            <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-fog transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">
              {t('projects.openNewTab')}
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

import React from 'react';
import TechBadge from './TechBadge';

export default function ProjectCard({ project, onClick, t }) {
  const titleId = `project-card-title-${project.id}`;

  return (
    <article aria-labelledby={titleId} className="project-card group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gunmetal bg-deep hover:border-signal/60">
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-label={`${t('projects.viewProject')}: ${project.title}`}
        className="project-cover relative block w-full overflow-hidden text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-signal"
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          width="1280"
          height="720"
          className={`relative aspect-video w-full rounded-lg object-cover object-center shadow-lg transition-[transform,filter] duration-500 motion-safe:group-hover:scale-[1.015] ${project.featured ? 'project-screenshot' : ''}`}
        />
        <span className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-black/85 px-3 py-1 text-xs font-medium text-white sm:bottom-7 sm:left-7">
          {project.cardLabel ?? t(project.featured ? 'projects.liveDemo' : 'projects.interactiveExample')}
        </span>
      </button>

      <div className={`flex flex-1 flex-col ${project.featured ? 'p-5' : 'p-6'}`}>
        <h5 id={titleId} className="text-xl font-bold leading-snug text-ink">
          {project.title}
        </h5>
        <p className={`mt-3 leading-relaxed text-fog ${project.featured ? 'text-sm' : 'text-base'}`}>{project.cardDescription ?? project.description}</p>
        {project.tags && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => <TechBadge key={tag} text={tag} />)}
          </div>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
            <button
              type="button"
              onClick={onClick}
              aria-haspopup="dialog"
              aria-label={`${project.actionLabel ?? t(project.featured ? 'projects.viewDemo' : 'projects.viewProject')}: ${project.title}`}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${project.featured ? 'bg-signal text-neutral-950 hover:bg-deep-signal' : 'border border-gunmetal text-ink hover:border-signal hover:text-signal'}`}
            >
              {project.actionLabel ?? t(project.featured ? 'projects.viewDemo' : 'projects.viewProject')}
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

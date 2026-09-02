import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProjectCard from '../ui/ProjectCard';
import ProjectModal from '../ui/ProjectModal';
import { getProjects } from '../../data/projectsData';
import { useTranslation } from 'react-i18next';

export default function Projects() {
  const { t } = useTranslation();
  const [activeProject, setActiveProject] = useState(null);
  
  const projects = getProjects(t);

  return (
    <section id="projects" className="py-24 px-6 max-w-[1344px] mx-auto">
      <div className="mb-4">
        <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">{t('projects.badge')}</span>
      </div>
      <div className="mb-14">
        <h3 className="text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight">{t('projects.title')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => setActiveProject(project)}
            t={t}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            key={activeProject.id}
            project={activeProject}
            onClose={() => setActiveProject(null)}
            t={t}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

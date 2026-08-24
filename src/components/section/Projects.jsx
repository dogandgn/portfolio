import React, { useState } from 'react';
import ProjectCard from '../ui/ProjectCard';
import ProjectModal from '../ui/ProjectModal';
import { projects } from '../../data/projectsData';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="py-20 px-6 max-w-[1344px] mx-auto">
      <div className="mb-12">
        <h2 className="text-muted text-xs font-medium uppercase tracking-[0.84px] mb-2">Portfolyo</h2>
        <h3 className="text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight">Öne Çıkan Projeler</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <ProjectCard 
            key={proj.id} 
            project={proj} 
            onClick={() => setSelectedProject(proj)} 
          />
        ))}
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
}
import React, { useState } from 'react';
import ProjectCard from '../ui/ProjectCard';
import ProjectModal from '../ui/ProjectModal';
import { projects } from '../../data/projectsData';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-sky-400 font-semibold tracking-widest uppercase mb-2 text-sm">Portfolyo</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-white">Öne Çıkan Projeler</h3>
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
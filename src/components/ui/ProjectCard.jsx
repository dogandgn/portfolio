import React from 'react';
import Tilt from 'react-parallax-tilt';
import TechBadge from './TechBadge';

export default function ProjectCard({ project, onClick }) {
  return (
    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.15} glareBorderRadius="1rem" className="h-full">
      <div 
        onClick={onClick}
        className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl h-full flex flex-col overflow-hidden transition-colors duration-300 hover:border-sky-500/50 hover:bg-slate-800/80 cursor-pointer group"
      >
        
        {project.image && (
          <div className="w-full h-48 overflow-hidden relative">
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
            />
          </div>
        )}

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">{project.title}</h3>
          <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.map((techName, index) => (
              <TechBadge key={index} text={techName} />
            ))}
          </div>
        </div>

      </div>
    </Tilt>
  );
}
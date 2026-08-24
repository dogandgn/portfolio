import React from 'react';
import Tilt from 'react-parallax-tilt';
import TechBadge from './TechBadge';

export default function ProjectCard({ project, onClick }) {
  return (
    <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable={true} glareMaxOpacity={0.06} glareColor="#c9a227" glareBorderRadius="16px" className="h-full">
      <div 
        onClick={onClick}
        className="bg-deep border border-gunmetal rounded-2xl h-full flex flex-col overflow-hidden transition-colors duration-300 hover:border-signal/60 cursor-pointer group"
      >
        
        {project.image && (
          <div className="w-full h-48 overflow-hidden relative">
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-deep to-transparent z-10"></div>
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
            />
          </div>
        )}

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-base font-bold text-ink mb-3 group-hover:text-signal transition-colors">{project.title}</h3>
          <p className="text-ash text-sm mb-6 flex-grow leading-relaxed line-clamp-3">{project.description}</p>
          
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tech.map((techName, index) => (
              <TechBadge key={index} text={techName} />
            ))}
          </div>
        </div>

      </div>
    </Tilt>
  );
}
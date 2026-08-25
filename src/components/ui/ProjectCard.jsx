import React from 'react';
import Tilt from 'react-parallax-tilt';
import TechBadge from './TechBadge';

export default function ProjectCard({ project, onClick, t }) {
  return (
    <Tilt
      tiltMaxAngleX={4}
      tiltMaxAngleY={4}
      scale={1.01}
      transitionSpeed={2500}
      glareEnable={true}
      glareMaxOpacity={0.15}
      glareColor="#c9a227"
      glarePosition="all"
      className="h-full"
    >
      <div 
        onClick={onClick}
        className="group relative flex flex-col h-full bg-deep rounded-2xl border border-gunmetal overflow-hidden cursor-pointer hover:border-signal/50 transition-colors"
      >
        <div className="relative h-64 overflow-hidden bg-void/50">
          <div className="absolute inset-0 bg-void mix-blend-overlay opacity-20"></div>
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h4 className="text-2xl font-bold text-ink mb-2 drop-shadow-md">{project.title}</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.slice(0, 3).map((t, i) => (
                <TechBadge key={i} text={t} />
              ))}
              {project.tech.length > 3 && (
                <span className="px-2.5 py-1 bg-void/80 border border-gunmetal rounded text-[11px] text-fog font-medium backdrop-blur-sm">
                  +{project.tech.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col justify-between">
          <p className="text-[15px] text-fog leading-relaxed line-clamp-3 mb-6">
            {project.description}
          </p>
          
          <div className="flex items-center text-sm font-medium text-signal group-hover:text-deep-signal transition-colors">
            <span>{t('projects.viewProject')}</span>
            <i className="fa-solid fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      </div>
    </Tilt>
  );
}
import React from 'react';
import { getExperiences, getEducation } from '../../data/resumeData';
import { useTranslation } from 'react-i18next';

export default function Experience() {
  const { t } = useTranslation();
  const experiences = getExperiences(t);
  const education = getEducation(t);

  return (
    <section id="experience" className="py-24 px-6 max-w-[1344px] mx-auto">
      
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Deneyim */}
        <div className="lg:w-2/3">
          <div className="mb-4">
            <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">{t('experience.badge')}</span>
          </div>
          <div className="mb-12">
            <h3 className="text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight mb-2">{t('experience.title')}</h3>
            <span className="text-signal font-medium">{t('experience.titleDate')}</span>
          </div>

          <div className="relative border-l border-gunmetal/60 ml-3 md:ml-4 space-y-12">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-8 md:pl-12 group">
                <div className="absolute w-3 h-3 bg-signal rounded-full -left-[6.5px] top-2 ring-4 ring-void group-hover:scale-125 group-hover:bg-deep-signal transition-all"></div>
                
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                  <h4 className="text-xl font-bold text-ink tracking-tight">{exp.title}</h4>
                  <span className="text-sm font-medium text-signal mt-1 md:mt-0">{exp.date}</span>
                </div>
                
                <div className="text-sm font-medium text-muted mb-4 tracking-wide">{exp.category}</div>
                
                <ul className="space-y-2 mb-6">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-fog text-[15px] leading-relaxed relative pl-4">
                      <span className="absolute left-0 top-2.5 w-1 h-1 bg-pewter rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-1.5">
                  {exp.tech.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 bg-void border border-gunmetal rounded text-[11px] text-fog font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eğitim */}
        <div className="lg:w-1/3 mt-16 lg:mt-0">
          <div className="mb-4">
            <span className="text-muted text-xs font-medium uppercase tracking-[0.84px]">{t('experience.eduBadge')}</span>
          </div>
          <h3 className="text-3xl md:text-[32px] font-bold text-ink leading-snug tracking-tight mb-12">{t('experience.eduTitle')}</h3>

          <div className="space-y-8">
            {education.map((edu) => (
              <div key={edu.id} className="bg-deep p-6 rounded-2xl border border-gunmetal">
                <span className="text-xs font-bold text-signal tracking-wide mb-2 block">{edu.date}</span>
                <h4 className="text-lg font-bold text-ink mb-1">{edu.department}</h4>
                <div className="text-sm font-medium text-fog mb-3">{edu.school} • {edu.faculty}</div>
                <p className="text-[15px] text-muted leading-relaxed">
                  {edu.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}

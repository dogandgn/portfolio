import { getEducation, getExperiences } from '../../data/resumeData';
import { getWorkAreas } from '../../data/workAreasData';
import { landmarks } from './cityLayout';

function SectionLink({ id, children }) {
  return (
    <a className="city-text-link" href={`#city-${id}`}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function AboutContent({ t }) {
  return (
    <>
      <h2 id="city-heading-about">{t('about.badge')}</h2>
      <p className="city-description">{t('about.p1')}</p>
      <p className="city-description">{t('about.p2')}</p>
      <div className="city-disclosures">
        <details>
          <summary>{t('experience.badge')}</summary>
          <h3>{t('experience.title')}</h3>
          <p className="city-meta">{t('experience.titleDate')}</p>
          {getExperiences(t).map((experience) => (
            <article key={experience.id}>
              <h4>{experience.title}</h4>
              <ul>
                {experience.description.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
              <div className="city-tags">
                {experience.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </details>
        <details>
          <summary>{t('experience.eduBadge')}</summary>
          {getEducation(t).map((education) => (
            <article key={education.id}>
              <h3>{education.school}</h3>
              <p>
                {education.faculty} · {education.department}
              </p>
              <p className="city-meta">{education.date}</p>
              <p>{education.description}</p>
            </article>
          ))}
        </details>
        <details>
          <summary>{t('techstack.title')}</summary>
          <ul>
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <li key={number}>{t(`techstack.c${number}`)}</li>
            ))}
          </ul>
        </details>
      </div>
      <a
        className="city-text-link"
        href="/cv.jpg"
        target="_blank"
        rel="noreferrer"
      >
        {t('hero.cv')} ↗
      </a>
    </>
  );
}

export default function CityStopContent({ stop, projects, t, onOpen }) {
  const project = projects.find((item) => item.id === stop.projectId);
  if (project)
    return (
      <>
        <h2 id={`city-heading-${stop.id}`}>
          {t(`city.stops.${stop.id}`)}
          <span className="city-title-dot">.</span>
        </h2>
        {typeof project.id === 'number' && (
          <p className="city-subtitle">{project.title}</p>
        )}
        <p className="city-description">{project.cardDescription}</p>
        <div className="city-tags">
          {project.tech.slice(0, 4).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <button className="city-button" onClick={() => onOpen(project.id)}>
          {t('city.open')} <span>↗</span>
        </button>
        <SectionLink id="projects">{t('city.allProjects')}</SectionLink>
        <p className="city-hint">{t('city.select')}</p>
      </>
    );

  switch (stop.id) {
    case 'overview':
      return (
        <>
          <p className="city-person">Doğan Ariç</p>
          <h1 id="city-title" tabIndex={-1}>
            {t('city.title')}
          </h1>
          <p className="city-description">{t('hero.description')}</p>
          <a className="city-button" href="#city-about">
            {t('city.explore')} <span>↗</span>
          </a>
          <SectionLink id="projects">{t('hero.viewWork')}</SectionLink>
          <p className="city-scroll">
            {t('city.scroll')} <span>↓</span>
          </p>
        </>
      );
    case 'about':
      return <AboutContent t={t} />;
    case 'projects':
      return (
        <>
          <h2 id="city-heading-projects">{t('city.stops.projects')}</h2>
          <p className="city-description">{t('city.projectsIntro')}</p>
          <ol className="city-project-index">
            {landmarks.map((building, index) => (
              <li key={building.id}>
                <a href={`#city-${building.id}`}>
                  <span className="city-meta">0{index + 1}</span>
                  <span>{t(`city.stops.${building.id}`)}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ol>
          <p className="city-hint">{t('city.projectsHint')}</p>
        </>
      );
    case 'services':
      return (
        <>
          <h2 id="city-heading-services">{t('workAreas.title')}</h2>
          <p className="city-description">{t('workAreas.intro')}</p>
          <div className="city-disclosures city-service-list">
            {getWorkAreas(t).map((area, index) => (
              <details key={area.id}>
                <summary>
                  <span className="city-meta">0{index + 1}</span>
                  {area.title}
                </summary>
                <p>{area.description}</p>
              </details>
            ))}
          </div>
          <SectionLink id="contact">{t('hero.contact')}</SectionLink>
        </>
      );
    case 'contact':
      return (
        <>
          <h2 id="city-heading-contact">
            {t('contact.badge')}
            <span className="city-title-dot">.</span>
          </h2>
          <p className="city-description">{t('city.contactIntro')}</p>
          <a className="city-contact-email" href="mailto:doganaric@gmail.com">
            doganaric@gmail.com <span>↗</span>
          </a>
          <a className="city-text-link" href="tel:+905392032768">
            +90 539 203 27 68
          </a>
          <div className="city-socials">
            <a
              href="https://github.com/dogandgn"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/doganaric"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
          </div>
          <SectionLink id="overview">{t('city.backToStart')}</SectionLink>
        </>
      );
    default:
      return null;
  }
}

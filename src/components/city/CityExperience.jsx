import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { getProjects } from '../../data/projectsData';
import {
  cityStops,
  districts,
  getJourneyProgress,
  landmarks,
  finaleBuildings,
} from './cityLayout';
import CityStopContent from './CityStopContent';
import './city.css';
import { qgisPlugins } from '../../data/qgisPlugins';

const ProjectModal = lazy(() => import('../ui/ProjectModal'));
const chapters = ['overview', 'about', 'projects', 'services', 'contact'];

export default function CityExperience({ onReturn, onReady, onUnavailable }) {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const mainRef = useRef(null);
  const markersRef = useRef(new Map());
  const returnRef = useRef(onReturn);
  const restartTimer = useRef(null);
  const restartFrame = useRef(null);
  const [restarting, setRestarting] = useState(false);
  const [status, setStatus] = useState('loading');
  const [activeStop, setActiveStop] = useState(0);
  const [projectId, setProjectId] = useState(null);
  const [pluginId, setPluginId] = useState(qgisPlugins[0]?.id);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );
  const openProject = useCallback((id, itemId) => {
    if (id === 'qgis' && itemId) setPluginId(itemId);
    setProjectId(id);
  }, []);
  const closeProject = useCallback(() => setProjectId(null), []);
  const restart = useCallback(() => {
    if (restartTimer.current !== null) return;
    const reset = () => {
      restartTimer.current = null;
      const url = new URL(window.location.href);
      url.hash = 'city-overview';
      window.history.replaceState(window.history.state, '', url);
      window.scrollTo({ top: 0, behavior: 'instant' });
      sceneRef.current?.setProgress(0, true);
      setActiveStop(0);
      setProjectId(null);
      mainRef.current?.querySelector('h1')?.focus({ preventScroll: true });
      restartFrame.current = requestAnimationFrame(() => {
        setRestarting(false);
        restartFrame.current = null;
      });
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) reset();
    else {
      setRestarting(true);
      restartTimer.current = window.setTimeout(reset, 260);
    }
  }, []);
  const runAction = useCallback(
    (id) => {
      if (id === 'restart') restart();
      else if (id === 'return') returnRef.current();
    },
    [restart],
  );
  const goToProject = useCallback(
    (id, itemId) => {
      const stop = cityStops.find((item) => item.projectId === id);
      if (!stop) return;
      const section = document.getElementById(`city-${stop.id}`);
      if (!section) return;
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      section.scrollIntoView({
        behavior: reducedMotion ? 'instant' : 'smooth',
        block: 'start',
      });
      const url = new URL(window.location.href);
      url.hash = section.id;
      window.history.replaceState(window.history.state, '', url);
      if (id === 'qgis') openProject(id, itemId);
    },
    [openProject],
  );

  useEffect(() => {
    returnRef.current = onReturn;
  }, [onReturn]);
  useEffect(
    () => () => {
      window.clearTimeout(restartTimer.current);
      cancelAnimationFrame(restartFrame.current);
    },
    [],
  );

  useEffect(() => {
    if (status === 'failed') {
      onUnavailable?.();
      return;
    }
    if (status !== 'ready') return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => onReady?.());
    });
    return () => cancelAnimationFrame(frame);
  }, [status, onReady, onUnavailable]);

  useEffect(() => {
    mainRef.current.querySelector('h1')?.focus({ preventScroll: true });
    let cancelled = false;
    let engine;
    let offsets = [];
    const sections = [...mainRef.current.querySelectorAll('[data-stop]')];
    function updateProgress() {
      engine?.setProgress(getJourneyProgress(window.scrollY, offsets));
    }
    function measure() {
      offsets = sections.map((section) => section.offsetTop);
      updateProgress();
    }
    const resizeObserver = new ResizeObserver(measure);
    sections.forEach((section) => resizeObserver.observe(section));
    measure();
    import('./createCityScene')
      .then(({ createCityScene }) => {
        if (cancelled) return;
        try {
          engine = createCityScene(canvasRef.current, {
            onSelect: goToProject,
            onAction: runAction,
            onFailure: () => {
              engine?.dispose();
              sceneRef.current = null;
              setStatus('failed');
            },
            onPositions: (positions) =>
              positions.forEach(({ id, x, y, visible }) => {
                const marker = markersRef.current.get(id);
                if (!marker) return;
                if (id.startsWith('action-')) {
                  marker.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
                  marker.style.visibility =
                    visible &&
                    x > 110 &&
                    x < window.innerWidth - 110 &&
                    y > 140 &&
                    y < window.innerHeight - 95
                      ? 'visible'
                      : 'hidden';
                  return;
                }
                const labelX = Math.max(x, window.innerWidth * 0.39 + 70);
                marker.style.transform = `translate(${labelX}px, ${y}px) translate(-50%, -100%)`;
                marker.style.setProperty(
                  '--marker-anchor-x',
                  `${x - labelX}px`,
                );
                marker.style.visibility =
                  visible &&
                  x > window.innerWidth * 0.33 &&
                  x < window.innerWidth - 65 &&
                  y > 105 &&
                  y < window.innerHeight - 90
                    ? 'visible'
                    : 'hidden';
              }),
          });
          sceneRef.current = engine;
          engine.setTheme(document.documentElement.classList.contains('dark'));
          setStatus('ready');
          updateProgress();
        } catch {
          setStatus('failed');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('failed');
      });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActiveStop(Number(entry.target.dataset.stop));
        });
      },
      { rootMargin: '-40% 0px -40% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelled = true;
      observer.disconnect();
      resizeObserver.disconnect();
      engine?.dispose();
      sceneRef.current = null;
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', measure);
    };
  }, [goToProject, runAction]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    sceneRef.current?.setTheme(dark);
  }, [dark]);
  useEffect(() => {
    sceneRef.current?.setPaused(projectId !== null && projectId !== 'qgis');
  }, [projectId, status]);
  useEffect(() => {
    sceneRef.current?.setActiveProject(
      projectId ?? cityStops[activeStop].projectId,
    );
  }, [activeStop, projectId, status]);
  useEffect(() => {
    sceneRef.current?.setActivePlugin(pluginId);
  }, [pluginId, status]);
  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage;
  }, [i18n.resolvedLanguage]);

  const projects = getProjects(t);
  const selectedProject = projects.find((project) => project.id === projectId);
  const language = i18n.resolvedLanguage === 'en' ? 'en' : 'tr';
  const active = cityStops[activeStop];
  const showMarkers =
    active.id === 'projects' && status === 'ready' && !selectedProject;
  const showDistricts =
    active.id === 'overview' && status === 'ready' && !selectedProject;
  const chapterIndex = chapters.indexOf(
    active.chapter === 'intro' ? 'overview' : active.chapter,
  );
  const projectIndex = landmarks.findIndex(
    (building) => building.id === active.id,
  );
  const immersive = active.id === 'street' || active.id === 'finish';
  const finishing = active.id === 'finish';

  return (
    <div
      className={`city-experience ${dark ? 'city-night' : ''} ${immersive ? 'city-immersive' : ''} ${restarting ? 'city-restarting' : ''}`}
    >
      <a className="city-skip" href="#city-projects">
        {t('city.skip')}
      </a>
      <canvas
        ref={canvasRef}
        className={`city-canvas ${status === 'failed' ? 'city-canvas-hidden' : ''}`}
        aria-label={t('city.canvas')}
      />
      <div className="city-vignette" aria-hidden="true" />
      <header className="city-header">
        <button className="city-brand" onClick={() => onReturn()}>
          <span>DA</span>
          <span>Doğan Ariç</span>
        </button>
        <nav aria-label={t('city.explore')}>
          <button className="city-return" onClick={() => onReturn()}>
            ↖ <span>{t('city.return')}</span>
          </button>
          <button
            aria-label={
              language === 'tr' ? 'Switch to English' : 'Türkçeye geç'
            }
            onClick={() => i18n.changeLanguage(language === 'tr' ? 'en' : 'tr')}
          >
            {language.toUpperCase()}
          </button>
          <button
            aria-label={t(dark ? 'city.light' : 'city.dark')}
            onClick={() => setDark((value) => !value)}
          >
            {dark ? '☀' : '◐'}
          </button>
        </nav>
      </header>
      {status !== 'ready' && (
        <p className="city-status" role="status">
          {t(status === 'failed' ? 'city.fallback' : 'city.loading')}
        </p>
      )}
      <div className="city-markers" hidden={!showMarkers}>
        {landmarks.map((building, index) => (
          <a
            key={building.id}
            ref={(node) => {
              if (node) markersRef.current.set(building.id, node);
              else markersRef.current.delete(building.id);
            }}
            className="city-marker"
            href={`#city-${building.id}`}
          >
            <span>0{index + 1}</span>
            {t(`city.marker.${building.id}`)}
          </a>
        ))}
      </div>
      <div className="city-markers" hidden={!showDistricts}>
        {districts.map((district, index) => (
          <a
            key={district.id}
            ref={(node) => {
              const id = `district-${district.id}`;
              if (node) markersRef.current.set(id, node);
              else markersRef.current.delete(id);
            }}
            className="city-marker city-district-marker"
            href={`#city-${district.id}`}
          >
            <span>0{index + 1}</span>
            {t(`city.chapters.${district.chapter}`)}
          </a>
        ))}
      </div>
      <main ref={mainRef} className="city-journey" id="city-main">
        {cityStops.map((stop, index) => (
          <section
            key={stop.id}
            className={`city-stop city-stop-${stop.id}`}
            id={`city-${stop.id}`}
            data-stop={index}
            aria-labelledby={
              index === 0 ? 'city-title' : `city-heading-${stop.id}`
            }
          >
            <div className="city-copy">
              <p className="city-eyebrow">
                {stop.id === 'street'
                  ? t('city.streetEyebrow')
                  : stop.id === 'finish'
                    ? t('city.finishEyebrow')
                    : index === 0
                      ? t('city.eyebrow')
                      : `${String(chapters.indexOf(stop.chapter) + 1).padStart(2, '0')} / ${t(`city.chapters.${stop.chapter}`)}${stop.projectId != null ? ` · ${landmarks.findIndex((building) => building.id === stop.id) + 1} / ${landmarks.length}` : ''}`}
              </p>
              <CityStopContent
                stop={stop}
                projects={projects}
                t={t}
                onOpen={openProject}
                activePluginId={pluginId}
              />
            </div>
          </section>
        ))}
      </main>
      <div
        className="city-finale-actions"
        role="group"
        aria-label={t('city.finaleActions')}
        hidden={!finishing || selectedProject || status !== 'ready'}
      >
        {finaleBuildings.map((building) => (
          <button
            key={building.id}
            type="button"
            className="city-finale-action"
            ref={(node) => {
              const id = `action-${building.id}`;
              if (node) markersRef.current.set(id, node);
              else markersRef.current.delete(id);
            }}
            onClick={() => runAction(building.id)}
            onMouseEnter={() => sceneRef.current?.setActionHover(building.id)}
            onMouseLeave={() => sceneRef.current?.setActionHover(null)}
            onFocus={() => sceneRef.current?.setActionHover(building.id)}
            onBlur={() => sceneRef.current?.setActionHover(null)}
          >
            <span>
              {t(building.id === 'restart' ? 'city.restart' : 'city.return')}
            </span>
            <span aria-hidden="true">
              {building.id === 'restart' ? '↻' : '↗'}
            </span>
          </button>
        ))}
      </div>
      {active.chapter === 'projects' && (
        <nav
          className="city-project-nav"
          aria-label={t('city.chapters.projects')}
        >
          {landmarks.map((building, index) => (
            <a
              key={building.id}
              href={`#city-${building.id}`}
              aria-current={active.id === building.id ? 'step' : undefined}
            >
              <span>0{index + 1}</span>
              {t(`city.marker.${building.id}`)}
            </a>
          ))}
        </nav>
      )}
      <footer className="city-hud">
        <span className="city-eyebrow">
          {String(chapterIndex + 1).padStart(2, '0')} / 05 —{' '}
          {t(`city.chapters.${active.chapter}`)}
          {projectIndex >= 0 && (
            <span className="city-substep">
              {String(projectIndex + 1).padStart(2, '0')} /{' '}
              {String(landmarks.length).padStart(2, '0')} ·{' '}
              {t(`city.marker.${active.id}`)}
            </span>
          )}
        </span>
        <nav aria-label={t('city.sections')}>
          {chapters.map((id, index) => (
            <a
              key={id}
              href={`#city-${id}`}
              aria-current={
                active.chapter === (id === 'overview' ? 'intro' : id)
                  ? 'step'
                  : undefined
              }
            >
              <span>0{index + 1}</span>
              <span className="city-stop-label">
                {t(`city.chapters.${id === 'overview' ? 'intro' : id}`)}
              </span>
            </a>
          ))}
        </nav>
      </footer>
      {selectedProject && (
        <Suspense
          fallback={
            <div className="city-loading-panel" role="status">
              {t('city.loading')}
              <button onClick={closeProject} aria-label={t('projects.close')}>
                ×
              </button>
            </div>
          }
        >
          <ProjectModal
            key={selectedProject.id}
            project={selectedProject}
            onClose={closeProject}
            t={t}
            activeItemId={selectedProject.id === 'qgis' ? pluginId : undefined}
            onItemChange={
              selectedProject.id === 'qgis' ? setPluginId : undefined
            }
          />
        </Suspense>
      )}
    </div>
  );
}

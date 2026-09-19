import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Index from './index';
import CityInvitation from '../city/CityInvitation';
import CityErrorBoundary from '../city/CityErrorBoundary';
import '../city/city.css';

const loadCity = () => import('../city/CityExperience');
const CityExperience = lazy(loadCity);
const isCityLocation = () =>
  new URLSearchParams(window.location.search).get('view') === 'city';
const desktopQuery = window.matchMedia(
  '(min-width: 1024px) and (hover: hover) and (pointer: fine)',
);
const subscribeDesktop = (callback) => {
  desktopQuery.addEventListener('change', callback);
  return () => desktopQuery.removeEventListener('change', callback);
};
const getDesktop = () => desktopQuery.matches;

function ViewPosition({ city, savedScroll, returnSection }) {
  useLayoutEffect(() => {
    if (city) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const section = returnSection.current || window.location.hash.slice(1);
    const target = section && document.getElementById(section);
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: savedScroll.current, behavior: 'instant' });
  }, [city, savedScroll, returnSection]);
  return null;
}

export default function PortfolioExperience() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const desktop = useSyncExternalStore(subscribeDesktop, getDesktop);
  const [city, setCity] = useState(
    () => isCityLocation() && desktopQuery.matches,
  );
  const showCity = city && desktop;
  const savedScroll = useRef(0);
  const returnSection = useRef(null);

  useEffect(() => {
    const update = () => setCity(isCityLocation() && desktopQuery.matches);
    const resize = () => {
      if (!desktopQuery.matches) {
        const url = new URL(window.location.href);
        url.searchParams.delete('view');
        if (url.hash.startsWith('#city-')) url.hash = '';
        window.history.replaceState({}, '', url);
        setCity(false);
      }
    };
    desktopQuery.addEventListener('change', resize);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('popstate', update);
      desktopQuery.removeEventListener('change', resize);
    };
  }, []);

  function navigate(next, section) {
    if (next === showCity || (next && !desktop)) return;
    if (next) savedScroll.current = window.scrollY;
    returnSection.current = section;
    const url = new URL(window.location.href);
    if (next) url.searchParams.set('view', 'city');
    else url.searchParams.delete('view');
    url.hash = section ? `#${section}` : '';
    window.history.pushState({}, '', url);
    setCity(next);
  }

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
    >
      <Motion.div
        key={showCity ? 'city' : 'classic'}
        initial={{
          opacity: 0,
          scale: reducedMotion ? 1 : 0.98,
          filter: reducedMotion ? 'none' : 'blur(5px)',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transitionEnd: { filter: 'none', transform: 'none' },
        }}
        exit={{
          opacity: 0,
          scale: reducedMotion ? 1 : 1.04,
          filter: reducedMotion ? 'none' : 'blur(7px)',
        }}
        transition={{ duration: reducedMotion ? 0 : 0.4 }}
      >
        <ViewPosition city={showCity} savedScroll={savedScroll} returnSection={returnSection} />
        {showCity ? (
          <CityErrorBoundary
            message={t('city.fallback')}
            returnLabel={t('city.return')}
            onReturn={() => navigate(false)}
          >
            <Suspense
              fallback={
                <div className="city-route-loading" role="status">
                  {t('city.loading')}
                </div>
              }
            >
              <CityExperience
                onReturn={(section) => navigate(false, section)}
              />
            </Suspense>
          </CityErrorBoundary>
        ) : (
          <>
            <Index />
            {desktop && (
              <CityInvitation
                onEnter={() => navigate(true)}
                onPrepare={() => {
                  loadCity().catch(() => {});
                }}
              />
            )}
          </>
        )}
      </Motion.div>
    </AnimatePresence>
  );
}

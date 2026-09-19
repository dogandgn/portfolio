import {
  lazy,
  Suspense,
  useCallback,
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
import '../portal/portal.css';

const loadCity = () => import('../city/CityExperience');
const loadPortal = () => import('../portal/runPortalTransition');
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
  const viewRef = useRef(null);
  const portalRef = useRef(null);
  const cityReadyRef = useRef(null);
  const [portalBusy, setPortalBusy] = useState(false);
  const onCityReady = useCallback(() => cityReadyRef.current?.resolve(), []);
  const onCityUnavailable = useCallback(
    () => cityReadyRef.current?.reject(new Error('City unavailable')),
    [],
  );

  useEffect(() => {
    const cancel = () => portalRef.current?.abort();
    const keydown = (event) => {
      if (event.key === 'Escape' && portalRef.current) {
        event.preventDefault();
        cancel();
      }
    };
    const visibility = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener('resize', cancel);
    window.addEventListener('popstate', cancel);
    window.addEventListener('keydown', keydown);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancel();
      window.removeEventListener('resize', cancel);
      window.removeEventListener('popstate', cancel);
      window.removeEventListener('keydown', keydown);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

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

  async function enterCity() {
    if (portalRef.current || showCity || !desktop) return;
    if (reducedMotion) {
      navigate(true);
      return;
    }
    const controller = new AbortController();
    portalRef.current = controller;
    const element = viewRef.current;
    const mascot = element.querySelector('.city-mascot');
    const rect = mascot.getBoundingClientRect();
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const previousScroll = window.scrollY;
    let entered = false;
    setPortalBusy(true);
    try {
      const [{ runPortalTransition }] = await Promise.all([
        loadPortal(),
        loadCity(),
      ]);
      controller.signal.throwIfAborted();
      await runPortalTransition({
        element,
        origin,
        signal: controller.signal,
        onCovered: () =>
          new Promise((resolve, reject) => {
            cityReadyRef.current = { resolve, reject };
            entered = true;
            navigate(true);
          }),
      });
    } catch (error) {
      controller.abort();
      if (entered) {
        const url = new URL(window.location.href);
        url.searchParams.delete('view');
        url.hash = '';
        window.history.replaceState({}, '', url);
        savedScroll.current = previousScroll;
        setCity(false);
      } else if (error.name !== 'AbortError' && desktopQuery.matches) {
        navigate(true);
      }
    } finally {
      portalRef.current = null;
      cityReadyRef.current = null;
      setPortalBusy(false);
      requestAnimationFrame(() => {
        const target =
          document.querySelector('#city-title') ||
          document.querySelector('.city-mascot');
        target?.focus({ preventScroll: true });
      });
    }
  }

  return (
    <>
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
      >
        <Motion.div
          ref={viewRef}
          inert={portalBusy}
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
          <ViewPosition
            city={showCity}
            savedScroll={savedScroll}
            returnSection={returnSection}
          />
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
                  onReady={onCityReady}
                  onUnavailable={onCityUnavailable}
                />
              </Suspense>
            </CityErrorBoundary>
          ) : (
            <>
              <Index />
              {desktop && (
                <CityInvitation
                  onEnter={enterCity}
                  busy={portalBusy}
                  onPrepare={() => {
                    loadCity().catch(() => {});
                    loadPortal().catch(() => {});
                  }}
                />
              )}
            </>
          )}
        </Motion.div>
      </AnimatePresence>
      {portalBusy && (
        <div className="portal-status" role="status">
          {t('city.transitionLoading')}{' '}
          <button onClick={() => portalRef.current?.abort()}>
            {t('city.transitionCancel')}
          </button>
        </div>
      )}
    </>
  );
}

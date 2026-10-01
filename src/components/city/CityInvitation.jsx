import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CityGuide from './CityGuide';

export default function CityInvitation({ onEnter, onPrepare, busy = false }) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <aside
      className="city-invitation"
      aria-label={t('city.enter')}
      aria-busy={busy}
    >
      <button
        className="city-dismiss"
        onClick={() => setDismissed(true)}
        aria-label={t('city.dismiss')}
      >
        ×
      </button>
      <button
        className="city-mascot"
        onClick={onEnter}
        onPointerEnter={onPrepare}
        onFocus={onPrepare}
        aria-label={t('city.enter')}
      >
        <CityGuide />
        <span className="city-mascot-label">{t('city.invitation')}</span>
      </button>
    </aside>
  );
}

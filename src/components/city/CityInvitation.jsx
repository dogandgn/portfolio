import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CityInvitation({ onEnter, onPrepare, busy = false }) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  return (
    <aside className="city-invitation" aria-label={t('city.enter')} aria-busy={busy}>
      {!dismissed && (
        <div className="city-invitation-bubble">
          <button onClick={onEnter}>
            {t('city.invitation')} <span>↗</span>
          </button>
          <button
            className="city-dismiss"
            onClick={() => setDismissed(true)}
            aria-label={t('city.dismiss')}
          >
            ×
          </button>
        </div>
      )}
      <button
        className="city-mascot"
        onClick={onEnter}
        onPointerEnter={onPrepare}
        onFocus={onPrepare}
        aria-label={t('city.enter')}
      >
        <span className="city-miniature" aria-hidden="true">
          <span className="city-mini-route" />
          <span className="city-mini-building building-one" />
          <span className="city-mini-building building-two" />
          <span className="city-mini-building building-three" />
        </span>
        <span className="city-mascot-label">
          3D <span>↗</span>
        </span>
      </button>
    </aside>
  );
}

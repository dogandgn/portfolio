import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CityInvitation({ onEnter, onPrepare, busy = false }) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  const launcher = useRef(null);
  return (
    <aside
      className={`city-invitation${dismissed ? ' is-collapsed' : ''}`}
      aria-label={t('city.enter')}
      aria-busy={busy}
    >
      {!dismissed && (
        <div className="city-invitation-bubble">
          <button
            onClick={onEnter}
            onPointerEnter={onPrepare}
            onFocus={onPrepare}
          >
            <span className="city-invitation-kicker">
              {t('city.invitationLabel')}
            </span>
            <span className="city-invitation-title">
              {t('city.invitation')}
            </span>
            <span className="city-invitation-caption">
              {t('city.invitationHint')} <span aria-hidden="true">↗</span>
            </span>
          </button>
          <button
            className="city-dismiss"
            onClick={() => {
              setDismissed(true);
              launcher.current?.focus();
            }}
            aria-label={t('city.dismiss')}
          >
            ×
          </button>
        </div>
      )}
      <button
        ref={launcher}
        className="city-mascot"
        onClick={onEnter}
        onPointerEnter={onPrepare}
        onFocus={onPrepare}
        aria-label={t('city.enter')}
      >
        <span className="city-portal-ring" aria-hidden="true" />
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

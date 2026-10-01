import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function QgisPluginDemo({ content }) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(content.screenshots[0]?.id);
  const selected =
    content.screenshots.find((image) => image.id === selectedId) ??
    content.screenshots[0];

  return (
    <div className="custom-scrollbar min-h-full space-y-5 p-5 text-ink lg:h-full lg:overflow-y-auto md:p-7">
      <header className="pr-10">
        <p className="text-xs font-semibold tracking-widest text-signal">
          QGIS DESKTOP · {content.version}
        </p>
        <h4 className="mt-2 text-xl font-bold">{t('qgis.screens')}</h4>
        <p className="mt-3 text-sm leading-relaxed text-fog">
          {t('qgis.screenHint')}
        </p>
      </header>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={t('qgis.screens')}
      >
        {content.screenshots.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedId(image.id)}
            aria-pressed={selected.id === image.id}
            className={`rounded-full border px-3 py-2 text-sm transition-colors ${selected.id === image.id ? 'border-signal bg-signal/15 text-ink' : 'border-gunmetal text-fog hover:border-signal'}`}
          >
            {t(`qgis.${image.id}`)}
          </button>
        ))}
      </div>
      <figure className="overflow-hidden rounded-xl border border-gunmetal bg-deep">
        <a
          href={selected.src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('qgis.openImage')}
        >
          <img
            src={selected.src}
            alt={`${content.details.title} — ${t(`qgis.${selected.id}`)}`}
            className="block h-auto w-full"
          />
        </a>
        <figcaption className="p-3 text-sm text-fog">
          {t(`qgis.${selected.id}`)} · {t('qgis.openImage')} ↗
        </figcaption>
      </figure>
      <a
        href={content.repositoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gunmetal px-4 py-2 text-sm hover:border-signal"
      >
        {t('qgis.repository')} <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

export default function ProjectPreview({ content }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-5 bg-void px-4 py-12 sm:px-8">
      <img
        src={content.screenshot}
        alt={content.title}
        width="1920"
        height="861"
        className="h-auto w-full max-w-6xl rounded-lg border border-gunmetal shadow-lg"
      />
      <a
        href={content.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
      >
        {content.actionLabel}
        <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
      </a>
    </div>
  );
}

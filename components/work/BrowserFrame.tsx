/**
 * Minimal reimplementation of the handoff's browser-window.jsx (352 lines
 * of prototype scaffolding) — a rounded container with a 36px title bar
 * (three dots + a URL pill) clipping its children. The frame chrome itself
 * always has a border via border-line; the dark-mode-only reinforcement so
 * a light screenshot doesn't glare (brief requirement) is applied to the
 * image wrapper directly, in ScreensSection.tsx.
 */
export function BrowserFrame({
  url,
  children,
}: {
  url?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface dark:border-line">
      <div className="flex h-9 items-center gap-2 border-b border-line bg-sunken px-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        {url && (
          <span className="ml-2 truncate rounded-full bg-surface px-3 py-0.5 text-xs text-subtle">
            {url}
          </span>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

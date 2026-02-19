"use client";

interface HeroProps {
  title: string;
  subtitle: string;
  onExport: () => void;
  onReset: () => void;
  hasEdits: boolean;
}

export default function Hero({
  title,
  subtitle,
  onExport,
  onReset,
  hasEdits,
}: HeroProps) {
  return (
    <header className="relative overflow-hidden bg-card border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-cyan/5" />
      <div className="relative max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent tracking-wide uppercase">
            Strategy Document
          </span>
          {hasEdits && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
              Upraveno lokálně
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
          {title}
        </h1>

        <p className="text-muted text-base md:text-lg mb-8 max-w-2xl">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-card text-sm font-medium hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export .md
          </button>

          {hasEdits && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-muted text-sm font-medium hover:bg-background transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Resetovat změny
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

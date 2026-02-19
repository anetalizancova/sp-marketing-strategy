"use client";

interface HeroProps {
  title: string;
  subtitle: string;
  onExport: () => void;
  onReset: () => void;
  hasEdits: boolean;
  sectionCount: number;
}

export default function Hero({
  title,
  subtitle,
  onExport,
  onReset,
  hasEdits,
  sectionCount,
}: HeroProps) {
  return (
    <header className="relative overflow-hidden bg-dark min-h-[420px] flex items-end">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-accent/20 to-dark animate-gradient opacity-80" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/15 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan/10 blur-[100px] animate-pulse-glow" />

      {/* Content */}
      <div className="relative w-full max-w-5xl mx-auto px-6 md:px-8 pb-12 pt-20 md:pt-24">
        {/* Top badges */}
        <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 glass text-white/80 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            Strategy Document
          </span>
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-accent/20 glass text-accent-light border border-accent/20">
            {sectionCount} sekcí
          </span>
          {hasEdits && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-warning/20 glass text-warning border border-warning/20">
              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
              Upraveno lokálně
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          SP™ Superpowered
          <br />
          <span className="gradient-text">Professional</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/50 text-lg md:text-xl max-w-xl mb-10 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {subtitle}
        </p>

        {/* Actions */}
        <div
          className="flex flex-wrap items-center gap-3 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            onClick={onExport}
            className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white text-dark text-sm font-semibold hover:bg-white/90 transition-all cursor-pointer shadow-lg shadow-white/10"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-y-0.5"
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 text-white/70 text-sm font-medium hover:bg-white/5 hover:text-white transition-all cursor-pointer"
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

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </header>
  );
}

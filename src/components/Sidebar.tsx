"use client";

import { useState } from "react";

interface SidebarSection {
  id: string;
  title: string;
}

interface SidebarProps {
  sections: SidebarSection[];
  activeSection: string;
  editedSections: Set<string>;
  commentedSections: Set<string>;
}

function extractNumber(title: string): string {
  const match = title.match(/^(\d+[a-z]?)\./);
  return match ? match[1] : "";
}

function extractLabel(title: string): string {
  return title
    .replace(/^(\d+[a-z]?\.?\s*)/, "")
    .replace(/\s*—.*$/, "")
    .trim();
}

export default function Sidebar({
  sections,
  activeSection,
  editedSections,
  commentedSections,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <nav className="space-y-0.5 px-3">
      {sections.map((section) => {
        const num = extractNumber(section.title);
        const label = extractLabel(section.title);
        const isActive = activeSection === section.id;
        const hasEdit = editedSections.has(section.id);
        const hasComment = commentedSections.has(section.id);

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={() => setMobileOpen(false)}
            className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 ${
              isActive
                ? "bg-accent/10 text-accent-light font-semibold"
                : "text-faint hover:text-foreground hover:bg-foreground/[0.03]"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-accent to-cyan" />
            )}

            <span
              className={`font-mono text-[10px] w-5 text-right shrink-0 ${
                isActive ? "text-accent" : "text-faint/60"
              }`}
            >
              {num}
            </span>

            <span className="truncate">{label}</span>

            {(hasEdit || hasComment) && (
              <span className="ml-auto flex items-center gap-1 shrink-0">
                {hasEdit && (
                  <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                )}
                {hasComment && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                )}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-dark glass border border-white/10 shadow-xl cursor-pointer"
        aria-label="Toggle navigation"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {mobileOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-dark/60 glass z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-card border-r border-border z-40 transition-transform duration-300 ease-out overflow-y-auto ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white text-xs font-extrabold tracking-tight">
                SP
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">SP™ Strategy</p>
              <p className="text-[11px] text-faint">Brainstorming 24.02.</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="py-4">{navContent}</div>

        {/* Legend */}
        <div className="px-6 py-4 mt-auto border-t border-border">
          <div className="flex items-center gap-4 text-[11px] text-faint">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Editováno
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan" />
              Komentář
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

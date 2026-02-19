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

export default function Sidebar({
  sections,
  activeSection,
  editedSections,
  commentedSections,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const shortTitle = (title: string) => {
    const match = title.match(/^(\d+[a-z]?\.?\s*)/);
    const prefix = match ? match[1] : "";
    const rest = title.replace(/^(\d+[a-z]?\.?\s*)/, "");
    const cleaned = rest.replace(/\s*—.*$/, "").trim();
    return { prefix, label: cleaned.length > 30 ? cleaned.slice(0, 28) + "…" : cleaned };
  };

  const navContent = (
    <nav className="space-y-0.5">
      {sections.map((section) => {
        const { prefix, label } = shortTitle(section.title);
        const isActive = activeSection === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={() => setMobileOpen(false)}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              isActive
                ? "bg-accent/10 text-accent font-medium"
                : "text-muted hover:text-foreground hover:bg-border-light"
            }`}
          >
            {prefix && (
              <span className="text-faint text-xs font-mono w-6 shrink-0">
                {prefix.trim()}
              </span>
            )}
            <span className="truncate">{label}</span>
            <span className="ml-auto flex items-center gap-1 shrink-0">
              {editedSections.has(section.id) && (
                <span className="w-2 h-2 rounded-full bg-warning" title="Upraveno" />
              )}
              {commentedSections.has(section.id) && (
                <span className="w-2 h-2 rounded-full bg-cyan" title="Komentář" />
              )}
            </span>
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-md cursor-pointer"
        aria-label="Toggle navigation"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-card border-r border-border z-40 transition-transform duration-200 overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white text-xs font-bold">SP</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">SP™ Strategy</p>
              <p className="text-xs text-faint">24.02.2026</p>
            </div>
          </div>

          {navContent}
        </div>

        <div className="p-5 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-faint">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span>Upraveno</span>
            <span className="w-2 h-2 rounded-full bg-cyan ml-2" />
            <span>Komentář</span>
          </div>
        </div>
      </aside>
    </>
  );
}

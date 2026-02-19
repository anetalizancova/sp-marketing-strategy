"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Section as SectionType } from "@/lib/parseMarkdown";
import type { Comment } from "./Section";
import Hero from "./Hero";
import Sidebar from "./Sidebar";
import Section from "./Section";

interface StrategyPageProps {
  title: string;
  subtitle: string;
  sections: SectionType[];
}

const STORAGE_EDITS = "sp-strategy-edits";
const STORAGE_COMMENTS = "sp-strategy-comments";

type EditsMap = Record<string, string>;
type CommentsMap = Record<string, Comment[]>;

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function StrategyPage({
  title,
  subtitle,
  sections,
}: StrategyPageProps) {
  const [edits, setEdits] = useState<EditsMap>({});
  const [comments, setComments] = useState<CommentsMap>({});
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");
  const [hydrated, setHydrated] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setEdits(loadFromStorage<EditsMap>(STORAGE_EDITS, {}));
    setComments(loadFromStorage<CommentsMap>(STORAGE_COMMENTS, {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_EDITS, JSON.stringify(edits));
  }, [edits, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_COMMENTS, JSON.stringify(comments));
  }, [comments, hydrated]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const handleSaveEdit = useCallback((sectionId: string, content: string) => {
    setEdits((prev) => ({ ...prev, [sectionId]: content }));
  }, []);

  const handleClearEdit = useCallback((sectionId: string) => {
    setEdits((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  }, []);

  const handleAddComment = useCallback(
    (sectionId: string, text: string) => {
      setComments((prev) => ({
        ...prev,
        [sectionId]: [
          ...(prev[sectionId] ?? []),
          { id: crypto.randomUUID(), text, timestamp: Date.now() },
        ],
      }));
    },
    []
  );

  const handleDeleteComment = useCallback(
    (sectionId: string, commentId: string) => {
      setComments((prev) => ({
        ...prev,
        [sectionId]: (prev[sectionId] ?? []).filter(
          (c) => c.id !== commentId
        ),
      }));
    },
    []
  );

  const handleExport = useCallback(() => {
    let md = `# ${title}\n\n**${subtitle}**\n\n---\n\n`;
    for (const section of sections) {
      const content = edits[section.id] ?? section.content;
      md += `## ${section.title}\n\n${content}\n\n---\n\n`;
      const sc = comments[section.id];
      if (sc?.length) {
        md += `> **Komentáře:**\n`;
        for (const c of sc) {
          md += `> - ${c.text} _(${new Date(c.timestamp).toLocaleString("cs-CZ")})_\n`;
        }
        md += "\n";
      }
    }
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SP-MARKETING-STRATEGY-edited.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [title, subtitle, sections, edits, comments]);

  const handleReset = useCallback(() => {
    if (
      window.confirm(
        "Opravdu chcete smazat všechny lokální úpravy a komentáře?"
      )
    ) {
      setEdits({});
      setComments({});
      localStorage.removeItem(STORAGE_EDITS);
      localStorage.removeItem(STORAGE_COMMENTS);
    }
  }, []);

  const editedSections = new Set(Object.keys(edits));
  const commentedSections = new Set(
    Object.entries(comments)
      .filter(([, arr]) => arr.length > 0)
      .map(([key]) => key)
  );
  const hasEdits = editedSections.size > 0 || commentedSections.size > 0;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        editedSections={editedSections}
        commentedSections={commentedSections}
      />

      <div className="lg:ml-64">
        <Hero
          title={title}
          subtitle={subtitle}
          onExport={handleExport}
          onReset={handleReset}
          hasEdits={hasEdits}
          sectionCount={sections.length}
        />

        <main className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-6">
          {sections.map((section, i) => (
            <Section
              key={section.id}
              id={section.id}
              index={i}
              title={section.title}
              originalContent={section.content}
              editedContent={edits[section.id] ?? null}
              comments={comments[section.id] ?? []}
              onSaveEdit={handleSaveEdit}
              onClearEdit={handleClearEdit}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          ))}

          {/* Footer */}
          <footer className="relative py-16 text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent/20" />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center">
                <span className="text-white text-xs font-extrabold">SP</span>
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent/20" />
            </div>
            <p className="text-faint text-sm font-medium">
              SP™ Marketing Strategy
            </p>
            <p className="text-faint/50 text-xs mt-1">
              Aibility &copy; 2026 &mdash; Brainstorming 24.02.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

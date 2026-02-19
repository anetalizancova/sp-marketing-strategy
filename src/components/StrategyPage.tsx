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
  const [activeSection, setActiveSection] = useState(
    sections[0]?.id ?? ""
  );
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

  // Intersection observer for active section tracking
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
      const comment: Comment = {
        id: crypto.randomUUID(),
        text,
        timestamp: Date.now(),
      };
      setComments((prev) => ({
        ...prev,
        [sectionId]: [...(prev[sectionId] ?? []), comment],
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

      const sectionComments = comments[section.id];
      if (sectionComments?.length) {
        md += `> **Komentáře:**\n`;
        for (const c of sectionComments) {
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
    <div className="min-h-screen">
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        editedSections={editedSections}
        commentedSections={commentedSections}
      />

      <div className="lg:ml-72">
        <Hero
          title={title}
          subtitle={subtitle}
          onExport={handleExport}
          onReset={handleReset}
          hasEdits={hasEdits}
        />

        <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">
          {sections.map((section) => (
            <Section
              key={section.id}
              id={section.id}
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

          <footer className="py-12 text-center">
            <p className="text-faint text-sm">
              SP™ Marketing Strategy &mdash; Aibility &copy; 2026
            </p>
            <p className="text-faint/60 text-xs mt-1">
              Další krok: Brainstorming Po 24.02. &rarr; vyřešit otevřené
              otázky &rarr; začít exekuci
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

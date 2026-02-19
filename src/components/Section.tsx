"use client";

import { useState, useRef, useEffect } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

export interface Comment {
  id: string;
  text: string;
  timestamp: number;
}

interface SectionProps {
  id: string;
  index: number;
  title: string;
  originalContent: string;
  editedContent: string | null;
  comments: Comment[];
  onSaveEdit: (sectionId: string, content: string) => void;
  onClearEdit: (sectionId: string) => void;
  onAddComment: (sectionId: string, text: string) => void;
  onDeleteComment: (sectionId: string, commentId: string) => void;
}

function extractNumber(title: string): string {
  const match = title.match(/^(\d+[a-z]?)\./);
  return match ? match[1] : "";
}

function extractLabel(title: string): string {
  return title.replace(/^(\d+[a-z]?\.?\s*)/, "").trim();
}

export default function Section({
  id,
  index,
  title,
  originalContent,
  editedContent,
  comments,
  onSaveEdit,
  onClearEdit,
  onAddComment,
  onDeleteComment,
}: SectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const displayContent = editedContent ?? originalContent;
  const isModified = editedContent !== null;
  const num = extractNumber(title);
  const label = extractLabel(title);

  const handleStartEdit = () => {
    setEditValue(displayContent);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() === originalContent.trim()) {
      onClearEdit(id);
    } else {
      onSaveEdit(id, editValue);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleAddComment = () => {
    if (commentValue.trim()) {
      onAddComment(id, commentValue.trim());
      setCommentValue("");
      setShowCommentInput(false);
    }
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  useEffect(() => {
    if (showCommentInput && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [showCommentInput]);

  return (
    <section
      id={id}
      className="scroll-mt-8 animate-fade-in"
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
    >
      <div
        className={`group relative bg-card rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-accent/[0.04] gradient-border ${
          isModified
            ? "border-warning/30 shadow-warning/[0.04]"
            : "border-border hover:border-border-light"
        }`}
      >
        {/* Section number watermark */}
        {num && (
          <div className="absolute top-4 right-6 font-serif text-[64px] md:text-[80px] font-bold text-foreground/[0.03] leading-none select-none pointer-events-none">
            {num}
          </div>
        )}

        {/* Header */}
        <div className="relative px-6 md:px-8 pt-6 md:pt-8 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              {num && (
                <span className="shrink-0 mt-1 w-7 h-7 rounded-lg bg-gradient-to-br from-accent/10 to-cyan/10 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-accent">
                    {num}
                  </span>
                </span>
              )}
              <div className="min-w-0">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground leading-snug">
                  {label}
                </h2>
                {isModified && (
                  <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-medium text-warning">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                    Upraveno
                  </span>
                )}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {!isEditing && (
                <>
                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted bg-foreground/[0.03] hover:bg-foreground/[0.06] hover:text-foreground transition-all cursor-pointer"
                    title="Upravit sekci"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setShowCommentInput(!showCommentInput)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted bg-foreground/[0.03] hover:bg-foreground/[0.06] hover:text-foreground transition-all cursor-pointer"
                    title="Přidat komentář"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    Comment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Thin gradient divider */}
        <div className="mx-6 md:mx-8 my-2 h-px bg-gradient-to-r from-accent/10 via-cyan/10 to-transparent" />

        {/* Content */}
        <div className="relative px-6 md:px-8 pb-6 md:pb-8">
          {isEditing ? (
            <div className="space-y-3">
              <div className="rounded-xl border-2 border-accent/20 bg-accent/[0.02] overflow-hidden">
                <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  className="w-full p-5 text-sm font-mono leading-relaxed bg-transparent text-foreground resize-none focus:outline-none min-h-[200px]"
                  spellCheck={false}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white text-sm font-semibold hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-accent/20"
                >
                  Uložit
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-5 py-2.5 rounded-xl border border-border text-muted text-sm font-medium hover:bg-background transition-colors cursor-pointer"
                >
                  Zrušit
                </button>
                {isModified && (
                  <button
                    onClick={() => {
                      onClearEdit(id);
                      setIsEditing(false);
                    }}
                    className="ml-auto px-4 py-2.5 rounded-xl text-warning text-sm font-medium hover:bg-warning/10 transition-colors cursor-pointer"
                  >
                    Obnovit originál
                  </button>
                )}
              </div>
            </div>
          ) : (
            <MarkdownRenderer content={displayContent} />
          )}
        </div>

        {/* Comments */}
        {(comments.length > 0 || showCommentInput) && (
          <div className="mx-6 md:mx-8 mb-6 md:mb-8 space-y-3">
            <div className="border-t border-border pt-5">
              <p className="text-[11px] font-bold text-faint uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5 text-cyan"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Komentáře ({comments.length})
              </p>

              <div className="space-y-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="group/comment flex items-start gap-3 p-3.5 rounded-xl bg-cyan/[0.04] border border-cyan/10"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-lg bg-cyan/10 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-cyan"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">
                        {comment.text}
                      </p>
                      <p className="text-[11px] text-faint mt-1.5">
                        {new Date(comment.timestamp).toLocaleString("cs-CZ")}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteComment(id, comment.id)}
                      className="opacity-0 group-hover/comment:opacity-100 p-1.5 rounded-lg text-faint hover:text-warning hover:bg-warning/10 transition-all cursor-pointer"
                      title="Smazat"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {showCommentInput && (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddComment();
                      if (e.key === "Escape") setShowCommentInput(false);
                    }}
                    placeholder="Napište komentář..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan/40 transition-all"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan to-cyan/80 text-white text-sm font-semibold hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-cyan/20"
                  >
                    Přidat
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

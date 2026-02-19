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
  title: string;
  originalContent: string;
  editedContent: string | null;
  comments: Comment[];
  onSaveEdit: (sectionId: string, content: string) => void;
  onClearEdit: (sectionId: string) => void;
  onAddComment: (sectionId: string, text: string) => void;
  onDeleteComment: (sectionId: string, commentId: string) => void;
}

export default function Section({
  id,
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
    <section id={id} className="scroll-mt-6">
      <div
        className={`bg-card rounded-xl border transition-colors ${
          isModified ? "border-warning/40" : "border-border"
        }`}
      >
        {/* Section header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-2">
          <div className="flex items-center gap-3 min-w-0">
            {isModified && (
              <span className="shrink-0 w-2 h-2 rounded-full bg-warning" />
            )}
            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground truncate">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!isEditing && (
              <>
                <button
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors cursor-pointer"
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

        {/* Content / Editor */}
        <div className="px-6 pb-6">
          {isEditing ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-accent/30 bg-edit-bg/30 overflow-hidden">
                <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  className="w-full p-4 text-sm font-mono leading-relaxed bg-transparent text-foreground resize-none focus:outline-none min-h-[200px]"
                  spellCheck={false}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light transition-colors cursor-pointer"
                >
                  Uložit
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-lg border border-border text-muted text-sm font-medium hover:bg-background transition-colors cursor-pointer"
                >
                  Zrušit
                </button>
                {isModified && (
                  <button
                    onClick={() => {
                      onClearEdit(id);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 rounded-lg text-warning text-sm font-medium hover:bg-warning/10 transition-colors cursor-pointer"
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
          <div className="px-6 pb-6 space-y-3">
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-faint uppercase tracking-wider mb-3">
                Komentáře ({comments.length})
              </p>

              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="group flex items-start gap-3 p-3 rounded-lg bg-comment-bg/50 border border-comment-bg mb-2"
                >
                  <svg
                    className="w-4 h-4 text-warning mt-0.5 shrink-0"
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{comment.text}</p>
                    <p className="text-xs text-faint mt-1">
                      {new Date(comment.timestamp).toLocaleString("cs-CZ")}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteComment(id, comment.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-faint hover:text-warning transition-all cursor-pointer"
                    title="Smazat komentář"
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

              {showCommentInput && (
                <div className="flex items-center gap-2">
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
                    className="flex-1 px-3 py-2 rounded-lg border border-border text-sm text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-3 py-2 rounded-lg bg-cyan text-white text-sm font-medium hover:bg-cyan/90 transition-colors cursor-pointer"
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

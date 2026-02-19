"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  h3: ({ children }) => (
    <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground mt-8 mb-3 flex items-center gap-2">
      <span className="w-1 h-5 rounded-full bg-gradient-to-b from-accent to-cyan shrink-0" />
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-semibold text-foreground mt-6 mb-2 text-sm uppercase tracking-wide">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-muted leading-[1.75] mb-4">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-muted">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent font-medium hover:text-accent-light underline decoration-accent/30 underline-offset-2 hover:decoration-accent transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="space-y-1.5 mb-5 ml-5 list-disc marker:text-accent/40">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-1.5 mb-5 ml-5 list-decimal marker:text-accent/40 marker:font-semibold">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-muted leading-relaxed pl-1">{children}</li>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6 rounded-xl border border-border shadow-sm">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gradient-to-r from-accent/[0.06] to-cyan/[0.04]">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-accent/[0.02] transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider border-b border-border">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-muted">{children}</td>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock || String(children).includes("\n")) {
      return (
        <div className="my-5 rounded-xl bg-dark overflow-x-auto border border-dark-border shadow-lg">
          <pre className="p-5 text-sm text-white/70 font-mono leading-relaxed whitespace-pre-wrap">
            <code>{children}</code>
          </pre>
        </div>
      );
    }
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-accent/[0.07] text-accent font-mono text-[0.85em] font-medium">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-[3px] border-gradient-to-b from-accent to-cyan pl-5 my-5 text-muted/80 italic bg-accent/[0.02] py-3 pr-4 rounded-r-xl">
      {children}
    </blockquote>
  ),
  hr: () => (
    <div className="my-10 flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-accent/20 via-cyan/10 to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
      <div className="flex-1 h-px bg-gradient-to-l from-accent/20 via-cyan/10 to-transparent" />
    </div>
  ),
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

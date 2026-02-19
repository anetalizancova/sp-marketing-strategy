"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  h3: ({ children }) => (
    <h3 className="font-serif text-xl font-semibold text-foreground mt-8 mb-3">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-semibold text-foreground mt-6 mb-2">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-muted leading-relaxed mb-4">{children}</p>
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
      className="text-accent hover:text-accent-light underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="space-y-2 mb-4 ml-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-2 mb-4 ml-1 list-decimal list-inside">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-muted leading-relaxed flex items-start gap-2">
      <span className="text-accent mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-accent/40" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6 rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-background">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-border last:border-0 hover:bg-background/50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider">
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
        <div className="my-4 rounded-lg bg-foreground/[0.03] border border-border overflow-x-auto">
          <pre className="p-4 text-sm text-muted font-mono leading-relaxed whitespace-pre-wrap">
            <code>{children}</code>
          </pre>
        </div>
      );
    }
    return (
      <code className="px-1.5 py-0.5 rounded bg-accent/8 text-accent text-sm font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent/30 pl-4 my-4 text-muted italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-border" />,
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

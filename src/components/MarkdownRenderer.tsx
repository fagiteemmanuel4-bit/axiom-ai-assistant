import { useState } from "react";
import ReactMarkdown from "react-markdown";
import CodeCanvas from "./CodeCanvas";

interface MarkdownRendererProps {
  content: string;
}

const ThinkingBlock = ({ content }: { content: string }) => {
  const [open, setOpen] = useState(false);

  if (!content.trim()) return null;

  return (
    <div className="mb-3 rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary"
      >
        <i className={`bi bi-chevron-${open ? "down" : "right"} text-[10px]`} />
        <i className="bi bi-lightbulb text-[10px]" />
        <span>Axiom's thinking</span>
      </button>
      {open && (
        <div className="border-t border-border bg-secondary/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          {content}
        </div>
      )}
    </div>
  );
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  // Extract <think>...</think> blocks
  const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
  const thinkContent = thinkMatch?.[1]?.trim() || "";
  
  // Also handle unclosed think tags (still streaming)
  const unclosedThink = !thinkMatch && content.match(/<think>([\s\S]*?)$/);
  const streamingThink = unclosedThink?.[1]?.trim() || "";
  
  const cleaned = content
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/<think>[\s\S]*$/, "")
    .trim();

  return (
    <>
      {(thinkContent || streamingThink) && (
        <ThinkingBlock content={thinkContent || streamingThink} />
      )}
      {cleaned && (
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeStr = String(children).replace(/\n$/, "");

              if (match || codeStr.includes("\n")) {
                return <CodeCanvas language={match?.[1] || ""} code={codeStr} />;
              }

              return (
                <code className="rounded bg-secondary px-1.5 py-0.5 text-sm font-mono text-foreground" {...props}>
                  {children}
                </code>
              );
            },
            p({ children }) {
              return <p className="mb-3 leading-relaxed">{children}</p>;
            },
            h1({ children }) {
              return <h1 className="mb-3 mt-4 text-xl font-bold">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="mb-2 mt-3 text-lg font-semibold">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="mb-2 mt-3 text-base font-semibold">{children}</h3>;
            },
            ul({ children }) {
              return <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="mb-3 list-decimal space-y-1 pl-6">{children}</ol>;
            },
            li({ children }) {
              return <li className="leading-relaxed">{children}</li>;
            },
            a({ href, children }) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-muted-foreground hover:text-foreground">
                  {children}
                </a>
              );
            },
            blockquote({ children }) {
              return <blockquote className="my-3 border-l-2 border-muted-foreground pl-4 italic text-muted-foreground">{children}</blockquote>;
            },
            strong({ children }) {
              return <strong className="font-semibold">{children}</strong>;
            },
            table({ children }) {
              return (
                <div className="my-3 overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">{children}</table>
                </div>
              );
            },
            thead({ children }) {
              return <thead className="bg-secondary text-foreground">{children}</thead>;
            },
            th({ children }) {
              return <th className="px-3 py-2 text-left font-medium">{children}</th>;
            },
            td({ children }) {
              return <td className="border-t border-border px-3 py-2">{children}</td>;
            },
            hr() {
              return <hr className="my-4 border-border" />;
            },
          }}
        >
          {cleaned}
        </ReactMarkdown>
      )}
    </>
  );
};

export default MarkdownRenderer;

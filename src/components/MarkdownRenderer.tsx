import ReactMarkdown from "react-markdown";
import CodeCanvas from "./CodeCanvas";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  // Strip <think>...</think> blocks from DeepSeek R1
  const cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  return (
    <ReactMarkdown
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeStr = String(children).replace(/\n$/, "");

          // Block code
          if (match || codeStr.includes("\n")) {
            return <CodeCanvas language={match?.[1] || ""} code={codeStr} />;
          }

          // Inline code
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
      }}
    >
      {cleaned}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

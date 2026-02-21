import { useState } from "react";

interface CodeCanvasProps {
  language: string;
  code: string;
}

const CodeCanvas = ({ language, code }: CodeCanvasProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="my-3 overflow-hidden rounded-lg border" style={{ borderColor: "hsl(var(--code-canvas-border))" }}>
      <div
        className="flex items-center justify-between px-4 py-2 text-xs"
        style={{ background: "hsl(var(--code-canvas-header))" }}
      >
        <span className="font-medium text-muted-foreground">{language || "Code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <i className={`bi ${copied ? "bi-check-lg" : "bi-clipboard"}`} />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-sm leading-relaxed" style={{ background: "hsl(var(--code-canvas))" }}>
        <pre className="font-mono">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="code-line-number">{i + 1}</span>
              <code className="text-foreground">{line}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default CodeCanvas;

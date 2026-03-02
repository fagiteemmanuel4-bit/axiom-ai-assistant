import { useState } from "react";

interface CodeCanvasProps {
  language: string;
  code: string;
}

const highlightLine = (line: string, lang: string): React.ReactNode[] => {
  const keywords = [
    "const", "let", "var", "function", "return", "if", "else", "for", "while",
    "import", "export", "from", "default", "class", "extends", "new", "this",
    "async", "await", "try", "catch", "throw", "typeof", "instanceof",
    "true", "false", "null", "undefined", "void", "interface", "type",
    "def", "print", "self", "lambda", "with", "as", "in", "not", "and", "or",
    "public", "private", "protected", "static", "final", "abstract",
    "SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "CREATE", "TABLE",
    "ALTER", "DROP", "JOIN", "ON", "INTO", "VALUES", "SET", "ORDER", "BY",
    "GROUP", "HAVING", "LIMIT", "OFFSET", "AND", "OR", "NOT", "NULL",
  ];

  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    const strMatch = remaining.match(/^(["'`])(?:(?!\1|\\).|\\.)*\1/);
    if (strMatch) { parts.push(<span key={key++} className="text-emerald-400">{strMatch[0]}</span>); remaining = remaining.slice(strMatch[0].length); continue; }

    const commentMatch = remaining.match(/^(\/\/.*|#.*|--.*)/);
    if (commentMatch) { parts.push(<span key={key++} className="text-zinc-500 italic">{commentMatch[0]}</span>); remaining = remaining.slice(commentMatch[0].length); continue; }

    const numMatch = remaining.match(/^\b\d+(\.\d+)?\b/);
    if (numMatch) { parts.push(<span key={key++} className="text-amber-400">{numMatch[0]}</span>); remaining = remaining.slice(numMatch[0].length); continue; }

    const wordMatch = remaining.match(/^\b[a-zA-Z_]\w*\b/);
    if (wordMatch) {
      const word = wordMatch[0];
      if (keywords.includes(word)) {
        parts.push(<span key={key++} className="text-violet-400 font-medium">{word}</span>);
      } else if (remaining.slice(word.length).trimStart().startsWith("(")) {
        parts.push(<span key={key++} className="text-sky-400">{word}</span>);
      } else {
        parts.push(<span key={key++}>{word}</span>);
      }
      remaining = remaining.slice(word.length);
      continue;
    }

    const opMatch = remaining.match(/^[{}()\[\]<>=!+\-*/&|?.,:;@]+/);
    if (opMatch) { parts.push(<span key={key++} className="text-zinc-400">{opMatch[0]}</span>); remaining = remaining.slice(opMatch[0].length); continue; }

    parts.push(<span key={key++}>{remaining[0]}</span>);
    remaining = remaining.slice(1);
  }
  return parts;
};

const PREVIEWABLE = ["html", "htm", "jsx", "tsx", "react"];

const CodeCanvas = ({ language, code }: CodeCanvasProps) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = language || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `axiom-code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canPreview = PREVIEWABLE.includes(language?.toLowerCase()) && typeof window !== "undefined" && window.innerWidth >= 1024;

  const lines = code.split("\n");
  const displayLang = language?.toUpperCase() || "CODE";

  return (
    <>
      <div className="my-3 overflow-hidden rounded-xl border" style={{ borderColor: "hsl(var(--code-canvas-border))" }}>
        <div className="flex items-center justify-between px-4 py-2.5 text-xs" style={{ background: "hsl(var(--code-canvas-header))" }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="ml-1 font-mono font-medium text-muted-foreground">{displayLang}</span>
          </div>
          <div className="flex items-center gap-1">
            {canPreview && (
              <button onClick={() => setShowPreview(true)} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" title="Preview">
                <i className="bi bi-play-circle" />
                <span>Preview</span>
              </button>
            )}
            <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" title="Download">
              <i className="bi bi-download" />
            </button>
            <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <i className={`bi ${copied ? "bi-check-lg text-emerald-400" : "bi-clipboard"}`} />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto p-4 text-[13px] leading-6" style={{ background: "hsl(var(--code-canvas))" }}>
          <pre className="font-mono">
            {lines.map((line, i) => (
              <div key={i} className="flex hover:bg-white/[0.02] rounded">
                <span className="code-line-number select-none">{i + 1}</span>
                <code className="text-foreground">{highlightLine(line, language)}</code>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Full-screen preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-sm font-medium text-foreground">Preview</span>
            <div className="flex items-center gap-2">
              <button onClick={handleDownload} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground" title="Download">
                <i className="bi bi-download" />
              </button>
              <button onClick={() => setShowPreview(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground" title="Close">
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>
          <iframe
            srcDoc={language?.toLowerCase() === "html" ? code : `<!DOCTYPE html><html><body><pre>${code}</pre></body></html>`}
            className="flex-1 w-full bg-white"
            sandbox="allow-scripts"
            title="Code Preview"
          />
        </div>
      )}
    </>
  );
};

export default CodeCanvas;

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string, image?: File) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [deepThink, setDeepThink] = useState(() => localStorage.getItem("axiom-deep-think") === "true");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if ((!trimmed && !imageFile) || isLoading) return;
    onSend(trimmed, imageFile || undefined);
    setInput("");
    setImagePreview(null);
    setImageFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleDeepThink = () => {
    const next = !deepThink;
    setDeepThink(next);
    localStorage.setItem("axiom-deep-think", String(next));
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-3">
      {imagePreview && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="" className="h-16 w-16 rounded-lg object-cover border border-border" />
            <button
              onClick={() => { setImagePreview(null); setImageFile(null); }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <div className="flex items-end gap-2 rounded-[14px] border border-border bg-secondary px-3 py-2.5">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            title="Attach image"
          >
            <i className="bi bi-plus-lg text-base" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Axiom anything..."
          rows={1}
          className="max-h-[120px] flex-1 resize-none bg-transparent text-sm leading-5 text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleDeepThink}
            className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs transition-colors ${
              deepThink ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle deep thinking"
          >
            <i className="bi bi-lightbulb" />
            <span className="hidden sm:inline">Think</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={(!input.trim() && !imageFile) || isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
          >
            <i className="bi bi-arrow-up text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

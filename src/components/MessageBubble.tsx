import { useState, useRef, useEffect } from "react";
import type { Message } from "@/lib/chat";
import MarkdownRenderer from "./MarkdownRenderer";

interface MessageBubbleProps {
  message: Message;
  onEdit?: (messageId: string, newContent: string) => void;
  isLoading?: boolean;
}

const MessageBubble = ({ message, onEdit, isLoading }: MessageBubbleProps) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [editing]);

  if (message.role === "user") {
    if (editing) {
      return (
        <div className="flex justify-end">
          <div className="w-full max-w-[85%] md:max-w-[70%]">
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (editValue.trim()) {
                    onEdit?.(message.id, editValue.trim());
                    setEditing(false);
                  }
                }
                if (e.key === "Escape") {
                  setEditValue(message.content);
                  setEditing(false);
                }
              }}
              className="w-full resize-none rounded-2xl border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <div className="mt-1 flex justify-end gap-2">
              <button
                onClick={() => { setEditValue(message.content); setEditing(false); }}
                className="rounded px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editValue.trim()) {
                    onEdit?.(message.id, editValue.trim());
                    setEditing(false);
                  }
                }}
                className="rounded bg-foreground px-3 py-1 text-xs text-background hover:opacity-90"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group flex items-start justify-end gap-2">
        <button
          onClick={() => { setEditValue(message.content); setEditing(true); }}
          className="mt-2 opacity-0 transition-opacity group-hover:opacity-100 disabled:hidden"
          disabled={isLoading}
          title="Edit message"
        >
          <i className="bi bi-pencil text-xs text-muted-foreground hover:text-foreground" />
        </button>
        <div
          className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-foreground md:max-w-[70%]"
          style={{ background: "hsl(var(--user-bubble))" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] text-sm leading-relaxed text-foreground md:max-w-[80%]">
        <MarkdownRenderer content={message.content} />
      </div>
    </div>
  );
};

export default MessageBubble;

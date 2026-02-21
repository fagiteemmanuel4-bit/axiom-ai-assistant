import type { Message } from "@/lib/chat";
import MarkdownRenderer from "./MarkdownRenderer";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
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

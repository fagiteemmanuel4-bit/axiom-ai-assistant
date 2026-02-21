import { useState, useEffect, useRef, useCallback } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatFooter from "@/components/ChatFooter";
import MessageBubble from "@/components/MessageBubble";
import {
  type Message,
  loadMessages,
  saveMessages,
  clearMessages,
  generateId,
  streamChat,
} from "@/lib/chat";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async (input: string) => {
    const userMsg: Message = { id: generateId(), role: "user", content: input };
    const assistantId = generateId();

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const controller = new AbortController();
    abortRef.current = controller;

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      const content = assistantSoFar;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id === assistantId) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
        }
        return [...prev, { id: assistantId, role: "assistant", content }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        signal: controller.signal,
      });
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error(e);
        upsert("\n\n*Sorry, something went wrong. Please try again.*");
      }
      setIsLoading(false);
    }
  }, [messages]);

  const handleHome = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setIsLoading(false);
  };

  const handleClear = () => {
    if (abortRef.current) abortRef.current.abort();
    clearMessages();
    setMessages([]);
    setIsLoading(false);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChatHeader />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center px-4">
            <h1 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
              What's on your mind today?
            </h1>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                <span>Axiom is thinking...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} isLoading={isLoading} />
      <ChatFooter onHome={handleHome} onClear={handleClear} />
    </div>
  );
};

export default Index;

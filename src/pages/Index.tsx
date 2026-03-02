import { useState, useEffect, useRef, useCallback } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import MessageBubble from "@/components/MessageBubble";
import {
  type Message,
  generateId,
  streamChat,
} from "@/lib/chat";
import {
  type ChatSession,
  loadSessions,
  saveSessions,
  generateSessionId,
  getActiveSessionId,
  setActiveSessionId,
  deleteSession,
  getSessionTitle,
} from "@/lib/chatHistory";

const Index = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load sessions on mount
  useEffect(() => {
    const loaded = loadSessions();
    setSessions(loaded);
    const savedActive = getActiveSessionId();
    if (savedActive && loaded.find((s) => s.id === savedActive)) {
      setActiveId(savedActive);
      setMessages(loaded.find((s) => s.id === savedActive)!.messages);
    }
  }, []);

  // Persist sessions when messages change
  useEffect(() => {
    if (!activeId || messages.length === 0) return;
    setSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === activeId
          ? { ...s, messages, title: getSessionTitle(messages), updatedAt: Date.now() }
          : s
      );
      saveSessions(updated);
      return updated;
    });
  }, [messages, activeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startNewChat = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setActiveId(null);
    setActiveSessionId(null);
    setMessages([]);
    setIsLoading(false);
  }, []);

  const selectSession = useCallback((id: string) => {
    if (abortRef.current) abortRef.current.abort();
    setIsLoading(false);
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setActiveId(id);
      setActiveSessionId(id);
      setMessages(session.messages);
    }
    setSidebarOpen(false);
  }, [sessions]);

  const handleDeleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const updated = deleteSession(prev, id);
      saveSessions(updated);
      return updated;
    });
    if (activeId === id) {
      setActiveId(null);
      setActiveSessionId(null);
      setMessages([]);
    }
  }, [activeId]);

  const handleSend = useCallback(async (input: string) => {
    const userMsg: Message = { id: generateId(), role: "user", content: input };
    const assistantId = generateId();

    // Create session if none active
    let sessionId = activeId;
    if (!sessionId) {
      sessionId = generateSessionId();
      const newSession: ChatSession = {
        id: sessionId,
        title: input.slice(0, 40),
        messages: [],
        updatedAt: Date.now(),
      };
      setSessions((prev) => {
        const updated = [newSession, ...prev];
        saveSessions(updated);
        return updated;
      });
      setActiveId(sessionId);
      setActiveSessionId(sessionId);
    }

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
  }, [messages, activeId]);

  const handleEdit = useCallback(async (messageId: string, newContent: string) => {
    if (isLoading) return;
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx === -1) return;

    const updatedMsg: Message = { ...messages[idx], content: newContent };
    const kept = [...messages.slice(0, idx), updatedMsg];
    setMessages(kept);
    setIsLoading(true);

    const assistantId = generateId();
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
        messages: kept.map((m) => ({ role: m.role, content: m.content })),
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
  }, [messages, isLoading]);

  const handleClear = () => {
    if (abortRef.current) abortRef.current.abort();
    setSessions([]);
    saveSessions([]);
    setActiveId(null);
    setActiveSessionId(null);
    setMessages([]);
    setIsLoading(false);
  };

  const isEmpty = messages.length === 0;
  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        sessions={sortedSessions}
        activeId={activeId}
        open={sidebarOpen}
        onSelect={selectSession}
        onNew={startNewChat}
        onDelete={handleDeleteSession}
        onClose={() => setSidebarOpen(false)}
        onClear={handleClear}
      />

      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <div className="shrink-0">
          <ChatHeader onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
          {isEmpty ? (
            <div className="flex h-full items-center justify-center px-4">
              <h1 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
                What's on your mind today?
              </h1>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} onEdit={handleEdit} isLoading={isLoading} />
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

        <div className="shrink-0">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
          <div className="flex items-center justify-center px-4 py-1.5 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Axiom can make mistakes — please review its responses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

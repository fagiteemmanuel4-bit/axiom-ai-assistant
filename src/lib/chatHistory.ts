import type { Message } from "./chat";

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const SESSIONS_KEY = "axiom-chat-sessions";
const ACTIVE_KEY = "axiom-active-session";

export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function loadSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getActiveSessionId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveSessionId(id: string | null) {
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function deleteSession(sessions: ChatSession[], id: string): ChatSession[] {
  return sessions.filter((s) => s.id !== id);
}

export function getSessionTitle(messages: Message[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  return first.content.slice(0, 40) + (first.content.length > 40 ? "…" : "");
}

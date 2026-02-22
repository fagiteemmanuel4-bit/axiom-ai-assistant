import type { ChatSession } from "@/lib/chatHistory";
import axiomLogo from "@/assets/axiom-logo.png";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeId: string | null;
  open: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const ChatSidebar = ({ sessions, activeId, open, onSelect, onNew, onDelete, onClose }: ChatSidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-200 md:relative md:z-auto ${
          open ? "translate-x-0" : "-translate-x-full md:-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-3">
          <img src={axiomLogo} alt="Axiom" className="h-10 w-20" />
          <button
            onClick={onNew}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="New chat"
          >
            <i className="bi bi-plus-lg text-base" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-1">
          {sessions.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">No conversations yet</p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className={`group mb-0.5 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  s.id === activeId
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
                onClick={() => onSelect(s.id)}
              >
                <i className="bi bi-chat-left text-xs shrink-0" />
                <span className="flex-1 truncate">{s.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s.id);
                  }}
                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  title="Delete"
                >
                  <i className="bi bi-x text-base text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="m-2 flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
        >
          <i className="bi bi-x-lg" />
        </button>
      </aside>
    </>
  );
};

export default ChatSidebar;

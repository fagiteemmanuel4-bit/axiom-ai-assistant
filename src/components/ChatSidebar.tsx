import type { ChatSession } from "@/lib/chatHistory";
import axiomLogo from "@/assets/axiom-logo-new.png";
import ReviewDialog from "./ReviewDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeId: string | null;
  open: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onClear: () => void;
}

const ChatSidebar = ({ sessions, activeId, open, onSelect, onNew, onDelete, onClose, onClear }: ChatSidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {open &&
      <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      }
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-border bg-card transition-transform duration-200 ${
        open ? "translate-x-0" : "-translate-x-full"}`
        }>

        <div className="flex items-center justify-between border-b border-border px-3 py-3">
          
          <div className="flex items-center gap-1">
            <button
              onClick={onNew}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="New chat">

              <i className="bi bi-plus-lg text-base" />
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="Close sidebar">

              <i className="bi bi-x-lg text-sm" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {sessions.length === 0 ?
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">No conversations yet</p> :

          sessions.map((s) =>
          <div
            key={s.id}
            className={`group mb-0.5 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            s.id === activeId ?
            "bg-secondary text-foreground" :
            "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`
            }
            onClick={() => onSelect(s.id)}>

                <i className="bi bi-chat-left text-xs shrink-0" />
                <span className="flex-1 truncate">{s.title}</span>
                <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(s.id);
              }}
              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              title="Delete">

                  <i className="bi bi-trash text-xs text-muted-foreground hover:text-destructive" />
                </button>
              </div>
          )
          }
        </div>

        {/* Bottom actions */}
        <div className="shrink-0 border-t border-border px-3 py-3 space-y-2">
          <ReviewDialog />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <i className="bi bi-trash text-xs" />
                <span>Clear all chats</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-border bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear chat history</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear all chat history? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-border bg-secondary text-foreground hover:bg-muted">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClear}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </>);

};

export default ChatSidebar;
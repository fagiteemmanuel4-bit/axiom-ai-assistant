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

interface ChatFooterProps {
  onHome: () => void;
  onClear: () => void;
}

const ChatFooter = ({ onHome, onClear }: ChatFooterProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
      <button onClick={onHome} className="p-2 transition-colors hover:text-foreground" title="Home">
        <i className="bi bi-house text-base" />
      </button>
      <span className="hidden sm:inline">Axiom can make mistakes please review its responses</span>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="p-2 transition-colors hover:text-foreground" title="Clear chat">
            <i className="bi bi-trash text-base" />
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
  );
};

export default ChatFooter;

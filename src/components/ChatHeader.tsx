import axiomLogo from "@/assets/axiom-logo-new.png";
import { toast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

const ChatHeader = ({ onToggleSidebar }: ChatHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="Toggle sidebar"
        >
          <i className="bi bi-list text-xl" />
        </button>
        <img src={axiomLogo} alt="Axiom" className="h-8 w-auto" />
      </div>
      <button
        onClick={() => toast({ title: "Axiom authentication coming soon!" })}
        className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary"
      >
        Login
      </button>
    </header>
  );
};

export default ChatHeader;

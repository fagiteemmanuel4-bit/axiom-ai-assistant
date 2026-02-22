import axiomLogo from "@/assets/axiom-logo.png";
import { toast } from "@/hooks/use-toast";

const ChatHeader = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-6">
      <div className="flex items-center gap-2">
        <img src={axiomLogo} alt="Axiom" className="h-20 w-40" />
        <span className="text-lg font-semibold tracking-tight text-foreground">
        </span>
      </div>
      <button onClick={() => toast({ title: "Axiom authentication coming soon!" })}
      className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary">

        Login
      </button>
    </header>);

};

export default ChatHeader;
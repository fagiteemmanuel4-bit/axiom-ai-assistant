import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

const ChatHeader = ({ onToggleSidebar }: ChatHeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      </div>

      <button
        onClick={() => navigate("/settings")}
        className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-border transition-colors hover:border-foreground"
        title="Settings"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs font-semibold text-foreground">
            {(user?.displayName || user?.email || "U")[0].toUpperCase()}
          </span>
        )}
      </button>
    </header>
  );
};

export default ChatHeader;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [deepThink, setDeepThink] = useState(() => localStorage.getItem("axiom-deep-think") === "true");
  const [sound, setSound] = useState(() => localStorage.getItem("axiom-sound") !== "false");
  const [studyMode, setStudyMode] = useState(() => localStorage.getItem("axiom-study-mode") === "true");

  const toggle = (key: string, value: boolean, setter: (v: boolean) => void) => {
    localStorage.setItem(key, String(value));
    setter(value);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate("/")} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
          <i className="bi bi-arrow-left text-lg" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
      </header>

      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
        {/* Account */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account</h2>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground font-semibold">
                  {(user?.displayName || user?.email || "U")[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{user?.displayName || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Features</h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <ToggleRow label="Deep Think" desc="Extended reasoning for complex queries" value={deepThink} onChange={(v) => toggle("axiom-deep-think", v, setDeepThink)} />
            <ToggleRow label="Sound Effects" desc="Play sounds when Axiom responds" value={sound} onChange={(v) => toggle("axiom-sound", v, setSound)} />
            <ToggleRow label="Study Mode" desc="Split-screen quizzes and interactive learning" value={studyMode} onChange={(v) => toggle("axiom-study-mode", v, setStudyMode)} />
          </div>
        </section>

        {/* Appearance */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h2>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Theme: Dark (default)</p>
          </div>
        </section>

        {/* Danger zone */}
        <section className="space-y-3">
          <button onClick={handleSignOut} className="w-full rounded-xl border border-destructive/50 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
            Sign out
          </button>
        </section>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <div>
      <p className="text-sm text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-foreground" : "bg-muted"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full transition-transform ${value ? "translate-x-5 bg-background" : "translate-x-0.5 bg-muted-foreground"}`} />
    </button>
  </div>
);

export default Settings;

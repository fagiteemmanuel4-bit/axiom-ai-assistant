import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axiomLogo from "@/assets/axiom-logo-new.png";

const INTERESTS = ["Coding", "Writing", "Learning", "Research", "Creative", "Business", "Science", "Math"];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const name = user?.displayName?.split(" ")[0] || "there";

  const toggleInterest = (i: string) => {
    setSelected((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const finish = () => {
    localStorage.setItem("axiom-onboarded", "true");
    localStorage.setItem("axiom-interests", JSON.stringify(selected));
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {step === 0 && (
          <>
            <img src={axiomLogo} alt="Axiom" className="mx-auto h-16 w-16 rounded-2xl" />
            <h1 className="text-2xl font-bold text-foreground">Hey {name} 👋</h1>
            <p className="text-muted-foreground">Welcome to Axiom. Let's personalize your experience.</p>
            <button onClick={() => setStep(1)} className="rounded-xl bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90">
              Get started
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-xl font-bold text-foreground">What are you interested in?</h1>
            <p className="text-sm text-muted-foreground">Select all that apply — this helps Axiom tailor responses</p>
            <div className="flex flex-wrap justify-center gap-2">
              {INTERESTS.map((i) => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selected.includes(i) ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            <button onClick={finish} className="rounded-xl bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90">
              Continue
            </button>
            <button onClick={finish} className="block mx-auto text-sm text-muted-foreground hover:text-foreground">
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

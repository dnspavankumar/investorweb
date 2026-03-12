import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

const AuthForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "startup";
  const isInvestor = role === "investor";

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate auth — replace with Lovable Cloud auth later
    setTimeout(() => {
      const userData = {
        email: form.email,
        name: form.name || form.email.split("@")[0],
        role,
      };
      sessionStorage.setItem("user", JSON.stringify(userData));
      toast.success(`Welcome, ${userData.name}!`);
      navigate(isInvestor ? "/investor/onboarding" : "/startup/onboarding");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </button>

        <div className={`border-2 rounded-lg p-8 bg-card ${isInvestor ? "border-accent/50" : "border-secondary/50"}`}>
          <div className="text-center mb-8">
            <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${isInvestor ? "bg-accent/10" : "bg-secondary/10"}`}>
              <span className={`font-display text-lg font-bold ${isInvestor ? "text-accent" : "text-secondary"}`}>
                {isInvestor ? "INV" : "FND"}
              </span>
            </div>
            <h2 className="font-display text-2xl uppercase text-primary mb-1">
              {isSignup ? "CREATE ACCOUNT" : "WELCOME BACK"}
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {isInvestor ? "// INVESTOR_PORTAL" : "// FOUNDER_PORTAL"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                  FULL NAME
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-background border-2 border-border rounded-md px-4 py-3 font-mono text-sm text-primary outline-none focus:border-secondary transition-colors"
                  placeholder="Your name..."
                />
              </div>
            )}

            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                EMAIL
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full bg-background border-2 border-border rounded-md px-4 py-3 font-mono text-sm text-primary outline-none focus:border-secondary transition-colors"
                placeholder="you@startup.com"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                PASSWORD
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full bg-background border-2 border-border rounded-md px-4 py-3 font-mono text-sm text-primary outline-none focus:border-secondary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-widest py-4 rounded-md transition-all ${
                isInvestor
                  ? "bg-accent text-accent-foreground hover:brightness-110"
                  : "bg-secondary text-secondary-foreground hover:brightness-110"
              } ${loading ? "opacity-60" : ""}`}
            >
              {loading ? (
                <span className="animate-pulse">AUTHENTICATING...</span>
              ) : isSignup ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  CREATE ACCOUNT
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  LOGIN
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="font-mono text-[11px] text-muted-foreground hover:text-secondary transition-colors uppercase"
            >
              {isSignup ? "Already have an account? LOGIN" : "New here? CREATE ACCOUNT"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;

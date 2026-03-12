import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AuthForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "startup";
  const isInvestor = role === "investor";

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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

  const accentColor = isInvestor ? "accent" : "primary";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-16 relative">
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] ${isInvestor ? 'bg-accent/5' : 'bg-primary/5'} rounded-full blur-3xl pointer-events-none`} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className={`glass-card p-8 ${isInvestor ? 'glow-gold' : 'glow-emerald'}`}>
          <div className="text-center mb-8">
            <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-${accentColor}/10 flex items-center justify-center`}>
              <span className={`font-display text-lg font-bold text-${accentColor}`}>
                {isInvestor ? "INV" : "FND"}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              {isInvestor ? "Investor Portal" : "Founder Portal"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="text-xs font-display font-semibold text-muted-foreground block mb-2 tracking-wide">
                  Full Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground font-body outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2 tracking-wide">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground font-body outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2 tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 pr-11 text-sm text-foreground font-body outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-display font-semibold text-sm py-3.5 rounded-lg transition-all ${
                isInvestor
                  ? "bg-accent text-accent-foreground hover:brightness-110 glow-gold"
                  : "bg-primary text-primary-foreground hover:brightness-110 glow-emerald"
              } ${loading ? "opacity-60" : ""}`}
            >
              {loading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : isSignup ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignup ? "Already have an account? Sign in" : "New here? Create account"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;

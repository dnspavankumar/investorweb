import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";

const SiteHeader = () => {
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const isHome = location.pathname === "/";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully.");
    } catch (error) {
      toast.error("Unable to sign out right now.");
    }
  };

  return (
    <header className="glass sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center glow-emerald"
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
              Nexus<span className="text-primary">AI</span>
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="live-dot" />
            <span className="text-[11px] text-muted-foreground font-body">Live</span>
          </div>
          {!isHome && (
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
            >
              Home
            </Link>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
            >
              Sign Out{userProfile?.name ? ` (${userProfile.name})` : ""}
            </button>
          ) : (
            <Link
              to="/login"
              className="text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

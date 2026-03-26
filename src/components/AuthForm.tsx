import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  type AuthError,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithRedirect,
  updateCurrentUser,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, upsertUserProfile } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/firestore";

const ROLE_HINT_KEY = "auth_role_hint";

const AuthForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const role: UserRole = roleParam === "investor" ? "investor" : "startup";
  const isInvestor = role === "investor";
  const { user, userProfile, refreshUserProfile } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bootstrappingProfile, setBootstrappingProfile] = useState(false);
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!user || !userProfile) return;

    if (userProfile.role === "investor") {
      navigate(userProfile.onboardingCompleted ? "/investor/dashboard" : "/investor/onboarding");
      return;
    }

    navigate(userProfile.onboardingCompleted ? "/startup/dashboard" : "/startup/onboarding");
  }, [user, userProfile, navigate]);

  const authErrorMessage = (code?: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/email-already-in-use":
        return "This email is already registered. Please sign in instead.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/operation-not-allowed":
        return "Email/Password sign-in is disabled. Enable it in Firebase Console > Authentication > Sign-in method.";
      case "auth/invalid-api-key":
        return "Firebase API key is invalid. Re-copy your Web app config from Firebase Project settings.";
      case "auth/configuration-not-found":
        return "Firebase Auth config was not found for this API key. Re-copy Firebase Web config, restart dev server, and verify API key referrer restrictions allow localhost.";
      case "auth/app-not-authorized":
      case "auth/unauthorized-domain":
        return "This domain is not authorized in Firebase Auth. Add localhost/your domain in Authentication > Settings > Authorized domains.";
      case "auth/network-request-failed":
        return "Network error while contacting Firebase. Check internet/firewall and retry.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a bit and try again.";
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return "Google sign-in was canceled.";
      case "auth/popup-blocked":
        return "Popup was blocked. Allow popups for this site and try again.";
      case "auth/account-exists-with-different-credential":
        return "This email is already linked with another sign-in method.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password.";
      case "permission-denied":
        return "Signed in, but Firestore denied profile access. Check and deploy firestore.rules.";
      case "failed-precondition":
        return "Signed in, but Firestore is not initialized. Create Firestore Database in Firebase Console.";
      case "unavailable":
        return "Signed in, but Firestore is currently unavailable. Please retry.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  const resolveRole = (value?: string | null): UserRole =>
    value === "investor" ? "investor" : "startup";

  const nextPathForRole = (resolvedRole: UserRole, onboardingCompleted: boolean | undefined) =>
    resolvedRole === "investor"
      ? onboardingCompleted
        ? "/investor/dashboard"
        : "/investor/onboarding"
      : onboardingCompleted
        ? "/startup/dashboard"
        : "/startup/onboarding";

  const finalizeAuthSession = useCallback(
    async (firebaseUser: User, fallbackRole: UserRole, fallbackName?: string) => {
      if (!auth.currentUser || auth.currentUser.uid !== firebaseUser.uid) {
        try {
          await updateCurrentUser(auth, firebaseUser);
        } catch (error) {
          console.error("Failed to set Firebase currentUser during auth finalize:", error);
        }
      }

      let existingProfile: Awaited<ReturnType<typeof getUserProfile>> = null;
      try {
        existingProfile = await getUserProfile(firebaseUser.uid);
      } catch (error) {
        console.error("Failed to read Firestore user profile during auth finalize:", error);
      }

      const email = firebaseUser.email || "";
      const fallbackFromEmail = email.split("@")[0] || "User";

      const resolvedName =
        (fallbackName || "").trim() ||
        existingProfile?.name ||
        firebaseUser.displayName ||
        fallbackFromEmail;
      const resolvedRole = existingProfile?.role || fallbackRole;
      const nextPath = nextPathForRole(resolvedRole, existingProfile?.onboardingCompleted);

      try {
        await upsertUserProfile({
          uid: firebaseUser.uid,
          email: email || `${firebaseUser.uid}@no-email.local`,
          name: resolvedName,
          role: resolvedRole,
        });
        await refreshUserProfile();
      } catch (error) {
        console.error("Failed to sync Firestore profile after auth:", error);
        toast.warning("Signed in successfully. Continuing while profile sync retries in background.");
      }

      sessionStorage.removeItem(ROLE_HINT_KEY);
      toast.success(`Welcome, ${resolvedName}!`);
      navigate(nextPath);
    },
    [refreshUserProfile, navigate]
  );

  const reportAuthError = (error: unknown) => {
    const authError = error as Partial<AuthError> | undefined;
    const code = authError?.code;

    const message = authErrorMessage(code);
    toast.error(code ? `${message} (${code})` : message);
    console.error("Firebase auth error:", authError?.code, authError?.message || error);
  };

  useEffect(() => {
    const processRedirectResult = async () => {
      try {
        const redirectResult = await getRedirectResult(auth);
        if (!redirectResult) return;

        const hintedRole = resolveRole(sessionStorage.getItem(ROLE_HINT_KEY));
        sessionStorage.removeItem(ROLE_HINT_KEY);
        await finalizeAuthSession(redirectResult.user, hintedRole);
      } catch (error: unknown) {
        sessionStorage.removeItem(ROLE_HINT_KEY);
        reportAuthError(error);
      } finally {
        setLoading(false);
      }
    };

    processRedirectResult();
  }, [finalizeAuthSession]);

  useEffect(() => {
    if (!user || userProfile || bootstrappingProfile) return;

    const bootstrapMissingProfile = async () => {
      setBootstrappingProfile(true);
      try {
        const hintedRole = resolveRole(sessionStorage.getItem(ROLE_HINT_KEY) || role);
        await finalizeAuthSession(user, hintedRole, user.displayName || user.email || "User");
      } catch (error: unknown) {
        reportAuthError(error);
      } finally {
        setBootstrappingProfile(false);
      }
    };

    bootstrapMissingProfile();
  }, [user, userProfile, bootstrappingProfile, role, finalizeAuthSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);

      const trimmedEmail = form.email.trim();
      const trimmedName = form.name.trim();
      const password = form.password.trim();

      const credential = isSignup
        ? await createUserWithEmailAndPassword(auth, trimmedEmail, password)
        : await signInWithEmailAndPassword(auth, trimmedEmail, password);

      if (isSignup && trimmedName) {
        await updateProfile(credential.user, { displayName: trimmedName });
      }

      await finalizeAuthSession(credential.user, role, trimmedName || trimmedEmail);
    } catch (error: unknown) {
      reportAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      sessionStorage.setItem(ROLE_HINT_KEY, role);
      await signInWithRedirect(auth, googleProvider);
    } catch (error: unknown) {
      sessionStorage.removeItem(ROLE_HINT_KEY);
      reportAuthError(error);
      setLoading(false);
    }
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
              disabled={loading || bootstrappingProfile}
              className={`w-full flex items-center justify-center gap-2 font-display font-semibold text-sm py-3.5 rounded-lg transition-all ${
                isInvestor
                  ? "bg-accent text-accent-foreground hover:brightness-110 glow-gold"
                  : "bg-primary text-primary-foreground hover:brightness-110 glow-emerald"
              } ${loading || bootstrappingProfile ? "opacity-60" : ""}`}
            >
              {loading || bootstrappingProfile ? (
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground font-body">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || bootstrappingProfile}
              className="w-full flex items-center justify-center gap-2 border border-border bg-secondary/30 hover:bg-secondary/50 text-foreground font-display font-semibold text-sm py-3.5 rounded-lg transition-all disabled:opacity-60"
            >
              <span className="w-5 h-5 rounded-full bg-white text-black text-xs font-bold inline-flex items-center justify-center">
                G
              </span>
              Continue with Google
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

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, ArrowLeft, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ShimmerCard from "./ShimmerCard";
import OutreachModal from "./OutreachModal";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import {
  findMatchesForFounder,
  findMatchesForInvestor,
  getFounderProfile,
  getInvestorProfile,
} from "@/lib/firestore";
import type { MatchResult } from "@/types/firestore";

interface SearchDashboardProps {
  userType: "startup" | "investor";
}

const buildOutreachEmail = (matchName: string, userType: "startup" | "investor", senderName: string) => {
  return `Subject: Partnership Opportunity - ${senderName} x ${matchName}

Dear ${matchName},

I'm reaching out regarding ${senderName}. We believe there is strong alignment between our goals and your profile.

${userType === "startup"
    ? "We are currently raising capital to accelerate growth and expand market reach. Given your investment focus, this looks like a strong fit."
    : "We've been following your startup journey and are impressed by your traction. We'd love to explore strategic support through capital and mentorship."
  }

I would welcome the opportunity to discuss this further at your convenience.

Best regards,
${senderName}`;
};

const SearchDashboard = ({ userType }: SearchDashboardProps) => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const currentUser = user || auth.currentUser;
  const isInvestor = userType === "investor";

  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [emailModal, setEmailModal] = useState<{ open: boolean; matchName: string; email: string }>({
    open: false,
    matchName: "",
    email: "",
  });

  const [stageFilter, setStageFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileMissing, setProfileMissing] = useState(false);
  const [senderName, setSenderName] = useState("Our Team");

  useEffect(() => {
    if (!currentUser) return;

    let isMounted = true;

    const loadProfile = async () => {
      setProfileLoading(true);

      try {
        if (isInvestor) {
          const investor = await getInvestorProfile(currentUser.uid);
          if (!isMounted) return;

          setProfileMissing(!investor);
          setSenderName(investor?.firmName || userProfile?.name || "Our Firm");
          return;
        }

        const founder = await getFounderProfile(currentUser.uid);
        if (!isMounted) return;

        setProfileMissing(!founder);
        setSenderName(founder?.name || userProfile?.name || "Our Startup");
      } catch (error) {
        if (!isMounted) return;
        toast.error("Unable to load your profile. Please refresh and try again.");
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [currentUser, isInvestor, userProfile?.name]);

  const handleSearch = useCallback(async () => {
    if (!currentUser) {
      toast.error("Please sign in first.");
      navigate(`/login?role=${userType}`);
      return;
    }

    if (profileMissing) {
      toast.error("Complete onboarding before searching for matches.");
      navigate(isInvestor ? "/investor/onboarding" : "/startup/onboarding");
      return;
    }

    setSearching(true);
    setResults([]);
    setSelectedMatch(null);

    try {
      const matches = isInvestor
        ? await findMatchesForInvestor(currentUser.uid, {
            industry: industryFilter || undefined,
            stage: stageFilter || undefined,
          })
        : await findMatchesForFounder(currentUser.uid, {
            industry: industryFilter || undefined,
            stage: stageFilter || undefined,
          });

      setResults(matches);
      if (matches.length > 0) {
        setSelectedMatch(0);
        toast.success(`Found ${matches.length} matches!`);
      } else {
        toast.info("No matches found for this filter. Try broadening your search.");
      }
    } catch (error) {
      toast.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }, [currentUser, industryFilter, isInvestor, navigate, profileMissing, stageFilter, userType]);

  const openEmailModal = (match: MatchResult) => {
    const email = buildOutreachEmail(match.name, userType, senderName);
    setEmailModal({ open: true, matchName: match.name, email });
  };

  const stages = ["PRE_SEED", "SEED", "SERIES_A", "GROWTH"];
  const industries = ["AI/ML", "FinTech", "HealthTech", "SaaS", "AgriTech", "EdTech", "CleanTech"];

  const scoreColor = (score: number) => {
    if (score >= 90) return "text-primary";
    if (score >= 75) return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border glass">
        <button
          onClick={() => navigate(isInvestor ? "/investor/onboarding" : "/startup/onboarding")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Edit Profile
        </button>
        <span className={`text-xs font-display font-semibold ${isInvestor ? "text-accent" : "text-primary"}`}>
          {isInvestor ? "Investor" : "Founder"} Dashboard
        </span>
      </div>

      <div className="relative px-6 py-10 sm:py-14 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        {searching && <div className="ai-scan-line" />}

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-body mb-4">
              <Sparkles className="w-3 h-3" />
              AI-Powered Matching
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {isInvestor ? "Discover Startups" : "Find Investors"}
            </h2>
          </div>

          <div className="glass-card p-5 glow-search">
            {profileLoading ? (
              <p className="text-sm font-body text-muted-foreground">Loading your profile...</p>
            ) : profileMissing ? (
              <p className="text-sm font-body text-muted-foreground">
                Complete onboarding to start matching.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="text-[11px] font-display font-semibold text-muted-foreground block mb-1.5">Stage</label>
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm font-body text-foreground outline-none focus:border-primary/30"
                  >
                    <option value="">All Stages</option>
                    {stages.map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-display font-semibold text-muted-foreground block mb-1.5">Industry</label>
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm font-body text-foreground outline-none focus:border-primary/30"
                  >
                    <option value="">All Industries</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleSearch}
                    disabled={searching || profileMissing || profileLoading}
                    className={`w-full flex items-center justify-center gap-2 font-display font-semibold text-sm py-3 rounded-lg transition-all ${
                      isInvestor
                        ? "bg-accent text-accent-foreground hover:brightness-110"
                        : "bg-primary text-primary-foreground hover:brightness-110"
                    } ${searching ? "opacity-70 animate-pulse-glow" : ""}`}
                  >
                    {searching ? (
                      <>
                        <Zap className="w-4 h-4 animate-pulse" />
                        AI Scanning...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Search & Match
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[50vh]">
        <div className="lg:col-span-1 lg:border-r border-border">
          <div className="px-5 py-3 border-b border-border">
            <p className={`text-xs font-display font-semibold ${isInvestor ? "text-accent" : "text-primary"}`}>
              {results.length > 0 ? `${results.length} Matches Found` : "Awaiting Search"}
            </p>
          </div>

          {searching ? (
            <div className="ai-scan-container">
              <div className="ai-scan-line" />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          ) : (
            <div className="stagger-children">
              {results.map((match, i) => (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatch(i)}
                  className={`p-5 border-b border-border w-full text-left transition-all ${
                    selectedMatch === i
                      ? "bg-secondary border-l-2 border-l-primary"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-sm font-bold text-foreground">{match.name}</span>
                    <span className={`font-display text-xl font-bold ${scoreColor(match.matchScore)}`}>
                      {match.matchScore}%
                    </span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="text-[10px] font-body px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                      {match.type}
                    </span>
                    <span className="text-[10px] font-body text-muted-foreground">{match.ticketSize}</span>
                  </div>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill"
                      style={{ "--score": `${match.matchScore}%`, "--delay": `${i * 0.12}s` } as React.CSSProperties}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedMatch !== null && results[selectedMatch] ? (
            <motion.div
              key={selectedMatch}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-3 border-b border-border">
                {[
                  { label: "Selected", value: results[selectedMatch].name },
                  { label: "Geography", value: results[selectedMatch].geography },
                  { label: "Focus", value: results[selectedMatch].industry },
                ].map((item, i) => (
                  <div key={item.label} className={`p-5 ${i < 2 ? "border-r border-border" : ""}`}>
                    <p className="text-[10px] text-muted-foreground font-body mb-1">{item.label}</p>
                    <p className="font-display text-sm font-bold text-foreground truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 sm:p-8 border-b border-border">
                <div className="inline-flex items-center gap-2 text-xs font-display font-semibold text-primary mb-4">
                  <Sparkles className="w-3 h-3" />
                  AI Match Reasoning
                </div>
                <div className="glass-card p-4">
                  <p className="font-body text-sm leading-relaxed text-foreground">
                    {results[selectedMatch].reasoning}
                  </p>
                </div>
              </div>

              {!isInvestor && (
                <div className="p-6 sm:p-8 border-b border-border">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => openEmailModal(results[selectedMatch])}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground font-display font-semibold text-sm py-4 rounded-xl glow-gold hover:brightness-110 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Generate Outreach Email
                  </motion.button>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <p className="text-xs text-muted-foreground font-body mb-5">Compatibility Breakdown</p>
                <div className="space-y-4">
                  {[
                    { label: "Industry Fit", score: results[selectedMatch].matchScore },
                    { label: "Stage Alignment", score: Math.max(50, results[selectedMatch].matchScore - 8) },
                    { label: "Ticket Match", score: Math.max(40, results[selectedMatch].matchScore - 15) },
                    { label: "Geography", score: Math.max(45, results[selectedMatch].matchScore - 5) },
                  ].map((item, i) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground font-body">{item.label}</span>
                        <span className={`font-display text-sm font-bold ${scoreColor(item.score)}`}>{item.score}%</span>
                      </div>
                      <div className="score-bar">
                        <div
                          className="score-bar-fill"
                          style={{ "--score": `${item.score}%`, "--delay": `${i * 0.1}s` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh] text-center p-8">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-body text-sm text-muted-foreground">
                  {results.length > 0 ? "Select a match to view details" : "Run a search to discover matches"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <OutreachModal
        open={emailModal.open}
        onClose={() => setEmailModal((prev) => ({ ...prev, open: false }))}
        emailText={emailModal.email}
        investorName={emailModal.matchName}
      />
    </div>
  );
};

export default SearchDashboard;

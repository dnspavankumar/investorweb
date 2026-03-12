import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Mail, ArrowLeft, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ShimmerCard from "./ShimmerCard";
import OutreachModal from "./OutreachModal";

interface SearchDashboardProps {
  userType: "startup" | "investor";
}

interface MatchResult {
  name: string;
  type: string;
  industry: string;
  ticketSize: string;
  geography: string;
  matchScore: number;
  reasoning: string;
}

const mockStartupMatches: MatchResult[] = [
  { name: "Apex Ventures", type: "VC", industry: "AI/ML", ticketSize: "₹40L–₹1.6Cr", geography: "India, US", matchScore: 94, reasoning: "Strong alignment in AI/ML sector with proven track record of funding early-stage companies in India." },
  { name: "Bluestone Capital", type: "Angel", industry: "FinTech", ticketSize: "₹8L–₹40L", geography: "Global", matchScore: 87, reasoning: "Active angel investor with deep expertise in fintech and interest in emerging Indian markets." },
  { name: "Greenfield Partners", type: "VC", industry: "CleanTech", ticketSize: "₹80L–₹4Cr", geography: "EU, India", matchScore: 78, reasoning: "ESG-focused fund actively expanding portfolio into adjacent sustainable technology sectors." },
  { name: "Seed Forge", type: "Accelerator", industry: "SaaS", ticketSize: "₹4L–₹12L", geography: "India", matchScore: 72, reasoning: "Top accelerator program with strong mentorship network and follow-on funding capabilities." },
  { name: "Delta Syndicate", type: "Syndicate", industry: "HealthTech", ticketSize: "₹16L–₹80L", geography: "SEA, India", matchScore: 65, reasoning: "Healthcare syndicate with cross-sector innovation partnerships." },
];

const mockInvestorMatches: MatchResult[] = [
  { name: "NeuralTech AI", type: "Startup", industry: "AI/ML", ticketSize: "Seeking ₹80L", geography: "Bangalore", matchScore: 96, reasoning: "Strong technical team with novel AI approach. Revenue growing 40% MoM." },
  { name: "GreenLeaf Agri", type: "Startup", industry: "AgriTech", ticketSize: "Seeking ₹40L", geography: "Pune", matchScore: 88, reasoning: "Innovative precision agriculture platform with 10K+ active farmers." },
  { name: "PayFlow", type: "Startup", industry: "FinTech", ticketSize: "Seeking ₹1.6Cr", geography: "Mumbai", matchScore: 81, reasoning: "B2B payments infrastructure with strong enterprise pipeline." },
  { name: "EduSpark", type: "Startup", industry: "EdTech", ticketSize: "Seeking ₹24L", geography: "Delhi-NCR", matchScore: 74, reasoning: "Gamified learning platform for K-12 with rapid user adoption." },
];

const generateEmail = (matchName: string, userType: string) => {
  const profileStr = sessionStorage.getItem(userType === "startup" ? "startup_profile" : "investor_profile");
  const profile = profileStr ? JSON.parse(profileStr) : {};
  const senderName = userType === "startup" ? profile.name || "Our Startup" : profile.firmName || "Our Firm";

  return `Subject: Partnership Opportunity — ${senderName} × ${matchName}

Dear ${matchName},

I'm reaching out regarding ${senderName}. We believe there is strong alignment between our goals and your portfolio focus.

${userType === "startup"
    ? `We are currently seeking funding to accelerate our growth and expand market reach. Given your investment thesis, we believe this could be a mutually beneficial partnership.`
    : `We've been following your progress and are impressed by your traction. We'd love to explore how we can support your growth with strategic capital and mentorship.`
  }

I would welcome the opportunity to discuss this further at your convenience.

Best regards,
${senderName}`;
};

const SearchDashboard = ({ userType }: SearchDashboardProps) => {
  const navigate = useNavigate();
  const isInvestor = userType === "investor";
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [emailModal, setEmailModal] = useState<{ open: boolean; matchName: string; email: string }>({
    open: false, matchName: "", email: "",
  });

  const [stageFilter, setStageFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  const handleSearch = useCallback(() => {
    setSearching(true);
    setResults([]);
    setSelectedMatch(null);

    setTimeout(() => {
      const matches = isInvestor ? mockInvestorMatches : mockStartupMatches;
      let filtered = matches;
      if (industryFilter) {
        filtered = filtered.filter((m) => m.industry.includes(industryFilter));
      }
      setResults(filtered.length > 0 ? filtered : matches);
      setSearching(false);
      toast.success(`Found ${(filtered.length > 0 ? filtered : matches).length} matches!`);
    }, 2500);
  }, [isInvestor, industryFilter]);

  const openEmailModal = (match: MatchResult) => {
    const email = generateEmail(match.name, userType);
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
      {/* Top bar */}
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

      {/* Search Panel — Command Center */}
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
                  disabled={searching}
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
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[50vh]">
        {/* Match list */}
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
                  key={match.name}
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

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selectedMatch !== null && results[selectedMatch] ? (
            <motion.div
              key={selectedMatch}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Match header */}
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

              {/* AI Reasoning */}
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

              {/* Email button for founders */}
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

              {/* Compatibility breakdown */}
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

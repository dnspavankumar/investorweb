import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Mail, ArrowLeft } from "lucide-react";
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
  { name: "APEX VENTURES", type: "VC", industry: "AI/ML", ticketSize: "$500K–$2M", geography: "US, INDIA", matchScore: 94, reasoning: "Strong alignment in AI/ML sector with proven track record of funding early-stage companies." },
  { name: "BLUESTONE CAPITAL", type: "ANGEL", industry: "FINTECH", ticketSize: "$100K–$500K", geography: "GLOBAL", matchScore: 87, reasoning: "Active angel investor with expertise in fintech and interest in emerging markets." },
  { name: "GREENFIELD PARTNERS", type: "VC", industry: "CLEANTECH", ticketSize: "$1M–$5M", geography: "EU, INDIA", matchScore: 78, reasoning: "ESG-focused fund looking to expand portfolio into adjacent technology sectors." },
  { name: "SEED FORGE", type: "ACCELERATOR", industry: "SAAS", ticketSize: "$50K–$150K", geography: "US", matchScore: 72, reasoning: "Top accelerator program with strong mentorship network and follow-on funding capabilities." },
  { name: "DELTA SYNDICATE", type: "SYNDICATE", industry: "HEALTHTECH", ticketSize: "$200K–$1M", geography: "SEA, INDIA", matchScore: 65, reasoning: "Syndicate with healthcare focus, open to cross-sector innovation partnerships." },
];

const mockInvestorMatches: MatchResult[] = [
  { name: "NEURALTECH AI", type: "STARTUP", industry: "AI/ML", ticketSize: "SEEKING $1M", geography: "SAN FRANCISCO", matchScore: 96, reasoning: "Strong technical team with novel AI approach. Revenue growing 40% MoM." },
  { name: "GREENLEAF AGRI", type: "STARTUP", industry: "AGRITECH", ticketSize: "SEEKING $500K", geography: "BANGALORE", matchScore: 88, reasoning: "Innovative precision agriculture platform with 10K+ active farmers." },
  { name: "PAYFLOW", type: "STARTUP", industry: "FINTECH", ticketSize: "SEEKING $2M", geography: "LONDON", matchScore: 81, reasoning: "B2B payments infrastructure with strong enterprise pipeline." },
  { name: "EDUSPARK", type: "STARTUP", industry: "EDTECH", ticketSize: "SEEKING $300K", geography: "DUBAI", matchScore: 74, reasoning: "Gamified learning platform for K-12 with rapid user adoption across MENA." },
];

const generateEmail = (matchName: string, userType: string) => {
  const profileStr = sessionStorage.getItem(userType === "startup" ? "startup_profile" : "investor_profile");
  const profile = profileStr ? JSON.parse(profileStr) : {};
  const senderName = userType === "startup" ? profile.name || "Our Startup" : profile.firmName || "Our Firm";

  return `Subject: Partnership Opportunity — ${senderName} x ${matchName}

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

  // Filters
  const [stageFilter, setStageFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  const handleSearch = useCallback(() => {
    setSearching(true);
    setResults([]);
    setSelectedMatch(null);

    // Simulate AI matching with shimmer loading
    setTimeout(() => {
      const matches = isInvestor ? mockInvestorMatches : mockStartupMatches;
      let filtered = matches;
      if (industryFilter) {
        filtered = filtered.filter((m) => m.industry.includes(industryFilter));
      }
      setResults(filtered.length > 0 ? filtered : matches);
      setSearching(false);
      toast.success(`Found ${(filtered.length > 0 ? filtered : matches).length} matches!`);
    }, 2000);
  }, [isInvestor, industryFilter]);

  const openEmailModal = (match: MatchResult) => {
    const email = generateEmail(match.name, userType);
    setEmailModal({ open: true, matchName: match.name, email });
  };

  const stages = ["IDEA", "MVP", "REVENUE", "GROWTH"];
  const industries = ["AI/ML", "FINTECH", "HEALTHTECH", "SAAS", "AGRITECH", "EDTECH", "CLEANTECH"];

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
        <button
          onClick={() => navigate(isInvestor ? "/investor/onboarding" : "/startup/onboarding")}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          EDIT PROFILE
        </button>
        <span className={`font-mono text-[10px] uppercase tracking-widest ${isInvestor ? "text-accent" : "text-secondary"}`}>
          ■ {isInvestor ? "INVESTOR" : "FOUNDER"}_DASHBOARD
        </span>
      </div>

      {/* Search Panel */}
      <div className="border-b border-border bg-primary text-primary-foreground p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60 mb-4">
          // SEARCH_PANEL — {isInvestor ? "FIND STARTUPS" : "FIND INVESTORS"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest opacity-50 block mb-2">STAGE</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-md px-3 py-2.5 font-mono text-xs text-primary-foreground outline-none"
            >
              <option value="">ALL STAGES</option>
              {stages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest opacity-50 block mb-2">INDUSTRY</label>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-md px-3 py-2.5 font-mono text-xs text-primary-foreground outline-none"
            >
              <option value="">ALL INDUSTRIES</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              onClick={handleSearch}
              disabled={searching}
              className={`w-full flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-widest py-3 rounded-md transition-all ${
                isInvestor
                  ? "bg-accent text-accent-foreground hover:brightness-110"
                  : "bg-secondary text-secondary-foreground hover:brightness-110"
              } ${searching ? "opacity-60" : ""}`}
            >
              <Search className="w-4 h-4" />
              {searching ? "ANALYZING..." : "SEARCH & MATCH"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Match list */}
        <div className="lg:col-span-1 lg:border-r border-border">
          <div className="p-4 border-b border-border bg-muted">
            <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${isInvestor ? "text-accent" : "text-secondary"}`}>
              ■ {results.length > 0 ? `${results.length} MATCHES FOUND` : "AWAITING_SEARCH"}
            </p>
          </div>

          {searching ? (
            <>
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </>
          ) : (
            <div className="stagger-children">
              {results.map((match, i) => (
                <button
                  key={match.name}
                  onClick={() => setSelectedMatch(i)}
                  className={`p-5 border-b border-border w-full text-left transition-colors ${
                    selectedMatch === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-display text-sm uppercase">{match.name}</span>
                    <span className="font-display text-xl">{match.matchScore}%</span>
                  </div>
                  <div className="flex gap-3 mb-3">
                    <span className="font-mono text-[9px] uppercase opacity-70 border px-1.5 py-0.5 rounded-sm" style={{ borderColor: "currentColor" }}>
                      {match.type}
                    </span>
                    <span className="font-mono text-[9px] uppercase opacity-70">{match.ticketSize}</span>
                  </div>
                  <div className="score-bar rounded-sm">
                    <div
                      className="score-bar-fill"
                      style={{ "--score": `${match.matchScore}%`, "--delay": `${i * 0.15}s` } as React.CSSProperties}
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
            <>
              {/* Match detail header */}
              <div className="grid grid-cols-3 border-b border-border">
                {[
                  { label: "SELECTED", value: results[selectedMatch].name },
                  { label: "GEOGRAPHY", value: results[selectedMatch].geography },
                  { label: "FOCUS", value: results[selectedMatch].industry },
                ].map((item, i) => (
                  <div key={item.label} className={`p-4 ${i < 2 ? "border-r border-border" : ""}`}>
                    <p className="font-mono text-[9px] text-muted-foreground tracking-widest mb-1">{item.label}</p>
                    <p className="font-display text-xs sm:text-sm uppercase truncate text-primary">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* AI Reasoning */}
              <div className="p-6 sm:p-8 border-b border-border">
                <p className={`font-mono text-[10px] uppercase tracking-[0.3em] mb-4 ${isInvestor ? "text-accent" : "text-secondary"}`}>
                  ■ AI_MATCH_REASONING
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-muted border border-border p-4 rounded-md"
                >
                  <p className="font-mono text-xs leading-relaxed text-primary">
                    {results[selectedMatch].reasoning}
                  </p>
                </motion.div>
              </div>

              {/* Generate Email button (for founders) */}
              {!isInvestor && (
                <div className="p-6 sm:p-8 border-b border-border">
                  <button
                    onClick={() => openEmailModal(results[selectedMatch])}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground font-mono text-sm uppercase tracking-widest py-4 rounded-md hover:brightness-110 transition-all shadow-md"
                  >
                    <Mail className="w-4 h-4" />
                    GENERATE OUTREACH EMAIL
                  </button>
                </div>
              )}

              {/* Match score breakdown */}
              <div className="p-6 sm:p-8">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-4">
                  // COMPATIBILITY_BREAKDOWN
                </p>
                <div className="space-y-3">
                  {[
                    { label: "INDUSTRY FIT", score: results[selectedMatch].matchScore },
                    { label: "STAGE ALIGNMENT", score: Math.max(50, results[selectedMatch].matchScore - 8) },
                    { label: "TICKET SIZE MATCH", score: Math.max(40, results[selectedMatch].matchScore - 15) },
                    { label: "GEOGRAPHY", score: Math.max(45, results[selectedMatch].matchScore - 5) },
                  ].map((item, i) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="font-mono text-[10px] text-muted-foreground">{item.label}</span>
                        <span className="font-display text-sm text-primary">{item.score}%</span>
                      </div>
                      <div className="score-bar rounded-sm">
                        <div
                          className="score-bar-fill"
                          style={{ "--score": `${item.score}%`, "--delay": `${i * 0.1}s` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh] text-center p-8">
              <div>
                <p className="font-display text-5xl text-muted-foreground/30 mb-4">⟡</p>
                <p className="font-mono text-sm text-muted-foreground uppercase">
                  {results.length > 0 ? "SELECT A MATCH TO VIEW DETAILS" : "RUN A SEARCH TO DISCOVER MATCHES"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface StartupProfile {
  name: string;
  description: string;
  industry: string;
  stage: string;
  funding: string;
  location: string;
}

interface InvestorMatch {
  name: string;
  type: string;
  preferred_industry: string;
  ticket_size: string;
  geography: string;
  match_score: number;
}

interface FundingStrategy {
  title: string;
  description: string;
}

const mockInvestors: InvestorMatch[] = [
  { name: "APEX VENTURES", type: "VC", preferred_industry: "AI/ML", ticket_size: "$500K–$2M", geography: "US, INDIA", match_score: 94 },
  { name: "BLUESTONE CAPITAL", type: "ANGEL", preferred_industry: "FINTECH", ticket_size: "$100K–$500K", geography: "GLOBAL", match_score: 87 },
  { name: "GREENFIELD PARTNERS", type: "VC", preferred_industry: "CLEANTECH", ticket_size: "$1M–$5M", geography: "EU, INDIA", match_score: 78 },
  { name: "SEED FORGE", type: "ACCELERATOR", preferred_industry: "SAAS", ticket_size: "$50K–$150K", geography: "US", match_score: 72 },
  { name: "DELTA SYNDICATE", type: "SYNDICATE", preferred_industry: "HEALTHTECH", ticket_size: "$200K–$1M", geography: "SEA, INDIA", match_score: 65 },
];

const strategies: FundingStrategy[] = [
  { title: "PITCH DECK REFINEMENT", description: "Tailor your pitch to highlight traction metrics and market size for VC audiences." },
  { title: "WARM INTRODUCTIONS", description: "Leverage LinkedIn and startup networks for warm investor intros before cold outreach." },
  { title: "STAGED FUNDING", description: "Consider a convertible note or SAFE for initial rounds before a priced equity round." },
];

const sampleEmail = `Subject: Partnership Opportunity — [STARTUP_NAME] x [INVESTOR_NAME]

Dear [INVESTOR],

I'm reaching out regarding [STARTUP_NAME], a [INDUSTRY] startup currently at the [STAGE] stage. We are building [DESCRIPTION].

We are seeking [FUNDING] in funding to accelerate growth and expand our market reach. Given your portfolio focus on [PREFERRED_INDUSTRY], we believe there is strong alignment.

I would welcome the opportunity to discuss this further at your convenience.

Best regards,
[FOUNDER_NAME]`;

const Dashboard = () => {
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<number>(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("startup_profile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  if (!profile) {
    return (
      <div className="section-full">
        <div className="grid-cell flex flex-col items-center justify-center min-h-[60vh]">
          <p className="font-mono text-sm text-muted-foreground uppercase mb-6">
            // NO_STARTUP_DATA_FOUND
          </p>
          <Link
            to="/submit"
            className="bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest px-8 py-4 border border-foreground hover:bg-foreground hover:text-background transition-none"
          >
            → SUBMIT STARTUP FIRST
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Profile summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-foreground">
        {[
          { label: "STARTUP", value: profile.name },
          { label: "INDUSTRY", value: profile.industry },
          { label: "STAGE", value: profile.stage },
          { label: "FUNDING", value: `$${Number(profile.funding).toLocaleString()}` },
        ].map((item, i) => (
          <div
            key={item.label}
            className={`grid-cell ${i < 3 ? "border-r border-foreground" : ""}`}
            style={{ padding: "1.5rem var(--cell-padding)" }}
          >
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {item.label}
            </p>
            <p className="font-display text-lg uppercase mt-1 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Investor list */}
        <div className="lg:col-span-1 lg:border-r border-foreground">
          <div className="grid-cell border-b border-foreground">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              // MATCHED_INVESTORS ({mockInvestors.length})
            </p>
          </div>
          {mockInvestors.map((inv, i) => (
            <button
              key={inv.name}
              onClick={() => setSelectedInvestor(i)}
              className={`grid-cell border-b border-foreground w-full text-left transition-none ${
                selectedInvestor === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-display text-sm uppercase">{inv.name}</span>
                <span className="font-mono text-xs">{inv.match_score}%</span>
              </div>
              <div className="flex gap-3">
                <span className="font-mono text-[10px] uppercase opacity-70">{inv.type}</span>
                <span className="font-mono text-[10px] uppercase opacity-70">{inv.ticket_size}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Email preview + strategy */}
        <div className="lg:col-span-2">
          <div className="grid-cell border-b border-foreground">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
              // GENERATED_EMAIL → {mockInvestors[selectedInvestor].name}
            </p>
          </div>
          <div className="grid-cell border-b border-foreground">
            <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
              {sampleEmail
                .replace("[STARTUP_NAME]", profile.name)
                .replace("[STARTUP_NAME]", profile.name)
                .replace("[INVESTOR_NAME]", mockInvestors[selectedInvestor].name)
                .replace("[INVESTOR]", mockInvestors[selectedInvestor].name)
                .replace("[INDUSTRY]", profile.industry)
                .replace("[STAGE]", profile.stage)
                .replace("[DESCRIPTION]", profile.description)
                .replace("[FUNDING]", `$${Number(profile.funding).toLocaleString()}`)
                .replace("[PREFERRED_INDUSTRY]", mockInvestors[selectedInvestor].preferred_industry)
                .replace("[FOUNDER_NAME]", "Founder")}
            </pre>
          </div>

          {/* Strategies */}
          <div className="grid-cell border-b border-foreground">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              // FUNDING_STRATEGY_SUGGESTIONS
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {strategies.map((s, i) => (
              <div
                key={s.title}
                className={`grid-cell border-b border-foreground blueprint-flash ${
                  i < 2 ? "sm:border-r border-foreground" : ""
                }`}
                data-tag="<STRATEGY>"
              >
                <h4 className="font-display text-sm uppercase mb-2">{s.title}</h4>
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

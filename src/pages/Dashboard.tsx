import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

const mockInvestors: InvestorMatch[] = [
  { name: "APEX VENTURES", type: "VC", preferred_industry: "AI/ML", ticket_size: "$500K–$2M", geography: "US, INDIA", match_score: 94 },
  { name: "BLUESTONE CAPITAL", type: "ANGEL", preferred_industry: "FINTECH", ticket_size: "$100K–$500K", geography: "GLOBAL", match_score: 87 },
  { name: "GREENFIELD PARTNERS", type: "VC", preferred_industry: "CLEANTECH", ticket_size: "$1M–$5M", geography: "EU, INDIA", match_score: 78 },
  { name: "SEED FORGE", type: "ACCELERATOR", preferred_industry: "SAAS", ticket_size: "$50K–$150K", geography: "US", match_score: 72 },
  { name: "DELTA SYNDICATE", type: "SYNDICATE", preferred_industry: "HEALTHTECH", ticket_size: "$200K–$1M", geography: "SEA, INDIA", match_score: 65 },
];

const strategies = [
  { id: "01", title: "PITCH DECK", desc: "Tailor your pitch to highlight traction metrics and market size for VC audiences." },
  { id: "02", title: "WARM INTROS", desc: "Leverage LinkedIn and startup networks for warm investor intros before cold outreach." },
  { id: "03", title: "STAGED FUNDING", desc: "Consider a convertible note or SAFE for initial rounds before a priced equity round." },
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
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("startup_profile");
    if (stored) {
      setProfile(JSON.parse(stored));
      setTimeout(() => setShowEmail(true), 800);
    }
  }, []);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="text-center">
          <p className="font-display text-6xl text-accent mb-4">!</p>
          <p className="font-mono text-sm text-muted-foreground uppercase mb-8">
            // NO_STARTUP_DATA_FOUND
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-3 bg-accent text-accent-foreground font-mono text-sm uppercase tracking-widest px-8 py-5 rounded-md hover:brightness-110 transition-all shadow-lg"
          >
            <span className="inline-block w-2 h-2 bg-accent-foreground rounded-full" />
            SUBMIT STARTUP FIRST
          </Link>
        </div>
      </div>
    );
  }

  const selected = mockInvestors[selectedInvestor];

  return (
    <div>
      {/* Profile summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-border bg-primary text-primary-foreground">
        {[
          { label: "STARTUP", value: profile.name },
          { label: "INDUSTRY", value: profile.industry },
          { label: "STAGE", value: profile.stage },
          { label: "FUNDING", value: `$${Number(profile.funding).toLocaleString()}` },
          { label: "MATCHES", value: String(mockInvestors.length) },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 ${i < 4 ? "border-r border-primary-foreground/20" : ""}`}
          >
            <p className="font-mono text-[9px] tracking-widest opacity-50 mb-1">{item.label}</p>
            <p className="font-display text-base sm:text-lg uppercase truncate">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Investor list */}
        <div className="lg:col-span-1 lg:border-r border-border">
          <div className="p-4 border-b border-border bg-muted">
            <p className="font-mono text-[10px] text-secondary uppercase tracking-[0.3em]">
              ■ MATCHED_INVESTORS
            </p>
          </div>
          <div className="stagger-children">
            {mockInvestors.map((inv, i) => (
              <button
                key={inv.name}
                onClick={() => setSelectedInvestor(i)}
                className={`p-5 border-b border-border w-full text-left transition-colors ${
                  selectedInvestor === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-display text-sm uppercase">{inv.name}</span>
                  <span className="font-display text-xl">{inv.match_score}%</span>
                </div>
                <div className="flex gap-3 mb-3">
                  <span className="font-mono text-[9px] uppercase opacity-70 border px-1.5 py-0.5 rounded-sm" style={{ borderColor: "currentColor" }}>
                    {inv.type}
                  </span>
                  <span className="font-mono text-[9px] uppercase opacity-70">{inv.ticket_size}</span>
                </div>
                {/* Score bar */}
                <div className="score-bar rounded-sm">
                  <div
                    className="score-bar-fill"
                    style={{
                      "--score": `${inv.match_score}%`,
                      "--delay": `${i * 0.15}s`,
                    } as React.CSSProperties}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: email + strategies */}
        <div className="lg:col-span-2">
          {/* Selected investor detail */}
          <div className="grid grid-cols-3 border-b border-border">
            {[
              { label: "SELECTED", value: selected.name },
              { label: "GEOGRAPHY", value: selected.geography },
              { label: "FOCUS", value: selected.preferred_industry },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`p-4 ${i < 2 ? "border-r border-border" : ""}`}
              >
                <p className="font-mono text-[9px] text-muted-foreground tracking-widest mb-1">{item.label}</p>
                <p className="font-display text-xs sm:text-sm uppercase truncate text-primary">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="p-6 sm:p-8 border-b border-border">
            <div className="flex items-baseline justify-between mb-4">
              <p className="font-mono text-[10px] text-secondary uppercase tracking-[0.3em]">
                ■ GENERATED_EMAIL
              </p>
              <button className="font-mono text-[10px] uppercase tracking-widest border border-border px-3 py-1 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                COPY
              </button>
            </div>
            {showEmail && (
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-primary bg-muted border border-border p-4 rounded-md"
              >
                {sampleEmail
                  .split("[STARTUP_NAME]").join(profile.name)
                  .replace("[INVESTOR_NAME]", selected.name)
                  .replace("[INVESTOR]", selected.name)
                  .replace("[INDUSTRY]", profile.industry)
                  .replace("[STAGE]", profile.stage)
                  .replace("[DESCRIPTION]", profile.description)
                  .replace("[FUNDING]", `$${Number(profile.funding).toLocaleString()}`)
                  .replace("[PREFERRED_INDUSTRY]", selected.preferred_industry)
                  .replace("[FOUNDER_NAME]", "Founder")}
              </motion.pre>
            )}
          </div>

          {/* Strategies */}
          <div className="p-4 border-b border-border bg-muted">
            <p className="font-mono text-[10px] text-secondary uppercase tracking-[0.3em]">
              ■ FUNDING_STRATEGY
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {strategies.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`p-6 border-b border-border hover:bg-muted transition-colors ${
                  i < 2 ? "sm:border-r border-border" : ""
                }`}
              >
                <span className="font-display text-3xl text-accent block mb-2">{s.id}</span>
                <h4 className="font-display text-sm uppercase mb-2 text-primary">{s.title}</h4>
                <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

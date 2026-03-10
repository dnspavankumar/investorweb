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
      <div className="flex flex-col items-center justify-center min-h-[60vh] grid-cell">
        <div className="text-center">
          <p className="font-display text-6xl text-primary mb-4">!</p>
          <p className="font-mono text-sm text-muted-foreground uppercase mb-8">
            // NO_STARTUP_DATA_FOUND
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest px-8 py-5 border border-foreground hover:bg-foreground hover:text-background transition-none"
          >
            <span className="inline-block w-2 h-2 bg-primary-foreground" />
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
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-foreground bg-foreground text-background">
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
            className={`grid-cell ${i < 4 ? "border-r" : ""}`}
            style={{ borderColor: "hsl(var(--muted-foreground))", padding: "1.25rem var(--cell-padding)" }}
          >
            <p className="font-mono text-[9px] tracking-widest opacity-50 mb-1">{item.label}</p>
            <p className="font-display text-base sm:text-lg uppercase truncate">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Investor list */}
        <div className="lg:col-span-1 lg:border-r border-foreground">
          <div className="grid-cell border-b border-foreground">
            <p className="font-mono text-[10px] text-primary uppercase tracking-[0.3em]">
              ■ MATCHED_INVESTORS
            </p>
          </div>
          <div className="stagger-children">
            {mockInvestors.map((inv, i) => (
              <button
                key={inv.name}
                onClick={() => setSelectedInvestor(i)}
                className={`grid-cell border-b border-foreground w-full text-left transition-none blueprint-flash ${
                  selectedInvestor === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground"
                }`}
                data-tag={`<INVESTOR_${String(i + 1).padStart(2, "0")}>`}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-display text-sm uppercase">{inv.name}</span>
                  <span className="font-display text-xl">{inv.match_score}%</span>
                </div>
                <div className="flex gap-3 mb-3">
                  <span className="font-mono text-[9px] uppercase opacity-70 border px-1.5 py-0.5" style={{ borderColor: "currentColor" }}>
                    {inv.type}
                  </span>
                  <span className="font-mono text-[9px] uppercase opacity-70">{inv.ticket_size}</span>
                </div>
                {/* Score bar */}
                <div className="score-bar">
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
          <div className="grid grid-cols-3 border-b border-foreground">
            {[
              { label: "SELECTED", value: selected.name },
              { label: "GEOGRAPHY", value: selected.geography },
              { label: "FOCUS", value: selected.preferred_industry },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`grid-cell ${i < 2 ? "border-r border-foreground" : ""}`}
                style={{ padding: "1rem var(--cell-padding)" }}
              >
                <p className="font-mono text-[9px] text-muted-foreground tracking-widest mb-1">{item.label}</p>
                <p className="font-display text-xs sm:text-sm uppercase truncate">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="grid-cell border-b border-foreground">
            <div className="flex items-baseline justify-between mb-4">
              <p className="font-mono text-[10px] text-primary uppercase tracking-[0.3em]">
                ■ GENERATED_EMAIL
              </p>
              <button className="font-mono text-[10px] uppercase tracking-widest border border-foreground px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-none">
                COPY
              </button>
            </div>
            {showEmail && (
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground bg-secondary border border-foreground p-4"
              >
                {sampleEmail
                  .replaceAll("[STARTUP_NAME]", profile.name)
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
          <div className="grid-cell border-b border-foreground">
            <p className="font-mono text-[10px] text-primary uppercase tracking-[0.3em]">
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
                className={`grid-cell border-b border-foreground blueprint-flash ${
                  i < 2 ? "sm:border-r border-foreground" : ""
                }`}
                data-tag="<STRATEGY>"
              >
                <span className="font-display text-3xl text-primary block mb-2">{s.id}</span>
                <h4 className="font-display text-sm uppercase mb-2">{s.title}</h4>
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

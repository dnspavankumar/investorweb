import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const industries = [
  "FINTECH", "HEALTHTECH", "EDTECH", "AGRITECH", "SAAS",
  "E-COMMERCE", "AI/ML", "CLEANTECH", "BIOTECH", "OTHER",
];
const stages = [
  { id: "IDEA", desc: "Concept stage, no product yet" },
  { id: "MVP", desc: "Minimum viable product built" },
  { id: "REVENUE", desc: "Generating revenue" },
  { id: "GROWTH", desc: "Scaling operations" },
];

interface OnboardingFormProps {
  userType: "startup" | "investor";
}

const OnboardingForm = ({ userType }: OnboardingFormProps) => {
  const navigate = useNavigate();
  const isInvestor = userType === "investor";

  // Startup fields
  const [startupForm, setStartupForm] = useState({
    name: "", description: "", industry: "", stage: "", funding: "", location: "",
  });
  // Investor fields
  const [investorForm, setInvestorForm] = useState({
    firmName: "", preferredSectors: [] as string[], minInvestment: "", maxInvestment: "", stage: "", bio: "",
  });

  const updateStartup = (key: string, value: string) =>
    setStartupForm((prev) => ({ ...prev, [key]: value }));

  const toggleSector = (sector: string) => {
    setInvestorForm((prev) => ({
      ...prev,
      preferredSectors: prev.preferredSectors.includes(sector)
        ? prev.preferredSectors.filter((s) => s !== sector)
        : [...prev.preferredSectors, sector],
    }));
  };

  const updateInvestor = (key: string, value: string) =>
    setInvestorForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvestor) {
      sessionStorage.setItem("investor_profile", JSON.stringify(investorForm));
      toast.success("Investor profile saved!");
      navigate("/investor/dashboard");
    } else {
      sessionStorage.setItem("startup_profile", JSON.stringify(startupForm));
      toast.success("Startup profile saved!");
      navigate("/startup/dashboard");
    }
  };

  // Progress calculation
  const startupFilled = [startupForm.name, startupForm.description, startupForm.industry, startupForm.stage, startupForm.funding].filter(Boolean).length;
  const investorFilled = [investorForm.firmName, investorForm.preferredSectors.length > 0, investorForm.minInvestment, investorForm.maxInvestment, investorForm.stage].filter(Boolean).length;
  const filled = isInvestor ? investorFilled : startupFilled;
  const progress = (filled / 5) * 100;

  return (
    <div>
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className={`h-full ${isInvestor ? "bg-accent" : "bg-secondary"}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-border">
          <div className="lg:col-span-2 p-6 sm:p-8 lg:border-r border-border">
            <div className="flex items-baseline justify-between">
              <div>
                <p className={`font-mono text-[10px] uppercase tracking-[0.3em] mb-2 ${isInvestor ? "text-accent" : "text-secondary"}`}>
                  ■ {isInvestor ? "INVESTOR_PREFERENCES" : "STARTUP_PROFILE"}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl uppercase text-primary">
                  {isInvestor ? "SET YOUR PREFERENCES" : "SUBMIT YOUR STARTUP"}
                </h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{filled}/5 FIELDS</span>
            </div>
          </div>
          <div className="p-6 sm:p-8 flex items-center justify-center">
            <div className="text-center">
              <p className={`font-display text-4xl ${isInvestor ? "text-accent" : "text-secondary"}`}>{Math.round(progress)}%</p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest">COMPLETE</p>
            </div>
          </div>
        </div>

        {isInvestor ? (
          /* ===== INVESTOR FORM ===== */
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 lg:border-r border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="p-6 sm:p-8 border-b border-border sm:border-r">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                    FIRM / NAME <span className="text-accent">*</span>
                  </label>
                  <input
                    required
                    value={investorForm.firmName}
                    onChange={(e) => updateInvestor("firmName", e.target.value)}
                    className="w-full bg-transparent border-b-2 border-border font-display text-xl py-2 outline-none focus:border-accent uppercase placeholder:text-muted-foreground placeholder:font-mono placeholder:text-sm placeholder:normal-case text-primary"
                    placeholder="Firm or investor name..."
                  />
                </div>
                <div className="p-6 sm:p-8 border-b border-border">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                    PREFERRED STAGE <span className="text-accent">*</span>
                  </label>
                  <div className="flex flex-col gap-1">
                    {stages.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => updateInvestor("stage", s.id)}
                        className={`font-mono text-[10px] uppercase px-3 py-2.5 border border-border text-left rounded-sm transition-colors ${
                          investorForm.stage === s.id
                            ? "bg-accent text-accent-foreground"
                            : "bg-card text-card-foreground hover:bg-muted"
                        }`}
                      >
                        {investorForm.stage === s.id ? "■" : "→"} {s.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="p-6 sm:p-8 border-b border-border sm:border-r">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                    MIN CHECK SIZE (USD) <span className="text-accent">*</span>
                  </label>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl text-accent">$</span>
                    <input
                      required
                      type="number"
                      value={investorForm.minInvestment}
                      onChange={(e) => updateInvestor("minInvestment", e.target.value)}
                      className="w-full bg-transparent border-b-2 border-border font-display text-2xl py-2 outline-none focus:border-accent placeholder:text-muted-foreground placeholder:text-base placeholder:font-mono text-primary"
                      placeholder="50000"
                    />
                  </div>
                </div>
                <div className="p-6 sm:p-8 border-b border-border">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                    MAX CHECK SIZE (USD) <span className="text-accent">*</span>
                  </label>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl text-accent">$</span>
                    <input
                      required
                      type="number"
                      value={investorForm.maxInvestment}
                      onChange={(e) => updateInvestor("maxInvestment", e.target.value)}
                      className="w-full bg-transparent border-b-2 border-border font-display text-2xl py-2 outline-none focus:border-accent placeholder:text-muted-foreground placeholder:text-base placeholder:font-mono text-primary"
                      placeholder="500000"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 border-b border-border">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                  BIO / INVESTMENT THESIS
                </label>
                <textarea
                  rows={4}
                  value={investorForm.bio}
                  onChange={(e) => updateInvestor("bio", e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border font-mono text-sm py-2 outline-none focus:border-accent resize-none leading-relaxed placeholder:text-muted-foreground text-primary"
                  placeholder="Describe your investment focus and thesis..."
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="p-6 sm:p-8 border-b border-border flex-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                  TARGET SECTORS <span className="text-accent">*</span>
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {industries.map((ind) => (
                    <button
                      type="button"
                      key={ind}
                      onClick={() => toggleSector(ind)}
                      className={`font-mono text-[10px] uppercase px-2 py-3 border border-border rounded-sm transition-colors text-left ${
                        investorForm.preferredSectors.includes(ind)
                          ? "bg-accent text-accent-foreground"
                          : "bg-card text-card-foreground hover:bg-muted"
                      }`}
                    >
                      {investorForm.preferredSectors.includes(ind) ? "■" : "□"} {ind}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={filled < 5}
                className={`p-6 sm:p-8 font-mono text-sm uppercase tracking-widest py-8 transition-colors border-b border-border rounded-sm ${
                  filled >= 5
                    ? "bg-accent text-accent-foreground hover:brightness-110 shadow-md"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {filled >= 5 ? "→ FIND STARTUPS" : `FILL ${5 - filled} MORE FIELD${5 - filled > 1 ? "S" : ""}`}
              </button>
            </div>
          </div>
        ) : (
          /* ===== STARTUP FORM ===== */
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 lg:border-r border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="p-6 sm:p-8 border-b border-border sm:border-r">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                    STARTUP_NAME <span className="text-secondary">*</span>
                  </label>
                  <input
                    required
                    value={startupForm.name}
                    onChange={(e) => updateStartup("name", e.target.value)}
                    className="w-full bg-transparent border-b-2 border-border font-display text-xl py-2 outline-none focus:border-secondary uppercase placeholder:text-muted-foreground placeholder:font-mono placeholder:text-sm placeholder:normal-case text-primary"
                    placeholder="Enter name..."
                  />
                </div>
                <div className="p-6 sm:p-8 border-b border-border">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                    LOCATION
                  </label>
                  <input
                    value={startupForm.location}
                    onChange={(e) => updateStartup("location", e.target.value)}
                    className="w-full bg-transparent border-b-2 border-border font-display text-xl py-2 outline-none focus:border-secondary uppercase placeholder:text-muted-foreground placeholder:font-mono placeholder:text-sm placeholder:normal-case text-primary"
                    placeholder="City, Country..."
                  />
                </div>
              </div>

              <div className="p-6 sm:p-8 border-b border-border">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                  STARTUP_IDEA <span className="text-secondary">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={startupForm.description}
                  onChange={(e) => updateStartup("description", e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border font-mono text-sm py-2 outline-none focus:border-secondary resize-none leading-relaxed placeholder:text-muted-foreground text-primary"
                  placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target market?"
                />
              </div>

              <div className="p-6 sm:p-8 border-b border-border">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                  FUNDING_NEEDED (USD) <span className="text-secondary">*</span>
                </label>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl text-secondary">$</span>
                  <input
                    required
                    type="number"
                    value={startupForm.funding}
                    onChange={(e) => updateStartup("funding", e.target.value)}
                    className="w-full bg-transparent border-b-2 border-border font-display text-3xl py-2 outline-none focus:border-secondary placeholder:text-muted-foreground placeholder:text-lg placeholder:font-mono text-primary"
                    placeholder="500000"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="p-6 sm:p-8 border-b border-border">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                  INDUSTRY <span className="text-secondary">*</span>
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {industries.map((ind) => (
                    <button
                      type="button"
                      key={ind}
                      onClick={() => updateStartup("industry", ind)}
                      className={`font-mono text-[10px] uppercase px-2 py-3 border border-border rounded-sm transition-colors text-left ${
                        startupForm.industry === ind
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-card text-card-foreground hover:bg-muted"
                      }`}
                    >
                      {startupForm.industry === ind ? "■" : "□"} {ind}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8 border-b border-border flex-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                  STAGE <span className="text-secondary">*</span>
                </label>
                <div className="flex flex-col gap-1">
                  {stages.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => updateStartup("stage", s.id)}
                      className={`font-mono text-[10px] uppercase px-3 py-3 border border-border text-left rounded-sm transition-colors ${
                        startupForm.stage === s.id
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-card text-card-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="font-display text-sm block">{startupForm.stage === s.id ? "■" : "→"} {s.id}</span>
                      <span className={`text-[9px] ${startupForm.stage === s.id ? "opacity-80" : "text-muted-foreground"}`}>
                        {s.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={filled < 5}
                className={`p-6 sm:p-8 font-mono text-sm uppercase tracking-widest py-8 transition-colors border-b border-border rounded-sm ${
                  filled >= 5
                    ? "bg-secondary text-secondary-foreground hover:brightness-110 shadow-md"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {filled >= 5 ? "→ ANALYZE & MATCH" : `FILL ${5 - filled} MORE FIELD${5 - filled > 1 ? "S" : ""}`}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingForm;

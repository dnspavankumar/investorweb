import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";

const industries = [
  "FinTech", "HealthTech", "EdTech", "AgriTech", "SaaS",
  "E-Commerce", "AI/ML", "CleanTech", "BioTech", "Other",
];

const stages = [
  { id: "PRE_SEED", label: "Pre-Seed", desc: "Concept stage, validating the idea" },
  { id: "SEED", label: "Seed", desc: "Building MVP, early traction" },
  { id: "SERIES_A", label: "Series A", desc: "Product-market fit, scaling" },
  { id: "GROWTH", label: "Growth", desc: "Rapid scaling & expansion" },
];

const valueAddOptions = ["Network & Intros", "Hiring Support", "Tech Guidance", "Board Seats", "Go-to-Market", "Regulatory"];
const coInvestOptions = ["Lead Rounds", "Follow-on Only", "Open to Both"];
const diligenceOptions = ["< 2 Weeks", "2–4 Weeks", "1–2 Months", "2+ Months"];
const regionalOptions = ["Pan-India", "Bangalore/Chennai", "Mumbai/Pune", "Delhi-NCR", "Global", "Southeast Asia"];

interface OnboardingFormProps {
  userType: "startup" | "investor";
}

// ===== STARTUP WIZARD STEPS =====
const startupSteps = ["Basics", "Your Idea", "Funding", "Industry & Stage"];

// ===== INVESTOR WIZARD STEPS =====
const investorSteps = ["Basics", "Ticket Size", "Investment Thesis", "Preferences", "Value-Add"];

const OnboardingForm = ({ userType }: OnboardingFormProps) => {
  const navigate = useNavigate();
  const isInvestor = userType === "investor";
  const [step, setStep] = useState(0);

  const steps = isInvestor ? investorSteps : startupSteps;
  const totalSteps = steps.length;

  // Startup fields
  const [startupForm, setStartupForm] = useState({
    name: "", description: "", industry: "", stage: "", funding: "", location: "",
  });

  // Investor fields (enhanced)
  const [investorForm, setInvestorForm] = useState({
    firmName: "",
    minTicket: "",
    maxTicket: "",
    thesis: "",
    coInvestment: "",
    valueAdd: [] as string[],
    preferredSectors: [] as string[],
    stage: "",
    antiPortfolio: "",
    diligenceTimeframe: "",
    regionalFocus: [] as string[],
  });

  const updateStartup = (key: string, value: string) =>
    setStartupForm((prev) => ({ ...prev, [key]: value }));

  const updateInvestor = (key: string, value: string) =>
    setInvestorForm((prev) => ({ ...prev, [key]: value }));

  const toggleInvestorArray = (key: "valueAdd" | "preferredSectors" | "regionalFocus", value: string) => {
    setInvestorForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const progress = ((step + 1) / totalSteps) * 100;

  const canProceed = () => {
    if (isInvestor) {
      switch (step) {
        case 0: return !!investorForm.firmName;
        case 1: return !!investorForm.minTicket && !!investorForm.maxTicket;
        case 2: return !!investorForm.thesis;
        case 3: return investorForm.preferredSectors.length > 0 && !!investorForm.stage;
        case 4: return true;
        default: return true;
      }
    } else {
      switch (step) {
        case 0: return !!startupForm.name && !!startupForm.location;
        case 1: return !!startupForm.description;
        case 2: return !!startupForm.funding;
        case 3: return !!startupForm.industry && !!startupForm.stage;
        default: return true;
      }
    }
  };

  const handleSubmit = () => {
    if (isInvestor) {
      sessionStorage.setItem("investor_profile", JSON.stringify(investorForm));
      toast.success("Profile saved successfully!");
      navigate("/investor/dashboard");
    } else {
      sessionStorage.setItem("startup_profile", JSON.stringify(startupForm));
      toast.success("Profile saved successfully!");
      navigate("/startup/dashboard");
    }
  };

  const nextStep = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else handleSubmit();
  };
  const prevStep = () => { if (step > 0) setStep(step - 1); };

  const accentColor = isInvestor ? "accent" : "primary";

  const renderStartupStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">Startup Name</label>
              <input
                value={startupForm.name}
                onChange={(e) => updateStartup("name", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-body outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                placeholder="What's your startup called?"
              />
            </div>
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">Location</label>
              <input
                value={startupForm.location}
                onChange={(e) => updateStartup("location", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-body outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                placeholder="City, Country"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">
              Describe your startup idea
            </label>
            <p className="text-xs text-muted-foreground mb-4 font-body">What problem does it solve? Who is your target market?</p>
            <textarea
              rows={6}
              value={startupForm.description}
              onChange={(e) => updateStartup("description", e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-body outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none leading-relaxed placeholder:text-muted-foreground"
              placeholder="Tell us about your vision..."
            />
          </div>
        );
      case 2:
        return (
          <div>
            <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">
              Funding Needed (₹ INR)
            </label>
            <p className="text-xs text-muted-foreground mb-4 font-body">How much capital are you raising?</p>
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl text-primary font-bold">₹</span>
              <input
                type="number"
                value={startupForm.funding}
                onChange={(e) => updateStartup("funding", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-display text-2xl font-bold outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground placeholder:text-lg placeholder:font-body placeholder:font-normal"
                placeholder="50,00,000"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-3">Industry</label>
              <div className="grid grid-cols-2 gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => updateStartup("industry", ind)}
                    className={`text-left px-4 py-3 rounded-lg border text-sm font-body transition-all ${
                      startupForm.industry === ind
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-secondary/30 border-border text-muted-foreground hover:border-border hover:bg-secondary/50"
                    }`}
                  >
                    {startupForm.industry === ind && <Check className="w-3 h-3 inline mr-2" />}
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-3">Stage</label>
              <div className="space-y-2">
                {stages.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateStartup("stage", s.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-lg border transition-all ${
                      startupForm.stage === s.id
                        ? "bg-primary/10 border-primary/30"
                        : "bg-secondary/30 border-border hover:bg-secondary/50"
                    }`}
                  >
                    <span className={`font-display text-sm font-semibold ${startupForm.stage === s.id ? 'text-primary' : 'text-foreground'}`}>
                      {s.label}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5 font-body">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderInvestorStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">
              Firm or Investor Name
            </label>
            <input
              value={investorForm.firmName}
              onChange={(e) => updateInvestor("firmName", e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-body outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted-foreground"
              placeholder="Your firm or name"
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <p className="text-xs text-muted-foreground font-body">
              What is your typical investment range per startup? All values in Indian Rupees (₹).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">Minimum (₹)</label>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl text-accent font-bold">₹</span>
                  <input
                    type="number"
                    value={investorForm.minTicket}
                    onChange={(e) => updateInvestor("minTicket", e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-display font-bold outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted-foreground placeholder:font-body placeholder:font-normal placeholder:text-sm"
                    placeholder="25,00,000"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">Maximum (₹)</label>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl text-accent font-bold">₹</span>
                  <input
                    type="number"
                    value={investorForm.maxTicket}
                    onChange={(e) => updateInvestor("maxTicket", e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-display font-bold outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted-foreground placeholder:font-body placeholder:font-normal placeholder:text-sm"
                    placeholder="5,00,00,000"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">
                Investment Thesis
              </label>
              <p className="text-xs text-muted-foreground mb-3 font-body">
                What specific problems are you looking to solve with your capital?
              </p>
              <textarea
                rows={4}
                value={investorForm.thesis}
                onChange={(e) => updateInvestor("thesis", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-body outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none placeholder:text-muted-foreground leading-relaxed"
                placeholder="Describe your investment thesis and focus areas..."
              />
            </div>
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">
                Anti-Portfolio — Industries you never invest in
              </label>
              <input
                value={investorForm.antiPortfolio}
                onChange={(e) => updateInvestor("antiPortfolio", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-body outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted-foreground"
                placeholder="e.g., Gambling, Tobacco, Crypto"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-3">Target Sectors</label>
              <div className="grid grid-cols-2 gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => toggleInvestorArray("preferredSectors", ind)}
                    className={`text-left px-4 py-3 rounded-lg border text-sm font-body transition-all ${
                      investorForm.preferredSectors.includes(ind)
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {investorForm.preferredSectors.includes(ind) && <Check className="w-3 h-3 inline mr-2" />}
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-3">Preferred Stage</label>
              <div className="space-y-2">
                {stages.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateInvestor("stage", s.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-lg border transition-all ${
                      investorForm.stage === s.id
                        ? "bg-accent/10 border-accent/30"
                        : "bg-secondary/30 border-border hover:bg-secondary/50"
                    }`}
                  >
                    <span className={`font-display text-sm font-semibold ${investorForm.stage === s.id ? 'text-accent' : 'text-foreground'}`}>
                      {s.label}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5 font-body">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">
                Co-Investment Interest
              </label>
              <p className="text-xs text-muted-foreground mb-3 font-body">Are you open to lead rounds or follow-on only?</p>
              <div className="space-y-2">
                {coInvestOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateInvestor("coInvestment", opt)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-body transition-all ${
                      investorForm.coInvestment === opt
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {investorForm.coInvestment === opt && <Check className="w-3 h-3 inline mr-2" />}
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">
                Value-Add — Besides capital, what do you provide?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {valueAddOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInvestorArray("valueAdd", opt)}
                    className={`text-left px-3 py-2.5 rounded-lg border text-sm font-body transition-all ${
                      investorForm.valueAdd.includes(opt)
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {investorForm.valueAdd.includes(opt) && <Check className="w-3 h-3 inline mr-1" />}
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">
                Typical Diligence Timeframe
              </label>
              <div className="grid grid-cols-2 gap-2">
                {diligenceOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateInvestor("diligenceTimeframe", opt)}
                    className={`text-left px-3 py-2.5 rounded-lg border text-sm font-body transition-all ${
                      investorForm.diligenceTimeframe === opt
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {investorForm.diligenceTimeframe === opt && <Check className="w-3 h-3 inline mr-1" />}
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-2">
                Regional Focus
              </label>
              <div className="grid grid-cols-2 gap-2">
                {regionalOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInvestorArray("regionalFocus", opt)}
                    className={`text-left px-3 py-2.5 rounded-lg border text-sm font-body transition-all ${
                      investorForm.regionalFocus.includes(opt)
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {investorForm.regionalFocus.includes(opt) && <Check className="w-3 h-3 inline mr-1" />}
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress */}
      <div className="h-1 bg-muted">
        <motion.div
          className={`h-full ${isInvestor ? "bg-accent" : "bg-primary"}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] ${isInvestor ? 'bg-accent/3' : 'bg-primary/3'} rounded-full blur-3xl pointer-events-none`} />

        <div className="w-full max-w-xl relative z-10">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors font-body"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold transition-all ${
                    i < step ? `bg-${accentColor} text-${accentColor}-foreground` :
                    i === step ? `border-2 border-${accentColor} text-${accentColor}` :
                    "border border-border text-muted-foreground"
                  }`}>
                    {i < step ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-px ${i < step ? `bg-${accentColor}` : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-body">
              {step + 1}/{totalSteps}
            </span>
          </div>

          {/* Step title */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {steps[step]}
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              {isInvestor ? "Investor Profile" : "Startup Profile"} — Step {step + 1} of {totalSteps}
            </p>
          </motion.div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 sm:p-8 mb-6"
            >
              {isInvestor ? renderInvestorStep() : renderStartupStep()}
            </motion.div>
          </AnimatePresence>

          {/* Next button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={nextStep}
            disabled={!canProceed()}
            className={`w-full flex items-center justify-center gap-2 font-display font-semibold text-sm py-4 rounded-xl transition-all ${
              canProceed()
                ? isInvestor
                  ? "bg-accent text-accent-foreground glow-gold hover:brightness-110"
                  : "bg-primary text-primary-foreground glow-emerald hover:brightness-110"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {step === totalSteps - 1 ? (
              <>Complete & Find Matches</>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;

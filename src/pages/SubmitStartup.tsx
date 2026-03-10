import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

const SubmitStartup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    industry: "",
    stage: "",
    funding: "",
    location: "",
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("startup_profile", JSON.stringify(form));
    navigate("/dashboard");
  };

  const filled = [form.name, form.description, form.industry, form.stage, form.funding].filter(Boolean).length;
  const progress = (filled / 5) * 100;

  return (
    <div>
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-secondary"
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
                <p className="font-mono text-[10px] text-secondary uppercase tracking-[0.3em] mb-2">
                  ■ DATA_INPUT_REQUIRED
                </p>
                <h2 className="font-display text-3xl sm:text-4xl uppercase text-primary">SUBMIT YOUR STARTUP</h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{filled}/5 FIELDS</span>
            </div>
          </div>
          <div className="p-6 sm:p-8 flex items-center justify-center">
            <div className="text-center">
              <p className="font-display text-4xl text-secondary">{Math.round(progress)}%</p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest">COMPLETE</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left: text inputs */}
          <div className="lg:col-span-2 lg:border-r border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-6 sm:p-8 border-b border-border sm:border-r">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                  STARTUP_NAME <span className="text-accent">*</span>
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border font-display text-xl py-2 outline-none focus:border-secondary uppercase placeholder:text-muted-foreground placeholder:font-mono placeholder:text-sm placeholder:normal-case text-primary"
                  placeholder="Enter name..."
                />
              </div>
              <div className="p-6 sm:p-8 border-b border-border">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                  LOCATION
                </label>
                <input
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border font-display text-xl py-2 outline-none focus:border-secondary uppercase placeholder:text-muted-foreground placeholder:font-mono placeholder:text-sm placeholder:normal-case text-primary"
                  placeholder="City, Country..."
                />
              </div>
            </div>

            <div className="p-6 sm:p-8 border-b border-border">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                STARTUP_IDEA <span className="text-accent">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="w-full bg-transparent border-b-2 border-border font-mono text-sm py-2 outline-none focus:border-secondary resize-none leading-relaxed placeholder:text-muted-foreground text-primary"
                placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target market?"
              />
            </div>

            <div className="p-6 sm:p-8 border-b border-border">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                FUNDING_NEEDED (USD) <span className="text-accent">*</span>
              </label>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl text-accent">$</span>
                <input
                  required
                  type="number"
                  value={form.funding}
                  onChange={(e) => update("funding", e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border font-display text-3xl py-2 outline-none focus:border-secondary placeholder:text-muted-foreground placeholder:text-lg placeholder:font-mono text-primary"
                  placeholder="500000"
                />
              </div>
            </div>
          </div>

          {/* Right: selectors */}
          <div className="flex flex-col">
            <div className="p-6 sm:p-8 border-b border-border">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                INDUSTRY <span className="text-accent">*</span>
              </label>
              <div className="grid grid-cols-2 gap-1">
                {industries.map((ind) => (
                  <button
                    type="button"
                    key={ind}
                    onClick={() => update("industry", ind)}
                    className={`font-mono text-[10px] uppercase px-2 py-3 border border-border rounded-sm transition-colors text-left ${
                      form.industry === ind
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-card text-card-foreground hover:bg-muted"
                    }`}
                  >
                    {form.industry === ind ? "■" : "□"} {ind}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 border-b border-border flex-1">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
                STAGE <span className="text-accent">*</span>
              </label>
              <div className="flex flex-col gap-1">
                {stages.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => update("stage", s.id)}
                    className={`font-mono text-[10px] uppercase px-3 py-3 border border-border text-left rounded-sm transition-colors ${
                      form.stage === s.id
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-card text-card-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="font-display text-sm block">{form.stage === s.id ? "■" : "→"} {s.id}</span>
                    <span className={`text-[9px] ${form.stage === s.id ? "opacity-80" : "text-muted-foreground"}`}>
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
                  ? "bg-accent text-accent-foreground hover:brightness-110 shadow-md"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {filled >= 5 ? "→ ANALYZE & MATCH" : `FILL ${5 - filled} MORE FIELD${5 - filled > 1 ? "S" : ""}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmitStartup;

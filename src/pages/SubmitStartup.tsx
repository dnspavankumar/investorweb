import { useState } from "react";
import { useNavigate } from "react-router-dom";

const industries = [
  "FINTECH", "HEALTHTECH", "EDTECH", "AGRITECH", "SAAS",
  "E-COMMERCE", "AI/ML", "CLEANTECH", "BIOTECH", "OTHER",
];
const stages = ["IDEA", "MVP", "REVENUE", "GROWTH"];

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
    // Store in sessionStorage for demo purposes
    sessionStorage.setItem("startup_profile", JSON.stringify(form));
    navigate("/dashboard");
  };

  return (
    <div className="section-full">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3">
        {/* Form fields */}
        <div className="lg:col-span-2 lg:border-r border-foreground">
          <div className="grid-cell border-b border-foreground">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
              // ENTER_STARTUP_DATA
            </p>
            <h2 className="font-display text-3xl uppercase">SUBMIT YOUR STARTUP</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Name */}
            <div className="grid-cell border-b border-foreground sm:border-r">
              <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-3">
                STARTUP_NAME *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full bg-transparent border-b border-foreground font-mono text-sm py-2 outline-none focus:border-primary"
                placeholder="Enter name..."
              />
            </div>
            {/* Location */}
            <div className="grid-cell border-b border-foreground">
              <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-3">
                LOCATION
              </label>
              <input
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                className="w-full bg-transparent border-b border-foreground font-mono text-sm py-2 outline-none focus:border-primary"
                placeholder="City, Country..."
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid-cell border-b border-foreground">
            <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-3">
              STARTUP_IDEA *
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full bg-transparent border-b border-foreground font-mono text-sm py-2 outline-none focus:border-primary resize-none"
              placeholder="Describe your startup idea in detail..."
            />
          </div>

          {/* Funding */}
          <div className="grid-cell border-b border-foreground">
            <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-3">
              FUNDING_NEEDED (USD) *
            </label>
            <input
              required
              value={form.funding}
              onChange={(e) => update("funding", e.target.value)}
              className="w-full bg-transparent border-b border-foreground font-mono text-sm py-2 outline-none focus:border-primary"
              placeholder="e.g. 500000"
            />
          </div>
        </div>

        {/* Right column: selectors + submit */}
        <div className="flex flex-col">
          {/* Industry */}
          <div className="grid-cell border-b border-foreground flex-1">
            <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-4">
              INDUSTRY *
            </label>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <button
                  type="button"
                  key={ind}
                  onClick={() => update("industry", ind)}
                  className={`font-mono text-xs uppercase px-3 py-2 border border-foreground transition-none ${
                    form.industry === ind
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Stage */}
          <div className="grid-cell border-b border-foreground flex-1">
            <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-4">
              STAGE *
            </label>
            <div className="flex flex-col gap-2">
              {stages.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => update("stage", s)}
                  className={`font-mono text-xs uppercase px-3 py-3 border border-foreground text-left transition-none ${
                    form.stage === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  → {s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="grid-cell bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-none py-6"
          >
            → ANALYZE &amp; MATCH
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitStartup;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import TypingText from "@/components/TypingText";

const features = [
  {
    id: "01",
    title: "STARTUP ANALYSIS",
    desc: "AI reads your idea, identifies industry, understands stage, and decides investor type.",
    tag: "<ANALYZER>",
  },
  {
    id: "02",
    title: "INVESTOR MATCHING",
    desc: "Rule-based algorithm scores compatibility across industry, geography, and ticket size.",
    tag: "<MATCHER>",
  },
  {
    id: "03",
    title: "EMAIL GENERATION",
    desc: "AI generates personalized investor outreach emails ready to send.",
    tag: "<GENERATOR>",
  },
  {
    id: "04",
    title: "STRATEGY ADVISOR",
    desc: "Funding strategy suggestions and next steps for your startup stage.",
    tag: "<ADVISOR>",
  },
];

const stats = [
  { value: 2847, suffix: "+", label: "STARTUPS INDEXED" },
  { value: 512, suffix: "", label: "ACTIVE INVESTORS" },
  { value: 94, suffix: "%", label: "MATCH ACCURACY" },
  { value: 48, suffix: "H", label: "AVG RESPONSE TIME" },
];

const Index = () => {
  return (
    <div>
      {/* HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Left: Main hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 grid-cell flex flex-col justify-center min-h-[70vh] lg:min-h-[80vh] lg:border-r border-foreground relative"
        >
          {/* Corner decoration */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary opacity-50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary opacity-50" />

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-xs text-primary uppercase tracking-[0.3em] mb-8"
          >
            ■ SYSTEM v0.1 — ONLINE
          </motion.p>

          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl uppercase leading-[0.9] mb-4">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="block"
            >
              FIND YOUR
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="block text-primary"
            >
              INVESTOR
            </motion.span>
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="font-mono text-sm text-muted-foreground h-6 mb-10"
          >
            <span className="text-primary">→ </span>
            <TypingText
              texts={[
                "AI-powered startup-investor matchmaking",
                "Generate outreach emails in seconds",
                "Smart funding strategy suggestions",
                "Rule-based compatibility scoring",
              ]}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <Link
              to="/submit"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest px-8 py-5 border border-foreground hover:bg-foreground hover:text-background transition-none group"
            >
              <span className="inline-block w-2 h-2 bg-primary-foreground group-hover:bg-background" />
              SUBMIT YOUR STARTUP
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Feature stack */}
        <div className="lg:col-span-2 flex flex-col stagger-children">
          {features.map((item) => (
            <div
              key={item.id}
              className="grid-cell border-b border-foreground blueprint-flash flex-1 flex flex-col justify-center min-h-[120px]"
              data-tag={item.tag}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-[10px] text-primary font-semibold tracking-widest">
                  {item.id}
                </span>
                <h3 className="font-display text-base uppercase">{item.title}</h3>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-foreground bg-foreground text-background">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`grid-cell text-center border-foreground ${i < stats.length - 1 ? "border-r" : ""}`}
            style={{ borderColor: "hsl(var(--muted-foreground))", padding: "2rem var(--cell-padding)" }}
          >
            <p className="font-display text-3xl sm:text-4xl text-primary mb-1">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </p>
            <p className="font-mono text-[10px] tracking-widest opacity-60">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* WORKFLOW */}
      <div className="grid-cell border-b border-foreground">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">
          // SYSTEM_WORKFLOW
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-0">
          {[
            "ENTER DETAILS",
            "AI ANALYSIS",
            "PROFILE MATCH",
            "RANKED LIST",
            "EMAIL GEN",
            "STRATEGY",
          ].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 py-2"
            >
              <span className="font-display text-3xl text-primary leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider">{step}</span>
              {i < 5 && <span className="font-mono text-muted-foreground ml-auto hidden lg:inline">→</span>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* BOTTOM TECH BAR */}
      <div className="grid grid-cols-4 border-b border-foreground">
        {["REACT.JS", "TAILWIND", "AI AGENTS", "GROQ API"].map((tech, i) => (
          <div
            key={tech}
            className={`text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground ${
              i < 3 ? "border-r border-foreground" : ""
            }`}
            style={{ padding: "1rem" }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;

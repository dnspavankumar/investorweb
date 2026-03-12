import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import TypingText from "@/components/TypingText";
import UserTypeSelector from "@/components/UserTypeSelector";

const stats = [
  { value: 2847, suffix: "+", label: "STARTUPS INDEXED" },
  { value: 512, suffix: "", label: "ACTIVE INVESTORS" },
  { value: 94, suffix: "%", label: "MATCH ACCURACY" },
  { value: 48, suffix: "H", label: "AVG RESPONSE TIME" },
];

const Index = () => {
  return (
    <div>
      {/* User Type Selector - Dual Portal */}
      <UserTypeSelector />

      {/* STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border bg-primary text-primary-foreground">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`text-center ${i < stats.length - 1 ? "border-r border-primary-foreground/20" : ""}`}
            style={{ padding: "2rem var(--cell-padding)" }}
          >
            <p className="font-display text-3xl sm:text-4xl text-accent mb-1">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </p>
            <p className="font-mono text-[10px] tracking-widest opacity-60">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* WORKFLOW */}
      <div className="p-8 sm:p-12 border-b border-border bg-card">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">
          // SYSTEM_WORKFLOW
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-0">
          {[
            "CHOOSE ROLE",
            "SIGN UP",
            "SET PROFILE",
            "AI SEARCH",
            "VIEW MATCHES",
            "OUTREACH",
          ].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 py-2"
            >
              <span className="font-display text-3xl text-secondary leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary">{step}</span>
              {i < 5 && <span className="font-mono text-muted-foreground ml-auto hidden lg:inline">→</span>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* BOTTOM TECH BAR */}
      <div className="grid grid-cols-4 border-b border-border bg-muted">
        {["REACT.JS", "TAILWIND", "AI MATCHING", "OPENAI API"].map((tech, i) => (
          <div
            key={tech}
            className={`text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground ${
              i < 3 ? "border-r border-border" : ""
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

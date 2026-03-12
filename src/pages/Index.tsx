import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import UserTypeSelector from "@/components/UserTypeSelector";

const stats = [
  { value: 2847, suffix: "+", label: "Startups Indexed" },
  { value: 512, suffix: "", label: "Active Investors" },
  { value: 94, suffix: "%", label: "Match Accuracy" },
  { value: 48, suffix: "H", label: "Avg Response" },
];

const Index = () => {
  return (
    <div>
      <UserTypeSelector />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-border">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`text-center py-8 px-4 ${i < stats.length - 1 ? "border-r border-border" : ""}`}
          >
            <p className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-1">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </p>
            <p className="font-body text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Workflow */}
      <div className="px-6 py-12 sm:py-16 border-b border-border">
        <p className="text-xs text-muted-foreground font-body mb-8 text-center">How it Works</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {[
            "Choose Role",
            "Sign Up",
            "Set Profile",
            "AI Search",
            "View Matches",
            "Outreach",
          ].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 text-center"
            >
              <span className="font-display text-2xl font-bold gradient-text block mb-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-body text-xs text-muted-foreground">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

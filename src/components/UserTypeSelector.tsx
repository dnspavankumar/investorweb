import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, TrendingUp, ArrowRight } from "lucide-react";

const UserTypeSelector = () => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14 relative z-10"
      >
        <p className="text-xs font-body text-primary tracking-[0.2em] uppercase mb-4">
          AI-Powered Investor Matchmaking
        </p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 tracking-tight">
          Find Your Perfect
          <br />
          <span className="gradient-text">Match</span>
        </h2>
        <p className="font-body text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          Connect startups with the right investors through intelligent analysis and precision matching.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl relative z-10">
        {/* Founder Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/login?role=startup"
            className="group block glass-card p-8 hover:border-primary/30 transition-all duration-500 elite-card"
          >
            <div className="w-12 h-12 mb-6 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Rocket className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">I'm a Founder</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Submit your startup and get matched with investors aligned to your vision and stage.
            </p>
            <span className="inline-flex items-center gap-2 text-primary text-sm font-display font-semibold group-hover:gap-3 transition-all">
              Get Started <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>

        {/* Investor Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/login?role=investor"
            className="group block glass-card p-8 hover:border-accent/30 transition-all duration-500 elite-card"
          >
            <div className="w-12 h-12 mb-6 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <TrendingUp className="w-5 h-5 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">I'm an Investor</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Set your thesis and discover high-potential startups matching your investment criteria.
            </p>
            <span className="inline-flex items-center gap-2 text-accent text-sm font-display font-semibold group-hover:gap-3 transition-all">
              Get Started <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default UserTypeSelector;

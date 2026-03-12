import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Rocket } from "lucide-react";

const UserTypeSelector = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <p className="font-mono text-xs text-secondary uppercase tracking-[0.3em] mb-4">
          ■ SELECT_YOUR_ROLE
        </p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase text-primary mb-4">
          HOW WILL YOU <span className="text-secondary">CONNECT?</span>
        </h2>
        <p className="font-mono text-sm text-muted-foreground max-w-lg mx-auto">
          Choose your path to get started with AI-powered matchmaking
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Founder Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/login?role=startup"
            className="group block border-2 border-border rounded-lg p-8 sm:p-10 bg-card hover:border-secondary hover:shadow-xl transition-all duration-300 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
              <Rocket className="w-8 h-8 text-secondary group-hover:text-secondary-foreground" />
            </div>
            <h3 className="font-display text-2xl uppercase text-primary mb-2">I AM A FOUNDER</h3>
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed mb-6">
              Submit your startup and get matched with investors who align with your vision, stage, and industry.
            </p>
            <span className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-md group-hover:brightness-110 transition-all">
              <span className="w-1.5 h-1.5 bg-secondary-foreground rounded-full" />
              GET STARTED
            </span>
          </Link>
        </motion.div>

        {/* Investor Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/login?role=investor"
            className="group block border-2 border-border rounded-lg p-8 sm:p-10 bg-card hover:border-accent hover:shadow-xl transition-all duration-300 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <Building2 className="w-8 h-8 text-accent group-hover:text-accent-foreground" />
            </div>
            <h3 className="font-display text-2xl uppercase text-primary mb-2">I AM AN INVESTOR</h3>
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed mb-6">
              Set your preferences and discover high-potential startups that match your investment thesis.
            </p>
            <span className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-md group-hover:brightness-110 transition-all">
              <span className="w-1.5 h-1.5 bg-accent-foreground rounded-full" />
              GET STARTED
            </span>
          </Link>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-10"
      >
        // POWERED BY AI MATCHING ENGINE v0.1
      </motion.p>
    </div>
  );
};

export default UserTypeSelector;

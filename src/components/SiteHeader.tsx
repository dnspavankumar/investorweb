import { useEffect, useState } from "react";

const SiteHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <span className="font-display text-accent-foreground text-sm font-bold">AI</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl uppercase tracking-tight">
            AI<span className="text-secondary">_INVESTOR</span>
          </h1>
          <div className="live-dot hidden sm:inline-block" />
        </div>

        {/* Clock */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest opacity-70">
          <span className="hidden sm:inline">SYS_TIME</span>
          <span className="tabular-nums text-primary-foreground">
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="overflow-hidden bg-secondary text-secondary-foreground" style={{ padding: "6px 0" }}>
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-8 px-4 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
              <span>■ MATCHING ENGINE ONLINE</span>
              <span>■ 2,847 STARTUPS INDEXED</span>
              <span>■ 512 ACTIVE INVESTORS</span>
              <span>■ AI AGENTS: OPERATIONAL</span>
              <span>■ MATCH ACCURACY: 94.2%</span>
              <span>■ LAST SYNC: {new Date().toLocaleDateString()}</span>
              <span>■ MATCHING ENGINE ONLINE</span>
              <span>■ 2,847 STARTUPS INDEXED</span>
              <span>■ 512 ACTIVE INVESTORS</span>
              <span>■ AI AGENTS: OPERATIONAL</span>
              <span>■ MATCH ACCURACY: 94.2%</span>
              <span>■ LAST SYNC: {new Date().toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

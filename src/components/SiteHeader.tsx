import { useEffect, useState } from "react";

const SiteHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-foreground">
      <div className="flex">
        {/* Logo */}
        <div className="grid-cell flex-1 flex items-baseline gap-3 border-r border-foreground">
          <h1 className="font-display text-xl sm:text-2xl uppercase tracking-tight glitch-hover">
            AI<span className="text-primary">_INVESTOR</span>
          </h1>
          <div className="live-dot hidden sm:inline-block" />
        </div>

        {/* Clock */}
        <div className="grid-cell flex items-center gap-3 font-mono text-xs text-muted-foreground uppercase tracking-widest" style={{ padding: "0.75rem var(--cell-padding)" }}>
          <span className="hidden sm:inline">SYS_TIME</span>
          <span className="text-foreground tabular-nums">
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="border-t border-foreground overflow-hidden bg-foreground text-background" style={{ padding: "6px 0" }}>
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

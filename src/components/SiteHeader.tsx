const SiteHeader = () => (
  <header className="grid-cell border-b border-foreground">
    <div className="flex items-baseline justify-between">
      <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-tight">
        AI_INVESTOR<span className="text-primary">_MATCH</span>
      </h1>
      <span className="font-mono text-xs text-muted-foreground uppercase">
        v0.1 // BUILD_MODE
      </span>
    </div>
  </header>
);

export default SiteHeader;

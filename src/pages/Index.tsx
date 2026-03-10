import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="section-full">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Hero text */}
        <div className="grid-cell flex flex-col justify-center min-h-[60vh] lg:min-h-screen lg:border-r border-foreground">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-8">
            // SYSTEM_ONLINE
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95] mb-8">
            THE SMART
            <br />
            BRIDGE BETWEEN
            <br />
            <span className="text-primary">STARTUPS</span>
            <br />
            &amp;&nbsp;INVESTORS
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-md leading-relaxed mb-12">
            Many startups fail to get funding not because they are bad, but
            because they don't find the right investors. This system uses AI
            agents to understand, match, and connect.
          </p>
          <Link
            to="/submit"
            className="inline-block bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest px-8 py-4 border border-foreground hover:bg-foreground hover:text-background transition-none w-fit"
          >
            → SUBMIT YOUR STARTUP
          </Link>
        </div>

        {/* Right: System specs */}
        <div className="flex flex-col">
          {[
            {
              id: "01",
              title: "STARTUP ANALYSIS",
              desc: "AI reads your idea, identifies industry, understands stage, and decides investor type.",
            },
            {
              id: "02",
              title: "INVESTOR MATCHING",
              desc: "Rule-based algorithm scores compatibility across industry, geography, and ticket size.",
            },
            {
              id: "03",
              title: "EMAIL GENERATION",
              desc: "AI generates personalized investor outreach emails ready to send.",
            },
            {
              id: "04",
              title: "STRATEGY ADVISOR",
              desc: "Funding strategy suggestions and next steps for your startup stage.",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="grid-cell border-b border-foreground blueprint-flash flex-1 flex flex-col justify-center"
              data-tag={`<FEATURE_${item.id}>`}
            >
              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-mono text-xs text-primary">{item.id}</span>
                <h3 className="font-display text-lg uppercase">{item.title}</h3>
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="grid grid-cols-3 border-t border-foreground">
        {["REACT.JS", "TAILWIND CSS", "AI AGENTS"].map((tech, i) => (
          <div
            key={tech}
            className={`grid-cell text-center font-mono text-xs uppercase tracking-widest text-muted-foreground ${
              i < 2 ? "border-r border-foreground" : ""
            }`}
            style={{ padding: "1.5rem" }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;

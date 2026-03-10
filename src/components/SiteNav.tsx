import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "00_LANDING", desc: "HOME" },
  { to: "/submit", label: "01_SUBMIT", desc: "STARTUP FORM" },
  { to: "/dashboard", label: "02_RESULTS", desc: "MATCHES" },
];

const SiteNav = () => {
  const location = useLocation();

  return (
    <nav className="border-b border-foreground">
      <div className="flex">
        {links.map((link, i) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-1 flex items-center justify-between font-mono text-xs uppercase tracking-widest transition-none ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-foreground hover:text-background"
              } ${i < links.length - 1 ? "border-r border-foreground" : ""}`}
              style={{ padding: "0.75rem var(--cell-padding)" }}
            >
              <span className="font-display text-sm">{link.label}</span>
              <span className={`hidden sm:inline text-[10px] ${isActive ? "opacity-80" : "text-muted-foreground"}`}>
                {link.desc}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SiteNav;

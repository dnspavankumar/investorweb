import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "00_LANDING" },
  { to: "/submit", label: "01_SUBMIT_STARTUP" },
  { to: "/dashboard", label: "02_DASHBOARD" },
];

const SiteNav = () => {
  const location = useLocation();

  return (
    <nav className="border-b border-foreground">
      <div className="flex flex-col sm:flex-row">
        {links.map((link, i) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`grid-cell flex-1 font-mono text-xs uppercase tracking-widest transition-none ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
              } ${i < links.length - 1 ? "sm:border-r border-foreground" : ""}`}
              style={{ padding: "1rem var(--cell-padding)" }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SiteNav;

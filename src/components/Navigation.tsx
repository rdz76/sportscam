import { NavLink } from "react-router-dom";
import { Home, Video, Library, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/record", icon: Video, label: "Registra" },
    { to: "/library", icon: Library, label: "Libreria" },
    { to: "/settings", icon: Settings, label: "Impostazioni" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:top-0 md:bottom-auto z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around md:justify-start md:gap-8 h-16">
          <div className="hidden md:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SportsCam Pro
            </h1>
          </div>
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

import { Home, Edit, Radio, MoreHorizontal, Star, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MobileSidebarProps {
  onToggleHighlights?: () => void;
  onToggleScoreboard?: () => void;
}

const MobileSidebar = ({ onToggleHighlights, onToggleScoreboard }: MobileSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Edit, label: "Event", action: onToggleScoreboard },
    { icon: Radio, label: "Live", path: "/record" },
    { icon: MoreHorizontal, label: "Scoreboard", action: onToggleScoreboard },
    { icon: Star, label: "Highlights", action: onToggleHighlights },
    { icon: Settings, label: "Visit", path: "/settings" },
  ];

  return (
    <div className="fixed right-0 top-0 bottom-0 w-20 bg-background/95 backdrop-blur-sm border-l border-border z-40 flex flex-col items-center py-6 gap-6">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = item.path && location.pathname === item.path;

        return (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={cn(
              "flex flex-col gap-1 h-auto py-3 w-full rounded-none",
              isActive && "text-primary border-r-2 border-primary"
            )}
            onClick={() => {
              if (item.action) {
                item.action();
              } else if (item.path) {
                navigate(item.path);
              }
            }}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default MobileSidebar;

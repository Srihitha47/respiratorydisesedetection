import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: "🏠" },
  { label: "Detect", path: "/detect", icon: "🩺" },
  { label: "Symptoms", path: "/symptoms", icon: "📋" },
  { label: "Breathing", path: "/breathing", icon: "🧘" },
  { label: "Doctors", path: "/doctors", icon: "🏥" },
  { label: "Chatbot", path: "/chatbot", icon: "💬" },
  { label: "SOS", path: "/emergency", icon: "🚨" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🫁</span>
          <span className="font-display text-xl font-bold text-gradient">BreatheSmart</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                item.path === "/emergency" && "text-destructive hover:bg-destructive/10",
                location.pathname === item.path
                  ? item.path === "/emergency" ? "bg-destructive text-destructive-foreground shadow-card" : "bg-primary text-primary-foreground shadow-card"
                  : item.path !== "/emergency" && "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-accent" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border glass-strong p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                location.pathname === item.path ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

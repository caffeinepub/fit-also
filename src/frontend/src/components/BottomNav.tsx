import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Home, Scissors, Settings, Shield, Shirt } from "lucide-react";
import React from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export function BottomNav() {
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  const { language } = useLanguage();

  const isAdmin = profile?.role === "admin";

  const NAV_ITEMS = [
    {
      label: language === "hi" ? "होम" : "Home",
      icon: Home,
      to: "/",
      match: (path: string) => path === "/",
    },
    {
      label: language === "hi" ? "कस्टम ऑर्डर" : "Custom Order",
      icon: Scissors,
      to: "/catalog",
      match: (path: string) =>
        path.startsWith("/catalog") || path.startsWith("/listings"),
    },
    {
      label: language === "hi" ? "कपड़े" : "Fabrics",
      icon: Shirt,
      to: "/catalog",
      extraSearch: "?category=fabrics",
      match: (_path: string) => false,
    },
    {
      label: language === "hi" ? "सेटिंग्स" : "Settings",
      icon: Settings,
      to: "/settings",
      match: (path: string) =>
        path.startsWith("/settings") || path.startsWith("/wishlist"),
    },
  ];

  // Get current path safely
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const handleNavClick = (item: (typeof NAV_ITEMS)[0], index: number) => {
    if (index === 3) {
      // Settings
      navigate({ to: "/settings" });
    } else if (index === 2) {
      // Fabrics
      navigate({ to: "/catalog", search: { category: "fabrics" } as any });
    } else {
      navigate({ to: item.to as any });
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white shadow-bottom-nav border-t border-border"
      aria-label="Bottom navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-14">
        {NAV_ITEMS.map((item, index) => {
          const Icon = index === 3 && isAdmin ? Shield : item.icon;
          const label =
            index === 3 && isAdmin
              ? language === "hi"
                ? "एडमिन"
                : "Admin"
              : item.label;
          const isActive =
            index === 3
              ? currentPath.startsWith("/settings") ||
                currentPath.startsWith("/wishlist") ||
                (isAdmin && currentPath.startsWith("/admin"))
              : index === 0
                ? currentPath === "/"
                : index === 1
                  ? (currentPath.startsWith("/catalog") ||
                      currentPath.startsWith("/listings")) &&
                    !currentPath.includes("fabrics")
                  : false;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavClick(item, index)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={label}
            >
              {/* Active indicator pill */}
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-0.5 bg-primary rounded-b-full" />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-150",
                  isActive && "scale-110",
                )}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span
                className={cn(
                  "text-[10px] font-body font-medium leading-none",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

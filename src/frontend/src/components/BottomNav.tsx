import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Home, Package, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../hooks/useLanguage";

export function BottomNav() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { totalItems } = useCart();

  // Get current path safely
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const NAV_ITEMS = [
    {
      label: language === "hi" ? "होम" : "Home",
      icon: Home,
      to: "/",
      match: (path: string) => path === "/",
      ocid: "nav.home.button",
    },
    {
      label: language === "hi" ? "खोजें" : "Search",
      icon: Search,
      to: "/catalog",
      match: (path: string) =>
        path.startsWith("/catalog") || path.startsWith("/listings"),
      ocid: "nav.search.button",
    },
    {
      label: language === "hi" ? "कार्ट" : "Cart",
      icon: ShoppingCart,
      to: "/cart",
      match: (path: string) => path === "/cart",
      ocid: "nav.cart.button",
      badge:
        totalItems > 0 ? (totalItems > 9 ? "9+" : String(totalItems)) : null,
    },
    {
      label: language === "hi" ? "ऑर्डर" : "Orders",
      icon: Package,
      to: "/orders",
      match: (path: string) =>
        path.startsWith("/orders") || path.startsWith("/order-confirmation"),
      ocid: "nav.orders.button",
    },
    {
      label: language === "hi" ? "प्रोफ़ाइल" : "Profile",
      icon: User,
      to: "/settings",
      match: (path: string) =>
        path.startsWith("/settings") ||
        path.startsWith("/wishlist") ||
        path.startsWith("/dashboard"),
      ocid: "nav.profile.button",
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
      }}
      aria-label="Bottom navigation"
    >
      <div className="flex items-stretch h-14">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(currentPath);

          return (
            <button
              key={item.ocid}
              type="button"
              data-ocid={item.ocid}
              onClick={() => navigate({ to: item.to as any })}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={item.label}
            >
              {/* Active indicator pill at top */}
              {isActive && (
                <span className="absolute top-0 inset-x-3 h-0.5 bg-primary rounded-b-full" />
              )}

              {/* Icon with badge */}
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-150",
                    isActive && "scale-110",
                  )}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
                {/* Cart badge */}
                {"badge" in item && item.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] font-body font-medium leading-none",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

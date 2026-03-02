import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLanguage } from "../hooks/useLanguage";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";
import { LoginButton } from "./LoginButton";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { language } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const { data: isAdminFromBackend } = useIsCallerAdmin();
  const isAuthenticated = !!identity;
  const isAdmin = isAdminFromBackend || profile?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background transition-shadow duration-200",
        scrolled ? "shadow-md" : "shadow-sm",
        className,
      )}
    >
      {/* Top bar: Banner background with logo + icons */}
      <div
        className="px-3 py-2 relative"
        style={{
          backgroundImage:
            "url('/assets/uploads/IMG_20260228_083225_533-1-2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Subtle dark overlay — keep banner visible */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="max-w-screen-xl mx-auto flex items-center justify-between relative z-10">
          {/* Left: Logo + Brand name stacked below logo */}
          <button
            type="button"
            data-ocid="header.home.button"
            onClick={() => navigate({ to: "/" })}
            className="shrink-0 flex flex-col items-center leading-none gap-0.5 ml-0"
            aria-label="Fit Also Home"
          >
            {/* Round logo — pure original color, no white overlay/filter/blendMode */}
            <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
              <img
                src="/assets/uploads/1772254655818-1.png"
                alt="Fit Also Logo"
                className="h-full w-full object-cover"
                style={{
                  boxShadow: "none",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                }}
              />
            </div>
            {/* Silver crystal "FIT ALSO" text below logo */}
            <span
              className="text-[11px] font-extrabold tracking-[0.18em] uppercase leading-none"
              style={{
                background:
                  "linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 25%, #ffffff 50%, #a8a8a8 75%, #d4d4d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 4px rgba(255,255,255,0.6))",
                textShadow: "none",
              }}
            >
              FIT ALSO
            </span>
          </button>

          {/* Right: Profile icon ONLY (Search + Cart moved to BottomNav) */}
          <div className="flex items-end pb-2 gap-1 shrink-0">
            {/* Profile icon (small) — navigates to settings/dashboard */}
            {isAuthenticated ? (
              <button
                type="button"
                data-ocid="header.profile.button"
                onClick={() => navigate({ to: "/settings" })}
                className="flex items-center justify-center w-9 h-9 text-white hover:bg-white/15 rounded-full transition-colors"
                aria-label={language === "hi" ? "प्रोफ़ाइल" : "Profile"}
              >
                <User className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex items-center px-1">
                <LoginButton />
              </div>
            )}

            {/* Admin shield — only for admins */}
            {isAdmin && (
              <button
                type="button"
                data-ocid="header.admin.button"
                onClick={() => navigate({ to: "/admin" })}
                className="flex items-center justify-center w-9 h-9 text-white hover:bg-white/15 rounded-full transition-colors"
                aria-label="Admin Panel"
              >
                <Shield className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category quick nav — desktop only (Fabrics removed) */}
      <div className="hidden md:block bg-background border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4">
          <nav
            className="flex items-center gap-1 overflow-x-auto scrollbar-none"
            aria-label="Quick categories"
          >
            {(language === "hi"
              ? [
                  { label: "होम", to: "/" },
                  { label: "कुर्ता", to: "/catalog?category=Kurtas" },
                  { label: "अनारकली", to: "/catalog?category=Anarkalis" },
                  {
                    label: "साड़ी ब्लाउज",
                    to: "/catalog?category=Saree+Blouses",
                  },
                  { label: "मेन्स सूट", to: "/catalog?category=Suits" },
                  { label: "शेरवानी", to: "/catalog?category=Sherwanis" },
                  { label: "लहंगा", to: "/catalog?category=Lehengas" },
                ]
              : [
                  { label: "Home", to: "/" },
                  { label: "Kurtas", to: "/catalog?category=Kurtas" },
                  { label: "Anarkalis", to: "/catalog?category=Anarkalis" },
                  {
                    label: "Saree Blouses",
                    to: "/catalog?category=Saree+Blouses",
                  },
                  { label: "Men's Suits", to: "/catalog?category=Suits" },
                  { label: "Sherwanis", to: "/catalog?category=Sherwanis" },
                  { label: "Lehengas", to: "/catalog?category=Lehengas" },
                ]
            ).map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate({ to: item.to as any })}
                className="px-3 py-2.5 text-xs font-body font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 whitespace-nowrap transition-colors rounded-sm"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

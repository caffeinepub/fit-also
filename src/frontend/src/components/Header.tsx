import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Shield } from "lucide-react";
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
      {/* Shimmer animations */}
      <style>{`
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .logo-shimmer-overlay {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }
        .logo-shimmer-overlay::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255,255,255,0.65) 50%,
            transparent 80%
          );
          animation: shimmer-sweep 2.2s ease-in-out infinite;
        }
        .banner-shimmer-wrap {
          position: relative;
          overflow: hidden;
        }
        .banner-shimmer-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 25%,
            rgba(255,255,255,0.18) 45%,
            rgba(255,255,255,0.35) 50%,
            rgba(255,255,255,0.18) 55%,
            transparent 75%
          );
          animation: shimmer-sweep 2.8s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .fit-also-text {
          background: linear-gradient(
            90deg,
            #a0a0a0 0%,
            #e8e8e8 20%,
            #ffffff 40%,
            #c8c8c8 60%,
            #ffffff 75%,
            #a0a0a0 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: text-shimmer 2.8s linear infinite;
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.5));
        }
      `}</style>

      {/* Top bar: Full reference image as header */}
      <div
        className="relative overflow-hidden banner-shimmer-wrap"
        style={{ minHeight: "80px" }}
      >
        {/* Full reference image as-is */}
        <button
          type="button"
          data-ocid="header.home.button"
          onClick={() => navigate({ to: "/" })}
          className="block w-full focus:outline-none"
          aria-label="Fit Also Home"
          style={{
            display: "block",
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          <img
            src="/assets/uploads/InShot_20260302_214920408-2-1.jpg"
            alt="Fit Also — Modern Tailoring | Global Retail"
            className="w-full"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: "120px",
              objectFit: "cover",
              objectPosition: "center",
            }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </button>

        {/* Login / Admin overlay — top right corner */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
          {!isAuthenticated && (
            <div className="flex items-center">
              <LoginButton />
            </div>
          )}
          {isAdmin && (
            <button
              type="button"
              data-ocid="header.admin.button"
              onClick={() => navigate({ to: "/admin" })}
              className="flex items-center justify-center w-8 h-8 text-white hover:bg-white/20 rounded-full transition-colors bg-black/40 backdrop-blur-sm"
              aria-label="Admin Panel"
            >
              <Shield className="h-4 w-4" />
            </button>
          )}
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

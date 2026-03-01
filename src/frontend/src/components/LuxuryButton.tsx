import { cn } from "@/lib/utils";
import type React from "react";

interface LuxuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function LuxuryButton({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  disabled,
  ...props
}: LuxuryButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-xs",
    secondary:
      "bg-secondary text-secondary-foreground hover:opacity-90 shadow-xs",
    outline:
      "border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
    ghost: "text-foreground hover:bg-muted",
    gold: "bg-accent text-accent-foreground hover:opacity-90 shadow-xs",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-5 py-2.5 text-sm rounded-lg",
    lg: "px-7 py-3 text-base rounded-xl",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <title>Loading</title>
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

import { cn } from "@/lib/utils";
import type React from "react";

interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function LuxuryCard({
  children,
  className,
  hover,
  onClick,
}: LuxuryCardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "bg-card rounded-xl border border-border shadow-luxury",
        hover &&
          "transition-all duration-300 hover:shadow-luxury-lg hover:-translate-y-0.5 cursor-pointer",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}

import { Star } from "lucide-react";
import React from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useLoyaltyPoints } from "../hooks/useLoyaltyPoints";
import { LuxuryCard } from "./LuxuryCard";

export function LoyaltyPointsCard() {
  const { t } = useLanguage();
  const { balance } = useLoyaltyPoints();

  return (
    <LuxuryCard className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent/20">
          <Star className="h-5 w-5 text-accent-foreground" />
        </div>
        <h3 className="font-serif text-lg font-semibold">
          {t("loyalty.balance")}
        </h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold font-serif gold-text">
          {balance}
        </span>
        <span className="text-lg text-muted-foreground">
          {t("loyalty.points")}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Earn 1 point per ₹100 spent on delivered orders
      </p>
    </LuxuryCard>
  );
}

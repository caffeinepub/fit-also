import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

export const ORDER_STAGES = [
  "Order Placed",
  "Confirmed",
  "Assigned to Tailor",
  "Stitching Started",
  "Quality Check",
  "Dispatched",
  "Out for Delivery",
  "Delivered",
] as const;

export type OrderStage = (typeof ORDER_STAGES)[number];

const ORDER_STAGES_HI = [
  "ऑर्डर दिया",
  "कन्फर्म",
  "दर्जी को सौंपा",
  "सिलाई शुरू",
  "क्वालिटी जांच",
  "भेजा गया",
  "डिलीवरी पर",
  "पहुंच गया",
];

// Map various status strings to stage index
function resolveStageIndex(status: string): number {
  const normalized = status.toLowerCase().replace(/[\s_-]/g, "");
  const map: Record<string, number> = {
    orderplaced: 0,
    pending: 0,
    placed: 0,
    confirmed: 1,
    confirm: 1,
    assignedtotailor: 2,
    assigned: 2,
    intailoring: 3,
    stitchingstarted: 3,
    stitching: 3,
    qualitycheck: 4,
    quality: 4,
    dispatched: 5,
    shipped: 5,
    outfordelivery: 6,
    outfordeliver: 6,
    delivered: 7,
  };
  return map[normalized] ?? 0;
}

interface OrderTrackingBarProps {
  status: string;
  language?: "hi" | "en";
  compact?: boolean;
  className?: string;
}

export function OrderTrackingBar({
  status,
  language = "hi",
  compact = false,
  className,
}: OrderTrackingBarProps) {
  const currentIndex = resolveStageIndex(status);
  const isCancelled = status.toLowerCase() === "cancelled";
  const labels = language === "hi" ? ORDER_STAGES_HI : ORDER_STAGES;

  if (isCancelled) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
          <span className="text-destructive text-xs">✕</span>
        </div>
        <span className="text-sm font-medium text-destructive">
          {language === "hi" ? "ऑर्डर रद्द" : "Order Cancelled"}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto scrollbar-none", className)}>
      <div
        className={cn(
          "flex items-start",
          compact ? "min-w-[480px] gap-0" : "min-w-[640px] gap-0",
        )}
      >
        {ORDER_STAGES.map((stage, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <React.Fragment key={stage}>
              {/* Step */}
              <div
                className={cn(
                  "flex flex-col items-center",
                  compact ? "gap-1" : "gap-1.5",
                  "flex-1 min-w-0",
                )}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center shrink-0 border-2 transition-all",
                    compact ? "w-6 h-6" : "w-8 h-8",
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                        ? "bg-green-500 border-green-400 text-white tracking-pulse shadow-[0_0_0_3px_oklch(0.54_0.18_155_/_0.3)]"
                        : "bg-background border-border text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check
                      className={cn(compact ? "w-3 h-3" : "w-4 h-4")}
                      strokeWidth={2.5}
                    />
                  ) : isCurrent ? (
                    <div
                      className={cn(
                        "rounded-full bg-white",
                        compact ? "w-2 h-2" : "w-2.5 h-2.5",
                      )}
                    />
                  ) : (
                    <span
                      className={cn(
                        "font-semibold",
                        compact ? "text-[9px]" : "text-[10px]",
                      )}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "font-body text-center leading-tight",
                    compact
                      ? "text-[8px] max-w-[44px]"
                      : "text-[9px] max-w-[60px] sm:text-[10px]",
                    isCompleted || isCurrent
                      ? "text-green-600 font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {labels[i]}
                </span>
              </div>

              {/* Connector line */}
              {i < ORDER_STAGES.length - 1 && (
                <div
                  className={cn(
                    "flex-1 mt-3 transition-all",
                    compact ? "h-0.5 mt-[11px]" : "h-0.5 mt-[15px]",
                    i < currentIndex ? "bg-green-500" : "bg-border",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

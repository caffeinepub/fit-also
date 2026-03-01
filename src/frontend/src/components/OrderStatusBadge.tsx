import { cn } from "@/lib/utils";
import React from "react";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

function getStatusStyle(status: string): string {
  const normalized = status.toLowerCase().replace(/[\s_-]/g, "");
  const map: Record<string, string> = {
    orderplaced: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    confirm: "bg-blue-100 text-blue-800 border-blue-200",
    assignedtotailor: "bg-purple-100 text-purple-800 border-purple-200",
    assigned: "bg-purple-100 text-purple-800 border-purple-200",
    intailoring: "bg-indigo-100 text-indigo-800 border-indigo-200",
    stitchingstarted: "bg-indigo-100 text-indigo-800 border-indigo-200",
    qualitycheck: "bg-orange-100 text-orange-800 border-orange-200",
    dispatched: "bg-teal-100 text-teal-800 border-teal-200",
    shipped: "bg-teal-100 text-teal-800 border-teal-200",
    outfordelivery: "bg-sky-100 text-sky-800 border-sky-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  return map[normalized] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusStyle(status),
        className,
      )}
    >
      {status}
    </span>
  );
}

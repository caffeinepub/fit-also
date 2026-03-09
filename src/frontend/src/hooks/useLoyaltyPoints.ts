import { useMemo } from "react";
import type { ExtendedOrder } from "../backend";
import type { LoyaltyData } from "../types/loyalty";
import { useOrders } from "./useOrders";

export function useLoyaltyPoints(): LoyaltyData {
  const { orders } = useOrders();

  return useMemo(() => {
    // Read allOrders (placed via CheckoutPage) from localStorage
    let extendedOrders: ExtendedOrder[] = [];
    try {
      const raw = localStorage.getItem("allOrders");
      if (raw) {
        extendedOrders = JSON.parse(raw) as ExtendedOrder[];
      }
    } catch {}

    const transactions: Array<{
      id: string;
      orderId: string;
      pointsEarned: number;
      description: string;
      createdAt: number;
    }> = [];

    // From useOrders() — COD/legacy orders with status "delivered"
    for (const o of orders) {
      if (
        (o.status as string) === "delivered" ||
        (o.status as string) === "Delivered"
      ) {
        const pts = Math.floor((o.price ?? 0) / 100);
        if (pts > 0) {
          transactions.push({
            id: `loyalty-local-${o.id}`,
            orderId: o.id,
            pointsEarned: pts,
            description: `Order ${o.id} delivered`,
            createdAt: o.updatedAt ?? Date.now(),
          });
        }
      }
    }

    // From allOrders localStorage — ONLINE payment orders with status "Delivered"
    const localOrderIds = new Set(orders.map((o) => o.id));
    for (const o of extendedOrders) {
      // Only count online payment orders, avoid duplicates
      const isOnline =
        o.paymentMode === "ONLINE" ||
        o.paymentMode === "online" ||
        o.paymentMode === "Razorpay";
      const isDelivered = o.status === "Delivered" || o.status === "delivered";
      if (isOnline && isDelivered && !localOrderIds.has(o.id)) {
        const pts = Math.floor((o.totalPrice ?? 0) / 100);
        if (pts > 0) {
          transactions.push({
            id: `loyalty-online-${o.id}`,
            orderId: o.id,
            pointsEarned: pts,
            description: `Online Order ${o.id} delivered`,
            createdAt: Number(o.orderDate ?? Date.now()),
          });
        }
      }
    }

    const balance = transactions.reduce((sum, t) => sum + t.pointsEarned, 0);
    return { balance, transactions };
  }, [orders]);
}

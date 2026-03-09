import { useCallback, useState } from "react";
import type { ExtendedOrder } from "../backend";
import type { CustomizationOptions } from "../types/catalog";
import type { MeasurementProfile } from "../types/measurements";
import type { Order, OrderStatus } from "../types/order";
import { useInternetIdentity } from "./useInternetIdentity";

function getOrderKey(principalId: string) {
  return `fitAlso_orders_${principalId}`;
}

function getAllOrdersKey() {
  return "fitAlso_all_orders";
}

export function useOrders() {
  const { identity } = useInternetIdentity();
  const principalId = identity?.getPrincipal().toString() ?? "anonymous";

  const loadMyOrders = useCallback((): Order[] => {
    try {
      const raw = localStorage.getItem(getOrderKey(principalId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [principalId]);

  const [orders, setOrders] = useState<Order[]>(loadMyOrders);

  const saveOrders = useCallback(
    (updated: Order[]) => {
      setOrders(updated);
      try {
        localStorage.setItem(getOrderKey(principalId), JSON.stringify(updated));
        // Also save to global orders for tailor/admin view
        const allRaw = localStorage.getItem(getAllOrdersKey());
        const allOrders: Order[] = allRaw ? JSON.parse(allRaw) : [];
        const others = allOrders.filter((o) => o.customerId !== principalId);
        localStorage.setItem(
          getAllOrdersKey(),
          JSON.stringify([...others, ...updated]),
        );
      } catch {}
    },
    [principalId],
  );

  const createOrder = useCallback(
    (params: {
      tailorId: string;
      tailorName: string;
      listingId: string;
      listingTitle: string;
      category: string;
      customization: CustomizationOptions;
      measurementSnapshot: MeasurementProfile;
      price: number;
    }): Order => {
      const order: Order = {
        id: `ORD-${Date.now()}`,
        customerId: principalId,
        ...params,
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveOrders([...orders, order]);
      return order;
    },
    [orders, principalId, saveOrders],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      saveOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o,
        ),
      );
    },
    [orders, saveOrders],
  );

  const getOrder = useCallback(
    (orderId: string): Order | undefined => {
      // First check per-user orders
      const local = orders.find((o) => o.id === orderId);
      if (local) return local;

      // Fallback: check allOrders localStorage (ExtendedOrder from CheckoutPage)
      try {
        const raw = localStorage.getItem("allOrders");
        if (raw) {
          const allExt = JSON.parse(raw) as ExtendedOrder[];
          const ext = allExt.find((o) => o.id === orderId);
          if (ext) {
            // Convert ExtendedOrder to Order shape
            const converted: Order = {
              id: ext.id,
              customerId: ext.customerPrincipal ?? "",
              tailorId: ext.tailorId ?? "",
              listingId: ext.id,
              listingTitle: ext.listingTitle ?? "",
              category: ext.category ?? "",
              customization: (() => {
                try {
                  return JSON.parse(ext.customizationJson || "{}");
                } catch {
                  return {};
                }
              })(),
              measurementSnapshot: (() => {
                try {
                  return JSON.parse(ext.measurementsJson || "{}");
                } catch {
                  return undefined;
                }
              })(),
              price: ext.totalPrice ?? 0,
              status: ext.status ?? "Order Placed",
              createdAt: Number(ext.orderDate ?? Date.now()),
              updatedAt: Number(ext.orderDate ?? Date.now()),
              tailorName: "",
              customerName: ext.customerName,
              customerPhone: ext.customerPhone,
              customerAltPhone: ext.customerAltPhone,
              deliveryAddress: ext.deliveryAddress,
              paymentMode: ext.paymentMode,
              estimatedDeliveryDate: ext.estimatedDeliveryDate,
              adminNotes: ext.adminNotes,
            } as unknown as Order;
            return converted;
          }
        }
      } catch {}
      return undefined;
    },
    [orders],
  );

  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status),
  );
  const completedOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status),
  );

  return {
    orders,
    activeOrders,
    completedOrders,
    createOrder,
    updateOrderStatus,
    getOrder,
  };
}

export function useAllOrders() {
  const loadAll = (): Order[] => {
    try {
      const raw = localStorage.getItem(getAllOrdersKey());
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const [orders, setOrders] = useState<Order[]>(loadAll);

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      const updated = orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o,
      );
      setOrders(updated);
      try {
        localStorage.setItem(getAllOrdersKey(), JSON.stringify(updated));
      } catch {}
    },
    [orders],
  );

  return { orders, updateOrderStatus };
}

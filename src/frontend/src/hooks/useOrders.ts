import { useState, useCallback } from 'react';
import type { Order, OrderStatus } from '../types/order';
import type { CustomizationOptions } from '../types/catalog';
import type { MeasurementProfile } from '../types/measurements';
import { useInternetIdentity } from './useInternetIdentity';

function getOrderKey(principalId: string) {
  return `fitAlso_orders_${principalId}`;
}

function getAllOrdersKey() {
  return 'fitAlso_all_orders';
}

export function useOrders() {
  const { identity } = useInternetIdentity();
  const principalId = identity?.getPrincipal().toString() ?? 'anonymous';

  const loadMyOrders = useCallback((): Order[] => {
    try {
      const raw = localStorage.getItem(getOrderKey(principalId));
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }, [principalId]);

  const [orders, setOrders] = useState<Order[]>(loadMyOrders);

  const saveOrders = useCallback((updated: Order[]) => {
    setOrders(updated);
    try {
      localStorage.setItem(getOrderKey(principalId), JSON.stringify(updated));
      // Also save to global orders for tailor/admin view
      const allRaw = localStorage.getItem(getAllOrdersKey());
      const allOrders: Order[] = allRaw ? JSON.parse(allRaw) : [];
      const myIds = new Set(updated.map(o => o.id));
      const others = allOrders.filter(o => o.customerId !== principalId);
      localStorage.setItem(getAllOrdersKey(), JSON.stringify([...others, ...updated]));
    } catch {}
  }, [principalId]);

  const createOrder = useCallback((params: {
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
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveOrders([...orders, order]);
    return order;
  }, [orders, principalId, saveOrders]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    saveOrders(orders.map(o => o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o));
  }, [orders, saveOrders]);

  const getOrder = useCallback((orderId: string): Order | undefined => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  return { orders, activeOrders, completedOrders, createOrder, updateOrderStatus, getOrder };
}

export function useAllOrders() {
  const loadAll = (): Order[] => {
    try {
      const raw = localStorage.getItem(getAllOrdersKey());
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const [orders, setOrders] = useState<Order[]>(loadAll);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o);
    setOrders(updated);
    try { localStorage.setItem(getAllOrdersKey(), JSON.stringify(updated)); } catch {}
  }, [orders]);

  return { orders, updateOrderStatus };
}

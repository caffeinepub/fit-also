import { useMemo } from 'react';
import type { LoyaltyData } from '../types/loyalty';
import { useOrders } from './useOrders';

export function useLoyaltyPoints(): LoyaltyData {
  const { orders } = useOrders();

  return useMemo(() => {
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const transactions = deliveredOrders.map(o => ({
      id: `loyalty-${o.id}`,
      orderId: o.id,
      pointsEarned: Math.floor(o.price / 100),
      description: `Order ${o.id} delivered`,
      createdAt: o.updatedAt,
    }));
    const balance = transactions.reduce((sum, t) => sum + t.pointsEarned, 0);
    return { balance, transactions };
  }, [orders]);
}

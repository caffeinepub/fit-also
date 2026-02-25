import React from 'react';
import type { OrderStatus } from '../types/order';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { key: string; color: string }> = {
  pending: { key: 'status.pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { key: 'status.confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  inTailoring: { key: 'status.inTailoring', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  shipped: { key: 'status.shipped', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  delivered: { key: 'status.delivered', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { key: 'status.cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { t } = useLanguage();
  const config = statusConfig[status];

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.color,
      className
    )}>
      {t(config.key as any)}
    </span>
  );
}

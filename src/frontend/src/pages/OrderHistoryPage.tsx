import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../hooks/useLanguage';
import { useOrders } from '../hooks/useOrders';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { LuxuryCard } from '../components/LuxuryCard';
import { LuxuryButton } from '../components/LuxuryButton';
import { ShoppingBag } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function OrderHistoryPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { orders } = useOrders();

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold text-foreground mb-8">{t('orders.title')}</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-xl text-muted-foreground mb-6">{t('orders.noOrders')}</p>
          <LuxuryButton variant="primary" size="lg" onClick={() => navigate({ to: '/catalog' })}>
            Browse Collection
          </LuxuryButton>
        </div>
      ) : (
        <LuxuryCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('orders.id')}</TableHead>
                <TableHead>{t('orders.date')}</TableHead>
                <TableHead>{t('orders.tailor')}</TableHead>
                <TableHead>{t('orders.status')}</TableHead>
                <TableHead className="text-right">{t('orders.amount')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">{order.tailorName}</TableCell>
                  <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    ₹{order.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <LuxuryButton
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate({ to: '/orders/$id', params: { id: order.id } })}
                    >
                      {t('orders.viewDetail')}
                    </LuxuryButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </LuxuryCard>
      )}
    </div>
  );
}

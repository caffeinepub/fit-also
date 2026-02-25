import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useLoyaltyPoints } from '../hooks/useLoyaltyPoints';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star } from 'lucide-react';

export function LoyaltyPointsHistory() {
  const { t } = useLanguage();
  const { transactions } = useLoyaltyPoints();

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Star className="h-8 w-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No points earned yet. Complete an order to earn points!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('loyalty.date')}</TableHead>
          <TableHead>{t('loyalty.order')}</TableHead>
          <TableHead className="text-right">{t('loyalty.earned')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(tx => (
          <TableRow key={tx.id}>
            <TableCell className="text-sm">{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-sm font-mono">{tx.orderId}</TableCell>
            <TableCell className="text-right">
              <span className="font-semibold gold-text">+{tx.pointsEarned}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

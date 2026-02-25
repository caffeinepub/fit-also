import type { Order } from './order';

export interface AdminAnalytics {
  totalOrders: number;
  totalRevenue: number;
  activeTailorsCount: number;
  registeredCustomersCount: number;
  recentOrders: Order[];
}

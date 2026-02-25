import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../hooks/useLanguage';
import { useOrders } from '../hooks/useOrders';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { MeasurementProfileList } from '../components/MeasurementProfileList';
import { LoyaltyPointsCard } from '../components/LoyaltyPointsCard';
import { LoyaltyPointsHistory } from '../components/LoyaltyPointsHistory';
import { LuxuryCard } from '../components/LuxuryCard';
import { LuxuryButton } from '../components/LuxuryButton';
import { ProfileSettingsForm } from '../components/ProfileSettingsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Ruler, Star, User, Package } from 'lucide-react';

export function CustomerDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  const { activeOrders, orders } = useOrders();

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-8">
        <p className="text-accent font-medium text-sm tracking-widest uppercase mb-1">My Account</p>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {t('dash.welcome')}{profile?.name ? `, ${profile.name}` : ''}
        </h1>
      </div>

      <Tabs defaultValue="active-orders">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="active-orders" className="flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            {t('dash.activeOrders')}
            {activeOrders.length > 0 && (
              <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="order-history" className="flex items-center gap-1.5">
            <ShoppingBag className="h-4 w-4" />
            {t('dash.orderHistory')}
          </TabsTrigger>
          <TabsTrigger value="measurements" className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" />
            {t('dash.measurements')}
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="flex items-center gap-1.5">
            <Star className="h-4 w-4" />
            {t('dash.loyalty')}
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {t('dash.profile')}
          </TabsTrigger>
        </TabsList>

        {/* Active Orders */}
        <TabsContent value="active-orders">
          {activeOrders.length === 0 ? (
            <LuxuryCard className="p-10 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground mb-4">No active orders.</p>
              <LuxuryButton variant="primary" onClick={() => navigate({ to: '/catalog' })}>
                Start Shopping
              </LuxuryButton>
            </LuxuryCard>
          ) : (
            <div className="space-y-4">
              {activeOrders.map(order => (
                <LuxuryCard
                  key={order.id}
                  hover
                  onClick={() => navigate({ to: '/orders/$id', params: { id: order.id } })}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-semibold text-foreground">{order.listingTitle}</h3>
                      <p className="text-sm text-muted-foreground">{order.tailorName}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{order.id}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <OrderStatusBadge status={order.status} />
                      <p className="font-bold text-primary font-serif mt-2">₹{order.price.toLocaleString()}</p>
                    </div>
                  </div>
                </LuxuryCard>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Order History */}
        <TabsContent value="order-history">
          {orders.length === 0 ? (
            <LuxuryCard className="p-10 text-center">
              <p className="text-muted-foreground">{t('orders.noOrders')}</p>
            </LuxuryCard>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <LuxuryCard
                  key={order.id}
                  hover
                  onClick={() => navigate({ to: '/orders/$id', params: { id: order.id } })}
                  className="p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{order.listingTitle}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.tailorName} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-bold text-primary shrink-0">₹{order.price.toLocaleString()}</span>
                  </div>
                </LuxuryCard>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Measurements */}
        <TabsContent value="measurements">
          <MeasurementProfileList />
        </TabsContent>

        {/* Loyalty */}
        <TabsContent value="loyalty">
          <div className="space-y-6">
            <LoyaltyPointsCard />
            <LuxuryCard className="p-6">
              <h3 className="font-serif text-lg font-semibold mb-4">{t('loyalty.history')}</h3>
              <LoyaltyPointsHistory />
            </LuxuryCard>
          </div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <LuxuryCard className="p-6 max-w-lg">
            <h3 className="font-serif text-lg font-semibold mb-5">{t('dash.profile')}</h3>
            <ProfileSettingsForm />
          </LuxuryCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

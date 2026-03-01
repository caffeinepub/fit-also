import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { List, Package, Store, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { ListingManagementTable } from "../components/ListingManagementTable";
import { LuxuryButton } from "../components/LuxuryButton";
import { LuxuryCard } from "../components/LuxuryCard";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { TailorOnboardingForm } from "../components/TailorOnboardingForm";
import { useCatalog } from "../hooks/useCatalog";
import { useLanguage } from "../hooks/useLanguage";
import { useAllOrders } from "../hooks/useOrders";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { useTailors } from "../hooks/useTailors";
import type { OrderStatus } from "../types/order";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "inTailoring", label: "In Tailoring" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function TailorDashboard() {
  const { t } = useLanguage();
  const { data: profile } = useGetCallerUserProfile();
  const { orders, updateOrderStatus } = useAllOrders();
  const { getMyTailorProfile } = useTailors();

  const tailorProfile = getMyTailorProfile();
  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <div className="mb-8">
        <p className="text-accent font-medium text-sm tracking-widest uppercase mb-1">
          Tailor Portal
        </p>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {t("dash.welcome")}
          {profile?.name ? `, ${profile.name}` : ""}
        </h1>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, icon: Package },
          {
            label: "Active Orders",
            value: orders.filter(
              (o) => !["delivered", "cancelled"].includes(o.status),
            ).length,
            icon: List,
          },
          {
            label: "Delivered",
            value: orders.filter((o) => o.status === "delivered").length,
            icon: TrendingUp,
          },
          {
            label: "Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
          },
        ].map((stat) => (
          <LuxuryCard key={stat.label} className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="font-serif text-2xl font-bold text-primary">
              {stat.value}
            </p>
          </LuxuryCard>
        ))}
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="orders" className="flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            {t("dash.incomingOrders")}
          </TabsTrigger>
          <TabsTrigger value="listings" className="flex items-center gap-1.5">
            <List className="h-4 w-4" />
            {t("dash.myListings")}
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex items-center gap-1.5">
            <Store className="h-4 w-4" />
            {t("dash.shopProfile")}
          </TabsTrigger>
        </TabsList>

        {/* Orders */}
        <TabsContent value="orders">
          {orders.length === 0 ? (
            <LuxuryCard className="p-10 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">No orders yet.</p>
            </LuxuryCard>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <LuxuryCard key={order.id} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-semibold">
                        {order.listingTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {order.id}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString()} · ₹
                        {order.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      <Select
                        value={order.status}
                        onValueChange={(v) =>
                          updateOrderStatus(order.id, v as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-40 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem
                              key={s.value}
                              value={s.value}
                              className="text-xs"
                            >
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </LuxuryCard>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Listings */}
        <TabsContent value="listings">
          <ListingManagementTable />
        </TabsContent>

        {/* Shop Profile */}
        <TabsContent value="shop">
          <LuxuryCard className="p-6 max-w-2xl">
            <h3 className="font-serif text-xl font-semibold mb-6">
              {tailorProfile ? "Edit Shop Profile" : t("tailor.onboard")}
            </h3>
            <TailorOnboardingForm existing={tailorProfile ?? undefined} />
          </LuxuryCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

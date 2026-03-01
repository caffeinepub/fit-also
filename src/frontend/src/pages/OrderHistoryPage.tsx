import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Download, Package, ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { ExtendedOrder } from "../backend";
import { LuxuryButton } from "../components/LuxuryButton";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderTrackingBar } from "../components/OrderTrackingBar";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLanguage } from "../hooks/useLanguage";
import { useOrders } from "../hooks/useOrders";
import { generateInvoice } from "../utils/generateInvoice";

export function OrderHistoryPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { orders: localOrders } = useOrders();
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [extOrders, setExtOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch extended orders from backend
  useEffect(() => {
    if (!actor || !identity) return;
    setLoading(true);
    actor
      .getMyExtendedOrders()
      .then((result) => setExtOrders(result))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, identity]);

  // Merge: prefer extended orders from backend, fallback to local
  const hasExtOrders = extOrders.length > 0;

  const handleDownloadInvoice = (order: ExtendedOrder) => {
    generateInvoice(order);
  };

  // Empty state
  const isEmpty = hasExtOrders
    ? extOrders.length === 0
    : localOrders.length === 0;

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <Package className="w-5 h-5" />
        <h1 className="text-lg font-bold tracking-wide">
          {language === "hi" ? "मेरे ऑर्डर" : "My Orders"}
        </h1>
        <span className="ml-auto bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {hasExtOrders ? extOrders.length : localOrders.length} orders
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!loading && isEmpty ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-5">
            <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-40" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {language === "hi" ? "कोई ऑर्डर नहीं" : t("orders.noOrders")}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {language === "hi"
              ? "अभी तक कोई ऑर्डर नहीं दिया गया है।"
              : "You have not placed any orders yet."}
          </p>
          <LuxuryButton
            variant="primary"
            size="lg"
            onClick={() => navigate({ to: "/catalog" })}
          >
            {language === "hi" ? "खरीदारी शुरू करें" : "Browse Collection"}
          </LuxuryButton>
        </div>
      ) : (
        !loading && (
          <div className="px-3 pt-4 space-y-3">
            {/* Extended orders (from backend) */}
            {hasExtOrders &&
              extOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Order header */}
                  <div className="px-4 py-3 flex items-center justify-between bg-muted/30 border-b border-border">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {order.id.slice(0, 14)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(Number(order.orderDate)).toLocaleDateString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={order.status} />
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(order)}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        aria-label="Download invoice"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Order content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {order.listingTitle || "Custom Order"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.category}
                        </p>
                      </div>
                      <span className="font-display font-bold text-primary text-base">
                        ₹{order.totalPrice.toLocaleString("hi-IN")}
                      </span>
                    </div>

                    {/* Compact tracking bar */}
                    {order.status !== "cancelled" &&
                      order.status !== "Cancelled" && (
                        <div className="mt-2">
                          <OrderTrackingBar
                            status={order.status}
                            language={language as "hi" | "en"}
                            compact
                          />
                        </div>
                      )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          navigate({
                            to: "/orders/$id",
                            params: { id: order.id },
                          })
                        }
                        className="flex-1 py-2 px-3 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary/5 transition-colors text-center"
                      >
                        {language === "hi" ? "विवरण देखें" : "View Details"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(order)}
                        className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {/* Local orders (fallback) */}
            {!hasExtOrders &&
              localOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="px-4 py-3 flex items-center justify-between bg-muted/30 border-b border-border">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {order.id.slice(0, 14)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {order.listingTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.category}
                        </p>
                      </div>
                      <span className="font-display font-bold text-primary text-base">
                        ₹{order.price.toLocaleString("hi-IN")}
                      </span>
                    </div>

                    {order.status !== "cancelled" && (
                      <OrderTrackingBar
                        status={order.status}
                        language={language as "hi" | "en"}
                        compact
                      />
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        navigate({
                          to: "/orders/$id",
                          params: { id: order.id },
                        })
                      }
                      className="w-full py-2 px-3 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary/5 transition-colors"
                    >
                      {language === "hi" ? "विवरण देखें" : "View Details"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )
      )}
    </div>
  );
}

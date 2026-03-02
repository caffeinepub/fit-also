import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Download, ShoppingBag } from "lucide-react";
import React, { useState, useEffect } from "react";
import type { ExtendedOrder } from "../backend";
import { OrderTrackingBar } from "../components/OrderTrackingBar";
import { useActor } from "../hooks/useActor";
import { useLanguage } from "../hooks/useLanguage";
import { generateInvoice } from "../utils/generateInvoice";

type AnimPhase = "spinning" | "success" | "done";

export function OrderConfirmationPage() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const navigate = useNavigate();
  const { actor } = useActor();
  const { language } = useLanguage();
  const [phase, setPhase] = useState<AnimPhase>("spinning");
  const [order, setOrder] = useState<ExtendedOrder | null>(null);

  // Animation sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("success"), 2000);
    const t2 = setTimeout(() => setPhase("done"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Fetch order details — try backend first, then localStorage fallback
  useEffect(() => {
    if (!orderId) return;

    // First try localStorage fallback for immediate display
    try {
      const allOrders = JSON.parse(
        localStorage.getItem("allOrders") ?? "[]",
      ) as ExtendedOrder[];
      const localOrder = allOrders.find((o) => o.id === orderId);
      if (localOrder) setOrder(localOrder);
    } catch {}

    // Then try backend
    if (actor) {
      actor
        .getOrderById(orderId)
        .then((result) => {
          if (result) setOrder(result);
        })
        .catch(() => {});
    }
  }, [actor, orderId]);

  const handleDownloadInvoice = () => {
    if (order) {
      generateInvoice(order);
    } else {
      // Try to find the order in localStorage fallback
      let savedOrder: ExtendedOrder | null = null;
      try {
        const allOrders = JSON.parse(
          localStorage.getItem("allOrders") ?? "[]",
        ) as ExtendedOrder[];
        savedOrder = allOrders.find((o) => o.id === orderId) ?? null;
      } catch {}

      const fallbackOrder: ExtendedOrder = savedOrder ?? {
        id: orderId,
        customerName: "Customer",
        status: "Order Placed",
        measurementsJson: "{}",
        deliveryAddress: {
          houseNo: "",
          area: "",
          city: "",
          state: "",
          pinCode: "",
        },
        isDeleted: false,
        tailorId: "",
        customerAltPhone: "",
        customerPhone: "",
        customerPrincipal: "",
        productImages: [],
        customizationJson: "{}",
        estimatedDeliveryDate: "",
        orderDate: BigInt(Date.now()),
        orderHash: "",
        paymentMode: "COD",
        category: "",
        listingTitle: "Custom Order",
        totalPrice: 0,
        adminNotes: "",
      };
      generateInvoice(fallbackOrder);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Animation Container */}
      <div className="flex flex-col items-center gap-6 max-w-md w-full">
        {/* Phase: Spinning loader */}
        {phase === "spinning" && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-muted-foreground font-body text-sm">
              आपका ऑर्डर प्रोसेस हो रहा है...
            </p>
          </div>
        )}

        {/* Phase: Success checkmark */}
        {phase === "success" && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center animate-check-pop shadow-lg shadow-green-500/30">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-green-600 font-display font-bold text-lg text-center">
              ऑर्डर कन्फर्म हो गया!
            </p>
          </div>
        )}

        {/* Phase: Full confirmation */}
        {phase === "done" && (
          <div className="w-full space-y-6 animate-fade-in">
            {/* Success badge */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle
                  className="w-12 h-12 text-white"
                  strokeWidth={2.5}
                />
              </div>

              {/* Confetti dots */}
              <div className="flex gap-2">
                {[
                  "bg-yellow-400",
                  "bg-primary",
                  "bg-secondary",
                  "bg-green-500",
                  "bg-pink-500",
                ].map((c, i) => (
                  <span
                    key={c}
                    className={cn("w-2 h-2 rounded-full animate-confetti", c)}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              <h1 className="font-display font-extrabold text-2xl text-foreground text-center leading-tight">
                🎉 बधाई हो!
              </h1>
              <p className="text-muted-foreground text-sm text-center font-body">
                आपका ऑर्डर सफलतापूर्वक दिया गया है
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                  Order ID
                </span>
                <span className="font-mono text-sm font-semibold text-foreground">
                  {orderId.slice(0, 12)}...
                </span>
              </div>

              {order && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                      Item
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {order.listingTitle || "Custom Order"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                      Total
                    </span>
                    <span className="text-base font-display font-bold text-primary">
                      ₹{Number(order.totalPrice || 0).toLocaleString("hi-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                      Payment
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      Cash on Delivery
                    </span>
                  </div>
                </>
              )}

              <div className="border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>
                    {language === "hi"
                      ? "अनुमानित डिलीवरी: 10-14 दिन"
                      : "Estimated Delivery: 10-14 days"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Tracking Bar */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {language === "hi" ? "ऑर्डर प्रगति" : "Order Progress"}
              </p>
              <OrderTrackingBar
                status="Order Placed"
                language={language as "hi" | "en"}
                compact={true}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold font-body hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                Invoice डाउनलोड करें
              </button>

              <button
                type="button"
                onClick={() => navigate({ to: "/orders" })}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-primary text-primary font-semibold font-body hover:bg-primary/5 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                मेरे ऑर्डर देखें
              </button>

              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-muted-foreground font-body text-sm hover:text-foreground transition-colors"
              >
                खरीदारी जारी रखें
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

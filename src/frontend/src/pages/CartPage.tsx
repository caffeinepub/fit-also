import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useCart } from "../hooks/useCart";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLanguage } from "../hooks/useLanguage";

export function CartPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { items, removeItem, totalPrice, totalItems } = useCart();
  const { identity } = useInternetIdentity();

  const handleCheckout = () => {
    if (!identity) {
      toast.error(
        language === "hi"
          ? "चेकआउट के लिए लॉगिन करें"
          : "Please log in to checkout",
      );
      return;
    }
    navigate({ to: "/checkout" });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24">
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
          <ShoppingBag className="w-5 h-5" />
          <h1 className="text-lg font-bold">
            {language === "hi" ? "मेरा कार्ट" : "My Cart"}
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-5">
            <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-40" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {language === "hi" ? "कार्ट खाली है" : "Your cart is empty"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            {language === "hi"
              ? "कोई प्रोडक्ट नहीं है। खरीदारी शुरू करें!"
              : "No items in cart. Start shopping!"}
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            {language === "hi" ? "खरीदारी शुरू करें" : "Browse Collection"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const deliveryCharge = totalPrice >= 999 ? 0 : 49;
  const grandTotal = totalPrice + deliveryCharge;

  return (
    <div className="min-h-screen bg-background pb-32">
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
        <ShoppingBag className="w-5 h-5" />
        <h1 className="text-lg font-bold">
          {language === "hi" ? "मेरा कार्ट" : "My Cart"}
        </h1>
        <span className="ml-auto bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {totalItems} {language === "hi" ? "आइटम" : "items"}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-3 pt-3 space-y-3">
        {/* Free delivery banner */}
        {deliveryCharge === 0 ? (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-sm text-green-700 dark:text-green-400">
            <Truck className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              {language === "hi"
                ? "🎉 आपको फ्री डिलीवरी मिल गई!"
                : "🎉 You got FREE delivery!"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-sm text-primary">
            <Truck className="w-4 h-4 shrink-0" />
            <span>
              {language === "hi"
                ? `₹${999 - totalPrice} और खरीदें — फ्री डिलीवरी पाएं!`
                : `Add ₹${999 - totalPrice} more for FREE delivery!`}
            </span>
          </div>
        )}

        {/* Cart Items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
          >
            <div className="flex gap-0">
              {/* Image */}
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/listings/$id",
                    params: { id: item.listing.id },
                  })
                }
                className="relative w-28 shrink-0 aspect-[3/4] overflow-hidden bg-muted"
                aria-label={item.listing.title}
              >
                <img
                  src={
                    item.listing.imageUrl ||
                    "/assets/generated/garment-placeholder.dim_400x500.png"
                  }
                  alt={item.listing.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Content */}
              <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {item.listing.category}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5 line-clamp-2">
                    {item.listing.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by {item.listing.tailorName}
                  </p>

                  {/* Customization chips */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {Object.entries(item.customization)
                      .slice(0, 3)
                      .map(([k, v]) => (
                        <span
                          key={k}
                          className="px-1.5 py-0.5 rounded bg-muted text-[9px] text-muted-foreground capitalize"
                        >
                          {v}
                        </span>
                      ))}
                  </div>

                  <p className="font-display font-bold text-primary text-base mt-2">
                    ₹{item.listing.basePrice.toLocaleString("hi-IN")}
                  </p>
                  {item.listing.estimatedDays > 0 && (
                    <p className="text-xs text-green-600 mt-0.5">
                      🕐 {item.listing.estimatedDays}{" "}
                      {language === "hi" ? "दिन में डिलीवरी" : "days delivery"}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-2">
                  {/* Quantity display (custom orders = 1 typically) */}
                  <div className="flex items-center gap-2 bg-muted rounded-lg overflow-hidden border border-border">
                    <span className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {language === "hi" ? "मात्रा:" : "Qty:"} {item.quantity}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.id);
                      toast.success(
                        language === "hi"
                          ? "कार्ट से हटाया गया"
                          : "Removed from cart",
                      );
                    }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded"
                    aria-label="Remove from cart"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {language === "hi" ? "हटाएं" : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Price Breakdown */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-foreground">
            {language === "hi" ? "मूल्य विवरण" : "Price Details"}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === "hi"
                  ? `${items.length} आइटम का मूल्य`
                  : `Price (${items.length} items)`}
              </span>
              <span>₹{totalPrice.toLocaleString("hi-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === "hi" ? "डिलीवरी शुल्क" : "Delivery Charges"}
              </span>
              <span
                className={
                  deliveryCharge === 0 ? "text-green-600 font-semibold" : ""
                }
              >
                {deliveryCharge === 0
                  ? language === "hi"
                    ? "फ्री"
                    : "FREE"
                  : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
              <span>{language === "hi" ? "कुल देय राशि" : "Total Amount"}</span>
              <span className="text-primary font-display font-bold">
                ₹{grandTotal.toLocaleString("hi-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
          <span>
            {language === "hi"
              ? "सुरक्षित भुगतान — 100% संरक्षित"
              : "Safe & Secure Payment — 100% Protected"}
          </span>
        </div>
      </div>

      {/* Fixed bottom checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {language === "hi" ? "कुल" : "Total"}
            </p>
            <p className="font-display font-bold text-primary text-lg">
              ₹{grandTotal.toLocaleString("hi-IN")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="flex-1 py-3.5 rounded-xl font-display font-bold text-sm text-primary-foreground bg-primary hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {language === "hi" ? "चेकआउट करें" : "Proceed to Checkout"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

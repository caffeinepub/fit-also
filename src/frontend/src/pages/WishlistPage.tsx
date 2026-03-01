import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Eye,
  Heart,
  ShoppingCart,
  Zap,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../hooks/useLanguage";
import { useWishlist } from "../hooks/useWishlist";
import type { CustomizationOptions, ProductListing } from "../types/catalog";

export function WishlistPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const buildListing = (item: (typeof wishlistItems)[0]): ProductListing => ({
    id: item.id,
    tailorId: "demo-tailor",
    tailorName: "Fit Also Studio",
    tailorCity: "Mumbai",
    category: item.category as any,
    title: item.title,
    description: item.title,
    basePrice: item.price,
    estimatedDays: 14,
    availableNeckStyles: ["round"],
    availableSleeveStyles: ["full"],
    availableFabrics: ["cotton"],
    availableColors: ["ivory"],
    availableWorkTypes: ["plain"],
    imageUrl: item.imageUrl,
    createdAt: Date.now(),
  });

  const DEFAULT_CUSTOMIZATION: CustomizationOptions = {
    neckStyle: "round",
    sleeveStyle: "full",
    fabricType: "cotton",
    colorPattern: "ivory",
    workType: "plain",
  };

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    addItem(buildListing(item), DEFAULT_CUSTOMIZATION);
    toast.success(`${item.title} कार्ट में जोड़ा गया! 🛒`);
  };

  const handleBuyNow = (item: (typeof wishlistItems)[0]) => {
    const buyNowItem = {
      listing: buildListing(item),
      customization: DEFAULT_CUSTOMIZATION,
    };
    try {
      sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
    } catch {}
    navigate({ to: "/checkout", search: { mode: "buynow" } as any });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
        <Heart className="w-5 h-5 fill-white" />
        <h1 className="text-lg font-bold tracking-wide">मेरी विश लिस्ट</h1>
        <span className="ml-auto bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {wishlistItems.length} items
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-5 shadow-inner">
            <Heart className="w-12 h-12 text-red-300" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            आपकी विश लिस्ट खाली है
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            पसंदीदा प्रोडक्ट्स को हार्ट आइकन से सेव करें और यहाँ देखें।
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            खरीदारी शुरू करें
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="px-3 pt-4 space-y-3">
          <p className="text-sm text-muted-foreground px-1">
            {wishlistItems.length} saved items
          </p>

          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-border overflow-hidden flex gap-0"
            >
              {/* Image */}
              <button
                type="button"
                onClick={() =>
                  navigate({ to: "/listings/$id", params: { id: item.id } })
                }
                className="relative w-28 shrink-0 aspect-[3/4] overflow-hidden bg-gray-100"
                aria-label={`${item.title} देखें`}
              >
                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=400&fit=crop"
                  }
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Info */}
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {item.category}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5 line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-base font-bold text-primary mt-1">
                    ₹{item.price.toLocaleString("hi-IN")}
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                  {/* Add to cart */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {language === "hi" ? "कार्ट में जोड़ें" : "Add to Cart"}
                  </button>
                  {/* Buy It Now */}
                  <button
                    type="button"
                    onClick={() => handleBuyNow(item)}
                    className="flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {language === "hi" ? "अभी खरीदें" : "Buy It Now"}
                  </button>

                  <div className="flex gap-2">
                    {/* View details */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate({
                          to: "/listings/$id",
                          params: { id: item.id },
                        })
                      }
                      className="flex-1 flex items-center justify-center gap-1 border border-primary text-primary text-xs font-semibold py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      देखें
                    </button>

                    {/* Remove from wishlist */}
                    <button
                      type="button"
                      onClick={() => {
                        removeFromWishlist(item.id);
                        toast("विश लिस्ट से हटाया गया");
                      }}
                      className="flex items-center justify-center gap-1 border border-border text-muted-foreground text-xs py-1.5 px-3 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Shop More */}
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="w-full mt-4 py-3 border border-primary text-primary text-sm font-semibold rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            और खरीदारी करें <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

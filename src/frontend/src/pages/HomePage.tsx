import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ProductImageSlider } from "../components/ProductImageSlider";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../hooks/useLanguage";
import { useWishlist } from "../hooks/useWishlist";
import type {
  CustomizationOptions,
  GarmentCategory,
  ProductListing,
} from "../types/catalog";

// ─── Mock Data ───────────────────────────────────────────────────────────────

interface MockProduct {
  id: string;
  name: string;
  nameHi: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: GarmentCategory;
}

const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "1",
    name: "Anarkali",
    nameHi: "अनारकली",
    price: 2499,
    originalPrice: 3200,
    rating: 4.8,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=400&fit=crop",
    category: "Anarkalis",
  },
  {
    id: "2",
    name: "Saree Blouse",
    nameHi: "साड़ी ब्लाउज",
    price: 1800,
    originalPrice: 2400,
    rating: 4.8,
    reviews: 187,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop",
    category: "Saree Blouses",
  },
  {
    id: "3",
    name: "Mens Suit",
    nameHi: "मेन्स सूट",
    price: 4500,
    originalPrice: 6000,
    rating: 4.9,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=300&h=400&fit=crop",
    category: "Suits",
  },
  {
    id: "4",
    name: "Bridal Lehenga",
    nameHi: "ब्राइडल लहंगा",
    price: 3200,
    originalPrice: 4200,
    rating: 4.7,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
    category: "Lehengas",
  },
  {
    id: "5",
    name: "Festive Kurta",
    nameHi: "फेस्टिव कुर्ता",
    price: 1299,
    originalPrice: 1800,
    rating: 4.5,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=300&h=400&fit=crop",
    category: "Kurtas",
  },
  {
    id: "6",
    name: "Designer Sherwani",
    nameHi: "डिज़ाइनर शेरवानी",
    price: 2100,
    originalPrice: 2800,
    rating: 4.8,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=400&fit=crop",
    category: "Sherwanis",
  },
];

const BANNER_SLIDES = [
  {
    id: "b1",
    bgGradient: "linear-gradient(135deg, #1565C0, #303F9F)",
    badge: "🔥 सीमित ऑफर",
    title: "विशेष छूट: नई ड्रेस सिलाई!",
    subtitle: "कस्टम सिलाई पर ₹500 की बचत करें",
    cta: "अभी बुक करें",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    discount: "25% OFF",
  },
  {
    id: "b2",
    bgGradient: "linear-gradient(135deg, #6A1B9A, #880E4F)",
    badge: "✨ नया कलेक्शन",
    title: "ब्राइडल लहंगा कलेक्शन 2025",
    subtitle: "हस्त-निर्मित, प्रीमियम कपड़े",
    cta: "देखें",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop",
    discount: "NEW",
  },
  {
    id: "b3",
    bgGradient: "linear-gradient(135deg, #2E7D32, #00695C)",
    badge: "👔 मेन्स स्पेशल",
    title: "शेरवानी और सूट सेल!",
    subtitle: "त्योहारों के लिए तैयार — ₹2999 से शुरू",
    cta: "शॉप करें",
    image:
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=400&h=300&fit=crop",
    discount: "30% OFF",
  },
];

const CATEGORIES = [
  { name: "कुर्ता", emoji: "🧥", cat: "Kurtas" },
  { name: "अनारकली", emoji: "👗", cat: "Anarkalis" },
  { name: "लहंगा", emoji: "✨", cat: "Lehengas" },
  { name: "सूट", emoji: "🤵", cat: "Suits" },
  { name: "शेरवानी", emoji: "👘", cat: "Sherwanis" },
  { name: "साड़ी ब्लाउज", emoji: "🌸", cat: "Saree Blouses" },
  { name: "ट्राउजर", emoji: "👖", cat: "Trousers" },
  { name: "कपड़े", emoji: "🧵", cat: "fabrics" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold bg-green-600 text-white">
      {rating}
      <Star className="h-2.5 w-2.5 fill-white" />
    </span>
  );
}

function DiscountPercent({
  original,
  current,
}: { original: number; current: number }) {
  const pct = Math.round(((original - current) / original) * 100);
  return (
    <span className="text-xs font-semibold text-green-600">{pct}% छूट</span>
  );
}

function TrendingCard({ product }: { product: MockProduct }) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <button
      type="button"
      className="snap-item shrink-0 w-36 bg-white rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow cursor-pointer group text-left"
      onClick={() =>
        navigate({ to: "/listings/$id", params: { id: product.id } })
      }
      aria-label={`${product.nameHi} देखें`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.nameHi}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-1.5 left-1.5">
          <span className="trending-badge text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
            <TrendingUp className="h-2.5 w-2.5" />
            ट्रेंडिंग
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({
              id: product.id,
              title: product.nameHi,
              price: product.price,
              category: product.category,
              imageUrl: product.image,
            });
            if (!wishlisted)
              toast.success(`${product.nameHi} विश लिस्ट में जोड़ा! ❤️`);
          }}
          className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
          aria-label={wishlisted ? "Wishlist से हटाएं" : "Wishlist में जोड़ें"}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-400",
            )}
          />
        </button>
      </div>
      {/* Info */}
      <div className="p-2">
        <p className="text-xs font-body font-medium text-foreground truncate">
          {product.nameHi}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <StarRating rating={product.rating} />
          <span className="text-[10px] text-muted-foreground">
            ({product.reviews})
          </span>
        </div>
        <p className="text-sm font-display font-bold text-foreground mt-1">
          ₹{product.price.toLocaleString("hi-IN")}
        </p>
        <p className="text-[10px] text-muted-foreground line-through">
          ₹{product.originalPrice.toLocaleString("hi-IN")}
        </p>
      </div>
    </button>
  );
}

function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
}: {
  product: MockProduct;
  onAddToCart: (id: string) => void;
  onBuyNow: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { language } = useLanguage();
  const wishlisted = isWishlisted(product.id);

  const productImages = [product.image];

  return (
    <div className="bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-200 cursor-pointer group flex flex-col">
      {/* Image with slider */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted w-full">
        <ProductImageSlider
          images={productImages}
          productId={product.id}
          onTap={() =>
            navigate({ to: "/listings/$id", params: { id: product.id } })
          }
          className="w-full h-full"
        />
        <span className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-sm pointer-events-none z-10">
          {Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100,
          )}
          % OFF
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({
              id: product.id,
              title: product.nameHi,
              price: product.price,
              category: product.category,
              imageUrl: product.image,
            });
            if (!wishlisted)
              toast.success(`${product.nameHi} विश लिस्ट में जोड़ा! ❤️`);
          }}
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 dark:bg-card/90 flex items-center justify-center shadow-sm hover:bg-white dark:hover:bg-card transition-colors z-10"
          aria-label={wishlisted ? "Wishlist से हटाएं" : "Wishlist में जोड़ें"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-400",
            )}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs font-body text-muted-foreground">
          {product.name}
        </p>
        <p className="text-sm font-body font-semibold text-foreground mt-0.5 truncate">
          {product.nameHi}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price row */}
        <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base font-display font-bold text-foreground">
            ₹{product.price.toLocaleString("hi-IN")}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.originalPrice.toLocaleString("hi-IN")}
          </span>
          <DiscountPercent
            original={product.originalPrice}
            current={product.price}
          />
        </div>

        {/* Buttons */}
        <div className="mt-2 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            className="w-full py-1.5 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold font-body flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {language === "hi" ? "कार्ट में जोड़ें" : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={() => onBuyNow(product.id)}
            className="w-full py-1.5 px-3 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold font-body flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
          >
            <Zap className="h-3.5 w-3.5" />
            {language === "hi" ? "अभी खरीदें" : "Buy It Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Banner ──────────────────────────────────────────────────────────────────

function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setActiveIndex(index);
      setTimeout(() => setAnimating(false), 600);
    },
    [animating],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slide = BANNER_SLIDES[activeIndex];

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Promotional banners"
    >
      {/* Slide */}
      <div
        className="relative min-h-[200px] sm:min-h-[260px] flex items-center overflow-hidden"
        style={{ background: slide.bgGradient }}
      >
        {/* Background image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 pointer-events-none">
          <img
            src={slide.image}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-40 sm:opacity-60"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-8 py-6 max-w-[62%] sm:max-w-[55%]">
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <span className="text-white/90 text-[10px] font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
              {slide.badge}
            </span>
            <span className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <Zap className="h-3 w-3" />
              {slide.discount}
            </span>
          </div>
          <h2 className="font-display font-bold text-white text-lg sm:text-2xl leading-tight mb-2">
            {slide.title}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm font-body mb-4">
            {slide.subtitle}
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="inline-flex items-center gap-1.5 bg-white text-primary font-semibold text-xs sm:text-sm px-4 py-2 rounded-full hover:bg-white/95 active:scale-95 transition-all shadow-sm"
          >
            {slide.cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {BANNER_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === activeIndex ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50",
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Helpers (outside component to avoid re-creation) ────────────────────────

function buildListing(product: MockProduct): ProductListing {
  return {
    id: product.id,
    tailorId: "demo-tailor",
    tailorName: "Fit Also Studio",
    tailorCity: "Mumbai",
    category: product.category,
    title: product.name,
    description: product.nameHi,
    basePrice: product.price,
    estimatedDays: 14,
    availableNeckStyles: ["round", "vNeck", "mandarin"],
    availableSleeveStyles: ["full", "half", "sleeveless"],
    availableFabrics: ["cotton", "silk", "linen"],
    availableColors: ["ivory", "red", "navy"],
    availableWorkTypes: ["plain", "embroidery", "zari"],
    imageUrl: product.image,
    createdAt: Date.now(),
  };
}

const DEFAULT_CUSTOMIZATION: CustomizationOptions = {
  neckStyle: "round",
  sleeveStyle: "full",
  fabricType: "cotton",
  colorPattern: "ivory",
  workType: "plain",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = useCallback(
    (productId: string) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (!product) return;
      addItem(buildListing(product), DEFAULT_CUSTOMIZATION);
      toast.success(`${product.nameHi} कार्ट में जोड़ा गया! 🛒`);
    },
    [addItem],
  );

  const handleBuyNow = useCallback(
    (productId: string) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (!product) return;
      const item = {
        listing: buildListing(product),
        customization: DEFAULT_CUSTOMIZATION,
      };
      try {
        sessionStorage.setItem("buyNowItem", JSON.stringify(item));
      } catch {}
      navigate({ to: "/checkout", search: { mode: "buynow" } as any });
    },
    [navigate],
  );

  return (
    <div className="pb-safe animate-fade-in bg-background">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Row */}
      <section
        className="bg-white py-4 px-3 border-b border-border"
        aria-label="Product categories"
      >
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none snap-scroll pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.cat}
              type="button"
              onClick={() =>
                navigate({
                  to: "/catalog",
                  search: { category: cat.cat } as any,
                })
              }
              className="snap-item shrink-0 flex flex-col items-center gap-1.5 min-w-[56px]"
              aria-label={`${cat.name} देखें`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center text-2xl border border-primary/10">
                {cat.emoji}
              </div>
              <span className="text-[10px] font-body font-medium text-foreground text-center leading-tight whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-white mt-2 py-4" aria-label="Trending products">
        <div className="flex items-center justify-between px-3 mb-3">
          <div>
            <h2 className="font-display font-bold text-foreground text-base leading-tight">
              आज का ट्रेंडिंग
            </h2>
            <p className="text-xs font-body text-muted-foreground mt-0.5">
              हाईएस्ट रेटेड डिज़ाइन्स
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="flex items-center gap-0.5 text-primary text-xs font-semibold"
          >
            सभी देखें <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto snap-scroll px-3 pb-2 scrollbar-none">
          {MOCK_PRODUCTS.slice(0, 5).map((product) => (
            <TrendingCard key={product.id} product={product} />
          ))}
          {/* View all card */}
          <button
            type="button"
            className="snap-item shrink-0 w-36 bg-primary/5 rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-2 border border-primary/20 hover:bg-primary/10 transition-colors"
            onClick={() => navigate({ to: "/catalog" })}
            aria-label="सभी ट्रेंडिंग प्रोडक्ट देखें"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-primary text-center px-2">
              और देखें
            </p>
          </button>
        </div>
      </section>

      {/* Promo Strip */}
      <section className="mx-3 my-2" aria-label="Free delivery promotion">
        <div className="bg-primary rounded-xl p-4 flex items-center justify-between overflow-hidden relative">
          <div
            className="absolute right-0 inset-y-0 w-24 opacity-10 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              fill="white"
              role="presentation"
            >
              <circle cx="80" cy="20" r="40" />
              <circle cx="20" cy="80" r="30" />
            </svg>
          </div>
          <div className="relative">
            <p className="text-white font-display font-bold text-sm">
              Free Delivery
            </p>
            <p className="text-white/80 text-xs font-body mt-0.5">
              ₹999+ के ऑर्डर पर फ्री डिलीवरी
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="relative shrink-0 bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/95 transition-colors"
          >
            शॉप करें
          </button>
        </div>
      </section>

      {/* Featured Designs — 2-column grid */}
      <section className="bg-white mt-2 py-4" aria-label="Featured designs">
        <div className="flex items-center justify-between px-3 mb-3">
          <div>
            <h2 className="font-display font-bold text-foreground text-base leading-tight">
              हमारे चुनिंदा डिज़ाइन्स
            </h2>
            <p className="text-xs font-body text-muted-foreground mt-0.5">
              बेस्ट सेलर्स
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="flex items-center gap-0.5 text-primary text-xs font-semibold"
          >
            सभी देखें <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 px-3">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>

        {/* Load more */}
        <div className="px-3 mt-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="w-full py-3 border border-primary text-primary text-sm font-semibold rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5"
          >
            और डिज़ाइन्स देखें <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Why Fit Also */}
      <section
        className="bg-white mt-2 py-5 px-3"
        aria-label="Why choose Fit Also"
      >
        <h2 className="font-display font-bold text-foreground text-base mb-4 text-center">
          Fit Also क्यों चुनें?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: "✂️", title: "कस्टम सिलाई", desc: "आपके नाप से बना" },
            { icon: "⭐", title: "प्रीमियम कपड़े", desc: "बेस्ट क्वालिटी" },
            { icon: "🚚", title: "पैन-इंडिया", desc: "घर तक डिलीवरी" },
            { icon: "🛡️", title: "क्वालिटी गारंटी", desc: "100% संतुष्टि" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/50 gap-2"
            >
              <span className="text-2xl" role="img" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <p className="text-xs font-display font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="text-[10px] font-body text-muted-foreground mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-2 px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          <span className="font-display font-extrabold text-xl tracking-widest text-white">
            FIT ALSO
          </span>
          <p className="text-white/60 text-xs font-body text-center max-w-xs">
            India's premier custom tailoring marketplace — crafted with love.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-body text-white/60">
            <button
              type="button"
              className="hover:text-white transition-colors"
            >
              About
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors"
            >
              Contact
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors"
            >
              Privacy
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors"
            >
              Terms
            </button>
          </div>
          <p className="text-white/40 text-[10px] font-body text-center mt-2">
            © {new Date().getFullYear()} Fit Also. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

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
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
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
      "https://images.unsplash.com/photo-1609051876096-b44a3a3a6a1b?w=300&h=400&fit=crop",
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
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=400&fit=crop",
    category: "Sherwanis",
  },
  {
    id: "7",
    name: "Embroidered Kurti",
    nameHi: "कढ़ाई कुर्ती",
    price: 1599,
    originalPrice: 2200,
    rating: 4.6,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=300&h=400&fit=crop",
    category: "Kurtas",
  },
  {
    id: "8",
    name: "Silk Palazzo Set",
    nameHi: "सिल्क पलाज़ो सेट",
    price: 2800,
    originalPrice: 3600,
    rating: 4.7,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=300&h=400&fit=crop",
    category: "Suits",
  },
  {
    id: "9",
    name: "Heavy Lehenga Choli",
    nameHi: "हेवी लहंगा चोली",
    price: 5500,
    originalPrice: 7000,
    rating: 4.9,
    reviews: 267,
    image:
      "https://images.unsplash.com/photo-1596900779744-2489d0eedf30?w=300&h=400&fit=crop",
    category: "Lehengas",
  },
  {
    id: "10",
    name: "Cotton Salwar Suit",
    nameHi: "कॉटन सलवार सूट",
    price: 1100,
    originalPrice: 1500,
    rating: 4.4,
    reviews: 73,
    image:
      "https://images.unsplash.com/photo-1588701023429-9e8b657cf7c8?w=300&h=400&fit=crop",
    category: "Suits",
  },
  {
    id: "11",
    name: "Banarasi Blouse",
    nameHi: "बनारसी ब्लाउज",
    price: 2200,
    originalPrice: 2900,
    rating: 4.8,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1593173886081-ecab7d0cf6a5?w=300&h=400&fit=crop",
    category: "Saree Blouses",
  },
  {
    id: "12",
    name: "Jodhpuri Bandhgala",
    nameHi: "जोधपुरी बंधगला",
    price: 3800,
    originalPrice: 5000,
    rating: 4.9,
    reviews: 134,
    image:
      "https://images.unsplash.com/photo-1570976447640-ac859083963f?w=300&h=400&fit=crop",
    category: "Sherwanis",
  },
  {
    id: "13",
    name: "Flared Anarkali Gown",
    nameHi: "फ्लेयर्ड अनारकली गाउन",
    price: 3100,
    originalPrice: 4000,
    rating: 4.7,
    reviews: 211,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=400&fit=crop",
    category: "Anarkalis",
  },
  {
    id: "14",
    name: "Pathani Kurta Set",
    nameHi: "पठानी कुर्ता सेट",
    price: 1750,
    originalPrice: 2300,
    rating: 4.5,
    reviews: 65,
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=300&h=400&fit=crop",
    category: "Kurtas",
  },
  {
    id: "15",
    name: "Party Wear Saree Blouse",
    nameHi: "पार्टी वेयर साड़ी ब्लाउज",
    price: 1950,
    originalPrice: 2600,
    rating: 4.6,
    reviews: 108,
    image:
      "https://images.unsplash.com/photo-1617727553252-65863c156eb9?w=300&h=400&fit=crop",
    category: "Saree Blouses",
  },
  {
    id: "16",
    name: "Wedding Sherwani",
    nameHi: "वेडिंग शेरवानी",
    price: 6500,
    originalPrice: 8500,
    rating: 5.0,
    reviews: 322,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=400&fit=crop",
    category: "Sherwanis",
  },
  {
    id: "17",
    name: "Chikankari Kurti",
    nameHi: "चिकनकारी कुर्ती",
    price: 1450,
    originalPrice: 1900,
    rating: 4.6,
    reviews: 154,
    image:
      "https://images.unsplash.com/photo-1583482183021-bd3f0977b5e5?w=300&h=400&fit=crop",
    category: "Kurtas",
  },
  {
    id: "18",
    name: "Velvet Lehenga",
    nameHi: "वेलवेट लहंगा",
    price: 4200,
    originalPrice: 5500,
    rating: 4.8,
    reviews: 176,
    image:
      "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=300&h=400&fit=crop",
    category: "Lehengas",
  },
  {
    id: "19",
    name: "Linen Blazer Suit",
    nameHi: "लिनन ब्लेज़र सूट",
    price: 3400,
    originalPrice: 4500,
    rating: 4.7,
    reviews: 91,
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=400&fit=crop",
    category: "Suits",
  },
  {
    id: "20",
    name: "Mirror Work Anarkali",
    nameHi: "मिरर वर्क अनारकली",
    price: 2750,
    originalPrice: 3500,
    rating: 4.8,
    reviews: 243,
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=400&fit=crop",
    category: "Anarkalis",
  },
];

const BANNER_SLIDES_HI = [
  {
    id: "b1",
    bgGradient: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
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
    bgGradient: "linear-gradient(135deg, #2a2a2a, #404040)",
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
    bgGradient: "linear-gradient(135deg, #1c1c1c, #383838)",
    badge: "👔 मेन्स स्पेशल",
    title: "शेरवानी और सूट सेल!",
    subtitle: "त्योहारों के लिए तैयार — ₹2999 से शुरू",
    cta: "शॉप करें",
    image:
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=400&h=300&fit=crop",
    discount: "30% OFF",
  },
];

const BANNER_SLIDES_EN = [
  {
    id: "b1",
    bgGradient: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
    badge: "🔥 Limited Offer",
    title: "Special Discount: New Dress Stitching!",
    subtitle: "Save ₹500 on custom tailoring",
    cta: "Book Now",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    discount: "25% OFF",
  },
  {
    id: "b2",
    bgGradient: "linear-gradient(135deg, #2a2a2a, #404040)",
    badge: "✨ New Collection",
    title: "Bridal Lehenga Collection 2025",
    subtitle: "Handcrafted, premium fabrics",
    cta: "View",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop",
    discount: "NEW",
  },
  {
    id: "b3",
    bgGradient: "linear-gradient(135deg, #1c1c1c, #383838)",
    badge: "👔 Men's Special",
    title: "Sherwani & Suit Sale!",
    subtitle: "Festival-ready — starting ₹2999",
    cta: "Shop Now",
    image:
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=400&h=300&fit=crop",
    discount: "30% OFF",
  },
];

const CATEGORIES_HI = [
  { name: "कुर्ता", emoji: "🧥", cat: "Kurtas" },
  { name: "अनारकली", emoji: "👗", cat: "Anarkalis" },
  { name: "लहंगा", emoji: "✨", cat: "Lehengas" },
  { name: "सूट", emoji: "🤵", cat: "Suits" },
  { name: "शेरवानी", emoji: "👘", cat: "Sherwanis" },
  { name: "साड़ी ब्लाउज", emoji: "🌸", cat: "Saree Blouses" },
  { name: "ट्राउजर", emoji: "👖", cat: "Trousers" },
];

const CATEGORIES_EN = [
  { name: "Kurta", emoji: "🧥", cat: "Kurtas" },
  { name: "Anarkali", emoji: "👗", cat: "Anarkalis" },
  { name: "Lehenga", emoji: "✨", cat: "Lehengas" },
  { name: "Suit", emoji: "🤵", cat: "Suits" },
  { name: "Sherwani", emoji: "👘", cat: "Sherwanis" },
  { name: "Saree Blouse", emoji: "🌸", cat: "Saree Blouses" },
  { name: "Trouser", emoji: "👖", cat: "Trousers" },
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
  const { language } = useLanguage();
  const pct = Math.round(((original - current) / original) * 100);
  return (
    <span className="text-xs font-semibold text-green-600">
      {pct}
      {language === "hi" ? "% छूट" : "% OFF"}
    </span>
  );
}

function TrendingCard({ product }: { product: MockProduct }) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { language } = useLanguage();
  const wishlisted = isWishlisted(product.id);
  const displayName = language === "hi" ? product.nameHi : product.name;

  return (
    <button
      type="button"
      className="snap-item shrink-0 w-36 bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow cursor-pointer group text-left"
      onClick={() =>
        navigate({ to: "/listings/$id", params: { id: product.id } })
      }
      aria-label={`${displayName} view`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={displayName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-1.5 left-1.5">
          <span className="trending-badge text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
            <TrendingUp className="h-2.5 w-2.5" />
            {language === "hi" ? "ट्रेंडिंग" : "Trending"}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({
              id: product.id,
              title: displayName,
              price: product.price,
              category: product.category,
              imageUrl: product.image,
            });
            if (!wishlisted)
              toast.success(
                language === "hi"
                  ? `${product.nameHi} विश लिस्ट में जोड़ा! ❤️`
                  : `${product.name} added to wishlist! ❤️`,
              );
          }}
          className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
          aria-label={
            wishlisted
              ? language === "hi"
                ? "Wishlist से हटाएं"
                : "Remove from wishlist"
              : language === "hi"
                ? "Wishlist में जोड़ें"
                : "Add to wishlist"
          }
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
          {displayName}
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
            const displayName =
              language === "hi" ? product.nameHi : product.name;
            toggleWishlist({
              id: product.id,
              title: displayName,
              price: product.price,
              category: product.category,
              imageUrl: product.image,
            });
            if (!wishlisted)
              toast.success(
                language === "hi"
                  ? `${product.nameHi} विश लिस्ट में जोड़ा! ❤️`
                  : `${product.name} added to wishlist! ❤️`,
              );
          }}
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 dark:bg-card/90 flex items-center justify-center shadow-sm hover:bg-white dark:hover:bg-card transition-colors z-10"
          aria-label={
            wishlisted
              ? language === "hi"
                ? "Wishlist से हटाएं"
                : "Remove from wishlist"
              : language === "hi"
                ? "Wishlist में जोड़ें"
                : "Add to wishlist"
          }
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
        <p className="text-sm font-body font-semibold text-foreground mt-0.5 truncate">
          {language === "hi" ? product.nameHi : product.name}
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
  const navigate = useNavigate();
  const { language } = useLanguage();
  const BANNER_SLIDES = language === "hi" ? BANNER_SLIDES_HI : BANNER_SLIDES_EN;
  const touchStartX = useRef<number>(0);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoSlide = useCallback(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 3000);
  }, [BANNER_SLIDES.length]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [startAutoSlide]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index);
      startAutoSlide();
    },
    [startAutoSlide],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
      } else {
        setActiveIndex(
          (prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length,
        );
      }
    }
    startAutoSlide();
  };

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Promotional banners"
    >
      {/* Sliding track */}
      <div
        className="min-h-[200px] sm:min-h-[260px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Track — all slides side by side */}
        <div
          className="flex"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: "transform 0.5s ease-in-out",
            width: `${BANNER_SLIDES.length * 100}%`,
          }}
        >
          {BANNER_SLIDES.map((slide) => (
            <button
              key={slide.id}
              type="button"
              className="relative flex items-center text-left"
              style={{
                background: slide.bgGradient,
                width: `${100 / BANNER_SLIDES.length}%`,
                minHeight: "200px",
              }}
              onClick={() => navigate({ to: "/catalog" })}
              aria-label={slide.title}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: "/catalog" });
                  }}
                  className="inline-flex items-center gap-1.5 bg-white text-primary font-semibold text-xs sm:text-sm px-4 py-2 rounded-full hover:bg-white/95 active:scale-95 transition-all shadow-sm"
                >
                  {slide.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dot indicators — overlaid at bottom */}
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
  const { language } = useLanguage();
  const CATEGORIES = language === "hi" ? CATEGORIES_HI : CATEGORIES_EN;

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(8);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            // Loop infinitely by cycling through products
            return prev + 6;
          });
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = useCallback(
    (productId: string) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (!product) return;
      addItem(buildListing(product), DEFAULT_CUSTOMIZATION);
      toast.success(
        language === "hi"
          ? `${product.nameHi} कार्ट में जोड़ा गया! 🛒`
          : `${product.name} added to cart! 🛒`,
      );
    },
    [addItem, language],
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
        className="bg-background py-4 px-3 border-b border-border"
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
      <section
        className="bg-background mt-2 py-4"
        aria-label="Trending products"
      >
        <div className="flex items-center justify-between px-3 mb-3">
          <div>
            <h2 className="font-display font-bold text-foreground text-base leading-tight">
              {language === "hi" ? "आज का ट्रेंडिंग" : "Today's Trending"}
            </h2>
            <p className="text-xs font-body text-muted-foreground mt-0.5">
              {language === "hi"
                ? "हाईएस्ट रेटेड डिज़ाइन्स"
                : "Highest Rated Designs"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="flex items-center gap-0.5 text-primary text-xs font-semibold"
          >
            {language === "hi" ? "सभी देखें" : "View All"}{" "}
            <ChevronRight className="h-4 w-4" />
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
            aria-label="View all trending products"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-primary text-center px-2">
              {language === "hi" ? "और देखें" : "View More"}
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
              {language === "hi" ? "फ्री डिलीवरी" : "Free Delivery"}
            </p>
            <p className="text-white/80 text-xs font-body mt-0.5">
              {language === "hi"
                ? "₹999+ के ऑर्डर पर फ्री डिलीवरी"
                : "Free delivery on orders ₹999+"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="relative shrink-0 bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/95 transition-colors"
          >
            {language === "hi" ? "शॉप करें" : "Shop Now"}
          </button>
        </div>
      </section>

      {/* Featured Designs — 2-column grid */}
      <section
        className="bg-background mt-2 py-4"
        aria-label="Featured designs"
      >
        <div className="flex items-center justify-between px-3 mb-3">
          <div>
            <h2 className="font-display font-bold text-foreground text-base leading-tight">
              {language === "hi" ? "हमारे चुनिंदा डिज़ाइन्स" : "Featured Designs"}
            </h2>
            <p className="text-xs font-body text-muted-foreground mt-0.5">
              {language === "hi" ? "बेस्ट सेलर्स" : "Best Sellers"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/catalog" })}
            className="flex items-center gap-0.5 text-primary text-xs font-semibold"
          >
            {language === "hi" ? "सभी देखें" : "View All"}{" "}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 px-3">
          {Array.from({ length: visibleCount }, (_, i) => {
            const product = MOCK_PRODUCTS[i % MOCK_PRODUCTS.length];
            return (
              <ProductCard
                key={`${product.id}-${i}`}
                product={{ ...product, id: `${product.id}-${i}` }}
                onAddToCart={() => handleAddToCart(product.id)}
                onBuyNow={() => handleBuyNow(product.id)}
              />
            );
          })}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4 mt-2" aria-hidden="true" />
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

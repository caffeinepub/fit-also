import { Toaster } from "@/components/ui/sonner";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Scissors,
  ShoppingBag,
  Star,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { CustomizationSelector } from "../components/CustomizationSelector";
import { LuxuryButton } from "../components/LuxuryButton";
import { LuxuryCard } from "../components/LuxuryCard";
import { useBackendProducts } from "../hooks/useBackendProducts";
import { useCart } from "../hooks/useCart";
import { useCatalog } from "../hooks/useCatalog";
import { useLanguage } from "../hooks/useLanguage";
import { useTailors } from "../hooks/useTailors";
import type {
  CustomizationOptions,
  ProductListing,
  ProductReview,
} from "../types/catalog";

// ─── Price helpers ─────────────────────────────────────────────────────────────

function getDisplayPrice(listing: ProductListing) {
  const selling =
    listing.discountPrice ?? listing.originalPrice ?? listing.basePrice;
  const mrp = listing.discountPrice
    ? (listing.originalPrice ?? listing.basePrice)
    : undefined;
  return { selling, mrp };
}

function discountPct(selling: number, mrp: number) {
  return Math.round(((mrp - selling) / mrp) * 100);
}

// ─── Star rating display ───────────────────────────────────────────────────────

function StarDisplay({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count} reviews)</span>
      )}
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: ProductReview }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <div className="border border-border rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {review.userName}
            </p>
            <p className="text-[10px] text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i <= review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
}

// ─── Video embed ──────────────────────────────────────────────────────────────

function VideoEmbed({ url }: { url: string }) {
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");

  if (isYoutube) {
    let embedUrl = url;
    const ytMatch =
      url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
    if (ytMatch) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Product video"
        />
      </div>
    );
  }

  return (
    // biome-ignore lint/a11y/useMediaCaption: product video
    <video
      src={url}
      controls
      className="w-full rounded-xl max-h-64 object-cover"
      playsInline
    />
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({
  mainImageUrl,
  additionalUrls,
  title,
}: {
  mainImageUrl: string;
  additionalUrls?: string[];
  title: string;
}) {
  const allImages = [
    mainImageUrl,
    ...(additionalUrls?.filter(Boolean) ?? []),
  ].filter(Boolean);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedSrc = allImages[selectedIdx] ?? mainImageUrl;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <LuxuryCard className="overflow-hidden">
        <img
          src={selectedSrc || "/assets/uploads/product-jpeg-500x500-1.jpg"}
          alt={title}
          className="w-full aspect-[4/5] object-cover transition-opacity duration-200"
        />
      </LuxuryCard>

      {/* Thumbnails — only if more than 1 */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {allImages.map((src, idx) => (
            <button
              key={src || String(idx)}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                idx === selectedIdx
                  ? "border-primary shadow-md scale-105"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
              aria-label={`Image ${idx + 1}`}
            >
              <img
                src={src}
                alt={`${title} view ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ListingDetailPage() {
  const { id } = useParams({ from: "/listings/$id" });
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { getListing } = useCatalog();
  const { addItem } = useCart();
  const { tailors } = useTailors();
  const { products: backendProducts } = useBackendProducts();

  // Try catalog first, then backend products
  const catalogListing = getListing(id);
  const backendProduct = !catalogListing
    ? backendProducts.find((p) => p.id === id)
    : undefined;

  // Build a unified listing from whichever source we have
  const listing: ProductListing | null = catalogListing
    ? catalogListing
    : backendProduct
      ? {
          id: backendProduct.id,
          tailorId: "fit-also-admin",
          tailorName: "Fit Also Studio",
          tailorCity: "India",
          category: backendProduct.category as any,
          title: backendProduct.title,
          description: backendProduct.description,
          basePrice: backendProduct.price,
          originalPrice: backendProduct.originalPrice,
          discountPrice: backendProduct.discountPrice,
          estimatedDays: 14,
          availableNeckStyles: ["round", "vNeck", "mandarin"],
          availableSleeveStyles: ["full", "half", "sleeveless"],
          availableFabrics: ["cotton", "silk", "linen"],
          availableColors: ["ivory", "red", "navy"],
          availableWorkTypes: ["plain", "embroidery", "zari"],
          imageUrl: backendProduct.imageUrl,
          additionalImageUrls: backendProduct.additionalImageUrls,
          videoUrl: backendProduct.videoUrl,
          reviews: backendProduct.reviews,
          createdAt: Date.now(),
        }
      : null;

  const [customization, setCustomization] =
    useState<CustomizationOptions | null>(
      listing
        ? {
            neckStyle: (listing.availableNeckStyles[0] as any) ?? "round",
            sleeveStyle: (listing.availableSleeveStyles[0] as any) ?? "full",
            fabricType: (listing.availableFabrics[0] as any) ?? "cotton",
            colorPattern: (listing.availableColors[0] as any) ?? "ivory",
            workType: (listing.availableWorkTypes[0] as any) ?? "plain",
          }
        : null,
    );

  if (!listing || !customization) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Listing not found.</p>
        <LuxuryButton
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => navigate({ to: "/catalog" })}
        >
          {t("common.back")} to Catalog
        </LuxuryButton>
      </div>
    );
  }

  const tailor = tailors.find((t) => t.id === listing.tailorId);
  const { selling, mrp } = getDisplayPrice(listing);
  const reviews = listing.reviews ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const handleAddToCart = () => {
    addItem(listing, customization);
    toast.success(language === "hi" ? "कार्ट में जोड़ा गया!" : "Added to cart!", {
      description: listing.title,
    });
  };

  const handleBuyNow = () => {
    const item = { listing, customization };
    try {
      sessionStorage.setItem("buyNowItem", JSON.stringify(item));
    } catch {}
    navigate({ to: "/checkout", search: { mode: "buynow" } as any });
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in pb-36 lg:pb-10">
      <Toaster />
      <button
        type="button"
        onClick={() => navigate({ to: "/catalog" })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("common.back")} to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="space-y-4">
          <ImageGallery
            mainImageUrl={
              listing.imageUrl || "/assets/uploads/product-jpeg-500x500-1.jpg"
            }
            additionalUrls={listing.additionalImageUrls}
            title={listing.title}
          />

          {/* Video */}
          {listing.videoUrl && (
            <LuxuryCard className="p-4">
              <h2 className="font-serif text-base font-semibold mb-3">
                {language === "hi" ? "उत्पाद वीडियो" : "Product Video"}
              </h2>
              <VideoEmbed url={listing.videoUrl} />
            </LuxuryCard>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {listing.category}
            </span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3 mb-2">
              {listing.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {listing.description}
            </p>

            {/* Avg Rating */}
            {reviews.length > 0 && (
              <div className="mt-2">
                <StarDisplay rating={avgRating} count={reviews.length} />
              </div>
            )}
          </div>

          {/* Price & Delivery */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-muted-foreground">
                {t("listing.basePrice")}
              </p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="font-serif text-3xl font-bold text-green-500 dark:text-green-400">
                  ₹{selling.toLocaleString("en-IN")}
                </p>
                {mrp && mrp !== selling && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{mrp.toLocaleString("en-IN")}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold">
                      {discountPct(selling, mrp)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <div>
                <p className="text-xs">{t("listing.estimatedDelivery")}</p>
                <p className="font-medium text-foreground">
                  {listing.estimatedDays} {t("common.days")}
                </p>
              </div>
            </div>
          </div>

          {/* Customization */}
          <LuxuryCard className="p-5">
            <h2 className="font-serif text-lg font-semibold mb-4">
              {t("listing.customize")}
            </h2>
            <CustomizationSelector
              listing={listing as any}
              value={customization}
              onChange={setCustomization}
            />
          </LuxuryCard>

          {/* Action Buttons — hidden on mobile (shown in sticky bar below) */}
          <div className="hidden lg:flex flex-col gap-2">
            <LuxuryButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {t("listing.addToCart")}
            </LuxuryButton>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3 px-6 rounded-xl bg-secondary text-secondary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              <Zap className="h-5 w-5" />
              {language === "hi" ? "अभी खरीदें" : "Buy It Now"}
            </button>
          </div>

          {/* Tailor Info */}
          {tailor && (
            <LuxuryCard className="p-5">
              <h2 className="font-serif text-lg font-semibold mb-4">
                {t("listing.tailorProfile")}
              </h2>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Scissors className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {tailor.shopName}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {tailor.city}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {tailor.bio}
                  </p>
                  <LuxuryButton
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() =>
                      navigate({
                        to: "/tailors/$id",
                        params: { id: tailor.id },
                      })
                    }
                  >
                    {t("tailor.viewProfile")}
                  </LuxuryButton>
                </div>
              </div>
            </LuxuryCard>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <LuxuryCard className="p-6">
          <h2 className="font-serif text-xl font-bold text-foreground mb-1">
            {language === "hi" ? "ग्राहक समीक्षाएँ" : "Customer Reviews"}
          </h2>
          {reviews.length > 0 && (
            <div className="mb-4">
              <StarDisplay rating={avgRating} count={reviews.length} />
            </div>
          )}

          {reviews.length === 0 ? (
            <div data-ocid="reviews.empty_state" className="py-8 text-center">
              <Star className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                {language === "hi"
                  ? "अभी तक कोई समीक्षा नहीं।"
                  : "No reviews yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {reviews.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  data-ocid={`reviews.item.${i + 1}`}
                />
              ))}
            </div>
          )}
        </LuxuryCard>
      </div>

      {/* Sticky bottom action bar — mobile only, sits ABOVE bottom nav (z-50 nav, z-[55] buttons) */}
      <div
        className="fixed left-0 right-0 z-[55] md:hidden bg-background border-t border-border px-4 py-3 flex gap-3 shadow-xl"
        style={{ bottom: "calc(56px + env(safe-area-inset-bottom, 0px))" }}
      >
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-4 rounded-xl border-2 border-primary text-primary font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 active:scale-95 transition-all text-sm"
        >
          <ShoppingBag className="h-4 w-4" />
          {t("listing.addToCart")}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all text-sm"
        >
          <Zap className="h-4 w-4" />
          {language === "hi" ? "अभी खरीदें" : "Buy Now"}
        </button>
      </div>
    </div>
  );
}

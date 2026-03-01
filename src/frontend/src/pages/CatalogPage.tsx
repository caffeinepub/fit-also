import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Clock, MapPin, Search } from "lucide-react";
import React, { useState } from "react";
import { LuxuryButton } from "../components/LuxuryButton";
import { LuxuryCard } from "../components/LuxuryCard";
import { useCatalog } from "../hooks/useCatalog";
import { useLanguage } from "../hooks/useLanguage";
import type { GarmentCategory } from "../types/catalog";

const CATEGORIES: GarmentCategory[] = [
  "Shirts",
  "Kurtas",
  "Suits",
  "Sherwanis",
  "Trousers",
  "Lehengas",
  "Saree Blouses",
  "Anarkalis",
];

const CAT_KEYS: Record<GarmentCategory, string> = {
  Shirts: "cat.shirts",
  Kurtas: "cat.kurtas",
  Suits: "cat.suits",
  Sherwanis: "cat.sherwanis",
  Trousers: "cat.trousers",
  Lehengas: "cat.lehengas",
  "Saree Blouses": "cat.sareeBlouses",
  Anarkalis: "cat.anarkalis",
};

export function CatalogPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { filterListings } = useCatalog();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GarmentCategory | "">(
    "",
  );

  const listings = filterListings(activeCategory, search);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-accent font-medium text-sm tracking-widest uppercase mb-1">
          Explore
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          {t("catalog.title")}
        </h1>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("catalog.search")}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setActiveCategory("")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            activeCategory === ""
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {t("catalog.allCategories")}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {t(CAT_KEYS[cat] as any)}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">{t("catalog.noResults")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <LuxuryCard
              key={listing.id}
              hover
              onClick={() =>
                navigate({ to: "/listings/$id", params: { id: listing.id } })
              }
              className="overflow-hidden group"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="/assets/generated/garment-placeholder.dim_400x500.png"
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground border border-border">
                    {listing.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif font-semibold text-foreground mb-1 line-clamp-1">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {t("catalog.by")} {listing.tailorName}, {listing.tailorCity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {t("listing.basePrice")}
                    </span>
                    <div className="font-bold text-primary font-serif">
                      ₹{listing.basePrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {listing.estimatedDays} {t("common.days")}
                    </span>
                  </div>
                </div>
              </div>
            </LuxuryCard>
          ))}
        </div>
      )}
    </div>
  );
}

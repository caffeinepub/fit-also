import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Clock, MapPin, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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

// ─── Mock product data for when backend returns empty ──────────────────────────

const CATALOG_MOCK_PRODUCTS = [
  {
    id: "c1",
    name: "Silk Anarkali",
    nameHi: "सिल्क अनारकली",
    price: 2499,
    category: "Anarkalis",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=400&fit=crop",
  },
  {
    id: "c2",
    name: "Banarasi Saree Blouse",
    nameHi: "बनारसी ब्लाउज",
    price: 1800,
    category: "Saree Blouses",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop",
  },
  {
    id: "c3",
    name: "Wedding Sherwani",
    nameHi: "वेडिंग शेरवानी",
    price: 4500,
    category: "Sherwanis",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=400&fit=crop",
  },
  {
    id: "c4",
    name: "Bridal Lehenga",
    nameHi: "ब्राइडल लहंगा",
    price: 5500,
    category: "Lehengas",
    image:
      "https://images.unsplash.com/photo-1596900779744-2489d0eedf30?w=300&h=400&fit=crop",
  },
  {
    id: "c5",
    name: "Festive Kurta Set",
    nameHi: "फेस्टिव कुर्ता सेट",
    price: 1299,
    category: "Kurtas",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=300&h=400&fit=crop",
  },
  {
    id: "c6",
    name: "Embroidered Kurti",
    nameHi: "कढ़ाई कुर्ती",
    price: 1599,
    category: "Kurtas",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=300&h=400&fit=crop",
  },
  {
    id: "c7",
    name: "Jodhpuri Bandhgala",
    nameHi: "जोधपुरी बंधगला",
    price: 3800,
    category: "Sherwanis",
    image:
      "https://images.unsplash.com/photo-1570976447640-ac859083963f?w=300&h=400&fit=crop",
  },
  {
    id: "c8",
    name: "Chikankari Kurti",
    nameHi: "चिकनकारी कुर्ती",
    price: 1450,
    category: "Kurtas",
    image:
      "https://images.unsplash.com/photo-1583482183021-bd3f0977b5e5?w=300&h=400&fit=crop",
  },
  {
    id: "c9",
    name: "Velvet Lehenga Choli",
    nameHi: "वेलवेट लहंगा चोली",
    price: 4200,
    category: "Lehengas",
    image:
      "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=300&h=400&fit=crop",
  },
  {
    id: "c10",
    name: "Linen Blazer Suit",
    nameHi: "लिनन सूट",
    price: 3400,
    category: "Suits",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=400&fit=crop",
  },
  {
    id: "c11",
    name: "Mirror Work Anarkali",
    nameHi: "मिरर वर्क अनारकली",
    price: 2750,
    category: "Anarkalis",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=400&fit=crop",
  },
  {
    id: "c12",
    name: "Cotton Salwar Suit",
    nameHi: "कॉटन सलवार सूट",
    price: 1100,
    category: "Suits",
    image:
      "https://images.unsplash.com/photo-1588701023429-9e8b657cf7c8?w=300&h=400&fit=crop",
  },
  {
    id: "c13",
    name: "Flared Anarkali Gown",
    nameHi: "फ्लेयर्ड अनारकली गाउन",
    price: 3100,
    category: "Anarkalis",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=400&fit=crop",
  },
  {
    id: "c14",
    name: "Pathani Kurta Set",
    nameHi: "पठानी कुर्ता सेट",
    price: 1750,
    category: "Kurtas",
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=300&h=400&fit=crop",
  },
  {
    id: "c15",
    name: "Party Wear Saree Blouse",
    nameHi: "पार्टी वेयर साड़ी ब्लाउज",
    price: 1950,
    category: "Saree Blouses",
    image:
      "https://images.unsplash.com/photo-1617727553252-65863c156eb9?w=300&h=400&fit=crop",
  },
  {
    id: "c16",
    name: "Heavy Lehenga Choli",
    nameHi: "हेवी लहंगा चोली",
    price: 5500,
    category: "Lehengas",
    image:
      "https://images.unsplash.com/photo-1596900779744-2489d0eedf30?w=300&h=400&fit=crop",
  },
  {
    id: "c17",
    name: "Banarasi Blouse",
    nameHi: "बनारसी ब्लाउज",
    price: 2200,
    category: "Saree Blouses",
    image:
      "https://images.unsplash.com/photo-1593173886081-ecab7d0cf6a5?w=300&h=400&fit=crop",
  },
  {
    id: "c18",
    name: "Velvet Lehenga",
    nameHi: "वेलवेट लहंगा",
    price: 4200,
    category: "Lehengas",
    image:
      "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=300&h=400&fit=crop",
  },
  {
    id: "c19",
    name: "Mens Suit",
    nameHi: "मेन्स सूट",
    price: 4500,
    category: "Suits",
    image:
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=300&h=400&fit=crop",
  },
  {
    id: "c20",
    name: "Festive Anarkali",
    nameHi: "फेस्टिव अनारकली",
    price: 2900,
    category: "Anarkalis",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=400&fit=crop",
  },
];

export function CatalogPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { filterListings } = useCatalog();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GarmentCategory | "">(
    "",
  );
  const [visibleCount, setVisibleCount] = useState(12);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const listings = filterListings(activeCategory, search);

  // Infinite scroll — load 8 more when sentinel is visible
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 8);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Build displayListings — cycle infinitely through real or mock data
  const displayListings =
    listings.length > 0
      ? Array.from({ length: visibleCount }, (_, i) => {
          const base = listings[i % listings.length];
          return { ...base, _key: `${base.id}-${i}` };
        })
      : Array.from({ length: visibleCount }, (_, i) => {
          const mock = CATALOG_MOCK_PRODUCTS[i % CATALOG_MOCK_PRODUCTS.length];
          return {
            _key: `${mock.id}-${i}`,
            id: `${mock.id}-${i}`,
            tailorId: "demo-tailor",
            tailorName: "Fit Also Studio",
            tailorCity: "Mumbai",
            category: mock.category,
            title: language === "hi" ? mock.nameHi : mock.name,
            description: mock.nameHi,
            basePrice: mock.price,
            estimatedDays: 14,
            availableNeckStyles: [] as string[],
            availableSleeveStyles: [] as string[],
            availableFabrics: [] as string[],
            availableColors: [] as string[],
            availableWorkTypes: [] as string[],
            imageUrl: mock.image,
            createdAt: Date.now(),
          };
        });

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
            data-ocid="catalog.search_input"
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
          data-ocid="catalog.all.tab"
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
            data-ocid={`catalog.${cat.toLowerCase().replace(/\s+/g, "-")}.tab`}
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

      {/* Listings Grid — always renders displayListings (never shows empty) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayListings.map((listing) => (
          <LuxuryCard
            key={listing._key}
            hover
            onClick={() => {
              // Navigate using the base ID (strip cycling suffix)
              const baseId = listing.id.replace(/-\d+$/, "");
              navigate({ to: "/listings/$id", params: { id: baseId } });
            }}
            className="overflow-hidden group"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={
                  listing.imageUrl ||
                  "/assets/generated/garment-placeholder.dim_400x500.png"
                }
                alt={listing.title}
                loading="lazy"
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

      {/* Infinite scroll sentinel — always present, never shows "end" */}
      <div ref={sentinelRef} className="h-4 mt-2" aria-hidden="true" />
    </div>
  );
}

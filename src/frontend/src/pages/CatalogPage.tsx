import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Clock, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBackendProducts } from "../hooks/useBackendProducts";
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

// ─── Mock product data — using uploaded product images ────────────────────────

const CATALOG_MOCK_PRODUCTS = [
  {
    id: "c1",
    name: "Holi Special Kurta",
    nameHi: "होली स्पेशल कुर्ता",
    price: 1299,
    category: "Kurtas",
    image: "/assets/uploads/product-jpeg-500x500-1.jpg",
  },
  {
    id: "c2",
    name: "White Floral Anarkali Gown",
    nameHi: "सफेद फ्लोरल अनारकली गाउन",
    price: 3200,
    category: "Anarkalis",
    image: "/assets/uploads/DSC3612_480x480-2.jpg",
  },
  {
    id: "c3",
    name: "Tulip Print Kurti Set",
    nameHi: "ट्यूलिप प्रिंट कुर्ती सेट",
    price: 1699,
    category: "Kurtas",
    image: "/assets/uploads/BHKS411_5_480x480-3.jpg",
  },
  {
    id: "c4",
    name: "Yellow Embroidered Suit",
    nameHi: "पीली कढ़ाई वाली सूट",
    price: 2899,
    category: "Suits",
    image: "/assets/uploads/04-11-22-255_1-e1677751648409-1--4.png",
  },
  {
    id: "c5",
    name: "Cream Embroidered Salwar Set",
    nameHi: "क्रीम कढ़ाई सलवार सेट",
    price: 2499,
    category: "Suits",
    image: "/assets/uploads/Thumb-33-5.png",
  },
  {
    id: "c6",
    name: "Magenta Blazer Pant Set",
    nameHi: "मैजेंटा ब्लेज़र पैंट सेट",
    price: 3800,
    category: "Suits",
    image: "/assets/uploads/IMG-20240831-WA0271-6.jpg",
  },
  {
    id: "c7",
    name: "White Kurta with Rainbow Dupatta",
    nameHi: "सफेद कुर्ता रेनबो दुपट्टे के साथ",
    price: 1899,
    category: "Kurtas",
    image: "/assets/uploads/7373499a44f590596c58bde0def45fee-7.jpg",
  },
  {
    id: "c8",
    name: "Yellow Chikankari Suit",
    nameHi: "पीली चिकनकारी सूट",
    price: 2800,
    category: "Suits",
    image: "/assets/uploads/04-11-22-255_1-e1677751648409-8.png",
  },
  {
    id: "c9",
    name: "Holi White Outfit",
    nameHi: "होली व्हाइट आउटफिट",
    price: 1599,
    category: "Kurtas",
    image:
      "/assets/uploads/white-holi-outfit-ideas-bewakoof-blog-6-1616348772-9.jpg",
  },
  {
    id: "c10",
    name: "Beige Floral Straight Kurta",
    nameHi: "बेज फ्लोरल स्ट्रेट कुर्ता",
    price: 2200,
    category: "Kurtas",
    image: "/assets/uploads/1_279_483-10.jpg",
  },
  {
    id: "c11",
    name: "Floral Anarkali Set",
    nameHi: "फ्लोरल अनारकली सेट",
    price: 2499,
    category: "Anarkalis",
    image: "/assets/uploads/IMG-20240831-WA0271-1-11.jpg",
  },
  {
    id: "c12",
    name: "Designer Formal Shirt",
    nameHi: "डिज़ाइनर फॉर्मल शर्ट",
    price: 1800,
    category: "Shirts",
    image: "/assets/uploads/w66_2048x-12.jpg",
  },
  {
    id: "c13",
    name: "White Floral Anarkali",
    nameHi: "व्हाइट फ्लोरल अनारकली",
    price: 2999,
    category: "Anarkalis",
    image: "/assets/uploads/thumb1-2-1--13.png",
  },
  {
    id: "c14",
    name: "Floral Straight Suit",
    nameHi: "फ्लोरल स्ट्रेट सूट",
    price: 2100,
    category: "Suits",
    image: "/assets/uploads/pht0080.1-e1676355837849-14.png",
  },
  {
    id: "c15",
    name: "White Anarkali with Dupatta",
    nameHi: "सफेद अनारकली दुपट्टे के साथ",
    price: 2400,
    category: "Anarkalis",
    image: "/assets/uploads/thumb1-2-16.png",
  },
  {
    id: "c16",
    name: "Floral Embroidered Anarkali",
    nameHi: "फ्लोरल कढ़ाई अनारकली",
    price: 3100,
    category: "Anarkalis",
    image: "/assets/uploads/60-18.png",
  },
  {
    id: "c17",
    name: "Designer Mens Sherwani",
    nameHi: "डिज़ाइनर मेन्स शेरवानी",
    price: 4200,
    category: "Sherwanis",
    image:
      "/assets/uploads/Summer-African-Men-s-Traditional-Elegant-Suits-Outfit-Dashiki-2pcs-Shirt-Pants-Full-Set-Designer-Clothes-3-off-17.jpg",
  },
  {
    id: "c18",
    name: "Bridal Lehenga Choli",
    nameHi: "ब्राइडल लहंगा चोली",
    price: 5500,
    category: "Lehengas",
    image: "/assets/uploads/DSC3612_480x480-2.jpg",
  },
  {
    id: "c19",
    name: "Banarasi Saree Blouse",
    nameHi: "बनारसी साड़ी ब्लाउज",
    price: 1800,
    category: "Saree Blouses",
    image: "/assets/uploads/BHKS411_5_480x480-3.jpg",
  },
  {
    id: "c20",
    name: "Festive Anarkali Gown",
    nameHi: "फेस्टिव अनारकली गाउन",
    price: 2900,
    category: "Anarkalis",
    image: "/assets/uploads/IMG-20240831-WA0271-6.jpg",
  },
  {
    id: "c21",
    name: "Black 3-Piece Men's Suit",
    nameHi: "ब्लैक 3-पीस मेन्स सूट",
    price: 6500,
    category: "Suits",
    image: "/assets/uploads/64ba00a676ac56d55c9eb0e00753d34d-1.jpg",
  },
  {
    id: "c22",
    name: "Brown Casual Shirt + White Pant Combo",
    nameHi: "ब्राउन कैजुअल शर्ट + व्हाइट पैंट कॉम्बो",
    price: 2200,
    category: "Shirts",
    image: "/assets/uploads/b1a61a0c6ba53cf3b7bdbfff49f9a366-2.jpg",
  },
  {
    id: "c23",
    name: "Grey Striped Mandarin Kurta Set",
    nameHi: "ग्रे स्ट्राइप्ड मंदारिन कुर्ता सेट",
    price: 2400,
    category: "Kurtas",
    image: "/assets/uploads/94ebd87a4d9ea257781f1b60ec0480cc-3.jpg",
  },
  {
    id: "c24",
    name: "Yellow Indo-Western Sherwani",
    nameHi: "येलो इंडो-वेस्टर्न शेरवानी",
    price: 7800,
    category: "Sherwanis",
    image: "/assets/uploads/e117de0a390bbfa6d30a1b3f105954e9-4.jpg",
  },
  {
    id: "c25",
    name: "Pink Ombre Crop Top + Palazzo Set",
    nameHi: "पिंक ओम्ब्रे क्रॉप टॉप + पलाज़ो सेट",
    price: 3200,
    category: "Lehengas",
    image: "/assets/uploads/c9ff3c69bdbd9915f730b97843ca99f3-5.jpg",
  },
  {
    id: "c26",
    name: "Sage Green Jacket + White Tee Outfit",
    nameHi: "सेज ग्रीन जैकेट + व्हाइट टी आउटफिट",
    price: 2800,
    category: "Suits",
    image: "/assets/uploads/7d92562c11c102068baf82a60bc892e8-6.jpg",
  },
  {
    id: "c27",
    name: "Holi Color Splash Kaftan Top",
    nameHi: "होली कलर स्प्लैश काफ्तान टॉप",
    price: 1800,
    category: "Kurtas",
    image: "/assets/uploads/763b50815ee566fd6bfed3a6db4a4a92-7.jpg",
  },
  {
    id: "c28",
    name: "Blue Floral Embroidered Blazer Set",
    nameHi: "ब्लू फ्लोरल एम्ब्रॉयडर्ड ब्लेज़र सेट",
    price: 5200,
    category: "Suits",
    image: "/assets/uploads/5638a25b21c90f9d84ee7d15db1c432b-8.jpg",
  },
  {
    id: "c29",
    name: "Yellow Studded Denim Jacket",
    nameHi: "येलो स्टडेड डेनिम जैकेट",
    price: 1900,
    category: "Shirts",
    image: "/assets/uploads/07ad2bbe06e2c5c14514e9c731a0f5c9-9.jpg",
  },
  {
    id: "c30",
    name: "Silver Grey Sharara Set",
    nameHi: "सिल्वर ग्रे शरारा सेट",
    price: 4500,
    category: "Lehengas",
    image: "/assets/uploads/ac77432e9e6c46cd187682481a144dc8-10.jpg",
  },
  {
    id: "c31",
    name: "Pink Floral Halter Layered Palazzo",
    nameHi: "पिंक फ्लोरल हल्टर लेयर्ड पलाज़ो",
    price: 3800,
    category: "Lehengas",
    image: "/assets/uploads/9403db08bab44aa249b44bdb47866d70-11.jpg",
  },
  {
    id: "c32",
    name: "Navy Blue Printed Co-ord Set",
    nameHi: "नेवी ब्लू प्रिंटेड को-ऑर्ड सेट",
    price: 2900,
    category: "Suits",
    image: "/assets/uploads/16081b46bdd43d74dd6f6ca4b26afc96-12.jpg",
  },
  {
    id: "c33",
    name: "Yellow Embroidered Peplum + Palazzo",
    nameHi: "येलो एम्ब्रॉयडर्ड पेप्लम + पलाज़ो",
    price: 4200,
    category: "Lehengas",
    image: "/assets/uploads/1a8d07aec4c17aaafa7c08ff960176da-13.jpg",
  },
  {
    id: "c34",
    name: "Dark Green Embroidered Lehenga",
    nameHi: "डार्क ग्रीन एम्ब्रॉयडर्ड लहंगा",
    price: 6800,
    category: "Lehengas",
    image: "/assets/uploads/e808261334479a389e09d4da68d43d3a-14.jpg",
  },
  {
    id: "c35",
    name: "Red Gold Brocade Palazzo Suit",
    nameHi: "रेड गोल्ड ब्रोकेड पलाज़ो सूट",
    price: 5500,
    category: "Lehengas",
    image: "/assets/uploads/4cc2fafdd5cedb0ea060bbd9d91c67d2-15.jpg",
  },
  {
    id: "c36",
    name: "Multi-color Patched Palazzo Set",
    nameHi: "मल्टी-कलर पैच्ड पलाज़ो सेट",
    price: 3400,
    category: "Lehengas",
    image: "/assets/uploads/fd2af3d86fba2c2c88436469abe186fa-16.jpg",
  },
  {
    id: "c37",
    name: "Rust Orange Draped Saree-Style Set",
    nameHi: "रस्ट ऑरेंज ड्रेप्ड साड़ी-स्टाइल सेट",
    price: 4800,
    category: "Saree Blouses",
    image: "/assets/uploads/d3b7b1859552b88ede66c590078e4f9a-17.jpg",
  },
  {
    id: "c38",
    name: "Multi-color Rajasthani Lehenga",
    nameHi: "मल्टी-कलर राजस्थानी लहंगा",
    price: 7500,
    category: "Lehengas",
    image: "/assets/uploads/ce34ebc3b215a426ae5172e5529515a4-18.jpg",
  },
  {
    id: "c39",
    name: "Multi-color Patchwork Crop + Palazzo",
    nameHi: "मल्टी-कलर पैचवर्क क्रॉप + पलाज़ो",
    price: 3200,
    category: "Lehengas",
    image: "/assets/uploads/de7b802e56f7e8df72227edf2df37a68-19.jpg",
  },
  {
    id: "c40",
    name: "Green Embroidered Bridal Blouse",
    nameHi: "ग्रीन एम्ब्रॉयडर्ड ब्राइडल ब्लाउज",
    price: 2800,
    category: "Saree Blouses",
    image: "/assets/uploads/d7dbbb6f86417a410eaa5eb16166d09b-20.jpg",
  },
  {
    id: "c41",
    name: "Dark Green Floral Lehenga",
    nameHi: "डार्क ग्रीन फ्लोरल लहंगा",
    price: 8200,
    category: "Lehengas",
    image: "/assets/uploads/d42922b85ff0bf7cc8c1d415b105f493-21.jpg",
  },
  {
    id: "c42",
    name: "Multi-color Striped Lehenga Set",
    nameHi: "मल्टी-कलर स्ट्राइप्ड लहंगा सेट",
    price: 4200,
    category: "Lehengas",
    image: "/assets/uploads/245361151e2e85b0dd9a4e9960f6c98b-22.jpg",
  },
  {
    id: "c43",
    name: "Embroidered Patchwork Palazzo Co-ord",
    nameHi: "एम्ब्रॉयडर्ड पैचवर्क पलाज़ो को-ऑर्ड",
    price: 3600,
    category: "Lehengas",
    image: "/assets/uploads/21b73b58970133f307d57bc510b15cbc-23.jpg",
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

  const { products: backendProducts } = useBackendProducts();

  const listings = filterListings(activeCategory, search);

  const displayListingsSource =
    backendProducts.length > 0
      ? backendProducts
          .filter(
            (p) =>
              (!activeCategory || p.category === activeCategory) &&
              (!search ||
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())),
          )
          .map((p) => ({
            id: p.id,
            tailorId: "fit-also-admin",
            tailorName: "Fit Also Studio",
            tailorCity: "India",
            category: p.category as GarmentCategory,
            title: p.title,
            description: p.description,
            basePrice: p.discountPrice ?? p.originalPrice ?? p.price,
            originalPrice: p.discountPrice
              ? (p.originalPrice ?? Math.round(p.price * 1.3))
              : Math.round(p.price * 1.3),
            estimatedDays: 14,
            availableNeckStyles: [] as string[],
            availableSleeveStyles: [] as string[],
            availableFabrics: [] as string[],
            availableColors: [] as string[],
            availableWorkTypes: [] as string[],
            imageUrl:
              p.imageUrl || "/assets/uploads/product-jpeg-500x500-1.jpg",
            createdAt: Date.now(),
          }))
      : listings;

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
    displayListingsSource.length > 0
      ? Array.from({ length: visibleCount }, (_, i) => {
          const base = displayListingsSource[i % displayListingsSource.length];
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
            originalPrice: Math.round(mock.price * 1.3),
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
    <div className="bg-background min-h-screen animate-fade-in pb-4">
      {/* Sticky search bar */}
      <div className="sticky top-0 z-30 bg-background border-b border-border px-3 py-2.5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="catalog.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === "hi" ? "कपड़ा खोजें..." : "Search outfits..."
            }
            className="pl-9 h-9 text-sm rounded-full bg-muted border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Category chips — horizontally scrollable */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none px-3 py-2.5 border-b border-border">
        <button
          type="button"
          data-ocid="catalog.all.tab"
          onClick={() => setActiveCategory("")}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
            activeCategory === ""
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {language === "hi" ? "सभी" : "All"}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            data-ocid={`catalog.${cat.toLowerCase().replace(/\s+/g, "-")}.tab`}
            onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {t(CAT_KEYS[cat] as any)}
          </button>
        ))}
      </div>

      {/* Listings Grid — image-first, 2-col mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 px-2.5 pt-3">
        {displayListings.map((listing) => (
          <button
            key={listing._key}
            type="button"
            data-ocid="catalog.product.card"
            onClick={() => {
              const baseId = listing.id.replace(/-\d+$/, "");
              navigate({ to: "/listings/$id", params: { id: baseId } });
            }}
            className="bg-card rounded-xl overflow-hidden text-left group shadow-sm hover:shadow-md transition-shadow active:scale-95"
          >
            {/* Product image — always visible */}
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <img
                src={
                  listing.imageUrl ||
                  "/assets/uploads/product-jpeg-500x500-1.jpg"
                }
                alt={listing.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-1.5 left-1.5">
                <span className="px-1.5 py-0.5 rounded-sm bg-black/60 backdrop-blur-sm text-[9px] font-semibold text-white">
                  {listing.category}
                </span>
              </div>
            </div>
            {/* Info */}
            <div className="p-2">
              <p className="text-xs font-semibold text-foreground truncate leading-tight">
                {listing.title}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                <span className="text-[10px] text-muted-foreground truncate">
                  {listing.tailorCity}
                </span>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-sm font-bold text-foreground">
                    ₹{listing.basePrice.toLocaleString()}
                  </span>
                  {(listing as any).originalPrice &&
                    (listing as any).originalPrice !== listing.basePrice && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        ₹{(listing as any).originalPrice.toLocaleString()}
                      </span>
                    )}
                  {(listing as any).originalPrice &&
                    (listing as any).originalPrice !== listing.basePrice && (
                      <span className="text-[9px] font-bold text-green-600 dark:text-green-400">
                        {Math.round(
                          (((listing as any).originalPrice -
                            listing.basePrice) /
                            (listing as any).originalPrice) *
                            100,
                        )}
                        % OFF
                      </span>
                    )}
                </div>
                <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground mt-0.5">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{listing.estimatedDays}d</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4 mt-2" aria-hidden="true" />
    </div>
  );
}

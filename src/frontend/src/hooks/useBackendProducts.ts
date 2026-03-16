import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface BackendProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  imageUrl: string;
  additionalImageUrls: string[];
  videoUrl?: string;
  reviews: ProductReview[];
  isDeleted: boolean;
}

export function useBackendProducts() {
  const { actor } = useActor();

  const { data, isLoading } = useQuery({
    queryKey: ["backendProducts"],
    queryFn: async () => {
      if (!actor) return [];
      const config = await actor.getPlatformConfig();
      if (!config) return [];
      return config.products
        .filter((p) => !p.isDeleted)
        .map((p) => {
          const raw = p as any;
          let imageUrl = "";
          try {
            imageUrl = p.image ? ((p.image as any).getDirectURL?.() ?? "") : "";
          } catch {}

          // Map additional images (ExternalBlob[])
          const additionalImageUrls: string[] = [];
          try {
            const addImgs = raw.additionalImages as any[] | undefined;
            if (Array.isArray(addImgs)) {
              for (const img of addImgs) {
                try {
                  const url = img?.getDirectURL?.() ?? "";
                  if (url) additionalImageUrls.push(url);
                } catch {}
              }
            }
          } catch {}

          // Motoko optional: [] | [number]
          const originalPrice: number | undefined =
            Array.isArray(raw.originalPrice) && raw.originalPrice.length > 0
              ? raw.originalPrice[0]
              : raw.originalPrice != null && !Array.isArray(raw.originalPrice)
                ? raw.originalPrice
                : undefined;

          const discountPrice: number | undefined =
            Array.isArray(raw.discountPrice) && raw.discountPrice.length > 0
              ? raw.discountPrice[0]
              : raw.discountPrice != null && !Array.isArray(raw.discountPrice)
                ? raw.discountPrice
                : undefined;

          const videoUrl: string | undefined =
            Array.isArray(raw.videoUrl) && raw.videoUrl.length > 0
              ? raw.videoUrl[0]
              : typeof raw.videoUrl === "string" && raw.videoUrl
                ? raw.videoUrl
                : undefined;

          // Reviews
          const reviews: ProductReview[] = [];
          try {
            const rawReviews = raw.reviews as any[] | undefined;
            if (Array.isArray(rawReviews)) {
              for (const r of rawReviews) {
                if (r?.id) {
                  reviews.push({
                    id: String(r.id),
                    userName: String(r.userName ?? "Anonymous"),
                    rating: Number(r.rating ?? 5),
                    comment: String(r.comment ?? ""),
                    createdAt:
                      typeof r.createdAt === "bigint"
                        ? Number(r.createdAt)
                        : Number(r.createdAt ?? Date.now()),
                  });
                }
              }
            }
          } catch {}

          return {
            id: p.id,
            title: p.title,
            category: p.category,
            description: (p as any).description ?? "",
            price: p.price,
            originalPrice,
            discountPrice,
            imageUrl,
            additionalImageUrls,
            videoUrl,
            reviews,
            isDeleted: p.isDeleted,
          };
        });
    },
    enabled: !!actor,
    staleTime: 10000,
    refetchInterval: 10000,
  });

  return { products: data ?? [], isLoading };
}

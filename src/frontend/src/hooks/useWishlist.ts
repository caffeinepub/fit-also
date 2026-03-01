import { useCallback, useState } from "react";

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
}

const WISHLIST_KEY = "fitAlsoWishlist";

function getStoredWishlist(): WishlistItem[] {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) return JSON.parse(stored) as WishlistItem[];
  } catch {}
  return [];
}

function saveWishlist(items: WishlistItem[]): void {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch {}
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] =
    useState<WishlistItem[]>(getStoredWishlist);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      const next = [...prev, item];
      saveWishlist(next);
      return next;
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlistItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveWishlist(next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (id: string) => {
      return wishlistItems.some((i) => i.id === id);
    },
    [wishlistItems],
  );

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      const next = exists
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item];
      saveWishlist(next);
      return next;
    });
  }, []);

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    toggleWishlist,
  };
}

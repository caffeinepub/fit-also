import { useState, useCallback, useEffect } from 'react';
import type { ProductListing, CustomizationOptions } from '../types/catalog';

export interface CartItem {
  id: string;
  listing: ProductListing;
  customization: CustomizationOptions;
  quantity: number;
}

const CART_KEY = 'fitAlso_cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = useCallback((listing: ProductListing, customization: CustomizationOptions) => {
    setItems(prev => {
      const existing = prev.find(i => i.listing.id === listing.id);
      if (existing) {
        return prev.map(i => i.listing.id === listing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: `${listing.id}-${Date.now()}`, listing, customization, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.listing.basePrice * i.quantity, 0);

  return { items, addItem, removeItem, clearCart, totalItems, totalPrice };
}

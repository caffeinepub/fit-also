import { useState, useCallback } from 'react';
import type { ProductListing, GarmentCategory } from '../types/catalog';
import { useInternetIdentity } from './useInternetIdentity';

const LISTINGS_KEY = 'fitAlso_listings';

const DEMO_LISTINGS: ProductListing[] = [
  {
    id: 'listing-1',
    tailorId: 'tailor-1',
    tailorName: 'Regal Threads',
    tailorCity: 'Mumbai',
    category: 'Sherwanis',
    title: 'Royal Sherwani with Zari Work',
    description: 'Exquisite sherwani crafted from premium brocade with intricate zari embroidery. Perfect for weddings and grand occasions.',
    basePrice: 8500,
    estimatedDays: 21,
    availableNeckStyles: ['mandarin', 'round'],
    availableSleeveStyles: ['full', 'threequarter'],
    availableFabrics: ['brocade', 'silk', 'velvet'],
    availableColors: ['gold', 'ivory', 'burgundy', 'navy'],
    availableWorkTypes: ['zari', 'embroidery', 'sequin'],
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'listing-2',
    tailorId: 'tailor-2',
    tailorName: 'Silk & Stitch',
    tailorCity: 'Delhi',
    category: 'Lehengas',
    title: 'Bridal Lehenga with Mirror Work',
    description: 'Stunning bridal lehenga with hand-crafted mirror work and delicate embroidery. A masterpiece for your special day.',
    basePrice: 12000,
    estimatedDays: 28,
    availableNeckStyles: ['sweetheart', 'square', 'round'],
    availableSleeveStyles: ['sleeveless', 'cap', 'half'],
    availableFabrics: ['silk', 'georgette', 'chiffon'],
    availableColors: ['red', 'blush', 'gold', 'ivory'],
    availableWorkTypes: ['mirror', 'embroidery', 'sequin', 'zari'],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'listing-3',
    tailorId: 'tailor-3',
    tailorName: 'The Fabric House',
    tailorCity: 'Jaipur',
    category: 'Suits',
    title: 'Premium Linen Business Suit',
    description: 'Tailored linen suit for the modern professional. Clean lines, perfect fit, timeless elegance.',
    basePrice: 4500,
    estimatedDays: 12,
    availableNeckStyles: ['round', 'vNeck'],
    availableSleeveStyles: ['full'],
    availableFabrics: ['linen', 'cotton'],
    availableColors: ['navy', 'black', 'ivory'],
    availableWorkTypes: ['plain'],
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: 'listing-4',
    tailorId: 'tailor-1',
    tailorName: 'Regal Threads',
    tailorCity: 'Mumbai',
    category: 'Kurtas',
    title: 'Festive Silk Kurta',
    description: 'Luxurious silk kurta with subtle embroidery at the collar and cuffs. Ideal for festive occasions.',
    basePrice: 2800,
    estimatedDays: 10,
    availableNeckStyles: ['mandarin', 'round', 'vNeck'],
    availableSleeveStyles: ['full', 'half', 'threequarter'],
    availableFabrics: ['silk', 'cotton', 'linen'],
    availableColors: ['ivory', 'gold', 'emerald', 'burgundy'],
    availableWorkTypes: ['embroidery', 'plain', 'block'],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'listing-5',
    tailorId: 'tailor-2',
    tailorName: 'Silk & Stitch',
    tailorCity: 'Delhi',
    category: 'Anarkalis',
    title: 'Georgette Anarkali with Embroidery',
    description: 'Flowing georgette anarkali with intricate thread embroidery. Graceful and elegant for any occasion.',
    basePrice: 5500,
    estimatedDays: 18,
    availableNeckStyles: ['round', 'vNeck', 'sweetheart'],
    availableSleeveStyles: ['full', 'half', 'cap', 'sleeveless'],
    availableFabrics: ['georgette', 'chiffon', 'silk'],
    availableColors: ['blush', 'ivory', 'emerald', 'burgundy'],
    availableWorkTypes: ['embroidery', 'sequin', 'plain'],
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'listing-6',
    tailorId: 'tailor-3',
    tailorName: 'The Fabric House',
    tailorCity: 'Jaipur',
    category: 'Shirts',
    title: 'Classic Cotton Oxford Shirt',
    description: 'Crisp cotton oxford shirt with a perfect collar and precise tailoring. A wardrobe essential.',
    basePrice: 1800,
    estimatedDays: 7,
    availableNeckStyles: ['round', 'mandarin'],
    availableSleeveStyles: ['full', 'half'],
    availableFabrics: ['cotton', 'linen'],
    availableColors: ['ivory', 'navy', 'black'],
    availableWorkTypes: ['plain', 'block'],
    createdAt: Date.now() - 86400000 * 4,
  },
];

function loadListings(): ProductListing[] {
  try {
    const raw = localStorage.getItem(LISTINGS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(DEMO_LISTINGS));
    return DEMO_LISTINGS;
  } catch { return DEMO_LISTINGS; }
}

export function useCatalog() {
  const { identity } = useInternetIdentity();
  const [listings, setListings] = useState<ProductListing[]>(loadListings);

  const saveListings = useCallback((updated: ProductListing[]) => {
    setListings(updated);
    try { localStorage.setItem(LISTINGS_KEY, JSON.stringify(updated)); } catch {}
  }, []);

  const getListing = useCallback((id: string): ProductListing | undefined => {
    return listings.find(l => l.id === id);
  }, [listings]);

  const getMyListings = useCallback((): ProductListing[] => {
    if (!identity) return [];
    // In a real app, match by tailor principal. Here we use tailorId from profile.
    return listings;
  }, [listings, identity]);

  const createListing = useCallback((listing: Omit<ProductListing, 'id' | 'createdAt'>) => {
    const newListing: ProductListing = {
      ...listing,
      id: `listing-${Date.now()}`,
      createdAt: Date.now(),
    };
    saveListings([...listings, newListing]);
    return newListing;
  }, [listings, saveListings]);

  const updateListing = useCallback((id: string, updates: Partial<ProductListing>) => {
    saveListings(listings.map(l => l.id === id ? { ...l, ...updates } : l));
  }, [listings, saveListings]);

  const deleteListing = useCallback((id: string) => {
    saveListings(listings.filter(l => l.id !== id));
  }, [listings, saveListings]);

  const filterListings = useCallback((category?: GarmentCategory | '', search?: string): ProductListing[] => {
    return listings.filter(l => {
      const matchCat = !category || l.category === category;
      const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.tailorName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [listings]);

  return { listings, getListing, getMyListings, createListing, updateListing, deleteListing, filterListings };
}

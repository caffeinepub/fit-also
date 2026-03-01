import { useCallback, useState } from "react";
import type { TailorProfile } from "../types/tailor";
import { useInternetIdentity } from "./useInternetIdentity";

const TAILORS_KEY = "fitAlso_tailors";

const DEMO_TAILORS: TailorProfile[] = [
  {
    id: "tailor-1",
    principalId: "demo-1",
    shopName: "Regal Threads",
    city: "Mumbai",
    specialties: ["Sherwanis", "Suits", "Kurtas"],
    bio: "Three generations of master tailoring. Specializing in luxury bridal and formal wear with over 30 years of experience.",
    portfolioUrls: ["/assets/generated/garment-placeholder.dim_400x500.png"],
    turnaroundDays: 14,
    basePricing: 3500,
    isApproved: true,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "tailor-2",
    principalId: "demo-2",
    shopName: "Silk & Stitch",
    city: "Delhi",
    specialties: ["Lehengas", "Anarkalis", "Saree Blouses"],
    bio: "Award-winning atelier known for intricate embroidery and premium silk work. Trusted by Bollywood celebrities.",
    portfolioUrls: ["/assets/generated/garment-placeholder.dim_400x500.png"],
    turnaroundDays: 21,
    basePricing: 5000,
    isApproved: true,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: "tailor-3",
    principalId: "demo-3",
    shopName: "The Fabric House",
    city: "Jaipur",
    specialties: ["Shirts", "Trousers", "Suits"],
    bio: "Contemporary menswear specialists with a focus on premium fabrics and modern silhouettes.",
    portfolioUrls: ["/assets/generated/garment-placeholder.dim_400x500.png"],
    turnaroundDays: 10,
    basePricing: 2000,
    isApproved: true,
    createdAt: Date.now() - 86400000 * 15,
  },
];

function loadTailors(): TailorProfile[] {
  try {
    const raw = localStorage.getItem(TAILORS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(TAILORS_KEY, JSON.stringify(DEMO_TAILORS));
    return DEMO_TAILORS;
  } catch {
    return DEMO_TAILORS;
  }
}

export function useTailors() {
  const { identity } = useInternetIdentity();
  const [tailors, setTailors] = useState<TailorProfile[]>(loadTailors);

  const saveTailors = useCallback((updated: TailorProfile[]) => {
    setTailors(updated);
    try {
      localStorage.setItem(TAILORS_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  const getMyTailorProfile = useCallback((): TailorProfile | null => {
    if (!identity) return null;
    const principalId = identity.getPrincipal().toString();
    return tailors.find((t) => t.principalId === principalId) ?? null;
  }, [tailors, identity]);

  const createTailorProfile = useCallback(
    (
      profile: Omit<
        TailorProfile,
        "id" | "principalId" | "createdAt" | "isApproved"
      >,
    ) => {
      if (!identity) throw new Error("Not authenticated");
      const principalId = identity.getPrincipal().toString();
      const newProfile: TailorProfile = {
        ...profile,
        id: `tailor-${Date.now()}`,
        principalId,
        isApproved: false,
        createdAt: Date.now(),
      };
      saveTailors([...tailors, newProfile]);
      return newProfile;
    },
    [tailors, identity, saveTailors],
  );

  const updateTailorProfile = useCallback(
    (id: string, updates: Partial<TailorProfile>) => {
      saveTailors(tailors.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    },
    [tailors, saveTailors],
  );

  const approvedTailors = tailors.filter((t) => t.isApproved);

  return {
    tailors,
    approvedTailors,
    getMyTailorProfile,
    createTailorProfile,
    updateTailorProfile,
  };
}

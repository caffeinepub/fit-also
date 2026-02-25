export interface TailorProfile {
  id: string;
  principalId: string;
  shopName: string;
  city: string;
  specialties: string[];
  bio: string;
  portfolioUrls: string[];
  turnaroundDays: number;
  basePricing: number;
  isApproved: boolean;
  createdAt: number;
}

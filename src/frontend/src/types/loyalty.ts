export interface LoyaltyTransaction {
  id: string;
  orderId: string;
  pointsEarned: number;
  description: string;
  createdAt: number;
}

export interface LoyaltyData {
  balance: number;
  transactions: LoyaltyTransaction[];
}

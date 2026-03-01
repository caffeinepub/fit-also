import type { CustomizationOptions } from "./catalog";
import type { MeasurementProfile } from "./measurements";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "inTailoring"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  customerId: string;
  tailorId: string;
  tailorName: string;
  listingId: string;
  listingTitle: string;
  category: string;
  customization: CustomizationOptions;
  measurementSnapshot: MeasurementProfile;
  price: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}

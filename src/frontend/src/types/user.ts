export type UserRole = "customer" | "tailor" | "admin";

export interface UserProfile {
  name: string;
  phone: string;
  city: string;
  preferredLanguage: "en" | "hi";
  role: UserRole;
}

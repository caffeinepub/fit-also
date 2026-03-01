export type GarmentCategory =
  | "Shirts"
  | "Kurtas"
  | "Suits"
  | "Sherwanis"
  | "Trousers"
  | "Lehengas"
  | "Saree Blouses"
  | "Anarkalis";

export type NeckStyle =
  | "round"
  | "vNeck"
  | "mandarin"
  | "boat"
  | "square"
  | "sweetheart";
export type SleeveStyle =
  | "full"
  | "half"
  | "sleeveless"
  | "threequarter"
  | "cap";
export type FabricType =
  | "cotton"
  | "silk"
  | "linen"
  | "chiffon"
  | "georgette"
  | "velvet"
  | "brocade"
  | "crepe";
export type ColorPattern =
  | "ivory"
  | "red"
  | "navy"
  | "emerald"
  | "gold"
  | "burgundy"
  | "blush"
  | "black";
export type WorkType =
  | "plain"
  | "embroidery"
  | "zari"
  | "sequin"
  | "mirror"
  | "block";

export interface CustomizationOptions {
  neckStyle: NeckStyle;
  sleeveStyle: SleeveStyle;
  fabricType: FabricType;
  colorPattern: ColorPattern;
  workType: WorkType;
}

export interface ProductListing {
  id: string;
  tailorId: string;
  tailorName: string;
  tailorCity: string;
  category: GarmentCategory;
  title: string;
  description: string;
  basePrice: number;
  estimatedDays: number;
  availableNeckStyles: NeckStyle[];
  availableSleeveStyles: SleeveStyle[];
  availableFabrics: FabricType[];
  availableColors: ColorPattern[];
  availableWorkTypes: WorkType[];
  imageUrl?: string;
  createdAt: number;
}

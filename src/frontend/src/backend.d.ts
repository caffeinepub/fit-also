import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: string;
    title: string;
    isDeleted: boolean;
    tailorId: string;
    customizationOptions: CustomizationOptions;
    description: string;
    category: string;
    image: ExternalBlob;
    price: number;
}
export interface CoinLedger {
    userId: string;
    timestamp: bigint;
    amount: bigint;
    reason: string;
}
export interface TailorProfile {
    id: string;
    bio: string;
    portfolioJson: string;
    turnaroundDays: bigint;
    ownerName: string;
    isPremium: boolean;
    city: string;
    contactEmail: string;
    shopName: string;
    specialties: string;
    basePricing: number;
    profileImageUrl: string;
    contactPhone: string;
}
export interface PlatformConfig {
    promotions: Array<Promotion>;
    fabrics: Array<Fabric>;
    banners: Array<ExternalBlob>;
    cities: Array<City>;
    colors: Array<Color>;
    products: Array<Product>;
    workTypes: Array<WorkType>;
}
export interface City {
    id: string;
    name: string;
}
export interface ColorScheme {
    accent: string;
    background: string;
    text: string;
    secondary: string;
    primary: string;
}
export interface Color {
    id: string;
    name: string;
    image?: ExternalBlob;
}
export interface MeasurementInput {
    value: number;
    name: string;
}
export interface DeliveryAddress {
    area: string;
    city: string;
    state: string;
    pinCode: string;
    houseNo: string;
}
export interface Promotion {
    id: string;
    title: string;
    active: boolean;
    discountValue: bigint;
    validFrom: bigint;
    discountType: {
        __kind__: "flat";
        flat: bigint;
    } | {
        __kind__: "percentage";
        percentage: bigint;
    };
    description: string;
    applicableCategories: Array<string>;
    validUntil: bigint;
}
export interface UserProfileV2 {
    measurementsJson: string;
    preferredLanguage: string;
    city: string;
    name: string;
    role: string;
    measurements: Array<Measurement>;
    phoneNumber: string;
}
export interface TextStyle {
    weight: FontWeight;
    font: string;
    color: string;
    size: bigint;
}
export interface ButtonStyle {
    borderRadius: bigint;
    background: string;
    text: TextStyle;
    padding: string;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface WorkType {
    id: string;
    name: string;
    image?: ExternalBlob;
}
export interface ExtendedOrder {
    id: string;
    customerName: string;
    status: string;
    measurementsJson: string;
    deliveryAddress: DeliveryAddress;
    isDeleted: boolean;
    tailorId: string;
    customerAltPhone: string;
    customerPhone: string;
    customerPrincipal: string;
    productImages: Array<string>;
    customizationJson: string;
    estimatedDeliveryDate: string;
    orderDate: bigint;
    orderHash: string;
    paymentMode: string;
    category: string;
    listingTitle: string;
    totalPrice: number;
    adminNotes: string;
}
export interface Measurement {
    value: number;
    name: string;
}
export interface Notification {
    id: string;
    title: string;
    body: string;
    targetAudience: Variant_all_tailors_customers;
    timestamp: bigint;
}
export interface CartItem {
    productTitle: string;
    selectedColor: string;
    customizationJson: string;
    productId: string;
    imageUrl: string;
    quantity: bigint;
    category: string;
    price: number;
    selectedSize: string;
}
export interface AppStyle {
    fonts: {
        body: TextStyle;
        heading: TextStyle;
    };
    backgroundImage?: ExternalBlob;
    colors: ColorScheme;
    buttons: {
        secondary: ButtonStyle;
        primary: ButtonStyle;
    };
}
export interface Fabric {
    id: string;
    name: string;
    image?: ExternalBlob;
}
export interface CustomizationOptions {
    sleeveStyles: Array<string>;
    colorPatterns: Array<string>;
    neckStyles: Array<string>;
    fabricTypes: Array<string>;
    workTypes: Array<string>;
}
export interface UserProfileInput {
    measurementsJson: string;
    preferredLanguage: string;
    city: string;
    name: string;
    role: string;
    measurements: Array<MeasurementInput>;
    phoneNumber: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum FontWeight {
    normal = "normal",
    bold = "bold",
    light = "light"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_all_tailors_customers {
    all = "all",
    tailors = "tailors",
    customers = "customers"
}
export interface backendInterface {
    addToCart(item: CartItem): Promise<void>;
    adminAddColor(color: Color): Promise<void>;
    adminAddFabric(fabric: Fabric): Promise<void>;
    adminAddProduct(product: Product): Promise<void>;
    adminAddWorkType(workType: WorkType): Promise<void>;
    adminDeleteColor(colorId: string): Promise<void>;
    adminDeleteFabric(fabricId: string): Promise<void>;
    adminDeleteProduct(productId: string): Promise<void>;
    adminDeleteWorkType(workTypeId: string): Promise<void>;
    adminUpdateProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelOrder(orderId: string): Promise<void>;
    clearCart(): Promise<void>;
    createNotification(notification: Notification): Promise<void>;
    getAllExtendedOrders(): Promise<Array<ExtendedOrder>>;
    getAllTailorProfiles(): Promise<Array<TailorProfile>>;
    getCallerUserProfile(): Promise<UserProfileV2 | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getCoinHistory(): Promise<Array<CoinLedger>>;
    getDefaultAppStyle(): Promise<AppStyle>;
    getLastUpdateTimestamp(): Promise<bigint>;
    getMyExtendedOrders(): Promise<Array<ExtendedOrder>>;
    getNotifications(sinceTimestamp: bigint): Promise<Array<Notification>>;
    getOrderById(orderId: string): Promise<ExtendedOrder | null>;
    getPlatformConfig(): Promise<PlatformConfig | null>;
    getTailorProfile(tailorId: string): Promise<TailorProfile | null>;
    getUserCoinBalance(): Promise<bigint>;
    getUserProfile(): Promise<UserProfileV2 | null>;
    getUserProfileByPrincipal(user: Principal): Promise<UserProfileV2 | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    placeExtendedOrder(order: ExtendedOrder): Promise<string>;
    removeFromCart(productId: string): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profileInput: UserProfileInput): Promise<void>;
    saveTailorProfile(profile: TailorProfile): Promise<void>;
    saveUserProfile(profileInput: UserProfileInput): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    updateExtendedOrderStatus(orderId: string, newStatus: string, adminNote: string): Promise<void>;
    updatePlatformConfig(config: PlatformConfig): Promise<void>;
    updateUserRole(role: string): Promise<void>;
}

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
export interface TextStyle {
    weight: FontWeight;
    font: string;
    color: string;
    size: bigint;
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
export interface UserProfileInput {
    preferredLanguage: string;
    city: string;
    name: string;
    measurements: Array<MeasurementInput>;
    phoneNumber: string;
}
export interface Product {
    id: string;
    title: string;
    tailorId: string;
    customizationOptions: CustomizationOptions;
    description: string;
    category: string;
    image: ExternalBlob;
    price: number;
}
export interface UserProfile {
    preferredLanguage: string;
    city: string;
    name: string;
    measurements: Array<Measurement>;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNotification(notification: Notification): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getDefaultAppStyle(): Promise<AppStyle>;
    getNotifications(sinceTimestamp: bigint): Promise<Array<Notification>>;
    getPlatformConfig(): Promise<PlatformConfig | null>;
    getUserProfile(): Promise<UserProfile | null>;
    getUserProfileByPrincipal(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    requestApproval(): Promise<void>;
    saveUserProfile(profileInput: UserProfileInput): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    updatePlatformConfig(config: PlatformConfig): Promise<void>;
}

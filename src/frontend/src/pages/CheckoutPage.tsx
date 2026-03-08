import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Coins,
  CreditCard,
  MapPin,
  Phone,
  Ruler,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ExtendedOrder } from "../backend";
import { useActor } from "../hooks/useActor";
import { useCart } from "../hooks/useCart";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLanguage } from "../hooks/useLanguage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BuyNowItem {
  listing: {
    id: string;
    title: string;
    basePrice: number;
    category: string;
    tailorId: string;
    imageUrl: string;
  };
  customization: Record<string, string>;
}

interface AddressForm {
  houseNo: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  altPhone: string;
  name: string;
  landmark: string;
}

const EMPTY_ADDRESS: AddressForm = {
  houseNo: "",
  area: "",
  city: "",
  state: "",
  pinCode: "",
  phone: "",
  altPhone: "",
  name: "",
  landmark: "",
};

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
];

// ─── Section Components ───────────────────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
}: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
        <Icon className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function FormRow({
  children,
  cols = 2,
}: { children: React.ReactNode; cols?: number }) {
  return (
    <div
      className={cn(
        "grid gap-3",
        cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
      )}
    >
      {children}
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function CheckoutPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  const [address, setAddress] = useState<AddressForm>(EMPTY_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<BuyNowItem | null>(null);
  const [selectedMeasurementId, setSelectedMeasurementId] =
    useState<string>("");
  const [savedMeasurements, setSavedMeasurements] = useState<
    Array<{ id: string; name: string; measurements: Record<string, string> }>
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  // Check if Razorpay keys are configured
  const rzpKeyId = localStorage.getItem("rzp_key_id") || "";
  const isRazorpayEnabled = !!rzpKeyId.trim();

  // Check for buyNow mode
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("buyNowItem");
      if (raw) {
        const parsed = JSON.parse(raw) as BuyNowItem;
        setBuyNowItem(parsed);
      }
    } catch {}
  }, []);

  // Load saved measurement profiles from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("measurementProfiles");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedMeasurements(parsed);
          if (parsed.length > 0) setSelectedMeasurementId(parsed[0].id);
        }
      }
    } catch {}
  }, []);

  // Determine checkout items
  const isBuyNow = !!buyNowItem;
  const checkoutItems = isBuyNow
    ? [
        {
          id: buyNowItem.listing.id,
          title: buyNowItem.listing.title,
          price: buyNowItem.listing.basePrice,
          category: buyNowItem.listing.category,
        },
      ]
    : items.map((i) => ({
        id: i.listing.id,
        title: i.listing.title,
        price: i.listing.basePrice,
        category: i.listing.category,
      }));
  const checkoutTotal = isBuyNow ? buyNowItem.listing.basePrice : totalPrice;

  const setField =
    (field: keyof AddressForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validate = (): boolean => {
    if (!address.name.trim()) {
      toast.error("नाम दर्ज करें");
      return false;
    }
    if (!address.houseNo.trim()) {
      toast.error("घर / फ्लैट नंबर दर्ज करें");
      return false;
    }
    if (!address.area.trim()) {
      toast.error("एरिया / सेक्टर दर्ज करें");
      return false;
    }
    if (!address.city.trim()) {
      toast.error("शहर दर्ज करें");
      return false;
    }
    if (!address.state.trim()) {
      toast.error("राज्य चुनें");
      return false;
    }
    if (!/^\d{6}$/.test(address.pinCode)) {
      toast.error("वैध 6-अंकीय पिन कोड दर्ज करें");
      return false;
    }
    if (!/^\d{10}$/.test(address.phone.replace(/\s/g, ""))) {
      toast.error(
        language === "hi"
          ? "वैध 10-अंकीय मोबाइल नंबर दर्ज करें"
          : "Enter a valid 10-digit mobile number",
      );
      return false;
    }
    if (
      address.altPhone.trim() &&
      !/^\d{10}$/.test(address.altPhone.replace(/\s/g, ""))
    ) {
      toast.error(
        language === "hi"
          ? "वैकल्पिक नंबर भी 10 अंकों का होना चाहिए"
          : "Alternate phone must also be 10 digits",
      );
      return false;
    }
    if (checkoutItems.length === 0) {
      toast.error("कोई आइटम नहीं है");
      return false;
    }
    // Always require measurement — block if no measurements saved at all
    if (savedMeasurements.length === 0) {
      toast.error(
        language === "hi"
          ? "ऑर्डर देने से पहले माप सेव करें — Settings > Measurements में जाएं"
          : "Please save your measurements first — go to Settings > Measurements",
      );
      return false;
    }
    // Block order if measurements saved but none selected
    if (!selectedMeasurementId) {
      toast.error(
        language === "hi"
          ? "कृपया माप प्रोफ़ाइल चुनें — ऑर्डर के लिए माप आवश्यक है"
          : "Please select a measurement profile — measurement is required",
      );
      return false;
    }
    return true;
  };

  const handleRazorpayPayment = async () => {
    if (!validate()) return;
    const keyId = localStorage.getItem("rzp_key_id") || "";
    if (!keyId) {
      toast.error(
        "Razorpay keys configure nahi hain — Admin se contact karein",
      );
      return;
    }
    setLoading(true);
    try {
      // Dynamically load Razorpay script
      await new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Razorpay load failed"));
        document.body.appendChild(script);
      });

      const options = {
        key: keyId,
        amount: checkoutTotal * 100, // in paise
        currency: "INR",
        name: "Fit Also",
        description: checkoutItems[0]?.title || "Custom Tailoring Order",
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: { color: "#1a1a2e" },
        handler: async (response: any) => {
          // Payment success — place order with online payment mode
          await placeOrderInBackend("ONLINE", response.razorpay_payment_id);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        toast.error(
          `Payment failed: ${resp.error?.description || "Unknown error"}`,
        );
        setLoading(false);
      });
      rzp.open();
    } catch {
      toast.error("Online payment shuru nahi ho saka. COD try karein.");
      setLoading(false);
    }
  };

  const placeOrderInBackend = async (mode: string, paymentId?: string) => {
    try {
      const orderId = `FIT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const firstItem = checkoutItems[0];

      const order: ExtendedOrder = {
        id: orderId,
        customerName: address.name,
        status: "Order Placed",
        measurementsJson: selectedMeasurementId
          ? JSON.stringify(
              savedMeasurements.find((m) => m.id === selectedMeasurementId)
                ?.measurements ?? {},
            )
          : "{}",
        deliveryAddress: {
          houseNo: address.houseNo,
          area: address.area,
          city: address.city,
          state: address.state,
          pinCode: address.pinCode,
        },
        isDeleted: false,
        tailorId: isBuyNow
          ? (buyNowItem?.listing.tailorId ?? "demo-tailor")
          : (items[0]?.listing.tailorId ?? "demo-tailor"),
        customerAltPhone: address.altPhone,
        customerPhone: address.phone,
        customerPrincipal: identity?.getPrincipal().toString() ?? "",
        productImages: [],
        customizationJson: isBuyNow
          ? JSON.stringify(buyNowItem?.customization ?? {})
          : JSON.stringify(items[0]?.customization ?? {}),
        estimatedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        orderDate: BigInt(Date.now()),
        orderHash: paymentId || "",
        paymentMode: mode,
        category: firstItem.category,
        listingTitle: firstItem.title,
        totalPrice: checkoutTotal,
        adminNotes: paymentId ? `Razorpay Payment ID: ${paymentId}` : "",
      };

      if (actor && identity) {
        try {
          await actor.placeExtendedOrder(order);
        } catch {
          const existing = JSON.parse(
            localStorage.getItem("allOrders") ?? "[]",
          ) as ExtendedOrder[];
          existing.push(order);
          localStorage.setItem("allOrders", JSON.stringify(existing));
        }
      } else {
        const existing = JSON.parse(
          localStorage.getItem("allOrders") ?? "[]",
        ) as ExtendedOrder[];
        existing.push(order);
        localStorage.setItem("allOrders", JSON.stringify(existing));
      }

      if (isBuyNow) sessionStorage.removeItem("buyNowItem");
      else clearCart();

      toast.success(
        mode === "ONLINE"
          ? "Payment successful! Order placed!"
          : "ऑर्डर सफलतापूर्वक दिया गया!",
      );
      navigate({ to: "/order-confirmation/$orderId", params: { orderId } });
    } catch {
      toast.error("ऑर्डर देने में समस्या हुई। फिर से कोशिश करें।");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    if (paymentMethod === "ONLINE") {
      await handleRazorpayPayment();
      return;
    }
    setLoading(true);
    await placeOrderInBackend("COD");
  };

  // Empty cart guard
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-40" />
        <p className="text-muted-foreground">कोई आइटम नहीं है</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/catalog" })}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
        >
          {language === "hi" ? "खरीदारी करें" : "Browse Catalog"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-48">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button
          type="button"
          onClick={() => navigate({ to: isBuyNow ? "/" : "/cart" })}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold tracking-wide">
          {language === "hi" ? "चेकआउट" : "Checkout"}
        </h1>
        <span className="ml-auto text-white/70 text-xs">
          {isBuyNow ? "Buy Now" : `${checkoutItems.length} items`}
        </span>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Order Summary */}
        <SectionCard
          title={language === "hi" ? "ऑर्डर सारांश" : "Order Summary"}
          icon={ShoppingBag}
        >
          <div className="space-y-3">
            {checkoutItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.category}
                  </p>
                </div>
                <span className="font-display font-bold text-primary text-sm shrink-0">
                  ₹{item.price.toLocaleString("hi-IN")}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {language === "hi" ? "कुल" : "Total"}
              </span>
              <span className="font-display font-bold text-primary text-lg">
                ₹{checkoutTotal.toLocaleString("hi-IN")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
              <Truck className="w-3.5 h-3.5" />
              <span>
                {language === "hi" ? "फ्री डिलीवरी" : "Free Delivery"} — 10-14{" "}
                {language === "hi" ? "दिन" : "days"}
              </span>
            </div>
          </div>
        </SectionCard>

        {/* Delivery Address */}
        <SectionCard
          title={language === "hi" ? "डिलीवरी पता" : "Delivery Address"}
          icon={MapPin}
        >
          <div className="space-y-3">
            <FormRow cols={1}>
              <FormField
                label={language === "hi" ? "पूरा नाम" : "Full Name"}
                required
              >
                <Input
                  value={address.name}
                  onChange={setField("name")}
                  placeholder={
                    language === "hi" ? "आपका नाम" : "Your full name"
                  }
                  className="text-sm"
                  autoComplete="name"
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField
                label={language === "hi" ? "घर / फ्लैट नं." : "House / Flat No."}
                required
              >
                <Input
                  value={address.houseNo}
                  onChange={setField("houseNo")}
                  placeholder="A-203, Building Name"
                  className="text-sm"
                  autoComplete="address-line1"
                />
              </FormField>
              <FormField
                label={
                  language === "hi"
                    ? "एरिया / सेक्टर / कॉलोनी"
                    : "Area / Sector / Colony"
                }
                required
              >
                <Input
                  value={address.area}
                  onChange={setField("area")}
                  placeholder="Sector 15, Vasant Kunj"
                  className="text-sm"
                  autoComplete="address-line2"
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField label={language === "hi" ? "शहर" : "City"} required>
                <Input
                  value={address.city}
                  onChange={setField("city")}
                  placeholder={
                    language === "hi" ? "मुंबई, दिल्ली..." : "Mumbai, Delhi..."
                  }
                  className="text-sm"
                  autoComplete="address-level2"
                />
              </FormField>
              <FormField
                label={language === "hi" ? "पिन कोड" : "PIN Code"}
                required
              >
                <Input
                  value={address.pinCode}
                  onChange={setField("pinCode")}
                  placeholder="400001"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  className="text-sm"
                  autoComplete="postal-code"
                />
              </FormField>
            </FormRow>
            <FormRow cols={1}>
              <div className="space-y-1">
                <Label
                  htmlFor="state-select"
                  className="text-xs text-muted-foreground"
                >
                  {language === "hi" ? "राज्य" : "State"}
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                <select
                  id="state-select"
                  value={address.state}
                  onChange={setField("state")}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">
                    {language === "hi" ? "राज्य चुनें" : "Select state"}
                  </option>
                  {INDIA_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </FormRow>
            {/* Landmark / Nearby Place */}
            <FormRow cols={1}>
              <FormField
                label={
                  language === "hi"
                    ? "लैंडमार्क / नज़दीकी जगह"
                    : "Landmark / Nearby Place"
                }
              >
                <Input
                  value={address.landmark}
                  onChange={setField("landmark")}
                  placeholder="Near Metro Station, Mall..."
                  className="text-sm"
                  autoComplete="off"
                />
              </FormField>
            </FormRow>
          </div>
        </SectionCard>

        {/* Contact Details */}
        <SectionCard
          title={language === "hi" ? "संपर्क विवरण" : "Contact Details"}
          icon={Phone}
        >
          <FormRow>
            <FormField
              label={language === "hi" ? "फ़ोन नंबर" : "Phone Number"}
              required
            >
              <Input
                value={address.phone}
                onChange={setField("phone")}
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                inputMode="tel"
                className="text-sm"
                autoComplete="tel"
              />
            </FormField>
            <FormField
              label={language === "hi" ? "वैकल्पिक नंबर" : "Alternate Phone"}
            >
              <Input
                value={address.altPhone}
                onChange={setField("altPhone")}
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                inputMode="tel"
                className="text-sm"
                autoComplete="tel-national"
              />
            </FormField>
          </FormRow>
        </SectionCard>

        {/* Measurement Profile Selection */}
        <SectionCard
          title={
            language === "hi" ? "माप प्रोफ़ाइल चुनें" : "Select Measurement Profile"
          }
          icon={Ruler}
        >
          {savedMeasurements.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {language === "hi"
                ? "कोई सहेजा हुआ माप नहीं है — Settings में जाकर माप जोड़ें।"
                : "No saved measurements — add them in Settings."}
            </p>
          ) : (
            <div className="space-y-2">
              {savedMeasurements.map((profile) => (
                <label
                  key={profile.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="measurementProfile"
                    value={profile.id}
                    checked={selectedMeasurementId === profile.id}
                    onChange={() => setSelectedMeasurementId(profile.id)}
                    className="w-4 h-4 accent-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {profile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Object.keys(profile.measurements || {}).length}{" "}
                      {language === "hi" ? "माप" : "measurements"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Payment Options */}
        <SectionCard
          title={language === "hi" ? "भुगतान विधि" : "Payment Method"}
          icon={CreditCard}
        >
          <div className="space-y-3">
            {/* COD */}
            <button
              type="button"
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-left",
                paymentMethod === "COD"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
              )}
              onClick={() => setPaymentMethod("COD")}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  paymentMethod === "COD" ? "border-primary" : "border-border",
                )}
              >
                {paymentMethod === "COD" && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Truck className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {language === "hi"
                      ? "कैश ऑन डिलीवरी (COD)"
                      : "Cash on Delivery"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "hi"
                      ? "डिलीवरी पर भुगतान करें"
                      : "Pay when order arrives"}
                  </p>
                </div>
              </div>
              {paymentMethod === "COD" && (
                <CheckCircle className="w-4 h-4 text-primary" />
              )}
            </button>

            {/* Online payment - Razorpay if configured, else coming soon */}
            {isRazorpayEnabled ? (
              <button
                type="button"
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-left",
                  paymentMethod === "ONLINE"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-border hover:border-blue-300",
                )}
                onClick={() => setPaymentMethod("ONLINE")}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    paymentMethod === "ONLINE"
                      ? "border-blue-500"
                      : "border-border",
                  )}
                >
                  {paymentMethod === "ONLINE" && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {language === "hi"
                        ? "ऑनलाइन पेमेंट (Razorpay)"
                        : "Online Payment (Razorpay)"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "hi"
                        ? "UPI, Card, Net Banking, Wallet"
                        : "UPI, Card, Net Banking, Wallet"}
                    </p>
                  </div>
                </div>
                {paymentMethod === "ONLINE" && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30 opacity-60 cursor-not-allowed">
                <div className="w-4 h-4 rounded-full border-2 border-border" />
                <div className="flex items-center gap-2 flex-1">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {language === "hi" ? "ऑनलाइन पेमेंट" : "Online Payment"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "hi" ? "जल्द आ रहा है..." : "Coming Soon"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                  Soon
                </span>
              </div>
            )}

            {/* Loyalty coins - disabled */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30 opacity-60 cursor-not-allowed">
              <div className="w-4 h-4 rounded-full border-2 border-border" />
              <div className="flex items-center gap-2 flex-1">
                <Coins className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {language === "hi" ? "लॉयल्टी कॉइन्स" : "Loyalty Coins"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "hi"
                      ? "ऑनलाइन पेमेंट चालू होने पर उपलब्ध"
                      : "Available when Online Payment is enabled"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                0 coins
              </span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Sticky Place Order Button — sits ABOVE bottom nav, well above it */}
      <div
        className="fixed left-0 right-0 z-[55] bg-background/95 backdrop-blur-sm border-t border-border shadow-xl px-4 py-3"
        style={{ bottom: "calc(60px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {language === "hi" ? "कुल" : "Total"}
            </p>
            <p className="font-display font-bold text-primary text-lg">
              ₹{checkoutTotal.toLocaleString("hi-IN")}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading}
            className={cn(
              "flex-1 py-3.5 rounded-xl font-display font-bold text-sm text-primary-foreground",
              "bg-primary hover:opacity-90 active:scale-95 transition-all",
              "flex items-center justify-center gap-2 shadow-lg",
              loading && "opacity-60 pointer-events-none",
            )}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {language === "hi" ? "प्रोसेस हो रहा है..." : "Processing..."}
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {paymentMethod === "ONLINE"
                  ? language === "hi"
                    ? "ऑनलाइन पेमेंट करें"
                    : "Pay Online"
                  : language === "hi"
                    ? "ऑर्डर दें (COD)"
                    : "Place Order (COD)"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Download,
  MapPin,
  Package,
  Palette,
  Phone,
  Ruler,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import type { ExtendedOrder } from "../backend";
import { LuxuryButton } from "../components/LuxuryButton";
import { LuxuryCard } from "../components/LuxuryCard";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { OrderTrackingBar } from "../components/OrderTrackingBar";
import { useActor } from "../hooks/useActor";
import { useLanguage } from "../hooks/useLanguage";
import { useOrders } from "../hooks/useOrders";
import { generateInvoice } from "../utils/generateInvoice";

export function OrderDetailPage() {
  const { id } = useParams({ from: "/orders/$id" });
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { getOrder } = useOrders();
  const { actor } = useActor();

  const localOrder = getOrder(id);
  const [extOrder, setExtOrder] = useState<ExtendedOrder | null>(null);

  useEffect(() => {
    if (!actor) return;
    actor
      .getOrderById(id)
      .then((result) => {
        if (result) setExtOrder(result);
      })
      .catch(() => {});
  }, [actor, id]);

  if (!localOrder && !extOrder) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Order not found.</p>
        <LuxuryButton
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => navigate({ to: "/orders" })}
        >
          Back to Orders
        </LuxuryButton>
      </div>
    );
  }

  // Merge local and extended order data
  const currentStatus = extOrder?.status ?? localOrder?.status ?? "pending";
  const orderDate = extOrder
    ? new Date(Number(extOrder.orderDate)).toLocaleDateString()
    : localOrder
      ? new Date(localOrder.createdAt).toLocaleDateString()
      : "";

  const handleDownloadInvoice = () => {
    if (extOrder) {
      generateInvoice(extOrder);
    } else if (localOrder) {
      const mockExt: ExtendedOrder = {
        id: localOrder.id,
        customerName: "Customer",
        status: localOrder.status,
        measurementsJson: JSON.stringify(localOrder.measurementSnapshot ?? {}),
        deliveryAddress: {
          houseNo: "",
          area: "",
          city: "",
          state: "",
          pinCode: "",
        },
        isDeleted: false,
        tailorId: localOrder.tailorId ?? "",
        customerAltPhone: "",
        customerPhone: "",
        customerPrincipal: "",
        productImages: [],
        customizationJson: JSON.stringify(localOrder.customization ?? {}),
        estimatedDeliveryDate: "",
        orderDate: BigInt(localOrder.createdAt ?? Date.now()),
        orderHash: "",
        paymentMode: "COD",
        category: localOrder.category ?? "",
        listingTitle: localOrder.listingTitle ?? "",
        totalPrice: localOrder.price ?? 0,
        adminNotes: "",
      };
      generateInvoice(mockExt);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl animate-fade-in">
      <button
        type="button"
        onClick={() => navigate({ to: "/orders" })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {language === "hi" ? "ऑर्डर सूची" : "Back to Orders"}
      </button>

      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {id.slice(0, 16)}...
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {language === "hi" ? "दिनांक" : "Placed on"} {orderDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={currentStatus} />
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Invoice
          </button>
        </div>
      </div>

      {/* Order Tracking */}
      {currentStatus !== "cancelled" && currentStatus !== "Cancelled" && (
        <LuxuryCard className="p-5 mb-6">
          <h2 className="font-serif text-lg font-semibold mb-4">
            {language === "hi" ? "ऑर्डर ट्रैकिंग" : "Order Progress"}
          </h2>
          <OrderTrackingBar
            status={currentStatus}
            language={language as "hi" | "en"}
          />
        </LuxuryCard>
      )}

      <div className="grid gap-6">
        {/* Product Details */}
        <LuxuryCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold">
              {language === "hi" ? "प्रोडक्ट विवरण" : "Product Details"}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Item</p>
              <p className="font-medium">
                {extOrder?.listingTitle ??
                  localOrder?.listingTitle ??
                  "Custom Order"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">
                {extOrder?.category ?? localOrder?.category ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Price</p>
              <p className="font-bold text-primary font-serif text-lg">
                ₹
                {(
                  extOrder?.totalPrice ??
                  localOrder?.price ??
                  0
                ).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment</p>
              <p className="font-medium text-green-600">
                {extOrder?.paymentMode ?? "COD"}
              </p>
            </div>
          </div>
        </LuxuryCard>

        {/* Delivery Address (if extended order) */}
        {extOrder && (
          <LuxuryCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-semibold">
                {language === "hi" ? "डिलीवरी पता" : "Delivery Address"}
              </h2>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{extOrder.customerName}</p>
              <p className="text-muted-foreground">
                {[
                  extOrder.deliveryAddress.houseNo,
                  extOrder.deliveryAddress.area,
                  extOrder.deliveryAddress.city,
                  extOrder.deliveryAddress.state,
                  extOrder.deliveryAddress.pinCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {extOrder.customerPhone && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {extOrder.customerPhone}
                  {extOrder.customerAltPhone &&
                    ` | ${extOrder.customerAltPhone}`}
                </div>
              )}
            </div>
          </LuxuryCard>
        )}

        {/* Customization */}
        {localOrder?.customization && (
          <LuxuryCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-semibold">
                Customization
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(localOrder.customization).map(([key, value]) => (
                <div key={key} className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="font-medium text-sm capitalize mt-0.5">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </LuxuryCard>
        )}

        {/* Measurements */}
        {localOrder?.measurementSnapshot && (
          <LuxuryCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-semibold">
                Measurements — {localOrder.measurementSnapshot.name}
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Chest", val: localOrder.measurementSnapshot.chest },
                { label: "Waist", val: localOrder.measurementSnapshot.waist },
                { label: "Hips", val: localOrder.measurementSnapshot.hips },
                {
                  label: "Shoulder",
                  val: localOrder.measurementSnapshot.shoulderWidth,
                },
                {
                  label: "Sleeve",
                  val: localOrder.measurementSnapshot.sleeveLength,
                },
                { label: "Inseam", val: localOrder.measurementSnapshot.inseam },
                {
                  label: "Neck",
                  val: localOrder.measurementSnapshot.neckCircumference,
                },
                { label: "Height", val: localOrder.measurementSnapshot.height },
              ].map((m) => (
                <div
                  key={m.label}
                  className="text-center p-2 rounded-lg bg-muted"
                >
                  <div className="font-semibold text-sm">{m.val} cm</div>
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>
          </LuxuryCard>
        )}

        {/* Dates */}
        <LuxuryCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold">Timeline</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Order Placed</p>
              <p className="font-medium">{orderDate}</p>
            </div>
            {extOrder?.estimatedDeliveryDate && (
              <div>
                <p className="text-muted-foreground">Est. Delivery</p>
                <p className="font-medium text-green-600">
                  {extOrder.estimatedDeliveryDate}
                </p>
              </div>
            )}
          </div>
        </LuxuryCard>
      </div>
    </div>
  );
}

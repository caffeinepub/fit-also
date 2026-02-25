import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../hooks/useLanguage';
import { useOrders } from '../hooks/useOrders';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { LuxuryCard } from '../components/LuxuryCard';
import { LuxuryButton } from '../components/LuxuryButton';
import { ArrowLeft, Package, Ruler, Palette, Calendar } from 'lucide-react';

const STATUS_STEPS = ['pending', 'confirmed', 'inTailoring', 'shipped', 'delivered'] as const;

export function OrderDetailPage() {
  const { id } = useParams({ from: '/orders/$id' });
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getOrder } = useOrders();

  const order = getOrder(id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Order not found.</p>
        <LuxuryButton variant="outline" size="sm" className="mt-4" onClick={() => navigate({ to: '/orders' })}>
          Back to Orders
        </LuxuryButton>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status as any);

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl animate-fade-in">
      <button
        onClick={() => navigate({ to: '/orders' })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">{order.id}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Status Timeline */}
      {order.status !== 'cancelled' && (
        <LuxuryCard className="p-6 mb-6">
          <h2 className="font-serif text-lg font-semibold mb-5">Order Progress</h2>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    i <= currentStepIndex
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border text-muted-foreground'
                  }`}>
                    {i < currentStepIndex ? '✓' : i + 1}
                  </div>
                  <span className="text-[10px] text-center text-muted-foreground capitalize leading-tight">
                    {s.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-5 ${i < currentStepIndex ? 'bg-primary' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </LuxuryCard>
      )}

      <div className="grid gap-6">
        {/* Product Details */}
        <LuxuryCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold">Product Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Item</p>
              <p className="font-medium">{order.listingTitle}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{order.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tailor</p>
              <p className="font-medium">{order.tailorName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Price</p>
              <p className="font-bold text-primary font-serif text-lg">₹{order.price.toLocaleString()}</p>
            </div>
          </div>
        </LuxuryCard>

        {/* Customization */}
        <LuxuryCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold">Customization</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(order.customization).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="font-medium text-sm capitalize mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </LuxuryCard>

        {/* Measurements */}
        <LuxuryCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold">Measurements — {order.measurementSnapshot.name}</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Chest', val: order.measurementSnapshot.chest },
              { label: 'Waist', val: order.measurementSnapshot.waist },
              { label: 'Hips', val: order.measurementSnapshot.hips },
              { label: 'Shoulder', val: order.measurementSnapshot.shoulderWidth },
              { label: 'Sleeve', val: order.measurementSnapshot.sleeveLength },
              { label: 'Inseam', val: order.measurementSnapshot.inseam },
              { label: 'Neck', val: order.measurementSnapshot.neckCircumference },
              { label: 'Height', val: order.measurementSnapshot.height },
            ].map(m => (
              <div key={m.label} className="text-center p-2 rounded-lg bg-muted">
                <div className="font-semibold text-sm">{m.val} cm</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        </LuxuryCard>

        {/* Dates */}
        <LuxuryCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold">Timeline</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Order Placed</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </LuxuryCard>
      </div>
    </div>
  );
}

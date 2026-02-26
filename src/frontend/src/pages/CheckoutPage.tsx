import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useMeasurements } from '../hooks/useMeasurements';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LuxuryCard } from '../components/LuxuryCard';
import { LuxuryButton } from '../components/LuxuryButton';
import { MeasurementProfileSelector } from '../components/MeasurementProfileSelector';
import { OrderConfirmationModal } from '../components/OrderConfirmationModal';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Step = 'review' | 'measurements' | 'confirm';

const STEPS: Step[] = ['review', 'measurements', 'confirm'];

export function CheckoutPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { profiles } = useMeasurements();
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [step, setStep] = useState<Step>('review');
  const [selectedMeasurementId, setSelectedMeasurementId] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const stepLabels: Record<Step, string> = {
    review: t('checkout.review'),
    measurements: t('checkout.measurements'),
    confirm: t('checkout.confirm'),
  };

  const stepIndex = STEPS.indexOf(step);

  const handlePlaceOrder = async () => {
    const measurement = profiles.find(p => p.id === selectedMeasurementId);
    if (!measurement || items.length === 0) return;
    setLoading(true);
    try {
      const firstItem = items[0];
      
      // Create order locally first
      const order = createOrder({
        tailorId: firstItem.listing.tailorId,
        tailorName: firstItem.listing.tailorName,
        listingId: firstItem.listing.id,
        listingTitle: firstItem.listing.title,
        category: firstItem.listing.category,
        customization: firstItem.customization,
        measurementSnapshot: measurement,
        price: totalPrice,
      });
      
      // Save to backend if available
      if (actor && identity) {
        try {
          await actor.placeOrder({
            id: order.id,
            customerPrincipal: identity.getPrincipal().toString(),
            tailorId: firstItem.listing.tailorId,
            listingTitle: firstItem.listing.title,
            category: firstItem.listing.category,
            totalPrice: totalPrice,
            orderDate: BigInt(Date.now()),
            status: 'pending',
            estimatedDeliveryDate: '',
            adminNotes: '',
            customizationJson: JSON.stringify(firstItem.customization),
            measurementsJson: JSON.stringify(measurement),
          });
        } catch (error) {
          console.error('Backend order save failed:', error);
          // Still proceed with local order
        }
      }
      
      setOrderId(order.id);
      clearCart();
      setShowConfirmation(true);
      setStep('confirm');
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Order placement failed:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'confirm') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <LuxuryButton variant="primary" onClick={() => navigate({ to: '/catalog' })}>Browse Collection</LuxuryButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl animate-fade-in">
      <h1 className="font-serif text-3xl font-bold text-foreground mb-8">{t('checkout.title')}</h1>

      {/* Step Indicator */}
      {step !== 'confirm' && (
        <div className="flex items-center gap-2 mb-8">
          {STEPS.filter(s => s !== 'confirm').map((s, i) => (
            <React.Fragment key={s}>
              <div className={cn(
                'flex items-center gap-2 text-sm font-medium',
                STEPS.indexOf(s) <= stepIndex ? 'text-primary' : 'text-muted-foreground'
              )}>
                <div className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2',
                  STEPS.indexOf(s) < stepIndex ? 'bg-primary border-primary text-primary-foreground' :
                  STEPS.indexOf(s) === stepIndex ? 'border-primary text-primary' :
                  'border-border text-muted-foreground'
                )}>
                  {STEPS.indexOf(s) < stepIndex ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block">{stepLabels[s]}</span>
              </div>
              {i < STEPS.filter(s => s !== 'confirm').length - 1 && (
                <div className={cn('flex-1 h-px', STEPS.indexOf(s) < stepIndex ? 'bg-primary' : 'bg-border')} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pb-[100px]" style={{ scrollMarginBottom: '200px' }}>
          {items.map(item => (
            <LuxuryCard key={item.id} className="p-5">
              <div className="flex gap-4">
                <img
                  src="/assets/generated/garment-placeholder.dim_400x500.png"
                  alt={item.listing.title}
                  className="h-20 w-16 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-serif font-semibold">{item.listing.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.listing.tailorName}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(item.customization).map(([k, v]) => (
                      <span key={k} className="px-2 py-0.5 rounded-full bg-muted text-xs capitalize">{v}</span>
                    ))}
                  </div>
                  <p className="font-bold text-primary font-serif mt-2">₹{item.listing.basePrice.toLocaleString()}</p>
                </div>
              </div>
            </LuxuryCard>
          ))}
          <LuxuryCard className="p-4">
            <div className="flex justify-between font-semibold">
              <span>{t('cart.total')}</span>
              <span className="font-serif text-xl text-primary">₹{totalPrice.toLocaleString()}</span>
            </div>
          </LuxuryCard>
          <LuxuryButton variant="primary" size="lg" className="w-full" onClick={() => setStep('measurements')}>
            {t('checkout.measurements')} <ArrowRight className="h-4 w-4" />
          </LuxuryButton>
        </div>
      )}

      {/* Step: Measurements */}
      {step === 'measurements' && (
        <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pb-[100px]" style={{ scrollMarginBottom: '200px' }}>
          <LuxuryCard className="p-6">
            <h2 className="font-serif text-xl font-semibold mb-4">{t('checkout.measurements')}</h2>
            <MeasurementProfileSelector value={selectedMeasurementId} onChange={setSelectedMeasurementId} />
            {profiles.length === 0 && (
              <LuxuryButton
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate({ to: '/dashboard/customer' })}
              >
                Add Measurements in Dashboard
              </LuxuryButton>
            )}
          </LuxuryCard>
          <div className="flex gap-3">
            <LuxuryButton variant="ghost" size="md" onClick={() => setStep('review')}>
              <ArrowLeft className="h-4 w-4" /> {t('common.back')}
            </LuxuryButton>
            <LuxuryButton
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handlePlaceOrder}
              loading={loading}
              disabled={!selectedMeasurementId}
            >
              {t('checkout.placeOrder')}
            </LuxuryButton>
          </div>
        </div>
      )}

      {/* Step: Success - Hidden, modal shows instead */}
      {step === 'confirm' && (
        <div className="hidden" />
      )}
      
      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        open={showConfirmation}
        orderId={orderId}
        onViewOrders={() => navigate({ to: '/orders' })}
        onContinueShopping={() => navigate({ to: '/catalog' })}
      />
    </div>
  );
}

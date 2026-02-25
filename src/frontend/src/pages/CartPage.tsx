import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../hooks/useCart';
import { LuxuryCard } from '../components/LuxuryCard';
import { LuxuryButton } from '../components/LuxuryButton';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function CartPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, removeItem, totalPrice } = useCart();
  const { identity } = useInternetIdentity();

  const handleCheckout = () => {
    if (!identity) {
      alert('Please log in to proceed to checkout.');
      return;
    }
    navigate({ to: '/checkout' });
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <h1 className="font-serif text-3xl font-bold text-foreground mb-8">{t('cart.title')}</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-xl text-muted-foreground mb-6">{t('cart.empty')}</p>
          <LuxuryButton variant="primary" size="lg" onClick={() => navigate({ to: '/catalog' })}>
            Browse Collection
          </LuxuryButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <LuxuryCard key={item.id} className="p-5">
                <div className="flex gap-4">
                  <img
                    src="/assets/generated/garment-placeholder.dim_400x500.png"
                    alt={item.listing.title}
                    className="h-24 w-20 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-semibold text-foreground">{item.listing.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.listing.tailorName}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(item.customization).map(([k, v]) => (
                        <span key={k} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground capitalize">
                          {v}
                        </span>
                      ))}
                    </div>
                    <p className="font-bold text-primary font-serif mt-2">₹{item.listing.basePrice.toLocaleString()}</p>
                  </div>
                </div>
              </LuxuryCard>
            ))}
          </div>

          {/* Summary */}
          <div>
            <LuxuryCard className="p-6 sticky top-24">
              <h2 className="font-serif text-xl font-semibold mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{item.listing.title}</span>
                    <span className="font-medium shrink-0">₹{item.listing.basePrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-semibold">
                  <span>{t('cart.total')}</span>
                  <span className="font-serif text-xl text-primary">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <LuxuryButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                {t('cart.checkout')}
                <ArrowRight className="h-4 w-4" />
              </LuxuryButton>
            </LuxuryCard>
          </div>
        </div>
      )}
    </div>
  );
}

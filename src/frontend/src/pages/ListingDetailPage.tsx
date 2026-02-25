import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalog } from '../hooks/useCatalog';
import { useCart } from '../hooks/useCart';
import { useTailors } from '../hooks/useTailors';
import { LuxuryCard } from '../components/LuxuryCard';
import { LuxuryButton } from '../components/LuxuryButton';
import { CustomizationSelector } from '../components/CustomizationSelector';
import type { CustomizationOptions } from '../types/catalog';
import { ArrowLeft, MapPin, Clock, ShoppingBag, Scissors } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export function ListingDetailPage() {
  const { id } = useParams({ from: '/listings/$id' });
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getListing } = useCatalog();
  const { addItem } = useCart();
  const { tailors } = useTailors();

  const listing = getListing(id);

  const [customization, setCustomization] = useState<CustomizationOptions | null>(
    listing
      ? {
          neckStyle: listing.availableNeckStyles[0],
          sleeveStyle: listing.availableSleeveStyles[0],
          fabricType: listing.availableFabrics[0],
          colorPattern: listing.availableColors[0],
          workType: listing.availableWorkTypes[0],
        }
      : null
  );

  if (!listing || !customization) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Listing not found.</p>
        <LuxuryButton variant="outline" size="sm" className="mt-4" onClick={() => navigate({ to: '/catalog' })}>
          {t('common.back')} to Catalog
        </LuxuryButton>
      </div>
    );
  }

  const tailor = tailors.find(t => t.id === listing.tailorId);

  const handleAddToCart = () => {
    addItem(listing, customization);
    toast.success('Added to cart!', { description: listing.title });
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <Toaster />
      <button
        onClick={() => navigate({ to: '/catalog' })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')} to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="space-y-4">
          <LuxuryCard className="overflow-hidden">
            <img
              src="/assets/generated/garment-placeholder.dim_400x500.png"
              alt={listing.title}
              className="w-full aspect-[4/5] object-cover"
            />
          </LuxuryCard>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {listing.category}
            </span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3 mb-2">{listing.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

          {/* Price & Delivery */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-muted-foreground">{t('listing.basePrice')}</p>
              <p className="font-serif text-3xl font-bold text-primary">₹{listing.basePrice.toLocaleString()}</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <div>
                <p className="text-xs">{t('listing.estimatedDelivery')}</p>
                <p className="font-medium text-foreground">{listing.estimatedDays} {t('common.days')}</p>
              </div>
            </div>
          </div>

          {/* Customization */}
          <LuxuryCard className="p-5">
            <h2 className="font-serif text-lg font-semibold mb-4">{t('listing.customize')}</h2>
            <CustomizationSelector
              listing={listing}
              value={customization}
              onChange={setCustomization}
            />
          </LuxuryCard>

          {/* Add to Cart */}
          <LuxuryButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {t('listing.addToCart')}
          </LuxuryButton>

          {/* Tailor Info */}
          {tailor && (
            <LuxuryCard className="p-5">
              <h2 className="font-serif text-lg font-semibold mb-4">{t('listing.tailorProfile')}</h2>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Scissors className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{tailor.shopName}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {tailor.city}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{tailor.bio}</p>
                  <LuxuryButton
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate({ to: '/tailors/$id', params: { id: tailor.id } })}
                  >
                    {t('tailor.viewProfile')}
                  </LuxuryButton>
                </div>
              </div>
            </LuxuryCard>
          )}
        </div>
      </div>
    </div>
  );
}

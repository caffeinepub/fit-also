import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLanguage } from '../hooks/useLanguage';
import { LuxuryButton } from '../components/LuxuryButton';
import { LuxuryCard } from '../components/LuxuryCard';
import { useTailors } from '../hooks/useTailors';
import { Scissors, Star, Shield, Truck } from 'lucide-react';

const CATEGORIES = [
  { key: 'cat.shirts' as const, label: 'Shirts', emoji: '👔', cat: 'Shirts' },
  { key: 'cat.kurtas' as const, label: 'Kurtas', emoji: '🧥', cat: 'Kurtas' },
  { key: 'cat.suits' as const, label: 'Suits', emoji: '🤵', cat: 'Suits' },
  { key: 'cat.sherwanis' as const, label: 'Sherwanis', emoji: '✨', cat: 'Sherwanis' },
  { key: 'cat.trousers' as const, label: 'Trousers', emoji: '👖', cat: 'Trousers' },
  { key: 'cat.lehengas' as const, label: 'Lehengas', emoji: '👗', cat: 'Lehengas' },
  { key: 'cat.sareeBlouses' as const, label: 'Saree Blouses', emoji: '🌸', cat: 'Saree Blouses' },
  { key: 'cat.anarkalis' as const, label: 'Anarkalis', emoji: '🌺', cat: 'Anarkalis' },
];

const FEATURES = [
  { icon: Scissors, title: 'Master Craftsmen', desc: 'Handpicked tailors with decades of experience' },
  { icon: Star, title: 'Premium Fabrics', desc: 'Finest silks, brocades, and luxury textiles' },
  { icon: Shield, title: 'Quality Assured', desc: 'Every garment inspected before delivery' },
  { icon: Truck, title: 'Pan-India Delivery', desc: 'Delivered to your doorstep across India' },
];

export function HomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { approvedTailors } = useTailors();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[520px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1440x560.png"
            alt="Luxury tailoring"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-xl">
            <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">
              India's Premier Tailoring Marketplace
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              {t('hero.title')}
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <LuxuryButton
                variant="gold"
                size="lg"
                onClick={() => navigate({ to: '/catalog' })}
              >
                {t('hero.cta')}
              </LuxuryButton>
              <LuxuryButton
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-foreground"
                onClick={() => navigate({ to: '/tailors' })}
              >
                {t('hero.secondary')}
              </LuxuryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 text-primary-foreground">
                <div className="p-2 rounded-lg bg-white/10 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-xs text-white/70 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-medium text-sm tracking-widest uppercase mb-2">Browse by Category</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Our Collection</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(({ key, emoji, cat }) => (
              <LuxuryCard
                key={cat}
                hover
                onClick={() => navigate({ to: '/catalog', search: { category: cat } as any })}
                className="group overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src="/assets/generated/garment-placeholder.dim_400x500.png"
                    alt={cat}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-2xl mb-1">{emoji}</div>
                    <h3 className="font-serif text-white font-semibold text-lg">{t(key)}</h3>
                  </div>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </div>
      </section>

      {/* Textile Pattern Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/textile-pattern-bg.dim_1440x400.png"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Vision, Our Craft
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Every stitch tells a story. From bridal lehengas to everyday kurtas, our master tailors bring your dream garment to life with precision and passion.
          </p>
          <LuxuryButton variant="primary" size="lg" onClick={() => navigate({ to: '/catalog' })}>
            Start Customizing
          </LuxuryButton>
        </div>
      </section>

      {/* Featured Tailors */}
      {approvedTailors.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-accent font-medium text-sm tracking-widest uppercase mb-2">Artisans</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Featured Tailors</h2>
              </div>
              <LuxuryButton variant="outline" size="sm" onClick={() => navigate({ to: '/tailors' })}>
                {t('common.viewAll')}
              </LuxuryButton>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedTailors.slice(0, 3).map(tailor => (
                <LuxuryCard
                  key={tailor.id}
                  hover
                  onClick={() => navigate({ to: '/tailors/$id', params: { id: tailor.id } })}
                  className="p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Scissors className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-foreground">{tailor.shopName}</h3>
                      <p className="text-sm text-muted-foreground">{tailor.city}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{tailor.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tailor.specialties.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </LuxuryCard>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { ShoppingCart, Search, User, Shield, X, Bell } from 'lucide-react';
import { LoginButton } from './LoginButton';
import { useLanguage } from '../hooks/useLanguage';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useCart } from '../hooks/useCart';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthenticated = !!identity;
  const isAdmin = profile?.role === 'admin';
  const isTailor = profile?.role === 'tailor';
  const dashboardPath = isAdmin ? '/admin' : isTailor ? '/dashboard/tailor' : '/dashboard/customer';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/catalog', search: { q: searchQuery } as any });
    }
  };

  const handleClearSearch = () => setSearchQuery('');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-200',
        scrolled ? 'shadow-header' : 'shadow-xs',
        className
      )}
    >
      {/* Top bar: Logo + Search + Actions */}
      <div className="bg-primary px-3 py-2.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="shrink-0 flex flex-col items-start leading-none"
            aria-label="Fit Also Home"
          >
            <span className="font-display font-extrabold text-xl text-white tracking-widest uppercase leading-none">
              FIT ALSO
            </span>
            <span className="text-white/75 text-[9px] font-body tracking-wider leading-none mt-0.5 hidden sm:block">
              Custom Tailoring
            </span>
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 min-w-0">
            <div
              className={cn(
                'flex items-center bg-white rounded-sm overflow-hidden transition-all duration-200',
                searchFocused ? 'ring-2 ring-accent' : ''
              )}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="डिज़ाइन खोजें..."
                className="flex-1 px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground bg-transparent outline-none min-w-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="bg-accent/90 hover:bg-accent px-3 py-2 text-accent-foreground flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="text-xs font-semibold hidden sm:block">खोजें</span>
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Cart */}
            <button
              type="button"
              onClick={() => navigate({ to: '/cart' })}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1 text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center border border-primary">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-body hidden sm:block">कार्ट</span>
            </button>

            {/* Profile / Dashboard */}
            <button
              type="button"
              onClick={() => isAuthenticated ? navigate({ to: dashboardPath }) : undefined}
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Profile"
            >
              {isAdmin ? (
                <Shield className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
              <span className="text-[10px] font-body hidden sm:block">
                {isAdmin ? 'एडमिन' : 'प्रोफ़ाइल'}
              </span>
            </button>

            {/* Login button — only when not authenticated */}
            {!isAuthenticated && (
              <div className="flex flex-col items-center gap-0.5 px-1 py-1">
                <LoginButton />
              </div>
            )}

            {/* Admin bell */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate({ to: '/admin' })}
                className="flex flex-col items-center gap-0.5 px-2 py-1 text-white hover:bg-white/10 rounded transition-colors"
                aria-label="Admin Panel"
              >
                <Bell className="h-5 w-5" />
                <span className="text-[10px] font-body hidden sm:block">एडमिन</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category quick nav — desktop only */}
      <div className="hidden md:block bg-white border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none" aria-label="Quick categories">
            {[
              { label: 'होम', to: '/' },
              { label: 'कुर्ता', to: '/catalog?category=Kurtas' },
              { label: 'अनारकली', to: '/catalog?category=Anarkalis' },
              { label: 'साड़ी ब्लाउज', to: '/catalog?category=Saree+Blouses' },
              { label: 'मेन्स सूट', to: '/catalog?category=Suits' },
              { label: 'शेरवानी', to: '/catalog?category=Sherwanis' },
              { label: 'लहंगा', to: '/catalog?category=Lehengas' },
              { label: 'कपड़े', to: '/catalog?category=fabrics' },
            ].map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate({ to: item.to as any })}
                className="px-3 py-2.5 text-xs font-body font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 whitespace-nowrap transition-colors rounded-sm"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

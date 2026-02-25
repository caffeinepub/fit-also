import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Menu, X, LayoutDashboard, Shield } from 'lucide-react';
import { LoginButton } from './LoginButton';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../hooks/useLanguage';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useCart } from '../hooks/useCart';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isAdmin = profile?.role === 'admin';
  const isTailor = profile?.role === 'tailor';

  const dashboardPath = isAdmin ? '/admin' : isTailor ? '/dashboard/tailor' : '/dashboard/customer';

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.catalog'), to: '/catalog' },
    { label: t('nav.tailors'), to: '/tailors' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/generated/fitalso-logo-transparent.dim_800x800.png"
              alt="Fit Also"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                activeProps={{ className: 'text-primary bg-primary/5' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:flex" />

            {/* Cart */}
            <button
              type="button"
              onClick={() => navigate({ to: '/cart' })}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Dashboard */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => navigate({ to: dashboardPath })}
                className="hidden sm:flex p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Dashboard"
              >
                {isAdmin ? <Shield className="h-5 w-5 text-primary" /> : <LayoutDashboard className="h-5 w-5 text-foreground" />}
              </button>
            )}

            <LoginButton />

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1 animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => { navigate({ to: dashboardPath }); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {t('nav.dashboard')}
              </button>
            )}
            <div className="pt-2 px-3">
              <LanguageToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

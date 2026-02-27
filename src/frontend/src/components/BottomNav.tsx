import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Home, Scissors, Shirt, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetCallerUserProfile } from '../hooks/useQueries';

const NAV_ITEMS = [
  {
    label: 'होम',
    icon: Home,
    to: '/',
    match: (path: string) => path === '/',
  },
  {
    label: 'कस्टम ऑर्डर',
    icon: Scissors,
    to: '/catalog',
    match: (path: string) => path.startsWith('/catalog') || path.startsWith('/listings'),
  },
  {
    label: 'कपड़े',
    icon: Shirt,
    to: '/catalog',
    extraSearch: '?category=fabrics',
    match: (path: string) => false, // handled via active state logic only
  },
  {
    label: 'प्रोफ़ाइल',
    icon: User,
    to: '/dashboard/customer',
    match: (path: string) =>
      path.startsWith('/dashboard') ||
      path.startsWith('/orders') ||
      path.startsWith('/admin'),
  },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();

  const isAdmin = profile?.role === 'admin';
  const isTailor = profile?.role === 'tailor';
  const dashboardPath = isAdmin ? '/admin' : isTailor ? '/dashboard/tailor' : '/dashboard/customer';

  // Get current path safely
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const handleNavClick = (item: typeof NAV_ITEMS[0], index: number) => {
    if (index === 3) {
      // Profile — go to appropriate dashboard
      navigate({ to: dashboardPath as any });
    } else if (index === 2) {
      // Fabrics
      navigate({ to: '/catalog', search: { category: 'fabrics' } as any });
    } else {
      navigate({ to: item.to as any });
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white shadow-bottom-nav border-t border-border"
      aria-label="Bottom navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-14">
        {NAV_ITEMS.map((item, index) => {
          const Icon = index === 3 && isAdmin ? Shield : item.icon;
          const label = index === 3 && isAdmin ? 'एडमिन' : item.label;
          const isActive = index === 3
            ? currentPath.startsWith('/dashboard') || currentPath.startsWith('/orders') || currentPath.startsWith('/admin')
            : index === 0
            ? currentPath === '/'
            : index === 1
            ? (currentPath.startsWith('/catalog') || currentPath.startsWith('/listings')) && !currentPath.includes('fabrics')
            : false;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavClick(item, index)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 relative',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={label}
            >
              {/* Active indicator pill */}
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-0.5 bg-primary rounded-b-full" />
              )}
              <Icon
                className={cn('h-5 w-5 transition-transform duration-150', isActive && 'scale-110')}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span
                className={cn(
                  'text-[10px] font-body font-medium leading-none',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

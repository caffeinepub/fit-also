import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useNotifications } from './hooks/useNotifications';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { TailorDirectoryPage } from './pages/TailorDirectoryPage';
import { TailorProfilePage } from './pages/TailorProfilePage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { TailorDashboard } from './pages/TailorDashboard';
import AdminPanel from './pages/AdminPanel';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

// ─── Layout ───────────────────────────────────────────────────────────────────

function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  // Initialize notification polling for authenticated users
  useNotifications();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && profile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Desktop footer — hidden on mobile since HomePage has its own */}
      <DesktopFooter />
      <BottomNav />
      {!isInitializing && <RoleSelectionModal open={showProfileSetup} />}
      <Toaster />
    </div>
  );
}

// Desktop-only footer (hidden on mobile — HomePage has its own footer)
function DesktopFooter() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'fit-also'
  );

  return (
    <footer className="hidden md:block border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-extrabold text-lg tracking-widest text-primary uppercase">
              FIT ALSO
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>© {year} Fit Also. All rights reserved.</span>
            <span className="hidden sm:block">·</span>
            <span>
              Built with{' '}
              <span className="text-secondary">♥</span>{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const catalogRoute = createRoute({ getParentRoute: () => rootRoute, path: '/catalog', component: CatalogPage });
const listingDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/listings/$id', component: ListingDetailPage });
const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/cart', component: CartPage });
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout', component: CheckoutPage });
const ordersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/orders', component: OrderHistoryPage });
const orderDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/orders/$id', component: OrderDetailPage });
const tailorsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tailors', component: TailorDirectoryPage });
const tailorProfileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tailors/$id', component: TailorProfilePage });
const customerDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dashboard/customer', component: CustomerDashboard });
const tailorDashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/dashboard/tailor', component: TailorDashboard });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminPanel });
const accessDeniedRoute = createRoute({ getParentRoute: () => rootRoute, path: '/access-denied', component: AccessDeniedPage });

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  listingDetailRoute,
  cartRoute,
  checkoutRoute,
  ordersRoute,
  orderDetailRoute,
  tailorsRoute,
  tailorProfileRoute,
  customerDashboardRoute,
  tailorDashboardRoute,
  adminRoute,
  accessDeniedRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

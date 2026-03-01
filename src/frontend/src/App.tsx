import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React from "react";
import { BottomNav } from "./components/BottomNav";
import { Header } from "./components/Header";
import { RoleSelectionModal } from "./components/RoleSelectionModal";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useNotifications } from "./hooks/useNotifications";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import { AccessDeniedPage } from "./pages/AccessDeniedPage";
import AdminPanel from "./pages/AdminPanel";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { HomePage } from "./pages/HomePage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TailorDashboard } from "./pages/TailorDashboard";
import { TailorDirectoryPage } from "./pages/TailorDirectoryPage";
import { TailorProfilePage } from "./pages/TailorProfilePage";
import { WishlistPage } from "./pages/WishlistPage";

// ─── Layout ───────────────────────────────────────────────────────────────────

function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  // Initialize notification polling for authenticated users
  useNotifications();

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && profile === null;

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
  return (
    <footer className="hidden md:block border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/generated/fitalso-logo-transparent.dim_120x120.png"
              alt="Fit Also"
              className="h-6 w-6 object-contain"
            />
            <span className="font-display font-extrabold text-lg tracking-widest text-primary uppercase">
              FIT ALSO
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>© {year} Fit Also. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: CatalogPage,
});
const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/listings/$id",
  component: ListingDetailPage,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrderHistoryPage,
});
const orderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders/$id",
  component: OrderDetailPage,
});
const tailorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tailors",
  component: TailorDirectoryPage,
});
const tailorProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tailors/$id",
  component: TailorProfilePage,
});
const customerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/customer",
  component: CustomerDashboard,
});
const tailorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/tailor",
  component: TailorDashboard,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});
const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/access-denied",
  component: AccessDeniedPage,
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});
const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: WishlistPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation/$orderId",
  component: OrderConfirmationPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  listingDetailRoute,
  cartRoute,
  checkoutRoute,
  ordersRoute,
  orderDetailRoute,
  orderConfirmationRoute,
  tailorsRoute,
  tailorProfileRoute,
  customerDashboardRoute,
  tailorDashboardRoute,
  adminRoute,
  accessDeniedRoute,
  settingsRoute,
  wishlistRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

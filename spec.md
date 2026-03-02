# Fit Also — V17

## Current State
FitAlso is a luxury custom tailoring marketplace for India. V16 has been deployed with multiple fixes attempted but several issues remain. The app uses React + TypeScript frontend with Motoko backend on ICP.

## Requested Changes (Diff)

### Add
- Bottom nav must have exactly 5 items: Home | Search | Cart | Orders | Profile (with cart badge)
- Slider must auto-slide Right→Left every 3 seconds, smooth CSS transition, finger swipe support, tap opens product
- Slider theme: Black + Silver + Dark grey (no red/purple/pink/blue/green)
- Notifications must appear from TOP-CENTER, auto-hide after 2 seconds
- "Why Choose Fit Also?" 4-card section at very bottom of Settings page (already present, keep it)
- Measurement required check — block order if no measurement selected and savedMeasurements is empty
- City field in checkout: free-text input (any India city, not limited dropdown)
- Landmark/Near Place field added to checkout address

### Modify
- **Header**: Remove Search and Cart icons from top-right. Keep ONLY Profile icon on right. Logo — remove `mixBlendMode: multiply` (it causes white issues), instead use `style={{ background: 'transparent' }}` only. Keep logo left-shifted, "FIT ALSO" silver text below logo.
- **BottomNav**: Completely rebuild to exactly 5 items: Home, Search, Cart (with badge count), Orders, Profile. Remove Fabrics tab. Remove Custom Order tab. Cart badge must show in bottom nav.
- **Slider (HeroBanner)**: Replace simple fade/crossfade with proper CSS translateX slide animation. Direction: right to left. Auto every 3 seconds. Touch/swipe support. Tap anywhere → navigate to /catalog. Colors: use dark/charcoal/silver gradient backgrounds only.
- **Cart remove**: Already instant via useCart hook — verify it works and add optimistic UI
- **Checkout Place Order button**: Already at `bottom: calc(56px + env(safe-area-inset-bottom))` — increase to `calc(64px + env(safe-area-inset-bottom, 0px))` for extra safety
- **Cart Checkout button**: Already at `bottom-14` — keep as is but ensure it doesn't overlap bottom nav
- **Dark mode**: Ensure `bg-background` and `text-foreground` are used everywhere (not hardcoded `bg-white`/`text-black`). Key places: HomePage category section uses `bg-white` — change to `bg-background`. Featured section uses `bg-white` — change to `bg-background`. Trending section uses `bg-white` — change to `bg-background`. Footer uses `bg-gray-900` which is fine.
- **Invoice (OrderDetailPage/OrderConfirmationPage)**: Fix to show actual totalPrice, not ₹0. GST = FREE/₹0.
- **Fabric tab in BottomNav**: Remove completely
- **Desktop header nav**: Remove "Fabrics" and "कपड़े" links
- **Category row on HomePage**: Remove the "कपड़े/Fabrics" category item
- **Top-right icons**: Only Profile icon remains (Search + Cart moved to BottomNav)
- **Sonner Toaster position**: Change to `position="top-center"` with duration 2000ms
- **Cart badge**: In BottomNav Cart item, show red badge with white text for count

### Remove
- Search icon from Header top-right
- Cart icon from Header top-right  
- Fabric/Fabrics from BottomNav
- Fabric/Fabrics from desktop header nav
- Fabric/Fabrics from HomePage category row
- `mixBlendMode: multiply` from logo (causes white issues)
- "Made with Caffeine" or any framework credits (already removed, keep removed)

## Implementation Plan

1. **Header.tsx** — Remove Search and Cart buttons. Keep only Profile (and Admin shield). Remove mixBlendMode from logo img. Keep banner background, logo left, FIT ALSO silver text.

2. **BottomNav.tsx** — Complete rebuild: 5 items = Home, Search, Cart (badge), Orders, Profile. Cart badge shows totalItems count. Search goes to /catalog. Orders goes to /orders. Profile goes to /settings.

3. **HomePage.tsx HeroBanner** — Rebuild slider with CSS translateX transform: `transform: translateX(-${activeIndex * 100}%)` on inner track. Touch events for swipe. Auto-slide every 3 seconds resets on touch. Slide colors: dark charcoal/silver/gunmetal gradients.

4. **HomePage.tsx categories** — Remove Fabrics category from CATEGORIES_HI and CATEGORIES_EN arrays.

5. **HomePage.tsx sections** — Change all `bg-white` to `bg-background` for dark mode support.

6. **Header.tsx desktop nav** — Remove Fabrics/कपड़े nav link.

7. **Sonner Toaster** — In App.tsx, set `<Toaster position="top-center" duration={2000} />`.

8. **CheckoutPage.tsx** — Increase bottom offset of Place Order button. Add Landmark field to address form. City remains free-text input (already is). Add measurement validation: if savedMeasurements.length === 0, show warning but don't block (user may be first time). If savedMeasurements.length > 0 and nothing selected, block.

9. **index.css / dark mode** — Ensure CSS variables for dark mode are comprehensive. All `bg-white` in components → `bg-background`.

10. **OrderDetailPage / OrderConfirmationPage** — Fix invoice to show actual totalPrice. GST row shows FREE.

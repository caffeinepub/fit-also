# Fit Also

## Current State
New project. No existing code. Full rebuild from scratch based on comprehensive design spec and UI reference image provided by user.

## Requested Changes (Diff)

### Add
- Full luxury custom tailoring marketplace (India-focused)
- RBAC system: Super Admin (Krishna / FUTURETAILORSFORYOU@gmail.com), Admin, Seller, Tailor, Customer
- Google/Apple/Microsoft login only (no email/password)
- Homepage: fixed floating header, hero banner (admin-controlled), trending section (horizontal scroll), featured designs grid, bottom nav bar (Home, Custom Orders, Fabrics, Profile)
- Product system: Fabric, ReadyMade, CustomStitch, Accessory types; images/videos per product; lazy loading
- Fashion Configuration Engine: dynamic sleeve types (13), neck types (13), embroidery (10), colors + hex picker; all DB-controlled
- Order system: FIT-YYYYMMDD-XXXX order IDs, order snapshot locking, Paytm-style confirmation animation, horizontal progress bar (8 stages), admin manual stage control
- Measurement system: cloud saved, dynamic per garment type, auto-fill on repeat orders
- Loyalty coin system: earn 1 coin/₹100 (online payment only), 1000 coins = ₹2000 reward, coin history ledger
- Admin dashboard: full stats, CRUD for all entities, customization panel, activity log, analytics, CSV/PDF export, maintenance mode toggle
- Commission system: global 20% default, seller override
- Bilingual UI: Hindi + English
- Light/Dark/System mode toggle
- Blob storage for image/video uploads
- Notification system (order updates, admin broadcasts)
- Invoice PDF generation with Fit Also branding
- Security: server-side price recalculation, input validation, rate limiting, soft deletes only

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Select components: authorization, blob-storage
2. Generate backend: users/roles, products, orders, measurements, loyalty coins, commissions, notifications, fashion config attributes
3. Build frontend:
   - Auth flow (Google/Apple/Microsoft login)
   - Homepage matching UI reference (floating header, hero banner, trending, featured grid, bottom nav)
   - Product detail + fashion configurator
   - Cart + checkout flow with loyalty coin toggle
   - Order confirmation animation + order tracking page
   - Profile page with measurement management
   - Admin dashboard (stats, CRUD, customization panel, activity log)
   - Tailor/Seller views
   - Dark/Light mode toggle
   - Hindi/English bilingual labels

## UX Notes
- Design reference shows mobile-first layout matching Flipkart/Myntra aesthetic
- Fixed floating header: "Fit Also" bold left, search + cart + profile icons right
- Bottom nav: Home, Custom Orders, Fabrics, Profile
- Hero banner: admin-editable, auto-slide promos
- Trending section: horizontal scroll, star ratings + "Trending" badge
- Featured designs: 2-column grid, "Cart mein jodo" blue buttons
- Vibrant colors, no cream/beige -- premium feel
- Micro animations: button ripple, hover zoom, smooth transitions
- Paytm-style order confirmation: spinner → checkmark → "CONGRATULATIONS"
- Order progress bar: green completed, glowing green current, grey pending
- Empty state illustrations on all empty screens
- Disable text selection on buttons/cards/nav
- Mobile: touch ripple; Desktop: hover glow

# Fit Also

## Current State
- Full luxury tailoring marketplace with multi-vendor support
- Admin panel exists but gives "Access Denied" to the real admin
- Profile save (name, phone, address, measurements) is broken — data doesn't persist
- Keyboard covers input fields when typing in forms
- Profile form close (X) button and continue button don't work
- No tailor role selection — users can't switch to tailor mode
- Order confirmation UI is plain — no Paytm-style animation
- Orders stored in localStorage only (can get lost)
- Admin customization panel exists but image upload doesn't reliably work
- No new-item "Add" flow with price/fabric/image fields in customization panel

## Requested Changes (Diff)

### Add
- **Admin email hardcoded**: FUTURETAILORSFORYOU@gmail.com is Super Admin. Backend `isCallerAdmin` must also do a local email-based check using `identity.getPrincipal()` email claim or stored email. Frontend: after login check, store email in localStorage and compare to FUTURETAILORSFORYOU@gmail.com. If match, treat as admin and bypass backend check (or supplement it).
- **Admin always gets dashboard access**: If the logged-in user's identity matches the admin email, skip the `isAdmin` backend check and grant access directly. Never show "Access Denied" to the admin.
- **Order confirmation animation**: After order placement, show a full-screen modal with: spinning circular loader → smooth transition to green checkmark → "CONGRATULATIONS! Your order is confirmed" with confetti or celebration UI. After 3 seconds auto-dismiss or show "View Order" button.
- **Order persistent storage**: Orders saved to backend canister (not just localStorage). New backend functions: `placeOrder`, `getMyOrders`, `getAllOrders` (admin), `updateOrderStatus` (admin), `getOrderById`.
- **Admin order update → customer notification**: When admin changes order status or sets delivery date, a notification is automatically created for the specific customer.
- **New item add flow in customization panel**: When admin adds a new product/fabric/color/work-type, a form asks for: name/title, price (for products), description, fabric details, and image upload. Save stores everything persistently in backend.
- **Tailor mode in Settings**: Settings page has a "Switch to Tailor Mode" toggle. Default = Customer. Once enabled, user sees tailor dashboard options.
- **Keyboard-aware forms**: All measurement input forms and profile forms use `ScrollView`-style containers with `paddingBottom` that adjusts when keyboard is open (`visualViewport` API). Active input scrolls into view automatically.
- **Profile form fix**: 
  - Close (X) button dismisses the modal and navigates back
  - Continue button saves profile to backend and navigates to home/dashboard
  - Profile data saved once = stays saved forever (backend storage, not just localStorage)
- **FitAlso logo**: Generate a professional luxury tailoring brand logo (gold + dark navy, needle/thread motif).

### Modify
- **Admin access check**: Frontend `AdminPanel.tsx` — if `identity` email matches `FUTURETAILORSFORYOU@gmail.com`, set `isAdmin = true` immediately without waiting for backend. Also attempt backend check in parallel for role assignment.
- **Profile save flow**: `RoleSelectionModal` (or wherever profile is captured) — save to backend via `saveUserProfile`. On load, fetch from backend via `getUserProfile`. Remove reliance on localStorage for profile data.
- **Orders section in AdminPanel**: Load orders from backend (`getAllOrders`) instead of localStorage. Admin can update status and set estimated delivery date. Each status update triggers a notification to the customer.
- **Order placement (CheckoutPage)**: After successful order, call backend `placeOrder`. Show animated order confirmation screen (spinning loader → checkmark → congratulations message).
- **Customization panel**: Fix image upload to persist using backend blob storage. Add "Add New Product" button with full form (title, category, price, description, image upload). Save all data to backend `updatePlatformConfig`.

### Remove
- localStorage-only order storage (replace with backend)
- Broken profile save that uses only localStorage
- Access denied screen for the hardcoded admin email

## Implementation Plan
1. Generate new backend with: `placeOrder`, `getMyOrders`, `getAllOrders`, `updateOrderStatus`, `setOrderDeliveryDate`, `getOrderById` functions. Orders stored permanently in stable Map. Also add `getTailorProfile`, `saveTailorProfile` for tailor mode.
2. Frontend: Fix admin access — check email client-side for FUTURETAILORSFORYOU@gmail.com, bypass backend check.
3. Frontend: Fix profile save — use backend `saveUserProfile`/`getUserProfile`. Fix close and continue buttons in RoleSelectionModal/ProfileSetup.
4. Frontend: Fix keyboard-aware forms — use visualViewport API to adjust scroll offset when keyboard opens.
5. Frontend: Add order confirmation animation (spinner → checkmark → congratulations) in CheckoutPage.
6. Frontend: Wire orders to backend — CheckoutPage calls `placeOrder`, OrderHistoryPage calls `getMyOrders`, AdminPanel loads from `getAllOrders`.
7. Frontend: Admin order update → auto-notification to customer via `createNotification`.
8. Frontend: Customization panel — fix image upload persistence, add "Add New Item" form with all fields.
9. Frontend: Settings page — add "Switch to Tailor Mode" toggle.
10. Generate FitAlso logo.

## UX Notes
- No confirmation boxes — actions execute directly
- Admin (Krishna) must ALWAYS get dashboard access — no access denied ever
- Keyboard opens → form scrolls up automatically, active field stays visible
- Order confirmation is celebratory and premium (Paytm-style animation)
- Profile saved once = permanent, never asks again
- All image uploads support any format/size
- Only admin sees "Start Customising" button — no other user
- Tailor mode only accessible from Settings, not forced at login

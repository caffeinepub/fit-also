# FitAlso

## Current State
FitAlso is a luxury custom tailoring marketplace on ICP. The admin panel (`AdminPanel.tsx`) already exists with sections for Overview, Customers, Orders, Tailors, Products, etc. 

**Current Problems:**
1. **Products section** in admin panel reads from `localStorage` (tailor-linked listings) instead of the backend `getPlatformConfig()` → `products[]` array. Admin cannot add new products via the backend `adminAddProduct` API, and remove/update also not wired to backend (`adminDeleteProduct`, `adminUpdateProduct`).
2. **Orders section** — `getAllExtendedOrders()` backend call exists but only runs once on mount. No 10-second polling. Orders from backend may not appear immediately.
3. **Order status update** — `updateExtendedOrderStatus` is partially wired but the admin detail dialog doesn't show full customer info (phone, alt phone, address, measurements) clearly.
4. **Real-time new order alert** — admin has no visual indicator when a new order arrives during their session.

## Requested Changes (Diff)

### Add
- **Admin Products — Add Product form**: Button "Add New Product" opens a dialog. Form fields: Title, Category, Description, Price, Image (file upload via ExternalBlob/blob-storage). Calls `adminAddProduct()` on submit.
- **Admin Products — Backend product listing**: Load products from `getPlatformConfig()` → `products[]` instead of localStorage tailor listings. Show all products with image, title, category, price.
- **Admin Products — Edit product**: Edit button on each product card calls `adminUpdateProduct()`.
- **Admin Products — Delete/Remove product**: Trash icon calls `adminDeleteProduct(productId)` with soft-delete (sets `isDeleted: true` via `adminUpdateProduct`).
- **Admin Orders — 10-second polling**: Auto-refresh `getAllExtendedOrders()` every 10 seconds while admin is on the Orders tab. New order badge/toast appears if count increases.
- **Admin Orders — Full detail view**: Order detail dialog shows: Customer Name, Phone, Alt Phone, full Delivery Address (house, area, city, state, pin), Product, Category, Price, Payment Mode, Order Date, Measurements (parsed from `measurementsJson`), 8-stage status tracker visual, Admin Notes field, Change Status dropdown.
- **New order notification badge**: When admin is logged in and a new order arrives (detected via polling), show a red badge on the Orders nav item and a top toast "New order received!"

### Modify
- **ProductsSection component**: Replace localStorage-based listing load with backend `getPlatformConfig()` call. Wire all CRUD operations to backend APIs.
- **OrdersSection component**: Add `setInterval` polling (10s) on top of existing backend fetch. Enhance order detail dialog with full fields.

### Remove
- Admin Products reading from localStorage tailor listings (old code path).

## Implementation Plan
1. In `AdminPanel.tsx`, update `ProductsSection`:
   - Use `useActor` + `useQuery` to call `getPlatformConfig()` and extract `products` array
   - Render product cards with image (ExternalBlob `getDirectURL()`), title, category, price
   - Add "Add New Product" button → dialog with form (title, category, description, price, image upload)
   - On add: call `actor.adminAddProduct(product)` then refetch
   - On edit: call `actor.adminUpdateProduct(product)` then refetch
   - On delete: call `actor.adminUpdateProduct({...product, isDeleted: true})` (soft delete) then refetch
2. In `OrdersSection`, add `useEffect` with `setInterval(10000)` that re-fetches `getAllExtendedOrders()`. Track previous count, show toast + badge on new orders.
3. Enhance backend order detail dialog to show all fields: customer phone, alt phone, full address breakdown, measurements parsed from JSON, 8-stage visual tracker, admin notes input.
4. Add `newOrderCount` state to `AdminPanel` main component, pass badge count to Orders nav item.

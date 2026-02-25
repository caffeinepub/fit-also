# Fit Also

Premium custom tailoring marketplace for India with multi-vendor support, bilingual UI (Hindi/English), full order management, measurement cloud storage, and Super Admin platform customization.

---

## Current State

### Frontend
- **HomePage**: Hero banner, category browsing, featured tailors
- **CatalogPage**: Product listings with customization options (neck, sleeve, fabric, color, work types)
- **TailorDirectoryPage**: Browse approved tailors by city
- **CheckoutPage**: Order placement with measurement profiles
- **CustomerDashboard**: View orders, manage measurements, loyalty points
- **TailorDashboard**: Manage listings, view orders, track revenue
- **AdminPanel**: Comprehensive Super Admin dashboard with:
  - Overview stats (customers, tailors, orders, revenue)
  - Customer management (view profiles, order history)
  - Order management (view all orders, edit status)
  - Tailor management (approve/reject, edit profiles)
  - Products/Listings management (view, edit, delete)
  - Revenue analytics
  - Cities management (add/edit/delete cities)
  - Fabrics & designs management (cotton, silk, prints, work types)
  - Promotions & discounts
  - Notifications broadcast
  - Image manager

### Backend (Motoko)
- **Authorization**: Role-based access control (admin, tailor, customer, guest)
- **User Approval**: Tailor onboarding approval workflow
- **Blob Storage**: Large file/image storage system

### Current Data Storage
- **LocalStorage-based**: Profiles, tailors, orders, measurements, cities, fabrics, promotions currently stored in browser localStorage
- **Issue**: Profile data (name, phone, address, measurements) not persisting after page reload
- **Issue**: No centralized image upload system for admin to replace product/logo/banner images

---

## Requested Changes (Diff)

### Add

1. **FitAlso Professional Logo**
   - Generated luxury tailoring brand logo (elegant, premium style)
   - Stored in `/assets/generated/fitalso-logo-transparent.dim_800x800.png`
   - Used in Header, HomePage, and Admin panel

2. **"Start Customising" Button in Admin Dashboard**
   - Prominent button/banner in AdminPanel (visible only to Super Admin)
   - Opens full-screen customization panel
   - Access restricted to Krishna (Super Admin)

3. **Full Customization Panel (Admin-only)**
   - **Edit existing products**: Description, pricing, images
   - **Add new products**: Input fields for price, fabric details, category, image upload
   - **Image upload everywhere**: Products, logo, banners, fabrics — all sections support image upload
   - **All sections expanded by default** (no collapse behavior)
   - **Save button**: Persists all changes to backend (cloud storage)
   - **Load previous data**: When panel reopens, previously saved data loads automatically

4. **Image Upload System**
   - File picker (device native file dialog)
   - Support all formats: JPG, PNG, WebP, GIF (any size)
   - Upload to blob-storage backend
   - Preview image before saving
   - Replace image functionality on all existing images

5. **Backend Profile Persistence**
   - Store user profiles (name, phone, city, measurements, language) in Motoko backend
   - API: `saveUserProfile`, `getUserProfile`
   - Persist in stable storage (not localStorage)
   - Profiles available cross-device after login

6. **Backend Platform Customization Storage**
   - Store platform-wide data: products, fabrics, colors, work types, cities, promotions, banners
   - API: `getPlatformConfig`, `updatePlatformConfig` (admin-only)
   - Centralized source of truth for catalog data

7. **Instant Notification System**
   - When Admin updates products/pricing/images → trigger notification to all users
   - Frontend polls for new notifications (every 10-15 seconds)
   - Toast notification: "New products updated! 🎉"
   - Click notification → redirects to catalog/updated page

### Modify

1. **ProfileSettingsForm**
   - Fix: Save profile to backend (not just localStorage)
   - Fix: Load profile from backend on mount
   - Fix: Persist data permanently (no reset on reload)

2. **AdminPanel**
   - Add "Start Customising" banner/button at top
   - Integrate with new customization panel
   - Show FitAlso logo in header

3. **Header Component**
   - Replace placeholder logo with generated FitAlso logo

4. **HomePage**
   - Use backend-stored banner images (if admin uploaded custom images)
   - Dynamic product categories from backend config

5. **CatalogPage**
   - Load products from backend platform config (not localStorage)
   - Display admin-uploaded product images

6. **Backend Authorization**
   - Ensure only Super Admin can call `updatePlatformConfig`
   - Add Krishna's principal ID as Super Admin (hardcode or role-check)

### Remove

- None (all existing features retained, only extending/fixing)

---

## Implementation Plan

### 1. Logo Integration
   - ✅ Generated FitAlso logo (`fitalso-logo-transparent.dim_800x800.png`)
   - Update Header component to use new logo
   - Update HomePage hero section to feature logo
   - Update AdminPanel to show logo in banner

### 2. Backend Code Generation (Motoko)
   - **User Profile Storage**
     - `saveUserProfile(name: Text, phone: Text, city: Text, measurements: [(Text, Float)], language: Text)` (caller-based)
     - `getUserProfile()` → returns optional UserProfile
     - Store in stable HashMap (Principal → UserProfile)
   - **Platform Customization Storage**
     - `getPlatformConfig()` → returns PlatformConfig (products, fabrics, cities, etc.)
     - `updatePlatformConfig(config: PlatformConfig)` (admin-only, checks caller permission)
     - Store in stable var
   - **Notification System**
     - `createNotification(title: Text, body: Text, targetAudience: Text)` (admin-only)
     - `getNotifications(since: Int)` → returns [Notification]
     - Store notifications with timestamp
   - Use existing blob-storage Mixin for image uploads

### 3. Frontend - Customization Panel Component
   - New component: `AdminCustomizationPanel.tsx`
   - Full-screen modal/drawer UI
   - Sections (all expanded by default):
     - **Products**: List existing products, edit button → opens edit form (description, pricing, image upload)
     - **Add Product**: Button → form with fields (name, category, price, fabric details, image upload)
     - **Fabrics & Colors**: Edit existing, add new with image upload
     - **Cities**: Add/edit/delete cities
     - **Banners**: Upload/replace homepage hero banner
     - **Logo**: Upload/replace site logo
   - **Image Upload Widget**:
     - File input (accept="image/*")
     - Preview thumbnail
     - Upload to blob-storage backend
     - Return blob URL, store in config
   - **Save Button** (sticky footer):
     - Calls `updatePlatformConfig` with all changes
     - Shows success toast
     - Invalidates frontend queries to reload fresh data

### 4. Frontend - Profile Save Fix
   - Update `ProfileSettingsForm.tsx`:
     - Call new backend `saveUserProfile` API
     - Load from backend on mount (not localStorage fallback)
   - Update `useQueries.ts`:
     - `useGetCallerUserProfile` → fetch from backend
     - `useSaveCallerUserProfile` → save to backend

### 5. Frontend - Notification Polling
   - New hook: `useNotifications.ts`
   - Poll backend every 15 seconds for new notifications
   - Show toast when new notification arrives
   - Store "last seen notification ID" in localStorage to avoid duplicates

### 6. Frontend - AdminPanel "Start Customising" Button
   - Add prominent banner at top of AdminPanel
   - Button: "🎨 Start Customising" (only visible to Super Admin)
   - Opens `AdminCustomizationPanel` component in full-screen dialog

### 7. Frontend - Catalog Data from Backend
   - Update `CatalogPage`, `HomePage`, `TailorDirectoryPage`:
     - Fetch products, categories, cities from backend `getPlatformConfig`
     - Fallback to localStorage if backend empty (migration path)

### 8. Validation & Testing
   - Test profile save/load across logout/login
   - Test image upload (various formats, sizes)
   - Test customization panel edit/add flows
   - Test notification delivery to non-admin users
   - Test Admin-only access restrictions
   - Typecheck, lint, build

### 9. Deploy
   - Deploy backend with new APIs
   - Deploy frontend with customization panel & fixes
   - Call `ready_to_deploy_draft` + `write_follow_up`

---

## UX Notes

### Admin Customization Flow
1. Admin (Krishna) opens AdminPanel
2. Sees "🎨 Start Customising" banner at top
3. Clicks button → full customization panel opens
4. All sections visible (Products, Fabrics, Cities, Images, etc.)
5. Admin edits product description, replaces product image via file picker
6. Admin adds new product with price, details, image
7. Admin uploads new homepage hero banner
8. Admin clicks "Save Changes" → all data persists to backend
9. Toast: "Changes saved successfully! ✨"
10. Users receive notification: "New products updated!"

### Customer Experience After Admin Update
1. Customer browses products on CatalogPage
2. Sees products with images, descriptions, pricing (all managed by Admin via customization panel)
3. If Admin updates product images or pricing → notification toast appears: "New products updated!"
4. Customer clicks notification → redirects to catalog to see updates

### Profile Save Fix
1. User (any role) goes to Profile Settings
2. Fills name, phone, city, language
3. Clicks Save
4. **Expected**: Profile persists in backend, available on all devices after login
5. **Current bug fixed**: No longer resets to empty on reload

### Image Upload Experience
1. Admin clicks "Upload Image" or "Replace Image"
2. File picker opens (native OS file dialog)
3. Admin selects JPG/PNG/WebP/GIF image (any size)
4. Preview appears in UI
5. Admin confirms → image uploaded to blob-storage backend
6. Image URL stored in platform customization data
7. Image displayed on frontend (product page, homepage, etc.)

---

## Technical Notes

- **Backend language**: Motoko (no Rust/Python/other languages)
- **Frontend**: React + TypeScript + Tailwind CSS (no Vue/Angular/Next.js)
- **Storage**: IC canister stable memory (no PostgreSQL/MongoDB)
- **Real-time**: Polling-based notifications (no WebSockets/Socket.io)
- **Image storage**: Use existing blob-storage Mixin for large file uploads
- **Access control**: Leverage existing authorization system, ensure only Super Admin can write platform customization data
- **Backward compatibility**: Keep temporary localStorage reads for existing data, but prioritize backend data on load
- **Admin principal**: Krishna's principal ID should be hardcoded or configurable as Super Admin (or use existing role-based access control if already in place)

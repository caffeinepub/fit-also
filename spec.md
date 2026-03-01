# Fit Also

## Current State
Draft Version 8 is live. The app has Hindi/English language toggle, dark mode, wishlist, cart, order system, admin panel. The translation system exists (LanguageContext + translations.ts) and is functional, but several bugs are present.

## Requested Changes (Diff)

### Add
- Admin "Customer Analytics" tab: shows which customer (name + city) ordered which garment most, with order count and revenue breakdown
- Admin analytics: top garments ordered, customer location breakdown

### Modify
- **Language switch fix**: Header component has hardcoded Hindi strings ("डिज़ाइन खोजें...", "खोजें", "कार्ट", "सेटिंग्स", "एडमिन") that do NOT use the `t()` translation function — must be replaced with language-aware text
- **Category nav in Header**: hardcoded Hindi category labels — must switch based on active language
- **Cart badge fix**: Badge already has `{totalItems > 0 && ...}` condition — need to verify the useCart hook returns 0 correctly when cart is empty, and ensure no phantom rendering
- **Order tracking fix**: OrderTrackingBar component exists and is used in OrderDetailPage — need to verify it shows correctly; the issue may be that the order status string from backend doesn't match the resolveStageIndex map, or the component is hidden
- **"Order Now" / Buy button fix**: In ListingDetailPage, the action buttons are in the normal document flow and may get hidden on mobile by the bottom nav — make the Buy It Now button sticky/fixed at bottom on mobile
- **Order Confirmation page**: Show OrderTrackingBar prominently after order placed

### Remove
- Nothing

## Implementation Plan
1. Fix Header.tsx: replace all hardcoded Hindi strings with language-aware text using `t()` or inline ternary `language === 'hi' ? '...' : '...'`
2. Fix Header category nav: use translation keys or language-conditional labels
3. Fix ListingDetailPage: make "Buy It Now" / "Add to Cart" buttons sticky at bottom on mobile (fixed positioning above bottom nav)
4. Fix OrderDetailPage: ensure OrderTrackingBar is clearly visible (check rendering condition, add proper spacing)
5. Fix OrderConfirmationPage: add OrderTrackingBar display
6. Verify useCart returns 0 when empty — if cart badge still shows, add explicit `totalItems > 0` guard
7. Add "Customer Analytics" tab in AdminPanel with: table of customers, their city, which garment they ordered most, total orders, total spend

export type Language = "en" | "hi";

export type TranslationKey =
  // Navigation
  | "nav.home"
  | "nav.catalog"
  | "nav.tailors"
  | "nav.cart"
  | "nav.dashboard"
  | "nav.admin"
  | "nav.login"
  | "nav.logout"
  | "nav.loggingIn"
  // Hero
  | "hero.title"
  | "hero.subtitle"
  | "hero.cta"
  | "hero.secondary"
  // Categories
  | "cat.shirts"
  | "cat.kurtas"
  | "cat.suits"
  | "cat.sherwanis"
  | "cat.trousers"
  | "cat.lehengas"
  | "cat.sareeBlouses"
  | "cat.anarkalis"
  // Catalog
  | "catalog.title"
  | "catalog.search"
  | "catalog.filter"
  | "catalog.allCategories"
  | "catalog.noResults"
  | "catalog.viewDetails"
  | "catalog.by"
  // Listing Detail
  | "listing.customize"
  | "listing.neckStyle"
  | "listing.sleeveStyle"
  | "listing.fabric"
  | "listing.color"
  | "listing.workType"
  | "listing.addToCart"
  | "listing.price"
  | "listing.tailorProfile"
  | "listing.estimatedDelivery"
  | "listing.basePrice"
  // Customization Options
  | "neck.round"
  | "neck.vNeck"
  | "neck.mandarin"
  | "neck.boat"
  | "neck.square"
  | "neck.sweetheart"
  | "sleeve.full"
  | "sleeve.half"
  | "sleeve.sleeveless"
  | "sleeve.threequarter"
  | "sleeve.cap"
  | "fabric.cotton"
  | "fabric.silk"
  | "fabric.linen"
  | "fabric.chiffon"
  | "fabric.georgette"
  | "fabric.velvet"
  | "fabric.brocade"
  | "fabric.crepe"
  | "color.ivory"
  | "color.red"
  | "color.navy"
  | "color.emerald"
  | "color.gold"
  | "color.burgundy"
  | "color.blush"
  | "color.black"
  | "work.plain"
  | "work.embroidery"
  | "work.zari"
  | "work.sequin"
  | "work.mirror"
  | "work.block"
  // Cart
  | "cart.title"
  | "cart.empty"
  | "cart.checkout"
  | "cart.remove"
  | "cart.total"
  | "cart.customization"
  // Checkout
  | "checkout.title"
  | "checkout.review"
  | "checkout.measurements"
  | "checkout.confirm"
  | "checkout.selectMeasurement"
  | "checkout.placeOrder"
  | "checkout.success"
  | "checkout.orderPlaced"
  // Orders
  | "orders.title"
  | "orders.id"
  | "orders.date"
  | "orders.tailor"
  | "orders.status"
  | "orders.amount"
  | "orders.viewDetail"
  | "orders.noOrders"
  | "status.pending"
  | "status.confirmed"
  | "status.inTailoring"
  | "status.shipped"
  | "status.delivered"
  | "status.cancelled"
  // Dashboard
  | "dash.welcome"
  | "dash.activeOrders"
  | "dash.orderHistory"
  | "dash.measurements"
  | "dash.loyalty"
  | "dash.profile"
  | "dash.myListings"
  | "dash.shopProfile"
  | "dash.earnings"
  | "dash.incomingOrders"
  // Measurements
  | "meas.title"
  | "meas.add"
  | "meas.edit"
  | "meas.delete"
  | "meas.profileName"
  | "meas.chest"
  | "meas.waist"
  | "meas.hips"
  | "meas.shoulder"
  | "meas.sleeve"
  | "meas.inseam"
  | "meas.neck"
  | "meas.height"
  | "meas.save"
  | "meas.unit"
  // Loyalty
  | "loyalty.points"
  | "loyalty.balance"
  | "loyalty.history"
  | "loyalty.earned"
  | "loyalty.order"
  | "loyalty.date"
  // Tailor
  | "tailor.directory"
  | "tailor.shopName"
  | "tailor.city"
  | "tailor.specialties"
  | "tailor.bio"
  | "tailor.portfolio"
  | "tailor.turnaround"
  | "tailor.basePricing"
  | "tailor.onboard"
  | "tailor.pendingApproval"
  | "tailor.contact"
  | "tailor.viewProfile"
  // Admin
  | "admin.title"
  | "admin.totalOrders"
  | "admin.totalRevenue"
  | "admin.activeTailors"
  | "admin.customers"
  | "admin.recentOrders"
  | "admin.manageTailors"
  | "admin.approve"
  | "admin.reject"
  | "admin.suspend"
  // Auth
  | "auth.selectRole"
  | "auth.customer"
  | "auth.tailor"
  | "auth.admin"
  | "auth.completeProfile"
  | "auth.name"
  | "auth.phone"
  | "auth.language"
  | "auth.save"
  | "auth.accessDenied"
  | "auth.goHome"
  // Common
  | "common.save"
  | "common.cancel"
  | "common.edit"
  | "common.delete"
  | "common.loading"
  | "common.error"
  | "common.success"
  | "common.back"
  | "common.viewAll"
  | "common.days"
  | "common.inr"
  | "common.search";

type Translations = Record<Language, Record<TranslationKey, string>>;

export const translations: Translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.catalog": "Catalog",
    "nav.tailors": "Find a Tailor",
    "nav.cart": "Cart",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "nav.loggingIn": "Logging in...",
    // Hero
    "hero.title": "Crafted for You, Stitched with Love",
    "hero.subtitle":
      "Discover India's finest tailors. Custom garments made to your exact measurements.",
    "hero.cta": "Explore Collection",
    "hero.secondary": "Find a Tailor",
    // Categories
    "cat.shirts": "Shirts",
    "cat.kurtas": "Kurtas",
    "cat.suits": "Suits",
    "cat.sherwanis": "Sherwanis",
    "cat.trousers": "Trousers",
    "cat.lehengas": "Lehengas",
    "cat.sareeBlouses": "Saree Blouses",
    "cat.anarkalis": "Anarkalis",
    // Catalog
    "catalog.title": "Our Collection",
    "catalog.search": "Search garments...",
    "catalog.filter": "Filter by Category",
    "catalog.allCategories": "All Categories",
    "catalog.noResults": "No listings found. Try a different search.",
    "catalog.viewDetails": "View Details",
    "catalog.by": "by",
    // Listing Detail
    "listing.customize": "Customize Your Garment",
    "listing.neckStyle": "Neck Style",
    "listing.sleeveStyle": "Sleeve Style",
    "listing.fabric": "Fabric Type",
    "listing.color": "Color / Pattern",
    "listing.workType": "Embroidery / Work",
    "listing.addToCart": "Add to Cart",
    "listing.price": "Price",
    "listing.tailorProfile": "About the Tailor",
    "listing.estimatedDelivery": "Estimated Delivery",
    "listing.basePrice": "Base Price",
    // Customization Options
    "neck.round": "Round Neck",
    "neck.vNeck": "V-Neck",
    "neck.mandarin": "Mandarin Collar",
    "neck.boat": "Boat Neck",
    "neck.square": "Square Neck",
    "neck.sweetheart": "Sweetheart",
    "sleeve.full": "Full Sleeve",
    "sleeve.half": "Half Sleeve",
    "sleeve.sleeveless": "Sleeveless",
    "sleeve.threequarter": "Three-Quarter",
    "sleeve.cap": "Cap Sleeve",
    "fabric.cotton": "Cotton",
    "fabric.silk": "Silk",
    "fabric.linen": "Linen",
    "fabric.chiffon": "Chiffon",
    "fabric.georgette": "Georgette",
    "fabric.velvet": "Velvet",
    "fabric.brocade": "Brocade",
    "fabric.crepe": "Crepe",
    "color.ivory": "Ivory",
    "color.red": "Red",
    "color.navy": "Navy Blue",
    "color.emerald": "Emerald Green",
    "color.gold": "Gold",
    "color.burgundy": "Burgundy",
    "color.blush": "Blush Pink",
    "color.black": "Black",
    "work.plain": "Plain",
    "work.embroidery": "Embroidery",
    "work.zari": "Zari Work",
    "work.sequin": "Sequin",
    "work.mirror": "Mirror Work",
    "work.block": "Block Print",
    // Cart
    "cart.title": "Your Cart",
    "cart.empty": "Your cart is empty",
    "cart.checkout": "Proceed to Checkout",
    "cart.remove": "Remove",
    "cart.total": "Total",
    "cart.customization": "Customization",
    // Checkout
    "checkout.title": "Checkout",
    "checkout.review": "Review Order",
    "checkout.measurements": "Select Measurements",
    "checkout.confirm": "Confirm Order",
    "checkout.selectMeasurement": "Select a measurement profile",
    "checkout.placeOrder": "Place Order",
    "checkout.success": "Order Placed Successfully!",
    "checkout.orderPlaced":
      "Your order has been placed. The tailor will confirm shortly.",
    // Orders
    "orders.title": "My Orders",
    "orders.id": "Order ID",
    "orders.date": "Date",
    "orders.tailor": "Tailor",
    "orders.status": "Status",
    "orders.amount": "Amount",
    "orders.viewDetail": "View",
    "orders.noOrders": "No orders yet. Start shopping!",
    "status.pending": "Pending",
    "status.confirmed": "Confirmed",
    "status.inTailoring": "In Tailoring",
    "status.shipped": "Shipped",
    "status.delivered": "Delivered",
    "status.cancelled": "Cancelled",
    // Dashboard
    "dash.welcome": "Welcome back",
    "dash.activeOrders": "Active Orders",
    "dash.orderHistory": "Order History",
    "dash.measurements": "Measurements",
    "dash.loyalty": "Loyalty Points",
    "dash.profile": "Profile",
    "dash.myListings": "My Listings",
    "dash.shopProfile": "Shop Profile",
    "dash.earnings": "Earnings",
    "dash.incomingOrders": "Incoming Orders",
    // Measurements
    "meas.title": "Measurement Profiles",
    "meas.add": "Add New Profile",
    "meas.edit": "Edit Profile",
    "meas.delete": "Delete",
    "meas.profileName": "Profile Name",
    "meas.chest": "Chest (cm)",
    "meas.waist": "Waist (cm)",
    "meas.hips": "Hips (cm)",
    "meas.shoulder": "Shoulder Width (cm)",
    "meas.sleeve": "Sleeve Length (cm)",
    "meas.inseam": "Inseam (cm)",
    "meas.neck": "Neck Circumference (cm)",
    "meas.height": "Height (cm)",
    "meas.save": "Save Profile",
    "meas.unit": "cm",
    // Loyalty
    "loyalty.points": "Points",
    "loyalty.balance": "Points Balance",
    "loyalty.history": "Points History",
    "loyalty.earned": "Points Earned",
    "loyalty.order": "Order",
    "loyalty.date": "Date",
    // Tailor
    "tailor.directory": "Tailor Directory",
    "tailor.shopName": "Shop Name",
    "tailor.city": "City",
    "tailor.specialties": "Specialties",
    "tailor.bio": "About Your Shop",
    "tailor.portfolio": "Portfolio Image URL",
    "tailor.turnaround": "Turnaround Time (days)",
    "tailor.basePricing": "Base Pricing (₹)",
    "tailor.onboard": "Register Your Shop",
    "tailor.pendingApproval": "Your profile is pending admin approval.",
    "tailor.contact": "Contact Tailor",
    "tailor.viewProfile": "View Profile",
    // Admin
    "admin.title": "Admin Panel",
    "admin.totalOrders": "Total Orders",
    "admin.totalRevenue": "Total Revenue",
    "admin.activeTailors": "Active Tailors",
    "admin.customers": "Customers",
    "admin.recentOrders": "Recent Orders",
    "admin.manageTailors": "Manage Tailors",
    "admin.approve": "Approve",
    "admin.reject": "Reject",
    "admin.suspend": "Suspend",
    // Auth
    "auth.selectRole": "Choose Your Role",
    "auth.customer": "Customer",
    "auth.tailor": "Tailor / Vendor",
    "auth.admin": "Admin",
    "auth.completeProfile": "Complete Your Profile",
    "auth.name": "Full Name",
    "auth.phone": "Phone Number",
    "auth.language": "Preferred Language",
    "auth.save": "Save & Continue",
    "auth.accessDenied": "Access Denied",
    "auth.goHome": "Go to Home",
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.loading": "Loading...",
    "common.error": "Something went wrong.",
    "common.success": "Success!",
    "common.back": "Back",
    "common.viewAll": "View All",
    "common.days": "days",
    "common.inr": "₹",
    "common.search": "Search",
  },
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.catalog": "कैटलॉग",
    "nav.tailors": "दर्जी खोजें",
    "nav.cart": "कार्ट",
    "nav.dashboard": "डैशबोर्ड",
    "nav.admin": "एडमिन",
    "nav.login": "लॉगिन",
    "nav.logout": "लॉगआउट",
    "nav.loggingIn": "लॉगिन हो रहा है...",
    // Hero
    "hero.title": "आपके लिए बना, प्यार से सिला",
    "hero.subtitle": "भारत के सर्वश्रेष्ठ दर्जियों से मिलें। आपके माप के अनुसार कस्टम कपड़े।",
    "hero.cta": "कलेक्शन देखें",
    "hero.secondary": "दर्जी खोजें",
    // Categories
    "cat.shirts": "शर्ट",
    "cat.kurtas": "कुर्ता",
    "cat.suits": "सूट",
    "cat.sherwanis": "शेरवानी",
    "cat.trousers": "ट्राउजर",
    "cat.lehengas": "लहंगा",
    "cat.sareeBlouses": "साड़ी ब्लाउज",
    "cat.anarkalis": "अनारकली",
    // Catalog
    "catalog.title": "हमारा कलेक्शन",
    "catalog.search": "कपड़े खोजें...",
    "catalog.filter": "श्रेणी से फ़िल्टर करें",
    "catalog.allCategories": "सभी श्रेणियाँ",
    "catalog.noResults": "कोई लिस्टिंग नहीं मिली। अलग खोज आज़माएं।",
    "catalog.viewDetails": "विवरण देखें",
    "catalog.by": "द्वारा",
    // Listing Detail
    "listing.customize": "अपना कपड़ा कस्टमाइज़ करें",
    "listing.neckStyle": "गला शैली",
    "listing.sleeveStyle": "आस्तीन शैली",
    "listing.fabric": "कपड़े का प्रकार",
    "listing.color": "रंग / पैटर्न",
    "listing.workType": "कढ़ाई / काम",
    "listing.addToCart": "कार्ट में जोड़ें",
    "listing.price": "मूल्य",
    "listing.tailorProfile": "दर्जी के बारे में",
    "listing.estimatedDelivery": "अनुमानित डिलीवरी",
    "listing.basePrice": "आधार मूल्य",
    // Customization Options
    "neck.round": "गोल गला",
    "neck.vNeck": "वी-नेक",
    "neck.mandarin": "मंदारिन कॉलर",
    "neck.boat": "बोट नेक",
    "neck.square": "स्क्वेयर नेक",
    "neck.sweetheart": "स्वीटहार्ट",
    "sleeve.full": "पूरी आस्तीन",
    "sleeve.half": "आधी आस्तीन",
    "sleeve.sleeveless": "बिना आस्तीन",
    "sleeve.threequarter": "तीन-चौथाई",
    "sleeve.cap": "कैप स्लीव",
    "fabric.cotton": "कॉटन",
    "fabric.silk": "सिल्क",
    "fabric.linen": "लिनन",
    "fabric.chiffon": "शिफॉन",
    "fabric.georgette": "जॉर्जेट",
    "fabric.velvet": "वेलवेट",
    "fabric.brocade": "ब्रोकेड",
    "fabric.crepe": "क्रेप",
    "color.ivory": "आइवरी",
    "color.red": "लाल",
    "color.navy": "नेवी ब्लू",
    "color.emerald": "एमरल्ड ग्रीन",
    "color.gold": "सोना",
    "color.burgundy": "बरगंडी",
    "color.blush": "ब्लश पिंक",
    "color.black": "काला",
    "work.plain": "सादा",
    "work.embroidery": "कढ़ाई",
    "work.zari": "जरी काम",
    "work.sequin": "सीक्विन",
    "work.mirror": "शीशा काम",
    "work.block": "ब्लॉक प्रिंट",
    // Cart
    "cart.title": "आपका कार्ट",
    "cart.empty": "आपका कार्ट खाली है",
    "cart.checkout": "चेकआउट करें",
    "cart.remove": "हटाएं",
    "cart.total": "कुल",
    "cart.customization": "कस्टमाइज़ेशन",
    // Checkout
    "checkout.title": "चेकआउट",
    "checkout.review": "ऑर्डर समीक्षा",
    "checkout.measurements": "माप चुनें",
    "checkout.confirm": "ऑर्डर की पुष्टि करें",
    "checkout.selectMeasurement": "माप प्रोफ़ाइल चुनें",
    "checkout.placeOrder": "ऑर्डर दें",
    "checkout.success": "ऑर्डर सफलतापूर्वक दिया गया!",
    "checkout.orderPlaced": "आपका ऑर्डर दे दिया गया है। दर्जी जल्द ही पुष्टि करेगा।",
    // Orders
    "orders.title": "मेरे ऑर्डर",
    "orders.id": "ऑर्डर आईडी",
    "orders.date": "तारीख",
    "orders.tailor": "दर्जी",
    "orders.status": "स्थिति",
    "orders.amount": "राशि",
    "orders.viewDetail": "देखें",
    "orders.noOrders": "अभी तक कोई ऑर्डर नहीं। खरीदारी शुरू करें!",
    "status.pending": "लंबित",
    "status.confirmed": "पुष्टि हुई",
    "status.inTailoring": "सिलाई में",
    "status.shipped": "भेजा गया",
    "status.delivered": "डिलीवर हुआ",
    "status.cancelled": "रद्द",
    // Dashboard
    "dash.welcome": "वापस स्वागत है",
    "dash.activeOrders": "सक्रिय ऑर्डर",
    "dash.orderHistory": "ऑर्डर इतिहास",
    "dash.measurements": "माप",
    "dash.loyalty": "लॉयल्टी पॉइंट्स",
    "dash.profile": "प्रोफ़ाइल",
    "dash.myListings": "मेरी लिस्टिंग",
    "dash.shopProfile": "दुकान प्रोफ़ाइल",
    "dash.earnings": "कमाई",
    "dash.incomingOrders": "आने वाले ऑर्डर",
    // Measurements
    "meas.title": "माप प्रोफ़ाइल",
    "meas.add": "नई प्रोफ़ाइल जोड़ें",
    "meas.edit": "प्रोफ़ाइल संपादित करें",
    "meas.delete": "हटाएं",
    "meas.profileName": "प्रोफ़ाइल नाम",
    "meas.chest": "छाती (सेमी)",
    "meas.waist": "कमर (सेमी)",
    "meas.hips": "कूल्हे (सेमी)",
    "meas.shoulder": "कंधे की चौड़ाई (सेमी)",
    "meas.sleeve": "आस्तीन की लंबाई (सेमी)",
    "meas.inseam": "इनसीम (सेमी)",
    "meas.neck": "गर्दन परिधि (सेमी)",
    "meas.height": "ऊंचाई (सेमी)",
    "meas.save": "प्रोफ़ाइल सहेजें",
    "meas.unit": "सेमी",
    // Loyalty
    "loyalty.points": "पॉइंट्स",
    "loyalty.balance": "पॉइंट्स बैलेंस",
    "loyalty.history": "पॉइंट्स इतिहास",
    "loyalty.earned": "अर्जित पॉइंट्स",
    "loyalty.order": "ऑर्डर",
    "loyalty.date": "तारीख",
    // Tailor
    "tailor.directory": "दर्जी डायरेक्टरी",
    "tailor.shopName": "दुकान का नाम",
    "tailor.city": "शहर",
    "tailor.specialties": "विशेषताएं",
    "tailor.bio": "अपनी दुकान के बारे में",
    "tailor.portfolio": "पोर्टफोलियो इमेज URL",
    "tailor.turnaround": "टर्नअराउंड समय (दिन)",
    "tailor.basePricing": "आधार मूल्य (₹)",
    "tailor.onboard": "अपनी दुकान पंजीकृत करें",
    "tailor.pendingApproval": "आपकी प्रोफ़ाइल एडमिन अनुमोदन की प्रतीक्षा में है।",
    "tailor.contact": "दर्जी से संपर्क करें",
    "tailor.viewProfile": "प्रोफ़ाइल देखें",
    // Admin
    "admin.title": "एडमिन पैनल",
    "admin.totalOrders": "कुल ऑर्डर",
    "admin.totalRevenue": "कुल राजस्व",
    "admin.activeTailors": "सक्रिय दर्जी",
    "admin.customers": "ग्राहक",
    "admin.recentOrders": "हाल के ऑर्डर",
    "admin.manageTailors": "दर्जी प्रबंधन",
    "admin.approve": "स्वीकृत करें",
    "admin.reject": "अस्वीकार करें",
    "admin.suspend": "निलंबित करें",
    // Auth
    "auth.selectRole": "अपनी भूमिका चुनें",
    "auth.customer": "ग्राहक",
    "auth.tailor": "दर्जी / विक्रेता",
    "auth.admin": "एडमिन",
    "auth.completeProfile": "अपनी प्रोफ़ाइल पूरी करें",
    "auth.name": "पूरा नाम",
    "auth.phone": "फ़ोन नंबर",
    "auth.language": "पसंदीदा भाषा",
    "auth.save": "सहेजें और जारी रखें",
    "auth.accessDenied": "पहुंच अस्वीकृत",
    "auth.goHome": "होम पर जाएं",
    // Common
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.edit": "संपादित करें",
    "common.delete": "हटाएं",
    "common.loading": "लोड हो रहा है...",
    "common.error": "कुछ गलत हुआ।",
    "common.success": "सफलता!",
    "common.back": "वापस",
    "common.viewAll": "सभी देखें",
    "common.days": "दिन",
    "common.inr": "₹",
    "common.search": "खोजें",
  },
};

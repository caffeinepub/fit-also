import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Bell,
  Check,
  ChevronRight,
  Heart,
  HelpCircle,
  Languages,
  Lock,
  LogOut,
  Monitor,
  Moon,
  Ruler,
  Settings,
  Shield,
  ShoppingBag,
  Sun,
  User,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLanguage } from "../hooks/useLanguage";

// ─── Types ────────────────────────────────────────────────────────────────────

type ThemeMode = "light" | "dark" | "system";

function getStoredTheme(): ThemeMode {
  try {
    const t = localStorage.getItem("fitAlsoTheme") as ThemeMode;
    if (t === "light" || t === "dark" || t === "system") return t;
  } catch {}
  return "system";
}

function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else if (mode === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.remove("dark", "light");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    }
  }
  try {
    localStorage.setItem("fitAlsoTheme", mode);
  } catch {}
}

// ─── Bilingual label helper ───────────────────────────────────────────────────

function bi(language: string, hi: string, en: string) {
  return language === "hi" ? hi : en;
}

// ─── Row Components ───────────────────────────────────────────────────────────

function SettingsRow({
  icon: Icon,
  label,
  value,
  onClick,
  rightElement,
  danger = false,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/60 active:bg-muted transition-colors text-left",
        danger && "hover:bg-red-50 dark:hover:bg-red-950/30",
        !onClick && "cursor-default",
        className,
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          danger ? "bg-red-100 dark:bg-red-900/30" : "bg-primary/10",
        )}
      >
        <Icon
          className={cn("w-4 h-4", danger ? "text-red-500" : "text-primary")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            danger ? "text-red-600 dark:text-red-400" : "text-foreground",
          )}
        >
          {label}
        </p>
        {value && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {value}
          </p>
        )}
      </div>
      {rightElement ??
        (onClick && !danger && (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        ))}
    </button>
  );
}

function SectionCard({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-3">
      <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

// ─── Main SettingsPage ────────────────────────────────────────────────────────

export function SettingsPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { identity, clear } = useInternetIdentity();

  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);

  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCity, setProfileCity] = useState("");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleLanguageToggle = () => {
    const next = language === "hi" ? "en" : "hi";
    setLanguage(next);
    toast.success(
      next === "hi" ? "भाषा हिंदी में बदली गई ✓" : "Language changed to English ✓",
    );
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
    applyTheme(mode);
    setThemeDialogOpen(false);
  };

  const handleLogout = () => {
    if (clear) {
      clear();
    } else {
      try {
        localStorage.clear();
      } catch {}
    }
    navigate({ to: "/" });
    toast.success(
      bi(language, "लॉगआउट सफलतापूर्वक हुआ", "Logged out successfully"),
    );
  };

  const themeLabel =
    theme === "light"
      ? bi(language, "लाइट मोड", "Light Mode")
      : theme === "dark"
        ? bi(language, "डार्क मोड", "Dark Mode")
        : bi(language, "सिस्टम डिफ़ॉल्ट", "System Default");

  const themeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button
          type="button"
          data-ocid="settings.back.button"
          onClick={() => navigate({ to: "/" })}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <h1 className="text-lg font-bold tracking-wide">
            {bi(language, "सेटिंग्स", "Settings")}
          </h1>
        </div>
      </div>

      {/* Profile Banner */}
      <div className="bg-primary/5 border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-md">
          <User className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="font-bold text-foreground">
            {profileName ||
              (identity
                ? "Fit Also User"
                : bi(language, "अतिथि उपयोगकर्ता", "Guest User"))}
          </p>
          <p className="text-xs text-muted-foreground">
            {identity
              ? `${identity.getPrincipal().toString().slice(0, 20)}...`
              : bi(language, "लॉगिन नहीं है", "Not logged in")}
          </p>
        </div>
      </div>

      <div className="px-3 pt-4">
        {/* Account & Profile */}
        <SectionCard title={bi(language, "खाता", "Account")}>
          <SettingsRow
            icon={User}
            label={bi(language, "मेरी प्रोफ़ाइल", "My Profile")}
            value={bi(language, "नाम, फ़ोन, शहर", "Name, Phone, City")}
            onClick={() => setProfileDialogOpen(true)}
          />
          <SettingsRow
            icon={Shield}
            label={bi(language, "लिंक्ड अकाउंट", "Linked Accounts")}
            value="Internet Identity"
            onClick={() => {}}
          />
          <SettingsRow
            icon={Lock}
            label={bi(language, "पते", "Addresses")}
            value={bi(language, "डिलीवरी पते", "Delivery addresses")}
            onClick={() => navigate({ to: "/dashboard/customer" })}
          />
        </SectionCard>

        {/* Preferences */}
        <SectionCard title={bi(language, "प्राथमिकताएं", "Preferences")}>
          {/* Language Toggle */}
          <button
            type="button"
            data-ocid="settings.language.toggle"
            onClick={handleLanguageToggle}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/60 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Languages className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {bi(language, "भाषा", "Language")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {bi(language, "अभी:", "Currently:")}{" "}
                {language === "hi" ? "हिंदी" : "English"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold border",
                  language === "hi"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border",
                )}
              >
                हिंदी
              </span>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold border",
                  language === "en"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border",
                )}
              >
                EN
              </span>
              <Check className="w-4 h-4 text-green-500 shrink-0" />
            </div>
          </button>

          {/* Theme */}
          <SettingsRow
            icon={themeIcon}
            label={bi(language, "थीम / दिखावट", "Appearance / Theme")}
            value={themeLabel}
            onClick={() => setThemeDialogOpen(true)}
          />
        </SectionCard>

        {/* Shopping */}
        <SectionCard title={bi(language, "खरीदारी", "Shopping")}>
          <SettingsRow
            icon={Heart}
            label={bi(language, "मेरी विश लिस्ट", "My Wishlist")}
            value={bi(language, "सहेजे गए प्रोडक्ट", "Saved products")}
            onClick={() => navigate({ to: "/wishlist" })}
          />
          <SettingsRow
            icon={ShoppingBag}
            label={bi(language, "मेरे ऑर्डर", "My Orders")}
            value={bi(language, "ऑर्डर इतिहास", "Order history")}
            onClick={() => navigate({ to: "/orders" })}
          />
          <SettingsRow
            icon={Ruler}
            label={bi(language, "मेरे माप", "My Measurements")}
            value={bi(language, "माप प्रोफ़ाइल", "Measurement profiles")}
            onClick={() => navigate({ to: "/dashboard/customer" })}
          />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title={bi(language, "सूचनाएं", "Notifications")}>
          <SettingsRow
            icon={Bell}
            label={bi(language, "सूचनाएं", "Notifications")}
            value={bi(
              language,
              "ऑर्डर अपडेट, प्रमोशन",
              "Order updates, promotions",
            )}
            onClick={() => navigate({ to: "/settings/notifications" as any })}
          />
        </SectionCard>

        {/* Support */}
        <SectionCard title={bi(language, "सहायता", "Support")}>
          <SettingsRow
            icon={HelpCircle}
            label={bi(language, "सहायता और FAQ", "Help & FAQ")}
            value={bi(
              language,
              "अक्सर पूछे जाने वाले प्रश्न",
              "Frequently asked questions",
            )}
            onClick={() =>
              toast(bi(language, "जल्द आ रहा है!", "Help center coming soon!"))
            }
          />
          <SettingsRow
            icon={AlertCircle}
            label={bi(language, "समस्या रिपोर्ट करें", "Report a Problem")}
            value={bi(language, "सहायता से संपर्क करें", "Contact support")}
            onClick={() =>
              toast(bi(language, "जल्द आ रहा है!", "Support form coming soon!"))
            }
          />
        </SectionCard>

        {/* Logout — smaller black button, not red */}
        <SectionCard title={bi(language, "लॉगआउट", "Sign Out")}>
          <button
            type="button"
            data-ocid="settings.logout.button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 active:bg-muted transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
              <LogOut className="w-3.5 h-3.5 text-foreground/70" />
            </div>
            <p className="text-xs font-medium text-foreground/70">
              {bi(language, "लॉगआउट / साइन आउट", "Logout / Sign Out")}
            </p>
          </button>
        </SectionCard>

        {/* Why Choose Fit Also — always at very bottom */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-3 mt-2">
          <div className="px-4 py-3 bg-muted/40 border-b border-border">
            <p className="text-sm font-bold text-foreground text-center">
              {bi(language, "Fit Also क्यों चुनें?", "Why Choose Fit Also?")}
            </p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {(language === "hi"
              ? [
                  { icon: "✂️", title: "कस्टम सिलाई", desc: "आपके नाप से बना" },
                  { icon: "⭐", title: "प्रीमियम कपड़े", desc: "बेस्ट क्वालिटी" },
                  { icon: "🚚", title: "पैन-इंडिया", desc: "घर तक डिलीवरी" },
                  { icon: "🛡️", title: "क्वालिटी गारंटी", desc: "100% संतुष्टि" },
                ]
              : [
                  {
                    icon: "✂️",
                    title: "Custom Stitching",
                    desc: "Made to your measurements",
                  },
                  {
                    icon: "⭐",
                    title: "Premium Fabrics",
                    desc: "Best quality",
                  },
                  {
                    icon: "🚚",
                    title: "Pan-India",
                    desc: "Delivery at doorstep",
                  },
                  {
                    icon: "🛡️",
                    title: "Quality Guarantee",
                    desc: "100% satisfaction",
                  },
                ]
            ).map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/50 gap-2"
              >
                <span className="text-2xl" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground py-4">
          © {new Date().getFullYear()} Fit Also.{" "}
          {bi(language, "सर्वाधिकार सुरक्षित।", "All rights reserved.")}
        </p>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {bi(language, "प्रोफ़ाइल संपादित करें", "Edit Profile")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{bi(language, "पूरा नाम", "Full Name")}</Label>
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder={bi(language, "आपका नाम...", "Your name...")}
              />
            </div>
            <div>
              <Label>{bi(language, "फ़ोन", "Phone")}</Label>
              <Input
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                type="tel"
              />
            </div>
            <div>
              <Label>{bi(language, "शहर", "City")}</Label>
              <Input
                value={profileCity}
                onChange={(e) => setProfileCity(e.target.value)}
                placeholder="Mumbai, Delhi..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProfileDialogOpen(false)}
            >
              {bi(language, "रद्द करें", "Cancel")}
            </Button>
            <Button
              onClick={() => {
                try {
                  const key = identity
                    ? `userProfile_${identity.getPrincipal().toString()}`
                    : "userProfile_guest";
                  const existing = JSON.parse(
                    localStorage.getItem(key) || "{}",
                  );
                  localStorage.setItem(
                    key,
                    JSON.stringify({
                      ...existing,
                      name: profileName,
                      phone: profilePhone,
                      city: profileCity,
                    }),
                  );
                } catch {}
                toast.success(
                  bi(language, "प्रोफ़ाइल सहेजी गई!", "Profile saved!"),
                );
                setProfileDialogOpen(false);
              }}
            >
              {bi(language, "सहेजें", "Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Theme Selection Dialog */}
      <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{bi(language, "थीम चुनें", "Choose Theme")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {(
              [
                {
                  mode: "light",
                  icon: Sun,
                  label: bi(language, "लाइट मोड", "Light Mode"),
                  sublabel: bi(language, "उजला रंग", "Bright & light"),
                },
                {
                  mode: "dark",
                  icon: Moon,
                  label: bi(language, "डार्क मोड", "Dark Mode"),
                  sublabel: bi(language, "गहरा रंग", "Dark & easy on eyes"),
                },
                {
                  mode: "system",
                  icon: Monitor,
                  label: bi(language, "सिस्टम डिफ़ॉल्ट", "System Default"),
                  sublabel: bi(language, "डिवाइस के अनुसार", "Follow device"),
                },
              ] as {
                mode: ThemeMode;
                icon: React.ElementType;
                label: string;
                sublabel: string;
              }[]
            ).map(({ mode, icon: Icon, label, sublabel }) => (
              <button
                key={mode}
                type="button"
                data-ocid={`settings.theme.${mode}.button`}
                onClick={() => handleThemeChange(mode)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors",
                  theme === mode
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    theme === mode ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{sublabel}</p>
                </div>
                {theme === mode && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

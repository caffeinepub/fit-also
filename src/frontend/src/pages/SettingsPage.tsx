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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Bell,
  Check,
  ChevronRight,
  Globe,
  Heart,
  HelpCircle,
  Languages,
  Lock,
  LogOut,
  Monitor,
  Moon,
  Ruler,
  Scissors,
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

function getStoredRole(): string {
  try {
    return localStorage.getItem("fitAlsoRole") || "customer";
  } catch {
    return "customer";
  }
}

function getStoredNotifications(): boolean {
  try {
    return localStorage.getItem("fitAlsoNotifications") !== "false";
  } catch {
    return true;
  }
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
        danger && "hover:bg-red-50",
        !onClick && "cursor-default",
        className,
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          danger ? "bg-red-100" : "bg-primary/10",
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
            danger ? "text-red-600" : "text-foreground",
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
  const [role, setRole] = useState(getStoredRole);
  const [notificationsOn, setNotificationsOn] = useState(
    getStoredNotifications,
  );
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

  const handleRoleToggle = () => {
    const newRole = role === "customer" ? "tailor" : "customer";
    setRole(newRole);
    try {
      localStorage.setItem("fitAlsoRole", newRole);
    } catch {}
    toast.success(
      newRole === "tailor"
        ? "दर्जी मोड में स्विच किया गया"
        : "Customer mode में वापस आए",
    );
  };

  const handleNotificationToggle = (v: boolean) => {
    setNotificationsOn(v);
    try {
      localStorage.setItem("fitAlsoNotifications", String(v));
    } catch {}
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
    toast.success("लॉगआउट सफलतापूर्वक हुआ");
  };

  const themeLabel =
    theme === "light"
      ? "Light Mode"
      : theme === "dark"
        ? "Dark Mode"
        : "System Default";
  const themeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <h1 className="text-lg font-bold tracking-wide">सेटिंग्स / Settings</h1>
        </div>
      </div>

      {/* Profile Banner */}
      <div className="bg-primary/5 border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-md">
          <User className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="font-bold text-foreground">
            {profileName || (identity ? "Fit Also User" : "Guest User")}
          </p>
          <p className="text-xs text-muted-foreground">
            {identity
              ? `${identity.getPrincipal().toString().slice(0, 20)}...`
              : "Not logged in"}
          </p>
        </div>
      </div>

      <div className="px-3 pt-4">
        {/* Account & Profile */}
        <SectionCard title="खाता / Account">
          <SettingsRow
            icon={User}
            label="मेरी प्रोफ़ाइल"
            value="नाम, फ़ोन, शहर"
            onClick={() => setProfileDialogOpen(true)}
          />
          <SettingsRow
            icon={Shield}
            label="Linked Accounts"
            value="Internet Identity"
            onClick={() => {}}
          />
          <SettingsRow
            icon={Lock}
            label="Addresses"
            value="Delivery addresses"
            onClick={() => navigate({ to: "/dashboard/customer" })}
          />
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="प्राथमिकताएं / Preferences">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/60 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Languages className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Language / भाषा
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Currently: {language === "hi" ? "हिंदी" : "English"}
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
              {language === "hi" ? (
                <Check className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-green-500 shrink-0" />
              )}
            </div>
          </button>

          {/* Theme */}
          <SettingsRow
            icon={themeIcon}
            label="Appearance / थीम"
            value={themeLabel}
            onClick={() => setThemeDialogOpen(true)}
          />
        </SectionCard>

        {/* Shopping */}
        <SectionCard title="खरीदारी / Shopping">
          <SettingsRow
            icon={Heart}
            label="मेरी विश लिस्ट"
            value="Saved products"
            onClick={() => navigate({ to: "/wishlist" })}
          />
          <SettingsRow
            icon={ShoppingBag}
            label="मेरे ऑर्डर"
            value="Order history"
            onClick={() => navigate({ to: "/orders" })}
          />
          <SettingsRow
            icon={Ruler}
            label="मेरे माप"
            value="Measurement profiles"
            onClick={() => navigate({ to: "/dashboard/customer" })}
          />
        </SectionCard>

        {/* Account Settings */}
        <SectionCard title="रोल / Role">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Scissors className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Switch to Tailor Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {role === "tailor"
                  ? "🪡 Tailor mode active"
                  : "👤 Customer mode active"}
              </p>
            </div>
            <Switch
              checked={role === "tailor"}
              onCheckedChange={handleRoleToggle}
              aria-label="Switch to tailor mode"
            />
          </div>

          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Notifications / सूचनाएं</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Order updates, promotions
              </p>
            </div>
            <Switch
              checked={notificationsOn}
              onCheckedChange={handleNotificationToggle}
              aria-label="Toggle notifications"
            />
          </div>
        </SectionCard>

        {/* Support */}
        <SectionCard title="सहायता / Support">
          <SettingsRow
            icon={HelpCircle}
            label="Help & FAQ"
            value="Frequently asked questions"
            onClick={() => toast("Help center coming soon!")}
          />
          <SettingsRow
            icon={AlertCircle}
            label="Report a Problem"
            value="Contact support"
            onClick={() => toast("Support form coming soon!")}
          />
          <SettingsRow
            icon={Globe}
            label="About Fit Also"
            value="India's premier custom tailoring marketplace"
            onClick={() => {}}
          />
        </SectionCard>

        {/* Logout */}
        <SectionCard title="लॉगआउट">
          <SettingsRow
            icon={LogOut}
            label="लॉगआउट / Logout"
            danger
            onClick={handleLogout}
            rightElement={
              <span className="text-xs font-semibold text-red-500">
                Sign Out
              </span>
            }
          />
        </SectionCard>

        <p className="text-center text-xs text-muted-foreground py-4">
          © {new Date().getFullYear()} Fit Also. All rights reserved.
        </p>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>प्रोफ़ाइल संपादित करें</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>पूरा नाम / Full Name</Label>
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="आपका नाम..."
              />
            </div>
            <div>
              <Label>फ़ोन / Phone</Label>
              <Input
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                type="tel"
              />
            </div>
            <div>
              <Label>शहर / City</Label>
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
              रद्द करें
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
                toast.success("प्रोफ़ाइल सहेजी गई!");
                setProfileDialogOpen(false);
              }}
            >
              सहेजें
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Theme Selection Dialog */}
      <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>थीम चुनें / Choose Theme</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {(
              [
                {
                  mode: "light",
                  icon: Sun,
                  label: "Light Mode",
                  labelHi: "लाइट मोड",
                },
                {
                  mode: "dark",
                  icon: Moon,
                  label: "Dark Mode",
                  labelHi: "डार्क मोड",
                },
                {
                  mode: "system",
                  icon: Monitor,
                  label: "System Default",
                  labelHi: "सिस्टम",
                },
              ] as {
                mode: ThemeMode;
                icon: React.ElementType;
                label: string;
                labelHi: string;
              }[]
            ).map(({ mode, icon: Icon, label, labelHi }) => (
              <button
                key={mode}
                type="button"
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
                  <p className="text-xs text-muted-foreground">{labelHi}</p>
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

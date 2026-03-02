import { Switch } from "@/components/ui/switch";
import { useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function getStoredNotifications(): boolean {
  try {
    return localStorage.getItem("fitAlsoNotifications") !== "false";
  } catch {
    return true;
  }
}

export function NotificationSettingsPage() {
  const navigate = useNavigate();
  const [notificationsOn, setNotificationsOn] = useState(
    getStoredNotifications,
  );

  const handleToggle = (v: boolean) => {
    setNotificationsOn(v);
    try {
      localStorage.setItem("fitAlsoNotifications", String(v));
    } catch {}
    toast.success(
      v ? "Notifications chalu kar di gayi" : "Notifications band kar di gayi",
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <button
          type="button"
          onClick={() => navigate({ to: "/settings" })}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <Bell className="w-5 h-5" />
        <h1 className="text-lg font-bold tracking-wide">
          Notifications / सूचनाएं
        </h1>
      </div>

      <div className="px-4 pt-6">
        {/* Main toggle card */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              सूचना सेटिंग्स / Notification Settings
            </p>
          </div>
          <div className="px-4 py-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-base">
                  Push Notifications
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Order updates, promotions, and important alerts
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ऑर्डर अपडेट, प्रोमोशन और ज़रूरी अलर्ट
                </p>
              </div>
              <Switch
                checked={notificationsOn}
                onCheckedChange={handleToggle}
                className="mt-1"
              />
            </div>
            <div
              className={`mt-4 px-3 py-2.5 rounded-lg text-xs ${
                notificationsOn
                  ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {notificationsOn
                ? "✓ Notifications are ON — you will receive all updates"
                : "✗ Notifications are OFF — you won't receive any updates"}
            </div>
          </div>
        </div>

        {/* What you'll receive */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mt-3">
          <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              आपको क्या मिलेगा / What You'll Receive
            </p>
          </div>
          <div className="divide-y divide-border">
            {[
              {
                icon: "📦",
                title: "Order Updates",
                desc: "Status changes for your orders",
              },
              {
                icon: "🎉",
                title: "Promotions",
                desc: "Exclusive deals and offers",
              },
              {
                icon: "📏",
                title: "Measurement Reminders",
                desc: "Update your measurements",
              },
              {
                icon: "⭐",
                title: "New Collections",
                desc: "Latest designs from tailors",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

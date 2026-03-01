import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Download,
  Edit,
  Eye,
  Filter,
  Image as ImageIcon,
  IndianRupee,
  LayoutDashboard,
  MapPin,
  Menu,
  Package,
  Paintbrush,
  Palette,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings as SettingsIcon,
  ShoppingBag,
  Star,
  Tag,
  ToggleLeft,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
  XCircle,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApprovalStatus } from "../backend";
import { AdminCustomizationPanel } from "../components/AdminCustomizationPanel";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TailorProfile {
  id: string;
  shopName: string;
  ownerName: string;
  city: string;
  bio: string;
  specialties: string[];
  basePricing: number;
  turnaroundDays: number;
  isPremium: boolean;
  contactPhone: string;
  contactEmail: string;
  profileImageUrl: string;
  portfolioImages: string[];
  listings: Listing[];
  approvalStatus: string;
  createdAt: string;
}

interface Listing {
  id: string;
  tailorId: string;
  title: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  availableOptions: {
    neckStyles: string[];
    sleeveStyles: string[];
    fabricTypes: string[];
    colorPatterns: string[];
    workTypes: string[];
  };
}

interface Order {
  id: string;
  customerId: string;
  tailorId: string;
  listingId: string;
  listingTitle: string;
  category: string;
  customization: {
    neckStyle?: string;
    sleeveStyle?: string;
    fabricType?: string;
    colorPattern?: string;
    workType?: string;
  };
  measurementProfileName: string;
  measurementSnapshot: Record<string, number>;
  totalPrice: number;
  orderDate: string;
  status: string;
}

interface UserProfile {
  principalId: string;
  name: string;
  phone: string;
  city: string;
  preferredLanguage: string;
}

interface City {
  id: string;
  name: string;
}

interface FabricItem {
  id: string;
  label: string;
  imageUrl?: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  applicableCategories: string[];
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  targetAudience: "all" | "customers" | "tailors";
  createdAt: string;
  readBy: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Indore",
  "Bhopal",
  "Nagpur",
  "Surat",
  "Vadodara",
  "Kochi",
  "Coimbatore",
  "Visakhapatnam",
  "Thiruvananthapuram",
  "Patna",
  "Agra",
  "Varanasi",
  "Amritsar",
];

const DEFAULT_FABRICS: FabricItem[] = [
  { id: "1", label: "Cotton" },
  { id: "2", label: "Silk" },
  { id: "3", label: "Linen" },
  { id: "4", label: "Chiffon" },
  { id: "5", label: "Georgette" },
  { id: "6", label: "Velvet" },
  { id: "7", label: "Crepe" },
  { id: "8", label: "Satin" },
];

const DEFAULT_COLORS: FabricItem[] = [
  { id: "1", label: "Solid Red" },
  { id: "2", label: "Solid Blue" },
  { id: "3", label: "Floral Print" },
  { id: "4", label: "Geometric" },
  { id: "5", label: "Paisley" },
  { id: "6", label: "Stripes" },
  { id: "7", label: "Checks" },
  { id: "8", label: "Embroidered" },
];

const DEFAULT_WORK_TYPES: FabricItem[] = [
  { id: "1", label: "Zari Work" },
  { id: "2", label: "Mirror Work" },
  { id: "3", label: "Thread Embroidery" },
  { id: "4", label: "Sequin Work" },
  { id: "5", label: "Block Print" },
  { id: "6", label: "Tie & Dye" },
];

const ORDER_STATUSES = [
  "Order Placed",
  "Confirmed",
  "Assigned to Tailor",
  "Stitching Started",
  "Quality Check",
  "Dispatched",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const GARMENT_CATEGORIES = [
  "Saree Blouse",
  "Salwar Kameez",
  "Lehenga",
  "Kurta",
  "Sherwani",
  "Suit",
  "Dress",
  "Skirt",
];

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Customer Analytics", icon: BarChart3 },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "tailors", label: "Tailors", icon: Briefcase },
  { id: "products", label: "Products", icon: Package },
  { id: "revenue", label: "Revenue", icon: TrendingUp },
  { id: "cities", label: "Cities", icon: MapPin },
  { id: "fabrics", label: "Fabrics & Designs", icon: Palette },
  { id: "promotions", label: "Promotions", icon: Tag },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "images", label: "Image Manager", icon: ImageIcon },
  { id: "activity", label: "Activity Log", icon: Activity },
  { id: "settings", label: "Platform Settings", icon: SettingsIcon },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function initLocalStorage() {
  if (!localStorage.getItem("adminCities")) {
    const cities: City[] = DEFAULT_CITIES.map((name, i) => ({
      id: String(i + 1),
      name,
    }));
    localStorage.setItem("adminCities", JSON.stringify(cities));
  }
  if (!localStorage.getItem("adminFabrics")) {
    localStorage.setItem("adminFabrics", JSON.stringify(DEFAULT_FABRICS));
  }
  if (!localStorage.getItem("adminColors")) {
    localStorage.setItem("adminColors", JSON.stringify(DEFAULT_COLORS));
  }
  if (!localStorage.getItem("adminWorkTypes")) {
    localStorage.setItem("adminWorkTypes", JSON.stringify(DEFAULT_WORK_TYPES));
  }
  if (!localStorage.getItem("adminPromotions")) {
    localStorage.setItem("adminPromotions", JSON.stringify([]));
  }
  if (!localStorage.getItem("adminNotifications")) {
    localStorage.setItem("adminNotifications", JSON.stringify([]));
  }
}

function getAllTailors(): TailorProfile[] {
  const tailors: TailorProfile[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("tailor_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        if (data.id) tailors.push(data);
      } catch {}
    }
  }
  return tailors;
}

function getAllOrders(): Order[] {
  const orders: Order[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("orders_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(data)) orders.push(...data);
      } catch {}
    }
  }
  // Also check global orders key
  try {
    const globalOrders = JSON.parse(localStorage.getItem("allOrders") || "[]");
    if (Array.isArray(globalOrders)) orders.push(...globalOrders);
  } catch {}
  return orders;
}

function getAllUserProfiles(): UserProfile[] {
  const profiles: UserProfile[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("userProfile_") || key.startsWith("profile_"))) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        if (data.name || data.principalId) profiles.push(data);
      } catch {}
    }
  }
  return profiles;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "inTailoring":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "shipped":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ImageUploadButton({
  onImageSelected,
  label = "Replace Image",
}: {
  onImageSelected: (dataUrl: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (ev.target?.result) onImageSelected(ev.target.result as string);
          };
          reader.readAsDataURL(file);
          e.target.value = "";
        }}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-3 h-3 mr-1" /> {label}
      </Button>
    </>
  );
}

// ─── Section: Overview ────────────────────────────────────────────────────────

function OverviewSection({ approvals }: { approvals: any[] }) {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTailors: 0,
    activeTailors: 0,
    pendingTailors: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgOrderValue: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    const tailors = getAllTailors();
    const orders = getAllOrders();
    const profiles = getAllUserProfiles();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const totalRevenue = deliveredOrders.reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0,
    );
    const monthlyRevenue = deliveredOrders
      .filter((o) => {
        const d = new Date(o.orderDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const pendingApprovals = approvals.filter(
      (a) => a.status === "pending",
    ).length;

    setStats({
      totalCustomers: profiles.length,
      totalTailors: tailors.length,
      activeTailors: tailors.filter((t) => t.approvalStatus === "approved")
        .length,
      pendingTailors: tailors.filter((t) => t.approvalStatus === "pending")
        .length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      deliveredOrders: deliveredOrders.length,
      cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
      totalRevenue,
      monthlyRevenue,
      avgOrderValue:
        deliveredOrders.length > 0
          ? Math.round(totalRevenue / deliveredOrders.length)
          : 0,
      pendingApprovals,
    });
  }, [approvals]);

  const recentOrders = getAllOrders()
    .sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
    )
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Welcome back, Krishna! Here's your platform summary.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          subtitle="Registered users"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Tailors"
          value={stats.totalTailors}
          subtitle={`Active: ${stats.activeTailors} | Pending: ${stats.pendingTailors}`}
          icon={Briefcase}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle={`Pending: ${stats.pendingOrders} | Delivered: ${stats.deliveredOrders}`}
          icon={ShoppingBag}
          color="bg-orange-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle={`This month: ${formatCurrency(stats.monthlyRevenue)}`}
          icon={IndianRupee}
          color="bg-green-500"
        />
        <StatCard
          title="Avg Order Value"
          value={formatCurrency(stats.avgOrderValue)}
          subtitle="From delivered orders"
          icon={BarChart3}
          color="bg-teal-500"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          subtitle="Tailors awaiting review"
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title="Cancelled Orders"
          value={stats.cancelledOrders}
          subtitle="Total cancellations"
          icon={XCircle}
          color="bg-gray-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          subtitle="Current month earnings"
          icon={TrendingUp}
          color="bg-indigo-500"
        />
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No orders yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.id?.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {order.listingTitle || order.category || "N/A"}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(order.totalPrice || 0)}
                    </TableCell>
                    <TableCell>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString("en-IN")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Section: Customers ───────────────────────────────────────────────────────

function CustomersSection() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [editCustomer, setEditCustomer] = useState<UserProfile | null>(null);
  const [viewOrdersCustomer, setViewOrdersCustomer] =
    useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [search, setSearch] = useState("");

  const loadProfiles = useCallback(() => setProfiles(getAllUserProfiles()), []);
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const allOrders = getAllOrders();

  const getCustomerOrders = (customerId: string) =>
    allOrders.filter((o) => o.customerId === customerId);

  const getCustomerSpend = (customerId: string) =>
    getCustomerOrders(customerId)
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const filtered = profiles.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase()),
  );

  const saveEdit = () => {
    if (!editCustomer) return;
    const updated = { ...editCustomer, ...editForm };
    // Try both key patterns
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.includes(editCustomer.principalId || "") ||
          k.startsWith("userProfile_") ||
          k.startsWith("profile_"))
      ) {
        try {
          const d = JSON.parse(localStorage.getItem(k) || "{}");
          if (
            d.principalId === editCustomer.principalId ||
            d.name === editCustomer.name
          ) {
            localStorage.setItem(k, JSON.stringify(updated));
            break;
          }
        } catch {}
      }
    }
    setEditCustomer(null);
    loadProfiles();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customers Management</h2>
          <p className="text-muted-foreground">
            {profiles.length} registered customers
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.principalId || p.name}>
                    <TableCell className="font-medium">
                      {p.name || "N/A"}
                    </TableCell>
                    <TableCell>{p.city || "—"}</TableCell>
                    <TableCell>{p.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getCustomerOrders(p.principalId || "").length}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(getCustomerSpend(p.principalId || ""))}
                    </TableCell>
                    <TableCell>{p.preferredLanguage || "en"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditCustomer(p);
                            setEditForm(p);
                          }}
                        >
                          <Edit className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewOrdersCustomer(p)}
                        >
                          <Eye className="w-3 h-3 mr-1" /> Orders
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editCustomer} onOpenChange={() => setEditCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editForm.name || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={editForm.phone || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                value={editForm.city || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, city: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Language</Label>
              <Select
                value={editForm.preferredLanguage || "en"}
                onValueChange={(v) =>
                  setEditForm((f) => ({ ...f, preferredLanguage: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCustomer(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Orders Dialog */}
      <Dialog
        open={!!viewOrdersCustomer}
        onOpenChange={() => setViewOrdersCustomer(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Orders — {viewOrdersCustomer?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCustomerOrders(viewOrdersCustomer?.principalId || "").map(
                  (o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">
                        {o.id?.slice(0, 8)}
                      </TableCell>
                      <TableCell>{o.listingTitle || o.category}</TableCell>
                      <TableCell>{formatCurrency(o.totalPrice || 0)}</TableCell>
                      <TableCell>
                        {o.orderDate
                          ? new Date(o.orderDate).toLocaleDateString("en-IN")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(o.status)}`}
                        >
                          {o.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ),
                )}
                {getCustomerOrders(viewOrdersCustomer?.principalId || "")
                  .length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Section: Orders ──────────────────────────────────────────────────────────

function OrdersSection() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [orders, setOrders] = useState<Order[]>([]);
  const [backendOrders, setBackendOrders] = useState<
    import("../backend").ExtendedOrder[]
  >([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [viewBackendOrder, setViewBackendOrder] = useState<
    import("../backend").ExtendedOrder | null
  >(null);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  // biome-ignore lint/correctness/noUnusedVariables: setAdminNote is reserved for future admin note input UI
  const [adminNote, setAdminNote] = useState("");

  const loadOrders = useCallback(() => setOrders(getAllOrders()), []);
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Also fetch from backend
  useEffect(() => {
    if (!actor || !identity) return;
    actor
      .getAllExtendedOrders()
      .then((result) => setBackendOrders(result))
      .catch(() => {});
  }, [actor, identity]);

  const hasBackendOrders = backendOrders.length > 0;

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    // Try backend first
    if (actor && hasBackendOrders) {
      try {
        await actor.updateExtendedOrderStatus(
          orderId,
          newStatus,
          adminNote || "",
        );
        setBackendOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
        );
        logAdminAction(
          "Updated order status",
          "orders",
          `Order ${orderId.slice(0, 8)} → ${newStatus}`,
        );
        setUpdatingId(null);
        return;
      } catch {}
    }
    // Fallback: localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("orders_")) {
        try {
          const data: Order[] = JSON.parse(localStorage.getItem(key) || "[]");
          const idx = data.findIndex((o) => o.id === orderId);
          if (idx !== -1) {
            data[idx].status = newStatus;
            localStorage.setItem(key, JSON.stringify(data));
            break;
          }
        } catch {}
      }
    }
    try {
      const global: Order[] = JSON.parse(
        localStorage.getItem("allOrders") || "[]",
      );
      const idx = global.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        global[idx].status = newStatus;
        localStorage.setItem("allOrders", JSON.stringify(global));
      }
    } catch {}
    loadOrders();
    setUpdatingId(null);
  };

  // Use backend orders if available, else local
  const displayOrders = hasBackendOrders
    ? backendOrders
        .filter((o) => statusFilter === "all" || o.status === statusFilter)
        .filter(
          (o) =>
            o.id?.toLowerCase().includes(search.toLowerCase()) ||
            o.listingTitle?.toLowerCase().includes(search.toLowerCase()) ||
            o.category?.toLowerCase().includes(search.toLowerCase()) ||
            o.customerName?.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => {
          const da = Number(a.orderDate);
          const db = Number(b.orderDate);
          return sortDir === "desc" ? db - da : da - db;
        })
    : orders
        .filter((o) => statusFilter === "all" || o.status === statusFilter)
        .filter(
          (o) =>
            o.id?.toLowerCase().includes(search.toLowerCase()) ||
            o.listingTitle?.toLowerCase().includes(search.toLowerCase()) ||
            o.category?.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => {
          const da = new Date(a.orderDate).getTime();
          const db = new Date(b.orderDate).getTime();
          return sortDir === "desc" ? db - da : da - db;
        });

  const totalOrderCount = hasBackendOrders
    ? backendOrders.length
    : orders.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Orders Management</h2>
          <p className="text-muted-foreground">
            {totalOrderCount} total orders{" "}
            {hasBackendOrders ? "(Live)" : "(Local)"}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9 w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />{" "}
            {sortDir === "desc" ? "Newest" : "Oldest"}
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Change Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : hasBackendOrders ? (
                  (displayOrders as import("../backend").ExtendedOrder[]).map(
                    (order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">
                          {order.id?.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="max-w-[120px] truncate">
                          {order.listingTitle || "N/A"}
                        </TableCell>
                        <TableCell>{order.category || "—"}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(order.totalPrice || 0)}
                        </TableCell>
                        <TableCell>
                          {new Date(Number(order.orderDate)).toLocaleDateString(
                            "en-IN",
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(v) =>
                              updateOrderStatus(order.id, v)
                            }
                            disabled={updatingId === order.id}
                          >
                            <SelectTrigger className="w-32 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ORDER_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewBackendOrder(order)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )
                ) : (
                  (displayOrders as Order[]).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id?.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        {order.listingTitle || "N/A"}
                      </TableCell>
                      <TableCell>{order.category || "—"}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.totalPrice || 0)}
                      </TableCell>
                      <TableCell>
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString(
                              "en-IN",
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) => updateOrderStatus(order.id, v)}
                        >
                          <SelectTrigger className="w-32 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewOrder(order)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Local Order Detail Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Order ID</Label>
                    <p className="font-mono text-sm">{viewOrder.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewOrder.status)}`}
                    >
                      {viewOrder.status}
                    </span>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Item</Label>
                    <p>{viewOrder.listingTitle || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p>{viewOrder.category || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <p className="font-bold text-green-600">
                      {formatCurrency(viewOrder.totalPrice || 0)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Order Date</Label>
                    <p>
                      {viewOrder.orderDate
                        ? new Date(viewOrder.orderDate).toLocaleDateString(
                            "en-IN",
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-muted-foreground font-semibold">
                    Customization
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(viewOrder.customization || {}).map(
                      ([k, v]) => (
                        <div key={k} className="bg-muted rounded p-2">
                          <p className="text-xs text-muted-foreground capitalize">
                            {k.replace(/([A-Z])/g, " $1")}
                          </p>
                          <p className="text-sm font-medium">{v as string}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Backend Order Detail Dialog */}
      <Dialog
        open={!!viewBackendOrder}
        onOpenChange={() => setViewBackendOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details (Live)</DialogTitle>
          </DialogHeader>
          {viewBackendOrder && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Order ID</Label>
                    <p className="font-mono text-xs break-all">
                      {viewBackendOrder.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewBackendOrder.status)}`}
                    >
                      {viewBackendOrder.status}
                    </span>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Customer</Label>
                    <p className="font-medium">
                      {viewBackendOrder.customerName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p>{viewBackendOrder.customerPhone || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Item</Label>
                    <p>{viewBackendOrder.listingTitle || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p>{viewBackendOrder.category || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <p className="font-bold text-green-600">
                      {formatCurrency(viewBackendOrder.totalPrice || 0)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payment</Label>
                    <p className="text-yellow-600 font-semibold">
                      {viewBackendOrder.paymentMode || "COD"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Order Date</Label>
                    <p>
                      {new Date(
                        Number(viewBackendOrder.orderDate),
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Est. Delivery
                    </Label>
                    <p>
                      {viewBackendOrder.estimatedDeliveryDate || "10-14 days"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-muted-foreground font-semibold">
                    Delivery Address
                  </Label>
                  <p className="mt-1 text-sm">
                    {[
                      viewBackendOrder.deliveryAddress.houseNo,
                      viewBackendOrder.deliveryAddress.area,
                      viewBackendOrder.deliveryAddress.city,
                      viewBackendOrder.deliveryAddress.state,
                      viewBackendOrder.deliveryAddress.pinCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                {viewBackendOrder.adminNotes && (
                  <div>
                    <Label className="text-muted-foreground font-semibold">
                      Admin Notes
                    </Label>
                    <p className="text-sm mt-1">
                      {viewBackendOrder.adminNotes}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground font-semibold">
                    Update Status
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Select
                      value={viewBackendOrder.status}
                      onValueChange={async (v) => {
                        await updateOrderStatus(viewBackendOrder.id, v);
                        setViewBackendOrder((prev) =>
                          prev ? { ...prev, status: v } : null,
                        );
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Section: Tailors ─────────────────────────────────────────────────────────

function TailorsSection({
  approvals,
  onRefreshApprovals,
}: { approvals: any[]; onRefreshApprovals: () => void }) {
  const { actor } = useActor();
  const [tailors, setTailors] = useState<TailorProfile[]>([]);
  const [editTailor, setEditTailor] = useState<TailorProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<TailorProfile>>({});
  const [search, setSearch] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const loadTailors = useCallback(() => setTailors(getAllTailors()), []);
  useEffect(() => {
    loadTailors();
  }, [loadTailors]);

  const allOrders = getAllOrders();

  const getTailorOrders = (tailorId: string) =>
    allOrders.filter((o) => o.tailorId === tailorId);
  const getTailorEarnings = (tailorId: string) =>
    getTailorOrders(tailorId)
      .filter((o) => o.status === "delivered")
      .reduce((s, o) => s + (o.totalPrice || 0), 0);

  const getApprovalStatus = (tailorId: string) => {
    const approval = approvals.find(
      (a) => a.principal?.toString() === tailorId,
    );
    return approval?.status || "pending";
  };

  const handleApprovalToggle = async (tailor: TailorProfile) => {
    if (!actor) return;
    const currentStatus = getApprovalStatus(tailor.id);
    const newStatus =
      currentStatus === "approved"
        ? ApprovalStatus.rejected
        : ApprovalStatus.approved;
    setApprovingId(tailor.id);
    try {
      const { Principal } = await import("@dfinity/principal");
      await actor.setApproval(Principal.fromText(tailor.id), newStatus);
      onRefreshApprovals();
    } catch (e) {
      console.error("Approval error:", e);
    } finally {
      setApprovingId(null);
    }
  };

  const saveTailorEdit = () => {
    if (!editTailor) return;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("tailor_")) {
        try {
          const d = JSON.parse(localStorage.getItem(key) || "{}");
          if (d.id === editTailor.id) {
            localStorage.setItem(key, JSON.stringify({ ...d, ...editForm }));
            break;
          }
        } catch {}
      }
    }
    setEditTailor(null);
    loadTailors();
  };

  const replaceProfileImage = (tailor: TailorProfile, dataUrl: string) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("tailor_")) {
        try {
          const d = JSON.parse(localStorage.getItem(key) || "{}");
          if (d.id === tailor.id) {
            d.profileImageUrl = dataUrl;
            localStorage.setItem(key, JSON.stringify(d));
            break;
          }
        } catch {}
      }
    }
    loadTailors();
  };

  const filtered = tailors.filter(
    (t) =>
      t.shopName?.toLowerCase().includes(search.toLowerCase()) ||
      t.city?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Tailors Management</h2>
          <p className="text-muted-foreground">
            {tailors.length} registered tailors
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tailors..."
            className="pl-9 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No tailors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((tailor) => {
                    const status = getApprovalStatus(tailor.id);
                    return (
                      <TableRow key={tailor.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                            {tailor.profileImageUrl ? (
                              <img
                                src={tailor.profileImageUrl}
                                alt={tailor.shopName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Briefcase className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {tailor.shopName || "N/A"}
                        </TableCell>
                        <TableCell>{tailor.ownerName || "—"}</TableCell>
                        <TableCell>{tailor.city || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getTailorOrders(tailor.id).length}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(getTailorEarnings(tailor.id))}
                        </TableCell>
                        <TableCell>
                          {tailor.isPremium ? (
                            <Badge className="bg-yellow-500">Premium</Badge>
                          ) : (
                            <Badge variant="outline">Standard</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              status === "approved"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }`}
                          >
                            {status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditTailor(tailor);
                                setEditForm(tailor);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant={
                                status === "approved"
                                  ? "destructive"
                                  : "default"
                              }
                              onClick={() => handleApprovalToggle(tailor)}
                              disabled={approvingId === tailor.id}
                            >
                              {approvingId === tailor.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : status === "approved" ? (
                                <XCircle className="w-3 h-3" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </Button>
                            <ImageUploadButton
                              label=""
                              onImageSelected={(url) =>
                                replaceProfileImage(tailor, url)
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Tailor Dialog */}
      <Dialog open={!!editTailor} onOpenChange={() => setEditTailor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tailor — {editTailor?.shopName}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Shop Name</Label>
                  <Input
                    value={editForm.shopName || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, shopName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Owner Name</Label>
                  <Input
                    value={editForm.ownerName || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, ownerName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    value={editForm.city || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, city: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={editForm.contactPhone || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        contactPhone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    value={editForm.contactEmail || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        contactEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Base Pricing (₹)</Label>
                  <Input
                    type="number"
                    value={editForm.basePricing || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        basePricing: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Turnaround Days</Label>
                  <Input
                    type="number"
                    value={editForm.turnaroundDays || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        turnaroundDays: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={!!editForm.isPremium}
                    onCheckedChange={(v) =>
                      setEditForm((f) => ({ ...f, isPremium: v }))
                    }
                  />
                  <Label>Premium Status</Label>
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={editForm.bio || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, bio: e.target.value }))
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Specialties (comma-separated)</Label>
                <Input
                  value={(editForm.specialties || []).join(", ")}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      specialties: e.target.value
                        .split(",")
                        .map((s) => s.trim()),
                    }))
                  }
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTailor(null)}>
              Cancel
            </Button>
            <Button onClick={saveTailorEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Section: Products ────────────────────────────────────────────────────────

function ProductsSection() {
  const [listings, setListings] = useState<
    (Listing & { tailorName: string })[]
  >([]);
  const [editListing, setEditListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState<Partial<Listing>>({});
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [search, setSearch] = useState("");

  const loadListings = useCallback(() => {
    const tailors = getAllTailors();
    const all: (Listing & { tailorName: string })[] = [];
    for (const t of tailors) {
      for (const l of t.listings || []) {
        all.push({ ...l, tailorName: t.shopName || t.ownerName || "Unknown" });
      }
    }
    setListings(all);
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const updateListingInStorage = (
    listing: Listing,
    updates: Partial<Listing>,
  ) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("tailor_")) {
        try {
          const tailor: TailorProfile = JSON.parse(
            localStorage.getItem(key) || "{}",
          );
          const idx = (tailor.listings || []).findIndex(
            (l) => l.id === listing.id,
          );
          if (idx !== -1) {
            tailor.listings[idx] = { ...tailor.listings[idx], ...updates };
            localStorage.setItem(key, JSON.stringify(tailor));
            break;
          }
        } catch {}
      }
    }
    loadListings();
  };

  const deleteListing = (listing: Listing) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("tailor_")) {
        try {
          const tailor: TailorProfile = JSON.parse(
            localStorage.getItem(key) || "{}",
          );
          const idx = (tailor.listings || []).findIndex(
            (l) => l.id === listing.id,
          );
          if (idx !== -1) {
            tailor.listings.splice(idx, 1);
            localStorage.setItem(key, JSON.stringify(tailor));
            break;
          }
        } catch {}
      }
    }
    setDeleteTarget(null);
    loadListings();
  };

  const filtered = listings.filter(
    (l) =>
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.category?.toLowerCase().includes(search.toLowerCase()) ||
      l.tailorName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Products & Catalog</h2>
          <p className="text-muted-foreground">
            {listings.length} total listings
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No products found
          </div>
        ) : (
          filtered.map((listing) => (
            <Card
              key={listing.id}
              className="border-0 shadow-md overflow-hidden"
            >
              <div className="relative h-40 bg-muted">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {listing.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-semibold text-sm truncate">
                  {listing.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {listing.tailorName}
                </p>
                <p className="font-bold text-primary mt-1">
                  {formatCurrency(listing.price || 0)}
                </p>
                <div className="flex gap-1 mt-3 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => {
                      setEditListing(listing);
                      setEditForm(listing);
                    }}
                  >
                    <Edit className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <ImageUploadButton
                    label="Img"
                    onImageSelected={(url) =>
                      updateListingInStorage(listing, { imageUrl: url })
                    }
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteTarget(listing)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Listing Dialog */}
      <Dialog open={!!editListing} onOpenChange={() => setEditListing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editForm.title || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={editForm.price || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      price: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={editForm.category || ""}
                  onValueChange={(v) =>
                    setEditForm((f) => ({ ...f, category: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GARMENT_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditListing(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editListing) updateListingInStorage(editListing, editForm);
                setEditListing(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteTarget?.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteListing(deleteTarget)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Section: Revenue ─────────────────────────────────────────────────────────

function RevenueSection() {
  const orders = getAllOrders();
  const tailors = getAllTailors();
  const profiles = getAllUserProfiles();

  const delivered = orders.filter((o) => o.status === "delivered");
  const totalRevenue = delivered.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const avgOrderValue =
    delivered.length > 0 ? Math.round(totalRevenue / delivered.length) : 0;

  // Monthly breakdown
  const monthlyMap: Record<string, number> = {};
  for (const o of delivered) {
    if (!o.orderDate) continue;
    const d = new Date(o.orderDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + (o.totalPrice || 0);
  }
  const monthly = Object.entries(monthlyMap)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 12);

  // Top tailors
  const tailorEarnings: Record<string, number> = {};
  for (const o of delivered) {
    tailorEarnings[o.tailorId] =
      (tailorEarnings[o.tailorId] || 0) + (o.totalPrice || 0);
  }
  const topTailors = Object.entries(tailorEarnings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, earnings]) => {
      const t = tailors.find((t) => t.id === id);
      return { name: t?.shopName || t?.ownerName || id.slice(0, 8), earnings };
    });

  // Top customers
  const customerSpend: Record<string, number> = {};
  for (const o of delivered) {
    customerSpend[o.customerId] =
      (customerSpend[o.customerId] || 0) + (o.totalPrice || 0);
  }
  const topCustomers = Object.entries(customerSpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, spend]) => {
      const p = profiles.find((p) => p.principalId === id);
      return { name: p?.name || id.slice(0, 8), spend };
    });

  // Status funnel
  const statusCounts: Record<string, number> = {};
  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Revenue & Analytics</h2>
        <p className="text-muted-foreground">
          Platform-wide earnings and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="From delivered orders"
          icon={IndianRupee}
          color="bg-green-500"
        />
        <StatCard
          title="Total Delivered"
          value={delivered.length}
          subtitle="Completed orders"
          icon={CheckCircle}
          color="bg-blue-500"
        />
        <StatCard
          title="Avg Order Value"
          value={formatCurrency(avgOrderValue)}
          subtitle="Per delivered order"
          icon={BarChart3}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {monthly.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No revenue data yet
              </p>
            ) : (
              <div className="space-y-2">
                {monthly.map(([month, amount]) => {
                  const pct =
                    totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
                  return (
                    <div key={month} className="flex items-center gap-3">
                      <span className="text-sm w-20 text-muted-foreground">
                        {month}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-24 text-right">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Funnel */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ORDER_STATUSES.map((status) => {
                const count = statusCounts[status] || 0;
                const pct =
                  orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border w-24 text-center ${getStatusColor(status)}`}
                    >
                      {status}
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Tailors */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Top 5 Tailors by Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            {topTailors.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No data yet
              </p>
            ) : (
              <div className="space-y-3">
                {topTailors.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-medium">{t.name}</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(t.earnings)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Top 5 Customers by Spend</CardTitle>
          </CardHeader>
          <CardContent>
            {topCustomers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No data yet
              </p>
            ) : (
              <div className="space-y-3">
                {topCustomers.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-medium">{c.name}</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(c.spend)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Section: Cities ──────────────────────────────────────────────────────────

function CitiesSection() {
  const [cities, setCities] = useState<City[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editCity, setEditCity] = useState<City | null>(null);
  const [deleteCity, setDeleteCity] = useState<City | null>(null);
  const [newCityName, setNewCityName] = useState("");
  const [editCityName, setEditCityName] = useState("");
  const [search, setSearch] = useState("");

  const loadCities = useCallback(() => {
    const data = JSON.parse(localStorage.getItem("adminCities") || "[]");
    setCities(data);
  }, []);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  const saveCities = (updated: City[]) => {
    localStorage.setItem("adminCities", JSON.stringify(updated));
    setCities(updated);
  };

  const addCity = () => {
    if (!newCityName.trim()) return;
    saveCities([...cities, { id: generateId(), name: newCityName.trim() }]);
    setNewCityName("");
    setAddOpen(false);
  };

  const updateCity = () => {
    if (!editCity || !editCityName.trim()) return;
    saveCities(
      cities.map((c) =>
        c.id === editCity.id ? { ...c, name: editCityName.trim() } : c,
      ),
    );
    setEditCity(null);
  };

  const removeCity = (city: City) => {
    saveCities(cities.filter((c) => c.id !== city.id));
    setDeleteCity(null);
  };

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Cities Management</h2>
          <p className="text-muted-foreground">
            {cities.length} cities configured
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cities..."
              className="pl-9 w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add City
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((city) => (
          <Card
            key={city.id}
            className="border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{city.name}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setEditCity(city);
                    setEditCityName(city.name);
                  }}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={() => setDeleteCity(city)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New City</DialogTitle>
          </DialogHeader>
          <div>
            <Label>City Name</Label>
            <Input
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="e.g. Mysore"
              onKeyDown={(e) => e.key === "Enter" && addCity()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCity}>Add City</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editCity} onOpenChange={() => setEditCity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit City</DialogTitle>
          </DialogHeader>
          <div>
            <Label>City Name</Label>
            <Input
              value={editCityName}
              onChange={(e) => setEditCityName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateCity()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCity(null)}>
              Cancel
            </Button>
            <Button onClick={updateCity}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCity} onOpenChange={() => setDeleteCity(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete City?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove "{deleteCity?.name}" from the cities list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCity && removeCity(deleteCity)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Section: Fabrics & Designs ───────────────────────────────────────────────

function FabricsSection() {
  const [fabrics, setFabrics] = useState<FabricItem[]>([]);
  const [colors, setColors] = useState<FabricItem[]>([]);
  const [workTypes, setWorkTypes] = useState<FabricItem[]>([]);
  const [addDialog, setAddDialog] = useState<{
    type: "fabrics" | "colors" | "workTypes";
    open: boolean;
  } | null>(null);
  const [editItem, setEditItem] = useState<{
    item: FabricItem;
    type: string;
  } | null>(null);
  const [deleteItem, setDeleteItem] = useState<{
    item: FabricItem;
    type: string;
  } | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [editLabel, setEditLabel] = useState("");

  const load = useCallback(() => {
    setFabrics(JSON.parse(localStorage.getItem("adminFabrics") || "[]"));
    setColors(JSON.parse(localStorage.getItem("adminColors") || "[]"));
    setWorkTypes(JSON.parse(localStorage.getItem("adminWorkTypes") || "[]"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getList = (type: string) =>
    type === "fabrics" ? fabrics : type === "colors" ? colors : workTypes;
  const setList = (type: string, items: FabricItem[]) => {
    localStorage.setItem(
      `admin${type.charAt(0).toUpperCase() + type.slice(1)}`,
      JSON.stringify(items),
    );
    if (type === "fabrics") setFabrics(items);
    else if (type === "colors") setColors(items);
    else setWorkTypes(items);
  };

  const addItem = () => {
    if (!addDialog || !newLabel.trim()) return;
    const list = getList(addDialog.type);
    setList(addDialog.type, [
      ...list,
      { id: generateId(), label: newLabel.trim() },
    ]);
    setNewLabel("");
    setAddDialog(null);
  };

  const updateItem = () => {
    if (!editItem || !editLabel.trim()) return;
    const list = getList(editItem.type);
    setList(
      editItem.type,
      list.map((i) =>
        i.id === editItem.item.id ? { ...i, label: editLabel.trim() } : i,
      ),
    );
    setEditItem(null);
  };

  const removeItem = () => {
    if (!deleteItem) return;
    const list = getList(deleteItem.type);
    setList(
      deleteItem.type,
      list.filter((i) => i.id !== deleteItem.item.id),
    );
    setDeleteItem(null);
  };

  const replaceItemImage = (
    item: FabricItem,
    type: string,
    dataUrl: string,
  ) => {
    const list = getList(type);
    setList(
      type,
      list.map((i) => (i.id === item.id ? { ...i, imageUrl: dataUrl } : i)),
    );
  };

  const renderList = (
    items: FabricItem[],
    type: "fabrics" | "colors" | "workTypes",
    title: string,
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Button size="sm" onClick={() => setAddDialog({ type, open: true })}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.label}
                className="w-10 h-10 rounded object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                <Palette className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            <span className="flex-1 font-medium">{item.label}</span>
            <div className="flex gap-1">
              <ImageUploadButton
                label=""
                onImageSelected={(url) => replaceItemImage(item, type, url)}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditItem({ item, type });
                  setEditLabel(item.label);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => setDeleteItem({ item, type })}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-4">
            No items yet
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Fabrics, Designs & Colors</h2>
        <p className="text-muted-foreground">
          Manage customization options for garments
        </p>
      </div>

      <Tabs defaultValue="fabrics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fabrics">Fabrics ({fabrics.length})</TabsTrigger>
          <TabsTrigger value="colors">
            Colors/Patterns ({colors.length})
          </TabsTrigger>
          <TabsTrigger value="workTypes">
            Work Types ({workTypes.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fabrics" className="mt-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              {renderList(fabrics, "fabrics", "Fabric Types")}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="colors" className="mt-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              {renderList(colors, "colors", "Colors & Patterns")}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="workTypes" className="mt-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              {renderList(workTypes, "workTypes", "Work Types")}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!addDialog} onOpenChange={() => setAddDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Label</Label>
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Enter name..."
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(null)}>
              Cancel
            </Button>
            <Button onClick={addItem}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Label</Label>
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateItem()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Cancel
            </Button>
            <Button onClick={updateItem}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove "{deleteItem?.item.label}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeItem}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Section: Promotions ──────────────────────────────────────────────────────

function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editPromo, setEditPromo] = useState<Promotion | null>(null);
  const [deletePromo, setDeletePromo] = useState<Promotion | null>(null);
  const [form, setForm] = useState<Partial<Promotion>>({
    discountType: "percentage",
    isActive: true,
    applicableCategories: [],
  });

  const load = useCallback(() => {
    setPromotions(JSON.parse(localStorage.getItem("adminPromotions") || "[]"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = (updated: Promotion[]) => {
    localStorage.setItem("adminPromotions", JSON.stringify(updated));
    setPromotions(updated);
  };

  const addPromo = () => {
    const promo: Promotion = {
      id: generateId(),
      title: form.title || "",
      description: form.description || "",
      discountType: form.discountType || "percentage",
      discountValue: form.discountValue || 0,
      applicableCategories: form.applicableCategories || [],
      validFrom: form.validFrom || new Date().toISOString().split("T")[0],
      validUntil: form.validUntil || new Date().toISOString().split("T")[0],
      isActive: form.isActive ?? true,
    };
    save([...promotions, promo]);
    setForm({
      discountType: "percentage",
      isActive: true,
      applicableCategories: [],
    });
    setAddOpen(false);
  };

  const updatePromo = () => {
    if (!editPromo) return;
    save(
      promotions.map((p) =>
        p.id === editPromo.id ? ({ ...editPromo, ...form } as Promotion) : p,
      ),
    );
    setEditPromo(null);
  };

  const toggleActive = (id: string) => {
    save(
      promotions.map((p) =>
        p.id === id ? { ...p, isActive: !p.isActive } : p,
      ),
    );
  };

  const PromoForm = () => (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={form.title || ""}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Discount Type</Label>
          <Select
            value={form.discountType || "percentage"}
            onValueChange={(v) =>
              setForm((f) => ({
                ...f,
                discountType: v as "percentage" | "flat",
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="flat">Flat (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Discount Value</Label>
          <Input
            type="number"
            value={form.discountValue || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))
            }
          />
        </div>
        <div>
          <Label>Valid From</Label>
          <Input
            type="date"
            value={form.validFrom || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, validFrom: e.target.value }))
            }
          />
        </div>
        <div>
          <Label>Valid Until</Label>
          <Input
            type="date"
            value={form.validUntil || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, validUntil: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={!!form.isActive}
          onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
        />
        <Label>Active</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Promotions & Discounts</h2>
          <p className="text-muted-foreground">
            {promotions.filter((p) => p.isActive).length} active promotions
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({
              discountType: "percentage",
              isActive: true,
              applicableCategories: [],
            });
            setAddOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Create Promotion
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No promotions yet
                  </TableCell>
                </TableRow>
              ) : (
                promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <p className="font-medium">{promo.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {promo.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {promo.discountType === "percentage"
                          ? `${promo.discountValue}% off`
                          : `₹${promo.discountValue} off`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <p>{promo.validFrom}</p>
                      <p className="text-muted-foreground">
                        to {promo.validUntil}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={promo.isActive}
                        onCheckedChange={() => toggleActive(promo.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditPromo(promo);
                            setForm(promo);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => setDeletePromo(promo)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Promotion</DialogTitle>
          </DialogHeader>
          <PromoForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addPromo}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPromo} onOpenChange={() => setEditPromo(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
          </DialogHeader>
          <PromoForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPromo(null)}>
              Cancel
            </Button>
            <Button onClick={updatePromo}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletePromo}
        onOpenChange={() => setDeletePromo(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove "{deletePromo?.title}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletePromo) {
                  save(promotions.filter((p) => p.id !== deletePromo.id));
                  setDeletePromo(null);
                }
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────

function NotificationsSection() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [form, setForm] = useState({
    title: "",
    body: "",
    targetAudience: "all" as "all" | "customers" | "tailors",
  });
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    setNotifications(
      JSON.parse(localStorage.getItem("adminNotifications") || "[]"),
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const broadcast = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSending(true);
    const notif: Notification = {
      id: generateId(),
      title: form.title,
      body: form.body,
      targetAudience: form.targetAudience,
      createdAt: new Date().toISOString(),
      readBy: [],
    };
    const updated = [notif, ...notifications];
    localStorage.setItem("adminNotifications", JSON.stringify(updated));
    setNotifications(updated);
    setForm({ title: "", body: "", targetAudience: "all" });
    setSending(false);
  };

  const deleteNotif = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    localStorage.setItem("adminNotifications", JSON.stringify(updated));
    setNotifications(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notifications Management</h2>
        <p className="text-muted-foreground">
          Broadcast messages to users and tailors
        </p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Compose Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Notification title..."
            />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Write your message..."
              rows={4}
            />
          </div>
          <div>
            <Label>Target Audience</Label>
            <Select
              value={form.targetAudience}
              onValueChange={(v) =>
                setForm((f) => ({
                  ...f,
                  targetAudience: v as "all" | "customers" | "tailors",
                }))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="customers">Customers Only</SelectItem>
                <SelectItem value="tailors">Tailors Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={broadcast}
            disabled={sending || !form.title.trim() || !form.body.trim()}
          >
            {sending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Broadcast Notification
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">
            Sent Notifications ({notifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No notifications sent yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Read By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {n.body}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          n.targetAudience === "all" ? "default" : "secondary"
                        }
                      >
                        {n.targetAudience}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(n.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{n.readBy.length} read</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteNotif(n.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Section: Image Manager ───────────────────────────────────────────────────

function ImageManagerSection() {
  const [tailors, setTailors] = useState<TailorProfile[]>([]);
  const [fabrics, setFabrics] = useState<FabricItem[]>([]);
  const [heroBanner, setHeroBanner] = useState<string>("");
  // biome-ignore lint/correctness/noUnusedVariables: forceUpdate reserved for manual re-render trigger
  const [, forceUpdate] = useState(0);

  const load = useCallback(() => {
    setTailors(getAllTailors());
    setFabrics(JSON.parse(localStorage.getItem("adminFabrics") || "[]"));
    setHeroBanner(localStorage.getItem("homeHeroBannerUrl") || "");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateTailorImage = (tailorId: string, dataUrl: string) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("tailor_")) {
        try {
          const d = JSON.parse(localStorage.getItem(key) || "{}");
          if (d.id === tailorId) {
            d.profileImageUrl = dataUrl;
            localStorage.setItem(key, JSON.stringify(d));
            break;
          }
        } catch {}
      }
    }
    load();
  };

  const updateListingImage = (listingId: string, dataUrl: string) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("tailor_")) {
        try {
          const d: TailorProfile = JSON.parse(
            localStorage.getItem(key) || "{}",
          );
          const idx = (d.listings || []).findIndex((l) => l.id === listingId);
          if (idx !== -1) {
            d.listings[idx].imageUrl = dataUrl;
            localStorage.setItem(key, JSON.stringify(d));
            break;
          }
        } catch {}
      }
    }
    load();
  };

  const updateFabricImage = (fabricId: string, dataUrl: string) => {
    const updated = fabrics.map((f) =>
      f.id === fabricId ? { ...f, imageUrl: dataUrl } : f,
    );
    localStorage.setItem("adminFabrics", JSON.stringify(updated));
    setFabrics(updated);
  };

  const updateHeroBanner = (dataUrl: string) => {
    localStorage.setItem("homeHeroBannerUrl", dataUrl);
    setHeroBanner(dataUrl);
  };

  const allListings = tailors.flatMap((t) =>
    (t.listings || []).map((l) => ({
      ...l,
      tailorName: t.shopName || t.ownerName,
    })),
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Image Manager</h2>
        <p className="text-muted-foreground">
          Replace any image across the platform
        </p>
      </div>

      {/* Homepage Banner */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" /> Homepage Banner
        </h3>
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
          <div className="w-32 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
            <img
              src={
                heroBanner || "/assets/generated/hero-banner.dim_1440x560.png"
              }
              alt="Hero Banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">Hero Banner</p>
            <p className="text-sm text-muted-foreground mb-2">
              Main homepage banner image
            </p>
            <ImageUploadButton
              label="Replace Banner"
              onImageSelected={updateHeroBanner}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Tailor Profile Photos */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Briefcase className="w-5 h-5" /> Tailor Profile Photos (
          {tailors.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tailors.map((tailor) => (
            <div key={tailor.id} className="text-center space-y-2">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
                {tailor.profileImageUrl ? (
                  <img
                    src={tailor.profileImageUrl}
                    alt={tailor.shopName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-xs font-medium truncate">
                {tailor.shopName || tailor.ownerName}
              </p>
              <ImageUploadButton
                label="Replace"
                onImageSelected={(url) => updateTailorImage(tailor.id, url)}
              />
            </div>
          ))}
          {tailors.length === 0 && (
            <p className="col-span-full text-muted-foreground text-center py-4">
              No tailors registered
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Product Listing Images */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Package className="w-5 h-5" /> Product Listing Images (
          {allListings.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allListings.map((listing) => (
            <div key={listing.id} className="text-center space-y-2">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-xs font-medium truncate">{listing.title}</p>
              <p className="text-xs text-muted-foreground">
                {listing.tailorName}
              </p>
              <ImageUploadButton
                label="Replace"
                onImageSelected={(url) => updateListingImage(listing.id, url)}
              />
            </div>
          ))}
          {allListings.length === 0 && (
            <p className="col-span-full text-muted-foreground text-center py-4">
              No product listings
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Fabric Swatches */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Palette className="w-5 h-5" /> Fabric Swatches ({fabrics.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {fabrics.map((fabric) => (
            <div key={fabric.id} className="text-center space-y-2">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
                {fabric.imageUrl ? (
                  <img
                    src={fabric.imageUrl}
                    alt={fabric.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-xs font-medium">{fabric.label}</p>
              <ImageUploadButton
                label="Replace"
                onImageSelected={(url) => updateFabricImage(fabric.id, url)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Helper: Activity Log ─────────────────────────────────────────────────────

interface ActivityLogEntry {
  id: string;
  action: string;
  adminEmail: string;
  timestamp: string;
  section: string;
  details?: string;
}

function logAdminAction(action: string, section: string, details?: string) {
  try {
    const log: ActivityLogEntry[] = JSON.parse(
      localStorage.getItem("adminActivityLog") || "[]",
    );
    const adminEmail =
      localStorage.getItem("adminEmail") || "FUTURETAILORSFORYOU@gmail.com";
    const entry: ActivityLogEntry = {
      id: generateId(),
      action,
      adminEmail,
      timestamp: new Date().toISOString(),
      section,
      details: details || "",
    };
    const updated = [entry, ...log].slice(0, 200); // keep last 200
    localStorage.setItem("adminActivityLog", JSON.stringify(updated));
  } catch {}
}

// ─── Section: Activity Log ────────────────────────────────────────────────────

function ActivityLogSection() {
  const [log, setLog] = useState<ActivityLogEntry[]>([]);

  const load = useCallback(() => {
    try {
      setLog(JSON.parse(localStorage.getItem("adminActivityLog") || "[]"));
    } catch {
      setLog([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clearLog = () => {
    localStorage.removeItem("adminActivityLog");
    setLog([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Activity Log</h2>
          <p className="text-muted-foreground">
            Track all admin actions on the platform
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={clearLog}
          disabled={log.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Clear Log
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {log.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No activity recorded yet</p>
              <p className="text-xs mt-1">
                Actions taken in Orders, Products, and other sections will
                appear here
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[550px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {log.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-xs font-mono truncate max-w-[140px]">
                        {entry.adminEmail}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {entry.section}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {entry.action}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {entry.details || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Section: Platform Settings ───────────────────────────────────────────────

function PlatformSettingsSection() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("");
  const [commissionRate, setCommissionRate] = useState(20);
  const [platformName, setPlatformName] = useState("Fit Also");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const mm = JSON.parse(
        localStorage.getItem("adminMaintenanceMode") || "{}",
      );
      setMaintenanceMode(!!mm.maintenanceMode);
      setMaintenanceMsg(mm.message || "");
      setCommissionRate(
        Number(localStorage.getItem("adminCommissionRate") || "20"),
      );
      setPlatformName(localStorage.getItem("adminPlatformName") || "Fit Also");
    } catch {}
  }, []);

  const saveSettings = () => {
    try {
      localStorage.setItem(
        "adminMaintenanceMode",
        JSON.stringify({ maintenanceMode, message: maintenanceMsg }),
      );
      localStorage.setItem("adminCommissionRate", String(commissionRate));
      localStorage.setItem("adminPlatformName", platformName);
      logAdminAction(
        "Updated platform settings",
        "settings",
        `Maintenance: ${maintenanceMode}, Commission: ${commissionRate}%`,
      );
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    logAdminAction(`Exported ${filename}`, "settings");
  };

  const exportOrdersCSV = () => {
    const orders = getAllOrders();
    const header = "Order ID,Item,Category,Amount,Date,Status\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.listingTitle || ""}","${o.category || ""}","${o.totalPrice || 0}","${o.orderDate || ""}","${o.status || ""}"`,
      )
      .join("\n");
    downloadCSV("fit_also_orders.csv", header + rows);
  };

  const exportCustomersCSV = () => {
    const profiles = getAllUserProfiles();
    const header = "Name,City,Phone,Language\n";
    const rows = profiles
      .map(
        (p) =>
          `"${p.name || ""}","${p.city || ""}","${p.phone || ""}","${p.preferredLanguage || ""}"`,
      )
      .join("\n");
    downloadCSV("fit_also_customers.csv", header + rows);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Platform Settings</h2>
        <p className="text-muted-foreground">
          Configure global platform behaviour
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Mode */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ToggleLeft className="w-5 h-5 text-orange-500" /> Maintenance
              Mode
            </CardTitle>
            <CardDescription>
              When ON, users see a maintenance message instead of the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
                aria-label="Toggle maintenance mode"
              />
              <Label
                className={
                  maintenanceMode ? "text-orange-600 font-semibold" : ""
                }
              >
                {maintenanceMode
                  ? "⚠️ Maintenance Mode is ON"
                  : "Maintenance Mode is OFF"}
              </Label>
            </div>
            {maintenanceMode && (
              <div>
                <Label>Maintenance Message</Label>
                <Textarea
                  value={maintenanceMsg}
                  onChange={(e) => setMaintenanceMsg(e.target.value)}
                  placeholder="We're upgrading the platform. Back soon!"
                  rows={3}
                  className="mt-1"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commission Rate */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <IndianRupee className="w-5 h-5 text-green-500" /> Commission Rate
            </CardTitle>
            <CardDescription>
              Percentage taken from each tailor order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Commission % (0–100)</Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  % per order
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Name */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-yellow-500" /> Platform Name
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Brand Name</Label>
            <Input
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              placeholder="Fit Also"
              className="mt-1"
            />
          </CardContent>
        </Card>

        {/* Export */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="w-5 h-5 text-blue-500" /> CSV Export
            </CardTitle>
            <CardDescription>
              Download data for offline analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={exportOrdersCSV}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2 text-blue-500" /> Export Orders
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={exportCustomersCSV}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2 text-green-500" /> Export
              Customers CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      <Button onClick={saveSettings} className="w-full sm:w-auto">
        {saved ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" /> Saved!
          </>
        ) : (
          "Save All Settings"
        )}
      </Button>
    </div>
  );
}

// ─── Customer Analytics Section ───────────────────────────────────────────────

function CustomerAnalyticsSection() {
  const allOrders = getAllOrders();
  const allProfiles = getAllUserProfiles();

  // Build per-customer analytics
  const customerMap: Record<
    string,
    {
      customerId: string;
      name: string;
      city: string;
      totalOrders: number;
      totalSpend: number;
      garmentCounts: Record<string, number>;
    }
  > = {};

  for (const order of allOrders) {
    const cid = order.customerId || "unknown";
    if (!customerMap[cid]) {
      const profile = allProfiles.find(
        (p) => p.principalId === cid || (p as any).id === cid,
      );
      customerMap[cid] = {
        customerId: cid,
        name: profile?.name || "Unknown Customer",
        city: profile?.city || "—",
        totalOrders: 0,
        totalSpend: 0,
        garmentCounts: {},
      };
    }
    customerMap[cid].totalOrders += 1;
    customerMap[cid].totalSpend += order.totalPrice || 0;
    const garment = order.category || order.listingTitle || "Other";
    customerMap[cid].garmentCounts[garment] =
      (customerMap[cid].garmentCounts[garment] || 0) + 1;
  }

  const customers = Object.values(customerMap).sort(
    (a, b) => b.totalOrders - a.totalOrders,
  );

  // Top garments across all orders
  const garmentTotals: Record<string, number> = {};
  for (const order of allOrders) {
    const g = order.category || order.listingTitle || "Other";
    garmentTotals[g] = (garmentTotals[g] || 0) + 1;
  }
  const topGarments = Object.entries(garmentTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // City distribution
  const cityTotals: Record<string, number> = {};
  for (const order of allOrders) {
    const profile = allProfiles.find(
      (p) =>
        p.principalId === order.customerId ||
        (p as any).id === order.customerId,
    );
    const city = profile?.city || "Unknown";
    cityTotals[city] = (cityTotals[city] || 0) + 1;
  }
  const topCities = Object.entries(cityTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Customer Analytics
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Which customers are ordering, from where, and which garments are most
          popular
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Total Customers
            </p>
            <p className="text-3xl font-bold text-primary">
              {customers.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Total Orders
            </p>
            <p className="text-3xl font-bold text-primary">
              {allOrders.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Most Ordered Garment
            </p>
            <p className="text-xl font-bold text-primary truncate">
              {topGarments[0]?.[0] || "—"}
            </p>
            {topGarments[0] && (
              <p className="text-xs text-muted-foreground">
                {topGarments[0][1]} orders
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Garments */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Top Garments Ordered
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topGarments.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No order data yet
              </p>
            ) : (
              <div className="space-y-3">
                {topGarments.map(([garment, count]) => {
                  const maxCount = topGarments[0][1];
                  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={garment}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium truncate">{garment}</span>
                        <span className="text-muted-foreground shrink-0 ml-2">
                          {count} orders
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by City */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Orders by City
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCities.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No location data yet
              </p>
            ) : (
              <div className="space-y-3">
                {topCities.map(([city, count]) => {
                  const maxCount = topCities[0][1];
                  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={city}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">{city}</span>
                        <span className="text-muted-foreground">
                          {count} orders
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary rounded-full h-2 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-Customer Detail Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Customer Order Breakdown
          </CardTitle>
          <CardDescription>
            Each customer's order count, location, and most ordered garment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No customer data yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead className="text-center">Orders</TableHead>
                    <TableHead className="text-right">Total Spend</TableHead>
                    <TableHead>Most Ordered Garment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => {
                    const topGarment = Object.entries(c.garmentCounts).sort(
                      (a, b) => b[1] - a[1],
                    )[0];
                    return (
                      <TableRow key={c.customerId}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {c.city}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{c.totalOrders}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ₹{c.totalSpend.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          {topGarment ? (
                            <span className="text-sm">
                              {topGarment[0]}
                              <span className="text-xs text-muted-foreground ml-1">
                                ×{topGarment[1]}
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main AdminPanel Component ────────────────────────────────────────────────

export default function AdminPanel() {
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customizationPanelOpen, setCustomizationPanelOpen] = useState(false);
  const [showAdminClaim, setShowAdminClaim] = useState(false);
  const [claimEmail, setClaimEmail] = useState("");
  const [claimError, setClaimError] = useState("");

  // Initialize localStorage defaults
  useEffect(() => {
    initLocalStorage();
  }, []);

  // ─── 10-second Polling for real-time sync ─────────────────────────────────
  const [lastTimestamp, setLastTimestamp] = useState<bigint>(0n);
  useEffect(() => {
    if (!actor || !identity) return;
    const interval = setInterval(async () => {
      try {
        const ts = await actor.getLastUpdateTimestamp();
        if (ts !== lastTimestamp) {
          setLastTimestamp(ts);
          queryClient.invalidateQueries({ queryKey: ["allOrders"] });
          queryClient.invalidateQueries({ queryKey: ["platformConfig"] });
          queryClient.invalidateQueries({ queryKey: ["approvals"] });
        }
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [actor, identity, lastTimestamp, queryClient]);

  // CRITICAL FIX 1: Client-side admin email check
  const ADMIN_EMAIL = "FUTURETAILORSFORYOU@gmail.com";
  const storedEmail =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("adminEmail") ||
    "";
  const isEmailAdmin = storedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Check admin role
  const { data: isAdminBackend, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !!identity,
  });

  // Combine email-based and backend-based admin check
  const isAdmin = isEmailAdmin || isAdminBackend;

  // Is the system still initializing (actor loading OR admin check running)?
  const isInitializing =
    actorFetching || (!!actor && !!identity && checkingAdmin);

  // Fetch approvals
  const { data: approvals = [], refetch: refetchApprovals } = useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !!identity && !!isAdmin,
  });

  const handleClaimAdmin = () => {
    setClaimError("");
    if (claimEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      localStorage.setItem("adminEmail", ADMIN_EMAIL);
      localStorage.setItem("userEmail", ADMIN_EMAIL);
      setShowAdminClaim(false);
      window.location.reload();
    } else {
      setClaimError("Email does not match admin records. Please try again.");
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="border-0 shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">FitAlso Admin Panel</h2>
          <p className="text-muted-foreground mb-6">
            Pehle login karein, phir admin access claim karein.
          </p>
          <Button
            size="lg"
            className="w-full mb-3 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={login}
          >
            <Users className="w-4 h-4 mr-2" />
            Login / Sign In
          </Button>
          <p className="text-xs text-muted-foreground">
            Login ke baad "Claim Admin" ka option aayega
          </p>
        </Card>
      </div>
    );
  }

  // Show loading while actor is being created OR while admin check is in progress
  if ((isInitializing || checkingAdmin) && !isEmailAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show admin claim screen either when explicitly triggered OR when not yet verified as admin
  if (showAdminClaim || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="border-0 shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">FitAlso Admin Panel</h2>
              <p className="text-xs text-muted-foreground">
                Super Admin Access
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">
                Logged In
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </div>
              <span className="text-sm font-medium">Claim Admin</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Apna admin email enter karein aur "Claim Admin Access" click karein:
          </p>
          <Input
            type="email"
            placeholder="FUTURETAILORSFORYOU@gmail.com"
            value={claimEmail}
            onChange={(e) => {
              setClaimEmail(e.target.value);
              setClaimError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleClaimAdmin()}
            className="mb-2"
            autoFocus
          />
          {claimError && (
            <p className="text-sm text-destructive mb-3">{claimError}</p>
          )}
          <Button
            onClick={handleClaimAdmin}
            disabled={!claimEmail.trim()}
            className="w-full mt-2 bg-primary text-primary-foreground"
            size="lg"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Claim Admin Access
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Sirf authorized admin hi yahan access kar sakte hain
          </p>
        </Card>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection approvals={approvals} />;
      case "customers":
        return <CustomersSection />;
      case "analytics":
        return <CustomerAnalyticsSection />;
      case "orders":
        return <OrdersSection />;
      case "tailors":
        return (
          <TailorsSection
            approvals={approvals}
            onRefreshApprovals={() => refetchApprovals()}
          />
        );
      case "products":
        return <ProductsSection />;
      case "revenue":
        return <RevenueSection />;
      case "cities":
        return <CitiesSection />;
      case "fabrics":
        return <FabricsSection />;
      case "promotions":
        return <PromotionsSection />;
      case "notifications":
        return <NotificationsSection />;
      case "images":
        return <ImageManagerSection />;
      case "activity":
        return <ActivityLogSection />;
      case "settings":
        return <PlatformSettingsSection />;
      default:
        return <OverviewSection approvals={approvals} />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close sidebar"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto
          w-64 bg-card border-r border-border flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Star className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">FitAlso Admin</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Admin Info */}
          <div className="px-4 py-3 bg-primary/5 border-b border-border">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="font-semibold text-sm text-primary">Krishna</p>
            <p className="text-xs text-muted-foreground truncate">
              {identity?.getPrincipal().toString().slice(0, 20)}...
            </p>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-2">
            <nav className="px-2 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              FitAlso v1.0 • Super Admin
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-lg capitalize">
                {NAV_ITEMS.find((n) => n.id === activeSection)?.label ||
                  "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setCustomizationPanelOpen(true)}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Paintbrush className="w-4 h-4 mr-1.5" /> Start Customising
              </Button>
              <Badge variant="secondary" className="hidden sm:flex">
                <Star className="w-3 h-3 mr-1 text-yellow-500" /> Super Admin
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchApprovals()}
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Refresh
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {renderSection()}
          </main>
        </div>

        {/* Admin Customization Panel */}
        <AdminCustomizationPanel
          open={customizationPanelOpen}
          onOpenChange={setCustomizationPanelOpen}
        />
      </div>
    </TooltipProvider>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApprovalStatus } from '../backend';
import {
  LayoutDashboard, Users, ShoppingBag, Briefcase, Package,
  TrendingUp, MapPin, Palette, Tag, Bell, Image as ImageIcon,
  Edit, Trash2, Plus, Eye, Upload, CheckCircle, XCircle,
  ChevronRight, Menu, X, Star, IndianRupee, BarChart3,
  RefreshCw, Search, Filter, ArrowUpDown, Send, AlertTriangle, Paintbrush
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AdminCustomizationPanel } from '../components/AdminCustomizationPanel';

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
  discountType: 'percentage' | 'flat';
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
  targetAudience: 'all' | 'customers' | 'tailors';
  createdAt: string;
  readBy: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore',
  'Bhopal', 'Nagpur', 'Surat', 'Vadodara', 'Kochi', 'Coimbatore',
  'Visakhapatnam', 'Thiruvananthapuram', 'Patna', 'Agra', 'Varanasi', 'Amritsar'
];

const DEFAULT_FABRICS: FabricItem[] = [
  { id: '1', label: 'Cotton' }, { id: '2', label: 'Silk' }, { id: '3', label: 'Linen' },
  { id: '4', label: 'Chiffon' }, { id: '5', label: 'Georgette' }, { id: '6', label: 'Velvet' },
  { id: '7', label: 'Crepe' }, { id: '8', label: 'Satin' }
];

const DEFAULT_COLORS: FabricItem[] = [
  { id: '1', label: 'Solid Red' }, { id: '2', label: 'Solid Blue' }, { id: '3', label: 'Floral Print' },
  { id: '4', label: 'Geometric' }, { id: '5', label: 'Paisley' }, { id: '6', label: 'Stripes' },
  { id: '7', label: 'Checks' }, { id: '8', label: 'Embroidered' }
];

const DEFAULT_WORK_TYPES: FabricItem[] = [
  { id: '1', label: 'Zari Work' }, { id: '2', label: 'Mirror Work' }, { id: '3', label: 'Thread Embroidery' },
  { id: '4', label: 'Sequin Work' }, { id: '5', label: 'Block Print' }, { id: '6', label: 'Tie & Dye' }
];

const ORDER_STATUSES = ['pending', 'confirmed', 'inTailoring', 'shipped', 'delivered', 'cancelled'];

const GARMENT_CATEGORIES = ['Saree Blouse', 'Salwar Kameez', 'Lehenga', 'Kurta', 'Sherwani', 'Suit', 'Dress', 'Skirt'];

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'tailors', label: 'Tailors', icon: Briefcase },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp },
  { id: 'cities', label: 'Cities', icon: MapPin },
  { id: 'fabrics', label: 'Fabrics & Designs', icon: Palette },
  { id: 'promotions', label: 'Promotions', icon: Tag },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'images', label: 'Image Manager', icon: ImageIcon },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function initLocalStorage() {
  if (!localStorage.getItem('adminCities')) {
    const cities: City[] = DEFAULT_CITIES.map((name, i) => ({ id: String(i + 1), name }));
    localStorage.setItem('adminCities', JSON.stringify(cities));
  }
  if (!localStorage.getItem('adminFabrics')) {
    localStorage.setItem('adminFabrics', JSON.stringify(DEFAULT_FABRICS));
  }
  if (!localStorage.getItem('adminColors')) {
    localStorage.setItem('adminColors', JSON.stringify(DEFAULT_COLORS));
  }
  if (!localStorage.getItem('adminWorkTypes')) {
    localStorage.setItem('adminWorkTypes', JSON.stringify(DEFAULT_WORK_TYPES));
  }
  if (!localStorage.getItem('adminPromotions')) {
    localStorage.setItem('adminPromotions', JSON.stringify([]));
  }
  if (!localStorage.getItem('adminNotifications')) {
    localStorage.setItem('adminNotifications', JSON.stringify([]));
  }
}

function getAllTailors(): TailorProfile[] {
  const tailors: TailorProfile[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('tailor_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
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
    if (key && key.startsWith('orders_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data)) orders.push(...data);
      } catch {}
    }
  }
  // Also check global orders key
  try {
    const globalOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
    if (Array.isArray(globalOrders)) orders.push(...globalOrders);
  } catch {}
  return orders;
}

function getAllUserProfiles(): UserProfile[] {
  const profiles: UserProfile[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('userProfile_') || key.startsWith('profile_'))) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.name || data.principalId) profiles.push(data);
      } catch {}
    }
  }
  return profiles;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'inTailoring': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'shipped': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StatCard({ title, value, subtitle, icon: Icon, color }: {
  title: string; value: string | number; subtitle?: string; icon: React.ElementType; color: string;
}) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ImageUploadButton({ onImageSelected, label = 'Replace Image' }: {
  onImageSelected: (dataUrl: string) => void; label?: string;
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
          e.target.value = '';
        }}
      />
      <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        <Upload className="w-3 h-3 mr-1" /> {label}
      </Button>
    </>
  );
}

// ─── Section: Overview ────────────────────────────────────────────────────────

function OverviewSection({ approvals }: { approvals: any[] }) {
  const [stats, setStats] = useState({
    totalCustomers: 0, totalTailors: 0, activeTailors: 0, pendingTailors: 0,
    totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, cancelledOrders: 0,
    totalRevenue: 0, monthlyRevenue: 0, avgOrderValue: 0, pendingApprovals: 0
  });

  useEffect(() => {
    const tailors = getAllTailors();
    const orders = getAllOrders();
    const profiles = getAllUserProfiles();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const monthlyRevenue = deliveredOrders
      .filter(o => {
        const d = new Date(o.orderDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const pendingApprovals = approvals.filter(a => a.status === 'pending').length;

    setStats({
      totalCustomers: profiles.length,
      totalTailors: tailors.length,
      activeTailors: tailors.filter(t => t.approvalStatus === 'approved').length,
      pendingTailors: tailors.filter(t => t.approvalStatus === 'pending').length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      deliveredOrders: deliveredOrders.length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue,
      monthlyRevenue,
      avgOrderValue: deliveredOrders.length > 0 ? Math.round(totalRevenue / deliveredOrders.length) : 0,
      pendingApprovals
    });
  }, [approvals]);

  const recentOrders = getAllOrders().sort((a, b) =>
    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  ).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back, Krishna! Here's your platform summary.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={stats.totalCustomers} subtitle="Registered users" icon={Users} color="bg-blue-500" />
        <StatCard title="Total Tailors" value={stats.totalTailors} subtitle={`Active: ${stats.activeTailors} | Pending: ${stats.pendingTailors}`} icon={Briefcase} color="bg-purple-500" />
        <StatCard title="Total Orders" value={stats.totalOrders} subtitle={`Pending: ${stats.pendingOrders} | Delivered: ${stats.deliveredOrders}`} icon={ShoppingBag} color="bg-orange-500" />
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} subtitle={`This month: ${formatCurrency(stats.monthlyRevenue)}`} icon={IndianRupee} color="bg-green-500" />
        <StatCard title="Avg Order Value" value={formatCurrency(stats.avgOrderValue)} subtitle="From delivered orders" icon={BarChart3} color="bg-teal-500" />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals} subtitle="Tailors awaiting review" icon={AlertTriangle} color="bg-red-500" />
        <StatCard title="Cancelled Orders" value={stats.cancelledOrders} subtitle="Total cancellations" icon={XCircle} color="bg-gray-500" />
        <StatCard title="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} subtitle="Current month earnings" icon={TrendingUp} color="bg-indigo-500" />
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
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
                {recentOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id?.slice(0, 8)}...</TableCell>
                    <TableCell>{order.listingTitle || order.category || 'N/A'}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.totalPrice || 0)}</TableCell>
                    <TableCell>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
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
  const [viewOrdersCustomer, setViewOrdersCustomer] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [search, setSearch] = useState('');

  const loadProfiles = useCallback(() => setProfiles(getAllUserProfiles()), []);
  useEffect(() => { loadProfiles(); }, [loadProfiles]);

  const allOrders = getAllOrders();

  const getCustomerOrders = (customerId: string) =>
    allOrders.filter(o => o.customerId === customerId);

  const getCustomerSpend = (customerId: string) =>
    getCustomerOrders(customerId)
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const filtered = profiles.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  const saveEdit = () => {
    if (!editCustomer) return;
    const key = `userProfile_${editCustomer.principalId}` || `profile_${editCustomer.principalId}`;
    const updated = { ...editCustomer, ...editForm };
    // Try both key patterns
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.includes(editCustomer.principalId || '') || k.startsWith('userProfile_') || k.startsWith('profile_'))) {
        try {
          const d = JSON.parse(localStorage.getItem(k) || '{}');
          if (d.principalId === editCustomer.principalId || d.name === editCustomer.name) {
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
          <p className="text-muted-foreground">{profiles.length} registered customers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9 w-64" value={search} onChange={e => setSearch(e.target.value)} />
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
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No customers found</TableCell></TableRow>
              ) : filtered.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{p.name || 'N/A'}</TableCell>
                  <TableCell>{p.city || '—'}</TableCell>
                  <TableCell>{p.phone || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getCustomerOrders(p.principalId || '').length}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">{formatCurrency(getCustomerSpend(p.principalId || ''))}</TableCell>
                  <TableCell>{p.preferredLanguage || 'en'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditCustomer(p); setEditForm(p); }}>
                        <Edit className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setViewOrdersCustomer(p)}>
                        <Eye className="w-3 h-3 mr-1" /> Orders
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editCustomer} onOpenChange={() => setEditCustomer(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Customer Profile</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Phone</Label><Input value={editForm.phone || ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>City</Label><Input value={editForm.city || ''} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div><Label>Language</Label>
              <Select value={editForm.preferredLanguage || 'en'} onValueChange={v => setEditForm(f => ({ ...f, preferredLanguage: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCustomer(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Orders Dialog */}
      <Dialog open={!!viewOrdersCustomer} onOpenChange={() => setViewOrdersCustomer(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Orders — {viewOrdersCustomer?.name}</DialogTitle></DialogHeader>
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
                {getCustomerOrders(viewOrdersCustomer?.principalId || '').map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id?.slice(0, 8)}</TableCell>
                    <TableCell>{o.listingTitle || o.category}</TableCell>
                    <TableCell>{formatCurrency(o.totalPrice || 0)}</TableCell>
                    <TableCell>{o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-IN') : 'N/A'}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(o.status)}`}>{o.status}</span></TableCell>
                  </TableRow>
                ))}
                {getCustomerOrders(viewOrdersCustomer?.principalId || '').length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No orders found</TableCell></TableRow>
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');

  const loadOrders = useCallback(() => setOrders(getAllOrders()), []);
  useEffect(() => { loadOrders(); }, [loadOrders]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('orders_')) {
        try {
          const data: Order[] = JSON.parse(localStorage.getItem(key) || '[]');
          const idx = data.findIndex(o => o.id === orderId);
          if (idx !== -1) {
            data[idx].status = newStatus;
            localStorage.setItem(key, JSON.stringify(data));
            break;
          }
        } catch {}
      }
    }
    // Also check allOrders
    try {
      const global: Order[] = JSON.parse(localStorage.getItem('allOrders') || '[]');
      const idx = global.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        global[idx].status = newStatus;
        localStorage.setItem('allOrders', JSON.stringify(global));
      }
    } catch {}
    loadOrders();
  };

  const filtered = orders
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o =>
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.listingTitle?.toLowerCase().includes(search.toLowerCase()) ||
      o.category?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const da = new Date(a.orderDate).getTime();
      const db = new Date(b.orderDate).getTime();
      return sortDir === 'desc' ? db - da : da - db;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Orders Management</h2>
          <p className="text-muted-foreground">{orders.length} total orders</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-9 w-48" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}>
            <ArrowUpDown className="w-4 h-4 mr-1" /> {sortDir === 'desc' ? 'Newest' : 'Oldest'}
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
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No orders found</TableCell></TableRow>
                ) : filtered.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id?.slice(0, 8)}...</TableCell>
                    <TableCell className="max-w-[120px] truncate">{order.listingTitle || 'N/A'}</TableCell>
                    <TableCell>{order.category || '—'}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.totalPrice || 0)}</TableCell>
                    <TableCell>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={v => updateOrderStatus(order.id, v)}>
                        <SelectTrigger className="w-32 h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => setViewOrder(order)}>
                        <Eye className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Order Details</DialogTitle></DialogHeader>
          {viewOrder && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">Order ID</Label><p className="font-mono text-sm">{viewOrder.id}</p></div>
                  <div><Label className="text-muted-foreground">Status</Label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(viewOrder.status)}`}>{viewOrder.status}</span>
                  </div>
                  <div><Label className="text-muted-foreground">Item</Label><p>{viewOrder.listingTitle || 'N/A'}</p></div>
                  <div><Label className="text-muted-foreground">Category</Label><p>{viewOrder.category || 'N/A'}</p></div>
                  <div><Label className="text-muted-foreground">Amount</Label><p className="font-bold text-green-600">{formatCurrency(viewOrder.totalPrice || 0)}</p></div>
                  <div><Label className="text-muted-foreground">Order Date</Label><p>{viewOrder.orderDate ? new Date(viewOrder.orderDate).toLocaleDateString('en-IN') : 'N/A'}</p></div>
                </div>
                <Separator />
                <div>
                  <Label className="text-muted-foreground font-semibold">Customization</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(viewOrder.customization || {}).map(([k, v]) => (
                      <div key={k} className="bg-muted rounded p-2">
                        <p className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-sm font-medium">{v as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {viewOrder.measurementSnapshot && Object.keys(viewOrder.measurementSnapshot).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-muted-foreground font-semibold">Measurements — {viewOrder.measurementProfileName}</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {Object.entries(viewOrder.measurementSnapshot).map(([k, v]) => (
                          <div key={k} className="bg-muted rounded p-2">
                            <p className="text-xs text-muted-foreground capitalize">{k}</p>
                            <p className="text-sm font-medium">{v} cm</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Section: Tailors ─────────────────────────────────────────────────────────

function TailorsSection({ approvals, onRefreshApprovals }: { approvals: any[]; onRefreshApprovals: () => void }) {
  const { actor } = useActor();
  const [tailors, setTailors] = useState<TailorProfile[]>([]);
  const [editTailor, setEditTailor] = useState<TailorProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<TailorProfile>>({});
  const [search, setSearch] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const loadTailors = useCallback(() => setTailors(getAllTailors()), []);
  useEffect(() => { loadTailors(); }, [loadTailors]);

  const allOrders = getAllOrders();

  const getTailorOrders = (tailorId: string) => allOrders.filter(o => o.tailorId === tailorId);
  const getTailorEarnings = (tailorId: string) =>
    getTailorOrders(tailorId).filter(o => o.status === 'delivered').reduce((s, o) => s + (o.totalPrice || 0), 0);

  const getApprovalStatus = (tailorId: string) => {
    const approval = approvals.find(a => a.principal?.toString() === tailorId);
    return approval?.status || 'pending';
  };

  const handleApprovalToggle = async (tailor: TailorProfile) => {
    if (!actor) return;
    const currentStatus = getApprovalStatus(tailor.id);
    const newStatus = currentStatus === 'approved' ? ApprovalStatus.rejected : ApprovalStatus.approved;
    setApprovingId(tailor.id);
    try {
      const { Principal } = await import('@dfinity/principal');
      await actor.setApproval(Principal.fromText(tailor.id), newStatus);
      onRefreshApprovals();
    } catch (e) {
      console.error('Approval error:', e);
    } finally {
      setApprovingId(null);
    }
  };

  const saveTailorEdit = () => {
    if (!editTailor) return;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tailor_')) {
        try {
          const d = JSON.parse(localStorage.getItem(key) || '{}');
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
      if (key && key.startsWith('tailor_')) {
        try {
          const d = JSON.parse(localStorage.getItem(key) || '{}');
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

  const filtered = tailors.filter(t =>
    t.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    t.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Tailors Management</h2>
          <p className="text-muted-foreground">{tailors.length} registered tailors</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tailors..." className="pl-9 w-64" value={search} onChange={e => setSearch(e.target.value)} />
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
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No tailors found</TableCell></TableRow>
                ) : filtered.map(tailor => {
                  const status = getApprovalStatus(tailor.id);
                  return (
                    <TableRow key={tailor.id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                          {tailor.profileImageUrl ? (
                            <img src={tailor.profileImageUrl} alt={tailor.shopName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Briefcase className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{tailor.shopName || 'N/A'}</TableCell>
                      <TableCell>{tailor.ownerName || '—'}</TableCell>
                      <TableCell>{tailor.city || '—'}</TableCell>
                      <TableCell><Badge variant="secondary">{getTailorOrders(tailor.id).length}</Badge></TableCell>
                      <TableCell className="font-semibold text-green-600">{formatCurrency(getTailorEarnings(tailor.id))}</TableCell>
                      <TableCell>
                        {tailor.isPremium ? <Badge className="bg-yellow-500">Premium</Badge> : <Badge variant="outline">Standard</Badge>}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                          status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>{status}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => { setEditTailor(tailor); setEditForm(tailor); }}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={status === 'approved' ? 'destructive' : 'default'}
                            onClick={() => handleApprovalToggle(tailor)}
                            disabled={approvingId === tailor.id}
                          >
                            {approvingId === tailor.id ? <RefreshCw className="w-3 h-3 animate-spin" /> :
                              status === 'approved' ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          </Button>
                          <ImageUploadButton label="" onImageSelected={url => replaceProfileImage(tailor, url)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Tailor Dialog */}
      <Dialog open={!!editTailor} onOpenChange={() => setEditTailor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Tailor — {editTailor?.shopName}</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Shop Name</Label><Input value={editForm.shopName || ''} onChange={e => setEditForm(f => ({ ...f, shopName: e.target.value }))} /></div>
                <div><Label>Owner Name</Label><Input value={editForm.ownerName || ''} onChange={e => setEditForm(f => ({ ...f, ownerName: e.target.value }))} /></div>
                <div><Label>City</Label><Input value={editForm.city || ''} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} /></div>
                <div><Label>Contact Phone</Label><Input value={editForm.contactPhone || ''} onChange={e => setEditForm(f => ({ ...f, contactPhone: e.target.value }))} /></div>
                <div><Label>Contact Email</Label><Input value={editForm.contactEmail || ''} onChange={e => setEditForm(f => ({ ...f, contactEmail: e.target.value }))} /></div>
                <div><Label>Base Pricing (₹)</Label><Input type="number" value={editForm.basePricing || ''} onChange={e => setEditForm(f => ({ ...f, basePricing: Number(e.target.value) }))} /></div>
                <div><Label>Turnaround Days</Label><Input type="number" value={editForm.turnaroundDays || ''} onChange={e => setEditForm(f => ({ ...f, turnaroundDays: Number(e.target.value) }))} /></div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={!!editForm.isPremium} onCheckedChange={v => setEditForm(f => ({ ...f, isPremium: v }))} />
                  <Label>Premium Status</Label>
                </div>
              </div>
              <div><Label>Bio</Label><Textarea value={editForm.bio || ''} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} rows={3} /></div>
              <div><Label>Specialties (comma-separated)</Label>
                <Input value={(editForm.specialties || []).join(', ')} onChange={e => setEditForm(f => ({ ...f, specialties: e.target.value.split(',').map(s => s.trim()) }))} />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTailor(null)}>Cancel</Button>
            <Button onClick={saveTailorEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Section: Products ────────────────────────────────────────────────────────

function ProductsSection() {
  const [listings, setListings] = useState<(Listing & { tailorName: string })[]>([]);
  const [editListing, setEditListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState<Partial<Listing>>({});
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [search, setSearch] = useState('');

  const loadListings = useCallback(() => {
    const tailors = getAllTailors();
    const all: (Listing & { tailorName: string })[] = [];
    tailors.forEach(t => {
      (t.listings || []).forEach(l => all.push({ ...l, tailorName: t.shopName || t.ownerName || 'Unknown' }));
    });
    setListings(all);
  }, []);

  useEffect(() => { loadListings(); }, [loadListings]);

  const updateListingInStorage = (listing: Listing, updates: Partial<Listing>) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tailor_')) {
        try {
          const tailor: TailorProfile = JSON.parse(localStorage.getItem(key) || '{}');
          const idx = (tailor.listings || []).findIndex(l => l.id === listing.id);
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
      if (key && key.startsWith('tailor_')) {
        try {
          const tailor: TailorProfile = JSON.parse(localStorage.getItem(key) || '{}');
          const idx = (tailor.listings || []).findIndex(l => l.id === listing.id);
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

  const filtered = listings.filter(l =>
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.category?.toLowerCase().includes(search.toLowerCase()) ||
    l.tailorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Products & Catalog</h2>
          <p className="text-muted-foreground">{listings.length} total listings</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9 w-64" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">No products found</div>
        ) : filtered.map(listing => (
          <Card key={listing.id} className="border-0 shadow-md overflow-hidden">
            <div className="relative h-40 bg-muted">
              {listing.imageUrl ? (
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">{listing.category}</Badge>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="font-semibold text-sm truncate">{listing.title}</p>
              <p className="text-xs text-muted-foreground">{listing.tailorName}</p>
              <p className="font-bold text-primary mt-1">{formatCurrency(listing.price || 0)}</p>
              <div className="flex gap-1 mt-3 flex-wrap">
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { setEditListing(listing); setEditForm(listing); }}>
                  <Edit className="w-3 h-3 mr-1" /> Edit
                </Button>
                <ImageUploadButton label="Img" onImageSelected={url => updateListingInStorage(listing, { imageUrl: url })} />
                <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(listing)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Listing Dialog */}
      <Dialog open={!!editListing} onOpenChange={() => setEditListing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Edit Listing</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price (₹)</Label><Input type="number" value={editForm.price || ''} onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))} /></div>
              <div><Label>Category</Label>
                <Select value={editForm.category || ''} onValueChange={v => setEditForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{GARMENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Description</Label><Textarea value={editForm.description || ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditListing(null)}>Cancel</Button>
            <Button onClick={() => { if (editListing) updateListingInStorage(editListing, editForm); setEditListing(null); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete "{deleteTarget?.title}". This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && deleteListing(deleteTarget)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
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

  const delivered = orders.filter(o => o.status === 'delivered');
  const totalRevenue = delivered.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const avgOrderValue = delivered.length > 0 ? Math.round(totalRevenue / delivered.length) : 0;

  // Monthly breakdown
  const monthlyMap: Record<string, number> = {};
  delivered.forEach(o => {
    if (!o.orderDate) return;
    const d = new Date(o.orderDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + (o.totalPrice || 0);
  });
  const monthly = Object.entries(monthlyMap).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12);

  // Top tailors
  const tailorEarnings: Record<string, number> = {};
  delivered.forEach(o => { tailorEarnings[o.tailorId] = (tailorEarnings[o.tailorId] || 0) + (o.totalPrice || 0); });
  const topTailors = Object.entries(tailorEarnings)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, earnings]) => {
      const t = tailors.find(t => t.id === id);
      return { name: t?.shopName || t?.ownerName || id.slice(0, 8), earnings };
    });

  // Top customers
  const customerSpend: Record<string, number> = {};
  delivered.forEach(o => { customerSpend[o.customerId] = (customerSpend[o.customerId] || 0) + (o.totalPrice || 0); });
  const topCustomers = Object.entries(customerSpend)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, spend]) => {
      const p = profiles.find(p => p.principalId === id);
      return { name: p?.name || id.slice(0, 8), spend };
    });

  // Status funnel
  const statusCounts: Record<string, number> = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Revenue & Analytics</h2>
        <p className="text-muted-foreground">Platform-wide earnings and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} subtitle="From delivered orders" icon={IndianRupee} color="bg-green-500" />
        <StatCard title="Total Delivered" value={delivered.length} subtitle="Completed orders" icon={CheckCircle} color="bg-blue-500" />
        <StatCard title="Avg Order Value" value={formatCurrency(avgOrderValue)} subtitle="Per delivered order" icon={BarChart3} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            {monthly.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No revenue data yet</p>
            ) : (
              <div className="space-y-2">
                {monthly.map(([month, amount]) => {
                  const pct = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
                  return (
                    <div key={month} className="flex items-center gap-3">
                      <span className="text-sm w-20 text-muted-foreground">{month}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm font-semibold w-24 text-right">{formatCurrency(amount)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Funnel */}
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg">Order Status Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ORDER_STATUSES.map(status => {
                const count = statusCounts[status] || 0;
                const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border w-24 text-center ${getStatusColor(status)}`}>{status}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Tailors */}
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg">Top 5 Tailors by Earnings</CardTitle></CardHeader>
          <CardContent>
            {topTailors.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topTailors.map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <span className="flex-1 font-medium">{t.name}</span>
                    <span className="font-bold text-green-600">{formatCurrency(t.earnings)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg">Top 5 Customers by Spend</CardTitle></CardHeader>
          <CardContent>
            {topCustomers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topCustomers.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <span className="flex-1 font-medium">{c.name}</span>
                    <span className="font-bold text-blue-600">{formatCurrency(c.spend)}</span>
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
  const [newCityName, setNewCityName] = useState('');
  const [editCityName, setEditCityName] = useState('');
  const [search, setSearch] = useState('');

  const loadCities = useCallback(() => {
    const data = JSON.parse(localStorage.getItem('adminCities') || '[]');
    setCities(data);
  }, []);

  useEffect(() => { loadCities(); }, [loadCities]);

  const saveCities = (updated: City[]) => {
    localStorage.setItem('adminCities', JSON.stringify(updated));
    setCities(updated);
  };

  const addCity = () => {
    if (!newCityName.trim()) return;
    saveCities([...cities, { id: generateId(), name: newCityName.trim() }]);
    setNewCityName('');
    setAddOpen(false);
  };

  const updateCity = () => {
    if (!editCity || !editCityName.trim()) return;
    saveCities(cities.map(c => c.id === editCity.id ? { ...c, name: editCityName.trim() } : c));
    setEditCity(null);
  };

  const removeCity = (city: City) => {
    saveCities(cities.filter(c => c.id !== city.id));
    setDeleteCity(null);
  };

  const filtered = cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Cities Management</h2>
          <p className="text-muted-foreground">{cities.length} cities configured</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search cities..." className="pl-9 w-48" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button onClick={() => setAddOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add City</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map(city => (
          <Card key={city.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{city.name}</span>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => { setEditCity(city); setEditCityName(city.name); }}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => setDeleteCity(city)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New City</DialogTitle></DialogHeader>
          <div><Label>City Name</Label><Input value={newCityName} onChange={e => setNewCityName(e.target.value)} placeholder="e.g. Mysore" onKeyDown={e => e.key === 'Enter' && addCity()} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addCity}>Add City</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editCity} onOpenChange={() => setEditCity(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit City</DialogTitle></DialogHeader>
          <div><Label>City Name</Label><Input value={editCityName} onChange={e => setEditCityName(e.target.value)} onKeyDown={e => e.key === 'Enter' && updateCity()} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCity(null)}>Cancel</Button>
            <Button onClick={updateCity}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCity} onOpenChange={() => setDeleteCity(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete City?</AlertDialogTitle>
            <AlertDialogDescription>Remove "{deleteCity?.name}" from the cities list?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCity && removeCity(deleteCity)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
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
  const [addDialog, setAddDialog] = useState<{ type: 'fabrics' | 'colors' | 'workTypes'; open: boolean } | null>(null);
  const [editItem, setEditItem] = useState<{ item: FabricItem; type: string } | null>(null);
  const [deleteItem, setDeleteItem] = useState<{ item: FabricItem; type: string } | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [editLabel, setEditLabel] = useState('');

  const load = useCallback(() => {
    setFabrics(JSON.parse(localStorage.getItem('adminFabrics') || '[]'));
    setColors(JSON.parse(localStorage.getItem('adminColors') || '[]'));
    setWorkTypes(JSON.parse(localStorage.getItem('adminWorkTypes') || '[]'));
  }, []);

  useEffect(() => { load(); }, [load]);

  const getList = (type: string) => type === 'fabrics' ? fabrics : type === 'colors' ? colors : workTypes;
  const setList = (type: string, items: FabricItem[]) => {
    localStorage.setItem(`admin${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(items));
    if (type === 'fabrics') setFabrics(items);
    else if (type === 'colors') setColors(items);
    else setWorkTypes(items);
  };

  const addItem = () => {
    if (!addDialog || !newLabel.trim()) return;
    const list = getList(addDialog.type);
    setList(addDialog.type, [...list, { id: generateId(), label: newLabel.trim() }]);
    setNewLabel('');
    setAddDialog(null);
  };

  const updateItem = () => {
    if (!editItem || !editLabel.trim()) return;
    const list = getList(editItem.type);
    setList(editItem.type, list.map(i => i.id === editItem.item.id ? { ...i, label: editLabel.trim() } : i));
    setEditItem(null);
  };

  const removeItem = () => {
    if (!deleteItem) return;
    const list = getList(deleteItem.type);
    setList(deleteItem.type, list.filter(i => i.id !== deleteItem.item.id));
    setDeleteItem(null);
  };

  const replaceItemImage = (item: FabricItem, type: string, dataUrl: string) => {
    const list = getList(type);
    setList(type, list.map(i => i.id === item.id ? { ...i, imageUrl: dataUrl } : i));
  };

  const renderList = (items: FabricItem[], type: 'fabrics' | 'colors' | 'workTypes', title: string) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Button size="sm" onClick={() => setAddDialog({ type, open: true })}><Plus className="w-3 h-3 mr-1" /> Add</Button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.label} className="w-10 h-10 rounded object-cover" />
            ) : (
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                <Palette className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            <span className="flex-1 font-medium">{item.label}</span>
            <div className="flex gap-1">
              <ImageUploadButton label="" onImageSelected={url => replaceItemImage(item, type, url)} />
              <Button size="sm" variant="ghost" onClick={() => { setEditItem({ item, type }); setEditLabel(item.label); }}>
                <Edit className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteItem({ item, type })}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No items yet</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Fabrics, Designs & Colors</h2>
        <p className="text-muted-foreground">Manage customization options for garments</p>
      </div>

      <Tabs defaultValue="fabrics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fabrics">Fabrics ({fabrics.length})</TabsTrigger>
          <TabsTrigger value="colors">Colors/Patterns ({colors.length})</TabsTrigger>
          <TabsTrigger value="workTypes">Work Types ({workTypes.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="fabrics" className="mt-4">
          <Card className="border-0 shadow-md"><CardContent className="p-6">{renderList(fabrics, 'fabrics', 'Fabric Types')}</CardContent></Card>
        </TabsContent>
        <TabsContent value="colors" className="mt-4">
          <Card className="border-0 shadow-md"><CardContent className="p-6">{renderList(colors, 'colors', 'Colors & Patterns')}</CardContent></Card>
        </TabsContent>
        <TabsContent value="workTypes" className="mt-4">
          <Card className="border-0 shadow-md"><CardContent className="p-6">{renderList(workTypes, 'workTypes', 'Work Types')}</CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!addDialog} onOpenChange={() => setAddDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Item</DialogTitle></DialogHeader>
          <div><Label>Label</Label><Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Enter name..." onKeyDown={e => e.key === 'Enter' && addItem()} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(null)}>Cancel</Button>
            <Button onClick={addItem}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Item</DialogTitle></DialogHeader>
          <div><Label>Label</Label><Input value={editLabel} onChange={e => setEditLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && updateItem()} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button onClick={updateItem}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>Remove "{deleteItem?.item.label}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeItem} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
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
    discountType: 'percentage', isActive: true, applicableCategories: []
  });

  const load = useCallback(() => {
    setPromotions(JSON.parse(localStorage.getItem('adminPromotions') || '[]'));
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = (updated: Promotion[]) => {
    localStorage.setItem('adminPromotions', JSON.stringify(updated));
    setPromotions(updated);
  };

  const addPromo = () => {
    const promo: Promotion = {
      id: generateId(),
      title: form.title || '',
      description: form.description || '',
      discountType: form.discountType || 'percentage',
      discountValue: form.discountValue || 0,
      applicableCategories: form.applicableCategories || [],
      validFrom: form.validFrom || new Date().toISOString().split('T')[0],
      validUntil: form.validUntil || new Date().toISOString().split('T')[0],
      isActive: form.isActive ?? true
    };
    save([...promotions, promo]);
    setForm({ discountType: 'percentage', isActive: true, applicableCategories: [] });
    setAddOpen(false);
  };

  const updatePromo = () => {
    if (!editPromo) return;
    save(promotions.map(p => p.id === editPromo.id ? { ...editPromo, ...form } as Promotion : p));
    setEditPromo(null);
  };

  const toggleActive = (id: string) => {
    save(promotions.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const PromoForm = () => (
    <div className="space-y-4">
      <div><Label>Title</Label><Input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
      <div><Label>Description</Label><Textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Discount Type</Label>
          <Select value={form.discountType || 'percentage'} onValueChange={v => setForm(f => ({ ...f, discountType: v as 'percentage' | 'flat' }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="flat">Flat (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Discount Value</Label><Input type="number" value={form.discountValue || ''} onChange={e => setForm(f => ({ ...f, discountValue: Number(e.target.value) }))} /></div>
        <div><Label>Valid From</Label><Input type="date" value={form.validFrom || ''} onChange={e => setForm(f => ({ ...f, validFrom: e.target.value }))} /></div>
        <div><Label>Valid Until</Label><Input type="date" value={form.validUntil || ''} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} /></div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={!!form.isActive} onCheckedChange={v => setForm(f => ({ ...f, isActive: v }))} />
        <Label>Active</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Promotions & Discounts</h2>
          <p className="text-muted-foreground">{promotions.filter(p => p.isActive).length} active promotions</p>
        </div>
        <Button onClick={() => { setForm({ discountType: 'percentage', isActive: true, applicableCategories: [] }); setAddOpen(true); }}>
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
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No promotions yet</TableCell></TableRow>
              ) : promotions.map(promo => (
                <TableRow key={promo.id}>
                  <TableCell>
                    <p className="font-medium">{promo.title}</p>
                    <p className="text-xs text-muted-foreground">{promo.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {promo.discountType === 'percentage' ? `${promo.discountValue}% off` : `₹${promo.discountValue} off`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <p>{promo.validFrom}</p>
                    <p className="text-muted-foreground">to {promo.validUntil}</p>
                  </TableCell>
                  <TableCell>
                    <Switch checked={promo.isActive} onCheckedChange={() => toggleActive(promo.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditPromo(promo); setForm(promo); }}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeletePromo(promo)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Create Promotion</DialogTitle></DialogHeader>
          <PromoForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addPromo}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPromo} onOpenChange={() => setEditPromo(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Edit Promotion</DialogTitle></DialogHeader>
          <PromoForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPromo(null)}>Cancel</Button>
            <Button onClick={updatePromo}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletePromo} onOpenChange={() => setDeletePromo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion?</AlertDialogTitle>
            <AlertDialogDescription>Remove "{deletePromo?.title}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deletePromo) { save(promotions.filter(p => p.id !== deletePromo.id)); setDeletePromo(null); } }} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────

function NotificationsSection() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [form, setForm] = useState({ title: '', body: '', targetAudience: 'all' as 'all' | 'customers' | 'tailors' });
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    setNotifications(JSON.parse(localStorage.getItem('adminNotifications') || '[]'));
  }, []);

  useEffect(() => { load(); }, [load]);

  const broadcast = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSending(true);
    const notif: Notification = {
      id: generateId(),
      title: form.title,
      body: form.body,
      targetAudience: form.targetAudience,
      createdAt: new Date().toISOString(),
      readBy: []
    };
    const updated = [notif, ...notifications];
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
    setNotifications(updated);
    setForm({ title: '', body: '', targetAudience: 'all' });
    setSending(false);
  };

  const deleteNotif = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
    setNotifications(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notifications Management</h2>
        <p className="text-muted-foreground">Broadcast messages to users and tailors</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader><CardTitle className="text-lg">Compose Notification</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Notification title..." /></div>
          <div><Label>Message</Label><Textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write your message..." rows={4} /></div>
          <div><Label>Target Audience</Label>
            <Select value={form.targetAudience} onValueChange={v => setForm(f => ({ ...f, targetAudience: v as 'all' | 'customers' | 'tailors' }))}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="customers">Customers Only</SelectItem>
                <SelectItem value="tailors">Tailors Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={broadcast} disabled={sending || !form.title.trim() || !form.body.trim()}>
            {sending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Broadcast Notification
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader><CardTitle className="text-lg">Sent Notifications ({notifications.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No notifications sent yet</p>
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
                {notifications.map(n => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{n.body}</TableCell>
                    <TableCell>
                      <Badge variant={n.targetAudience === 'all' ? 'default' : 'secondary'}>{n.targetAudience}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(n.createdAt).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell><Badge variant="outline">{n.readBy.length} read</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteNotif(n.id)}>
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
  const [heroBanner, setHeroBanner] = useState<string>('');
  const [, forceUpdate] = useState(0);

  const load = useCallback(() => {
    setTailors(getAllTailors());
    setFabrics(JSON.parse(localStorage.getItem('adminFabrics') || '[]'));
    setHeroBanner(localStorage.getItem('homeHeroBannerUrl') || '');
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateTailorImage = (tailorId: string, dataUrl: string) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tailor_')) {
        try {
          const d = JSON.parse(localStorage.getItem(key) || '{}');
          if (d.id === tailorId) { d.profileImageUrl = dataUrl; localStorage.setItem(key, JSON.stringify(d)); break; }
        } catch {}
      }
    }
    load();
  };

  const updateListingImage = (listingId: string, dataUrl: string) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tailor_')) {
        try {
          const d: TailorProfile = JSON.parse(localStorage.getItem(key) || '{}');
          const idx = (d.listings || []).findIndex(l => l.id === listingId);
          if (idx !== -1) { d.listings[idx].imageUrl = dataUrl; localStorage.setItem(key, JSON.stringify(d)); break; }
        } catch {}
      }
    }
    load();
  };

  const updateFabricImage = (fabricId: string, dataUrl: string) => {
    const updated = fabrics.map(f => f.id === fabricId ? { ...f, imageUrl: dataUrl } : f);
    localStorage.setItem('adminFabrics', JSON.stringify(updated));
    setFabrics(updated);
  };

  const updateHeroBanner = (dataUrl: string) => {
    localStorage.setItem('homeHeroBannerUrl', dataUrl);
    setHeroBanner(dataUrl);
  };

  const allListings = tailors.flatMap(t => (t.listings || []).map(l => ({ ...l, tailorName: t.shopName || t.ownerName })));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Image Manager</h2>
        <p className="text-muted-foreground">Replace any image across the platform</p>
      </div>

      {/* Homepage Banner */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Homepage Banner</h3>
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
          <div className="w-32 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
            <img src={heroBanner || '/assets/generated/hero-banner.dim_1440x560.png'} alt="Hero Banner" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-medium">Hero Banner</p>
            <p className="text-sm text-muted-foreground mb-2">Main homepage banner image</p>
            <ImageUploadButton label="Replace Banner" onImageSelected={updateHeroBanner} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Tailor Profile Photos */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Briefcase className="w-5 h-5" /> Tailor Profile Photos ({tailors.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tailors.map(tailor => (
            <div key={tailor.id} className="text-center space-y-2">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
                {tailor.profileImageUrl ? (
                  <img src={tailor.profileImageUrl} alt={tailor.shopName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Briefcase className="w-8 h-8 text-muted-foreground" /></div>
                )}
              </div>
              <p className="text-xs font-medium truncate">{tailor.shopName || tailor.ownerName}</p>
              <ImageUploadButton label="Replace" onImageSelected={url => updateTailorImage(tailor.id, url)} />
            </div>
          ))}
          {tailors.length === 0 && <p className="col-span-full text-muted-foreground text-center py-4">No tailors registered</p>}
        </div>
      </div>

      <Separator />

      {/* Product Listing Images */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Package className="w-5 h-5" /> Product Listing Images ({allListings.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allListings.map(listing => (
            <div key={listing.id} className="text-center space-y-2">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
                {listing.imageUrl ? (
                  <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-muted-foreground" /></div>
                )}
              </div>
              <p className="text-xs font-medium truncate">{listing.title}</p>
              <p className="text-xs text-muted-foreground">{listing.tailorName}</p>
              <ImageUploadButton label="Replace" onImageSelected={url => updateListingImage(listing.id, url)} />
            </div>
          ))}
          {allListings.length === 0 && <p className="col-span-full text-muted-foreground text-center py-4">No product listings</p>}
        </div>
      </div>

      <Separator />

      {/* Fabric Swatches */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Palette className="w-5 h-5" /> Fabric Swatches ({fabrics.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {fabrics.map(fabric => (
            <div key={fabric.id} className="text-center space-y-2">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
                {fabric.imageUrl ? (
                  <img src={fabric.imageUrl} alt={fabric.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Palette className="w-6 h-6 text-muted-foreground" /></div>
                )}
              </div>
              <p className="text-xs font-medium">{fabric.label}</p>
              <ImageUploadButton label="Replace" onImageSelected={url => updateFabricImage(fabric.id, url)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminPanel Component ────────────────────────────────────────────────

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customizationPanelOpen, setCustomizationPanelOpen] = useState(false);

  // Initialize localStorage defaults
  useEffect(() => { initLocalStorage(); }, []);

  // Check admin role
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !!identity,
  });

  // Fetch approvals
  const { data: approvals = [], refetch: refetchApprovals } = useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !!identity && !!isAdmin,
  });

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="border-0 shadow-xl p-8 text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground">Please log in to access the admin dashboard.</p>
        </Card>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="border-0 shadow-xl p-8 text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have admin privileges to access this dashboard.</p>
        </Card>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection approvals={approvals} />;
      case 'customers': return <CustomersSection />;
      case 'orders': return <OrdersSection />;
      case 'tailors': return <TailorsSection approvals={approvals} onRefreshApprovals={() => refetchApprovals()} />;
      case 'products': return <ProductsSection />;
      case 'revenue': return <RevenueSection />;
      case 'cities': return <CitiesSection />;
      case 'fabrics': return <FabricsSection />;
      case 'promotions': return <PromotionsSection />;
      case 'notifications': return <NotificationsSection />;
      case 'images': return <ImageManagerSection />;
      default: return <OverviewSection approvals={approvals} />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto
          w-64 bg-card border-r border-border flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
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
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Admin Info */}
          <div className="px-4 py-3 bg-primary/5 border-b border-border">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="font-semibold text-sm text-primary">Krishna</p>
            <p className="text-xs text-muted-foreground truncate">{identity?.getPrincipal().toString().slice(0, 20)}...</p>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-2">
            <nav className="px-2 space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
            <p className="text-xs text-muted-foreground text-center">FitAlso v1.0 • Super Admin</p>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-lg capitalize">
                {NAV_ITEMS.find(n => n.id === activeSection)?.label || 'Dashboard'}
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
              <Button variant="outline" size="sm" onClick={() => refetchApprovals()}>
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

import React, { useEffect, useState, useCallback } from "react";
import { orderService, adminService } from "@/lib/supabase";
import {
  Loader2, CheckCircle, Truck, Package, XCircle,
  RefreshCw, Search, ShieldOff, BarChart3, Clock,
  IndianRupee, ShoppingBag, X, ChevronDown, Phone,
  MapPin, CreditCard, User, Calendar, FileText,
  LayoutDashboard, Users, Settings, LogOut, Tag, Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { AdminProducts } from "./AdminProducts";
import { AdminCoupons } from "./AdminCoupons";
import { AdminSettings } from "./AdminSettings";

// --- Interfaces ---
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  house_no: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  status: string;
  notes?: string;
  admin_notes?: string;
}

// --- Constants & Helpers ---
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { value: "pending_confirmation", label: "Awaiting Conf.", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "shipped", label: "Shipped", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  { value: "delivered", label: "Delivered", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { value: "cancelled", label: "Cancelled", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
];

const FILTER_TABS = [
  { value: "all", label: "All Orders" },
  ...STATUS_OPTIONS,
];

function getStatusStyle(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.color
    ?? "bg-slate-500/10 text-slate-600 border-slate-500/20";
}

function getStatusIcon(status: string) {
  switch (status) {
    case "pending_confirmation": return <RefreshCw className="w-3.5 h-3.5" />;
    case "pending": return <Clock className="w-3.5 h-3.5" />;
    case "confirmed": return <CheckCircle className="w-3.5 h-3.5" />;
    case "shipped": return <Truck className="w-3.5 h-3.5" />;
    case "delivered": return <Package className="w-3.5 h-3.5" />;
    case "cancelled": return <XCircle className="w-3.5 h-3.5" />;
    default: return <Package className="w-3.5 h-3.5" />;
  }
}

function formatDateShort(d: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(d));
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

// ─── Modern Skeleton ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
      <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
      <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
      <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
      <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-200 rounded-full"></div></td>
      <td className="px-6 py-4"><div className="h-8 w-32 bg-slate-200 rounded"></div></td>
    </tr>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, delay }: { icon: React.ReactNode, label: string, value: string | number, sub?: string, delay: number }) {
  return (
    <div 
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500 ease-out"></div>
      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 text-slate-700 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Slide-over Order Detail ──────────────────────────────────────────────────
function OrderDetailDrawer({
  order, onClose, onStatusChange,
}: { order: Order; onClose: () => void; onStatusChange: (id: string, status: string, adminNotes?: string, notes?: string) => Promise<void>; }) {
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes ?? "");
  const [trackingId, setTrackingId] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  useEffect(() => {
    if (order.notes) {
      setTrackingId(order.notes.match(/\[TRACKING_ID: (.*?)\]/)?.[1] || "");
      setTrackingUrl(order.notes.match(/\[TRACKING_URL: (.*?)\]/)?.[1] || "");
    }
  }, [order]);

  const handleSave = async () => {
    setSaving(true);
    let updatedNotes = order.notes || "";
    updatedNotes = updatedNotes.replace(/\n*\[TRACKING_ID:.*?\]/g, "").replace(/\n*\[TRACKING_URL:.*?\]/g, "");
    
    if (newStatus === "shipped" && trackingId) {
      updatedNotes += `\n[TRACKING_ID: ${trackingId}]`;
      if (trackingUrl) updatedNotes += `\n[TRACKING_URL: ${trackingUrl}]`;
    }
    
    await onStatusChange(order.id, newStatus, adminNotes, updatedNotes);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex sm:justify-end flex-col sm:flex-row">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-full sm:max-w-md md:max-w-lg bg-white h-[85vh] sm:h-full shadow-2xl flex flex-col animate-in slide-in-from-bottom-full sm:slide-in-from-right duration-300 sm:border-l border-slate-200 mt-auto sm:mt-0 rounded-t-3xl sm:rounded-none overflow-hidden">
        
        {/* Mobile drag handle */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden bg-white/80">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Order Details</h2>
            <p className="text-sm font-mono text-slate-500 mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors bg-slate-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
          
          {/* Status Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Current Status</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${getStatusStyle(order.status)}`}>
                {getStatusIcon(order.status)}
                {STATUS_OPTIONS.find(s => s.value === order.status)?.label ?? order.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Placed On</p>
              <p className="text-sm font-medium text-slate-900">{formatDateShort(order.created_at)}</p>
            </div>
          </div>

          {/* Grid Layout for Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Customer */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-slate-400" /> Customer
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium text-slate-900">{order.user_name}</p>
                <p className="text-slate-600 break-all">{order.user_email}</p>
                <p className="text-slate-600">{order.user_phone}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-100 pb-2">
                <CreditCard className="w-4 h-4 text-slate-400" /> Payment
              </div>
              <div className="text-sm space-y-1">
                <p className="text-slate-600">
                  {order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-slate-400" /> Delivery Address
            </div>
            <div className="text-sm text-slate-600 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p>{order.house_no}, {order.street}</p>
              {order.landmark && <p>Near {order.landmark}</p>}
              <p>{order.city}, {order.state} — {order.pincode}</p>
            </div>
          </div>

          {/* Customer Notes & Receipt */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-slate-400" /> Notes & Payment
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              
              {/* Clean Notes */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Customer Instructions</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {order.notes?.replace(/\[PAYMENT_RECEIPT:.*\]/g, '').replace(/\[TRACKING_ID:.*\]/g, '').replace(/\[TRACKING_URL:.*\]/g, '').trim() || "No special instructions provided."}
                </p>
              </div>

              {/* Receipt Image */}
              {order.notes?.match(/\[PAYMENT_RECEIPT: (.*?)\]/) && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5" /> Payment Screenshot
                  </p>
                  <a 
                    href={order.notes.match(/\[PAYMENT_RECEIPT: (.*?)\]/)?.[1]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative block w-full aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-10">
                      <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                        View Full Image
                      </span>
                    </div>
                    <img 
                      src={order.notes.match(/\[PAYMENT_RECEIPT: (.*?)\]/)?.[1]} 
                      alt="Payment Receipt" 
                      className="w-full h-full object-cover"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <ShoppingBag className="w-4 h-4 text-slate-400" /> Order Items
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {order.items?.length ?? 0}
              </span>
            </div>
            <div className="space-y-2">
              {(order.items ?? []).map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-slate-50" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Package className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4 sticky bottom-0 z-10 pb-8 sm:pb-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Update Status</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="bg-white border-slate-200 h-10 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[200]">
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {newStatus === "shipped" && (
              <div className="space-y-3 mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tracking ID</label>
                  <Input placeholder="e.g. AWB123456789" value={trackingId} onChange={e => setTrackingId(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Tracking URL (Optional)</label>
                  <Input placeholder="e.g. https://delhivery.com/track/..." value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} />
                </div>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleSave}
            disabled={saving || (
              newStatus === order.status && 
              adminNotes === (order.admin_notes || "") && 
              trackingId === (order.notes?.match(/\[TRACKING_ID: (.*?)\]/)?.[1] || "") && 
              trackingUrl === (order.notes?.match(/\[TRACKING_URL: (.*?)\]/)?.[1] || "")
            )}
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ───────────────────────────────────────────────────
export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<"orders" | "products" | "coupons">("orders");

  // We render layout immediately. Only the table shows a skeleton.
  const fetchOrders = useCallback(async () => {
    setDataLoading(true);
    setError(null);
    const data = await orderService.getAllOrders();
    if (data) {
      setOrders(data as Order[]);
    } else {
      setOrders([]); // Don't crash UI, just show empty
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setDataLoading(false);
      return;
    }

    adminService.isAdmin(user.id).then(({ isAdmin: adminCheck }) => {
      setIsAdmin(adminCheck);
      if (adminCheck) fetchOrders();
      else setDataLoading(false);
    }).catch(() => {
      setIsAdmin(false);
      setDataLoading(false);
    });
  }, [user, fetchOrders]);

  const handleStatusChange = async (orderId: string, status: string, adminNotes?: string, notes?: string) => {
    const res = await orderService.updateOrderStatus(orderId, status, adminNotes, notes);
    if (res.success) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status, admin_notes: adminNotes ?? o.admin_notes, notes: notes ?? o.notes } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status, admin_notes: adminNotes ?? prev.admin_notes, notes: notes ?? prev.notes } : null);
      }
      toast.success("Order updated successfully!");
    } else {
      toast.error("Failed to update order");
    }
  };

  // ── Render Guards ──
  // Instead of a full screen loader, if we don't know admin status yet, we show a sleek minimal loader
  if (isAdmin === null && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-4" />
        <p className="text-slate-500 font-medium">Authenticating workspace...</p>
      </div>
    );
  }

  if (!user || isAdmin === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 mb-6">
          <ShieldOff className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Access Denied</h1>
        <p className="text-slate-500 mt-2 max-w-sm text-center">You do not have the required permissions to access the command center.</p>
        <Button onClick={() => window.location.href = "/"} className="mt-8 bg-slate-900 text-white rounded-full px-8 h-12 shadow-lg hover:shadow-xl transition-all">
          Return to Storefront
        </Button>
      </div>
    );
  }

  // ── Compute Stats ──
  const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + Number(o.total), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const pendingConfirmCount = orders.filter((o) => o.status === "pending_confirmation").length;

  // ── Filter Data ──
  const filtered = orders.filter((o) => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || o.user_name?.toLowerCase().includes(q) || o.user_email?.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans pb-20 lg:pb-0 overflow-x-hidden w-full">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-col hidden lg:flex fixed inset-y-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-wide">Command Center</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Menu</div>
          <button 
            onClick={() => setCurrentView("orders")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${currentView === 'orders' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <ShoppingBag className="w-5 h-5" /> Orders
          </button>
          <button 
            onClick={() => setCurrentView("products")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${currentView === 'products' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Package className="w-5 h-5" /> Products
          </button>
          <button 
            onClick={() => setCurrentView("coupons")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${currentView === 'coupons' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Tag className="w-5 h-5" /> Coupons
          </button>
          <button 
            onClick={() => setCurrentView("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${currentView === 'settings' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => window.location.href = "/"} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Exit to Store
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0 w-full overflow-x-hidden">
        


        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 min-w-0">
          
          {currentView === 'products' && <AdminProducts />}
          {currentView === 'coupons' && <AdminCoupons />}
          {currentView === 'settings' && <AdminSettings />}
          
          {currentView === 'orders' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard icon={<ShoppingBag />} label="Total Orders" value={orders.length} delay={0} />
            <StatCard icon={<IndianRupee />} label="Revenue" value={formatCurrency(totalRevenue)} delay={100} />
            <StatCard icon={<Clock />} label="Pending COD" value={pendingCount} delay={200} />
            <StatCard icon={<RefreshCw />} label="Awaiting Payment" value={pendingConfirmCount} delay={300} />
          </div>

          {/* Controls Table Header */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Toolbar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-50/50">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="Search orders..." 
                  className="pl-9 bg-white border-slate-200 shadow-sm rounded-full h-10 focus:ring-indigo-500"
                />
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {FILTER_TABS.map((tab) => {
                  const count = tab.value === "all" ? orders.length : orders.filter((o) => o.status === tab.value).length;
                  const isActive = activeTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                        isActive 
                          ? "bg-slate-900 text-white shadow-md" 
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {tab.label}
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none ${isActive ? "bg-white/20" : "bg-slate-100"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Card View (Visible only on small screens) */}
            <div className="block sm:hidden divide-y divide-slate-100">
              {dataLoading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex flex-col gap-3 p-4 border border-slate-100 rounded-xl bg-white">
                      <div className="flex justify-between"><div className="h-4 w-24 bg-slate-200 rounded"></div><div className="h-6 w-20 bg-slate-200 rounded-full"></div></div>
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 mb-3">
                    <Package className="w-6 h-6 text-slate-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">No orders found</h3>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="p-4 space-y-3 bg-slate-50/50">
                  {filtered.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 active:scale-[0.98] transition-transform"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-mono text-xs font-medium text-slate-500 mb-0.5">{order.id.slice(0, 8)}</p>
                          <p className="text-sm font-bold text-slate-900">{order.user_name}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {STATUS_OPTIONS.find(s => s.value === order.status)?.label ?? order.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-end mt-2 pt-3 border-t border-slate-50">
                        <div>
                          <p className="text-xs text-slate-400">{formatDateShort(order.created_at)}</p>
                          <p className="text-[10px] font-medium text-slate-500 mt-0.5 uppercase tracking-wider">
                            {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Paid'}
                          </p>
                        </div>
                        <p className="text-base font-bold text-slate-900">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Table View (Hidden on small screens) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {dataLoading ? (
                    <>
                      <SkeletonRow /><SkeletonRow /><SkeletonRow />
                    </>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-24 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                          <Package className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">No orders found</h3>
                        <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => (
                      <tr 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <p className="font-mono text-xs font-medium text-slate-600">{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-slate-400 mt-1">{formatDateShort(order.created_at)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900">{order.user_name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{order.user_email}</p>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className="text-sm font-bold text-slate-900">{formatCurrency(order.total)}</p>
                          <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wide">
                            {order.payment_method === 'cod' ? 'COD' : 'Paid'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="hidden sm:inline">{STATUS_OPTIONS.find(s => s.value === order.status)?.label ?? order.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            {!dataLoading && filtered.length > 0 && (
              <div className="bg-slate-50 border-t border-slate-100 px-4 sm:px-6 py-3 text-center sm:text-left">
                <p className="text-xs text-slate-500 font-medium">Showing {filtered.length} results</p>
              </div>
            )}
            </div>
          </>
        )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setCurrentView("orders")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'orders' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Orders</span>
          </button>
          <button 
            onClick={() => setCurrentView("products")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'products' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-medium">Products</span>
          </button>
          <button 
            onClick={() => setCurrentView("coupons")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'coupons' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Tag className="w-5 h-5" />
            <span className="text-[10px] font-medium">Coupons</span>
          </button>
          <button 
            onClick={() => setCurrentView("settings")}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase"; // Import supabase client
import { Loader2, Package, Calendar, MapPin, CreditCard } from "lucide-react";

export interface Order {
  id: string;
  user_id: string;
  items: any[];
  total: number;
  status: string;
  payment_method: string;
  user_name?: string;
  house_no?: string;
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  user_phone?: string;
  created_at: string;
  delivery_date?: string;
  tracking_id?: string;
  notes?: string;
}

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
      setSelectedOrder(null);
    }
  }, [isOpen, user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // Fetch orders from Supabase
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(ordersData || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "shipped":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "processing":
      case "pending_confirmation":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "cancelled":
        return "text-rose-600 bg-rose-50 border-rose-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full h-[90vh] sm:h-[85vh] sm:max-h-[85vh] overflow-y-auto border-0 bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl mt-auto sm:mt-0 px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold text-gray-900">
            {selectedOrder ? "Order Details" : "Your Orders"}
          </DialogTitle>
        </DialogHeader>

        {selectedOrder ? (
          // Order Details View
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
                  <p className="font-mono font-bold text-slate-900">{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-end border-t border-slate-200 pt-4 mt-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Order Date</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-lg font-black text-slate-900">₹{selectedOrder.total}</p>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {selectedOrder.notes && selectedOrder.notes.includes('[TRACKING_ID:') && (
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Package size={64} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2 relative z-10">
                  <Package size={18} className="text-indigo-600" />
                  Package Shipped!
                </h3>
                <div className="relative z-10 space-y-4">
                  <div>
                    <p className="text-xs font-medium text-indigo-600/70 uppercase tracking-wider mb-1">Tracking ID</p>
                    <p className="font-mono font-bold text-indigo-950 text-lg">
                      {selectedOrder.notes.match(/\[TRACKING_ID: (.*?)\]/)?.[1]}
                    </p>
                  </div>
                  
                  {selectedOrder.notes.match(/\[TRACKING_URL: (.*?)\]/) ? (
                    <a 
                      href={selectedOrder.notes.match(/\[TRACKING_URL: (.*?)\]/)?.[1]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-indigo-200"
                    >
                      Track Package Online
                    </a>
                  ) : (
                    <a 
                      href={`https://www.google.com/search?q=track+${selectedOrder.notes.match(/\[TRACKING_ID: (.*?)\]/)?.[1]}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-sm"
                    >
                      Search Tracking ID
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Address & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin size={14} /> Delivery
                </h3>
                <div className="text-sm text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">{selectedOrder.user_name}</p>
                  <p>{selectedOrder.house_no}, {selectedOrder.street}</p>
                  {selectedOrder.landmark && <p>Near {selectedOrder.landmark}</p>}
                  <p>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                  <p className="pt-2 mt-2 border-t border-slate-200 font-medium">{selectedOrder.user_phone}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CreditCard size={14} /> Payment
                </h3>
                <div className="text-sm text-slate-700 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Method</p>
                    <p className="font-medium text-slate-900">
                      {selectedOrder.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Status</p>
                    <p className="font-medium text-slate-900">
                      {selectedOrder.status === 'pending' || selectedOrder.status === 'pending_confirmation' ? 'Unpaid / Pending' : 'Verified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                <Package size={14} /> Order Items
              </h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-50" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{item.name}</p>
                      <p className="text-sm text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4 pb-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto px-6 py-2.5 text-center text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
              >
                ← Back to All Orders
              </button>
            </div>
          </div>
        ) : (
          // Orders List View
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="text-indigo-600 animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package size={32} className="text-slate-400" />
                </div>
                <p className="text-lg text-slate-900 font-bold mb-2">No orders yet</p>
                <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Start shopping to discover our collection and create your first order!
                </p>
                <button onClick={onClose} className="mt-8 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium transition-colors">
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="w-full text-left p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group bg-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900 font-mono">
                            #{order.id.slice(0, 8)}
                          </p>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                          <Calendar size={12} />
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">₹{order.total}</p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          {order.payment_method === "cod" ? "COD" : "Online"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package size={12} className="text-slate-400" />
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-500">+{order.items.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                      <div className="ml-auto text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-semibold flex items-center gap-1">View Details →</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

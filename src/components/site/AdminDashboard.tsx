import React, { useEffect, useState } from "react";
import { orderService, adminService } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LogOut, Package, DollarSign, TrendingUp, Search, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Order {
  id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: any[];
  house_no: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  admin_notes: string;
}

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    todayRevenue: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        console.log("No user logged in");
        setIsLoading(false);
        return;
      }

      console.log("Checking admin status for UID:", user.uid);
      const result = await adminService.isAdmin(user.uid);
      console.log("Admin check result:", result);
      
      setIsAdmin(result.isAdmin);
      setIsLoading(false);

      if (!result.isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
      }
    };

    checkAdmin();
  }, [user, toast]);

  // Fetch orders and stats
  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      const ordersResult = await orderService.getAllOrders();
      if (ordersResult.success) {
        setOrders(ordersResult.data);
        setFilteredOrders(ordersResult.data);
      }

      const statsResult = await orderService.getOrderCountByStatus();
      const revenueResult = await orderService.getTodayRevenue();

      if (statsResult.success && revenueResult.success) {
        setStats({
          total: Object.values(statsResult.data).reduce((a: number, b: number) => a + b, 0),
          pending: statsResult.data["pending"] || 0,
          processing: statsResult.data["processing"] || 0,
          shipped: statsResult.data["shipped"] || 0,
          delivered: statsResult.data["delivered"] || 0,
          todayRevenue: revenueResult.data || 0,
        });
      }
    };

    fetchData();
  }, [isAdmin]);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (o) =>
          o.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.user_phone.includes(searchQuery)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const result = await orderService.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
      // Refresh orders
      const ordersResult = await orderService.getAllOrders();
      if (ordersResult.success) {
        setOrders(ordersResult.data);
      }
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have admin privileges</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => logout()}>Logout</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Shades by Mahie <span className="text-sm text-muted-foreground">Admin</span>
          </h1>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <Badge className="mt-2 bg-yellow-100 text-yellow-800">Action needed</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.processing}</div>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Shipped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.shipped}</div>
              <p className="text-xs text-muted-foreground mt-1">On the way</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ₹{stats.todayRevenue.toLocaleString("en-IN")}
              </div>
              <Badge className="mt-2 bg-green-100 text-green-800">Delivered</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Management</CardTitle>
            <CardDescription>Manage customer orders and track shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="processing" onClick={() => setStatusFilter("processing")}>
                  Processing ({stats.processing})
                </TabsTrigger>
                <TabsTrigger value="shipped" onClick={() => setStatusFilter("shipped")}>
                  Shipped ({stats.shipped})
                </TabsTrigger>
                <TabsTrigger value="delivered" onClick={() => setStatusFilter("delivered")}>
                  Delivered ({stats.delivered})
                </TabsTrigger>
              </TabsList>

              {/* Search Bar */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Customer</th>
                          <th className="text-left py-3 px-4 font-semibold">Email</th>
                          <th className="text-left py-3 px-4 font-semibold">Phone</th>
                          <th className="text-left py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Payment</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                          <th className="text-left py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b border-border hover:bg-secondary/50">
                            <td className="py-3 px-4">{order.user_name}</td>
                            <td className="py-3 px-4 text-xs text-muted-foreground">
                              {order.user_email}
                            </td>
                            <td className="py-3 px-4 text-sm">{order.user_phone}</td>
                            <td className="py-3 px-4 font-semibold">
                              ₹{order.total.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">
                                {order.payment_method === "cod" ? "COD" : "Online"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-xs text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>Order #{selectedOrder.id.slice(0, 8)}</CardTitle>
                  <CardDescription>
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  ✕
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedOrder.user_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedOrder.user_email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedOrder.user_phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-medium">
                        {selectedOrder.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-sm">
                    {selectedOrder.house_no}, {selectedOrder.street}
                    {selectedOrder.landmark && `, ${selectedOrder.landmark}`}
                  </p>
                  <p className="text-sm">
                    {selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm border-b pb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{selectedOrder.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="font-semibold mb-2">Update Status</h3>
                  <div className="flex gap-2">
                    <Select defaultValue={selectedOrder.status}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={async () => {
                        const select = document.querySelector('[role="combobox"]') as any;
                        const newStatus = select?.innerText || selectedOrder.status;
                        await updateOrderStatus(selectedOrder.id, newStatus);
                        setSelectedOrder(null);
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedOrder.admin_notes && (
                  <div className="bg-secondary/50 p-3 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Admin Notes</p>
                    <p className="text-sm">{selectedOrder.admin_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

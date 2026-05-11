import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are not set");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Order Service - Database operations
export const orderService = {
  // Create new order
  async createOrder(orderData: {
    user_id: string;
    user_email: string;
    user_name: string;
    user_phone: string;
    house_no: string;
    street: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    items: any[];
    total: number;
    payment_method: string;
  }) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            ...orderData,
            status: "pending",
            admin_notes: "",
          },
        ])
        .select();

      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error("Error creating order:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all orders (admin only)
  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Get orders by status
  async getOrdersByStatus(status: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error("Error fetching orders by status:", error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Get single order
  async getOrderById(orderId: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching order:", error);
      return { success: false, error: error.message };
    }
  },

  // Update order status
  async updateOrderStatus(
    orderId: string,
    status: string,
    adminNotes?: string
  ) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          status,
          admin_notes: adminNotes || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select();

      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error("Error updating order:", error);
      return { success: false, error: error.message };
    }
  },

  // Get user orders
  async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error("Error fetching user orders:", error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Get orders count by status
  async getOrderCountByStatus() {
    try {
      const statuses = ["pending", "processing", "shipped", "delivered"];
      const counts: Record<string, number> = {};

      for (const status of statuses) {
        const { count, error } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", status);

        if (error) throw error;
        counts[status] = count || 0;
      }

      return { success: true, data: counts };
    } catch (error: any) {
      console.error("Error fetching order counts:", error);
      return { success: false, error: error.message };
    }
  },

  // Get today's revenue
  async getTodayRevenue() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("orders")
        .select("total")
        .gte("created_at", today.toISOString())
        .eq("status", "delivered");

      if (error) throw error;

      const total = data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      return { success: true, data: total };
    } catch (error: any) {
      console.error("Error fetching today's revenue:", error);
      return { success: false, error: error.message, data: 0 };
    }
  },

  // Search orders
  async searchOrders(query: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(
          `user_name.ilike.%${query}%,user_email.ilike.%${query}%,user_phone.ilike.%${query}%`
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error("Error searching orders:", error);
      return { success: false, error: error.message, data: [] };
    }
  },
};

// Admin Service
export const adminService = {
  // Add admin user
  async addAdminUser(firebaseUid: string, email: string, name: string) {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .insert([
          {
            firebase_uid: firebaseUid,
            email,
            name,
            role: "admin",
            is_active: true,
          },
        ])
        .select();

      if (error) throw error;
      return { success: true, data: data?.[0] };
    } catch (error: any) {
      console.error("Error adding admin user:", error);
      return { success: false, error: error.message };
    }
  },

  // Check if user is admin
  async isAdmin(firebaseUid: string) {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("firebase_uid", firebaseUid)
        .eq("is_active", true);

      if (error) {
        console.error("Admin check error:", error);
        return { success: false, isAdmin: false };
      }
      
      const isAdminUser = data && data.length > 0;
      console.log("Admin check result:", { firebaseUid, isAdminUser, data });
      return { success: true, isAdmin: isAdminUser };
    } catch (error: any) {
      console.error("Error checking admin status:", error);
      return { success: false, isAdmin: false };
    }
  },

  // Get admin user
  async getAdminUser(firebaseUid: string) {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("firebase_uid", firebaseUid)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching admin user:", error);
      return { success: false, error: error.message };
    }
  },
};

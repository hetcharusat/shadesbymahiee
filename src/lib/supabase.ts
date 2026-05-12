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
    status: string;
    notes?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select();

      if (error) throw error;
      
      const newOrder = data?.[0];
      if (newOrder && (newOrder.status === 'confirmed' || newOrder.status === 'pending_confirmation')) {
        try {
          // Trigger email notification for new order
          supabase.functions.invoke('send-email', {
            body: {
              orderId: newOrder.id,
              customerEmail: newOrder.user_email,
              customerName: newOrder.user_name,
              status: 'confirmed', // We treat new orders as confirmed for email purposes, or 'pending' if you prefer
              totalAmount: newOrder.total
            }
          }).catch(err => console.error("Email function error:", err));
        } catch (e) {}
      }

      return { success: true, data: newOrder };
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

      if (error) {
        // Don't throw here, let the UI handle the error message
        console.error("Error fetching all orders:", error);
        return null;
      }
      return data;
    } catch (error: any) {
      console.error("Caught exception in getAllOrders:", error);
      return null;
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
    adminNotes?: string,
    notes?: string
  ) {
    try {
      const updateData: { status: string; admin_notes?: string; notes?: string; updated_at: string } = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId)
        .select();

      if (error) throw error;
      
      const updatedOrder = data?.[0];
      if (updatedOrder && (status === 'shipped' || status === 'confirmed')) {
        try {
          let trackingId = "";
          let trackingUrl = "";
          if (updatedOrder.notes) {
            trackingId = updatedOrder.notes.match(/\[TRACKING_ID: (.*?)\]/)?.[1] || "";
            trackingUrl = updatedOrder.notes.match(/\[TRACKING_URL: (.*?)\]/)?.[1] || "";
          }

          supabase.functions.invoke('send-email', {
            body: {
              orderId: updatedOrder.id,
              customerEmail: updatedOrder.user_email,
              customerName: updatedOrder.user_name,
              status: status,
              trackingId,
              trackingUrl,
              totalAmount: updatedOrder.total
            }
          }).catch(err => console.error("Email function error:", err));
        } catch (e) {}
      }

      return { success: true, data: updatedOrder };
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
  // Check if user is admin
  async isAdmin(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Admin check error:", error);
        return { success: false, isAdmin: false };
      }
      
      const isAdminUser = data?.role === 'admin';
      console.log("Admin check result:", { userId, isAdminUser, role: data?.role });
      return { success: true, isAdmin: isAdminUser };
    } catch (error: any) {
      console.error("Error checking admin status:", error);
      return { success: false, isAdmin: false };
    }
  },
};

// --- Product Service ---
export const productService = {
  // Get all active products for the storefront
  async getActiveProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching active products:", error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Get all products (Admin only)
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching all products:", error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Add a new product
  async addProduct(productData: any) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error: any) {
      console.error("Error adding product:", error);
      return { success: false, error: error.message };
    }
  },

  // Update a product
  async updateProduct(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error: any) {
      console.error("Error updating product:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete a product
  async deleteProduct(id: string) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }
  },

  // Upload product image
  async uploadImage(file: File, fileName: string) {
    try {
      const { data, error } = await supabase.storage
        .from("product_images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from("product_images")
        .getPublicUrl(fileName);
        
      return { success: true, url: urlData.publicUrl };
    } catch (error: any) {
      console.error("Error uploading image:", error);
      return { success: false, error: error.message };
    }
  }
};

// --- Coupon Service ---
export const couponService = {
  // Validate coupon (Storefront)
  async validateCoupon(code: string, cartTotal: number) {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        return { success: false, error: "Invalid or expired coupon code." };
      }

      if (data.min_order_value && cartTotal < data.min_order_value) {
        return { success: false, error: `Minimum order value for this coupon is ₹${data.min_order_value}.` };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Error validating coupon:", error);
      return { success: false, error: "Invalid coupon code." };
    }
  },

  // Admin: Get all coupons
  async getAllCoupons() {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching coupons:", error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Admin: Add coupon
  async addCoupon(couponData: any) {
    try {
      // Force uppercase
      couponData.code = couponData.code.toUpperCase();
      const { data, error } = await supabase
        .from("coupons")
        .insert([couponData])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error: any) {
      console.error("Error adding coupon:", error);
      return { success: false, error: error.message };
    }
  },

  // Admin: Update coupon
  async updateCoupon(id: string, updates: any) {
    try {
      if (updates.code) updates.code = updates.code.toUpperCase();
      const { data, error } = await supabase
        .from("coupons")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error: any) {
      console.error("Error updating coupon:", error);
      return { success: false, error: error.message };
    }
  },

  // Admin: Delete coupon
  async deleteCoupon(id: string) {
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting coupon:", error);
      return { success: false, error: error.message };
    }
  }
};

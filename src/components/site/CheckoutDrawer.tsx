import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  X, ShoppingBag, MapPin, CreditCard, ChevronLeft, ChevronRight,
  Minus, Plus, Trash2, Tag, Loader2, Upload, ShieldCheck, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { orderService, couponService, productService, supabase } from "@/lib/supabase";
import qrImage from "@/assets/qr.jpg";

interface CheckoutDrawerProps {
  onSuccess?: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export function CheckoutDrawer({ onSuccess }: CheckoutDrawerProps) {
  const { 
    items, itemCount, subtotal, getTotalPrice, 
    discountAmount, appliedCoupon, setAppliedCoupon, 
    isDrawerOpen, closeDrawer, updateQuantity, removeItem 
  } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();

  const [step, setStep] = useState<"cart" | "address" | "payment" | "online">("cart");
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward
  const [isLoading, setIsLoading] = useState(false);

  // Cart State
  const [couponInput, setCouponInput] = useState("");
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);

  // Address State
  const [addressData, setAddressData] = useState({
    fullName: "", email: user?.email || "", phone: "",
    houseNo: "", street: "", landmark: "", city: "", state: "", pincode: "", instructions: ""
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Preload QR Code
  useEffect(() => {
    const img = new Image();
    img.src = supabase.storage.from("product_images").getPublicUrl("qr_code.jpg").data.publicUrl;
  }, []);

  // Update email if user logs in while drawer is open
  useEffect(() => {
    if (user?.email) {
      setAddressData(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  // Reset to cart step when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      setStep("cart");
      setDirection(1);
    }
  }, [isDrawerOpen]);

  const navigateTo = (newStep: typeof step, dir: number) => {
    setDirection(dir);
    setStep(newStep);
  };

  // --- Handlers ---
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setVerifyingCoupon(true);
    const res = await couponService.validateCoupon(couponInput, subtotal);
    if (res.success) {
      setAppliedCoupon(res.data);
      toast.success("Coupon applied successfully!");
      setCouponInput("");
    } else {
      toast.error(res.error);
    }
    setVerifyingCoupon(false);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressData.fullName || !addressData.phone || !addressData.houseNo || !addressData.street || !addressData.city || !addressData.state || !addressData.pincode) {
      toast.error("Please fill in all required fields.");
      return;
    }
    navigateTo("payment", 1);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) return toast.error("Please upload an image file");
      if (file.size > 5 * 1024 * 1024) return toast.error("File must be less than 5MB");
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) return toast.error("Please log in to place an order");
    try {
      setIsLoading(true);
      let finalNotes = addressData.instructions + (appliedCoupon ? `\n[Coupon Applied: ${appliedCoupon.code} for ₹${discountAmount}]` : '');
      
      if (paymentMethod === "online" && screenshotFile) {
        const fileName = `receipts/${Date.now()}_${screenshotFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const uploadRes = await productService.uploadImage(screenshotFile, fileName);
        if (uploadRes.success) {
          finalNotes += `\n\n[PAYMENT_RECEIPT: ${uploadRes.url}]`;
        } else {
          toast.error("Failed to upload payment screenshot. Order not placed.");
          setIsLoading(false);
          return;
        }
      }

      await orderService.createOrder({
        user_id: user.id,
        user_email: addressData.email,
        user_name: addressData.fullName,
        user_phone: addressData.phone,
        house_no: addressData.houseNo,
        street: addressData.street,
        landmark: addressData.landmark,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        total: getTotalPrice(),
        payment_method: paymentMethod,
        status: paymentMethod === "cod" ? "pending" : "pending_confirmation",
        notes: finalNotes,
      });

      toast.success("Order Placed successfully! 🎉");
      setTimeout(() => {
        onSuccess?.();
        closeDrawer();
        window.location.href = "/";
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDrawerOpen) return null;

  // --- Step Rendering Helpers ---
  const renderHeader = (title: string, icon: React.ReactNode, backAction?: () => void) => (
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        {backAction && (
          <button onClick={backAction} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white shadow-2xl outline-none">
        <div className="relative flex-1 overflow-hidden flex flex-col">
          <AnimatePresence initial={false} custom={direction}>
            {step === "cart" && (
              <motion.div
                key="cart" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="absolute inset-0 flex flex-col bg-slate-50/50"
              >
                {renderHeader("Your Cart", <ShoppingBag className="w-4 h-4" />)}
                
                <div className="flex-1 overflow-y-auto px-4 py-6">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                      <ShoppingBag className="w-16 h-16 opacity-20" />
                      <p className="font-medium text-slate-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm">{item.name}</h3>
                              <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-500">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded-md transition-colors"><Minus className="w-3 h-3" /></button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded-md transition-colors"><Plus className="w-3 h-3" /></button>
                              </div>
                              <p className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-6 bg-white border-t border-slate-100 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    {/* Coupon */}
                    <div className="space-y-2">
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                          <div className="flex items-center gap-2"><Tag className="w-4 h-4" /><span className="text-sm font-bold">{appliedCoupon.code} applied!</span></div>
                          <button onClick={() => setAppliedCoupon(null)} className="text-xs hover:underline">Remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="Promo code" className="uppercase" />
                          <Button onClick={handleApplyCoupon} disabled={verifyingCoupon || !couponInput} variant="secondary" className="font-semibold">
                            {verifyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 text-sm">
                      <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span></div>
                      {appliedCoupon && <div className="flex justify-between text-emerald-600 font-medium"><span>Discount</span><span>- ₹{discountAmount.toLocaleString("en-IN")}</span></div>}
                      <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-100"><span>Total</span><span>₹{getTotalPrice().toLocaleString("en-IN")}</span></div>
                    </div>

                    <Button onClick={() => {
                      if (!user) return setIsAuthModalOpen(true);
                      navigateTo("address", 1);
                    }} className="w-full bg-slate-900 text-white rounded-xl py-6 text-base font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform">
                      {user ? "Secure Checkout" : "Login to Checkout"} <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {step === "address" && (
              <motion.div
                key="address" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="absolute inset-0 flex flex-col bg-white"
              >
                {renderHeader("Delivery Address", <MapPin className="w-4 h-4" />, () => navigateTo("cart", -1))}
                <form id="address-form" onSubmit={handleAddressSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><Label>Full Name*</Label><Input required value={addressData.fullName} onChange={e => setAddressData(d => ({ ...d, fullName: e.target.value }))} className="bg-slate-50" /></div>
                      <div className="space-y-1"><Label>Phone*</Label><Input required type="tel" value={addressData.phone} onChange={e => setAddressData(d => ({ ...d, phone: e.target.value }))} className="bg-slate-50" /></div>
                    </div>
                    <div className="space-y-1"><Label>House / Flat No.*</Label><Input required value={addressData.houseNo} onChange={e => setAddressData(d => ({ ...d, houseNo: e.target.value }))} className="bg-slate-50" /></div>
                    <div className="space-y-1"><Label>Street / Area*</Label><Input required value={addressData.street} onChange={e => setAddressData(d => ({ ...d, street: e.target.value }))} className="bg-slate-50" /></div>
                    <div className="space-y-1"><Label>Landmark</Label><Input value={addressData.landmark} onChange={e => setAddressData(d => ({ ...d, landmark: e.target.value }))} className="bg-slate-50" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><Label>City*</Label><Input required value={addressData.city} onChange={e => setAddressData(d => ({ ...d, city: e.target.value }))} className="bg-slate-50" /></div>
                      <div className="space-y-1"><Label>Pincode*</Label><Input required value={addressData.pincode} onChange={e => setAddressData(d => ({ ...d, pincode: e.target.value }))} className="bg-slate-50" /></div>
                    </div>
                    <div className="space-y-1"><Label>State*</Label><Input required value={addressData.state} onChange={e => setAddressData(d => ({ ...d, state: e.target.value }))} className="bg-slate-50" /></div>
                    <div className="space-y-1"><Label>Delivery Notes</Label><Textarea value={addressData.instructions} onChange={e => setAddressData(d => ({ ...d, instructions: e.target.value }))} className="bg-slate-50 min-h-20" placeholder="e.g. Leave at door" /></div>
                  </div>
                </form>
                <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                  <Button form="address-form" type="submit" className="w-full bg-slate-900 text-white rounded-xl py-6 text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform">
                    Continue to Payment <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div
                key="payment" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="absolute inset-0 flex flex-col bg-slate-50/50"
              >
                {renderHeader("Payment", <CreditCard className="w-4 h-4" />, () => navigateTo("address", -1))}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Order Summary Summary */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
                    <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider text-slate-500">Summary</h3>
                    <div className="flex justify-between text-sm text-slate-600"><span>Items ({itemCount})</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                    {appliedCoupon && <div className="flex justify-between text-sm text-emerald-600 font-medium"><span>Discount ({appliedCoupon.code})</span><span>- ₹{discountAmount.toLocaleString("en-IN")}</span></div>}
                    <div className="flex justify-between font-bold text-lg text-slate-900 pt-3 border-t border-slate-50 mt-3"><span>To Pay</span><span>₹{getTotalPrice().toLocaleString("en-IN")}</span></div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-500">Payment Method</h3>
                    
                    <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="mt-1" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">UPI / Online Payment</p>
                        <p className="text-sm text-slate-500 mt-1">Pay via GPay, PhonePe, Paytm, or any UPI app. (Instant confirmation)</p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">Cash on Delivery</p>
                        <p className="text-sm text-slate-500 mt-1">Pay when your artwork arrives at your doorstep.</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                  <Button 
                    onClick={() => paymentMethod === 'online' ? navigateTo('online', 1) : handlePlaceOrder()} 
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white rounded-xl py-6 text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : paymentMethod === 'cod' ? "Place Order (COD)" : "Pay Now"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "online" && (
              <motion.div
                key="online" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="absolute inset-0 flex flex-col bg-white"
              >
                {renderHeader("Complete Payment", <ShieldCheck className="w-4 h-4" />, () => navigateTo("payment", -1))}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col items-center text-center">
                  <p className="text-sm text-slate-500">Scan this QR code with your UPI app to pay</p>
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 inline-block shadow-sm relative">
                    <img 
                      src={supabase.storage.from("product_images").getPublicUrl("qr_code.jpg").data.publicUrl} 
                      onError={(e) => { e.currentTarget.src = qrImage; }}
                      alt="Payment QR" 
                      className="w-48 h-48 rounded-2xl object-cover mix-blend-multiply" 
                    />
                  </div>
                  <div className="font-bold text-3xl text-slate-900">₹{getTotalPrice().toLocaleString("en-IN")}</div>

                  <div className="w-full border-t border-slate-100 pt-6 space-y-4">
                    <p className="font-bold text-slate-900 text-sm text-left">Upload Payment Screenshot</p>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-200 rounded-2xl cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 text-indigo-500 mb-2" />
                        <p className="text-sm font-semibold text-indigo-700">Click to upload screenshot</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotChange} />
                    </label>
                    {previewUrl && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Uploaded
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                  <Button 
                    onClick={handlePlaceOrder} 
                    disabled={isLoading || !screenshotFile}
                    className="w-full bg-slate-900 text-white rounded-xl py-6 text-base font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Payment"}
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

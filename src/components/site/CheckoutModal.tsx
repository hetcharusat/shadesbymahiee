import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { orderService } from "@/lib/supabase";
import qrImage from "@/assets/qr.jpg"; // Fallback placeholder

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  userEmail?: string;
  userId?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  cartItems,
  totalPrice,
  userEmail = "",
  userId = "",
}) => {
  const { toast } = useToast();

  const [step, setStep] = useState<"address" | "payment" | "online-payment">("address");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"cod" | "online">("cod");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Address Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [savedAddress, setSavedAddress] = useState<any>(null);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !houseNo || !street || !city || !state || !pincode) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const address = {
      id: Date.now().toString(),
      fullName,
      email,
      phone,
      houseNo,
      street,
      landmark,
      city,
      state,
      pincode,
      isDefault: true,
    };

    setSavedAddress(address);
    setStep("payment");
  };

  const handlePaymentMethodSelect = (method: "cod" | "online") => {
    setSelectedPayment(method);
    if (method === "online") {
      setStep("online-payment");
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = async () => {
    if (!savedAddress || !userId) return;

    try {
      setIsLoading(true);

      // Save to Firebase
      const ordersRef = collection(db, "orders");
      await addDoc(ordersRef, {
        userId: userId,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: totalPrice,
        status: selectedPayment === "cod" ? "pending" : "processing",
        paymentMethod: selectedPayment,
        address: {
          fullName: savedAddress.fullName,
          email: savedAddress.email,
          phone: savedAddress.phone,
          houseNo: savedAddress.houseNo,
          street: savedAddress.street,
          landmark: savedAddress.landmark,
          city: savedAddress.city,
          state: savedAddress.state,
          pincode: savedAddress.pincode,
        },
        createdAt: new Date(),
        trackingId: `ORD-${Date.now()}`,
        paymentProof: selectedPayment === "online" ? "Screenshot uploaded" : null,
      });

      // Also save to Supabase for admin dashboard
      await orderService.createOrder({
        user_id: userId,
        user_email: savedAddress.email,
        user_name: savedAddress.fullName,
        user_phone: savedAddress.phone,
        house_no: savedAddress.houseNo,
        street: savedAddress.street,
        landmark: savedAddress.landmark || "",
        city: savedAddress.city,
        state: savedAddress.state,
        pincode: savedAddress.pincode,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: totalPrice,
        payment_method: selectedPayment,
      });

      toast({
        title: "Order Placed! 🎉",
        description:
          selectedPayment === "cod"
            ? "Your order will be delivered soon!"
            : "Payment verified! Your order will be processed.",
      });

      setTimeout(() => {
        onSuccess?.();
        onClose();
        window.location.href = "/";
      }, 1500);
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-0 bg-amber-50 shadow-2xl rounded-2xl p-0">
        {/* Header with Step Indicator */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200 p-6 rounded-t-2xl z-10">
          <h2 className="text-3xl font-serif font-bold text-amber-900 mb-2">Checkout</h2>
          <div className="flex gap-4 items-center mt-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step === "address"
                    ? "bg-amber-800 text-amber-50"
                    : "bg-green-600 text-white"
                }`}
              >
                1
              </div>
              <span className="font-medium text-amber-900">Delivery Address</span>
            </div>
            <div className="flex-1 h-1 bg-amber-200 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                  ["payment", "online-payment"].includes(step)
                    ? "bg-amber-800 text-amber-50"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                2
              </div>
              <span
                className={`font-medium ${
                  ["payment", "online-payment"].includes(step)
                    ? "text-amber-900"
                    : "text-gray-500"
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === "address" ? (
              /* ADDRESS FORM */
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                    <MapPin size={20} className="text-amber-700" />
                    Delivery Address
                  </h3>

                  {/* Name, Email, Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-amber-900 font-medium mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-amber-900 font-medium mb-2 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-amber-900 font-medium mb-2 block">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Address Details */}
                  <div className="pt-4 border-t border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-4">Address Details</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="houseNo"
                          className="text-amber-900 font-medium mb-2 block"
                        >
                          House No / Building Name *
                        </Label>
                        <Input
                          id="houseNo"
                          value={houseNo}
                          onChange={(e) => setHouseNo(e.target.value)}
                          placeholder="e.g., Apartment 101"
                          className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="street" className="text-amber-900 font-medium mb-2 block">
                          Street / Area *
                        </Label>
                        <Input
                          id="street"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="e.g., Main Street"
                          className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="landmark" className="text-amber-900 font-medium mb-2 block">
                        Landmark (Optional)
                      </Label>
                      <Input
                        id="landmark"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g., Near Central Park"
                        className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-amber-900 font-medium mb-2 block">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-amber-900 font-medium mb-2 block">
                          State *
                        </Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode" className="text-amber-900 font-medium mb-2 block">
                          Pincode *
                        </Label>
                        <Input
                          id="pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="e.g., 110001"
                          className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="pt-4">
                    <Label
                      htmlFor="instructions"
                      className="text-amber-900 font-medium mb-2 block"
                    >
                      Special Instructions (Optional)
                    </Label>
                    <Textarea
                      id="instructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g., Please ring the doorbell twice"
                      className="rounded-lg border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:border-amber-500 min-h-24"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 border-amber-300 text-amber-900 hover:bg-amber-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </div>
              </form>
            ) : step === "payment" ? (
              /* PAYMENT SELECTION */
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-amber-900">Select Payment Method</h3>

                {savedAddress && (
                  <div className="bg-white rounded-xl p-4 border border-amber-200 space-y-3">
                    <div>
                      <p className="text-sm text-amber-700 font-medium">Delivery Address</p>
                      <p className="font-semibold text-amber-900">{savedAddress.fullName}</p>
                      <p className="text-sm text-amber-800">
                        {savedAddress.houseNo}, {savedAddress.street}
                      </p>
                      {savedAddress.landmark && (
                        <p className="text-sm text-amber-800">{savedAddress.landmark}</p>
                      )}
                      <p className="text-sm text-amber-800">
                        {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {/* COD Option */}
                  <div
                    onClick={() => setSelectedPayment("cod")}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPayment === "cod"
                        ? "border-amber-800 bg-amber-100"
                        : "border-amber-200 bg-white hover:bg-amber-50"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedPayment === "cod"}
                      readOnly
                      className="w-4 h-4"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-amber-900">Cash on Delivery</p>
                      <p className="text-sm text-amber-700">Pay when you receive your order</p>
                    </div>
                    <p className="font-bold text-amber-900">₹{totalPrice}</p>
                  </div>

                  {/* Online Payment Option */}
                  <div
                    onClick={() => setSelectedPayment("online")}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPayment === "online"
                        ? "border-amber-800 bg-amber-100"
                        : "border-amber-200 bg-white hover:bg-amber-50"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedPayment === "online"}
                      readOnly
                      className="w-4 h-4"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-amber-900">Online Payment</p>
                      <p className="text-sm text-amber-700">GPay / PayTM / PhonePe / Bank Transfer</p>
                    </div>
                    <p className="font-bold text-amber-900">₹{totalPrice}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("address")}
                    disabled={isLoading}
                    className="flex-1 border-amber-300 text-amber-900 hover:bg-amber-100"
                  >
                    Back to Address
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedPayment === "cod") {
                        handlePlaceOrder();
                      } else {
                        setStep("online-payment");
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold"
                  >
                    {selectedPayment === "cod" ? "Place Order (COD)" : "Continue to Payment"}
                  </Button>
                </div>
              </div>
            ) : (
              /* ONLINE PAYMENT */
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-amber-900">Complete Payment</h3>

                <div className="bg-white rounded-xl p-6 border border-amber-200 space-y-4">
                  <h4 className="font-semibold text-amber-900 text-center">Scan QR Code to Pay</h4>

                  {/* QR Code Display */}
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg border border-amber-200">
                      <img
                        src={qrImage}
                        alt="Payment QR Code"
                        className="w-48 h-48 object-cover"
                      />
                    </div>
                  </div>

                  <p className="text-center text-sm text-amber-700">
                    📱 Scan the QR code above using GPay, PayTM, or PhonePe
                  </p>

                  {/* Screenshot Upload */}
                  <div className="space-y-3 border-t border-amber-200 pt-4">
                    <h5 className="font-semibold text-amber-900 flex items-center gap-2">
                      <Upload size={18} />
                      Upload Payment Receipt
                    </h5>

                    <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 text-center cursor-pointer hover:bg-amber-50 transition-colors">
                      <input
                        type="file"
                        id="screenshot"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="screenshot"
                        className="cursor-pointer block"
                      >
                        <p className="text-amber-900 font-medium">Click to upload screenshot</p>
                        <p className="text-sm text-amber-700">PNG, JPG, WebP - max 5MB</p>
                      </label>
                    </div>

                    {previewUrl && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-amber-900">✓ Screenshot uploaded</p>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full max-h-40 object-cover rounded-lg border border-amber-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("payment")}
                    disabled={isLoading || !screenshotFile}
                    className="flex-1 border-amber-300 text-amber-900 hover:bg-amber-100"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || !screenshotFile}
                    className="flex-1 bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Payment & Place Order"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-amber-200 sticky top-32">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pb-4 border-b border-amber-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-amber-900">{item.name}</p>
                      <p className="text-amber-700">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-amber-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-amber-800">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span>Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-amber-200 flex justify-between items-center">
                <span className="text-lg font-bold text-amber-900">Total</span>
                <span className="text-2xl font-bold text-amber-800">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

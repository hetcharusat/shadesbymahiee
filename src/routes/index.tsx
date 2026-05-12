import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Categories } from "@/components/site/Categories";
import { Products } from "@/components/site/Products";
import { CustomOrder } from "@/components/site/CustomOrder";
import { About } from "@/components/site/About";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CheckoutDrawer } from "@/components/site/CheckoutDrawer";
import { Toasts } from "@/components/site/Toasts";
import { AuthModal } from "@/components/site/AuthModal";
import { OrderSuccessAnimation } from "@/components/site/OrderSuccessAnimation";
import { OrderHistory } from "@/components/site/OrderHistory";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Shadesbymahie — Handmade Religious Art, Nameplates & Custom Creations" },
      {
        name: "description",
        content:
          "Shadesbymahie crafts handmade religious wall art, nameplates, clocks, and custom creations — personalized art made with love, shipped pan-India.",
      },
      { property: "og:title", content: "Shadesbymahie — Handmade Art & Custom Creations" },
      {
        property: "og:description",
        content: "Personalized wall art, nameplates & divine designs — made just for you.",
      },
    ],
  }),
});

function Index() {
  return (
    <AuthProvider>
      <CartProvider>
        <IndexContent />
      </CartProvider>
    </AuthProvider>
  );
}

function IndexContent() {
  useReveal();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
  };

  const handleCheckoutSuccess = () => {
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
  };

  const handleOrderSuccessClose = () => {
    setIsOrderSuccessOpen(false);
    // Redirect to home
    window.location.href = "/";
  };

  return (
    <main className="relative">
      <Navbar onOrderHistoryClick={() => setIsOrderHistoryOpen(true)} />
      <Hero />
      <Categories />
      <Products />
      <CustomOrder />
      <About />
      <Footer />
      <CheckoutDrawer onSuccess={handleCheckoutSuccess} />
      <Toasts />

      {/* Modals */}
      <AuthModal />
      <OrderHistory isOpen={isOrderHistoryOpen} onClose={() => setIsOrderHistoryOpen(false)} />
      <OrderSuccessAnimation isOpen={isOrderSuccessOpen} onClose={handleOrderSuccessClose} />
    </main>
  );
}

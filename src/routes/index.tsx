import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Categories } from "@/components/site/Categories";
import { Products } from "@/components/site/Products";
import { CustomOrder } from "@/components/site/CustomOrder";
import { About } from "@/components/site/About";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Toasts } from "@/components/site/Toasts";

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
  useReveal();
  return (
    <CartProvider>
      <main className="relative">
        <Navbar />
        <Hero />
        <Categories />
        <Products />
        <CustomOrder />
        <About />
        <Footer />
        <CartDrawer />
        <Toasts />
      </main>
    </CartProvider>
  );
}

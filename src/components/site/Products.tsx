import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { productService } from "@/lib/supabase";

export function Products() {
  const { addItem, openDrawer } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStoreProducts() {
      const res = await productService.getActiveProducts();
      if (res.success) {
        setProducts(res.data);
      } else {
        console.error("Products error:", res.error);
        toast.error("Failed to load products: " + res.error);
      }
      setLoading(false);
    }
    fetchStoreProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image: product.image_url,
    });
    toast.success(`${product.name} added to cart!`, {
      description: `₹${(product.discount_price || product.price).toLocaleString("en-IN")}`,
    });
  };

  const handleBuyNow = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image: product.image_url,
    });
    openDrawer();
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section id="products" className="bg-secondary/40 px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-10 flex flex-col items-center gap-3 text-center md:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Our Collection</p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">Featured Pieces</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Each piece is handcrafted with love — no two are exactly alike.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No products available at the moment. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((p, i) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                style={{ animationDelay: `${(i % 4) * 150}ms` }}
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {p.tag && (
                    <span className="absolute left-3 top-3 rounded-full gradient-warm px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-soft">
                      {p.tag}
                    </span>
                  )}
                  <button
                    aria-label="Save"
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground/70 shadow-card transition-colors hover:text-primary"
                  >
                    <Heart className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h3 className="font-serif text-base font-semibold text-foreground md:text-lg line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-primary">₹{(p.discount_price || p.price).toLocaleString("en-IN")}</p>
                    {p.discount_price && <p className="text-xs text-muted-foreground line-through">₹{p.price.toLocaleString("en-IN")}</p>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleBuyNow(p)}
                      className="flex-1 rounded-full gradient-warm px-3 py-2 text-xs font-medium text-primary-foreground shadow-soft transition-all hover:scale-[1.03] active:scale-[0.98]"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-primary hover:text-primary hover:scale-[1.03] active:scale-[0.98]"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

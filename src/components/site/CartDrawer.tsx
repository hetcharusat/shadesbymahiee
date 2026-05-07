import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight } from "lucide-react";

export function CartDrawer() {
  const { items, subtotal, itemCount, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full flex flex-col bg-background transition-transform duration-500 ease-out md:w-96 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Header */}
        <div className="border-b border-border bg-gradient-to-b from-background to-secondary/20 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full gradient-warm">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" strokeWidth={1.75} />
              </div>
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Shopping Cart
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
              aria-label="Close cart"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
          {itemCount > 0 && (
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
            </p>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" strokeWidth={1.75} />
              </div>
              <p className="font-serif text-lg font-semibold text-foreground">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Add some handmade pieces to get started!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border px-4 py-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {/* Product Image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="font-serif text-sm font-semibold text-foreground line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs font-medium text-primary">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-1 flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" strokeWidth={2} />
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-gradient-to-t from-background to-secondary/10 px-6 py-5">
            {/* Subtotal */}
            <div className="mb-4 flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
              <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
              <span className="font-serif text-lg font-semibold text-foreground">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Checkout Button */}
            <button className="w-full rounded-full gradient-warm px-5 py-3 font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Proceed to Checkout
            </button>

            {/* Continue Shopping */}
            <button
              onClick={closeDrawer}
              className="mt-3 w-full rounded-full border border-border bg-background px-5 py-3 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import dp from "@/assets/dp.jpg";
import { useCart } from "@/contexts/CartContext";

const links = [
  { href: "#categories", label: "Shop" },
  { href: "#products", label: "Products" },
  { href: "#custom", label: "Custom Order" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-card" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-2">
          <img
            src={dp}
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full object-cover shadow-soft"
            style={{ minWidth: 40, minHeight: 40 }}
          />
          <span className="font-serif text-xl font-semibold text-foreground">
            Shadesby <span className="text-gradient-warm">Mahie</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-primary">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#custom"
            className="hidden rounded-full gradient-warm px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-105 md:inline-flex"
          >
            Order Now
          </a>

          {/* Cart Button - Visible on all screen sizes */}
          <button
            onClick={openDrawer}
            aria-label="Shopping cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-all hover:bg-accent hover:scale-105"
            title={`${itemCount} items in cart`}
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full gradient-warm text-xs font-semibold text-primary-foreground shadow-soft animate-pulse">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="flex flex-col gap-1 px-5 py-4 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 font-medium text-foreground hover:bg-secondary"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#custom"
                onClick={() => setOpen(false)}
                className="block rounded-full gradient-warm px-5 py-3 text-center text-sm font-medium text-primary-foreground shadow-soft"
              >
                Order Custom Artwork
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

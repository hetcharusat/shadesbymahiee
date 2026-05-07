import swastik from "@/assets/product-swastik.jpg";
import krishna from "@/assets/product-krishna.jpg";
import ganesh from "@/assets/product-ganesh.jpg";
import clock from "@/assets/product-clock.jpg";
import nameplate from "@/assets/product-nameplate.jpg";
import earrings from "@/assets/product-heartframe.jpg";
import mandala from "@/assets/product-mandala.jpg";
import sunart from "@/assets/product-sunart.jpg";
import namah from "@/assets/product-shiv.jpg";
import shiva from "@/assets/product-shiva2.jpg";
import { Heart } from "lucide-react";

const products = [
  { img: swastik, name: "Swastik Wall Art", price: 599, tag: "Bestseller" },
  { img: krishna, name: "Krishna Peacock Frame", price: 599, tag: "New" },
  { img: ganesh, name: "Ganesh Painting", price: 599 },
  { img: clock, name: "Floral Handmade Clock", price: 499 },
  { img: nameplate, name: "Custom Nameplate", price: 599, tag: "Custom" },
  { img: mandala, name: "Golden Mandala", price: 599 },
  { img: earrings, name: "Heart Frame", price: 449 },
  { img: sunart, name: "Sun Art", price: 599 },
  { img: namah, name: "NAMAH", price: 599 },
  { img: shiva, name: "Shiva Lingam", price: 599 },
];

export function Products() {
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

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <article
              key={p.name + i}
              className="reveal group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
              style={{ transitionDelay: `${(i % 4) * 60}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
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
                <h3 className="font-serif text-base font-semibold text-foreground md:text-lg">
                  {p.name}
                </h3>
                <p className="text-sm font-medium text-primary">₹{p.price.toLocaleString("en-IN")}</p>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-full gradient-warm px-3 py-2 text-xs font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]">
                    Buy Now
                  </button>
                  <button className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
                    Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

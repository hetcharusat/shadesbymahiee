import heroImg from "@/assets/hero-handmade.jpg";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24"
    >
      {/* soft warm background blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-20 h-[460px] w-[460px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--saffron), transparent 70%)" }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <div className="animate-fade-up text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-foreground/80">
            <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            Handmade with love in India
          </span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl md:text-6xl">
            Handmade Art &{" "}
            <span className="text-gradient-warm">Custom Creations</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:mx-0 md:text-lg">
            Personalized wall art, nameplates & divine designs — made just for you.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row md:justify-start">
            <a
              href="#custom"
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-warm px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]"
            >
              Order Custom Artwork →
            </a>
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full border-2 border-foreground/15 bg-background px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Browse Collection
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground md:justify-start">
            <span>✦ 50+ happy customers</span>
            <span>✦ Made to order</span>
            <span>✦ Pan-India shipping</span>
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="relative mx-auto max-w-md md:max-w-none">
            <div
              className="absolute -inset-4 -z-10 rounded-[2rem] opacity-60 blur-2xl"
              style={{ background: "linear-gradient(135deg, var(--gold), var(--saffron))" }}
            />
            <img
              src={heroImg}
              alt="Artist holding a handmade Krishna painting"
              width={1536}
              height={1152}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card"
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-background/95 p-4 shadow-card backdrop-blur md:block">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Latest piece</p>
              <p className="mt-1 font-serif text-lg text-foreground">Krishna Bliss ✨</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

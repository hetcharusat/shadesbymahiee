export function About() {
  return (
    <section id="about" className="px-5 py-16 md:px-10 md:py-24">
      <div className="reveal mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Our Story</p>
        <h2 className="mt-3 font-serif text-3xl text-foreground md:text-5xl">
          Made with love, <span className="text-gradient-warm italic">by hand</span>
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          Each piece is handmade with care, combining tradition and creativity to bring
          meaningful art into your space. From divine wall art to personalized nameplates,
          every creation carries a little bit of heart.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { n: "50+", l: "Happy homes" },
            { n: "100%", l: "Handmade" },
            { n: "5★", l: "Loved by you" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-secondary p-6">
              <p className="font-serif text-3xl text-gradient-warm">{s.n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

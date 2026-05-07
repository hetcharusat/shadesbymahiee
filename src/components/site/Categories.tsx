import religious from "@/assets/cat-religious.jpg";
import decor from "@/assets/cat-decor.jpg";
import custom from "@/assets/product-heartframe.jpg";

const cats = [
  { img: religious, title: "Religious Art", desc: "Krishna, Ganesh, Swastik & more" },
  { img: decor, title: "Home Decor", desc: "Clocks, mandalas & wall pieces" },
  { img: custom, title: "Custom Orders", desc: "Made just for you" },
];

export function Categories() {
  return (
    <section id="categories" className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-10 text-center md:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Explore</p>
          <h2 className="mt-3 font-serif text-3xl text-foreground md:text-4xl">Shop by Category</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-7">
          {cats.map((c, i) => (
            <a
              key={c.title}
              href="#products"
              className="reveal group relative overflow-hidden rounded-2xl bg-secondary shadow-card transition-transform hover:-translate-y-1"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-serif text-2xl text-background">{c.title}</h3>
                <p className="mt-1 text-sm text-background/85">{c.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-background">
                  Shop now →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

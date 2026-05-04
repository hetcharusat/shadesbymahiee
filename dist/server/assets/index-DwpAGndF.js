import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-Bm2we3qk.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$9 = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$9);
const __iconNode$8 = [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }]
];
const Instagram = createLucideIcon("instagram", __iconNode$8);
const __iconNode$7 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$7);
const __iconNode$6 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
];
const Menu = createLucideIcon("menu", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }],
  ["path", { d: "M3.103 6.034h17.794", key: "awc11p" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
      key: "o988cm"
    }
  ]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const links = [
  { href: "#categories", label: "Shop" },
  { href: "#products", label: "Products" },
  { href: "#custom", label: "Custom Order" },
  { href: "#about", label: "About" }
];
function Navbar() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-card" : "bg-background/80 backdrop-blur-sm"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#top", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-full gradient-warm text-primary-foreground font-serif text-lg shadow-soft", children: "M" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif text-xl font-semibold text-foreground", children: [
              "Shadesby ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-warm", children: "mahie" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.href, className: "transition-colors hover:text-primary", children: l.label }) }, l.href)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "#custom",
                className: "hidden rounded-full gradient-warm px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-105 md:inline-flex",
                children: "Order Now"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                "aria-label": "Cart",
                className: "relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent md:hidden",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4", strokeWidth: 1.75 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                "aria-label": "Menu",
                onClick: () => setOpen((o) => !o),
                className: "inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground md:hidden",
                children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-background md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "flex flex-col gap-1 px-5 py-4 text-sm", children: [
          links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: l.href,
              onClick: () => setOpen(false),
              className: "block rounded-lg px-3 py-2.5 font-medium text-foreground hover:bg-secondary",
              children: l.label
            }
          ) }, l.href)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "#custom",
              onClick: () => setOpen(false),
              className: "block rounded-full gradient-warm px-5 py-3 text-center text-sm font-medium text-primary-foreground shadow-soft",
              children: "Order Custom Artwork"
            }
          ) })
        ] }) })
      ]
    }
  );
}
const heroImg = "/assets/hero-handmade-DgggQRo5.jpg";
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "top",
      className: "relative overflow-hidden px-5 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pointer-events-none absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl",
            style: { background: "radial-gradient(circle, var(--gold), transparent 70%)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pointer-events-none absolute -bottom-40 -right-20 h-[460px] w-[460px] rounded-full opacity-40 blur-3xl",
            style: { background: "radial-gradient(circle, var(--saffron), transparent 70%)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center md:gap-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-up text-center md:text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-foreground/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary", strokeWidth: 2 }),
              "Handmade with love in India"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-5 font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl md:text-6xl", children: [
              "Handmade Art &",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-warm", children: "Custom Creations" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:mx-0 md:text-lg", children: "Personalized wall art, nameplates & divine designs — made just for you." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row md:justify-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "#custom",
                  className: "inline-flex items-center justify-center gap-2 rounded-full gradient-warm px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]",
                  children: "Order Custom Artwork →"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "#products",
                  className: "inline-flex items-center justify-center rounded-full border-2 border-foreground/15 bg-background px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary",
                  children: "Browse Collection"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground md:justify-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✦ 500+ happy customers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✦ Made to order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✦ Pan-India shipping" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-md md:max-w-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute -inset-4 -z-10 rounded-[2rem] opacity-60 blur-2xl",
                style: { background: "linear-gradient(135deg, var(--gold), var(--saffron))" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: heroImg,
                alt: "Artist holding a handmade Krishna painting",
                width: 1536,
                height: 1152,
                className: "aspect-[4/3] w-full rounded-3xl object-cover shadow-card"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-5 -left-5 hidden rounded-2xl bg-background/95 p-4 shadow-card backdrop-blur md:block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Latest piece" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-serif text-lg text-foreground", children: "Krishna Bliss ✨" })
            ] })
          ] }) })
        ] })
      ]
    }
  );
}
const religious = "/assets/cat-religious-BpL7068c.jpg";
const decor = "/assets/cat-decor-C3LsEg7s.jpg";
const custom = "/assets/cat-custom-Bp2cRzF2.jpg";
const cats = [
  { img: religious, title: "Religious Art", desc: "Krishna, Ganesh, Swastik & more" },
  { img: decor, title: "Home Decor", desc: "Clocks, mandalas & wall pieces" },
  { img: custom, title: "Custom Orders", desc: "Made just for you" }
];
function Categories() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "categories", className: "px-5 py-16 md:px-10 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reveal mb-10 text-center md:mb-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-[0.25em] text-primary", children: "Explore" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-serif text-3xl text-foreground md:text-4xl", children: "Shop by Category" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-7", children: cats.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: "#products",
        className: "reveal group relative overflow-hidden rounded-2xl bg-secondary shadow-card transition-transform hover:-translate-y-1",
        style: { transitionDelay: `${i * 80}ms` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/3] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: c.img,
              alt: c.title,
              loading: "lazy",
              width: 1024,
              height: 1024,
              className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl text-background", children: c.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-background/85", children: c.desc }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-3 inline-flex items-center gap-1 text-xs font-medium text-background", children: "Shop now →" })
          ] })
        ]
      },
      c.title
    )) })
  ] }) });
}
const swastik = "/assets/product-swastik-BPUMizpi.jpg";
const krishna = "/assets/product-krishna-D9oODHeW.jpg";
const ganesh = "/assets/product-ganesh-BAKNvVCV.jpg";
const clock = "/assets/product-clock-BEDHgr4q.jpg";
const nameplate = "/assets/product-nameplate-Caiz1L1H.jpg";
const earrings = "/assets/product-earrings-BvkjpIbb.jpg";
const mandala = "/assets/product-mandala-CgZb81e_.jpg";
const products = [
  { img: swastik, name: "Swastik Wall Art", price: 899, tag: "Bestseller" },
  { img: krishna, name: "Krishna Peacock Frame", price: 1499, tag: "New" },
  { img: ganesh, name: "Ganesh Painting", price: 1299 },
  { img: clock, name: "Floral Handmade Clock", price: 1199 },
  { img: nameplate, name: "Custom Nameplate", price: 699, tag: "Custom" },
  { img: mandala, name: "Golden Mandala", price: 999 },
  { img: earrings, name: "Jhumka Earrings", price: 449 },
  { img: krishna, name: "Mini Krishna Frame", price: 599 }
];
function Products() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "products", className: "bg-secondary/40 px-5 py-16 md:px-10 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reveal mb-10 flex flex-col items-center gap-3 text-center md:mb-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-[0.25em] text-primary", children: "Our Collection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl text-foreground md:text-4xl", children: "Featured Pieces" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-sm text-muted-foreground", children: "Each piece is handcrafted with love — no two are exactly alike." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4", children: products.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "article",
      {
        className: "reveal group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft",
        style: { transitionDelay: `${i % 4 * 60}ms` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square overflow-hidden bg-secondary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: p.img,
                alt: p.name,
                loading: "lazy",
                width: 1024,
                height: 1024,
                className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              }
            ),
            p.tag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-3 rounded-full gradient-warm px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-soft", children: p.tag }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                "aria-label": "Save",
                className: "absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground/70 shadow-card transition-colors hover:text-primary",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4", strokeWidth: 1.75 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-1 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-base font-semibold text-foreground md:text-lg", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-primary", children: [
              "₹",
              p.price.toLocaleString("en-IN")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex-1 rounded-full gradient-warm px-3 py-2 text-xs font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]", children: "Buy Now" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary", children: "Details" })
            ] })
          ] })
        ]
      },
      p.name + i
    )) })
  ] }) });
}
function CustomOrder() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "custom", className: "px-5 py-16 md:px-10 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reveal relative mx-auto max-w-6xl overflow-hidden rounded-3xl gradient-warm p-8 text-primary-foreground shadow-soft md:p-14", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-background/15 blur-3xl"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-background/15 blur-3xl"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid gap-10 md:grid-cols-2 md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-[0.3em] text-primary-foreground/80", children: "Custom Made" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-serif text-3xl leading-tight md:text-5xl", children: "Want something made just for you?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/90 md:text-base", children: "Share your idea, name, or design — we'll create a one-of-a-kind handmade artwork especially for you. Names, deities, family portraits, anything." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 flex flex-col gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "https://wa.me/919999999999",
              target: "_blank",
              rel: "noreferrer",
              className: "inline-flex items-center justify-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-semibold text-primary shadow-card transition-transform hover:scale-[1.03]",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
                "Start Custom Order"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center justify-center gap-2 rounded-full border-2 border-background/40 bg-background/10 px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-background/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
            "Upload Reference"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
        { n: "1", t: "Share Idea", d: "Name, design, or photo" },
        { n: "2", t: "We Sketch", d: "Approve your concept" },
        { n: "3", t: "We Paint", d: "Handmade just for you" },
        { n: "4", t: "Delivered", d: "Pan-India shipping" }
      ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl bg-background/15 p-5 backdrop-blur-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-3xl font-semibold", children: s.n }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-medium", children: s.t }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary-foreground/80", children: s.d })
          ]
        },
        s.n
      )) })
    ] })
  ] }) });
}
function About() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "about", className: "px-5 py-16 md:px-10 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reveal mx-auto max-w-3xl text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-[0.25em] text-primary", children: "Our Story" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 font-serif text-3xl text-foreground md:text-5xl", children: [
      "Made with love, ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-warm italic", children: "by hand" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base leading-relaxed text-muted-foreground md:text-lg", children: "Each piece is handmade with care, combining tradition and creativity to bring meaningful art into your space. From divine wall art to personalized nameplates, every creation carries a little bit of heart." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 sm:grid-cols-3", children: [
      { n: "500+", l: "Happy homes" },
      { n: "100%", l: "Handmade" },
      { n: "5★", l: "Loved by you" }
    ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-secondary p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-3xl text-gradient-warm", children: s.n }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: s.l })
    ] }, s.l)) })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { id: "contact", className: "bg-secondary/60 px-5 py-14 md:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-10 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-full gradient-warm font-serif text-lg text-primary-foreground shadow-soft", children: "M" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif text-xl font-semibold text-foreground", children: [
            "Mahi ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-warm", children: "Art" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground", children: "Handmade religious art, decor & custom creations — made with love in India." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://instagram.com",
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Instagram",
              className: "inline-flex h-10 w-10 items-center justify-center rounded-full gradient-warm text-primary-foreground shadow-soft transition-transform hover:scale-110",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://wa.me/919999999999",
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "WhatsApp",
              className: "inline-flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-card transition-colors hover:text-primary",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "mailto:hello@mahiart.com",
              "aria-label": "Email",
              className: "inline-flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-card transition-colors hover:text-primary",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-base font-semibold text-foreground", children: "Quick Links" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#categories", className: "hover:text-primary", children: "Shop" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#products", className: "hover:text-primary", children: "Products" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#custom", className: "hover:text-primary", children: "Custom Order" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#about", className: "hover:text-primary", children: "About" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-base font-semibold text-foreground", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mt-0.5 h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "India · Ships pan-India" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mt-0.5 h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:hello@mahiart.com", className: "hover:text-primary", children: "hello@mahiart.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mt-0.5 h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://wa.me/919999999999", className: "hover:text-primary", children: "+91 99999 99999" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-10 max-w-7xl border-t border-border pt-6 text-center text-xs text-muted-foreground", children: "© 2026 Shadesbymahie · Made with ♥ by hand" })
  ] });
}
function useReveal() {
  reactExports.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
function Index() {
  useReveal();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Categories, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Products, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CustomOrder, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(About, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  Index as component
};

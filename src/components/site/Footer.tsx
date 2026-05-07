import { Instagram, Mail, MessageCircle, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-secondary/60 px-5 py-14 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-warm font-serif text-lg text-primary-foreground shadow-soft">
              M
            </span>
            <span className="font-serif text-xl font-semibold text-foreground">
              Mahi <span className="text-gradient-warm">Art</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Handmade religious art, decor & custom creations — made with love in India.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://instagram.com/shadesby.mahie"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full gradient-warm text-primary-foreground shadow-soft transition-transform hover:scale-110"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-card transition-colors hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@mahiart.com"
              aria-label="Email"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-card transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-base font-semibold text-foreground">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#categories" className="hover:text-primary">Shop</a></li>
            <li><a href="#products" className="hover:text-primary">Products</a></li>
            <li><a href="#custom" className="hover:text-primary">Custom Order</a></li>
            <li><a href="#about" className="hover:text-primary">About</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-base font-semibold text-foreground">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <span>Anand,India </span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-primary" />
              <a href="mailto:hello@mahiart.com" className="hover:text-primary">hello@mahiart.com</a>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 text-primary" />
              <a href="https://wa.me/919999999999" className="hover:text-primary">+91 99999 99999</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 Shadesbymahie · THANKS FOR VISITING! FOLLOW US ON INSTAGRAM @shadesby.mahie
      </div>
    </footer>
  );
}

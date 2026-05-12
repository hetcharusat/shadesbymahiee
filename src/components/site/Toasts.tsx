import { Toaster } from "sonner";

export function Toasts() {
  return (
    <Toaster
      theme="light"
      position="top-center"
      richColors
      closeButton
      expand
      visibleToasts={3}
      duration={3000}
      style={{
        "--toast-background": "var(--color-card)",
        "--toast-border": "var(--color-border)",
        "--toast-text": "var(--color-foreground)",
        "--toast-close-button-hover-background": "var(--color-secondary)",
      } as React.CSSProperties}
      toastOptions={{
        classNames: {
          toast: "rounded-lg shadow-card border border-border",
          title: "font-medium text-sm",
          description: "text-xs text-muted-foreground",
          actionButton: "text-primary hover:text-primary/80",
          closeButton: "text-muted-foreground hover:text-foreground",
        },
      }}
    />
  );
}

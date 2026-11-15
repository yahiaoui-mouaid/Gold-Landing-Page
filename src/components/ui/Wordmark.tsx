import { cn } from "@/lib/cn";

/** Typographic logotype. The full stop is set in gold, like a hallmark punch. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-baseline leading-none tracking-[-0.02em] [font-variation-settings:'opsz'_48]",
        className,
      )}
    >
      Gold<span className="text-gold">.</span>Yh
    </span>
  );
}

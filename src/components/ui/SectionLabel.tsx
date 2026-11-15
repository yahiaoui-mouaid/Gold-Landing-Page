import { cn } from "@/lib/cn";

/** Identifies a section by name. Sentence case, preceded by a short rule. */
export function SectionLabel({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "type-label flex items-center gap-3",
        tone === "dark" ? "text-gold" : "text-bronze",
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 bg-current opacity-70" />
      {children}
    </p>
  );
}

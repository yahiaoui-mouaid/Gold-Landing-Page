import { cn } from "@/lib/cn";

/**
 * Stage number set inside a chamfered cartouche, the shape of a goldsmith's
 * hallmark punch. Used only where content is a true sequence.
 */
export function Hallmark({
  value,
  className,
  label,
}: {
  value: string;
  className?: string;
  /** Accessible label; defaults to hiding the mark when the number is stated elsewhere. */
  label?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-8 w-[3.25rem] shrink-0 items-center justify-center",
        className,
      )}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      <svg viewBox="0 0 52 32" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        <path
          d="M6.5 0.5H45.5L51.5 6.5V25.5L45.5 31.5H6.5L0.5 25.5V6.5Z"
          stroke="currentColor"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="font-display tabular relative text-[0.95rem] leading-none [font-variation-settings:'opsz'_14]">
        {value}
      </span>
    </span>
  );
}

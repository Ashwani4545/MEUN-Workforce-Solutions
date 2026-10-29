import clsx from "clsx";

export function VerifiedBadge({
  label,
  active = true,
  className,
}: {
  label: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        active
          ? "border-ink/40 bg-paper-dim text-ink"
          : "border-line text-graphite-light",
        className
      )}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {active ? (
          <path
            d="M9 12.5l2 2 4-4.5M12 3l2.2 1.6 2.7-.2 1 2.5 2.3 1.4-.5 2.7 1.3 2.4-1.8 2 .2 2.7-2.6.8-1.4 2.3-2.6-.6L12 21l-2.3-1.4-2.6.6-1.4-2.3-2.6-.8.2-2.7-1.8-2 1.3-2.4-.5-2.7 2.3-1.4 1-2.5 2.7.2L12 3z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
        )}
      </svg>
      {label}
    </span>
  );
}

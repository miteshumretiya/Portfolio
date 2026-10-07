import type { ReactNode } from "react";

type Props = {
  href: string;
  children: string;
  icon?: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
};

// Pill CTA with a rolling label. Magnetic pull is added by the motion engine
// via [data-magnetic]; without JS it is a plain, fully working link.
export default function Button({
  href,
  children,
  icon,
  variant = "primary",
  external,
  className = "",
}: Props) {
  const tone =
    variant === "primary"
      ? "bg-lime text-ink hover:shadow-[var(--shadow-glow)]"
      : "glass text-text hover:border-lime/50";
  return (
    <a
      href={href}
      data-magnetic
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group relative inline-flex min-h-12 items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[0.95rem] font-medium transition-[box-shadow,border-color,background-color] duration-(--duration-2) ease-(--ease-out) ${tone} ${className}`}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:-translate-y-full group-focus-visible:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:translate-y-0 group-focus-visible:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon ? (
        <span
          className={`grid size-9 place-items-center rounded-full transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:rotate-45 ${variant === "primary" ? "bg-ink text-lime" : "bg-lime text-ink"}`}
        >
          {icon}
        </span>
      ) : null}
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </a>
  );
}

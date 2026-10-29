import { forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none rounded-lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink-soft",
  secondary: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-white",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  dark: "bg-ink text-paper hover:bg-ink-soft",
};

const sizes: Record<Size, string> = {
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

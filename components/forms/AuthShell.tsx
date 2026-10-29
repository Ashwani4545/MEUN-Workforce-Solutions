import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  footerText,
  footerLinkHref,
  footerLinkLabel,
  children,
}: {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 pt-16 md:pt-[72px]">
      <div className="hidden lg:flex flex-col justify-between bg-ink text-paper p-16">
        <Link href="/" className="font-display text-2xl font-semibold">MEUN</Link>
        <div>
          <p className="eyebrow text-graphite-light">Verified People. Trusted Homes.</p>
          <p className="mt-4 font-display text-3xl leading-snug max-w-sm">
            Every professional on MEUN is police-verified before they ever
            reach your door.
          </p>
        </div>
        <p className="text-sm text-paper/40">© {new Date().getFullYear()} MEUN Technologies Pvt. Ltd.</p>
      </div>

      <div className="flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden font-display text-2xl font-semibold">MEUN</Link>
          <h1 className="mt-6 lg:mt-0 font-display text-3xl">{title}</h1>
          <p className="mt-2 text-graphite">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-sm text-graphite">
            {footerText}{" "}
            <Link href={footerLinkHref} className="font-semibold text-ink underline">
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

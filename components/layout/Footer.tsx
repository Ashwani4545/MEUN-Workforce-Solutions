import Link from "next/link";

const columns = [
  {
    heading: "Services",
    links: [
      { href: "/workers?category=maid", label: "Maids" },
      { href: "/workers?category=cook", label: "Cooks" },
      { href: "/workers?category=driver", label: "Drivers" },
      { href: "/workers?category=babysitter", label: "Babysitters" },
      { href: "/workers?category=electrician", label: "Electricians" },
      { href: "/workers?category=plumber", label: "Plumbers" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About MEUN" },
      { href: "/for-business", label: "For Businesses" },
      { href: "/join", label: "Join as a Professional" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    heading: "Trust & Safety",
    links: [
      { href: "/about#verification", label: "Verification Process" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="container-content py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-12">
          <div>
            <span className="font-display text-2xl font-semibold">MEUN</span>
            <p className="mt-4 text-sm text-paper/60 max-w-xs leading-relaxed">
              Verified people, trusted homes. MEUN connects households and
              businesses across India with background-checked domestic and
              facility professionals.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-paper/50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3l2.2 1.6 2.7-.2 1 2.5 2.3 1.4-.5 2.7 1.3 2.4-1.8 2 .2 2.7-2.6.8-1.4 2.3-2.6-.6L12 21l-2.3-1.4-2.6.6-1.4-2.3-2.6-.8.2-2.7-1.8-2 1.3-2.4-.5-2.7 2.3-1.4 1-2.5 2.7.2L12 3z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              Every professional is police & background verified
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-paper/90">{col.heading}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-paper/60 hover:text-paper transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-paper/10 flex flex-col md:flex-row gap-4 justify-between text-xs text-paper/45">
          <p>© {new Date().getFullYear()} MEUN Technologies Pvt. Ltd. All rights reserved.</p>
          <p>Made for households and businesses across India.</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

const NAV_LINKS = [
  { href: "/workers", label: "Find a Professional" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/for-business", label: "For Businesses" },
  { href: "/join", label: "Join as a Professional" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const CITIES = ["Delhi NCR", "Mumbai", "Bengaluru", "Pune", "Hyderabad"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [city, setCity] = useState("Delhi NCR");
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={
          "fixed top-0 inset-x-0 z-50 bg-paper/90 backdrop-blur transition-shadow duration-200 " +
          (scrolled ? "shadow-[0_1px_0_0_#E8E7ED]" : "")
        }
      >
        <div className="container-content flex h-16 md:h-[72px] items-center justify-between">
          <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-ink">
            MEUN
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    "text-[0.9rem] transition-colors relative py-1 " +
                    (active ? "text-ink font-semibold" : "text-graphite hover:text-ink")
                  }
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-ink rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <label className="sr-only" htmlFor="city-select">Select city</label>
            <div className="flex items-center gap-1.5 text-graphite">
              <MapPin size={15} className="text-ink" />
              <select
                id="city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent text-sm cursor-pointer focus:outline-none text-ink"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {!loading && user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm font-semibold text-ink">
                  {user.name.split(" ")[0]}
                </Link>
                <button onClick={() => logout()} className="text-sm text-graphite hover:text-ink">
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold rounded-lg px-5 py-2.5 bg-ink text-white hover:bg-ink-soft transition-colors"
              >
                Sign In / Sign Up
              </Link>
            )}
          </div>

          <button
            className="lg:hidden p-2 -mr-2 text-ink"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            {drawerOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={NAV_LINKS}
        user={user}
        onLogout={logout}
      />
    </>
  );
}

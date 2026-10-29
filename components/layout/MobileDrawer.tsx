"use client";

import Link from "next/link";
import type { PublicUser } from "@/types";

export function MobileDrawer({
  open,
  onClose,
  links,
  user,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  user: PublicUser | null;
  onLogout: () => void;
}) {
  return (
    <div
      className={
        "fixed inset-0 z-40 lg:hidden transition-opacity duration-200 " +
        (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
      }
    >
      <button
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div
        className={
          "absolute top-0 right-0 h-full w-[80%] max-w-sm bg-paper shadow-xl transition-transform duration-300 pt-20 pb-8 px-6 flex flex-col " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="py-3 text-lg font-display text-ink border-b border-line"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          {user ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="text-center rounded-xl border border-ink py-3 font-medium"
              >
                My Dashboard
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="text-center text-graphite py-2"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="block text-center rounded-xl bg-ink text-paper py-3 font-medium"
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

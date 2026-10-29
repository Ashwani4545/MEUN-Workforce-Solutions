"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { ButtonLink } from "@/components/ui/Button";
import type { Booking } from "@/types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/dashboard/bookings")
      .then((r) => (r.ok ? r.json() : { bookings: [] }))
      .then((d) => setBookings(d.bookings))
      .catch(() => setBookings([]));
  }, [user]);

  if (loading || !user) {
    return <div className="pt-40 pb-24 container-content text-graphite">Loading…</div>;
  }

  return (
    <div className="pt-28 md:pt-32 pb-24 container-content">
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-3 font-display text-3xl">Welcome back, {user.name.split(" ")[0]}</h1>

      <div className="mt-10 grid lg:grid-cols-[1fr_280px] gap-12">
        <div>
          <h2 className="font-display text-xl">Your bookings</h2>
          {bookings === null ? (
            <p className="mt-4 text-graphite-light text-sm">Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <div className="mt-4 border border-line rounded-xl p-8 text-center">
              <p className="text-graphite">You haven&apos;t booked anyone yet.</p>
              <ButtonLink href="/workers" className="mt-5">
                Find a professional
              </ButtonLink>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {bookings.map((b) => (
                <li key={b.id} className="card-surface p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{b.category.replace("-", " ")} · {b.package.replace("-", " ")}</p>
                    <p className="text-sm text-graphite-light">{b.date} at {b.timeSlot}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wide2 text-ink font-semibold">
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-display text-xl">Account</h2>
          <div className="mt-4 card-surface p-5 flex flex-col gap-3 text-sm">
            <p><span className="text-graphite-light">Name</span><br />{user.name}</p>
            <p><span className="text-graphite-light">Email</span><br />{user.email}</p>
            <p><span className="text-graphite-light">City</span><br />{user.city ?? "—"}</p>
            <Link href="/profile" className="mt-2 font-medium underline">Edit profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

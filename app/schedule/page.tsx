import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = { title: "Schedule a Booking" };

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="pt-40 pb-24 container-content text-graphite">Loading…</div>}>
      <BookingWizard />
    </Suspense>
  );
}

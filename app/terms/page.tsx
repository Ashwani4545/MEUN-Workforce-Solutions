import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="pt-28 md:pt-32 pb-24 container-content max-w-2xl">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-graphite-light">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-10 flex flex-col gap-8 text-graphite leading-relaxed">
        <section>
          <h2 className="font-display text-xl text-ink">1. Using MEUN</h2>
          <p className="mt-2">
            MEUN is a platform that connects customers with independently
            verified domestic and facility service professionals. By
            creating an account or making a booking, you agree to these
            terms.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">2. Bookings & pricing</h2>
          <p className="mt-2">
            All prices shown at checkout — including the service fee and
            GST — are final at the time of booking. Cancellations made more
            than 6 hours before the scheduled slot are not charged;
            cancellations after that window may incur a partial fee.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">3. Replacement guarantee</h2>
          <p className="mt-2">
            If a booked professional is unable to fulfil an engagement, MEUN
            will make reasonable efforts to provide a replacement of
            equivalent verification standard within the agreed timeframe.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">4. Account responsibilities</h2>
          <p className="mt-2">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity under your account.
            Notify us immediately at hello@meun.in if you suspect
            unauthorized access.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">5. Limitation of liability</h2>
          <p className="mt-2">
            MEUN verifies professionals to the standard described in our{" "}
            <a href="/about#verification" className="underline">verification process</a>, but does not guarantee
            the conduct of any individual. MEUN&apos;s liability for any
            claim is limited to the amount paid for the relevant booking.
          </p>
        </section>
      </div>
    </div>
  );
}

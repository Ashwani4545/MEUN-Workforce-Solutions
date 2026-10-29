import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "For Businesses" };

const OFFERINGS = [
  {
    title: "Facility & office staffing",
    body: "Housekeeping, pantry and office support staff, verified and rostered against your building's shift patterns.",
  },
  {
    title: "Security personnel",
    body: "Trained, background-verified security guards for residential societies, offices and commercial sites.",
  },
  {
    title: "Consolidated billing",
    body: "One monthly invoice across all staff and sites, with GST-compliant documentation for your finance team.",
  },
  {
    title: "Dedicated account management",
    body: "A single point of contact for onboarding, replacements and scaling up or down as your needs change.",
  },
];

export default function ForBusinessPage() {
  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="bg-ink text-paper py-20">
        <div className="container-content">
          <p className="eyebrow text-graphite-light">MEUN for Business</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl max-w-2xl">
            Staffing infrastructure for offices, estates and facilities.
          </h1>
          <p className="mt-5 text-paper/70 max-w-xl">
            From a single office pantry to a multi-site facility contract,
            MEUN handles sourcing, verification and ongoing accountability so
            your team doesn&apos;t have to.
          </p>
          <ButtonLink href="/contact" className="mt-8" size="lg">
            Talk to our business team
          </ButtonLink>
        </div>
      </div>

      <div className="container-content mt-20 grid sm:grid-cols-2 gap-x-10 gap-y-12">
        {OFFERINGS.map((o) => (
          <div key={o.title} className="border-t border-line pt-5">
            <h2 className="font-display text-xl">{o.title}</h2>
            <p className="mt-2 text-graphite leading-relaxed">{o.body}</p>
          </div>
        ))}
      </div>

      <div className="container-content mt-20 border border-line rounded-xl p-10 text-center">
        <h2 className="font-display text-2xl md:text-3xl max-w-lg mx-auto">
          Tell us about your site and staffing needs.
        </h2>
        <p className="mt-3 text-graphite max-w-md mx-auto">
          We&apos;ll come back to you with a proposal tailored to your
          headcount, sites and schedule.
        </p>
        <ButtonLink href="/contact" className="mt-6">
          Request a proposal
        </ButtonLink>
      </div>
    </div>
  );
}

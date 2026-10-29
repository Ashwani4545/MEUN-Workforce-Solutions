import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Pricing" };

const TIERS = [
  {
    name: "Trial Day",
    price: "From ₹250",
    desc: "One visit, no commitment. See if it's the right fit.",
    features: ["Single visit", "Full verification included", "No long-term contract"],
  },
  {
    name: "Part-Time",
    price: "From ₹6,500/mo",
    desc: "A few hours a day, on a fixed schedule.",
    features: ["Daily visits, hours you choose", "Replacement guarantee", "Rate locked for 3 months"],
    featured: true,
  },
  {
    name: "Full-Time",
    price: "From ₹13,500/mo",
    desc: "A full working day, dedicated to your household.",
    features: ["8-hour daily engagement", "Priority replacement", "Dedicated support line"],
  },
  {
    name: "Live-In",
    price: "From ₹22,000/mo",
    desc: "Round-the-clock support, residing at your home.",
    features: ["24/7 availability", "Deep background + medical checks", "Monthly wellness check-ins"],
  },
];

export default function PricingPage() {
  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="container-content text-center max-w-2xl mx-auto">
        <p className="eyebrow">Simple, Transparent Pricing</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">
          Pay only for the time you need.
        </h1>
        <p className="mt-5 text-graphite">
          Every plan includes full verification, a service fee and GST shown
          upfront — no hidden charges at checkout.
        </p>
      </div>

      <div className="container-content mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={
              "rounded-xl border p-6 flex flex-col " +
              (tier.featured ? "border-ink bg-ink text-paper" : "border-line")
            }
          >
            <h2 className="font-display text-xl">{tier.name}</h2>
            <p className={"mt-2 text-2xl font-display " + (tier.featured ? "" : "")}>{tier.price}</p>
            <p className={"mt-3 text-sm " + (tier.featured ? "text-paper/70" : "text-graphite")}>
              {tier.desc}
            </p>
            <ul className="mt-6 flex flex-col gap-2 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span>—</span>
                  <span className={tier.featured ? "text-paper/85" : "text-graphite"}>{f}</span>
                </li>
              ))}
            </ul>
            <ButtonLink
              href="/workers"
              variant={tier.featured ? "primary" : "secondary"}
              className={"mt-8 " + (tier.featured ? "" : "")}
            >
              Find a professional
            </ButtonLink>
          </div>
        ))}
      </div>

      <div className="container-content mt-20 border-t border-line pt-12 max-w-2xl">
        <h2 className="font-display text-2xl">How the final price is calculated</h2>
        <p className="mt-4 text-graphite leading-relaxed">
          Your total is the professional&apos;s listed rate for the package
          you choose, plus a flat ₹149 service fee and 18% GST. Any valid
          coupon is applied before tax. You&apos;ll always see the full
          breakdown before confirming a booking.
        </p>
      </div>
    </div>
  );
}

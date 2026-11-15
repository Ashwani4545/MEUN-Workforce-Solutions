import { ButtonLink } from "@/components/ui/Button";

/**
 * Shown in place of the worker listing / booking pages while the marketplace
 * is switched off (see lib/features.ts).
 */
export function MarketplaceClosed() {
  return (
    <div className="pt-36 md:pt-44 pb-24 container-content">
      <div className="max-w-2xl">
        <p className="eyebrow">Online booking</p>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Online booking is opening soon
        </h1>
        <p className="mt-5 text-graphite leading-relaxed">
          We&apos;re preparing our directory of professionals. In the meantime,
          tell us what you need and our team will get back to you personally.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact" size="lg">
            Tell us what you need
          </ButtonLink>
          <ButtonLink href="/join" size="lg" variant="secondary">
            Join as a professional
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

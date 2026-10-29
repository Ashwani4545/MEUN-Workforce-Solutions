import { ButtonLink } from "@/components/ui/Button";

export function DualAudience() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="bg-ink text-paper px-6 md:px-16 py-20">
        <p className="eyebrow text-graphite-light">For Businesses</p>
        <h2 className="mt-4 font-display text-3xl leading-tight max-w-sm">
          Staffing for offices, facilities and estates — at scale.
        </h2>
        <p className="mt-5 text-paper/70 leading-relaxed max-w-sm">
          Housekeeping, security and facility staff with contract terms,
          consolidated billing and a dedicated account manager.
        </p>
        <ButtonLink href="/for-business" variant="dark" className="mt-8 !bg-paper !text-ink hover:!bg-paper/90">
          Explore business staffing
        </ButtonLink>
      </div>

      <div className="bg-paper-dim px-6 md:px-16 py-20">
        <p className="eyebrow">For Professionals</p>
        <h2 className="mt-4 font-display text-3xl leading-tight max-w-sm">
          Find steady, respectful work — on your terms.
        </h2>
        <p className="mt-5 text-graphite leading-relaxed max-w-sm">
          Get verified once, get matched with households and businesses near
          you, and get paid on time, every time.
        </p>
        <ButtonLink href="/join" variant="primary" className="mt-8">
          Apply to join MEUN
        </ButtonLink>
      </div>
    </section>
  );
}

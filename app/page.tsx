import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { BundlePromo } from "@/components/home/BundlePromo";
import { VerificationInsights } from "@/components/home/VerificationInsights";
import { BookingSteps } from "@/components/home/BookingSteps";
import { DualAudience } from "@/components/home/DualAudience";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "MEUN — Verified Maids, Cooks, Drivers & More, Booked in Minutes",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceCategories />
      <BundlePromo />
      <VerificationInsights />
      <TrustSection />
      <BookingSteps />
      <DualAudience />

      <section className="container-content py-24 text-center">
        <h2 className="font-display text-3xl md:text-[2.6rem] max-w-2xl mx-auto">
          Ready to bring verified help into your home?
        </h2>
        <p className="mt-4 text-graphite max-w-md mx-auto">
          Search by city and service, compare real profiles, and book your
          first visit today.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <ButtonLink href="/workers" size="lg">
            Find Verified Help
          </ButtonLink>
          <ButtonLink href="/pricing" variant="secondary" size="lg">
            See Pricing
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

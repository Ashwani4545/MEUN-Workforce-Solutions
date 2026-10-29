import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="pt-28 md:pt-32 pb-24 container-content max-w-2xl">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-graphite-light">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-10 flex flex-col gap-8 text-graphite leading-relaxed">
        <section>
          <h2 className="font-display text-xl text-ink">1. Information we collect</h2>
          <p className="mt-2">
            We collect the information you provide when creating an account,
            booking a service, or contacting us — including your name, phone
            number, email address, city and, for bookings, your service
            address. Professionals listed on MEUN additionally undergo
            identity, police and background verification as part of
            onboarding.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">2. How we use your information</h2>
          <p className="mt-2">
            We use your information to create and manage your account,
            process bookings, communicate with you about your bookings, and
            improve the safety and quality of the platform. We do not sell
            your personal data to third parties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">3. Your rights under the DPDP Act</h2>
          <p className="mt-2">
            Under India&apos;s Digital Personal Data Protection Act, you have
            the right to access, correct and request erasure of your
            personal data, and to withdraw consent for its processing at any
            time. To exercise these rights, contact us at hello@meun.in.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">4. Data retention & security</h2>
          <p className="mt-2">
            We retain personal data only as long as needed to provide our
            services and meet legal obligations. Passwords are hashed using
            Argon2id and never stored in plain text. Session tokens are
            stored in httpOnly cookies to reduce exposure to client-side
            scripts.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">5. Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent to hello@meun.in.
          </p>
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="pt-28 md:pt-32 pb-24 container-content">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <p className="eyebrow">Get in Touch</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
            We&apos;re here to help.
          </h1>
          <p className="mt-5 text-graphite max-w-md leading-relaxed">
            Whether you need help finding the right professional, have a
            question about a booking, or want to bring MEUN to your business —
            reach out and a real person will respond.
          </p>

          <div className="mt-10 flex flex-col gap-5 text-sm">
            <div>
              <p className="font-medium">Call us</p>
              <p className="text-graphite">+91 11 4000 4000 · Mon–Sat, 9am–8pm</p>
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-graphite">hello@meun.in</p>
            </div>
            <div>
              <p className="font-medium">Head office</p>
              <p className="text-graphite">Gurugram, Haryana, India</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

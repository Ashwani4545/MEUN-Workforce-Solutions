import type { Metadata } from "next";
import { JoinForm } from "@/components/forms/JoinForm";

export const metadata: Metadata = { title: "Join as a Professional" };

const STEPS = [
  { title: "Apply", body: "Tell us your skills, experience and city." },
  { title: "Get verified", body: "Police check, background check and a short training module." },
  { title: "Get matched", body: "We connect you with households and businesses near you." },
  { title: "Get paid on time", body: "Transparent rates, paid on schedule, every time." },
];

export default function JoinPage() {
  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="container-content">
        <p className="eyebrow">Join MEUN</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl max-w-2xl">
          Steady, respectful work — on your terms.
        </h1>
        <p className="mt-5 text-graphite max-w-xl">
          MEUN connects verified professionals with households and businesses
          looking for reliable help. Get verified once, and get matched again
          and again.
        </p>
      </div>

      <div className="container-content mt-16 grid lg:grid-cols-2 gap-16">
        <div>
          <ol className="flex flex-col gap-8">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="font-display text-3xl text-graphite-light shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-display text-xl">{s.title}</h2>
                  <p className="mt-1 text-graphite">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative">
          <JoinForm />
        </div>
      </div>
    </div>
  );
}

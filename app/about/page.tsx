import type { Metadata } from "next";

export const metadata: Metadata = { title: "About MEUN" };

const VALUES = [
  { title: "Dignity, both ways", body: "A booking platform should protect the person providing the service as much as the person receiving it." },
  { title: "Verification without shortcuts", body: "No urgent-request exception skips a check. Every professional passes the same four-stage process." },
  { title: "Transparency in pricing", body: "What you see before you book is what you pay — service fee and GST included, not added as a surprise." },
];

const VERIFICATION_STEPS = [
  { title: "Identity & police verification", body: "Government ID and address are verified, and a police verification check is run before listing." },
  { title: "Background & reference checks", body: "Previous employment and references are contacted directly, not just noted on a form." },
  { title: "Health checks", body: "A medical checkup and vaccination record are confirmed and kept current." },
  { title: "Training certification", body: "Role-specific training — safety, hygiene, and service standards — is completed and certified." },
];

export default function AboutPage() {
  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="container-content max-w-2xl">
        <p className="eyebrow">About MEUN</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
          Built so that trust doesn&apos;t depend on luck.
        </h1>
        <p className="mt-6 text-graphite leading-relaxed">
          MEUN exists because finding household and facility help in India
          has long depended on word-of-mouth and hope. We built a platform
          where every professional is independently verified before they
          reach your door — and where verification is treated as
          infrastructure, not a marketing badge.
        </p>
      </div>

      <div className="container-content mt-20 grid sm:grid-cols-3 gap-10">
        {VALUES.map((v) => (
          <div key={v.title} className="border-t border-line pt-5">
            <h2 className="font-display text-xl">{v.title}</h2>
            <p className="mt-2 text-graphite text-sm leading-relaxed">{v.body}</p>
          </div>
        ))}
      </div>

      <div id="verification" className="container-content mt-24 scroll-mt-24">
        <p className="eyebrow">Our Process</p>
        <h2 className="mt-4 font-display text-3xl md:text-4xl max-w-lg">
          What &ldquo;verified&rdquo; actually means on MEUN.
        </h2>

        <ol className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-10">
          {VERIFICATION_STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-5">
              <span className="font-display text-2xl text-ink shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="mt-1 text-graphite text-sm leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

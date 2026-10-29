const PILLARS = [
  {
    title: "Police verification",
    body: "Every professional's identity is checked against local police records before they're listed.",
  },
  {
    title: "Background & reference checks",
    body: "Past employment and address history are independently verified, not just self-reported.",
  },
  {
    title: "Health & training checks",
    body: "Medical checkups, vaccination records and role-specific training are confirmed and kept current.",
  },
  {
    title: "Ongoing accountability",
    body: "Ratings, incident reports and a replacement guarantee keep every professional accountable after day one.",
  },
];

export function TrustSection() {
  return (
    <section id="verification" className="container-content py-24">
      <div className="grid md:grid-cols-[0.9fr_1.4fr] gap-12 md:gap-20">
        <div>
          <p className="eyebrow">Why Households Trust MEUN</p>
          <h2 className="mt-4 font-display text-3xl md:text-[2.6rem] leading-[1.12]">
            Verification isn&apos;t a badge. It&apos;s a process.
          </h2>
          <p className="mt-5 text-graphite leading-relaxed">
            Before anyone is listed on MEUN, they pass through the same
            four-stage check — no exceptions, no shortcuts for urgent
            requests.
          </p>
        </div>

        <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="border-t border-line pt-5">
              <dt className="font-display text-lg">{p.title}</dt>
              <dd className="mt-2 text-graphite text-[0.95rem] leading-relaxed">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

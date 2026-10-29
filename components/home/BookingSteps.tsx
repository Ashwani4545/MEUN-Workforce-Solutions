const STEPS = [
  {
    n: "1",
    title: "Tell us what you need",
    body: "Pick a service, your city and preferences — gender, experience, timing.",
  },
  {
    n: "2",
    title: "Compare verified profiles",
    body: "See real experience, languages, verification status and rates before you choose.",
  },
  {
    n: "3",
    title: "Book your slot",
    body: "Confirm a date, time and address. You'll get a start OTP to share only on arrival.",
  },
  {
    n: "4",
    title: "Start with confidence",
    body: "Rate the visit, extend the engagement, or request a replacement — no questions asked.",
  },
];

export function BookingSteps() {
  return (
    <section id="how-it-works" className="container-content py-24">
      <p className="eyebrow">How It Works</p>
      <h2 className="mt-4 font-display text-3xl md:text-[2.6rem] max-w-xl">
        From search to service, in four steps.
      </h2>

      <ol className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
        {STEPS.map((step, i) => (
          <li key={step.n} className="relative">
            <span className="font-display text-5xl text-graphite-light">
              {step.n}
            </span>
            <h3 className="mt-4 font-display text-xl">{step.title}</h3>
            <p className="mt-2 text-graphite text-[0.93rem] leading-relaxed">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

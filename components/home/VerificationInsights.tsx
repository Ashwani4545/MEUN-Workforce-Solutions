import Link from "next/link";
import Image from "next/image";

const CALLOUTS = [
  { label: "Police Verification", top: "28%", left: "18%" },
  { label: "Medical Checkup", top: "62%", left: "22%" },
];

export function VerificationInsights() {
  return (
    <section className="container-content py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative aspect-[4/5] max-w-sm mx-auto md:mx-0 rounded-2xl overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/17842832/pexels-photo-17842832/free-photo-of-electrician-by-fuse-box.jpeg"
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 384px, 90vw"
          />
          {CALLOUTS.map((c) => (
            <div
              key={c.label}
              className="absolute flex items-center gap-2"
              style={{ top: c.top, left: c.left }}
            >
              <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-paper" />
              <span className="h-px w-8 bg-ink" />
              <span className="text-xs font-medium text-ink whitespace-nowrap bg-paper/90 px-1.5 py-0.5 rounded">
                {c.label}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center md:text-left">
          <p className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-ink">
            Verify<span className="font-normal">Score</span>
          </p>
          <h2 className="mt-4 font-display font-bold text-2xl md:text-[1.8rem] text-ink">
            Know exactly who&apos;s coming to your home.
          </h2>
          <p className="mt-4 text-graphite max-w-md mx-auto md:mx-0 leading-relaxed">
            Every profile shows the full verification trail — identity,
            police check, references and training — before you ever confirm
            a booking.
          </p>
          <Link
            href="/about#verification"
            className="mt-7 inline-flex items-center rounded-lg bg-ink text-white font-semibold px-7 py-3.5 hover:bg-ink-soft transition-colors"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { stockPhoto } from "@/lib/stockPhoto";

export function BundlePromo() {
  return (
    <section className="container-content py-4">
      <div className="relative rounded-2xl overflow-hidden bg-paper-dim">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-14">
            <h2 className="font-display font-extrabold text-ink text-3xl md:text-[2.4rem] leading-tight">
              Build Your Own
              <br />
              Household Team!
            </h2>
            <div className="mt-5 w-10 border-t-2 border-ink" />
            <p className="mt-5 text-graphite text-lg">
              Bundle a maid, cook and driver together and
              <br className="hidden md:block" />
              <span className="font-semibold text-ink">save up to 15%</span> on
              your monthly plan
              <br />
              +
              <br />
              <span className="font-semibold text-ink">First booking free trial</span> on every role
            </p>
            <Link
              href="/pricing"
              className="mt-7 inline-flex items-center rounded-lg bg-ink text-white font-semibold px-7 py-3.5 hover:bg-ink-soft transition-colors"
            >
              Build Your Bundle
            </Link>
          </div>
          <div className="relative h-72 md:h-[420px] w-full">
            <Image
              src={stockPhoto("meun-bundle-team", 900, 900)}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

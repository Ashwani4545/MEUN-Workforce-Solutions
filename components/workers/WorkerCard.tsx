import Link from "next/link";
import Image from "next/image";
import { VerifiedBadge } from "@/components/ui/Badge";
import type { Worker } from "@/types";

const CATEGORY_LABEL: Record<string, string> = {
  maid: "Maid",
  cook: "Cook",
  driver: "Driver",
  babysitter: "Babysitter",
  "elder-care": "Elder Care",
  "security-guard": "Security Guard",
  "office-boy": "Office Boy",
  housekeeping: "Housekeeping",
  cleaner: "Cleaner",
  gardener: "Gardener",
  electrician: "Electrician",
  plumber: "Plumber",
  "ac-repair": "AC Repair",
  carpenter: "Carpenter",
  "deep-cleaning": "Deep Cleaning",
};

export function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <Link
      href={`/workers/${worker.id}`}
      className="group card-surface flex flex-col overflow-hidden hover:border-ink"
    >
      <div className="relative aspect-[4/3] bg-paper-dim">
        <Image
          src={worker.photoUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
        {worker.verification.policeVerified && (
          <div className="absolute top-3 left-3">
            <VerifiedBadge label="Verified" className="bg-paper/95" />
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight">{worker.name}</h3>
          <span className="text-xs text-graphite-light whitespace-nowrap mt-1">
            {worker.experienceYears} yrs exp
          </span>
        </div>
        <p className="mt-1 text-sm text-graphite">
          {CATEGORY_LABEL[worker.category] ?? worker.category} · {worker.city}
        </p>
        <p className="mt-2 text-xs text-graphite-light line-clamp-1">
          {worker.subServices.join(" · ")}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-sm font-semibold">
            ₹{worker.salaryFrom.toLocaleString("en-IN")}
            <span className="text-graphite-light font-normal">
              {" "}
              / {worker.salaryType.replace("-", " ")}
            </span>
          </span>
          <span className="text-sm font-medium text-ink group-hover:underline">
            View profile
          </span>
        </div>
      </div>
    </Link>
  );
}

import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getWorkerById } from "@/lib/db";
import { VerifiedBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

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

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const worker = await getWorkerById(params.id);
  if (!worker) return { title: "Professional not found" };
  return {
    title: `${worker.name} — ${CATEGORY_LABEL[worker.category] ?? worker.category} in ${worker.city}`,
    description: worker.bio,
  };
}

export default async function WorkerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const worker = await getWorkerById(params.id);
  if (!worker) notFound();

  const checklist: { label: string; ok: boolean }[] = [
    { label: "Police verification", ok: worker.verification.policeVerified },
    { label: "Background check", ok: worker.verification.backgroundVerified },
    { label: "KYC verified", ok: worker.verification.kycVerified },
    { label: "Medical checkup", ok: worker.verification.medicalCheckup },
    { label: "Vaccinated", ok: worker.verification.vaccinated },
    { label: "Training certified", ok: worker.verification.trainingCertified },
  ];

  return (
    <div className="pt-28 md:pt-32 pb-24 container-content">
      <div className="grid lg:grid-cols-[380px_1fr] gap-12">
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-paper-dim">
            <Image src={worker.photoUrl} alt="" fill className="object-cover" sizes="380px" />
          </div>

          <div className="mt-6 card-surface p-5">
            <h2 className="font-display text-lg">Verification checklist</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-graphite">{item.label}</span>
                  <VerifiedBadge label={item.ok ? "Confirmed" : "Pending"} active={item.ok} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="eyebrow">{CATEGORY_LABEL[worker.category] ?? worker.category}</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">{worker.name}</h1>
          <p className="mt-2 text-graphite">
            {worker.city} · {worker.experienceYears} years experience · Speaks{" "}
            {worker.languages.join(", ")}
          </p>

          <p className="mt-6 text-graphite leading-relaxed max-w-xl">{worker.bio}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {worker.subServices.map((s) => (
              <span
                key={s}
                className="text-xs border border-line rounded-full px-3 py-1.5 text-graphite"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-6 border-t border-line pt-8">
            <div>
              <p className="text-xs text-graphite-light">Rate</p>
              <p className="mt-1 font-display text-xl">
                ₹{worker.salaryFrom.toLocaleString("en-IN")}–
                {worker.salaryTo.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-graphite-light capitalize">
                {worker.salaryType.replace("-", " ")}
              </p>
            </div>
            <div>
              <p className="text-xs text-graphite-light">Availability</p>
              <p className="mt-1 font-display text-xl capitalize">
                {worker.availability.join(", ").replace(/-/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-xs text-graphite-light">Gender</p>
              <p className="mt-1 font-display text-xl capitalize">{worker.gender}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={`/schedule?workerId=${worker.id}`} size="lg">
              Book {worker.name.split(" ")[0]}
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Ask a question first
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { getWorkers } from "@/lib/db";
import { workerFilterSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = workerFilterSchema.safeParse(
    Object.fromEntries(searchParams.entries())
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  }
  const filters = parsed.data;

  let workers = await getWorkers();

  if (filters.category) {
    workers = workers.filter((w) => w.category === filters.category);
  }
  if (filters.city) {
    workers = workers.filter((w) => w.city === filters.city);
  }
  if (filters.gender && filters.gender !== "any") {
    workers = workers.filter(
      (w) => w.gender === filters.gender || w.gender === "any"
    );
  }
  if (filters.ageBand) {
    workers = workers.filter((w) => w.ageBand === filters.ageBand);
  }
  if (filters.salaryType) {
    workers = workers.filter((w) => w.salaryType === filters.salaryType);
  }
  if (filters.availability) {
    workers = workers.filter((w) =>
      w.availability.includes(filters.availability as never)
    );
  }
  if (filters.verifiedOnly) {
    workers = workers.filter(
      (w) => w.verification.policeVerified && w.verification.backgroundVerified
    );
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    workers = workers.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.subServices.some((s) => s.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ workers, count: workers.length });
}

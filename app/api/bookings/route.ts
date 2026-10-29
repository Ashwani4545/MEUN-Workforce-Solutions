import { NextResponse } from "next/server";
import { getAccessTokenFromCookies } from "@/lib/session";
import { verifyAccessToken } from "@/lib/jwt";
import { getWorkerById } from "@/lib/db";
import { calculatePrice } from "@/lib/pricing";
import { z } from "zod";

const previewSchema = z.object({
  workerId: z.string().min(1),
  package: z.enum(["part-time", "full-time", "live-in", "trial-day"]),
  couponCode: z.string().optional(),
});

export async function POST(req: Request) {
  const token = getAccessTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }
  try {
    await verifyAccessToken(token);
  } catch {
    return NextResponse.json({ error: "Session expired." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = previewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const worker = await getWorkerById(parsed.data.workerId);
  if (!worker) {
    return NextResponse.json({ error: "Professional not found" }, { status: 404 });
  }

  const priceSummary = calculatePrice(worker, parsed.data.package, parsed.data.couponCode);
  return NextResponse.json({ priceSummary });
}

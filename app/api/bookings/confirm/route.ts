import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getAccessTokenFromCookies } from "@/lib/session";
import { verifyAccessToken } from "@/lib/jwt";
import { verifyCsrf } from "@/lib/csrf";
import { bookingSchema } from "@/lib/validations";
import { getWorkerById, createBooking, findBookingByIdempotencyKey } from "@/lib/db";
import { calculatePrice } from "@/lib/pricing";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";
import type { Booking } from "@/types";

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  const token = getAccessTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }
  let userId: string;
  try {
    const payload = await verifyAccessToken(token);
    userId = payload.sub;
  } catch {
    return NextResponse.json({ error: "Session expired." }, { status: 401 });
  }

  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const limit = rateLimit(clientKeyFromRequest(req, `booking:${userId}`), 10, 60 * 10);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many booking attempts. Please slow down." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the booking details.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // Idempotency: replaying the same request (double-click, retry after a
  // dropped response) returns the original booking instead of creating a
  // duplicate.
  const existing = await findBookingByIdempotencyKey(input.idempotencyKey);
  if (existing) {
    if (existing.userId !== userId) {
      return NextResponse.json({ error: "Invalid request." }, { status: 403 });
    }
    return NextResponse.json({ booking: existing }, { status: 200 });
  }

  const worker = await getWorkerById(input.workerId);
  if (!worker) {
    return NextResponse.json({ error: "Professional not found." }, { status: 404 });
  }

  // Price is recalculated server-side from the worker's real rate —
  // whatever total the client displayed is advisory only.
  const priceSummary = calculatePrice(worker, input.package, input.couponCode);

  const booking: Booking = {
    id: nanoid(16),
    idempotencyKey: input.idempotencyKey,
    userId,
    workerId: worker.id,
    category: worker.category,
    subService: input.subService,
    package: input.package,
    date: input.date,
    timeSlot: input.timeSlot,
    address: input.address,
    notes: input.notes ?? "",
    priceSummary,
    status: "pending",
    startOtp: generateOtp(),
    createdAt: new Date().toISOString(),
  };

  const saved = await createBooking(booking);
  return NextResponse.json({ booking: saved }, { status: 201 });
}

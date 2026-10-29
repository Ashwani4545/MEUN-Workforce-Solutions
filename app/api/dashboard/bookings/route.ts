import { NextResponse } from "next/server";
import { getAccessTokenFromCookies } from "@/lib/session";
import { verifyAccessToken } from "@/lib/jwt";
import { getBookingsForUser } from "@/lib/db";

export async function GET() {
  const token = getAccessTokenFromCookies();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = await verifyAccessToken(token);
    const bookings = await getBookingsForUser(payload.sub);
    return NextResponse.json({ bookings: bookings.reverse() });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

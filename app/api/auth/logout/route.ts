import { NextResponse } from "next/server";
import { getRefreshTokenFromCookies, clearSessionCookies } from "@/lib/session";
import { verifyRefreshToken } from "@/lib/jwt";
import { revokeRefreshToken } from "@/lib/refreshStore";

export async function POST() {
  const refreshToken = getRefreshTokenFromCookies();
  if (refreshToken) {
    try {
      const payload = await verifyRefreshToken(refreshToken);
      revokeRefreshToken(payload.tid);
    } catch {
      // Token already invalid/expired — nothing to revoke.
    }
  }
  clearSessionCookies();
  return NextResponse.json({ ok: true });
}

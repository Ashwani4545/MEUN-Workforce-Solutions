import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getRefreshTokenFromCookies, setSessionCookies, clearSessionCookies } from "@/lib/session";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import { consumeRefreshToken, putRefreshToken } from "@/lib/refreshStore";
import { getUserById } from "@/lib/db";

export async function POST() {
  const refreshToken = getRefreshTokenFromCookies();
  if (!refreshToken) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  try {
    const payload = await verifyRefreshToken(refreshToken);
    // Rotation: this refresh token is now burned, whether or not the
    // request succeeds. If it's replayed later (e.g. stolen + reused
    // after the legitimate client already rotated), consumeRefreshToken
    // will return null and the session is rejected — a signal that would,
    // in a full deployment, also revoke the whole token family.
    const userId = consumeRefreshToken(payload.tid);
    if (!userId || userId !== payload.sub) {
      clearSessionCookies();
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      clearSessionCookies();
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const accessToken = await signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    });
    const newTokenId = nanoid(21);
    const newRefreshToken = await signRefreshToken(user.id, newTokenId);
    putRefreshToken(newTokenId, user.id, 30 * 24 * 60 * 60);
    setSessionCookies(accessToken, newRefreshToken);

    return NextResponse.json({ ok: true });
  } catch {
    clearSessionCookies();
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
}

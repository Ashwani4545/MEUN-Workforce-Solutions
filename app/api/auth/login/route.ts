import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { loginSchema } from "@/lib/validations";
import { verifyPassword } from "@/lib/password";
import { getUserByEmail } from "@/lib/db";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { putRefreshToken } from "@/lib/refreshStore";
import { setSessionCookies } from "@/lib/session";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

const GENERIC_ERROR = "Incorrect email or password.";

export async function POST(req: Request) {
  // Tight limit: login is the highest-value target for credential stuffing.
  const limit = rateLimit(clientKeyFromRequest(req, "login"), 8, 60 * 10);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await getUserByEmail(email);

  // Always run a hash comparison, even for unknown emails, so response
  // timing doesn't reveal whether the account exists.
  const dummyHash =
    "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQAAAAAAAAAAA$0000000000000000000000000000000000000000000";
  const ok = await verifyPassword(user?.passwordHash ?? dummyHash, password);

  if (!user || !ok) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const accessToken = await signAccessToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  });
  const tokenId = nanoid(21);
  const refreshToken = await signRefreshToken(user.id, tokenId);
  putRefreshToken(tokenId, user.id, 30 * 24 * 60 * 60);
  setSessionCookies(accessToken, refreshToken);

  const { passwordHash: _omit, ...publicUser } = user;
  return NextResponse.json({ user: publicUser });
}

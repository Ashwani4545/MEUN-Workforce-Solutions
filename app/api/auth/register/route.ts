import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { signupSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/password";
import { createUser } from "@/lib/db";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { putRefreshToken } from "@/lib/refreshStore";
import { setSessionCookies } from "@/lib/session";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";
import type { User } from "@/types";

export async function POST(req: Request) {
  const limit = rateLimit(clientKeyFromRequest(req, "register"), 5, 60 * 10);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, phone, city, password, role } = parsed.data;

  const passwordHash = await hashPassword(password);
  const user: User = {
    id: nanoid(16),
    name,
    email: email.toLowerCase(),
    phone,
    passwordHash,
    role,
    city,
    createdAt: new Date().toISOString(),
  };

  try {
    await createUser(user);
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_EXISTS") {
      // Deliberately generic message: don't confirm which emails are
      // already registered.
      return NextResponse.json(
        { error: "We couldn't create your account. Please try signing in instead." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
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
  return NextResponse.json({ user: publicUser }, { status: 201 });
}

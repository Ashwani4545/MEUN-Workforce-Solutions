import { NextResponse } from "next/server";
import { z } from "zod";
import { getAccessTokenFromCookies } from "@/lib/session";
import { verifyAccessToken } from "@/lib/jwt";
import { getUserById, updateUser } from "@/lib/db";
import { verifyCsrf } from "@/lib/csrf";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  city: z.string().trim().min(2).max(60).optional(),
});

export async function PATCH(req: Request) {
  const token = getAccessTokenFromCookies();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let userId: string;
  try {
    const payload = await verifyAccessToken(token);
    userId = payload.sub;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await updateUser(userId, parsed.data);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { passwordHash: _omit, ...publicUser } = updated;
  return NextResponse.json({ user: publicUser });
}

export async function GET() {
  const token = getAccessTokenFromCookies();
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const payload = await verifyAccessToken(token);
    const user = await getUserById(payload.sub);
    if (!user) return NextResponse.json({ user: null }, { status: 401 });
    const { passwordHash: _omit, ...publicUser } = user;
    return NextResponse.json({ user: publicUser });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

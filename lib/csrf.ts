import { cookies } from "next/headers";
import { nanoid } from "nanoid";

/**
 * Double-submit CSRF protection.
 *
 * SameSite=Strict on the session cookies already blocks the classic
 * cross-site form-post CSRF case, but this adds defence-in-depth for any
 * state-changing request (booking confirm, profile update, logout): the
 * client must echo a token back in a custom header that a cross-site page
 * cannot read or set on the visitor's behalf.
 */

const CSRF_COOKIE = "meun_csrf";
export const CSRF_HEADER = "x-csrf-token";

export function ensureCsrfCookie(): string {
  const jar = cookies();
  const existing = jar.get(CSRF_COOKIE)?.value;
  if (existing) return existing;
  const token = nanoid(32);
  jar.set(CSRF_COOKIE, token, {
    httpOnly: false, // must be readable by client JS to echo back in the header
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return token;
}

export function verifyCsrf(req: Request): boolean {
  const cookieToken = cookies().get(CSRF_COOKIE)?.value;
  const headerToken = req.headers.get(CSRF_HEADER);
  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}

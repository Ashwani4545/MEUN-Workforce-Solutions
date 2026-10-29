import { cookies } from "next/headers";

export const ACCESS_COOKIE = "meun_at";
export const REFRESH_COOKIE = "meun_rt";

const isProd = process.env.NODE_ENV === "production";

export function setSessionCookies(access: string, refresh: string) {
  const jar = cookies();
  jar.set(ACCESS_COOKIE, access, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60,
  });
  jar.set(REFRESH_COOKIE, refresh, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/api/auth",
    maxAge: 30 * 24 * 60 * 60,
  });
}

export function clearSessionCookies() {
  const jar = cookies();
  jar.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  jar.set(REFRESH_COOKIE, "", { path: "/api/auth", maxAge: 0 });
}

export function getAccessTokenFromCookies(): string | undefined {
  return cookies().get(ACCESS_COOKIE)?.value;
}

export function getRefreshTokenFromCookies(): string | undefined {
  return cookies().get(REFRESH_COOKIE)?.value;
}

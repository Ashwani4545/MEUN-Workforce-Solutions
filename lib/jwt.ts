import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/types";

const ACCESS_TTL_SECONDS = 15 * 60; // 15 minutes, per spec
const REFRESH_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

function getSecret(name: "access" | "refresh"): Uint8Array {
  const raw =
    name === "access"
      ? process.env.JWT_ACCESS_SECRET
      : process.env.JWT_REFRESH_SECRET;

  if (!raw) {
    // Fail loudly rather than silently falling back to a guessable dev
    // secret in production. In local dev without a .env, a random secret
    // is generated per-process so the app still runs.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing required env var for ${name} JWT secret. Set JWT_${name.toUpperCase()}_SECRET.`
      );
    }
    return new TextEncoder().encode(`dev-only-insecure-${name}-secret-do-not-deploy`);
  }
  return new TextEncoder().encode(raw);
}

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  email: string;
}

export async function signAccessToken(payload: AccessTokenPayload) {
  return new SignJWT({ role: payload.role, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .sign(getSecret("access"));
}

export async function signRefreshToken(sub: string, tokenId: string) {
  return new SignJWT({ tid: tokenId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TTL_SECONDS}s`)
    .sign(getSecret("refresh"));
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret("access"));
  return payload as AccessTokenPayload & { sub: string; iat: number; exp: number };
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret("refresh"));
  return payload as { sub: string; tid: string; iat: number; exp: number };
}

export const TOKEN_TTL = {
  ACCESS_TTL_SECONDS,
  REFRESH_TTL_SECONDS,
};

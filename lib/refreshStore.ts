/**
 * Rotating refresh-token store.
 *
 * Shaped exactly like a Redis-backed store (set with TTL, get, delete) so
 * that swapping this for real Redis is a matter of replacing the three
 * functions below with `redis.set(key, value, "EX", ttl)`, `redis.get`,
 * and `redis.del` — nothing else in the auth flow changes.
 *
 * In-memory only: rotated tokens are lost on server restart, which simply
 * means affected users need to log in again. Acceptable for a single-
 * instance deployment; replace with Redis before scaling horizontally.
 */

interface Entry {
  userId: string;
  expiresAt: number;
}

const store = new Map<string, Entry>();

export function putRefreshToken(tokenId: string, userId: string, ttlSeconds: number) {
  store.set(tokenId, { userId, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function consumeRefreshToken(tokenId: string): string | null {
  const entry = store.get(tokenId);
  store.delete(tokenId); // rotation: a refresh token is single-use
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) return null;
  return entry.userId;
}

export function revokeRefreshToken(tokenId: string) {
  store.delete(tokenId);
}

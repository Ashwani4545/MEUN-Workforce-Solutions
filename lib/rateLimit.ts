import { query } from "@/lib/pg";

/**
 * Fixed-window rate limiter, backed by Postgres so the limit is shared by all
 * server instances (an in-memory counter lets an attacker multiply their
 * allowance by however many instances are running).
 *
 * One atomic upsert both counts the request and starts a new window when the
 * old one has expired, so concurrent requests can't race each other.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const { rows } = await query<{ count: number; reset_ms: string }>(
    `INSERT INTO rate_limits (key, count, reset_at)
     VALUES ($1, 1, now() + ($2 * interval '1 second'))
     ON CONFLICT (key) DO UPDATE SET
       count    = CASE WHEN rate_limits.reset_at < now() THEN 1 ELSE rate_limits.count + 1 END,
       reset_at = CASE WHEN rate_limits.reset_at < now()
                       THEN now() + ($2 * interval '1 second')
                       ELSE rate_limits.reset_at END
     RETURNING count, (extract(epoch FROM reset_at) * 1000)::bigint AS reset_ms`,
    [key, windowSeconds]
  );

  const { count, reset_ms } = rows[0];
  const resetAt = Number(reset_ms);

  // Housekeeping: purge long-expired windows now and then.
  if (Math.random() < 0.01) {
    await query("DELETE FROM rate_limits WHERE reset_at < now() - interval '1 hour'");
  }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt,
  };
}

export function clientKeyFromRequest(req: Request, scope: string): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]?.trim() : "unknown";
  return `${scope}:${ip}`;
}

/**
 * Fixed-window rate limiter.
 *
 * In production behind Kong, rate limiting on `/api/auth/*` and other
 * public endpoints should happen at the gateway (already configured per
 * the platform's infra) so abusive traffic is dropped before it reaches
 * application servers at all. This in-process limiter is the
 * application-level backstop for this standalone deployment, and mirrors
 * the same key/limit/window shape Kong's rate-limiting plugin uses so the
 * two are easy to keep in sync.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowSeconds * 1000;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export function clientKeyFromRequest(req: Request, scope: string): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]?.trim() : "unknown";
  return `${scope}:${ip}`;
}

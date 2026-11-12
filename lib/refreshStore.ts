import { query } from "@/lib/pg";

/**
 * Rotating refresh-token store, backed by Postgres so every server instance
 * sees the same tokens (the previous in-memory Map logged users out whenever a
 * request landed on a different instance or the process restarted).
 *
 * Refresh tokens are single-use: `consumeRefreshToken` deletes the row and
 * returns the owner in one atomic statement, so a replayed token can never be
 * redeemed twice, even by two simultaneous requests.
 */

export async function putRefreshToken(
  tokenId: string,
  userId: string,
  ttlSeconds: number
): Promise<void> {
  await query(
    `INSERT INTO refresh_tokens (token_id, user_id, expires_at)
     VALUES ($1, $2, now() + ($3 * interval '1 second'))`,
    [tokenId, userId, ttlSeconds]
  );

  // Housekeeping: purge expired rows now and then so the table stays small.
  if (Math.random() < 0.02) {
    await query("DELETE FROM refresh_tokens WHERE expires_at < now()");
  }
}

export async function consumeRefreshToken(
  tokenId: string
): Promise<string | null> {
  const { rows } = await query<{ user_id: string; valid: boolean }>(
    `DELETE FROM refresh_tokens
     WHERE token_id = $1
     RETURNING user_id, (expires_at > now()) AS valid`,
    [tokenId]
  );
  const row = rows[0];
  if (!row || !row.valid) return null;
  return row.user_id;
}

export async function revokeRefreshToken(tokenId: string): Promise<void> {
  await query("DELETE FROM refresh_tokens WHERE token_id = $1", [tokenId]);
}

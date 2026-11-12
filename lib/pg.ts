import { Pool, type QueryResult, type QueryResultRow } from "pg";

/**
 * Single shared Postgres pool.
 *
 * - Created lazily, so importing this module (e.g. during `next build`) never
 *   needs a database.
 * - Cached on `globalThis` so dev hot-reloads and serverless warm instances
 *   reuse one pool instead of opening a new set of connections each time.
 * - Keep `DATABASE_POOL_MAX` small on serverless hosts: every warm instance
 *   gets its own pool. Use your provider's *pooled* connection string.
 *
 * SSL: provider URLs (Neon, Supabase, ...) carry `sslmode=require`, which the
 * driver honours. Set DATABASE_SSL=false only for a local, non-TLS database.
 */

const globalForPg = globalThis as unknown as { __meunPool?: Pool };

export function getPool(): Pool {
  if (globalForPg.__meunPool) return globalForPg.__meunPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add your Postgres connection string to the environment (see .env.example)."
    );
  }

  const pool = new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    ...(process.env.DATABASE_SSL === "false" ? { ssl: false } : {}),
  });

  // An idle client erroring (e.g. the provider restarted) must not crash the
  // process; the pool discards it and opens a fresh one on the next query.
  pool.on("error", (err) => {
    console.error("Postgres pool error:", err.message);
  });

  globalForPg.__meunPool = pool;
  return pool;
}

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params);
}

/** Postgres unique-violation error code. */
export const UNIQUE_VIOLATION = "23505";

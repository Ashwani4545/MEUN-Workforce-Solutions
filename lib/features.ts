/**
 * Feature switch for the worker marketplace (browsing professionals and
 * online booking).
 *
 * It is OFF unless MARKETPLACE_ENABLED=true is set on the server. The worker
 * catalogue shipped in this repo is sample data (invented names and generated
 * photos), so the public site must not present it as real, verified people.
 * Turn this on only after `data/workers.json` has been replaced with real,
 * verified records and loaded with `npm run seed`.
 *
 * Read on the server at request time (never NEXT_PUBLIC_*), so changing the
 * variable and redeploying is all that is needed.
 */
export function marketplaceEnabled(): boolean {
  return process.env.MARKETPLACE_ENABLED === "true";
}

// Loads worker profiles from data/workers.json into the database (upsert by id,
// so it is safe to re-run).
//   DATABASE_URL=postgres://... npm run seed
//
// IMPORTANT: data/workers.json currently holds SAMPLE profiles (invented names
// and generated avatars, see scripts/generate-sample-workers.mjs). Replace it
// with real, verified worker records before launching to the public.
import { readFileSync } from "fs";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Export your Postgres connection string first.");
  process.exit(1);
}

const workers = JSON.parse(
  readFileSync(new URL("../data/workers.json", import.meta.url), "utf-8")
);

const client = new pg.Client({
  connectionString: url,
  ...(process.env.DATABASE_SSL === "false" ? { ssl: false } : {}),
});

try {
  await client.connect();
  await client.query("BEGIN");
  for (const w of workers) {
    await client.query(
      `INSERT INTO workers (id, data) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [w.id, JSON.stringify(w)]
    );
  }
  await client.query("COMMIT");
  console.log(`Seeded ${workers.length} worker profiles.`);
} catch (err) {
  await client.query("ROLLBACK").catch(() => {});
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

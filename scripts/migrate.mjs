// Creates / updates the database tables. Safe to run as often as you like.
//   DATABASE_URL=postgres://... npm run db:migrate
//
// `npm run build` runs this with --skip-if-no-db, so every deploy brings the
// tables up to date automatically, while a build without a database (e.g. a
// local `npm run build`) simply skips this step. It only creates tables; it
// never loads or overwrites worker data (that is `npm run seed`).
import { readFileSync } from "fs";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url && process.argv.includes("--skip-if-no-db")) {
  console.log("DATABASE_URL not set; skipping database setup.");
  process.exit(0);
}
if (!url) {
  console.error("DATABASE_URL is not set. Export your Postgres connection string first.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ...(process.env.DATABASE_SSL === "false" ? { ssl: false } : {}),
});

try {
  await client.connect();
  const sql = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf-8");
  await client.query(sql);
  console.log("Database schema is up to date.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

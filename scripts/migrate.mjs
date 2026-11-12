// Creates / updates the database tables. Safe to run as often as you like.
//   DATABASE_URL=postgres://... npm run db:migrate
import { readFileSync } from "fs";
import pg from "pg";

const url = process.env.DATABASE_URL;
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

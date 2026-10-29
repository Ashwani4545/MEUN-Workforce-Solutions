import { promises as fs } from "fs";
import path from "path";
import type { User, Booking, ContactSubmission, Worker } from "@/types";

/**
 * Local, zero-infra data layer.
 *
 * This project is designed to run standalone with no external database so
 * it is deployable immediately. Every function here is written the way a
 * Drizzle/Postgres repository function would be (async, single
 * responsibility, no leaking of storage details) specifically so that
 * swapping the body of each function for a real `db.query...` / `db.insert`
 * call is a contained change — nothing outside lib/db.ts needs to know
 * where the data actually lives.
 *
 * DO NOT use this as-is in a real multi-instance production deployment:
 * a single JSON file has no row-level locking and will not survive
 * horizontal scaling. It exists so this codebase runs correctly today.
 */

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

// A simple in-process mutex so concurrent requests don't clobber each
// other's writes to the same JSON file. A real database's transaction
// support replaces this entirely.
const locks = new Map<string, Promise<unknown>>();
async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prior = locks.get(key) ?? Promise.resolve();
  let release: () => void;
  const next = new Promise<void>((res) => (release = res));
  locks.set(
    key,
    prior.then(() => next)
  );
  await prior;
  try {
    return await fn();
  } finally {
    release!();
  }
}

// ---------- Users ----------

export async function getUsers(): Promise<User[]> {
  return readJson<User[]>("users.json", []);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function createUser(user: User): Promise<User> {
  return withLock("users", async () => {
    const users = await getUsers();
    if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
      throw new Error("EMAIL_EXISTS");
    }
    users.push(user);
    await writeJson("users.json", users);
    return user;
  });
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<User, "name" | "city">>
): Promise<User | null> {
  return withLock("users", async () => {
    const users = await getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...patch };
    await writeJson("users.json", users);
    return users[idx];
  });
}

// ---------- Workers (seed catalogue, read-only from the app's perspective) ----------

let workerCache: Worker[] | null = null;

export async function getWorkers(): Promise<Worker[]> {
  if (workerCache) return workerCache;
  workerCache = await readJson<Worker[]>("workers.json", []);
  return workerCache;
}

export async function getWorkerById(id: string): Promise<Worker | null> {
  const workers = await getWorkers();
  return workers.find((w) => w.id === id) ?? null;
}

// ---------- Bookings ----------

export async function getBookings(): Promise<Booking[]> {
  return readJson<Booking[]>("bookings.json", []);
}

export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  const bookings = await getBookings();
  return bookings.filter((b) => b.userId === userId);
}

export async function findBookingByIdempotencyKey(
  key: string
): Promise<Booking | null> {
  const bookings = await getBookings();
  return bookings.find((b) => b.idempotencyKey === key) ?? null;
}

export async function createBooking(booking: Booking): Promise<Booking> {
  return withLock("bookings", async () => {
    const existing = await findBookingByIdempotencyKey(booking.idempotencyKey);
    if (existing) return existing; // idempotent replay
    const bookings = await getBookings();
    bookings.push(booking);
    await writeJson("bookings.json", bookings);
    return booking;
  });
}

// ---------- Contact submissions ----------

export async function saveContactSubmission(
  submission: ContactSubmission
): Promise<void> {
  return withLock("contact", async () => {
    const all = await readJson<ContactSubmission[]>(
      "contact-submissions.json",
      []
    );
    all.push(submission);
    await writeJson("contact-submissions.json", all);
  });
}

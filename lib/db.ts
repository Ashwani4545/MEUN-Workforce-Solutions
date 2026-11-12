import type { User, Booking, ContactSubmission, Worker } from "@/types";
import { query, UNIQUE_VIOLATION } from "@/lib/pg";

/**
 * PostgreSQL data layer. Schema lives in db/schema.sql (`npm run db:migrate`).
 * Every query is parameterised — never build SQL by string concatenation.
 */

// ---------- Row mappers (snake_case rows -> the camelCase types in /types) ----------

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: User["role"];
  city: string | null;
  created_at: Date;
}

function toUser(r: UserRow): User {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    passwordHash: r.password_hash,
    role: r.role,
    city: r.city,
    createdAt: r.created_at.toISOString(),
  };
}

interface BookingRow {
  id: string;
  idempotency_key: string;
  user_id: string;
  worker_id: string;
  category: Booking["category"];
  sub_service: string;
  package: Booking["package"];
  date: string;
  time_slot: string;
  address: Booking["address"];
  notes: string;
  price_summary: Booking["priceSummary"];
  status: Booking["status"];
  start_otp: string;
  created_at: Date;
}

function toBooking(r: BookingRow): Booking {
  return {
    id: r.id,
    idempotencyKey: r.idempotency_key,
    userId: r.user_id,
    workerId: r.worker_id,
    category: r.category,
    subService: r.sub_service,
    package: r.package,
    date: r.date,
    timeSlot: r.time_slot,
    address: r.address,
    notes: r.notes,
    priceSummary: r.price_summary,
    status: r.status,
    startOtp: r.start_otp,
    createdAt: r.created_at.toISOString(),
  };
}

// ---------- Users ----------

export async function getUserByEmail(email: string): Promise<User | null> {
  const { rows } = await query<UserRow>(
    "SELECT * FROM users WHERE lower(email) = lower($1)",
    [email]
  );
  return rows[0] ? toUser(rows[0]) : null;
}

export async function getUserById(id: string): Promise<User | null> {
  const { rows } = await query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] ? toUser(rows[0]) : null;
}

export async function createUser(user: User): Promise<User> {
  try {
    const { rows } = await query<UserRow>(
      `INSERT INTO users (id, name, email, phone, password_hash, role, city, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.passwordHash,
        user.role,
        user.city,
        user.createdAt,
      ]
    );
    return toUser(rows[0]);
  } catch (err) {
    // The unique index on lower(email) is the source of truth for duplicates,
    // so two simultaneous sign-ups can never both succeed.
    if ((err as { code?: string }).code === UNIQUE_VIOLATION) {
      throw new Error("EMAIL_EXISTS");
    }
    throw err;
  }
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<User, "name" | "city">>
): Promise<User | null> {
  const sets: string[] = [];
  const values: unknown[] = [id];
  if (patch.name !== undefined) {
    values.push(patch.name);
    sets.push(`name = $${values.length}`);
  }
  if (patch.city !== undefined) {
    values.push(patch.city);
    sets.push(`city = $${values.length}`);
  }
  if (sets.length === 0) return getUserById(id);

  const { rows } = await query<UserRow>(
    `UPDATE users SET ${sets.join(", ")} WHERE id = $1 RETURNING *`,
    values
  );
  return rows[0] ? toUser(rows[0]) : null;
}

// ---------- Workers (catalogue, read-only from the app's perspective) ----------

export async function getWorkers(): Promise<Worker[]> {
  const { rows } = await query<{ data: Worker }>(
    "SELECT data FROM workers ORDER BY id"
  );
  return rows.map((r) => r.data);
}

export async function getWorkerById(id: string): Promise<Worker | null> {
  const { rows } = await query<{ data: Worker }>(
    "SELECT data FROM workers WHERE id = $1",
    [id]
  );
  return rows[0]?.data ?? null;
}

// ---------- Bookings ----------

export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  const { rows } = await query<BookingRow>(
    "SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return rows.map(toBooking);
}

export async function findBookingByIdempotencyKey(
  key: string
): Promise<Booking | null> {
  const { rows } = await query<BookingRow>(
    "SELECT * FROM bookings WHERE idempotency_key = $1",
    [key]
  );
  return rows[0] ? toBooking(rows[0]) : null;
}

export async function createBooking(booking: Booking): Promise<Booking> {
  // ON CONFLICT on the unique idempotency key makes a retried/double-clicked
  // request return the original booking instead of creating a second one,
  // even when both requests land on different server instances.
  const inserted = await query<BookingRow>(
    `INSERT INTO bookings (
       id, idempotency_key, user_id, worker_id, category, sub_service, package,
       date, time_slot, address, notes, price_summary, status, start_otp, created_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     ON CONFLICT (idempotency_key) DO NOTHING
     RETURNING *`,
    [
      booking.id,
      booking.idempotencyKey,
      booking.userId,
      booking.workerId,
      booking.category,
      booking.subService,
      booking.package,
      booking.date,
      booking.timeSlot,
      JSON.stringify(booking.address),
      booking.notes,
      JSON.stringify(booking.priceSummary),
      booking.status,
      booking.startOtp,
      booking.createdAt,
    ]
  );
  if (inserted.rows[0]) return toBooking(inserted.rows[0]);

  const existing = await findBookingByIdempotencyKey(booking.idempotencyKey);
  if (!existing) throw new Error("Booking insert conflicted but no booking found");
  // Never hand back another user's booking, even if their key collided.
  if (existing.userId !== booking.userId) throw new Error("IDEMPOTENCY_KEY_CONFLICT");
  return existing;
}

// ---------- Contact submissions ----------

export async function saveContactSubmission(
  s: ContactSubmission
): Promise<void> {
  await query(
    `INSERT INTO contact_submissions (id, name, contact, email, city, persona_type, message, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [s.id, s.name, s.contact, s.email, s.city, s.personaType, s.message, s.createdAt]
  );
}

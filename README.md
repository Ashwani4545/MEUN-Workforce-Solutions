# MEUN — Website

India's verified domestic & facility workforce platform. A complete, deployable
Next.js 14 (App Router, TypeScript, Tailwind) site: 18 public/authenticated
routes, working auth, a booking flow with real server-side pricing, and a
contact/application pipeline — all runnable with zero external infrastructure.

## What's real vs. what's demo-grade

This was built from a spec, not from an existing MEUN codebase (none was
available). To be upfront about what you're getting:

**Genuinely functional, production-shaped:**
- Argon2id password hashing (`memoryCost: 65536, timeCost: 3, parallelism: 4`)
- JWT access tokens (15 min) + rotating refresh tokens (30 days), httpOnly + `SameSite=Strict` cookies
- CSRF protection (double-submit token) on every state-changing request
- Rate limiting on auth, contact and booking endpoints
- Zod validation shared between client forms and server routes
- Server-recalculated pricing on every booking (client total is advisory only)
- Idempotency keys on booking confirmation (safe to retry/double-click)
- Security headers (CSP, HSTS, X-Frame-Options, etc.) in `next.config.mjs`
- Honeypot spam field on contact/join forms
- Full accessibility basics: skip link, visible focus states, labeled fields, `prefers-reduced-motion` support

**Swapped for something that runs standalone, clearly marked in code:**
- **Database** — `lib/db.ts` uses local JSON files under `/data` instead of
  Postgres. Every function is written the way a Drizzle repository function
  would be (async, single-purpose) specifically so swapping the body for real
  queries doesn't touch anything else.
- **Refresh token store** — `lib/refreshStore.ts` is in-memory instead of
  Redis, same interface either way.
- **Rate limiting** — in-process instead of at a Kong gateway. Fine for one
  instance; move to the gateway before scaling horizontally.
- **Worker photos** — generated initials avatars (ui-avatars.com), not real
  photography. Swap `photoUrl` in `data/workers.json` / your real worker
  records once you have licensed photos.
- **Email delivery** — contact submissions are saved to
  `data/contact-submissions.json` always, and additionally emailed via Resend
  if `RESEND_API_KEY` is set.

**Not included (needs your infra to actually exist):**
- No live Postgres/Redis/Kong — this sandbox couldn't run or test them
- No payment gateway integration (pricing is calculated and shown, but
  nothing charges a card — wire in Razorpay/Stripe when ready)
- No SMS/OTP delivery — the "start OTP" is generated and shown in-app, not
  sent to the worker's phone

None of this is hidden inside working code that quietly does less than it
looks like — every shortcut above is called out in a comment at the point
it's taken.

## Getting started

```bash
npm install
cp .env.example .env.local
# generate real secrets:
openssl rand -base64 48   # → JWT_ACCESS_SECRET
openssl rand -base64 48   # → JWT_REFRESH_SECRET
npm run dev
```

Visit `http://localhost:3000`. Sample worker data is already seeded in
`data/workers.json` (regenerate anytime with `npm run seed`).

## Deploying

This is a standard Next.js app — deploy to Render, Railway, or any
Node 18+ host:

```bash
npm run build
npm start
```

Before going live:
1. Set real `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` env vars (the app
   refuses to boot without them in production).
2. Point `lib/db.ts` at real Postgres and `lib/refreshStore.ts` at real
   Redis once that infrastructure exists — the function signatures won't
   need to change anywhere else.
3. Replace `data/workers.json` with real, verified worker records.
4. Add a payment gateway before accepting real bookings.
5. `argon2` is a native module — confirm your target platform supports it
   before relying on it; `bcryptjs` is a drop-in pure-JS fallback if not.

## Project structure

```
app/                  Routes (App Router) + API route handlers
components/
  layout/             Navbar, Footer, mobile drawer
  home/                Homepage sections incl. 3D hero
  workers/             Listing card + filters
  booking/             Multi-step booking wizard
  forms/               Auth/contact/join forms
  ui/                  Button, form fields, badges
  providers/           Client-side auth context
lib/                  Data layer, auth, validation, pricing, rate limiting
types/                Shared domain types (mirrors intended DB schema)
data/                 JSON data store (workers.json is seed data; the rest
                       are created at runtime and gitignored)
```

## Design system

Redesigned to match a clean, black-and-white product-brand style: solid
black CTAs, full-bleed photo-tile category grid with a carousel, and a
banner-style rotating hero — no accent color, pure monochrome.

- **Type:** Plus Jakarta Sans throughout (headings and body), extra-bold headlines
- **Color:** white (`#FFFFFF`) surfaces, near-black ink (`#181819`) text and
  buttons, muted gray for secondary text — no accent color anywhere
- Full token list in `tailwind.config.ts`; shared card styling lives in the
  `.card-surface` utility in `app/globals.css`

### About the homepage photography

Three categories now show **real, relevant, freely-licensed photos** from
Pexels (free for commercial use, no attribution required): **Cooks**,
**Electricians**, and **Plumbers** — used in the hero banner, the category
grid, and the verification-insights section. These were found and verified
one at a time via search; Pexels/Unsplash have no reliable way to fetch a
keyword-matched photo on demand in this environment, so this is a hand-
picked set, not a generated one.

Every other category tile (Maids, Drivers, Babysitters, Elder Care,
Security, AC Repair, Carpenters) falls back to
[Picsum Photos](https://picsum.photos) via `lib/stockPhoto.ts` — real,
freely-licensed photography, but **generic and not subject-matched** (Picsum
has no keyword search). The bundle-promo photo is also a Picsum fallback.

**To finish the rest:** search Pexels or Unsplash yourself for each
remaining category, copy the direct `images.pexels.com/...` or
`images.unsplash.com/...` URL, and either add it to the `REAL_PHOTOS` map in
`components/home/ServiceCategories.tsx` or swap it directly into
`components/home/BundlePromo.tsx`. No code structure changes needed — just
the URL.

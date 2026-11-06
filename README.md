# MEUN — Workforce Solutions

<p align="center">
  <strong>Meet Everything U Need</strong><br/>
  A smarter way to discover, connect with, and book domestic and professional service providers.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js 14"/>
  <img src="https://img.shields.io/badge/TypeScript-Enabled-3178C6?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-Styling-06B6D4?logo=tailwindcss" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Status-Development-orange" alt="Development"/>
</p>

---

## 1. Overview

**MEUN (Meet Everything U Need)** is a web-based workforce and service marketplace designed to connect households and businesses with domestic workers and professional service providers.

The platform aims to simplify the process of discovering, evaluating, and booking service professionals through a unified digital experience.

MEUN focuses on three core principles:

- **Trust:** Build confidence through structured worker profiles and verification-oriented workflows.
- **Convenience:** Make service discovery, pricing, and booking easier.
- **Accessibility:** Create a straightforward experience for customers, workers, and businesses.

The application is built using Next.js 14, TypeScript, and Tailwind CSS, with server-side API routes and a standalone local data layer.

## 2. Key Features

### Customer Experience

- Responsive homepage with service discovery.
- Service category browsing.
- Worker listing and profile presentation.
- Search and filtering interface.
- Multi-step booking experience.
- Server-side booking price calculation.
- Authentication and session management.
- Contact and service enquiry forms.

### Workforce Categories

The platform is designed around domestic and professional service requirements, including:

| Category | Services |
|---|---|
| Household Services | Maids, cooks, drivers, babysitters |
| Care Services | Elder care and childcare |
| Maintenance | Electricians, plumbers, AC repair |
| Home Services | Cleaning, carpentry, housekeeping |
| Other Services | Security and related workforce requirements |

The available categories and worker records are maintained through the project's data layer.

### Worker and Partner Experience

- Worker application and joining form.
- Structured worker information.
- Sample worker records for development.
- Application submission workflow.
- Worker-oriented authentication foundation.

### Booking System

The booking experience follows a multi-step process:

1. Select a service.
2. Explore available workers.
3. Review worker information.
4. Select booking requirements.
5. Calculate the booking price on the server.
6. Confirm the booking through an idempotent confirmation flow.

**Important:** Pricing is calculated server-side. Client-submitted totals are treated as advisory rather than trusted values.

### Contact and Application Pipeline

- Contact form submission.
- Worker application submission.
- Honeypot-based spam protection.
- Server-side input validation.
- Local persistence of contact submissions.
- Optional email notification through Resend.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | Full-stack React framework |
| App Router | Application routing |
| TypeScript | Type safety |
| React | Component-based UI |
| Tailwind CSS | Responsive styling |
| Zod | Input and schema validation |
| Argon2id | Password hashing |
| JWT | Access and refresh authentication |
| JSON data files | Standalone local persistence |
| Resend | Optional email delivery |
| Node.js | Application runtime |

## 4. Architecture

MEUN follows a modular Next.js application structure.

```text
                    MEUN PLATFORM
                          |
             +------------+------------+
             |                         |
        Frontend UI                API Layer
             |                         |
     +-------+-------+          +------+------+
     |       |       |          |      |      |
   Home   Workers  Booking    Auth  Contact  Join
     |       |       |          |      |      |
     +-------+-------+----------+------+------+
                          |
                     Business Logic
                          |
             +------------+------------+
             |            |            |
          Auth       Validation     Pricing
             |            |            |
             +------------+------------+
                          |
                       Data Layer
                          |
                    Local JSON Files
```

### Architectural Components

**Frontend:** Provides the customer-facing interface, reusable components, forms, service listings, and booking workflow.

**API Layer:** Handles server-side operations such as authentication, contact submissions, worker applications, and booking actions.

**Business Logic:** Contains reusable authentication, validation, pricing, and rate-limiting functionality.

**Data Layer:** Provides asynchronous repository-style functions for reading and writing application data.

## 5. Security Implementation

Security is incorporated into the application through multiple layers.

| Security Feature | Implementation |
|---|---|
| Password protection | Argon2id hashing |
| Access authentication | Short-lived JWT access tokens |
| Refresh authentication | Rotating refresh tokens |
| Cookie security | HttpOnly and SameSite=Strict |
| CSRF protection | Double-submit token |
| Input validation | Shared Zod schemas |
| Rate limiting | Authentication, contact, and booking endpoints |
| Booking integrity | Server-side price recalculation |
| Duplicate submissions | Idempotency keys |
| Spam protection | Honeypot fields |
| Browser security | CSP and additional security headers |
| Accessibility | Visible focus states and reduced-motion support |

### Authentication Configuration

- Access token lifetime: 15 minutes.
- Refresh token lifetime: 30 days.
- Password hashing: Argon2id.
- Cookie configuration: HttpOnly and SameSite=Strict.

**Security deployment note:** Some infrastructure components currently use local or in-process implementations. These are suitable for a standalone development setup but must be replaced or upgraded before operating a horizontally scaled production service.

## 6. Local Development Setup

### Prerequisites

Install the following:

- Node.js compatible with the project's Next.js dependencies.
- npm.
- Git.

### Clone the Repository

```bash
git clone https://github.com/Ashwani4545/MEUN-Workforce-Solutions.git

cd MEUN-Workforce-Solutions
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create the local environment file:

```bash
cp .env.example .env.local
```

Generate secure authentication secrets:

```bash
openssl rand -base64 48
openssl rand -base64 48
```

Configure the generated values in `.env.local`:

```env
JWT_ACCESS_SECRET=your_generated_access_secret
JWT_REFRESH_SECRET=your_generated_refresh_secret

RESEND_API_KEY=your_resend_api_key
```

The Resend API key is optional for local contact submission persistence, but required for the optional email delivery functionality.

Use the actual variable names from `.env.example` as the authoritative configuration reference.

### Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Seed Sample Data

```bash
npm run seed
```

Sample worker records are provided through `data/workers.json`.

## 7. Project Structure

```text
MEUN-Workforce-Solutions/
│
├── app/
│   ├── API route handlers
│   ├── Public pages
│   └── Authenticated pages
│
├── components/
│   ├── layout/
│   │   ├── Navbar
│   │   ├── Footer
│   │   └── Mobile navigation
│   │
│   ├── home/
│   │   ├── Homepage sections
│   │   └── 3D hero
│   │
│   ├── workers/
│   │   ├── Worker listings
│   │   └── Filters
│   │
│   ├── booking/
│   │   └── Booking wizard
│   │
│   ├── forms/
│   │   ├── Authentication
│   │   ├── Contact
│   │   └── Worker applications
│   │
│   ├── ui/
│   │   └── Reusable UI components
│   │
│   └── providers/
│       └── Authentication context
│
├── lib/
│   ├── db.ts
│   ├── refreshStore.ts
│   ├── Authentication utilities
│   ├── Validation
│   ├── Pricing
│   └── Rate limiting
│
├── types/
│   └── Shared application types
│
├── data/
│   └── workers.json
│
├── public/
│   └── Static assets
│
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── package.json
└── README.md
```

Runtime JSON files other than the supplied worker seed data are created as needed and are intended to be excluded from Git.

## 8. Current Implementation and Infrastructure Status

MEUN is structured as a standalone application, with several infrastructure services represented by local implementations.

| Component | Current Implementation | Production Upgrade |
|---|---|---|
| Database | Local JSON files | PostgreSQL |
| Refresh token storage | In-memory store | Redis |
| Rate limiting | In-process | Shared distributed rate limiter or API gateway |
| Worker images | Generated initials avatars | Licensed worker photography |
| Contact persistence | Local JSON storage | Persistent database |
| Email delivery | Optional Resend integration | Production email configuration |
| Payments | Not integrated | Razorpay or Stripe |
| SMS/OTP | In-app demonstration flow | SMS/OTP provider integration |

### Important Limitations

The following capabilities should not be considered production-ready integrations:

- No live PostgreSQL database.
- No Redis-backed refresh token store.
- No distributed rate-limiting infrastructure.
- No integrated payment collection.
- No actual SMS-based OTP delivery.
- Sample worker records are not proof of real-world worker verification.
- Some category photography uses generic fallback images.

These limitations are documented so that the current implementation is not mistaken for a fully integrated production marketplace.

## 9. Design System

MEUN follows a clean, minimal, monochromatic visual direction.

### Visual Identity

- Primary surfaces: White (`#FFFFFF`).
- Primary text and buttons: Near-black (`#181819`).
- Secondary text: Muted gray.
- Typography: Plus Jakarta Sans.
- Layout: Responsive, structured, and typography-driven.

### Design Principles

- Minimal and professional interface.
- Clear visual hierarchy.
- Responsive service category layouts.
- Consistent cards and form elements.
- Accessible navigation and interaction states.
- Reduced-motion support.

### Homepage Photography

The current homepage uses a combination of hand-picked Pexels photography and generic Picsum fallback images.

Real category-specific photos currently include:

- Cooks
- Electricians
- Plumbers

Other categories may use generic fallback photography and should be updated with relevant, properly licensed images before launch.

## 10. Production Deployment

MEUN is a standard Next.js application and can be deployed to a compatible Node.js hosting platform.

### Build the Application

```bash
npm run build
```

### Start the Production Server

```bash
npm start
```

Potential hosting platforms include:

- Vercel
- Render
- Railway
- Other compatible Node.js hosting providers

### Pre-Deployment Checklist

- [ ] Configure production environment variables.
- [ ] Generate strong, unique JWT secrets.
- [ ] Configure HTTPS and domain settings.
- [ ] Replace local JSON persistence with PostgreSQL.
- [ ] Replace in-memory refresh token storage with Redis.
- [ ] Upgrade rate limiting for multi-instance deployment.
- [ ] Configure production email delivery.
- [ ] Integrate a payment gateway before accepting paid bookings.
- [ ] Integrate an actual SMS/OTP provider.
- [ ] Replace sample worker records with authorized, verified records.
- [ ] Review privacy and data protection requirements.
- [ ] Test authentication, booking, and contact workflows.
- [ ] Run production build and deployment checks.

## 11. Roadmap

The following items represent potential future development, not claims that these capabilities are already implemented.

### Platform Expansion

- [ ] PostgreSQL integration.
- [ ] Redis-backed session and refresh token management.
- [ ] Real OTP authentication.
- [ ] Razorpay payment integration.
- [ ] Customer dashboard.
- [ ] Worker dashboard.
- [ ] Administrative management panel.
- [ ] Worker KYC and verification workflow.
- [ ] Booking lifecycle management.
- [ ] Real-time booking notifications.
- [ ] Live worker location tracking.
- [ ] Ratings and reviews.
- [ ] Corporate workforce management.
- [ ] Hindi language support.
- [ ] PWA support.
- [ ] AI-powered worker matching.

### Long-Term Vision

Build a reliable digital ecosystem that makes domestic and professional workforce discovery, hiring, and service management more accessible for Indian households and businesses.

## 12. Contributing

Contributions, suggestions, and issue reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Commit your changes with a meaningful message.
5. Open a pull request describing the changes.

## 13. License

No license information is specified here. Refer to the repository's actual license file before reusing, modifying, or distributing this project.

---

<p align="center">
  <strong>MEUN — Meet Everything U Need</strong><br/>
  Connecting people, services, and opportunities.
</p>

# Vena Scheduler

A Calendly-style scheduling module implemented as an isolated Next.js + Supabase feature. Owners can manage availability windows and share booking links; guests can book in real time with conflict prevention handled in Postgres.

## Folder layout

```
scheduler/
  app/                       # Next.js app router (public + owner pages, API routes)
  components/                # Reusable UI components (slot list, forms, editors)
  hooks/                     # Client hooks (Supabase realtime subscriptions)
  lib/                       # Server helpers (env, Supabase, availability logic)
  scripts/                   # Tooling and seeding helpers
  styles/                    # Global Tailwind styles
  supabase/                  # SQL migrations and seed helpers
  types/                     # Shared TypeScript models
  utils/                     # Misc utilities (time helpers, slug generation)
```

## Prerequisites

- Node.js 18+
- Supabase project (or equivalent Postgres instance with pgcrypto + btree_gist)
- Supabase CLI (`npm install -g supabase`) for running migrations locally

## Environment variables

Create `scheduler/.env.local` (or export in your shell) with:

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<public-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_DB_PASSWORD=<database-password-for-cli>
SCHEDULER_DEMO_OWNER_EMAIL=demo@vena.local
SCHEDULER_DEMO_OWNER_PASSWORD=demo-password
```

For local Next.js dev the first three variables are required. The demo owner credentials are only used by the seed script.

## Install & run

```
cd scheduler
npm install
npm run dev
```

Visit `http://localhost:3000/s/<slug>` for the public booking page or `http://localhost:3000/s/<slug>/edit?token=<edit_token>` for the owner editor once data exists.

## Database setup

Apply the scheduler schema to your Supabase instance:

```
cd scheduler
supabase db remote set <supabase-db-connection-string>
supabase db push --file supabase/migrations/0001_scheduler.sql
```

The migration creates:

- `schedules`, `availability_windows`, `bookings` tables + `booking_status` enum
- RLS policies restricting CRUD to schedule owners and exposing only limited metadata publicly
- `public_bookings` view for realtime slot updates with PII removed
- `attempt_booking` Postgres function that validates windows, enforces slot alignment, and uses advisory locks to prevent double booking

## Seeding demo data

With environment variables set, run:

```
cd scheduler
npm run seed
```

This script creates/updates a demo user, schedule, and a few availability windows, logging the public and edit URLs.

## API surface

The Next.js route handlers under `app/api/scheduler/[slug]/` expose:

- `GET /availability?from&to` – compute free slots combining availability windows with existing bookings
- `POST /book` – call `attempt_booking` and return success or `SLOT_TAKEN`
- `GET/POST /settings` – owner-only access (auth cookie or `token` query) to read/update title + timezone
- `GET/POST /windows` – manage weekly availability windows with server-side validation
- `POST /rotate-token` – regenerate the opaque edit token

All endpoints use Zod validation and Supabase service-role calls; owner access is guarded by authenticated user ID or matching `edit_token`.

## Frontend behaviour

- Public page (`/s/:slug`) fetches 21 days of availability, displays slots in the schedule timezone, and calls the booking API.
- Realtime updates: the page subscribes to the `public_bookings` channel so slots disappear within seconds after any booking.
- Owner editor (`/s/:slug/edit?token=...`) lets owners tweak title, timezone, and weekly windows, rotate edit tokens, and copy shareable links.

## Deployment notes

- Deploy the Next.js app with any platform that supports environment variables and Edge/server functions (Vercel, Netlify, Fly).
- Configure runtime env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). The service role is only used server-side; never expose it to the browser outside API routes.
- Run the SQL migration against production before deploying frontend code to ensure the `attempt_booking` function and RLS policies exist.

## Testing checklist

- Run `npm run dev` and visit the public page to ensure slots render.
- Using two browser windows, book the same slot concurrently; one should succeed while the other receives `SLOT_TAKEN`.
- Watch the second window update in real time (slot disappears without refresh).
- Open the edit link, adjust availability, and confirm the public page reflects changes immediately upon save.
- Rotate the edit token and confirm the previous URL no longer loads, while the new token works.

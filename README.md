# ဗောဓိလမ်း · Bodhi Path (MVP)

Responsive gamified Dhamma learning web app — Vipassana modules, meditation timer, smart beads, merit-driven Bodhi Tree, streaks, badges, and worship plans.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Supabase-ready (Auth, Postgres, RLS) — migration in `supabase/migrations/001_init.sql`
- Local **demo mode** (browser `localStorage`) when Supabase env vars are not set
- Capacitor iOS shell for App Store (loads the hosted web app)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up with any email/password to explore the MVP.

## Project layout

```
src/
  app/                 # Next.js routes + globals.css
  components/
    shell/             # App chrome: nav, auth gate, native runtime
    practice/          # Meditation, beads, Dhamma audio card
    brand/             # Bodhi tree / scene art
    ui/                # Shared UI primitives + icons
  lib/
    store/             # App state provider + persistence
    content/           # Modules, lessons, quotes, badges, quiz data
    gamification/      # Merit rules + view-model helpers
    native/            # Capacitor platform + local notifications
    dictionary/        # Abhidhamma search + MuPDF pages
    supabase/          # Auth clients
    prayers.ts         # Prayer catalog helpers
    notifications.ts   # In-app reminder builders
    types.ts           # Shared domain types
  data/                # Bundled prayer JSON (src/data)
data/                  # On-disk dictionary DB / PDF caches (gitignored blobs)
ios/                   # Capacitor Xcode project
capacitor-www/         # Capacitor webDir stub (remote server.url is used)
```

## Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` → `.env.local` and fill in URL + anon key
3. Run `supabase/migrations/001_init.sql` in the SQL editor
4. Restart `npm run dev` — middleware will use Supabase sessions

> Demo mode still powers the UI gamification store until you wire page mutations to Supabase tables.

## Dictionary data

See [data/README.md](data/README.md). Keep `tipitaka-abidan.db` locally; it is gitignored because of size.

## Merit rules (MVP)

- Lesson complete: +10
- Meditation ≥ 5 min: +15
- Beads ≥ 108: +5
- Quiz with score &gt; 0: +8
- Tree stages at 0 / 50 / 150 / 400 / 1000 merit

## iOS (Capacitor → App Store)

1. Deploy web: `npm run deploy:web` (https://bodhi-path.vercel.app)
2. Sync native: `npm run cap:sync`
3. Open Xcode: `npm run ios`
4. Follow [ios/APP_STORE_CHECKLIST.md](ios/APP_STORE_CHECKLIST.md)

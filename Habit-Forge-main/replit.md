# HabitForge

A full-stack gamified habit tracker — track daily habits, earn XP, level up, unlock badges, and view rich analytics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → `lib/api-client-react`, `lib/api-zod`)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite, Wouter router, TanStack Query, Recharts, Framer Motion
- Auth: JWT stored in `localStorage` under `habitforge_token`

## Where things live

- `artifacts/api-server/src/` — Express API (routes, middleware, gamification logic)
- `artifacts/api-server/src/routes/` — auth, habits, user, analytics route modules
- `artifacts/api-server/src/lib/gamification.ts` — XP/streak/level/badge logic
- `artifacts/habitforge/src/` — React frontend
- `artifacts/habitforge/src/pages/` — Dashboard, Habits, Analytics, Profile, Login, Register
- `artifacts/habitforge/src/components/` — HabitCard, XPBar, BadgeGrid, HeatmapChart, ConsistencyChart, PremiumGate, Layout
- `lib/db/src/schema/` — Drizzle ORM table definitions (users, habits, logs)
- `lib/api-spec/` — OpenAPI spec (source of truth for all API contracts)
- `lib/api-client-react/src/generated/` — auto-generated React Query hooks
- `lib/api-zod/src/generated/` — auto-generated Zod validation schemas

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks + Zod schemas. Never write fetch calls by hand.
- Gamification is server-side only: XP, level, streak, badges computed in `gamification.ts` on every habit completion.
- JWT auth: token stored in localStorage, injected via `setAuthTokenGetter` at app startup in `main.tsx`.
- Premium gating: `is_premium` flag on user row; analytics routes and frontend `PremiumGate` component enforce it.
- Express 5 wildcard routes use `/{*splat}` syntax (not `*`).

## Product

- **Dashboard**: today's habits with one-click check-off, XP progress bar, live streak counters
- **Habits**: create/edit/delete habits with emoji icon, color, and frequency
- **Analytics** (premium): contribution heatmap (GitHub-style) + weekly consistency bar chart
- **Profile**: level, XP, badge showcase, premium status

## Demo account

- Email: `demo@habitforge.app`
- Password: `demo123`
- Pre-loaded with 4 habits and 90 days of history (Level 9, 3,654 XP, 3 badges)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm run typecheck:libs` before `pnpm --filter @workspace/api-server run typecheck` — the DB lib must be built first for API server imports to resolve.
- After schema changes: `pnpm --filter @workspace/db run push` then `pnpm run typecheck:libs`.
- After OpenAPI spec changes: `pnpm --filter @workspace/api-spec run codegen` regenerates hooks/schemas.
- The seed script lives at `artifacts/api-server/src/seed.ts` — run via executeSql (code_execution) since tsx can't resolve workspace packages at the monorepo root.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

# HabitForge

HabitForge is a full-stack, gamified habit-tracking application designed to make consistency easier to build and maintain. Create daily or weekly habits, record completions, grow your streaks, earn XP, unlock achievements, and review your progress through a focused dashboard.

## Features

- **Habit management** — create, edit, and delete habits with custom names, emoji icons, colors, and daily or weekly frequency.
- **Daily dashboard** — view today's habits, mark completed activities, and track your progress.
- **Gamification** — earn experience points (XP), level up, maintain streaks, and unlock achievement badges.
- **Progress analytics** — view consistency charts and a contribution-style activity heatmap. Advanced analytics are premium-gated.
- **Calendar and profile** — review activity and view account progress, XP, levels, and badges.
- **Focus mode** — use a Pomodoro-style timer with focus, short-break, and long-break sessions.
- **Challenges** — explore habit-building challenges.
- **Habit coach** — use the in-app guided coach for habit-related prompts and motivation.
- **Authentication and premium access** — Clerk-powered authentication and premium feature gating.

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| UI and styling | Tailwind CSS, Radix UI, Framer Motion, Lucide React |
| Routing and data | Wouter, TanStack Query |
| Charts | Recharts |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL, Drizzle ORM |
| Authentication | Clerk |
| Validation and API contracts | Zod, OpenAPI, Orval-generated client and schemas |
| Package management | pnpm workspaces |

## Project Structure

```text
.
├── artifacts/
│   ├── api-server/          # Express API, middleware, routes and gamification logic
│   └── habitforge/          # React + Vite frontend
├── lib/
│   ├── api-client-react/    # Generated React Query API hooks
│   ├── api-spec/            # OpenAPI contract
│   ├── api-zod/             # Generated Zod schemas
│   └── db/                  # Drizzle schema and database connection
├── scripts/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Getting Started

### Requirements

- Node.js 24
- pnpm
- PostgreSQL
- Clerk application credentials

### Installation

Clone the repository and install the workspace dependencies:

```bash
git clone https://github.com/abhishekgadaginamath-cloud/Habit-Forge.git
cd Habit-Forge
pnpm install
```

### Environment Variables

Configure the following variables in your development environment. Keep secret values out of source control.

| Variable | Used by | Purpose |
|---|---|---|
| `DATABASE_URL` | API / database | PostgreSQL connection string |
| `PORT` | API and frontend | Port for the relevant development process |
| `VITE_CLERK_PUBLISHABLE_KEY` | Frontend | Clerk publishable key |
| `CLERK_PUBLISHABLE_KEY` | API | Clerk publishable key |
| `CLERK_SECRET_KEY` | API | Clerk secret key, where required |
| `VITE_CLERK_PROXY_URL` | Frontend | Optional Clerk proxy URL |

The frontend Vite configuration also requires `BASE_PATH` (use `/` for a root deployment). The API server and frontend run as separate processes. In the provided Replit workspace, the configured workflow starts both services and provisions the PostgreSQL environment.

### Database

After setting `DATABASE_URL`, apply the Drizzle schema to your development database:

```bash
pnpm --filter @workspace/db run push
```

### Run the Application

Start the API server:

```bash
PORT=8080 pnpm --filter @workspace/api-server run dev
```

In a second terminal, start the frontend:

```bash
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/habitforge run dev
```

The Vite development server proxies `/api` requests to the API server at `http://localhost:8080`.

### Build and Type-check

```bash
pnpm run typecheck
pnpm run build
```

## API Overview

The Express API exposes routes under `/api`. The route modules cover health checks, user/profile data, habit operations, and analytics. Habit completion is processed server-side, where streaks, XP, levels, and badge unlocks are calculated.

## Notes

- Advanced analytics endpoints require a premium account.
- Authentication and database credentials must be configured before running the full application locally.
- Generated API hooks and validation schemas are maintained from the OpenAPI specification in the workspace.

## Author

**Abhishek S Gadaginamath**

- GitHub: [abhishekgadaginamath-cloud](https://github.com/abhishekgadaginamath-cloud)
- LinkedIn: [Abhishek Gadaginamath](https://www.linkedin.com/in/abhishek-gadaginamath-4283171b4/)

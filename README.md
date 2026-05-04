# Orby

AI-powered enterprise automation SaaS platform. Monorepo managed with **pnpm workspaces** + **Turborepo**.

## Stack

| Layer    | Technology                                            |
| -------- | ----------------------------------------------------- |
| Frontend | Next.js 15 (App Router) + Tailwind CSS v4 + shadcn/ui |
| Backend  | NestJS 10 with SWC compiler                           |
| Database | PostgreSQL 16 via Prisma ORM                          |
| Cache    | Redis 7                                               |
| Build    | Turborepo + pnpm workspaces                           |
| CI/CD    | GitHub Actions                                        |

## Structure

orby/
├── apps/
│ ├── web/ → Next.js 15 (port 3000)
│ └── api/ → NestJS (port 4000)
├── packages/
│ ├── types/ → @orby/types — shared interfaces
│ ├── ui/ → @orby/ui — base React components
│ └── config/ → @orby/config — tsconfig + eslint base
├── turbo.json
├── pnpm-workspace.yaml
└── docker-compose.yml

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10 (`npm install -g pnpm`)
- **Docker** + **Docker Compose** (for local database)

## Installation

```bash
# 1. Clone the repo
git clone <url> orby && cd orby

# 2. Copy environment variables
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 3. Install dependencies (generates Prisma client automatically)
pnpm install
```

## Development

```bash
# Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# Run database migrations (first time only)
pnpm --filter @orby/api db:migrate

# Start all services in parallel
pnpm dev
```

Services will be available at:

- **Web**: http://localhost:3000
- **API**: http://localhost:4000/api/v1

## Build

```bash
pnpm build
```

## Tests

```bash
pnpm test
```

## Lint

```bash
pnpm lint
```

## Docker (local development)

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop and remove volumes (⚠️ deletes all data)
docker compose down -v
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. **Critical** variables to get started:

| Variable              | Description                        |
| --------------------- | ---------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string       |
| `JWT_SECRET`          | JWT signing secret (min. 32 chars) |
| `ANTHROPIC_API_KEY`   | Claude API key                     |
| `STRIPE_SECRET_KEY`   | Stripe secret key                  |
| `NEXT_PUBLIC_API_URL` | API URL (consumed by the frontend) |

## Turborepo Remote Cache

To enable Turbo remote cache:

```bash
npx turbo login
npx turbo link
```

Or set `TURBO_TOKEN` and `TURBO_TEAM` in your GitHub Actions secrets.
# Orby

Plataforma SaaS de automatización empresarial con IA. Monorepo gestionado con **pnpm workspaces** + **Turborepo**.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 (App Router) + Tailwind CSS v4 + shadcn/ui |
| Backend | NestJS 10 con SWC compiler |
| Base de datos | PostgreSQL 16 vía Prisma ORM |
| Caché | Redis 7 |
| Build | Turborepo + pnpm workspaces |
| CI/CD | GitHub Actions |

## Estructura

```
orby/
├── apps/
│   ├── web/          → Next.js 15 (puerto 3000)
│   └── api/          → NestJS (puerto 4000)
├── packages/
│   ├── types/        → @orby/types — interfaces compartidas
│   ├── ui/           → @orby/ui — componentes React base
│   └── config/       → @orby/config — tsconfig + eslint base
├── turbo.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10 (`npm install -g pnpm`)
- **Docker** + **Docker Compose** (para la base de datos local)

## Instalación

```bash
# 1. Clonar el repo
git clone <url> orby && cd orby

# 2. Copiar variables de entorno
cp .env.example .env                  # edita con tus valores reales
cp .env.example apps/api/.env         # la API carga .env desde su directorio

# 3. Instalar dependencias (genera Prisma client automáticamente)
pnpm install
```

## Desarrollo

```bash
# Levantar infraestructura (PostgreSQL + Redis)
docker compose up -d

# Ejecutar migraciones de base de datos (primera vez)
pnpm --filter @orby/api db:migrate

# Arrancar todos los servicios en paralelo
pnpm dev
```

Los servicios estarán disponibles en:
- **Web**: http://localhost:3000
- **API**: http://localhost:4000/api/v1

## Build

```bash
# Build de todos los paquetes/apps (Turbo gestiona el orden)
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

## Docker (desarrollo local)

```bash
# Iniciar servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Parar servicios
docker compose down

# Parar y eliminar volúmenes (¡borra los datos!)
docker compose down -v
```

## Variables de entorno

Copia `.env.example` a `.env` y rellena los valores. Las variables **críticas** para arrancar:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `JWT_SECRET` | Secreto para firmar JWT (mín. 32 chars) |
| `ANTHROPIC_API_KEY` | API key de Claude |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `NEXT_PUBLIC_API_URL` | URL de la API (consumida por el frontend) |

## Turborepo Remote Cache

Para activar la caché remota de Turbo:

```bash
npx turbo login
npx turbo link
```

O configura `TURBO_TOKEN` y `TURBO_TEAM` en los secrets de GitHub Actions.

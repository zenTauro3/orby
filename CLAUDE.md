# Orby — Contexto del Proyecto

## Qué es Orby
SaaS de automatización con IA para PYMEs y autónomos españoles y latinoamericanos.
Un agente inteligente que gestiona las tareas repetitivas del negocio: responde emails,
gestiona WhatsApp, genera facturas, hace seguimiento de impagos y gestiona la agenda.
El dueño del negocio configura el agente una vez y trabaja en piloto automático.

## Stack técnico
- Monorepo: Turborepo + pnpm workspaces
- Frontend: Next.js 15 (App Router, TypeScript, Tailwind v4, shadcn/ui)
- Backend: NestJS (SWC compiler, TypeScript estricto)
- ORM: Prisma con PostgreSQL 16
- Caché y colas: Redis 7 + Bull (procesamiento async de emails y tareas)
- Auth: NextAuth v5 (frontend) + JWT con refresh tokens (backend)
- Pagos: Stripe (suscripciones mensuales)
- IA: Claude API (claude-sonnet-4-6) con function calling y tool use
- Deploy: VPS Hetzner + Docker + Nginx + GitHub Actions CI/CD
- Control de versiones: GitHub con protección de rama main

## Estructura del monorepo
negociobot/ (nombre interno, marca: Orby)
├── apps/
│   ├── web/          → Next.js 15 — dashboard del cliente
│   └── api/          → NestJS — servidor, agentes, lógica de negocio
├── packages/
│   ├── types/        → interfaces TypeScript compartidas (@orby/types)
│   ├── ui/           → componentes React base (@orby/ui)
│   └── config/       → tsconfig + eslint compartidos (@orby/config)
├── CLAUDE.md         → este archivo
└── docker-compose.yml → PostgreSQL + Redis local

## Módulos del backend (apps/api/src/modules/)
- auth/           → JWT, refresh tokens, OAuth Google
- companies/      → empresas clientes, onboarding, configuración
- agents/         → orquestador central de agentes IA
- integrations/   → Gmail, WhatsApp Business, Google Calendar, Stripe
- billing/        → suscripciones, webhooks Stripe, planes
- notifications/  → alertas y resumen diario

## Modelos de datos principales (Prisma)
- User            → usuarios de la plataforma
- Company         → empresa/negocio cliente
- AgentConfig     → configuración del agente por empresa
- Conversation    → hilo de conversación (email o WhatsApp)
- Message         → mensaje individual dentro de una conversación
- Invoice         → factura generada
- Integration     → credenciales OAuth por empresa (Gmail, Calendar...)
- Subscription    → suscripción Stripe activa

## Modelo de negocio
- Plan Starter:  29€/mes — 1 agente, hasta 200 emails/mes, facturación básica
- Plan Growth:   79€/mes — 3 agentes, emails ilimitados, WhatsApp, agenda
- Plan Pro:      149€/mes — agentes ilimitados, API acceso, soporte prioritario
- Trial:         14 días gratis sin tarjeta

## Flujo principal del agente de email
1. Gmail webhook notifica nuevo email → NestJS lo recibe
2. Bull encola el email en Redis
3. Worker procesa: Claude API clasifica (consulta/pedido/queja/spam)
4. Claude genera respuesta según personalidad configurada por la empresa
5. NestJS envía respuesta vía Gmail API
6. Conversación guardada en PostgreSQL con Prisma
7. Si es un pedido confirmado → agente de facturación genera Invoice

## Variables de entorno necesarias
DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_REFRESH_SECRET,
ANTHROPIC_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXTAUTH_SECRET,
NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL

## Convenciones de código
- Nombres de ramas: feature/xxx, fix/xxx, chore/xxx
- Commits: Conventional Commits (feat:, fix:, chore:, docs:)
- Un módulo NestJS por dominio de negocio
- Servicios inyectables, nunca lógica en controladores
- DTOs con class-validator para toda entrada de datos
- Respuestas siempre tipadas con interfaces de @orby/types
- Tests unitarios para servicios, e2e para endpoints críticos

## Estado actual del proyecto
[X] Monorepo setup — Turborepo + pnpm + estructura de carpetas
[X] Docker local — PostgreSQL + Redis funcionando
[X] GitHub — repo creado con protección de main
[X] CI/CD — GitHub Actions con lint/build/test
[ ] Backend auth — JWT + refresh tokens + OAuth Google
[ ] Frontend auth — NextAuth v5 + páginas login/register
[ ] Onboarding — flujo de alta de empresa + configuración agente
[ ] Gmail integration — OAuth + lectura de emails
[ ] Email agent — Claude API + clasificación + respuesta automática
[ ] Invoice agent — generación PDF + envío + Stripe cobro
[ ] WhatsApp agent — WhatsApp Business API + respuestas
[ ] Calendar agent — Google Calendar + gestión de citas
[ ] Billing — Stripe suscripciones + webhooks + portal cliente
[ ] Dashboard — métricas, conversaciones, facturas
[ ] Deploy — Hetzner VPS + Docker + Nginx + SSL
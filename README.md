# Highlands Frontend — Next.js 15 + React 19

Frontend del sistema de planeamiento y simulación para producción acuícola de trucha arcoíris.

## Arquitectura

```
Dashboard → Granja → Fundo → Sector → Cohorte → Mediciones
```

### Stack Tecnológico

- **Next.js 15** con App Router y Turbopack
- **React 19** con `useActionState`, `useFormStatus`, Server Actions
- **Tailwind CSS v4** (nueva API `@theme`)
- **TypeScript** estricto
- **100% Server Components** por defecto (Client solo donde es necesario)

### Patrones Next.js / React 19 utilizados

| Patrón | Uso |
|--------|-----|
| **Server Components** | Todas las páginas (fetch en servidor, 0 JS al cliente) |
| **Server Actions** | Mutaciones (crear granja, fundo, sector, cohorte, medición) |
| **`useActionState`** (React 19) | Manejo de estado en formularios con validación |
| **`useFormStatus`** (React 19) | Botones de submit con loading automático |
| **Streaming + Suspense** | `loading.tsx` en cada ruta para skeletons instantáneos |
| **`revalidateTag`** | Cache invalidation granular por entidad |
| **`generateMetadata`** | SEO dinámico por página |
| **Route Groups** | Jerarquía profunda con layouts anidados |
| **`notFound()`** | 404 automático en datos no encontrados |
| **Error Boundaries** | `error.tsx` con retry en cada nivel |

## Estructura del Proyecto

```
src/
├── app/                          # App Router
│   ├── layout.tsx               # Root layout (sidebar + fonts)
│   ├── page.tsx                 # Dashboard (SSR)
│   ├── loading.tsx              # Global skeleton
│   ├── error.tsx                # Global error boundary
│   ├── not-found.tsx            # 404
│   ├── globals.css              # Tailwind v4 + tema custom
│   └── farms/
│       ├── page.tsx             # Redirect → /
│       ├── new/page.tsx         # Crear granja (formulario)
│       └── [farmId]/
│           ├── page.tsx         # Detalle granja + fundos
│           ├── loading.tsx
│           └── fundos/[fundoId]/
│               ├── page.tsx     # Detalle fundo + sectores
│               ├── loading.tsx
│               └── sectors/[sectorId]/
│                   ├── page.tsx # Detalle sector + cohortes
│                   ├── loading.tsx
│                   └── cohorts/[cohortId]/
│                       ├── page.tsx    # Detalle cohorte (la más rica)
│                       └── loading.tsx
├── actions/
│   └── mutations.ts             # Server Actions (5 mutaciones)
├── components/
│   ├── ui/                      # Componentes reutilizables
│   │   ├── stat-card.tsx        # Tarjeta de estadística
│   │   ├── badge.tsx            # StatusBadge, StageBadge
│   │   ├── breadcrumbs.tsx      # Navegación jerárquica
│   │   ├── button.tsx           # Botón (link o action)
│   │   ├── data-card.tsx        # Card clickable para listas
│   │   ├── empty-state.tsx      # Estado vacío
│   │   ├── modal.tsx            # Dialog nativo HTML
│   │   ├── modal-trigger.tsx    # Botón + modal
│   │   ├── page-header.tsx      # Header de página
│   │   ├── pagination.tsx       # Paginación (Client)
│   │   └── weight-chart.tsx     # Gráfico SVG de peso (Client)
│   ├── forms/
│   │   ├── fields.tsx           # InputField, SelectField, TextareaField
│   │   ├── submit-button.tsx    # Con useFormStatus
│   │   ├── create-farm-form.tsx
│   │   ├── create-fundo-form.tsx
│   │   ├── create-sector-form.tsx
│   │   ├── create-cohort-form.tsx
│   │   └── create-sampling-form.tsx
│   └── layout/
│       └── sidebar.tsx          # Navegación lateral (Client)
└── lib/
    ├── api.ts                   # Cliente HTTP tipado con cache tags
    ├── types.ts                 # Tipos TypeScript (match con backend)
    └── utils.ts                 # Formatters, helpers
```

## Requisitos

- **Node.js** 18.17+
- **Backend** corriendo en `http://localhost:3000` (ver repo backend)

## Instalación

```bash
# Clonar e instalar
cd highlands-front
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
```

## Variables de Entorno

```env
# URL del backend NestJS
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# ID del usuario (temporal hasta implementar auth)
NEXT_PUBLIC_USER_ID=a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
```

## Ejecución

```bash
# Terminal 1: Backend (ver repo backend)
docker compose up -d
npm run start:dev

# Terminal 2: Frontend
npm run dev
```

Abrir **http://localhost:3001** (Next.js) — el backend corre en `:3000`.

> Si el puerto 3001 está ocupado, Next.js elegirá el siguiente disponible.

## Flujo de Datos

```
┌─────────────┐    Server Components    ┌─────────────┐
│  Next.js    │ ───── fetch() + SSR ──→ │  NestJS     │
│  Frontend   │                         │  Backend    │
│  :3001      │ ←── JSON responses ──── │  :3000      │
└─────────────┘                         └─────────────┘
       │                                       │
       │ Server Actions                        │
       │ (POST → revalidateTag)                │
       │                                       ▼
       │                                ┌─────────────┐
       │                                │ PostgreSQL  │
       │                                │  :5432      │
       └────────────────────────────────┘─────────────┘

                    ┌─────────────────────┐
                    │ Microservicio       │
                    │ Predicción          │
                    │ (próximamente)      │
                    └─────────────────────┘
```

### Caching Strategy

- Cada fetch usa `next: { tags: ['entity-id'] }` para cache granular
- Los Server Actions llaman `revalidateTag()` después de mutar
- El dashboard usa `dynamic = 'force-dynamic'` para datos siempre frescos
- Las páginas de detalle se cachean y revalidan al crear sub-entidades

## Server vs Client Components

| Componente | Tipo | Razón |
|-----------|------|-------|
| Páginas (page.tsx) | **Server** | Fetch de datos, sin JS al cliente |
| StatCard, DataCard | **Server** | Solo renderizado, sin estado |
| Breadcrumbs, PageHeader | **Server** | Solo props |
| Sidebar | **Client** | Toggle mobile, pathname |
| Pagination | **Client** | Router push |
| WeightChart | **Client** | SVG dinámico con useMemo |
| Formularios | **Client** | useActionState, useFormStatus |
| Modal | **Client** | Dialog showModal/close |
| SubmitButton | **Client** | useFormStatus |

## Módulo de Predicción (Futuro)

El frontend está preparado para integrar el microservicio de predicción:

- Los datos de mediciones (samplings) se almacenan con todos los datos necesarios
- El gráfico de peso ya muestra la evolución temporal
- Se puede extender fácilmente para mostrar curvas de predicción
- El banner en el dashboard anticipa la funcionalidad

## Comandos

```bash
npm run dev        # Desarrollo con Turbopack (hot-reload)
npm run build      # Build de producción
npm run start      # Servir build de producción
npm run lint       # Linting
```

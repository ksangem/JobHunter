# JobHunter — Enterprise AI Recruitment Platform (v2.0)

A production-architecture, **universal (web + iOS + Android)** AI recruitment ecosystem built from the
**Consolidated Enterprise BRD** and the **Master Development Prompt v2.0**. One React Native Web + Expo
codebase renders natively on mobile and responsively in the browser, backed by an event-driven
NestJS + Python microservices platform.

> **What runs today:** the full universal frontend runs end-to-end **in the browser with zero backend**
> via an in-app mock API layer (`EXPO_PUBLIC_USE_MOCKS=true`, the default). Flip it to `false` to point
> at the live microservices. The `auth-service` + Prisma data layer are implemented as the backend
> reference; the other 11 services are coherent, documented bootstraps/stubs.

---

## Monorepo layout

```
jobhunter/
├── apps/
│   ├── mobile/                 # Universal Expo app (web + iOS + Android)
│   │   ├── app/                # Expo Router file-based routes
│   │   │   ├── (auth)/         # login · register · verify-email · mfa
│   │   │   ├── (candidate)/    # dashboard · jobs · applications · resume-ai · profile · cv · interviews · notifications
│   │   │   ├── (recruiter)/    # pipeline(kanban) · jds · voice-ai · email · interviews · analytics · market-intel
│   │   │   └── (admin)/        # organisations · users · ai-monitoring · audit
│   │   ├── components/{ui,shared,layout}
│   │   ├── store/{authSlice, api/*}   # Redux Toolkit + RTK Query (mock-aware baseQuery)
│   │   ├── lib/{constants,utils,token-storage,api-client,mocks/*}
│   │   └── hooks/useAuth.ts
│   └── services/              # 12 microservices (auth-service FULL; others stub)
├── packages/
│   ├── types/                # @jobhunter/types — canonical domain model (shared FE+BE)
│   ├── database/             # @jobhunter/database — Prisma schema + RLS + client
│   ├── kafka/ redis/ logger/ config/
├── infra/docker/             # docker-compose (Postgres, Redis, Kafka, MinIO, Temporal)
└── turbo.json · pnpm-workspace.yaml
```

## Tech stack

| Layer | Tech |
|---|---|
| Universal client | React Native 0.76 · React Native Web · **Expo SDK 52** · Expo Router v4 |
| Styling | **NativeWind v4** (Tailwind → RN StyleSheet/CSS) · React Native Paper (MD3) |
| State / data | Redux Toolkit 2 + RTK Query (mock-aware base query) |
| Charts / DnD | react-native-svg primitives (Victory Native is the prescribed prod lib) · Kanban (move controls; draggable-flatlist is the prescribed native DnD) |
| Backend | Node 22 · NestJS 11 · Python 3.12 + FastAPI (AI/analytics) |
| Data | PostgreSQL 16 (RLS) · Prisma 6 · Redis 7 · Kafka · Pinecone · Temporal · S3/MinIO |

---

## Prerequisites

- **Node.js 20 or 22 LTS** (Expo SDK 52 does not officially support Node 25; install nvm-windows and `nvm use 22`).
- **pnpm 9** (`npm i -g pnpm@9`).
- (Optional, for live backend) Docker Desktop.

## Run the app (web — no backend needed)

```bash
pnpm install                       # from repo root
cd apps/mobile
cp ../../.env.example .env          # EXPO_PUBLIC_USE_MOCKS defaults to true
pnpm web                           # opens http://localhost:8081 in the browser
```

Then sign in with a **demo account** (password `Password@123`):

| Role | Email | Lands on |
|---|---|---|
| Job Seeker | `aarav@example.com` | Candidate dashboard |
| Recruiter | `priya@acme.com` (MFA — enter any 6 digits) | Pipeline kanban |
| Admin | `root@jobhunter.io` (MFA — any 6 digits) | Organisations |

The login screen has one-tap buttons to prefill each demo role.

### Run on mobile
```bash
cd apps/mobile && pnpm dev         # press i (iOS sim) / a (Android emulator) / scan QR (Expo Go)
```

### Build a static web bundle
```bash
cd apps/mobile && pnpm build:web   # → apps/mobile/dist
```

## Run the backend reference (optional)

```bash
pnpm infra:up                                  # Postgres, Redis, Kafka, MinIO, Temporal
pnpm --filter @jobhunter/database generate     # prisma generate
pnpm --filter @jobhunter/database migrate      # apply schema
psql "$DATABASE_URL" -f packages/database/prisma/rls.sql   # enable RLS + immutable audit rules
pnpm --filter @jobhunter/auth-service dev      # NestJS auth on :3001
# then in apps/mobile/.env set EXPO_PUBLIC_USE_MOCKS=false
```

---

## How the mock layer works (so the app "just runs")

`store/api/baseQuery.ts` is a mock-aware RTK Query base query. When `EXPO_PUBLIC_USE_MOCKS=true`
(default) every request is resolved by `lib/mocks/router.ts` against the seed store in
`lib/mocks/data.ts` — including realistic write mutations, the **5-gate voice pre-call check**, the
**human-validation/consent gate** (409s), **priority-matrix sum=100** validation, **application
dedup** (409), and **masked-until-consent PII**. Endpoints are written **once** and work against
either mocks or the live gateway — flip one env var to go live.

## BRD invariants demonstrated in code

- **Voice consent**: `ConsentGate` blocks launch with 0 consenters; `GateChecklist` shows all 5 gates; skipped calls carry `skip_reason`.
- **Human-in-the-loop**: candidates cannot advance to SCREENING/INTERVIEW without an `APPROVED` action (G-013) — enforced in the mock router and surfaced in the kanban.
- **AI governance**: resume-redesign CVs are created as DRAFT and never auto-activated (FR-JS-024); low-confidence (<0.7) skills are flagged ⚠ (no hallucinated auto-fill); AI monitoring flags hallucination > 5%.
- **Security/compliance**: JWT in `expo-secure-store` on native / localStorage on web (`lib/token-storage.ts`); RBAC matrix (§14.3) rendered in admin; immutable audit + GDPR erasure; RLS + global-candidate-pool masking (G-025) in the Prisma layer.
- **Explainability**: every match shows an LLM rationale + factor breakdown (right to explanation).

## Testing & CI (scaffolded)

- Unit: Jest (`auth-service` includes a password-policy + service spec). Web E2E: Playwright; Native E2E: Detox (per Master Prompt phase 6).
- `turbo run typecheck | test | lint` across the workspace.

## Project status

Implementation maps to the Master Prompt phases: **Phase 1–5 frontend is complete and runnable**;
backend Phase 1 (`auth-service` + data layer) is implemented; remaining services + Phase 6 hardening
(K8s/Terraform/OTel/k6/app-store) are scaffolded with intent documented. See `DELIVERY_NOTES.md`.

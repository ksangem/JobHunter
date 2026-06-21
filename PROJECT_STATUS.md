# JobHunter — Project Status (Source of Truth)

> **This file is the single source of truth for what is built vs. planned in the JobHunter application.**
>
> **Maintenance rule:** Update this file with **every meaningful change / every working day of progress**.
> When a feature moves from planned → in-progress → done, move its row and add a dated entry to the
> **Changelog** at the bottom. Keep the "Last updated" date current. Do not let code and this file drift.

**Last updated:** 2026-06-21
**App:** JobHunter — AI recruitment platform · Universal (Web + iOS + Android)
**Stack:** Expo SDK 52 + React Native Web + Expo Router + NativeWind + Redux Toolkit/RTK Query (frontend) · NestJS 11 + Python FastAPI + Prisma + PostgreSQL + Redis + Kafka + Temporal (backend) · pnpm/Turborepo monorepo
**Run mode today:** `EXPO_PUBLIC_USE_MOCKS=true` → the whole app runs on an in-app mock API (no live backend required).

---

## Legend
✅ Built & verified · 🟦 Built as reference (not wired to the running app) · 🟨 Stub / scaffold · 🔢 Planned / future · ⚠️ Known gap

---

## 1. What is built / accomplished today

### 1.1 Frontend — universal app (`apps/mobile`) ✅
Runs end-to-end in the browser via the mock layer. Web export verified (**1,305 modules**, `dist/` produced).

| Area | Screens | Status |
|---|---|---|
| Auth | login, register, verify-email (OTP), MFA | ✅ (mock) |
| Candidate | dashboard, jobs (+detail), applications, resume-ai, cv versions, profile, interviews, notifications | ✅ (mock) |
| Candidate (added from prototype) | **onboarding (method picker), CV-upload wizard (4-step), manual-profile wizard (4-step), settings** | ✅ (mock) |
| Recruiter | **dashboard (landing)**, pipeline (kanban), jds (+detail/new), voice-ai, email, interviews, analytics, market-intel | ✅ (mock) |
| Recruiter (added from prototype) | **org onboarding, settings** | ✅ (mock) |
| Admin | organisations, users + RBAC matrix, ai-monitoring, audit + GDPR erasure | ✅ (mock) |

- Design system / shared components: Screen, Card, Button, Badge, Input, Avatar, ProgressBar, Toggle, Feedback (Loader/Empty/Error), SectionHeader, MetricCard, StatCard, ScoreRing, Charts (Line/Bar/Funnel/Donut/Heatmap), StageBadge, RiskBadge, SkillChips, GateChecklist, ConsentGate, KanbanBoard, SideSheet, StepIndicator, TagSelect, TopBar, AuthShell. ✅
- State/data: Redux Toolkit + RTK Query with a **mock-aware base query** (`store/api/baseQuery.ts`) — endpoints written once, work against mock OR live by flipping `EXPO_PUBLIC_USE_MOCKS`. ✅
- Business rules demonstrated in-app: 5-gate voice consent, human-validation gate (409), priority-matrix sum=100 (422), application dedup (409), governed resume rebuild (DRAFT, never auto-activated), low-confidence AI flagging, masked-until-consent PII, drillable metric cards. ✅

### 1.2 Shared packages ✅
`@jobhunter/types` (canonical domain model — typechecks clean), `@jobhunter/logger` (pino + PII redaction), `@jobhunter/config` (zod env), `@jobhunter/kafka` (topic registry + producer/consumer), `@jobhunter/redis` (rate limiter + token denylist).

### 1.3 Backend reference (`apps/services`)
| Component | Status |
|---|---|
| `auth-service` (NestJS) | 🟦 Real code (bcrypt, RS256 JWT, OTP→Redis, rotating refresh + reuse-detection, denylist logout, rate limits, TOTP MFA, Google OAuth, Kafka emit) — **NOT connected to the app; needs infra** |
| `packages/database` (Prisma) | 🟦 Real schema (29 models + RLS + immutable audit rules + `withTenant()`) — not migrated/connected |
| candidate, jd, matching, voice-ai, email, interview, analytics, notification, admin, ai-worker, consent services | 🟨 Stubs (`/health` + endpoints return 501 with TODO + BRD refs) |

### 1.4 Infra & docs ✅
docker-compose (Postgres/Redis/Kafka/MinIO/Temporal), CI workflow, EAS build profiles, `README.md`, `DELIVERY_NOTES.md`, and this file.

### 1.5 Real vs dummy APIs (runtime truth)
**Today: 0 endpoints are live end-to-end. All ~60 endpoints across 6 domains run on static mock data.** Only the Auth domain has a real backend implementation available (not yet wired).

| Domain | FE wired (RTK hook) | Mock (static) — active now | Real backend exists | Runtime source |
|---|---|---|---|---|
| Auth | ✅ | ✅ | 🟦 Yes (auth-service, full) | Mock |
| Candidate profile / CV / Resume-AI | ✅ | ✅ | ❌ (candidate-service, ai-worker = stub) | Mock |
| Jobs / Applications / Notifications | ✅ | ✅ | ❌ | Mock |
| JD / Pipeline / Voice / Email / Interviews / Offers | ✅ | ✅ | ❌ (services = stub) | Mock |
| Analytics / Market / Recruiter org+settings | ✅ | ✅ | ❌ | Mock |
| Admin (users/orgs/audit/ai-monitoring/gdpr) | ✅ | ✅ | ❌ | Mock |

---

## 2. Authentication & Authorization — current vs. future

### 2.1 Part A — Email-based auth (verify → set password → login)
| Aspect | Current (built) | Future recommendation (planned) |
|---|---|---|
| Sign-up | 🟦 Mock register + OTP screen; any 6 digits pass | 🔢 Real register → email sent to user's real inbox |
| Email delivery | ⚠️ None (no email actually sent) | 🔢 **Gmail SMTP (Nodemailer + App Password)** for dev/pilot, behind a swappable interface → **SES/SendGrid** for production scale |
| Verification | 🟦 Mock OTP only | 🔢 **Magic link + 6-digit OTP fallback**, single-use, hashed at rest, short TTL (OTP 10 min, invite link 24 h) |
| Password | ⚠️ Demo password `Password@123` for all | 🔢 User **sets own password** after verify; **argon2id/bcrypt** hash; policy enforced (12+ chars, mixed) |
| Login | 🟦 Mock (matches seed users) | 🔢 Real email+password → hash compare → optional MFA → RS256 JWT |
| Sessions | 🟦 Rotating refresh + reuse-detection coded in auth-service (not wired) | 🔢 Wire to app; Redis denylist on logout |
| Reset password | ⚠️ Not implemented | 🔢 Tokenised email reset (same mailer) |
| Security | 🟦 Rate-limit + audit helpers exist | 🔢 Per-email/IP send+verify limits, enumeration-safe responses, audit every auth event |

### 2.2 Part B — Subscription / commercial authz (one user · one access · one subscription)
**Current:** ⚠️ None. RBAC roles exist in code; there is **no subscription, seat, billing, or entitlement layer** yet.

**Future recommendation (planned):**
| Layer | Plan |
|---|---|
| Tenancy | 🔢 Org holds **one subscription** buying **N seats**; each active user = 1 seat ("one user, one access") |
| Data model | 🔢 `Plan`, `Subscription`, `Seat/Membership`, `UsageCounter`, derived `Entitlement` (Redis-cached) added to Prisma |
| Billing | 🔢 **Stripe** (global) and/or **Razorpay** (India): Checkout + Customer Portal + **webhooks** drive Subscription status; plans = provider Products/Prices |
| Enforcement | 🔢 `SubscriptionGuard` (block if not active → 402), seat-cap on invite, `RolesGuard` (built) + `EntitlementGuard` (feature/quota), RLS data isolation (built) |
| Plans | 🔢 Free / Starter / Growth / Enterprise feature+quota matrix (seats, JDs, voice minutes, AI calls, analytics, SSO) — prices TBD |
| Lifecycle | 🔢 Signup → verify+set-password → pick plan → pay → webhook activates seats → invite users → entitlement-gated access; payment fail → grace → auto-suspend |

> **Decisions pending approval** (asked, awaiting answer): email transport (Gmail SMTP vs SES/SendGrid vs Gmail API), verify method (magic link + OTP vs OTP-only vs link-only), billing provider + model (Stripe/Razorpay · B2B seat vs B2B+B2C), and build scope this cycle.

---

## 3. Roadmap (high level)
1. 🔢 **Part A** — real email auth end-to-end (auth-service + Gmail mailer + frontend set-password flow), first domain to go live (mocks off for auth).
2. 🔢 **Part B** — subscription data model + guards + plan matrix; billing wired (keys can come later).
3. 🔢 Make candidate domain real (candidate-service + ai-worker against Prisma) — first full vertical slice off mocks.
4. 🔢 Progressively replace each stub service; flip domains off mocks as they go live.
5. 🔢 Phase-6 hardening: Terraform/K8s, OpenTelemetry, k6 load tests, Detox/Playwright E2E, app-store submission.

---

## 4. Changelog
Add a dated entry for every working session. Newest first.

### 2026-06-21
- Initialised this PROJECT_STATUS.md as the source of truth (rule: update with every change).
- Built the universal app (auth + candidate + recruiter + admin) on the mock API; web export verified (1,305 modules).
- Added 7 screens ported from the clickable prototype (candidate onboarding, CV-upload wizard, manual-profile wizard, candidate settings; recruiter dashboard [now landing], org onboarding, settings); recruiter now lands on Dashboard; new candidates route to onboarding after email verification.
- Backend reference: `auth-service` (full) + Prisma schema (full) + 11 service stubs; infra compose + CI + EAS profiles.
- Documented real-vs-dummy API status (all domains currently mock; auth has real backend not yet wired).
- Drafted Part A (email auth) and Part B (subscription/seat commercial model) plans — **awaiting approval to implement.**

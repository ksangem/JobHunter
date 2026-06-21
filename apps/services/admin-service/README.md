# admin-service

**Purpose:** Platform/org administration — onboarding (DPA), seats/users, AI monitoring dashboard, and audit-log access. Role-gated (SUPER_ADMIN/ORG_ADMIN).
**Port:** 3010
**Key endpoints:** `GET /api/v1/admin/ai-monitor`, `GET /api/v1/admin/audit-logs`, `GET /api/v1/health`
**BRD refs:** FR-A-001..010 (esp. FR-A-005 AI monitoring, FR-A-008 audit).
**Status:** Stub — endpoints return 501; structure + intent only.

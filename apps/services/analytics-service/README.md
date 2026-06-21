# analytics-service (Python / FastAPI)

**Purpose:** Recruiter & candidate dashboards plus market intelligence — funnel/KPI rollups computed off a read replica. Org-scoped via RLS.
**Port:** 3008
**Key endpoints:** `GET /api/v1/analytics/recruiter/dashboard`, `GET /api/v1/health`
**BRD refs:** FR-R-090..099. Response shapes mirror `RecruiterDashboard`/`CandidateDashboard` in `@jobhunter/types`.
**Status:** Stub — endpoints return 501; structure + intent only.

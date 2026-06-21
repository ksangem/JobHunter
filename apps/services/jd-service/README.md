# jd-service

**Purpose:** Job description authoring + lifecycle (DRAFT→ACTIVE→ARCHIVED), AI JD parsing, priority-matrix generation. Org-scoped via RLS.
**Port:** 3003
**Key endpoints:** `GET/POST /api/v1/jds`, `POST /api/v1/jds/:id/publish`, `GET /api/v1/health`
**BRD refs:** FR-R-013..020 (expected_close_date mandatory). Emits `jd.published`.
**Status:** Stub — endpoints return 501; structure + intent only.

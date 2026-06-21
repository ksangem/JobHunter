# interview-service

**Purpose:** Interview scheduling (calendar/Meet/Zoom), feedback scorecards, and offer management. Org-scoped.
**Port:** 3007
**Key endpoints:** `POST /api/v1/interviews`, `POST /api/v1/interviews/:id/feedback`, `POST /api/v1/offers`, `GET /api/v1/health`
**BRD refs:** FR-R-065..080. Emits `interview.scheduled`, `interview.no_show`.
**Status:** Stub — endpoints return 501; structure + intent only.

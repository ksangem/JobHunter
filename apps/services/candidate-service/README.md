# candidate-service

**Purpose:** Owns the global candidate golden record (G-025), CV versions, ATS scoring, profile completeness, and consented cross-org reads.
**Port:** 3002
**Key endpoints:** `GET /api/v1/candidates/me`, `GET /api/v1/candidates/:id` (PII masked-until-consent), `POST /api/v1/candidates/me/cv`, `GET /api/v1/health`
**BRD refs:** FR-JS-010..040, FR-R-021, G-025. Consumes `cv.parsed`; emits `cv.uploaded`, `profile.updated`.
**Status:** Stub — endpoints return 501; structure + intent only.

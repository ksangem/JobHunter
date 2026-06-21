# consent-service

**Purpose:** Consent ledger (VOICE_AI/RECORDING/TOS/MARKETING) and GDPR/DPDP data-subject rights incl. erasure. Candidate-scoped (global, no org_id).
**Port:** 3012
**Key endpoints:** `POST /api/v1/consents`, `POST /api/v1/erasure-requests`, `GET /api/v1/health`
**BRD refs:** FR-G-040..048. Source of truth for PII-unmasking. Emits `gdpr.erasure_requested`.
**Status:** Stub — endpoints return 501; structure + intent only.

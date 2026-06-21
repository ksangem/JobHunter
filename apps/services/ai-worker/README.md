# ai-worker (Python / FastAPI)

**Purpose:** Central LLM/embedding worker — CV parsing, ATS scoring, resume redesign, JD parsing, embeddings. Primary model Claude (G-023), OpenAI fallback. Writes an AiAuditLog per inference.
**Port:** 3011
**Key endpoints:** `POST /api/v1/parse-cv`, `GET /api/v1/health`
**BRD refs:** FR-A-001..005, G-023. Kafka: consumes `cv.uploaded`; emits `cv.parsed`, `embedding.generated`. Low-confidence (<0.7) extractions flagged, never auto-applied.
**Status:** Stub — endpoints return 501; governance + intent documented.

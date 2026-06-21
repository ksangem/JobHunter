# matching-service (Python / FastAPI)

**Purpose:** Semantic candidate↔JD matching & ranking — vector search + PriorityMatrix-weighted composite score (single 0–100 scale) with LLM rationale.
**Port:** 3004
**Key endpoints:** `POST /api/v1/pipeline/generate-shortlist`, `GET /api/v1/health`
**BRD refs:** FR-R-030..039, Tech Specs §9.2 (composite-score formula in `app/main.py` docstring). Consumes `embedding.generated`; deduped Applications per Critical Rule §6.
**Status:** Stub — endpoints return 501; formula + intent documented.

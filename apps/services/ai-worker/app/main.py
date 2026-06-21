"""
ai-worker — LLM/embedding worker (FR-A-005). Owns every AI inference call:
CV parsing, ATS scoring, resume redesign, JD parsing, embeddings. Primary model
is Claude (G-023: ANTHROPIC_MODEL, e.g. claude-opus-4-8) with an OpenAI
fallback. Usually driven by Kafka (cv.uploaded -> parse -> cv.parsed /
embedding.generated), with this HTTP surface for synchronous/debug calls.

GOVERNANCE: every inference writes an AiAuditLog row (function, model,
prompt_version, confidence, latency, token_cost, input_hash — never raw PII).
Low-confidence extractions (<0.7) are flagged for manual review, never
auto-applied to the candidate golden record (see Skill.confidence in types).
"""
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import FastAPI, Response, status
from pydantic import BaseModel

app = FastAPI(title="ai-worker", version="2.0.0")

PORT = 3011


def envelope(data, request_id: str | None = None) -> dict:
    return {
        "data": data,
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "request_id": request_id or str(uuid4()),
            "version": "v1",
        },
        "error": None,
    }


@app.get("/api/v1/health")
async def health() -> dict:
    return {"status": "ok", "service": "ai-worker", "port": PORT}


class ParseCvRequest(BaseModel):
    cv_version_id: str
    storage_key: str  # S3 object key of the uploaded CV


# FR-A-001 — parse a CV into structured profile data (skills/exp/education).
@app.post("/api/v1/parse-cv")
async def parse_cv(req: ParseCvRequest, response: Response) -> dict:
    # TODO: 1) fetch CV bytes from S3 (req.storage_key);
    #       2) call Claude (ANTHROPIC_MODEL) with the resume-parsing prompt;
    #       3) attach per-skill confidence; flag <0.7 for manual review;
    #       4) write AiAuditLog(function=RESUME_PARSING, model, prompt_version);
    #       5) update CvVersion.parsed_data + emit cv.parsed / embedding.generated.
    response.status_code = status.HTTP_501_NOT_IMPLEMENTED
    return envelope({"detail": "Not implemented (reference stub)", "cv_version_id": req.cv_version_id})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)

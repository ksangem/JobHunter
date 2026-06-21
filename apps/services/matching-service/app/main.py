"""
matching-service — semantic candidate<->JD matching & ranking (FR-R-030..039).

Pulls candidate embeddings from the vector DB (Pinecone) and combines them with
the JD's PriorityMatrix weights to produce a single 0-100 match score plus an
LLM rationale. Org-scoped reads go through RLS (tenant context); the candidate
pool itself is global (G-025).

Composite score formula (Tech Specs §9.2 / FR-R-030):

    match_score = 100 * (
          w_semantic   * cosine(candidate_vec, jd_vec)
        + w_skills     * skill_overlap_ratio
        + w_experience * experience_fit          # clamp(cand_yrs / jd_min_yrs)
        + w_location   * location_match          # 1 if in target / remote-ok
        + w_salary     * salary_fit
        + w_notice     * notice_fit
        + w_cert       * cert_match
    )
    where the w_* weights come from JobDescription.priority_matrix and are
    L1-normalised so they sum to 1.0. Sub-scores are each in [0, 1].
"""
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import FastAPI, Response, status
from pydantic import BaseModel

app = FastAPI(title="matching-service", version="2.0.0")

PORT = 3004


def envelope(data, request_id: str | None = None) -> dict:
    """Match the cross-service response envelope."""
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
    return {"status": "ok", "service": "matching-service", "port": PORT}


class GenerateShortlistRequest(BaseModel):
    jd_id: str
    org_id: str
    top_n: int = 50


# FR-R-030 / FR-R-032 — generate a ranked shortlist for a JD.
@app.post("/api/v1/pipeline/generate-shortlist")
async def generate_shortlist(req: GenerateShortlistRequest, response: Response) -> dict:
    # TODO: 1) fetch JD + priority_matrix; 2) vector search candidate pool;
    #       3) compute composite match_score (see module docstring formula);
    #       4) upsert Application(stage=SOURCED, match_score) deduped by
    #          (candidate_id, jd_id) — Critical Rule §6;
    #       5) emit application.submitted / record AiAuditLog(CANDIDATE_RANKING).
    response.status_code = status.HTTP_501_NOT_IMPLEMENTED
    return envelope({"detail": "Not implemented (reference stub)", "jd_id": req.jd_id})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)

# voice-ai-service

**Purpose:** Outbound AI voice screening campaigns with a mandatory 5-point pre-call compliance gate (consent, DNC, time-window, platform/org throttle).
**Port:** 3005
**Key endpoints:** `POST /api/v1/campaigns`, `POST /api/v1/campaigns/:id/launch`, `POST /api/v1/webhooks/call-status`, `GET /api/v1/health`
**BRD refs:** §10.3, FR-R-040..050. Emits `call.initiated`, `call.completed`.
**Status:** Stub — endpoints return 501; structure + intent only.

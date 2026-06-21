# notification-service

**Purpose:** In-app, WebSocket, and push (FCM/APNS) notifications. Consumes `notification.send`; manages device-token registration.
**Port:** 3009 (also the realtime socket endpoint)
**Key endpoints:** `GET /api/v1/notifications`, `POST /api/v1/devices`, `GET /api/v1/health`
**BRD refs:** FR-G-030..036, G-035. Consumes `notification.send`.
**Status:** Stub — endpoints return 501; structure + intent only.

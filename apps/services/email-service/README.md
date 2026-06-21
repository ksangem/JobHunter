# email-service

**Purpose:** Transactional + campaign email delivery (SES/SendGrid), suppression-list handling, open/click tracking. Org-scoped.
**Port:** 3006
**Key endpoints:** `POST /api/v1/campaigns`, `POST /api/v1/campaigns/:id/send`, `GET /api/v1/health`
**BRD refs:** FR-R-055..060. Consumes `notification.send` for transactional email.
**Status:** Stub — endpoints return 501; structure + intent only.

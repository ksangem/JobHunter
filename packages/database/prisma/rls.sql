-- ============================================================================
-- JobHunter — Row-Level Security + immutability rules (BRD §14.2).
--
-- Apply AFTER `prisma migrate`/`prisma db push` (e.g. as a follow-up migration
-- or `psql -f rls.sql`). These constraints live below Prisma because Prisma
-- does not model RLS policies or Postgres rules.
--
-- TENANCY MODEL
--   Every ORG-SCOPED table carries org_id and is isolated by RLS keyed on the
--   per-transaction GUC `app.org_id`, which the application sets via
--   set_config('app.org_id', <uuid>, true) in tenant-context middleware BEFORE
--   any controller runs (see packages/database/src/index.ts -> withTenant()).
--   RLS is the LAST line of defence — not the first.
--
--   ┌─────────────────────────────────────────────────────────────────────┐
--   │ Candidate is INTENTIONALLY NOT under RLS.                            │
--   │ Candidates are a GLOBAL talent pool (G-025) shared across orgs.       │
--   │ Cross-org PII exposure is instead controlled by:                      │
--   │   (a) field-masking-until-consent (email/phone masked in the API     │
--   │       layer unless an active ConsentLog grants access), and           │
--   │   (b) AUDITED reads — every PII read writes an AuditLog row           │
--   │       (action = CANDIDATE_PII_READ).                                  │
--   │ Same applies to candidate-scoped children (cv_versions,              │
--   │ job_preferences, consent_logs) which have no org_id.                  │
--   └─────────────────────────────────────────────────────────────────────┘
--
-- IMMUTABILITY
--   audit_logs, ai_audit_logs and shortlist_actions are append-only. UPDATE and
--   DELETE are rewritten to NOTHING by Postgres rules so history cannot be
--   tampered with even by a compromised service account.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Row-Level Security on org-scoped tables
-- ---------------------------------------------------------------------------
-- Helper note: current_setting('app.org_id', true) returns NULL if unset; the
-- `::uuid` cast on a NULL yields NULL and the predicate is false => deny-by-
-- default when no tenant context has been established.

-- job_descriptions
ALTER TABLE "job_descriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_descriptions" FORCE ROW LEVEL SECURITY;
CREATE POLICY job_descriptions_org_isolation ON "job_descriptions"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- applications
ALTER TABLE "applications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "applications" FORCE ROW LEVEL SECURITY;
CREATE POLICY applications_org_isolation ON "applications"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- shortlist_actions
ALTER TABLE "shortlist_actions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shortlist_actions" FORCE ROW LEVEL SECURITY;
CREATE POLICY shortlist_actions_org_isolation ON "shortlist_actions"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- voice_campaigns
ALTER TABLE "voice_campaigns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "voice_campaigns" FORCE ROW LEVEL SECURITY;
CREATE POLICY voice_campaigns_org_isolation ON "voice_campaigns"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- call_logs
ALTER TABLE "call_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "call_logs" FORCE ROW LEVEL SECURITY;
CREATE POLICY call_logs_org_isolation ON "call_logs"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- email_campaigns
ALTER TABLE "email_campaigns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "email_campaigns" FORCE ROW LEVEL SECURITY;
CREATE POLICY email_campaigns_org_isolation ON "email_campaigns"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- email_recipients
ALTER TABLE "email_recipients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "email_recipients" FORCE ROW LEVEL SECURITY;
CREATE POLICY email_recipients_org_isolation ON "email_recipients"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- interviews
ALTER TABLE "interviews" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "interviews" FORCE ROW LEVEL SECURITY;
CREATE POLICY interviews_org_isolation ON "interviews"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- feedback_scorecards
ALTER TABLE "feedback_scorecards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feedback_scorecards" FORCE ROW LEVEL SECURITY;
CREATE POLICY feedback_scorecards_org_isolation ON "feedback_scorecards"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- offers
ALTER TABLE "offers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "offers" FORCE ROW LEVEL SECURITY;
CREATE POLICY offers_org_isolation ON "offers"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- screening_questions
ALTER TABLE "screening_questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "screening_questions" FORCE ROW LEVEL SECURITY;
CREATE POLICY screening_questions_org_isolation ON "screening_questions"
  USING (org_id = current_setting('app.org_id', true)::uuid);

-- blacklist_entries (org_id NULL = platform-wide; visible to all tenants)
ALTER TABLE "blacklist_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blacklist_entries" FORCE ROW LEVEL SECURITY;
CREATE POLICY blacklist_entries_org_isolation ON "blacklist_entries"
  USING (org_id IS NULL OR org_id = current_setting('app.org_id', true)::uuid);

-- ---------------------------------------------------------------------------
-- 2. Immutability (append-only) rules
-- ---------------------------------------------------------------------------

-- audit_logs
CREATE RULE no_update_audit AS ON UPDATE TO "audit_logs" DO INSTEAD NOTHING;
CREATE RULE no_delete_audit AS ON DELETE TO "audit_logs" DO INSTEAD NOTHING;

-- ai_audit_logs
CREATE RULE no_update_ai_audit AS ON UPDATE TO "ai_audit_logs" DO INSTEAD NOTHING;
CREATE RULE no_delete_ai_audit AS ON DELETE TO "ai_audit_logs" DO INSTEAD NOTHING;

-- shortlist_actions
CREATE RULE no_update_shortlist AS ON UPDATE TO "shortlist_actions" DO INSTEAD NOTHING;
CREATE RULE no_delete_shortlist AS ON DELETE TO "shortlist_actions" DO INSTEAD NOTHING;

-- ---------------------------------------------------------------------------
-- 3. Partial unique index: at most one ACTIVE CV per candidate
--    (Prisma can only express full @@unique; see schema.prisma comment.)
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS "cv_versions_candidate_id_status_key"; -- drop the placeholder
CREATE UNIQUE INDEX IF NOT EXISTS cv_one_active_per_candidate
  ON "cv_versions" (candidate_id) WHERE status = 'ACTIVE';

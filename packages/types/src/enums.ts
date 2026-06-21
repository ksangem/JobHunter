// ============================================================================
// JobHunter — Canonical enums (BRD §6, §10, §14.3)
// Single source of truth shared by frontend + backend.
// ============================================================================

export enum Role {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
  HIRING_MANAGER = 'HIRING_MANAGER',
  ORG_ADMIN = 'ORG_ADMIN',
  VIEWER = 'VIEWER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INVITED = 'INVITED',
}

/** Job Seeker lifecycle (BRD §10.1) */
export enum CandidateStage {
  REGISTERED = 'REGISTERED',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  CV_PARSING = 'CV_PARSING',
  PROFILE_READY = 'PROFILE_READY',
  DISCOVERABLE = 'DISCOVERABLE',
}

/** Organisation onboarding (FR-R-001 / BRD §10.2) */
export enum OrgStatus {
  REGISTERED = 'REGISTERED',
  DPA_PENDING = 'DPA_PENDING',
  DPA_SIGNED = 'DPA_SIGNED',
  PROVISIONED = 'PROVISIONED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

/** JD lifecycle (FR-R-013) */
export enum JdStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

/** Application / pipeline stage (BRD §10.1, FR-JS-034, FR-R-032) */
export enum ApplicationStage {
  SOURCED = 'SOURCED',
  SUBMITTED = 'SUBMITTED',
  VIEWED = 'VIEWED',
  SHORTLISTED = 'SHORTLISTED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  FEEDBACK = 'FEEDBACK',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  NO_SHOW = 'NO_SHOW',
}

/** Ordered kanban columns shown in the recruiter pipeline */
export const PIPELINE_COLUMNS: ApplicationStage[] = [
  ApplicationStage.SOURCED,
  ApplicationStage.SHORTLISTED,
  ApplicationStage.SCREENING,
  ApplicationStage.INTERVIEW,
  ApplicationStage.OFFER,
  ApplicationStage.HIRED,
];

export enum CvStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PARSING = 'PARSING',
  FAILED = 'FAILED',
}

export enum RebuildSource {
  ORIGINAL = 'ORIGINAL',
  AI = 'AI',
}

export enum ConsentType {
  VOICE_AI = 'VOICE_AI',
  RECORDING = 'RECORDING',
  TOS = 'TOS',
  MARKETING = 'MARKETING',
}

export enum ConsentStatus {
  GRANTED = 'GRANTED',
  DENIED = 'DENIED',
  REVOKED = 'REVOKED',
  PENDING = 'PENDING',
}

/** Voice campaign + per-call states (BRD §10.3) */
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  LAUNCHED = 'LAUNCHED',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export enum CallStatus {
  PENDING = 'PENDING',
  SKIPPED = 'SKIPPED',
  INITIATED = 'INITIATED',
  ANSWERED = 'ANSWERED',
  SCREENING = 'SCREENING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  RESCHEDULED = 'RESCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum InterviewType {
  PHONE_SCREEN = 'PHONE_SCREEN',
  TECHNICAL = 'TECHNICAL',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  HR = 'HR',
  MANAGERIAL = 'MANAGERIAL',
  FINAL = 'FINAL',
}

export enum OfferStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  REVOKED = 'REVOKED',
}

export enum WorkMode {
  ONSITE = 'ONSITE',
  HYBRID = 'HYBRID',
  REMOTE = 'REMOTE',
}

export enum NotificationType {
  APPLICATION_UPDATE = 'APPLICATION_UPDATE',
  INTERVIEW = 'INTERVIEW',
  MATCH = 'MATCH',
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
  CONSENT = 'CONSENT',
}

/** AI functions tracked in ai_audit_logs / AI monitoring (FR-A-005) */
export enum AiFunction {
  RESUME_PARSING = 'RESUME_PARSING',
  ATS_SCORING = 'ATS_SCORING',
  RESUME_REDESIGN = 'RESUME_REDESIGN',
  JD_PARSING = 'JD_PARSING',
  PRIORITY_MATRIX = 'PRIORITY_MATRIX',
  CANDIDATE_MATCHING = 'CANDIDATE_MATCHING',
  CANDIDATE_RANKING = 'CANDIDATE_RANKING',
  VOICE_SCREENING = 'VOICE_SCREENING',
  DYNAMIC_QUESTIONING = 'DYNAMIC_QUESTIONING',
  SIMILARITY = 'SIMILARITY',
}

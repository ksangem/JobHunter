// ============================================================================
// JobHunter — Domain entities (BRD §6–§9). These mirror the Prisma models in
// packages/database and the API response shapes consumed by the universal app.
// ============================================================================
import type {
  AiFunction,
  ApplicationStage,
  CallStatus,
  CampaignStatus,
  CandidateStage,
  ConsentStatus,
  ConsentType,
  CvStatus,
  InterviewStatus,
  InterviewType,
  JdStatus,
  NotificationType,
  OfferStatus,
  OrgStatus,
  RebuildSource,
  RiskLevel,
  Role,
  UserStatus,
  WorkMode,
} from './enums';

export interface Timestamped {
  created_at: string; // ISO 8601
  updated_at: string;
}

export interface User extends Timestamped {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  status: UserStatus;
  org_id: string | null;
  mfa_enabled: boolean;
  avatar_url?: string | null;
  last_login_at?: string | null;
}

export interface Organisation extends Timestamped {
  id: string;
  name: string;
  status: OrgStatus;
  tier: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  seats_total: number;
  seats_filled: number;
  dpa_signed_at: string | null;
  region: string; // e.g. ap-south-1
}

export interface Skill {
  name: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  years?: number;
  /** AI extraction confidence 0–1; <0.7 → manual review (G never auto-fill) */
  confidence?: number;
}

export interface Experience {
  company: string;
  title: string;
  start: string;
  end: string | null; // null = current
  summary?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  year?: number;
}

export interface JobPreferences {
  target_roles: string[];
  target_locations: string[];
  min_salary?: number;
  currency?: string;
  work_mode?: WorkMode;
  notice_pref?: number; // days
}

/** Golden record (FR-R-021). PII fields are masked-until-consent for cross-org reads (G-025). */
export interface Candidate extends Timestamped {
  id: string;
  master_id: string; // CAND_XXXXXX
  user_id?: string | null; // null for externally-sourced
  full_name: string;
  email: string | null; // masked until consent for external reads
  phone: string | null; // E.164, masked until consent
  email_masked?: boolean;
  phone_masked?: boolean;
  timezone?: string | null;
  headline?: string;
  location?: string;
  stage: CandidateStage;
  skills: Skill[];
  experience_years: number;
  experiences?: Experience[];
  education?: Education[];
  preferences?: JobPreferences;
  ats_score?: number; // 0–100
  completeness?: number; // 0–100
  source: 'PLATFORM' | 'LINKEDIN' | 'NAUKRI' | 'INDEED' | 'REFERRAL';
  enriched_at?: string | null;
  voice_enrolled?: boolean;
}

export interface CompletenessResult {
  score: number;
  missing_fields: { field: string; contribution: number }[];
}

export interface CvVersion extends Timestamped {
  id: string;
  candidate_id: string;
  filename: string;
  status: CvStatus;
  rebuild_source: RebuildSource;
  source_jd_id?: string | null;
  ats_score?: number;
  size_bytes: number;
  preview_url?: string; // signed, 1h TTL
}

export interface AtsBreakdown {
  skills: number;
  keywords: number;
  experience: number;
  formatting: number;
}

export interface AtsScore {
  score: number; // 0–100
  breakdown: AtsBreakdown;
  computed_at: string;
}

export interface AtsSuggestion {
  id: string;
  title: string;
  detail: string;
  category: 'skills' | 'keywords' | 'experience' | 'formatting';
  score_delta: number; // potential gain
  status: 'OPEN' | 'COMPLETED' | 'DISMISSED';
}

export interface SkillGap {
  critical: string[];
  important: string[];
  strengths: string[];
}

export interface PriorityMatrix {
  skills: number;
  experience: number;
  notice: number;
  location: number;
  salary: number;
  cert: number;
}

export interface JobDescription extends Timestamped {
  id: string;
  org_id: string;
  title: string;
  status: JdStatus;
  location: string;
  work_mode: WorkMode;
  exp_min: number;
  exp_max?: number;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  skills: string[];
  description?: string;
  expected_close_date: string; // mandatory (FR-R-013)
  priority_matrix?: PriorityMatrix;
  created_by: string;
  approved_by?: string | null;
  applicant_count?: number;
  extraction_confidence?: number; // for uploaded JDs
  ai_extracted?: boolean;
}

export interface MatchBreakdown {
  semantic: number;
  skills: number;
  experience: number;
  location: number;
}

export interface JobRecommendation {
  jd: JobDescription;
  match_score: number; // 0–100 single scale
  breakdown: MatchBreakdown;
  explanation: string; // LLM rationale (FR-JS-037 / FR-R-030)
}

export interface Application extends Timestamped {
  id: string;
  candidate_id: string;
  jd_id: string;
  jd_title?: string;
  org_name?: string;
  stage: ApplicationStage;
  match_score?: number;
  rescored?: boolean; // FR-R-034 "CV updated" badge
  interview_count?: number;
  has_feedback?: boolean;
  applied_at: string;
}

export interface ShortlistAction extends Timestamped {
  id: string;
  application_id: string;
  recruiter_id: string;
  action: 'APPROVED' | 'REJECTED' | 'HOLD';
  note?: string;
}

export interface ConsentLog extends Timestamped {
  id: string;
  candidate_id: string;
  type: ConsentType;
  status: ConsentStatus;
  channel: 'EMAIL' | 'SMS' | 'WEB' | 'VOICE';
  ip?: string;
  user_agent?: string;
  version: string;
}

export interface PreCallGate {
  voice_consent: boolean;
  not_on_dnc: boolean;
  time_window: boolean;
  platform_throttle: boolean;
  org_throttle: boolean;
}

export interface VoiceCampaign extends Timestamped {
  id: string;
  org_id: string;
  jd_id: string;
  jd_title?: string;
  name: string;
  status: CampaignStatus;
  calls_per_hour: number; // 10–50
  total_candidates: number;
  completed_calls: number;
  skipped_calls: number;
  consenting_count: number;
}

export interface CallLog extends Timestamped {
  id: string;
  campaign_id: string;
  candidate_id: string;
  candidate_name: string;
  status: CallStatus;
  skip_reason?: string | null;
  gate?: PreCallGate;
  duration_sec?: number;
  risk_level?: RiskLevel;
  intent_confidence?: number;
  outcome?: string;
  transcript_available?: boolean;
}

export interface EmailCampaign extends Timestamped {
  id: string;
  org_id: string;
  jd_id?: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  total_recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
}

export interface Interview extends Timestamped {
  id: string;
  application_id: string;
  candidate_id: string;
  candidate_name?: string;
  jd_title?: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduled_at: string;
  duration_min: number;
  platform: 'GOOGLE_MEET' | 'ZOOM' | 'TEAMS' | 'PHONE' | 'ONSITE';
  interviewer_ids: string[];
  interviewers?: string[];
  join_url?: string;
  reschedule_count: number;
  prep_checklist?: { item: string; done: boolean }[];
}

export interface FeedbackScorecard extends Timestamped {
  id: string;
  interview_id: string;
  reviewer_id: string;
  technical: number; // 1–5
  communication: number;
  problem_solving: number;
  culture_fit: number;
  recommendation: 'STRONG_YES' | 'YES' | 'NO' | 'STRONG_NO';
  comments?: string;
  overdue?: boolean;
}

export interface Offer extends Timestamped {
  id: string;
  application_id: string;
  candidate_name?: string;
  status: OfferStatus;
  base_salary: number;
  currency: string;
  joining_date: string;
  valid_until: string;
  approver_id?: string | null;
}

export interface Notification extends Timestamped {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  action_route?: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name?: string;
  action: string;
  resource: string;
  resource_id?: string;
  org_id?: string | null;
  ip?: string;
  created_at: string;
}

export interface AiMonitorRow {
  function: AiFunction;
  accuracy: number; // 0–1
  hallucination_rate: number; // 0–1
  override_rate: number; // 0–1
  p95_latency_ms: number;
  token_cost_usd: number;
  calls: number;
}

// ---- Dashboards & analytics ---------------------------------------------

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface TrendPoint {
  label: string; // e.g. "Jan"
  value: number;
}

export interface CandidateDashboard {
  funnel: FunnelStage[];
  ats_trend: TrendPoint[];
  completeness: number;
  missing_fields: string[];
  upcoming_interviews: Interview[];
  recommendation_count: number;
  saved_jobs_expiring: number;
}

export interface RecruiterKpis {
  time_to_hire: number; // days
  time_to_first_interview: number;
  match_accuracy: number; // %
  pipeline_conversion: number; // %
  voice_response_rate: number; // %
  email_open_rate: number; // %
  cost_per_placement: number;
  currency: string;
}

export interface RecruiterDashboard {
  kpis: RecruiterKpis;
  hiring_trends: TrendPoint[];
  funnel: FunnelStage[];
  top_jds: { jd_id: string; title: string; applicants: number; hires: number }[];
}

export interface MarketRole {
  role: string;
  demand_index: number; // 0–100
  avg_salary: number;
  currency: string;
  open_roles: number;
  yoy_growth: number; // %
}

export interface HeatmapCell {
  location: string;
  skill: string;
  intensity: number; // 0–100
}

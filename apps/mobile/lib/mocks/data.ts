// ============================================================================
// In-memory seed dataset powering the mock API layer. This lets the universal
// app run end-to-end in the browser / simulator with NO backend services.
// Flip EXPO_PUBLIC_USE_MOCKS=false to hit the real microservices instead.
// All shapes conform to @jobhunter/types so swapping to live APIs is seamless.
// ============================================================================
import {
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
  type AiMonitorRow,
  type Application,
  type AuditLog,
  type Candidate,
  type CandidateDashboard,
  type CallLog,
  type ConsentLog,
  type CvVersion,
  type EmailCampaign,
  type Interview,
  type JobDescription,
  type Notification,
  type Offer,
  type Organisation,
  type RecruiterDashboard,
  type MarketRole,
  type User,
  type VoiceCampaign,
} from '@jobhunter/types';

const ORG_ID = 'org_acme';
const now = '2026-06-21T09:00:00.000Z';

export const orgs: Organisation[] = [
  {
    id: ORG_ID,
    name: 'Acme Technologies',
    status: OrgStatus.ACTIVE,
    tier: 'ENTERPRISE',
    seats_total: 25,
    seats_filled: 18,
    dpa_signed_at: '2026-01-10T00:00:00.000Z',
    region: 'ap-south-1',
    created_at: '2025-12-01T00:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'org_globex',
    name: 'Globex Corp',
    status: OrgStatus.DPA_PENDING,
    tier: 'GROWTH',
    seats_total: 10,
    seats_filled: 3,
    dpa_signed_at: null,
    region: 'ap-south-1',
    created_at: '2026-05-18T00:00:00.000Z',
    updated_at: now,
  },
  {
    id: 'org_initech',
    name: 'Initech Solutions',
    status: OrgStatus.PROVISIONED,
    tier: 'STARTER',
    seats_total: 5,
    seats_filled: 2,
    dpa_signed_at: '2026-06-01T00:00:00.000Z',
    region: 'ap-south-1',
    created_at: '2026-05-30T00:00:00.000Z',
    updated_at: now,
  },
];

// ---- Users (one per role for login switching) ----------------------------
export const users: Record<string, User & { password: string }> = {
  candidate: {
    id: 'usr_cand_1',
    email: 'aarav@example.com',
    full_name: 'Aarav Sharma',
    role: Role.CANDIDATE,
    status: UserStatus.ACTIVE,
    org_id: null,
    mfa_enabled: false,
    last_login_at: now,
    created_at: '2026-03-01T00:00:00.000Z',
    updated_at: now,
    password: 'Password@123',
  },
  recruiter: {
    id: 'usr_rec_1',
    email: 'priya@acme.com',
    full_name: 'Priya Nair',
    role: Role.RECRUITER,
    status: UserStatus.ACTIVE,
    org_id: ORG_ID,
    mfa_enabled: true,
    last_login_at: now,
    created_at: '2026-01-15T00:00:00.000Z',
    updated_at: now,
    password: 'Password@123',
  },
  admin: {
    id: 'usr_admin_1',
    email: 'root@jobhunter.io',
    full_name: 'Sam Okafor',
    role: Role.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    org_id: null,
    mfa_enabled: true,
    last_login_at: now,
    created_at: '2025-11-01T00:00:00.000Z',
    updated_at: now,
    password: 'Password@123',
  },
};

// ---- Candidate (logged-in job seeker) ------------------------------------
export const myCandidate: Candidate = {
  id: 'cand_1',
  master_id: 'CAND_000001',
  user_id: 'usr_cand_1',
  full_name: 'Aarav Sharma',
  email: 'aarav@example.com',
  phone: '+919812345678',
  timezone: 'Asia/Kolkata',
  headline: 'Senior Java Developer · Spring Boot · Microservices',
  location: 'Bengaluru, IN',
  stage: CandidateStage.DISCOVERABLE,
  skills: [
    { name: 'Java', level: 'EXPERT', years: 7, confidence: 0.98 },
    { name: 'Spring Boot', level: 'EXPERT', years: 6, confidence: 0.95 },
    { name: 'Microservices', level: 'ADVANCED', years: 5, confidence: 0.91 },
    { name: 'Kafka', level: 'ADVANCED', years: 4, confidence: 0.88 },
    { name: 'PostgreSQL', level: 'ADVANCED', years: 6, confidence: 0.9 },
    { name: 'Kubernetes', level: 'INTERMEDIATE', years: 3, confidence: 0.74 },
    { name: 'AWS', level: 'INTERMEDIATE', years: 4, confidence: 0.82 },
  ],
  experience_years: 7,
  experiences: [
    { company: 'Fintech Labs', title: 'Senior Java Developer', start: '2022-04-01', end: null, summary: 'Led payments microservices on Spring Boot + Kafka.' },
    { company: 'Infosys', title: 'Java Developer', start: '2019-06-01', end: '2022-03-31', summary: 'Built REST APIs for banking clients.' },
    { company: 'TCS', title: 'Associate Engineer', start: '2017-07-01', end: '2019-05-31', summary: 'Core Java + JSP maintenance.' },
  ],
  education: [{ institution: 'VIT Vellore', degree: 'B.Tech', field: 'Computer Science', year: 2017 }],
  preferences: {
    target_roles: ['Senior Java Developer', 'Backend Engineer', 'Staff Engineer'],
    target_locations: ['Bengaluru', 'Remote', 'Hyderabad'],
    min_salary: 2800000,
    currency: 'INR',
    work_mode: WorkMode.HYBRID,
    notice_pref: 60,
  },
  ats_score: 78,
  completeness: 86,
  source: 'PLATFORM',
  voice_enrolled: true,
};

export const cvVersions: CvVersion[] = [
  { id: 'cv_3', candidate_id: 'cand_1', filename: 'Aarav_Sharma_2026.pdf', status: CvStatus.ACTIVE, rebuild_source: RebuildSource.ORIGINAL, ats_score: 78, size_bytes: 248_000, created_at: '2026-05-20T00:00:00.000Z', updated_at: now, preview_url: 'https://example.com/cv/3' },
  { id: 'cv_2', candidate_id: 'cand_1', filename: 'Aarav_AI_for_Staff_Eng.pdf', status: CvStatus.INACTIVE, rebuild_source: RebuildSource.AI, source_jd_id: 'jd_2', ats_score: 88, size_bytes: 262_000, created_at: '2026-05-22T00:00:00.000Z', updated_at: now },
  { id: 'cv_1', candidate_id: 'cand_1', filename: 'Aarav_Sharma_2024.pdf', status: CvStatus.INACTIVE, rebuild_source: RebuildSource.ORIGINAL, ats_score: 64, size_bytes: 201_000, created_at: '2024-08-01T00:00:00.000Z', updated_at: '2024-08-01T00:00:00.000Z' },
];

// ---- Jobs ----------------------------------------------------------------
export const jds: JobDescription[] = [
  { id: 'jd_1', org_id: ORG_ID, title: 'Senior Java Developer', status: JdStatus.ACTIVE, location: 'Bengaluru, IN', work_mode: WorkMode.HYBRID, exp_min: 5, exp_max: 9, salary_min: 2500000, salary_max: 3500000, currency: 'INR', skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'AWS'], description: 'Own core payment services.', expected_close_date: '2026-07-31T00:00:00.000Z', priority_matrix: { skills: 40, experience: 25, notice: 10, location: 15, salary: 5, cert: 5 }, created_by: 'usr_rec_1', approved_by: 'usr_hm_1', applicant_count: 42, created_at: '2026-06-01T00:00:00.000Z', updated_at: now },
  { id: 'jd_2', org_id: ORG_ID, title: 'Staff Backend Engineer', status: JdStatus.ACTIVE, location: 'Remote, IN', work_mode: WorkMode.REMOTE, exp_min: 8, salary_min: 4000000, salary_max: 6000000, currency: 'INR', skills: ['Java', 'Distributed Systems', 'Kubernetes', 'Kafka', 'System Design'], description: 'Lead platform architecture.', expected_close_date: '2026-08-15T00:00:00.000Z', created_by: 'usr_rec_1', applicant_count: 28, created_at: '2026-06-05T00:00:00.000Z', updated_at: now },
  { id: 'jd_3', org_id: ORG_ID, title: 'Python Data Engineer', status: JdStatus.ACTIVE, location: 'Hyderabad, IN', work_mode: WorkMode.HYBRID, exp_min: 4, salary_min: 2200000, salary_max: 3200000, currency: 'INR', skills: ['Python', 'Airflow', 'Spark', 'AWS', 'SQL'], description: 'Build ETL pipelines.', expected_close_date: '2026-07-20T00:00:00.000Z', created_by: 'usr_rec_1', applicant_count: 35, created_at: '2026-06-03T00:00:00.000Z', updated_at: now },
  { id: 'jd_4', org_id: ORG_ID, title: 'Frontend Developer (React)', status: JdStatus.REVIEW, location: 'Pune, IN', work_mode: WorkMode.ONSITE, exp_min: 3, salary_min: 1800000, salary_max: 2600000, currency: 'INR', skills: ['React', 'TypeScript', 'NativeWind', 'Redux'], description: 'Own the design system.', expected_close_date: '2026-08-01T00:00:00.000Z', created_by: 'usr_rec_1', applicant_count: 0, ai_extracted: true, extraction_confidence: 0.83, created_at: '2026-06-18T00:00:00.000Z', updated_at: now },
  { id: 'jd_5', org_id: ORG_ID, title: '.NET Developer', status: JdStatus.DRAFT, location: 'Chennai, IN', work_mode: WorkMode.HYBRID, exp_min: 4, skills: ['.NET', 'C#', 'Azure'], expected_close_date: '2026-08-30T00:00:00.000Z', created_by: 'usr_rec_1', applicant_count: 0, created_at: '2026-06-19T00:00:00.000Z', updated_at: now },
];

// ---- Applications (candidate side) ---------------------------------------
export const applications: Application[] = [
  { id: 'app_1', candidate_id: 'cand_1', jd_id: 'jd_1', jd_title: 'Senior Java Developer', org_name: 'Acme Technologies', stage: ApplicationStage.INTERVIEW, match_score: 91, interview_count: 1, has_feedback: false, applied_at: '2026-06-10T00:00:00.000Z', created_at: '2026-06-10T00:00:00.000Z', updated_at: now },
  { id: 'app_2', candidate_id: 'cand_1', jd_id: 'jd_2', jd_title: 'Staff Backend Engineer', org_name: 'Acme Technologies', stage: ApplicationStage.SHORTLISTED, match_score: 84, rescored: true, applied_at: '2026-06-12T00:00:00.000Z', created_at: '2026-06-12T00:00:00.000Z', updated_at: now },
  { id: 'app_3', candidate_id: 'cand_1', jd_id: 'jd_3', jd_title: 'Python Data Engineer', org_name: 'Acme Technologies', stage: ApplicationStage.REJECTED, match_score: 58, applied_at: '2026-05-28T00:00:00.000Z', created_at: '2026-05-28T00:00:00.000Z', updated_at: now },
  { id: 'app_4', candidate_id: 'cand_1', jd_id: 'jd_6', jd_title: 'Backend Engineer', org_name: 'Globex Corp', stage: ApplicationStage.OFFER, match_score: 88, applied_at: '2026-05-20T00:00:00.000Z', created_at: '2026-05-20T00:00:00.000Z', updated_at: now },
];

// ---- Pipeline candidates (recruiter side, for jd_1) ----------------------
function pc(id: string, name: string, stage: ApplicationStage, score: number, source: Candidate['source'], consent: boolean): Application & { candidate: Partial<Candidate>; consented: boolean } {
  return {
    id: `pipe_${id}`,
    candidate_id: id,
    jd_id: 'jd_1',
    jd_title: 'Senior Java Developer',
    stage,
    match_score: score,
    applied_at: '2026-06-08T00:00:00.000Z',
    created_at: '2026-06-08T00:00:00.000Z',
    updated_at: now,
    consented: consent,
    candidate: { master_id: `CAND_${id}`, full_name: name, headline: 'Java · Spring · Kafka', location: 'Bengaluru', experience_years: 5 + (score % 5), source, email_masked: source !== 'PLATFORM' && !consent, phone_masked: source !== 'PLATFORM' && !consent },
  };
}
export const pipeline = [
  pc('c01', 'Rohan Mehta', ApplicationStage.SOURCED, 72, 'LINKEDIN', false),
  pc('c02', 'Sneha Iyer', ApplicationStage.SOURCED, 69, 'NAUKRI', false),
  pc('c03', 'Vikram Rao', ApplicationStage.SHORTLISTED, 88, 'PLATFORM', true),
  pc('c04', 'Ananya Gupta', ApplicationStage.SHORTLISTED, 85, 'PLATFORM', true),
  pc('c05', 'Karthik N', ApplicationStage.SCREENING, 81, 'PLATFORM', true),
  pc('c06', 'Divya Menon', ApplicationStage.SCREENING, 79, 'INDEED', true),
  pc('c07', 'Arjun Das', ApplicationStage.INTERVIEW, 90, 'PLATFORM', true),
  pc('c08', 'Meera Pillai', ApplicationStage.INTERVIEW, 86, 'PLATFORM', true),
  pc('c09', 'Sahil Khan', ApplicationStage.OFFER, 92, 'PLATFORM', true),
  pc('c10', 'Pooja Shah', ApplicationStage.HIRED, 94, 'PLATFORM', true),
];

// ---- Voice + email campaigns ---------------------------------------------
export const voiceCampaigns: VoiceCampaign[] = [
  { id: 'vc_1', org_id: ORG_ID, jd_id: 'jd_1', jd_title: 'Senior Java Developer', name: 'Java SDE Outreach — Wave 1', status: CampaignStatus.LAUNCHED, calls_per_hour: 30, total_candidates: 24, completed_calls: 14, skipped_calls: 4, consenting_count: 18, created_at: '2026-06-15T00:00:00.000Z', updated_at: now },
  { id: 'vc_2', org_id: ORG_ID, jd_id: 'jd_2', jd_title: 'Staff Backend Engineer', name: 'Staff Eng Screening', status: CampaignStatus.DRAFT, calls_per_hour: 20, total_candidates: 12, completed_calls: 0, skipped_calls: 0, consenting_count: 9, created_at: '2026-06-19T00:00:00.000Z', updated_at: now },
];

export const callLogs: CallLog[] = [
  { id: 'call_1', campaign_id: 'vc_1', candidate_id: 'c07', candidate_name: 'Arjun Das', status: CallStatus.COMPLETED, duration_sec: 312, risk_level: RiskLevel.LOW, intent_confidence: 0.86, outcome: 'Interested — interview booked', transcript_available: true, gate: { voice_consent: true, not_on_dnc: true, time_window: true, platform_throttle: true, org_throttle: true }, created_at: '2026-06-16T10:00:00.000Z', updated_at: now },
  { id: 'call_2', campaign_id: 'vc_1', candidate_id: 'c08', candidate_name: 'Meera Pillai', status: CallStatus.COMPLETED, duration_sec: 240, risk_level: RiskLevel.MEDIUM, intent_confidence: 0.61, outcome: 'Needs follow-up', transcript_available: true, gate: { voice_consent: true, not_on_dnc: true, time_window: true, platform_throttle: true, org_throttle: true }, created_at: '2026-06-16T11:00:00.000Z', updated_at: now },
  { id: 'call_3', campaign_id: 'vc_1', candidate_id: 'c01', candidate_name: 'Rohan Mehta', status: CallStatus.SKIPPED, skip_reason: 'No VOICE_AI consent on record', gate: { voice_consent: false, not_on_dnc: true, time_window: true, platform_throttle: true, org_throttle: true }, created_at: '2026-06-16T11:05:00.000Z', updated_at: now },
  { id: 'call_4', campaign_id: 'vc_1', candidate_id: 'c02', candidate_name: 'Sneha Iyer', status: CallStatus.SKIPPED, skip_reason: 'Number on TRAI DNC registry', gate: { voice_consent: true, not_on_dnc: false, time_window: true, platform_throttle: true, org_throttle: true }, created_at: '2026-06-16T11:10:00.000Z', updated_at: now },
  { id: 'call_5', campaign_id: 'vc_1', candidate_id: 'c09', candidate_name: 'Sahil Khan', status: CallStatus.COMPLETED, duration_sec: 410, risk_level: RiskLevel.HIGH, intent_confidence: 0.44, outcome: 'Flagged — inconsistent answers', transcript_available: true, gate: { voice_consent: true, not_on_dnc: true, time_window: true, platform_throttle: true, org_throttle: true }, created_at: '2026-06-16T12:00:00.000Z', updated_at: now },
];

export const emailCampaigns: EmailCampaign[] = [
  { id: 'ec_1', org_id: ORG_ID, jd_id: 'jd_1', name: 'Consent + Intro — Java SDE', subject: 'Exciting Senior Java role at Acme', status: CampaignStatus.LAUNCHED, total_recipients: 60, sent: 60, opened: 38, clicked: 21, unsubscribed: 2, created_at: '2026-06-14T00:00:00.000Z', updated_at: now },
  { id: 'ec_2', org_id: ORG_ID, name: 'Talent Pool Nurture — Q3', subject: 'New backend opportunities', status: CampaignStatus.DRAFT, total_recipients: 0, sent: 0, opened: 0, clicked: 0, unsubscribed: 0, created_at: '2026-06-19T00:00:00.000Z', updated_at: now },
];

// ---- Interviews ----------------------------------------------------------
export const interviews: Interview[] = [
  { id: 'int_1', application_id: 'app_1', candidate_id: 'cand_1', candidate_name: 'Aarav Sharma', jd_title: 'Senior Java Developer', type: InterviewType.TECHNICAL, status: InterviewStatus.SCHEDULED, scheduled_at: '2026-06-24T09:30:00.000Z', duration_min: 60, platform: 'GOOGLE_MEET', interviewer_ids: ['usr_rec_1'], interviewers: ['Priya Nair', 'Dev Patel'], join_url: 'https://meet.google.com/abc-defg-hij', reschedule_count: 0, prep_checklist: [{ item: 'Review system design basics', done: true }, { item: 'Prepare STAR examples', done: false }, { item: 'Test camera & mic', done: false }], created_at: '2026-06-18T00:00:00.000Z', updated_at: now },
  { id: 'int_2', application_id: 'pipe_c07', candidate_id: 'c07', candidate_name: 'Arjun Das', jd_title: 'Senior Java Developer', type: InterviewType.TECHNICAL, status: InterviewStatus.CONFIRMED, scheduled_at: '2026-06-23T11:00:00.000Z', duration_min: 45, platform: 'ZOOM', interviewer_ids: ['usr_rec_1'], interviewers: ['Priya Nair'], reschedule_count: 1, created_at: '2026-06-17T00:00:00.000Z', updated_at: now },
  { id: 'int_3', application_id: 'pipe_c08', candidate_id: 'c08', candidate_name: 'Meera Pillai', jd_title: 'Senior Java Developer', type: InterviewType.HR, status: InterviewStatus.COMPLETED, scheduled_at: '2026-06-19T14:00:00.000Z', duration_min: 30, platform: 'PHONE', interviewer_ids: ['usr_rec_1'], reschedule_count: 0, created_at: '2026-06-15T00:00:00.000Z', updated_at: now },
];

export const offers: Offer[] = [
  { id: 'off_1', application_id: 'pipe_c09', candidate_name: 'Sahil Khan', status: OfferStatus.SENT, base_salary: 3200000, currency: 'INR', joining_date: '2026-08-01T00:00:00.000Z', valid_until: '2026-07-05T00:00:00.000Z', approver_id: 'usr_hm_1', created_at: '2026-06-18T00:00:00.000Z', updated_at: now },
  { id: 'off_2', application_id: 'app_4', candidate_name: 'Aarav Sharma', status: OfferStatus.SENT, base_salary: 3000000, currency: 'INR', joining_date: '2026-08-15T00:00:00.000Z', valid_until: '2026-07-01T00:00:00.000Z', created_at: '2026-06-17T00:00:00.000Z', updated_at: now },
];

export const consentLogs: ConsentLog[] = [
  { id: 'con_1', candidate_id: 'c07', type: ConsentType.VOICE_AI, status: ConsentStatus.GRANTED, channel: 'EMAIL', version: 'v1.2', created_at: '2026-06-13T00:00:00.000Z', updated_at: now },
  { id: 'con_2', candidate_id: 'c07', type: ConsentType.RECORDING, status: ConsentStatus.GRANTED, channel: 'EMAIL', version: 'v1.2', created_at: '2026-06-13T00:00:00.000Z', updated_at: now },
  { id: 'con_3', candidate_id: 'c01', type: ConsentType.VOICE_AI, status: ConsentStatus.PENDING, channel: 'EMAIL', version: 'v1.2', created_at: '2026-06-15T00:00:00.000Z', updated_at: now },
];

// ---- Notifications -------------------------------------------------------
export const notifications: Notification[] = [
  { id: 'n1', user_id: 'usr_cand_1', type: NotificationType.INTERVIEW, title: 'Interview scheduled', body: 'Technical interview for Senior Java Developer on 24 Jun, 3:00 PM IST.', read: false, action_route: '/(candidate)/interviews', created_at: '2026-06-20T10:00:00.000Z', updated_at: now },
  { id: 'n2', user_id: 'usr_cand_1', type: NotificationType.MATCH, title: '5 new job matches', body: 'New roles match your Java + Kafka profile.', read: false, action_route: '/(candidate)/jobs', created_at: '2026-06-20T08:00:00.000Z', updated_at: now },
  { id: 'n3', user_id: 'usr_cand_1', type: NotificationType.APPLICATION_UPDATE, title: 'Application shortlisted', body: 'Staff Backend Engineer @ Acme — you were shortlisted.', read: true, action_route: '/(candidate)/applications', created_at: '2026-06-18T08:00:00.000Z', updated_at: now },
];

// ---- Candidate dashboard -------------------------------------------------
export const candidateDashboard: CandidateDashboard = {
  funnel: [
    { stage: 'Applied', count: 12 },
    { stage: 'Viewed', count: 9 },
    { stage: 'Shortlisted', count: 5 },
    { stage: 'Interview', count: 2 },
    { stage: 'Offer', count: 1 },
  ],
  ats_trend: [
    { label: 'Feb', value: 61 },
    { label: 'Mar', value: 64 },
    { label: 'Apr', value: 70 },
    { label: 'May', value: 74 },
    { label: 'Jun', value: 78 },
  ],
  completeness: 86,
  missing_fields: ['Certifications', 'Portfolio URL'],
  upcoming_interviews: [interviews[0]!],
  recommendation_count: 14,
  saved_jobs_expiring: 2,
};

// ---- Recruiter dashboard + market intel ----------------------------------
export const recruiterDashboard: RecruiterDashboard = {
  kpis: {
    time_to_hire: 24,
    time_to_first_interview: 6,
    match_accuracy: 82,
    pipeline_conversion: 31,
    voice_response_rate: 58,
    email_open_rate: 63,
    cost_per_placement: 48000,
    currency: 'INR',
  },
  hiring_trends: [
    { label: 'Jan', value: 4 },
    { label: 'Feb', value: 6 },
    { label: 'Mar', value: 5 },
    { label: 'Apr', value: 8 },
    { label: 'May', value: 7 },
    { label: 'Jun', value: 9 },
  ],
  funnel: [
    { stage: 'Sourced', count: 240 },
    { stage: 'Shortlisted', count: 96 },
    { stage: 'Screening', count: 58 },
    { stage: 'Interview', count: 32 },
    { stage: 'Offer', count: 14 },
    { stage: 'Hired', count: 9 },
  ],
  top_jds: [
    { jd_id: 'jd_1', title: 'Senior Java Developer', applicants: 42, hires: 3 },
    { jd_id: 'jd_3', title: 'Python Data Engineer', applicants: 35, hires: 2 },
    { jd_id: 'jd_2', title: 'Staff Backend Engineer', applicants: 28, hires: 1 },
  ],
};

export const marketRoles: MarketRole[] = [
  { role: 'Senior Java Developer', demand_index: 88, avg_salary: 3000000, currency: 'INR', open_roles: 1240, yoy_growth: 12 },
  { role: 'Python Data Engineer', demand_index: 92, avg_salary: 2800000, currency: 'INR', open_roles: 1560, yoy_growth: 19 },
  { role: 'Frontend Developer', demand_index: 75, avg_salary: 2200000, currency: 'INR', open_roles: 980, yoy_growth: 7 },
  { role: '.NET Developer', demand_index: 64, avg_salary: 2100000, currency: 'INR', open_roles: 610, yoy_growth: 3 },
  { role: 'Staff Backend Engineer', demand_index: 81, avg_salary: 5000000, currency: 'INR', open_roles: 340, yoy_growth: 15 },
];

// ---- Admin: audit + AI monitoring ----------------------------------------
export const adminUsers: User[] = [
  users.candidate, users.recruiter, users.admin,
  { id: 'usr_hm_1', email: 'dev.hm@acme.com', full_name: 'Dev Patel', role: Role.HIRING_MANAGER, status: UserStatus.ACTIVE, org_id: ORG_ID, mfa_enabled: true, created_at: '2026-02-01T00:00:00.000Z', updated_at: now },
  { id: 'usr_view_1', email: 'lina.view@acme.com', full_name: 'Lina George', role: Role.VIEWER, status: UserStatus.ACTIVE, org_id: ORG_ID, mfa_enabled: false, created_at: '2026-03-12T00:00:00.000Z', updated_at: now },
  { id: 'usr_orgadm_1', email: 'admin@globex.com', full_name: 'Tara Bose', role: Role.ORG_ADMIN, status: UserStatus.INVITED, org_id: 'org_globex', mfa_enabled: false, created_at: '2026-06-10T00:00:00.000Z', updated_at: now },
];

export const auditLogs: AuditLog[] = [
  { id: 'aud_1', actor_id: 'usr_rec_1', actor_name: 'Priya Nair', action: 'pipeline.stage_changed', resource: 'application', resource_id: 'pipe_c07', org_id: ORG_ID, ip: '10.2.0.4', created_at: '2026-06-20T12:30:00.000Z' },
  { id: 'aud_2', actor_id: 'usr_rec_1', actor_name: 'Priya Nair', action: 'voice_campaign.launched', resource: 'voice_campaign', resource_id: 'vc_1', org_id: ORG_ID, ip: '10.2.0.4', created_at: '2026-06-15T09:00:00.000Z' },
  { id: 'aud_3', actor_id: 'usr_admin_1', actor_name: 'Sam Okafor', action: 'candidate_pii.read', resource: 'candidate', resource_id: 'c07', org_id: ORG_ID, ip: '10.0.0.9', created_at: '2026-06-19T15:00:00.000Z' },
  { id: 'aud_4', actor_id: 'usr_admin_1', actor_name: 'Sam Okafor', action: 'gdpr.erasure_requested', resource: 'candidate', resource_id: 'c20', ip: '10.0.0.9', created_at: '2026-06-18T11:00:00.000Z' },
];

export const aiMonitor: AiMonitorRow[] = [
  { function: AiFunction.RESUME_PARSING, accuracy: 0.94, hallucination_rate: 0.02, override_rate: 0.08, p95_latency_ms: 4200, token_cost_usd: 132.4, calls: 1820 },
  { function: AiFunction.JD_PARSING, accuracy: 0.91, hallucination_rate: 0.04, override_rate: 0.12, p95_latency_ms: 3100, token_cost_usd: 88.1, calls: 640 },
  { function: AiFunction.CANDIDATE_RANKING, accuracy: 0.86, hallucination_rate: 0.01, override_rate: 0.18, p95_latency_ms: 4800, token_cost_usd: 210.9, calls: 2400 },
  { function: AiFunction.VOICE_SCREENING, accuracy: 0.83, hallucination_rate: 0.05, override_rate: 0.22, p95_latency_ms: 9500, token_cost_usd: 540.2, calls: 310 },
  { function: AiFunction.ATS_SCORING, accuracy: 0.97, hallucination_rate: 0.0, override_rate: 0.03, p95_latency_ms: 1200, token_cost_usd: 41.0, calls: 3100 },
];

// ============================================================================
// Mock REST router. Resolves {method,url,body} against the in-memory seed store
// so RTK Query works without any backend. Mutations persist for the session.
// Path matching is intentionally simple (prefix + param extraction).
// ============================================================================
import {
  ApplicationStage,
  CampaignStatus,
  CvStatus,
  JdStatus,
  OfferStatus,
  RebuildSource,
  Role,
  type ApiError,
  type LoginResult,
} from '@jobhunter/types';
import * as db from './data';

export interface MockRequest {
  url: string;
  method: string;
  body?: unknown;
}

export class MockHttpError extends Error {
  constructor(public status: number, public problem: ApiError) {
    super(problem.title);
  }
}

function problem(status: number, title: string, detail?: string): MockHttpError {
  return new MockHttpError(status, {
    type: `https://jobhunter.io/errors/${status}`,
    title,
    status,
    detail,
  });
}

/** /api/v1/jds/jd_1/priority-matrix → ['jds','jd_1','priority-matrix'] */
function segments(url: string): string[] {
  const path = url.split('?')[0]!.replace(/^.*\/api\/v1\//, '').replace(/^\//, '');
  return path.split('/').filter(Boolean);
}

function query(url: string): URLSearchParams {
  const q = url.split('?')[1] ?? '';
  return new URLSearchParams(q);
}

// in-memory mutable copies for collections that get written
const state = {
  cvVersions: [...db.cvVersions],
  jds: [...db.jds],
  applications: [...db.applications],
  pipeline: [...db.pipeline],
  voiceCampaigns: [...db.voiceCampaigns],
  emailCampaigns: [...db.emailCampaigns],
  interviews: [...db.interviews],
  notifications: [...db.notifications],
  offers: [...db.offers],
  candidate: { ...db.myCandidate },
};

let idCounter = 1000;
const newId = (p: string) => `${p}_${++idCounter}`;
const nowIso = () => new Date().toISOString();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mockRequest({ url, method, body }: MockRequest): Promise<any> {
  const seg = segments(url);
  const m = method.toUpperCase();
  const b = (body ?? {}) as Record<string, any>;
  const [root, a, c, d] = seg;

  // ---- AUTH --------------------------------------------------------------
  if (root === 'auth') {
    if (a === 'login' && m === 'POST') {
      const entry = Object.values(db.users).find((u) => u.email === b.email);
      if (!entry || b.password !== entry.password) throw problem(401, 'Invalid credentials');
      const { password, ...user } = entry;
      if (user.mfa_enabled) {
        const result: LoginResult = { mfa_required: true, temp_token: `temp_${user.id}` };
        return result;
      }
      return { mfa_required: false, tokens: tokensFor(user.id), user } satisfies LoginResult & { user: unknown };
    }
    if (a === 'mfa' && c === 'verify' && m === 'POST') {
      const userId = String(b.temp_token ?? '').replace('temp_', '');
      const entry = Object.values(db.users).find((u) => u.id === userId);
      if (!entry || String(b.totp_code).length !== 6) throw problem(401, 'Invalid TOTP code');
      const { password, ...user } = entry;
      return { mfa_required: false, tokens: tokensFor(user.id), user };
    }
    if (a === 'register' && m === 'POST') {
      return { ok: true, message: 'Verification OTP sent', email: b.email };
    }
    if (a === 'verify-email' && m === 'POST') {
      const { password, ...user } = db.users.candidate;
      if (String(b.otp).length !== 6) throw problem(400, 'Invalid OTP');
      return { tokens: tokensFor(user.id), user };
    }
    if (a === 'mfa' && c === 'setup' && m === 'POST') {
      return { provisioning_uri: 'otpauth://totp/JobHunter:user?secret=JBSWY3DPEHPK3PXP&issuer=JobHunter', recovery_codes: ['A1B2-C3D4', 'E5F6-G7H8', 'I9J0-K1L2'] };
    }
    if (a === 'logout') return { ok: true };
    if (a === 'refresh' && m === 'POST') return tokensFor('refreshed');
  }

  // ---- CANDIDATE (job seeker self) ---------------------------------------
  if (root === 'candidates' && a === 'me') {
    if (!c && m === 'GET') return state.candidate;
    if (!c && m === 'PATCH') {
      state.candidate = { ...state.candidate, ...b, updated_at: nowIso() };
      return state.candidate;
    }
    if (c === 'completeness') return { score: state.candidate.completeness ?? 86, missing_fields: [{ field: 'Certifications', contribution: 5 }, { field: 'Portfolio URL', contribution: 5 }] };
    if (c === 'dashboard') return db.candidateDashboard;
    if (c === 'preferences') {
      if (m === 'PUT') { state.candidate.preferences = b as any; return state.candidate.preferences; }
      return state.candidate.preferences;
    }
    if (c === 'settings') {
      if (m === 'POST' || m === 'PUT') return { ok: true, settings: b };
      return { email: state.candidate.email, email_notifications: true, job_alerts: true, interview_reminders: true, voice_ai_consent: state.candidate.voice_enrolled ?? false, profile_visible: true };
    }
    if (c === 'onboarding' && m === 'POST') {
      state.candidate = { ...state.candidate, ...b, updated_at: nowIso() };
      return { ok: true, candidate: state.candidate };
    }
    if (c === 'cv') {
      if (m === 'GET') return state.cvVersions;
      if (m === 'POST') {
        const v = { id: newId('cv'), candidate_id: 'cand_1', filename: b.filename ?? 'upload.pdf', status: CvStatus.PARSING, rebuild_source: RebuildSource.ORIGINAL, size_bytes: b.size_bytes ?? 210000, created_at: nowIso(), updated_at: nowIso() };
        state.cvVersions.unshift(v);
        return v;
      }
    }
  }
  if (root === 'candidates' && a === 'me' && c === 'cv' && d) {
    const idx = state.cvVersions.findIndex((v) => v.id === d);
    if (idx < 0) throw problem(404, 'CV version not found');
    if (seg[4] === 'activate' && m === 'PATCH') {
      state.cvVersions.forEach((v) => (v.status = CvStatus.INACTIVE));
      state.cvVersions[idx]!.status = CvStatus.ACTIVE;
      return state.cvVersions[idx];
    }
    if (m === 'DELETE') {
      if (state.cvVersions[idx]!.status === CvStatus.ACTIVE) throw problem(400, 'Cannot delete the ACTIVE CV');
      state.cvVersions.splice(idx, 1);
      return { ok: true };
    }
  }

  // ---- RESUME AI ----------------------------------------------------------
  if (root === 'resume-ai') {
    if (a === 'score') return { score: state.candidate.ats_score ?? 78, breakdown: { skills: 82, keywords: 71, experience: 85, formatting: 74 }, computed_at: nowIso() };
    if (a === 'suggestions') return resumeSuggestions;
    if (a === 'recalculate' && m === 'POST') return { job_id: newId('job'), status: 'QUEUED' };
    if (a === 'skill-gap') return { critical: ['GraphQL', 'gRPC'], important: ['Terraform', 'Redis'], strengths: ['Java', 'Spring Boot', 'Kafka', 'Microservices'] };
    if (a === 'rebuild' && m === 'POST') {
      const v = { id: newId('cv'), candidate_id: 'cand_1', filename: `AI_Rebuild_for_${c}.pdf`, status: CvStatus.INACTIVE, rebuild_source: RebuildSource.AI, source_jd_id: c, ats_score: 90, size_bytes: 260000, created_at: nowIso(), updated_at: nowIso() };
      state.cvVersions.unshift(v);
      return { job_id: newId('job'), version: v, note: 'AI CV created as DRAFT — requires your explicit approval before it becomes ACTIVE.' };
    }
  }

  // ---- JOBS (candidate discovery) ----------------------------------------
  if (root === 'jobs') {
    if (a === 'recommendations') return recommendations;
    if (a === 'search') {
      const qq = (query(url).get('q') ?? '').toLowerCase();
      const items = state.jds.filter((j) => j.status === JdStatus.ACTIVE && (!qq || j.title.toLowerCase().includes(qq) || j.skills.some((s) => s.toLowerCase().includes(qq))));
      return { items, total: items.length, page: 1, page_size: 20 };
    }
    if (a && c === 'apply' && m === 'POST') {
      if (state.applications.some((ap) => ap.jd_id === a)) throw problem(409, 'Duplicate application', 'You have already applied to this job (Idempotency-Key enforced).');
      const jd = state.jds.find((j) => j.id === a);
      const app = { id: newId('app'), candidate_id: 'cand_1', jd_id: a, jd_title: jd?.title, org_name: 'Acme Technologies', stage: ApplicationStage.SUBMITTED, match_score: 80, applied_at: nowIso(), created_at: nowIso(), updated_at: nowIso() };
      state.applications.unshift(app);
      return app;
    }
    if (a && m === 'GET') {
      const jd = state.jds.find((j) => j.id === a);
      if (!jd) throw problem(404, 'Job not found');
      return jd;
    }
  }

  // ---- APPLICATIONS -------------------------------------------------------
  if (root === 'applications') {
    if (!a && m === 'GET') return state.applications;
    if (a && c === 'withdraw' && m === 'POST') {
      const app = state.applications.find((x) => x.id === a);
      if (!app) throw problem(404, 'Application not found');
      app.stage = ApplicationStage.WITHDRAWN;
      return app;
    }
    if (a && m === 'GET') {
      const app = state.applications.find((x) => x.id === a);
      if (!app) throw problem(404, 'Application not found');
      return app;
    }
  }

  // ---- NOTIFICATIONS ------------------------------------------------------
  if (root === 'notifications') {
    if (!a && m === 'GET') return state.notifications;
    if (a && c === 'read' && m === 'PATCH') {
      const n = state.notifications.find((x) => x.id === a);
      if (n) n.read = true;
      return n ?? { ok: true };
    }
    if (a === 'read-all' && m === 'PATCH') {
      state.notifications.forEach((n) => (n.read = true));
      return { ok: true };
    }
  }

  // ---- INTERVIEWS ---------------------------------------------------------
  if (root === 'interviews') {
    if (!a && m === 'GET') return state.interviews;
    if (a && c === 'confirm' && m === 'POST') {
      const it = state.interviews.find((x) => x.id === a);
      if (it) it.status = 'CONFIRMED' as any;
      return it ?? { ok: true };
    }
  }
  if (root === 'recruiter' && a === 'org') {
    if (m === 'GET') return db.orgs[0];
    if (m === 'POST' || m === 'PUT') return { ...db.orgs[0], ...b, updated_at: nowIso() };
  }
  if (root === 'recruiter' && a === 'settings') {
    if (m === 'POST' || m === 'PUT') return { ok: true, settings: b };
    return { org: db.orgs[0], notifications: { newCandidates: true, interviewReminders: true, campaignUpdates: true, weeklyReport: false }, ai: { auto_shortlist: true, confidence_threshold: 0.7 } };
  }
  if (root === 'recruiter' && a === 'interviews' && m === 'POST') {
    const it = { id: newId('int'), application_id: b.application_id, candidate_id: b.candidate_id ?? 'c00', type: b.type, status: 'SCHEDULED', scheduled_at: b.proposed_slots?.[0] ?? nowIso(), duration_min: b.duration_min ?? 45, platform: b.platform ?? 'GOOGLE_MEET', interviewer_ids: b.interviewer_ids ?? [], reschedule_count: 0, created_at: nowIso(), updated_at: nowIso() };
    state.interviews.unshift(it as any);
    return it;
  }

  // ---- JD MANAGEMENT (recruiter) -----------------------------------------
  if (root === 'jds') {
    if (!a && m === 'GET') return state.jds;
    if (!a && m === 'POST') {
      if (!b.title || !Array.isArray(b.skills) || b.skills.length < 3 || !b.expected_close_date) {
        throw problem(422, 'Validation failed', 'title, ≥3 skills and expected_close_date are mandatory.');
      }
      const jd = { id: newId('jd'), org_id: 'org_acme', status: JdStatus.DRAFT, applicant_count: 0, created_by: 'usr_rec_1', currency: 'INR', work_mode: b.work_mode ?? 'HYBRID', created_at: nowIso(), updated_at: nowIso(), ...b };
      state.jds.unshift(jd);
      return jd;
    }
    if (a === 'upload' && m === 'POST') {
      return { job_id: newId('job'), status: 'EXTRACTING', extraction_confidence: 0.83, extracted: { title: 'Frontend Developer (React)', skills: ['React', 'TypeScript', 'Redux'], exp_min: 3, location: 'Pune, IN', low_confidence_fields: ['salary_min'] } };
    }
    if (a && c === 'priority-matrix' && m === 'POST') {
      const sum = ['skills', 'experience', 'notice', 'location', 'salary', 'cert'].reduce((s, k) => s + Number(b[k] ?? 0), 0);
      if (sum !== 100) throw problem(422, 'Priority matrix weights must sum to 100', `Got ${sum}.`);
      const jd = state.jds.find((j) => j.id === a);
      if (jd) jd.priority_matrix = b as any;
      return jd;
    }
    if (a && c && ['submit-review', 'approve', 'publish', 'close', 'archive'].includes(c) && m === 'POST') {
      const jd = state.jds.find((j) => j.id === a);
      if (!jd) throw problem(404, 'JD not found');
      const next: Record<string, JdStatus> = { 'submit-review': JdStatus.REVIEW, approve: JdStatus.APPROVED, publish: JdStatus.ACTIVE, close: JdStatus.ARCHIVED, archive: JdStatus.ARCHIVED };
      jd.status = next[c]!;
      return jd;
    }
    if (a && m === 'GET') {
      const jd = state.jds.find((j) => j.id === a);
      if (!jd) throw problem(404, 'JD not found');
      return jd;
    }
    if (a && m === 'PATCH') {
      const jd = state.jds.find((j) => j.id === a);
      if (!jd) throw problem(404, 'JD not found');
      Object.assign(jd, b, { updated_at: nowIso() });
      return jd;
    }
  }

  // ---- PIPELINE -----------------------------------------------------------
  if (root === 'pipeline') {
    if (!a && m === 'GET') {
      const jd = query(url).get('jd_id');
      return jd ? state.pipeline.filter((p) => p.jd_id === jd) : state.pipeline;
    }
    if (a === 'generate-shortlist' && m === 'POST') return { job_id: newId('job'), status: 'RANKING', message: 'AI ranking queued. Results require human APPROVE before advancing.' };
    if (a && c === 'stage' && m === 'PATCH') {
      const p = state.pipeline.find((x) => x.candidate_id === a);
      if (!p) throw problem(404, 'Candidate not in pipeline');
      // Human-validation gate (G-013): block jump to INTERVIEW/screening campaigns without consent
      if ((b.stage === ApplicationStage.INTERVIEW || b.stage === ApplicationStage.SCREENING) && !(p as any).consented) {
        throw problem(409, 'Human validation / consent gate', 'Candidate must be APPROVED and consented before advancing to screening/interview.');
      }
      p.stage = b.stage;
      p.updated_at = nowIso();
      return p;
    }
    if (a && c === 'similar' && m === 'GET') {
      return state.pipeline.filter((p) => p.candidate_id !== a).slice(0, 3).map((p) => ({ ...p, similarity: 0.7 + (p.match_score ?? 0) / 1000 }));
    }
    if (a && c === 'approve' && m === 'POST') {
      const p = state.pipeline.find((x) => x.candidate_id === a) as any;
      if (p) p.consented = true;
      return { id: newId('sa'), application_id: a, action: 'APPROVED', created_at: nowIso() };
    }
  }

  // ---- VOICE --------------------------------------------------------------
  if (root === 'voice' && a === 'campaigns') {
    if (!c && m === 'GET') return state.voiceCampaigns;
    if (!c && m === 'POST') {
      const vc = { id: newId('vc'), org_id: 'org_acme', status: CampaignStatus.DRAFT, completed_calls: 0, skipped_calls: 0, total_candidates: b.total_candidates ?? 0, consenting_count: b.consenting_count ?? 0, calls_per_hour: b.calls_per_hour ?? 30, created_at: nowIso(), updated_at: nowIso(), ...b };
      state.voiceCampaigns.unshift(vc);
      return vc;
    }
    if (c && d === 'calls' && m === 'GET') return db.callLogs.filter((cl) => cl.campaign_id === c);
    if (c && d && ['launch', 'pause', 'resume'].includes(d) && m === 'POST') {
      const vc = state.voiceCampaigns.find((x) => x.id === c);
      if (!vc) throw problem(404, 'Campaign not found');
      if (d === 'launch' && vc.consenting_count <= 0) throw problem(409, 'ConsentGate failed', 'At least one candidate must have VOICE_AI consent before launch.');
      vc.status = d === 'pause' ? CampaignStatus.PAUSED : CampaignStatus.LAUNCHED;
      return vc;
    }
  }

  // ---- EMAIL --------------------------------------------------------------
  if (root === 'email' && a === 'campaigns') {
    if (!c && m === 'GET') return state.emailCampaigns;
    if (!c && m === 'POST') {
      const ec = { id: newId('ec'), org_id: 'org_acme', status: CampaignStatus.DRAFT, sent: 0, opened: 0, clicked: 0, unsubscribed: 0, total_recipients: b.total_recipients ?? 0, created_at: nowIso(), updated_at: nowIso(), ...b };
      state.emailCampaigns.unshift(ec);
      return ec;
    }
    if (c && d && ['launch', 'pause', 'send-test'].includes(d) && m === 'POST') {
      const ec = state.emailCampaigns.find((x) => x.id === c);
      if (!ec) throw problem(404, 'Campaign not found');
      if (d !== 'send-test') ec.status = d === 'pause' ? CampaignStatus.PAUSED : CampaignStatus.LAUNCHED;
      return ec;
    }
  }

  // ---- OFFERS -------------------------------------------------------------
  if (root === 'offers') {
    if (!a && m === 'GET') return state.offers;
    if (a && c && ['approve', 'accept', 'decline', 'revoke'].includes(c) && m === 'POST') {
      const o = state.offers.find((x) => x.id === a);
      if (!o) throw problem(404, 'Offer not found');
      const map: Record<string, OfferStatus> = { approve: OfferStatus.APPROVED, accept: OfferStatus.ACCEPTED, decline: OfferStatus.DECLINED, revoke: OfferStatus.REVOKED };
      o.status = map[c]!;
      return o;
    }
  }

  // ---- ANALYTICS ----------------------------------------------------------
  if (root === 'analytics') {
    if (a === 'recruiter' && c === 'dashboard') return db.recruiterDashboard;
    if (a === 'market') return { roles: db.marketRoles };
  }

  // ---- ADMIN --------------------------------------------------------------
  if (root === 'admin') {
    if (a === 'users' && m === 'GET') return db.adminUsers;
    if (a === 'users' && c && m === 'PATCH') {
      const u = db.adminUsers.find((x) => x.id === c);
      if (u) Object.assign(u, b);
      return u ?? { ok: true };
    }
    if (a === 'orgs' && m === 'GET') return db.orgs;
    if (a === 'orgs' && c && m === 'PATCH') {
      const o = db.orgs.find((x) => x.id === c);
      if (o) Object.assign(o, b);
      return o ?? { ok: true };
    }
    if (a === 'audit') return db.auditLogs;
    if (a === 'ai-monitoring') return db.aiMonitor;
    if (a === 'gdpr' && c === 'erasure' && m === 'POST') return { workflow_id: newId('wf'), status: 'STARTED', sla_days: 30 };
  }

  throw problem(404, 'Not found', `No mock handler for ${m} ${url}`);
}

function tokensFor(sub: string) {
  return { access_token: `mock.access.${sub}`, refresh_token: `mock.refresh.${sub}`, expires_in: 900 };
}

// ---- supplementary mock payloads ----------------------------------------
const resumeSuggestions = [
  { id: 's1', title: 'Add measurable impact to Fintech Labs role', detail: 'Quantify throughput / latency improvements (e.g. "cut p99 by 40%").', category: 'experience', score_delta: 6, status: 'OPEN' },
  { id: 's2', title: 'Surface Kafka & event-driven keywords earlier', detail: 'Move Kafka into the top skills line for ATS keyword density.', category: 'keywords', score_delta: 5, status: 'OPEN' },
  { id: 's3', title: 'Add a cloud certification', detail: 'AWS Solutions Architect would lift the skills factor.', category: 'skills', score_delta: 4, status: 'OPEN' },
  { id: 's4', title: 'Use a single-column ATS-safe layout', detail: 'Two-column layouts hurt parser extraction.', category: 'formatting', score_delta: 3, status: 'OPEN' },
];

const recommendations = db.jds
  .filter((j) => j.status === JdStatus.ACTIVE)
  .map((jd, i) => ({
    jd,
    match_score: [91, 84, 58][i] ?? 70,
    breakdown: { semantic: 88 - i * 6, skills: 90 - i * 8, experience: 85 - i * 4, location: 80 - i * 5 },
    explanation: i === 0
      ? 'Strong semantic + skill overlap (Java, Spring Boot, Kafka). Experience and Bengaluru location match your preferences.'
      : 'Good skills overlap; some gaps vs the priority matrix on experience band.',
  }));

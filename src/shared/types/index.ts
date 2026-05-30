// ============================================================
// Job Hunter - Shared Type Definitions
// ============================================================

export type UserRole = 'candidate' | 'recruiter' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  organizationId?: string;
}

// --- Candidate Types ---

export type OnboardingMethod = 'cv_upload' | 'manual';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';

export interface CandidateProfile {
  id: string;
  userId: string;
  currentRole: string;
  skills: string[];
  experienceYears: number;
  experienceMonths: number;
  preferredLocations: string[];
  education: EducationEntry[];
  certifications: string[];
  employmentHistory: EmploymentEntry[];
  expectedSalary?: { amount: number; currency: string };
  availability?: string;
  employmentType: EmploymentType;
  aiScore: number;
  profileCompleteness: number;
  cvVersions: CVVersion[];
  onboardingMethod: OnboardingMethod;
  createdAt: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  year: number;
}

export interface EmploymentEntry {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
}

export interface CVVersion {
  id: string;
  fileName: string;
  uploadedAt: string;
  isActive: boolean;
  parsedData?: Record<string, unknown>;
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  salary: string;
  postedDate: string;
  skills: string[];
  type: EmploymentType;
  description: string;
}

export interface ResumeImprovement {
  category: 'skills_gap' | 'formatting' | 'keywords' | 'experience';
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

// --- Recruiter / Organization Types ---

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  logo?: string;
  domain: string;
  createdAt: string;
}

export interface JobDescription {
  id: string;
  organizationId: string;
  title: string;
  department: string;
  location: string;
  experienceRange: { min: number; max: number };
  skills: string[];
  description: string;
  budget: { min: number; max: number; currency: string };
  status: 'draft' | 'active' | 'paused' | 'closed';
  matchedCandidates: number;
  createdAt: string;
  employmentType: EmploymentType;
}

export type PipelineStage =
  | 'shortlisted'
  | 'contacted'
  | 'screened'
  | 'interview_scheduled'
  | 'offer'
  | 'closed';

export interface PipelineCandidate {
  id: string;
  candidateId: string;
  jdId: string;
  name: string;
  role: string;
  matchScore: number;
  stage: PipelineStage;
  skills: string[];
  experience: string;
  location: string;
  aiSummary: string;
  lastActivity: string;
  voiceOutreachStatus?: 'pending' | 'completed' | 'no_answer' | 'interested' | 'declined';
  interviewDate?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jdTitle: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'no_show' | 'rescheduled' | 'cancelled';
  feedback?: string;
  rating?: number;
}

export interface VoiceOutreachCampaign {
  id: string;
  jdId: string;
  jdTitle: string;
  totalCandidates: number;
  contacted: number;
  interested: number;
  declined: number;
  noAnswer: number;
  status: 'draft' | 'active' | 'completed' | 'paused';
  startedAt?: string;
}

export interface MarketIntelligence {
  role: string;
  location: string;
  avgSalary: number;
  demandTrend: 'rising' | 'stable' | 'declining';
  availableTalent: number;
  competitorHiring: number;
}

export interface AnalyticsData {
  timeToHire: number;
  timeToFirstInterview: number;
  matchAccuracy: number;
  pipelineConversion: number;
  voiceResponseRate: number;
  emailOpenRate: number;
  activePipelines: number;
  totalCandidates: number;
}

// ============================================================
// Job Hunter - Comprehensive Mock Data
// ============================================================

import type {
  CandidateProfile,
  JobRecommendation,
  ResumeImprovement,
  Organization,
  JobDescription,
  PipelineCandidate,
  Interview,
  VoiceOutreachCampaign,
  MarketIntelligence,
  AnalyticsData,
} from '../types';

// ============================================================
// 1. Candidate Profile (logged-in user)
// ============================================================

export const mockCandidateProfile: CandidateProfile = {
  id: 'cand-001',
  userId: 'usr-001',
  currentRole: 'Senior Software Engineer',
  skills: [
    'React',
    'Node.js',
    'Python',
    'TypeScript',
    'PostgreSQL',
    'AWS',
    'Docker',
    'GraphQL',
    'REST APIs',
    'Git',
    'CI/CD',
    'MongoDB',
  ],
  experienceYears: 5,
  experienceMonths: 3,
  preferredLocations: ['Bangalore', 'Hyderabad', 'Pune', 'Remote'],
  education: [
    {
      institution: 'Indian Institute of Technology, Bombay',
      degree: 'B.Tech',
      field: 'Computer Science and Engineering',
      year: 2021,
    },
    {
      institution: 'Kendriya Vidyalaya, Hyderabad',
      degree: 'Higher Secondary (XII)',
      field: 'Science (PCM)',
      year: 2017,
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate',
    'Meta Front-End Developer Professional Certificate',
  ],
  employmentHistory: [
    {
      company: 'Infosys',
      role: 'Software Engineer',
      startDate: '2021-07-01',
      endDate: '2023-04-30',
      isCurrent: false,
      description:
        'Built microservices using Node.js and Python for a large-scale fintech client. Led migration of a monolithic application to event-driven architecture on AWS.',
    },
    {
      company: 'Razorpay',
      role: 'Senior Software Engineer',
      startDate: '2023-05-15',
      endDate: null,
      isCurrent: true,
      description:
        'Architecting and developing React-based merchant dashboards. Owning the payments reconciliation pipeline processing 2M+ daily transactions.',
    },
  ],
  expectedSalary: { amount: 2800000, currency: 'INR' },
  availability: 'Immediate (15-day notice)',
  employmentType: 'Full-time',
  aiScore: 87,
  profileCompleteness: 92,
  cvVersions: [
    {
      id: 'cv-001',
      fileName: 'Arjun_Mehta_Resume_v3.pdf',
      uploadedAt: '2026-05-10T09:30:00Z',
      isActive: true,
      parsedData: { totalPages: 2, wordCount: 820 },
    },
    {
      id: 'cv-002',
      fileName: 'Arjun_Mehta_Resume_v2.pdf',
      uploadedAt: '2026-03-18T14:15:00Z',
      isActive: false,
    },
  ],
  onboardingMethod: 'cv_upload',
  createdAt: '2026-03-15T08:00:00Z',
};

// ============================================================
// 2. Job Recommendations (8 items, scores 95 → 60)
// ============================================================

export const mockJobRecommendations: JobRecommendation[] = [
  {
    id: 'jr-001',
    title: 'Staff Software Engineer – Frontend',
    company: 'Google',
    location: 'Bangalore',
    matchScore: 95,
    salary: '₹45,00,000 – ₹60,00,000',
    postedDate: '2026-05-28',
    skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'CI/CD'],
    type: 'Full-time',
    description:
      'Lead the development of Google Workspace frontend components, collaborating with UX designers and backend teams to deliver performant, accessible web applications used by millions.',
  },
  {
    id: 'jr-002',
    title: 'Senior Full-Stack Developer',
    company: 'Flipkart',
    location: 'Bangalore',
    matchScore: 91,
    salary: '₹38,00,000 – ₹50,00,000',
    postedDate: '2026-05-25',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    type: 'Full-time',
    description:
      'Own end-to-end feature development for Flipkart Seller Hub, from database design through API development to React-based dashboards serving 500K+ active sellers.',
  },
  {
    id: 'jr-003',
    title: 'Platform Engineer',
    company: 'Stripe',
    location: 'Remote',
    matchScore: 88,
    salary: '$160,000 – $200,000',
    postedDate: '2026-05-22',
    skills: ['Python', 'AWS', 'Docker', 'PostgreSQL', 'REST APIs'],
    type: 'Full-time',
    description:
      'Design and build scalable infrastructure powering Stripe payment processing. Improve reliability and performance of services handling billions of dollars in transactions.',
  },
  {
    id: 'jr-004',
    title: 'Senior React Developer',
    company: 'Swiggy',
    location: 'Hyderabad',
    matchScore: 84,
    salary: '₹32,00,000 – ₹42,00,000',
    postedDate: '2026-05-20',
    skills: ['React', 'TypeScript', 'GraphQL', 'Node.js'],
    type: 'Full-time',
    description:
      'Build next-generation restaurant partner dashboards and consumer-facing features for Swiggy Instamart, optimizing for mobile-first performance.',
  },
  {
    id: 'jr-005',
    title: 'Backend Engineer – Payments',
    company: 'PhonePe',
    location: 'Pune',
    matchScore: 79,
    salary: '₹30,00,000 – ₹40,00,000',
    postedDate: '2026-05-18',
    skills: ['Python', 'PostgreSQL', 'REST APIs', 'Docker', 'AWS'],
    type: 'Full-time',
    description:
      'Build and maintain high-throughput payment processing services handling 100M+ monthly UPI transactions. Ensure PCI-DSS compliance and 99.99% uptime.',
  },
  {
    id: 'jr-006',
    title: 'Full-Stack Engineer (Contract)',
    company: 'Accenture',
    location: 'Mumbai',
    matchScore: 73,
    salary: '₹25,00,000 – ₹35,00,000',
    postedDate: '2026-05-15',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    type: 'Contract',
    description:
      'Join a 6-month engagement building a digital transformation platform for a major banking client. React frontend with Node.js microservices on AWS.',
  },
  {
    id: 'jr-007',
    title: 'Software Engineer – AI/ML Platform',
    company: 'Microsoft',
    location: 'Hyderabad',
    matchScore: 67,
    salary: '₹35,00,000 – ₹48,00,000',
    postedDate: '2026-05-12',
    skills: ['Python', 'TypeScript', 'Docker', 'REST APIs', 'CI/CD'],
    type: 'Full-time',
    description:
      'Contribute to Azure AI Services platform, building developer-facing APIs and SDKs that enable ML model deployment at scale.',
  },
  {
    id: 'jr-008',
    title: 'Frontend Developer',
    company: 'Zoho',
    location: 'Chennai',
    matchScore: 60,
    salary: '₹18,00,000 – ₹28,00,000',
    postedDate: '2026-05-08',
    skills: ['React', 'TypeScript', 'REST APIs', 'Git'],
    type: 'Full-time',
    description:
      'Develop and maintain Zoho CRM frontend modules, collaborating with a globally distributed team to ship features used by 100M+ users worldwide.',
  },
];

// ============================================================
// 3. Resume Improvements (6 suggestions)
// ============================================================

export const mockResumeImprovements: ResumeImprovement[] = [
  {
    category: 'skills_gap',
    suggestion:
      'Add Kubernetes to your skill set — 72% of Senior Engineer roles in your target companies list it as a preferred skill.',
    impact: 'high',
  },
  {
    category: 'keywords',
    suggestion:
      'Include "system design" and "distributed systems" keywords. These appear in 85% of Staff/Senior roles at top-tier tech companies.',
    impact: 'high',
  },
  {
    category: 'experience',
    suggestion:
      'Quantify your Razorpay achievements — mention the exact throughput improvements, latency reductions, or cost savings you delivered.',
    impact: 'high',
  },
  {
    category: 'formatting',
    suggestion:
      'Move your certifications section above employment history. AWS SA certification is highly valued and should be visible in the top third of your resume.',
    impact: 'medium',
  },
  {
    category: 'keywords',
    suggestion:
      'Add "mentoring" or "technical leadership" to highlight your growth trajectory toward Staff-level roles.',
    impact: 'medium',
  },
  {
    category: 'formatting',
    suggestion:
      'Consolidate your skills into categorized groups (Languages, Frameworks, Cloud, Tools) instead of a flat list for better readability.',
    impact: 'low',
  },
];

// ============================================================
// 4. Organization
// ============================================================

export const mockOrganization: Organization = {
  id: 'org-001',
  name: 'Nalashaa Digital',
  industry: 'IT Services & Consulting',
  size: '200-500',
  location: 'Ahmedabad, India',
  logo: '/assets/nalashaa-logo.png',
  domain: 'nalashaa.com',
  createdAt: '2025-09-01T00:00:00Z',
};

// ============================================================
// 5. Job Descriptions (5 items, different statuses)
// ============================================================

export const mockJobDescriptions: JobDescription[] = [
  {
    id: 'jd-001',
    organizationId: 'org-001',
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'Bangalore',
    experienceRange: { min: 4, max: 7 },
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    description:
      'We are looking for a Senior React Developer to lead frontend development of our SaaS platform. You will own the design system, optimize performance, and mentor junior developers.',
    budget: { min: 2500000, max: 3800000, currency: 'INR' },
    status: 'active',
    matchedCandidates: 42,
    createdAt: '2026-05-10T10:00:00Z',
    employmentType: 'Full-time',
  },
  {
    id: 'jd-002',
    organizationId: 'org-001',
    title: 'Python Backend Engineer',
    department: 'Engineering',
    location: 'Hyderabad',
    experienceRange: { min: 3, max: 6 },
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
    description:
      'Build and scale backend services for our data analytics platform. Design RESTful APIs, optimize database queries, and implement caching strategies for high-traffic endpoints.',
    budget: { min: 2000000, max: 3200000, currency: 'INR' },
    status: 'active',
    matchedCandidates: 38,
    createdAt: '2026-05-15T11:30:00Z',
    employmentType: 'Full-time',
  },
  {
    id: 'jd-003',
    organizationId: 'org-001',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Pune',
    experienceRange: { min: 2, max: 5 },
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD'],
    description:
      'Manage and automate cloud infrastructure on AWS. Implement CI/CD pipelines, container orchestration, and infrastructure-as-code practices across all engineering teams.',
    budget: { min: 1800000, max: 3000000, currency: 'INR' },
    status: 'paused',
    matchedCandidates: 27,
    createdAt: '2026-04-20T09:00:00Z',
    employmentType: 'Full-time',
  },
  {
    id: 'jd-004',
    organizationId: 'org-001',
    title: 'QA Automation Lead',
    department: 'Quality Assurance',
    location: 'Ahmedabad',
    experienceRange: { min: 5, max: 9 },
    skills: ['Selenium', 'Playwright', 'Python', 'Jest', 'CI/CD'],
    description:
      'Lead the QA automation strategy across multiple product lines. Build test frameworks, define quality metrics, and ensure 90%+ automated coverage for critical user flows.',
    budget: { min: 2200000, max: 3500000, currency: 'INR' },
    status: 'draft',
    matchedCandidates: 0,
    createdAt: '2026-05-28T14:00:00Z',
    employmentType: 'Full-time',
  },
  {
    id: 'jd-005',
    organizationId: 'org-001',
    title: 'Data Analyst (Contract)',
    department: 'Analytics',
    location: 'Remote',
    experienceRange: { min: 2, max: 4 },
    skills: ['SQL', 'Python', 'Power BI', 'Excel', 'Tableau'],
    description:
      'Analyze business data to generate actionable insights for our clients. Build dashboards, create automated reports, and support data-driven decision-making across the organization.',
    budget: { min: 1200000, max: 2000000, currency: 'INR' },
    status: 'closed',
    matchedCandidates: 54,
    createdAt: '2026-03-01T08:00:00Z',
    employmentType: 'Contract',
  },
];

// ============================================================
// 6. Pipeline Candidates (15 across all stages)
// ============================================================

export const mockPipelineCandidates: PipelineCandidate[] = [
  // --- shortlisted (3) ---
  {
    id: 'pc-001',
    candidateId: 'cand-101',
    jdId: 'jd-001',
    name: 'Priya Sharma',
    role: 'Senior React Developer',
    matchScore: 92,
    stage: 'shortlisted',
    skills: ['React', 'TypeScript', 'GraphQL', 'Next.js'],
    experience: '5 years',
    location: 'Bangalore',
    aiSummary:
      'Strong frontend specialist with production experience in React 18 and design systems. Previously built the checkout flow at Meesho.',
    lastActivity: '2026-05-29T10:00:00Z',
  },
  {
    id: 'pc-002',
    candidateId: 'cand-102',
    jdId: 'jd-001',
    name: 'Rohit Verma',
    role: 'Full-Stack Developer',
    matchScore: 85,
    stage: 'shortlisted',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    experience: '4 years',
    location: 'Hyderabad',
    aiSummary:
      'Versatile full-stack engineer comfortable across the entire stack. Contributed to open-source React libraries with 1K+ GitHub stars.',
    lastActivity: '2026-05-28T16:30:00Z',
  },
  {
    id: 'pc-003',
    candidateId: 'cand-103',
    jdId: 'jd-002',
    name: 'Ananya Iyer',
    role: 'Backend Developer',
    matchScore: 88,
    stage: 'shortlisted',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    experience: '3.5 years',
    location: 'Chennai',
    aiSummary:
      'Python specialist with deep experience in FastAPI and async programming. Built real-time data ingestion pipelines at a Series B startup.',
    lastActivity: '2026-05-29T08:15:00Z',
  },
  // --- contacted (3) ---
  {
    id: 'pc-004',
    candidateId: 'cand-104',
    jdId: 'jd-001',
    name: 'Vikram Desai',
    role: 'Senior Frontend Engineer',
    matchScore: 90,
    stage: 'contacted',
    skills: ['React', 'TypeScript', 'AWS', 'CI/CD'],
    experience: '6 years',
    location: 'Pune',
    aiSummary:
      'Experienced frontend lead from Atlassian. Led a team of 5 building Jira Cloud components. Strong in accessibility and performance.',
    lastActivity: '2026-05-27T14:00:00Z',
    voiceOutreachStatus: 'interested',
  },
  {
    id: 'pc-005',
    candidateId: 'cand-105',
    jdId: 'jd-002',
    name: 'Kavitha Nair',
    role: 'Python Engineer',
    matchScore: 82,
    stage: 'contacted',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    experience: '4 years',
    location: 'Kochi',
    aiSummary:
      'Backend engineer with strong Django and DRF experience. Built multi-tenant SaaS APIs serving 200+ enterprise clients.',
    lastActivity: '2026-05-26T11:45:00Z',
    voiceOutreachStatus: 'completed',
  },
  {
    id: 'pc-006',
    candidateId: 'cand-106',
    jdId: 'jd-001',
    name: 'Suresh Patel',
    role: 'React Developer',
    matchScore: 78,
    stage: 'contacted',
    skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
    experience: '3 years',
    location: 'Ahmedabad',
    aiSummary:
      'Solid React fundamentals with growing TypeScript proficiency. Worked on customer-facing dashboards at a healthcare tech company.',
    lastActivity: '2026-05-25T09:30:00Z',
    voiceOutreachStatus: 'no_answer',
  },
  // --- screened (3) ---
  {
    id: 'pc-007',
    candidateId: 'cand-107',
    jdId: 'jd-001',
    name: 'Deepa Krishnan',
    role: 'Senior React Developer',
    matchScore: 94,
    stage: 'screened',
    skills: ['React', 'TypeScript', 'GraphQL', 'AWS', 'Node.js'],
    experience: '6.5 years',
    location: 'Bangalore',
    aiSummary:
      'Exceptional frontend architect from Amazon. Led the migration of a legacy Angular app to React, reducing bundle size by 40% and improving Core Web Vitals.',
    lastActivity: '2026-05-24T15:20:00Z',
    voiceOutreachStatus: 'interested',
  },
  {
    id: 'pc-008',
    candidateId: 'cand-108',
    jdId: 'jd-002',
    name: 'Amit Joshi',
    role: 'Backend Engineer',
    matchScore: 80,
    stage: 'screened',
    skills: ['Python', 'FastAPI', 'Redis', 'Docker', 'Kafka'],
    experience: '4 years',
    location: 'Pune',
    aiSummary:
      'Backend engineer with event-driven architecture experience. Built Kafka-based data pipelines processing 500K events/minute.',
    lastActivity: '2026-05-23T12:00:00Z',
    voiceOutreachStatus: 'completed',
  },
  {
    id: 'pc-009',
    candidateId: 'cand-109',
    jdId: 'jd-003',
    name: 'Neha Gupta',
    role: 'DevOps Engineer',
    matchScore: 86,
    stage: 'screened',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker'],
    experience: '3 years',
    location: 'Delhi',
    aiSummary:
      'AWS-certified DevOps engineer who automated infrastructure provisioning, reducing deployment time from 2 hours to 15 minutes using Terraform and GitHub Actions.',
    lastActivity: '2026-05-22T10:30:00Z',
    voiceOutreachStatus: 'interested',
  },
  // --- interview_scheduled (3) ---
  {
    id: 'pc-010',
    candidateId: 'cand-110',
    jdId: 'jd-001',
    name: 'Rajesh Kumar',
    role: 'Senior Software Engineer',
    matchScore: 91,
    stage: 'interview_scheduled',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    experience: '5 years',
    location: 'Bangalore',
    aiSummary:
      'Full-stack engineer from Thoughtworks. Strong TDD practitioner with experience in pair programming and trunk-based development.',
    lastActivity: '2026-05-29T09:00:00Z',
    voiceOutreachStatus: 'interested',
    interviewDate: '2026-06-02T10:00:00Z',
  },
  {
    id: 'pc-011',
    candidateId: 'cand-111',
    jdId: 'jd-002',
    name: 'Meera Reddy',
    role: 'Python Developer',
    matchScore: 83,
    stage: 'interview_scheduled',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
    experience: '4.5 years',
    location: 'Hyderabad',
    aiSummary:
      'Backend specialist with fintech domain expertise. Built PCI-compliant payment APIs processing ₹50Cr+ monthly at a leading NBFC.',
    lastActivity: '2026-05-28T13:00:00Z',
    voiceOutreachStatus: 'interested',
    interviewDate: '2026-06-03T14:30:00Z',
  },
  {
    id: 'pc-012',
    candidateId: 'cand-112',
    jdId: 'jd-001',
    name: 'Sanjay Bhatt',
    role: 'Frontend Engineer',
    matchScore: 76,
    stage: 'interview_scheduled',
    skills: ['React', 'JavaScript', 'CSS', 'Figma'],
    experience: '3 years',
    location: 'Mumbai',
    aiSummary:
      'Design-savvy frontend developer with strong CSS and animation skills. Built the marketing site for a Y Combinator startup.',
    lastActivity: '2026-05-27T11:00:00Z',
    voiceOutreachStatus: 'completed',
    interviewDate: '2026-06-04T11:00:00Z',
  },
  // --- offer (2) ---
  {
    id: 'pc-013',
    candidateId: 'cand-113',
    jdId: 'jd-001',
    name: 'Lakshmi Venkatesh',
    role: 'Senior React Developer',
    matchScore: 96,
    stage: 'offer',
    skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'AWS'],
    experience: '7 years',
    location: 'Bangalore',
    aiSummary:
      'Top-tier frontend architect from Uber. Led the design system team serving 15 product squads. Excellent communication and architectural thinking.',
    lastActivity: '2026-05-29T16:00:00Z',
    voiceOutreachStatus: 'interested',
  },
  // --- closed (1) ---
  {
    id: 'pc-014',
    candidateId: 'cand-114',
    jdId: 'jd-005',
    name: 'Aditya Singh',
    role: 'Data Analyst',
    matchScore: 89,
    stage: 'closed',
    skills: ['SQL', 'Python', 'Power BI', 'Tableau'],
    experience: '3 years',
    location: 'Delhi',
    aiSummary:
      'Data analyst with strong visualization skills. Created executive dashboards at Deloitte that drove 15% improvement in operational decision-making speed.',
    lastActivity: '2026-04-15T10:00:00Z',
    voiceOutreachStatus: 'interested',
  },
  {
    id: 'pc-015',
    candidateId: 'cand-115',
    jdId: 'jd-005',
    name: 'Fatima Khan',
    role: 'Business Analyst',
    matchScore: 74,
    stage: 'closed',
    skills: ['SQL', 'Excel', 'Power BI', 'Python'],
    experience: '2.5 years',
    location: 'Mumbai',
    aiSummary:
      'Analytical thinker with a commerce background. Transitioned from finance to data analytics. Strong in SQL and storytelling with data.',
    lastActivity: '2026-04-10T14:30:00Z',
    voiceOutreachStatus: 'declined',
  },
];

// ============================================================
// 7. Interviews (6 with different statuses)
// ============================================================

export const mockInterviews: Interview[] = [
  {
    id: 'int-001',
    candidateId: 'cand-110',
    candidateName: 'Rajesh Kumar',
    jdTitle: 'Senior React Developer',
    scheduledAt: '2026-06-02T10:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'int-002',
    candidateId: 'cand-111',
    candidateName: 'Meera Reddy',
    jdTitle: 'Python Backend Engineer',
    scheduledAt: '2026-06-03T14:30:00Z',
    status: 'scheduled',
  },
  {
    id: 'int-003',
    candidateId: 'cand-112',
    candidateName: 'Sanjay Bhatt',
    jdTitle: 'Senior React Developer',
    scheduledAt: '2026-06-04T11:00:00Z',
    status: 'rescheduled',
    feedback: 'Candidate requested reschedule due to travel conflict. Moved from June 1 to June 4.',
  },
  {
    id: 'int-004',
    candidateId: 'cand-113',
    candidateName: 'Lakshmi Venkatesh',
    jdTitle: 'Senior React Developer',
    scheduledAt: '2026-05-22T10:00:00Z',
    status: 'completed',
    feedback:
      'Outstanding system design skills. Deep React internals knowledge. Strong communication. Recommended for offer.',
    rating: 5,
  },
  {
    id: 'int-005',
    candidateId: 'cand-114',
    candidateName: 'Aditya Singh',
    jdTitle: 'Data Analyst (Contract)',
    scheduledAt: '2026-04-10T15:00:00Z',
    status: 'completed',
    feedback:
      'Good SQL and visualization skills. Needs improvement in statistical analysis. Recommended with minor reservations.',
    rating: 4,
  },
  {
    id: 'int-006',
    candidateId: 'cand-106',
    candidateName: 'Suresh Patel',
    jdTitle: 'Senior React Developer',
    scheduledAt: '2026-05-20T09:00:00Z',
    status: 'no_show',
    feedback: 'Candidate did not join the call. Attempted to reach via phone — no response.',
  },
];

// ============================================================
// 8. Voice Outreach Campaigns (3)
// ============================================================

export const mockVoiceOutreachCampaigns: VoiceOutreachCampaign[] = [
  {
    id: 'voc-001',
    jdId: 'jd-001',
    jdTitle: 'Senior React Developer',
    totalCandidates: 42,
    contacted: 35,
    interested: 18,
    declined: 7,
    noAnswer: 10,
    status: 'active',
    startedAt: '2026-05-15T09:00:00Z',
  },
  {
    id: 'voc-002',
    jdId: 'jd-002',
    jdTitle: 'Python Backend Engineer',
    totalCandidates: 38,
    contacted: 38,
    interested: 22,
    declined: 9,
    noAnswer: 7,
    status: 'completed',
    startedAt: '2026-05-12T10:00:00Z',
  },
  {
    id: 'voc-003',
    jdId: 'jd-003',
    jdTitle: 'DevOps Engineer',
    totalCandidates: 27,
    contacted: 0,
    interested: 0,
    declined: 0,
    noAnswer: 0,
    status: 'draft',
  },
];

// ============================================================
// 9. Market Intelligence (6 data points)
// ============================================================

export const mockMarketIntelligence: MarketIntelligence[] = [
  {
    role: 'Senior React Developer',
    location: 'Bangalore',
    avgSalary: 3200000,
    demandTrend: 'rising',
    availableTalent: 1450,
    competitorHiring: 32,
  },
  {
    role: 'Python Backend Engineer',
    location: 'Hyderabad',
    avgSalary: 2600000,
    demandTrend: 'rising',
    availableTalent: 2100,
    competitorHiring: 28,
  },
  {
    role: 'DevOps Engineer',
    location: 'Pune',
    avgSalary: 2400000,
    demandTrend: 'stable',
    availableTalent: 980,
    competitorHiring: 19,
  },
  {
    role: 'Data Analyst',
    location: 'Delhi',
    avgSalary: 1500000,
    demandTrend: 'stable',
    availableTalent: 3200,
    competitorHiring: 15,
  },
  {
    role: 'QA Automation Lead',
    location: 'Ahmedabad',
    avgSalary: 2800000,
    demandTrend: 'declining',
    availableTalent: 420,
    competitorHiring: 8,
  },
  {
    role: 'Full-Stack Engineer',
    location: 'Remote',
    avgSalary: 3500000,
    demandTrend: 'rising',
    availableTalent: 5600,
    competitorHiring: 45,
  },
];

// ============================================================
// 10. Analytics Data
// ============================================================

export const mockAnalytics: AnalyticsData = {
  timeToHire: 18,
  timeToFirstInterview: 4,
  matchAccuracy: 87,
  pipelineConversion: 34,
  voiceResponseRate: 72,
  emailOpenRate: 58,
  activePipelines: 3,
  totalCandidates: 142,
};

// ============================================================
// 11. Skill Options (30+ for dropdowns)
// ============================================================

export const skillOptions: string[] = [
  'React',
  'Angular',
  'Vue.js',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express.js',
  'Python',
  'Django',
  'FastAPI',
  'Flask',
  'Java',
  'Spring Boot',
  'Go',
  'Rust',
  'C#',
  '.NET',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Kafka',
  'RabbitMQ',
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'Terraform',
  'CI/CD',
  'Git',
  'GraphQL',
  'REST APIs',
  'Selenium',
  'Playwright',
  'Jest',
  'Power BI',
  'Tableau',
  'SQL',
  'Machine Learning',
  'TensorFlow',
  'PyTorch',
  'Figma',
  'Tailwind CSS',
];

// ============================================================
// 12. Role Categories (20+ for dropdowns)
// ============================================================

export const roleCategories: string[] = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Software Engineer',
  'Principal Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Developer',
  'DevOps Engineer',
  'SRE / Platform Engineer',
  'Data Engineer',
  'Data Analyst',
  'Data Scientist',
  'Machine Learning Engineer',
  'QA Engineer',
  'QA Automation Lead',
  'Mobile Developer (Android)',
  'Mobile Developer (iOS)',
  'React Native Developer',
  'Product Manager',
  'Engineering Manager',
  'Technical Architect',
  'Solutions Architect',
  'Cloud Engineer',
  'Security Engineer',
  'UI/UX Designer',
  'Technical Writer',
  'Business Analyst',
  'Scrum Master',
];

// ============================================================
// 13. Location Options (15+ cities)
// ============================================================

export const locationOptions: string[] = [
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Ahmedabad',
  'Kolkata',
  'Kochi',
  'Jaipur',
  'Noida',
  'Gurgaon',
  'Remote',
  'Singapore',
  'Dubai',
  'London',
  'San Francisco',
  'New York',
  'Toronto',
  'Berlin',
];

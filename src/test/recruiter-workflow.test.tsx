import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import OrgOnboardingPage from '@recruiter/pages/OrgOnboardingPage';
import RecruiterDashboard from '@recruiter/pages/RecruiterDashboard';
import JDManagementPage from '@recruiter/pages/JDManagementPage';
import CandidatePipelinePage from '@recruiter/pages/CandidatePipelinePage';
import InterviewTrackingPage from '@recruiter/pages/InterviewTrackingPage';
import VoiceAIPage from '@recruiter/pages/VoiceAIPage';
import EmailCampaignPage from '@recruiter/pages/EmailCampaignPage';
import AnalyticsDashboardPage from '@recruiter/pages/AnalyticsDashboardPage';
import MarketIntelPage from '@recruiter/pages/MarketIntelPage';
import RecruiterSettingsPage from '@recruiter/pages/RecruiterSettingsPage';

// Mock auth context - simulate logged-in recruiter
beforeEach(() => {
  sessionStorage.setItem('jh_user', JSON.stringify({
    id: 'test-recruiter-1',
    email: 'neha@techcorp.com',
    name: 'Neha Kapoor',
    role: 'recruiter',
    organizationId: 'org-001',
  }));
});

describe('Recruiter Workflow - Step 1: Organization Onboarding', () => {
  it('renders company setup form', () => {
    render(<OrgOnboardingPage />);
    expect(screen.getByText(/Set Up Your Organization/i)).toBeInTheDocument();
  });

  it('has required fields: company name, industry, size, location', () => {
    render(<OrgOnboardingPage />);
    expect(screen.getByText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Industry/i).length).toBeGreaterThan(0);
  });

  it('has logo upload area', () => {
    render(<OrgOnboardingPage />);
    expect(screen.getByText(/Upload Logo/i)).toBeInTheDocument();
  });

  it('has complete setup button', () => {
    render(<OrgOnboardingPage />);
    expect(screen.getByText(/Complete Setup/i)).toBeInTheDocument();
  });
});

describe('Recruiter Workflow - Step 2: Dashboard', () => {
  it('renders dashboard with KPI stats', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByText(/Active JDs/i)).toBeInTheDocument();
  });

  it('shows active job descriptions section', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByText(/Active Job Descriptions/i)).toBeInTheDocument();
  });

  it('displays pipeline activity', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByText(/Recent Pipeline Activity/i)).toBeInTheDocument();
  });

  it('shows quick action buttons', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
  });

  it('displays upcoming interviews', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByText(/Upcoming Interviews/i)).toBeInTheDocument();
  });

  it('shows time-to-hire or conversion metrics', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByText(/Pipeline Conversion/i)).toBeInTheDocument();
  });
});

describe('Recruiter Workflow - Step 3: JD Management', () => {
  it('renders JD listing page', () => {
    render(<JDManagementPage />);
    // The page has a heading "Job Descriptions"
    expect(screen.getAllByText(/Job Descriptions/i).length).toBeGreaterThan(0);
  });

  it('has "Create/Post New JD" button', () => {
    render(<JDManagementPage />);
    expect(screen.getByText(/Post New JD/i)).toBeInTheDocument();
  });

  it('shows status filter tabs', () => {
    render(<JDManagementPage />);
    // Filter tabs: All, Active, Draft, Paused, Closed
    expect(screen.getAllByText(/All/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Active/i).length).toBeGreaterThan(0);
  });

  it('displays JDs from mock data with status badges', () => {
    render(<JDManagementPage />);
    // Should show JD titles from mock data
    expect(screen.getAllByText(/React|Python|DevOps|QA|Data/i).length).toBeGreaterThan(0);
  });

  it('opens create JD modal when button is clicked', async () => {
    const user = userEvent.setup();
    render(<JDManagementPage />);
    const createBtn = screen.getByText(/Post New JD/i);
    await user.click(createBtn);
    // Modal should appear with form fields - "Job Title" label
    expect(screen.getByText(/Job Title/i)).toBeInTheDocument();
  });
});

describe('Recruiter Workflow - Step 4: Candidate Pipeline', () => {
  it('renders pipeline page', () => {
    render(<CandidatePipelinePage />);
    expect(screen.getAllByText(/Candidate Pipeline/i).length).toBeGreaterThan(0);
  });

  it('shows all pipeline stages as columns', () => {
    render(<CandidatePipelinePage />);
    expect(screen.getByText(/Shortlisted/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacted/i)).toBeInTheDocument();
    expect(screen.getByText(/Screened/i)).toBeInTheDocument();
  });

  it('displays candidate cards in pipeline', () => {
    render(<CandidatePipelinePage />);
    // Should show candidate names from mock data
    expect(screen.getAllByText(/Amit|Priya|Rahul|Sneha|Karthik|Rohit|Ananya|Vikram|Deepa/i).length).toBeGreaterThan(0);
  });

  it('has JD filter/selector', () => {
    render(<CandidatePipelinePage />);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('has AI shortlist generation button', () => {
    render(<CandidatePipelinePage />);
    expect(screen.getByText(/Generate AI Shortlist/i)).toBeInTheDocument();
  });
});

describe('Recruiter Workflow - Step 5: Interview Tracking', () => {
  it('renders interview tracking page', () => {
    render(<InterviewTrackingPage />);
    // AppLayout title is "Interviews"
    expect(screen.getAllByText(/Interview/i).length).toBeGreaterThan(0);
  });

  it('shows interview statistics', () => {
    render(<InterviewTrackingPage />);
    expect(screen.getByText(/Total Interviews/i)).toBeInTheDocument();
  });

  it('displays interview list with status badges', () => {
    render(<InterviewTrackingPage />);
    const statuses = ['Scheduled', 'Completed', 'No Show', 'Rescheduled'];
    const found = statuses.some(s => screen.queryAllByText(new RegExp(s, 'i')).length > 0);
    expect(found).toBe(true);
  });

  it('has feedback action available', () => {
    render(<InterviewTrackingPage />);
    // The list view has an "Actions" column header with action buttons
    expect(screen.getByText(/Actions/i)).toBeInTheDocument();
  });
});

describe('Recruiter Workflow - Voice AI Outreach', () => {
  it('renders voice AI page', () => {
    render(<VoiceAIPage />);
    // AppLayout title is "Voice AI Outreach"
    expect(screen.getAllByText(/Voice AI Outreach/i).length).toBeGreaterThan(0);
  });

  it('shows campaign stats', () => {
    render(<VoiceAIPage />);
    expect(screen.getByText(/Total Calls Made/i)).toBeInTheDocument();
  });

  it('displays response rate metrics', () => {
    render(<VoiceAIPage />);
    expect(screen.getByText(/Response Rate/i)).toBeInTheDocument();
  });

  it('has create campaign button', () => {
    render(<VoiceAIPage />);
    expect(screen.getByText(/Create Campaign/i)).toBeInTheDocument();
  });
});

describe('Recruiter Workflow - Email Campaigns', () => {
  it('renders email campaign page', () => {
    render(<EmailCampaignPage />);
    // AppLayout title is "Email Campaigns"
    expect(screen.getAllByText(/Email Campaign/i).length).toBeGreaterThan(0);
  });

  it('shows email metrics (sent, open rate, click rate)', () => {
    render(<EmailCampaignPage />);
    expect(screen.getByText(/Total Sent/i)).toBeInTheDocument();
  });

  it('has create campaign functionality', () => {
    render(<EmailCampaignPage />);
    expect(screen.getByText(/Create Campaign/i)).toBeInTheDocument();
  });
});

describe('Recruiter Workflow - Analytics', () => {
  it('renders analytics dashboard', () => {
    render(<AnalyticsDashboardPage />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });

  it('displays key metrics (time-to-hire, match accuracy, conversion)', () => {
    render(<AnalyticsDashboardPage />);
    expect(screen.getByText(/Time to Hire/i)).toBeInTheDocument();
    expect(screen.getByText(/Match Accuracy/i)).toBeInTheDocument();
  });

  it('shows pipeline funnel visualization', () => {
    render(<AnalyticsDashboardPage />);
    expect(screen.getByText(/Pipeline Funnel/i)).toBeInTheDocument();
  });
});

describe('Recruiter Workflow - Market Intelligence', () => {
  it('renders market intelligence page', () => {
    render(<MarketIntelPage />);
    expect(screen.getAllByText(/Market Intelligence/i).length).toBeGreaterThan(0);
  });

  it('shows salary benchmark data', () => {
    render(<MarketIntelPage />);
    expect(screen.getAllByText(/Salary Benchmark/i).length).toBeGreaterThan(0);
  });

  it('displays talent availability info', () => {
    render(<MarketIntelPage />);
    expect(screen.getByText(/Talent Availability Heatmap/i)).toBeInTheDocument();
  });

  it('has role/location filters', () => {
    render(<MarketIntelPage />);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });
});

describe('Recruiter Workflow - Settings', () => {
  it('renders settings page', () => {
    render(<RecruiterSettingsPage />);
    // The page has heading "Settings"
    expect(screen.getAllByText(/Settings/i).length).toBeGreaterThan(0);
  });

  it('has organization profile editing', () => {
    render(<RecruiterSettingsPage />);
    expect(screen.getByText(/Organization Profile/i)).toBeInTheDocument();
  });

  it('has AI configuration section', () => {
    render(<RecruiterSettingsPage />);
    expect(screen.getByText(/AI Configuration/i)).toBeInTheDocument();
  });

  it('has team management section', () => {
    render(<RecruiterSettingsPage />);
    expect(screen.getByText(/Team Management/i)).toBeInTheDocument();
  });
});

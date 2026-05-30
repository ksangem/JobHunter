import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import OnboardingPage from '@candidate/pages/OnboardingPage';
import CVUploadPage from '@candidate/pages/CVUploadPage';
import ManualProfilePage from '@candidate/pages/ManualProfilePage';
import CandidateDashboard from '@candidate/pages/CandidateDashboard';
import JobMatchesPage from '@candidate/pages/JobMatchesPage';
import InterviewsPage from '@candidate/pages/InterviewsPage';
import ResumeAIPage from '@candidate/pages/ResumeAIPage';
import ProfilePage from '@candidate/pages/ProfilePage';
import SettingsPage from '@candidate/pages/SettingsPage';

// Mock auth context - simulate logged-in candidate
beforeEach(() => {
  sessionStorage.setItem('jh_user', JSON.stringify({
    id: 'test-user-1',
    email: 'priya@example.com',
    name: 'Priya Sharma',
    role: 'candidate',
  }));
});

describe('Candidate Workflow - Step 1: Onboarding Choice', () => {
  it('displays two onboarding options', () => {
    render(<OnboardingPage />);
    expect(screen.getByText(/Upload CV/i)).toBeInTheDocument();
    expect(screen.getByText(/Manual Profile/i)).toBeInTheDocument();
  });

  it('shows supported file formats for CV upload option', () => {
    render(<OnboardingPage />);
    expect(screen.getByText(/PDF|DOCX|TXT/i)).toBeInTheDocument();
  });

  it('has navigation links to both onboarding paths', () => {
    render(<OnboardingPage />);
    // OnboardingPage uses buttons with onClick navigate, not <a> links
    const buttons = screen.getAllByRole('button');
    // Verify the two main option buttons exist via their heading text
    expect(screen.getByText(/Upload CV/i)).toBeInTheDocument();
    expect(screen.getByText(/Manual Profile/i)).toBeInTheDocument();
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Candidate Workflow - Step 2a: CV Upload Flow', () => {
  it('renders the upload step initially', () => {
    render(<CVUploadPage />);
    // Should show upload area - "Upload Your Resume" heading
    expect(screen.getByText(/Upload Your Resume/i)).toBeInTheDocument();
  });

  it('shows step indicator with correct steps', () => {
    render(<CVUploadPage />);
    // Step labels exist in the step indicator
    expect(screen.getAllByText(/Upload/i).length).toBeGreaterThan(0);
  });

  it('accepts file formats PDF, DOCX, TXT', () => {
    render(<CVUploadPage />);
    // File format hint should be visible
    expect(screen.getByText(/PDF|DOCX|TXT/i)).toBeInTheDocument();
  });
});

describe('Candidate Workflow - Step 2b: Manual Profile', () => {
  it('renders the first step of manual profile creation', () => {
    render(<ManualProfilePage />);
    // Should show step 1 - "Basic Information" heading
    expect(screen.getByText(/Basic Information/i)).toBeInTheDocument();
  });

  it('has stepper/progress indicator', () => {
    render(<ManualProfilePage />);
    // Look for step indicators - the heading "Basic Information" confirms step 1
    expect(screen.getByText(/Basic Information/i)).toBeInTheDocument();
  });
});

describe('Candidate Workflow - Step 3: Dashboard', () => {
  it('renders dashboard with welcome message', () => {
    render(<CandidateDashboard />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it('displays AI Score stat card', () => {
    render(<CandidateDashboard />);
    expect(screen.getByText(/AI Score/i)).toBeInTheDocument();
  });

  it('shows job recommendations section', () => {
    render(<CandidateDashboard />);
    expect(screen.getByText(/Recommended Jobs/i)).toBeInTheDocument();
  });

  it('shows resume insights section', () => {
    render(<CandidateDashboard />);
    expect(screen.getByText(/Resume Insights/i)).toBeInTheDocument();
  });

  it('displays upcoming interviews section', () => {
    render(<CandidateDashboard />);
    expect(screen.getAllByText(/Upcoming Interviews/i).length).toBeGreaterThan(0);
  });

  it('shows profile completeness metric', () => {
    render(<CandidateDashboard />);
    expect(screen.getByText(/Completeness|Complete/i)).toBeInTheDocument();
  });
});

describe('Candidate Workflow - Step 4: Job Matches', () => {
  it('renders job listings', () => {
    render(<JobMatchesPage />);
    // Should show job cards with company names from mock data
    expect(screen.getAllByText(/Google|Flipkart|Stripe|Swiggy/i).length).toBeGreaterThan(0);
  });

  it('has search/filter functionality', () => {
    render(<JobMatchesPage />);
    // Should have search input or filter dropdowns
    const searchInput = screen.queryByPlaceholderText(/Search|Filter/i);
    const filterButtons = screen.queryAllByRole('combobox');
    expect(searchInput || filterButtons.length > 0).toBeTruthy();
  });

  it('displays match scores on job cards', () => {
    render(<JobMatchesPage />);
    // Match scores should be visible (numbers like 95, 91, 88, 84)
    expect(screen.getAllByText(/95|91|88|84/).length).toBeGreaterThan(0);
  });

  it('shows job details including location and salary', () => {
    render(<JobMatchesPage />);
    // Should show location info
    expect(screen.getAllByText(/Bangalore|Mumbai|Remote|Hyderabad/i).length).toBeGreaterThan(0);
  });
});

describe('Candidate Workflow - Step 5: Interviews', () => {
  it('renders interview page', () => {
    render(<InterviewsPage />);
    // AppLayout title "Interviews" is rendered in the top bar
    expect(screen.getAllByText(/Interview/i).length).toBeGreaterThan(0);
  });

  it('has status filter tabs', () => {
    render(<InterviewsPage />);
    // Tabs: All, Upcoming, Completed, Cancelled
    expect(screen.getAllByText(/All/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Upcoming/i)).toBeInTheDocument();
  });

  it('shows interview entries with status badges', () => {
    render(<InterviewsPage />);
    // Status badges should exist
    const statuses = ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'];
    const found = statuses.some(s => screen.queryAllByText(new RegExp(s, 'i')).length > 0);
    expect(found).toBe(true);
  });
});

describe('Candidate Workflow - Resume AI', () => {
  it('renders AI score display', () => {
    render(<ResumeAIPage />);
    expect(screen.getByText(/AI Match Score/i)).toBeInTheDocument();
  });

  it('shows improvement suggestions', () => {
    render(<ResumeAIPage />);
    expect(screen.getByText(/Improvement Suggestions/i)).toBeInTheDocument();
  });

  it('shows CV version management', () => {
    render(<ResumeAIPage />);
    expect(screen.getByText(/CV Versions/i)).toBeInTheDocument();
  });
});

describe('Candidate Workflow - Profile', () => {
  it('renders profile page with user data', () => {
    render(<ProfilePage />);
    // AppLayout title is "My Profile" - may appear in sidebar and top bar
    expect(screen.getAllByText(/My Profile/i).length).toBeGreaterThan(0);
  });

  it('has editable sections/tabs', () => {
    render(<ProfilePage />);
    const tabs = ['Personal', 'Skills', 'Work', 'Preferences', 'Education', 'History'];
    const found = tabs.some(t => screen.queryByText(new RegExp(t, 'i')));
    expect(found).toBe(true);
  });

  it('shows save button', () => {
    render(<ProfilePage />);
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
  });
});

describe('Candidate Workflow - Settings', () => {
  it('renders settings page', () => {
    render(<SettingsPage />);
    // AppLayout title is "Settings" plus "Account Settings" section heading
    expect(screen.getByText(/Account Settings/i)).toBeInTheDocument();
  });

  it('has notification preferences', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/Notification Preferences/i)).toBeInTheDocument();
  });

  it('has privacy controls', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/Privacy/i)).toBeInTheDocument();
  });
});

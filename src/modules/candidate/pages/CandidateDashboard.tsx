import { type FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Target,
  BriefcaseBusiness,
  Calendar,
  MapPin,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  FileSearch,
} from 'lucide-react';
import { AppLayout, StatCard, ScoreBadge } from '@shared/components';
import { useAuth } from '@shared/hooks/useAuth';
import {
  mockCandidateProfile,
  mockJobRecommendations,
  mockResumeImprovements,
} from '@shared/data/mockData';
import { candidateSidebarItems } from '../components/sidebarConfig';

const impactColors = {
  high: 'bg-danger-50 text-danger-600',
  medium: 'bg-warning-50 text-warning-600',
  low: 'bg-success-50 text-success-600',
} as const;

const categoryIcons = {
  skills_gap: TrendingUp,
  formatting: FileSearch,
  keywords: Lightbulb,
  experience: AlertCircle,
} as const;

// Mock upcoming interviews
const upcomingInterviews = [
  {
    id: 'int-001',
    date: '2026-06-02T10:00:00Z',
    company: 'Google',
    role: 'Staff Software Engineer - Frontend',
  },
  {
    id: 'int-002',
    date: '2026-06-03T14:30:00Z',
    company: 'Flipkart',
    role: 'Senior Full-Stack Developer',
  },
];

const CandidateDashboard: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = mockCandidateProfile;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AppLayout
      sidebarItems={candidateSidebarItems}
      title="Dashboard"
      userRole="candidate"
    >
      {/* Welcome header */}
      <div className="mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-surface-900">
          Welcome back, {user?.name ?? 'Candidate'}
        </h2>
        <p className="text-sm text-surface-500">{today}</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 lg:mb-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="AI Score"
          value={profile.aiScore}
          change="+3 this week"
          trend="up"
          icon={Sparkles}
        />
        <StatCard
          title="Profile Completeness"
          value={`${profile.profileCompleteness}%`}
          change="+8% this month"
          trend="up"
          icon={Target}
        />
        <StatCard
          title="Active Matches"
          value={mockJobRecommendations.length}
          change="2 new today"
          trend="up"
          icon={BriefcaseBusiness}
        />
        <StatCard
          title="Upcoming Interviews"
          value={upcomingInterviews.length}
          change="Next in 3 days"
          trend="neutral"
          icon={Calendar}
        />
      </div>

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
        {/* Recommended Jobs - spans 2 cols */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900">Recommended Jobs</h3>
            <Link
              to="/candidate/jobs"
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {mockJobRecommendations.slice(0, 3).map((job) => (
              <div
                key={job.id}
                onClick={() => navigate('/candidate/jobs')}
                className="cursor-pointer rounded-xl border border-surface-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-surface-900">{job.title}</h4>
                    <p className="text-sm text-surface-500">{job.company}</p>
                  </div>
                  <ScoreBadge score={job.matchScore} size="sm" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-surface-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                  <span>{job.salary}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-400">
                      +{job.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Resume Insights */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">Resume Insights</h3>
              <Link
                to="/candidate/resume-ai"
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {mockResumeImprovements.slice(0, 3).map((item, idx) => {
                const Icon = categoryIcons[item.category];
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-surface-500">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-surface-700 line-clamp-2">
                        {item.suggestion}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${impactColors[item.impact]}`}
                      >
                        {item.impact} impact
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">Upcoming Interviews</h3>
              <Link
                to="/candidate/interviews"
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingInterviews.map((interview) => {
                const d = new Date(interview.date);
                return (
                  <div
                    key={interview.id}
                    className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                        <span className="text-xs font-semibold uppercase">
                          {d.toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold leading-none">
                          {d.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-surface-900">
                          {interview.company}
                        </p>
                        <p className="text-sm text-surface-500">{interview.role}</p>
                        <p className="mt-1 text-xs text-surface-400">
                          {d.toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CandidateDashboard;

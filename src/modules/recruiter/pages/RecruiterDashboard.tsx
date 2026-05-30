import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Sparkles,
  Phone,
  BarChart3,
  MapPin,
  Building2,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { AppLayout, StatCard, ScoreBadge } from '@shared/components';
import { useAuth } from '@shared/hooks/useAuth';
import {
  mockOrganization,
  mockJobDescriptions,
  mockPipelineCandidates,
  mockInterviews,
  mockAnalytics,
} from '@shared/data/mockData';
import { recruiterSidebarItems } from '../components/sidebarConfig';

const stageColors: Record<string, string> = {
  shortlisted: 'bg-primary-100 text-primary-700',
  contacted: 'bg-accent-100 text-accent-700',
  screened: 'bg-warning-100 text-warning-700',
  interview_scheduled: 'bg-success-100 text-success-700',
  offer: 'bg-success-50 text-success-600',
  closed: 'bg-surface-100 text-surface-600',
};

const stageLabels: Record<string, string> = {
  shortlisted: 'Shortlisted',
  contacted: 'Contacted',
  screened: 'Screened',
  interview_scheduled: 'Interview',
  offer: 'Offer',
  closed: 'Closed',
};

const statusBadge: Record<string, string> = {
  active: 'bg-success-100 text-success-700',
  draft: 'bg-warning-100 text-warning-700',
  paused: 'bg-surface-100 text-surface-600',
  closed: 'bg-danger-100 text-danger-700',
};

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const RecruiterDashboard: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeJDs = mockJobDescriptions.filter((jd) => jd.status === 'active');
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const recentPipeline = [...mockPipelineCandidates]
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
    .slice(0, 5);

  const upcomingInterviews = mockInterviews
    .filter((i) => i.status === 'scheduled' || i.status === 'rescheduled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  const quickActions = [
    { label: 'Post New JD', icon: Plus, path: '/recruiter/jobs', color: 'bg-primary-50 text-primary-600' },
    { label: 'AI Shortlist', icon: Sparkles, path: '/recruiter/pipeline', color: 'bg-accent-50 text-accent-600' },
    { label: 'Voice Outreach', icon: Phone, path: '/recruiter/voice-ai', color: 'bg-success-50 text-success-600' },
    { label: 'View Analytics', icon: BarChart3, path: '/recruiter/analytics', color: 'bg-warning-50 text-warning-600' },
  ];

  return (
    <AppLayout sidebarItems={recruiterSidebarItems} title="Dashboard" userRole="recruiter">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-surface-900">
            Welcome back, {user?.name ?? 'Recruiter'}
          </h2>
          <p className="mt-1 text-sm text-surface-500">
            {mockOrganization.name} &middot; {today}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active JDs"
            value={activeJDs.length}
            change="+1 this week"
            trend="up"
            icon={FileText}
          />
          <StatCard
            title="Total Candidates"
            value={mockAnalytics.totalCandidates}
            change="+12 this week"
            trend="up"
            icon={Users}
          />
          <StatCard
            title="Avg Time to Hire"
            value={`${mockAnalytics.timeToHire} days`}
            change="-2 days"
            trend="up"
            icon={Clock}
          />
          <StatCard
            title="Pipeline Conversion"
            value={`${mockAnalytics.pipelineConversion}%`}
            change="+3%"
            trend="up"
            icon={TrendingUp}
          />
        </div>

        {/* Active Job Descriptions */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900">Active Job Descriptions</h3>
            <button
              onClick={() => navigate('/recruiter/jobs')}
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeJDs.slice(0, 3).map((jd) => (
              <div
                key={jd.id}
                className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h4 className="font-semibold text-surface-900">{jd.title}</h4>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[jd.status]}`}
                  >
                    {jd.status}
                  </span>
                </div>
                <div className="mb-4 space-y-1.5 text-sm text-surface-500">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {jd.department}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {jd.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {jd.matchedCandidates} matched candidates
                  </div>
                </div>
                <button
                  onClick={() => navigate('/recruiter/pipeline')}
                  className="w-full rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100"
                >
                  View Pipeline
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Pipeline Activity */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-surface-900">Recent Pipeline Activity</h3>
          <div className="rounded-xl border border-surface-200 bg-white shadow-sm">
            <div className="divide-y divide-surface-100">
              {recentPipeline.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-surface-50 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {c.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{c.name}</p>
                      <p className="text-xs text-surface-500">{c.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-12 sm:gap-4 sm:pl-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColors[c.stage]}`}
                    >
                      {stageLabels[c.stage]}
                    </span>
                    <ScoreBadge score={c.matchScore} size="sm" />
                    <span className="text-xs text-surface-400">{formatRelativeTime(c.lastActivity)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <section>
            <h3 className="mb-4 text-lg font-semibold text-surface-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-surface-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ${action.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-surface-700">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Upcoming Interviews */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">Upcoming Interviews</h3>
              <button
                onClick={() => navigate('/recruiter/interviews')}
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View All <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {upcomingInterviews.map((iv) => (
                <div
                  key={iv.id}
                  className="flex flex-col gap-3 rounded-xl border border-surface-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{iv.candidateName}</p>
                      <p className="text-xs text-surface-500">{iv.jdTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-surface-700">
                      {formatDateTime(iv.scheduledAt)}
                    </p>
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        iv.status === 'scheduled'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-warning-100 text-warning-700'
                      }`}
                    >
                      {iv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default RecruiterDashboard;

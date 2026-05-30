import { useState, useMemo, type FC } from 'react';
import {
  Calendar,
  Video,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { AppLayout, EmptyState } from '@shared/components';
import { candidateSidebarItems } from '../components/sidebarConfig';

type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';

interface CandidateInterview {
  id: string;
  date: string;
  company: string;
  role: string;
  status: InterviewStatus;
  type: string;
  notes?: string;
}

const mockCandidateInterviews: CandidateInterview[] = [
  {
    id: 'ci-001',
    date: '2026-06-02T10:00:00Z',
    company: 'Google',
    role: 'Staff Software Engineer - Frontend',
    status: 'scheduled',
    type: 'Technical Round',
    notes: 'System design + coding round. 90 minutes.',
  },
  {
    id: 'ci-002',
    date: '2026-06-03T14:30:00Z',
    company: 'Flipkart',
    role: 'Senior Full-Stack Developer',
    status: 'scheduled',
    type: 'HR Round',
    notes: 'Culture fit and compensation discussion.',
  },
  {
    id: 'ci-003',
    date: '2026-05-28T11:00:00Z',
    company: 'Stripe',
    role: 'Platform Engineer',
    status: 'rescheduled',
    type: 'Technical Round',
    notes: 'Rescheduled from May 25. Focus on distributed systems.',
  },
  {
    id: 'ci-004',
    date: '2026-05-22T10:00:00Z',
    company: 'Swiggy',
    role: 'Senior React Developer',
    status: 'completed',
    type: 'Technical Round',
    notes: 'Went well. Positive feedback on React architecture knowledge.',
  },
  {
    id: 'ci-005',
    date: '2026-05-15T09:00:00Z',
    company: 'PhonePe',
    role: 'Backend Engineer - Payments',
    status: 'cancelled',
    type: 'Screening Call',
    notes: 'Position was filled internally.',
  },
];

const tabs = ['All', 'Upcoming', 'Completed', 'Cancelled'] as const;
type Tab = (typeof tabs)[number];

const statusConfig: Record<
  InterviewStatus,
  { label: string; color: string; icon: typeof Calendar }
> = {
  scheduled: { label: 'Scheduled', color: 'bg-primary-50 text-primary-700', icon: Clock },
  completed: {
    label: 'Completed',
    color: 'bg-success-50 text-success-600',
    icon: CheckCircle2,
  },
  cancelled: { label: 'Cancelled', color: 'bg-danger-50 text-danger-600', icon: XCircle },
  no_show: {
    label: 'No Show',
    color: 'bg-danger-50 text-danger-600',
    icon: AlertTriangle,
  },
  rescheduled: {
    label: 'Rescheduled',
    color: 'bg-warning-50 text-warning-600',
    icon: RefreshCw,
  },
};

const InterviewsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const filtered = useMemo(() => {
    return mockCandidateInterviews.filter((i) => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Upcoming')
        return i.status === 'scheduled' || i.status === 'rescheduled';
      if (activeTab === 'Completed') return i.status === 'completed';
      if (activeTab === 'Cancelled')
        return i.status === 'cancelled' || i.status === 'no_show';
      return true;
    });
  }, [activeTab]);

  return (
    <AppLayout
      sidebarItems={candidateSidebarItems}
      title="Interviews"
      userRole="candidate"
    >
      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-surface-100 p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-surface-900 shadow-sm'
                : 'text-surface-500 hover:text-surface-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Interview List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews found"
          description="You don't have any interviews matching this filter."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((interview) => {
            const d = new Date(interview.date);
            const cfg = statusConfig[interview.status];
            const StatusIcon = cfg.icon;
            const isActionable =
              interview.status === 'scheduled' ||
              interview.status === 'rescheduled';

            return (
              <div
                key={interview.id}
                className="rounded-xl border border-surface-200 bg-white p-4 sm:p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    {/* Date block */}
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <span className="text-xs font-semibold uppercase">
                        {d.toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                      <span className="text-xl font-bold leading-none">
                        {d.getDate()}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-surface-900">
                        {interview.company}
                      </h4>
                      <p className="text-sm text-surface-500">{interview.role}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-surface-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {d.toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="h-3.5 w-3.5" />
                          {interview.type}
                        </span>
                      </div>
                      {interview.notes && (
                        <p className="mt-2 text-xs text-surface-400">
                          {interview.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status badge */}
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.color}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {cfg.label}
                    </span>

                    {/* Action buttons */}
                    {isActionable && (
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700">
                          Confirm
                        </button>
                        <button className="rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-medium text-surface-600 transition-colors hover:bg-surface-50">
                          Reschedule
                        </button>
                        <button className="rounded-lg border border-danger-200 px-3 py-1.5 text-xs font-medium text-danger-600 transition-colors hover:bg-danger-50">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

export default InterviewsPage;

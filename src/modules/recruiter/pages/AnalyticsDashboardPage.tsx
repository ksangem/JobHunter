import { type FC } from 'react';
import {
  Clock,
  Calendar,
  Target,
  TrendingUp,
  Phone,
  Mail,
  DollarSign,
  Users,
  Briefcase,
  BarChart3,
} from 'lucide-react';
import { AppLayout, StatCard } from '@shared/components';
import { mockAnalytics, mockJobDescriptions, mockPipelineCandidates } from '@shared/data/mockData';
import { recruiterSidebarItems } from '../components/sidebarConfig';

const funnelStages = [
  { label: 'Sourced', count: 142, color: 'bg-primary-500' },
  { label: 'Shortlisted', count: 85, color: 'bg-primary-400' },
  { label: 'Contacted', count: 62, color: 'bg-accent-500' },
  { label: 'Screened', count: 38, color: 'bg-warning-500' },
  { label: 'Interviewed', count: 22, color: 'bg-success-400' },
  { label: 'Offered', count: 8, color: 'bg-success-500' },
  { label: 'Hired', count: 5, color: 'bg-success-600' },
];

const monthlyHires = [
  { month: 'Jan', count: 3 },
  { month: 'Feb', count: 5 },
  { month: 'Mar', count: 4 },
  { month: 'Apr', count: 7 },
  { month: 'May', count: 6 },
  { month: 'Jun', count: 2 },
];

const AnalyticsDashboardPage: FC = () => {
  const maxFunnel = funnelStages[0].count;
  const maxMonthly = Math.max(...monthlyHires.map((m) => m.count));

  const activeJDs = mockJobDescriptions.filter((jd) => jd.status === 'active');
  const topJDs = [...mockJobDescriptions]
    .filter((jd) => jd.matchedCandidates > 0)
    .sort((a, b) => {
      const aConv = mockPipelineCandidates.filter(
        (c) => c.jdId === a.id && (c.stage === 'offer' || c.stage === 'closed')
      ).length;
      const bConv = mockPipelineCandidates.filter(
        (c) => c.jdId === b.id && (c.stage === 'offer' || c.stage === 'closed')
      ).length;
      return bConv / (b.matchedCandidates || 1) - aConv / (a.matchedCandidates || 1);
    })
    .slice(0, 5);

  const candidatesThisWeek = 18;
  const interviewsThisWeek = 5;
  const candidatesThisMonth = 62;
  const interviewsThisMonth = 14;

  return (
    <AppLayout sidebarItems={recruiterSidebarItems} title="Analytics" userRole="recruiter">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-surface-900">Analytics Dashboard</h2>
          <p className="mt-1 text-sm text-surface-500">
            Track your hiring performance and optimize your recruitment pipeline
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Time to Hire"
            value={`${mockAnalytics.timeToHire} days`}
            change="-2 days vs last month"
            trend="up"
            icon={Clock}
          />
          <StatCard
            title="Time to First Interview"
            value={`${mockAnalytics.timeToFirstInterview} days`}
            change="-1 day"
            trend="up"
            icon={Calendar}
          />
          <StatCard
            title="Match Accuracy"
            value={`${mockAnalytics.matchAccuracy}%`}
            change="+3% improvement"
            trend="up"
            icon={Target}
          />
          <StatCard
            title="Pipeline Conversion"
            value={`${mockAnalytics.pipelineConversion}%`}
            change="+5% this quarter"
            trend="up"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-50 text-success-600">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Voice Response Rate</p>
                <p className="text-xl font-bold text-surface-900">{mockAnalytics.voiceResponseRate}%</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Email Open Rate</p>
                <p className="text-xl font-bold text-surface-900">{mockAnalytics.emailOpenRate}%</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-50 text-warning-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-surface-500">Cost Per Placement</p>
                <p className="text-xl font-bold text-surface-900">$2,400</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Funnel */}
        <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-surface-900">Pipeline Funnel</h3>
          <div className="space-y-3">
            {funnelStages.map((stage, i) => {
              const widthPct = Math.max((stage.count / maxFunnel) * 100, 8);
              const dropOff =
                i > 0
                  ? Math.round(
                      ((funnelStages[i - 1].count - stage.count) / funnelStages[i - 1].count) * 100
                    )
                  : 0;
              return (
                <div key={stage.label} className="flex items-center gap-4">
                  <span className="w-20 shrink-0 text-xs font-medium text-surface-700 sm:w-24 sm:text-sm">{stage.label}</span>
                  <div className="flex-1">
                    <div
                      className={`flex h-8 items-center rounded-lg px-3 ${stage.color} transition-all`}
                      style={{ width: `${widthPct}%` }}
                    >
                      <span className="text-xs font-bold text-white">{stage.count}</span>
                    </div>
                  </div>
                  <span className="w-16 text-right text-xs text-surface-400">
                    {i > 0 ? `-${dropOff}%` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Hiring Trends */}
          <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-surface-900">Hiring Trends</h3>
            <div className="flex items-end gap-3" style={{ height: 200 }}>
              {monthlyHires.map((m) => {
                const heightPct = (m.count / maxMonthly) * 100;
                return (
                  <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-surface-700">{m.count}</span>
                    <div className="w-full flex items-end" style={{ height: 160 }}>
                      <div
                        className="w-full rounded-t-lg bg-primary-500 transition-all hover:bg-primary-600"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-surface-500">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recruiter Productivity */}
          <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-surface-900">Recruiter Productivity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-surface-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-surface-500">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">This Week</span>
                </div>
                <p className="text-2xl font-bold text-surface-900">{candidatesThisWeek}</p>
                <p className="text-xs text-surface-500">candidates processed</p>
              </div>
              <div className="rounded-lg bg-surface-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-surface-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">This Week</span>
                </div>
                <p className="text-2xl font-bold text-surface-900">{interviewsThisWeek}</p>
                <p className="text-xs text-surface-500">interviews scheduled</p>
              </div>
              <div className="rounded-lg bg-surface-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-surface-500">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">This Month</span>
                </div>
                <p className="text-2xl font-bold text-surface-900">{candidatesThisMonth}</p>
                <p className="text-xs text-surface-500">candidates processed</p>
              </div>
              <div className="rounded-lg bg-surface-50 p-4">
                <div className="mb-1 flex items-center gap-2 text-surface-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">This Month</span>
                </div>
                <p className="text-2xl font-bold text-surface-900">{interviewsThisMonth}</p>
                <p className="text-xs text-surface-500">interviews scheduled</p>
              </div>
            </div>
          </section>
        </div>

        {/* Top Performing JDs */}
        <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
          <h3 className="mb-4 text-lg font-semibold text-surface-900">Top Performing JDs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 text-xs font-semibold uppercase tracking-wider text-surface-500">
                  <th className="pb-3 text-left">Job Title</th>
                  <th className="pb-3 text-left">Department</th>
                  <th className="pb-3 text-right">Matched</th>
                  <th className="pb-3 text-right">In Pipeline</th>
                  <th className="pb-3 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {topJDs.map((jd) => {
                  const inPipeline = mockPipelineCandidates.filter((c) => c.jdId === jd.id).length;
                  const converted = mockPipelineCandidates.filter(
                    (c) => c.jdId === jd.id && (c.stage === 'offer' || c.stage === 'closed')
                  ).length;
                  const convRate =
                    jd.matchedCandidates > 0
                      ? Math.round((converted / jd.matchedCandidates) * 100)
                      : 0;
                  return (
                    <tr key={jd.id} className="transition-colors hover:bg-surface-50">
                      <td className="py-3 text-sm font-medium text-surface-900">{jd.title}</td>
                      <td className="py-3 text-sm text-surface-600">{jd.department}</td>
                      <td className="py-3 text-right text-sm font-medium text-surface-700">
                        {jd.matchedCandidates}
                      </td>
                      <td className="py-3 text-right text-sm font-medium text-surface-700">
                        {inPipeline}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            convRate >= 5
                              ? 'bg-success-100 text-success-700'
                              : convRate > 0
                                ? 'bg-warning-100 text-warning-700'
                                : 'bg-surface-100 text-surface-500'
                          }`}
                        >
                          {convRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default AnalyticsDashboardPage;

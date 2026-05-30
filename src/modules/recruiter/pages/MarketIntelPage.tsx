import { useState, type FC } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Users,
  Building2,
  DollarSign,
  Filter,
} from 'lucide-react';
import { AppLayout } from '@shared/components';
import { mockMarketIntelligence, locationOptions } from '@shared/data/mockData';
import { recruiterSidebarItems } from '../components/sidebarConfig';

const trendConfig = {
  rising: { icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50', label: 'Rising' },
  stable: { icon: Minus, color: 'text-warning-600', bg: 'bg-warning-50', label: 'Stable' },
  declining: { icon: TrendingDown, color: 'text-danger-600', bg: 'bg-danger-50', label: 'Declining' },
};

const skillDemand = [
  { skill: 'React', demand: 'high' as const },
  { skill: 'TypeScript', demand: 'high' as const },
  { skill: 'Python', demand: 'high' as const },
  { skill: 'Node.js', demand: 'high' as const },
  { skill: 'AWS', demand: 'high' as const },
  { skill: 'Kubernetes', demand: 'medium' as const },
  { skill: 'Docker', demand: 'medium' as const },
  { skill: 'GraphQL', demand: 'medium' as const },
  { skill: 'Go', demand: 'medium' as const },
  { skill: 'PostgreSQL', demand: 'medium' as const },
  { skill: 'Terraform', demand: 'low' as const },
  { skill: 'Selenium', demand: 'low' as const },
  { skill: 'Power BI', demand: 'low' as const },
];

const demandBadge = {
  high: 'bg-success-100 text-success-700',
  medium: 'bg-warning-100 text-warning-700',
  low: 'bg-surface-100 text-surface-600',
};

const talentHeatmap = [
  { location: 'Bangalore', roles: { 'React Dev': 520, 'Python': 380, 'DevOps': 190, 'Data': 280 } },
  { location: 'Hyderabad', roles: { 'React Dev': 340, 'Python': 450, 'DevOps': 140, 'Data': 320 } },
  { location: 'Pune', roles: { 'React Dev': 280, 'Python': 210, 'DevOps': 250, 'Data': 180 } },
  { location: 'Delhi', roles: { 'React Dev': 210, 'Python': 190, 'DevOps': 120, 'Data': 420 } },
  { location: 'Remote', roles: { 'React Dev': 850, 'Python': 720, 'DevOps': 480, 'Data': 560 } },
];

const heatmapMax = Math.max(
  ...talentHeatmap.flatMap((l) => Object.values(l.roles))
);

function getHeatColor(value: number): string {
  const ratio = value / heatmapMax;
  if (ratio >= 0.7) return 'bg-primary-600 text-white';
  if (ratio >= 0.5) return 'bg-primary-400 text-white';
  if (ratio >= 0.3) return 'bg-primary-200 text-primary-800';
  return 'bg-primary-50 text-primary-700';
}

const MarketIntelPage: FC = () => {
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const roles = [...new Set(mockMarketIntelligence.map((m) => m.role))];

  const filtered = mockMarketIntelligence.filter((m) => {
    if (roleFilter && m.role !== roleFilter) return false;
    if (locationFilter && m.location !== locationFilter) return false;
    return true;
  });

  const formatSalary = (amount: number) => {
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`;
    return `${(amount / 100000).toFixed(1)}L`;
  };

  const maxSalary = Math.max(...mockMarketIntelligence.map((m) => m.avgSalary));

  return (
    <AppLayout sidebarItems={recruiterSidebarItems} title="Market Intelligence" userRole="recruiter">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-surface-900">Market Intelligence</h2>
          <p className="mt-1 text-sm text-surface-500">
            Salary benchmarks, talent availability, and competitive insights
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-surface-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Locations</option>
            {locationOptions.slice(0, 10).map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          {(roleFilter || locationFilter) && (
            <button
              onClick={() => {
                setRoleFilter('');
                setLocationFilter('');
              }}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Market Data Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, idx) => {
            const trend = trendConfig[item.demandTrend];
            const TrendIcon = trend.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-surface-900">{item.role}</h4>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-surface-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${trend.bg} ${trend.color}`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {trend.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-surface-400">
                      <DollarSign className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-lg font-bold text-surface-900">{formatSalary(item.avgSalary)}</p>
                    <p className="text-xs text-surface-500">Avg Salary</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-surface-400">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-lg font-bold text-surface-900">{item.availableTalent.toLocaleString()}</p>
                    <p className="text-xs text-surface-500">Available</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-surface-400">
                      <Building2 className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-lg font-bold text-surface-900">{item.competitorHiring}</p>
                    <p className="text-xs text-surface-500">Competitors</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-surface-500">No market data found for the selected filters.</p>
          </div>
        )}

        {/* Salary Benchmarks */}
        <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-surface-900">Salary Benchmarks</h3>
          <div className="space-y-3">
            {mockMarketIntelligence.map((item, idx) => {
              const widthPct = (item.avgSalary / maxSalary) * 100;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 text-xs font-medium text-surface-700 sm:w-48 sm:text-sm">
                    {item.role}
                    <span className="ml-1 text-xs text-surface-400">({item.location})</span>
                  </span>
                  <div className="flex-1">
                    <div className="h-6 w-full overflow-hidden rounded-lg bg-surface-100">
                      <div
                        className="flex h-full items-center rounded-lg bg-primary-500 px-2 transition-all"
                        style={{ width: `${widthPct}%` }}
                      >
                        <span className="text-[10px] font-bold text-white">
                          {formatSalary(item.avgSalary)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Skill Demand Trends */}
          <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
            <h3 className="mb-4 text-lg font-semibold text-surface-900">Skill Demand Trends</h3>
            <div className="space-y-2">
              {skillDemand.map((item) => (
                <div
                  key={item.skill}
                  className="flex items-center justify-between rounded-lg bg-surface-50 px-3.5 py-2.5"
                >
                  <span className="text-sm font-medium text-surface-700">{item.skill}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${demandBadge[item.demand]}`}
                  >
                    {item.demand}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Talent Availability Heatmap */}
          <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
            <h3 className="mb-4 text-lg font-semibold text-surface-900">
              Talent Availability Heatmap
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">
                      Location
                    </th>
                    {Object.keys(talentHeatmap[0].roles).map((role) => (
                      <th
                        key={role}
                        className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-surface-500"
                      >
                        {role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {talentHeatmap.map((row) => (
                    <tr key={row.location}>
                      <td className="py-1 pr-3 text-sm font-medium text-surface-700">
                        {row.location}
                      </td>
                      {Object.values(row.roles).map((val, i) => (
                        <td key={i} className="p-1">
                          <div
                            className={`flex items-center justify-center rounded-lg py-2 text-xs font-bold ${getHeatColor(val)}`}
                          >
                            {val}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-surface-500 sm:gap-4">
              <span>Density:</span>
              <div className="flex items-center gap-1">
                <div className="h-3 w-6 rounded bg-primary-50" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-6 rounded bg-primary-200" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-6 rounded bg-primary-400" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-6 rounded bg-primary-600" />
                <span>Very High</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketIntelPage;

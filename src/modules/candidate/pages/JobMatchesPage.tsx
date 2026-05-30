import { useState, useMemo, type FC } from 'react';
import {
  Search,
  MapPin,
  Bookmark,
  Send,
  Filter,
  Clock,
} from 'lucide-react';
import { AppLayout, ScoreBadge, Modal } from '@shared/components';
import { mockJobRecommendations } from '@shared/data/mockData';
import { candidateSidebarItems } from '../components/sidebarConfig';
import type { JobRecommendation, EmploymentType } from '@shared/types';

const employmentTypes: (EmploymentType | 'All')[] = [
  'All',
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
];

const scoreFilters = [
  { label: 'All', value: 0 },
  { label: '60+', value: 60 },
  { label: '70+', value: 70 },
  { label: '80+', value: 80 },
  { label: '90+', value: 90 },
];

const JobMatchesPage: FC = () => {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<EmploymentType | 'All'>('All');
  const [scoreFilter, setScoreFilter] = useState(0);
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const locations = useMemo(() => {
    const locs = new Set(mockJobRecommendations.map((j) => j.location));
    return ['All', ...Array.from(locs)];
  }, []);

  const filtered = useMemo(() => {
    return mockJobRecommendations.filter((job) => {
      if (
        search &&
        !job.title.toLowerCase().includes(search.toLowerCase()) &&
        !job.company.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (locationFilter !== 'All' && job.location !== locationFilter) return false;
      if (typeFilter !== 'All' && job.type !== typeFilter) return false;
      if (job.matchScore < scoreFilter) return false;
      return true;
    });
  }, [search, locationFilter, typeFilter, scoreFilter]);

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const typeBadgeColor = (type: EmploymentType) => {
    switch (type) {
      case 'Full-time':
        return 'bg-primary-50 text-primary-700';
      case 'Part-time':
        return 'bg-accent-400/10 text-accent-600';
      case 'Contract':
        return 'bg-warning-50 text-warning-600';
      case 'Freelance':
        return 'bg-success-50 text-success-600';
    }
  };

  return (
    <AppLayout
      sidebarItems={candidateSidebarItems}
      title="Job Matches"
      userRole="candidate"
    >
      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title or company..."
            className="w-full rounded-lg border border-surface-300 py-2.5 pl-10 pr-4 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-surface-500">
            <Filter className="h-4 w-4" />
            Filters:
          </div>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'All' ? 'All Locations' : loc}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as EmploymentType | 'All')}
            className="w-full sm:w-auto rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {employmentTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Types' : t}
              </option>
            ))}
          </select>

          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(Number(e.target.value))}
            className="w-full sm:w-auto rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {scoreFilters.map((sf) => (
              <option key={sf.value} value={sf.value}>
                {sf.value === 0 ? 'Any Match Score' : `${sf.label} Match`}
              </option>
            ))}
          </select>

          <span className="ml-auto text-sm text-surface-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="cursor-pointer rounded-xl border border-surface-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1 pr-3">
                <h4 className="font-semibold text-surface-900 line-clamp-1">{job.title}</h4>
                <p className="text-sm text-surface-500">{job.company}</p>
              </div>
              <ScoreBadge score={job.matchScore} size="sm" />
            </div>

            <div className="mb-3 space-y-1.5 text-xs text-surface-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Posted {new Date(job.postedDate).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>

            <p className="mb-3 text-sm font-medium text-surface-700">{job.salary}</p>

            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadgeColor(job.type)}`}
              >
                {job.type}
              </span>
            </div>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {job.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-400">
                  +{job.skills.length - 3}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-600 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <Send className="h-3.5 w-3.5" />
                Apply
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(job.id);
                }}
                className={`rounded-lg border px-3 py-2 transition-colors ${
                  savedJobs.has(job.id)
                    ? 'border-primary-300 bg-primary-50 text-primary-600'
                    : 'border-surface-300 text-surface-400 hover:border-surface-400 hover:text-surface-600'
                }`}
              >
                <Bookmark
                  className="h-4 w-4"
                  fill={savedJobs.has(job.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-12 w-12 text-surface-300" />
          <h3 className="mb-1 text-lg font-semibold text-surface-700">No matches found</h3>
          <p className="text-sm text-surface-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Job Detail Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title ?? ''}
        size="xl"
      >
        {selectedJob && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">
                  {selectedJob.company}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-surface-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedJob.location}
                  </span>
                  <span>{selectedJob.type}</span>
                </div>
              </div>
              <ScoreBadge score={selectedJob.matchScore} size="md" />
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold text-surface-700">Salary</p>
              <p className="text-sm text-surface-600">{selectedJob.salary}</p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-surface-700">Description</p>
              <p className="text-sm leading-relaxed text-surface-600">
                {selectedJob.description}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-surface-700">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 border-t border-surface-100 pt-4">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                <Send className="h-4 w-4" />
                Apply Now
              </button>
              <button
                onClick={() => toggleSave(selectedJob.id)}
                className="flex items-center gap-2 rounded-lg border border-surface-300 px-4 py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50"
              >
                <Bookmark
                  className="h-4 w-4"
                  fill={savedJobs.has(selectedJob.id) ? 'currentColor' : 'none'}
                />
                {savedJobs.has(selectedJob.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
};

export default JobMatchesPage;

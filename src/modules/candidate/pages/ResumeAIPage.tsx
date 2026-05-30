import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  TrendingUp,
  Lightbulb,
  FileSearch,
  AlertCircle,
  Download,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { AppLayout, ScoreBadge, ProgressBar } from '@shared/components';
import {
  mockCandidateProfile,
  mockResumeImprovements,
} from '@shared/data/mockData';
import { candidateSidebarItems } from '../components/sidebarConfig';

const impactColors = {
  high: 'bg-danger-50 text-danger-600',
  medium: 'bg-warning-50 text-warning-600',
  low: 'bg-success-50 text-success-600',
} as const;

const categoryConfig = {
  skills_gap: { icon: TrendingUp, label: 'Skills Gap' },
  formatting: { icon: FileSearch, label: 'Formatting' },
  keywords: { icon: Lightbulb, label: 'Keywords' },
  experience: { icon: AlertCircle, label: 'Experience' },
} as const;

// In-demand skills for the skills analysis section
const inDemandSkills = new Set([
  'React',
  'TypeScript',
  'Python',
  'AWS',
  'Docker',
  'GraphQL',
  'Node.js',
]);

const ResumeAIPage: FC = () => {
  const navigate = useNavigate();
  const profile = mockCandidateProfile;

  return (
    <AppLayout
      sidebarItems={candidateSidebarItems}
      title="Resume AI"
      userRole="candidate"
    >
      {/* Score & Completeness */}
      <div className="mb-6 lg:mb-8 grid gap-4 lg:gap-6 md:grid-cols-2">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-xl border border-surface-200 bg-white p-4 sm:p-6 shadow-sm text-center sm:text-left">
          <ScoreBadge score={profile.aiScore} size="lg" />
          <div>
            <h3 className="text-lg font-bold text-surface-900">AI Match Score</h3>
            <p className="text-sm text-surface-500">
              Your profile competitiveness across target roles
            </p>
            <p className="mt-2 text-xs text-surface-400">
              Top 13% of candidates in your category
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-surface-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-bold text-surface-900">Profile Completeness</h3>
          <ProgressBar
            value={profile.profileCompleteness}
            label="Overall"
            color={profile.profileCompleteness >= 80 ? 'success' : 'warning'}
          />
          <p className="mt-2 text-xs text-surface-400">
            Complete your profile to improve your match score
          </p>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-surface-900">
          Improvement Suggestions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {mockResumeImprovements.map((item, idx) => {
            const config = categoryConfig[item.category];
            const Icon = config.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-100 text-surface-500">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">
                      {config.label}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${impactColors[item.impact]}`}
                  >
                    {item.impact}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-surface-700">
                  {item.suggestion}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-surface-900">Skills Analysis</h3>
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2.5">
            {profile.skills.map((skill) => {
              const isInDemand = inDemandSkills.has(skill);
              return (
                <span
                  key={skill}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                    isInDemand
                      ? 'bg-success-50 text-success-600 ring-1 ring-success-200'
                      : 'bg-surface-100 text-surface-600'
                  }`}
                >
                  {skill}
                  {isInDemand && <Zap className="h-3.5 w-3.5 text-success-500" />}
                </span>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 border-t border-surface-100 pt-4 text-xs text-surface-400">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-success-500" />
              In-demand skill
            </span>
            <span>
              {profile.skills.filter((s) => inDemandSkills.has(s)).length} of{' '}
              {profile.skills.length} skills are trending
            </span>
          </div>
        </div>
      </div>

      {/* CV Versions */}
      <div className="mb-8">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-surface-900">CV Versions</h3>
          <button
            onClick={() => navigate('/candidate/cv-upload')}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            <Upload className="h-4 w-4" />
            Upload New CV
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-sm">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">
                  File Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Uploaded
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {profile.cvVersions.map((cv) => (
                <tr key={cv.id} className="hover:bg-surface-50">
                  <td className="px-5 py-4 text-sm font-medium text-surface-900">
                    {cv.fileName}
                  </td>
                  <td className="px-5 py-4 text-sm text-surface-500">
                    {new Date(cv.uploadedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    {cv.isActive ? (
                      <span className="flex w-fit items-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-semibold text-surface-500">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!cv.isActive && (
                        <button className="rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50">
                          Set Active
                        </button>
                      )}
                      <button className="rounded-lg border border-surface-300 p-1.5 text-surface-400 transition-colors hover:bg-surface-50 hover:text-surface-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResumeAIPage;

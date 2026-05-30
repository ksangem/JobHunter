import { useState, type FC } from 'react';
import {
  Plus,
  Search,
  MapPin,
  Building2,
  Users,
  Calendar,
  Edit3,
  Eye,
  Pause,
  Play,
  Archive,
  Sparkles,
} from 'lucide-react';
import { AppLayout, Modal } from '@shared/components';
import { mockJobDescriptions, skillOptions } from '@shared/data/mockData';
import type { JobDescription, EmploymentType } from '@shared/types';
import { recruiterSidebarItems } from '../components/sidebarConfig';

type TabFilter = 'all' | 'active' | 'draft' | 'paused' | 'closed';

const statusBadge: Record<string, string> = {
  active: 'bg-success-100 text-success-700',
  draft: 'bg-warning-100 text-warning-700',
  paused: 'bg-surface-100 text-surface-600',
  closed: 'bg-danger-100 text-danger-700',
};

const tabs: { label: string; value: TabFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Paused', value: 'paused' },
  { label: 'Closed', value: 'closed' },
];

const employmentTypes: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Freelance'];

const JDManagementPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    expMin: '',
    expMax: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    currency: 'INR',
    employmentType: 'Full-time' as EmploymentType,
  });

  const filtered = mockJobDescriptions.filter((jd) => {
    if (activeTab !== 'all' && jd.status !== activeTab) return false;
    if (searchQuery && !jd.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const resetForm = () => {
    setForm({
      title: '',
      department: '',
      location: '',
      expMin: '',
      expMax: '',
      description: '',
      budgetMin: '',
      budgetMax: '',
      currency: 'INR',
      employmentType: 'Full-time',
    });
    setSelectedSkills([]);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatBudget = (jd: JobDescription) => {
    const fmt = (n: number) => {
      if (jd.budget.currency === 'INR') return `${(n / 100000).toFixed(1)}L`;
      return `$${(n / 1000).toFixed(0)}K`;
    };
    return `${fmt(jd.budget.min)} - ${fmt(jd.budget.max)} ${jd.budget.currency}`;
  };

  return (
    <AppLayout sidebarItems={recruiterSidebarItems} title="Job Descriptions" userRole="recruiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-surface-900">Job Descriptions</h2>
            <p className="mt-1 text-sm text-surface-500">
              Manage your job postings and track candidate matches
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Post New JD
          </button>
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-surface-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? 'bg-white text-surface-900 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job descriptions..."
              className="w-full rounded-lg border border-surface-300 py-2.5 pl-10 pr-4 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:w-72"
            />
          </div>
        </div>

        {/* JD Cards */}
        <div className="space-y-3">
          {filtered.map((jd) => (
            <div
              key={jd.id}
              className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-start gap-3">
                    <h4 className="text-base font-semibold text-surface-900">{jd.title}</h4>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[jd.status]}`}
                    >
                      {jd.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-surface-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {jd.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {jd.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {jd.matchedCandidates} candidates
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(jd.createdAt)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {jd.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {jd.skills.length > 5 && (
                      <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-500">
                        +{jd.skills.length - 5}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-surface-400">
                    {jd.experienceRange.min}-{jd.experienceRange.max} yrs &middot;{' '}
                    {jd.employmentType} &middot; {formatBudget(jd)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="rounded-lg border border-surface-200 p-2 text-surface-500 transition-colors hover:bg-surface-50 hover:text-surface-700">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg border border-surface-200 p-2 text-surface-500 transition-colors hover:bg-surface-50 hover:text-surface-700">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg border border-surface-200 p-2 text-surface-500 transition-colors hover:bg-surface-50 hover:text-surface-700">
                    {jd.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <button className="rounded-lg border border-surface-200 p-2 text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-600">
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-surface-500">No job descriptions found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Create JD Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Post New Job Description" size="xl">
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {/* AI Note */}
          <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-3 text-sm text-primary-700">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>AI will parse and extract matching criteria automatically</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Job Title <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="e.g. Senior React Developer"
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Department */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">Department</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => handleFormChange('department', e.target.value)}
                placeholder="e.g. Engineering"
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                placeholder="e.g. Bangalore"
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Experience Range */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Experience (years)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={form.expMin}
                  onChange={(e) => handleFormChange('expMin', e.target.value)}
                  placeholder="Min"
                  min={0}
                  className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <span className="text-surface-400">-</span>
                <input
                  type="number"
                  value={form.expMax}
                  onChange={(e) => handleFormChange('expMax', e.target.value)}
                  placeholder="Max"
                  min={0}
                  className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* Employment Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Employment Type
              </label>
              <select
                value={form.employmentType}
                onChange={(e) => handleFormChange('employmentType', e.target.value)}
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {employmentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Skills */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Required Skills
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSkillDropdownOpen(!skillDropdownOpen)}
                  className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-left text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {selectedSkills.length > 0
                    ? `${selectedSkills.length} skills selected`
                    : 'Select skills...'}
                </button>
                {skillDropdownOpen && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-surface-200 bg-white py-1 shadow-lg">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`flex w-full items-center gap-2 px-3.5 py-2 text-sm transition-colors hover:bg-surface-50 ${
                          selectedSkills.includes(skill)
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-surface-700'
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            selectedSkills.includes(skill)
                              ? 'border-primary-600 bg-primary-600 text-white'
                              : 'border-surface-300'
                          }`}
                        >
                          {selectedSkills.includes(skill) && (
                            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="ml-0.5 text-primary-400 hover:text-primary-600"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Job Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={4}
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Budget Range */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Budget Range
              </label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={form.currency}
                  onChange={(e) => handleFormChange('currency', e.target.value)}
                  className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:w-24"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <input
                  type="number"
                  value={form.budgetMin}
                  onChange={(e) => handleFormChange('budgetMin', e.target.value)}
                  placeholder="Min"
                  className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <span className="text-surface-400">-</span>
                <input
                  type="number"
                  value={form.budgetMax}
                  onChange={(e) => handleFormChange('budgetMax', e.target.value)}
                  placeholder="Max"
                  className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              Publish Job Description
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default JDManagementPage;

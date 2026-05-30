import { useState, type FC } from 'react';
import {
  User,
  X,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { AppLayout, ScoreBadge } from '@shared/components';
import {
  mockCandidateProfile,
  skillOptions,
  locationOptions,
  roleCategories,
} from '@shared/data/mockData';
import { candidateSidebarItems } from '../components/sidebarConfig';
import type { EmploymentType, EducationEntry, EmploymentEntry } from '@shared/types';

type TabKey = 'personal' | 'skills' | 'work' | 'preferences';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'skills', label: 'Skills & Education' },
  { key: 'work', label: 'Work History' },
  { key: 'preferences', label: 'Preferences' },
];

const ProfilePage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('personal');
  const [toast, setToast] = useState(false);

  // Editable state from mock data
  const [currentRole, setCurrentRole] = useState(mockCandidateProfile.currentRole);
  const [experienceYears, setExperienceYears] = useState(mockCandidateProfile.experienceYears);
  const [experienceMonths, setExperienceMonths] = useState(mockCandidateProfile.experienceMonths);

  const [skills, setSkills] = useState<string[]>([...mockCandidateProfile.skills]);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [certifications, setCertifications] = useState<string[]>([
    ...mockCandidateProfile.certifications,
  ]);
  const [certInput, setCertInput] = useState('');
  const [education, setEducation] = useState<EducationEntry[]>([
    ...mockCandidateProfile.education,
  ]);

  const [employmentHistory, setEmploymentHistory] = useState<EmploymentEntry[]>([
    ...mockCandidateProfile.employmentHistory,
  ]);

  const [preferredLocations, setPreferredLocations] = useState<string[]>([
    ...mockCandidateProfile.preferredLocations,
  ]);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState(
    mockCandidateProfile.expectedSalary?.amount ?? 0
  );
  const [salaryCurrency, setSalaryCurrency] = useState(
    mockCandidateProfile.expectedSalary?.currency ?? 'INR'
  );
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    mockCandidateProfile.employmentType
  );
  const [availability, setAvailability] = useState(
    mockCandidateProfile.availability ?? ''
  );

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const filteredSkills = skillOptions.filter(
    (s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s)
  );

  const filteredLocations = locationOptions.filter(
    (l) =>
      l.toLowerCase().includes(locationInput.toLowerCase()) &&
      !preferredLocations.includes(l)
  );

  return (
    <AppLayout
      sidebarItems={candidateSidebarItems}
      title="My Profile"
      userRole="candidate"
    >
      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg bg-success-500 px-4 py-3 text-sm font-medium text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" />
          Profile saved successfully!
        </div>
      )}

      {/* Profile Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 rounded-xl border border-surface-200 bg-white p-4 sm:p-6 shadow-sm text-center sm:text-left">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <User className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-surface-900">
            {mockCandidateProfile.currentRole}
          </h2>
          <p className="text-sm text-surface-500">
            {mockCandidateProfile.experienceYears}y {mockCandidateProfile.experienceMonths}m experience
          </p>
        </div>
        <div className="text-center">
          <ScoreBadge score={mockCandidateProfile.aiScore} size="md" />
          <p className="mt-1 text-xs font-medium text-surface-500">AI Score</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-surface-100 p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-surface-900 shadow-sm'
                : 'text-surface-500 hover:text-surface-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-surface-200 bg-white p-4 sm:p-6 shadow-sm">
        {/* Personal Info */}
        {activeTab === 'personal' && (
          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-surface-700">
                Current Role
              </label>
              <select
                value={roleCategories.includes(currentRole) ? currentRole : ''}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select role...</option>
                {roleCategories.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">
                  Experience (Years)
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {Array.from({ length: 51 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">
                  Experience (Months)
                </label>
                <select
                  value={experienceMonths}
                  onChange={(e) => setExperienceMonths(Number(e.target.value))}
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Skills & Education */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700">
                Skills
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {skill}
                    <button
                      onClick={() => setSkills((prev) => prev.filter((s) => s !== skill))}
                    >
                      <X className="h-3 w-3 text-primary-400 hover:text-primary-700" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    setShowSkillDropdown(true);
                  }}
                  onFocus={() => setShowSkillDropdown(true)}
                  placeholder="Add a skill..."
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {showSkillDropdown && skillInput && filteredSkills.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-surface-200 bg-white shadow-lg">
                    {filteredSkills.slice(0, 8).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSkills((prev) => [...prev, s]);
                          setSkillInput('');
                          setShowSkillDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-surface-700 hover:bg-primary-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700">
                Certifications
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="flex items-center gap-1 rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600"
                  >
                    {cert}
                    <button
                      onClick={() =>
                        setCertifications((prev) => prev.filter((c) => c !== cert))
                      }
                    >
                      <X className="h-3 w-3 text-success-400 hover:text-success-600" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && certInput.trim()) {
                      e.preventDefault();
                      setCertifications((prev) => [...prev, certInput.trim()]);
                      setCertInput('');
                    }
                  }}
                  placeholder="Add a certification..."
                  className="flex-1 rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button
                  onClick={() => {
                    if (certInput.trim()) {
                      setCertifications((prev) => [...prev, certInput.trim()]);
                      setCertInput('');
                    }
                  }}
                  className="rounded-lg bg-surface-100 px-3 py-2 text-surface-600 hover:bg-surface-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Education */}
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700">
                Education
              </label>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-surface-200 bg-surface-50 p-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="mb-0.5 block text-xs text-surface-500">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx] = { ...edu, institution: e.target.value };
                            setEducation(updated);
                          }}
                          className="w-full rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="mb-0.5 block text-xs text-surface-500">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx] = { ...edu, degree: e.target.value };
                            setEducation(updated);
                          }}
                          className="w-full rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="mb-0.5 block text-xs text-surface-500">
                          Field
                        </label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx] = { ...edu, field: e.target.value };
                            setEducation(updated);
                          }}
                          className="w-full rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="mb-0.5 block text-xs text-surface-500">
                          Year
                        </label>
                        <input
                          type="number"
                          value={edu.year}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx] = { ...edu, year: Number(e.target.value) };
                            setEducation(updated);
                          }}
                          className="w-full rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Work History */}
        {activeTab === 'work' && (
          <div className="space-y-4">
            {employmentHistory.map((entry, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-surface-200 bg-surface-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-surface-700">
                    Position {idx + 1}
                  </span>
                  {employmentHistory.length > 1 && (
                    <button
                      onClick={() =>
                        setEmploymentHistory((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="rounded p-1 text-danger-400 hover:bg-danger-50 hover:text-danger-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-0.5 block text-xs text-surface-500">Company</label>
                    <input
                      type="text"
                      value={entry.company}
                      onChange={(e) => {
                        const updated = [...employmentHistory];
                        updated[idx] = { ...entry, company: e.target.value };
                        setEmploymentHistory(updated);
                      }}
                      className="w-full rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-surface-500">Role</label>
                    <input
                      type="text"
                      value={entry.role}
                      onChange={(e) => {
                        const updated = [...employmentHistory];
                        updated[idx] = { ...entry, role: e.target.value };
                        setEmploymentHistory(updated);
                      }}
                      className="w-full rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-surface-500">Start Date</label>
                    <input
                      type="date"
                      value={entry.startDate}
                      onChange={(e) => {
                        const updated = [...employmentHistory];
                        updated[idx] = { ...entry, startDate: e.target.value };
                        setEmploymentHistory(updated);
                      }}
                      className="w-full rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-surface-500">End Date</label>
                    <input
                      type="date"
                      value={entry.endDate ?? ''}
                      disabled={entry.isCurrent}
                      onChange={(e) => {
                        const updated = [...employmentHistory];
                        updated[idx] = {
                          ...entry,
                          endDate: e.target.value || null,
                        };
                        setEmploymentHistory(updated);
                      }}
                      className="w-full rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={entry.isCurrent}
                    onChange={(e) => {
                      const updated = [...employmentHistory];
                      updated[idx] = {
                        ...entry,
                        isCurrent: e.target.checked,
                        endDate: e.target.checked ? null : entry.endDate,
                      };
                      setEmploymentHistory(updated);
                    }}
                    className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-surface-600">Currently working here</span>
                </label>

                <div>
                  <label className="mb-0.5 block text-xs text-surface-500">Description</label>
                  <textarea
                    rows={3}
                    value={entry.description}
                    onChange={(e) => {
                      const updated = [...employmentHistory];
                      updated[idx] = { ...entry, description: e.target.value };
                      setEmploymentHistory(updated);
                    }}
                    className="w-full rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                setEmploymentHistory((prev) => [
                  ...prev,
                  {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: null,
                    isCurrent: false,
                    description: '',
                  },
                ])
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-surface-300 py-3 text-sm font-medium text-surface-500 transition-colors hover:border-primary-300 hover:text-primary-600"
            >
              <Plus className="h-4 w-4" />
              Add Position
            </button>
          </div>
        )}

        {/* Preferences */}
        {activeTab === 'preferences' && (
          <div className="space-y-5">
            {/* Preferred Locations */}
            <div>
              <label className="mb-1 block text-sm font-medium text-surface-700">
                Preferred Locations <span className="text-danger-500">*</span>
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {preferredLocations.map((loc) => (
                  <span
                    key={loc}
                    className="flex items-center gap-1 rounded-full bg-accent-400/10 px-3 py-1 text-xs font-medium text-accent-600"
                  >
                    {loc}
                    <button
                      onClick={() =>
                        setPreferredLocations((prev) => prev.filter((l) => l !== loc))
                      }
                    >
                      <X className="h-3 w-3 text-accent-400 hover:text-accent-600" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setShowLocationDropdown(true);
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="Search locations..."
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {showLocationDropdown && locationInput && filteredLocations.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-surface-200 bg-white shadow-lg">
                    {filteredLocations.slice(0, 8).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setPreferredLocations((prev) => [...prev, l]);
                          setLocationInput('');
                          setShowLocationDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-surface-700 hover:bg-primary-50"
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expected Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-surface-700">
                  Expected Salary
                </label>
                <input
                  type="number"
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">
                  Currency
                </label>
                <select
                  value={salaryCurrency}
                  onChange={(e) => setSalaryCurrency(e.target.value)}
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Employment Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700">
                Employment Type
              </label>
              <div className="flex flex-wrap gap-3">
                {(['Full-time', 'Part-time', 'Contract', 'Freelance'] as EmploymentType[]).map(
                  (type) => (
                    <label
                      key={type}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                        employmentType === type
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-surface-200 text-surface-600 hover:border-surface-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="employmentType"
                        value={type}
                        checked={employmentType === type}
                        onChange={() => setEmploymentType(type)}
                        className="sr-only"
                      />
                      {type}
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="mb-1 block text-sm font-medium text-surface-700">
                Availability
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Immediate (15-day notice)"
                className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="mt-6 flex justify-end border-t border-surface-100 pt-6">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;

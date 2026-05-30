import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { Logo } from '@shared/components';
import { skillOptions, roleCategories, locationOptions } from '@shared/data/mockData';
import type { EmploymentType, EmploymentEntry } from '@shared/types';

const stepLabels = ['Basic Info', 'Skills & Education', 'Preferences', 'Employment History'];

const ManualProfilePage: FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1
  const [currentRole, setCurrentRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [experienceMonths, setExperienceMonths] = useState(0);

  // Step 2
  const [skills, setSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState('');

  // Step 3
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState('');
  const [salaryCurrency, setSalaryCurrency] = useState('INR');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [availability, setAvailability] = useState('');

  // Step 4
  const [employmentHistory, setEmploymentHistory] = useState<
    (EmploymentEntry & { _key: string })[]
  >([
    {
      _key: crypto.randomUUID(),
      company: '',
      role: '',
      startDate: '',
      endDate: null,
      isCurrent: false,
      description: '',
    },
  ]);

  const filteredSkills = skillOptions.filter(
    (s) =>
      s.toLowerCase().includes(skillSearch.toLowerCase()) && !skills.includes(s)
  );

  const filteredLocations = locationOptions.filter(
    (l) =>
      l.toLowerCase().includes(locationSearch.toLowerCase()) &&
      !preferredLocations.includes(l)
  );

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) setSkills((prev) => [...prev, skill]);
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const addLocation = (loc: string) => {
    if (!preferredLocations.includes(loc))
      setPreferredLocations((prev) => [...prev, loc]);
    setLocationSearch('');
    setShowLocationDropdown(false);
  };

  const addCertification = () => {
    const trimmed = certInput.trim();
    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications((prev) => [...prev, trimmed]);
    }
    setCertInput('');
  };

  const updateEmployment = (
    key: string,
    field: string,
    value: string | boolean | null
  ) => {
    setEmploymentHistory((prev) =>
      prev.map((e) => (e._key === key ? { ...e, [field]: value } : e))
    );
  };

  const addEmployment = () => {
    setEmploymentHistory((prev) => [
      ...prev,
      {
        _key: crypto.randomUUID(),
        company: '',
        role: '',
        startDate: '',
        endDate: null,
        isCurrent: false,
        description: '',
      },
    ]);
  };

  const removeEmployment = (key: string) => {
    if (employmentHistory.length > 1) {
      setEmploymentHistory((prev) => prev.filter((e) => e._key !== key));
    }
  };

  const handleSubmit = () => {
    navigate('/candidate/dashboard');
  };

  const canProceed = (): boolean => {
    if (step === 1) return !!(currentRole || customRole);
    if (step === 2) return skills.length > 0;
    if (step === 3) return preferredLocations.length > 0;
    return true;
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <header className="flex items-center gap-3 border-b border-surface-200 bg-white px-4 sm:px-6 py-4">
        <Logo size="sm" />
      </header>

      <div className="flex flex-1 flex-col items-center px-4 py-8">
        {/* Stepper */}
        <div className="mb-10 flex w-full max-w-lg items-center justify-between">
          {stepLabels.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === step;
            const isCompleted = stepNum < step;
            return (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-success-500 text-white'
                        : isActive
                          ? 'bg-primary-600 text-white'
                          : 'bg-surface-200 text-surface-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNum}
                  </div>
                  <span
                    className={`mt-1.5 text-xs font-medium hidden sm:block ${
                      isActive ? 'text-primary-700' : 'text-surface-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < stepLabels.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded ${
                      stepNum < step ? 'bg-success-500' : 'bg-surface-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-xl rounded-2xl border border-surface-200 bg-white p-4 sm:p-8 shadow-sm">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="mb-1 text-xl font-bold text-surface-900">Basic Information</h2>
                <p className="text-sm text-surface-500">Tell us about your current role and experience</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">
                  Current Role
                </label>
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select a role...</option>
                  {roleCategories.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">
                  Or type a custom role
                </label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. AI Research Scientist"
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
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
                      <option key={i} value={i}>
                        {i}
                      </option>
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
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Skills & Education */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="mb-1 text-xl font-bold text-surface-900">Skills & Education</h2>
                <p className="text-sm text-surface-500">Add your technical skills and certifications</p>
              </div>

              {/* Skills */}
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">
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
                        onClick={() =>
                          setSkills((prev) => prev.filter((s) => s !== skill))
                        }
                      >
                        <X className="h-3 w-3 text-primary-400 hover:text-primary-700" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => {
                      setSkillSearch(e.target.value);
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    placeholder="Search skills..."
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-surface-200 bg-white shadow-lg">
                      {filteredSkills.slice(0, 10).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => addSkill(skill)}
                          className="w-full px-3 py-2 text-left text-sm text-surface-700 hover:bg-primary-50"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <label className="mb-1 block text-sm font-medium text-surface-700">
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
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCertification();
                      }
                    }}
                    placeholder="Type a certification and press Enter"
                    className="flex-1 rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    onClick={addCertification}
                    className="rounded-lg bg-surface-100 px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="mb-1 text-xl font-bold text-surface-900">Preferences</h2>
                <p className="text-sm text-surface-500">Set your job preferences and availability</p>
              </div>

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
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setShowLocationDropdown(true);
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                    placeholder="Search locations..."
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {showLocationDropdown && locationSearch && filteredLocations.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-surface-200 bg-white shadow-lg">
                      {filteredLocations.slice(0, 8).map((loc) => (
                        <button
                          key={loc}
                          onClick={() => addLocation(loc)}
                          className="w-full px-3 py-2 text-left text-sm text-surface-700 hover:bg-primary-50"
                        >
                          {loc}
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
                    onChange={(e) => setSalaryAmount(e.target.value)}
                    placeholder="e.g. 2800000"
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
                    <option value="SGD">SGD</option>
                    <option value="AED">AED</option>
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
                  type="date"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Employment History */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="mb-1 text-xl font-bold text-surface-900">Employment History</h2>
                <p className="text-sm text-surface-500">Add your work experience</p>
              </div>

              {employmentHistory.map((entry, idx) => (
                <div
                  key={entry._key}
                  className="space-y-4 rounded-xl border border-surface-200 bg-surface-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-surface-700">
                      Position {idx + 1}
                    </span>
                    {employmentHistory.length > 1 && (
                      <button
                        onClick={() => removeEmployment(entry._key)}
                        className="rounded p-1 text-danger-400 hover:bg-danger-50 hover:text-danger-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-surface-600">
                        Company
                      </label>
                      <input
                        type="text"
                        value={entry.company}
                        onChange={(e) =>
                          updateEmployment(entry._key, 'company', e.target.value)
                        }
                        placeholder="Company name"
                        className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-surface-600">
                        Role
                      </label>
                      <input
                        type="text"
                        value={entry.role}
                        onChange={(e) =>
                          updateEmployment(entry._key, 'role', e.target.value)
                        }
                        placeholder="Job title"
                        className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-surface-600">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={entry.startDate}
                        onChange={(e) =>
                          updateEmployment(entry._key, 'startDate', e.target.value)
                        }
                        className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-surface-600">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={entry.endDate ?? ''}
                        onChange={(e) =>
                          updateEmployment(
                            entry._key,
                            'endDate',
                            e.target.value || null
                          )
                        }
                        disabled={entry.isCurrent}
                        className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={entry.isCurrent}
                      onChange={(e) => {
                        updateEmployment(entry._key, 'isCurrent', e.target.checked);
                        if (e.target.checked) {
                          updateEmployment(entry._key, 'endDate', null);
                        }
                      }}
                      className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-surface-600">I currently work here</span>
                  </label>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-surface-600">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={entry.description}
                      onChange={(e) =>
                        updateEmployment(entry._key, 'description', e.target.value)
                      }
                      placeholder="Describe your responsibilities and achievements..."
                      className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addEmployment}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-surface-300 py-3 text-sm font-medium text-surface-500 transition-colors hover:border-primary-300 hover:text-primary-600"
              >
                <Plus className="h-4 w-4" />
                Add Another Position
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-surface-100 pt-6">
            <button
              onClick={() => {
                if (step === 1) navigate('/candidate/onboarding');
                else setStep((s) => s - 1);
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-surface-500 hover:text-primary-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
              >
                Create Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualProfilePage;

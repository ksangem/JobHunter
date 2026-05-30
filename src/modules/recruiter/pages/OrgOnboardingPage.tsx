import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Upload, CheckCircle2 } from 'lucide-react';
import { Logo } from '@shared/components';

const industryOptions = [
  'IT Services & Consulting',
  'Product / SaaS',
  'FinTech',
  'HealthTech',
  'EdTech',
  'E-Commerce',
  'Manufacturing',
  'Media & Entertainment',
  'Banking & Financial Services',
  'Other',
];

const sizeOptions = ['1-10', '11-50', '51-200', '201-500', '500+'];

const OrgOnboardingPage: FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    location: '',
    website: '',
  });

  const filledCount = Object.values(form).filter(Boolean).length;
  const totalFields = Object.keys(form).length;
  const progress = Math.round((filledCount / totalFields) * 100);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/recruiter/dashboard');
  };

  const isValid = form.companyName && form.industry && form.companySize && form.location;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <Logo size="md" showText />
          <h1 className="mt-6 text-xl font-bold text-surface-900 sm:text-2xl">Set Up Your Organization</h1>
          <p className="mt-2 text-sm text-surface-500">
            Complete your company profile to start hiring with AI
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-surface-700">Profile Completion</span>
            <span className="font-semibold text-primary-600">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-200">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm sm:p-6"
        >
          {/* Logo Upload */}
          <div className="mb-6 flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-surface-300 bg-surface-50 text-surface-400 transition-colors hover:border-primary-400 hover:text-primary-500">
              <Building2 className="h-8 w-8" />
            </div>
            <button
              type="button"
              className="mt-2 flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Logo
            </button>
          </div>

          {/* Company Name */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Company Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="e.g. Nalashaa Digital"
              className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Industry */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Industry <span className="text-danger-500">*</span>
            </label>
            <select
              value={form.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Select industry</option>
              {industryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Company Size */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Company Size <span className="text-danger-500">*</span>
            </label>
            <select
              value={form.companySize}
              onChange={(e) => handleChange('companySize', e.target.value)}
              className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Select size</option>
              {sizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} employees
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Location <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Ahmedabad, India"
              className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Website */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Website / Domain
            </label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="e.g. nalashaa.com"
              className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrgOnboardingPage;

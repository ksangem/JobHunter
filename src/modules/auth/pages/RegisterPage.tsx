import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { User, Briefcase, Mail, Lock, Eye, EyeOff, Building2, ArrowLeft } from 'lucide-react';
import type { UserRole } from '@shared/types';
import { Logo } from '@shared/components/Logo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    orgName: '',
    orgIndustry: '',
    agreeTerms: false,
    consentVoice: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(formData.name, formData.email, formData.password, selectedRole!);
      if (selectedRole === 'candidate') {
        navigate('/candidate/onboarding');
      } else {
        navigate('/recruiter/onboarding');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Choose role
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-8">
            <Logo size="md" showText />
          </div>
          <h1 className="text-2xl font-bold text-center text-surface-900 mb-2">Create your account</h1>
          <p className="text-center text-surface-500 mb-10">Choose how you'd like to use Job Hunter</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRole('candidate')}
              className="group bg-white rounded-xl border-2 border-surface-200 p-8 hover:border-primary-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                <User className="text-primary-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Job Seeker</h3>
              <p className="text-sm text-surface-500">
                Upload your CV, get AI-powered job matches, and land interviews faster
              </p>
            </button>

            <button
              onClick={() => setSelectedRole('recruiter')}
              className="group bg-white rounded-xl border-2 border-surface-200 p-8 hover:border-primary-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-accent-400/10 flex items-center justify-center mb-4 group-hover:bg-accent-400/20 transition-colors">
                <Building2 className="text-accent-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Recruiter / Organization</h3>
              <p className="text-sm text-surface-500">
                Post jobs, find top talent with AI matching, and automate hiring workflows
              </p>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Registration form
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => setSelectedRole(null)}
          className="flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700 mb-6"
        >
          <ArrowLeft size={16} /> Back to role selection
        </button>

        <div className="flex justify-center mb-6">
          <Logo size="sm" showText />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-8">
          <div className="flex items-center gap-2 mb-6">
            {selectedRole === 'candidate' ? (
              <User className="text-primary-600" size={20} />
            ) : (
              <Briefcase className="text-accent-600" size={20} />
            )}
            <h2 className="text-xl font-bold text-surface-900">
              {selectedRole === 'candidate' ? 'Job Seeker' : 'Recruiter'} Registration
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger-50 border border-danger-100 text-danger-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                />
              </div>
            </div>

            {selectedRole === 'recruiter' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Organization Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                    <input
                      type="text"
                      value={formData.orgName}
                      onChange={e => update('orgName', e.target.value)}
                      placeholder="Your company name"
                      className="w-full pl-10 pr-4 py-2.5 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Industry</label>
                  <select
                    value={formData.orgIndustry}
                    onChange={e => update('orgIndustry', e.target.value)}
                    className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="fintech">FinTech</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="consulting">Consulting</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="staffing">Staffing & Recruitment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-10 pr-12 py-2.5 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={e => update('agreeTerms', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-surface-600">
                  I agree to the{' '}
                  <span className="text-primary-600 font-medium">Terms of Service</span> and{' '}
                  <span className="text-primary-600 font-medium">Privacy Policy</span>
                </span>
              </label>

              {selectedRole === 'candidate' && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentVoice}
                    onChange={e => update('consentVoice', e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-surface-600">
                    I consent to receive voice AI outreach calls for relevant opportunities (opt-in)
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-surface-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

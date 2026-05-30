import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, PenLine, ArrowLeft } from 'lucide-react';
import { Logo } from '@shared/components';

const OnboardingPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-surface-200 bg-white px-4 sm:px-6 py-4">
        <Logo size="sm" />
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-surface-900">
          Let's build your profile
        </h1>
        <p className="mb-10 max-w-md text-center text-surface-500">
          Choose how you'd like to get started. You can always update your profile later.
        </p>

        <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
          {/* Option A: Upload CV */}
          <button
            onClick={() => navigate('/candidate/cv-upload')}
            className="group flex flex-col items-center rounded-2xl border-2 border-surface-200 bg-white p-6 sm:p-8 text-center shadow-sm transition-all hover:border-primary-400 hover:shadow-md"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
              <Upload className="h-8 w-8" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-surface-900">Upload CV</h2>
            <p className="mb-4 text-sm text-surface-500">
              Upload your resume and let AI extract your profile automatically
            </p>
            <span className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-500">
              PDF, DOCX, TXT up to 10MB
            </span>
          </button>

          {/* Option B: Manual Profile */}
          <button
            onClick={() => navigate('/candidate/manual-profile')}
            className="group flex flex-col items-center rounded-2xl border-2 border-surface-200 bg-white p-6 sm:p-8 text-center shadow-sm transition-all hover:border-accent-400 hover:shadow-md"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-400/10 text-accent-500 transition-colors group-hover:bg-accent-400/20">
              <PenLine className="h-8 w-8" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-surface-900">Manual Profile</h2>
            <p className="mb-4 text-sm text-surface-500">
              Build your profile step by step with our guided form
            </p>
            <span className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-500">
              Takes about 5 minutes
            </span>
          </button>
        </div>

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="mt-8 flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;

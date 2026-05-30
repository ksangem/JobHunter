import { useState, useEffect, useCallback, type FC, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileUp,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Logo, ScoreBadge, ProgressBar } from '@shared/components';
import { skillOptions, locationOptions } from '@shared/data/mockData';

const steps = ['Upload', 'AI Parsing', 'Review', 'Complete'];

const parsingMessages = [
  'Extracting personal details...',
  'Analyzing skills and competencies...',
  'Mapping work experience...',
  'Evaluating education history...',
  'Building your profile...',
];

const CVUploadPage: FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseMessageIndex, setParseMessageIndex] = useState(0);

  // Extracted profile data for review
  const [profileData, setProfileData] = useState({
    currentRole: 'Senior Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
    experienceYears: 5,
    experienceMonths: 3,
    preferredLocations: [] as string[],
    education: 'B.Tech in Computer Science - IIT Bombay (2021)',
    employmentHistory: 'Razorpay (2023-Present), Infosys (2021-2023)',
  });

  const [skillInput, setSkillInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // AI parsing simulation
  useEffect(() => {
    if (currentStep !== 2) return;

    const progressInterval = setInterval(() => {
      setParseProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const messageInterval = setInterval(() => {
      setParseMessageIndex((prev) =>
        prev < parsingMessages.length - 1 ? prev + 1 : prev
      );
    }, 600);

    const autoAdvance = setTimeout(() => {
      setCurrentStep(3);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(autoAdvance);
    };
  }, [currentStep]);

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addSkill = (skill: string) => {
    if (!profileData.skills.includes(skill)) {
      setProfileData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput('');
    setShowSkillDropdown(false);
  };

  const removeLocation = (loc: string) => {
    setProfileData((prev) => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter((l) => l !== loc),
    }));
  };

  const addLocation = (loc: string) => {
    if (!profileData.preferredLocations.includes(loc)) {
      setProfileData((prev) => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, loc],
      }));
    }
    setLocationInput('');
    setShowLocationDropdown(false);
  };

  const filteredSkills = skillOptions.filter(
    (s) =>
      s.toLowerCase().includes(skillInput.toLowerCase()) &&
      !profileData.skills.includes(s)
  );

  const filteredLocations = locationOptions.filter(
    (l) =>
      l.toLowerCase().includes(locationInput.toLowerCase()) &&
      !profileData.preferredLocations.includes(l)
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-surface-200 bg-white px-4 sm:px-6 py-4">
        <Logo size="sm" />
      </header>

      <div className="flex flex-1 flex-col items-center px-4 py-8">
        {/* Step indicator */}
        <div className="mb-10 flex w-full max-w-lg items-center justify-between">
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
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
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`mt-1.5 text-xs font-medium hidden sm:block ${
                      isActive ? 'text-primary-700' : 'text-surface-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded ${
                      stepNum < currentStep ? 'bg-success-500' : 'bg-surface-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="w-full max-w-xl">
          {/* Step 1: Upload */}
          {currentStep === 1 && (
            <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-8 shadow-sm">
              <h2 className="mb-2 text-center text-xl sm:text-2xl font-bold text-surface-900">
                Upload Your Resume
              </h2>
              <p className="mb-8 text-center text-sm text-surface-500">
                We'll use AI to extract your profile information automatically
              </p>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center rounded-xl border-2 border-dashed p-6 sm:p-10 transition-colors ${
                  dragActive
                    ? 'border-primary-400 bg-primary-50'
                    : file
                      ? 'border-success-400 bg-success-50'
                      : 'border-surface-300 bg-surface-50 hover:border-primary-300'
                }`}
              >
                {file ? (
                  <>
                    <FileUp className="mb-3 h-10 w-10 text-success-500" />
                    <p className="mb-1 text-sm font-semibold text-surface-900">
                      {file.name}
                    </p>
                    <p className="mb-4 text-xs text-surface-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      onClick={() => setFile(null)}
                      className="text-xs font-medium text-danger-600 hover:underline"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="mb-3 h-10 w-10 text-surface-400" />
                    <p className="mb-1 text-sm font-semibold text-surface-700">
                      Drag and drop your resume here
                    </p>
                    <p className="mb-4 text-xs text-surface-400">or</p>
                    <label className="cursor-pointer rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileInput}
                      />
                    </label>
                    <p className="mt-4 text-xs text-surface-400">
                      Supported: PDF, DOCX, TXT (up to 10MB)
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => navigate('/candidate/onboarding')}
                  className="flex items-center gap-1.5 text-sm font-medium text-surface-500 hover:text-primary-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={() => {
                    if (file) {
                      setCurrentStep(2);
                      setParseProgress(0);
                      setParseMessageIndex(0);
                    }
                  }}
                  disabled={!file}
                  className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: AI Parsing */}
          {currentStep === 2 && (
            <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-8 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                  <Sparkles className="h-8 w-8 animate-pulse text-primary-600" />
                </div>
                <h2 className="mb-2 text-xl sm:text-2xl font-bold text-surface-900">
                  AI is analyzing your resume
                </h2>
                <p className="mb-8 text-sm text-surface-500">
                  Please wait while we extract your profile information
                </p>

                <div className="mb-4 w-full">
                  <ProgressBar value={parseProgress} label="Progress" color="primary" />
                </div>

                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {parsingMessages[parseMessageIndex]}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-8 shadow-sm">
              <h2 className="mb-1 text-xl sm:text-2xl font-bold text-surface-900">
                Review Extracted Profile
              </h2>
              <p className="mb-6 text-sm text-surface-500">
                Verify and edit the information extracted from your resume
              </p>

              <div className="space-y-5">
                {/* Current Role */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-surface-700">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={profileData.currentRole}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        currentRole: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-surface-700">
                    Skills
                  </label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {profileData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)}>
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
                      placeholder="Search and add skills..."
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    {showSkillDropdown && skillInput && filteredSkills.length > 0 && (
                      <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-surface-200 bg-white shadow-lg">
                        {filteredSkills.slice(0, 8).map((skill) => (
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

                {/* Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-surface-700">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={profileData.experienceYears}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          experienceYears: Number(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-surface-700">
                      Experience (Months)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={profileData.experienceMonths}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          experienceMonths: Number(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Preferred Locations */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-surface-700">
                    Preferred Locations <span className="text-danger-500">*</span>
                  </label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {profileData.preferredLocations.map((loc) => (
                      <span
                        key={loc}
                        className="flex items-center gap-1 rounded-full bg-accent-400/10 px-3 py-1 text-xs font-medium text-accent-600"
                      >
                        {loc}
                        <button onClick={() => removeLocation(loc)}>
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
                      placeholder="Search and add locations..."
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    {showLocationDropdown && locationInput && filteredLocations.length > 0 && (
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

                {/* Education */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-surface-700">
                    Education
                  </label>
                  <input
                    type="text"
                    value={profileData.education}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        education: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                {/* Employment History */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-surface-700">
                    Employment History
                  </label>
                  <textarea
                    rows={3}
                    value={profileData.employmentHistory}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        employmentHistory: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 text-sm font-medium text-surface-500 hover:text-primary-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={() => {
                    if (profileData.preferredLocations.length > 0) {
                      setCurrentStep(4);
                    }
                  }}
                  disabled={profileData.preferredLocations.length === 0}
                  className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm Profile
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
                  <CheckCircle2 className="h-10 w-10 text-success-500" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-surface-900">
                  Profile Created Successfully!
                </h2>
                <p className="mb-8 text-sm text-surface-500">
                  Your AI-powered profile is ready. Here's your initial score.
                </p>

                <div className="mb-2">
                  <ScoreBadge score={87} size="lg" />
                </div>
                <p className="mb-8 text-sm font-medium text-surface-600">AI Match Score</p>

                <button
                  onClick={() => navigate('/candidate/dashboard')}
                  className="rounded-lg bg-primary-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVUploadPage;

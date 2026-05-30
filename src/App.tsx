import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { lazy, Suspense } from 'react';

// Auth pages
const LoginPage = lazy(() => import('@auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@auth/pages/RegisterPage'));

// Candidate pages
const OnboardingPage = lazy(() => import('@candidate/pages/OnboardingPage'));
const CVUploadPage = lazy(() => import('@candidate/pages/CVUploadPage'));
const ManualProfilePage = lazy(() => import('@candidate/pages/ManualProfilePage'));
const CandidateDashboard = lazy(() => import('@candidate/pages/CandidateDashboard'));
const JobMatchesPage = lazy(() => import('@candidate/pages/JobMatchesPage'));
const InterviewsPage = lazy(() => import('@candidate/pages/InterviewsPage'));
const ResumeAIPage = lazy(() => import('@candidate/pages/ResumeAIPage'));
const ProfilePage = lazy(() => import('@candidate/pages/ProfilePage'));
const CandidateSettingsPage = lazy(() => import('@candidate/pages/SettingsPage'));

// Recruiter pages
const OrgOnboardingPage = lazy(() => import('@recruiter/pages/OrgOnboardingPage'));
const RecruiterDashboard = lazy(() => import('@recruiter/pages/RecruiterDashboard'));
const JDManagementPage = lazy(() => import('@recruiter/pages/JDManagementPage'));
const CandidatePipelinePage = lazy(() => import('@recruiter/pages/CandidatePipelinePage'));
const InterviewTrackingPage = lazy(() => import('@recruiter/pages/InterviewTrackingPage'));
const VoiceAIPage = lazy(() => import('@recruiter/pages/VoiceAIPage'));
const EmailCampaignPage = lazy(() => import('@recruiter/pages/EmailCampaignPage'));
const AnalyticsDashboardPage = lazy(() => import('@recruiter/pages/AnalyticsDashboardPage'));
const MarketIntelPage = lazy(() => import('@recruiter/pages/MarketIntelPage'));
const RecruiterSettingsPage = lazy(() => import('@recruiter/pages/RecruiterSettingsPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-surface-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} replace /> : <RegisterPage />}
        />

        {/* Candidate routes */}
        <Route path="/candidate/onboarding" element={<ProtectedRoute allowedRole="candidate"><OnboardingPage /></ProtectedRoute>} />
        <Route path="/candidate/cv-upload" element={<ProtectedRoute allowedRole="candidate"><CVUploadPage /></ProtectedRoute>} />
        <Route path="/candidate/manual-profile" element={<ProtectedRoute allowedRole="candidate"><ManualProfilePage /></ProtectedRoute>} />
        <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRole="candidate"><CandidateDashboard /></ProtectedRoute>} />
        <Route path="/candidate/jobs" element={<ProtectedRoute allowedRole="candidate"><JobMatchesPage /></ProtectedRoute>} />
        <Route path="/candidate/interviews" element={<ProtectedRoute allowedRole="candidate"><InterviewsPage /></ProtectedRoute>} />
        <Route path="/candidate/resume-ai" element={<ProtectedRoute allowedRole="candidate"><ResumeAIPage /></ProtectedRoute>} />
        <Route path="/candidate/profile" element={<ProtectedRoute allowedRole="candidate"><ProfilePage /></ProtectedRoute>} />
        <Route path="/candidate/settings" element={<ProtectedRoute allowedRole="candidate"><CandidateSettingsPage /></ProtectedRoute>} />

        {/* Recruiter routes */}
        <Route path="/recruiter/onboarding" element={<ProtectedRoute allowedRole="recruiter"><OrgOnboardingPage /></ProtectedRoute>} />
        <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRole="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRole="recruiter"><JDManagementPage /></ProtectedRoute>} />
        <Route path="/recruiter/pipeline" element={<ProtectedRoute allowedRole="recruiter"><CandidatePipelinePage /></ProtectedRoute>} />
        <Route path="/recruiter/interviews" element={<ProtectedRoute allowedRole="recruiter"><InterviewTrackingPage /></ProtectedRoute>} />
        <Route path="/recruiter/voice-ai" element={<ProtectedRoute allowedRole="recruiter"><VoiceAIPage /></ProtectedRoute>} />
        <Route path="/recruiter/email" element={<ProtectedRoute allowedRole="recruiter"><EmailCampaignPage /></ProtectedRoute>} />
        <Route path="/recruiter/analytics" element={<ProtectedRoute allowedRole="recruiter"><AnalyticsDashboardPage /></ProtectedRoute>} />
        <Route path="/recruiter/market" element={<ProtectedRoute allowedRole="recruiter"><MarketIntelPage /></ProtectedRoute>} />
        <Route path="/recruiter/settings" element={<ProtectedRoute allowedRole="recruiter"><RecruiterSettingsPage /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

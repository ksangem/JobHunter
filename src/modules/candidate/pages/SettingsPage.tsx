import { useState, type FC } from 'react';
import {
  Mail,
  Lock,
  Bell,
  Shield,
  Download,
  Trash2,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AppLayout } from '@shared/components';
import { useAuth } from '@shared/hooks/useAuth';
import { candidateSidebarItems } from '../components/sidebarConfig';

const SettingsPage: FC = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState(false);

  // Account
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [voiceAIConsent, setVoiceAIConsent] = useState(false);

  // Privacy
  const [profileVisible, setProfileVisible] = useState(true);

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const Toggle: FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({
    checked,
    onChange,
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-primary-600' : 'bg-surface-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <AppLayout
      sidebarItems={candidateSidebarItems}
      title="Settings"
      userRole="candidate"
    >
      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg bg-success-500 px-4 py-3 text-sm font-medium text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" />
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="rounded-xl border border-surface-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-surface-900">Account Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-surface-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:max-w-md rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="border-t border-surface-100 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4 text-surface-500" />
                <span className="text-sm font-medium text-surface-700">Change Password</span>
              </div>

              <div className="w-full sm:max-w-md space-y-3">
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 pr-10 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  >
                    {showCurrent ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 pr-10 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-xl border border-surface-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-surface-900">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900">Email Notifications</p>
                <p className="text-xs text-surface-500">
                  Receive general updates and announcements via email
                </p>
              </div>
              <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
            </div>

            <div className="border-t border-surface-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900">Job Alerts</p>
                  <p className="text-xs text-surface-500">
                    Get notified when new jobs match your profile
                  </p>
                </div>
                <Toggle checked={jobAlerts} onChange={setJobAlerts} />
              </div>
            </div>

            <div className="border-t border-surface-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900">
                    Interview Reminders
                  </p>
                  <p className="text-xs text-surface-500">
                    Receive reminders before scheduled interviews
                  </p>
                </div>
                <Toggle checked={interviewReminders} onChange={setInterviewReminders} />
              </div>
            </div>

            <div className="border-t border-surface-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900">Voice AI Consent</p>
                  <p className="text-xs text-surface-500">
                    Allow recruiters to reach you via AI-powered voice outreach
                  </p>
                </div>
                <Toggle checked={voiceAIConsent} onChange={setVoiceAIConsent} />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-xl border border-surface-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-surface-900">Privacy</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900">Profile Visibility</p>
                <p className="text-xs text-surface-500">
                  Make your profile visible to recruiters on the platform
                </p>
              </div>
              <Toggle checked={profileVisible} onChange={setProfileVisible} />
            </div>

            <div className="border-t border-surface-100 pt-4">
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-surface-300 px-4 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50">
                  <Download className="h-4 w-4" />
                  Export My Data
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-danger-200 px-4 py-2.5 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;

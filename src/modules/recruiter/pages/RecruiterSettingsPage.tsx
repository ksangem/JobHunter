import { useState, type FC } from 'react';
import {
  Building2,
  Upload,
  Users,
  Plus,
  Sliders,
  Bell,
  Key,
  CreditCard,
  Save,
  Shield,
  Crown,
  UserCircle,
  Webhook,
  Copy,
} from 'lucide-react';
import { AppLayout, Modal } from '@shared/components';
import { mockOrganization } from '@shared/data/mockData';
import { recruiterSidebarItems } from '../components/sidebarConfig';

const teamMembers = [
  { name: 'Kiran S.', email: 'kiran@nalashaa.com', role: 'Admin', avatar: null },
  { name: 'Priya M.', email: 'priya@nalashaa.com', role: 'Recruiter', avatar: null },
  { name: 'Amit D.', email: 'amit@nalashaa.com', role: 'Recruiter', avatar: null },
  { name: 'Neha G.', email: 'neha@nalashaa.com', role: 'Viewer', avatar: null },
];

const roleBadge: Record<string, string> = {
  Admin: 'bg-primary-100 text-primary-700',
  Recruiter: 'bg-success-100 text-success-700',
  Viewer: 'bg-surface-100 text-surface-600',
};

const RecruiterSettingsPage: FC = () => {
  const [org, setOrg] = useState({
    name: mockOrganization.name,
    industry: mockOrganization.industry,
    size: mockOrganization.size,
    location: mockOrganization.location,
  });
  const [matchThreshold, setMatchThreshold] = useState(75);
  const [autoOutreach, setAutoOutreach] = useState(false);
  const [notifications, setNotifications] = useState({
    newCandidates: true,
    interviewReminders: true,
    campaignUpdates: true,
    weeklyReport: false,
  });
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOrgChange = (field: string, value: string) => {
    setOrg((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout sidebarItems={recruiterSidebarItems} title="Settings" userRole="recruiter">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-surface-900">Settings</h2>
          <p className="mt-1 text-sm text-surface-500">
            Manage your organization, team, and preferences
          </p>
        </div>

        {/* Organization Profile */}
        <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-surface-900">Organization Profile</h3>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-surface-300 bg-surface-50 text-surface-400">
              <Building2 className="h-7 w-7" />
            </div>
            <button className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
              <Upload className="h-3.5 w-3.5" />
              Change Logo
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Company Name
              </label>
              <input
                type="text"
                value={org.name}
                onChange={(e) => handleOrgChange('name', e.target.value)}
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">Industry</label>
              <input
                type="text"
                value={org.industry}
                onChange={(e) => handleOrgChange('industry', e.target.value)}
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Company Size
              </label>
              <select
                value={org.size}
                onChange={(e) => handleOrgChange('size', e.target.value)}
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200-500">200-500</option>
                <option value="500+">500+</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">Location</label>
              <input
                type="text"
                value={org.location}
                onChange={(e) => handleOrgChange('location', e.target.value)}
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </section>

        {/* Team Management */}
        <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-surface-900">Team Management</h3>
            </div>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Invite Member
            </button>
          </div>

          <div className="divide-y divide-surface-100">
            {teamMembers.map((member) => {
              const initials = member.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase();
              const RoleIcon = member.role === 'Admin' ? Crown : member.role === 'Recruiter' ? Shield : UserCircle;
              return (
                <div
                  key={member.email}
                  className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{member.name}</p>
                      <p className="text-xs text-surface-500">{member.email}</p>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge[member.role]}`}
                  >
                    <RoleIcon className="h-3 w-3" />
                    {member.role}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Configuration */}
        <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-surface-900">AI Configuration</h3>
          </div>

          {/* Match Threshold */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-surface-700">
                Match Threshold
              </label>
              <span className="rounded-lg bg-primary-50 px-2.5 py-1 text-sm font-bold text-primary-700">
                {matchThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={matchThreshold}
              onChange={(e) => setMatchThreshold(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
            <div className="mt-1 flex justify-between text-xs text-surface-400">
              <span>50% (Broader)</span>
              <span>100% (Stricter)</span>
            </div>
          </div>

          {/* Auto Outreach */}
          <div className="flex items-center justify-between rounded-lg bg-surface-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-surface-700">Auto-Outreach</p>
              <p className="text-xs text-surface-500">
                Automatically contact candidates above threshold
              </p>
            </div>
            <button
              onClick={() => setAutoOutreach(!autoOutreach)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                autoOutreach ? 'bg-primary-600' : 'bg-surface-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  autoOutreach ? 'left-5.5 translate-x-0' : 'left-0.5'
                }`}
                style={{ left: autoOutreach ? '22px' : '2px' }}
              />
            </button>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-surface-900">Notifications</h3>
          </div>

          <div className="space-y-3">
            {[
              { key: 'newCandidates', label: 'New Candidate Matches', desc: 'Get notified when new candidates match your JDs' },
              { key: 'interviewReminders', label: 'Interview Reminders', desc: 'Receive reminders 30 min before interviews' },
              { key: 'campaignUpdates', label: 'Campaign Updates', desc: 'Updates on voice and email campaign progress' },
              { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly hiring performance summary' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg bg-surface-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-surface-700">{item.label}</p>
                  <p className="text-xs text-surface-500">{item.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev],
                    }))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications]
                      ? 'bg-primary-600'
                      : 'bg-surface-300'
                  }`}
                >
                  <span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                    style={{
                      left: notifications[item.key as keyof typeof notifications] ? '22px' : '2px',
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* API & Integrations */}
        <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Key className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-surface-900">API & Integrations</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">API Key</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  readOnly
                  value="jh_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="flex-1 rounded-lg border border-surface-300 bg-surface-50 px-3.5 py-2.5 font-mono text-sm text-surface-600 min-w-0"
                />
                <button
                  onClick={() => handleCopy('jh_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx')}
                  className="flex shrink-0 items-center justify-center gap-1 rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-600 transition-colors hover:bg-surface-50"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Webhook URL
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex items-center gap-1.5 rounded-lg border border-surface-300 bg-surface-50 px-3.5 py-2.5 text-sm text-surface-400">
                  <Webhook className="h-4 w-4 shrink-0" />
                  <span>No webhook configured</span>
                </div>
                <button className="shrink-0 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Billing */}
        <section className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="mb-5 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-surface-900">Billing</h3>
          </div>

          <div className="rounded-lg bg-surface-50 p-5 text-center">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
              <Crown className="h-4 w-4" />
              Pro Plan
            </div>
            <p className="text-sm text-surface-500">
              Your current plan includes unlimited JDs, Voice AI, and Email Campaigns.
            </p>
            <button className="mt-4 rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-white">
              Manage Subscription
            </button>
          </div>
        </section>
      </div>

      {/* Invite Member Modal */}
      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Team Member" size="md">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Email Address <span className="text-danger-500">*</span>
            </label>
            <input
              type="email"
              placeholder="colleague@company.com"
              className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">Role</label>
            <select className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsInviteOpen(false)}
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default RecruiterSettingsPage;

import { useState, type FC } from 'react';
import {
  Mail,
  Plus,
  Eye,
  Send,
  Clock,
  MousePointerClick,
  MailOpen,
} from 'lucide-react';
import { AppLayout, Modal, StatCard } from '@shared/components';
import { mockJobDescriptions } from '@shared/data/mockData';
import { recruiterSidebarItems } from '../components/sidebarConfig';

interface EmailCampaign {
  id: string;
  name: string;
  jdTitle: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  status: 'active' | 'completed' | 'draft' | 'scheduled';
  createdAt: string;
}

const mockEmailCampaigns: EmailCampaign[] = [
  {
    id: 'ec-001',
    name: 'React Developer - Interview Invite Batch 1',
    jdTitle: 'Senior React Developer',
    sentCount: 35,
    openRate: 68,
    clickRate: 42,
    status: 'completed',
    createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'ec-002',
    name: 'Python Engineers - CV Request',
    jdTitle: 'Python Backend Engineer',
    sentCount: 28,
    openRate: 54,
    clickRate: 31,
    status: 'active',
    createdAt: '2026-05-25T14:00:00Z',
  },
  {
    id: 'ec-003',
    name: 'DevOps Role - Follow-up',
    jdTitle: 'DevOps Engineer',
    sentCount: 15,
    openRate: 47,
    clickRate: 20,
    status: 'completed',
    createdAt: '2026-05-18T09:00:00Z',
  },
  {
    id: 'ec-004',
    name: 'React Developer - Follow-up Batch 2',
    jdTitle: 'Senior React Developer',
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    status: 'draft',
    createdAt: '2026-05-29T16:00:00Z',
  },
];

const templates = [
  { id: 'tpl-1', name: 'Interview Invite', preview: 'Dear [Name],\n\nWe were impressed by your profile and would like to invite you for an interview for the [Job Title] position at [Company].\n\nPlease select a time slot that works for you using the link below.\n\nBest regards,\n[Recruiter Name]' },
  { id: 'tpl-2', name: 'CV Request', preview: 'Dear [Name],\n\nWe came across your profile and believe you could be a great fit for our [Job Title] opening.\n\nCould you please share your updated CV? We\'d love to learn more about your experience.\n\nBest regards,\n[Recruiter Name]' },
  { id: 'tpl-3', name: 'Follow-up', preview: 'Dear [Name],\n\nI wanted to follow up on our previous conversation regarding the [Job Title] position.\n\nAre you still interested in exploring this opportunity? I\'d be happy to answer any questions.\n\nBest regards,\n[Recruiter Name]' },
  { id: 'tpl-4', name: 'Custom', preview: '' },
];

const statusBadge: Record<string, string> = {
  active: 'bg-success-100 text-success-700',
  completed: 'bg-primary-100 text-primary-700',
  draft: 'bg-surface-100 text-surface-600',
  scheduled: 'bg-warning-100 text-warning-700',
};

const EmailCampaignPage: FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('tpl-1');

  const totalSent = mockEmailCampaigns.reduce((a, c) => a + c.sentCount, 0);
  const avgOpenRate =
    mockEmailCampaigns.filter((c) => c.sentCount > 0).length > 0
      ? Math.round(
          mockEmailCampaigns.filter((c) => c.sentCount > 0).reduce((a, c) => a + c.openRate, 0) /
            mockEmailCampaigns.filter((c) => c.sentCount > 0).length
        )
      : 0;
  const avgClickRate =
    mockEmailCampaigns.filter((c) => c.sentCount > 0).length > 0
      ? Math.round(
          mockEmailCampaigns.filter((c) => c.sentCount > 0).reduce((a, c) => a + c.clickRate, 0) /
            mockEmailCampaigns.filter((c) => c.sentCount > 0).length
        )
      : 0;

  const activeTemplate = templates.find((t) => t.id === selectedTemplate);

  return (
    <AppLayout sidebarItems={recruiterSidebarItems} title="Email Campaigns" userRole="recruiter">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Sent"
            value={totalSent}
            change={`${mockEmailCampaigns.length} campaigns`}
            trend="up"
            icon={Send}
          />
          <StatCard
            title="Avg Open Rate"
            value={`${avgOpenRate}%`}
            change="+4% vs last month"
            trend="up"
            icon={MailOpen}
          />
          <StatCard
            title="Avg Click Rate"
            value={`${avgClickRate}%`}
            change="+2% vs last month"
            trend="up"
            icon={MousePointerClick}
          />
        </div>

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-surface-900">Campaigns</h3>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        </div>

        {/* Campaign List */}
        <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-x-auto">
          <div className="min-w-[600px] grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-surface-200 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
            <span>Campaign</span>
            <span>Sent</span>
            <span>Open Rate</span>
            <span>Click Rate</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-surface-100">
            {mockEmailCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="min-w-[600px] grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-50"
              >
                <div>
                  <p className="text-sm font-medium text-surface-900">{campaign.name}</p>
                  <p className="mt-0.5 text-xs text-surface-500">
                    {campaign.jdTitle} &middot;{' '}
                    {new Date(campaign.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-surface-900">{campaign.sentCount}</p>
                  <p className="text-xs text-surface-400">emails</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-surface-900">
                    {campaign.sentCount > 0 ? `${campaign.openRate}%` : '--'}
                  </p>
                  <p className="text-xs text-surface-400">opened</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-surface-900">
                    {campaign.sentCount > 0 ? `${campaign.clickRate}%` : '--'}
                  </p>
                  <p className="text-xs text-surface-400">clicked</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[campaign.status]}`}
                >
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Email Campaign" size="xl">
        <div className="space-y-4">
          {/* Subject */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Subject Line <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Exciting opportunity at Nalashaa Digital"
              className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Template Selector */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Email Template
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    selectedTemplate === tpl.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-surface-200 text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          {activeTemplate && activeTemplate.preview && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Template Preview
              </label>
              <div className="rounded-lg border border-surface-200 bg-surface-50 p-4">
                <pre className="whitespace-pre-wrap text-sm text-surface-700">
                  {activeTemplate.preview}
                </pre>
              </div>
            </div>
          )}

          {/* JD Association */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Associated Job Description
            </label>
            <select className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
              <option value="">Select JD...</option>
              {mockJobDescriptions.map((jd) => (
                <option key={jd.id} value={jd.id}>
                  {jd.title}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">Schedule</label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-medium text-primary-700"
              >
                <Send className="h-4 w-4" />
                Send Now
              </button>
              <span className="text-sm text-surface-400">or</span>
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:w-auto"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsCreateOpen(false)}
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              Create Campaign
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default EmailCampaignPage;

import { useState, type FC } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneMissed,
  Plus,
  Play,
  Pause,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  FileText,
} from 'lucide-react';
import { AppLayout, Modal, StatCard, ProgressBar } from '@shared/components';
import { mockVoiceOutreachCampaigns, mockJobDescriptions } from '@shared/data/mockData';
import { recruiterSidebarItems } from '../components/sidebarConfig';

const statusBadge: Record<string, string> = {
  active: 'bg-success-100 text-success-700',
  completed: 'bg-primary-100 text-primary-700',
  draft: 'bg-surface-100 text-surface-600',
  paused: 'bg-warning-100 text-warning-700',
};

// Mock call logs for campaign detail
const mockCallLogs = [
  { id: 'cl-001', name: 'Priya Sharma', time: '2026-05-29 10:15', duration: '2:34', outcome: 'interested' as const, transcript: 'Hi Priya, I\'m calling regarding the Senior React Developer position...' },
  { id: 'cl-002', name: 'Rohit Verma', time: '2026-05-29 10:22', duration: '1:48', outcome: 'declined' as const, transcript: 'Hi Rohit, I\'m reaching out about an exciting opportunity...' },
  { id: 'cl-003', name: 'Vikram Desai', time: '2026-05-29 10:35', duration: '3:12', outcome: 'interested' as const, transcript: 'Hello Vikram, we have a Senior React Developer role that matches...' },
  { id: 'cl-004', name: 'Suresh Patel', time: '2026-05-29 10:50', duration: '0:00', outcome: 'no_answer' as const, transcript: '' },
  { id: 'cl-005', name: 'Deepa Krishnan', time: '2026-05-29 11:05', duration: '4:01', outcome: 'interested' as const, transcript: 'Hi Deepa, I wanted to discuss a frontend architecture role...' },
];

const outcomeConfig: Record<string, { label: string; color: string; icon: typeof PhoneCall }> = {
  interested: { label: 'Interested', color: 'text-success-600', icon: PhoneCall },
  declined: { label: 'Declined', color: 'text-danger-600', icon: PhoneOff },
  no_answer: { label: 'No Answer', color: 'text-warning-600', icon: PhoneMissed },
};

const VoiceAIPage: FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [transcriptModal, setTranscriptModal] = useState<string | null>(null);

  const totalCalls = mockVoiceOutreachCampaigns.reduce((a, c) => a + c.contacted, 0);
  const totalInterested = mockVoiceOutreachCampaigns.reduce((a, c) => a + c.interested, 0);
  const responseRate =
    totalCalls > 0
      ? Math.round(
          ((mockVoiceOutreachCampaigns.reduce((a, c) => a + c.interested + c.declined, 0)) /
            totalCalls) *
            100
        )
      : 0;
  const interestRate = totalCalls > 0 ? Math.round((totalInterested / totalCalls) * 100) : 0;

  const activeCampaign = selectedCampaign
    ? mockVoiceOutreachCampaigns.find((c) => c.id === selectedCampaign)
    : null;

  return (
    <AppLayout sidebarItems={recruiterSidebarItems} title="Voice AI Outreach" userRole="recruiter">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Calls Made"
            value={totalCalls}
            change={`${mockVoiceOutreachCampaigns.filter((c) => c.status === 'active').length} active`}
            trend="up"
            icon={Phone}
          />
          <StatCard
            title="Response Rate"
            value={`${responseRate}%`}
            change="+5% this week"
            trend="up"
            icon={ThumbsUp}
          />
          <StatCard
            title="Interest Rate"
            value={`${interestRate}%`}
            change="+3% this week"
            trend="up"
            icon={PhoneCall}
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

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {mockVoiceOutreachCampaigns.map((campaign) => {
            const progress =
              campaign.totalCandidates > 0
                ? Math.round((campaign.contacted / campaign.totalCandidates) * 100)
                : 0;
            return (
              <div
                key={campaign.id}
                className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-surface-900">{campaign.jdTitle}</h4>
                    <p className="mt-0.5 text-sm text-surface-500">
                      {campaign.totalCandidates} candidates targeted
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[campaign.status]}`}
                  >
                    {campaign.status}
                  </span>
                </div>

                <div className="mb-4">
                  <ProgressBar
                    value={progress}
                    label={`${campaign.contacted}/${campaign.totalCandidates} contacted`}
                    color={campaign.status === 'completed' ? 'success' : 'primary'}
                  />
                </div>

                {/* Response Breakdown */}
                <div className="mb-4 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-success-50 p-2.5 text-center">
                    <p className="text-lg font-bold text-success-700">{campaign.interested}</p>
                    <p className="text-xs text-success-600">Interested</p>
                  </div>
                  <div className="rounded-lg bg-danger-50 p-2.5 text-center">
                    <p className="text-lg font-bold text-danger-700">{campaign.declined}</p>
                    <p className="text-xs text-danger-600">Declined</p>
                  </div>
                  <div className="rounded-lg bg-warning-50 p-2.5 text-center">
                    <p className="text-lg font-bold text-warning-700">{campaign.noAnswer}</p>
                    <p className="text-xs text-warning-600">No Answer</p>
                  </div>
                </div>

                {campaign.startedAt && (
                  <p className="mb-3 flex items-center gap-1 text-xs text-surface-400">
                    <Clock className="h-3 w-3" />
                    Started{' '}
                    {new Date(campaign.startedAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedCampaign(selectedCampaign === campaign.id ? null : campaign.id)
                    }
                    className="flex-1 rounded-lg border border-primary-200 bg-primary-50 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100"
                  >
                    {selectedCampaign === campaign.id ? 'Hide Details' : 'View Details'}
                  </button>
                  {campaign.status === 'active' && (
                    <button className="rounded-lg border border-surface-200 p-2 text-surface-500 transition-colors hover:bg-surface-50">
                      <Pause className="h-4 w-4" />
                    </button>
                  )}
                  {(campaign.status === 'draft' || campaign.status === 'paused') && (
                    <button className="rounded-lg border border-success-200 bg-success-50 p-2 text-success-600 transition-colors hover:bg-success-100">
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Expanded Call Logs */}
                {selectedCampaign === campaign.id && campaign.contacted > 0 && (
                  <div className="mt-4 border-t border-surface-200 pt-4">
                    <h5 className="mb-3 text-sm font-semibold text-surface-700">Call Logs</h5>
                    <div className="space-y-2">
                      {mockCallLogs.map((log) => {
                        const cfg = outcomeConfig[log.outcome];
                        const OutcomeIcon = cfg.icon;
                        return (
                          <div
                            key={log.id}
                            className="flex flex-col gap-2 rounded-lg bg-surface-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <OutcomeIcon className={`h-4 w-4 ${cfg.color}`} />
                              <div>
                                <p className="text-sm font-medium text-surface-900">{log.name}</p>
                                <p className="text-xs text-surface-400">
                                  {log.time} &middot; {log.duration}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                              {log.transcript && (
                                <button
                                  onClick={() => setTranscriptModal(log.transcript)}
                                  className="rounded p-1 text-surface-400 transition-colors hover:bg-surface-200 hover:text-surface-600"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Campaign Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Voice AI Campaign" size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Select Job Description <span className="text-danger-500">*</span>
            </label>
            <select className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
              <option value="">Choose a JD...</option>
              {mockJobDescriptions
                .filter((jd) => jd.status === 'active')
                .map((jd) => (
                  <option key={jd.id} value={jd.id}>
                    {jd.title} ({jd.matchedCandidates} candidates)
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Candidate Selection
            </label>
            <div className="flex items-center gap-3 rounded-lg bg-primary-50 px-4 py-3 text-sm text-primary-700">
              <Users className="h-4 w-4 shrink-0" />
              AI will automatically select the best-matching candidates from the shortlist
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              Call Script Template
            </label>
            <textarea
              rows={4}
              defaultValue={`Hi [Candidate Name], I'm calling from [Company]. We have an exciting [Job Title] opportunity that matches your profile. Your experience in [Key Skills] is exactly what we're looking for. Would you be interested in learning more?`}
              className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">Schedule</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                className="rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <input
                type="time"
                defaultValue="09:00"
                className="rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

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
              Launch Campaign
            </button>
          </div>
        </div>
      </Modal>

      {/* Transcript Modal */}
      <Modal
        isOpen={!!transcriptModal}
        onClose={() => setTranscriptModal(null)}
        title="Call Transcript"
        size="md"
      >
        <p className="text-sm leading-relaxed text-surface-700">{transcriptModal}</p>
      </Modal>
    </AppLayout>
  );
};

export default VoiceAIPage;

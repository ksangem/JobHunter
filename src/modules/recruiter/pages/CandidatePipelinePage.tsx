import { useState, type FC } from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  ChevronRight,
  Loader2,
  PhoneCall,
  PhoneOff,
  PhoneMissed,
} from 'lucide-react';
import { AppLayout, Modal, ScoreBadge } from '@shared/components';
import { mockJobDescriptions, mockPipelineCandidates } from '@shared/data/mockData';
import type { PipelineCandidate, PipelineStage } from '@shared/types';
import { recruiterSidebarItems } from '../components/sidebarConfig';

const stages: { key: PipelineStage; label: string; color: string; headerBg: string }[] = [
  { key: 'shortlisted', label: 'Shortlisted', color: 'border-primary-300', headerBg: 'bg-primary-50 text-primary-700' },
  { key: 'contacted', label: 'Contacted', color: 'border-accent-300', headerBg: 'bg-accent-50 text-accent-700' },
  { key: 'screened', label: 'Screened', color: 'border-warning-300', headerBg: 'bg-warning-50 text-warning-700' },
  { key: 'interview_scheduled', label: 'Interview', color: 'border-success-300', headerBg: 'bg-success-50 text-success-700' },
  { key: 'offer', label: 'Offer', color: 'border-primary-400', headerBg: 'bg-primary-100 text-primary-800' },
  { key: 'closed', label: 'Closed', color: 'border-surface-300', headerBg: 'bg-surface-100 text-surface-600' },
];

const voiceStatusIcons: Record<string, { icon: typeof PhoneCall; color: string }> = {
  interested: { icon: PhoneCall, color: 'text-success-500' },
  completed: { icon: Phone, color: 'text-primary-500' },
  declined: { icon: PhoneOff, color: 'text-danger-500' },
  no_answer: { icon: PhoneMissed, color: 'text-warning-500' },
  pending: { icon: Phone, color: 'text-surface-400' },
};

const CandidatePipelinePage: FC = () => {
  const [selectedJD, setSelectedJD] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<PipelineCandidate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredCandidates =
    selectedJD === 'all'
      ? mockPipelineCandidates
      : mockPipelineCandidates.filter((c) => c.jdId === selectedJD);

  const getCandidatesForStage = (stage: PipelineStage) =>
    filteredCandidates.filter((c) => c.stage === stage);

  const handleGenerateShortlist = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <AppLayout sidebarItems={recruiterSidebarItems} title="Candidate Pipeline" userRole="recruiter">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-surface-900">Candidate Pipeline</h2>
            <p className="mt-1 text-sm text-surface-500">
              Track candidates through your hiring stages
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={selectedJD}
              onChange={(e) => setSelectedJD(e.target.value)}
              className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:w-auto"
            >
              <option value="all">All Job Descriptions</option>
              {mockJobDescriptions.map((jd) => (
                <option key={jd.id} value={jd.id}>
                  {jd.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerateShortlist}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? 'Generating...' : 'Generate AI Shortlist'}
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {stages.map((stage) => {
            const candidates = getCandidatesForStage(stage.key);
            return (
              <div
                key={stage.key}
                className={`flex w-72 shrink-0 flex-col rounded-xl border-t-2 bg-surface-50 ${stage.color}`}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between rounded-t-lg px-4 py-3 ${stage.headerBg}`}>
                  <h4 className="text-sm font-semibold">{stage.label}</h4>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/60 text-xs font-bold">
                    {candidates.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-2.5 p-3">
                  {candidates.map((c) => {
                    const voiceStatus = c.voiceOutreachStatus
                      ? voiceStatusIcons[c.voiceOutreachStatus]
                      : null;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCandidate(c)}
                        className="w-full rounded-lg border border-surface-200 bg-white p-3.5 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-surface-900">{c.name}</p>
                            <p className="text-xs text-surface-500">{c.role}</p>
                          </div>
                          <ScoreBadge score={c.matchScore} size="sm" />
                        </div>
                        <div className="mb-2 flex flex-wrap gap-1">
                          {c.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="rounded bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium text-surface-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        {voiceStatus && (
                          <div className="flex items-center gap-1">
                            <voiceStatus.icon className={`h-3 w-3 ${voiceStatus.color}`} />
                            <span className="text-[10px] capitalize text-surface-400">
                              {c.voiceOutreachStatus?.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                  {candidates.length === 0 && (
                    <p className="py-6 text-center text-xs text-surface-400">No candidates</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      <Modal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        title={selectedCandidate?.name ?? 'Candidate'}
        size="xl"
      >
        {selectedCandidate && (
          <div className="space-y-5">
            {/* Score & Role */}
            <div className="flex items-center gap-4">
              <ScoreBadge score={selectedCandidate.matchScore} size="lg" />
              <div>
                <p className="text-lg font-semibold text-surface-900">{selectedCandidate.role}</p>
                <div className="mt-1 flex items-center gap-3 text-sm text-surface-500">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {selectedCandidate.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedCandidate.location}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="rounded-lg bg-primary-50 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-primary-700">
                <Sparkles className="h-4 w-4" />
                AI Summary
              </div>
              <p className="text-sm text-primary-800">{selectedCandidate.aiSummary}</p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-surface-700">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Match Breakdown */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-surface-700">Match Breakdown</h4>
              <div className="space-y-2">
                {[
                  { label: 'Skills Match', value: Math.min(selectedCandidate.matchScore + 3, 100) },
                  { label: 'Experience Match', value: Math.min(selectedCandidate.matchScore - 2, 100) },
                  { label: 'Location Match', value: selectedCandidate.location === 'Remote' ? 100 : 85 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-sm text-surface-600 sm:w-32">{item.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-200">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-medium text-surface-700">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 border-t border-surface-200 pt-4">
              <button className="flex items-center gap-1.5 rounded-lg bg-success-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success-700">
                <Phone className="h-4 w-4" />
                Voice Call
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700">
                <Calendar className="h-4 w-4" />
                Schedule Interview
              </button>
            </div>

            {/* Stage Change */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-surface-700">Move to Stage</h4>
              <div className="flex flex-wrap gap-2">
                {stages
                  .filter((s) => s.key !== selectedCandidate.stage)
                  .map((s) => (
                    <button
                      key={s.key}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80 ${s.headerBg}`}
                    >
                      {s.label}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
};

export default CandidatePipelinePage;

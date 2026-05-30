import { useState, type FC } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Star,
  List,
  LayoutGrid,
  MessageSquare,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { AppLayout, Modal, StatCard } from '@shared/components';
import { mockInterviews } from '@shared/data/mockData';
import type { Interview } from '@shared/types';
import { recruiterSidebarItems } from '../components/sidebarConfig';

type StatusFilter = 'all' | 'scheduled' | 'completed' | 'no_show' | 'cancelled' | 'rescheduled';

const statusConfig: Record<
  string,
  { label: string; badge: string; icon: typeof CheckCircle2 }
> = {
  scheduled: { label: 'Scheduled', badge: 'bg-primary-100 text-primary-700', icon: Clock },
  completed: { label: 'Completed', badge: 'bg-success-100 text-success-700', icon: CheckCircle2 },
  no_show: { label: 'No Show', badge: 'bg-danger-100 text-danger-700', icon: XCircle },
  rescheduled: { label: 'Rescheduled', badge: 'bg-warning-100 text-warning-700', icon: RotateCcw },
  cancelled: { label: 'Cancelled', badge: 'bg-surface-100 text-surface-600', icon: AlertTriangle },
};

const filterTabs: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'No Show', value: 'no_show' },
  { label: 'Rescheduled', value: 'rescheduled' },
  { label: 'Cancelled', value: 'cancelled' },
];

const InterviewTrackingPage: FC = () => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [feedbackModal, setFeedbackModal] = useState<Interview | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackOutcome, setFeedbackOutcome] = useState('advance');

  const filtered =
    activeFilter === 'all'
      ? mockInterviews
      : mockInterviews.filter((i) => i.status === activeFilter);

  const totalInterviews = mockInterviews.length;
  const completed = mockInterviews.filter((i) => i.status === 'completed').length;
  const noShows = mockInterviews.filter((i) => i.status === 'no_show').length;
  const noShowRate = totalInterviews > 0 ? Math.round((noShows / totalInterviews) * 100) : 0;

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setFeedbackRating(star)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? 'fill-warning-400 text-warning-400'
                  : 'text-surface-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const openFeedback = (interview: Interview) => {
    setFeedbackModal(interview);
    setFeedbackRating(interview.rating ?? 0);
    setFeedbackText(interview.feedback ?? '');
    setFeedbackOutcome('advance');
  };

  return (
    <AppLayout sidebarItems={recruiterSidebarItems} title="Interviews" userRole="recruiter">
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Interviews"
            value={totalInterviews}
            change={`${mockInterviews.filter((i) => i.status === 'scheduled').length} upcoming`}
            trend="neutral"
            icon={Calendar}
          />
          <StatCard
            title="Completed"
            value={completed}
            change={`${Math.round((completed / totalInterviews) * 100)}% completion`}
            trend="up"
            icon={CheckCircle2}
          />
          <StatCard
            title="No-Show Rate"
            value={`${noShowRate}%`}
            change={`${noShows} no-shows`}
            trend={noShowRate > 20 ? 'down' : 'up'}
            icon={AlertTriangle}
          />
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-surface-100 p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeFilter === tab.value
                    ? 'bg-white text-surface-900 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-lg border border-surface-200 p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-surface-400 hover:text-surface-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`rounded-md p-2 transition-colors ${
                viewMode === 'card'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-surface-400 hover:text-surface-600'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Interview List */}
        {viewMode === 'list' ? (
          <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-x-auto">
            <div className="min-w-[700px] grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 border-b border-surface-200 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
              <span>Candidate</span>
              <span>Job Description</span>
              <span>Date & Time</span>
              <span>Status</span>
              <span>Rating</span>
              <span>Actions</span>
            </div>
            <div className="min-w-[700px] divide-y divide-surface-100">
              {filtered.map((iv) => {
                const { date, time } = formatDateTime(iv.scheduledAt);
                const cfg = statusConfig[iv.status];
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={iv.id}
                    className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                        {iv.candidateName
                          .split(' ')
                          .map((w) => w[0])
                          .join('')}
                      </div>
                      <span className="text-sm font-medium text-surface-900">
                        {iv.candidateName}
                      </span>
                    </div>
                    <span className="text-sm text-surface-600">{iv.jdTitle}</span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-surface-700">{date}</p>
                      <p className="text-xs text-surface-400">{time}</p>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.badge}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                    <div className="w-24">
                      {iv.rating ? renderStars(iv.rating) : <span className="text-xs text-surface-400">--</span>}
                    </div>
                    <div className="flex gap-1.5">
                      <button className="rounded-lg border border-surface-200 p-1.5 text-surface-500 transition-colors hover:bg-surface-50 hover:text-surface-700">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openFeedback(iv)}
                        className="rounded-lg border border-surface-200 p-1.5 text-surface-500 transition-colors hover:bg-surface-50 hover:text-surface-700"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg border border-surface-200 p-1.5 text-surface-500 transition-colors hover:bg-surface-50 hover:text-surface-700">
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg border border-surface-200 p-1.5 text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-600">
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((iv) => {
              const { date, time } = formatDateTime(iv.scheduledAt);
              const cfg = statusConfig[iv.status];
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={iv.id}
                  className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                        {iv.candidateName
                          .split(' ')
                          .map((w) => w[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{iv.candidateName}</p>
                        <p className="text-xs text-surface-500">{iv.jdTitle}</p>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.badge}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="mb-3 flex items-center gap-2 text-sm text-surface-600">
                    <Calendar className="h-4 w-4 text-surface-400" />
                    {date} at {time}
                  </div>
                  {iv.rating && <div className="mb-3">{renderStars(iv.rating)}</div>}
                  {iv.feedback && (
                    <p className="mb-3 text-xs text-surface-500 line-clamp-2">{iv.feedback}</p>
                  )}
                  <div className="flex gap-2 border-t border-surface-100 pt-3">
                    <button className="flex-1 rounded-lg border border-surface-200 py-1.5 text-xs font-medium text-surface-600 transition-colors hover:bg-surface-50">
                      View
                    </button>
                    <button
                      onClick={() => openFeedback(iv)}
                      className="flex-1 rounded-lg border border-surface-200 py-1.5 text-xs font-medium text-surface-600 transition-colors hover:bg-surface-50"
                    >
                      Feedback
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-surface-500">No interviews found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <Modal
        isOpen={!!feedbackModal}
        onClose={() => setFeedbackModal(null)}
        title={`Feedback - ${feedbackModal?.candidateName ?? ''}`}
        size="lg"
      >
        {feedbackModal && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-surface-600">
                {feedbackModal.jdTitle} &middot;{' '}
                {new Date(feedbackModal.scheduledAt).toLocaleDateString('en-IN', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-700">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= feedbackRating
                          ? 'fill-warning-400 text-warning-400'
                          : 'text-surface-300 hover:text-warning-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Feedback Notes
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                placeholder="Share your observations about the candidate..."
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Outcome */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">Outcome</label>
              <select
                value={feedbackOutcome}
                onChange={(e) => setFeedbackOutcome(e.target.value)}
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="advance">Advance to Next Stage</option>
                <option value="hold">Hold / Need More Info</option>
                <option value="reject">Reject</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setFeedbackModal(null)}
                className="rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setFeedbackModal(null)}
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
              >
                Save Feedback
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
};

export default InterviewTrackingPage;

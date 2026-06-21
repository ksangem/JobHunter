import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { InterviewStatus, OfferStatus, type Interview, type Offer } from '@jobhunter/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Screen } from '@/components/ui/Screen';
import { TopBar } from '@/components/shared/TopBar';
import { SideSheet } from '@/components/shared/SideSheet';
import { StatRow } from '@/components/shared/domain';
import {
  useListInterviewsQuery,
  useConfirmInterviewMutation,
  useListOffersQuery,
  useOfferActionMutation,
} from '@/store/api/recruiterApi';
import { formatCurrency, formatDate } from '@/lib/utils';

function errText(e: unknown): string {
  const err = (e as { data?: { title?: string; detail?: string } })?.data;
  return err?.detail ?? err?.title ?? 'Something went wrong.';
}

const STATUS_TONE: Record<InterviewStatus, 'gray' | 'brand' | 'success' | 'warning' | 'danger' | 'navy'> = {
  [InterviewStatus.SCHEDULED]: 'brand',
  [InterviewStatus.CONFIRMED]: 'success',
  [InterviewStatus.RESCHEDULED]: 'warning',
  [InterviewStatus.COMPLETED]: 'navy',
  [InterviewStatus.CANCELLED]: 'danger',
  [InterviewStatus.NO_SHOW]: 'danger',
};

const OFFER_TONE: Record<OfferStatus, 'gray' | 'brand' | 'success' | 'warning' | 'danger' | 'navy'> = {
  [OfferStatus.DRAFT]: 'gray',
  [OfferStatus.APPROVED]: 'brand',
  [OfferStatus.SENT]: 'warning',
  [OfferStatus.ACCEPTED]: 'success',
  [OfferStatus.DECLINED]: 'danger',
  [OfferStatus.REVOKED]: 'danger',
};

export default function InterviewsScreen() {
  const { data: interviews, isLoading } = useListInterviewsQuery();
  const { data: offers, isLoading: loadingOffers } = useListOffersQuery();
  const [confirm, { isLoading: confirming }] = useConfirmInterviewMutation();
  const [offerAction, { isLoading: offerActing }] = useOfferActionMutation();

  const [feedbackFor, setFeedbackFor] = useState<Interview | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const onConfirm = async (id: string) => {
    setBanner(null);
    try {
      await confirm(id).unwrap();
    } catch (e) {
      setBanner(errText(e));
    }
  };

  const onOfferAction = async (id: string, action: 'approve' | 'accept' | 'decline' | 'revoke') => {
    setBanner(null);
    try {
      await offerAction({ id, action }).unwrap();
    } catch (e) {
      setBanner(errText(e));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Interviews" bellRoute="/(candidate)/notifications" />
      <Screen>
        {banner ? (
          <View className="mb-3 rounded-xl border border-warning-100 bg-warning-50 px-3 py-2">
            <Text className="text-sm font-medium text-warning">{banner}</Text>
          </View>
        ) : null}

        <SectionHeader title="Interviews" subtitle="All scheduled & completed interviews" />
        {isLoading ? (
          <Loader label="Loading interviews…" />
        ) : !interviews?.length ? (
          <EmptyState title="No interviews" subtitle="Scheduled interviews will appear here." />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {interviews.map((it) => {
              const hotReschedule = it.reschedule_count >= 3;
              return (
                <Card key={it.id} className="min-w-[300px] flex-1">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <Text className="text-base font-bold text-gray-900">{it.candidate_name ?? 'Candidate'}</Text>
                      <Text className="mt-0.5 text-sm text-gray-500">{it.jd_title ?? '—'} · {it.type}</Text>
                    </View>
                    <Badge label={it.status} tone={STATUS_TONE[it.status]} dot />
                  </View>

                  <View className="mt-2">
                    <StatRow label="When" value={formatDate(it.scheduled_at, true)} />
                    <StatRow label="Platform" value={it.platform} />
                    <View className="flex-row items-center justify-between border-b border-gray-100 py-2.5">
                      <Text className="text-sm text-gray-500">Reschedules</Text>
                      <Text className={`text-sm font-semibold ${hotReschedule ? 'text-danger' : 'text-gray-900'}`}>
                        {it.reschedule_count}{hotReschedule ? ' ⚠' : ''}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-3 flex-row flex-wrap gap-2">
                    {it.status === InterviewStatus.SCHEDULED ? (
                      <View className="flex-1">
                        <Button label="Confirm" size="sm" loading={confirming} onPress={() => onConfirm(it.id)} />
                      </View>
                    ) : null}
                    <View className="flex-1">
                      <Button label="Reschedule" variant="outline" size="sm" onPress={() => setBanner('Reschedule flow not implemented in demo.')} />
                    </View>
                    {it.status === InterviewStatus.COMPLETED ? (
                      <View className="flex-1">
                        <Button label="Feedback scorecard" variant="secondary" size="sm" onPress={() => setFeedbackFor(it)} />
                      </View>
                    ) : null}
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {/* Offers */}
        <View className="mt-6">
          <SectionHeader title="Offers" subtitle="Approve, accept, decline or revoke" />
          {loadingOffers ? (
            <Loader />
          ) : !offers?.length ? (
            <EmptyState title="No offers" subtitle="Offers will appear here." />
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {offers.map((o) => (
                <OfferCard key={o.id} offer={o} acting={offerActing} onAction={onOfferAction} tone={OFFER_TONE[o.status]} />
              ))}
            </View>
          )}
        </View>
      </Screen>

      <FeedbackSheet interview={feedbackFor} onClose={() => setFeedbackFor(null)} />
    </View>
  );
}

function OfferCard({ offer, acting, onAction, tone }: { offer: Offer; acting: boolean; onAction: (id: string, a: 'approve' | 'accept' | 'decline' | 'revoke') => void; tone: 'gray' | 'brand' | 'success' | 'warning' | 'danger' | 'navy' }) {
  return (
    <Card className="min-w-[300px] flex-1">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-base font-bold text-gray-900">{offer.candidate_name ?? 'Candidate'}</Text>
          <Text className="mt-0.5 text-sm text-gray-500">{formatCurrency(offer.base_salary, offer.currency)} base</Text>
        </View>
        <Badge label={offer.status} tone={tone} dot />
      </View>
      <View className="mt-2">
        <StatRow label="Valid until" value={formatDate(offer.valid_until)} />
        <StatRow label="Joining" value={formatDate(offer.joining_date)} />
      </View>
      <View className="mt-3 flex-row flex-wrap gap-2">
        <View className="flex-1">
          <Button label="Approve" size="sm" loading={acting} onPress={() => onAction(offer.id, 'approve')} />
        </View>
        <View className="flex-1">
          <Button label="Accept" variant="success" size="sm" loading={acting} onPress={() => onAction(offer.id, 'accept')} />
        </View>
        <View className="flex-1">
          <Button label="Decline" variant="outline" size="sm" loading={acting} onPress={() => onAction(offer.id, 'decline')} />
        </View>
        <View className="flex-1">
          <Button label="Revoke" variant="danger" size="sm" loading={acting} onPress={() => onAction(offer.id, 'revoke')} />
        </View>
      </View>
    </Card>
  );
}

const DIMENSIONS = [
  { key: 'technical', label: 'Technical' },
  { key: 'communication', label: 'Communication' },
  { key: 'problem_solving', label: 'Problem solving' },
  { key: 'culture_fit', label: 'Culture fit' },
] as const;

const RECOMMENDATIONS = ['STRONG_YES', 'YES', 'NO', 'STRONG_NO'] as const;

function FeedbackSheet({ interview, onClose }: { interview: Interview | null; onClose: () => void }) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [comments, setComments] = useState('');

  if (!interview) return null;

  const submit = () => {
    // Local-only in demo (no API hook). Just reset + close.
    setScores({});
    setRecommendation(null);
    setComments('');
    onClose();
  };

  return (
    <SideSheet visible={!!interview} onClose={onClose} title="Feedback scorecard">
      <View className="gap-4">
        <Card>
          <Text className="text-base font-bold text-gray-900">{interview.candidate_name}</Text>
          <Text className="text-sm text-gray-500">{interview.jd_title} · {interview.type}</Text>
        </Card>

        {DIMENSIONS.map((d) => (
          <View key={d.key}>
            <Text className="mb-1.5 text-sm font-medium text-gray-700">{d.label}</Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((n) => {
                const active = scores[d.key] === n;
                return (
                  <Pressable
                    key={n}
                    onPress={() => setScores((s) => ({ ...s, [d.key]: n }))}
                    className={`h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-brand' : 'bg-white border border-gray-300'}`}
                  >
                    <Text className={`text-sm font-bold ${active ? 'text-white' : 'text-gray-700'}`}>{n}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <View>
          <Text className="mb-1.5 text-sm font-medium text-gray-700">Recommendation</Text>
          <View className="flex-row flex-wrap gap-2">
            {RECOMMENDATIONS.map((r) => {
              const active = recommendation === r;
              return (
                <Pressable key={r} onPress={() => setRecommendation(r)} className={`rounded-full px-3.5 py-2 ${active ? 'bg-navy-900' : 'bg-white border border-gray-300'}`}>
                  <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{r}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Input label="Comments" value={comments} onChangeText={setComments} multiline placeholder="Notes for the hiring panel…" />

        <Text className="text-xs text-gray-400">Feedback is due within the 48h SLA after the interview.</Text>
        <Button label="Submit (48h SLA)" onPress={submit} fullWidth />
      </View>
    </SideSheet>
  );
}

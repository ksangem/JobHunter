import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ApplicationStage } from '@jobhunter/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TopBar } from '@/components/shared/TopBar';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { KanbanBoard } from '@/components/shared/KanbanBoard';
import { StatRow } from '@/components/shared/domain';
import { SideSheet } from '@/components/shared/SideSheet';
import {
  useListJdsQuery,
  useGetPipelineQuery,
  useChangeStageMutation,
  useApproveCandidateMutation,
  useGenerateShortlistMutation,
  useScheduleInterviewMutation,
  useSimilarCandidatesQuery,
} from '@/store/api/recruiterApi';
import { maskEmail, maskPhone } from '@/lib/utils';

type PipeCard = { id: string; candidate_id: string; stage: ApplicationStage; match_score?: number; candidate?: any; consented?: boolean };

function errText(e: unknown): string {
  const err = (e as { data?: { title?: string; detail?: string } })?.data;
  return err?.detail ?? err?.title ?? 'Something went wrong.';
}

export default function PipelineScreen() {
  const { data: jds } = useListJdsQuery();
  const [selectedJd, setSelectedJd] = useState<string>('jd_1');
  const { data: pipeline, isLoading } = useGetPipelineQuery(selectedJd);
  const [changeStage] = useChangeStageMutation();
  const [generateShortlist, { isLoading: shortlisting }] = useGenerateShortlistMutation();

  const [banner, setBanner] = useState<string | null>(null);
  const [openCard, setOpenCard] = useState<PipeCard | null>(null);

  const onMove = async (candidateId: string, to: ApplicationStage) => {
    setBanner(null);
    try {
      await changeStage({ candidateId, stage: to }).unwrap();
    } catch (e) {
      setBanner(errText(e));
    }
  };

  const onShortlist = async () => {
    setBanner(null);
    try {
      const res = await generateShortlist(selectedJd).unwrap();
      setBanner(res.message);
    } catch (e) {
      setBanner(errText(e));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Pipeline" bellRoute="/(candidate)/notifications" />

      <View className="px-4 pt-4">
        {/* JD selector */}
        <View className="flex-row flex-wrap gap-2">
          {(jds ?? []).map((jd) => {
            const active = jd.id === selectedJd;
            return (
              <Pressable
                key={jd.id}
                onPress={() => setSelectedJd(jd.id)}
                className={`rounded-full px-3.5 py-2 ${active ? 'bg-brand' : 'bg-white border border-gray-300'}`}
              >
                <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{jd.title}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* AI shortlist */}
        <View className="mt-3 flex-row items-center gap-3">
          <View>
            <Button label="Generate AI shortlist" variant="secondary" size="sm" loading={shortlisting} onPress={onShortlist} />
          </View>
          <Text className="flex-1 text-xs text-gray-400">AI ranking is advisory until a human clicks APPROVE before advancing (G-013).</Text>
        </View>

        {banner ? (
          <View className="mt-3 rounded-xl border border-warning-100 bg-warning-50 px-3 py-2">
            <Text className="text-sm font-medium text-warning">{banner}</Text>
          </View>
        ) : null}
      </View>

      {/* Kanban */}
      <View className="mt-3 flex-1 px-4 pb-2">
        {isLoading ? (
          <Loader label="Loading pipeline…" />
        ) : !pipeline?.length ? (
          <EmptyState title="No candidates in this pipeline" subtitle="Generate an AI shortlist or source candidates to begin." />
        ) : (
          <KanbanBoard cards={pipeline as never} onMove={onMove} onOpen={(c) => setOpenCard(c as PipeCard)} />
        )}
      </View>

      <CandidateProfileDrawer card={openCard} onClose={() => setOpenCard(null)} setBanner={setBanner} />
    </View>
  );
}

function CandidateProfileDrawer({ card, onClose, setBanner }: { card: PipeCard | null; onClose: () => void; setBanner: (s: string | null) => void }) {
  const [approve, { isLoading: approving }] = useApproveCandidateMutation();
  const [schedule, { isLoading: scheduling }] = useScheduleInterviewMutation();
  const { data: similar, isLoading: loadingSimilar } = useSimilarCandidatesQuery(card?.candidate_id ?? '', { skip: !card });

  if (!card) return null;
  const cand = card.candidate ?? {};
  const masked = cand.email_masked === true;

  const onApprove = async () => {
    setBanner(null);
    try {
      await approve(card.candidate_id).unwrap();
      setBanner('Candidate approved (human validation recorded).');
    } catch (e) {
      const err = (e as { data?: { detail?: string; title?: string } })?.data;
      setBanner(err?.detail ?? err?.title ?? 'Approve failed.');
    }
  };

  const onSchedule = async () => {
    setBanner(null);
    try {
      await schedule({
        application_id: card.id,
        candidate_id: card.candidate_id,
        type: 'TECHNICAL',
        proposed_slots: [new Date().toISOString()],
        duration_min: 45,
        platform: 'GOOGLE_MEET',
      }).unwrap();
      setBanner('Interview scheduled.');
      onClose();
    } catch (e) {
      const err = (e as { data?: { detail?: string; title?: string } })?.data;
      setBanner(err?.detail ?? err?.title ?? 'Could not schedule interview.');
    }
  };

  return (
    <SideSheet visible={!!card} onClose={onClose} title="Candidate profile">
      <View className="gap-4">
        <Card>
          <View className="flex-row items-center gap-4">
            <ScoreRing score={card.match_score ?? 0} size={72} label="match" />
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">{cand.full_name ?? 'Candidate'}</Text>
              <Text className="text-sm text-gray-500">{cand.headline ?? '—'}</Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                <Badge label={cand.source ?? 'PLATFORM'} tone={cand.source && cand.source !== 'PLATFORM' ? 'warning' : 'navy'} />
                <Badge label={card.consented ? 'Consented' : 'No consent'} tone={card.consented ? 'success' : 'danger'} dot />
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <SectionHeader title="Contact" subtitle={masked ? 'Masked until consent (G-025)' : undefined} />
          <StatRow label="Email" value={masked ? maskEmail(null) : (cand.email ?? maskEmail(cand.email))} />
          <StatRow label="Phone" value={masked ? maskPhone(null) : (cand.phone ?? maskPhone(cand.phone))} />
          <StatRow label="Location" value={cand.location ?? '—'} />
          <StatRow label="Experience" value={`${cand.experience_years ?? '—'} yrs`} />
        </Card>

        <View className="gap-2">
          <Button label="Approve (human validation)" variant="success" loading={approving} onPress={onApprove} />
          <Button label="Schedule interview" variant="primary" loading={scheduling} onPress={onSchedule} />
        </View>

        <Card>
          <SectionHeader title="Similar candidates" subtitle="AI similarity (advisory)" />
          {loadingSimilar ? (
            <Loader />
          ) : !similar?.length ? (
            <Text className="text-sm text-gray-400">No similar candidates found.</Text>
          ) : (
            <View className="gap-2">
              {similar.map((s) => {
                const sc = s as unknown as PipeCard;
                return (
                  <View key={sc.id} className="flex-row items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                    <Text className="text-sm font-medium text-gray-800">{sc.candidate?.full_name ?? 'Candidate'}</Text>
                    <Badge label={`${sc.match_score ?? 0}% match`} tone="brand" />
                  </View>
                );
              })}
            </View>
          )}
        </Card>
      </View>
    </SideSheet>
  );
}

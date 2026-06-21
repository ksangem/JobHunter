import { Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { StatRow } from '@/components/shared/domain';
import { InterviewStatus } from '@jobhunter/types';
import { useListInterviewsQuery, useConfirmInterviewMutation } from '@/store/api/recruiterApi';
import { formatDate } from '@/lib/utils';

export default function CandidateInterviews() {
  const { data, isLoading } = useListInterviewsQuery();
  const [confirm, { isLoading: confirming }] = useConfirmInterviewMutation();
  const mine = data?.filter((i) => i.candidate_id === 'cand_1') ?? [];

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'My Interviews' }} />
      {isLoading ? (
        <Loader />
      ) : !mine.length ? (
        <EmptyState title="No interviews scheduled" subtitle="You'll be notified when a recruiter schedules one." />
      ) : (
        <View className="gap-3">
          {mine.map((it) => (
            <Card key={it.id}>
              <View className="flex-row items-start justify-between">
                <Text className="flex-1 text-base font-bold text-gray-900">{it.jd_title}</Text>
                <Badge label={it.status} tone={it.status === InterviewStatus.CONFIRMED ? 'success' : it.status === InterviewStatus.COMPLETED ? 'gray' : 'warning'} />
              </View>
              <View className="mt-2">
                <StatRow label="Type" value={it.type} />
                <StatRow label="When" value={formatDate(it.scheduled_at, true)} />
                <StatRow label="Duration" value={`${it.duration_min} min`} />
                <StatRow label="Platform" value={it.platform} />
                {it.interviewers?.length ? <StatRow label="Interviewers" value={it.interviewers.join(', ')} /> : null}
              </View>
              {it.prep_checklist?.length ? (
                <View className="mt-3 rounded-xl bg-gray-50 p-3">
                  <Text className="mb-1.5 text-xs font-semibold text-gray-600">Prep checklist</Text>
                  {it.prep_checklist.map((c, i) => (
                    <Text key={i} className={`text-sm ${c.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{c.done ? '☑' : '☐'} {c.item}</Text>
                  ))}
                </View>
              ) : null}
              <View className="mt-3 flex-row gap-2">
                {it.status !== InterviewStatus.COMPLETED ? (
                  <>
                    {it.join_url ? <Button label="Join" size="sm" onPress={() => {}} /> : null}
                    {it.status !== InterviewStatus.CONFIRMED ? <Button label="Confirm" size="sm" variant="outline" loading={confirming} onPress={() => confirm(it.id)} /> : null}
                    <Button label="Reschedule" size="sm" variant="ghost" onPress={() => {}} />
                  </>
                ) : null}
              </View>
              <Text className="mt-2 text-[11px] text-gray-400">Join link active only T-30 → T+60 min · ICS includes both timezones.</Text>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

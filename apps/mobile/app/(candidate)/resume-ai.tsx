import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TopBar } from '@/components/shared/TopBar';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { useGetAtsScoreQuery, useGetSuggestionsQuery, useRecalculateAtsMutation, useRebuildResumeMutation } from '@/store/api/candidateApi';

const FACTOR_LABEL: Record<string, string> = { skills: 'Skills', keywords: 'Keywords', experience: 'Experience', formatting: 'Formatting' };

export default function ResumeAiScreen() {
  const { data: ats, isLoading } = useGetAtsScoreQuery();
  const { data: suggestions } = useGetSuggestionsQuery();
  const [recalc, { isLoading: recalculating }] = useRecalculateAtsMutation();
  const [rebuild, { isLoading: rebuilding }] = useRebuildResumeMutation();
  const [done, setDone] = useState<string[]>([]);
  const [rebuildNote, setRebuildNote] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Resume AI" bellRoute="/(candidate)/notifications" />
      <Screen>
        {isLoading || !ats ? (
          <Loader label="Scoring your resume…" />
        ) : (
          <View className="gap-4">
            <Card>
              <View className="flex-row items-center gap-4">
                <ScoreRing score={ats.score} size={110} label="ATS" />
                <View className="flex-1 gap-2">
                  {Object.entries(ats.breakdown).map(([k, v]) => (
                    <View key={k}>
                      <View className="flex-row justify-between"><Text className="text-xs text-gray-500">{FACTOR_LABEL[k]}</Text><Text className="text-xs font-semibold text-gray-700">{v}%</Text></View>
                      <ProgressBar value={v as number} height={6} />
                    </View>
                  ))}
                </View>
              </View>
              <View className="mt-4">
                <Button label="Recalculate score" variant="outline" size="sm" loading={recalculating} onPress={() => recalc()} />
              </View>
            </Card>

            <Card>
              <SectionHeader title="AI suggestions" subtitle="Sorted by potential score gain" />
              <View className="gap-3">
                {(suggestions ?? []).map((s) => {
                  const completed = done.includes(s.id);
                  return (
                    <View key={s.id} className={`rounded-xl border p-3 ${completed ? 'border-success-100 bg-success-50' : 'border-gray-100'}`}>
                      <View className="flex-row items-start justify-between">
                        <Text className="flex-1 pr-2 text-sm font-semibold text-gray-900">{s.title}</Text>
                        <Badge label={`+${s.score_delta}`} tone={completed ? 'success' : 'brand'} />
                      </View>
                      <Text className="mt-1 text-xs text-gray-500">{s.detail}</Text>
                      <View className="mt-2 flex-row gap-2">
                        <Button label={completed ? 'Completed ✓' : 'Mark done'} size="sm" variant={completed ? 'success' : 'ghost'} onPress={() => setDone((d) => (d.includes(s.id) ? d.filter((x) => x !== s.id) : [...d, s.id]))} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>

            <Card>
              <SectionHeader title="AI resume redesign" subtitle="Generate a JD-tailored CV (governed)" />
              <Text className="text-sm text-gray-500">The AI creates a new CV version as a DRAFT. It is <Text className="font-semibold text-gray-700">never auto-activated</Text> — you must explicitly approve it before it becomes your active CV (FR-JS-024).</Text>
              <View className="mt-3">
                <Button
                  label="Rebuild CV for 'Staff Backend Engineer'"
                  loading={rebuilding}
                  onPress={async () => {
                    const res = await rebuild('jd_2').unwrap().catch(() => null);
                    if (res) setRebuildNote(res.note);
                  }}
                />
              </View>
              {rebuildNote ? (
                <View className="mt-3 rounded-xl bg-brand-50 p-3">
                  <Text className="text-sm text-brand-700">{rebuildNote}</Text>
                  <Text className="mt-2 text-sm font-semibold text-brand" onPress={() => router.push('/(candidate)/cv')}>Review & approve in CV versions →</Text>
                </View>
              ) : null}
            </Card>
          </View>
        )}
      </Screen>
    </View>
  );
}

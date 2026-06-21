import { useState } from 'react';
import { Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkillChips, StatRow } from '@/components/shared/domain';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { useGetRecommendationsQuery, useApplyToJobMutation, useGetSkillGapQuery } from '@/store/api/candidateApi';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: recs, isLoading } = useGetRecommendationsQuery();
  const rec = recs?.find((r) => r.jd.id === id);
  const { data: gap } = useGetSkillGapQuery(id ?? '', { skip: !id });
  const [apply, { isLoading: applying }] = useApplyToJobMutation();
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onApply = async () => {
    setError(null);
    try {
      await apply(id ?? '').unwrap();
      setApplied(true);
    } catch (e: any) {
      setError(e?.data?.detail ?? e?.data?.title ?? 'Could not apply');
    }
  };

  if (isLoading) return <Screen><Loader /></Screen>;
  if (!rec) return <Screen><Text className="text-center text-gray-500">Job not found.</Text></Screen>;
  const { jd, match_score, breakdown, explanation } = rec;

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: jd.title, headerBackTitle: 'Jobs' }} />
      <View className="gap-4">
        <Card>
          <View className="flex-row items-start gap-4">
            <ScoreRing score={match_score} label="match" />
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-navy-900">{jd.title}</Text>
              <Text className="text-sm text-gray-500">{jd.location} · {jd.work_mode}</Text>
              {jd.salary_min ? <Text className="mt-1 text-base font-semibold text-gray-800">{formatCurrency(jd.salary_min, jd.currency)} – {formatCurrency(jd.salary_max ?? jd.salary_min, jd.currency)}</Text> : null}
              <View className="mt-2 flex-row gap-2">
                <Badge label={`${jd.exp_min}+ yrs`} tone="navy" />
                <Badge label={`Closes ${formatDate(jd.expected_close_date)}`} tone="warning" />
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <SectionHeader title="Why you match" subtitle="Explainable AI rationale (right to explanation)" />
          <Text className="text-sm italic text-gray-600">“{explanation}”</Text>
          <View className="mt-3 gap-1">
            <StatRow label="Semantic fit" value={`${breakdown.semantic}%`} />
            <StatRow label="Skills overlap" value={`${breakdown.skills}%`} />
            <StatRow label="Experience" value={`${breakdown.experience}%`} />
            <StatRow label="Location" value={`${breakdown.location}%`} />
          </View>
        </Card>

        <Card>
          <SectionHeader title="Required skills" />
          <SkillChips skills={jd.skills} max={12} />
        </Card>

        {gap ? (
          <Card>
            <SectionHeader title="Your skill gap vs this role" />
            {gap.critical.length ? <Text className="mb-1 text-sm font-semibold text-danger">Critical gaps</Text> : null}
            <SkillChips skills={gap.critical} max={8} />
            <Text className="mb-1 mt-3 text-sm font-semibold text-warning">Nice to have</Text>
            <SkillChips skills={gap.important} max={8} />
            <Text className="mb-1 mt-3 text-sm font-semibold text-success">Your strengths</Text>
            <SkillChips skills={gap.strengths} max={8} />
            <View className="mt-4">
              <Button label="Generate AI-tailored CV for this role" variant="outline" onPress={() => router.push('/(candidate)/resume-ai')} />
            </View>
          </Card>
        ) : null}

        {error ? <Text className="text-center text-sm text-danger">{error}</Text> : null}
        <Button label={applied ? 'Applied ✓' : 'Apply now'} onPress={onApply} loading={applying} disabled={applied} variant={applied ? 'success' : 'primary'} fullWidth />
        <Text className="text-center text-xs text-gray-400">Duplicate applications are blocked (Idempotency-Key · 409). Daily limit 50.</Text>
      </View>
    </Screen>
  );
}

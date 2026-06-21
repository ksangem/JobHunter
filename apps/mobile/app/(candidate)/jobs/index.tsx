import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Feedback';
import { TopBar } from '@/components/shared/TopBar';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { SkillChips } from '@/components/shared/domain';
import { useGetRecommendationsQuery, useSearchJobsQuery } from '@/store/api/candidateApi';
import { formatCurrency } from '@/lib/utils';

export default function JobsScreen() {
  const [q, setQ] = useState('');
  const { data: recs, isLoading } = useGetRecommendationsQuery();
  const { data: search } = useSearchJobsQuery(q, { skip: q.length < 2 });
  const searching = q.length >= 2;

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Jobs" bellRoute="/(candidate)/notifications" />
      <Screen>
        <Input placeholder="Search roles, skills, locations…" value={q} onChangeText={setQ} autoCapitalize="none" />
        {searching ? (
          <View className="mt-4 gap-3">
            <Text className="text-sm font-semibold text-gray-500">{search?.items.length ?? 0} results</Text>
            {(search?.items ?? []).map((jd) => (
              <Card key={jd.id} onPress={() => router.push(`/(candidate)/jobs/${jd.id}`)}>
                <Text className="text-base font-bold text-gray-900">{jd.title}</Text>
                <Text className="text-sm text-gray-500">{jd.location} · {jd.work_mode}</Text>
                <View className="mt-2"><SkillChips skills={jd.skills} max={5} /></View>
              </Card>
            ))}
          </View>
        ) : (
          <View className="mt-4 gap-3">
            <Text className="text-sm font-semibold text-gray-500">AI recommendations for you</Text>
            {isLoading ? (
              <Loader />
            ) : (
              (recs ?? []).map(({ jd, match_score, explanation }) => (
                <Card key={jd.id} onPress={() => router.push(`/(candidate)/jobs/${jd.id}`)}>
                  <View className="flex-row items-start gap-3">
                    <ScoreRing score={match_score} size={56} label="match" />
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="flex-1 text-base font-bold text-gray-900">{jd.title}</Text>
                        {match_score >= 85 ? <Badge label="Top match" tone="success" /> : null}
                      </View>
                      <Text className="text-sm text-gray-500">{jd.location} · {jd.work_mode}</Text>
                      {jd.salary_min ? <Text className="mt-0.5 text-sm font-medium text-gray-700">{formatCurrency(jd.salary_min, jd.currency)} – {formatCurrency(jd.salary_max ?? jd.salary_min, jd.currency)}</Text> : null}
                      <View className="mt-2"><SkillChips skills={jd.skills} max={4} /></View>
                      <Text className="mt-2 text-xs italic text-gray-400" numberOfLines={2}>“{explanation}”</Text>
                    </View>
                  </View>
                </Card>
              ))
            )}
          </View>
        )}
      </Screen>
    </View>
  );
}

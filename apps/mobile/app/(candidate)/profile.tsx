import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Loader } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TopBar } from '@/components/shared/TopBar';
import { Avatar } from '@/components/ui/Avatar';
import { SkillChips, StatRow } from '@/components/shared/domain';
import { useGetMeQuery, useGetCompletenessQuery } from '@/store/api/candidateApi';
import { formatCurrency } from '@/lib/utils';

export default function ProfileScreen() {
  const { data: me, isLoading } = useGetMeQuery();
  const { data: completeness } = useGetCompletenessQuery();

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Profile" bellRoute="/(candidate)/notifications" />
      <Screen>
        {isLoading || !me ? (
          <Loader />
        ) : (
          <View className="gap-4">
            <Card>
              <View className="flex-row items-center gap-3">
                <Avatar name={me.full_name} size="lg" />
                <View className="flex-1">
                  <Text className="text-lg font-extrabold text-navy-900">{me.full_name}</Text>
                  <Text className="text-sm text-gray-500">{me.headline}</Text>
                  <Text className="text-xs text-gray-400">{me.location} · {me.experience_years} yrs exp</Text>
                </View>
              </View>
              {me.voice_enrolled ? <View className="mt-3"><Badge label="Voice enrolled ✓" tone="success" /></View> : null}
            </Card>

            <Card>
              <SectionHeader title="Completeness" />
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl font-extrabold text-navy-900">{completeness?.score ?? me.completeness}%</Text>
                <View className="flex-1"><ProgressBar value={completeness?.score ?? me.completeness ?? 0} tone="success" /></View>
              </View>
              {completeness?.missing_fields.length ? (
                <Text className="mt-2 text-xs text-gray-500">Add to improve: {completeness.missing_fields.map((f) => f.field).join(', ')}</Text>
              ) : null}
            </Card>

            <Card>
              <SectionHeader title="Skills" subtitle="⚠ marks AI-extracted fields below 0.7 confidence" />
              <SkillChips skills={me.skills} max={20} />
            </Card>

            <Card>
              <SectionHeader title="Experience" />
              {me.experiences?.map((e, i) => (
                <View key={i} className="border-b border-gray-100 py-2.5">
                  <Text className="text-sm font-semibold text-gray-900">{e.title}</Text>
                  <Text className="text-xs text-gray-500">{e.company} · {e.start.slice(0, 7)} – {e.end ? e.end.slice(0, 7) : 'Present'}</Text>
                  {e.summary ? <Text className="mt-1 text-xs text-gray-400">{e.summary}</Text> : null}
                </View>
              ))}
            </Card>

            <Card>
              <SectionHeader title="Job preferences" action={<Text className="text-sm font-semibold text-brand">Edit</Text>} />
              <StatRow label="Target roles" value={me.preferences?.target_roles.join(', ') ?? '—'} />
              <StatRow label="Locations" value={me.preferences?.target_locations.join(', ') ?? '—'} />
              <StatRow label="Min salary" value={me.preferences?.min_salary ? formatCurrency(me.preferences.min_salary, me.preferences.currency) : '—'} />
              <StatRow label="Work mode" value={me.preferences?.work_mode ?? '—'} />
              <StatRow label="Notice preference" value={`${me.preferences?.notice_pref ?? 0} days`} />
            </Card>

            <View className="flex-row gap-2">
              <View className="flex-1"><Button label="CV versions" variant="outline" onPress={() => router.push('/(candidate)/cv')} /></View>
              <View className="flex-1"><Button label="Interviews" variant="outline" onPress={() => router.push('/(candidate)/interviews')} /></View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1"><Button label="Update profile (wizard)" variant="ghost" onPress={() => router.push('/(candidate)/onboarding')} /></View>
              <View className="flex-1"><Button label="Settings" variant="ghost" onPress={() => router.push('/(candidate)/settings')} /></View>
            </View>
          </View>
        )}
      </Screen>
    </View>
  );
}

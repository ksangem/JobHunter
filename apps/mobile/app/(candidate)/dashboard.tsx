import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Loader, ErrorState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TopBar } from '@/components/shared/TopBar';
import { MetricCard } from '@/components/shared/MetricCard';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { LineChart, Funnel } from '@/components/shared/Charts';
import { StatRow } from '@/components/shared/domain';
import { useGetDashboardQuery, useGetMeQuery, useListNotificationsQuery } from '@/store/api/candidateApi';
import { formatDate } from '@/lib/utils';

export default function CandidateDashboard() {
  const { data: dash, isLoading, isError, refetch } = useGetDashboardQuery();
  const { data: me } = useGetMeQuery();
  const { data: notifs } = useListNotificationsQuery();
  const unread = notifs?.filter((n) => !n.read).length ?? 0;

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="JobHunter" bellRoute="/(candidate)/notifications" unread={unread} />
      <Screen>
        {isLoading ? (
          <Loader label="Loading your dashboard…" />
        ) : isError || !dash ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <View className="gap-5">
            <View>
              <Text className="text-2xl font-extrabold text-navy-900">Hi, {me?.full_name?.split(' ')[0] ?? 'there'} 👋</Text>
              <Text className="mt-1 text-sm text-gray-500">{me?.headline}</Text>
            </View>

            {/* Top metrics */}
            <View className="flex-row flex-wrap gap-3">
              <MetricCard value={dash.recommendation_count} label="New matches" accent="#2563EB" onPress={() => router.push('/(candidate)/jobs')} />
              <MetricCard value={dash.upcoming_interviews.length} label="Upcoming interviews" accent="#0A1F44" onPress={() => router.push('/(candidate)/interviews')} />
              <MetricCard value={`${dash.saved_jobs_expiring}`} label="Saved jobs expiring" accent="#D97706" onPress={() => router.push('/(candidate)/jobs')} />
            </View>

            {/* ATS + completeness */}
            <View className="flex-row flex-wrap gap-3">
              <Card className="flex-1 min-w-[220px]">
                <SectionHeader title="ATS score" subtitle="Resume health" />
                <View className="flex-row items-center gap-4">
                  <ScoreRing score={me?.ats_score ?? 0} label="/ 100" />
                  <View className="flex-1">
                    <Text className="text-sm text-gray-500">Your active CV scores well. Apply AI suggestions to push past 85.</Text>
                    <View className="mt-3">
                      <Button label="Open Resume AI" variant="outline" size="sm" onPress={() => router.push('/(candidate)/resume-ai')} />
                    </View>
                  </View>
                </View>
              </Card>

              <Card className="flex-1 min-w-[220px]">
                <SectionHeader title="Profile completeness" />
                <Text className="text-3xl font-extrabold text-navy-900">{dash.completeness}%</Text>
                <View className="mt-2"><ProgressBar value={dash.completeness} tone="success" /></View>
                <Text className="mt-3 text-xs text-gray-500">Missing: {dash.missing_fields.join(', ') || 'Nothing 🎉'}</Text>
                <View className="mt-3">
                  <Button label="Complete profile" variant="ghost" size="sm" onPress={() => router.push('/(candidate)/profile')} />
                </View>
              </Card>
            </View>

            {/* ATS trend */}
            <Card>
              <SectionHeader title="ATS score trend" subtitle="Last 5 months" />
              <LineChart data={dash.ats_trend} />
            </Card>

            {/* Application funnel */}
            <Card>
              <SectionHeader title="Application funnel" subtitle="Where your applications stand" action={<Text className="text-sm font-semibold text-brand" onPress={() => router.push('/(candidate)/applications')}>View all</Text>} />
              <Funnel data={dash.funnel} />
            </Card>

            {/* Upcoming interviews */}
            {dash.upcoming_interviews.length ? (
              <Card>
                <SectionHeader title="Next interview" />
                {dash.upcoming_interviews.map((it) => (
                  <View key={it.id}>
                    <StatRow label="Role" value={it.jd_title ?? '—'} />
                    <StatRow label="Type" value={it.type} />
                    <StatRow label="When" value={formatDate(it.scheduled_at, true)} />
                    <StatRow label="Platform" value={it.platform} />
                    <View className="mt-3">
                      <Button label="View interview details" variant="outline" size="sm" onPress={() => router.push('/(candidate)/interviews')} />
                    </View>
                  </View>
                ))}
              </Card>
            ) : null}
          </View>
        )}
      </Screen>
    </View>
  );
}

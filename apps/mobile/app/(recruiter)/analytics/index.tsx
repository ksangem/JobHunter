import { Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader, ErrorState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Screen } from '@/components/ui/Screen';
import { TopBar } from '@/components/shared/TopBar';
import { MetricCard } from '@/components/shared/MetricCard';
import { BarChart, Funnel } from '@/components/shared/Charts';
import { useGetRecruiterDashboardQuery } from '@/store/api/recruiterApi';
import { COLORS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export default function RecruiterAnalyticsScreen() {
  const { data: dash, isLoading, isError, refetch } = useGetRecruiterDashboardQuery();

  const exportReport = () => Alert.alert('Export', 'CSV / PDF export queued (demo).');

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Analytics" bellRoute="/(candidate)/notifications" />
      <Screen>
        {isLoading ? (
          <Loader label="Loading analytics…" />
        ) : isError || !dash ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <View className="gap-5">
            {/* KPIs */}
            <View className="flex-row flex-wrap gap-3">
              <MetricCard value={`${dash.kpis.time_to_hire}d`} label="Time to hire" accent={COLORS.brand} onPress={() => router.push('/(recruiter)/pipeline')} />
              <MetricCard value={`${dash.kpis.time_to_first_interview}d`} label="Time to first interview" accent={COLORS.navy500} onPress={() => router.push('/(recruiter)/interviews')} />
              <MetricCard value={`${dash.kpis.match_accuracy}%`} label="Match accuracy" accent={COLORS.success} onPress={() => router.push('/(recruiter)/pipeline')} />
              <MetricCard value={`${dash.kpis.pipeline_conversion}%`} label="Pipeline conversion" accent={COLORS.info} onPress={() => router.push('/(recruiter)/pipeline')} />
              <MetricCard value={`${dash.kpis.voice_response_rate}%`} label="Voice response rate" accent={COLORS.warning} onPress={() => router.push('/(recruiter)/voice-ai')} />
              <MetricCard value={`${dash.kpis.email_open_rate}%`} label="Email open rate" accent="#7C3AED" onPress={() => router.push('/(recruiter)/email')} />
              <MetricCard value={formatCurrency(dash.kpis.cost_per_placement, dash.kpis.currency)} label="Cost per placement" accent={COLORS.danger} onPress={() => router.push('/(recruiter)/pipeline')} />
            </View>

            <View className="flex-row flex-wrap gap-2">
              <View>
                <Button label="Market intelligence →" variant="outline" size="sm" onPress={() => router.push('/(recruiter)/market-intel')} />
              </View>
              <View>
                <Button label="Export CSV/PDF" variant="ghost" size="sm" onPress={exportReport} />
              </View>
            </View>

            {/* Hiring trends */}
            <Card>
              <SectionHeader title="Hiring trends" subtitle="Hires per month" />
              <BarChart data={dash.hiring_trends} />
            </Card>

            {/* Funnel */}
            <Card>
              <SectionHeader title="Pipeline funnel" subtitle="Sourced → Hired" />
              <Funnel data={dash.funnel} />
            </Card>

            {/* Top JDs */}
            <Card>
              <SectionHeader title="Top job descriptions" subtitle="By applicants & hires" />
              {dash.top_jds.map((jd) => (
                <View key={jd.jd_id} className="border-b border-gray-100 py-2.5">
                  <Text className="text-sm font-semibold text-gray-900">{jd.title}</Text>
                  <View className="mt-1 flex-row gap-4">
                    <Text className="text-xs text-gray-500">{jd.applicants} applicants</Text>
                    <Text className="text-xs text-success">{jd.hires} hires</Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}
      </Screen>
    </View>
  );
}

import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TopBar } from '@/components/shared/TopBar';
import { StatCard } from '@/components/shared/StatCard';
import { StageBadge } from '@/components/shared/domain';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { JdStatus, InterviewStatus } from '@jobhunter/types';
import { COLORS } from '@/lib/constants';
import { relativeTime, formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetRecruiterDashboardQuery,
  useListJdsQuery,
  useGetPipelineQuery,
  useListInterviewsQuery,
  useGetMyOrgQuery,
} from '@/store/api/recruiterApi';

const QUICK = [
  { label: 'Post New JD', icon: 'add-circle-outline' as const, route: '/(recruiter)/jds', accent: COLORS.brand },
  { label: 'AI Shortlist', icon: 'sparkles-outline' as const, route: '/(recruiter)/pipeline', accent: COLORS.info },
  { label: 'Voice Outreach', icon: 'call-outline' as const, route: '/(recruiter)/voice-ai', accent: COLORS.success },
  { label: 'View Analytics', icon: 'bar-chart-outline' as const, route: '/(recruiter)/analytics', accent: COLORS.warning },
];

const JD_TONE: Record<string, 'success' | 'warning' | 'gray' | 'danger' | 'navy'> = {
  ACTIVE: 'success', DRAFT: 'warning', REVIEW: 'navy', APPROVED: 'navy', ARCHIVED: 'gray',
};

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { data: dash, isLoading } = useGetRecruiterDashboardQuery();
  const { data: jds } = useListJdsQuery();
  const { data: pipeline } = useGetPipelineQuery('jd_1');
  const { data: interviews } = useListInterviewsQuery();
  const { data: org } = useGetMyOrgQuery();

  const activeJds = (jds ?? []).filter((j) => j.status === JdStatus.ACTIVE);
  const recent = [...(pipeline ?? [])].sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)).slice(0, 5);
  const upcoming = (interviews ?? []).filter((i) => i.status === InterviewStatus.SCHEDULED || i.status === InterviewStatus.CONFIRMED).slice(0, 3);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Dashboard" />
      <Screen>
        {isLoading || !dash ? (
          <Loader label="Loading dashboard…" />
        ) : (
          <View className="gap-5">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-2xl font-extrabold text-navy-900">Welcome back, {user?.full_name?.split(' ')[0] ?? 'Recruiter'}</Text>
                <Text className="mt-1 text-sm text-gray-500">{org?.name ?? 'Your organisation'} · {today}</Text>
              </View>
              <View className="flex-row gap-2">
                <Ionicons name="settings-outline" size={22} color={COLORS.gray500} onPress={() => router.push('/(recruiter)/settings')} />
              </View>
            </View>

            {/* Stat cards */}
            <View className="flex-row flex-wrap gap-3">
              <StatCard title="Active JDs" value={activeJds.length} change="+1 this week" trend="up" icon="document-text-outline" onPress={() => router.push('/(recruiter)/jds')} />
              <StatCard title="Total candidates" value={dash.funnel[0]?.count ?? 0} change="+12 this week" trend="up" icon="people-outline" accent={COLORS.navy500} onPress={() => router.push('/(recruiter)/pipeline')} />
              <StatCard title="Avg time to hire" value={`${dash.kpis.time_to_hire}d`} change="-2 days" trend="up" icon="time-outline" accent={COLORS.success} onPress={() => router.push('/(recruiter)/analytics')} />
              <StatCard title="Pipeline conversion" value={`${dash.kpis.pipeline_conversion}%`} change="+3%" trend="up" icon="trending-up-outline" accent={COLORS.warning} onPress={() => router.push('/(recruiter)/analytics')} />
            </View>

            {/* Quick actions */}
            <View className="flex-row flex-wrap gap-3">
              {QUICK.map((q) => (
                <Card key={q.label} onPress={() => router.push(q.route as never)} className="min-w-[150px] flex-1 items-center py-4">
                  <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${q.accent}1A` }}>
                    <Ionicons name={q.icon} size={20} color={q.accent} />
                  </View>
                  <Text className="mt-2 text-sm font-semibold text-gray-800">{q.label}</Text>
                </Card>
              ))}
            </View>

            {/* Active JDs */}
            <Card>
              <SectionHeader title="Active job descriptions" action={<Text className="text-sm font-semibold text-brand" onPress={() => router.push('/(recruiter)/jds')}>View all</Text>} />
              {activeJds.slice(0, 3).map((jd) => (
                <View key={jd.id} className="flex-row items-center justify-between border-b border-gray-100 py-2.5">
                  <View className="flex-1 pr-2">
                    <Text className="text-sm font-semibold text-gray-900">{jd.title}</Text>
                    <Text className="text-xs text-gray-400">{jd.location} · {jd.applicant_count ?? 0} applicants</Text>
                  </View>
                  <Badge label={jd.status} tone={JD_TONE[jd.status] ?? 'gray'} />
                </View>
              ))}
            </Card>

            <View className="flex-row flex-wrap gap-3">
              {/* Recent pipeline */}
              <Card className="min-w-[280px] flex-1">
                <SectionHeader title="Recent pipeline activity" action={<Text className="text-sm font-semibold text-brand" onPress={() => router.push('/(recruiter)/pipeline')}>Open</Text>} />
                {recent.map((c) => (
                  <View key={c.id} className="flex-row items-center gap-3 border-b border-gray-100 py-2.5">
                    <ScoreRing score={c.match_score ?? 0} size={34} />
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>{c.candidate?.full_name ?? 'Candidate'}</Text>
                      <Text className="text-xs text-gray-400">{relativeTime(c.updated_at)}</Text>
                    </View>
                    <StageBadge stage={c.stage} />
                  </View>
                ))}
              </Card>

              {/* Upcoming interviews */}
              <Card className="min-w-[280px] flex-1">
                <SectionHeader title="Upcoming interviews" action={<Text className="text-sm font-semibold text-brand" onPress={() => router.push('/(recruiter)/interviews')}>All</Text>} />
                {upcoming.length ? upcoming.map((it) => (
                  <View key={it.id} className="border-b border-gray-100 py-2.5">
                    <Text className="text-sm font-semibold text-gray-900">{it.candidate_name}</Text>
                    <Text className="text-xs text-gray-400">{it.jd_title} · {formatDate(it.scheduled_at, true)}</Text>
                  </View>
                )) : <Text className="py-2 text-sm text-gray-400">No upcoming interviews.</Text>}
              </Card>
            </View>
          </View>
        )}
      </Screen>
    </View>
  );
}

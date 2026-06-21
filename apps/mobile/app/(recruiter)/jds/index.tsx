import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { JdStatus } from '@jobhunter/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { TopBar } from '@/components/shared/TopBar';
import { Screen } from '@/components/ui/Screen';
import { useListJdsQuery } from '@/store/api/recruiterApi';
import { formatDate } from '@/lib/utils';

const STATUS_TONE: Record<JdStatus, 'gray' | 'brand' | 'success' | 'warning' | 'navy'> = {
  [JdStatus.DRAFT]: 'gray',
  [JdStatus.REVIEW]: 'warning',
  [JdStatus.APPROVED]: 'brand',
  [JdStatus.ACTIVE]: 'success',
  [JdStatus.ARCHIVED]: 'navy',
};

export default function JdListScreen() {
  const { data, isLoading } = useListJdsQuery();

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Job Descriptions" bellRoute="/(candidate)/notifications" />
      <Screen>
        <View className="mb-4 self-end">
          <Button label="New JD" variant="primary" size="sm" onPress={() => router.push('/(recruiter)/jds/new')} />
        </View>

        {isLoading ? (
          <Loader label="Loading job descriptions…" />
        ) : !data?.length ? (
          <EmptyState title="No job descriptions yet" subtitle="Create your first JD to start hiring." action={<Button label="New JD" size="sm" onPress={() => router.push('/(recruiter)/jds/new')} />} />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {data.map((jd) => (
              <Card key={jd.id} onPress={() => router.push(`/(recruiter)/jds/${jd.id}`)} className="min-w-[280px] flex-1">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-2">
                    <Text className="text-base font-bold text-gray-900">{jd.title}</Text>
                    <Text className="mt-0.5 text-sm text-gray-500">
                      {jd.location} · {jd.work_mode}
                    </Text>
                  </View>
                  <Badge label={jd.status} tone={STATUS_TONE[jd.status]} dot />
                </View>
                <View className="mt-3 flex-row flex-wrap items-center gap-2">
                  <Badge label={`${jd.applicant_count ?? 0} applicants`} tone="info" />
                  {jd.ai_extracted ? (
                    <Badge label={`AI extracted${jd.extraction_confidence !== undefined ? ` · ${Math.round(jd.extraction_confidence * 100)}%` : ''}`} tone="brand" />
                  ) : null}
                </View>
                <Text className="mt-3 text-xs text-gray-400">Closes {formatDate(jd.expected_close_date)}</Text>
              </Card>
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}

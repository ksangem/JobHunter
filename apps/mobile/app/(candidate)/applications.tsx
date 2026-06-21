import { Text, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { TopBar } from '@/components/shared/TopBar';
import { StageBadge } from '@/components/shared/domain';
import { ApplicationStage } from '@jobhunter/types';
import { useListApplicationsQuery, useWithdrawApplicationMutation } from '@/store/api/candidateApi';
import { formatDate } from '@/lib/utils';

export default function ApplicationsScreen() {
  const { data, isLoading } = useListApplicationsQuery();
  const [withdraw, { isLoading: withdrawing }] = useWithdrawApplicationMutation();

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="My Applications" bellRoute="/(candidate)/notifications" />
      <Screen>
        {isLoading ? (
          <Loader />
        ) : !data?.length ? (
          <EmptyState title="No applications yet" subtitle="Browse jobs and apply to get started." />
        ) : (
          <View className="gap-3">
            {data.map((app) => {
              const canWithdraw = app.stage === ApplicationStage.SUBMITTED || app.stage === ApplicationStage.VIEWED;
              return (
                <Card key={app.id}>
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <Text className="text-base font-bold text-gray-900">{app.jd_title}</Text>
                      <Text className="text-sm text-gray-500">{app.org_name}</Text>
                    </View>
                    <StageBadge stage={app.stage} />
                  </View>
                  <View className="mt-2 flex-row items-center gap-2">
                    {app.match_score !== undefined ? <Badge label={`${app.match_score}% match`} tone="brand" /> : null}
                    {app.rescored ? <Badge label="CV updated · re-scored" tone="info" /> : null}
                    <Text className="text-xs text-gray-400">Applied {formatDate(app.applied_at)}</Text>
                  </View>
                  {canWithdraw ? (
                    <View className="mt-3 self-start">
                      <Button label="Withdraw" variant="outline" size="sm" loading={withdrawing} onPress={() => withdraw(app.id)} />
                    </View>
                  ) : null}
                </Card>
              );
            })}
          </View>
        )}
      </Screen>
    </View>
  );
}

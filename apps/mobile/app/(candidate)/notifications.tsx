import { Text, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { useListNotificationsQuery, useMarkNotificationReadMutation, useMarkAllReadMutation } from '@/store/api/candidateApi';
import { relativeTime } from '@/lib/utils';

const ICON: Record<string, string> = { INTERVIEW: '📅', MATCH: '✨', APPLICATION_UPDATE: '📄', MESSAGE: '💬', SYSTEM: '⚙️', CONSENT: '🔐' };

export default function NotificationsScreen() {
  const { data, isLoading } = useListNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll, { isLoading: marking }] = useMarkAllReadMutation();

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'Notifications' }} />
      <View className="mb-3 flex-row justify-end">
        <Button label="Mark all read" size="sm" variant="ghost" loading={marking} onPress={() => markAll()} />
      </View>
      {isLoading ? (
        <Loader />
      ) : !data?.length ? (
        <EmptyState title="You're all caught up" subtitle="No notifications right now." />
      ) : (
        <View className="gap-2">
          {data.map((n) => (
            <Card
              key={n.id}
              onPress={() => { markRead(n.id); if (n.action_route) router.push(n.action_route as never); }}
              className={n.read ? '' : 'border-l-4 border-l-brand'}
            >
              <View className="flex-row gap-3">
                <Text className="text-xl">{ICON[n.type] ?? '🔔'}</Text>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-sm ${n.read ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>{n.title}</Text>
                    {!n.read ? <View className="h-2 w-2 rounded-full bg-brand" /> : null}
                  </View>
                  <Text className="mt-0.5 text-sm text-gray-500">{n.body}</Text>
                  <Text className="mt-1 text-xs text-gray-400">{relativeTime(n.created_at)}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

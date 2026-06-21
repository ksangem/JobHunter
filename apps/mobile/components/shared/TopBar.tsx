import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { COLORS } from '@/lib/constants';

/** App top bar with title, optional notification bell, and account menu. */
export function TopBar({ title, bellRoute, unread = 0 }: { title: string; bellRoute?: string; unread?: number }) {
  const { user, logout } = useAuth();
  return (
    <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <Text className="text-xl font-extrabold text-navy-900">{title}</Text>
      <View className="flex-row items-center gap-3">
        {bellRoute ? (
          <Pressable onPress={() => router.push(bellRoute as never)} className="relative h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:opacity-70">
            <Ionicons name="notifications-outline" size={20} color={COLORS.gray700} />
            {unread > 0 ? (
              <View className="absolute -right-0.5 -top-0.5 h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1">
                <Text className="text-[10px] font-bold text-white">{unread}</Text>
              </View>
            ) : null}
          </Pressable>
        ) : null}
        <Pressable onPress={logout} className="flex-row items-center gap-2 rounded-full bg-gray-100 py-1 pl-1 pr-3 active:opacity-70">
          <Avatar name={user?.full_name ?? 'User'} size="sm" />
          <Text className="text-sm font-semibold text-gray-700">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

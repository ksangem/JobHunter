import type { ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS } from '@/lib/constants';

export function Loader({ label }: { label?: string }) {
  return (
    <View className="items-center justify-center py-16">
      <ActivityIndicator size="large" color={COLORS.brand} />
      {label ? <Text className="mt-3 text-sm text-gray-500">{label}</Text> : null}
    </View>
  );
}

export function EmptyState({ title, subtitle, icon, action }: { title: string; subtitle?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <View className="items-center justify-center py-16 px-6">
      {icon ? <View className="mb-3">{icon}</View> : null}
      <Text className="text-center text-base font-semibold text-gray-700">{title}</Text>
      {subtitle ? <Text className="mt-1 text-center text-sm text-gray-400">{subtitle}</Text> : null}
      {action ? <View className="mt-4">{action}</View> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <Text className="text-center text-base font-semibold text-danger">Something went wrong</Text>
      {message ? <Text className="mt-1 text-center text-sm text-gray-400">{message}</Text> : null}
      {onRetry ? (
        <Text onPress={onRetry} className="mt-3 text-sm font-semibold text-brand">
          Try again
        </Text>
      ) : null}
    </View>
  );
}

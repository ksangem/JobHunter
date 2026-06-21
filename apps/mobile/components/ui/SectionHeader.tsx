import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <View className="mb-3 flex-row items-end justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-lg font-bold text-gray-900">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-sm text-gray-500">{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View className="mb-5 flex-row items-start justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-2xl font-extrabold text-navy-900">{title}</Text>
        {subtitle ? <Text className="mt-1 text-sm text-gray-500">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

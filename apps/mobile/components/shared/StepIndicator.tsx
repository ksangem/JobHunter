import { Text, View } from 'react-native';
import { COLORS } from '@/lib/constants';

/** Horizontal step progress used by the onboarding wizards. */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <View className="mb-6 flex-row items-center">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <View key={label} className="flex-1 flex-row items-center">
            <View className="items-center">
              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: done || active ? COLORS.brand : COLORS.gray200 }}
              >
                <Text className="text-xs font-bold" style={{ color: done || active ? '#fff' : COLORS.gray500 }}>
                  {done ? '✓' : i + 1}
                </Text>
              </View>
              <Text className="mt-1 text-[10px] font-medium" style={{ color: active ? COLORS.navy900 : COLORS.gray400, maxWidth: 70, textAlign: 'center' }} numberOfLines={1}>
                {label}
              </Text>
            </View>
            {i < steps.length - 1 ? (
              <View className="mx-1 h-0.5 flex-1" style={{ backgroundColor: done ? COLORS.brand : COLORS.gray200 }} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

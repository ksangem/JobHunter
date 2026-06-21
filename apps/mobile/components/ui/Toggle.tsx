import { Pressable, View } from 'react-native';
import { COLORS } from '@/lib/constants';

/** Animated-style switch (universal). */
export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      className="h-7 w-12 justify-center rounded-full px-0.5"
      style={{ backgroundColor: value ? COLORS.brand : COLORS.gray200 }}
    >
      <View
        className="h-6 w-6 rounded-full bg-white"
        style={{ alignSelf: value ? 'flex-end' : 'flex-start', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 2, elevation: 1 }}
      />
    </Pressable>
  );
}

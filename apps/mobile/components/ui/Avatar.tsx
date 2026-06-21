import { Text, View } from 'react-native';
import { initials } from '@/lib/utils';

const SIZES = { sm: 32, md: 40, lg: 56 } as const;

export function Avatar({ name, size = 'md' }: { name: string; size?: keyof typeof SIZES }) {
  const dim = SIZES[size];
  return (
    <View
      className="items-center justify-center rounded-full bg-navy-100"
      style={{ width: dim, height: dim }}
    >
      <Text className="font-bold text-navy-700" style={{ fontSize: dim * 0.4 }}>
        {initials(name)}
      </Text>
    </View>
  );
}

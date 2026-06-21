import { Text, View } from 'react-native';

type Tone = 'gray' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'navy';

const TONE: Record<Tone, string> = {
  gray: 'bg-gray-100 text-gray-700',
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-success-100 text-success',
  warning: 'bg-warning-100 text-warning',
  danger: 'bg-danger-100 text-danger',
  info: 'bg-info-100 text-info',
  navy: 'bg-navy-100 text-navy-700',
};

export function Badge({ label, tone = 'gray', dot = false }: { label: string; tone?: Tone; dot?: boolean }) {
  const [bg, text] = TONE[tone].split(' ');
  return (
    <View className={`flex-row items-center self-start rounded-full px-2.5 py-1 ${bg}`}>
      {dot && <View className={`mr-1.5 h-1.5 w-1.5 rounded-full ${text.replace('text-', 'bg-')}`} />}
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </View>
  );
}

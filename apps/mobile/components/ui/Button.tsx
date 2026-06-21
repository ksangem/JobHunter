import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: 'bg-brand active:bg-brand-600', text: 'text-white' },
  secondary: { bg: 'bg-navy-900 active:bg-navy-700', text: 'text-white' },
  outline: { bg: 'bg-white border border-gray-300 active:bg-gray-50', text: 'text-gray-900' },
  ghost: { bg: 'bg-transparent active:bg-gray-100', text: 'text-brand' },
  danger: { bg: 'bg-danger active:opacity-90', text: 'text-white' },
  success: { bg: 'bg-success active:opacity-90', text: 'text-white' },
};

const SIZE: Record<Size, { pad: string; text: string }> = {
  sm: { pad: 'px-3 py-2', text: 'text-sm' },
  md: { pad: 'px-4 py-3', text: 'text-base' },
  lg: { pad: 'px-5 py-4', text: 'text-lg' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const v = VARIANT[variant];
  const s = SIZE[size];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      className={`flex-row items-center justify-center rounded-xl ${s.pad} ${v.bg} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#2563EB' : '#fff'} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className={`font-semibold ${s.text} ${v.text}`}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

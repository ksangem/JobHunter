import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/lib/constants';
import { scoreColor } from '@/lib/utils';

interface ScoreRingProps {
  score: number; // 0–100
  size?: number;
  label?: string;
  max?: number;
}

const TONE = { success: COLORS.success, warning: COLORS.warning, danger: COLORS.danger };

/** Circular score gauge (ATS / match score). Universal via react-native-svg. */
export function ScoreRing({ score, size = 96, label, max = 100 }: ScoreRingProps) {
  const stroke = size * 0.1;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / max));
  const color = TONE[scoreColor(score)];
  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={COLORS.gray200} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View className="absolute items-center">
        <Text className="font-extrabold text-gray-900" style={{ fontSize: size * 0.26, color }}>
          {Math.round(score)}
        </Text>
        {label ? <Text className="text-[10px] font-medium text-gray-400">{label}</Text> : null}
      </View>
    </View>
  );
}

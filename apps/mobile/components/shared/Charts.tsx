// ============================================================================
// Lightweight universal charts (react-native-svg → SVG on web, native on
// mobile). NOTE: the BRD/Tech stack prescribes Victory Native 41 for production
// (Skia on native, SVG on web); these dependency-light primitives keep the demo
// runnable without the Skia/CanvasKit web setup and share the same data shapes.
// ============================================================================
import { useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polyline, Rect } from 'react-native-svg';
import type { FunnelStage, TrendPoint } from '@jobhunter/types';
import { COLORS } from '@/lib/constants';

const W = 300;
const H = 160;
const PAD = 28;

export function LineChart({ data, color = COLORS.brand }: { data: TrendPoint[]; color?: string }) {
  if (!data.length) return null;
  const values = data.map((d) => d.value);
  const max = Math.max(...values) * 1.1;
  const min = Math.min(...values, 0);
  const stepX = (W - PAD * 2) / Math.max(1, data.length - 1);
  const scaleY = (v: number) => H - PAD - ((v - min) / (max - min || 1)) * (H - PAD * 2);
  const points = data.map((d, i) => `${PAD + i * stepX},${scaleY(d.value)}`).join(' ');
  return (
    <View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <Line key={g} x1={PAD} y1={PAD + (H - PAD * 2) * g} x2={W - PAD} y2={PAD + (H - PAD * 2) * g} stroke={COLORS.gray100} strokeWidth={1} />
        ))}
        <Polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
        {data.map((d, i) => (
          <Circle key={i} cx={PAD + i * stepX} cy={scaleY(d.value)} r={3.5} fill={color} />
        ))}
      </Svg>
      <View className="flex-row justify-between px-6">
        {data.map((d) => (
          <Text key={d.label} className="text-[10px] text-gray-400">
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function BarChart({ data, color = COLORS.navy500 }: { data: TrendPoint[]; color?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value)) * 1.1 || 1;
  const bw = (W - PAD * 2) / data.length;
  return (
    <View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {data.map((d, i) => {
          const h = ((d.value / max) * (H - PAD * 2));
          return <Rect key={i} x={PAD + i * bw + bw * 0.18} y={H - PAD - h} width={bw * 0.64} height={h} rx={4} fill={color} />;
        })}
      </Svg>
      <View className="flex-row justify-between px-6">
        {data.map((d) => (
          <Text key={d.label} className="text-[10px] text-gray-400">
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

/** Horizontal funnel — used by candidate + recruiter dashboards. */
export function Funnel({ data }: { data: FunnelStage[] }) {
  const max = Math.max(...data.map((d) => d.count)) || 1;
  const palette = [COLORS.brand, COLORS.navy500, COLORS.info, COLORS.warning, COLORS.success, '#7C3AED'];
  return (
    <View className="gap-2">
      {data.map((s, i) => {
        const pct = (s.count / max) * 100;
        return (
          <View key={s.stage} className="flex-row items-center">
            <Text className="w-24 text-xs text-gray-500">{s.stage}</Text>
            <View className="h-7 flex-1 overflow-hidden rounded-md bg-gray-100">
              <View className="h-7 items-end justify-center rounded-md pr-2" style={{ width: `${Math.max(pct, 12)}%`, backgroundColor: palette[i % palette.length] }}>
                <Text className="text-xs font-bold text-white">{s.count}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function Donut({ segments, size = 120 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const stroke = size * 0.14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <Svg width={size} height={size}>
      <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
        {segments.map((seg, i) => {
          const len = (seg.value / total) * c;
          const el = (
            <Circle key={i} cx={size / 2} cy={size / 2} r={r} stroke={seg.color} strokeWidth={stroke} fill="none" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />
          );
          offset += len;
          return el;
        })}
      </G>
    </Svg>
  );
}

/** Talent heatmap grid (market intel). */
export function Heatmap({ rows, cols, cell }: { rows: string[]; cols: string[]; cell: (r: string, c: string) => number }) {
  const [hover] = useState<string | null>(null);
  const shade = (v: number) => {
    const alpha = 0.15 + (v / 100) * 0.85;
    return `rgba(37, 99, 235, ${alpha.toFixed(2)})`;
  };
  return (
    <View>
      <View className="flex-row">
        <View className="w-24" />
        {cols.map((c) => (
          <Text key={c} className="flex-1 text-center text-[10px] text-gray-500">
            {c}
          </Text>
        ))}
      </View>
      {rows.map((r) => (
        <View key={r} className="mt-1 flex-row items-center">
          <Text className="w-24 text-xs text-gray-600" numberOfLines={1}>
            {r}
          </Text>
          {cols.map((c) => {
            const v = cell(r, c);
            return (
              <View key={c} className="mx-0.5 flex-1 items-center justify-center rounded" style={{ height: 30, backgroundColor: shade(v) }}>
                <Text className="text-[10px] font-semibold text-white">{v}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

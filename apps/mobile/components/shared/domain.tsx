// Small domain widgets shared across modules.
import { Text, View } from 'react-native';
import { ApplicationStage, RiskLevel, type PreCallGate, type Skill } from '@jobhunter/types';
import { Badge } from '@/components/ui/Badge';
import { STAGE_COLOR, STAGE_LABEL } from '@/lib/constants';

export function StageBadge({ stage }: { stage: ApplicationStage }) {
  const tone =
    stage === ApplicationStage.HIRED || stage === ApplicationStage.OFFER
      ? 'success'
      : stage === ApplicationStage.REJECTED || stage === ApplicationStage.NO_SHOW
        ? 'danger'
        : stage === ApplicationStage.INTERVIEW
          ? 'navy'
          : stage === ApplicationStage.SHORTLISTED
            ? 'brand'
            : stage === ApplicationStage.SCREENING
              ? 'warning'
              : 'gray';
  return <Badge label={STAGE_LABEL[stage]} tone={tone as never} dot />;
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const tone = level === RiskLevel.LOW ? 'success' : level === RiskLevel.MEDIUM ? 'warning' : 'danger';
  return <Badge label={`${level} risk`} tone={tone as never} />;
}

export function SkillChips({ skills, max = 6 }: { skills: (Skill | string)[]; max?: number }) {
  const items = skills.slice(0, max);
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {items.map((s, i) => {
        const name = typeof s === 'string' ? s : s.name;
        const lowConf = typeof s !== 'string' && s.confidence !== undefined && s.confidence < 0.7;
        return (
          <View key={i} className={`rounded-lg px-2.5 py-1 ${lowConf ? 'bg-warning-50' : 'bg-gray-100'}`}>
            <Text className={`text-xs font-medium ${lowConf ? 'text-warning' : 'text-gray-700'}`}>
              {name}
              {lowConf ? ' ⚠' : ''}
            </Text>
          </View>
        );
      })}
      {skills.length > max ? (
        <View className="rounded-lg bg-gray-100 px-2.5 py-1">
          <Text className="text-xs font-medium text-gray-500">+{skills.length - max}</Text>
        </View>
      ) : null}
    </View>
  );
}

const GATE_LABELS: Record<keyof PreCallGate, string> = {
  voice_consent: 'VOICE_AI consent on record',
  not_on_dnc: 'Not on TRAI DNC registry',
  time_window: 'Within local 09:00–20:00 window',
  platform_throttle: 'Platform throttle (<2 calls / 7d)',
  org_throttle: 'Org throttle (<1 call / 7d)',
};

/** 5-gate pre-call compliance checklist (FR-R-042 / §11.3). */
export function GateChecklist({ gate }: { gate: PreCallGate }) {
  return (
    <View className="gap-2">
      {(Object.keys(GATE_LABELS) as (keyof PreCallGate)[]).map((k) => (
        <View key={k} className="flex-row items-center">
          <View className={`mr-2 h-5 w-5 items-center justify-center rounded-full ${gate[k] ? 'bg-success-100' : 'bg-danger-100'}`}>
            <Text className={`text-xs font-bold ${gate[k] ? 'text-success' : 'text-danger'}`}>{gate[k] ? '✓' : '✕'}</Text>
          </View>
          <Text className={`text-sm ${gate[k] ? 'text-gray-700' : 'text-danger'}`}>{GATE_LABELS[k]}</Text>
        </View>
      ))}
    </View>
  );
}

export function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-2.5">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900">{value}</Text>
    </View>
  );
}

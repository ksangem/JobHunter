// ConsentGate — blocks an action until consent counts are satisfied. Used by
// the voice campaign launch flow (BRD §10.3: DRAFT → [consenting>0] → LAUNCH).
import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ConsentGateProps {
  total: number;
  consenting: number;
  children?: React.ReactNode;
}

export function ConsentGate({ total, consenting, children }: ConsentGateProps) {
  const ok = consenting > 0;
  const pct = total ? Math.round((consenting / total) * 100) : 0;
  return (
    <Card className={ok ? 'border-success-100 bg-success-50' : 'border-danger-100 bg-danger-50'}>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-bold text-gray-900">Consent gate</Text>
        <Badge label={ok ? 'PASS' : 'BLOCKED'} tone={ok ? 'success' : 'danger'} />
      </View>
      <Text className="mt-2 text-sm text-gray-600">
        {consenting} of {total} candidates have VOICE_AI consent ({pct}%). Externally-sourced
        candidates must opt in via email/SMS before any call (FR-R-040).
      </Text>
      {children ? <View className="mt-3">{children}</View> : null}
    </Card>
  );
}

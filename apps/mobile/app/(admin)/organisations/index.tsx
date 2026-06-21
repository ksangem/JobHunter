import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OrgStatus, type Organisation } from '@jobhunter/types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { TopBar } from '@/components/shared/TopBar';
import { useListOrgsQuery, useUpdateOrgMutation } from '@/store/api/adminApi';
import { COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

type Tone = 'gray' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'navy';

const STATUS_TONE: Record<OrgStatus, Tone> = {
  [OrgStatus.ACTIVE]: 'success',
  [OrgStatus.DPA_PENDING]: 'warning',
  [OrgStatus.PROVISIONED]: 'info',
  [OrgStatus.SUSPENDED]: 'danger',
  [OrgStatus.REGISTERED]: 'gray',
  [OrgStatus.DPA_SIGNED]: 'gray',
};

// Onboarding lifecycle (BRD §10.2): REGISTERED → DPA_PENDING → DPA_SIGNED → PROVISIONED → ACTIVE.
const ONBOARDING: OrgStatus[] = [
  OrgStatus.REGISTERED,
  OrgStatus.DPA_PENDING,
  OrgStatus.DPA_SIGNED,
  OrgStatus.PROVISIONED,
  OrgStatus.ACTIVE,
];
const STEP_LABEL: Record<string, string> = {
  REGISTERED: 'Registered',
  DPA_PENDING: 'DPA pending',
  DPA_SIGNED: 'DPA signed',
  PROVISIONED: 'Provisioned',
  ACTIVE: 'Active',
};

function OnboardingChecklist({ status }: { status: OrgStatus }) {
  // SUSPENDED is off the happy path — treat as fully onboarded for the timeline.
  const currentIdx =
    status === OrgStatus.SUSPENDED ? ONBOARDING.length - 1 : ONBOARDING.indexOf(status);
  return (
    <View className="mt-3 gap-2">
      <Text className="text-xs font-semibold text-gray-500">Onboarding checklist</Text>
      <View className="flex-row flex-wrap items-center gap-1.5">
        {ONBOARDING.map((step, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          return (
            <View key={step} className="flex-row items-center">
              <View
                className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${
                  current ? 'bg-brand' : done ? 'bg-success-100' : 'bg-gray-100'
                }`}
              >
                {done ? (
                  <Ionicons name="checkmark" size={12} color={COLORS.success} />
                ) : null}
                <Text
                  className={`text-[11px] font-semibold ${
                    current ? 'text-white' : done ? 'text-success' : 'text-gray-400'
                  }`}
                >
                  {STEP_LABEL[step]}
                </Text>
              </View>
              {i < ONBOARDING.length - 1 ? (
                <Text className="px-0.5 text-[11px] text-gray-300">›</Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function OrgCard({ org }: { org: Organisation }) {
  const [updateOrg, { isLoading }] = useUpdateOrgMutation();
  const dpaSigned = !!org.dpa_signed_at;
  const seatPct = org.seats_total > 0 ? (org.seats_filled / org.seats_total) * 100 : 0;
  const suspended = org.status === OrgStatus.SUSPENDED;
  const publishBlocked =
    !dpaSigned &&
    (org.status === OrgStatus.REGISTERED || org.status === OrgStatus.DPA_PENDING);

  const toggleStatus = () =>
    updateOrg({
      id: org.id,
      patch: { status: suspended ? OrgStatus.ACTIVE : OrgStatus.SUSPENDED },
    });

  const changeSeats = (delta: number) => {
    const next = Math.max(org.seats_filled, org.seats_total + delta);
    if (next === org.seats_total) return;
    updateOrg({ id: org.id, patch: { seats_total: next } });
  };

  return (
    <Card className="min-w-[300px] flex-1">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-base font-bold text-gray-900">{org.name}</Text>
          <Text className="mt-0.5 text-xs text-gray-400">
            {org.tier} · {org.region}
          </Text>
        </View>
        <Badge label={org.status} tone={STATUS_TONE[org.status]} dot />
      </View>

      {/* Seat usage */}
      <View className="mt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">Seats</Text>
          <Text className="text-sm font-semibold text-gray-900">
            {org.seats_filled} / {org.seats_total}
          </Text>
        </View>
        <View className="mt-1.5">
          <ProgressBar value={seatPct} tone={seatPct >= 90 ? 'warning' : 'brand'} />
        </View>
      </View>

      {/* DPA status */}
      <View className="mt-3">
        <Badge
          label={dpaSigned ? `DPA signed ${formatDate(org.dpa_signed_at!)}` : 'DPA pending'}
          tone={dpaSigned ? 'success' : 'danger'}
        />
      </View>

      {publishBlocked ? (
        <View className="mt-2 flex-row items-center gap-1.5 rounded-lg bg-warning-50 px-2.5 py-2">
          <Ionicons name="lock-closed-outline" size={14} color={COLORS.warning} />
          <Text className="flex-1 text-xs text-warning">
            JD publish blocked until DPA is signed.
          </Text>
        </View>
      ) : null}

      <OnboardingChecklist status={org.status} />

      {/* Seats stepper */}
      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-sm text-gray-500">Adjust seats</Text>
        <View className="flex-row items-center gap-2">
          <Button label="−" variant="outline" size="sm" disabled={isLoading} onPress={() => changeSeats(-1)} />
          <Text className="w-10 text-center text-sm font-bold text-gray-900">{org.seats_total}</Text>
          <Button label="+" variant="outline" size="sm" disabled={isLoading} onPress={() => changeSeats(1)} />
        </View>
      </View>

      {/* Suspend / Activate */}
      <View className="mt-3">
        <Button
          label={suspended ? 'Activate' : 'Suspend'}
          variant={suspended ? 'success' : 'danger'}
          size="sm"
          loading={isLoading}
          fullWidth
          onPress={toggleStatus}
        />
      </View>
    </Card>
  );
}

export default function OrganisationsScreen() {
  const { data, isLoading } = useListOrgsQuery();

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Organisations" />
      <Screen>
        {isLoading ? (
          <Loader label="Loading organisations…" />
        ) : !data?.length ? (
          <EmptyState title="No organisations" subtitle="Onboard your first client org to get started." />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {data.map((org) => (
              <OrgCard key={org.id} org={org} />
            ))}
          </View>
        )}
      </Screen>
    </View>
  );
}

import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Role, UserStatus, type User } from '@jobhunter/types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Loader, EmptyState } from '@/components/ui/Feedback';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TopBar } from '@/components/shared/TopBar';
import { SideSheet } from '@/components/shared/SideSheet';
import { StatRow } from '@/components/shared/domain';
import { useListUsersQuery, useUpdateUserMutation } from '@/store/api/adminApi';
import { COLORS } from '@/lib/constants';
import { maskEmail } from '@/lib/utils';

type Tone = 'gray' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'navy';

const ROLE_TONE: Record<Role, Tone> = {
  [Role.CANDIDATE]: 'gray',
  [Role.RECRUITER]: 'brand',
  [Role.HIRING_MANAGER]: 'info',
  [Role.ORG_ADMIN]: 'navy',
  [Role.VIEWER]: 'gray',
  [Role.SUPER_ADMIN]: 'danger',
};
const STATUS_TONE: Record<UserStatus, Tone> = {
  [UserStatus.ACTIVE]: 'success',
  [UserStatus.SUSPENDED]: 'danger',
  [UserStatus.INVITED]: 'info',
  [UserStatus.PENDING]: 'warning',
};

const ALL_ROLES = Object.values(Role);

// ---- RBAC permission matrix (BRD §14.3) ---------------------------------
type Perm = 'yes' | 'no' | 'own' | 'read';
const MATRIX_COLS: Role[] = [
  Role.CANDIDATE,
  Role.RECRUITER,
  Role.HIRING_MANAGER,
  Role.ORG_ADMIN,
  Role.VIEWER,
  Role.SUPER_ADMIN,
];
const COL_LABEL: Record<Role, string> = {
  [Role.CANDIDATE]: 'Candidate',
  [Role.RECRUITER]: 'Recruiter',
  [Role.HIRING_MANAGER]: 'Hiring Mgr',
  [Role.ORG_ADMIN]: 'Org Admin',
  [Role.VIEWER]: 'Viewer',
  [Role.SUPER_ADMIN]: 'Super Admin',
};
const MATRIX: { action: string; perms: Record<Role, Perm> }[] = [
  {
    action: 'Manage own profile/CV',
    perms: { CANDIDATE: 'yes', RECRUITER: 'own', HIRING_MANAGER: 'own', ORG_ADMIN: 'own', VIEWER: 'own', SUPER_ADMIN: 'yes' },
  },
  {
    action: 'Create/edit JD',
    perms: { CANDIDATE: 'no', RECRUITER: 'yes', HIRING_MANAGER: 'yes', ORG_ADMIN: 'yes', VIEWER: 'no', SUPER_ADMIN: 'yes' },
  },
  {
    action: 'Approve JD / offer',
    perms: { CANDIDATE: 'no', RECRUITER: 'no', HIRING_MANAGER: 'yes', ORG_ADMIN: 'yes', VIEWER: 'no', SUPER_ADMIN: 'yes' },
  },
  {
    action: 'Launch outreach campaign',
    perms: { CANDIDATE: 'no', RECRUITER: 'yes', HIRING_MANAGER: 'no', ORG_ADMIN: 'yes', VIEWER: 'no', SUPER_ADMIN: 'yes' },
  },
  {
    action: 'View pipeline/analytics',
    perms: { CANDIDATE: 'no', RECRUITER: 'yes', HIRING_MANAGER: 'yes', ORG_ADMIN: 'yes', VIEWER: 'read', SUPER_ADMIN: 'yes' },
  },
  {
    action: 'Manage org users/seats',
    perms: { CANDIDATE: 'no', RECRUITER: 'no', HIRING_MANAGER: 'no', ORG_ADMIN: 'yes', VIEWER: 'no', SUPER_ADMIN: 'yes' },
  },
  {
    action: 'Cross-org admin / AI monitoring / GDPR',
    perms: { CANDIDATE: 'no', RECRUITER: 'no', HIRING_MANAGER: 'no', ORG_ADMIN: 'no', VIEWER: 'no', SUPER_ADMIN: 'yes' },
  },
];

function PermCell({ perm }: { perm: Perm }) {
  if (perm === 'yes') return <Text className="text-center text-sm font-bold text-success">✓</Text>;
  if (perm === 'own') return <Text className="text-center text-[10px] font-semibold text-info">own</Text>;
  if (perm === 'read') return <Text className="text-center text-[10px] font-semibold text-warning">read</Text>;
  return <Text className="text-center text-sm text-gray-300">—</Text>;
}

const ROW_W = 220;
const COL_W = 88;

function RbacMatrix() {
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <Pressable onPress={() => setOpen((o) => !o)} className="flex-row items-center justify-between active:opacity-70">
        <SectionHeader title="RBAC permission matrix" subtitle="BRD §14.3 — all role changes are audited" />
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.gray500} />
      </Pressable>
      {open ? (
        <ScrollView horizontal showsHorizontalScrollIndicator className="mt-1">
          <View>
            {/* Header row */}
            <View className="flex-row border-b border-gray-200 pb-2">
              <Text style={{ width: ROW_W }} className="text-xs font-bold text-gray-500">
                Action
              </Text>
              {MATRIX_COLS.map((c) => (
                <Text key={c} style={{ width: COL_W }} className="text-center text-[11px] font-bold text-gray-700">
                  {COL_LABEL[c]}
                </Text>
              ))}
            </View>
            {MATRIX.map((row) => (
              <View key={row.action} className="flex-row items-center border-b border-gray-100 py-2.5">
                <Text style={{ width: ROW_W }} className="pr-2 text-xs text-gray-700">
                  {row.action}
                </Text>
                {MATRIX_COLS.map((c) => (
                  <View key={c} style={{ width: COL_W }}>
                    <PermCell perm={row.perms[c]} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : null}
    </Card>
  );
}

function EditUserSheet({ user, onClose }: { user: User; onClose: () => void }) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [role, setRole] = useState<Role>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const dirty = role !== user.role || status !== user.status;

  const save = async () => {
    await updateUser({ id: user.id, patch: { role, status } }).unwrap();
    onClose();
  };

  return (
    <SideSheet visible onClose={onClose} title="Edit user">
      <View className="flex-row items-center gap-3">
        <Avatar name={user.full_name} size="lg" />
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">{user.full_name}</Text>
          <Text className="text-sm text-gray-500">{maskEmail(user.email)}</Text>
        </View>
      </View>

      <View className="mt-4">
        <StatRow label="Org" value={user.org_id ?? '—'} />
        <StatRow label="MFA" value={user.mfa_enabled ? 'Enabled' : 'Disabled'} />
      </View>

      <Text className="mb-2 mt-5 text-sm font-semibold text-gray-700">Role</Text>
      <View className="flex-row flex-wrap gap-2">
        {ALL_ROLES.map((r) => {
          const active = r === role;
          return (
            <Pressable
              key={r}
              onPress={() => setRole(r)}
              className={`rounded-full border px-3 py-1.5 active:opacity-70 ${
                active ? 'border-brand bg-brand' : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{r}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="mb-2 mt-5 text-sm font-semibold text-gray-700">Status</Text>
      <View className="flex-row gap-2">
        {[UserStatus.ACTIVE, UserStatus.SUSPENDED].map((s) => {
          const active = s === status;
          return (
            <Pressable
              key={s}
              onPress={() => setStatus(s)}
              className={`rounded-full border px-4 py-1.5 active:opacity-70 ${
                active ? 'border-brand bg-brand' : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{s}</Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-3 flex-row items-center gap-1.5 rounded-lg bg-info-100 px-2.5 py-2">
        <Ionicons name="information-circle-outline" size={14} color={COLORS.info} />
        <Text className="flex-1 text-xs text-info">All role &amp; status changes are recorded in the audit log.</Text>
      </View>

      <View className="mt-5">
        <Button label="Save changes" loading={isLoading} disabled={!dirty} fullWidth onPress={save} />
      </View>
    </SideSheet>
  );
}

export default function UsersScreen() {
  const { data, isLoading } = useListUsersQuery();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<User | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (u) => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar title="Users" />
      <Screen>
        {isLoading ? (
          <Loader label="Loading users…" />
        ) : (
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <View className="flex-1">
                <Input placeholder="Search by name or email" value={query} onChangeText={setQuery} autoCapitalize="none" />
              </View>
              <View>
                <Button
                  label="Bulk CSV invite"
                  variant="outline"
                  size="sm"
                  onPress={() =>
                    Alert.alert('Bulk CSV invite', 'Upload a CSV of emails + roles to invite users in bulk (not wired in demo).')
                  }
                />
              </View>
            </View>

            <RbacMatrix />

            {!filtered.length ? (
              <EmptyState title="No users found" subtitle="Try a different search term." />
            ) : (
              filtered.map((u) => (
                <Card key={u.id} onPress={() => setSelected(u)}>
                  <View className="flex-row items-center gap-3">
                    <Avatar name={u.full_name} />
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900">{u.full_name}</Text>
                      <Text className="text-sm text-gray-500">{maskEmail(u.email)}</Text>
                      <Text className="mt-0.5 text-xs text-gray-400">{u.org_id ?? 'No org'}</Text>
                    </View>
                    <View className="items-end gap-1.5">
                      <Badge label={u.role} tone={ROLE_TONE[u.role]} />
                      <Badge label={u.status} tone={STATUS_TONE[u.status]} dot />
                    </View>
                  </View>
                  <View className="mt-2 flex-row items-center gap-1.5">
                    <Ionicons
                      name={u.mfa_enabled ? 'shield-checkmark' : 'shield-outline'}
                      size={14}
                      color={u.mfa_enabled ? COLORS.success : COLORS.gray400}
                    />
                    <Text className={`text-xs ${u.mfa_enabled ? 'text-success' : 'text-gray-400'}`}>
                      {u.mfa_enabled ? 'MFA enabled' : 'MFA off'}
                    </Text>
                  </View>
                </Card>
              ))
            )}
          </View>
        )}
      </Screen>

      {selected ? <EditUserSheet user={selected} onClose={() => setSelected(null)} /> : null}
    </View>
  );
}

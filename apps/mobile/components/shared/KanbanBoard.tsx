// ============================================================================
// KanbanBoard — recruiter pipeline. Universal: horizontal scroll of stage
// columns, each a vertical list of candidate cards with stage move controls
// (same PATCH /pipeline/{id}/stage on every platform).
//
// NOTE: the stack prescribes react-native-draggable-flatlist for gesture-based
// DnD on native (and pointer DnD on web). To keep the web demo build robust and
// dependency-light, this implementation uses explicit ◀ ▶ move controls that
// call the identical mutation; swap in DraggableFlatList per column to add drag.
// ============================================================================
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ApplicationStage, type Application } from '@jobhunter/types';
import { PIPELINE_COLUMNS, STAGE_COLOR, STAGE_LABEL } from '@/lib/constants';
import { Avatar } from '@/components/ui/Avatar';
import { ScoreRing } from './ScoreRing';
import { maskEmail } from '@/lib/utils';

type Card = Application & { candidate?: any; consented?: boolean };

interface KanbanProps {
  cards: Card[];
  onMove: (candidateId: string, to: ApplicationStage) => void;
  onOpen: (card: Card) => void;
}

export function KanbanBoard({ cards, onMove, onOpen }: KanbanProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
      <View className="flex-row gap-3 pb-4">
        {PIPELINE_COLUMNS.map((stage) => {
          const items = cards.filter((c) => c.stage === stage);
          return (
            <View key={stage} className="w-64 rounded-2xl bg-gray-100 p-2">
              <View className="mb-2 flex-row items-center justify-between px-1.5 pt-1">
                <View className="flex-row items-center gap-2">
                  <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STAGE_COLOR[stage] }} />
                  <Text className="text-sm font-bold text-gray-700">{STAGE_LABEL[stage]}</Text>
                </View>
                <View className="rounded-full bg-white px-2 py-0.5">
                  <Text className="text-xs font-bold text-gray-500">{items.length}</Text>
                </View>
              </View>
              <View className="gap-2">
                {items.map((card) => (
                  <KanbanCard key={card.id} card={card} stage={stage} onMove={onMove} onOpen={onOpen} />
                ))}
                {items.length === 0 ? (
                  <View className="items-center justify-center rounded-xl border border-dashed border-gray-300 py-6">
                    <Text className="text-xs text-gray-400">Empty</Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function KanbanCard({ card, stage, onMove, onOpen }: { card: Card; stage: ApplicationStage; onMove: KanbanProps['onMove']; onOpen: KanbanProps['onOpen'] }) {
  const idx = PIPELINE_COLUMNS.indexOf(stage);
  const prev = PIPELINE_COLUMNS[idx - 1];
  const next = PIPELINE_COLUMNS[idx + 1];
  const name = card.candidate?.full_name ?? 'Candidate';
  const external = card.candidate?.source && card.candidate.source !== 'PLATFORM';
  return (
    <Pressable onPress={() => onOpen(card)} className="rounded-xl bg-white p-3 active:opacity-80" style={{ shadowColor: '#0A1F44', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          <Avatar name={name} size="sm" />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
              {name}
            </Text>
            <Text className="text-[11px] text-gray-400" numberOfLines={1}>
              {card.candidate?.headline ?? maskEmail(null)}
            </Text>
          </View>
        </View>
        <ScoreRing score={card.match_score ?? 0} size={36} />
      </View>
      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row gap-1">
          {external ? <Text className="rounded bg-warning-50 px-1.5 py-0.5 text-[10px] font-semibold text-warning">EXTERNAL</Text> : null}
          {card.consented === false ? <Text className="rounded bg-danger-50 px-1.5 py-0.5 text-[10px] font-semibold text-danger">NO CONSENT</Text> : null}
          {card.rescored ? <Text className="rounded bg-info-50 px-1.5 py-0.5 text-[10px] font-semibold text-info">CV UPDATED</Text> : null}
        </View>
        <View className="flex-row gap-1">
          <MoveBtn label="◀" disabled={!prev} onPress={() => prev && onMove(card.candidate_id, prev)} />
          <MoveBtn label="▶" disabled={!next} onPress={() => next && onMove(card.candidate_id, next)} />
        </View>
      </View>
    </Pressable>
  );
}

function MoveBtn({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} className={`h-7 w-7 items-center justify-center rounded-lg ${disabled ? 'bg-gray-100' : 'bg-brand-50 active:bg-brand-100'}`}>
      <Text className={`text-xs font-bold ${disabled ? 'text-gray-300' : 'text-brand'}`}>{label}</Text>
    </Pressable>
  );
}

import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { COLORS } from '@/lib/constants';

interface TagSelectProps {
  label?: string;
  selected: string[];
  options: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** Allow free-text entries not in `options` (e.g. certifications). */
  allowCustom?: boolean;
  max?: number;
}

/** Chip multi-select with a filterable suggestion list. Universal (web+native). */
export function TagSelect({ label, selected, options, onChange, placeholder = 'Type to search…', allowCustom = false, max = 8 }: TagSelectProps) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const suggestions = options
    .filter((o) => !selected.includes(o) && (!q || o.toLowerCase().includes(q)))
    .slice(0, max);

  const add = (val: string) => {
    const v = val.trim();
    if (!v || selected.includes(v)) return;
    onChange([...selected, v]);
    setQuery('');
  };
  const remove = (val: string) => onChange(selected.filter((s) => s !== val));

  return (
    <View className="w-full">
      {label ? <Text className="mb-1.5 text-sm font-medium text-gray-700">{label}</Text> : null}
      {selected.length ? (
        <View className="mb-2 flex-row flex-wrap gap-1.5">
          {selected.map((s) => (
            <Pressable key={s} onPress={() => remove(s)} className="flex-row items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 active:opacity-70">
              <Text className="text-xs font-semibold text-brand-700">{s}</Text>
              <Text className="text-xs font-bold text-brand-700">×</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray400}
        onSubmitEditing={() => allowCustom && add(query)}
        className="rounded-xl border border-gray-300 bg-white px-3.5 py-3 text-base text-gray-900"
      />
      {q || (!allowCustom && suggestions.length) ? (
        <View className="mt-1.5 flex-row flex-wrap gap-1.5">
          {suggestions.map((o) => (
            <Pressable key={o} onPress={() => add(o)} className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 active:bg-gray-100">
              <Text className="text-xs font-medium text-gray-700">+ {o}</Text>
            </Pressable>
          ))}
          {allowCustom && q && !options.some((o) => o.toLowerCase() === q) ? (
            <Pressable onPress={() => add(query)} className="rounded-lg bg-success-100 px-2.5 py-1 active:opacity-70">
              <Text className="text-xs font-semibold text-success">+ Add “{query}”</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

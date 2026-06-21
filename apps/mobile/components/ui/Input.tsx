import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View className="w-full">
      {label ? <Text className="mb-1.5 text-sm font-medium text-gray-700">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#9CA3AF"
        className={`rounded-xl border bg-white px-3.5 py-3 text-base text-gray-900 ${
          error ? 'border-danger' : focused ? 'border-brand' : 'border-gray-300'
        }`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error ? (
        <Text className="mt-1 text-xs text-danger">{error}</Text>
      ) : hint ? (
        <Text className="mt-1 text-xs text-gray-400">{hint}</Text>
      ) : null}
    </View>
  );
}

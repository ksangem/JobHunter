import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}

/** Surface primitive — white rounded card with subtle elevation. */
export function Card({ children, className = '', onPress }: CardProps) {
  const base = 'bg-white rounded-2xl p-4 border border-gray-100';
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${base} active:opacity-80 ${className}`}
        style={{ shadowColor: '#0A1F44', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View
      className={`${base} ${className}`}
      style={{ shadowColor: '#0A1F44', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}
    >
      {children}
    </View>
  );
}

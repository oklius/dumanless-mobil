import { ReactNode } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type OptionCardProps = {
  children: ReactNode;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

export default function OptionCard({ children, selected = false, onPress, style }: OptionCardProps) {
  return (
    <Pressable style={[styles.base, selected && styles.selected, style]} onPress={onPress}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: colors.optionBorder,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.panel,
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(15, 76, 58, 0.05)',
    shadowColor: colors.accentShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});

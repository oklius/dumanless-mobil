import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type OptionCardProps = {
  title: string;
  description?: string;
  leading?: ReactNode;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  multi?: boolean;
};

export default function OptionCard({
  title,
  description,
  leading,
  selected = false,
  onPress,
  style,
  multi = false,
}: OptionCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.row}>
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <View style={styles.textWrap}>
          <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
        <View
          style={[
            styles.indicator,
            multi ? styles.indicatorSquare : styles.indicatorCircle,
            selected && styles.indicatorSelected,
          ]}
        >
          {selected ? multi ? <Text style={styles.check}>✓</Text> : <View style={styles.dot} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: colors.optionBorder,
    borderRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.optionBackground,
  },
  unselected: {
    shadowOpacity: 0,
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(15, 76, 58, 0.05)',
    shadowColor: colors.accentShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  pressed: {
    backgroundColor: colors.optionHover,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  leading: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: typography.option,
    fontWeight: '700',
    color: colors.text,
  },
  titleSelected: {
    color: colors.text,
  },
  description: {
    fontSize: typography.subtitle,
    color: colors.muted,
  },
  indicator: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#d7d9cf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorCircle: {
    borderRadius: 12,
  },
  indicatorSquare: {
    borderRadius: 6,
  },
  indicatorSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  check: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: typography.label,
  },
});

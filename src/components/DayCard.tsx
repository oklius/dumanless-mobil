import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import days from '../lib/days';

type DayItem = (typeof days)[number];

type Props = {
  item: DayItem;
  currentDay: number;
  completedDays: number[];
  onOpenDay: (dayNumber: number) => void;
};

export default function DayCard({ item, currentDay, completedDays, onOpenDay }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const { isCurrent, isCompleted, isLocked, status } = useMemo(() => {
    const isCurrent = item.day === currentDay;
    const isCompleted = completedDays.includes(item.day) || item.day < currentDay;
    const isLocked = item.day > currentDay;
    const status = isCurrent ? 'Bugün' : isCompleted ? 'Tamamlandı' : 'Kilitli';
    return { isCurrent, isCompleted, isLocked, status };
  }, [completedDays, currentDay, item.day]);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isLocked}
        onPress={() => onOpenDay(item.day)}
        style={[
          styles.card,
          isCurrent && styles.cardCurrent,
          isCompleted && !isCurrent && styles.cardCompleted,
          isLocked && styles.cardLocked,
        ]}
      >
        <View style={styles.row}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>Gün {item.day}</Text>
          </View>
          <View style={[styles.statusPill, isCurrent && styles.statusPillCurrent, isCompleted && styles.statusPillDone]}>
            <Text
              style={[
                styles.statusText,
                isCurrent && styles.statusTextCurrent,
                isCompleted && styles.statusTextCurrent,
              ]}
            >
              {status}
            </Text>
          </View>
        </View>
        <Text style={styles.dayTitle}>{item.title}</Text>
        <Text style={styles.dayCopy} numberOfLines={2}>
          {item.opening}
        </Text>
        {isLocked ? <Text style={styles.lockedHint}>Sıran geldiğinde açılacak.</Text> : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardCurrent: {
    borderColor: colors.accent,
    backgroundColor: '#e6f4ee',
  },
  cardCompleted: {
    borderColor: '#dfe8e2',
    backgroundColor: '#f7faf9',
  },
  cardLocked: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 10,
    backgroundColor: colors.tagBackground,
  },
  dayBadgeText: {
    fontWeight: '700',
    color: colors.text,
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.tagBackground,
  },
  statusPillCurrent: {
    backgroundColor: '#ecfdf3',
  },
  statusPillDone: {
    backgroundColor: '#f1f5f3',
  },
  statusText: {
    fontSize: typography.label,
    color: colors.muted,
    fontWeight: '700',
  },
  statusTextCurrent: {
    color: colors.accent,
  },
  dayTitle: {
    fontSize: typography.option,
    fontWeight: '700',
    color: colors.text,
  },
  dayCopy: {
    color: colors.muted,
    lineHeight: 20,
  },
  lockedHint: {
    color: colors.muted,
    fontSize: typography.label,
  },
});

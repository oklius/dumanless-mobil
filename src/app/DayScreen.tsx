import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import days from '../lib/days';
import { useJourney } from '../lib/journeyContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Day'>;

export default function DayScreen({ route, navigation }: Props) {
  const { dayNumber } = route.params;
  const { currentDay, state, markDayComplete } = useJourney();
  const [done, setDone] = useState(state.completedDays.includes(dayNumber));
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const dayContent = days.find((d) => d.day === dayNumber);

  const status = useMemo(() => {
    if (dayNumber === currentDay) return 'current';
    if (dayNumber < currentDay) return 'readOnly';
    return 'locked';
  }, [currentDay, dayNumber]);

  useEffect(() => {
    setDone(state.completedDays.includes(dayNumber));
  }, [state.completedDays, dayNumber]);

  if (!dayContent) {
    return (
      <View style={styles.center}>
        <Text style={styles.body}>Bu gün bulunamadı.</Text>
      </View>
    );
  }

  const handleComplete = () => {
    if (status !== 'current') return;
    markDayComplete(dayNumber);
    setDone(true);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 12 }).start(() => {
      setTimeout(() => navigation.navigate('Hub'), 900);
    });
  };

  const guardCopy =
    status === 'locked'
      ? 'Sıra burada değil. Önce bugünkü güne gel.'
      : status === 'readOnly'
        ? 'Bu gün okuma modunda. Tekrar tamamlanamaz.'
        : 'Görev bitince otomatik Hub’a döneceksin.';

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.badgeRow}>
        <Text style={styles.badge}>Gün {dayNumber}</Text>
        <Text style={[styles.badge, styles.badgeGhost]}>{dayContent.title}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Açılış • Koç sesi</Text>
        <Text style={styles.lead}>{dayContent.opening}</Text>
        <Text style={styles.guard}>{guardCopy}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Günün içeriği</Text>
        <Text style={styles.body}>{dayContent.content}</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Video / görsel burada yer alacak.</Text>
        </View>
      </View>

      <View style={[styles.card, styles.taskCard]}>
        <Text style={styles.title}>Mini görev</Text>
        <Text style={styles.body}>{dayContent.task.title}</Text>
        <Text style={styles.lead}>{dayContent.task.description}</Text>
        <Pressable
          style={[styles.primaryButton, status !== 'current' && styles.primaryButtonDisabled]}
          onPress={handleComplete}
          disabled={status !== 'current'}
        >
          <Text style={styles.primaryButtonText}>
            {done ? 'Bugün tamamlandı' : status === 'locked' ? 'Kilidi açmak için sıranı bekle' : 'Görevi tamamla'}
          </Text>
        </Pressable>
        {done ? (
          <Animated.View style={[styles.checkWrap, { transform: [{ scale: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }] }]}>
            <Text style={styles.checkText}>✓</Text>
            <Text style={styles.checkLabel}>Bugün tamamlandı, Hub’a dönüyoruz.</Text>
          </Animated.View>
        ) : null}
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Hub')}>
          <Text style={styles.secondaryText}>Hub’a dön</Text>
        </Pressable>
        <Pressable style={styles.secondaryGhost} onPress={() => navigation.navigate('Emergency')}>
          <Text style={styles.secondaryGhostText}>Tetiklendim moduna geç</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: '#fff0dd',
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    fontWeight: '700',
  },
  badgeGhost: {
    backgroundColor: colors.optionBackground,
    color: colors.muted,
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xl,
    gap: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  lead: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  body: {
    fontSize: typography.body,
    color: colors.muted,
    lineHeight: 20,
  },
  guard: {
    fontSize: 13,
    color: colors.muted,
    backgroundColor: colors.optionBackground,
    padding: spacing.sm,
    borderRadius: 12,
  },
  placeholder: {
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.optionBackground,
  },
  placeholderText: {
    color: colors.muted,
  },
  taskCard: {
    borderColor: colors.border,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.optionHover,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
  secondaryGhost: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  secondaryGhostText: {
    color: colors.accent,
    fontWeight: '600',
  },
  checkWrap: {
    marginTop: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  checkText: {
    fontSize: 36,
    color: colors.primary,
    fontWeight: '700',
  },
  checkLabel: {
    color: colors.text,
    fontWeight: '600',
  },
});

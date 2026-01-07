import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import Screen from '../components/Screen';
import { useJourney } from '../lib/journeyContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Progress'>;

export default function ProgressScreen({}: Props) {
  const { currentDay, state, elapsed, stats } = useJourney();
  const longestStreak = computeLongestStreak(state.completedDays);

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Ne kadar yol geldin?</Text>
        <Text style={styles.heroBody}>
          {elapsed.days} gün {elapsed.hours} saat {elapsed.minutes} dakika Dumanless’im.
        </Text>
        <Text style={styles.heroHint}>Her dakikada nikotinsiz yeni bir sinir yolu oluşuyor.</Text>
      </View>

      <View style={styles.row}>
        <Metric label="Tamamlanan gün" value={`${state.completedDays.length} / 60`} />
        <Metric label="Bugün" value={`Gün ${currentDay}`} />
      </View>
      <View style={styles.row}>
        <Metric label="En uzun seri" value={`${longestStreak} gün`} />
        <Metric label="Not sayısı" value={`${state.trackerCounts.notes}`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Kazanımlar</Text>
        <View style={styles.statGrid}>
          <StatCard label="Para" value={`₺${stats.moneySaved}`} note="cebine kaldı" />
          <StatCard label="Sigara" value={`${stats.cigarettesSkipped}`} note="içilmedi" />
          <StatCard label="Zaman" value={`${Math.round(stats.timeSavedMinutes / 60)} saat`} note="geri kazandın" />
          <StatCard label="Ömür" value={`${(stats.lifeGainedMinutes / 1440).toFixed(1)} gün`} note="beklenen artış" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Günlerim</Text>
        <View style={styles.timeline}>
          {Array.from({ length: 10 }, (_, i) => {
            const day = Math.min(i + Math.max(currentDay - 1, 1), 60);
            const isDone = state.completedDays.includes(day);
            return (
              <View key={day} style={[styles.timelineItem, isDone && styles.timelineItemDone]}>
                <Text style={styles.timelineDay}>Gün {day}</Text>
                <Text style={styles.timelineStatus}>{isDone ? 'Tamamlandı' : day === currentDay ? 'Bugün' : 'Bekliyor'}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Maskot kutlaması</Text>
        <View style={styles.mascotRow}>
          <Text style={styles.mascotEmoji}>🎉</Text>
          <Text style={styles.mascotCopy}>
            {currentDay <= 7
              ? 'İlk hafta kritikti, geçtin. Küçük ödülünü al.'
              : 'Seriyi koru, krizler daha kısa sürecek.'}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

function computeLongestStreak(completed: number[]): number {
  const set = new Set(completed);
  let longest = 0;
  let current = 0;
  for (let i = 1; i <= 60; i += 1) {
    if (set.has(i)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statNote}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  hero: {
    borderRadius: 28,
    padding: spacing.xxxl,
    backgroundColor: '#f0f5ff',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#dbe6ff',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  heroBody: {
    fontSize: 16,
    color: colors.text,
  },
  heroHint: {
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  metricLabel: {
    fontSize: typography.subtitle,
    color: colors.muted,
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flexBasis: '48%',
    padding: spacing.lg,
    backgroundColor: colors.optionBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statNote: {
    color: colors.muted,
    marginTop: spacing.xs,
  },
  timeline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timelineItem: {
    flexBasis: '48%',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.optionBackground,
  },
  timelineItemDone: {
    borderColor: colors.primary,
    backgroundColor: '#e3f5ef',
  },
  timelineDay: {
    fontWeight: '700',
    color: colors.text,
  },
  timelineStatus: {
    color: colors.muted,
    marginTop: spacing.xs,
  },
  mascotRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  mascotEmoji: {
    fontSize: 28,
  },
  mascotCopy: {
    flex: 1,
    color: colors.text,
  },
});

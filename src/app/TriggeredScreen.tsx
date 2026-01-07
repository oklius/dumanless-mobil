import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import Screen from '../components/Screen';
import { useTriggeredStats } from '../lib/useTriggeredStats';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { TriggeredStackParamList } from '../navigation/AppTabs';
import { useJourney } from '../lib/journeyContext';

type Nav = NativeStackNavigationProp<TriggeredStackParamList, 'TriggeredMain'>;

export default function TriggeredScreen() {
  const navigation = useNavigation<Nav>();
  const { stats, quickWin } = useTriggeredStats();
  const { incrementBreath, logCrisisWin } = useJourney();

  const handleStart = () => {
    incrementBreath();
    navigation.navigate('BreathingSession', {
      pattern: { inhale: 4, hold: 4, exhale: 6, title: '4-4-6 nefes' },
      duration: 90,
      source: 'triggered',
    });
  };

  const handleWin = () => {
    quickWin();
    logCrisisWin();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const lastTime = stats.lastSessionAt ? new Date(stats.lastSessionAt) : null;
  const timeLabel = lastTime
    ? `${lastTime.getHours().toString().padStart(2, '0')}:${lastTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`
    : '—';

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.heading}>Bu istek geçecek.</Text>
        <Text style={styles.subheading}>90 saniyelik küçük bir tur yapalım.</Text>
        <View style={styles.step}>
          <Text style={styles.emoji}>🫁</Text>
          <Text style={styles.body}>4 saniye nefes al · 4 saniye tut · 6 saniye ver.</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.emoji}>🧘</Text>
          <Text style={styles.body}>Ayaklarının yere değdiğini hisset ve omuzlarını gevşet.</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.emoji}>🕰️</Text>
          <Text style={styles.body}>İstek dalgası 90 saniye içinde azalır. Sadece bekle.</Text>
        </View>
        <Pressable style={styles.primary} onPress={handleStart}>
          <Text style={styles.primaryText}>Nefes turunu başlat</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={handleWin}>
          <Text style={styles.secondaryText}>Dalgayı atlattım</Text>
        </Pressable>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Bugün</Text>
        <View style={styles.statsRow}>
          <Stat label="Tetiklenme" value={stats.todayCount} />
          <Stat label="Son tur" value={timeLabel} />
          <Stat label="Toplam tur" value={stats.totalSessions} />
        </View>
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.xxl,
    gap: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  heading: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
  },
  subheading: {
    fontSize: typography.subtitle,
    color: colors.muted,
    lineHeight: 22,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  emoji: {
    fontSize: typography.emoji,
  },
  body: {
    fontSize: typography.subtitle,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  primary: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryButton,
    paddingVertical: spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondary: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  secondaryText: {
    color: colors.accent,
    fontWeight: '700',
  },
  statsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.tagBackground,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  statsTitle: {
    fontSize: typography.option,
    fontWeight: '700',
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderRadius: 12,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.label,
    color: colors.muted,
  },
});

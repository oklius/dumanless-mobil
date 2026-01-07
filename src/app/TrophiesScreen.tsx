import React, { useMemo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import Screen from '../components/Screen';
import { useJourney } from '../lib/journeyContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Trophies'>;

type Trophy = {
  key: string;
  title: string;
  note: string;
  unlocked: boolean;
};

export default function TrophiesScreen({}: Props) {
  const { state } = useJourney();

  const trophies = useMemo<Trophy[]>(() => {
    const completed = state.completedDays.length;
    return [
      { key: 'start', title: 'Yeni Bir Başlangıç', note: 'Uygulamaya ilk kez giriş', unlocked: true },
      { key: 'week', title: 'İlk Hafta', note: '7 günü üst üste tamamlamak', unlocked: completed >= 7 },
      { key: 'month', title: 'Mükemmel Ay', note: '30 gün sigarasız', unlocked: completed >= 30 },
      { key: 'stat', title: 'İstatistikçi', note: '7 gün üst üste not girişi', unlocked: state.trackerCounts.notes >= 7 },
      { key: 'calm', title: 'İçsel Huzur', note: 'Nefes modunu 10 kez kullanmak', unlocked: state.trackerCounts.breath >= 10 },
      { key: 'memory', title: 'Önem', note: 'İlk hatırayı yazmak', unlocked: state.trackerCounts.notes >= 1 },
      { key: 'read', title: 'İlk Okuma', note: 'Bilgi bölümünden 1 okuma', unlocked: state.dailyTasks.article },
      { key: 'crisis', title: 'Kriz Avcısı', note: '5 krizi kaydetmek', unlocked: state.trackerCounts.wins >= 5 },
    ];
  }, [state.completedDays.length, state.dailyTasks.article, state.trackerCounts]);

  const unlockedCount = trophies.filter((t) => t.unlocked).length;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rozetler</Text>
        <Text style={styles.headerSubtitle}>
          {unlockedCount} / {trophies.length} rozet açık
        </Text>
      </View>
      <View style={styles.grid}>
        {trophies.map((trophy) => (
          <View key={trophy.key} style={[styles.card, !trophy.unlocked && styles.cardLocked]}>
            <Text style={styles.emoji}>{trophy.unlocked ? '🐱' : '🐾'}</Text>
            <Text style={styles.title}>{trophy.title}</Text>
            <Text style={styles.note}>{trophy.note}</Text>
            <Text style={[styles.status, trophy.unlocked ? styles.statusOpen : styles.statusLocked]}>
              {trophy.unlocked ? 'Açıldı' : 'Kilitli'}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    color: colors.muted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    flexBasis: '48%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    backgroundColor: colors.panel,
    gap: spacing.xs,
  },
  cardLocked: {
    backgroundColor: colors.optionBackground,
    opacity: 0.8,
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  note: {
    color: colors.muted,
  },
  status: {
    marginTop: spacing.xs,
    fontWeight: '700',
  },
  statusOpen: {
    color: colors.primary,
  },
  statusLocked: {
    color: colors.muted,
  },
});

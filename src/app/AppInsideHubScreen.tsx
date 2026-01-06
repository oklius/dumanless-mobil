import { useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/RootNavigator';
import {
  computeCurrentDay,
  getCompletedDays,
  getQuitStartDate,
  getTriggersCount,
  setQuitStartDate,
} from '../lib/appInsideStorage';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const DAYS = Array.from({ length: 60 }, (_, i) => i + 1);

function DayCell({
  day,
  completed,
  isToday,
  onPress,
}: {
  day: number;
  completed: boolean;
  isToday: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.dayCell, isToday && styles.dayToday, completed && styles.dayCompleted]}
    >
      <Text style={[styles.dayCellText, completed && styles.dayCellTextCompleted]}>{day}</Text>
      {completed ? <Ionicons name="checkmark" size={14} color={colors.accent} /> : null}
    </Pressable>
  );
}

function StartModal({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.startModal}>
      <Text style={styles.startTitle}>Başlangıç</Text>
      <Text style={styles.startCopy}>Sigarayı bırakıyorum. Bugün Gün 1.</Text>
      <Pressable style={styles.primaryButton} onPress={onStart}>
        <Text style={styles.primaryButtonText}>Başlat</Text>
      </Pressable>
    </View>
  );
}

export default function AppInsideHubScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AppInsideHub'>) {
  const [quitStart, setQuitStart] = useState<string | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [triggers, setTriggers] = useState(0);
  const [showStartModal, setShowStartModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [start, completed, triggersCount] = await Promise.all([
        getQuitStartDate(),
        getCompletedDays(),
        getTriggersCount(),
      ]);
      setQuitStart(start);
      setCompletedDays(completed);
      setTriggers(triggersCount);
      setShowStartModal(!start);
    };
    load();
  }, []);

  const currentDay = useMemo(() => computeCurrentDay(quitStart), [quitStart]);

  const completedCount = completedDays.length;

  const handleStart = async () => {
    const nowIso = new Date().toISOString();
    await setQuitStartDate(nowIso);
    setQuitStart(nowIso);
    setShowStartModal(false);
  };

  const renderDay = ({ item }: { item: number }) => (
    <DayCell
      day={item}
      completed={completedDays.includes(item)}
      isToday={item === currentDay}
      onPress={() => navigation.navigate('Day', { dayNumber: item })}
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {showStartModal ? <StartModal onStart={handleStart} /> : null}

      <View style={styles.headerCard}>
        <Text style={styles.headerDay}>{currentDay}. Gün</Text>
        <Text style={styles.headerTitle}>Dumanless’sin</Text>
        <Text style={styles.headerCopy}>Her gün küçük bir adım, sakin bir tempo.</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>Tamamlanan gün: {completedCount}/60</Text>
          <Text style={styles.statText}>Tetiklenme atlattın: {triggers}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bugün — Gün {currentDay}</Text>
        <Text style={styles.body}>Kısa, uygulanabilir görevlerle bugünü netleştir.</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Day', { dayNumber: currentDay })}
        >
          <Text style={styles.primaryButtonText}>Bugüne git</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>60 Günlük Yol</Text>
        <FlatList
          data={DAYS}
          keyExtractor={(item) => item.toString()}
          numColumns={4}
          renderItem={renderDay}
          scrollEnabled={false}
          columnWrapperStyle={styles.dayRow}
        />
      </View>

      <Pressable
        style={[styles.primaryButton, styles.triggerButton]}
        onPress={() => navigation.navigate('TriggerMode')}
      >
        <Text style={styles.primaryButtonText}>Tetiklendim</Text>
      </Pressable>

      <View style={styles.quickRow}>
        <QuickPill label="Mini Oyun" onPress={() => navigation.navigate('MiniTools', { mode: 'game' })} />
        <QuickPill label="Rahatlatıcı Müzik" onPress={() => navigation.navigate('MiniTools', { mode: 'music' })} />
        <QuickPill label="Nefes" onPress={() => navigation.navigate('MiniTools', { mode: 'breath' })} />
      </View>

      <Pressable style={styles.card} onPress={() => navigation.navigate('Progress')}>
        <Text style={styles.sectionTitle}>İlerleme</Text>
        <Text style={styles.body}>Gün {currentDay} • Tamamlanan: {completedCount} • Tetiklenme: {triggers}</Text>
      </Pressable>
    </ScrollView>
  );
}

function QuickPill({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.quickPill} onPress={onPress}>
      <Text style={styles.quickPillText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
  headerCard: {
    borderRadius: 28,
    backgroundColor: colors.panel,
    padding: spacing.xxxl,
    shadowColor: 'rgba(15, 17, 12, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
    gap: spacing.sm,
  },
  headerDay: {
    fontSize: 14,
    color: colors.muted,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  headerCopy: {
    fontSize: typography.body,
    color: colors.muted,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  statText: {
    fontSize: typography.subtitle,
    color: colors.muted,
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xl,
    shadowColor: 'rgba(15, 17, 12, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: typography.body,
    color: colors.muted,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: typography.button,
  },
  triggerButton: {
    marginTop: 0,
  },
  dayRow: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.panel,
  },
  dayToday: {
    borderColor: colors.accent,
  },
  dayCompleted: {
    backgroundColor: 'rgba(15, 76, 58, 0.05)',
    borderColor: colors.accent,
  },
  dayCellText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  dayCellTextCompleted: {
    color: colors.accent,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickPill: {
    flex: 1,
    backgroundColor: colors.panel,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: 'rgba(15, 17, 12, 0.06)',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  quickPillText: {
    color: colors.text,
    fontWeight: '600',
  },
  startModal: {
    borderRadius: 20,
    padding: spacing.xl,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    shadowColor: 'rgba(15, 17, 12, 0.12)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  startTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  startCopy: {
    fontSize: typography.body,
    color: colors.muted,
  },
});

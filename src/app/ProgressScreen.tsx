import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { computeCurrentDay, computeLongestStreak, getCompletedDays, getQuitStartDate, getTriggersCount } from '../lib/appInsideStorage';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Progress'>;

export default function ProgressScreen({ navigation }: Props) {
  const [quitStart, setQuitStart] = useState<string | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [triggers, setTriggers] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [start, completedDays, triggerCount] = await Promise.all([
        getQuitStartDate(),
        getCompletedDays(),
        getTriggersCount(),
      ]);
      setQuitStart(start);
      setCompleted(completedDays);
      setTriggers(triggerCount);
    };
    load();
  }, []);

  const currentDay = computeCurrentDay(quitStart);
  const longestStreak = computeLongestStreak(completed);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>İlerleme</Text>
        <View style={styles.row}>
          <Metric label="Gündür içmiyorsun" value={`${currentDay}`} />
          <Metric label="Tamamlanan gün" value={`${completed.length}`} />
        </View>
        <View style={styles.row}>
          <Metric label="Tetiklenme atlattın" value={`${triggers}`} />
          <Metric label="En uzun seri" value={`${longestStreak}`} />
        </View>
        <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>HUB'a dön</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xxxl,
    gap: spacing.md,
    shadowColor: 'rgba(15, 17, 12, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metric: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    backgroundColor: colors.panel,
    gap: spacing.xs,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  metricLabel: {
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
    color: '#fff',
    fontWeight: '700',
  },
});

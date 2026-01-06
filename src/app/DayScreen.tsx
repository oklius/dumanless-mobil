import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { toggleDayComplete, getCompletedDays } from '../lib/appInsideStorage';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Day'>;

export default function DayScreen({ route, navigation }: Props) {
  const { dayNumber } = route.params;
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const load = async () => {
      const days = await getCompletedDays();
      setCompleted(days.includes(dayNumber));
    };
    load();
  }, [dayNumber]);

  const toggle = async () => {
    const next = await toggleDayComplete(dayNumber);
    setCompleted(next.includes(dayNumber));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Gün {dayNumber}</Text>
        <Text style={styles.body}>Bilim: Nikotin döngüsünü kırmak için günlük küçük uygulamalar önemlidir.</Text>
        <Text style={styles.body}>Koç: Bugün sakin kal, tetikleyicini fark et ve nefes egzersizini uygula.</Text>
        <Text style={styles.body}>Bugünün görevi: 5 dakikalık nefes + günün tetikleyicisini not et.</Text>
        <Pressable style={styles.primaryButton} onPress={toggle}>
          <Text style={styles.primaryButtonText}>
            {completed ? 'Tamamlandı ✓ (Geri al)' : 'Bugünü tamamlandı olarak işaretle'}
          </Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryText}>HUB'a dön</Text>
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
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xl,
    gap: spacing.sm,
    shadowColor: 'rgba(15, 17, 12, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
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
    marginTop: spacing.md,
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
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
});

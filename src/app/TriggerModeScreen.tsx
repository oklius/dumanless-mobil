import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { incrementTriggersCount } from '../lib/appInsideStorage';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'TriggerMode'>;

const TOTAL_SECONDS = 90;

export default function TriggerModeScreen({ navigation }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    incrementTriggersCount();
    setSecondsLeft(TOTAL_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const phaseIndex = Math.floor((TOTAL_SECONDS - secondsLeft) / 30);
  const phases = ['Nefes', 'Dikkat', 'Anlam'];
  const currentPhase = phases[Math.min(phaseIndex, phases.length - 1)];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bu his geçici. 90 saniye buradayız.</Text>
        <Text style={styles.phase}>Şimdi: {currentPhase}</Text>
        <Text style={styles.timer}>{secondsLeft}s</Text>
        <Text style={styles.body}>
          Nefes: 4 saniye al, 4 saniye tut, 6 saniye ver. Sonra etrafındaki 5 şeyi say. Ardından neden
          başladığını hatırla.
        </Text>
        {secondsLeft === 0 && (
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('AppInsideHub')}>
            <Text style={styles.primaryButtonText}>Devam ediyorum</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xxxl,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xxxl,
    gap: spacing.md,
    shadowColor: 'rgba(15, 17, 12, 0.1)',
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  phase: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '700',
  },
  timer: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: typography.body,
    color: colors.muted,
    lineHeight: 20,
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

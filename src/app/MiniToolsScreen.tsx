import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'MiniTools'>;

type Mode = 'game' | 'music' | 'breath' | undefined;

export default function MiniToolsScreen({ route }: Props) {
  const mode = (route.params?.mode as Mode) ?? undefined;
  const [gameSeconds, setGameSeconds] = useState(90);
  const [gameRunning, setGameRunning] = useState(false);
  const [breathStep, setBreathStep] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (gameRunning) {
      interval = setInterval(() => {
        setGameSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setGameRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameRunning]);

  useEffect(() => {
    const sequence = ['inhale', 'hold', 'exhale'] as const;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % sequence.length;
      setBreathStep(sequence[idx]);
      setBreathCount(sequence[idx] === 'exhale' ? 6 : 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hızlı Araçlar</Text>
      <Text style={styles.subtitle}>Mini oyun, rahatlatıcı müzik ve nefes rehberi.</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Mini oyun — 90 saniye erteleme</Text>
          {mode === 'game' ? <Badge>Seçildi</Badge> : null}
        </View>
        <Text style={styles.body}>Dikkatini 90 saniyeliğine ertele; tetiklenme dalgası geçsin.</Text>
        <Text style={styles.timer}>{gameSeconds}s</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            setGameSeconds(90);
            setGameRunning(true);
          }}
        >
          <Text style={styles.primaryButtonText}>{gameRunning ? 'Sürüyor...' : 'Başlat'}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Rahatlatıcı müzik</Text>
          {mode === 'music' ? <Badge>Seçildi</Badge> : null}
        </View>
        <Text style={styles.body}>Yakında. Şimdilik sakinleşmek için kulaklığını tak ve bekle.</Text>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Oynat (yakında)</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Nefes — 4/4/6</Text>
          {mode === 'breath' ? <Badge>Seçildi</Badge> : null}
        </View>
        <Text style={styles.body}>4 saniye al, 4 saniye tut, 6 saniye ver. Ritmi takip et.</Text>
        <Text style={styles.breathStep}>Şimdi: {breathLabel(breathStep)}</Text>
        <Text style={styles.timer}>{breathCount}s</Text>
      </View>
    </ScrollView>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
}

function breathLabel(step: 'inhale' | 'hold' | 'exhale') {
  if (step === 'inhale') return 'Nefes al';
  if (step === 'hold') return 'Tut';
  return 'Ver';
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.subtitle,
    color: colors.muted,
    marginBottom: spacing.md,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: typography.body,
    color: colors.muted,
    lineHeight: 20,
  },
  timer: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
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
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
  breathStep: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(15, 76, 58, 0.08)',
    borderRadius: 999,
  },
  badgeText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 12,
  },
});

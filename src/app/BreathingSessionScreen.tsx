import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import Screen from '../components/Screen';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useTriggeredStats } from '../lib/useTriggeredStats';
import { TriggeredStackParamList, ToolsStackParamList } from '../navigation/AppTabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Pattern = {
  inhale: number;
  hold: number;
  exhale: number;
  title?: string;
};

const defaultPattern: Pattern = { inhale: 4, hold: 4, exhale: 6, title: '4-4-6' };

export default function BreathingSessionScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { recordSession } = useTriggeredStats();
  const pattern = route.params?.pattern ?? defaultPattern;
  const duration = route.params?.duration ?? 90;
  const source = route.params?.source ?? 'triggered';

  const [remaining, setRemaining] = useState(duration);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isFinished, setFinished] = useState(false);
  const scale = useRef(new Animated.Value(0.8)).current;
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finishedRef = useRef(false);

  const phaseText = useMemo(() => {
    if (phase === 'inhale') return 'Nefes al';
    if (phase === 'hold') return 'Tut';
    return 'Ver';
  }, [phase]);

  const startPhaseCycle = useCallback(
    (nextPhase: typeof phase) => {
      if (finishedRef.current) return;
      setPhase(nextPhase);
      const durationMs =
        nextPhase === 'inhale' ? pattern.inhale : nextPhase === 'hold' ? pattern.hold : pattern.exhale;
      Animated.timing(scale, {
        toValue: nextPhase === 'inhale' ? 1.1 : nextPhase === 'hold' ? 1.05 : 0.85,
        duration: durationMs * 1000,
        useNativeDriver: true,
      }).start();
      phaseTimerRef.current = setTimeout(() => {
        if (finishedRef.current) return;
        const order: typeof phase[] = ['inhale', 'hold', 'exhale'];
        const currentIndex = order.indexOf(nextPhase);
        const upcoming = order[(currentIndex + 1) % order.length];
        startPhaseCycle(upcoming);
      }, durationMs * 1000);
    },
    [pattern.exhale, pattern.hold, pattern.inhale, scale]
  );

  useFocusEffect(
    useCallback(() => {
      finishedRef.current = false;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      startPhaseCycle('inhale');
      timerRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current ?? undefined);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        finishedRef.current = true;
      };
    }, [startPhaseCycle])
  );

  useEffect(() => {
    if (remaining === 0 && !isFinished) {
      finishedRef.current = true;
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      setFinished(true);
      if (source === 'triggered') {
        recordSession();
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [isFinished, recordSession, remaining, source]);

  const handleFinishEarly = () => {
    setRemaining(0);
    setFinished(true);
    finishedRef.current = true;
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (source === 'triggered') {
      recordSession();
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const countdownLabel = useMemo(() => {
    const minutes = Math.floor(remaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (remaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [remaining]);

  return (
    <Screen scrollable={false} contentStyle={styles.screenContent}>
      <View style={styles.card}>
        <Text style={styles.title}>{pattern.title || 'Nefes Turu'}</Text>
        <Text style={styles.subtitle}>Süre: {duration} saniye</Text>

        <View style={styles.circleWrap}>
          <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
            <Text style={styles.phaseText}>{phaseText}</Text>
          </Animated.View>
        </View>
        <Text style={styles.countdown}>{countdownLabel}</Text>
        <View style={styles.patternRow}>
          <Badge label={`Al ${pattern.inhale}s`} />
          <Badge label={`Tut ${pattern.hold}s`} />
          <Badge label={`Ver ${pattern.exhale}s`} />
        </View>

        {!isFinished ? (
          <Pressable style={styles.primary} onPress={handleFinishEarly}>
            <Text style={styles.primaryText}>Bitir</Text>
          </Pressable>
        ) : (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Güzel. Dalgayı geçtin.</Text>
            <Text style={styles.successBody}>İstersen 1 dk dikkat dağıt.</Text>
            <Pressable
              style={styles.secondary}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.secondaryText}>Kapat</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Screen>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.xxl,
    gap: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.subtitle,
    color: colors.muted,
  },
  circleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 120,
    backgroundColor: '#e6f4ee',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  phaseText: {
    fontSize: typography.optionLarge,
    fontWeight: '700',
    color: colors.accent,
  },
  countdown: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
  },
  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.tagBackground,
  },
  badgeText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: typography.label,
  },
  primary: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryButton,
    borderRadius: 999,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  successBox: {
    borderRadius: 18,
    backgroundColor: colors.successBg,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  successTitle: {
    fontSize: typography.option,
    fontWeight: '700',
    color: colors.successText,
  },
  successBody: {
    color: colors.successText,
  },
  secondary: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
});

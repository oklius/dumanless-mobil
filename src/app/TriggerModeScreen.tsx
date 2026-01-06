import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { useJourney } from '../lib/journeyContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Emergency'>;

const TOTAL_SECONDS = 60;

export default function TriggerModeScreen({ navigation }: Props) {
  const { currentDay, incrementBreath } = useJourney();
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [mode, setMode] = useState<'game' | 'coach' | 'breath'>('game');
  const [taps, setTaps] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mode !== 'breath') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.2, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.9, duration: 2500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mode, pulse]);

  useEffect(() => {
    if (secondsLeft === 0) {
      const timeout = setTimeout(() => navigation.navigate('Hub'), 6000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [secondsLeft, navigation]);

  const gameProgress = useMemo(() => Math.min(taps / 20, 1), [taps]);

  const exitRow = (
    <View style={styles.exitRow}>
      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Hub')}>
        <Text style={styles.secondaryText}>Hub’a dön</Text>
      </Pressable>
      <Pressable
        style={[styles.secondaryButton, styles.primaryGhost]}
        onPress={() => navigation.navigate('Day', { dayNumber: currentDay })}
      >
        <Text style={styles.secondaryText}>Bugüne git</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tetiklendim modu</Text>
      <Text style={styles.subheader}>60 saniye boyunca dikkatini dağıt, nefes al, sakin kal.</Text>

      <View style={styles.tabRow}>
        <Tab title="Mini oyun" active={mode === 'game'} onPress={() => setMode('game')} />
        <Tab title="Koç konuşması" active={mode === 'coach'} onPress={() => setMode('coach')} />
        <Tab title="Nefes" active={mode === 'breath'} onPress={() => setMode('breath')} />
      </View>

      <View style={styles.card}>
        {mode === 'game' && (
          <>
            <Text style={styles.title}>Ritme dokun</Text>
            <Text style={styles.body}>Ekrana dokun, her dokunuş dikkatini yeniden konumlandırır.</Text>
            <View style={styles.tapZone}>
              <Pressable
                style={styles.tapButton}
                onPress={() => setTaps((prev) => prev + 1)}
                disabled={secondsLeft === 0}
              >
                <Text style={styles.tapText}>{taps} dokunuş</Text>
                <Text style={styles.tapHint}>Ritmi kaçırma</Text>
              </Pressable>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${gameProgress * 100}%` }]} />
              </View>
            </View>
          </>
        )}

        {mode === 'coach' && (
          <>
            <Text style={styles.title}>Koç konuşması</Text>
            <Text style={styles.body}>
              Bu bir istek, emir değil. Nefes al, 5 şeye odaklan, bedenini hareket ettir. Dalga az sonra
              inecek. Sigara içmemen hiçbir şeyi bozmaz, aksine beynine “artık istemiyorum” sinyali verirsin.
            </Text>
            <Pressable style={styles.primaryButton} onPress={() => setSecondsLeft(0)}>
              <Text style={styles.primaryButtonText}>Tamam, sakinim</Text>
            </Pressable>
          </>
        )}

        {mode === 'breath' && (
          <>
            <Text style={styles.title}>60 saniye nefes</Text>
            <Text style={styles.body}>Daire büyürken nefes al, küçülürken ver. Ritmi bırakma.</Text>
            <View style={styles.breathZone}>
              <Animated.View style={[styles.breathCircle, { transform: [{ scale: pulse }] }]} />
              <Text style={styles.breathText}>4 sn al • 4 sn tut • 6 sn ver</Text>
            </View>
            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                incrementBreath();
                setSecondsLeft((s) => Math.max(s - 10, 0));
              }}
            >
              <Text style={styles.primaryButtonText}>Nefesi tamamladım</Text>
            </Pressable>
          </>
        )}

        <View style={styles.timerRow}>
          <Text style={styles.timer}>{secondsLeft}s</Text>
          <Text style={styles.timerHint}>{secondsLeft === 0 ? 'Süre bitti, kapanıyor.' : 'Dalganın bitmesine kalan süre.'}</Text>
        </View>

        {secondsLeft === 0 ? exitRow : null}
      </View>

      {secondsLeft > 0 ? exitRow : null}
    </View>
  );
}

function Tab({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
    gap: spacing.md,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subheader: {
    color: colors.muted,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 14,
    backgroundColor: colors.optionBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#e2f7f3',
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.text,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.text,
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xl,
    gap: spacing.md,
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
  body: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  tapZone: {
    gap: spacing.md,
  },
  tapButton: {
    height: 160,
    borderRadius: 22,
    backgroundColor: '#ffe7e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tapText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  tapHint: {
    color: colors.muted,
    marginTop: spacing.xs,
  },
  progressTrack: {
    height: 12,
    borderRadius: 12,
    backgroundColor: colors.progressTrack,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  breathZone: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  breathCircle: {
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: '#e2f7f3',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  breathText: {
    color: colors.text,
    fontWeight: '600',
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
  timerRow: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  timer: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  timerHint: {
    color: colors.muted,
  },
  exitRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  primaryGhost: {
    borderColor: colors.primary,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
});

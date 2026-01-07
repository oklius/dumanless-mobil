import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Screen from '../components/Screen';
import { ToolsStackParamList } from '../navigation/AppTabs';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Nav = NativeStackNavigationProp<ToolsStackParamList, 'ToolsMain'>;

type Track = {
  key: string;
  title: string;
  source: any;
};

const tracks: Track[] = [
  { key: 'rain', title: 'Yağmur', source: require('../assets/audio/rain.mp3') },
  { key: 'ocean', title: 'Dalga', source: require('../assets/audio/ocean.mp3') },
];

const breathingPatterns = [
  { key: '446', title: '4-4-6', pattern: { inhale: 4, hold: 4, exhale: 6 } },
  { key: '478', title: '4-7-8', pattern: { inhale: 4, hold: 7, exhale: 8 } },
];

export default function ToolsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<ToolsStackParamList, 'ToolsMain'>>();

  const [selectedTrack, setSelectedTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [countdown, setCountdown] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [breathPatternKey, setBreathPatternKey] = useState(breathingPatterns[0].key);

  const [focusRemaining, setFocusRemaining] = useState(120);
  const focusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [focusRunning, setFocusRunning] = useState(false);

  useEffect(() => {
    return () => {
      unloadSound();
      if (timerRef.current) clearTimeout(timerRef.current);
      if (focusTimerRef.current) clearInterval(focusTimerRef.current);
    };
  }, []);


  const unloadSound = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCountdown(0);
    setIsPlaying(false);
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
  };

  const startAudio = async () => {
    try {
      await unloadSound();
      const { sound } = await Audio.Sound.createAsync(selectedTrack.source, {
        shouldPlay: true,
        isLooping: true,
        volume: 0.7,
      });
      soundRef.current = sound;
      setIsPlaying(true);
      setCountdown(timerMinutes * 60);
      timerRef.current = setTimeout(async () => {
        await unloadSound();
      }, timerMinutes * 60 * 1000);
    } catch (error) {
      setIsPlaying(false);
    }
  };

  const pauseAudio = async () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (soundRef.current) {
      await soundRef.current.pauseAsync().catch(() => {});
    }
  };

  useEffect(() => {
    if (!isPlaying || countdown === 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, countdown]);

  const countdownLabel = useMemo(() => {
    const m = Math.floor(countdown / 60)
      .toString()
      .padStart(2, '0');
    const s = (countdown % 60).toString().padStart(2, '0');
    return countdown > 0 ? `${m}:${s}` : `${timerMinutes.toString().padStart(2, '0')}:00`;
  }, [countdown, timerMinutes]);

  const focusLabel = useMemo(() => {
    const m = Math.floor(focusRemaining / 60)
      .toString()
      .padStart(2, '0');
    const s = (focusRemaining % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [focusRemaining]);

  const startFocus = () => {
    if (focusRemaining === 0) {
      setFocusRemaining(120);
    }
    setFocusRunning(true);
    focusTimerRef.current && clearInterval(focusTimerRef.current);
    focusTimerRef.current = setInterval(() => {
      setFocusRemaining((prev) => {
        if (prev <= 1) {
          focusTimerRef.current && clearInterval(focusTimerRef.current);
          setFocusRunning(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetFocus = () => {
    setFocusRunning(false);
    focusTimerRef.current && clearInterval(focusTimerRef.current);
    setFocusRemaining(120);
  };

  const selectedPattern = breathingPatterns.find((p) => p.key === breathPatternKey) ?? breathingPatterns[0];

  useEffect(() => {
    if (!route.params?.open) return;
    if (route.params.open === 'focus') {
      startFocus();
    }
    if (route.params.open === 'audio') {
      startAudio();
    }
  }, [route.params?.open]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Destekleyici Araçlar</Text>
        <Text style={styles.subtitle}>İstediğin anda kullanabileceğin sakinleştirici araçlar.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Rahatlatıcı sesler</Text>
          <Badge label={isPlaying ? 'Oynatılıyor' : 'Hazır'} />
        </View>
        <Text style={styles.cardBody}>Yağmur veya dalga sesi ile kısa bir mola ver.</Text>
        <View style={styles.row}>
          {tracks.map((track) => (
            <Pressable
              key={track.key}
              style={[styles.chip, track.key === selectedTrack.key && styles.chipActive]}
              onPress={() => setSelectedTrack(track)}
            >
              <Text
                style={[
                  styles.chipText,
                  track.key === selectedTrack.key && styles.chipTextActive,
                ]}
              >
                {track.title}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.row}>
          {[5, 10, 15].map((m) => (
            <Pressable
              key={m}
              style={[styles.timerChip, timerMinutes === m && styles.timerChipActive]}
              onPress={() => setTimerMinutes(m)}
            >
              <Text
                style={[
                  styles.timerChipText,
                  timerMinutes === m && styles.timerChipTextActive,
                ]}
              >
                {m} dk
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.countdown}>{countdownLabel}</Text>
        <View style={styles.row}>
          <Pressable style={styles.primary} onPress={startAudio}>
            <Text style={styles.primaryText}>{isPlaying ? 'Yeniden başlat' : 'Çalmaya başla'}</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={pauseAudio}>
            <Text style={styles.secondaryText}>Duraklat</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Nefes egzersizi</Text>
          <Badge label={selectedPattern.title} />
        </View>
        <Text style={styles.cardBody}>Sana iyi gelen tempoyu seç, yönlendirmeli nefes turunu başlat.</Text>
        <View style={styles.row}>
          {breathingPatterns.map((pattern) => (
            <Pressable
              key={pattern.key}
              style={[styles.chip, breathPatternKey === pattern.key && styles.chipActive]}
              onPress={() => setBreathPatternKey(pattern.key)}
            >
              <Text
                style={[
                  styles.chipText,
                  breathPatternKey === pattern.key && styles.chipTextActive,
                ]}
              >
                {pattern.title}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={styles.primary}
          onPress={() =>
            navigation.navigate('BreathingSession', {
              pattern: { ...selectedPattern.pattern, title: `${selectedPattern.title} nefes` },
              duration: 90,
              source: 'tools',
            })
          }
        >
          <Text style={styles.primaryText}>Başlat</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Odak modu</Text>
          <Badge label="2:00" />
        </View>
        <Text style={styles.cardBody}>Sessiz kal, sadece nefes al ve say. Süre dolunca haber vereceğiz.</Text>
        <Text style={styles.focusCountdown}>{focusLabel}</Text>
        <View style={styles.row}>
          <Pressable style={styles.primary} onPress={startFocus}>
            <Text style={styles.primaryText}>{focusRunning ? 'Devam' : 'Başlat'}</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={resetFocus}>
            <Text style={styles.secondaryText}>Sıfırla</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Mini esneme</Text>
          <Badge label="4 adım" />
        </View>
        <Text style={styles.cardBody}>Boyun ve omuzları gevşeten kısa bir rehber.</Text>
        <View style={styles.stretchList}>
          <StretchStep emoji="🧍‍♂️" title="Omuz yuvarla" detail="10 saniye yavaşça öne-arkaya." />
          <StretchStep emoji="🙆‍♀️" title="Boyun esnet" detail="Başını sağ-sol yana 15 saniye tut." />
          <StretchStep emoji="🤸" title="Kolları aç" detail="Kollarını yana açıp nefes ver." />
          <StretchStep emoji="🧘" title="Derin nefes" detail="4-4-6 nefesle bitir." />
        </View>
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

function StretchStep({ emoji, title, detail }: { emoji: string; title: string; detail: string }) {
  return (
    <View style={styles.stretchRow}>
      <Text style={styles.stretchEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.stretchTitle}>{title}</Text>
        <Text style={styles.stretchDetail}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.subtitle,
    color: colors.muted,
    lineHeight: 20,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.option,
    fontWeight: '700',
    color: colors.text,
  },
  cardBody: {
    fontSize: typography.subtitle,
    color: colors.muted,
    lineHeight: 20,
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.optionBackground,
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: '#e6f4ee',
  },
  chipText: {
    color: colors.text,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.accent,
  },
  timerChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerChipActive: {
    borderColor: colors.accent,
    backgroundColor: '#ecfdf3',
  },
  timerChipText: {
    color: colors.text,
    fontWeight: '600',
  },
  timerChipTextActive: {
    color: colors.accent,
  },
  countdown: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  primary: {
    flex: 1,
    backgroundColor: colors.primaryButton,
    paddingVertical: spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondary: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
  focusCountdown: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  stretchList: {
    gap: spacing.sm,
  },
  stretchRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  stretchEmoji: {
    fontSize: typography.emoji,
  },
  stretchTitle: {
    fontSize: typography.option,
    fontWeight: '700',
    color: colors.text,
  },
  stretchDetail: {
    color: colors.muted,
  },
});

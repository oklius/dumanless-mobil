import React, { useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OptionCard from '../components/OptionCard';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';
import RemoteIllustration from '../components/RemoteIllustration';
import { RootStackParamList } from '../navigation/RootNavigator';
import { QuizQuestionStep, QuizStep, STEPS } from '../lib/questions';
import { resolveAssetUri } from '../lib/resolveAssetUri';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

type Answers = Record<string, string[]>;

const AGE_ILLUSTRATIONS = [
  '/illustrations/age-01.svg',
  '/illustrations/age-02.svg',
  '/illustrations/age-03.svg',
  '/illustrations/age-04.svg',
];

const GENDER_EMOJIS: Record<string, string> = {
  erkek: '👨',
  kadın: '👩',
};

export default function QuizScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisMessageIndex, setAnalysisMessageIndex] = useState(0);

  const total = STEPS.length;
  const step = STEPS[index];
  const selected = answers[step.id] ?? [];
  const percent = Math.round(((index + 1) / total) * 100);
  const helper =
    step.type === 'question'
      ? step.helper ?? (step.kind === 'multi' ? '(Çoklu seçim yapabilirsin.)' : undefined)
      : undefined;

  const isLast = index === total - 1;

  useEffect(() => {
    if (step.id !== 's40') {
      setAnalysisProgress(0);
      setAnalysisMessageIndex(0);
      return;
    }
    setAnalysisProgress(0);
    setAnalysisMessageIndex(0);
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(progress + 8, 100);
      setAnalysisProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
      }
    }, 220);
    const messageTimer = setInterval(() => {
      setAnalysisMessageIndex((prev) => (prev + 1) % Math.max(step.body.length, 1));
    }, 1400);
    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [step.id]);

  const handleSelect = (optionId: string) => {
    if (step.type !== 'question') return;
    if (step.kind === 'single') {
      setAnswers((prev) => ({ ...prev, [step.id]: [optionId] }));
      return;
    }

    setAnswers((prev) => {
      const existing = prev[step.id] ?? [];
      const has = existing.includes(optionId);
      const next = has ? existing.filter((id) => id !== optionId) : [...existing, optionId];
      return { ...prev, [step.id]: next };
    });
  };

  const goNext = () => {
    if (isLast) {
      navigation.navigate('QuizResult', { answered: Object.keys(answers).length });
      return;
    }
    setIndex((prev) => Math.min(prev + 1, total - 1));
  };

  const goBack = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const disableNext = step.type === 'question' && step.kind === 'single' && selected.length === 0;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top || styles.container.paddingTop }]}
      showsVerticalScrollIndicator={false}
    >
      <ProgressBar current={index + 1} total={total} percent={percent} />
      <QuizCard>
        <View style={styles.header}>
          <Text style={styles.badge}>Quiz</Text>
          <Text style={styles.title}>{step.title ?? 'Devam'}</Text>
          {helper ? <Text style={styles.helper}>{helper}</Text> : null}
        </View>

        {step.type === 'info' ? (
          <InfoStep
            step={step}
            analysisProgress={analysisProgress}
            analysisMessageIndex={analysisMessageIndex}
          />
        ) : (
          <View style={styles.options}>
            {step.id === 's1' ? (
              <GenderOptions step={step} selectedId={selected[0]} onSelect={handleSelect} />
            ) : step.id === 's2' ? (
              <AgeGrid step={step} selectedId={selected[0]} onSelect={handleSelect} />
            ) : (
              step.options.map((option) => (
                <OptionCard
                  key={option.id}
                  title={option.label}
                  selected={selected.includes(option.id)}
                  onPress={() => handleSelect(option.id)}
                  multi={step.kind === 'multi'}
                />
              ))
            )}
          </View>
        )}

        <View style={styles.actions}>
          <Pressable
            style={[styles.secondaryButton, index === 0 && styles.secondaryDisabled]}
            onPress={goBack}
            disabled={index === 0}
          >
            <Text style={styles.secondaryText}>Geri</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, disableNext && styles.primaryDisabled]}
            onPress={goNext}
            disabled={disableNext}
          >
            <Text style={styles.primaryText}>{isLast ? "Quiz'i Bitir" : 'İleri →'}</Text>
          </Pressable>
        </View>
      </QuizCard>
    </ScrollView>
  );
}

function GenderOptions({
  step,
  selectedId,
  onSelect,
}: {
  step: QuizQuestionStep;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.options}>
      {step.options.map((option) => {
        const isSelected = selectedId === option.id;
        const emoji = GENDER_EMOJIS[option.label.toLowerCase()] ?? '🙂';
        return (
          <OptionCard
            key={option.id}
            title={option.label}
            selected={isSelected}
            onPress={() => onSelect(option.id)}
            leading={<Text style={styles.emoji}>{emoji}</Text>}
          />
        );
      })}
    </View>
  );
}

function AgeGrid({
  step,
  selectedId,
  onSelect,
}: {
  step: QuizQuestionStep;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.ageGrid}>
      {step.options.map((option, index) => {
        const isSelected = selectedId === option.id;
        const uri = resolveAssetUri(AGE_ILLUSTRATIONS[index % AGE_ILLUSTRATIONS.length]);
        const label = option.label.replace(/-/g, '–');
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            style={[
              styles.ageCard,
              isSelected ? styles.ageCardSelected : styles.ageCardDefault,
            ]}
          >
            {uri ? (
              <RemoteIllustration uri={uri} width={120} height={120} borderRadius={16} />
            ) : null}
            <View style={[styles.ageLabel, isSelected && styles.ageLabelSelected]}>
              <Text style={[styles.ageLabelText, isSelected && styles.ageLabelTextSelected]}>
                Yaş: {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function InfoStep({
  step,
  analysisProgress,
  analysisMessageIndex,
}: {
  step: Extract<QuizStep, { type: 'info' }>;
  analysisProgress: number;
  analysisMessageIndex: number;
}) {
  const imageUri = useMemo(() => resolveAssetUri(step.image), [step.image]);

  if (step.id === 's5') {
    const [first, second, third] = step.body;
    return (
      <View style={styles.infoBlock}>
        {imageUri ? (
          <RemoteIllustration uri={imageUri} width={200} height={200} borderRadius={24} />
        ) : null}
        <View style={styles.infoList}>
          {[first, second].filter(Boolean).map((line) => (
            <View key={line} style={styles.infoRow}>
              <View style={styles.dotBullet} />
              <Text style={styles.infoText}>{line}</Text>
            </View>
          ))}
        </View>
        {third ? (
          <View style={styles.amberCallout}>
            <Text style={styles.amberText}>{third}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  if (step.id === 's11') {
    const [headline, ...rest] = step.body;
    return (
      <View style={styles.infoBlock}>
        {imageUri ? (
          <RemoteIllustration uri={imageUri} width={200} height={200} borderRadius={24} />
        ) : null}
        {headline ? (
          <View style={styles.warningCard}>
            <Text style={styles.warningHeadline}>{headline}</Text>
          </View>
        ) : null}
        <View style={styles.infoList}>
          {rest.map((line) => (
            <View key={line} style={styles.infoRow}>
              <View style={styles.dotBullet} />
              <Text style={styles.infoText}>{line}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (step.id === 's18') {
    return (
      <View style={styles.infoBlock}>
        {imageUri ? (
          <RemoteIllustration uri={imageUri} width={200} height={200} borderRadius={24} />
        ) : null}
        <View style={styles.successCard}>
          {step.body.map((line) => (
            <Text key={line} style={styles.successText}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  if (step.id === 's24' || step.id === 's25') {
    const entries = step.body.map((line) => {
      const [label, text] = line.split('||');
      return { label: label?.trim() ?? '', text: text?.trim() ?? '' };
    });
    return (
      <View style={styles.infoBlock}>
        {imageUri ? (
          <RemoteIllustration uri={imageUri} width={200} height={200} borderRadius={24} />
        ) : null}
        <View style={styles.cardList}>
          {entries.map((entry) => (
            <View key={entry.label} style={styles.borderCard}>
              <Text style={styles.infoLabel}>{entry.label}</Text>
              <Text style={styles.infoText}>{entry.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (step.id === 's28') {
    return (
      <View style={styles.infoBlock}>
        {imageUri ? (
          <RemoteIllustration uri={imageUri} width={200} height={200} borderRadius={24} />
        ) : null}
        <View style={styles.cardList}>
          <View style={styles.warningCard}>
            <Text style={styles.subLabel}>Ortalama deneme</Text>
            <Text style={styles.calloutNumber}>30+</Text>
            <Text style={styles.infoText}>{step.body[0]}</Text>
          </View>
          <View style={styles.successCard}>
            <Text style={styles.subLabel}>Başarı olasılığı</Text>
            <Text style={styles.calloutNumber}>10 kat</Text>
            <Text style={styles.successText}>{step.body[1]}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (step.id === 's37') {
    const entries = step.body.map((line) => {
      const [label, text] = line.split(':');
      return { label: label?.trim() ?? '', text: text?.trim() ?? '' };
    });
    return (
      <View style={styles.infoBlock}>
        {imageUri ? (
          <RemoteIllustration uri={imageUri} width={200} height={200} borderRadius={24} />
        ) : null}
        <View style={styles.cardList}>
          {entries.map((entry) => (
            <View key={entry.label} style={styles.borderCard}>
              <Text style={styles.infoLabel}>{entry.label}</Text>
              <Text style={styles.infoText}>{entry.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (step.id === 's40') {
    const circumference = 2 * Math.PI * 60;
    const offset = circumference - (analysisProgress / 100) * circumference;
    return (
      <View style={styles.analysisBlock}>
        <View style={styles.analysisGraphic}>
          <Svg width={160} height={160}>
            <Circle cx="80" cy="80" r="60" stroke={colors.progressTrack} strokeWidth="10" fill="none" />
            <Circle
              cx="80"
              cy="80"
              r="60"
              stroke={colors.accent}
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.analysisPercent}>{analysisProgress}%</Text>
        </View>
        <View style={styles.analysisMessages}>
          {step.body.map((line, idx) => (
            <Text
              key={line}
              style={[
                styles.infoText,
                idx === analysisMessageIndex ? styles.analysisActive : styles.analysisMuted,
              ]}
            >
              {line}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.infoBlock}>
      {imageUri ? (
        <RemoteIllustration uri={imageUri} width={200} height={200} borderRadius={24} />
      ) : null}
      <View style={styles.infoList}>
        {step.body.map((line) => (
          <View key={line} style={styles.infoRow}>
            <View style={styles.dotBullet} />
            <Text style={styles.infoText}>{line}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxxl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tagBackground,
    color: colors.muted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 32,
  },
  helper: {
    color: colors.muted,
    fontSize: typography.subtitle,
  },
  options: {
    gap: spacing.md,
  },
  actions: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primaryButton,
    borderRadius: 999,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
  },
  primaryDisabled: {
    opacity: 0.4,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  secondaryDisabled: {
    opacity: 0.5,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
  emoji: {
    fontSize: typography.emoji,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  ageCard: {
    flex: 1,
    minWidth: '48%',
    borderRadius: 24,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    backgroundColor: colors.panel,
  },
  ageCardDefault: {
    borderColor: colors.optionBorder,
  },
  ageCardSelected: {
    borderColor: colors.accent,
    shadowColor: colors.accentShadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  ageLabel: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 14,
    backgroundColor: colors.tagBackground,
  },
  ageLabelSelected: {
    backgroundColor: colors.accent,
  },
  ageLabelText: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  ageLabelTextSelected: {
    color: '#ffffff',
  },
  infoBlock: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  infoList: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  dotBullet: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginTop: spacing.xs,
    backgroundColor: colors.accent,
  },
  infoText: {
    color: colors.muted,
    fontSize: typography.subtitle,
    lineHeight: 22,
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
  },
  cardList: {
    gap: spacing.sm,
  },
  borderCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  warningCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningBg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  warningHeadline: {
    color: colors.warningText,
    fontWeight: '700',
    fontSize: typography.subtitle,
  },
  successCard: {
    borderRadius: 18,
    backgroundColor: colors.successBg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  successText: {
    color: colors.successText,
    fontSize: typography.subtitle,
    lineHeight: 22,
    fontWeight: '600',
  },
  amberCallout: {
    borderRadius: 18,
    backgroundColor: colors.amberBg,
    padding: spacing.lg,
  },
  amberText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: typography.subtitle,
  },
  subLabel: {
    fontSize: typography.label,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: colors.warningText,
  },
  calloutNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.warningText,
  },
  analysisBlock: {
    gap: spacing.md,
    alignItems: 'center',
  },
  analysisGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  analysisPercent: {
    position: 'absolute',
    fontSize: 26,
    fontWeight: '800',
    color: colors.accent,
  },
  analysisMessages: {
    gap: spacing.xs,
    alignSelf: 'stretch',
  },
  analysisActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  analysisMuted: {
    opacity: 0.75,
  },
});

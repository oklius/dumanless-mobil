import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import OptionCard from '../components/OptionCard';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { QuizQuestionStep, QuizStep, STEPS } from '../lib/questions';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

type Answers = Record<string, string[]>;

export default function QuizScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const total = STEPS.length;
  const step = STEPS[index];
  const selected = answers[step.id] ?? [];
  const percent = Math.round(((index + 1) / total) * 100);

  const isLast = index === total - 1;

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
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <ProgressBar current={index + 1} total={total} percent={percent} />
      <QuizCard>
        <Text style={styles.badge}>Quiz</Text>
        <Text style={styles.title}>{step.title ?? 'Devam'}</Text>
        {step.type === 'question' && step.helper ? <Text style={styles.helper}>{step.helper}</Text> : null}

        {step.type === 'info' ? (
          <InfoStep step={step} />
        ) : (
          <View style={styles.options}>
            {step.options.map((option) => (
              <OptionCard
                key={option.id}
                selected={selected.includes(option.id)}
                onPress={() => handleSelect(option.id)}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </OptionCard>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Pressable style={[styles.secondaryButton, index === 0 && styles.secondaryDisabled]} onPress={goBack} disabled={index === 0}>
            <Text style={styles.secondaryText}>Geri</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, disableNext && styles.primaryDisabled]}
            onPress={goNext}
            disabled={disableNext}
          >
            <Text style={styles.primaryText}>{isLast ? 'Tamamla' : 'İleri'}</Text>
          </Pressable>
        </View>
      </QuizCard>
    </ScrollView>
  );
}

function InfoStep({ step }: { step: Extract<QuizStep, { type: 'info' }> }) {
  return (
    <View style={styles.infoBlock}>
      {step.body.map((line) => (
        <Text key={line} style={styles.infoText}>
          • {line.replace('||', ' – ')}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxxl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.optionBackground,
    color: colors.muted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  helper: {
    color: colors.muted,
    marginTop: spacing.xs,
  },
  options: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  optionText: {
    fontSize: typography.option,
    color: colors.text,
  },
  actions: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  primaryDisabled: {
    backgroundColor: colors.optionHover,
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
  secondaryDisabled: {
    opacity: 0.5,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
  infoBlock: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    color: colors.text,
    lineHeight: 20,
  },
});

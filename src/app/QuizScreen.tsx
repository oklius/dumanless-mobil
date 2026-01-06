import { useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
import { quizQuestions, QuizAnswers } from '../lib/quiz';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

type AnswersState = QuizAnswers;

export default function QuizScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});

  const question = quizQuestions[currentIndex];
  const selectedOptions = answers[question.id] ?? [];
  const canContinue = selectedOptions.length > 0;

  const progressPercent = useMemo(() => {
    return Math.round(((currentIndex + 1) / quizQuestions.length) * 100);
  }, [currentIndex]);

  const toggleOption = (optionId: string) => {
    setAnswers((prev) => {
      const existing = prev[question.id] ?? [];
      if (question.type === 'single') {
        return { ...prev, [question.id]: [optionId] };
      }

      if (existing.includes(optionId)) {
        return {
          ...prev,
          [question.id]: existing.filter((id) => id !== optionId),
        };
      }

      return { ...prev, [question.id]: [...existing, optionId] };
    });
  };

  const handleNext = () => {
    if (currentIndex === quizQuestions.length - 1) {
      navigation.navigate('QuizResult', { answers });
      return;
    }

    setCurrentIndex((prev) => Math.min(prev + 1, quizQuestions.length - 1));
  };

  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.counter}>
          {currentIndex + 1} / {quizQuestions.length}
        </Text>
        <Text style={styles.title}>{question.title}</Text>
        {question.subtitle ? (
          <Text style={styles.subtitle}>{question.subtitle}</Text>
        ) : null}

        <View style={styles.options}>
          {question.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            return (
              <Pressable
                key={option.id}
                onPress={() => toggleOption(option.id)}
                style={[styles.option, isSelected && styles.optionSelected]}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={handleBack} disabled={currentIndex === 0}>
          <Text style={[styles.backText, currentIndex === 0 && styles.backTextDisabled]}>
            Back
          </Text>
        </Pressable>
        <Button
          title={currentIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}
          onPress={handleNext}
          disabled={!canContinue}
        />
      </View>

      {!canContinue && <Text style={styles.helper}>Select at least one option.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
    marginTop: 24,
  },
  counter: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  options: {
    marginTop: 20,
    gap: 12,
  },
  option: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  optionSelected: {
    borderColor: '#111827',
    backgroundColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#111827',
  },
  backTextDisabled: {
    color: '#9ca3af',
  },
  helper: {
    marginTop: 12,
    fontSize: 12,
    color: '#9ca3af',
  },
});

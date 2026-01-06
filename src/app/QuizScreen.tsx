import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

import Button from '../components/Button';
import OptionCard from '../components/OptionCard';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';
import RemoteIllustration from '../components/RemoteIllustration';
import { AGE_IMAGES } from '../lib/assets';
import { QuizInfoStep, QuizQuestionStep, STEPS } from '../lib/questions';
import { resolveAssetUri } from '../lib/resolveAssetUri';
import { submitQuiz } from '../lib/quizSubmit';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

type AnswerValue = string | string[];

type AnswerMap = Record<string, AnswerValue>;

type Phase = 'quiz' | 'analysis' | 'email';

export default function QuizScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const step = useMemo(() => STEPS[index], [index]);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [phase, setPhase] = useState<Phase>('quiz');

  const isQuestion = step.type === 'question';
  const questionStep = isQuestion ? step : null;
  const infoStep = step.type === 'info' ? step : null;
  const totalSteps = STEPS.length + 1;
  const isFinalStep = index === STEPS.length - 1;

  const currentAnswer =
    isQuestion && typeof answers[step.id] !== 'undefined' ? answers[step.id] : undefined;

  const multiSelections =
    isQuestion && step.kind === 'multi' && Array.isArray(currentAnswer) ? currentAnswer : [];

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tipsOptIn, setTipsOptIn] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();
  const isEmailValid = emailRegex.test(trimmedEmail);
  const isNameValid = firstName.trim().length > 0 && lastName.trim().length > 0;
  const isEmailPhase = phase === 'email';
  const isAnalysisPhase = phase === 'analysis';

  const helperText = isEmailPhase
    ? 'Planını mail ile göndererek sonuçlarını saklıyoruz.'
    : step.type === 'question'
    ? step.helper ?? (step.kind === 'multi' ? '(Çoklu seçim yapabilirsin.)' : undefined)
    : undefined;

  const infoTitleAllowed =
    step.type === 'info' &&
    step.title &&
    step.title.trim().length > 0 &&
    step.title.trim().toLowerCase() !== 'bilgilendirme';

  const headingText = isEmailPhase
    ? 'Sonuçlarını görmek için e-posta adresini gir'
    : step.type === 'question'
    ? step.title
    : infoTitleAllowed
    ? step.title
    : null;

  const progressIndex = isEmailPhase ? STEPS.length : index;
  const progressPercent = Math.round(((progressIndex + 1) / totalSteps) * 100);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisMessageIndex, setAnalysisMessageIndex] = useState(0);

  const transitionPhase = useCallback((next: Phase) => {
    setPhase((current) => (current === next ? current : next));
  }, []);

  function goNext() {
    if (!isFinalStep) {
      setIndex((value) => value + 1);
    }
  }

  function handleSingleSelect(optionId: string) {
    if (!isQuestion || step.kind !== 'single') return;
    setAnswers((prev) => ({ ...prev, [step.id]: optionId }));
    goNext();
  }

  function handleMultiToggle(optionId: string) {
    if (!isQuestion || step.kind !== 'multi') return;
    setAnswers((prev) => {
      const existing = prev[step.id];
      const existingArray = Array.isArray(existing) ? existing : [];
      const alreadySelected = existingArray.includes(optionId);
      const nextArray = alreadySelected
        ? existingArray.filter((id) => id !== optionId)
        : [...existingArray, optionId];

      const updated = { ...prev };
      if (nextArray.length === 0) {
        delete updated[step.id];
      } else {
        updated[step.id] = nextArray;
      }
      return updated;
    });
  }

  const finish = useCallback(() => {
    transitionPhase('email');
  }, [transitionPhase]);

  useEffect(() => {
    if (isEmailPhase) return;
    if (step.id === 's40') {
      transitionPhase('analysis');
    } else if (phase !== 'quiz') {
      transitionPhase('quiz');
    }
  }, [step.id, phase, isEmailPhase, transitionPhase]);

  useEffect(() => {
    if (!isAnalysisPhase || step.id !== 's40') return;
    setAnalysisProgress(0);
    setEmail('');
    setTipsOptIn(false);
    setEmailError('');
    setIsSubmittingEmail(false);
    let frame = 0;
    let startTime: number | null = null;
    const duration = 8000;
    let hasCompleted = false;
    let completionTimeout: ReturnType<typeof setTimeout> | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      const percent = Math.round(easedProgress * 100);
      setAnalysisProgress(percent);

      if (percent < 100) {
        frame = requestAnimationFrame(animate);
      } else if (!hasCompleted) {
        hasCompleted = true;
        completionTimeout = setTimeout(() => {
          transitionPhase('email');
        }, 300);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      if (completionTimeout) clearTimeout(completionTimeout);
    };
  }, [isAnalysisPhase, step.id, transitionPhase]);

  useEffect(() => {
    if (!isAnalysisPhase || step.type !== 'info') return;
    setAnalysisMessageIndex(0);
    const interval = setInterval(() => {
      setAnalysisMessageIndex((prev) => (prev + 1) % Math.max(step.body.length, 1));
    }, 1400);
    return () => clearInterval(interval);
  }, [isAnalysisPhase, step]);

  useEffect(() => {
    if (phase !== 'email') return;
    setEmailError('');
  }, [phase]);

  const isGenderQuestion = isQuestion && step.id === 's1';
  const isAgeQuestion = isQuestion && step.id === 's2';

  const shouldShowPrimaryButton =
    phase === 'quiz' && !isFinalStep && (step.type === 'info' || (isQuestion && step.kind === 'multi'));

  const primaryLabel = isFinalStep ? "Quiz'i Bitir" : 'İleri →';

  const hasAnswer =
    !isQuestion
      ? true
      : step.kind === 'multi'
      ? multiSelections.length > 0
      : typeof currentAnswer === 'string' && currentAnswer.length > 0;

  const primaryDisabled =
    isQuestion && (step.kind === 'multi' || isFinalStep) ? !hasAnswer : false;

  function handlePrimaryAction() {
    if (isFinalStep) {
      finish();
    } else {
      goNext();
    }
  }

  async function handleEmailSubmit() {
    if (!trimmedEmail || !isEmailValid) {
      setEmailError('Lütfen geçerli bir e-posta gir.');
      return;
    }
    if (!isNameValid) {
      setEmailError('Lütfen ad ve soyad bilgilerini doldur.');
      return;
    }
    if (isSubmittingEmail) return;
    setIsSubmittingEmail(true);
    setEmailError('');

    try {
      const payload = {
        email: trimmedEmail,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        answers,
        tipsOptIn: tipsOptIn ? true : undefined,
      };

      const submissionId = await submitQuiz(payload);
      navigation.navigate('Result', { id: submissionId });
    } catch (error) {
      setEmailError('Bir şeyler ters gitti. Lütfen tekrar dene.');
    } finally {
      setIsSubmittingEmail(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <ProgressBar
        current={isEmailPhase ? totalSteps : index + 1}
        total={totalSteps}
        percent={progressPercent}
      />

      <QuizCard>
        {(headingText || helperText) && (
          <View style={styles.headingBlock}>
            {headingText ? <Text style={styles.title}>{headingText}</Text> : null}
            {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
          </View>
        )}

        {isEmailPhase ? (
          <EmailCaptureStep
            email={email}
            firstName={firstName}
            lastName={lastName}
            onEmailChange={(value) => {
              setEmail(value);
              if (emailError) setEmailError('');
            }}
            onFirstNameChange={(value) => {
              setFirstName(value);
              if (emailError) setEmailError('');
            }}
            onLastNameChange={(value) => {
              setLastName(value);
              if (emailError) setEmailError('');
            }}
            optIn={tipsOptIn}
            onOptInChange={setTipsOptIn}
            onSubmit={handleEmailSubmit}
            isValid={isEmailValid && isNameValid}
            isSubmitting={isSubmittingEmail}
            errorMessage={emailError}
          />
        ) : isAnalysisPhase && infoStep ? (
          <AnalysisStep step={infoStep} progress={analysisProgress} messageIndex={analysisMessageIndex} />
        ) : infoStep ? (
          <InfoStep step={infoStep} />
        ) : isAgeQuestion && questionStep ? (
          <AgeOptionGrid
            step={questionStep}
            selectedId={typeof currentAnswer === 'string' ? currentAnswer : undefined}
            onSelect={handleSingleSelect}
          />
        ) : isGenderQuestion && questionStep ? (
          <GenderOptionList
            step={questionStep}
            selectedId={typeof currentAnswer === 'string' ? currentAnswer : undefined}
            onSelect={handleSingleSelect}
          />
        ) : questionStep ? (
          <QuestionStep
            step={questionStep}
            currentAnswer={currentAnswer}
            multiSelections={multiSelections}
            onSingleSelect={handleSingleSelect}
            onMultiToggle={handleMultiToggle}
          />
        ) : null}

        {shouldShowPrimaryButton && (
          <View style={styles.primaryButtonRow}>
            <Button title={primaryLabel} onPress={handlePrimaryAction} disabled={primaryDisabled} />
          </View>
        )}
      </QuizCard>
    </ScrollView>
  );
}

function QuestionStep({
  step,
  currentAnswer,
  multiSelections,
  onSingleSelect,
  onMultiToggle,
}: {
  step: QuizQuestionStep;
  currentAnswer?: AnswerValue;
  multiSelections: string[];
  onSingleSelect: (id: string) => void;
  onMultiToggle: (id: string) => void;
}) {
  return (
    <View style={styles.options}>
      {step.options.map((option) => {
        const isSelected =
          step.kind === 'multi' ? multiSelections.includes(option.id) : currentAnswer === option.id;
        return (
          <OptionCard
            key={option.id}
            onPress={() =>
              step.kind === 'multi' ? onMultiToggle(option.id) : onSingleSelect(option.id)
            }
            selected={isSelected}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
              {option.label}
            </Text>
          </OptionCard>
        );
      })}
    </View>
  );
}

const GENDER_ICONS: Record<string, string> = {
  erkek: '👨',
  kadın: '👩',
};

function GenderOptionList({
  step,
  selectedId,
  onSelect,
}: {
  step: QuizQuestionStep;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.genderList}>
      {step.options.map((option) => {
        const isSelected = selectedId === option.id;
        const icon = GENDER_ICONS[option.label.toLowerCase()] ?? '🙂';
        return (
          <OptionCard
            key={option.id}
            onPress={() => onSelect(option.id)}
            selected={isSelected}
            style={[styles.genderOption, isSelected && styles.genderOptionSelected]}
          >
            <Text style={styles.genderIcon}>{icon}</Text>
            <Text style={[styles.genderLabel, isSelected && styles.genderLabelSelected]}>
              {option.label}
            </Text>
          </OptionCard>
        );
      })}
    </View>
  );
}

function AgeOptionGrid({
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
        const displayLabel = option.label.replace(/-/g, '–');
        const imageUri = AGE_IMAGES[index % AGE_IMAGES.length];
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            style={[styles.ageCard, isSelected && styles.ageCardSelected]}
          >
            <RemoteIllustration uri={imageUri} width={96} height={96} context={`age-${index + 1}`} />
            <View style={[styles.agePill, isSelected && styles.agePillSelected]}>
              <Text style={[styles.agePillText, isSelected && styles.agePillTextSelected]}>
                Yaş: {displayLabel}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function InfoStep({ step }: { step: QuizInfoStep }) {
  return renderInfoContent(step);
}

function AnalysisStep({
  step,
  progress,
  messageIndex,
}: {
  step: QuizInfoStep;
  progress: number;
  messageIndex: number;
}) {
  return renderInfoContent(step, { analysisProgress: progress, analysisMessageIndex: messageIndex });
}

function EmailCaptureStep({
  email,
  firstName,
  lastName,
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  optIn,
  onOptInChange,
  onSubmit,
  isValid,
  isSubmitting,
  errorMessage,
}: {
  email: string;
  firstName: string;
  lastName: string;
  onEmailChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  optIn: boolean;
  onOptInChange: (value: boolean) => void;
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
}) {
  return (
    <View style={styles.emailContainer}>
      <Text style={styles.infoText}>
        Sonuçlarını sana özel bağlantı ile göndereceğiz ve hesabında tutacağız. E-postanı gir,
        planını hemen görelim.
      </Text>
      <View style={styles.inputGroup}>
        <View style={styles.rowInputs}>
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Adın</Text>
            <TextInput
              value={firstName}
              onChangeText={onFirstNameChange}
              placeholder="Ad"
              style={styles.input}
            />
          </View>
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Soyadın</Text>
            <TextInput
              value={lastName}
              onChangeText={onLastNameChange}
              placeholder="Soyad"
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>E-posta adresin</Text>
          <TextInput
            value={email}
            onChangeText={onEmailChange}
            placeholder="ornek@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <Pressable style={styles.checkboxRow} onPress={() => onOptInChange(!optIn)}>
          <View style={[styles.checkbox, optIn && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>İpuçları ve güncellemeleri bana gönder.</Text>
        </Pressable>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Button
          title={isSubmitting ? 'Gönderiliyor...' : 'Planımı Göster'}
          onPress={onSubmit}
          disabled={!isValid || isSubmitting}
        />
      </View>
    </View>
  );
}

function renderInfoContent(
  step: QuizInfoStep,
  extras?: { analysisProgress: number; analysisMessageIndex: number }
) {
  const imageUri = resolveAssetUri(step.image);
  const imageEl = imageUri ? (
    <View style={styles.infoImageWrapper}>
      <RemoteIllustration uri={imageUri} width={140} height={140} borderRadius={20} context={step.id} />
    </View>
  ) : null;

  if (step.id === 's5') {
    return (
      <View style={styles.infoBlock}>
        {imageEl}
        <View style={styles.infoList}>
          <Text style={styles.infoText}>
            <Text style={styles.infoStrong}>Dopamin etkisi:</Text> {step.body[0]}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoStrong}>Beynin ikna gücü:</Text> {step.body[1]}
          </Text>
        </View>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>{step.body[2]}</Text>
        </View>
      </View>
    );
  }

  if (step.id === 's11') {
    const [, ...rest] = step.body;
    return (
      <View style={styles.infoBlock}>
        {imageEl}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Şehir efsanesi: Sigara içmek rahatlatıcıdır.{' '}
            <Text style={styles.warningTextStrong}>YANLIŞ</Text>
          </Text>
        </View>
        <View style={styles.infoList}>
          {rest.map((paragraph, idx) => (
            <Text key={`${step.id}-list-${idx}`} style={styles.infoText}>
              • {paragraph}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  if (step.id === 's18') {
    return (
      <View style={styles.infoBlock}>
        {imageEl}
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>En önemli faktör, kendini değiştirmek istemen.</Text>
          <Text style={styles.infoText}>Hipnoz, bu kararının arkasındaki gücü harekete geçirir.</Text>
        </View>
      </View>
    );
  }

  if (step.id === 's24' || step.id === 's25') {
    const timeline = step.body.map((entry) => {
      const [label, text] = entry.split('||');
      return {
        label: label?.trim() ?? '',
        text: text?.trim() ?? '',
      };
    });

    return (
      <View style={styles.infoBlock}>
        {imageEl}
        <View style={styles.timelineList}>
          {timeline.map((item) => (
            <View key={item.label} style={styles.timelineCard}>
              <Text style={styles.timelineLabel}>{item.label}</Text>
              <Text style={styles.infoText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (step.id === 's28') {
    return (
      <View style={styles.infoBlock}>
        {imageEl}
        <View style={styles.gridTwo}>
          <View style={styles.warningCard}>
            <Text style={styles.warningLabel}>ORTALAMA DENEME</Text>
            <Text style={styles.warningValue}>30+</Text>
            <Text style={styles.infoText}>{step.body[0]}</Text>
          </View>
          <View style={styles.successCard}>
            <Text style={styles.successLabel}>BAŞARI OLASILIĞI</Text>
            <Text style={styles.successValue}>10 kat</Text>
            <Text style={styles.infoText}>{step.body[1]}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (step.id === 's34') {
    const whatYouGet = [
      'Günlük hipnoterapi sesleri ve mikro görevler',
      'Tetikleyici haritalama ve nefes egzersizleri',
      'İlerlemeyi takip eden koç ve topluluk',
    ];
    const whyItWorks = [
      'Beynin sigarayla kurduğu otomatik bağı yeniden yazar.',
      'Davranış bilimi ve hipnoterapi birlikte çalışır.',
      'Destek topluluğu motivasyonu diri tutar.',
    ];

    return (
      <View style={styles.infoBlock}>
        {imageEl}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabelAccent}>NE ELDE EDERSİN</Text>
          {whatYouGet.map((item) => (
            <Text key={item} style={styles.infoText}>
              • {item}
            </Text>
          ))}
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabelWarning}>NEDEN İŞE YARAR</Text>
          {whyItWorks.map((item) => (
            <Text key={item} style={styles.infoText}>
              • {item}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  if (step.id === 's35') {
    const modules = [
      'Hipnoz kayıtları ve nefes egzersizleri',
      'Tetikleyici görevleri ve davranış alıştırmaları',
      'Koç yorumları ve ilerleme raporları',
    ];
    const socialProof = [
      'Gerçek kullanıcı deneyimlerinden beslenen içerik',
      'Uzman ekip tarafından düzenli güncellemeler',
    ];

    return (
      <View style={styles.infoBlock}>
        {imageEl}
        <View style={styles.highlightCardLarge}>
          <Text style={styles.highlightLabelWarm}>PROGRAM PAKETİ</Text>
          {modules.map((item) => (
            <Text key={item} style={styles.infoText}>
              • {item}
            </Text>
          ))}
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabelAccent}>GÜVEN VEREN UNSURLAR</Text>
          {socialProof.map((item) => (
            <Text key={item} style={styles.infoText}>
              • {item}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  if (step.id === 's37') {
    const phases = step.body.map((entry) => {
      const [label, text] = entry.split(':');
      return { label: label?.trim() ?? '', text: text?.trim() ?? '' };
    });

    return (
      <View style={styles.infoBlock}>
        {imageEl}
        <View style={styles.timelineList}>
          {phases.map((phase) => (
            <View key={phase.label} style={styles.timelineCard}>
              <Text style={styles.timelineLabelAccent}>{phase.label}</Text>
              <Text style={styles.infoText}>{phase.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (step.id === 's40' && extras) {
    const { analysisProgress, analysisMessageIndex } = extras;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (analysisProgress / 100) * circumference;

    return (
      <View style={styles.analysisContainer}>
        <Svg width={160} height={160}>
          <Circle
            cx={80}
            cy={80}
            r={radius}
            stroke={colors.progressTrack}
            strokeWidth={10}
            fill="transparent"
          />
          <Circle
            cx={80}
            cy={80}
            r={radius}
            stroke={colors.accent}
            strokeWidth={10}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
          <SvgText
            x={80}
            y={92}
            fontSize={typography.analysisPercent}
            fill={colors.accent}
            fontWeight="700"
            textAnchor="middle"
          >
            {analysisProgress}%
          </SvgText>
        </Svg>
        <View style={styles.analysisMessages}>
          {step.body.map((message, idx) => (
            <Text
              key={`${step.id}-msg-${idx}`}
              style={[styles.analysisMessage, idx === analysisMessageIndex && styles.analysisMessageActive]}
            >
              {message}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.infoBlock}>
      {imageEl}
      {step.body.length > 0 && (
        <View style={styles.infoList}>
          {step.body.map((paragraph, idx) => (
            <Text key={`${step.id}-body-${idx}`} style={styles.infoText}>
              {paragraph}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  headingBlock: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '600',
    color: '#0c0d09',
    marginBottom: 4,
  },
  helper: {
    fontSize: typography.subtitle,
    color: colors.muted,
  },
  options: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  optionText: {
    fontSize: typography.option,
    color: '#11130f',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#11130f',
  },
  primaryButtonRow: {
    alignItems: 'flex-end',
    marginTop: spacing.lg,
  },
  genderList: {
    gap: spacing.lg,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.optionBorder,
    borderRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: colors.panel,
  },
  genderOptionSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(15, 76, 58, 0.05)',
    shadowColor: 'rgba(15, 76, 58, 0.12)',
    shadowOpacity: 1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  genderIcon: {
    fontSize: typography.emoji,
  },
  genderLabel: {
    fontSize: typography.optionLarge,
    color: '#11130f',
    fontWeight: '600',
  },
  genderLabelSelected: {
    color: '#11130f',
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  ageCard: {
    width: '47%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.optionBorder,
    borderRadius: 24,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.panel,
  },
  ageCardSelected: {
    borderColor: colors.accent,
    shadowColor: colors.accentShadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  agePill: {
    marginTop: spacing.lg,
    borderRadius: 16,
    backgroundColor: '#f5f6f0',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  agePillSelected: {
    backgroundColor: colors.accent,
  },
  agePillText: {
    fontSize: typography.subtitle,
    color: '#0f110d',
    fontWeight: '600',
  },
  agePillTextSelected: {
    color: '#ffffff',
  },
  infoBlock: {
    gap: spacing.lg,
  },
  infoImageWrapper: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoList: {
    gap: spacing.md,
  },
  infoText: {
    fontSize: typography.body,
    color: colors.muted,
    lineHeight: 20,
  },
  infoStrong: {
    fontWeight: '600',
    color: colors.accent,
  },
  highlightBox: {
    backgroundColor: colors.highlightBg,
    padding: spacing.lg,
    borderRadius: 16,
  },
  highlightText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.highlightText,
  },
  warningBox: {
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    padding: spacing.lg,
    borderRadius: 16,
  },
  warningText: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  warningTextStrong: {
    color: colors.warningText,
    fontWeight: '700',
  },
  successBox: {
    backgroundColor: colors.successBg,
    padding: spacing.lg,
    borderRadius: 16,
    gap: spacing.sm,
  },
  successTitle: {
    color: colors.successText,
    fontWeight: '600',
    fontSize: typography.body,
  },
  timelineList: {
    gap: spacing.md,
  },
  timelineCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
  },
  timelineLabel: {
    fontWeight: '600',
    color: colors.warningText,
    marginBottom: spacing.xs,
  },
  timelineLabelAccent: {
    fontWeight: '600',
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  gridTwo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  warningCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 16,
    backgroundColor: colors.warningBg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  warningLabel: {
    fontSize: 11,
    letterSpacing: 3.3,
    color: colors.warningText,
    fontWeight: '600',
  },
  warningValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.warningText,
  },
  successCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 16,
    backgroundColor: colors.successBg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  successLabel: {
    fontSize: 11,
    letterSpacing: 3.3,
    color: colors.successText,
    fontWeight: '600',
  },
  successValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.successText,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionLabelAccent: {
    fontSize: 11,
    letterSpacing: 3.3,
    color: colors.accent,
    fontWeight: '600',
  },
  sectionLabelWarning: {
    fontSize: 11,
    letterSpacing: 3.3,
    color: colors.warningText,
    fontWeight: '600',
  },
  highlightCardLarge: {
    borderRadius: 16,
    backgroundColor: colors.highlightBg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  highlightLabelWarm: {
    fontSize: 11,
    letterSpacing: 3.3,
    color: '#b7791f',
    fontWeight: '600',
  },
  analysisContainer: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  analysisMessages: {
    gap: spacing.sm,
  },
  analysisMessage: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: 'center',
    opacity: 0.7,
  },
  analysisMessageActive: {
    color: colors.accent,
    fontWeight: '600',
    opacity: 1,
  },
  emailContainer: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.md,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  inputLabel: {
    fontSize: typography.label,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.option,
    color: colors.text,
    backgroundColor: colors.panel,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.panel,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxLabel: {
    fontSize: typography.subtitle,
    color: colors.muted,
    flex: 1,
  },
  errorText: {
    fontSize: typography.subtitle,
    color: colors.warningText,
    fontWeight: '500',
  },
});

import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import QuizCard from '../components/QuizCard';
import RemoteIllustration from '../components/RemoteIllustration';
import TextField from '../components/TextField';
import { resolveAssetUri } from '../lib/resolveAssetUri';
import { getSupabase } from '../lib/supabase';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEBUG_LOGS = process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true';

const redactEmail = (value: string) => {
  const [name, domain] = value.split('@');
  if (!domain) return 'unknown';
  const safeName = name.length <= 2 ? `${name[0] ?? ''}*` : `${name.slice(0, 2)}***`;
  return `${safeName}@${domain}`;
};

export default function QuizResultScreen({ navigation, route }: Props) {
  const sparkUri = resolveAssetUri('/illustrations/spark.svg');
  const answers = route.params?.answers ?? {};
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      Alert.alert('Hata', 'Ad en az 2 karakter olmalı.');
      return;
    }

    const trimmedSurname = surname.trim();
    if (trimmedSurname.length < 2) {
      Alert.alert('Hata', 'Soyad en az 2 karakter olmalı.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi gir.');
      return;
    }

    const client = getSupabase();
    if (!client) {
      if (DEBUG_LOGS) {
        console.warn('QuizResult submit: Supabase client missing');
      }
      Alert.alert('Hata', 'Uygulama yapılandırması eksik. Lütfen tekrar deneyin.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (DEBUG_LOGS) {
        const { data, error } = await client.auth.getSession();
        console.log('QuizResult submit: session before insert', {
          email: redactEmail(normalizedEmail),
          hasSession: Boolean(data?.session),
          sessionEmail: redactEmail(data?.session?.user?.email ?? ''),
          sessionError: error?.message ?? null,
          answersCount: Object.keys(answers).length,
        });
        console.log('QuizResult submit: OTP will be requested if no session');
      }
      const { error } = await client.from('quiz_submissions').insert({
        name: trimmedName,
        surname: trimmedSurname,
        email: normalizedEmail,
        answers,
        source: 'mobile',
        quiz_version: 'v1',
      });

      if (error) {
        throw new Error(error.message);
      }
      if (DEBUG_LOGS) {
        console.log('QuizResult submit: quiz_submissions insert ok', {
          email: redactEmail(normalizedEmail),
        });
      }

      await AsyncStorage.setItem('onboardingComplete', 'true');
      await AsyncStorage.setItem('leadEmail', normalizedEmail);
      await AsyncStorage.setItem('leadName', trimmedName);
      await AsyncStorage.setItem('leadSurname', trimmedSurname);

      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (DEBUG_LOGS) {
        console.log('QuizResult submit: session after insert', {
          hasSession: Boolean(sessionData?.session),
          sessionError: sessionError?.message ?? null,
        });
      }
      if (!sessionData?.session) {
        const { error: otpError } = await client.auth.signInWithOtp({
          email: normalizedEmail,
          options: { shouldCreateUser: true },
        });
        if (DEBUG_LOGS) {
          console.log('QuizResult submit: OTP send response', {
            email: redactEmail(normalizedEmail),
            error: otpError?.message ?? null,
          });
        }
        if (otpError) {
          throw new Error(otpError.message);
        }
        navigation.navigate('Login', { prefillEmail: normalizedEmail, codeSent: true });
        return;
      }

      if (DEBUG_LOGS) {
        console.log('QuizResult submit: navigation reset to Gate');
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Gate' }],
      });
    } catch (error) {
      if (DEBUG_LOGS) {
        if (error instanceof Error) {
          console.error('QuizResult submit failed', { message: error.message, stack: error.stack });
        } else {
          console.error('QuizResult submit failed', { error });
        }
      }
      const message = error instanceof Error ? error.message : 'Bir hata oluştu.';
      Alert.alert('Hata', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <QuizCard>
        <View style={styles.header}>
          <View style={styles.illustrationWrap}>
            {sparkUri ? (
              <RemoteIllustration uri={sparkUri} width={140} height={140} borderRadius={28} />
            ) : null}
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Analiz</Text>
          </View>
          <Text style={styles.title}>Sigarayı bırakma profilin hazır</Text>
          <Text style={styles.subtitle}>
            Yanıtlarını analiz ettik ve sana özel bırakma planını hazırladık. Başlamaya hazırsın.
          </Text>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.profileLabel}>Sigarayı bırakma profilin</Text>
          <View style={styles.profileChip}>
            <Text style={styles.profileChipText}>Haz Arayan</Text>
          </View>
          <View style={styles.bulletList}>
            <View style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Tetikleyicilerin çoğu otomatik alışkanlık döngülerinden geliyor.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                İstek dalgası 3–7 dakika sürüyor; doğru teknikle kontrol edilebilir.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                Kısa ödüller yerine kalıcı motivasyon kurmak kritik.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Bu analiz bir teşhis değildir; alışkanlık örüntülerini anlamana yardımcı olur.
          </Text>
        </View>

        <Text style={styles.formIntro}>
          Sonuçlarını kaydetmek ve planını başlatmak için bilgilerini gir.
        </Text>

        <View style={styles.form}>
          <TextField
            value={name}
            placeholder="Ad"
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextField
            value={surname}
            placeholder="Soyad"
            onChangeText={setSurname}
            autoCapitalize="words"
          />
          <TextField
            value={email}
            placeholder="E-posta"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Pressable
          style={[styles.primaryButton, isSubmitting && styles.primaryDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.primaryText}>{isSubmitting ? 'Gönderiliyor...' : 'Devam et'}</Text>
        </Pressable>
        </QuizCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.xxxl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.tagBackground,
  },
  badgeText: {
    fontSize: typography.label,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.subtitle,
    color: colors.muted,
    lineHeight: 22,
    textAlign: 'center',
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.tagBackground,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  profileLabel: {
    fontSize: typography.label,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.muted,
    fontWeight: '700',
  },
  profileChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  profileChipText: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 1,
  },
  bulletList: {
    gap: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginTop: 8,
    backgroundColor: colors.accent,
  },
  bulletText: {
    flex: 1,
    fontSize: typography.subtitle,
    color: colors.text,
    lineHeight: 22,
  },
  disclaimer: {
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  disclaimerText: {
    fontSize: typography.label,
    color: colors.muted,
    lineHeight: 18,
    textAlign: 'center',
  },
  formIntro: {
    fontSize: typography.subtitle,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.primaryButton,
    borderRadius: 999,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  primaryDisabled: {
    opacity: 0.6,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
  },
});

import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getSupabase } from '../lib/supabase';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEBUG_LOGS = process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true';

const redactEmail = (value: string) => {
  const [name, domain] = value.split('@');
  if (!domain) return 'unknown';
  const safeName = name.length <= 2 ? `${name[0] ?? ''}*` : `${name.slice(0, 2)}***`;
  return `${safeName}@${domain}`;
};

export default function LoginScreen({ navigation, route }: Props) {
  const initialEmail = route.params?.prefillEmail ?? '';
  const initialCodeSent = Boolean(route.params?.codeSent);
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(initialCodeSent);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (initialCodeSent) {
      setCodeSent(true);
    }
  }, [initialCodeSent]);

  const handleSendCode = async () => {
    if (isSending) return;
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi gir.');
      return;
    }

    const client = getSupabase();
    if (!client) {
      if (DEBUG_LOGS) {
        console.warn('Login send code: Supabase client missing');
      }
      Alert.alert('Hata', 'Uygulama yapılandırması eksik. Lütfen tekrar deneyin.');
      return;
    }

    setIsSending(true);
    try {
      if (DEBUG_LOGS) {
        const { data, error } = await client.auth.getSession();
        console.log('Login send code: session before OTP', {
          email: redactEmail(normalizedEmail),
          hasSession: Boolean(data?.session),
          sessionEmail: redactEmail(data?.session?.user?.email ?? ''),
          sessionError: error?.message ?? null,
          shouldCreateUser: true,
          emailRedirectTo: null,
        });
      }
      const { error } = await client.auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: true },
      });
      if (DEBUG_LOGS) {
        console.log('Login send code: OTP response', {
          email: redactEmail(normalizedEmail),
          error: error?.message ?? null,
        });
      }
      if (error) {
        throw new Error(error.message);
      }
      setCodeSent(true);
      Alert.alert('Kod gönderildi', 'E-posta adresini kontrol et.');
    } catch (error) {
      if (DEBUG_LOGS) {
        if (error instanceof Error) {
          console.error('Login send code failed', { message: error.message, stack: error.stack });
        } else {
          console.error('Login send code failed', { error });
        }
      }
      const message = error instanceof Error ? error.message : 'Kod gönderilemedi.';
      Alert.alert('Hata', message);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (isVerifying) return;
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi gir.');
      return;
    }
    const normalizedCode = code.trim();
    if (normalizedCode.length < 6) {
      Alert.alert('Hata', 'Kod en az 6 haneli olmalı.');
      return;
    }

    const client = getSupabase();
    if (!client) {
      if (DEBUG_LOGS) {
        console.warn('Login verify code: Supabase client missing');
      }
      Alert.alert('Hata', 'Uygulama yapılandırması eksik. Lütfen tekrar deneyin.');
      return;
    }

    setIsVerifying(true);
    try {
      if (DEBUG_LOGS) {
        const { data, error } = await client.auth.getSession();
        console.log('Login verify code: session before verify', {
          email: redactEmail(normalizedEmail),
          hasSession: Boolean(data?.session),
          sessionEmail: redactEmail(data?.session?.user?.email ?? ''),
          sessionError: error?.message ?? null,
        });
      }
      const { error } = await client.auth.verifyOtp({
        email: normalizedEmail,
        token: normalizedCode,
        type: 'email',
      });
      if (DEBUG_LOGS) {
        console.log('Login verify code: OTP verify response', {
          email: redactEmail(normalizedEmail),
          error: error?.message ?? null,
        });
      }
      if (error) {
        throw new Error(error.message);
      }
      Alert.alert('Başarılı', 'Giriş yapıldı.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Gate' }],
      });
    } catch (error) {
      if (DEBUG_LOGS) {
        if (error instanceof Error) {
          console.error('Login verify code failed', { message: error.message, stack: error.stack });
        } else {
          console.error('Login verify code failed', { error });
        }
      }
      const message = error instanceof Error ? error.message : 'Giriş başarısız.';
      Alert.alert('Hata', message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>E-posta adresin</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {codeSent ? (
            <>
              <Text style={styles.label}>Kod</Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                placeholder="6 haneli kod"
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={8}
              />
            </>
          ) : null}
          <Pressable
            style={styles.submit}
            onPress={codeSent ? handleVerifyCode : handleSendCode}
            disabled={isSending || isVerifying}
          >
            <Text style={styles.submitText}>
              {codeSent ? (isVerifying ? 'Giriş yapılıyor...' : 'Giriş yap') : isSending ? 'Gönderiliyor...' : 'Kod gönder'}
            </Text>
          </Pressable>
          {codeSent ? (
            <Pressable style={styles.resend} onPress={handleSendCode} disabled={isSending}>
              <Text style={styles.resendText}>{isSending ? 'Gönderiliyor...' : 'Kodu tekrar gönder'}</Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.secondary} onPress={() => navigation.navigate('Quiz')}>
            <Text style={styles.secondaryText}>Üye değilim, quize geç</Text>
          </Pressable>
        </View>
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
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xxl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    elevation: 6,
  },
  label: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    backgroundColor: '#fdfdfb',
  },
  submit: {
    marginTop: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.primaryButton,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 1,
  },
  resend: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  resendText: {
    color: colors.accent,
    fontSize: typography.body - 1,
    textDecorationLine: 'underline',
  },
  secondary: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  secondaryText: {
    color: colors.muted,
    fontSize: typography.body - 1,
    textDecorationLine: 'underline',
  },
});

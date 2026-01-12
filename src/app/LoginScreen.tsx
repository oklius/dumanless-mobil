import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getSupabase } from '../lib/supabase';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendCode = async () => {
    if (isSending) return;
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi gir.');
      return;
    }

    const client = getSupabase();
    if (!client) {
      Alert.alert('Hata', 'Uygulama yapılandırması eksik. Lütfen tekrar deneyin.');
      return;
    }

    setIsSending(true);
    try {
      const { error } = await client.auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: true },
      });
      if (error) {
        throw new Error(error.message);
      }
      setCodeSent(true);
      Alert.alert('Kod gönderildi', 'E-posta adresini kontrol et.');
    } catch (error) {
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
      Alert.alert('Hata', 'Uygulama yapılandırması eksik. Lütfen tekrar deneyin.');
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await client.auth.verifyOtp({
        email: normalizedEmail,
        token: normalizedCode,
        type: 'email',
      });
      if (error) {
        throw new Error(error.message);
      }
      Alert.alert('Başarılı', 'Giriş yapıldı.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Gate' }],
      });
    } catch (error) {
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

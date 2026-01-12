import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import QuizCard from '../components/QuizCard';
import TextField from '../components/TextField';
import { getSupabase } from '../lib/supabase';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function QuizResultScreen({ navigation, route }: Props) {
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
      Alert.alert('Hata', 'Uygulama yapılandırması eksik. Lütfen tekrar deneyin.');
      return;
    }

    setIsSubmitting(true);
    try {
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

      await AsyncStorage.setItem('onboardingComplete', 'true');
      await AsyncStorage.setItem('leadEmail', normalizedEmail);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Hub' }],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu.';
      Alert.alert('Hata', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <QuizCard>
        <Text style={styles.title}>Quiz tamamlandı</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxxl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
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

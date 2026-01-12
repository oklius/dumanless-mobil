import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { fetchEntitlementForEmail } from '../lib/entitlement';
import { getSupabase } from '../lib/supabase';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Gate'>;

type GateState = 'loading' | 'no-access';

export default function AccessGateScreen({ navigation }: Props) {
  const [state, setState] = useState<GateState>('loading');

  const checkAccess = useCallback(async () => {
    setState('loading');
    try {
      const client = getSupabase();
      if (!client) {
        Alert.alert('Hata', 'Uygulama yapılandırması eksik. Lütfen tekrar deneyin.');
        setState('no-access');
        return;
      }

      const { data, error } = await client.auth.getSession();
      if (error) {
        throw new Error(error.message);
      }

      const session = data.session;
      if (!session) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
        return;
      }

      const email = session.user.email;
      if (!email) {
        throw new Error('Kullanıcı e-postası bulunamadı.');
      }

      const entitlement = await fetchEntitlementForEmail(email);
      if (entitlement?.status === 'active') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Hub' }],
        });
        return;
      }

      setState('no-access');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu.';
      Alert.alert('Hata', message);
      setState('no-access');
    }
  }, [navigation]);

  useEffect(() => {
    void checkAccess();
  }, [checkAccess]);

  if (state === 'loading') {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingTitle}>Erişim kontrol ediliyor</Text>
          <Text style={styles.loadingBody}>Lütfen birkaç saniye bekle.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Satın alma bulunamadı</Text>
        <Text style={styles.body}>
          Web üzerinden satın aldıysan, aynı e-posta ile giriş yaptığından emin ol.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Quiz')}>
          <Text style={styles.primaryText}>Quize geç</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={checkAccess}>
          <Text style={styles.secondaryText}>Tekrar dene</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  card: {
    width: '100%',
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
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  loadingBody: {
    fontSize: typography.body,
    color: colors.muted,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    fontSize: typography.subtitle,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.primaryButton,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    width: '100%',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 1,
  },
  secondaryButton: {
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
});

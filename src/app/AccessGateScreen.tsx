import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Purchases from 'react-native-purchases';

import { fetchEntitlementForEmail } from '../lib/entitlement';
import { setMembershipStatus } from '../lib/membership';
import { getSupabase } from '../lib/supabase';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Gate'>;

type GateState = 'loading' | 'no-access';
const DEBUG_LOGS = process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true';
const RC_ENTITLEMENT_ID = process.env.EXPO_PUBLIC_RC_ENTITLEMENT_ID ?? 'pro';

const redactEmail = (value?: string | null) => {
  if (!value) return 'unknown';
  const [name, domain] = value.split('@');
  if (!domain) return 'unknown';
  const safeName = name.length <= 2 ? `${name[0] ?? ''}*` : `${name.slice(0, 2)}***`;
  return `${safeName}@${domain}`;
};

export default function AccessGateScreen({ navigation, route }: Props) {
  const [state, setState] = useState<GateState>('loading');
  const forcedPaywall = Boolean(route.params?.forcedPaywall);

  const checkAccess = useCallback(async () => {
    setState('loading');
    try {
      const client = getSupabase();
      if (!client) {
        if (DEBUG_LOGS) {
          console.warn('AccessGate: Supabase client missing');
        }
        Alert.alert('Hata', 'Uygulama yapılandırması eksik. Lütfen tekrar deneyin.');
        setState('no-access');
        return;
      }

      const { data, error } = await client.auth.getSession();
      if (error) {
        throw new Error(error.message);
      }

      const session = data.session;
      if (DEBUG_LOGS) {
        console.log('AccessGate: session check', {
          hasSession: Boolean(session),
          email: redactEmail(session?.user?.email ?? null),
          userId: session?.user?.id ?? null,
        });
      }
      if (!session) {
        if (DEBUG_LOGS) {
          console.warn('AccessGate: no session, redirecting to Welcome');
        }
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
      const webActive = entitlement?.status === 'active';
      let rcActive = false;
      let rcEntitlements: string[] = [];

      if (Platform.OS === 'ios') {
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          rcEntitlements = Object.keys(customerInfo.entitlements.active ?? {});
          rcActive = Boolean(customerInfo.entitlements.active?.[RC_ENTITLEMENT_ID]);
        } catch (error) {
          if (DEBUG_LOGS) {
            console.warn('AccessGate: RevenueCat getCustomerInfo failed', error);
          }
        }
      }

      const isActiveMember = webActive || rcActive;
      await setMembershipStatus({
        isActive: isActiveMember,
        source: webActive ? 'web' : rcActive ? 'revenuecat' : 'none',
      });
      if (DEBUG_LOGS) {
        console.log('AccessGate: entitlement result', {
          email: redactEmail(email),
          status: entitlement?.status ?? null,
          plan: entitlement?.plan ?? null,
          rcEntitlements,
          rcActive,
        });
      }
      if (isActiveMember) {
        if (DEBUG_LOGS) {
          console.log('AccessGate: entitlement active, redirecting to Hub');
        }
        navigation.reset({
          index: 0,
          routes: [{ name: 'Hub' }],
        });
        return;
      }

      if (forcedPaywall) {
        if (DEBUG_LOGS) {
          console.warn('AccessGate: forced paywall for non-member');
        }
        setState('no-access');
        return;
      }

      if (DEBUG_LOGS) {
        console.log('AccessGate: non-member, allowing Hub');
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Hub' }],
      });
    } catch (error) {
      if (DEBUG_LOGS) {
        if (error instanceof Error) {
          console.error('AccessGate failed', { message: error.message, stack: error.stack });
        } else {
          console.error('AccessGate failed', { error });
        }
      }
      const message = error instanceof Error ? error.message : 'Bir hata oluştu.';
      Alert.alert('Hata', message);
      setState('no-access');
    }
  }, [forcedPaywall, navigation]);

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
        {forcedPaywall ? (
          <Pressable
            style={styles.secondaryButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Hub' }],
              })
            }
          >
            <Text style={styles.secondaryText}>Devam et</Text>
          </Pressable>
        ) : null}
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

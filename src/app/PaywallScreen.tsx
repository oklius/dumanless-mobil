import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Purchases, { type PurchasesPackage, PURCHASES_ERROR_CODE } from 'react-native-purchases';

import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

const RC_ENTITLEMENT_ID = process.env.EXPO_PUBLIC_RC_ENTITLEMENT_ID ?? 'pro';

export default function PaywallScreen({ navigation }: Props) {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const loadOfferings = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current ?? null;
      const availablePackages = current?.availablePackages ?? [];
      setPackages(availablePackages);
      if (!availablePackages.length) {
        setLoadError('Offer bulunamadı.');
      }
    } catch (error) {
      Alert.alert(
        'Bilgi',
        'RevenueCat paywall requires TestFlight/EAS build. Expo Go may not support purchases.',
      );
      setLoadError('Offer bulunamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Bilgi', 'Satın alma yalnızca iOS cihazlarda kullanılabilir.');
      navigation.goBack();
      return;
    }
    void loadOfferings();
  }, [navigation]);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    if (isPurchasing) return;
    setIsPurchasing(true);
    try {
      const purchaseResult = await Purchases.purchasePackage(pkg);
      const customerInfo = purchaseResult.customerInfo ?? (await Purchases.getCustomerInfo());
      const isActive = Boolean(customerInfo.entitlements.active?.[RC_ENTITLEMENT_ID]);
      if (isActive) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Gate' }],
        });
        return;
      }
      Alert.alert('Hata', 'Üyelik doğrulanamadı. Lütfen tekrar dene.');
    } catch (error) {
      const code = typeof error === 'object' && error && 'code' in error ? (error as any).code : null;
      if (code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        return;
      }
      const message = error instanceof Error ? error.message : 'Satın alma başarısız oldu.';
      Alert.alert('Hata', message);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    if (isRestoring) return;
    setIsRestoring(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isActive = Boolean(customerInfo.entitlements.active?.[RC_ENTITLEMENT_ID]);
      if (isActive) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Gate' }],
        });
        return;
      }
      Alert.alert('Bilgi', 'Aktif üyelik bulunamadı.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Geri yükleme başarısız oldu.';
      Alert.alert('Hata', message);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Üyelik</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Kapat</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {packages.map((pkg) => (
            <View key={pkg.identifier} style={styles.card}>
              <Text style={styles.planTitle}>{pkg.product.title || pkg.identifier}</Text>
              {pkg.product.description ? (
                <Text style={styles.planDescription}>{pkg.product.description}</Text>
              ) : null}
              <Text style={styles.planPrice}>{pkg.product.priceString}</Text>
              <Pressable
                style={[styles.primaryButton, isPurchasing && styles.primaryDisabled]}
                onPress={() => handlePurchase(pkg)}
                disabled={isPurchasing}
              >
                <Text style={styles.primaryText}>Satın al</Text>
              </Pressable>
            </View>
          ))}

          {loadError ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>{loadError}</Text>
              <Pressable style={styles.secondaryButton} onPress={loadOfferings}>
                <Text style={styles.secondaryText}>Tekrar dene</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable
            style={[styles.restoreButton, isRestoring && styles.primaryDisabled]}
            onPress={handleRestore}
            disabled={isRestoring}
          >
            <Text style={styles.secondaryText}>
              {isRestoring ? 'Geri yükleniyor...' : 'Satın alımları geri yükle'}
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
  },
  closeText: {
    color: colors.accent,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  planTitle: {
    fontSize: typography.optionLarge,
    fontWeight: '700',
    color: colors.text,
  },
  planDescription: {
    color: colors.muted,
    lineHeight: 20,
  },
  planPrice: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  primaryButton: {
    marginTop: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.primaryButton,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  primaryDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    marginTop: spacing.sm,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  secondaryText: {
    color: colors.accent,
    fontWeight: '700',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    color: colors.warningText,
    textAlign: 'center',
  },
});

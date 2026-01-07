import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const PREFS_KEY = 'dumanless:profile-prefs';

type Prefs = {
  notifications: boolean;
  reminderTime: string;
};

const defaultPrefs: Prefs = {
  notifications: true,
  reminderTime: '09:00',
};

export default function ProfileScreen() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY)
      .then((value) => {
        if (value) setPrefs(JSON.parse(value));
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  const persist = (next: Prefs) => {
    setPrefs(next);
    AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next)).catch(() => {});
  };

  const toggleNotifications = () => {
    persist({ ...prefs, notifications: !prefs.notifications });
  };

  const cycleReminder = () => {
    const options = ['08:00', '09:00', '10:00', '18:00'];
    const idx = options.indexOf(prefs.reminderTime);
    const next = options[(idx + 1) % options.length];
    persist({ ...prefs, reminderTime: next });
  };

  const handleSupport = () => {
    Linking.openURL('mailto:support@dumanless.com').catch(() => {});
  };

  const confirmCancel = () => {
    Alert.alert('Üyeliği iptal et', 'Bu yalnızca örnek bir işlemdir.', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Tamam', style: 'destructive' },
    ]);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>Bilgilerini ve tercihlerini burada yönet.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Üyelik</Text>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DK</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Dumanless Kullanıcısı</Text>
            <Text style={styles.email}>user@dumanless.com</Text>
            <Text style={styles.meta}>Üyelik ID: DL-10293</Text>
          </View>
        </View>
        <View style={styles.badgeRow}>
          <Badge label="60 Günlük Program" />
          <Badge label="Aktif" tone="success" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ayarlar</Text>
        <SettingRow
          label="Bildirimler"
          valueComponent={
            <Switch value={prefs.notifications} onValueChange={toggleNotifications} trackColor={{ true: colors.accent }} />
          }
        />
        <SettingRow
          label="Günlük hatırlatma saati"
          valueComponent={
            <Pressable onPress={cycleReminder}>
              <Text style={styles.settingValue}>{prefs.reminderTime}</Text>
            </Pressable>
          }
        />
        <SettingRow label="Dil" valueComponent={<Text style={styles.settingValue}>Türkçe</Text>} />
        <SettingRow
          label="Destek"
          valueComponent={
            <Pressable onPress={handleSupport}>
              <Text style={styles.link}>support@dumanless.com</Text>
            </Pressable>
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Üyelik işlemleri</Text>
        <Pressable style={styles.primary} onPress={() => Alert.alert('Üyelik yönetimi', 'Yakında eklenecek.')}>
          <Text style={styles.primaryText}>Üyeliği yönet</Text>
        </Pressable>
        <Pressable style={styles.danger} onPress={confirmCancel}>
          <Text style={styles.dangerText}>Üyeliği iptal et</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Yasal</Text>
        <Pressable style={styles.linkRow}>
          <Text style={styles.link}>Gizlilik Politikası</Text>
        </Pressable>
        <Pressable style={styles.linkRow}>
          <Text style={styles.link}>Kullanım Koşulları</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function Badge({ label, tone }: { label: string; tone?: 'success' }) {
  return (
    <View style={[styles.badge, tone === 'success' && styles.badgeSuccess]}>
      <Text style={[styles.badgeText, tone === 'success' && styles.badgeTextSuccess]}>{label}</Text>
    </View>
  );
}

function SettingRow({ label, valueComponent }: { label: string; valueComponent: React.ReactNode }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      {valueComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.subtitle,
    color: colors.muted,
    lineHeight: 20,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: typography.optionLarge,
    fontWeight: '700',
    color: colors.text,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.tagBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  name: {
    fontSize: typography.option,
    fontWeight: '700',
    color: colors.text,
  },
  email: {
    color: colors.muted,
  },
  meta: {
    color: colors.muted,
    fontSize: typography.label,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.tagBackground,
  },
  badgeSuccess: {
    backgroundColor: colors.successBg,
  },
  badgeText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: typography.label,
  },
  badgeTextSuccess: {
    color: colors.successText,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  settingLabel: {
    fontSize: typography.subtitle,
    color: colors.text,
    fontWeight: '600',
  },
  settingValue: {
    color: colors.accent,
    fontWeight: '700',
  },
  link: {
    color: colors.accent,
    fontWeight: '700',
  },
  linkRow: {
    paddingVertical: spacing.xs,
  },
  primary: {
    backgroundColor: colors.primaryButton,
    paddingVertical: spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  danger: {
    marginTop: spacing.sm,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    alignItems: 'center',
  },
  dangerText: {
    color: colors.warningText,
    fontWeight: '700',
  },
});

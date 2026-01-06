import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <Text style={styles.badge}>Dumanless</Text>
        <Text style={styles.title}>İradeye değil, yapılandırılmış akışa güven.</Text>
        <Text style={styles.subtitle}>
          60 günlük program, tetikleyicileri haritalayan quiz ve sakin bir koç sesi. Tüm metinler Türkçe,
          sahte motivasyon yok, net görevler var.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Quiz')}>
          <Text style={styles.primaryText}>Quize Başla</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Hub')}>
          <Text style={styles.secondaryText}>ADMIN: App'e Gir</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Neler var?</Text>
        <Text style={styles.cardBody}>• 60 günlük günlük görevler ve koç mesajları</Text>
        <Text style={styles.cardBody}>• Tetiklendim modu, nefes ve mini oyunlar</Text>
        <Text style={styles.cardBody}>• İlerleme kartları, rozetler ve ipuçları</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxxl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
  hero: {
    borderRadius: 32,
    backgroundColor: '#f6ede2',
    padding: spacing.xxxl,
    gap: spacing.md,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 200,
    backgroundColor: colors.accentShadow,
    right: -80,
    top: -40,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff7df',
    color: colors.highlightText,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: colors.accentShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
    gap: spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  cardBody: {
    fontSize: typography.body,
    color: colors.muted,
  },
});

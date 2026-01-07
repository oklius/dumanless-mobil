import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const features = [
  {
    title: '60 Günlük Akış',
    body: 'Her gün kısa görevler ve nefes egzersizleri ile yolunu netleştir.',
    icon: 'calendar-clear-outline',
  },
  {
    title: 'Alışkanlık Takibi',
    body: 'Tetikleyicilerini kaydet, güçlü kaldığın alanları gör ve ilerlemeyi hisset.',
    icon: 'checkmark-done-outline',
  },
  {
    title: 'Nazik Hatırlatmalar',
    body: 'Gürültüsüz, sade bildirimlerle kendi tempona uyum sağlar.',
    icon: 'notifications-outline',
  },
];

const steps = [
  {
    title: 'Quiz’i tamamla',
    body: 'İlk 2 dakikada tetikleyicilerini ve alışkanlıklarını tespit ediyoruz.',
  },
  {
    title: 'Planı kur',
    body: 'Dumanless koçu günlük akışını, nefes rutinlerini ve hatırlatmaları hazırlar.',
  },
  {
    title: 'Takip et ve güçlen',
    body: 'İlerlemeni canlı gör, yeniden başlama risklerini anında yakala.',
  },
];

const stats = [
  { label: 'Kullanıcı memnuniyeti', value: '%93', icon: 'shield-checkmark-outline' },
  { label: 'Quiz sonrası devam oranı', value: '%87', icon: 'trending-up-outline' },
  { label: 'Günlük görev süresi', value: '10 dk', icon: 'time-outline' },
];

const testimonials = [
  {
    name: 'Ayşe K.',
    role: 'İnsan Kaynakları Uzmanı',
    quote: '“Hatırlatmalar gürültüsüz, tetikleyicilerimi sakin şekilde yönetiyorum.”',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Mehmet T.',
    role: 'Operasyon Müdürü',
    quote: '“Günlük 10 dakikalık görevlerle kontrol hep bende kaldı.”',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
  {
    name: 'Elif Y.',
    role: 'Finans Analisti',
    quote: '“60 gün boyunca nereye odaklanacağım netti, yeniden başlama korkusu azaldı.”',
    avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
  },
];

export default function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top || styles.container.paddingTop }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroGlowOne} />
        <View style={styles.heroGlowTwo} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Sistem yaklaşımı</Text>
          <View style={styles.badgeDot} />
        </View>
        <Text style={styles.heroTitle}>Sigarayı iradeyle değil, net bir yapı ile bırak.</Text>
        <Text style={styles.heroSubtitle}>
          Dumanless; 60 gün boyunca tetikleyicileri çözümler, sakin görevlerle ilerlemeyi gösterir ve yeniden
          başlamayı yönetilebilir hale getirir. Her adım ölçülü, şeffaf ve güven verici.
        </Text>
        <View style={styles.ctaRow}>
          <Pressable style={styles.primaryCta} onPress={() => navigation.navigate('Quiz')}>
            <Text style={styles.primaryCtaText}>Şimdi Başla (Üye değilim)</Text>
          </Pressable>
          <Pressable style={styles.secondaryCta} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.secondaryCtaText}>Üyeyim, giriş yap</Text>
          </Pressable>
        </View>
        <Pressable style={styles.adminLink} onPress={() => navigation.navigate('Hub')}>
          <Text style={styles.adminLinkText}>ADMIN / App’e atla</Text>
        </Pressable>
        <View style={styles.featureGrid}>
          {features.map((item) => (
            <View key={item.title} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={item.icon as any} size={18} color={colors.accent} />
              </View>
              <Text style={styles.featureEyebrow}>{item.title}</Text>
              <Text style={styles.featureBody}>{item.body}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Nasıl çalışır</Text>
          <Text style={styles.sectionTitle}>3 adımda kişisel bırakma kılavuzu</Text>
        </View>
        <View style={styles.stepGrid}>
          {steps.map((step, index) => (
            <View key={step.title} style={styles.stepCard}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Güven ver</Text>
          <Text style={styles.sectionTitle}>Ne yaptığını bilerek ilerle.</Text>
        </View>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={stat.icon as any} size={18} color={colors.accent} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.testimonialGrid}>
          {testimonials.map((item) => (
            <View key={item.name} style={styles.testimonialCard}>
              <View style={styles.personRow}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.personName}>{item.name}</Text>
                  <Text style={styles.personRole}>{item.role}</Text>
                </View>
              </View>
              <Text style={styles.quote}>{item.quote}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomCta}>
        <Text style={styles.bottomLabel}>Şimdi başla</Text>
        <Text style={styles.bottomTitle}>10 dakikalık sakin görevlerle yolculuğunu bugün başlat.</Text>
        <Text style={styles.bottomBody}>
          Quiz’i tamamla, kişisel planını gör ve ilk güne hemen şimdi adım at. Tüm süreç şeffaf ve güvenli.
        </Text>
        <Pressable style={styles.bottomButton} onPress={() => navigation.navigate('Quiz')}>
          <Text style={styles.bottomButtonText}>Quiz’e Başla</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxxl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
    gap: spacing.xxl,
  },
  heroCard: {
    position: 'relative',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f3faf7',
    padding: spacing.xxxl,
    overflow: 'hidden',
    shadowColor: 'rgba(10, 40, 20, 0.12)',
    shadowOpacity: 1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 24 },
    elevation: 10,
    gap: spacing.lg,
  },
  heroGlowOne: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: 'rgba(164, 244, 207, 0.4)',
    top: -70,
    right: -90,
    opacity: 0.9,
  },
  heroGlowTwo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: 'rgba(162, 244, 253, 0.3)',
    bottom: -70,
    left: 32,
    opacity: 0.8,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(164, 244, 207, 0.7)',
    backgroundColor: 'rgba(255,255,255,0.7)',
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  badgeText: {
    fontSize: typography.label,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#0f5132',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#00bb7f',
  },
  heroTitle: {
    fontSize: typography.hero,
    fontWeight: '700',
    lineHeight: 42,
    color: colors.text,
  },
  heroSubtitle: {
    fontSize: typography.subtitle,
    color: colors.muted,
    lineHeight: 24,
  },
  ctaRow: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  primaryCta: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: colors.accentShadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  primaryCtaText: {
    color: '#ffffff',
    fontSize: typography.button,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  secondaryCta: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  secondaryCtaText: {
    color: colors.text,
    fontSize: typography.button,
    fontWeight: '700',
  },
  adminLink: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  adminLinkText: {
    color: colors.muted,
    fontSize: typography.label,
    textDecorationLine: 'underline',
  },
  featureGrid: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  featureCard: {
    padding: spacing.xl,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: 'rgba(7, 45, 26, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    gap: spacing.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#ecfdf3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEyebrow: {
    fontSize: typography.label,
    color: colors.muted,
  },
  featureBody: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 22,
  },
  sectionCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.xxl,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 6,
    gap: spacing.lg,
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  sectionLabel: {
    fontSize: typography.label,
    color: '#0f5132',
    letterSpacing: 6,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  stepGrid: {
    gap: spacing.md,
  },
  stepCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: spacing.xl,
    shadowColor: 'rgba(19,33,27,0.12)',
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 14 },
    elevation: 4,
    gap: spacing.sm,
  },
  stepBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ecfdf3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    color: '#0f5132',
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: typography.subtitle + 1,
    fontWeight: '700',
    color: colors.text,
  },
  stepBody: {
    fontSize: typography.body - 1,
    color: colors.muted,
    lineHeight: 20,
  },
  statsGrid: {
    gap: spacing.md,
  },
  statCard: {
    padding: spacing.xl,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f9fbf8',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.accent,
  },
  statLabel: {
    fontSize: typography.body - 1,
    color: colors.muted,
  },
  testimonialGrid: {
    gap: spacing.md,
  },
  testimonialCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fdfdfb',
    padding: spacing.xl,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
    gap: spacing.sm,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  personName: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  personRole: {
    fontSize: typography.label,
    color: colors.muted,
  },
  quote: {
    fontSize: typography.body - 1,
    color: colors.muted,
    lineHeight: 20,
  },
  bottomCta: {
    borderRadius: 28,
    padding: spacing.xxl,
    backgroundColor: colors.accent,
    gap: spacing.sm,
    shadowColor: 'rgba(5, 80, 50, 0.3)',
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8,
  },
  bottomLabel: {
    fontSize: typography.label,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 6,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  bottomTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 34,
  },
  bottomBody: {
    fontSize: typography.subtitle,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  bottomButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: 999,
  },
  bottomButtonText: {
    color: '#0f5132',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

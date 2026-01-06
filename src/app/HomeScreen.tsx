import { ReactNode } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Insight = {
  title: string;
  body: string;
};

type StepItem = {
  title: string;
  body: string;
};

type Metric = {
  value: string;
  label: string;
};

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
  photo: string;
};

const INSIGHTS: Insight[] = [
  {
    title: '60 Günlük Akış',
    body: 'Her gün için kısa görevler ve nefes egzersizleri ile yolunu netleştir.',
  },
  {
    title: 'Alışkanlık Takibi',
    body: 'Tetikleyicilerini kaydet, güçlü kaldığın alanları gör ve ilerlemeyi hisset.',
  },
  {
    title: 'Nazik Hatırlatmalar',
    body: 'Gerektiği kadar hatırlatma: Gürültüsüz, sade ve sana ait bir tempo.',
  },
];

const STEPS: StepItem[] = [
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

const METRICS: Metric[] = [
  { value: '%93', label: 'Kullanıcı memnuniyeti' },
  { value: '%87', label: 'Quiz sonrası devam oranı' },
  { value: '10 dk', label: 'Günlük görev süresi' },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ayşe K.',
    role: 'İnsan Kaynakları Uzmanı',
    quote: 'Hatırlatmalar gürültüsüz, tetikleyicilerimi sakin şekilde yönetiyorum.',
    rating: 5,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Mehmet T.',
    role: 'Operasyon Müdürü',
    quote: 'Günlük 10 dakikalık görevlerle kontrol hep bende kaldı.',
    rating: 5,
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
  {
    name: 'Elif Y.',
    role: 'Finans Analisti',
    quote: '60 gün boyunca nereye odaklanacağım netti, yeniden başlama korkusu azaldı.',
    rating: 4.7,
    photo: 'https://randomuser.me/api/portraits/women/46.jpg',
  },
];

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroBlobLeft} />
        <View style={styles.heroBlobRight} />
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Sistem yaklaşımı</Text>
        </View>
        <Text style={styles.heroTitle}>Sigarayı iradeyle değil, net bir yapı ile bırak.</Text>
        <Text style={styles.heroSubtitle}>
          Dumanless; 60 gün boyunca tetikleyicileri çözümler, sakin görevlerle ilerlemeyi gösterir
          ve yeniden başlamayı yönetilebilir hale getirir. Her adım ölçülü, şeffaf ve güven verici.
        </Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.primaryButtonText}>Şimdi Başla (Üye değilim)</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Üyeyim (Giriş yap)</Text>
        </Pressable>
        <Pressable style={styles.adminButton} onPress={() => navigation.navigate('AppInsideHub')}>
          <Text style={styles.adminButtonText}>ADMIN: App'e Gir</Text>
        </Pressable>
      </View>

      <Section title="Dumanless ile netlik kazan">
        <View style={styles.cardGrid}>
          {INSIGHTS.map((item) => (
            <View key={item.title} style={styles.card}>
              <View style={styles.iconBubble}>
                <Text style={styles.iconBubbleText}>●</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Nasıl çalışır">
        <View style={styles.cardGrid}>
          {STEPS.map((item, index) => (
            <View key={item.title} style={styles.card}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Ölçülen etki">
        <View style={styles.cardGrid}>
          {METRICS.map((metric) => (
            <View key={metric.label} style={styles.card}>
              <View style={styles.iconBubbleMuted}>
                <Text style={styles.iconBubbleText}>◆</Text>
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.cardBody}>{metric.label}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Kullanıcı deneyimleri">
        <View style={styles.cardGrid}>
          {TESTIMONIALS.map((item) => (
            <View key={item.name} style={styles.card}>
              <View style={styles.testimonialHeader}>
                <Image source={{ uri: item.photo }} style={styles.avatar} />
                <View style={styles.testimonialMeta}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardBody}>{item.role}</Text>
                </View>
              </View>
              <Text style={styles.stars}>{renderStars(item.rating)}</Text>
              <Text style={styles.cardBody}>{item.quote}</Text>
            </View>
          ))}
        </View>
      </Section>

      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>
          10 dakikalık sakin görevlerle sigara bırakma yolculuğunu bugün başlat.
        </Text>
        <Text style={styles.ctaBody}>
          Quiz’i tamamla, kişisel planını gör ve ilk güne hemen şimdi adım at. Tüm süreç şeffaf ve
          güvenli.
        </Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.primaryButtonText}>Şimdi Başla (Üye değilim)</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Üyeyim (Giriş yap)</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) return '★';
    if (i === fullStars && hasHalf) return '★';
    return '☆';
  });
  return stars.join('');
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
  },
  hero: {
    borderRadius: 32,
    padding: spacing.xxxl,
    backgroundColor: '#f3f5ee',
    marginBottom: spacing.huge,
    overflow: 'hidden',
  },
  heroBlobLeft: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 76, 58, 0.08)',
    top: -60,
    left: -80,
  },
  heroBlobRight: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(242, 201, 76, 0.12)',
    bottom: -60,
    right: -40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.panel,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    marginBottom: spacing.lg,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  badgeText: {
    fontSize: typography.subtitle,
    color: colors.muted,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: colors.panel,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  adminButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  adminButtonText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.huge,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  cardGrid: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    shadowColor: 'rgba(15, 17, 12, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 76, 58, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconBubbleMuted: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 17, 13, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconBubbleText: {
    color: colors.accent,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardBody: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 76, 58, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  stepBadgeText: {
    color: colors.accent,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  testimonialMeta: {
    marginLeft: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.progressTrack,
  },
  stars: {
    fontSize: 16,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  ctaCard: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.xxxl,
    shadowColor: 'rgba(15, 17, 12, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  ctaBody: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
});

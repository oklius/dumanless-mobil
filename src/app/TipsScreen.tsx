import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Screen from '../components/Screen';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Tips'>;

const TIPS = [
  { title: 'Sigarayı bırakmaya yardımcı 4 gerçekten faydalı ipucu', body: 'Kısa vadeli hedef, su, nefes, yürüyüş. Kriz anında 5-4-3-2-1 yöntemi işe yarar.' },
  { title: 'Sigara krizini nasıl tanırsın ve ondan kurtulursun?', body: 'Vücudun ön uyarılarını (çene sıkma, omuz kasılması) izle. 7 dakika kuralını hatırla.' },
  { title: 'Sigara molasının yerine geçecek 6 aktivite', body: 'Su iç, esneme, kısa yürüyüş, nefes, sevdiğin listeyi aç, yüzünü yıka.' },
  { title: 'Sigarayı bıraktıktan sonra kaçınmanız gereken 4 hata', body: '“Bir tane deneme” tuzağı, aç kalmak, uykusuz kalmak, tetikleyiciyi takip etmemek.' },
  { title: 'Sigarayı bıraktıktan sonra motivasyon nasıl korunur?', body: 'Ödül listesi hazırla, krizleri kaydet, haftalık minik kutlama planla.' },
  { title: 'Sigarayı bıraktıktan sonra cildine nasıl bakılır?', body: 'Su, uyku, yürüyüş ve temiz beslenme cildini toparlar. Nikotin eksikliği parlamanı artırır.' },
];

export default function TipsScreen({}: Props) {
  const [active, setActive] = useState(0);
  const activeTip = TIPS[active];

  return (
    <Screen>
      <Text style={styles.header}>Her gün öğren</Text>
      <Text style={styles.subheader}>Kısa, okunabilir ipuçları. Oku ve uygulamaya dön.</Text>

      <View style={styles.list}>
        {TIPS.map((tip, index) => (
          <Pressable
            key={tip.title}
            style={[styles.card, index === active && styles.cardActive]}
            onPress={() => setActive(index)}
          >
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>{index === active ? '📖' : '📘'}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{tip.title}</Text>
              <Text style={styles.cardHint}>Oku</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.reader}>
        <Text style={styles.readerTitle}>{activeTip.title}</Text>
        <Text style={styles.readerBody}>{activeTip.body}</Text>
        <View style={styles.readerFooter}>
          <Text style={styles.readerEmoji}>🐱</Text>
          <Text style={styles.readerHint}>Okudun, şimdi uygulamaya dön ve küçük bir adım at.</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subheader: {
    color: colors.muted,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cardActive: {
    borderColor: colors.primary,
    backgroundColor: '#e7f6f1',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.optionBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 20,
  },
  cardBody: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  cardHint: {
    color: colors.muted,
  },
  reader: {
    borderRadius: 20,
    padding: spacing.xl,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  readerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  readerBody: {
    color: colors.text,
    lineHeight: 20,
  },
  readerFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  readerEmoji: {
    fontSize: 24,
  },
  readerHint: {
    color: colors.muted,
    flex: 1,
  },
});

import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import QuizCard from '../components/QuizCard';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

export default function QuizResultScreen({ navigation, route }: Props) {
  const answered = route.params?.answered ?? 0;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <QuizCard>
        <Text style={styles.badge}>Ön analiz</Text>
        <Text style={styles.title}>Quiz tamamlandı</Text>
        <Text style={styles.body}>
          {answered} adım yanıtlandı. Şimdi 60 günlük Hub’ı açalım. Tetikleyici haritalama, nefes ve günlük
          görevler seni bekliyor.
        </Text>
        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Hub')}>
            <Text style={styles.primaryText}>Uygulamaya devam et</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.secondaryText}>Başa dön</Text>
          </Pressable>
        </View>
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
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.optionBackground,
    color: colors.muted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  body: {
    color: colors.muted,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
});

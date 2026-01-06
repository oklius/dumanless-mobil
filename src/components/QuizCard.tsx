import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type QuizCardProps = {
  children: ReactNode;
};

export default function QuizCard({ children }: QuizCardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.xxxl,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 25 },
    elevation: 8,
  },
});

import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type ProgressBarProps = {
  current: number;
  total: number;
  percent: number;
};

export default function ProgressBar({ current, total, percent }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Text style={styles.label}>İLERLEME</Text>
        <Text style={styles.count}>
          {current} / {total}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.progress,
    letterSpacing: 3.6,
    color: colors.muted,
    fontWeight: '600',
  },
  count: {
    fontSize: typography.progress,
    color: colors.muted,
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.progressTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.progressFill,
  },
});

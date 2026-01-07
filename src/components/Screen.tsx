import React from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type ScreenProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  contentStyle?: ViewStyle;
  headerTitle?: string;
  headerSubtitle?: string;
};

export default function Screen({
  children,
  scrollable = true,
  backgroundColor = colors.background,
  contentStyle,
  headerTitle,
  headerSubtitle,
}: ScreenProps) {
  const content = (
    <View style={[styles.content, contentStyle]}>
      {headerTitle ? (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          {headerSubtitle ? <Text style={styles.headerSubtitle}>{headerSubtitle}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top', 'left', 'right']}>
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: spacing.huge,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
  } as TextStyle,
  headerSubtitle: {
    fontSize: typography.subtitle,
    color: colors.muted,
    lineHeight: 20,
  } as TextStyle,
});

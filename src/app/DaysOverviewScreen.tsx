import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Screen from '../components/Screen';
import DayCard from '../components/DayCard';
import days from '../lib/days';
import { useJourney } from '../lib/journeyContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type DayItem = (typeof days)[number];

export default function DaysOverviewScreen() {
  const navigation = useNavigation<Nav>();
  const { currentDay, state } = useJourney();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState(String(currentDay));
  const listRef = React.useRef<FlatList<DayItem>>(null);

  const progressLabel = `${currentDay} / ${days.length}`;
  const progressPercent = Math.round((currentDay / days.length) * 100);

  const jumpToDay = () => {
    const num = Math.min(Math.max(parseInt(pickerValue, 10) || currentDay, 1), days.length);
    setPickerOpen(false);
    setTimeout(() => {
      const index = days.findIndex((d) => d.day === num);
      if (index >= 0) {
        listRef.current?.scrollToIndex({ index, animated: true });
      }
    }, 50);
  };

  const renderItem = ({ item }: { item: DayItem }) => (
    <DayCard
      item={item}
      currentDay={currentDay}
      completedDays={state.completedDays}
      onOpenDay={(day) => navigation.navigate('Day', { dayNumber: day })}
    />
  );

  const keyExtractor = (item: DayItem) => String(item.day);

  return (
    <Screen scrollable={false}>
      <View style={styles.hero}>
        <View>
          <Text style={styles.heroTitle}>60 Günlük Yolculuk</Text>
          <Text style={styles.heroSubtitle}>Bugün: Gün {currentDay}</Text>
        </View>
        <Pressable style={styles.jumpButton} onPress={() => setPickerOpen(true)}>
          <Text style={styles.jumpText}>Güne git</Text>
        </Pressable>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{progressLabel}</Text>

      <FlatList
        ref={listRef}
        data={days}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={currentDay - 1}
        getItemLayout={(_, index) => ({ length: 150, offset: 150 * index, index })}
      />

      <Modal visible={pickerOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Güne git</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={pickerValue}
              onChangeText={setPickerValue}
              placeholder="1-60"
              placeholderTextColor={colors.muted}
            />
            <Pressable style={styles.primary} onPress={jumpToDay}>
              <Text style={styles.primaryText}>Git</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={() => setPickerOpen(false)}>
              <Text style={styles.secondaryText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 18,
    backgroundColor: '#f3faf7',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroTitle: {
    fontSize: typography.optionLarge,
    fontWeight: '700',
    color: colors.text,
  },
  heroSubtitle: {
    color: colors.muted,
  },
  jumpButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  jumpText: {
    color: colors.accent,
    fontWeight: '700',
  },
  progressBar: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.progressTrack,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  progressLabel: {
    textAlign: 'right',
    color: colors.muted,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.huge,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardCurrent: {
    borderColor: colors.accent,
    backgroundColor: '#e6f4ee',
  },
  cardCompleted: {
    borderColor: '#dfe8e2',
    backgroundColor: '#f7faf9',
  },
  cardLocked: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 10,
    backgroundColor: colors.tagBackground,
  },
  dayBadgeText: {
    fontWeight: '700',
    color: colors.text,
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.tagBackground,
  },
  statusPillCurrent: {
    backgroundColor: '#ecfdf3',
  },
  statusPillDone: {
    backgroundColor: '#f1f5f3',
  },
  statusText: {
    fontSize: typography.label,
    color: colors.muted,
    fontWeight: '700',
  },
  statusTextCurrent: {
    color: colors.accent,
  },
  dayTitle: {
    fontSize: typography.option,
    fontWeight: '700',
    color: colors.text,
  },
  dayCopy: {
    color: colors.muted,
    lineHeight: 20,
  },
  lockedHint: {
    color: colors.muted,
    fontSize: typography.label,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.panel,
    padding: spacing.xl,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: spacing.md,
  },
  modalHandle: {
    width: 50,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: typography.optionLarge,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    backgroundColor: colors.optionBackground,
  },
  primary: {
    backgroundColor: colors.primaryButton,
    paddingVertical: spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondary: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
});

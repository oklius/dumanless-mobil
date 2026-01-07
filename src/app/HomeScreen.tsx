import React, { useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import days from '../lib/days';
import Screen from '../components/Screen';
import { useJourney } from '../lib/journeyContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { AppTabParamList } from '../navigation/AppTabs';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Hub'>;
type ActionType = 'trigger' | 'note' | 'motivation' | 'replacement' | null;

const emotions = [
  { label: 'Stresli', emoji: '😾' },
  { label: 'Yalnız', emoji: '🙀' },
  { label: 'Mutlu', emoji: '😺' },
  { label: 'Sıkılmış', emoji: '😼' },
  { label: 'Heyecanlı', emoji: '😸' },
  { label: 'Depresif', emoji: '😿' },
  { label: 'Kızgın', emoji: '😾' },
  { label: 'Kaygılı', emoji: '🙀' },
];

const situations = ['Telefondayım', 'Ara veriyorum', 'Sosyal ortamdayım', 'Yoldayım', 'Yemekten sonra'];
const motivationLines = [
  'Bu bir istek, emir değil. Dalga gibi gelecek ve geçecek.',
  '7 dakika dayan, beynin sakinleşecek. Bu aralık senin.',
  'Sigara içmezsen hiçbir şey “eksik” olmayacak, sadece daha rahat nefes alacaksın.',
  'Nefes al, su iç, ayağa kalk. Bedenin hareketi beynini kandırır.',
  'Bu kriz sen değilsin, sadece alışkanlığın sesli hali.',
];

const moodCycle = [
  { emoji: '😺', label: 'Sakin' },
  { emoji: '😸', label: 'Hafif' },
  { emoji: '😿', label: 'Düşük' },
  { emoji: '😾', label: 'Gergin' },
];

const dailyTasksMeta = [
  { key: 'positive', title: 'Pozitif bir eylem', subtitle: 'Bugün kendine küçük bir iyilik yap', color: '#fdf0d7' },
  { key: 'mood', title: 'Mod takibi', subtitle: 'Kedin nasıl hissediyor?', color: '#e9f6f1' },
  { key: 'article', title: 'Bir makale oku', subtitle: 'Bilgi bölümünden birini seç', color: '#f7eef7' },
  { key: 'reflection', title: 'Bugün ne önemliydi?', subtitle: 'Kısa bir not bırak', color: '#eef3ff' },
] as const;

export default function HomeScreen({ navigation }: Props) {
  const tabNavigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const {
    currentDay,
    elapsed,
    stats,
    state,
    logTrigger,
    logCrisisWin,
    logSmoked,
    addNote,
    incrementBreath,
    setMoodForDay,
    toggleTask,
  } = useJourney();
  const todayContent = days.find((d) => d.day === currentDay);

  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [noteText, setNoteText] = useState('');
  const [triggerIntensity, setTriggerIntensity] = useState(5);
  const [triggerEmotion, setTriggerEmotion] = useState(emotions[0].label);
  const [triggerSituation, setTriggerSituation] = useState(situations[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const previousDays = useMemo(() => days.filter((d) => d.day < currentDay).slice(-6), [currentDay]);

  const showFeedback = (text: string) => {
    setFeedback(text);
    setTimeout(() => setFeedback(null), 2200);
  };

  const handleTriggerSave = () => {
    logTrigger({ intensity: triggerIntensity, emotion: triggerEmotion, situation: triggerSituation });
    toggleTask('mood');
    setActiveAction(null);
    showFeedback('İstek kaydedildi. Dalganın geçmesine izin ver.');
  };

  const handleNoteSave = () => {
    if (!noteText.trim()) return;
    addNote(noteText.trim());
    toggleTask('reflection');
    setNoteText('');
    setActiveAction(null);
    showFeedback('Kısa notun saklandı.');
  };

  const cycleMood = (dayName: string) => {
    const current = state.moods[dayName];
    const nextIndex = (current ? moodCycle.findIndex((m) => m.label === current.label) + 1 : 0) % moodCycle.length;
    setMoodForDay(dayName, moodCycle[nextIndex]);
  };

  const heroSubtitle = todayContent
    ? `${todayContent.title} • Görev: ${todayContent.task.title}`
    : '60 günlük akış seni bekliyor.';

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <Text style={styles.badge}>Dumanless • 60 gün</Text>
        <Text style={styles.heroTitle}>{elapsed.days} gündür Dumanless’im</Text>
        <Text style={styles.heroSubtitle}>Bugün Gün {currentDay}</Text>
        <Text style={styles.heroBody}>{heroSubtitle}</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Day', { dayNumber: currentDay })}
        >
          <Text style={styles.primaryButtonText}>Bugünkü güne git</Text>
        </Pressable>
        <View style={styles.heroActions}>
          <PillButton label="Tetiklendim" icon="alert-circle" onPress={() => tabNavigation.navigate('TriggeredTab')} />
          <PillButton
            label="Dikkatini dağıt"
            icon="game-controller"
            onPress={() => tabNavigation.navigate('ToolsTab', { screen: 'ToolsMain', params: { open: 'focus' } } as any)}
          />
          <PillButton
            label="Önceki günler"
            icon="book-outline"
            onPress={() => tabNavigation.navigate('DaysTab')}
          />
          <PillButton
            label="Rahatlatıcı müzik"
            icon="musical-notes"
            onPress={() => tabNavigation.navigate('ToolsTab', { screen: 'ToolsMain', params: { open: 'audio' } } as any)}
          />
        </View>
        <View style={styles.heroCounters}>
          <Counter label="Gün" value={elapsed.days} />
          <Counter label="Saat" value={elapsed.hours} />
          <Counter label="Dakika" value={elapsed.minutes} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Kazanımlar</Text>
        <View style={styles.statGrid}>
          <StatCard label="Para" value={`₺${stats.moneySaved}`} hint="tasarruf" />
          <StatCard label="Sigara" value={`${stats.cigarettesSkipped}`} hint="içilmeyen" />
          <StatCard label="Zaman" value={`${Math.round(stats.timeSavedMinutes / 60)} saat`} hint="geri kazandın" />
          <StatCard label="Ömür" value={`${(stats.lifeGainedMinutes / 1440).toFixed(1)} gün`} hint="beklenen artış" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Gerçek izleme</Text>
        <View style={styles.quickGrid}>
          <QuickCard title="Sigara isteği hissettim" color="#fde6e0" onPress={() => setActiveAction('trigger')} />
          <QuickCard
            title="Bir krizi yendim"
            color="#e6f4ee"
            onPress={() => {
              logCrisisWin();
              showFeedback('Kriz bitti. Dalga geçti.');
            }}
          />
          <QuickCard
            title="Sigara içtim"
            color="#fff4d7"
            onPress={() => {
              logSmoked();
              showFeedback('Dürüst kayıt edildi. Yeniden odaklan.');
            }}
          />
          <QuickCard title="Anı yazıyorum" color="#eef1ff" onPress={() => setActiveAction('note')} />
          <QuickCard
            title="Nefes alıyorum"
            color="#e2f7f3"
            onPress={() => {
              incrementBreath();
              tabNavigation.navigate('TriggeredTab');
            }}
          />
          <QuickCard title="Motivasyon al" color="#f7e9ff" onPress={() => setActiveAction('motivation')} />
          <QuickCard
            title="Yerine koyma yöntemlerim"
            color="#f0f7ff"
            onPress={() => setActiveAction('replacement')}
          />
          <QuickCard title="Mini oyun" color="#ffe9f1" onPress={() => tabNavigation.navigate('ToolsTab')} />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Haftam</Text>
          <Text style={styles.sectionSubtitle}>Pazartesi – Pazar ruh halleri</Text>
        </View>
        <View style={styles.weekRow}>
          {Object.keys(state.moods).map((dayName) => {
            const mood = state.moods[dayName];
            return (
              <Pressable key={dayName} style={styles.moodBubble} onPress={() => cycleMood(dayName)}>
                <Text style={styles.moodEmoji}>{mood?.emoji ?? '🐾'}</Text>
                {mood ? <Text style={styles.moodTick}>✓</Text> : null}
                <Text style={styles.moodLabel}>{dayName.slice(0, 3)}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bugün</Text>
          <Text style={styles.sectionSubtitle}>Kartlara dokunarak tamamla</Text>
        </View>
        <View style={styles.dailyTasks}>
          {dailyTasksMeta.map((task) => (
            <Pressable
              key={task.key}
              style={[styles.taskCard, { backgroundColor: task.color }, state.dailyTasks[task.key] && styles.taskCardDone]}
              onPress={() => toggleTask(task.key)}
            >
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
              <Text style={styles.taskStatus}>{state.dailyTasks[task.key] ? 'Tamamlandı' : 'Devam et'}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Önceki günler</Text>
          <Text style={styles.sectionSubtitle}>Okuyabilir, tekrar tamamlayamazsın.</Text>
        </View>
        <View style={styles.dayChips}>
          {previousDays.map((d) => (
            <Pressable
              key={d.day}
              style={styles.dayChip}
              onPress={() => navigation.navigate('Day', { dayNumber: d.day })}
            >
              <Text style={styles.dayChipTitle}>{d.title}</Text>
              <Text style={styles.dayChipSubtitle}>Gün {d.day}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>İlerlemeni gör</Text>
        <Text style={styles.footerBody}>Rozetler, istatistikler ve günlük okumalar burada.</Text>
        <View style={styles.footerButtons}>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Progress')}>
            <Text style={styles.secondaryButtonText}>İstatistik</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Trophies')}>
            <Text style={styles.secondaryButtonText}>Rozetler</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Tips')}>
            <Text style={styles.secondaryButtonText}>Bilgi</Text>
          </Pressable>
        </View>
        <View style={styles.mascot}>
          <Text style={styles.mascotEmoji}>🐈‍⬛</Text>
          <Text style={styles.mascotText}>Kedimiz burada, panik yok. Adım adım gidiyoruz.</Text>
        </View>
      </View>

      {feedback ? <View style={styles.feedback}><Text style={styles.feedbackText}>{feedback}</Text></View> : null}

      <ActionModal visible={activeAction === 'trigger'} onClose={() => setActiveAction(null)}>
        <Text style={styles.modalTitle}>Sigara isteği formu</Text>
        <Text style={styles.modalSubtitle}>İsteğinin şiddeti nedir?</Text>
        <View style={styles.sliderRow}>
          {Array.from({ length: 11 }, (_, i) => (
            <Pressable
              key={i}
              style={[styles.sliderDot, triggerIntensity === i && styles.sliderDotActive]}
              onPress={() => setTriggerIntensity(i)}
            >
              <Text style={[styles.sliderNumber, triggerIntensity === i && styles.sliderNumberActive]}>{i}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.modalSubtitle}>Duygun</Text>
        <View style={styles.emotionGrid}>
          {emotions.map((item) => (
            <Pressable
              key={item.label}
              style={[
                styles.emotionCard,
                triggerEmotion === item.label && styles.emotionCardActive,
              ]}
              onPress={() => setTriggerEmotion(item.label)}
            >
              <Text style={styles.emotionEmoji}>{item.emoji}</Text>
              <Text style={styles.emotionLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.modalSubtitle}>Durum</Text>
        <View style={styles.situationRow}>
          {situations.map((item) => (
            <Pressable
              key={item}
              style={[
                styles.situationChip,
                triggerSituation === item && styles.situationChipActive,
              ]}
              onPress={() => setTriggerSituation(item)}
            >
              <Text style={[styles.situationText, triggerSituation === item && styles.situationTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.primaryButton} onPress={handleTriggerSave}>
          <Text style={styles.primaryButtonText}>Kaydet ve nefes al</Text>
        </Pressable>
      </ActionModal>

      <ActionModal visible={activeAction === 'note'} onClose={() => setActiveAction(null)}>
        <Text style={styles.modalTitle}>Anı yaz</Text>
        <Text style={styles.modalSubtitle}>Kısa ve dürüst bir cümle bırak.</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Bugün aklımda olan..."
          placeholderTextColor={colors.muted}
          value={noteText}
          onChangeText={setNoteText}
          multiline
        />
        <Pressable style={styles.primaryButton} onPress={handleNoteSave}>
          <Text style={styles.primaryButtonText}>Kaydet</Text>
        </Pressable>
      </ActionModal>

      <ActionModal visible={activeAction === 'motivation'} onClose={() => setActiveAction(null)}>
        <Text style={styles.modalTitle}>Koç notu</Text>
        {motivationLines.map((line) => (
          <View key={line} style={styles.motivationLine}>
            <Text style={styles.motivationDot}>•</Text>
            <Text style={styles.modalSubtitle}>{line}</Text>
          </View>
        ))}
      </ActionModal>

      <ActionModal visible={activeAction === 'replacement'} onClose={() => setActiveAction(null)}>
        <Text style={styles.modalTitle}>Yerine koyma yöntemleri</Text>
        <View style={styles.replacementList}>
          <ReplacementItem title="Nikotin sakızı" detail="3 dakika çiğne, isteğin sönsün." />
          <ReplacementItem title="Bitki çayı" detail="Sıcak içecek ağız alışkanlığına iyi gelir." />
          <ReplacementItem title="Soğuk su" detail="Beyni resetler, dopamin dalgasını düşürür." />
          <ReplacementItem title="Kısa yürüyüş" detail="7 dakikalık tempo yürüyüşü isteği dağıtır." />
        </View>
      </ActionModal>
    </Screen>
  );
}

function ReplacementItem({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.replacementItem}>
      <Text style={styles.replacementTitle}>{title}</Text>
      <Text style={styles.replacementDetail}>{detail}</Text>
    </View>
  );
}

function ActionModal({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHandle} />
          <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
          <Pressable style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Kapat</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.counter}>
      <Text style={styles.counterValue}>{value}</Text>
      <Text style={styles.counterLabel}>{label}</Text>
    </View>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

function QuickCard({ title, color, onPress }: { title: string; color: string; onPress: () => void }) {
  return (
    <Pressable style={[styles.quickCard, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.quickTitle}>{title}</Text>
      <Ionicons name="chevron-forward" color={colors.text} size={18} />
    </Pressable>
  );
}

function PillButton({ label, icon, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable style={styles.pillButton} onPress={onPress}>
      <Ionicons name={icon} size={18} color={colors.text} />
      <Text style={styles.pillLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.huge,
    gap: spacing.lg,
  },
  hero: {
    borderRadius: 32,
    padding: spacing.xxxl,
    backgroundColor: '#f6ede2',
    overflow: 'hidden',
    gap: spacing.sm,
  },
  heroGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 200,
    backgroundColor: colors.accentShadow,
    top: -60,
    right: -50,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff7df',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    fontSize: typography.subtitle,
    color: colors.highlightText,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.muted,
  },
  heroBody: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.accentShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  heroCounters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  counter: {
    flex: 1,
    backgroundColor: '#ffffffaa',
    paddingVertical: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  counterLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  card: {
    borderRadius: 24,
    backgroundColor: colors.panel,
    padding: spacing.xl,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.muted,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flexBasis: '48%',
    backgroundColor: colors.optionBackground,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  statHint: {
    fontSize: 12,
    color: colors.muted,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickCard: {
    flexBasis: '48%',
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickTitle: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  moodBubble: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.optionBackground,
    paddingVertical: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  moodEmoji: {
    fontSize: 22,
  },
  moodTick: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  moodLabel: {
    color: colors.muted,
    marginTop: spacing.xs,
    fontSize: 12,
  },
  dailyTasks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  taskCard: {
    flexBasis: '48%',
    borderRadius: 18,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskCardDone: {
    borderColor: colors.primary,
    shadowColor: colors.accentShadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  taskSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginVertical: spacing.xs,
  },
  taskStatus: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  dayChips: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  dayChip: {
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.optionBackground,
    borderWidth: 1,
    borderColor: colors.border,
    width: 200,
  },
  dayChipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  dayChipSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  footerCard: {
    borderRadius: 28,
    padding: spacing.xl,
    backgroundColor: '#f0f5ff',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#dbe6ff',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  footerBody: {
    fontSize: 13,
    color: colors.muted,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
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
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  mascot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  mascotEmoji: {
    fontSize: 28,
  },
  mascotText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  pillLabel: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  feedback: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    right: spacing.xl,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  feedbackText: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '80%',
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
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  sliderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sliderDot: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.optionBackground,
  },
  sliderDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sliderNumber: {
    color: colors.text,
    fontWeight: '600',
  },
  sliderNumberActive: {
    color: '#fff',
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  emotionCard: {
    width: '30%',
    borderRadius: 14,
    padding: spacing.md,
    backgroundColor: colors.optionBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emotionCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#e7f6f1',
  },
  emotionEmoji: {
    fontSize: 22,
  },
  emotionLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  situationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  situationChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.optionBackground,
  },
  situationChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#e2f7f3',
  },
  situationText: {
    color: colors.text,
    fontWeight: '600',
  },
  situationTextActive: {
    color: colors.text,
  },
  textInput: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
    color: colors.text,
    backgroundColor: colors.optionBackground,
    marginBottom: spacing.md,
  },
  motivationLine: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  motivationDot: {
    color: colors.accent,
    fontWeight: '700',
  },
  replacementList: {
    gap: spacing.sm,
  },
  replacementItem: {
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.optionBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  replacementTitle: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  replacementDetail: {
    color: colors.muted,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});

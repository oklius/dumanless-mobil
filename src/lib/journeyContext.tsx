import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import days from './days';
import { recordNonMemberAction } from './paywallGate';

const STORAGE_KEY = 'dumanless:journey';
const WEEK_DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

type MoodState = { emoji: string; label: string } | null;

type DailyTasks = {
  positive: boolean;
  mood: boolean;
  article: boolean;
  reflection: boolean;
};

export type TriggerLog = {
  intensity: number;
  emotion: string;
  situation: string;
  createdAt: string;
};

type JourneyState = {
  startDate: string;
  completedDays: number[];
  triggerLogs: TriggerLog[];
  moods: Record<string, MoodState>;
  dailyTasks: DailyTasks;
  trackerCounts: {
    urges: number;
    wins: number;
    smoked: number;
    breath: number;
    notes: number;
  };
  notes: { text: string; createdAt: string }[];
};

type JourneyValue = {
  state: JourneyState;
  hydrated: boolean;
  currentDay: number;
  elapsed: { days: number; hours: number; minutes: number };
  stats: {
    moneySaved: number;
    cigarettesSkipped: number;
    timeSavedMinutes: number;
    lifeGainedMinutes: number;
  };
  paywallTriggerId: number;
  markDayComplete: (day: number) => void;
  logTrigger: (log: Omit<TriggerLog, 'createdAt'>) => void;
  logCrisisWin: () => void;
  logSmoked: () => void;
  addNote: (text: string) => void;
  incrementBreath: () => void;
  setMoodForDay: (day: string, mood: MoodState) => void;
  toggleTask: (task: keyof DailyTasks) => void;
  resetDailyTasks: () => void;
  setStartToday: () => void;
};

const defaultMoods: Record<string, MoodState> = WEEK_DAYS.reduce((acc, day) => {
  acc[day] = null;
  return acc;
}, {} as Record<string, MoodState>);

const defaultStartDate = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();

const defaultState: JourneyState = {
  startDate: defaultStartDate,
  completedDays: [],
  triggerLogs: [],
  moods: defaultMoods,
  dailyTasks: {
    positive: false,
    mood: false,
    article: false,
    reflection: false,
  },
  trackerCounts: {
    urges: 0,
    wins: 0,
    smoked: 0,
    breath: 0,
    notes: 0,
  },
  notes: [],
};

const JourneyContext = createContext<JourneyValue | undefined>(undefined);

function computeCurrentDay(startIso: string) {
  const start = new Date(startIso).getTime();
  const now = Date.now();
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diff, 1), days.length);
}

function computeElapsed(startIso: string) {
  const start = new Date(startIso).getTime();
  const now = Date.now();
  const ms = now - start;
  const totalMinutes = Math.max(Math.floor(ms / 60000), 0);
  const daysElapsed = Math.floor(totalMinutes / (60 * 24));
  const hoursElapsed = Math.floor((totalMinutes - daysElapsed * 24 * 60) / 60);
  const minutesElapsed = totalMinutes % 60;
  return { days: daysElapsed, hours: hoursElapsed, minutes: minutesElapsed };
}

function calculateStats(elapsedDays: number) {
  const cigarettesPerDay = 12;
  const pricePerPack = 70;
  const cigarettesPerPack = 20;
  const perCigPrice = pricePerPack / cigarettesPerPack;
  const totalCigs = Math.max(elapsedDays, 1) * cigarettesPerDay;
  const moneySaved = Math.round(totalCigs * perCigPrice);
  const timeSavedMinutes = totalCigs * 6; // ortalama 6 dakika
  const lifeGainedMinutes = Math.round(totalCigs * 11); // bilimsel tahmini değer
  return { moneySaved, cigarettesSkipped: totalCigs, timeSavedMinutes, lifeGainedMinutes };
}

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<JourneyState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [paywallTriggerId, setPaywallTriggerId] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as JourneyState;
          setState((prev) => ({
            ...prev,
            ...parsed,
            moods: { ...defaultMoods, ...parsed.moods },
            dailyTasks: { ...prev.dailyTasks, ...parsed.dailyTasks },
          }));
        } else {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
        }
      } catch {
        setState(defaultState);
      } finally {
        setHydrated(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const currentDay = useMemo(() => computeCurrentDay(state.startDate), [state.startDate]);
  const elapsed = useMemo(() => computeElapsed(state.startDate), [state.startDate]);
  const stats = useMemo(() => calculateStats(elapsed.days || 1), [elapsed.days]);

  const updateState = (updater: (prev: JourneyState) => JourneyState) => {
    setState((prev) => updater(prev));
  };

  const handleNonMemberAction = (reason: string) => {
    void recordNonMemberAction(reason).then((shouldTrigger) => {
      if (shouldTrigger) {
        setPaywallTriggerId((prev) => prev + 1);
      }
    });
  };

  const markDayComplete = (day: number) => {
    if (day > currentDay) return;
    updateState((prev) => {
      if (prev.completedDays.includes(day)) return prev;
      return { ...prev, completedDays: [...prev.completedDays, day] };
    });
  };

  const logTrigger = (log: Omit<TriggerLog, 'createdAt'>) => {
    updateState((prev) => ({
      ...prev,
      triggerLogs: [...prev.triggerLogs, { ...log, createdAt: new Date().toISOString() }],
      trackerCounts: { ...prev.trackerCounts, urges: prev.trackerCounts.urges + 1 },
    }));
    handleNonMemberAction('trigger');
  };

  const logCrisisWin = () => {
    updateState((prev) => ({
      ...prev,
      trackerCounts: { ...prev.trackerCounts, wins: prev.trackerCounts.wins + 1 },
    }));
    handleNonMemberAction('crisisWin');
  };

  const logSmoked = () => {
    updateState((prev) => ({
      ...prev,
      trackerCounts: { ...prev.trackerCounts, smoked: prev.trackerCounts.smoked + 1 },
    }));
    handleNonMemberAction('smoked');
  };

  const addNote = (text: string) => {
    updateState((prev) => ({
      ...prev,
      notes: [...prev.notes, { text, createdAt: new Date().toISOString() }],
      trackerCounts: { ...prev.trackerCounts, notes: prev.trackerCounts.notes + 1 },
    }));
    handleNonMemberAction('note');
  };

  const incrementBreath = () => {
    updateState((prev) => ({
      ...prev,
      trackerCounts: { ...prev.trackerCounts, breath: prev.trackerCounts.breath + 1 },
    }));
    handleNonMemberAction('breath');
  };

  const setMoodForDay = (day: string, mood: MoodState) => {
    updateState((prev) => ({
      ...prev,
      moods: { ...prev.moods, [day]: mood },
    }));
  };

  const toggleTask = (task: keyof DailyTasks) => {
    updateState((prev) => ({
      ...prev,
      dailyTasks: { ...prev.dailyTasks, [task]: !prev.dailyTasks[task] },
    }));
    handleNonMemberAction(`task:${task}`);
  };

  const resetDailyTasks = () => {
    updateState((prev) => ({
      ...prev,
      dailyTasks: { ...defaultState.dailyTasks },
    }));
  };

  const setStartToday = () => {
    const now = new Date().toISOString();
    updateState((prev) => ({
      ...prev,
      startDate: now,
      completedDays: [],
    }));
  };

  const value: JourneyValue = {
    state,
    hydrated,
    currentDay,
    elapsed,
    stats,
    paywallTriggerId,
    markDayComplete,
    logTrigger,
    logCrisisWin,
    logSmoked,
    addNote,
    incrementBreath,
    setMoodForDay,
    toggleTask,
    resetDailyTasks,
    setStartToday,
  };

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) {
    throw new Error('useJourney must be used within JourneyProvider');
  }
  return ctx;
}

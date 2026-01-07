import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'dumanless:triggered-stats';

type Stats = {
  todayCount: number;
  totalSessions: number;
  lastSessionAt?: string;
  date: string;
};

const defaultStats: Stats = {
  todayCount: 0,
  totalSessions: 0,
  lastSessionAt: undefined,
  date: getTodayKey(),
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function useTriggeredStats() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!stored) return;
        const parsed: Stats = JSON.parse(stored);
        if (parsed.date !== getTodayKey()) {
          setStats({ ...defaultStats, totalSessions: parsed.totalSessions });
          return;
        }
        setStats(parsed);
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  const persist = (next: Stats) => {
    setStats(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const recordSession = () => {
    const today = getTodayKey();
    const base =
      stats.date === today
        ? stats
        : { ...defaultStats, totalSessions: stats.totalSessions, date: today };
    const next: Stats = {
      ...base,
      todayCount: base.todayCount + 1,
      totalSessions: base.totalSessions + 1,
      lastSessionAt: new Date().toISOString(),
    };
    persist(next);
  };

  const quickWin = () => {
    const today = getTodayKey();
    const base =
      stats.date === today
        ? stats
        : { ...defaultStats, totalSessions: stats.totalSessions, date: today };
    const next: Stats = {
      ...base,
      todayCount: base.todayCount + 1,
      lastSessionAt: new Date().toISOString(),
    };
    persist(next);
  };

  return { stats, hydrated, recordSession, quickWin };
}

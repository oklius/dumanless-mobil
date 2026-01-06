import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_QUIT_START = 'appInside:quitStartDate';
const KEY_COMPLETED_DAYS = 'appInside:completedDays';
const KEY_TRIGGERS = 'appInside:triggersCount';

function parseNumberArray(value: string | null): number[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((n) => typeof n === 'number');
    }
    return [];
  } catch {
    return [];
  }
}

export async function getQuitStartDate(): Promise<string | null> {
  return AsyncStorage.getItem(KEY_QUIT_START);
}

export async function setQuitStartDate(dateIso: string): Promise<void> {
  await AsyncStorage.setItem(KEY_QUIT_START, dateIso);
}

export async function getCompletedDays(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(KEY_COMPLETED_DAYS);
  return parseNumberArray(raw);
}

export async function toggleDayComplete(dayNumber: number): Promise<number[]> {
  const current = await getCompletedDays();
  const exists = current.includes(dayNumber);
  const next = exists ? current.filter((d) => d !== dayNumber) : [...current, dayNumber];
  await AsyncStorage.setItem(KEY_COMPLETED_DAYS, JSON.stringify(next));
  return next;
}

export async function incrementTriggersCount(): Promise<number> {
  const current = await getTriggersCount();
  const next = current + 1;
  await AsyncStorage.setItem(KEY_TRIGGERS, JSON.stringify(next));
  return next;
}

export async function getTriggersCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEY_TRIGGERS);
  if (!raw) return 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function computeCurrentDay(startIso: string | null): number {
  if (!startIso) return 1;
  const start = new Date(startIso).getTime();
  const now = Date.now();
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diff, 1), 60);
}

export function computeLongestStreak(completed: number[]): number {
  const set = new Set(completed);
  let longest = 0;
  let current = 0;
  for (let i = 1; i <= 60; i += 1) {
    if (set.has(i)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

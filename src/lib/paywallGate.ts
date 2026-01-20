import AsyncStorage from '@react-native-async-storage/async-storage';

import { getMembershipStatus } from './membership';

const DEBUG_LOGS = process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true';

const COUNT_KEY = 'dumanless:paywall:count';
const THRESHOLD_KEY = 'dumanless:paywall:threshold';
const MIN_ACTIONS = 3;
const MAX_ACTIONS = 5;

const getRandomThreshold = () =>
  Math.floor(Math.random() * (MAX_ACTIONS - MIN_ACTIONS + 1)) + MIN_ACTIONS;

export async function recordNonMemberAction(reason: string): Promise<boolean> {
  const membership = await getMembershipStatus();
  if (membership?.isActive) {
    return false;
  }

  const rawCount = await AsyncStorage.getItem(COUNT_KEY);
  const rawThreshold = await AsyncStorage.getItem(THRESHOLD_KEY);
  const count = rawCount ? Number.parseInt(rawCount, 10) || 0 : 0;
  const threshold = rawThreshold ? Number.parseInt(rawThreshold, 10) || getRandomThreshold() : getRandomThreshold();

  const nextCount = count + 1;
  if (nextCount >= threshold) {
    const nextThreshold = getRandomThreshold();
    await AsyncStorage.multiSet([
      [COUNT_KEY, '0'],
      [THRESHOLD_KEY, String(nextThreshold)],
    ]);
    if (DEBUG_LOGS) {
      console.warn('Paywall trigger', { reason, count: nextCount, threshold });
    }
    return true;
  }

  await AsyncStorage.multiSet([
    [COUNT_KEY, String(nextCount)],
    [THRESHOLD_KEY, String(threshold)],
  ]);
  if (DEBUG_LOGS) {
    console.log('Paywall counter', { reason, count: nextCount, threshold });
  }
  return false;
}

export async function resetPaywallCounter() {
  await AsyncStorage.multiRemove([COUNT_KEY, THRESHOLD_KEY]);
}

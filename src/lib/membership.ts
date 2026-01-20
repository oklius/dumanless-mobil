import AsyncStorage from '@react-native-async-storage/async-storage';

export type MembershipStatus = {
  isActive: boolean;
  source: 'web' | 'revenuecat' | 'none';
};

const STORAGE_KEY = 'dumanless:membership';

export async function setMembershipStatus(status: MembershipStatus) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

export async function getMembershipStatus(): Promise<MembershipStatus | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as MembershipStatus;
  } catch {
    return null;
  }
}

import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

import App from './App';

let revenueCatConfigured = false;

const configureRevenueCat = async () => {
  if (revenueCatConfigured) return;
  if (Platform.OS !== 'ios') return;

  const revenueCatApiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
  if (!revenueCatApiKey) {
    if (__DEV__) {
      throw new Error('Missing EXPO_PUBLIC_REVENUECAT_IOS_API_KEY');
    }
    console.warn('RevenueCat: Missing EXPO_PUBLIC_REVENUECAT_IOS_API_KEY; purchases disabled.');
    return;
  }

  revenueCatConfigured = true;
  Purchases.configure({ apiKey: revenueCatApiKey });

  if (__DEV__) {
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      const packageCount = current?.availablePackages?.length ?? 0;
      console.log('RevenueCat offerings current:', current?.identifier ?? 'none');
      console.log('RevenueCat offerings packages:', packageCount);
      if (!current || packageCount === 0) {
        console.warn(
          'RevenueCat: No offerings available. Apple may not be serving products yet (metadata missing or not submitted).',
        );
      }
    } catch (error) {
      console.warn('RevenueCat debug offerings fetch failed:', error);
    }
  }
};

void configureRevenueCat();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

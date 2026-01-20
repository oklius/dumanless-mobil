import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

import App from './App';

const DEBUG_LOGS = process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true';

let revenueCatConfigured = false;

const setupGlobalErrorLogging = () => {
  if (!DEBUG_LOGS) return;

  const globalAny = globalThis as any;
  const errorUtils = globalAny?.ErrorUtils;
  const previousHandler = errorUtils?.getGlobalHandler?.();

  if (errorUtils?.setGlobalHandler) {
    errorUtils.setGlobalHandler((error: unknown, isFatal?: boolean) => {
      if (error instanceof Error) {
        console.error('UnhandledError', { message: error.message, stack: error.stack, isFatal });
      } else {
        console.error('UnhandledError', { error, isFatal });
      }
      if (typeof previousHandler === 'function') {
        previousHandler(error, isFatal);
      }
    });
  }

  const previousRejectionHandler = globalAny?.onunhandledrejection;
  globalAny.onunhandledrejection = (event: any) => {
    const reason = event?.reason ?? event;
    if (reason instanceof Error) {
      console.error('UnhandledPromiseRejection', { message: reason.message, stack: reason.stack });
    } else {
      console.error('UnhandledPromiseRejection', { reason });
    }
    if (typeof previousRejectionHandler === 'function') {
      previousRejectionHandler(event);
    }
  };
};

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

  if (DEBUG_LOGS) {
    console.log('RevenueCat: configure start');
  }
  revenueCatConfigured = true;
  try {
    Purchases.configure({ apiKey: revenueCatApiKey });
    if (DEBUG_LOGS) {
      console.log('RevenueCat: configure success');
    }
  } catch (error) {
    console.warn('RevenueCat: configure failed', error);
    return;
  }

  if (DEBUG_LOGS) {
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
      const customerInfo = await Purchases.getCustomerInfo();
      const activeEntitlements = Object.keys(customerInfo.entitlements.active ?? {});
      console.log('RevenueCat entitlements active:', activeEntitlements);
    } catch (error) {
      console.warn('RevenueCat debug offerings fetch failed:', error);
    }
  }
};

setupGlobalErrorLogging();
void configureRevenueCat();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

import React, { useEffect, useRef } from 'react';
import { NavigationContainer, type NavigationContainerRef, type NavigationState } from '@react-navigation/native';

import RootNavigator from './src/navigation/RootNavigator';
import { JourneyProvider, useJourney } from './src/lib/journeyContext';
import { getSupabase } from './src/lib/supabase';
import { setMembershipStatus } from './src/lib/membership';
import { resetPaywallCounter } from './src/lib/paywallGate';
import type { RootStackParamList } from './src/navigation/RootNavigator';

const DEBUG_LOGS = process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true';

const redactEmail = (value?: string | null) => {
  if (!value) return 'unknown';
  const [name, domain] = value.split('@');
  if (!domain) return 'unknown';
  const safeName = name.length <= 2 ? `${name[0] ?? ''}*` : `${name.slice(0, 2)}***`;
  return `${safeName}@${domain}`;
};

const getActiveRouteName = (state?: NavigationState): string | undefined => {
  if (!state) return undefined;
  const route = state.routes[state.index ?? 0] as any;
  if (route?.state) {
    return getActiveRouteName(route.state as NavigationState);
  }
  return route?.name;
};

function PaywallGateWatcher({
  navigationRef,
}: {
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList>>;
}) {
  const { paywallTriggerId } = useJourney();
  const lastTriggerRef = useRef(0);

  useEffect(() => {
    if (!paywallTriggerId || paywallTriggerId === lastTriggerRef.current) return;
    lastTriggerRef.current = paywallTriggerId;
    if (DEBUG_LOGS) {
      console.warn('PaywallGate: navigating to Gate');
    }
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name: 'Gate', params: { forcedPaywall: true } }],
    });
  }, [paywallTriggerId, navigationRef]);

  return null;
}

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const lastRouteNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!DEBUG_LOGS) return;
    const client = getSupabase();
    if (!client) {
      console.warn('Supabase: client not configured');
      return;
    }
    console.log('Supabase: attaching auth listener');
    const { data } = client.auth.onAuthStateChange((event, session) => {
      console.log('Supabase auth state change', {
        event,
        hasSession: Boolean(session),
        userId: session?.user?.id ?? null,
        email: redactEmail(session?.user?.email ?? null),
      });
      if (event === 'SIGNED_OUT' || !session) {
        void (async () => {
          await setMembershipStatus({ isActive: false, source: 'none' });
          await resetPaywallCounter();
          if (DEBUG_LOGS) {
            console.log('Supabase: cleared membership and paywall counter');
          }
        })();
      }
    });
    return () => {
      data?.subscription?.unsubscribe();
      console.log('Supabase: auth listener detached');
    };
  }, []);

  return (
    <JourneyProvider>
      <PaywallGateWatcher navigationRef={navigationRef} />
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          if (!DEBUG_LOGS) return;
          const currentRoute = getActiveRouteName(navigationRef.current?.getRootState());
          lastRouteNameRef.current = currentRoute;
          console.log('Navigation ready', { route: currentRoute ?? 'unknown' });
        }}
        onStateChange={(state) => {
          if (!DEBUG_LOGS) return;
          const previousRoute = lastRouteNameRef.current;
          const currentRoute = getActiveRouteName(state);
          if (currentRoute && previousRoute !== currentRoute) {
            console.log('Navigation route change', {
              from: previousRoute ?? 'unknown',
              to: currentRoute,
              index: state?.index,
              routeCount: state?.routes?.length,
            });
            if (['Welcome', 'Gate', 'Home', 'Hub'].includes(currentRoute)) {
              console.warn('Navigation landed on', currentRoute);
            }
          }
          lastRouteNameRef.current = currentRoute;
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </JourneyProvider>
  );
}

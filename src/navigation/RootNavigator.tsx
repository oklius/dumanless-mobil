import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccessGateScreen from '../app/AccessGateScreen';
import DayScreen from '../app/DayScreen';
import LoginScreen from '../app/LoginScreen';
import PaywallScreen from '../app/PaywallScreen';
import QuizResultScreen from '../app/QuizResultScreen';
import QuizScreen from '../app/QuizScreen';
import ProgressScreen from '../app/ProgressScreen';
import TipsScreen from '../app/TipsScreen';
import TriggerModeScreen from '../app/TriggerModeScreen';
import TrophiesScreen from '../app/TrophiesScreen';
import WelcomeScreen from '../app/WelcomeScreen';
import AppTabs from './AppTabs';

export type RootStackParamList = {
  Gate: { forcedPaywall?: boolean } | undefined;
  Welcome: undefined;
  Login: { prefillEmail?: string; codeSent?: boolean } | undefined;
  Paywall: undefined;
  Quiz: undefined;
  QuizResult: { answered?: number; answers?: Record<string, string[]> } | undefined;
  Hub: undefined;
  Day: { dayNumber: number };
  Emergency: undefined;
  Progress: undefined;
  Trophies: undefined;
  Tips: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Gate">
      <Stack.Screen name="Gate" component={AccessGateScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Giriş Yap' }} />
      <Stack.Screen name="Paywall" component={PaywallScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} options={{ title: 'Quiz Sonucu' }} />
      <Stack.Screen name="Hub" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Day" component={DayScreen} options={{ title: 'Gün' }} />
      <Stack.Screen
        name="Emergency"
        component={TriggerModeScreen}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'İlerleme' }} />
      <Stack.Screen name="Trophies" component={TrophiesScreen} options={{ title: 'Rozetler' }} />
      <Stack.Screen name="Tips" component={TipsScreen} options={{ title: 'Bilgi' }} />
    </Stack.Navigator>
  );
}

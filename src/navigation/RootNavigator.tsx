import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../app/HomeScreen';
import LoginScreen from '../app/LoginScreen';
import PaywallScreen from '../app/PaywallScreen';
import AppInsideHubScreen from '../app/AppInsideHubScreen';
import DayScreen from '../app/DayScreen';
import QuizScreen from '../app/QuizScreen';
import ResultScreen from '../app/ResultScreen';
import TriggerModeScreen from '../app/TriggerModeScreen';
import MiniToolsScreen from '../app/MiniToolsScreen';
import ProgressScreen from '../app/ProgressScreen';
import WelcomeScreen from '../app/WelcomeScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Home: undefined;
  Quiz: undefined;
  Result: { id: string };
  Paywall: undefined;
  AppInsideHub: undefined;
  Day: { dayNumber: number };
  TriggerMode: undefined;
  MiniTools: { mode?: 'game' | 'music' | 'breath' } | undefined;
  Progress: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="AppInsideHub" component={AppInsideHubScreen} />
      <Stack.Screen name="Day" component={DayScreen} />
      <Stack.Screen name="TriggerMode" component={TriggerModeScreen} />
      <Stack.Screen name="MiniTools" component={MiniToolsScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

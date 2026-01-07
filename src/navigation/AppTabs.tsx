import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import BreathingSessionScreen from '../app/BreathingSessionScreen';
import DaysOverviewScreen from '../app/DaysOverviewScreen';
import HomeScreen from '../app/HomeScreen';
import ProfileScreen from '../app/ProfileScreen';
import ToolsScreen from '../app/ToolsScreen';
import TriggeredScreen from '../app/TriggeredScreen';
import { colors } from '../theme/colors';

export type AppTabParamList = {
  HubTab: undefined;
  DaysTab: undefined;
  TriggeredTab: undefined;
  ToolsTab: undefined;
  ProfileTab: undefined;
};

export type BreathPattern = {
  inhale: number;
  hold: number;
  exhale: number;
  title?: string;
};

export type TriggeredStackParamList = {
  TriggeredMain: undefined;
  BreathingSession: { pattern?: BreathPattern; duration?: number; source?: 'triggered' | 'tools' };
};

export type ToolsStackParamList = {
  ToolsMain: { open?: 'focus' | 'audio' | 'breath' } | undefined;
  BreathingSession: { pattern?: BreathPattern; duration?: number; source?: 'triggered' | 'tools' };
};

const Tab = createBottomTabNavigator<AppTabParamList>();
const TriggeredStack = createNativeStackNavigator<TriggeredStackParamList>();
const ToolsStack = createNativeStackNavigator<ToolsStackParamList>();
const HubStack = createNativeStackNavigator();
const DaysStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function TriggeredStackScreen() {
  return (
    <TriggeredStack.Navigator screenOptions={{ headerShown: false }}>
      <TriggeredStack.Screen name="TriggeredMain" component={TriggeredScreen} />
      <TriggeredStack.Screen name="BreathingSession" component={BreathingSessionScreen} />
    </TriggeredStack.Navigator>
  );
}

function ToolsStackScreen() {
  return (
    <ToolsStack.Navigator screenOptions={{ headerShown: false }}>
      <ToolsStack.Screen name="ToolsMain" component={ToolsScreen} />
      <ToolsStack.Screen name="BreathingSession" component={BreathingSessionScreen} />
    </ToolsStack.Navigator>
  );
}

function HubStackScreen() {
  return (
    <HubStack.Navigator screenOptions={{ headerShown: false }}>
      <HubStack.Screen name="HubHome" component={HomeScreen} />
    </HubStack.Navigator>
  );
}

function DaysStackScreen() {
  return (
    <DaysStack.Navigator screenOptions={{ headerShown: false }}>
      <DaysStack.Screen name="DaysHome" component={DaysOverviewScreen} />
    </DaysStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.panel,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'HubTab') iconName = 'home-outline';
          if (route.name === 'DaysTab') iconName = 'calendar-outline';
          if (route.name === 'TriggeredTab') iconName = 'flash-outline';
          if (route.name === 'ToolsTab') iconName = 'headset-outline';
          if (route.name === 'ProfileTab') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HubTab" component={HubStackScreen} options={{ title: 'Merkez' }} />
      <Tab.Screen name="DaysTab" component={DaysStackScreen} options={{ title: 'Günler' }} />
      <Tab.Screen name="TriggeredTab" component={TriggeredStackScreen} options={{ title: 'Tetiklendim' }} />
      <Tab.Screen name="ToolsTab" component={ToolsStackScreen} options={{ title: 'Araçlar' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

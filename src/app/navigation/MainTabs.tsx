import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '@/design-system';

import { GuidanceStack } from './stacks/GuidanceStack';
import { InsightsStack } from './stacks/InsightsStack';
import { LoggingStack } from './stacks/LoggingStack';
import { SettingsStack } from './stacks/SettingsStack';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tab.Screen name="Logging" component={LoggingStack} />
      <Tab.Screen name="Insights" component={InsightsStack} />
      <Tab.Screen name="Guidance" component={GuidanceStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

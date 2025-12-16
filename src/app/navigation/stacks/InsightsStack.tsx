import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { InsightsScreen } from '@/screens/InsightsScreen';

import type { InsightsStackParamList } from '../types';

const Stack = createNativeStackNavigator<InsightsStackParamList>();

export function InsightsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="InsightsHome" component={InsightsScreen} options={{ title: 'Insights' }} />
    </Stack.Navigator>
  );
}

import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GuidanceScreen } from '@/screens/GuidanceScreen';

import type { GuidanceStackParamList } from '../types';

const Stack = createNativeStackNavigator<GuidanceStackParamList>();

export function GuidanceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GuidanceHome" component={GuidanceScreen} options={{ title: 'Guidance' }} />
    </Stack.Navigator>
  );
}

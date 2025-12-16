import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoggingScreen } from '@/screens/LoggingScreen';

import type { LoggingStackParamList } from '../types';

const Stack = createNativeStackNavigator<LoggingStackParamList>();

export function LoggingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoggingHome" component={LoggingScreen} options={{ title: 'Logging' }} />
    </Stack.Navigator>
  );
}

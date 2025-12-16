import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { databaseService } from '../src/services/database';

export default function RootLayout() {
  useEffect(() => {
    databaseService.initialize().catch(error => {
      console.error('Failed to initialize database:', error);
    });
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'SmokeSense' }} />
      <Stack.Screen 
        name="log-detail" 
        options={{ 
          title: 'Log Details',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="budget-settings" 
        options={{ title: 'Budget Settings' }} 
      />
    </Stack>
  );
}

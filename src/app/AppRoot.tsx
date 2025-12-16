import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from '@/design-system';
import { DataLayerProvider } from '@/services/db/DataLayerProvider';
import { createDataLayer, type DataLayer } from '@/services/db/dataLayer';

import { RootNavigator } from './navigation/RootNavigator';

function AppBootstrap() {
  const theme = useTheme();
  const [dataLayer, setDataLayer] = useState<DataLayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const layer = await createDataLayer();
      if (!cancelled) setDataLayer(layer);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!dataLayer) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <DataLayerProvider dataLayer={dataLayer}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <SafeAreaProvider>
          <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </DataLayerProvider>
  );
}

export function AppRoot() {
  return (
    <ThemeProvider>
      <AppBootstrap />
    </ThemeProvider>
  );
}

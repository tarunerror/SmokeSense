import React from 'react';
import { View } from 'react-native';

import { useTheme, type ThemeMode } from '@/design-system';
import { Button, Card, Text } from '@/components/ui';
import { useAppStore } from '@/store/appStore';

export function SettingsScreen() {
  const theme = useTheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);

  const setMode = (mode: ThemeMode) => () => setThemeMode(mode);

  return (
    <View style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Card>
        <Text variant="subtitle" style={{ marginBottom: theme.spacing.sm }}>
          Settings
        </Text>
        <Text muted style={{ marginBottom: theme.spacing.lg }}>
          Theme mode: {themeMode}
        </Text>

        <View>
          <View style={{ marginBottom: theme.spacing.sm }}>
            <Button
              label="System"
              variant={themeMode === 'system' ? 'primary' : 'secondary'}
              onPress={setMode('system')}
            />
          </View>
          <View style={{ marginBottom: theme.spacing.sm }}>
            <Button
              label="Light"
              variant={themeMode === 'light' ? 'primary' : 'secondary'}
              onPress={setMode('light')}
            />
          </View>
          <Button
            label="Dark"
            variant={themeMode === 'dark' ? 'primary' : 'secondary'}
            onPress={setMode('dark')}
          />
        </View>
      </Card>
    </View>
  );
}

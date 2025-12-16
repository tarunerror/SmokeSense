import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/design-system';
import { Card, Text } from '@/components/ui';

export function GuidanceScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Card>
        <Text variant="subtitle" style={{ marginBottom: theme.spacing.sm }}>
          Guidance
        </Text>
        <Text muted>
          Placeholder route. Future AI modules can plug into typed repositories and produce suggestions
          without judgment.
        </Text>
      </Card>
    </View>
  );
}

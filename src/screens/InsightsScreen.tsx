import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/design-system';
import { Card, Meter, Text } from '@/components/ui';

export function InsightsScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Card>
        <Text variant="subtitle" style={{ marginBottom: theme.spacing.sm }}>
          Insights
        </Text>
        <Text muted style={{ marginBottom: theme.spacing.lg }}>
          Placeholder route. Keep insights supportive and non-shaming.
        </Text>

        <Text style={{ marginBottom: theme.spacing.sm }}>Consistency</Text>
        <Meter value={0.35} tone="supportive" />
      </Card>
    </View>
  );
}

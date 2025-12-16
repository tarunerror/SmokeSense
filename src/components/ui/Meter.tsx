import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useTheme } from '@/design-system';

type Props = {
  value: number;
  tone?: 'primary' | 'supportive' | 'warning' | 'danger';
  style?: StyleProp<ViewStyle>;
};

export function Meter({ value, tone = 'primary', style }: Props) {
  const theme = useTheme();

  const clamped = useMemo(() => Math.min(1, Math.max(0, value)), [value]);

  const fillColor =
    tone === 'supportive'
      ? theme.colors.supportive
      : tone === 'warning'
        ? theme.colors.warning
        : tone === 'danger'
          ? theme.colors.danger
          : theme.colors.primary;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      style={[
        {
          height: 10,
          borderRadius: theme.radius.sm,
          backgroundColor: theme.colors.meterTrack,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          backgroundColor: fillColor,
        }}
      />
    </View>
  );
}

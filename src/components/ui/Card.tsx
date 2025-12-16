import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import { useTheme } from '@/design-system';

type Props = ViewProps & {
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ padded = true, style, ...props }: Props) {
  const theme = useTheme();

  const base: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: padded ? theme.spacing.lg : 0,
    shadowColor: theme.shadow.card.shadowColor,
    shadowOpacity: theme.shadow.card.shadowOpacity,
    shadowRadius: theme.shadow.card.shadowRadius,
    elevation: theme.shadow.card.elevation,
  };

  return <View style={[base, style]} {...props} />;
}
